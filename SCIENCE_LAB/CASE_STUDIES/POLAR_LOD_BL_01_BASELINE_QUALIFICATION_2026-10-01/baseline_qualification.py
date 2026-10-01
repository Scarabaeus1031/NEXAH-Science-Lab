#!/usr/bin/env python3
"""Historical baseline qualification for POLAR-LOD-01.

This is not a prospective result runner. It selects and validates comparator
architecture on 2018-2024, then performs a labelled forensic reconstruction
of the already-known 2025 Test-08 holdout.

The function ``iers2010_zonal_tide_effect`` is a renamed Python-derived
implementation of IERS Conventions (2010) RG_ZONT2.F and FUNDARG.F. It is not
distributed or endorsed by the IERS Conventions Center. The argument tables,
coefficients, and fundamental-argument polynomials are transcribed from the
official routines identified in 02_SOURCE_AND_METHOD_BINDING.md. See
IERS_SOFTWARE_LICENSE.txt for the upstream notice.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path

import numpy as np
import pandas as pd


PACKAGE = Path(__file__).resolve().parent
DEFAULT_SOURCE = (
    PACKAGE.parent
    / "Orion_POLAR:Pass Maastricht"
    / "Polar-Janus-Test-08-LOD-Holdout"
    / "test_08_iers_lod_2010_2025.csv"
)
EXPECTED_SOURCE_SHA256 = "5a4df1e393b3feaceb695c636c1a8b363c08a5464f448ba890b678c9cc396996"

ALPHAS = np.array([1e-8, 1e-6, 1e-4, 1e-2, 0.1, 1.0, 10.0, 100.0, 1000.0, 10000.0])
BASE_PERIODS = {
    "year": 365.256363004,
    "half_year": 365.256363004 / 2.0,
}
LUNAR_PERIODS = {
    "moon_sidereal": 27.321661,
    "moon_synodic": 29.530588214,
    "moon_anomalistic": 27.554550,
    "moon_draconic": 27.212221,
    "moon_half_sidereal": 13.6608305,
    "moon_half_synodic": 14.765294107,
}
LAG_BANKS = {
    "L5": (1, 2, 7, 14, 30),
    "L9": (1, 2, 3, 5, 7, 14, 21, 30, 60),
    "L13": (1, 2, 3, 5, 7, 10, 14, 21, 28, 30, 45, 60, 90),
    "L17": (1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 28, 30, 45, 60, 90, 120, 180),
}

# l, l', F, D, Omega multipliers from IERS RG_ZONT2.F, 62 rows.
_NFUND = np.array(
    [
        [1, 0, 2, 2, 2], [2, 0, 2, 0, 1], [2, 0, 2, 0, 2],
        [0, 0, 2, 2, 1], [0, 0, 2, 2, 2], [1, 0, 2, 0, 0],
        [1, 0, 2, 0, 1], [1, 0, 2, 0, 2], [3, 0, 0, 0, 0],
        [-1, 0, 2, 2, 1], [-1, 0, 2, 2, 2], [1, 0, 0, 2, 0],
        [2, 0, 2, -2, 2], [0, 1, 2, 0, 2], [0, 0, 2, 0, 0],
        [0, 0, 2, 0, 1], [0, 0, 2, 0, 2], [2, 0, 0, 0, -1],
        [2, 0, 0, 0, 0], [2, 0, 0, 0, 1], [0, -1, 2, 0, 2],
        [0, 0, 0, 2, -1], [0, 0, 0, 2, 0], [0, 0, 0, 2, 1],
        [0, -1, 0, 2, 0], [1, 0, 2, -2, 1], [1, 0, 2, -2, 2],
        [1, 1, 0, 0, 0], [-1, 0, 2, 0, 0], [-1, 0, 2, 0, 1],
        [-1, 0, 2, 0, 2], [1, 0, 0, 0, -1], [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 1], [0, 0, 0, 1, 0], [1, -1, 0, 0, 0],
        [-1, 0, 0, 2, -1], [-1, 0, 0, 2, 0], [-1, 0, 0, 2, 1],
        [1, 0, -2, 2, -1], [-1, -1, 0, 2, 0], [0, 2, 2, -2, 2],
        [0, 1, 2, -2, 1], [0, 1, 2, -2, 2], [0, 0, 2, -2, 0],
        [0, 0, 2, -2, 1], [0, 0, 2, -2, 2], [0, 2, 0, 0, 0],
        [2, 0, 0, -2, -1], [2, 0, 0, -2, 0], [2, 0, 0, -2, 1],
        [0, -1, 2, -2, 1], [0, 1, 0, 0, -1], [0, -1, 2, -2, 2],
        [0, 1, 0, 0, 0], [0, 1, 0, 0, 1], [1, 0, 0, -1, 0],
        [2, 0, -2, 0, 0], [-2, 0, 2, 0, 1], [-1, 1, 0, 1, 0],
        [0, 0, 0, 0, 2], [0, 0, 0, 0, 1],
    ],
    dtype=float,
)

# DUT sin/cos, DLOD cos/sin, DOMEGA cos/sin coefficients.
_TIDE = np.array(
    [
        [-.0235,0,.2617,0,-.2209,0],[-.0404,0,.3706,0,-.3128,0],[-.0987,0,.9041,0,-.7630,0],
        [-.0508,0,.4499,0,-.3797,0],[-.1231,0,1.0904,0,-.9203,0],[-.0385,0,.2659,0,-.2244,0],
        [-.4108,0,2.8298,0,-2.3884,0],[-.9926,0,6.8291,0,-5.7637,0],[-.0179,0,.1222,0,-.1031,0],
        [-.0818,0,.5384,0,-.4544,0],[-.1974,0,1.2978,0,-1.0953,0],[-.0761,0,.4976,0,-.4200,0],
        [.0216,0,-.1060,0,.0895,0],[.0254,0,-.1211,0,.1022,0],[-.2989,0,1.3804,0,-1.1650,0],
        [-3.1873,.2010,14.6890,.9266,-12.3974,-.7820],[-7.8468,.5320,36.0910,2.4469,-30.4606,-2.0652],
        [.0216,0,-.0988,0,.0834,0],[-.3384,0,1.5433,0,-1.3025,0],[.0179,0,-.0813,0,.0686,0],
        [-.0244,0,.1082,0,-.0913,0],[.0470,0,-.2004,0,.1692,0],[-.7341,0,3.1240,0,-2.6367,0],
        [-.0526,0,.2235,0,-.1886,0],[-.0508,0,.2073,0,-.1749,0],[.0498,0,-.1312,0,.1107,0],
        [.1006,0,-.2640,0,.2228,0],[.0395,0,-.0968,0,.0817,0],[.0470,0,-.1099,0,.0927,0],
        [.1767,0,-.4115,0,.3473,0],[.4352,0,-1.0093,0,.8519,0],[.5339,0,-1.2224,0,1.0317,0],
        [-8.4046,.2500,19.1647,.5701,-16.1749,-.4811],[.5443,0,-1.2360,0,1.0432,0],
        [.0470,0,-.1000,0,.0844,0],[-.0555,0,.1169,0,-.0987,0],[.1175,0,-.2332,0,.1968,0],
        [-1.8236,0,3.6018,0,-3.0399,0],[.1316,0,-.2587,0,.2183,0],[.0179,0,-.0344,0,.0290,0],
        [-.0855,0,.1542,0,-.1302,0],[-.0573,0,.0395,0,-.0333,0],[.0329,0,-.0173,0,.0146,0],
        [-1.8847,0,.9726,0,-.8209,0],[.2510,0,-.0910,0,.0768,0],[1.1703,0,-.4135,0,.3490,0],
        [-49.7174,.4330,17.1056,.1490,-14.4370,-.1257],[-.1936,0,.0666,0,-.0562,0],
        [.0489,0,-.0154,0,.0130,0],[-.5471,0,.1670,0,-.1409,0],[.0367,0,-.0108,0,.0092,0],
        [-.0451,0,.0082,0,-.0069,0],[.0921,0,-.0167,0,.0141,0],[.8281,0,-.1425,0,.1202,0],
        [-15.8887,.1530,2.7332,.0263,-2.3068,-.0222],[-.1382,0,.0225,0,-.0190,0],
        [.0348,0,-.0053,0,.0045,0],[-.1372,0,-.0079,0,.0066,0],[.4211,0,-.0203,0,.0171,0],
        [-.0404,0,.0008,0,-.0007,0],[7.8998,0,.1460,0,-.1232,0],[-1617.2681,0,-14.9471,0,12.6153,0],
    ],
    dtype=float,
)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _fundamental_arguments(t: np.ndarray) -> np.ndarray:
    das2r = 4.848136811095359935899141e-6
    turnas = 1296000.0
    l = np.mod(485868.249036 + t*(1717915923.2178 + t*(31.8792 + t*(.051635 + t*(-.00024470)))), turnas) * das2r
    lp = np.mod(1287104.79305 + t*(129596581.0481 + t*(-.5532 + t*(.000136 + t*(-.00001149)))), turnas) * das2r
    f = np.mod(335779.526232 + t*(1739527262.8478 + t*(-12.7512 + t*(-.001037 + t*(.00000417)))), turnas) * das2r
    d = np.mod(1072260.70369 + t*(1602961601.2090 + t*(-6.3706 + t*(.006593 + t*(-.00003169)))), turnas) * das2r
    om = np.mod(450160.398036 + t*(-6962890.5431 + t*(7.4722 + t*(.007702 + t*(-.00005939)))), turnas) * das2r
    return np.stack([l, lp, f, d, om], axis=-1)


def iers2010_zonal_tide_effect(mjd: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Return IERS 2010 zonal-tide DUT, DLOD, DOMEGA for MJD values."""
    mjd = np.asarray(mjd, dtype=float)
    t = (mjd + 2400000.5 - 2451545.0) / 36525.0
    args = np.mod(_fundamental_arguments(t) @ _NFUND.T, 2.0 * np.pi)
    sin_arg, cos_arg = np.sin(args), np.cos(args)
    dut = (sin_arg * _TIDE[:, 0] + cos_arg * _TIDE[:, 1]).sum(axis=-1) * 1e-4
    dlod = (cos_arg * _TIDE[:, 2] + sin_arg * _TIDE[:, 3]).sum(axis=-1) * 1e-5
    domega = (cos_arg * _TIDE[:, 4] + sin_arg * _TIDE[:, 5]).sum(axis=-1) * 1e-14
    return dut, dlod, domega


