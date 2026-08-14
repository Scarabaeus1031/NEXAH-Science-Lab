#!/usr/bin/env python3
"""Post-outcome deterministic replay/audit of every Level-1C scientific byte."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import run_level1c as runner


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    runner.common_arguments(parser)
    parser.add_argument("--run-manifest", type=Path, required=True)
    parser.add_argument("--run-results", type=Path, required=True)
    parser.add_argument("--aggregate-results", type=Path, required=True)
    parser.add_argument("--outcome", type=Path, required=True)
    parser.add_argument("--result", type=Path, required=True)
    args = parser.parse_args()

    simulator, evaluator, manifest, _, spec, opening_hash = runner.load_controls(args)
    run_manifest_bytes = args.run_manifest.read_bytes()
    run_manifest = json.loads(run_manifest_bytes)
    regenerated_rows = []
    regenerated_sensitivity = []
    deterministic_replays = 0
    stochastic_replays = 0
    for entry in run_manifest["raw_artifacts"]:
        path = Path(entry["path"])
        existing = path.read_bytes()
        if runner.sha256_bytes(existing) != entry["sha256"]:
            raise RuntimeError(f"RAW_HASH_MISMATCH {path}")
        payload, _ = simulator.build_payload(
            manifest, runner.BASE_HASH, runner.SIMULATOR_HASH, partition="evaluation",
            path_id=entry["path_id"], mode=entry["mode"], seed=entry["seed"], dt=entry["dt"]
        )
        replay_bytes = simulator.canonical_bytes(payload)
        if replay_bytes != existing:
            raise RuntimeError(f"RAW_REPLAY_MISMATCH {path}")
        if entry["mode"] == "deterministic":
            deterministic_replays += 1
        else:
            stochastic_replays += 1
        row, _ = runner.one_run_result(
            evaluator, json.loads(existing), entry["sha256"], manifest, spec
        )
        if entry["purpose"] == "primary":
            regenerated_rows.append(row)
        else:
            regenerated_sensitivity.append(row)

    existing_run_level_bytes = args.run_results.read_bytes()
    regenerated_run_level = {
        "artifact_type": "LEVEL1C_RUN_LEVEL_RESULTS",
        "evaluation_opening_record_sha256": opening_hash,
        "evaluator_source_sha256": runner.EVALUATOR_HASH,
        "evaluator_spec_sha256": runner.SPEC_HASH,
        "fixed_thresholds": {"R": runner.R_THRESHOLD, "V": runner.V_THRESHOLD},
        "invalid_run_records": list(run_manifest["invalid_generation_records"]),
        "primary_run_results": regenerated_rows,
        "run_manifest_sha256": runner.sha256_bytes(run_manifest_bytes),
        "sensitivity_run_results": regenerated_sensitivity,
        "status": "FIXED_EVALUATOR_APPLIED_NO_RETUNING",
    }
    regenerated_run_level_bytes = evaluator.canonical_bytes(regenerated_run_level)
    if regenerated_run_level_bytes != existing_run_level_bytes:
        raise RuntimeError("RUN_LEVEL_REGENERATION_MISMATCH")

    aggregate_value, outcome_value = runner.aggregate_result(
        regenerated_run_level, manifest, evaluator, spec
    )
    aggregate_value["run_level_results_sha256"] = runner.sha256_bytes(
        regenerated_run_level_bytes
    )
    aggregate_bytes = evaluator.canonical_bytes(aggregate_value)
    if aggregate_bytes != args.aggregate_results.read_bytes():
        raise RuntimeError("AGGREGATE_REGENERATION_MISMATCH")
    outcome_value["aggregate_results_sha256"] = runner.sha256_bytes(aggregate_bytes)
    outcome_bytes = evaluator.canonical_bytes(outcome_value)
    if outcome_bytes != args.outcome.read_bytes():
        raise RuntimeError("OUTCOME_REGENERATION_MISMATCH")

    audit = {
        "aggregate_regeneration": "BYTE_IDENTICAL",
        "artifact_type": "LEVEL1C_REPLAY_AUDIT",
        "deterministic_raw_replays": deterministic_replays,
        "evaluator_source_sha256": runner.EVALUATOR_HASH,
        "outcome_regeneration": "BYTE_IDENTICAL",
        "raw_hashes_verified": len(run_manifest["raw_artifacts"]),
        "run_level_regeneration": "BYTE_IDENTICAL",
        "simulator_source_sha256": runner.SIMULATOR_HASH,
        "status": "LEVEL1C_FULL_REPLAY_AUDIT_PASS",
        "stochastic_raw_replays": stochastic_replays,
    }
    data = evaluator.canonical_bytes(audit)
    disposition = evaluator.write_immutable(args.result, data)
    print(json.dumps({"output": str(args.result), "sha256": runner.sha256_bytes(data),
                      "status": disposition}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
