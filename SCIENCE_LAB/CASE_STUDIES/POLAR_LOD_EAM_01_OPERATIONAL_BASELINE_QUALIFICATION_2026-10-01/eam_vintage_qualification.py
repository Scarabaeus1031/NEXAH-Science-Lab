#!/usr/bin/env python3
"""Qualify the GFZ ESMGFZ 90-day EAM product as POLAR-LOD B3.

This is a historical source-vintage and method qualification. It downloads
the already-known 2025 daily forecast vintages, records their hashes, rejects
physically invalid files without repair, and evaluates the declared
EAM-to-LOD transformation. It does not access prospective POLAR-LOD outcomes
or authorize the future confirmatory run.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import importlib.util
import json
import math
import platform
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime, timedelta
from importlib.metadata import version as package_version
from pathlib import Path
from urllib.request import urlopen

import numpy as np


PACKAGE = Path(__file__).resolve().parent
SCIENCE_CASES = PACKAGE.parent
BASELINE_RUNNER = (
    SCIENCE_CASES
    / "POLAR_LOD_BL_01_BASELINE_QUALIFICATION_2026-10-01"
    / "baseline_qualification.py"
)
DEFAULT_SOURCE = (
    SCIENCE_CASES
    / "Orion_POLAR:Pass Maastricht"
    / "Polar-Janus-Test-08-LOD-Holdout"
    / "test_08_iers_lod_2010_2025.csv"
)
BASE_URL = "https://rz-vm480.gfz.de/files/ESMGFZ/EAM/archive_90d_prediction"
INDEX_URL = BASE_URL + "/"
YEAR = 2025
HORIZONS = (1, 3, 7, 30)
FROZEN_EVALUATION_START = date(YEAR, 1, 1)
FROZEN_EVALUATION_END = date(YEAR, 12, 31)
NOMINAL_DAY_SECONDS = 86400.0
PHYSICAL_ABS_LIMIT = 1e-3
GRID_STEP_DAYS = 0.125
EXPECTED_ROWS = 1448
EXPECTED_LEDGER = PACKAGE / "EXPECTED_RAW_VINTAGE_LEDGER.csv"
EXECUTION_LOCK = PACKAGE / "EXECUTION_LOCK.json"
TRUST_ROOT = PACKAGE / "SEALED_REPLAY_TRUST_ROOT.json"
RUNTIME_LOCK = PACKAGE / "requirements-macos-arm64.lock"
RUNTIME_ENVIRONMENT = PACKAGE / "RUNTIME_ENVIRONMENT.json"
CANONICAL_TRUST_ROOT_SHA256 = "e5bc9fe7e7918ed1470f3ed77bd958edc2eee8466ac652e853f67647547d47b2"
M6_BOOTSTRAP_REPLICATES = 20_000
M6_BLOCK_LENGTH = 30
M6_SEED = 20261001
M6_MINIMUM_PAIRED = 180
M6_ALPHA = 0.05


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def require_sha256(path: Path, expected: str, label: str) -> None:
    actual = sha256(path)
    if actual != expected:
        raise RuntimeError(f"{label} SHA-256 mismatch: expected {expected}, got {actual}")


def load_expected_ledger(path: Path) -> dict[str, dict[str, str]]:
    with path.open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    required = {"filename", "url", "sha256", "bytes"}
    if not rows or not required.issubset(rows[0]):
        raise RuntimeError("Expected raw-vintage ledger lacks required columns")
    by_name = {row["filename"]: row for row in rows}
    expected_names = {filename_for(doy) for doy in range(1, 366)}
    if len(rows) != 365 or len(by_name) != 365 or set(by_name) != expected_names:
        raise RuntimeError("Expected raw-vintage ledger must bind exactly 365 unique 2025 files")
    for name, row in by_name.items():
        if row["url"] != f"{BASE_URL}/{name}":
            raise RuntimeError(f"Unexpected provider URL in expected ledger: {name}")
        if not re.fullmatch(r"[0-9a-f]{64}", row["sha256"]):
            raise RuntimeError(f"Invalid SHA-256 in expected ledger: {name}")
        if int(row["bytes"]) <= 0:
            raise RuntimeError(f"Invalid byte count in expected ledger: {name}")
    return by_name


def verify_canonical_trust_root(path: Path = TRUST_ROOT) -> dict:
    if path.resolve() != TRUST_ROOT.resolve():
        raise RuntimeError("Custom trust-root paths cannot produce a sealed replay")
    require_sha256(path, CANONICAL_TRUST_ROOT_SHA256, "canonical trust root")
    root = json.loads(path.read_text())
    if root.get("id") != "POLAR-LOD-EAM-01-SEALED-ROOT-04":
        raise RuntimeError("Unexpected sealed trust-root identity")
    bound = {
        "execution_lock": EXECUTION_LOCK,
        "expected_raw_vintage_ledger": EXPECTED_LEDGER,
        "runtime_dependency_lock": RUNTIME_LOCK,
        "runtime_environment": RUNTIME_ENVIRONMENT,
    }
    files = root.get("files", {})
    if set(files) != set(bound):
        raise RuntimeError("Trust root does not contain the exact canonical file set")
    for label, file_path in bound.items():
        if not file_path.is_file():
            raise RuntimeError(f"Trust-root file missing: {label}: {file_path}")
        require_sha256(file_path, files[label]["sha256"], label)
    return root


def verify_execution_lock(source: Path) -> dict:
    lock = json.loads(EXECUTION_LOCK.read_text())
    if lock.get("id") != "POLAR-LOD-EAM-01-REPAIR-LOCK-04":
        raise RuntimeError("Unexpected execution-lock identity")
    files = lock.get("files", {})
    bound = {
        "baseline_runner": BASELINE_RUNNER,
        "baseline_manifest": BASELINE_RUNNER.parent / "SHA256_MANIFEST.txt",
        "historical_source": source.resolve(),
        "expected_raw_vintage_ledger": EXPECTED_LEDGER.resolve(),
        "repair_contract": PACKAGE / "04_REPAIR_AND_PREOUTPUT_LOCK.md",
        "prospective_protocol": SCIENCE_CASES
        / "POLAR_LOD_01_PROSPECTIVE_VALIDATION_2026-10-01"
        / "02_STRONG_BASELINE_AND_PROSPECTIVE_PROTOCOL.md",
        "runtime_dependency_lock": RUNTIME_LOCK,
        "runtime_environment": RUNTIME_ENVIRONMENT,
    }
    if set(files) != set(bound):
        raise RuntimeError("Execution lock does not contain the exact required file set")
    for label, file_path in bound.items():
        if not file_path.is_file():
            raise RuntimeError(f"Bound file missing: {label}: {file_path}")
        require_sha256(file_path, files[label]["sha256"], label)
    runtime = lock.get("runtime", {})
    actual_runtime = {
        "python": platform.python_version(),
        "numpy": np.__version__,
        "pandas": package_version("pandas"),
        "python-dateutil": package_version("python-dateutil"),
        "pytz": package_version("pytz"),
        "six": package_version("six"),
        "tzdata": package_version("tzdata"),
    }
    if runtime != actual_runtime:
        raise RuntimeError(
            f"Runtime mismatch: expected {runtime}, got {actual_runtime}; "
            f"executable={sys.executable}"
        )
    runtime_receipt = json.loads(RUNTIME_ENVIRONMENT.read_text())
    require_sha256(
        Path(sys.executable).resolve(),
        runtime_receipt["python"]["binary_sha256"],
        "runtime interpreter binary",
    )
    return lock


def load_baseline_module():
    spec = importlib.util.spec_from_file_location("polar_lod_baseline", BASELINE_RUNNER)
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load bound baseline runner")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def filename_for(doy: int) -> str:
    return f"ESMGFZ_EAM-90d_03h_{YEAR}_{doy:03d}F.asc"


def fetch_one(
    cache: Path,
    doy: int,
    mode: str,
    expected: dict[str, dict[str, str]],
) -> tuple[int, Path]:
    name = filename_for(doy)
    path = cache / name
    if not path.exists():
        if mode == "replay":
            raise RuntimeError(f"Sealed replay cache is missing {name}")
        with urlopen(f"{BASE_URL}/{name}", timeout=60) as response:
            path.write_bytes(response.read())
    if mode == "replay":
        row = expected[name]
        if path.stat().st_size != int(row["bytes"]):
            raise RuntimeError(f"Raw-vintage byte-count mismatch: {name}")
        require_sha256(path, row["sha256"], f"raw vintage {name}")
    return doy, path


def fetch_all(
    cache: Path,
    workers: int,
    mode: str,
    expected: dict[str, dict[str, str]],
) -> list[Path]:
    cache.mkdir(parents=True, exist_ok=True)
    paths: dict[int, Path] = {}
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {
            executor.submit(fetch_one, cache, doy, mode, expected): doy
            for doy in range(1, 366)
        }
        for future in as_completed(futures):
            doy, path = future.result()
            paths[doy] = path
    return [paths[doy] for doy in range(1, 366)]


def parse_vintage(path: Path) -> dict:
    text = path.read_text()
    issue_match = re.search(r"Issue date\s*:\s*(\d{4}-\d{2}-\d{2})", text)
    records_match = re.search(r"Number of data records\s*:\s*(\d+)", text)
    if issue_match is None or records_match is None:
        raise ValueError(f"Missing header fields in {path.name}")
    issue = date.fromisoformat(issue_match.group(1))
    raw_rows = []
    invalid_reasons = []
    for line in text.splitlines():
        fields = line.split()
        if not fields:
            continue
        try:
            mjd = float(fields[0])
        except ValueError:
            continue
        # The provider header contains the postal address "14473 Potsdam".
        # Only plausible modern-EOP MJDs begin a data row.
        if mjd < 40000.0:
            continue
        if len(fields) != 5:
            invalid_reasons.append("DATA_ROW_FIELD_COUNT_NOT_5")
            continue
        try:
            xyz = tuple(float(value) for value in fields[1:4])
        except ValueError:
            invalid_reasons.append("NON_NUMERIC_EXCITATION")
            continue
        state = fields[4]
        raw_rows.append((mjd, xyz, state))

    if not raw_rows:
        invalid_reasons.append("NO_DATA_ROWS")
    if any(not math.isfinite(mjd) or not all(map(math.isfinite, xyz)) for mjd, xyz, _ in raw_rows):
        invalid_reasons.append("NON_FINITE_VALUE")
    if any(max(map(abs, xyz)) > PHYSICAL_ABS_LIMIT for _, xyz, _ in raw_rows):
        invalid_reasons.append("EXCITATION_ABS_GT_1E_MINUS_3")
    if any(state not in {"C", "P"} for _, _, state in raw_rows):
        invalid_reasons.append("UNKNOWN_STATE")

    mjds = [mjd for mjd, _, _ in raw_rows]
    if len(set(mjds)) != len(mjds):
        invalid_reasons.append("DUPLICATE_MJD")
    if any(right <= left for left, right in zip(mjds, mjds[1:])):
        invalid_reasons.append("NON_MONOTONIC_MJD")
    if any(abs((right - left) - GRID_STEP_DAYS) > 1e-9 for left, right in zip(mjds, mjds[1:])):
        invalid_reasons.append("GRID_STEP_NOT_0_125_DAY")
    if len(raw_rows) == EXPECTED_ROWS and abs((mjds[-1] - mjds[0]) - ((EXPECTED_ROWS - 1) * GRID_STEP_DAYS)) > 1e-9:
        invalid_reasons.append("GRID_COVERAGE_MISMATCH")
    if len(raw_rows) != EXPECTED_ROWS:
        invalid_reasons.append("EXPECTED_1448_ACTUAL_RECORDS")

    states = [state for _, _, state in raw_rows]
    c = [mjd for mjd, _, state in raw_rows if state == "C"]
    p = [mjd for mjd, _, state in raw_rows if state == "P"]
    if not c or not p:
        invalid_reasons.append("MISSING_C_OR_P_STATE")
    elif states != (["C"] * len(c) + ["P"] * len(p)):
        invalid_reasons.append("NON_CONTIGUOUS_C_TO_P_TRANSITION")

    first_p_mjd = min(p) if p else None
    issue_mjd = mjd_for(issue)
    boundary_offset = first_p_mjd - issue_mjd if first_p_mjd is not None else None
    if boundary_offset not in {0.0, -1.0}:
        invalid_reasons.append("ISSUE_DATE_P_BOUNDARY_CONFLICT")

    rows = {mjd: (xyz, state) for mjd, xyz, state in raw_rows}
    # Every audited 2025 file declares 1440 records but contains 1448 unique
    # 3-hour rows: 181 inclusive days times eight. Preserve both values in the
    # ledger and reject only a departure from the observed complete structure.
    return {
        "text": text,
        "issue": issue,
        "records": rows,
        "declared_records": int(records_match.group(1)),
        "raw_records": len(raw_rows),
        "actual_records": len(rows),
        "last_c_mjd": max(c) if c else None,
        "first_p_mjd": first_p_mjd,
        "prediction_boundary_offset_days": boundary_offset,
        "invalid_reason": ";".join(dict.fromkeys(invalid_reasons)),
    }


def mjd_for(day: date) -> float:
    return float((day - date(1858, 11, 17)).days)


def metrics(errors: np.ndarray) -> dict:
    if len(errors) == 0:
        raise ValueError("Metrics require at least one paired error")
    return {
        "n": int(len(errors)),
        "rmse_seconds": float(np.sqrt(np.mean(errors**2))),
        "mae_seconds": float(np.mean(np.abs(errors))),
    }


def predict_2025(baseline, frame, target: str, periods: dict[str, float], add_tide: bool):
    lags = baseline.LAG_BANKS["L17"]
    data = baseline.with_lags(frame, target, lags)
    train = data[(data.date >= "2010-01-01") & (data.date <= "2023-12-31")]
    valid = data[(data.date >= "2024-01-01") & (data.date <= "2024-12-31")]
    test = data[(data.date >= "2025-01-01") & (data.date <= "2025-12-31")]
    origin = float(train["MJD"].iloc[0])
    matrices = [baseline.design(part, origin, target, lags, periods) for part in (train, valid, test)]
    mean, scale = matrices[0].mean(axis=0), matrices[0].std(axis=0)
    mean[0], scale[0] = 0.0, 1.0
    scale[scale < 1e-12] = 1.0
    x_train, x_valid, x_test = ((matrix - mean) / scale for matrix in matrices)
    y_train, y_valid = train[target].to_numpy(), valid[target].to_numpy()
    best = None
    for alpha in baseline.ALPHAS:
        penalty = np.eye(x_train.shape[1])
        penalty[0, 0] = 0.0
        beta = np.linalg.solve(x_train.T @ x_train + alpha * penalty, x_train.T @ y_train)
        score = float(np.sqrt(np.mean((x_valid @ beta - y_valid) ** 2)))
        if best is None or score < best[0]:
            best = (score, float(alpha), beta)
    prediction = x_test @ best[2]
    if add_tide:
        prediction = prediction + test["zonal_dlod"].to_numpy()
    return {
        float(mjd): float(value)
        for mjd, value in zip(test["MJD"].to_numpy(), prediction)
    }


def predict_direct_horizon_2025(
    baseline,
    frame,
    target: str,
    periods: dict[str, float],
    horizon: int,
) -> dict[float, float]:
    """Fit a direct h-day model using only values available by target-h."""
    lags = baseline.LAG_BANKS["L17"]
    data = frame.copy()
    for lag in lags:
        # For target T and horizon h, lag 1 is the latest value known at T-h.
        data[f"{target}_lag_{lag}"] = data[target].shift(direct_lag_offset(horizon, lag))
    data = data.dropna().copy()
    train = data[(data.date >= "2010-01-01") & (data.date <= "2023-12-31")]
    valid = data[(data.date >= "2024-01-01") & (data.date <= "2024-12-31")]
    test = data[(data.date >= "2025-01-01") & (data.date <= "2025-12-31")]
    origin = float(train["MJD"].iloc[0])
    matrices = [baseline.design(part, origin, target, lags, periods) for part in (train, valid, test)]
    mean, scale = matrices[0].mean(axis=0), matrices[0].std(axis=0)
    mean[0], scale[0] = 0.0, 1.0
    scale[scale < 1e-12] = 1.0
    x_train, x_valid, x_test = ((matrix - mean) / scale for matrix in matrices)
    y_train, y_valid = train[target].to_numpy(), valid[target].to_numpy()
    best = None
    for alpha in baseline.ALPHAS:
        penalty = np.eye(x_train.shape[1])
        penalty[0, 0] = 0.0
        beta = np.linalg.solve(x_train.T @ x_train + alpha * penalty, x_train.T @ y_train)
        score = float(np.sqrt(np.mean((x_valid @ beta - y_valid) ** 2)))
        if best is None or score < best[0]:
            best = (score, float(alpha), beta)
    prediction = x_test @ best[2]
    return {
        float(mjd): float(value)
        for mjd, value in zip(test["MJD"].to_numpy(), prediction)
    }


def direct_lag_offset(horizon: int, lag: int) -> int:
    if horizon not in HORIZONS or lag < 1:
        raise ValueError("Direct-horizon lag requires a frozen horizon and positive lag")
    return horizon + lag - 1


def circular_block_bootstrap(
    improvements: np.ndarray,
    replicates: int = M6_BOOTSTRAP_REPLICATES,
    block_length: int = M6_BLOCK_LENGTH,
    seed: int = M6_SEED,
) -> dict[str, float]:
    """One-sided circular moving-block inference for mean improvement."""
    values = np.asarray(improvements, dtype=float)
    if values.ndim != 1 or len(values) == 0 or not np.isfinite(values).all():
        raise ValueError("Bootstrap requires a finite non-empty one-dimensional sample")
    if replicates <= 0 or block_length <= 0:
        raise ValueError("Bootstrap replicates and block length must be positive")
    rng = np.random.default_rng(seed)
    blocks = math.ceil(len(values) / block_length)
    offsets = np.arange(block_length)
    means = np.empty(replicates, dtype=float)
    chunk = 500
    for start in range(0, replicates, chunk):
        count = min(chunk, replicates - start)
        block_starts = rng.integers(0, len(values), size=(count, blocks))
        indices = (block_starts[..., None] + offsets) % len(values)
        samples = values[indices.reshape(count, -1)[:, : len(values)]]
        means[start : start + count] = samples.mean(axis=1)
    return {
        "mean_squared_error_improvement_seconds_squared": float(values.mean()),
        "one_sided_95pct_lower_bound": float(np.quantile(means, M6_ALPHA)),
        "one_sided_bootstrap_p_value": float(
            (1 + np.count_nonzero((means - values.mean()) >= values.mean()))
            / (replicates + 1)
        ),
    }


def holm_rejections(p_values: dict[int, float], alpha: float = M6_ALPHA) -> dict[int, bool]:
    ordered = sorted(p_values, key=lambda horizon: (p_values[horizon], horizon))
    rejected = {horizon: False for horizon in p_values}
    for index, horizon in enumerate(ordered):
        threshold = alpha / (len(ordered) - index)
        if p_values[horizon] <= threshold:
            rejected[horizon] = True
        else:
            break
    return rejected


def evaluate_operational_relevance(
    b3_rows: list[dict],
    m2_by_horizon: dict[int, dict[float, float]],
    observed: dict[float, float],
    expected_targets_by_horizon: dict[int, set[float]],
    custody_available: bool,
    minimum_paired: int = M6_MINIMUM_PAIRED,
    replicates: int = M6_BOOTSTRAP_REPLICATES,
) -> dict:
    """Evaluate the frozen four-horizon M6 rule without altering primary status."""
    diagnostics = {}
    p_values = {}
    assessable = bool(custody_available)
    domain_violations = []
    seen_b3_pairs = set()
    for row in b3_rows:
        horizon = int(row["horizon_days"])
        target = float(row["target_mjd"])
        pair = (horizon, target)
        if horizon not in HORIZONS:
            domain_violations.append(
                {"reason": "UNDECLARED_B3_HORIZON", "horizon_days": horizon, "target_mjd": target}
            )
        if pair in seen_b3_pairs:
            domain_violations.append(
                {"reason": "DUPLICATE_B3_HORIZON_TARGET", "horizon_days": horizon, "target_mjd": target}
            )
        seen_b3_pairs.add(pair)
    for horizon in sorted(set(m2_by_horizon) - set(HORIZONS)):
        domain_violations.append({"reason": "UNDECLARED_M2_HORIZON", "horizon_days": horizon})
    for horizon in sorted(set(expected_targets_by_horizon) - set(HORIZONS)):
        domain_violations.append({"reason": "UNDECLARED_EXPECTED_HORIZON", "horizon_days": horizon})
    for horizon in HORIZONS:
        if horizon not in m2_by_horizon:
            domain_violations.append({"reason": "MISSING_M2_HORIZON", "horizon_days": horizon})
        if horizon not in expected_targets_by_horizon:
            domain_violations.append({"reason": "MISSING_EXPECTED_HORIZON", "horizon_days": horizon})
    if domain_violations:
        assessable = False
    for horizon in HORIZONS:
        expected = set(expected_targets_by_horizon.get(horizon, set()))
        rows = [row for row in b3_rows if int(row["horizon_days"]) == horizon]
        b3 = {float(row["target_mjd"]): float(row["predicted_lod_seconds"]) for row in rows}
        m2 = m2_by_horizon.get(horizon, {})
        dates = sorted(expected & set(b3) & set(m2) & set(observed))
        missing_sets = {
            "expected_without_b3": expected - set(b3),
            "expected_without_m2": expected - set(m2),
            "expected_without_observed": expected - set(observed),
            "unexpected_b3_outside_frozen_population": set(b3) - expected,
            "unexpected_m2_outside_frozen_population": set(m2) - expected,
        }
        missing = {
            reason: {
                "count": len(mjds),
                "target_mjds": sorted(mjds),
            }
            for reason, mjds in missing_sets.items()
        }
        incomplete_expected_population = any(
            missing_sets[reason]
            for reason in (
                "expected_without_b3",
                "expected_without_m2",
                "expected_without_observed",
                "unexpected_b3_outside_frozen_population",
                "unexpected_m2_outside_frozen_population",
            )
        )
        if not expected or len(dates) < minimum_paired or incomplete_expected_population:
            assessable = False
        if not dates:
            diagnostics[str(horizon)] = {"paired_n": 0, "missing_before_scoring": missing}
            continue
        m2_errors = np.array([m2[mjd] - observed[mjd] for mjd in dates])
        b3_errors = np.array([b3[mjd] - observed[mjd] for mjd in dates])
        inference = circular_block_bootstrap(
            b3_errors**2 - m2_errors**2,
            replicates=replicates,
            seed=M6_SEED,
        )
        m2_metrics, b3_metrics = metrics(m2_errors), metrics(b3_errors)
        improvement = (b3_metrics["rmse_seconds"] - m2_metrics["rmse_seconds"]) / b3_metrics["rmse_seconds"]
        p_values[horizon] = inference["one_sided_bootstrap_p_value"]
        diagnostics[str(horizon)] = {
            "paired_n": len(dates),
            "missing_before_scoring": missing,
            "m2": m2_metrics,
            "b3": b3_metrics,
            "m2_rmse_improvement_fraction_b3_denominator": float(improvement),
            **inference,
        }
    holm = holm_rejections(p_values) if len(p_values) == len(HORIZONS) else {}
    for horizon in HORIZONS:
        if str(horizon) in diagnostics:
            diagnostics[str(horizon)]["holm_rejects_null"] = holm.get(horizon, False)
    supported = assessable and all(
        diagnostics[str(horizon)]["m2_rmse_improvement_fraction_b3_denominator"] >= 0.05
        and diagnostics[str(horizon)]["m2"]["mae_seconds"] < diagnostics[str(horizon)]["b3"]["mae_seconds"]
        and diagnostics[str(horizon)]["one_sided_95pct_lower_bound"] > 0.0
        and diagnostics[str(horizon)]["holm_rejects_null"]
        for horizon in HORIZONS
    )
    if not assessable:
        annotation = "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE"
    elif supported:
        annotation = "OPERATIONAL_RELEVANCE_SUPPORTED"
    else:
        annotation = "OPERATIONAL_RELEVANCE_NOT_SUPPORTED"
    return {
        "annotation": annotation,
        "custody_available": bool(custody_available),
        "minimum_paired_per_horizon": minimum_paired,
        "bootstrap_replicates": replicates,
        "block_length_days": M6_BLOCK_LENGTH,
        "base_seed": M6_SEED,
        "holm_familywise_alpha": M6_ALPHA,
        "input_domain_violations": domain_violations,
        "horizons": diagnostics,
    }


def write_csv(path: Path, fieldnames: list[str], rows: list[dict]) -> None:
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--cache-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, default=PACKAGE)
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--mode", choices=("replay", "acquisition"), default="replay")
    args = parser.parse_args()

    expected = {}
    execution_lock = None
    trust_root = None
    if args.mode == "replay":
        trust_root = verify_canonical_trust_root()
        expected = load_expected_ledger(EXPECTED_LEDGER)
        execution_lock = verify_execution_lock(args.source)
    baseline = load_baseline_module()
    frame = baseline.load_source(args.source)
    observed = {float(row.MJD): float(row.LOD) for row in frame.itertuples()}
    tide = {
        float(mjd): float(value)
        for mjd, value in zip(
            frame["MJD"].to_numpy(),
            frame["zonal_dlod"].to_numpy(),
        )
    }
    paths = fetch_all(args.cache_dir, args.workers, args.mode, expected)
    ledger_rows = []
    vintages = []
    prediction_rows = []
    invalid_files = []

    for doy, path in enumerate(paths, start=1):
        parsed = parse_vintage(path)
        label_date = date(YEAR, 1, 1) + timedelta(days=doy - 1)
        issue_delta = (label_date - parsed["issue"]).days
        invalid_reason = parsed["invalid_reason"]
        file_hash = sha256(path)
        ledger_row = {
            "filename": path.name,
            "url": f"{BASE_URL}/{path.name}",
            "sha256": file_hash,
            "bytes": path.stat().st_size,
            "label_date": label_date.isoformat(),
            "issue_date": parsed["issue"].isoformat(),
            "issue_before_label_days": issue_delta,
            "declared_records": parsed["declared_records"],
            "raw_records": parsed["raw_records"],
            "actual_records": parsed["actual_records"],
            "last_c_mjd": parsed["last_c_mjd"],
            "first_p_mjd": parsed["first_p_mjd"],
            "prediction_boundary_offset_days": parsed["prediction_boundary_offset_days"],
            "selected_for_issue": "NO",
            "invalid_reason": invalid_reason,
        }
        ledger_rows.append(ledger_row)
        vintage = {
            "doy": doy,
            "path": path,
            "parsed": parsed,
            "label_date": label_date,
            "issue_delta": issue_delta,
            "sha256": file_hash,
            "invalid_reason": invalid_reason,
            "ledger_row": ledger_row,
        }
        vintages.append(vintage)
        if invalid_reason:
            invalid_files.append(path.name)
    # GFZ's archive contains a short April backfill in which several labelled
    # files share one Issue Date. Treat Issue Date as forecast origin and select
    # exactly one structurally valid vintage per origin. Prefer the label closest
    # to the issue date, then the later label. No values are repaired or blended.
    by_issue = {}
    for vintage in vintages:
        if not vintage["invalid_reason"]:
            by_issue.setdefault(vintage["parsed"]["issue"], []).append(vintage)
    selected = []
    for group in by_issue.values():
        chosen = min(group, key=lambda item: (abs(item["issue_delta"]), -item["doy"]))
        chosen["ledger_row"]["selected_for_issue"] = "YES"
        selected.append(chosen)
    selected.sort(key=lambda item: item["parsed"]["issue"])

    for vintage in selected:
        path = vintage["path"]
        parsed = vintage["parsed"]
        file_hash = vintage["sha256"]
        origin_mjd = mjd_for(parsed["issue"])
        for horizon in HORIZONS:
            target_mjd = origin_mjd + horizon
            if target_mjd not in observed or target_mjd not in parsed["records"]:
                continue
            xyz, state = parsed["records"][target_mjd]
            predicted = NOMINAL_DAY_SECONDS * xyz[2] + tide[target_mjd]
            error = predicted - observed[target_mjd]
            prediction_rows.append(
                {
                    "filename": path.name,
                    "sha256": file_hash,
                    "issue_date": parsed["issue"].isoformat(),
                    "horizon_days": horizon,
                    "target_mjd": target_mjd,
                    "target_state": state,
                    "predicted_lod_seconds": predicted,
                    "observed_lod_seconds": observed[target_mjd],
                    "error_seconds": error,
                }
            )

    horizon_metrics = {}
    for horizon in HORIZONS:
        rows = [row for row in prediction_rows if row["horizon_days"] == horizon]
        horizon_metrics[str(horizon)] = metrics(np.array([row["error_seconds"] for row in rows]))

    b1 = predict_2025(baseline, frame, "LOD", baseline.BASE_PERIODS, False)
    m2 = predict_2025(
        baseline,
        frame,
        "LOD",
        baseline.BASE_PERIODS | baseline.LUNAR_PERIODS,
        False,
    )
    b2 = predict_2025(baseline, frame, "LOD_residual", baseline.BASE_PERIODS, True)
    h1 = [row for row in prediction_rows if row["horizon_days"] == 1]
    paired_mjds = [float(row["target_mjd"]) for row in h1]
    b3_map = {float(row["target_mjd"]): float(row["predicted_lod_seconds"]) for row in h1}
    paired = {}
    for name, predictions in (("B1_AR17", b1), ("M2_AR17_plus_six_period", m2), ("B2_IERS_ZONT2", b2), ("B3_GFZ_EAM90_ZONT2", b3_map)):
        errors = np.array([predictions[mjd] - observed[mjd] for mjd in paired_mjds])
        paired[name] = metrics(errors)
    m2_rmse = paired["M2_AR17_plus_six_period"]["rmse_seconds"]
    b3_rmse = paired["B3_GFZ_EAM90_ZONT2"]["rmse_seconds"]
    m2_horizons = {
        horizon: predict_direct_horizon_2025(
            baseline,
            frame,
            "LOD",
            baseline.BASE_PERIODS | baseline.LUNAR_PERIODS,
            horizon,
        )
        for horizon in HORIZONS
    }
    operational_relevance = evaluate_operational_relevance(
        prediction_rows,
        m2_horizons,
        observed,
        {
            horizon: {
                mjd_for(vintage["parsed"]["issue"]) + horizon
                for vintage in selected
                if FROZEN_EVALUATION_START
                <= vintage["parsed"]["issue"] + timedelta(days=horizon)
                <= FROZEN_EVALUATION_END
            }
            for horizon in HORIZONS
        },
        custody_available=False,
    )

    first = parse_vintage(paths[0])
    sanity_errors = []
    for mjd, (xyz, state) in first["records"].items():
        if state == "C" and mjd.is_integer() and mjd in observed:
            sanity_errors.append(NOMINAL_DAY_SECONDS * xyz[2] + tide[mjd] - observed[mjd])
    sanity = metrics(np.array(sanity_errors))

    integrity_gates = {
        "execution_lock_verified": args.mode == "replay" and execution_lock is not None,
        "canonical_external_trust_root_verified": args.mode == "replay" and trust_root is not None,
        "all_365_expected_raw_vintages_hash_verified": args.mode == "replay" and len(paths) == 365,
        "external_code_data_and_runtime_bound": args.mode == "replay" and execution_lock is not None,
        "parser_enforces_finite_unique_ordered_exact_grid_allowed_states_single_transition": True,
        "359_admissible_and_six_declared_rejections": sum(not item["invalid_reason"] for item in vintages) == 359,
        "systematic_header_defect_bound": all(
            row["declared_records"] == 1440
            and (row["actual_records"] == 1448 or row["invalid_reason"] != "")
            for row in ledger_rows
        ),
        "corrupt_and_boundary_conflict_vintages_rejected_not_repaired": invalid_files
        == [filename_for(doy) for doy in range(108, 114)],
        "one_vintage_selected_per_issue_date": len(selected) == len(by_issue),
        "all_admitted_targets_are_prediction_state": all(row["target_state"] == "P" for row in prediction_rows),
        "historical_utc_availability_limit_declared": True,
    }
    retrospective_criteria = {
        "at_least_90_pct_calendar_coverage": len(selected) / 365.0 >= 0.90,
        "conversion_sanity_rmse_below_0_05_ms": sanity["rmse_seconds"] < 0.00005,
        "paired_h1_population_at_least_340": len(paired_mjds) >= 340,
        "b3_beats_m2_on_paired_h1_forensic_window": b3_rmse < m2_rmse,
    }
    if args.mode == "acquisition":
        status = "UNSEALED_ACQUISITION_CANDIDATE_NOT_QUALIFICATION"
    elif all(integrity_gates.values()):
        status = "HISTORICAL_METHOD_REPLAY_VERIFIED_WITH_UTC_CUSTODY_LIMIT"
    else:
        status = "HISTORICAL_METHOD_REPLAY_REJECTED"
    result = {
        "id": "POLAR-LOD-EAM-01",
        "date": "2026-10-01",
        "status": status,
        "classification": "source-labelled forecast-state retrospective; no prospective result",
        "execution_mode": args.mode,
        "sealed_trust_root_sha256": sha256(TRUST_ROOT) if trust_root is not None else None,
        "execution_lock_sha256": sha256(EXECUTION_LOCK) if execution_lock is not None else None,
        "expected_raw_vintage_ledger_sha256": sha256(EXPECTED_LEDGER) if expected else None,
        "runtime": {
            "python": platform.python_version(),
            "numpy": np.__version__,
            "pandas": package_version("pandas"),
            "python-dateutil": package_version("python-dateutil"),
            "pytz": package_version("pytz"),
            "six": package_version("six"),
            "tzdata": package_version("tzdata"),
        },
        "source": {
            "provider": "GFZ ESMGFZ",
            "product": "daily archived EAM 90-day prediction",
            "base_url": BASE_URL,
            "index_url": INDEX_URL,
            "vintages_requested": 365,
            "vintages_structurally_valid": sum(not item["invalid_reason"] for item in vintages),
            "forecast_issue_dates_admitted": len(selected),
            "invalid_vintages": invalid_files,
            "raw_files_redistributed": False,
            "historical_utc_availability_proven": False,
            "availability_classification": "SOURCE_LABELLED_FORECAST_STATE_RETROSPECTIVE",
        },
        "transformation": "LOD_hat(t+h) = 86400 * EAM90_x3(issue,t+h) + IERS_RG_ZONT2_DLOD(t+h)",
        "horizon_metrics": horizon_metrics,
        "paired_h1_forensic_2025": paired,
        "b3_rmse_lower_than_m2_pct_m2_denominator": 100.0 * (m2_rmse - b3_rmse) / m2_rmse,
        "m2_rmse_higher_than_b3_pct_b3_denominator": 100.0 * (m2_rmse - b3_rmse) / b3_rmse,
        "conversion_sanity": sanity,
        "historical_m6_diagnostic_not_prospective_evidence": operational_relevance,
        "integrity_gates": integrity_gates,
        "retrospective_qualification_criteria_not_preregistered_evidence": retrospective_criteria,
        "operational_lock_ready": False,
        "prospective_execution_authority": False,
        "boundary": "Verifies the repaired historical replay under an enforced input/dependency lock while preserving the UTC availability limit; it does not authorize prospective execution or create a Research Result.",
    }
    args.output_dir.mkdir(parents=True, exist_ok=True)
    write_csv(
        args.output_dir / "gfz_2025_vintage_ledger.csv",
        ["filename", "url", "sha256", "bytes", "label_date", "issue_date", "issue_before_label_days", "declared_records", "raw_records", "actual_records", "last_c_mjd", "first_p_mjd", "prediction_boundary_offset_days", "selected_for_issue", "invalid_reason"],
        ledger_rows,
    )
    write_csv(
        args.output_dir / "b3_2025_predictions.csv",
        ["filename", "sha256", "issue_date", "horizon_days", "target_mjd", "target_state", "predicted_lod_seconds", "observed_lod_seconds", "error_seconds"],
        prediction_rows,
    )
    write_csv(
        args.output_dir / "b3_historical_metrics.csv",
        ["horizon_days", "n", "rmse_seconds", "mae_seconds"],
        [
            {"horizon_days": int(horizon), **values}
            for horizon, values in sorted(horizon_metrics.items(), key=lambda item: int(item[0]))
        ],
    )
    (args.output_dir / "qualification_results.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
