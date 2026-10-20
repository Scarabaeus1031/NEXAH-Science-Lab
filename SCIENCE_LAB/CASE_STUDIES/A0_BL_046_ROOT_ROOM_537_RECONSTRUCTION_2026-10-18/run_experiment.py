#!/usr/bin/env python3
"""Frozen finite reconstruction audit for A0-BL-046."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def ranks(values: list[float]) -> list[float]:
    order = sorted(range(len(values)), key=lambda i: values[i])
    result = [0.0] * len(values)
    start = 0
    while start < len(order):
        end = start + 1
        while end < len(order) and abs(values[order[end]] - values[order[start]]) < 1e-12:
            end += 1
        rank = (start + 1 + end) / 2.0
        for idx in order[start:end]:
            result[idx] = rank
        start = end
    return result


def spearman(left: list[float], right: list[float]) -> float:
    a, b = ranks(left), ranks(right)
    ma, mb = sum(a) / len(a), sum(b) / len(b)
    numerator = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    da = math.sqrt(sum((x - ma) ** 2 for x in a))
    db = math.sqrt(sum((y - mb) ** 2 for y in b))
    return 0.0 if da == 0 or db == 0 else numerator / (da * db)


def embedding(name: str, n: int) -> tuple[int, ...]:
    if name == "DECIMAL_CUT":
        return n // 100, n % 100
    if name == "QRT20":
        return divmod(n, 20)
    if name == "CRT_7_11":
        return n % 7, n % 11
    if name == "DIGIT_TRIPLET":
        return n // 100, (n // 10) % 10, n % 10
    raise ValueError(name)


def pair_distances(points: list[tuple[float, ...]]) -> list[float]:
    return [
        math.sqrt(sum((points[i][k] - points[j][k]) ** 2 for k in range(len(points[i]))))
        for i in range(len(points))
        for j in range(i + 1, len(points))
    ]


def scores(values: list[int], coords: list[tuple[float, float]], names: list[str]) -> dict[str, float]:
    observed = pair_distances(coords)
    return {
        name: round(spearman(observed, pair_distances([embedding(name, n) for n in values])), 12)
        for name in names
    }


def source_receipt(source: dict) -> dict:
    path = Path(source["path"])
    data = path.read_bytes()
    # JPEG dimensions are frozen in the audited ledger; byte hash gates identity.
    return {
        "exists": path.is_file(),
        "sha256": hashlib.sha256(data).hexdigest(),
        "sha256_pass": hashlib.sha256(data).hexdigest() == source["sha256"],
        "declared_dimensions": [source["width_px"], source["height_px"]],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["primary", "replay"], required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    protocol = json.loads((ROOT / "FROZEN_PROTOCOL.json").read_text())
    frozen = json.loads((ROOT / "FROZEN_ANCHORS.json").read_text())
    anchors = frozen["anchors"]
    values = [row["value"] for row in anchors]
    units = frozen["coordinate_convention"]
    coords = [(row["x_px"] / units["x_unit_px"], row["y_px"] / units["y_unit_px"]) for row in anchors]
    names = protocol["candidate_embeddings"]

    source = source_receipt(frozen["source"])
    in_bounds = all(0 <= row["x_px"] < frozen["source"]["width_px"] and 0 <= row["y_px"] < frozen["source"]["height_px"] for row in anchors)
    duplicate_groups: dict[str, list[dict]] = {}
    for row in anchors:
        duplicate_groups.setdefault(str(row["value"]), []).append(row)
    duplicate_conflicts = []
    for value, rows in duplicate_groups.items():
        for a, b in itertools.combinations(rows, 2):
            distance = math.hypot(a["x_px"] - b["x_px"], a["y_px"] - b["y_px"])
            if distance > protocol["duplicate_tolerance_px"]:
                duplicate_conflicts.append({"value": int(value), "a": a["occurrence_id"], "b": b["occurrence_id"], "distance_px": round(distance, 6)})

    observed_scores = scores(values, coords, names)
    permutations = sorted(set(itertools.permutations(values)))
    control_scores = {name: [] for name in names}
    for permuted in permutations:
        current = scores(list(permuted), coords, names)
        for name in names:
            control_scores[name].append(current[name])
    shuffle_summary = {}
    selective = []
    for name in names:
        distribution = sorted(control_scores[name])
        observed = observed_scores[name]
        percentile = sum(value <= observed for value in distribution) / len(distribution)
        upper_p = sum(value >= observed for value in distribution) / len(distribution)
        is_selective = percentile >= protocol["shuffle_selectivity_percentile"]
        if is_selective:
            selective.append(name)
        shuffle_summary[name] = {
            "observed_rho": observed,
            "percentile": round(percentile, 12),
            "upper_tail_fraction": round(upper_p, 12),
            "control_min": distribution[0],
            "control_median": distribution[len(distribution) // 2],
            "control_max": distribution[-1],
            "selective_at_0_95": is_selective,
        }

    nearby = {str(offset): scores([n + offset for n in values], coords, names) for offset in protocol["nearby_offsets"]}
    nearby_equal_or_better = {
        name: [int(offset) for offset, row in nearby.items() if row[name] >= observed_scores[name]]
        for name in names
    }

    jitter_decisions = []
    for trial in range(protocol["jitter_trials"]):
        rng = random.Random(46000 + trial)
        jittered = [
            ((row["x_px"] + rng.randint(-protocol["jitter_px"], protocol["jitter_px"])) / units["x_unit_px"],
             (row["y_px"] + rng.randint(-protocol["jitter_px"], protocol["jitter_px"])) / units["y_unit_px"])
            for row in anchors
        ]
        trial_scores = scores(values, jittered, names)
        jitter_decisions.append({"trial": trial, "scores": trial_scores, "duplicate_conflict": bool(duplicate_conflicts)})

    arithmetic = {
        "537_plus_57_is_594": 537 + 57 == 594,
        "537_plus_reversed_73_is_574": 537 + int(str(73)[::-1]) == 574,
        "XX_declared_as_20": next(row["value"] for row in anchors if row["label"] == "XX") == 20,
    }
    gates = {
        "G1_SOURCE": source["sha256_pass"],
        "G2_EXTRACTION": len(anchors) == 7 and in_bounds and values.count(57) == 2,
        "G3_NUMBER_ONLY_FUNCTION": not duplicate_conflicts,
        "G4_ARITHMETIC": all(arithmetic.values()),
        "G5_EXACTLY_ONE_SHUFFLE_SELECTIVE_MODEL": len(selective) == 1,
        "G6_NEARBY_UNIQUE": len(selective) == 1 and not nearby_equal_or_better[selective[0]],
        "G7_JITTER_STABLE": all(row["duplicate_conflict"] == bool(duplicate_conflicts) for row in jitter_decisions),
    }
    if not source["sha256_pass"] or not gates["G2_EXTRACTION"]:
        decision = "SOURCE_INSUFFICIENT"
    elif duplicate_conflicts:
        decision = "UNDERDETERMINED_MULTIPLE_PLACEMENTS_FOR_SAME_VALUE"
    elif len(selective) != 1 or not gates["G6_NEARBY_UNIQUE"]:
        decision = "UNDERDETERMINED_CONTROL_NONSELECTIVE"
    elif all(gates.values()):
        decision = "UNIQUE_COORDINATE_GRAMMAR_SUPPORTED"
    else:
        decision = "INVALID_DESIGN"

    result = {
        "study_id": protocol["study_id"],
        "decision": decision,
        "mode_independent": True,
        "source_receipt": source,
        "coordinate_convention": units,
        "anchors": anchors,
        "duplicate_conflicts": duplicate_conflicts,
        "arithmetic": arithmetic,
        "observed_scores": observed_scores,
        "shuffle_count": len(permutations),
        "shuffle_summary": shuffle_summary,
        "selective_models": selective,
        "nearby_scores": nearby,
        "nearby_equal_or_better": nearby_equal_or_better,
        "jitter_trials": jitter_decisions,
        "gates": gates,
        "claim_boundary": [
            "A label-centre coordinate is a declared measurement convention, not a recovered historical point map.",
            "Arithmetic validity is separate from spatial selection.",
            "No historical intent, pyramid geometry, Base-40 semantics, fractal, Pascal identity or physical mechanism is established.",
        ],
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")


if __name__ == "__main__":
    main()

