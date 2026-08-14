from __future__ import annotations

import copy
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import a5xefr_schema as raw
sys.path.insert(0, str(raw.A5XEF / "contract_validation"))
from derive_a5xef_independent import derive as scientific_path


class Rejected(ValueError): pass
def check(condition, label):
    if not condition: raise Rejected(label)


def audit(bundle):
    check(bundle.get("schema") == raw.SCHEMA and sorted(bundle) == ["evidence", "execution_identity", "provenance", "schema"], "envelope")
    mode = bundle["execution_identity"]
    check(bundle["provenance"].get("identity_sha256") == raw.digest(mode) and bundle["provenance"].get("evidence_sha256") == raw.digest(bundle["evidence"]) and len(bundle["provenance"]) == 2, "hashes")
    authority = mode.get("authority", {})
    check(authority.get("a5xef_root_sha256") == raw.A5XEF_ROOT and authority.get("a5xef_review_tree_sha256") == raw.A5XEF_REVIEW_TREE and len(authority) == 2, "authority")
    authorization = mode.get("authorization", {})
    check(authorization.get("present") is False and authorization.get("reference") is None and len(authorization) == 2, "not authorized")
    if mode.get("evidence_mode") == "FIXTURE": expected = {"registered":False,"registered_data":False,"fixture":True,"payload_kind":"SYNTHETIC_FIXTURE","payload_origin":"SYNTHETIC","conformance_only":True,"scientific_result_claimed":False}
    elif mode.get("evidence_mode") == "REGISTERED" and mode.get("payload_kind") == "SYNTHETIC_REGISTERED_INTERFACE_CONFORMANCE": expected = {"registered":True,"registered_data":True,"fixture":False,"payload_kind":"SYNTHETIC_REGISTERED_INTERFACE_CONFORMANCE","payload_origin":"SYNTHETIC","conformance_only":True,"scientific_result_claimed":False}
    elif mode.get("evidence_mode") == "REGISTERED" and mode.get("payload_kind") == "REGISTERED_SCIENTIFIC_EVIDENCE": expected = {"registered":True,"registered_data":True,"fixture":False,"payload_kind":"REGISTERED_SCIENTIFIC_EVIDENCE","payload_origin":"REGISTERED","conformance_only":False,"scientific_result_claimed":True}
    else: raise Rejected("mode")
    check(all(mode.get(k) == v for k,v in expected.items()), "mode tuple")
    ev = bundle["evidence"]
    check(ev["manifest"].get("registered") == expected["registered"], "manifest")
    check(ev["authority_binding"] == {"v1_composite":raw.base.V1,"registered_data":expected["registered_data"],"fixture":expected["fixture"]}, "binding")
    return copy.deepcopy(mode)


def derive(bundle):
    try:
        mode = audit(bundle)
        check(mode["payload_kind"] != "REGISTERED_SCIENTIFIC_EVIDENCE", "EXTERNAL_AUTHORIZATION_REQUIRED")
        science = scientific_path(raw.canonical_scientific_evidence(bundle))
        check(science["execution_state"] == "VALID_SCIENTIFIC_RESULT", "scientific evidence")
        return {"execution_state":"CONFORMANCE_ONLY","scientific_result":False,"classification":None,"release_permitted":False,"identity":mode,"scientific_derivation":science}
    except (Rejected, KeyError, TypeError, ValueError) as error:
        return {"execution_state":"INVALID_INTERFACE","scientific_result":False,"classification":None,"release_permitted":False,"reason":str(error)}
