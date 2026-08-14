#!/usr/bin/env python3
import hashlib,json,sys,re
from pathlib import Path
import derive
PKG=Path(__file__).resolve().parent.parent;LAB=PKG.parent
EXPECTED_MACHINE="398ced9fa3c794d5fca871b9eb3e666d0fefc5da68b412c92029941b21c744b4"
EXPECTED_ROOT="2cb5c5df75639dd69534a1c084ab35cdc16f9e378d6888e0a5cb8c1b114598a8"
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def v1():
 r=LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1";fs=sorted([r/"EXP_00_R_FROZEN_CONFIG.yaml",r/"run_exp00r.py",r/"tests/test_exp00r.py",*list((r/"src").rglob("*.py"))],key=lambda p:p.relative_to(r).as_posix());return hashlib.sha256("".join(f"{sha(p)}  {p.relative_to(r).as_posix()}\n" for p in fs).encode()).hexdigest()
def no_authoritative_decisions(x,path=""):
 forbidden={"valid","gate_pass","P1","P2","P3","P4","P5","classification","all_sensitivities_complete","seed_dominance_pass","n5_pass"}
 if isinstance(x,dict):
  for k,v in x.items():
   if k in forbidden and "NONAUTHORITATIVE_CACHE" not in path:raise ValueError(f"producer decision {path}.{k}")
   no_authoritative_decisions(v,path+"."+k)
 elif isinstance(x,list):
  for i,v in enumerate(x):no_authoritative_decisions(v,f"{path}[{i}]")
def validate_machine():
 p=PKG/"A5XR_MACHINE_READABLE_RULES.yaml";d=json.loads(p.read_text())
 if sha(p)!=EXPECTED_MACHINE or d["schema"]!="A5XR_RAW_DERIVATION_V1" or d["scientific_change"] is not False or d["producer_decisions_authoritative"] is not False:raise ValueError("machine")
 return d
def normalized_validator(p):return hashlib.sha256(re.sub(rb'EXPECTED_ROOT="[^"]+"',b'EXPECTED_ROOT="<NORMALIZED_ROOT>"',Path(p).read_bytes(),count=1)).hexdigest()
def verify_root():
 p=PKG/"A5XR_AUTHORITY_ROOT.json";b=p.read_bytes()
 if hashlib.sha256(b).hexdigest()!=EXPECTED_ROOT:raise ValueError("A5XR root")
 r=json.loads(b)
 if r["hash_algorithm"]!="SHA-256" or r["member_count"]!=len(r["members"]):raise ValueError("root metadata")
 for x in r["members"]:
  q=PKG/x["path"]
  if not q.is_file() or q.stat().st_size!=x["bytes"]:raise ValueError("root member")
  got=normalized_validator(q) if x["mode"]=="NORMALIZED_VALIDATOR" else sha(q)
  if got!=x["sha256"]:raise ValueError("root hash")
def validate_all():
 if v1()!=derive.V1:raise ValueError("V1")
 if sha(LAB/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5X/A5X_AUTHORITY_ROOT.json")!=derive.A5X_ROOT:raise ValueError("A5X root")
 verify_root();validate_machine();b=json.loads((PKG/"fixtures/canonical_raw_artifact_bundle.json").read_text());no_authoritative_decisions(b);r=derive.end_to_end(b)
 if r["classification"]!="REPLICATED" or r["cross_system"]!="PARTIAL CROSS-SYSTEM REPLICATION" or not all(r["P"].values()):raise ValueError("derivation")
 return r
if __name__=="__main__":
 try:print("A5XR CONTRACT VALIDATION: PASS",validate_all())
 except Exception as e:print("A5XR CONTRACT VALIDATION: FAIL",e);sys.exit(1)
