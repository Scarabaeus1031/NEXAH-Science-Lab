from __future__ import annotations

import hashlib
import json
from typing import Any


SERIALIZER_VERSION = "ORION_TYPED_CANONICAL_V2"
GRID_ORDER = {"G2": 0, "G3": 1}
ORIENTATION_ORDER = {"FORWARD_23": 0, "REVERSE_32": 1}
INDEX_FIELDS = {"indices", "left", "right", "kappa", "source_indices"}


def raw_bytes(obj: Any) -> bytes:
    return (json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False) + "\n").encode("utf-8")


def _fraction_key(value: Any) -> tuple[int, int]:
    if isinstance(value, dict) and set(value) >= {"num", "den"}:
        return int(value["num"]), int(value["den"])
    return 0, 1


def _block_key(record: dict[str, Any]) -> tuple[Any, ...]:
    n, d = _fraction_key(record.get("mean"))
    return (GRID_ORDER.get(record.get("type"), 99), tuple(record.get("indices", [])), n, d)


def _relation_key(record: dict[str, Any]) -> tuple[Any, ...]:
    n, d = _fraction_key(record.get("difference"))
    return (
        GRID_ORDER.get(record.get("left_type"), 99), tuple(record.get("left", [])),
        GRID_ORDER.get(record.get("right_type"), 99), tuple(record.get("right", [])),
        tuple(record.get("kappa", [])), int(record.get("omega", 0)), n, d,
    )


def normalize_typed(obj: Any, field: str = "") -> Any:
    if isinstance(obj, dict):
        return {str(k): normalize_typed(v, str(k)) for k, v in obj.items()}
    if isinstance(obj, tuple):
        obj = list(obj)
    if isinstance(obj, set):
        return sorted((normalize_typed(v) for v in obj), key=raw_bytes)
    if isinstance(obj, list):
        values = [normalize_typed(v) for v in obj]
        if field in INDEX_FIELDS and all(type(v) is int for v in values):
            return sorted(values)
        if field in {"G2", "G3"} and all(isinstance(v, dict) for v in values):
            return sorted(values, key=_block_key)
        if field == "GR_struct" and all(isinstance(v, dict) for v in values):
            return sorted(values, key=_relation_key)
        return values
    return obj


def canonical_bytes(obj: Any) -> bytes:
    return raw_bytes(normalize_typed(obj))


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical_sha256(obj: Any) -> str:
    return sha256_bytes(canonical_bytes(obj))

