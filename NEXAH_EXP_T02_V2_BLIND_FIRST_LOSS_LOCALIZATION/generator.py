"""Frozen synthetic suite generator for EXP-T02-v2."""

from __future__ import annotations

import hashlib
import random


LABELS = ("T1", "T2", "T3", "T4", "T5", "T6", "NO_LOSS")
STAGES = 7
FEATURES = ("target", "n0", "n1", "n2", "n3", "n4")


class FixtureError(RuntimeError):
    pass


def _loss_number(label: str) -> int:
    return 7 if label == "NO_LOSS" else int(label[1:])


def _opaque_id(seed_hex: str, suite: str, ordinal: int) -> str:
    data = f"{seed_hex}|{suite}|{ordinal}".encode()
    return hashlib.sha256(data).hexdigest()[:20]


def _components(nodes: list[str], edges: list[tuple[str, str]]) -> list[list[str]]:
    adjacency = {n: set() for n in nodes}
    for a, b in edges:
        adjacency[a].add(b)
        adjacency[b].add(a)
    result = []
    unseen = set(nodes)
    while unseen:
        todo = [min(unseen)]
        comp = set()
        while todo:
            node = todo.pop()
            if node in comp:
                continue
            comp.add(node)
            todo.extend(sorted(adjacency[node] - comp))
        unseen -= comp
        result.append(sorted(comp))
    return sorted(result)


def _make_case(rng: random.Random, seed_hex: str, suite: str, ordinal: int, label: str) -> tuple[dict, dict]:
    case_id = _opaque_id(seed_hex, suite, ordinal)
    target_loss = _loss_number(label)
    losses = {"target": target_loss}
    for feature in FEATURES[1:]:
        losses[feature] = rng.randint(1, 7)

    base_values = {feature: rng.randint(-900_000, 900_000) for feature in FEATURES}
    right_values = {}
    for feature in FEATURES:
        delta = rng.randint(1, 50_000)
        right_values[feature] = base_values[feature] + delta

    aliases_by_stage = []
    stages = []
    base_nodes = [f"g{i}" for i in range(5)]
    graph_loss = rng.randint(1, 7)
    edge_template = [("g0", "g1", 2), ("g1", "g2", 3), ("g2", "g3", 5), ("g3", "g4", 7)]

    for stage in range(STAGES):
        shuffled = list(FEATURES)
        rng.shuffle(shuffled)
        aliases = {source: f"x{stage}_{index}_{rng.randrange(1 << 24):06x}" for index, source in enumerate(shuffled)}
        aliases_by_stage.append(aliases)
        left_features = {}
        right_features = {}
        for source in FEATURES:
            alias = aliases[source]
            left_features[alias] = base_values[source]
            right_features[alias] = right_values[source] if stage < losses[source] else base_values[source]

        left_edges = [list(edge) for edge in edge_template]
        if stage < graph_loss:
            right_edges = [list(edge) for edge in edge_template]
            right_edges[ordinal % len(right_edges)][2] += 1 + ordinal % 3
        else:
            right_edges = [list(edge) for edge in edge_template]
        stages.append({
            "stage_index": stage,
            "left": {"features": left_features, "weighted_edges": left_edges, "nodes": base_nodes},
            "right": {"features": right_features, "weighted_edges": right_edges, "nodes": base_nodes},
        })

    survival = []
    for stage, aliases in enumerate(aliases_by_stage):
        alias = aliases["target"]
        survival.append(int(stages[stage]["left"]["features"][alias] != stages[stage]["right"]["features"][alias]))
    expected = [1 if stage < target_loss else 0 for stage in range(STAGES)]
    if survival != expected:
        raise FixtureError("oracle survival mismatch")

    public = {
        "case_id": case_id,
        "suite": suite,
        "query": {"kind": "EXACT_SOURCE_OBSERVABLE_DIFFERENCE", "target_feature_id": "target"},
        "correspondence": {source: [aliases[source] for aliases in aliases_by_stage] for source in FEATURES},
        "stages": stages,
    }
    sealed = {"case_id": case_id, "suite": suite, "survival": survival, "true_first_loss_stage": label}
    return public, sealed


def _validate(public_cases: list[dict], sealed_records: list[dict]) -> None:
    if len(public_cases) != len(sealed_records):
        raise FixtureError("public/sealed count mismatch")
    ids = [c["case_id"] for c in public_cases]
    if len(ids) != len(set(ids)):
        raise FixtureError("duplicate case id")
    forbidden = {"survival", "true_first_loss_stage", "drop_stage", "seed"}
    for case in public_cases:
        if forbidden & set(case):
            raise FixtureError("sealed field leaked into public case")
        if len(case["stages"]) != STAGES:
            raise FixtureError("stage count")
        for source, aliases in case["correspondence"].items():
            if len(aliases) != STAGES or len(set(aliases)) != STAGES:
                raise FixtureError(f"alias correspondence {source}")
        for stage in case["stages"]:
            if set(stage["left"]["features"]) != set(stage["right"]["features"]):
                raise FixtureError("one-sided feature")
            if not all(isinstance(v, int) for side in ("left", "right") for v in stage[side]["features"].values()):
                raise FixtureError("noninteger feature")
    for record in sealed_records:
        vector = record["survival"]
        if len(vector) != STAGES or vector[0] != 1 or any(vector[i] < vector[i + 1] for i in range(STAGES - 1)):
            raise FixtureError("invalid monotone oracle")


def generate_suite(seed_hex: str) -> tuple[list[dict], list[dict]]:
    if len(seed_hex) != 64:
        raise FixtureError("seed must be 256-bit hex")
    seed_int = int(seed_hex, 16)
    held_rng = random.Random(seed_int)
    control_rng = random.Random(0x54574F5632)
    public_cases = []
    sealed_records = []

    ordinal = 0
    for label in LABELS:
        for _ in range(2):
            public, sealed = _make_case(control_rng, "0" * 64, "CONTROL", ordinal, label)
            public_cases.append(public)
            sealed_records.append(sealed)
            ordinal += 1

    held = [label for label in LABELS for _ in range(12)]
    held_rng.shuffle(held)
    for index, label in enumerate(held):
        public, sealed = _make_case(held_rng, seed_hex, "HELD_OUT", index, label)
        public_cases.append(public)
        sealed_records.append(sealed)

    _validate(public_cases, sealed_records)
    held_counts = {label: sum(r["suite"] == "HELD_OUT" and r["true_first_loss_stage"] == label for r in sealed_records) for label in LABELS}
    if any(count != 12 for count in held_counts.values()):
        raise FixtureError("held-out stratification")
    return public_cases, sealed_records

