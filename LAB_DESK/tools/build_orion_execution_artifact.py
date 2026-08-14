#!/usr/bin/env python3
"""Inventory ORION execution packages as a Git core plus immutable data artifact.

The source packages are read-only. Primary, replay, clean-replay, and failed-
attempt payloads are routed to a deterministic external tar.zst; package-level
reports, source, configuration, tests, and preregistration evidence remain in
the exact Git-core allowlist. Nothing is deleted or uploaded.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import tarfile
from pathlib import Path, PurePosixPath
from typing import BinaryIO, Iterable


AS_OF = "2026-08-14"
SCHEMA = "nexah-orion-execution-artifact-split-v1"
CORE_REGISTRATION_COMMIT = "73a0f97c05547b025bacc7f609c600008d58bbdb"
DATA_DIRS = {"primary", "replay", "clean_replay", "failed_attempts"}
PACKAGES = (
    "ORION_EXP_O8_GENERATOR_REALIZATION_001_EXECUTION",
    "ORION_EXP_O8_GENERATOR_REALIZATION_002_EXECUTION",
    "ORION_EXP_O8_UTILITY_B1_001_EXECUTION",
    "ORION_EXP_O8_UTILITY_B1_002_001_EXECUTION",
    "ORION_EXP_ORION_L1_001_V1_1_EXECUTION",
    "ORION_EXP_ORION_L2_001_EXECUTION",
    "ORION_EXP_ORION_L3_001_EXECUTION",
    "ORION_EXP_ORION_L4_001_EXECUTION",
    "ORION_EXP_ORION_L4_003_TNSPA_V1_EXECUTION",
    "ORION_EXP_SECOND_ORDER_RELATIONAL_STABILITY_001_EXECUTION",
)
PACKAGE_DISPOSITIONS = {
    "ORION_EXP_O8_GENERATOR_REALIZATION_001_EXECUTION": {
        "status": "INVALID_EXPERIMENT",
        "bounded_result": "OPERATIONAL_O8_REALIZED_NO",
    },
    "ORION_EXP_O8_GENERATOR_REALIZATION_002_EXECUTION": {
        "status": "PASS",
        "bounded_result": "OPERATIONAL_O8_REALIZED_YES_ON_REGISTERED_TYPED_DOMAIN",
    },
    "ORION_EXP_O8_UTILITY_B1_001_EXECUTION": {
        "status": "O8_UTILITY_DEMONSTRATED",
        "bounded_result": "HELD_OUT_REGISTERED_O8_DOMAIN_ONLY",
    },
    "ORION_EXP_O8_UTILITY_B1_002_001_EXECUTION": {
        "status": "UNINFORMATIVE_BENCHMARK",
        "bounded_result": "O8_UTILITY_DEMONSTRATED_NO",
    },
    "ORION_EXP_ORION_L1_001_V1_1_EXECUTION": {
        "status": "PASS",
        "bounded_result": "LOCKED_HARMONIC_OSCILLATOR_BENCHMARK_ONLY",
    },
    "ORION_EXP_ORION_L2_001_EXECUTION": {
        "status": "PASS",
        "bounded_result": "LOCKED_LORENZ_63_BENCHMARK_ONLY",
    },
    "ORION_EXP_ORION_L3_001_EXECUTION": {
        "status": "PASS",
        "bounded_result": "LOCKED_CROSS_REPRESENTATION_BENCHMARK_ONLY",
    },
    "ORION_EXP_ORION_L4_001_EXECUTION": {
        "status": "INVALID_EXPERIMENT",
        "bounded_result": "SCIENTIFIC_CANDIDATE_CLASS_NOT_ASSIGNED",
    },
    "ORION_EXP_ORION_L4_003_TNSPA_V1_EXECUTION": {
        "status": "INVALID_EXPERIMENT",
        "bounded_result": "ROBUST_CLASSIFICATION_NOT_REACHED",
    },
    "ORION_EXP_SECOND_ORDER_RELATIONAL_STABILITY_001_EXECUTION": {
        "status": "INVALID_EXPERIMENT",
        "bounded_result": "RELATIONALLY_STABLE_NO; LEE_CANDIDATE_NOT_REACHED",
    },
}
TRANSIENT_NAMES = {".DS_Store"}
TRANSIENT_PARTS = {"__pycache__"}
TRANSIENT_SUFFIXES = {".pyc", ".pyo"}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_stream(handle: BinaryIO) -> str:
    digest = hashlib.sha256()
    for chunk in iter(lambda: handle.read(1024 * 1024), b""):
        digest.update(chunk)
    return digest.hexdigest()


def tree_hash(records: Iterable[dict[str, object]]) -> str:
    digest = hashlib.sha256()
    for record in sorted(records, key=lambda item: str(item["path"])):
        digest.update(str(record["path"]).encode())
        digest.update(b"\0")
        digest.update(str(record["sha256"]).encode("ascii"))
        digest.update(b"\n")
    return digest.hexdigest()


def summarize(records: list[dict[str, object]]) -> dict[str, object]:
    return {
        "file_count": len(records),
        "bytes": sum(int(record["bytes"]) for record in records),
        "sha256_tree": tree_hash(records),
    }


def is_transient(relative: PurePosixPath) -> bool:
    return (
        relative.name in TRANSIENT_NAMES
        or bool(set(relative.parts) & TRANSIENT_PARTS)
        or relative.suffix in TRANSIENT_SUFFIXES
    )


def inventory(repo: Path) -> tuple[list[dict[str, object]], list[dict[str, object]], list[str]]:
    core: list[dict[str, object]] = []
    data: list[dict[str, object]] = []
    excluded: list[str] = []
    for package_name in PACKAGES:
        package = repo / package_name
        if not package.is_dir():
            raise FileNotFoundError(f"missing execution package: {package}")
        for path in sorted(package.rglob("*"), key=lambda item: item.as_posix()):
            if not path.is_file():
                continue
            repo_relative = PurePosixPath(path.relative_to(repo).as_posix())
            package_relative = PurePosixPath(path.relative_to(package).as_posix())
            if is_transient(package_relative):
                excluded.append(repo_relative.as_posix())
                continue
            record: dict[str, object] = {
                "path": repo_relative.as_posix(),
                "package": package_name,
                "package_path": package_relative.as_posix(),
                "bytes": path.stat().st_size,
                "sha256": sha256_file(path),
            }
            target = data if package_relative.parts[0] in DATA_DIRS else core
            target.append(record)
    return core, data, excluded


def write_archive(repo: Path, records: list[dict[str, object]], destination: Path) -> None:
    zstd = shutil.which("zstd")
    if not zstd:
        raise RuntimeError("zstd is required")
    destination.parent.mkdir(parents=True, exist_ok=True)
    partial = destination.with_name(destination.name + ".partial")
    if partial.exists():
        partial.unlink()
    process = subprocess.Popen(
        [zstd, "-q", "-10", "-T0", "-f", "-o", str(partial)], stdin=subprocess.PIPE
    )
    if process.stdin is None:
        raise RuntimeError("failed to open zstd input")
    try:
        with tarfile.open(fileobj=process.stdin, mode="w|", format=tarfile.PAX_FORMAT) as archive:
            for record in sorted(records, key=lambda item: str(item["path"])):
                relative = PurePosixPath(str(record["path"]))
                source = repo / relative.as_posix()
                info = tarfile.TarInfo(relative.as_posix())
                info.size = int(record["bytes"])
                info.mtime = 0
                info.mode = 0o644
                info.uid = info.gid = 0
                info.uname = info.gname = ""
                with source.open("rb") as handle:
                    archive.addfile(info, handle)
        process.stdin.close()
        if process.wait() != 0:
            raise RuntimeError("zstd archive creation failed")
        os.replace(partial, destination)
    except BaseException:
        if process.stdin and not process.stdin.closed:
            process.stdin.close()
        process.wait()
        if partial.exists():
            partial.unlink()
        raise


def verify_archive(archive: Path, expected: list[dict[str, object]]) -> None:
    zstd = shutil.which("zstd")
    if not zstd:
        raise RuntimeError("zstd is required")
    expected_map = {str(record["path"]): record for record in expected}
    seen: set[str] = set()
    process = subprocess.Popen([zstd, "-q", "-d", "-c", str(archive)], stdout=subprocess.PIPE)
    if process.stdout is None:
        raise RuntimeError("failed to open zstd output")
    try:
        with tarfile.open(fileobj=process.stdout, mode="r|") as tar:
            for member in tar:
                record = expected_map.get(member.name)
                if record is None or not member.isfile():
                    raise RuntimeError(f"unexpected archive member: {member.name}")
                handle = tar.extractfile(member)
                if handle is None or sha256_stream(handle) != record["sha256"]:
                    raise RuntimeError(f"hash mismatch: {member.name}")
                if member.size != int(record["bytes"]):
                    raise RuntimeError(f"size mismatch: {member.name}")
                seen.add(member.name)
        if process.wait() != 0:
            raise RuntimeError("zstd verification failed")
    finally:
        if process.poll() is None:
            process.terminate()
            process.wait()
    if seen != set(expected_map):
        raise RuntimeError(f"archive missing {len(set(expected_map) - seen)} members")


def human_bytes(size: int) -> str:
    value = float(size)
    for unit in ("B", "KiB", "MiB", "GiB"):
        if value < 1024 or unit == "GiB":
            return f"{int(value)} B" if unit == "B" else f"{value:.1f} {unit}"
        value /= 1024
    raise AssertionError


def write_outputs(
    output: Path,
    core: list[dict[str, object]],
    data: list[dict[str, object]],
    excluded: list[str],
    archive: Path,
    deterministic_rebuild: bool,
) -> None:
    output.mkdir(parents=True, exist_ok=True)
    packages = {}
    for package in PACKAGES:
        package_core = [r for r in core if r["package"] == package]
        package_data = [r for r in data if r["package"] == package]
        packages[package] = {
            "core": summarize(package_core),
            "data": summarize(package_data),
            "preserved_disposition": PACKAGE_DISPOSITIONS[package],
        }
    artifact = {
        "filename": archive.name,
        "local_storage_class": "SCIENCE_LAB_90_DATA_ARTIFACTS",
        "bytes": archive.stat().st_size,
        "sha256": sha256_file(archive),
        "format": "deterministic POSIX pax tar compressed with zstd level 10",
        "member_stream_verification": "PASS",
        "deterministic_rebuild": "PASS" if deterministic_rebuild else "FAIL",
        "remote_uri": None,
    }
    manifest = {
        "schema": SCHEMA,
        "as_of": AS_OF,
        "packages": packages,
        "combined": {"core": summarize(core), "data": summarize(data)},
        "split_rule": {
            "external_data_top_level_directories": sorted(DATA_DIRS),
            "git_core_rule": "all non-transient files outside external data directories",
            "transient_exclusions": excluded,
        },
        "artifact": artifact,
        "boundary": {
            "new_experiment": False,
            "source_files_modified": False,
            "scientific_reinterpretation": False,
            "canonical_orion_integration": False,
            "architecture_adoption": False,
            "upload_authorized": False,
            "deletion_authorized": False,
            "core_commit_authorized": True,
            "core_push_authorized": True,
        },
        "core_registration_commit": CORE_REGISTRATION_COMMIT,
        "disposition": "CORE_REGISTERED; LOCAL_ARTIFACT_VERIFIED; REMOTE_DATA_STORAGE_UNASSIGNED",
    }
    (output / "ORION_EXECUTION_SPLIT_MANIFEST.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    (output / "ORION_EXECUTION_CORE_FILES.txt").write_text(
        "".join(f"{record['path']}\n" for record in core), encoding="utf-8"
    )
    (output / "ORION_EXECUTION_DATA_FILES.txt").write_text(
        "".join(f"{record['path']}\n" for record in data), encoding="utf-8"
    )
    (output / "ORION_EXECUTION_TRANSIENT_EXCLUSIONS.txt").write_text(
        "".join(f"{path}\n" for path in excluded), encoding="utf-8"
    )
    report = f"""# ORION Execution Evidence Core / Data Disposition

