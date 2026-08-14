from __future__ import annotations

import copy
import json
import sys
import unittest
from pathlib import Path

import numpy as np

PACKAGE = Path(__file__).resolve().parents[1]
WORKSPACE = PACKAGE.parent
sys.path.insert(0, str(PACKAGE / "src"))

import registered_evidence_generator as g


TARGET = g.TargetDefinition(
    mean=(0.0, 0.0, 0.0), population_sd=(2.0, 2.0, 2.0),
    center=(0.5, -0.25, 0.125), radius=0.25,
)


def target_record():
    return {
        "mean": list(TARGET.mean), "population_sd": list(TARGET.population_sd),
        "center": list(TARGET.center), "radius": TARGET.radius,
    }


def rows_for(actions=g.ACTIONS):
    rows = []
    for split, seeds in (("TRAIN_OOF", g.TRAIN_SEEDS), ("TEST", g.TEST_SEEDS)):
        for ordinal, seed in enumerate(seeds):
            for decision in range(50):
                base = ordinal * 50 + decision
                rows.append(g.build_row(
                    split=split, pair_ordinal=ordinal, physical_seed_id=seed,
                    decision_index=decision,
                    state=(base / 100.0, (base % 17) / 10.0, (base % 11) / 5.0),
                    target=TARGET,
                    trajectory_costs=(5.0, 4.0, 3.0, 2.0, 1.0),
                    learned_field_costs=(4.0, 4.0, 3.0, 2.0, 1.0),
                    t_support_distance=0.1 + (base % 10) / 100.0,
                    f_support_distance=0.2 + (base % 10) / 100.0,
                    delta_j=(0.02, -0.02, 0.0, -0.01, 0.03), actions=actions,
                ))
    return rows


def null_worlds():
    def namespace(family, replicate):
        if family == "N1":
            return [g.CONFIG_ID, "action_label", replicate, "REP=TRAJECTORY", f"SEED={g.TRAIN_SEEDS[replicate % 30]}"]
        if family == "N2":
            return [g.CONFIG_ID, "rank_within_seed", replicate, "SPLIT=TEST", f"SEED={g.TEST_SEEDS[replicate % 30]}"]
        if family == "N3":
            seed = g.TEST_SEEDS[replicate % 30]
            return [g.CONFIG_ID, "state_mismatch", replicate, "SPLIT=TEST", f"ROW=TEST.{seed}.{replicate % 50}"]
        carrier = "T" if family == "N4_T" else "F"
        return [g.CONFIG_ID, "support_matched", replicate, "SPLIT=TEST", f"CARRIER={carrier}", "STRATUM=Q0;M000;D0"]
    return {
        family: [
            {"family": family, "replicate_id": replicate, "rng_namespace": namespace(family, replicate)}
            for replicate in range(200)
        ]
        for family in g.NULL_FAMILIES
    }


def n5_fixture(rows):
    matrices = g.signed_permutation_registry()
    population = [row["row_id"] for row in rows if row["split"] == "TEST"][:20]
    terminal_states = [[0.1 * action, 0.2, 0.3] for action in range(5)]
    action_witnesses = [
        {
            "training_row_ids": [rows[0]["row_id"], rows[1]["row_id"]],
            "weights": [0.5, 0.5],
            "terminal_states": [[0.1, 0.2, 0.3], [0.3, 0.2, 0.1]],
        }
        for _ in range(5)
    ]
    result = {"matrix_registry": matrices}
    for tier in ("SYNTH", "RUN"):
        transforms = []
        for transform_id, matrix in enumerate(matrices):
            q = np.asarray(matrix, dtype=np.float64)
            transformed_terminal_states = [[float(value) for value in q @ np.asarray(state, dtype=np.float64)] for state in terminal_states]
            original_trajectory_scores = [
                float(sum(weight * (-(g.state_signal(state, TARGET) ** 2)) for weight, state in zip(witness["weights"], witness["terminal_states"])))
                for witness in action_witnesses
            ]
            transformed_action_witnesses = copy.deepcopy(action_witnesses)
            for witness in transformed_action_witnesses:
                witness["terminal_states"] = [[float(value) for value in q @ np.asarray(state, dtype=np.float64)] for state in witness["terminal_states"]]
            field_scores = [float(-(g.state_signal(state, TARGET) ** 2)) for state in terminal_states]
            comparisons = []
            for query in population:
                comparisons.append({
                    "query_id": query, "representation": "TRAJECTORY",
                    "original_scores": original_trajectory_scores,
                    "transformed_scores": list(original_trajectory_scores),
                    "original_action_witnesses": copy.deepcopy(action_witnesses),
                    "transformed_action_witnesses": copy.deepcopy(transformed_action_witnesses),
                })
                comparisons.append({
                    "query_id": query, "representation": "LEARNED_FIELD",
                    "original_scores": field_scores,
                    "transformed_scores": list(field_scores),
                    "original_terminal_states": copy.deepcopy(terminal_states),
                    "transformed_terminal_states": copy.deepcopy(transformed_terminal_states),
                })
            transforms.append({
                "transform_id": transform_id, "Q": matrix,
                "refits": list(g.REPRESENTATIONS), "comparisons": comparisons,
            })
        result[tier] = {
            "tier": f"N5_{tier}", "population_row_ids": population,
            "population_sha256": g.canonical_digest(population), "transforms": transforms,
        }
    return result


