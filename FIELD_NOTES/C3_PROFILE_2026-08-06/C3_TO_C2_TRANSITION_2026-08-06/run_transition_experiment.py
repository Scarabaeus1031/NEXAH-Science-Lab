#!/usr/bin/env python3
"""Bounded C3 -> C2 transition experiment for the static v39 field.

All conditions share starts, noise records, integrator, horizon and outcome
criteria.  Controllers are additive to the unnormalised v39 combined field so
that free dynamics and control effort remain separately observable.
"""

from __future__ import annotations

import csv
import hashlib
import json
import math
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np


CLUSTERS = {
    "C0": np.array([10.0, 25.0]),
    "C1": np.array([12.0, 24.0]),
    "C2": np.array([13.5, 26.0]),
    "C3": np.array([11.0, 28.5]),
}

BASE_SEED = 20260806
DT = 0.02
HORIZON = 25.0
STEPS = int(HORIZON / DT)
NOISE_SIGMA = 0.01
EVALUATION_RADII = (0.0, 0.2, 0.4, 0.6)
ANGLES_PER_NONZERO_RADIUS = 8
NOISE_SEEDS = tuple(range(8))

ENTRY_RADIUS = 0.40
DWELL_RADIUS = 0.45
DWELL_TIME = 1.0
DWELL_STEPS = int(DWELL_TIME / DT)
RELAPSE_RADIUS = 0.80
RELAPSE_TIME = 0.50
RELAPSE_STEPS = int(RELAPSE_TIME / DT)
DOMAIN_BOUNDS = ((4.0, 20.0), (18.0, 34.0))

CAPTURE_BIAS = 0.35
HOOK_RADIUS = 1.6
HOOK_STRENGTH = 1.15
LOCK_GAIN = 1.2
LOCK_MAX_NORM = 1.5

CONDITIONS = (
    "free_field",
    "minimal_control",
    "capture_hook_lock_off",
    "capture_hook_lock_on",
)


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


def capture_hook_field(x, y, target):
    p = np.array([x, y], dtype=float)
    r = p - target
    d = np.linalg.norm(r) + 1e-9
    inward = -r / d
    tangential = np.array([r[1], -r[0]]) / d
    gate = np.exp(-(d**2) / (2 * HOOK_RADIUS**2))
    tang_weight = HOOK_STRENGTH * gate
    in_weight = 0.9 * HOOK_STRENGTH * gate * (1.2 + 0.8 * np.exp(-d))
    return tang_weight * tangential + in_weight * inward


def cap_norm(vector, max_norm):
    norm = np.linalg.norm(vector)
    if norm <= max_norm or norm < 1e-12:
        return vector
    return vector * (max_norm / norm)


def capture_control(x):
    target = CLUSTERS["C2"]
    return CAPTURE_BIAS * (target - x) + capture_hook_field(x[0], x[1], target)


def lock_control(x):
    return cap_norm(LOCK_GAIN * (CLUSTERS["C2"] - x), LOCK_MAX_NORM)


def nearest_cluster(point):
    return min(CLUSTERS, key=lambda label: np.linalg.norm(point - CLUSTERS[label]))


def in_domain(point):
    return (
        DOMAIN_BOUNDS[0][0] <= point[0] <= DOMAIN_BOUNDS[0][1]
        and DOMAIN_BOUNDS[1][0] <= point[1] <= DOMAIN_BOUNDS[1][1]
    )


def evaluation_offsets():
    rows = [(0, 0.0, None, np.zeros(2))]
    offset_id = 1
    for radius in EVALUATION_RADII[1:]:
        for angle_index in range(ANGLES_PER_NONZERO_RADIUS):
            angle = 2 * np.pi * angle_index / ANGLES_PER_NONZERO_RADIUS
            offset = radius * np.array([np.cos(angle), np.sin(angle)])
            rows.append((offset_id, radius, angle, offset))
            offset_id += 1
    return rows


def calibration_offsets():
    rows = [np.zeros(2)]
    for radius in (0.3, 0.6):
        for angle_index in range(6):
            angle = 2 * np.pi * angle_index / 6
            rows.append(radius * np.array([np.cos(angle), np.sin(angle)]))
    return rows


def noise_record(noise_seed, offset_id):
    sequence = np.random.SeedSequence([BASE_SEED, noise_seed, offset_id])
    rng = np.random.default_rng(sequence)
    return rng.standard_normal((STEPS, 2))


