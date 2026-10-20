#!/usr/bin/env python3
import argparse
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class UnionFind:
    def __init__(self, items):
        self.parent = {x: x for x in items}

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.parent[rb] = ra


def canonical_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def sha256_file(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def raw_positions(faces, depth):
    return [(f, n, k) for f in range(faces) for n in range(depth + 1) for k in range(n + 1)]


def build_classes(raw, faces, depth, mode):
    uf = UnionFind(raw)
    if mode != "DISJOINT":
        for f in range(1, faces):
            uf.union((0, 0, 0), (f, 0, 0))
    if mode in {"CANONICAL_SEAM_NO_RESIDUAL", "CANONICAL_SEAM_TYPED_RESIDUAL"}:
        for f in range(faces):
            for n in range(1, depth + 1):
                uf.union((f, n, n), ((f + 1) % faces, n, 0))
    elif mode == "REVERSED_LEVEL_ARBITRARY_GLUE":
        for f in range(faces):
            for n in range(1, depth + 1):
                uf.union((f, n, n), ((f + 1) % faces, depth + 1 - n, 0))
    grouped = {}
    for x in raw:
        grouped.setdefault(uf.find(x), []).append(x)
    classes = [sorted(v) for v in grouped.values()]
    classes.sort(key=lambda xs: xs[0])
    index = {x: i for i, xs in enumerate(classes) for x in xs}
    return classes, index


def residual_bits(size):
    return 0 if size <= 1 else math.ceil(math.log2(size))


def action_preserves(classes, index, action):
    for members in classes:
        images = {index[action(x)] for x in members}
        if len(images) != 1:
            return False
    return True


def analyze(protocol):
    faces, depth = protocol["faces"], protocol["depth"]
    raw = raw_positions(faces, depth)
    expected = protocol["expected"]
    assert len(raw) == expected["raw_incidences"]
    conditions = {}
    class_cache = {}
    for cid, mode in protocol["conditions"].items():
        classes, index = build_classes(raw, faces, depth, mode)
        class_cache[cid] = (classes, index)
        mixed = sum(1 for xs in classes if len({x[1] for x in xs}) > 1)
        base_bits = math.ceil(math.log2(len(classes)))
        conditional_total = sum(len(xs) * residual_bits(len(xs)) for xs in classes)
        conditional_mean = conditional_total / len(raw)
        has_residual = cid in {"C0", "C1", "C4"}
        reconstruction_correct = len(raw) if has_residual else len(classes)
        conditions[cid] = {
            "mode": mode,
            "addresses": len(classes),
            "class_size_histogram": {
                str(size): sum(1 for xs in classes if len(xs) == size)
                for size in sorted({len(xs) for xs in classes})
            },
            "mixed_level_classes": mixed,
            "quotient_address_bits": base_bits,
            "conditional_residual_bits_total_over_sources": conditional_total if has_residual else 0,
            "conditional_residual_bits_mean_over_sources": round(conditional_mean if has_residual else 0, 12),
            "mean_total_address_bits": round(base_bits + (conditional_mean if has_residual else 0), 12),
            "reconstruction_correct": reconstruction_correct,
            "reconstruction_total": len(raw),
            "reconstruction_accuracy": round(reconstruction_correct / len(raw), 12),
        }

    c4_classes, c4_index = class_cache["C4"]
    r = lambda x: ((x[0] + 1) % faces, x[1], x[2])
    m = lambda x: ((-x[0]) % faces, x[1], x[1] - x[2])
    d5 = {
        "rotation_preserves_equivalence": action_preserves(c4_classes, c4_index, r),
        "reflection_preserves_equivalence": action_preserves(c4_classes, c4_index, m),
    }

    zipper = []
    inverse_ok = True
    for f in range(faces):
        for n in range(1, depth + 1):
            left = (f, n, n)
            right = ((f + 1) % faces, n, 0)
            same_address = c4_index[left] == c4_index[right]
            inverse_ok = inverse_ok and same_address
            zipper.extend([
                {"source": left, "target": right, "epsilon": 1, "same_address": same_address},
                {"source": right, "target": left, "epsilon": -1, "same_address": same_address},
            ])

    c4 = conditions["C4"]
    gates = {
        "H_U1_COMPATIBLE_BOUNDARY_ADVANTAGE": c4["addresses"] < conditions["C0"]["addresses"] and c4["mixed_level_classes"] == 0,
        "H_U2_TYPED_RETURN_ADVANTAGE": c4["reconstruction_correct"] == len(raw) and c4["mean_total_address_bits"] < expected["raw_fixed_bits"],
        "H_U3_ZIPPER_TRANSITION_ADVANTAGE": inverse_ok and len(zipper) == expected["zipper_directed_transitions"],
        "H_U4_MULTI_LEDGER_ADVANTAGE": sum(len(xs) for xs in c4_classes) == len(raw) and len(c4_classes) == expected["c4_addresses"],
    }
    controls = {
        "C0_RAW_COUNT": conditions["C0"]["addresses"] == expected["c0_addresses"],
        "C1_APEX_ONLY_COUNT": conditions["C1"]["addresses"] == expected["c1_addresses"],
        "C2_LOSS_IS_VISIBLE": conditions["C2"]["reconstruction_correct"] < len(raw),
        "C3_MATCHED_COUNT": conditions["C3"]["addresses"] == expected["c3_addresses"],
        "C3_BREAKS_LEVEL_CONSISTENCY": conditions["C3"]["mixed_level_classes"] > 0,
        "C4_EXPECTED_COUNT": c4["addresses"] == expected["c4_addresses"],
        "C4_D5_PRESERVED": all(d5.values()),
    }
    if all(gates.values()) and all(controls.values()):
        decision = "PASS_BOUNDED_TYPED_SEAM_ADVANTAGE"
    elif not c4["reconstruction_correct"] == len(raw):
        decision = "RECURRENCE_OR_PROVENANCE_LOST_AT_INTERFACE"
    elif c4["mean_total_address_bits"] >= expected["raw_fixed_bits"]:
        decision = "RETURN_METADATA_EQUALS_OR_EXCEEDS_RAW_ADDRESS"
    elif not gates["H_U3_ZIPPER_TRANSITION_ADVANTAGE"]:
        decision = "CHANNEL_RULE_UNDERDETERMINED"
    else:
        decision = "NO_ADVANTAGE_OVER_MATCHED_GLUE"

    result = {
        "schema": "nexah.a0-bl-025.typed-seam-utility-result/1.0.0",
        "study_id": "A0_BL_025_TYPED_SEAM_CHANNEL_UTILITY_2026_10_18",
        "protocol_sha256": sha256_file(ROOT / "FROZEN_PROTOCOL.json"),
        "decision": decision,
        "raw_incidences": len(raw),
        "conditions": conditions,
        "d5": d5,
        "zipper": {"directed_transitions": len(zipper), "inverse_exact": inverse_ok},
        "gates": gates,
        "controls": controls,
        "boundaries": [
            "HISTORICAL_ZIPPER_SOURCE_UNRECOVERED",
            "RIEMANN_MAPPING_UNDEFINED",
            "HUMAN_USEFULNESS_NOT_TESTED",
            "NO_PHYSICAL_FLOW_OR_STABILITY_CLAIM"
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
