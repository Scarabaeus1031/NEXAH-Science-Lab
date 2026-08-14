import copy,json,unittest,hashlib
from pathlib import Path
from contract_validation import validate_a5x_contract as v

def primary(): return json.loads((v.LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/EXP_00_R_FROZEN_CONFIG.yaml").read_text())
def sensitivity_records(machine,bindings):
    p=primary(); out=[]
    for s in machine["sensitivities"]["registry"]:
        q=copy.deepcopy(p); v.setpath(q,s["changed_factor_path"],s["sensitivity_value"])
        out.append({"sensitivity_id":s["sensitivity_id"],"changed_factor_path":s["changed_factor_path"],"primary_value":s["primary_value"],"sensitivity_value":s["sensitivity_value"],"unchanged_config_digest":v.digest(v.delpath(p,s["changed_factor_path"])),"variant_config_digest":v.digest(q),"variant_config":q,"carriers":["T","F"],"carrier_results":{"T":{"standardized_coherence_coefficient":.1,"heldout_log_loss_gain":.01},"F":{"standardized_coherence_coefficient":.2,"heldout_log_loss_gain":.02}},"support":{"T_oos_fraction":.01,"F_oos_fraction":.02,"joint_support_fraction":.95,"contributing_seed_count":30,"rows_per_seed":{"6000":50}},"provenance":bindings})
    return out

class ContractTests(unittest.TestCase):
 def test_baseline(self): self.assertTrue(v.validate_all())
 def test_sensitivity_exact(self):
    m=v.read_machine(); b={k:"a"*64 for k in m["sensitivities"]["required_provenance_fields"]}; r=sensitivity_records(m,b)
    self.assertTrue(v.evaluate_sensitivities(r,m,primary(),b))
    for mutate in [lambda x:x.pop(),lambda x:x.append(copy.deepcopy(x[0])),lambda x:x[0].update(sensitivity_id="WRONG"),lambda x:v.setpath(x[0]["variant_config"],"plant.dt",.01),lambda x:x[0].update(unchanged_config_digest="0"*64)]:
        q=copy.deepcopy(r); mutate(q); self.assertFalse(v.evaluate_sensitivities(q,m,primary(),b))
 def test_gate_raw_derivations(self):
    parity={r:{"training_seed_ids":list(range(5000,5030)),"raw_rollout_table_sha256":"a"*64,"observed_variables":["x","y","z"],"action_set":[-.5,-.25,0,.25,.5],"sampling_interval":.05,"evaluation_horizon":1.0,"target_sha256":"b"*64,"objective_sha256":"c"*64,"future_test_access":False,"analytic_field_access":False} for r in ["TRAJECTORY","LEARNED_FIELD"]}
    self.assertTrue(v.evaluate_gate("INFORMATION_PARITY",parity)); parity["LEARNED_FIELD"]["analytic_field_access"]=True; self.assertFalse(v.evaluate_gate("INFORMATION_PARITY",parity))
    leak={"learned_representation_imports":[],"learned_representation_calls":[],"analytic_field_access_events":[]}; self.assertTrue(v.evaluate_gate("NO_ANALYTIC_FIELD_LEAKAGE",leak)); leak["analytic_field_access_events"].append({}); self.assertFalse(v.evaluate_gate("NO_ANALYTIC_FIELD_LEAKAGE",leak))
    support={"T_oos_fraction":.1,"F_oos_fraction":.1,"joint_support_fraction":.8,"unsupported_treatment":"WHOLE_RANK_ABSTAIN_NO_IMPUTATION","joint_membership":"T_SUPPORTED_AND_F_SUPPORTED","qualifying_seed_row_counts":{str(s):20 for s in range(6000,6020)}}
    self.assertTrue(v.evaluate_gate("SUPPORT_VALIDITY",support)); support["T_oos_fraction"]=.1000001; self.assertFalse(v.evaluate_gate("SUPPORT_VALIDITY",support))

if __name__=="__main__":unittest.main()
