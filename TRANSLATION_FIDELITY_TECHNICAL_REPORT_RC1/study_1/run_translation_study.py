#!/usr/bin/env python3
"""Run the frozen minimal NEXAH cross-representation translation study."""

from __future__ import annotations

import argparse
from collections import deque
from datetime import datetime, timezone
import hashlib
import itertools
import json
from pathlib import Path
import sys
from typing import Any

import numpy as np


PACKAGE = Path(__file__).resolve().parent
SPEC_PATH = PACKAGE / "translation_spec.json"
PROTOCOL_PATHS = (
    PACKAGE / "00_NEXAH_TRANSLATION_MAP.md",
    PACKAGE / "01_CANDIDATE_TRANSLATION_INVARIANTS.md",
    PACKAGE / "02_MINIMAL_TRANSLATION_EXPERIMENT.md",
    SPEC_PATH,
)
CANONICAL_ROOT = Path("/Users/tho2020/Documents/GitHub/NEXAH")
SOURCE_HASHES = {
    "nexah/core.py": "af8b831a8cb3242b12a66d1cd694dcdb65ca87aed531ea9038ea7453f145dbc0",
    "nexah/backends/v07.py": "c8f9f6be401992a1d9d50a0b2959fefaa10966a9d84f4874cf2ef93c067ff589",
}


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False) + "\n").encode()


def protocol_hash() -> str:
    payload = b"".join(path.name.encode() + b"\0" + path.read_bytes() for path in PROTOCOL_PATHS)
    return sha256_bytes(payload)


def verify_sources() -> dict[str, str]:
    observed = {rel: sha256_file(CANONICAL_ROOT / rel) for rel in SOURCE_HASHES}
    if observed != SOURCE_HASHES:
        raise RuntimeError(f"CANONICAL_SOURCE_IDENTITY_MISMATCH: {observed}")
    return observed


def connector(left: float, right: float, count: int) -> list[float]:
    return np.linspace(left, right, count + 2, dtype=np.float64)[1:-1].tolist()


def baseline_fixture(spec: dict[str, Any]) -> np.ndarray:
    values: list[float] = []
    levels = spec["fixture"]["plateaus"]
    dwells = spec["fixture"]["dwell_counts"]
    count = spec["fixture"]["connector_interior_points"]
    for index, (level, dwell) in enumerate(zip(levels, dwells)):
        values.extend([float(level)] * int(dwell))
        if index + 1 < len(levels):
            values.extend(connector(level, levels[index + 1], count))
    return np.asarray(values, dtype=np.float64)


def representations(x: np.ndarray, spec: dict[str, Any]) -> dict[str, np.ndarray]:
    previous = np.concatenate(([x[0]], x[:-1]))
    rng = np.random.Generator(np.random.PCG64(spec["noise"]["seed"]))
    sigma = float(spec["noise"]["sigma"])
    shortcut = np.concatenate((
        np.full(24, -2.0), np.full(24, 2.0),
        np.asarray(connector(2.0, 0.0, 6)), np.full(20, 0.0),
        np.asarray(connector(0.0, -2.0, 6)), np.full(24, -2.0),
    ))
    return {
        "baseline_scalar": x,
        "affine_redundant_2d": np.column_stack((x, 2.0 * x + 1.0)),
        "nonlinear_injective_2d": np.column_stack((x, x ** 3)),
        "delay_2d": np.column_stack((x, previous)),
        "small_noise": x + rng.normal(0.0, sigma, size=x.shape),
        "coarsened": x[::2],
        "lossy_square": x ** 2,
        "structural_shortcut": shortcut,
    }


def adjacency_from_transitions(transitions: tuple[Any, ...]) -> tuple[list[str], dict[tuple[str, str], float]]:
    nodes = sorted({t.source.identifier.value for t in transitions} | {t.target.identifier.value for t in transitions})
    edges = {(t.source.identifier.value, t.target.identifier.value): float(t.probability) for t in transitions}
    return nodes, edges


def matrix_for(nodes: list[str], edges: dict[tuple[str, str], float], order: tuple[str, ...]) -> tuple[tuple[float, ...], ...]:
    return tuple(tuple(edges.get((a, b), 0.0) for b in order) for a in order)


def certificates(nodes: list[str], edges: dict[tuple[str, str], float], decimals: int) -> tuple[str, str]:
    binary: list[str] = []
    weighted: list[str] = []
    for order in itertools.permutations(nodes):
        matrix = matrix_for(nodes, edges, order)
        binary.append(";".join("".join("1" if value > 0.0 else "0" for value in row) for row in matrix))
        weighted.append(";".join(",".join(f"{value:.{decimals}f}" for value in row) for row in matrix))
    return min(binary), min(weighted)


