#!/usr/bin/env python3
"""Audit HZ/FZ cycle paths and build the descriptive Compass-Binder record."""

from __future__ import annotations

import csv
import hashlib
import json
import math
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from analyze_factorial_uncertainty import (
    BLOCK_LENGTH,
    BOOTSTRAP_DRAWS,
    BOOTSTRAP_SEED,
    circular_block_sample,
)


ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "FACTORIAL_CYCLE_METRICS.csv"
RESULT_PATH = ROOT / "CYCLE_PATH_SEQUENCE_RESULT.json"
BINDER_PATH = ROOT / "COMPASS_BINDER_V0_1.json"
REPORT_PATH = ROOT / "08_CYCLE_PATH_SEQUENCE_REPORT.md"
VISUAL_PATH = ROOT / "NEXAH_CYCLE_PATH_SEQUENCE_AUDIT.png"
DATA_JS_PATH = ROOT.parent.parent / "EXPORTS" / "NEXAH_HZ_FZ_MISSION_DATA.js"

BACKGROUND = "#090c12"
PANEL = "#111723"
GRID = "#526078"
INK = "#dce4ef"
MUTED = "#97a5b8"
BLUE = "#54c8ff"
YELLOW = "#f3cf65"
ORANGE = "#ff9842"
MAGENTA = "#ec70bd"
GREEN = "#62d18b"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def wrap_degrees(value: np.ndarray | float) -> np.ndarray | float:
    return (value + 180.0) % 360.0 - 180.0


def load_40mm() -> dict[float, dict[int, float]]:
    output: dict[float, dict[int, float]] = {0.1: {}, 0.5: {}, 1.0: {}}
    with CSV_PATH.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if float(row["nominal_displacement_mm"]) != 40.0:
                continue
            frequency = float(row["frequency_hz"])
            output[frequency][int(row["cycle"])] = float(row["loop_area_j"])
    return output


def crossing_positions(a: np.ndarray, b: np.ndarray, axis: np.ndarray) -> list[float]:
    output: list[float] = []
    for index in range(len(axis) - 1):
        d0, d1 = a[index] - b[index], a[index + 1] - b[index + 1]
        if d0 == 0:
            output.append(float(axis[index]))
        elif d0 * d1 < 0:
            fraction = abs(d0) / (abs(d0) + abs(d1))
            output.append(float(axis[index] + fraction * (axis[index + 1] - axis[index])))
    return output


def make_view(source: dict[float, dict[int, float]], mode: str) -> dict:
    if mode == "active_order":
        n = min(len(source[f]) for f in source)
        axis = np.arange(1, n + 1, dtype=float)
        values = {f: np.asarray(list(source[f].values())[:n], dtype=float) for f in source}
        labels = [f"active {i}" for i in range(1, n + 1)]
    else:
        cycles = sorted(set.intersection(*(set(source[f]) for f in source)))
        axis = np.asarray(cycles, dtype=float)
        values = {f: np.asarray([source[f][c] for c in cycles], dtype=float) for f in source}
        labels = [f"cycle {c}" for c in cycles]
    path_x = values[0.5] - values[0.1]
    path_y = values[0.5] - values[1.0]
    crossings = {
        "0.5_vs_1.0": crossing_positions(values[0.5], values[1.0], axis),
        "0.1_vs_1.0": crossing_positions(values[0.1], values[1.0], axis),
        "0.1_vs_0.5": crossing_positions(values[0.1], values[0.5], axis),
    }
    return {
        "mode": mode,
        "axis": axis.tolist(),
        "labels": labels,
        "series_j": {str(f): values[f].tolist() for f in values},
        "path": [
            {
                "index": int(i + 1),
                "axis_value": float(axis[i]),
                "label": labels[i],
                "delta_l_j": float(path_x[i]),
                "delta_r_j": float(path_y[i]),
                "radius_j": float(math.hypot(path_x[i], path_y[i])),
                "angle_deg": float(math.degrees(math.atan2(path_y[i], path_x[i])) % 360.0),
            }
            for i in range(len(axis))
        ],
        "crossings": crossings,
        "crossing_count": int(sum(len(v) for v in crossings.values())),
    }


