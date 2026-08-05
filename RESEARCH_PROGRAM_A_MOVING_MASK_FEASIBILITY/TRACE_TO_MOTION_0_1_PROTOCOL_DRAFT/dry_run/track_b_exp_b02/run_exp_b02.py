#!/usr/bin/env python3
"""EXP-B02: enumerate every start/direction traversal of the B01 cycle.

Synthetic engineering probe only.  Enumeration order is a technical
serialization decision, not evidence of an original or physical motion.
"""
from __future__ import annotations

import csv
import hashlib
import io
import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
DRY_RUN = HERE.parent
EXP_B01 = DRY_RUN / "track_b_exp_b01"
B01_PACKET = EXP_B01 / "EXP_B01_INPUT_PACKET.json"
TRACK_A_REFERENCE = DRY_RUN / "minimal_trace_run" / "primary" / "trace_canonical.csv"

INPUT_PACKET_PATH = HERE / "EXP_B02_INPUT_PACKET.json"
CANDIDATES_PATH = HERE / "EXP_B02_MOTION_CANDIDATES.json"
PROJECTIONS_PATH = HERE / "EXP_B02_FORWARD_PROJECTIONS.json"
RELATIONS_PATH = HERE / "EXP_B02_CANDIDATE_RELATIONS.json"
REPORT_PATH = HERE / "EXP_B02_REPORT.json"
REPORT_DE_PATH = HERE / "EXP_B02_REPORT_DE.md"

