#!/usr/bin/env python3
"""Aperture-occupancy supersampling convergence for TOP-BOUNDARY-01."""

from __future__ import annotations

import argparse
import csv
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

import run_synthetic_dry_run as base


EXECUTION_ID = "TOP-BOUNDARY-01-DRY-02"
SCALES = (1, 2, 4, 8)


def subpixel_axis(scale: int) -> np.ndarray:
    centers = np.linspace(-1.0, 1.0, base.N, endpoint=True, dtype=np.float64)
    pitch = 2.0 / (base.N - 1)
    offsets = ((np.arange(scale, dtype=np.float64) + 0.5) / scale - 0.5) * pitch
    return (centers[:, None] + offsets[None, :]).reshape(-1)


def fractional_aperture(family: str, angle_deg: float, scale: int) -> np.ndarray:
    axis = subpixel_axis(scale)
    theta = math.radians(angle_deg)
    u = axis[None, :] * math.cos(theta) + axis[:, None] * math.sin(theta)
    if family == "SINGLE_SLIT":
        high = np.abs(u) <= base.SLIT_WIDTH / 2.0
    elif family == "DOUBLE_SLIT":
        high = (
            (np.abs(u - base.SLIT_SEPARATION / 2.0) <= base.SLIT_WIDTH / 2.0)
            | (np.abs(u + base.SLIT_SEPARATION / 2.0) <= base.SLIT_WIDTH / 2.0)
        )
    else:
        raise ValueError(f"unknown family: {family}")
    fractional = high.reshape(base.N, scale, base.N, scale).mean(axis=(1, 3))
    return fractional.astype(np.float64)


def convergence_outcome(rows: list[dict[str, object]]) -> tuple[str, dict[str, float]]:
    changes: dict[str, float] = {}
    improving = True
    converged = True
    for family in ("SINGLE_SLIT", "DOUBLE_SLIT"):
        for angle in (45, 135, 225, 315):
            selected = [row for row in rows if row["family"] == family and row["angle_deg"] == angle]
            selected.sort(key=lambda row: row["scale"])
            values = [float(row["orientation_nrmse"]) for row in selected]
            relative_change = abs(values[-1] - values[-2]) / max(abs(values[-1]), 1e-15)
            key = f"{family}_{angle}"
            changes[key] = relative_change
            if values[-1] > values[0]:
                improving = False
            if relative_change >= 0.05:
                converged = False
    if converged:
        return "CONVERGED_FOR_DRY_RUN", changes
    if improving:
        return "IMPROVING_NOT_CONVERGED", changes
    return "GRID_SENSITIVE", changes


def calculate() -> tuple[list[dict[str, object]], dict[str, np.ndarray], dict[str, object]]:
    roi = base.central_roi()
    rows: list[dict[str, object]] = []
    arrays: dict[str, np.ndarray] = {}

    for scale in SCALES:
        for family in ("SINGLE_SLIT", "DOUBLE_SLIT"):
            aperture_0 = fractional_aperture(family, 0, scale)
            record_0 = base.coherent_intensity(aperture_0)
            arrays[f"{family}_{scale}x_aperture_0"] = aperture_0
            arrays[f"{family}_{scale}x_record_0"] = record_0
            for angle in base.ANGLES:
                aperture = fractional_aperture(family, angle, scale)
                record = base.coherent_intensity(aperture)
                returned = base.rotate_back(record, angle)
                residual = returned - record_0
                nrmse = base.normalized_rmse(residual, record_0, roi)
                rows.append(
                    {
                        "execution_id": EXECUTION_ID,
                        "family": family,
                        "scale": scale,
                        "angle_deg": angle,
                        "orientation_nrmse": nrmse,
                        "fractional_pixel_count": int(np.count_nonzero((aperture > 0.0) & (aperture < 1.0))),
                    }
                )
                if angle == 45:
                    arrays[f"{family}_{scale}x_aperture_45"] = aperture
                    arrays[f"{family}_{scale}x_rho_45"] = residual

    outcome, changes = convergence_outcome(rows)
    cardinal_max = max(
        float(row["orientation_nrmse"])
        for row in rows
        if row["angle_deg"] in (0, 90, 180, 270)
    )
    checks = {
        "scales_complete": sorted({int(row["scale"]) for row in rows}) == list(SCALES),
        "row_count": len(rows),
        "cardinal_max_nrmse": cardinal_max,
        "cardinal_control_tolerance": 1e-6,
        "cardinal_control_pass": cardinal_max < 1e-6,
        "relative_change_4x_to_8x": changes,
        "outcome": outcome,
        "scientific_result": None,
    }
    return rows, arrays, checks


