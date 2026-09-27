#!/usr/bin/env python3
"""Frozen AXIS08-QRR-01 Phase B IEEE-9/14 representation-fidelity audit."""
from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
CORE = ROOT.parents[4] / "10 NEXAH CORE" / "NEXAH"
SOURCE = CORE / "APPLICATIONS" / "power_systems" / "ieee_geometry_v1"
TOL = 1e-12
SQRT2 = np.sqrt(2.0)
FEATURES8 = [
    "mean_bus_voltage",
    "bus_voltage_std",
    "bus_angle_range",
    "maximum_line_loading",
    "total_bus_consumption_p",
    "total_bus_consumption_q",
    "minimum_bus_voltage",
    "maximum_bus_voltage",
]


def load_frames(name: str) -> dict:
    return json.loads((SOURCE / name).read_text())


def bus_view(frame: dict) -> dict:
    return next(view for view in frame["entity_views"] if view["entity_scope"] == "bus")


def line_view(frame: dict) -> dict:
    return next(view for view in frame["entity_views"] if view["entity_scope"] == "line")


def derived_row(frame: dict) -> tuple[np.ndarray, float]:
    names = frame["system_features"]["feature_names"]
    maintained = dict(zip(names, frame["system_features"]["values"]))
    view = bus_view(frame)
    vm_index = view["variable_names"].index("vm_pu")
    va_index = view["variable_names"].index("va_degree")
    p_index = view["variable_names"].index("p_mw")
    q_index = view["variable_names"].index("q_mvar")
    bus_values = np.asarray(view["values"], dtype=float)
    vm, va = bus_values[:, vm_index], bus_values[:, va_index]
    p, reactive = bus_values[:, p_index], bus_values[:, q_index]
    lines = line_view(frame)
    loading_index = lines["variable_names"].index("loading_percent")
    loading = np.asarray(lines["values"], dtype=float)[:, loading_index]
    row = np.asarray([
        maintained["mean_bus_voltage"],
        maintained["bus_voltage_std"],
        maintained["bus_angle_range"],
        maintained["maximum_line_loading"],
        maintained["total_bus_consumption_p"],
        maintained["total_bus_consumption_q"],
        maintained["minimum_bus_voltage"],
        float(np.max(vm)),
    ])
    checks = [
        abs(float(np.min(vm)) - maintained["minimum_bus_voltage"]),
        abs(float(np.mean(vm)) - maintained["mean_bus_voltage"]),
        abs(float(np.std(vm)) - maintained["bus_voltage_std"]),
        abs(float(np.max(va) - np.min(va)) - maintained["bus_angle_range"]),
        abs(float(np.max(loading)) - maintained["maximum_line_loading"]),
        abs(float(np.sum(p[p > 0])) - maintained["total_bus_consumption_p"]),
        abs(float(np.sum(reactive[reactive > 0])) - maintained["total_bus_consumption_q"]),
    ]
    return row, max(checks)


def campaign(payload: dict) -> tuple[np.ndarray, np.ndarray, int]:
    rows, scales, source_errors = [], [], []
    failed = 0
    for frame in payload["frames"]:
        if frame["status"] != "converged":
            failed += 1
            continue
        row, err = derived_row(frame)
        rows.append(row)
        scales.append(frame["load_scale"])
        source_errors.append(err)
    return np.asarray(rows), np.asarray(scales), failed, max(source_errors, default=0.0)


