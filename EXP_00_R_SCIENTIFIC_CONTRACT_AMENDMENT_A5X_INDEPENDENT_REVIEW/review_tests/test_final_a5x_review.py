import copy,importlib.util,json,math,shutil,tempfile,unittest
from pathlib import Path

LAB=Path(__file__).resolve().parents[2]; A5X=LAB/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5X"
sp=importlib.util.spec_from_file_location("v",A5X/"contract_validation/validate_a5x_contract.py");v=importlib.util.module_from_spec(sp);sp.loader.exec_module(v)

class FinalReview(unittest.TestCase):
 @classmethod
 def setUpClass(c):c.m=v.read_machine()
 def accepted_mutation(c,fn):
    d=copy.deepcopy(c.m);fn(d)
    try:v.validate_machine(d);return True
    except Exception:return False
 def test_authority_baseline(c):c.assertTrue(v.verify_authority());c.assertEqual(v.v1_composite(LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"),v.V1_EXPECTED)
 def test_semantic_fingerprint_omissions(c):
    mutations=[
      lambda d:d["semantic_fingerprints"]["N1"].update(map="INVERSE"),
      lambda d:d["semantic_fingerprints"]["N4"].update(distance="SELF_INCLUDED"),
      lambda d:d["semantic_fingerprints"]["N5"].update(count=11),
      lambda d:d["semantic_fingerprints"]["N5"].update(aggregation="MEAN"),
      lambda d:d["semantic_fingerprints"]["rng"].update(bits=32),
      lambda d:d["semantic_fingerprints"]["rng"].update(fresh=False),
      lambda d:d["semantic_fingerprints"]["ordering"].update(actions=[0,-.5,.5,-.25,.25]),
      lambda d:d["semantic_fingerprints"]["P4"].update(report_only=[]),
      lambda d:d["semantic_fingerprints"]["P5"].update(variants=[]),
      lambda d:d["semantic_fingerprints"]["P5"].update(interval="ALL_AMPLITUDES")]
    for fn in mutations:
      with c.subTest(fn=repr(fn)):c.assertTrue(c.accepted_mutation(fn))
 def test_support_accepts_nonregistered_seed_population(c):
    a={"T_oos_fraction":.1,"F_oos_fraction":.1,"joint_support_fraction":.8,"unsupported_treatment":"WHOLE_RANK_ABSTAIN_NO_IMPUTATION","joint_membership":"T_SUPPORTED_AND_F_SUPPORTED","qualifying_seed_row_counts":{f"NONREGISTERED_{i}":20 for i in range(20)}}
    c.assertTrue(v.evaluate_gate("SUPPORT_VALIDITY",a))
 def test_n5_accepts_no_matrix_or_transform_provenance(c):
    a=[{"matrix_id":i,"tau_values":[.99],"population_sha256":"p","transformed_abstention":False,"refit_error":False} for i in range(12)]
    c.assertTrue(v.evaluate_gate("N5_RUN",a,"p"))
 def test_nulls_accept_no_transform_or_required_statistic_identity(c):
    row=lambda i:{"replicate_id":i,"population_sha256":"p","statistics":{"anything":0.0},"retry":False}
    a={f:[row(i) for i in range(200)] for f in ["N1","N2","N3","N4_T","N4_F"]}
    c.assertTrue(v.evaluate_gate("NULL_FAMILY_COMPLETENESS",a,"p"))
 def test_per_seed_omits_dominance(c):
    a={q:[{"seed_id":s,"direction":0.0} for s in range(6000,6030)] for q in ["T","F"]}
    c.assertTrue(v.evaluate_gate("PER_SEED_ATTRIBUTION_COMPLETENESS",a))
 def test_p1p5_are_producer_booleans(c):
    a={"P1":True,"P2":True,"P3":True,"P4":True,"P5":True,"derived":True,"classification_after_all_gates":True}
    c.assertTrue(v.evaluate_gate("P1_P5_MECHANICALLY_COMPUTED",a))
    a.update(P1=False,P2=False,P3=False,P4=False,P5=False);c.assertTrue(v.evaluate_gate("P1_P5_MECHANICALLY_COMPUTED",a))
 def test_provenance_expected_registry_is_caller_supplied(c):
    e=["ARBITRARY"];a=[{"artifact_id":"ARBITRARY","sha256":"a"*64,"population_sha256":"b"*64,"config_sha256":"c"*64,"environment_sha256":"d"*64,"authority_root_sha256":"e"*64}]
    c.assertTrue(v.evaluate_gate("PROVENANCE_COMPLETE",a,e))
 def test_sensitivity_accepts_arbitrary_provenance_bindings(c):
    p=json.loads((LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/EXP_00_R_FROZEN_CONFIG.yaml").read_text());b={k:"a"*64 for k in c.m["sensitivities"]["required_provenance_fields"]};rows=[]
    for s in c.m["sensitivities"]["registry"]:
      q=copy.deepcopy(p);v.setpath(q,s["changed_factor_path"],s["sensitivity_value"])
      rows.append({"sensitivity_id":s["sensitivity_id"],"changed_factor_path":s["changed_factor_path"],"primary_value":s["primary_value"],"sensitivity_value":s["sensitivity_value"],"unchanged_config_digest":v.digest(v.delpath(p,s["changed_factor_path"])),"variant_config_digest":v.digest(q),"variant_config":q,"carriers":["T","F"],"carrier_results":{"T":{"standardized_coherence_coefficient":0.0,"heldout_log_loss_gain":0.0},"F":{"standardized_coherence_coefficient":0.0,"heldout_log_loss_gain":0.0}},"support":{"T_oos_fraction":-99.0,"F_oos_fraction":99.0,"joint_support_fraction":99.0,"contributing_seed_count":-1,"rows_per_seed":{}},"provenance":b})
    c.assertTrue(v.evaluate_sensitivities(rows,c.m,p,b))
 def test_root_detects_isolated_byte_changes(c):
    with tempfile.TemporaryDirectory() as td:
      r=Path(td)
      for n in ["EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1","EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5","EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5X"]:shutil.copytree(LAB/n,r/n)
      p=r/A5X.name/"A5X_MACHINE_READABLE_RULES.yaml";p.write_text(p.read_text()+" ")
      with c.assertRaises(Exception):v.verify_authority(r/A5X.name,r)

if __name__=="__main__":unittest.main(verbosity=2)
