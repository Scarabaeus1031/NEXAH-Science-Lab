#!/usr/bin/env python3
"""A5XEF semantic, authority, seal, and synthetic end-to-end validator."""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

import a5xef_schema as schema
from derive_a5xef_reference import derive as reference
from derive_a5xef_independent import derive as independent

PKG=Path(__file__).resolve().parent.parent;LAB=PKG.parent
EXPECTED_MACHINE="44d74f18b14f8c8a9ac9ca71978dc62e90be07243c2b72e2001bdf4517e6a12e"
EXPECTED_LEDGER="a44f2253b1903e406046897e18150cc4c62435d73b9dd0d4158a6f66912ea8ca"
EXPECTED_ROOT="2ad14eb49253523bae79511a07f85b53ab6ed1cd81bcddfced61d5732bed82dd"

class ContractError(ValueError):pass
def need(x,m):
    if not x:raise ContractError(m)
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def tree_digest(path):
    root=Path(path);files=sorted(x for x in root.rglob("*") if x.is_file() and "__pycache__" not in x.parts)
    payload="".join(f"{sha(x)}  {x.relative_to(root).as_posix()}\n" for x in files).encode();return len(files),hashlib.sha256(payload).hexdigest()


def v1_composite(root):
    files=[root/"EXP_00_R_FROZEN_CONFIG.yaml",root/"run_exp00r.py",root/"tests/test_exp00r.py",*list((root/"src").rglob("*.py"))]
    payload="".join(f"{sha(x)}  {x.relative_to(root).as_posix()}\n" for x in sorted(files,key=lambda p:p.relative_to(root).as_posix())).encode();return len(files),hashlib.sha256(payload).hexdigest()


