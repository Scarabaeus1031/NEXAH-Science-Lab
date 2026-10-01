#!/usr/bin/env python3
"""Frozen dependency-free SOLAR-L63-01 independent replay."""

from __future__ import annotations

import csv
import hashlib
import json
import math
import random
import statistics
import sys
from pathlib import Path


SIGMA = 10.0
RHO = 28.0
BETA = 8.0 / 3.0
T_END = 500.0
T_BURN = 50.0
X0 = (1.0, 1.0, 1.0)
REFERENCE_DT = 0.001
SAMPLE_DTS = (0.02, 0.01, 0.005, 0.0025)
RTOL = 1e-9
ATOL = 1e-11
H_INITIAL = 0.01
H_MAX = 0.02
H_MIN = 1e-8
NULL_DRAWS = 2000
NULL_SEED = 20261001
OUT = Path(__file__).resolve().parent / "outputs"


def rhs(state: tuple[float, float, float]) -> tuple[float, float, float]:
    x, y, z = state
    return (
        SIGMA * (y - x),
        x * (RHO - z) - y,
        x * y - BETA * z,
    )


def combine(base, h, terms):
    return tuple(
        base[j] + h * sum(coef * vec[j] for coef, vec in terms)
        for j in range(3)
    )


def rk4_step(state, dt):
    k1 = rhs(state)
    k2 = rhs(combine(state, dt, ((0.5, k1),)))
    k3 = rhs(combine(state, dt, ((0.5, k2),)))
    k4 = rhs(combine(state, dt, ((1.0, k3),)))
    return combine(state, dt, ((1 / 6, k1), (1 / 3, k2), (1 / 3, k3), (1 / 6, k4)))


def dopri54_step(state, h):
    k1 = rhs(state)
    k2 = rhs(combine(state, h, ((1 / 5, k1),)))
    k3 = rhs(combine(state, h, ((3 / 40, k1), (9 / 40, k2))))
    k4 = rhs(combine(state, h, ((44 / 45, k1), (-56 / 15, k2), (32 / 9, k3))))
    k5 = rhs(combine(state, h, (
        (19372 / 6561, k1), (-25360 / 2187, k2),
        (64448 / 6561, k3), (-212 / 729, k4),
    )))
    k6 = rhs(combine(state, h, (
        (9017 / 3168, k1), (-355 / 33, k2), (46732 / 5247, k3),
        (49 / 176, k4), (-5103 / 18656, k5),
    )))
    fifth = combine(state, h, (
        (35 / 384, k1), (500 / 1113, k3), (125 / 192, k4),
        (-2187 / 6784, k5), (11 / 84, k6),
    ))
    k7 = rhs(fifth)
    fourth = combine(state, h, (
        (5179 / 57600, k1), (7571 / 16695, k3), (393 / 640, k4),
        (-92097 / 339200, k5), (187 / 2100, k6), (1 / 40, k7),
    ))
    scale = tuple(ATOL + RTOL * max(abs(state[j]), abs(fifth[j])) for j in range(3))
    err = math.sqrt(sum(((fifth[j] - fourth[j]) / scale[j]) ** 2 for j in range(3)) / 3)
    return fifth, k1, k7, err


def hermite_state(theta, y0, y1, f0, f1, h):
    t2 = theta * theta
    t3 = t2 * theta
    h00 = 2 * t3 - 3 * t2 + 1
    h10 = t3 - 2 * t2 + theta
    h01 = -2 * t3 + 3 * t2
    h11 = t3 - t2
    return tuple(
        h00 * y0[j] + h10 * h * f0[j] + h01 * y1[j] + h11 * h * f1[j]
        for j in range(3)
    )


def locate_event(t0, y0, t1, y1, f0, f1):
    lo, hi = 0.0, 1.0
    xlo = y0[0]
    h = t1 - t0
    for _ in range(80):
        mid = 0.5 * (lo + hi)
        ym = hermite_state(mid, y0, y1, f0, f1, h)
        if abs(ym[0]) <= 1e-15 or (hi - lo) * h <= 1e-12:
            return t0 + mid * h, ym
        if xlo * ym[0] <= 0:
            hi = mid
        else:
            lo = mid
            xlo = ym[0]
    mid = 0.5 * (lo + hi)
    return t0 + mid * h, hermite_state(mid, y0, y1, f0, f1, h)


