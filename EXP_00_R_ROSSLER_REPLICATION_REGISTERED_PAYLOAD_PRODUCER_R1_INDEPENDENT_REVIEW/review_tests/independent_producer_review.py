from __future__ import annotations

import hashlib
import json
import pathlib
import sys
import unittest


WORKSPACE = pathlib.Path(__file__).resolve().parents[2]
PRODUCER_PACKAGE = WORKSPACE / "EXP_00_R_ROSSLER_REPLICATION_REGISTERED_PAYLOAD_PRODUCER_R1"
GENERATOR_PACKAGE = WORKSPACE / "EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2"
sys.path[:0] = [str(GENERATOR_PACKAGE / "src"), str(PRODUCER_PACKAGE / "src")]

import payload_producer as producer
import registered_evidence_generator as generator


TARGET = producer.FrozenTargetOutput(
    mean=(0.1, -0.2, 0.3),
    population_sd=(1.5, 2.0, 2.5),
    center=(0.25, -0.1, 0.2),
    radius=0.15,
)


def independent_rows() -> tuple[producer.FrozenRowOutput, ...]:
    result = []
    for split, seeds in (("TRAIN_OOF", range(5000, 5030)), ("TEST", range(6000, 6030))):
        for ordinal, seed in enumerate(seeds):
            for decision in range(50):
                marker = ordinal * 50 + decision
                result.append(producer.FrozenRowOutput(
                    split=split,
                    physical_seed_id=seed,
                    decision_index=decision,
                    state=(marker / 80.0, (marker % 13) / 7.0, -(marker % 9) / 6.0),
                    trajectory_costs=(2.5, 1.5, 0.5, -0.5, -1.5),
                    learned_field_costs=(3.0, 1.0, 0.0, -1.0, -2.0),
                    trajectory_support_distance=0.05 + (marker % 5) / 100.0,
                    learned_field_path_support_distances=(0.04, 0.12 + (marker % 5) / 100.0, 0.08),
                    action_delta_j=(0.04, -0.03, 0.0, -0.02, 0.01),
                ))
    return tuple(result)


def independent_null_descriptors() -> dict[str, tuple[tuple[object, ...], ...]]:
    result = {}
    for family in generator.NULL_FAMILIES:
        values = []
        for replicate in range(200):
            if family == "N1":
                item = (generator.CONFIG_ID, "action_label", replicate, "REP=LEARNED_FIELD", "SEED=5029")
            elif family == "N2":
                item = (generator.CONFIG_ID, "rank_within_seed", replicate, "SPLIT=TRAIN_OOF", "SEED=5029")
            elif family == "N3":
                item = (generator.CONFIG_ID, "state_mismatch", replicate, "SPLIT=TRAIN_OOF", "ROW=TRAIN_OOF.5029.49")
            else:
                carrier = "T" if family == "N4_T" else "F"
                item = (generator.CONFIG_ID, "support_matched", replicate, "SPLIT=TRAIN_OOF", f"CARRIER={carrier}", "STRATUM=Q4;M050;D7,8,9")
            values.append(item)
        result[family] = tuple(values)
    return result


def independent_n5() -> producer.FrozenN5TierOutput:
    population = tuple(f"TEST:ROSSLER_PAIR_01:{index:02d}" for index in range(20))
    field = {}
    trajectory = {}
    for query_index, query in enumerate(population):
        field[query] = tuple((0.05 * action, -0.1, 0.2 + query_index / 100.0) for action in range(5))
        trajectory[query] = tuple(
            producer.TrajectoryActionWitnessOutput(
                training_row_ids=("TRAIN_OOF:ROSSLER_PAIR_01:00", "TRAIN_OOF:ROSSLER_PAIR_01:01"),
                weights=(0.25, 0.75),
                terminal_states=(
                    (0.1 + action / 50.0, -0.2, 0.3),
                    (0.3, -0.1, 0.2 + action / 50.0),
                ),
            )
            for action in range(5)
        )
    return producer.FrozenN5TierOutput(
        population_row_ids=population,
        field_terminal_states=field,
        trajectory_action_witnesses=trajectory,
    )


def independent_source() -> producer.FrozenV1Outputs:
    rows = independent_rows()
    n5 = independent_n5()
    runtime = json.loads((
        WORKSPACE
        / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1"
        / "REGISTERED_RUNTIME_AUTHORITY.json"
    ).read_text())
    return producer.FrozenV1Outputs(
        target=TARGET,
        primary_rows=rows,
        null_namespace_descriptors=independent_null_descriptors(),
        n5_synth=n5,
        n5_run=n5,
        sensitivities=tuple(
            producer.FrozenSensitivityOutput(
                ordinal=ordinal,
                target=TARGET,
                rows=rows,
                trajectory_support_threshold=0.75,
                learned_field_support_threshold=0.8,
            )
            for ordinal in range(12)
        ),
        primary_config={"config_id": generator.CONFIG_ID, "source": "INDEPENDENT_SYNTHETIC", "frozen": True},
        model_spec={"source": "INDEPENDENT_SYNTHETIC", "frozen": True},
        authority_binding={
            "a5xef_root_sha256": "a" * 64,
            "a5xef_review_tree_sha256": "b" * 64,
            "generator_r2_tree_sha256": "82ff760b17fa99998eedad1d5c7c471f5c7fdfded2e2cb36dace8415a7c8b5d4",
        },
        primary_support_threshold=0.8,
        runtime_authority=runtime,
    )


