#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("result")
    args = parser.parse_args()
    data = json.loads(Path(args.result).read_text(encoding="utf-8"))
    c = data["carriers"]
    checks = {
        "schema": data["schema"] == "nexah.a0.cross_carrier_return_economy.result.v1",
        "study": data["study_id"] == "A0_BL_055_CROSS_CARRIER_RETURN_ECONOMY_2026_10_18",
        "source_integrity": all(v["pass"] for v in data["source_integrity"].values()),
        "three_carriers": set(c) == {"Q106_O16", "TYPED_SEAM", "DECIMAL_D4"},
        "raw_bits": [c[k]["raw_fixed_bits"] for k in c] == [14, 7, 8] or sorted(v["raw_fixed_bits"] for v in c.values()) == [7, 8, 14],
        "q_return": c["Q106_O16"]["exact_return"] == 106,
        "q_parity": c["Q106_O16"]["saving_bits_mean"] == 0 and c["Q106_O16"]["matched_control_bits_mean"] == 7,
        "seam_return": c["TYPED_SEAM"]["exact_return"] == 140,
        "seam_advantage": c["TYPED_SEAM"]["saving_bits_mean"] == 0.464285714286,
        "seam_control": c["TYPED_SEAM"]["invalid_glue_return"] == 106 and c["TYPED_SEAM"]["invalid_glue_mixed_levels"] == 30,
        "decimal_return": c["DECIMAL_D4"]["exact_return"] == 9000,
        "decimal_parity": c["DECIMAL_D4"]["saving_bits_mean"] == 0,
        "single_view_parity": c["DECIMAL_D4"]["single_first_bits"] == 14 and c["DECIMAL_D4"]["single_second_bits"] == 14,
        "return_hypothesis": data["hypotheses"]["H_RETURN_GRAMMAR"] is True,
        "economy_hypothesis": data["hypotheses"]["H_ECONOMY_GENERALIZES"] is False,
        "specificity": data["hypotheses"]["H_SPECIFICITY"] is True,
        "advantage_count": data["cross_carrier"]["economy_advantage_carriers"] == 1,
        "classification": data["classification"] == "MIXED_RETURN_GRAMMAR_PASS_ECONOMY_GENERALIZATION_FAIL",
        "gates": data["all_audit_gates_pass"] is True and all(data["gates"].values()),
        "boundaries": len(data["claim_boundary"]) == 7,
    }
    passed = sum(checks.values())
    print(json.dumps({"status": "PASS" if passed == len(checks) else "FAIL", "passed": passed, "total": len(checks), "checks": checks}, indent=2, sort_keys=True))
    raise SystemExit(0 if passed == len(checks) else 1)


if __name__ == "__main__":
    main()

