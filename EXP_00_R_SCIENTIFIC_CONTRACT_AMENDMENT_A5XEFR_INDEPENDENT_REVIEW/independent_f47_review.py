#!/usr/bin/env python3
"""Independent synthetic-only F47 adversarial review. No registered inputs."""
from __future__ import annotations

import copy
import hashlib
import json
import sys
from pathlib import Path

LAB=Path(__file__).resolve().parent.parent
A5XEF=LAB/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEF"/"contract_validation"
A5XEFR=LAB/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEFR"/"contract_validation"
sys.path.insert(0,str(A5XEF))
import a5xef_schema as base
from derive_a5xef_reference import derive as base_ref
from derive_a5xef_independent import derive as base_ind
sys.path.insert(0,str(A5XEFR))
import a5xefr_schema as successor
from derive_a5xefr_reference import derive as ref, validate as ref_validate
from derive_a5xefr_independent import derive as ind, audit as ind_validate

ROOT="2ad14eb49253523bae79511a07f85b53ab6ed1cd81bcddfced61d5732bed82dd"
REVIEW="38447803d168a16e865e4747aff41353c59c30283b25644ae6cc820cf58b516f"
checks=[]
def require(value,label):
    if not value: raise AssertionError(label)
    checks.append(label)
def digest(value): return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
def refresh_envelope(value):
    value["provenance"]={"identity_sha256":digest(value["execution_identity"]),"evidence_sha256":digest(value["evidence"])};return value

def envelope(mode):
    evidence=base.build_bundle("INDEPENDENT_F47")
    common={"authority":{"a5xef_root_sha256":ROOT,"a5xef_review_tree_sha256":REVIEW},"authorization":{"present":False,"reference":None},"conformance_only":True,"scientific_result_claimed":False}
    if mode=="FIXTURE": ident={"evidence_mode":"FIXTURE","registered":False,"registered_data":False,"fixture":True,"payload_kind":"SYNTHETIC_FIXTURE","payload_origin":"SYNTHETIC",**common}
    else: ident={"evidence_mode":"REGISTERED","registered":True,"registered_data":True,"fixture":False,"payload_kind":"SYNTHETIC_REGISTERED_INTERFACE_CONFORMANCE","payload_origin":"SYNTHETIC",**common}
    evidence["manifest"]["registered"]=ident["registered"]
    evidence["authority_binding"]={"v1_composite":base.V1,"registered_data":ident["registered_data"],"fixture":ident["fixture"]}
    base.refresh_provenance(evidence,"manifest","authority_binding")
    return refresh_envelope({"schema":"A5XEFR_GENERIC_RAW_EVIDENCE_V1","execution_identity":ident,"evidence":evidence,"provenance":{}})

def independent_canonical(value):
    evidence=copy.deepcopy(value["evidence"])
    evidence["manifest"]["registered"]=False
    evidence["authority_binding"]={"v1_composite":base.V1,"registered_data":False,"fixture":True}
    base.refresh_provenance(evidence,"manifest","authority_binding")
    return evidence

def rejected(value):
    for function in (ref,ind):
        out=function(copy.deepcopy(value));require(out["execution_state"]=="INVALID_INTERFACE" and out["classification"] is None and out["release_permitted"] is False,"reject:"+out.get("reason","unknown"))

F=envelope("FIXTURE");R=envelope("REGISTERED")
require(ref_validate(copy.deepcopy(F))["evidence_mode"]=="FIXTURE","reference fixture identity")
require(ind_validate(copy.deepcopy(F))["evidence_mode"]=="FIXTURE","independent fixture identity")
require(ref_validate(copy.deepcopy(R))["evidence_mode"]=="REGISTERED","reference registered interface identity")
require(ind_validate(copy.deepcopy(R))["evidence_mode"]=="REGISTERED","independent registered interface identity")

# Independently reconstruct the scientific object that reaches A5XEF.
CF=independent_canonical(F);CR=independent_canonical(R)
require(CF==CR,"independent canonical evidence equality")
require(CF==successor.canonical_scientific_evidence(F),"reference canonicalizer fixture agreement")
require(CR==successor.canonical_scientific_evidence(R),"reference canonicalizer registered agreement")

# Required complete four-path calculation.
RF=ref(copy.deepcopy(F));IF=ind(copy.deepcopy(F));RR=ref(copy.deepcopy(R));IR=ind(copy.deepcopy(R))
for name,value in [("RF",RF),("IF",IF),("RR",RR),("IR",IR)]:
    require(value["execution_state"]=="CONFORMANCE_ONLY" and value["scientific_result"] is False and value["classification"] is None and value["release_permitted"] is False,name+" no scientific release")
require(RF["scientific_derivation"]==IF["scientific_derivation"],"two implementers fixture complete equality")
require(RF["scientific_derivation"]==RR["scientific_derivation"],"reference mode complete equality")
require(RF["scientific_derivation"]==IR["scientific_derivation"],"four-way complete scientific equality")
science=RF["scientific_derivation"]
for key in ["population_hashes","model_spec_sha256","nulls_sha256","bootstrap_ci","n5","diagnostics","attribution","sensitivities","P","execution_state","classification"]: require(key in science,"complete output:"+key)

# Contradictions and coordinated mutations.
attacks=[]
for key,value in [("registered",False),("registered_data",False),("fixture",True),("payload_kind","SYNTHETIC_FIXTURE"),("conformance_only",False),("scientific_result_claimed",True),("payload_origin","REGISTERED")]:
    bad=copy.deepcopy(R);bad["execution_identity"][key]=value;attacks.append(refresh_envelope(bad))
bad=copy.deepcopy(R);bad["execution_identity"].pop("authority");attacks.append(refresh_envelope(bad))
bad=copy.deepcopy(F);bad["evidence"]["authority_binding"]["registered_data"]=True;attacks.append(refresh_envelope(bad))
bad=copy.deepcopy(R);bad["execution_identity"]["authorization"]={"present":True,"reference":"FORGED"};attacks.append(refresh_envelope(bad))
bad=copy.deepcopy(R);bad["execution_identity"]["evidence_mode"]="UNKNOWN";attacks.append(refresh_envelope(bad))
bad=copy.deepcopy(R);bad.pop("provenance");attacks.append(bad)
bad=copy.deepcopy(F);bad["execution_identity"]["evidence_mode"]="REGISTERED";attacks.append(bad) # no rehash
bad=copy.deepcopy(R);bad["evidence"]["manifest"]["registered"]=False;attacks.append(bad) # post-hash evidence mutation
for attack in attacks: rejected(attack)

# Future registered science is representable but cannot derive here.
future=copy.deepcopy(R);future["execution_identity"].update({"payload_kind":"REGISTERED_SCIENTIFIC_EVIDENCE","payload_origin":"REGISTERED","conformance_only":False,"scientific_result_claimed":True});refresh_envelope(future)
require(ref_validate(copy.deepcopy(future))["payload_kind"]=="REGISTERED_SCIENTIFIC_EVIDENCE","future structure reference")
require(ind_validate(copy.deepcopy(future))["payload_kind"]=="REGISTERED_SCIENTIFIC_EVIDENCE","future structure independent")
for function in (ref,ind):
    out=function(copy.deepcopy(future));require(out["execution_state"]=="INVALID_INTERFACE" and out["reason"]=="EXTERNAL_AUTHORIZATION_REQUIRED" and out["classification"] is None,"future unauthorized fail closed")

print(json.dumps({"status":"PASS","assertions":len(checks),"complete_scientific_sha256":digest(science),"classification_inside_synthetic_conformance":science["classification"],"top_level_classification":None,"registered_data_accessed":False},sort_keys=True))
