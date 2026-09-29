#!/usr/bin/env python3
"""Exhaustive bounded audit of the proposed 3|1|3 radial-shell path."""
import json
from itertools import product
from pathlib import Path


def norm2(p):
    return sum(x * x for x in p)


def unit_step(a, b):
    differences = [y - x for x, y in zip(a, b, strict=True)]
    return sorted(differences) == [0, 0, 0, 1]


result = {}
for long_axis, channel in enumerate(("√2/x", "√3/y", "√5/z", "√7/w")):
    max_coord = tuple(2 if i == long_axis else 1 for i in range(4))
    vertices = list(product(*(range(k + 1) for k in max_coord)))
    corners = set(product(*((0, k) for k in max_coord)))
    zero = (0, 0, 0, 0)
    tip = max_coord
    paths = []
    for q1 in vertices:
        if norm2(q1) != 3:
            continue
        for q2 in vertices:
            if norm2(q2) == 4 and unit_step(q1, q2) and unit_step(q2, tip):
                paths.append((zero, q1, q2, tip))
    assert len(vertices) == 24 and len(corners) == 16
    assert len(paths) == 4
    assert all([norm2(q) for q in path] == [0, 3, 4, 7] for path in paths)
    assert all(norm2(tuple(y - x for x, y in zip(a, b, strict=True))) == v
               for path in paths for a, b, v in zip(path[:-1], path[1:], (3, 1, 1), strict=True))
    assert all(path[2] not in corners for path in paths)
    assert all(tuple(t - x for t, x in zip(tip, path[1], strict=True)) != path[2]
               for path in paths)
    middle_w_unit_step = [path for path in paths if path[2][3] - path[1][3] == 1]
    assert len(middle_w_unit_step) == 1
    # Code 74 requires the terminal fourth-bit value, not an arbitrary interior w=1.
    old_47_74_code_survives = long_axis != 3
    matching = middle_w_unit_step if old_47_74_code_survives else []
    result[channel] = {
        "lattice_points": len(vertices),
        "corner_sign_states": len(corners),
        "radial_3_1_3_paths_with_last_two_unit_steps": len(paths),
        "paths_with_middle_w_unit_step": len(middle_w_unit_step),
        "paths_with_middle_47_to_74_using_original_endpoint_labels": len(matching),
        "example_middle_47_to_74_path": matching[0] if matching else None,
        "paths_entirely_in_16_corner_states": sum(all(q in corners for q in path) for path in paths),
        "paths_centrosymmetric_about_full_tip": sum(
            tuple(t - x for t, x in zip(tip, path[1], strict=True)) == path[2]
            for path in paths
        ),
    }

assert result["√5/z"]["example_middle_47_to_74_path"] == (
    (0, 0, 0, 0), (1, 1, 1, 0), (1, 1, 1, 1), (1, 1, 2, 1))
result["interpretation"] = (
    "3|1|3 labels changes in squared radius, not the three segment lengths. "
    "It is possible in the 24-point lattice for all long-axis choices; imposing "
    "a middle 47→74 endpoint-bit flip excludes a long w axis, but does not select x/y/z. "
    "None is a centrosymmetric V-to-X proof or a 16-corner-state path."
)
Path(__file__).with_name("root7_313_results.json").write_text(
    json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps({k: (v["radial_3_1_3_paths_with_last_two_unit_steps"],
                      v["paths_with_middle_47_to_74_using_original_endpoint_labels"])
                  for k, v in result.items() if isinstance(v, dict)}, ensure_ascii=False))
