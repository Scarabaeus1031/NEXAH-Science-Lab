#!/usr/bin/env python3
"""Bounded edge-incidence audit using the original, unchanged E8-REP-03 code."""

from __future__ import annotations

import importlib.util
import json
import tempfile
import zipfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
ARCHIVE = ROOT / "NEXAH_E8_REP_03_BENCHMARK.zip"


def main() -> int:
    with tempfile.TemporaryDirectory() as scratch:
        with zipfile.ZipFile(ARCHIVE) as src:
            for entry in src.infolist():
                path = Path(entry.filename)
                if path.is_absolute() or ".." in path.parts:
                    raise ValueError("Unsafe archive path")
            src.extractall(scratch)
        code = Path(scratch) / "E8_REP_03_BENCHMARK" / "e8_rep_03.py"
        spec = importlib.util.spec_from_file_location("e8_rep_03_original", code)
        assert spec is not None and spec.loader is not None
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        roots = module.e8_roots()
        coxeter = module.coxeter_matrix(module.simple_roots())
        projected = roots @ module.eigenspace_basis(coxeter, (1, 11))
        shells = module.cluster_indices(np.linalg.norm(projected, axis=1))
        assert len(shells) == 2 and all(len(shell) == 120 for shell in shells)

        source_dist_sq = np.sum((roots[:, None, :] - roots[None, :, :])**2, axis=2)
        source_edges = np.isclose(source_dist_sq, 2.0, atol=1e-10)
        np.fill_diagonal(source_edges, False)
        total_source_edges = int(np.count_nonzero(np.triu(source_edges, 1)))
        within = [int(np.count_nonzero(np.triu(source_edges[np.ix_(s, s)], 1)))
                  for s in shells]
        cross = int(np.count_nonzero(source_edges[np.ix_(shells[0], shells[1])]))
        assert (total_source_edges, within, cross) == (6720, [1920, 1920], 2880)
        assert sum(within) + cross == total_source_edges

        shell_results = []
        for rank, indices in enumerate(shells):
            p = projected[indices]
            distance_sq = np.sum((p[:, None, :] - p[None, :, :])**2, axis=2)
            np.fill_diagonal(distance_sq, np.inf)
            nearest = float(np.min(distance_sq))
            h4_edges = np.isclose(distance_sq, nearest, atol=1e-10)
            np.fill_diagonal(h4_edges, False)
            h4_count = int(np.count_nonzero(np.triu(h4_edges, 1)))
            source_within = source_edges[np.ix_(indices, indices)]
            overlap = int(np.count_nonzero(np.triu(h4_edges & source_within, 1)))
            nearest_pairs = np.triu(h4_edges, 1)
            source_distances_for_h4_edges = sorted(set(
                round(float(d), 8) for d in source_dist_sq[np.ix_(indices, indices)][nearest_pairs]
            ))
            assert h4_count == 720 and 2 * h4_count // len(indices) == 12
            assert overlap == (0 if rank == 0 else 720)
            assert source_distances_for_h4_edges == ([4.0] if rank == 0 else [2.0])
            shell_results.append({
                "shell": "small" if rank == 0 else "large",
                "vertices": len(indices), "nearest_neighbor_edges_in_projected_4d": h4_count,
                "nearest_neighbor_degree": 12,
                "nearest_neighbor_squared_distance_in_projected_4d": nearest,
                "original_E8_squared_distance_of_these_720_pairs": source_distances_for_h4_edges,
                "overlap_with_E8_edges_among_same_shell_points": overlap,
                "all_E8_edges_among_same_shell_points": within[rank],
            })
        result = {
            "status": "PASS_BOUNDED",
            "source": "unaltered NEXAH_E8_REP_03_BENCHMARK.zip",
            "E8_edge_rule": "squared 8D Euclidean distance = 2",
            "E8_roots": len(roots), "E8_degree": 56,
            "E8_edges": total_source_edges,
            "E8_edges_within_small_and_large_shell": within,
            "E8_edges_between_shells": cross,
            "H4_edge_rule": "minimum nonzero 4D projected distance within each 120-point shell",
            "H4_shells": shell_results,
            "six_times_720": 6 * 720,
            "six_times_720_equals_E8_edges": 6 * 720 == total_source_edges,
            "exact_number_relations": {"6=2*3": 6 == 2 * 3,
                                       "6=3+3": 6 == 3 + 3,
                                       "2+3=5": 2 + 3 == 5,
                                       "V+V=X_as_roman_values": 5 + 5 == 10},
            "type_boundary": "6 is a squared projected length in ROOT7 test, 720 counts H4 nearest-neighbor edges, 6720 counts E8 edges under a different metric; arithmetic equalities alone do not map these types.",
            "provenance_boundary": "The E8/H4 projection is a calibrated representation, not an identification of the sqrt(7) sign model with either root system.",
        }
        assert result["six_times_720_equals_E8_edges"] is False
        (ROOT / "E8_H4_EDGE_RESULTS.json").write_text(
            json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        print(json.dumps({"status": result["status"], "E8_edges": total_source_edges,
                          "source_edge_partition": within + [cross],
                          "H4_edge_overlap": [r["overlap_with_E8_edges_among_same_shell_points"]
                                              for r in shell_results]}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
