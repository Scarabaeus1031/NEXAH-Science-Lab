#!/usr/bin/env python3
"""Deterministic NEXAH-ORI-01 positive-control comparison."""

from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "01_SOURCE_DATA.csv"
OUTPUT = ROOT / "04_RESULTS.json"


def rate(admitted: int, rejected: int) -> float:
    return admitted / (admitted + rejected)


def main() -> None:
    rows = []
    with SOURCE.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            rows.append(
                {
                    "department": row["department"],
                    "gender": row["gender"],
                    "admitted": int(row["admitted"]),
                    "rejected": int(row["rejected"]),
                }
            )

    genders = ("Male", "Female")
    departments = tuple(sorted({row["department"] for row in rows}))
    aggregate = {}
    for gender in genders:
        subset = [row for row in rows if row["gender"] == gender]
        admitted = sum(row["admitted"] for row in subset)
        rejected = sum(row["rejected"] for row in subset)
        aggregate[gender] = {
            "admitted": admitted,
            "rejected": rejected,
            "applicants": admitted + rejected,
            "rate": rate(admitted, rejected),
        }

    strata = []
    department_totals = {}
    for department in departments:
        pair = {row["gender"]: row for row in rows if row["department"] == department}
        total = sum(row["admitted"] + row["rejected"] for row in pair.values())
        department_totals[department] = total
        strata.append(
            {
                "department": department,
                "male_rate": rate(pair["Male"]["admitted"], pair["Male"]["rejected"]),
                "female_rate": rate(pair["Female"]["admitted"], pair["Female"]["rejected"]),
            }
        )

    grand_total = sum(department_totals.values())
    standardized = {}
    for gender in genders:
        standardized[gender] = sum(
            (department_totals[department] / grand_total)
            * next(
                rate(row["admitted"], row["rejected"])
                for row in rows
                if row["department"] == department and row["gender"] == gender
            )
            for department in departments
        )

    aggregate_delta = aggregate["Female"]["rate"] - aggregate["Male"]["rate"]
    standardized_delta = standardized["Female"] - standardized["Male"]
    sign_reversal = aggregate_delta < 0 < standardized_delta

    baseline = {
        "input_rows": 12,
        "uses_department_context": True,
        "blocks_C1_false_closure": sign_reversal,
        "reason": "aggregate contrast reverses under common department weights",
    }
    nexah = {
        "Omega": "01_SOURCE_DATA.csv / UCBAdmissions six-department table",
        "X": "department as decision-unit context",
        "Q": "Does the aggregate record alone establish department-level bias?",
        "sigma": "sum over department",
        "records": ["aggregate_by_gender", "department_by_gender", "direct_standardization"],
        "ILAU": {
            "I_retained": ["recorded gender", "admission outcome", "counts"],
            "L_lost": ["department under aggregate selection"],
            "A_introduced": ["common pooled department weights in standardized comparator"],
            "U_unresolved": ["applicant qualifications", "decision process", "causal discrimination"],
        },
        "allowed_claim": "C0 aggregate descriptive difference; C2 context materially changes comparison",
        "blocked_claim": "C1 aggregate record alone establishes department-level admissions bias",
        "residual": "causal and historical interpretation remains unresolved by this table",
        "blocks_C1_false_closure": sign_reversal,
    }

    gates = {
        "G1_SOURCE_TOTALS": grand_total == 4526
        and aggregate["Male"]["applicants"] == 2691
        and aggregate["Female"]["applicants"] == 1835,
        "G2_AGGREGATE_RECORD": aggregate["Male"]["admitted"] == 1198
        and aggregate["Female"]["admitted"] == 557,
        "G3_CONTEXT_EFFECT": sign_reversal,
        "G4_BASELINE_BLOCKS_C1": baseline["blocks_C1_false_closure"],
        "G5_NEXAH_BLOCKS_C1": nexah["blocks_C1_false_closure"]
        and "department under aggregate selection" in nexah["ILAU"]["L_lost"],
        "G6_INCREMENTAL_DETECTION": nexah["blocks_C1_false_closure"]
        and not baseline["blocks_C1_false_closure"],
    }

    result = {
        "test_id": "NEXAH-ORI-01",
        "fixture": "UCBAdmissions_1973_six_departments",
        "aggregate": aggregate,
        "department_strata": strata,
        "direct_standardization_common_pooled_department_weights": standardized,
        "contrasts": {
            "aggregate_female_minus_male": aggregate_delta,
            "standardized_female_minus_male": standardized_delta,
            "sign_reversal": sign_reversal,
        },
        "strong_baseline": baseline,
        "nexah": nexah,
        "gates": gates,
        "method_functioning": all(gates[name] for name in gates if name != "G6_INCREMENTAL_DETECTION"),
        "incremental_detection_utility": gates["G6_INCREMENTAL_DETECTION"],
        "outcome": "TIE_NO_INCREMENTAL_DETECTION_UTILITY"
        if gates["G4_BASELINE_BLOCKS_C1"] and gates["G5_NEXAH_BLOCKS_C1"]
        else "REVIEW_REQUIRED",
    }
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"outcome": result["outcome"], "gates": gates}, indent=2))


if __name__ == "__main__":
    main()
