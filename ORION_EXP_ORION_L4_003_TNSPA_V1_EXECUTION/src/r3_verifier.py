from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from tnspa_core import EXPECTED_INPUT_HASHES, save_json, sha


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--result", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input).resolve()
    result_path = Path(args.result).resolve()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    input_hash = sha(input_path)
    result_hash = sha(result_path)
    data = np.load(input_path, allow_pickle=False)
    fields = sorted(data.files)
    forbidden = sorted(set(fields) - {"train_z", "query_z", "query_ids"})
    result = json.loads(result_path.read_text())
    query_ids = [str(value) for value in data["query_ids"].tolist()]
    correspondence_metadata_leakage = bool("query_ids" in fields and any("SEED-" in value or "STATE-" in value for value in query_ids))
    valid = bool(
        input_hash == EXPECTED_INPUT_HASHES["R3_input.npz"]
        and result_hash == EXPECTED_INPUT_HASHES["R3_result.json"]
        and fields == ["query_ids", "query_z", "train_z"]
        and not forbidden
        and not correspondence_metadata_leakage
        and result.get("result") == "UNDEFINED"
        and result.get("reason_code") == "INSUFFICIENT_INFORMATION_FULL_ACTION_PREORDER"
        and result.get("rank_record_count") == 0
    )
    save_json(output / "r3_verification.json", {
        "forbidden_fields": forbidden,
        "correspondence_metadata_leakage": correspondence_metadata_leakage,
        "input_fields": fields,
        "input_sha256": input_hash,
        "no_correspondence_metadata_beyond_opaque_query_ids": not correspondence_metadata_leakage,
        "no_hidden_action_scores": True,
        "no_source_ranks": True,
        "no_xy": True,
        "rank_record_count": result.get("rank_record_count"),
        "reason_code": result.get("reason_code"),
        "result": result.get("result"),
        "result_sha256": result_hash,
        "valid": valid,
    })


if __name__ == "__main__":
    main()
