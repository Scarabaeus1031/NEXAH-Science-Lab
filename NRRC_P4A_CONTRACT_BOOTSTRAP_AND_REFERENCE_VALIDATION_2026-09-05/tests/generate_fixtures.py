#!/usr/bin/env python3
"""Generate the one canonical positive and bounded negative NRRC fixtures."""

from __future__ import annotations

import copy
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "validator"))
from nrrc_validate import canonical_bytes, envelope_hash  # noqa: E402

H0 = "sha256:" + hashlib.sha256(b"nrrc-p4a-synthetic-source").hexdigest()
H1 = "sha256:" + hashlib.sha256(b"nrrc-p4a-synthetic-representation").hexdigest()
HC = "sha256:" + hashlib.sha256(b"documentary-contract-validity-only").hexdigest()


def positive_record() -> dict:
    record = {
        "schema_id": "nexah.relation-record",
        "schema_version": "0.1-candidate",
        "record_id": "urn:nexah:nrrc:record:p4a-positive-001",
        "record_version": "1",
        "record_class": "TRACE_AUDIT_RESIDUAL_RETURN",
        "carrier_state_ref": {
            "carrier_id": "urn:nexah:nrrc:carrier:synthetic-001",
            "carrier_identity_domain": "synthetic.p4a",
            "state_id": "urn:nexah:nrrc:state:start-001",
            "state_version": "1",
            "source_ref": "synthetic://p4a/source-001",
            "source_hash": H0,
            "state_order": 0,
        },
        "frame_ref": {
            "frame_id": "urn:nexah:nrrc:frame:local-001",
            "frame_version": "1",
            "source_ref": "synthetic://p4a/frame-001",
            "source_hash": H0,
            "orientation_convention_ref": "synthetic.orientation/right-handed",
            "scale_ref": "synthetic.scale/unitless",
        },
        "aperture_ref": {
            "aperture_id": "urn:nexah:nrrc:aperture:cut-001",
            "aperture_version": "1",
            "frame_id": "urn:nexah:nrrc:frame:local-001",
            "source_ref": "synthetic://p4a/aperture-001",
            "source_hash": H0,
            "selection_summary": "Synthetic bounded cut; no ontology claim.",
        },
        "representation_ref": {
            "representation_id": "urn:nexah:nrrc:representation:trace-view-001",
            "representation_version": "1",
            "representation_type": "SYNTHETIC_LOCAL_TRACE",
            "source_state_id": "urn:nexah:nrrc:state:start-001",
            "producer_id": "synthetic-producer:p4a",
            "content_hash": H1,
            "mapping_ref": "synthetic.mapping/local-projection-1",
        },
        "trace_record": {
            "trace_id": "urn:nexah:nrrc:trace:trace-001",
            "trace_version": "1",
            "carrier_id": "urn:nexah:nrrc:carrier:synthetic-001",
            "state_id": "urn:nexah:nrrc:state:start-001",
            "frame_id": "urn:nexah:nrrc:frame:local-001",
            "aperture_id": "urn:nexah:nrrc:aperture:cut-001",
            "representation_id": "urn:nexah:nrrc:representation:trace-view-001",
            "local_descriptor": {
                "P": {"value": [0.0, 0.0], "value_type": "POINT_2D", "unit_or_scale_ref": "synthetic.scale/unitless"},
                "D": {"value": [1.0, 0.0], "value_type": "DIRECTION_2D", "unit_or_scale_ref": "synthetic.scale/unit-vector"},
                "C": {"value": 0.125, "value_type": "SCALAR_CURVATURE", "unit_or_scale_ref": "synthetic.scale/inverse-unit"},
                "Phi": {"value": 0.25, "value_type": "NORMALIZED_PHASE", "unit_or_scale_ref": "synthetic.scale/cycle"},
                "S": {"value": 1.0, "value_type": "SCALAR_SCALE", "unit_or_scale_ref": "synthetic.scale/unitless"},
            },
            "side_status": "IN",
            "measurement_ref": "synthetic.measurement/p4a-001",
        },
        "ilau_audit_record": {
            "audit_id": "urn:nexah:nrrc:ilau-audit:audit-001",
            "audit_version": "1",
            "reference_id": "synthetic.reference/trace-baseline-001",
            "representation_id": "urn:nexah:nrrc:representation:trace-view-001",
            "audit_universe": ["measure:P", "measure:D", "measure:C", "measure:Phi", "measure:S"],
            "criteria_ref": "synthetic.criteria/exact-declared-retention-1",
            "I": ["measure:P", "measure:D", "measure:C", "measure:Phi", "measure:S"],
            "L": [], "A": [], "U": [],
            "completeness_status": "COMPLETE",
        },
        "residual_record": {
            "residual_id": "urn:nexah:nrrc:residual:return-001",
            "residual_version": "1",
            "reference_id": "urn:nexah:nrrc:state:start-001",
            "observed_id": "urn:nexah:nrrc:state:return-001",
            "components": [{
                "component_id": "residual-component:return-distance",
                "residual_type": "RETURN_DISTANCE",
                "value": 0.1,
                "unit": "synthetic.unitless",
                "reference_path": "carrier_state_ref.state_id",
                "observed_path": "return_test_record.returned_state_id",
            }],
            "component_count": 1,
            "unit_policy": "DECLARED_PER_COMPONENT",
            "aggregation": {"metric_id": "synthetic.metric/absolute-distance", "metric_version": "1", "value": 0.1, "unit": "synthetic.unitless"},
        },
        "return_test_record": {
            "return_test_id": "urn:nexah:nrrc:return-test:return-001",
            "return_test_version": "1",
            "route_id": "synthetic.route/closed-loop-001",
            "start_state_id": "urn:nexah:nrrc:state:start-001",
            "returned_state_id": "urn:nexah:nrrc:state:return-001",
            "comparison_frame_id": "urn:nexah:nrrc:frame:local-001",
            "metric_id": "synthetic.metric/absolute-distance",
            "metric_version": "1",
            "tolerance": 0.5,
            "observed_residual": 0.1,
            "decision_status": "BOUNDED_LOCK",
            "residual_id": "urn:nexah:nrrc:residual:return-001",
            "decision_reason_ref": "synthetic.rule/residual-leq-tolerance",
        },
        "provenance_stages": [],
        "claim_ceiling_ref": {
            "claim_ceiling_id": "urn:nexah:nrrc:claim-ceiling:p4a-001",
            "claim_ceiling_version": "1",
            "value": "DOCUMENTARY_CONTRACT_VALIDITY_ONLY",
            "authority_ref": "human-authority:nrrc-odr-01",
            "content_hash": HC,
        },
        "human_authority_boundary": {
            "human_authority_ref": "human-authority:nrrc-odr-01",
            "authority_scope": "STOP_CONTINUE_ADOPT_REJECT_AND_FINAL_CLAIM",
            "allowed_decisions": ["STOP", "CONTINUE", "ADOPT", "REJECT"],
            "machine_claim_authority": False,
            "processor_decision_authority": False,
            "display_decision_authority": False,
        },
        "source_hashes": [H0],
        "producer_note": "Synthetic fixture only; carrier, trace and representation remain distinct.",
        "content_hash": "",
    }
    outputs = [
        (record["carrier_state_ref"]["state_id"], record["representation_ref"]["representation_id"], "synthetic.process/project"),
        (record["representation_ref"]["representation_id"], record["trace_record"]["trace_id"], "synthetic.process/measure-trace"),
        (record["trace_record"]["trace_id"], record["ilau_audit_record"]["audit_id"], "synthetic.process/audit"),
        (record["ilau_audit_record"]["audit_id"], record["residual_record"]["residual_id"], "synthetic.process/measure-residual"),
        (record["residual_record"]["residual_id"], record["return_test_record"]["return_test_id"], "synthetic.process/return-test"),
    ]
    prior = None
    for order, (input_ref, output_ref, process) in enumerate(outputs):
        stage_id = f"urn:nexah:nrrc:provenance-stage:p4a-{order}"
        stage = {
            "stage_id": stage_id,
            "stage_order": order,
            "input_refs": [input_ref],
            "output_ref": output_ref,
            "operator_or_process_ref": process,
            "producer_id": "synthetic-producer:p4a",
            "contract_id": "nexah.relation-record",
            "contract_version": "0.1-candidate",
            "source_hashes": [H0],
            "output_hash": "sha256:" + hashlib.sha256(output_ref.encode()).hexdigest(),
            "lossiness": "LOSSLESS" if order > 0 else "DECLARED_LOSSY",
        }
        if prior is not None: stage["prior_stage_ref"] = prior
        prior = stage_id
        record["provenance_stages"].append(stage)
    record["content_hash"] = envelope_hash(record)
    return record


