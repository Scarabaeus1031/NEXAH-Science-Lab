#!/usr/bin/env python3
"""Bounded null-model test for the Golden Line and M-class candidate."""

from __future__ import annotations

import hashlib
import json
from decimal import Decimal, getcontext
from fractions import Fraction
from math import isqrt
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "m_class_golden_line_nullmodel_results.json"
checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


def is_prime(n: int) -> bool:
    return n > 1 and all(n % d for d in range(2, isqrt(n) + 1))


def is_palindrome(n: int) -> bool:
    return n >= 0 and str(n) == str(n)[::-1]


def palindrome_prefix(seed: int, multiplier: int = 2, cap: int = 32) -> list[int]:
    out: list[int] = []
    n = seed
    while len(out) < cap and is_palindrome(n):
        out.append(n)
        n *= multiplier
    return out


def p(a: int, z: int) -> int:
    return 101 * a + 10 * z


def h(a: int, z: int) -> tuple[int, int]:
    return a, 9 - z


def j_state(a: int, z: int) -> tuple[int, int]:
    return 10 - a, 9 - z


def k_state(a: int, z: int) -> tuple[int, int]:
    return 10 - a, z


# 1. Golden Line and generic scale controls.
golden_full = [101 * 2**k for k in range(11)]
golden_card = [101 * 2**k for k in range(2, 8)]
check("golden_line_exact_dyadic_segment",
      golden_card == [404, 808, 1616, 3232, 6464, 12928],
      golden_card, [404, 808, 1616, 3232, 6464, 12928])

