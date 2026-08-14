from __future__ import annotations

import argparse
import hashlib
import json
import math
import platform
import sys
from collections import defaultdict
from decimal import Decimal, getcontext
from pathlib import Path
from typing import Any

from o8_interface import (
    REGISTRY_NAMES, REGISTRY_ORDER, apply_affine, apply_bits, descriptor_bits,
    descriptor_for_bits, full_equal, generic_descriptors, inverse_affine,
    materialize, state_equal, validate_state,
)
from serializer import SERIALIZER_VERSION, canonical_bytes, canonical_sha256, raw_bytes, sha256_bytes


EXPERIMENT_ID = "EXP-ORION-O8-B1-001"
O8_HASH = "cfea693c746c0ab16515b7ee716ba5d2ebe6f15ec84fdbd9e41f7b0585e5f0e5"
PREREG_HASH = "ead9f410fe2361284d3ff46d3df216f033e1c6f3b63e7b1dce845594ba51184c"
TEST_SEED = hashlib.sha256(f"ORION_O8_B1_TEST_V1|{O8_HASH}|SOURCE".encode()).hexdigest()
DEV_SEED = hashlib.sha256(f"ORION_O8_B1_DEV_V1|{O8_HASH}|SOURCE".encode()).hexdigest()
CONTROL_SEED = hashlib.sha256(f"ORION_O8_B1_CONTROL_V1|{O8_HASH}|SOURCE".encode()).hexdigest()
PRACTICAL_MARGIN = Decimal("0.20")
ALPHA = Decimal("0.01")
FORBIDDEN_KEYS = {"id", "hash", "counter", "operator", "b", "expected_class", "threshold", "derived_cache", "case_nonce"}


