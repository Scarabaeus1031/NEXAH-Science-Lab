import copy,hashlib,json,shutil,tempfile,unittest
from pathlib import Path
from contract_validation import validate_a5x_contract as v

class AttackTests(unittest.TestCase):
 @classmethod
 def setUpClass(c): c.base=v.read_machine()
 def reject_machine(c,fn):
    d=copy.deepcopy(c.base); fn(d)
    with c.assertRaises(Exception): v.validate_machine(d)
 def temp_lab(c):
    td=tempfile.TemporaryDirectory(); root=Path(td.name)
    for name in ["EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1","EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5","EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5X"]: shutil.copytree(v.LAB/name,root/name)
    return td,root
 def test_A_manifest_plus_prose(c):
    td,r=c.temp_lab()
    try:
      p=r/v.PKG.name/"A5X_EXECUTABLE_VALIDITY_PREDICATES.md"; p.write_text(p.read_text()+"\nALLOW LEAKAGE\n")
      root=r/v.PKG.name/"A5X_AUTHORITY_ROOT.json"; d=json.loads(root.read_text()); item=next(x for x in d["members"] if x["path"].endswith(p.name)); item["sha256"]=v.sha(p);item["bytes"]=p.stat().st_size;root.write_text(json.dumps(d))
      with c.assertRaises(Exception): v.verify_authority(r/v.PKG.name,r)
    finally:td.cleanup()
 def test_B_machine_plus_root(c):
    td,r=c.temp_lab()
    try:
      p=r/v.PKG.name/"A5X_MACHINE_READABLE_RULES.yaml"; d=json.loads(p.read_text());d["semantic_fingerprints"]["P5"]["both_carriers_gain"]=">=0";p.write_text(json.dumps(d))
      root=r/v.PKG.name/"A5X_AUTHORITY_ROOT.json"; q=json.loads(root.read_text()); item=next(x for x in q["members"] if x["path"].endswith(p.name));item["sha256"]=v.sha(p);item["bytes"]=p.stat().st_size;root.write_text(json.dumps(q))
      with c.assertRaises(Exception):v.verify_authority(r/v.PKG.name,r)
    finally:td.cleanup()
 def test_C_validator_plus_root(c):
    td,r=c.temp_lab()
    try:
      p=r/v.PKG.name/"contract_validation/validate_a5x_contract.py";p.write_text(p.read_text()+"\n# weakened\n")
      root=r/v.PKG.name/"A5X_AUTHORITY_ROOT.json";q=json.loads(root.read_text());item=next(x for x in q["members"] if x["path"].endswith("validate_a5x_contract.py"));item["sha256"]=v.normalized_validator_hash(p);item["bytes"]=p.stat().st_size;root.write_text(json.dumps(q))
      with c.assertRaises(Exception):v.verify_authority(r/v.PKG.name,r)
    finally:td.cleanup()
 def test_D_E_v1_source_config(c):
    for rel in ["src/exp00r/actions.py","EXP_00_R_FROZEN_CONFIG.yaml"]:
      td,r=c.temp_lab()
      try:
       p=r/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"/rel;p.write_text(p.read_text()+"\n ")
       with c.assertRaises(Exception):v.verify_authority(r/v.PKG.name,r)
      finally:td.cleanup()
 def test_F_G_H_root_metadata(c):
    for key,val in [("member_count",1),("hash_algorithm","MD5")]:
      td,r=c.temp_lab()
      try:
       p=r/v.PKG.name/"A5X_AUTHORITY_ROOT.json";d=json.loads(p.read_text());d[key]=val;p.write_text(json.dumps(d))
       with c.assertRaises(Exception):v.verify_authority(r/v.PKG.name,r)
      finally:td.cleanup()
    td,r=c.temp_lab()
    try:
      p=r/v.PKG.name/"A5X_AUTHORITY_ROOT.json";d=json.loads(p.read_text());d["members"][0]["role"]="WRONG";p.write_text(json.dumps(d))
      with c.assertRaises(Exception):v.verify_authority(r/v.PKG.name,r)
    finally:td.cleanup()
 def test_I_to_X_semantics(c):
    cases=[
     lambda d:d["semantic_fingerprints"]["N2"].update(unit="ACROSS_ROWS"),lambda d:d["semantic_fingerprints"]["N3"].update(donor="SAME_SEED_ALLOWED"),lambda d:d["semantic_fingerprints"]["N3"].update(binding="DONOR_GETS_RECIPIENT"),lambda d:d["semantic_fingerprints"]["rng"].update(serialization="AMBIGUOUS"),lambda d:d["semantic_fingerprints"]["ordering"].update(rows=["FILESYSTEM"]),lambda d:d["sensitivities"]["registry"][0].update(sensitivity_id="WRONG"),lambda d:d["sensitivities"]["registry"][0].update(primary_value=.4),lambda d:d["semantic_fingerprints"]["P5"].update(both_carriers_coefficient=">=0"),lambda d:d["semantic_fingerprints"]["P5"].update(both_carriers_gain=">=0"),lambda d:d["semantic_fingerprints"]["classifier"]["precedence"].__setitem__(1,"ANY_P=>REPLICATED"),lambda d:d["semantic_fingerprints"]["P4"].update(choice="SINGLE_VIEW_CRITICAL"),lambda d:d["semantic_fingerprints"]["classifier"].update(ceiling="CROSS-SYSTEM REPLICATION")]
    for fn in cases:
      with c.subTest(fn=repr(fn)):c.reject_machine(fn)
 def test_I_J_K_L_raw_gate_weakening(c):
    parity={r:{"training_seed_ids":list(range(5000,5030)),"raw_rollout_table_sha256":"a"*64,"observed_variables":["x","y","z"],"action_set":[-.5,-.25,0,.25,.5],"sampling_interval":.05,"evaluation_horizon":1.0,"target_sha256":"b"*64,"objective_sha256":"c"*64,"future_test_access":False,"analytic_field_access":False} for r in ["TRAJECTORY","LEARNED_FIELD"]}
    parity["LEARNED_FIELD"]["raw_rollout_table_sha256"]="d"*64;c.assertFalse(v.evaluate_gate("INFORMATION_PARITY",parity))
    c.assertFalse(v.evaluate_gate("NO_ANALYTIC_FIELD_LEAKAGE",{"learned_representation_imports":["exp00r.rossler"],"learned_representation_calls":[],"analytic_field_access_events":[]}))
    iso={"train_seed_ids":list(range(5000,5030)),"test_seed_ids":list(range(6000,6030)),"target_source":"TRAIN","standardizer_source":"TRAIN","support_source":"TRAIN","representation_fit_source":"TRAIN","model_fit_source":"TEST","metric_source":"TEST","events":[]};c.assertFalse(v.evaluate_gate("TRAIN_TEST_ISOLATION",iso))
    keys=["family","response","derivative_labels","terminal_objective_labels","imports_other","calls_other","shared_fitted_cache"]
    distinct={"TRAJECTORY":{"family":"finite_horizon_knn_outcome","response":"terminal_objective","derivative_labels":False,"terminal_objective_labels":True,"imports_other":False,"calls_other":False,"shared_fitted_cache":False},"LEARNED_FIELD":{"family":"finite_horizon_knn_outcome","response":"finite_difference_minus_Bu","derivative_labels":True,"terminal_objective_labels":False,"imports_other":False,"calls_other":False,"shared_fitted_cache":False}};c.assertFalse(v.evaluate_gate("REPRESENTATION_DISTINCTNESS",distinct))

if __name__=="__main__":unittest.main()
