from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from core import N4_SEED_HEX, shake_permutation, write_json


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--first-order", required=True)
    parser.add_argument("--source-manifest", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    first = np.load(args.first_order, allow_pickle=False)
    ids = json.loads(Path(args.source_manifest).read_text("utf-8"))["opaque_ids"]
    master = bytes.fromhex(N4_SEED_HEX)
    a2pre = first["a2_pre"].copy()
    a2post = first["a2_post"].copy()
    a3pre = np.empty_like(first["a3_pre"])
    a3post = np.empty_like(first["a3_post"])
    for source, opaque_id in enumerate(ids):
        for phase in range(6):
            seal = shake_permutation(master, f"NULL_SEAL|{opaque_id}|{phase}", 12)
            a3pre[source, phase] = first["a3_pre"][source, phase, seal]
            a3post[source, phase] = first["a3_post"][source, phase, seal]
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    np.savez(out / "null_relation_input.npz", a2_pre=a2pre, a2_post=a2post, a3_pre=a3pre, a3_post=a3post)
    write_json(
        out / "null_input_manifest.json",
        {
            "authentic_kappa_available": False,
            "fixed_seal_mapping_exported": False,
            "marginal_pre_post_trajectories_preserved": True,
            "schema": "NULL_RELATION_INPUT",
        },
    )


if __name__ == "__main__":
    main()
