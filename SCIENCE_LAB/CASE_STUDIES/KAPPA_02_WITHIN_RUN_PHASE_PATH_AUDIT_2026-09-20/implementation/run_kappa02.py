#!/usr/bin/env python3
"""Execute the sealed KAPPA-02 within-run phase-path audit."""

from __future__ import annotations

import csv
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np


PACKAGE = Path(__file__).resolve().parents[1]
CASES = PACKAGE.parent
SOURCE = CASES / "HZ_FZ_PUBLIC_01_RWTH_SMA_DAMPER_2026-09-15" / "selected"
PHX01 = CASES / "PHX_01_EXTERNAL_E2_PHASE_ANALYSIS_2026-09-20"
CYCLE_SOURCE = PHX01 / "03_CYCLE_PHASE_RECORDS.csv"

EXPECTED = {
    "00_METHOD_FREEZE.md": "3724bfdea5bc2669c09d8a0a30c1bdaa91d3e6911772278c537c2355d45c3d9d",
    "protocol.json": "114ec775ef79bdd4863164733941862e4f5afe8b2f55820610126360ecdcc45a",
    "METHOD_AMENDMENT_01.md": "4498fdbfd55a940778f1a9d39f48461680627576dcebaa58ff04ec8707fc717f",
    "03_CYCLE_PHASE_RECORDS.csv": "907ec0ef4bcde56c53ab39a656a78a4c12bbc6d343dc20732115762f28aa373a",
    "07_4wires_sin20mm_0p5Hz.csv": "36cf6cc994de28fdc32b609dc9fe4b671d154584c0e69bcb1b93631568bc4b61",
    "09_4wires_sin20mm_0p5Hz_after_EQ.csv": "b3274aa7a2dceea186394630b93b80a0f7ea6ca2040d0a4faec8dea3b2cefe8b",
    "08_4wires_sin40mm_1p0Hz.csv": "3e21c2be71089caf4b800c09cb0e7c846772e318791445063bd05e1ee3fd2bae",
    "10_4wires_sin40mm_1p0Hz_after_EQ.csv": "eae1c973b447653642ef0cb3013ab954bd6bbde172b4017bf4388ba9941f0e36",
}

FILES = {
    "07_4wires_sin20mm_0p5Hz.csv": {"pair": "P05_BEFORE_AFTER_EQ", "cut": "A", "frequency_hz": 0.5, "cycles": (1, 10)},
    "09_4wires_sin20mm_0p5Hz_after_EQ.csv": {"pair": "P05_BEFORE_AFTER_EQ", "cut": "B", "frequency_hz": 0.5, "cycles": (1, 10)},
    "08_4wires_sin40mm_1p0Hz.csv": {"pair": "P10_BEFORE_AFTER_EQ", "cut": "A", "frequency_hz": 1.0, "cycles": (2, 9)},
    "10_4wires_sin40mm_1p0Hz_after_EQ.csv": {"pair": "P10_BEFORE_AFTER_EQ", "cut": "B", "frequency_hz": 1.0, "cycles": (2, 9)},
}

FS = 512.0
STEPS_PER_CYCLE = 8
TOL = {"fixed": 0.05, "drift": 0.15, "amplitude": 0.05, "janus": 1e-12}


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def verify() -> None:
    paths = {
        "00_METHOD_FREEZE.md": PACKAGE / "00_METHOD_FREEZE.md",
        "protocol.json": PACKAGE / "protocol.json",
        "METHOD_AMENDMENT_01.md": PACKAGE / "METHOD_AMENDMENT_01.md",
        "03_CYCLE_PHASE_RECORDS.csv": CYCLE_SOURCE,
        **{name: SOURCE / name for name in FILES},
    }
    for name, path in paths.items():
        actual = digest(path)
        if actual != EXPECTED[name]:
            raise RuntimeError(f"hash mismatch for {name}: {actual}")


def wrap_deg(value: Any) -> Any:
    return (np.asarray(value) + 180.0) % 360.0 - 180.0


def circular_mean_deg(values: np.ndarray) -> float:
    z = np.mean(np.exp(1j * np.deg2rad(values)))
    return float(wrap_deg(np.rad2deg(np.angle(z))))


