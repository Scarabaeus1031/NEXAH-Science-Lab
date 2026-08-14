"""SHA-256 and environment provenance helpers."""
from __future__ import annotations

import hashlib
import json
import platform
from pathlib import Path
import sys
import numpy as np


def sha256_file(path: Path) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def tree_manifest(root: Path, patterns=("*.py", "*.yaml")) -> dict[str, str]:
    root = Path(root)
    files = sorted({p for pattern in patterns for p in root.rglob(pattern) if "__pycache__" not in p.parts})
    return {str(path.relative_to(root)): sha256_file(path) for path in files}


def composite_hash(manifest: dict[str, str]) -> str:
    payload = "".join(f"{digest}  {path}\n" for path, digest in sorted(manifest.items())).encode()
    return hashlib.sha256(payload).hexdigest()


def environment() -> dict[str, str]:
    return {"python": sys.version.replace("\n", " "), "numpy": np.__version__, "platform": platform.platform()}


def write_json(path: Path, value: object) -> None:
    Path(path).write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def verify_freeze_lock(root: Path, lock_path: Path) -> str:
    lock = json.loads(Path(lock_path).read_text(encoding="utf-8"))
    actual = composite_hash(tree_manifest(Path(root)))
    if actual != lock["source_config_test_composite_sha256"]:
        raise RuntimeError("source/config/test freeze hash mismatch")
    return actual
