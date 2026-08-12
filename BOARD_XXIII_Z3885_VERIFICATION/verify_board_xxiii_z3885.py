#!/usr/bin/env python3
"""Independent verifier for the Board XXIII Z_777 -> Z_3885 claim.

This program uses only the Python standard library.  It derives complete cycle
decompositions for multiplication maps on finite residue rings, verifies the
CRT commuting diagram at every state, checks analytic congruence counts, and
tests the claimed five-lift property orbit by orbit.

The historical expected counts are used only as explicit expectation tests;
they do not drive orbit construction or classification.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import platform
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Mapping, Sequence, Tuple


BASE_MODULUS = 777
BASE_MULTIPLIER = 524
SCALE_FACTOR = 5
SCALED_MODULUS = 3885
SCALED_MULTIPLIER = 1301

# Expectations are quarantined from all derivation logic.
EXPECTED_BASE_HISTOGRAM = {1: 1, 2: 10, 4: 189}
EXPECTED_SCALED_HISTOGRAM = {1: 5, 2: 50, 4: 945}

Cycle = Tuple[int, ...]


class VerificationError(RuntimeError):
    """Raised when a mathematical or partition invariant fails."""


@dataclass(frozen=True)
class OrbitDecomposition:
    """Complete deterministic cycle decomposition of a modular map."""

    modulus: int
    multiplier: int
    cycles: Tuple[Cycle, ...]

    @property
    def period_histogram(self) -> Dict[int, int]:
        return dict(sorted(Counter(map(len, self.cycles)).items()))

    @property
    def state_histogram(self) -> Dict[int, int]:
        return {period: period * count for period, count in self.period_histogram.items()}


def require(condition: bool, message: str) -> None:
    """Fail closed with a precise invariant message."""

    if not condition:
        raise VerificationError(message)


def modular_step(x: int, multiplier: int, modulus: int) -> int:
    """Return multiplier*x modulo modulus after validating the state."""

    if modulus <= 0:
        raise ValueError("modulus must be positive")
    if not 0 <= x < modulus:
        raise ValueError(f"state {x} is outside Z_{modulus}")
    return (multiplier * x) % modulus


def multiplicative_order(multiplier: int, modulus: int) -> int:
    """Derive the least positive k with multiplier**k == 1 (mod modulus)."""

    if modulus <= 1:
        raise ValueError("modulus must exceed one")
    if math.gcd(multiplier, modulus) != 1:
        raise ValueError("multiplicative order requires a unit modulo modulus")
    value = 1
    for exponent in range(1, modulus + 1):
        value = (value * multiplier) % modulus
        if value == 1:
            return exponent
    raise VerificationError("unit order was not found within the finite group bound")


def canonicalize_cycle(members: Sequence[int]) -> Cycle:
    """Rotate a nonempty cycle so that its unique minimum is first."""

    if not members:
        raise ValueError("cannot canonicalize an empty cycle")
    start = min(range(len(members)), key=members.__getitem__)
    rotated = tuple(members[start:]) + tuple(members[:start])
    require(rotated[0] == min(rotated), "cycle canonicalization failed")
    return rotated


def decompose_orbits(modulus: int, multiplier: int) -> OrbitDecomposition:
    """Enumerate every closed orbit, rejecting transients or duplicates."""

    require(math.gcd(multiplier, modulus) == 1, "map is not a permutation")
    globally_seen: set[int] = set()
    cycles: List[Cycle] = []

    for start in range(modulus):
        if start in globally_seen:
            continue
        walk: List[int] = []
        local_index: Dict[int, int] = {}
        current = start
        while current not in local_index and current not in globally_seen:
            local_index[current] = len(walk)
            walk.append(current)
            current = modular_step(current, multiplier, modulus)

        require(current in local_index, f"transient entered an earlier orbit at {current}")
        require(local_index[current] == 0, f"non-cycle prefix detected from state {start}")
        cycle = canonicalize_cycle(walk)
        require(len(set(cycle)) == len(cycle), "duplicate member inside cycle")
        globally_seen.update(cycle)
        cycles.append(cycle)

    cycles.sort(key=lambda cycle: (len(cycle), cycle))
    result = OrbitDecomposition(modulus, multiplier, tuple(cycles))
    verify_orbit_partition(result)
    return result


def verify_orbit_partition(decomposition: OrbitDecomposition) -> None:
    """Verify coverage, uniqueness, canonical form, and successor relations."""

    flattened = [x for cycle in decomposition.cycles for x in cycle]
    require(len(flattened) == decomposition.modulus, "state-count mismatch")
    require(len(set(flattened)) == decomposition.modulus, "state occurs in multiple cycles")
    require(set(flattened) == set(range(decomposition.modulus)), "orbit union is not Z_n")
    for cycle in decomposition.cycles:
        require(cycle == canonicalize_cycle(cycle), "noncanonical cycle retained")
        for index, state in enumerate(cycle):
            expected = cycle[(index + 1) % len(cycle)]
            actual = modular_step(state, decomposition.multiplier, decomposition.modulus)
            require(actual == expected, f"invalid successor {state}->{actual}, expected {expected}")


def classify_period(period: int) -> str:
    """Return neutral terminology plus the documented historical label."""

    labels = {
        1: "period-1 orbit / fixed point (Gold Sparkle / Gold Fixpoint)",
        2: "period-2 orbit (Janus Mirror / Gold Chord)",
        4: "period-4 orbit (Cyclic Field / Amber Lattice)",
    }
    return labels.get(period, f"period-{period} orbit")


def crt_pair(x: int) -> Tuple[int, int]:
    """Map x in Z_3885 to its (Z_777, Z_5) CRT coordinates."""

    if not 0 <= x < SCALED_MODULUS:
        raise ValueError(f"state {x} is outside Z_{SCALED_MODULUS}")
    return x % BASE_MODULUS, x % SCALE_FACTOR


def crt_reconstruct(base_residue: int, scale_residue: int) -> int:
    """Return the unique x modulo 3885 with the requested CRT coordinates."""

    if not 0 <= base_residue < BASE_MODULUS:
        raise ValueError("invalid Z_777 coordinate")
    if not 0 <= scale_residue < SCALE_FACTOR:
        raise ValueError("invalid Z_5 coordinate")
    # Since 777 == 2 (mod 5) and 2**(-1) == 3 (mod 5), choose x=b+777*t.
    t = ((scale_residue - base_residue) * 3) % SCALE_FACTOR
    result = (base_residue + BASE_MODULUS * t) % SCALED_MODULUS
    require(crt_pair(result) == (base_residue, scale_residue), "CRT reconstruction failed")
    return result


def verify_crt_conjugacy() -> Dict[str, object]:
    """Verify the CRT bijection and commuting relation at all 3885 states."""

    images = set()
    failures: List[Dict[str, object]] = []
    for x in range(SCALED_MODULUS):
        pair = crt_pair(x)
        images.add(pair)
        reconstructed = crt_reconstruct(*pair)
        if reconstructed != x:
            failures.append({"x": x, "kind": "round_trip", "got": reconstructed})
        left = crt_pair(modular_step(x, SCALED_MULTIPLIER, SCALED_MODULUS))
        right = (modular_step(pair[0], BASE_MULTIPLIER, BASE_MODULUS), pair[1])
        if left != right:
            failures.append({"x": x, "kind": "commuting_relation", "left": left, "right": right})
    return {
        "states_checked": SCALED_MODULUS,
        "distinct_crt_images": len(images),
        "expected_product_size": BASE_MODULUS * SCALE_FACTOR,
        "bijective": len(images) == SCALED_MODULUS and not any(
            item["kind"] == "round_trip" for item in failures
        ),
        "commuting_relation": len(failures) == 0,
        "failure_count": len(failures),
        "failures": failures,
    }


def congruence_solution_set(coefficient: int, modulus: int) -> Tuple[int, ...]:
    """Solve coefficient*x == 0 (mod modulus) analytically."""

    count = math.gcd(coefficient, modulus)
    step = modulus // count
    solutions = tuple(step * index for index in range(count))
    require(all((coefficient * x) % modulus == 0 for x in solutions), "bad congruence solution")
    return solutions


def fixed_points(multiplier: int, modulus: int) -> Tuple[int, ...]:
    return congruence_solution_set(multiplier - 1, modulus)


def points_fixed_by_power(multiplier: int, modulus: int, exponent: int) -> Tuple[int, ...]:
    if exponent < 1:
        raise ValueError("exponent must be positive")
    coefficient = pow(multiplier, exponent, modulus) - 1
    return congruence_solution_set(coefficient, modulus)


def canonical_projection(cycle: Cycle) -> Cycle:
    """Canonicalize a scaled cycle after projection to Z_777."""

    projected = tuple(x % BASE_MODULUS for x in cycle)
    require(len(set(projected)) == len(projected), "projection collapsed a scaled cycle")
    return canonicalize_cycle(projected)


def verify_scaling(
    base: OrbitDecomposition, scaled: OrbitDecomposition
) -> Dict[str, object]:
    """Verify five distinct, period-preserving CRT lifts of every base orbit."""

    scaled_lookup: Dict[Tuple[Cycle, int], List[Cycle]] = defaultdict(list)
    constant_coordinate_failures: List[Dict[str, object]] = []
    for cycle in scaled.cycles:
        residues = {x % SCALE_FACTOR for x in cycle}
        if len(residues) != 1:
            constant_coordinate_failures.append({"cycle": cycle, "residues": sorted(residues)})
            continue
        residue = next(iter(residues))
        scaled_lookup[(canonical_projection(cycle), residue)].append(cycle)

    failures: List[Dict[str, object]] = []
    accounted: set[Cycle] = set()
    lifts_verified = 0
    for base_cycle in base.cycles:
        residues_found: List[int] = []
        for residue in range(SCALE_FACTOR):
            candidates = scaled_lookup.get((base_cycle, residue), [])
            if len(candidates) != 1:
                failures.append({
                    "base_cycle": base_cycle,
                    "residue": residue,
                    "candidate_count": len(candidates),
                })
                continue
            lifted = candidates[0]
            residues_found.append(residue)
            accounted.add(lifted)
            if len(lifted) != len(base_cycle):
                failures.append({
                    "base_cycle": base_cycle,
                    "residue": residue,
                    "kind": "period_mismatch",
                    "base_period": len(base_cycle),
                    "scaled_period": len(lifted),
                })
            else:
                lifts_verified += 1
        if residues_found != list(range(SCALE_FACTOR)):
            failures.append({"base_cycle": base_cycle, "residues_found": residues_found})

    unaccounted = [cycle for cycle in scaled.cycles if cycle not in accounted]
    base_histogram = base.period_histogram
    scaled_histogram = scaled.period_histogram
    all_periods = sorted(set(base_histogram) | set(scaled_histogram))
    class_scaling = {
        str(period): scaled_histogram.get(period, 0) == SCALE_FACTOR * base_histogram.get(period, 0)
        for period in all_periods
    }
    aggregate = (
        len(scaled.cycles) == SCALE_FACTOR * len(base.cycles)
        and all(class_scaling.values())
    )
    orbitwise = (
        not failures
        and not constant_coordinate_failures
        and not unaccounted
        and lifts_verified == SCALE_FACTOR * len(base.cycles)
    )
    return {
        "aggregate_count_scaling": aggregate,
        "orbitwise_crt_fiber_scaling": orbitwise,
        "base_orbits_tested": len(base.cycles),
        "expected_lifts": SCALE_FACTOR * len(base.cycles),
        "verified_lifts": lifts_verified,
        "failure_count": len(failures) + len(constant_coordinate_failures),
        "failures": failures,
        "constant_coordinate_failures": constant_coordinate_failures,
        "unaccounted_scaled_orbit_count": len(unaccounted),
        "unaccounted_scaled_orbits": unaccounted,
        "exact_class_scaling": class_scaling,
    }


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def parse_source(value: str) -> Tuple[str, Path]:
    if "=" not in value:
        raise argparse.ArgumentTypeError("source must have LABEL=PATH form")
    label, raw_path = value.split("=", 1)
    path = Path(raw_path).expanduser().resolve()
    if not label or not path.is_file():
        raise argparse.ArgumentTypeError(f"invalid source: {value}")
    return label, path


def system_facts(decomposition: OrbitDecomposition) -> Dict[str, object]:
    modulus = decomposition.modulus
    multiplier = decomposition.multiplier
    order = multiplicative_order(multiplier, modulus)
    fixed = fixed_points(multiplier, modulus)
    t2_fixed = points_fixed_by_power(multiplier, modulus, 2)
    exact_period_2_points = tuple(sorted(set(t2_fixed) - set(fixed)))
    enumerated_fixed = tuple(cycle[0] for cycle in decomposition.cycles if len(cycle) == 1)
    enumerated_period_2 = tuple(sorted(x for cycle in decomposition.cycles if len(cycle) == 2 for x in cycle))
    remaining = modulus - len(t2_fixed)
    period_4_points = decomposition.state_histogram.get(4, 0)
    analytic_checks = {
        "fixed_point_equation_count": len(fixed),
        "fixed_point_enumeration_count": len(enumerated_fixed),
        "fixed_point_sets_equal": fixed == enumerated_fixed,
        "t_squared_fixed_point_count": len(t2_fixed),
        "exact_period_2_point_count": len(exact_period_2_points),
        "enumerated_period_2_point_count": len(enumerated_period_2),
        "period_2_point_sets_equal": exact_period_2_points == enumerated_period_2,
        "residual_after_t_squared_fixed_points": remaining,
        "enumerated_period_4_point_count": period_4_points,
        "all_residual_points_have_exact_period_4": order == 4 and remaining == period_4_points,
    }
    return {
        "modulus": modulus,
        "multiplier": multiplier,
        "gcd": math.gcd(multiplier, modulus),
        "is_permutation": math.gcd(multiplier, modulus) == 1,
        "multiplicative_order": order,
        "admissible_periods_derived_from_order": sorted(
            divisor for divisor in range(1, order + 1) if order % divisor == 0
        ),
        "observed_periods": sorted(decomposition.period_histogram),
        "state_count": modulus,
        "orbit_count": len(decomposition.cycles),
        "period_histogram": {str(k): v for k, v in decomposition.period_histogram.items()},
        "state_histogram": {str(k): v for k, v in decomposition.state_histogram.items()},
        "fixed_points": list(fixed),
        "t_squared_fixed_points": list(t2_fixed),
        "analytic_checks": analytic_checks,
        "representative_cycles": {
            "period_1_all": [list(cycle) for cycle in decomposition.cycles if len(cycle) == 1],
            "period_2_first_5": [list(cycle) for cycle in decomposition.cycles if len(cycle) == 2][:5],
            "period_4_first_3": [list(cycle) for cycle in decomposition.cycles if len(cycle) == 4][:3],
        },
    }


def write_summary_csv(path: Path, base: OrbitDecomposition, scaled: OrbitDecomposition) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(["system", "period", "orbit_count", "state_count", "classification"])
        for name, decomposition in (("base", base), ("scaled", scaled)):
            for period, count in decomposition.period_histogram.items():
                writer.writerow([name, period, count, period * count, classify_period(period)])


def run_verification(
    sources: Sequence[Tuple[str, Path]],
) -> Tuple[Dict[str, object], OrbitDecomposition, OrbitDecomposition]:
    require(SCALED_MODULUS == SCALE_FACTOR * BASE_MODULUS, "factorization mismatch")
    require(math.gcd(BASE_MODULUS, SCALE_FACTOR) == 1, "CRT factors are not coprime")
    base_residue = SCALED_MULTIPLIER % BASE_MODULUS
    scale_residue = SCALED_MULTIPLIER % SCALE_FACTOR
    base = decompose_orbits(BASE_MODULUS, BASE_MULTIPLIER)
    scaled = decompose_orbits(SCALED_MODULUS, SCALED_MULTIPLIER)
    crt = verify_crt_conjugacy()
    scaling = verify_scaling(base, scaled)
    base_facts = system_facts(base)
    scaled_facts = system_facts(scaled)

    expectations = {
        "base_histogram_matches": base.period_histogram == EXPECTED_BASE_HISTOGRAM,
        "scaled_histogram_matches": scaled.period_histogram == EXPECTED_SCALED_HISTOGRAM,
        "base_total_orbits_matches_200": len(base.cycles) == 200,
        "scaled_total_orbits_matches_1000": len(scaled.cycles) == 1000,
    }
    invariants = {
        "factorization_3885_equals_5_times_777": SCALED_MODULUS == SCALE_FACTOR * BASE_MODULUS,
        "crt_factor_coprimality": math.gcd(BASE_MODULUS, SCALE_FACTOR) == 1,
        "operator_residue_mod_777": base_residue == BASE_MULTIPLIER,
        "operator_residue_mod_5_identity": scale_residue == 1,
        "base_is_permutation": base_facts["is_permutation"],
        "scaled_is_permutation": scaled_facts["is_permutation"],
        "base_partition_complete": sum(map(len, base.cycles)) == BASE_MODULUS,
        "scaled_partition_complete": sum(map(len, scaled.cycles)) == SCALED_MODULUS,
        "crt_bijection_all_states": crt["bijective"],
        "crt_conjugacy_all_states": crt["commuting_relation"],
        "aggregate_count_scaling": scaling["aggregate_count_scaling"],
        "orbitwise_crt_fiber_scaling": scaling["orbitwise_crt_fiber_scaling"],
        "base_analytic_checks": all(base_facts["analytic_checks"].values()),
        "scaled_analytic_checks": all(scaled_facts["analytic_checks"].values()),
        "historical_expectations_reproduced": all(expectations.values()),
    }
    verdict = (
        "PASS — EXACT_5X_CRT_ORBIT_SCALING_PROVEN"
        if all(invariants.values())
        else "FAIL — EXPECTED_BOARD_XXIII_STRUCTURE_NOT_REPRODUCED"
    )
    script_path = Path(__file__).resolve()
    return {
        "schema_version": "1.0.0",
        "scope": "finite modular dynamical systems only",
        "verdict": verdict,
        "definitions": {
            "base": {"modulus": BASE_MODULUS, "multiplier": BASE_MULTIPLIER},
            "scaled": {"modulus": SCALED_MODULUS, "multiplier": SCALED_MULTIPLIER},
            "scale_factor": SCALE_FACTOR,
        },
        "factorization_and_residues": {
            "scaled_equals_factor_times_base": SCALED_MODULUS == SCALE_FACTOR * BASE_MODULUS,
            "gcd_base_factor": math.gcd(BASE_MODULUS, SCALE_FACTOR),
            "scaled_multiplier_mod_base": base_residue,
            "scaled_multiplier_mod_factor": scale_residue,
        },
        "base_system": base_facts,
        "scaled_system": scaled_facts,
        "crt": crt,
        "scaling": scaling,
        "expectation_tests": expectations,
        "invariants": invariants,
        "source_hashes": {label: sha256_file(path) for label, path in sorted(sources)},
        "reproducibility": {
            "python_version": platform.python_version(),
            "python_implementation": platform.python_implementation(),
            "script_sha256": sha256_file(script_path),
            "deterministic_output": True,
        },
        "firewall": {
            "physical_truth_established": False,
            "power_grid_scaling_established": False,
            "ieee_9_to_ieee_14_claim_established": False,
            "finite_algebra_to_physics_bridge_status": "UNTESTED / UNDEFINED",
        },
    }, base, scaled


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parent,
        help="directory for verification_results.json and orbit_summary.csv",
    )
    parser.add_argument(
        "--source",
        action="append",
        default=[],
        type=parse_source,
        metavar="LABEL=PATH",
        help="controlling/evidence source to hash; repeatable",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str] = ()) -> int:
    args = parse_args(argv or sys.argv[1:])
    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    try:
        results, base, scaled = run_verification(args.source)
    except (VerificationError, ValueError) as error:
        print(f"VERIFICATION FAILED: {error}", file=sys.stderr)
        return 1

    json_path = output_dir / "verification_results.json"
    csv_path = output_dir / "orbit_summary.csv"
    json_text = json.dumps(results, indent=2, sort_keys=True, ensure_ascii=False) + "\n"
    json_path.write_text(json_text, encoding="utf-8")
    write_summary_csv(csv_path, base, scaled)

    print(results["verdict"])
    print(f"base histogram:   {base.period_histogram}")
    print(f"scaled histogram: {scaled.period_histogram}")
    print(f"CRT states checked: {results['crt']['states_checked']}")
    print(f"orbitwise lifts: {results['scaling']['verified_lifts']}")
    print(f"results: {json_path}")
    return 0 if results["verdict"].startswith("PASS") else 1


if __name__ == "__main__":
    raise SystemExit(main())
