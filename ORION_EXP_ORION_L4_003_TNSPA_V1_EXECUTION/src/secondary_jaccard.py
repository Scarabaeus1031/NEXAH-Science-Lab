from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from tnspa_core import save_json, save_npz, sha


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--relations", required=True)
    parser.add_argument("--observer-seal", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    relation_path = Path(args.relations).resolve()
    seal_path = Path(args.observer_seal).resolve()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    seal = json.loads(seal_path.read_text())
    if not seal.get("sealed") or seal["relations_sha256"] != sha(relation_path):
        raise RuntimeError("Jaccard requires sealed primary observation")
    data = np.load(relation_path, allow_pickle=False)
    pairs = (("R0", "R1"), ("R0", "R2"), ("R1", "R2"))
    results = {}
    arrays = {}
    for left, right in pairs:
        pair_id = f"{left}_{right}"
        first, second = data[f"{left}_top"].astype(bool), data[f"{right}_top"].astype(bool)
        intersection = np.sum(first & second, axis=1)
        union = np.sum(first | second, axis=1)
        values = intersection / union
        full_full = np.all(first, axis=1) & np.all(second, axis=1)
        ordinary = ~full_full
        results[pair_id] = {
            "all_state_mean_descriptive_only": float(values.mean()),
            "ordinary_state_count": int(ordinary.sum()),
            "ordinary_state_mean": float(values[ordinary].mean()) if ordinary.any() else None,
            "UNINFORMATIVE_FULL_SET_count": int(full_full.sum()),
            "UNINFORMATIVE_FULL_SET_raw_jaccard": 1.0,
            "decision_authority": False,
        }
        arrays[pair_id] = values
        arrays[f"{pair_id}_full_full"] = full_full
    save_npz(output / "jaccard_state_values.npz", **arrays)
    save_json(output / "jaccard_summary.json", results)


if __name__ == "__main__":
    main()
