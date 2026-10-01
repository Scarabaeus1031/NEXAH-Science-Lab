#!/usr/bin/env python3
"""Invoke the POLAR custody collector with its bound interpreter."""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path


PACKAGE = Path(__file__).resolve().parent
RUNTIME_PATH = (
    PACKAGE.parent
    / "POLAR_LOD_EAM_01_OPERATIONAL_BASELINE_QUALIFICATION_2026-10-01"
    / "RUNTIME_ENVIRONMENT.json"
)
EXPECTED_RUNTIME_SHA256 = "54a7bf31850b06b7be364caeaf6d115ee5849ba93c8e5308528368572fdd728a"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    if sha256(RUNTIME_PATH) != EXPECTED_RUNTIME_SHA256:
        raise SystemExit("Custody runtime receipt SHA-256 mismatch")
    runtime = json.loads(RUNTIME_PATH.read_text())
    python = Path(runtime["python"]["provided_entrypoint"]).resolve()
    if not python.is_file():
        raise SystemExit("Bound custody interpreter is unavailable")
    if sha256(python) != runtime["python"]["binary_sha256"]:
        raise SystemExit("Bound custody interpreter SHA-256 mismatch")
    command = [str(python), str(PACKAGE / "prospective_custody.py"), *sys.argv[1:]]
    raise SystemExit(subprocess.run(command, check=False).returncode)


if __name__ == "__main__":
    main()
