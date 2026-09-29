#!/usr/bin/env python3
"""Finite collision matrix for the typed 404-related operators."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
LAB = ROOT.parents[1]
OUT = ROOT / "operator_collision_matrix_results.json"
CUSTODY = LAB / "CASE_STUDIES/NEXAH_ROOT7_CUSTODY_2026-09-28/Nexah_Root7"
GRID_SOURCE = CUSTODY / "NEXAH_111_GRID_CRT_RETURN_PRUEFMODUL_2026-09-28-5.md"
GATE_SOURCE = CUSTODY / "NEXAH_SCN_NCS_404_QUELLENABGLEICH_PRUEFPUNKT_11_2026-09-28.md"

checks: list[dict[str, object]] = []


def check(check_id: str, condition: bool, observed: object, expected: object) -> None:
    checks.append({"id": check_id, "pass": bool(condition),
                   "observed": observed, "expected": expected})


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def reverse_decimal(n: int) -> int:
    sign = -1 if n < 0 else 1
    return sign * int(str(abs(n))[::-1])


def a404(n: int) -> int:
    return n + 404


def dyadic(n: int) -> int:
    return 2 * n


def j1100(n: int) -> int:
    return 1100 - n


def grid_rotation(n: int) -> int:
    return 12320 - n


def grid111(n: int) -> list[int] | None:
    return [n % 111, n // 111] if 0 <= n <= 12320 else None


def grid112x110(n: int) -> list[int] | None:
    return [n % 112, n // 112] if 0 <= n < 12320 else None


def gate404(a: float, b: float) -> dict[str, object]:
    phase = b - a
    mean = (a + b) / 2
    distance = ((4.2 * phase) ** 2 + (6.2 * mean) ** 2) ** 0.5
    opened = abs(phase) < 8 and abs(mean) < 6
    aligned = distance < 34
    return {"phase": phase, "mean": mean, "distance": distance,
            "open": opened, "aligned": aligned, "gate404": opened and aligned}


expected_hashes = {
    "grid": "ee8a3db47e0287d49f7e8f18dd4122a71984b59d5a9b94cdb7791e25f77ab988",
    "gate": "182dab62ea72e92887b7ad968dbc96fe9e40346f26111a2deccce45b9f604807",
}
observed_hashes = {"grid": sha256(GRID_SOURCE), "gate": sha256(GATE_SOURCE)}
check("bound_source_hashes", observed_hashes == expected_hashes,
      observed_hashes, expected_hashes)

primary = [404, 808, 1212, 1616, 2020, 2424, 3232]
controls = [204, 292, 402, 403, 696, 1100, 12320, 12321]
domain = primary + controls

rows = []
for n in domain:
    rows.append({
        "n": n,
        "A404": a404(n),
        "D": dyadic(n),
        "Rev": reverse_decimal(n),
        "J1100": j1100(n),
        "R12320": grid_rotation(n),
        "mod7": n % 7,
        "mod11": n % 11,
        "mod77": n % 77,
        "mod112": n % 112,
        "mod1232": n % 1232,
        "grid111": grid111(n),
        "grid112x110": grid112x110(n),
        "dyadic_101_carrier": n > 0 and n % 101 == 0
        and (n // 101) & ((n // 101) - 1) == 0,
        "palindrome": str(n) == str(n)[::-1],
        "gate404_from_integer": "NOT_EVALUABLE_WITHOUT_H",
    })

check("A404_equals_D_unique_integer_solution",
      all((a404(x) == dyadic(x)) == (x == 404) for x in range(-5000, 5001)),
      404, 404)
check("first_collision_404_to_808", a404(404) == dyadic(404) == 808,
      [a404(404), dyadic(404)], [808, 808])
check("operators_separate_at_808", (a404(808), dyadic(808)) == (1212, 1616),
      [a404(808), dyadic(808)], [1212, 1616])
check("two_step_arrow_meets_one_dyadic_endpoint",
      a404(a404(808)) == dyadic(808) == 1616,
      [a404(a404(808)), dyadic(808)], [1616, 1616])
check("1212_exact_affine_midpoint",
      1212 == 3 * 404 == 12 * 101 == (808 + 1616) // 2,
      1212, 1212)
check("1212_not_dyadic_101_carrier",
      all(1212 != 101 * 2**k for k in range(20)), 1212,
      "not in {101*2^k}")
check("decimal_reversal_roles",
      [reverse_decimal(n) for n in (404, 204, 402, 1212)]
      == [404, 402, 204, 2121],
      [reverse_decimal(n) for n in (404, 204, 402, 1212)],
      [404, 402, 204, 2121])
check("J1100_bounded_complements",
      [j1100(n) for n in (404, 808, 1212, 1616)]
      == [696, 292, -112, -516],
      [j1100(n) for n in (404, 808, 1212, 1616)],
      [696, 292, -112, -516])
check("J_and_R_same_mod11_action_not_same_map",
      all(j1100(n) % 11 == grid_rotation(n) % 11 for n in domain)
      and all(j1100(n) != grid_rotation(n) for n in domain),
      {"J_constant_mod11": 1100 % 11, "R_constant_mod11": 12320 % 11,
       "integer_offset": 12320 - 1100},
      {"J_constant_mod11": 0, "R_constant_mod11": 0,
       "integer_offset": 11220})
check("grid111_coordinate_roundtrip",
      all(grid111(n) is None or grid111(n)[0] + 111 * grid111(n)[1] == n
          for n in domain), True, True)
check("grid112_coordinate_roundtrip",
      all(grid112x110(n) is None
          or grid112x110(n)[0] + 112 * grid112x110(n)[1] == n
          for n in domain), True, True)
check("CRT77_grid_formula",
      all(grid111(n) is None or
          n % 77 == (22 * ((grid111(n)[0] - grid111(n)[1]) % 7)
                      + 56 * ((grid111(n)[0] + grid111(n)[1]) % 11)) % 77
          for n in domain), True, True)
check("grid_boundary_12320_12321",
      grid111(12320) == [110, 110] and grid111(12321) is None
      and 12320 % 77 == 0 and 12321 % 77 == 1,
      {"12320": grid111(12320), "12321": grid111(12321),
       "residues": [12320 % 77, 12321 % 77]},
      {"12320": [110, 110], "12321": None, "residues": [0, 1]})

gate_points = [(0, 0), (5, 5), (5, 6), (6, 6), (-4, 4), (-3, 4)]
gate_rows = [{"a": a, "b": b, **gate404(a, b)} for a, b in gate_points]
check("knickfield_gate_truth_table",
      [row["gate404"] for row in gate_rows]
      == [True, True, False, False, False, True],
      [row["gate404"] for row in gate_rows],
      [True, True, False, False, False, True])
check("integer_to_gate_interface_not_evaluated",
      all(row["gate404_from_integer"] == "NOT_EVALUABLE_WITHOUT_H" for row in rows),
      "NOT_EVALUABLE_WITHOUT_H", "NOT_EVALUABLE_WITHOUT_H")

collisions = []
operators = {"A404": a404, "D": dyadic, "Rev": reverse_decimal,
             "J1100": j1100, "R12320": grid_rotation}
for n in domain:
    values = {name: fn(n) for name, fn in operators.items()}
    names = list(values)
    for i, left in enumerate(names):
        for right in names[i + 1:]:
            if values[left] == values[right]:
                collisions.append({"n": n, "left": left, "right": right,
                                   "value": values[left]})
check("declared_domain_collision_ledger_complete",
      {tuple((c["n"], c["left"], c["right"], c["value"])) for c in collisions}
      == {(404, "A404", "D", 808)},
      collisions, [{"n": 404, "left": "A404", "right": "D", "value": 808}])

passed = all(bool(item["pass"]) for item in checks)
result = {
    "test_id": "NEXAH_OPERATOR_COLLISION_MATRIX_001",
    "date": "2026-09-29",
    "classification": "SINGLE_OPERATOR_COLLISION_AT_404_TYPED_PATHS_SEPARATE",
    "passed": passed,
    "check_count": len(checks),
    "passed_count": sum(bool(item["pass"]) for item in checks),
    "checks": checks,
    "domain": domain,
    "rows": rows,
    "collisions": collisions,
    "gate_truth_table": gate_rows,
    "gate_bridge_status": "NOT_EVALUABLE_WITHOUT_INDEPENDENT_SOURCE_BOUND_H",
    "decision": {
        "operator_identity": False,
        "unique_A404_D_integer_collision": 404,
        "1212_role": "AFFINE_MIDPOINT_ON_TWO_STEP_A404_PATH",
        "1212_dyadic_carrier": False,
        "knickfield_gate_executable": True,
        "SCN_NCS_to_gate_interface_defined": False,
    },
    "claim_boundary": "Finite arithmetic taxonomy only; no switch, physical transition, historical generator or M-Class promotion.",
}
canonical = json.dumps(result, sort_keys=True, separators=(",", ":")).encode()
result["scientific_hash"] = hashlib.sha256(canonical).hexdigest()
OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps({k: result[k] for k in (
    "test_id", "classification", "passed", "check_count", "passed_count",
    "scientific_hash")}, indent=2))
if not passed:
    raise SystemExit(1)