def control_action(condition, x, step, first_entry_step, minimal_parameters):
    if condition == "free_field":
        return np.zeros(2)
    if condition == "minimal_control":
        if step * DT < minimal_parameters["duration"]:
            direction = CLUSTERS["C2"] - CLUSTERS["C3"]
            direction = direction / np.linalg.norm(direction)
            return minimal_parameters["amplitude"] * direction
        return np.zeros(2)
    if condition == "capture_hook_lock_off":
        return capture_control(x) if first_entry_step is None else np.zeros(2)
    if condition == "capture_hook_lock_on":
        return capture_control(x) if first_entry_step is None else lock_control(x)
    raise ValueError(f"Unknown condition: {condition}")


def simulate(condition, start, noise, minimal_parameters):
    x = np.array(start, dtype=float)
    first_entry_step = None
    dwell_run = 0
    success_step = None
    relapse_run = 0
    relapse = False
    control_cost_l2 = 0.0
    control_effort_l1 = 0.0
    path_length = 0.0
    min_distance_to_c2 = float(np.linalg.norm(x - CLUSTERS["C2"]))
    status = "TIMEOUT"
    steps_completed = 0

    for step in range(STEPS):
        u = control_action(condition, x, step, first_entry_step, minimal_parameters)
        field = combined_field(x[0], x[1])
        next_x = x + DT * (field + u) + NOISE_SIGMA * math.sqrt(DT) * noise[step]
        steps_completed = step + 1

        control_cost_l2 += float(np.dot(u, u)) * DT
        control_effort_l1 += float(np.linalg.norm(u)) * DT
        path_length += float(np.linalg.norm(next_x - x))
        x = next_x

        if not np.all(np.isfinite(x)):
            status = "NUMERIC_FAILURE"
            break
        if not in_domain(x):
            status = "OUT_OF_DOMAIN"
            break

        distance = float(np.linalg.norm(x - CLUSTERS["C2"]))
        min_distance_to_c2 = min(min_distance_to_c2, distance)
        if first_entry_step is None and distance <= ENTRY_RADIUS:
            first_entry_step = step + 1

        if distance <= DWELL_RADIUS:
            dwell_run += 1
        else:
            dwell_run = 0

        if success_step is None and dwell_run >= DWELL_STEPS:
            success_step = step + 2 - DWELL_STEPS
            status = "SUCCESS"

        if success_step is not None:
            if distance > RELAPSE_RADIUS:
                relapse_run += 1
            else:
                relapse_run = 0
            if relapse_run >= RELAPSE_STEPS:
                relapse = True

    if status == "TIMEOUT" and success_step is not None:
        status = "SUCCESS"

    return {
        "status": status,
        "success": status == "SUCCESS",
        "transition_time": None if success_step is None else success_step * DT,
        "first_entry_time": None if first_entry_step is None else first_entry_step * DT,
        "relapse": bool(relapse),
        "control_cost_l2": control_cost_l2,
        "control_effort_l1": control_effort_l1,
        "endpoint_x": float(x[0]),
        "endpoint_y": float(x[1]),
        "endpoint_distance_to_c2": float(np.linalg.norm(x - CLUSTERS["C2"])),
        "endpoint_nearest_cluster": nearest_cluster(x),
        "min_distance_to_c2": min_distance_to_c2,
        "path_length": path_length,
        "steps_completed": steps_completed,
    }


def calibrate_minimal_control():
    candidates = []
    zero_noise = np.zeros((STEPS, 2))
    starts = [CLUSTERS["C3"] + offset for offset in calibration_offsets()]
    for duration in (1.0, 2.0, 3.0, 4.0, 6.0, 8.0, 10.0):
        for amplitude in np.arange(0.1, 1.51, 0.1):
            parameters = {"amplitude": float(round(amplitude, 10)), "duration": duration}
            outcomes = [simulate("minimal_control", start, zero_noise, parameters) for start in starts]
            rate = float(np.mean([outcome["success"] for outcome in outcomes]))
            cost = parameters["amplitude"] ** 2 * duration
            candidates.append(
                {
                    **parameters,
                    "calibration_success_rate": rate,
                    "nominal_pulse_cost": cost,
                }
            )

    eligible = [row for row in candidates if row["calibration_success_rate"] >= 0.80]
    if eligible:
        chosen = min(
            eligible,
            key=lambda row: (row["nominal_pulse_cost"], row["duration"], row["amplitude"]),
        )
        rule = "minimum nominal L2 pulse cost among candidates with calibration success >= 0.80"
    else:
        chosen = max(
            candidates,
            key=lambda row: (row["calibration_success_rate"], -row["nominal_pulse_cost"]),
        )
        rule = "fallback: highest calibration success; then minimum nominal L2 pulse cost"
    return {"selection_rule": rule, "chosen": chosen, "candidates": candidates}


