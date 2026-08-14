from __future__ import annotations

import copy
import hashlib
import sys
import unittest
from pathlib import Path


PACKAGE = Path(__file__).resolve().parents[1]
WORKSPACE = PACKAGE.parent
sys.path.insert(0, str(WORKSPACE / "EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2" / "src"))
sys.path.insert(0, str(PACKAGE / "src"))

import registered_evidence_generator as generator
import payload_producer as producer
import synthetic_v1_outputs as synthetic


class PayloadProducerIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = synthetic.source()
        cls.first = producer.produce_payload(cls.source, verify_distribution_tree=True)
        cls.second = producer.produce_payload(synthetic.source(), verify_distribution_tree=True)

    def test_01_complete_generator_r2_payload(self):
        generator.validate_payload(self.first.payload, self.source.target.generator_target())
        self.assertEqual(len(self.first.payload["observed_rows"]), 3000)
        self.assertEqual(tuple(self.first.payload["null_worlds"]), generator.NULL_FAMILIES)
        self.assertEqual(len(self.first.payload["sensitivities"]), 12)

    def test_02_deterministic_canonical_bytes(self):
        self.assertEqual(self.first.canonical_bytes, self.second.canonical_bytes)
        self.assertEqual(self.first.sha256, self.second.sha256)
        self.assertEqual(self.first.sha256, hashlib.sha256(self.first.canonical_bytes).hexdigest())
        generator.validate_canonical_bytes(self.first.payload, self.first.canonical_bytes)

    def test_03_physical_seed_state_signal_score_support_and_outcomes(self):
        row = self.first.payload["observed_rows"][0]
        self.assertEqual(row["physical_seed_id"], 5000)
        self.assertEqual(row["scientific_row_key"], "TRAIN_OOF.5000.0")
        self.assertEqual(row["state_signal"], generator.state_signal(row["state"], self.source.target.generator_target()))
        self.assertEqual(row["T_scores"], [-5.0, -4.0, -3.0, -2.0, -1.0])
        self.assertEqual(row["F_scores"], [-4.0, -4.0, -3.0, -2.0, -1.0])
        self.assertEqual(row["T_support_distance"], 0.1)
        self.assertEqual(row["F_support_distance"], 0.2)
        self.assertEqual(row["action_success"], [0, 1, 0, 1, 0])

    def test_04_family_specific_namespaces_preserved(self):
        worlds = self.first.payload["null_worlds"]
        self.assertEqual(worlds["N3"][0]["rng_namespace"][-1], "ROW=TEST.6000.0")
        self.assertEqual(worlds["N4_T"][0]["rng_namespace"][-1], "STRATUM=Q0;M000;D0")
        self.assertEqual(worlds["N4_F"][0]["rng_namespace"][-1], "STRATUM=Q0;M000;D0")
        self.assertFalse(any(type(item) is int for item in worlds["N4_T"][0]["rng_namespace"][3:]))

    def test_05_bootstrap_n5_sensitivities_and_provenance_complete(self):
        payload = self.first.payload
        self.assertEqual(payload["bootstrap"]["replicate_ids"], list(range(500)))
        self.assertEqual(payload["bootstrap"]["physical_seed_ids"], list(generator.TEST_SEEDS))
        self.assertEqual(len(payload["n5"]["SYNTH"]["transforms"]), 12)
        self.assertEqual(len(payload["n5"]["RUN"]["transforms"]), 12)
        self.assertEqual(payload["sensitivities"][8]["variant_train_seed_ids"], list(generator.TRAIN_SEEDS[:15]))
        self.assertEqual(payload["sensitivities"][9]["variant_train_seed_ids"], list(generator.TRAIN_SEEDS[15:]))
        self.assertEqual(len(payload["provenance"]), len(generator.PROVENANCE_SECTIONS))

    def test_06_source_cost_binding_survives_adapter(self):
        attacked = copy.deepcopy(self.first.payload)
        attacked["observed_rows"][0]["T_scores"][0] += 1.0
        provenance = next(item for item in attacked["provenance"] if item["artifact_id"] == "OBSERVED_ROWS")
        provenance["sha256"] = generator.canonical_digest(attacked["observed_rows"])
        with self.assertRaises(generator.ContractViolation):
            generator.validate_payload(attacked, self.source.target.generator_target())

    def test_07_no_registered_production_surface(self):
        self.assertFalse(hasattr(producer, "generate_decision_states"))
        self.assertFalse(hasattr(producer, "run_registered_pipeline"))
        self.assertFalse(hasattr(producer, "atomic_write_new"))
        self.assertNotIn("execution_identity", self.first.payload)
        self.assertNotIn("authorization", self.first.payload)


if __name__ == "__main__":
    unittest.main()
