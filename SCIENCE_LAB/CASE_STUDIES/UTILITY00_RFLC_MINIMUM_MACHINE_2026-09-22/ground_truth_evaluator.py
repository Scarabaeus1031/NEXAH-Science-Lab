#!/usr/bin/env python3
"""Separate per-record scorer. It deliberately emits no U2 aggregate."""

from __future__ import annotations

import json
from pathlib import Path
import sys
from typing import Any


def score_record(result: dict[str, Any], gold: dict[str, Any]) -> dict[str, Any]:
    if result["fixture_id"] != gold["fixture_id"]:
        raise ValueError("fixture identity mismatch")
    expected = gold["expected_mechanical_status"]
    status = result["failure_status"]
    if expected == "PASS":
        correct = status == "PASS"
    elif expected == "ABSTAIN":
        correct = status == "ABSTAIN" and result["abstention"] is True
    elif expected == "UNKNOWN_OR_ABSTAIN":
        correct = status in {"UNKNOWN", "ABSTAIN"} and result["abstention"] is True
    else:
        correct = status == "DEFECT" and result["detection"] is True
    return {
        "fixture_id": result["fixture_id"],
        "processor": result["processor"],
        "mechanical_status_correct": correct,
        "expected_status": expected,
        "observed_status": status,
        "gold_access_boundary": "SCORER_ONLY_AFTER_PROCESSOR_OUTPUT",
        "utility_calculated": False,
    }


def main() -> int:
    if len(sys.argv) != 3:
        raise SystemExit("usage: ground_truth_evaluator.py RESULT.json GOLD.json")
    result = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    gold = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    print(json.dumps(score_record(result, gold), sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
