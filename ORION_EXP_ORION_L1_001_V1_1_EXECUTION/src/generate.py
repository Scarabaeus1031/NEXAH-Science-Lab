#!/usr/bin/env python3
"""Generator stage: creates trajectories without reading expected classes."""

import argparse
import csv
import hashlib
import json
import math
from pathlib import Path


def load_json(path):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path, value):
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(value, handle, indent=2, sort_keys=True, ensure_ascii=False)
        handle.write("\n")


def fnum(value):
    return format(value, ".17g")


def mat_vec(matrix, vector):
    return (
        matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
        matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
    )


def rk4(matrix, initial, dt, steps):
    state = (float(initial[0]), float(initial[1]))
    states = [state]
    for _ in range(steps):
        k1 = mat_vec(matrix, state)
        k2 = mat_vec(matrix, (state[0] + dt * k1[0] / 2, state[1] + dt * k1[1] / 2))
        k3 = mat_vec(matrix, (state[0] + dt * k2[0] / 2, state[1] + dt * k2[1] / 2))
        k4 = mat_vec(matrix, (state[0] + dt * k3[0], state[1] + dt * k3[1]))
        state = (
            state[0] + dt * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6,
            state[1] + dt * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6,
        )
        states.append(state)
    return states


def unwrap(raw_values):
    theta = [raw_values[0]]
    two_pi = 2 * math.pi
    for raw in raw_values[1:]:
        m0 = round((theta[-1] - raw) / two_pi)
        choices = [(abs(raw + two_pi * m - theta[-1]), m) for m in (m0 - 1, m0, m0 + 1)]
        _, chosen = min(choices)
        theta.append(raw + two_pi * chosen)
    return theta


