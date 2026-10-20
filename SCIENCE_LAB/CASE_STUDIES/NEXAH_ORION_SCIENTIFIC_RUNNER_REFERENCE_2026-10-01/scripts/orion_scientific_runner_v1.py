#!/usr/bin/env python3
"""Deterministic ORION classification runner for finite reference protocols."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any


ALLOWED_EXPECTED = {
    "INVARIANT", "EQUIVARIANT", "ROBUST",
    "REPRESENTATION_DEPENDENT", "UNDEFINED", "FAILED",
}


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True,
                       separators=(",", ":")) + "\n").encode("utf-8")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def finite_number(value: Any, label: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{label} must be numeric")
    result = float(value)
    if not math.isfinite(result):
        raise ValueError(f"{label} must be finite")
    return result


def validate_protocol(protocol: dict[str, Any]) -> None:
    if protocol.get("schema_version") != "ORION_SCIENTIFIC_PROTOCOL_V1":
        raise ValueError("unsupported schema_version")
    if not isinstance(protocol.get("experiment_id"), str) or not protocol["experiment_id"]:
        raise ValueError("experiment_id is required")
    states = protocol.get("states")
    assertions = protocol.get("assertions")
    if not isinstance(states, list) or not states:
        raise ValueError("states must be a non-empty list")
    if not isinstance(assertions, list) or not assertions:
        raise ValueError("assertions must be a non-empty list")
    ids: set[str] = set()
    for index, state in enumerate(states):
        if set(state) != {"id", "x", "y"}:
            raise ValueError(f"state {index} has unsupported fields")
        if not isinstance(state["id"], str) or not state["id"] or state["id"] in ids:
            raise ValueError("state IDs must be unique non-empty strings")
        ids.add(state["id"])
        finite_number(state["x"], f"state {state['id']}.x")
        finite_number(state["y"], f"state {state['id']}.y")
    assertion_ids: set[str] = set()
    for assertion in assertions:
        aid = assertion.get("id")
        if not isinstance(aid, str) or not aid or aid in assertion_ids:
            raise ValueError("assertion IDs must be unique non-empty strings")
        assertion_ids.add(aid)
        if assertion.get("expected") not in ALLOWED_EXPECTED:
            raise ValueError(f"unsupported expected class in {aid}")


def xy(state: dict[str, Any]) -> tuple[float, float]:
    return float(state["x"]), float(state["y"])


def transform(state: dict[str, Any], spec: dict[str, Any]) -> dict[str, float | int]:
    x, y = xy(state)
    op = spec.get("op")
    if op == "identity":
        return {"x": x, "y": y}
    if op == "rotate":
        angle = finite_number(spec.get("angle"), "rotate.angle")
        c, s = math.cos(angle), math.sin(angle)
        return {"x": c * x - s * y, "y": s * x + c * y}
    if op == "anisotropic_scale":
        sx = finite_number(spec.get("sx"), "scale.sx")
        sy = finite_number(spec.get("sy"), "scale.sy")
        if sx == 0.0 or sy == 0.0:
            raise ValueError("scale factors must be nonzero")
        return {"x": sx * x, "y": sy * y}
    if op == "polar":
        return {"r": math.hypot(x, y), "theta": math.atan2(y, x)}
    if op == "shift":
        return {"x": x + finite_number(spec.get("dx"), "shift.dx"),
                "y": y + finite_number(spec.get("dy"), "shift.dy")}
    if op == "select_x":
        return {"x": x}
    if op == "phase_bin":
        bins = spec.get("bins")
        if isinstance(bins, bool) or not isinstance(bins, int) or bins < 2:
            raise ValueError("phase_bin.bins must be an integer >= 2")
        offset = finite_number(spec.get("offset", 0.0), "phase_bin.offset")
        phase = (math.atan2(y, x) / math.tau * bins - offset) % bins
        return {"bin": int(math.floor(phase))}
    raise ValueError(f"unsupported transform: {op}")


def observable(state: dict[str, Any], name: str) -> float:
    if name == "energy":
        x, y = float(state["x"]), float(state["y"])
        return x * x + y * y
    if name == "radius":
        if "r" in state:
            return float(state["r"])
        return math.hypot(float(state["x"]), float(state["y"]))
    if name == "sign_y":
        y = float(state["y"])
        return 0.0 if y == 0.0 else math.copysign(1.0, y)
    raise ValueError(f"unsupported observable: {name}")


def max_scalar_error(states: list[dict[str, Any]], spec: dict[str, Any], name: str) -> float:
    errors = []
    for state in states:
        before = observable(state, name)
        after = observable(transform(state, spec), name)
        errors.append(abs(after - before))
    return max(errors)


def classify(assertion: dict[str, Any], states: list[dict[str, Any]]) -> tuple[str, dict[str, Any]]:
    kind = assertion.get("kind")
    if kind == "scalar_invariance":
        error = max_scalar_error(states, assertion["transform"], assertion["observable"])
        tolerance = finite_number(assertion["tolerance"], "tolerance")
        actual = "INVARIANT" if error <= tolerance else "FAILED"
        return actual, {"max_absolute_error": error, "tolerance": tolerance}
    if kind == "decode_equivariance":
        spec = assertion["transform"]
        if spec.get("op") != "anisotropic_scale":
            raise ValueError("decode_equivariance currently requires anisotropic_scale")
        sx = finite_number(spec["sx"], "scale.sx")
        sy = finite_number(spec["sy"], "scale.sy")
        errors = []
        for state in states:
            encoded = transform(state, spec)
            decoded = {"x": float(encoded["x"]) / sx, "y": float(encoded["y"]) / sy}
            errors.append(math.hypot(decoded["x"] - float(state["x"]),
                                     decoded["y"] - float(state["y"])))
        error = max(errors)
        tolerance = finite_number(assertion["tolerance"], "tolerance")
        actual = "EQUIVARIANT" if error <= tolerance else "FAILED"
        return actual, {"max_roundtrip_error": error, "tolerance": tolerance}
    if kind == "bounded_robustness":
        error = max_scalar_error(states, assertion["transform"], assertion["observable"])
        epsilon = finite_number(assertion["epsilon"], "epsilon")
        actual = "ROBUST" if error <= epsilon else "FAILED"
        return actual, {"max_absolute_error": error, "epsilon": epsilon}
    if kind == "view_difference":
        different = sum(transform(s, assertion["view_a"]) != transform(s, assertion["view_b"])
                        for s in states)
        fraction = different / len(states)
        minimum = finite_number(assertion["minimum_fraction"], "minimum_fraction")
        actual = "REPRESENTATION_DEPENDENT" if fraction >= minimum else "FAILED"
        return actual, {"different_states": different, "fraction": fraction,
                        "minimum_fraction": minimum}
    if kind == "loss_collision":
        tolerance = finite_number(assertion["tolerance"], "tolerance")
        buckets: list[tuple[float, set[float]]] = []
        for state in states:
            projected = transform(state, assertion["transform"])
            key = float(projected["x"])
            target = observable(state, assertion["target_observable"])
            for prior_key, values in buckets:
                if abs(prior_key - key) <= tolerance:
                    values.add(target)
                    break
            else:
                buckets.append((key, {target}))
        ambiguous = sum(len(values) > 1 for _, values in buckets)
        actual = "UNDEFINED" if ambiguous > 0 else "FAILED"
        return actual, {"ambiguous_projection_buckets": ambiguous,
                        "projection_buckets": len(buckets)}
    raise ValueError(f"unsupported assertion kind: {kind}")


def run(protocol: dict[str, Any]) -> dict[str, Any]:
    validate_protocol(protocol)
    protocol_hash = sha256_bytes(canonical_bytes(protocol))
    observations = []
    for assertion in protocol["assertions"]:
        actual, evidence = classify(assertion, protocol["states"])
        observations.append({
            "id": assertion["id"],
            "kind": assertion["kind"],
            "expected": assertion["expected"],
            "actual": actual,
            "match": actual == assertion["expected"],
            "evidence": evidence,
        })
    matched = sum(item["match"] for item in observations)
    return {
        "schema_version": "ORION_SCIENTIFIC_RESULT_V1",
        "experiment_id": protocol["experiment_id"],
        "protocol_sha256": protocol_hash,
        "status": "PASS" if matched == len(observations) else "FAIL",
        "summary": {"assertions": len(observations), "matched": matched,
                    "mismatched": len(observations) - matched},
        "observations": observations,
        "claim_boundary": protocol.get("claim_boundary", {}),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--protocol", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    raw = args.protocol.read_bytes()
    protocol = json.loads(raw)
    result = run(protocol)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(canonical_bytes(result))
    print(result["status"])
    print(sha256_bytes(canonical_bytes(result)))
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