Status date: {AS_OF}

Disposition: **CORE_REGISTERED; LOCAL_ARTIFACT_VERIFIED; REMOTE DATA STORAGE UNASSIGNED**

## Exact bounded set

- Execution packages: **{len(PACKAGES)}**
- Git-core candidates: **{len(core):,} files**, **{human_bytes(sum(int(r['bytes']) for r in core))}**, tree `{tree_hash(core)}`
- External data payload: **{len(data):,} files**, **{human_bytes(sum(int(r['bytes']) for r in data))}**, tree `{tree_hash(data)}`
- Transient files excluded: **{len(excluded):,}**

## Local immutable artifact

- Filename: `{archive.name}`
- Local storage class: `SCIENCE_LAB_90_DATA_ARTIFACTS`
- Compressed size: **{human_bytes(archive.stat().st_size)}**
- SHA-256: `{artifact['sha256']}`
- Member stream verification: **PASS**
- Deterministic rebuild: **{artifact['deterministic_rebuild']}**
- Remote URI: **not assigned**

## Scientific and authority boundary

- This is repository registration and preservation only; no experiment was run.
- No package content was modified and no result was reinterpreted.
- Individual package reports remain the authority for their own outcomes.
- No canonical NEXAH-ORION integration or architecture adoption is implied.
- No upload or deletion is authorized by this record.

