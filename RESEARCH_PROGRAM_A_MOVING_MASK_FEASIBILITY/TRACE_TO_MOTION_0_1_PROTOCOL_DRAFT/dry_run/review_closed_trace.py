#!/usr/bin/env python3
"""Landing 02B deterministic closed-trace robustness review.

Synthetic methodological review only. It does not authorize acquisition and
does not produce a scientific result.
"""
from __future__ import annotations

import hashlib
import importlib.util
import json
import math
import random
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASELINE = "b11678585485bf6d58dd7cd7ffaac61c0d61592c"
FIXTURE = json.loads((HERE / "fixtures" / "CLOSED_TRACE_REVIEW_CASES.json").read_text())
TOL = FIXTURE["existing_numeric_tolerance_mm"]

spec = importlib.util.spec_from_file_location("landing02a_validator", HERE / "validate_protocol.py")
v1 = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(v1)


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def closed_ring(points):
    if len(points) < 4:
        raise ValueError("DEGENERATE")
    if not all(math.isfinite(x) and math.isfinite(y) for x, y in points):
        raise ValueError("NON_FINITE")
    if math.dist(points[0], points[-1]) > TOL:
        raise ValueError("NON_CLOSED")
    ring = list(points[:-1])
    if len(set(ring)) < 3:
        raise ValueError("DEGENERATE")
    return ring


def close(ring):
    return list(ring) + [ring[0]]


def shift_closed(points, offset):
    ring = closed_ring(points)
    offset %= len(ring)
    return close(ring[offset:] + ring[:offset])


def max_error(a, b):
    if len(a) != len(b):
        return math.inf
    return max(math.dist(x, y) for x, y in zip(a, b))


def neighbor_orient(ring, anchor):
    forward = ring[anchor:] + ring[:anchor]
    reverse_ring = list(reversed(ring))
    reverse_anchor = reverse_ring.index(ring[anchor])
    backward = reverse_ring[reverse_anchor:] + reverse_ring[:reverse_anchor]
    chosen = forward if forward[1] < backward[1] else backward
    return close(chosen)


def c0(points):
    return v1.canon(points, True)


def c1(points):
    closed_ring(points)
    ring = v1.arc(points)[:-1]
    cx = sum(x for x, _ in ring) / len(ring)
    cy = sum(y for _, y in ring) / len(ring)
    radii = [(x - cx) ** 2 + (y - cy) ** 2 for x, y in ring]
    greatest = max(radii)
    tied = [i for i, value in enumerate(radii) if value == greatest]
    anchor = min(tied, key=lambda i: ring[i])
    return neighbor_orient(ring, anchor)


def c2(points, path_id):
    if path_id != "P06":
        raise ValueError("NOT_APPLICABLE")
    ring = closed_ring(points)
    occurrences = {}
    for i, point in enumerate(ring):
        occurrences.setdefault(point, []).append(i)
    anchors = [indices for indices in occurrences.values()
               if len(indices) == 2 and abs(indices[1] - indices[0]) > 1]
    if len(anchors) != 1:
        raise RuntimeError("CROSSING_NOT_UNIQUELY_EXACT")
    return neighbor_orient(ring, anchors[0][0])


def quotient_error(a, b):
    """Minimum max discrepancy over all cyclic shifts and both directions."""
    ra = v1.arc(a)[:-1]
    rb = v1.arc(b)[:-1]
    if len(ra) != len(rb):
        raise ValueError("UNEQUAL_SAMPLE_COUNT")
    n = len(ra)
    best = math.inf
    for candidate in (rb, list(reversed(rb))):
        for shift in range(n):
            current = 0.0
            for i, point in enumerate(ra):
                distance = math.dist(point, candidate[(i + shift) % n])
                if distance >= best:
                    current = distance
                    break
                if distance > current:
                    current = distance
            if current < best:
                best = current
    return best


def result(status, error=None, note=None):
    out = {"status": status}
    if error is not None:
        out["max_error_mm"] = error
    if note is not None:
        out["note"] = note
    return out


