"""Neutral U1 machinery for the frozen UTILITY00-RFLC comparison.

This module owns fixture transport, schema validation, and deterministic
generation only.  It contains no utility calculation and no NEXAH detector.
"""

from __future__ import annotations

from copy import deepcopy
from hashlib import sha256
import json
from pathlib import Path
import random
from typing import Any, Iterable


FAMILY_ID = "UTILITY00-RFLC-FIXTURE-V1"
GENERATION_SEED = 2026092200
SPLIT_SEED = 2026092201
BOOTSTRAP_SEED = 2026092202
CORE_COMMIT = "ead4223a9bea103ad2266fc3b71b433974de37dd"
CLAIM_CEILING = (
    "PREEXECUTION_PROTOCOL_ONLY_NO_UTILITY_NOVELTY_DOMAIN_PRODUCT_OR_HUMAN_CLAIM"
)

CRITICAL_FAMILIES = (
    "RESIDUAL_OMITTED_OR_NULL",
    "QUOTIENT_RESIDUAL_SIGN_OR_PAIR_SWAP",
    "DECLARED_QUOTIENT_RESULT_MISMATCH",
    "RECONSTRUCTION_RULE_OR_TOLERANCE_ALTERED",
    "SOURCE_OR_CAMPAIGN_DIGEST_REBOUND",
    "MANIFEST_PAYLOAD_MISMATCH",
    "EVALUATION_REFIT_OR_LEAKAGE",
    "PCA7_EVALUATION_REFIT",
    "FAILED_FRAMES_IMPUTED_BRIDGED_OR_REMOVED",
    "FAILURE_STATE_REMOVED_OR_DOWNGRADED",
    "Q_PLUS_R8_FALSE_COMPRESSION_CLAIM",
    "STRONGER_BASELINE_SUPPRESSED_OR_MISREPORTED",
    "FALSE_INVERTIBILITY_OR_RECONSTRUCTION_CLAIM",
    "CLAIM_CEILING_OR_HUMAN_AUTHORITY_ELEVATED",
    "PROVENANCE_IDENTITY_OR_DERIVATION_CORRUPTED",
)

SPLIT_COUNTS = {
    "development": {"critical_per_family": 8, "controls": 20, "total": 140},
    "evaluation": {"critical_per_family": 12, "controls": 36, "total": 216},
    "replay": {"critical_per_family": 4, "controls": 16, "total": 76},
}

REQUIRED_RESULT_FIELDS = {
    "fixture_id",
    "mutation_family",
    "severity",
    "split",
    "parent_record",
    "processor",
    "detection",
    "localization",
    "abstention",
    "failure_status",
    "defect_family",
    "evidence_references",
    "reconstruction_status",
    "failure_reason",
    "unmet_precondition",
    "claim_ceiling",
    "software_version",
    "runtime",
    "memory",
    "record_size",
    "input_sha256",
    "semantic_result_sha256",
}


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")


def digest_bytes(value: bytes) -> str:
    return sha256(value).hexdigest()


def sha_ref(value: bytes) -> str:
    return "sha256:" + digest_bytes(value)


def bundle_digest(files: dict[str, str]) -> str:
    return digest_bytes(canonical_bytes(files))


def read_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"expected object: {path}")
    return value


def load_base_bundle(core_root: Path) -> dict[str, str]:
    bundle = (
        core_root
        / "validation"
        / "ieee_projection_fidelity_v1"
        / "evidence_bundle_v1"
    )
    names = ("analysis.json", "computation_result.json", "manifest.json", "report.md")
    return {name: (bundle / name).read_text(encoding="utf-8") for name in names}


def _json_file(files: dict[str, str], name: str) -> dict[str, Any]:
    value = json.loads(files[name])
    if not isinstance(value, dict):
        raise ValueError(f"fixture {name} must be an object")
    return value


def _write_json_file(files: dict[str, str], name: str, value: dict[str, Any]) -> None:
    files[name] = canonical_bytes(value).decode("utf-8")


