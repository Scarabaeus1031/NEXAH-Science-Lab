#!/usr/bin/env python3
"""Generate only the frozen development split; keep evaluation/replay sealed."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from utility00_machine import (
    BOOTSTRAP_SEED,
    CORE_COMMIT,
    CRITICAL_FAMILIES,
    FAMILY_ID,
    GENERATION_SEED,
    SPLIT_COUNTS,
    SPLIT_SEED,
    build_split,
    canonical_bytes,
    digest_bytes,
    write_jsonl,
)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--core-root", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    development, gold = build_split(args.core_root, "development")
    args.out.mkdir(parents=True, exist_ok=True)
    inputs_path = args.out / "development_inputs.jsonl"
    gold_path = args.out / "development_ground_truth.jsonl"
    write_jsonl(inputs_path, development)
    write_jsonl(gold_path, gold)
    plan = {
        "family_id": FAMILY_ID,
        "core_commit": CORE_COMMIT,
        "seeds": {
            "fixture_generation": GENERATION_SEED,
            "stratified_split": SPLIT_SEED,
            "bootstrap": BOOTSTRAP_SEED,
        },
        "critical_families": list(CRITICAL_FAMILIES),
        "counts": SPLIT_COUNTS,
        "materialized_in_u1": {"development": 140, "evaluation": 0, "replay": 0},
        "seal_status": {
            "evaluation": "SEALED_NOT_MATERIALIZED_U1",
            "replay": "SEALED_NOT_MATERIALIZED_U1",
        },
        "development_inputs_sha256": digest_bytes(inputs_path.read_bytes()),
        "development_ground_truth_sha256": digest_bytes(gold_path.read_bytes()),
        "claim_boundary": "MACHINE_EXISTENCE_ONLY_NO_UTILITY_CALCULATION",
    }
    (args.out / "fixture_plan.json").write_bytes(canonical_bytes(plan) + b"\n")
    print(json.dumps({"status": "PASS", "development": len(development), "planned_total": 432}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

