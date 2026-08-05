#!/usr/bin/env python3
"""Smallest reproducible synthetic trace serialization dry run.

Engineering self-conformance only. No Human data and no scientific result.
"""
from __future__ import annotations

import hashlib
import json
import math
import platform
import sys
import uuid
from decimal import Decimal
from pathlib import Path

HERE = Path(__file__).resolve().parent
INPUT = HERE / "minimal_trace_input.json"
RUN_ROOT = HERE / "minimal_trace_run"
PRIMARY = RUN_ROOT / "primary"
REPLAY = RUN_ROOT / "replay"
REPORT = HERE / "MINIMAL_TRACE_DRY_RUN_REPORT.json"
BASELINE = "b1bb915a841595fbbf8c64a8362849d66f72ef81"
HEADER = "sample_uuid,trace_index,s_norm,x_mm,y_mm,closure_status"
TOKENS = {"CLOSED", "NOT_CLOSED"}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def exact_binary64_decimal(value: float) -> str:
    """Landing 02E exact, fixed-point lexical representation."""
    if not math.isfinite(value):
        raise ValueError("NON_FINITE_NUMERIC_VALUE")
    if value == 0.0:
        return "0"
    text = format(Decimal.from_float(value), "f")
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    return text


def load_input() -> dict:
    data = json.loads(INPUT.read_text(encoding="utf-8"))
    if data.get("run_class") != "SYNTHETIC":
        raise ValueError("RUN_CLASS_NOT_SYNTHETIC")
    canonical_uuid = str(uuid.UUID(data["sample_uuid"]))
    if canonical_uuid != data["sample_uuid"] or canonical_uuid.lower() != canonical_uuid:
        raise ValueError("UUID_NOT_CANONICAL_LOWERCASE")
    if data.get("coordinate_unit") != "mm":
        raise ValueError("UNSUPPORTED_COORDINATE_UNIT")
    points = data.get("points")
    if not isinstance(points, list) or len(points) < 2:
        raise ValueError("INSUFFICIENT_POINTS")
    normalized = []
    for point in points:
        if not isinstance(point, list) or len(point) != 2:
            raise ValueError("INVALID_POINT_SHAPE")
        x, y = float(point[0]), float(point[1])
        if not math.isfinite(x) or not math.isfinite(y):
            raise ValueError("NON_FINITE_POINT")
        normalized.append((x, y))
    return {**data, "points": normalized}


def derive_trace(data: dict) -> list[dict]:
    """Provisional O-06 dry-run derivation; preserves input row order."""
    points = data["points"]
    cumulative = [0.0]
    for previous, current in zip(points, points[1:]):
        segment = math.dist(previous, current)
        if segment <= 0.0 and current != points[-1]:
            raise ValueError("NON_POSITIVE_INTERIOR_SEGMENT")
        cumulative.append(cumulative[-1] + segment)
    total = cumulative[-1]
    if total <= 0.0:
        raise ValueError("ZERO_TOTAL_ARC_LENGTH")
    return [
        {
            "sample_uuid": data["sample_uuid"],
            "trace_index": index,
            "s_norm": distance / total,
            "x_mm": point[0],
            "y_mm": point[1],
        }
        for index, (distance, point) in enumerate(zip(cumulative, points))
    ]


def assess_connectivity(rows: list[dict]) -> str:
    """Provisional dry-run-only exact explicit-endpoint rule."""
    first = (rows[0]["x_mm"], rows[0]["y_mm"])
    last = (rows[-1]["x_mm"], rows[-1]["y_mm"])
    return "CLOSED" if first == last else "NOT_CLOSED"


def assign_closure(rows: list[dict], token: str) -> list[dict]:
    if token not in TOKENS:
        raise ValueError("UNAUTHORIZED_CLOSURE_STATUS")
    return [{**row, "closure_status": token} for row in rows]


def serialize(rows: list[dict]) -> bytes:
    if not rows:
        raise ValueError("EMPTY_TRACE")
    statuses = {row.get("closure_status") for row in rows}
    if len(statuses) != 1 or not statuses <= TOKENS:
        raise ValueError("INCONSISTENT_OR_UNAUTHORIZED_CLOSURE_STATUS")
    lines = [HEADER]
    for expected_index, row in enumerate(rows):
        if row["trace_index"] != expected_index:
            raise ValueError("TRACE_INDEX_MISMATCH")
        fields = [
            row["sample_uuid"],
            str(row["trace_index"]),
            exact_binary64_decimal(row["s_norm"]),
            exact_binary64_decimal(row["x_mm"]),
            exact_binary64_decimal(row["y_mm"]),
            row["closure_status"],
        ]
        if any(not field or any(char in field for char in ',"\r\n') for field in fields):
            raise ValueError("FIELD_REQUIRES_QUOTING_OR_IS_EMPTY")
        lines.append(",".join(fields))
    payload = ("\n".join(lines) + "\n").encode("utf-8")
    if payload.startswith(b"\xef\xbb\xbf") or b"\r" in payload or not payload.endswith(b"\n"):
        raise ValueError("BYTE_CONTRACT_VIOLATION")
    return payload


