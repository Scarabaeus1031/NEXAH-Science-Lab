from __future__ import annotations

import csv
import hashlib
import json
import platform
import random
import sys
import time
from pathlib import Path


CASE = Path(__file__).resolve().parent
REPO = CASE.parents[2]
SOURCE = Path("/Users/tho2020/Desktop/00_INCOMING/Cikada 3301 Mandelbrot")
INTAKE = REPO / "SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_MANDELBROT_INTAKE"
CROWN = REPO / "SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_CONCAVE_CROWN_CONVEX_PROJECTION_LAB/FINAL_DECISION.md"
SEED = 330117
ARCHIVE_NUMBERS = [3, 6, 9, 12, 17, 24, 29, 33, 41, 48, 96, 137, 1836]
MODULI = list(range(2, 41))


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def canonical_bytes(value: object) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def canonical_mod(x: int, n: int) -> int:
    return x % n


def signed_residue(x: int, n: int) -> int:
    r = canonical_mod(x, n)
    return r - n if r > n / 2 else r


def package_concordance() -> dict:
    inventory = INTAKE / "01_COMPLETE_FILE_INVENTORY.csv"
    with inventory.open(newline="", encoding="utf-8") as handle:
        expected = {r["relative_path"]: r for r in csv.DictReader(handle)}
    current_paths = sorted(p for p in SOURCE.rglob("*") if p.is_file())
    current = {}
    manifest_lines = []
    for path in current_paths:
        rel = path.relative_to(SOURCE).as_posix()
        size = path.stat().st_size
        digest = sha256_file(path)
        current[rel] = {"bytes": size, "sha256": digest}
        manifest_lines.append(f"{rel}\0{size}\0{digest}\n")
    missing = sorted(set(expected) - set(current))
    added = sorted(set(current) - set(expected))
    changed = sorted(
        rel for rel in set(expected) & set(current)
        if int(expected[rel]["bytes"]) != current[rel]["bytes"] or expected[rel]["sha256"] != current[rel]["sha256"]
    )
    return {
        "source_path": str(SOURCE),
        "file_count": len(current),
        "bytes": sum(x["bytes"] for x in current.values()),
        "manifest_sha256_algorithm": "sha256(sorted(relative_path + NUL + bytes + NUL + file_sha256 + LF))",
        "manifest_sha256": hashlib.sha256("".join(manifest_lines).encode("utf-8")).hexdigest(),
        "intake_recorded_snapshot_sha256": "7a2f14aad5932f1775d9cf3c7120850a728d7ff85b7425ea07975d3f3d2e6475",
        "inventory_sha256": sha256_file(inventory),
        "missing": missing,
        "added": added,
        "changed": changed,
        "all_files_match_intake_inventory": not missing and not added and not changed,
    }


def calibration() -> dict:
    a, b, n = 41, 74, 17
    forward, mirror = a - b, b - a
    result = {
        "a": a,
        "b": b,
        "n": n,
        "forward_difference": forward,
        "mirror_difference": mirror,
        "forward_canonical": canonical_mod(forward, n),
        "mirror_canonical": canonical_mod(mirror, n),
        "forward_signed": signed_residue(forward, n),
        "mirror_signed": signed_residue(mirror, n),
        "thirty_three_identity": 2 * n - 1,
        "thirty_four_identity": 2 * n,
    }
    result["pass"] = result == {
        "a": 41, "b": 74, "n": 17,
        "forward_difference": -33, "mirror_difference": 33,
        "forward_canonical": 1, "mirror_canonical": 16,
        "forward_signed": 1, "mirror_signed": -1,
        "thirty_three_identity": 33, "thirty_four_identity": 34,
    }
    return result


def neighbor_control() -> dict:
    rows = []
    for a in range(39, 44):
        for b in range(72, 77):
            d = a - b
            s = signed_residue(d, 17)
            rows.append({
                "a": a, "b": b, "difference": d,
                "canonical_residue": canonical_mod(d, 17),
                "signed_residue": s,
                "distance_from_plus_or_minus_one": min(abs(s - 1), abs(s + 1)),
            })
    return {
        "pair_count": len(rows),
        "plus_one_count": sum(r["signed_residue"] == 1 for r in rows),
        "minus_one_count": sum(r["signed_residue"] == -1 for r in rows),
        "plus_or_minus_one_count": sum(abs(r["signed_residue"]) == 1 for r in rows),
        "plus_or_minus_one_rate": sum(abs(r["signed_residue"]) == 1 for r in rows) / len(rows),
        "rows": rows,
    }


