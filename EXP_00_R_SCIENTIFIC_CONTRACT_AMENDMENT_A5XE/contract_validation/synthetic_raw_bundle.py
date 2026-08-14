"""Synthetic evidence fixtures only. No registered seed, trajectory, fit, or outcome access."""
from __future__ import annotations

import copy
import hashlib
import itertools
import json
import math
from pathlib import Path

import numpy as np

CONFIG_ID = "EXP00R-ROSSLER-2REP-XCTRL-H1-FROZEN-20260808-v1"
SEEDS = [f"SYNTH_{i:02d}" for i in range(30)]
SPLITS = ["TRAIN_OOF", "TEST"]
ACTIONS = [-0.5, -0.25, 0.0, 0.25, 0.5]
CARRIERS = ["T", "F"]
REPRESENTATIONS = ["TRAJECTORY", "LEARNED_FIELD"]
FAMILIES = ["N1", "N2", "N3", "N4_T", "N4_F"]
NULL_TOKENS = {"N1": "action_label", "N2": "rank_within_seed", "N3": "state_mismatch", "N4_T": "support_matched", "N4_F": "support_matched"}


def canonical(value) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()


def digest(value) -> str:
    return hashlib.sha256(canonical(value)).hexdigest()


def signed_permutations() -> list[list[list[int]]]:
    matrices = []
    even = {(0, 1, 2), (1, 2, 0), (2, 0, 1)}
    for permutation in itertools.permutations(range(3)):
        parity = 1 if permutation in even else -1
        for signs in itertools.product((-1, 1), repeat=3):
            if parity * signs[0] * signs[1] * signs[2] != 1:
                continue
            matrix = [[0, 0, 0] for _ in range(3)]
            for row, column in enumerate(permutation):
                matrix[row][column] = signs[row]
            matrices.append(matrix)
    return sorted(matrices, key=lambda matrix: tuple(x for row in matrix for x in row))[:12]


