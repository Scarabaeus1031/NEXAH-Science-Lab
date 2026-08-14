#!/usr/bin/env python3
"""Deterministic dt-halving sensitivity using primary-frozen thresholds."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

import evaluate_level1b as evaluator


def rate(rows: list[dict], field: str) -> float:
    return sum(bool(row[field]) for row in rows) / len(rows)


def median(values: list[float]) -> float | None:
    return None if not values else float(np.median(np.asarray(values, dtype=np.float64)))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-manifest", type=Path, required=True)
    parser.add_argument("--amendment", type=Path, required=True)
    parser.add_argument("--spec", type=Path, required=True)
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--primary-result", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    manifest, _, spec, spec_hash = evaluator.load_frozen_context(
        args.base_manifest, args.amendment, args.spec
    )
    primary_result_bytes = args.primary_result.read_bytes()
    primary_result = json.loads(primary_result_bytes)
    r_threshold = primary_result["R_calibration"]["selected_threshold"]
    v_threshold = primary_result["V_calibration"]["selected_threshold"]
    analyses: dict[tuple[str, float], dict] = {}
    for path in sorted(args.raw_dir.glob("*.json")):
        payload_bytes = path.read_bytes()
        payload = json.loads(payload_bytes)
        metadata = payload["metadata"]
        if metadata["partition"] != "development" or metadata["mode"] != "deterministic":
            continue
        dt = float(metadata["dt"])
        if dt not in (float(spec["primary_dt"]), float(spec["sensitivity_dt"])):
            continue
        key = (metadata["path_id"], dt)
        if key in analyses:
            raise evaluator.EvaluationError(f"DUPLICATE_SENSITIVITY_INPUT {key}")
        analyses[key] = evaluator.base_run_analysis(
            payload, manifest, spec, evaluator.sha256_bytes(payload_bytes)
        )

    rows = []
    for path_definition in manifest["partitions"]["development"]["stress_paths"]:
        path_id = path_definition["path_id"]
        row = {"path_id": path_id}
        for label, dt in (("primary", float(spec["primary_dt"])),
                          ("sensitivity", float(spec["sensitivity_dt"]))):
            analysis = analyses[(path_id, dt)]
            r = evaluator.threshold_detection(analysis, r_threshold, "R", spec)
            v = evaluator.threshold_detection(analysis, v_threshold, "V", spec)
            row[label] = {
                "R_actionable": r["actionable"], "R_lead": r["lead"],
                "V_actionable": v["actionable"], "V_lead": v["lead"],
                "dt": dt, "event": analysis["event"] is not None,
                "event_persistence_states": evaluator.persistence_states("event", dt, spec),
                "warning_alarm_persistence_states": evaluator.persistence_states(
                    "warning_alarm", dt, spec
                ),
            }
        rows.append(row)

    rates = {}
    differences = []
    for field in ("event", "R_actionable", "V_actionable"):
        primary_rate = rate([row["primary"] for row in rows], field)
        sensitivity_rate = rate([row["sensitivity"] for row in rows], field)
        difference = abs(sensitivity_rate - primary_rate)
        rates[field] = {"absolute_change": difference, "primary": primary_rate,
                        "sensitivity": sensitivity_rate}
        differences.append(difference)
    lead_changes = {}
    for indicator in ("R", "V"):
        primary_median = median([row["primary"][f"{indicator}_lead"] for row in rows
                                 if row["primary"][f"{indicator}_lead"] is not None])
        sensitivity_median = median([row["sensitivity"][f"{indicator}_lead"] for row in rows
                                     if row["sensitivity"][f"{indicator}_lead"] is not None])
        absolute = None if primary_median is None or sensitivity_median is None else abs(
            sensitivity_median - primary_median
        )
        relative = None if absolute is None or primary_median == 0 else absolute / abs(primary_median)
        lead_changes[indicator] = {"absolute_change": absolute, "primary_median": primary_median,
                                   "relative_change": relative,
                                   "sensitivity_median": sensitivity_median}

    result = {
        "artifact_type": "LEVEL1B_DETERMINISTIC_TIMESTEP_SENSITIVITY",
        "classification_rates": rates,
        "development_only": True,
        "evaluator_spec_sha256": spec_hash,
        "lead_changes": lead_changes,
        "maximum_classification_rate_change": max(differences),
        "path_count": len(rows),
        "primary_result_sha256": evaluator.sha256_bytes(primary_result_bytes),
        "primary_thresholds": {"R": r_threshold, "V": v_threshold},
        "rows": rows,
        "status": "DETERMINISTIC_SENSITIVITY_REPORTED",
        "stochastic_timestep_sensitivity": {
            "reason": "Exact coupled Brownian increments require a raw-simulator contract change; no workaround authorized.",
            "status": "NOT_COMPARABLE_OWNER_REVIEW_REQUIRED"
        },
        "undefined_policy_applied": True,
    }
    data = evaluator.canonical_bytes(result)
    disposition = evaluator.write_immutable(args.output, data)
    print(json.dumps({"output": str(args.output), "sha256": evaluator.sha256_bytes(data),
                      "status": disposition}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