def modulus_sweep() -> dict:
    rows = []
    for n in MODULI:
        c = canonical_mod(-33, n)
        s = signed_residue(-33, n)
        rows.append({"n": n, "canonical_residue": c, "signed_residue": s, "exact_closure": c == 0})
    return {
        "rows": rows,
        "canonical_one_moduli": [r["n"] for r in rows if r["canonical_residue"] == 1],
        "signed_plus_one_moduli": [r["n"] for r in rows if r["signed_residue"] == 1],
        "signed_minus_one_moduli": [r["n"] for r in rows if r["signed_residue"] == -1],
        "signed_absolute_one_moduli": [r["n"] for r in rows if abs(r["signed_residue"]) == 1],
        "exact_closure_moduli": [r["n"] for r in rows if r["exact_closure"]],
        "algebra": {
            "canonical_plus_one": "n divides 34 because -33 = 1 (mod n)",
            "signed_minus_one": "n divides 32 because -33 = -1 (mod n), subject to positive half-cycle tie at n=2",
            "exact_closure": "n divides 33",
        },
    }


def ordered_differences(values: list[int]) -> list[int]:
    return [a - b for a in values for b in values if a != b]


def archive_pair_control() -> dict:
    diffs = ordered_differences(ARCHIVE_NUMBERS)
    counts = {"zero": 0, "plus_one": 0, "minus_one": 0}
    pair_posthoc = 0
    pair_fixed = 0
    for d in diffs:
        fixed = signed_residue(d, 17)
        pair_fixed += fixed == 1
        posthoc_hit = False
        for n in MODULI:
            s = signed_residue(d, n)
            counts["zero"] += s == 0
            counts["plus_one"] += s == 1
            counts["minus_one"] += s == -1
            posthoc_hit = posthoc_hit or s == 1
        pair_posthoc += posthoc_hit
    tests = len(diffs) * len(MODULI)
    return {
        "selection_boundary": "EXACT_DELIMITED_P2_RETROSPECTIVE_LIST_AT_REPORT_LINE_2019",
        "numbers": ARCHIVE_NUMBERS,
        "number_count": len(ARCHIVE_NUMBERS),
        "ordered_pair_count": len(diffs),
        "pair_modulus_test_count": tests,
        "residue_counts_all_tests": counts,
        "residue_rates_all_tests": {k: v / tests for k, v in counts.items()},
        "fixed_n17_plus_one_pair_count": pair_fixed,
        "fixed_n17_plus_one_pair_rate": pair_fixed / len(diffs),
        "posthoc_any_modulus_plus_one_pair_count": pair_posthoc,
        "posthoc_any_modulus_plus_one_pair_rate": pair_posthoc / len(diffs),
        "limitation": "set is retrospective P2 evidence and does not include 74",
    }


def random_control(sample_count: int = 5000) -> dict:
    rng = random.Random(SEED)
    lookup = {d: any(signed_residue(d, n) == 1 for n in MODULI) for d in range(-1833, 1834)}
    total_pairs = sample_count * 13 * 12
    fixed_matches = 0
    posthoc_matches = 0
    sets_fixed_any = 0
    sets_posthoc_any = 0
    for _ in range(sample_count):
        values = rng.sample(range(3, 1837), 13)
        diffs = ordered_differences(values)
        fixed = sum(signed_residue(d, 17) == 1 for d in diffs)
        posthoc = sum(lookup[d] for d in diffs)
        fixed_matches += fixed
        posthoc_matches += posthoc
        sets_fixed_any += fixed > 0
        sets_posthoc_any += posthoc > 0
    return {
        "seed": SEED,
        "sample_count": sample_count,
        "set_size": 13,
        "integer_range_inclusive": [3, 1836],
        "unique_within_set": True,
        "ordered_unequal_pairs_per_set": 156,
        "modulus_range_inclusive": [2, 40],
        "fixed_n17_raw_pair_match_rate": fixed_matches / total_pairs,
        "fixed_n17_familywise_set_rate": sets_fixed_any / sample_count,
        "posthoc_modulus_raw_pair_match_rate": posthoc_matches / total_pairs,
        "posthoc_modulus_search_adjusted_set_rate": sets_posthoc_any / sample_count,
        "interpretation": "family-wise set rates describe the declared search; they are not p-values",
    }