def fit_standardization(x: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    mean, scale = x.mean(axis=0), x.std(axis=0)
    if np.any(scale <= 0):
        raise ValueError("zero-variance development feature")
    return mean, scale


def q_only(z: np.ndarray) -> np.ndarray:
    return np.column_stack([z[:, :6], (z[:, 6] + z[:, 7]) / SQRT2])


def q_plus_r(z: np.ndarray) -> np.ndarray:
    return np.column_stack([q_only(z), (z[:, 6] - z[:, 7]) / SQRT2])


def qr_decode(encoded: np.ndarray) -> np.ndarray:
    q, r = encoded[:, 6], encoded[:, 7]
    return np.column_stack([encoded[:, :6], (q + r) / SQRT2, (q - r) / SQRT2])


def pairwise_distances(x: np.ndarray) -> np.ndarray:
    delta = x[:, None, :] - x[None, :, :]
    matrix = np.sqrt(np.sum(delta * delta, axis=2))
    return matrix[np.triu_indices(len(x), 1)]


def turns(x: np.ndarray) -> np.ndarray:
    values = []
    for i in range(1, len(x) - 1):
        left, right = x[i] - x[i - 1], x[i + 1] - x[i]
        denom = np.linalg.norm(left) * np.linalg.norm(right)
        if denom <= 0:
            values.append(np.nan)
        else:
            values.append(np.arccos(np.clip(np.dot(left, right) / denom, -1.0, 1.0)))
    return np.asarray(values)


def fidelity(reference: np.ndarray, candidate: np.ndarray) -> dict:
    ref_pairs, cand_pairs = pairwise_distances(reference), pairwise_distances(candidate)
    ref_adj = np.linalg.norm(np.diff(reference, axis=0), axis=1)
    cand_adj = np.linalg.norm(np.diff(candidate, axis=0), axis=1)
    relative_adj = np.abs(cand_adj - ref_adj) / np.maximum(ref_adj, 1e-30)
    ref_turn, cand_turn = turns(reference), turns(candidate)
    return {
        "pair_distance_nrmse": float(np.sqrt(np.mean((cand_pairs - ref_pairs) ** 2)) / np.mean(ref_pairs)),
        "pair_distance_correlation": float(np.corrcoef(ref_pairs, cand_pairs)[0, 1]),
        "adjacent_relative_error_median": float(np.median(relative_adj)),
        "adjacent_relative_error_max": float(np.max(relative_adj)),
        "path_length_relative_error": float(abs(np.sum(cand_adj) - np.sum(ref_adj)) / np.sum(ref_adj)),
        "turn_angle_mae_degrees": float(np.degrees(np.nanmean(np.abs(cand_turn - ref_turn)))),
        "pair_distance_max_abs_error": float(np.max(np.abs(cand_pairs - ref_pairs))),
    }


def main() -> None:
    protocol_bytes = (ROOT / "phase_b_protocol.json").read_bytes()
    dev_payload = load_frames("development_frames.json")
    eval_payload = load_frames("evaluation_frames.json")
    dev_raw, dev_axis, dev_failed, dev_source_error = campaign(dev_payload)
    eval_raw, eval_axis, eval_failed, eval_source_error = campaign(eval_payload)
    mean8, scale8 = fit_standardization(dev_raw)
    dev_z, eval_z = (dev_raw - mean8) / scale8, (eval_raw - mean8) / scale8

    # Frozen fitted comparisons: all fit on IEEE-9 and applied unchanged to IEEE-14.
    _, _, vt = np.linalg.svd(dev_z, full_matrices=False)
    pca_basis = vt[:7].T
    rng = np.random.default_rng(8208)
    random_basis, _ = np.linalg.qr(rng.normal(size=(8, 7)))

    maintained_dev_raw = np.column_stack([dev_raw[:, 6], dev_raw[:, :6]])
    maintained_eval_raw = np.column_stack([eval_raw[:, 6], eval_raw[:, :6]])
    maintained_mean, maintained_scale = fit_standardization(maintained_dev_raw)

    def representations(z: np.ndarray, raw: np.ndarray, maintained_raw: np.ndarray) -> dict[str, np.ndarray]:
        return {
            "FULL8": z,
            "Q_ONLY7": q_only(z),
            "Q_PLUS_R8": q_plus_r(z),
            "PCA7": z @ pca_basis,
            "RANDOM7": z @ random_basis,
            "DROP_MIN7": z[:, [0, 1, 2, 3, 4, 5, 7]],
            "DROP_MAX7": z[:, :7],
            "MAINTAINED7": (maintained_raw - maintained_mean) / maintained_scale,
        }

    metrics_rows = []
    results = {}
    for case_id, z, raw, maintained_raw, axis, failed in [
        ("ieee9", dev_z, dev_raw, maintained_dev_raw, dev_axis, dev_failed),
        ("ieee14", eval_z, eval_raw, maintained_eval_raw, eval_axis, eval_failed),
    ]:
        reps = representations(z, raw, maintained_raw)
        case_results = {}
        for name, candidate in reps.items():
            item = fidelity(z, candidate)
            item["stored_scalars"] = int(candidate.shape[1])
            case_results[name] = item
            metrics_rows.append([case_id, name, item["stored_scalars"], *[item[key] for key in (
                "pair_distance_nrmse", "pair_distance_correlation", "adjacent_relative_error_median",
                "adjacent_relative_error_max", "path_length_relative_error", "turn_angle_mae_degrees",
                "pair_distance_max_abs_error")]])
        decoded_z = qr_decode(reps["Q_PLUS_R8"])
        decoded_raw = decoded_z * scale8 + mean8
        case_results["Q_PLUS_R8"]["standardized_reconstruction_max_error"] = float(np.max(np.abs(decoded_z - z)))
        case_results["Q_PLUS_R8"]["raw_reconstruction_max_error"] = float(np.max(np.abs(decoded_raw - raw)))
        case_results["frame_count"] = int(len(raw))
        case_results["failed_frame_count"] = int(failed)
        case_results["load_scale_min"] = float(axis.min())
        case_results["load_scale_max_converged"] = float(axis.max())
        results[case_id] = case_results

    kernel = dev_z[: min(8, len(dev_z))].copy()
    amplitudes = np.linspace(0.1, 0.8, len(kernel))
    counterfactual = kernel.copy()
    counterfactual[:, 6] += amplitudes
    counterfactual[:, 7] -= amplitudes
    q_kernel_max = float(np.max(np.linalg.norm(q_only(kernel) - q_only(counterfactual), axis=1)))
    qr_kernel_detection = float(np.mean(np.linalg.norm(q_plus_r(kernel) - q_plus_r(counterfactual), axis=1) > TOL))

    primary = {
        "source_reproduction_max_error": max(dev_source_error, eval_source_error),
        "q_plus_r_standardized_reconstruction_max_error": max(results[c]["Q_PLUS_R8"]["standardized_reconstruction_max_error"] for c in results),
        "q_plus_r_raw_reconstruction_max_error": max(results[c]["Q_PLUS_R8"]["raw_reconstruction_max_error"] for c in results),
        "q_plus_r_pair_distance_max_error": max(results[c]["Q_PLUS_R8"]["pair_distance_max_abs_error"] for c in results),
        "q_only_kernel_max_distance": q_kernel_max,
        "q_plus_r_kernel_detection_rate": qr_kernel_detection,
        "evaluation_refit": False,
    }
    passed = (
        primary["source_reproduction_max_error"] < TOL
        and primary["q_plus_r_standardized_reconstruction_max_error"] < TOL
        and primary["q_plus_r_raw_reconstruction_max_error"] < TOL
        and primary["q_plus_r_pair_distance_max_error"] < TOL
        and primary["q_only_kernel_max_distance"] < TOL
        and primary["q_plus_r_kernel_detection_rate"] == 1.0
        and not primary["evaluation_refit"]
    )
    output = {
        "protocol_id": "AXIS08-QRR-01-PHASE-B-IEEE",
        "protocol_sha256": hashlib.sha256(protocol_bytes).hexdigest(),
        "source_files": {
            name: hashlib.sha256((SOURCE / name).read_bytes()).hexdigest()
            for name in ("case_manifest.json", "development_frames.json", "evaluation_frames.json")
        },
        "feature_names": FEATURES8,
        "status": "PASS" if passed else "FAIL",
        "decision": "IEEE_TRANSFER_REPRESENTATION_FIDELITY_CONFIRMED" if passed else "STOP_PHASE_B_PRIMARY_GATE_FAILED",
        "primary": primary,
        "results": results,
        "nonclaims": [
            "no stability prediction or early warning",
            "no risk, causal, or control claim",
            "no physical identity",
            "no universal superiority",
            "Q_PLUS_R8 is not compression",
        ],
    }
    headers = ["case", "representation", "stored_scalars", "pair_distance_nrmse", "pair_distance_correlation",
               "adjacent_relative_error_median", "adjacent_relative_error_max", "path_length_relative_error",
               "turn_angle_mae_degrees", "pair_distance_max_abs_error"]
    with (ROOT / "phase_b_ieee_metrics.csv").open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(headers)
        writer.writerows(metrics_rows)
    (ROOT / "phase_b_ieee_results.json").write_text(json.dumps(output, indent=2) + "\n")
    print(json.dumps({"status": output["status"], "decision": output["decision"], "metric_rows": len(metrics_rows)}))
    raise SystemExit(0 if passed else 1)


if __name__ == "__main__":
    main()
