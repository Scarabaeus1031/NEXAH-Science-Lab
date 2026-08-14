#!/usr/bin/env python3
"""Frozen EXP-T02 runner. Standard library only; no plotting or network access."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
import os
import platform
import shutil
import sys
import tempfile
from collections import Counter, defaultdict, deque
from pathlib import Path


ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "HASH_MANIFEST.json"
RESULTS = ROOT / "results"
DOMAIN = (-2.0, 2.0)
PRIMARY_N = 201
GRAD_THRESHOLD = 0.020
HESSIAN_TOL = 1e-8
NUM_ATOL = 1e-12
NUM_RTOL = 1e-12
DERIVATIVE_BASELINE_TOL = 1e-10
TIE_TOL = 1e-15
BASE_SEEDS = (("S0", -1.0, -0.7), ("S1", 1.0, -0.7), ("S2", 0.0, 1.0))
MOVED_SEEDS = (("S0", -1.0, -0.7), ("S1", 1.0, -0.7), ("S2", 0.4, 1.2))
ADDED_SEEDS = BASE_SEEDS + (("S3", 0.0, 0.0),)
PAIR_IDS = (
    "CF_A_AMPLITUDE",
    "CF_B_GEOMETRY_GRAPH_COLLISION",
    "CF_C_ADJACENCY_CHANGE",
)
CERT_IDS = (
    "C0_SOURCE_NUMERIC",
    "C1_DERIVATIVE_FIELD",
    "C2_CRITICAL_STRUCTURE",
    "C3_PARTITION_RASTER",
    "C4_BOUNDARY_WEIGHTED",
    "C5_BINARY_ADJACENCY",
    "C6_CONNECTIVITY",
)
EXPECTED = {
    "CF_A_AMPLITUDE": ("CHANGE", "CHANGE", "PRESERVE", "PRESERVE", "PRESERVE", "PRESERVE", "PRESERVE"),
    "CF_B_GEOMETRY_GRAPH_COLLISION": ("CHANGE", "CHANGE", "CHANGE", "CHANGE", "CHANGE", "PRESERVE", "PRESERVE"),
    "CF_C_ADJACENCY_CHANGE": ("CHANGE", "CHANGE", "CHANGE", "CHANGE", "CHANGE", "CHANGE", "PRESERVE"),
}
COLLISION_TARGETS = {
    "CF_A_AMPLITUDE": set(),
    "CF_B_GEOMETRY_GRAPH_COLLISION": {"C5_BINARY_ADJACENCY", "C6_CONNECTIVITY"},
    "CF_C_ADJACENCY_CHANGE": {"C6_CONNECTIVITY"},
}


class PreconditionFailed(RuntimeError):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def canonical_bytes(obj: object) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def verify_frozen_protocol() -> str:
    if not MANIFEST.is_file():
        raise PreconditionFailed("MANIFEST_MISSING", "HASH_MANIFEST.json is absent")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if manifest.get("protocol_status") != "FROZEN_NOT_EXECUTED":
        raise PreconditionFailed("PROTOCOL_NOT_FROZEN", "manifest status is not frozen")
    for record in manifest.get("files", []):
        path = ROOT / record["path"]
        if not path.is_file() or file_sha256(path) != record["sha256"]:
            raise PreconditionFailed("PROTOCOL_HASH_MISMATCH", record["path"])
    bundle_payload = [{"path": r["path"], "sha256": r["sha256"]} for r in manifest["files"]]
    bundle = sha256_bytes(canonical_bytes(bundle_payload))
    if bundle != manifest.get("protocol_bundle_sha256"):
        raise PreconditionFailed("BUNDLE_HASH_MISMATCH", "bundle digest mismatch")
    return bundle


def grid(n: int) -> tuple[list[float], float]:
    lo, hi = DOMAIN
    h = (hi - lo) / (n - 1)
    return [lo + i * h for i in range(n)], h


def normalized_field(n: int, seeds: tuple[tuple[str, float, float], ...]) -> tuple[list[float], float]:
    coords, _ = grid(n)
    raw: list[float] = []
    max_abs = 0.0
    for y in coords:
        for x in coords:
            product = 1.0
            for _, sx, sy in seeds:
                product *= (x - sx) ** 2 + (y - sy) ** 2
            value = -product
            raw.append(value)
            max_abs = max(max_abs, abs(value))
    if not math.isfinite(max_abs) or max_abs == 0.0:
        raise PreconditionFailed("FIELD_NORMALIZATION", "invalid field normalization")
    return [value / max_abs for value in raw], max_abs


def derivative_axis(values: list[float], n: int, h: float, axis: int) -> list[float]:
    out = [0.0] * (n * n)
    for r in range(n):
        for c in range(n):
            i = r * n + c
            k = r if axis == 0 else c
            stride = n if axis == 0 else 1
            if k == 0:
                out[i] = (-3.0 * values[i] + 4.0 * values[i + stride] - values[i + 2 * stride]) / (2.0 * h)
            elif k == n - 1:
                out[i] = (3.0 * values[i] - 4.0 * values[i - stride] + values[i - 2 * stride]) / (2.0 * h)
            else:
                out[i] = (values[i + stride] - values[i - stride]) / (2.0 * h)
    return out


def derivatives(z: list[float], n: int, h: float) -> dict[str, list[float]]:
    dx = derivative_axis(z, n, h, 1)
    dy = derivative_axis(z, n, h, 0)
    dxx = derivative_axis(dx, n, h, 1)
    dyy = derivative_axis(dy, n, h, 0)
    dxy_a = derivative_axis(dx, n, h, 0)
    dxy_b = derivative_axis(dy, n, h, 1)
    dxy = [(a + b) / 2.0 for a, b in zip(dxy_a, dxy_b)]
    result = {"dx": dx, "dy": dy, "dxx": dxx, "dyy": dyy, "dxy": dxy}
    if not all(math.isfinite(v) for arr in result.values() for v in arr):
        raise PreconditionFailed("NONFINITE_DERIVATIVE", "nonfinite derivative")
    return result


def detect_candidates(z: list[float], d: dict[str, list[float]], n: int, threshold: float) -> list[dict[str, object]]:
    coords, h = grid(n)
    candidates: list[dict[str, object]] = []
    for r in range(1, n - 1):
        for c in range(1, n - 1):
            i = r * n + c
            neighbors = [z[(r + dr) * n + c + dc] for dr in (-1, 0, 1) for dc in (-1, 0, 1) if dr or dc]
            if z[i] < max(neighbors) or not any(z[i] > q for q in neighbors):
                continue
            grad = math.hypot(d["dx"][i], d["dy"][i])
            trace = d["dxx"][i] + d["dyy"][i]
            disc = math.sqrt(max(0.0, (d["dxx"][i] - d["dyy"][i]) ** 2 + 4.0 * d["dxy"][i] ** 2))
            eig_hi = (trace + disc) / 2.0
            eig_lo = (trace - disc) / 2.0
            if grad <= threshold and eig_hi < -HESSIAN_TOL:
                candidates.append({
                    "row": r, "col": c, "x": coords[c], "y": coords[r], "class": "MAXIMUM",
                    "gradient_norm": grad, "threshold": threshold, "threshold_margin": threshold - grad,
                    "dx": d["dx"][i], "dy": d["dy"][i], "dxx": d["dxx"][i],
                    "dyy": d["dyy"][i], "dxy": d["dxy"][i],
                    "hessian_eigenvalues": [eig_lo, eig_hi],
                })
    return candidates


def match_candidates(candidates: list[dict[str, object]], seeds: tuple[tuple[str, float, float], ...], h: float) -> list[dict[str, object]]:
    if len(candidates) != len(seeds):
        raise PreconditionFailed("CRITICAL_COUNT", f"expected {len(seeds)}, found {len(candidates)}")
    used: set[int] = set()
    matched: list[dict[str, object]] = []
    for seed_id, sx, sy in seeds:
        options = sorted((math.hypot(float(c["x"]) - sx, float(c["y"]) - sy), i) for i, c in enumerate(candidates) if i not in used)
        if not options or options[0][0] > 1.5 * h:
            raise PreconditionFailed("CRITICAL_SEED_MATCH", seed_id)
        distance, index = options[0]
        used.add(index)
        record = dict(candidates[index])
        record.update({"critical_id": seed_id, "source_seed": [sx, sy], "seed_match_distance": distance})
        matched.append(record)
    return matched


def partition(n: int, critical: list[dict[str, object]]) -> list[str]:
    coords, _ = grid(n)
    ordered = sorted((str(c["critical_id"]), float(c["x"]), float(c["y"])) for c in critical)
    labels: list[str] = []
    for y in coords:
        for x in coords:
            distances = [(x - sx) ** 2 + (y - sy) ** 2 for _, sx, sy in ordered]
            best = min(distances)
            tied = [ordered[i][0] for i, value in enumerate(distances) if abs(value - best) <= TIE_TOL]
            labels.append(min(tied))
    return labels


def graph_from_partition(labels: list[str], n: int) -> dict[str, object]:
    counts: Counter[tuple[str, str]] = Counter()
    nodes = sorted(set(labels))
    for r in range(n):
        for c in range(n):
            a = labels[r * n + c]
            if c + 1 < n:
                b = labels[r * n + c + 1]
                if a != b:
                    counts[tuple(sorted((a, b)))] += 1
            if r + 1 < n:
                b = labels[(r + 1) * n + c]
                if a != b:
                    counts[tuple(sorted((a, b)))] += 1
    edges = sorted(counts)
    return {
        "nodes": nodes,
        "node_to_seed": {node: node for node in nodes},
        "edges": [list(e) for e in edges],
        "boundary_counts": {"|".join(e): counts[e] for e in edges},
    }


def components(graph: dict[str, object]) -> list[list[str]]:
    adjacency = {str(n): set() for n in graph["nodes"]}
    for a, b in graph["edges"]:
        adjacency[a].add(b)
        adjacency[b].add(a)
    result: list[list[str]] = []
    unseen = set(adjacency)
    while unseen:
        start = min(unseen)
        queue = deque([start])
        comp: set[str] = set()
        while queue:
            node = queue.popleft()
            if node in comp:
                continue
            comp.add(node)
            queue.extend(sorted(adjacency[node] - comp))
        unseen -= comp
        result.append(sorted(comp))
    return sorted(result)


def build_representation(n: int, seeds: tuple[tuple[str, float, float], ...], scale: float = 1.0, threshold: float = GRAD_THRESHOLD) -> dict[str, object]:
    z, normalization = normalized_field(n, seeds)
    z = [scale * value for value in z]
    coords, h = grid(n)
    d = derivatives(z, n, h)
    critical = match_candidates(detect_candidates(z, d, n, threshold), seeds, h)
    labels = partition(n, critical)
    graph = graph_from_partition(labels, n)
    return {
        "n": n, "h": h, "coordinates": coords, "seeds": [list(s) for s in seeds],
        "normalization_scalar": normalization, "amplitude_scale": scale, "field": z,
        "derivatives": d, "critical": critical, "partition": labels, "graph": graph,
    }


def rel_l2(a: list[float], b: list[float]) -> float:
    numerator = math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))
    denominator = max(math.sqrt(sum(x * x for x in a)), math.sqrt(sum(y * y for y in b)), sys.float_info.min)
    return numerator / denominator


def numeric_equal(a: list[float], b: list[float]) -> bool:
    return len(a) == len(b) and all(abs(x - y) <= NUM_ATOL + NUM_RTOL * abs(y) for x, y in zip(a, b))


def adjusted_rand(labels_a: list[str], labels_b: list[str]) -> float:
    if len(labels_a) != len(labels_b):
        return 0.0
    contingency: Counter[tuple[str, str]] = Counter(zip(labels_a, labels_b))
    row = Counter(labels_a)
    col = Counter(labels_b)
    comb2 = lambda q: q * (q - 1) // 2
    total_pairs = comb2(len(labels_a))
    if total_pairs == 0:
        return 1.0
    sum_nij = sum(comb2(v) for v in contingency.values())
    sum_ai = sum(comb2(v) for v in row.values())
    sum_bj = sum(comb2(v) for v in col.values())
    expected = sum_ai * sum_bj / total_pairs
    maximum = (sum_ai + sum_bj) / 2.0
    return 1.0 if maximum == expected else (sum_nij - expected) / (maximum - expected)


def graph_isomorphic(a: dict[str, object], b: dict[str, object]) -> bool:
    nodes_a, nodes_b = list(a["nodes"]), list(b["nodes"])
    if len(nodes_a) != len(nodes_b) or len(a["edges"]) != len(b["edges"]):
        return False
    edges_a = {tuple(sorted(e)) for e in a["edges"]}
    edges_b = {tuple(sorted(e)) for e in b["edges"]}
    for perm in itertools.permutations(nodes_b):
        mapping = dict(zip(nodes_a, perm))
        if {tuple(sorted((mapping[x], mapping[y]))) for x, y in edges_a} == edges_b:
            return True
    return False


def critical_signature(rep: dict[str, object]) -> list[list[object]]:
    return [[c["critical_id"], c["class"], c["row"], c["col"], c["x"], c["y"]] for c in rep["critical"]]


def compare_pair(pair_id: str, base: dict[str, object], other: dict[str, object]) -> tuple[list[dict[str, object]], dict[str, object]]:
    derivative_a = [v for name in sorted(base["derivatives"]) for v in base["derivatives"][name]]
    derivative_b = [v for name in sorted(other["derivatives"]) for v in other["derivatives"][name]]
    edge_a = {tuple(e) for e in base["graph"]["edges"]}
    edge_b = {tuple(e) for e in other["graph"]["edges"]}
    all_weight_keys = sorted(set(base["graph"]["boundary_counts"]) | set(other["graph"]["boundary_counts"]))
    weights_a = [float(base["graph"]["boundary_counts"].get(k, 0)) for k in all_weight_keys]
    weights_b = [float(other["graph"]["boundary_counts"].get(k, 0)) for k in all_weight_keys]
    equality = (
        numeric_equal(base["field"], other["field"]),
        numeric_equal(derivative_a, derivative_b),
        critical_signature(base) == critical_signature(other),
        base["partition"] == other["partition"],
        weights_a == weights_b,
        edge_a == edge_b,
        components(base["graph"]) == components(other["graph"]),
    )
    source_rel = rel_l2(base["field"], other["field"])
    derivative_rel = rel_l2(derivative_a, derivative_b)
    mismatch = sum(x != y for x, y in zip(base["partition"], other["partition"])) / len(base["partition"])
    union = edge_a | edge_b
    baselines = {
        "B0": {"relative_l2": source_rel, "max_abs": max(abs(x-y) for x, y in zip(base["field"], other["field"])), "changed": source_rel > NUM_ATOL},
        "B1": {"relative_l2": derivative_rel, "changed": derivative_rel > DERIVATIVE_BASELINE_TOL},
        "B2": {"canonical_records_equal": equality[2], "changed": not equality[2]},
        "B3": {"mismatch_fraction": mismatch, "adjusted_rand": adjusted_rand(base["partition"], other["partition"]), "changed": mismatch > 0.0},
        "B4": {"symmetric_difference": len(edge_a ^ edge_b), "jaccard": 1.0 if not union else len(edge_a & edge_b)/len(union), "changed": edge_a != edge_b},
        "B5": {"isomorphic": graph_isomorphic(base["graph"], other["graph"]), "changed": not graph_isomorphic(base["graph"], other["graph"])},
        "B6": {"normalized_l1": sum(abs(x-y) for x,y in zip(weights_a,weights_b))/max(sum(abs(x) for x in weights_a),sum(abs(y) for y in weights_b),1.0), "changed": weights_a != weights_b},
        "B7": {"components_equal": equality[6], "changed": not equality[6]},
    }
    records: list[dict[str, object]] = []
    for cert_id, equal, expected in zip(CERT_IDS, equality, EXPECTED[pair_id]):
        records.append({
            "source_pair_id": pair_id,
            "certificate_id": cert_id,
            "expected_certificate_relation": expected,
            "observed_certificate_relation": "EQUAL" if equal else "DIFFERENT",
            "expectation_met": equal if expected == "PRESERVE" else not equal,
            "collision": equal and cert_id in COLLISION_TARGETS[pair_id],
            "source_correspondence": "COMPLETE",
        })
    return records, baselines


def validate_primary(reps: dict[str, dict[str, object]]) -> None:
    base = reps["BASE"]
    if base["partition"] == reps["B"]["partition"] or base["graph"]["edges"] != reps["B"]["graph"]["edges"]:
        raise PreconditionFailed("B_COLLISION_CONSTRUCTION", "B must have P!=P' and G=G'")
    if len(reps["C"]["critical"]) != 4 or base["graph"]["edges"] == reps["C"]["graph"]["edges"]:
        raise PreconditionFailed("C_GRAPH_CHANGE_CONSTRUCTION", "C must have four maxima and G!=G'")


def run_sensitivity(primary: dict[str, dict[str, object]]) -> dict[str, object]:
    output: dict[str, object] = {}
    for n, threshold in ((161, 0.020), (241, 0.020), (201, 0.016), (201, 0.024)):
        key = f"n={n};threshold={threshold:.3f}"
        base = build_representation(n, BASE_SEEDS, threshold=threshold)
        b = build_representation(n, MOVED_SEEDS, threshold=threshold)
        c = build_representation(n, ADDED_SEEDS, threshold=threshold)
        output[key] = {
            "candidate_counts": [len(base["critical"]), len(b["critical"]), len(c["critical"])],
            "B_partition_changed": base["partition"] != b["partition"],
            "B_graph_equal": base["graph"]["edges"] == b["graph"]["edges"],
            "C_graph_changed": base["graph"]["edges"] != c["graph"]["edges"],
        }
    order_checks = {}
    for name, rep in primary.items():
        reversed_partition = partition(rep["n"], list(reversed(rep["critical"])))
        reversed_graph = graph_from_partition(reversed_partition, rep["n"])
        order_checks[name] = {
            "partition_equal_after_reverse_insertion": reversed_partition == rep["partition"],
            "graph_equal_after_reverse_insertion": reversed_graph == rep["graph"],
        }
    output["ordering_control"] = order_checks
    return output


def write_json(path: Path, obj: object) -> None:
    path.write_text(json.dumps(obj, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")


def execute(bundle_hash: str) -> None:
    if RESULTS.exists():
        raise PreconditionFailed("RESULTS_ALREADY_EXIST", str(RESULTS))
    reps = {
        "BASE": build_representation(PRIMARY_N, BASE_SEEDS),
        "A": build_representation(PRIMARY_N, BASE_SEEDS, scale=1.25),
        "B": build_representation(PRIMARY_N, MOVED_SEEDS),
        "C": build_representation(PRIMARY_N, ADDED_SEEDS),
    }
    validate_primary(reps)
    pair_map = {PAIR_IDS[0]: reps["A"], PAIR_IDS[1]: reps["B"], PAIR_IDS[2]: reps["C"]}
    cert_records: list[dict[str, object]] = []
    baseline_results: dict[str, object] = {}
    for pair_id, other in pair_map.items():
        records, baselines = compare_pair(pair_id, reps["BASE"], other)
        cert_records.extend(records)
        baseline_results[pair_id] = baselines
    sensitivity = run_sensitivity(reps)
    quantitative_controls = [v for key, v in sensitivity.items() if key != "ordering_control"]
    ordering_ok = all(v["partition_equal_after_reverse_insertion"] and v["graph_equal_after_reverse_insertion"] for v in sensitivity["ordering_control"].values())
    sensitive = (not ordering_ok) or any(not (v["B_partition_changed"] and v["B_graph_equal"] and v["C_graph_changed"]) for v in quantitative_controls)
    baseline_for_certificate = {
        "C0_SOURCE_NUMERIC": "B0", "C1_DERIVATIVE_FIELD": "B1",
        "C2_CRITICAL_STRUCTURE": "B2", "C3_PARTITION_RASTER": "B3",
        "C4_BOUNDARY_WEIGHTED": "B6", "C5_BINARY_ADJACENCY": "B4",
        "C6_CONNECTIVITY": "B7",
    }
    unique_events = []
    false_ledger_events = []
    for record in cert_records:
        baseline_changed = baseline_results[record["source_pair_id"]][baseline_for_certificate[record["certificate_id"]]]["changed"]
        if record["expected_certificate_relation"] == "CHANGE" and record["observed_certificate_relation"] == "DIFFERENT" and not baseline_changed:
            unique_events.append([record["source_pair_id"], record["certificate_id"]])
        if not record["expectation_met"]:
            false_ledger_events.append([record["source_pair_id"], record["certificate_id"]])
    ledger_incremental = bool(unique_events) and not false_ledger_events and not sensitive
    falsifiers = []
    if not unique_events:
        falsifiers.extend(["F1_BASELINES_SUFFICIENT", "F6_LEDGER_REDUNDANT", "F7_ONLY_KNOWN_MANY_TO_ONE_RESTATEMENT"])
    if sensitive:
        falsifiers.append("F2_THRESHOLD_DEPENDENCE")
    rd: dict[str, object] = {}
    for cert_id in CERT_IDS:
        rows = [r for r in cert_records if r["certificate_id"] == cert_id]
        preserve = [r for r in rows if r["expected_certificate_relation"] == "PRESERVE"]
        change = [r for r in rows if r["expected_certificate_relation"] == "CHANGE"]
        rd[cert_id] = {
            "R_numerator": sum(r["observed_certificate_relation"] == "EQUAL" for r in preserve), "R_denominator": len(preserve),
            "R": None if not preserve else sum(r["observed_certificate_relation"] == "EQUAL" for r in preserve)/len(preserve),
            "D_numerator": sum(r["observed_certificate_relation"] == "DIFFERENT" for r in change), "D_denominator": len(change),
            "D": None if not change else sum(r["observed_certificate_relation"] == "DIFFERENT" for r in change)/len(change),
        }
    result = {
        "schema_version": "1.0.0", "protocol_bundle_sha256": bundle_hash, "execution_status": "COMPLETED",
        "environment": {"python": sys.version, "platform": platform.platform(), "float_mant_dig": sys.float_info.mant_dig},
        "fixtures": {k: {"n": v["n"], "h": v["h"], "seeds": v["seeds"], "field_sha256": sha256_bytes(canonical_bytes(v["field"]))} for k,v in reps.items()},
        "certificate_comparisons": cert_records, "baseline_comparisons": baseline_results,
        "collision_ledger_file": "COLLISION_LEDGER.json",
        "correspondence_audit": {"status": "COMPLETE", "all_bijective": True},
        "numerical_controls": sensitivity, "falsifiers_triggered": sorted(falsifiers),
        "robustness_discrimination": rd,
        "incremental_diagnostic_value": "SUPPORTED_BOUNDED" if ledger_incremental else ("INCONCLUSIVE" if unique_events else "NOT_SUPPORTED"),
        "hypothesis_decision": "H1_SUPPORTED_BOUNDED" if ledger_incremental else ("INCONCLUSIVE" if unique_events else "H0_NOT_REJECTED"),
        "claim_boundary": {"new_mathematics": False, "physical_claim": False, "universal_claim": False},
    }
    tmp = Path(tempfile.mkdtemp(prefix=".exp_t02_results_", dir=ROOT))
    try:
        write_json(tmp / "EXP_T02_RESULTS.json", result)
        write_json(tmp / "COLLISION_LEDGER.json", sorted(cert_records, key=lambda r: (r["source_pair_id"], r["certificate_id"])))
        write_json(tmp / "BASELINE_RESULTS.json", baseline_results)
        write_json(tmp / "CERTIFICATE_RESULTS.json", cert_records)
        write_json(tmp / "NUMERICAL_CONTROLS.json", sensitivity)
        write_json(tmp / "SOURCE_INDEX.json", {k: {"coordinates": v["coordinates"], "field_sha256": result["fixtures"][k]["field_sha256"]} for k,v in reps.items()})
        write_json(tmp / "CRITICAL_CANDIDATES.json", {k: v["critical"] for k,v in reps.items()})
        write_json(tmp / "PARTITION.json", {k: {"n": v["n"], "labels": v["partition"]} for k,v in reps.items()})
        write_json(tmp / "GRAPH.json", {k: v["graph"] for k,v in reps.items()})
        write_json(tmp / "CORRESPONDENCE_AUDIT.json", result["correspondence_audit"])
        write_json(tmp / "REPRESENTATIONS.json", {k: {"field": v["field"], "derivatives": v["derivatives"]} for k,v in reps.items()})
        (tmp / "FINAL_STATUS.txt").write_text(
            f"{result['hypothesis_decision']}\nINCREMENTAL_DIAGNOSTIC_VALUE={result['incremental_diagnostic_value']}\n",
            encoding="utf-8",
        )
        files = []
        for path in sorted(tmp.iterdir()):
            files.append({"path": path.name, "sha256": file_sha256(path), "bytes": path.stat().st_size})
        write_json(tmp / "RUN_MANIFEST.json", {"protocol_bundle_sha256": bundle_hash, "files": files})
        os.replace(tmp, RESULTS)
    except Exception:
        shutil.rmtree(tmp, ignore_errors=True)
        raise


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true")
    parser.add_argument("--acknowledge-frozen-protocol", action="store_true")
    args = parser.parse_args()
    if not (args.execute and args.acknowledge_frozen_protocol):
        print("REFUSED: EXP-T02 is frozen but not authorized for execution; both explicit gates are required.", file=sys.stderr)
        return 2
    try:
        bundle = verify_frozen_protocol()
        execute(bundle)
    except PreconditionFailed as exc:
        print(f"PRECONDITION_FAILED_{exc.code}: {exc}", file=sys.stderr)
        return 3
    print(f"COMPLETED: {RESULTS}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