def local_path(
    time: np.ndarray,
    displacement: np.ndarray,
    force: np.ndarray,
    frequency: float,
    sample_rate: float,
    start_sample: int,
    end_sample: int,
) -> list[dict[str, float]]:
    samples = round(sample_rate / frequency)
    step = samples // STEPS_PER_CYCLE
    if samples % STEPS_PER_CYCLE:
        raise RuntimeError("samples per cycle not divisible by steps per cycle")
    window = np.hanning(samples)
    half = samples // 2
    records = []
    for center in range(start_sample + half, end_sample - half + 1, step):
        sl = slice(center - half, center + half)
        t = time[sl]
        omega_t = 2.0 * np.pi * frequency * t
        design = np.column_stack((np.cos(omega_t), np.sin(omega_t), np.ones_like(t)))
        root_weight = np.sqrt(window)
        weighted_design = design * root_weight[:, None]
        d_coefficients = np.linalg.lstsq(weighted_design, displacement[sl] * root_weight, rcond=None)[0]
        f_coefficients = np.linalg.lstsq(weighted_design, force[sl] * root_weight, rcond=None)[0]
        d = complex(d_coefficients[0], -d_coefficients[1])
        f = complex(f_coefficients[0], -f_coefficients[1])
        if abs(d) <= np.finfo(float).tiny or abs(f) <= np.finfo(float).tiny:
            raise RuntimeError("zero local complex amplitude")
        records.append({
            "center_sample": center,
            "center_time_s": float(time[center]),
            "phase_deg": float(wrap_deg(np.rad2deg(np.angle(f / d)))),
            "local_gain": float(abs(f) / abs(d)),
            "displacement_complex_magnitude": float(abs(d)),
            "force_complex_magnitude": float(abs(f)),
        })
    return records


def synthetic_validation() -> dict[str, Any]:
    frequency = 2.0
    sample_rate = 512.0
    cycles = 24
    samples = round(sample_rate / frequency)
    time = np.arange(cycles * samples) / sample_rate
    reference = np.cos(2 * np.pi * frequency * time)

    fixed_phase = 23.0
    fixed_response = np.cos(2 * np.pi * frequency * time + np.deg2rad(fixed_phase))
    fixed = local_path(time, reference, fixed_response, frequency, sample_rate, 0, len(time))
    fixed_error = max(abs(float(wrap_deg(row["phase_deg"] - fixed_phase))) for row in fixed)

    unequal_response = 9.0 * np.cos(2 * np.pi * frequency * time + np.deg2rad(fixed_phase))
    unequal = local_path(time, 0.2 * reference, unequal_response, frequency, sample_rate, 0, len(time))
    unequal_error = max(abs(float(wrap_deg(row["phase_deg"] - fixed_phase))) for row in unequal)

    drift = np.linspace(-2.0, 2.0, len(time))
    drift_response = np.cos(2 * np.pi * frequency * time + np.deg2rad(drift))
    drift_path = local_path(time, reference, drift_response, frequency, sample_rate, 0, len(time))
    endpoint_errors = []
    for row in (drift_path[0], drift_path[-1]):
        expected = float(drift[int(row["center_sample"])])
        endpoint_errors.append(abs(float(wrap_deg(row["phase_deg"] - expected))))
    drift_error = max(endpoint_errors)

    forward = np.asarray([row["phase_deg"] for row in drift_path])
    reverse = wrap_deg(-forward)
    janus_error = float(np.max(np.abs(wrap_deg(forward + reverse))))

    controls = {
        "fixed_phase": {"maximum_error_deg": fixed_error, "tolerance_deg": TOL["fixed"], "passed": fixed_error <= TOL["fixed"]},
        "linear_phase_drift": {"endpoint_maximum_error_deg": drift_error, "tolerance_deg": TOL["drift"], "passed": drift_error <= TOL["drift"]},
        "unequal_amplitudes": {"maximum_error_deg": unequal_error, "tolerance_deg": TOL["amplitude"], "passed": unequal_error <= TOL["amplitude"]},
        "janus_antisymmetry": {"maximum_error_deg": janus_error, "tolerance_deg": TOL["janus"], "passed": janus_error <= TOL["janus"]},
    }
    return {
        "schema": "nexah-kappa02-synthetic-validation/0.1.0",
        "all_controls_passed": all(item["passed"] for item in controls.values()),
        "controls": controls,
    }


def read_table(name: str) -> dict[str, np.ndarray]:
    with (SOURCE / name).open(newline="", encoding="utf-8") as stream:
        rows = list(csv.DictReader(stream))
    columns = ["Time", "Actuator1_Disp", "Actuator1_Force", "Actuator2_Disp", "Actuator2_Force"]
    return {column: np.asarray([float(row[column]) for row in rows]) for column in columns}


