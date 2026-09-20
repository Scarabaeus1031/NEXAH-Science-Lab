#!/usr/bin/env python3
"""Render time, force-displacement, and residual views of the two public cuts."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy.signal import savgol_filter


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "NEXAH_HZ_FZ_PUBLIC_01_HINGE_THREE_VIEW.png"
RESULT = ROOT / "HINGE_THREE_VIEW_RESULT.json"
PAIRS = (
    {
        "id": "P05_BEFORE_AFTER_EQ",
        "a": "07_4wires_sin20mm_0p5Hz.csv",
        "b": "09_4wires_sin20mm_0p5Hz_after_EQ.csv",
        "frequency_hz": 0.5,
        "cycle": 8,
    },
    {
        "id": "P10_BEFORE_AFTER_EQ",
        "a": "08_4wires_sin40mm_1p0Hz.csv",
        "b": "10_4wires_sin40mm_1p0Hz_after_EQ.csv",
        "frequency_hz": 1.0,
        "cycle": 8,
    },
)
BLUE = "#54c8ff"
ORANGE = "#ff9a3c"
MAGENTA = "#ef70bd"
YELLOW = "#f2c96d"
MUTED = "#aab2bf"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cycle(path: Path, frequency_hz: float, number: int) -> pd.DataFrame:
    table = pd.read_csv(path)
    samples = round(512.0 / frequency_hz)
    start = (number - 1) * samples
    segment = table.iloc[start:start + samples].copy().reset_index(drop=True)
    if len(segment) != samples:
        raise ValueError(f"incomplete cycle {number}: {path.name}")
    if segment.isna().any().any() or not np.isfinite(segment.to_numpy(float)).all():
        raise ValueError(f"invalid numeric values: {path.name}")
    return segment


def harmonic_fit(time: np.ndarray, values: np.ndarray, frequency_hz: float) -> np.ndarray:
    matrix = np.column_stack((
        np.ones(len(time)),
        np.sin(2 * np.pi * frequency_hz * time),
        np.cos(2 * np.pi * frequency_hz * time),
    ))
    return matrix @ np.linalg.lstsq(matrix, values, rcond=None)[0]


def local_slope(displacement: np.ndarray, force: np.ndarray, index: int, side: str) -> float:
    if side == "before":
        selection = slice(index - 12, index - 3)
    else:
        selection = slice(index + 3, index + 12)
    return float(np.polyfit(displacement[selection], force[selection], 1)[0])


def analyze(pair: dict[str, Any]) -> dict[str, Any]:
    source = ROOT / "selected"
    a = cycle(source / pair["a"], pair["frequency_hz"], pair["cycle"])
    b = cycle(source / pair["b"], pair["frequency_hz"], pair["cycle"])
    time = a["Time"].to_numpy(float)
    fraction = np.arange(len(a), dtype=float) / len(a)
    force_a = a["Actuator1_Force"].to_numpy(float)
    force_b = b["Actuator1_Force"].to_numpy(float)
    displacement_a = a["Actuator1_Disp"].to_numpy(float)
    displacement_b = b["Actuator1_Disp"].to_numpy(float)
    fit_a = harmonic_fit(time, force_a, pair["frequency_hz"])
    fit_b = harmonic_fit(time, force_b, pair["frequency_hz"])
    nonfund_a = savgol_filter(force_a - fit_a, 21, 3)
    nonfund_b = savgol_filter(force_b - fit_b, 21, 3)

    curvature_score = np.abs(np.gradient(np.gradient(nonfund_a))) + np.abs(np.gradient(np.gradient(nonfund_b)))
    central = (fraction >= 0.4) & (fraction <= 0.6)
    candidate = int(np.flatnonzero(central)[np.argmax(curvature_score[central])])

    area_a = float(np.trapz(force_a, displacement_a))
    area_b = float(np.trapz(force_b, displacement_b))
    slope_a_before = local_slope(displacement_a, force_a, candidate, "before")
    slope_a_after = local_slope(displacement_a, force_a, candidate, "after")
    slope_b_before = local_slope(displacement_b, force_b, candidate, "before")
    slope_b_after = local_slope(displacement_b, force_b, candidate, "after")
    residual = force_b - force_a
    residual_nonfund = nonfund_b - nonfund_a
    return {
        "pair": pair,
        "a": a,
        "b": b,
        "fraction": fraction,
        "candidate_index": candidate,
        "force_a": force_a,
        "force_b": force_b,
        "displacement_a": displacement_a,
        "displacement_b": displacement_b,
        "fit_a": fit_a,
        "fit_b": fit_b,
        "nonfund_a": nonfund_a,
        "nonfund_b": nonfund_b,
        "residual": residual,
        "residual_nonfund": residual_nonfund,
        "metrics": {
            "candidate_cycle_fraction": float(fraction[candidate]),
            "candidate_force_difference_kn": float(residual[candidate]),
            "candidate_nonfundamental_difference_kn": float(residual_nonfund[candidate]),
            "loop_signed_area_j": {"REFERENCE_A": area_a, "RETURN_B": area_b},
            "loop_absolute_area_j": {"REFERENCE_A": abs(area_a), "RETURN_B": abs(area_b)},
            "loop_area_change_percent_from_a": 100.0 * (abs(area_b) - abs(area_a)) / abs(area_a),
            "mean_loop_power_w": {
                "REFERENCE_A": abs(area_a) * pair["frequency_hz"],
                "RETURN_B": abs(area_b) * pair["frequency_hz"],
            },
            "local_tangent_kn_per_mm": {
                "REFERENCE_A": {"before": slope_a_before, "after": slope_a_after, "change": slope_a_after - slope_a_before},
                "RETURN_B": {"before": slope_b_before, "after": slope_b_after, "change": slope_b_after - slope_b_before},
            },
        },
    }


def render(analyses: list[dict[str, Any]]) -> None:
    plt.style.use("dark_background")
    fig, axes = plt.subplots(3, 2, figsize=(16, 13))
    fig.patch.set_facecolor("#0d1016")
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.075, top=0.91, hspace=0.38, wspace=0.18)
    for axis in axes.flat:
        axis.set_facecolor("#121722")
        axis.grid(color="#637083", alpha=0.18, linewidth=0.7)
        for spine in axis.spines.values():
            spine.set_color("#3a4350")

    for column, item in enumerate(analyses):
        pair = item["pair"]
        fraction = item["fraction"]
        index = item["candidate_index"]
        x0 = fraction[index]
        band = 0.025

        top = axes[0, column]
        top.plot(fraction, item["force_a"], color=BLUE, alpha=0.35, lw=0.8)
        top.plot(fraction, savgol_filter(item["force_a"], 21, 3), color=BLUE, lw=2.0, label="Cut A · before")
        top.plot(fraction, item["force_b"], color=ORANGE, alpha=0.35, lw=0.8)
        top.plot(fraction, savgol_filter(item["force_b"], 21, 3), color=ORANGE, lw=2.0, label="Cut B · after")
        top.axvspan(x0 - band, x0 + band, color=YELLOW, alpha=0.16)
        top.axvline(x0, color=YELLOW, lw=1.1)
        top.set_title(f"{pair['frequency_hz']} Hz · time cut · cycle {pair['cycle']}", loc="left", fontweight="bold")
        top.set_xlabel("cycle fraction")
        top.set_ylabel("actuator 1 force (kN)")
        top.legend(frameon=False, fontsize=9)
        top.annotate("candidate window", xy=(x0, item["force_b"][index]), xytext=(x0 + 0.08, top.get_ylim()[1] * 0.65),
                     color=YELLOW, arrowprops={"arrowstyle": "->", "color": YELLOW}, fontsize=9)

        loop = axes[1, column]
        loop.plot(item["displacement_a"], item["force_a"], color=BLUE, lw=1.5, label="Cut A")
        loop.plot(item["displacement_b"], item["force_b"], color=ORANGE, lw=1.5, label="Cut B")
        loop.scatter(item["displacement_a"][index], item["force_a"][index], color=BLUE, edgecolor=YELLOW, s=55, zorder=5)
        loop.scatter(item["displacement_b"][index], item["force_b"][index], color=ORANGE, edgecolor=YELLOW, s=55, zorder=5)
        area = item["metrics"]["loop_absolute_area_j"]
        delta = item["metrics"]["loop_area_change_percent_from_a"]
        loop.set_title("force–displacement loop", loc="left", fontweight="bold")
        loop.set_xlabel("actuator 1 displacement (mm)")
        loop.set_ylabel("actuator 1 force (kN)")
        loop.text(0.03, 0.96, f"|∮F dx|  A={area['REFERENCE_A']:.1f} J  B={area['RETURN_B']:.1f} J  Δ={delta:+.1f}%",
                  transform=loop.transAxes, va="top", color=YELLOW, fontsize=9)

        residual = axes[2, column]
        residual.axhline(0, color=MUTED, lw=0.8)
        residual.plot(fraction, item["residual"], color=MAGENTA, alpha=0.28, lw=0.8, label="raw force B − A")
        residual.plot(fraction, savgol_filter(item["residual"], 21, 3), color=MAGENTA, lw=1.8, label="smoothed B − A")
        residual.plot(fraction, item["residual_nonfund"], color=YELLOW, lw=1.2, label="non-fundamental difference")
        residual.axvspan(x0 - band, x0 + band, color=YELLOW, alpha=0.16)
        residual.axvline(x0, color=YELLOW, lw=1.1)
        residual.scatter([x0], [item["residual_nonfund"][index]], color=YELLOW, s=38, zorder=5)
        residual.set_title("A/B residual and local shape difference", loc="left", fontweight="bold")
        residual.set_xlabel("cycle fraction")
        residual.set_ylabel("force difference (kN)")
        residual.legend(frameon=False, fontsize=8, ncol=2)

    fig.suptitle("NEXAH HZ/FZ PUBLIC 01 · HINGE THREE-VIEW", fontsize=18, fontweight="bold", color=YELLOW)
    fig.text(0.5, 0.025,
             "Same sample in all three rows · raw 512 Hz data · yellow marks a curvature candidate, not a validated switch",
             ha="center", color=MUTED, fontsize=10)
    fig.savefig(OUTPUT, dpi=180, facecolor=fig.get_facecolor())
    plt.close(fig)


def main() -> None:
    intake = json.loads((ROOT / "SOURCE_INTAKE_RESULT.json").read_text(encoding="utf-8"))
    analyses = [analyze(pair) for pair in PAIRS]
    render(analyses)
    result = {
        "schema": "nexah-hz-fz-public-hinge-three-view/0.1.0",
        "case_id": "HZ_FZ_PUBLIC_01",
        "source_archive_sha256": intake["source"]["archive_sha256"],
        "actuator": 1,
        "method": {
            "cycle": 8,
            "source_rate_hz": 512,
            "smoothing": "Savitzky-Golay, 21 samples, polynomial order 3",
            "candidate_rule": "maximum combined curvature of smoothed non-fundamental force within cycle fraction 0.4 to 0.6",
            "loop_area_unit_identity": "1 kN mm = 1 J",
        },
        "pairs": {item["pair"]["id"]: item["metrics"] for item in analyses},
        "interpretation_boundary": (
            "The marked location is a reproducible visualization candidate in one selected active cycle. "
            "It is not evidence of electrical switching, AC/DC conversion, series/parallel wiring, or causality."
        ),
    }
    RESULT.write_text(json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "classification": "THREE_VIEW_COMPLETE",
        "png": OUTPUT.name,
        "png_sha256": sha256(OUTPUT),
        "result": RESULT.name,
        "result_sha256": sha256(RESULT),
    }, indent=2))


if __name__ == "__main__":
    main()
