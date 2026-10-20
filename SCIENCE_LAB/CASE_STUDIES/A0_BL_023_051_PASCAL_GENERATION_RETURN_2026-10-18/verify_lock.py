#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCIENCE_REPO = ROOT.parents[2]
ECOSYSTEM = SCIENCE_REPO.parent.parent
lock = json.loads((ROOT / "LOCK.json").read_text())
for name, expected in lock["files"].items():
    observed = hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
    if observed != expected:
        raise SystemExit(f"LOCK_MISMATCH {name} expected={expected} observed={observed}")
for name, expected in lock["parent_sources"].items():
    observed = hashlib.sha256((ECOSYSTEM / name).read_bytes()).hexdigest()
    if observed != expected:
        raise SystemExit(f"PARENT_LOCK_MISMATCH {name} expected={expected} observed={observed}")
print(json.dumps({"status": "PASS", "files": len(lock["files"]), "parent_sources": len(lock["parent_sources"]), "scientific_execution_occurred_when_written": lock["scientific_execution_occurred_when_written"]}, sort_keys=True))

