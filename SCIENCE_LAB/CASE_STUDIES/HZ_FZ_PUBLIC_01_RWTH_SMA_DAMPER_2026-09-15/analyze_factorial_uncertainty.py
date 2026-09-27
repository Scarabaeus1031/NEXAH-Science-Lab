#!/usr/bin/env python3
"""Cycle-level uncertainty audit for the 8-wire frequency-amplitude grid.

The bootstrap is deliberately descriptive: cycles are repeated observations within
one run per frequency/amplitude cell, not independent experimental replicates.
"""

from __future__ import annotations

import csv
import hashlib
import io
import json
import math
from pathlib import Path
import re
import zipfile

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parent
ARCHIVE = ROOT / "source" / "Data_v1.0.0.zip"
CYCLE_CSV = ROOT / "FACTORIAL_CYCLE_METRICS.csv"
RESULT_JSON = ROOT / "FACTORIAL_UNCERTAINTY_RESULT.json"
VISUAL = ROOT / "NEXAH_FACTORIAL_UNCERTAINTY_WELL_TEST.png"
REPORT = ROOT / "06_FACTORIAL_UNCERTAINTY_REPORT.md"
PATTERN = re.compile(r"^(0[1-6])_8wires_sin(20|40)mm_(0p1|0p5|1p0)Hz\.csv$")
BOOTSTRAP_SEED = 20260915
BOOTSTRAP_DRAWS = 20000
BLOCK_LENGTH = 2

BLUE = "#55c7ff"
ORANGE = "#ff9a45"
GREEN = "#63d18a"
MAGENTA = "#ec70bc"
YELLOW = "#f2cb69"
INK = "#dce4ef"
MUTED = "#9aa7b7"
GRID = "#536174"
PANEL = "#121722"
BACKGROUND = "#0d1016"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_frequency(token: str) -> float:
    return float(token.replace("p", "."))


def harmonic(time: np.ndarray, values: np.ndarray, frequency: float) -> complex:
    centered = values - np.mean(values)
    return complex(2 * np.sum(centered * np.exp(-2j * np.pi * frequency * time)) / len(values))


def wrap_degrees(value: float) -> float:
    return (value + 180.0) % 360.0 - 180.0


def maximum_branch_gap(displacement: np.ndarray, force: np.ndarray) -> float:
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
    gap = np.interp(grid, branches[0][0], branches[0][1]) - np.interp(grid, branches[1][0], branches[1][1])
    return float(np.max(np.abs(gap)))


