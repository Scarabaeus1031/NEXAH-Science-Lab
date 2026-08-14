from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

from core import CORE, SUPPORT, block_starts, build_first_order_arrays, phase_offsets, write_json


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sources", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    digits = np.load(args.sources, allow_pickle=False)
    arrays = build_first_order_arrays(digits)
    transport_valid = True
    for c in range(6):
        s2, s3 = phase_offsets(c)
        n2, n3 = phase_offsets((c + 1) % 6)
        transport_valid = transport_valid and np.array_equal(block_starts(2, s2, CORE) + 1, block_starts(2, n2, CORE + 1))
        transport_valid = transport_valid and np.array_equal(block_starts(3, s3, CORE) + 1, block_starts(3, n3, CORE + 1))
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    np.savez(out / "first_order_fields.npz", **arrays)
    write_json(
        out / "first_order_manifest.json",
        {
            "A2": "OWN_GRID_WIDTH_2_NORMALIZED_BLOCK_MEAN_NUMERATOR",
            "A3": "OWN_GRID_WIDTH_3_NORMALIZED_BLOCK_MEAN_NUMERATOR",
            "core": CORE.tolist(),
            "field_schema": ["a2_pre", "a2_post", "a3_pre", "a3_post"],
            "forbidden_fields_absent": True,
            "support": SUPPORT,
            "transport_interval_bijection": bool(transport_valid),
        },
    )


if __name__ == "__main__":
    main()
