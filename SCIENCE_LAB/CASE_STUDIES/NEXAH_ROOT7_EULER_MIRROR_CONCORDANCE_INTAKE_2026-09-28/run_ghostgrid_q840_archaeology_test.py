#!/usr/bin/env python3
"""Exact compression test for recovered Ghostgrid, 735, 11735 and Q840 views."""

from __future__ import annotations

import hashlib
import itertools
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "ghostgrid_q840_archaeology_results.json"
checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


first_seven_primes = [2, 3, 5, 7, 11, 13, 17]
check("first_seven_prime_record", first_seven_primes == [2, 3, 5, 7, 11, 13, 17],
      first_seven_primes, [2, 3, 5, 7, 11, 13, 17])

prime_index = {p: i + 1 for i, p in enumerate(first_seven_primes)}
codes = {
    357: [prime_index[int(d)] for d in "357"],
    537: [prime_index[int(d)] for d in "537"],
    735: [prime_index[int(d)] for d in "735"],
}
check("prime_index_permutation_codes",
      codes == {357: [2, 3, 4], 537: [3, 2, 4], 735: [4, 2, 3]},
      codes, {357: [2, 3, 4], 537: [3, 2, 4], 735: [4, 2, 3]})


def rotate_left_3(n: int) -> int:
    s = f"{n:03d}"
    return int(s[1:] + s[0])


ghost_cycle = [537]
for _ in range(3):
    ghost_cycle.append(rotate_left_3(ghost_cycle[-1]))
check("ghostgrid_fixed_rotation_cycle",
      ghost_cycle == [537, 375, 753, 537], ghost_cycle,
      [537, 375, 753, 537])

# The drawn triangle uses the other cyclic orientation.
def rotate_right_3(n: int) -> int:
    s = f"{n:03d}"
    return int(s[-1] + s[:-1])


drawn_cycle = [537]
for _ in range(3):
    drawn_cycle.append(rotate_right_3(drawn_cycle[-1]))
check("ghostgrid_drawn_rotation_cycle",
      drawn_cycle == [537, 753, 375, 537], drawn_cycle,
      [537, 753, 375, 537])

# The visual labels are 537, 735, 357. They are permutations but not one
# ordinary position rotation orbit in the displayed arrow order.
visual_nodes = [537, 735, 357]
check("ghostgrid_visual_nodes_share_digits",
      all("".join(sorted(str(n))) == "357" for n in visual_nodes),
      visual_nodes, "all nodes have digit multiset 357")
check("ghostgrid_visual_arrow_not_fixed_rotation",
      not (all(rotate_left_3(visual_nodes[i]) == visual_nodes[(i + 1) % 3]
               for i in range(3))
           or all(rotate_right_3(visual_nodes[i]) == visual_nodes[(i + 1) % 3]
                  for i in range(3))),
      visual_nodes, "displayed order is not a single left/right digit rotation")


def apply_position_permutation(n: int, permutation: tuple[int, ...]) -> int:
    digits = str(n)
    return int("".join(digits[i] for i in permutation))


position_permutations = list(itertools.permutations(range(3)))
fixed_permutation_candidates = [
    permutation for permutation in position_permutations
    if all(apply_position_permutation(visual_nodes[i], permutation)
           == visual_nodes[(i + 1) % len(visual_nodes)]
           for i in range(len(visual_nodes)))
]
edge_permutations = []
for i in range(len(visual_nodes)):
    source = visual_nodes[i]
    target = visual_nodes[(i + 1) % len(visual_nodes)]
    matches = [
        permutation for permutation in position_permutations
        if apply_position_permutation(source, permutation) == target
    ]
    edge_permutations.append(matches[0])
check("ghostgrid_no_fixed_s3_position_permutation",
      fixed_permutation_candidates == [], fixed_permutation_candidates, [])
check("ghostgrid_edges_require_three_position_actions",
      edge_permutations == [(2, 1, 0), (1, 2, 0), (1, 0, 2)],
      edge_permutations, [(2, 1, 0), (1, 2, 0), (1, 0, 2)])

corrected_path = [537, 573, 357]
check("corrected_path_distinct_from_ghostgrid_nodes",
      set(corrected_path) != set(visual_nodes),
      {"corrected": corrected_path, "ghostgrid": visual_nodes},
      "same digit family but distinct state sets because 573 replaces 735")

qrt_family_11357 = [11357, 11537, 11573, 11735, 13571]
check("qrt_digit_family_11357",
      all("".join(sorted(str(n))) == "11357" for n in qrt_family_11357),
      qrt_family_11357, "all carriers have digit multiset 11357")
check("11735_registered_arithmetic",
      11735 == 5 * 2347 and divmod(11735, 20) == (586, 15),
      {"factorization": [5, 2347], "grid": divmod(11735, 20)},
      {"factorization": [5, 2347], "grid": [586, 15]})
check("11735_mod11_collision_with_11537",
      11735 % 11 == 11537 % 11 == 9 and 11735 - 11537 == 18 * 11,
      {"residues": [11537 % 11, 11735 % 11], "difference": 11735 - 11537},
      {"residues": [9, 9], "difference": 198})

