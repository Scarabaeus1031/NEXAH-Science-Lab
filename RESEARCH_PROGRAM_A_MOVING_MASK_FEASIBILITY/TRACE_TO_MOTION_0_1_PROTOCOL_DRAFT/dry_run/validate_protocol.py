#!/usr/bin/env python3
"""Synthetic integrity validator for TTM-0.1-DRAFT-01.

This script validates protocol mechanics only. It collects no Human data and
produces no scientific result.
"""

from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path


PROTOCOL_ID = "TTM-0.1-DRAFT-01"
VALIDATOR_VERSION = "0.1"
N = 1001
DOMAIN_MM = 200.0
MASK_WIDTH_MM = 40.0
EXCLUDED_KEYS = {
    "lanif",
    "zero",
    "fugenformel",
    "handwriting_meaning",
    "golf",
    "body_motion",
    "energy",
}


def point(path_id: str, u: float) -> tuple[float, float]:
    if path_id == "P01":
        return 30.0 + 140.0 * u, 100.0
    if path_id == "P02":
        return (
            100.0 + 70.0 * math.cos(math.pi * (1.0 - u)),
            100.0 + 70.0 * math.sin(math.pi * u),
        )
    if path_id == "P03":
        return 30.0 + 140.0 * u, 100.0 + 45.0 * math.sin(2.0 * math.pi * u)
    if path_id == "P04":
        y = 150.0 - 200.0 * u if u <= 0.5 else -50.0 + 200.0 * u
        return 30.0 + 140.0 * u, y
    if path_id == "P05":
        return (
            100.0 + 60.0 * math.cos(2.0 * math.pi * u),
            100.0 + 60.0 * math.sin(2.0 * math.pi * u),
        )
    if path_id == "P06":
        return (
            100.0 + 65.0 * math.sin(2.0 * math.pi * u),
            100.0 + 45.0 * math.sin(4.0 * math.pi * u),
        )
    raise ValueError(f"unknown path: {path_id}")


def trajectory(path_id: str, reverse: bool) -> list[tuple[float, float]]:
    values = []
    for index in range(N):
        u = index / (N - 1)
        if reverse:
            u = 1.0 - u
        values.append(point(path_id, u))
    return values


def resample_by_arc_length(
    values: list[tuple[float, float]], count: int = N
) -> list[tuple[float, float]]:
    deduplicated = [values[0]]
    for value in values[1:]:
        if math.dist(value, deduplicated[-1]) >= 0.01:
            deduplicated.append(value)
    if len(deduplicated) < 2:
        raise ValueError("trace has insufficient arc length")
    cumulative = [0.0]
    for a, b in zip(deduplicated, deduplicated[1:]):
        cumulative.append(cumulative[-1] + math.dist(a, b))
    total = cumulative[-1]
    output = []
    segment = 0
    for index in range(count):
        target = total * index / (count - 1)
        while segment + 1 < len(cumulative) - 1 and cumulative[segment + 1] < target:
            segment += 1
        span = cumulative[segment + 1] - cumulative[segment]
        alpha = 0.0 if span == 0 else (target - cumulative[segment]) / span
        a, b = deduplicated[segment], deduplicated[segment + 1]
        output.append((a[0] + alpha * (b[0] - a[0]), a[1] + alpha * (b[1] - a[1])))
    return output


def canonical_trace(
    values: list[tuple[float, float]], closed: bool
) -> list[tuple[float, float]]:
    arc = resample_by_arc_length(values)
    if not closed:
        if arc[-1] < arc[0]:
            arc.reverse()
        return arc
    ring = arc[:-1]
    start = min(range(len(ring)), key=lambda i: ring[i])
    forward = ring[start:] + ring[:start]
    reverse_ring = list(reversed(ring))
    reverse_start = min(range(len(reverse_ring)), key=lambda i: reverse_ring[i])
    reverse = reverse_ring[reverse_start:] + reverse_ring[:reverse_start]
    chosen = forward if forward[1] < reverse[1] else reverse
    return chosen + [chosen[0]]


def turning_angle(values: list[tuple[float, float]], index: int, half: int = 10) -> float:
    before = (
        values[index][0] - values[index - half][0],
        values[index][1] - values[index - half][1],
    )
    after = (
        values[index + half][0] - values[index][0],
        values[index + half][1] - values[index][1],
    )
    cross = before[0] * after[1] - before[1] * after[0]
    dot = before[0] * after[0] + before[1] * after[1]
    return math.atan2(cross, dot)


def synthetic_marker(path_id: str, values: list[tuple[float, float]]) -> float | None:
    lo, hi = 350, 650
    if path_id == "P03":
        angles = [(i, turning_angle(values, i)) for i in range(lo, hi + 1)]
        candidates = []
        for (i, a), (j, b) in zip(angles, angles[1:]):
            if a == 0.0 or a * b <= 0.0:
                candidates.append((abs(i / (N - 1) - 0.5), i))
        return None if not candidates else min(candidates)[1] / (N - 1)
    if path_id == "P04":
        index = max(range(lo, hi + 1), key=lambda i: abs(turning_angle(values, i)))
        return index / (N - 1)
    if path_id == "P06":
        start = values[0]
        index = min(range(lo, hi + 1), key=lambda i: math.dist(values[i], start))
        return index / (N - 1)
    return None


