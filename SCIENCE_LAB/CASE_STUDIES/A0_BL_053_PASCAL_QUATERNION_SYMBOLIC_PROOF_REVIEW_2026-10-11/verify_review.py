#!/usr/bin/env python3

import hashlib
import json
import sys
from pathlib import Path

EXPECTED = {
    "C1_EXACT_BASIS_CYCLE",
    "C2_U_CUBE_MINUS_ONE",
    "C3_ENUMERATION_0_14",
    "C4_EXACT_INVERSE_RETURN",
    "C5_OPPOSITE_CYCLE_MUTATION_REJECTED",
    "C6_REFLECTION_NOT_PROPER_ROTATION",
}

if len(sys.argv) != 3:
    raise SystemExit("usage: verify_review.py PRIMARY REPLAY")

primary_path, replay_path = map(Path, sys.argv[1:])
primary_bytes = primary_path.read_bytes()
replay_bytes = replay_path.read_bytes()
primary = json.loads(primary_bytes)
failures = []

if primary_bytes != replay_bytes:
    failures.append("Primary and Replay bytes differ")
if primary.get("status") != "PASS":
    failures.append("result status is not PASS")
if primary.get("implementation_lineage") != "NEW_STANDARD_LIBRARY_JAVASCRIPT_NO_IMPORT_FROM_A0_BL_052":
    failures.append("implementation-lineage declaration")
if primary.get("reviewer_status") != "INTERNAL_NOT_EXTERNAL_INDEPENDENT":
    failures.append("independence boundary")
tests = primary.get("tests", {})
if set(tests) != EXPECTED:
    failures.append("test set mismatch")
if any(not item.get("pass") for item in tests.values()):
    failures.append("one or more controls failed")
if tests.get("C2_U_CUBE_MINUS_ONE", {}).get("value") != ["-1", "0", "0", "0"]:
    failures.append("u^3 is not -1")
if tests.get("C3_ENUMERATION_0_14", {}).get("max_depth_count") != 680:
    failures.append("P_14 count is not 680")
if tests.get("C6_REFLECTION_NOT_PROPER_ROTATION", {}).get("reflection_determinant") != -1:
    failures.append("reflection determinant")

result = {
    "status": "PASS" if not failures else "FAIL",
    "primary_sha256": hashlib.sha256(primary_bytes).hexdigest(),
    "replay_sha256": hashlib.sha256(replay_bytes).hexdigest(),
    "tests": len(tests),
    "failures": failures,
}
print(json.dumps(result, indent=2))
raise SystemExit(1 if failures else 0)
