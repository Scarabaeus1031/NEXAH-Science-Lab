#!/usr/bin/env python3
"""Generate balanced ORI-04 forms and validate equal-information materials."""

from __future__ import annotations

import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CASES_PATH = ROOT / "01_CASES.json"
FORMS_PATH = ROOT / "02_ASSIGNMENT_FORMS.json"
RESULTS_PATH = ROOT / "04_PREFLIGHT_RESULTS.json"

FIELDS = ("source", "context", "question", "selection", "retained", "lost", "introduced", "unresolved", "residual")
BASELINE_LABELS = ("Source", "Context", "Question", "Selection", "Present", "Missing", "Added", "Open", "Difference")
NEXAH_LABELS = ("Omega / Source", "X / Context", "Q / Question", "S / Selection", "I / Retained", "L / Lost", "A / Introduced", "U / Unresolved", "epsilon / Residual")


def payload_hash(case: dict) -> str:
    payload = {"values": case["values"], "claim": case["claim"]}
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def build_forms(cases: list[dict]) -> list[dict]:
    forms = []
    count = len(cases)
    for form_index in range(count):
        order = list(range(form_index, count)) + list(range(0, form_index))
        assignments = []
        for position, case_index in enumerate(order, start=1):
            assignments.append({
                "position": position,
                "case_id": cases[case_index]["case_id"],
                "condition": "NEXAH" if (case_index + form_index) % 2 == 0 else "BASELINE",
            })
        forms.append({"form_id": f"F{form_index + 1}", "assignments": assignments})
    return forms


def main() -> None:
    cases = json.loads(CASES_PATH.read_text(encoding="utf-8"))
    forms = build_forms(cases)
    FORMS_PATH.write_text(json.dumps(forms, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    errors = []
    case_ids = [case["case_id"] for case in cases]
    if len(cases) != 8 or len(set(case_ids)) != 8:
        errors.append("expected eight unique cases")
    gold_counts = Counter(case["gold"] for case in cases)
    if gold_counts != {"ALLOW": 4, "BLOCK": 4}:
        errors.append(f"gold balance mismatch: {dict(gold_counts)}")
    for case in cases:
        if tuple(case["values"].keys()) != FIELDS:
            errors.append(f"field order mismatch: {case['case_id']}")
        if not case.get("key_concepts"):
            errors.append(f"missing key concepts: {case['case_id']}")

    condition_counts = defaultdict(Counter)
    position_counts = defaultdict(Counter)
    for form in forms:
        conditions = Counter(item["condition"] for item in form["assignments"])
        if conditions != {"BASELINE": 4, "NEXAH": 4}:
            errors.append(f"within-form imbalance: {form['form_id']} {dict(conditions)}")
        for item in form["assignments"]:
            condition_counts[item["case_id"]][item["condition"]] += 1
            position_counts[item["case_id"]][item["position"]] += 1
    for case_id in case_ids:
        if condition_counts[case_id] != {"BASELINE": 4, "NEXAH": 4}:
            errors.append(f"condition imbalance: {case_id} {dict(condition_counts[case_id])}")
        if set(position_counts[case_id]) != set(range(1, 9)):
            errors.append(f"position imbalance: {case_id}")

    hashes = {case["case_id"]: payload_hash(case) for case in cases}
    result = {
        "test_id": "NEXAH-ORI-04-PREFLIGHT",
        "status": "PASS" if not errors else "FAIL",
        "cases": len(cases),
        "gold_counts": dict(gold_counts),
        "forms": len(forms),
        "conditions_per_form": {"BASELINE": 4, "NEXAH": 4},
        "condition_exposures_per_case": {"BASELINE": 4, "NEXAH": 4},
        "position_exposures_per_case": "one at each position 1-8",
        "equal_information": True,
        "value_fields": list(FIELDS),
        "baseline_labels": list(BASELINE_LABELS),
        "nexah_labels": list(NEXAH_LABELS),
        "payload_sha256_by_case": hashes,
        "errors": errors,
        "human_execution": "NOT_STARTED",
    }
    RESULTS_PATH.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
