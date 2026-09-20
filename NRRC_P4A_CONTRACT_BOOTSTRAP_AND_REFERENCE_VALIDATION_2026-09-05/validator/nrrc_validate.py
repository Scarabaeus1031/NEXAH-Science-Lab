#!/usr/bin/env python3
"""Deterministic NRRC 0.1-candidate reference validator.

Standard-library only. Format validity is not scientific truth.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import sys
from pathlib import Path
from typing import Any

SCHEMA_ID = "nexah.relation-record"
SCHEMA_VERSION = "0.1-candidate"
HASH_RE = re.compile(r"^sha256:[0-9a-f]{64}$")
MAX_INPUT_BYTES = 1_048_576
MAX_JSON_DEPTH = 64
MAX_COLLECTION_ITEMS = 10_000
MAX_STRING_CODEPOINTS = 65_536
MAX_PROVENANCE_STAGES = 256
MAX_RESIDUAL_COMPONENTS = 4_096

TYPE_NAMES = {
    "RelationRecordEnvelope", "CarrierStateRef", "FrameRef", "ApertureRef",
    "RepresentationRef", "TraceRecord", "TraceLocalDescriptor",
    "TraceSideStatus", "ILAUAuditRecord", "ResidualRecord",
    "ReturnTestRecord", "ProvenanceStage", "ClaimCeilingRef",
    "HumanAuthorityBoundary",
}


class DuplicateKeyError(ValueError):
    pass


def _pairs_no_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, value in pairs:
        if key in out:
            raise DuplicateKeyError(f"duplicate JSON key: {key}")
        out[key] = value
    return out


def _reject_constant(value: str) -> None:
    raise ValueError(f"nonfinite JSON number: {value}")


def load_json_strict(path: Path) -> Any:
    raw = path.read_bytes()
    if len(raw) > MAX_INPUT_BYTES:
        raise ValueError(f"input exceeds {MAX_INPUT_BYTES} bytes")
    return json.loads(
        raw.decode("utf-8"),
        object_pairs_hook=_pairs_no_duplicates,
        parse_constant=_reject_constant,
    )


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        allow_nan=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def envelope_hash(record: dict[str, Any]) -> str:
    basis = dict(record)
    basis.pop("content_hash", None)
    return "sha256:" + hashlib.sha256(canonical_bytes(basis)).hexdigest()


def _walk_limits(value: Any, errors: list[str], path: str = "$", depth: int = 0) -> None:
    if depth > MAX_JSON_DEPTH:
        errors.append(f"limit.depth:{path}")
        return
    if isinstance(value, str) and len(value) > MAX_STRING_CODEPOINTS:
        errors.append(f"limit.string:{path}")
    elif isinstance(value, float) and not math.isfinite(value):
        errors.append(f"number.nonfinite:{path}")
    elif isinstance(value, dict):
        if len(value) > MAX_COLLECTION_ITEMS:
            errors.append(f"limit.object_items:{path}")
        for key, item in value.items():
            _walk_limits(item, errors, f"{path}.{key}", depth + 1)
    elif isinstance(value, list):
        if len(value) > MAX_COLLECTION_ITEMS:
            errors.append(f"limit.array_items:{path}")
        for index, item in enumerate(value):
            _walk_limits(item, errors, f"{path}[{index}]", depth + 1)


def _object(value: Any, path: str, required: set[str], optional: set[str], errors: list[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        errors.append(f"type.object:{path}")
        return {}
    missing = sorted(required - value.keys())
    extra = sorted(value.keys() - required - optional)
    for key in missing:
        errors.append(f"required.missing:{path}.{key}")
    for key in extra:
        errors.append(f"field.undeclared:{path}.{key}")
    return value


def _nonempty(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not value:
        errors.append(f"string.nonempty:{path}")


def _hash(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not HASH_RE.fullmatch(value):
        errors.append(f"hash.malformed:{path}")


def validate_schema(schema: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(schema, dict):
        return ["schema.not_object"]
    if schema.get("$schema") != "https://json-schema.org/draft/2020-12/schema":
        errors.append("schema.draft")
    if schema.get("$id") != "nexah.relation-record/0.1-candidate":
        errors.append("schema.id")
    defs = schema.get("$defs")
    if not isinstance(defs, dict) or set(defs) != TYPE_NAMES:
        errors.append("schema.type_catalog")
        return errors
    if schema.get("$ref") != "#/$defs/RelationRecordEnvelope":
        errors.append("schema.root_ref")
    refs: set[str] = set()
    def walk(node: Any) -> None:
        if isinstance(node, dict):
            ref = node.get("$ref")
            if isinstance(ref, str) and ref.startswith("#/$defs/"):
                refs.add(ref.rsplit("/", 1)[-1])
            for item in node.values():
                walk(item)
        elif isinstance(node, list):
            for item in node:
                walk(item)
    walk(defs["RelationRecordEnvelope"])
    changed = True
    while changed:
        changed = False
        before = set(refs)
        for name in list(refs):
            walk(defs.get(name, {}))
        changed = refs != before
    if refs | {"RelationRecordEnvelope"} != TYPE_NAMES:
        errors.append("schema.types_not_reachable")
    return sorted(set(errors))


def validate_record(record: Any) -> list[str]:
    e: list[str] = []
    _walk_limits(record, e)
    root = _object(record, "$", {
        "schema_id", "schema_version", "record_id", "record_version", "record_class",
        "carrier_state_ref", "frame_ref", "aperture_ref", "representation_ref",
        "trace_record", "ilau_audit_record", "residual_record", "return_test_record",
        "provenance_stages", "claim_ceiling_ref", "human_authority_boundary",
        "source_hashes", "content_hash",
    }, {"supersedes_record_ref", "declared_extensions", "producer_note"}, e)
    if root.get("schema_id") != SCHEMA_ID: e.append("schema_id.unsupported")
    if root.get("schema_version") != SCHEMA_VERSION: e.append("schema_version.unsupported")
    if root.get("record_class") != "TRACE_AUDIT_RESIDUAL_RETURN": e.append("record_class.invalid")
    extensions = root.get("declared_extensions")
    if extensions is not None:
        if not isinstance(extensions, dict): e.append("extension.type")
        elif extensions: e.append("extension.unregistered")
    for key in ("record_id", "record_version"):
        _nonempty(root.get(key), f"$.{key}", e)
    _hash(root.get("content_hash"), "$.content_hash", e)
    source_hashes = root.get("source_hashes")
    if not isinstance(source_hashes, list) or not source_hashes:
        e.append("source_hashes.missing")
    else:
        for i, value in enumerate(source_hashes): _hash(value, f"$.source_hashes[{i}]", e)
        if len(source_hashes) != len(set(map(str, source_hashes))): e.append("source_hashes.duplicate")

    carrier = _object(root.get("carrier_state_ref"), "$.carrier_state_ref", {"carrier_id", "carrier_identity_domain", "state_id", "state_version", "source_ref", "source_hash"}, {"state_order"}, e)
    frame = _object(root.get("frame_ref"), "$.frame_ref", {"frame_id", "frame_version", "source_ref", "source_hash", "orientation_convention_ref", "scale_ref"}, {"parent_frame_ref"}, e)
    aperture = _object(root.get("aperture_ref"), "$.aperture_ref", {"aperture_id", "aperture_version", "frame_id", "source_ref", "source_hash"}, {"selection_summary"}, e)
    representation = _object(root.get("representation_ref"), "$.representation_ref", {"representation_id", "representation_version", "representation_type", "source_state_id", "producer_id", "content_hash"}, {"mapping_ref"}, e)
    for obj, path, strings, hashes in [
        (carrier, "carrier_state_ref", ("carrier_id", "carrier_identity_domain", "state_id", "state_version", "source_ref"), ("source_hash",)),
        (frame, "frame_ref", ("frame_id", "frame_version", "source_ref", "orientation_convention_ref", "scale_ref"), ("source_hash",)),
        (aperture, "aperture_ref", ("aperture_id", "aperture_version", "frame_id", "source_ref"), ("source_hash",)),
        (representation, "representation_ref", ("representation_id", "representation_version", "representation_type", "source_state_id", "producer_id"), ("content_hash",)),
    ]:
        for key in strings: _nonempty(obj.get(key), f"$.{path}.{key}", e)
        for key in hashes: _hash(obj.get(key), f"$.{path}.{key}", e)
    if carrier.get("carrier_id") == carrier.get("state_id"): e.append("identity.carrier_equals_state")
    if aperture.get("frame_id") != frame.get("frame_id"): e.append("reference.aperture_frame")
    if representation.get("source_state_id") != carrier.get("state_id"): e.append("reference.representation_state")
    if frame.get("parent_frame_ref") == frame.get("frame_id"): e.append("reference.frame_cycle")

    trace = _object(root.get("trace_record"), "$.trace_record", {"trace_id", "trace_version", "carrier_id", "state_id", "frame_id", "aperture_id", "representation_id", "local_descriptor", "side_status"}, {"measurement_ref"}, e)
    expected_trace_refs = {"carrier_id": carrier.get("carrier_id"), "state_id": carrier.get("state_id"), "frame_id": frame.get("frame_id"), "aperture_id": aperture.get("aperture_id"), "representation_id": representation.get("representation_id")}
    for key, expected in expected_trace_refs.items():
        if trace.get(key) != expected: e.append(f"reference.trace_{key}")
    descriptor = _object(trace.get("local_descriptor"), "$.trace_record.local_descriptor", {"P", "D", "C", "Phi", "S"}, set(), e)
    for key in ("P", "D", "C", "Phi", "S"):
        measure = _object(descriptor.get(key), f"$.trace_record.local_descriptor.{key}", {"value", "value_type", "unit_or_scale_ref"}, set(), e)
        _nonempty(measure.get("value_type"), f"$.trace_record.local_descriptor.{key}.value_type", e)
        _nonempty(measure.get("unit_or_scale_ref"), f"$.trace_record.local_descriptor.{key}.unit_or_scale_ref", e)
    if trace.get("side_status") not in {"IN", "OUT", "CROSSING", "UNRESOLVED"}: e.append("side_status.invalid")

    audit = _object(root.get("ilau_audit_record"), "$.ilau_audit_record", {"audit_id", "audit_version", "reference_id", "representation_id", "audit_universe", "criteria_ref", "I", "L", "A", "U", "completeness_status"}, set(), e)
    if audit.get("representation_id") != representation.get("representation_id"): e.append("reference.audit_representation")
    buckets = []
    for key in ("I", "L", "A", "U"):
        value = audit.get(key)
        if not isinstance(value, list): e.append(f"ilau.bucket_type:{key}"); value = []
        buckets.extend(value)
        if len(value) != len(set(map(str, value))): e.append(f"ilau.bucket_duplicate:{key}")
    universe = audit.get("audit_universe")
    if not isinstance(universe, list): e.append("ilau.universe_type"); universe = []
    if len(buckets) != len(set(map(str, buckets))): e.append("ilau.cross_bucket_duplicate")
    if audit.get("completeness_status") == "COMPLETE" and set(buckets) != set(universe): e.append("ilau.partition_incomplete")
    if not set(buckets) <= set(universe): e.append("ilau.outside_universe")

    residual = _object(root.get("residual_record"), "$.residual_record", {"residual_id", "residual_version", "reference_id", "observed_id", "components", "component_count", "unit_policy"}, {"aggregation"}, e)
    components = residual.get("components")
    if not isinstance(components, list): e.append("residual.components_type"); components = []
    if len(components) > MAX_RESIDUAL_COMPONENTS: e.append("residual.limit")
    if residual.get("component_count") != len(components): e.append("residual.count")
    component_ids: list[str] = []
    for index, component in enumerate(components):
        c = _object(component, f"$.residual_record.components[{index}]", {"component_id", "residual_type", "value", "unit", "reference_path", "observed_path"}, set(), e)
        component_ids.append(str(c.get("component_id")))
        for key in ("component_id", "residual_type", "unit", "reference_path", "observed_path"): _nonempty(c.get(key), f"$.residual_record.components[{index}].{key}", e)
        if not isinstance(c.get("value"), (int, float)) or isinstance(c.get("value"), bool): e.append(f"residual.value_type:{index}")
    if len(component_ids) != len(set(component_ids)): e.append("residual.component_id_duplicate")

    ret = _object(root.get("return_test_record"), "$.return_test_record", {"return_test_id", "return_test_version", "route_id", "start_state_id", "returned_state_id", "comparison_frame_id", "metric_id", "metric_version", "tolerance", "observed_residual", "decision_status", "residual_id"}, {"decision_reason_ref"}, e)
    if ret.get("start_state_id") != carrier.get("state_id"): e.append("reference.return_start_state")
    if ret.get("comparison_frame_id") != frame.get("frame_id"): e.append("reference.return_frame")
    if ret.get("residual_id") != residual.get("residual_id"): e.append("reference.return_residual")
    tolerance, observed, status = ret.get("tolerance"), ret.get("observed_residual"), ret.get("decision_status")
    if not isinstance(tolerance, (int, float)) or isinstance(tolerance, bool) or not math.isfinite(tolerance) or tolerance < 0: e.append("return.tolerance_invalid")
    if observed is not None and (not isinstance(observed, (int, float)) or isinstance(observed, bool) or not math.isfinite(observed) or observed < 0): e.append("return.observed_invalid")
    if isinstance(tolerance, (int, float)) and math.isfinite(tolerance) and tolerance >= 0:
        expected = "UNRESOLVED" if observed is None else ("BOUNDED_LOCK" if observed <= tolerance else "OPEN_RESIDUAL")
        if status != expected: e.append("return.decision_inconsistent")

    ceiling = _object(root.get("claim_ceiling_ref"), "$.claim_ceiling_ref", {"claim_ceiling_id", "claim_ceiling_version", "value", "authority_ref", "content_hash"}, {"expires_or_supersedes_ref"}, e)
    _hash(ceiling.get("content_hash"), "$.claim_ceiling_ref.content_hash", e)
    if ceiling.get("value") not in {"FORMAT_VALIDITY_ONLY", "DOCUMENTARY_CONTRACT_VALIDITY_ONLY"}: e.append("claim_ceiling.raised")
    authority = _object(root.get("human_authority_boundary"), "$.human_authority_boundary", {"human_authority_ref", "authority_scope", "allowed_decisions", "machine_claim_authority", "processor_decision_authority", "display_decision_authority"}, {"receipt_contract_ref"}, e)
    if set(authority.get("allowed_decisions", [])) != {"STOP", "CONTINUE", "ADOPT", "REJECT"}: e.append("human_authority.decisions")
    for key in ("machine_claim_authority", "processor_decision_authority", "display_decision_authority"):
        if authority.get(key) is not False: e.append(f"human_authority.flag:{key}")

    ids = [root.get("record_id"), carrier.get("carrier_id"), carrier.get("state_id"), frame.get("frame_id"), aperture.get("aperture_id"), representation.get("representation_id"), trace.get("trace_id"), audit.get("audit_id"), residual.get("residual_id"), ret.get("return_test_id"), ceiling.get("claim_ceiling_id")]
    stages = root.get("provenance_stages")
    if not isinstance(stages, list) or not stages: e.append("provenance.missing"); stages = []
    if len(stages) > MAX_PROVENANCE_STAGES: e.append("provenance.limit")
    stage_ids: list[Any] = []
    stage_orders: list[Any] = []
    known_refs = set(str(x) for x in ids if x) | {str(ret.get("returned_state_id"))}
    required_outputs = {str(representation.get("representation_id")), str(trace.get("trace_id")), str(audit.get("audit_id")), str(residual.get("residual_id")), str(ret.get("return_test_id"))}
    outputs: set[str] = set()
    previous_stage_id = None
    for index, stage in enumerate(stages):
        s = _object(stage, f"$.provenance_stages[{index}]", {"stage_id", "stage_order", "input_refs", "output_ref", "operator_or_process_ref", "producer_id", "contract_id", "contract_version", "source_hashes", "output_hash", "lossiness"}, {"timestamp", "prior_stage_ref"}, e)
        stage_ids.append(s.get("stage_id")); stage_orders.append(s.get("stage_order")); outputs.add(str(s.get("output_ref")))
        if index == 0 and "prior_stage_ref" in s: e.append("provenance.first_has_prior")
        if index > 0 and s.get("prior_stage_ref") != previous_stage_id: e.append(f"provenance.prior:{index}")
        previous_stage_id = s.get("stage_id")
        for ref in s.get("input_refs", []) if isinstance(s.get("input_refs"), list) else []:
            if str(ref) not in known_refs and str(ref) not in outputs: e.append(f"reference.provenance_input:{index}")
        if str(s.get("output_ref")) not in known_refs: e.append(f"reference.provenance_output:{index}")
        _hash(s.get("output_hash"), f"$.provenance_stages[{index}].output_hash", e)
        for hindex, value in enumerate(s.get("source_hashes", []) if isinstance(s.get("source_hashes"), list) else []): _hash(value, f"$.provenance_stages[{index}].source_hashes[{hindex}]", e)
    if stage_orders != list(range(len(stages))): e.append("provenance.order")
    if len(stage_ids) != len(set(map(str, stage_ids))): e.append("provenance.stage_id_duplicate")
    if not required_outputs <= outputs: e.append("provenance.required_outputs")
    ids.extend(stage_ids)
    clean_ids = [str(x) for x in ids if isinstance(x, str) and x]
    if len(clean_ids) != len(set(clean_ids)): e.append("identifier.duplicate")

    if isinstance(record, dict) and isinstance(root.get("content_hash"), str):
        try:
            if root.get("content_hash") != envelope_hash(root): e.append("content_hash.mismatch")
        except (TypeError, ValueError):
            e.append("content_hash.uncomputable")
    return sorted(set(e))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("record", type=Path)
    parser.add_argument("--schema", type=Path)
    args = parser.parse_args(argv)
    result: dict[str, Any] = {"record": str(args.record), "valid": False, "errors": []}
    try:
        record = load_json_strict(args.record)
        errors = validate_record(record)
        if args.schema:
            errors.extend(validate_schema(load_json_strict(args.schema)))
        result["errors"] = sorted(set(errors))
        result["valid"] = not result["errors"]
    except (OSError, UnicodeError, ValueError, json.JSONDecodeError) as exc:
        result["errors"] = [f"parse:{exc}"]
    print(json.dumps(result, sort_keys=True, separators=(",", ":")))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
