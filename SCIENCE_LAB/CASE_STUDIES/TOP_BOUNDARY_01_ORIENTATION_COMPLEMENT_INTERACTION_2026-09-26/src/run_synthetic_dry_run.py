#!/usr/bin/env python3
"""TOP-BOUNDARY-01 deterministic synthetic dry run.

This script verifies the preregistered bookkeeping with three deliberately
limited models. It does not simulate a calibrated physical apparatus.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


CASE_ID = "TOP-BOUNDARY-01-DRY-01R1"
N = 257
ANGLES = (0, 45, 90, 135, 180, 225, 270, 315)
SLIT_WIDTH = 0.10
SLIT_SEPARATION = 0.34
BLUR_SIGMA_PX = 2.0
DISPERSION_SHIFTS_PX = {"R": 6, "G": 0, "B": -6}
REPEATS = 10
SOURCE_GAIN_SIGMA = 0.001
SENSOR_NOISE_SIGMA = 0.0005
DARK_OFFSET = 0.01
SEED = 260926


def coordinate_grid(n: int = N) -> tuple[np.ndarray, np.ndarray]:
    axis = np.linspace(-1.0, 1.0, n, endpoint=True, dtype=np.float64)
    return np.meshgrid(axis, axis)


def normal_coordinate(angle_deg: float, n: int = N) -> np.ndarray:
    x, y = coordinate_grid(n)
    theta = math.radians(angle_deg)
    return x * math.cos(theta) + y * math.sin(theta)


def edge_mask(angle_deg: float, light_to_dark: bool = True) -> np.ndarray:
    mask = normal_coordinate(angle_deg) >= 0.0
    if not light_to_dark:
        mask = ~mask
    return mask.astype(np.float64)


def slit_mask(angle_deg: float, width: float = SLIT_WIDTH) -> np.ndarray:
    u = normal_coordinate(angle_deg)
    return (np.abs(u) <= width / 2.0).astype(np.float64)


def slit_components(
    angle_deg: float,
    width: float = SLIT_WIDTH,
    separation: float = SLIT_SEPARATION,
) -> tuple[np.ndarray, np.ndarray]:
    u = normal_coordinate(angle_deg)
    q1 = (np.abs(u - separation / 2.0) <= width / 2.0).astype(np.float64)
    q2 = (np.abs(u + separation / 2.0) <= width / 2.0).astype(np.float64)
    return q1, q2


def double_slit_mask(angle_deg: float) -> np.ndarray:
    q1, q2 = slit_components(angle_deg)
    return np.maximum(q1, q2)


def gaussian_blur_fft(image: np.ndarray, sigma_px: float = BLUR_SIGMA_PX) -> np.ndarray:
    n_y, n_x = image.shape
    fy = np.fft.fftfreq(n_y)
    fx = np.fft.fftfreq(n_x)
    fxx, fyy = np.meshgrid(fx, fy)
    transfer = np.exp(-2.0 * math.pi**2 * sigma_px**2 * (fxx**2 + fyy**2))
    return np.fft.ifft2(np.fft.fft2(image) * transfer).real


def translate_x(image: np.ndarray, shift_px: int) -> np.ndarray:
    out = np.zeros_like(image)
    if shift_px == 0:
        out[:] = image
    elif shift_px > 0:
        out[:, shift_px:] = image[:, :-shift_px]
    else:
        amount = -shift_px
        out[:, :-amount] = image[:, amount:]
    return out


def isotropic_record(mask: np.ndarray) -> np.ndarray:
    return gaussian_blur_fft(mask)


def dispersion_record(mask: np.ndarray) -> np.ndarray:
    channels = []
    for name in ("R", "G", "B"):
        shifted = translate_x(mask, DISPERSION_SHIFTS_PX[name])
        channels.append(gaussian_blur_fft(shifted))
    return np.stack(channels, axis=-1)


def coherent_intensity(mask: np.ndarray) -> np.ndarray:
    amplitude = np.fft.fftshift(np.fft.fft2(np.fft.ifftshift(mask))) / mask.size
    return np.abs(amplitude) ** 2


def rotate_channel(channel: np.ndarray, angle_deg: float) -> np.ndarray:
    image = Image.fromarray(channel.astype(np.float32), mode="F")
    returned = image.rotate(
        angle_deg,
        resample=Image.Resampling.BICUBIC,
        expand=False,
        fillcolor=0.0,
    )
    return np.asarray(returned, dtype=np.float64)


def rotate_back(record: np.ndarray, angle_deg: float) -> np.ndarray:
    if angle_deg % 360 == 0:
        return record.copy()
    if record.ndim == 2:
        return rotate_channel(record, angle_deg)
    return np.stack(
        [rotate_channel(record[..., index], angle_deg) for index in range(record.shape[-1])],
        axis=-1,
    )


def central_roi(n: int = N) -> np.ndarray:
    x, y = coordinate_grid(n)
    return (np.abs(x) <= 0.62) & (np.abs(y) <= 0.62)


def normalized_rmse(value: np.ndarray, reference: np.ndarray, roi: np.ndarray) -> float:
    if value.ndim == 3:
        active = np.repeat(roi[..., None], value.shape[-1], axis=-1)
    else:
        active = roi
    numerator = float(np.sqrt(np.mean(np.square(value[active]))))
    denominator = float(np.sqrt(np.mean(np.square(reference[active]))))
    return numerator / max(denominator, 1e-15)


def normalized_l1(value: np.ndarray, reference: np.ndarray, roi: np.ndarray) -> float:
    if value.ndim == 3:
        active = np.repeat(roi[..., None], value.shape[-1], axis=-1)
    else:
        active = roi
    numerator = float(np.mean(np.abs(value[active])))
    denominator = float(np.mean(np.abs(reference[active])))
    return numerator / max(denominator, 1e-15)


def synthetic_capture(signal: np.ndarray, rng: np.random.Generator) -> tuple[np.ndarray, np.ndarray]:
    gain = 1.0 + float(rng.normal(0.0, SOURCE_GAIN_SIGMA))
    camera = gain * signal + DARK_OFFSET + rng.normal(0.0, SENSOR_NOISE_SIGMA, signal.shape)
    dark = DARK_OFFSET + rng.normal(0.0, SENSOR_NOISE_SIGMA, signal.shape)
    return camera - dark, dark


def repeat_metric(
    residual_fn,
    reference: np.ndarray,
    roi: np.ndarray,
    rng: np.random.Generator,
) -> dict[str, float]:
    values = []
    for _ in range(REPEATS):
        residual = residual_fn(rng)
        values.append(normalized_rmse(residual, reference, roi))
    array = np.asarray(values)
    return {
        "mean": float(array.mean()),
        "std": float(array.std(ddof=1)),
        "q025": float(np.quantile(array, 0.025)),
        "q975": float(np.quantile(array, 0.975)),
    }


def add_noise(signal: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    calibrated, _ = synthetic_capture(signal, rng)
    return calibrated


def calculate() -> tuple[list[dict[str, object]], dict[str, np.ndarray], dict[str, object]]:
    roi = central_roi()
    rng = np.random.default_rng(SEED)
    metrics: list[dict[str, object]] = []
    arrays: dict[str, np.ndarray] = {}

    edge_iso_0 = isotropic_record(edge_mask(0))
    edge_disp_0 = dispersion_record(edge_mask(0))
    single_coh_0 = coherent_intensity(slit_mask(0))
    double_coh_0 = coherent_intensity(double_slit_mask(0))

    arrays.update(
        edge_iso_0=edge_iso_0,
        edge_disp_0=edge_disp_0,
        single_coh_0=single_coh_0,
        double_coh_0=double_coh_0,
    )

    for angle in ANGLES:
        families = (
            ("C0_ISOTROPIC_EDGE", isotropic_record(edge_mask(angle)), edge_iso_0),
            ("A1_FIXED_DISPERSION_EDGE", dispersion_record(edge_mask(angle)), edge_disp_0),
            ("B1_COHERENT_SINGLE_SLIT", coherent_intensity(slit_mask(angle)), single_coh_0),
            ("B1_COHERENT_DOUBLE_SLIT", coherent_intensity(double_slit_mask(angle)), double_coh_0),
        )
        for family, observed, baseline in families:
            returned = rotate_back(observed, angle)
            residual = returned - baseline
            ideal_rmse = normalized_rmse(residual, baseline, roi)

            def noisy_orientation(local_rng, obs=observed, base=baseline, theta=angle):
                return rotate_back(add_noise(obs, local_rng), theta) - add_noise(base, local_rng)

            repeat = repeat_metric(noisy_orientation, baseline, roi, rng)
            metrics.append(
                {
                    "metric": "rho_theta",
                    "family": family,
                    "angle_deg": angle,
                    "ideal_nrmse": ideal_rmse,
                    "noisy_mean_nrmse": repeat["mean"],
                    "noisy_std_nrmse": repeat["std"],
                    "noisy_q025_nrmse": repeat["q025"],
                    "noisy_q975_nrmse": repeat["q975"],
                }
            )
            if angle in (45, 90):
                arrays[f"{family}_{angle}_returned"] = returned
                arrays[f"{family}_{angle}_rho"] = residual

    open_mask = np.ones((N, N), dtype=np.float64)
    closed_mask = np.zeros((N, N), dtype=np.float64)
    q_edge = edge_mask(0)
    q_edge_c = 1.0 - q_edge
    q_slit = slit_mask(0)
    q_bar = 1.0 - q_slit

    closure_cases = (
        (
            "C0_ISOTROPIC_EDGE",
            isotropic_record(q_edge),
            isotropic_record(q_edge_c),
            isotropic_record(open_mask),
            isotropic_record(closed_mask),
        ),
        (
            "A1_FIXED_DISPERSION_EDGE",
            dispersion_record(q_edge),
            dispersion_record(q_edge_c),
            dispersion_record(open_mask),
            dispersion_record(closed_mask),
        ),
        (
            "A1_FIXED_DISPERSION_SLIT",
            dispersion_record(q_slit),
            dispersion_record(q_bar),
            dispersion_record(open_mask),
            dispersion_record(closed_mask),
        ),
        (
            "B1_COHERENT_SINGLE_SLIT",
            coherent_intensity(q_slit),
            coherent_intensity(q_bar),
            coherent_intensity(open_mask),
            coherent_intensity(closed_mask),
        ),
    )

    for family, q_record, c_record, one_record, zero_record in closure_cases:
        epsilon = q_record + c_record - one_record - zero_record
        ideal_rmse = normalized_rmse(epsilon, one_record, roi)

        def noisy_closure(local_rng, q=q_record, c=c_record, one=one_record, zero=zero_record):
            return add_noise(q, local_rng) + add_noise(c, local_rng) - add_noise(one, local_rng) - add_noise(zero, local_rng)

        repeat = repeat_metric(noisy_closure, one_record, roi, rng)
        metrics.append(
            {
                "metric": "epsilon_Q",
                "family": family,
                "angle_deg": 0,
                "ideal_nrmse": ideal_rmse,
                "noisy_mean_nrmse": repeat["mean"],
                "noisy_std_nrmse": repeat["std"],
                "noisy_q025_nrmse": repeat["q025"],
                "noisy_q975_nrmse": repeat["q975"],
            }
        )
        arrays[f"{family}_epsilon"] = epsilon

    q1, q2 = slit_components(0)
    joint = np.maximum(q1, q2)
    i1 = coherent_intensity(q1)
    i2 = coherent_intensity(q2)
    i12 = coherent_intensity(joint)
    i0 = coherent_intensity(closed_mask)
    delta = i12 - i1 - i2 + i0
    interaction_reference = i12
    ideal_rmse = normalized_rmse(delta, interaction_reference, roi)
    ideal_l1 = normalized_l1(delta, interaction_reference, roi)

    def noisy_interaction(local_rng):
        return add_noise(i12, local_rng) - add_noise(i1, local_rng) - add_noise(i2, local_rng) + add_noise(i0, local_rng)

    repeat = repeat_metric(noisy_interaction, interaction_reference, roi, rng)
    metrics.append(
        {
            "metric": "Delta_12",
            "family": "B1_COHERENT_DOUBLE_SLIT",
            "angle_deg": 0,
            "ideal_nrmse": ideal_rmse,
            "ideal_normalized_l1": ideal_l1,
            "noisy_mean_nrmse": repeat["mean"],
            "noisy_std_nrmse": repeat["std"],
            "noisy_q025_nrmse": repeat["q025"],
            "noisy_q975_nrmse": repeat["q975"],
        }
    )
    arrays.update(coherent_q1=i1, coherent_q2=i2, coherent_joint=i12, coherent_delta=delta)

    checks = {
        "exact_binary_complement_edge": bool(np.array_equal(q_edge + q_edge_c, open_mask)),
        "exact_binary_complement_slit": bool(np.array_equal(q_slit + q_bar, open_mask)),
        "isotropic_noiseless_closure_max_abs": float(np.max(np.abs(arrays["C0_ISOTROPIC_EDGE_epsilon"]))),
        "dispersion_noiseless_closure_max_abs": float(np.max(np.abs(arrays["A1_FIXED_DISPERSION_EDGE_epsilon"]))),
        "coherent_interaction_max_abs": float(np.max(np.abs(delta))),
        "coherent_interaction_nonzero": bool(np.max(np.abs(delta)) > 1e-8),
        "scientific_result": None,
        "interpretation": "SYNTHETIC_PIPELINE_CHECK_ONLY",
    }
    return metrics, arrays, checks


def scalar_to_gray(array: np.ndarray, log_scale: bool = False) -> Image.Image:
    value = np.maximum(array, 0.0)
    if log_scale:
        value = np.log1p(value / max(float(value.max()), 1e-15) * 5000.0)
    lo, hi = np.quantile(value, [0.01, 0.995])
    scaled = np.clip((value - lo) / max(float(hi - lo), 1e-15), 0.0, 1.0)
    rgb = np.repeat((scaled * 255.0).astype(np.uint8)[..., None], 3, axis=-1)
    return Image.fromarray(rgb, mode="RGB")


def rgb_record_to_image(array: np.ndarray) -> Image.Image:
    high = np.quantile(array, 0.995)
    scaled = np.clip(array / max(float(high), 1e-15), 0.0, 1.0)
    return Image.fromarray((scaled * 255.0).astype(np.uint8), mode="RGB")


def residual_to_image(array: np.ndarray) -> Image.Image:
    if array.ndim == 3:
        array = np.mean(array, axis=-1)
    limit = float(np.quantile(np.abs(array), 0.995))
    normalized = np.clip(array / max(limit, 1e-15), -1.0, 1.0)
    red = np.clip(normalized, 0.0, 1.0)
    cyan = np.clip(-normalized, 0.0, 1.0)
    base = 0.04 + 0.10 * (1.0 - np.abs(normalized))
    rgb = np.stack([base + 0.90 * red, base + 0.75 * cyan, base + 0.95 * cyan], axis=-1)
    return Image.fromarray((np.clip(rgb, 0.0, 1.0) * 255.0).astype(np.uint8), mode="RGB")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def paste_panel(
    canvas: Image.Image,
    draw: ImageDraw.ImageDraw,
    image: Image.Image,
    box: tuple[int, int, int, int],
    title: str,
    caption: str,
) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(box, radius=14, fill=(8, 20, 34), outline=(38, 187, 220), width=2)
    draw.text((x0 + 16, y0 + 12), title, font=font(22, True), fill=(223, 245, 250))
    image_box = (x0 + 16, y0 + 48, x1 - 16, y1 - 58)
    fitted = image.resize((image_box[2] - image_box[0], image_box[3] - image_box[1]), Image.Resampling.LANCZOS)
    canvas.paste(fitted, image_box[:2])
    draw.multiline_text((x0 + 16, y1 - 48), caption, font=font(15), fill=(170, 205, 216), spacing=3)


def line_chart(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    series: list[tuple[str, list[float], tuple[int, int, int]]],
) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(box, radius=14, fill=(8, 20, 34), outline=(38, 187, 220), width=2)
    draw.text((x0 + 16, y0 + 12), "ORIENTATION RETURN — ideal NRMSE", font=font(21, True), fill=(223, 245, 250))
    plot = (x0 + 65, y0 + 60, x1 - 20, y1 - 55)
    px0, py0, px1, py1 = plot
    maximum = max(max(values) for _, values, _ in series)
    maximum = max(maximum, 1e-6)
    for fraction in (0.0, 0.25, 0.5, 0.75, 1.0):
        y = py1 - fraction * (py1 - py0)
        draw.line((px0, y, px1, y), fill=(28, 55, 72), width=1)
        draw.text((x0 + 5, y - 8), f"{fraction * maximum:.2f}", font=font(12), fill=(130, 165, 176))
    for index, angle in enumerate(ANGLES):
        x = px0 + index * (px1 - px0) / (len(ANGLES) - 1)
        draw.text((x - 11, py1 + 10), str(angle), font=font(12), fill=(150, 185, 196))
    for name, values, color in series:
        points = []
        for index, value in enumerate(values):
            x = px0 + index * (px1 - px0) / (len(values) - 1)
            y = py1 - value / maximum * (py1 - py0)
            points.append((x, y))
        draw.line(points, fill=color, width=3)
        for point in points:
            draw.ellipse((point[0] - 4, point[1] - 4, point[0] + 4, point[1] + 4), fill=color)
    legend_x = x0 + 70
    for name, _, color in series:
        draw.line((legend_x, y1 - 24, legend_x + 24, y1 - 24), fill=color, width=4)
        draw.text((legend_x + 31, y1 - 34), name, font=font(13), fill=(190, 220, 228))
        legend_x += 240


def build_overview(metrics: list[dict[str, object]], arrays: dict[str, np.ndarray], output_path: Path) -> None:
    canvas = Image.new("RGB", (1800, 1120), (3, 11, 22))
    draw = ImageDraw.Draw(canvas)
    draw.text((55, 30), "NEXAH TOP LENS — BOUNDARY DRY RUN 01", font=font(42, True), fill=(229, 248, 252))
    draw.text((57, 84), "SYNTHETIC PIPELINE CHECK · NOT A PHYSICAL RESULT", font=font(19, True), fill=(255, 177, 67))

    paste_panel(
        canvas,
        draw,
        scalar_to_gray(arrays["C0_ISOTROPIC_EDGE_45_returned"]),
        (45, 135, 580, 535),
        "C0 · ISOTROPIC NULL CONTROL",
        "45° record returned to 0°.\nResidual = raster + interpolation floor.",
    )
    paste_panel(
        canvas,
        draw,
        rgb_record_to_image(arrays["A1_FIXED_DISPERSION_EDGE_90_returned"]),
        (632, 135, 1167, 535),
        "A1 · FIXED DISPERSION AXIS",
        "Mask returns; spectral shift axis does not.\nStructured orientation residual is expected.",
    )
    paste_panel(
        canvas,
        draw,
        scalar_to_gray(arrays["coherent_joint"], log_scale=True),
        (1219, 135, 1755, 535),
        "B1 · COHERENT DOUBLE SLIT",
        "Log display of linear Fourier intensity.\nDisplay scaling is not primary evidence.",
    )

    def values_for(family: str) -> list[float]:
        rows = [row for row in metrics if row["metric"] == "rho_theta" and row["family"] == family]
        rows.sort(key=lambda row: ANGLES.index(int(row["angle_deg"])))
        return [float(row["ideal_nrmse"]) for row in rows]

    line_chart(
        draw,
        (45, 580, 1167, 1035),
        [
            ("isotropic edge", values_for("C0_ISOTROPIC_EDGE"), (105, 219, 235)),
            ("fixed dispersion", values_for("A1_FIXED_DISPERSION_EDGE"), (255, 89, 94)),
            ("coherent double slit", values_for("B1_COHERENT_DOUBLE_SLIT"), (244, 190, 70)),
        ],
    )
    paste_panel(
        canvas,
        draw,
        residual_to_image(arrays["coherent_delta"]),
        (1219, 580, 1755, 1035),
        "DELTA_12 · INTERACTION RESIDUAL",
        "Joint double-slit intensity minus separate\nslit intensities. Red/cyan = signed residual.",
    )
    draw.text(
        (55, 1070),
        "SOURCE → BOUNDARY → TRANSFER → RECORD → RETURN   |   rhoθ · epsilonQ · Delta12   |   CLAIM: SOFTWARE CHECK ONLY",
        font=font(18, True),
        fill=(141, 207, 221),
    )
    canvas.save(output_path)


def save_outputs(output_dir: Path) -> dict[str, object]:
    output_dir.mkdir(parents=True, exist_ok=True)
    metrics, arrays, checks = calculate()

    csv_path = output_dir / "metrics.csv"
    fieldnames = sorted({key for row in metrics for key in row})
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(metrics)

    np.savez_compressed(output_dir / "arrays.npz", **arrays)
    build_overview(metrics, arrays, output_dir / "synthetic_boundary_matrix_overview.png")

    result = {
        "case_id": CASE_ID,
        "status": "SYNTHETIC_DRY_RUN_COMPLETE",
        "scientific_result": None,
        "parameters": {
            "grid": [N, N],
            "angles_deg": list(ANGLES),
            "slit_width": SLIT_WIDTH,
            "slit_separation": SLIT_SEPARATION,
            "blur_sigma_px": BLUR_SIGMA_PX,
            "dispersion_shifts_px": DISPERSION_SHIFTS_PX,
            "repeats": REPEATS,
            "source_gain_sigma": SOURCE_GAIN_SIGMA,
            "sensor_noise_sigma": SENSOR_NOISE_SIGMA,
            "dark_offset": DARK_OFFSET,
            "seed": SEED,
        },
        "checks": checks,
        "metrics": metrics,
        "artifacts": {
            "metrics_csv": "metrics.csv",
            "arrays_npz": "arrays.npz",
            "overview_png": "synthetic_boundary_matrix_overview.png",
        },
        "claim_ceiling": "SYNTHETIC_PIPELINE_CHECK_ONLY_NOT_PHYSICAL_EVIDENCE",
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
