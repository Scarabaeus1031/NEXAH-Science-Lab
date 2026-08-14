"""Deterministic fixed-step RK4 utilities."""
from __future__ import annotations

from typing import Callable
import numpy as np

VectorField = Callable[[np.ndarray], np.ndarray]


def rk4_step(field: VectorField, state: np.ndarray, dt: float) -> np.ndarray:
    x = np.asarray(state, dtype=float)
    k1 = np.asarray(field(x), dtype=float)
    k2 = np.asarray(field(x + 0.5 * dt * k1), dtype=float)
    k3 = np.asarray(field(x + 0.5 * dt * k2), dtype=float)
    k4 = np.asarray(field(x + dt * k3), dtype=float)
    return x + (dt / 6.0) * (k1 + 2 * k2 + 2 * k3 + k4)


def integrate(field: VectorField, state: np.ndarray, horizon: float, dt: float, return_path: bool = False):
    if horizon < 0 or dt <= 0:
        raise ValueError("horizon must be nonnegative and dt positive")
    steps_float = horizon / dt
    steps = int(round(steps_float))
    if not np.isclose(steps * dt, horizon, atol=1e-12):
        raise ValueError("horizon must be an integer multiple of dt")
    current = np.asarray(state, dtype=float).copy()
    path = [current.copy()]
    for _ in range(steps):
        current = rk4_step(field, current, dt)
        if not np.all(np.isfinite(current)):
            raise FloatingPointError("nonfinite state during integration")
        if return_path:
            path.append(current.copy())
    return np.asarray(path) if return_path else current
