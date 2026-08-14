"""Frozen scorer: the only module allowed to consume sealed labels."""

from __future__ import annotations


LABEL_CODE = {f"T{i}": i for i in range(1, 7)} | {"NO_LOSS": 7}


def _distance(prediction, actual):
    if prediction == "UNRESOLVED":
        return 7
    return abs(LABEL_CODE[prediction] - LABEL_CODE[actual])


def _endpoint(predictions, records):
    rows = []
    for record in records:
        case_id = record["case_id"]
        actual = record["true_first_loss_stage"]
        prediction = predictions[case_id]
        rows.append({
            "case_id": case_id, "actual": actual, "prediction": prediction,
            "correct": prediction == actual, "stage_distance": _distance(prediction, actual),
            "false_loss": actual == "NO_LOSS" and prediction.startswith("T"),
            "missed_loss": actual != "NO_LOSS" and prediction in ("NO_LOSS", "UNRESOLVED"),
        })
    n = len(rows)
    no_loss = [r for r in rows if r["actual"] == "NO_LOSS"]
    loss = [r for r in rows if r["actual"] != "NO_LOSS"]
    return {
        "n": n,
        "exact_count": sum(r["correct"] for r in rows),
        "exact_accuracy": sum(r["correct"] for r in rows) / n,
        "mean_stage_error": sum(r["stage_distance"] for r in rows) / n,
        "false_loss_count": sum(r["false_loss"] for r in no_loss),
        "false_loss_rate": sum(r["false_loss"] for r in no_loss) / len(no_loss),
        "missed_loss_count": sum(r["missed_loss"] for r in loss),
        "missed_loss_rate": sum(r["missed_loss"] for r in loss) / len(loss),
        "rows": rows,
    }


