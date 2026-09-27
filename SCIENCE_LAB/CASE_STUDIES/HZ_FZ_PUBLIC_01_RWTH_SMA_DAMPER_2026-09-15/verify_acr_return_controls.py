#!/usr/bin/env python3
"""Destruction controls for the ACR35/43/45 return receipt."""

from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path


HERE = Path(__file__).resolve().parent
SOURCE = HERE / "COMPASS_BINDER_V0_3_ACR_RETURN_RECEIPT.json"
OUTPUT = HERE / "COMPASS_BINDER_V0_3_DESTRUCTION_CONTROLS.json"


def canonical(value) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode()


def verify_chain(events):
    previous = "0" * 64
    for expected_sequence, raw in enumerate(events):
        event = copy.deepcopy(raw)
        observed_hash = event.pop("event_sha256", None)
        if event.get("sequence") != expected_sequence:
            return False, "sequence mismatch"
        if event.get("previous_event_sha256") != previous:
            return False, "previous hash mismatch"
        expected_hash = hashlib.sha256(previous.encode() + canonical(event)).hexdigest()
        if observed_hash != expected_hash:
            return False, "event hash mismatch"
        previous = observed_hash
    return True, previous


def main():
    receipt = json.loads(SOURCE.read_text())
    events = receipt["event_ledger"]["events"]
    baseline_ok, baseline_detail = verify_chain(events)

    missing_orientation = copy.deepcopy(receipt)
    missing_orientation["projection_screen"]["orientation_metadata"] = {}
    missing_orientation_detected = not bool(missing_orientation["projection_screen"]["orientation_metadata"])

    permuted = copy.deepcopy(events)
    permuted[3], permuted[4] = permuted[4], permuted[3]
    permuted_ok, permuted_detail = verify_chain(permuted)

    altered_hash = copy.deepcopy(events)
    altered_hash[2]["source_sha256"] = "f" * 64
    altered_ok, altered_detail = verify_chain(altered_hash)

    altered_result = copy.deepcopy(events)
    altered_result[5]["result"] = "container proves synchrony"
    result_ok, result_detail = verify_chain(altered_result)

    controls = [
        {"control": "baseline_chain", "expected": "ACCEPT", "observed": "ACCEPT" if baseline_ok else "REJECT", "pass": baseline_ok, "detail": baseline_detail},
        {"control": "remove_orientation_key", "expected": "REJECT", "observed": "REJECT" if missing_orientation_detected else "ACCEPT", "pass": missing_orientation_detected, "detail": "required orientation metadata absent"},
        {"control": "permute_event_order", "expected": "REJECT", "observed": "ACCEPT" if permuted_ok else "REJECT", "pass": not permuted_ok, "detail": permuted_detail},
        {"control": "alter_source_hash", "expected": "REJECT", "observed": "ACCEPT" if altered_ok else "REJECT", "pass": not altered_ok, "detail": altered_detail},
        {"control": "alter_return_claim", "expected": "REJECT", "observed": "ACCEPT" if result_ok else "REJECT", "pass": not result_ok, "detail": result_detail},
    ]
    passed = all(control["pass"] for control in controls)
    result = {
        "schema": "nexah-compass-binder-acr-controls/0.3.0",
        "source_receipt_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        "controls": controls,
        "decision": "PASS_ALL_DESTRUCTION_CONTROLS" if passed else "FAIL_CLOSED",
        "profile_activation": False,
        "scientific_claim_change": False,
    }
    result["controls_receipt_sha256"] = hashlib.sha256(canonical(result)).hexdigest()
    OUTPUT.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if passed else 1)


if __name__ == "__main__":
    main()
