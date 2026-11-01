#!/usr/bin/env python3
import json
import math
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROTOCOL = json.loads((ROOT / "FROZEN_PROTOCOL.json").read_text(encoding="utf-8"))


def require(condition, message):
    if not condition:
        raise SystemExit("FAIL: " + message)


def logistic(t, center, width):
    return 1.0 / (1.0 + math.exp((t - center) / width))


def carrier(t, center, width):
    s = PROTOCOL["signal"]
    return (1.0 + s["drift_linear"] * t + s["drift_quadratic"] * t * t
            + logistic(t, center, width) * (
                s["envelope_amplitude"] * math.exp((t - s["envelope_center"]) / s["envelope_scale"])
                + s["sine_amplitude"] * math.sin(s["omega"] * t)))


def event(center, width, dt=0.02):
    s = PROTOCOL["signal"]
    n = int(round((s["t_max"] - s["t_min"]) / dt)) + 1
    times = [s["t_min"] + i * dt for i in range(n)]
    values = [carrier(t, center, width) for t in times]
    lo, hi = PROTOCOL["event_window"]
    best = None
    for i in range(1, n - 1):
        if not lo <= times[i] <= hi:
            continue
        first = (values[i + 1] - values[i - 1]) / (2.0 * dt)
        second = (values[i + 1] - 2.0 * values[i] + values[i - 1]) / (dt * dt)
        curvature = abs(second) / ((1.0 + first * first) ** 1.5)
        candidate = (curvature, -times[i])
        if best is None or candidate > best[0]:
            best = (candidate, times[i], curvature)
    return best[1], best[2]


def slope(xs, ys):
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)


data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
require(data["schema"] == "nexah.a0-bl-058.result.v1", "schema")
require(data["study_id"] == "A0-BL-058", "study id")
require(PROTOCOL["boundary"]["kind"] == "logistic_only", "smooth-only contract")
rows = []
for width in PROTOCOL["boundary"]["widths"]:
    for center in PROTOCOL["boundary"]["centers"]:
        t_star, peak = event(center, width)
        rows.append((center, width, t_star, peak))
reported = {(row["center"], row["width"]): row for row in data["boundary_variants"]}
for center, width, t_star, peak in rows:
    row = reported[(center, width)]
    require(abs(row["t_star"] - t_star) <= 1e-12, f"t* mismatch {center}/{width}")
    require(abs(row["curvature_peak"] - peak) <= 1e-12, f"peak mismatch {center}/{width}")
slopes = []
for width in PROTOCOL["boundary"]["widths"]:
    selected = [row for row in rows if row[1] == width]
    slopes.append(slope([row[0] for row in selected], [row[2] for row in selected]))
ordered = sorted(slopes)
median = (ordered[1] + ordered[2]) / 2.0
span = max(row[2] for row in rows) - min(row[2] for row in rows)
require(abs(data["metrics"]["boundary_median_tracking_slope"] - median) <= 1e-12, "median slope")
require(abs(data["metrics"]["boundary_t_star_span"] - span) <= 1e-12, "event span")
threshold = PROTOCOL["thresholds"]
boundary = median >= threshold["boundary_tracking_slope_min"]
persistent = span <= threshold["carrier_persistence_t_span_max"]
if boundary and not persistent:
    expected = "BOUNDARY_LOCKED_SMOOTH_EVENT"
elif persistent and not boundary:
    expected = "CARRIER_PERSISTENT_EVENT"
elif boundary and persistent:
    expected = "MIXED_BOUNDARY_AND_CARRIER_PERSISTENCE"
elif not data["gates"]["G4_sampling_stability"] or not data["gates"]["G5_fourier_stability"]:
    expected = "REPRESENTATION_SENSITIVE_EVENT"
else:
    expected = "INDETERMINATE_EVENT_ORIGIN"
require(data["classification"] == expected, "classification")
require(data["metrics"]["max_alpha_beta_reciprocal_error"] <= 1e-12, "reciprocal readout")
require("no physical breath" in data["claim_boundary"], "claim boundary")
print("PASS: independent structural verification")
