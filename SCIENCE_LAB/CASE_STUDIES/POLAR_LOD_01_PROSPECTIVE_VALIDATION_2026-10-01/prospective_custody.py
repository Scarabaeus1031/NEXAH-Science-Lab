#!/usr/bin/env python3
"""Append-only byte custody for future POLAR-LOD sources.

The collector stores opaque response bytes and transport metadata. It never
parses C04 values or evaluates a model.
"""

from __future__ import annotations

import argparse
import fcntl
import hashlib
import json
import os
import re
import sys
import urllib.request
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse


PACKAGE = Path(__file__).resolve().parent
CONTRACT_PATH = PACKAGE / "CUSTODY_CONTRACT.json"
RELEASE_PATH = PACKAGE / "HUMAN_OWNER_RELEASE.json"
EXPECTED_CONTRACT_SHA256 = "4005cb43c36a50b19d20617e9ac8f5d28d737e6b55b86a98f514b898c1f1c91b"
CAPTURED_HEADERS = ("content-type", "content-length", "etag", "last-modified")


def canonical_json(value: object) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode("ascii")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_path(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_contract() -> dict:
    if sha256_path(CONTRACT_PATH) != EXPECTED_CONTRACT_SHA256:
        raise RuntimeError("Canonical custody contract SHA-256 mismatch")
    contract = json.loads(CONTRACT_PATH.read_text())
    if contract.get("id") != "POLAR-LOD-01-CUSTODY-CONTRACT-01":
        raise RuntimeError("Unexpected custody contract identity")
    return contract


def verify_runtime(contract: dict) -> None:
    runtime = contract["runtime"]
    runtime_path = (PACKAGE / runtime["path"]).resolve()
    if sha256_path(runtime_path) != runtime["sha256"]:
        raise RuntimeError("Custody runtime receipt SHA-256 mismatch")
    if sha256_path(Path(sys.executable).resolve()) != runtime["python_binary_sha256"]:
        raise RuntimeError("Custody interpreter SHA-256 mismatch")


def load_collection_release() -> tuple[dict, str]:
    release = json.loads(RELEASE_PATH.read_text())
    required = {
        "id",
        "status",
        "authorized_by",
        "authorized_at_utc",
        "collection_authorized",
        "execution_authorized",
        "scope",
    }
    if not required.issubset(release):
        raise RuntimeError("Human Owner release record is incomplete")
    if release["status"] != "COLLECTION_AUTHORIZED" or release["collection_authorized"] is not True:
        raise RuntimeError("Prospective collection is not authorized by the Human Owner")
    if release["execution_authorized"] is not False:
        raise RuntimeError("Collection release must not grant execution authority")
    if not isinstance(release["authorized_by"], str) or not release["authorized_by"].strip():
        raise RuntimeError("Collection release lacks an accountable Human Owner")
    if not isinstance(release["authorized_at_utc"], str) or not release["authorized_at_utc"].endswith("Z"):
        raise RuntimeError("Collection release lacks a UTC authorization timestamp")
    try:
        authorized_at = datetime.fromisoformat(release["authorized_at_utc"].replace("Z", "+00:00"))
    except ValueError as exc:
        raise RuntimeError("Collection release UTC timestamp is malformed") from exc
    if authorized_at.tzinfo != timezone.utc or authorized_at > datetime.now(timezone.utc):
        raise RuntimeError("Collection release UTC timestamp is invalid or in the future")
    if release["scope"] != ["c04", "eam_index", "eam_vintage"]:
        raise RuntimeError("Collection release scope is not the frozen source set")
    return release, sha256_path(RELEASE_PATH)


def validate_url(contract: dict, source_id: str, url: str) -> None:
    sources = contract["sources"]
    if source_id in ("c04", "eam_index"):
        if url != sources[source_id]["url"]:
            raise ValueError(f"URL is not canonical for {source_id}")
        return
    if source_id != "eam_vintage":
        raise ValueError("Unknown source identifier")
    prefix = sources[source_id]["url_prefix"]
    parsed = urlparse(url)
    parsed_prefix = urlparse(prefix)
    if (
        parsed.scheme != "https"
        or parsed.netloc != parsed_prefix.netloc
        or parsed.username is not None
        or parsed.password is not None
        or parsed.port is not None
        or parsed.query
        or parsed.fragment
        or parsed.path.rsplit("/", 1)[0] + "/" != parsed_prefix.path
    ):
        raise ValueError("EAM vintage URL is outside the canonical archive directory")
    filename = parsed.path.rsplit("/", 1)[-1]
    if not re.fullmatch(sources[source_id]["filename_regex"], filename):
        raise ValueError("EAM vintage filename is outside the frozen grammar")


def issue_date_from_vintage_url(contract: dict, url: str) -> date:
    validate_url(contract, "eam_vintage", url)
    filename = urlparse(url).path.rsplit("/", 1)[-1]
    match = re.fullmatch(r"ESMGFZ_EAM-90d_03h_([0-9]{4})_([0-9]{3})F\.asc", filename)
    if match is None:
        raise ValueError("Cannot derive EAM Issue Date from filename")
    year, day_of_year = map(int, match.groups())
    issue = date(year, 1, 1) + timedelta(days=day_of_year - 1)
    if day_of_year < 1 or issue.year != year:
        raise ValueError("EAM filename contains an invalid day of year")
    return issue


def entry_hash(entry_without_hash: dict) -> str:
    return sha256_bytes(canonical_json(entry_without_hash))


def verify_ledger(ledger_path: Path) -> str | None:
    previous = None
    if not ledger_path.exists():
        return previous
    with ledger_path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            entry = json.loads(line)
            recorded = entry.pop("entry_sha256")
            if entry.get("previous_entry_sha256") != previous:
                raise RuntimeError(f"Ledger chain mismatch at line {line_number}")
            actual = entry_hash(entry)
            if recorded != actual:
                raise RuntimeError(f"Ledger entry hash mismatch at line {line_number}")
            previous = recorded
    return previous


def verify_custody_root(custody_root: Path) -> str | None:
    ledger_path = custody_root / "FIRST_SEEN_LEDGER.jsonl"
    head = verify_ledger(ledger_path)
    if not ledger_path.exists():
        return head
    with ledger_path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            entry = json.loads(line)
            raw_path = (custody_root / entry["raw_relative_path"]).resolve()
            if not raw_path.is_relative_to(custody_root.resolve()):
                raise RuntimeError(f"Raw path escapes custody root at ledger line {line_number}")
            if not raw_path.is_file():
                raise RuntimeError(f"Raw file missing at ledger line {line_number}")
            if raw_path.stat().st_size != entry["byte_count"]:
                raise RuntimeError(f"Raw byte count mismatch at ledger line {line_number}")
            if sha256_path(raw_path) != entry["sha256"]:
                raise RuntimeError(f"Raw SHA-256 mismatch at ledger line {line_number}")
    return head


def write_anchor(
    custody_root: Path,
    anchor_export_dir: Path,
    entry: dict,
    created: datetime,
) -> Path:
    ledger_path = custody_root / "FIRST_SEEN_LEDGER.jsonl"
    ledger_bytes = ledger_path.read_bytes()
    anchor = {
        "schema_version": 1,
        "experiment_id": "POLAR-LOD-01",
        "created_utc": created.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        "contract_sha256": EXPECTED_CONTRACT_SHA256,
        "release_sha256": entry["release_sha256"],
        "ledger_entry_count": sum(1 for line in ledger_bytes.splitlines() if line),
        "ledger_sha256": sha256_bytes(ledger_bytes),
        "ledger_head_sha256": entry["entry_sha256"],
        "latest_raw_sha256": entry["sha256"],
        "remote_git_commit_required_for_admission": True,
    }
    anchor_export_dir.mkdir(parents=True, exist_ok=True)
    stamp = created.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%S.%fZ")
    anchor_path = anchor_export_dir / f"{stamp}_{entry['entry_sha256']}.json"
    descriptor = os.open(anchor_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o644)
    with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
        json.dump(anchor, handle, indent=2, sort_keys=True)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    return anchor_path


def append_capture(
    custody_root: Path,
    source_id: str,
    requested_url: str,
    final_url: str,
    started: datetime,
    finished: datetime,
    http_status: int,
    headers: dict[str, str],
    data: bytes,
    release_sha256: str,
    issue_date: date | None = None,
    anchor_export_dir: Path | None = None,
) -> dict:
    if source_id == "eam_vintage" and issue_date is None:
        raise ValueError("EAM vintage capture requires a derived Issue Date")
    custody_root.mkdir(parents=True, exist_ok=True)
    raw_dir = custody_root / "raw" / source_id
    receipts_dir = custody_root / "receipts"
    raw_dir.mkdir(parents=True, exist_ok=True)
    receipts_dir.mkdir(parents=True, exist_ok=True)
    digest = sha256_bytes(data)
    stamp = started.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%S.%fZ")
    raw_relative = Path("raw") / source_id / f"{stamp}_{digest}.bin"
    raw_path = custody_root / raw_relative
    descriptor = os.open(raw_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(descriptor, "wb") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
    except Exception:
        raw_path.unlink(missing_ok=True)
        raise
    entry = {
        "schema_version": 1,
        "source_id": source_id,
        "requested_url": requested_url,
        "final_url": final_url,
        "retrieval_started_utc": started.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        "retrieval_finished_utc": finished.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        "http_status": int(http_status),
        "response_headers": {key.lower(): value for key, value in sorted(headers.items())},
        "byte_count": len(data),
        "sha256": digest,
        "raw_relative_path": raw_relative.as_posix(),
        "release_sha256": release_sha256,
        "filename_issue_date": issue_date.isoformat() if issue_date else None,
        "eam_cutoff_provisionally_admissible": None,
    }
    if source_id == "eam_vintage":
        cutoff = datetime.combine(issue_date, time(23, 59, 59), tzinfo=timezone.utc)
        entry["eam_cutoff_provisionally_admissible"] = finished <= cutoff
    ledger_path = custody_root / "FIRST_SEEN_LEDGER.jsonl"
    lock_path = custody_root / ".ledger.lock"
    with lock_path.open("a+") as lock:
        fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
        previous = verify_ledger(ledger_path)
        entry["previous_entry_sha256"] = previous
        entry["entry_sha256"] = entry_hash(entry)
        with ledger_path.open("a", encoding="utf-8") as ledger:
            ledger.write(canonical_json(entry).decode("ascii") + "\n")
            ledger.flush()
            os.fsync(ledger.fileno())
        receipt_path = receipts_dir / f"{stamp}_{entry['entry_sha256']}.json"
        receipt_descriptor = os.open(receipt_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(receipt_descriptor, "w", encoding="utf-8") as receipt:
            json.dump(entry, receipt, indent=2, sort_keys=True)
            receipt.write("\n")
            receipt.flush()
            os.fsync(receipt.fileno())
    if anchor_export_dir is not None:
        write_anchor(custody_root, anchor_export_dir, entry, finished)
    return entry


def fetch(args: argparse.Namespace) -> dict:
    contract = load_contract()
    verify_runtime(contract)
    _, release_sha256 = load_collection_release()
    validate_url(contract, args.source, args.url)
    issue = issue_date_from_vintage_url(contract, args.url) if args.source == "eam_vintage" else None
    started = datetime.now(timezone.utc)
    request = urllib.request.Request(args.url, headers={"User-Agent": "NEXAH-POLAR-LOD-Custody/1"})

    class AllowlistedRedirectHandler(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            validate_url(contract, args.source, newurl)
            return super().redirect_request(req, fp, code, msg, headers, newurl)

    opener = urllib.request.build_opener(AllowlistedRedirectHandler())
    with opener.open(request, timeout=args.timeout) as response:
        data = response.read()
        finished = datetime.now(timezone.utc)
        validate_url(contract, args.source, response.geturl())
        headers = {name: response.headers.get(name) for name in CAPTURED_HEADERS if response.headers.get(name)}
        if response.status != 200:
            raise RuntimeError(f"Full-source capture requires HTTP 200, got {response.status}")
        if not data:
            raise RuntimeError("Source response is empty")
        if "content-length" in headers and int(headers["content-length"]) != len(data):
            raise RuntimeError("HTTP Content-Length does not match captured bytes")
        return append_capture(
            args.custody_root,
            args.source,
            args.url,
            response.geturl(),
            started,
            finished,
            response.status,
            headers,
            data,
            release_sha256,
            issue,
            args.anchor_export_dir,
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)
    verify = subparsers.add_parser("verify-ledger")
    verify.add_argument("--custody-root", type=Path, required=True)
    collect = subparsers.add_parser("collect")
    collect.add_argument("--custody-root", type=Path, required=True)
    collect.add_argument("--anchor-export-dir", type=Path, required=True)
    collect.add_argument("--source", choices=("c04", "eam_index", "eam_vintage"), required=True)
    collect.add_argument("--url", required=True)
    collect.add_argument("--timeout", type=float, default=30.0)
    args = parser.parse_args()
    try:
        if args.command == "verify-ledger":
            contract = load_contract()
            verify_runtime(contract)
            result = {"ledger_head_sha256": verify_custody_root(args.custody_root)}
        else:
            result = fetch(args)
    except (OSError, RuntimeError, ValueError, json.JSONDecodeError) as exc:
        raise SystemExit(str(exc)) from exc
    json.dump(result, sys.stdout, indent=2, sort_keys=True)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
