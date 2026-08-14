from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from l4_core import PULLBACK_METRIC, SCALE_MATRIX, Target, anchored_ranks, graph_extract, save_json, save_npz_deterministic, sha256_file, trajectory_extract


def candidate_records(path: Path, query_ids: np.ndarray, representation: str, scores: np.ndarray, ranks: np.ndarray, support: np.ndarray, input_hash: str, extractor_id: str, tolerance: float) -> None:
    with path.open("w") as handle:
        for index, query_id in enumerate(query_ids.tolist()):
            order = np.argsort(scores[index], kind="stable")
            blocks = []
            start = 0
            while start < 7:
                end = start + 1
                anchor = scores[index, order[start]]
                while end < 7 and abs(scores[index, order[end]] - anchor) <= tolerance:
                    end += 1
                blocks.append([int(value) for value in order[start:end]])
                start = end
            record = {
                "extractor_id": extractor_id,
                "input_sha256": input_hash,
                "query_id": str(query_id),
                "ranks": [float(value) for value in ranks[index]],
                "representation_id": representation,
                "scores": [float(value) for value in scores[index]],
                "support": "SUPPORTED" if bool(support[index]) else "UNDEFINED",
                "tie_blocks": blocks,
            }
            handle.write(json.dumps(record, sort_keys=True, allow_nan=False) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--config", required=True)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()
    input_path = Path(args.input).resolve()
    config_path = Path(args.config).resolve()
    output = Path(args.output_dir).resolve()
    output.mkdir(parents=True, exist_ok=False)
    config = json.loads(config_path.read_text())
    representation = config["representation_id"]
    extractor_id = config["extractor_id"]
    tolerance = float(config["tie_tolerance"])
    input_hash = sha256_file(input_path)
    data = np.load(input_path, allow_pickle=False)

    if representation == "R3":
        allowed = {"train_z", "query_z", "query_ids"}
        actual = set(data.files)
        if actual != allowed:
            raise ValueError(f"R3 schema violation: {sorted(actual)}")
        result = {
            "candidate_id": "NEXAH-L4-C001",
            "extractor_id": extractor_id,
            "input_fields": sorted(actual),
            "input_sha256": input_hash,
            "rank_record_count": 0,
            "reason_code": "INSUFFICIENT_INFORMATION_FULL_ACTION_PREORDER",
            "representation_id": "R3",
            "result": "UNDEFINED",
        }
        save_json(output / "r3_result.json", result)
        save_json(output / "worker_record.json", {"config_sha256": sha256_file(config_path), "result": result})
        return

    target = Target.from_dict(config["target"])
    query_ids = data["query_ids"]
    if config["kind"] == "trajectory":
        train_coordinates = data["train_coordinates"]
        query_coordinates = data["query_coordinates"]
        terminal = data["train_terminal"]
        if bool(config.get("inverse_register_terminal", False)):
            terminal = terminal @ np.linalg.inv(SCALE_MATRIX).T
        train_scores = target.score(terminal)
        metric_name = config["metric"]
        metric = None if metric_name == "identity" else PULLBACK_METRIC
        scores, support, threshold = trajectory_extract(train_coordinates, query_coordinates, train_scores, int(config["k"]), metric)
        extras = {"support_threshold": np.asarray(threshold)}
    elif config["kind"] == "graph":
        scores, support, extras = graph_extract(
            data["train_coordinates"],
            data["query_coordinates"],
            data["train_terminal"],
            target,
            int(config["clusters"]),
            int(config["max_iter"]),
            int(config["smoothing_neighbors"]),
        )
    else:
        raise ValueError("unknown extractor kind")

    ranks = anchored_ranks(scores, tolerance)
    save_npz_deterministic(output / "candidate.npz", query_ids=query_ids, scores=scores, ranks=ranks, support=support, **extras)
    candidate_records(output / "candidate.jsonl", query_ids, representation, scores, ranks, support, input_hash, extractor_id, tolerance)
    save_json(
        output / "worker_record.json",
        {
            "config_sha256": sha256_file(config_path),
            "extractor_id": extractor_id,
            "input_sha256": input_hash,
            "output_candidate_jsonl_sha256": sha256_file(output / "candidate.jsonl"),
            "representation_id": representation,
            "supported": int(support.sum()),
            "total": int(len(support)),
        },
    )


if __name__ == "__main__":
    main()