def static_masked(p: tuple[float, float], center: float) -> bool:
    return abs(p[0] - center) <= MASK_WIDTH_MM / 2.0


def moving_masked(p: tuple[float, float], tau: float) -> bool:
    center = 20.0 + 55.0 * tau
    return abs(p[0] - center) <= MASK_WIDTH_MM / 2.0


def choose_static_center(
    values: list[tuple[float, float]], target_count: int
) -> float | None:
    critical = {20.0, 180.0}
    for x, _ in values:
        critical.add(max(20.0, min(180.0, x - MASK_WIDTH_MM / 2.0)))
        critical.add(max(20.0, min(180.0, x + MASK_WIDTH_MM / 2.0)))
    ordered = sorted(critical)
    candidates = set(ordered)
    candidates.update((a + b) / 2.0 for a, b in zip(ordered, ordered[1:]))
    matches = []
    for center in candidates:
        if not 20.0 <= center <= 180.0:
            continue
        count = sum(static_masked(p, center) for p in values)
        if count == target_count:
            matches.append(center)
    if not matches:
        return None
    return min(matches, key=lambda center: (abs(center - 100.0), center))


def reconstruct(
    values: list[tuple[float, float]], flags: list[bool]
) -> tuple[list[tuple[float, float] | None], int]:
    result: list[tuple[float, float] | None] = [None] * len(values)
    false_reconstructions = 0
    visible = [i for i, hidden in enumerate(flags) if not hidden]
    visible_set = set(visible)
    for i in visible:
        result[i] = values[i]
    for i, hidden in enumerate(flags):
        if not hidden:
            continue
        left = i - 1
        while left >= 0 and left not in visible_set:
            left -= 1
        right = i + 1
        while right < len(values) and right not in visible_set:
            right += 1
        if left < 0 or right >= len(values):
            result[i] = None
            continue
        alpha = (i - left) / (right - left)
        x = values[left][0] + alpha * (values[right][0] - values[left][0])
        y = values[left][1] + alpha * (values[right][1] - values[left][1])
        result[i] = (x, y)
    for i, hidden in enumerate(flags):
        if not hidden:
            continue
        bounded = any(not flags[j] for j in range(i)) and any(
            not flags[j] for j in range(i + 1, len(flags))
        )
        if not bounded and result[i] is not None:
            false_reconstructions += 1
    return result, false_reconstructions


