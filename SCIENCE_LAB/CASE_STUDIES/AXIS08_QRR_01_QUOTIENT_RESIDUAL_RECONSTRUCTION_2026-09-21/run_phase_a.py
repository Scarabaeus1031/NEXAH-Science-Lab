#!/usr/bin/env python3
"""Frozen AXIS08-QRR-01 Phase A execution."""
from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
TOL = 1e-12
FAMILIES = [
    ("independent", 8107),
    ("correlated_pair", 8108),
    ("near_identical_pair", 8109),
    ("near_opposite_pair", 8110),
    ("rare_kernel_events", 8111),
]
WEIGHTS = [(1.0, 1.0), (3.0, 1.0)]


def make_family(name: str, seed: int, n: int = 4096) -> np.ndarray:
    rng = np.random.default_rng(seed)
    x = rng.normal(size=(n, 8))
    if name == "correlated_pair":
        x[:, 7] = 0.85 * x[:, 6] + rng.normal(scale=0.25, size=n)
    elif name == "near_identical_pair":
        x[:, 7] = x[:, 6] + rng.normal(scale=0.02, size=n)
    elif name == "near_opposite_pair":
        x[:, 7] = -x[:, 6] + rng.normal(scale=0.02, size=n)
    elif name == "rare_kernel_events":
        event = rng.random(n) < 0.04
        amplitude = rng.choice([-4.0, 4.0], size=n) * event
        x[:, 6] += amplitude
        x[:, 7] -= amplitude
    return x


def q_encode(x: np.ndarray, weights: tuple[float, float]) -> np.ndarray:
    w7, w8 = weights
    s = w7 + w8
    if abs(s) < TOL:
        raise ValueError("zero-sum weights")
    q = (w7 * x[:, 6] + w8 * x[:, 7]) / s
    return np.column_stack([x[:, :6], q])


def qr_encode(x: np.ndarray, weights: tuple[float, float]) -> np.ndarray:
    return np.column_stack([q_encode(x, weights), x[:, 6] - x[:, 7]])


def qr_decode(z: np.ndarray, weights: tuple[float, float]) -> np.ndarray:
    w7, w8 = weights
    s = w7 + w8
    q, delta = z[:, 6], z[:, 7]
    return np.column_stack([z[:, :6], q + (w8 / s) * delta, q - (w7 / s) * delta])


def q_decode(z: np.ndarray, weights: tuple[float, float]) -> np.ndarray:
    pair = np.column_stack([z[:, 6], z[:, 6]])
    return np.column_stack([z[:, :6], pair])


def metrics(actual: np.ndarray, reconstructed: np.ndarray) -> tuple[float, float]:
    err = actual - reconstructed
    nmse = float(np.mean(err**2) / max(np.mean(actual**2), 1e-30))
    return nmse, float(np.max(np.abs(err)))


def linear_baselines(train: np.ndarray, test: np.ndarray, seed: int):
    mean = train.mean(axis=0)
    centered = train - mean
    _, _, vt = np.linalg.svd(centered, full_matrices=False)
    pca_basis = vt[:7].T
    pca_recon = (test - mean) @ pca_basis @ pca_basis.T + mean
    rng = np.random.default_rng(seed)
    random_map = rng.normal(size=(7, 8))
    random_recon = test @ random_map.T @ np.linalg.pinv(random_map.T)
    drop_recon = np.column_stack([test[:, :7], np.full(len(test), mean[7])])
    return {"PCA7": pca_recon, "RANDOM7": random_recon, "DROP8_TO7": drop_recon}


def kernel_counterfactuals(x: np.ndarray, weights: tuple[float, float]) -> np.ndarray:
    w7, w8 = weights
    if abs(w8) < TOL:
        raise ValueError("w8 must be non-zero for frozen counterfactual")
    amplitude = np.linspace(0.1, 2.0, len(x))
    y = x.copy()
    y[:, 6] += amplitude * w8
    y[:, 7] -= amplitude * w7
    return y


