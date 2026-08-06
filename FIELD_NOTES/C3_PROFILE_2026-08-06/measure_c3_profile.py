#!/usr/bin/env python3
"""Reproduce the v39 return test for C2 and apply it unchanged to C3.

The controlled metric uses the model, capture hook, horizon, step size and
tolerance from navigator_v39_fixpoint_extraction.py.  A second, explicitly
separate diagnostic integrates only the unnormalised combined field; it is not
mixed into the v39-compatible return fraction.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

import numpy as np


CLUSTERS = {
    "C0": np.array([10.0, 25.0]),
    "C1": np.array([12.0, 24.0]),
    "C2": np.array([13.5, 26.0]),
    "C3": np.array([11.0, 28.5]),
}
RADII = np.arange(0.2, 1.21, 0.2)
N_RING = 40
N_FIXPOINT = 100
CONTROLLED_STEPS = 260
CONTROLLED_STEP_SIZE = 0.06
TOL = 0.16
SEED = 42


def gaussian(x, y, center, strength, sigma=1.2):
    return strength * np.exp(
        -((x - center[0]) ** 2 + (y - center[1]) ** 2) / (2 * sigma**2)
    )


def scalar_field(x, y):
    return (
        gaussian(x, y, CLUSTERS["C0"], 1.5)
        + gaussian(x, y, CLUSTERS["C1"], 2.0)
        + gaussian(x, y, CLUSTERS["C2"], 3.0)
        - gaussian(x, y, CLUSTERS["C3"], 2.0)
    )


def grad_field(x, y, eps=1e-3):
    dx = (scalar_field(x + eps, y) - scalar_field(x - eps, y)) / (2 * eps)
    dy = (scalar_field(x, y + eps) - scalar_field(x, y - eps)) / (2 * eps)
    return np.array([dx, dy])


def rotational_field(x, y):
    p = np.array([x, y], dtype=float)
    r2 = p - CLUSTERS["C2"]
    d2 = np.linalg.norm(r2) + 1e-9
    r3 = p - CLUSTERS["C3"]
    d3 = np.linalg.norm(r3) + 1e-9
    return (
        0.60
        * np.array([r2[1], -r2[0]])
        * np.exp(-(d2**2) / (2 * 1.6**2))
        + 0.55
        * np.array([-r3[1], r3[0]])
        * np.exp(-(d3**2) / (2 * 1.3**2))
    )


def combined_field(x, y):
    return grad_field(x, y) + rotational_field(x, y)


def capture_hook_field(x, y, target, hook_radius=1.6, hook_strength=1.15):
    p = np.array([x, y], dtype=float)
    r = p - target
    d = np.linalg.norm(r) + 1e-9
    inward = -r / d
    tangential = np.array([r[1], -r[0]]) / d
    gate = np.exp(-(d**2) / (2 * hook_radius**2))
    tang_weight = hook_strength * gate
    in_weight = 0.9 * hook_strength * gate * (1.2 + 0.8 * np.exp(-d))
    return tang_weight * tangential + in_weight * inward


def controlled_endpoint(start, target):
    x = np.array(start, dtype=float)
    for _ in range(CONTROLLED_STEPS):
        direction = (
            combined_field(x[0], x[1])
            + 0.35 * (target - x)
            + capture_hook_field(x[0], x[1], target)
        )
        direction /= np.linalg.norm(direction) + 1e-9
        x = x + CONTROLLED_STEP_SIZE * direction
    return x


def free_endpoint(start, dt=0.01, steps=1560):
    """Euler integration of dx/dt=combined_field(x), without target terms."""
    x = np.array(start, dtype=float)
    for _ in range(steps):
        x = x + dt * combined_field(x[0], x[1])
    return x


def ring(center, radius):
    theta = 2 * np.pi * np.arange(N_RING) / N_RING
    return center + radius * np.column_stack((np.cos(theta), np.sin(theta)))


def jacobian(point, eps=1e-4):
    result = np.zeros((2, 2))
    for axis in range(2):
        delta = np.zeros(2)
        delta[axis] = eps
        plus = combined_field(*(point + delta))
        minus = combined_field(*(point - delta))
        result[:, axis] = (plus - minus) / (2 * eps)
    return result


def measure(label, offsets):
    center = CLUSTERS[label]
    cloud = np.array([controlled_endpoint(center + offset, center) for offset in offsets])
    fixpoint = np.mean(cloud, axis=0)
    spread = np.mean(np.linalg.norm(cloud - fixpoint, axis=1))
    rows = []
    for radius in RADII:
        seeds = ring(center, radius)
        controlled = np.array([controlled_endpoint(seed, center) for seed in seeds])
        free = np.array([free_endpoint(seed) for seed in seeds])
        rows.append(
            {
                "cluster": label,
                "radius": float(np.round(radius, 10)),
                "controlled_return_fraction": float(
                    np.mean(np.linalg.norm(controlled - fixpoint, axis=1) <= TOL)
                ),
                "free_return_to_declared_center_fraction": float(
                    np.mean(np.linalg.norm(free - center, axis=1) <= TOL)
                ),
                "controlled_endpoint_spread": float(
                    np.mean(np.linalg.norm(controlled - np.mean(controlled, axis=0), axis=1))
                ),
                "free_median_endpoint_distance": float(
                    np.median(np.linalg.norm(free - center, axis=1))
                ),
            }
        )
    local_jacobian = jacobian(center)
    return {
        "cluster": label,
        "declared_center": center.tolist(),
        "controlled_fixpoint_estimate": fixpoint.tolist(),
        "controlled_fixpoint_offset": float(np.linalg.norm(fixpoint - center)),
        "controlled_endpoint_cloud_spread": float(spread),
        "largest_tested_radius_with_controlled_return_ge_0_90": float(
            max((row["radius"] for row in rows if row["controlled_return_fraction"] >= 0.9), default=0.0)
        ),
        "scalar_field_at_declared_center": float(scalar_field(*center)),
        "free_field_norm_at_declared_center": float(np.linalg.norm(combined_field(*center))),
        "free_field_jacobian_at_declared_center": local_jacobian.tolist(),
        "free_field_jacobian_eigenvalues": [
            [float(value.real), float(value.imag)] for value in np.linalg.eigvals(local_jacobian)
        ],
        "radius_rows": rows,
    }


def main():
    # Match v39's np.random.seed / np.random.uniform call order exactly.
    rng = np.random.RandomState(SEED)
    offsets = np.array(
        [[rng.uniform(-0.9, 0.9), rng.uniform(-0.9, 0.9)] for _ in range(N_FIXPOINT)]
    )
    results = [measure(label, offsets) for label in ("C2", "C3")]
    output_dir = Path(__file__).resolve().parent / "results"
    output_dir.mkdir(parents=True, exist_ok=True)

    metadata = {
        "source_model": "navigator_v39_fixpoint_extraction.py",
        "seed": SEED,
        "radii": RADII.tolist(),
        "n_ring": N_RING,
        "n_fixpoint": N_FIXPOINT,
        "controlled_steps": CONTROLLED_STEPS,
        "controlled_step_size": CONTROLLED_STEP_SIZE,
        "tolerance": TOL,
        "free_diagnostic": "Euler dx/dt=combined_field(x), dt=0.01, steps=1560",
        "results": results,
    }
    (output_dir / "c2_c3_profile.json").write_text(
        json.dumps(metadata, indent=2) + "\n", encoding="utf-8"
    )
    with (output_dir / "c2_c3_return_scan.csv").open("w", newline="", encoding="utf-8") as handle:
        fieldnames = list(results[0]["radius_rows"][0].keys())
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for result in results:
            writer.writerows(result["radius_rows"])

    for result in results:
        print(
            result["cluster"],
            "fixpoint=", np.round(result["controlled_fixpoint_estimate"], 6),
            "spread=", f'{result["controlled_endpoint_cloud_spread"]:.6f}',
            "r90=", result["largest_tested_radius_with_controlled_return_ge_0_90"],
        )


if __name__ == "__main__":
    main()
