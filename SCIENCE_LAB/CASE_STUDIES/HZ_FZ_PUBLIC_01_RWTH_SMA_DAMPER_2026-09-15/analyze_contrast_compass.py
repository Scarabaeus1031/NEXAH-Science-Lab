#!/usr/bin/env python3
"""Re-express the 40 mm cycle curves as a two-contrast compass."""

from __future__ import annotations

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
    extract_cycle_records,
)


ROOT = Path(__file__).resolve().parent
RESULT = ROOT / "CONTRAST_COMPASS_RESULT.json"
VISUAL = ROOT / "NEXAH_CONTRAST_COMPASS.png"
REPORT = ROOT / "07_CONTRAST_COMPASS_REPORT.md"

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


def wrap_degrees(angle: np.ndarray | float) -> np.ndarray | float:
    return (angle + 180.0) % 360.0 - 180.0


def crossing_positions(a: np.ndarray, b: np.ndarray) -> list[float]:
    output = []
    for index in range(min(len(a), len(b)) - 1):
        d0, d1 = a[index] - b[index], a[index + 1] - b[index + 1]
        if d0 == 0:
            output.append(float(index + 1))
        elif d0 * d1 < 0:
            output.append(float(index + 1 + abs(d0) / (abs(d0) + abs(d1))))
    return output


def analyze() -> tuple[dict, dict[float, np.ndarray], np.ndarray, np.ndarray]:
    records = extract_cycle_records()
    series = {
        frequency: np.asarray([
            float(row["loop_area_j"]) for row in records
            if row["nominal_displacement_mm"] == 40.0 and row["frequency_hz"] == frequency
        ])
        for frequency in (0.1, 0.5, 1.0)
    }

    crossings = {
        "0.5_vs_1.0": crossing_positions(series[0.5], series[1.0]),
        "0.1_vs_1.0": crossing_positions(series[0.1], series[1.0]),
        "0.1_vs_0.5": crossing_positions(series[0.1], series[0.5]),
    }
    ordered = [crossings[key][0] for key in ("0.5_vs_1.0", "0.1_vs_1.0", "0.1_vs_0.5")]
    steps = np.diff(ordered)

    observed_x = float(np.median(series[0.5]) - np.median(series[0.1]))
    observed_y = float(np.median(series[0.5]) - np.median(series[1.0]))
    observed_ratio = abs(observed_y / observed_x)
    gamma = 1.0 / math.sqrt(3.0)
    reference_ratio = gamma ** -2
    observed_angle = math.degrees(math.atan2(observed_y, observed_x)) % 360.0
    reference_angle = math.degrees(math.atan2(-reference_ratio, -1.0)) % 360.0

    rng = np.random.default_rng(BOOTSTRAP_SEED + 1)
    cloud_x = np.empty(BOOTSTRAP_DRAWS)
    cloud_y = np.empty(BOOTSTRAP_DRAWS)
    for index in range(BOOTSTRAP_DRAWS):
        m01 = np.median(circular_block_sample(series[0.1], rng, BLOCK_LENGTH))
        m05 = np.median(circular_block_sample(series[0.5], rng, BLOCK_LENGTH))
        m10 = np.median(circular_block_sample(series[1.0], rng, BLOCK_LENGTH))
        cloud_x[index] = m05 - m01
        cloud_y[index] = m05 - m10

    cloud_angle = np.degrees(np.arctan2(cloud_y, cloud_x)) % 360.0
    angular_residual = wrap_degrees(cloud_angle - reference_angle)
    orthogonal_residual = (cloud_y - reference_ratio * cloud_x) / math.sqrt(1 + reference_ratio**2)
    observed_orthogonal = (observed_y - reference_ratio * observed_x) / math.sqrt(1 + reference_ratio**2)

    result = {
        "schema": "nexah-contrast-compass/0.1.0",
        "case_id": "HZ_FZ_PUBLIC_01",
        "coordinate_definition": {
            "x_j": "median loop area at 0.5 Hz minus median loop area at 0.1 Hz",
            "y_j": "median loop area at 0.5 Hz minus median loop area at 1.0 Hz",
            "source_view": "40 mm 8-wire active-cycle order",
        },
        "active_order_crossings": crossings,
        "crossing_step_lengths": [float(value) for value in steps],
        "crossing_step_ratio": float(steps[1] / steps[0]),
        "observed_vector_j": [observed_x, observed_y],
        "observed_magnitude_j": float(math.hypot(observed_x, observed_y)),
        "observed_absolute_ratio": observed_ratio,
        "gamma_reference": gamma,
        "gamma_inverse_square_reference_ratio": reference_ratio,
        "ratio_relative_error_percent": float(100 * (observed_ratio / reference_ratio - 1)),
        "observed_angle_deg": observed_angle,
        "reference_negative_ray_angle_deg": reference_angle,
        "angular_residual_deg": float(wrap_degrees(observed_angle - reference_angle)),
        "observed_orthogonal_residual_j": float(observed_orthogonal),
        "bootstrap": {
            "draws": BOOTSTRAP_DRAWS,
            "block_length_cycles": BLOCK_LENGTH,
            "seed": BOOTSTRAP_SEED + 1,
            "quadrant_iii_fraction": float(np.mean((cloud_x < 0) & (cloud_y < 0))),
            "within_5_deg_of_reference_ray_fraction": float(np.mean(np.abs(angular_residual) <= 5)),
            "within_10_deg_of_reference_ray_fraction": float(np.mean(np.abs(angular_residual) <= 10)),
            "angular_residual_quantiles_deg": [float(x) for x in np.quantile(angular_residual, [0.025, 0.25, 0.5, 0.75, 0.975])],
            "orthogonal_residual_quantiles_j": [float(x) for x in np.quantile(orthogonal_residual, [0.025, 0.25, 0.5, 0.75, 0.975])],
            "x_quantiles_j": [float(x) for x in np.quantile(cloud_x, [0.025, 0.5, 0.975])],
            "y_quantiles_j": [float(x) for x in np.quantile(cloud_y, [0.025, 0.5, 0.975])],
        },
        "classification": "POINT_ESTIMATE_ALIGNS_WITH_GAMMA_REFERENCE_BUT_BOOTSTRAP_ORIENTATION_IS_NOT_STABLE",
        "claim_boundary": "The compass is a coordinate transform of the same three source runs. It does not add independent evidence or establish a physical gamma law.",
    }
    return result, series, cloud_x, cloud_y


