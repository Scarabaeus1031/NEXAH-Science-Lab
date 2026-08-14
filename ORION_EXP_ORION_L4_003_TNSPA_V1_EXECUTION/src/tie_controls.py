from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from tnspa_core import save_json, tnspa


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--relations", required=True)
    parser.add_argument("--observer-seal", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    relation_path = Path(args.relations).resolve()
    seal_path = Path(args.observer_seal).resolve()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    if not json.loads(seal_path.read_text()).get("sealed"):
        raise RuntimeError("controls require sealed primary observation")
    data = np.load(relation_path, allow_pickle=False)
    pairs = (("R0", "R1"), ("R0", "R2"), ("R1", "R2"))
    zeros = np.zeros((1399, 21), dtype=np.int8)
    tc1 = {}
    tc2 = {}
    for first, second in pairs:
        pair_id = f"{first}_{second}"
        mutual = tnspa(zeros, zeros)
        first_info = float(np.mean(data[first] != 0))
        one_sided = tnspa(data[first], zeros)
        tc1[pair_id] = {"TNSPA": mutual, "informativeness": [0.0, 0.0], "passes": bool(mutual == 0.0)}
        tc2[pair_id] = {
            "TNSPA": one_sided,
            "expected_negative_I_first": -first_info,
            "collapsed_side_informativeness": 0.0,
            "passes": bool(np.isclose(one_sided, -first_info, rtol=0.0, atol=1e-15)),
        }
    total = np.full((1, 21), -1, dtype=np.int8)
    reversed_total = np.full((1, 21), 1, dtype=np.int8)
    tc3_value = tnspa(total, reversed_total)
    fixtures = {
        "identical_total": tnspa(total, total),
        "full_tie_full_tie": tnspa(np.zeros_like(total), np.zeros_like(total)),
        "full_tie_total": tnspa(np.zeros_like(total), total),
        "identical_partial_m10": tnspa(np.concatenate((np.full((1, 10), -1, dtype=np.int8), np.zeros((1, 11), dtype=np.int8)), axis=1), np.concatenate((np.full((1, 10), -1, dtype=np.int8), np.zeros((1, 11), dtype=np.int8)), axis=1)),
    }
    fixture_pass = bool(fixtures == {"identical_total": 1.0, "full_tie_full_tie": 0.0, "full_tie_total": -1.0, "identical_partial_m10": 10.0 / 21.0})
    result = {
        "TC1_MUTUAL_FULL_TIE_COLLAPSE": {"pairs": tc1, "passes": all(value["passes"] for value in tc1.values())},
        "TC2_ONE_SIDED_FULL_TIE_COLLAPSE": {"pairs": tc2, "passes": all(value["passes"] for value in tc2.values())},
        "TC3_STRICT_ORIENTATION_REVERSAL": {"TNSPA": tc3_value, "informativeness": [1.0, 1.0], "passes": tc3_value == -1.0},
        "algebraic_fixtures": {"values": fixtures, "passes": fixture_pass},
    }
    result["passing_control_count"] = sum(bool(result[key]["passes"]) for key in ("TC1_MUTUAL_FULL_TIE_COLLAPSE", "TC2_ONE_SIDED_FULL_TIE_COLLAPSE", "TC3_STRICT_ORIENTATION_REVERSAL"))
    result["registered_control_count"] = 3
    result["all_controls_and_fixtures_pass"] = bool(result["passing_control_count"] == 3 and fixture_pass)
    save_json(output / "tie_control_results.json", result)


if __name__ == "__main__":
    main()
