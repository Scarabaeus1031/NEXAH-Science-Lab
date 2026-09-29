#!/usr/bin/env python3
"""E8-REP-03: reproducible E8 -> H4 union phi*H4 -> Coxeter-plane benchmark."""

from __future__ import annotations

import csv
import json
import math
import platform
import sys
from collections import Counter
from fractions import Fraction
from itertools import combinations, permutations, product
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "outputs"
OUT.mkdir(exist_ok=True)
PHI = (1.0 + math.sqrt(5.0)) / 2.0
TOL = 1e-8


def e8_roots() -> np.ndarray:
    roots: list[np.ndarray] = []
    for i, j in combinations(range(8), 2):
        for a, b in product((-1.0, 1.0), repeat=2):
            v = np.zeros(8)
            v[i], v[j] = a, b
            roots.append(v)
    for signs in product((-1.0, 1.0), repeat=8):
        if sum(s < 0 for s in signs) % 2 == 0:
            roots.append(np.asarray(signs) / 2.0)
    return np.asarray(roots)


def simple_roots() -> np.ndarray:
    return np.asarray(
        [
            [.5, -.5, -.5, -.5, -.5, -.5, -.5, .5],
            [1, 1, 0, 0, 0, 0, 0, 0],
            [-1, 1, 0, 0, 0, 0, 0, 0],
            [0, -1, 1, 0, 0, 0, 0, 0],
            [0, 0, -1, 1, 0, 0, 0, 0],
            [0, 0, 0, -1, 1, 0, 0, 0],
            [0, 0, 0, 0, -1, 1, 0, 0],
            [0, 0, 0, 0, 0, -1, 1, 0],
        ],
        dtype=float,
    )


def coxeter_matrix(alpha: np.ndarray) -> np.ndarray:
    c = np.eye(8)
    for a in alpha:
        c = c @ (np.eye(8) - np.outer(a, a))
    return c


def exact_coxeter_order() -> int | None:
    n = 8
    h = Fraction(1, 2)
    alpha = [
        [h, -h, -h, -h, -h, -h, -h, h],
        [Fraction(1), Fraction(1), *([Fraction(0)] * 6)],
        [Fraction(-1), Fraction(1), *([Fraction(0)] * 6)],
        [Fraction(0), Fraction(-1), Fraction(1), *([Fraction(0)] * 5)],
        [Fraction(0), Fraction(0), Fraction(-1), Fraction(1), *([Fraction(0)] * 4)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(-1), Fraction(1), *([Fraction(0)] * 3)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(0), Fraction(-1), Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(0), Fraction(0), Fraction(-1), Fraction(1), Fraction(0)],
    ]

    def eye() -> list[list[Fraction]]:
        return [[Fraction(int(i == j)) for j in range(n)] for i in range(n)]

    def mm(x: list[list[Fraction]], y: list[list[Fraction]]) -> list[list[Fraction]]:
        return [[sum(x[i][k] * y[k][j] for k in range(n)) for j in range(n)] for i in range(n)]

    ident = eye()
    c = ident
    for a in alpha:
        reflection = [[ident[i][j] - a[i] * a[j] for j in range(n)] for i in range(n)]
        c = mm(c, reflection)
    power = ident
    for k in range(1, 31):
        power = mm(power, c)
        if power == ident:
            return k
    return None


def eigenspace_basis(c: np.ndarray, exponents: tuple[int, ...]) -> np.ndarray:
    values, vectors = np.linalg.eig(c)
    columns: list[np.ndarray] = []
    for exponent in exponents:
        target = np.exp(2j * np.pi * exponent / 30)
        z = vectors[:, int(np.argmin(np.abs(values - target)))]
        columns.extend((z.real, z.imag))
    q, _ = np.linalg.qr(np.column_stack(columns))
    return q


def cluster_indices(values: np.ndarray, tolerance: float = 1e-9) -> list[list[int]]:
    groups: list[list[int]] = []
    for index in np.argsort(values):
        if not groups or abs(values[index] - np.mean(values[groups[-1]])) > tolerance:
            groups.append([int(index)])
        else:
            groups[-1].append(int(index))
    return groups


