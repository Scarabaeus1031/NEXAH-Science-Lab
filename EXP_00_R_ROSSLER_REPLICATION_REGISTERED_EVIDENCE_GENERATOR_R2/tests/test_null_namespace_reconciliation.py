from __future__ import annotations

import copy
import hashlib
import sys
import unittest
from pathlib import Path

import numpy as np


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE / "src"))

import registered_evidence_generator as g
import test_registered_evidence_generator as fixture


ROWS = g.expected_physical_row_keys()


class NullNamespaceReconciliationTests(unittest.TestCase):
    def test_canonical_n1_n2_n3_n4_t_n4_f_pass(self):
        g.validate_null_worlds(fixture.null_worlds(), ROWS)

    def test_replayed_canonical_n3_now_passes(self):
        worlds = fixture.null_worlds()
        for replicate, record in enumerate(worlds["N3"]):
            record["rng_namespace"] = [
                g.CONFIG_ID, "state_mismatch", replicate,
                "SPLIT=TEST", "ROW=TEST.6000.0",
            ]
        g.validate_null_worlds(worlds, ROWS)

    def test_replayed_canonical_n4_t_and_n4_f_now_pass(self):
        worlds = fixture.null_worlds()
        for family, carrier in (("N4_T", "T"), ("N4_F", "F")):
            for replicate, record in enumerate(worlds[family]):
                record["rng_namespace"] = [
                    g.CONFIG_ID, "support_matched", replicate,
                    "SPLIT=TEST", f"CARRIER={carrier}",
                    "STRATUM=Q0;M000;D0",
                ]
        g.validate_null_worlds(worlds, ROWS)

    def test_appended_terminal_integer_rejected_for_n3_and_n4(self):
        for family in ("N3", "N4_T", "N4_F"):
            worlds = fixture.null_worlds()
            worlds[family][0]["rng_namespace"].append(6000)
            with self.assertRaisesRegex(g.ContractViolation, "canonical RNG namespace length"):
                g.validate_null_worlds(worlds, ROWS)

    def test_wrong_physical_seed_rejected(self):
        worlds = fixture.null_worlds()
        worlds["N3"][0]["rng_namespace"][-1] = "ROW=TEST.9999.0"
        with self.assertRaisesRegex(g.ContractViolation, "physical RNG seed identity"):
            g.validate_null_worlds(worlds, ROWS)

    def test_malformed_row_rejected(self):
        worlds = fixture.null_worlds()
        worlds["N3"][0]["rng_namespace"][-1] = "ROW=TEST.ROSSLER_PAIR_00.0"
        with self.assertRaises(g.ContractViolation):
            g.validate_null_worlds(worlds, ROWS)

    def test_malformed_stratum_rejected(self):
        for malformed in ("STRATUM=Q5;M000;D0", "STRATUM=Q0;M999;D0", "STRATUM=Q0;M000;D2,1"):
            worlds = fixture.null_worlds()
            worlds["N4_T"][0]["rng_namespace"][-1] = malformed
            with self.assertRaises(g.ContractViolation):
                g.validate_null_worlds(worlds, ROWS)

    def test_wrong_component_order_rejected(self):
        worlds = fixture.null_worlds()
        namespace = worlds["N4_T"][0]["rng_namespace"]
        namespace[3], namespace[4] = namespace[4], namespace[3]
        with self.assertRaises(g.ContractViolation):
            g.validate_null_worlds(worlds, ROWS)

    def test_n4_physical_seed_population_is_mandatory(self):
        bad_rows = list(ROWS)
        bad_rows[-1] = ("TEST", 9999, 49)
        with self.assertRaisesRegex(g.ContractViolation, "physical-seed row population"):
            g.validate_null_worlds(fixture.null_worlds(), bad_rows)

    def test_namespace_bytes_hash_seed_and_pcg64_state_are_identical(self):
        examples = [
            (
                [g.CONFIG_ID, "state_mismatch", 0, "SPLIT=TEST", "ROW=TEST.6000.0"],
                f"{g.CONFIG_ID}|state_mismatch|0|SPLIT=TEST|ROW=TEST.6000.0".encode("utf-8"),
            ),
            (
                [g.CONFIG_ID, "support_matched", 0, "SPLIT=TEST", "CARRIER=T", "STRATUM=Q0;M000;D0"],
                f"{g.CONFIG_ID}|support_matched|0|SPLIT=TEST|CARRIER=T|STRATUM=Q0;M000;D0".encode("utf-8"),
            ),
        ]
        for namespace, frozen_bytes in examples:
            repaired_bytes = g.canonical_namespace_bytes(namespace)
            self.assertEqual(repaired_bytes, frozen_bytes)
            before_digest = hashlib.sha256(frozen_bytes).digest()
            after_digest = hashlib.sha256(repaired_bytes).digest()
            self.assertEqual(after_digest, before_digest)
            before_seed = int.from_bytes(before_digest[:8], "big")
            after_seed = int.from_bytes(after_digest[:8], "big")
            self.assertEqual(after_seed, before_seed)
            before_state = copy.deepcopy(np.random.PCG64(before_seed).state)
            after_state = copy.deepcopy(np.random.PCG64(after_seed).state)
            self.assertEqual(before_state, after_state)


if __name__ == "__main__":
    unittest.main()
