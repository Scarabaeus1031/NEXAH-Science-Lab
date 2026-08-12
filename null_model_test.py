#!/usr/bin/env python3
"""Exhaustive null-model test for rational approximations to phi / 10.

The null model samples integer pairs (p, q) uniformly from

    q_min <= q <= q_max,  1 <= p < q.

Two populations are reported: all denominators, and semiprime denominators.
Here "semiprime" means that q has exactly two prime factors counted with
multiplicity (Omega(q) == 2), so both p1*p2 and p1**2 are included.

No third-party packages are required.  A smallest-prime-factor sieve labels
all denominators, and only numerators inside the narrow acceptance interval
are examined, rather than iterating over every one of the ~112 million pairs.
"""

from __future__ import annotations

import argparse
import heapq
import math
from dataclasses import dataclass
from typing import Iterable, Sequence


TARGET = (1 + 5**0.5) / 20  # phi / 10
OBSERVED_P = 1836
OBSERVED_Q = 11357
DEFAULT_RELATIVE_TOLERANCE = 0.00082  # 0.082%


@dataclass(frozen=True)
class Match:
    """A rational approximation and its relative error."""

    p: int
    q: int
    relative_error: float


@dataclass(frozen=True)
class Result:
    """Summary statistics for one denominator population."""

    name: str
    denominator_count: int
    total_pairs: int
    matching_pairs: int
    denominators_with_match: int
    top_matches: tuple[Match, ...]

    @property
    def pairwise_p_value(self) -> float:
        return self.matching_pairs / self.total_pairs if self.total_pairs else math.nan

    @property
    def denominator_hit_rate(self) -> float:
        if not self.denominator_count:
            return math.nan
        return self.denominators_with_match / self.denominator_count


def smallest_prime_factors(limit: int) -> list[int]:
    """Return an SPF table for 0..limit using an O(n log log n) sieve."""

    spf = list(range(limit + 1))
    if limit >= 1:
        spf[1] = 1
    for prime in range(2, math.isqrt(limit) + 1):
        if spf[prime] != prime:
            continue
        start = prime * prime
        for multiple in range(start, limit + 1, prime):
            if spf[multiple] == multiple:
                spf[multiple] = prime
    return spf


def has_exactly_two_prime_factors(n: int, spf: Sequence[int]) -> bool:
    """Return whether Omega(n) == 2, counting repeated factors."""

    factor_count = 0
    while n > 1:
        n //= spf[n]
        factor_count += 1
        if factor_count > 2:
            return False
    return factor_count == 2


def candidate_numerators(q: int, target: float, tolerance: float) -> range:
    """Return all integer p that can satisfy the relative-error threshold.

    A tiny outward rounding margin prevents a mathematically valid boundary
    candidate from being lost to floating-point rounding.  Every candidate is
    still checked directly before it is counted.
    """

    lower = target * (1.0 - tolerance) * q
    upper = target * (1.0 + tolerance) * q
    p_min = max(1, math.ceil(math.nextafter(lower, -math.inf)))
    p_max = min(q - 1, math.floor(math.nextafter(upper, math.inf)))
    return range(p_min, p_max + 1)


def analyze(
    name: str,
    denominators: Iterable[int],
    target: float,
    tolerance: float,
    top_n: int,
) -> Result:
    """Exhaustively analyze one denominator population."""

    denominator_count = 0
    total_pairs = 0
    matching_pairs = 0
    denominators_with_match = 0
    # Max-quality heap represented by negative error; root is the worst kept.
    closest: list[tuple[float, int, int, Match]] = []

    for q in denominators:
        denominator_count += 1
        total_pairs += q - 1
        q_has_match = False
        for p in candidate_numerators(q, target, tolerance):
            relative_error = abs((p / q) - target) / target
            if relative_error > tolerance:
                continue
            q_has_match = True
            matching_pairs += 1
            match = Match(p, q, relative_error)
            item = (-relative_error, -q, -p, match)
            if len(closest) < top_n:
                heapq.heappush(closest, item)
            elif item > closest[0]:
                heapq.heapreplace(closest, item)
        denominators_with_match += q_has_match

    top_matches = tuple(
        sorted((item[3] for item in closest), key=lambda m: (m.relative_error, m.q, m.p))
    )
    return Result(
        name,
        denominator_count,
        total_pairs,
        matching_pairs,
        denominators_with_match,
        top_matches,
    )