def strict_cross(a, b):
    return a != 0.0 and b != 0.0 and a * b < 0.0


def integrate_reference():
    events = []
    state = X0
    t = 0.0
    steps = int(round(T_END / REFERENCE_DT))
    for _ in range(steps):
        nxt = rk4_step(state, REFERENCE_DT)
        t_next = t + REFERENCE_DT
        if t_next >= T_BURN and strict_cross(state[0], nxt[0]):
            alpha = -state[0] / (nxt[0] - state[0])
            event = tuple(state[j] + alpha * (nxt[j] - state[j]) for j in range(3))
            event_t = t + alpha * REFERENCE_DT
            if event_t >= T_BURN:
                events.append((event_t, *event, 1 if nxt[0] > state[0] else -1))
        state, t = nxt, t_next
    return events


def integrate_independent():
    events = []
    segments = []
    state = X0
    t = 0.0
    h = H_INITIAL
    accepted = rejected = 0
    while t < T_END:
        h = min(h, H_MAX, T_END - t)
        if h < H_MIN:
            raise RuntimeError("adaptive step fell below H_MIN")
        nxt, f0, f1, err = dopri54_step(state, h)
        if not all(math.isfinite(v) for v in (*nxt, err)):
            raise RuntimeError("non-finite adaptive state")
        if err <= 1.0:
            t_next = t + h
            segments.append((t, t_next, state, nxt, f0, f1))
            if t_next >= T_BURN and strict_cross(state[0], nxt[0]):
                event_t, event = locate_event(t, state, t_next, nxt, f0, f1)
                if event_t >= T_BURN:
                    events.append((event_t, *event, 1 if nxt[0] > state[0] else -1))
            t, state = t_next, nxt
            accepted += 1
        else:
            rejected += 1
        factor = 5.0 if err == 0.0 else max(0.2, min(5.0, 0.9 * err ** -0.2))
        h = max(H_MIN, min(H_MAX, h * factor))
    return events, segments, accepted, rejected


def sample_segments(segments, dt):
    samples = []
    index = 0
    count = int(round((T_END - T_BURN) / dt))
    for k in range(count + 1):
        target = T_BURN + k * dt
        while index + 1 < len(segments) and segments[index][1] < target:
            index += 1
        t0, t1, y0, y1, f0, f1 = segments[index]
        if not (t0 - 1e-12 <= target <= t1 + 1e-12):
            raise RuntimeError(f"sampling target not bracketed: {target}")
        theta = min(1.0, max(0.0, (target - t0) / (t1 - t0)))
        samples.append(hermite_state(theta, y0, y1, f0, f1, t1 - t0))
    return samples


def quantile(values, q):
    ordered = sorted(values)
    pos = q * (len(ordered) - 1)
    lo = int(math.floor(pos))
    hi = int(math.ceil(pos))
    if lo == hi:
        return ordered[lo]
    return ordered[lo] * (hi - pos) + ordered[hi] * (pos - lo)


def quantile_rmse(a, b):
    qs = [0.01 + i * 0.98 / 198 for i in range(199)]
    return math.sqrt(sum((quantile(a, q) - quantile(b, q)) ** 2 for q in qs) / len(qs))


def correlation(a, b):
    ma, mb = statistics.fmean(a), statistics.fmean(b)
    da = [v - ma for v in a]
    db = [v - mb for v in b]
    denom = math.sqrt(sum(v * v for v in da) * sum(v * v for v in db))
    return sum(x * y for x, y in zip(da, db)) / denom


def slope_loglog(xs, ys):
    lx, ly = [math.log(v) for v in xs], [math.log(v) for v in ys]
    mx, my = statistics.fmean(lx), statistics.fmean(ly)
    return sum((x - mx) * (y - my) for x, y in zip(lx, ly)) / sum((x - mx) ** 2 for x in lx)


