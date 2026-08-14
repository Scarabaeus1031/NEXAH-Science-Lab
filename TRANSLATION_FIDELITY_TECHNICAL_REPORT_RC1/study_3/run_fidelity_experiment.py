#!/usr/bin/env python3
"""Frozen independent translation-fidelity experiment.

This module deliberately contains no NEXAH, v0.7, KMeans, windowing or graph
library dependency.  NumPy is used only for numeric arrays and PCG64 noise.
"""

from __future__ import annotations

import argparse
from collections import deque
import hashlib
import itertools
import json
from pathlib import Path
from typing import Any

import numpy as np


PACKAGE = Path(__file__).resolve().parent
SPEC_PATH = PACKAGE / "experiment_protocol.json"
PROTOCOL_PATHS = (
    PACKAGE / "00_PRIOR_EVIDENCE_AUDIT.md",
    PACKAGE / "01_INDEPENDENT_PROTOCOL.md",
    PACKAGE / "02_CERTIFICATE_AND_INFORMATION_LADDER.md",
    SPEC_PATH,
)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False) + "\n").encode()


def protocol_hash() -> str:
    payload = b"".join(path.name.encode() + b"\0" + path.read_bytes() for path in PROTOCOL_PATHS)
    return sha256(payload)


def make_system(family: dict[str, Any], counterfactual: bool, spec: dict[str, Any]) -> tuple[np.ndarray, np.ndarray]:
    walk = family["counterfactual" if counterfactual else "base"]
    walk = walk * int(family["repeats"])
    dwell = int(spec["dwell"])
    labels = np.repeat(np.asarray(walk, dtype=np.int64), dwell)
    prototypes = np.asarray(family.get("prototype_override", spec["prototypes"]), dtype=np.float64)
    within = np.tile(np.arange(dwell, dtype=np.float64), len(walk))
    phase = 2.0 * np.pi * within / dwell
    jitter = float(spec["observation_jitter"])
    observations = prototypes[labels].copy()
    observations[:, 0] += jitter * np.sin(phase)
    observations[:, 1] += jitter * np.cos(phase + 0.37 * labels)
    return observations, labels


def representations(x: np.ndarray, labels: np.ndarray, seed: int, noise_sigma: float) -> dict[str, tuple[np.ndarray, np.ndarray, np.ndarray]]:
    indices = np.arange(len(x), dtype=np.int64)
    previous = np.vstack((x[0], x[:-1]))
    rng = np.random.Generator(np.random.PCG64(seed))
    return {
        "R0_baseline": (x, labels, indices),
        "R1_affine_redundant": (
            np.column_stack((2.0 * x[:, 0] + 0.3 * x[:, 1] + 1.0,
                             -0.4 * x[:, 0] + 1.5 * x[:, 1] - 0.2,
                             x[:, 0] + x[:, 1])), labels, indices),
        "R2_nonlinear_injective": (
            np.column_stack((x[:, 0], x[:, 1], x[:, 0] ** 3, x[:, 1] ** 3,
                             x[:, 0] * x[:, 1])), labels, indices),
        "R3_delay": (np.column_stack((x, previous)), labels, indices),
        "R4_small_noise": (x + rng.normal(0.0, noise_sigma, size=x.shape), labels, indices),
        "R5_factor2": (x[::2], labels[::2], indices[::2]),
        "L1_even_projection": ((x[:, :1] ** 2 + 0.2 * x[:, 1:2] ** 2), labels, indices),
        "L2_factor5": (x[::5], labels[::5], indices[::5]),
        "L3_sign_threshold": (np.sign(x), labels, indices),
    }


def normalize_global(x: np.ndarray, floor: float) -> np.ndarray:
    centered = np.asarray(x, dtype=np.float64) - np.mean(x, axis=0, keepdims=True)
    rms = float(np.sqrt(np.mean(centered * centered)))
    if not np.isfinite(rms) or rms <= floor:
        raise ValueError("DEGENERATE_GLOBAL_RMS")
    return centered / rms