def format_probability(value: float) -> str:
    return f"{value:.12g}  ({value * 100:.9g}%)"


def print_rule(character: str = "─", width: int = 78) -> None:
    print(character * width)


def print_result(result: Result, target: float) -> None:
    print(f"\n{result.name}")
    print_rule()
    print(f"  Eligible denominators       : {result.denominator_count:,}")
    print(f"  Total valid (p, q) pairs    : {result.total_pairs:,}")
    print(f"  Equal-or-better matches     : {result.matching_pairs:,}")
    print(f"  Pairwise p-value            : {format_probability(result.pairwise_p_value)}")
    print(f"  Denominators with a match   : {result.denominators_with_match:,}")
    print(f"  Denominator-level hit rate  : {format_probability(result.denominator_hit_rate)}")
    print("\n  Closest pairs")
    print("  rank          p          q              p/q       relative error")
    for rank, match in enumerate(result.top_matches, 1):
        print(
            f"  {rank:>4} {match.p:>10,} {match.q:>10,}  "
            f"{match.p / match.q:.12f}  {match.relative_error:.12g}"
        )
    if not result.top_matches:
        print("  (none)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Exhaustive null-model test for rational approximations to phi/10."
    )
    parser.add_argument("--q-min", type=int, default=1000)
    parser.add_argument("--q-max", type=int, default=15000)
    parser.add_argument(
        "--tolerance",
        type=float,
        default=DEFAULT_RELATIVE_TOLERANCE,
        help="relative-error cutoff as a fraction (default: 0.00082 = 0.082%%)",
    )
    parser.add_argument(
        "--use-observed-error",
        action="store_true",
        help="replace --tolerance with the exact error of 1836/11357",
    )
    parser.add_argument("--top", type=int, default=5, help="number of closest pairs to show")
    args = parser.parse_args()
    if args.q_min < 2 or args.q_max < args.q_min:
        parser.error("require 2 <= q-min <= q-max")
    if not (0 <= args.tolerance < 1):
        parser.error("--tolerance must satisfy 0 <= tolerance < 1")
    if args.top < 1:
        parser.error("--top must be at least 1")
    return args


def main() -> None:
    args = parse_args()
    observed_ratio = OBSERVED_P / OBSERVED_Q
    observed_error = abs(observed_ratio - TARGET) / TARGET
    tolerance = observed_error if args.use_observed_error else args.tolerance

    spf = smallest_prime_factors(args.q_max)
    all_denominators = range(args.q_min, args.q_max + 1)
    semiprimes = (
        q for q in range(args.q_min, args.q_max + 1)
        if has_exactly_two_prime_factors(q, spf)
    )

    semiprime_result = analyze(
        "SEMIPRIME DENOMINATORS (Omega(q) = 2)",
        semiprimes,
        TARGET,
        tolerance,
        args.top,
    )
    all_result = analyze(
        "ALL INTEGER DENOMINATORS",
        all_denominators,
        TARGET,
        tolerance,
        args.top,
    )

    print_rule("═")
    print(" NULL MODEL TEST: RATIONAL ALIGNMENT WITH phi / 10")
    print_rule("═")
    print(f"  Target T                    : {TARGET:.15f}")
    print(f"  Denominator range           : [{args.q_min:,}, {args.q_max:,}]")
    print(f"  Relative-error cutoff       : {tolerance:.12g} ({tolerance * 100:.9g}%)")
    print(f"  Observed pair               : ({OBSERVED_P:,}, {OBSERVED_Q:,})")
    print(f"  Observed ratio              : {observed_ratio:.15f}")
    print(f"  Observed relative error     : {observed_error:.12g} ({observed_error * 100:.9g}%)")
    print(
        "  Observed pair passes cutoff : "
        + ("YES" if observed_error <= tolerance else "NO")
    )
    print_result(semiprime_result, TARGET)
    print_result(all_result, TARGET)
    print("\nINTERPRETATION")
    print_rule()
    print("  The pairwise p-value is the probability requested: the fraction of all")
    print("  admissible (p, q) configurations meeting the cutoff under uniform pair")
    print("  sampling. The denominator hit rate answers a different question: after")
    print("  choosing q uniformly, whether at least one integer p meets the cutoff.")
    print("  Because this is an exhaustive post-hoc search, finding at least one match")
    print("  somewhere in the full scanned set is deterministic here, not a separate")
    print("  small p-value. Scientific significance requires a predeclared null model.")
    print_rule("═")


if __name__ == "__main__":
    main()
