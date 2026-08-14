from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

from core import M_BAR_DEN, SUPPORT, frac, observed_components, write_json


def summary(values: np.ndarray, denominator: int) -> dict[str, object]:
    flat = values.reshape(-1).astype(np.int64)
    return {
        "count": int(flat.size),
        "maximum": frac(int(flat.max()), denominator),
        "mean": frac(int(flat.sum()), denominator * int(flat.size)),
        "minimum": frac(int(flat.min()), denominator),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--first-order", required=True)
    parser.add_argument("--relation", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    first = np.load(args.first_order, allow_pickle=False)
    relation = np.load(args.relation, allow_pickle=False)
    arrays = {name: first[name] for name in first.files}
    components = observed_components(arrays)
    if not np.array_equal(components["q_pre"], relation["q_pre"]) or not np.array_equal(components["q_post"], relation["q_post"]):
        raise RuntimeError("relation/first-order seal mismatch")
    observed_num = int(components["M_num"].sum(dtype=np.int64))
    informative = (components["A"] > 0) & (components["B"] > 0)
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    np.savez(out / "observer_arrays.npz", **{k: v for k, v in components.items() if k in ("A", "B", "C", "M_num")})
    write_json(
        out / "observer_result.json",
        {
            "Delta_2": summary(components["A"], 216),
            "Delta_3": summary(components["B"], 324),
            "Delta_R": summary(components["C"], 1296),
            "M_bar": frac(observed_num, M_BAR_DEN),
            "M_bar_raw_numerator": observed_num,
            "complete_support": SUPPORT,
            "informativeness_fraction": frac(int(informative.sum()), int(informative.size)),
            "informativeness_pass_90_percent": int(informative.sum()) * 10 >= int(informative.size) * 9,
            "observer_received_thresholds": False,
            "observer_received_expected_classification": False,
        },
    )


if __name__ == "__main__":
    main()