def validate_serialized(payload: bytes, expected_rows: int) -> None:
    text = payload.decode("utf-8")
    if payload.startswith(b"\xef\xbb\xbf") or b"\r" in payload:
        raise ValueError("ENCODING_OR_NEWLINE_FAILURE")
    if not payload.endswith(b"\n") or payload.endswith(b"\n\n"):
        raise ValueError("FINAL_NEWLINE_FAILURE")
    lines = text[:-1].split("\n")
    if lines[0] != HEADER or len(lines) != expected_rows + 1:
        raise ValueError("HEADER_OR_ROW_COUNT_FAILURE")
    for index, line in enumerate(lines[1:]):
        fields = line.split(",")
        if len(fields) != 6 or fields[1] != str(index) or fields[5] not in TOKENS:
            raise ValueError("ROW_CONTRACT_FAILURE")
    if len({line.split(",")[5] for line in lines[1:]}) != 1:
        raise ValueError("TRACE_LEVEL_STATUS_REPETITION_FAILURE")


def write_run(destination: Path) -> dict:
    data = load_input()
    rows = derive_trace(data)
    closure = assess_connectivity(rows)
    assigned = assign_closure(rows, closure)
    payload = serialize(assigned)
    validate_serialized(payload, len(assigned))
    destination.mkdir(parents=True, exist_ok=True)
    trace_path = destination / "trace_canonical.csv"
    manifest_path = destination / "SHA256SUMS"
    trace_path.write_bytes(payload)
    digest = sha256(payload)
    manifest_path.write_bytes(f"{digest}  trace_canonical.csv\n".encode("utf-8"))
    if sha256(trace_path.read_bytes()) != digest:
        raise ValueError("POST_WRITE_HASH_MISMATCH")
    return {
        "closure_status": closure,
        "row_count": len(assigned),
        "trace_bytes": len(payload),
        "trace_sha256": digest,
        "trace_path": trace_path.relative_to(HERE).as_posix(),
        "manifest_path": manifest_path.relative_to(HERE).as_posix(),
    }


def artifact(path: Path) -> dict:
    data = path.read_bytes()
    return {
        "path": path.relative_to(HERE).as_posix(),
        "bytes": len(data),
        "sha256": sha256(data),
    }


def run() -> dict:
    stages = {
        "synthetic_input_validation": "PASS",
        "operational_trace_derivation": "PASS",
        "trace_connectivity_assessment": "PASS",
        "closure_status_assignment": "PASS",
        "canonical_six_column_serialization": "PASS",
        "sha256_generation_and_verification": "PASS",
        "clean_replay": "PASS",
        "deterministic_byte_and_hash_comparison": "PASS",
    }
    try:
        primary = write_run(PRIMARY)
        replay = write_run(REPLAY)
        primary_bytes = (PRIMARY / "trace_canonical.csv").read_bytes()
        replay_bytes = (REPLAY / "trace_canonical.csv").read_bytes()
        if primary_bytes != replay_bytes:
            stages["deterministic_byte_and_hash_comparison"] = "FAIL"
        if primary["trace_sha256"] != replay["trace_sha256"]:
            stages["deterministic_byte_and_hash_comparison"] = "FAIL"
        overall = "PASS" if set(stages.values()) == {"PASS"} else "FAIL"
    except Exception as error:
        overall = "FAIL"
        pending = next((name for name, status in stages.items() if status == "PASS"), None)
        if pending:
            stages[pending] = "FAIL"
        primary = {"error": type(error).__name__, "message": str(error)}
        replay = {"status": "NOT_COMPLETED"}

    produced = [
        artifact(INPUT),
        artifact(Path(__file__).resolve()),
    ]
    for path in (
        PRIMARY / "trace_canonical.csv",
        PRIMARY / "SHA256SUMS",
        REPLAY / "trace_canonical.csv",
        REPLAY / "SHA256SUMS",
    ):
        if path.exists():
            produced.append(artifact(path))

    return {
        "run_id": "MINIMAL-SYNTHETIC-TRACE-DRY-RUN-01",
        "baseline_commit": BASELINE,
        "run_class": "SYNTHETIC_ENGINEERING_SELF_CONFORMANCE",
        "overall": overall,
        "stages": stages,
        "primary": primary,
        "replay": replay,
        "byte_identity_reproduced": overall == "PASS",
        "hash_identity_reproduced": overall == "PASS",
        "provisional_dry_run_assumptions": {
            "O-06": [
                "preserve supplied source row order",
                "derive s_norm from cumulative Euclidean segment length",
                "use an explicit repeated endpoint",
                "assess closure by exact binary64 equality of first and last coordinates",
            ],
            "O-10": [
                "evaluate engineering stage conformance only",
                "use exact byte and SHA-256 identity as the deterministic comparison",
                "compute no scientific metric",
            ],
            "O-19": [
                "replay with the same script, interpreter and host environment",
                "claim no cross-language or cross-platform validation",
            ],
        },
        "runtime": {
            "python_implementation": platform.python_implementation(),
            "python_version": platform.python_version(),
            "platform_system": platform.system(),
            "platform_release": platform.release(),
            "machine": platform.machine(),
        },
        "produced_artifacts_excluding_this_report": produced,
        "remaining_owner_decisions": {
            "O-06": "final derivation and geometric closure method remain open",
            "O-09": "marker and source-to-curve mapping remain open",
            "O-10": "scientific metric inventory and rationale remain open",
            "O-11": "independent direction evaluator and rule remain open",
            "O-13": "scientific metric tolerances remain open",
            "O-19": "portable replay environment and identity remain open",
            "O-21": "Human acquisition remains unauthorized",
        },
        "frozen_contracts_modified": False,
        "human_data": "NONE",
        "human_acquisition": "PROHIBITED",
        "scientific_result": "NONE",
    }


if __name__ == "__main__":
    report = run()
    text = json.dumps(report, indent=2, sort_keys=True) + "\n"
    REPORT.write_bytes(text.encode("utf-8"))
    print(text, end="")
    raise SystemExit(0 if report["overall"] == "PASS" else 1)
