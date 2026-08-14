"""Load the frozen JSON-subset YAML configuration and enforce immutability."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any, Dict


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_config(path: Path, expected_sha256: str | None = None) -> Dict[str, Any]:
    path = Path(path)
    if expected_sha256 and sha256_file(path) != expected_sha256:
        raise RuntimeError("frozen configuration hash mismatch")
    with path.open("r", encoding="utf-8") as stream:
        config = json.load(stream)
    required = {"config_id", "plant", "data", "actions", "objective", "representations", "support", "analysis", "execution"}
    missing = required.difference(config)
    if missing:
        raise ValueError(f"configuration missing keys: {sorted(missing)}")
    if config["status"] != "FROZEN_NOT_EXECUTED":
        raise ValueError("configuration is not frozen and sealed")
    return config


def registered_seeds(config: Dict[str, Any]) -> set[int]:
    result: set[int] = set()
    for key in ("train_seeds", "test_seeds"):
        block = config["data"][key]
        result.update(range(int(block["start"]), int(block["stop_inclusive"]) + 1))
    return result
