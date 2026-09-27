#!/usr/bin/env python3
"""Bounded test of the apparent Lorenz 'carrot' switch corridor.

Integrates the canonical Lorenz-63 equations with RK4 at several step sizes,
compares raw post-crossing samples with linearly interpolated x=0 crossings,
and exports convergence metrics plus a diagnostic figure.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from scipy.optimize import curve_fit


SIGMA = 10.0
RHO = 28.0
BETA = 8.0 / 3.0
T_END = 500.0
T_BURN = 50.0
DTS = (0.02, 0.01, 0.005, 0.0025)
DT_REFERENCE = 0.001
X0 = np.array([1.0, 1.0, 1.0], dtype=float)
OUT = Path("/workspace")


def rhs(s: np.ndarray) -> np.ndarray:
    x, y, z = s
    return np.array([
        SIGMA * (y - x),
        x * (RHO - z) - y,
        x * y - BETA * z,
    ])


def integrate(dt: float) -> tuple[np.ndarray, np.ndarray]:
    n = int(round(T_END / dt))
    t = np.linspace(0.0, T_END, n + 1)
    states = np.empty((n + 1, 3), dtype=float)
    states[0] = X0
    for i in range(n):
        s = states[i]
        k1 = rhs(s)
        k2 = rhs(s + 0.5 * dt * k1)
        k3 = rhs(s + 0.5 * dt * k2)
        k4 = rhs(s + dt * k3)
        states[i + 1] = s + (dt / 6.0) * (k1 + 2*k2 + 2*k3 + k4)
    keep = t >= T_BURN
    return t[keep], states[keep]


def crossings(t: np.ndarray, s: np.ndarray) -> dict[str, np.ndarray]:
    x0 = s[:-1, 0]
    x1 = s[1:, 0]
    idx = np.flatnonzero((x0 * x1 < 0.0) & (x0 != 0.0) & (x1 != 0.0))
    a = -x0[idx] / (x1[idx] - x0[idx])
    interp = s[idx] + a[:, None] * (s[idx + 1] - s[idx])
    ti = t[idx] + a * (t[idx + 1] - t[idx])
    direction = np.sign(x1[idx] - x0[idx])
    return {
        "idx": idx,
        "raw": s[idx + 1].copy(),
        "interp": interp,
        "time": ti,
        "direction": direction,
    }


def quantile_rmse(a: np.ndarray, b: np.ndarray) -> float:
    q = np.linspace(0.01, 0.99, 199)
    return float(np.sqrt(np.mean((np.quantile(a, q) - np.quantile(b, q))**2)))


def section_model(u: np.ndarray, z0: float, a: float, p: float) -> np.ndarray:
    return z0 + a * np.power(u, p)


def fit_section_branch(y: np.ndarray, z: np.ndarray) -> dict[str, float]:
    u = np.abs(y)
    popt, _ = curve_fit(section_model, u, z, p0=(11.0, 4.0, 0.7),
                        bounds=([0.0, 0.0, 0.05], [40.0, 20.0, 3.0]),
                        maxfev=20000)
    pred = section_model(u, *popt)
    ss_res = float(np.sum((z - pred) ** 2))
    ss_tot = float(np.sum((z - np.mean(z)) ** 2))
    return {
        "z0": float(popt[0]),
        "a": float(popt[1]),
        "p": float(popt[2]),
        "r2": 1.0 - ss_res / ss_tot,
        "rmse": float(np.sqrt(np.mean((z - pred) ** 2))),
    }


def main() -> None:
    runs: dict[float, dict[str, np.ndarray]] = {}
    metrics: list[dict[str, float | int]] = []

    for dt in DTS:
        t, s = integrate(dt)
        c = crossings(t, s)
        runs[dt] = {"t": t, "s": s, **c}
        raw_abs_x = np.abs(c["raw"][:, 0])
        z = c["interp"][:, 2]
        metrics.append({
            "dt": dt,
            "steps_after_burn": len(t),
            "crossings": len(z),
            "crossings_per_time": len(z) / (T_END - T_BURN),
            "raw_abs_x_mean": float(np.mean(raw_abs_x)),
            "raw_abs_x_p95": float(np.quantile(raw_abs_x, 0.95)),
            "raw_abs_x_max": float(np.max(raw_abs_x)),
            "interp_abs_x_max": float(np.max(np.abs(c["interp"][:, 0]))),
            "z_mean": float(np.mean(z)),
            "z_std": float(np.std(z)),
            "z_min": float(np.min(z)),
            "z_max": float(np.max(z)),
            "z_return_corr": float(np.corrcoef(z[:-1], z[1:])[0, 1]),
        })

    finest_z = runs[DTS[-1]]["interp"][:, 2]
    for row in metrics:
        z = runs[float(row["dt"])] ["interp"][:, 2]
        row["z_quantile_rmse_vs_finest"] = quantile_rmse(z, finest_z)

    # Empirical order at which the sampled x-width collapses.
    d = np.array([m["dt"] for m in metrics])
    w = np.array([m["raw_abs_x_p95"] for m in metrics])
    width_slope = float(np.polyfit(np.log(d), np.log(w), 1)[0])

    # Controlled resampling test: all coarser grids are sampled from the same
    # high-resolution trajectory. This separates observation-grid effects from
    # the long-time divergence intrinsic to a chaotic ODE.
    tref, sref = integrate(DT_REFERENCE)
    cref = crossings(tref, sref)
    section_y = cref["interp"][:, 1]
    section_z = cref["interp"][:, 2]
    branch_positive = fit_section_branch(section_y[section_y > 0], section_z[section_y > 0])
    branch_negative = fit_section_branch(section_y[section_y < 0], section_z[section_y < 0])
    branch_combined = fit_section_branch(section_y, section_z)
    controlled: list[dict[str, float | int]] = []
    for dt in DTS:
        stride = int(round(dt / DT_REFERENCE))
        ts = tref[::stride]
        ss = sref[::stride]
        c = crossings(ts, ss)
        raw_abs_x = np.abs(c["raw"][:, 0])
        # Match each coarse event to the nearest reference event in time.
        pos = np.searchsorted(cref["time"], c["time"])
        pos = np.clip(pos, 1, len(cref["time"]) - 1)
        left = pos - 1
        choose_right = np.abs(cref["time"][pos] - c["time"]) < np.abs(cref["time"][left] - c["time"])
        near = np.where(choose_right, pos, left)
        controlled.append({
            "dt": dt,
            "crossings": len(c["time"]),
            "raw_abs_x_mean": float(np.mean(raw_abs_x)),
            "raw_abs_x_p95": float(np.quantile(raw_abs_x, 0.95)),
            "interp_abs_x_max": float(np.max(np.abs(c["interp"][:, 0]))),
            "event_time_mae_vs_reference": float(np.mean(np.abs(c["time"] - cref["time"][near]))),
            "event_z_mae_vs_reference": float(np.mean(np.abs(c["interp"][:, 2] - cref["interp"][near, 2]))),
        })
    dc = np.array([m["dt"] for m in controlled])
    wc = np.array([m["raw_abs_x_p95"] for m in controlled])
    controlled_width_slope = float(np.polyfit(np.log(dc), np.log(wc), 1)[0])
    controlled_csv_path = OUT / "lorenz_gate_controlled_resampling.csv"
    with controlled_csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(controlled[0].keys()))
        writer.writeheader()
        writer.writerows(controlled)

    csv_path = OUT / "lorenz_gate_convergence.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(metrics[0].keys()))
        writer.writeheader()
        writer.writerows(metrics)

    summary = {
        "model": {
            "equations": "Lorenz-63",
            "sigma": SIGMA,
            "rho": RHO,
            "beta": BETA,
            "initial_state": X0.tolist(),
            "integrator": "fixed-step RK4",
            "t_burn": T_BURN,
            "t_end": T_END,
        },
        "event": "strict sign change of x; linear interpolation to x=0",
        "raw_width_scaling_exponent": width_slope,
        "controlled_reference_dt": DT_REFERENCE,
        "controlled_raw_width_scaling_exponent": controlled_width_slope,
        "controlled_resampling_metrics": controlled,
        "poincare_section_power_fit": {
            "model": "z = z0 + a*abs(y)^p at interpolated x=0 crossings",
            "combined": branch_combined,
            "positive_y": branch_positive,
            "negative_y": branch_negative,
            "branch_parameter_max_abs_difference": float(max(
                abs(branch_positive[k] - branch_negative[k]) for k in ("z0", "a", "p")
            )),
        },
        "metrics": metrics,
        "decision": {
            "raw_carrot_width": "sampling-dependent; collapses toward x=0 approximately linearly with dt",
            "crossing_z_distribution": "persistent under step refinement",
            "status": "SECTION_TRACE_SUPPORTED; CONE_OBJECT_NOT_SUPPORTED",
        },
    }
    json_path = OUT / "lorenz_gate_test_results.json"
    json_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    finest = runs[DTS[-1]]
    # For visual clarity, deterministic downsampling of the full cloud.
    cloud = finest["s"][::12]
    raw = finest["raw"]
    sec = finest["interp"]
    z = sec[:, 2]

    plt.rcParams.update({
        "font.family": "DejaVu Sans",
        "font.size": 10,
        "axes.titlesize": 12,
        "axes.labelsize": 10,
    })
    fig = plt.figure(figsize=(14, 10), constrained_layout=True)
    gs = fig.add_gridspec(2, 2)

    ax = fig.add_subplot(gs[0, 0])
    ax.scatter(cloud[:, 0], cloud[:, 2], s=0.3, alpha=0.12, color="#4C78A8", rasterized=True)
    ax.scatter(raw[:, 0], raw[:, 2], s=6, alpha=0.65, color="#E45756", label="raw post-crossing sample")
    ax.axvline(0, color="black", lw=0.8)
    ax.set(title="A · Apparent switch corridor at finite dt", xlabel="x", ylabel="z")
    ax.legend(frameon=False, loc="upper center")

    ax = fig.add_subplot(gs[0, 1])
    for dt in DTS:
        c = runs[dt]
        ax.scatter(c["interp"][:, 1], c["interp"][:, 2], s=5, alpha=0.45, label=f"dt={dt:g}")
    ax.set(title="B · Exact Poincaré section x=0", xlabel="interpolated y", ylabel="interpolated z")
    ax.legend(frameon=False, markerscale=1.5)

    ax = fig.add_subplot(gs[1, 0])
    ax.loglog(dc, wc, "o-", color="#E45756", label="same trajectory: 95% |x|")
    fit = np.exp(np.polyfit(np.log(dc), np.log(wc), 1)[1]) * dc**controlled_width_slope
    ax.loglog(dc, fit, "--", color="black", label=f"fit slope {controlled_width_slope:.3f}")
    ax.set(title="C · The carrot width collapses with timestep", xlabel="integration step dt", ylabel="95th percentile of |x|")
    ax.grid(True, which="both", alpha=0.25)
    ax.legend(frameon=False)

    ax = fig.add_subplot(gs[1, 1])
    ax.scatter(z[:-1], z[1:], s=7, alpha=0.5, color="#54A24B", rasterized=True)
    ax.set(title="D · Return relation on the section", xlabel=r"crossing height $z_n$", ylabel=r"next crossing height $z_{n+1}$")
    ax.grid(True, alpha=0.2)

    fig.suptitle("Lorenz switch gate — sampling artifact versus persistent section structure", fontsize=16)
    fig.text(0.5, 0.005,
             "Canonical Lorenz-63 · σ=10, ρ=28, β=8/3 · RK4 · burn-in 50 · test interval 450",
             ha="center", fontsize=9)
    png_path = OUT / "lorenz_gate_validation.png"
    fig.savefig(png_path, dpi=220, facecolor="white")
    plt.close(fig)

    print(json.dumps({
        "csv": str(csv_path),
        "controlled_csv": str(controlled_csv_path),
        "json": str(json_path),
        "png": str(png_path),
        "width_slope": width_slope,
        "controlled_width_slope": controlled_width_slope,
        "controlled": controlled,
        "section_fit": {
            "combined": branch_combined,
            "positive_y": branch_positive,
            "negative_y": branch_negative,
        },
        "metrics": metrics,
    }, indent=2))


if __name__ == "__main__":
    main()
