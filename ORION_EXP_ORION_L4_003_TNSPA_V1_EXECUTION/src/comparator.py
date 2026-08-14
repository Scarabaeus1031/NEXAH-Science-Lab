from __future__ import annotations

import argparse
import json
from pathlib import Path

from tnspa_core import save_json, sha


def read(path: str) -> dict:
    return json.loads(Path(path).read_text())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--encoder-ledger", required=True)
    parser.add_argument("--observer-seal", required=True)
    parser.add_argument("--observed", required=True)
    parser.add_argument("--null-summary", required=True)
    parser.add_argument("--controls", required=True)
    parser.add_argument("--r3", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    encoder, seal, observed, nulls, controls, r3 = map(read, (args.encoder_ledger, args.observer_seal, args.observed, args.null_summary, args.controls, args.r3))
    if not seal.get("sealed") or seal["observed_metrics_sha256"] != sha(Path(args.observed)):
        raise RuntimeError("unsealed observer input")
    provenance_valid = bool(encoder["joint_support_count"] == 1399 and encoder["action_pair_count"] == 21)
    info_pass = {rep: value["I_r"] >= 0.50 for rep, value in observed["informativeness"].items()}
    pair_pass = {}
    for pair_id, value in observed["pair_results"].items():
        null = nulls[pair_id]
        pair_pass[pair_id] = {
            "effect_ge_0_60": value["TNSPA"] >= 0.60,
            "observed_gt_q99": bool(null["observed_gt_q99"]),
            "p_le_0_01": bool(null["p_le_0_01"]),
        }
        pair_pass[pair_id]["passes_all_pair_gates"] = all(pair_pass[pair_id].values())
    controls_valid = bool(controls["all_controls_and_fixtures_pass"])
    r3_valid = bool(r3["valid"])
    if not provenance_valid or not controls_valid or not r3_valid:
        classification = "INVALID_EXPERIMENT"
    elif not all(info_pass.values()):
        classification = "INSUFFICIENTLY_INFORMATIVE"
    elif all(value["passes_all_pair_gates"] for value in pair_pass.values()) and observed["TNSPA_min"] >= 0.60:
        classification = "ROBUST"
    elif len({value["passes_all_pair_gates"] for value in pair_pass.values()}) > 1:
        classification = "REPRESENTATION_DEPENDENT"
    else:
        classification = "FAILED"
    result = {
        "classification": classification,
        "controls_valid": controls_valid,
        "expected_conclusion_opened_after_observer_seal": True,
        "informativeness_pass": info_pass,
        "pair_gate_results": pair_pass,
        "provenance_valid": provenance_valid,
        "R3_valid": r3_valid,
        "TNSPA_min_ge_0_60": observed["TNSPA_min"] >= 0.60,
    }
    save_json(output / "comparison_result.json", result)


if __name__ == "__main__":
    main()
