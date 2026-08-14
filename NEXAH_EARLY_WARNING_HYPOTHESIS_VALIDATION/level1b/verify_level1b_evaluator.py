#!/usr/bin/env python3
"""Independent A–S software verification of the frozen Level-1B evaluator."""

from __future__ import annotations

import argparse
import copy
import json
import math
from pathlib import Path

import numpy as np

import evaluate_level1b as evaluator


def require(value: bool, message: str) -> None:
    if not value:
        raise AssertionError(message)


def synthetic_analysis(r: list[float], v: list[float], dt: float = 0.01,
                       event: evaluator.Detection | None = None) -> dict:
    return {"dt": dt, "event": event, "metadata": {"path_id": "fixture"},
            "r": np.asarray(r), "time": np.arange(len(r)) * dt,
            "v": np.asarray(v)}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-manifest", type=Path, required=True)
    parser.add_argument("--amendment", type=Path, required=True)
    parser.add_argument("--spec", type=Path, required=True)
    parser.add_argument("--raw-sample", type=Path, required=True)
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--result", type=Path, required=True)
    args = parser.parse_args()

    manifest, amendment, spec, spec_hash = evaluator.load_frozen_context(
        args.base_manifest, args.amendment, args.spec
    )
    require(evaluator.sha256_file(Path(__file__).resolve()) == spec["verifier_source_sha256"],
            "verifier source identity mismatch")
    require(amendment["amendment_version"] == "1.0.1", "amendment version mismatch")

    raw_bytes = args.raw_sample.read_bytes()
    raw_hash = evaluator.sha256_bytes(raw_bytes)
    raw_payload = json.loads(raw_bytes)
    raw_before = evaluator.sha256_file(args.raw_sample)
    sample_analysis = evaluator.base_run_analysis(raw_payload, manifest, spec, raw_hash)
    require(raw_before == evaluator.sha256_file(args.raw_sample), "raw input mutated")

    tiny_delta = np.asarray([[0.0, 0.0], [0.0, math.pi]], dtype=np.float64)
    tiny_r = evaluator.phase_coherence(tiny_delta)
    require(tiny_r[0] == 1.0 and abs(tiny_r[1]) < 1e-15, "R hand check failed")
    tiny_v = evaluator.speed_deviation(
        np.asarray([[1.0, -1.0]], dtype=np.float64), np.asarray([1.0, 1.0])
    )
    require(tiny_v[0] == 1.0, "V hand check failed")

    require(evaluator.first_persistent(np.ones(9, dtype=bool), 10) is None,
            "persistence accepted nine samples")
    persistence = evaluator.first_persistent(np.ones(10, dtype=bool), 10)
    require(persistence == evaluator.Detection(0, 9), "persistence timestamps wrong")

    exact_pi = np.column_stack((np.zeros(21), np.full(21, math.pi)))
    require(evaluator.first_persistent(
        evaluator.max_pairwise_angle_separation(exact_pi) > math.pi, 21
    ) is None, "event equality boundary wrong")
    above_pi = np.column_stack((np.zeros(21), np.full(21, math.pi + 1e-6)))
    event = evaluator.first_persistent(
        evaluator.max_pairwise_angle_separation(above_pi) > math.pi, 21
    )
    require(event == evaluator.Detection(0, 20), "event interval/state rule wrong")
    require(evaluator.first_persistent(np.ones(20, dtype=bool), 21) is None,
            "event accepted fewer than 21 states")

    fixture = synthetic_analysis([0.5] * 20, [0.2] * 20)
    require(evaluator.threshold_detection(fixture, 0.5, "R", spec)["detection"] is None,
            "R equality incorrectly crossed")
    require(evaluator.threshold_detection(fixture, 0.2, "V", spec)["detection"] is None,
            "V equality incorrectly crossed")
    fixture_low = synthetic_analysis([0.49] * 20, [0.21] * 20)
    # Stress onset 5 lies outside this short fixture, hence no eligible detection.
    require(evaluator.threshold_detection(fixture_low, 0.5, "R", spec)["detection"] is None,
            "burn-in eligibility failed")

    lead = evaluator.lead_fraction(700, 500, 0.01)
    require(lead == 2 and evaluator.actionable(lead, spec), "lead arithmetic failed")
    require(evaluator.actionable(evaluator.lead_fraction(520, 500, 0.01), spec),
            "inclusive lower lead boundary failed")
    require(evaluator.actionable(evaluator.lead_fraction(1000, 500, 0.01), spec),
            "inclusive upper lead boundary failed")
    require(evaluator.first_persistent(np.zeros(100, dtype=bool), 10) is None,
            "no-crossing behavior failed")

    corrupted = copy.deepcopy(raw_payload)
    corrupted["raw"]["delta"][0][0] = float("nan")
    try:
        evaluator.validate_raw_payload(corrupted, manifest, evaluator.sha256_bytes(
            evaluator.canonical_bytes(corrupted)))
    except (evaluator.EvaluationError, ValueError):
        pass
    else:
        raise AssertionError("NaN was not rejected")

    canonical_one = evaluator.canonical_bytes({"b": 2, "a": 1})
    canonical_two = evaluator.canonical_bytes({"a": 1, "b": 2})
    require(canonical_one == canonical_two, "canonicalization failed")

    delta = np.asarray(raw_payload["raw"]["delta"], dtype=np.float64)
    base_r = evaluator.phase_coherence(delta)
    discrepancies = []
    for alpha in (0.355 * 2 * math.pi, -1.25, math.pi, 17.0):
        shifted = evaluator.phase_coherence(delta - alpha)
        discrepancies.append(float(np.max(np.abs(base_r - shifted))))
    invariance_discrepancy = max(discrepancies)
    require(invariance_discrepancy <= 1e-15, "common-phase invariance failed")

    source = Path(evaluator.__file__).read_text()
    require("eval-r" not in source and "range(200)" not in source,
            "evaluation-derived constants found")
    evaluation_files = []
    for path in args.raw_dir.glob("*.json"):
        # Filename identity is checked before contents to preserve the sealed boundary.
        if "__evaluation__" in path.name:
            evaluation_files.append(str(path))
    require(not evaluation_files, "evaluation raw artifact unexpectedly present")

    # Replay uses the same already-open development record and must serialize identically.
    replay_1 = evaluator.base_run_analysis(raw_payload, manifest, spec, raw_hash)
    replay_2 = evaluator.base_run_analysis(raw_payload, manifest, spec, raw_hash)
    replay_summary_1, _ = evaluator.summarize_selected([replay_1], 0.85, 0.15, spec)
    replay_summary_2, _ = evaluator.summarize_selected([replay_2], 0.85, 0.15, spec)
    require(evaluator.canonical_bytes(replay_summary_1) == evaluator.canonical_bytes(replay_summary_2),
            "deterministic evaluator replay failed")

    bootstrap_fixture = {"a": [1.0, 2.0], "b": [-1.0, 3.0]}
    boot_1 = evaluator.paired_stratified_bootstrap(bootstrap_fixture, spec)
    boot_2 = evaluator.paired_stratified_bootstrap(bootstrap_fixture, spec)
    require(evaluator.canonical_bytes(boot_1) == evaluator.canonical_bytes(boot_2),
            "bootstrap replay failed")
    pass_fixture = {
        "candidate_fpr": 0.05, "candidate_recall": 0.95,
        "classification_rate_change": 0.01, "comparator_fpr": 0.04,
        "comparator_recall": 0.95, "direction_preserved_both_threshold_sensitivities": True,
        "direction_preserved_rate_strata": 2, "identity_provenance_no_retuning": True,
        "median_lead_relative_change": 0.05, "median_paired_delta_lead": 1.0,
        "numerical_invalidity": False, "paired_delta_lead_interval_95": [0.1, 2.0],
        "valid_event_runs": 30, "valid_non_event_runs": 30,
    }
    require(evaluator.classify_scientific_outcome(pass_fixture, spec)["outcome"] == "PASS",
            "PASS gate fixture failed")
    fail_fixture = dict(pass_fixture, median_paired_delta_lead=-0.1)
    require(evaluator.classify_scientific_outcome(fail_fixture, spec)["outcome"] == "FAIL",
            "FAIL gate fixture failed")
    inconclusive_fixture = dict(pass_fixture, valid_event_runs=29)
    require(evaluator.classify_scientific_outcome(inconclusive_fixture, spec)["outcome"]
            == "INCONCLUSIVE", "INCONCLUSIVE gate fixture failed")
    require(raw_before == evaluator.sha256_file(args.raw_sample), "raw changed after verification")

    checks = {letter: "PASS" for letter in "ABCDEFGHIJKLMNOPQRS"}
    result = {
        "artifact_type": "LEVEL1B_EVALUATOR_VERIFICATION",
        "checks": checks,
        "common_phase_invariance": {
            "algebraic_identity": "|exp(-i alpha)|=1, therefore |mean(exp(i(delta-alpha)))|=R",
            "maximum_numerical_discrepancy": invariance_discrepancy,
            "status": "PASS_REPRESENTATIONAL_ONLY",
        },
        "evaluation_partition_opened": False,
        "evaluation_performance_inspected": False,
        "evaluator_source_sha256": spec["evaluator_source_sha256"],
        "evaluator_spec_sha256": spec_hash,
        "raw_sample_sha256": raw_hash,
        "status": "ALL_A_TO_S_TESTS_PASS",
        "verifier_source_sha256": spec["verifier_source_sha256"],
    }
    data = evaluator.canonical_bytes(result)
    disposition = evaluator.write_immutable(args.result, data)
    print(json.dumps({"output": str(args.result), "sha256": evaluator.sha256_bytes(data),
                      "status": disposition}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