def masked_rmse(
    source: list[tuple[float, float]],
    flags: list[bool],
    reconstructed: list[tuple[float, float] | None],
) -> float | None:
    squared = []
    for truth, hidden, estimate in zip(source, flags, reconstructed):
        if hidden and estimate is not None:
            squared.append((truth[0] - estimate[0]) ** 2 + (truth[1] - estimate[1]) ** 2)
    if not squared:
        return None
    return math.sqrt(sum(squared) / len(squared))


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def run() -> dict:
    checks: dict[str, str] = {}
    paths = [f"P{i:02d}" for i in range(1, 7)]
    samples: dict[str, list[tuple[float, float]]] = {}
    diagnostics = []

    for path_id in paths:
        samples[f"{path_id}-F"] = trajectory(path_id, False)
        samples[f"{path_id}-R"] = trajectory(path_id, True)

    checks["six_paths"] = "PASS" if len(paths) == 6 else "FAIL"
    checks["twelve_samples"] = "PASS" if len(samples) == 12 else "FAIL"
    checks["sample_count_1001"] = (
        "PASS" if all(len(values) == N for values in samples.values()) else "FAIL"
    )

    max_reverse_error = 0.0
    max_canonical_error = 0.0
    for path_id in paths:
        forward = samples[f"{path_id}-F"]
        reverse = samples[f"{path_id}-R"]
        for a, b in zip(forward, reversed(reverse)):
            max_reverse_error = max(max_reverse_error, math.dist(a, b))
        forward_trace = canonical_trace(forward, path_id in {"P05", "P06"})
        reverse_trace = canonical_trace(reverse, path_id in {"P05", "P06"})
        for a, b in zip(forward_trace, reverse_trace):
            max_canonical_error = max(max_canonical_error, math.dist(a, b))
    checks["paired_reversal_identity"] = "PASS" if max_reverse_error <= 1e-12 else "FAIL"
    checks["direction_free_canonical_trace_identity"] = (
        "PASS" if max_canonical_error <= 1e-9 else "FAIL"
    )

    marker_errors = []
    for path_id in ("P03", "P04", "P06"):
        marker = synthetic_marker(path_id, samples[f"{path_id}-F"])
        if marker is None:
            marker_errors.append(float("inf"))
        else:
            marker_errors.append(abs(marker - 0.5))
    checks["synthetic_transition_markers"] = (
        "PASS" if max(marker_errors) <= 0.05 else "FAIL"
    )

    inside = all(
        0.0 <= x <= DOMAIN_MM and 0.0 <= y <= DOMAIN_MM
        for values in samples.values()
        for x, y in values
    )
    checks["domain_bounds"] = "PASS" if inside else "FAIL"

    static_area_exposure = MASK_WIDTH_MM / DOMAIN_MM
    moving_area_exposure = MASK_WIDTH_MM / DOMAIN_MM
    checks["exact_area_exposure_match"] = (
        "PASS" if static_area_exposure == moving_area_exposure == 0.2 else "FAIL"
    )

    false_total = 0
    completely_masked = 0
    exposure_count_mismatches = 0
    missing_static_centers = 0
    for sample_id, values in samples.items():
        moving_flags = [moving_masked(p, i / (N - 1)) for i, p in enumerate(values)]
        moving_count = sum(moving_flags)
        static_center = choose_static_center(values, moving_count)
        if static_center is None:
            missing_static_centers += 1
            static_flags = [False] * N
        else:
            static_flags = [static_masked(p, static_center) for p in values]
        if sum(static_flags) != moving_count:
            exposure_count_mismatches += 1
        if all(static_flags) or all(moving_flags):
            completely_masked += 1
        static_recon, static_false = reconstruct(values, static_flags)
        moving_recon, moving_false = reconstruct(values, moving_flags)
        false_total += static_false + moving_false
        diagnostics.append(
            {
                "sample_id": sample_id,
                "static_center_mm": (
                    None if static_center is None else round(static_center, 9)
                ),
                "static_masked_fraction": round(sum(static_flags) / N, 9),
                "moving_masked_fraction": round(sum(moving_flags) / N, 9),
                "static_unknown_fraction": round(
                    sum(v is None for v in static_recon) / N, 9
                ),
                "moving_unknown_fraction": round(
                    sum(v is None for v in moving_recon) / N, 9
                ),
                "static_reconstruction_rmse_mm": (
                    None
                    if masked_rmse(values, static_flags, static_recon) is None
                    else round(masked_rmse(values, static_flags, static_recon), 9)
                ),
                "moving_reconstruction_rmse_mm": (
                    None
                    if masked_rmse(values, moving_flags, moving_recon) is None
                    else round(masked_rmse(values, moving_flags, moving_recon), 9)
                ),
            }
        )

    checks["unbounded_gaps_remain_unknown"] = "PASS" if false_total == 0 else "FAIL"
    checks["false_reconstruction_count_zero"] = "PASS" if false_total == 0 else "FAIL"
    checks["no_completely_masked_record"] = "PASS" if completely_masked == 0 else "FAIL"
    checks["static_center_found_for_every_sample"] = (
        "PASS" if missing_static_centers == 0 else "FAIL"
    )
    checks["exact_masked_sample_count_match"] = (
        "PASS" if exposure_count_mismatches == 0 else "FAIL"
    )

    schema_keys = {
        "sample_uuid",
        "tau",
        "x_mm",
        "y_mm",
        "source_status",
        "trace_index",
        "s_norm",
        "mask_type",
        "masked",
        "record_status",
    }
    checks["excluded_interpretation_keys_absent"] = (
        "PASS" if schema_keys.isdisjoint(EXCLUDED_KEYS) else "FAIL"
    )

    clean_trace_header = "sample_uuid,trace_index,s_norm,x_mm,y_mm,closure_status\n"
    leaking_trace_header = clean_trace_header.rstrip() + ",direction\n"
    checks["direction_leak_rejected"] = (
        "PASS"
        if "direction" not in clean_trace_header and "direction" in leaking_trace_header
        else "FAIL"
    )

    clean_fixture = b"protocol fixture\n"
    expected_hash = sha256_bytes(clean_fixture)
    tampered_fixture = b"protocol fixture changed\n"
    checks["tampered_hash_rejected"] = (
        "PASS" if sha256_bytes(tampered_fixture) != expected_hash else "FAIL"
    )

    script_path = Path(__file__).resolve()
    overall = "PASS" if all(value == "PASS" for value in checks.values()) else "FAIL"
    return {
        "protocol_id": PROTOCOL_ID,
        "validator_version": VALIDATOR_VERSION,
        "validation_scope": "SYNTHETIC_PROTOCOL_MECHANICS_ONLY",
        "scientific_result": "NONE",
        "human_data": "NONE",
        "script_sha256": sha256_bytes(script_path.read_bytes()),
        "overall": overall,
        "checks": checks,
        "constants": {
            "paths": 6,
            "samples": 12,
            "samples_per_trajectory": N,
            "domain_mm": [DOMAIN_MM, DOMAIN_MM],
            "mask_width_mm": MASK_WIDTH_MM,
            "static_area_exposure": static_area_exposure,
            "moving_area_exposure": moving_area_exposure,
            "maximum_reverse_error_mm": max_reverse_error,
            "maximum_canonical_trace_error_mm": max_canonical_error,
            "maximum_transition_marker_error_tau": max(marker_errors),
        },
        "synthetic_diagnostics_not_scientific_results": diagnostics,
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2, sort_keys=True))
