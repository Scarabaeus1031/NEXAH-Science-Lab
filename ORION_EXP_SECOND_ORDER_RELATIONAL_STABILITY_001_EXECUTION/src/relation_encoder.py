from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

from core import write_json


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--first-order", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    data = np.load(args.first_order, allow_pickle=False)
    q_pre = 3 * data["a2_pre"].astype(np.int16) - 2 * data["a3_pre"].astype(np.int16)
    q_post = 3 * data["a2_post"].astype(np.int16) - 2 * data["a3_post"].astype(np.int16)
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    np.savez(out / "relation_fields.npz", q_pre=q_pre, q_post=q_post)
    write_json(
        out / "relation_manifest.json",
        {
            "authentic_kappa": True,
            "field_equivalent": "q=(3*a2_sum-2*a3_sum)/54",
            "forbidden_metadata_absent": True,
            "layout_used": False,
            "schema": "RELATION_INPUT",
        },
    )


if __name__ == "__main__":
    main()
