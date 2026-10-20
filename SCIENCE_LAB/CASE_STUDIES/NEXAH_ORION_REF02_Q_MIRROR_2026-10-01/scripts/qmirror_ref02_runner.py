#!/usr/bin/env python3
"""Exact rational Q-Mirror reference evaluator; no zeta or physical model."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from fractions import Fraction
from pathlib import Path
from typing import Any

C = tuple[Fraction, Fraction]
CLASSES = {"INVARIANT", "EQUIVARIANT", "ROBUST", "REPRESENTATION_DEPENDENT", "UNDEFINED", "FAILED"}


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, sort_keys=True, separators=(",", ":")) + "\n").encode()


def digest(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def f(value: str) -> Fraction:
    return Fraction(value)


def add(a: C, b: C) -> C:
    return a[0] + b[0], a[1] + b[1]


def mul(a: C, b: C) -> C:
    return a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]


def reciprocal(z: C) -> C:
    denominator = z[0] * z[0] + z[1] * z[1]
    if denominator == 0:
        raise ZeroDivisionError("Q is undefined at zero")
    return z[0] / denominator, -z[1] / denominator


def quadratic(z: C, c: C) -> C:
    return add(mul(z, z), c)


def inverse_quadratic(w: C, c: C) -> C:
    w2 = mul(w, w)
    return mul(w2, reciprocal(add((Fraction(1), Fraction(0)), mul(c, w2))))


def text(z: C) -> list[str]:
    return [str(z[0]), str(z[1])]


def distance(a: C, b: C) -> float:
    return math.hypot(float(a[0] - b[0]), float(a[1] - b[1]))


def validate(config: dict[str, Any]) -> None:
    if config.get("schema_version") != "ORION_QMIRROR_REF02_V1":
        raise ValueError("unsupported schema")
    if set(config.get("expected", {}).values()) - CLASSES:
        raise ValueError("unsupported expected class")
    if set(config.get("expected", {})) != {f"Q{i:02d}" for i in range(1, 9)}:
        raise ValueError("expected classifications must contain Q01..Q08")


def run(config: dict[str, Any]) -> dict[str, Any]:
    validate(config)
    expected = config["expected"]
    observations: list[dict[str, Any]] = []

    general = [(f(x["re"]), f(x["im"])) for x in config["general_samples"]]
    roundtrips = [(z, reciprocal(reciprocal(z))) for z in general]
    observations.append(item("Q01", expected, "EQUIVARIANT",
                             {"exact_roundtrips": sum(a == b for a, b in roundtrips), "cases": len(roundtrips)}))

    half = f(config["vertical_line_real"])
    line = [(half, f(t)) for t in config["vertical_line_imaginary_samples"]]
    residuals = []
    for z in line:
        u, v = reciprocal(z)
        residuals.append((u - 1) ** 2 + v ** 2 - 1)
    observations.append(item("Q02", expected, "INVARIANT" if all(r == 0 for r in residuals) else "FAILED",
                             {"exact_zero_residuals": sum(r == 0 for r in residuals), "cases": len(residuals)}))

    c = (f(config["quadratic_c"]["re"]), f(config["quadratic_c"]["im"]))
    commuting = []
    for z in general:
        left = reciprocal(quadratic(z, c))
        right = inverse_quadratic(reciprocal(z), c)
        commuting.append(left == right)
    observations.append(item("Q03", expected, "EQUIVARIANT" if all(commuting) else "FAILED",
                             {"exact_commuting_cases": sum(commuting), "cases": len(commuting)}))

    identical = [z == reciprocal(z) for z in general]
    observations.append(item("Q04", expected, "INVARIANT" if all(identical) else "FAILED",
                             {"pointwise_identical": sum(identical), "cases": len(identical)}))

    try:
        reciprocal((Fraction(0), Fraction(0)))
        pole_class = "FAILED"
    except ZeroDivisionError:
        pole_class = "UNDEFINED"
    observations.append(item("Q05", expected, pole_class, {"input": ["0", "0"]}))

    near = config["near_pole"]
    z1, z2 = (f(near["z1_re"]), Fraction(0)), (f(near["z2_re"]), Fraction(0))
    separation = distance(reciprocal(z1), reciprocal(z2))
    minimum = float(near["minimum_output_separation"])
    observations.append(item("Q06", expected, "FAILED" if separation >= minimum else "ROBUST",
                             {"output_separation": separation, "failure_threshold": minimum}))

    different = sum(z != reciprocal(z) for z in general)
    observations.append(item("Q07", expected, "REPRESENTATION_DEPENDENT" if different else "FAILED",
                             {"different_raw_coordinate_cases": different, "cases": len(general)}))

    away = config["away_from_pole"]
    base = (f(away["base_re"]), f(away["base_im"]))
    moved = (base[0] + f(away["delta_re"]), base[1])
    change = distance(reciprocal(base), reciprocal(moved))
    maximum = float(away["maximum_output_change"])
    observations.append(item("Q08", expected, "ROBUST" if change <= maximum else "FAILED",
                             {"output_change": change, "maximum": maximum}))

    matched = sum(x["match"] for x in observations)
    return {
        "schema_version": "ORION_QMIRROR_RESULT_V1",
        "experiment_id": config["experiment_id"],
        "protocol_sha256": digest(config),
        "status": "PASS" if matched == 8 else "FAIL",
        "summary": {"assertions": 8, "matched": matched, "mismatched": 8 - matched},
        "observations": observations,
        "claim_boundary": config["claim_boundary"],
    }


def item(identifier: str, expected: dict[str, str], actual: str, evidence: dict[str, Any]) -> dict[str, Any]:
    return {"id": identifier, "expected": expected[identifier], "actual": actual,
            "match": expected[identifier] == actual, "evidence": evidence}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--protocol", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    config = json.loads(args.protocol.read_text())
    result = run(config)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    payload = canonical_bytes(result)
    args.output.write_bytes(payload)
    print(result["status"])
    print(hashlib.sha256(payload).hexdigest())
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