moduli = [30, 35, 42]
q = 840
residue_sets = {m: {x for x in range(q) if x % m == 0} for m in moduli}
union = set().union(*residue_sets.values())
gold = set.intersection(*residue_sets.values())
pair_only = {
    "30&35": (residue_sets[30] & residue_sets[35]) - residue_sets[42],
    "30&42": (residue_sets[30] & residue_sets[42]) - residue_sets[35],
    "35&42": (residue_sets[35] & residue_sets[42]) - residue_sets[30],
}
only = {
    str(m): residue_sets[m] - set().union(*(residue_sets[n] for n in moduli if n != m))
    for m in moduli
}
check("q840_is_four_lcm210", math.lcm(*moduli) == 210 and q == 4 * 210,
      {"lcm": math.lcm(*moduli), "q": q}, {"lcm": 210, "q": 840})
check("q840_union_has_64_ticks", len(union) == 64, len(union), 64)
check("q840_class_counts",
      {k: len(v) for k, v in only.items()} == {"30": 24, "35": 20, "42": 16}
      and len(gold) == 4,
      {"only": {k: len(v) for k, v in only.items()}, "gold": sorted(gold)},
      {"only": {"30": 24, "35": 20, "42": 16},
       "gold": [0, 210, 420, 630]})
check("q840_pair_only_classes_empty",
      all(not values for values in pair_only.values()),
      {k: sorted(v) for k, v in pair_only.items()},
      "all pair intersections already equal the gold triple intersection")
check("q840_735_class_and_mirror",
      735 in only["35"] and (q - 735) == 105 and 105 in only["35"],
      {"735_class": "35-only" if 735 in only["35"] else "other",
       "mirror": q - 735},
      {"735_class": "35-only", "mirror": 105})

source_visual_sha256 = "5b272af3c3713a714e7dc2423e6382e9985cace35ab4049bc86a7eb775dd3ffa"
prime_lens_labels = [(7, 7), (2, 7, 7, 2), (4, 7, 7, 4)]
rendered_labels = ["|".join(map(str, label)) for label in prime_lens_labels]
check("prime_lens_separator_labels",
      rendered_labels == ["7|7", "2|7|7|2", "4|7|7|4"],
      rendered_labels, ["7|7", "2|7|7|2", "4|7|7|4"])
check("prime_lens_token_palindromes",
      all(label == label[::-1] for label in prime_lens_labels),
      prime_lens_labels, "all three token sequences are reflection-symmetric")
core = (7, 7)
shell_parameters = [label[0] for label in prime_lens_labels[1:]]
shell_reconstruction = [(a,) + core + (a,) for a in shell_parameters]
check("prime_lens_common_core_and_shell_rule",
      shell_parameters == [2, 4]
      and shell_reconstruction == prime_lens_labels[1:],
      {"core": core, "parameters": shell_parameters,
       "reconstructed": shell_reconstruction},
      {"core": (7, 7), "parameters": [2, 4],
       "reconstructed": [(2, 7, 7, 2), (4, 7, 7, 4)]})
check("prime_lens_not_decimal_palindrome_records",
      ["".join(map(str, label)) for label in prime_lens_labels]
      == ["77", "2772", "4774"],
      {"separator_labels": rendered_labels,
       "digits_without_markers": ["".join(map(str, label))
                                    for label in prime_lens_labels]},
      {"separator_labels": ["7|7", "2|7|7|2", "4|7|7|4"],
       "digits_without_markers": ["77", "2772", "4774"]})

passed = all(item["pass"] for item in checks)
result = {
    "test_id": "NEXAH_GHOSTGRID_Q840_ARCHAEOLOGY_001",
    "date": "2026-09-28",
    "classification": "EXISTING_ARTIFACTS_COMPRESSED_SEPARATOR_GRAMMAR_RECOVERED",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "checks": checks,
    "decision": {
        "735": "retained as Ghostgrid permutation, prime-index code 423 and Q840 35-only tick; not the corrected sequence endpoint",
        "11735": "retained as registered 11357-digit-family carrier and mod11 collision partner of 11537",
        "q840": "64 ticks arise exactly from the union of multiples of 30, 35 and 42 modulo 840",
        "prime_lens_labels": "OCR corrected to separator tokens 7|7, 2|7|7|2 and 4|7|7|4",
        "prime_lens_generator": "exact parameterized shell W_a(7|7)=a|7|7|a recovered for a in {2,4}; no sequential recurrence claimed",
        "prime_lens_source_sha256": source_visual_sha256,
        "ghostgrid_generator": "all six fixed position permutations rejected for the displayed directed cycle; three edge-specific actions are required",
        "visual_boundary": "arithmetic closure does not identify historical visual meaning",
    },
}
canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode("utf-8")
result["scientific_hash"] = hashlib.sha256(canonical).hexdigest()
OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps({k: result[k] for k in (
    "test_id", "classification", "passed", "check_count", "passed_count",
    "scientific_hash")}, indent=2))
if not passed:
    raise SystemExit(1)
