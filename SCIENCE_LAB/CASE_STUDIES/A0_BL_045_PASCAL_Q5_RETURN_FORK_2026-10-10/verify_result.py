#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def check(path):
    data = json.loads(path.read_text())
    failures = []
    need = lambda condition, message: failures.append(message) if not condition else None
    need(data.get("classification") == "RETURN_TYPE_UNDERDETERMINED", "classification")
    need(data.get("pascal_orbit") == {"positions": 5, "weight_each": 20, "displayed_total": 100}, "Pascal orbit")
    need(data.get("monodromy") == {"Q5": [[8, 5], [5, 3]], "trace": 11, "determinant": -1}, "Q5 ledger")
    fork = data.get("return_fork", {})
    need(fork.get("untwisted", {}).get("boundary_components") == 2, "untwisted topology")
    need(fork.get("twisted", {}).get("boundary_components") == 1, "twisted topology")
    need(fork.get("untwisted", {}).get("fixed_state_determinant") == -11, "untwisted fixed-state control")
    need(fork.get("twisted", {}).get("fixed_state_determinant") == -3, "twisted fixed-state control")
    need(fork.get("compensating_control", {}).get("product_with_Q5") == [[1, 0], [0, 1]], "compensating control")
    need(all(data.get("checks", {}).values()), "mandatory checks")
    return failures


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("primary", type=Path)
    parser.add_argument("replay", type=Path)
    args = parser.parse_args()
    failures = check(args.primary) + check(args.replay)
    if args.primary.read_bytes() != args.replay.read_bytes():
        failures.append("primary/replay bytes")
    print(json.dumps({"status": "FAIL" if failures else "PASS", "failures": failures}, indent=2))
    raise SystemExit(bool(failures))
