#!/usr/bin/env python3
"""Build an exact, read-only registration candidate for EXP-T01."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


PACKAGE = "NEXAH_TRANSLATION_RECOVERY_EXP_T01"
AS_OF = "2026-08-14"
REGISTRATION_COMMIT = "bf2c34a3ca66c053fb3c412e86206ccf9f9cf1b7"
TRANSIENT = {".DS_Store"}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    repo = args.repo.resolve()
    package = repo / PACKAGE
    records = []
    for path in sorted(package.rglob("*"), key=lambda item: item.as_posix()):
        if not path.is_file() or path.name in TRANSIENT or "__pycache__" in path.parts:
            continue
        records.append({
            "path": path.relative_to(repo).as_posix(),
            "bytes": path.stat().st_size,
            "sha256": sha256_file(path),
        })
    digest = hashlib.sha256()
    for record in records:
        digest.update(record["path"].encode())
        digest.update(b"\0")
        digest.update(record["sha256"].encode("ascii"))
        digest.update(b"\n")

    frozen_manifest = json.loads((package / "HASH_MANIFEST.json").read_text())
    mismatches = []
    for relative, expected in frozen_manifest.get("files", {}).items():
        source = package / relative
        actual = sha256_file(source) if source.is_file() else "MISSING"
        if actual != expected:
            mismatches.append({"path": relative, "expected": expected, "actual": actual})
    if mismatches:
        raise RuntimeError(f"frozen package manifest has {len(mismatches)} mismatches")

    output = args.output
    output.mkdir(parents=True, exist_ok=True)
    manifest = {
        "schema": "nexah-exp-t01-registration-candidate-v1",
        "as_of": AS_OF,
        "package": PACKAGE,
        "file_count": len(records),
        "bytes": sum(record["bytes"] for record in records),
        "sha256_tree": digest.hexdigest(),
        "frozen_manifest_bindings": len(frozen_manifest.get("files", {})),
        "frozen_manifest_verification": "PASS",
        "files": records,
        "preserved_disposition": {
            "authority": "SCIENCE_LAB_NOT_ADOPTED",
            "translation_recovery_result": "EXP_T01_TRANSLATION_CLASSIFIER_SUPPORTED",
            "stillpoint_result": "STILLPOINT_OPERATIONAL_EQUILIBRIUM_CONFIRMED",
            "new_mathematical_invariant_established": False,
            "canonical_nexah_changed": False,
            "physical_experiment_executed": False,
            "ieee_pegase_executed": False,
        },
        "boundary": {
            "source_files_modified": False,
            "scientific_reinterpretation": False,
            "adoption_implied": False,
            "commit_authorized": True,
            "push_authorized": True,
        },
        "registration_commit": REGISTRATION_COMMIT,
        "next_gate": "NONE_REGISTRATION_COMPLETE",
    }
    (output / "EXP_T01_CANDIDATE_MANIFEST.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    (output / "EXP_T01_CORE_FILES.txt").write_text(
        "".join(f"{record['path']}\n" for record in records), encoding="utf-8"
    )
    print(json.dumps({key: manifest[key] for key in ("file_count", "bytes", "sha256_tree", "frozen_manifest_verification")}, indent=2))


if __name__ == "__main__":
    main()
