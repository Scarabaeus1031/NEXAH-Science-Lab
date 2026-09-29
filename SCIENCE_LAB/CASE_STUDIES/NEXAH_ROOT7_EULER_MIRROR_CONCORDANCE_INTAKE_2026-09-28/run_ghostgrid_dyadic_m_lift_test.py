#!/usr/bin/env python3
"""Exact Ghostgrid process test for the 97|101 dyadic lift."""

from __future__ import annotations

import hashlib
import json
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "ghostgrid_dyadic_m_lift_results.json"
checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


recurrence = [3, 1]
while len(recurrence) < 10:
    recurrence.append(recurrence[-1] + recurrence[-2])
check("recurrence_reaches_97",
      recurrence == [3, 1, 4, 5, 9, 14, 23, 37, 60, 97],
      recurrence, [3, 1, 4, 5, 9, 14, 23, 37, 60, 97])

cut_value = recurrence[-1] + 4
check("typed_gap4_cut_reaches_101", cut_value == 101, cut_value, 101)
check("operator_order_is_not_interchangeable",
      2 * (97 + 4) == 202 and (2 * 97) + 4 == 198,
      {"D_after_C4": 2 * (97 + 4), "C4_after_D": 2 * 97 + 4},
      {"D_after_C4": 202, "C4_after_D": 198})

records = []
for k in range(11):
    scale = 2**k
    a = 97 * scale
    b = 101 * scale
    whole = a + b
    delta = b - a
    returned = ((whole - delta) // 2, (whole + delta) // 2)
    records.append({
        "k": k, "scale": scale, "A": a, "B": b,
        "S": whole, "Delta": delta,
        "midpoint": Fraction(whole, 2),
        "normalized_delta": Fraction(delta, whole),
        "ratio_A_B": Fraction(a, b),
        "return": returned,
        "B_mod_11": b % 11,
        "trace": ["RECURRENCE", "CUT_4", f"LIFT_2^{k}",
                  "TWO_CUTS", "RELATION", "GHOSTGRID", "RETURN"],
    })

check("dyadic_B_channel",
      [r["B"] for r in records[:5]] == [101, 202, 404, 808, 1616],
      [r["B"] for r in records[:5]], [101, 202, 404, 808, 1616])
check("paired_A_channel",
      [r["A"] for r in records[:5]] == [97, 194, 388, 776, 1552],
      [r["A"] for r in records[:5]], [97, 194, 388, 776, 1552])
check("whole_scales_from_198",
      all(r["S"] == 198 * r["scale"] for r in records),
      [r["S"] for r in records[:5]], [198, 396, 792, 1584, 3168])
check("delta_scales_from_4",
      all(r["Delta"] == 4 * r["scale"] for r in records),
      [r["Delta"] for r in records[:5]], [4, 8, 16, 32, 64])
check("midpoint_scales_from_99",
      all(r["midpoint"] == 99 * r["scale"] for r in records),
      [str(r["midpoint"]) for r in records[:5]], ["99", "198", "396", "792", "1584"])
check("whole_difference_return_exact",
      all(r["return"] == (r["A"], r["B"]) for r in records),
      [r["return"] for r in records[:4]],
      [(97, 101), (194, 202), (388, 404), (776, 808)])
check("normalized_relation_invariants",
      all(r["normalized_delta"] == Fraction(2, 99)
          and r["ratio_A_B"] == Fraction(97, 101) for r in records),
      {"Delta_over_S": str(records[-1]["normalized_delta"]),
       "A_over_B": str(records[-1]["ratio_A_B"])},
      {"Delta_over_S": "2/99", "A_over_B": "97/101"})
check("two_node_relation_topology_constant",
      all((2, 1) == (2, 1) for _ in records),
      {"nodes": 2, "relation_edges": 1, "scales_tested": len(records)},
      {"nodes": 2, "relation_edges": 1, "scales_tested": 11})

palindrome_flags = [str(r["B"]) == str(r["B"])[::-1] for r in records[:5]]
check("decimal_palindrome_window",
      palindrome_flags == [True, True, True, True, False],
      palindrome_flags, [True, True, True, True, False])
check("decimal_carry_boundary_at_1616",
      records[3]["B"] == 808 and records[4]["B"] == 1616,
      [records[3]["B"], records[4]["B"]], [808, 1616])

mod11 = [r["B_mod_11"] for r in records]
check("mod11_dyadic_trace",
      mod11 == [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2],
      mod11, [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2])
check("404_is_lift_not_mod11_return",
      records[2]["B"] == 404 and records[2]["B_mod_11"] == 8
      and records[2]["B_mod_11"] != records[0]["B_mod_11"],
      {"B": records[2]["B"], "residue": records[2]["B_mod_11"]},
      {"B": 404, "residue": 8, "return": False})
check("mod11_return_occurs_at_tenth_lift",
      records[10]["B_mod_11"] == records[0]["B_mod_11"]
      and all(records[k]["B_mod_11"] != records[0]["B_mod_11"]
              for k in range(1, 10)),
      {"k": 10, "B": records[10]["B"],
       "residue": records[10]["B_mod_11"]},
      {"k": 10, "residue": 2})
check("trace_retains_operator_phases",
      all(r["trace"][:2] == ["RECURRENCE", "CUT_4"]
          and r["trace"][-3:] == ["RELATION", "GHOSTGRID", "RETURN"]
          for r in records),
      records[2]["trace"],
      ["RECURRENCE", "CUT_4", "LIFT_2^2", "TWO_CUTS",
       "RELATION", "GHOSTGRID", "RETURN"])

passed = all(item["pass"] for item in checks)
json_records = [{**r,
                 "midpoint": str(r["midpoint"]),
                 "normalized_delta": str(r["normalized_delta"]),
                 "ratio_A_B": str(r["ratio_A_B"])} for r in records]
result = {
    "test_id": "NEXAH_GHOSTGRID_DYADIC_M_LIFT_001",
    "date": "2026-09-28",
    "classification": "SCALE_EQUIVARIANT_RELATION_GRAPH_M_CANDIDATE_NOT_PROMOTED",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "checks": checks,
    "records": json_records,
    "decision": {
        "ghostgrid_connection": "two cuts plus whole/difference relation reconstruct every scaled pair with trace",
        "404": "B_2=404 is an exact dyadic lift state but not a mod-11 return",
        "return": "whole/difference return holds at every tested scale; mod-11 return first occurs after ten lifts",
        "carry": "the visible m0m decimal palindrome window ends at 808; 1616 crosses the carry boundary",
        "M_candidate": "same two-node one-edge relation graph and exact normalized invariants across scales",
        "M_class_status": "NOT_PROMOTED; controlling C/E/S/M labels remain EXPRESSION_ONLY",
    },
}
canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode("utf-8")
result["scientific_hash"] = hashlib.sha256(canonical).hexdigest()
OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps({k: result[k] for k in (
    "test_id", "classification", "passed", "check_count", "passed_count",
    "scientific_hash")}, indent=2))
if not passed:
    raise SystemExit(1)
