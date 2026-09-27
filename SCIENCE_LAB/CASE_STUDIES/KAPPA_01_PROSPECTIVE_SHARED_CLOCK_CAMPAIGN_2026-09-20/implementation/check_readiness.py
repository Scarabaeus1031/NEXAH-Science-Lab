#!/usr/bin/env python3
"""Validate KAPPA-01 campaign readiness and synthetic fail-closed controls."""

from __future__ import annotations

import argparse
import copy
import json
import math
from pathlib import Path
from typing import Any

import jsonschema
import numpy as np
from scipy.stats import norm


PACKAGE = Path(__file__).resolve().parents[1]
PENDING_PATH = PACKAGE / "campaign.pending.json"
SCHEMA_PATH = PACKAGE / "campaign.schema.json"


def wrap_deg(value: Any) -> Any:
    return (np.asarray(value) + 180.0) % 360.0 - 180.0


def circular_mean_deg(values: np.ndarray) -> float:
    z = np.mean(np.exp(1j * np.deg2rad(values)))
    return float(wrap_deg(np.rad2deg(np.angle(z))))


def fundamental(time: np.ndarray, values: np.ndarray, frequency: float) -> complex:
    centered = values - np.mean(values)
    return complex(2.0 * np.sum(centered * np.exp(-2j * np.pi * frequency * time)) / len(values))


def cycle_relative_phases(session: dict[str, np.ndarray], frequency: float, sample_rate: float) -> tuple[np.ndarray, list[str]]:
    samples = round(sample_rate / frequency)
    phases = []
    labels = []
    for start in range(0, len(session["t_s"]) - samples + 1, samples):
        stop = start + samples
        label_values = session["phase_label"][start:stop]
        if len(set(label_values.tolist())) != 1:
            continue
        time = session["t_s"][start:stop]
        d = fundamental(time, session["displacement_mm"][start:stop], frequency)
        f = fundamental(time, session["force_n"][start:stop], frequency)
        phases.append(float(wrap_deg(np.rad2deg(np.angle(f / d)))))
        labels.append(str(label_values[0]))
    return np.asarray(phases), labels


def make_session(active: bool) -> dict[str, np.ndarray]:
    frequency = 2.0
    sample_rate = 200.0
    samples_per_cycle = round(sample_rate / frequency)
    cycle_labels = ["PRE"] * 20 + ["EVENT"] * 2 + ["POST"] * 20 + ["RECOVERY"] * 20
    labels = np.repeat(np.asarray(cycle_labels, dtype=object), samples_per_cycle)
    n = len(labels)
    index = np.arange(n)
    time = index / sample_rate
    phase = np.full(n, 5.0)
    if active:
        event = labels == "EVENT"
        phase[event] = np.linspace(5.0, 7.0, int(np.sum(event)), endpoint=True)
        phase[labels == "POST"] = 7.0
        recovery_count = int(np.sum(labels == "RECOVERY"))
        phase[labels == "RECOVERY"] = np.linspace(7.0, 5.0, recovery_count, endpoint=True)
    displacement = 10.0 * np.cos(2 * np.pi * frequency * time)
    force = 100.0 * np.cos(2 * np.pi * frequency * time + np.deg2rad(phase))
    marker = (labels == "EVENT").astype(int)
    return {
        "sample_index": index,
        "t_s": time,
        "phase_label": labels,
        "event_marker": marker,
        "drive_v": np.cos(2 * np.pi * frequency * time),
        "displacement_mm": displacement,
        "force_n": force,
        "temperature_c": np.full(n, 21.0),
    }


def admit_session(session: dict[str, np.ndarray]) -> tuple[bool, list[str]]:
    required = [
        "sample_index", "t_s", "phase_label", "event_marker", "drive_v",
        "displacement_mm", "force_n", "temperature_c",
    ]
    failures = []
    if any(name not in session for name in required):
        return False, ["missing_channel"]
    lengths = {len(session[name]) for name in required}
    if len(lengths) != 1 or next(iter(lengths)) == 0:
        failures.append("length_mismatch_or_empty")
        return False, failures
    if not np.array_equal(np.diff(session["sample_index"]), np.ones(len(session["sample_index"]) - 1, dtype=int)):
        failures.append("sample_index_not_consecutive")
    if not np.all(np.diff(session["t_s"]) > 0):
        failures.append("clock_not_strictly_increasing")
    if set(session["phase_label"].tolist()) != {"PRE", "EVENT", "POST", "RECOVERY"}:
        failures.append("phase_set_incomplete")
    if not np.any(session["event_marker"] != 0):
        failures.append("event_marker_missing")
    for name in ("t_s", "drive_v", "displacement_mm", "force_n", "temperature_c"):
        if not np.isfinite(np.asarray(session[name], dtype=float)).all():
            failures.append(f"non_finite_{name}")
    return not failures, failures


