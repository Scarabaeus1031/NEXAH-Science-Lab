from __future__ import annotations

import itertools
import unittest

from validate_a4_contract import ContractError, cross_system_label, rossler_label


class ClassificationTruthTable(unittest.TestCase):
    def test_every_consistent_state_has_exactly_one_label(self):
        labels = {"INVALID EXPERIMENT", "REPLICATED", "PARTIALLY REPLICATED", "NOT REPLICATED"}
        count = 0
        for bits in itertools.product((False, True), repeat=10):
            valid, *rest = bits
            p = tuple(rest[:5])
            t_pos, f_pos, t_neg, f_neg = rest[5:]
            if (t_pos and t_neg) or (f_pos and f_neg):
                with self.assertRaises(ContractError):
                    rossler_label(valid, p, t_pos, f_pos, t_neg, f_neg)
                continue
            label = rossler_label(valid, p, t_pos, f_pos, t_neg, f_neg)
            self.assertIn(label, labels)
            count += 1
        self.assertEqual(count, 576)

    def test_precedence_and_overlap_resolution(self):
        all_p = (True,)*5
        self.assertEqual(rossler_label(False, all_p, True, True, False, False), "INVALID EXPERIMENT")
        self.assertEqual(rossler_label(True, all_p, True, True, False, False), "REPLICATED")
        # P1/null failure plus positive cores is uniquely partial.
        self.assertEqual(rossler_label(True, (False,True,True,True,True), True, True, False, False), "PARTIALLY REPLICATED")
        self.assertEqual(rossler_label(True, all_p, True, False, False, True), "NOT REPLICATED")

    def test_lorenz_ceiling(self):
        p = (True,)*5
        r = rossler_label(True, p, True, True, False, False)
        self.assertEqual(r, "REPLICATED")
        self.assertEqual(cross_system_label(True, p, r), "PARTIAL CROSS-SYSTEM REPLICATION")
        self.assertNotEqual(cross_system_label(True, p, r), "CROSS-SYSTEM REPLICATION")


if __name__ == "__main__":
    unittest.main()

