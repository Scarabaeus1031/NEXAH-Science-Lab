from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np

SRC = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC))

from core import CORE, M_BAR_DEN, block_starts, build_first_order_arrays, observed_components, phase_offsets, shake_permutation
from source_generator import generate_digits


class ContractTests(unittest.TestCase):
    def test_source_generation_is_deterministic(self) -> None:
        a, ids_a = generate_digits()
        b, ids_b = generate_digits()
        self.assertTrue(np.array_equal(a, b))
        self.assertEqual(ids_a, ids_b)
        self.assertEqual(a.shape, (512, 18))
        self.assertTrue(np.all((a >= 0) & (a <= 9)))

    def test_transport_is_exact_plus_one(self) -> None:
        for c in range(6):
            s2, s3 = phase_offsets(c)
            n2, n3 = phase_offsets((c + 1) % 6)
            self.assertTrue(np.array_equal(block_starts(2, s2, CORE) + 1, block_starts(2, n2, CORE + 1)))
            self.assertTrue(np.array_equal(block_starts(3, s3, CORE) + 1, block_starts(3, n3, CORE + 1)))

    def test_exact_integer_metric_identity(self) -> None:
        digits = np.tile(np.arange(18, dtype=np.uint8) % 10, (2, 1))
        fields = build_first_order_arrays(digits)
        parts = observed_components(fields)
        expected = np.minimum(6 * parts["A"], 4 * parts["B"]) - parts["C"]
        self.assertTrue(np.array_equal(parts["M_num"], expected))
        self.assertEqual(M_BAR_DEN, 1296 * 512 * 6)

    def test_relation_joint_reconstruction(self) -> None:
        digits = np.tile(np.asarray([0, 1] * 9, dtype=np.uint8), (3, 1))
        fields = build_first_order_arrays(digits)
        parts = observed_components(fields)
        self.assertTrue(np.array_equal(parts["q_pre"], 3 * fields["a2_pre"] - 2 * fields["a3_pre"]))

    def test_shake_permutation_is_deterministic_and_bijective(self) -> None:
        key = bytes.fromhex("00" * 32)
        a = shake_permutation(key, "fixture", 12)
        b = shake_permutation(key, "fixture", 12)
        self.assertTrue(np.array_equal(a, b))
        self.assertEqual(sorted(a.tolist()), list(range(12)))

    def test_constant_digits_have_zero_change(self) -> None:
        digits = np.full((1, 18), 7, dtype=np.uint8)
        parts = observed_components(build_first_order_arrays(digits))
        self.assertTrue(np.all(parts["A"] == 0))
        self.assertTrue(np.all(parts["B"] == 0))
        self.assertTrue(np.all(parts["C"] == 0))
        self.assertTrue(np.all(parts["M_num"] == 0))


if __name__ == "__main__":
    unittest.main()