def major_hashes(payload: dict) -> dict:
    return {key: hashlib.sha256(canonical_bytes(payload[key])).hexdigest() for key in (
        "arithmetic_calibration", "neighbor_control", "modulus_sweep", "archive_pair_control", "random_control", "cycle_semantics"
    )}


def compute() -> dict:
    source = package_concordance()
    if not source["all_files_match_intake_inventory"]:
        raise RuntimeError("source package differs from controlling intake inventory")
    cal = calibration()
    if not cal["pass"]:
        raise RuntimeError("arithmetic calibration failed")
    payload = {
        "case": "RETURN_17_MIRROR_RESIDUE_LAB",
        "arithmetic_calibration": cal,
        "historical_provenance": {
            "package_concordance": source,
            "coupling": "POST_HOC_COUPLING_ONLY",
            "17_independent_occurrence": "YES_P2_AND_P3_MULTIPLE_LOCAL_ROLES",
            "41_independent_occurrence": "YES_P2_RETROSPECTIVE_AND_P1_FILENAME",
            "74_independent_occurrence": "P1_FILENAME_ONLY",
            "explicit_41_74_17_coupling": "NO",
            "modulus_17_fixed_independently_as_cycle_length": "NO",
            "provenance_ledger_sha256": sha256_file(CASE / "01_PROVENANCE_LEDGER.csv"),
        },
        "neighbor_control": neighbor_control(),
        "modulus_sweep": modulus_sweep(),
        "archive_pair_control": archive_pair_control(),
        "random_control": random_control(),
        "cycle_semantics": {
            "repeated_origin": {"distinct_states": 17, "recorded_samples": 18, "final_sample": "p17=p0; return record, not new spatial state"},
            "external_anchor": {"distinct_cycle_states": 17, "external_state": "q not in {p0..p16}", "meaning": "introduced state, not repeated origin"},
            "historical_distinction_present": False,
            "classification": "UNRESOLVED_PLUS_ONE",
            "archive_note": "retrospective report defines 24 as example cycle length and 17 as an index; visible 30-frame GIFs show frame 17 but no 17-state closure",
        },
        "primary_category": "C_POST_HOC_CONSTRUCTION",
        "claim_boundary": "exact arithmetic and bounded controls only; no historical causality, Cicada solution, crown origin, cross-domain claim, ORION activation, or canonical adoption",
        "source_files_modified": False,
        "commit_created": False,
    }
    payload["output_hashes"] = major_hashes(payload)
    return payload


def main() -> None:
    start1 = time.perf_counter()
    first = compute()
    duration1 = time.perf_counter() - start1
    start2 = time.perf_counter()
    second = compute()
    duration2 = time.perf_counter() - start2
    hash1 = hashlib.sha256(canonical_bytes(first)).hexdigest()
    hash2 = hashlib.sha256(canonical_bytes(second)).hexdigest()
    exact = hash1 == hash2
    if not exact:
        raise RuntimeError("deterministic replay mismatch")
    first["environment"] = {
        "python": sys.version.split()[0],
        "platform": platform.platform(),
        "libraries": {"python_standard_library": platform.python_version()},
        "seed": SEED,
        "primary_execution_seconds": duration1,
        "repeat_execution_seconds": duration2,
        "script_sha256": sha256_file(Path(__file__)),
        "crown_final_decision_sha256": sha256_file(CROWN),
    }
    first["deterministic_replay"] = {
        "scope": "complete deterministic payload; measured timing metadata excluded",
        "primary_sha256": hash1,
        "repeat_sha256": hash2,
        "exact_equality": exact,
    }
    target = CASE / "04_RESULTS.json"
    target.write_text(json.dumps(first, indent=2, sort_keys=True, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "primary_category": first["primary_category"],
        "source_concordance": first["historical_provenance"]["package_concordance"]["all_files_match_intake_inventory"],
        "neighbor_plus_or_minus_one": first["neighbor_control"]["plus_or_minus_one_count"],
        "modulus_signed_absolute_one": first["modulus_sweep"]["signed_absolute_one_moduli"],
        "random_posthoc_set_rate": first["random_control"]["posthoc_modulus_search_adjusted_set_rate"],
        "replay_exact": exact,
    }, indent=2))


if __name__ == "__main__":
    main()
