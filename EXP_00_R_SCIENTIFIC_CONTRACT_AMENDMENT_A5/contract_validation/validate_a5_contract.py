#!/usr/bin/env python3
"""Standard-library-only A5 contract validator. No scientific pipeline imports."""
from __future__ import annotations
import copy, hashlib, itertools, json, math, sys
from fractions import Fraction
from pathlib import Path

EXPECTED_V1 = "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05"
HERE = Path(__file__).resolve().parent
PKG = HERE.parent
LAB = PKG.parent

class ContractError(RuntimeError): pass
def require(value, message):
    if not value: raise ContractError(message)
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def v1_members(root: Path):
    members = [root/"EXP_00_R_FROZEN_CONFIG.yaml", root/"run_exp00r.py", root/"tests/test_exp00r.py"]
    members += list((root/"src").rglob("*.py"))
    return sorted(members, key=lambda p: p.relative_to(root).as_posix())

def recompute_v1(root: Path) -> str:
    members = v1_members(root)
    require(len(members)==24 and all(p.is_file() for p in members), "V1 member set")
    ledger = "".join(f"{sha(p)}  {p.relative_to(root).as_posix()}\n" for p in members)
    return hashlib.sha256(ledger.encode()).hexdigest()

def load_machine(path=PKG/"A5_MACHINE_READABLE_RULES.yaml"):
    return json.loads(Path(path).read_text())

def validate_authority(data, lab=LAB):
    v1 = (PKG / data["authority"]["v1_root"]).resolve() if lab==LAB else Path(lab)/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"
    require(recompute_v1(v1)==EXPECTED_V1==data["authority"]["v1_composite_sha256"], "V1 composite")
    if lab==LAB:
        for item in data["authority"]["external_files"]:
            p=(PKG/item["path"]).resolve(); require(p.is_file() and sha(p)==item["sha256"], f"external hash {item['path']}")

def validate_machine(d):
    require(d["schema_version"]=="5.0", "schema")
    require(d["authority"]["new_prospective_scientific_choices"]==["P4_SINGLE_REPRESENTATION_PREDICTORS_MANDATORY_REPORT_ONLY"], "P4 choice")
    require(d["bindings"]["override_only"]==["seed_dominance","P.P4","validity","sensitivities","integrity","nonexecution"], "change boundary")
    p4=d["p4_attribution"]; p=d["P"]["P4"]
    require(p4["classification_critical"]==["T_PRIMARY_CARRIER","F_PRIMARY_CARRIER"], "P4 critical")
    ro=["TRAJECTORY_ONLY_OUTCOME_PREDICTION","LEARNED_FIELD_ONLY_OUTCOME_PREDICTION","EQUAL_SCORE_FUSION_CARRIER"]
    require(p4["mandatory_report_only"]==ro and p["report_only_registry"]==ro, "P4 report registry")
    require(p4["single_view_coherence_defined"] is False and p4["leave_one_representation_coherence_registry"]==[], "no singleton coherence")
    require(p4["report_only_values_affect_P4"] is False and p4["missing_report_only_affects_validity"] is True, "P4 role")
    require(p["each_coefficient"]==">0" and p["each_log_loss_gain"]==">0" and p["report_only_can_veto_or_rescue"] is False, "P4 gain")
    require(d["nulls"]["families"]==["N1","N2","N3","N4_T","N4_F"] and d["nulls"]["repetitions_each"]==200, "null families/reps")
    require(d["nulls"]["N1"]["map"]=="pi(action[j])=action[p[j]]" and d["nulls"]["N1"]["inverse_forbidden"] is True, "N1 forward")
    require(d["nulls"]["N3"]["direction"]=="RECIPIENT_GETS_DONOR", "N3 direction")
    require(d["nulls"]["N4"]["distance"]=="FULL_TRAINING_LEAVE_SELF_OUT_EUCLIDEAN_WITH_FROZEN_STANDARDIZER", "N4 distance")
    require(d["rng_order"]["generator"]=="numpy.random.Generator(numpy.random.PCG64(seed))" and d["rng_order"]["digest_bytes"]==[0,8], "RNG")
    require(d["monte_carlo"]=={"slots":200,"direction":"OBSERVED_GREATER","ties":"ADVERSE","k":"COUNT(NULL>=OBSERVED)","p":"(1+k)/201","alpha":0.025,"pass_iff":{"operator":"<=","k":4}}, "Monte Carlo")
    require(d["N5"]["count"]==12 and d["N5"]["role"]=="VALIDITY_ONLY" and d["N5"]["threshold"]=={"operator":">=","value":0.99}, "N5")
    s=d["sensitivities"]; require(s["exact_count"]==12 and len(s["registry"])==12, "sensitivity count")
    require([x["ordinal"] for x in s["registry"]]==list(range(12)) and len({x["variant_id"] for x in s["registry"]})==12, "sensitivity ids")
    require([x["variant_id"] for x in s["registry"] if x["p5"]]==["ACTION_AMPLITUDE_0.25","ACTION_AMPLITUDE_1.0"], "P5 variants")
    require(set(s["required_fields"])=={"ordinal","variant_id","changed_factor_path","primary_value","sensitivity_value","unchanged_leaf_hash","variant_config_hash","carriers","carrier_outputs","support","provenance","completion_status","no_rescue"}, "sensitivity output schema")
    require(set(s["carrier_output_fields"])=={"standardized_coherence_coefficient","heldout_log_loss_gain"}, "sensitivity carrier outputs")
    require(len(s["provenance_fields"])==9 and len(s["support_fields"])==5 and s["no_rescue"] is True, "sensitivity provenance/support")
    sd=d["seed_dominance"]
    require(sd["canonical_arithmetic"]=="EXACT_REDUCED_RATIONAL_FROM_FLOAT_AS_INTEGER_RATIO" and sd["tolerance"]=="FORBIDDEN", "dominance type")
    require(sd["pass"]=={"all":["G>0","2*D3<=G"]} and sd["equality_half"]=="PASS", "dominance comparison")
    gates=d["validity"]["predicates"]
    expected={"SOURCE_CONFIG_INTEGRITY","CONFIG_BINDING_COMPLETE","TRAIN_TEST_ISOLATION","INFORMATION_PARITY","REPRESENTATION_DISTINCTNESS","NO_ANALYTIC_FIELD_LEAKAGE","SUPPORT_VALIDITY","N5_RUN","NULL_FAMILY_COMPLETENESS","BOOTSTRAP_VALIDITY","PER_SEED_ATTRIBUTION_COMPLETENESS","SYMMETRIC_CARRIER_ATTRIBUTION_COMPLETE","ALL_12_SENSITIVITIES_COMPLETE","PROVENANCE_COMPLETE","NO_POST_ACCESS_SCIENTIFIC_MUTATION","P1_P5_MECHANICALLY_COMPUTED"}
    require(set(gates)==expected, "validity registry")
    for name,g in gates.items(): require(set(g)>={"dependencies","inputs","required_fields","all"} and g["inputs"] and g["required_fields"] and g["all"], f"typed gate {name}")
    parity=set(gates["INFORMATION_PARITY"]["required_fields"]); require({"training_seeds","raw_training_table_sha256","future_test_access","analytic_field_access"}<=parity, "parity fields")
    distinct="|".join(gates["REPRESENTATION_DISTINCTNESS"]["all"]); require("FAMILIES_EXACT_DISTINCT" in distinct and "NO_CROSS_IMPORT_CALL" in distinct, "distinctness")
    require(d["bootstrap"]["repetitions"]==500 and d["bootstrap"]["cluster_unit"]=="TEST_SEED", "bootstrap")
    require(set(d["P"])=={"P1","P2","P3","P4","P5"}, "P1-P5")
    require(d["P"]["P5"]["bootstrap_interval"]=="PRIMARY_AMPLITUDE_ONLY" and d["P"]["P5"]["no_rescue"] is True, "P5")
    require(d["classification"]["precedence"][0]=="IF_ANY_VALIDITY_FALSE=>INVALID EXPERIMENT" and d["classification"]["mutually_exclusive"] and d["classification"]["exhaustive"], "classification")
    require(d["cross_system"]["strict_cross_system_replicated_reachable"] is False and d["cross_system"]["ceiling"]=="PARTIAL CROSS-SYSTEM REPLICATION", "Lorenz ceiling")
    require(d["nonexecution"]=={"implementation_created":False,"execution_authorization_created":False,"registered_data_accessed":False,"registered_rossler_experiment_executed":False}, "nonexecution")

