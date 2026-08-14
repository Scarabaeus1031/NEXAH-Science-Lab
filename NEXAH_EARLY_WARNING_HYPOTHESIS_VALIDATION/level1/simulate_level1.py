#!/usr/bin/env python3
"""Raw-state-only simulator for the frozen Level-1 synthetic protocol.

This module intentionally contains no indicator, alarm, event, plotting, or
scientific-outcome logic.  Its only outputs are the commanded forcing and the
states produced by the registered numerical integration.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
from typing import Any

import numpy as np


SERIALIZATION_ID = "canonical-json-utf8-v1"


class ProtocolError(RuntimeError):
    """Raised when an input does not match the frozen protocol."""


class RawOutputCollision(RuntimeError):
    """Raised when an existing run ID has non-identical bytes."""


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def canonical_bytes(value: Any) -> bytes:
    """Return deterministic UTF-8 JSON with no NaN/Infinity extensions."""
    text = json.dumps(
        value,
        allow_nan=False,
        ensure_ascii=False,
        separators=(",", ":"),
        sort_keys=True,
    )
    return (text + "\n").encode("utf-8")


def load_context(manifest_path: Path) -> tuple[dict[str, Any], str, str]:
    manifest_bytes = manifest_path.read_bytes()
    manifest = json.loads(manifest_bytes)
    manifest_hash = sha256_bytes(manifest_bytes)
    source_hash = sha256_file(Path(__file__).resolve())
    expected = manifest["provenance"]["simulator_source_sha256"]
    if source_hash != expected:
        raise ProtocolError(
            f"SIMULATOR_SOURCE_HASH_MISMATCH expected={expected} actual={source_hash}"
        )
    return manifest, manifest_hash, source_hash


def electrical_power(delta: np.ndarray, coupling: np.ndarray) -> np.ndarray:
    difference = delta[:, None] - delta[None, :]
    return np.sum(coupling * np.sin(difference), axis=1)


def equilibrium_residual(
    delta: np.ndarray, power: np.ndarray, coupling: np.ndarray
) -> np.ndarray:
    return power - electrical_power(delta, coupling)


def solve_equilibrium(
    power: np.ndarray,
    coupling: np.ndarray,
    tolerance: float,
    max_iterations: int,
) -> tuple[np.ndarray, dict[str, Any]]:
    """Newton solve of n-1 balance equations plus sum(delta)=0 gauge."""
    n = len(power)
    delta = np.zeros(n, dtype=np.float64)
    iterations = 0
    converged = False

    for iterations in range(max_iterations + 1):
        physical = equilibrium_residual(delta, power, coupling)
        augmented = np.concatenate((physical[: n - 1], [float(np.sum(delta))]))
        if max(float(np.max(np.abs(physical))), abs(float(np.sum(delta)))) <= tolerance:
            converged = True
            break
        if iterations == max_iterations:
            break

        jacobian = np.zeros((n, n), dtype=np.float64)
        for i in range(n - 1):
            for k in range(n):
                if k == i:
                    jacobian[i, k] = -sum(
                        coupling[i, j] * math.cos(delta[i] - delta[j])
                        for j in range(n)
                        if j != i
                    )
                elif coupling[i, k] != 0.0:
                    jacobian[i, k] = coupling[i, k] * math.cos(delta[i] - delta[k])
        jacobian[n - 1, :] = 1.0
        try:
            correction = np.linalg.solve(jacobian, -augmented)
        except np.linalg.LinAlgError as exc:
            raise ProtocolError("INVALID_INITIALIZATION: singular Newton Jacobian") from exc
        delta += correction

    physical = equilibrium_residual(delta, power, coupling)
    details = {
        "converged": converged,
        "iterations": iterations,
        "max_abs_physical_residual": float(np.max(np.abs(physical))),
        "physical_residual": physical.tolist(),
        "gauge_residual": float(np.sum(delta)),
        "tolerance": tolerance,
    }
    if not converged:
        raise ProtocolError(f"INVALID_INITIALIZATION: {details}")
    return delta, details


def stress_level(time_value: float, onset: float, rate: float, cap: float) -> float:
    if time_value <= onset:
        return 0.0
    return min(cap, rate * (time_value - onset))


def drift(
    time_value: float,
    state: np.ndarray,
    *,
    inertia: np.ndarray,
    damping: np.ndarray,
    coupling: np.ndarray,
    base_power: np.ndarray,
    direction: np.ndarray,
    onset: float,
    rate: float,
    cap: float,
) -> np.ndarray:
    n = len(inertia)
    delta = state[:n]
    omega = state[n:]
    lam = stress_level(time_value, onset, rate, cap)
    power = base_power + lam * direction
    acceleration = (power - electrical_power(delta, coupling) - damping * omega) / inertia
    return np.concatenate((omega, acceleration))


def rk4_step(time_value: float, state: np.ndarray, dt: float, **kwargs: Any) -> np.ndarray:
    k1 = drift(time_value, state, **kwargs)
    k2 = drift(time_value + 0.5 * dt, state + 0.5 * dt * k1, **kwargs)
    k3 = drift(time_value + 0.5 * dt, state + 0.5 * dt * k2, **kwargs)
    k4 = drift(time_value + dt, state + dt * k3, **kwargs)
    return state + (dt / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4)


def resolve_path(manifest: dict[str, Any], partition: str, path_id: str) -> dict[str, Any]:
    paths = manifest["partitions"][partition]["stress_paths"]
    matches = [path for path in paths if path["path_id"] == path_id]
    if len(matches) != 1:
        raise ProtocolError(f"Unknown or duplicate path {partition}/{path_id}")
    return matches[0]


def validate_run_request(
    manifest: dict[str, Any], partition: str, mode: str, seed: int | None, dt: float
) -> None:
    if partition not in ("development", "evaluation"):
        raise ProtocolError("Partition must be development or evaluation")
    allowed_dt = {
        float(manifest["numerics"]["primary_dt"]),
        float(manifest["numerics"]["convergence_check_dt"]),
    }
    if dt not in allowed_dt:
        raise ProtocolError(f"dt={dt} is not registered")
    if mode not in ("deterministic", "stochastic"):
        raise ProtocolError("Mode must be deterministic or stochastic")
    if mode == "deterministic" and seed is not None:
        raise ProtocolError("Deterministic runs must use seed=null")
    if mode == "stochastic":
        if seed is None:
            raise ProtocolError("Stochastic runs require an explicit seed")
        if seed not in manifest["partitions"][partition]["stochastic_seeds"]:
            raise ProtocolError(f"Seed {seed} is not registered for {partition}")


def integrate_raw(
    manifest: dict[str, Any],
    *,
    partition: str,
    path_id: str,
    mode: str,
    seed: int | None,
    dt: float,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Integrate and return raw arrays plus initialization metadata."""
    validate_run_request(manifest, partition, mode, seed, dt)
    path = resolve_path(manifest, partition, path_id)
    model = manifest["model"]
    numerics = manifest["numerics"]
    stochastic = manifest["stochastic_model"]

    inertia = np.asarray(model["inertia"], dtype=np.float64)
    damping = np.asarray(model["damping"], dtype=np.float64)
    coupling = np.asarray(model["coupling_matrix"], dtype=np.float64)
    base_power = np.asarray(model["base_power"], dtype=np.float64)
    direction = np.asarray(manifest["stress"]["direction"], dtype=np.float64)
    n = len(inertia)

    delta0, equilibrium = solve_equilibrium(
        base_power,
        coupling,
        float(numerics["equilibrium_residual_tolerance"]),
        int(numerics["equilibrium_max_iterations"]),
    )
    state = np.concatenate((delta0, np.zeros(n, dtype=np.float64)))
    horizon = float(numerics["horizon"])
    steps_float = horizon / dt
    steps = int(round(steps_float))
    if not math.isclose(steps * dt, horizon, rel_tol=0.0, abs_tol=1e-14):
        raise ProtocolError("Horizon is not an integral multiple of dt")

    rng = None
    if mode == "stochastic":
        rng = np.random.Generator(np.random.PCG64(seed))

    raw = {
        "time": [],
        "stress_level": [],
        "power": [],
        "delta": [],
        "omega": [],
        "mechanical_power_diffusion_impulse": [],
    }

    drift_kwargs = {
        "inertia": inertia,
        "damping": damping,
        "coupling": coupling,
        "base_power": base_power,
        "direction": direction,
        "onset": float(manifest["stress"]["onset"]),
        "rate": float(path["ramp_rate"]),
        "cap": float(path["cap"]),
    }

    for step in range(steps + 1):
        t = step * dt
        lam = stress_level(t, drift_kwargs["onset"], drift_kwargs["rate"], drift_kwargs["cap"])
        power = base_power + lam * direction
        impulse = np.zeros(n, dtype=np.float64)

        raw["time"].append(t)
        raw["stress_level"].append(lam)
        raw["power"].append(power.tolist())
        raw["delta"].append(state[:n].tolist())
        raw["omega"].append(state[n:].tolist())
        raw["mechanical_power_diffusion_impulse"].append(impulse.tolist())

        if step == steps:
            break
        state = rk4_step(t, state, dt, **drift_kwargs)
        if rng is not None:
            impulse = float(stochastic["sigma"]) * math.sqrt(dt) * rng.standard_normal(n)
            state[n:] += impulse / inertia
            raw["mechanical_power_diffusion_impulse"][-1] = impulse.tolist()
        if not np.all(np.isfinite(state)):
            raise ProtocolError(f"INVALID_NUMERICAL_STATE at step {step + 1}")

    return raw, equilibrium


