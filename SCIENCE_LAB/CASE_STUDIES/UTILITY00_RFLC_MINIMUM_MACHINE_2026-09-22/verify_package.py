#!/usr/bin/env python3
"""Verify U1 evidence hashes and non-evaluation boundary without regenerating it."""

from __future__ import annotations

from hashlib import sha256
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def main() -> int:
    manifest = ROOT / "SHA256_MANIFEST.txt"
    failures = []
    for line in manifest.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        expected, relative = line.split("  ", 1)
        path = ROOT / relative
        observed = sha256(path.read_bytes()).hexdigest() if path.is_file() else "MISSING"
        if observed != expected:
            failures.append(relative)
    smoke = json.loads((ROOT / "results" / "u1_smoke_result.json").read_text())
    if smoke["utility_calculated"] or smoke["primary_endpoint_calculated"]:
        failures.append("UTILITY_BOUNDARY")
    if smoke["evaluation_status"] != "SEALED_NOT_MATERIALIZED_U1":
        failures.append("EVALUATION_SEAL")
    if smoke["replay_status"] != "SEALED_NOT_MATERIALIZED_U1":
        failures.append("REPLAY_SEAL")
    print(json.dumps({"status": "PASS" if not failures else "FAIL", "failures": failures}, sort_keys=True))
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
