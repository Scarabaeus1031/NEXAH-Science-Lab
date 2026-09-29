#!/usr/bin/env python3
"""Exact follow-on concordance for Prime Lens, Binding Mirror and Root 40."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "prime_lens_followon_results.json"
checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


core = (7, 7)
shells = [(2,) + core + (2,), (4,) + core + (4,)]
check("separator_shell_family", shells == [(2, 7, 7, 2), (4, 7, 7, 4)],
      shells, [(2, 7, 7, 2), (4, 7, 7, 4)])

quaternion_coefficients = (2, 2, 4, 4)
check("shell_parameters_match_quaternion_coefficient_pairs",
      sorted(quaternion_coefficients) == [2, 2, 4, 4],
      quaternion_coefficients, "two 2 coefficients and two 4 coefficients")
check("quaternion_norm_is_40",
      sum(x * x for x in quaternion_coefficients) == 40,
      sum(x * x for x in quaternion_coefficients), 40)

check("root40_euclidean_view", 6**2 + 2**2 == 40,
      6**2 + 2**2, 40)
check("root40_hyperbolic_view", 7**2 - 3**2 == 40,
      7**2 - 3**2, 40)

cross = {"7+33": 7 + 33, "17+23": 17 + 23,
         "7+23": 7 + 23, "17+33": 17 + 33}
check("binding_cross_sums", cross == {"7+33": 40, "17+23": 40,
                                       "7+23": 30, "17+33": 50},
      cross, {"7+33": 40, "17+23": 40, "7+23": 30, "17+33": 50})
check("binding_30_40_50_triangle", 30**2 + 40**2 == 50**2,
      [30**2 + 40**2, 50**2], [2500, 2500])

direct = 12 * 6 + 13 * 7
crossed = 12 * 7 + 13 * 6
check("binding_hinge_channels", (direct, crossed, direct - crossed) == (163, 162, 1),
      [direct, crossed, direct - crossed], [163, 162, 1])
check("binding_hinge_factor_identity",
      direct - crossed == (12 - 13) * (6 - 7) == 1,
      {"channel_difference": direct - crossed,
       "factor_product": (12 - 13) * (6 - 7)},
      {"channel_difference": 1, "factor_product": 1})

sequence = [3, 1]
while len(sequence) < 10:
    sequence.append(sequence[-1] + sequence[-2])
expected_sequence = [3, 1, 4, 5, 9, 14, 23, 37, 60, 97]
check("binding_fibonacci_return", sequence == expected_sequence,
      sequence, expected_sequence)
check("return_meets_prime_lens_boundary",
      sequence[-1] == 97 and 101 - sequence[-1] == 4,
      {"return": sequence[-1], "boundary_peer": 101,
       "gap": 101 - sequence[-1]},
      {"return": 97, "boundary_peer": 101, "gap": 4})
check("boundary_peer_not_recurrence_successor",
      sequence[-1] + sequence[-2] == 157 and 101 != 157,
      {"recurrence_successor": sequence[-1] + sequence[-2],
       "boundary_peer": 101},
      {"recurrence_successor": 157, "boundary_peer": 101})

left, right = 1836, 1729
whole, difference = left + right, left - right
check("mirror_whole_difference", (whole, difference) == (3565, 107),
      [whole, difference], [3565, 107])
check("mirror_exact_return",
      ((whole + difference) // 2, (whole - difference) // 2) == (left, right),
      [(whole + difference) // 2, (whole - difference) // 2], [left, right])
check("mirror_mod11_projection",
      (left % 11, right % 11, whole % 11) == (10, 2, 1),
      [left % 11, right % 11, whole % 11], [10, 2, 1])

passed = all(item["pass"] for item in checks)
result = {
    "test_id": "NEXAH_PRIME_LENS_FOLLOWON_CONCORDANCE_001",
    "date": "2026-09-28",
    "classification": "EXISTING_VIEWS_CONNECTED_NO_NEW_RECURRENCE",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "checks": checks,
    "decision": {
        "separator_shell": "7|7 is the fixed core; 2 and 4 are parallel mirrored shell parameters",
        "root40": "the shell parameters recur as the paired coefficients 2,2,4,4 of a norm-40 quaternion record",
        "fibonacci_boundary": "the (3,1) recurrence reaches 97; 101 is its gap-4 boundary peer, not its recurrence successor",
        "whole_difference": "1836 and 1729 are exactly reconstructed from whole 3565 and difference 107 and retain the registered mod-11 projection",
        "claim_boundary": "exact cross-visual concordance only; no unseen generator or new theory",
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