def classify(validity, ps, tcore, fcore, negative):
    if not validity: return "INVALID EXPERIMENT"
    if all(ps) and tcore and fcore and not negative: return "REPLICATED"
    if (tcore or fcore) and not negative: return "PARTIALLY REPLICATED"
    return "NOT REPLICATED"

def cross_system(rossler_valid, p123, label):
    if not rossler_valid: return "INCONCLUSIVE"
    if p123 and label in {"REPLICATED","PARTIALLY REPLICATED"}: return "PARTIAL CROSS-SYSTEM REPLICATION"
    return "NON-REPLICATION"

def dominance(values):
    vals=[(int(seed), Fraction(float(v))) for seed,v in values]
    if len(vals)<3: return "INVALID_EXPERIMENT"
    G=sum((v for _,v in vals),Fraction(0));
    if G<=0: return "FAIL"
    top=sorted(vals,key=lambda z:(-z[1],z[0]))[:3]; D3=sum((v for _,v in top),Fraction(0))
    return "PASS" if 2*D3<=G else "FAIL"

def validate_manifest(pkg=PKG):
    m=json.loads((pkg/"A5_PACKAGE_MANIFEST.json").read_text())
    require(m["schema_version"]=="1.0" and m["manifest_self_hash"]=="EXCLUDED_RECURSIVE", "manifest schema")
    paths=[x["path"] for x in m["members"]]; require(len(paths)==len(set(paths)), "manifest duplicates")
    required={p.name for p in pkg.glob("*.md")}|{"A5_MACHINE_READABLE_RULES.yaml","contract_validation/validate_a5_contract.py","contract_validation/test_a5_contract.py"}
    listed=set(paths); require(required==listed, f"manifest membership missing={required-listed} extra={listed-required}")
    for x in m["members"]:
        p=pkg/x["path"]; require(p.is_file() and p.stat().st_size==x["bytes"] and sha(p)==x["sha256"], f"manifest hash {x['path']}")

def validate_all(pkg=PKG, lab=LAB):
    d=load_machine(pkg/"A5_MACHINE_READABLE_RULES.yaml"); validate_machine(d); validate_authority(d,lab); validate_manifest(pkg)
    labels=set()
    for vals in itertools.product([False,True], repeat=9): labels.add(classify(vals[0], vals[1:6], vals[6], vals[7], vals[8]))
    require(labels=={"INVALID EXPERIMENT","REPLICATED","PARTIALLY REPLICATED","NOT REPLICATED"}, "classification exhaustiveness")
    require(cross_system(True,True,"REPLICATED")=="PARTIAL CROSS-SYSTEM REPLICATION", "ceiling")
    return True

if __name__=="__main__":
    try: validate_all(); print("A5 CONTRACT VALIDATION: PASS")
    except Exception as e: print(f"A5 CONTRACT VALIDATION: FAIL — {e}"); sys.exit(1)

