"""Generic raw schema and synthetic-only fixtures for A5XEF."""
from __future__ import annotations

import copy
import hashlib
import itertools
import json
import math
import re
from pathlib import Path

import numpy as np

ACTIONS = [-0.5, -0.25, 0.0, 0.25, 0.5]
SPLITS = ["TRAIN_OOF", "TEST"]
CARRIERS = ["T", "F"]
REPRESENTATIONS = ["TRAJECTORY", "LEARNED_FIELD"]
FAMILIES = ["N1", "N2", "N3", "N4_T", "N4_F"]
CONFIG_ID = "EXP00R-ROSSLER-2REP-XCTRL-H1-FROZEN-20260808-v1"
V1 = "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05"
ID_PATTERN = re.compile(r"^[A-Z][A-Z0-9_:-]{2,63}$")


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode()


def digest(value):
    return hashlib.sha256(canonical(value)).hexdigest()


def rank(scores):
    order = sorted(range(5), key=lambda i: (-float(scores[i]), i))
    result = [0] * 5
    for position, action in enumerate(order): result[action] = position
    return result


def tau(a, b):
    concordance = 0
    for left in range(5):
        for right in range(left + 1, 5):
            concordance += 1 if (a[left] - a[right]) * (b[left] - b[right]) > 0 else -1
    return concordance / 10.0


def signed_permutations():
    matrices = []
    for permutation in itertools.permutations(range(3)):
        for signs in itertools.product([-1, 1], repeat=3):
            q = np.zeros((3, 3), dtype=int)
            for row, column in enumerate(permutation): q[row, column] = signs[row]
            if round(float(np.linalg.det(q))) == 1: matrices.append(q.tolist())
    return sorted(matrices, key=lambda q: tuple(v for row in q for v in row))[:12]


def model_spec():
    return {
        "family": "STANDARDIZED_L2_LOGISTIC_NEWTON",
        "C": 1.0,
        "max_iter": 100,
        "tolerance": 1e-9,
        "linear_predictor_clip": 35.0,
        "probability_clip": [1e-15, 1 - 1e-15],
        "baseline_features": ["STATE_SIGNAL", "T_BEST", "T_MARGIN", "F_BEST", "F_MARGIN", "ACTION_MAGNITUDE", "ACTION_SIGN"],
        "augmented_feature": "COHERENCE",
        "standardization": "TRAIN_MEAN_POPULATION_STD_ZERO_TO_ONE",
        "intercept_penalized": False,
        "canonical_order": ["SPLIT", "SEED_REGISTRY_ORDER", "DECISION_INDEX"],
    }


SENSITIVITY_REGISTRY = [
    (0, "ACTION_AMPLITUDE_0.25", "actions.primary_amplitude", 0.5, 0.25, True),
    (1, "ACTION_AMPLITUDE_1.0", "actions.primary_amplitude", 0.5, 1.0, True),
    (2, "TRAJECTORY_NEIGHBORS_15", "representations.trajectory.neighbors", 25, 15, False),
    (3, "TRAJECTORY_NEIGHBORS_50", "representations.trajectory.neighbors", 25, 50, False),
    (4, "LEARNED_FIELD_NEIGHBORS_60", "representations.learned_field.neighbors", 100, 60, False),
    (5, "LEARNED_FIELD_NEIGHBORS_160", "representations.learned_field.neighbors", 100, 160, False),
    (6, "HORIZON_0.5", "plant.evaluation_horizon", 1.0, 0.5, False),
    (7, "HORIZON_1.5", "plant.evaluation_horizon", 1.0, 1.5, False),
    (8, "TRAINING_SEED_HALF_5000_5014", "data.train_seeds", "FROZEN_TRAIN_30", "FROZEN_TRAIN_HALF_A", False),
    (9, "TRAINING_SEED_HALF_5015_5029", "data.train_seeds", "FROZEN_TRAIN_30", "FROZEN_TRAIN_HALF_B", False),
    (10, "SUPPORT_QUANTILE_0.95", "support.threshold_quantile", 0.99, 0.95, False),
    (11, "SUPPORT_QUANTILE_0.995", "support.threshold_quantile", 0.99, 0.995, False),
]


