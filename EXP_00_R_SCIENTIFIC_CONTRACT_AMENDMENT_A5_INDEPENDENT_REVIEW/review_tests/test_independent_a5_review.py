#!/usr/bin/env python3
"""Independent contract-only adversarial review; never imports EXP-00-R science."""
from __future__ import annotations
import copy, hashlib, importlib.util, json, shutil, tempfile, unittest
from fractions import Fraction
from pathlib import Path

LAB=Path(__file__).resolve().parents[2]
A5=LAB/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5"
V1=LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"
spec=importlib.util.spec_from_file_location("a5validator",A5/"contract_validation/validate_a5_contract.py")
v=importlib.util.module_from_spec(spec); spec.loader.exec_module(v)

def update_member(manifest, pkg, rel):
    p=pkg/rel
    for item in manifest["members"]:
        if item["path"]==rel:
            item["bytes"]=p.stat().st_size
            item["sha256"]=hashlib.sha256(p.read_bytes()).hexdigest()
            return
    raise KeyError(rel)

class IndependentA5Review(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base=json.loads((A5/"A5_MACHINE_READABLE_RULES.yaml").read_text())

    def semantic_accepts(self, fn):
        d=copy.deepcopy(self.base); fn(d)
        try: v.validate_machine(d); return True
        except Exception: return False

    def test_baseline(self): self.assertTrue(v.validate_all())

    def test_manifest_itself_is_not_sealed(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"a5"; shutil.copytree(A5,p)
            m=json.loads((p/"A5_PACKAGE_MANIFEST.json").read_text()); m["member_count"]=999; m["package"]="CONTRADICTORY_PACKAGE"
            (p/"A5_PACKAGE_MANIFEST.json").write_text(json.dumps(m))
            v.validate_manifest(p)  # unexpectedly accepted

    def test_manifest_role_mutation_is_not_detected(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"a5"; shutil.copytree(A5,p)
            m=json.loads((p/"A5_PACKAGE_MANIFEST.json").read_text()); m["members"][0]["role"]="UNSEALED"
            (p/"A5_PACKAGE_MANIFEST.json").write_text(json.dumps(m)); v.validate_manifest(p)

    def test_paired_prose_and_manifest_rewrite_is_accepted(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"a5"; shutil.copytree(A5,p); rel="A5_P4_ATTRIBUTION_CONTRACT.md"
            q=p/rel; q.write_text(q.read_text()+"\nP5 is optional.\n")
            m=json.loads((p/"A5_PACKAGE_MANIFEST.json").read_text()); update_member(m,p,rel)
            (p/"A5_PACKAGE_MANIFEST.json").write_text(json.dumps(m)); v.validate_manifest(p)

    def test_paired_validator_and_manifest_rewrite_is_accepted(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"a5"; shutil.copytree(A5,p); rel="contract_validation/validate_a5_contract.py"
            q=p/rel; q.write_text(q.read_text()+"\n# validator mutation accepted after manifest rewrite\n")
            m=json.loads((p/"A5_PACKAGE_MANIFEST.json").read_text()); update_member(m,p,rel)
            (p/"A5_PACKAGE_MANIFEST.json").write_text(json.dumps(m)); v.validate_manifest(p)

    def test_removal_and_unmanifested_contradiction_are_detected(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"a5"; shutil.copytree(A5,p); (p/"A5_P4_ATTRIBUTION_CONTRACT.md").unlink()
            with self.assertRaises(Exception): v.validate_manifest(p)
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"a5"; shutil.copytree(A5,p); (p/"CONTRADICTORY_OPERATIVE.md").write_text("P5 is optional")
            with self.assertRaises(Exception): v.validate_manifest(p)

    def test_v1_source_mutation_is_detected(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/"v1"; shutil.copytree(V1,p); q=p/"src/exp00r/actions.py"; q.write_text(q.read_text()+"\n# mutation\n")
            self.assertNotEqual(v.recompute_v1(p),v.EXPECTED_V1)

    def test_exact_dominance_independent_boundaries(self):
        def dec(vals):
            vals=[(s,x if isinstance(x,Fraction) else Fraction(float(x))) for s,x in vals]
            if len(vals)<3:return "INVALID"
            G=sum((x for _,x in vals),Fraction());
            if G<=0:return "FAIL"
            D3=sum((x for _,x in sorted(vals,key=lambda z:(-z[1],z[0]))[:3]),Fraction())
            return "PASS" if 2*D3<=G else "FAIL"
        self.assertEqual(dec([(i,.1) for i in range(6)]),"PASS")
        self.assertEqual(dec([(0,.10000000000000002)]+[(i,.1) for i in range(1,6)]),"FAIL")
        eps=Fraction(1,2**53)
        d_above=Fraction(1,2)+eps
        self.assertEqual(dec([(i,d_above/3) for i in range(3)]+[(i,(1-d_above)/3) for i in range(3,6)]),"FAIL")
        d_below=Fraction(1,2)-eps
        self.assertEqual(dec([(i,d_below/3) for i in range(3)]+[(i,(1-d_below)/4) for i in range(3,7)]),"PASS")
        self.assertEqual(dec([(0,.4),(1,.3),(2,-.1),(3,-.2)]),"FAIL")
        self.assertEqual(dec([(0,.2),(1,-.2),(2,0.0)]),"FAIL")
        self.assertEqual(dec([(0,.1),(1,.1)]),"INVALID")

    def test_semantic_mutation_detection_matrix(self):
        cases={
          "P4_role":(lambda d:d["p4_attribution"].update(classification_critical=["T_PRIMARY_CARRIER"]),False),
          "P4_gain":(lambda d:d["P"]["P4"].update(each_log_loss_gain=">=0"),False),
          "validity_token":(lambda d:d["validity"]["predicates"]["ANALYTIC_FIELD_LEAKAGE" if "ANALYTIC_FIELD_LEAKAGE" in d["validity"]["predicates"] else "NO_ANALYTIC_FIELD_LEAKAGE"].update(all=["ALLOW_ANALYTIC_FIELD"]),True),
          "information_parity_atom":(lambda d:d["validity"]["predicates"]["INFORMATION_PARITY"].update(all=["PARITY_ASSERTED"]),True),
          "distinctness":(lambda d:d["validity"]["predicates"]["REPRESENTATION_DISTINCTNESS"].update(all=["FAMILIES_SAME"]),False),
          "train_test_isolation":(lambda d:d["validity"]["predicates"]["TRAIN_TEST_ISOLATION"].update(all=["ALLOW_TEST_IN_FIT"]),True),
          "sensitivity_count":(lambda d:d["sensitivities"].update(exact_count=11),False),
          "sensitivity_identity":(lambda d:d["sensitivities"]["registry"][2].update(path="trajectory.neighbors_WRONG",value=16),True),
          "sensitivity_schema":(lambda d:d["sensitivities"]["carrier_output_fields"].remove("heldout_log_loss_gain"),False),
          "dominance_arithmetic":(lambda d:d["seed_dominance"].update(canonical_arithmetic="FLOAT64"),False),
          "dominance_boundary":(lambda d:d["seed_dominance"].update(**{"pass":{"all":["G>0","2*D3<G"]}}),False),
          "N1_direction":(lambda d:d["nulls"]["N1"].update(map="inverse"),False),
          "N2_unit":(lambda d:d["nulls"]["N2"].update(randomized="ACROSS_ALL_ROWS"),True),
          "N3_donor":(lambda d:d["nulls"]["N3"].update(donor_filter="SAME_SEED_ALLOWED"),True),
          "N3_bin_binding":(lambda d:d["bindings"]["A4"]["exact_fields"].remove("binning"),True),
          "N4_distance":(lambda d:d["nulls"]["N4"].update(distance="SELF_INCLUDED"),False),
          "N4_merge_binding":(lambda d:d["bindings"]["A4"]["exact_fields"].remove("ordering"),True),
          "RNG_algorithm":(lambda d:d["rng_order"].update(generator="MT19937"),False),
          "RNG_namespace":(lambda d:d["rng_order"].update(payload="AMBIGUOUS_CONCAT"),True),
          "row_order":(lambda d:d["rng_order"].update(canonical_rows=["FILESYSTEM_ORDER"]),True),
          "null_199":(lambda d:d["nulls"].update(repetitions_each=199),False),
          "null_201":(lambda d:d["nulls"].update(repetitions_each=201),False),
          "MC_boundary":(lambda d:d["monte_carlo"]["pass_iff"].update(k=5),False),
          "N5_count":(lambda d:d["N5"].update(count=11),False),
          "N5_threshold":(lambda d:d["N5"].update(threshold={"operator":">=","value":.98}),False),
          "P5_coefficient":(lambda d:d["P"]["P5"].update(both_carriers_each_coefficient=">=0"),True),
          "classification_second_rule":(lambda d:d["classification"]["precedence"].__setitem__(1,"ELSE_IF_ANY_P=>REPLICATED"),True),
          "invalid_precedence":(lambda d:d["classification"]["precedence"].__setitem__(0,"INVALID_CAN_REPLICATE"),False),
          "Lorenz_ceiling":(lambda d:d["cross_system"].update(ceiling="CROSS-SYSTEM REPLICATION"),False)
        }
        for name,(fn,accepted) in cases.items():
            with self.subTest(name=name): self.assertEqual(self.semantic_accepts(fn),accepted)

if __name__=="__main__": unittest.main(verbosity=2)