def build_paths() -> list[dict[str, Any]]:
    output = []
    for name, meta in FILES.items():
        table = read_table(name)
        samples = round(FS / meta["frequency_hz"])
        start = (meta["cycles"][0] - 1) * samples
        end = meta["cycles"][1] * samples
        for actuator in (1, 2):
            records = local_path(
                table["Time"], table[f"Actuator{actuator}_Disp"], table[f"Actuator{actuator}_Force"],
                meta["frequency_hz"], FS, start, end,
            )
            denominator = max(1, len(records) - 1)
            for index, record in enumerate(records):
                output.append({
                    "source_file": name,
                    "pair": meta["pair"],
                    "cut": meta["cut"],
                    "actuator": actuator,
                    "frequency_hz": meta["frequency_hz"],
                    "active_cycle_first": meta["cycles"][0],
                    "active_cycle_last": meta["cycles"][1],
                    "path_index": index,
                    "normalized_u": index / denominator,
                    **record,
                })
    return output


def build_kappa(paths: list[dict[str, Any]]) -> list[dict[str, Any]]:
    groups: dict[tuple[str, int, str], list[dict[str, Any]]] = {}
    for row in paths:
        groups.setdefault((row["pair"], int(row["actuator"]), row["cut"]), []).append(row)
    output = []
    for pair in sorted({key[0] for key in groups}):
        for actuator in (1, 2):
            a = sorted(groups[(pair, actuator, "A")], key=lambda row: int(row["path_index"]))
            b = sorted(groups[(pair, actuator, "B")], key=lambda row: int(row["path_index"]))
            if [r["center_sample"] for r in a] != [r["center_sample"] for r in b]:
                raise RuntimeError(f"ordinal grids differ for {pair}/a{actuator}")
            for ra, rb in zip(a, b):
                delta = float(wrap_deg(float(rb["phase_deg"]) - float(ra["phase_deg"])))
                reverse = float(wrap_deg(float(ra["phase_deg"]) - float(rb["phase_deg"])))
                output.append({
                    "pair": pair,
                    "actuator": actuator,
                    "path_index": ra["path_index"],
                    "center_sample": ra["center_sample"],
                    "ordinal_time_a_s": ra["center_time_s"],
                    "ordinal_time_b_s": rb["center_time_s"],
                    "normalized_u": ra["normalized_u"],
                    "theta_a_deg": ra["phase_deg"],
                    "theta_b_deg": rb["phase_deg"],
                    "kappa_ordinal_deg": delta,
                    "janus_reverse_deg": reverse,
                    "janus_antisymmetry_error_deg": abs(float(wrap_deg(delta + reverse))),
                    "pairing_status": "ORDINAL_WINDOW_INDEX_NOT_PHYSICAL_SAMPLE_SYNCHRONY",
                })
    return output


def trend(values: np.ndarray, u: np.ndarray) -> dict[str, float]:
    unwrapped = np.rad2deg(np.unwrap(np.deg2rad(values)))
    slope, intercept = np.polyfit(u, unwrapped, 1)
    constant = np.full_like(unwrapped, np.mean(unwrapped))
    linear = intercept + slope * u
    constant_rmse = float(np.sqrt(np.mean((unwrapped - constant) ** 2)))
    linear_rmse = float(np.sqrt(np.mean((unwrapped - linear) ** 2)))
    improvement = 0.0 if constant_rmse == 0 else 1.0 - linear_rmse / constant_rmse
    return {
        "slope_deg_per_normalized_run": float(slope),
        "constant_rmse_deg": constant_rmse,
        "linear_rmse_deg": linear_rmse,
        "linear_rmse_improvement_fraction": float(improvement),
    }


def shape_label(first: float, last: float, slope: float, improvement: float) -> str:
    if abs(slope) <= 0.1 and improvement < 0.1:
        return "CONSTANT_OFFSET_LIKE"
    if slope > 0.1 and abs(last) < abs(first) and improvement >= 0.1:
        return "ORDINAL_RELAXATION_LIKE"
    if slope < -0.1 and abs(last) > abs(first) and improvement >= 0.1:
        return "ORDINAL_DIVERGENCE_LIKE"
    return "NONLINEAR_OR_MIXED_PATH"