def load_source(path: Path) -> pd.DataFrame:
    if sha256(path) != EXPECTED_SOURCE_SHA256:
        raise ValueError("Historical source hash does not match the bound snapshot")
    frame = pd.read_csv(path)
    frame["date"] = pd.to_datetime(frame["date"])
    if frame[["date", "MJD", "LOD"]].isna().any().any():
        raise ValueError("Missing source values")
    if not np.all(np.diff(frame["MJD"].to_numpy()) == 1.0):
        raise ValueError("Source is not a contiguous daily series")
    _, frame["zonal_dlod"], _ = iers2010_zonal_tide_effect(frame["MJD"].to_numpy())
    frame["LOD_residual"] = frame["LOD"] - frame["zonal_dlod"]
    return frame


def with_lags(frame: pd.DataFrame, target: str, lags: tuple[int, ...]) -> pd.DataFrame:
    out = frame.copy()
    for lag in lags:
        out[f"{target}_lag_{lag}"] = out[target].shift(lag)
    return out.dropna().copy()


def design(frame: pd.DataFrame, origin: float, target: str, lags: tuple[int, ...], periods: dict[str, float]) -> np.ndarray:
    t = frame["MJD"].to_numpy() - origin
    cols = [np.ones(len(frame)), t]
    for period in periods.values():
        phase = 2.0 * np.pi * t / period
        cols.extend([np.sin(phase), np.cos(phase)])
    cols.extend(frame[f"{target}_lag_{lag}"].to_numpy() for lag in lags)
    return np.column_stack(cols)


