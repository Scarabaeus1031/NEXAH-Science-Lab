#!/usr/bin/env python3
"""Deterministic dihedral closure and 2+3-wheel falsification test."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dihedral_counterrotation_results.json"
BASES = list(range(2, 37)) + [112, 144]


def t(base: int, step: int, state: int) -> int:
    return (state + step) % base


def q(base: int, state: int) -> int:
    return (-state) % base


def r(base: int, state: int) -> int:
    return base - 1 - state


checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


triple_count = sum(base ** 3 for base in BASES)
pair_count = sum(base ** 2 for base in BASES)

rotation_composition = all(
    t(base, a, t(base, b, z)) == t(base, a + b, z)
    for base in BASES for a in range(base) for b in range(base)
    for z in range(base)
)
check("rotation_composition", rotation_composition, triple_count,
      "T_a o T_b = T_(a+b) for all frozen states and steps")

q_involution = all(q(base, q(base, z)) == z
                   for base in BASES for z in range(base))
r_involution = all(r(base, r(base, z)) == z
                   for base in BASES for z in range(base))
check("q_involution", q_involution, sum(BASES), "Q_B^2=id")
check("r_involution", r_involution, sum(BASES), "R_B^2=id")

q_counterrotation = all(
    q(base, t(base, k, q(base, z))) == t(base, -k, z)
    for base in BASES for k in range(base) for z in range(base)
)
r_counterrotation = all(
    r(base, t(base, k, r(base, z))) == t(base, -k, z)
    for base in BASES for k in range(base) for z in range(base)
)
check("q_conjugates_rotation_to_inverse", q_counterrotation, pair_count,
      "Q_B T_k Q_B = T_-k")
check("r_conjugates_rotation_to_inverse", r_counterrotation, pair_count,
      "R_B T_k R_B = T_-k")

phase_examples = {}
for base in (7, 12, 112):
    phase_examples[base] = {
        "Q_Tplus1_Q_at_0": q(base, t(base, 1, q(base, 0))),
        "Tminus1_at_0": t(base, -1, 0),
        "R_Tplus1_R_at_0": r(base, t(base, 1, r(base, 0))),
    }
check("draft_drift_direction_reversal",
      all(v["Q_Tplus1_Q_at_0"] == v["Tminus1_at_0"] ==
          v["R_Tplus1_R_at_0"] for v in phase_examples.values()),
      phase_examples, "+1 tick mirrors to -1 tick in bases 7, 12 and 112")

z7_pairs = [(z, q(7, z)) for z in range(1, 4)]
check("z7_mirror_pairs", z7_pairs == [(1, 6), (2, 5), (3, 4)],
      z7_pairs, [(1, 6), (2, 5), (3, 4)])


def rotate(word: tuple[int, ...], amount: int) -> tuple[int, ...]:
    amount %= len(word)
    return word[amount:] + word[:amount]


def reflect(word: tuple[int, ...]) -> tuple[int, ...]:
    return tuple(reversed(word))


def d3_apply(name: str, word: tuple[int, int, int]) -> tuple[int, int, int]:
    kind, amount_text = name.split(":")
    amount = int(amount_text)
    seed = word if kind == "rot" else reflect(word)
    return rotate(seed, amount)  # type: ignore[return-value]


D3 = [f"rot:{k}" for k in range(3)] + [f"ref:{k}" for k in range(3)]
D2 = ["id", "swap"]


def d2_apply(name: str, word: tuple[int, int]) -> tuple[int, int]:
    return word if name == "id" else (word[1], word[0])


prefix = (1, 1)
# Corrected Human Owner sequence:
# 11537 -> 11573 -> 11357, hence 11|537 -> 11|573 -> 11|357.
w0, w1, w2 = (5, 3, 7), (5, 7, 3), (3, 5, 7)

prefix_images = {name: d2_apply(name, prefix) for name in D2}
check("two_wheel_prefix_action_unidentifiable",
      len(set(prefix_images.values())) == 1, prefix_images,
      "id and swap both map 11 to 11")

single_d3 = [name for name in D3
             if d3_apply(name, w0) == w1 and d3_apply(name, w1) == w2]
single_product = [(left, right) for left in D2 for right in D3
                  if d2_apply(left, prefix) == prefix
                  and d3_apply(right, w0) == w1
                  and d3_apply(right, w1) == w2]
check("single_d3_operator_rejected", single_d3 == [], single_d3, [])
check("single_d2xd3_operator_rejected", single_product == [], single_product, [])

first_step = [name for name in D3 if d3_apply(name, w0) == w1]
second_step = [name for name in D3 if d3_apply(name, w1) == w2]
alternating = [(a, b) for a in first_step for b in second_step]
check("alternating_decomposition_exists", len(alternating) > 0,
      {"first": first_step, "second": second_step, "pairs": alternating},
      "at least one two-operator decomposition")
check("alternating_decomposition_is_not_single_operator",
      all(a != b for a, b in alternating), alternating,
      "every admitted explanation changes operator between transitions")

# The same full observed sequence admits arbitrary phase-labelled state machines;
# this count is retained as an underdetermination marker, not an explanation.
check("operator_change_requires_phase_record", single_d3 == [] and bool(alternating),
      {"fixed": single_d3, "alternating": alternating},
      "a phase/operator label is required to replay both transitions")

# Cyclic versus lifted boundary control.
carry_controls = {}
for base in (10, 12, 112):
    carry_controls[base] = {
        "cyclic": t(base, 1, base - 1),
        "lifted_value": base,
        "carry": divmod(base, base),
    }
check("cyclic_return_not_carry_lift",
      all(v["cyclic"] == 0 and v["lifted_value"] != v["cyclic"] and
          tuple(v["carry"]) == (1, 0) for v in carry_controls.values()),
      carry_controls, "wrap gives state 0; lift gives carry 1 plus digit 0")

passed = all(item["pass"] for item in checks)
result = {
    "test_id": "NEXAH_DIHEDRAL_COUNTERROTATION_001",
    "date": "2026-09-28",
    "classification": "DIHEDRAL_DIRECTION_REVERSAL_CONFIRMED_SINGLE_2PLUS3_OPERATOR_REJECTED",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "domain": {
        "bases": BASES,
        "rotation_composition_tuples": triple_count,
        "reflection_step_state_tuples": pair_count,
        "d3_elements": D3,
        "d2_elements": D2,
        "corrected_full_sequence": [11537, 11573, 11357],
        "corrected_2plus3_sequence": ["11|537", "11|573", "11|357"],
    },
    "checks": checks,
    "decision": {
        "counterrotation": "Q and R conjugate every cyclic step to its inverse",
        "draft_drift": "+1 and -1 ticks are mirror directions after base and axis are declared",
        "two_plus_three": "no one fixed D2xD3 element generates both supplied transitions",
        "residual": "an alternating operator/phase record is necessary but nonunique",
        "mobius": "orientation reversal is algebraic only; no surface embedding established",
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
