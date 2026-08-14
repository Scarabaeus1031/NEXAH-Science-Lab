from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

from tnspa_core import null_seed, quantile_higher, save_json, save_npz, sha, tnspa


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--relations", required=True)
    parser.add_argument("--observer-seal", required=True)
    parser.add_argument("--observed", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    relation_path = Path(args.relations).resolve()
    seal_path = Path(args.observer_seal).resolve()
    observed_path = Path(args.observed).resolve()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    import json
    seal = json.loads(seal_path.read_text())
    if not seal.get("sealed") or seal["relations_sha256"] != sha(relation_path) or seal["observed_metrics_sha256"] != sha(observed_path):
        raise RuntimeError("observer seal invalid")
    observed = json.loads(observed_path.read_text())
    data = np.load(relation_path, allow_pickle=False)
    seed_ids = data["seed_ids"]
    blocks = [np.flatnonzero(seed_ids == seed) for seed in np.unique(seed_ids)]
    base = np.arange(len(seed_ids))
    pair_ids = (("R0", "R1"), ("R0", "R2"), ("R1", "R2"))
    summaries = {}
    distributions = {}
    for left, right in pair_ids:
        pair_id = f"{left}_{right}"
        rng_seed = null_seed(pair_id)
        rng = np.random.default_rng(rng_seed)
        values = np.empty(9999, dtype=np.float64)
        first, second = data[left], data[right]
        for replicate in range(9999):
            permutation = base.copy()
            for block in blocks:
                permutation[block] = rng.permutation(block)
            values[replicate] = tnspa(first, second[permutation])
        observed_value = float(observed["pair_results"][pair_id]["TNSPA"])
        q99 = quantile_higher(values, 0.99)
        p_value = float((1 + np.sum(values >= observed_value)) / 10000.0)
        summaries[pair_id] = {
            "observed_TNSPA": observed_value,
            "null_mean": float(values.mean()),
            "null_sd": float(values.std()),
            "null_q99_higher": q99,
            "observed_gt_q99": bool(observed_value > q99),
            "p_value": p_value,
            "p_le_0_01": bool(p_value <= 0.01),
            "replicates": 9999,
            "seed": int(rng_seed),
        }
        distributions[pair_id] = values
    save_npz(output / "null_distributions.npz", **distributions)
    save_json(output / "null_summary.json", summaries)
    save_json(output / "NULL_SEAL.json", {"null_distributions_sha256": sha(output / "null_distributions.npz"), "null_summary_sha256": sha(output / "null_summary.json"), "observer_seal_sha256": sha(seal_path), "replicates_each_pair": 9999})


if __name__ == "__main__":
    main()
