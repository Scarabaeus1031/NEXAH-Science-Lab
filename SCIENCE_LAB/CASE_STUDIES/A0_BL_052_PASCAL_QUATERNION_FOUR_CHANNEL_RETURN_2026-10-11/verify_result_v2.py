#!/usr/bin/env python3
"""A0-BL-052 verifier repair: order-insensitive completeness, same checks."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROTOCOL = json.loads((HERE / "FROZEN_PROTOCOL.json").read_text())


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def count_nodes(depth: int) -> int:
    return math.comb(depth + 3, 3)


def check(path: Path) -> list[str]:
    data = json.loads(path.read_text())
    failures: list[str] = []

    def need(condition: bool, message: str) -> None:
        if not condition:
            failures.append(message)

    need(data.get("schema") == "nexah.a0-bl-052.result/1.0.0", "result schema")
    need(data.get("status") == "PASS", "result status")
    need(data.get("classification") == "EXACT_FOUR_CHANNEL_CONNECTOR_PASS", "classification")
    need(data.get("protocol_sha256") == sha256(HERE / "FROZEN_PROTOCOL.json"), "protocol hash")
    need(data.get("depths_tested") == [0, 11], "depth range")
    tests = data.get("tests", {})
    need(len(tests) == 10 and set(tests) == set(PROTOCOL["test_ids"]), "T1-T10 set and completeness")
    need(all(item.get("pass") is True for item in tests.values()), "all frozen tests pass")
    records = data.get("depth_records", [])
    need(len(records) == 12, "twelve depth records")
    need(all(record.get("node_count") == count_nodes(record.get("depth")) for record in records), "simplex node counts")
    need(all(record.get("phi_collision_count") == 0 for record in records), "Phi collision ledger")
    need(tests.get("T3_C3_EQUIVARIANCE", {}).get("coordinate_action") == "(a,b,c)->(c,a,b)", "C3 action")
    need(tests.get("T4_S3_REFLECTION_BOUNDARY", {}).get("determinant") == -1, "reflection determinant")
    need(tests.get("T4_S3_REFLECTION_BOUNDARY", {}).get("quaternion_inner_rotation") is False, "reflection/quaternion boundary")
    need(tests.get("T7_Q432_RETURN", {}).get("operator_identity_with_quaternion_return") is False, "typed Return separation")
    need(tests.get("T8_Q_DEGREE_SEPARATION", {}).get("quaternion_slots") == ["scalar", "i", "j", "k"], "four quaternion slots")
    need(tests.get("T9_16_VS_25_TYPED", {}).get("quaternion_product_addresses") == 16, "4^2 count")
    need(tests.get("T9_16_VS_25_TYPED", {}).get("controller_relation_addresses") == 25, "5^2 count")
    need(tests.get("T10_PRIME_READOUT_BOUNDARY", {}).get("values") == {"15": 47, "16": 53, "17": 59, "24": 89, "25": 97, "26": 101}, "prime and off-by-one controls")
    need(data.get("finding_candidate", {}).get("finding_id") == "F-A0-12", "finding ID")
    return failures


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("primary", type=Path)
    parser.add_argument("replay", type=Path)
    args = parser.parse_args()
    failures = check(args.primary) + check(args.replay)
    if args.primary.read_bytes() != args.replay.read_bytes():
        failures.append("Primary and Replay bytes differ")
    receipt = {
        "status": "FAIL" if failures else "PASS",
        "repair": "VERIFIER_REPAIR_01_ORDER_INSENSITIVE_TEST_SET",
        "failures": failures,
        "primary_sha256": sha256(args.primary),
        "replay_sha256": sha256(args.replay),
        "byte_identical": args.primary.read_bytes() == args.replay.read_bytes(),
    }
    print(json.dumps(receipt, indent=2, sort_keys=True))
    raise SystemExit(1 if failures else 0)