def reference_screen(cloud_x: np.ndarray, cloud_y: np.ndarray, observed_ratio: float) -> list[dict]:
    references = [
        ("sqrt(2)", math.sqrt(2.0)),
        ("phi", (1.0 + math.sqrt(5.0)) / 2.0),
        ("2:1", 2.0),
        ("2*sqrt(2)", 2.0 * math.sqrt(2.0)),
        ("gamma^-2", 3.0),
        ("pi", math.pi),
    ]
    angles = np.degrees(np.arctan2(cloud_y, cloud_x)) % 360.0
    output = []
    for name, ratio in references:
        ray = math.degrees(math.atan2(-ratio, -1.0)) % 360.0
        residual = wrap_degrees(angles - ray)
        output.append({
            "name": name,
            "ratio": ratio,
            "negative_ray_angle_deg": ray,
            "point_relative_error_percent": 100.0 * (observed_ratio / ratio - 1.0),
            "bootstrap_within_5_deg_fraction": float(np.mean(np.abs(residual) <= 5.0)),
            "bootstrap_within_10_deg_fraction": float(np.mean(np.abs(residual) <= 10.0)),
        })
    return output


def reflection_score(points: np.ndarray, axis_angle_deg: float) -> dict:
    theta = math.radians(axis_angle_deg)
    unit = np.asarray([math.cos(theta), math.sin(theta)])
    reflected = np.asarray([2.0 * unit * np.dot(point, unit) - point for point in points])
    nearest = []
    partners = []
    for i, point in enumerate(reflected):
        distances = np.linalg.norm(points - point, axis=1)
        distances[i] = np.inf
        j = int(np.argmin(distances))
        nearest.append(float(distances[j]))
        partners.append(j + 1)
    scale = float(np.median(np.linalg.norm(points, axis=1)))
    return {
        "axis_angle_deg": axis_angle_deg,
        "nearest_partner_active_order": partners,
        "normalized_median_nearest_residual": float(np.median(nearest) / scale),
        "interpretation": "0 would be exact reflection pairing; this is a descriptive small-n diagnostic only",
    }


