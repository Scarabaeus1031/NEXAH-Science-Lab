#!/usr/bin/env python3
"""Small typed-record experiment; E8-REP-03 remains an independent control."""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import tempfile
import zipfile
from itertools import product
from pathlib import Path


ROOT = Path(__file__).resolve().parent
E8_ARCHIVE = ROOT / "NEXAH_E8_REP_03_BENCHMARK.zip"
START = (1, 1, 0, 0)
STEPS = {"S": (0, 0, 2, 0), "L": (0, 0, 0, 1)}
# Prespecified interpretation of the supplied 4774 plate:
# left/blue half 47 ↔ w=0; right/gold half 74 ↔ w=1.
ROLE_CODES = {0: "47", 1: "74"}
NEUTRAL_CODES = {0: "A", 1: "B"}
PRIME_WINDOW_BASELINE = 1000  # first 1000 primes, hence 997 consecutive four-prime windows


def add(a: tuple[int, ...], b: tuple[int, ...]) -> tuple[int, ...]:
    return tuple(x + y for x, y in zip(a, b, strict=True))


def norm_sq(v: tuple[int, ...]) -> int:
    return sum(x * x for x in v)


def in_e8_integer_coset(v: tuple[int, ...]) -> bool:
    """Zero-pad the integer vector to dimension eight and check E8 parity."""
    assert len(v) == 4
    return sum(v) % 2 == 0


def orientation_history(states: list[tuple[int, ...]], labels: dict[int, str]) -> list[str]:
    return [labels[s[3]] for s in states]


def first_primes(count: int) -> list[int]:
    primes: list[int] = []
    n = 2
    while len(primes) < count:
        if all(n % p for p in primes if p * p <= n):
            primes.append(n)
        n += 1
    return primes


def prime_window_reference() -> dict:
    """Prespecified arithmetic controls; this has no geometric interpretation."""
    primes = first_primes(PRIME_WINDOW_BASELINE)
    windows = [tuple(primes[i:i + 4]) for i in range(PRIME_WINDOW_BASELINE - 3)]
    balanced = [(i + 1, w) for i, w in enumerate(windows) if w[0] + w[3] == w[1] + w[2]]
    reversal_double = [(i + 1, w) for i, w in enumerate(windows) if int(str(w[3])[::-1]) == 2 * w[0]]
    both = [(i + 1, w) for i, w in enumerate(windows)
            if w[0] + w[3] == w[1] + w[2] and int(str(w[3])[::-1]) == 2 * w[0]]
    focus = windows[11]  # 1-indexed p12..p15
    assert focus == (37, 41, 43, 47)
    assert focus[0] + focus[3] == focus[1] + focus[2] == 84
    assert int(str(focus[3])[::-1]) == 74 == 2 * focus[0]
    assert [b - a for a, b in zip(focus, focus[1:])] == [4, 2, 4]
    return {
        "prespecified_baseline": "all 997 four-consecutive-prime windows among first 1000 primes",
        "focus_prime_indices": [12, 13, 14, 15],
        "focus_primes": focus,
        "focus_last_digits": [x % 10 for x in focus],
        "focus_4774_bridge": "reverse(47)=74=2*37",
        "focus_balance": "37+47=41+43=84",
        "focus_gaps": [4, 2, 4],
        "total_windows": len(windows),
        "balanced_count": len(balanced),
        "reversal_double_count": len(reversal_double),
        "joint_count": len(both),
        "joint_windows": [{"starting_prime_index": i, "primes": w} for i, w in both],
        "interpretation": "Arithmetic coincidences in a declared finite population; no statistical significance, physical resonance, E8 or sqrt(7) geometry is inferred.",
    }


