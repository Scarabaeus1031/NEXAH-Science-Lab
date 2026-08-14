"""One shared scalar physical action contract."""
from __future__ import annotations

import numpy as np


CONTROL_MATRIX = np.array([[1.0], [0.0], [0.0]], dtype=float)


def action_set(amplitude: float, normalized_levels=(-1.0, -0.5, 0.0, 0.5, 1.0)) -> np.ndarray:
    if amplitude <= 0:
        raise ValueError("amplitude must be positive")
    actions = np.asarray(normalized_levels, dtype=float) * float(amplitude)
    if actions.ndim != 1 or len(np.unique(actions)) != len(actions) or 0.0 not in actions:
        raise ValueError("actions must be a unique scalar set containing zero")
    return actions


def controlled_increment(u: float) -> np.ndarray:
    return (CONTROL_MATRIX[:, 0] * float(u)).copy()


def assert_shared_actions(*arrays: np.ndarray) -> None:
    if not arrays:
        raise ValueError("at least one action array is required")
    first = np.asarray(arrays[0], dtype=float)
    if any(not np.array_equal(first, np.asarray(other, dtype=float)) for other in arrays[1:]):
        raise ValueError("representations do not share an identical physical action set")