def squared_distances(x: np.ndarray, medoid_indices: list[int]) -> np.ndarray:
    delta = x[:, None, :] - x[np.asarray(medoid_indices)][None, :, :]
    return np.sum(delta * delta, axis=2)


def deterministic_k_medoids(x: np.ndarray, k: int, spec: dict[str, Any]) -> tuple[np.ndarray, list[int]]:
    z = normalize_global(x, float(spec["decoder"]["global_rms_floor"]))
    if len(z) < k:
        raise ValueError("FEWER_SAMPLES_THAN_STATES")
    # Farthest-first initialization begins with the lexicographically smallest row.
    first = min(range(len(z)), key=lambda i: tuple(z[i].tolist()) + (i,))
    medoids = [first]
    while len(medoids) < k:
        nearest = np.min(squared_distances(z, medoids), axis=1)
        nearest[medoids] = -1.0
        candidate = int(np.argmax(nearest))
        if nearest[candidate] <= float(spec["decoder"]["tie_tolerance"]):
            raise ValueError("INSUFFICIENT_DISTINCT_GEOMETRY")
        medoids.append(candidate)

    for _ in range(int(spec["decoder"]["max_iterations"])):
        assignment = np.argmin(squared_distances(z, medoids), axis=1).astype(np.int64)
        updated: list[int] = []
        for cluster in range(k):
            members = np.flatnonzero(assignment == cluster)
            if not len(members):
                raise ValueError("EMPTY_CLUSTER")
            block = z[members]
            pairwise = np.sum((block[:, None, :] - block[None, :, :]) ** 2, axis=2)
            costs = np.sum(pairwise, axis=1)
            updated.append(int(members[int(np.argmin(costs))]))
        if updated == medoids:
            break
        medoids = updated
    assignment = np.argmin(squared_distances(z, medoids), axis=1).astype(np.int64)
    return assignment, medoids


def align_clusters(clusters: np.ndarray, latent: np.ndarray, k: int) -> tuple[np.ndarray, dict[str, Any]]:
    overlap = np.zeros((k, k), dtype=np.int64)
    for cluster, state in zip(clusters, latent, strict=True):
        overlap[int(cluster), int(state)] += 1
    best = max(itertools.permutations(range(k)), key=lambda p: (sum(overlap[c, p[c]] for c in range(k)), tuple(-v for v in p)))
    aligned = np.asarray([best[int(cluster)] for cluster in clusters], dtype=np.int64)
    dominant = [int(np.argmax(overlap[c])) for c in range(k)]
    source_dominants = [int(np.argmax(overlap[:, s])) for s in range(k)]
    collision_pairs = sum(source_dominants[a] == source_dominants[b] for a in range(k) for b in range(a + 1, k))
    recalls = []
    for state in range(k):
        mask = latent == state
        recalls.append(float(np.mean(aligned[mask] == state)) if np.any(mask) else None)
    return aligned, {
        "cluster_to_source": {str(c): int(best[c]) for c in range(k)},
        "overlap_matrix": overlap.tolist(),
        "cluster_dominant_source": dominant,
        "source_dominant_cluster": source_dominants,
        "dominant_collision_pairs": int(collision_pairs),
        "aligned_accuracy": float(np.mean(aligned == latent)),
        "per_state_recall": recalls,
    }


def transition_counts(labels: np.ndarray, k: int) -> np.ndarray:
    counts = np.zeros((k, k), dtype=np.int64)
    for a, b in zip(labels[:-1], labels[1:], strict=True):
        counts[int(a), int(b)] += 1
    return counts


def probabilities(counts: np.ndarray) -> np.ndarray:
    totals = np.sum(counts, axis=1, keepdims=True)
    return np.divide(counts, totals, out=np.zeros_like(counts, dtype=np.float64), where=totals > 0)