def sign_to_metric_bridge() -> dict:
    """Explicit candidate map; graph topology is preserved, metric is chosen."""
    weights = (1, 1, 2, 1)  # selected √5 role has coordinate scale 2
    points = []
    for bits in product((0, 1), repeat=4):
        coord = tuple(a * b for a, b in zip(weights, bits, strict=True))
        points.append({"bits": bits, "coord": coord,
                       "norm_squared": norm_sq(coord), "orientation_code": ROLE_CODES[bits[3]]})
    assert len(points) == 16
    assert {r["orientation_code"] for r in points} == {"47", "74"}
    groups = {label: [r for r in points if r["orientation_code"] == label]
              for label in ("47", "74")}
    assert [len(groups[k]) for k in ("47", "74")] == [8, 8]
    assert {r["norm_squared"] for r in groups["47"]} == {0, 1, 2, 4, 5, 6}
    assert {r["norm_squared"] for r in groups["74"]} == {1, 2, 3, 5, 6, 7}
    pairs = [
        (next(r for r in points if r["bits"] == bits + (0,)),
         next(r for r in points if r["bits"] == bits + (1,)))
        for bits in product((0, 1), repeat=3)
    ]
    assert all(b["norm_squared"] - a["norm_squared"] == 1 for a, b in pairs)
    assert sum(r["norm_squared"] == 7 for r in points) == 1
    assert max(sum(bits) for bits in product((0, 1), repeat=4)) == 4

    integer_side_choices = [v for v in product((1, 2), repeat=4) if sum(x*x for x in v) == 7]
    assert len(integer_side_choices) == 4
    assert weights in integer_side_choices
    assert (2, 1, 1, 1) in integer_side_choices
    return {
        "source_sign_states": 16,
        "candidate_metric_map": "b∈{0,1}^4 -> (b0,b1,2*b2,b3)",
        "axis_scale_choice": weights,
        "unit_cube_full_diagonal_squared": 4,
        "stretched_box_full_diagonal_squared": 7,
        "positive_integer_scale_assignments_with_diagonal_squared_7": integer_side_choices,
        "basis_selection_status": "four labelled choices; √5 role as stretched axis is an explicit convention",
        "role_code_fiber_sizes": {label: len(rows) for label, rows in groups.items()},
        "norm_squared_by_code": {label: sorted({r["norm_squared"] for r in rows}) for label, rows in groups.items()},
        "paired_47_to_74_norm_squared_increment": 1,
        "number_of_corresponding_pairs": len(pairs),
        "sqrt7_points_in_selected_16_state_box": [r for r in points if r["norm_squared"] == 7],
        "conclusion": "The sign graph can be embedded in a 2×1×1×1 box by a chosen weighting. 47/74 reports only the last bit (8-to-1); it cannot predict norm²=7. This is a graph embedding with an imposed metric, not a metric implication of the root labels.",
    }


def axis_selection_audit() -> dict:
    """Test the additional 'new channel gets the long edge' convention."""
    rows = []
    for long_axis in range(4):
        scales = tuple(2 if j == long_axis else 1 for j in range(4))
        assert norm_sq(scales) == 7
        deltas = {
            norm_sq(tuple(scales[j] * ((prefix + (1,))[j]) for j in range(4)))
            - norm_sq(tuple(scales[j] * ((prefix + (0,))[j]) for j in range(4)))
            for prefix in product((0, 1), repeat=3)
        }
        assert deltas == {scales[3] ** 2}
        rows.append({"stretched_bit": long_axis, "scales": scales,
                     "full_diagonal_squared": norm_sq(scales),
                     "paired_47_to_74_norm_squared_increment": deltas.pop(),
                     "compatible_with_prior_fixed_S_and_L_steps": scales == (1, 1, 2, 1)})
    assert sum(r["compatible_with_prior_fixed_S_and_L_steps"] for r in rows) == 1
    assert [r["paired_47_to_74_norm_squared_increment"] for r in rows] == [1, 1, 1, 4]
    assert rows[3]["scales"] == (1, 1, 1, 2)
    return {
        "source_channel_order": ["√2", "√3", "√5", "√7"],
        "all_integer_axis_choices": rows,
        "source_distinguishes_fourth_channel": True,
        "additional_hypothesis": "assign long edge to the newly added √7 sign channel",
        "fourth_channel_candidate_scales": rows[3]["scales"],
        "fourth_channel_candidate_47_to_74_increment": 4,
        "prior_third_channel_candidate_scales": rows[2]["scales"],
        "prior_third_channel_candidate_47_to_74_increment": 1,
        "selection_verdict": "The original sign-channel labels identify a fourth bit but do not specify an edge-length rule. Assigning the long edge to that bit is a new convention, not a deduction. It changes the prior typed metric steps and cannot be conflated with their fixed 47/74 records.",
    }


