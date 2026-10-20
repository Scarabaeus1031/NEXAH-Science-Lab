#!/usr/bin/env python3
"""Exact finite 4+1 to two 5+1 extension audit for A0-BL-047."""

from __future__ import annotations

import argparse
import itertools
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def edge(a: str, b: str) -> tuple[str, str]:
    return tuple(sorted((a, b)))


def cycle_edges(order: list[str]) -> set[tuple[str, str]]:
    return {edge(order[i], order[(i + 1) % len(order)]) for i in range(len(order))}


def degrees(nodes: set[str], edges: set[tuple[str, str]]) -> dict[str, int]:
    return {node: sum(node in item for item in edges) for node in nodes}


def connected(nodes: set[str], edges: set[tuple[str, str]]) -> bool:
    adjacency = {node: set() for node in nodes}
    for a, b in edges:
        adjacency[a].add(b)
        adjacency[b].add(a)
    seen = set()
    stack = [next(iter(nodes))]
    while stack:
        node = stack.pop()
        if node in seen:
            continue
        seen.add(node)
        stack.extend(adjacency[node] - seen)
    return seen == nodes


def is_cycle(nodes: set[str], edges: set[tuple[str, str]]) -> bool:
    return len(edges) == len(nodes) and connected(nodes, edges) and set(degrees(nodes, edges).values()) == {2}


def subdivide(base_nodes: set[str], base_edges: set[tuple[str, str]], selected: tuple[str, str], new: str) -> tuple[set[str], set[tuple[str, str]]]:
    nodes = base_nodes | {new}
    edges = (base_edges - {selected}) | {edge(selected[0], new), edge(new, selected[1])}
    return nodes, edges


def contract(nodes: set[str], edges: set[tuple[str, str]], new: str) -> tuple[set[str], set[tuple[str, str]]]:
    neighbors = sorted({other for item in edges if new in item for other in item if other != new})
    remaining = {item for item in edges if new not in item}
    if len(neighbors) == 2:
        remaining.add(edge(*neighbors))
    return nodes - {new}, remaining


def d5_maps(order: list[str]) -> list[dict[str, str]]:
    size = len(order)
    maps = []
    for shift in range(size):
        maps.append({order[i]: order[(i + shift) % size] for i in range(size)})
        maps.append({order[i]: order[(shift - i) % size] for i in range(size)})
    return maps


def maps_edge(mapping: dict[str, str], source: tuple[str, str], target: tuple[str, str], oriented: bool) -> bool:
    if oriented:
        return mapping[source[0]] == target[0] and mapping[source[1]] == target[1]
    return edge(mapping[source[0]], mapping[source[1]]) == target


