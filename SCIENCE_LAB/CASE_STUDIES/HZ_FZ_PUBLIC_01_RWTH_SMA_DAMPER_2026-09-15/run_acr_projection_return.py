#!/usr/bin/env python3
"""Execute ACR35 screening and ACR43/45 return receipt for the Compass-Binder."""

from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path


HERE = Path(__file__).resolve().parent
V01 = HERE / "COMPASS_BINDER_V0_1.json"
V02 = HERE / "COMPASS_BINDER_V0_2_ACR_EXECUTION.json"
OUTPUT = HERE / "COMPASS_BINDER_V0_3_ACR_RETURN_RECEIPT.json"

ACR_ROOT = Path("/Users/tho2020/Desktop/00_INCOMING/ACR 27-45+ Testing")
ACR35 = ACR_ROOT / "NEXAH_ACR35_TEST_REPORT.md"
ACR43 = ACR_ROOT / "NEXAH_ACR43_TEST_REPORT.md"
ACR45 = ACR_ROOT / "NEXAH_ACR45_TEST_REPORT.md"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical(value) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode()


def main() -> None:
    source = json.loads(V01.read_text())
    local_adapter = json.loads(V02.read_text())
    x, y = map(float, source["comparison"]["observed_vector_j"])
    radius = math.hypot(x, y)
    angle = math.degrees(math.atan2(y, x)) % 360
    xr = radius * math.cos(math.radians(angle))
    yr = radius * math.sin(math.radians(angle))
    tolerance = 1e-12
    polar_error = max(abs(xr - x), abs(yr - y))

    projection_screen = {
        "adapter": "ACR35",
        "input_representation": "direct Cartesian contrast coordinates",
        "display_representation": "polar radius and atan2 angle",
        "sine_phase_projection_used": False,
        "generic_fourfold_phase_inverse_applies": False,
        "orientation_metadata": {
            "angle_convention": "atan2(delta_R, delta_L), degrees modulo 360",
            "quadrant": "III" if x < 0 and y < 0 else "other",
            "delta_L_sign": -1 if x < 0 else 1 if x > 0 else 0,
            "delta_R_sign": -1 if y < 0 else 1 if y > 0 else 0,
            "alignment": source["binder"]["default_alignment"],
            "source_receipt": source["source"]["sha256"],
        },
        "roundtrip": {
            "radius": radius,
            "angle_deg": angle,
            "reconstructed_cartesian": [xr, yr],
            "max_absolute_error": polar_error,
            "tolerance": tolerance,
            "pass": polar_error <= tolerance,
        },
        "decision": "PASS_DIRECT_POLAR_VIEW_WITH_ORIENTATION_KEY",
        "warning": "If a future adapter uses (sin(phi_x), sin(phi_z)), retain time order or phase derivatives because the static inverse is generally fourfold.",
    }

    event_specs = [
        ("SOURCE_BINDER", "COMPASS_BINDER_V0_1.json", sha(V01), "paired contrast record"),
        ("ACR33_PREFLIGHT", "COMPASS_BINDER_V0_2_ACR_EXECUTION.json", sha(V02), local_adapter["decision"]),
        ("ACR44_COORDINATE_LIFT", "COMPASS_BINDER_V0_2_ACR_EXECUTION.json", sha(V02), "zero-error A/B to M/S to A/B round trip"),
        ("ACR35_PROJECTION_SCREEN", "NEXAH_ACR35_TEST_REPORT.md", sha(ACR35), projection_screen["decision"]),
        ("ACR43_EVENT_LEDGER", "NEXAH_ACR43_TEST_REPORT.md", sha(ACR43), "explicit ordered mapping with decoder and direction metadata"),
        ("ACR45_RETURN_CONTAINER", "NEXAH_ACR45_TEST_REPORT.md", sha(ACR45), "container receipt; no synchrony claim"),
    ]
    events = []
    previous = "0" * 64
    for sequence, (event_id, source_name, source_sha, result) in enumerate(event_specs):
        event = {
            "sequence": sequence,
            "event_id": event_id,
            "source_name": source_name,
            "source_sha256": source_sha,
            "result": result,
            "ordinal_timebase": sequence,
            "physical_timestamp": None,
            "previous_event_sha256": previous,
        }
        event["event_sha256"] = hashlib.sha256(previous.encode() + canonical(event)).hexdigest()
        previous = event["event_sha256"]
        events.append(event)

    passed = (
        local_adapter["decision"] == "PASS_REVERSIBLE_LOCAL_ADAPTER"
        and projection_screen["roundtrip"]["pass"]
        and len({event["sequence"] for event in events}) == len(events)
    )
    receipt = {
        "schema": "nexah-compass-binder-acr-return/0.3.0",
        "case_id": source["case_id"],
        "extends": local_adapter["schema"],
        "adapters_executed": ["ACR35", "ACR43", "ACR45"],
        "projection_screen": projection_screen,
        "event_ledger": {
            "timebase": "ordinal execution steps; not physical time",
            "direction": "forward",
            "event_count": len(events),
            "events": events,
            "final_event_sha256": previous,
        },
        "decision": "PASS_ACR_PROJECTION_AND_RETURN_RECEIPT" if passed else "FAIL_CLOSED",
        "profile_activation": False,
        "registered_capability": False,
        "scientific_claim_change": False,
        "next_gate": "negative controls: remove orientation key, permute event order, and alter one source hash",
    }
    receipt["receipt_sha256"] = hashlib.sha256(canonical(receipt)).hexdigest()
    OUTPUT.write_text(json.dumps(receipt, indent=2) + "\n")
    print(json.dumps(receipt, indent=2))
    raise SystemExit(0 if passed else 1)


if __name__ == "__main__":
    main()
