#!/usr/bin/env python3
"""End-to-end test for G_k = D^k o C4 o F across decimal carry."""

from __future__ import annotations

import hashlib
import json
from fractions import Fraction
from math import isqrt
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "composite_g_carry_invariance_results.json"
checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


def odd_core(n: int) -> int:
    while n and n % 2 == 0:
        n //= 2
    return n


def is_prime(n: int) -> bool:
    return n > 1 and all(n % d for d in range(2, isqrt(n) + 1))


def is_palindrome(n: int) -> bool:
    return str(n) == str(n)[::-1]


# F: the previously bound recurrence endpoint.
recurrence = [3, 1]
while len(recurrence) < 10:
    recurrence.append(recurrence[-1] + recurrence[-2])
f_value = recurrence[-1]
c4_value = f_value + 4
check("F_recurrence_endpoint",
      recurrence == [3, 1, 4, 5, 9, 14, 23, 37, 60, 97],
      recurrence, [3, 1, 4, 5, 9, 14, 23, 37, 60, 97])
check("C4_typed_cut", (f_value, c4_value) == (97, 101),
      [f_value, c4_value], [97, 101])

records: list[dict[str, object]] = []
for k in range(21):
    scale = 2**k
    a = f_value * scale
    b = c4_value * scale
    midpoint = 99 * scale
    half_gap = 2 * scale
    total = a + b
    gap = b - a
    mirror_a = 2 * midpoint - a
    mirror_b = 2 * midpoint - b
    interval_a = Fraction(a-a, gap)
    interval_mid = Fraction(midpoint-a, gap)
    interval_b = Fraction(b-a, gap)
    centered_a = Fraction(a-midpoint, half_gap)
    centered_b = Fraction(b-midpoint, half_gap)
    records.append({
        "k": k,
        "scale": scale,
        "A": a,
        "B": b,
        "midpoint": midpoint,
        "gap": gap,
        "half_gap": half_gap,
        "A_odd_core": odd_core(a),
        "B_odd_core": odd_core(b),
        "A_over_B": Fraction(a, b),
        "normalized_gap": Fraction(gap, total),
        "centered_positions": (centered_a, Fraction(0), centered_b),
        "interval_positions": (interval_a, interval_mid, interval_b),
        "mirror": (mirror_a, mirror_b),
        "B_mod_11": b % 11,
        "B_prime": is_prime(b),
        "B_palindrome": is_palindrome(b),
        "three_digit_carrier": 100 <= b <= 999 and b % 10 == b // 100,
        "J1100": 1100 - b,
        "trace": ["F_RECURRENCE", "C4_GAP_CUT", f"D^{k}_DYADIC_LIFT"],
    })

check("G_closed_form_all_scales",
      all(r["B"] == 101 * 2**r["k"] for r in records),
      [r["B"] for r in records[:8]],
      [101, 202, 404, 808, 1616, 3232, 6464, 12928])
check("paired_carrier_closed_form",
      all(r["A"] == 97 * 2**r["k"] for r in records),
      [r["A"] for r in records[:5]], [97, 194, 388, 776, 1552])
