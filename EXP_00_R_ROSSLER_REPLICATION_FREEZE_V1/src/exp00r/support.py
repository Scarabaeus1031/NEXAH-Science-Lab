"""Training-only distance support and abstention rules."""
from __future__ import annotations

from dataclasses import dataclass
import numpy as np

from .objective import Standardizer


@dataclass(frozen=True)
class SupportModel:
    training_z: np.ndarray
    standardizer: Standardizer
    threshold: float
    quantile: float

    def distance(self, state: np.ndarray) -> float:
        query = self.standardizer.transform(np.asarray(state, dtype=float))
        return float(np.min(np.linalg.norm(self.training_z - query, axis=1)))

    def supported(self, state: np.ndarray) -> bool:
        return self.distance(state) <= self.threshold

    def path_supported(self, path: np.ndarray) -> bool:
        return all(self.supported(state) for state in np.asarray(path, dtype=float))


def fit_support(training_states: np.ndarray, standardizer: Standardizer, quantile: float = 0.99) -> SupportModel:
    if not 0 < quantile < 1:
        raise ValueError("support quantile must lie strictly between 0 and 1")
    z = standardizer.transform(np.asarray(training_states, dtype=float))
    if len(z) < 2:
        raise ValueError("support requires at least two training states")
    distances = np.linalg.norm(z[:, None, :] - z[None, :, :], axis=2)
    np.fill_diagonal(distances, np.inf)
    loo_nearest = distances.min(axis=1)
    threshold = float(np.quantile(loo_nearest, quantile))
    return SupportModel(training_z=z, standardizer=standardizer, threshold=threshold, quantile=quantile)


def require_complete_support(flags: np.ndarray) -> bool:
    flags = np.asarray(flags, dtype=bool)
    return bool(flags.size > 0 and np.all(flags))