def analyze() -> tuple[dict, dict, np.ndarray, np.ndarray]:
    source = load_40mm()
    active = make_view(source, "active_order")
    nominal = make_view(source, "nominal_cycle_label")

    # The point estimate and bootstrap preserve the previously frozen compass
    # definition: each run contributes all of its accepted cycles.  The path
    # views below are explicitly separate alignment diagnostics.
    raw_arrays = {frequency: np.asarray(list(cycles.values()), dtype=float) for frequency, cycles in source.items()}
    observed_x = float(np.median(raw_arrays[0.5]) - np.median(raw_arrays[0.1]))
    observed_y = float(np.median(raw_arrays[0.5]) - np.median(raw_arrays[1.0]))
    observed_ratio = abs(observed_y / observed_x)
    observed_angle = math.degrees(math.atan2(observed_y, observed_x)) % 360.0

    rng = np.random.default_rng(BOOTSTRAP_SEED + 1)
    cloud_x = np.empty(BOOTSTRAP_DRAWS)
    cloud_y = np.empty(BOOTSTRAP_DRAWS)
    for index in range(BOOTSTRAP_DRAWS):
        m01 = np.median(circular_block_sample(raw_arrays[0.1], rng, BLOCK_LENGTH))
        m05 = np.median(circular_block_sample(raw_arrays[0.5], rng, BLOCK_LENGTH))
        m10 = np.median(circular_block_sample(raw_arrays[1.0], rng, BLOCK_LENGTH))
        cloud_x[index] = m05 - m01
        cloud_y[index] = m05 - m10

    active_crossings = [
        active["crossings"]["0.5_vs_1.0"][0],
        active["crossings"]["0.1_vs_1.0"][0],
        active["crossings"]["0.1_vs_0.5"][0],
    ]
    crossing_steps = np.diff(active_crossings)
    constants = {
        "sqrt_2": math.sqrt(2.0),
        "phi": (1.0 + math.sqrt(5.0)) / 2.0,
        "pi": math.pi,
    }
    step_screen = {
        "first_step": float(crossing_steps[0]),
        "second_step": float(crossing_steps[1]),
        "second_over_first": float(crossing_steps[1] / crossing_steps[0]),
        "first_step_relative_error_percent": {
            name: 100.0 * (float(crossing_steps[0]) / value - 1.0) for name, value in constants.items()
        },
        "second_step_relative_error_percent": {
            f"2_times_{name}": 100.0 * (float(crossing_steps[1]) / (2.0 * value) - 1.0)
            for name, value in constants.items()
        },
        "status": "POST_HOC_EXPLORATORY_NOT_A_CONSTANT_IDENTIFICATION",
    }

    values_x, counts_x = np.unique(np.round(cloud_x, 9), return_counts=True)
    peak_order = np.argsort(counts_x)[::-1][:10]
    lattice = [
        {"x_j": float(values_x[i]), "count": int(counts_x[i]), "fraction": float(counts_x[i] / len(cloud_x))}
        for i in peak_order
    ]
    points = np.asarray([[p["delta_l_j"], p["delta_r_j"]] for p in active["path"]])

    result = {
        "schema": "nexah-cycle-path-sequence-audit/0.1.0",
        "case_id": "HZ_FZ_PUBLIC_01",
        "source_csv": CSV_PATH.name,
        "source_csv_sha256": digest(CSV_PATH),
        "active_order_view": active,
        "nominal_cycle_view": nominal,
        "observed_vector_j": [observed_x, observed_y],
        "observed_absolute_ratio": observed_ratio,
        "observed_angle_deg": observed_angle,
        "reference_screen": reference_screen(cloud_x, cloud_y, observed_ratio),
        "crossing_step_screen": step_screen,
        "reflection_screen": reflection_score(points, observed_angle),
        "bootstrap_lattice": {
            "unique_x_band_count_at_1e_minus_9_j": int(len(values_x)),
            "most_populated_x_bands": lattice,
            "interpretation": "Vertical streaks are expected from resampling medians of eight discrete cycle values; they are not independent excitation lines.",
        },
        "alignment_sensitivity": {
            "active_order_crossing_count": active["crossing_count"],
            "nominal_cycle_crossing_count": nominal["crossing_count"],
            "interpretation": "The visible path and crossing sequence depend on whether records are paired by active order or by shared nominal cycle label.",
        },
        "classification": "DESCRIPTIVE_PATH_STRUCTURE_WITH_ALIGNMENT_SENSITIVITY_AND_UNSTABLE_REFERENCE_ORIENTATION",
        "claim_boundary": "All constant rays and reflection checks are exploratory coordinate references on the same source records; they add no independent evidence and identify no physical constant or refraction law.",
    }

    downsample = np.linspace(0, len(cloud_x) - 1, 1200, dtype=int)
    mission = {
        "schema": "nexah-hz-fz-mission-data/0.1.0",
        "generated_from": RESULT_PATH.name,
        "result": result,
        "bootstrap_cloud_j": [[round(float(cloud_x[i]), 5), round(float(cloud_y[i]), 5)] for i in downsample],
    }
    return result, mission, cloud_x, cloud_y


def make_binder(result: dict) -> dict:
    return {
        "schema": "nexah-compass-binder/0.1.0",
        "binder_id": "hz-fz-contrast-compass:paired-median-contrast-v1",
        "case_id": result["case_id"],
        "profile_ref": "hz-fz-transfer@0.1.0",
        "status": "DESCRIPTIVE_E2_SUPPLEMENT_NO_PROFILE_ACTIVATION",
        "source": {
            "record": result["source_csv"],
            "sha256": result["source_csv_sha256"],
            "scope": "40 mm, 8-wire, 0.1/0.5/1.0 Hz cycle records",
        },
        "cuts": {
            "A": {"quantity": "median_loop_area_0.5_minus_0.1", "unit": "J/cycle", "orientation": "LEFT_CONTRAST"},
            "B": {"quantity": "median_loop_area_0.5_minus_1.0", "unit": "J/cycle", "orientation": "RETURN_CONTRAST"},
        },
        "binder": {
            "operation": "PAIR_BY_DECLARED_ALIGNMENT_THEN_MAP_TO_SHARED_CONTRAST_PLANE",
            "default_alignment": "active_order",
            "required_alternative": "nominal_cycle_label",
            "preserves": ["source identity", "units", "cycle label", "active order"],
            "forbids": ["unit averaging", "implicit cycle relabeling", "constant fitting as evidence", "profile activation"],
        },
        "comparison": {
            "observed_vector_j": result["observed_vector_j"],
            "absolute_ratio": result["observed_absolute_ratio"],
            "angle_deg": result["observed_angle_deg"],
            "path_views": ["active_order", "nominal_cycle_label"],
        },
        "uncertainty": {
            "method": "joint circular moving-block bootstrap",
            "block_length_cycles": BLOCK_LENGTH,
            "draws": BOOTSTRAP_DRAWS,
            "reference_screen": result["reference_screen"],
        },
        "decision": result["classification"],
        "claim_boundary": result["claim_boundary"],
    }


