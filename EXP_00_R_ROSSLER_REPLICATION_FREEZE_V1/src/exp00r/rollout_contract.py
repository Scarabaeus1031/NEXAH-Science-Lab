"""Neutral shared-observation contract; contains no plant implementation."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict
import numpy as np


@dataclass(frozen=True)
class SharedRolloutTable:
    decision_states: np.ndarray
    seed_ids: np.ndarray
    actions: np.ndarray
    paths: np.ndarray
    observation_interval: float
    horizon: float
    source_split: str

    def parity_manifest(self) -> Dict[str, object]:
        return {
            "seed_registry": tuple(sorted(set(map(int, self.seed_ids)))),
            "state_variables": ("x", "y", "z"),
            "actions": tuple(map(float, self.actions)),
            "sampling_interval": float(self.observation_interval),
            "horizon": float(self.horizon),
            "raw_table_identity": id(self),
            "analytic_field_exposed": False,
            "source_split": self.source_split,
        }

    def subset(self, mask: np.ndarray) -> "SharedRolloutTable":
        mask = np.asarray(mask, dtype=bool)
        return SharedRolloutTable(
            decision_states=self.decision_states[mask], seed_ids=self.seed_ids[mask],
            actions=self.actions.copy(), paths=self.paths[mask],
            observation_interval=self.observation_interval, horizon=self.horizon,
            source_split=self.source_split,
        )