def synthetic_controls() -> dict[str, Any]:
    active = make_session(True)
    sham = make_session(False)
    active_ok, active_failures = admit_session(active)
    sham_ok, sham_failures = admit_session(sham)

    active_phases, active_labels = cycle_relative_phases(active, 2.0, 200.0)
    sham_phases, sham_labels = cycle_relative_phases(sham, 2.0, 200.0)

    def endpoint(phases: np.ndarray, labels: list[str]) -> float:
        pre = phases[np.asarray(labels) == "PRE"][-10:]
        post = phases[np.asarray(labels) == "POST"][:10]
        return float(wrap_deg(circular_mean_deg(post) - circular_mean_deg(pre)))

    active_endpoint = endpoint(active_phases, active_labels)
    sham_endpoint = endpoint(sham_phases, sham_labels)

    reset_clock = copy.deepcopy(active)
    reset_at = int(np.flatnonzero(reset_clock["phase_label"] == "EVENT")[0])
    reset_clock["t_s"][reset_at:] -= reset_clock["t_s"][reset_at]
    reset_ok, reset_failures = admit_session(reset_clock)

    duplicate_index = copy.deepcopy(active)
    duplicate_index["sample_index"][1000] = duplicate_index["sample_index"][999]
    duplicate_ok, duplicate_failures = admit_session(duplicate_index)

    missing_marker = copy.deepcopy(active)
    missing_marker["event_marker"][:] = 0
    marker_ok, marker_failures = admit_session(missing_marker)

    missing_phase = copy.deepcopy(active)
    missing_phase["phase_label"][missing_phase["phase_label"] == "RECOVERY"] = "POST"
    phase_ok, phase_failures = admit_session(missing_phase)

    controls = {
        "continuous_active_session_admitted": {
            "passed": active_ok,
            "failures": active_failures,
        },
        "continuous_sham_session_admitted": {
            "passed": sham_ok,
            "failures": sham_failures,
        },
        "known_two_degree_endpoint_recovered": {
            "observed_active_endpoint_deg": active_endpoint,
            "observed_sham_endpoint_deg": sham_endpoint,
            "active_error_deg": abs(active_endpoint - 2.0),
            "sham_error_deg": abs(sham_endpoint),
            "tolerance_deg": 0.05,
            "passed": abs(active_endpoint - 2.0) <= 0.05 and abs(sham_endpoint) <= 0.05,
        },
        "clock_reset_rejected": {
            "passed": not reset_ok and "clock_not_strictly_increasing" in reset_failures,
            "failures": reset_failures,
        },
        "duplicate_sample_index_rejected": {
            "passed": not duplicate_ok and "sample_index_not_consecutive" in duplicate_failures,
            "failures": duplicate_failures,
        },
        "missing_event_marker_rejected": {
            "passed": not marker_ok and "event_marker_missing" in marker_failures,
            "failures": marker_failures,
        },
        "missing_recovery_phase_rejected": {
            "passed": not phase_ok and "phase_set_incomplete" in phase_failures,
            "failures": phase_failures,
        },
    }
    return {
        "schema": "nexah-kappa01-software-validation/0.1.0",
        "synthetic_only": True,
        "controls": controls,
        "all_controls_passed": all(item["passed"] for item in controls.values()),
    }


def complete_synthetic_config(pending: dict[str, Any]) -> dict[str, Any]:
    config = copy.deepcopy(pending)
    config["status"] = "PREREGISTERED_READY_FOR_ACQUISITION"
    config["apparatus"] = {
        "device_id": "SYNTHETIC_DEVICE",
        "acquisition_id": "SYNTHETIC_DAQ",
        "shared_sample_clock_id": "SYNTHETIC_CLOCK",
        "drive_channel_id": "SYNTHETIC_DRIVE",
        "drive_is_measured_not_setpoint": True,
        "displacement_sensor_id": "SYNTHETIC_DISP",
        "displacement_calibration_id": "SYNTHETIC_DISP_CAL",
        "displacement_uncertainty_mm": 0.01,
        "force_sensor_id": "SYNTHETIC_FORCE",
        "force_calibration_id": "SYNTHETIC_FORCE_CAL",
        "force_uncertainty_n": 0.1,
        "channel_skew_bound_s": 0.00001,
    }
    config["intervention"] = {
        "active_definition": "Synthetic active intervention for schema validation only.",
        "sham_definition": "Synthetic sham intervention for schema validation only.",
        "event_marker_source": "SYNTHETIC_MARKER",
        "duration_s": 1.0,
        "washout_rule": "Synthetic return to the baseline tolerance band for validation.",
        "safety_approval_ref": "SYNTHETIC_ONLY",
    }
    config["fixed_settings"].update({
        "frequency_hz": 2.0,
        "drive_amplitude_v": 1.0,
        "preload_n": 5.0,
        "sample_rate_hz": 200.0,
    })
    config["design"].update({
        "mcid_deg": 1.0,
        "paired_session_sd_deg": 1.5,
        "variance_source_ref": "SYNTHETIC_ONLY",
        "attrition_fraction": 0.1,
        "minimum_blocks": 8,
        "maximum_blocks": 40,
        "randomization_seed_receipt": "SYNTHETIC_ONLY",
        "blinding_key_custodian": "SYNTHETIC_ONLY",
    })
    return config


