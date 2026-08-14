#!/usr/bin/env python3
"""Static/transitive/semantic validation plus synthetic evidence reconstruction."""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

from derive_a5xe_reference import derive as derive_reference
from derive_a5xe_independent import derive as derive_independent
from synthetic_raw_bundle import build_bundle, signed_permutations, summary_only_attack_bundle

PKG = Path(__file__).resolve().parent.parent
LAB = PKG.parent
EXPECTED_MACHINE = "15d9b8999b8cf83a713194710976b8f81fdaa668ccadb913ebf1ddf2a118f47b"
EXPECTED_LEDGER = "584d434813ef94b5aa25b8758e8f7fcd71a1aeb4a393ccc002110f1c2992ddbd"
EXPECTED_A5XE_ROOT = "fff2d0a96f8d8640afe2ef00a235c17c6c0c77ed1ec16728beea141e5cc060fc"
EXPECTED_V1 = "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05"


class ContractError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise ContractError(message)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def v1_composite(root=LAB / "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"):
    files = [root / "EXP_00_R_FROZEN_CONFIG.yaml", root / "run_exp00r.py", root / "tests/test_exp00r.py", *list((root / "src").rglob("*.py"))]
    records = "".join(f"{sha(path)}  {path.relative_to(root).as_posix()}\n" for path in sorted(files, key=lambda item: item.relative_to(root).as_posix())).encode()
    return len(files), hashlib.sha256(records).hexdigest()


def normalize_validator(path, variable, token="<NORMALIZED_ROOT_DIGEST>"):
    source = Path(path).read_bytes()
    pattern = rb"(" + variable.encode() + rb'\s*=\s*)"[^"]+"'
    replacement = rb'\1"' + token.encode() + rb'"'
    return hashlib.sha256(re.sub(pattern, replacement, source, count=1)).hexdigest()


def verify_nested_root(name, root_path):
    root_path = Path(root_path); root = json.loads(root_path.read_text()); package = root_path.parent
    require(root.get("member_count") == len(root.get("members", [])), f"{name} root count")
    for member in root["members"]:
        if name == "A5X":
            path = LAB / member["path"]
            mode = member["hash_mode"]
            got = normalize_validator(path, "EXPECTED_ROOT_SHA256") if mode == "NORMALIZED_VALIDATOR" else sha(path)
        else:
            path = package / member["path"]
            mode = member["mode"]
            got = normalize_validator(path, "EXPECTED_ROOT", "<NORMALIZED_ROOT>") if mode == "NORMALIZED_VALIDATOR" else sha(path)
        require(path.is_file() and path.stat().st_size == member["bytes"] and got == member["sha256"], f"{name} member:{member['path']}")


def verify_transitive_authority(lab=LAB, ledger_path=None):
    ledger_path = Path(ledger_path) if ledger_path is not None else PKG / "A5XE_TRANSITIVE_AUTHORITY_LEDGER.json"
    require(sha(ledger_path) == EXPECTED_LEDGER, "authority ledger")
    ledger = json.loads(ledger_path.read_text())
    count, composite = v1_composite(lab / "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1")
    require(count == 24 and composite == EXPECTED_V1 and ledger["v1"]["composite"] == EXPECTED_V1, "V1")
    require(len(ledger["upstream"]) == len({path for path, _ in ledger["upstream"]}), "upstream duplicates")
    for relative, expected in ledger["upstream"]:
        require(sha(lab / relative) == expected, f"upstream:{relative}")
    verify_nested_root("A5X", lab / ledger["nested_roots"]["A5X"]["path"])
    verify_nested_root("A5XR", lab / ledger["nested_roots"]["A5XR"]["path"])
    return True


