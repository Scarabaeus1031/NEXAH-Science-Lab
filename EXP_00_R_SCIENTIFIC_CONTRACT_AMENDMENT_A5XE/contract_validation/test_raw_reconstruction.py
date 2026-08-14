import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from synthetic_raw_bundle import build_bundle
from derive_a5xe_reference import derive as reference
from derive_a5xe_independent import derive as independent


class RawReconstructionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = build_bundle()
        cls.a = reference(cls.bundle)
        cls.b = independent(cls.bundle)

    def test_two_independent_implementers_are_exactly_equal(self):
        self.assertEqual(self.a, self.b)

    def test_raw_worlds_bootstrap_n5_attribution_and_sensitivities_reconstruct(self):
        self.assertEqual(self.a["execution_state"], "VALID_SCIENTIFIC_RESULT")
        self.assertEqual(set(self.a["P"]), {"P1", "P2", "P3", "P4", "P5"})
        self.assertEqual(set(self.a["attribution"]), {"T", "F"})
        self.assertEqual(len(self.a["sensitivities"]), 12)
        self.assertTrue(all(self.a["n5"].values()))

    def test_classification_and_ceiling_are_mechanical(self):
        self.assertEqual(self.a["classification"], "REPLICATED")
        self.assertEqual(self.a["cross_system"], "PARTIAL CROSS-SYSTEM REPLICATION")

    def test_derived_provenance_is_complete(self):
        self.assertEqual(len(self.a["derived_provenance"]), 8)
        self.assertEqual(self.a["derived_provenance"][-1]["artifact_id"], "FINAL_CLASSIFICATION")


if __name__ == "__main__":
    unittest.main()