def compare(rule, path_id, a, b, equality_expected=True):
    if not equality_expected:
        return result("UNKNOWN", note="No equality expectation is declared for independent noise.")
    try:
        closed_ring(a)
        closed_ring(b)
        if rule == "C0_V1_LEXICOGRAPHIC":
            error = max_error(c0(a), c0(b))
        elif rule == "C1_RADIAL_SIGNATURE":
            error = max_error(c1(a), c1(b))
        elif rule == "C2_P06_CROSSING":
            error = max_error(c2(a, path_id), c2(b, path_id))
        elif rule == "C3_CYCLIC_REVERSAL_QUOTIENT":
            error = quotient_error(a, b)
        else:
            raise ValueError("UNKNOWN_RULE")
        return result("PASS" if error <= TOL else "FAIL", error=error)
    except ValueError as exc:
        return result("INVALID", note=str(exc))
    except RuntimeError as exc:
        return result("BLOCKED", note=str(exc))


def noisy_closed(points, seed, amplitude=0.05):
    rng = random.Random(seed)
    ring = closed_ring(points)
    noisy = [(x + rng.uniform(-amplitude, amplitude),
              y + rng.uniform(-amplitude, amplitude)) for x, y in ring]
    return close(noisy)


def landing02a_noise_fixture(points, seed=20260805, amplitude=0.05):
    """Reproduce Landing 02A: both nominally coincident endpoints are perturbed."""
    rng = random.Random(seed)
    return [(x + rng.uniform(-amplitude, amplitude),
             y + rng.uniform(-amplitude, amplitude)) for x, y in points]


def localized_closed(points):
    ring = closed_ring(points)
    changed = list(ring)
    i = 173
    x, y = changed[i]
    changed[i] = (x + 0.03125, y - 0.046875)
    return close(changed)


def invalid_cases():
    valid = v1.path("P05")
    cases = {
        "NON_CLOSED": valid[:-1],
        "NON_FINITE": close([(math.nan, y) if i == 4 else (x, y)
                              for i, (x, y) in enumerate(valid[:-1])]),
        "DEGENERATE": [(1.0, 1.0)] * 4,
    }
    output = {}
    for case_id, points in cases.items():
        output[case_id] = {}
        for rule in FIXTURE["candidate_rules"]:
            outcome = compare(rule, "P05", points, points)
            output[case_id][rule] = outcome
    return output


