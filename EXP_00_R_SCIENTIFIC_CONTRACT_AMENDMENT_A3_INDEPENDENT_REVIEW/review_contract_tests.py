"""Independent contract-only A3 review fixtures. No scientific pipeline capability."""
from __future__ import annotations

from bisect import bisect_right
from copy import deepcopy
from fractions import Fraction
import hashlib
import importlib.util
import itertools
import json
import math
from pathlib import Path
import unittest

WORKSPACE = Path(__file__).resolve().parent.parent
A3 = WORKSPACE / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A3"
V1 = WORKSPACE / "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"


def load_validator():
    path = A3 / "contract_validation" / "validate_a3_contract.py"
    spec = importlib.util.spec_from_file_location("a3_validator", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def dominance(values):
    if len(values) < 3:
        return "INVALID_EXPERIMENT"
    exact = [Fraction.from_float(float(value)) for value in values]
    total = sum(exact, Fraction())
    if total <= 0:
        return "FAIL_AGGREGATE_NONPOSITIVE"
    top3 = sum(sorted(exact, reverse=True)[:3], Fraction())
    return "PASS" if 2 * top3 <= total else "FAIL_DOMINATED"


class IndependentA3ReviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.validator = load_validator()
        cls.data = json.loads((A3 / "A3_MACHINE_READABLE_RULES.yaml").read_text())
        cls.prose = "\n".join(p.read_text() for p in sorted(A3.glob("*.md")))

    def test_v1_composite(self):
        files = sorted({p for pattern in ("*.py", "*.yaml") for p in V1.rglob(pattern) if "__pycache__" not in p.parts})
        manifest = {str(p.relative_to(V1)): hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
        payload = "".join(f"{digest}  {path}\n" for path, digest in sorted(manifest.items())).encode()
        self.assertEqual(hashlib.sha256(payload).hexdigest(), "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05")

    def test_clockwise_and_bins(self):
        occupied = {7, 2}
        found = next((0 - d) % 8 for d in range(1, 8) if (0 - d) % 8 in occupied)
        self.assertEqual(found, 7)
        self.assertEqual(bisect_right([1.0, 1.0, 2.0], 1.0), 2)

    def test_exact_dominance_boundaries(self):
        self.assertEqual(dominance([0.1] * 6), "PASS")
        self.assertEqual(dominance([math.nextafter(0.1, math.inf)] + [0.1] * 5), "FAIL_DOMINATED")
        self.assertEqual(dominance([0.1] * 6 + [math.nextafter(0.0, math.inf)]), "PASS")
        self.assertEqual(dominance([0.1, 0.0, -0.1]), "FAIL_AGGREGATE_NONPOSITIVE")
        self.assertEqual(dominance([0.1, 0.1]), "INVALID_EXPERIMENT")

    def test_n5_first_twelve(self):
        matrices = []
        for perm in itertools.permutations(range(3)):
            parity = 1 if perm in ((0, 1, 2), (1, 2, 0), (2, 0, 1)) else -1
            for signs in itertools.product((-1, 1), repeat=3):
                if parity * signs[0] * signs[1] * signs[2] == 1:
                    matrix = [[0] * 3 for _ in range(3)]
                    for row, column in enumerate(perm):
                        matrix[row][column] = signs[row]
                    matrices.append(matrix)
        matrices.sort(key=lambda m: tuple(value for row in m for value in row))
        self.assertEqual(self.data["N5"]["matrices"], matrices[:12])

    def test_represented_mutations_rejected(self):
        changes = [
            (("N3", "clockwise_merge", "empty_search_order"), "PLUS_D"),
            (("binning", "phase", "wraparound"), "NO_WRAP"),
            (("N3", "donor_filter"), "SAME_SEED_ALLOWED"),
            (("rng", "seed_conversion"), "LITTLE_ENDIAN"),
            (("rng", "hash"), "SHA-1"),
            (("rng", "generator"), "MT19937"),
            (("ordering", "actions"), list(reversed(self.data["ordering"]["actions"]))),
            (("ordering", "replicate_ids", "start"), 1),
            (("N1", "direction"), "INVERSE"),
            (("binning", "quantiles", "assignment"), "LEFT_INSERTION"),
            (("binning", "phase", "positive_and_negative_pi"), "SEPARATE"),
            (("binning", "quantiles", "duplicate_cutpoints"), "COLLAPSE"),
            (("N4", "merge"), ["LOWER_FIRST"]),
            (("preserved_contract", "null_support"), "NULL_SPECIFIC"),
            (("preserved_contract", "fixed_null_populations", "test"), "OTHER"),
            (("preserved_contract", "fixed_null_populations", "train"), "OTHER_PRIMARY_ROWS"),
            (("N2", "fixed_carrier_outcomes_support_population_and_models"), "DONOR_OUTCOME"),
            (("failure_rules", "retry"), True),
            (("preserved_contract", "repetitions"), 199),
            (("preserved_contract", "repetitions"), 201),
            (("preserved_contract", "monte_carlo", "pass_iff_k_lte"), 5),
            (("N5", "count"), 11),
            (("N5", "selection"), "ANY_12"),
            (("N5", "representation_parameters", "support_quantile"), 0.95),
            (("N5", "ranking", "aggregation"), "MEAN"),
            (("N5", "tiers", "N5_RUN", "transformed_abstention"), "DROP_ROW"),
            (("preserved_contract", "P2"), "NULL_IS_GATE"),
            (("preserved_contract", "cross_system_ceiling"), "NONE"),
        ]
        for path, value in changes:
            altered = deepcopy(self.data)
            node = altered
            for key in path[:-1]:
                node = node[key]
            node[path[-1]] = value
            with self.assertRaises(self.validator.ContractError):
                self.validator.validate_contract(altered, self.prose)

    def test_external_a2_dominance_mutations_break_immutable_hash(self):
        path = WORKSPACE / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A2" / "A2_MACHINE_READABLE_RULES.yaml"
        original_bytes = path.read_bytes()
        expected = self.data["authority"]["immutable_a2_machine"]["sha256"]
        self.assertEqual(hashlib.sha256(original_bytes).hexdigest(), expected)
        a2 = json.loads(original_bytes)
        mutations = [
            (("seed_dominance", "exact_summation"), "IEEE754_FLOAT"),
            (("seed_dominance", "negative_contributions"), "CLIP_TO_ZERO"),
            (("seed_dominance", "contribution_formula"), "EQUAL_SEED_WEIGHT"),
            (("seed_dominance", "decision", "exact_comparison"), "STRICT_OR_TOLERANCE")
        ]
        for key_path, value in mutations:
            changed = deepcopy(a2)
            node = changed
            for key in key_path[:-1]:
                node = node[key]
            node[key_path[-1]] = value
            encoded = json.dumps(changed, indent=2).encode()
            self.assertNotEqual(hashlib.sha256(encoded).hexdigest(), expected)

    def test_n4_distance_source_is_not_unique(self):
        points = [0.0, 1.0, 3.0]
        self_inclusive = [min(abs(x - y) for y in points) for x in points]
        leave_one_out = [min(abs(x - y) for j, y in enumerate(points) if j != i) for i, x in enumerate(points)]
        self.assertEqual(self_inclusive, [0.0, 0.0, 0.0])
        self.assertEqual(leave_one_out, [1.0, 1.0, 2.0])
        self.assertNotIn("support_distance_source", self.data["binning"]["quantiles"])

    def test_classification_overlap(self):
        valid = True
        both_primary_directions_positive = True
        required_null_comparison_passes = False
        partial_clause = valid and both_primary_directions_positive and not required_null_comparison_passes
        not_replicated_clause = valid and not required_null_comparison_passes
        self.assertTrue(partial_clause and not_replicated_clause)
        self.assertNotIn("rossler_classification", self.data)
        self.assertNotIn("P4", self.data["preserved_contract"])
        self.assertNotIn("P5", self.data["preserved_contract"])


if __name__ == "__main__":
    unittest.main()
