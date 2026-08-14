from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

from core import build_first_order_arrays, observed_components, write_json


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    maps2 = [dict() for _ in range(6)]
    maps3 = [dict() for _ in range(6)]
    witness2 = [False] * 6
    witness3 = [False] * 6
    joint_exact = True
    positive_m = 0
    nonpositive_m = 0
    positive_c_values: set[int] = set()
    processed = 0
    chunk_size = 4096
    total = 1 << 18
    bit_positions = np.arange(17, -1, -1, dtype=np.uint32)
    for start in range(0, total, chunk_size):
        numbers = np.arange(start, min(start + chunk_size, total), dtype=np.uint32)
        digits = ((numbers[:, None] >> bit_positions[None, :]) & 1).astype(np.uint8)
        fields = build_first_order_arrays(digits)
        components = observed_components(fields)
        positive_m += int((components["M_num"] > 0).sum())
        nonpositive_m += int((components["M_num"] <= 0).sum())
        positive_c_values.update(int(v) for v in np.unique(components["C"]) if int(v) > 0)
        q_pre = components["q_pre"]
        q_post = components["q_post"]
        joint_exact = joint_exact and np.array_equal(q_pre, 3 * fields["a2_pre"] - 2 * fields["a3_pre"])
        joint_exact = joint_exact and np.array_equal(q_post, 3 * fields["a2_post"] - 2 * fields["a3_post"])
        for c in range(6):
            if witness2[c] and witness3[c]:
                continue
            for row in range(len(numbers)):
                q_sig = q_pre[row, c].tobytes() + q_post[row, c].tobytes()
                if not witness2[c]:
                    a2_sig = fields["a2_pre"][row, c].tobytes() + fields["a2_post"][row, c].tobytes()
                    old = maps2[c].get(a2_sig)
                    if old is None:
                        maps2[c][a2_sig] = q_sig
                    elif old != q_sig:
                        witness2[c] = True
                        maps2[c].clear()
                if not witness3[c]:
                    a3_sig = fields["a3_pre"][row, c].tobytes() + fields["a3_post"][row, c].tobytes()
                    old = maps3[c].get(a3_sig)
                    if old is None:
                        maps3[c][a3_sig] = q_sig
                    elif old != q_sig:
                        witness3[c] = True
                        maps3[c].clear()
        processed += len(numbers)
    nonseparability_pass = all(witness2) and all(witness3) and joint_exact
    construction_pass = positive_m > 0 and nonpositive_m > 0 and len(positive_c_values) >= 2
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    write_json(
        out / "fixture_audit.json",
        {
            "all_A2_fibers_nonunique_for_Q_by_phase": witness2,
            "all_A3_fibers_nonunique_for_Q_by_phase": witness3,
            "construction_audit_pass": construction_pass,
            "fixture_alphabet": [0, 1],
            "fixture_words_processed": processed,
            "joint_A2_A3_reconstructs_Q_exactly": joint_exact,
            "m_nonpositive_case_count": nonpositive_m,
            "m_positive_case_count": positive_m,
            "nonseparability_pass": nonseparability_pass,
            "positive_Delta_R_distinct_numerators": sorted(positive_c_values),
            "precision": 18,
            "scientific_population_used": False,
        },
    )


if __name__ == "__main__":
    main()
