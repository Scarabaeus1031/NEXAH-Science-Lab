#!/usr/bin/env python3
"""Comparator stage: opens expected classes only after the observation is sealed."""

import argparse
import hashlib
import json
from pathlib import Path


def load_json(path):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def canonical_hash(value):
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def write_json(path, value):
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(value, handle, indent=2, sort_keys=True, ensure_ascii=False)
        handle.write("\n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--expected", required=True)
    parser.add_argument("--observed", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    expected = load_json(args.expected)
    sealed = load_json(args.observed)
    observations = sealed["observations"]
    verified_seal = canonical_hash(observations) == sealed["sealed_result_hash"]
    same_preregistration = observations["preregistration_sha256"] == expected["preregistration_sha256"]

    candidates = {}
    for candidate_id, expected_class in expected["candidate_classes"].items():
        observed = observations["candidate_results"][candidate_id]
        candidates[candidate_id] = {
            "expected_class": expected_class,
            "observed_class": observed["observed_class"],
            "matched": observed["observed_class"] == expected_class,
            "statistic": observed["statistic"],
        }
    controls = {}
    for control_id, expected_pass in expected["destructive_controls"].items():
        observed = observations["destructive_controls"][control_id]
        controls[control_id] = {"expected_target": expected_pass, "matched": observed["passed"] == expected_pass, "observed": observed}

    matched_candidates = sum(item["matched"] for item in candidates.values())
    matched_controls = sum(item["matched"] for item in controls.values())
    overall_pass = all([
        verified_seal, same_preregistration, observations["source_baseline"]["passed"],
        observations["correspondence_preserved"], matched_candidates == 14, matched_controls == 5,
        observations["expected_classes_available"] is False,
    ])
    result = {
        "experiment_id": observations["experiment_id"],
        "preregistration_sha256": observations["preregistration_sha256"],
        "stage_order": ["generator", "observer_classifier", "comparator"],
        "observer_seal_verified": verified_seal,
        "observer_sealed_result_hash": sealed["sealed_result_hash"],
        "source_baseline": observations["source_baseline"],
        "correspondence_preserved": observations["correspondence_preserved"],
        "candidates": candidates,
        "candidates_matched": matched_candidates,
        "candidates_total": len(candidates),
        "destructive_controls": controls,
        "destructive_controls_matched": matched_controls,
        "destructive_controls_total": len(controls),
        "overall_pass": overall_pass,
    }
    write_json(Path(args.out), result)


if __name__ == "__main__":
    main()

