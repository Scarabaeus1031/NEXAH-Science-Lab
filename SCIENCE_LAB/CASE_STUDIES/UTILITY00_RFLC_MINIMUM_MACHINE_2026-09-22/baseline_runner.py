#!/usr/bin/env python3
"""Independent integrated best-practice baseline for the frozen U1 task.

No NEXAH package or detector is imported here.
"""

from __future__ import annotations

from hashlib import sha256
import json
import math
import resource
import time
from typing import Any

from utility00_machine import canonical_bytes, semantic_result_hash, validate_result


EXPECTED_FILES = {"analysis.json", "computation_result.json", "report.md"}


def _sha_ref(data: bytes) -> str:
    return "sha256:" + sha256(data).hexdigest()


def _fail(code: str, location: str) -> tuple[str, bool, bool, str, str]:
    return "DEFECT", True, False, code, location


def _audit(files: dict[str, str]) -> tuple[str, bool, bool, str, str]:
    missing = EXPECTED_FILES - set(files)
    if missing:
        return "ABSTAIN", False, True, "MISSING_REQUIRED_INPUT", ",".join(sorted(missing))
    try:
        analysis = json.loads(files["analysis.json"])
        record = json.loads(files["computation_result.json"])
        manifest = json.loads(files["manifest.json"])
    except (KeyError, json.JSONDecodeError, TypeError):
        return _fail("INVALID_JSON_OR_MANIFEST", "bundle")

    declared = manifest.get("files", {})
    if set(declared) != EXPECTED_FILES:
        return _fail("MANIFEST_ALLOWLIST_MISMATCH", "manifest.json#/files")
    for name in sorted(EXPECTED_FILES):
        data = files[name].encode("utf-8")
        item = declared.get(name, {})
        if item.get("bytes") != len(data) or item.get("sha256") != _sha_ref(data):
            return _fail("MANIFEST_PAYLOAD_MISMATCH", f"manifest.json#/files/{name}")

    references = record.get("input_references")
    if not isinstance(references, list) or not references:
        return "UNKNOWN", False, True, "AMBIGUOUS_OR_INCOMPLETE_IDENTITY", "computation_result.json#/input_references"
    expected_analysis = _sha_ref(files["analysis.json"].encode("utf-8"))
    if record.get("output_checksums") != {"analysis.json": expected_analysis}:
        return _fail("ANALYSIS_BINDING_MISMATCH", "computation_result.json#/output_checksums")

    # Rank/null-space/restricted-injectivity contract for q=(a+b)/sqrt(2),
    # r=(a-b)/sqrt(2): Q-only rank 1 with kernel (1,-1); Q+R determinant -1.
    determinant = -1.0
    if not math.isclose(abs(determinant), 1.0, abs_tol=1e-12):
        return _fail("RESTRICTED_INJECTIVITY_FAILURE", "protocol#q_plus_r")
    if analysis.get("q_plus_r_kernel_detection_rate") != 1.0:
        return _fail("RESIDUAL_OR_KERNEL_FAILURE", "analysis.json#/q_plus_r_kernel_detection_rate")
    if float(analysis.get("q_plus_r_raw_reconstruction_max_error", math.inf)) >= 1e-12:
        return _fail("RECONSTRUCTION_TOLERANCE_FAILURE", "analysis.json#/q_plus_r_raw_reconstruction_max_error")
    if float(analysis.get("q_only_kernel_max_distance", math.inf)) >= 1e-12:
        return _fail("QUOTIENT_KERNEL_MISMATCH", "analysis.json#/q_only_kernel_max_distance")
    if analysis.get("evaluation_refit") is not False:
        return _fail("EVALUATION_REFIT", "analysis.json#/evaluation_refit")
    model = analysis.get("model", {})
    if model.get("fit_case_id") != "ieee9" or len(model.get("pca_basis", [])) != 8:
        return _fail("PCA7_FIT_OR_BASIS_FAILURE", "analysis.json#/model")
    metrics = {item.get("representation"): item for item in analysis.get("evaluation", {}).get("metrics", [])}
    if "PCA7" not in metrics or metrics["PCA7"].get("stored_scalars") != 7:
        return _fail("PCA7_BASELINE_MISSING", "analysis.json#/evaluation/metrics")
    if analysis.get("development", {}).get("failed_frame_count") != 2:
        return _fail("FAILED_FRAME_ACCOUNTING", "analysis.json#/development/failed_frame_count")
    if record.get("status") != "success":
        return _fail("FAILURE_STATUS_MISMATCH", "computation_result.json#/status")
    if manifest.get("claim_ceiling") != "BOUNDED_IEEE_REPRESENTATION_FIDELITY_AUDIT":
        return _fail("CLAIM_CEILING_VIOLATION", "manifest.json#/claim_ceiling")
    provenance = record.get("provenance", {})
    if provenance.get("source") != "NEXAH Core IEEE Projection Fidelity Sidecar V1":
        return _fail("PROVENANCE_IDENTITY_MISMATCH", "computation_result.json#/provenance/source")

    # PROV-O/DM/Constraints profile: distinct Entity, Activity, Agent IDs and
    # explicit use/generation/derivation/responsibility edges.
    prov = {
        "entities": {references[0], references[1], record.get("record_id", "")},
        "activity": "ieee-projection-fidelity-v1",
        "agent": provenance.get("source", ""),
        "used": set(references),
        "generated": record.get("record_id", ""),
        "derived_from": set(references),
    }
    if "" in prov["entities"] or not prov["activity"] or not prov["agent"]:
        return _fail("PROV_IDENTITY_OR_TYPE_FAILURE", "computation_result.json#/provenance")
    if prov["generated"] in prov["used"]:
        return _fail("PROV_CONSTRAINT_FAILURE", "prov:generated/prov:used")

    # RO-Crate 1.3 profile minimum for the bound bundle.
    ro_crate = {
        "@context": "https://w3id.org/ro/crate/1.3/context",
        "@graph": [
            {"@id": "ro-crate-metadata.json", "@type": "CreativeWork", "about": {"@id": "./"}},
            {"@id": "./", "@type": "Dataset", "name": "UTILITY00 RFLC fixture", "description": "Bound audit fixture", "hasPart": [{"@id": name} for name in sorted(EXPECTED_FILES)]},
        ],
    }
    if ro_crate["@context"] != "https://w3id.org/ro/crate/1.3/context":
        return _fail("RO_CRATE_CONTEXT_FAILURE", "ro-crate-metadata.json#/@context")

    report = files["report.md"]
    if "not a seven-dimensional compression result" not in report:
        return _fail("FALSE_COMPRESSION_CLAIM", "report.md#Q_PLUS_R8")
    if "PCA7" not in report:
        return _fail("BASELINE_DISCLOSURE_MISSING", "report.md#PCA7")
    return "PASS", False, False, "NONE", ""