def summaries(paths: list[dict[str, Any]], kappa: list[dict[str, Any]]) -> list[dict[str, Any]]:
    path_groups: dict[tuple[str, int, str], list[dict[str, Any]]] = {}
    for row in paths:
        path_groups.setdefault((row["pair"], int(row["actuator"]), row["cut"]), []).append(row)
    kappa_groups: dict[tuple[str, int], list[dict[str, Any]]] = {}
    for row in kappa:
        kappa_groups.setdefault((row["pair"], int(row["actuator"])), []).append(row)

    output = []
    for (pair, actuator), rows in sorted(kappa_groups.items()):
        rows = sorted(rows, key=lambda row: int(row["path_index"]))
        values = np.asarray([float(row["kappa_ordinal_deg"]) for row in rows])
        u = np.asarray([float(row["normalized_u"]) for row in rows])
        count = max(1, math.ceil(len(values) / 4))
        first = circular_mean_deg(values[:count])
        last = circular_mean_deg(values[-count:])
        ktrend = trend(values, u)
        arows = sorted(path_groups[(pair, actuator, "A")], key=lambda row: int(row["path_index"]))
        brows = sorted(path_groups[(pair, actuator, "B")], key=lambda row: int(row["path_index"]))
        atrend = trend(np.asarray([r["phase_deg"] for r in arows]), u)
        btrend = trend(np.asarray([r["phase_deg"] for r in brows]), u)
        output.append({
            "pair": pair,
            "actuator": actuator,
            "path_point_count": len(values),
            "kappa_circular_mean_deg": circular_mean_deg(values),
            "kappa_first_quartile_mean_deg": first,
            "kappa_last_quartile_mean_deg": last,
            "kappa_last_minus_first_quartile_deg": float(wrap_deg(last - first)),
            "kappa_min_deg": float(np.min(values)),
            "kappa_max_deg": float(np.max(values)),
            "kappa_peak_to_peak_deg": float(np.max(values) - np.min(values)),
            **{f"kappa_{key}": value for key, value in ktrend.items()},
            "theta_a_slope_deg_per_normalized_run": atrend["slope_deg_per_normalized_run"],
            "theta_b_slope_deg_per_normalized_run": btrend["slope_deg_per_normalized_run"],
            "maximum_janus_antisymmetry_error_deg": max(float(r["janus_antisymmetry_error_deg"]) for r in rows),
            "shape_classification": shape_label(first, last, ktrend["slope_deg_per_normalized_run"], ktrend["linear_rmse_improvement_fraction"]),
        })
    return output


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    verify()
    synthetic = synthetic_validation()
    (PACKAGE / "01_SYNTHETIC_VALIDATION.json").write_text(json.dumps(synthetic, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    if not synthetic["all_controls_passed"]:
        raise RuntimeError("synthetic gate failed")

    paths = build_paths()
    kappa = build_kappa(paths)
    summary = summaries(paths, kappa)
    write_csv(PACKAGE / "02_LOCAL_PHASE_PATHS.csv", paths)
    write_csv(PACKAGE / "03_KAPPA_ORDINAL_PATHS.csv", kappa)
    write_csv(PACKAGE / "04_PATH_SUMMARY.csv", summary)

    classes = {row["shape_classification"] for row in summary}
    if classes == {"ORDINAL_RELAXATION_LIKE"}:
        classification = "ALL_FOUR_ORDINAL_PATHS_RELAXATION_LIKE"
    elif "ORDINAL_RELAXATION_LIKE" in classes:
        classification = "MIXED_PATHS_WITH_SOME_ORDINAL_RELAXATION"
    else:
        classification = "NO_ORDINAL_RELAXATION_CLASSIFIED"
    result = {
        "schema": "nexah-kappa02-result/0.1.0",
        "mission_id": "KAPPA-02",
        "status": "COMPLETE_POST_HOC_EXPLORATORY",
        "classification": classification,
        "local_phase_path_record_count": len(paths),
        "ordinal_kappa_record_count": len(kappa),
        "path_summary_count": len(summary),
        "shape_classification_counts": {name: sum(row["shape_classification"] == name for row in summary) for name in sorted(classes)},
        "all_janus_antisymmetry_exact": all(float(row["janus_antisymmetry_error_deg"]) == 0.0 for row in kappa),
        "summaries": summary,
        "interpretation_boundary": "Ordinal within-run profile comparison only; not a physically synchronized A-to-B transition path.",
        "claims_not_authorized": [
            "physical path between separate campaigns recovered",
            "causal earthquake effect",
            "frequency effect separated from amplitude",
            "independent-cycle population inference",
            "universal Kappa or modular mechanism",
        ],
        "source_hashes": {name: value for name, value in EXPECTED.items() if name not in {"00_METHOD_FREEZE.md", "protocol.json"}},
    }
    (PACKAGE / "KAPPA02_RESULT.json").write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "classification": classification,
        "local_path_records": len(paths),
        "kappa_records": len(kappa),
        "shape_counts": result["shape_classification_counts"],
    }))


if __name__ == "__main__":
    main()