def validate_machine_object(machine):
    require(machine.get("schema") == "A5XE_EVIDENCE_RECONSTRUCTION_V1" and machine.get("scientific_change") is False, "machine identity")
    require(machine.get("architecture") == ["RAW_EVIDENCE", "DETERMINISTIC_RECONSTRUCTION", "DERIVED_SCIENTIFIC_STATISTICS", "VALIDITY_GATES", "P1_P5", "ROSSLER_CLASSIFICATION", "CROSS_SYSTEM_CEILING"], "architecture")
    require(machine["states"] == {"preauthorization_failure": "IMPLEMENTATION_FAILURE", "postauthorization_invalid": "INVALID_EXPERIMENT", "valid": "VALID_SCIENTIFIC_RESULT", "classification_only_when": "VALID_SCIENTIFIC_RESULT"}, "states")
    identity = machine["identity"]
    require(identity["synthetic_seeds"] == {"format": "SYNTH_00..SYNTH_29", "count": 30} and identity["rows_per_seed_per_split"] == 50 and identity["actions"] == [-.5, -.25, 0., .25, .5], "identity")
    support = machine["support"]
    require(support["T_oos"] == {"operator": "<=", "value": .1} and support["F_oos"] == {"operator": "<=", "value": .1} and support["joint"] == {"operator": ">=", "value": .8}, "support thresholds")
    require(support["nonzero_gate"] == {"minimum_seeds": 20, "minimum_rows_per_seed": 20, "row_condition": "JOINT_AND_T_PROPOSAL_NONZERO_AND_F_PROPOSAL_NONZERO"}, "support population")
    rng = machine["rng"]
    require(rng["encoding"] == "UTF-8" and rng["hash"] == "SHA-256" and rng["digest_bytes"] == [0, 8] and rng["seed_bits"] == 64 and rng["byte_order"] == "BIG_ENDIAN" and rng["generator"] == "numpy.random.Generator(numpy.random.PCG64(seed))" and rng["numpy"] == "2.3.5" and rng["fresh_stream_per_object"] is True and rng["preliminary_draws"] == 0 and rng["retry"] is False, "RNG")
    require(rng["field_order"] == {"N1": ["REP", "SEED"], "N2": ["SPLIT", "SEED"], "N3": ["SPLIT", "ROW"], "N4": ["SPLIT", "CARRIER", "STRATUM"]}, "RNG order")
    nulls = machine["nulls"]
    require(nulls["R"] == 200 and nulls["replicate_ids"] == {"start": 0, "stop_inclusive": 199}, "null count")
    require(nulls["required_statistics"] == ["mean_coherence", "top_action_agreement", "T_coefficient", "F_coefficient", "T_gain", "F_gain"], "null stats")
    require(nulls["N1"]["map"] == "FORWARD_pi(action[j])=action[p[j]]" and nulls["N1"]["inverse_forbidden"] is True, "N1")
    require(nulls["N2"]["unit"] == "WITHIN_SPLIT_AND_SEED" and nulls["N2"]["replacement"] is False, "N2")
    require(nulls["N3"]["donor"] == "DIFFERENT_SEED_SAME_MAPPED_PHASE_AND_TARGET_IN_FIXED_SPLIT" and nulls["N3"]["clockwise"] == "DECREASING_BIN_INDEX_MODULO_8", "N3")
    require(nulls["N4_T"]["carrier"] == "T" and nulls["N4_F"]["carrier"] == "F" and nulls["N4_T"]["merge"] == "ASCENDING_RESTART_HIGHER_FIRST_ELSE_LOWER_MINIMUM_10", "N4")
    mc = machine["monte_carlo"]
    require(mc == {"formula": "p=(1+k)/(R+1)", "k": "count(T_null>=T_observed)", "direction": "OBSERVED_GREATER", "ties": "ADVERSE", "alpha": .025, "pass": "k<=4", "descriptive_percentile": {"method": "NEAREST_RANK", "rank": 195, "decision_authority": False}}, "Monte Carlo")
    bootstrap = machine["bootstrap"]
    require(bootstrap["repetitions"] == 500 and bootstrap["cluster_unit"] == "TEST_SEED" and bootstrap["rng_seed"] == 20260808 and bootstrap["draw"] == "30_SEEDS_WITH_REPLACEMENT_FROM_EXACT_TEST_SEED_UNIVERSE" and bootstrap["redraw"] is False, "bootstrap")
    n5 = machine["n5"]
    require(n5["matrices"] == signed_permutations() and n5["comparison"]["aggregation"] == "MINIMUM_OVER_ALL_TRANSFORMS_REPRESENTATIONS_QUERIES" and n5["comparison"]["threshold"] == .99, "N5")
    require(n5["SYNTH"]["failure"] == "IMPLEMENTATION_FAILURE_RELEASE_PROHIBITED" and n5["RUN"]["failure"] == "INVALID_EXPERIMENT", "N5 failures")
    dominance = machine["attribution"]["dominance"]
    require(dominance["arithmetic"] == "EXACT_RATIONAL_FROM_as_integer_ratio" and dominance["valid_failure"] == {"G<=0": "P4_FALSE", "2D3>G": "P4_FALSE"} and dominance["pass"] == "G>0_AND_2D3<=G" and dominance["tolerance"] == "FORBIDDEN", "dominance")
    require(machine["attribution"]["report_only"] == ["TRAJECTORY_ONLY_OUTCOME_PREDICTION", "LEARNED_FIELD_ONLY_OUTCOME_PREDICTION", "EQUAL_SCORE_FUSION_CARRIER"], "P4 registry")
    sensitivities = machine["sensitivities"]
    require(sensitivities["exact_count"] == 12 and len(sensitivities["registry"]) == 12 and sensitivities["P5_ids"] == ["ACTION_AMPLITUDE_0.25", "ACTION_AMPLITUDE_1.0"] and sensitivities["no_rescue"] is True, "sensitivities")
    require(set(machine["P"]) == {"P1", "P2", "P3", "P4", "P5", "strict_positive_equality"}, "P1-P5")
    classification = machine["classification"]
    require(classification["precedence"] == ["ANY_INVALID=>INVALID EXPERIMENT", "ALL_P1_P5_AND_BOTH_POSITIVE_CORES_AND_NO_RESOLVED_NEGATIVE=>REPLICATED", "ANY_POSITIVE_CORE_AND_NO_RESOLVED_NEGATIVE=>PARTIALLY REPLICATED", "OTHERWISE=>NOT REPLICATED"] and classification["mutually_exclusive"] is True and classification["exhaustive"] is True, "classification")
    require(machine["cross_system"]["invalid"] == "INCONCLUSIVE" and machine["cross_system"]["strict_label_reachable"] is False and machine["cross_system"]["ceiling"] == "PARTIAL CROSS-SYSTEM REPLICATION", "ceiling")
    require(machine["producer_decisions"]["authoritative"] is False and set(machine["producer_decisions"]["forbidden"]) >= {"P1", "P2", "P3", "P4", "P5", "classification"}, "producer decisions")
    require(len(machine["provenance"]["raw_classes"]) == 9 and len(machine["provenance"]["derived_classes"]) == 8 and machine["provenance"]["parents"] == "EXACT_ORDERED_IDS_AND_HASHES", "provenance")
    require(machine["nonexecution"] == {"registered_data_accessed": False, "implementation_created": False, "authorization_created": False, "registered_experiment_executed": False}, "nonexecution")
    return True


