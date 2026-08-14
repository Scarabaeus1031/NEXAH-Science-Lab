"""Analytic Rössler plant. Learned representations must never import this module."""
from __future__ import annotations

import numpy as np

from .actions import controlled_increment


def rossler_field(state: np.ndarray, a: float = 0.2, b: float = 0.2, c: float = 5.7) -> np.ndarray:
    x, y, z = np.asarray(state, dtype=float)
    return np.array([-y - z, x + a * y, b + z * (x - c)], dtype=float)


def controlled_rossler(state: np.ndarray, u: float, a: float = 0.2, b: float = 0.2, c: float = 5.7) -> np.ndarray:
    return rossler_field(state, a=a, b=b, c=c) + controlled_increment(u)
