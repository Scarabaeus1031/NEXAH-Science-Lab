#!/usr/bin/env python3
"""Frozen replication/falsification runner for the canonical NEXAH v0.7 adapter."""

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
SPEC_PATH = PACKAGE / "replication_protocol.json"
PROTOCOL_FILES = (
    PACKAGE / "00_PRIOR_CANDIDATE_AUDIT.md",
    PACKAGE / "01_FROZEN_STRUCTURAL_CERTIFICATES.md",
    PACKAGE / "02_REPLICATION_PROTOCOL.md",
    PACKAGE / "03_STRUCTURAL_FAMILY_AND_COUNTERFACTUALS.md",
    SPEC_PATH,
)
CANONICAL_ROOT = Path("/Users/tho2020/Documents/GitHub/NEXAH")
CANONICAL_HASHES = {
    "nexah/core.py": "af8b831a8cb3242b12a66d1cd694dcdb65ca87aed531ea9038ea7453f145dbc0",
    "nexah/backends/v07.py": "c8f9f6be401992a1d9d50a0b2959fefaa10966a9d84f4874cf2ef93c067ff589",
}
COARSE = ("U1_support", "U2_scc_sizes", "U3_wcc_sizes", "U4_articulation_count", "U5_distances", "U6_edge_count", "U7_self_loop_count")
FINE = ("W1_probability_multiset", "W2_weighted_graph", "W3_regime_shift_count")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False) + "\n").encode()


def protocol_hash() -> str:
    return sha256(b"".join(path.name.encode() + b"\0" + path.read_bytes() for path in PROTOCOL_FILES))


def verify_sources() -> dict[str, str]:
    observed = {name: sha256((CANONICAL_ROOT / name).read_bytes()) for name in CANONICAL_HASHES}
    if observed != CANONICAL_HASHES:
        raise RuntimeError(f"CANONICAL_SOURCE_IDENTITY_MISMATCH:{observed}")
    return observed


def expand_dwells(raw: int | list[int], count: int) -> list[int]:
    if isinstance(raw, int):
        return [raw] * count
    if len(raw) != count:
        raise ValueError("DWELL_COUNT_MISMATCH")
    return [int(value) for value in raw]


def make_trajectory(family: dict[str, Any], counterfactual: bool) -> np.ndarray:
    sequence = family["counterfactual" if counterfactual else "base"]
    levels = family.get("counterfactual_levels", family["levels"]) if counterfactual else family["levels"]
    dwell_key = "counterfactual_dwells" if counterfactual and "counterfactual_dwells" in family else "dwells"
    dwells = expand_dwells(family[dwell_key], len(sequence))
    ramp = int(family["ramp_interior"])
    one: list[float] = []
    for index, state in enumerate(sequence):
        level = float(levels[state])
        one.extend([level] * dwells[index])
        if index + 1 < len(sequence):
            target = float(levels[sequence[index + 1]])
            one.extend(np.linspace(level, target, ramp + 2, dtype=np.float64)[1:-1].tolist())
    return np.tile(np.asarray(one, dtype=np.float64), int(family["repeats"]))


def representations(x: np.ndarray, family_index: int, spec: dict[str, Any]) -> dict[str, np.ndarray]:
    previous = np.concatenate(([x[0]], x[:-1]))
    rng = np.random.Generator(np.random.PCG64(int(spec["noise"]["base_seed"]) + family_index))
    sigma = float(spec["noise"]["sigma"])
    return {
        "R0_scalar": x,
        "R1_affine_redundant": np.column_stack((x, 1.7 * x - 0.4)),
        "R2_nonlinear_injective": np.column_stack((x, x ** 3)),
        "R3_delay": np.column_stack((x, previous)),
        "R4_small_noise": x + rng.normal(0.0, sigma, size=x.shape),
        "R5_factor2": x[::2],
        "L1_square": x ** 2,
        "L2_factor4": x[::4],
        "L3_sign_projection": np.sign(x),
    }


def adjacency(result: Any) -> tuple[list[str], dict[tuple[str, str], float]]:
    occupancy = result.raw_output["signature"]["occupancy"]
    nodes = sorted(str(key) for key in occupancy)
    edges = {(t.source.identifier.value, t.target.identifier.value): float(t.probability) for t in result.transitions}
    return nodes, edges


def matrices(nodes: list[str], edges: dict[tuple[str, str], float], order: tuple[str, ...]) -> tuple[tuple[float, ...], ...]:
    return tuple(tuple(edges.get((a, b), 0.0) for b in order) for a in order)


