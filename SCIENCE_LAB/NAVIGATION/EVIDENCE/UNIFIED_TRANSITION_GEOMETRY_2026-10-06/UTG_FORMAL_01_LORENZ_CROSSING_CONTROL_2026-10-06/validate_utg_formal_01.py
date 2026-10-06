#!/usr/bin/env python3
"""Replay UTG-FORMAL-01 twice and verify all preregistered gates."""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path


HERE = Path(__file__).resolve().parent
RUNNER = HERE / "run_utg_formal_01.py"
RESULT = HERE / "UTG_FORMAL_01_RESULTS.json"
EVENTS = HERE / "UTG_FORMAL_01_EVENTS.csv"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def replay() -> tuple[str, str]:
    subprocess.run([sys.executable, str(RUNNER)], check=True, capture_output=True, text=True)
    return digest(RESULT), digest(EVENTS)


def main() -> None:
    first = replay()
    data = json.loads(RESULT.read_text(encoding="utf-8"))
    second = replay()
    raw = data["acceptance_gates"]
    gates = {
        "1_controls": raw["controls"],
        "2_both_directions": raw["both_directions_present"],
        "3_boundary_residual": raw["event_boundary_residual"],
        "4_transversality_and_direction": raw["transversal_direction_consistency"],
        "5_sampling_event_count": raw["sampling_event_count"],
        "6_coarse_sampling_error": raw["coarse_time_mae"] and raw["coarse_z_mae"],
        "7_identity_return": raw["identity_return"],
        "8_byte_identical_replay": first == second,
    }
    passed = all(gates.values()) and data["status"] == "PASS"
    output = {
        "status": "PASS" if passed else "FAIL",
        "gates_passed": sum(bool(value) for value in gates.values()),
        "gates_total": len(gates),
        "gates": gates,
        "results_sha256": second[0],
        "events_sha256": second[1],
    }
    print(json.dumps(output, indent=2))
    if not passed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