BASELINE = "e3027a6553feda951f0c666d2609236b25887080"
B01_PACKET_SHA256 = "85029c476ca5462eeeca06cf547c4055bc151e07908c46f3217ffebc3e7cdadf"
TRACK_A_BYTES = 324
TRACK_A_SHA256 = "8aadeeec4b4c8cd591a597aef59b8390585db7e8f6a5346e88b37bd41cbc71ce"
EXPECTED_HEADER = [
    "sample_uuid", "trace_index", "s_norm", "x_mm", "y_mm", "closure_status"
]
FORBIDDEN_PACKET_KEYS = {
    "sample_uuid", "trace_index", "s_norm", "closure_status", "tau", "time",
    "direction", "velocity", "source_order", "semantic_filename", "template",
    "pairing", "derivation_order", "marker", "branch", "owner_explanation",
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def json_bytes(value: object, pretty: bool = True) -> bytes:
    if pretty:
        text = json.dumps(value, indent=2, sort_keys=True) + "\n"
    else:
        text = json.dumps(value, sort_keys=True, separators=(",", ":"))
    return text.encode("utf-8")


def write_json(path: Path, value: object) -> None:
    path.write_bytes(json_bytes(value))


def forbidden_keys(value: object) -> set[str]:
    found = set()
    if isinstance(value, dict):
        for key, child in value.items():
            if key.lower() in FORBIDDEN_PACKET_KEYS:
                found.add(key)
            found.update(forbidden_keys(child))
    elif isinstance(value, list):
        for child in value:
            found.update(forbidden_keys(child))
    return found


def load_and_freeze_input_packet() -> tuple[bytes, dict]:
    raw = B01_PACKET.read_bytes()
    if sha256(raw) != B01_PACKET_SHA256:
        raise ValueError("B01_PACKET_INTEGRITY_FAILURE")
    packet = json.loads(raw.decode("utf-8"))
    leaks = forbidden_keys(packet)
    if leaks:
        raise ValueError(f"TRACK_B_INPUT_BOUNDARY_LEAK:{sorted(leaks)}")
    INPUT_PACKET_PATH.write_bytes(raw)
    return raw, packet


def load_track_a_xy_reference() -> tuple[bytes, list[tuple[float, float]]]:
    """Load only XY for comparison after candidate construction."""
    raw = TRACK_A_REFERENCE.read_bytes()
    if len(raw) != TRACK_A_BYTES or sha256(raw) != TRACK_A_SHA256:
        raise ValueError("TRACK_A_REFERENCE_INTEGRITY_FAILURE")
    reader = csv.reader(io.StringIO(raw.decode("utf-8"), newline=""))
    rows = list(reader)
    if not rows or rows[0] != EXPECTED_HEADER:
        raise ValueError("TRACK_A_HEADER_MISMATCH")
    x_index = rows[0].index("x_mm")
    y_index = rows[0].index("y_mm")
    points = [(float(row[x_index]), float(row[y_index])) for row in rows[1:]]
    if not points or not all(math.isfinite(v) for point in points for v in point):
        raise ValueError("TRACK_A_XY_REFERENCE_INVALID")
    return raw, points


def packet_graph(packet: dict) -> tuple[dict[str, tuple[float, float]], dict[str, set[str]], set[tuple[str, str]]]:
    nodes = {
        node["node_id"]: (float(node["x_mm"]), float(node["y_mm"]))
        for node in packet["nodes"]
    }
    adjacency = {node_id: set() for node_id in nodes}
    edge_set = set()
    for left, right in packet["undirected_edges"]:
        edge = tuple(sorted((left, right)))
        if edge in edge_set:
            raise ValueError("DUPLICATE_PACKET_EDGE")
        edge_set.add(edge)
        adjacency[left].add(right)
        adjacency[right].add(left)
    if len(nodes) != 4 or len(edge_set) != 4:
        raise ValueError("EXP_B02_REQUIRES_FOUR_NODE_FOUR_EDGE_CYCLE")
    if any(len(neighbors) != 2 for neighbors in adjacency.values()):
        raise ValueError("PACKET_NOT_A_SIMPLE_CYCLE")
    return nodes, adjacency, edge_set


def traverse(start: str, first_neighbor: str, adjacency: dict[str, set[str]]) -> list[str]:
    sequence = [start, first_neighbor]
    previous, current = start, first_neighbor
    while current != start:
        choices = adjacency[current] - {previous}
        if len(choices) != 1:
            raise ValueError("NON_DETERMINISTIC_CONTINUATION_AFTER_FIRST_EDGE")
        following = sorted(choices)[0]
        sequence.append(following)
        previous, current = current, following
        if len(sequence) > len(adjacency) + 1:
            raise ValueError("TRAVERSAL_DID_NOT_CLOSE")
    return sequence


def unitless_phase(sequence: list[str], nodes: dict[str, tuple[float, float]]) -> list[float]:
    cumulative = [0.0]
    for left, right in zip(sequence, sequence[1:]):
        cumulative.append(cumulative[-1] + math.dist(nodes[left], nodes[right]))
    total = cumulative[-1]
    if total <= 0:
        raise ValueError("ZERO_PATH_LENGTH")
    return [value / total for value in cumulative]


def enumerate_candidates(packet: dict) -> dict:
    """Consume only the direction-free packet and enumerate all traversals."""
    nodes, adjacency, governing_edges = packet_graph(packet)
    starts = sorted(nodes, key=lambda node_id: (nodes[node_id], node_id))
    candidates = []
    candidate_number = 0
    for start_rank, start in enumerate(starts, start=1):
        neighbors = sorted(adjacency[start], key=lambda node_id: (nodes[node_id], node_id))
        for neighbor_rank, first_neighbor in enumerate(neighbors, start=1):
            candidate_number += 1
            sequence = traverse(start, first_neighbor, adjacency)
            traversed_edges = [
                list(sorted((left, right))) for left, right in zip(sequence, sequence[1:])
            ]
            edge_set = {tuple(edge) for edge in traversed_edges}
            node_once = len(sequence) == 5 and len(set(sequence[:-1])) == 4
            edge_once = len(traversed_edges) == 4 and edge_set == governing_edges
            candidates.append({
                "candidate_id": f"B02-S{start_rank:02d}-D{neighbor_rank:02d}",
                "enumeration_rank": candidate_number,
                "technical_start_node": start,
                "technical_first_neighbor": first_neighbor,
                "ordered_node_cycle": sequence,
                "traversed_undirected_edges": traversed_edges,
                "positions_mm": [list(nodes[node_id]) for node_id in sequence],
                "unitless_phase": unitless_phase(sequence, nodes),
                "all_nodes_once_per_cycle": node_once,
                "all_edges_once_per_cycle": edge_once,
                "closed": sequence[-1] == sequence[0],
            })
    return {
        "translation_boundary": "n1",
        "translation_boundary_status": "PROVISIONAL_TECHNICAL_LABEL_ONLY",
        "enumeration_order": {
            "start_nodes": "LEXICOGRAPHIC_BY_COORDINATE_THEN_NODE_ID",
            "first_neighbors": "LEXICOGRAPHIC_BY_COORDINATE_THEN_NODE_ID",
            "status": "TECHNICAL_SERIALIZATION_DECISION_NOT_MOTION_PROPERTY",
        },
        "provisional_assumptions": [
            "PROVISIONAL_TRACK_B_ASSUMPTION: every discrete packet node is enumerated as a possible operational start",
            "PROVISIONAL_TRACK_B_ASSUMPTION: both outgoing neighbors are enumerated in technical lexicographic order",
            "PROVISIONAL_TRACK_B_ASSUMPTION: packet edges are traversed piecewise-linearly",
            "PROVISIONAL_TRACK_B_ASSUMPTION: cumulative geometric length supplies a unitless phase",
            "PROVISIONAL_TRACK_B_ASSUMPTION: phase is not time, speed, velocity or physical motion",
        ],
        "candidate_count": len(candidates),
        "candidates": candidates,
    }


def forward_project(candidate_set: dict) -> dict:
    projections = []
    for candidate in candidate_set["candidates"]:
        points = candidate["positions_mm"]
        projections.append({
            "candidate_id": candidate["candidate_id"],
            "representation": "ORDERED_TRACE_PROJECTION",
            "local_index": list(range(len(points))),
            "points_mm": points,
            "unitless_phase": candidate["unitless_phase"],
            "closed_cycle_connectivity": points[0] == points[-1],
        })
    return {"projection_count": len(projections), "projections": projections}


def point_multiset(points: list) -> list[tuple[float, float]]:
    return sorted(tuple(point) for point in points)


def evaluate(
    packet: dict,
    candidate_set: dict,
    projections: dict,
    reference_xy: list[tuple[float, float]],
) -> dict:
    nodes, _, packet_edges = packet_graph(packet)
    expected_projection_points = {tuple(point) for point in nodes.values()}
    ordered_matches = []
    checks = []
    sequences = set()
    for candidate, projection in zip(candidate_set["candidates"], projections["projections"]):
        sequence_key = tuple(candidate["ordered_node_cycle"])
        sequences.add(sequence_key)
        projected_points = [tuple(point) for point in projection["points_mm"]]
        projected_edges = {
            tuple(sorted((left, right)))
            for left, right in zip(candidate["ordered_node_cycle"], candidate["ordered_node_cycle"][1:])
        }
        ordered_match = projected_points == reference_xy
        if ordered_match:
            ordered_matches.append(candidate["candidate_id"])
        checks.append({
            "candidate_id": candidate["candidate_id"],
            "nodes_once": candidate["all_nodes_once_per_cycle"],
            "edges_once": candidate["all_edges_once_per_cycle"] and projected_edges == packet_edges,
            "closed": candidate["closed"] and projection["closed_cycle_connectivity"],
            "same_undirected_geometry": (
                {tuple(point) for point in projection["points_mm"]} == expected_projection_points
                and projected_edges == packet_edges
            ),
            "exact_track_a_xy_row_order": "PASS" if ordered_match else "FAIL",
        })
    return {
        "candidate_count": len(candidate_set["candidates"]),
        "unique_ordered_sequence_count": len(sequences),
        "exact_track_a_xy_match_count": len(ordered_matches),
        "exact_track_a_xy_matching_candidates": ordered_matches,
        "candidate_checks": checks,
        "lawful_comparison_boundary": {
            "ordered_xy_equality": "EXECUTED_EXACT",
            "undirected_node_and_edge_agreement": "EXECUTED_EXACT",
            "rotation_quotient": "NOT_INTRODUCED",
            "reversal_quotient": "NOT_INTRODUCED",
            "cyclic_origin_rule": "NOT_INTRODUCED",
            "similarity_metric": "NOT_INTRODUCED",
        },
    }


def candidate_relations(candidate_set: dict, evaluation: dict) -> dict:
    candidates = candidate_set["candidates"]
    all_ids = [candidate["candidate_id"] for candidate in candidates]
    rows = []
    checks_by_id = {item["candidate_id"]: item for item in evaluation["candidate_checks"]}
    for candidate in candidates:
        candidate_id = candidate["candidate_id"]
        alternatives = [other for other in all_ids if other != candidate_id]
        rows.append({
            "focused_candidate_id": candidate_id,
            "technical_start_node": candidate["technical_start_node"],
            "technical_first_neighbor": candidate["technical_first_neighbor"],
            "compatible_alternative_candidate_ids": alternatives,
            "alternative_count": len(alternatives),
            "common_undirected_projection": checks_by_id[candidate_id]["same_undirected_geometry"],
        })
    return {
        "relation_scope": "IDENTITY_START_FIRST_NEIGHBOR_AND_COMMON_UNDIRECTED_PROJECTION_ONLY",
        "candidate_count": len(candidates),
        "focused_plus_alternatives": "1+7=8",
        "physical_simultaneity_claim": "NONE",
        "rows": rows,
    }


def build_objects(packet: dict, reference_xy: list[tuple[float, float]]) -> tuple[dict, dict, dict, dict]:
    candidates = enumerate_candidates(packet)
    projections = forward_project(candidates)
    evaluation = evaluate(packet, candidates, projections, reference_xy)
    relations = candidate_relations(candidates, evaluation)
    return candidates, projections, relations, evaluation


def german_report(report: dict) -> str:
    lines = [
        "# EXP-B02 — Complete Start/Direction Enumeration",
        "",
        "Status: `SYNTHETIC ENGINEERING PROBE — SCIENTIFIC RESULT NONE`",
        "",
        "> EXP‑B02 prüft, ob das richtungslose Zykluspaket einen vollständig",
        "> enumerierbaren endlichen Raum kompatibler gerichteter Durchläufe zulässt.",
        "> Es prüft weder, welcher Durchlauf ursprünglich war, noch ob einer davon",
        "> eine physische Bewegung beschreibt.",
        "",
        "## Persistente ungerichtete Geometrie",
        "",
        "Eingang war ausschließlich die byte-identische Kopie des autorisierten",
        "EXP-B01-Pakets: vier Koordinatenknoten, vier ungerichtete Kanten und ein",
        "geschlossener Zyklus. Alle acht Vorwärtsprojektionen enthalten genau diese",
        "Knoten und Kanten. Keine Quotienten- oder Äquivalenzregel wurde eingeführt.",
        "",
        "## Acht orientierte Varianten",
        "",
    ]
    matching = set(report["evaluation"]["exact_track_a_xy_matching_candidates"])
    for candidate in report["motion_candidates"]["candidates"]:
        sequence = " → ".join(candidate["ordered_node_cycle"])
        reference = "XY-Referenz PASS" if candidate["candidate_id"] in matching else "XY-Referenz FAIL"
        lines.append(f"- `{candidate['candidate_id']}`: {sequence}; {reference}")
    lines.extend([
        "",
        "Die Startknoten und ihre beiden ersten Nachbarn wurden lexikographisch",
        "geordnet. Diese Ordnung ist ausschließlich eine technische",
        "Serialisierungsentscheidung. Sie bevorzugt keinen Kandidaten.",
        "",
        "Die vorhandene Track-A-XY-Zeilenreihenfolge wurde nur als exakte",
        "Vergleichsreferenz verwendet. Eine Übereinstimmung belegt weder ursprüngliche",
        "Richtung noch Zeit, Ursache oder physikalische Bewegung.",
        "",
        "## Fehlende Informationen",
        "",
        "Nicht rekonstruierbar bleiben insbesondere intrinsischer Startpunkt,",
        "ursprüngliche Durchlaufrichtung, Zeit, Geschwindigkeit, Beschleunigung,",
        "Source Order, Herkunft, Marker, `tau`, `sample_uuid` und physikalische Ursache.",
        "",
        "## Architekturhypothese „No Slack“",
        "",
        "Als begrenzte Architekturmetapher gilt hier: Wird ein Kandidat fokussiert,",
        "bleiben die sieben anderen Kandidaten deterministisch referenzierbar.",
        "`1 + 7 = 8` beschreibt nur den vollständig verorteten Kandidatenraum.",
        "Es behauptet nicht, dass acht Bewegungen gleichzeitig physisch stattfinden.",
        "Die Metaphern „Fühler“, „Flavor“ und „no slack“ sind keine kanonischen",
        "Datenfelder und kein wissenschaftliches Ergebnis.",
        "",
        "## Status",
        "",
        "```text",
    ])
    for key, value in report["final_status"].items():
        lines.append(f"{key}: {value}")
    lines.extend(["```", ""])
    return "\n".join(lines)


def run() -> dict:
    packet_raw, packet = load_and_freeze_input_packet()

    # Translation executes before Track A is opened for XY-only comparison.
    packet_for_translation = json.loads(INPUT_PACKET_PATH.read_text(encoding="utf-8"))
    candidates = enumerate_candidates(packet_for_translation)
    projections = forward_project(candidates)

    track_a_raw, reference_xy = load_track_a_xy_reference()
    evaluation = evaluate(packet_for_translation, candidates, projections, reference_xy)
    relations = candidate_relations(candidates, evaluation)

    replay_objects = build_objects(packet_for_translation, reference_xy)
    primary_objects = (candidates, projections, relations, evaluation)
    replay_equal = all(
        json_bytes(primary, pretty=False) == json_bytes(replay, pretty=False)
        for primary, replay in zip(primary_objects, replay_objects)
    )

    checks = evaluation["candidate_checks"]
    exactly_eight = evaluation["candidate_count"] == 8
    identities_unique = evaluation["unique_ordered_sequence_count"] == 8
    all_closed = all(item["closed"] for item in checks)
    all_projected = len(projections["projections"]) == 8
    geometry_persistent = all(item["same_undirected_geometry"] for item in checks)
    all_nodes_edges_once = all(item["nodes_once"] and item["edges_once"] for item in checks)
    alternative_set_preserved = all(
        row["alternative_count"] == 7 and row["common_undirected_projection"]
        for row in relations["rows"]
    )
    no_equivalence_rule = all(
        value == "NOT_INTRODUCED"
        for key, value in evaluation["lawful_comparison_boundary"].items()
        if key in {"rotation_quotient", "reversal_quotient", "cyclic_origin_rule", "similarity_metric"}
    )

    final_status = {
        "TRACK_A_REFERENCE_INTEGRITY": "PASS" if len(track_a_raw) == TRACK_A_BYTES and sha256(track_a_raw) == TRACK_A_SHA256 else "FAIL",
        "TRACK_B_INPUT_BOUNDARY": "PASS" if not forbidden_keys(packet_for_translation) and packet_raw == INPUT_PACKET_PATH.read_bytes() else "FAIL",
        "N1_TRANSLATION_EXECUTED": "PASS" if exactly_eight else "FAIL",
        "EIGHT_CANDIDATES_ENUMERATED": "PASS" if exactly_eight else "FAIL",
        "CANDIDATE_IDENTITIES_UNIQUE": "PASS" if identities_unique else "FAIL",
        "ALL_CANDIDATES_CLOSED": "PASS" if all_closed and all_nodes_edges_once else "FAIL",
        "ALL_FORWARD_PROJECTIONS_EXECUTED": "PASS" if all_projected else "FAIL",
        "UNDIRECTED_GEOMETRY_PERSISTENT": "PASS" if geometry_persistent else "FAIL",
        "ORDERED_XY_COMPARISON_EXECUTED": "PASS" if len(checks) == 8 else "FAIL",
        "NO_EQUIVALENCE_RULE_INTRODUCED": "PASS" if no_equivalence_rule else "FAIL",
        "ALTERNATIVE_SET_PRESERVED": "PASS" if alternative_set_preserved else "FAIL",
        "DETERMINISTIC_REPLAY": "PASS" if replay_equal else "FAIL",
        "AMBIGUITY_REPORTED": "YES",
        "INFORMATION_LOSS_REPORTED": "YES",
        "SCIENTIFIC_RESULT": "NONE",
        "HUMAN_ACQUISITION": "PROHIBITED",
    }

    report = {
        "experiment_id": "TRACK-B-EXP-B02",
        "baseline_commit": BASELINE,
        "experiment_class": "SYNTHETIC_ENGINEERING_PROBE",
        "input_boundary": {
            "source": "EXP-B01 direction-free packet",
            "source_sha256": sha256(packet_raw),
            "byte_identical_local_copy": packet_raw == INPUT_PACKET_PATH.read_bytes(),
            "hidden_track_a_fields_consumed_by_n1": [],
            "track_a_use": "XY_ONLY_POST_TRANSLATION_COMPARISON_REFERENCE",
        },
        "n1": {
            "role": "PROVISIONAL_TECHNICAL_TRANSLATION_BOUNDARY",
            "physical_meaning": "NONE",
            "symbolic_meaning": "NONE",
            "scientific_status": "NOT_ESTABLISHED",
        },
        "motion_candidates": candidates,
        "forward_projections": projections,
        "candidate_relations": relations,
        "evaluation": evaluation,
        "information_classification": {
            "persistent": ["undirected nodes", "undirected edges", "cycle closure", "segment geometry"],
            "enumerated_not_recovered": ["technical start node", "technical first neighbor", "traversal orientation"],
            "not_recoverable": [
                "intrinsic start", "source direction", "time", "speed", "velocity", "acceleration",
                "source order", "provenance", "markers", "tau", "sample_uuid", "physical cause",
            ],
        },
        "deterministic_replay": {
            "status": "PASS" if replay_equal else "FAIL",
            "objects_compared": ["motion candidates", "forward projections", "candidate relations", "evaluation"],
            "method": "fresh reconstruction and canonical JSON byte comparison",
        },
        "remaining_blockers": [
            "no source start, direction or time information",
            "no authorized cyclic-origin, reversal or rotation quotient comparison",
            "no scientific motion model or motion metric inventory",
            "no independent Track B evaluator",
            "Human acquisition remains prohibited",
        ],
        "final_status": final_status,
    }

    write_json(CANDIDATES_PATH, candidates)
    write_json(PROJECTIONS_PATH, projections)
    write_json(RELATIONS_PATH, relations)
    write_json(REPORT_PATH, report)
    REPORT_DE_PATH.write_bytes(german_report(report).encode("utf-8"))
    return report


if __name__ == "__main__":
    print(json.dumps(run(), indent=2, sort_keys=True))
