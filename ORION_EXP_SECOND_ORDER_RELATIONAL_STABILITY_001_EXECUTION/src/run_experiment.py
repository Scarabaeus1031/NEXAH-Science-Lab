from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import subprocess
import sys
from pathlib import Path

from core import sha256_file, write_json


def run_stage(script: Path, arguments: list[str], log: Path) -> None:
    command = [sys.executable, str(script), *arguments]
    completed = subprocess.run(command, text=True, capture_output=True, check=False)
    log.parent.mkdir(parents=True, exist_ok=True)
    log.write_text(completed.stdout + completed.stderr, encoding="utf-8")
    if completed.returncode:
        raise RuntimeError(f"stage failed: {script.name}; see {log}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--workers", type=int, default=max(1, min(8, os.cpu_count() or 1)))
    args = parser.parse_args()
    root = Path(args.output)
    root.mkdir(parents=True, exist_ok=False)
    src = Path(__file__).resolve().parent
    logs = root / "logs"

    run_stage(src / "source_generator.py", ["--output", str(root / "source")], logs / "01_source.log")
    run_stage(src / "first_order_extractor.py", ["--sources", str(root / "source/sources.npy"), "--output", str(root / "first_order")], logs / "02_first.log")
    run_stage(src / "relation_encoder.py", ["--first-order", str(root / "first_order/first_order_fields.npz"), "--output", str(root / "relation")], logs / "03_relation.log")
    run_stage(src / "null_input_builder.py", ["--first-order", str(root / "first_order/first_order_fields.npz"), "--source-manifest", str(root / "source/source_manifest.json"), "--output", str(root / "null_input")], logs / "04_null_input.log")
    run_stage(src / "schema_auditor.py", [
        "--first-manifest", str(root / "first_order/first_order_manifest.json"),
        "--relation-manifest", str(root / "relation/relation_manifest.json"),
        "--null-manifest", str(root / "null_input/null_input_manifest.json"),
        "--first-fields", str(root / "first_order/first_order_fields.npz"),
        "--null-fields", str(root / "null_input/null_relation_input.npz"),
        "--src-dir", str(src), "--output", str(root / "schema_audit")], logs / "05_schema.log")
    run_stage(src / "blind_observer.py", ["--first-order", str(root / "first_order/first_order_fields.npz"), "--relation", str(root / "relation/relation_fields.npz"), "--output", str(root / "observer")], logs / "06_observer.log")
    run_stage(src / "fixture_auditor.py", ["--output", str(root / "fixtures")], logs / "07_fixtures.log")
    run_stage(src / "null_engine.py", ["--kind", "N4", "--first-order", str(root / "null_input/null_relation_input.npz"), "--observer-arrays", str(root / "observer/observer_arrays.npz"), "--source-manifest", str(root / "source/source_manifest.json"), "--output", str(root / "n4"), "--workers", str(args.workers)], logs / "08_n4.log")
    run_stage(src / "control_engine.py", ["--first-order", str(root / "first_order/first_order_fields.npz"), "--observer-arrays", str(root / "observer/observer_arrays.npz"), "--source-manifest", str(root / "source/source_manifest.json"), "--n4-summary", str(root / "n4/n4_summary.json"), "--output", str(root / "controls")], logs / "09_controls.log")

    comparator_args = [
        "--source-manifest", str(root / "source/source_manifest.json"), "--sources", str(root / "source/sources.npy"),
        "--first-manifest", str(root / "first_order/first_order_manifest.json"), "--observer", str(root / "observer/observer_result.json"),
        "--observer-arrays", str(root / "observer/observer_arrays.npz"), "--relation", str(root / "relation/relation_fields.npz"),
        "--fixtures", str(root / "fixtures/fixture_audit.json"), "--n4", str(root / "n4/n4_summary.json"),
        "--controls", str(root / "controls/control_results.json"), "--leakage", str(root / "schema_audit/information_boundary_audit.json"),
        "--output", str(root / "comparison")]
    run_stage(src / "comparator.py", comparator_args, logs / "10_comparator_preliminary.log")
    preliminary = json.loads((root / "comparison/comparison_result.json").read_text("utf-8"))
    if preliminary["relational_pre_replay"]:
        run_stage(src / "null_engine.py", ["--kind", "N3", "--first-order", str(root / "first_order/first_order_fields.npz"), "--output", str(root / "n3")], logs / "11_n3.log")
        comparator_args.extend(["--n3-distribution", str(root / "n3/n3_distribution.npy")])
        run_stage(src / "comparator.py", comparator_args, logs / "12_comparator_final.log")

    result_path = root / "comparison/scientific_result.json"
    result_hash = sha256_file(result_path)
    write_json(root / "SCIENTIFIC_RESULT_HASH.json", {"algorithm": "SHA-256", "file": "comparison/scientific_result.json", "sha256": result_hash})
    write_json(root / "environment.json", {"numpy": __import__("numpy").__version__, "platform": platform.platform(), "python": platform.python_version()})
    artifacts = {}
    for path in sorted(p for p in root.rglob("*") if p.is_file() and p.name != "ARTIFACT_HASH_MANIFEST.json"):
        artifacts[str(path.relative_to(root))] = sha256_file(path)
    write_json(root / "ARTIFACT_HASH_MANIFEST.json", {"algorithm": "SHA-256", "files": artifacts})


if __name__ == "__main__":
    main()