def _refresh_manifest(files: dict[str, str]) -> None:
    manifest = _json_file(files, "manifest.json")
    manifest["files"] = {
        name: {"bytes": len(files[name].encode("utf-8")), "sha256": sha_ref(files[name].encode("utf-8"))}
        for name in ("analysis.json", "computation_result.json", "report.md")
        if name in files
    }
    _write_json_file(files, "manifest.json", manifest)


def _refresh_analysis_binding(files: dict[str, str]) -> None:
    if "analysis.json" not in files or "computation_result.json" not in files:
        return
    record = _json_file(files, "computation_result.json")
    record["output_checksums"] = {
        "analysis.json": sha_ref(files["analysis.json"].encode("utf-8"))
    }
    _write_json_file(files, "computation_result.json", record)


def _metric(analysis: dict[str, Any], representation: str) -> dict[str, Any]:
    for item in analysis["evaluation"]["metrics"]:
        if item.get("representation") == representation:
            return item
    raise ValueError(f"missing metric {representation}")


def mutate_bundle(base: dict[str, str], family: str, variant: int) -> tuple[dict[str, str], str]:
    files = deepcopy(base)
    analysis = _json_file(files, "analysis.json")
    record = _json_file(files, "computation_result.json")
    manifest = _json_file(files, "manifest.json")
    location = ""

    if family == "RESIDUAL_OMITTED_OR_NULL":
        analysis["q_plus_r_kernel_detection_rate"] = None
        location = "analysis.json#/q_plus_r_kernel_detection_rate"
    elif family == "QUOTIENT_RESIDUAL_SIGN_OR_PAIR_SWAP":
        analysis["q_plus_r_pair_distance_max_error"] = 0.25 + variant / 100
        location = "analysis.json#/q_plus_r_pair_distance_max_error"
    elif family == "DECLARED_QUOTIENT_RESULT_MISMATCH":
        analysis["q_only_kernel_max_distance"] = 0.5 + variant / 100
        location = "analysis.json#/q_only_kernel_max_distance"
    elif family == "RECONSTRUCTION_RULE_OR_TOLERANCE_ALTERED":
        analysis["q_plus_r_raw_reconstruction_max_error"] = 1e-3
        location = "analysis.json#/q_plus_r_raw_reconstruction_max_error"
    elif family == "SOURCE_OR_CAMPAIGN_DIGEST_REBOUND":
        key = sorted(analysis["source_sha256"])[variant % len(analysis["source_sha256"])]
        analysis["source_sha256"][key] = "0" * 64
        location = f"analysis.json#/source_sha256/{key}"
    elif family == "MANIFEST_PAYLOAD_MISMATCH":
        files["report.md"] += f"\nmutation-{variant}\n"
        return files, "manifest.json#/files/report.md"
    elif family == "EVALUATION_REFIT_OR_LEAKAGE":
        analysis["evaluation_refit"] = True
        record["provenance"]["metadata"]["evaluation_refit"] = True
        location = "analysis.json#/evaluation_refit"
    elif family == "PCA7_EVALUATION_REFIT":
        analysis["model"]["fit_case_id"] = "ieee14"
        location = "analysis.json#/model/fit_case_id"
    elif family == "FAILED_FRAMES_IMPUTED_BRIDGED_OR_REMOVED":
        analysis["development"]["failed_frame_count"] = 0
        location = "analysis.json#/development/failed_frame_count"
    elif family == "FAILURE_STATE_REMOVED_OR_DOWNGRADED":
        record["status"] = "indeterminate"
        location = "computation_result.json#/status"
    elif family == "Q_PLUS_R8_FALSE_COMPRESSION_CLAIM":
        files["report.md"] = files["report.md"].replace(
            "It is not a seven-dimensional compression result.",
            "It is a seven-dimensional compression result.",
        )
        location = "report.md#Q_PLUS_R8"
    elif family == "STRONGER_BASELINE_SUPPRESSED_OR_MISREPORTED":
        analysis["evaluation"]["metrics"] = [
            item for item in analysis["evaluation"]["metrics"] if item["representation"] != "PCA7"
        ]
        location = "analysis.json#/evaluation/metrics"
    elif family == "FALSE_INVERTIBILITY_OR_RECONSTRUCTION_CLAIM":
        _metric(analysis, "Q_ONLY7")["pair_distance_nrmse"] = 0.0
        location = "analysis.json#/evaluation/metrics/Q_ONLY7/pair_distance_nrmse"
    elif family == "CLAIM_CEILING_OR_HUMAN_AUTHORITY_ELEVATED":
        manifest["claim_ceiling"] = "GENERAL_SCIENTIFIC_AND_PRODUCT_AUTHORITY"
        record["provenance"]["metadata"]["claim_ceiling"] = "GENERAL_SCIENTIFIC_AND_PRODUCT_AUTHORITY"
        location = "manifest.json#/claim_ceiling"
    elif family == "PROVENANCE_IDENTITY_OR_DERIVATION_CORRUPTED":
        record["provenance"]["source"] = "unknown-rebound-source"
        location = "computation_result.json#/provenance/source"
    else:
        raise ValueError(f"unknown mutation family: {family}")

    _write_json_file(files, "analysis.json", analysis)
    _write_json_file(files, "computation_result.json", record)
    _write_json_file(files, "manifest.json", manifest)
    _refresh_analysis_binding(files)
    _refresh_manifest(files)
    return files, location


