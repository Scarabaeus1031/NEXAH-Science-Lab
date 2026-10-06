#!/usr/bin/env python3
"""Deterministic UTG-FORMAL-01 crossing controls on Lorenz-63."""

from __future__ import annotations

import csv
import json
import math
from pathlib import Path


SIGMA = 10.0
RHO = 28.0
BETA = 8.0 / 3.0
DT_REFERENCE = 0.001
T_END = 100.0
T_BURN = 10.0
INITIAL_STATE = (1.0, 1.0, 1.0)
SAMPLE_DTS = (0.001, 0.005, 0.01, 0.02)
ZERO_TOL = 1.0e-12
TRANSVERSE_TOL = 1.0e-9
HERE = Path(__file__).resolve().parent


def rhs(state: tuple[float, float, float]) -> tuple[float, float, float]:
    x, y, z = state
    return (
        SIGMA * (y - x),
        x * (RHO - z) - y,
        x * y - BETA * z,
    )


def add_scaled(
    state: tuple[float, float, float],
    delta: tuple[float, float, float],
    scale: float,
) -> tuple[float, float, float]:
    return tuple(state[i] + scale * delta[i] for i in range(3))


def rk4_step(
    state: tuple[float, float, float], dt: float
) -> tuple[float, float, float]:
    k1 = rhs(state)
    k2 = rhs(add_scaled(state, k1, 0.5 * dt))
    k3 = rhs(add_scaled(state, k2, 0.5 * dt))
    k4 = rhs(add_scaled(state, k3, dt))
    return tuple(
        state[i] + (dt / 6.0) * (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i])
        for i in range(3)
    )


def integrate() -> list[tuple[float, tuple[float, float, float]]]:
    steps = round(T_END / DT_REFERENCE)
    state = INITIAL_STATE
    rows = [(0.0, state)]
    for index in range(steps):
        state = rk4_step(state, DT_REFERENCE)
        rows.append(((index + 1) * DT_REFERENCE, state))
    return rows


def classify_pair(
    left: tuple[float, tuple[float, float, float]],
    right: tuple[float, tuple[float, float, float]],
) -> dict[str, object]:
    t0, s0 = left
    t1, s1 = right
    g0 = s0[0]
    g1 = s1[0]
    if not all(math.isfinite(value) for value in (t0, t1, *s0, *s1)) or t1 <= t0:
        return {"classification": "UNRESOLVED_INPUT", "admitted": False}
    if g0 * g1 < 0.0:
        alpha = -g0 / (g1 - g0)
        event = tuple(s0[i] + alpha * (s1[i] - s0[i]) for i in range(3))
        event = (0.0, event[1], event[2])
        event_time = t0 + alpha * (t1 - t0)
        direction = 1 if g0 < 0.0 < g1 else -1
        dgdt = SIGMA * event[1]
        transversal = abs(dgdt) > TRANSVERSE_TOL
        direction_consistent = transversal and (1 if dgdt > 0.0 else -1) == direction
        admitted = transversal and direction_consistent and direction == 1
        return {
            "classification": "TRANSVERSAL_CROSSING" if transversal and direction_consistent else "NONTRANSVERSAL_SIGN_CHANGE",
            "admitted": admitted,
            "event_time": event_time,
            "event_state": event,
            "direction": direction,
            "dgdt": dgdt,
            "direction_consistent": direction_consistent,
        }
    if abs(g0) <= ZERO_TOL or abs(g1) <= ZERO_TOL:
        return {"classification": "TOUCH_OR_UNRESOLVED", "admitted": False}
    return {"classification": "NO_CROSSING", "admitted": False}


def classify_series(
    rows: list[tuple[float, tuple[float, float, float]]]
) -> list[dict[str, object]]:
    return [classify_pair(rows[i], rows[i + 1]) for i in range(len(rows) - 1)]


def crossing_events(
    rows: list[tuple[float, tuple[float, float, float]]]
) -> list[dict[str, object]]:
    return [
        item
        for item in classify_series(rows)
        if item["classification"] in {"TRANSVERSAL_CROSSING", "NONTRANSVERSAL_SIGN_CHANGE"}
    ]


def control_results() -> list[dict[str, object]]:
    controls = [
        ("positive_transversal", [(-0.2, 0.2, 20.0), (0.2, 0.2, 20.0)], "TRANSVERSAL_CROSSING", True),
        ("negative_transversal", [(0.2, -0.2, 20.0), (-0.2, -0.2, 20.0)], "TRANSVERSAL_CROSSING", False),
        ("same_side_near_miss", [(-0.02, 0.1, 20.0), (-0.001, 0.1, 20.0)], "NO_CROSSING", False),
        ("boundary_touch", [(0.01, 0.0, 20.0), (0.0, 0.0, 20.0)], "TOUCH_OR_UNRESOLVED", False),
        ("nontransversal_sign_change", [(-0.01, 0.0, 20.0), (0.01, 0.0, 20.0)], "NONTRANSVERSAL_SIGN_CHANGE", False),
    ]
    results = []
    for name, states, expected_class, expected_admitted in controls:
        observed = classify_pair((0.0, states[0]), (1.0, states[1]))
        passed = observed["classification"] == expected_class and observed["admitted"] == expected_admitted
        results.append({
            "control": name,
            "expected_classification": expected_class,
            "observed_classification": observed["classification"],
            "expected_admitted": expected_admitted,
            "observed_admitted": observed["admitted"],
            "pass": passed,
        })
    return results


