#!/usr/bin/env python3
"""Numerical/software verification for the Level-1 raw-state simulator.

No candidate, comparator, warning, alarm, terminal-event, or hypothesis result
is calculated here.
"""

from __future__ import annotations

import argparse
import copy
import json
import math
import platform
import tempfile
from pathlib import Path
from typing import Any

import numpy as np

import simulate_level1 as simulator


FORBIDDEN_RESULT_KEYS = {
    "alarm_time",
    "delta_l",
    "event_time",
    "false_positive_rate",
    "lead_time",
    "pass",
    "precision",
    "recall",
    "warning_time",
}


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def trajectory_hash(payload: dict[str, Any]) -> str:
    return simulator.sha256_bytes(simulator.canonical_bytes(payload["raw"]))


def recursively_find_keys(value: Any) -> set[str]:
    found: set[str] = set()
    if isinstance(value, dict):
        for key, child in value.items():
            found.add(key.lower())
            found.update(recursively_find_keys(child))
    elif isinstance(value, list):
        for child in value:
            found.update(recursively_find_keys(child))
    return found


def generate(
    manifest: dict[str, Any],
    manifest_hash: str,
    source_hash: str,
    *,
    mode: str,
    seed: int | None,
    dt: float,
) -> tuple[dict[str, Any], dict[str, Any], bytes]:
    payload, direct_raw = simulator.build_payload(
        manifest,
        manifest_hash,
        source_hash,
        partition="development",
        path_id="dev-r0.04-c0.4",
        mode=mode,
        seed=seed,
        dt=dt,
    )
    data = simulator.canonical_bytes(payload)
    return payload, direct_raw, data


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--result", type=Path, required=True)
    args = parser.parse_args()

    manifest, manifest_hash, source_hash = simulator.load_context(args.manifest.resolve())
    primary_dt = float(manifest["numerics"]["primary_dt"])
    check_dt = float(manifest["numerics"]["convergence_check_dt"])

    deterministic_1, deterministic_direct, deterministic_bytes_1 = generate(
        manifest, manifest_hash, source_hash, mode="deterministic", seed=None, dt=primary_dt
    )
    deterministic_2, _, deterministic_bytes_2 = generate(
        manifest, manifest_hash, source_hash, mode="deterministic", seed=None, dt=primary_dt
    )
    assert_true(
        deterministic_bytes_1 == deterministic_bytes_2,
        "A deterministic replay was not byte-identical",
    )

    stochastic_1000_a, stochastic_direct, stochastic_bytes_1000_a = generate(
        manifest, manifest_hash, source_hash, mode="stochastic", seed=1000, dt=primary_dt
    )
    stochastic_1000_b, _, stochastic_bytes_1000_b = generate(
        manifest, manifest_hash, source_hash, mode="stochastic", seed=1000, dt=primary_dt
    )
    assert_true(
        stochastic_bytes_1000_a == stochastic_bytes_1000_b,
        "B stochastic same-seed replay was not byte-identical",
    )
    stochastic_1001, stochastic_direct_1001, stochastic_bytes_1001 = generate(
        manifest, manifest_hash, source_hash, mode="stochastic", seed=1001, dt=primary_dt
    )
    assert_true(
        trajectory_hash(stochastic_1000_a) != trajectory_hash(stochastic_1001),
        "C different seeds produced identical trajectories",
    )

    equilibrium = deterministic_1["initialization"]
    assert_true(equilibrium["converged"], "D equilibrium did not converge")
    assert_true(
        equilibrium["max_abs_physical_residual"]
        <= manifest["numerics"]["equilibrium_residual_tolerance"],
        "D equilibrium residual exceeds tolerance",
    )
    assert_true(
        abs(equilibrium["gauge_residual"])
        <= manifest["numerics"]["equilibrium_residual_tolerance"],
        "E equilibrium gauge exceeds tolerance",
    )

    q = np.asarray(manifest["stress"]["direction"], dtype=np.float64)
    base_power = np.asarray(manifest["model"]["base_power"], dtype=np.float64)
    stress_levels = np.asarray(deterministic_1["raw"]["stress_level"], dtype=np.float64)
    total_power = np.sum(base_power[None, :] + stress_levels[:, None] * q[None, :], axis=1)
    balance_tolerance = float(manifest["numerics"]["power_balance_tolerance"])
    assert_true(abs(float(np.sum(q))) <= balance_tolerance, "F stress direction is unbalanced")
    assert_true(
        float(np.max(np.abs(total_power))) <= balance_tolerance,
        "F commanded total power is unbalanced",
    )

    convergence_payload, convergence_direct, convergence_bytes = generate(
        manifest, manifest_hash, source_hash, mode="deterministic", seed=None, dt=check_dt
    )
    coarse_delta = np.asarray(deterministic_1["raw"]["delta"], dtype=np.float64)
    fine_delta = np.asarray(convergence_payload["raw"]["delta"], dtype=np.float64)[::2]
    coarse_omega = np.asarray(deterministic_1["raw"]["omega"], dtype=np.float64)
    fine_omega = np.asarray(convergence_payload["raw"]["omega"], dtype=np.float64)[::2]
    assert_true(coarse_delta.shape == fine_delta.shape, "G convergence time grids do not align")
    max_delta_discrepancy = float(np.max(np.abs(coarse_delta - fine_delta)))
    max_omega_discrepancy = float(np.max(np.abs(coarse_omega - fine_omega)))

    payloads_and_direct = [
        (deterministic_1, deterministic_direct, deterministic_bytes_1),
        (convergence_payload, convergence_direct, convergence_bytes),
        (stochastic_1000_a, stochastic_direct, stochastic_bytes_1000_a),
        (stochastic_1001, stochastic_direct_1001, stochastic_bytes_1001),
    ]
    artifacts: list[dict[str, Any]] = []
    for payload, direct_raw, data in payloads_and_direct:
        arrays = [np.asarray(values, dtype=np.float64) for values in payload["raw"].values()]
        assert_true(all(np.all(np.isfinite(array)) for array in arrays), "H NaN/Inf detected")
        assert_true(
            payload["metadata"]["manifest_sha256"] == manifest_hash,
            "I raw run has wrong manifest identity",
        )
        parsed = json.loads(data)
        assert_true(parsed["raw"] == direct_raw, "K serialized raw state differs from integrator output")
        forbidden = FORBIDDEN_RESULT_KEYS.intersection(recursively_find_keys(payload))
        assert_true(not forbidden, f"Forbidden analysis result keys present: {sorted(forbidden)}")
        path = args.raw_dir / f"{payload['metadata']['run_id']}.json"
        disposition = simulator.write_immutable(path, data)
        artifacts.append(
            {
                "path": str(path),
                "sha256": simulator.sha256_bytes(data),
                "write_disposition": disposition,
            }
        )

    with tempfile.TemporaryDirectory(prefix="nexah-level1-immutability-") as temp_dir:
        collision_path = Path(temp_dir) / "run.json"
        first_status = simulator.write_immutable(collision_path, deterministic_bytes_1)
        identical_status = simulator.write_immutable(collision_path, deterministic_bytes_1)
        changed = copy.deepcopy(deterministic_1)
        changed["metadata"]["run_status"] = "MUTATED_TEST_SENTINEL"
        collision_blocked = False
        try:
            simulator.write_immutable(collision_path, simulator.canonical_bytes(changed))
        except simulator.RawOutputCollision:
            collision_blocked = True
        assert_true(first_status == "CREATED_IMMUTABLE", "J initial immutable write failed")
        assert_true(
            identical_status == "ALREADY_PRESENT_IDENTICAL",
            "J identical replay was not recognized",
        )
        assert_true(collision_blocked, "J non-identical overwrite was not blocked")

    result = {
        "artifact_type": "LEVEL1_NUMERICAL_SOFTWARE_VERIFICATION",
        "hypothesis_tested": False,
        "manifest_sha256": manifest_hash,
        "protocol_version": manifest["protocol_version"],
        "simulator_source_sha256": source_hash,
        "verifier_source_sha256": simulator.sha256_file(Path(__file__).resolve()),
        "environment": {
            "numpy": np.__version__,
            "python": platform.python_version(),
        },
        "checks": {
            "A_deterministic_byte_replay": "PASS",
            "B_stochastic_same_seed_byte_replay": "PASS",
            "C_distinct_seed_trajectory": "PASS",
            "D_equilibrium_residual": {
                "status": "PASS",
                "max_abs_residual": equilibrium["max_abs_physical_residual"],
                "tolerance": equilibrium["tolerance"],
            },
            "E_equilibrium_gauge": {
                "status": "PASS",
                "residual": equilibrium["gauge_residual"],
                "tolerance": equilibrium["tolerance"],
            },
            "F_balanced_stress": {
                "status": "PASS",
                "max_abs_total_power": float(np.max(np.abs(total_power))),
                "sum_q": float(np.sum(q)),
                "tolerance": balance_tolerance,
            },
            "G_dt_halving_discrepancy": {
                "acceptance_judgment": "NOT_MADE_NO_NUMERIC_RAW_STATE_TOLERANCE_PREREGISTERED",
                "coarse_dt": primary_dt,
                "fine_dt": check_dt,
                "max_abs_delta_discrepancy": max_delta_discrepancy,
                "max_abs_omega_discrepancy": max_omega_discrepancy,
                "status": "DISCREPANCY_REPORTED_WITHOUT_RETUNING",
            },
            "H_finite_raw_states": "PASS",
            "I_exact_manifest_identity": "PASS",
            "J_immutable_collision_handling": "PASS",
            "K_serialized_equals_integrator_output": "PASS",
            "no_forbidden_analysis_results": "PASS",
        },
        "raw_artifacts": artifacts,
        "scientific_outcome": "NOT_COMPUTED",
        "status": "NUMERICAL_SOFTWARE_CHECKS_COMPLETE",
    }
    result_bytes = simulator.canonical_bytes(result)
    result_disposition = simulator.write_immutable(args.result, result_bytes)
    print(
        json.dumps(
            {
                "result": str(args.result),
                "sha256": simulator.sha256_bytes(result_bytes),
                "status": result_disposition,
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
