from __future__ import annotations

import copy
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import a5xefr_schema as s
sys.path.insert(0, str(s.A5XEF / "contract_validation"))
from derive_a5xef_reference import derive as scientific_derive


class IdentityError(ValueError): pass
def need(value, message):
    if not value: raise IdentityError(message)


def validate(wrapper):
    need(wrapper.get("schema") == s.SCHEMA and set(wrapper) == {"schema", "execution_identity", "evidence", "provenance"}, "wrapper")
    ident = wrapper["execution_identity"]
    need(wrapper["provenance"] == {"identity_sha256": s.digest(ident), "evidence_sha256": s.digest(wrapper["evidence"])}, "provenance")
    need(ident.get("authority") == {"a5xef_root_sha256": s.A5XEF_ROOT, "a5xef_review_tree_sha256": s.A5XEF_REVIEW_TREE}, "authority")
    need(ident.get("authorization") == {"present": False, "reference": None}, "authorization")
    evidence = wrapper["evidence"]; manifest = evidence["manifest"]; binding = evidence["authority_binding"]
    if ident.get("evidence_mode") == "FIXTURE":
        expected = (False, False, True, "SYNTHETIC_FIXTURE", "SYNTHETIC", True, False)
    elif ident.get("evidence_mode") == "REGISTERED" and ident.get("payload_kind") == "SYNTHETIC_REGISTERED_INTERFACE_CONFORMANCE":
        expected = (True, True, False, "SYNTHETIC_REGISTERED_INTERFACE_CONFORMANCE", "SYNTHETIC", True, False)
    elif ident.get("evidence_mode") == "REGISTERED" and ident.get("payload_kind") == "REGISTERED_SCIENTIFIC_EVIDENCE":
        expected = (True, True, False, "REGISTERED_SCIENTIFIC_EVIDENCE", "REGISTERED", False, True)
    else: raise IdentityError("mode")
    actual = (ident.get("registered"), ident.get("registered_data"), ident.get("fixture"), ident.get("payload_kind"), ident.get("payload_origin"), ident.get("conformance_only"), ident.get("scientific_result_claimed"))
    need(actual == expected, "identity predicates")
    need(manifest.get("registered") == ident["registered"], "manifest identity")
    need(binding == {"v1_composite": s.base.V1, "registered_data": ident["registered_data"], "fixture": ident["fixture"]}, "evidence authority")
    return copy.deepcopy(ident)


def derive(wrapper):
    try:
        ident = validate(wrapper)
        need(ident["payload_kind"] != "REGISTERED_SCIENTIFIC_EVIDENCE", "EXTERNAL_AUTHORIZATION_REQUIRED")
        scientific = scientific_derive(s.canonical_scientific_evidence(wrapper))
        need(scientific["execution_state"] == "VALID_SCIENTIFIC_RESULT", "scientific evidence")
        return {"execution_state": "CONFORMANCE_ONLY", "scientific_result": False, "classification": None, "release_permitted": False, "identity": ident, "scientific_derivation": scientific}
    except (IdentityError, KeyError, TypeError, ValueError) as error:
        return {"execution_state": "INVALID_INTERFACE", "scientific_result": False, "classification": None, "release_permitted": False, "reason": str(error)}