def graph_summary(nodes: list[str], edges: dict[tuple[str, str], float]) -> dict[str, Any]:
    adjacency = {node: {b for (a, b), value in edges.items() if a == node and value > 0.0 and b != node} for node in nodes}
    undirected = {node: set() for node in nodes}
    for a, targets in adjacency.items():
        for b in targets:
            undirected[a].add(b); undirected[b].add(a)

    def reachable(start: str, graph: dict[str, set[str]]) -> set[str]:
        seen = {start}; queue = deque([start])
        while queue:
            for target in graph[queue.popleft()]:
                if target not in seen: seen.add(target); queue.append(target)
        return seen

    wcc_sizes: list[int] = []
    remaining = set(nodes)
    while remaining:
        group = reachable(min(remaining), undirected); wcc_sizes.append(len(group)); remaining -= group
    scc_sets = []
    unassigned = set(nodes)
    while unassigned:
        seed = min(unassigned)
        component = {node for node in nodes if node in reachable(seed, adjacency) and seed in reachable(node, adjacency)}
        scc_sets.append(component); unassigned -= component
    baseline_components = len(wcc_sizes)
    articulation = []
    for removed in nodes:
        kept = [n for n in nodes if n != removed]
        if not kept: continue
        reduced = {n: undirected[n] - {removed} for n in kept}
        rem = set(kept); count = 0
        while rem:
            group = reachable(min(rem), reduced); rem -= group; count += 1
        if count > baseline_components: articulation.append(removed)
    distances = []
    for start in nodes:
        distance = {start: 0}; queue = deque([start])
        while queue:
            source = queue.popleft()
            for target in adjacency[source]:
                if target not in distance: distance[target] = distance[source] + 1; queue.append(target)
        distances.extend(value for target, value in distance.items() if target != start)
    return {
        "node_count": len(nodes),
        "edge_count_including_self": len(edges),
        "scc_sizes": sorted(len(group) for group in scc_sets),
        "wcc_sizes": sorted(wcc_sizes),
        "weak_articulation_count": len(articulation),
        "finite_directed_distance_multiset": sorted(distances),
        "transition_probability_multiset": sorted(round(value, 12) for value in edges.values()),
    }


def run() -> dict[str, Any]:
    source_hashes = verify_sources()
    spec = json.loads(SPEC_PATH.read_text())
    sys.path.insert(0, str(CANONICAL_ROOT))
    from nexah.backends import V07BackendAdapter
    from nexah.orientation import Context, Provenance

    adapter = V07BackendAdapter(**spec["adapter"])
    provenance = Provenance(source="minimal-controlled-translation-fixture", method="frozen representation battery", recorded_at=datetime(2026, 8, 13, tzinfo=timezone.utc), record_id="translation-study-v1")
    context = Context(domain="synthetic-translation-test", values={"physical_claim": False})
    x = baseline_fixture(spec)
    records: dict[str, Any] = {}
    for name, values in representations(x, spec).items():
        result = adapter.adapt(values, analysis_id=f"translation-study:{name}", provenance=provenance, context=context)
        nodes, edges = adjacency_from_transitions(result.transitions)
        binary, weighted = certificates(nodes, edges, int(spec["weighted_certificate_decimals"]))
        records[name] = {
            "input_shape": list(values.shape),
            "input_sha256": sha256_bytes(np.asarray(values, dtype="<f8").tobytes()),
            "embedded_samples": result.alignment.embedded_samples,
            "regime_shift_count": len(result.raw_output["regime_shifts"]),
            "binary_support_certificate": binary,
            "weighted_certificate": weighted,
            "summary": graph_summary(nodes, edges),
            "raw_transitions": sorted(
                ({"source": a, "target": b, "probability": p} for (a, b), p in edges.items()),
                key=lambda row: (row["source"], row["target"]),
            ),
        }
    base = records["baseline_scalar"]
    comparisons = {}
    for name, row in records.items():
        if name == "baseline_scalar": continue
        comparisons[name] = {
            "support_isomorphic": row["binary_support_certificate"] == base["binary_support_certificate"],
            "weighted_isomorphic": row["weighted_certificate"] == base["weighted_certificate"],
            "scc_wcc_articulation_preserved": all(row["summary"][key] == base["summary"][key] for key in ("scc_sizes", "wcc_sizes", "weak_articulation_count")),
            "distance_multiset_preserved": row["summary"]["finite_directed_distance_multiset"] == base["summary"]["finite_directed_distance_multiset"],
            "probability_multiset_preserved": row["summary"]["transition_probability_multiset"] == base["summary"]["transition_probability_multiset"],
        }
    gate = {
        "H1_support_isomorphic": comparisons["nonlinear_injective_2d"]["support_isomorphic"],
        "H2_support_isomorphic": comparisons["delay_2d"]["support_isomorphic"],
        "H3_summaries_preserved_for_H1_H2": comparisons["nonlinear_injective_2d"]["scc_wcc_articulation_preserved"] and comparisons["delay_2d"]["scc_wcc_articulation_preserved"],
        "H5_noise_support_isomorphic": comparisons["small_noise"]["support_isomorphic"],
        "C2_structural_control_changes_relation": not all(comparisons["structural_shortcut"][key] for key in ("support_isomorphic", "scc_wcc_articulation_preserved", "distance_multiset_preserved", "probability_multiset_preserved")),
    }
    candidate = all(gate.values())
    return {
        "protocol_id": spec["protocol_id"],
        "protocol_sha256": protocol_hash(),
        "canonical_nexah_revision": spec["canonical_nexah_revision"],
        "canonical_source_hashes": source_hashes,
        "records": records,
        "comparisons_to_baseline": comparisons,
        "candidate_gate": gate,
        "candidate_cross_representation_invariant": candidate,
        "claim_boundary": {"physical_invariant": False, "predictive_capability": False, "early_warning": False, "stability_risk_control": False},
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    payload = canonical_bytes(run())
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.exists() and args.output.read_bytes() != payload:
        raise RuntimeError("OUTPUT_COLLISION_DIFFERENT_BYTES")
    args.output.write_bytes(payload)
    print(sha256_bytes(payload))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
