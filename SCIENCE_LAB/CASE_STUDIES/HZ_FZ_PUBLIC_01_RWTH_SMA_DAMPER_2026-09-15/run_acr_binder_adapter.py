#!/usr/bin/env python3
"""Execute the bounded ACR33 + ACR44 adapter on Compass-Binder v0.1."""

from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path


HERE = Path(__file__).resolve().parent
SOURCE = HERE / "COMPASS_BINDER_V0_1.json"
CONTRACT = HERE / "COMPASS_BINDER_V0_2_ACR_EXTENSION.json"
OUTPUT = HERE / "COMPASS_BINDER_V0_2_ACR_EXECUTION.json"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    source = json.loads(SOURCE.read_text())
    contract = json.loads(CONTRACT.read_text())
    a, b = map(float, source["comparison"]["observed_vector_j"])
    cuts = source["cuts"]

    preflight = {
        "finite_values": math.isfinite(a) and math.isfinite(b),
        "same_unit": cuts["A"]["unit"] == cuts["B"]["unit"] == "J/cycle",
        "distinct_orientations": cuts["A"]["orientation"] != cuts["B"]["orientation"],
        "source_receipt_present": len(source["source"]["sha256"]) == 64,
        "alignment_declared": source["binder"]["default_alignment"] in source["comparison"]["path_views"],
        "profile_remains_fail_closed": "NO_PROFILE_ACTIVATION" in source["status"],
    }

    midpoint = (a + b) / 2.0
    side = (a - b) / 2.0
    a_back = midpoint + side
    b_back = midpoint - side
    errors = [abs(a_back - a), abs(b_back - b)]
    tolerance = 1e-12
    roundtrip = {
        "input_A_delta_l_j_per_cycle": a,
        "input_B_delta_r_j_per_cycle": b,
        "M_midpoint_j_per_cycle": midpoint,
        "S_side_j_per_cycle": side,
        "reconstructed_A": a_back,
        "reconstructed_B": b_back,
        "absolute_errors": errors,
        "tolerance": tolerance,
        "pass": max(errors) <= tolerance,
    }

    passed = all(preflight.values()) and roundtrip["pass"]
    result = {
        "schema": "nexah-compass-binder-acr-execution/0.2.0",
        "case_id": source["case_id"],
        "adapter_contract": contract["binder_id"],
        "source_binder_sha256": digest(SOURCE),
        "contract_sha256": digest(CONTRACT),
        "adapter_sequence_executed": ["ACR33", "ACR44"],
        "preflight": preflight,
        "coordinate_lift": roundtrip,
        "decision": "PASS_REVERSIBLE_LOCAL_ADAPTER" if passed else "FAIL_CLOSED",
        "profile_activation": False,
        "claim_change": False,
        "next_dormant_stages": ["ACR35 projection warning", "ACR43/45 event receipt"],
    }
    canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode()
    result["execution_receipt_sha256"] = hashlib.sha256(canonical).hexdigest()
    OUTPUT.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if passed else 1)


if __name__ == "__main__":
    main()
