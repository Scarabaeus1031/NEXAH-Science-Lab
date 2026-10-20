#!/usr/bin/env python3
"""Execute the frozen A0-BL-054 IEEE-300 Ghostgrid representation stress."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from itertools import combinations
from pathlib import Path
import sys
from typing import Any

import numpy as np
import pandapower.toolbox as ppt
from scipy.stats import spearmanr


HERE = Path(__file__).resolve().parent
SCIENCE_LAB = HERE.parents[1]
PARENT = SCIENCE_LAB / "CASE_STUDIES" / "NEXAH_IEEE300_GRAPH_TO_GRID_VALIDATION_2026-10-08"
sys.path.insert(0, str(PARENT))

from src.continuation import continuation_path  # noqa: E402
from src.graph_grid import (  # noqa: E402
    graph_to_relational_grid,
    load_ieee300,
    synthetic_carrier_ablation,
)


EXPECTED_SOURCES = {
    "PREREGISTRATION_R2.md": "8a54f7d6ad26a08348bf027b7011e6efbeec8b95c83fbdc4798ddff6c2c1d824",
    "artifacts_r2/GRAPH_GRID_RESULT_R2.json": "c4e36047129ca54faaf13189a50b7f94b13b57fa1ef3aa21ee0ef5491f1ca514",
    "src/graph_grid.py": "5b3332d5a8005d89e9ff048e478c3fed67fbc785f7e66c64017fcd2fd5e39f9a",
    "src/continuation.py": "8bfe842c8f08542c6781b31e171fddbc92aa45a23269bb8d2bbd69d5ceb72c6e",
    "morphology_01/PREREGISTRATION.md": "c416e80e1c0bea315f8bd4ff2299090acce898615b189fe55a3e8e42014b8b8b",
    "morphology_01/artifacts/GRAPH_GRID_MORPHOLOGY_01.json": "c4d1f6d9f01d9b092554c326edb36b2788242d3e916780eae83b989d1fb79e77",
}


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def validate_sources() -> None:
    for name, expected in EXPECTED_SOURCES.items():
        observed = sha256_file(PARENT / name)
        if observed != expected:
            raise RuntimeError(f"source mismatch {name}: {observed}")


def normalized_rows(relation: Any, protocol: dict[str, Any]) -> np.ndarray:
    scales = np.asarray(protocol["adapter"]["column_scales"], dtype=np.float64)
    rows = np.asarray(relation.relation_rows, dtype=np.float64) / scales
    if rows.ndim != 2 or rows.shape[1] != 6 or not np.all(np.isfinite(rows)):
        raise RuntimeError("invalid relation rows")
    return rows


def direct_summary(relation: Any, protocol: dict[str, Any]) -> np.ndarray:
    rows = normalized_rows(relation, protocol)
    return np.concatenate((np.mean(rows, axis=0), np.std(rows, axis=0)))


def adapter(relation: Any, protocol: dict[str, Any]) -> tuple[complex, list[float]]:
    rows = normalized_rows(relation, protocol)
    stress = float(np.clip(np.mean(np.abs(rows[:, 2:])), 0.0, 1.0))
    heterogeneity = float(np.clip(np.mean(np.std(rows, axis=0)), 0.0, 1.0))
    spec = protocol["adapter"]
    c = complex(
        spec["real_offset"] + spec["real_stress_scale"] * stress,
        spec["imag_offset"] + spec["imag_heterogeneity_scale"] * heterogeneity,
    )
    return c, [stress, heterogeneity]


def late_orbit_features(c: complex, protocol: dict[str, Any]) -> np.ndarray:
    orbit = protocol["orbit"]
    z = 0j
    previous_radius = 0.0
    rows: list[list[float]] = []
    for n in range(1, int(orbit["length"]) + 1):
        z = z * z + c
        radius = abs(z)
        if not math.isfinite(radius) or radius > float(orbit["escape_radius"]):
            raise FloatingPointError(f"orbit escaped at n={n}")
        if n >= int(orbit["first_emitted_iterate"]):
            phase = (math.atan2(z.imag, z.real) + math.pi) / (2.0 * math.pi)
            delta = np.clip(radius - previous_radius, -0.5, 0.5) + 0.5
            rows.append([radius / float(orbit["escape_radius"]), phase, float(delta)])
        previous_radius = radius
    levels = int(orbit["quantization_levels"])
    values = np.asarray(rows, dtype=np.float64)
    return np.floor(np.clip(values, 0.0, np.nextafter(1.0, 0.0)) * levels).astype(np.uint8)


def ghost_view(features: np.ndarray, name: str, bins: int, phase_offset: float, radial_scale: float) -> np.ndarray:
    f = features.astype(np.float64) / 255.0
    radius = np.clip(f[:, 0] * radial_scale, 0.0, np.nextafter(1.0, 0.0))
    phase = np.mod(f[:, 1] + phase_offset / (2.0 * math.pi), 1.0)
    delta = f[:, 2]
    time = np.linspace(0.0, np.nextafter(1.0, 0.0), len(f))
    if name == "ordered_time_radius":
        x, y = time, radius
    elif name == "phase_radius":
        x, y = phase, radius
    elif name == "delta_phase":
        x, y = delta, phase
    else:
        raise ValueError(name)
    hist, _, _ = np.histogram2d(x, y, bins=(bins, bins), range=((0.0, 1.0), (0.0, 1.0)))
    total = float(hist.sum())
    if total <= 0.0:
        raise RuntimeError("empty Ghostgrid view")
    return hist / total


def pairwise_l2(items: list[np.ndarray]) -> np.ndarray:
    return np.asarray([float(np.linalg.norm(items[i] - items[j])) for i, j in combinations(range(len(items)), 2)])


def pairwise_l1(items: list[np.ndarray]) -> np.ndarray:
    return np.asarray([float(np.sum(np.abs(items[i] - items[j]))) for i, j in combinations(range(len(items)), 2)])


def rho(left: np.ndarray, right: np.ndarray) -> float:
    value = float(spearmanr(left, right).statistic)
    return value if math.isfinite(value) else -1.0


def solve_controls(protocol: dict[str, Any]) -> tuple[list[Any], Any, Any, Any]:
    scales = tuple(float(x) for x in protocol["load_scales"])
    net = load_ieee300()
    records, snapshots = continuation_path(net, scales, scenario_prefix="bl054-load")
    if len(snapshots) != len(scales):
        raise RuntimeError(f"baseline continuation divergence: {records[-1]}")

    topology = load_ieee300()
    topology.line.at[int(protocol["topology_line_index"]), "in_service"] = False
    topology_records, topology_snapshots = continuation_path(topology, scales, scenario_prefix="bl054-topology")
    if len(topology_snapshots) != len(scales):
        raise RuntimeError(f"topology continuation divergence: {topology_records[-1]}")

    relabeled = load_ieee300()
    original = np.asarray(relabeled.bus.index, dtype=np.int64)
    permuted = np.random.default_rng(int(protocol["relabel_seed"])).permutation(original)
    ppt.reindex_buses(relabeled, {int(a): int(b) for a, b in zip(original, permuted)})
    relabel_records, relabel_snapshots = continuation_path(relabeled, scales, scenario_prefix="bl054-relabel")
    if len(relabel_snapshots) != len(scales):
        raise RuntimeError(f"relabel continuation divergence: {relabel_records[-1]}")

    stress = snapshots[-1]
    synthetic = synthetic_carrier_ablation(stress)
    return snapshots, topology_snapshots[-1], relabel_snapshots[-1], synthetic


def analyze(protocol: dict[str, Any]) -> dict[str, Any]:
    snapshots, topology_snapshot, relabel_snapshot, synthetic_snapshot = solve_controls(protocol)
    relations = [graph_to_relational_grid(x) for x in snapshots]
    topology_relation = graph_to_relational_grid(topology_snapshot)
    relabel_relation = graph_to_relational_grid(relabel_snapshot)
    synthetic_relation = graph_to_relational_grid(synthetic_snapshot)
    control_relations = [topology_relation, relabel_relation, synthetic_relation]

    summaries = [direct_summary(x, protocol) for x in relations]
    reference = pairwise_l2(summaries)
    adapter_records = [adapter(x, protocol) for x in relations + control_relations]
    features = [late_orbit_features(c, protocol) for c, _ in adapter_records]
    load_features = features[: len(relations)]
    topology_features, relabel_features, synthetic_features = features[len(relations):]

    view_records: list[dict[str, Any]] = []
    all_view_pass = True
    for name in protocol["views"]["names"]:
        for bins in protocol["views"]["resolutions"]:
            for phase in protocol["views"]["phase_offsets_radians"]:
                for radial_scale in protocol["views"]["viewport_radial_scales"]:
                    histograms = [ghost_view(x, name, int(bins), float(phase), float(radial_scale)) for x in load_features]
                    correlation = rho(pairwise_l1(histograms), reference)
                    passed = correlation >= protocol["thresholds"]["view_order_spearman_gte"]
                    all_view_pass = all_view_pass and passed
                    view_records.append({
                        "name": name,
                        "bins": int(bins),
                        "phase_offset": float(phase),
                        "radial_scale": float(radial_scale),
                        "distance_order_spearman": correlation,
                        "pass": passed,
                    })

    primary = lambda x: ghost_view(x, "ordered_time_radius", 16, 0.0, 1.0)
    load_views = [primary(x) for x in load_features]
    baseline_distances = np.asarray([float(np.sum(np.abs(load_views[i] - load_views[0]))) for i in range(len(load_views))])
    load_rho = rho(np.asarray(protocol["load_scales"], dtype=np.float64), baseline_distances)
    load_gate = bool(load_rho >= protocol["thresholds"]["load_order_spearman_gte"] and baseline_distances[-1] > protocol["thresholds"]["load_endpoint_l1_gt"])
    stress_view = load_views[-1]
    topology_l1 = float(np.sum(np.abs(primary(topology_features) - stress_view)))
    synthetic_l1 = float(np.sum(np.abs(primary(synthetic_features) - stress_view)))
    relabel_delta = float(np.max(np.abs(primary(relabel_features) - stress_view)))
    relabel_exact = bool(np.array_equal(relabel_features, load_features[-1]) and relabel_delta <= protocol["thresholds"]["relabel_max_abs_lte"])

    signatures = [x.tobytes().hex() for x in load_features]
    load_unique = len(set(signatures)) == len(signatures)
    collision_gate = bool(load_unique and topology_features.tobytes() not in {x.tobytes() for x in load_features} and synthetic_features.tobytes() not in {x.tobytes() for x in load_features} and relabel_features.tobytes() == load_features[-1].tobytes())
    shuffled = load_features[-1].copy()
    np.random.default_rng(int(protocol["random_projection_seed"])).shuffle(shuffled, axis=0)
    order_control_l1 = float(np.sum(np.abs(primary(shuffled) - stress_view)))

    rng = np.random.default_rng(int(protocol["random_projection_seed"]))
    random_rhos = []
    summary_matrix = np.asarray(summaries)
    for _ in range(int(protocol["random_projection_count"])):
        projection = rng.normal(size=(summary_matrix.shape[1], 2))
        q, _ = np.linalg.qr(projection)
        random_rhos.append(rho(pairwise_l2([row for row in summary_matrix @ q]), reference))
    primary_rho = rho(pairwise_l1(load_views), reference)
    random_q95 = float(np.quantile(random_rhos, 0.95))

    gates = {
        "NO_ESCAPE": True,
        "BUS_RELABEL_INVARIANCE": relabel_exact,
        "LOAD_SENSITIVITY": load_gate,
        "TOPOLOGY_SENSITIVITY": topology_l1 > protocol["thresholds"]["topology_l1_gt"],
        "SYNTHETIC_ABLATION": synthetic_l1 > protocol["thresholds"]["synthetic_l1_gt"],
        "COLLISION_ACCOUNTING": collision_gate,
        "ORDER_CONTROL": order_control_l1 > 0.0,
        "ALL_VIEW_STRESS": all_view_pass,
    }
    if all(gates.values()):
        decision = "PASS_BOUNDED_REPRESENTATION_STRESS"
        if primary_rho <= random_q95:
            decision = "UNINFORMATIVE_NO_ADVANTAGE_OVER_DIRECT_SIGNATURE"
    elif not collision_gate:
        decision = "INFORMATION_LOST"
    else:
        decision = "MIXED_NEGATIVE"

    result: dict[str, Any] = {
        "schema": "nexah.a0-bl-054.critical-orbit-ghostgrid-result/1.0.0",
        "study_id": "A0_BL_054_IEEE300_CRITICAL_ORBIT_GHOSTGRID_2026_10_18",
        "protocol_sha256": sha256_file(HERE / "FROZEN_PROTOCOL.json"),
        "source_hashes": EXPECTED_SOURCES,
        "decision": decision,
        "adapter_records": [
            {"real": c.real, "imag": c.imag, "direct_signature": signature}
            for c, signature in adapter_records
        ],
        "gates": gates,
        "metrics": {
            "load_order_spearman": load_rho,
            "load_endpoint_l1": float(baseline_distances[-1]),
            "topology_l1": topology_l1,
            "synthetic_l1": synthetic_l1,
            "relabel_max_abs": relabel_delta,
            "order_control_l1": order_control_l1,
            "primary_distance_order_spearman": primary_rho,
            "random_projection_rho_q95": random_q95,
            "random_projection_rhos": random_rhos,
        },
        "view_stress": view_records,
        "collision_accounting": {
            "load_unique": load_unique,
            "load_signature_count": len(set(signatures)),
            "load_state_count": len(signatures),
            "relabel_equals_stress": relabel_features.tobytes() == load_features[-1].tobytes(),
        },
        "information_boundary": {
            "input_relation_values_per_state": int(relations[0].relation_rows.size),
            "emitted_quantized_values_per_state": int(load_features[0].size),
            "raw_complex_iterates_emitted": False,
            "first_emitted_iterate": int(protocol["orbit"]["first_emitted_iterate"]),
        },
        "claim_ceiling": protocol["claim_ceiling"],
    }
    payload = canonical_json(result)
    result["result_sha256"] = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    validate_sources()
    protocol = json.loads((HERE / "FROZEN_PROTOCOL.json").read_text())
    try:
        result = analyze(protocol)
    except FloatingPointError as error:
        result = {
            "schema": "nexah.a0-bl-054.critical-orbit-ghostgrid-result/1.0.0",
            "study_id": "A0_BL_054_IEEE300_CRITICAL_ORBIT_GHOSTGRID_2026_10_18",
            "protocol_sha256": sha256_file(HERE / "FROZEN_PROTOCOL.json"),
            "decision": "INVALID_ADAPTER",
            "failure": str(error),
            "claim_ceiling": protocol["claim_ceiling"],
        }
        payload = canonical_json(result)
        result["result_sha256"] = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    output = HERE / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"decision": result["decision"], "result_sha256": result["result_sha256"]}, sort_keys=True))


if __name__ == "__main__":
    main()
