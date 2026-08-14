"""Registered-seed lock. Authorization is external to the frozen package."""
from __future__ import annotations

import json
from pathlib import Path

from .config_loader import sha256_file


REGISTERED_MODES = {"registered", "full"}


def require_authorization(mode: str, config: dict, config_path: Path, authorization_file: Path | None) -> None:
    if mode not in REGISTERED_MODES:
        return
    if authorization_file is None or not Path(authorization_file).is_file():
        raise PermissionError("registered execution locked: an external authorization file is required")
    authorization = json.loads(Path(authorization_file).read_text(encoding="utf-8"))
    expected = {
        "authorization": config["execution"]["authorization_phrase"],
        "config_id": config["config_id"],
        "config_sha256": sha256_file(Path(config_path)),
    }
    if any(authorization.get(key) != value for key, value in expected.items()):
        raise PermissionError("registered execution locked: authorization does not match frozen configuration")