def _control_files(base: dict[str, str], control: str, variant: int) -> tuple[dict[str, str], str]:
    files = deepcopy(base)
    if control == "VALID_OR_SEMANTICS_PRESERVING":
        return files, ""
    if control == "BENIGN_METADATA_ONLY":
        manifest = _json_file(files, "manifest.json")
        manifest["u1_benign_note"] = f"neutral-{variant}"
        _write_json_file(files, "manifest.json", manifest)
        return files, ""
    if control == "MISSING_PRECONDITION_ABSTAIN":
        files.pop("analysis.json")
        return files, "analysis.json"
    if control == "AMBIGUOUS_OR_INACCESSIBLE_UNKNOWN":
        record = _json_file(files, "computation_result.json")
        record["input_references"] = []
        _write_json_file(files, "computation_result.json", record)
        _refresh_manifest(files)
        return files, "computation_result.json#/input_references"
    raise ValueError(control)


def _control_distribution(split: str) -> tuple[tuple[str, int], ...]:
    if split == "development":
        return (
            ("VALID_OR_SEMANTICS_PRESERVING", 8),
            ("BENIGN_METADATA_ONLY", 4),
            ("MISSING_PRECONDITION_ABSTAIN", 4),
            ("AMBIGUOUS_OR_INACCESSIBLE_UNKNOWN", 4),
        )
    if split == "evaluation":
        return (
            ("VALID_OR_SEMANTICS_PRESERVING", 12),
            ("BENIGN_METADATA_ONLY", 8),
            ("MISSING_PRECONDITION_ABSTAIN", 8),
            ("AMBIGUOUS_OR_INACCESSIBLE_UNKNOWN", 8),
        )
    return (
        ("VALID_OR_SEMANTICS_PRESERVING", 4),
        ("BENIGN_METADATA_ONLY", 4),
        ("MISSING_PRECONDITION_ABSTAIN", 4),
        ("AMBIGUOUS_OR_INACCESSIBLE_UNKNOWN", 4),
    )


