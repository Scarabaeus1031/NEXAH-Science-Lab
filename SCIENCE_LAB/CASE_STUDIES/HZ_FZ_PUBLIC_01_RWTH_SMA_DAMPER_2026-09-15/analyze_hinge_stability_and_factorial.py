#!/usr/bin/env python3
"""Audit hinge features across active cuts and inventory the 8-wire factorial grid."""

from __future__ import annotations

import csv
import hashlib
import io
import json
import math
from pathlib import Path
import re
from typing import Any
import zipfile

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy.signal import savgol_filter


ROOT = Path(__file__).resolve().parent
ARCHIVE = ROOT / "source" / "Data_v1.0.0.zip"
RESULT = ROOT / "HINGE_STABILITY_AND_FACTORIAL_RESULT.json"
INVENTORY = ROOT / "FACTORIAL_SOURCE_INVENTORY.csv"
VISUAL = ROOT / "NEXAH_HINGE_STABILITY_FACTORIAL_MAP.png"
PAIR_SPECS = (
    ("P05_BEFORE_AFTER_EQ", "07_4wires_sin20mm_0p5Hz.csv", "09_4wires_sin20mm_0p5Hz_after_EQ.csv", 0.5, 20.0),
    ("P10_BEFORE_AFTER_EQ", "08_4wires_sin40mm_1p0Hz.csv", "10_4wires_sin40mm_1p0Hz_after_EQ.csv", 1.0, 40.0),
)
FACTORIAL_PATTERN = re.compile(r"^(0[1-6])_8wires_sin(20|40)mm_(0p1|0p5|1p0)Hz\.csv$")
BLUE, ORANGE, GREEN, MAGENTA, YELLOW = "#54c8ff", "#ff9a3c", "#61d68b", "#ef70bd", "#f2c96d"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def stats(values: list[float]) -> dict[str, float]:
    array = np.asarray(values, dtype=float)
    return {
        "median": float(np.median(array)),
        "q1": float(np.quantile(array, 0.25)),
        "q3": float(np.quantile(array, 0.75)),
        "minimum": float(np.min(array)),
        "maximum": float(np.max(array)),
        "mean": float(np.mean(array)),
        "sample_sd": float(np.std(array, ddof=1)) if len(array) > 1 else 0.0,
        "count": int(len(array)),
    }


def harmonic(time: np.ndarray, values: np.ndarray, frequency: float) -> complex:
    centered = values - np.mean(values)
    return complex(2 * np.sum(centered * np.exp(-2j * np.pi * frequency * time)) / len(values))


def wrap_degrees(value: float) -> float:
    return (value + 180.0) % 360.0 - 180.0


def harmonic_fit(time: np.ndarray, values: np.ndarray, frequency: float) -> np.ndarray:
    design = np.column_stack((np.ones(len(time)), np.sin(2*np.pi*frequency*time), np.cos(2*np.pi*frequency*time)))
    return design @ np.linalg.lstsq(design, values, rcond=None)[0]


def local_slope(x: np.ndarray, y: np.ndarray, index: int, before: bool) -> float:
    selection = slice(index - 12, index - 3) if before else slice(index + 3, index + 12)
    return float(np.polyfit(x[selection], y[selection], 1)[0])


def branch_gap(displacement: np.ndarray, force: np.ndarray) -> dict[str, float]:
    velocity = np.gradient(displacement)
    branches = []
    for selector in (velocity > 0, velocity < 0):
        x, y = displacement[selector], force[selector]
        order = np.argsort(x)
        x, y = x[order], y[order]
        unique_x, unique_index = np.unique(x, return_index=True)
        branches.append((unique_x, y[unique_index]))
    low = max(branches[0][0].min(), branches[1][0].min())
    high = min(branches[0][0].max(), branches[1][0].max())
    grid = np.linspace(low, high, 401)
    up = np.interp(grid, branches[0][0], branches[0][1])
    down = np.interp(grid, branches[1][0], branches[1][1])
    gap = up - down
    zero_gap = float(np.interp(0.0, grid, gap)) if low <= 0 <= high else float("nan")
    return {
        "maximum_absolute_gap_kn": float(np.max(np.abs(gap))),
        "median_absolute_gap_kn": float(np.median(np.abs(gap))),
        "gap_at_zero_displacement_kn": zero_gap,
        "absolute_gap_area_j": float(np.trapz(np.abs(gap), grid)),
    }


