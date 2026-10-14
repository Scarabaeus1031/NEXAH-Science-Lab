#!/usr/bin/env python3
"""Independent package/result verifier; does not import the scientific runner."""

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
ART = ROOT / "artifacts"
PRIMARY = ART / "PRIMARY_RESULT.json"
REPLAY = ART / "REPLAY_RESULT.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


primary = json.loads(PRIMARY.read_text(encoding="utf-8"))
replay = json.loads(REPLAY.read_text(encoding="utf-8"))
allowed = {
    "CONFLUENT_UNDER_DECLARED_CLASS",
    "PATH_DEPENDENT_WITH_WITNESS",
    "CONDITIONALLY_CONFLUENT",
    "UNDEFINED_CONTRACT",
    "UNINFORMATIVE_CONTROL",
    "INVALID_EXPERIMENT",
}

checks = {
    "primary_and_replay_bytes_identical": PRIMARY.read_bytes() == REPLAY.read_bytes(),
    "primary_and_replay_objects_identical": primary == replay,
    "schema_is_frozen_v1": primary.get("schema") == "nexah.a0-bl-021.dynamic-boundary-confluence-result/1.0.0",
    "classification_is_allowed": primary.get("classification") in allowed,
    "all_controls_pass": bool(primary.get("controls")) and all(primary["controls"].values()),
    "scope_stops_at_seven_faces": primary.get("scope", {}).get("terminal_faces") == 7,
    "metric_embedding_is_false": primary.get("scope", {}).get("metric_embedding") is False,
    "baseline_is_112_nodes": primary.get("baseline", {}).get("expanded", {}).get("nodes") == 112,
    "all_terminals_are_154_nodes": all(
        row.get("expanded", {}).get("nodes") == 154
        for row in primary.get("scientific_records", [])
    ),
    "record_count_matches_enumeration": len(primary.get("scientific_records", [])) == primary.get("enumeration", {}).get("seven_face_histories"),
    "class_count_matches_partition": sum(row["history_count"] for row in primary.get("enumeration", {}).get("classes", [])) == primary.get("enumeration", {}).get("seven_face_histories"),
    "path_dependence_has_witness": primary.get("classification") != "PATH_DEPENDENT_WITH_WITNESS" or bool(primary.get("witness")),
}

report = {
    "schema": "nexah.a0-bl-021.result-verification/1.0.0",
    "status": "PASS" if all(checks.values()) else "FAIL",
    "checks": checks,
    "primary_sha256": sha256(PRIMARY),
    "replay_sha256": sha256(REPLAY),
    "verification_mode": "independent parser, frozen invariant audit and byte-identical replay comparison; scientific runner not imported",
}
(ART / "VERIFICATION.json").write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2, sort_keys=True))
if report["status"] != "PASS":
    raise SystemExit(1)
