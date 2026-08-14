#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
import unittest
from pathlib import Path

PKG=Path(__file__).resolve().parent.parent
LAB=PKG.parent
EXPECTED_LEDGER="aa279e0ef3d7bb9fea3c8c744c93284974c9d41fb51c038f70426816ce9c74ac"
EXPECTED_MACHINE="fc36caba5f2d16ffdde44d6740f368e2381f29c87a6b6aaa82b87eb7997687b4"
EXPECTED_ROOT="dc0b4bdd49ab269e2c1066414d8746697327d1d22ed9286584710daed1640423"

class Failure(ValueError): pass
def need(value,message):
    if not value: raise Failure(message)
def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def tree(path):
    root=Path(path);files=sorted(x for x in root.rglob("*") if x.is_file() and "__pycache__" not in x.parts)
    value="".join(f"{sha(x)}  {x.relative_to(root).as_posix()}\n" for x in files).encode()
    return len(files),hashlib.sha256(value).hexdigest()
def normalized_validator(path):
    data=Path(path).read_bytes();data=re.sub(rb'(EXPECTED_ROOT\s*=\s*)"[^"]+"',rb'\1"<NORMALIZED_A5XEFR_ROOT>"',data,count=1)
    return hashlib.sha256(data).hexdigest()

def verify_authority():
    path=PKG/"A5XEFR_TRANSITIVE_AUTHORITY_LEDGER.json";need(sha(path)==EXPECTED_LEDGER,"ledger seal");ledger=json.loads(path.read_text())
    for item in ledger["packages"]: need(tree(LAB/item["path"])==(item["count"],item["tree_sha256"]),"authority:"+item["path"])
    item=ledger["a5xef_declared_root"];need(sha(LAB/item["path"])==item["sha256"],"A5XEF root")

def verify_machine():
    path=PKG/"A5XEFR_MACHINE_READABLE_CONTRACT.json";need(sha(path)==EXPECTED_MACHINE,"machine seal");m=json.loads(path.read_text())
    need(m["scientific_change"] is False and m["modes"]==["FIXTURE","REGISTERED"],"machine identity")
    need(m["authorization"]=={"created_by_package":False,"schema_capability_is_authorization":False,"conformance_authorization_present":False},"authorization")

def verify_root():
    path=PKG/"A5XEFR_AUTHORITY_ROOT.json";need(sha(path)==EXPECTED_ROOT,"root seal");root=json.loads(path.read_text());need(root["member_count"]==len(root["members"]),"root count")
    for item in root["members"]:
        member=PKG/item["path"];got=normalized_validator(member) if item["mode"]=="NORMALIZED_VALIDATOR" else sha(member);need(member.stat().st_size==item["bytes"] and got==item["sha256"],"member:"+item["path"])
    actual={x.relative_to(PKG).as_posix() for x in PKG.rglob("*") if x.is_file() and x.name!="A5XEFR_AUTHORITY_ROOT.json" and "__pycache__" not in x.parts}
    need(actual=={x["path"] for x in root["members"]},"root membership")

def run_tests():
    sys.path.insert(0,str(PKG));suite=unittest.defaultTestLoader.loadTestsFromName("contract_validation.test_a5xefr")
    result=unittest.TextTestRunner(verbosity=1).run(suite);need(result.wasSuccessful(),"tests")

if __name__=="__main__":
    try:
        verify_authority();verify_machine();verify_root();run_tests();print("A5XEFR VALIDATION: PASS")
    except Exception as error:
        print("A5XEFR VALIDATION: FAIL",error);sys.exit(1)
