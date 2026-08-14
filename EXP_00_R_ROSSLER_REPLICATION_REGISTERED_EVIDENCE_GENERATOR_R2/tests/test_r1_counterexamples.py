from __future__ import annotations

import copy
import json
import sys
import unittest
from pathlib import Path

PACKAGE = Path(__file__).resolve().parents[1]
WORKSPACE = PACKAGE.parent
sys.path.insert(0, str(PACKAGE / "src"))

import registered_evidence_generator as g
import test_registered_evidence_generator as fixture


def make_payload():
    rows = fixture.rows_for()
    return g.fixture_payload(
        rows=rows,
        target=fixture.TARGET,
        null_worlds=fixture.null_worlds(),
        bootstrap={
            "cluster_unit": "PHYSICAL_TEST_SEED", "seed": 20260808,
            "replicate_ids": list(range(500)), "physical_seed_ids": list(g.TEST_SEEDS),
        },
        n5=fixture.n5_fixture(rows),
        sensitivities=fixture.sensitivities(rows),
        authority_binding={"a5xef_root_sha256": "1" * 64, "a5xef_review_tree_sha256": "2" * 64},
        primary_config={"frozen": True}, model_spec={"frozen": True},
        support_threshold=0.9,
    )


def refresh(payload, *sections):
    for section in sections:
        record = next(item for item in payload["provenance"] if item["artifact_id"] == section.upper())
        record["sha256"] = g.canonical_digest(payload[section])


class IndependentCounterexampleClosureTests(unittest.TestCase):
    def test_wrong_score_with_complete_reprovenance_rejected(self):
        payload = make_payload()
        payload["observed_rows"][0]["T_scores"][0] += 123.0
        refresh(payload, "observed_rows", "sensitivities")
        with self.assertRaises(g.ContractViolation):
            g.validate_payload(payload, fixture.TARGET)

    def test_nonphysical_null_rng_id_rejected(self):
        payload = make_payload()
        payload["null_worlds"]["N1"][0]["rng_namespace"][-1] = 9999
        refresh(payload, "null_worlds")
        with self.assertRaises(g.ContractViolation):
            g.validate_payload(payload, fixture.TARGET)

    def test_invalid_n5_transform_witness_rejected(self):
        payload = make_payload()
        comparison = payload["n5"]["RUN"]["transforms"][0]["comparisons"][1]
        comparison["transformed_terminal_states"] = [[999.0, 999.0, 999.0] for _ in range(5)]
        refresh(payload, "n5")
        with self.assertRaises(g.ContractViolation):
            g.validate_payload(payload, fixture.TARGET)

    def test_wrong_sensitivity_score_with_complete_reprovenance_rejected(self):
        payload = make_payload()
        payload["sensitivities"][0]["variant_rows"] = list(payload["sensitivities"][0]["variant_rows"])
        payload["sensitivities"][0]["variant_rows"][0] = copy.deepcopy(payload["sensitivities"][0]["variant_rows"][0])
        payload["sensitivities"][0]["variant_rows"][0]["F_scores"][0] -= 777.0
        refresh(payload, "sensitivities")
        with self.assertRaises(g.ContractViolation):
            g.validate_payload(payload, fixture.TARGET)

    def test_mutated_material_g9_authority_fields_rejected(self):
        authority = json.loads((WORKSPACE / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1" / "REGISTERED_RUNTIME_AUTHORITY.json").read_text())
        authority["platform"]["platform"] = "WRONG"
        authority["platform"]["numeric_backend_linkage"] = "WRONG"
        authority["numpy"]["core_extension"]["sha256"] = "0" * 64
        with self.assertRaises(g.ContractViolation):
            g.validate_runtime(authority, verify_distribution_tree=True)


if __name__ == "__main__":
    unittest.main()