def two_cut_projection_test() -> dict:
    """Compare labelled, calibrated 3D cuts under two stipulated metrics."""
    models = {"A_third_axis_long": (1, 1, 2, 1),
              "B_fourth_axis_long": (1, 1, 1, 2)}
    initial = (1, 1, 0, 0)
    full = (1, 1, 1, 1)
    outcomes = {}
    for name, scales in models.items():
        vertices = {}
        cut_xyz_fibers = {}
        cut_xyw_fibers = {}
        cut_pair_fibers = {}
        for bits in product((0, 1), repeat=4):
            q = tuple(scales[j] * bits[j] for j in range(4))
            xyz, xyw = q[:3], (q[0], q[1], q[3])
            vertices[bits] = q
            cut_xyz_fibers.setdefault(xyz, []).append(bits)
            cut_xyw_fibers.setdefault(xyw, []).append(bits)
            cut_pair_fibers.setdefault((xyz, xyw), []).append(bits)
            # Two cuts overlap in x,y, and together recover all four coordinates.
            assert (xyz[0], xyz[1], xyz[2], xyw[2]) == q
        assert len(cut_xyz_fibers) == len(cut_xyw_fibers) == 8
        assert set(map(len, cut_xyz_fibers.values())) == {2}
        assert set(map(len, cut_xyw_fibers.values())) == {2}
        assert len(cut_pair_fibers) == 16
        assert set(map(len, cut_pair_fibers.values())) == {1}

        histories = {}
        for sequence in ("SL", "LS"):
            bits = list(initial)
            states = [tuple(bits)]
            for op in sequence:
                axis = 2 if op == "S" else 3
                assert bits[axis] == 0
                bits[axis] = 1
                states.append(tuple(bits))
            assert states[-1] == full
            coords = [vertices[v] for v in states]
            histories[sequence] = {
                "bit_states": states,
                "coords": coords,
                "radial_norm_squared": [norm_sq(v) for v in coords],
                "cut_xyz_norm_squared": [norm_sq(v[:3]) for v in coords],
                "cut_xyw_norm_squared": [norm_sq((v[0], v[1], v[3])) for v in coords],
                "orientation_codes": [ROLE_CODES[v[3]] for v in states],
                "step_norm_squared": [scales[2 if op == "S" else 3]**2 for op in sequence],
            }
        tip = vertices[full]
        signature = (norm_sq(tip[:3]), norm_sq((tip[0], tip[1], tip[3])))
        assert sum(signature) - tip[0]**2 - tip[1]**2 == norm_sq(tip) == 7
        outcomes[name] = {
            "scales": scales, "tip": tip, "tip_cut_norm_squared_xyz_xyw": signature,
            "single_cut_fiber_size": 2, "ordered_cut_pair_fiber_size": 1,
            "routes": histories,
        }
    A, B = outcomes.values()
    assert A["tip_cut_norm_squared_xyz_xyw"] == (6, 3)
    assert B["tip_cut_norm_squared_xyz_xyw"] == (3, 6)
    assert A["routes"]["SL"]["radial_norm_squared"] == [2, 6, 7]
    assert B["routes"]["SL"]["radial_norm_squared"] == [2, 3, 7]
    assert A["routes"]["LS"]["radial_norm_squared"] == [2, 3, 7]
    assert B["routes"]["LS"]["radial_norm_squared"] == [2, 6, 7]
    for seq in ("SL", "LS"):
        assert A["routes"][seq]["orientation_codes"] == B["routes"][seq]["orientation_codes"]
    assert sorted(A["tip_cut_norm_squared_xyz_xyw"]) == sorted(B["tip_cut_norm_squared_xyz_xyw"])
    return {
        "fixed_domain": "the same 16 bit states, coordinates scaled by the chosen model",
        "cut_xyz": "(x,y,z), discards w", "cut_xyw": "(x,y,w), discards z",
        "calibration_assumption": "axis identities and Euclidean units are fixed across both labelled cuts",
        "outcomes": outcomes,
        "end_diagonal_norm_squared_alone_distinguishes_models": False,
        "unlabelled_pair_of_cut_norms_distinguishes_models": False,
        "labelled_calibrated_cut_signature_distinguishes_models": True,
        "orientation_47_74_history_alone_distinguishes_models": False,
        "shadow_analogy_scope": "projection information loss only; this is not the optical ray model",
        "inference_boundary": "This synthetic distinction cannot establish which metric the existing NEXAH sources or physical measurements select.",
    }