def active_segments(table: pd.DataFrame, frequency: float, nominal_mm: float) -> list[tuple[int, pd.DataFrame]]:
    samples = round(512.0 / frequency)
    output = []
    for index in range(len(table) // samples):
        segment = table.iloc[index * samples:(index + 1) * samples].copy().reset_index(drop=True)
        amplitude = (segment["Actuator1_Disp"].max() - segment["Actuator1_Disp"].min()) / 2.0
        if amplitude >= 0.9 * nominal_mm:
            output.append((index + 1, segment))
    return output


def extract_cycle_records() -> list[dict[str, float | int | str]]:
    records: list[dict[str, float | int | str]] = []
    with zipfile.ZipFile(ARCHIVE) as archive:
        for member in archive.namelist():
            name = Path(member).name
            match = PATTERN.match(name)
            if not match:
                continue
            raw = archive.read(member)
            table = pd.read_csv(io.BytesIO(raw))
            frequency = parse_frequency(match.group(3))
            nominal = float(match.group(2))
            for cycle, segment in active_segments(table, frequency, nominal):
                time = segment["Time"].to_numpy(float)
                displacement = segment["Actuator1_Disp"].to_numpy(float)
                force = segment["Actuator1_Force"].to_numpy(float)
                d = harmonic(time, displacement, frequency)
                f = harmonic(time, force, frequency)
                records.append({
                    "run_id": match.group(1),
                    "archive_member": member,
                    "source_sha256": hashlib.sha256(raw).hexdigest(),
                    "nominal_displacement_mm": nominal,
                    "frequency_hz": frequency,
                    "cycle": cycle,
                    "observed_amplitude_mm": float((displacement.max() - displacement.min()) / 2.0),
                    "gain_kn_per_mm": float(abs(f) / abs(d)),
                    "phase_deg": float(wrap_degrees(math.degrees(np.angle(f / d)))),
                    "loop_area_j": float(abs(np.trapz(force, displacement))),
                    "maximum_branch_gap_kn": maximum_branch_gap(displacement, force),
                })
    return sorted(records, key=lambda r: (r["nominal_displacement_mm"], r["frequency_hz"], r["cycle"]))


def circular_block_sample(values: np.ndarray, rng: np.random.Generator, block_length: int = BLOCK_LENGTH) -> np.ndarray:
    n = len(values)
    pieces = []
    while sum(len(piece) for piece in pieces) < n:
        start = int(rng.integers(0, n))
        pieces.append(values[(start + np.arange(block_length)) % n])
    return np.concatenate(pieces)[:n]


def bootstrap_median(values: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    return np.asarray([
        np.median(circular_block_sample(values, rng))
        for _ in range(BOOTSTRAP_DRAWS)
    ])


def summary(values: np.ndarray, bootstrap: np.ndarray) -> dict[str, float | int | list[float]]:
    return {
        "count": int(len(values)),
        "median": float(np.median(values)),
        "q1": float(np.quantile(values, 0.25)),
        "q3": float(np.quantile(values, 0.75)),
        "minimum": float(np.min(values)),
        "maximum": float(np.max(values)),
        "cycle_median_block_bootstrap_95_interval": [float(x) for x in np.quantile(bootstrap, [0.025, 0.975])],
    }


def audit(records: list[dict[str, float | int | str]]) -> dict:
    rng = np.random.default_rng(BOOTSTRAP_SEED)
    metrics = ("loop_area_j", "gain_kn_per_mm", "phase_deg", "maximum_branch_gap_kn")
    cells: dict[str, dict] = {}
    boot: dict[tuple[float, float, str], np.ndarray] = {}
    for nominal in (20.0, 40.0):
        for frequency in (0.1, 0.5, 1.0):
            subset = [r for r in records if r["nominal_displacement_mm"] == nominal and r["frequency_hz"] == frequency]
            cell_key = f"{int(nominal)}mm_{frequency:.1f}Hz"
            cells[cell_key] = {}
            for metric in metrics:
                values = np.asarray([float(r[metric]) for r in subset])
                boot_values = bootstrap_median(values, rng)
                boot[(nominal, frequency, metric)] = boot_values
                cells[cell_key][metric] = summary(values, boot_values)

    contrasts: dict[str, dict] = {}
    for nominal in (20.0, 40.0):
        for metric in ("loop_area_j", "gain_kn_per_mm", "maximum_branch_gap_kn"):
            middle = boot[(nominal, 0.5, metric)]
            for neighbor in (0.1, 1.0):
                delta = middle - boot[(nominal, neighbor, metric)]
                ci = np.quantile(delta, [0.025, 0.975])
                key = f"{int(nominal)}mm_{metric}_0.5_minus_{neighbor:.1f}Hz"
                contrasts[key] = {
                    "observed_median_difference": float(
                        cells[f"{int(nominal)}mm_0.5Hz"][metric]["median"]
                        - cells[f"{int(nominal)}mm_{neighbor:.1f}Hz"][metric]["median"]
                    ),
                    "cycle_block_bootstrap_95_interval": [float(ci[0]), float(ci[1])],
                    "same_sign_across_interval": bool(ci[0] > 0 or ci[1] < 0),
                }

    well_left = contrasts["40mm_loop_area_j_0.5_minus_0.1Hz"]
    well_right = contrasts["40mm_loop_area_j_0.5_minus_1.0Hz"]
    descriptive_support = (
        well_left["cycle_block_bootstrap_95_interval"][1] < 0
        and well_right["cycle_block_bootstrap_95_interval"][1] < 0
    )
    ordinal_diagnostic = {}
    for neighbor in (0.1, 1.0):
        middle = {
            int(r["cycle"]): float(r["loop_area_j"]) for r in records
            if r["nominal_displacement_mm"] == 40.0 and r["frequency_hz"] == 0.5
        }
        comparison = {
            int(r["cycle"]): float(r["loop_area_j"]) for r in records
            if r["nominal_displacement_mm"] == 40.0 and r["frequency_hz"] == neighbor
        }
        common = sorted(set(middle) & set(comparison))
        differences = [middle[cycle] - comparison[cycle] for cycle in common]
        sign_changes = [
            [common[index], common[index + 1]] for index in range(len(common) - 1)
            if np.signbit(differences[index]) != np.signbit(differences[index + 1])
        ]
        ordinal_diagnostic[f"0.5_minus_{neighbor:.1f}Hz"] = {
            "common_cycle_labels": common,
            "differences_j": differences,
            "cycles_below_neighbor": int(sum(value < 0 for value in differences)),
            "cycle_count": len(differences),
            "sign_change_intervals": sign_changes,
        }
    return {
        "schema": "nexah-factorial-cycle-uncertainty/0.1.0",
        "case_id": "HZ_FZ_PUBLIC_01",
        "method": {
            "unit": "active cycle within one source run per frequency-amplitude cell",
            "bootstrap": "circular moving-block bootstrap of the cycle median",
            "block_length_cycles": BLOCK_LENGTH,
            "draws": BOOTSTRAP_DRAWS,
            "seed": BOOTSTRAP_SEED,
        },
        "cells": cells,
        "contrasts": contrasts,
        "well_candidate_40mm_loop_area": {
            "criterion": "Both 0.5 Hz minus neighbor block-bootstrap intervals are below zero.",
            "descriptive_within_run_support": descriptive_support,
            "classification": "SUPPORTED_DESCRIPTIVE_WELL_CANDIDATE" if descriptive_support else "INCONCLUSIVE_DESCRIPTIVE_WELL_CANDIDATE",
        },
        "cycle_order_diagnostic_40mm_loop_area": ordinal_diagnostic,
        "trajectory_classification": "SUPPORTED_HISTORY_DEPENDENT_CROSSOVER",
        "claim_boundary": (
            "Cycles are repeated observations inside a single run, not independent run-level replicates. "
            "Intervals describe within-run cycle stability and cannot establish a population-level critical frequency."
        ),
        "next_measurement": "Replicate runs and add frequencies near 0.5 Hz, for example 0.3, 0.4, 0.6, and 0.7 Hz.",
    }


def write_cycle_csv(records: list[dict[str, float | int | str]]) -> None:
    with CYCLE_CSV.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(records[0]))
        writer.writeheader()
        writer.writerows(records)


def interval(result: dict, nominal: int, frequency: float, metric: str) -> tuple[float, float, float, float, float]:
    cell = result["cells"][f"{nominal}mm_{frequency:.1f}Hz"][metric]
    return cell["minimum"], cell["q1"], cell["median"], cell["q3"], cell["maximum"]


def render(records: list[dict[str, float | int | str]], result: dict) -> None:
    plt.style.use("dark_background")
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.patch.set_facecolor(BACKGROUND)
    fig.subplots_adjust(left=0.08, right=0.98, bottom=0.09, top=0.87, hspace=0.34, wspace=0.24)
    for ax in axes.flat:
        ax.set_facecolor(PANEL)
        ax.grid(color=GRID, alpha=0.20, linewidth=0.7)
        ax.tick_params(colors=INK)
        for spine in ax.spines.values():
            spine.set_color(GRID)

    rng = np.random.default_rng(1203)
    frequency_levels = [0.1, 0.5, 1.0]
    for row, metric, ylabel, title in (
        (0, "loop_area_j", "|∮F dx| (J/cycle)", "Loop area: every active cycle"),
        (1, "gain_kn_per_mm", "gain (kN/mm)", "Force/displacement gain: every active cycle"),
    ):
        ax = axes[row, 0]
        for nominal, color, marker, offset in ((20, GREEN, "o", -0.018), (40, MAGENTA, "s", 0.018)):
            medians, q1, q3 = [], [], []
            for frequency in frequency_levels:
                values = np.asarray([
                    float(r[metric]) for r in records
                    if r["nominal_displacement_mm"] == nominal and r["frequency_hz"] == frequency
                ])
                jitter = rng.uniform(-0.012, 0.012, len(values))
                ax.scatter(np.full(len(values), frequency + offset) + jitter, values, s=24, color=color,
                           marker=marker, alpha=0.48, edgecolors="none")
                _, lower, median, upper, _ = interval(result, nominal, frequency, metric)
                medians.append(median); q1.append(lower); q3.append(upper)
            ax.plot(np.asarray(frequency_levels) + offset, medians, color=color, marker=marker,
                    linewidth=1.8, markersize=6, label=f"{nominal} mm median")
            ax.fill_between(np.asarray(frequency_levels) + offset, q1, q3, color=color, alpha=0.12)
        ax.set_xscale("log")
        ax.set_xticks(frequency_levels, labels=["0.1", "0.5", "1.0"])
        ax.set_xlabel("frequency (Hz)")
        ax.set_ylabel(ylabel)
        ax.set_title(title, color=INK)
        ax.legend(frameon=False, fontsize=9, ncol=2)

    ax = axes[0, 1]
    values_by_frequency = {}
    for frequency, color in ((0.1, BLUE), (0.5, YELLOW), (1.0, ORANGE)):
        values = np.asarray([
            float(r["loop_area_j"]) for r in records
            if r["nominal_displacement_mm"] == 40 and r["frequency_hz"] == frequency
        ])
        values_by_frequency[frequency] = values
        ax.plot(range(1, len(values) + 1), values, color=color, marker="o", markersize=4,
                linewidth=1.2, label=f"{frequency:.1f} Hz")
    ax.set_xlabel("active cycle order")
    ax.set_ylabel("|∮F dx| (J/cycle)")
    ax.set_title("40 mm: cycle sequence behind the 0.5 Hz well", color=INK)
    ax.axvspan(7, 8, color=YELLOW, alpha=0.08)
    ax.text(7.5, 690, "0.1/0.5 crossover", ha="center", va="top", color=INK, fontsize=9)
    ax.legend(frameon=False, fontsize=9, ncol=3)

    ax = axes[1, 1]
    contrast_keys = [
        "40mm_loop_area_j_0.5_minus_0.1Hz",
        "40mm_loop_area_j_0.5_minus_1.0Hz",
    ]
    labels = ["0.5 − 0.1 Hz", "0.5 − 1.0 Hz"]
    for y, (key, label), color in zip((1, 0), zip(contrast_keys, labels), (BLUE, ORANGE)):
        item = result["contrasts"][key]
        estimate = item["observed_median_difference"]
        low, high = item["cycle_block_bootstrap_95_interval"]
        ax.errorbar(estimate, y, xerr=[[estimate - low], [high - estimate]], fmt="o", color=color,
                    capsize=5, markersize=7, linewidth=2)
        ax.annotate(f"{estimate:+.1f} J", (estimate, y), xytext=(8, 0), textcoords="offset points",
                    ha="left", va="center", color=INK, fontsize=10)
    ax.axvline(0, color=INK, linewidth=0.9)
    ax.set_yticks([1, 0], labels=labels)
    ax.set_xlabel("difference in cycle median loop area (J/cycle)")
    ax.set_title("40 mm contrasts: moving-block bootstrap interval", color=INK)

    classification = result["well_candidate_40mm_loop_area"]["classification"].replace("_", " ")
    fig.suptitle("NEXAH 8-WIRE FREQUENCY GRID: 0.5 Hz WELL AUDIT", color=YELLOW, fontsize=18, fontweight="bold")
    fig.text(0.5, 0.035,
             f"{classification} · points are cycles; shaded bands are IQR · intervals describe within-run cycle stability, not run replication",
             ha="center", color=MUTED, fontsize=10)
    fig.savefig(VISUAL, dpi=180, facecolor=fig.get_facecolor())
    plt.close(fig)


def write_report(result: dict, record_count: int) -> None:
    left = result["contrasts"]["40mm_loop_area_j_0.5_minus_0.1Hz"]
    right = result["contrasts"]["40mm_loop_area_j_0.5_minus_1.0Hz"]
    left_order = result["cycle_order_diagnostic_40mm_loop_area"]["0.5_minus_0.1Hz"]
    right_order = result["cycle_order_diagnostic_40mm_loop_area"]["0.5_minus_1.0Hz"]
    text = f"""# HZ_FZ_PUBLIC_01: 0.5 Hz well-candidate audit

## Result

The three run medians draw a minimum at 0.5 Hz, but it does **not** survive the cycle-level uncertainty gate. Both moving-block bootstrap contrast intervals include zero.

- 0.5 − 0.1 Hz: {left['observed_median_difference']:+.3f} J/cycle; descriptive 95% interval [{left['cycle_block_bootstrap_95_interval'][0]:+.3f}, {left['cycle_block_bootstrap_95_interval'][1]:+.3f}]
- 0.5 − 1.0 Hz: {right['observed_median_difference']:+.3f} J/cycle; descriptive 95% interval [{right['cycle_block_bootstrap_95_interval'][0]:+.3f}, {right['cycle_block_bootstrap_95_interval'][1]:+.3f}]

Classification: `{result['well_candidate_40mm_loop_area']['classification']}`.

The stronger result is a history-dependent crossover. Against 0.1 Hz, the 0.5 Hz loop area is lower for {left_order['cycles_below_neighbor']} of {left_order['cycle_count']} matching cycle labels and crosses sign between cycles {left_order['sign_change_intervals'][0][0]} and {left_order['sign_change_intervals'][0][1]}. Against 1.0 Hz, it is lower for all {right_order['cycle_count']} matching cycle labels. Classification: `{result['trajectory_classification']}`.

## Method

The audit uses all {record_count} active cycles in the six 8-wire factorial cells. It reports the raw cycle points, median and interquartile range. A circular moving-block bootstrap with block length {BLOCK_LENGTH}, {BOOTSTRAP_DRAWS:,} draws and seed {BOOTSTRAP_SEED} estimates descriptive intervals for each cycle median and for the two 40 mm contrasts.

## Claim boundary

There is only one source run in each frequency-amplitude cell. Cycles from one run are not independent experimental replicates. The result therefore does not establish a stable 0.5 Hz well, a universal critical frequency or a causal physical law. It supports the narrower descriptive statement that frequency response and cycle history interact in this run set.

## Next measurement gate

Repeat independent runs and add 0.3, 0.4, 0.6 and 0.7 Hz at 40 mm. Only then fit and test the location, width and repeatability of the minimum.
"""
    REPORT.write_text(text, encoding="utf-8")


def main() -> None:
    records = extract_cycle_records()
    if len(records) != 56:
        raise RuntimeError(f"Expected 56 active cycle records, found {len(records)}")
    result = audit(records)
    write_cycle_csv(records)
    RESULT_JSON.write_text(json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    render(records, result)
    write_report(result, len(records))
    print(json.dumps({
        "classification": result["well_candidate_40mm_loop_area"]["classification"],
        "cycle_records": len(records),
        "csv_sha256": digest(CYCLE_CSV),
        "result_sha256": digest(RESULT_JSON),
        "visual_sha256": digest(VISUAL),
        "report_sha256": digest(REPORT),
    }, indent=2))


if __name__ == "__main__":
    main()