def rank_for(global_index: int, representation: str) -> list[int]:
    top_group = (global_index // 5) % 3
    if top_group == 0:
        top = 2
    elif top_group == 1:
        top = 1 if global_index % 2 == 0 else 3
    else:
        top = 0 if global_index % 2 == 0 else 4
    remaining = [index for index in range(5) if index != top]
    shift = (global_index // 15) % 4
    remaining = remaining[shift:] + remaining[:shift]
    if representation == "LEARNED_FIELD" and global_index % 5 == 0:
        alternate = (top + 1 + global_index % 3) % 5
        remaining = [index for index in range(5) if index != alternate]
        top = alternate
        if global_index % 10 == 0:
            remaining.reverse()
    ordering = [top] + remaining
    ranks = [0] * 5
    for rank, action_index in enumerate(ordering):
        ranks[action_index] = rank
    return ranks


def kendall(rank_a: list[int], rank_b: list[int]) -> float:
    concordant = discordant = 0
    for i in range(5):
        for j in range(i + 1, 5):
            product = (rank_a[i] - rank_a[j]) * (rank_b[i] - rank_b[j])
            concordant += product > 0
            discordant += product < 0
    return (concordant - discordant) / 10.0


def rows() -> list[dict]:
    output = []
    for split_index, split in enumerate(SPLITS):
        for seed_index, seed in enumerate(SEEDS):
            for decision_index in range(50):
                global_index = seed_index * 50 + decision_index
                t_rank = rank_for(global_index, "TRAJECTORY")
                f_rank = rank_for(global_index, "LEARNED_FIELD")
                coherence = (1.0 + kendall(t_rank, f_rank)) / 2.0
                signal = ((global_index % 11) - 5) / 5.0
                phase = -math.pi + 2 * math.pi * ((global_index % 48) + 0.5) / 48
                radius = 1.0 + (global_index % 17) / 10.0
                x, y = radius * math.cos(phase), radius * math.sin(phase)
                target_distance = 0.1 + ((global_index * 17) % 997) / 997.0
                nearest_distance = 0.01 + ((global_index * 31) % 991) / 991.0
                top_t, top_f = t_rank.index(0), f_rank.index(0)
                outcomes = []
                for action_index in range(5):
                    deterministic_noise = ((global_index * 37 + action_index * 19 + split_index * 11) % 101) / 100.0
                    selected_bonus = 0.22 if action_index in {top_t, top_f} else -0.08
                    probability = 0.08 + 0.62 * coherence + selected_bonus + 0.08 * signal
                    outcomes.append(int(deterministic_noise < max(0.01, min(0.99, probability))))
                output.append({
                    "row_id": f"{split}.{seed}.{decision_index:02d}",
                    "split": split,
                    "seed_id": seed,
                    "decision_index": decision_index,
                    "state": [x, y, 0.5 + (global_index % 13) / 13.0],
                    "state_signal": signal,
                    "target_distance": target_distance,
                    "nearest_training_distance": nearest_distance,
                    "T_supported": True,
                    "F_supported": True,
                    "T_rank": t_rank,
                    "F_rank": f_rank,
                    "T_proposed_action": ACTIONS[top_t],
                    "F_proposed_action": ACTIONS[top_f],
                    "action_success": outcomes,
                })
    return output


def bootstrap_evidence() -> list[dict]:
    generator = np.random.Generator(np.random.PCG64(20260808))
    records = []
    for replicate in range(500):
        sampled = generator.choice(np.asarray(SEEDS), size=30, replace=True)
        multiplicities = {seed: 0 for seed in SEEDS}
        for seed in sampled.tolist():
            multiplicities[seed] += 1
        records.append({"replicate_id": replicate, "seed_multiplicities": multiplicities})
    return records


def null_world_evidence(row_hash: str) -> dict:
    worlds = {}
    for family in FAMILIES:
        worlds[family] = [{
            "family": family,
            "replicate_id": replicate,
            "population_sha256": row_hash,
            "rng_contract_id": "A5XE_ACCEPTED_A3_SHA256_PCG64_OBJECT_STREAMS",
            "support_rule": "ORIGINAL_FIXED_JOINT_NO_DROP",
            "outcome_rule": "N1_NULL_TOP_PHYSICAL_OTHERWISE_OBSERVED_FIXED",
        } for replicate in range(200)]
    return worlds


def n5_evidence(base_rows: list[dict], row_hash: str) -> dict:
    matrices = signed_permutations()
    query_rows = [row for row in base_rows if row["split"] == "TEST"][:20]
    original_b = [1.0, 0.0, 0.0]
    target = [0.5, -0.25, 0.75]
    tiers = {}
    for tier_name in ("SYNTH", "RUN"):
        transforms = []
        for transform_id, matrix in enumerate(matrices):
            q = np.asarray(matrix, dtype=float)
            comparisons = []
            for representation, rank_key in (("TRAJECTORY", "T_rank"), ("LEARNED_FIELD", "F_rank")):
                for row in query_rows:
                    original_terminal = np.asarray(row["state"], dtype=float) + np.asarray([0.01, -0.02, 0.03])
                    transformed_terminal = q @ original_terminal
                    comparisons.append({
                        "query_id": row["row_id"],
                        "representation": representation,
                        "original_rank": row[rank_key],
                        "transformed_rank": row[rank_key],
                        "original_terminal": original_terminal.tolist(),
                        "transformed_terminal": transformed_terminal.tolist(),
                    })
            transforms.append({
                "transform_id": transform_id,
                "Q": matrix,
                "determinant": 1,
                "B_original": original_b,
                "B_transformed": (q @ np.asarray(original_b)).tolist(),
                "target_original": target,
                "target_transformed": (q @ np.asarray(target)).tolist(),
                "query_inputs": [{"query_id": row["row_id"], "original": row["state"], "transformed": (q @ np.asarray(row["state"])).tolist()} for row in query_rows],
                "refits": [
                    {"representation": "TRAJECTORY", "status": "COMPLETE", "training_parent_sha256": row_hash},
                    {"representation": "LEARNED_FIELD", "status": "COMPLETE", "training_parent_sha256": row_hash},
                ],
                "comparisons": comparisons,
            })
        tiers[tier_name] = {
            "tier": f"N5_{tier_name}",
            "population_row_ids": [row["row_id"] for row in query_rows],
            "population_sha256": digest([row["row_id"] for row in query_rows]),
            "transforms": transforms,
        }
    return {"matrix_registry": matrices, **tiers}


def sensitivity_registry() -> list[tuple]:
    return [
        ("ACTION_AMPLITUDE_0.25", "actions.primary_amplitude", 0.5, 0.25, True),
        ("ACTION_AMPLITUDE_1.0", "actions.primary_amplitude", 0.5, 1.0, True),
        ("TRAJECTORY_NEIGHBORS_15", "representations.trajectory.neighbors", 25, 15, False),
        ("TRAJECTORY_NEIGHBORS_50", "representations.trajectory.neighbors", 25, 50, False),
        ("LEARNED_FIELD_NEIGHBORS_60", "representations.learned_field.neighbors", 100, 60, False),
        ("LEARNED_FIELD_NEIGHBORS_160", "representations.learned_field.neighbors", 100, 160, False),
        ("HORIZON_0.5", "plant.evaluation_horizon", 1.0, 0.5, False),
        ("HORIZON_1.5", "plant.evaluation_horizon", 1.0, 1.5, False),
        ("TRAINING_SEED_HALF_5000_5014", "data.train_seeds", {"start": 5000, "stop_inclusive": 5029, "count": 30}, {"start": 5000, "stop_inclusive": 5014, "count": 15}, False),
        ("TRAINING_SEED_HALF_5015_5029", "data.train_seeds", {"start": 5000, "stop_inclusive": 5029, "count": 30}, {"start": 5015, "stop_inclusive": 5029, "count": 15}, False),
        ("SUPPORT_QUANTILE_0.95", "support.threshold_quantile", 0.99, 0.95, False),
        ("SUPPORT_QUANTILE_0.995", "support.threshold_quantile", 0.99, 0.995, False),
    ]


def primary_config() -> dict:
    path = Path(__file__).resolve().parents[2] / "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/EXP_00_R_FROZEN_CONFIG.yaml"
    return json.loads(path.read_text())


def get_path(value: dict, path: str):
    for key in path.split("."):
        value = value[key]
    return value


def set_path(value: dict, path: str, replacement):
    target = value
    keys = path.split(".")
    for key in keys[:-1]:
        target = target[key]
    target[keys[-1]] = copy.deepcopy(replacement)


def delete_path(value: dict, path: str) -> dict:
    result = copy.deepcopy(value)
    target = result
    keys = path.split(".")
    for key in keys[:-1]:
        target = target[key]
    del target[keys[-1]]
    return result


def sensitivity_evidence(base_rows: list[dict]) -> list[dict]:
    config = primary_config()
    test_rows = [row for row in base_rows if row["split"] == "TEST"]
    train_rows = [row for row in base_rows if row["split"] == "TRAIN_OOF"]
    test_ids = [row["row_id"] for row in test_rows]
    records = []
    for sensitivity_id, path, primary, alternate, p5 in sensitivity_registry():
        variant = copy.deepcopy(config)
        set_path(variant, path, alternate)
        factor = 1.0 + ((sum(sensitivity_id.encode()) % 5) - 2) * 0.01
        records.append({
            "sensitivity_id": sensitivity_id,
            "changed_factor_path": path,
            "primary_value": primary,
            "sensitivity_value": alternate,
            "p5": p5,
            "variant_config_sha256": digest(variant),
            "unchanged_config_sha256": digest(delete_path(config, path)),
            "contributing_seed_ids": SEEDS,
            "rows_per_seed": {seed: 50 for seed in SEEDS},
            "test_row_ids": test_ids,
            "train_coherence": [max(0.0, min(1.0, ((1 + kendall(row["T_rank"], row["F_rank"])) / 2) * factor)) for row in train_rows],
            "test_coherence": [max(0.0, min(1.0, ((1 + kendall(row["T_rank"], row["F_rank"])) / 2) * factor)) for row in test_rows],
            "required_outputs": ["T_COEFFICIENT", "T_GAIN", "F_COEFFICIENT", "F_GAIN", "SUPPORT", "PROVENANCE"],
        })
    return records


def build_bundle() -> dict:
    raw_rows = rows()
    row_hash = digest(raw_rows)
    bundle = {
        "schema": "A5XE_SYNTHETIC_RAW_EVIDENCE_V1",
        "identity": {
            "seed_ids": SEEDS,
            "splits": SPLITS,
            "actions": ACTIONS,
            "carriers": CARRIERS,
            "representations": REPRESENTATIONS,
            "rows_per_seed_per_split": 50,
        },
        "observed_rows": raw_rows,
        "model_spec": {
            "family": "L2_LOGISTIC_NEWTON_SYNTHETIC_CONFORMANCE",
            "l2_C": 1.0,
            "iterations": 12,
            "feature_order": ["INTERCEPT", "STATE_SIGNAL", "STANDARDIZED_COHERENCE"],
            "canonical_row_order": "SPLIT_SEED_DECISION_ASC",
        },
        "null_worlds": null_world_evidence(row_hash),
        "bootstrap": {
            "cluster_unit": "TEST_SEED",
            "seed": 20260808,
            "source_seed_ids": SEEDS,
            "source_row_sha256": digest([row["row_id"] for row in raw_rows if row["split"] == "TEST"]),
            "resamples": bootstrap_evidence(),
        },
        "n5": n5_evidence(raw_rows, row_hash),
        "attribution": {
            "eligible_test_row_ids": [row["row_id"] for row in raw_rows if row["split"] == "TEST"],
            "score_margin_controls": ["TRAJECTORY_BEST_SCORE", "TRAJECTORY_MARGIN", "LEARNED_FIELD_BEST_SCORE", "LEARNED_FIELD_MARGIN"],
            "mandatory_report_only": {
                "TRAJECTORY_ONLY_OUTCOME_PREDICTION": {"input_row_sha256": row_hash, "prediction_rule": "RAW_T_RANK_STATE_SIGNAL"},
                "LEARNED_FIELD_ONLY_OUTCOME_PREDICTION": {"input_row_sha256": row_hash, "prediction_rule": "RAW_F_RANK_STATE_SIGNAL"},
                "EQUAL_SCORE_FUSION_CARRIER": {"input_row_sha256": row_hash, "prediction_rule": "RAW_EQUAL_SCORE_FUSION"},
            },
        },
        "sensitivities": sensitivity_evidence(raw_rows),
        "authority_binding": {
            "v1_composite": "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05",
            "config_id": CONFIG_ID,
            "registered_data": False,
            "fixture_identity": "SYNTHETIC_ONLY",
        },
    }
    raw_sections = ["identity", "observed_rows", "model_spec", "null_worlds", "bootstrap", "n5", "attribution", "sensitivities", "authority_binding"]
    bundle["provenance_ledger"] = [
        {
            "artifact_id": section.upper(),
            "artifact_type": "RAW_EVIDENCE",
            "sha256": digest(bundle[section]),
            "parent_ids": [] if section in {"identity", "authority_binding"} else ["IDENTITY", "AUTHORITY_BINDING"],
        }
        for section in raw_sections
    ]
    return bundle


def summary_only_attack_bundle() -> dict:
    return {
        "schema": "A5XR_LIKE_SUMMARY_ONLY",
        "observed": {"mean_coherence": 0.9, "top_action_agreement": 0.8, "carrier_gains": {"T": 0.1, "F": 0.1}},
        "null_summaries": {family: [0.1] * 200 for family in FAMILIES},
        "bootstrap_coefficients": {carrier: [0.2] * 500 for carrier in CARRIERS},
        "n5_summary": {"pass": True, "minimum_tau": 1.0},
        "P1": True,
        "P2": True,
        "P3": True,
        "P4": True,
        "P5": True,
        "classification": "REPLICATED",
    }


if __name__ == "__main__":
    print(json.dumps({"canonical": build_bundle(), "summary_only_attack": summary_only_attack_bundle()}, sort_keys=True))
