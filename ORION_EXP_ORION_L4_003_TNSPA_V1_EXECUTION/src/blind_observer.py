from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

from tnspa_core import pair_components, save_json, save_npz, sha, tnspa


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--relations", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    relation_path = Path(args.relations).resolve()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    data = np.load(relation_path, allow_pickle=False)
    relations = {rep: data[rep] for rep in ("R0", "R1", "R2")}
    n = len(relations["R0"])
    if n != 1399 or any(value.shape != (1399, 21) for value in relations.values()):
        raise RuntimeError("observer input shape mismatch")
    informativeness = {
        rep: {
            "strict_cells": int(np.sum(value != 0)),
            "tie_cells": int(np.sum(value == 0)),
            "total_cells": int(value.size),
            "I_r": float(np.mean(value != 0)),
            "full_tie_states": int(np.sum(np.all(value == 0, axis=1))),
        }
        for rep, value in relations.items()
    }
    pair_ids = (("R0", "R1"), ("R0", "R2"), ("R1", "R2"))
    pair_results = {}
    state_arrays = {}
    kernel_arrays = {}
    for left, right in pair_ids:
        pair_id = f"{left}_{right}"
        left_values, right_values = relations[left], relations[right]
        components = pair_components(left_values, right_values)
        kernel_values = np.where((left_values == right_values) & (left_values != 0), 1, np.where((left_values == 0) & (right_values == 0), 0, -1)).astype(np.int8)
        state_scores = kernel_values.mean(axis=1)
        pair_results[pair_id] = {"TNSPA": float(state_scores.mean()), "components": components, "state_count": n}
        state_arrays[pair_id] = state_scores
        kernel_arrays[pair_id] = kernel_values
    save_npz(output / "observer_cells_and_states.npz", **{f"state_{key}": value for key, value in state_arrays.items()}, **{f"kernel_{key}": value for key, value in kernel_arrays.items()})
    observation = {
        "informativeness": informativeness,
        "joint_support_count": n,
        "pair_results": pair_results,
        "relations_sha256": sha(relation_path),
        "TNSPA_min": float(min(result["TNSPA"] for result in pair_results.values())),
    }
    save_json(output / "observed_metrics.json", observation)
    seal = {
        "expected_scientific_conclusion_visible": False,
        "observed_metrics_sha256": sha(output / "observed_metrics.json"),
        "observer_cells_and_states_sha256": sha(output / "observer_cells_and_states.npz"),
        "relations_sha256": sha(relation_path),
        "sealed": True,
    }
    save_json(output / "OBSERVER_SEAL.json", seal)


if __name__ == "__main__":
    main()
