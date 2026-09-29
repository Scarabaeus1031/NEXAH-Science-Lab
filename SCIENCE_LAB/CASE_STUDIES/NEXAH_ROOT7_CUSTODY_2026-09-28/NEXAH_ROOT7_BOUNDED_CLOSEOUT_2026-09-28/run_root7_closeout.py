#!/usr/bin/env python3
"""Execute the locked NEXAH Root7 bounded closeout using stdlib only."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from itertools import product
from math import hypot
from pathlib import Path


PACKAGE = Path(__file__).resolve().parent
DEFAULT_SOURCE = Path("/Users/tho2020/Desktop/00_INCOMING/Nexah_Root7")
PREREG_SHA256 = "92fa0913d151b11457bdbc78b4a544e2eee27a32259eb2d3559c3d49e8c2e360"
MANIFEST_SHA256 = "1cb1c385775ba99e696ebee2b1e3b3fa7e460dbfdaff2d0bcea5290ce3d82a72"


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def canonical_bytes(value: object) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True,
                       separators=(",", ":")) + "\n").encode("utf-8")


def verify_lock_and_sources(source_root: Path) -> dict:
    prereg = PACKAGE / "00_PREREGISTRATION.md"
    manifest = PACKAGE / "01_SOURCE_MANIFEST.sha256"
    assert sha256_file(prereg) == PREREG_SHA256
    assert sha256_file(manifest) == MANIFEST_SHA256
    checked = []
    for line in manifest.read_text(encoding="utf-8").splitlines():
        expected, relative = line.split("  ", 1)
        source = source_root / relative
        actual = sha256_file(source)
        assert actual == expected, (relative, expected, actual)
        checked.append({"relative_path": relative, "sha256": actual})
    return {
        "preregistration_sha256": PREREG_SHA256,
        "source_manifest_sha256": MANIFEST_SHA256,
        "source_files_verified": len(checked),
        "sources": checked,
    }


def norm2(point: tuple[int, ...]) -> int:
    return sum(x * x for x in point)


def positive_unit_step(a: tuple[int, ...], b: tuple[int, ...]) -> bool:
    delta = [y - x for x, y in zip(a, b, strict=True)]
    return sorted(delta) == [0, 0, 0, 1]


def test_1_axis_identifiability() -> dict:
    channels = ("sqrt2/x", "sqrt3/y", "sqrt5/z", "sqrt7/w")
    candidates = []
    for long_axis, channel in enumerate(channels):
        tip = tuple(2 if i == long_axis else 1 for i in range(4))
        vertices = list(product(*(range(k + 1) for k in tip)))
        zero = (0, 0, 0, 0)
        paths = []
        for q1 in vertices:
            if norm2(q1) != 3:
                continue
            for q2 in vertices:
                if (norm2(q2) == 4 and positive_unit_step(q1, q2)
                        and positive_unit_step(q2, tip)):
                    paths.append((zero, q1, q2, tip))
        middle_w = [p for p in paths if p[2][3] - p[1][3] == 1]
        # Under the old endpoint code, a stretched w-axis has terminal 74 at
        # w=2, so its interior w=1 transition may not be relabelled as 74.
        endpoint_code_preserving = middle_w if long_axis != 3 else []
        candidates.append({
            "channel": channel,
            "scale_vector": tip,
            "lattice_points": len(vertices),
            "radial_3_1_3_paths": len(paths),
            "middle_w_paths": len(middle_w),
            "endpoint_code_preserving_middle_47_74_paths": len(endpoint_code_preserving),
            "survives": bool(endpoint_code_preserving),
        })
    survivors = [row["channel"] for row in candidates if row["survives"]]
    if len(survivors) == 1:
        decision = "SUPPORTED_UNIQUE"
    elif survivors:
        decision = "NON_IDENTIFIABLE"
    else:
        decision = "REFUTED"
    assert [r["radial_3_1_3_paths"] for r in candidates] == [4, 4, 4, 4]
    assert survivors == ["sqrt2/x", "sqrt3/y", "sqrt5/z"]
    return {
        "test": "T1_AXIS_313_IDENTIFIABILITY",
        "decision": decision,
        "survivor_count": len(survivors),
        "survivors": survivors,
        "candidates": candidates,
        "claim_boundary": "The constraints exclude a stretched w axis but do not uniquely select x, y, or z.",
    }


START = (1, 1, 0, 0)
STEPS = {"S": (0, 0, 2, 0), "L": (0, 0, 0, 1)}


def add(a: tuple[int, ...], b: tuple[int, ...]) -> tuple[int, ...]:
    return tuple(x + y for x, y in zip(a, b, strict=True))


def route(ops: str) -> dict:
    state = START
    states = [state]
    for op in ops:
        state = add(state, STEPS[op])
        states.append(state)
    return {
        "ops": ops,
        "states": states,
        "endpoint": state,
        "static_4774": "4774",
        "endpoint_roles": ["47" if states[0][3] == 0 else "74",
                           "47" if states[-1][3] == 0 else "74"],
        "ordered_projection_3d": [s[:3] for s in states],
        "ordered_roles": ["47" if s[3] == 0 else "74" for s in states],
        "typed_operator_sequence": list(ops),
    }


def exact_synthetic_gate(gate_input: dict) -> bool:
    return (gate_input["phase_deg"] == 0
            and gate_input["tilt_deg"] == 0
            and gate_input["error"] == 0.0
            and gate_input["open_gap"]
            and gate_input["slow"])


def test_2_route_information() -> dict:
    routes = {name: route(name) for name in ("SL", "LS")}
    observer_fields = {
        "endpoint_only": "endpoint",
        "static_4774": "static_4774",
        "initial_final_roles": "endpoint_roles",
        "ordered_3d_projection": "ordered_projection_3d",
        "ordered_47_74_history": "ordered_roles",
        "typed_operator_sequence": "typed_operator_sequence",
    }
    observer_results = {}
    for name, field in observer_fields.items():
        left = routes["SL"][field]
        right = routes["LS"][field]
        observer_results[name] = {
            "separates_routes": left != right,
            "SL": left,
            "LS": right,
        }

    aligned = {"phase_deg": 0, "tilt_deg": 0, "error": 0.0,
               "open_gap": True, "slow": True}
    misaligned = {"phase_deg": 1, "tilt_deg": 0, "error": 0.0,
                  "open_gap": True, "slow": True}
    gap_closed = {"phase_deg": 0, "tilt_deg": 0, "error": 0.0,
                  "open_gap": False, "slow": True}
    too_fast = {"phase_deg": 0, "tilt_deg": 0, "error": 0.0,
                "open_gap": True, "slow": False}
    scenarios = {
        "both_sites_aligned": {"tip": aligned, "inner_hinge": aligned},
        "only_tip_aligned": {"tip": aligned, "inner_hinge": misaligned},
        "only_inner_hinge_aligned": {"tip": misaligned, "inner_hinge": aligned},
        "gap_closed_at_both": {"tip": gap_closed, "inner_hinge": gap_closed},
        "too_fast_at_both": {"tip": too_fast, "inner_hinge": too_fast},
    }
    gate_results = {}
    for name, inputs in scenarios.items():
        gate_results[name] = {
            "inputs": inputs,
            "direct_first": exact_synthetic_gate(inputs["tip"]),
            "inner_hinge": exact_synthetic_gate(inputs["inner_hinge"]),
        }
    assert gate_results == {
        "both_sites_aligned": {"inputs": scenarios["both_sites_aligned"],
                               "direct_first": True, "inner_hinge": True},
        "only_tip_aligned": {"inputs": scenarios["only_tip_aligned"],
                             "direct_first": True, "inner_hinge": False},
        "only_inner_hinge_aligned": {"inputs": scenarios["only_inner_hinge_aligned"],
                                     "direct_first": False, "inner_hinge": True},
        "gap_closed_at_both": {"inputs": scenarios["gap_closed_at_both"],
                               "direct_first": False, "inner_hinge": False},
        "too_fast_at_both": {"inputs": scenarios["too_fast_at_both"],
                             "direct_first": False, "inner_hinge": False},
    }

    payload_fibers: dict[tuple[int, int], list[int]] = defaultdict(list)
    for payload in range(-1000, 1001):
        residue = (7 * payload * payload) % 11
        hits = [k for k in range(11) if (7801 + 8 * k) % 11 == residue]
        assert len(hits) == 1
        payload_fibers[(residue, hits[0])].append(payload)
    residues = sorted({key[0] for key in payload_fibers})
    assert residues == [0, 2, 6, 7, 8, 10]
    assert routes["SL"]["endpoint"] == routes["LS"]["endpoint"]
    assert not observer_results["endpoint_only"]["separates_routes"]
    assert observer_results["typed_operator_sequence"]["separates_routes"]
    decision = "ENDPOINT_INSUFFICIENT_HISTORY_REQUIRED"
    payload_decision = "MANY_TO_ONE_CLASSIFIER"
    return {
        "test": "T2_ROUTE_404_INFORMATION_BOUNDARY",
        "decision": decision,
        "routes": routes,
        "observer_results": observer_results,
        "synthetic_404_gate_scenarios": gate_results,
        "gate_binding_status": "MODEL_DEPENDENT_NOT_SOURCE_BOUND",
        "payload_control": {
            "domain": [-1000, 1000],
            "records": len(payload_fibers),
            "reachable_residues": residues,
            "largest_fiber_size": max(map(len, payload_fibers.values())),
            "sign_collision_example": [-947, 947],
            "sign_collision_record": [
                (7 * 947 * 947) % 11,
                next(k for k in range(11) if (7801 + 8 * k) % 11 == (7 * 947 * 947) % 11),
            ],
            "decision": payload_decision,
        },
        "claim_boundary": "A full typed history separates the two routes; endpoint, static label, and residue/index do not reconstruct history or signed payload.",
    }


def legacy_gate(a: int, b: int) -> bool:
    phase = b - a
    mean = (a + b) / 2
    metric = hypot(4.2 * phase, 6.2 * mean)
    return abs(phase) < 8 and abs(mean) < 6 and metric < 34


def centered_1(residue: int) -> tuple[int, int]:
    d = residue if residue <= 5 else residue - 11
    return -d, d


def shifted_4(residue: int) -> tuple[int, int]:
    d = residue - 5
    return -4 * d, 4 * d


def test_3_bridge_identification() -> dict:
    candidates = {}
    for name, function in (("F_centered_1", centered_1), ("F_shifted_4", shifted_4)):
        rows = []
        for residue in range(11):
            a, b = function(residue)
            rows.append({"residue": residue, "a": a, "b": b,
                         "gate_404": legacy_gate(a, b)})
        candidates[name] = {
            "rows": rows,
            "gate_residues": [row["residue"] for row in rows if row["gate_404"]],
        }
    assert candidates["F_centered_1"]["gate_residues"] == [0, 1, 2, 3, 8, 9, 10]
    assert candidates["F_shifted_4"]["gate_residues"] == [5]

    arrows = {
        "scn_residue_to_regulator_pair": {
            "source_defined_candidates": 2,
            "unique": False,
            "typed": True,
            "unit_bearing": False,
        },
        "residue_or_regulator_to_root7_4d_state": {
            "source_defined_candidates": 0,
            "unique": False,
            "typed": False,
            "unit_bearing": False,
        },
        "residue_or_regulator_to_7_6_13_angle_state": {
            "source_defined_candidates": 0,
            "unique": False,
            "typed": False,
            "unit_bearing": False,
        },
        "regulator_or_angle_to_named_gate_pair_and_404": {
            "source_defined_candidates": 1,
            "unique": True,
            "typed": False,
            "unit_bearing": False,
        },
    }
    all_complete = all(row["source_defined_candidates"] == 1 and row["unique"]
                       and row["typed"] and row["unit_bearing"]
                       for row in arrows.values())
    held_out_prediction = False
    decision = "IDENTIFIED" if all_complete and held_out_prediction else "NOT_IDENTIFIED"
    assert decision == "NOT_IDENTIFIED"
    return {
        "test": "T3_SOURCE_BOUND_BRIDGE_IDENTIFICATION",
        "decision": decision,
        "admitted_candidates": candidates,
        "required_arrow_audit": arrows,
        "complete_unique_typed_unit_contract": all_complete,
        "independent_held_out_prediction_present": held_out_prediction,
        "claim_boundary": "No fitted replacement was introduced; the source contains incompatible SCN adapters and lacks required 4D and angle arrows.",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    provenance = verify_lock_and_sources(args.source_root)
    scientific = {
        "experiment_id": "NEXAH_ROOT7_BOUNDED_CLOSEOUT_2026-09-28",
        "source_manifest_sha256": MANIFEST_SHA256,
        "prior_result_exposure": True,
        "tests": [
            test_1_axis_identifiability(),
            test_2_route_information(),
            test_3_bridge_identification(),
        ],
        "overall_closeout": "CLOSED_BOUNDED",
        "core_promotion": "NO",
        "physical_or_e8_identity": "NOT_ESTABLISHED",
    }
    scientific_hash = sha256_bytes(canonical_bytes(scientific))
    result = {
        "provenance": provenance,
        "scientific_result": scientific,
        "scientific_result_sha256": scientific_hash,
    }
    args.output_dir.mkdir(parents=True, exist_ok=False)
    (args.output_dir / "results.json").write_text(
        json.dumps(result, ensure_ascii=False, sort_keys=True, indent=2) + "\n",
        encoding="utf-8",
    )
    (args.output_dir / "scientific_result.sha256").write_text(
        scientific_hash + "  scientific_result\n", encoding="utf-8"
    )
    print(json.dumps({
        "decisions": [test["decision"] for test in scientific["tests"]],
        "overall_closeout": scientific["overall_closeout"],
        "scientific_result_sha256": scientific_hash,
    }, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