def run():
    cases = {}
    for path_id in FIXTURE["paths"]:
        base = v1.path(path_id)
        shared = noisy_closed(base, 20260805 if path_id == "P05" else 20260806)
        local = localized_closed(base)
        independent_a = noisy_closed(base, 7101 if path_id == "P05" else 7102)
        independent_b = noisy_closed(base, 8101 if path_id == "P05" else 8102)
        pairs = {
            "EXACT_REVERSAL": (base, list(reversed(base)), True),
            "ORIGIN_SHIFT_1": (base, shift_closed(base, 1), True),
            "ORIGIN_SHIFT_137": (base, shift_closed(base, 137), True),
            "ORIGIN_SHIFT_500": (base, shift_closed(base, 500), True),
            "SHARED_NOISE_REVERSAL": (shared, list(reversed(shared)), True),
            "LOCAL_PERTURBATION_REVERSAL": (local, list(reversed(local)), True),
            "INDEPENDENT_NOISE": (independent_a, independent_b, False),
        }
        cases[path_id] = {}
        for case_id, (a, b, expectation) in pairs.items():
            cases[path_id][case_id] = {
                rule: compare(rule, path_id, a, b, expectation)
                for rule in FIXTURE["candidate_rules"]
            }

    structural = {
        "P05_ROTATIONAL_SYMMETRY": {
            "C0_V1_LEXICOGRAPHIC": result("BLOCKED", note="A circle has no intrinsic unique start point."),
            "C1_RADIAL_SIGNATURE": result("BLOCKED", note="All ideal-circle radii are equal; a unique radial anchor is not identifiable."),
            "C2_P06_CROSSING": result("INVALID", note="NOT_APPLICABLE"),
            "C3_CYCLIC_REVERSAL_QUOTIENT": result("PASS", note="Comparison is defined; no canonical origin is identified."),
        },
        "P06_CROSSING_AMBIGUITY": {
            "C0_V1_LEXICOGRAPHIC": result("UNKNOWN", note="The rule does not encode crossing identity."),
            "C1_RADIAL_SIGNATURE": result("UNKNOWN", note="The rule does not encode crossing identity."),
            "C2_P06_CROSSING": result("BLOCKED", note="Exact sampled crossing and outgoing-branch identity are not both guaranteed."),
            "C3_CYCLIC_REVERSAL_QUOTIENT": result("PASS", note="Comparison is defined; crossing branch identity is not recovered."),
        },
    }
    all_outcomes = []
    for path_cases in cases.values():
        for rule_results in path_cases.values():
            all_outcomes.extend(item["status"] for item in rule_results.values())
    for rule_results in structural.values():
        all_outcomes.extend(item["status"] for item in rule_results.values())
    invalid = invalid_cases()
    for rule_results in invalid.values():
        all_outcomes.extend(item["status"] for item in rule_results.values())

    c0_failures = []
    for path_id, path_cases in cases.items():
        for case_id, outcomes in path_cases.items():
            if outcomes["C0_V1_LEXICOGRAPHIC"]["status"] == "FAIL":
                c0_failures.append(f"{path_id}:{case_id}")

    legacy = landing02a_noise_fixture(v1.path("P05"))
    legacy_gap = math.dist(legacy[0], legacy[-1])
    legacy_a = v1.canon(legacy, True)
    legacy_b = v1.canon(list(reversed(legacy)), True)
    legacy_raw_error = max_error(legacy_a, legacy_b)

    return {
        "review_id": "LANDING-02B",
        "immutable_baseline": BASELINE,
        "scope": "P05_P06_CLOSED_TRACE_CANONICALIZATION_ONLY",
        "evidence_class": "SYNTHETIC_METHODOLOGICAL_REVIEW",
        "scientific_result": "NONE",
        "human_data": "NONE",
        "human_acquisition": "PROHIBITED",
        "existing_tolerance_mm": TOL,
        "new_or_relaxed_tolerance": "NONE",
        "candidate_selection_authorized": False,
        "fixture_sha256": digest((HERE / "fixtures" / "CLOSED_TRACE_REVIEW_CASES.json").read_bytes()),
        "cases": cases,
        "structural_identifiability": structural,
        "invalid_input_checks": invalid,
        "landing02a_failed_fixture_diagnostic": {
            "status": "INVALID",
            "reason": "Nominally coincident endpoints were perturbed independently; the fixture is not closed.",
            "closure_gap_mm": legacy_gap,
            "existing_tolerance_mm": TOL,
            "raw_c0_error_mm_without_contract_rejection": legacy_raw_error,
            "original_landing02a_check_result": "FAIL",
        },
        "status_vocabulary_observed": sorted(set(all_outcomes)),
        "existing_rule_failures": c0_failures,
        "existing_rule_disposition": "RESTRICT",
        "replacement_rule_disposition": "UNRESOLVED",
        "bounded_conclusion": (
            "C0 is deterministic for exact reversal and closure-preserving shared perturbation, "
            "but is not invariant to all declared sampling-origin changes and cannot identify "
            "an intrinsic origin for P05. The Landing 02A noise fixture is invalid as a closed "
            "trace because its endpoints were perturbed independently. "
            "Restrict it to exact deterministic serialization; no replacement is selected."
        ),
        "protected_tracks": {
            "track_b": "UNCHANGED",
            "track_c": "UNCHANGED",
            "mask_schedules": "UNCHANGED",
            "owner_decisions": "UNCHANGED",
            "acquisition_authority": "UNCHANGED",
        },
    }


if __name__ == "__main__":
    report = run()
    text = json.dumps(report, indent=2, sort_keys=True) + "\n"
    (HERE / "CLOSED_TRACE_REVIEW_REPORT.json").write_text(text)
    print(text, end="")
