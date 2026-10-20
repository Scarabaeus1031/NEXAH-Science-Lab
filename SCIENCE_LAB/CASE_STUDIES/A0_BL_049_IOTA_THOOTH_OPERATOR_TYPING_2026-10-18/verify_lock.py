#!/usr/bin/env python3
"""Verify frozen A0-BL-049 inputs."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
with (root / "LOCK.json").open(encoding="utf-8") as handle:
    lock = json.load(handle)
checks = []
for item in lock["files"]:
    path = Path(item["path"])
    if not path.is_absolute():
        path = root / path
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    checks.append({"path": item["path"], "expected": item["sha256"], "actual": actual, "pass": actual == item["sha256"]})
status = "PASS" if all(item["pass"] for item in checks) else "FAIL"
print(json.dumps({"status": status, "passed": sum(item["pass"] for item in checks), "total": len(checks), "checks": checks}, indent=2, sort_keys=True))
raise SystemExit(0 if status == "PASS" else 1)
