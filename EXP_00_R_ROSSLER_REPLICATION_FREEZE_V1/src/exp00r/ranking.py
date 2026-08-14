"""Weak rankings and the frozen carrier tie rule."""
from __future__ import annotations

import numpy as np


def weak_rank(scores: np.ndarray) -> np.ndarray:
    values = np.asarray(scores, dtype=np.float64)
    if values.ndim != 1 or not np.all(np.isfinite(values)):
        raise ValueError("scores must be one-dimensional finite float64 values")
    order = np.argsort(values, kind="mergesort")
    ranks = np.empty(len(values), dtype=float)
    i = 0
    while i < len(values):
        j = i + 1
        while j < len(values) and values[order[j]] == values[order[i]]:
            j += 1
        ranks[order[i:j]] = 0.5 * ((i + 1) + j)
        i = j
    return ranks


def top_action(scores: np.ndarray, actions: np.ndarray, amplitude: float) -> float:
    scores = np.asarray(scores, dtype=np.float64)
    actions = np.asarray(actions, dtype=float)
    if scores.shape != actions.shape:
        raise ValueError("scores/actions shape mismatch")
    minimum = np.min(scores)
    tied = set(actions[scores == minimum].tolist())
    preference = [0.0, -0.5 * amplitude, 0.5 * amplitude, -amplitude, amplitude]
    for action in preference:
        if action in tied:
            return float(action)
    raise RuntimeError("tie preference does not cover the action set")


def top_margin(scores: np.ndarray) -> float:
    ordered = np.sort(np.asarray(scores, dtype=float))
    return float(ordered[1] - ordered[0]) if len(ordered) > 1 else float("nan")
