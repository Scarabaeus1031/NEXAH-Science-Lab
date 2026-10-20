#!/usr/bin/env python3
"""Structural verifier for A0-BL-049."""
import json
import sys


def main(path):
    with open(path, encoding="utf-8") as handle:
        result = json.load(handle)
    maps = result["maps"]
    types = result["source_bound_types"]
    checks = {
        "schema": result["schema"] == "nexah.a0.bl049.iota-thooth-typing-result/1.0.0",
        "study": result["study_id"] == "A0_BL_049_IOTA_THOOTH_OPERATOR_TYPING_2026_10_18",
        "classification": result["classification"] == "PASS_TYPED_LOSSY_PROJECTIONS_WITH_JOINT_EXACT_RETURN",
        "domain": result["domain_size"] == 9000,
        "first_image": maps["delta_first"]["image_size"] == 1000,
        "first_fibres": maps["delta_first"]["fibre_histogram"] == {"9": 1000},
        "first_loss_and_return": maps["delta_first"]["collision_count"] == 8000 and maps["delta_first"]["return_with_removed_digit"] == 9000 and maps["delta_first"]["uniform_residual_bits"] == 4,
        "second_image": maps["delta_second"]["image_size"] == 900,
        "second_fibres": maps["delta_second"]["fibre_histogram"] == {"10": 900},
        "second_loss_and_return": maps["delta_second"]["collision_count"] == 8100 and maps["delta_second"]["return_with_removed_digit"] == 9000 and maps["delta_second"]["uniform_residual_bits"] == 4,
        "joint_exact": maps["joint"] == {"image_size": 9000, "residual_bits": 0, "return_count": 9000},
        "swap_control": maps["swap_middle_control"] == {"bijective": True, "image_size": 9000},
        "registered_witness": result["witnesses"]["registered"] == {"source": "1737", "delta_first": "737", "delta_second": "137"},
        "iota_type": types["IOTA_EXISTING"]["type"] == "PARAMETERIZED_DIRECTED_CLASSIFIER",
        "thooth_nonoperator": types["THOOTH_EXISTING"]["executable_operator"] is False,
        "ten_gates": len(result["gates"]) == 10 and all(result["gates"].values()),
        "claim_boundary": "No glyph algebra" in result["claim_boundary"],
    }
    status = "PASS" if all(checks.values()) else "FAIL"
    print(json.dumps({"status": status, "passed": sum(checks.values()), "total": len(checks), "checks": checks}, indent=2, sort_keys=True))
    raise SystemExit(0 if status == "PASS" else 1)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: verify_result.py RESULT.json")
    main(sys.argv[1])

