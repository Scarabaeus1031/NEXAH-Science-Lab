#!/usr/bin/env python3
"""Source-bound H_Q_RECORD_01 phase-record audit.

This runner intentionally does not invent Pi_Q, mask, or re-feed update rules.
It tests only the executable period/record layer frozen in the preregistration.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path


PACKAGE = Path(__file__).resolve().parent
REPO = PACKAGE.parents[2]

EXPECTED_HASHES = {
    "preregistration": (
        PACKAGE / "26_H_Q_RECORD_01_PREREGISTRATION.md",
        "4b92532eb9f340622c0c114283b73bc65f4459c65ceb31347e81115f970a538d",
    ),
    "test_04c_preregistration": (
        REPO
        / "SCIENCE_LAB/CASE_STUDIES/Orion_POLAR:Pass Maastricht/"
        "Polar-Janus-Test-04C-Five-Clocks-One-Observer/"
        "test_04c_preregistration_de.md",
        "d54c1c1693c1ccd6ce0d63da361d96a7086c62437195f492a1069ebff4ecd1b2",
    ),
    "test_04c_implementation": (
        REPO
        / "SCIENCE_LAB/CASE_STUDIES/Orion_POLAR:Pass Maastricht/"
        "Polar-Janus-Test-04C-Five-Clocks-One-Observer/"
        "polar_janus_five_clocks_test_04c.py",
        "e221984abbbc2a661914c3b0df6c30407a9e002f93f525b9c4fdca24ef7ccfb7",
    ),
    "runtime_profiles": (
        REPO / "SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/nexah-profiles.js",
        "9e2a55497ae2c7fe5510398818e75658d6d27b83b6e7c89606465e26f85cd71d",
    ),
    "five_h_html": (
        REPO / "SCIENCE_LAB/EXPORTS/NEXAH_FIVE_H_ONE_Q_CUT.html",
        "8c733218dfd1ae6e8632653439877c059429286fa45e09889d0ccfdce0e123ca",
    ),
}

GATES_HOURS = [3, 6, 9, 12, 24, 36, 42, 48]
SHUFFLED_GATES_HOURS = [24, 3, 48, 12, 36, 6, 42, 9]

T_SPIN = 0.9972695663
T_YEAR = 365.256363004
T_MOON_SIDEREAL = 27.321661
T_NODES = 18.613 * 365.2422
T_PRECESSION = 25772.0 * 365.2422


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def beat_period(fast: float, slow: float) -> float:
    return 1.0 / abs(1.0 / fast - 1.0 / slow)


PERIODS_DAYS = {
    "H1_SOLAR_DAY": beat_period(T_SPIN, T_YEAR),
    "H2_SYNODIC_MONTH": beat_period(T_MOON_SIDEREAL, T_YEAR),
    "H3_ANNUAL_ORBIT": T_YEAR,
    "H4_PRINCIPAL_NODES": T_NODES,
    "H5_AXIAL_PRECESSION": T_PRECESSION,
}


def phase_turns(elapsed_days: float, period_days: float) -> float:
    return (elapsed_days / period_days) % 1.0


def circular_difference(a: float, b: float) -> float:
    raw = abs(a - b) % 1.0
    return min(raw, 1.0 - raw)


def circular_rmse(reference: dict[tuple[int, str], float], candidate: dict[tuple[int, str], float]) -> float:
    if set(reference) != set(candidate):
        return math.inf
    squared = [circular_difference(reference[key], candidate[key]) ** 2 for key in sorted(reference)]
    return math.sqrt(sum(squared) / len(squared))


def build_record(gates: list[int]) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for gate_hour in gates:
        elapsed_days = gate_hour / 24.0
        for clock_id, period_days in PERIODS_DAYS.items():
            rows.append(
                {
                    "gate_hour": gate_hour,
                    "clock_id": clock_id,
                    "phase_turns": phase_turns(elapsed_days, period_days),
                }
            )
    return rows


def keyed(rows: list[dict[str, object]]) -> dict[tuple[int, str], float]:
    result: dict[tuple[int, str], float] = {}
    for row in rows:
        key = (int(row["gate_hour"]), str(row["clock_id"]))
        if key in result:
            raise ValueError(f"duplicate record key: {key}")
        result[key] = float(row["phase_turns"])
    return result


def offset(rows: list[dict[str, object]], delta: float) -> list[dict[str, object]]:
    return [
        {
            **row,
            "phase_turns": (float(row["phase_turns"]) + delta) % 1.0,
        }
        for row in rows
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=PACKAGE / "h_q_record_01_results.json")
    args = parser.parse_args()

    observed_hashes = {name: sha256(path) for name, (path, _) in EXPECTED_HASHES.items()}
    source_hashes_match = all(
        observed_hashes[name] == expected for name, (_, expected) in EXPECTED_HASHES.items()
    )
    if not source_hashes_match:
        raise SystemExit("source or preregistration hash mismatch; refusing execution")

    canonical_rows = build_record(GATES_HOURS)
    canonical = keyed(canonical_rows)
    direct = {
        (gate, clock): phase_turns(gate / 24.0, period)
        for gate in GATES_HOURS
        for clock, period in PERIODS_DAYS.items()
    }
    shuffled = keyed(build_record(SHUFFLED_GATES_HOURS))
    positive_offset = keyed(offset(canonical_rows, 0.125))
    negative_offset = keyed(offset(canonical_rows, -0.125))

    direct_rmse = circular_rmse(direct, canonical)
    shuffled_rmse = circular_rmse(canonical, shuffled)
    positive_offset_rmse = circular_rmse(canonical, positive_offset)
    negative_offset_rmse = circular_rmse(canonical, negative_offset)

    # The source has no executable re-feed state update. Removing the visual
    # return flag leaves the same record and cannot define a causal contrast.
    no_refeed = dict(canonical)
    no_refeed_rmse = circular_rmse(canonical, no_refeed)
    labelled_return_rmse = circular_rmse(canonical, canonical)

    expected_keys = len(GATES_HOURS) * len(PERIODS_DAYS)
    checks = {
        "source_hashes_match": source_hashes_match,
        "record_has_40_cells": len(canonical_rows) == expected_keys,
        "record_has_40_unique_keys": len(canonical) == expected_keys,
        "direct_formula_rmse_at_most_1e_12": direct_rmse <= 1e-12,
        "shuffled_keyed_record_rmse_at_most_1e_12": shuffled_rmse <= 1e-12,
        "positive_offset_rmse_is_0_125": abs(positive_offset_rmse - 0.125) <= 1e-12,
        "negative_offset_rmse_is_0_125": abs(negative_offset_rmse - 0.125) <= 1e-12,
        "no_refeed_and_labelled_return_are_identical_without_update_operator": (
            abs(no_refeed_rmse - labelled_return_rmse) <= 1e-12
        ),
    }

    technical_pass = all(checks.values())
    result = {
        "test_id": "H_Q_RECORD_01",
        "preregistration_sha256": EXPECTED_HASHES["preregistration"][1],
        "status": (
            "PASS_SOURCE_BOUND_RECORD_RECONSTRUCTION__"
            "PRIMARY_EFFECT_NOT_EVALUABLE_OPERATOR_ABSENT"
            if technical_pass
            else "FAIL"
        ),
        "technical_result": "PASS_SOURCE_BOUND_RECORD_RECONSTRUCTION" if technical_pass else "FAIL",
        "primary_effect_result": "PRIMARY_EFFECT_NOT_EVALUABLE_OPERATOR_ABSENT",
        "input": {
            "epoch": "2024-01-15T00:00:00Z",
            "location": {
                "label": "TEST_04C_MAASTRICHT_SITE",
                "latitude_deg_north": 50.8514,
                "longitude_deg_east": 5.69097,
                "height_m": 55.0,
                "used_in_period_only_phase_calculation": False,
            },
            "gates_hours": GATES_HOURS,
            "phase_origin": "zero_at_epoch_elapsed_phase",
            "periods_days": PERIODS_DAYS,
        },
        "record": {
            "cells": len(canonical_rows),
            "unique_keys": len(canonical),
            "fields": ["gate_hour", "clock_id", "phase_turns"],
            "phase_register": canonical_rows,
            "retained_cells": len(canonical),
            "masked_cells": None,
            "lost_cells": None,
            "mask_ledger_status": "NOT_EVALUABLE_MASK_OPERATOR_ABSENT",
        },
        "metrics": {
            "direct_formula_circular_rmse_turns": direct_rmse,
            "shuffled_gate_order_circular_rmse_turns": shuffled_rmse,
            "positive_1_over_8_offset_circular_rmse_turns": positive_offset_rmse,
            "negative_1_over_8_offset_circular_rmse_turns": negative_offset_rmse,
            "labelled_return_circular_rmse_turns": labelled_return_rmse,
            "no_refeed_circular_rmse_turns": no_refeed_rmse,
            "delta_rmse_no_refeed_minus_labelled_return": None,
        },
        "operator_audit": {
            "phase_record": "EXECUTABLE",
            "clock_id_binder": "EXECUTABLE_IN_COMMON_RUNTIME_ADAPTER",
            "pi_q_projection": "NOT_NUMERICALLY_DEFINED",
            "mask_partition": "NOT_NUMERICALLY_DEFINED",
            "refeed_state_update": "NOT_NUMERICALLY_DEFINED",
            "html_trace": "DISPLAY_WAVE_NOT_DERIVED_FROM_FIVE_PHASE_VECTOR",
        },
        "checks": checks,
        "checks_passed": sum(1 for value in checks.values() if value),
        "checks_total": len(checks),
        "source_hashes": observed_hashes,
        "claim_boundary": (
            "Deterministic elapsed-phase record and keyed reconstruction only; "
            "no re-feed benefit, projection benefit, mask recovery, astronomy "
            "prediction, causal feedback, SCN/NCS, 404, E8/H4 or M-Class claim."
        ),
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