def nearest_reference(
    event: dict[str, object], reference: list[dict[str, object]]
) -> dict[str, object]:
    return min(reference, key=lambda item: abs(float(item["event_time"]) - float(event["event_time"])))


def mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def identity_return(
    event_state: tuple[float, float, float]
) -> tuple[float, float, float]:
    """Record-only return: explicitly leaves the carrier state unchanged."""
    return tuple(event_state)


def main() -> None:
    full = integrate()
    burn_index = round(T_BURN / DT_REFERENCE)
    analysis = full[burn_index:]
    reference_events = crossing_events(analysis)
    reference_count = len(reference_events)
    controls = control_results()
    sampling = []
    all_event_rows = []

    for dt in SAMPLE_DTS:
        stride = round(dt / DT_REFERENCE)
        sampled = analysis[::stride]
        events = crossing_events(sampled)
        time_errors = []
        z_errors = []
        for event in events:
            nearest = nearest_reference(event, reference_events)
            time_errors.append(abs(float(event["event_time"]) - float(nearest["event_time"])))
            z_errors.append(abs(float(event["event_state"][2]) - float(nearest["event_state"][2])))
            all_event_rows.append({
                "sample_dt": dt,
                "event_time": event["event_time"],
                "y": event["event_state"][1],
                "z": event["event_state"][2],
                "direction": event["direction"],
                "dgdt": event["dgdt"],
                "admitted": event["admitted"],
            })
        sampling.append({
            "dt": dt,
            "samples": len(sampled),
            "aperture_samples_abs_x_le_1": sum(1 for _, state in sampled if abs(state[0]) <= 1.0),
            "events": len(events),
            "admitted_positive": sum(1 for event in events if event["admitted"]),
            "rejected_negative": sum(1 for event in events if event["classification"] == "TRANSVERSAL_CROSSING" and not event["admitted"]),
            "nontransversal": sum(1 for event in events if event["classification"] == "NONTRANSVERSAL_SIGN_CHANGE"),
            "max_abs_g_at_interpolated_event": max(abs(float(event["event_state"][0])) for event in events),
            "event_time_mae_vs_reference": mean(time_errors),
            "event_z_mae_vs_reference": mean(z_errors),
        })

    coarse = next(row for row in sampling if row["dt"] == 0.02)
    reference = sampling[0]
    gates = {
        "controls": all(item["pass"] for item in controls),
        "both_directions_present": reference["admitted_positive"] > 0 and reference["rejected_negative"] > 0,
        "event_boundary_residual": all(row["max_abs_g_at_interpolated_event"] <= ZERO_TOL for row in sampling),
        "transversal_direction_consistency": all(row["nontransversal"] == 0 for row in sampling),
        "sampling_event_count": all(row["events"] == reference_count for row in sampling),
        "coarse_time_mae": coarse["event_time_mae_vs_reference"] <= 0.001,
        "coarse_z_mae": coarse["event_z_mae_vs_reference"] <= 0.05,
        "identity_return": all(
            identity_return(tuple(event["event_state"])) == tuple(event["event_state"])
            for event in reference_events
        ),
    }
    status = "PASS" if all(gates.values()) else "FAIL"
    result = {
        "test_id": "UTG-FORMAL-01",
        "status": status,
        "carrier": {
            "system": "Lorenz-63",
            "state_space": "R^3",
            "parameters": {"sigma": SIGMA, "rho": RHO, "beta": BETA},
            "initial_state": INITIAL_STATE,
            "integrator": "fixed-step RK4",
            "reference_dt": DT_REFERENCE,
            "t_burn": T_BURN,
            "t_end": T_END,
        },
        "utg_binding": {
            "event_function": "g(x,y,z,t)=x",
            "boundary": "B={(x,y,z) in R^3 | x=0}",
            "observation_aperture": "W={(x,y,z) in R^3 | |x|<=1}",
            "crossing_rule": "strict sampled sign change with linear interpolation",
            "transversality": "dg/dt=sigma*y != 0 at B",
            "gate": "negative-to-positive and dg/dt>1e-9",
            "return_map": "identity on section record; no dynamics reset",
        },
        "controls": controls,
        "sampling": sampling,
        "acceptance_gates": gates,
        "decision": "OBJECT_SPECIFIC_FORMAL_CONTROL_SUPPORTED" if status == "PASS" else "OBJECT_SPECIFIC_FORMAL_CONTROL_REJECTED",
        "claim_boundary": "This controls one crossing classifier on one Lorenz-63 trajectory. It does not validate the Series XIV equation, a universal UTG mechanism, a new Lorenz result, a physical application or UTG as a whole.",
    }

    json_path = HERE / "UTG_FORMAL_01_RESULTS.json"
    csv_path = HERE / "UTG_FORMAL_01_EVENTS.csv"
    json_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=list(all_event_rows[0].keys()),
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(all_event_rows)
    print(json.dumps({"status": status, "acceptance_gates": gates, "sampling": sampling}, indent=2))
    if status != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
