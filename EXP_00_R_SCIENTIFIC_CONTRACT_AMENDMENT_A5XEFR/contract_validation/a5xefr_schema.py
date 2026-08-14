from __future__ import annotations

import copy
import hashlib
import json
import sys
from pathlib import Path

PKG = Path(__file__).resolve().parent.parent
LAB = PKG.parent
A5XEF = LAB / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEF"
sys.path.insert(0, str(A5XEF / "contract_validation"))
import a5xef_schema as base

SCHEMA = "A5XEFR_GENERIC_RAW_EVIDENCE_V1"
A5XEF_ROOT = "2ad14eb49253523bae79511a07f85b53ab6ed1cd81bcddfced61d5732bed82dd"
A5XEF_REVIEW_TREE = "38447803d168a16e865e4747aff41353c59c30283b25644ae6cc820cf58b516f"


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()).hexdigest()


def refresh(wrapper):
    wrapper["provenance"] = {
        "identity_sha256": digest(wrapper["execution_identity"]),
        "evidence_sha256": digest(wrapper["evidence"]),
    }
    return wrapper


def identity(mode):
    common = {
        "authority": {"a5xef_root_sha256": A5XEF_ROOT, "a5xef_review_tree_sha256": A5XEF_REVIEW_TREE},
        "authorization": {"present": False, "reference": None},
        "conformance_only": True,
        "scientific_result_claimed": False,
    }
    if mode == "FIXTURE":
        return {"evidence_mode": mode, "registered": False, "registered_data": False, "fixture": True, "payload_kind": "SYNTHETIC_FIXTURE", "payload_origin": "SYNTHETIC", **common}
    if mode == "REGISTERED":
        return {"evidence_mode": mode, "registered": True, "registered_data": True, "fixture": False, "payload_kind": "SYNTHETIC_REGISTERED_INTERFACE_CONFORMANCE", "payload_origin": "SYNTHETIC", **common}
    raise ValueError("mode")


def build(mode="FIXTURE", namespace="F47_FIXTURE"):
    evidence = base.build_bundle(namespace)
    ident = identity(mode)
    evidence["manifest"]["registered"] = ident["registered"]
    evidence["authority_binding"] = {
        "v1_composite": base.V1,
        "registered_data": ident["registered_data"],
        "fixture": ident["fixture"],
    }
    base.refresh_provenance(evidence, "manifest", "authority_binding")
    return refresh({"schema": SCHEMA, "execution_identity": ident, "evidence": evidence, "provenance": {}})


def canonical_scientific_evidence(wrapper):
    evidence = copy.deepcopy(wrapper["evidence"])
    evidence["manifest"]["registered"] = False
    evidence["authority_binding"] = {"v1_composite": base.V1, "registered_data": False, "fixture": True}
    base.refresh_provenance(evidence, "manifest", "authority_binding")
    return evidence
