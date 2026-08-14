import copy,json,unittest
from pathlib import Path
import derive
P=Path(__file__).resolve().parent.parent/"fixtures/canonical_raw_artifact_bundle.json"
class Attacks(unittest.TestCase):
 @classmethod
 def setUpClass(c):c.b=json.loads(P.read_text())
 def reject(c,fn):
  b=copy.deepcopy(c.b);fn(b)
  with c.assertRaises((ValueError,KeyError,TypeError)):derive.end_to_end(b)
 def test_support_identity_attacks(c):
  cases=[lambda b:b["support"]["seed_blocks"][0].update(seed_id="FAKE"),lambda b:b["support"]["seed_blocks"][1].update(seed_id="SYNTH_00"),lambda b:b["support"]["fractions"].update(T_oos=-1),lambda b:b["support"]["seed_blocks"][0].update(joint_supported_rows=51),lambda b:b["support"]["seed_blocks"][1].update(row_id_prefix="S00")]
  for f in cases:
   with c.subTest(f=repr(f)):c.reject(f)
 def test_sensitivity_attacks(c):
  cases=[lambda b:b["sensitivities"]["records"][0].update(sensitivity_id="FAKE"),lambda b:b["sensitivities"]["records"][0].update(changed_factor_path="plant.dt"),lambda b:b["sensitivities"]["records"][0].update(sensitivity_value=.4),lambda b:b["sensitivities"]["records"][0].update(unchanged_config_sha256="0"*64),lambda b:b["sensitivities"]["provenance_binding"].update(v1_composite="FAKE"),lambda b:b["sensitivities"]["results"]["ACTION_AMPLITUDE_0.25"]["support"].update(joint=2.0)]
  for f in cases:
   with c.subTest(f=repr(f)):c.reject(f)
 def test_dominance_boundaries(c):
  self=c
  r=derive.derive_dominance(copy.deepcopy(c.b["seed_dominance"]));self.assertTrue(r["T"]["pass"])
  b=copy.deepcopy(c.b["seed_dominance"]);b["carriers"]["T"][0]["loss0"]=[.10000000000000002]
  with self.assertRaises(ValueError):derive.derive_dominance(b)
  b=copy.deepcopy(c.b["seed_dominance"])
  for q in ["T","F"]:
   for x in b["carriers"][q]:x["loss0"],x["loss1"]=[0.0],[.1]
  with self.assertRaises(ValueError):derive.derive_dominance(b)
 def test_null_attacks(c):
  cases=[lambda b:b["nulls"]["N1"]["metadata"].update(rule="INVERSE"),lambda b:b["nulls"]["N2"]["metadata"].update(unit="GLOBAL"),lambda b:b["nulls"]["N3"]["metadata"].update(rule="SAME_SEED"),lambda b:b["nulls"]["N3"]["metadata"].update(rule="DIFFERENT_SEED_COUNTERCLOCKWISE"),lambda b:b["nulls"]["N4_T"]["metadata"].update(rule="SELF_INCLUDED"),lambda b:b["nulls"].pop("N2"),lambda b:b["nulls"]["N2"]["metadata"]["replicate_ids"].update(stop_inclusive=198),lambda b:b["nulls"]["N2"]["metadata"].update(population="WRONG"),lambda b:b["nulls"]["N2"]["metadata"].update(action_order=[0,-.5,.5,-.25,.25]),lambda b:b["nulls"]["N2"]["metadata"].update(rng="WRONG_NAMESPACE_ORDER")]
  for f in cases:
   with c.subTest(f=repr(f)):c.reject(f)
 def test_n5_attacks(c):
  cases=[lambda b:b["n5"]["REGISTRY"].pop(),lambda b:b["n5"]["REGISTRY"].reverse(),lambda b:b["n5"]["SYNTH"]["metadata"].update(aggregation="MEAN"),lambda b:b["n5"]["RUN"]["metadata"].update(inverse_registration="NONE"),lambda b:b["n5"]["RUN"]["transforms"].pop()]
  for f in cases:
   with c.subTest(f=repr(f)):c.reject(f)
 def test_p4_p5_and_ceiling(c):
  c.reject(lambda b:b["attribution"].update(mandatory_report_only=[]))
  b=copy.deepcopy(c.b);b["sensitivities"]["results"]["ACTION_AMPLITUDE_0.25"]["carrier_results"]["T"]["gain"]=-.1;r=derive.end_to_end(b);c.assertFalse(r["P"]["P5"])
  c.assertEqual(derive.end_to_end(copy.deepcopy(c.b))["cross_system"],"PARTIAL CROSS-SYSTEM REPLICATION")
if __name__=="__main__":unittest.main()
