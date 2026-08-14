from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

from tnspa_core import ACTION_IDS, ACTION_PAIRS, EXPECTED_INPUT_HASHES, encode_relations, save_json, save_npz, sha


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--l4-root", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    l4 = Path(args.l4_root).resolve()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    source_path = l4 / "raw" / "source_products.npz"
    candidate_paths = {rep: l4 / "extractions" / "primary" / "candidates" / rep / "candidate.npz" for rep in ("R0", "R1", "R2")}
    actual_hashes = {"source_products.npz": sha(source_path), **{f"{rep}_candidate.npz": sha(path) for rep, path in candidate_paths.items()}}
    expected_subset = {key: EXPECTED_INPUT_HASHES[key] for key in actual_hashes}
    if actual_hashes != expected_subset:
        raise RuntimeError("authentic input hash mismatch")
    source = np.load(source_path, allow_pickle=False)
    candidates = {rep: np.load(path, allow_pickle=False) for rep, path in candidate_paths.items()}
    query_ids = candidates["R0"]["query_ids"]
    for rep in ("R1", "R2"):
        if not np.array_equal(query_ids, candidates[rep]["query_ids"]):
            raise RuntimeError("query identity mismatch")
    supports = {rep: candidates[rep]["support"].astype(bool) for rep in candidates}
    joint = supports["R0"] & supports["R1"] & supports["R2"]
    indices = np.flatnonzero(joint)
    if len(indices) != 1399:
        raise RuntimeError("joint support must contain exactly 1399 states")
    relations = {rep: encode_relations(candidates[rep]["ranks"][indices]) for rep in candidates}
    if any(value.shape != (1399, 21) for value in relations.values()):
        raise RuntimeError("relation cardinality mismatch")
    if any(not np.isin(value, [-1, 0, 1]).all() for value in relations.values()):
        raise RuntimeError("relation alphabet violation")
    top_masks = {rep: candidates[rep]["ranks"][indices] == candidates[rep]["ranks"][indices].min(axis=1, keepdims=True) for rep in candidates}
    seed_ids = source["test_seed_ids"][indices]
    save_npz(
        output / "relations.npz",
        query_ids=query_ids[indices], seed_ids=seed_ids, original_indices=indices,
        R0=relations["R0"], R1=relations["R1"], R2=relations["R2"],
        R0_top=top_masks["R0"], R1_top=top_masks["R1"], R2_top=top_masks["R2"],
    )
    ledger = {
        "action_ids": list(ACTION_IDS),
        "action_pair_count": len(ACTION_PAIRS),
        "action_pairs_stable_indices": [list(pair) for pair in ACTION_PAIRS],
        "input_hashes": actual_hashes,
        "joint_support_count": int(len(indices)),
        "relation_alphabet": [-1, 0, 1],
        "relation_counts": {
            rep: {"strict_cells": int(np.sum(relations[rep] != 0)), "tie_cells": int(np.sum(relations[rep] == 0)), "total_cells": int(relations[rep].size)}
            for rep in relations
        },
        "relations_sha256": sha(output / "relations.npz"),
        "source_rerun": False,
    }
    save_json(output / "encoder_ledger.json", ledger)


if __name__ == "__main__":
    main()