def validate_machine_object(m):
    need(m["schema"]=="A5XEF_EVIDENCE_BINDING_FINALIZATION_V1" and m["scientific_change"] is False,"identity")
    need(m["architecture"]==["RAW_EVIDENCE","DERIVED_POPULATIONS","DERIVED_MODELS_AND_DIAGNOSTICS","NULLS_BOOTSTRAP_N5_SENSITIVITIES","VALIDITY","P1_P5","ROSSLER_CLASSIFICATION","LORENZ_V2_CEILING"],"architecture")
    need(m["states"]=={"N5_SYNTH":"IMPLEMENTATION_FAILURE","N5_RUN":"INVALID_EXPERIMENT","malformed":"INVALID_EXPERIMENT","scientific_negative":"VALID_SCIENTIFIC_RESULT","classification_only":"VALID_SCIENTIFIC_RESULT"},"states")
    need(m["generic_identity"]=={"seed_regex":"^[A-Z][A-Z0-9_:-]{2,63}$","seed_count":30,"splits":["TRAIN_OOF","TEST"],"rows_per_seed_per_split":50,"synthetic_only_testing":True,"registered_prefix_required":False},"generic identity")
    need(m["actions"]==schema.ACTIONS,"actions")
    need(m["support"]=={"source":"RAW_REPRESENTATION_DISTANCE_LTE_MANIFEST_THRESHOLD","T_oos":["<=",.1],"F_oos":["<=",.1],"joint_fraction":[">=",.8],"nonzero":{"minimum_seeds":20,"minimum_rows":20,"validity_only":True}},"support")
    need(m["populations"]=={"primary_fit":"DERIVED_JOINT_TRAIN","primary_evaluate":"DERIVED_JOINT_TEST","null_fit":"DERIVED_JOINT_TRAIN","null_evaluate":"DERIVED_JOINT_TEST","bootstrap":"DERIVED_JOINT_TEST_BY_SEED","attribution":"DERIVED_JOINT_TEST","N5_RUN":"ORIGINAL_FIXED_JOINT_TEST_INCLUDING_ZERO","sensitivity":"VARIANT_DERIVED_JOINT_TRAIN_TEST"},"populations")
    spec=schema.model_spec();need(m["model"]=={**spec,"consumed_by_every_fit":True},"model")
    need(m["observed"]=={"ranks":"DERIVE_DESCENDING_SCORE_ACTION_ASC_TIE","coherence":"(1+KENDALL_TAU_B)/2","carrier_label":"ALL_ACTION_OUTCOME_AT_DERIVED_TOP_ACTION","controls":"DERIVE_FROM_RAW_T_F_SCORE_VECTORS"},"observed")
    need(m["rng"]=={"namespace":"CONFIG_ID|FAMILY_TOKEN|UNSIGNED_REPLICATE_DECIMAL|ORDERED_TAGS","hash":"SHA-256","slice":[0,8],"byte_order":"BIG_ENDIAN","generator":"numpy.random.Generator(numpy.random.PCG64(seed))","numpy":"2.3.5","fresh_stream":True,"retry":False},"rng")
    need(m["nulls"]["families"]==schema.FAMILIES and m["nulls"]["repetitions"]==200 and m["nulls"]["ids"]==[0,199] and m["nulls"]["support"]=="ORIGINAL_FIXED_NO_DROP" and m["nulls"]["statistics"]==["mean_coherence","top_action_agreement","T_coefficient","F_coefficient","T_gain","F_gain"],"nulls")
    need(m["nulls"]["N1"]=="FORWARD_ACTION_LABEL_PER_REPRESENTATION_SEED" and m["nulls"]["N2"]=="F_RANK_WITHIN_SPLIT_SEED_WITHOUT_REPLACEMENT" and m["nulls"]["N3"]=="DIFFERENT_SEED_SAME_SPLIT_DECISION_DONOR_WITH_REPLACEMENT" and m["nulls"]["N4"]=="F_RANK_WITHIN_SPLIT_CARRIER_MAGNITUDE_SUPPORT_DECILE","null definitions")
    need(m["monte_carlo"]=={"R":200,"formula":"(1+k)/(R+1)","k":"COUNT_NULL_GTE_OBSERVED","ties":"ADVERSE","pass":"k<=4"},"monte carlo")
    need(m["bootstrap"]=={"repetitions":500,"ids":[0,499],"cluster":"TEST_SEED","seed":20260808,"draw":"30_WITH_REPLACEMENT","population":"DERIVED_JOINT_TEST","quantiles":[.025,.975],"method":"NUMPY_2.3.5_LINEAR","redraw":False},"bootstrap")
    need(m["N5"]=={"transforms":"FIRST_12_DET_PLUS_SIGNED_PERMUTATIONS_LEXICOGRAPHIC","count":12,"representations":schema.REPRESENTATIONS,"minimum_queries":20,"inverse_registration":"Q_TRANSPOSE","statistic":"KENDALL_TAU_B","minimum_threshold":.99,"SYNTH_failure":"IMPLEMENTATION_FAILURE","RUN_failure":"INVALID_EXPERIMENT"},"N5")
    need(m["P4"]=={"critical_carriers":["T","F"],"controls":["T_BEST","T_MARGIN","F_BEST","F_MARGIN"],"diagnostics":["T_ONLY","F_ONLY","EQUAL_SCORE_FUSION"],"diagnostics_report_only":True,"direction":"AT_LEAST_21_OF_30_GTE_ZERO","dominance":"EXACT_G_GT_ZERO_AND_2D3_LTE_G","equality_half":"PASS","negative":"P4_FALSE_NOT_INVALID"},"P4")
    expected_ids=[x[1] for x in schema.SENSITIVITY_REGISTRY];need(m["sensitivities"]["exact_registry"]==expected_ids and m["sensitivities"]["one_factor"] is True and m["sensitivities"]["config_hashes"]=="CANONICAL_FULL_AND_UNCHANGED_LEAVES" and m["sensitivities"]["evidence"]=="VARIANT_RAW_REPRESENTATION_ROWS" and m["sensitivities"]["operative_bindings"]=={"amplitude":"VARIANT_ACTION_SET","training_halves":"VARIANT_FIT_SEED_SET","support_quantiles":"VARIANT_SUPPORT_THRESHOLDS","other":"VARIANT_RAW_REPRESENTATION_ROWS_BOUND_TO_CONFIG"} and m["sensitivities"]["required_outputs"]==["T_COEFFICIENT","T_GAIN","F_COEFFICIENT","F_GAIN","SUPPORT","PROVENANCE"] and m["sensitivities"]["P5_ids"]==expected_ids[:2] and m["sensitivities"]["no_rescue"] is True,"sensitivities")
    need(m["P"]=={"P1":"BOTH_AGREEMENT_STATS_PASS_ALL_FIVE_NULLS","P2":"BOTH_COEFFICIENT_GT0_AND_BOOTSTRAP_LOWER_GT0","P3":"BOTH_GAIN_GT0_BRIER_NONWORSE_AND_MATCHED_NULLS","P4":"BOTH_CARRIERS_CONTROLS_DIRECTIONS_DOMINANCE_AND_DIAGNOSTIC_COMPLETENESS","P5":"BOTH_AMPLITUDE_VARIANTS_BOTH_CARRIERS_COEFFICIENT_AND_GAIN_GT0","strict_positive_equality":"FAIL"},"P")
    need(m["classification"]["precedence"]==["ANY_INVALID=>INVALID EXPERIMENT","ALL_P_AND_BOTH_POSITIVE_CORES=>REPLICATED","ANY_POSITIVE_CORE_AND_NO_RESOLVED_NEGATIVE=>PARTIALLY REPLICATED","OTHERWISE=>NOT REPLICATED"] and m["classification"]["resolved_negative"]=="BOOTSTRAP_UPPER_LT_ZERO" and m["classification"]["contradiction"]=="INVALID_EXPERIMENT","classification")
    need(m["cross_system"]=={"invalid":"INCONCLUSIVE","positive_P1_P2_P3":"PARTIAL CROSS-SYSTEM REPLICATION","ceiling":"PARTIAL CROSS-SYSTEM REPLICATION","strict_label_reachable":False},"ceiling")
    need(m["provenance"]["raw_sections"]==["MANIFEST","PRIMARY_CONFIG","MODEL_SPEC","OBSERVED_ROWS","NULL_WORLDS","BOOTSTRAP","N5","SENSITIVITIES","AUTHORITY_BINDING"] and m["provenance"]["exact_parents"] is True and m["provenance"]["extra_missing_duplicate"]=="INVALID_EXPERIMENT","provenance")
    need(m["producer_summaries"]["authoritative"] is False and set(m["producer_summaries"]["forbidden"])=={"support_pass","null_pass","bootstrap_ci","n5_pass","dominance_pass","sensitivity_pass","P1","P2","P3","P4","P5","validity","classification"},"summary authority")
    need(m["nonexecution"]=={"registered_data_accessed":False,"implementation_created":False,"authorization_created":False,"registered_experiment_executed":False},"nonexecution")
    return True