def primary_config():
    return {
        "actions": {"primary_amplitude": 0.5},
        "representations": {"trajectory": {"neighbors": 25}, "learned_field": {"neighbors": 100}},
        "plant": {"evaluation_horizon": 1.0},
        "data": {"train_seeds": "FROZEN_TRAIN_30"},
        "support": {"threshold_quantile": 0.99},
    }


def patch_config(base, path, value):
    result = copy.deepcopy(base); keys = path.split("."); target = result
    for key in keys[:-1]: target = target[key]
    target[keys[-1]] = copy.deepcopy(value)
    return result


def without_path(base, path):
    result = copy.deepcopy(base); keys = path.split("."); target = result
    for key in keys[:-1]: target = target[key]
    del target[keys[-1]]
    return result


def seed_ids(namespace="SYNTH"):
    if not ID_PATTERN.fullmatch(namespace): raise ValueError("namespace")
    return [f"{namespace}_{index:02d}" for index in range(30)]


def raw_rows(namespace="SYNTH", variant=0):
    seeds = seed_ids(namespace); rows = []
    factor = 1.0 + ((variant % 5) - 2) * .015
    for split_index, split in enumerate(SPLITS):
        for seed_index, seed in enumerate(seeds):
            for index in range(50):
                g = seed_index * 50 + index
                signal = ((g % 13) - 6) / 6
                base = np.asarray([math.sin((g + a * 7) * .17) + .12 * a for a in range(5)])
                t_scores = (base + np.asarray([.15, -.04, .02, .08, -.09]) + .05 * signal) * factor
                f_scores = (base + np.asarray([-.06, .12, .01, -.02, .06]) - .03 * signal) / factor
                tr, fr = rank(t_scores.tolist()), rank(f_scores.tolist())
                coherence = (1 + tau(tr, fr)) / 2
                outcomes = []
                for action in range(5):
                    noise = ((g * 37 + action * 19 + split_index * 11 + variant * 3) % 101) / 100
                    probability = max(.01, min(.99, .12 + .58 * coherence + .13 * signal + (.16 if action in {tr.index(0), fr.index(0)} else -.08)))
                    outcomes.append(int(noise < probability))
                rows.append({
                    "row_id": f"{split}:{seed}:{index:02d}", "split": split, "seed_id": seed, "decision_index": index,
                    "state_id": f"STATE:{split}:{seed}:{index:02d}", "state": [math.cos(g*.1), math.sin(g*.1), signal], "state_signal": signal,
                    "T_scores": [float(x) for x in t_scores], "F_scores": [float(x) for x in f_scores],
                    "T_support_distance": .2 + ((g * 17 + variant) % 70) / 100,
                    "F_support_distance": .2 + ((g * 23 + variant) % 70) / 100,
                    "action_success": outcomes,
                })
    return rows


def n5_evidence(rows):
    query_ids = [row["row_id"] for row in rows if row["split"] == "TEST"][:20]
    by_id = {row["row_id"]: row for row in rows}; matrices = signed_permutations(); tiers = {}
    for tier in ["SYNTH", "RUN"]:
        transforms = []
        for transform_id, matrix in enumerate(matrices):
            q = np.asarray(matrix, dtype=float); comparisons = []; queries = []
            for query_id in query_ids:
                row = by_id[query_id]; original = np.asarray(row["state"]); transformed = q @ original
                queries.append({"query_id": query_id, "original": original.tolist(), "transformed": transformed.tolist()})
                for rep, key in [("TRAJECTORY", "T_scores"), ("LEARNED_FIELD", "F_scores")]:
                    ranking = rank(row[key]); terminal = (original + np.asarray([.1, -.05, .02])).tolist()
                    comparisons.append({"query_id": query_id, "representation": rep, "original_rank": ranking, "transformed_rank": list(ranking), "original_terminal": terminal, "transformed_terminal": (q @ np.asarray(terminal)).tolist()})
            transforms.append({"transform_id": transform_id, "Q": matrix, "query_inputs": queries, "comparisons": comparisons, "refits": ["TRAJECTORY", "LEARNED_FIELD"]})
        tiers[tier] = {"tier": f"N5_{tier}", "population_row_ids": query_ids, "population_sha256": digest(query_ids), "transforms": transforms}
    return {"matrix_registry": matrices, **tiers}