def chart(rows: list[dict[str, object]], arrays: dict[str, np.ndarray], checks: dict[str, object], path: Path) -> None:
    canvas = Image.new("RGB", (1700, 1050), (3, 11, 22))
    draw = ImageDraw.Draw(canvas)
    draw.text((55, 28), "NEXAH TOP LENS — APERTURE CONVERGENCE", font=base.font(40, True), fill=(229, 248, 252))
    draw.text((57, 78), "1x → 2x → 4x → 8x OCCUPANCY SUPERSAMPLING · SYNTHETIC ONLY", font=base.font(18, True), fill=(255, 177, 67))

    panel_width = 380
    for index, scale in enumerate(SCALES):
        x0 = 45 + index * 410
        aperture = arrays[f"DOUBLE_SLIT_{scale}x_aperture_45"]
        base.paste_panel(
            canvas,
            draw,
            base.scalar_to_gray(aperture),
            (x0, 125, x0 + panel_width, 475),
            f"{scale}x · DIAGONAL APERTURE",
            f"fractional boundary pixels: {np.count_nonzero((aperture > 0) & (aperture < 1))}",
        )

    chart_box = (45, 520, 1655, 970)
    draw.rounded_rectangle(chart_box, radius=14, fill=(8, 20, 34), outline=(38, 187, 220), width=2)
    draw.text((65, 540), "45° ORIENTATION RETURN — NRMSE VS SUPERSAMPLING", font=base.font(22, True), fill=(223, 245, 250))
    px0, py0, px1, py1 = 130, 610, 1595, 900
    selected_series = []
    for family, color in (("SINGLE_SLIT", (244, 190, 70)), ("DOUBLE_SLIT", (105, 219, 235))):
        values = []
        for scale in SCALES:
            row = next(r for r in rows if r["family"] == family and r["scale"] == scale and r["angle_deg"] == 45)
            values.append(float(row["orientation_nrmse"]))
        selected_series.append((family, values, color))
    maximum = max(max(values) for _, values, _ in selected_series)
    for fraction in (0.0, 0.25, 0.5, 0.75, 1.0):
        y = py1 - fraction * (py1 - py0)
        draw.line((px0, y, px1, y), fill=(28, 55, 72), width=1)
        draw.text((55, y - 8), f"{fraction * maximum:.3f}", font=base.font(13), fill=(130, 165, 176))
    for index, scale in enumerate(SCALES):
        x = px0 + index * (px1 - px0) / (len(SCALES) - 1)
        draw.text((x - 12, py1 + 12), f"{scale}x", font=base.font(14), fill=(160, 190, 200))
    legend_x = 165
    for family, values, color in selected_series:
        points = []
        for index, value in enumerate(values):
            x = px0 + index * (px1 - px0) / (len(values) - 1)
            y = py1 - value / maximum * (py1 - py0)
            points.append((x, y))
        draw.line(points, fill=color, width=4)
        for point, value in zip(points, values):
            draw.ellipse((point[0] - 5, point[1] - 5, point[0] + 5, point[1] + 5), fill=color)
            draw.text((point[0] + 8, point[1] - 18), f"{value:.3f}", font=base.font(13), fill=color)
        draw.line((legend_x, 944, legend_x + 28, 944), fill=color, width=4)
        draw.text((legend_x + 36, 934), family.replace("_", " "), font=base.font(14), fill=(190, 220, 228))
        legend_x += 330

    draw.text((55, 1000), f"OUTCOME: {checks['outcome']}  ·  PHYSICAL RESULT: NONE", font=base.font(18, True), fill=(141, 207, 221))
    canvas.save(path)


def save_outputs(output_dir: Path) -> dict[str, object]:
    output_dir.mkdir(parents=True, exist_ok=True)
    rows, arrays, checks = calculate()
    with (output_dir / "metrics.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    np.savez_compressed(output_dir / "arrays.npz", **arrays)
    chart(rows, arrays, checks, output_dir / "supersampling_convergence.png")
    result = {
        "execution_id": EXECUTION_ID,
        "status": "SYNTHETIC_CONVERGENCE_COMPLETE",
        "scales": list(SCALES),
        "checks": checks,
        "metrics": rows,
        "model_boundary": "APERTURE_OCCUPANCY_ANTIALIASING_NOT_FULL_HIGH_RES_PROPAGATION",
        "scientific_result": None,
    }
    with (output_dir / "results.json").open("w", encoding="utf-8") as handle:
        json.dump(result, handle, indent=2, sort_keys=True)
        handle.write("\n")
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    result = save_outputs(args.output_dir)
    print(json.dumps({"status": result["status"], "checks": result["checks"]}, indent=2))


if __name__ == "__main__":
    main()
