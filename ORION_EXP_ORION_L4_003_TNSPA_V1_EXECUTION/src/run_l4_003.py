from __future__ import annotations

import argparse
import hashlib
import json
import platform
import subprocess
import sys
from pathlib import Path

import numpy as np

from tnspa_core import REVIEWED_HASH, save_json, sha


def read(path: Path) -> dict:
    return json.loads(path.read_text())


def canonical_digest(entries: dict[str, str]) -> str:
    payload = "".join(f"{name}\t{entries[name]}\n" for name in sorted(entries)).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def verify_prereg(prereg: Path) -> None:
    manifest = read(prereg / "DESIGN_HASH_MANIFEST.json")
    actual = {name: sha(prereg / name) for name in manifest["files"]}
    if actual != manifest["files"] or canonical_digest(actual) != REVIEWED_HASH or manifest["reviewed_preregistration_sha256"] != REVIEWED_HASH:
        raise RuntimeError("preregistration hash mismatch")
    review = manifest["review_attestation"]
    if (review["critical_count"], review["major_count"], review["minor_count"]) != (0, 0, 3):
        raise RuntimeError("review state mismatch")


def run(command: list[str], log: Path) -> None:
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, check=False)
    log.parent.mkdir(parents=True, exist_ok=True)
    log.write_text(result.stdout)
    if result.returncode != 0:
        raise RuntimeError(f"stage failed; see {log}")


def invoke(execution: Path, script: str, arguments: list[str], log: Path) -> None:
    run([sys.executable, str(execution / "src" / script), *arguments], log)


def artifact_manifest(root: Path) -> None:
    files = sorted([path for path in root.rglob("*") if path.is_file() and path.name != "ARTIFACT_HASH_MANIFEST.json"], key=lambda path: str(path.relative_to(root)))
    save_json(root / "ARTIFACT_HASH_MANIFEST.json", {"algorithm": "SHA-256", "files": {str(path.relative_to(root)): sha(path) for path in files}})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workspace", required=True)
    parser.add_argument("--execution-root", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--mode", choices=("primary", "replay"), required=True)
    args = parser.parse_args()
    workspace = Path(args.workspace).resolve()
    execution = Path(args.execution_root).resolve()
    output = Path(args.output).resolve()
    if output.exists():
        raise RuntimeError("output must not exist")
    output.mkdir(parents=True)
    prereg = workspace / "ORION_LEVEL_4_003_TIE_AWARE_METRIC_PREREGISTRATION"
    verify_prereg(prereg)
    lock = execution / "PREREGISTRATION_LOCK.md"
    if not lock.exists() or REVIEWED_HASH not in lock.read_text() or "RESULT KNOWN AT LOCK TIME: NO" not in lock.read_text():
        raise RuntimeError("preimplementation lock missing")
    l4 = workspace / "ORION_EXP_ORION_L4_001_EXECUTION" / "primary"
    logs = output / "logs"

    encoder = output / "encoder"
    invoke(execution, "relation_encoder.py", ["--l4-root", str(l4), "--output", str(encoder)], logs / "01_encoder.log")
    relations = encoder / "relations.npz"

    observer = output / "observer"
    invoke(execution, "blind_observer.py", ["--relations", str(relations), "--output", str(observer)], logs / "02_observer.log")
    observer_seal = observer / "OBSERVER_SEAL.json"
    observed = observer / "observed_metrics.json"

    nulls = output / "null_engine"
    invoke(execution, "null_engine.py", ["--relations", str(relations), "--observer-seal", str(observer_seal), "--observed", str(observed), "--output", str(nulls)], logs / "03_null_engine.log")

    controls = output / "controls"
    invoke(execution, "tie_controls.py", ["--relations", str(relations), "--observer-seal", str(observer_seal), "--output", str(controls)], logs / "04_controls.log")

    r3 = output / "r3"
    invoke(execution, "r3_verifier.py", ["--input", str(l4 / "extractions" / "R3" / "inputs" / "R3.npz"), "--result", str(l4 / "extractions" / "R3" / "candidates" / "R3" / "r3_result.json"), "--output", str(r3)], logs / "05_r3.log")

    jaccard = output / "secondary_jaccard"
    invoke(execution, "secondary_jaccard.py", ["--relations", str(relations), "--observer-seal", str(observer_seal), "--output", str(jaccard)], logs / "06_jaccard.log")

    comparison = output / "comparator"
    invoke(execution, "comparator.py", [
        "--encoder-ledger", str(encoder / "encoder_ledger.json"),
        "--observer-seal", str(observer_seal),
        "--observed", str(observed),
        "--null-summary", str(nulls / "null_summary.json"),
        "--controls", str(controls / "tie_control_results.json"),
        "--r3", str(r3 / "r3_verification.json"),
        "--output", str(comparison),
    ], logs / "07_comparator.log")

    code_names = ("tnspa_core.py", "relation_encoder.py", "blind_observer.py", "null_engine.py", "tie_controls.py", "r3_verifier.py", "secondary_jaccard.py", "comparator.py", "run_l4_003.py")
    scientific_result = {
        "candidate_id": "NEXAH-L4-C001",
        "comparison": read(comparison / "comparison_result.json"),
        "controls": read(controls / "tie_control_results.json"),
        "encoder": read(encoder / "encoder_ledger.json"),
        "experiment_id": "L4.003-TNSPA-v1",
        "implementation_hashes": {name: sha(execution / "src" / name) for name in code_names},
        "null_tests": read(nulls / "null_summary.json"),
        "observation": read(observed),
        "review_state": {"critical": 0, "major": 0, "minor": 3},
        "reviewed_preregistration_sha256": REVIEWED_HASH,
        "R3_information_loss": read(r3 / "r3_verification.json"),
        "secondary_jaccard": read(jaccard / "jaccard_summary.json"),
        "stage_seals": {"observer": sha(observer_seal), "null": sha(nulls / "NULL_SEAL.json")},
    }
    save_json(output / "scientific_result.json", scientific_result)
    result_hash = sha(output / "scientific_result.json")
    save_json(output / "SCIENTIFIC_RESULT_HASH.json", {"algorithm": "SHA-256", "file": "scientific_result.json", "sha256": result_hash})
    save_json(output / "environment.json", {"numpy": np.__version__, "platform": platform.platform(), "python": sys.version, "python_executable_sha256": sha(Path(sys.executable))})
    save_json(output / "run_record.json", {"mode": args.mode, "result_hash": result_hash, "primary_outputs_read": False if args.mode == "replay" else None})
    artifact_manifest(output)
    print(json.dumps({
        "classification": scientific_result["comparison"]["classification"],
        "result_hash": result_hash,
        "TNSPA_min": scientific_result["observation"]["TNSPA_min"],
    }, sort_keys=True))


if __name__ == "__main__":
    main()