check("provenance_quotients_preserved",
      all(r["A"] // r["scale"] == 97 and r["B"] // r["scale"] == 101
          for r in records),
      {"A": records[-1]["A"] // records[-1]["scale"],
       "B": records[-1]["B"] // records[-1]["scale"]},
      {"A": 97, "B": 101})
check("odd_core_carrier_preserved",
      all(r["A_odd_core"] == 97 and r["B_odd_core"] == 101 for r in records),
      {"A_odd_cores": sorted({r["A_odd_core"] for r in records}),
       "B_odd_cores": sorted({r["B_odd_core"] for r in records})},
      {"A_odd_cores": [97], "B_odd_cores": [101]})
check("pair_ratio_preserved",
      all(r["A_over_B"] == Fraction(97, 101) for r in records),
      str(records[-1]["A_over_B"]), "97/101")

check("raw_gap_is_covariant_not_constant",
      [r["gap"] for r in records[:6]] == [4, 8, 16, 32, 64, 128],
      [r["gap"] for r in records[:6]], [4, 8, 16, 32, 64, 128])
check("normalized_gap_preserved",
      all(r["normalized_gap"] == Fraction(2, 99) for r in records),
      str(records[-1]["normalized_gap"]), "2/99")
check("midpoint_covariance",
      all(r["midpoint"] == 99 * r["scale"] for r in records),
      [r["midpoint"] for r in records[:5]], [99, 198, 396, 792, 1584])
check("centered_positions_preserved",
      all(r["centered_positions"] == (Fraction(-1), Fraction(0), Fraction(1))
          for r in records),
      [str(x) for x in records[-1]["centered_positions"]], ["-1", "0", "1"])
check("interval_positions_preserved",
      all(r["interval_positions"] == (Fraction(0), Fraction(1, 2), Fraction(1))
          for r in records),
      [str(x) for x in records[-1]["interval_positions"]], ["0", "1/2", "1"])

check("scale_covariant_mirror_swaps_carriers",
      all(r["mirror"] == (r["B"], r["A"]) for r in records),
      records[4]["mirror"], (records[4]["B"], records[4]["A"]))
mirror_conjugacy = []
for k in range(20):
    r, nxt = records[k], records[k+1]
    for x in (r["A"], r["midpoint"], r["B"]):
        left = 2 * (2 * r["midpoint"] - x)
        right = 2 * nxt["midpoint"] - 2 * x
        mirror_conjugacy.append(left == right)
check("mirror_commutes_with_dyadic_lift",
      all(mirror_conjugacy), all(mirror_conjugacy), True)

palindrome_flags = [r["B_palindrome"] for r in records[:6]]
carrier_flags = [r["three_digit_carrier"] for r in records[:6]]
check("decimal_palindrome_breaks_at_carry",
      palindrome_flags == [True, True, True, True, False, False],
      palindrome_flags, [True, True, True, True, False, False])
check("three_digit_carrier_breaks_at_carry",
      carrier_flags == [True, True, True, True, False, False],
      carrier_flags, [True, True, True, True, False, False])
check("first_representation_break_is_1616",
      next(r["k"] for r in records if not r["B_palindrome"]) == 4
      and records[4]["B"] == 1616,
      {"k": 4, "B": records[4]["B"]}, {"k": 4, "B": 1616})
check("J1100_fixed_axis_exits_after_808",
      [r["J1100"] for r in records[:5]] == [999, 898, 696, 292, -516],
      [r["J1100"] for r in records[:5]], [999, 898, 696, 292, -516])
check("primality_not_preserved",
      [r["B_prime"] for r in records[:5]] == [True, False, False, False, False],
      [r["B_prime"] for r in records[:5]], [True, False, False, False, False])

mod11 = [r["B_mod_11"] for r in records[:11]]
check("raw_mod11_not_preserved_but_periodic",
      mod11 == [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2],
      mod11, [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2])

order_rows = []
for k in range(21):
    after_cut = (f_value + 4) * 2**k
    before_cut = f_value * 2**k + 4
    order_rows.append({"k": k, "Dk_C4_F": after_cut,
                       "C4_Dk_F": before_cut,
                       "difference": after_cut-before_cut})
check("operator_order_agrees_only_at_k0",
      [r["k"] for r in order_rows if r["Dk_C4_F"] == r["C4_Dk_F"]] == [0],
      [r["k"] for r in order_rows if r["Dk_C4_F"] == r["C4_Dk_F"]], [0])
check("operator_order_difference_formula",
      all(r["difference"] == 4 * (2**r["k"] - 1) for r in order_rows),
      [r["difference"] for r in order_rows[:6]], [0, 4, 12, 28, 60, 124])

check("404_additive_subdivision_counts",
      (1616-808)//404 == 2 and (3232-1616)//404 == 4,
      {"808_to_1616": (1616-808)//404,
       "1616_to_3232": (3232-1616)//404},
      {"808_to_1616": 2, "1616_to_3232": 4})
check("trace_retains_operator_types",
      all(r["trace"][:2] == ["F_RECURRENCE", "C4_GAP_CUT"]
          and r["trace"][2] == f"D^{r['k']}_DYADIC_LIFT" for r in records),
      records[4]["trace"], ["F_RECURRENCE", "C4_GAP_CUT", "D^4_DYADIC_LIFT"])

passed = all(item["pass"] for item in checks)
json_records = []
for r in records:
    jr = dict(r)
    for key in ("A_over_B", "normalized_gap"):
        jr[key] = str(jr[key])
    for key in ("centered_positions", "interval_positions"):
        jr[key] = [str(x) for x in jr[key]]
    json_records.append(jr)

result = {
    "test_id": "NEXAH_COMPOSITE_G_CARRY_INVARIANCE_001",
    "date": "2026-09-29",
    "classification": "TYPED_SCALE_INVARIANTS_PRESERVED_REPRESENTATION_BOUNDARY_AT_1616",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "checks": checks,
    "records": json_records,
    "operator_order": order_rows,
    "decision": {
        "preserved_beyond_carry": [
            "typed provenance trace", "odd-core carrier", "97/101 pair ratio",
            "scale-covariant midpoint and affine mirror", "normalized gap 2/99",
            "normalized positions -1/0/+1 and 0/(1/2)/1"
        ],
        "covariant_not_constant": ["absolute gap 4*2^k", "midpoint 99*2^k"],
        "breaks_at_or_before_carry": [
            "decimal palindrome", "three-digit carrier", "fixed J_1100 complement",
            "primality", "raw mod-11 residue"
        ],
        "carry_interpretation": "representation boundary, not structural failure",
        "composition": "operator order is essential; C4 and D^k commute only at k=0",
    },
    "claim_boundary": "No SCN/404 mechanism, physical transition, E8 identity or historical generator is established.",
}
canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode("utf-8")
result["scientific_hash"] = hashlib.sha256(canonical).hexdigest()
OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps({k: result[k] for k in (
    "test_id", "classification", "passed", "check_count", "passed_count",
    "scientific_hash")}, indent=2))
if not passed:
    raise SystemExit(1)
