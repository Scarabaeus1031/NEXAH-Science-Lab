from __future__ import annotations

from fractions import Fraction
import json
import math
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


def dominance(values):
    if len(values) < 3:
        return "INVALID_EXPERIMENT"
    if any(not math.isfinite(value) for value in values):
        return "INVALID_EXPERIMENT"
    contributions = [Fraction.from_float(float(value)) for value in values]
    aggregate = sum(contributions, Fraction())
    if aggregate <= 0:
        return "FAIL_AGGREGATE_NONPOSITIVE"
    top3 = sum(sorted(contributions, reverse=True)[:3], Fraction())
    return "PASS" if 2 * top3 <= aggregate else "FAIL_DOMINATED"


class ContractLogicTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / "A2_MACHINE_READABLE_RULES.yaml").read_text())

    def test_exact_half_six_equal_point_one_passes(self):
        self.assertEqual(dominance([0.1] * 6), "PASS")

    def test_slightly_above_half_fails(self):
        self.assertEqual(dominance([math.nextafter(0.1, math.inf)] + [0.1] * 5), "FAIL_DOMINATED")

    def test_zero_and_negative_aggregate_fail(self):
        self.assertEqual(dominance([0.1, 0.0, -0.1]), "FAIL_AGGREGATE_NONPOSITIVE")
        self.assertEqual(dominance([0.1, -0.1, -0.1]), "FAIL_AGGREGATE_NONPOSITIVE")

    def test_negative_contributions_are_not_clipped(self):
        self.assertEqual(self.data["seed_dominance"]["negative_contributions"], "RETAIN_SIGNED")

    def test_fewer_than_three_and_nonfinite_invalid(self):
        self.assertEqual(dominance([0.1, 0.1]), "INVALID_EXPERIMENT")
        self.assertEqual(dominance([0.1, 0.1, float("nan")]), "INVALID_EXPERIMENT")

    def test_n1_support_and_outcome_are_explicit(self):
        n1 = self.data["null_worlds"]["N1"]
        self.assertEqual(n1["support_rule"], "ORIGINAL_SUPPORT_FLAGS_BINDING_NULL_PATH_SUPPORT_NOT_A_SELECTION_RULE")
        self.assertFalse(n1["outcome_simulation"])
        self.assertIn("SELECT_NULL_CARRIER_ACTION", n1["outcome_rule"])

    def test_n2_n3_n4_actions_outcomes_fixed(self):
        for name in ("N2", "N3", "N4"):
            item = self.data["null_worlds"][name]
            self.assertEqual(item["carrier_action"], "FROZEN_OBSERVED")
            self.assertIn("FROZEN_OBSERVED", item["outcome_rule"])

    def test_fixed_populations_and_undefined_replicate(self):
        shared = self.data["shared_null_contract"]
        self.assertIn("ORIGINAL_JOINTLY_SUPPORTED", shared["train_population"])
        self.assertIn("ORIGINAL_JOINTLY_SUPPORTED", shared["test_population"])
        self.assertEqual(shared["undefined_replicate"], "INVALID_REPLICATE_NO_RETRY_NO_REPLACEMENT")
        self.assertEqual(shared["any_invalid_replicate"], "INVALID_EXPERIMENT")

    def test_all_four_null_worlds_typed(self):
        self.assertEqual(set(self.data["null_worlds"]), {"N1", "N2", "N3", "N4"})

    def test_n5_prose_machine_fields_present(self):
        n5 = self.data["N5"]
        self.assertEqual(n5["transforms"]["count"], 12)
        self.assertEqual(self.data["immutable_v1_refs"]["support_quantile"]["value"], 0.99)
        self.assertIn("trajectory_neighbors_ref", n5["representation_parameters"])
        self.assertIn("field_neighbors_ref", n5["representation_parameters"])


if __name__ == "__main__":
    unittest.main()
