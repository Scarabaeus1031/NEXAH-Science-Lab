#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
from pathlib import Path


def mm(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(len(b))) for j in range(len(b[0]))] for i in range(len(a))]


def transpose(a):
    return [list(row) for row in zip(*a)]


def mpow(a, n):
    out = [[int(i == j) for j in range(len(a))] for i in range(len(a))]
    while n:
        if n & 1:
            out = mm(out, a)
        a = mm(a, a)
        n //= 2
    return out


def det2(a):
    return a[0][0] * a[1][1] - a[0][1] * a[1][0]


def inverse_unimodular_2(a):
    d = det2(a)
    assert d in (-1, 1)
    return [[a[1][1] // d, -a[0][1] // d], [-a[1][0] // d, a[0][0] // d]]


def direct_sum(a, b):
    na, nb = len(a), len(b)
    return [a[i] + [0] * nb for i in range(na)] + [[0] * na + b[i] for i in range(nb)]


def scale(a, scalar):
    return [[scalar * x for x in row] for row in a]


def identity(n):
    return [[int(i == j) for j in range(n)] for i in range(n)]


def janus(center, value):
    return 2 * center - value


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def distance2(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b))


def close(a, b, tol):
    return abs(a - b) <= tol


def close_vec(a, b, tol):
    return all(close(x, y, tol) for x, y in zip(a, b))


def jz(v):
    return (v[0], v[1], -v[2])


def main(output: Path) -> None:
    protocol = json.loads(Path("PILLAR_DISTANCE_PROTOCOL.json").read_text())
    tol = protocol["pascal_fixture"]["tolerance"]

    scalar_records = []
    scalar_ok = True
    for shell_name, shell in protocol["scalar_shells"].items():
        c = shell["center"]
        for r in shell["radii"]:
            left, right = c - r, c + r
            record = {
                "shell": shell_name,
                "center": c,
                "radius": r,
                "pair": [left, right],
                "midpoint": (left + right) // 2,
                "diameter": right - left,
                "reflection": [janus(c, left), janus(c, right)]
            }
            scalar_records.append(record)
            scalar_ok &= record["midpoint"] == c and record["diameter"] == 2 * r
            scalar_ok &= record["reflection"] == [right, left]
            scalar_ok &= janus(c, janus(c, left)) == left and janus(c, janus(c, right)) == right

    c1 = protocol["scalar_shells"]["primary"]["center"]
    c2 = protocol["scalar_shells"]["nested"]["center"]
    translation = 2 * (c2 - c1)
    probe = 11357
    composed_probe = janus(c2, janus(c1, probe))

    equatorial = []
    for k in range(10):
        angle = 2.0 * math.pi * k / 10.0
        equatorial.append((math.cos(angle), math.sin(angle), 0.0))
    axial = [(0.0, 0.0, 1.0), (0.0, 0.0, -1.0)]
    roots = equatorial + axial
    pillars = [(roots[k], roots[(k + 5) % 10]) for k in range(5)] + [(axial[0], axial[1])]

    roots_unit = all(close(dot(v, v), 1.0, tol) for v in roots)
    pillars_antipodal = all(close_vec(tuple(-x for x in a), b, tol) for a, b in pillars)
    pillar_midpoints_zero = all(close_vec(tuple((x + y) / 2.0 for x, y in zip(a, b)), (0.0, 0.0, 0.0), tol) for a, b in pillars)
    pillar_lengths_two = all(close(math.sqrt(distance2(a, b)), 2.0, tol) for a, b in pillars)
    jz_maps_roots = all(any(close_vec(jz(v), w, tol) for w in roots) for v in roots)
    seam_fixed = all(close_vec(jz(v), v, tol) for v in equatorial)
    axial_exchanged = close_vec(jz(axial[0]), axial[1], tol) and close_vec(jz(axial[1]), axial[0], tol)

    crown_faces = [{"Z", f"V{k}", f"V{(k + 1) % 5}"} for k in range(5)]
    root_faces = [{"N", f"V{k}", f"V{(k + 1) % 5}"} for k in range(5)]
    mapped_faces = [{("N" if x == "Z" else x) for x in face} for face in crown_faces]
    crown_maps_root = mapped_faces == root_faces
    distance_preserved = all(
        close(distance2(a, b), distance2(jz(a), jz(b)), tol)
        for a in roots for b in roots
    )

    q = protocol["q"]
    m = mpow(q, protocol["local_steps"])
    mi = inverse_unimodular_2(m)
    swap = [[0, 0, 1, 0], [0, 0, 0, 1], [1, 0, 0, 0], [0, 1, 0, 0]]
    qprime_plus = mm(swap, direct_sum(m, mi))
    qprime_minus = mm(swap, direct_sum(m, scale(mi, -1)))
    i4 = identity(4)
    minus_i4 = scale(i4, -1)
    plus_gram = mm(transpose(qprime_plus), qprime_plus)
    minus_gram = mm(transpose(qprime_minus), qprime_minus)
    qprime_plus_isometry = plus_gram == i4
    qprime_minus_isometry = minus_gram == i4

    checks = {
        "scalar_shell_pairs_are_exact_centered_reflections": scalar_ok,
        "different_centers_compose_to_nonzero_translation": c1 != c2 and composed_probe == probe + translation and translation != 0,
        "root_fixture_has_12_unit_vectors": len(roots) == 12 and roots_unit,
        "six_antipodal_pillars_have_zero_midpoint_and_length_two": len(pillars) == 6 and pillars_antipodal and pillar_midpoints_zero and pillar_lengths_two,
        "Jz_fixes_seam_and_exchanges_axial_crown_root": seam_fixed and axial_exchanged and crown_maps_root,
        "Jz_maps_root_set_and_preserves_all_pairwise_distances": jz_maps_roots and distance_preserved,
        "Qprime_plus_squares_to_plus_identity": mm(qprime_plus, qprime_plus) == i4,
        "Qprime_minus_squares_to_minus_identity": mm(qprime_minus, qprime_minus) == minus_i4,
        "signed_Qprime_bridges_are_not_euclidean_isometries": not qprime_plus_isometry and not qprime_minus_isometry
    }

    if not all(checks.values()):
        classification = "INVALID_EXPERIMENT"
    elif qprime_plus_isometry or qprime_minus_isometry:
        classification = "QPRIME_EUCLIDEAN_ISOMETRY"
    else:
        classification = "PILLAR_REFLECTION_PASS_QPRIME_NOT_EUCLIDEAN_ISOMETRY"

    result = {
        "study_id": "A0_BL_045_PILLAR_DISTANCE_AUDIT_2026_10_10",
        "classification": classification,
        "checks": checks,
        "scalar_janus_shells": {
            "records": scalar_records,
            "center_composition": {
                "first_center": c1,
                "second_center": c2,
                "J_second_after_J_first_translation": translation,
                "probe": probe,
                "image": composed_probe
            }
        },
        "pascal_pillars": {
            "root_count": len(roots),
            "pillar_count": len(pillars),
            "pillar_length": 2.0,
            "pillar_midpoint": [0.0, 0.0, 0.0],
            "seam_fixed_point_count": len(equatorial),
            "crown_face_count": len(crown_faces),
            "root_face_count": len(root_faces)
        },
        "operator_separation": {
            "Q5": m,
            "inverse_Q5": mi,
            "Qprime_plus": {"matrix": qprime_plus, "square": mm(qprime_plus, qprime_plus), "gram": plus_gram, "is_euclidean_isometry": qprime_plus_isometry, "basis_e1_output_norm_squared": 89},
            "Qprime_minus": {"matrix": qprime_minus, "square": mm(qprime_minus, qprime_minus), "gram": minus_gram, "is_euclidean_isometry": qprime_minus_isometry, "basis_e1_output_norm_squared": 89}
        },
        "untested_labels": protocol["excluded_undefined_labels"],
        "interpretation": [
            "The Janus shell pairs and the Pascal root pillars share an exact centered-reflection grammar.",
            "The Pascal crown/root reflection Jz is a Euclidean isometry, fixes the equatorial seam and swaps Zenith with Nadir.",
            "Two different Janus centers define nested relations; composing their reflections gives a translation, not one global mirror.",
            "The signed reciprocal Q' bridge has the preregistered return law but is not a Euclidean distance-preserving operator.",
            "Therefore the pillar analogy is valid at the reflection/invariant layer, while return dynamics remain operator-specific."
        ],
        "claim_boundary": "Exact finite reflection and matrix audit only; no growth law, +18 percent estimator, physical field, resonance, historical derivation, new Family or PENT-08."
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))
    raise SystemExit(1 if classification == "INVALID_EXPERIMENT" else 0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    main(args.output)
