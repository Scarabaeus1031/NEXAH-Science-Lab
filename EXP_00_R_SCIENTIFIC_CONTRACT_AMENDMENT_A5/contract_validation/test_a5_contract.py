import copy, json, shutil, tempfile, unittest
from pathlib import Path
from fractions import Fraction
from contract_validation.validate_a5_contract import (PKG, LAB, ContractError, cross_system, dominance, load_machine, recompute_v1, validate_all, validate_machine, validate_manifest)

class A5ContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls): cls.base=load_machine()
    def reject(self, mutate):
        d=copy.deepcopy(self.base); mutate(d)
        with self.assertRaises((ContractError,KeyError,TypeError,AssertionError)): validate_machine(d)
    def test_complete_contract(self): self.assertTrue(validate_all())
    def test_p4_role_mutation(self): self.reject(lambda d:d["p4_attribution"].update(classification_critical=d["p4_attribution"]["classification_critical"]+["TRAJECTORY_ONLY_OUTCOME_PREDICTION"]))
    def test_p4_gain_mutation(self): self.reject(lambda d:d["P"]["P4"].update(each_log_loss_gain=">=0"))
    def test_validity_predicate_mutation(self): self.reject(lambda d:d["validity"]["predicates"]["SUPPORT_VALIDITY"].update(all=[]))
    def test_parity_required_field_mutation(self): self.reject(lambda d:d["validity"]["predicates"]["INFORMATION_PARITY"]["required_fields"].remove("raw_training_table_sha256"))
    def test_distinctness_mutation(self): self.reject(lambda d:d["validity"]["predicates"]["REPRESENTATION_DISTINCTNESS"].update(all=["FAMILIES_EXACT_DISTINCT"]))
    def test_sensitivity_12_to_11(self): self.reject(lambda d:d["sensitivities"].update(exact_count=11))
    def test_sensitivity_output_schema(self): self.reject(lambda d:d["sensitivities"]["carrier_output_fields"].remove("heldout_log_loss_gain"))
    def test_dominance_type(self): self.reject(lambda d:d["seed_dominance"].update(canonical_arithmetic="FLOAT64"))
    def test_dominance_strict(self): self.reject(lambda d:d["seed_dominance"].update(**{"pass":{"all":["G>0","2*D3<G"]}}))
    def test_n3_direction(self): self.reject(lambda d:d["nulls"]["N3"].update(direction="DONOR_GETS_RECIPIENT"))
    def test_rng(self): self.reject(lambda d:d["rng_order"].update(generator="MT19937"))
    def test_n1_forward(self): self.reject(lambda d:d["nulls"]["N1"].update(map="pi_inverse"))
    def test_n4_distance(self): self.reject(lambda d:d["nulls"]["N4"].update(distance="SELF_INCLUSIVE"))
    def test_null_199(self): self.reject(lambda d:d["nulls"].update(repetitions_each=199))
    def test_null_201(self): self.reject(lambda d:d["nulls"].update(repetitions_each=201))
    def test_monte_carlo_boundary(self): self.reject(lambda d:d["monte_carlo"]["pass_iff"].update(k=5))
    def test_n5_count(self): self.reject(lambda d:d["N5"].update(count=11))
    def test_p5_semantics(self): self.reject(lambda d:d["P"]["P5"].update(bootstrap_interval="ALL_AMPLITUDES"))
    def test_classification_precedence(self): self.reject(lambda d:d["classification"]["precedence"].reverse())
    def test_lorenz_ceiling(self): self.reject(lambda d:d["cross_system"].update(ceiling="CROSS-SYSTEM REPLICATION"))
    def test_exact_dominance_boundaries(self):
        self.assertEqual(dominance([(i,0.1) for i in range(6)]),"PASS")
        self.assertEqual(dominance([(0,0.10000000000000002)]+[(i,0.1) for i in range(1,6)]),"FAIL")
        self.assertEqual(dominance([(0,0.0),(1,0.0),(2,0.0)]),"FAIL")
        self.assertEqual(dominance([(0,0.1),(1,0.1)]),"INVALID_EXPERIMENT")
    def test_classification_ceiling(self): self.assertEqual(cross_system(True,True,"REPLICATED"),"PARTIAL CROSS-SYSTEM REPLICATION")
    def test_a5_prose_manifest_mutation(self):
        with tempfile.TemporaryDirectory() as td:
            dst=Path(td)/"a5"; shutil.copytree(PKG,dst)
            p=dst/"A5_P4_ATTRIBUTION_CONTRACT.md"; p.write_text(p.read_text()+"\nP5 is optional\n")
            with self.assertRaises(ContractError): validate_manifest(dst)
    def test_v1_source_mutation(self):
        src=LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"
        with tempfile.TemporaryDirectory() as td:
            dst=Path(td)/src.name; shutil.copytree(src,dst)
            p=dst/"src/exp00r/actions.py"; p.write_text(p.read_text()+"\n# mutation\n")
            self.assertNotEqual(recompute_v1(dst),self.base["authority"]["v1_composite_sha256"])

if __name__=="__main__": unittest.main()
