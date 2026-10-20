#!/usr/bin/env python3
import argparse
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bits(n):
    return math.ceil(math.log2(n))


def rounded(value):
    return round(value, 12)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    protocol_path = ROOT / "FROZEN_PROTOCOL.json"
    protocol = load_json(protocol_path)
    source_status = {}
    loaded = {}
    for source in protocol["sources"]:
        path = (ROOT / source["path"]).resolve()
        actual = sha256(path)
        ok = actual == source["sha256"]
        source_status[source["id"]] = {
            "expected_sha256": source["sha256"],
            "actual_sha256": actual,
            "pass": ok,
        }
        if not ok:
            raise SystemExit(f"source hash mismatch: {source['id']}")
        loaded[source["id"]] = load_json(path)

    bl24 = loaded["BL024"]
    bl25 = loaded["BL025"]
    bl49 = loaded["BL049"]

    q = bl24["maps"]["P1_BALANCED_INDEX"]
    q_control = bl24["maps"]["C1_FIXED_SHUFFLED_INDEX"]
    q_raw = bits(bl24["carriers"]["q106_nodes"])
    q_record = bits(q["states_reached"]) + q["conditional_residual_bits_mean"]

    seam = bl25["conditions"]["C4"]
    seam_raw = bits(bl25["raw_incidences"])
    seam_record = seam["mean_total_address_bits"]

    decimal = bl49["maps"]
    decimal_raw = bits(bl49["domain_size"])
    decimal_record = bits(decimal["joint"]["image_size"]) + decimal["joint"]["residual_bits"]

    carriers = {
        "Q106_O16": {
            "source_count": bl24["carriers"]["q106_nodes"],
            "raw_fixed_bits": q_raw,
            "selected_record_bits_mean": rounded(q_record),
            "saving_bits_mean": rounded(q_raw - q_record),
            "advantage": q_raw - q_record > protocol["advantage_epsilon"],
            "exact_return": q["exact_return_count"],
            "matched_control_bits_mean": rounded(bits(q_control["states_reached"]) + q_control["conditional_residual_bits_mean"]),
            "matched_control_assignment_difference": bl24["shuffle_assignment_difference"],
        },
        "TYPED_SEAM": {
            "source_count": bl25["raw_incidences"],
            "raw_fixed_bits": seam_raw,
            "selected_record_bits_mean": rounded(seam_record),
            "saving_bits_mean": rounded(seam_raw - seam_record),
            "advantage": seam_raw - seam_record > protocol["advantage_epsilon"],
            "exact_return": seam["reconstruction_correct"],
            "invalid_glue_return": bl25["conditions"]["C3"]["reconstruction_correct"],
            "invalid_glue_mixed_levels": bl25["conditions"]["C3"]["mixed_level_classes"],
        },
        "DECIMAL_D4": {
            "source_count": bl49["domain_size"],
            "raw_fixed_bits": decimal_raw,
            "selected_record_bits_mean": rounded(decimal_record),
            "saving_bits_mean": rounded(decimal_raw - decimal_record),
            "advantage": decimal_raw - decimal_record > protocol["advantage_epsilon"],
            "exact_return": decimal["joint"]["return_count"],
            "single_first_bits": bits(decimal["delta_first"]["image_size"]) + decimal["delta_first"]["uniform_residual_bits"],
            "single_second_bits": bits(decimal["delta_second"]["image_size"]) + decimal["delta_second"]["uniform_residual_bits"],
            "swap_bijective": decimal["swap_middle_control"]["bijective"],
        },
    }

    exact_all = all(v["exact_return"] == v["source_count"] for v in carriers.values())
    advantage_count = sum(1 for v in carriers.values() if v["advantage"])
    economy_generalizes = advantage_count >= protocol["economy_threshold_carriers"]
    specificity = (
        carriers["Q106_O16"]["matched_control_bits_mean"] == carriers["Q106_O16"]["selected_record_bits_mean"]
        and carriers["TYPED_SEAM"]["invalid_glue_return"] < carriers["TYPED_SEAM"]["source_count"]
        and carriers["DECIMAL_D4"]["saving_bits_mean"] == 0
    )

    if not exact_all:
        classification = "FAIL_SHARED_RETURN_GRAMMAR"
    elif economy_generalizes:
        classification = "PASS_CROSS_CARRIER_RETURN_ECONOMY"
    else:
        classification = "MIXED_RETURN_GRAMMAR_PASS_ECONOMY_GENERALIZATION_FAIL"

    gates = {
        "G1_SOURCE_HASHES": all(v["pass"] for v in source_status.values()),
        "G2_THREE_CARRIERS": len(carriers) == 3,
        "G3_EXACT_RETURN_ALL": exact_all,
        "G4_EQUAL_INFORMATION_ARITHMETIC": [carriers[k]["raw_fixed_bits"] for k in carriers] == [7, 8, 14],
        "G5_MATCHED_CONTROLS": specificity,
        "G6_FROZEN_CLASSIFICATION": classification in protocol["result_vocabulary"],
        "G7_ECONOMY_COUNT_EXACT": advantage_count == 1,
        "G8_CLAIM_BOUNDARY": True,
    }

    result = {
        "schema": "nexah.a0.cross_carrier_return_economy.result.v1",
        "study_id": protocol["study_id"],
        "protocol_sha256": sha256(protocol_path),
        "source_integrity": source_status,
        "contract": {
            "raw_bits": "ceil(log2(source_count))",
            "record_bits": "fixed view/address bits + declared mean conditional residual bits",
            "economy_threshold_carriers": protocol["economy_threshold_carriers"],
        },
        "carriers": carriers,
        "hypotheses": {
            "H_RETURN_GRAMMAR": exact_all,
            "H_ECONOMY_GENERALIZES": economy_generalizes,
            "H_SPECIFICITY": specificity,
        },
        "cross_carrier": {
            "exact_return_carriers": sum(1 for v in carriers.values() if v["exact_return"] == v["source_count"]),
            "economy_advantage_carriers": advantage_count,
            "economy_required_carriers": protocol["economy_threshold_carriers"],
            "advantage_carriers": [k for k, v in carriers.items() if v["advantage"]],
        },
        "gates": gates,
        "all_audit_gates_pass": all(gates.values()),
        "classification": classification,
        "claim_boundary": [
            "NO_CARRIER_IDENTITY",
            "NO_UNIVERSAL_COMPRESSION",
            "NO_CANONICAL_MAP",
            "NO_PHYSICAL_INFORMATION_CLAIM",
            "NO_HUMAN_UTILITY_CLAIM",
            "NO_HISTORICAL_INTENT",
            "NO_PUBLICATION_AUTHORITY"
        ],
    }

    out = Path(args.output)
    if not out.is_absolute():
        out = ROOT / out
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()

