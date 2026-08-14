from __future__ import annotations

import hashlib
import io
import json
import zipfile
from pathlib import Path

import numpy as np

ACTION_IDS = ("U0", "UXP", "UXM", "UYP", "UYM", "UZP", "UZM")
ACTION_PAIRS = tuple((left, right) for left in range(7) for right in range(left + 1, 7))
REVIEWED_HASH = "288b50e7d28eb78e9fb07a7748b2ef18f99f92415d402409d2f6c2883a4970ec"
L4_001_RESULT_HASH = "006b2b2edbb822e89888761813e72b17ee4431318ffe02a89b69a2c4dc6ca548"
EXPECTED_INPUT_HASHES = {
    "source_products.npz": "81d183afb7226da6ec9f234e04ab0d1fdd8ec2b6b94dfca62103d39f85174a30",
    "R0_candidate.npz": "222de002c2b7e5f78add0eeadbd5ca8cc5f88222dfbeea6dc7acfc0b88cede5c",
    "R1_candidate.npz": "0bc46cad550b7daf9db18693842d4fc13c92c62ff75bc5f5cb8b312ecebfb44b",
    "R2_candidate.npz": "8b1da908ae4a3127557f650de973c2aa186ed83de5abc5b774daf213cae0895a",
    "R3_input.npz": "42dab0ddaccbe2500315ce282ece439486ea3aef9461c540818aaeb53c257310",
    "R3_result.json": "bad6f22c3ee411900397483a39da73e926435c81bf016f7adacb8f4d4f3134c9",
}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True, allow_nan=False) + "\n")


def save_npz(path: Path, **arrays: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name in sorted(arrays):
            buffer = io.BytesIO()
            np.save(buffer, np.asarray(arrays[name]), allow_pickle=False)
            info = zipfile.ZipInfo(f"{name}.npy", date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o600 << 16
            archive.writestr(info, buffer.getvalue(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)


def encode_relations(ranks: np.ndarray) -> np.ndarray:
    values = np.asarray(ranks, dtype=np.float64)
    if values.ndim != 2 or values.shape[1] != 7:
        raise ValueError("rank matrix must be N x 7")
    return np.stack([np.sign(values[:, left] - values[:, right]) for left, right in ACTION_PAIRS], axis=1).astype(np.int8)


def kernel(left: np.ndarray, right: np.ndarray) -> np.ndarray:
    left = np.asarray(left, dtype=np.int8)
    right = np.asarray(right, dtype=np.int8)
    out = np.full(np.broadcast_shapes(left.shape, right.shape), -1, dtype=np.int8)
    both_tie = (left == 0) & (right == 0)
    same_strict = (left == right) & (left != 0)
    out[both_tie] = 0
    out[same_strict] = 1
    return out


def pair_components(left: np.ndarray, right: np.ndarray) -> dict[str, int]:
    left = np.asarray(left)
    right = np.asarray(right)
    same = (left == right) & (left != 0)
    tie_tie = (left == 0) & (right == 0)
    opposite = (left == -right) & (left != 0) & (right != 0)
    one_sided = (left == 0) ^ (right == 0)
    if not np.all(same | tie_tie | opposite | one_sided):
        raise ValueError("relation decomposition is not exhaustive")
    return {
        "same_strict_orientation": int(same.sum()),
        "tie_tie": int(tie_tie.sum()),
        "opposite_strict_orientation": int(opposite.sum()),
        "one_sided_tie_strict": int(one_sided.sum()),
        "total_cells": int(left.size),
    }


def tnspa(left: np.ndarray, right: np.ndarray) -> float:
    return float(kernel(left, right).mean())


def null_seed(pair_id: str) -> int:
    payload = f"L4.003-NULL|{pair_id}|{L4_001_RESULT_HASH}".encode("utf-8")
    return int.from_bytes(hashlib.sha256(payload).digest()[:8], "big", signed=False)


def quantile_higher(values: np.ndarray, probability: float) -> float:
    ordered = np.sort(np.asarray(values, dtype=np.float64))
    index = int(np.ceil(probability * len(ordered))) - 1
    return float(ordered[max(0, min(index, len(ordered) - 1))])
