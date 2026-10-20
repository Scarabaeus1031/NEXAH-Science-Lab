#!/usr/bin/env python3
import json
import sys
from pathlib import Path

from run_experiment import build_result, canonical_bytes

ROOT = Path(__file__).resolve().parent
primary = ROOT / "artifacts" / "PRIMARY_RESULT.json"
replay = ROOT / "artifacts" / "REPLAY_RESULT.json"
if not primary.exists() or not replay.exists():
    raise SystemExit("MISSING_RESULT")
if primary.read_bytes() != replay.read_bytes():
    raise SystemExit("REPLAY_MISMATCH")
observed = json.loads(primary.read_text())
expected = build_result()
if observed != expected or primary.read_bytes() != canonical_bytes(expected):
    raise SystemExit("RESULT_MISMATCH")
required = json.loads((ROOT / "FROZEN_PROTOCOL.json").read_text())["required_gates"]
checks = [observed["result_class"] in {"PASS_BOUNDED", "PARTIAL", "NON_IDENTIFIABLE", "INVALID_DESIGN", "UNINFORMATIVE"}]
checks.extend(name in observed["gates"] and isinstance(observed["gates"][name]["pass"], bool) for name in required)
if not all(checks):
    raise SystemExit("STRUCTURAL_VERIFICATION_FAILED")
print(json.dumps({"status": "PASS", "checks": len(checks), "result_class": observed["result_class"]}, sort_keys=True))

