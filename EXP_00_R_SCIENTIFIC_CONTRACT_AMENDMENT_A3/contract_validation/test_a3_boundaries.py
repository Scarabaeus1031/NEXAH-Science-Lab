from __future__ import annotations

from bisect import bisect_right
import hashlib
import itertools
import json
import math
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


def phase_bin(theta):
    pi = float.fromhex("0x1.921fb54442d18p+1")
    if theta == pi:
        theta = -pi
    edges = [float.fromhex(x) for x in json.loads((ROOT / "A3_MACHINE_READABLE_RULES.yaml").read_text())["binning"]["phase"]["edges_hex"]]
    return bisect_right(edges[1:-1], theta)


def clockwise_map(bin_id, occupied):
    if bin_id in occupied:
        return bin_id
    for distance in range(1, 8):
        candidate = (bin_id - distance) % 8
        if candidate in occupied:
            return candidate
    return None


class A3BoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / "A3_MACHINE_READABLE_RULES.yaml").read_text())

    def test_phase_pi_normalization(self):
        pi = float.fromhex("0x1.921fb54442d18p+1")
        self.assertEqual(phase_bin(pi), 0)
        self.assertEqual(phase_bin(-pi), 0)

    def test_internal_phase_edges_go_higher(self):
        edges = [float.fromhex(x) for x in self.data["binning"]["phase"]["edges_hex"]]
        for index, edge in enumerate(edges[1:-1], start=1):
            self.assertEqual(phase_bin(edge), index)
            self.assertEqual(phase_bin(math.nextafter(edge, -math.inf)), index - 1)

    def test_quantile_right_insertion_and_duplicates(self):
        cuts = [1.0, 1.0, 2.0, 3.0]
        self.assertEqual(bisect_right(cuts, 1.0), 2)
        self.assertEqual(bisect_right(cuts, math.nextafter(1.0, -math.inf)), 0)
        self.assertEqual(bisect_right(cuts, 3.0), 4)

    def test_clockwise_direction_and_successive_empty(self):
        self.assertEqual(clockwise_map(0, {7, 2}), 7)
        self.assertEqual(clockwise_map(1, {5}), 5)
        self.assertEqual(clockwise_map(7, {6, 0}), 6)
        self.assertIsNone(clockwise_map(3, set()))

    def test_n1_forward_non_self_inverse(self):
        p = [1, 2, 0, 4, 3]
        self.assertEqual(p[0], 1)
        inverse = [p.index(i) for i in range(5)]
        self.assertEqual(inverse[0], 2)
        self.assertNotEqual(p[0], inverse[0])

    def test_neighbor_distance_ties_use_row_key(self):
        candidates = [(1.0, ("TRAIN_OOF", 12, 4)), (0.5, ("TRAIN_OOF", 13, 1)), (1.0, ("TRAIN_OOF", 11, 9))]
        ordered = sorted(candidates, key=lambda item: (item[0], item[1]))
        self.assertEqual(ordered, [(0.5, ("TRAIN_OOF", 13, 1)), (1.0, ("TRAIN_OOF", 11, 9)), (1.0, ("TRAIN_OOF", 12, 4))])

    def test_rng_payload_and_seed(self):
        payload = b"fixture|state_mismatch|7|SPLIT=TEST|ROW=TEST.6000.3"
        seed = int.from_bytes(hashlib.sha256(payload).digest()[:8], "big", signed=False)
        self.assertEqual(hashlib.sha256(payload).hexdigest(), "7cc3b038228f6bb96d52d4edfefcb2003df4aad87fc41889c1af1515688307dc")
        self.assertEqual(seed, 8990223036306123705)
        self.assertNotEqual(seed, int.from_bytes(hashlib.sha256(payload).digest()[0:8], "little"))

    def test_n5_explicit_first_twelve(self):
        matrices = []
        for perm in itertools.permutations(range(3)):
            parity = 1 if perm in ((0,1,2),(1,2,0),(2,0,1)) else -1
            for signs in itertools.product((-1,1), repeat=3):
                if parity * signs[0] * signs[1] * signs[2] == 1:
                    matrix = [[0]*3 for _ in range(3)]
                    for row, column in enumerate(perm):
                        matrix[row][column] = signs[row]
                    matrices.append(matrix)
        matrices.sort(key=lambda m: tuple(v for row in m for v in row))
        self.assertEqual(self.data["N5"]["matrices"], matrices[:12])

    def test_nearest_rank_and_monte_carlo_boundaries(self):
        values = list(range(200))
        self.assertEqual(values[194], 194)
        self.assertLessEqual((1 + 4) / 201, 0.025)
        self.assertGreater((1 + 5) / 201, 0.025)


if __name__ == "__main__":
    unittest.main()
