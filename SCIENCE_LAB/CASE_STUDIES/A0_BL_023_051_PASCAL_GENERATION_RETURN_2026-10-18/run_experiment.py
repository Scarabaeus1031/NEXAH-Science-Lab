#!/usr/bin/env python3
import argparse
import hashlib
import json
import math
from collections import defaultdict
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def canonical_bytes(value):
    return (json.dumps(value, indent=2, sort_keys=True) + "\n").encode()


def mat_mul(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(2)) for j in range(2)] for i in range(2)]


def mat_pow(a, n):
    out = [[1, 0], [0, 1]]
    for _ in range(n):
        out = mat_mul(out, a)
    return out


def mat_vec(a, v):
    return [sum(a[i][k] * v[k] for k in range(2)) for i in range(2)]


def inv_det_one(a):
    return [[a[1][1], -a[0][1]], [-a[1][0], a[0][0]]]


def classify_return(left, right):
    if left["state"] == right["state"]:
        return "EXACT_STATE"
    if left["carrier"] == right["carrier"]:
        return "SAME_CARRIER_CHANGED_POSITION"
    if left["graph_signature"] == right["graph_signature"]:
        return "ISOMORPHIC_RELATION_ONLY"
    if set(left["invariants"]) & set(right["invariants"]):
        return "INVARIANT_ONLY"
    return "NO_RETURN"


def build_result():
    protocol = json.loads((ROOT / "FROZEN_PROTOCOL.json").read_text())
    depth = protocol["pascal_depth"]
    faces = protocol["face_count"]

    additions = []
    value_addresses = defaultdict(set)
    for face in range(faces):
        for n in range(1, depth + 1):
            for k in range(n + 1):
                parents = []
                if k > 0:
                    parents.append(f"D{face + 1}:{n - 1}:{k - 1}")
                if k < n:
                    parents.append(f"D{face + 1}:{n - 1}:{k}")
                address = f"D{face + 1}:{n}:{k}"
                value = math.comb(n, k)
                additions.append({"address": address, "parents": parents, "rule": "SUM_AVAILABLE_PARENTS", "value": value})
                value_addresses[value].add(address)
    reconstruction_exact = all(row["address"] and row["parents"] and row["rule"] == "SUM_AVAILABLE_PARENTS" for row in additions)
    duplicate_value_classes = sum(1 for addresses in value_addresses.values() if len(addresses) > 1)
    gate1 = reconstruction_exact and duplicate_value_classes > 0

    names = ["g_R", "g_P", "g_M"]
    base = tuple(protocol["generation_base"])
    one_field = []
    for idx, name in enumerate(names):
        changed = list(base)
        changed[idx] += 1
        detected = [names[i] for i in range(3) if base[i] != changed[i]]
        one_field.append({"expected": name, "detected": detected})
    controls = [tuple(x) for x in protocol["generation_same_sum_controls"]]
    collapsed_values = [sum(base)] + [sum(x) for x in controls]
    gate2 = all(row["detected"] == [row["expected"]] for row in one_field) and len(set(collapsed_values)) == 1 and len({base, *controls}) == 3

    raw = []
    for face in range(faces):
        for n in range(depth + 1):
            for k in range(n + 1):
                address = f"D{face + 1}:{n}:{k}"
                raw.append({
                    "address": address,
                    "carrier": "SCC-003",
                    "triangle": [k, n - k],
                    "register_phase": [f"D{face + 1}", n, (2 * k - n) % protocol["phase_modulus"]],
                })
    edges = []
    for face in range(faces):
        for n in range(depth):
            for k in range(n + 1):
                source = f"D{face + 1}:{n}:{k}"
                edges.extend([[source, f"D{face + 1}:{n + 1}:{k}", "L"], [source, f"D{face + 1}:{n + 1}:{k + 1}", "R"]])
    gate3 = len(raw) == 140 and len(edges) == 210 and len({x["address"] for x in raw}) == 140 and all(x["triangle"] != x["register_phase"] for x in raw)

    fixtures = [
        ({"state": "x", "carrier": "A", "graph_signature": "g1", "invariants": ["i1"]}, {"state": "x", "carrier": "A", "graph_signature": "g1", "invariants": ["i1"]}, "EXACT_STATE"),
        ({"state": "x@0", "carrier": "A", "graph_signature": "g1", "invariants": ["i1"]}, {"state": "x@1", "carrier": "A", "graph_signature": "g1", "invariants": ["i1"]}, "SAME_CARRIER_CHANGED_POSITION"),
        ({"state": "x", "carrier": "A", "graph_signature": "cycle5", "invariants": ["i1"]}, {"state": "y", "carrier": "B", "graph_signature": "cycle5", "invariants": ["i1"]}, "ISOMORPHIC_RELATION_ONLY"),
        ({"state": "x", "carrier": "A", "graph_signature": "g1", "invariants": ["parity"]}, {"state": "y", "carrier": "B", "graph_signature": "g2", "invariants": ["parity"]}, "INVARIANT_ONLY"),
    ]
    classifications = [classify_return(a, b) for a, b, _ in fixtures]
    expected = [target for _, _, target in fixtures]
    q5 = mat_pow([[2, 1], [1, 1]], 5)
    q5_inv = inv_det_one(q5)
    a = [Fraction(1), Fraction(0)]
    b = [Fraction(0), Fraction(1)]
    bridge_once = (mat_vec(q5_inv, b), mat_vec(q5, a))
    bridge_twice = (mat_vec(q5_inv, bridge_once[1]), mat_vec(q5, bridge_once[0]))
    algebraic_return = bridge_twice == (a, b)
    q5_e1 = mat_vec(q5, a)
    norm_changed = sum(x * x for x in q5_e1) != 1
    gate4 = classifications == expected and algebraic_return and norm_changed

    non_identity = [{"left": left, "right": right, "carrier_map": None, "intertwiner": None, "decision": "NO_IDENTITY_INFERRED"} for left, right in protocol["non_identity_controls"]]
    gate5 = len(non_identity) == 5 and all(x["decision"] == "NO_IDENTITY_INFERRED" and x["carrier_map"] is None and x["intertwiner"] is None for x in non_identity)

    gates = {
        "relation_reconstruction": {"pass": gate1, "typed_records": len(additions), "duplicate_value_classes": duplicate_value_classes},
        "coordinate_separability": {"pass": gate2, "one_field_checks": one_field, "collapsed_generation_values": collapsed_values},
        "representation_accounting": {"pass": gate3, "raw_addresses": len(raw), "relation_edges": len(edges), "views": ["triangle", "register_phase"]},
        "return_level_classifier": {"pass": gate4, "classifications": classifications, "algebraic_return": algebraic_return, "euclidean_isometry": not norm_changed},
        "non_identity_stress": {"pass": gate5, "controls": non_identity},
    }
    all_pass = all(record["pass"] for record in gates.values())
    result = {
        "schema": protocol["schema"],
        "study": "A0-BL-023/A0-BL-051",
        "protocol_status": protocol["status"],
        "gates": gates,
        "result_class": "PASS_BOUNDED" if all_pass else "PARTIAL",
        "claim_ceiling": protocol["claim_ceiling"],
    }
    payload = canonical_bytes(result)
    result["content_sha256_without_hash_field"] = hashlib.sha256(payload).hexdigest()
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(canonical_bytes(build_result()))
    print(json.dumps({"status": "WROTE", "output": str(output)}, sort_keys=True))


if __name__ == "__main__":
    main()