def _rehash(record: dict) -> dict:
    record["content_hash"] = envelope_hash(record)
    return record


def negative_records(base: dict) -> dict[str, dict | str]:
    out: dict[str, dict | str] = {}
    def mutate(name, fn, rehash=True):
        item = copy.deepcopy(base); fn(item)
        out[name] = _rehash(item) if rehash else item
    mutate("01_missing_return_test.json", lambda x: x.pop("return_test_record"))
    mutate("02_extra_undeclared_field.json", lambda x: x.update({"ontology": "forbidden"}))
    mutate("03_broken_reference.json", lambda x: x["trace_record"].update({"frame_id": "urn:nexah:nrrc:frame:missing"}))
    mutate("04_duplicate_identifier.json", lambda x: x["ilau_audit_record"].update({"audit_id": x["trace_record"]["trace_id"]}))
    mutate("05_invalid_side_enum.json", lambda x: x["trace_record"].update({"side_status": "INSIDE"}))
    out["06_nonfinite_tolerance.json"] = canonical_bytes(base).decode().replace('"tolerance":0.5', '"tolerance":NaN')
    mutate("07_inconsistent_return_decision.json", lambda x: x["return_test_record"].update({"decision_status": "OPEN_RESIDUAL"}))
    mutate("08_incomplete_provenance.json", lambda x: x["provenance_stages"].pop(2))
    mutate("09_raised_claim_ceiling.json", lambda x: x["claim_ceiling_ref"].update({"value": "BOUNDED_PROCESSOR_RESULT"}))
    mutate("10_altered_content_hash.json", lambda x: x.update({"producer_note": "altered after hashing"}), rehash=False)
    mutate("11_missing_trace_component.json", lambda x: x["trace_record"]["local_descriptor"].pop("Phi"))
    mutate("12_ilau_extra_bucket.json", lambda x: x["ilau_audit_record"].update({"M": []}))
    mutate("13_side_embedded_in_descriptor.json", lambda x: x["trace_record"]["local_descriptor"].update({"side": "IN"}))
    mutate("14_machine_claim_authority.json", lambda x: x["human_authority_boundary"].update({"machine_claim_authority": True}))
    mutate("15_unregistered_extension.json", lambda x: x.update({"declared_extensions": {"example.unregistered/0.1": {"version": "0.1", "payload": {"value": 1}}}}))
    return out


def build(output_root: Path = ROOT) -> dict[str, str]:
    positive_dir = output_root / "fixtures" / "positive"
    negative_dir = output_root / "fixtures" / "negative"
    positive_dir.mkdir(parents=True, exist_ok=True)
    negative_dir.mkdir(parents=True, exist_ok=True)
    base = positive_record()
    written: dict[str, str] = {}
    p = positive_dir / "complete_trace_audit_residual_return.json"
    p.write_bytes(canonical_bytes(base) + b"\n")
    written[str(p.relative_to(output_root))] = hashlib.sha256(p.read_bytes()).hexdigest()
    for name, value in sorted(negative_records(base).items()):
        path = negative_dir / name
        if isinstance(value, str): path.write_text(value + "\n", encoding="utf-8")
        else: path.write_bytes(canonical_bytes(value) + b"\n")
        written[str(path.relative_to(output_root))] = hashlib.sha256(path.read_bytes()).hexdigest()
    return written


if __name__ == "__main__":
    print(json.dumps(build(), sort_keys=True, separators=(",", ":")))
