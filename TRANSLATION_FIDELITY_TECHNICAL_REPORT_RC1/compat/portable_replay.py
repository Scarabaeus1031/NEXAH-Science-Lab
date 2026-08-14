#!/usr/bin/env python3
"""Fail-closed compatibility harness for the three frozen study runners.

The harness never edits a frozen artifact. For Studies 1 and 2 it creates a
temporary execution copy and replaces only the frozen absolute dependency-root
literal with the bundled, hash-bound historical source snapshot.
"""

from __future__ import annotations

import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess
import sys
import tempfile


RC_DIR = Path(__file__).resolve().parent.parent
DEPENDENCY_DIR = RC_DIR / "compat" / "historical_dependency"
FROZEN_ROOT_LITERAL = "/Users/tho2020/Documents/GitHub/NEXAH"
EXPECTED_RUNTIME = {
    "python": "3.12.7",
    "numpy": "1.26.4",
    "scikit-learn": "1.5.1",
    "scipy": "1.13.1",
    "joblib": "1.4.2",
    "threadpoolctl": "3.5.0",
    "pandas": "2.3.3",
    "python-dateutil": "2.9.0.post0",
    "pytz": "2024.1",
    "tzdata": "2023.3",
    "six": "1.16.0",
}
EXPECTED_DEPENDENCY_HASHES = {
    "nexah/core.py": "af8b831a8cb3242b12a66d1cd694dcdb65ca87aed531ea9038ea7453f145dbc0",
    "nexah/backends/v07.py": "c8f9f6be401992a1d9d50a0b2959fefaa10966a9d84f4874cf2ef93c067ff589",
}
STUDIES = {
    "study_1": {
        "runner": "run_translation_study.py",
        "expected": "69aa9f65cd90589722274093758a899da2d0a182093ae5dad1a9cababd092055",
        "adapt_path": True,
    },
    "study_2": {
        "runner": "run_replication.py",
        "expected": "589c2195bc2388059c8ba449a02be51a63851c713021caa19dbf5017d9ee3af1",
        "adapt_path": True,
    },
    "study_3": {
        "runner": "run_fidelity_experiment.py",
        "expected": "36657449bd48eb498a65e30bdda27a2d42735e357455b42aa9126f3b32f1d0d9",
        "adapt_path": False,
    },
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify_runtime() -> dict[str, str]:
    observed = {"python": platform.python_version()}
    for package in EXPECTED_RUNTIME:
        if package != "python":
            observed[package] = importlib.metadata.version(package)
    if observed != EXPECTED_RUNTIME:
        raise RuntimeError(f"RUNTIME_IDENTITY_MISMATCH: {observed}")
    return observed


def verify_dependency() -> dict[str, str]:
    observed = {
        name: sha256(DEPENDENCY_DIR / name)
        for name in EXPECTED_DEPENDENCY_HASHES
    }
    if observed != EXPECTED_DEPENDENCY_HASHES:
        raise RuntimeError(f"HISTORICAL_DEPENDENCY_IDENTITY_MISMATCH: {observed}")
    return observed


def prepare_study(name: str, work: Path) -> Path:
    source = RC_DIR / name
    target = work / name
    shutil.copytree(source, target)
    spec = STUDIES[name]
    runner = target / str(spec["runner"])
    if spec["adapt_path"]:
        original = runner.read_text(encoding="utf-8")
        replacement = str(DEPENDENCY_DIR)
        if original.count(FROZEN_ROOT_LITERAL) != 1:
            raise RuntimeError(f"UNEXPECTED_FROZEN_PATH_OCCURRENCES: {name}")
        adapted = original.replace(FROZEN_ROOT_LITERAL, replacement)
        if adapted.count(replacement) != 1:
            raise RuntimeError(f"PATH_ADAPTER_FAILED: {name}")
        runner.write_text(adapted, encoding="utf-8")
    return target


def run_study(name: str, work: Path) -> dict[str, str]:
    study_dir = prepare_study(name, work)
    spec = STUDIES[name]
    output = work / f"{name}_replay.json"
    environment = os.environ.copy()
    environment["PYTHONHASHSEED"] = "0"
    environment["PYTHONDONTWRITEBYTECODE"] = "1"
    command = [sys.executable, str(study_dir / str(spec["runner"])), "--output", str(output)]
    subprocess.run(command, cwd=study_dir, env=environment, check=True)
    observed = sha256(output)
    expected = str(spec["expected"])
    return {
        "study": name,
        "observed_sha256": observed,
        "expected_sha256": expected,
        "status": "PASS" if observed == expected else "FAIL_HASH_MISMATCH",
    }


def main() -> int:
    runtime = verify_runtime()
    dependency = verify_dependency()
    with tempfile.TemporaryDirectory(prefix="translation-fidelity-replay-") as raw:
        results = [run_study(name, Path(raw)) for name in STUDIES]
    passed = all(result["status"] == "PASS" for result in results)
    report = {
        "status": "PASS" if passed else "FAIL",
        "runtime": runtime,
        "platform": platform.platform(),
        "machine": platform.machine(),
        "historical_dependency_revision": "923362e141170f06f2f0f26992136b5979047c42",
        "historical_dependency_hashes": dependency,
        "studies": results,
    }
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0 if passed else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"PORTABLE_REPLAY_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