def fit_holdout(frame: pd.DataFrame, target: str, lags: tuple[int, ...], periods: dict[str, float], year: int, add_tide: bool = False) -> dict:
    data = with_lags(frame, target, lags)
    train = data[(data.date >= "2010-01-01") & (data.date <= f"{year-2}-12-31")]
    valid = data[(data.date >= f"{year-1}-01-01") & (data.date <= f"{year-1}-12-31")]
    test = data[(data.date >= f"{year}-01-01") & (data.date <= f"{year}-12-31")]
    if min(len(train), len(valid), len(test)) == 0:
        raise ValueError(f"Empty split for {year}")
    origin = float(train["MJD"].iloc[0])
    x_train = design(train, origin, target, lags, periods)
    x_valid = design(valid, origin, target, lags, periods)
    x_test = design(test, origin, target, lags, periods)
    mean, scale = x_train.mean(axis=0), x_train.std(axis=0)
    mean[0], scale[0] = 0.0, 1.0
    scale[scale < 1e-12] = 1.0
    x_train, x_valid, x_test = ((x - mean) / scale for x in (x_train, x_valid, x_test))
    y_train, y_valid = train[target].to_numpy(), valid[target].to_numpy()
    best = None
    for alpha in ALPHAS:
        penalty = np.eye(x_train.shape[1])
        penalty[0, 0] = 0.0
        beta = np.linalg.solve(x_train.T @ x_train + alpha * penalty, x_train.T @ y_train)
        score = float(np.sqrt(np.mean((x_valid @ beta - y_valid) ** 2)))
        if best is None or score < best[0]:
            best = (score, float(alpha), beta)
    prediction = x_test @ best[2]
    if add_tide:
        prediction = prediction + test["zonal_dlod"].to_numpy()
    observed = test["LOD"].to_numpy()
    error = prediction - observed
    return {
        "year": year,
        "n": len(test),
        "alpha": best[1],
        "rmse_seconds": float(np.sqrt(np.mean(error**2))),
        "mae_seconds": float(np.mean(np.abs(error))),
        "sse": float(np.sum(error**2)),
        "sae": float(np.sum(np.abs(error))),
    }


