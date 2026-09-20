#!/usr/bin/env python3
"""Verify the frozen RWTH source snapshot and characterize two cut pairs."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parent
EXPECTED_COLUMNS = [
    "Time",
    "Actuator1_Disp",
    "Actuator1_Force",
    "Actuator2_Disp",
    "Actuator2_Force",
]
SOURCE_FILES = {
    "07_4wires_sin20mm_0p5Hz.csv": {
        "sha256": "36cf6cc994de28fdc32b609dc9fe4b671d154584c0e69bcb1b93631568bc4b61",
        "role": "REFERENCE_A",
        "pair": "P05_BEFORE_AFTER_EQ",
        "frequency_hz": 0.5,
        "nominal_displacement_mm": 20.0,
        "condition": "BEFORE_EQ",
    },
    "09_4wires_sin20mm_0p5Hz_after_EQ.csv": {
        "sha256": "b3274aa7a2dceea186394630b93b80a0f7ea6ca2040d0a4faec8dea3b2cefe8b",
        "role": "RETURN_B",
        "pair": "P05_BEFORE_AFTER_EQ",
        "frequency_hz": 0.5,
        "nominal_displacement_mm": 20.0,
        "condition": "AFTER_EQ",
    },
    "08_4wires_sin40mm_1p0Hz.csv": {
        "sha256": "3e21c2be71089caf4b800c09cb0e7c846772e318791445063bd05e1ee3fd2bae",
        "role": "REFERENCE_A",
        "pair": "P10_BEFORE_AFTER_EQ",
        "frequency_hz": 1.0,
        "nominal_displacement_mm": 40.0,
        "condition": "BEFORE_EQ",
    },
    "10_4wires_sin40mm_1p0Hz_after_EQ.csv": {
        "sha256": "eae1c973b447653642ef0cb3013ab954bd6bbde172b4017bf4388ba9941f0e36",
        "role": "RETURN_B",
        "pair": "P10_BEFORE_AFTER_EQ",
        "frequency_hz": 1.0,
        "nominal_displacement_mm": 40.0,
        "condition": "AFTER_EQ",
    },
}


def digest(path: Path, algorithm: str = "sha256") -> str:
    value = hashlib.new(algorithm)
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def fundamental(values: np.ndarray, time: np.ndarray, frequency: float) -> complex:
    centered = values - np.mean(values)
    return complex(2 * np.sum(centered * np.exp(-2j * np.pi * frequency * time)) / len(values))


def wrap_degrees(value: float) -> float:
    return (value + 180.0) % 360.0 - 180.0


def relative_delta(a: float, b: float) -> float:
    denominator = (abs(a) + abs(b)) / 2.0
    return abs(a - b) / denominator


def inspect_csv(path: Path, metadata: dict[str, Any]) -> dict[str, Any]:
    actual_hash = digest(path)
    if actual_hash != metadata["sha256"]:
        raise ValueError(f"source hash mismatch: {path.name}")
    table = pd.read_csv(path)
    if list(table.columns) != EXPECTED_COLUMNS:
        raise ValueError(f"unexpected columns: {path.name}")
    if table.isna().any().any():
        raise ValueError(f"missing values: {path.name}")
    numeric = table.to_numpy(dtype=float)
    if not np.isfinite(numeric).all():
        raise ValueError(f"non-finite values: {path.name}")
    time = table["Time"].to_numpy(dtype=float)
    steps = np.diff(time)
    if not np.all(steps > 0):
        raise ValueError(f"timestamps are not strictly increasing: {path.name}")
    expected_step = 1.0 / 512.0
    if float(np.max(np.abs(steps - expected_step))) > 1e-6:
        raise ValueError(f"sample interval departs from rounded 512 Hz timing: {path.name}")
    sample_rate = (len(time) - 1) / float(time[-1] - time[0])
    if not math.isclose(sample_rate, 512.0, rel_tol=0, abs_tol=1e-4):
        raise ValueError(f"unexpected sample rate: {path.name}")

    channels: dict[str, Any] = {}
    for actuator in (1, 2):
        displacement = fundamental(
            table[f"Actuator{actuator}_Disp"].to_numpy(dtype=float),
            time,
            metadata["frequency_hz"],
        )
        force = fundamental(
            table[f"Actuator{actuator}_Force"].to_numpy(dtype=float),
            time,
            metadata["frequency_hz"],
        )
        channels[f"actuator_{actuator}"] = {
            "displacement_fundamental_mm": abs(displacement),
            "force_fundamental_kn": abs(force),
            "gain_kn_per_mm": abs(force) / abs(displacement),
            "force_relative_to_displacement_phase_deg": wrap_degrees(
                math.degrees(np.angle(force / displacement))
            ),
        }
    return {
        **metadata,
        "path": f"selected/{path.name}",
        "sha256": actual_hash,
        "rows": len(table),
        "duration_s": float(time[-1] - time[0]),
        "sample_rate_hz": sample_rate,
        "maximum_timestamp_rounding_error_s": float(
            np.max(np.abs(steps - expected_step))
        ),
        "units": {"Time": "s", "Disp": "mm", "Force": "kN"},
        "missing_values": 0,
        "non_finite_values": 0,
        "channels": channels,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    archive = ROOT / "source" / "Data_v1.0.0.zip"
    protocol = ROOT / "source" / "Load_Protocol_v1.0.0.pdf"
    archive_sha256 = digest(archive)
    archive_md5 = digest(archive, "md5")
    protocol_sha256 = digest(protocol)
    protocol_md5 = digest(protocol, "md5")
    if archive_sha256 != "8f32e7bdddbe2a262ed227df108a6fd05df87a5752ca1574f586b10a7748e929":
        raise ValueError("archive SHA-256 mismatch")
    if archive_md5 != "da06b1056528e8429e7f64e3019cb17b":
        raise ValueError("archive Zenodo MD5 mismatch")
    if protocol_sha256 != "7346ffbc5df666dd710088c4765069a3c7e86801410bcc1a73a1c33fb6b17433":
        raise ValueError("protocol SHA-256 mismatch")
    if protocol_md5 != "fc4ad29433778e688abadccc47530099":
        raise ValueError("protocol Zenodo MD5 mismatch")

    runs = {
        name: inspect_csv(ROOT / "selected" / name, metadata)
        for name, metadata in SOURCE_FILES.items()
    }
    pairs: dict[str, Any] = {}
    for pair_id in ("P05_BEFORE_AFTER_EQ", "P10_BEFORE_AFTER_EQ"):
        pair_runs = [run for run in runs.values() if run["pair"] == pair_id]
        a = next(run for run in pair_runs if run["role"] == "REFERENCE_A")
        b = next(run for run in pair_runs if run["role"] == "RETURN_B")
        deltas = {}
        for channel in ("actuator_1", "actuator_2"):
            value_a = a["channels"][channel]
            value_b = b["channels"][channel]
            deltas[channel] = {
                "gain_relative_delta": relative_delta(
                    value_a["gain_kn_per_mm"], value_b["gain_kn_per_mm"]
                ),
                "phase_absolute_delta_deg": abs(
                    wrap_degrees(
                        value_b["force_relative_to_displacement_phase_deg"]
                        - value_a["force_relative_to_displacement_phase_deg"]
                    )
                ),
            }
        pairs[pair_id] = {
            "relation": "BEFORE_EQ_TO_AFTER_EQ",
            "frequency_hz": a["frequency_hz"],
            "nominal_displacement_mm": a["nominal_displacement_mm"],
            "a_file": Path(a["path"]).name,
            "b_file": Path(b["path"]).name,
            "deltas": deltas,
            "interpretation_boundary": "Observed before/after relation; not an independent repeatability pair and not a causal earthquake-effect estimate.",
        }

    result = {
        "schema": "nexah-hz-fz-public-source-intake/0.1.0",
        "case_id": "HZ_FZ_PUBLIC_01",
        "classification": "SOURCE_INTAKE_ACCEPTED_EXTERNAL_E2_ONLY",
        "source": {
            "title": "Dataset of real-time hybrid simulation testing of multiple shape memory alloy based structural control devices",
            "publisher": "Zenodo",
            "doi": "10.5281/zenodo.17296336",
            "creators": ["Florian Kolisch", "Selin Oflazgil", "Sven Klinkel"],
            "institution": "RWTH Aachen University, Chair of Structural Analysis and Dynamics",
            "license": "CC BY-SA 4.0",
            "archive_sha256": archive_sha256,
            "archive_zenodo_md5": archive_md5,
            "protocol_sha256": protocol_sha256,
            "protocol_zenodo_md5": protocol_md5,
        },
        "runs": runs,
        "pairs": pairs,
        "missing_for_hz_fz_01_admission": [
            "measured electrical drive voltage channel",
            "separate zero-drive NULL run",
            "calibration certificate identifier and expanded uncertainty",
            "independent same-condition replay without the intervening earthquake campaign",
        ],
        "runtime_effect": "NO_HZ_FZ_01_PROFILE_ACTIVATION",
        "next_gate": "PUBLIC_SOURCE_KERNEL_ATTACHMENT_CONTRACT",
    }
    rendered = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(json.dumps({"classification": "FAIL_CLOSED", "error": str(error)}))
        raise SystemExit(2)
