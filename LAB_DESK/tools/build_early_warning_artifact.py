#!/usr/bin/env python3
"""Split the Early-Warning package into a Git core and immutable raw artifact.

The source package is read-only. The tool emits deterministic manifests under
LAB_DESK and can optionally build and stream-verify a deterministic tar.zst
archive outside the repository.
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
from typing import BinaryIO, Iterable, Optional


PACKAGE_NAME = "NEXAH_EARLY_WARNING_HYPOTHESIS_VALIDATION"
DATA_PREFIXES = (PurePosixPath("level1/raw"), PurePosixPath("level1c/raw"))
SCHEMA = "nexah-early-warning-artifact-split-v1"
AS_OF = "2026-08-14"


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
        digest.update(str(record["path"]).encode("utf-8"))
        digest.update(b"\0")
        digest.update(str(record["sha256"]).encode("ascii"))
        digest.update(b"\n")
    return digest.hexdigest()


def is_data_path(relative: PurePosixPath) -> bool:
    return any(relative == prefix or prefix in relative.parents for prefix in DATA_PREFIXES)


def inventory(package: Path) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    core: list[dict[str, object]] = []
    data: list[dict[str, object]] = []
    for path in sorted(package.rglob("*"), key=lambda item: item.as_posix()):
        if not path.is_file():
            continue
        relative = PurePosixPath(path.relative_to(package).as_posix())
        record: dict[str, object] = {
            "path": relative.as_posix(),
            "bytes": path.stat().st_size,
            "sha256": sha256_file(path),
        }
        (data if is_data_path(relative) else core).append(record)
    return core, data


def summarize(records: list[dict[str, object]]) -> dict[str, object]:
    return {
        "file_count": len(records),
        "bytes": sum(int(record["bytes"]) for record in records),
        "sha256_tree": tree_hash(records),
    }


def human_bytes(size: int) -> str:
    value = float(size)
    for unit in ("B", "KiB", "MiB", "GiB", "TiB"):
        if value < 1024 or unit == "TiB":
            return f"{value:.1f} {unit}" if unit != "B" else f"{int(value)} B"
        value /= 1024
    raise AssertionError("unreachable")


def write_deterministic_archive(
    package: Path, records: list[dict[str, object]], destination: Path
) -> None:
    zstd = shutil.which("zstd")
    if not zstd:
        raise RuntimeError("zstd is required to build the data artifact")
    destination.parent.mkdir(parents=True, exist_ok=True)
    partial = destination.with_name(destination.name + ".partial")
    if partial.exists():
        partial.unlink()

    process = subprocess.Popen(
        [zstd, "-q", "-10", "-T0", "-f", "-o", str(partial)],
        stdin=subprocess.PIPE,
    )
    if process.stdin is None:
        raise RuntimeError("failed to open zstd input stream")
    try:
        with tarfile.open(fileobj=process.stdin, mode="w|", format=tarfile.PAX_FORMAT) as archive:
            for record in sorted(records, key=lambda item: str(item["path"])):
                relative = PurePosixPath(str(record["path"]))
                source = package / Path(relative.as_posix())
                info = tarfile.TarInfo(f"{PACKAGE_NAME}/{relative.as_posix()}")
                info.size = int(record["bytes"])
                info.mtime = 0
                info.mode = 0o644
                info.uid = 0
                info.gid = 0
                info.uname = ""
                info.gname = ""
                with source.open("rb") as handle:
                    archive.addfile(info, fileobj=handle)
        process.stdin.close()
        return_code = process.wait()
        if return_code != 0:
            raise RuntimeError(f"zstd exited with status {return_code}")
        os.replace(partial, destination)
    except BaseException:
        if process.stdin and not process.stdin.closed:
            process.stdin.close()
        process.wait()
        if partial.exists():
            partial.unlink()
        raise


def verify_archive(archive_path: Path, expected: list[dict[str, object]]) -> None:
    zstd = shutil.which("zstd")
    if not zstd:
        raise RuntimeError("zstd is required to verify the data artifact")
    expected_by_member = {
        f"{PACKAGE_NAME}/{record['path']}": record for record in expected
    }
    seen: set[str] = set()
    process = subprocess.Popen(
        [zstd, "-q", "-d", "-c", str(archive_path)], stdout=subprocess.PIPE
    )
    if process.stdout is None:
        raise RuntimeError("failed to open zstd output stream")
    try:
        with tarfile.open(fileobj=process.stdout, mode="r|") as archive:
            for member in archive:
                if not member.isfile():
                    raise RuntimeError(f"unexpected non-file archive member: {member.name}")
                expected_record = expected_by_member.get(member.name)
                if expected_record is None:
                    raise RuntimeError(f"unexpected archive member: {member.name}")
                handle = archive.extractfile(member)
                if handle is None:
                    raise RuntimeError(f"cannot read archive member: {member.name}")
                actual_hash = sha256_stream(handle)
                if member.size != int(expected_record["bytes"]):
                    raise RuntimeError(f"size mismatch: {member.name}")
                if actual_hash != expected_record["sha256"]:
                    raise RuntimeError(f"hash mismatch: {member.name}")
                seen.add(member.name)
        return_code = process.wait()
        if return_code != 0:
            raise RuntimeError(f"zstd verification exited with status {return_code}")
    finally:
        if process.poll() is None:
            process.terminate()
            process.wait()
    missing = set(expected_by_member) - seen
    if missing:
        raise RuntimeError(f"archive is missing {len(missing)} expected files")


def write_outputs(
    output_dir: Path,
    core: list[dict[str, object]],
    data: list[dict[str, object]],
    archive_path: Optional[Path],
    verified: bool,
    rebuild_verified: bool,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    core_summary = summarize(core)
    data_summary = summarize(data)
    package_summary = summarize([*core, *data])
    artifact: Optional[dict[str, object]] = None
    if archive_path:
        artifact = {
            "filename": archive_path.name,
            "bytes": archive_path.stat().st_size,
            "sha256": sha256_file(archive_path),
            "format": "deterministic POSIX pax tar compressed with zstd level 10",
            "stream_verification": "PASS" if verified else "NOT_RUN",
            "deterministic_rebuild": "PASS" if rebuild_verified else "NOT_RUN",
            "remote_uri": None,
        }

    manifest = {
        "schema": SCHEMA,
        "as_of": AS_OF,
        "package": PACKAGE_NAME,
        "source_package": package_summary,
        "scientific_disposition": "LEVEL1C_COMPLETE_INCONCLUSIVE",
        "recommended_route": "NEW_PROTOCOL_REQUIRED_FOR_IDENTIFIABILITY",
        "boundary": {
            "research_files_modified": False,
            "scientific_reinterpretation": False,
            "upload_authorized": False,
            "deletion_authorized": False,
        },
        "split_rule": {
            "external_data_prefixes": [prefix.as_posix() for prefix in DATA_PREFIXES],
            "git_core_rule": "all package files outside external_data_prefixes",
        },
        "core": {**core_summary, "files": core},
        "data": {**data_summary, "files": data},
        "artifact": artifact,
        "next_owner_gate": "SELECT_PRIVATE_DURABLE_OBJECT_STORAGE_AND_AUTHORIZE_UPLOAD",
    }
    (output_dir / "EARLY_WARNING_SPLIT_MANIFEST.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    (output_dir / "EARLY_WARNING_CORE_ALLOWLIST.txt").write_text(
        "".join(f"{record['path']}\n" for record in core), encoding="utf-8"
    )
    (output_dir / "EARLY_WARNING_DATA_FILELIST.txt").write_text(
        "".join(f"{record['path']}\n" for record in data), encoding="utf-8"
    )

    artifact_lines = ["Not built in this record."]
    if artifact:
        artifact_lines = [
            f"- Filename: `{artifact['filename']}`",
            f"- Compressed size: **{human_bytes(int(artifact['bytes']))}**",
            f"- Archive SHA-256: `{artifact['sha256']}`",
            f"- Stream verification: **{artifact['stream_verification']}**",
            f"- Deterministic rebuild: **{artifact['deterministic_rebuild']}**",
            "- Remote URI: **not assigned**",
        ]
    report = [
        "# Early-Warning Core / Data Disposition Record",
        "",
        f"Status date: {AS_OF}",
        "",
        "Disposition: **LOCAL_ARTIFACT_BUILT; REMOTE STORAGE NOT SELECTED**"
        if artifact
        else "Disposition: **SPLIT_PLANNED; ARTIFACT NOT BUILT**",
        "",
        "Scientific status: **LEVEL1C_COMPLETE_INCONCLUSIVE**",
        "",
        "Recommended scientific route: `NEW_PROTOCOL_REQUIRED_FOR_IDENTIFIABILITY`",
        "",
        "## Frozen split",
        "",
        f"- Complete source package: **{package_summary['file_count']:,} files**, "
        f"**{human_bytes(int(package_summary['bytes']))}**, tree `{package_summary['sha256_tree']}`",
        f"- Git reproducibility core: **{core_summary['file_count']:,} files**, "
        f"**{human_bytes(int(core_summary['bytes']))}**, tree `{core_summary['sha256_tree']}`",
        f"- External raw-data body: **{data_summary['file_count']:,} files**, "
        f"**{human_bytes(int(data_summary['bytes']))}**, tree `{data_summary['sha256_tree']}`",
        "- External prefixes: `level1/raw/`, `level1c/raw/`",
        "",
        "## Local immutable artifact",
        "",
        *artifact_lines,
        "",
        "## Verification and authority boundary",
        "",
        "- Every core and data file is recorded by relative path, byte size and SHA-256.",
        "- Archive verification streams every member and compares its size and SHA-256 to the manifest.",
        "- No research source, result or generated trajectory was modified.",
        "- This repository record does not authorize upload or deletion.",
        "- A local copy remains necessary until a private durable upload and clean retrieval have both passed.",
        "",
        "## Next owner gate",
        "",
        "`SELECT_PRIVATE_DURABLE_OBJECT_STORAGE_AND_AUTHORIZE_UPLOAD`",
        "",
    ]
    (output_dir / "EARLY_WARNING_ARTIFACT_DISPOSITION.md").write_text(
        "\n".join(report), encoding="utf-8"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--package", type=Path)
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--build-archive", type=Path)
    parser.add_argument("--verify", action="store_true")
    parser.add_argument("--verify-determinism", action="store_true")
    args = parser.parse_args()

    repo = args.repo.resolve()
    package = (args.package or repo / PACKAGE_NAME).resolve()
    output_dir = (
        args.output_dir or repo / "LAB_DESK" / "ARTIFACTS" / "EARLY_WARNING_LEVEL1C"
    ).resolve()
    if package.name != PACKAGE_NAME or not package.is_dir():
        raise SystemExit(f"expected package directory named {PACKAGE_NAME}: {package}")

    core, data = inventory(package)
    if not core or not data:
        raise SystemExit("split produced an empty core or data set")

    archive_path = args.build_archive.resolve() if args.build_archive else None
    verified = False
    rebuild_verified = False
    if archive_path:
        write_deterministic_archive(package, data, archive_path)
        if args.verify_determinism:
            first_hash = sha256_file(archive_path)
            write_deterministic_archive(package, data, archive_path)
            second_hash = sha256_file(archive_path)
            if first_hash != second_hash:
                raise SystemExit(
                    "deterministic rebuild failed: "
                    f"first={first_hash}, second={second_hash}"
                )
            rebuild_verified = True
        if args.verify:
            verify_archive(archive_path, data)
            verified = True
    elif args.verify or args.verify_determinism:
        raise SystemExit("--verify and --verify-determinism require --build-archive")

    write_outputs(output_dir, core, data, archive_path, verified, rebuild_verified)
    print(
        f"core={len(core)} files/{human_bytes(sum(int(x['bytes']) for x in core))}; "
        f"data={len(data)} files/{human_bytes(sum(int(x['bytes']) for x in data))}; "
        f"archive={'built' if archive_path else 'not built'}; "
        f"verification={'PASS' if verified else 'not run'}; "
        f"determinism={'PASS' if rebuild_verified else 'not run'}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