def file_sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main():
    OUT.mkdir(exist_ok=True)
    reference = integrate_reference()
    independent, segments, accepted, rejected = integrate_independent()

    ref_y = [row[2] for row in reference]
    ref_z = [row[3] for row in reference]
    ind_y = [row[2] for row in independent]
    ind_z = [row[3] for row in independent]
    raw_rows = []
    for dt in SAMPLE_DTS:
        sampled = sample_segments(segments, dt)
        raw_abs = [abs(sampled[i + 1][0]) for i in range(len(sampled) - 1)
                   if strict_cross(sampled[i][0], sampled[i + 1][0])]
        raw_rows.append({
            "dt": dt,
            "crossings": len(raw_abs),
            "raw_abs_x_mean": statistics.fmean(raw_abs),
            "raw_abs_x_p95": quantile(raw_abs, 0.95),
            "raw_abs_x_max": max(raw_abs),
        })

    width_slope = slope_loglog(
        [row["dt"] for row in raw_rows],
        [row["raw_abs_x_p95"] for row in raw_rows],
    )
    observed_corr = correlation(ind_z[:-1], ind_z[1:])
    rng = random.Random(NULL_SEED)
    successors = ind_z[1:].copy()
    null_abs = []
    for _ in range(NULL_DRAWS):
        rng.shuffle(successors)
        null_abs.append(abs(correlation(ind_z[:-1], successors)))
    null_p99 = quantile(null_abs, 0.99)

    metrics = {
        "schema": "nexah.solar-l63-01.metrics.v1",
        "python": sys.version,
        "parameters": {
            "sigma": SIGMA, "rho": RHO, "beta": BETA,
            "initial_state": X0, "t_burn": T_BURN, "t_end": T_END,
            "reference_dt": REFERENCE_DT,
            "independent_integrator": "Dormand-Prince 5(4)",
            "event_locator": "cubic Hermite plus bracketed bisection",
            "rtol": RTOL, "atol": ATOL, "h_initial": H_INITIAL,
            "h_max": H_MAX, "h_min": H_MIN,
        },
        "reference": {"crossings": len(reference)},
        "independent": {
            "crossings": len(independent),
            "positive_direction": sum(row[4] > 0 for row in independent),
            "negative_direction": sum(row[4] < 0 for row in independent),
            "max_abs_event_x": max(abs(row[1]) for row in independent),
            "accepted_steps": accepted,
            "rejected_steps": rejected,
        },
        "agreement": {
            "relative_crossing_count_difference": abs(len(independent) - len(reference)) / len(reference),
            "y_quantile_rmse_normalized": quantile_rmse(ind_y, ref_y) / statistics.pstdev(ref_y),
            "z_quantile_rmse_normalized": quantile_rmse(ind_z, ref_z) / statistics.pstdev(ref_z),
        },
        "raw_sampling": {"metrics": raw_rows, "width_scaling_exponent": width_slope},
        "return_null": {
            "observed_lag1_correlation": observed_corr,
            "null_abs_correlation_p99": null_p99,
            "draws": NULL_DRAWS,
            "seed": NULL_SEED,
        },
    }
    gates = {
        "G1_reference_reproduction": len(reference) == 247,
        "G2_independent_event_validity": (
            len(independent) >= 200
            and any(row[4] > 0 for row in independent)
            and any(row[4] < 0 for row in independent)
            and metrics["independent"]["max_abs_event_x"] <= 1e-9
        ),
        "G3_cross_integrator_agreement": (
            metrics["agreement"]["relative_crossing_count_difference"] <= 0.15
            and metrics["agreement"]["y_quantile_rmse_normalized"] <= 0.20
            and metrics["agreement"]["z_quantile_rmse_normalized"] <= 0.20
        ),
        "G4_sampling_width_scaling": 0.80 <= width_slope <= 1.20,
        "G5_raw_sampling_negative_control": (
            raw_rows[0]["raw_abs_x_p95"] >= 0.10
            and raw_rows[-1]["raw_abs_x_p95"] < 0.5 * raw_rows[0]["raw_abs_x_p95"]
        ),
        "G6_return_order_null": abs(observed_corr) > null_p99,
    }
    metrics["gates"] = gates
    metrics["decision"] = "PASS_BOUNDED" if all(gates.values()) else "FAIL_BOUNDED"

    crossings_path = OUT / "independent_crossings.csv"
    with crossings_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(("time", "x", "y", "z", "direction"))
        writer.writerows(independent)
    raw_path = OUT / "raw_sampling_metrics.csv"
    with raw_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=tuple(raw_rows[0]))
        writer.writeheader()
        writer.writerows(raw_rows)
    metrics_path = OUT / "metrics.json"
    metrics_path.write_text(json.dumps(metrics, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    print(json.dumps({
        "decision": metrics["decision"],
        "gates": gates,
        "metrics_sha256": file_sha256(metrics_path),
        "independent_crossings": len(independent),
        "reference_crossings": len(reference),
    }, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
