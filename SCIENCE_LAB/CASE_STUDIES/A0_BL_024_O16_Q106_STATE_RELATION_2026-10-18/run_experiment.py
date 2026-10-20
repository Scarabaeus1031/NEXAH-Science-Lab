#!/usr/bin/env python3
import argparse
import csv
import hashlib
import json
import math
import random
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCIENCE_REPO = ROOT.parents[2]
SOURCE = SCIENCE_REPO / "RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS" / "AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01" / "56_SCC_003_EXTERNAL_REVIEW_PACKET_2026-10-13" / "reference" / "artifacts"


def canonical_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def sha256_file(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_nodes():
    with (SOURCE / "nodes.csv").open(newline="") as handle:
        return list(csv.DictReader(handle))


def audit_map(nodes, assignments):
    fibers = defaultdict(list)
    for row, state in zip(nodes, assignments):
        fibers[state].append(int(row["index"]))
    recovered = []
    residual_bits_total = 0
    for row, state in zip(nodes, assignments):
        q = int(row["index"])
        fiber = sorted(fibers[state])
        rank = fiber.index(q)
        recovered.append(fiber[rank])
        residual_bits_total += 0 if len(fiber) <= 1 else math.ceil(math.log2(len(fiber)))
    histogram = Counter(len(v) for v in fibers.values())
    representatives = {str(state): min(v) for state, v in sorted(fibers.items())}
    return {
        "states_reached": len(fibers),
        "fiber_size_histogram": {str(k): histogram[k] for k in sorted(histogram)},
        "collision_count": sum(len(v) - 1 for v in fibers.values()),
        "maximum_fiber_size": max(map(len, fibers.values())),
        "conditional_residual_bits_total": residual_bits_total,
        "conditional_residual_bits_mean": round(residual_bits_total / len(nodes), 12),
        "exact_return_count": sum(a == b for a, b in zip(recovered, range(len(nodes)))),
        "representative_lift_size": len(representatives),
        "representative_lift_surjective": len(representatives) == len(nodes),
        "representatives": representatives,
    }


def analyze(protocol):
    nodes = load_nodes()
    autos = json.loads((SOURCE / "automorphisms.json").read_text())
    p1 = [int(row["index"]) % 16 for row in nodes]
    p2 = []
    for row in nodes:
        direction = int(row["level_n"]) % 4
        spin = 1 if row["kind"] == "interior" else 0
        source = row["face"] or row["seam"] or "0"
        elevator = int(source) % 2
        p2.append(direction + 4 * spin + 8 * elevator)
    order = list(range(len(nodes)))
    random.Random(protocol["shuffle_seed"]).shuffle(order)
    shuffled = [0] * len(nodes)
    for rank, q in enumerate(order):
        shuffled[q] = rank % 16

    maps = {
        "P1_BALANCED_INDEX": audit_map(nodes, p1),
        "P2_TYPED_ATTRIBUTE": audit_map(nodes, p2),
        "C1_FIXED_SHUFFLED_INDEX": audit_map(nodes, shuffled),
    }
    rotation = next(a for a in autos["actions"] if a["name"] == "r^1")
    assignment_difference = sum(a != b for a, b in zip(p1, shuffled))
    gates = {
        "source_integrity": len(nodes) == protocol["q106"]["expected_nodes"] and rotation["turns"] == 1 and autos["order"] == 10,
        "cardinality_obstruction": len(nodes) > protocol["o16"]["cardinality"],
        "collision_accounting": all(maps[name]["collision_count"] == 90 for name in ("P1_BALANCED_INDEX", "P2_TYPED_ATTRIBUTE")),
        "conditional_residual_exact_return": all(maps[name]["exact_return_count"] == 106 for name in ("P1_BALANCED_INDEX", "P2_TYPED_ATTRIBUTE")),
        "representative_lift_not_surjective": all(not maps[name]["representative_lift_surjective"] for name in ("P1_BALANCED_INDEX", "P2_TYPED_ATTRIBUTE")),
        "matched_shuffle_nonselection": maps["P1_BALANCED_INDEX"]["fiber_size_histogram"] == maps["C1_FIXED_SHUFFLED_INDEX"]["fiber_size_histogram"] and assignment_difference > 0,
        "c4_c5_nontrivial_rotation_intertwiner_impossible": math.gcd(4, protocol["q106"]["expected_rotation_order"]) == 1,
    }
    if all(gates.values()):
        decision = "INFORMATION_LOST_RESIDUAL_SUFFICIENT_AND_NO_CANONICAL_MAP"
    elif not gates["source_integrity"] or not gates["conditional_residual_exact_return"]:
        decision = "INVALID_DESIGN"
    else:
        decision = "PARTIAL"
    result = {
        "schema": "nexah.a0-bl-024.o16-q106-state-relation-result/1.0.0",
        "study_id": "A0_BL_024_O16_Q106_STATE_RELATION_2026_10_18",
        "protocol_sha256": sha256_file(ROOT / "FROZEN_PROTOCOL.json"),
        "decision": decision,
        "carriers": {"o16_states": 16, "q106_nodes": len(nodes), "bijection_possible": False},
        "maps": maps,
        "shuffle_assignment_difference": assignment_difference,
        "rotation_order_control": {"o16_cyclic_order": 4, "q106_rotation_order": 5, "gcd": math.gcd(4, 5), "nontrivial_homomorphism_possible": False},
        "gates": gates,
        "boundaries": [
            "CANDIDATE_MAPS_NOT_CANONICAL",
            "NO_O16_Q106_IDENTITY",
            "NO_GEOMETRIC_OR_PHYSICAL_ORIENTATION_MECHANISM",
            "NO_UTILITY_NOVELTY_OR_PUBLICATION_CLAIM"
        ]
    }
    payload = canonical_json(result)
    result["result_sha256"] = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    protocol = json.loads((ROOT / "FROZEN_PROTOCOL.json").read_text())
    result = analyze(protocol)
    output = ROOT / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"decision": result["decision"], "result_sha256": result["result_sha256"]}, sort_keys=True))


if __name__ == "__main__":
    main()
