"""Training-only target construction and the one shared objective."""
from __future__ import annotations

from dataclasses import dataclass
import numpy as np


@dataclass(frozen=True)
class Standardizer:
    mean: np.ndarray
    scale: np.ndarray

    def transform(self, states: np.ndarray) -> np.ndarray:
        return (np.asarray(states, dtype=float) - self.mean) / self.scale


@dataclass(frozen=True)
class TargetRegion:
    standardizer: Standardizer
    center: np.ndarray
    radius: float
    source_split: str = "train"

    def score(self, states: np.ndarray) -> np.ndarray:
        z = self.standardizer.transform(states)
        distance = np.linalg.norm(z - self.center, axis=-1)
        return np.maximum(0.0, distance - self.radius) ** 2

    def distance(self, states: np.ndarray) -> np.ndarray:
        z = self.standardizer.transform(states)
        return np.maximum(0.0, np.linalg.norm(z - self.center, axis=-1) - self.radius)


def build_target(states: np.ndarray, source_split: str) -> TargetRegion:
    if source_split != "train":
        raise ValueError("target construction is restricted to training states")
    states = np.asarray(states, dtype=float)
    if states.ndim != 2 or states.shape[1] != 3 or len(states) < 8:
        raise ValueError("training states must have shape (n>=8, 3)")
    mean = states.mean(axis=0)
    scale = states.std(axis=0, ddof=0)
    if np.any(scale <= 0):
        raise ValueError("training normalization has a zero-variance coordinate")
    standardizer = Standardizer(mean=mean, scale=scale)
    threshold = np.quantile(states[:, 0], 0.75)
    selected = states[states[:, 0] >= threshold]
    z_selected = standardizer.transform(selected)
    center = z_selected.mean(axis=0)
    radius = float(np.quantile(np.linalg.norm(z_selected - center, axis=1), 0.25))
    return TargetRegion(standardizer=standardizer, center=center, radius=radius)


def intervention_delta(target: TargetRegion, terminal_action: np.ndarray, terminal_zero: np.ndarray) -> float:
    return float(target.score(np.asarray(terminal_action)[None, :])[0] - target.score(np.asarray(terminal_zero)[None, :])[0])


def binary_success(delta_j: float, threshold: float = -0.01) -> int:
    return int(float(delta_j) <= float(threshold))