def score(public_cases, sealed_records, baseline_outputs, nexah_outputs, audit):
    sealed_by_id = {record["case_id"]: record for record in sealed_records}
    held = [record for record in sealed_records if record["suite"] == "HELD_OUT"]
    controls = [record for record in sealed_records if record["suite"] == "CONTROL"]
    method_predictions = {}
    for method in [f"B{i}" for i in range(7)]:
        method_predictions[method] = {cid: output[method]["prediction"] for cid, output in baseline_outputs.items()}
    for method in [f"N{i}" for i in range(5)]:
        method_predictions[method] = {cid: output[method]["prediction"] for cid, output in nexah_outputs.items()}

    endpoints = {method: _endpoint(predictions, held) for method, predictions in method_predictions.items()}
    control_endpoints = {method: _endpoint(predictions, controls) for method, predictions in method_predictions.items()}
    comparator_ids = [f"B{i}" for i in range(7)] + [f"N{i}" for i in range(4)]
    strongest = sorted(comparator_ids, key=lambda m: (-endpoints[m]["exact_accuracy"], endpoints[m]["mean_stage_error"], m))[0]
    n4 = endpoints["N4"]
    best = endpoints[strongest]

    unique_correct = []
    reverse_unique = []
    for record in held:
        cid, actual = record["case_id"], record["true_first_loss_stage"]
        n4_correct = method_predictions["N4"][cid] == actual
        comparator_correct = [method_predictions[m][cid] == actual for m in comparator_ids]
        if n4_correct and not any(comparator_correct):
            unique_correct.append(cid)
        if not n4_correct and any(comparator_correct):
            reverse_unique.append(cid)

    groups = {}
    for record in held:
        cid = record["case_id"]
        vector = tuple(method_predictions[m][cid] for m in comparator_ids)
        groups.setdefault(vector, []).append(record)
    witness_groups = []
    for vector, records in groups.items():
        actuals = {r["true_first_loss_stage"] for r in records}
        if len(actuals) > 1 and all(method_predictions["N4"][r["case_id"]] == r["true_first_loss_stage"] for r in records):
            witness_groups.append({"comparator_vector": list(vector), "case_ids": sorted(r["case_id"] for r in records), "actuals": sorted(actuals)})

    h1_a = n4["exact_accuracy"] - best["exact_accuracy"] >= 0.10 and best["mean_stage_error"] - n4["mean_stage_error"] >= 0.50
    h1_b = len(unique_correct) >= 9 and len(witness_groups) >= 3
    falsifiers = {
        "F1_BASELINES_MATCH_OR_EXCEED": best["exact_accuracy"] >= n4["exact_accuracy"],
        "F2_NEXAH_REDUNDANT": any(all(method_predictions["N4"][r["case_id"]] == method_predictions[m][r["case_id"]] for r in held) for m in comparator_ids) or (not unique_correct and not witness_groups),
        "F3_THRESHOLD_ARTIFACT": bool(audit.get("threshold_used")),
        "F4_GROUND_TRUTH_LEAKAGE": not audit.get("leakage_passed", False),
        "F5_CORRESPONDENCE_TRIVIALIZES": endpoints["N2"]["exact_accuracy"] >= n4["exact_accuracy"] and endpoints["N2"]["mean_stage_error"] <= n4["mean_stage_error"],
        "F6_ORDER_DEPENDENCE": not audit.get("order_passed", False),
        "F7_PRECONDITION_FAILURE": not audit.get("preconditions_passed", False),
        "F8_NO_LOSS_FALSE_POSITIVE": n4["false_loss_rate"] > 0.10,
        "F9_KNOWN_CONTROL_ONLY": bool(audit.get("controls_in_primary", False)),
        "F10_STANDARD_BASELINE_SUFFICIENT": any(endpoints[m]["exact_accuracy"] >= n4["exact_accuracy"] and endpoints[m]["mean_stage_error"] <= n4["mean_stage_error"] for m in [f"B{i}" for i in range(7)]),
    }
    control_failures = control_endpoints["N4"]["n"] - control_endpoints["N4"]["exact_count"]
    trace = []
    if audit.get("integrity_failure"):
        status = "PROTOCOL_INVALID"; trace.append("1_INTEGRITY_FAILURE")
    elif falsifiers["F4_GROUND_TRUTH_LEAKAGE"]:
        status = "PROTOCOL_INVALID"; trace.append("2_GROUND_TRUTH_LEAKAGE")
    elif falsifiers["F7_PRECONDITION_FAILURE"]:
        status = "PRECONDITION_FAILED"; trace.append("3_PRECONDITION_FAILED")
    elif falsifiers["F3_THRESHOLD_ARTIFACT"] or falsifiers["F6_ORDER_DEPENDENCE"] or falsifiers["F9_KNOWN_CONTROL_ONLY"] or audit.get("schema_violation"):
        status = "PROTOCOL_INVALID"; trace.append("4_PROTOCOL_VIOLATION")
    elif control_failures > 1:
        status = "PROTOCOL_INVALID"; trace.append("5_CONTROL_FAILURE")
    elif n4["exact_accuracy"] < 0.80 or n4["mean_stage_error"] > 0.50:
        status = "FIRST_LOSS_LOCALIZATION_NOT_SUPPORTED"; trace.append("6_LOCALIZATION_NOT_SUPPORTED")
    elif not h1_a:
        status = "BASELINES_SUFFICIENT" if falsifiers["F1_BASELINES_MATCH_OR_EXCEED"] or falsifiers["F10_STANDARD_BASELINE_SUFFICIENT"] else "FIRST_LOSS_LOCALIZATION_SUPPORTED_NO_INCREMENTAL_VALUE"
        trace.append("7_H1_A_FALSE")
    elif not h1_b or falsifiers["F2_NEXAH_REDUNDANT"] or falsifiers["F5_CORRESPONDENCE_TRIVIALIZES"]:
        status = "NEXAH_REDUNDANT"; trace.append("8_H1_B_FALSE_OR_REDUNDANT")
    elif falsifiers["F8_NO_LOSS_FALSE_POSITIVE"]:
        status = "INCONCLUSIVE"; trace.append("9_NO_LOSS_FALSE_POSITIVE")
    elif h1_a and h1_b:
        status = "INCREMENTAL_DIAGNOSTIC_VALUE_SUPPORTED_BOUNDED"; trace.append("10_H1_A_AND_H1_B")
    else:
        status = "INCONCLUSIVE"; trace.append("11_UNEXPECTED")

    held_results = []
    for record in held:
        cid = record["case_id"]
        held_results.append({
            "case_id": cid, "true_first_loss_stage": record["true_first_loss_stage"],
            "predictions": {m: method_predictions[m][cid] for m in sorted(method_predictions)},
            "n4_correct": method_predictions["N4"][cid] == record["true_first_loss_stage"],
            "n4_stage_distance": _distance(method_predictions["N4"][cid], record["true_first_loss_stage"]),
            "baseline_decision_vector": [method_predictions[m][cid] for m in comparator_ids],
            "n4_ledger": nexah_outputs[cid]["N4"].get("collision_ledger", []),
        })
    return {
        "run_status": status,
        "controls": {"method_endpoints": control_endpoints, "n4_failures": control_failures},
        "held_out_case_results": held_results,
        "method_endpoints": {m: {k: v for k, v in endpoint.items() if k != "rows"} for m, endpoint in endpoints.items()},
        "primary_endpoints": {
            "strongest_comparator": strongest,
            "accuracy_margin": n4["exact_accuracy"] - best["exact_accuracy"],
            "stage_error_improvement": best["mean_stage_error"] - n4["mean_stage_error"],
            "unique_correct_count": len(unique_correct), "unique_correct_case_ids": sorted(unique_correct),
            "reverse_unique_count": len(reverse_unique), "reverse_unique_case_ids": sorted(reverse_unique),
            "baseline_decision_collision_witness_groups": witness_groups,
        },
        "hypotheses": {"H1_A": h1_a, "H1_B": h1_b},
        "falsifiers": falsifiers,
        "precedence_trace": trace,
    }

