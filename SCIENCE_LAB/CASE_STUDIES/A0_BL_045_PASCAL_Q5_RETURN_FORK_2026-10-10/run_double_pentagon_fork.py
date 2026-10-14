#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


def mm(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(len(b))) for j in range(len(b[0]))] for i in range(len(a))]


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


def trace(a):
    return sum(a[i][i] for i in range(len(a)))


def identity(n):
    return [[int(i == j) for j in range(n)] for i in range(n)]


def scale(a, scalar):
    return [[scalar * value for value in row] for row in a]


def main(output):
    protocol = json.loads(Path("DOUBLE_PENTAGON_PROTOCOL.json").read_text())
    q = protocol["q"]
    m = mpow(q, protocol["local_steps"])
    mi = inverse_unimodular_2(m)
    q10 = mpow(q, 10)
    parallel = direct_sum(m, m)
    swap = [[0, 0, 1, 0], [0, 0, 0, 1], [1, 0, 0, 0], [0, 1, 0, 0]]
    same_bridge = mm(swap, parallel)
    reciprocal_plus = direct_sum(m, mi)
    reciprocal_minus = direct_sum(m, scale(mi, -1))
    qprime_plus = mm(swap, reciprocal_plus)
    qprime_minus = mm(swap, reciprocal_minus)
    i4 = identity(4)
    minus_i4 = scale(i4, -1)

    checks = {
        "carrier_is_two_times_five_positions": protocol["carrier"] == {"pentagons": 2, "positions_per_pentagon": 5, "total_positions": 10},
        "q5_exact": m == [[8, 5], [5, 3]],
        "q5_entry_8_equals_2_cubed": m[0][0] == 2 ** 3,
        "q10_exact": q10 == [[89, 55], [55, 34]],
        "q10_trace_123_det_plus_1": trace(q10) == 123 and det2(q10) == 1,
        "parallel_trace_22_det_plus_1": trace(parallel) == 22 and det2(m) * det2(m) == 1,
        "same_direction_bridge_not_closed_after_two": mm(same_bridge, same_bridge) == direct_sum(q10, q10) and mm(same_bridge, same_bridge) != i4,
        "reciprocal_bridge_plus_trace_0_det_plus_1": trace(qprime_plus) == 0 and det2(m) * det2(mi) == 1,
        "reciprocal_bridge_plus_squares_to_plus_identity": mm(qprime_plus, qprime_plus) == i4,
        "reciprocal_bridge_minus_squares_to_minus_identity": mm(qprime_minus, qprime_minus) == minus_i4,
        "reciprocal_bridge_minus_fourth_power_is_identity": mpow(qprime_minus, 4) == i4,
        "reciprocal_leg_is_explicit_not_implied_by_count_10": mi == [[-3, 5], [5, -8]]
    }
    if not all(checks.values()):
        classification = "INVALID_EXPERIMENT"
    elif mm(qprime_plus, qprime_plus) == i4 and mm(qprime_minus, qprime_minus) == minus_i4 and mm(same_bridge, same_bridge) != i4 and q10 != identity(2):
        classification = "SIGNED_DOUBLE_RETURN_IDENTIFIED"
    elif q10 == identity(2):
        classification = "TEN_STEP_RETURN_IDENTIFIED"
    else:
        classification = "DOUBLE_RETURN_UNDERDETERMINED"

    result = {
        "study_id": "A0_BL_045_DOUBLE_PENTAGON_QPRIME_FORK_2026_10_10",
        "classification": classification,
        "checks": checks,
        "local_half_orbit": {"Q5": m, "inverse_Q5": mi, "trace": trace(m), "determinant": det2(m)},
        "candidate_operators": {
            "sequential_10": {"matrix": q10, "trace": trace(q10), "determinant": det2(q10), "is_identity": q10 == identity(2)},
            "parallel_5_5": {"matrix": parallel, "trace": trace(parallel), "determinant": 1, "coupling": "NONE"},
            "same_direction_bridge": {"matrix": same_bridge, "square": mm(same_bridge, same_bridge), "is_involution": mm(same_bridge, same_bridge) == i4},
            "reciprocal_bridge_Qprime_plus": {"level_sign": 1, "matrix": qprime_plus, "trace": trace(qprime_plus), "determinant": 1, "square": mm(qprime_plus, qprime_plus), "return_after_two": "EXACT_ORIENTED_STATE"},
            "reciprocal_bridge_Qprime_minus": {"level_sign": -1, "matrix": qprime_minus, "trace": trace(qprime_minus), "determinant": 1, "square": mm(qprime_minus, qprime_minus), "fourth_power": mpow(qprime_minus, 4), "return_after_two": "ANTI_RETURN_OR_PROJECTIVE_RETURN", "return_after_four": "EXACT_ORIENTED_STATE"}
        },
        "interpretation": [
            "Q5 is the local monodromy of one pentagon and is retained as a half-orbit control.",
            "Q10 is sequential composition, while Q5 direct-sum Q5 is two uncoupled copies; neither is a double-pentagon return.",
            "A block-swap bridge between equal-direction copies exchanges carriers but accumulates Q10 and does not close the state.",
            "The typed reciprocal bridge Q' closes exactly after two applications at level sign +1, but only because the second leg is explicitly Q^-5.",
            "At level sign -1, Q' squared is -I: this is an anti-return, or a projective return only if global sign is explicitly quotiented; the oriented state closes after four applications.",
            "The exact entry 8=2^3 is recorded in Q5 but does not determine the level sign.",
            "Therefore two pentagons and ten positions do not determine Q'; reciprocal bridge and level orientation are indispensable data."
        ],
        "claim_boundary": "Exact conditional double-pentagon closure; no derivation of the reciprocal leg from Pascal weights, archaeology, imagery or physical topology."
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
