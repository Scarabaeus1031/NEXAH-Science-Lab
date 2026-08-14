"""Direct finite-horizon action-conditioned outcome estimator."""
from __future__ import annotations

from dataclasses import dataclass
import numpy as np

from .rollout_contract import SharedRolloutTable
from .objective import TargetRegion
from .support import SupportModel


@dataclass
class TrajectoryRepresentation:
    neighbors: int
    epsilon: float = 1e-12
    training_z: np.ndarray | None = None
    actions: np.ndarray | None = None
    terminal_scores: np.ndarray | None = None
    support: SupportModel | None = None
    raw_manifest: dict | None = None

    def fit(self, table: SharedRolloutTable, target: TargetRegion, support: SupportModel) -> "TrajectoryRepresentation":
        if table.source_split != "train":
            raise ValueError("trajectory representation may fit only on training rollouts")
        if self.neighbors <= 0 or self.neighbors > len(table.decision_states):
            raise ValueError("invalid trajectory neighbor count")
        self.training_z = target.standardizer.transform(table.decision_states)
        self.actions = table.actions.copy()
        terminal = table.paths[:, :, -1, :]
        self.terminal_scores = target.score(terminal.reshape(-1, 3)).reshape(terminal.shape[:2])
        self.support = support
        self.raw_manifest = table.parity_manifest() | {
            "target_center": tuple(map(float, target.center)), "target_radius": float(target.radius),
            "target_source_split": target.source_split, "objective": "squared_distance_to_closed_target_ball",
        }
        return self

    def predict_scores(self, state: np.ndarray) -> np.ndarray | None:
        if self.training_z is None or self.support is None:
            raise RuntimeError("trajectory representation is not fitted")
        if not self.support.supported(state):
            return None
        query = self.support.standardizer.transform(np.asarray(state, dtype=float))
        distances = np.linalg.norm(self.training_z - query, axis=1)
        idx = np.argpartition(distances, self.neighbors - 1)[: self.neighbors]
        weights = 1.0 / (distances[idx] + self.epsilon)
        weights /= weights.sum()
        return weights @ self.terminal_scores[idx]
