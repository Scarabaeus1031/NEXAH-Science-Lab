#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path


root = Path(__file__).resolve().parent
lock = json.loads((root / "LOCK.json").read_text(encoding="utf-8"))
failures = []
for relative, expected in lock["files"].items():
    path = root / relative
    observed = hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else "MISSING"
    if observed != expected:
        failures.append({"path": relative, "expected": expected, "observed": observed})
reference = root.parent / "A0_BL_057_ALPHA_BETA_MIRROR_BREATH_2026-11-01/artifacts/PRIMARY_RESULT.json"
observed_reference = hashlib.sha256(reference.read_bytes()).hexdigest() if reference.is_file() else "MISSING"
if observed_reference != lock["references"]["a0_bl_057_primary"]["sha256"]:
    failures.append({"path": str(reference), "expected": lock["references"]["a0_bl_057_primary"]["sha256"], "observed": observed_reference})
if failures:
    raise SystemExit(json.dumps({"status": "FAIL", "failures": failures}, indent=2))
print(json.dumps({"status": "PASS", "locked_files": len(lock["files"]), "references": 1}))