def isomorphism_count(nodes_a: set[str], edges_a: set[tuple[str, str]], nodes_b: set[str], edges_b: set[tuple[str, str]]) -> int:
    left = sorted(nodes_a)
    right = sorted(nodes_b)
    count = 0
    for perm in itertools.permutations(right):
        mapping = dict(zip(left, perm))
        mapped = {edge(mapping[a], mapping[b]) for a, b in edges_a}
        count += mapped == edges_b
    return count


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["primary", "replay"], required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    protocol = json.loads((ROOT / "FROZEN_PROTOCOL.json").read_text())
    order = protocol["base_cycle_order"]
    base_nodes = set(order)
    base_edges = cycle_edges(order)
    ordered_edges = [edge(order[i], order[(i + 1) % len(order)]) for i in range(len(order))]
    variants = []
    variant_graphs = {}
    for branch, new in protocol["branches"].items():
        for index, selected in enumerate(ordered_edges):
            nodes, edges = subdivide(base_nodes, base_edges, selected, new)
            returned_nodes, returned_edges = contract(nodes, edges, new)
            key = f"{branch}:e{index}"
            variant_graphs[key] = (nodes, edges)
            variants.append({
                "id": key,
                "branch": branch,
                "selected_edge_index": index,
                "selected_edge": list(selected),
                "vertices": len(nodes),
                "edges": len(edges),
                "degree_sequence": sorted(degrees(nodes, edges).values()),
                "is_C6": is_cycle(nodes, edges),
                "exact_contraction_return": returned_nodes == base_nodes and returned_edges == base_edges,
            })

    maps = d5_maps(order)
    pair_records = []
    for edge_a in range(5):
        for edge_b in range(5):
            if edge_a == edge_b:
                continue
            nodes_a, edges_a = variant_graphs[f"A:e{edge_a}"]
            nodes_b, edges_b = variant_graphs[f"B:e{edge_b}"]
            selected_a, selected_b = ordered_edges[edge_a], ordered_edges[edge_b]
            pair_records.append({
                "A_edge": edge_a,
                "B_edge": edge_b,
                "shared_vertices": len(nodes_a & nodes_b),
                "shared_edges": len(edges_a & edges_b),
                "union_vertices": len(nodes_a | nodes_b),
                "union_edges": len(edges_a | edges_b),
                "union_connected": connected(nodes_a | nodes_b, edges_a | edges_b),
                "abstract_C6_isomorphisms": isomorphism_count(nodes_a, edges_a, nodes_b, edges_b),
                "D5_undirected_edge_correspondences": sum(maps_edge(mapping, selected_a, selected_b, False) for mapping in maps),
                "D5_oriented_edge_correspondences": sum(maps_edge(mapping, selected_a, selected_b, True) for mapping in maps),
                "identity_on_base_is_isomorphism": edges_a == {edge(*(item)) for item in edges_b},
            })

    new = "x"
    selected = ordered_edges[0]
    controls = {
        "isolated_append": (base_nodes | {new}, base_edges),
        "leaf_append": (base_nodes | {new}, base_edges | {edge(selected[0], new)}),
        "triangle_chord_append": (base_nodes | {new}, base_edges | {edge(selected[0], new), edge(new, selected[1])}),
    }
    control_results = {
        name: {
            "vertices": len(nodes),
            "edges": len(edges),
            "degree_sequence": sorted(degrees(nodes, edges).values()),
            "connected": connected(nodes, edges),
            "is_C6": is_cycle(nodes, edges),
        }
        for name, (nodes, edges) in controls.items()
    }

    gates = {
        "G1_SOURCE": True,
        "G2_BASE_C5_4_PLUS_1_TYPED": is_cycle(base_nodes, base_edges) and len(protocol["roles"]["zones"]) == 4 and protocol["roles"]["seam_binder"] == "s",
        "G3_ALL_TEN_EXTENSIONS_ARE_C6": len(variants) == 10 and all(row["is_C6"] for row in variants),
        "G4_ALL_CONTRACTIONS_RETURN_EXACT_BASE": all(row["exact_contraction_return"] for row in variants),
        "G5_ALL_TWENTY_PAIR_LEDGERS_PASS": len(pair_records) == 20 and all(row["shared_vertices"] == 5 and row["shared_edges"] == 3 and row["union_vertices"] == 7 and row["union_edges"] == 9 and row["union_connected"] for row in pair_records),
        "G6_PAIRING_REMAINS_NONCANONICAL_UNTIL_ORIENTED": all(row["abstract_C6_isomorphisms"] == 12 and row["D5_undirected_edge_correspondences"] == 2 and row["D5_oriented_edge_correspondences"] == 1 and not row["identity_on_base_is_isomorphism"] for row in pair_records),
        "G7_NAIVE_APPEND_CONTROLS_FAIL_C6": all(not row["is_C6"] for row in control_results.values()),
        "G8_TYPED_RESIDUAL_REQUIRED": len(variants) == 10 and math.ceil(math.log2(len(variants))) == 4,
    }
    decision = protocol["expected_decision"] if all(gates.values()) else "INVALID_DESIGN"
    result = {
        "study_id": protocol["study_id"],
        "decision": decision,
        "mode_independent": True,
        "base": {"vertices": sorted(base_nodes), "edges": sorted([list(item) for item in base_edges]), "roles": protocol["roles"]},
        "variants": variants,
        "pair_records": pair_records,
        "controls": control_results,
        "information_ledger": {
            "extensions_over_same_contracted_base": len(variants),
            "residual": ["branch", "selected_edge_index"],
            "uniform_fixed_width_bits": math.ceil(math.log2(len(variants))),
            "branch_only_fibre_size": 5,
            "selector_only_fibre_size": 2,
            "without_residual_exact_return": False,
        },
        "gates": gates,
        "claim_boundary": [
            "The result is a finite labelled graph-extension family, not a recovered historical geometry.",
            "Two abstract C6 graphs are isomorphic but not identical as typed extensions of the shared carrier.",
            "No Pascal intertwiner, resonance, physical pyramid, universal N+1 law, novelty or utility is established.",
        ],
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")


if __name__ == "__main__":
    main()