pairs = [(97, 101), (103, 107), (109, 113), (127, 131), (95, 99), (99, 103)]
multipliers = [2, 3, 5, 7, 11]
generic_failures: list[dict[str, int]] = []
for a0, b0 in pairs:
    for multiplier in multipliers:
        for exponent in range(6):
            scale = multiplier**exponent
            a, b = a0 * scale, b0 * scale
            whole, delta = a + b, b - a
            returned = ((whole - delta) // 2, (whole + delta) // 2)
            if not (returned == (a, b)
                    and Fraction(a, b) == Fraction(a0, b0)
                    and Fraction(delta, whole) == Fraction(b0-a0, b0+a0)):
                generic_failures.append({"a0": a0, "b0": b0,
                                         "m": multiplier, "k": exponent})
check("scale_and_ghostgrid_invariants_are_generic",
      not generic_failures, generic_failures, [])

# 2. Exhaustive bounded palindrome nulls.
seed_runs = {seed: palindrome_prefix(seed) for seed in range(1, 1000)}
max_run = max(map(len, seed_runs.values()))
max_seeds = [seed for seed, run in seed_runs.items() if len(run) == max_run]
check("bounded_seed_scan_maximum_run_is_four",
      max_run == 4, max_run, 4)
check("bounded_seed_scan_all_maximizers",
      max_seeds == [1, 11, 101, 111], max_seeds, [1, 11, 101, 111])
check("three_digit_maximizers",
      [n for n in max_seeds if 100 <= n <= 999] == [101, 111],
      [n for n in max_seeds if 100 <= n <= 999], [101, 111])

prime_pal_seeds = [n for n in range(100, 1000)
                   if is_prime(n) and is_palindrome(n)]
prime_pal_runs = {n: len(seed_runs[n]) for n in prime_pal_seeds}
check("three_digit_palindromic_prime_population_size",
      len(prime_pal_seeds) == 15, len(prime_pal_seeds), 15)
check("101_unique_in_three_digit_palindromic_prime_null",
      [n for n in prime_pal_seeds if prime_pal_runs[n] == max(prime_pal_runs.values())]
      == [101],
      {str(n): prime_pal_runs[n] for n in prime_pal_seeds},
      {"unique_maximizer": 101, "run": 4})
check("101_palindrome_prefix",
      seed_runs[101] == [101, 202, 404, 808],
      seed_runs[101], [101, 202, 404, 808])
check("carry_breaks_prefix_at_1616",
      not is_palindrome(1616), 1616, "not a decimal palindrome")

# 3. The 90-state carrier algebra and the 1100 bridge.
carrier_failures: list[dict[str, object]] = []
for a in range(1, 10):
    for z in range(10):
        state = (a, z)
        hs, js, ks = h(a, z), j_state(a, z), k_state(a, z)
        conditions = [
            h(*hs) == state,
            j_state(*js) == state,
            k_state(*ks) == state,
            h(*js) == k_state(*state),
            j_state(*hs) == k_state(*state),
            p(*js) == 1100 - p(*state),
        ]
        if not all(conditions):
            carrier_failures.append({"state": state, "conditions": conditions})
check("carrier_klein_four_algebra_all_90_states",
      not carrier_failures, carrier_failures, [])

golden_window = [101, 202, 404, 808]
j_images = [1100 - n for n in golden_window]
check("golden_window_J1100_images",
      j_images == [999, 898, 696, 292],
      j_images, [999, 898, 696, 292])
check("golden_and_J_images_all_palindromes",
      all(is_palindrome(n) for n in golden_window + j_images),
      golden_window + j_images, "all decimal palindromes")
check("808_triple_boundary",
      golden_window[-1] == 808 and 1100 - 808 == 292
      and 101 * 2**4 == 1616 and 1100 - 1616 < 0,
      {"last_palindrome": 808, "J_partner": 292,
       "next": 1616, "next_J": 1100 - 1616},
      {"last_palindrome": 808, "J_partner": 292,
       "next": 1616, "next_J_negative": True})

bound_states = [232, 282, 292]
expected_orbits = {
    232: {"H": 262, "J": 868, "K": 838},
    282: {"H": 212, "J": 818, "K": 888},
    292: {"H": 202, "J": 808, "K": 898},
}
observed_orbits: dict[int, dict[str, int]] = {}
for n in bound_states:
    a, z = n // 100, (n // 10) % 10
    observed_orbits[n] = {"H": p(*h(a, z)),
                          "J": p(*j_state(a, z)),
                          "K": p(*k_state(a, z))}
check("232_282_292_exact_carrier_orbits",
      observed_orbits == expected_orbits, observed_orbits, expected_orbits)

j_image_of_a2 = [p(*j_state(2, z)) for z in range(10)]
intersection = sorted(set(golden_window) & set(j_image_of_a2))
check("292_bridge_unique_golden_intersection",
      intersection == [808], intersection, [808])
check("292_has_two_typed_nonidentical_reflections",
      observed_orbits[292]["H"] == 202
      and observed_orbits[292]["J"] == 808,
      observed_orbits[292], {"H": 202, "J": 808})

# 4. The 181 = 69 + 112 split and its frozen null population.
getcontext().prec = 50
phi = (Decimal(5).sqrt() + Decimal(1)) / Decimal(2)


def nearest_phi_split(total: int) -> tuple[Decimal, int, int]:
    candidates = []
    for small in range(1, total):
        large = total - small
        if large < small:
            continue
        error = abs(Decimal(large) / Decimal(small) - phi)
        candidates.append((error, small, large))
    return min(candidates)


phi_rows = [(nearest_phi_split(total), total) for total in range(3, 293)]
target_error, target_small, target_large = nearest_phi_split(181)
rank = 1 + sum(row[0][0] < target_error for row in phi_rows)
relative_error = target_error / phi
check("181_exact_relational_split",
      69 + 112 == 181, [69, 112, 181], "69+112=181")
check("181_split_is_nearest_integer_phi_split",
      (target_small, target_large) == (69, 112),
      {"small": target_small, "large": target_large},
      {"small": 69, "large": 112})
check("181_phi_split_not_top_ranked_in_frozen_null",
      rank == 65,
      {"rank": rank, "population": len(phi_rows),
       "absolute_ratio_error": str(target_error),
       "relative_error": str(relative_error)},
      {"rank": 65, "population": 290})
check("affine_closure_181_292_808_1100",
      181 + 111 == 292 and 292 + 808 == 1100
      and 69 + 112 + 111 + 808 == 1100,
      {"181+111": 181+111, "292+808": 292+808,
       "69+112+111+808": 69+112+111+808},
      {"181+111": 292, "292+808": 1100,
       "69+112+111+808": 1100})

passed = all(item["pass"] for item in checks)
result = {
    "test_id": "NEXAH_M_CLASS_GOLDEN_LINE_NULLMODEL_001",
    "date": "2026-09-28",
    "status": "RETROSPECTIVE_EXPLORATORY_DISCOVERY_INFORMED",
    "classification": "BOUNDED_DECIMAL_CROSS_CARRIER_M_CANDIDATE_NOT_PROMOTED",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "checks": checks,
    "golden_line": golden_full,
    "palindrome_null": {
        "seed_domain": [1, 999],
        "maximum_prefix_length": max_run,
        "all_maximizers": max_seeds,
        "three_digit_palindromic_prime_runs": prime_pal_runs,
    },
    "cross_carrier_bridge": {
        "operator": "J(n)=1100-n",
        "golden_window": golden_window,
        "images": j_images,
        "selected_state_orbits": observed_orbits,
        "golden_intersection_with_a2_J_images": intersection,
    },
    "phi_split": {
        "equation": "181=69+112",
        "ratio_112_over_69": str(Decimal(112) / Decimal(69)),
        "phi": str(phi),
        "absolute_ratio_error": str(target_error),
        "relative_error": str(relative_error),
        "rank": rank,
        "population": len(phi_rows),
    },
    "decision": {
        "808": "validated as a bounded representation turning point, not a physical or dynamical switch",
        "292": "exact half-edge state and J_1100 bridge partner of 808; NCS input/output rule remains unvalidated",
        "232_282": "exact members of the same carrier/reflection algebra, not Golden-Line hits",
        "181_split": "unique nearest integer phi split for total 181 but only rank 65/290 in the frozen null",
        "scale_invariants": "generic across all matched pair and multiplier controls",
        "M_class": "bounded decimal cross-carrier candidate only; independent confirmation required before promotion",
    },
    "claim_boundary": "No resonance, physical transition, causal switch, universal phi law, or new theorem is established.",
}
canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode("utf-8")
result["scientific_hash"] = hashlib.sha256(canonical).hexdigest()
OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps({k: result[k] for k in (
    "test_id", "status", "classification", "passed", "check_count",
    "passed_count", "scientific_hash")}, indent=2))
if not passed:
    raise SystemExit(1)