def pooled(rows: list[dict]) -> dict:
    n = sum(row["n"] for row in rows)
    return {
        "n": n,
        "rmse_seconds": float(np.sqrt(sum(row["sse"] for row in rows) / n)),
        "mae_seconds": float(sum(row["sae"] for row in rows) / n),
    }


def persistence(frame: pd.DataFrame, years: range) -> dict:
    data = frame.copy()
    data["lag_1"] = data["LOD"].shift(1)
    rows = []
    for year in years:
        test = data[(data.date >= f"{year}-01-01") & (data.date <= f"{year}-12-31")].dropna()
        error = test["lag_1"].to_numpy() - test["LOD"].to_numpy()
        rows.append({"year": year, "n": len(test), "sse": float(np.sum(error**2)), "sae": float(np.sum(np.abs(error)))})
    return pooled(rows)


def same_day_mutation_gate(frame: pd.DataFrame, target_date: str, lags: tuple[int, ...]) -> bool:
    base = with_lags(frame, "LOD", lags)
    changed = frame.copy()
    changed.loc[changed.date == target_date, "LOD"] += 1.0
    changed = with_lags(changed, "LOD", lags)
    columns = [f"LOD_lag_{lag}" for lag in lags]
    a = base.loc[base.date == target_date, columns].to_numpy()
    b = changed.loc[changed.date == target_date, columns].to_numpy()
    return bool(a.shape == b.shape == (1, len(lags)) and np.array_equal(a, b))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output-dir", type=Path, default=PACKAGE)
    args = parser.parse_args()
    frame = load_source(args.source)
    years = range(2018, 2025)

    dut, dlod, domega = iers2010_zonal_tide_effect(np.array([54465.0]))
    reference_errors = {
        "dut_seconds": abs(float(dut[0]) - 7.983287678576557467e-2),
        "dlod_seconds": abs(float(dlod[0]) - 5.035331113978199288e-5),
        "domega_rad_per_second": abs(float(domega[0]) - (-4.249711616463017e-14)),
    }

    candidates = {}
    rolling_by_candidate = {}
    for name, lags in LAG_BANKS.items():
        rows = [fit_holdout(frame, "LOD", lags, BASE_PERIODS, year) for year in years]
        candidates[name] = pooled(rows)
        rolling_by_candidate[name] = rows
    selected = min(candidates, key=lambda name: candidates[name]["rmse_seconds"])
    selected_lags = LAG_BANKS[selected]
    b1_rows = rolling_by_candidate[selected]
    b2_rows = [fit_holdout(frame, "LOD_residual", selected_lags, BASE_PERIODS, year, add_tide=True) for year in years]
    b0 = persistence(frame, years)
    b1, b2 = pooled(b1_rows), pooled(b2_rows)

    forensic = {
        "B1_AR17": fit_holdout(frame, "LOD", selected_lags, BASE_PERIODS, 2025),
        "M2_AR17_plus_six_period": fit_holdout(frame, "LOD", selected_lags, BASE_PERIODS | LUNAR_PERIODS, 2025),
        "B2_IERS_ZONT2": fit_holdout(frame, "LOD_residual", selected_lags, BASE_PERIODS, 2025, add_tide=True),
    }
    m2 = forensic["M2_AR17_plus_six_period"]["rmse_seconds"]
    f_b1 = forensic["B1_AR17"]["rmse_seconds"]
    f_b2 = forensic["B2_IERS_ZONT2"]["rmse_seconds"]

    gates = {
        "iers_reference_case": max(reference_errors.values()) <= 1e-15,
        "daily_complete_source": len(frame) == 5844 and frame.date.min().strftime("%Y-%m-%d") == "2010-01-01" and frame.date.max().strftime("%Y-%m-%d") == "2025-12-31",
        "same_day_target_excluded": same_day_mutation_gate(frame, "2024-06-01", selected_lags),
        "b1_beats_persistence": b1["rmse_seconds"] < b0["rmse_seconds"],
        "b1_beats_historical_l5": b1["rmse_seconds"] < candidates["L5"]["rmse_seconds"],
        "b2_beats_b1": b2["rmse_seconds"] < b1["rmse_seconds"],
    }
    status = "BASELINE_READY" if all(gates.values()) else "BASELINE_NOT_READY"

    result = {
        "id": "POLAR-LOD-BL-01",
        "date": "2026-10-01",
        "status": status,
        "classification": "historical method-development audit; no prospective result",
        "source": {
            "path": str(args.source),
            "sha256": sha256(args.source),
            "rows": len(frame),
            "start": frame.date.min().strftime("%Y-%m-%d"),
            "end": frame.date.max().strftime("%Y-%m-%d"),
        },
        "upstream": {
            "RG_ZONT2_F_sha256": "5aab78a0bb47f3ccb363a707b9aa6db8433aacd73038d5e15b631c592bcb9b0f",
            "FUNDARG_F_sha256": "18263cbb1289e222e6ee6e59d52beb343eb77a63ed3212e4f05a4c85d475ae78",
            "reference_case_absolute_errors": reference_errors,
        },
        "development_years": list(years),
        "candidate_architectures": candidates,
        "selected_architecture": selected,
        "selected_lags_days": list(selected_lags),
        "development_comparators": {"B0_persistence": b0, "B1_selected": b1, "B2_IERS_ZONT2": b2},
        "b2_vs_b1_rmse_improvement_pct": 100.0 * (b1["rmse_seconds"] - b2["rmse_seconds"]) / b1["rmse_seconds"],
        "forensic_2025": forensic,
        "forensic_2025_m2_vs_b1_rmse_improvement_pct": 100.0 * (f_b1 - m2) / f_b1,
        "forensic_2025_m2_vs_b2_rmse_difference_pct": 100.0 * (m2 - f_b2) / f_b2,
        "gates": gates,
        "boundary": "Closes readiness gate R4 only; no result registration or prospective execution authority.",
    }

    args.output_dir.mkdir(parents=True, exist_ok=True)
    (args.output_dir / "qualification_results.json").write_text(json.dumps(result, indent=2) + "\n")
    with (args.output_dir / "rolling_baseline_metrics.csv").open("w", newline="") as handle:
        fields = ["year", "model", "n", "alpha", "rmse_seconds", "mae_seconds"]
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        for model, rows in (("B1_AR17", b1_rows), ("B2_IERS_ZONT2", b2_rows)):
            for row in rows:
                writer.writerow({key: row[key] if key in row else model for key in fields})
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