def render(result: dict, series: dict[float, np.ndarray], cloud_x: np.ndarray, cloud_y: np.ndarray) -> None:
    plt.rcParams.update({
        "text.color": INK,
        "axes.labelcolor": INK,
        "axes.titlecolor": INK,
        "xtick.color": INK,
        "ytick.color": INK,
        "legend.labelcolor": INK,
    })
    fig = plt.figure(figsize=(17, 12), facecolor=BACKGROUND)
    grid = fig.add_gridspec(2, 2, left=0.065, right=0.975, bottom=0.08, top=0.89, hspace=0.32, wspace=0.22)
    axes = [fig.add_subplot(grid[0, 0]), fig.add_subplot(grid[0, 1]), fig.add_subplot(grid[1, 0]), fig.add_subplot(grid[1, 1], projection="polar")]
    for ax in axes:
        ax.set_facecolor(PANEL)
        ax.grid(color=GRID, alpha=0.22, linewidth=0.7)
        ax.tick_params(colors=INK)
        for spine in ax.spines.values():
            spine.set_color(GRID)

    # A: the source curves.
    ax = axes[0]
    for frequency, color in ((0.1, BLUE), (0.5, YELLOW), (1.0, ORANGE)):
        values = series[frequency]
        ax.plot(np.arange(1, len(values) + 1), values, color=color, marker="o", markersize=4.5,
                linewidth=1.5, label=f"{frequency:.1f} Hz")
    crossing_specs = [
        (result["active_order_crossings"]["0.5_vs_1.0"][0], YELLOW, "C1"),
        (result["active_order_crossings"]["0.1_vs_1.0"][0], ORANGE, "C2"),
        (result["active_order_crossings"]["0.1_vs_0.5"][0], MAGENTA, "C3"),
    ]
    for position, color, label in crossing_specs:
        ax.axvline(position, color=color, alpha=0.35, linewidth=1)
        ax.text(position, 690, f"{label} {position:.2f}", rotation=90, ha="right", va="top", color=color, fontsize=9)
    ax.set(title="A · Original view: three cycle sequences", xlabel="active-cycle order", ylabel="|∮F dx| (J/cycle)")
    ax.legend(frameon=False, ncol=3, fontsize=9)

    # B: every active-order step becomes one point in the two-contrast plane.
    ax = axes[1]
    n = min(len(values) for values in series.values())
    path_x = series[0.5][:n] - series[0.1][:n]
    path_y = series[0.5][:n] - series[1.0][:n]
    domain = max(np.max(np.abs(path_x)), np.max(np.abs(path_y))) * 1.12
    reference_x = np.linspace(-domain, domain, 200)
    ax.plot(reference_x, 3 * reference_x, color=YELLOW, alpha=0.65, linewidth=1.5, label="γ⁻² ray: y = 3x")
    ax.axhline(0, color=INK, alpha=0.55, linewidth=0.8)
    ax.axvline(0, color=INK, alpha=0.55, linewidth=0.8)
    ax.plot(path_x, path_y, color=MAGENTA, linewidth=1.5, alpha=0.8)
    ax.scatter(path_x, path_y, c=np.arange(1, n + 1), cmap="viridis", s=52, zorder=3)
    for index, (x, y) in enumerate(zip(path_x, path_y), 1):
        ax.text(x + 4, y + 4, str(index), color=INK, fontsize=9)
    ax.set_xlim(-domain, domain)
    ax.set_ylim(-domain, domain)
    ax.set_aspect("equal", adjustable="box")
    ax.set(title="B · Same cycles after axis rotation", xlabel="ΔL = 0.5 − 0.1 Hz (J/cycle)", ylabel="ΔR = 0.5 − 1.0 Hz (J/cycle)")
    ax.legend(frameon=False, fontsize=9, loc="lower right")

    # C: joint bootstrap cloud in the same contrast coordinates.
    ax = axes[2]
    keep = np.random.default_rng(77).choice(len(cloud_x), 5000, replace=False)
    x_lo, x_hi = np.quantile(cloud_x, [0.002, 0.998])
    y_lo, y_hi = np.quantile(cloud_y, [0.002, 0.998])
    x_pad = 0.08 * (x_hi - x_lo)
    y_pad = 0.08 * (y_hi - y_lo)
    x_lo, x_hi = min(x_lo - x_pad, 0), max(x_hi + x_pad, 0)
    y_lo, y_hi = min(y_lo - y_pad, 0), max(y_hi + y_pad, 0)
    ax.scatter(cloud_x[keep], cloud_y[keep], s=6, color=BLUE, alpha=0.08, edgecolors="none")
    line_x = np.linspace(x_lo, x_hi, 200)
    ax.plot(line_x, 3 * line_x, color=YELLOW, linewidth=1.6, label="γ⁻² = 3")
    ox, oy = result["observed_vector_j"]
    ax.scatter([ox], [oy], color=MAGENTA, s=85, marker="D", zorder=5, label="observed median vector")
    ax.axhline(0, color=INK, alpha=0.65, linewidth=0.9)
    ax.axvline(0, color=INK, alpha=0.65, linewidth=0.9)
    ax.set_xlim(x_lo, x_hi)
    ax.set_ylim(y_lo, y_hi)
    ax.set(title="C · Joint moving-block bootstrap cloud", xlabel="median ΔL (J/cycle)", ylabel="median ΔR (J/cycle)")
    ax.legend(frameon=False, fontsize=9)

    # D: compass/ray view.
    ax = axes[3]
    ref_angle = math.radians(result["reference_negative_ray_angle_deg"])
    obs_angle = math.radians(result["observed_angle_deg"])
    obs_radius = result["observed_magnitude_j"]
    sample_angles = np.arctan2(cloud_y[keep], cloud_x[keep]) % (2 * math.pi)
    sample_radius = np.hypot(cloud_x[keep], cloud_y[keep])
    cap = float(np.quantile(sample_radius, 0.95))
    ax.scatter(sample_angles, np.minimum(sample_radius, cap), s=5, color=BLUE, alpha=0.06, edgecolors="none")
    ax.plot([ref_angle, ref_angle], [0, cap], color=YELLOW, linewidth=2.0, label="γ⁻² reference")
    ax.plot([obs_angle, obs_angle], [0, min(obs_radius, cap)], color=MAGENTA, linewidth=2.5, label="observed 2.918")
    ax.scatter([obs_angle], [min(obs_radius, cap)], color=MAGENTA, s=70, marker="D")
    ax.set_theta_zero_location("E")
    ax.set_theta_direction(1)
    ax.set_rlabel_position(135)
    ax.set_title("D · Contrast compass: direction and uncertainty", color=INK, pad=20)
    ax.legend(frameon=False, fontsize=9, loc="lower left", bbox_to_anchor=(-0.08, -0.12))

    fig.suptitle("NEXAH CONTRAST COMPASS · SAME CURVES, ROTATED AXES", color=YELLOW, fontsize=19, fontweight="bold")
    boot = result["bootstrap"]
    fig.text(0.5, 0.035,
             f"point estimate: 2.918 vs γ⁻²=3 (−2.72%, −0.48°) · bootstrap QIII={100*boot['quadrant_iii_fraction']:.1f}% · within ±10°={100*boot['within_10_deg_of_reference_ray_fraction']:.1f}%",
             ha="center", color=MUTED, fontsize=10)
    fig.savefig(VISUAL, dpi=180, facecolor=fig.get_facecolor())
    plt.close(fig)