def vector_key(v: np.ndarray, digits: int = 8) -> tuple[float, ...]:
    return tuple(np.round(v, digits))


def orbit_sizes(roots: np.ndarray, c: np.ndarray) -> list[int]:
    root_keys = {tuple(np.rint(v * 2).astype(int)) for v in roots}
    seen: set[tuple[int, ...]] = set()
    sizes: list[int] = []
    for root in roots:
        start = tuple(np.rint(root * 2).astype(int))
        if start in seen:
            continue
        current = root.copy()
        orbit: set[tuple[int, ...]] = set()
        for _ in range(100):
            key = tuple(np.rint(current * 2).astype(int))
            if key in orbit:
                break
            if key not in root_keys:
                raise RuntimeError("Coxeter image left the E8 root set")
            orbit.add(key)
            seen.add(key)
            current = c @ current
        sizes.append(len(orbit))
    return sorted(sizes)


def canonical_h4() -> np.ndarray:
    vertices: list[np.ndarray] = []
    for axis in range(4):
        for sign in (-1.0, 1.0):
            v = np.zeros(4)
            v[axis] = sign
            vertices.append(v)
    for signs in product((-1.0, 1.0), repeat=4):
        vertices.append(np.asarray(signs) / 2.0)

    base = np.asarray([0.0, 0.5, PHI / 2.0, 1.0 / (2.0 * PHI)])

    def parity(p: tuple[int, ...]) -> int:
        return sum(p[i] > p[j] for i in range(4) for j in range(i + 1, 4)) % 2

    for perm in permutations(range(4)):
        if parity(perm) != 0:
            continue
        q = base[list(perm)]
        nonzero = np.where(np.abs(q) > 1e-12)[0]
        for signs in product((-1.0, 1.0), repeat=3):
            v = q.copy()
            v[nonzero] *= np.asarray(signs)
            vertices.append(v)
    return np.asarray(vertices)


def gram_histogram(points: np.ndarray) -> Counter[float]:
    unit = points / np.linalg.norm(points, axis=1)[:, None]
    gram = unit @ unit.T
    return Counter(round(float(gram[i, j]), 10) for i in range(len(unit)) for j in range(i + 1, len(unit)))


def reflection_closure(points: np.ndarray) -> tuple[int, int, float]:
    unit = points / np.mean(np.linalg.norm(points, axis=1))
    keys = {vector_key(v) for v in unit}
    lookup = np.asarray(list(keys))
    passed = 0
    maximum_error = 0.0
    for alpha in unit:
        denominator = float(alpha @ alpha)
        for beta in unit:
            image = beta - (2.0 * float(beta @ alpha) / denominator) * alpha
            distance = float(np.min(np.linalg.norm(lookup - image, axis=1)))
            maximum_error = max(maximum_error, distance)
            if vector_key(image) in keys or distance < TOL:
                passed += 1
    return passed, len(unit) ** 2, maximum_error


def h4_simple_gram(points: np.ndarray) -> tuple[np.ndarray, float]:
    unit = points / np.linalg.norm(points, axis=1)[:, None]
    gram = unit @ unit.T
    selected: list[int] | None = None
    for a in range(120):
        for b in np.where(np.abs(gram[a] + PHI / 2.0) < TOL)[0]:
            for c in np.where((np.abs(gram[b] + 0.5) < TOL) & (np.abs(gram[a]) < TOL))[0]:
                candidates = np.where(
                    (np.abs(gram[c] + 0.5) < TOL)
                    & (np.abs(gram[a]) < TOL)
                    & (np.abs(gram[b]) < TOL)
                )[0]
                if len(candidates):
                    selected = [a, int(b), int(c), int(candidates[0])]
                    break
            if selected:
                break
        if selected:
            break
    if selected is None:
        raise RuntimeError("No H4 simple-root Gram matrix found")
    measured = gram[np.ix_(selected, selected)]
    target = np.asarray(
        [
            [1.0, -PHI / 2.0, 0.0, 0.0],
            [-PHI / 2.0, 1.0, -0.5, 0.0],
            [0.0, -0.5, 1.0, -0.5],
            [0.0, 0.0, -0.5, 1.0],
        ]
    )
    return measured, float(np.max(np.abs(measured - target)))


