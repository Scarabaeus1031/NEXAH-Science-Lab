#!/usr/bin/env python3
"""Sealed Level-1C orchestration around byte-frozen simulator/evaluator code."""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import math
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

import numpy as np


BASE_HASH = "d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3"
AMENDMENT_HASH = "c5df438954b3f32d44a4eea6d4add89bb9f10c71e3b32ba8ce135d8b473c870a"
SPEC_HASH = "2a3a53da5841154f60b07b97b489ac9bdc89df79de65e33b5cb9b36cb0b59839"
LEVEL1B_HASH_MANIFEST_HASH = "9fa9440b4f4fe5f593fe2856b27b9cf240f7ea9ff6f611b422273494f350ce61"
SIMULATOR_HASH = "7cd95b94631aa17b90fc182fa58280ce80103b9de172e88d066519d11c8f6f19"
EVALUATOR_HASH = "529a9615ef46434b67349981accad223ea906f1f5c0d5bf031eb2fb4e5c63a4e"
R_THRESHOLD = 0.50
V_THRESHOLD = 1.00


class Level1CError(RuntimeError):
    pass


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def load_module(name: str, path: Path, expected_hash: str) -> Any:
    if sha256_file(path) != expected_hash:
        raise Level1CError(f"FROZEN_SOURCE_HASH_MISMATCH {path}")
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise Level1CError(f"MODULE_IMPORT_FAILED {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def load_controls(args: argparse.Namespace) -> tuple[Any, Any, dict, dict, dict, str]:
    identities = [
        (args.base_manifest, BASE_HASH),
        (args.amendment, AMENDMENT_HASH),
        (args.spec, SPEC_HASH),
        (args.level1b_hash_manifest, LEVEL1B_HASH_MANIFEST_HASH),
    ]
    for path, expected in identities:
        if sha256_file(path) != expected:
            raise Level1CError(f"CONTROLLING_HASH_MISMATCH {path}")
    simulator = load_module("level1c_frozen_simulator", args.simulator, SIMULATOR_HASH)
    evaluator = load_module("level1c_frozen_evaluator", args.evaluator, EVALUATOR_HASH)
    manifest, manifest_hash, simulator_source_hash = simulator.load_context(args.base_manifest)
    if manifest_hash != BASE_HASH or simulator_source_hash != SIMULATOR_HASH:
        raise Level1CError("LEVEL1_CONTEXT_MISMATCH")
    _, amendment, evaluator_spec, evaluator_spec_hash = evaluator.load_frozen_context(
        args.base_manifest, args.amendment, args.spec
    )
    if evaluator_spec_hash != SPEC_HASH:
        raise Level1CError("LEVEL1B_CONTEXT_MISMATCH")
    opening_bytes = args.opening_record.read_bytes()
    opening = json.loads(opening_bytes)
    if opening.get("status") != "LEVEL1C_EVALUATION_OPENING_AUTHORIZED":
        raise Level1CError("OPENING_RECORD_NOT_AUTHORIZED")
    if opening.get("runner_source_sha256") != sha256_file(Path(__file__).resolve()):
        raise Level1CError("OPENING_RUNNER_HASH_MISMATCH")
    if opening.get("frozen_R_threshold") != R_THRESHOLD or opening.get(
        "frozen_V_threshold"
    ) != V_THRESHOLD:
        raise Level1CError("OPENING_THRESHOLD_MISMATCH")
    return simulator, evaluator, manifest, amendment, evaluator_spec, sha256_bytes(opening_bytes)


def request_set(manifest: dict, include_sensitivity: bool = True) -> list[dict[str, Any]]:
    requests = []
    partition = "evaluation"
    primary_dt = float(manifest["numerics"]["primary_dt"])
    sensitivity_dt = float(manifest["numerics"]["convergence_check_dt"])
    for path in manifest["partitions"][partition]["stress_paths"]:
        requests.append({"dt": primary_dt, "mode": "deterministic", "path_id": path["path_id"],
                         "purpose": "primary", "seed": None})
        for seed in manifest["partitions"][partition]["stochastic_seeds"]:
            requests.append({"dt": primary_dt, "mode": "stochastic", "path_id": path["path_id"],
                             "purpose": "primary", "seed": seed})
        if include_sensitivity:
            requests.append({"dt": sensitivity_dt, "mode": "deterministic",
                             "path_id": path["path_id"],
                             "purpose": "deterministic_timestep_sensitivity", "seed": None})
    return requests


def generate(args: argparse.Namespace) -> int:
    simulator, _, manifest, _, _, opening_hash = load_controls(args)
    entries = []
    invalid = []
    for request in request_set(manifest):
        try:
            payload, _ = simulator.build_payload(
                manifest, BASE_HASH, SIMULATOR_HASH, partition="evaluation",
                path_id=request["path_id"], mode=request["mode"], seed=request["seed"],
                dt=request["dt"],
            )
            data = simulator.canonical_bytes(payload)
            path = args.raw_dir / f"{payload['metadata']['run_id']}.json"
            simulator.write_immutable(path, data)
            entries.append({**request, "path": str(path), "run_id": payload["metadata"]["run_id"],
                            "sha256": simulator.sha256_bytes(data), "status": "VALID_RAW_STATE"})
        except simulator.ProtocolError as exc:
            invalid.append({**request, "error": str(exc), "status": "INVALID_RAW_GENERATION"})
    record = {
        "artifact_type": "LEVEL1C_RUN_MANIFEST",
        "base_manifest_sha256": BASE_HASH,
        "evaluation_opening_record_sha256": opening_hash,
        "invalid_generation_count": len(invalid),
        "invalid_generation_records": invalid,
        "primary_run_count": sum(e["purpose"] == "primary" for e in entries),
        "raw_artifacts": entries,
        "simulator_source_sha256": SIMULATOR_HASH,
        "status": "EVALUATION_RAW_GENERATION_COMPLETE",
        "timestep_sensitivity_run_count": sum(
            e["purpose"] == "deterministic_timestep_sensitivity" for e in entries
        ),
    }
    data = simulator.canonical_bytes(record)
    status = simulator.write_immutable(args.run_manifest, data)
    print(json.dumps({"output": str(args.run_manifest), "sha256": sha256_bytes(data),
                      "status": status}, sort_keys=True))
    return 0


def result_for_indicator(evaluator: Any, analysis: dict, threshold: float, name: str,
                         spec: dict) -> dict[str, Any]:
    result = evaluator.threshold_detection(analysis, threshold, name, spec)
    record = evaluator.detection_record(result["detection"], analysis["time"])
    event_exists = analysis["event"] is not None
    detection_exists = result["detection"] is not None
    return {
        **record,
        "actionable": bool(result["actionable"]),
        "false_negative": bool(event_exists and not result["actionable"]),
        "false_positive": bool(not event_exists and detection_exists),
        "lead": result["lead"],
        "true_positive": bool(event_exists and result["actionable"]),
    }


def one_run_result(evaluator: Any, payload: dict, raw_hash: str, manifest: dict,
                   spec: dict) -> tuple[dict, dict]:
    analysis = evaluator.base_run_analysis(payload, manifest, spec, raw_hash)
    event = evaluator.detection_record(analysis["event"], analysis["time"])
    r = result_for_indicator(evaluator, analysis, R_THRESHOLD, "R", spec)
    v = result_for_indicator(evaluator, analysis, V_THRESHOLD, "V", spec)
    delta_l = None
    if r["actionable"] and v["actionable"]:
        delta_l = r["lead"] - v["lead"]
    sensitivity = {}
    for label, factor in (("minus_10_percent", 0.9), ("plus_10_percent", 1.1)):
        sr = result_for_indicator(evaluator, analysis, R_THRESHOLD * factor, "R", spec)
        sv = result_for_indicator(evaluator, analysis, V_THRESHOLD * factor, "V", spec)
        sensitivity[label] = {
            "Delta_L": None if not sr["actionable"] or not sv["actionable"]
            else sr["lead"] - sv["lead"],
            "R_actionable": sr["actionable"], "R_lead": sr["lead"],
            "V_actionable": sv["actionable"], "V_lead": sv["lead"],
        }
    row = {
        "Delta_L": delta_l,
        "R": r,
        "V": v,
        "event": event,
        "metadata": analysis["metadata"],
        "numerical_validity": "VALID",
        "raw_sha256": raw_hash,
        "threshold_sensitivity": sensitivity,
    }
    return row, analysis


def evaluate(args: argparse.Namespace) -> int:
    _, evaluator, manifest, _, spec, opening_hash = load_controls(args)
    run_manifest_bytes = args.run_manifest.read_bytes()
    run_manifest = json.loads(run_manifest_bytes)
    rows = []
    sensitivity_rows = []
    invalid_rows = list(run_manifest["invalid_generation_records"])
    for entry in run_manifest["raw_artifacts"]:
        path = Path(entry["path"])
        data = path.read_bytes()
        if sha256_bytes(data) != entry["sha256"]:
            raise Level1CError(f"RAW_HASH_MISMATCH {path}")
        try:
            row, _ = one_run_result(evaluator, json.loads(data), entry["sha256"], manifest, spec)
        except evaluator.EvaluationError as exc:
            invalid_rows.append({"error": str(exc), "run_id": entry["run_id"],
                                 "status": "INVALID_EVALUATION_INPUT"})
            continue
        if entry["purpose"] == "primary":
            rows.append(row)
        else:
            sensitivity_rows.append(row)
    result = {
        "artifact_type": "LEVEL1C_RUN_LEVEL_RESULTS",
        "evaluation_opening_record_sha256": opening_hash,
        "evaluator_source_sha256": EVALUATOR_HASH,
        "evaluator_spec_sha256": SPEC_HASH,
        "fixed_thresholds": {"R": R_THRESHOLD, "V": V_THRESHOLD},
        "invalid_run_records": invalid_rows,
        "primary_run_results": rows,
        "run_manifest_sha256": sha256_bytes(run_manifest_bytes),
        "sensitivity_run_results": sensitivity_rows,
        "status": "FIXED_EVALUATOR_APPLIED_NO_RETUNING",
    }
    data = evaluator.canonical_bytes(result)
    status = evaluator.write_immutable(args.run_results, data)
    print(json.dumps({"output": str(args.run_results), "sha256": sha256_bytes(data),
                      "status": status}, sort_keys=True))
    return 0


def safe_ratio(numerator: int, denominator: int) -> float | None:
    return None if denominator == 0 else numerator / denominator


def distribution(values: list[float]) -> dict[str, Any]:
    if not values:
        return {"count": 0, "empirical_95_interval": None, "iqr": None, "median": None}
    array = np.asarray(values, dtype=np.float64)
    return {
        "count": len(values),
        "empirical_95_interval": np.quantile(array, [0.025, 0.975], method="linear").tolist(),
        "iqr": np.quantile(array, [0.25, 0.75], method="linear").tolist(),
        "median": float(np.median(array)),
    }


def counts(rows: list[dict]) -> dict[str, int]:
    event = sum(row["event"]["status"] == "CONFIRMED" for row in rows)
    result = {"EVENT_FREE_RUNS": len(rows) - event, "EVENT_RUNS": event,
              "INVALID_RUNS": 0, "TOTAL_EVALUATION_RUNS": len(rows), "VALID_RUNS": len(rows)}
    for name in ("R", "V"):
        result[f"{name}_DETECTIONS"] = sum(row[name]["status"] == "CONFIRMED" for row in rows)
        result[f"{name}_TRUE_POSITIVES"] = sum(row[name]["true_positive"] for row in rows)
        result[f"{name}_FALSE_POSITIVES"] = sum(row[name]["false_positive"] for row in rows)
        result[f"{name}_FALSE_NEGATIVES"] = sum(row[name]["false_negative"] for row in rows)
        result[f"{name}_ACTIONABLE_DETECTIONS"] = sum(row[name]["actionable"] for row in rows)
    return result


def indicator_metrics(rows: list[dict], name: str, raw_counts: dict) -> dict[str, Any]:
    leads = [row[name]["lead"] for row in rows if row[name]["actionable"]]
    return {
        "actionable_lead": distribution(leads),
        "false_positive_rate": safe_ratio(raw_counts[f"{name}_FALSE_POSITIVES"],
                                          raw_counts["EVENT_FREE_RUNS"]),
        "precision": safe_ratio(raw_counts[f"{name}_TRUE_POSITIVES"],
                                raw_counts[f"{name}_DETECTIONS"]),
        "recall": safe_ratio(raw_counts[f"{name}_TRUE_POSITIVES"], raw_counts["EVENT_RUNS"]),
        "raw_counts": {key: value for key, value in raw_counts.items() if key.startswith(name)},
    }


def group_summary(rows: list[dict], key_function: Any) -> dict[str, Any]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        grouped[str(key_function(row))].append(row)
    output = {}
    for key in sorted(grouped):
        group_rows = grouped[key]
        group_counts = counts(group_rows)
        output[key] = {"counts": group_counts, "R": indicator_metrics(group_rows, "R", group_counts),
                       "V": indicator_metrics(group_rows, "V", group_counts)}
    return output


def sign(value: float | None) -> int | None:
    if value is None:
        return None
    return 1 if value > 0 else -1 if value < 0 else 0


def deterministic_sensitivity(primary: list[dict], fine: list[dict]) -> dict[str, Any]:
    primary_by_path = {row["metadata"]["path_id"]: row for row in primary
                       if row["metadata"]["mode"] == "deterministic"}
    fine_by_path = {row["metadata"]["path_id"]: row for row in fine}
    matched = sorted(set(primary_by_path) & set(fine_by_path))
    rate_changes = {}
    differences = []
    for field in ("event", "R", "V"):
        if field == "event":
            p = sum(primary_by_path[x][field]["status"] == "CONFIRMED" for x in matched) / len(matched)
            f = sum(fine_by_path[x][field]["status"] == "CONFIRMED" for x in matched) / len(matched)
        else:
            p = sum(primary_by_path[x][field]["actionable"] for x in matched) / len(matched)
            f = sum(fine_by_path[x][field]["actionable"] for x in matched) / len(matched)
        difference = abs(f - p)
        differences.append(difference)
        rate_changes[field] = {"absolute_change": difference, "primary": p, "sensitivity": f}
    lead = {}
    for name in ("R", "V"):
        p_values = [primary_by_path[x][name]["lead"] for x in matched
                    if primary_by_path[x][name]["actionable"]]
        f_values = [fine_by_path[x][name]["lead"] for x in matched
                    if fine_by_path[x][name]["actionable"]]
        p_median = distribution(p_values)["median"]
        f_median = distribution(f_values)["median"]
        absolute = None if p_median is None or f_median is None else abs(f_median - p_median)
        relative = None if absolute is None or p_median == 0 else absolute / abs(p_median)
        lead[name] = {"absolute_change": absolute, "primary_median": p_median,
                      "relative_change": relative, "sensitivity_median": f_median}
    return {"lead_changes": lead, "matched_paths": len(matched),
            "maximum_classification_rate_change": max(differences), "rate_changes": rate_changes,
            "stochastic": "NOT_COMPARABLE_OWNER_REVIEW_REQUIRED"}


def aggregate_result(run_level: dict, manifest: dict, evaluator: Any, spec: dict) -> tuple[dict, dict]:
    rows = run_level["primary_run_results"]
    raw_counts = counts(rows)
    raw_counts["INVALID_RUNS"] = len(run_level["invalid_run_records"])
    raw_counts["TOTAL_EVALUATION_RUNS"] += raw_counts["INVALID_RUNS"]
    metrics_r = indicator_metrics(rows, "R", raw_counts)
    metrics_v = indicator_metrics(rows, "V", raw_counts)
    paired_rows = [row for row in rows if row["Delta_L"] is not None]
    paired_values = [row["Delta_L"] for row in paired_rows]
    pairs_by_path: dict[str, list[float]] = defaultdict(list)
    for row in paired_rows:
        pairs_by_path[row["metadata"]["path_id"]].append(row["Delta_L"])
    bootstrap = evaluator.paired_stratified_bootstrap(dict(pairs_by_path), spec)
    paired = {"Delta_L": distribution(paired_values), "bootstrap": bootstrap}

    primary_sign = sign(paired["Delta_L"]["median"])
    threshold_direction = {}
    for label in ("minus_10_percent", "plus_10_percent"):
        values = [row["threshold_sensitivity"][label]["Delta_L"] for row in rows
                  if row["threshold_sensitivity"][label]["Delta_L"] is not None]
        effect = distribution(values)["median"]
        threshold_direction[label] = {
            "direction_preserved": primary_sign is not None and primary_sign != 0
            and sign(effect) == primary_sign,
            "median_Delta_L": effect,
        }
    path_rates = {p["path_id"]: p["ramp_rate"]
                  for p in manifest["partitions"]["evaluation"]["stress_paths"]}
    by_rate: dict[str, list[float]] = defaultdict(list)
    for row in paired_rows:
        rate_value = path_rates[row["metadata"]["path_id"]]
        if rate_value != 0:
            by_rate[str(rate_value)].append(row["Delta_L"])
    rate_direction = {}
    for rate_value, values in sorted(by_rate.items()):
        effect = distribution(values)["median"]
        rate_direction[rate_value] = {"direction_preserved": primary_sign is not None
                                      and primary_sign != 0 and sign(effect) == primary_sign,
                                      "median_Delta_L": effect}

    sensitivity = deterministic_sensitivity(rows, run_level["sensitivity_run_results"])
    gates = {}
    gates["1_adequate_counts"] = "PASS" if raw_counts["EVENT_RUNS"] >= 30 and raw_counts[
        "EVENT_FREE_RUNS"] >= 30 else "FAIL_INCONCLUSIVE"
    gates["2_recall"] = "UNDEFINED" if metrics_r["recall"] is None or metrics_v["recall"] is None else (
        "PASS" if metrics_r["recall"] >= metrics_v["recall"] - 0.05 else "FAIL")
    gates["3_false_positive_rate"] = "UNDEFINED" if metrics_r["false_positive_rate"] is None or metrics_v[
        "false_positive_rate"] is None else ("PASS" if metrics_r["false_positive_rate"] <= 0.10 and
        metrics_r["false_positive_rate"] <= metrics_v["false_positive_rate"] + 0.05 else "FAIL")
    interval = bootstrap["interval_95_percentile"]
    median_delta = paired["Delta_L"]["median"]
    gates["4_paired_delta_lead"] = "UNDEFINED" if interval is None or median_delta is None else (
        "PASS" if median_delta > 0 and interval[0] > 0 else "FAIL")
    direction_defined = primary_sign is not None and primary_sign != 0
    direction_pass = direction_defined and all(x["direction_preserved"] for x in threshold_direction.values())
    direction_pass = direction_pass and sum(x["direction_preserved"] for x in rate_direction.values()) >= 2
    gates["5_directional_robustness"] = "UNDEFINED" if not direction_defined else (
        "PASS" if direction_pass else "FAIL")
    relative_changes = [sensitivity["lead_changes"][name]["relative_change"] for name in ("R", "V")]
    gates["6_timestep_sensitivity"] = "UNDEFINED_NOT_COMPARABLE" if any(
        value is None for value in relative_changes
    ) or sensitivity["stochastic"].startswith("NOT_COMPARABLE") else (
        "PASS" if sensitivity["maximum_classification_rate_change"] <= 0.02
        and max(relative_changes) <= 0.10 else "FAIL")
    gates["7_identity_provenance_no_retuning"] = "PASS"

    classifier_input = {
        "candidate_fpr": metrics_r["false_positive_rate"], "candidate_recall": metrics_r["recall"],
        "classification_rate_change": sensitivity["maximum_classification_rate_change"],
        "comparator_fpr": metrics_v["false_positive_rate"], "comparator_recall": metrics_v["recall"],
        "direction_preserved_both_threshold_sensitivities": direction_pass,
        "direction_preserved_rate_strata": sum(x["direction_preserved"] for x in rate_direction.values()),
        "identity_provenance_no_retuning": True,
        "median_lead_relative_change": None if any(x is None for x in relative_changes)
        else max(relative_changes),
        "median_paired_delta_lead": median_delta, "numerical_invalidity": raw_counts["INVALID_RUNS"] > 0,
        "paired_delta_lead_interval_95": interval, "valid_event_runs": raw_counts["EVENT_RUNS"],
        "valid_non_event_runs": raw_counts["EVENT_FREE_RUNS"],
    }
    formal = evaluator.classify_scientific_outcome(classifier_input, spec)
    aggregate = {
        "artifact_type": "LEVEL1C_AGGREGATE_RESULTS",
        "development_comparison": {"development_R_detections": 0,
                                   "development_V_detections": 0,
                                   "development_runs": 357,
                                   "development_terminal_events": 0},
        "directional_sensitivity": {"by_rate": rate_direction, "primary_sign": primary_sign,
                                    "threshold_plus_minus_10_percent": threshold_direction},
        "formal_classifier": formal,
        "frozen_thresholds": {"R": R_THRESHOLD, "V": V_THRESHOLD},
        "metrics": {"R": metrics_r, "V": metrics_v, "paired": paired},
        "numerical_sensitivity": sensitivity,
        "path_stratified": group_summary(rows, lambda row: row["metadata"]["path_id"]),
        "raw_counts": raw_counts,
        "seed_stratified": group_summary(rows, lambda row: "deterministic" if row["metadata"]["seed"] is None
                                         else row["metadata"]["seed"]),
        "seven_pass_gates": gates,
        "status": "AGGREGATED_WITHOUT_RETUNING",
    }
    outcome = formal["outcome"]
    route = {"PASS": "CANDIDATE_FOR_INDEPENDENT_REPLICATION",
             "FAIL": "HYPOTHESIS_REFUTED_AT_LEVEL1_SCOPE",
             "INCONCLUSIVE": "NEW_PROTOCOL_REQUIRED_FOR_IDENTIFIABILITY"}[outcome]
    outcome_record = {
        "artifact_type": "LEVEL1C_SCIENTIFIC_OUTCOME",
        "formal_classifier": formal,
        "outcome": outcome,
        "recommended_route": route,
        "scope": "frozen synthetic four-node Level-1 system only",
        "seven_pass_gates": gates,
        "status": f"LEVEL1C_COMPLETE_{outcome}",
    }
    return aggregate, outcome_record


def aggregate(args: argparse.Namespace) -> int:
    _, evaluator, manifest, _, spec, _ = load_controls(args)
    run_level_bytes = args.run_results.read_bytes()
    run_level = json.loads(run_level_bytes)
    aggregate_value, outcome_value = aggregate_result(run_level, manifest, evaluator, spec)
    aggregate_value["run_level_results_sha256"] = sha256_bytes(run_level_bytes)
    aggregate_data = evaluator.canonical_bytes(aggregate_value)
    outcome_value["aggregate_results_sha256"] = sha256_bytes(aggregate_data)
    outcome_data = evaluator.canonical_bytes(outcome_value)
    aggregate_status = evaluator.write_immutable(args.aggregate_results, aggregate_data)
    outcome_status = evaluator.write_immutable(args.outcome, outcome_data)
    print(json.dumps({"aggregate_sha256": sha256_bytes(aggregate_data),
                      "aggregate_status": aggregate_status,
                      "outcome": outcome_value["outcome"],
                      "outcome_sha256": sha256_bytes(outcome_data),
                      "outcome_status": outcome_status}, sort_keys=True))
    return 0


def common_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--base-manifest", type=Path, required=True)
    parser.add_argument("--amendment", type=Path, required=True)
    parser.add_argument("--spec", type=Path, required=True)
    parser.add_argument("--level1b-hash-manifest", type=Path, required=True)
    parser.add_argument("--simulator", type=Path, required=True)
    parser.add_argument("--evaluator", type=Path, required=True)
    parser.add_argument("--opening-record", type=Path, required=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    generate_parser = subparsers.add_parser("generate")
    common_arguments(generate_parser)
    generate_parser.add_argument("--raw-dir", type=Path, required=True)
    generate_parser.add_argument("--run-manifest", type=Path, required=True)
    evaluate_parser = subparsers.add_parser("evaluate")
    common_arguments(evaluate_parser)
    evaluate_parser.add_argument("--run-manifest", type=Path, required=True)
    evaluate_parser.add_argument("--run-results", type=Path, required=True)
    aggregate_parser = subparsers.add_parser("aggregate")
    common_arguments(aggregate_parser)
    aggregate_parser.add_argument("--run-results", type=Path, required=True)
    aggregate_parser.add_argument("--aggregate-results", type=Path, required=True)
    aggregate_parser.add_argument("--outcome", type=Path, required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    return {"generate": generate, "evaluate": evaluate, "aggregate": aggregate}[args.command](args)


if __name__ == "__main__":
    raise SystemExit(main())
