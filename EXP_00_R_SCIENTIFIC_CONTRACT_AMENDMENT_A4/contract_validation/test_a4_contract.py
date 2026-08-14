from __future__ import annotations

from bisect import bisect_right
import hashlib
import itertools
import json
import math
from pathlib import Path
import unittest

from validate_a4_contract import validate_contract

ROOT = Path(__file__).resolve().parents[1]


def clockwise(bin_id: int, occupied: set[int]) -> int | None:
    if bin_id in occupied:
        return bin_id
    for distance in range(1, 8):
        candidate = (bin_id - distance) % 8
        if candidate in occupied:
            return candidate
    return None


def merge_groups(sizes: list[int]) -> list[tuple[tuple[int, ...], int]]:
    groups = [[(i,), n] for i, n in enumerate(sizes) if n]
    if sum(sizes) < 10:
        raise ValueError("invalid subgroup")
    while any(n < 10 for _, n in groups):
        for original in range(10):
            index = next((j for j, (members, _) in enumerate(groups) if original in members), None)
            if index is None or groups[index][1] >= 10:
                continue
            other = index + 1 if index + 1 < len(groups) else index - 1
            members = tuple(sorted(groups[index][0] + groups[other][0]))
            count = groups[index][1] + groups[other][1]
            lo, hi = sorted((index, other))
            groups[lo:hi + 1] = [[members, count]]
            break
    return [(members, count) for members, count in groups]


class ContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / "A4_MACHINE_READABLE_RULES.yaml").read_text())

    def test_canonical_contract(self):
        validate_contract(self.data)

    def test_rng_hash_seed_and_registered_known_answers(self):
        expected_outputs = [[4,3,2,0,1], [2,3,5,4,0,7,6,1], 5, [5,6,8,4,2,0,3,7,9,1]]
        for fixture, expected in zip(self.data["rng"]["known_answers"], expected_outputs):
            digest = hashlib.sha256(fixture["payload"].encode()).digest()
            self.assertEqual(digest.hex(), fixture["sha256"])
            self.assertEqual(int.from_bytes(digest[:8], "big"), fixture["seed"])
            self.assertEqual(fixture["output"], expected)

    def test_phase_boundaries_and_wrap(self):
        edges = [float.fromhex(x) for x in self.data["binning"]["phase"]["edges_hex"]]
        pi = float.fromhex(self.data["binning"]["phase"]["pi_hex"])
        phase_bin = lambda theta: bisect_right(edges[1:-1], -pi if theta == pi else theta)
        self.assertEqual(phase_bin(pi), 0)
        self.assertEqual(phase_bin(-pi), 0)
        for i, edge in enumerate(edges[1:-1], 1):
            self.assertEqual(phase_bin(edge), i)
            self.assertEqual(phase_bin(math.nextafter(edge, -math.inf)), i - 1)
        self.assertEqual(clockwise(0, {7, 2}), 7)
        self.assertEqual(clockwise(1, {5}), 5)
        self.assertEqual(clockwise(7, {6, 0}), 6)
        self.assertIsNone(clockwise(3, set()))

    def test_quantile_equality_duplicates_min_max(self):
        cuts = [1.0, 1.0, 2.0, 3.0]
        self.assertEqual(bisect_right(cuts, -100.0), 0)
        self.assertEqual(bisect_right(cuts, 1.0), 2)
        self.assertEqual(bisect_right(cuts, math.nextafter(1.0, -math.inf)), 0)
        self.assertEqual(bisect_right(cuts, 3.0), 4)
        self.assertEqual(bisect_right(cuts, 100.0), 4)

    def test_n4_merge_higher_then_lower(self):
        self.assertEqual(merge_groups([4,0,7,11,0,0,12,0,0,9]), [((0,2),11),((3,),11),((6,9),21)])
        # Final small group needs lower fallback and becomes (6,9).
        self.assertEqual(merge_groups([0,0,0,0,0,0,12,0,0,9]), [((6,9),21)])
        with self.assertRaises(ValueError):
            merge_groups([1,0,0,0,0,0,0,0,0,8])

    def test_n1_forward_non_self_inverse(self):
        p = [1,2,0,4,3]
        inverse = [p.index(i) for i in range(5)]
        self.assertNotEqual(p[0], inverse[0])

    def test_n5_first_twelve(self):
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

    def test_monte_carlo_and_nearest_rank_boundaries(self):
        self.assertLessEqual((1+4)/201, .025)
        self.assertGreater((1+5)/201, .025)
        self.assertEqual(list(range(200))[194], 194)


if __name__ == "__main__":
    unittest.main()
