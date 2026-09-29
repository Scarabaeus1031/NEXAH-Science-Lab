#!/usr/bin/env python3
"""Corrected 11357 sequence and QRT carrier-family boundary test."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "qrt_carrier_connection_results.json"
VALUES = [11537, 11573, 11357]
MODULI = [7, 11, 13, 19]


def split_decimal(n: int, tail_width: int) -> tuple[int, int]:
    scale = 10 ** tail_width
    return divmod(n, scale)


def reconstruct(parts: tuple[int, int], tail_width: int) -> int:
    return parts[0] * (10 ** tail_width) + parts[1]


checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


check("human_owner_corrected_sequence", VALUES == [11537, 11573, 11357],
      VALUES, [11537, 11573, 11357])

digit_multisets = ["".join(sorted(str(n))) for n in VALUES]
check("shared_digit_multiset", len(set(digit_multisets)) == 1,
      digit_multisets, ["11357"] * 3)

digit_sums = [sum(map(int, str(n))) for n in VALUES]
check("shared_digit_sum", digit_sums == [17, 17, 17], digit_sums,
      [17, 17, 17])

cut_2plus3 = [split_decimal(n, 3) for n in VALUES]
cut_3plus2 = [split_decimal(n, 2) for n in VALUES]
check("cut_2plus3", cut_2plus3 == [(11, 537), (11, 573), (11, 357)],
      cut_2plus3, [(11, 537), (11, 573), (11, 357)])
check("cut_3plus2", cut_3plus2 == [(115, 37), (115, 73), (113, 57)],
      cut_3plus2, [(115, 37), (115, 73), (113, 57)])

roundtrips = {
    "2plus3": [reconstruct(parts, 3) for parts in cut_2plus3],
    "3plus2": [reconstruct(parts, 2) for parts in cut_3plus2],
}
check("decimal_cut_roundtrip", all(row == VALUES for row in roundtrips.values()),
      roundtrips, {"2plus3": VALUES, "3plus2": VALUES})

grid_addresses = [divmod(n, 20) for n in VALUES]
check("mod20_grid_addresses",
      grid_addresses == [(576, 17), (578, 13), (567, 17)],
      grid_addresses, [(576, 17), (578, 13), (567, 17)])

grid_deltas = [
    (grid_addresses[i + 1][0] - grid_addresses[i][0],
     grid_addresses[i + 1][1] - grid_addresses[i][1])
    for i in range(2)
]
check("mod20_folded_path", grid_deltas == [(2, -4), (-11, 4)],
      grid_deltas, [(2, -4), (-11, 4)])
check("endpoint_returns_to_r17",
      grid_addresses[0][1] == grid_addresses[2][1] == 17,
      [grid_addresses[0], grid_addresses[2]], [(576, 17), (567, 17)])
check("middle_leaves_r17", grid_addresses[1][1] == 13,
      grid_addresses[1], (578, 13))

fingerprints = [[n % modulus for modulus in MODULI] for n in VALUES]
expected_fingerprints = [[1, 9, 6, 4], [2, 1, 3, 2], [3, 5, 8, 14]]
check("controlling_crt_fingerprints", fingerprints == expected_fingerprints,
      fingerprints, expected_fingerprints)
check("distinct_numeric_addresses", len({tuple(row) for row in fingerprints}) == 3,
      fingerprints, "three distinct CRT fingerprints")

factorizations = {
    11537: [83, 139],
    11573: [71, 163],
    11357: [41, 277],
}
check("factor_lens", all(a * b == n for n, (a, b) in factorizations.items()),
      factorizations, {"all_products_return_carrier": True})

same_carrier = len(set(VALUES)) == 1
family_invariants = {
    "digit_multiset": digit_multisets[0],
    "digit_sum": digit_sums[0],
    "endpoint_mod20_residue": 17,
}
check("qrt_same_carrier_rejected", not same_carrier,
      {"same_carrier": same_carrier, "family_invariants": family_invariants},
      "distinct carriers may share declared family invariants")

# Existing QRT r=17 carrier column and the exact nested Janus records supplied
# by the Human Owner. These share nodes but retain different centers/operators.
carrier_column = [10537, 11357, 11537, 12537, 14357]
carrier_column_addresses = [divmod(n, 20) for n in carrier_column]
check("qrt_r17_carrier_column",
      carrier_column_addresses == [(526, 17), (567, 17), (576, 17),
                                   (626, 17), (717, 17)],
      carrier_column_addresses,
      [(526, 17), (567, 17), (576, 17), (626, 17), (717, 17)])

janus_left, janus_center, janus_right = 11357, 11947, 12537
check("janus_11947_exact_midpoint",
      janus_center - janus_left == janus_right - janus_center == 590,
      {"left": janus_left, "center": janus_center, "right": janus_right,
       "radius": janus_center - janus_left},
      "11357 and 12537 are radius 590 around 11947")
check("janus_11947_factor_lens", janus_center == 13 * 919,
      janus_center, 13 * 919)
check("janus_mod13_complement",
      (janus_left % 13, janus_right % 13) == (8, 5)
      and (janus_left + janus_right) % 13 == 0,
      (janus_left % 13, janus_right % 13), (8, 5))
check("qrt_janus_vertical_bridge",
      (janus_right - janus_left) == 59 * 20,
      {"value_delta": janus_right - janus_left,
       "q_delta": divmod(janus_right, 20)[0] - divmod(janus_left, 20)[0],
       "r_delta": divmod(janus_right, 20)[1] - divmod(janus_left, 20)[1]},
      {"value_delta": 1180, "q_delta": 59, "r_delta": 0})

nested_center = 12555
nested_pairs = [(11357, 13753, 1198), (12537, 12573, 18),
                (12543, 12567, 12), (12549, 12561, 6)]
check("nested_janus_shells",
      all(nested_center - left == right - nested_center == radius
          for left, right, radius in nested_pairs),
      nested_pairs, "all pairs reflect exactly around 12555")

seven_ladder = [nested_center + 6 * k for k in range(-3, 4)]
check("seven_state_janus_ladder",
      seven_ladder == [12537, 12543, 12549, 12555, 12561, 12567, 12573],
      seven_ladder, [12537, 12543, 12549, 12555, 12561, 12567, 12573])

palindrome_translation = [12321 + 18 * m for m in (12, 13, 14)]
check("palindrome_translation_12321",
      palindrome_translation == [12537, 12555, 12573],
      palindrome_translation, [12537, 12555, 12573])

passed = all(item["pass"] for item in checks)
result = {
    "test_id": "NEXAH_QRT_CARRIER_CONNECTION_001",
    "date": "2026-09-28",
    "classification": "CORRECTED_11357_CARRIER_FAMILY_CONFIRMED_QRT_SINGLE_CARRIER_IDENTITY_REJECTED",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "domain": {
        "values": VALUES,
        "cuts": ["2+3", "3+2"],
        "grid_modulus": 20,
        "crt_moduli": MODULI,
    },
    "checks": checks,
    "decision": {
        "correction": "11735/735 withdrawn; terminal carrier is 11357/357",
        "family": "all three carriers share digit multiset 11357 and digit sum 17",
        "qrt": "cuts are reversible views, but distinct integers retain distinct numeric addresses",
        "grid": "the path leaves residue 17 through residue 13 and returns to residue 17",
        "boundary": "carrier family is not carrier identity",
        "janus": "11357 and 12537 share r=17 and mirror around 11947; nested 12555 shells are a separate center relation",
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