def write_csv(path, fieldnames, rows):
    with open(path, "w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def transformed_row(step, t, representation, path, state, derivative=(None, None), defined=True, reason=""):
    return {
        "source_id": "SRC-001",
        "step": step,
        "t": fnum(t),
        "representation_id": representation,
        "generation_path": path,
        "c1": "" if state[0] is None else fnum(state[0]),
        "c2": "" if state[1] is None else fnum(state[1]),
        "dc1_dt": "" if derivative[0] is None else fnum(derivative[0]),
        "dc2_dt": "" if derivative[1] is None else fnum(derivative[1]),
        "defined": "true" if defined else "false",
        "failure_reason": reason,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    config_path = Path(args.config).resolve()
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=False)
    config = load_json(config_path)

    steps = int(config["steps"])
    dt = float(config["dt"])
    source_matrix = ((0.0, 1.0), (-1.0, 0.0))
    source = rk4(source_matrix, (1.0, 0.0), dt, steps)

    alpha = float(config["rotation_alpha"])
    cosine, sine = math.cos(alpha), math.sin(alpha)
    q = ((cosine, -sine), (sine, cosine))
    q_t = ((cosine, sine), (-sine, cosine))
    a1 = tuple(tuple(sum(q[i][k] * source_matrix[k][l] * q_t[l][j] for k in range(2) for l in range(2)) for j in range(2)) for i in range(2))
    r1_initial = mat_vec(q, (1.0, 0.0))
    r1_integrated = rk4(a1, r1_initial, dt, steps)

    scale_x, scale_y = map(float, config["scale"])
    s_matrix = ((scale_x, 0.0), (0.0, scale_y))
    s_inv = ((1.0 / scale_x, 0.0), (0.0, 1.0 / scale_y))
    a2 = tuple(tuple(sum(s_matrix[i][k] * source_matrix[k][l] * s_inv[l][j] for k in range(2) for l in range(2)) for j in range(2)) for i in range(2))
    r2_initial = mat_vec(s_matrix, (1.0, 0.0))
    r2_integrated = rk4(a2, r2_initial, dt, steps)

    source_rows = []
    for step, (x, y) in enumerate(source):
        t = step * dt
        exact = (math.cos(t), -math.sin(t))
        error = math.hypot(x - exact[0], y - exact[1])
        source_rows.append({
            "experiment_id": config["experiment_id"], "source_id": "SRC-001", "step": step,
            "t": fnum(t), "x": fnum(x), "y": fnum(y), "dx_dt": fnum(y), "dy_dt": fnum(-x),
            "energy": fnum(0.5 * (x * x + y * y)), "x_exact": fnum(exact[0]), "y_exact": fnum(exact[1]),
            "source_error": fnum(error),
        })
    source_fields = ["experiment_id", "source_id", "step", "t", "x", "y", "dx_dt", "dy_dt", "energy", "x_exact", "y_exact", "source_error"]
    write_csv(out / "source_trajectory.csv", source_fields, source_rows)

    raw_phase = [math.atan2(y, x) for x, y in source]
    phase = unwrap(raw_phase)
    transformed = []
    color_rows = []
    two_pi = 2 * math.pi
    bin_count = int(config["phase_bins"])
    for step, (x, y) in enumerate(source):
        t = step * dt
        derivative = (y, -x)
        transformed.append(transformed_row(step, t, "R0", "MAP_FROM_SOURCE", (x, y), derivative))

        r1_map = mat_vec(q, (x, y))
        transformed.append(transformed_row(step, t, "R1", "MAP_FROM_SOURCE", r1_map, mat_vec(q, derivative)))
        transformed.append(transformed_row(step, t, "R1", "INDEPENDENT_TRANSFORMED_RK4", r1_integrated[step], mat_vec(a1, r1_integrated[step])))

        r2_map = mat_vec(s_matrix, (x, y))
        transformed.append(transformed_row(step, t, "R2", "MAP_FROM_SOURCE", r2_map, mat_vec(s_matrix, derivative)))
        transformed.append(transformed_row(step, t, "R2", "INDEPENDENT_TRANSFORMED_RK4", r2_integrated[step], mat_vec(a2, r2_integrated[step])))

        radius = math.hypot(x, y)
        if radius <= config["thresholds"]["undefined_radius"]:
            transformed.append(transformed_row(step, t, "R3", "DIRECT_OBSERVATION", (None, None), defined=False, reason="radius_below_threshold"))
        else:
            dr = (x * y + y * (-x)) / radius
            dtheta = (x * (-x) - y * y) / (radius * radius)
            transformed.append(transformed_row(step, t, "R3", "DIRECT_OBSERVATION", (radius, phase[step]), (dr, dtheta)))

        transformed.append(transformed_row(step, t, "R4", "DIRECT_OBSERVATION", (x, None)))
        phase_bin = int(math.floor(((phase[step] % two_pi) / two_pi) * bin_count)) % bin_count
        transformed.append(transformed_row(step, t, "R5", "DIRECT_OBSERVATION", (float(phase_bin), None)))
        color_rows.append({"source_id": "SRC-001", "step": step, "phase_bin": phase_bin,
                           "palette_a_color": config["palette_a"][phase_bin], "palette_b_color": config["palette_b"][phase_bin]})

    transformed_fields = ["source_id", "step", "t", "representation_id", "generation_path", "c1", "c2", "dc1_dt", "dc2_dt", "defined", "failure_reason"]
    write_csv(out / "transformed_trajectories.csv", transformed_fields, transformed)
    write_csv(out / "representations.csv", transformed_fields, transformed)
    write_csv(out / "rendered_colors.csv", ["source_id", "step", "phase_bin", "palette_a_color", "palette_b_color"], color_rows)

    damping = float(config["damping"])
    damped = rk4(((0.0, 1.0), (-1.0, -damping)), (1.0, 0.0), dt, steps)
    damped_rows = [{"step": i, "t": fnum(i * dt), "x": fnum(x), "y": fnum(y), "energy": fnum(0.5 * (x*x + y*y))} for i, (x, y) in enumerate(damped)]
    write_csv(out / "damped_trajectory.csv", ["step", "t", "x", "y", "energy"], damped_rows)

    reversed_rows = [{"step": i, "t": fnum(i * dt), "x": fnum(source[steps-i][0]), "y": fnum(source[steps-i][1])} for i in range(steps + 1)]
    write_csv(out / "time_reversed_trajectory.csv", ["step", "t", "x", "y"], reversed_rows)

    perturbed_rows = []
    for i, (x, y) in enumerate(source):
        t = i * dt
        px, py = x + 1e-6 * math.sin(17 * t), y + 1e-6 * math.cos(19 * t)
        perturbed_rows.append({"step": i, "t": fnum(t), "x": fnum(px), "y": fnum(py), "energy": fnum(0.5 * (px*px + py*py))})
    write_csv(out / "perturbed_trajectory.csv", ["step", "t", "x", "y", "energy"], perturbed_rows)

    generated = sorted(path for path in out.iterdir() if path.is_file())
    write_json(out / "generation_record.json", {
        "stage": "generator", "expected_classes_read": False, "config_sha256": sha256(config_path),
        "files": {path.name: sha256(path) for path in generated},
    })


if __name__ == "__main__":
    main()