def render(result: dict, cloud_x: np.ndarray, cloud_y: np.ndarray) -> None:
    plt.rcParams.update({
        "text.color": INK, "axes.labelcolor": INK, "axes.titlecolor": INK,
        "xtick.color": INK, "ytick.color": INK, "legend.labelcolor": INK,
    })
    fig = plt.figure(figsize=(17, 10), facecolor=BACKGROUND)
    gs = fig.add_gridspec(2, 2, left=0.07, right=0.975, bottom=0.1, top=0.9, hspace=0.34, wspace=0.24)
    axes = [fig.add_subplot(gs[0, 0]), fig.add_subplot(gs[0, 1]), fig.add_subplot(gs[1, 0]), fig.add_subplot(gs[1, 1], projection="polar")]
    for ax in axes:
        ax.set_facecolor(PANEL)
        ax.grid(color=GRID, alpha=0.22, linewidth=0.7)
        for spine in ax.spines.values():
            spine.set_color(GRID)

    active = result["active_order_view"]
    nominal = result["nominal_cycle_view"]
    colors = {"0.1": BLUE, "0.5": YELLOW, "1.0": ORANGE}
    ax = axes[0]
    for key, values in active["series_j"].items():
        ax.plot(active["axis"], values, marker="o", linewidth=1.6, color=colors[key], label=f"{key} Hz")
    ax.set(title="A · Source sequences — active order", xlabel="active-cycle order", ylabel="|∮F dx| (J/cycle)")
    ax.legend(frameon=False, ncol=3)

    ax = axes[1]
    for view, color, label in ((active, MAGENTA, "active order"), (nominal, GREEN, "nominal label")):
        xs = [p["delta_l_j"] for p in view["path"]]
        ys = [p["delta_r_j"] for p in view["path"]]
        ax.plot(xs, ys, marker="o", color=color, linewidth=1.5, label=f"{label}: {view['crossing_count']} crossings")
        for p in view["path"]:
            ax.text(p["delta_l_j"], p["delta_r_j"], str(int(p["axis_value"])), color=color, fontsize=8)
    ax.axhline(0, color=INK, alpha=0.35); ax.axvline(0, color=INK, alpha=0.35)
    ax.set(title="B · Same records, two pairing rules", xlabel="ΔL = 0.5 − 0.1 (J/cycle)", ylabel="ΔR = 0.5 − 1.0 (J/cycle)")
    ax.legend(frameon=False)

    ax = axes[2]
    ax.scatter(cloud_x[::8], cloud_y[::8], s=5, color=BLUE, alpha=0.12, edgecolors="none")
    max_r = float(np.quantile(np.hypot(cloud_x, cloud_y), 0.98))
    for ref, color in zip(result["reference_screen"], [GREEN, BLUE, ORANGE, MUTED, YELLOW, MAGENTA]):
        ratio = ref["ratio"]
        x = -max_r / math.sqrt(1 + ratio * ratio)
        ax.plot([0, x], [0, ratio * x], color=color, linewidth=1.2, label=f"{ref['name']} · ±10° {100*ref['bootstrap_within_10_deg_fraction']:.1f}%")
    ax.scatter(*result["observed_vector_j"], color=MAGENTA, marker="D", s=55, zorder=5)
    ax.axhline(0, color=INK, alpha=0.35); ax.axvline(0, color=INK, alpha=0.35)
    ax.set(title="C · Reference screen, not constant fitting", xlabel="median ΔL (J/cycle)", ylabel="median ΔR (J/cycle)")
    ax.legend(frameon=False, fontsize=8, ncol=2)

    ax = axes[3]
    theta = np.arctan2(cloud_y[::8], cloud_x[::8])
    radius = np.hypot(cloud_x[::8], cloud_y[::8])
    ax.scatter(theta, radius, s=5, color=BLUE, alpha=0.12, edgecolors="none")
    obs_theta = math.radians(result["observed_angle_deg"])
    obs_radius = math.hypot(*result["observed_vector_j"])
    ax.plot([0, obs_theta], [0, obs_radius], color=MAGENTA, linewidth=2.5)
    ax.scatter([obs_theta], [obs_radius], color=MAGENTA, marker="D", s=55)
    ax.set(title="D · Polar view — shimmer is the same bootstrap cloud")

    fig.suptitle("NEXAH HZ/FZ · Cycle-path and Compass-Binder audit", fontsize=20, color=INK)
    fig.text(0.5, 0.035,
             f"active-order crossings {active['crossing_count']} · nominal-label crossings {nominal['crossing_count']} · "
             f"step ratio {result['crossing_step_screen']['second_over_first']:.4f} · exploratory only",
             ha="center", color=MUTED, fontsize=11)
    fig.savefig(VISUAL_PATH, dpi=180, facecolor=BACKGROUND)
    plt.close(fig)


