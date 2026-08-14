import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import synthetic_raw_bundle as raw
import derive_a5xe_reference as ref
import derive_a5xe_independent as alt


def invalid(bundle):
    result = ref.derive(bundle)
    return result["execution_state"] != "VALID_SCIENTIFIC_RESULT" and result["classification"] is None


class AdversarialMutationTests(unittest.TestCase):
    def setUp(self):
        self.bundle = raw.build_bundle()

    def mutate(self, fn):
        value = copy.deepcopy(self.bundle); fn(value)
        self.assertTrue(invalid(value))

    def test_01_summary_only_is_rejected(self): self.assertTrue(invalid(raw.summary_only_attack_bundle()))
    def test_02_producer_P1_is_rejected(self): self.mutate(lambda b: b.update(P1=True))
    def test_03_producer_classification_is_rejected(self): self.mutate(lambda b: b.update(classification="REPLICATED"))
    def test_04_wrong_schema_is_rejected(self): self.mutate(lambda b: b.update(schema="SUMMARY"))
    def test_05_registered_flag_is_rejected(self): self.mutate(lambda b: b["authority_binding"].update(registered_data=True))
    def test_06_seed_identity_is_rejected(self): self.mutate(lambda b: b["identity"]["seed_ids"].__setitem__(0, "R_REGISTERED"))
    def test_07_row_removed_is_rejected(self): self.mutate(lambda b: b["observed_rows"].pop())
    def test_08_row_duplicated_is_rejected(self): self.mutate(lambda b: b["observed_rows"].append(copy.deepcopy(b["observed_rows"][0])))
    def test_09_row_id_mutation_is_rejected(self): self.mutate(lambda b: b["observed_rows"][0].update(row_id="FOREIGN"))
    def test_10_rank_mutation_is_rejected(self): self.mutate(lambda b: b["observed_rows"][0].update(T_rank=[0, 0, 1, 2, 3]))
    def test_11_proposal_rank_mismatch_is_rejected(self): self.mutate(lambda b: b["observed_rows"][0].update(T_proposed_action=999))
    def test_12_outcome_vector_mutation_is_rejected(self): self.mutate(lambda b: b["observed_rows"][0].update(action_success=[1]))
    def test_13_support_threshold_failure_is_invalid(self):
        def change(b):
            for row in b["observed_rows"]:
                if row["split"] == "TEST": row["T_supported"] = False
            self._refresh(b, "observed_rows")
        self.mutate(change)
    def test_14_joint_population_mismatch_is_rejected(self): self.mutate(lambda b: b["attribution"]["eligible_test_row_ids"].pop())
    def test_15_missing_null_family_is_rejected(self): self.mutate(lambda b: b["null_worlds"].pop("N3"))
    def test_16_extra_null_family_is_rejected(self): self.mutate(lambda b: b["null_worlds"].update(N9=[]))
    def test_17_null_199_repetitions_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N1"].pop())
    def test_18_null_201_repetitions_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N2"].append(copy.deepcopy(b["null_worlds"]["N2"][-1])))
    def test_19_null_world_producer_summary_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N1"][0].update(mean_coherence=.99))
    def test_20_n1_population_hash_mutation_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N1"][0].update(population_sha256="0"*64))
    def test_21_n2_unit_evidence_mutation_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N2"][0].update(support_rule="DROP"))
    def test_22_n3_donor_population_identity_mutation_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N3"][0].update(rng_contract_id="FOREIGN_DONOR_STREAM"))
    def test_23_n4_stratum_contract_mutation_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N4_T"][0].update(support_rule="REBIN_AFTER_SHUFFLE"))
    def test_24_bootstrap_499_is_rejected(self): self.mutate(lambda b: b["bootstrap"]["resamples"].pop())
    def test_25_bootstrap_cluster_unit_is_rejected(self): self.mutate(lambda b: b["bootstrap"].update(cluster_unit="ROW"))
    def test_26_bootstrap_multiplicity_is_rejected(self): self.mutate(lambda b: b["bootstrap"]["resamples"][0]["seed_multiplicities"].update(SYNTH_00=31))
    def test_27_n5_matrix_mutation_is_rejected(self): self.mutate(lambda b: b["n5"]["matrix_registry"][0][0].__setitem__(0, 2))
    def test_28_n5_query_mutation_is_rejected(self): self.mutate(lambda b: b["n5"]["SYNTH"]["transforms"][0]["query_inputs"][0]["transformed"].__setitem__(0, 999))
    def test_29_n5_rank_mutation_is_rejected(self): self.mutate(lambda b: b["n5"]["RUN"]["transforms"][0]["comparisons"][0].update(transformed_rank=[0, 0, 1, 2, 3]))
    def test_30_sensitivity_missing_is_rejected(self): self.mutate(lambda b: b["sensitivities"].pop())
    def test_31_sensitivity_seed_population_is_rejected(self): self.mutate(lambda b: b["sensitivities"][0]["contributing_seed_ids"].pop())
    def test_32_provenance_hash_mutation_is_rejected(self): self.mutate(lambda b: b["provenance_ledger"][0].update(sha256="0"*64))
    def test_33_provenance_parent_mutation_is_rejected(self): self.mutate(lambda b: b["provenance_ledger"][2].update(parent_ids=[]))

    def test_34_dominance_nonpositive_G_is_valid_false_not_invalid(self):
        rows = [{"seed_id": str(i), "loss0": [0.0], "loss1": [1.0]} for i in range(4)]
        self.assertEqual(ref.derive_dominance_rows(rows)["reason"], "NONPOSITIVE_G")
        self.assertFalse(ref.derive_dominance_rows(rows)["pass"])
        self.assertEqual(ref.derive_dominance_rows(rows), alt.dominance_decision(rows))

    def test_35_dominance_top_three_is_valid_false_not_invalid(self):
        rows = [{"seed_id": str(i), "loss0": [10.0 if i < 3 else 0.1], "loss1": [0.0]} for i in range(10)]
        self.assertEqual(ref.derive_dominance_rows(rows)["reason"], "DOMINATED")
        self.assertFalse(ref.derive_dominance_rows(rows)["pass"])
        self.assertEqual(ref.derive_dominance_rows(rows), alt.dominance_decision(rows))

    def test_36_malformed_dominance_is_typed_invalid(self):
        result = ref.derive_dominance_rows([])
        self.assertFalse(result["valid"]); self.assertFalse(result["pass"])

    def test_37_n5_synth_failure_blocks_release_as_implementation_failure(self):
        bundle = copy.deepcopy(self.bundle)
        bundle["n5"]["SYNTH"]["transforms"][0]["comparisons"][0]["transformed_rank"] = [4, 3, 2, 1, 0]
        self._refresh(bundle, "n5")
        result = ref.derive(bundle)
        self.assertEqual(result["execution_state"], "IMPLEMENTATION_FAILURE")
        self.assertIsNone(result["classification"])

    def test_38_n5_run_failure_invalidates_science_without_classification(self):
        bundle = copy.deepcopy(self.bundle)
        bundle["n5"]["RUN"]["transforms"][0]["comparisons"][0]["transformed_rank"] = [4, 3, 2, 1, 0]
        self._refresh(bundle, "n5")
        result = ref.derive(bundle)
        self.assertEqual(result["execution_state"], "INVALID_EXPERIMENT")
        self.assertIsNone(result["classification"])

    def test_39_n1_rng_permutation_evidence_mutation_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N1"][0].update(rng_contract_id="INVERSE_PERMUTATION"))
    def test_40_global_rng_order_evidence_mutation_is_rejected(self): self.mutate(lambda b: b["null_worlds"]["N2"][1].update(rng_contract_id="SHARED_STREAM"))
    def test_41_bootstrap_coefficients_cannot_replace_resamples(self): self.mutate(lambda b: b["bootstrap"].update(resamples=None, coefficients=[1.0] * 500))
    def test_42_n5_transform_removal_is_rejected(self): self.mutate(lambda b: b["n5"]["SYNTH"]["transforms"].pop())
    def test_43_fake_tau_cannot_replace_ranks(self): self.mutate(lambda b: b["n5"]["RUN"]["transforms"][0]["comparisons"][0].update(original_rank=None, transformed_rank=None, tau=1.0))
    def test_44_attribution_row_membership_mutation_is_rejected(self): self.mutate(lambda b: b["attribution"]["eligible_test_row_ids"].__setitem__(0, "FOREIGN.ROW"))
    def test_45_p5_evidence_removal_is_rejected(self):
        def remove(b):
            b["sensitivities"] = [x for x in b["sensitivities"] if x["sensitivity_id"] != "ACTION_AMPLITUDE_0.25"]
        self.mutate(remove)
    def test_46_positive_summaries_cannot_rescue_support_invalidity(self):
        bundle = copy.deepcopy(self.bundle)
        for row in bundle["observed_rows"]:
            if row["split"] == "TEST": row["F_supported"] = False
        bundle.update(P1=True, P2=True, P3=True, P4=True, P5=True, classification="REPLICATED")
        self.assertTrue(invalid(bundle))
    def test_47_invalid_experiment_cannot_be_classified(self):
        observed = {"carriers": {c: {"coefficient": 1.0, "gain": 1.0} for c in raw.CARRIERS}}
        bootstrap = {c: [1.0] * 500 for c in raw.CARRIERS}
        self.assertEqual(ref.classify(False, {f"P{i}": True for i in range(1, 6)}, observed, bootstrap), "INVALID EXPERIMENT")

    def test_48_dominance_exact_half_passes(self):
        diffs = [1.0, 1.0, 1.0, .5, .5, .5, .5, .5, .5, 0.0]
        result = ref.derive_dominance_rows(self._loss_rows(diffs))
        self.assertTrue(result["valid"]); self.assertTrue(result["pass"])
        self.assertEqual(2 * result["D3"][0] * result["G"][1], result["G"][0] * result["D3"][1])

    def test_49_dominance_below_half_with_negative_contributions_passes(self):
        diffs = [1.0] * 8 + [-.25, -.25]
        result = ref.derive_dominance_rows(self._loss_rows(diffs))
        self.assertTrue(result["valid"]); self.assertTrue(result["pass"])

    def test_50_dominance_zero_is_scientific_false(self):
        result = ref.derive_dominance_rows(self._loss_rows([0.0] * 10))
        self.assertTrue(result["valid"]); self.assertFalse(result["pass"])
        self.assertEqual(result["reason"], "NONPOSITIVE_G")

    def _refresh(self, bundle, section):
        for item in bundle["provenance_ledger"]:
            if item["artifact_id"] == section.upper(): item["sha256"] = raw.digest(bundle[section])

    @staticmethod
    def _loss_rows(differences):
        return [{"seed_id": str(index), "loss0": [float(value)], "loss1": [0.0]} for index, value in enumerate(differences)]


if __name__ == "__main__":
    unittest.main()