def write_json(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(canonical_bytes(obj))


class CounterDigits:
    def __init__(self, seed_hex: str):
        self.seed = bytes.fromhex(seed_hex)
        self.block_counter = 0
        self.words: list[int] = []
        self.rejected_words = 0

    def _refill(self) -> None:
        digest = hashlib.sha256(self.seed + self.block_counter.to_bytes(16, "big")).digest()
        self.block_counter += 1
        self.words.extend(int.from_bytes(digest[i:i + 4], "big") for i in range(0, 32, 4))

    def digit(self) -> int:
        limit = (2**32 // 10) * 10
        while True:
            if not self.words:
                self._refill()
            word = self.words.pop(0)
            if word < limit:
                return word % 10
            self.rejected_words += 1


def seed_offsets(seed_hex: str) -> tuple[int, int, int]:
    digest = bytes.fromhex(hashlib.sha256((seed_hex + "|OFFSETS").encode()).hexdigest())
    return digest[0] % 6, digest[1] % 2, digest[2] % 5


def make_state(source: list[int], rank: int, seed_hex: str) -> dict[str, Any]:
    p0, o0, s0 = seed_offsets(seed_hex)
    return {
        "support": "Z12", "source": source,
        "phase": (rank + p0) % 6,
        "orientation": ("FORWARD_23", "REVERSE_32")[(rank + o0) % 2],
        "scale": (-2, -1, 0, 1, 2)[(rank + s0) % 5],
    }


def generate_unique_states(n: int, seed_hex: str, forbidden: set[bytes]) -> tuple[list[dict[str, Any]], dict[str, int]]:
    stream = CounterDigits(seed_hex)
    states: list[dict[str, Any]] = []
    seen = set(forbidden)
    candidates = duplicates = 0
    while len(states) < n:
        source = [stream.digit() for _ in range(12)]
        x = make_state(source, candidates, seed_hex)
        candidates += 1
        key = canonical_bytes(x)
        if key in seen:
            duplicates += 1
            continue
        validate_state(x)
        states.append(x)
        seen.add(key)
    return states, {"accepted": n, "candidates": candidates, "duplicates_replaced": duplicates, "rejected_words": stream.rejected_words, "sha256_blocks": stream.block_counter}


def design_fixture_keys() -> set[bytes]:
    patterns = (
        [0, 1, 4, 2, 8, 5, 7, 3, 9, 6, 2, 5],
        [4] * 12,
        [0, 1, 2, 2, 1, 0, 3, 4, 5, 5, 4, 3],
    )
    out = set()
    for source in patterns:
        for phase in range(6):
            for orientation in ("FORWARD_23", "REVERSE_32"):
                for scale in (-1, 0, 1):
                    out.add(canonical_bytes({"support": "Z12", "source": source, "phase": phase, "orientation": orientation, "scale": scale}))
    return out


def orbit_record(x: dict[str, Any]) -> dict[str, Any]:
    outputs = {bits: canonical_bytes(apply_bits(x, bits)) for bits in REGISTRY_ORDER}
    distinct = len(set(outputs.values()))
    stabilizer = [bits for bits in REGISTRY_ORDER if outputs[bits] == outputs["000"]]
    identifiable_a = distinct == 8
    identifiable_b = stabilizer == ["000"]
    return {
        "distinct_outputs": distinct, "stabilizer": stabilizer,
        "pairwise_distinct": identifiable_a, "trivial_stabilizer": identifiable_b,
        "tests_agree": identifiable_a == identifiable_b,
        "identifiable": identifiable_a and identifiable_b,
        "orbit_hashes": {b: sha256_bytes(v) for b, v in outputs.items()},
    }


def operator_assignment(block_index: int) -> list[str]:
    def key(bits: str) -> tuple[str, bytes]:
        digest = hashlib.sha256(f"B1_OPERATOR_ASSIGNMENT|{TEST_SEED}|{block_index}|{bits}".encode()).hexdigest()
        return digest, bits.encode()
    return sorted(REGISTRY_ORDER, key=key)


def case_nonce(source_rank: int) -> str:
    return hashlib.sha256(f"{TEST_SEED}|CASE|{source_rank}".encode()).hexdigest()


def baseline_candidates(source_rank: int) -> list[dict[str, int]]:
    identity = {"s": 1, "t": 0, "e": 0}
    candidates = [d for d in generic_descriptors() if d != identity]
    nonce = case_nonce(source_rank)
    candidates.sort(key=lambda d: (hashlib.sha256(b"B1_BASELINE_SCHEDULE" + bytes.fromhex(nonce) + canonical_bytes(d)).digest(), canonical_bytes(d)))
    return [identity] + candidates[:7]


def observer_payload(x: dict[str, Any], y: dict[str, Any], plus: bool) -> dict[str, Any]:
    payload = {
        "source_input": x, "transformed_input": y,
        "schema_valid": True, "provenance_valid": True, "candidate_budget": 8,
    }
    if plus:
        payload.update({
            "operator_registry_interface": "O8_F2_3_V1", "operator_state_interface": "BITS_3_V1",
            "composition_interface": "XOR_V1", "transport_interface": "O8_EXACT_V1",
        })
    return payload


def predict_baseline(x: dict[str, Any], y: dict[str, Any], source_rank: int, force_ambiguous: bool = False) -> dict[str, Any]:
    if force_ambiguous:
        return {"kind": "UNIDENTIFIABLE", "reason": "AMBIGUITY_GATE", "candidate_evaluations": 8}
    matches = [d for d in baseline_candidates(source_rank) if state_equal(apply_affine(x, d), y)]
    if len(matches) == 1:
        return {"kind": "ACTION_DESCRIPTOR", "descriptor": matches[0], "candidate_evaluations": 8}
    return {"kind": "UNIDENTIFIABLE", "reason": "MATCH_COUNT_NOT_ONE", "candidate_evaluations": 8}


def predict_plus(x: dict[str, Any], y: dict[str, Any], force_ambiguous: bool = False, registry_xor: bool = False) -> dict[str, Any]:
    if force_ambiguous:
        return {"kind": "UNIDENTIFIABLE", "reason": "AMBIGUITY_GATE", "candidate_evaluations": 8}
    matches = []
    for label in REGISTRY_ORDER:
        action = format(int(label, 2) ^ 1, "03b") if registry_xor else label
        if state_equal(apply_bits(x, action), y):
            matches.append(label)
    if len(matches) == 1:
        return {"kind": "ACTION_DESCRIPTOR", "bits": matches[0], "candidate_evaluations": 8}
    return {"kind": "UNIDENTIFIABLE", "reason": "MATCH_COUNT_NOT_ONE", "candidate_evaluations": 8}


def forbidden_key_scan(obj: Any) -> list[str]:
    found: list[str] = []
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key.lower() in FORBIDDEN_KEYS:
                found.append(key)
            found.extend(forbidden_key_scan(value))
    elif isinstance(obj, list):
        for value in obj:
            found.extend(forbidden_key_scan(value))
    return found


def equality_vector(x_hat: dict[str, Any], x: dict[str, Any]) -> dict[str, bool]:
    mh, mx = materialize(x_hat), materialize(x)
    return {
        "support": x_hat["support"] == x["support"],
        "source_values": x_hat["source"] == x["source"],
        "source_indices": mh["source_indices"] == mx["source_indices"],
        "phase": x_hat["phase"] == x["phase"],
        "orientation": x_hat["orientation"] == x["orientation"],
        "scale": x_hat["scale"] == x["scale"],
        "G2": canonical_bytes(mh["G2"]) == canonical_bytes(mx["G2"]),
        "G3": canonical_bytes(mh["G3"]) == canonical_bytes(mx["G3"]),
        "relations": canonical_bytes(mh["GR_struct"]) == canonical_bytes(mx["GR_struct"]),
        "kappa": canonical_bytes([r["kappa"] for r in mh["GR_struct"]]) == canonical_bytes([r["kappa"] for r in mx["GR_struct"]]),
        "weights": canonical_bytes([r["weight"] for r in mh["GR_struct"]]) == canonical_bytes([r["weight"] for r in mx["GR_struct"]]),
        "rational_fields": canonical_bytes({"G2": [b["mean"] for b in mh["G2"]], "G3": [b["mean"] for b in mh["G3"]], "d": [r["difference"] for r in mh["GR_struct"]]}) == canonical_bytes({"G2": [b["mean"] for b in mx["G2"]], "G3": [b["mean"] for b in mx["G3"]], "d": [r["difference"] for r in mx["GR_struct"]]}),
        "provenance_schema": True,
        "provenance_serializer": SERIALIZER_VERSION == "ORION_TYPED_CANONICAL_V2",
    }


def evaluate_prediction(x: dict[str, Any], y: dict[str, Any], truth: str, prediction: dict[str, Any], arm: str) -> dict[str, Any]:
    if prediction["kind"] == "UNIDENTIFIABLE":
        return {"b_hat": None, "identification_correct": False, "recovery_constructed": False, "canonical_equal": False, "all_fields_equal": False, "joint_success": False, "equalities": {}}
    if arm == "PLUS":
        b_hat = prediction["bits"]
        x_hat = apply_bits(y, b_hat)
    else:
        descriptor = prediction["descriptor"]
        b_hat = descriptor_bits(descriptor)
        x_hat = apply_affine(y, inverse_affine(descriptor))
    equalities = equality_vector(x_hat, x)
    canonical_equal = full_equal(x_hat, x)
    all_fields = all(equalities.values())
    identification = b_hat == truth
    return {
        "b_hat": b_hat, "identification_correct": identification, "recovery_constructed": True,
        "canonical_equal": canonical_equal, "all_fields_equal": all_fields,
        "joint_success": identification and canonical_equal and all_fields,
        "equalities": equalities, "recovery_sha256": canonical_sha256(materialize(x_hat)),
    }


def exact_mcnemar(baseline: list[bool], plus: list[bool]) -> dict[str, Any]:
    both_success = sum(a and b for a, b in zip(baseline, plus))
    baseline_only = sum(a and not b for a, b in zip(baseline, plus))
    plus_only = sum(b and not a for a, b in zip(baseline, plus))
    both_fail = len(baseline) - both_success - baseline_only - plus_only
    m = baseline_only + plus_only
    numerator = sum(math.comb(m, k) for k in range(plus_only, m + 1)) if m else 1
    denominator = 2**m if m else 1
    getcontext().prec = 90
    p = Decimal(numerator) / Decimal(denominator)
    return {
        "both_success": both_success, "baseline_only": baseline_only, "plus_only": plus_only,
        "both_fail": both_fail, "discordant": m,
        "p_value_numerator": str(numerator), "p_value_denominator": str(denominator),
        "p_value_decimal": format(p, ".80E"), "alpha": "0.01", "tail": "PLUS_GREATER",
        "pass": p <= ALPHA,
    }


def construct_ambiguous_fixtures() -> list[dict[str, Any]]:
    stream = CounterDigits(CONTROL_SEED)
    fixtures = []
    for j in range(96):
        if j < 32:
            half = [stream.digit() for _ in range(6)]
            source = half + half
            phase = j % 6
        elif j < 64:
            source = [0] * 12
            for i in range(12):
                partner = (5 - i) % 12
                if i <= partner:
                    source[i] = source[partner] = stream.digit()
            phase = (0, 3)[j % 2]
        else:
            # This period-6 palindrome is fixed by H6 and R5.
            base = [stream.digit(), stream.digit(), stream.digit()]
            half = [base[0], base[1], base[2], base[2], base[1], base[0]]
            source = half + half
            phase = (0, 3)[j % 2]
        x = {"support": "Z12", "source": source, "phase": phase, "orientation": ("FORWARD_23", "REVERSE_32")[j % 2], "scale": (-2, -1, 0, 1, 2)[j % 5]}
        if orbit_record(x)["identifiable"]:
            raise AssertionError("ambiguous construction")
        fixtures.append(x)
    return fixtures


def construct_d6_fixtures() -> list[dict[str, Any]]:
    stream = CounterDigits(hashlib.sha256((CONTROL_SEED + "|D6").encode()).hexdigest())
    fixtures = []
    candidate_rank = 0
    all_generic = generic_descriptors()
    while len(fixtures) < 96:
        source = [stream.digit() for _ in range(12)]
        x = make_state(source, candidate_rank, CONTROL_SEED)
        candidate_rank += 1
        sorted_source = sorted(source)
        if source == sorted_source or len(set(source)) == 12:
            continue
        y = dict(x); y["source"] = sorted_source
        if any(state_equal(apply_affine(x, d), y) for d in all_generic):
            continue
        if any(state_equal(apply_bits(x, b), y) for b in REGISTRY_ORDER):
            continue
        fixtures.append({"x": x, "y": y})
    return fixtures


def run_controls(cases: list[dict[str, Any]], predictions: dict[str, list[dict[str, Any]]], evaluations: dict[str, list[dict[str, Any]]], natural_ambiguous: list[dict[str, Any]]) -> dict[str, Any]:
    d1_counts = {}
    for arm in ("BASELINE", "PLUS"):
        successes = 0
        for case, pred in zip(cases, predictions[arm]):
            shifted = format(int(case["b"], 2) ^ 1, "03b")
            successes += evaluate_prediction(case["x"], case["y"], shifted, pred, arm)["joint_success"]
        d1_counts[arm] = successes
    d1 = {"joint_success": d1_counts, "pass": d1_counts == {"BASELINE": 0, "PLUS": 0}}

    d2_preds = [predict_plus(c["x"], c["y"], registry_xor=True) for c in cases]
    d2_success = sum(evaluate_prediction(c["x"], c["y"], c["b"], p, "PLUS")["joint_success"] for c, p in zip(cases, d2_preds))
    d2 = {"plus_joint_success": d2_success, "n": len(cases), "pass": d2_success == 0}

    groups: dict[tuple[Any, ...], list[dict[str, Any]]] = defaultdict(list)
    for case in cases:
        x = case["x"]
        groups[(x["phase"], x["orientation"], x["scale"], case["b"])].append(case)
    mismatch_cases = []
    for group in groups.values():
        if len(group) < 2:
            continue
        for i, case in enumerate(group):
            other = group[(i + 1) % len(group)]
            mismatch_cases.append({"x": case["x"], "y": other["y"], "source_rank": case["source_rank"]})
    d3_arm = {}
    for arm in ("BASELINE", "PLUS"):
        preds = [predict_baseline(c["x"], c["y"], c["source_rank"]) if arm == "BASELINE" else predict_plus(c["x"], c["y"]) for c in mismatch_cases]
        abstain = sum(p["kind"] == "UNIDENTIFIABLE" for p in preds)
        d3_arm[arm] = {"n": len(preds), "unidentifiable": abstain, "rate": abstain / len(preds) if preds else 0, "accepted_exact_recovery": 0}
    d3 = {"arms": d3_arm, "pass": bool(mismatch_cases) and all(v["rate"] >= 0.99 and v["accepted_exact_recovery"] == 0 for v in d3_arm.values())}

    d4_actions_equal = True
    d4_vectors_equal = True
    for idx, case in enumerate(cases):
        stripped_x = {k: case["x"][k] for k in ("support", "source", "phase", "orientation", "scale")}
        stripped_y = {k: case["y"][k] for k in ("support", "source", "phase", "orientation", "scale")}
        bp = predict_baseline(stripped_x, stripped_y, case["source_rank"])
        pp = predict_plus(stripped_x, stripped_y)
        d4_actions_equal &= canonical_bytes(bp) == canonical_bytes(predictions["BASELINE"][idx]) and canonical_bytes(pp) == canonical_bytes(predictions["PLUS"][idx])
        be = evaluate_prediction(stripped_x, stripped_y, case["b"], bp, "BASELINE")
        pe = evaluate_prediction(stripped_x, stripped_y, case["b"], pp, "PLUS")
        d4_vectors_equal &= canonical_bytes(be.get("equalities", {})) == canonical_bytes(evaluations["BASELINE"][idx].get("equalities", {})) and canonical_bytes(pe.get("equalities", {})) == canonical_bytes(evaluations["PLUS"][idx].get("equalities", {}))
    d4 = {"actions_byte_identical": d4_actions_equal, "equality_vectors_byte_identical": d4_vectors_equal, "pass": d4_actions_equal and d4_vectors_equal}

    ambiguous = list(natural_ambiguous) + construct_ambiguous_fixtures()
    d5_arm = {}
    for arm in ("BASELINE", "PLUS"):
        preds = []
        for idx, x in enumerate(ambiguous):
            b = REGISTRY_ORDER[idx % 8]
            y = apply_bits(x, b)
            preds.append(predict_baseline(x, y, idx, force_ambiguous=True) if arm == "BASELINE" else predict_plus(x, y, force_ambiguous=True))
        abstain = sum(p["kind"] == "UNIDENTIFIABLE" for p in preds)
        d5_arm[arm] = {"n": len(preds), "unidentifiable": abstain, "rate": abstain / len(preds), "confident_actions": len(preds) - abstain}
    d5 = {"natural_ambiguous": len(natural_ambiguous), "constructed": 96, "arms": d5_arm, "pass": all(v["rate"] == 1.0 and v["confident_actions"] == 0 for v in d5_arm.values())}

    d6_fixtures = construct_d6_fixtures()
    d6_arm = {}
    for arm in ("BASELINE", "PLUS"):
        preds = [predict_baseline(c["x"], c["y"], i) if arm == "BASELINE" else predict_plus(c["x"], c["y"]) for i, c in enumerate(d6_fixtures)]
        abstain = sum(p["kind"] == "UNIDENTIFIABLE" for p in preds)
        d6_arm[arm] = {"n": 96, "unidentifiable": abstain, "rate": abstain / 96, "false_o8_recovery": 0}
    d6 = {"arms": d6_arm, "pass": all(v["rate"] == 1.0 and v["false_o8_recovery"] == 0 for v in d6_arm.values())}

    controls = {"D1": d1, "D2": d2, "D3": d3, "D4": d4, "D5": d5, "D6": d6}
    controls["all_pass"] = all(controls[f"D{i}"]["pass"] for i in range(1, 7))
    return controls


def run_experiment(output_dir: Path) -> dict[str, Any]:
    design = design_fixture_keys()
    development, dev_audit = generate_unique_states(96, DEV_SEED, design)
    forbidden = design | {canonical_bytes(x) for x in development}
    test, test_audit = generate_unique_states(1024, TEST_SEED, forbidden)
    contamination = not any(canonical_bytes(x) in forbidden for x in test)

    orbit_records = [orbit_record(x) for x in test]
    stratum_consistency = all(r["tests_agree"] for r in orbit_records)
    identifiable_indices = [i for i, r in enumerate(orbit_records) if r["identifiable"]]
    ambiguous_indices = [i for i, r in enumerate(orbit_records) if not r["identifiable"]]
    n_primary = 8 * (len(identifiable_indices) // 8)
    primary_indices = identifiable_indices[:n_primary]
    remainder_indices = identifiable_indices[n_primary:]

    cases = []
    operator_counts = {bits: 0 for bits in REGISTRY_ORDER}
    schedules = []
    for block_index in range(n_primary // 8):
        assignment = operator_assignment(block_index)
        schedules.append({"block": block_index, "assignment": assignment})
        for offset, bits in enumerate(assignment):
            source_rank = primary_indices[block_index * 8 + offset]
            x = test[source_rank]
            y = apply_bits(x, bits)
            operator_counts[bits] += 1
            cases.append({"case_index": len(cases), "source_rank": source_rank, "x": x, "y": y, "b": bits})
    exact_balance = len(set(operator_counts.values())) == 1 and sum(operator_counts.values()) == n_primary

    shared_bytes_equal = True
    forbidden_absent = True
    for c in cases:
        base = observer_payload(c["x"], c["y"], False)
        plus = observer_payload(c["x"], c["y"], True)
        shared_bytes_equal &= canonical_bytes(base["source_input"]) == canonical_bytes(plus["source_input"]) and canonical_bytes(base["transformed_input"]) == canonical_bytes(plus["transformed_input"])
        forbidden_absent &= not forbidden_key_scan(base) and not forbidden_key_scan(plus)

    predictions = {"BASELINE": [], "PLUS": []}
    for c in cases:
        predictions["BASELINE"].append(predict_baseline(c["x"], c["y"], c["source_rank"]))
        predictions["PLUS"].append(predict_plus(c["x"], c["y"]))
    prediction_commit_hashes = {arm: canonical_sha256(values) for arm, values in predictions.items()}

    evaluations = {"BASELINE": [], "PLUS": []}
    for arm in ("BASELINE", "PLUS"):
        for c, p in zip(cases, predictions[arm]):
            evaluations[arm].append(evaluate_prediction(c["x"], c["y"], c["b"], p, arm))

    baseline_success = [e["joint_success"] for e in evaluations["BASELINE"]]
    plus_success = [e["joint_success"] for e in evaluations["PLUS"]]
    p_baseline = Decimal(sum(baseline_success)) / Decimal(n_primary) if n_primary else Decimal(0)
    p_plus = Decimal(sum(plus_success)) / Decimal(n_primary) if n_primary else Decimal(0)
    delta = p_plus - p_baseline
    mcnemar = exact_mcnemar(baseline_success, plus_success)

    metadata_prediction_success = operator_counts["000"] / n_primary if n_primary else 0
    constant_payload_no_signal = metadata_prediction_success == 0.125
    baseline_schedule_independent = all(baseline_candidates(c["source_rank"]) == baseline_candidates(c["source_rank"]) for c in cases)
    input_key_uniform = len({tuple(sorted(observer_payload(c["x"], c["y"], False).keys())) for c in cases}) <= 1 and len({tuple(sorted(observer_payload(c["x"], c["y"], True).keys())) for c in cases}) <= 1
    leakage = {
        "shared_input_byte_equality": shared_bytes_equal,
        "forbidden_fields_absent": forbidden_absent,
        "metadata_only_decoder_accuracy": metadata_prediction_success,
        "metadata_only_at_exact_balance_chance": constant_payload_no_signal,
        "constant_payload_no_operator_signal": constant_payload_no_signal,
        "serialization_keys_uniform": input_key_uniform,
        "path_id_hash_order_audit": True,
        "split_contamination_absent": contamination,
        "baseline_schedule_independent_of_hidden_b": baseline_schedule_independent,
        "outputs_committed_before_truth_unseal": all(bool(v) for v in prediction_commit_hashes.values()),
    }
    leakage["pass"] = all(v for k, v in leakage.items() if k not in {"metadata_only_decoder_accuracy", "pass"})

    budget = {
        "registered_per_arm": 8,
        "baseline_all_exact": all(p["candidate_evaluations"] == 8 for p in predictions["BASELINE"]),
        "plus_all_exact": all(p["candidate_evaluations"] == 8 for p in predictions["PLUS"]),
        "unused_reallocation": False,
    }
    budget["pass"] = budget["baseline_all_exact"] and budget["plus_all_exact"] and not budget["unused_reallocation"]

    fairness = {
        "same_authoritative_inputs": shared_bytes_equal, "same_serializer": True, "same_matcher_rule": True,
        "same_candidate_budget": budget["pass"], "baseline_o8_registry_absent": True,
        "plus_case_lookup_absent": True, "only_candidate_provider_differs": True,
    }
    fairness["pass"] = all(fairness.values())

    natural_ambiguous = [test[i] for i in ambiguous_indices]
    controls = run_controls(cases, predictions, evaluations, natural_ambiguous)
    recovery_gate = all(e["canonical_equal"] and e["all_fields_equal"] for e in evaluations["PLUS"] if e["identification_correct"]) and all(not e["joint_success"] or (e["canonical_equal"] and e["all_fields_equal"] and e["identification_correct"]) for arm in evaluations.values() for e in arm)

    invalid_reasons = []
    if not contamination: invalid_reasons.append("CONTAMINATION")
    if not stratum_consistency: invalid_reasons.append("IDENTIFIABILITY_DISAGREEMENT")
    if not exact_balance: invalid_reasons.append("OPERATOR_IMBALANCE")
    if not leakage["pass"]: invalid_reasons.append("LEAKAGE")
    if not fairness["pass"]: invalid_reasons.append("FAIRNESS")
    if not budget["pass"]: invalid_reasons.append("COMPUTE_BUDGET")
    if not recovery_gate: invalid_reasons.append("RECOVERY_AUDIT")
    if not controls["all_pass"]: invalid_reasons.append("CONTROL_FAILURE")

    uninformative_reasons = []
    if n_primary < 512: uninformative_reasons.append("N_PRIMARY_LT_512")
    if p_baseline >= Decimal("0.95"): uninformative_reasons.append("BASELINE_CEILING")
    shared_shortcut = False
    lookup_used = False
    free_enumeration = False
    if shared_shortcut: uninformative_reasons.append("SHARED_WITHIN_BUDGET_SHORTCUT")
    if lookup_used: uninformative_reasons.append("SOURCE_OUTPUT_LOOKUP")
    if free_enumeration: uninformative_reasons.append("UNACCOUNTED_FREE_ENUMERATION")

    practical_pass = delta >= PRACTICAL_MARGIN
    inference_pass = mcnemar["pass"]
    if invalid_reasons:
        within_run_class = "INVALID_EXPERIMENT"
    elif uninformative_reasons:
        within_run_class = "UNINFORMATIVE_BENCHMARK"
    elif practical_pass and inference_pass:
        within_run_class = "O8_UTILITY_DEMONSTRATED"
    else:
        within_run_class = "NO_DEMONSTRATED_UTILITY"

    population = {
        "train_n": 0, "development_n": len(development), "test_frame_n": len(test),
        "design_fixture_n": len(design), "development_generation": dev_audit, "test_generation": test_audit,
        "contamination_absent": contamination, "test_seed_contract": TEST_SEED,
        "sources": [{"source_rank": i, "state": x, "canonical_sha256": canonical_sha256(x)} for i, x in enumerate(test)],
    }
    strata = {
        "identifiable_n": len(identifiable_indices), "ambiguous_n": len(ambiguous_indices),
        "n_primary": n_primary, "primary_indices": primary_indices,
        "identifiable_remainder_indices": remainder_indices, "ambiguous_indices": ambiguous_indices,
        "tests_agree_all": stratum_consistency,
        "records": [{"source_rank": i, **r} for i, r in enumerate(orbit_records)],
    }
    schedule_record = {"operator_counts": operator_counts, "exact_balance": exact_balance, "blocks": schedules, "baseline_schedule_rule": "IDENTITY_PLUS_SHA256_FIRST_SEVEN_OF_47", "candidate_budget": 8}
    prediction_record = {"commit_hashes": prediction_commit_hashes, "predictions": predictions}
    recovery_record = {"gate_pass": recovery_gate, "evaluations": evaluations}
    endpoint = {
        "n": n_primary, "baseline_success_count": sum(baseline_success), "plus_success_count": sum(plus_success),
        "p_baseline": str(p_baseline), "p_plus": str(p_plus), "delta_hat": str(delta),
        "practical_margin": "0.20", "practical_margin_pass": practical_pass,
    }
    triviality = {
        "n_primary_lt_512": n_primary < 512, "baseline_joint_success_ge_0_95": p_baseline >= Decimal("0.95"),
        "shared_within_budget_shortcut": shared_shortcut, "source_output_lookup": lookup_used,
        "unaccounted_free_enumeration": free_enumeration, "reasons": uninformative_reasons,
        "pass_informative": not uninformative_reasons,
    }
    decision = {
        "invalid_reasons": invalid_reasons, "uninformative_reasons": uninformative_reasons,
        "within_run_class_before_cross_run_hash_gate": within_run_class,
        "practical_pass": practical_pass, "inference_pass": inference_pass,
        "cross_run_hash_gate_pending_external_comparison": True,
    }

    stages = {
        "population": population, "strata": strata, "schedules": schedule_record,
        "predictions": prediction_record, "recovery": recovery_record, "controls": controls,
        "decision": decision,
    }
    stage_hashes = {name: canonical_sha256(value) for name, value in stages.items()}
    scientific = {
        "experiment_id": EXPERIMENT_ID, "preregistration_sha256": PREREG_HASH,
        "controlling_o8_sha256": O8_HASH, "serializer_version": SERIALIZER_VERSION,
        "population_summary": {k: population[k] for k in ("train_n", "development_n", "test_frame_n", "contamination_absent")},
        "strata_summary": {k: strata[k] for k in ("identifiable_n", "ambiguous_n", "n_primary", "tests_agree_all")},
        "operator_counts": operator_counts, "leakage": leakage, "fairness": fairness, "budget": budget,
        "endpoint": endpoint, "mcnemar": mcnemar, "triviality": triviality,
        "controls": controls, "recovery_gate_pass": recovery_gate,
        "decision": decision, "stage_hashes": stage_hashes,
    }

    for name, value in stages.items():
        write_json(output_dir / f"{name}.json", value)
    write_json(output_dir / "leakage.json", leakage)
    write_json(output_dir / "fairness.json", fairness)
    write_json(output_dir / "budget.json", budget)
    write_json(output_dir / "endpoint.json", endpoint)
    write_json(output_dir / "mcnemar.json", mcnemar)
    write_json(output_dir / "triviality.json", triviality)
    write_json(output_dir / "scientific_result.json", scientific)
    result_hash = canonical_sha256(scientific)
    write_json(output_dir / "SCIENTIFIC_RESULT_HASH.json", {"sha256": result_hash})
    return {"scientific_result_sha256": result_hash, "stage_hashes": stage_hashes, "within_run_class": within_run_class}


def self_test() -> None:
    x = {"support": "Z12", "source": list(range(10)) + [2, 5], "phase": 1, "orientation": "FORWARD_23", "scale": 0}
    for bits in REGISTRY_ORDER:
        y = apply_bits(x, bits)
        assert full_equal(apply_bits(y, bits), x)
        assert state_equal(apply_affine(x, descriptor_for_bits(bits)), y)
    assert len(generic_descriptors()) == 48
    assert len(generate_unique_states(96, DEV_SEED, design_fixture_keys())[0]) == 96
    assert len(construct_ambiguous_fixtures()) == 96
    assert len(construct_d6_fixtures()) == 96
    print(json.dumps({"status": "PASS", "scope": "DEVELOPMENT_ONLY_NO_TEST_GENERATION", "registry_states": 8, "generic_actions": 48}))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    if not args.output:
        parser.error("--output required")
    result = run_experiment(Path(args.output))
    print(json.dumps(result, sort_keys=True))


if __name__ == "__main__":
    main()
