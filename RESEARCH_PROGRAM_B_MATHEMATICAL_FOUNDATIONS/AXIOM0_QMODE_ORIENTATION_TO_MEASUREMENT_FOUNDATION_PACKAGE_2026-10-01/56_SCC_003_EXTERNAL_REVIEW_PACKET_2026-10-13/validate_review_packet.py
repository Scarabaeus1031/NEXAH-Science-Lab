#!/usr/bin/env python3
"""Structural validator for the frozen SCC-003 external review handoff."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REQUIRED = [
    "README.md",
    "REVIEWER_BRIEF.md",
    "REVIEW_FORM.md",
    "CLAIM_TABLE.csv",
    "PACKAGE_MANIFEST.json",
    "paper/PAPER_A_SCC_003.md",
    "paper/A0_SCC_003_PASCAL_PENTAGON_PAPER.html",
    "context/SCC_003_CANDIDATE_ASSESSMENT.md",
    "context/A0_SCIENTIFIC_POSITION_ASSESSMENT.md",
    "reference/FORMAL_SPECIFICATION.md",
    "reference/PROPOSITIONS_AND_PROOFS.md",
    "reference/PRIOR_ART_PROTOCOL_2026-10-10.md",
    "reference/PRIOR_ART_AUDIT_2026-10-10.md",
    "reference/PRIOR_ART_COMPARISON.csv",
    "reference/generate_reference.py",
    "reference/verify_reference.py",
    "reference/artifacts/manifest.json",
    "reference/artifacts/VERIFICATION.json",
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    failures: list[str] = []
    for rel in REQUIRED:
        if not (ROOT / rel).is_file():
            failures.append(f"missing: {rel}")

    manifest_path = ROOT / "PACKAGE_MANIFEST.json"
    if manifest_path.is_file():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        if manifest.get("identity_reused") != "SCC-003 / A0OE:PASCAL_PENTAGON_D5_TEST":
            failures.append("identity boundary")
        if manifest.get("publication_authorized") is not False:
            failures.append("publication boundary")
        entries = manifest.get("files", [])
        if len(entries) < 18:
            failures.append("manifest coverage")
        for entry in entries:
            path = ROOT / entry["path"]
            if not path.is_file():
                failures.append(f"manifest missing: {entry['path']}")
            elif sha256(path) != entry["sha256"]:
                failures.append(f"hash mismatch: {entry['path']}")

    claims_path = ROOT / "CLAIM_TABLE.csv"
    if claims_path.is_file():
        with claims_path.open(newline="", encoding="utf-8") as handle:
            claims = list(csv.DictReader(handle))
        if len(claims) != 9:
            failures.append("claim-table row count")
        if not any(row["claim_id"] == "SCC003-N2" and row["status"] == "NOT_ESTABLISHED" for row in claims):
            failures.append("novelty boundary")

    verifier = ROOT / "reference/verify_reference.py"
    if verifier.is_file():
        proc = subprocess.run(
            [sys.executable, verifier.name],
            cwd=verifier.parent,
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
        )
        if proc.returncode != 0 or '"status": "PASS"' not in proc.stdout or '"checks": 177' not in proc.stdout:
            failures.append("reference verifier")

    result = {
        "status": "PASS" if not failures else "FAIL",
        "required_files": len(REQUIRED),
        "manifest_files": len(manifest.get("files", [])) if manifest_path.is_file() else 0,
        "failures": failures,
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