def e8_roots() -> np.ndarray:
    roots = []
    for i in range(8):
        for j in range(i + 1, 8):
            for si in (-1.0, 1.0):
                for sj in (-1.0, 1.0):
                    v = np.zeros(8)
                    v[i], v[j] = si, sj
                    roots.append(v)
    for mask in range(256):
        signs = np.array([-0.5 if mask & (1 << i) else 0.5 for i in range(8)])
        if int(np.sum(signs < 0)) % 2 == 0:
            roots.append(signs)
    return np.array(roots)


def main() -> None:
    protocol_bytes = (ROOT / "protocol.json").read_bytes()
    rows = []
    primary = []
    for family, seed in FAMILIES:
        data = make_family(family, seed)
        split = int(0.7 * len(data))
        train, test = data[:split], data[split:]
        for weights in WEIGHTS:
            label = f"w{weights[0]:g}_{weights[1]:g}"
            q = q_encode(test, weights)
            qr = qr_encode(test, weights)
            representations = {
                "FULL8": test.copy(),
                "Q_ONLY7": q_decode(q, weights),
                "Q_PLUS_DELTA8": qr_decode(qr, weights),
                **linear_baselines(train, test, seed + int(weights[0] * 10)),
            }
            for name, recon in representations.items():
                nmse, max_error = metrics(test, recon)
                rows.append([family, label, name, recon.shape[1] if name == "FULL8" else (8 if name == "Q_PLUS_DELTA8" else 7), nmse, max_error])
            cf = kernel_counterfactuals(test[:256], weights)
            q_distance = float(np.max(np.linalg.norm(q_encode(test[:256], weights) - q_encode(cf, weights), axis=1)))
            qr_distance = np.linalg.norm(qr_encode(test[:256], weights) - qr_encode(cf, weights), axis=1)
            qr_detection = float(np.mean(qr_distance > TOL))
            exact_error = metrics(test, qr_decode(qr, weights))[1]
            primary.append({"family": family, "weights": list(weights), "exact_max_error": exact_error, "q_kernel_max_distance": q_distance, "qr_kernel_detection_rate": qr_detection})

    roots = e8_roots()
    e8_checks = []
    for weights in WEIGHTS:
        restored = qr_decode(qr_encode(roots, weights), weights)
        e8_checks.append({"weights": list(weights), "root_count": len(roots), "max_reconstruction_error": metrics(roots, restored)[1]})

    zero_sum_rejected = False
    try:
        q_encode(np.zeros((1, 8)), (1.0, -1.0))
    except ValueError:
        zero_sum_rejected = True

    passed = all(item["exact_max_error"] < TOL and item["q_kernel_max_distance"] < TOL and item["qr_kernel_detection_rate"] == 1.0 for item in primary)
    passed = passed and all(item["root_count"] == 240 and item["max_reconstruction_error"] < TOL for item in e8_checks) and zero_sum_rejected
    result = {
        "protocol_id": "AXIS08-QRR-01",
        "protocol_sha256": hashlib.sha256(protocol_bytes).hexdigest(),
        "status": "PASS" if passed else "FAIL",
        "primary": primary,
        "e8_calibration": e8_checks,
        "zero_sum_rejected": zero_sum_rejected,
        "ieee_pegase_executed": False,
        "decision": "PHASE_A_EXACT_RESIDUAL_SUFFICIENCY_CONFIRMED" if passed else "STOP_PRIMARY_GATE_FAILED",
        "nonclaims": ["no novel linear algebra", "no universal optimality", "no physical identity", "no IEEE prediction or control"]
    }
    with (ROOT / "phase_a_metrics.csv").open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["family", "weights", "representation", "stored_scalars", "heldout_nmse", "max_abs_error"])
        writer.writerows(rows)
    (ROOT / "phase_a_results.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"status": result["status"], "decision": result["decision"], "metric_rows": len(rows), "primary_cells": len(primary), "e8_checks": len(e8_checks)}))
    raise SystemExit(0 if passed else 1)


if __name__ == "__main__":
    main()
