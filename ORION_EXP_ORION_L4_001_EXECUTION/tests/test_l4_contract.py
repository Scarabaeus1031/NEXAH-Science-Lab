import hashlib
import tempfile
import unittest
from pathlib import Path

import numpy as np

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from l4_core import PULLBACK_METRIC, SCALE_MATRIX, anchored_ranks, metric_distances, pair_summary, save_npz_deterministic, sha256_file


class L4ContractTests(unittest.TestCase):
    def test_anchored_tie_blocks_match_frozen_algorithm(self):
        scores = np.array([0.0, 0.9e-6, 1.8e-6, 2.0, 3.0, 4.0, 5.0])
        ranks = anchored_ranks(scores, 1e-6)
        self.assertEqual(ranks.tolist(), [1.5, 1.5, 3.0, 4.0, 5.0, 6.0, 7.0])

    def test_pullback_distance_equals_native_distance(self):
        rng = np.random.default_rng(7)
        left = rng.normal(size=(5, 3))
        right = rng.normal(size=(11, 3))
        native = metric_distances(left, right)
        transformed = metric_distances(left @ SCALE_MATRIX.T, right @ SCALE_MATRIX.T, PULLBACK_METRIC)
        np.testing.assert_allclose(native, transformed, rtol=0.0, atol=2e-15)

    def test_identical_preorders_have_unit_tau_and_kappa(self):
        ranks = np.tile(np.arange(1.0, 8.0), (4, 1))
        result = pair_summary(ranks, ranks)
        self.assertEqual(result["mean_tau_b"], 1.0)
        self.assertEqual(result["mean_kappa"], 1.0)

    def test_npz_serialization_is_deterministic(self):
        with tempfile.TemporaryDirectory() as directory:
            first = Path(directory) / "a.npz"
            second = Path(directory) / "b.npz"
            arrays = {"x": np.arange(10), "y": np.eye(3)}
            save_npz_deterministic(first, **arrays)
            save_npz_deterministic(second, **arrays)
            self.assertEqual(sha256_file(first), sha256_file(second))


if __name__ == "__main__":
    unittest.main()