def route(ops: str) -> dict:
    current = START
    states = [current]
    records = []
    for tick, op in enumerate(ops, start=1):
        nxt = add(current, STEPS[op])
        records.append({
            "tick": tick,
            "operator": op,
            "from": current,
            "to": nxt,
            "step_length_squared": norm_sq(STEPS[op]),
            "observed_3d_from": current[:3],
            "observed_3d_to": nxt[:3],
            "hidden_w_change": nxt[3] - current[3],
        })
        states.append(nxt)
        current = nxt
    return {
        "operator_sequence": ops,
        "states": states,
        "radial_norm_squared": [norm_sq(s) for s in states],
        "e8_integer_coset_after_zero_padding": [in_e8_integer_coset(s) for s in states],
        "projection_3d_history": [s[:3] for s in states],
        "orientation_47_74_history": orientation_history(states, ROLE_CODES),
        "orientation_neutral_history": orientation_history(states, NEUTRAL_CODES),
        "typed_transition_records": records,
        "end_state": current,
        "static_role_code": "4774",
    }


def independent_e8_run() -> dict:
    if not E8_ARCHIVE.is_file():
        raise FileNotFoundError(E8_ARCHIVE)
    sha = hashlib.sha256(E8_ARCHIVE.read_bytes()).hexdigest()
    with tempfile.TemporaryDirectory() as scratch:
        with zipfile.ZipFile(E8_ARCHIVE) as src:
            for entry in src.infolist():
                p = Path(entry.filename)
                if p.is_absolute() or ".." in p.parts:
                    raise ValueError("Unsafe archive path")
            src.extractall(scratch)
        base = Path(scratch) / "E8_REP_03_BENCHMARK"
        cmd = [sys.executable, str(base / "e8_rep_03.py")]
        run = subprocess.run(cmd, text=True, capture_output=True, check=False, timeout=120)
        if run.returncode != 0:
            raise RuntimeError("Original E8 benchmark failed: " + run.stderr[-600:])
        verdict = json.loads(run.stdout.strip().splitlines()[-1])
        data = json.loads((base / "outputs" / "results.json").read_text())
        assert verdict["decision"] == data["decision"] == "PASS"
        assert len(data["assertions"]) == 19
        assert all(item["status"] == "PASS" for item in data["assertions"])
        assert data["e8"]["roots"] == 240
        assert data["e8"]["norm_squared"] == 2
        assert not data["negative_controls"]["generic_projection"]["matches_e8_coxeter_signature"]
        assert all(not x["matches_e8_identity_gate"] for x in data["negative_controls"]["modular_graphs"])
        return {
            "archived_benchmark_sha256": sha,
            "decision": verdict["decision"],
            "passed_assertions": len(data["assertions"]),
            "root_count": data["e8"]["roots"],
            "root_norm_squared": data["e8"]["norm_squared"],
            "generic_projection_rejected": True,
            "modular_graphs_rejected": [x["modulus"] for x in data["negative_controls"]["modular_graphs"]],
        }


