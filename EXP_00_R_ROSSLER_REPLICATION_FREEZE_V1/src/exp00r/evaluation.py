"""Turn two supported score vectors and plant rollouts into carrier records."""
from __future__ import annotations

import numpy as np

from .baselines import baseline_vector
from .coherence import pair_coherence
from .objective import binary_success, intervention_delta
from .ranking import top_action, weak_rank


def evaluate_table(trajectory, learned_field, table, target, amplitude: float, success_threshold: float) -> dict[str, list[dict]]:
    records = {"trajectory": [], "learned_field": []}
    actions = np.asarray(table.actions, dtype=float)
    zero_idx = int(np.flatnonzero(actions == 0.0)[0])
    for row, state in enumerate(table.decision_states):
        score_t = trajectory.predict_scores(state)
        score_f = learned_field.predict_scores(state)
        if score_t is None or score_f is None:
            continue
        rank_t, rank_f = weak_rank(score_t), weak_rank(score_f)
        coherence = pair_coherence(rank_t, rank_f)
        intercept, jacobian = learned_field.local_model(state)
        terminal_zero = table.paths[row, zero_idx, -1]
        for name, scores in (("trajectory", score_t), ("learned_field", score_f)):
            action = top_action(scores, actions, amplitude)
            action_idx = int(np.flatnonzero(actions == action)[0])
            delta = intervention_delta(target, table.paths[row, action_idx, -1], terminal_zero)
            baseline = baseline_vector(state, target, trajectory.support, intercept, jacobian, score_t, score_f, action)
            records[name].append({
                "seed": int(table.seed_ids[row]), "state_index": int(row), "action": float(action),
                "coherence": float(coherence), "delta_j": float(delta),
                "success": binary_success(delta, success_threshold),
                "features": np.concatenate([baseline, [coherence]]),
            })
    return records


def stack_records(records: list[dict]) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    if not records:
        raise ValueError("no supported records")
    return (
        np.vstack([row["features"] for row in records]),
        np.asarray([row["success"] for row in records], dtype=int),
        np.asarray([row["seed"] for row in records], dtype=int),
    )
