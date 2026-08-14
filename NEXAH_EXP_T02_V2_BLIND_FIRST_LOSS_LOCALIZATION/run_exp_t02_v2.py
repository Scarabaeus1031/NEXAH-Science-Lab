#!/usr/bin/env python3
"""Unfrozen EXP-T02-v2 draft; freeze was refused and no manifest exists."""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
import secrets
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "HASH_MANIFEST.json"
SCHEMA_VERSION = "2.0.0"
DRAFT_FREEZE_REFUSED = True


def _canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()


def _sha(data):
    return hashlib.sha256(data).hexdigest()


def _file_sha(path):
    return _sha(path.read_bytes())


def _write(path, obj):
    path.write_text(json.dumps(obj, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")


def _empty_result(bundle=None):
    return {
        "schema_version": SCHEMA_VERSION, "protocol_bundle_sha256": bundle,
        "run_status": "INCONCLUSIVE", "seed_commitment": None,
        "revealed_seed_hex": None, "diagnostic_output_sha256": None,
        "integrity": {}, "preconditions": {}, "leakage_audit": {},
        "controls": {}, "held_out_case_results": [], "method_endpoints": {},
        "primary_endpoints": {}, "hypotheses": {"H1_A": False, "H1_B": False},
        "falsifiers": {}, "precedence_trace": [],
        "claim_boundary": {"new_mathematics": False, "independent_raw_information": False, "physical_claim": False, "universal_claim": False},
    }


def _verify_manifest():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    bad = []
    for record in manifest["files"]:
        path = ROOT / record["path"]
        if not path.is_file() or _file_sha(path) != record["sha256"]:
            bad.append(record["path"])
    payload = [{"path": r["path"], "sha256": r["sha256"]} for r in manifest["files"]]
    bundle = _sha(_canonical(payload))
    return manifest, bundle, bad or ([] if bundle == manifest["protocol_bundle_sha256"] else ["PROTOCOL_BUNDLE_SHA256"])


def _leakage_audit():
    forbidden_imports = {"generator", "scorer", "os", "sys", "pathlib", "inspect", "importlib", "subprocess"}
    forbidden_names = {"open", "eval", "exec", "compile", "globals", "locals", "__import__"}
    findings = []
    for filename in ("diagnostics_baselines.py", "diagnostics_nexah.py"):
        tree = ast.parse((ROOT / filename).read_text(encoding="utf-8"), filename=filename)
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if alias.name.split(".")[0] in forbidden_imports:
                        findings.append(f"{filename}:import:{alias.name}")
            elif isinstance(node, ast.ImportFrom) and (node.module or "").split(".")[0] in forbidden_imports:
                findings.append(f"{filename}:from:{node.module}")
            elif isinstance(node, ast.Name) and node.id in forbidden_names:
                findings.append(f"{filename}:name:{node.id}")
    return {"passed": not findings, "findings": sorted(findings)}


def _order_check(cases, baseline_module, nexah_module):
    normal_b = baseline_module.evaluate_all(cases)
    normal_n = nexah_module.evaluate_all(cases, normal_b)
    reversed_cases = list(reversed(json.loads(json.dumps(cases))))
    reverse_b = baseline_module.evaluate_all(reversed_cases)
    reverse_n = nexah_module.evaluate_all(reversed_cases, reverse_b)
    return normal_b == reverse_b and normal_n == reverse_n, normal_b, normal_n


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true")
    parser.add_argument("--acknowledge-frozen-protocol", action="store_true")
    parser.add_argument("--output", default="t02_v2_results")
    parser.add_argument("--replay-seed-hex")
    args = parser.parse_args()
    if DRAFT_FREEZE_REFUSED:
        print("REFUSED: T02-v2 failed adversarial self-review and is not frozen", file=sys.stderr)
        return 4
    if not (args.execute and args.acknowledge_frozen_protocol):
        print("REFUSED: two explicit execution gates are required", file=sys.stderr)
        return 2

    output = Path(args.output).resolve()
    if output.exists():
        print("REFUSED: output path already exists", file=sys.stderr)
        return 2
    output.mkdir(parents=True)
    result = _empty_result()
    _write(output / "RUN_STATE.json", {"state": "STARTED"})
    try:
        manifest, bundle, bad = _verify_manifest()
        result["protocol_bundle_sha256"] = bundle
        result["integrity"] = {"passed": not bad, "bad_files": bad}
        if bad:
            result["run_status"] = "PROTOCOL_INVALID"
            result["precedence_trace"] = ["1_INTEGRITY_FAILURE"]
            return _finish(output, result)

        leakage = _leakage_audit()
        result["leakage_audit"] = leakage
        if not leakage["passed"]:
            result["run_status"] = "PROTOCOL_INVALID"
            result["precedence_trace"] = ["2_GROUND_TRUTH_LEAKAGE"]
            return _finish(output, result)

        seed_hex = args.replay_seed_hex or secrets.token_hex(32)
        if len(seed_hex) != 64:
            raise ValueError("replay seed must be 256-bit hex")
        int(seed_hex, 16)
        result["seed_commitment"] = _sha(bytes.fromhex(seed_hex))
        (output / "SEALED_SEED.txt").write_text(seed_hex + "\n", encoding="ascii")

        from generator import generate_suite
        import diagnostics_baselines
        import diagnostics_nexah
        from scorer import score

        public_cases, sealed_records = generate_suite(seed_hex)
        _write(output / "PUBLIC_CASES.json", public_cases)
        _write(output / "SEALED_GROUND_TRUTH.json", sealed_records)
        preconditions = {
            "passed": len(public_cases) == 98 and len(sealed_records) == 98,
            "public_count": len(public_cases), "sealed_count": len(sealed_records),
        }
        result["preconditions"] = preconditions
        if not preconditions["passed"]:
            result["run_status"] = "PRECONDITION_FAILED"
            result["precedence_trace"] = ["3_PRECONDITION_FAILED"]
            return _finish(output, result)

        blinded_copy = json.loads(json.dumps(public_cases))
        order_passed, baseline_outputs, nexah_outputs = _order_check(blinded_copy, diagnostics_baselines, diagnostics_nexah)
        diagnostic_outputs = {"baselines": baseline_outputs, "nexah": nexah_outputs}
        _write(output / "DIAGNOSTIC_OUTPUTS.json", diagnostic_outputs)
        diagnostic_hash = _file_sha(output / "DIAGNOSTIC_OUTPUTS.json")
        result["diagnostic_output_sha256"] = diagnostic_hash

        audit = {
            "integrity_failure": False, "leakage_passed": leakage["passed"],
            "preconditions_passed": preconditions["passed"], "order_passed": order_passed,
            "threshold_used": False, "controls_in_primary": False, "schema_violation": False,
        }
        scored = score(public_cases, sealed_records, baseline_outputs, nexah_outputs, audit)
        result.update(scored)
        result["revealed_seed_hex"] = seed_hex
        return _finish(output, result)
    except Exception as exc:
        result["run_status"] = "PROTOCOL_INVALID"
        result["precedence_trace"] = ["UNEXPECTED_EXCEPTION"]
        result["integrity"]["exception_type"] = type(exc).__name__
        result["integrity"]["exception_message"] = str(exc)
        return _finish(output, result)


def _finish(output, result):
    _write(output / "FINAL_RESULT.json", result)
    files = []
    for path in sorted(output.iterdir()):
        if path.name != "RESULT_MANIFEST.json":
            files.append({"path": path.name, "sha256": _file_sha(path), "bytes": path.stat().st_size})
    _write(output / "RESULT_MANIFEST.json", {"files": files})
    _write(output / "RUN_STATE.json", {"state": "TERMINAL", "run_status": result["run_status"]})
    return 0 if result["run_status"] != "PROTOCOL_INVALID" else 3


if __name__ == "__main__":
    raise SystemExit(main())
