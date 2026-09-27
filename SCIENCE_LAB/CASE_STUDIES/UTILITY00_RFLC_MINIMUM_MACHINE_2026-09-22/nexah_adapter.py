#!/usr/bin/env python3
"""Syntax-only adapter around the pinned NEXAH Core evidence verifier."""

from __future__ import annotations

import json
import os
from pathlib import Path
import resource
import subprocess
import sys
import tempfile
import time
from typing import Any

from utility00_machine import canonical_bytes, semantic_result_hash, validate_result


VERIFY_SCRIPT = """\
import importlib,json,sys,types
from pathlib import Path
core_root=Path(sys.argv[1])
nexah=types.ModuleType("nexah")
nexah.__path__=[str(core_root / "nexah")]
sys.modules["nexah"]=nexah
power_systems=types.ModuleType("nexah.power_systems")
power_systems.__path__=[str(core_root / "nexah" / "power_systems")]
sys.modules["nexah.power_systems"]=power_systems
module=importlib.import_module("nexah.power_systems.ieee_projection_fidelity_evidence")
verify_ieee_projection_fidelity_evidence_bundle=module.verify_ieee_projection_fidelity_evidence_bundle
try:
    value=verify_ieee_projection_fidelity_evidence_bundle(Path(sys.argv[2]))
    print(json.dumps({\"ok\":True,\"manifest\":value},sort_keys=True))
except Exception as exc:
    print(json.dumps({\"ok\":False,\"error_type\":type(exc).__name__,\"error\":str(exc)},sort_keys=True))
    raise SystemExit(2)
"""


def _normalized_failure(stderr_or_error: str) -> tuple[str, bool, str]:
    text = stderr_or_error.lower()
    if "unavailable" in text or "no such file" in text:
        return "ABSTAIN", True, "MISSING_REQUIRED_INPUT"
    if "input references" in text:
        return "UNKNOWN", True, "AMBIGUOUS_OR_INCOMPLETE_IDENTITY"
    return "DEFECT", False, "CORE_CONTRACT_OR_INTEGRITY_FAILURE"


def run_nexah(fixture: dict[str, Any], core_root: Path) -> dict[str, Any]:
    before = resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss
    started = time.perf_counter_ns()
    with tempfile.TemporaryDirectory(prefix="utility00-nexah-") as temporary:
        bundle = Path(temporary) / "bundle"
        bundle.mkdir()
        for name, text in fixture["bundle_files"].items():
            (bundle / name).write_text(text, encoding="utf-8")
        env = dict(os.environ)
        env["PYTHONPATH"] = str(core_root)
        completed = subprocess.run(
            [sys.executable, "-c", VERIFY_SCRIPT, str(core_root), str(bundle)],
            cwd=core_root,
            env=env,
            check=False,
            capture_output=True,
            text=True,
            timeout=30,
        )
    elapsed = time.perf_counter_ns() - started
    after = resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss
    output_lines = completed.stdout.strip().splitlines()
    if output_lines:
        payload = json.loads(output_lines[-1])
    else:
        payload = {
            "ok": False,
            "error_type": "VerifierProcessError",
            "error": completed.stderr.strip() or "core verifier produced no result",
        }
    if completed.returncode == 0 and payload.get("ok"):
        status, abstention, detection, localization = "PASS", False, False, ""
    else:
        status, abstention, detection = _normalized_failure(payload.get("error", completed.stderr))
        localization = payload.get("error", "")
        detection = status == "DEFECT"
    record: dict[str, Any] = {
        "fixture_id": fixture["fixture_id"],
        "mutation_family": "WITHHELD_AT_PROCESSING",
        "severity": "WITHHELD_AT_PROCESSING",
        "split": fixture["split"],
        "parent_record": fixture["parent_record"],
        "processor": "NEXAH_PINNED_EVIDENCE_VERIFIER_SYNTAX_ADAPTER",
        "detection": detection,
        "localization": localization,
        "abstention": abstention,
        "failure_status": status,
        "failure_code": "NONE" if status == "PASS" else _normalized_failure(payload.get("error", ""))[2],
        "defect_family": "NONE" if status == "PASS" else "UNCLASSIFIED_CORE_CONTRACT_FAILURE",
        "evidence_references": [fixture["parent_record"], fixture["input_sha256"]],
        "reconstruction_status": "CORE_VERIFIED" if status == "PASS" else "NOT_ESTABLISHED",
        "failure_reason": "" if status == "PASS" else payload.get("error", completed.stderr),
        "unmet_precondition": (
            "MISSING_OR_AMBIGUOUS_REQUIRED_INPUT" if abstention else ""
        ),
        "claim_ceiling": "BOUNDED_IEEE_REPRESENTATION_FIDELITY_AUDIT",
        "software_version": "NEXAH_CORE@ead4223a9bea103ad2266fc3b71b433974de37dd",
        "runtime": {"nanoseconds": elapsed},
        "memory": {"child_ru_maxrss_delta": max(0, after - before)},
        "record_size": 0,
        "input_sha256": fixture["input_sha256"],
        "core_returncode": completed.returncode,
    }
    record["semantic_result_sha256"] = semantic_result_hash(record)
    record["record_size"] = len(canonical_bytes(record))
    validate_result(record)
    return record


def main() -> int:
    fixture = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    record = run_nexah(fixture, Path(sys.argv[2]))
    print(canonical_bytes(record).decode("utf-8"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
