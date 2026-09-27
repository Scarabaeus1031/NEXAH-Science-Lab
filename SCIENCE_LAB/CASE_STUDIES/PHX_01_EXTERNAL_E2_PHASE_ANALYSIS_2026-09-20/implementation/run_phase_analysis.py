#!/usr/bin/env python3
"""Deterministic PHX-01 synthetic validation and external E2 phase analysis."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import platform
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import scipy
from scipy.signal import butter, hilbert, sosfiltfilt


PACKAGE = Path(__file__).resolve().parents[1]
REPOSITORY = Path(__file__).resolve().parents[4]
SOURCE = REPOSITORY / "SCIENCE_LAB/CASE_STUDIES/HZ_FZ_PUBLIC_01_RWTH_SMA_DAMPER_2026-09-15"
PROTOCOL_PATH = PACKAGE / "protocol.json"
SYNTHETIC_RESULT = PACKAGE / "01_SYNTHETIC_VALIDATION.json"
EMPIRICAL_RESULT = PACKAGE / "02_EMPIRICAL_PHASE_RESULT.json"
CYCLE_RESULT = PACKAGE / "03_CYCLE_PHASE_RECORDS.csv"

FILES = {
    "07_4wires_sin20mm_0p5Hz.csv": {
        "sha256": "36cf6cc994de28fdc32b609dc9fe4b671d154584c0e69bcb1b93631568bc4b61",
        "pair": "P05_BEFORE_AFTER_EQ", "cut": "A", "frequency_hz": 0.5, "nominal_mm": 20.0,
    },
    "09_4wires_sin20mm_0p5Hz_after_EQ.csv": {
        "sha256": "b3274aa7a2dceea186394630b93b80a0f7ea6ca2040d0a4faec8dea3b2cefe8b",
        "pair": "P05_BEFORE_AFTER_EQ", "cut": "B", "frequency_hz": 0.5, "nominal_mm": 20.0,
    },
    "08_4wires_sin40mm_1p0Hz.csv": {
        "sha256": "3e21c2be71089caf4b800c09cb0e7c846772e318791445063bd05e1ee3fd2bae",
        "pair": "P10_BEFORE_AFTER_EQ", "cut": "A", "frequency_hz": 1.0, "nominal_mm": 40.0,
    },
    "10_4wires_sin40mm_1p0Hz_after_EQ.csv": {
        "sha256": "eae1c973b447653642ef0cb3013ab954bd6bbde172b4017bf4388ba9941f0e36",
        "pair": "P10_BEFORE_AFTER_EQ", "cut": "B", "frequency_hz": 1.0, "nominal_mm": 40.0,
    },
}


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def wrap_deg(value: Any) -> Any:
    return (np.asarray(value) + 180.0) % 360.0 - 180.0


def circular_mean_deg(values: np.ndarray) -> float:
    z = np.mean(np.exp(1j * np.deg2rad(values)))
    return float(wrap_deg(np.rad2deg(np.angle(z))))


def phase_locking_value(values: np.ndarray) -> float:
    return float(abs(np.mean(np.exp(1j * np.deg2rad(values)))))


def circular_std_deg(values: np.ndarray) -> float:
    r = max(phase_locking_value(values), np.finfo(float).tiny)
    return float(np.rad2deg(np.sqrt(-2.0 * np.log(r))))


def circular_error_deg(observed: float, expected: float) -> float:
    return float(abs(wrap_deg(observed - expected)))


def fundamental(time: np.ndarray, values: np.ndarray, frequency: float) -> complex:
    centered = values - np.mean(values)
    return complex(2.0 * np.sum(centered * np.exp(-2j * np.pi * frequency * time)) / len(values))


def relative_phase_deg(time: np.ndarray, reference: np.ndarray, response: np.ndarray, frequency: float) -> float:
    return float(wrap_deg(np.rad2deg(np.angle(fundamental(time, response, frequency) / fundamental(time, reference, frequency)))))


def cycle_phases(time: np.ndarray, reference: np.ndarray, response: np.ndarray, frequency: float, sample_rate: float) -> np.ndarray:
    samples = round(sample_rate / frequency)
    phases = []
    for index in range(len(time) // samples):
        sl = slice(index * samples, (index + 1) * samples)
        phases.append(relative_phase_deg(time[sl], reference[sl], response[sl], frequency))
    return np.asarray(phases)


def band_phase_plv(reference: np.ndarray, response: np.ndarray, sample_rate: float, low: float, high: float) -> float:
    sos = butter(4, [low, high], btype="bandpass", fs=sample_rate, output="sos")
    a = hilbert(sosfiltfilt(sos, reference))
    b = hilbert(sosfiltfilt(sos, response))
    edge = round(sample_rate * 2.0)
    relation = np.angle(b[edge:-edge]) - np.angle(a[edge:-edge])
    return float(abs(np.mean(np.exp(1j * relation))))


def synthetic_validation(protocol: dict[str, Any]) -> dict[str, Any]:
    thresholds = protocol["synthetic_thresholds"]
    fs = 512.0
    f = 4.0
    duration = 16.0
    time = np.arange(round(fs * duration)) / fs
    reference = np.cos(2 * np.pi * f * time)
    controls: dict[str, Any] = {}

    fixed_errors = {}
    for phase in (0.0, 90.0, 180.0):
        response = np.cos(2 * np.pi * f * time + np.deg2rad(phase))
        observed = relative_phase_deg(time, reference, response, f)
        fixed_errors[str(int(phase))] = circular_error_deg(observed, phase)
    controls["fixed_phase_0_90_180"] = {
        "maximum_circular_error_deg": max(fixed_errors.values()),
        "errors_deg": fixed_errors,
        "tolerance_deg": thresholds["fixed_phase_max_error_deg"],
        "passed": max(fixed_errors.values()) <= thresholds["fixed_phase_max_error_deg"],
    }

    phase = 37.0
    unequal = 7.5 * np.cos(2 * np.pi * f * time + np.deg2rad(phase))
    unequal_error = circular_error_deg(relative_phase_deg(time, 0.2 * reference, unequal, f), phase)
    controls["unequal_amplitudes"] = {
        "circular_error_deg": unequal_error,
        "tolerance_deg": thresholds["amplitude_scaling_max_error_deg"],
        "passed": unequal_error <= thresholds["amplitude_scaling_max_error_deg"],
    }

    drift_time = np.arange(round(fs * 20.0)) / fs
    drift_phase = -15.0 + 30.0 * drift_time / drift_time[-1]
    drift_ref = np.cos(2 * np.pi * f * drift_time)
    drift_response = np.cos(2 * np.pi * f * drift_time + np.deg2rad(drift_phase))
    observed_drift = cycle_phases(drift_time, drift_ref, drift_response, f, fs)
    samples = round(fs / f)
    centers = (np.arange(len(observed_drift)) * samples + (samples - 1) / 2.0) / fs
    expected_drift = -15.0 + 30.0 * centers / drift_time[-1]
    endpoint_error = max(circular_error_deg(observed_drift[0], expected_drift[0]), circular_error_deg(observed_drift[-1], expected_drift[-1]))
    controls["slow_phase_drift"] = {
        "endpoint_max_error_deg": endpoint_error,
        "observed_span_deg": float(observed_drift[-1] - observed_drift[0]),
        "tolerance_deg": thresholds["phase_drift_endpoint_max_error_deg"],
        "passed": endpoint_error <= thresholds["phase_drift_endpoint_max_error_deg"],
    }

    jump_cycles = 24
    jump_time = np.arange(round(fs * jump_cycles / f)) / fs
    jump_sample = round(fs * 12 / f)
    jump_ref = np.cos(2 * np.pi * f * jump_time)
    phase_series = np.zeros_like(jump_time)
    phase_series[jump_sample:] = 90.0
    jump_response = np.cos(2 * np.pi * f * jump_time + np.deg2rad(phase_series))
    jump_phases = cycle_phases(jump_time, jump_ref, jump_response, f, fs)
    detected_cycle = int(np.argmax(np.abs(wrap_deg(np.diff(jump_phases)))) + 2)
    expected_cycle = 13
    controls["known_phase_jump"] = {
        "expected_first_post_jump_cycle": expected_cycle,
        "detected_first_post_jump_cycle": detected_cycle,
        "cycle_error": abs(detected_cycle - expected_cycle),
        "tolerance_cycles": thresholds["phase_jump_cycle_tolerance"],
        "passed": abs(detected_cycle - expected_cycle) <= thresholds["phase_jump_cycle_tolerance"],
    }

    beat_time = np.arange(round(fs * 20.0)) / fs
    beat_ref = np.cos(2 * np.pi * f * beat_time)
    beat_response = np.cos(2 * np.pi * f * beat_time) + np.cos(2 * np.pi * (f + 0.2) * beat_time)
    beat_phases = cycle_phases(beat_time, beat_ref, beat_response, f, fs)
    beat_plv = phase_locking_value(beat_phases)
    controls["nearby_frequency_beating"] = {
        "cycle_phase_plv": beat_plv,
        "maximum_allowed_plv": thresholds["beating_maximum_plv"],
        "passed": beat_plv < thresholds["beating_maximum_plv"],
    }

    rng = np.random.default_rng(20260920)
    noise_phase = 23.0
    noisy_ref = reference + rng.normal(0.0, 0.1, len(reference))
    noisy_response = np.cos(2 * np.pi * f * time + np.deg2rad(noise_phase)) + rng.normal(0.0, 0.2, len(time))
    noisy_phases = cycle_phases(time, noisy_ref, noisy_response, f, fs)
    noisy_plv = phase_locking_value(noisy_phases)
    noisy_error = circular_error_deg(circular_mean_deg(noisy_phases), noise_phase)
    controls["noisy_phase_locked"] = {
        "cycle_phase_plv": noisy_plv,
        "mean_circular_error_deg": noisy_error,
        "minimum_plv": thresholds["noisy_lock_minimum_plv"],
        "maximum_error_deg": thresholds["noisy_lock_max_mean_error_deg"],
        "passed": noisy_plv >= thresholds["noisy_lock_minimum_plv"] and noisy_error <= thresholds["noisy_lock_max_mean_error_deg"],
    }

    surrogate_time = np.arange(round(fs * 32.0)) / fs
    raw = rng.normal(size=len(surrogate_time))
    spectrum = np.fft.rfft(raw)
    random_phase = rng.uniform(-np.pi, np.pi, len(spectrum))
    random_phase[0] = 0.0
    if len(raw) % 2 == 0:
        random_phase[-1] = 0.0
    surrogate = np.fft.irfft(np.abs(spectrum) * np.exp(1j * random_phase), n=len(raw))
    magnitude_error = float(np.max(np.abs(np.abs(np.fft.rfft(raw)) - np.abs(np.fft.rfft(surrogate)))))
    surrogate_plv = band_phase_plv(raw, surrogate, fs, 2.0, 30.0)
    controls["same_spectrum_phase_randomized"] = {
        "maximum_fft_magnitude_error": magnitude_error,
        "band_phase_plv": surrogate_plv,
        "maximum_allowed_plv": thresholds["phase_randomized_maximum_plv"],
        "passed": magnitude_error < 1e-9 and surrogate_plv < thresholds["phase_randomized_maximum_plv"],
    }

    missing_phase = 41.0
    missing_response = np.cos(2 * np.pi * f * time + np.deg2rad(missing_phase))
    keep = rng.random(len(time)) > 0.15
    missing_error = circular_error_deg(relative_phase_deg(time[keep], reference[keep], missing_response[keep], f), missing_phase)
    controls["missing_samples"] = {
        "removed_fraction": float(1.0 - np.mean(keep)),
        "circular_error_deg": missing_error,
        "tolerance_deg": thresholds["missing_sample_max_error_deg"],
        "passed": missing_error <= thresholds["missing_sample_max_error_deg"],
    }

    jitter_phase = -28.0
    jitter = rng.normal(0.0, 2e-5, len(time))
    jitter_time = time + jitter
    order = np.argsort(jitter_time)
    jitter_time = jitter_time[order]
    jitter_ref = np.cos(2 * np.pi * f * jitter_time)
    jitter_response = np.cos(2 * np.pi * f * jitter_time + np.deg2rad(jitter_phase))
    jitter_error = circular_error_deg(relative_phase_deg(jitter_time, jitter_ref, jitter_response, f), jitter_phase)
    controls["clock_jitter"] = {
        "jitter_standard_deviation_s": 2e-5,
        "circular_error_deg": jitter_error,
        "tolerance_deg": thresholds["clock_jitter_max_error_deg"],
        "passed": jitter_error <= thresholds["clock_jitter_max_error_deg"],
    }

    transformed_phase = 31.0
    transformed_response = np.cos(2 * np.pi * f * time + np.deg2rad(transformed_phase))
    base_phase = relative_phase_deg(time, reference, transformed_response, f)
    translated_phase = relative_phase_deg(time + 13.37, reference, transformed_response, f)
    exchanged_phase = relative_phase_deg(time, transformed_response, reference, f)
    reversed_time = time[-1] - time[::-1]
    reversed_phase = relative_phase_deg(reversed_time, reference[::-1], transformed_response[::-1], f)
    transform_error = max(
        circular_error_deg(translated_phase, base_phase),
        circular_error_deg(exchanged_phase, -base_phase),
        circular_error_deg(reversed_phase, -base_phase),
    )
    controls["relation_transformations"] = {
        "common_time_translation_error_deg": circular_error_deg(translated_phase, base_phase),
        "channel_exchange_sign_error_deg": circular_error_deg(exchanged_phase, -base_phase),
        "time_reversal_sign_error_deg": circular_error_deg(reversed_phase, -base_phase),
        "maximum_error_deg": transform_error,
        "tolerance_deg": thresholds["fixed_phase_max_error_deg"],
        "passed": transform_error <= thresholds["fixed_phase_max_error_deg"],
    }

    passed = all(item["passed"] for item in controls.values())
    return {
        "schema": "nexah-phx01-synthetic-validation/0.1.0",
        "mission_id": "PHX-01",
        "classification": "PASS" if passed else "FAIL_CLOSED",
        "all_controls_passed": passed,
        "controls": controls,
        "environment": {
            "python": platform.python_version(), "numpy": np.__version__,
            "pandas": pd.__version__, "scipy": scipy.__version__,
        },
    }


def active_cycles(table: pd.DataFrame, frequency: float, nominal_mm: float, threshold: float) -> dict[int, pd.DataFrame]:
    samples = round(512.0 / frequency)
    output = {}
    for index in range(len(table) // samples):
        segment = table.iloc[index * samples:(index + 1) * samples].copy().reset_index(drop=True)
        amplitude = (segment["Actuator1_Disp"].max() - segment["Actuator1_Disp"].min()) / 2.0
        if amplitude >= threshold * nominal_mm:
            output[index + 1] = segment
    return output


def cycle_record(name: str, metadata: dict[str, Any], cycle: int, segment: pd.DataFrame, actuator: int) -> dict[str, Any]:
    time = segment["Time"].to_numpy(float)
    displacement = segment[f"Actuator{actuator}_Disp"].to_numpy(float)
    force = segment[f"Actuator{actuator}_Force"].to_numpy(float)
    d = fundamental(time, displacement, metadata["frequency_hz"])
    f = fundamental(time, force, metadata["frequency_hz"])
    return {
        "source_file": name, "pair": metadata["pair"], "cut": metadata["cut"],
        "frequency_hz": metadata["frequency_hz"], "nominal_mm": metadata["nominal_mm"],
        "cycle": cycle, "actuator": actuator,
        "phase_deg": float(wrap_deg(np.rad2deg(np.angle(f / d)))),
        "gain_kn_per_mm": float(abs(f) / abs(d)),
        "displacement_real": float(d.real), "displacement_imag": float(d.imag),
        "force_real": float(f.real), "force_imag": float(f.imag),
    }


def aggregate(records: list[dict[str, Any]]) -> dict[str, Any]:
    phases = np.asarray([r["phase_deg"] for r in records])
    d = np.asarray([complex(r["displacement_real"], r["displacement_imag"]) for r in records])
    f = np.asarray([complex(r["force_real"], r["force_imag"]) for r in records])
    coherence = abs(np.sum(f * np.conj(d))) ** 2 / (np.sum(abs(f) ** 2) * np.sum(abs(d) ** 2))
    return {
        "cycle_count": len(records),
        "cycles": [int(r["cycle"]) for r in records],
        "circular_mean_phase_deg": circular_mean_deg(phases),
        "phase_locking_value": phase_locking_value(phases),
        "circular_standard_deviation_deg": circular_std_deg(phases),
        "fundamental_magnitude_squared_coherence": float(coherence),
        "median_gain_kn_per_mm": float(np.median([r["gain_kn_per_mm"] for r in records])),
    }


def circular_block_sample(values: np.ndarray, rng: np.random.Generator, block_length: int) -> np.ndarray:
    pieces = []
    while sum(len(piece) for piece in pieces) < len(values):
        start = int(rng.integers(0, len(values)))
        pieces.append(values[(start + np.arange(block_length)) % len(values)])
    return np.concatenate(pieces)[:len(values)]


def bootstrap_circular_mean_interval(values: np.ndarray, observed: float, draws: int, block_length: int, seed: int) -> list[float]:
    rng = np.random.default_rng(seed)
    estimates = np.asarray([circular_mean_deg(circular_block_sample(values, rng, block_length)) for _ in range(draws)])
    residual = wrap_deg(estimates - observed)
    bounds = observed + np.quantile(residual, [0.025, 0.975])
    return [float(bounds[0]), float(bounds[1])]


def empirical_analysis(protocol: dict[str, Any]) -> dict[str, Any]:
    if not SYNTHETIC_RESULT.exists():
        raise RuntimeError("synthetic validation result missing")
    synthetic = json.loads(SYNTHETIC_RESULT.read_text(encoding="utf-8"))
    if not synthetic.get("all_controls_passed"):
        raise RuntimeError("synthetic validation did not pass")

    threshold = protocol["active_amplitude_fraction"]
    tables = {}
    actives = {}
    source_hashes = {}
    for name, metadata in FILES.items():
        path = SOURCE / "selected" / name
        actual = digest(path)
        if actual != metadata["sha256"]:
            raise RuntimeError(f"source hash mismatch: {name}")
        source_hashes[name] = actual
        table = pd.read_csv(path)
        if list(table.columns) != ["Time", "Actuator1_Disp", "Actuator1_Force", "Actuator2_Disp", "Actuator2_Force"]:
            raise RuntimeError(f"column mismatch: {name}")
        numeric = table.to_numpy(float)
        if not np.isfinite(numeric).all() or not np.all(np.diff(table["Time"].to_numpy(float)) > 0):
            raise RuntimeError(f"invalid numeric/time content: {name}")
        tables[name] = table
        actives[name] = active_cycles(table, metadata["frequency_hz"], metadata["nominal_mm"], threshold)

    all_records: list[dict[str, Any]] = []
    pair_results: dict[str, Any] = {}
    empirical_thresholds = protocol["empirical_thresholds"]
    bootstrap = protocol["bootstrap"]

    for pair_index, pair in enumerate(("P05_BEFORE_AFTER_EQ", "P10_BEFORE_AFTER_EQ")):
        names = {metadata["cut"]: name for name, metadata in FILES.items() if metadata["pair"] == pair}
        common = sorted(set(actives[names["A"]]) & set(actives[names["B"]]))
        pair_result: dict[str, Any] = {"common_active_cycles": common, "actuators": {}}
        for actuator in (1, 2):
            cut_records = {}
            for cut in ("A", "B"):
                name = names[cut]
                metadata = FILES[name]
                records = [cycle_record(name, metadata, cycle, actives[name][cycle], actuator) for cycle in common]
                all_records.extend(records)
                cut_records[cut] = records
            phases_a = np.asarray([r["phase_deg"] for r in cut_records["A"]])
            phases_b = np.asarray([r["phase_deg"] for r in cut_records["B"]])
            differences = wrap_deg(phases_b - phases_a)
            mean_shift = circular_mean_deg(differences)
            interval = bootstrap_circular_mean_interval(
                differences, mean_shift, bootstrap["draws"], bootstrap["block_length_cycles"],
                bootstrap["seed"] + pair_index * 10 + actuator,
            )
            interior_shift = circular_mean_deg(differences[1:-1])
            boundary_change = circular_error_deg(interior_shift, mean_shift)
            summary_a = aggregate(cut_records["A"])
            summary_b = aggregate(cut_records["B"])
            stable = (
                summary_a["phase_locking_value"] >= empirical_thresholds["minimum_phase_locking_value"]
                and summary_b["phase_locking_value"] >= empirical_thresholds["minimum_phase_locking_value"]
                and summary_a["fundamental_magnitude_squared_coherence"] >= empirical_thresholds["minimum_fundamental_coherence"]
                and summary_b["fundamental_magnitude_squared_coherence"] >= empirical_thresholds["minimum_fundamental_coherence"]
                and interval[0] >= -empirical_thresholds["phase_shift_equivalence_margin_deg"]
                and interval[1] <= empirical_thresholds["phase_shift_equivalence_margin_deg"]
                and boundary_change <= empirical_thresholds["maximum_boundary_exclusion_change_deg"]
            )
            pair_result["actuators"][str(actuator)] = {
                "cut_A": summary_a, "cut_B": summary_b,
                "paired_phase_shift_deg": [float(x) for x in differences],
                "circular_mean_phase_shift_deg": mean_shift,
                "moving_block_bootstrap_95_interval_deg": interval,
                "interior_cycle_mean_phase_shift_deg": interior_shift,
                "boundary_exclusion_change_deg": boundary_change,
                "classification": "STABLE_EQUIVALENT" if stable else "NOT_STABLE_EQUIVALENT",
            }
        pair_result["classification"] = "STABLE_EQUIVALENT" if all(v["classification"] == "STABLE_EQUIVALENT" for v in pair_result["actuators"].values()) else "NOT_STABLE_EQUIVALENT"
        pair_results[pair] = pair_result

    intake = json.loads((SOURCE / "SOURCE_INTAKE_RESULT.json").read_text(encoding="utf-8"))
    baseline_errors = []
    for name, metadata in FILES.items():
        table = tables[name]
        time = table["Time"].to_numpy(float)
        for actuator in (1, 2):
            observed = relative_phase_deg(
                time, table[f"Actuator{actuator}_Disp"].to_numpy(float),
                table[f"Actuator{actuator}_Force"].to_numpy(float), metadata["frequency_hz"],
            )
            expected = intake["runs"][name]["channels"][f"actuator_{actuator}"]["force_relative_to_displacement_phase_deg"]
            baseline_errors.append(circular_error_deg(observed, expected))

    complete = all(result["classification"] == "STABLE_EQUIVALENT" for result in pair_results.values())
    return {
        "schema": "nexah-phx01-empirical-phase/0.1.0",
        "mission_id": "PHX-01",
        "case_id": "HZ_FZ_PUBLIC_01",
        "evidence_class": "EXTERNAL_E2_ONLY",
        "source_hashes": source_hashes,
        "baseline_reproduction": {
            "comparison": "whole-record relative phase versus SOURCE_INTAKE_RESULT.json",
            "maximum_circular_error_deg": max(baseline_errors),
            "passed": max(baseline_errors) < 1e-9,
        },
        "pairs": pair_results,
        "relative_phase_invariant_found": complete,
        "classification": "BOUNDED_RELATIVE_PHASE_STABILITY_SUPPORTED" if complete else "PHASE_EXTENSION_RESULT_INCONCLUSIVE",
        "frequency_amplitude_separation": "NOT_IDENTIFIABLE_IN_SELECTED_RECORDS",
        "order_sensitivity_explained_by_phase": "INDETERMINATE_SOURCE_NOT_BOUND",
        "prime_test_executed": False,
        "claim_boundary": "Descriptive within-source phase stability only; cycles are not independent runs and frequency is confounded with amplitude in the selected records.",
    }, all_records


def write_json(path: Path, value: dict[str, Any]) -> None:
    path.write_text(json.dumps(value, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("synthetic", "empirical"), required=True)
    args = parser.parse_args()
    protocol = json.loads(PROTOCOL_PATH.read_text(encoding="utf-8"))
    if args.mode == "synthetic":
        result = synthetic_validation(protocol)
        write_json(SYNTHETIC_RESULT, result)
        print(json.dumps({"mode": "synthetic", "classification": result["classification"]}))
        raise SystemExit(0 if result["all_controls_passed"] else 2)
    result, records = empirical_analysis(protocol)
    write_json(EMPIRICAL_RESULT, result)
    pd.DataFrame(records).to_csv(CYCLE_RESULT, index=False)
    print(json.dumps({"mode": "empirical", "classification": result["classification"], "records": len(records)}))


if __name__ == "__main__":
    main()
