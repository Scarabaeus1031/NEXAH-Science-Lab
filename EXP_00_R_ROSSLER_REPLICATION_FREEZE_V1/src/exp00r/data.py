"""Registered data generation, isolated behind seed and authorization guards."""
from __future__ import annotations

from typing import Dict, Iterable
import numpy as np

from .integrator import integrate
from .rollout_contract import SharedRolloutTable
from .rossler import controlled_rossler


def assert_seed_allowed(seed: int, registered: set[int], allow_registered: bool) -> None:
    if int(seed) in registered and not allow_registered:
        raise PermissionError("registered seed is sealed; explicit post-freeze authorization is required")


def generate_decision_states(
    seeds: Iterable[int], bounds: Dict[str, list], burn_in: float, sampling_duration: float,
    sample_interval: float, dt: float, registered: set[int], allow_registered: bool = False,
) -> tuple[np.ndarray, np.ndarray]:
    states, seed_ids = [], []
    for seed in seeds:
        assert_seed_allowed(int(seed), registered, allow_registered)
        rng = np.random.default_rng(int(seed))
        initial = np.array([rng.uniform(*bounds[key]) for key in ("x", "y", "z")], dtype=float)
        current = integrate(lambda s: controlled_rossler(s, 0.0), initial, burn_in, dt)
        count = int(round(sampling_duration / sample_interval))
        for _ in range(count):
            current = integrate(lambda s: controlled_rossler(s, 0.0), current, sample_interval, dt)
            states.append(current.copy())
            seed_ids.append(int(seed))
    return np.asarray(states), np.asarray(seed_ids, dtype=int)


def generate_shared_rollouts(
    decision_states: np.ndarray, seed_ids: np.ndarray, actions: np.ndarray, horizon: float,
    dt: float, observation_interval: float, source_split: str,
) -> SharedRolloutTable:
    if not np.isclose(round(observation_interval / dt) * dt, observation_interval):
        raise ValueError("observation interval must be an integer multiple of dt")
    n_observations = int(round(horizon / observation_interval))
    paths = np.empty((len(decision_states), len(actions), n_observations + 1, 3), dtype=float)
    for i, state in enumerate(np.asarray(decision_states, dtype=float)):
        for j, action in enumerate(np.asarray(actions, dtype=float)):
            observed = [state.copy()]
            current = state.copy()
            for _ in range(n_observations):
                current = integrate(lambda s, u=float(action): controlled_rossler(s, u), current, observation_interval, dt)
                observed.append(current.copy())
            paths[i, j] = np.asarray(observed)
    return SharedRolloutTable(
        decision_states=np.asarray(decision_states, dtype=float), seed_ids=np.asarray(seed_ids, dtype=int),
        actions=np.asarray(actions, dtype=float), paths=paths,
        observation_interval=float(observation_interval), horizon=float(horizon), source_split=source_split,
    )
