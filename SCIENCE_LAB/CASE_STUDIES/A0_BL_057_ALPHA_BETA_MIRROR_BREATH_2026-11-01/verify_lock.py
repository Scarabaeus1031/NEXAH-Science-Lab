#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path


root = Path(__file__).resolve().parent
lock = json.loads((root / "LOCK.json").read_text(encoding="utf-8"))
for relative, expected in lock["files"].items():
    actual = hashlib.sha256((root / relative).read_bytes()).hexdigest()
    if actual != expected:
        raise SystemExit(f"FAIL: {relative}: {actual} != {expected}")
print(f"PASS: {len(lock['files'])}/{len(lock['files'])} locked files")
