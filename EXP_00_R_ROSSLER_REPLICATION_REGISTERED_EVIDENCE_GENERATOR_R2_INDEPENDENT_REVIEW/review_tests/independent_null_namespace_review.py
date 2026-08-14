from __future__ import annotations

import copy
import hashlib
import pathlib
import sys
import unittest

import numpy as np


WORKSPACE = pathlib.Path(__file__).resolve().parents[2]
R2_SOURCE = WORKSPACE / "EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2" / "src"
sys.path.insert(0, str(R2_SOURCE))

import registered_evidence_generator as g


def namespace(family: str, replicate: int) -> list[object]:
    if family == "N1":
        return [g.CONFIG_ID, "action_label", replicate, "REP=TRAJECTORY", "SEED=5000"]
    if family == "N2":
        return [g.CONFIG_ID, "rank_within_seed", replicate, "SPLIT=TEST", "SEED=6000"]
    if family == "N3":
        return [g.CONFIG_ID, "state_mismatch", replicate, "SPLIT=TEST", "ROW=TEST.6000.0"]
    carrier = "T" if family == "N4_T" else "F"
    return [g.CONFIG_ID, "support_matched", replicate, "SPLIT=TEST", f"CARRIER={carrier}", "STRATUM=Q0;M000;D0"]


def worlds() -> dict[str, list[dict[str, object]]]:
    return {
        family: [
            {"family": family, "replicate_id": replicate, "rng_namespace": namespace(family, replicate)}
            for replicate in range(200)
        ]
        for family in ("N1", "N2", "N3", "N4_T", "N4_F")
    }


ROWS = [
    (split, seed, index)
    for split, seeds in (("TRAIN_OOF", range(5000, 5030)), ("TEST", range(6000, 6030)))
    for seed in seeds
    for index in range(50)
]


class IndependentNullNamespaceReview(unittest.TestCase):
    def test_01_all_five_canonical_families_pass(self):
        g.validate_null_worlds(worlds(), ROWS)

    def test_02_appended_terminal_seed_rejected(self):
        for family in ("N3", "N4_T", "N4_F"):
            candidate = worlds()
            candidate[family][0]["rng_namespace"].append(6000)
            with self.assertRaises(g.ContractViolation):
                g.validate_null_worlds(candidate, ROWS)

    def test_03_wrong_physical_seeds_rejected(self):
        attacks = (
            ("N1", "SEED=6000"),
            ("N2", "SEED=5000"),
            ("N3", "ROW=TEST.9999.0"),
        )
        for family, terminal in attacks:
            candidate = worlds()
            candidate[family][0]["rng_namespace"][-1] = terminal
            with self.assertRaises(g.ContractViolation):
                g.validate_null_worlds(candidate, ROWS)

    def test_04_malformed_rows_rejected(self):
        for malformed in ("ROW=TEST.6000", "ROW=TEST.06000.0", "ROW=TRAIN_OOF.6000.0", "ROW=TEST.6000.50"):
            candidate = worlds()
            candidate["N3"][0]["rng_namespace"][-1] = malformed
            with self.assertRaises(g.ContractViolation):
                g.validate_null_worlds(candidate, ROWS)

    def test_05_malformed_strata_rejected(self):
        for malformed in ("STRATUM=Q5;M000;D0", "STRATUM=Q0;M100;D0", "STRATUM=Q0;M000;D2,1", "STRATUM=Q0;M000;D10"):
            candidate = worlds()
            candidate["N4_T"][0]["rng_namespace"][-1] = malformed
            with self.assertRaises(g.ContractViolation):
                g.validate_null_worlds(candidate, ROWS)

    def test_06_wrong_component_order_and_carrier_rejected(self):
        candidate = worlds()
        values = candidate["N4_T"][0]["rng_namespace"]
        values[3], values[4] = values[4], values[3]
        with self.assertRaises(g.ContractViolation):
            g.validate_null_worlds(candidate, ROWS)
        candidate = worlds()
        candidate["N4_T"][0]["rng_namespace"][4] = "CARRIER=F"
        with self.assertRaises(g.ContractViolation):
            g.validate_null_worlds(candidate, ROWS)

    def test_07_n4_physical_row_authority_is_fail_closed(self):
        candidate_rows = list(ROWS)
        candidate_rows[-1] = ("TEST", 9999, 49)
        with self.assertRaises(g.ContractViolation):
            g.validate_null_worlds(worlds(), candidate_rows)

    def test_08_pair_ids_and_noncanonical_prefixes_rejected(self):
        candidate = worlds()
        candidate["N3"][0]["rng_namespace"][-1] = "ROW=TEST.ROSSLER_PAIR_00.0"
        with self.assertRaises(g.ContractViolation):
            g.validate_null_worlds(candidate, ROWS)
        candidate = worlds()
        candidate["N4_T"][0]["rng_namespace"][0] = "WRONG_CONFIG"
        with self.assertRaises(g.ContractViolation):
            g.validate_null_worlds(candidate, ROWS)

    def test_09_n3_rng_identity_is_byte_and_state_identical(self):
        components = [g.CONFIG_ID, "state_mismatch", 0, "SPLIT=TEST", "ROW=TEST.6000.0"]
        frozen = f"{g.CONFIG_ID}|state_mismatch|0|SPLIT=TEST|ROW=TEST.6000.0".encode("utf-8")
        self._assert_rng_identity(components, frozen)

    def test_10_n4_rng_identity_is_byte_and_state_identical(self):
        components = [g.CONFIG_ID, "support_matched", 0, "SPLIT=TEST", "CARRIER=T", "STRATUM=Q0;M000;D0"]
        frozen = f"{g.CONFIG_ID}|support_matched|0|SPLIT=TEST|CARRIER=T|STRATUM=Q0;M000;D0".encode("utf-8")
        self._assert_rng_identity(components, frozen)

    def _assert_rng_identity(self, components: list[object], frozen: bytes) -> None:
        repaired = g.canonical_namespace_bytes(components)
        self.assertEqual(repaired, frozen)
        frozen_digest = hashlib.sha256(frozen).digest()
        repaired_digest = hashlib.sha256(repaired).digest()
        self.assertEqual(repaired_digest, frozen_digest)
        frozen_seed = int.from_bytes(frozen_digest[:8], "big")
        repaired_seed = int.from_bytes(repaired_digest[:8], "big")
        self.assertEqual(repaired_seed, frozen_seed)
        self.assertEqual(copy.deepcopy(np.random.PCG64(repaired_seed).state), copy.deepcopy(np.random.PCG64(frozen_seed).state))


if __name__ == "__main__":
    unittest.main(verbosity=2)