## Next gate

The exact Git core is registered at `{CORE_REGISTRATION_COMMIT}`. Select durable
private object storage separately before considering deletion of any local data
payload.
"""
    (output / "ORION_EXECUTION_DISPOSITION.md").write_text(report, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--archive", type=Path, required=True)
    args = parser.parse_args()
    repo = args.repo.resolve()
    core, data, excluded = inventory(repo)
    write_archive(repo, data, args.archive)
    verify_archive(args.archive, data)
    first_hash = sha256_file(args.archive)
    rebuild = args.archive.with_name(args.archive.name + ".rebuild")
    try:
        write_archive(repo, data, rebuild)
        verify_archive(rebuild, data)
        deterministic = sha256_file(rebuild) == first_hash
    finally:
        if rebuild.exists():
            rebuild.unlink()
    if not deterministic:
        raise RuntimeError("deterministic archive rebuild mismatch")
    write_outputs(args.output, core, data, excluded, args.archive, deterministic)
    print(json.dumps({
        "core": summarize(core),
        "data": summarize(data),
        "excluded": len(excluded),
        "archive_bytes": args.archive.stat().st_size,
        "archive_sha256": sha256_file(args.archive),
        "verification": "PASS",
        "deterministic_rebuild": "PASS",
    }, indent=2))


if __name__ == "__main__":
    main()