def sensitivities(primary_rows):
    records = []
    for ordinal, sid, path, value, p5 in g.SENSITIVITY_REGISTRY:
        amplitude = float(value) if ordinal in (0, 1) else 0.5
        train = list(g.TRAIN_SEEDS[:15]) if ordinal == 8 else list(g.TRAIN_SEEDS[15:]) if ordinal == 9 else list(g.TRAIN_SEEDS)
        records.append({
            "ordinal": ordinal, "sensitivity_id": sid,
            "changed_factor_path": path, "sensitivity_value": value, "p5": p5,
            "variant_train_seed_ids": train,
            "variant_actions": [-amplitude, -amplitude / 2.0, 0.0, amplitude / 2.0, amplitude],
            "variant_support_thresholds": {"T": 0.9, "F": 0.9},
            "target_definition": target_record(),
            "variant_rows": primary_rows,
        })
    return records


class GeneratorContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = rows_for()
        cls.n5 = n5_fixture(cls.rows)
        cls.sensitivities = sensitivities(cls.rows)
        cls.authority = {
            "a5xef_root_sha256": "1" * 64,
            "a5xef_review_tree_sha256": "2" * 64,
            "r1_tree_sha256": "726132aa49973e32f420554c44d0a0ab891f0582301535de0c4fa80d02c5bc33",
            "r1_review_tree_sha256": "5f7bdde15d9ca00e7212480562062f226010759ebccd2c8678162e68724fee35",
        }
        cls.payload = g.fixture_payload(
            rows=cls.rows, target=TARGET, null_worlds=null_worlds(),
            bootstrap={"cluster_unit": "PHYSICAL_TEST_SEED", "seed": 20260808,
                       "replicate_ids": list(range(500)), "physical_seed_ids": list(g.TEST_SEEDS)},
            n5=cls.n5, sensitivities=cls.sensitivities,
            authority_binding=cls.authority,
            primary_config={"frozen": True}, model_spec={"frozen": True},
            support_threshold=0.9,
        )

    def test_full_production_shape_conforms(self):
        g.validate_payload(self.payload, TARGET)
        self.assertEqual(len(self.payload["observed_rows"]), 3000)
        self.assertEqual(len(self.payload["sensitivities"]), 12)

    def test_g1_physical_seed_registry(self):
        registry = g.build_seed_registry()
        g.validate_seed_registry(registry)
        self.assertEqual([x["train_physical_seed_id"] for x in registry], list(g.TRAIN_SEEDS))
        self.assertEqual([x["test_physical_seed_id"] for x in registry], list(g.TEST_SEEDS))

    def test_pair_id_rejected_as_rng_identity(self):
        with self.assertRaises(g.ContractViolation):
            g.rng_identity("TEST", 6000, "ROSSLER_PAIR_00")

    def test_wrong_physical_seed_rejected(self):
        with self.assertRaises(g.ContractViolation):
            g.build_row(split="TEST", pair_ordinal=0, physical_seed_id=6001, decision_index=0,
                        state=(0, 0, 0), target=TARGET, trajectory_costs=(1, 2, 3, 4, 5),
                        learned_field_costs=(1, 2, 3, 4, 5), t_support_distance=0.1,
                        f_support_distance=0.1, delta_j=(0.1, -0.1, 0.0, 0.1, -0.1))

    def test_train_test_seed_confusion_rejected(self):
        with self.assertRaises(g.ContractViolation):
            g.rng_identity("TEST", 5000, "N1", 0)

    def test_state_signal_mapping_and_mutation(self):
        row = dict(self.rows[0]); row["state_signal"] += 1.0
        with self.assertRaises(g.ContractViolation):
            g.validate_row(row, TARGET)

    def test_complete_n5_and_incomplete_rejection(self):
        g.validate_n5(self.n5, TARGET)
        bad = copy.deepcopy(self.n5); bad["RUN"]["transforms"][0]["comparisons"][0]["original_action_witnesses"].pop()
        with self.assertRaises(g.ContractViolation):
            g.validate_n5(bad, TARGET)

    def test_score_direction_rejected(self):
        with self.assertRaises(g.ContractViolation):
            g.validate_score_export([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])

    def test_tie_rank_encoding_rejected(self):
        scores = [-1.0, -1.0, -2.0, -3.0, -4.0]
        self.assertEqual(g.weak_ranks(scores), [1.5, 1.5, 3.0, 4.0, 5.0])
        with self.assertRaises(g.ContractViolation):
            g.validate_rank_encoding(scores, [1, 2, 3, 4, 5])

    def test_support_export_rejected(self):
        row = dict(self.rows[0]); row["F_support_distance"] = 0.2
        with self.assertRaises(g.ContractViolation):
            g.validate_support_export(row, row["T_support_distance"], [0.1, 0.3, 0.2])

    def test_success_export_rejected(self):
        with self.assertRaises(g.ContractViolation):
            g.validate_success_export([0.02, -0.02, 0.0, -0.01, 0.03], [0, 0, 0, 1, 0])

    def test_sensitivity_omission_rejected(self):
        with self.assertRaises(g.ContractViolation):
            g.validate_sensitivities(self.sensitivities[:-1])

    def test_null_count_and_pair_rng_rejected(self):
        bad_count = null_worlds(); bad_count["N1"].pop()
        with self.assertRaises(g.ContractViolation): g.validate_null_worlds(bad_count, g.expected_physical_row_keys())
        bad_pair = null_worlds(); bad_pair["N1"][0]["rng_namespace"].append("ROSSLER_PAIR_00")
        with self.assertRaises(g.ContractViolation): g.validate_null_worlds(bad_pair, g.expected_physical_row_keys())

    def test_bootstrap_cluster_identity_rejected(self):
        bad = {"cluster_unit": "PAIR_ID", "seed": 20260808,
               "replicate_ids": list(range(500)), "physical_seed_ids": list(g.TEST_SEEDS)}
        with self.assertRaises(g.ContractViolation): g.validate_bootstrap(bad)

    def test_noncanonical_serialization_rejected(self):
        value = {"b": 1, "a": 2}
        g.validate_canonical_bytes(value, b'{"a":2,"b":1}\n')
        with self.assertRaises(g.ContractViolation):
            g.validate_canonical_bytes(value, b'{"b": 1, "a": 2}\n')

    def test_schema_invalid_row_rejected(self):
        payload = dict(self.payload)
        payload["observed_rows"] = list(self.rows)
        payload["observed_rows"][0] = dict(payload["observed_rows"][0])
        del payload["observed_rows"][0]["action_delta_j"]
        with self.assertRaises((g.ContractViolation, TypeError)):
            g.validate_payload(payload, TARGET)

    def test_authorization_cannot_be_self_granted(self):
        with self.assertRaises(g.ContractViolation):
            g.build_envelope(self.payload, None)

    def test_g9_exact_registered_runtime(self):
        authority_path = WORKSPACE / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1" / "REGISTERED_RUNTIME_AUTHORITY.json"
        authority = json.loads(authority_path.read_text())
        g.validate_runtime(authority, verify_distribution_tree=True)

    def test_wrong_and_historical_runtime_rejected(self):
        authority_path = WORKSPACE / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1" / "REGISTERED_RUNTIME_AUTHORITY.json"
        authority = json.loads(authority_path.read_text())
        bad = dict(authority); bad["runtime_id"] = "WRONG"
        with self.assertRaises(g.ContractViolation): g.validate_runtime(bad)
        historical = dict(authority); historical["runtime_id"] = g.HISTORICAL_RUNTIME_ID
        with self.assertRaises(g.ContractViolation): g.validate_runtime(historical)

    def test_no_scientific_summaries_emitted(self):
        forbidden = {"coherence", "carrier", "p1", "p2", "p3", "p4", "p5", "classification"}
        self.assertTrue(forbidden.isdisjoint(self.payload.keys()))


if __name__ == "__main__":
    unittest.main()