def write_report(result: dict) -> None:
    refs = "\n".join(
        f"| {r['name']} | {r['ratio']:.6f} | {r['point_relative_error_percent']:+.2f}% | "
        f"{100*r['bootstrap_within_5_deg_fraction']:.1f}% | {100*r['bootstrap_within_10_deg_fraction']:.1f}% |"
        for r in result["reference_screen"]
    )
    step = result["crossing_step_screen"]
    text = f"""# HZ_FZ_PUBLIC_01: cycle-path sequence audit

Date: `2026-09-15`

Status: `{result['classification']}`

## Result

The active-order path contains {result['active_order_view']['crossing_count']} pairwise crossings; pairing the same records by their shared nominal cycle labels gives {result['nominal_cycle_view']['crossing_count']}. The visible path therefore depends on the declared alignment rule. The Compass-Binder keeps both views and does not silently choose one as physical truth.

The active-order crossing gaps are {step['first_step']:.6f} and {step['second_step']:.6f} cycle-order units; their ratio is {step['second_over_first']:.6f}. That is a precise descriptive 2:1 feature in this interpolation, but it is post hoc, small-n, and alignment-sensitive.

## Exploratory reference screen

| Reference ray | Ratio | point residual | bootstrap ±5° | bootstrap ±10° |
|---|---:|---:|---:|---:|
{refs}

The table tests all named candidates together. It does not select one after looking at the plot. The bootstrap orientation remains broad, so closeness of the point estimate to any one ray is not stable evidence for a constant.

## Schimmer, Spiegel und Linien bei etwa −100

The polar shimmer is the Cartesian bootstrap cloud written as angle plus radius. It is not a second dataset. The vertical bands in the Cartesian cloud arise because moving-block bootstrap medians are assembled from eight discrete cycle values; only {result['bootstrap_lattice']['unique_x_band_count_at_1e_minus_9_j']} distinct x-values occur at 1e-9 J rounding. They should not be read as independent excitation lines.

The reflection diagnostic has normalized median nearest-partner residual {result['reflection_screen']['normalized_median_nearest_residual']:.3f}; zero would mean exact reflection pairing. With eight path points this is descriptive only.

## Boundary

{result['claim_boundary']}
"""
    REPORT_PATH.write_text(text, encoding="utf-8")


def main() -> None:
    result, mission, cloud_x, cloud_y = analyze()
    RESULT_PATH.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    binder = make_binder(result)
    BINDER_PATH.write_text(json.dumps(binder, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    DATA_JS_PATH.write_text("window.NEXAH_MISSION_DATA = " + json.dumps(mission, separators=(",", ":")) + ";\n", encoding="utf-8")
    write_report(result)
    render(result, cloud_x, cloud_y)
    print(json.dumps({
        "result": str(RESULT_PATH), "binder": str(BINDER_PATH), "report": str(REPORT_PATH),
        "visual": str(VISUAL_PATH), "mission_data": str(DATA_JS_PATH),
        "step_ratio": result["crossing_step_screen"]["second_over_first"],
        "active_crossings": result["active_order_view"]["crossing_count"],
        "nominal_crossings": result["nominal_cycle_view"]["crossing_count"],
    }, indent=2))


if __name__ == "__main__":
    main()
