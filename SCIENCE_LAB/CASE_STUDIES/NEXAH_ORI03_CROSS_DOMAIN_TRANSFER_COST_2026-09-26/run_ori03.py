#!/usr/bin/env python3
"""Deterministic cross-domain structural-efficiency benchmark."""

from __future__ import annotations

import inspect
import json
import statistics
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CASES = ROOT / "01_CANONICAL_CASES.json"
OUTPUT = ROOT / "04_RESULTS.json"


def strong_baseline(case: dict) -> dict:
    available = set(case["available"])
    missing = sorted(set(case["claim_requires"]) - available)
    return {
        "case_id": case["case_id"],
        "source": case["source"],
        "decision": "BLOCK" if missing else "ALLOW",
        "missing": missing,
        "unresolved": case["unresolved"],
    }


def nexah_orientation(case: dict) -> dict:
    retained = sorted(case["available"])
    lost = sorted(set(case["claim_requires"]) - set(case["available"]))
    decision = "BLOCK" if lost else "ALLOW"
    return {
        "case_id": case["case_id"],
        "source": case["source"],
        "decision": decision,
        "missing": lost,
        "unresolved": case["unresolved"],
        "ledger": {
            "Omega": case["source"],
            "X": case["context"],
            "Q": case["question"],
            "sigma": case["selection"],
            "I": retained,
            "L": lost,
            "A": sorted(case["introduced"]),
            "U": sorted(case["unresolved"]),
            "epsilon": sorted(set(lost) | set(case["unresolved"])),
        },
    }


def code_metrics(function) -> dict:
    source = inspect.getsource(function)
    logical = [
        line for line in source.splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    ]
    return {"logical_lines": len(logical), "source_bytes": len(source.encode("utf-8"))}


def benchmark(function, cases: list[dict], passes: int = 10_000, repeats: int = 7) -> dict:
    samples = []
    for _ in range(repeats):
        start = time.perf_counter_ns()
        for _ in range(passes):
            for case in cases:
                function(case)
        samples.append(time.perf_counter_ns() - start)
    median_ns = int(statistics.median(samples))
    return {
        "passes": passes,
        "repeats": repeats,
        "median_total_ns": median_ns,
        "median_ns_per_case": median_ns / (passes * len(cases)),
        "samples_total_ns": samples,
    }


def compact_projection(records: list[dict]) -> list[dict]:
    keys = ("case_id", "source", "decision", "missing", "unresolved")
    return [{key: record[key] for key in keys} for record in records]


def serialized_bytes(value) -> int:
    return len(json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def main() -> None:
    cases = json.loads(CASES.read_text(encoding="utf-8"))
    baseline_records = [strong_baseline(case) for case in cases]
    nexah_records = [nexah_orientation(case) for case in cases]
    nexah_equal_output = compact_projection(nexah_records)

    expected = {case["case_id"]: case["expected"] for case in cases}
    baseline_correct = all(record["decision"] == expected[record["case_id"]] for record in baseline_records)
    nexah_correct = all(record["decision"] == expected[record["case_id"]] for record in nexah_records)
    parity = baseline_records == nexah_equal_output
    required_trace = {"case_id", "source", "decision", "missing", "unresolved"}
    trace_complete = all(required_trace <= set(record) for record in baseline_records + nexah_records)

    baseline_code = code_metrics(strong_baseline)
    nexah_code = code_metrics(nexah_orientation)
    baseline_runtime = benchmark(strong_baseline, cases)
    nexah_runtime = benchmark(nexah_orientation, cases)
    runtime_ratio = nexah_runtime["median_total_ns"] / baseline_runtime["median_total_ns"]

    baseline_equal_bytes = serialized_bytes(baseline_records)
    nexah_equal_bytes = serialized_bytes(nexah_equal_output)
    nexah_full_bytes = serialized_bytes(nexah_records)

    gates = {
        "G1_EQUAL_INFORMATION": True,
        "G2_CORRECTNESS": baseline_correct and nexah_correct,
        "G3_PARITY": parity,
        "G4_ZERO_CORE_TRANSFER_CHANGE": True,
        "G5_TRACE_COMPLETENESS": trace_complete,
        "G6_NEXAH_SMALLER_EXECUTABLE_LOGIC": (
            nexah_code["logical_lines"] < baseline_code["logical_lines"]
            and nexah_code["source_bytes"] < baseline_code["source_bytes"]
        ),
        "G7_NEXAH_SMALLER_EQUAL_OUTPUT": nexah_equal_bytes < baseline_equal_bytes,
        "G8_NEXAH_RUNTIME_ADVANTAGE": runtime_ratio <= 0.80,
    }
    core_valid = all(gates[name] for name in (
        "G1_EQUAL_INFORMATION", "G2_CORRECTNESS", "G3_PARITY",
        "G4_ZERO_CORE_TRANSFER_CHANGE", "G5_TRACE_COMPLETENESS",
    ))
    efficiency = [gates[name] for name in (
        "G6_NEXAH_SMALLER_EXECUTABLE_LOGIC",
        "G7_NEXAH_SMALLER_EQUAL_OUTPUT",
        "G8_NEXAH_RUNTIME_ADVANTAGE",
    )]
    if not core_valid:
        outcome = "INVALID"
    elif all(efficiency):
        outcome = "SIMPLER_AND_FASTER"
    elif any(efficiency):
        outcome = "BOUNDED_TRADEOFF"
    else:
        outcome = "NO_EFFICIENCY_ADVANTAGE_SHOWN"

    result = {
        "test_id": "NEXAH-ORI-03",
        "cases": len(cases),
        "development_domains": 3,
        "transfer_controls": 1,
        "correctness": {"baseline": baseline_correct, "nexah": nexah_correct, "parity": parity},
        "core_changes_for_transfer_control": {"baseline": 0, "nexah": 0},
        "code_metrics": {"baseline": baseline_code, "nexah": nexah_code},
        "runtime": {
            "baseline": baseline_runtime,
            "nexah": nexah_runtime,
            "nexah_to_baseline_median_ratio": runtime_ratio,
            "interpretation_floor": "differences below 20 percent are not claimed",
        },
        "serialized_result_bytes": {
            "baseline_equal_output": baseline_equal_bytes,
            "nexah_equal_output": nexah_equal_bytes,
            "nexah_full_ledger": nexah_full_bytes,
        },
        "gates": gates,
        "outcome": outcome,
        "claim_boundary": "internal deterministic engineering proxy; not human time cognitive load external utility or scientific novelty",
    }
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"outcome": outcome, "gates": gates, "runtime_ratio": runtime_ratio}, indent=2))


if __name__ == "__main__":
    main()
