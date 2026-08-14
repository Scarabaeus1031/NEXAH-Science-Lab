"""The single pairwise Kendall-tau-b coherence used by EXP-00-R."""
from __future__ import annotations

import math
import numpy as np


def kendall_tau_b(rank_a: np.ndarray, rank_b: np.ndarray) -> float:
    a = np.asarray(rank_a, dtype=float)
    b = np.asarray(rank_b, dtype=float)
    if a.shape != b.shape or a.ndim != 1 or len(a) < 2:
        raise ValueError("rank vectors must share a one-dimensional shape of length >= 2")
    concordant = discordant = ties_a = ties_b = 0
    for i in range(len(a) - 1):
        for j in range(i + 1, len(a)):
            da, db = np.sign(a[j] - a[i]), np.sign(b[j] - b[i])
            if da == 0 and db == 0:
                continue
            if da == 0:
                ties_a += 1
            elif db == 0:
                ties_b += 1
            elif da == db:
                concordant += 1
            else:
                discordant += 1
    denominator = math.sqrt((concordant + discordant + ties_a) * (concordant + discordant + ties_b))
    return 0.0 if denominator == 0 else (concordant - discordant) / denominator


def pair_coherence(rank_trajectory: np.ndarray, rank_field: np.ndarray) -> float:
    return 0.5 * (1.0 + kendall_tau_b(rank_trajectory, rank_field))
