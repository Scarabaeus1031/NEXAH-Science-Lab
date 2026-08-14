from __future__ import annotations

import argparse
import hashlib
from pathlib import Path

import numpy as np

from core import N_SOURCES, PRECISION, SOURCE_SEED_HEX, sha256_file, write_json


def generate_digits() -> tuple[np.ndarray, list[str]]:
    master = bytes.fromhex(SOURCE_SEED_HEX)
    digits = np.empty((N_SOURCES, PRECISION), dtype=np.uint8)
    opaque_ids: list[str] = []
    for j in range(N_SOURCES):
        stream = hashlib.shake_256(master + f"|SOURCE|{j}".encode("utf-8")).digest(64)
        accepted = [byte % 10 for byte in stream if byte < 250][:PRECISION]
        if len(accepted) != PRECISION:
            raise RuntimeError("source SHAKE prefix unexpectedly insufficient")
        digits[j, :] = accepted
        opaque_ids.append(hashlib.sha256(master + b"|ID|" + j.to_bytes(4, "big")).hexdigest())
    return digits, opaque_ids


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    digits, opaque_ids = generate_digits()
    source_path = out / "sources.npy"
    np.save(source_path, digits, allow_pickle=False)
    write_json(
        out / "source_manifest.json",
        {
            "base": 10,
            "count": N_SOURCES,
            "digits_sha256": sha256_file(source_path),
            "generator": "SHAKE256_REJECTION_UNIFORM_DIGITS",
            "master_seed": SOURCE_SEED_HEX,
            "opaque_ids": opaque_ids,
            "precision": PRECISION,
            "provenance_valid": True,
        },
    )


if __name__ == "__main__":
    main()