def active_segments(table: pd.DataFrame, frequency: float, nominal_mm: float) -> list[tuple[int, pd.DataFrame]]:
    samples = round(512.0 / frequency)
    output = []
    for index in range(len(table) // samples):
        segment = table.iloc[index*samples:(index+1)*samples].copy().reset_index(drop=True)
        amplitude = (segment["Actuator1_Disp"].max() - segment["Actuator1_Disp"].min()) / 2.0
        if amplitude >= 0.9 * nominal_mm:
            output.append((index + 1, segment))
    return output


def hinge_record(a: pd.DataFrame, b: pd.DataFrame, frequency: float, actuator: int, cycle_number: int) -> dict[str, Any]:
    time = a["Time"].to_numpy(float)
    fraction = np.arange(len(a), dtype=float) / len(a)
    x_a = a[f"Actuator{actuator}_Disp"].to_numpy(float)
    x_b = b[f"Actuator{actuator}_Disp"].to_numpy(float)
    f_a = a[f"Actuator{actuator}_Force"].to_numpy(float)
    f_b = b[f"Actuator{actuator}_Force"].to_numpy(float)
    nonfund_a = savgol_filter(f_a - harmonic_fit(time, f_a, frequency), 21, 3)
    nonfund_b = savgol_filter(f_b - harmonic_fit(time, f_b, frequency), 21, 3)
    score = np.abs(np.gradient(np.gradient(nonfund_a))) + np.abs(np.gradient(np.gradient(nonfund_b)))
    central = (fraction >= 0.4) & (fraction <= 0.6)
    candidate = int(np.flatnonzero(central)[np.argmax(score[central])])
    smooth_residual = savgol_filter(f_b - f_a, 21, 3)
    touch_count = int(np.sum(np.signbit(smooth_residual[:-1]) != np.signbit(smooth_residual[1:])))
    area_a = float(np.trapz(f_a, x_a))
    area_b = float(np.trapz(f_b, x_b))
    return {
        "cycle": cycle_number,
        "candidate_cycle_fraction": float(fraction[candidate]),
        "candidate_nonfundamental_difference_kn": float(nonfund_b[candidate] - nonfund_a[candidate]),
        "candidate_force_difference_kn": float(f_b[candidate] - f_a[candidate]),
        "cut_touch_count_smoothed_time_view": touch_count,
        "loop_area_j": {"REFERENCE_A": area_a, "RETURN_B": area_b},
        "loop_area_change_percent_from_a": 100.0 * (abs(area_b) - abs(area_a)) / abs(area_a),
        "local_tangent_change_kn_per_mm": {
            "REFERENCE_A": local_slope(x_a, f_a, candidate, False) - local_slope(x_a, f_a, candidate, True),
            "RETURN_B": local_slope(x_b, f_b, candidate, False) - local_slope(x_b, f_b, candidate, True),
        },
        "branch_gap": {"REFERENCE_A": branch_gap(x_a, f_a), "RETURN_B": branch_gap(x_b, f_b)},
    }


def analyze_selected_pairs() -> dict[str, Any]:
    selected = ROOT / "selected"
    output = {}
    for pair_id, a_name, b_name, frequency, nominal in PAIR_SPECS:
        a = pd.read_csv(selected / a_name)
        b = pd.read_csv(selected / b_name)
        a_active = dict(active_segments(a, frequency, nominal))
        b_active = dict(active_segments(b, frequency, nominal))
        common = sorted(set(a_active) & set(b_active))
        actuators = {}
        for actuator in (1, 2):
            records = [hinge_record(a_active[number], b_active[number], frequency, actuator, number) for number in common]
            summaries = {
                "candidate_cycle_fraction": stats([r["candidate_cycle_fraction"] for r in records]),
                "candidate_nonfundamental_difference_kn": stats([r["candidate_nonfundamental_difference_kn"] for r in records]),
                "loop_area_change_percent_from_a": stats([r["loop_area_change_percent_from_a"] for r in records]),
                "tangent_change_reference_a_kn_per_mm": stats([r["local_tangent_change_kn_per_mm"]["REFERENCE_A"] for r in records]),
                "tangent_change_return_b_kn_per_mm": stats([r["local_tangent_change_kn_per_mm"]["RETURN_B"] for r in records]),
                "maximum_branch_gap_reference_a_kn": stats([r["branch_gap"]["REFERENCE_A"]["maximum_absolute_gap_kn"] for r in records]),
                "maximum_branch_gap_return_b_kn": stats([r["branch_gap"]["RETURN_B"]["maximum_absolute_gap_kn"] for r in records]),
            }
            actuators[f"actuator_{actuator}"] = {"records": records, "summary": summaries}
        output[pair_id] = {
            "frequency_hz": frequency, "nominal_displacement_mm": nominal,
            "common_active_cycles": common, "actuators": actuators,
        }
    return output


def parse_frequency(token: str) -> float:
    return float(token.replace("p", "."))


def analyze_factorial() -> tuple[list[dict[str, Any]], dict[str, Any]]:
    rows = []
    with zipfile.ZipFile(ARCHIVE) as archive:
        for member in archive.namelist():
            name = Path(member).name
            match = FACTORIAL_PATTERN.match(name)
            if not match:
                continue
            raw = archive.read(member)
            table = pd.read_csv(io.BytesIO(raw))
            if list(table.columns) != ["Time", "Actuator1_Disp", "Actuator1_Force"]:
                raise ValueError(f"unexpected factorial columns: {name}")
            if table.isna().any().any() or not np.isfinite(table.to_numpy(float)).all():
                raise ValueError(f"invalid factorial values: {name}")
            frequency = parse_frequency(match.group(3))
            nominal = float(match.group(2))
            step = np.diff(table["Time"].to_numpy(float))
            effective_rate = (len(table) - 1) / float(table["Time"].iloc[-1] - table["Time"].iloc[0])
            if not np.all(step > 0) or not math.isclose(effective_rate, 512.0, rel_tol=0, abs_tol=1e-3):
                raise ValueError(f"unexpected factorial sampling: {name}")
            segments = active_segments(table, frequency, nominal)
            cycle_rows = []
            for number, segment in segments:
                time = segment["Time"].to_numpy(float)
                displacement = segment["Actuator1_Disp"].to_numpy(float)
                force = segment["Actuator1_Force"].to_numpy(float)
                d = harmonic(time, displacement, frequency)
                f = harmonic(time, force, frequency)
                cycle_rows.append({
                    "cycle": number,
                    "gain_kn_per_mm": abs(f) / abs(d),
                    "phase_deg": wrap_degrees(math.degrees(np.angle(f/d))),
                    "loop_area_j": abs(float(np.trapz(force, displacement))),
                    "maximum_branch_gap_kn": branch_gap(displacement, force)["maximum_absolute_gap_kn"],
                })
            row = {
                "archive_member": member,
                "source_sha256": hashlib.sha256(raw).hexdigest(),
                "wires": 8,
                "nominal_displacement_mm": nominal,
                "frequency_hz": frequency,
                "rows": len(table),
                "duration_s": float(table["Time"].iloc[-1] - table["Time"].iloc[0]),
                "sample_rate_hz": 512.0,
                "active_cycle_count": len(cycle_rows),
                "active_cycles": ",".join(str(item["cycle"]) for item in cycle_rows),
                "median_gain_kn_per_mm": float(np.median([item["gain_kn_per_mm"] for item in cycle_rows])),
                "median_phase_deg": float(np.median([item["phase_deg"] for item in cycle_rows])),
                "median_loop_area_j": float(np.median([item["loop_area_j"] for item in cycle_rows])),
                "median_maximum_branch_gap_kn": float(np.median([item["maximum_branch_gap_kn"] for item in cycle_rows])),
            }
            rows.append(row)
    rows.sort(key=lambda row: (row["nominal_displacement_mm"], row["frequency_hz"]))
    matrix = {
        "design": "2 nominal displacement levels x 3 frequency levels; 8-wire configuration",
        "amplitude_levels_mm": sorted(set(row["nominal_displacement_mm"] for row in rows)),
        "frequency_levels_hz": sorted(set(row["frequency_hz"] for row in rows)),
        "complete_factorial": len(rows) == 6,
        "records": rows,
        "claim_boundary": "This grid separates nominal displacement and frequency within the 8-wire configuration; it does not isolate every other apparatus or history variable.",
    }
    return rows, matrix


def write_inventory(rows: list[dict[str, Any]]) -> None:
    with INVENTORY.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def render(pairs: dict[str, Any], factorial_rows: list[dict[str, Any]]) -> None:
    plt.style.use("dark_background")
    fig, axes = plt.subplots(2, 2, figsize=(16, 11))
    fig.patch.set_facecolor("#0d1016")
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.09, top=0.88, hspace=0.34, wspace=0.2)
    for axis in axes.flat:
        axis.set_facecolor("#121722")
        axis.grid(color="#637083", alpha=0.18, linewidth=0.7)
        for spine in axis.spines.values():
            spine.set_color("#3a4350")

    styles = {
        ("P05_BEFORE_AFTER_EQ", "actuator_1"): (BLUE, "o", "0.5 Hz · actuator 1"),
        ("P05_BEFORE_AFTER_EQ", "actuator_2"): (BLUE, "s", "0.5 Hz · actuator 2"),
        ("P10_BEFORE_AFTER_EQ", "actuator_1"): (ORANGE, "o", "1.0 Hz · actuator 1"),
        ("P10_BEFORE_AFTER_EQ", "actuator_2"): (ORANGE, "s", "1.0 Hz · actuator 2"),
    }
    for (pair_id, actuator), (color, marker, label) in styles.items():
        records = pairs[pair_id]["actuators"][actuator]["records"]
        axes[0, 0].plot([r["cycle"] for r in records], [r["candidate_cycle_fraction"] for r in records],
                        color=color, marker=marker, lw=1.1, ms=5, label=label)
        axes[0, 1].plot([r["cycle"] for r in records], [r["loop_area_change_percent_from_a"] for r in records],
                        color=color, marker=marker, lw=1.1, ms=5, label=label)
    axes[0, 0].axhspan(0.4, 0.6, color=YELLOW, alpha=0.08)
    axes[0, 0].set(title="Hinge candidate position across active cycles", xlabel="nominal cycle window", ylabel="cycle fraction")
    axes[0, 0].legend(frameon=False, fontsize=8, ncol=2)
    axes[0, 1].axhline(0, color="#aab2bf", lw=0.8)
    axes[0, 1].set(title="Loop-area change from Cut A to Cut B", xlabel="nominal cycle window", ylabel="change (%)")
    axes[0, 1].legend(frameon=False, fontsize=8, ncol=2)

    for nominal, color, marker in ((20.0, GREEN, "o"), (40.0, MAGENTA, "s")):
        subset = [row for row in factorial_rows if row["nominal_displacement_mm"] == nominal]
        frequency = [row["frequency_hz"] for row in subset]
        axes[1, 0].plot(frequency, [row["median_gain_kn_per_mm"] for row in subset], color=color, marker=marker, lw=1.8, label=f"{nominal:.0f} mm")
        axes[1, 1].plot(frequency, [row["median_loop_area_j"] for row in subset], color=color, marker=marker, lw=1.8, label=f"{nominal:.0f} mm")
    axes[1, 0].set(title="8-wire factorial: force/displacement gain", xlabel="frequency (Hz)", ylabel="median gain (kN/mm)")
    axes[1, 1].set(title="8-wire factorial: loop area", xlabel="frequency (Hz)", ylabel="median |∮F dx| (J/cycle)")
    for axis in axes[1]:
        axis.set_xscale("log")
        axis.set_xticks([0.1, 0.5, 1.0], labels=["0.1", "0.5", "1.0"])
        axis.legend(frameon=False)

    fig.suptitle("NEXAH HINGE STABILITY AND FREQUENCY–AMPLITUDE GRID", fontsize=18, fontweight="bold", color=YELLOW)
    fig.text(0.5, 0.025, "Top: 4-wire before/after cuts · Bottom: independent 8-wire 2×3 factorial source inventory · descriptive external E2 evidence", ha="center", color="#aab2bf", fontsize=10)
    fig.savefig(VISUAL, dpi=180, facecolor=fig.get_facecolor())
    plt.close(fig)


