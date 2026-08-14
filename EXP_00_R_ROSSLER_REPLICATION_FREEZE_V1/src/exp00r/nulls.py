"""Deterministic null-control transformations."""
from __future__ import annotations

import hashlib
import itertools
import numpy as np


def rng_for(config_id: str, null_name: str, repetition: int) -> np.random.Generator:
    payload = f"{config_id}|{null_name}|{int(repetition)}".encode("utf-8")
    seed = int.from_bytes(hashlib.sha256(payload).digest()[:8], "big")
    return np.random.default_rng(seed)


def permute_action_labels(values: np.ndarray, config_id: str, repetition: int) -> np.ndarray:
    rng = rng_for(config_id, "action_label", repetition)
    values = np.asarray(values)
    permutation = rng.permutation(values.shape[-1])
    return values[..., permutation]


def permute_ranks_within_seed(ranks: np.ndarray, seed_ids: np.ndarray, config_id: str, repetition: int) -> np.ndarray:
    rng = rng_for(config_id, "rank_within_seed", repetition)
    result = np.asarray(ranks).copy()
    for seed in np.unique(seed_ids):
        idx = np.flatnonzero(np.asarray(seed_ids) == seed)
        result[idx] = result[rng.permutation(idx)]
    return result


def state_mismatch_indices(seed_ids: np.ndarray, strata: np.ndarray, config_id: str, repetition: int) -> np.ndarray:
    rng = rng_for(config_id, "state_mismatch", repetition)
    seed_ids, strata = np.asarray(seed_ids), np.asarray(strata)
    result = np.empty(len(seed_ids), dtype=int)
    for i in range(len(seed_ids)):
        candidates = np.flatnonzero((strata == strata[i]) & (seed_ids != seed_ids[i]))
        if len(candidates) == 0:
            raise ValueError("state-mismatch stratum has no cross-seed candidate")
        result[i] = int(rng.choice(candidates))
    return result


def support_matched_permutation(strata: np.ndarray, config_id: str, repetition: int) -> np.ndarray:
    rng = rng_for(config_id, "support_matched", repetition)
    strata = np.asarray(strata)
    result = np.arange(len(strata))
    for value in np.unique(strata):
        idx = np.flatnonzero(strata == value)
        result[idx] = rng.permutation(idx)
    return result


def signed_permutation_matrices(count: int = 12) -> list[np.ndarray]:
    matrices = []
    for permutation in itertools.permutations(range(3)):
        for signs in itertools.product((-1.0, 1.0), repeat=3):
            matrix = np.zeros((3, 3))
            for row, column in enumerate(permutation):
                matrix[row, column] = signs[row]
            if np.linalg.det(matrix) > 0:
                matrices.append(matrix)
    matrices.sort(key=lambda m: tuple(m.ravel()))
    return matrices[:count]


def register_coordinates(states: np.ndarray, control_matrix: np.ndarray, matrix: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    matrix = np.asarray(matrix, dtype=float)
    if matrix.shape != (3, 3) or not np.allclose(matrix.T @ matrix, np.eye(3)):
        raise ValueError("registration matrix must be orthogonal 3x3")
    return np.asarray(states, dtype=float) @ matrix.T, matrix @ np.asarray(control_matrix, dtype=float)
