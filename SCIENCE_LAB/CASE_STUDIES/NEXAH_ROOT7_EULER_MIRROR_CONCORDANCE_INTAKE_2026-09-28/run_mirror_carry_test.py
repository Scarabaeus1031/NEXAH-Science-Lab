#!/usr/bin/env python3
"""Exact mirror/carry and prime-gap residual test for the existing family."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "mirror_carry_results.json"


def sieve(limit: int) -> list[int]:
    flags = bytearray(b"\x01") * (limit + 1)
    flags[:2] = b"\x00\x00"
    for p in range(2, int(limit ** 0.5) + 1):
        if flags[p]:
            flags[p * p: limit + 1: p] = b"\x00" * (((limit - p * p) // p) + 1)
    return [n for n, flag in enumerate(flags) if flag]


PRIMES = sieve(200_000)


def p(index: int) -> int:
    return PRIMES[index - 1]


def pi(value: int) -> int:
    return PRIMES.index(value) + 1


def q(base: int, state: int) -> int:
    return (-state) % base


def r(base: int, state: int) -> int:
    return base - 1 - state


def translate(base: int, state: int, amount: int) -> int:
    return (state + amount) % base


def carrier(a: int, base: int, state: int) -> int:
    return a * base * base + state * base + a


checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


all_states = [(base, state) for base in range(2, 37) for state in range(base)]
check("q_involution_all_bases", all(q(b, q(b, z)) == z for b, z in all_states),
      len(all_states), "all 665 states")
check("r_involution_all_bases", all(r(b, r(b, z)) == z for b, z in all_states),
      len(all_states), "all 665 states")
check("r_equals_q_after_plus_one", all(r(b, z) == q(b, translate(b, z, 1))
      for b, z in all_states), len(all_states), "R_B=Q_B o T_1")

fixed_counts = {}
for base in range(2, 37):
    fixed_counts[base] = {
        "Q": sum(q(base, z) == z for z in range(base)),
        "R": sum(r(base, z) == z for z in range(base)),
    }
check("q_fixed_point_parity", all(v["Q"] == (2 if b % 2 == 0 else 1)
      for b, v in fixed_counts.items()), fixed_counts,
      "Q: two fixed states in even bases, one in odd bases")
check("r_fixed_point_parity", all(v["R"] == (0 if b % 2 == 0 else 1)
      for b, v in fixed_counts.items()), fixed_counts,
      "R: no fixed state in even bases, one in odd bases")

conjugacy = {}
for base in range(2, 37):
    solutions = []
    for k in range(base):
        if all(translate(base, q(base, translate(base, z, -k)), k) == r(base, z)
               for z in range(base)):
            solutions.append(k)
    conjugacy[base] = solutions
check("integer_translation_conjugacy_iff_odd",
      all(bool(solutions) == (base % 2 == 1) for base, solutions in conjugacy.items()),
      conjugacy, "integer conjugacy only in odd bases; even bases require half-step")

carry_records = {}
carry_ok = True
for base in range(2, 37):
    records = []
    for state in range(base):
        carry, digit = divmod(base - state, base)
        records.append((state, carry, digit))
        carry_ok &= digit == q(base, state)
        carry_ok &= carry == (1 if state == 0 else 0)
    carry_records[base] = records
check("raw_radix_complement_carry_boundary", carry_ok,
      {b: [row for row in rows if row[1] == 1] for b, rows in carry_records.items()},
      "exactly state zero emits carry one in every base")

outcomes_101 = {
    "Q10": carrier(1, 10, q(10, 0)),
    "R10": carrier(1, 10, r(10, 0)),
    "raw_10_minus_z": carrier(1, 10, 10),
}
check("carrier_101_three_typed_outcomes", outcomes_101 == {
      "Q10": 101, "R10": 191, "raw_10_minus_z": 201},
      outcomes_101, {"Q10": 101, "R10": 191, "raw_10_minus_z": 201})

def bit_reverse(value: int, width: int) -> int:
    return int(f"{value:0{width}b}"[::-1], 2)


check("fixed_width_bit_mirror_41_37", bit_reverse(41, 6) == 37 and bit_reverse(37, 6) == 41,
      [bit_reverse(41, 6), bit_reverse(37, 6)], [37, 41])
check("width_is_required_for_return",
      bit_reverse(bit_reverse(2, 4), 4) == 2 and int(bin(bit_reverse(2, 4))[2:][::-1], 2) != 2,
      {"width4": bit_reverse(bit_reverse(2, 4), 4),
       "width_dropped": int(bin(bit_reverse(2, 4))[2:][::-1], 2)},
      {"width4": 2, "width_dropped_not": 2})

# Prime-gap residual and controls.
observed, expected = 1459, 1471
observed_i, expected_i = pi(observed), pi(expected)
value_residual = observed - expected
index_residual = observed_i - expected_i
check("terminal_prime_gap", (observed_i, expected_i, expected - observed) == (232, 233, 12),
      {"observed_index": observed_i, "expected_index": expected_i,
       "prime_gap": expected - observed},
      {"observed_index": 232, "expected_index": 233, "prime_gap": 12})
check("signed_residual_vector", (value_residual, index_residual) == (-12, -1),
      [value_residual, index_residual], [-12, -1])
check("correction_vector", (expected - observed, expected_i - observed_i) == (12, 1),
      [expected - observed, expected_i - observed_i], [12, 1])

phase12 = {"1459": observed % 12, "1471": expected % 12}
phase112 = {"1459": observed % 112, "1471": expected % 112}
check("mod12_lens_hides_error", phase12 == {"1459": 7, "1471": 7},
      phase12, "same residue; +12 is one full mod-12 turn")
check("mod112_lens_is_twelve_microticks", phase112 == {"1459": 3, "1471": 15},
      phase112, "difference +12/112, not +1/112")

pair_aggregate = {
    "value_sum": observed + expected,
    "index_sum": observed_i + expected_i,
    "midpoint": (observed + expected) // 2,
    "P465": p(465),
}
check("pair_aggregate_not_P465", pair_aggregate == {
      "value_sum": 2930, "index_sum": 465, "midpoint": 1465, "P465": 3307},
      pair_aggregate, {"value_sum": 2930, "index_sum": 465,
                       "midpoint": 1465, "P465": 3307})
check("pair_factorization", 2930 == 10 * 293 and 1465 == 5 * 293,
      {"2930": "10*293", "1465": "5*293"}, True)

first_10000 = PRIMES[:10_000]
gaps = [b - a for a, b in zip(first_10000, first_10000[1:])]
gap12_count = gaps.count(12)
check("gap12_frequency_control", gap12_count > 1,
      {"gap12_count_first_9999_gaps": gap12_count,
       "fraction": gap12_count / len(gaps)},
      "gap 12 is not unique")

passed = all(item["pass"] for item in checks)
result = {
    "test_id": "NEXAH_MIRROR_CARRY_TYPED_OPERATOR_001",
    "date": "2026-09-28",
    "classification": "TYPED_MIRROR_FAMILY_CONFIRMED_PHASE_IDENTITY_REJECTED",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "prime_gap_control": {
        "population": "first 10,000 primes / 9,999 adjacent gaps",
        "gap_12_count": gap12_count,
        "gap_12_fraction": gap12_count / len(gaps),
    },
    "checks": checks,
    "decision": {
        "mirror_family": "confirmed only with base, phase, width and carry types",
        "prime_gap_residual": "(-12,-1) observed-minus-expected; (+12,+1) correction",
        "one_over_twelve": "available only as a newly normalized reciprocal slope; not the existing c12 tick",
        "one_over_112": "not matched; the value correction is 12/112",
        "draft_drift": "may label correction/error orientation only after an explicit coordinate convention",
    },
}
canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode("utf-8")
result["scientific_hash"] = hashlib.sha256(canonical).hexdigest()
OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps({k: result[k] for k in (
    "test_id", "classification", "passed", "check_count", "passed_count",
    "prime_gap_control", "scientific_hash")}, indent=2))
if not passed:
    raise SystemExit(1)

