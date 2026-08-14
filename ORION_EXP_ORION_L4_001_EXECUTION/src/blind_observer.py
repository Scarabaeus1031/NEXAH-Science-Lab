from __future__ import annotations

import argparse
import hashlib
from pathlib import Path

import numpy as np

from l4_core import pair_kappa, pair_summary, rank_pair_signs, save_json, save_npz_deterministic, sha256_file, sha_seed, tau_rows_from_signs


def null_for_pair(left: np.ndarray, right: np.ndarray, seed_ids: np.ndarray, seed: int, replicates: int = 4999) -> np.ndarray:
    left_signs = rank_pair_signs(left)
    right_signs = rank_pair_signs(right)
    blocks = [np.flatnonzero(seed_ids == value) for value in np.unique(seed_ids)]
    rng = np.random.default_rng(seed)
    values = np.empty(replicates, dtype=np.float64)
    base = np.arange(len(left))
    for replicate in range(replicates):
        permutation = base.copy()
        for block in blocks:
            permutation[block] = rng.permutation(block)
        tau = tau_rows_from_signs(left_signs, right_signs[permutation])
        values[replicate] = ((1.0 + tau) / 2.0).mean()
    return values


def quantile_higher(values: np.ndarray, probability: float) -> float:
    ordered = np.sort(np.asarray(values))
    index = int(np.ceil(probability * len(ordered))) - 1
    return float(ordered[max(0, min(index, len(ordered) - 1))])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--r0", required=True)
    parser.add_argument("--r1", required=True)
    parser.add_argument("--r2", required=True)
    parser.add_argument("--seed-ids", required=True)
    parser.add_argument("--input-manifest-hash", required=True)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()
    output = Path(args.output_dir).resolve()
    output.mkdir(parents=True, exist_ok=False)
    paths = {"R0": Path(args.r0).resolve(), "R1": Path(args.r1).resolve(), "R2": Path(args.r2).resolve()}
    candidates = {name: np.load(path, allow_pickle=False) for name, path in paths.items()}
    query_ids = candidates["R0"]["query_ids"]
    for name, candidate in candidates.items():
        if not np.array_equal(query_ids, candidate["query_ids"]):
            raise ValueError(f"query identity mismatch for {name}")
    seed_ids_all = np.load(Path(args.seed_ids).resolve(), allow_pickle=False)["test_seed_ids"]
    supports = {name: candidate["support"].astype(bool) for name, candidate in candidates.items()}
    joint = supports["R0"] & supports["R1"] & supports["R2"]
    fixed_indices = np.flatnonzero(joint)
    if not len(fixed_indices):
        raise ValueError("empty joint support")
    seed_ids = seed_ids_all[fixed_indices]
    ranks = {name: candidate["ranks"][fixed_indices] for name, candidate in candidates.items()}

    pair_ids = [("R0", "R1"), ("R0", "R2"), ("R1", "R2")]
    pair_results = {}
    null_payload = {}
    for left, right in pair_ids:
        pair_id = f"{left}_{right}"
        observed = pair_summary(ranks[left], ranks[right])
        seed = sha_seed("L4-NULL" + pair_id, args.input_manifest_hash)
        null = null_for_pair(ranks[left], ranks[right], seed_ids, seed)
        quantile = quantile_higher(null, 0.99)
        p_value = float((1 + np.sum(null >= observed["mean_kappa"])) / 5000.0)
        pair_results[pair_id] = {
            **observed,
            "null_99_quantile_higher": quantile,
            "null_mean": float(null.mean()),
            "null_seed": int(seed),
            "p_value": p_value,
        }
        null_payload[pair_id] = null

    save_npz_deterministic(output / "null_distributions.npz", **null_payload)
    save_npz_deterministic(output / "joint_population.npz", indices=fixed_indices, query_ids=query_ids[fixed_indices], seed_ids=seed_ids)
    observed = {
        "candidate_input_sha256": {name: sha256_file(path) for name, path in paths.items()},
        "input_manifest_hash": args.input_manifest_hash,
        "joint_query_count": int(len(fixed_indices)),
        "joint_support_fraction": float(joint.mean()),
        "k_min": float(min(value["mean_kappa"] for value in pair_results.values())),
        "out_of_support_fraction": {name: float(1.0 - support.mean()) for name, support in supports.items()},
        "pair_results": pair_results,
        "query_total": int(len(query_ids)),
    }
    save_json(output / "observed_metrics.json", observed)
    seal = {
        "joint_population_sha256": sha256_file(output / "joint_population.npz"),
        "null_distributions_sha256": sha256_file(output / "null_distributions.npz"),
        "observed_metrics_sha256": sha256_file(output / "observed_metrics.json"),
        "observer_has_expected_class_access": False,
        "observer_has_claim_threshold_access": False,
    }
    save_json(output / "OBSERVER_SEAL.json", seal)


if __name__ == "__main__":
    main()
