#!/usr/bin/env python3
"""A5X contract-only validator. Standard library only; no science imports."""
from __future__ import annotations
import copy, hashlib, json, math, re, sys
from pathlib import Path

EXPECTED_ROOT_SHA256="c5b35bbbbc7551fb5cddd8cc5468ba0aa8bcf4e895ef8bbe0b55f341821c4100"
HERE=Path(__file__).resolve().parent; PKG=HERE.parent; LAB=PKG.parent
V1_EXPECTED="971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05"
class ContractError(RuntimeError): pass
def req(x,m):
    if not x: raise ContractError(m)
def sha_bytes(b): return hashlib.sha256(b).hexdigest()
def sha(p): return sha_bytes(Path(p).read_bytes())
def canon(x): return json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=False,allow_nan=False).encode()
def digest(x): return sha_bytes(canon(x))
def finite(x): return type(x) in (int,float) and math.isfinite(x)
def exact_keys(d,keys): return type(d) is dict and set(d)==set(keys)
def read_machine(pkg=PKG): return json.loads((pkg/"A5X_MACHINE_READABLE_RULES.yaml").read_text())

def v1_composite(root):
    fs=[root/"EXP_00_R_FROZEN_CONFIG.yaml",root/"run_exp00r.py",root/"tests/test_exp00r.py",*list((root/"src").rglob("*.py"))]
    fs=sorted(fs,key=lambda p:p.relative_to(root).as_posix()); req(len(fs)==24 and all(p.is_file() for p in fs),"V1 members")
    return sha_bytes("".join(f"{sha(p)}  {p.relative_to(root).as_posix()}\n" for p in fs).encode())

def normalized_validator_hash(path):
    b=Path(path).read_bytes(); b=re.sub(rb'EXPECTED_ROOT_SHA256="[^"]+"',b'EXPECTED_ROOT_SHA256="<NORMALIZED_ROOT_DIGEST>"',b,count=1)
    return sha_bytes(b)

