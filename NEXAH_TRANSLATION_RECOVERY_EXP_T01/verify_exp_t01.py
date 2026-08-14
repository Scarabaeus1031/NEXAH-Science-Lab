#!/usr/bin/env python3
"""Fail-closed verifier and deterministic replay tool for EXP-T01."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import run_exp_t01 as experiment

ROOT = Path(__file__).resolve().parent


def verify_result(path: Path, phase: str) -> dict[str, object]:
    expected_bundle = experiment.verify_freeze()
    payload = json.loads(path.read_text())
    errors: list[str] = []
    if payload.get("protocol_bundle_sha256") != expected_bundle:
        errors.append("result protocol hash mismatch")
    if payload.get("phase") != phase:
        errors.append("result phase mismatch")
    config = experiment.protocol()
    if phase in {"a", "all"}:
        records = payload["t01a"]["records"]
        counts = {family: sum(row["family"] == family for row in records)
                  for family in ("EXACT", "PERTURBED", "LOSSY")}
        expected = config["expected_counts"]
        if counts != {"EXACT": expected["exact"], "PERTURBED": expected["perturbed"],
                      "LOSSY": expected["lossy"]}:
            errors.append(f"recovery cell counts mismatch: {counts}")
        if any(row["primary_status"] not in config["allowed_recovery_statuses"] for row in records):
            errors.append("unknown recovery status")
        if any(row["family"] == "LOSSY" and row["recovery_error"] is not None for row in records):
            errors.append("lossy recovery error was coerced")
        if payload["t01a"]["collisions"]["false_recoveries"] != 0:
            errors.append("false recovery detected")
    if phase in {"b", "all"}:
        records = payload["t01b"]["records"]
        if len(records) != config["expected_counts"]["stillpoint"]:
            errors.append("stillpoint cell count mismatch")
        if any(row["primary_status"] not in config["allowed_dynamical_statuses"] for row in records):
            errors.append("unknown dynamical status")
    return {"valid": not errors, "errors": errors, "protocol_bundle_sha256": expected_bundle}


def replay(path: Path, phase: str) -> dict[str, object]:
    with tempfile.TemporaryDirectory(prefix="exp_t01_replay_") as directory:
        replay_path = Path(directory) / "replay.json"
        subprocess.run(
            [sys.executable, str(ROOT / "run_exp_t01.py"), "--phase", phase,
             "--output", str(replay_path)], check=True, cwd=ROOT
        )
        return {
            "source": path.name,
            "phase": phase,
            "byte_identical": path.read_bytes() == replay_path.read_bytes(),
            "source_sha256": experiment.file_sha(path),
            "replay_sha256": experiment.file_sha(replay_path),
        }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--result", type=Path, required=True)
    parser.add_argument("--phase", choices=("a", "b", "all"), required=True)
    parser.add_argument("--audit", type=Path)
    args = parser.parse_args()
    validation = verify_result(args.result, args.phase)
    replay_record = replay(args.result, args.phase)
    audit = {"experiment_id": "NEXAH_EXP_T01", "validation": validation,
             "replay": replay_record,
             "pass": bool(validation["valid"] and replay_record["byte_identical"])}
    if args.audit:
        args.audit.write_bytes(experiment.canonical_bytes(audit))
    print(json.dumps(audit, sort_keys=True, indent=2, allow_nan=False))
    raise SystemExit(0 if audit["pass"] else 1)


if __name__ == "__main__":
    main()