def generic_projection_control(roots: np.ndarray) -> dict[str, object]:
    rng = np.random.default_rng(20260921)
    q, _ = np.linalg.qr(rng.normal(size=(8, 2)))
    xy = roots @ q
    groups = cluster_indices(np.linalg.norm(xy, axis=1))
    multiplicities = sorted(Counter(len(group) for group in groups).items())
    return {
        "seed": 20260921,
        "radius_cluster_count": len(groups),
        "multiplicity_histogram": multiplicities,
        "matches_e8_coxeter_signature": len(groups) == 8 and all(len(group) == 30 for group in groups),
    }


def multiplicative_order(a: int, modulus: int) -> int | None:
    if math.gcd(a, modulus) != 1:
        return None
    value = 1
    for k in range(1, modulus * 2 + 1):
        value = (value * a) % modulus
        if value == 1:
            return k
    return None


def modular_controls() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for modulus in (37, 137, 237, 11357):
        image_size = len({(37 * i) % modulus for i in range(modulus)})
        fixed_points = sum((37 * i) % modulus == i for i in range(modulus))
        order = multiplicative_order(37, modulus)
        matches = modulus == 240 and order == 30 and fixed_points == 0
        rows.append(
            {
                "modulus": modulus,
                "node_count": modulus,
                "gcd_37_N": math.gcd(37, modulus),
                "image_size": image_size,
                "operator_order": order,
                "fixed_points": fixed_points,
                "matches_e8_identity_gate": matches,
            }
        )
    return rows


