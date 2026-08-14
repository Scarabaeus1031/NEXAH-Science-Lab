#!/usr/bin/env python3
"""Blind observer/classifier stage. This module has no expected-class input."""

import argparse
import csv
import hashlib
import json
import math
from pathlib import Path


def load_json(path):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def read_csv(path):
    with open(path, "r", encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def canonical_hash(value):
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def write_json(path, value):
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(value, handle, indent=2, sort_keys=True, ensure_ascii=False)
        handle.write("\n")


def unwrap(points):
    raw_values = [math.atan2(y, x) for x, y in points]
    theta = [raw_values[0]]
    two_pi = 2 * math.pi
    for raw in raw_values[1:]:
        m0 = round((theta[-1] - raw) / two_pi)
        choices = [(abs(raw + two_pi * m - theta[-1]), m) for m in (m0 - 1, m0, m0 + 1)]
        _, chosen = min(choices)
        theta.append(raw + two_pi * chosen)
    return theta


def x_only_claim(single_x):
    """The R4 claimant's entire interface: one scalar in, no direction out."""
    float(single_x)
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--input", required=True)
    args = parser.parse_args()
    config = load_json(args.config)
    root = Path(args.input).resolve()
    thresholds = config["thresholds"]

    source_rows = read_csv(root / "source_trajectory.csv")
    transformed_rows = read_csv(root / "transformed_trajectories.csv")
    colors = read_csv(root / "rendered_colors.csv")
    damped = read_csv(root / "damped_trajectory.csv")
    reversed_rows = read_csv(root / "time_reversed_trajectory.csv")
    perturbed = read_csv(root / "perturbed_trajectory.csv")

    source = [(float(row["x"]), float(row["y"])) for row in source_rows]
    source_energy = [float(row["energy"]) for row in source_rows]
    source_error = max(float(row["source_error"]) for row in source_rows)
    energy_drift = max(abs(value - 0.5) for value in source_energy)
    source_pass = source_error <= thresholds["source_trajectory"] and energy_drift <= thresholds["source_energy"]

    grouped = {}
    for row in transformed_rows:
        grouped.setdefault((row["representation_id"], row["generation_path"]), []).append(row)
    required_groups = {
        ("R0", "MAP_FROM_SOURCE"), ("R1", "MAP_FROM_SOURCE"), ("R1", "INDEPENDENT_TRANSFORMED_RK4"),
        ("R2", "MAP_FROM_SOURCE"), ("R2", "INDEPENDENT_TRANSFORMED_RK4"), ("R3", "DIRECT_OBSERVATION"),
        ("R4", "DIRECT_OBSERVATION"), ("R5", "DIRECT_OBSERVATION"),
    }
    correspondence_preserved = set(grouped) == required_groups and all(len(grouped[key]) == len(source_rows) for key in required_groups)

    def coords(key):
        return [(float(row["c1"]), float(row["c2"])) for row in grouped[key]]

    r1_map = coords(("R1", "MAP_FROM_SOURCE"))
    r1_rk4 = coords(("R1", "INDEPENDENT_TRANSFORMED_RK4"))
    r2_map = coords(("R2", "MAP_FROM_SOURCE"))
    r2_rk4 = coords(("R2", "INDEPENDENT_TRANSFORMED_RK4"))
    r3 = coords(("R3", "DIRECT_OBSERVATION"))

    r1_trajectory = max(math.hypot(a[0]-b[0], a[1]-b[1]) for a, b in zip(r1_map, r1_rk4))
    r2_trajectory = max(math.hypot(a[0]-b[0], a[1]-b[1]) for a, b in zip(r2_map, r2_rk4))

    alpha = float(config["rotation_alpha"])
    c, s = math.cos(alpha), math.sin(alpha)
    q = ((c, -s), (s, c))
    a = ((0.0, 1.0), (-1.0, 0.0))
    # For this rotation Q, QAQ^T equals A; it is nevertheless constructed independently.
    qt = ((c, s), (-s, c))
    a1 = tuple(tuple(sum(q[i][k] * a[k][l] * qt[l][j] for k in range(2) for l in range(2)) for j in range(2)) for i in range(2))
    sx, sy = map(float, config["scale"])
    a2 = ((0.0, sx/sy), (-sy/sx, 0.0))

    def mv(matrix, point):
        return (matrix[0][0]*point[0] + matrix[0][1]*point[1], matrix[1][0]*point[0] + matrix[1][1]*point[1])

    r1_field = 0.0
    r2_field = 0.0
    for point, u, v in zip(source, r1_map, r2_map):
        ap = mv(a, point)
        lhs1, rhs1 = mv(a1, u), mv(q, ap)
        lhs2, rhs2 = mv(a2, v), (sx*ap[0], sy*ap[1])
        r1_field = max(r1_field, math.hypot(lhs1[0]-rhs1[0], lhs1[1]-rhs1[1]))
        r2_field = max(r2_field, math.hypot(lhs2[0]-rhs2[0], lhs2[1]-rhs2[1]))

    r1_energy_defect = max(abs(0.5*(u[0]*u[0]+u[1]*u[1]) - e) for u, e in zip(r1_map, source_energy))
    transported_energy_defect = max(abs(0.5*((v[0]/sx)**2+(v[1]/sy)**2) - e) for v, e in zip(r2_map, source_energy))
    wrong_metric_difference = max(abs(0.5*(v[0]*v[0]+v[1]*v[1]) - e) for v, e in zip(r2_map, source_energy))
    radius_defect = max(abs(radius - 1.0) for radius, _ in r3)
    phase_defect = max(abs(theta + float(row["t"])) for (_, theta), row in zip(r3, source_rows))
    raw_component_difference = max(max(abs(u[0]-p[0]), abs(v[0]-p[0])) for p, u, v in zip(source, r1_map, r2_map))

    collision_count = 0
    claimant_undefined_count = 0
    for i in range(1, 2048):
        j = 4096 - i
        xi, yi = source[i]
        xj, yj = source[j]
        qualifying = abs(xi-xj) <= thresholds["collision_x"] and abs(yi-yj) >= thresholds["collision_y"] and ((yi > 0) != (yj > 0))
        if qualifying:
            collision_count += 1
            if x_only_claim(xi) is None and x_only_claim(xj) is None:
                claimant_undefined_count += 1

    changed_colors = sum(row["palette_a_color"] != row["palette_b_color"] for row in colors)
    fixed_bins = all(int(row["phase_bin"]) == int(grouped[("R5", "DIRECT_OBSERVATION")][i]["c1"]) for i, row in enumerate(colors))
    perturbed_energy_defect = max(abs(float(row["energy"]) - e) for row, e in zip(perturbed, source_energy))

    damped_energy = [float(row["energy"]) for row in damped]
    damped_drift = max(abs(value - damped_energy[0]) for value in damped_energy)
    damped_drop_fraction = (damped_energy[0] - damped_energy[-1]) / damped_energy[0]

    forward_phase = unwrap(source)
    reversed_points = [(float(row["x"]), float(row["y"])) for row in reversed_rows]
    reversed_phase = unwrap(reversed_points)
    dt = float(config["dt"])
    forward_slope = (forward_phase[-1] - forward_phase[0]) / (config["steps"] * dt)
    reversed_slope = (reversed_phase[-1] - reversed_phase[0]) / (config["steps"] * dt)
    reversed_energy_drift = max(abs(0.5*(x*x+y*y) - 0.5) for x, y in reversed_points)
    reversed_forward_law_defect = max(abs(theta + i*dt) for i, theta in enumerate(reversed_phase))

    candidates = {
        "L1-C01": {"observed_class": "INVARIANT" if a[0][0] == -a[0][0] and a[1][1] == -a[1][1] and a[0][1] == -a[1][0] else "FAILED", "statistic": {"source_generator_skew_symmetric_exact": True, "analytic_energy": 0.5}},
        "L1-C02": {"observed_class": "ROBUST" if energy_drift <= thresholds["source_energy"] else "FAILED", "statistic": {"max_energy_drift": energy_drift}},
        "L1-C03": {"observed_class": "EQUIVARIANT" if r1_trajectory <= thresholds["trajectory"] else "FAILED", "statistic": {"max_trajectory_defect": r1_trajectory}},
        "L1-C04": {"observed_class": "EQUIVARIANT" if r1_field <= thresholds["algebraic"] else "FAILED", "statistic": {"max_field_defect": r1_field}},
        "L1-C05": {"observed_class": "INVARIANT" if r1_energy_defect <= thresholds["algebraic"] else "FAILED", "statistic": {"max_energy_defect": r1_energy_defect}},
        "L1-C06": {"observed_class": "EQUIVARIANT" if r2_trajectory <= thresholds["trajectory"] and r2_field <= thresholds["algebraic"] else "FAILED", "statistic": {"max_trajectory_defect": r2_trajectory, "max_field_defect": r2_field}},
        "L1-C07": {"observed_class": "INVARIANT" if transported_energy_defect <= thresholds["algebraic"] else "FAILED", "statistic": {"max_transported_energy_defect": transported_energy_defect}},
        "L1-C08": {"observed_class": "REPRESENTATION_DEPENDENT" if wrong_metric_difference >= thresholds["representation_difference"] else "FAILED", "statistic": {"max_wrong_metric_difference": wrong_metric_difference}},
        "L1-C09": {"observed_class": "ROBUST" if radius_defect <= thresholds["trajectory"] else "FAILED", "statistic": {"max_radius_defect": radius_defect}},
        "L1-C10": {"observed_class": "EQUIVARIANT" if phase_defect <= thresholds["phase"] else "FAILED", "statistic": {"max_signed_phase_defect": phase_defect}},
        "L1-C11": {"observed_class": "REPRESENTATION_DEPENDENT" if raw_component_difference >= thresholds["representation_difference"] else "FAILED", "statistic": {"max_declared_component_difference": raw_component_difference}},
        "L1-C12": {"observed_class": "UNDEFINED" if collision_count >= thresholds["collision_count"] and claimant_undefined_count == collision_count else "FAILED", "statistic": {"unique_collision_pairs": collision_count, "x_only_undefined_pairs": claimant_undefined_count}},
        "L1-C13": {"observed_class": "REPRESENTATION_DEPENDENT" if changed_colors > 0 and fixed_bins else "FAILED", "statistic": {"changed_colors": changed_colors, "phase_bins_fixed": fixed_bins}},
        "L1-C14": {"observed_class": "ROBUST" if perturbed_energy_defect <= thresholds["perturbed_energy"] else "FAILED", "statistic": {"max_perturbed_energy_defect": perturbed_energy_defect}},
    }

    controls = {
        "D1": {"passed": damped_drift > thresholds["source_energy"] and damped_drop_fraction >= thresholds["damped_drop_fraction"], "energy_invariance_failed": damped_drift > thresholds["source_energy"], "final_energy_drop_fraction": damped_drop_fraction},
        "D2": {"passed": reversed_energy_drift <= thresholds["source_energy"] and abs(forward_slope + 1) <= thresholds["phase"] and abs(reversed_slope - 1) <= thresholds["phase"] and reversed_forward_law_defect > thresholds["phase"], "energy_retained": reversed_energy_drift <= thresholds["source_energy"], "forward_phase_slope": forward_slope, "reversed_phase_slope": reversed_slope, "forward_law_failed_on_reverse": reversed_forward_law_defect > thresholds["phase"]},
        "D3": {"passed": wrong_metric_difference >= thresholds["representation_difference"], "wrong_metric_invariance_failed": wrong_metric_difference >= thresholds["representation_difference"], "max_wrong_metric_difference": wrong_metric_difference},
        "D4": {"passed": collision_count >= thresholds["collision_count"] and claimant_undefined_count == collision_count, "unique_collision_pairs": collision_count, "claimant_interface": "x_only", "withheld_metadata_access": False},
        "D5": {"passed": changed_colors > 0 and fixed_bins, "rendered_color_invariance_failed": changed_colors > 0, "phase_bins_invariant": fixed_bins, "changed_colors": changed_colors},
    }

    observations = {
        "experiment_id": config["experiment_id"],
        "preregistration_sha256": config["preregistration_sha256"],
        "stage": "observer_classifier",
        "expected_classes_available": False,
        "source_baseline": {"passed": source_pass, "max_analytic_error": source_error, "max_energy_drift": energy_drift},
        "correspondence_preserved": correspondence_preserved,
        "candidate_results": candidates,
        "destructive_controls": controls,
    }
    write_json(root / "observed_classifications.json", {"observations": observations, "sealed_result_hash": canonical_hash(observations)})


if __name__ == "__main__":
    main()

