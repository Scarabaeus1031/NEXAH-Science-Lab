#!/usr/bin/env python3
"""Fail-closed verifier for the A0-BL-021 pre-execution lock."""

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
LOCK = ROOT / "LOCK.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


lock = json.loads(LOCK.read_text(encoding="utf-8"))
checks = {}
for name, expected in lock["files"].items():
    path = ROOT / name
    checks[name] = path.is_file() and sha256(path) == expected

status = "PASS" if checks and all(checks.values()) else "FAIL"
print(json.dumps({"status": status, "checks": checks}, indent=2, sort_keys=True))
if status != "PASS":
    raise SystemExit(1)