def make_run_id(
    protocol_version: str,
    partition: str,
    path_id: str,
    mode: str,
    seed: int | None,
    dt: float,
) -> str:
    seed_text = "none" if seed is None else str(seed)
    dt_text = format(dt, ".15g").replace(".", "p")
    return f"{protocol_version}__{partition}__{path_id}__{mode}__seed-{seed_text}__dt-{dt_text}"


def build_payload(
    manifest: dict[str, Any],
    manifest_hash: str,
    source_hash: str,
    *,
    partition: str,
    path_id: str,
    mode: str,
    seed: int | None,
    dt: float,
) -> tuple[dict[str, Any], dict[str, Any]]:
    raw, equilibrium = integrate_raw(
        manifest,
        partition=partition,
        path_id=path_id,
        mode=mode,
        seed=seed,
        dt=dt,
    )
    run_id = make_run_id(
        manifest["protocol_version"], partition, path_id, mode, seed, dt
    )
    payload = {
        "metadata": {
            "dt": dt,
            "manifest_sha256": manifest_hash,
            "mode": mode,
            "partition": partition,
            "path_id": path_id,
            "protocol_id": manifest["protocol_id"],
            "protocol_version": manifest["protocol_version"],
            "run_id": run_id,
            "run_status": "VALID_RAW_STATE",
            "seed": seed,
            "serialization": SERIALIZATION_ID,
            "simulator_source_sha256": source_hash,
        },
        "initialization": equilibrium,
        "raw": raw,
    }
    return payload, raw


