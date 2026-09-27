from __future__ import annotations

import inspect
import json
from pathlib import Path
import sys
import unittest

PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

import baseline_runner
from ground_truth_evaluator import score_record
from utility00_machine import CORE_COMMIT, SPLIT_COUNTS, canonical_bytes, digest_bytes, read_jsonl, validate_result


class U1MachineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.fixtures = PACKAGE / "fixtures"
        cls.inputs = read_jsonl(cls.fixtures / "development_inputs.jsonl")
        cls.gold = read_jsonl(cls.fixtures / "development_ground_truth.jsonl")
        cls.smoke = json.loads((PACKAGE / "results" / "u1_smoke_result.json").read_text())

    def test_frozen_counts_and_core_commit(self) -> None:
        plan = json.loads((self.fixtures / "fixture_plan.json").read_text())
        self.assertEqual(plan["core_commit"], CORE_COMMIT)
        self.assertEqual(plan["counts"], SPLIT_COUNTS)
        self.assertEqual(sum(item["total"] for item in SPLIT_COUNTS.values()), 432)
        self.assertEqual(len(self.inputs), 140)

    def test_labels_are_not_in_processor_input(self) -> None:
        forbidden = {"expected_mechanical_status", "accepted_localization", "observability_variant"}
        for fixture in self.inputs:
            self.assertTrue(forbidden.isdisjoint(fixture))
        self.assertEqual({x["fixture_id"] for x in self.inputs}, {x["fixture_id"] for x in self.gold})

    def test_declared_input_hashes(self) -> None:
        for fixture in self.inputs:
            copy = dict(fixture)
            expected = copy.pop("input_sha256")
            self.assertEqual(digest_bytes(canonical_bytes(copy)), expected)

    def test_baseline_does_not_import_nexah(self) -> None:
        source = inspect.getsource(baseline_runner)
        self.assertNotIn("import nexah", source)
        self.assertNotIn("from nexah", source)

    def test_smoke_schema_and_required_behavior(self) -> None:
        self.assertEqual(self.smoke["u1_decision"], "A_U1_MINIMUM_MACHINE_EXISTS")
        self.assertTrue(self.smoke["equal_information"])
        self.assertTrue(self.smoke["deterministic_replay"])
        self.assertFalse(self.smoke["utility_calculated"])
        classes = {run["smoke_class"] for run in self.smoke["runs"]}
        self.assertEqual(classes, {"VALID_OR_SEMANTICS_PRESERVING", "MANIFEST_PAYLOAD_MISMATCH", "MISSING_PRECONDITION_ABSTAIN"})
        for run in self.smoke["runs"]:
            self.assertTrue(run["same_input"])
            self.assertTrue(run["deterministic_replay"])
            self.assertTrue(run["mechanical_behavior"])
            for result in run["first"].values():
                validate_result(result)

    def test_separate_scorer_is_non_aggregate(self) -> None:
        run = self.smoke["runs"][0]
        truth = next(x for x in self.gold if x["fixture_id"] == run["fixture_id"])
        score = score_record(run["first"]["baseline"], truth)
        self.assertIn("mechanical_status_correct", score)
        self.assertFalse(score["utility_calculated"])
        self.assertNotIn("rate", score)


if __name__ == "__main__":
    unittest.main()
