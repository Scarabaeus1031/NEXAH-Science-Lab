#!/usr/bin/env python3
"""Hash-bound Level-1B evaluator for frozen raw-state records.

The module contains no simulator and never mutates its inputs.  It implements
only the preregistered/amended indicator, comparator, endpoint, persistence,
calibration, lead, missing-value, and paired-bootstrap rules.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from dataclasses import dataclass
from fractions import Fraction
from pathlib import Path
from typing import Any, Iterable

import numpy as np


BASE_MANIFEST_SHA256 = "d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3"
SERIALIZATION = "canonical-json-utf8-v1"


class EvaluationError(RuntimeError):
    pass


class OutputCollision(RuntimeError):
    pass


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def canonical_bytes(value: Any) -> bytes:
    return (
        json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False,
                   allow_nan=False)
        + "\n"
    ).encode("utf-8")


def write_immutable(path: Path, data: bytes) -> str:
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o444)
    except FileExistsError:
        if path.read_bytes() == data:
            return "ALREADY_PRESENT_IDENTICAL"
        raise OutputCollision(f"LEVEL1B_OUTPUT_COLLISION: {path}")
    with os.fdopen(descriptor, "wb") as handle:
        handle.write(data)
        handle.flush()
        os.fsync(handle.fileno())
    return "CREATED_IMMUTABLE"


def load_frozen_context(
    base_manifest_path: Path, amendment_path: Path, spec_path: Path
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any], str]:
    manifest_bytes = base_manifest_path.read_bytes()
    manifest_hash = sha256_bytes(manifest_bytes)
    if manifest_hash != BASE_MANIFEST_SHA256:
        raise EvaluationError("BASE_MANIFEST_IDENTITY_MISMATCH")
    manifest = json.loads(manifest_bytes)
    if manifest.get("protocol_id") != "NEXAH-EARLY-WARNING-LEVEL1-SYNTHETIC" or manifest.get(
        "protocol_version"
    ) != "1.0.0":
        raise EvaluationError("BASE_PROTOCOL_IDENTITY_MISMATCH")

    amendment_bytes = amendment_path.read_bytes()
    amendment = json.loads(amendment_bytes)
    spec = json.loads(spec_path.read_bytes())
    if sha256_bytes(amendment_bytes) != spec["amendment_sha256"]:
        raise EvaluationError("AMENDMENT_IDENTITY_MISMATCH")
    if amendment["base_manifest_sha256"] != manifest_hash:
        raise EvaluationError("AMENDMENT_BASE_MISMATCH")
    source_hash = sha256_file(Path(__file__).resolve())
    if source_hash != spec["evaluator_source_sha256"]:
        raise EvaluationError("EVALUATOR_SOURCE_IDENTITY_MISMATCH")
    if spec["base_manifest_sha256"] != manifest_hash:
        raise EvaluationError("SPEC_BASE_MISMATCH")
    return manifest, amendment, spec, sha256_bytes(spec_path.read_bytes())


@dataclass(frozen=True)
class Detection:
    onset_index: int
    confirmation_index: int


def phase_coherence(delta: np.ndarray) -> np.ndarray:
    if delta.ndim != 2:
        raise EvaluationError("DELTA_SHAPE_INVALID")
    return np.abs(np.mean(np.exp(1j * delta), axis=1))


def speed_deviation(omega: np.ndarray, inertia: np.ndarray) -> np.ndarray:
    if omega.ndim != 2 or omega.shape[1] != inertia.shape[0]:
        raise EvaluationError("OMEGA_SHAPE_INVALID")
    omega_coi = np.sum(omega * inertia[None, :], axis=1) / float(np.sum(inertia))
    return np.max(np.abs(omega - omega_coi[:, None]), axis=1)


def max_pairwise_angle_separation(delta: np.ndarray) -> np.ndarray:
    return np.max(delta, axis=1) - np.min(delta, axis=1)


def persistence_states(kind: str, dt: float, spec: dict[str, Any]) -> int:
    primary_dt = float(spec["primary_dt"])
    sensitivity_dt = float(spec["sensitivity_dt"])
    if math.isclose(dt, primary_dt, rel_tol=0.0, abs_tol=0.0):
        return int(spec["primary_persistence_states"][kind])
    if math.isclose(dt, sensitivity_dt, rel_tol=0.0, abs_tol=0.0):
        return int(spec["sensitivity_persistence_states"][kind])
    raise EvaluationError(f"UNREGISTERED_DT: {dt}")


def first_persistent(condition: np.ndarray, states: int, minimum_start: int = 0) -> Detection | None:
    if condition.ndim != 1 or states < 1:
        raise EvaluationError("PERSISTENCE_INPUT_INVALID")
    run = 0
    for index, value in enumerate(condition.tolist()):
        if index < minimum_start:
            run = 0
            continue
        if bool(value):
            run += 1
            if run == states:
                return Detection(index - states + 1, index)
        else:
            run = 0
    return None


def first_index_at_or_after(time: np.ndarray, value: float) -> int:
    return int(np.searchsorted(time, value, side="left"))


def lead_fraction(event_index: int, detection_index: int, dt: float) -> Fraction:
    return Fraction(event_index - detection_index) * Fraction(str(dt))


def actionable(lead: Fraction, spec: dict[str, Any]) -> bool:
    low, high = spec["actionable_horizon"]
    return Fraction(str(low)) <= lead <= Fraction(str(high))


def detection_record(detection: Detection | None, time: np.ndarray) -> dict[str, Any]:
    if detection is None:
        return {"confirmation_index": None, "confirmation_time": None,
                "onset_index": None, "onset_time": None, "status": "NO_DETECTION"}
    return {
        "confirmation_index": detection.confirmation_index,
        "confirmation_time": float(time[detection.confirmation_index]),
        "onset_index": detection.onset_index,
        "onset_time": float(time[detection.onset_index]),
        "status": "CONFIRMED",
    }


def validate_raw_payload(
    payload: dict[str, Any], manifest: dict[str, Any], raw_hash: str
) -> tuple[np.ndarray, np.ndarray, np.ndarray, float]:
    metadata = payload.get("metadata", {})
    if metadata.get("manifest_sha256") != BASE_MANIFEST_SHA256:
        raise EvaluationError("RAW_BASE_MANIFEST_MISMATCH")
    partition = metadata.get("partition")
    if partition not in manifest["partitions"]:
        raise EvaluationError("RAW_PARTITION_INVALID")
    if metadata.get("run_status") != "VALID_RAW_STATE":
        raise EvaluationError("RAW_STATUS_INVALID")
    raw = payload.get("raw", {})
    time = np.asarray(raw.get("time"), dtype=np.float64)
    delta = np.asarray(raw.get("delta"), dtype=np.float64)
    omega = np.asarray(raw.get("omega"), dtype=np.float64)
    if time.ndim != 1 or delta.shape != omega.shape or delta.shape[0] != time.shape[0]:
        raise EvaluationError("RAW_ARRAY_SHAPE_INVALID")
    if delta.shape[1] != int(manifest["model"]["node_count"]):
        raise EvaluationError("RAW_NODE_COUNT_INVALID")
    if not all(np.all(np.isfinite(x)) for x in (time, delta, omega)):
        raise EvaluationError("RAW_NONFINITE")
    dt = float(metadata.get("dt"))
    expected_time = np.arange(time.shape[0], dtype=np.float64) * dt
    if not np.array_equal(time, expected_time):
        raise EvaluationError("RAW_TIME_GRID_INVALID")
    if raw_hash != sha256_bytes(canonical_bytes(payload)):
        raise EvaluationError("RAW_CANONICAL_BYTES_IDENTITY_MISMATCH")
    return time, delta, omega, dt


def base_run_analysis(
    payload: dict[str, Any], manifest: dict[str, Any], spec: dict[str, Any], raw_hash: str
) -> dict[str, Any]:
    time, delta, omega, dt = validate_raw_payload(payload, manifest, raw_hash)
    r_values = phase_coherence(delta)
    v_values = speed_deviation(omega, np.asarray(manifest["model"]["inertia"], dtype=np.float64))
    separation = max_pairwise_angle_separation(delta)
    event = first_persistent(
        separation > math.pi, persistence_states("event", dt, spec), minimum_start=0
    )
    return {
        "dt": dt,
        "event": event,
        "metadata": dict(payload["metadata"]),
        "r": r_values,
        "raw_sha256": raw_hash,
        "time": time,
        "v": v_values,
    }


def threshold_detection(
    analysis: dict[str, Any], threshold: float, indicator: str, spec: dict[str, Any]
) -> dict[str, Any]:
    time = analysis["time"]
    start = first_index_at_or_after(time, float(spec["stress_onset"]))
    if indicator == "R":
        condition = analysis["r"] < threshold
    elif indicator == "V":
        condition = analysis["v"] > threshold
    else:
        raise EvaluationError("INDICATOR_INVALID")
    detection = first_persistent(
        condition, persistence_states("warning_alarm", analysis["dt"], spec), start
    )
    event = analysis["event"]
    lead = None
    is_actionable = False
    if detection is not None and event is not None:
        lead_exact = lead_fraction(event.onset_index, detection.onset_index, analysis["dt"])
        lead = float(lead_exact)
        is_actionable = actionable(lead_exact, spec)
    return {"actionable": is_actionable, "detection": detection, "lead": lead}


def median_or_none(values: Iterable[float]) -> float | None:
    values_list = list(values)
    return None if not values_list else float(np.median(np.asarray(values_list, dtype=np.float64)))


def threshold_metrics(
    analyses: list[dict[str, Any]], threshold: float, indicator: str, spec: dict[str, Any]
) -> dict[str, Any]:
    event_runs = 0
    event_actionable = 0
    non_event_runs = 0
    non_event_detections = 0
    leads: list[float] = []
    for analysis in analyses:
        result = threshold_detection(analysis, threshold, indicator, spec)
        if analysis["event"] is None:
            non_event_runs += 1
            if result["detection"] is not None:
                non_event_detections += 1
        else:
            event_runs += 1
            if result["actionable"]:
                event_actionable += 1
                leads.append(result["lead"])
    fpr = None if non_event_runs == 0 else non_event_detections / non_event_runs
    recall = None if event_runs == 0 else event_actionable / event_runs
    return {
        "actionable_detections": event_actionable,
        "event_runs": event_runs,
        "false_positive_rate": fpr,
        "median_actionable_lead": median_or_none(leads),
        "non_event_detections": non_event_detections,
        "non_event_runs": non_event_runs,
        "recall": recall,
        "threshold": threshold,
    }


def calibration_grid(spec: dict[str, Any], indicator: str) -> list[float]:
    grid = spec["threshold_grids"][indicator]
    start, stop, step = (int(grid[key]) for key in ("start_hundredths", "stop_hundredths", "step_hundredths"))
    return [value / 100.0 for value in range(start, stop + 1, step)]


def calibrate(
    analyses: list[dict[str, Any]], indicator: str, spec: dict[str, Any]
) -> dict[str, Any]:
    table = [threshold_metrics(analyses, threshold, indicator, spec)
             for threshold in calibration_grid(spec, indicator)]
    eligible = [row for row in table if row["false_positive_rate"] is not None
                and row["false_positive_rate"] <= float(spec["development_fpr_maximum"])]
    if not eligible:
        return {"selected_threshold": None, "status": "INDICATOR_UNAVAILABLE", "table": table}

    def key(row: dict[str, Any]) -> tuple[Any, ...]:
        recall = -1.0 if row["recall"] is None else row["recall"]
        lead_defined = row["median_actionable_lead"] is not None
        lead = -math.inf if not lead_defined else row["median_actionable_lead"]
        final_threshold = -row["threshold"] if indicator == "R" else row["threshold"]
        return (recall, lead_defined, lead, -row["false_positive_rate"], final_threshold)

    selected = max(eligible, key=key)
    return {"selected_metrics": selected, "selected_threshold": selected["threshold"],
            "status": "THRESHOLD_SELECTED", "table": table}


def paired_stratified_bootstrap(
    pairs_by_path: dict[str, list[float]], spec: dict[str, Any]
) -> dict[str, Any]:
    bootstrap = spec["bootstrap"]
    rng = np.random.Generator(np.random.PCG64(int(bootstrap["seed"])))
    replicate_values: list[float] = []
    undefined = 0
    for _ in range(int(bootstrap["replicates"])):
        sampled: list[float] = []
        for path_id in sorted(pairs_by_path):
            values = np.asarray(pairs_by_path[path_id], dtype=np.float64)
            if values.size:
                sampled.extend(rng.choice(values, size=values.size, replace=True).tolist())
        if sampled:
            replicate_values.append(float(np.median(np.asarray(sampled, dtype=np.float64))))
        else:
            undefined += 1
    interval = None
    if replicate_values:
        interval = np.quantile(
            np.asarray(replicate_values), [0.025, 0.975], method="linear"
        ).tolist()
    return {"defined_replicates": len(replicate_values), "interval_95_percentile": interval,
            "replicates": int(bootstrap["replicates"]), "seed": int(bootstrap["seed"]),
            "undefined_replicates": undefined}


def classify_scientific_outcome(metrics: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    """Apply the frozen joint gates to a future sealed aggregate, never development."""
    gates = spec["scientific_outcome_gates"]
    if not metrics.get("identity_provenance_no_retuning", False):
        return {"outcome": "INCONCLUSIVE", "reason": "IDENTITY_PROVENANCE_OR_RETUNING_GATE"}
    if metrics.get("numerical_invalidity", False):
        return {"outcome": "INCONCLUSIVE", "reason": "NUMERICAL_INVALIDITY"}
    if metrics.get("valid_event_runs", 0) < gates["minimum_event_runs"] or metrics.get(
        "valid_non_event_runs", 0
    ) < gates["minimum_non_event_runs"]:
        return {"outcome": "INCONCLUSIVE", "reason": "INSUFFICIENT_EVENT_OR_NON_EVENT_RUNS"}
    interval = metrics.get("paired_delta_lead_interval_95")
    required_defined = [metrics.get("candidate_recall"), metrics.get("comparator_recall"),
                        metrics.get("candidate_fpr"), metrics.get("comparator_fpr"),
                        metrics.get("median_paired_delta_lead")]
    if interval is None or any(value is None for value in required_defined):
        return {"outcome": "INCONCLUSIVE", "reason": "REQUIRED_STATISTIC_UNDEFINED"}
    substantive = {
        "recall": metrics["candidate_recall"]
        >= metrics["comparator_recall"] - gates["maximum_recall_deficit"],
        "fpr": metrics["candidate_fpr"] <= gates["candidate_fpr_maximum"]
        and metrics["candidate_fpr"]
        <= metrics["comparator_fpr"] + gates["maximum_fpr_excess"],
        "delta_lead": metrics["median_paired_delta_lead"] > 0 and interval[0] > 0,
        "direction": bool(metrics.get("direction_preserved_both_threshold_sensitivities"))
        and int(metrics.get("direction_preserved_rate_strata", 0))
        >= gates["minimum_direction_preserved_rate_strata"],
        "numerical": metrics.get("classification_rate_change") is not None
        and metrics["classification_rate_change"] <= gates["maximum_classification_rate_change"]
        and metrics.get("median_lead_relative_change") is not None
        and metrics["median_lead_relative_change"] <= gates["maximum_median_lead_relative_change"],
    }
    failed = sorted(name for name, passed in substantive.items() if not passed)
    return {"outcome": "PASS" if not failed else "FAIL", "failed_gates": failed,
            "gate_results": substantive}


def summarize_selected(
    analyses: list[dict[str, Any]], r_threshold: float | None, v_threshold: float | None,
    spec: dict[str, Any]
) -> tuple[list[dict[str, Any]], dict[str, list[float]]]:
    summaries = []
    paired_by_path: dict[str, list[float]] = {}
    for analysis in analyses:
        r_result = None if r_threshold is None else threshold_detection(analysis, r_threshold, "R", spec)
        v_result = None if v_threshold is None else threshold_detection(analysis, v_threshold, "V", spec)
        event_record = detection_record(analysis["event"], analysis["time"])
        row = {
            "event": event_record,
            "metadata": analysis["metadata"],
            "raw_sha256": analysis["raw_sha256"],
            "R": None if r_result is None else {
                **detection_record(r_result["detection"], analysis["time"]),
                "actionable": r_result["actionable"], "lead": r_result["lead"],
                "maximum": float(np.max(analysis["r"])), "minimum": float(np.min(analysis["r"])),
            },
            "V": None if v_result is None else {
                **detection_record(v_result["detection"], analysis["time"]),
                "actionable": v_result["actionable"], "lead": v_result["lead"],
                "maximum": float(np.max(analysis["v"])), "minimum": float(np.min(analysis["v"])),
            },
        }
        if r_result and v_result and r_result["actionable"] and v_result["actionable"]:
            path_id = analysis["metadata"]["path_id"]
            paired_by_path.setdefault(path_id, []).append(r_result["lead"] - v_result["lead"])
        summaries.append(row)
    return summaries, paired_by_path


def evaluate_directory(
    raw_paths: list[Path], manifest: dict[str, Any], spec: dict[str, Any], spec_hash: str,
    partition_filter: str, dt_filter: float,
) -> dict[str, Any]:
    analyses = []
    for path in sorted(raw_paths):
        data = path.read_bytes()
        payload = json.loads(data)
        metadata = payload.get("metadata", {})
        if metadata.get("partition") != partition_filter or float(metadata.get("dt")) != dt_filter:
            continue
        analyses.append(base_run_analysis(payload, manifest, spec, sha256_bytes(data)))
    if not analyses:
        raise EvaluationError("NO_RAW_INPUTS")
    partitions = sorted({a["metadata"]["partition"] for a in analyses})
    if len(partitions) != 1:
        raise EvaluationError("MIXED_PARTITIONS_FORBIDDEN")
    r_calibration = calibrate(analyses, "R", spec)
    v_calibration = calibrate(analyses, "V", spec)
    summaries, paired = summarize_selected(
        analyses, r_calibration["selected_threshold"], v_calibration["selected_threshold"], spec
    )
    event_count = sum(a["event"] is not None for a in analyses)
    path_counts: dict[str, int] = {}
    for analysis in analyses:
        path = analysis["metadata"]["path_id"]
        path_counts[path] = path_counts.get(path, 0) + 1
    return {
        "artifact_type": "LEVEL1B_PARTITION_RESULT",
        "bootstrap_paired_delta_lead": paired_stratified_bootstrap(paired, spec),
        "event_runs": event_count,
        "evaluator_spec_sha256": spec_hash,
        "input_partition": partitions[0],
        "non_event_runs": len(analyses) - event_count,
        "path_counts": path_counts,
        "protocol_amendment_version": "1.0.1",
        "R_calibration": r_calibration,
        "run_count": len(analyses),
        "run_results": summaries,
        "scientific_evaluation": False,
        "status": "DEVELOPMENT_OBSERVATION_NOT_HYPOTHESIS_TEST",
        "V_calibration": v_calibration,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-manifest", type=Path, required=True)
    parser.add_argument("--amendment", type=Path, required=True)
    parser.add_argument("--spec", type=Path, required=True)
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--partition-filter", required=True)
    parser.add_argument("--dt-filter", type=float, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    manifest, _, spec, spec_hash = load_frozen_context(
        args.base_manifest, args.amendment, args.spec
    )
    result = evaluate_directory(
        sorted(args.raw_dir.glob("*.json")), manifest, spec, spec_hash,
        args.partition_filter, args.dt_filter,
    )
    data = canonical_bytes(result)
    disposition = write_immutable(args.output, data)
    print(json.dumps({"output": str(args.output), "sha256": sha256_bytes(data),
                      "status": disposition}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
