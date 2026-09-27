#!/usr/bin/env python3
"""Deterministic semantic and inverse-record test for NEXAH-ORI-02."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
FIXTURE = ROOT / "01_TYPED_FIXTURE.json"
OUTPUT = ROOT / "04_RESULTS.json"


def main() -> None:
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    nodes = {node["id"]: node for node in fixture["nodes"]}
    decay_parents = {decay["parent"] for decay in fixture["decays"]}
    typed_graph_valid = all(
        decay["parent"] in nodes and all(child in nodes for child in decay["children"])
        for decay in fixture["decays"]
    )

    glyph_types = {}
    for node in fixture["nodes"]:
        glyph_types.setdefault(node["glyph"], set()).add(node["type"])
    collisions = {
        glyph: sorted(types) for glyph, types in glyph_types.items() if len(types) > 1
    }

    proposed = fixture["proposed_mixed_glyph_chain"]
    naive_accepts = all(isinstance(token, str) and token for token in proposed)
    proposed_particle_ids = [
        node["id"]
        for token in proposed
        for node in fixture["nodes"]
        if node["glyph"] == token and node["type"].startswith("particle.")
    ]
    baseline_rejects = (
        len(proposed_particle_ids) < len(proposed)
        or any(node_id not in decay_parents for node_id in proposed_particle_ids[:-1])
    )

    histories = fixture["candidate_histories_for_e_plus_missing"]
    histories_valid = all(
        history[-1] == "pdg:e_plus" and all(node_id in nodes for node_id in history)
        for history in histories
    )
    record_nonunique = histories_valid and len(histories) >= 3

    nexah = {
        "Omega": "typed PDG-derived decay graph",
        "X": "particle namespace plus detector visibility",
        "Q": "Does the glyph chain or visible e+ record identify one physical history?",
        "sigma": "hide neutrinos and upstream vertices; retain visible e+",
        "vertices": len(fixture["decays"]),
        "ILAU": {
            "I_retained": ["visible positron", "declared source graph", "typed particle identities"],
            "L_lost": ["neutrino worldlines", "unseen vertices", "upstream parent identity"],
            "A_introduced": ["candidate-history enumeration", "detector aperture model"],
            "U_unresolved": ["which compatible upstream history occurred"],
        },
        "symbol_collisions": collisions,
        "blocked_claims": [
            "the mixed glyph sequence is a physical decay chain",
            "visible e+ plus missing momentum proves one unique parent",
        ],
        "residual": "five compatible source histories remain under the frozen aperture",
    }
    nexah_rejects_chain = bool(collisions) and baseline_rejects
    nexah_blocks_unique = record_nonunique and bool(nexah["ILAU"]["U_unresolved"])
    baseline_blocks_unique = record_nonunique

    gates = {
        "G1_TYPED_SOURCE_GRAPH": typed_graph_valid,
        "G2_NAIVE_GLYPH_COLLISION_EXPOSED": naive_accepts and bool(collisions),
        "G3_BASELINE_REJECTS_MIXED_CHAIN": baseline_rejects,
        "G4_NEXAH_REJECTS_MIXED_CHAIN": nexah_rejects_chain,
        "G5_RECORD_IS_NONUNIQUE": record_nonunique,
        "G6_BASELINE_BLOCKS_UNIQUE_SOURCE": baseline_blocks_unique,
        "G7_NEXAH_BLOCKS_UNIQUE_SOURCE": nexah_blocks_unique,
        "G8_INCREMENTAL_DETECTION": (nexah_rejects_chain or nexah_blocks_unique)
        and not (baseline_rejects and baseline_blocks_unique),
    }
    result = {
        "test_id": "NEXAH-ORI-02",
        "source_relations": len(fixture["decays"]),
        "symbol_collisions": collisions,
        "compatible_histories_for_visible_e_plus_missing": histories,
        "strong_baseline": {
            "typed_graph": True,
            "rejects_mixed_chain": baseline_rejects,
            "blocks_unique_upstream_claim": baseline_blocks_unique,
        },
        "nexah": nexah,
        "gates": gates,
        "method_functioning": all(value for key, value in gates.items() if key != "G8_INCREMENTAL_DETECTION"),
        "incremental_detection_utility": gates["G8_INCREMENTAL_DETECTION"],
        "outcome": "TIE_NO_INCREMENTAL_DETECTION_UTILITY"
        if baseline_rejects and baseline_blocks_unique and nexah_rejects_chain and nexah_blocks_unique
        else "REVIEW_REQUIRED",
    }
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"outcome": result["outcome"], "gates": gates}, indent=2))


if __name__ == "__main__":
    main()