def graph_certificates(nodes: list[str], edges: dict[tuple[str, str], float], shifts: int, decimals: int) -> dict[str, Any]:
    binary, weighted = [], []
    for order in itertools.permutations(nodes):
        matrix = matrices(nodes, edges, order)
        binary.append(";".join("".join("1" if value > 0 else "0" for value in row) for row in matrix))
        weighted.append(";".join(",".join(f"{value:.{decimals}f}" for value in row) for row in matrix))
    adjacency_map = {node: {b for (a, b), p in edges.items() if a == node and p > 0 and b != node} for node in nodes}
    reverse = {node: set() for node in nodes}
    undirected = {node: set() for node in nodes}
    for a, targets in adjacency_map.items():
        for b in targets:
            reverse[b].add(a); undirected[a].add(b); undirected[b].add(a)

    def reach(start: str, graph: dict[str, set[str]]) -> set[str]:
        seen = {start}; queue = deque([start])
        while queue:
            for nxt in graph[queue.popleft()]:
                if nxt not in seen: seen.add(nxt); queue.append(nxt)
        return seen

    remaining = set(nodes); wcc = []
    while remaining:
        part = reach(min(remaining), undirected); wcc.append(len(part)); remaining -= part
    remaining = set(nodes); scc = []
    while remaining:
        seed = min(remaining)
        part = {n for n in nodes if n in reach(seed, adjacency_map) and seed in reach(n, adjacency_map)}
        scc.append(len(part)); remaining -= part
    base_components = len(wcc); articulation = 0
    for removed in nodes:
        kept = [n for n in nodes if n != removed]
        if not kept: continue
        reduced = {n: undirected[n] - {removed} for n in kept}
        rem = set(kept); count = 0
        while rem:
            part = reach(min(rem), reduced); rem -= part; count += 1
        articulation += count > base_components
    distances = []
    for start in nodes:
        dist = {start: 0}; queue = deque([start])
        while queue:
            source = queue.popleft()
            for target in adjacency_map[source]:
                if target not in dist: dist[target] = dist[source] + 1; queue.append(target)
        distances.extend(value for target, value in dist.items() if target != start)
    return {
        "U1_support": min(binary),
        "U2_scc_sizes": sorted(scc),
        "U3_wcc_sizes": sorted(wcc),
        "U4_articulation_count": articulation,
        "U5_distances": sorted(distances),
        "U6_edge_count": len(edges),
        "U7_self_loop_count": sum(a == b for a, b in edges),
        "W1_probability_multiset": sorted(round(p, decimals) for p in edges.values()),
        "W2_weighted_graph": min(weighted),
        "W3_regime_shift_count": shifts,
    }


def rate_class(value: float, spec: dict[str, Any]) -> str:
    if value >= spec["axis_thresholds"]["high_minimum"]: return "HIGH"
    if value >= spec["axis_thresholds"]["medium_minimum"]: return "MEDIUM"
    return "LOW"


