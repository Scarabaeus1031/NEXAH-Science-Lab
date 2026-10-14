#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
lock = json.loads((HERE / "LOCK.json").read_text())
failures = []
for name, expected in lock["files"].items():
    path = HERE / name
    actual = hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None
    if actual != expected:
        failures.append({"file": name, "expected": expected, "actual": actual})
print(json.dumps({"status": "FAIL" if failures else "PASS", "checked": len(lock["files"]), "failures": failures}, indent=2, sort_keys=True))
raise SystemExit(1 if failures else 0)
