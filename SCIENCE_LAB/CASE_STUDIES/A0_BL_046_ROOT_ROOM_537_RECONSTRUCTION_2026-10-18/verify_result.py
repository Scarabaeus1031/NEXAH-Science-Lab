#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: verify_result.py RESULT.json")
    result = json.loads(Path(sys.argv[1]).read_text())
    checks = {
        "source_hash": result["gates"]["G1_SOURCE"],
        "seven_anchors": len(result["anchors"]) == 7,
        "two_57_occurrences": sum(a["value"] == 57 for a in result["anchors"]) == 2,
        "duplicate_conflict_recorded": len(result["duplicate_conflicts"]) == 1,
        "duplicate_distance_large": result["duplicate_conflicts"][0]["distance_px"] > 8,
        "arithmetic_separate_pass": all(result["arithmetic"].values()),
        "all_shuffles": result["shuffle_count"] == 2520,
        "four_models": len(result["shuffle_summary"]) == 4,
        "ten_nearby_controls": len(result["nearby_scores"]) == 10,
        "thirty_two_jitters": len(result["jitter_trials"]) == 32,
        "jitter_class_stable": result["gates"]["G7_JITTER_STABLE"],
        "registered_decision": result["decision"] == "UNDERDETERMINED_MULTIPLE_PLACEMENTS_FOR_SAME_VALUE",
        "function_gate_fails": not result["gates"]["G3_NUMBER_ONLY_FUNCTION"],
        "claim_boundary": len(result["claim_boundary"]) == 3,
    }
    receipt = {"status": "PASS" if all(checks.values()) else "FAIL", "checks": checks, "passed": sum(checks.values()), "total": len(checks)}
    print(json.dumps(receipt, indent=2, sort_keys=True))
    if receipt["status"] != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()