def run_evaluation(minimal_parameters):
    trials = []
    for offset_id, radius, angle, offset in evaluation_offsets():
        start = CLUSTERS["C3"] + offset
        for noise_seed in NOISE_SEEDS:
            noise = noise_record(noise_seed, offset_id)
            for condition in CONDITIONS:
                outcome = simulate(condition, start, noise, minimal_parameters)
                trials.append(
                    {
                        "trial_id": f"O{offset_id:02d}-N{noise_seed:02d}-{condition}",
                        "condition": condition,
                        "noise_seed": noise_seed,
                        "offset_id": offset_id,
                        "start_radius": radius,
                        "start_angle_rad": angle,
                        "start_x": float(start[0]),
                        "start_y": float(start[1]),
                        **outcome,
                    }
                )
    return trials


def quantile_or_none(values, q):
    return None if not values else float(np.quantile(values, q))


def summarize_group(rows):
    successes = [row for row in rows if row["success"]]
    transition_times = [row["transition_time"] for row in successes]
    endpoints = np.array([[row["endpoint_x"], row["endpoint_y"]] for row in rows])
    endpoint_mean = np.mean(endpoints, axis=0)
    endpoint_spread = float(np.mean(np.linalg.norm(endpoints - endpoint_mean, axis=1)))
    statuses = Counter(row["status"] for row in rows)
    clusters = Counter(row["endpoint_nearest_cluster"] for row in rows)
    return {
        "n": len(rows),
        "success_count": len(successes),
        "success_rate": float(len(successes) / len(rows)),
        "transition_time_median": quantile_or_none(transition_times, 0.5),
        "transition_time_q10": quantile_or_none(transition_times, 0.1),
        "transition_time_q90": quantile_or_none(transition_times, 0.9),
        "relapse_count": sum(row["relapse"] for row in successes),
        "relapse_rate_among_successes": (
            None if not successes else float(np.mean([row["relapse"] for row in successes]))
        ),
        "control_cost_l2_mean": float(np.mean([row["control_cost_l2"] for row in rows])),
        "control_cost_l2_median": float(np.median([row["control_cost_l2"] for row in rows])),
        "control_effort_l1_mean": float(np.mean([row["control_effort_l1"] for row in rows])),
        "endpoint_mean": endpoint_mean.tolist(),
        "endpoint_spread": endpoint_spread,
        "endpoint_distance_to_c2_median": float(
            np.median([row["endpoint_distance_to_c2"] for row in rows])
        ),
        "min_distance_to_c2_median": float(np.median([row["min_distance_to_c2"] for row in rows])),
        "status_counts": dict(sorted(statuses.items())),
        "endpoint_cluster_counts": dict(sorted(clusters.items())),
    }


def build_summaries(trials):
    by_condition = defaultdict(list)
    by_condition_seed = defaultdict(list)
    by_condition_radius = defaultdict(list)
    for row in trials:
        by_condition[row["condition"]].append(row)
        by_condition_seed[(row["condition"], row["noise_seed"])].append(row)
        by_condition_radius[(row["condition"], row["start_radius"])].append(row)

    return {
        "by_condition": {
            condition: summarize_group(by_condition[condition]) for condition in CONDITIONS
        },
        "by_condition_and_noise_seed": [
            {"condition": condition, "noise_seed": seed, **summarize_group(rows)}
            for (condition, seed), rows in sorted(by_condition_seed.items())
        ],
        "by_condition_and_start_radius": [
            {"condition": condition, "start_radius": radius, **summarize_group(rows)}
            for (condition, radius), rows in sorted(by_condition_radius.items())
        ],
    }


def json_safe(value):
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        return None
    if isinstance(value, dict):
        return {key: json_safe(item) for key, item in value.items()}
    if isinstance(value, list):
        return [json_safe(item) for item in value]
    return value


