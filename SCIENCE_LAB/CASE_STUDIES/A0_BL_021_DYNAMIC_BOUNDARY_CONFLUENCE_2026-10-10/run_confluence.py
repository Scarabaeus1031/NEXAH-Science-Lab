#!/usr/bin/env python3
"""A0-BL-021: exhaustive typed confluence test for two Pascal-face extensions."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import math
from collections import Counter, defaultdict, deque
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Sequence, Tuple


DEPTH = 6
BASELINE_FACES = 5
EXTENSION_STEPS = 2

Corner = Tuple[int, int, int]  # A, L, R coarse vertex ids
Raw = Tuple[int, int, int]     # face, n, k


class UnionFind:
    def __init__(self, items: Iterable[Raw]):
        self.parent = {item: item for item in items}

    def find(self, item: Raw) -> Raw:
        parent = self.parent[item]
        if parent != item:
            self.parent[item] = self.find(parent)
        return self.parent[item]

    def union(self, left: Raw, right: Raw) -> None:
        a, b = self.find(left), self.find(right)
        if a != b:
            self.parent[max(a, b)] = min(a, b)


@dataclass
class State:
    faces: List[Corner]
    boundary: List[int]
    next_vertex: int
    corner_overrides: Dict[int, str]

    def clone(self) -> "State":
        return State(list(self.faces), list(self.boundary), self.next_vertex, dict(self.corner_overrides))


def local_sides(face: Corner) -> List[Tuple[str, int, int, List[Tuple[int, int]]]]:
    a, left, right = face
    return [
        ("radial", a, left, [(n, 0) for n in range(DEPTH + 1)]),
        ("base", left, right, [(DEPTH, k) for k in range(DEPTH + 1)]),
        ("radial", right, a, [(n, n) for n in range(DEPTH, -1, -1)]),
    ]


def boundary_edges(state: State) -> List[Tuple[int, int]]:
    b = state.boundary
    return [(b[i], b[(i + 1) % len(b)]) for i in range(len(b))]


def edge_profile(state: State, u: int, v: int) -> str:
    matches = []
    for face in state.faces:
        for profile, start, end, _ in local_sides(face):
            if {start, end} == {u, v}:
                matches.append(profile)
    if len(matches) != 1:
        raise ValueError("boundary edge must have exactly one incident face")
    return matches[0]


def compatible_sides(profile: str) -> Tuple[str, ...]:
    if profile == "base":
        return ("base",)
    if profile == "radial":
        return ("left-radial", "right-radial")
    raise ValueError("unknown edge profile")


def attach(state: State, edge_index: int, fresh_side: str) -> Tuple[State, dict]:
    result = state.clone()
    n = len(result.boundary)
    u = result.boundary[edge_index]
    v = result.boundary[(edge_index + 1) % n]
    profile = edge_profile(result, u, v)
    if fresh_side not in compatible_sides(profile):
        raise ValueError("weight-incompatible side selection")

    w = result.next_vertex
    result.next_vertex += 1
    if fresh_side == "base":
        face = (w, v, u)          # local B v->u glues against boundary u->v
    elif fresh_side == "left-radial":
        face = (v, u, w)          # local L v->u
    else:
        face = (u, w, v)          # local R v->u
    result.faces.append(face)
    result.boundary.insert(edge_index + 1, w)

    return result, {
        "boundary_edge_before": [u, v],
        "boundary_edge_index": edge_index,
        "edge_profile": profile,
        "fresh_side": fresh_side,
        "new_vertex": w,
    }


def build_baseline() -> Tuple[State, List[dict]]:
    state = State(faces=[(0, 1, 2)], boundary=[0, 1, 2], next_vertex=3, corner_overrides={})
    history = []
    for _ in range(BASELINE_FACES - 1):
        edges = boundary_edges(state)
        index = next(i for i, (u, v) in enumerate(edges) if v == 0 and edge_profile(state, u, v) == "radial")
        state, event = attach(state, index, "left-radial")
        history.append(event)
    return state, history


def boundary_word(state: State) -> List[dict]:
    edges = boundary_edges(state)
    profiles = [edge_profile(state, u, v) for u, v in edges]
    result = []
    for index, vertex in enumerate(state.boundary):
        incoming = profiles[index - 1]
        outgoing = profiles[index]
        result.append({
            "vertex": vertex,
            "incoming": incoming,
            "outgoing": outgoing,
            "turn": state.corner_overrides.get(vertex, "positive-symbolic"),
            "theta": None,
            "metric_source": None,
        })
    return result


def serialize_with_order(state: State, ordered_boundary: Sequence[int]) -> str:
    position = {vertex: index for index, vertex in enumerate(ordered_boundary)}
    n = len(ordered_boundary)
    edge_profiles = [edge_profile(state, ordered_boundary[i], ordered_boundary[(i + 1) % n]) for i in range(n)]
    corner_flags = [
        (edge_profiles[i - 1], edge_profiles[i], state.corner_overrides.get(ordered_boundary[i], "positive-symbolic"))
        for i in range(n)
    ]
    faces = sorted((position[a], min(position[left], position[right]), max(position[left], position[right])) for a, left, right in state.faces)
    payload = {
        "boundary_edge_profiles": edge_profiles,
        "corner_flags": corner_flags,
        "face_apex_base_incidence": faces,
        "faces": len(state.faces),
        "boundary_edges": n,
    }
    return json.dumps(payload, sort_keys=True, separators=(",", ":"))


def canonical_signature(state: State, allow_reflection: bool = False) -> str:
    b = list(state.boundary)
    candidates = []
    orientations = [b]
    if allow_reflection:
        orientations.append([b[0]] + list(reversed(b[1:])))
    for oriented in orientations:
        for shift in range(len(oriented)):
            order = oriented[shift:] + oriented[:shift]
            candidates.append(serialize_with_order(state, order))
    return min(candidates)


def reflected(state: State) -> State:
    b = [state.boundary[0]] + list(reversed(state.boundary[1:]))
    return State(
        faces=[(a, right, left) for a, left, right in state.faces],
        boundary=b,
        next_vertex=state.next_vertex,
        corner_overrides=dict(state.corner_overrides),
    )


def raw_face_nodes(face_index: int) -> List[Raw]:
    return [(face_index, n, k) for n in range(DEPTH + 1) for k in range(n + 1)]


def face_side_raw(face_index: int, side_number: int) -> List[Raw]:
    if side_number == 0:
        return [(face_index, n, 0) for n in range(DEPTH + 1)]
    if side_number == 1:
        return [(face_index, DEPTH, k) for k in range(DEPTH + 1)]
    return [(face_index, n, n) for n in range(DEPTH, -1, -1)]


def expanded_pascal_invariants(state: State) -> dict:
    raw = [item for face in range(len(state.faces)) for item in raw_face_nodes(face)]
    uf = UnionFind(raw)

    coarse_corners: Dict[int, List[Raw]] = defaultdict(list)
    edge_chains: Dict[Tuple[int, int], List[List[Raw]]] = defaultdict(list)
    for face_index, face in enumerate(state.faces):
        a, left, right = face
        coarse_corners[a].append((face_index, 0, 0))
        coarse_corners[left].append((face_index, DEPTH, 0))
        coarse_corners[right].append((face_index, DEPTH, DEPTH))
        for side_number, (_, start, end, _) in enumerate(local_sides(face)):
            seq = face_side_raw(face_index, side_number)
            key = tuple(sorted((start, end)))
            edge_chains[key].append(seq if start < end else list(reversed(seq)))

    for items in coarse_corners.values():
        for item in items[1:]:
            uf.union(items[0], item)
    for chains in edge_chains.values():
        anchor = chains[0]
        for chain in chains[1:]:
            for left, right in zip(anchor, chain):
                uf.union(left, right)

    classes: Dict[Raw, List[Raw]] = defaultdict(list)
    for item in raw:
        classes[uf.find(item)].append(item)
    weights = {}
    for root, members in classes.items():
        values = {math.comb(n, k) for _, n, k in members}
        if len(values) != 1:
            raise ValueError("Pascal weights disagree inside a seam class")
        weights[root] = values.pop()

    directed = set()
    incidence = Counter()
    for face_index in range(len(state.faces)):
        for n in range(DEPTH + 1):
            for k in range(n + 1):
                incidence[uf.find((face_index, n, k))] += 1
                if n < DEPTH:
                    source = uf.find((face_index, n, k))
                    directed.add((source, uf.find((face_index, n + 1, k))))
                    directed.add((source, uf.find((face_index, n + 1, k + 1))))

    undirected = {tuple(sorted((left, right))) for left, right in directed if left != right}
    adjacency: Dict[Raw, set] = defaultdict(set)
    for left, right in undirected:
        adjacency[left].add(right)
        adjacency[right].add(left)
    unseen = set(classes)
    components = 0
    while unseen:
        components += 1
        queue = deque([unseen.pop()])
        while queue:
            current = queue.popleft()
            for neighbor in adjacency[current]:
                if neighbor in unseen:
                    unseen.remove(neighbor)
                    queue.append(neighbor)

    return {
        "nodes": len(classes),
        "directed_edges": len(directed),
        "undirected_edges": len(undirected),
        "components": components,
        "weight_multiset": sorted(Counter(weights.values()).items()),
        "seam_class_size_multiset": sorted(Counter(len(items) for items in classes.values()).items()),
        "degree_multiset": sorted(Counter(len(adjacency[node]) for node in classes).items()),
        "face_incidence_multiplicity_multiset": sorted(Counter(incidence.values()).items()),
    }


def history_key(events: Sequence[dict]) -> str:
    return " | ".join(
        f"{event['edge_profile']}:{event['boundary_edge_before'][0]}-{event['boundary_edge_before'][1]}:{event['fresh_side']}"
        for event in events
    )


def enumerate_extensions(start: State, steps: int) -> List[Tuple[State, List[dict]]]:
    frontier = [(start, [])]
    for _ in range(steps):
        following = []
        for state, history in frontier:
            for edge_index, (u, v) in enumerate(boundary_edges(state)):
                profile = edge_profile(state, u, v)
                for fresh_side in compatible_sides(profile):
                    child, event = attach(state, edge_index, fresh_side)
                    following.append((child, history + [event]))
        frontier = following
    return frontier


def run() -> dict:
    baseline, baseline_history = build_baseline()
    six_face = enumerate_extensions(baseline, 1)
    terminals = enumerate_extensions(baseline, EXTENSION_STEPS)

    classes: Dict[str, List[int]] = defaultdict(list)
    records = []
    for index, (state, history) in enumerate(terminals):
        signature = canonical_signature(state)
        classes[signature].append(index)
        records.append({
            "history_id": f"H{index:03d}",
            "history": history,
            "history_key": history_key(history),
            "typed_signature_sha256": hashlib.sha256(signature.encode("utf-8")).hexdigest(),
            "expanded": expanded_pascal_invariants(state),
            "boundary_word": boundary_word(state),
        })

    representative_indexes = [members[0] for _, members in sorted(classes.items(), key=lambda item: item[0])]
    witness = None
    if len(representative_indexes) > 1:
        left, right = representative_indexes[:2]
        witness = {
            "left": records[left],
            "right": records[right],
            "same_pascal_node_count": records[left]["expanded"]["nodes"] == records[right]["expanded"]["nodes"],
            "typed_signatures_differ": records[left]["typed_signature_sha256"] != records[right]["typed_signature_sha256"],
        }

    sample_state, sample_history = terminals[0]
    sample_reflection = reflected(sample_state)
    angle_mutation = sample_state.clone()
    angle_mutation.corner_overrides[angle_mutation.boundary[0]] = "negative-symbolic"

    baseline_expanded = expanded_pascal_invariants(baseline)
    six_expanded = [expanded_pascal_invariants(state) for state, _ in six_face]
    terminal_expanded = [record["expanded"] for record in records]

    controls = {
        "identity_control": canonical_signature(sample_state) == canonical_signature(sample_state.clone()),
        "reflection_requires_declared_dihedral_comparison": (
            canonical_signature(sample_state, allow_reflection=True)
            == canonical_signature(sample_reflection, allow_reflection=True)
        ),
        "angle_word_mutation_is_detected": canonical_signature(sample_state) != canonical_signature(angle_mutation),
        "baseline_is_five_faces_112_nodes_seven_boundary_edges": (
            len(baseline.faces) == 5 and baseline_expanded["nodes"] == 112 and len(baseline.boundary) == 7
        ),
        "every_first_extension_has_six_faces_133_nodes_eight_boundary_edges": all(
            len(state.faces) == 6 and inv["nodes"] == 133 and len(state.boundary) == 8
            for (state, _), inv in zip(six_face, six_expanded)
        ),
        "every_terminal_has_seven_faces_154_nodes_nine_boundary_edges": all(
            len(state.faces) == 7 and inv["nodes"] == 154 and len(state.boundary) == 9
            for (state, _), inv in zip(terminals, terminal_expanded)
        ),
        "every_expanded_terminal_is_connected": all(inv["components"] == 1 for inv in terminal_expanded),
        "history_bound_under_500": len(terminals) <= 500,
        "distinct_history_control": len({record["history_key"] for record in records}) == len(records),
    }

    if not all(controls.values()):
        classification = "INVALID_EXPERIMENT"
    elif len(classes) == 1:
        classification = "CONFLUENT_UNDER_DECLARED_CLASS"
    else:
        classification = "PATH_DEPENDENT_WITH_WITNESS"

    class_summary = []
    for class_index, (signature, members) in enumerate(sorted(classes.items(), key=lambda item: item[0])):
        class_summary.append({
            "class_id": f"T{class_index:03d}",
            "typed_signature_sha256": hashlib.sha256(signature.encode("utf-8")).hexdigest(),
            "history_count": len(members),
            "representative_history_ids": [records[index]["history_id"] for index in members[:5]],
        })

    return {
        "schema": "nexah.a0-bl-021.dynamic-boundary-confluence-result/1.0.0",
        "date": "2026-10-10",
        "classification": classification,
        "scope": {
            "pascal_depth": DEPTH,
            "baseline_faces": BASELINE_FACES,
            "extension_steps": EXTENSION_STEPS,
            "terminal_faces": BASELINE_FACES + EXTENSION_STEPS,
            "metric_embedding": False,
        },
        "baseline": {
            "construction_history": baseline_history,
            "boundary_word": boundary_word(baseline),
            "expanded": baseline_expanded,
        },
        "enumeration": {
            "six_face_histories": len(six_face),
            "seven_face_histories": len(terminals),
            "typed_terminal_classes": len(classes),
            "classes": class_summary,
        },
        "controls": controls,
        "witness": witness,
        "scientific_records": records,
        "claim_boundary": "Finite combinatorial depth-six f=5..7 attachment class only; no unrestricted confluence, metric polygon, solid, physical flow, resonance, MONAD(t), dodecahedron, new PENT identity or canonical A0 Family follows.",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    result = run()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, sort_keys=True, separators=(",", ":")) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": result["classification"],
        "six_face_histories": result["enumeration"]["six_face_histories"],
        "seven_face_histories": result["enumeration"]["seven_face_histories"],
        "typed_terminal_classes": result["enumeration"]["typed_terminal_classes"],
        "output": str(output),
    }, indent=2))


if __name__ == "__main__":
    main()
