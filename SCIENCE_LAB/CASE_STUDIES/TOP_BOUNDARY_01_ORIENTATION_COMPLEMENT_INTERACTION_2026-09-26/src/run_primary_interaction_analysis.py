#!/usr/bin/env python3
"""Four-state interaction analysis for TOP-BOUNDARY-01.

Synthetic validation only. No calibrated physical apparatus is simulated.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

import run_synthetic_dry_run as base
import run_supersampling_convergence as convergence


EXECUTION_ID = "TOP-BOUNDARY-01-DRY-03"
SCALE = 8
SIGNAL_SCALES = (1, 3, 10, 30, 100, 300, 1000)
SNR_REPEATS = 40
SEED = 26092603


def fractional_components(angle_deg: float, scale: int = SCALE) -> tuple[np.ndarray, np.ndarray]:
    axis = convergence.subpixel_axis(scale)
    theta = math.radians(angle_deg)
    u = axis[None, :] * math.cos(theta) + axis[:, None] * math.sin(theta)
    q1_high = np.abs(u - base.SLIT_SEPARATION / 2.0) <= base.SLIT_WIDTH / 2.0
    q2_high = np.abs(u + base.SLIT_SEPARATION / 2.0) <= base.SLIT_WIDTH / 2.0
    q1 = q1_high.reshape(base.N, scale, base.N, scale).mean(axis=(1, 3))
    q2 = q2_high.reshape(base.N, scale, base.N, scale).mean(axis=(1, 3))
    return q1.astype(np.float64), q2.astype(np.float64)


def four_states(angle_deg: float) -> dict[str, np.ndarray]:
    q1, q2 = fractional_components(angle_deg)
    return {
        "0": np.zeros_like(q1),
        "B1": q1,
        "B2": q2,
        "B1+B2": q1 + q2,
    }


def fourier_amplitude(mask: np.ndarray) -> np.ndarray:
    return np.fft.fftshift(np.fft.fft2(np.fft.ifftshift(mask))) / mask.size


def records_for_arm(arm: str, states: dict[str, np.ndarray]) -> dict[str, np.ndarray]:
    if arm == "A_LINEAR_ISOTROPIC":
        return {name: base.isotropic_record(mask) for name, mask in states.items()}
    if arm == "A_LINEAR_DISPERSION":
        return {name: base.dispersion_record(mask) for name, mask in states.items()}
    if arm == "B_COHERENT_FOURIER":
        return {name: base.coherent_intensity(mask) for name, mask in states.items()}
    raise ValueError(f"unknown arm: {arm}")


def interaction(records: dict[str, np.ndarray]) -> np.ndarray:
    return records["B1+B2"] - records["B1"] - records["B2"] + records["0"]


def cross_term(states: dict[str, np.ndarray]) -> np.ndarray:
    f1 = fourier_amplitude(states["B1"])
    f2 = fourier_amplitude(states["B2"])
    return 2.0 * np.real(f1 * np.conjugate(f2))


def rms(array: np.ndarray, roi: np.ndarray) -> float:
    active = np.repeat(roi[..., None], array.shape[-1], axis=-1) if array.ndim == 3 else roi
    return float(np.sqrt(np.mean(np.square(array[active]))))


def interaction_metrics(delta: np.ndarray, joint: np.ndarray, roi: np.ndarray) -> tuple[float, float]:
    return (
        base.normalized_rmse(delta, joint, roi),
        base.normalized_l1(delta, joint, roi),
    )


def noisy_interaction_error(
    records: dict[str, np.ndarray],
    truth: np.ndarray,
    scale: float,
    rng: np.random.Generator,
    roi: np.ndarray,
) -> float:
    noisy: dict[str, np.ndarray] = {}
    for name, value in records.items():
        calibrated, _ = base.synthetic_capture(value * scale, rng)
        noisy[name] = calibrated / scale
    estimate = interaction(noisy)
    return rms(estimate - truth, roi) / max(rms(truth, roi), 1e-15)


def calculate() -> tuple[list[dict[str, object]], list[dict[str, object]], dict[str, np.ndarray], dict[str, object]]:
    roi = base.central_roi()
    arms = ("A_LINEAR_ISOTROPIC", "A_LINEAR_DISPERSION", "B_COHERENT_FOURIER")
    rows: list[dict[str, object]] = []
    snr_rows: list[dict[str, object]] = []
    arrays: dict[str, np.ndarray] = {}
    coherent_delta_0: np.ndarray | None = None
    linear_max = 0.0
    coherent_identity_max = 0.0
    coherent_nonzero = True

    for angle in base.ANGLES:
        states = four_states(angle)
        if angle in (0, 45):
            for name, value in states.items():
                arrays[f"state_{angle}_{name.replace('+', '_PLUS_')}"] = value
        for arm in arms:
            records = records_for_arm(arm, states)
            delta = interaction(records)
            ideal_nrmse, ideal_l1 = interaction_metrics(delta, records["B1+B2"], roi)
            maximum = float(np.max(np.abs(delta)))
            identity_nrmse = None
            if arm.startswith("A_LINEAR"):
                linear_max = max(linear_max, maximum)
            else:
                expected = cross_term(states)
                identity_nrmse = rms(delta - expected, roi) / max(rms(expected, roi), 1e-15)
                coherent_identity_max = max(coherent_identity_max, identity_nrmse)
                coherent_nonzero = coherent_nonzero and maximum > 1e-8
                if angle == 0:
                    coherent_delta_0 = delta
                returned = base.rotate_back(delta, angle)
                orientation_nrmse = (
                    0.0
                    if angle == 0
                    else base.normalized_rmse(returned - coherent_delta_0, coherent_delta_0, roi)
                )
                arrays[f"coherent_delta_{angle}"] = delta
                arrays[f"coherent_cross_term_{angle}"] = expected
            if arm.startswith("A_LINEAR"):
                orientation_nrmse = None
            rows.append(
                {
                    "execution_id": EXECUTION_ID,
                    "arm": arm,
                    "angle_deg": angle,
                    "interaction_nrmse_vs_joint": ideal_nrmse,
                    "interaction_normalized_l1_vs_joint": ideal_l1,
                    "interaction_max_abs": maximum,
                    "cross_term_identity_nrmse": identity_nrmse,
                    "interaction_orientation_return_nrmse": orientation_nrmse,
                }
            )

    assert coherent_delta_0 is not None
    states_0 = four_states(0)
    records_0 = records_for_arm("B_COHERENT_FOURIER", states_0)
    rng = np.random.default_rng(SEED)
    first_below_ten_percent: int | None = None
    for signal_scale in SIGNAL_SCALES:
        errors = np.asarray(
            [
                noisy_interaction_error(records_0, coherent_delta_0, signal_scale, rng, roi)
                for _ in range(SNR_REPEATS)
            ]
        )
        mean = float(errors.mean())
        if first_below_ten_percent is None and mean < 0.10:
            first_below_ten_percent = signal_scale
        snr_rows.append(
            {
                "execution_id": EXECUTION_ID,
                "signal_scale": signal_scale,
                "repeats": SNR_REPEATS,
                "mean_interaction_error_nrmse": mean,
                "std_interaction_error_nrmse": float(errors.std(ddof=1)),
                "q025_interaction_error_nrmse": float(np.quantile(errors, 0.025)),
                "q975_interaction_error_nrmse": float(np.quantile(errors, 0.975)),
            }
        )

    record_count_ok = len(rows) == len(arms) * len(base.ANGLES)
    checks = {
        "record_count": len(rows),
        "record_count_ok": record_count_ok,
        "linear_null_tolerance": 1e-12,
        "linear_interaction_max_abs": linear_max,
        "linear_null_pass": linear_max <= 1e-12,
        "coherent_cross_term_tolerance": 1e-10,
        "coherent_cross_term_max_nrmse": coherent_identity_max,
        "coherent_cross_term_pass": coherent_identity_max <= 1e-10,
        "coherent_nonzero_all_orientations": coherent_nonzero,
        "first_simulated_signal_scale_below_10pct_error": first_below_ten_percent,
        "scientific_result": None,
    }
    checks["outcome"] = (
        "SYNTHETIC_INTERACTION_OPERATOR_VALIDATED"
        if record_count_ok
        and checks["linear_null_pass"]
        and checks["coherent_cross_term_pass"]
        and coherent_nonzero
        else "INVALID"
    )
    return rows, snr_rows, arrays, checks


def interaction_visual(
    rows: list[dict[str, object]],
    snr_rows: list[dict[str, object]],
    arrays: dict[str, np.ndarray],
    checks: dict[str, object],
    path: Path,
) -> None:
    canvas = Image.new("RGB", (1800, 1160), (3, 11, 22))
    draw = ImageDraw.Draw(canvas)
    draw.text((55, 28), "NEXAH TOP — PRIMARY INTERACTION RESIDUAL", font=base.font(40, True), fill=(229, 248, 252))
    draw.text((57, 78), "FOUR STATES · TWO NULL ARMS · ONE COHERENT POSITIVE CONTROL · SYNTHETIC ONLY", font=base.font(18, True), fill=(255, 177, 67))

    state_labels = (("0", "0 · CLOSED"), ("B1", "B1 ONLY"), ("B2", "B2 ONLY"), ("B1_PLUS_B2", "B1 + B2"))
    for index, (key, label) in enumerate(state_labels):
        x0 = 45 + index * 430
        base.paste_panel(
            canvas,
            draw,
            base.scalar_to_gray(arrays[f"state_0_{key}"]),
            (x0, 125, x0 + 395, 430),
            label,
            "registered 8x fractional aperture state",
        )

    base.paste_panel(
        canvas,
        draw,
        base.residual_to_image(arrays["coherent_delta_0"]),
        (45, 475, 600, 850),
        "DELTA_12 · 0°",
        "coherent joint minus separate intensities",
    )
    base.paste_panel(
        canvas,
        draw,
        base.residual_to_image(arrays["coherent_delta_45"]),
        (625, 475, 1180, 850),
        "DELTA_12 · 45°",
        "same operator; diagonal sampling retained",
    )

    chart_box = (1205, 475, 1755, 850)
    draw.rounded_rectangle(chart_box, radius=14, fill=(8, 20, 34), outline=(38, 187, 220), width=2)
    draw.text((1225, 490), "COHERENT INTERACTION", font=base.font(21, True), fill=(223, 245, 250))
    coherent = [row for row in rows if row["arm"] == "B_COHERENT_FOURIER"]
    coherent.sort(key=lambda row: base.ANGLES.index(int(row["angle_deg"])))
    values = [float(row["interaction_nrmse_vs_joint"]) for row in coherent]
    px0, py0, px1, py1 = 1260, 555, 1715, 775
    maximum = max(values)
    for fraction in (0.0, 0.5, 1.0):
        y = py1 - fraction * (py1 - py0)
        draw.line((px0, y, px1, y), fill=(28, 55, 72), width=1)
        draw.text((1215, y - 8), f"{fraction * maximum:.2f}", font=base.font(12), fill=(130, 165, 176))
    points = []
    for index, (angle, value) in enumerate(zip(base.ANGLES, values)):
        x = px0 + index * (px1 - px0) / (len(values) - 1)
        y = py1 - value / maximum * (py1 - py0)
        points.append((x, y))
        draw.text((x - 10, py1 + 12), str(angle), font=base.font(11), fill=(160, 190, 200))
    draw.line(points, fill=(244, 190, 70), width=4)
    for point in points:
        draw.ellipse((point[0] - 4, point[1] - 4, point[0] + 4, point[1] + 4), fill=(244, 190, 70))
    draw.text((1230, 820), "NRMSE(Delta_12 / joint intensity)", font=base.font(14), fill=(190, 220, 228))

    snr_box = (45, 895, 1755, 1090)
    draw.rounded_rectangle(snr_box, radius=14, fill=(8, 20, 34), outline=(38, 187, 220), width=2)
    draw.text((65, 910), "SIMULATED SIGNAL-SCALE PLANNING — interaction estimation error", font=base.font(20, True), fill=(223, 245, 250))
    sx0, sy0, sx1, sy1 = 140, 965, 1660, 1045
    log_values = [math.log10(float(row["mean_interaction_error_nrmse"])) for row in snr_rows]
    lo, hi = min(log_values), max(log_values)
    snr_points = []
    for index, row in enumerate(snr_rows):
        x = sx0 + index * (sx1 - sx0) / (len(snr_rows) - 1)
        y = sy1 - (log_values[index] - lo) / max(hi - lo, 1e-15) * (sy1 - sy0)
        snr_points.append((x, y))
        draw.text((x - 18, sy1 + 12), f"{row['signal_scale']}x", font=base.font(12), fill=(160, 190, 200))
    draw.line(snr_points, fill=(105, 219, 235), width=4)
    for point in snr_points:
        draw.ellipse((point[0] - 4, point[1] - 4, point[0] + 4, point[1] + 4), fill=(105, 219, 235))

    draw.text((55, 1120), f"OUTCOME: {checks['outcome']}  ·  PHYSICAL RESULT: NONE", font=base.font(18, True), fill=(141, 207, 221))
    canvas.save(path)


def save_outputs(output_dir: Path) -> dict[str, object]:
    output_dir.mkdir(parents=True, exist_ok=True)
    rows, snr_rows, arrays, checks = calculate()
    with (output_dir / "interaction_metrics.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    with (output_dir / "signal_scale_metrics.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(snr_rows[0]))
        writer.writeheader()
        writer.writerows(snr_rows)
    np.savez_compressed(output_dir / "interaction_arrays.npz", **arrays)
    interaction_visual(rows, snr_rows, arrays, checks, output_dir / "primary_interaction_residual.png")
    result = {
        "execution_id": EXECUTION_ID,
        "status": "SYNTHETIC_PRIMARY_INTERACTION_COMPLETE",
        "parameters": {
            "grid": [base.N, base.N],
            "aperture_occupancy_scale": SCALE,
            "angles_deg": list(base.ANGLES),
            "signal_scales": list(SIGNAL_SCALES),
            "snr_repeats": SNR_REPEATS,
            "seed": SEED,
        },
        "checks": checks,
        "interaction_metrics": rows,
        "signal_scale_metrics": snr_rows,
        "artifacts": {
            "interaction_metrics_csv": "interaction_metrics.csv",
            "signal_scale_metrics_csv": "signal_scale_metrics.csv",
            "arrays_npz": "interaction_arrays.npz",
            "visual_png": "primary_interaction_residual.png",
        },
        "claim_ceiling": "SYNTHETIC_OPERATOR_VALIDATION_NOT_PHYSICAL_EVIDENCE",
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

