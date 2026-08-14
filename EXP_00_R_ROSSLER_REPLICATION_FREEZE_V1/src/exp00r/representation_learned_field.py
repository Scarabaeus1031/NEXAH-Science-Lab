"""Local learned field; deliberately has no dependency on exp00r.rossler."""
from __future__ import annotations

from dataclasses import dataclass
import numpy as np

from .actions import controlled_increment
from .integrator import integrate
from .objective import TargetRegion
from .rollout_contract import SharedRolloutTable
from .support import SupportModel, require_complete_support


@dataclass
class LocalAffineField:
    neighbors: int
    ridge_alpha: float
    dt: float
    horizon: float
    training_states: np.ndarray | None = None
    training_z: np.ndarray | None = None
    derivative_labels: np.ndarray | None = None
    actions: np.ndarray | None = None
    support: SupportModel | None = None
    target: TargetRegion | None = None
    raw_manifest: dict | None = None

    def fit(self, table: SharedRolloutTable, target: TargetRegion, support: SupportModel) -> "LocalAffineField":
        if table.source_split != "train":
            raise ValueError("learned field may fit only on training rollouts")
        current = table.paths[:, :, :-1, :]
        following = table.paths[:, :, 1:, :]
        action_grid = np.broadcast_to(table.actions[None, :, None], current.shape[:-1])
        labels = (following - current) / table.observation_interval
        labels -= action_grid[..., None] * np.array([1.0, 0.0, 0.0])
        self.training_states = current.reshape(-1, 3)
        self.training_z = target.standardizer.transform(self.training_states)
        self.derivative_labels = labels.reshape(-1, 3)
        if self.neighbors <= 3 or self.neighbors > len(self.training_states):
            raise ValueError("invalid learned-field neighbor count")
        self.actions = table.actions.copy()
        self.support = support
        self.target = target
        self.raw_manifest = table.parity_manifest() | {
            "target_center": tuple(map(float, target.center)), "target_radius": float(target.radius),
            "target_source_split": target.source_split, "objective": "squared_distance_to_closed_target_ball",
        }
        return self

    def local_model(self, state: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        if self.training_z is None or self.support is None:
            raise RuntimeError("learned field is not fitted")
        state = np.asarray(state, dtype=float)
        query_z = self.support.standardizer.transform(state)
        distances = np.linalg.norm(self.training_z - query_z, axis=1)
        idx = np.argpartition(distances, self.neighbors - 1)[: self.neighbors]
        centered = self.training_states[idx] - state
        design = np.column_stack([np.ones(len(idx)), centered])
        penalty = np.eye(4) * self.ridge_alpha
        penalty[0, 0] = 0.0
        coefficients = np.linalg.solve(design.T @ design + penalty, design.T @ self.derivative_labels[idx])
        intercept = coefficients[0]
        jacobian = coefficients[1:].T
        return intercept, jacobian

    def predict_scores(self, state: np.ndarray) -> np.ndarray | None:
        if self.support is None or self.target is None or self.actions is None:
            raise RuntimeError("learned field is not fitted")
        if not self.support.supported(state):
            return None
        anchor = np.asarray(state, dtype=float)
        intercept, jacobian = self.local_model(anchor)
        scores, path_flags = [], []
        for action in self.actions:
            def field(s, u=float(action)):
                return intercept + jacobian @ (np.asarray(s) - anchor) + controlled_increment(u)
            path = integrate(field, anchor, self.horizon, self.dt, return_path=True)
            path_flags.append(self.support.path_supported(path))
            scores.append(float(self.target.score(path[-1][None, :])[0]))
        if not require_complete_support(np.asarray(path_flags)):
            return None
        return np.asarray(scores)