def write_immutable(output_path: Path, data: bytes) -> str:
    """Create exactly once; return explicit identical replay status."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        descriptor = os.open(output_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o444)
    except FileExistsError:
        existing = output_path.read_bytes()
        if existing == data:
            return "ALREADY_PRESENT_IDENTICAL"
        raise RawOutputCollision(f"RAW_OUTPUT_COLLISION: {output_path}")
    try:
        with os.fdopen(descriptor, "wb") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
    except Exception:
        raise
    return "CREATED_IMMUTABLE"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--partition", choices=("development", "evaluation"), required=True)
    parser.add_argument("--path-id", required=True)
    parser.add_argument("--mode", choices=("deterministic", "stochastic"), required=True)
    parser.add_argument("--seed", type=int)
    parser.add_argument("--dt", type=float)
    parser.add_argument("--output-dir", type=Path, required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    manifest, manifest_hash, source_hash = load_context(args.manifest.resolve())
    dt = float(args.dt if args.dt is not None else manifest["numerics"]["primary_dt"])
    payload, _ = build_payload(
        manifest,
        manifest_hash,
        source_hash,
        partition=args.partition,
        path_id=args.path_id,
        mode=args.mode,
        seed=args.seed,
        dt=dt,
    )
    data = canonical_bytes(payload)
    output_path = args.output_dir / f"{payload['metadata']['run_id']}.json"
    disposition = write_immutable(output_path, data)
    print(
        json.dumps(
            {
                "bytes_sha256": sha256_bytes(data),
                "output": str(output_path),
                "status": disposition,
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