def validate_machine():
    path=PKG/"A5XEF_MACHINE_READABLE_CONTRACT.yaml";need(sha(path)==EXPECTED_MACHINE,"machine seal");value=json.loads(path.read_text());validate_machine_object(value);return value


def verify_authority(lab=LAB):
    path=PKG/"A5XEF_TRANSITIVE_AUTHORITY_LEDGER.json";need(sha(path)==EXPECTED_LEDGER,"ledger seal");ledger=json.loads(path.read_text());need(v1_composite(lab/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1")== (24,ledger["v1_scientific_composite"]["sha256"]),"V1")
    need(any(x["path"].endswith("AMENDMENT_A1") for x in ledger["packages"]),"A1 missing")
    for item in ledger["packages"]:need(tree_digest(lab/item["path"])==(item["count"],item["tree_sha256"]),f"authority:{item['path']}")
    for item in ledger["nested_declared_roots"]:need(sha(lab/item["path"])==item["sha256"],f"nested:{item['path']}")
    return True


def normalized_validator(path):
    data=Path(path).read_bytes();data=re.sub(rb'(EXPECTED_ROOT\s*=\s*)"[^"]+"',rb'\1"<NORMALIZED_A5XEF_ROOT>"',data,count=1);return hashlib.sha256(data).hexdigest()


def verify_root():
    path=PKG/"A5XEF_AUTHORITY_ROOT.json";need(sha(path)==EXPECTED_ROOT,"root anchor");root=json.loads(path.read_text());need(root["member_count"]==len(root["members"]),"root count")
    for item in root["members"]:
        member=PKG/item["path"];got=normalized_validator(member) if item["mode"]=="NORMALIZED_VALIDATOR" else sha(member);need(member.stat().st_size==item["bytes"] and got==item["sha256"],f"member:{item['path']}")
    actual={x.relative_to(PKG).as_posix() for x in PKG.rglob("*") if x.is_file() and x.name!="A5XEF_AUTHORITY_ROOT.json" and "__pycache__" not in x.parts};need(actual=={x["path"] for x in root["members"]},"root membership");return True


def validate_all():
    verify_authority();verify_root();validate_machine();bundle=schema.build_bundle();a=reference(bundle);b=independent(bundle);need(a==b and a["execution_state"]=="VALID_SCIENTIFIC_RESULT","two paths");need(reference(schema.favorable_counterexample())["execution_state"]!="VALID_SCIENTIFIC_RESULT","counterexample");alt=schema.build_bundle("ALT_FIXTURE");need(reference(alt)["execution_state"]=="VALID_SCIENTIFIC_RESULT","alternate namespace");return a

if __name__=="__main__":
    try:
        result=validate_all();print("A5XEF VALIDATION: PASS",result["execution_state"],result["classification"],result["P"])
    except Exception as error:
        print("A5XEF VALIDATION: FAIL",error);sys.exit(1)
