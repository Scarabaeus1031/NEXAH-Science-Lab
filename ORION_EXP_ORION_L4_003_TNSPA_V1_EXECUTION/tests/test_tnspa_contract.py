import tempfile
import unittest
from pathlib import Path
import sys

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from tnspa_core import ACTION_PAIRS, encode_relations, kernel, save_npz, sha, tnspa


class TNSPAContractTests(unittest.TestCase):
    def test_action_pair_count(self):
        self.assertEqual(len(ACTION_PAIRS), 21)
        self.assertEqual(len(set(ACTION_PAIRS)), 21)

    def test_relation_encoding_orientation_and_tie(self):
        ranks = np.array([[1, 2, 2, 4, 5, 6, 7]], dtype=float)
        relations = encode_relations(ranks)
        self.assertEqual(relations.shape, (1, 21))
        self.assertEqual(relations[0, ACTION_PAIRS.index((0, 1))], -1)
        self.assertEqual(relations[0, ACTION_PAIRS.index((1, 2))], 0)
        self.assertEqual(relations[0, ACTION_PAIRS.index((1, 6))], -1)

    def test_exact_kernel_table(self):
        alphabet = np.array([-1, 0, 1], dtype=np.int8)
        observed = kernel(alphabet[:, None], alphabet[None, :])
        expected = np.array([[1, -1, -1], [-1, 0, -1], [-1, -1, 1]], dtype=np.int8)
        np.testing.assert_array_equal(observed, expected)

    def test_full_tie_and_orientation_fixtures(self):
        total = np.full((2, 21), -1, dtype=np.int8)
        full = np.zeros((2, 21), dtype=np.int8)
        reverse = np.full((2, 21), 1, dtype=np.int8)
        self.assertEqual(tnspa(total, total), 1.0)
        self.assertEqual(tnspa(full, full), 0.0)
        self.assertEqual(tnspa(full, total), -1.0)
        self.assertEqual(tnspa(total, reverse), -1.0)

    def test_identical_partial_is_strict_fraction(self):
        partial = np.concatenate((np.full((1, 10), -1, dtype=np.int8), np.zeros((1, 11), dtype=np.int8)), axis=1)
        self.assertEqual(tnspa(partial, partial), 10.0 / 21.0)

    def test_deterministic_npz(self):
        with tempfile.TemporaryDirectory() as directory:
            first = Path(directory) / "first.npz"
            second = Path(directory) / "second.npz"
            save_npz(first, x=np.arange(7), y=np.eye(2))
            save_npz(second, x=np.arange(7), y=np.eye(2))
            self.assertEqual(sha(first), sha(second))


if __name__ == "__main__":
    unittest.main()