def verify_authority(pkg=PKG,lab=LAB):
    root_path=pkg/"A5X_AUTHORITY_ROOT.json"; root_bytes=root_path.read_bytes()
    req(sha_bytes(root_bytes)==EXPECTED_ROOT_SHA256,"root trust anchor")
    r=json.loads(root_bytes); req(r["schema_version"]=="1.0" and r["hash_algorithm"]=="SHA-256","root metadata")
    req(r["member_count"]==len(r["members"]) and len({x["path"] for x in r["members"]})==len(r["members"]),"root count")
    req(v1_composite(lab/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1")==V1_EXPECTED==r["v1_composite"],"V1 composite")
    for x in r["members"]:
        p=lab/x["path"]; req(p.is_file(),f"missing {x['path']}")
        got=normalized_validator_hash(p) if x["hash_mode"]=="NORMALIZED_VALIDATOR" else sha(p)
        req(got==x["sha256"] and p.stat().st_size==x["bytes"],f"member {x['path']}")
    a5x_prose={x.relative_to(lab).as_posix() for x in pkg.glob("*.md")}
    root_prose={x["path"] for x in r["members"] if x["role"]=="A5X_PROSE"}
    req(a5x_prose==root_prose,"A5X prose membership")
    return True

def getpath(d,path):
    for k in path.split("."): d=d[k]
    return d
def setpath(d,path,value):
    ks=path.split("."); q=d
    for k in ks[:-1]: q=q[k]
    q[ks[-1]]=copy.deepcopy(value)
def delpath(d,path):
    q=copy.deepcopy(d); ks=path.split("."); t=q
    for k in ks[:-1]: t=t[k]
    del t[ks[-1]]; return q

def gate_config_binding(a,e):
    fields=["config_id","v1_composite_sha256","a5x_machine_sha256","authority_root_sha256"]
    return type(a) is list and len(a)>0 and all(exact_keys(x,fields) and all(type(x[k]) is str for k in fields) and x==e for x in a)
def gate_train_test(a,e):
    return exact_keys(a,["train_seed_ids","test_seed_ids","target_source","standardizer_source","support_source","representation_fit_source","model_fit_source","metric_source","events"]) and a["train_seed_ids"]==list(range(5000,5030)) and a["test_seed_ids"]==list(range(6000,6030)) and not(set(a["train_seed_ids"])&set(a["test_seed_ids"])) and [a[k] for k in ["target_source","standardizer_source","support_source","representation_fit_source"]]==["TRAIN"]*4 and a["model_fit_source"]=="TRAIN_OOF" and a["metric_source"]=="TEST" and all(type(x) is dict and x.get("test_data_access") is False for x in a["events"] if x.get("stage")!="AUTHORIZED_TEST_EVALUATION")
def gate_parity(a,e):
    fields=["training_seed_ids","raw_rollout_table_sha256","observed_variables","action_set","sampling_interval","evaluation_horizon","target_sha256","objective_sha256","future_test_access","analytic_field_access"]
    return exact_keys(a,["TRAJECTORY","LEARNED_FIELD"]) and all(exact_keys(a[r],fields) for r in a) and a["TRAJECTORY"]==a["LEARNED_FIELD"] and a["TRAJECTORY"]["training_seed_ids"]==list(range(5000,5030)) and a["TRAJECTORY"]["observed_variables"]==["x","y","z"] and a["TRAJECTORY"]["action_set"]==[-.5,-.25,0,.25,.5] and a["TRAJECTORY"]["sampling_interval"]==.05 and a["TRAJECTORY"]["evaluation_horizon"]==1.0 and a["TRAJECTORY"]["future_test_access"] is False and a["TRAJECTORY"]["analytic_field_access"] is False
def gate_distinctness(a,e):
    keys=["family","response","derivative_labels","terminal_objective_labels","imports_other","calls_other","shared_fitted_cache"]
    return exact_keys(a,["TRAJECTORY","LEARNED_FIELD"]) and all(exact_keys(a[x],keys) for x in a) and a["TRAJECTORY"]=={"family":"finite_horizon_knn_outcome","response":"terminal_objective","derivative_labels":False,"terminal_objective_labels":True,"imports_other":False,"calls_other":False,"shared_fitted_cache":False} and a["LEARNED_FIELD"]=={"family":"query_local_affine_ridge_field","response":"finite_difference_minus_Bu","derivative_labels":True,"terminal_objective_labels":False,"imports_other":False,"calls_other":False,"shared_fitted_cache":False}
def gate_no_leakage(a,e): return exact_keys(a,["learned_representation_imports","learned_representation_calls","analytic_field_access_events"]) and "exp00r.rossler" not in a["learned_representation_imports"] and "analytic_derivative" not in a["learned_representation_calls"] and a["analytic_field_access_events"]==[]
def gate_support(a,e):
    return exact_keys(a,["T_oos_fraction","F_oos_fraction","joint_support_fraction","unsupported_treatment","joint_membership","qualifying_seed_row_counts"]) and all(finite(a[k]) for k in ["T_oos_fraction","F_oos_fraction","joint_support_fraction"]) and a["T_oos_fraction"]<=.10 and a["F_oos_fraction"]<=.10 and a["joint_support_fraction"]>=.80 and a["unsupported_treatment"]=="WHOLE_RANK_ABSTAIN_NO_IMPUTATION" and a["joint_membership"]=="T_SUPPORTED_AND_F_SUPPORTED" and type(a["qualifying_seed_row_counts"]) is dict and sum(type(k) is str and type(v) is int and v>=20 for k,v in a["qualifying_seed_row_counts"].items())>=20
def gate_n5(a,e): return type(a) is list and len(a)==12 and {x.get("matrix_id") for x in a}==set(range(12)) and all(exact_keys(x,["matrix_id","tau_values","population_sha256","transformed_abstention","refit_error"]) and type(x["tau_values"]) is list and x["tau_values"] and all(finite(t) and t>=.99 for t in x["tau_values"]) and x["population_sha256"]==e and x["transformed_abstention"] is False and x["refit_error"] is False for x in a)
def gate_nulls(a,e):
    fam=["N1","N2","N3","N4_T","N4_F"]
    return exact_keys(a,fam) and all(type(a[f]) is list and len(a[f])==200 and {x.get("replicate_id") for x in a[f]}==set(range(200)) and all(x.get("population_sha256")==e and type(x.get("statistics")) is dict and x["statistics"] and all(finite(v) for v in x["statistics"].values()) and x.get("retry") is False for x in a[f]) for f in fam)
def gate_bootstrap(a,e): return exact_keys(a,["cluster_unit","seed","replicates","ci_method"]) and a["cluster_unit"]=="TEST_SEED" and a["seed"]==20260808 and a["ci_method"]=="NUMPY_2.3.5_LINEAR" and type(a["replicates"]) is list and len(a["replicates"])==500 and {x.get("replicate_id") for x in a["replicates"]}==set(range(500)) and all(len(x.get("drawn_seed_ids",[]))==30 and all(s in range(6000,6030) for s in x["drawn_seed_ids"]) and all(finite(x.get(k)) for k in ["T_coefficient","F_coefficient"]) for x in a["replicates"])
def gate_per_seed(a,e):
    return exact_keys(a,["T","F"]) and all(type(a[c]) is list and len(a[c])==30 and {x.get("seed_id") for x in a[c]}==set(range(6000,6030)) and all(finite(x.get("direction")) for x in a[c]) and sum(x["direction"]>=0 for x in a[c])>=21 for c in ["T","F"])
def gate_carriers(a,e): return exact_keys(a,["T","F","diagnostics"]) and a["T"].get("population_sha256")==a["F"].get("population_sha256")==e and all(finite(a[c].get(k)) for c in ["T","F"] for k in ["coefficient","gain"]) and all(a[c].get("score_margin_controls")==["T_SCORE","T_MARGIN","F_SCORE","F_MARGIN"] for c in ["T","F"]) and set(a["diagnostics"])=={"TRAJECTORY_ONLY_OUTCOME_PREDICTION","LEARNED_FIELD_ONLY_OUTCOME_PREDICTION","EQUAL_SCORE_FUSION_CARRIER"}
def gate_provenance(a,e): return type(a) is list and len(a)==len(e) and {x.get("artifact_id") for x in a}==set(e) and all(exact_keys(x,["artifact_id","sha256","population_sha256","config_sha256","environment_sha256","authority_root_sha256"]) and all(type(x[k]) is str and len(x[k])==64 for k in x if k!="artifact_id") for x in a)
def gate_no_post_access_mutation(a,e):
    if type(a) is not list or not a:return False
    access=[i for i,x in enumerate(a) if x.get("event_type")=="REGISTERED_ACCESS"]
    if not access:return all(x.get("contract_sha256")==e[0] and x.get("config_sha256")==e[1] and x.get("source_sha256")==e[2] for x in a)
    j=min(access); return any(x.get("event_type")=="FREEZE" for x in a[:j]) and all(x.get("event_type") not in {"SCIENTIFIC_CHOICE","CONFIG_MUTATION","SOURCE_MUTATION","THRESHOLD_MUTATION"} and x.get("contract_sha256")==e[0] and x.get("config_sha256")==e[1] and x.get("source_sha256")==e[2] for x in a[j:])
def gate_p1p5(a,e): return exact_keys(a,["P1","P2","P3","P4","P5","derived","classification_after_all_gates"]) and all(type(a[k]) is bool for k in ["P1","P2","P3","P4","P5"]) and a["derived"] is True and a["classification_after_all_gates"] is True
def gate_source_integrity(a,e): return exact_keys(a,["v1_composite","a5_machine_sha256","authority_root_sha256"]) and a==e

GATE_FUNCS={"SOURCE_CONFIG_INTEGRITY":gate_source_integrity,"CONFIG_BINDING_COMPLETE":gate_config_binding,"TRAIN_TEST_ISOLATION":gate_train_test,"INFORMATION_PARITY":gate_parity,"REPRESENTATION_DISTINCTNESS":gate_distinctness,"NO_ANALYTIC_FIELD_LEAKAGE":gate_no_leakage,"SUPPORT_VALIDITY":gate_support,"N5_RUN":gate_n5,"NULL_FAMILY_COMPLETENESS":gate_nulls,"BOOTSTRAP_VALIDITY":gate_bootstrap,"PER_SEED_ATTRIBUTION_COMPLETENESS":gate_per_seed,"SYMMETRIC_CARRIER_ATTRIBUTION_COMPLETE":gate_carriers,"PROVENANCE_COMPLETE":gate_provenance,"NO_POST_ACCESS_SCIENTIFIC_MUTATION":gate_no_post_access_mutation,"P1_P5_MECHANICALLY_COMPUTED":gate_p1p5}

def evaluate_gate(name,artifact,expected=None):
    try:return bool(GATE_FUNCS[name](artifact,expected))
    except (KeyError,TypeError,ValueError,AttributeError):return False
def evaluate_sensitivities(records,machine,primary,bindings):
    reg=machine["sensitivities"]["registry"]; byid={x.get("sensitivity_id"):x for x in records} if type(records) is list else {}
    if type(records) is not list or len(records)!=12 or len(byid)!=12 or set(byid)!={x["sensitivity_id"] for x in reg}: return False
    for spec in reg:
        x=byid[spec["sensitivity_id"]]; required={"sensitivity_id","changed_factor_path","primary_value","sensitivity_value","unchanged_config_digest","variant_config_digest","variant_config","carriers","carrier_results","support","provenance"}
        if not exact_keys(x,required) or any(x[k]!=spec[k] for k in ["sensitivity_id","changed_factor_path","primary_value","sensitivity_value"]): return False
        if getpath(primary,spec["changed_factor_path"])!=spec["primary_value"]: return False
        variant=copy.deepcopy(primary); setpath(variant,spec["changed_factor_path"],spec["sensitivity_value"])
        if x["variant_config"]!=variant or x["variant_config_digest"]!=digest(variant) or x["unchanged_config_digest"]!=digest(delpath(primary,spec["changed_factor_path"])): return False
        if x["carriers"]!=["T","F"] or set(x["carrier_results"])!={"T","F"}: return False
        if not all(exact_keys(x["carrier_results"][c],["standardized_coherence_coefficient","heldout_log_loss_gain"]) and all(finite(v) for v in x["carrier_results"][c].values()) for c in ["T","F"]): return False
        sk=["T_oos_fraction","F_oos_fraction","joint_support_fraction","contributing_seed_count","rows_per_seed"]
        if not exact_keys(x["support"],sk) or not all(finite(x["support"][k]) for k in sk[:3]) or type(x["support"]["contributing_seed_count"]) is not int or type(x["support"]["rows_per_seed"]) is not dict:return False
        if x["provenance"]!=bindings:return False
    return True

def validate_machine(d):
    req(d["schema_version"]=="5.x.1" and d["scientific_change"] is False,"scope")
    s=d["semantic_fingerprints"]
    req(s["N2"]=={"unit":"WITHIN_SPLIT_AND_SEED","object":"COMPLETE_ORIGINAL_FIELD_WEAK_RANK_VECTOR","replacement":False,"assignment":"RECIPIENT_i_GETS_DONOR_p[i]","carriers_outcomes_support":"FROZEN"},"N2")
    req("DIFFERENT_SEED" in s["N3"]["donor"] and s["N3"]["binding"]=="RECIPIENT_GETS_CANONICALLY_ORDERED_DONOR" and s["N3"]["clockwise"]=="DECREASING_BIN_INDEX_MODULO_8","N3")
    req(s["rng"]["field_order"]=={"N1":["REP","SEED"],"N2":["SPLIT","SEED"],"N3":["SPLIT","ROW"],"N4":["SPLIT","CARRIER","STRATUM"]} and s["rng"]["serialization"].startswith("UTF8(CONFIG_ID)") and s["rng"]["hash"]=="SHA-256" and s["rng"]["digest_slice"]==[0,8] and s["rng"]["byte_order"]=="BIG_ENDIAN" and "PCG64" in s["rng"]["generator"],"RNG")
    req(s["ordering"]["rows"]==["SPLIT_CODE","SEED_ASC","DECISION_INDEX_ASC"] and s["ordering"]["global"] is True,"order")
    req(s["P4"]["choice"]=="SINGLE_VIEW_PREDICTORS_MANDATORY_REPORT_ONLY" and s["P4"]["coefficient"]==">0" and s["P4"]["gain"]==">0","P4")
    req(s["P5"]["both_carriers_coefficient"]==">0" and s["P5"]["both_carriers_gain"]==">0" and s["P5"]["no_rescue"] is True,"P5")
    req(s["classifier"]["precedence"]==["ANY_INVALID=>INVALID EXPERIMENT","ALL_P1_P5_AND_BOTH_CORES_AND_NO_NEGATIVE=>REPLICATED","ANY_CORE_AND_NO_NEGATIVE=>PARTIALLY REPLICATED","OTHERWISE=>NOT REPLICATED"] and s["classifier"]["ceiling"]=="PARTIAL CROSS-SYSTEM REPLICATION" and s["classifier"]["strict_cross_system_reachable"] is False,"classifier")
    req(set(d["validity_gates"])==set(GATE_FUNCS)|{"ALL_12_SENSITIVITIES_COMPLETE"} and all(x["function"] in set(f.__name__ for f in GATE_FUNCS.values())|{"evaluate_sensitivities"} for x in d["validity_gates"].values()),"gates")
    expected=[("ACTION_AMPLITUDE_0.25","actions.primary_amplitude",.5,.25,True),("ACTION_AMPLITUDE_1.0","actions.primary_amplitude",.5,1.0,True),("TRAJECTORY_NEIGHBORS_15","representations.trajectory.neighbors",25,15,False),("TRAJECTORY_NEIGHBORS_50","representations.trajectory.neighbors",25,50,False),("LEARNED_FIELD_NEIGHBORS_60","representations.learned_field.neighbors",100,60,False),("LEARNED_FIELD_NEIGHBORS_160","representations.learned_field.neighbors",100,160,False),("HORIZON_0.5","plant.evaluation_horizon",1.0,.5,False),("HORIZON_1.5","plant.evaluation_horizon",1.0,1.5,False),("TRAINING_SEED_HALF_5000_5014","data.train_seeds",{"start":5000,"stop_inclusive":5029,"count":30},{"start":5000,"stop_inclusive":5014,"count":15},False),("TRAINING_SEED_HALF_5015_5029","data.train_seeds",{"start":5000,"stop_inclusive":5029,"count":30},{"start":5015,"stop_inclusive":5029,"count":15},False),("SUPPORT_QUANTILE_0.95","support.threshold_quantile",.99,.95,False),("SUPPORT_QUANTILE_0.995","support.threshold_quantile",.99,.995,False)]
    got=[(x.get("sensitivity_id"),x.get("changed_factor_path"),x.get("primary_value"),x.get("sensitivity_value"),x.get("p5")) for x in d["sensitivities"]["registry"]]
    req(got==expected,"sensitivities")
    req(d["nonexecution"]=={"implementation_created":False,"authorization_created":False,"registered_data_accessed":False,"registered_experiment_executed":False},"nonexecution")

def validate_all(pkg=PKG,lab=LAB):
    verify_authority(pkg,lab); d=read_machine(pkg); validate_machine(d)
    req(v1_composite(lab/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1")==d["authority"]["v1_composite"],"machine V1")
    req(sha(lab/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5/A5_MACHINE_READABLE_RULES.yaml")==d["authority"]["a5_machine_sha256"],"A5 machine")
    return True
if __name__=="__main__":
    try: validate_all(); print("A5X CONTRACT VALIDATION: PASS")
    except Exception as e: print("A5X CONTRACT VALIDATION: FAIL —",e); sys.exit(1)