def build_split(core_root: Path, split: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    if split not in SPLIT_COUNTS:
        raise ValueError(f"unknown split: {split}")
    base = load_base_bundle(core_root)
    base_sha256 = bundle_digest(base)
    inputs: list[dict[str, Any]] = []
    gold: list[dict[str, Any]] = []
    per_family = SPLIT_COUNTS[split]["critical_per_family"]
    for family_index, family in enumerate(CRITICAL_FAMILIES):
        for variant in range(per_family):
            files, location = mutate_bundle(base, family, variant)
            fixture_id = f"{split[:3].upper()}-C{family_index + 1:02d}-{variant + 1:02d}"
            inputs.append(_input_record(fixture_id, split, files))
            gold.append(
                _gold_record(
                    fixture_id,
                    split,
                    family,
                    "CRITICAL",
                    "DEFECT",
                    location,
                    base_sha256,
                    bundle_digest(files),
                )
            )
    control_index = 0
    for control, count in _control_distribution(split):
        for variant in range(count):
            control_index += 1
            files, location = _control_files(base, control, variant)
            fixture_id = f"{split[:3].upper()}-K{control_index:02d}"
            expected = "PASS"
            if control == "MISSING_PRECONDITION_ABSTAIN":
                expected = "ABSTAIN"
            elif control == "AMBIGUOUS_OR_INACCESSIBLE_UNKNOWN":
                expected = "UNKNOWN_OR_ABSTAIN"
            inputs.append(_input_record(fixture_id, split, files))
            gold.append(
                _gold_record(
                    fixture_id,
                    split,
                    control,
                    "CONTROL",
                    expected,
                    location,
                    base_sha256,
                    bundle_digest(files),
                )
            )
    order = list(range(len(inputs)))
    random.Random(SPLIT_SEED + tuple(SPLIT_COUNTS).index(split)).shuffle(order)
    inputs = [inputs[index] for index in order]
    gold_by_id = {item["fixture_id"]: item for item in gold}
    gold = [gold_by_id[item["fixture_id"]] for item in inputs]
    if len(inputs) != SPLIT_COUNTS[split]["total"]:
        raise AssertionError("frozen split count mismatch")
    return inputs, gold


def _input_record(fixture_id: str, split: str, files: dict[str, str]) -> dict[str, Any]:
    record = {
        "fixture_id": fixture_id,
        "family_id": FAMILY_ID,
        "split": split,
        "parent_record": "ieee_projection_fidelity_v1/evidence_bundle_v1",
        "bundle_files": files,
    }
    record["input_sha256"] = digest_bytes(canonical_bytes(record))
    return record


def _gold_record(
    fixture_id: str,
    split: str,
    family: str,
    severity: str,
    expected: str,
    location: str,
    pre_mutation_sha256: str,
    post_mutation_sha256: str,
) -> dict[str, Any]:
    return {
        "fixture_id": fixture_id,
        "split": split,
        "mutation_family": family,
        "severity": severity,
        "observability_variant": ("LOW", "MEDIUM", "HIGH")[
            (int(fixture_id.rsplit("-", 1)[-1].lstrip("K")) - 1) % 3
        ],
        "expected_mechanical_status": expected,
        "accepted_localization": location,
        "pre_mutation_sha256": pre_mutation_sha256,
        "post_mutation_sha256": post_mutation_sha256,
        "mutation_operation": (
            "CONTROL_GENERATION" if severity == "CONTROL" else f"SINGLE_DEFECT::{family}"
        ),
        "ground_truth_provenance": {
            "family_id": FAMILY_ID,
            "generation_seed": GENERATION_SEED,
            "split_seed": SPLIT_SEED,
        },
    }


def write_jsonl(path: Path, rows: Iterable[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b"".join(canonical_bytes(row) + b"\n" for row in rows))


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        value = json.loads(line)
        if not isinstance(value, dict):
            raise ValueError(f"non-object JSONL row: {path}")
        rows.append(value)
    return rows


def validate_result(record: dict[str, Any]) -> None:
    missing = REQUIRED_RESULT_FIELDS - set(record)
    if missing:
        raise ValueError(f"neutral result missing fields: {sorted(missing)}")
    if record["failure_status"] not in {"PASS", "DEFECT", "ABSTAIN", "UNKNOWN", "ERROR"}:
        raise ValueError("unknown failure_status")
    if not isinstance(record["runtime"], dict) or not isinstance(record["memory"], dict):
        raise ValueError("runtime and memory must be objects")
    if not isinstance(record["evidence_references"], list):
        raise ValueError("evidence_references must be a list")


def semantic_result_hash(record: dict[str, Any]) -> str:
    semantic = {
        key: value
        for key, value in record.items()
        if key not in {"runtime", "memory", "record_size", "semantic_result_sha256"}
    }
    return digest_bytes(canonical_bytes(semantic))
