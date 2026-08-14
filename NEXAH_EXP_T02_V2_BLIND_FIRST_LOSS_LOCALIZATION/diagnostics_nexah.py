"""Pure NEXAH ablations and complete task-specific diagnostic."""

from __future__ import annotations


def _first_loss(signal):
    if len(signal) != 7 or not signal[0]:
        return "UNRESOLVED"
    if any(signal[i] < signal[i + 1] for i in range(6)):
        return "UNRESOLVED"
    for stage in range(1, 7):
        if signal[stage - 1] and not signal[stage]:
            return f"T{stage}"
    return "NO_LOSS"


def _majority(labels):
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    best = max(counts.values())
    winners = sorted(label for label, count in counts.items() if count == best)
    return winners[0] if len(winners) == 1 else "UNRESOLVED"


def evaluate_case(case, baseline_case):
    baseline_predictions = [baseline_case[name]["prediction"] for name in sorted(baseline_case)]
    n0 = _majority(baseline_predictions)
    union_signal = [int(any(baseline_case[name]["survival"][stage] for name in baseline_case)) for stage in range(7)]
    n1 = _first_loss(union_signal)

    aligned_signal = []
    target_signal = []
    generic_ledger = []
    target_ledger = []
    target_source = case["query"]["target_feature_id"]
    for stage_index, stage in enumerate(case["stages"]):
        any_difference = False
        for source, aliases in sorted(case["correspondence"].items()):
            alias = aliases[stage_index]
            left = stage["left"]["features"].get(alias)
            right = stage["right"]["features"].get(alias)
            if left is None or right is None:
                return {name: {"prediction": "UNRESOLVED", "survival": []} for name in ("N0", "N1", "N2", "N3", "N4")}
            any_difference = any_difference or left != right
        aligned_signal.append(int(any_difference))
        generic_ledger.append({"stage": stage_index, "any_aligned_difference": any_difference})

        target_alias = case["correspondence"][target_source][stage_index]
        target_left = stage["left"]["features"].get(target_alias)
        target_right = stage["right"]["features"].get(target_alias)
        survives = target_left is not None and target_right is not None and target_left != target_right
        target_signal.append(int(survives))
        target_ledger.append({
            "stage": stage_index, "source_feature_id": target_source,
            "stage_feature_id": target_alias, "survives": survives,
        })

    n2 = _first_loss(aligned_signal)
    n3 = _first_loss(aligned_signal)
    n4 = _first_loss(target_signal)
    return {
        "N0": {"prediction": n0, "survival": []},
        "N1": {"prediction": n1, "survival": union_signal},
        "N2": {"prediction": n2, "survival": aligned_signal},
        "N3": {"prediction": n3, "survival": aligned_signal, "collision_ledger": generic_ledger},
        "N4": {
            "prediction": n4, "survival": target_signal, "collision_ledger": target_ledger,
            "correspondence_status": "COMPLETE", "destroyed_distinction": target_source,
        },
    }


def evaluate_all(cases, baseline_outputs):
    return {case["case_id"]: evaluate_case(case, baseline_outputs[case["case_id"]]) for case in cases}