def main() -> None:
    intake = json.loads((ROOT / "SOURCE_INTAKE_RESULT.json").read_text(encoding="utf-8"))
    pairs = analyze_selected_pairs()
    factorial_rows, factorial = analyze_factorial()
    write_inventory(factorial_rows)
    render(pairs, factorial_rows)
    result = {
        "schema": "nexah-hz-fz-hinge-stability-factorial/0.1.0",
        "case_id": "HZ_FZ_PUBLIC_01",
        "source_archive_sha256": intake["source"]["archive_sha256"],
        "source_archive_verified": digest(ARCHIVE) == intake["source"]["archive_sha256"],
        "hinge_stability": pairs,
        "factorial_source_inventory": factorial,
        "binder_feature_status": {
            "PIN_HINGE": "MEASURED_DESCRIPTIVE_CANDIDATE",
            "GAP": "MEASURED_PER_BRANCH",
            "AREA": "MEASURED_J_PER_CYCLE",
            "ORIENT": "AVAILABLE_FROM_DISPLACEMENT_DIRECTION",
            "TOUCH": "DEFINED_AS_SMOOTHED_TIME_VIEW_ZERO_CROSSING_ONLY",
            "ARC": "AVAILABLE_AS_CONTIGUOUS_SIGNED_RESIDUAL_REGION",
            "physical_switch_claim": "NOT_ADMITTED",
        },
        "next_gate": "CUT_BINDER_V0_1_DESCRIPTIVE_CONTRACT",
    }
    RESULT.write_text(json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "classification": "HINGE_STABILITY_AND_FACTORIAL_COMPLETE",
        "result_sha256": digest(RESULT),
        "inventory_sha256": digest(INVENTORY),
        "visual_sha256": digest(VISUAL),
        "active_pair_cycles": sum(len(pair["common_active_cycles"]) for pair in pairs.values()),
        "actuator_cycle_records": sum(len(data["records"]) for pair in pairs.values() for data in pair["actuators"].values()),
        "factorial_records": len(factorial_rows),
    }, indent=2))


if __name__ == "__main__":
    main()