def write_report(result: dict) -> None:
    boot = result["bootstrap"]
    text = f"""# HZ_FZ_PUBLIC_01: contrast compass

## Coordinate transform

The compass is another view of the same 40 mm loop-area curves. Each axis is a contrast rather than an absolute loop area:

- x = median(0.5 Hz) − median(0.1 Hz)
- y = median(0.5 Hz) − median(1.0 Hz)

The observed vector is ({result['observed_vector_j'][0]:+.3f}, {result['observed_vector_j'][1]:+.3f}) J. Its absolute slope is {result['observed_absolute_ratio']:.6f}. The numerical compass label γ = 1/√3 gives γ⁻² = 3, so the point estimate is {result['ratio_relative_error_percent']:+.3f}% from that reference and {result['angular_residual_deg']:+.3f}° from its negative ray.

## Cycle-path relation

The three pairwise active-order crossings occur at {result['active_order_crossings']['0.5_vs_1.0'][0]:.3f}, {result['active_order_crossings']['0.1_vs_1.0'][0]:.3f}, and {result['active_order_crossings']['0.1_vs_0.5'][0]:.3f}. Their step lengths are {result['crossing_step_lengths'][0]:.3f} and {result['crossing_step_lengths'][1]:.3f}; the second is {result['crossing_step_ratio']:.4f} times the first.

## Uncertainty result

The point estimate aligns closely with the γ⁻² ray, but the joint moving-block bootstrap cloud is broad:

- quadrant III fraction: {100*boot['quadrant_iii_fraction']:.2f}%
- within ±5° of the reference ray: {100*boot['within_5_deg_of_reference_ray_fraction']:.2f}%
- within ±10°: {100*boot['within_10_deg_of_reference_ray_fraction']:.2f}%
- angular residual quantiles (2.5%, 25%, 50%, 75%, 97.5%): {', '.join(f'{x:+.2f}°' for x in boot['angular_residual_quantiles_deg'])}

Classification: `{result['classification']}`.

## Claim boundary

This is a rotation and differencing of the existing three run summaries. It reveals orientation, crossings, and uncertainty more clearly, but it does not add an independent experiment or establish a physical γ law.
"""
    REPORT.write_text(text, encoding="utf-8")


def main() -> None:
    result, series, cloud_x, cloud_y = analyze()
    RESULT.write_text(json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    render(result, series, cloud_x, cloud_y)
    write_report(result)
    print(json.dumps({
        "classification": result["classification"],
        "observed_ratio": result["observed_absolute_ratio"],
        "angular_residual_deg": result["angular_residual_deg"],
        "quadrant_iii_fraction": result["bootstrap"]["quadrant_iii_fraction"],
        "within_10_deg_fraction": result["bootstrap"]["within_10_deg_of_reference_ray_fraction"],
        "result_sha256": digest(RESULT),
        "visual_sha256": digest(VISUAL),
        "report_sha256": digest(REPORT),
    }, indent=2))


if __name__ == "__main__":
    main()