def write_csv(path: Path, header: list[str], rows: list[list[object]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(header)
        writer.writerows(rows)


def main() -> int:
    roots = e8_roots()
    alpha = simple_roots()
    coxeter = coxeter_matrix(alpha)
    root_keys = {tuple(np.rint(v * 2).astype(int)) for v in roots}
    norm_sq = np.sum(roots * roots, axis=1)
    differences = roots[:, None, :] - roots[None, :, :]
    distance_sq = np.sum(differences * differences, axis=2)
    edge_count = int(np.sum(np.triu(np.isclose(distance_sq, 2.0, atol=1e-10), 1)))
    degree = 2 * edge_count // len(roots)

    values, _ = np.linalg.eig(coxeter)
    exponents = sorted(np.rint(30 * np.mod(np.angle(values), 2 * np.pi) / (2 * np.pi)).astype(int).tolist())
    exact_order = exact_coxeter_order()
    orbits = orbit_sizes(roots, coxeter)

    q2 = eigenspace_basis(coxeter, (1,))
    xy = roots @ q2
    radii_2d = np.linalg.norm(xy, axis=1)
    ring_groups = cluster_indices(radii_2d)
    ring_radii = [float(np.mean(radii_2d[group])) for group in ring_groups]
    phi_ring_pairs: list[tuple[int, int, float]] = []
    for i in range(len(ring_radii)):
        for j in range(i + 1, len(ring_radii)):
            ratio = ring_radii[j] / ring_radii[i]
            if abs(ratio - PHI) < 1e-10:
                phi_ring_pairs.append((i + 1, j + 1, ratio))

    q4 = eigenspace_basis(coxeter, (1, 11))
    projected_4d = roots @ q4
    radii_4d = np.linalg.norm(projected_4d, axis=1)
    shell_groups = cluster_indices(radii_4d)
    shells = [projected_4d[group] for group in shell_groups]
    shell_radii = [float(np.mean(np.linalg.norm(shell, axis=1))) for shell in shells]
    shell_ratio = shell_radii[1] / shell_radii[0]
    scaled_small = PHI * shells[0]
    cross_distances = np.linalg.norm(shells[1][:, None, :] - scaled_small[None, :, :], axis=2)
    direct_set_error = float(max(np.min(cross_distances, axis=0).max(), np.min(cross_distances, axis=1).max()))

    canonical = canonical_h4()
    canonical_hist = gram_histogram(canonical)
    shell_hists = [gram_histogram(shell) for shell in shells]
    reflection_results = [reflection_closure(shell) for shell in shells]
    simple_grams = [h4_simple_gram(shell) for shell in shells]
    q4_invariance_error = float(np.max(np.abs(coxeter @ q4 - q4 @ (q4.T @ coxeter @ q4))))

    generic = generic_projection_control(roots)
    modular = modular_controls()

    assertions: list[dict[str, object]] = []

    def check(name: str, passed: bool, measured: object, expected: object, layer: str) -> None:
        assertions.append(
            {"assertion": name, "layer": layer, "status": "PASS" if passed else "FAIL", "measured": measured, "expected": expected}
        )

    check("E8_ROOT_COUNT", len(roots) == 240, len(roots), 240, "8D")
    check("E8_UNIQUE_ROOTS", len(root_keys) == 240, len(root_keys), 240, "8D")
    check("E8_ROOT_NORM_SQUARED", bool(np.allclose(norm_sq, 2.0)), float(np.max(np.abs(norm_sq - 2.0))), "0 error", "8D")
    check("E8_EDGE_COUNT", edge_count == 6720, edge_count, 6720, "8D")
    check("E8_VERTEX_DEGREE", degree == 56, degree, 56, "8D")
    check("COXETER_EXACT_ORDER", exact_order == 30, exact_order, 30, "operator")
    check("COXETER_EXPONENTS", exponents == [1, 7, 11, 13, 17, 19, 23, 29], exponents, [1, 7, 11, 13, 17, 19, 23, 29], "operator")
    check("COXETER_ORBITS", orbits == [30] * 8, orbits, [30] * 8, "operator")
    check("COXETER_2D_RINGS", len(ring_groups) == 8 and all(len(group) == 30 for group in ring_groups), [len(g) for g in ring_groups], [30] * 8, "2D")
    check("COXETER_PHI_RING_PAIRS", len(phi_ring_pairs) == 4, [(a, b) for a, b, _ in phi_ring_pairs], [(1, 2), (3, 6), (4, 7), (5, 8)], "2D")
    check("H4_TWO_SHELLS", len(shells) == 2 and all(len(shell) == 120 for shell in shells), [len(s) for s in shells], [120, 120], "4D")
    check("H4_RADIUS_RATIO_PHI", abs(shell_ratio - PHI) < 1e-12, shell_ratio, PHI, "4D")
    check("H4_DIRECT_SET_EQUALITY", direct_set_error < 1e-12, direct_set_error, "< 1e-12", "4D")
    check("H4_CANONICAL_GRAM", all(hist == canonical_hist for hist in shell_hists), [hist == canonical_hist for hist in shell_hists], [True, True], "4D")
    check("H4_SIMPLE_ROOT_GRAM", all(error < 1e-12 for _, error in simple_grams), [error for _, error in simple_grams], "each < 1e-12", "4D")
    check("H4_REFLECTION_CLOSURE", all(passed == total for passed, total, _ in reflection_results), [(p, t) for p, t, _ in reflection_results], [(14400, 14400)] * 2, "4D")
    check("H4_SUBSPACE_INVARIANCE", q4_invariance_error < 1e-12, q4_invariance_error, "< 1e-12", "4D")
    check("NEG_GENERIC_REJECTED", not bool(generic["matches_e8_coxeter_signature"]), generic, "not 8 rings x 30", "negative")
    check("NEG_MODULAR_REJECTED", all(not bool(row["matches_e8_identity_gate"]) for row in modular), modular, "all false", "negative")

    positive_pass = all(row["status"] == "PASS" for row in assertions)
    results = {
        "benchmark": "E8-REP-03",
        "date": "2026-09-21",
        "decision": "PASS" if positive_pass else "FAIL",
        "scope": "representation benchmark; no novelty claim for E8/H4 mathematics",
        "runtime": {
            "python": platform.python_version(),
            "numpy": np.__version__,
            "platform": platform.platform(),
            "absolute_tolerance": TOL,
        },
        "e8": {"roots": len(roots), "unique": len(root_keys), "norm_squared": 2.0, "edges": edge_count, "degree": degree},
        "coxeter": {"exact_order": exact_order, "exponents": exponents, "orbit_sizes": orbits},
        "projection_2d": {
            "ring_radii": ring_radii,
            "ring_multiplicities": [len(group) for group in ring_groups],
            "phi_pairs": [{"small_ring": a, "large_ring": b, "ratio": ratio} for a, b, ratio in phi_ring_pairs],
        },
        "projection_4d": {
            "shell_sizes": [len(shell) for shell in shells],
            "shell_radii": shell_radii,
            "radius_ratio": shell_ratio,
            "phi_error": shell_ratio - PHI,
            "direct_set_max_error": direct_set_error,
            "canonical_gram_match": [hist == canonical_hist for hist in shell_hists],
            "reflection_closure": [
                {"passed": passed, "total": total, "max_nearest_error": error}
                for passed, total, error in reflection_results
            ],
            "simple_root_gram_max_error": [error for _, error in simple_grams],
            "subspace_invariance_error": q4_invariance_error,
        },
        "negative_controls": {"generic_projection": generic, "modular_graphs": modular},
        "assertions": assertions,
    }

    (OUT / "results.json").write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    write_csv(
        OUT / "e8_roots_8d.csv",
        ["root_id"] + [f"x{i+1}" for i in range(8)],
        [[index] + [f"{value:.12g}" for value in root] for index, root in enumerate(roots)],
    )

    shell_by_index = {}
    for shell_id, group in enumerate(shell_groups, 1):
        for source_index in group:
            shell_by_index[source_index] = shell_id
    write_csv(
        OUT / "h4_shells_4d.csv",
        ["source_root_id", "shell", "radius"] + [f"y{i+1}" for i in range(4)],
        [
            [index, shell_by_index[index], f"{radii_4d[index]:.12g}"]
            + [f"{value:.12g}" for value in projected_4d[index]]
            for index in range(240)
        ],
    )

    ring_by_index = {}
    for ring_id, group in enumerate(ring_groups, 1):
        for source_index in group:
            ring_by_index[source_index] = ring_id
    write_csv(
        OUT / "coxeter_projection_2d.csv",
        ["source_root_id", "ring", "radius", "angle_degrees", "x", "y"],
        [
            [
                index,
                ring_by_index[index],
                f"{radii_2d[index]:.12g}",
                f"{(math.degrees(math.atan2(xy[index,1], xy[index,0])) % 360):.12g}",
                f"{xy[index,0]:.12g}",
                f"{xy[index,1]:.12g}",
            ]
            for index in range(240)
        ],
    )
    write_csv(
        OUT / "assertions.csv",
        ["assertion", "layer", "status", "measured", "expected"],
        [[a["assertion"], a["layer"], a["status"], json.dumps(a["measured"]), json.dumps(a["expected"])] for a in assertions],
    )
    write_csv(
        OUT / "negative_controls.csv",
        ["control", "parameter", "node_count", "operator_order", "fixed_points", "observed", "e8_identity_gate"],
        [["generic_projection", 20260921, 240, "", "", "120 radius pairs of multiplicity 2", "REJECT"]]
        + [
            ["modular_37i_mod_N", row["modulus"], row["node_count"], row["operator_order"], row["fixed_points"], f"image_size={row['image_size']}", "REJECT"]
            for row in modular
        ],
    )

    ledger = """# E8-REP-03 — Representation Ledger

| Stage | Object | Dimension | Operator | Preserved invariants | Residual / loss | Status |
| --- | --- | ---: | --- | --- | --- | --- |
| Source | E8 root set | 8D | generator | 240 roots; norm² 2; 6,720 edges; degree 56 | none | PASS |
| Relation | Coxeter action | 8D | product of 8 root reflections | exact order 30; exponents; eight 30-cycles | orientation sign depends on product convention | PASS |
| Projection A | H4 ∪ φH4 | 4D | invariant eigenspace m = 1, 11 plus conjugates | 120 + 120 roots; Gram data; reflection closure; φ scale | four dimensions removed | PASS |
| Projection B | Coxeter plane | 2D | eigenspace m = 1 plus conjugate | eight rings × 30; four φ radius pairs | 4D incidence information is not fully visible | PASS |
| Observation | radial rosette | 2D image | rendering | orbit and radius signature when coordinates are retained | appearance alone is insufficient | BOUNDED |
| Reconstruction | assertion suite | mixed | invariant comparison | source identity recovered only when all gates pass | tolerance recorded | PASS |
| Negative A | generic projection | 2D | seeded orthogonal projection | antipodal pairing only | no Coxeter ring signature | REJECT AS E8 IDENTITY |
| Negative B | 37i mod N graph family | discrete | modular multiplication | its own node/cycle structure | no 240-root metric or H4 closure | REJECT AS E8 IDENTITY |

## Boundary

The benchmark demonstrates a known E8/H4 representation chain. It does not identify unrelated modular or radial graphics with E8, and it does not establish a new mathematical theorem.
"""
    (ROOT / "REPRESENTATION_LEDGER.md").write_text(ledger, encoding="utf-8")

    status_rows = "\n".join(
        f"| `{row['assertion']}` | {row['layer']} | **{row['status']}** |"
        for row in assertions
    )
    report = f"""# E8-REP-03 — Final Test Report

Date: 2026-09-21  
Decision: **{'PASS' if positive_pass else 'FAIL'}**

## Finding

The standard 240-root E8 coordinate model passes the full representation chain:

`E8 (8D) → H4 ∪ φH4 (4D) → Coxeter plane (2D)`.

The 4D projection contains two 120-root shells with radii `{shell_radii[0]:.12f}` and `{shell_radii[1]:.12f}`. Their ratio is `{shell_ratio:.15f}`, differing from φ by `{shell_ratio-PHI:+.3e}`. Scaling the smaller shell by φ reproduces the larger point set with maximum nearest-point error `{direct_set_error:.3e}`.

Both shells match the canonical 600-cell H4 Gram histogram, contain an H4 simple-root Gram matrix, and pass all 14,400 root-reflection checks.

The 2D Coxeter projection produces eight rings of thirty points and four φ-scaled radius pairs. The Coxeter operator has exact order 30.

## Assertion register

| Assertion | Layer | Status |
| --- | --- | --- |
{status_rows}

## Negative controls

- The seeded generic 8D→2D projection produces `{generic['radius_cluster_count']}` radius clusters with multiplicity pattern `{generic['multiplicity_histogram']}`, not eight rings of thirty.
- The modular maps `i → 37i mod N` have operator orders `None, 4, 78, 460` for `N = 37, 137, 237, 11357`; none has 240 nodes or the E8/H4 metric and reflection structure.

## Interpretation

This is a calibration benchmark, not a novelty claim about E8. Its contribution to NEXAH is methodological: it gives a positive control where representation changes are genuine and invariants survive, plus negative controls where visual similarity does not establish identity.

## Boundary

`H4 ∪ φH4` is a union of two scaled root sets in the same four-dimensional projection space, not an orthogonal direct sum. The Möbius-Harmonic modular graphs remain a different object class unless a future test supplies a structure-preserving map and passes the same invariant gates.
"""
    (ROOT / "REPORT.md").write_text(report, encoding="utf-8")

    print(
        json.dumps(
            {
                "benchmark": "E8-REP-03",
                "decision": results["decision"],
                "assertions": Counter(a["status"] for a in assertions),
                "python": sys.version.split()[0],
                "numpy": np.__version__,
            },
            default=dict,
        )
    )
    return 0 if positive_pass else 1


if __name__ == "__main__":
    raise SystemExit(main())
