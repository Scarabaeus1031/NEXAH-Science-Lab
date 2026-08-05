#!/usr/bin/env python3
"""EXP-B01: smallest synthetic trace-to-motion-to-trace probe.

Engineering experiment only. n1 is a technical representation boundary.
No Human data and no scientific result.
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
REFERENCE = DRY_RUN / "minimal_trace_run" / "primary" / "trace_canonical.csv"
PACKET_PATH = HERE / "EXP_B01_INPUT_PACKET.json"
CANDIDATES_PATH = HERE / "EXP_B01_MOTION_CANDIDATES.json"
PROJECTIONS_PATH = HERE / "EXP_B01_FORWARD_PROJECTIONS.json"
REPORT_PATH = HERE / "EXP_B01_REPORT.json"
REPORT_DE_PATH = HERE / "EXP_B01_REPORT_DE.md"

BASELINE = "c6681b8833ce86b5eca3caafb1e2e55728ee3e1a"
REFERENCE_SHA256 = "8aadeeec4b4c8cd591a597aef59b8390585db7e8f6a5346e88b37bd41cbc71ce"
REFERENCE_BYTES = 324
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


def write_json(path: Path, value: object) -> None:
    path.write_bytes((json.dumps(value, indent=2, sort_keys=True) + "\n").encode("utf-8"))


def canonical_json_bytes(value: object) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")


def artifact(path: Path) -> dict:
    data = path.read_bytes()
    return {
        "path": path.relative_to(HERE).as_posix(),
        "bytes": len(data),
        "sha256": sha256(data),
    }


def read_track_a_reference() -> tuple[bytes, list[dict]]:
    raw = REFERENCE.read_bytes()
    if len(raw) != REFERENCE_BYTES or sha256(raw) != REFERENCE_SHA256:
        raise ValueError("TRACK_A_REFERENCE_INTEGRITY_FAILURE")
    text = raw.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text, newline=""))
    if reader.fieldnames != EXPECTED_HEADER:
        raise ValueError("TRACK_A_HEADER_MISMATCH")
    rows = list(reader)
    if not rows or any(row["closure_status"] != "CLOSED" for row in rows):
        raise ValueError("TRACK_A_CLOSURE_STATUS_MISMATCH")
    return raw, rows


def point_from_row(row: dict) -> tuple[float, float]:
    point = (float(row["x_mm"]), float(row["y_mm"]))
    if not all(math.isfinite(value) for value in point):
        raise ValueError("NON_FINITE_REFERENCE_POINT")
    return point


def create_authorized_packet(reference_rows: list[dict]) -> dict:
    """Boundary extraction: directed row order becomes an undirected cycle."""
    directed = [point_from_row(row) for row in reference_rows]
    if directed[0] != directed[-1]:
        raise ValueError("REFERENCE_NOT_EXPLICITLY_CLOSED")
    ring = directed[:-1]
    if len(ring) < 3 or len(set(ring)) != len(ring):
        raise ValueError("PACKET_REQUIRES_DISTINCT_CYCLE_NODES")

    sorted_points = sorted(ring)
    node_id = {point: f"N{index:02d}" for index, point in enumerate(sorted_points)}
    nodes = [
        {"node_id": node_id[point], "x_mm": point[0], "y_mm": point[1]}
        for point in sorted_points
    ]
    edges = set()
    for left, right in zip(ring, ring[1:] + ring[:1]):
        edge = tuple(sorted((node_id[left], node_id[right])))
        edges.add(edge)
    packet = {
        "packet_id": "TB-B01-0001",
        "representation": "UNDIRECTED_CYCLIC_GEOMETRY",
        "coordinate_unit": "mm",
        "nodes": nodes,
        "undirected_edges": [list(edge) for edge in sorted(edges)],
        "closed_cycle_connectivity": len(edges) == len(nodes),
    }
    return packet


def recursively_find_forbidden_keys(value: object) -> set[str]:
    found = set()
    if isinstance(value, dict):
        for key, child in value.items():
            if key.lower() in FORBIDDEN_PACKET_KEYS:
                found.add(key)
            found.update(recursively_find_forbidden_keys(child))
    elif isinstance(value, list):
        for child in value:
            found.update(recursively_find_forbidden_keys(child))
    return found


def packet_graph(packet: dict) -> tuple[dict[str, tuple[float, float]], dict[str, set[str]]]:
    nodes = {
        node["node_id"]: (float(node["x_mm"]), float(node["y_mm"]))
        for node in packet["nodes"]
    }
    adjacency = {node: set() for node in nodes}
    for left, right in packet["undirected_edges"]:
        adjacency[left].add(right)
        adjacency[right].add(left)
    if any(len(neighbors) != 2 for neighbors in adjacency.values()):
        raise ValueError("PACKET_NOT_A_SIMPLE_UNDIRECTED_CYCLE")
    return nodes, adjacency


def traverse_cycle(start: str, first_neighbor: str, adjacency: dict[str, set[str]]) -> list[str]:
    sequence = [start, first_neighbor]
    previous, current = start, first_neighbor
    while current != start:
        next_nodes = adjacency[current] - {previous}
        if len(next_nodes) != 1:
            raise ValueError("CYCLE_TRAVERSAL_AMBIGUITY_AFTER_FIRST_EDGE")
        following = next(iter(next_nodes))
        sequence.append(following)
        previous, current = current, following
        if len(sequence) > len(adjacency) + 1:
            raise ValueError("CYCLE_TRAVERSAL_DID_NOT_CLOSE")
    if len(sequence) != len(adjacency) + 1:
        raise ValueError("CYCLE_TRAVERSAL_NODE_COUNT_MISMATCH")
    return sequence


def phase_parameterization(sequence: list[str], nodes: dict[str, tuple[float, float]]) -> list[float]:
    cumulative = [0.0]
    for left, right in zip(sequence, sequence[1:]):
        cumulative.append(cumulative[-1] + math.dist(nodes[left], nodes[right]))
    total = cumulative[-1]
    if total <= 0:
        raise ValueError("ZERO_CANDIDATE_PATH_LENGTH")
    return [distance / total for distance in cumulative]


def construct_candidates(packet: dict) -> dict:
    """Consumes only the authorized packet."""
    forbidden = recursively_find_forbidden_keys(packet)
    if forbidden:
        raise ValueError(f"FORBIDDEN_TRACK_B_PACKET_KEYS:{sorted(forbidden)}")
    nodes, adjacency = packet_graph(packet)
    start = min(nodes, key=lambda node: nodes[node])
    neighbors = sorted(adjacency[start], key=lambda node: nodes[node])
    if len(neighbors) != 2:
        raise ValueError("START_NODE_DOES_NOT_HAVE_TWO_CANDIDATE_DIRECTIONS")

    candidates = []
    for index, first_neighbor in enumerate(neighbors, start=1):
        sequence = traverse_cycle(start, first_neighbor, adjacency)
        phases = phase_parameterization(sequence, nodes)
        candidates.append({
            "candidate_id": f"MOTION-CANDIDATE-{index:02d}",
            "technical_model": "PIECEWISE_LINEAR_UNIT_PHASE_TRAVERSAL",
            "ordered_node_cycle": sequence,
            "unitless_phase": phases,
            "positions_mm": [list(nodes[node]) for node in sequence],
        })

    return {
        "translation_boundary": "n1",
        "translation_boundary_status": "PROVISIONAL_TECHNICAL_LABEL_ONLY",
        "provisional_assumptions": [
            "PROVISIONAL_TRACK_B_ASSUMPTION: choose the lexicographically smallest coordinate as an operational start",
            "PROVISIONAL_TRACK_B_ASSUMPTION: enumerate both outgoing undirected edges without preference",
            "PROVISIONAL_TRACK_B_ASSUMPTION: use piecewise-linear traversal between packet nodes",
            "PROVISIONAL_TRACK_B_ASSUMPTION: use cumulative geometric length as a unitless phase parameter",
            "PROVISIONAL_TRACK_B_ASSUMPTION: phase is not time, speed, velocity or physical motion",
        ],
        "candidate_count": len(candidates),
        "minimum_compatible_start_direction_combinations": len(nodes) * 2,
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
            "unitless_phase": candidate["unitless_phase"],
            "points_mm": points,
            "closed_cycle_connectivity": points[0] == points[-1],
        })
    return {"projection_count": len(projections), "projections": projections}


def multiset(points: list[list[float]] | list[tuple[float, float]]) -> list[tuple[float, float]]:
    return sorted(tuple(point) for point in points)


def compare_projections(reference_rows: list[dict], projections: dict) -> dict:
    reference_points = [point_from_row(row) for row in reference_rows]
    reference_phase = [float(row["s_norm"]) for row in reference_rows]
    results = []
    for projection in projections["projections"]:
        points = [tuple(point) for point in projection["points_mm"]]
        results.append({
            "candidate_id": projection["candidate_id"],
            "exact_ordered_xy_equality": "PASS" if points == reference_points else "FAIL",
            "geometric_sample_multiset_agreement": "PASS" if multiset(points) == multiset(reference_points) else "FAIL",
            "local_index_shape_agreement": "PASS" if projection["local_index"] == list(range(len(reference_rows))) else "FAIL",
            "s_norm_vs_unitless_phase_agreement": "PASS_PROVISIONAL_ASSUMPTION" if projection["unitless_phase"] == reference_phase else "FAIL",
            "closed_cycle_property_agreement": "PASS" if projection["closed_cycle_connectivity"] and all(row["closure_status"] == "CLOSED" for row in reference_rows) else "FAIL",
            "sample_uuid_recovery": "NOT_RECOVERABLE_FROM_AUTHORIZED_PACKET",
            "closure_status_assignment": "NOT_PERFORMED_BY_TRACK_B",
        })
    return {
        "candidate_results": results,
        "comparison_boundaries": {
            "exact_available_field_comparison": "EXECUTED",
            "geometric_sample_agreement": "EXECUTED_EXACT_NO_TOLERANCE",
            "direct_row_order_agreement": "EXECUTED",
            "closure_property_agreement": "EXECUTED",
            "cyclic_origin_quotient_comparison": "NOT_EXECUTED_NO_GOVERNING_METHOD",
            "reversal_quotient_comparison": "NOT_EXECUTED_NO_GOVERNING_METHOD",
            "scientific_motion_metric": "NOT_DEFINED",
        },
    }


def build_track_b_objects(reference_rows: list[dict]) -> tuple[dict, dict, dict, dict]:
    """Rebuild every Track B object from the authorized boundary input."""
    packet = create_authorized_packet(reference_rows)
    if recursively_find_forbidden_keys(packet):
        raise ValueError("TRACK_B_PACKET_LEAKAGE")
    candidates = construct_candidates(packet)
    projections = forward_project(candidates)
    comparison = compare_projections(reference_rows, projections)
    return packet, candidates, projections, comparison


def german_report(report: dict) -> str:
    results = report["comparison"]["candidate_results"]
    lines = [
        "# EXP-B01 — Trace-to-Motion Direction Change",
        "",
        "Status: `SYNTHETIC ENGINEERING PROBE — SCIENTIFIC RESULT NONE`",
        "",
        "## Was Track B erhalten hat",
        "",
        "Track B erhielt ein Richtungsloses Zykluspaket mit vier Koordinatenknoten,",
        "vier ungerichteten Kanten und einer opaque Packet-ID. Zeit, Richtung,",
        "Source Order, `sample_uuid`, `trace_index`, `s_norm`, Marker, Branch- und",
        "Derivationsinformationen wurden nicht übergeben.",
        "",
        "## Was n₁ verändert hat",
        "",
        "`n₁` wurde ausschließlich als technische Übersetzungsgrenze verwendet.",
        "Aus einer ungerichteten Trace-Geometrie wurden mögliche geordnete,",
        "unitless parametrisierte Bewegungskandidaten. Es wurde keine physikalische",
        "oder symbolische Bedeutung zugewiesen.",
        "",
        "## Rekonstruktion und Mehrdeutigkeit",
        "",
        "Zwei entgegengesetzte Zyklusdurchläufe wurden konstruiert. Beide sind mit",
        "dem Richtungslosen Paket vereinbar. Bei vier möglichen Startknoten und zwei",
        "Durchlaufrichtungen existieren bereits mindestens acht kompatible",
        "Start-/Richtungskombinationen.",
        "",
        "Direkt rekonstruierbar waren Knotenkoordinaten, ungerichtete Nachbarschaft",
        "und geschlossene Zyklusstruktur. Nur unter provisorischer Annahme entstanden",
        "Startpunkt, Durchlaufrichtung und unitless Phase. Nicht rekonstruierbar waren",
        "Zeit, Geschwindigkeit, physikalische Bewegung, ursprünglicher Start,",
        "Source Direction, `tau`, Marker und `sample_uuid`.",
        "",
        "## Vorwärtsprojektion",
        "",
    ]
    for result in results:
        lines.append(
            f"- `{result['candidate_id']}`: ordered XY `{result['exact_ordered_xy_equality']}`, "
            f"sample set `{result['geometric_sample_multiset_agreement']}`, "
            f"closure `{result['closed_cycle_property_agreement']}`."
        )
    lines.extend([
        "",
        "Beide Kandidaten projizierten auf dieselbe ungerichtete Trace-Geometrie",
        "zurück. Nur einer reproduzierte die vorhandene Zeilenreihenfolge direkt.",
        "Ein Reversal- oder Cyclic-Origin-Quotientenvergleich wurde nicht ausgeführt,",
        "weil kein governing comparison method vorliegt.",
        "",
        "## Frühester Informationsverlust",
        "",
        "Der erste konkrete Verlust liegt am ersten gerichteten Schritt: Am gewählten",
        "Startknoten sind zwei Nachbarn geometrisch kompatibel, und keine autorisierte",
        "Track-B-Information entscheidet, welcher Nachbar zuerst durchlaufen wurde.",
        "Noch davor fehlt ein intrinsischer Startpunkt. Zeitinformation fehlt vollständig.",
        "",
        "## Architektonische Hypothesen",
        "",
        "`n₁`, der `(β-m|j)η`-Split und die `RA–TH Bridge` bleiben ausschließlich",
        "unbewertete architektonische Hypothesen. Dieses Experiment definiert sie",
        "nicht als Physik, Symbolik oder Wissenschaft.",
        "",
        "## Ergebnis",
        "",
        "Der erste kontrollierte Repräsentationswechsel wurde technisch ausgeführt.",
        "Er zeigt Existenz kompatibler Bewegungskandidaten, nicht deren Eindeutigkeit",
        "oder physikalische Wahrheit.",
        "",
        "```text",
    ])
    for key, value in report["final_status"].items():
        lines.append(f"{key}: {value}")
    lines.extend(["```", ""])
    return "\n".join(lines)


def run() -> dict:
    reference_raw, reference_rows = read_track_a_reference()
    packet, candidates, projections, comparison = build_track_b_objects(reference_rows)
    write_json(PACKET_PATH, packet)

    # Reloading establishes the representation boundary: candidate construction
    # receives only the authorized packet artifact.
    packet_for_translation = json.loads(PACKET_PATH.read_text(encoding="utf-8"))
    candidates = construct_candidates(packet_for_translation)
    write_json(CANDIDATES_PATH, candidates)
    projections = forward_project(candidates)
    write_json(PROJECTIONS_PATH, projections)
    comparison = compare_projections(reference_rows, projections)

    # A fresh in-memory reconstruction must reproduce the same four Track B
    # objects.  This is an engineering replay check, not a scientific result.
    replay_objects = build_track_b_objects(reference_rows)
    primary_objects = (packet, candidates, projections, comparison)
    replay_equal = all(
        canonical_json_bytes(primary) == canonical_json_bytes(replay)
        for primary, replay in zip(primary_objects, replay_objects)
    )

    candidate_results = comparison["candidate_results"]
    geometric_pass = all(item["geometric_sample_multiset_agreement"] == "PASS" for item in candidate_results)
    closure_pass = all(item["closed_cycle_property_agreement"] == "PASS" for item in candidate_results)
    final_status = {
        "TRACK_A_REFERENCE_INTEGRITY": "PASS" if len(reference_raw) == REFERENCE_BYTES and sha256(reference_raw) == REFERENCE_SHA256 else "FAIL",
        "TRACK_B_INPUT_BOUNDARY": "PASS",
        "N1_TRANSLATION_EXECUTED": "PASS",
        "MOTION_CANDIDATE_CREATED": "PASS" if len(candidates["candidates"]) >= 1 else "FAIL",
        "ALTERNATIVE_CANDIDATE_CREATED": "PASS" if len(candidates["candidates"]) >= 2 else "FAIL",
        "FORWARD_PROJECTION_EXECUTED": "PASS" if len(projections["projections"]) == len(candidates["candidates"]) else "FAIL",
        "TRACE_COMPARISON_EXECUTED": "PARTIAL" if geometric_pass and closure_pass else "FAIL",
        "AMBIGUITY_REPORTED": "YES",
        "INFORMATION_LOSS_REPORTED": "YES",
        "DETERMINISTIC_REPLAY": "PASS" if replay_equal else "FAIL",
        "FIRST_DIRECTION_CHANGE": "PASS" if geometric_pass and closure_pass else "FAIL",
        "SCIENTIFIC_RESULT": "NONE",
        "HUMAN_ACQUISITION": "PROHIBITED",
    }

    report = {
        "experiment_id": "TRACK-B-EXP-B01",
        "baseline_commit": BASELINE,
        "experiment_class": "SYNTHETIC_ENGINEERING_PROBE",
        "core_question": "What motion information survives translation from an authorized direction-free trace packet?",
        "n1": {
            "role": "PROVISIONAL_TECHNICAL_TRANSLATION_BOUNDARY",
            "physical_meaning": "NONE",
            "symbolic_meaning": "NONE",
            "scientific_status": "NOT_ESTABLISHED",
        },
        "architectural_hypotheses_not_evaluated": ["(β-m|j)η split", "RA–TH Bridge"],
        "track_a_reference": {
            "bytes": len(reference_raw),
            "sha256": sha256(reference_raw),
            "modified": False,
        },
        "track_b_packet": {
            "representation": packet["representation"],
            "node_count": len(packet["nodes"]),
            "edge_count": len(packet["undirected_edges"]),
            "forbidden_keys_present": [],
            "consumed_by_translation": "PACKET_ONLY",
        },
        "information_classification": {
            "directly_recoverable": [
                "coordinate nodes", "undirected adjacency", "closed-cycle connectivity", "segment lengths"
            ],
            "recoverable_only_under_provisional_assumption": [
                "operational start node", "traversal direction", "piecewise-linear interpolation", "unitless phase"
            ],
            "non_unique": [
                "start node", "traversal orientation", "phase origin", "motion candidate"
            ],
            "not_recoverable": [
                "time", "tau", "speed", "velocity", "acceleration", "forces", "source traversal direction",
                "source start", "sample_uuid", "markers", "physical cause"
            ],
        },
        "earliest_information_loss_at_n1": (
            "At the first directed transition from the provisional start, two adjacent nodes are equally compatible; "
            "the authorized packet contains no datum selecting the first outgoing edge."
        ),
        "provisional_assumptions": candidates["provisional_assumptions"],
        "motion_candidates": candidates["candidates"],
        "forward_projection": projections,
        "comparison": comparison,
        "deterministic_replay": {
            "status": "PASS" if replay_equal else "FAIL",
            "objects_compared": [
                "authorized input packet",
                "motion candidates",
                "forward projections",
                "trace comparison",
            ],
            "method": "fresh deterministic reconstruction and canonical JSON byte comparison",
        },
        "remaining_blockers": [
            "no authorized cyclic-origin comparison implementation",
            "no authorized reversal-quotient comparison implementation",
            "no timing or source-direction information in the authorized packet",
            "no independent Track B evaluator or decision rule (O-11)",
            "no scientific motion model or metric inventory (O-10)",
            "Human acquisition remains unauthorized (O-21)",
        ],
        "final_status": final_status,
        "frozen_track_a_modified": False,
        "track_c_started": False,
        "moving_mask_implemented": False,
        "scientific_result": "NONE",
        "human_acquisition": "PROHIBITED",
    }

    write_json(REPORT_PATH, report)
    REPORT_DE_PATH.write_bytes(german_report(report).encode("utf-8"))
    return report


if __name__ == "__main__":
    result = run()
    print(json.dumps(result, indent=2, sort_keys=True))