def write_outputs(calibration, trials, summaries):
    output_dir = Path(__file__).resolve().parent / "results"
    output_dir.mkdir(parents=True, exist_ok=True)

    configuration = {
        "model": "static combined_field copied from navigator_v39_fixpoint_extraction.py",
        "integrator": "Euler-Maruyama on unnormalised additive field and control",
        "base_seed": BASE_SEED,
        "dt": DT,
        "horizon": HORIZON,
        "steps": STEPS,
        "noise_sigma": NOISE_SIGMA,
        "evaluation_radii": list(EVALUATION_RADII),
        "angles_per_nonzero_radius": ANGLES_PER_NONZERO_RADIUS,
        "noise_seeds": list(NOISE_SEEDS),
        "entry_radius": ENTRY_RADIUS,
        "dwell_radius": DWELL_RADIUS,
        "dwell_time": DWELL_TIME,
        "relapse_radius": RELAPSE_RADIUS,
        "relapse_time": RELAPSE_TIME,
        "conditions": list(CONDITIONS),
        "capture_bias": CAPTURE_BIAS,
        "hook_radius": HOOK_RADIUS,
        "hook_strength": HOOK_STRENGTH,
        "lock_gain": LOCK_GAIN,
        "lock_max_norm": LOCK_MAX_NORM,
    }
    payload = json_safe(
        {
            "status": "CONTROLLED MODEL EXPERIMENT — NO TRANSFER CLAIM",
            "configuration": configuration,
            "minimal_control_calibration": calibration,
            "summaries": summaries,
            "trials": trials,
        }
    )

    json_path = output_dir / "c3_to_c2_transition_full.json"
    json_path.write_text(
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )

    trial_path = output_dir / "c3_to_c2_transition_trials.csv"
    with trial_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(trials[0].keys()))
        writer.writeheader()
        writer.writerows(trials)

    summary_rows = []
    for condition in CONDITIONS:
        summary = summaries["by_condition"][condition]
        summary_rows.append(
            {
                "condition": condition,
                "n": summary["n"],
                "success_count": summary["success_count"],
                "success_rate": summary["success_rate"],
                "transition_time_median": summary["transition_time_median"],
                "transition_time_q10": summary["transition_time_q10"],
                "transition_time_q90": summary["transition_time_q90"],
                "relapse_count": summary["relapse_count"],
                "relapse_rate_among_successes": summary["relapse_rate_among_successes"],
                "control_cost_l2_mean": summary["control_cost_l2_mean"],
                "control_cost_l2_median": summary["control_cost_l2_median"],
                "control_effort_l1_mean": summary["control_effort_l1_mean"],
                "endpoint_mean_x": summary["endpoint_mean"][0],
                "endpoint_mean_y": summary["endpoint_mean"][1],
                "endpoint_spread": summary["endpoint_spread"],
                "endpoint_distance_to_c2_median": summary["endpoint_distance_to_c2_median"],
                "min_distance_to_c2_median": summary["min_distance_to_c2_median"],
                "status_counts_json": json.dumps(summary["status_counts"], sort_keys=True),
                "endpoint_cluster_counts_json": json.dumps(
                    summary["endpoint_cluster_counts"], sort_keys=True
                ),
            }
        )

    summary_path = output_dir / "c3_to_c2_transition_summary.csv"
    with summary_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(summary_rows[0].keys()))
        writer.writeheader()
        writer.writerows(summary_rows)

    sensitivity_rows = []
    for group_type, source_rows, key_name in (
        ("noise_seed", summaries["by_condition_and_noise_seed"], "noise_seed"),
        ("start_radius", summaries["by_condition_and_start_radius"], "start_radius"),
    ):
        for row in source_rows:
            sensitivity_rows.append(
                {
                    "group_type": group_type,
                    "group_value": row[key_name],
                    "condition": row["condition"],
                    "n": row["n"],
                    "success_rate": row["success_rate"],
                    "transition_time_median": row["transition_time_median"],
                    "relapse_rate_among_successes": row["relapse_rate_among_successes"],
                    "control_cost_l2_mean": row["control_cost_l2_mean"],
                    "endpoint_spread": row["endpoint_spread"],
                    "status_counts_json": json.dumps(row["status_counts"], sort_keys=True),
                    "endpoint_cluster_counts_json": json.dumps(
                        row["endpoint_cluster_counts"], sort_keys=True
                    ),
                }
            )

    sensitivity_path = output_dir / "c3_to_c2_transition_sensitivity.csv"
    with sensitivity_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(sensitivity_rows[0].keys()))
        writer.writeheader()
        writer.writerows(sensitivity_rows)

    return json_path, trial_path, summary_path, sensitivity_path


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    calibration = calibrate_minimal_control()
    minimal_parameters = {
        "amplitude": calibration["chosen"]["amplitude"],
        "duration": calibration["chosen"]["duration"],
    }
    trials = run_evaluation(minimal_parameters)
    summaries = build_summaries(trials)
    paths = write_outputs(calibration, trials, summaries)

    print("Minimal control:", json.dumps(calibration["chosen"], sort_keys=True))
    for condition in CONDITIONS:
        summary = summaries["by_condition"][condition]
        print(
            condition,
            f"success={summary['success_rate']:.3f}",
            f"relapse={summary['relapse_rate_among_successes']}",
            f"median_t={summary['transition_time_median']}",
            f"mean_cost={summary['control_cost_l2_mean']:.6f}",
        )
    for path in paths:
        print(f"{sha256(path)}  {path.name}")


if __name__ == "__main__":
    main()
