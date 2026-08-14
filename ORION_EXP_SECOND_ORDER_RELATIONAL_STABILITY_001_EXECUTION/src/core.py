from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np

N_SOURCES = 512
PRECISION = 18
CORE = np.arange(3, 15, dtype=np.int16)
PHASES = tuple(range(6))
UNITS = N_SOURCES * 6
SUPPORT = UNITS * len(CORE)
M_DEN_PER_UNIT = 1296
M_BAR_DEN = M_DEN_PER_UNIT * UNITS

SOURCE_SEED_HEX = "d2c6df5057c3587055df7f6be6cde460ae55ded518e29cc907c0f6cec76f9ed9"
N4_SEED_HEX = "3e1a7ffb850aecb9f8c1da34556e2d97edcba243058645858740662ece9ce3cf"
N3_SEED_HEX = "1aa8fe59d0a8581e9efbd3f261fff31a77f67d18bef01db14cd2099fc6d2a864"
D2_SEED_HEX = "c248aea2979d0ca428f9497014bcd2926f1527cb10ae129bc5ca1b6a4af35beb"
D3_SEED_HEX = "e1c3b4f298b8eb655902a225f9f26cff9c2a10148d40ed18dda6b03906a983fb"


def canonical_bytes(obj: object) -> bytes:
    return (json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False) + "\n").encode("utf-8")


def write_json(path: Path, obj: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(canonical_bytes(obj))


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def frac(num: int, den: int) -> dict[str, int]:
    import math

    if den <= 0:
        raise ValueError("denominator must be positive")
    g = math.gcd(int(num), int(den))
    return {"num": int(num) // g, "den": int(den) // g}


def phase_offsets(c: int) -> tuple[int, int]:
    return c % 2, c % 3


def block_starts(k: int, s: int, positions: np.ndarray) -> np.ndarray:
    return s + ((positions - s) // k) * k


def block_sum_field(digits: np.ndarray, k: int, s: int, positions: np.ndarray) -> np.ndarray:
    starts = block_starts(k, s, positions)
    if int(starts.min()) < 0 or int((starts + k).max()) > digits.shape[1]:
        raise ValueError("primary field requested incomplete block")
    out = np.zeros((digits.shape[0], len(positions)), dtype=np.int16)
    for r, start in enumerate(starts.tolist()):
        out[:, r] = digits[:, start : start + k].sum(axis=1, dtype=np.int16)
    return out


def build_first_order_arrays(digits: np.ndarray) -> dict[str, np.ndarray]:
    shape = (digits.shape[0], 6, len(CORE))
    arrays = {name: np.empty(shape, dtype=np.int16) for name in ("a2_pre", "a2_post", "a3_pre", "a3_post")}
    for c in PHASES:
        s2, s3 = phase_offsets(c)
        n2, n3 = phase_offsets((c + 1) % 6)
        arrays["a2_pre"][:, c, :] = block_sum_field(digits, 2, s2, CORE)
        arrays["a3_pre"][:, c, :] = block_sum_field(digits, 3, s3, CORE)
        arrays["a2_post"][:, c, :] = block_sum_field(digits, 2, n2, CORE + 1)
        arrays["a3_post"][:, c, :] = block_sum_field(digits, 3, n3, CORE + 1)
    return arrays


def observed_components(arrays: dict[str, np.ndarray]) -> dict[str, np.ndarray]:
    da2 = arrays["a2_post"].astype(np.int32) - arrays["a2_pre"].astype(np.int32)
    da3 = arrays["a3_post"].astype(np.int32) - arrays["a3_pre"].astype(np.int32)
    q_pre = 3 * arrays["a2_pre"].astype(np.int32) - 2 * arrays["a3_pre"].astype(np.int32)
    q_post = 3 * arrays["a2_post"].astype(np.int32) - 2 * arrays["a3_post"].astype(np.int32)
    a = np.abs(da2).sum(axis=2, dtype=np.int32)
    b = np.abs(da3).sum(axis=2, dtype=np.int32)
    c = np.abs(q_post - q_pre).sum(axis=2, dtype=np.int32)
    m_num = np.minimum(6 * a, 4 * b) - c
    return {"A": a, "B": b, "C": c, "M_num": m_num, "q_pre": q_pre, "q_post": q_post}


def higher_quantile_int(values: np.ndarray, probability: float) -> int:
    import math

    ordered = np.sort(values)
    index = int(math.ceil(probability * len(ordered)) - 1)
    return int(ordered[max(0, min(index, len(ordered) - 1))])


def shake_permutation(master: bytes, label: str, n: int) -> np.ndarray:
    if n < 1 or n > 250:
        raise ValueError("unsupported permutation size")
    seed = master + label.encode("utf-8")
    length = 64
    stream = hashlib.shake_256(seed).digest(length)
    cursor = 0
    perm = list(range(n))
    for i in range(n - 1, 0, -1):
        modulus = i + 1
        limit = (256 // modulus) * modulus
        while True:
            if cursor >= len(stream):
                old = length
                length *= 2
                stream = hashlib.shake_256(seed).digest(length)
                cursor = old
            value = stream[cursor]
            cursor += 1
            if value < limit:
                j = value % modulus
                perm[i], perm[j] = perm[j], perm[i]
                break
    return np.asarray(perm, dtype=np.int16)