def component_sizes(support: np.ndarray) -> tuple[list[int], list[int]]:
    k = len(support)
    directed = {i: set(np.flatnonzero(support[i]).tolist()) - {i} for i in range(k)}
    reverse = {i: set() for i in range(k)}
    weak = {i: set() for i in range(k)}
    for a, targets in directed.items():
        for b in targets:
            reverse[b].add(a); weak[a].add(b); weak[b].add(a)

    def reach(start: int, graph: dict[int, set[int]]) -> set[int]:
        seen = {start}; queue = deque([start])
        while queue:
            for nxt in graph[queue.popleft()]:
                if nxt not in seen:
                    seen.add(nxt); queue.append(nxt)
        return seen

    remaining = set(range(k)); wcc: list[int] = []
    while remaining:
        group = reach(min(remaining), weak); wcc.append(len(group)); remaining -= group
    remaining = set(range(k)); scc: list[int] = []
    while remaining:
        seed = min(remaining)
        forward = reach(seed, directed); backward = reach(seed, reverse)
        group = forward & backward
        scc.append(len(group)); remaining -= group
    return sorted(scc), sorted(wcc)


def rank_positive(counts: np.ndarray) -> list[int]:
    positives = sorted(set(int(v) for v in counts.flat if v > 0))
    ranks = {value: rank + 1 for rank, value in enumerate(positives)}
    return [ranks.get(int(value), 0) for value in counts.flat]


def probability_bins(prob: np.ndarray, edges: list[float]) -> list[int]:
    result = []
    for value in prob.flat:
        result.append(0 if value == 0 else int(np.searchsorted(edges, value, side="right")))
    return result


def certificates(counts: np.ndarray, spec: dict[str, Any]) -> dict[str, Any]:
    support = counts > 0
    prob = probabilities(counts)
    scc, wcc = component_sizes(support)
    return {
        "C0_components": [len(counts), scc, wcc],
        "C1_support": support.astype(int).tolist(),
        "C2_counts_exact": counts.tolist(),
        "C3_count_ranks": rank_positive(counts),
        "C4_probability_bins": probability_bins(prob, spec["probability_bins"]),
        "C5_probabilities_2dp": np.round(prob, 2).tolist(),
        "C6_probabilities_12dp": np.round(prob, 12).tolist(),
    }


def fidelity(oracle: np.ndarray, derived: np.ndarray) -> dict[str, Any]:
    oracle_support = oracle > 0; derived_support = derived > 0
    tp = int(np.sum(oracle_support & derived_support))
    fp = int(np.sum(~oracle_support & derived_support))
    fn = int(np.sum(oracle_support & ~derived_support))
    positive_counts = [int(v) for v in derived.flat if v > 0]
    positive_weights = [round(float(v), 12) for v in probabilities(derived).flat if v > 0]
    return {
        "support_true_positive": tp,
        "support_false_positive": fp,
        "support_false_negative": fn,
        "edge_recall": tp / (tp + fn) if tp + fn else 1.0,
        "edge_precision": tp / (tp + fp) if tp + fp else 1.0,
        "probability_mae": float(np.mean(np.abs(probabilities(oracle) - probabilities(derived)))),
        "distinct_positive_counts": len(set(positive_counts)),
        "distinct_positive_weights": len(set(positive_weights)),
    }


def run_cell(x: np.ndarray, latent: np.ndarray, indices: np.ndarray, k: int, spec: dict[str, Any]) -> dict[str, Any]:
    clusters, medoids = deterministic_k_medoids(x, k, spec)
    aligned, correspondence = align_clusters(clusters, latent, k)
    derived_counts = transition_counts(aligned, k)
    oracle_counts = transition_counts(latent, k)
    rows = [
        {"source_index": int(source), "latent_state": int(state), "derived_cluster": int(cluster), "aligned_graph_node": int(node)}
        for source, state, cluster, node in zip(indices, latent, clusters, aligned, strict=True)
    ]
    return {
        "status": "OK",
        "shape": list(x.shape),
        "input_sha256": sha256(np.asarray(x, dtype="<f8").tobytes()),
        "medoid_source_rows": [int(i) for i in medoids],
        "correspondence": correspondence,
        "sample_correspondence": rows,
        "oracle_counts": oracle_counts.tolist(),
        "derived_counts": derived_counts.tolist(),
        "certificates": certificates(derived_counts, spec),
        "information_fidelity": fidelity(oracle_counts, derived_counts),
    }


