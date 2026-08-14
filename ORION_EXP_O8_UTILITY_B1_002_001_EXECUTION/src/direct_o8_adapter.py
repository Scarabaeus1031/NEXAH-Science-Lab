from __future__ import annotations

import hashlib
import importlib.util
from pathlib import Path
from typing import Any

SOURCE_SHA = "80896d1ad901045ed771dd2e88f8a87e7f8c2bc26c43d797022eae67a48d8610"
CANON_SHA = "e5a5343b6e9a4576f3cf6c49d7e1976eca5891af91c012edfd5da862e080e83b"


def _load(path: Path, name: str) -> Any:
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class DirectO8:
    """Hash-bound adapter only; all scientific mathematics remains in the bound modules."""

    def __init__(self, source: Path, canonicalizer: Path):
        if hashlib.sha256(source.read_bytes()).hexdigest() != SOURCE_SHA:
            raise RuntimeError("controlling transformation source hash mismatch")
        if hashlib.sha256(canonicalizer.read_bytes()).hexdigest() != CANON_SHA:
            raise RuntimeError("repaired canonicalizer hash mismatch")
        self._source = _load(source, "b1002_bound_o8_source")
        self._canon = _load(canonicalizer, "b1002_bound_o8_canonicalizer")

    @property
    def actions(self) -> tuple[str, ...]:
        return tuple(self._source.BIT_ORDER)

    def apply(self, state: dict[str, Any], bits: str) -> dict[str, Any]:
        return self._source.apply_sequence(state, self._source.sequence_for_bits(bits))

    def materialize(self, state: dict[str, Any]) -> dict[str, Any]:
        return self._source.materialize(state)

    def canonical(self, value: Any) -> bytes:
        return self._canon.canonical_typed_bytes(value)

    def validate(self, state: dict[str, Any]) -> tuple[bool, str]:
        return self._source.validate_state(state)