class IndependentProducerConformance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source_a = independent_source()
        cls.source_b = independent_source()
        cls.result_a = producer.produce_payload(cls.source_a, verify_distribution_tree=True)
        cls.result_b = producer.produce_payload(cls.source_b, verify_distribution_tree=True)

    def test_01_payload_is_complete_and_generator_r2_accepts(self):
        payload = self.result_a.payload
        generator.validate_payload(payload, TARGET.generator_target())
        self.assertEqual(tuple(payload), (
            "schema", "manifest", "seed_registry", "primary_config", "model_spec",
            "observed_rows", "null_worlds", "bootstrap", "n5", "sensitivities",
            "authority_binding", "provenance",
        ))
        self.assertEqual(len(payload["observed_rows"]), 3000)
        self.assertEqual(len(payload["sensitivities"]), 12)

    def test_02_two_complete_builds_have_identical_bytes_and_hash(self):
        self.assertEqual(self.result_a.canonical_bytes, self.result_b.canonical_bytes)
        self.assertEqual(self.result_a.sha256, self.result_b.sha256)
        self.assertEqual(self.result_a.sha256, hashlib.sha256(self.result_a.canonical_bytes).hexdigest())
        generator.validate_canonical_bytes(self.result_a.payload, self.result_a.canonical_bytes)

    def test_03_identity_target_score_support_and_outcome_mappings(self):
        source = self.source_a.primary_rows[0]
        row = self.result_a.payload["observed_rows"][0]
        self.assertEqual((row["split"], row["physical_seed_id"], row["decision_index"]), ("TRAIN_OOF", 5000, 0))
        self.assertEqual(row["scientific_row_key"], "TRAIN_OOF.5000.0")
        self.assertEqual(row["pair_id"], "ROSSLER_PAIR_00")
        self.assertEqual(row["state_signal"], generator.state_signal(source.state, TARGET.generator_target()))
        self.assertEqual(row["T_scores"], generator.exported_scores(source.trajectory_costs))
        self.assertEqual(row["F_scores"], generator.exported_scores(source.learned_field_costs))
        self.assertEqual(row["T_support_distance"], source.trajectory_support_distance)
        self.assertEqual(row["F_support_distance"], max(source.learned_field_path_support_distances))
        self.assertEqual(row["action_delta_j"], list(source.action_delta_j))
        self.assertEqual(row["action_success"], [0, 1, 0, 1, 0])

    def test_04_null_namespaces_are_exact_pass_throughs(self):
        worlds = self.result_a.payload["null_worlds"]
        source = self.source_a.null_namespace_descriptors
        for family in generator.NULL_FAMILIES:
            for replicate in (0, 199):
                self.assertEqual(worlds[family][replicate]["rng_namespace"], list(source[family][replicate]))
                self.assertEqual(
                    generator.canonical_namespace_bytes(worlds[family][replicate]["rng_namespace"]),
                    generator.canonical_namespace_bytes(list(source[family][replicate])),
                )
        self.assertEqual(worlds["N3"][0]["rng_namespace"][-1], "ROW=TRAIN_OOF.5029.49")
        self.assertEqual(worlds["N4_T"][0]["rng_namespace"][-1], "STRATUM=Q4;M050;D7,8,9")

    def test_05_bootstrap_n5_sensitivity_runtime_and_provenance(self):
        payload = self.result_a.payload
        self.assertEqual(payload["bootstrap"]["physical_seed_ids"], list(range(6000, 6030)))
        self.assertEqual(payload["bootstrap"]["replicate_ids"], list(range(500)))
        generator.validate_n5(payload["n5"], TARGET.generator_target())
        generator.validate_sensitivities(payload["sensitivities"])
        self.assertEqual(payload["sensitivities"][8]["variant_train_seed_ids"], list(range(5000, 5015)))
        self.assertEqual(payload["sensitivities"][9]["variant_train_seed_ids"], list(range(5015, 5030)))
        self.assertEqual(len(payload["provenance"]), len(generator.PROVENANCE_SECTIONS))
        generator.validate_runtime(self.source_a.runtime_authority, verify_distribution_tree=True)

    def test_06_no_registered_execution_or_output_surface(self):
        forbidden = (
            "generate_decision_states", "generate_shared_rollouts", "run_registered_pipeline",
            "atomic_write_new", "generate_registered_bytes", "build_envelope",
        )
        for name in forbidden:
            self.assertFalse(hasattr(producer, name), name)
        self.assertNotIn("execution_identity", self.result_a.payload)
        self.assertNotIn("authorization", self.result_a.payload)
        self.assertNotIn("classification", self.result_a.payload)


if __name__ == "__main__":
    unittest.main(verbosity=2)
