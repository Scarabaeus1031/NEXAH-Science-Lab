#!/usr/bin/env python3
"""Deterministic check for the bounded Ghostgrid muon fixture."""

from __future__ import annotations

import json
import math
from pathlib import Path


C = 299_792_458.0
TAU_0 = 2.196_981_1e-6
L = 15_000.0
BETA = 0.99


def main() -> None:
    gamma = 1.0 / math.sqrt(1.0 - BETA**2)
    c_tau = C * TAU_0
    rest_decay_length_ratio = L / c_tau
    mean_lab_decay_length = BETA * gamma * c_tau
    survival = math.exp(-L / mean_lab_decay_length)
    survival_without_dilation = math.exp(-L / (BETA * c_tau))

    # gamma*beta = L/(c*tau_0) for one mean lifetime over L.
    gamma_required = math.sqrt(1.0 + rest_decay_length_ratio**2)
    beta_required = math.sqrt(1.0 - 1.0 / gamma_required**2)

    t = L / (BETA * C)
    x = L
    t_prime = gamma * (t - BETA * x / C)
    x_prime = gamma * (x - BETA * C * t)

    t_return = gamma * (t_prime + BETA * x_prime / C)
    x_return = gamma * (x_prime + BETA * C * t_prime)

    interval = C**2 * t**2 - x**2
    interval_prime = C**2 * t_prime**2 - x_prime**2
    relative_interval_error = abs(interval_prime - interval) / abs(interval)

    result = {
        "schema_id": "nexah.ghostgrid-relativity-muon-01",
        "status": "PASS",
        "claim_boundary": "DETERMINISTIC_DIDACTIC_FIXTURE_NO_NEW_PHYSICS_CLAIM",
        "inputs": {
            "c_m_per_s": C,
            "muon_mean_life_s": TAU_0,
            "earth_path_m": L,
            "beta": BETA,
        },
        "derived": {
            "c_tau_m": c_tau,
            "rest_decay_length_ratio": rest_decay_length_ratio,
            "gamma_at_beta_0_99": gamma,
            "earth_mean_decay_length_m": mean_lab_decay_length,
            "survival_probability_with_dilation": survival,
            "survival_probability_without_dilation": survival_without_dilation,
            "muon_frame_path_m": L / gamma,
            "earth_elapsed_s": t,
            "muon_proper_elapsed_s": t_prime,
            "gamma_for_one_mean_lifetime_over_path": gamma_required,
            "beta_for_one_mean_lifetime_over_path": beta_required,
        },
        "round_trip": {
            "time_residual_s": abs(t_return - t),
            "position_residual_m": abs(x_return - x),
            "relative_interval_error": relative_interval_error,
            "muon_frame_position_m": x_prime,
        },
        "lossy_projection": {
            "retained": ["earth_elapsed_s"],
            "discarded": ["beta", "path_length", "frame_identity"],
            "return_status": "EXACT_RETURN_NOT_IDENTIFIABLE",
        },
        "negative_controls": {
            "euclidean_mirror_as_frame_transform": "REJECTED",
            "inverse_transform_as_physical_time_reversal": "REJECTED",
            "factor_22_as_privileged_nexah_number": "REJECTED",
        },
    }

    assert result["round_trip"]["time_residual_s"] < 1e-15
    assert result["round_trip"]["position_residual_m"] < 1e-8
    assert result["round_trip"]["relative_interval_error"] < 1e-12

    output = Path(__file__).resolve().parents[1] / "outputs" / "muon_case_results.json"
    output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()