def validate_machine():
    path = PKG / "A5XE_MACHINE_READABLE_RULES.yaml"
    require(sha(path) == EXPECTED_MACHINE, "machine hash")
    machine = json.loads(path.read_text())
    validate_machine_object(machine)
    return machine


def verify_local_root():
    path = PKG / "A5XE_AUTHORITY_ROOT.json"
    require(sha(path) == EXPECTED_A5XE_ROOT, "A5XE external root")
    root = json.loads(path.read_text())
    require(root["member_count"] == len(root["members"]) and len({entry["path"] for entry in root["members"]}) == root["member_count"], "A5XE root metadata")
    for entry in root["members"]:
        member = PKG / entry["path"]
        require(member.is_file() and member.stat().st_size == entry["bytes"], "A5XE member")
        got = normalize_validator(member, "EXPECTED_A5XE_ROOT") if entry["mode"] == "NORMALIZED_VALIDATOR" else sha(member)
        require(got == entry["sha256"], f"A5XE hash:{entry['path']}")
    actual = {path.relative_to(PKG).as_posix() for path in PKG.rglob("*") if path.is_file() and path.name != "A5XE_AUTHORITY_ROOT.json" and "__pycache__" not in path.parts}
    require(actual == {entry["path"] for entry in root["members"]}, "A5XE membership")
    return True


def validate_all(run_independent=True):
    verify_transitive_authority()
    verify_local_root()
    validate_machine()
    canonical = build_bundle()
    reference = derive_reference(canonical)
    require(reference["execution_state"] == "VALID_SCIENTIFIC_RESULT" and reference["classification"] == "REPLICATED" and all(reference["P"].values()), "reference derivation")
    if run_independent:
        independent = derive_independent(canonical)
        require(independent == reference, "two implementers")
    attack = derive_reference(summary_only_attack_bundle())
    require(attack["execution_state"] == "INVALID_EXPERIMENT" and attack["classification"] is None, "central falsification")
    return reference


if __name__ == "__main__":
    try:
        result = validate_all()
        print("A5XE CONTRACT VALIDATION: PASS", result["execution_state"], result["classification"], result["P"])
    except Exception as error:
        print("A5XE CONTRACT VALIDATION: FAIL", error)
        sys.exit(1)
