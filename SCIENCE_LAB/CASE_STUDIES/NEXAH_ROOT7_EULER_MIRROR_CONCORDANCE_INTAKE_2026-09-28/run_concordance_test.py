#!/usr/bin/env python3
"""Deterministic exact-arithmetic concordance test for one existing NEXAH family."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
RESULT_PATH = ROOT / "results.json"


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    d = 3
    while d * d <= n:
        if n % d == 0:
            return False
        d += 2
    return True


def primes_through(n: int) -> list[int]:
    return [k for k in range(2, n + 1) if is_prime(k)]


PRIMES = primes_through(2000)


def prime_index(p: int) -> int:
    assert is_prime(p)
    return PRIMES.index(p) + 1


def prime_at(index: int) -> int:
    return PRIMES[index - 1]


def decode(text: str, base: int) -> int:
    return int(text, base)


def reverse_fixed_bits(n: int, width: int) -> int:
    return int(f"{n:0{width}b}"[::-1], 2)


def roman_value(text: str) -> int:
    values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100,
              "D": 500, "M": 1000}
    total = 0
    previous = 0
    for char in reversed(text):
        value = values[char]
        if value < previous:
            total -= value
        else:
            total += value
            previous = value
    return total


checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({
        "id": check_id,
        "pass": bool(condition),
        "observed": observed,
        "expected": expected,
    })


# Same carrier, different numeral views.
views_41 = {"131_5": decode("131", 5), "51_8": decode("51", 8),
            "56_7": decode("56", 7), "29_16": decode("29", 16)}
check("carrier_41_views", set(views_41.values()) == {41}, views_41, 41)
check("carrier_131_views", roman_value("CXXXI") == 131,
      {"decimal": 131, "roman": roman_value("CXXXI"), "digits": [1, 3, 1]},
      "same value 131")

# Bit mirror is an involution but not a value invariant.
mirror_41 = reverse_fixed_bits(41, 6)
check("bit_mirror_41_to_37", mirror_41 == 37, mirror_41, 37)
check("bit_mirror_roundtrip", reverse_fixed_bits(mirror_41, 6) == 41,
      reverse_fixed_bits(mirror_41, 6), 41)
check("bit_mirror_prime_boundary", is_prime(41) and is_prime(37),
      {"41_prime": is_prime(41), "37_prime": is_prime(37)}, True)

# Euler index handoff, checked on a finite range and at the marked value.
handoff_ok = all(n * n - n + 41 == (n - 1) * (n - 1) + (n - 1) + 41
                 for n in range(-1000, 1001))
check("euler_index_handoff", handoff_ok, "n=-1000..1000", "E_-(n)=E_+(n-1)")
check("euler_41_marker", 41 * 41 - 41 + 41 == 1681,
      41 * 41 - 41 + 41, 1681)

# Prime-centred gates, seven-index arch and decimal reverse boundary.
check("prime_gate_1031_1033", prime_index(1031) == 173 and prime_index(1033) == 174,
      {"1031": prime_index(1031), "1033": prime_index(1033)}, {"1031": 173, "1033": 174})
check("composite_center_1032", not is_prime(1032), is_prime(1032), False)
check("seven_index_arch", prime_index(1087) - prime_index(1033) == 7,
      {"from": prime_index(1033), "to": prime_index(1087)}, {"delta": 7})
check("decimal_reverse_1087", int(str(1087)[::-1]) == 7801 and int(str(7801)[::-1]) == 1087,
      {"forward": int(str(1087)[::-1]), "return": int(str(7801)[::-1])},
      {"forward": 7801, "return": 1087})
check("reverse_prime_composite_boundary", is_prime(1087) and not is_prime(7801) and 7801 == 29 * 269,
      {"1087_prime": is_prime(1087), "7801_prime": is_prime(7801), "factorization": [29, 269]},
      "prime -> composite; 7801=29*269")

# Z7 reflection: one fixed reference plus three mirrored direction pairs.
z7_map = {x: (-x) % 7 for x in range(7)}
z7_pairs = [(x, z7_map[x]) for x in range(1, 4)]
check("z7_reflection", all(z7_map[z7_map[x]] == x for x in range(7)), z7_map,
      {0: 0, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1})
check("z7_three_pairs", z7_pairs == [(1, 6), (2, 5), (3, 4)], z7_pairs,
      [(1, 6), (2, 5), (3, 4)])

# Abelis angle lane is a decimal +10 lane with an antipodal +180 view, not a prime lane.
angles = list(range(7, 98, 10))
mirrors = [a + 180 for a in angles]
check("angle_lane", angles == [7, 17, 27, 37, 47, 57, 67, 77, 87, 97], angles,
      "7+10k for k=0..9")
check("antipodal_angle_view", mirrors == [187, 197, 207, 217, 227, 237, 247, 257, 267, 277],
      mirrors, "theta+180")
check("angle_lane_not_prime_lane", any(not is_prime(x) for x in angles),
      [x for x in angles if not is_prime(x)], "at least one composite")

# Euler carrier ladder and the already registered terminal correction.
supplied = [13, 41, 137, 241, 367, 487, 617, 751, 883, 1031, 1171, 1303, 1459]
supplied_indices = [prime_index(x) for x in supplied]
supplied_gaps = [b - a for a, b in zip(supplied_indices, supplied_indices[1:])]
corrected = supplied[:-1] + [1471]
corrected_indices = [prime_index(x) for x in corrected]
corrected_gaps = [b - a for a, b in zip(corrected_indices, corrected_indices[1:])]
check("detect_1459_terminal_error", prime_index(1459) == 232 and prime_at(233) == 1471,
      {"1459_index": prime_index(1459), "P233": prime_at(233)},
      {"1459_index": 232, "P233": 1471})
check("corrected_plus20_lane", corrected_gaps == [7] + [20] * 11,
      corrected_gaps, [7] + [20] * 11)
check("eight_step_13_to_883", corrected.index(883) == 8 and prime_index(883) - prime_index(13) == 147,
      {"steps": corrected.index(883), "prime_index_delta": prime_index(883) - prime_index(13)},
      {"steps": 8, "prime_index_delta": 147})
check("decimal_threshold_8_plus_4", len(corrected) - 1 == 12 and corrected.index(883) == 8,
      {"total_steps": len(corrected) - 1, "before_threshold": 8,
       "after_threshold": len(corrected) - 1 - corrected.index(883)},
      {"total_steps": 12, "split": [8, 4]})

# Selected cross-record bridge: exact arithmetic, not a derived mechanism.
check("41_plus_60_bridge", 41 + 60 == 101 and is_prime(101),
      {"sum": 41 + 60, "prime": is_prime(101)}, {"sum": 101, "prime": True})
check("prime_index_doubling_41_101", prime_index(41) == 13 and prime_index(101) == 26,
      {"pi41": prime_index(41), "pi101": prime_index(101)}, {"pi41": 13, "pi101": 26})
check("timegear_gcd_60", __import__("math").gcd(420, 600) == 60,
      __import__("math").gcd(420, 600), 60)
check("q10_center_fix_101", (-0) % 10 == 0, (-0) % 10, 0)

passed = all(item["pass"] for item in checks)
result = {
    "test_id": "NEXAH_ROOT7_EULER_MIRROR_CONCORDANCE_001",
    "date": "2026-09-28",
    "classification": "CONSOLIDATED_EXISTING_FAMILY_WITH_TERMINAL_CORRECTION",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "checks": checks,
    "boundaries": [
        "1459=P232 is a representation error for the strict +20 lane; P233=1471",
        "the corrected ladder has 11 of 12 +20 transitions, not 10 of 12",
        "the 8+4 split at 883 survives as an ordinal decimal-threshold view",
        "41+60=101 and prime-index doubling are exact selected relations, not a generator",
        "angle lane 7,17,...,97 is not a prime lane",
        "image semantics do not establish a physical or universal mechanism",
    ],
}

canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode("utf-8")
result["scientific_hash"] = hashlib.sha256(canonical).hexdigest()
RESULT_PATH.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps({k: result[k] for k in ("test_id", "classification", "passed", "check_count", "passed_count", "scientific_hash")}, indent=2))

if not passed:
    raise SystemExit(1)