def rate_class(value: float, spec: dict[str, Any]) -> str:
    if value >= float(spec["axis_thresholds"]["high_minimum"]):
        return "HIGH"
    if value >= float(spec["axis_thresholds"]["medium_minimum"]):
        return "MEDIUM"
    return "LOW"


def average_ranks(values: list[float]) -> list[float]:
    order = sorted(range(len(values)), key=lambda i: values[i])
    ranks = [0.0] * len(values)
    start = 0
    while start < len(order):
        end = start + 1
        while end < len(order) and values[order[end]] == values[order[start]]:
            end += 1
        rank = (start + 1 + end) / 2.0
        for position in order[start:end]:
            ranks[position] = rank
        start = end
    return ranks


def pearson(x: list[float], y: list[float]) -> float:
    xa = np.asarray(x, dtype=np.float64); ya = np.asarray(y, dtype=np.float64)
    if np.std(xa) == 0 or np.std(ya) == 0:
        return 0.0
    return float(np.corrcoef(xa, ya)[0, 1])


def spearman(x: list[float], y: list[float]) -> float:
    return pearson(average_ranks(x), average_ranks(y))


def analyze(records: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    faithful = spec["representations"]["faithful"]
    lossy = spec["representations"]["lossy"]
    cert_ids = spec["certificates"]
    representation_trials = {c: [] for c in cert_ids}
    structural_trials = {c: [] for c in cert_ids}
    by_transform = {c: {r: [] for r in faithful[1:]} for c in cert_ids}
    mapping_accuracies: list[float] = []
    faithful_cells = not_testable = 0
    for family in records.values():
        for variant in ("base", "counterfactual"):
            base = family[variant]["R0_baseline"]
            for rep in faithful:
                faithful_cells += 1
                row = family[variant][rep]
                if row["status"] != "OK":
                    not_testable += 1
                else:
                    mapping_accuracies.append(row["correspondence"]["aligned_accuracy"])
            for cert in cert_ids:
                if base["status"] == "OK":
                    for rep in faithful[1:]:
                        row = family[variant][rep]
                        if row["status"] == "OK":
                            same = row["certificates"][cert] == base["certificates"][cert]
                            representation_trials[cert].append(same)
                            by_transform[cert][rep].append(same)
        for cert in cert_ids:
            for rep in faithful:
                left = family["base"][rep]; right = family["counterfactual"][rep]
                if left["status"] == right["status"] == "OK":
                    structural_trials[cert].append(left["certificates"][cert] != right["certificates"][cert])

    summaries: dict[str, Any] = {}
    systems = [(fid, variant) for fid in records for variant in ("base", "counterfactual")]
    for level, cert in enumerate(cert_ids):
        a = representation_trials[cert]; b = structural_trials[cert]
        rr = sum(a) / len(a) if a else 0.0; sd = sum(b) / len(b) if b else 0.0
        per_transform = {rep: (sum(vals) / len(vals) if vals else None) for rep, vals in by_transform[cert].items()}
        r0_values = [canonical_bytes(records[f][v]["R0_baseline"]["certificates"][cert]) for f, v in systems if records[f][v]["R0_baseline"]["status"] == "OK"]
        unique = len(set(r0_values)); collision_pairs = len(r0_values) * (len(r0_values) - 1) // 2
        collision_pairs -= sum(n * (n - 1) // 2 for n in {value: r0_values.count(value) for value in set(r0_values)}.values())
        # The requested collision count is pairs collapsed together, not distinct pairs.
        induced = sum(n * (n - 1) // 2 for n in {value: r0_values.count(value) for value in set(r0_values)}.values())
        r0_detected = sum(records[f]["base"]["R0_baseline"]["certificates"][cert] != records[f]["counterfactual"]["R0_baseline"]["certificates"][cert] for f in records)
        summaries[cert] = {
            "detail_level": level,
            "representation_preserved": sum(a), "representation_trials": len(a),
            "representation_rate": rr, "axis_a": rate_class(rr, spec),
            "structural_detected": sum(b), "structural_trials": len(b),
            "structural_rate": sd, "axis_b": rate_class(sd, spec),
            "preservation_by_transform": per_transform,
            "r0_unique_certificates": unique, "r0_systems": len(r0_values),
            "r0_unique_fraction": unique / len(r0_values) if r0_values else 0.0,
            "r0_induced_collision_pairs": induced,
            "r0_counterfactual_detected": r0_detected,
            "r0_counterfactual_destroyed": len(records) - r0_detected,
        }

    representation_fidelity: dict[str, Any] = {}
    for rep in faithful + lossy:
        rows = [records[f][v][rep] for f, v in systems]
        ok = [row for row in rows if row["status"] == "OK"]
        representation_fidelity[rep] = {
            "ok_cells": len(ok), "not_testable_cells": len(rows) - len(ok),
            "mean_aligned_accuracy": float(np.mean([row["correspondence"]["aligned_accuracy"] for row in ok])) if ok else None,
            "mean_edge_recall": float(np.mean([row["information_fidelity"]["edge_recall"] for row in ok])) if ok else None,
            "mean_edge_precision": float(np.mean([row["information_fidelity"]["edge_precision"] for row in ok])) if ok else None,
            "mean_probability_mae": float(np.mean([row["information_fidelity"]["probability_mae"] for row in ok])) if ok else None,
            "dominant_collision_pairs": int(sum(row["correspondence"]["dominant_collision_pairs"] for row in ok)),
        }

    lossy_summary: dict[str, Any] = {}
    for rep in lossy:
        lossy_summary[rep] = {}
        for cert in cert_ids:
            comparisons = []
            for family in records.values():
                for variant in ("base", "counterfactual"):
                    base = family[variant]["R0_baseline"]; row = family[variant][rep]
                    if base["status"] == row["status"] == "OK":
                        comparisons.append(base["certificates"][cert] == row["certificates"][cert])
            lossy_summary[rep][cert] = {
                "preserved": sum(comparisons), "trials": len(comparisons),
                "preservation_rate": sum(comparisons) / len(comparisons) if comparisons else None,
            }

    gate = spec["high_high_gate"]
    mean_mapping = float(np.mean(mapping_accuracies)) if mapping_accuracies else 0.0
    candidates = []
    for cert, row in summaries.items():
        key_ok = all(row["preservation_by_transform"][rep] is not None and row["preservation_by_transform"][rep] >= gate["key_transform_preservation_minimum"] for rep in gate["key_transforms"])
        qualifies = (
            row["axis_a"] == row["axis_b"] == "HIGH"
            and cert not in gate["ineligible"]
            and mean_mapping >= gate["mapping_accuracy_minimum"]
            and row["r0_unique_fraction"] >= gate["r0_unique_fraction_minimum"]
            and row["r0_counterfactual_detected"] >= gate["r0_counterfactual_detections_minimum"]
            and key_ok
        )
        row["high_high_gate_qualified"] = qualifies
        if qualifies:
            candidates.append(cert)

    robustness = [summaries[c]["representation_rate"] for c in cert_ids]
    discrimination = [summaries[c]["structural_rate"] for c in cert_ids]
    detail = list(range(len(cert_ids)))
    associations = {
        "spearman_detail_vs_robustness": spearman(detail, robustness),
        "spearman_detail_vs_discrimination": spearman(detail, discrimination),
        "spearman_robustness_vs_discrimination": spearman(robustness, discrimination),
    }
    nt_fraction = not_testable / faithful_cells if faithful_cells else 1.0
    threshold = float(spec["decision"]["association_absolute_minimum"])
    if nt_fraction > float(spec["decision"]["max_faithful_not_testable_fraction"]):
        disposition = "INCONCLUSIVE"
    elif candidates:
        disposition = "HIGH_HIGH_CERTIFICATE_CANDIDATE_FOUND"
    elif (associations["spearman_detail_vs_robustness"] <= -threshold
          and associations["spearman_detail_vs_discrimination"] >= threshold
          and associations["spearman_robustness_vs_discrimination"] <= -threshold):
        disposition = "ROBUSTNESS_INFORMATION_TRADEOFF_CANDIDATE"
    elif (summaries["C1_support"]["axis_a"] == "HIGH" and summaries["C1_support"]["axis_b"] == "LOW"
          and summaries["C6_probabilities_12dp"]["axis_a"] == "LOW" and summaries["C6_probabilities_12dp"]["axis_b"] == "HIGH"):
        disposition = "TRADEOFF_REPLICATED_BUT_IMPLEMENTATION_SPECIFIC"
    else:
        disposition = "TRADEOFF_NOT_REPLICATED"
    return {
        "certificate_summary": summaries,
        "associations": associations,
        "mean_faithful_aligned_state_accuracy": mean_mapping,
        "faithful_cells": faithful_cells,
        "faithful_not_testable": not_testable,
        "faithful_not_testable_fraction": nt_fraction,
        "high_high_candidates": candidates,
        "representation_fidelity": representation_fidelity,
        "lossy_control_summary": lossy_summary,
        "scientific_disposition": disposition,
    }


def run() -> dict[str, Any]:
    spec = json.loads(SPEC_PATH.read_text())
    records: dict[str, Any] = {}
    errors: list[dict[str, str]] = []
    k = len(spec["prototypes"])
    all_reps = spec["representations"]["faithful"] + spec["representations"]["lossy"]
    for family_index, (family_id, family) in enumerate(spec["families"].items()):
        records[family_id] = {}
        for variant, is_counter in (("base", False), ("counterfactual", True)):
            source_x, source_labels = make_system(family, is_counter, spec)
            seed = int(spec["noise"]["base_seed"]) + 100 * family_index + int(is_counter)
            reps = representations(source_x, source_labels, seed, float(spec["noise"]["sigma"]))
            records[family_id][variant] = {}
            for rep_id in all_reps:
                x, latent, indices = reps[rep_id]
                try:
                    records[family_id][variant][rep_id] = run_cell(x, latent, indices, k, spec)
                except Exception as exc:
                    message = f"{type(exc).__name__}:{exc}"
                    records[family_id][variant][rep_id] = {"status": "NOT_TESTABLE", "error": message, "shape": list(x.shape)}
                    errors.append({"family": family_id, "variant": variant, "representation": rep_id, "error": message})
    analysis = analyze(records, spec)
    return {
        "protocol_id": spec["protocol_id"],
        "protocol_sha256": protocol_hash(),
        "implementation_sha256": sha256(Path(__file__).read_bytes()),
        "independence": spec["independence"],
        "counts": {"families": len(spec["families"]), "counterfactuals": len(spec["families"]), "faithful_representations": len(spec["representations"]["faithful"]), "lossy_controls": len(spec["representations"]["lossy"]), "cells": len(spec["families"]) * 2 * len(all_reps)},
        "errors": errors,
        "records": records,
        **analysis,
        "firewall": {"canonical_nexah_imported": False, "canonical_repositories_changed": False, "ieee_pegase_executed": False, "early_warning_reopened": False, "application_001_changed": False, "post_result_retuning": False},
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    payload = canonical_bytes(run())
    if args.output.exists() and args.output.read_bytes() != payload:
        raise RuntimeError("OUTPUT_COLLISION_DIFFERENT_BYTES")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(payload)
    print(sha256(payload))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
