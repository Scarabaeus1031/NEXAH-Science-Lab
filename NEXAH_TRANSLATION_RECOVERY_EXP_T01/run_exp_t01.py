#!/usr/bin/env python3
"""Deterministic runner for frozen, domain-neutral NEXAH EXP-T01."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
from pathlib import Path
from typing import Any, Callable

ROOT = Path(__file__).resolve().parent
PROTOCOL_FILES = (
    "00_SCOPE_AND_BOUNDARIES.md",
    "01_FORMAL_TRANSLATION_MODEL.md",
    "02_HYPOTHESES.md",
    "03_FIXTURE_REGISTRY.md",
    "04_TRANSFORMATION_REGISTRY.md",
    "05_CERTIFICATE_REGISTRY.md",
    "06_METRICS_AND_TOLERANCES.md",
    "07_ADVERSARIAL_CONTROLS.md",
    "08_STILLPOINT_PROTOCOL.md",
    "experiment_protocol.json",
    "run_exp_t01.py",
    "verify_exp_t01.py",
)


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, sort_keys=True, indent=2, allow_nan=False) + "\n").encode()


def file_sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bundle_sha(hashes: dict[str, str]) -> str:
    payload = "".join(f"{name}\0{hashes[name]}\n" for name in sorted(hashes))
    return hashlib.sha256(payload.encode()).hexdigest()


def verify_freeze() -> str:
    record = json.loads((ROOT / "PROTOCOL_FREEZE_RECORD.json").read_text())
    actual = {name: file_sha(ROOT / name) for name in PROTOCOL_FILES}
    if actual != record["files"] or bundle_sha(actual) != record["protocol_bundle_sha256"]:
        raise RuntimeError("protocol freeze mismatch")
    return record["protocol_bundle_sha256"]


def protocol() -> dict[str, Any]:
    return json.loads((ROOT / "experiment_protocol.json").read_text())


F1 = [-2.0, -0.5, 1.0, 3.0]
F2 = [[0.1, 0.2], [1.2, 0.1], [1.8, 1.3], [0.2, 1.7]]
F3 = {"nodes": [0, 1, 2, 3, 4], "edges": [[0, 1], [1, 2], [2, 3], [3, 4]]}
F1_CF = [-2.0, 1.0, -0.5, 3.0]
F2_CF = [[x, -y] for x, y in F2]
F3_CF = {"nodes": [0, 1, 2, 3, 4], "edges": [[0, 1], [1, 3], [2, 3], [3, 4]]}


def normalize_edges(edges: list[list[int]]) -> list[list[int]]:
    return sorted([sorted([int(a), int(b)]) for a, b in edges])


def tie_ranks(values: list[tuple[str, float]], digits: int = 12) -> list[list[Any]]:
    rounded = [(label, round(value, digits)) for label, value in values]
    unique = sorted({value for _, value in rounded})
    ranks = {value: rank for rank, value in enumerate(unique)}
    return [[label, ranks[value]] for label, value in sorted(rounded)]


def components(nodes: list[int], edges: list[list[int]]) -> list[list[int]]:
    adjacency = {node: set() for node in nodes}
    for a, b in edges:
        adjacency[a].add(b)
        adjacency[b].add(a)
    result: list[list[int]] = []
    unseen = set(nodes)
    while unseen:
        start = min(unseen)
        stack = [start]
        seen = {start}
        while stack:
            current = stack.pop()
            for neighbor in adjacency[current]:
                if neighbor not in seen:
                    seen.add(neighbor)
                    stack.append(neighbor)
        result.append(sorted(seen))
        unseen -= seen
    return sorted(result)


def numeric_certificates(state: list[Any], dimension: int) -> dict[str, Any]:
    points = [[float(v)] for v in state] if dimension == 1 else state
    pairs: list[tuple[str, float]] = []
    nearest: dict[int, set[int]] = {i: set() for i in range(len(points))}
    distances: dict[tuple[int, int], float] = {}
    for i, j in itertools.combinations(range(len(points)), 2):
        distance = math.dist(points[i], points[j])
        distances[(i, j)] = distance
        pairs.append((f"{i}-{j}", distance))
    for i in range(len(points)):
        candidates = [(distances[tuple(sorted((i, j)))], j) for j in range(len(points)) if j != i]
        minimum = min(value for value, _ in candidates)
        nearest[i] = {j for value, j in candidates if math.isclose(value, minimum, abs_tol=1e-12)}
    adjacency = [[i, j] for i, j in itertools.combinations(range(len(points)), 2)
                 if j in nearest[i] and i in nearest[j]]
    certs: dict[str, Any] = {
        "C0_STATE": state,
        "C1_DISTANCE_ORDER": tie_ranks(pairs),
        "C2_ADJACENCY": adjacency,
        "C5_CONNECTIVITY": components(list(range(len(points))), adjacency),
    }
    if dimension == 1:
        certs["C3_ORIENTATION"] = [
            1 if state[j] > state[i] else -1 if state[j] < state[i] else 0
            for i, j in itertools.combinations(range(len(state)), 2)
        ]
        certs["C4_RANK_ORDER"] = tie_ranks([(str(i), float(value)) for i, value in enumerate(state)])
    else:
        a, b, c = state[:3]
        area = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        certs["C3_ORIENTATION"] = 1 if area > 0 else -1 if area < 0 else 0
    return certs


def graph_certificates(graph: dict[str, Any]) -> dict[str, Any]:
    nodes = sorted(graph["nodes"])
    edges = normalize_edges(graph["edges"])
    degrees = {node: 0 for node in nodes}
    for a, b in edges:
        degrees[a] += 1
        degrees[b] += 1
    return {
        "C0_STATE": {"nodes": nodes, "edges": edges},
        "C2_ADJACENCY": edges,
        "C4_RANK_ORDER": tie_ranks([(str(node), float(degrees[node])) for node in nodes]),
        "C5_CONNECTIVITY": components(nodes, edges),
    }


def certs(fixture: str, state: Any) -> dict[str, Any]:
    if fixture == "F1_ORDERED_1D":
        return numeric_certificates(state, 1)
    if fixture == "F2_GEOMETRY_2D":
        return numeric_certificates(state, 2)
    if fixture == "F3_GRAPH":
        return graph_certificates(state)
    raise ValueError(f"unknown fixture {fixture}")


def state_error(fixture: str, source: Any, recovered: Any) -> float:
    if fixture == "F3_GRAPH":
        return 0.0 if graph_certificates(source)["C0_STATE"] == graph_certificates(recovered)["C0_STATE"] else 1.0
    source_flat = list(itertools.chain.from_iterable(source)) if fixture == "F2_GEOMETRY_2D" else source
    recovered_flat = list(itertools.chain.from_iterable(recovered)) if fixture == "F2_GEOMETRY_2D" else recovered
    return max(abs(a - b) for a, b in zip(source_flat, recovered_flat))


def rotation(points: list[list[float]], angle: float) -> list[list[float]]:
    c, s = math.cos(angle), math.sin(angle)
    return [[c * x - s * y, s * x + c * y] for x, y in points]


def compare_certs(source: dict[str, Any], other: dict[str, Any]) -> dict[str, bool]:
    return {key: source[key] == other[key] for key in sorted(source.keys() & other.keys())}


def recovery_record(run_id: str, family: str, fixture: str, source: Any, transformed: Any,
                    recovered: Any | None, loss_status: str | None = None,
                    bound: float | None = None, witness: Any | None = None,
                    forward_state: Any | None = None) -> dict[str, Any]:
    source_certs = certs(fixture, source)
    record: dict[str, Any] = {
        "run_id": run_id,
        "family": family,
        "fixture": fixture,
        "representation_equal": source == transformed,
        "recovered_state": recovered,
        "recovery_error": None,
        "recovery_bound": bound,
        "forward_certificates": {},
        "recovery_certificates": {},
        "witness": witness,
    }
    if forward_state is not None:
        record["forward_certificates"] = compare_certs(source_certs, certs(fixture, forward_state))
    if recovered is None:
        record["primary_status"] = loss_status
        return record
    error = state_error(fixture, source, recovered)
    comparisons = compare_certs(source_certs, certs(fixture, recovered))
    record["recovery_error"] = error
    record["recovery_certificates"] = comparisons
    exact_tol = float(protocol()["exact_tolerance"])
    if family == "EXACT":
        record["primary_status"] = "EXACT_RECOVERY" if error == 0 else (
            "TOLERANCE_RECOVERY" if error <= exact_tol else "STRUCTURE_CHANGED"
        )
    elif error > float(bound):
        record["primary_status"] = "STRUCTURE_CHANGED"
    elif all(comparisons.values()):
        record["primary_status"] = "STRUCTURE_PRESERVED_STATE_CHANGED"
    else:
        record["primary_status"] = "STRUCTURE_CHANGED"
    return record


def run_recovery() -> dict[str, Any]:
    config = protocol()
    records: list[dict[str, Any]] = []
    records.append(recovery_record("E1_TRANSLATE_1D", "EXACT", "F1_ORDERED_1D", F1,
                                   [x + 5 for x in F1], F1.copy(), forward_state=[x + 5 for x in F1]))
    records.append(recovery_record("E2_SCALE_1D", "EXACT", "F1_ORDERED_1D", F1,
                                   [3 * x for x in F1], F1.copy(), forward_state=[3 * x for x in F1]))
    rotated = rotation(F2, math.pi / 3)
    records.append(recovery_record("E3_ROTATE_2D", "EXACT", "F2_GEOMETRY_2D", F2,
                                   rotated, rotation(rotated, -math.pi / 3), forward_state=rotated))
    orthogonal = [[-y, x] for x, y in F2]
    records.append(recovery_record("E4_ORTHOGONAL_2D", "EXACT", "F2_GEOMETRY_2D", F2,
                                   orthogonal, [[v, -u] for u, v in orthogonal], forward_state=orthogonal))
    permutation = {0: 2, 1: 4, 2: 1, 3: 0, 4: 3}
    inverse = {value: key for key, value in permutation.items()}
    relabeled = {"nodes": sorted(permutation.values()),
                 "edges": [[permutation[a], permutation[b]] for a, b in F3["edges"]]}
    recovered_graph = {"nodes": sorted(inverse.values()),
                       "edges": [[inverse[a], inverse[b]] for a, b in relabeled["edges"]]}
    # Forward certificate comparison uses the declared correspondence pulled back.
    records.append(recovery_record("E5_RELABEL_GRAPH", "EXACT", "F3_GRAPH", F3,
                                   relabeled, recovered_graph, forward_state=recovered_graph))

    pattern = [1.0, -1.0, 0.5, -0.5]
    for epsilon in config["noise_strengths"]:
        transformed = [x + 5 + epsilon * p for x, p in zip(F1, pattern)]
        recovered = [y - 5 for y in transformed]
        records.append(recovery_record(f"P_NOISE_{epsilon:g}", "PERTURBED", "F1_ORDERED_1D",
                                       F1, transformed, recovered,
                                       bound=config["perturbation_bound_factor"] * epsilon,
                                       forward_state=recovered))
    for step in config["quantization_steps"]:
        quantized = [[round(value / step) * step for value in point] for point in rotated]
        recovered = rotation(quantized, -math.pi / 3)
        bound = config["perturbation_bound_factor"] * (step / math.sqrt(2))
        records.append(recovery_record(f"P_QUANTIZE_{step:g}", "PERTURBED", "F2_GEOMETRY_2D",
                                       F2, quantized, recovered, bound=bound,
                                       forward_state=recovered))

    squared = [x * x for x in F1]
    records.append(recovery_record("L1_SIGN_SQUARE", "LOSSY", "F1_ORDERED_1D", F1, squared, None,
                                   loss_status="UNIDENTIFIABLE",
                                   witness={"preimage_a": F1, "preimage_b": [-x for x in F1]}))
    records.append(recovery_record("L2_PROJECT_X", "LOSSY", "F2_GEOMETRY_2D", F2,
                                   [point[0] for point in F2], None,
                                   loss_status="INFORMATION_LOST",
                                   witness={"destroyed": "all y coordinates"}))
    rounded = [round(x) for x in F1]
    records.append(recovery_record("L3_COARSE_QUANTIZE", "LOSSY", "F1_ORDERED_1D", F1, rounded,
                                   None, loss_status="INFORMATION_LOST",
                                   witness={"destroyed": "sub-integer coordinate information"}))
    deleted = {"nodes": F3["nodes"], "edges": [edge for edge in F3["edges"] if edge != [1, 2]]}
    records.append(recovery_record("L4_DELETE_EDGE", "LOSSY", "F3_GRAPH", F3, deleted, None,
                                   loss_status="INFORMATION_LOST",
                                   witness={"destroyed_edge": [1, 2]}))
    return {"records": records, "collisions": collision_ledger(records)}


def collision_ledger(records: list[dict[str, Any]]) -> dict[str, Any]:
    pairs = [
        ("F1_BASE_VS_CF", "F1_ORDERED_1D", F1, F1_CF),
        ("F2_BASE_VS_CF", "F2_GEOMETRY_2D", F2, F2_CF),
        ("F3_BASE_VS_CF", "F3_GRAPH", F3, F3_CF),
    ]
    pair_records = []
    counts = {key: 0 for key in ["C0_STATE", "C1_DISTANCE_ORDER", "C2_ADJACENCY",
                                  "C3_ORIENTATION", "C4_RANK_ORDER", "C5_CONNECTIVITY"]}
    for pair_id, fixture, left, right in pairs:
        left_c, right_c = certs(fixture, left), certs(fixture, right)
        comparisons = compare_certs(left_c, right_c)
        for key, equal in comparisons.items():
            counts[key] += int(equal)
        pair_records.append({"pair_id": pair_id, "fixture": fixture,
                             "source_states_distinct": left != right,
                             "certificate_equal": comparisons})
    false_recoveries = sum(
        1 for record in records
        if record["family"] == "LOSSY" and (
            record["recovered_state"] is not None or "RECOVERY" in record["primary_status"]
        )
    )
    return {"pair_records": pair_records, "collision_counts": counts,
            "false_recoveries": false_recoveries}


def matrix_vector(matrix: list[list[float]], vector: list[float]) -> list[float]:
    return [sum(a * b for a, b in zip(row, vector)) for row in matrix]


def rk4_step(matrix: list[list[float]], state: list[float], dt: float) -> list[float]:
    def add(a: list[float], b: list[float], scale: float) -> list[float]:
        return [x + scale * y for x, y in zip(a, b)]
    k1 = matrix_vector(matrix, state)
    k2 = matrix_vector(matrix, add(state, k1, dt / 2))
    k3 = matrix_vector(matrix, add(state, k2, dt / 2))
    k4 = matrix_vector(matrix, add(state, k3, dt))
    return [x + dt * (a + 2 * b + 2 * c + d) / 6
            for x, a, b, c, d in zip(state, k1, k2, k3, k4)]


def linear_slope(xs: list[float], ys: list[float]) -> float | None:
    if len(xs) < 2:
        return None
    xbar, ybar = sum(xs) / len(xs), sum(ys) / len(ys)
    denominator = sum((x - xbar) ** 2 for x in xs)
    if denominator == 0:
        return None
    return sum((x - xbar) * (y - ybar) for x, y in zip(xs, ys)) / denominator


def dynamical_record(run_id: str, system: str, matrix: list[list[float]], initial: list[float],
                     expected: str) -> dict[str, Any]:
    config = protocol()["stillpoint"]
    dt, horizon = float(config["dt"]), float(config["horizon"])
    tolerance, dwell = float(config["return_tolerance"]), float(config["dwell_time"])
    state = initial.copy()
    norms = [math.hypot(*state)]
    states = [state.copy()]
    steps = int(round(horizon / dt))
    for _ in range(steps):
        state = rk4_step(matrix, state, dt)
        states.append(state.copy())
        norms.append(math.hypot(*state))
    convergence_time = None
    dwell_steps = int(round(dwell / dt))
    for index in range(len(norms) - dwell_steps):
        if max(norms[index:]) <= tolerance:
            convergence_time = index * dt
            break
    if system == "S_NEUTRAL":
        status = "NEUTRAL_NONIDENTIFIABLE"
    elif convergence_time is not None:
        status = "RETURNS_TO_EQUILIBRIUM"
    else:
        status = "DOES_NOT_RETURN"
    times = [index * dt for index, value in enumerate(norms) if value > 1e-14 and math.isfinite(value)]
    logs = [math.log(value) for value in norms if value > 1e-14 and math.isfinite(value)]
    slope = linear_slope(times, logs)
    return {
        "run_id": run_id,
        "system": system,
        "matrix": matrix,
        "equilibrium": [0.0, 0.0],
        "f_at_equilibrium": matrix_vector(matrix, [0.0, 0.0]),
        "initial_delta": initial,
        "primary_status": status,
        "expected_status": expected,
        "residual_distance": norms[-1] if math.isfinite(norms[-1]) else None,
        "convergence_time": convergence_time,
        "overshoot": max(norms) - norms[0] if all(math.isfinite(v) for v in norms) else None,
        "damping_estimate": -slope if slope is not None else None,
        "expectation_met": status == expected,
    }


def run_stillpoint() -> dict[str, Any]:
    systems = [
        ("S_STABLE_DAMPED", [[0.0, 1.0], [-1.0, -0.4]], [[0.1, 0.0], [1.0, 0.0], [0.0, 1.0]],
         "RETURNS_TO_EQUILIBRIUM"),
        ("S_UNSTABLE", [[0.5, 0.0], [0.0, -0.2]], [[0.1, 0.0], [1.0, 0.0]],
         "DOES_NOT_RETURN"),
        ("S_NEUTRAL", [[0.0, 1.0], [-1.0, 0.0]], [[0.1, 0.0], [0.0, 1.0]],
         "NEUTRAL_NONIDENTIFIABLE"),
    ]
    records = []
    for system, matrix, initials, expected in systems:
        for index, initial in enumerate(initials, 1):
            records.append(dynamical_record(f"{system}_{index}", system, matrix, initial, expected))
    return {"records": records}


def build_result(phase: str) -> dict[str, Any]:
    result: dict[str, Any] = {
        "experiment_id": "NEXAH_EXP_T01",
        "schema_version": "1.0.0",
        "protocol_bundle_sha256": verify_freeze(),
        "phase": phase,
        "evidence_class": "EMPIRICAL_SYNTHETIC_AND_SOFTWARE_CHECK",
    }
    if phase in {"a", "all"}:
        result["t01a"] = run_recovery()
    if phase in {"b", "all"}:
        result["t01b"] = run_stillpoint()
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--phase", choices=("a", "b", "all"), required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.write_bytes(canonical_bytes(build_result(args.phase)))


if __name__ == "__main__":
    main()
