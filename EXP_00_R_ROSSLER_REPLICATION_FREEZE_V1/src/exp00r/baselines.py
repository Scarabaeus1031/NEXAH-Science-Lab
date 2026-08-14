"""Frozen baseline feature construction."""
from __future__ import annotations

import numpy as np

from .ranking import top_margin


def local_expansion(jacobian: np.ndarray) -> float:
    symmetric = 0.5 * (np.asarray(jacobian, dtype=float) + np.asarray(jacobian, dtype=float).T)
    return float(np.linalg.eigvalsh(symmetric).max())


def baseline_vector(
    state: np.ndarray, target, support, field_intercept: np.ndarray, field_jacobian: np.ndarray,
    trajectory_scores: np.ndarray, field_scores: np.ndarray, carrier_action: float,
) -> np.ndarray:
    state = np.asarray(state, dtype=float)
    z = target.standardizer.transform(state)
    theta = np.arctan2(state[1], state[0])
    target_distance = float(target.distance(state[None, :])[0])
    density_distance = support.distance(state)
    support_fraction = 1.0 - min(1.0, density_distance / max(support.threshold, 1e-12))
    return np.array([
        z[0], z[1], z[2], target_distance, np.sin(theta), np.cos(theta),
        np.linalg.norm(field_intercept), local_expansion(field_jacobian),
        density_distance, support_fraction,
        np.min(trajectory_scores), top_margin(trajectory_scores),
        np.min(field_scores), top_margin(field_scores),
        abs(carrier_action), np.sign(carrier_action),
    ], dtype=float)


BASELINE_NAMES = (
    "z_x", "z_y", "z_z", "target_distance", "sin_theta", "cos_theta",
    "learned_flow_norm", "local_expansion", "nearest_training_distance", "support_fraction",
    "trajectory_best_score", "trajectory_margin", "field_best_score", "field_margin",
    "carrier_action_magnitude", "carrier_action_sign",
)
