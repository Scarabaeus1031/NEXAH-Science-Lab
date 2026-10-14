#!/usr/bin/env python3
"""A0-BL-052 frozen Pascal–Quaternion four-channel Return audit."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
from fractions import Fraction
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROTOCOL_PATH = HERE / "FROZEN_PROTOCOL.json"
PROTOCOL = json.loads(PROTOCOL_PATH.read_text())


def canonical(value: object) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def carrier(depth: int) -> tuple[tuple[int, int, int], ...]:
    return tuple(
        (a, b, n - a - b)
        for n in range(depth + 1)
        for a in range(n + 1)
        for b in range(n - a + 1)
    )


def weight(point: tuple[int, int, int]) -> int:
    a, b, c = point
    n = a + b + c
    return math.factorial(n) // (math.factorial(a) * math.factorial(b) * math.factorial(c))


def phi(point: tuple[int, int, int]) -> tuple[Fraction, Fraction, Fraction, Fraction]:
    a, b, c = point
    return (Fraction(a + b + c), Fraction(a), Fraction(b), Fraction(c))


def qmul(
    left: tuple[Fraction, Fraction, Fraction, Fraction],
    right: tuple[Fraction, Fraction, Fraction, Fraction],
) -> tuple[Fraction, Fraction, Fraction, Fraction]:
    a, b, c, d = left
    e, f, g, h = right
    return (
        a * e - b * f - c * g - d * h,
        a * f + b * e + c * h - d * g,
        a * g - b * h + c * e + d * f,
        a * h + b * g - c * f + d * e,
    )


def qconj(q: tuple[Fraction, Fraction, Fraction, Fraction]) -> tuple[Fraction, Fraction, Fraction, Fraction]:
    return (q[0], -q[1], -q[2], -q[3])


def qnorm2(q: tuple[Fraction, Fraction, Fraction, Fraction]) -> Fraction:
    return sum((value * value for value in q), Fraction(0))


def qinv(q: tuple[Fraction, Fraction, Fraction, Fraction]) -> tuple[Fraction, Fraction, Fraction, Fraction]:
    norm = qnorm2(q)
    return tuple(value / norm for value in qconj(q))


def conjugate(q: tuple[Fraction, Fraction, Fraction, Fraction], value: tuple[Fraction, Fraction, Fraction, Fraction]) -> tuple[Fraction, Fraction, Fraction, Fraction]:
    return qmul(qmul(q, value), qinv(q))


U = (Fraction(1, 2), Fraction(1, 2), Fraction(1, 2), Fraction(1, 2))


def recurrence_edges(points: set[tuple[int, int, int]], depth: int) -> set[tuple[tuple[int, int, int], tuple[int, int, int]]]:
    steps = ((1, 0, 0), (0, 1, 0), (0, 0, 1))
    return {
        (point, tuple(point[index] + step[index] for index in range(3)))
        for point in points
        if sum(point) < depth
        for step in steps
    }


def generic_rotation_is_automorphism(depth: int) -> bool:
    axis = tuple(float(value) for value in PROTOCOL["generic_control"]["axis"])
    degrees = float(PROTOCOL["generic_control"]["degrees"])
    tolerance = float(PROTOCOL["generic_control"]["integer_tolerance"])
    norm = math.sqrt(sum(value * value for value in axis))
    half = math.radians(degrees) / 2
    q = (math.cos(half), *(value * math.sin(half) / norm for value in axis))
    w, x, y, z = q
    points = set(carrier(depth))
    center = depth / 4
    for point in points:
        vx, vy, vz = (value - center for value in point)
        tx = 2 * (y * vz - z * vy)
        ty = 2 * (z * vx - x * vz)
        tz = 2 * (x * vy - y * vx)
        mapped = (
            vx + w * tx + y * tz - z * ty + center,
            vy + w * ty + z * tx - x * tz + center,
            vz + w * tz + x * ty - y * tx + center,
        )
        rounded = tuple(round(value) for value in mapped)
        if any(abs(value - integer) > tolerance for value, integer in zip(mapped, rounded)):
            return False
        if rounded not in points or weight(point) != weight(rounded):
            return False
    return True


def nth_prime(index: int) -> int:
    found = 0
    candidate = 1
    while found < index:
        candidate += 1
        if all(candidate % divisor for divisor in range(2, math.isqrt(candidate) + 1)):
            found += 1
    return candidate


def schema_accepts(state: dict[str, object]) -> bool:
    return set(state) == set(PROTOCOL["quaternion_slots"])


def run() -> dict[str, object]:
    max_depth = int(PROTOCOL["max_depth"])
    depth_records = []
    all_points = carrier(max_depth)

    for depth in range(max_depth + 1):
        points = carrier(depth)
        images = tuple(phi(point) for point in points)
        depth_records.append({
            "depth": depth,
            "node_count": len(points),
            "phi_collision_count": len(points) - len(set(images)),
            "scalar_depth_exact": all(phi(point)[0] == sum(point) for point in points),
            "c3_equivariant": all(conjugate(U, phi(point)) == phi((point[2], point[0], point[1])) for point in points),
            "c3_order_three": all(conjugate(U, conjugate(U, conjugate(U, phi(point)))) == phi(point) for point in points),
            "inverse_return_exact": all(conjugate(qinv(U), conjugate(U, phi(point))) == phi(point) for point in points),
            "generic_rotation_is_lattice_automorphism": generic_rotation_is_automorphism(depth) if depth else None,
        })

    points_set = set(all_points)
    reflected_points = {(b, a, c) for a, b, c in points_set}
    edges = recurrence_edges(points_set, max_depth)
    reflected_edges = {((a[1], a[0], a[2]), (b[1], b[0], b[2])) for a, b in edges}
    q432_samples = [Fraction(value) for value in PROTOCOL["q432_samples"]]
    q432_return = all(Fraction(432, 1) / (Fraction(432, 1) / value) == value for value in q432_samples)

    valid_state = {"scalar": 6, "i": 1, "j": 2, "k": 3}
    invalid_state = {**valid_state, "q_degree": "controller"}
    controller = {"q_degree": "view selector", "quaternion_state": valid_state}
    basis_pairs = {(left, right) for left in PROTOCOL["quaternion_slots"] for right in PROTOCOL["quaternion_slots"]}
    role_pairs = {(left, right) for left in PROTOCOL["controller_roles"] for right in PROTOCOL["controller_roles"]}

    prime_values = {str(index): nth_prime(index) for index in (15, 16, 17, 24, 25, 26)}
    expected_primes = {str(key): value for key, value in PROTOCOL["prime_readouts"].items()}

    tests = {
        "T1_PHI_INJECTIVE": {
            "pass": all(record["phi_collision_count"] == 0 for record in depth_records),
            "max_depth_node_count": len(all_points),
            "collision_count": depth_records[-1]["phi_collision_count"],
        },
        "T2_SCALAR_DEPTH": {
            "pass": all(record["scalar_depth_exact"] for record in depth_records),
            "identity": "scalar(Phi(a,b,c))=a+b+c",
        },
        "T3_C3_EQUIVARIANCE": {
            "pass": qnorm2(U) == 1 and all(record["c3_equivariant"] and record["c3_order_three"] for record in depth_records),
            "unit_quaternion": ["1/2", "1/2", "1/2", "1/2"],
            "coordinate_action": "(a,b,c)->(c,a,b)",
        },
        "T4_S3_REFLECTION_BOUNDARY": {
            "pass": reflected_points == points_set and reflected_edges == edges and all(weight(point) == weight((point[1], point[0], point[2])) for point in points_set),
            "determinant": -1,
            "quaternion_inner_rotation": False,
        },
        "T5_GENERIC_VIEW_CONTROL": {
            "pass": all(record["generic_rotation_is_lattice_automorphism"] is False for record in depth_records[1:]),
            "axis": PROTOCOL["generic_control"]["axis"],
            "degrees": PROTOCOL["generic_control"]["degrees"],
            "classification": "VIEW_ONLY_NOT_DISCRETE_AUTOMORPHISM",
        },
        "T6_QUATERNION_RETURN": {
            "pass": all(record["inverse_return_exact"] for record in depth_records),
            "return": "Ad(u^-1) o Ad(u) = id",
        },
        "T7_Q432_RETURN": {
            "pass": q432_return,
            "sample_count": len(q432_samples),
            "return": "Q_432(Q_432(x))=x for x!=0",
            "operator_identity_with_quaternion_return": False,
        },
        "T8_Q_DEGREE_SEPARATION": {
            "pass": schema_accepts(valid_state) and not schema_accepts(invalid_state) and set(controller) == {"q_degree", "quaternion_state"},
            "quaternion_slots": PROTOCOL["quaternion_slots"],
            "separate_controller_role": "q_degree",
        },
        "T9_16_VS_25_TYPED": {
            "pass": len(basis_pairs) == 16 and len(role_pairs) == 25 and basis_pairs != role_pairs,
            "quaternion_product_addresses": len(basis_pairs),
            "controller_relation_addresses": len(role_pairs),
            "algebra_identity": False,
        },
        "T10_PRIME_READOUT_BOUNDARY": {
            "pass": {key: prime_values[key] for key in expected_primes} == expected_primes and prime_values == {"15": 47, "16": 53, "17": 59, "24": 89, "25": 97, "26": 101},
            "values": prime_values,
            "classification": "READOUT_ONLY_NOT_OPERATOR_SELECTION",
        },
    }

    all_pass = list(tests) == PROTOCOL["test_ids"] and all(item["pass"] for item in tests.values())
    classification = "EXACT_FOUR_CHANNEL_CONNECTOR_PASS" if all_pass else "PARTIAL_PASS"
    return {
        "schema": "nexah.a0-bl-052.result/1.0.0",
        "date": "2026-10-11",
        "status": "PASS" if all_pass else "FAIL",
        "classification": classification,
        "protocol_sha256": sha256(PROTOCOL_PATH),
        "depths_tested": [0, max_depth],
        "tests": tests,
        "depth_records": depth_records,
        "finding_candidate": {
            "finding_id": "F-A0-12",
            "statement": "The explicit Phi embedding is injective and C3-equivariant on P_0..P_11, with exact inverse Return and typed separation from reflections, generic views, Q-degree control, Q_432 and 4^2/5^2 readouts.",
            "state": "FORMAL_EXACT_RESULT_AWAITING_OWNER_DISPOSITION",
        },
        "claim_ceiling": "Exact finite representation connector only; no quaternion generation of Pascal coefficients, fifth quaternion component, historical intent, physical mechanism, prime selector or identity of the two Return operators is established.",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    result = run()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(canonical(result) + "\n")
    print(json.dumps({"status": result["status"], "classification": result["classification"], "output": str(args.output)}, indent=2))
    raise SystemExit(0 if result["status"] == "PASS" else 1)