def run() -> dict[str, Any]:
    sources = verify_sources()
    spec = json.loads(SPEC_PATH.read_text())
    sys.path.insert(0, str(CANONICAL_ROOT))
    from nexah.backends import V07BackendAdapter
    from nexah.orientation import Context, Provenance

    provenance = Provenance(source="preregistered-structural-family", method="replication/falsification", recorded_at=datetime(2026, 8, 13, 12, tzinfo=timezone.utc), record_id="translation-replication-v1")
    context = Context(domain="synthetic-translation-replication", values={"physical_claim": False})
    records: dict[str, Any] = {}
    errors: list[dict[str, str]] = []
    for family_index, family_id in enumerate(spec["families"]):
        family_spec = spec["family_specs"][family_id]
        records[family_id] = {}
        for variant, is_counter in (("base", False), ("counterfactual", True)):
            x = make_trajectory(family_spec, is_counter)
            reps = representations(x, family_index + (100 if is_counter else 0), spec)
            records[family_id][variant] = {}
            for config in spec["configurations"]:
                config_id = config["id"]
                adapter_args = {key: config[key] for key in ("n_clusters", "window", "random_state", "normalize")}
                adapter = V07BackendAdapter(**adapter_args)
                records[family_id][variant][config_id] = {}
                for rep_id, values in reps.items():
                    try:
                        result = adapter.adapt(values, analysis_id=f"rep:{family_id}:{variant}:{config_id}:{rep_id}", provenance=provenance, context=context)
                        nodes, edges = adjacency(result)
                        cert = graph_certificates(nodes, edges, len(result.raw_output["regime_shifts"]), int(spec["weighted_round_decimals"]))
                        records[family_id][variant][config_id][rep_id] = {
                            "status": "OK", "shape": list(values.shape),
                            "input_sha256": sha256(np.asarray(values, dtype="<f8").tobytes()),
                            "embedded_samples": result.alignment.embedded_samples,
                            "certificates": cert,
                            "public_raw_keys": sorted(result.raw_output),
                            "source_cluster_correspondence_available": "labels" in result.raw_output or "cluster_centers" in result.raw_output,
                        }
                    except Exception as exc:
                        message = f"{type(exc).__name__}:{exc}"
                        records[family_id][variant][config_id][rep_id] = {"status": "NOT_TESTABLE", "error": message}
                        errors.append({"family": family_id, "variant": variant, "configuration": config_id, "representation": rep_id, "error": message})

    representation_trials = {cert: [] for cert in COARSE + FINE}
    representation_by_config = {config["id"]: {cert: [] for cert in COARSE + FINE} for config in spec["configurations"]}
    structural_trials = {cert: [] for cert in COARSE + FINE}
    structural_by_config = {config["id"]: {cert: [] for cert in COARSE + FINE} for config in spec["configurations"]}
    family_outcomes: dict[str, Any] = {}
    for family_id in spec["families"]:
        family_outcomes[family_id] = {"representation": {}, "structural": {}}
        for config in spec["configurations"]:
            cid = config["id"]
            baseline = records[family_id]["base"][cid]["R0_scalar"]
            for cert in COARSE + FINE:
                comparisons = []
                if baseline["status"] == "OK":
                    for rep in spec["faithful_representations"][1:]:
                        row = records[family_id]["base"][cid][rep]
                        if row["status"] == "OK": comparisons.append(row["certificates"][cert] == baseline["certificates"][cert])
                outcome = "NOT_TESTABLE" if not comparisons else "PRESERVED" if all(comparisons) else "BROKEN" if not any(comparisons) else "PARTIALLY_PRESERVED"
                family_outcomes[family_id]["representation"].setdefault(cid, {})[cert] = outcome
                representation_trials[cert].extend(comparisons); representation_by_config[cid][cert].extend(comparisons)
                for rep in spec["faithful_representations"]:
                    left = records[family_id]["base"][cid][rep]; right = records[family_id]["counterfactual"][cid][rep]
                    if left["status"] == right["status"] == "OK":
                        detected = left["certificates"][cert] != right["certificates"][cert]
                        structural_trials[cert].append(detected); structural_by_config[cid][cert].append(detected)
        for cert in COARSE + FINE:
            vals = []
            for cid in representation_by_config:
                vals.extend([family_outcomes[family_id]["representation"][cid][cert] == "PRESERVED"])
            family_outcomes[family_id]["structural"][cert] = "DETECTED" if any(structural_by_config[cid][cert] for cid in structural_by_config) and any(any(structural_by_config[cid][cert]) for cid in structural_by_config) else "MISSED"

    certificate_summary = {}
    for cert in COARSE + FINE:
        rr = sum(representation_trials[cert]) / len(representation_trials[cert]) if representation_trials[cert] else 0.0
        sr = sum(structural_trials[cert]) / len(structural_trials[cert]) if structural_trials[cert] else 0.0
        by_config = {cid: (sum(vals) / len(vals) if vals else None) for cid, table in representation_by_config.items() for vals in [table[cert]]}
        finite = [v for v in by_config.values() if v is not None]
        certificate_summary[cert] = {
            "representation_preserved": sum(representation_trials[cert]), "representation_trials": len(representation_trials[cert]), "representation_rate": rr, "representation_axis": rate_class(rr, spec),
            "structural_detected": sum(structural_trials[cert]), "structural_trials": len(structural_trials[cert]), "structural_rate": sr, "structural_axis": rate_class(sr, spec),
            "representation_rate_by_configuration": by_config,
            "configuration_range": max(finite) - min(finite) if finite else None,
        }
    support = certificate_summary["U1_support"]
    config_dependent = support["configuration_range"] is not None and support["configuration_range"] >= spec["configuration_dependence_minimum_range"]
    high_high = [cert for cert, row in certificate_summary.items() if row["representation_axis"] == row["structural_axis"] == "HIGH" and cert not in ("W3_regime_shift_count",)]
    if high_high and not config_dependent:
        disposition = "CANDIDATE_REPLICATED_ROBUST_AND_DISCRIMINATIVE"
    elif support["representation_axis"] == "HIGH" and support["structural_axis"] != "HIGH":
        disposition = "CANDIDATE_REPLICATED_ROBUST_BUT_LOSSY"
    elif config_dependent:
        disposition = "CANDIDATE_CONFIGURATION_DEPENDENT"
    elif support["representation_axis"] == "LOW":
        disposition = "CANDIDATE_NOT_REPLICATED"
    else:
        disposition = "INCONCLUSIVE"
    return {
        "protocol_id": spec["protocol_id"], "protocol_sha256": protocol_hash(),
        "canonical_nexah_revision": spec["canonical_nexah_revision"], "canonical_source_hashes": sources,
        "counts": {"base_families": len(spec["families"]), "faithful_representations": len(spec["faithful_representations"]), "lossy_controls": len(spec["lossy_controls"]), "counterfactuals": len(spec["families"]), "configurations": len(spec["configurations"])},
        "certificate_summary": certificate_summary, "family_outcomes": family_outcomes,
        "not_testable_errors": errors, "records": records,
        "source_to_cluster_correspondence": "NOT_AVAILABLE_IN_PUBLIC_RAW_OUTPUT",
        "high_robustness_high_sensitivity_certificates": high_high,
        "scientific_disposition": disposition,
        "firewall": {"canonical_operators_changed": False, "application_001_changed": False, "level1c_changed": False, "ieee_pegase_executed": False, "post_result_retuning": False},
    }


def main() -> int:
    parser = argparse.ArgumentParser(); parser.add_argument("--output", type=Path, required=True); args = parser.parse_args()
    data = canonical_bytes(run()); args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.exists() and args.output.read_bytes() != data: raise RuntimeError("OUTPUT_COLLISION_DIFFERENT_BYTES")
    args.output.write_bytes(data); print(sha256(data)); return 0


if __name__ == "__main__": raise SystemExit(main())