def build_bundle(namespace="SYNTH"):
    seeds = seed_ids(namespace); rows = raw_rows(namespace); config = primary_config(); spec = model_spec()
    sensitivities = []
    for ordinal, sid, path, primary, value, p5 in SENSITIVITY_REGISTRY:
        variant_config = patch_config(config, path, value)
        variant_actions = [-float(value), -float(value)/2, 0.0, float(value)/2, float(value)] if path == "actions.primary_amplitude" else list(ACTIONS)
        variant_support = {"T": float(value), "F": float(value)} if path == "support.threshold_quantile" else {"T": .99, "F": .99}
        variant_train_seeds = seeds[:15] if value == "FROZEN_TRAIN_HALF_A" else seeds[15:] if value == "FROZEN_TRAIN_HALF_B" else list(seeds)
        sensitivities.append({
            "ordinal": ordinal, "sensitivity_id": sid, "changed_factor_path": path, "primary_value": primary, "sensitivity_value": value, "p5": p5,
            "variant_config": variant_config, "variant_config_sha256": digest(variant_config), "unchanged_config_sha256": digest(without_path(config, path)),
            "contributing_seed_ids": seeds, "rows_per_seed": {seed: 50 for seed in seeds}, "required_outputs": ["T_COEFFICIENT", "T_GAIN", "F_COEFFICIENT", "F_GAIN", "SUPPORT", "PROVENANCE"],
            "variant_actions": variant_actions, "variant_support_thresholds": variant_support, "variant_train_seed_ids": variant_train_seeds,
            "variant_rows": raw_rows(namespace, ordinal + 1),
        })
    bundle = {
        "schema": "A5XEF_GENERIC_RAW_EVIDENCE_V1",
        "manifest": {"experiment_id": f"FIXTURE:{namespace}", "namespace": namespace, "seed_ids": seeds, "splits": SPLITS, "rows_per_seed_per_split": 50, "actions": ACTIONS, "support_thresholds": {"T": .99, "F": .99}, "config_id": CONFIG_ID, "registered": False},
        "primary_config": config, "model_spec": spec, "observed_rows": rows,
        "null_worlds": {family: [{"family": family, "replicate_id": rep, "population_source": "DERIVED_ORIGINAL_JOINT", "rng_contract": "A3_SHA256_PCG64"} for rep in range(200)] for family in FAMILIES},
        "bootstrap": {"cluster_unit": "TEST_SEED", "seed": 20260808, "replicate_ids": list(range(500))},
        "n5": n5_evidence(rows), "sensitivities": sensitivities,
        "authority_binding": {"v1_composite": V1, "registered_data": False, "fixture": True},
    }
    sections = ["manifest", "primary_config", "model_spec", "observed_rows", "null_worlds", "bootstrap", "n5", "sensitivities", "authority_binding"]
    bundle["provenance"] = [{"artifact_id": key.upper(), "sha256": digest(bundle[key]), "parents": [] if key in {"manifest", "authority_binding"} else ["MANIFEST", "AUTHORITY_BINDING"]} for key in sections]
    return bundle


def refresh_provenance(bundle, *sections):
    for section in sections:
        record = next(item for item in bundle["provenance"] if item["artifact_id"] == section.upper())
        record["sha256"] = digest(bundle[section])


def favorable_counterexample():
    bundle = build_bundle()
    for row in bundle["observed_rows"]:
        if row["split"] == "TEST" and row["seed_id"] in bundle["manifest"]["seed_ids"][:2]:
            row["T_support_distance"] = 2.; row["F_support_distance"] = 2.; row["action_success"] = [1]*5
    bundle["model_spec"]["max_iter"] = 12
    bundle["sensitivities"][0].update(changed_factor_path="wrong.path", primary_value="wrong", required_outputs=[])
    bundle["p4_controls_present"] = True
    bundle["mandatory_diagnostics"] = {"T_ONLY": {"pass": True}, "F_ONLY": {"pass": True}, "FUSION": {"pass": True}}
    refresh_provenance(bundle, "observed_rows", "model_spec", "sensitivities")
    return bundle
