#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from math import comb
from pathlib import Path


def mm(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(2)) for j in range(2)] for i in range(2)]


def mpow(a, n):
    out = [[1, 0], [0, 1]]
    while n:
        if n & 1:
            out = mm(out, a)
        a = mm(a, a)
        n //= 2
    return out


def det(a):
    return a[0][0] * a[1][1] - a[0][1] * a[1][0]


def sub_identity(a):
    return [[a[0][0] - 1, a[0][1]], [a[1][0], a[1][1] - 1]]


def inverse_unimodular(a):
    d = det(a)
    assert d in (-1, 1)
    return [[a[1][1] // d, -a[0][1] // d], [-a[1][0] // d, a[0][0] // d]]


class DSU:
    def __init__(self, items):
        self.p = {x: x for x in items}

    def find(self, x):
        if self.p[x] != x:
            self.p[x] = self.find(self.p[x])
        return self.p[x]

    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a != b:
            self.p[b] = a


def boundary_components(segments, twisted):
    vertices = [(i, row) for i in range(segments + 1) for row in (0, 1)]
    quotient = DSU(vertices)
    if twisted:
        quotient.union((segments, 0), (0, 1))
        quotient.union((segments, 1), (0, 0))
    else:
        quotient.union((segments, 0), (0, 0))
        quotient.union((segments, 1), (0, 1))
    graph = {}
    for row in (0, 1):
        for i in range(segments):
            a, b = quotient.find((i, row)), quotient.find((i + 1, row))
            graph.setdefault(a, set()).add(b)
            graph.setdefault(b, set()).add(a)
    seen = set()
    count = 0
    for node in graph:
        if node in seen:
            continue
        count += 1
        stack = [node]
        seen.add(node)
        while stack:
            for nxt in graph[stack.pop()]:
                if nxt not in seen:
                    seen.add(nxt)
                    stack.append(nxt)
    return count


def main(output):
    protocol = json.loads(Path("FROZEN_PROTOCOL.json").read_text())
    q = protocol["q"]
    m = mpow(q, protocol["steps"])
    identity = [[1, 0], [0, 1]]
    twist = protocol["twisted_state_reflection"]
    compensation = inverse_unimodular(m)
    untwisted_total = m
    twisted_total = mm(twist, m)
    compensation_total = mm(compensation, m)
    midpoint = comb(protocol["pascal_midpoint_n"], protocol["pascal_midpoint_k"])
    strip_segments = protocol["strip_segments"]

    checks = {
        "pascal_midpoint_weight_20": midpoint == 20,
        "five_position_orbit_total_100": midpoint * protocol["pascal_orbit_positions"] == 100,
        "q5_exact": m == [[8, 5], [5, 3]],
        "q5_trace_11": m[0][0] + m[1][1] == 11,
        "q5_determinant_minus_1": det(m) == -1,
        "untwisted_boundary_components_2": boundary_components(strip_segments, False) == 2,
        "twisted_boundary_components_1": boundary_components(strip_segments, True) == 1,
        "same_q5_for_both_topologies": untwisted_total == m and mm(identity, m) == m,
        "untwisted_no_nonzero_rational_fixed_state": det(sub_identity(untwisted_total)) == -11,
        "twisted_no_nonzero_rational_fixed_state": det(sub_identity(twisted_total)) == -3,
        "compensating_seam_is_q5_inverse": compensation == [[-3, 5], [5, -8]],
        "compensating_seam_closes_by_construction": compensation_total == identity,
    }
    if not all(checks.values()):
        classification = "INVALID_EXPERIMENT"
    elif untwisted_total == identity and twisted_total != identity:
        classification = "UNTWISTED_RETURN_IDENTIFIED"
    elif twisted_total == identity and untwisted_total != identity:
        classification = "TWISTED_RETURN_IDENTIFIED"
    else:
        classification = "RETURN_TYPE_UNDERDETERMINED"

    result = {
        "study_id": "A0_BL_045_PASCAL_Q5_RETURN_FORK_2026_10_10",
        "classification": classification,
        "checks": checks,
        "pascal_orbit": {"positions": 5, "weight_each": midpoint, "displayed_total": 5 * midpoint},
        "monodromy": {"Q5": m, "trace": 11, "determinant": -1},
        "return_fork": {
            "untwisted": {"boundary_components": 2, "fixed_state_determinant": -11},
            "twisted": {"boundary_components": 1, "state_reflection": twist, "fixed_state_determinant": -3},
            "compensating_control": {"map": compensation, "product_with_Q5": compensation_total, "status": "TAILORED_INVERSE_NOT_TOPOLOGY_DERIVED"},
        },
        "interpretation": [
            "Q5, trace 11 and determinant -1 are identical for the untwisted and twisted strip quotients.",
            "Neither preregistered standard seam produces a nonzero rational fixed state.",
            "Exact state closure is obtainable with Q^-5 only as a tailored compensating control.",
            "Therefore determinant -1 does not identify a Mobius return and the Pascal-to-Fibonacci state map remains undefined."
        ],
        "claim_boundary": "Finite exact separation of linear monodromy and seam topology; no canonical phi, physical mechanism or universal return law."
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))
    raise SystemExit(classification == "INVALID_EXPERIMENT")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    main(args.output)
