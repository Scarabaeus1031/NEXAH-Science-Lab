#!/usr/bin/env python3
"""Run only the U1 development smoke gates; never compute utility."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess

from baseline_runner import run_baseline
from nexah_adapter import run_nexah
from utility00_machine import (
    CORE_COMMIT,
    canonical_bytes,
    digest_bytes,
    read_jsonl,
    validate_result,
)


def _core_commit(core_root: Path) -> str:
    return subprocess.run(
        ["git", "rev-parse", "HEAD"], cwd=core_root, check=True, capture_output=True, text=True
    ).stdout.strip()


def _pick(inputs: list[dict], gold: list[dict], family: str) -> tuple[dict, dict]:
    gold_by_id = {item["fixture_id"]: item for item in gold}
    for fixture in inputs:
        item = gold_by_id[fixture["fixture_id"]]
        if item["mutation_family"] == family:
            return fixture, item
    raise ValueError(f"smoke family absent: {family}")


def _mechanical_pass(expected: str, result: dict) -> bool:
    if expected == "PASS":
        return result["failure_status"] == "PASS"
    if expected == "DEFECT":
        return result["failure_status"] == "DEFECT" and result["detection"] is True
    if expected == "ABSTAIN":
        return result["failure_status"] == "ABSTAIN" and result["abstention"] is True
    return result["failure_status"] in {"UNKNOWN", "ABSTAIN"}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--core-root", type=Path, required=True)
    parser.add_argument("--fixtures", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    if _core_commit(args.core_root) != CORE_COMMIT:
        raise SystemExit("STOP: NEXAH Core commit differs from frozen commit")

    inputs_path = args.fixtures / "development_inputs.jsonl"
    gold_path = args.fixtures / "development_ground_truth.jsonl"
    inputs = read_jsonl(inputs_path)
    gold = read_jsonl(gold_path)
    selections = [
        _pick(inputs, gold, "VALID_OR_SEMANTICS_PRESERVING"),
        _pick(inputs, gold, "MANIFEST_PAYLOAD_MISMATCH"),
        _pick(inputs, gold, "MISSING_PRECONDITION_ABSTAIN"),
    ]
    runs = []
    gates = []
    for fixture, truth in selections:
        input_bytes = canonical_bytes(fixture)
        unhashed_fixture = dict(fixture)
        declared_input_sha256 = unhashed_fixture.pop("input_sha256")
        input_hash_valid = digest_bytes(canonical_bytes(unhashed_fixture)) == declared_input_sha256
        first = {
            "nexah": run_nexah(fixture, args.core_root),
            "baseline": run_baseline(fixture),
        }
        second = {
            "nexah": run_nexah(fixture, args.core_root),
            "baseline": run_baseline(fixture),
        }
        for processor in ("nexah", "baseline"):
            validate_result(first[processor])
            validate_result(second[processor])
        same_input = input_hash_valid and all(
            item["input_sha256"] == declared_input_sha256
            for pair in (first, second)
            for item in pair.values()
        )
        deterministic = all(
            first[name]["semantic_result_sha256"] == second[name]["semantic_result_sha256"]
            for name in ("nexah", "baseline")
        )
        mechanical = all(
            _mechanical_pass(truth["expected_mechanical_status"], first[name])
            for name in ("nexah", "baseline")
        )
        gates.append(same_input and deterministic and mechanical)
        runs.append(
            {
                "fixture_id": fixture["fixture_id"],
                "smoke_class": truth["mutation_family"],
                "expected_mechanical_status": truth["expected_mechanical_status"],
                "fixture_record_sha256": digest_bytes(input_bytes),
                "declared_input_sha256": declared_input_sha256,
                "declared_input_hash_valid": input_hash_valid,
                "first": first,
                "replay_semantic_hashes": {
                    name: second[name]["semantic_result_sha256"] for name in ("nexah", "baseline")
                },
                "same_input": same_input,
                "deterministic_replay": deterministic,
                "mechanical_behavior": mechanical,
            }
        )

    result = {
        "u1_decision": "A_U1_MINIMUM_MACHINE_EXISTS" if all(gates) else "D_U1_INVALID_OR_INSUFFICIENT",
        "core_commit": CORE_COMMIT,
        "development_fixture_count": len(inputs),
        "smoke_fixture_count": len(runs),
        "evaluation_status": "SEALED_NOT_MATERIALIZED_U1",
        "replay_status": "SEALED_NOT_MATERIALIZED_U1",
        "equal_information": all(run["same_input"] for run in runs),
        "deterministic_replay": all(run["deterministic_replay"] for run in runs),
        "utility_calculated": False,
        "primary_endpoint_calculated": False,
        "runs": runs,
        "claim_ceiling": "MACHINE_EXISTENCE_ONLY_NO_INCREMENTAL_UTILITY_CLAIM",
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_bytes(canonical_bytes(result) + b"\n")
    print(json.dumps({key: result[key] for key in ("u1_decision", "equal_information", "deterministic_replay")}))
    return 0 if all(gates) else 1


if __name__ == "__main__":
    raise SystemExit(main())
