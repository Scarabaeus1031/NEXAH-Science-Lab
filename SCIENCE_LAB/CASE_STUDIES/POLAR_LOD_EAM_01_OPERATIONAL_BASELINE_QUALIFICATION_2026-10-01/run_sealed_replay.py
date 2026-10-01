#!/usr/bin/env python3
"""Invoke the canonical historical replay with the bound runtime."""

from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path


PACKAGE = Path(__file__).resolve().parent
RUNTIME = json.loads((PACKAGE / "RUNTIME_ENVIRONMENT.json").read_text())


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    configured = os.environ.get("POLAR_LOD_PYTHON")
    python = Path(configured or RUNTIME["python"]["provided_entrypoint"]).resolve()
    if not python.is_file():
        raise SystemExit(
            "Bound CPython is unavailable. Set POLAR_LOD_PYTHON to a CPython "
            "3.12.14 binary matching RUNTIME_ENVIRONMENT.json."
        )
    actual = sha256(python)
    expected = RUNTIME["python"]["binary_sha256"]
    if actual != expected:
        raise SystemExit(
            f"Interpreter SHA-256 mismatch: expected {expected}, got {actual}"
        )
    command = [str(python), str(PACKAGE / "eam_vintage_qualification.py"), *sys.argv[1:]]
    raise SystemExit(subprocess.run(command, check=False).returncode)


if __name__ == "__main__":
    main()