def pending_paths(value: Any, prefix: str = "") -> list[str]:
    found = []
    if isinstance(value, dict):
        for key, item in value.items():
            found.extend(pending_paths(item, f"{prefix}.{key}" if prefix else key))
    elif isinstance(value, list):
        for index, item in enumerate(value):
            found.extend(pending_paths(item, f"{prefix}[{index}]"))
    elif value is None or value == "PENDING" or value is False:
        found.append(prefix)
    return found


def planned_blocks(config: dict[str, Any]) -> dict[str, Any] | None:
    design = config["design"]
    required = ("mcid_deg", "paired_session_sd_deg", "attrition_fraction")
    if any(design[name] is None for name in required):
        return None
    alpha = float(design["alpha_two_sided"])
    power = float(design["target_power"])
    mcid = float(design["mcid_deg"])
    sd = float(design["paired_session_sd_deg"])
    raw = ((norm.ppf(1 - alpha / 2) + norm.ppf(power)) * sd / mcid) ** 2
    complete = math.ceil(raw)
    recruited = math.ceil(complete / (1 - float(design["attrition_fraction"])))
    return {"normal_approximation_complete_blocks": complete, "blocks_with_attrition": recruited}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path, default=PENDING_PATH)
    args = parser.parse_args()
    config_path = args.config.resolve()
    pending = json.loads(config_path.read_text(encoding="utf-8"))
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    controls = synthetic_controls()
    synthetic_config = complete_synthetic_config(pending)

    synthetic_schema_valid = True
    synthetic_schema_error = ""
    try:
        jsonschema.validate(synthetic_config, schema)
    except jsonschema.ValidationError as exc:
        synthetic_schema_valid = False
        synthetic_schema_error = exc.message

    pending_schema_valid = True
    pending_schema_errors = []
    validator = jsonschema.Draft202012Validator(schema)
    for error in sorted(validator.iter_errors(pending), key=lambda item: list(item.path)):
        pending_schema_valid = False
        pending_schema_errors.append({"path": ".".join(map(str, error.path)), "message": error.message})

    controls["synthetic_complete_config_schema_valid"] = synthetic_schema_valid
    controls["synthetic_complete_config_schema_error"] = synthetic_schema_error
    controls["all_controls_passed"] = controls["all_controls_passed"] and synthetic_schema_valid
    (PACKAGE / "04_SOFTWARE_VALIDATION.json").write_text(json.dumps(controls, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    missing = pending_paths(pending)
    readiness = {
        "schema": "nexah-kappa01-readiness/0.1.0",
        "campaign_id": "KAPPA_01",
        "configuration_path": str(config_path),
        "classification": "SOFTWARE_GATE_PASS_PHYSICAL_INPUTS_PENDING" if controls["all_controls_passed"] else "SOFTWARE_GATE_FAIL_CLOSED",
        "software_gate_passed": controls["all_controls_passed"],
        "campaign_schema_currently_valid": pending_schema_valid,
        "data_collection_authorized": controls["all_controls_passed"] and pending_schema_valid,
        "pending_or_false_paths": missing,
        "schema_errors": pending_schema_errors,
        "power_plan": planned_blocks(pending),
        "synthetic_power_example_not_campaign_design": planned_blocks(synthetic_config),
        "next_gate": "Complete apparatus, intervention, safety, MCID, variance, attrition, block bounds, randomization receipt and blinding custodian; then seal hashes before acquisition.",
        "real_measurement_present": False,
    }
    (PACKAGE / "05_READINESS_RESULT.json").write_text(json.dumps(readiness, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "classification": readiness["classification"],
        "software_gate_passed": readiness["software_gate_passed"],
        "data_collection_authorized": readiness["data_collection_authorized"],
        "pending_field_count": len(missing),
    }))


if __name__ == "__main__":
    main()
