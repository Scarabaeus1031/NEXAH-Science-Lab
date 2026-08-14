"""Frozen registered pipeline. It is unreachable without the external lock."""
from __future__ import annotations

import json
from pathlib import Path
import numpy as np

from .actions import action_set, assert_shared_actions
from .analysis import compare_baseline_coherence, seed_block_folds
from .config_loader import registered_seeds
from .data import generate_decision_states, generate_shared_rollouts
from .evaluation import evaluate_table, stack_records
from .objective import build_target
from .representation_learned_field import LocalAffineField
from .representation_trajectory import TrajectoryRepresentation
from .support import fit_support


def _seed_range(block: dict) -> range:
    return range(int(block["start"]), int(block["stop_inclusive"]) + 1)


def _fit_pair(table, target, config):
    support = fit_support(table.decision_states, target.standardizer, config["support"]["threshold_quantile"])
    trajectory = TrajectoryRepresentation(
        neighbors=config["representations"]["trajectory"]["neighbors"],
        epsilon=config["representations"]["trajectory"]["epsilon"],
    ).fit(table, target, support)
    field = LocalAffineField(
        neighbors=config["representations"]["learned_field"]["neighbors"],
        ridge_alpha=config["representations"]["learned_field"]["ridge_alpha"],
        dt=config["plant"]["dt"], horizon=config["plant"]["evaluation_horizon"],
    ).fit(table, target, support)
    assert_shared_actions(trajectory.actions, field.actions)
    return trajectory, field


def run_registered_pipeline(config: dict, output_dir: Path) -> dict:
    """Execute only after execution_guard.require_authorization has passed."""
    registered = registered_seeds(config)
    data_cfg, plant_cfg = config["data"], config["plant"]
    actions = action_set(config["actions"]["primary_amplitude"], config["actions"]["normalized_levels"])
    train_states, train_seed_ids = generate_decision_states(
        _seed_range(data_cfg["train_seeds"]), data_cfg["initial_state_bounds"], data_cfg["burn_in"],
        data_cfg["sampling_duration"], data_cfg["sample_interval"], plant_cfg["dt"], registered, True,
    )
    target = build_target(train_states, "train")
    train_table = generate_shared_rollouts(
        train_states, train_seed_ids, actions, plant_cfg["evaluation_horizon"], plant_cfg["dt"],
        data_cfg["training_rollout_observation_interval"], "train",
    )
    oof = {"trajectory": [], "learned_field": []}
    for fit_idx, validation_idx in seed_block_folds(train_seed_ids, config["analysis"]["seed_block_folds"]):
        fit_table, validation_table = train_table.subset(np.isin(np.arange(len(train_states)), fit_idx)), train_table.subset(np.isin(np.arange(len(train_states)), validation_idx))
        trajectory, field = _fit_pair(fit_table, target, config)
        fold_records = evaluate_table(trajectory, field, validation_table, target, config["actions"]["primary_amplitude"], config["objective"]["success_delta_threshold"])
        for carrier in oof:
            oof[carrier].extend(fold_records[carrier])
    trajectory, field = _fit_pair(train_table, target, config)
    test_states, test_seed_ids = generate_decision_states(
        _seed_range(data_cfg["test_seeds"]), data_cfg["initial_state_bounds"], data_cfg["burn_in"],
        data_cfg["sampling_duration"], data_cfg["sample_interval"], plant_cfg["dt"], registered, True,
    )
    test_table = generate_shared_rollouts(
        test_states, test_seed_ids, actions, plant_cfg["evaluation_horizon"], plant_cfg["dt"],
        data_cfg["training_rollout_observation_interval"], "test",
    )
    test_records = evaluate_table(trajectory, field, test_table, target, config["actions"]["primary_amplitude"], config["objective"]["success_delta_threshold"])
    results = {"config_id": config["config_id"], "carriers": {}}
    for carrier in ("trajectory", "learned_field"):
        train_x, train_y, _ = stack_records(oof[carrier]); test_x, test_y, _ = stack_records(test_records[carrier])
        results["carriers"][carrier] = compare_baseline_coherence(train_x, train_y, test_x, test_y, coherence_column=train_x.shape[1] - 1, c=config["analysis"]["logistic_l2_C"])
    output_dir = Path(output_dir); output_dir.mkdir(parents=True, exist_ok=False)
    (output_dir / "primary_metrics.json").write_text(json.dumps(results, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return results