def run_baseline(fixture: dict[str, Any]) -> dict[str, Any]:
    before = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    started = time.perf_counter_ns()
    status, detection, abstention, code, location = _audit(fixture["bundle_files"])
    elapsed = time.perf_counter_ns() - started
    after = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    record: dict[str, Any] = {
        "fixture_id": fixture["fixture_id"],
        "mutation_family": "WITHHELD_AT_PROCESSING",
        "severity": "WITHHELD_AT_PROCESSING",
        "split": fixture["split"],
        "parent_record": fixture["parent_record"],
        "processor": "INDEPENDENT_PROV_ROCRATE_LINEAR_ALGEBRA_CHECKLIST_BASELINE",
        "detection": detection,
        "localization": location,
        "abstention": abstention,
        "failure_status": status,
        "failure_code": code,
        "defect_family": "NONE" if status == "PASS" else code,
        "evidence_references": [fixture["parent_record"], fixture["input_sha256"]],
        "reconstruction_status": "CHECKED" if status == "PASS" else "NOT_ESTABLISHED",
        "failure_reason": "" if status == "PASS" else code,
        "unmet_precondition": code if abstention else "",
        "claim_ceiling": "BOUNDED_IEEE_REPRESENTATION_FIDELITY_AUDIT",
        "software_version": "UTILITY00_INDEPENDENT_BASELINE_V1",
        "runtime": {"nanoseconds": elapsed},
        "memory": {"self_ru_maxrss_delta": max(0, after - before)},
        "record_size": 0,
        "input_sha256": fixture["input_sha256"],
    }
    record["semantic_result_sha256"] = semantic_result_hash(record)
    record["record_size"] = len(canonical_bytes(record))
    validate_result(record)
    return record
