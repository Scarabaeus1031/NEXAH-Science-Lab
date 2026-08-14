"""Independent conventional diagnostics for public EXP-T02-v2 cases."""

from __future__ import annotations


def _first_loss(signal):
    if len(signal) != 7 or not signal[0]:
        return "UNRESOLVED"
    if any(signal[i] < signal[i + 1] for i in range(6)):
        return "UNRESOLVED"
    for stage in range(1, 7):
        if signal[stage - 1] and not signal[stage]:
            return f"T{stage}"
    return "NO_LOSS"


def _edges(rep):
    return sorted((str(a), str(b), int(w)) for a, b, w in rep["weighted_edges"])


def _directed(rep):
    return sorted((a, b) for a, b, _ in _edges(rep))


def _undirected(rep):
    return sorted({tuple(sorted((a, b))) for a, b in _directed(rep)})


def _component_sizes(rep):
    nodes = set(rep["nodes"])
    adjacency = {node: set() for node in nodes}
    for a, b in _undirected(rep):
        adjacency[a].add(b)
        adjacency[b].add(a)
    sizes = []
    while nodes:
        todo = [min(nodes)]
        seen = set()
        while todo:
            node = todo.pop()
            if node in seen:
                continue
            seen.add(node)
            todo.extend(adjacency[node] - seen)
        nodes -= seen
        sizes.append(len(seen))
    return sorted(sizes)


def _canonical(rep):
    return (tuple(sorted(rep["features"].items())), tuple(_edges(rep)), tuple(sorted(rep["nodes"])))


def evaluate_case(case):
    signals = {name: [] for name in ("B0", "B1", "B2", "B3", "B4", "B5", "B6")}
    details = {name: [] for name in signals}
    for stage in case["stages"]:
        left, right = stage["left"], stage["right"]
        values_l = sorted(left["features"].values())
        values_r = sorted(right["features"].values())
        observations = {
            "B0": _canonical(left) != _canonical(right),
            "B1": values_l != values_r,
            "B2": len(left["features"]) != len(right["features"]),
            "B3": _edges(left) != _edges(right),
            "B4": _directed(left) != _directed(right),
            "B5": _undirected(left) != _undirected(right),
            "B6": _component_sizes(left) != _component_sizes(right),
        }
        for name, changed in observations.items():
            signals[name].append(int(changed))
            details[name].append({"stage": stage["stage_index"], "changed": bool(changed)})
    return {name: {"prediction": _first_loss(signals[name]), "survival": signals[name], "details": details[name]} for name in sorted(signals)}


def evaluate_all(cases):
    return {case["case_id"]: evaluate_case(case) for case in cases}

