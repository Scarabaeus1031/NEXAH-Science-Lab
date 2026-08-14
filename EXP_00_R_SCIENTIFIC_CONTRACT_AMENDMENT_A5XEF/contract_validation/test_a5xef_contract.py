from __future__ import annotations

import copy
from fractions import Fraction
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parent))
import a5xef_schema as raw
import derive_a5xef_reference as ref
import derive_a5xef_independent as alt
import validate_a5xef_contract as contract


def invalid(bundle,derive=ref.derive):
    result=derive(bundle);return result["execution_state"]!="VALID_SCIENTIFIC_RESULT" and result["classification"] is None


class EndToEnd(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle=raw.build_bundle();cls.a=ref.derive(copy.deepcopy(cls.bundle));cls.b=alt.derive(copy.deepcopy(cls.bundle));cls.alternate=ref.derive(raw.build_bundle("ALT_FIXTURE"))

    def test_two_independent_paths_exact(self):self.assertEqual(self.a,self.b)
    def test_canonical_is_valid_science_without_forced_positive_label(self):self.assertEqual(self.a["execution_state"],"VALID_SCIENTIFIC_RESULT")
    def test_alternate_namespace_full_derivation(self):self.assertEqual(self.alternate["execution_state"],"VALID_SCIENTIFIC_RESULT")
    def test_population_hashes_are_derived(self):self.assertNotEqual(self.a["population_hashes"]["RAW"],self.a["population_hashes"]["JOINT_TEST"])
    def test_controls_consumed(self):
        for carrier in raw.CARRIERS:self.assertEqual(self.a["observed"]["carriers"][carrier]["design_columns"],raw.model_spec()["baseline_features"])
    def test_diagnostics_reconstructed(self):self.assertEqual(set(self.a["diagnostics"]),{"T_ONLY","F_ONLY","EQUAL_SCORE_FUSION"})
    def test_model_spec_consumed(self):self.assertEqual(self.a["model_spec_sha256"],raw.digest(raw.model_spec()))
    def test_all_sensitivities_reconstructed(self):self.assertEqual(len(self.a["sensitivities"]),12)


class AdversarialAThroughAH(unittest.TestCase):
    def setUp(self):self.bundle=raw.build_bundle()
    def refresh(self,*sections):raw.refresh_provenance(self.bundle,*sections)
    def test_A_unsupported_favorable_rows_do_not_leak(self):
        ids=set(self.bundle["manifest"]["seed_ids"][:2])
        for row in self.bundle["observed_rows"]:
            if row["split"]=="TEST" and row["seed_id"] in ids:row["T_support_distance"]=row["F_support_distance"]=2.;row["action_success"]=[1]*5
        self.refresh("observed_rows");rows=ref.derive_rows(self.bundle);groups,support=ref.populations(rows,self.bundle["manifest"]["seed_ids"])
        self.assertTrue(support["valid"]);self.assertTrue(all(row["seed_id"] not in ids for row in groups["JOINT_TEST"]));self.assertEqual(len(groups["JOINT_TEST"]),1400)
    def test_B_wrong_train_population(self):
        self.bundle["observed_rows"][0]["split"]="TEST";self.refresh("observed_rows");self.assertTrue(invalid(self.bundle))
    def test_C_wrong_test_population(self):
        self.bundle["observed_rows"][-1]["row_id"]="TEST:FOREIGN:00";self.refresh("observed_rows");self.assertTrue(invalid(self.bundle))
    def test_D_wrong_null_population(self):
        self.bundle["null_worlds"]["N1"][0]["population_source"]="ALL_ROWS";self.refresh("null_worlds");self.assertTrue(invalid(self.bundle))
    def test_E_wrong_bootstrap_population(self):
        self.bundle["bootstrap"]["cluster_unit"]="ROW";self.refresh("bootstrap");self.assertTrue(invalid(self.bundle))
    def test_F_missing_control_input(self):
        self.bundle["observed_rows"][0].pop("T_scores");self.refresh("observed_rows");self.assertTrue(invalid(self.bundle))
    def test_G_fabricated_control_field(self):
        self.bundle["observed_rows"][0]["T_best"]=999.;self.refresh("observed_rows");self.assertTrue(invalid(self.bundle))
    def test_H_missing_report_only_diagnostic_source(self):
        self.bundle["observed_rows"][0].pop("F_scores");self.refresh("observed_rows");self.assertTrue(invalid(self.bundle))
    def test_I_fake_diagnostic_summary(self):self.bundle["mandatory_diagnostics"]={"pass":True};self.assertTrue(invalid(self.bundle))
    def test_J_wrong_sensitivity_id(self):self.bundle["sensitivities"][0]["sensitivity_id"]="FOREIGN";self.refresh("sensitivities");self.assertTrue(invalid(self.bundle))
    def test_K_wrong_factor_path(self):self.bundle["sensitivities"][0]["changed_factor_path"]="wrong.path";self.refresh("sensitivities");self.assertTrue(invalid(self.bundle))
    def test_L_wrong_primary_value(self):self.bundle["sensitivities"][0]["primary_value"]=.7;self.refresh("sensitivities");self.assertTrue(invalid(self.bundle))
    def test_M_wrong_sensitivity_value(self):self.bundle["sensitivities"][0]["sensitivity_value"]=.7;self.refresh("sensitivities");self.assertTrue(invalid(self.bundle))
    def test_N_wrong_config_hash(self):self.bundle["sensitivities"][0]["variant_config_sha256"]="0"*64;self.refresh("sensitivities");self.assertTrue(invalid(self.bundle))
    def test_O_impossible_seed_count(self):self.bundle["sensitivities"][0]["contributing_seed_ids"].pop();self.refresh("sensitivities");self.assertTrue(invalid(self.bundle))
    def test_P_sensitivity_population_mismatch(self):self.bundle["sensitivities"][0]["rows_per_seed"].pop(next(iter(self.bundle["sensitivities"][0]["rows_per_seed"])));self.refresh("sensitivities");self.assertTrue(invalid(self.bundle))
    def test_Q_model_spec_mutation(self):self.bundle["model_spec"]["C"]=99.;self.refresh("model_spec");self.assertTrue(invalid(self.bundle))
    def test_R_recorded_12_actual_100_impossible(self):self.bundle["model_spec"]["max_iter"]=12;self.refresh("model_spec");self.assertTrue(invalid(self.bundle))
    def test_S_ignored_machine_field_rejected_semantically(self):
        machine=json.loads((contract.PKG/"A5XEF_MACHINE_READABLE_CONTRACT.yaml").read_text());machine["populations"]["primary_fit"]="ALL" 
        with self.assertRaises(contract.ContractError):contract.validate_machine_object(machine)
    def test_T_support_summary_injection(self):self.bundle["support_pass"]=True;self.assertTrue(invalid(self.bundle))
    def test_U_null_summary_injection(self):self.bundle["null_pass"]=True;self.assertTrue(invalid(self.bundle))
    def test_V_bootstrap_summary_injection(self):self.bundle["bootstrap_ci"]=[1,2];self.assertTrue(invalid(self.bundle))
    def test_W_n5_summary_injection(self):self.bundle["n5_pass"]=True;self.assertTrue(invalid(self.bundle))
    def test_X_P_injection(self):self.bundle["P1"]=True;self.assertTrue(invalid(self.bundle))
    def test_Y_classification_injection(self):self.bundle["classification"]="REPLICATED";self.assertTrue(invalid(self.bundle))
    def test_Z_A1_authority_member_present(self):
        ledger=json.loads((contract.PKG/"A5XEF_TRANSITIVE_AUTHORITY_LEDGER.json").read_text());self.assertTrue(any(x["path"].endswith("AMENDMENT_A1") for x in ledger["packages"]))
    def test_AA_mutated_upstream_operational_artifact(self):
        with tempfile.TemporaryDirectory() as directory:
            source=contract.LAB/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A1";target=Path(directory)/source.name;shutil.copytree(source,target);(target/"A1_MACHINE_READABLE_RULES.yaml").write_bytes((target/"A1_MACHINE_READABLE_RULES.yaml").read_bytes()+b"\nMUTATION")
            count,digest=contract.tree_digest(target);self.assertNotEqual(digest,"6b9e297491ff138277db2875ff5624a1e7e3e9572f1c636ce42913314f8f3ba5")
    def test_AA2_every_authority_package_mutation_changes_composite(self):
        ledger=json.loads((contract.PKG/"A5XEF_TRANSITIVE_AUTHORITY_LEDGER.json").read_text())
        for item in ledger["packages"]:
            with tempfile.TemporaryDirectory() as directory:
                source=contract.LAB/item["path"];target=Path(directory)/source.name;shutil.copytree(source,target,ignore=shutil.ignore_patterns("__pycache__"));member=next(x for x in sorted(target.rglob("*")) if x.is_file());member.write_bytes(member.read_bytes()+b"\nMUTATION")
                self.assertNotEqual(contract.tree_digest(target)[1],item["tree_sha256"],item["path"])
    def test_AB_coordinated_authority_rewrite(self):
        ledger=json.loads((contract.PKG/"A5XEF_TRANSITIVE_AUTHORITY_LEDGER.json").read_text());ledger["packages"][1]["tree_sha256"]="0"*64
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/"ledger.json";path.write_text(json.dumps(ledger));self.assertNotEqual(contract.sha(path),contract.EXPECTED_LEDGER)
    def test_AC_alternate_namespace_schema(self):
        bundle=raw.build_bundle("ALT_FIXTURE");rows=ref.derive_rows(bundle);self.assertTrue(all(x["seed_id"].startswith("ALT_FIXTURE_") for x in rows))
    def test_AD_malformed_generic_identity(self):self.bundle["manifest"]["seed_ids"][0]="bad id";self.refresh("manifest");self.assertTrue(invalid(self.bundle))
    def test_AE_N5_SYNTH_failure(self):
        self.bundle["n5"]["SYNTH"]["transforms"][0]["comparisons"][0]["transformed_rank"]=[4,3,2,1,0];self.refresh("n5");result=ref.derive(self.bundle);self.assertEqual((result["execution_state"],result["classification"]),("IMPLEMENTATION_FAILURE",None))
    def test_AF_N5_RUN_failure(self):
        self.bundle["n5"]["RUN"]["transforms"][0]["comparisons"][0]["transformed_rank"]=[4,3,2,1,0];self.refresh("n5");result=ref.derive(self.bundle);self.assertEqual((result["execution_state"],result["classification"]),("INVALID_EXPERIMENT",None))
    def test_AG_valid_negative_dominance(self):
        values=[(str(i),Fraction(-1,10)) for i in range(5)];a=ref.dominance_from_contributions(values);b=alt.dominance(values);self.assertEqual(a,b);self.assertTrue(a["valid"]);self.assertFalse(a["pass"])
    def test_AH_exact_half_dominance(self):
        amounts=[1,1,1,Fraction(1,2),Fraction(1,2),Fraction(1,2),Fraction(1,2),Fraction(1,2),Fraction(1,2),0];values=[(str(i),Fraction(x)) for i,x in enumerate(amounts)];a=ref.dominance_from_contributions(values);self.assertTrue(a["pass"]);self.assertEqual(a,alt.dominance(values))


class CentralRegression(unittest.TestCase):
    def test_exact_A5XE_counterexample_rejected_by_both(self):
        bundle=raw.favorable_counterexample()
        for derive in (ref.derive,alt.derive):
            result=derive(copy.deepcopy(bundle));self.assertNotEqual(result["execution_state"],"VALID_SCIENTIFIC_RESULT");self.assertIsNone(result["classification"])


if __name__=="__main__":unittest.main()