def main() -> int:
    a, b = route("SL"), route("LS")
    assert a["end_state"] == b["end_state"] == (1, 1, 2, 1)
    assert a["radial_norm_squared"] == [2, 6, 7]
    assert b["radial_norm_squared"] == [2, 3, 7]
    assert a["projection_3d_history"] != b["projection_3d_history"]
    assert a["orientation_47_74_history"] == ["47", "47", "74"]
    assert b["orientation_47_74_history"] == ["47", "74", "74"]
    assert a["orientation_neutral_history"] == ["A", "A", "B"]
    assert b["orientation_neutral_history"] == ["A", "B", "B"]
    assert a["orientation_47_74_history"][::2] == b["orientation_47_74_history"][::2]
    assert a["static_role_code"] == b["static_role_code"] == "4774"
    assert a["e8_integer_coset_after_zero_padding"] == [True, True, False]
    assert b["e8_integer_coset_after_zero_padding"] == [True, False, False]
    assert norm_sq(a["end_state"]) == 7

    source = (1, 2, 1)
    code_as_lengths = (4, 77, 4)
    assert source[1] * code_as_lengths[0] != code_as_lengths[1] * source[0]
    assert (4, 7, 7, 4) == (4, 7, 7, 4)[::-1]
    assert 74 - 47 == 27 == 3**3

    result = {
        "status": "PASS_BOUNDED",
        "carrier": "Euclidean Z^4; E8 is a separate negative control",
        "routes": {"stretch_then_lift": a, "lift_then_stretch": b},
        "records": {
            "endpoint_distinguishes_order": a["end_state"] != b["end_state"],
            "static_4774_distinguishes_order": a["static_role_code"] != b["static_role_code"],
            "ordered_3d_projections_distinguish_order": a["projection_3d_history"] != b["projection_3d_history"],
            "ordered_47_74_orientation_distinguishes_order": a["orientation_47_74_history"] != b["orientation_47_74_history"],
            "initial_and_final_47_74_only_distinguish_order": a["orientation_47_74_history"][::2] != b["orientation_47_74_history"][::2],
            "arbitrary_distinct_tags_also_distinguish_order": a["orientation_neutral_history"] != b["orientation_neutral_history"],
            "typed_operator_sequence_distinguishes_order": a["operator_sequence"] != b["operator_sequence"],
        },
        "role_code": {
            "split_and_label": [4, 7, 7, 4],
            "grouped_outer_middle_outer": [4, 14, 4],
            "numeric_4_77_4_preserves_1_2_1_ratio": False,
            "inner_halves": [47, 74],
            "inner_half_gap": 27,
            "prespecified_orientation_rule": {"47": "left/blue w=0", "74": "right/gold w=1"},
            "rule_status": "role encoding; no claim about duration, metric length or physical mechanism",
        },
        "e8_reference": independent_e8_run(),
        "prime_window_reference": prime_window_reference(),
        "sign_to_metric_bridge": sign_to_metric_bridge(),
        "axis_selection_audit": axis_selection_audit(),
        "two_cut_projection_test": two_cut_projection_test(),
        "interpretation": "A sequence index is not a measured duration; a 4D Euclidean coordinate is not physical time. No canonical map from the sqrt(7) sign channel to w or 4774 is established.",
    }
    output = ROOT / "RESULTS.json"
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": result["status"],
        "radial_norm_squared": [a["radial_norm_squared"], b["radial_norm_squared"]],
        "distinguishing_records": result["records"],
        "e8_assertions_pass": result["e8_reference"]["passed_assertions"],
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
