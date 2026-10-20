#!/usr/bin/env python3
"""Structural verifier for an A0-BL-048 result."""
import json
import sys


def main(path):
    with open(path, encoding="utf-8") as handle:
        result = json.load(handle)
    joint = result["joint_null"]
    checks = {
        "schema": result["schema"] == "nexah.a0.bl048.prime-index-nesting-result/1.0.0",
        "study": result["study_id"] == "A0_BL_048_PRIME_INDEX_NESTING_CONTROLS_2026_10_18",
        "classification": result["classification"] == "FAIL_PRIME_INDEX_SELECTIVITY_PALINDROME_BASELINE_DOMINATES",
        "three_targets": [row["target"] for row in result["targets"]] == ["717717", "4774", "1771"],
        "class_sizes": [row["class_size"] for row in result["targets"]] == [15, 6, 6],
        "joint_size": joint["size"] == 540,
        "prime_score": joint["prime_target_score"] == 5,
        "prime_tail": joint["prime_tail"]["numerator"] == 228 and joint["prime_tail"]["denominator"] == 540,
        "prime_histogram": joint["prime_score_histogram"] == {"2": 6, "3": 72, "4": 234, "5": 192, "6": 36},
        "palindrome_score": joint["palindrome_target_score"] == 3,
        "palindrome_tail": joint["palindrome_tail"]["numerator"] == 12 and joint["palindrome_tail"]["denominator"] == 540,
        "reversal_closure": joint["reversal_membership_failures"] == 0,
        "source_control": result["source_control"] == {"sum_4774_4114": 8888, "gcd_4774_4114": 22, "included_in_primary_score": False},
        "eight_gates": len(result["gates"]) == 8 and all(result["gates"].values()),
        "claim_boundary": "no mechanism" in result["interpretation_boundary"],
    }
    status = "PASS" if all(checks.values()) else "FAIL"
    print(json.dumps({"status": status, "passed": sum(checks.values()), "total": len(checks), "checks": checks}, indent=2, sort_keys=True))
    raise SystemExit(0 if status == "PASS" else 1)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: verify_result.py RESULT.json")
    main(sys.argv[1])

