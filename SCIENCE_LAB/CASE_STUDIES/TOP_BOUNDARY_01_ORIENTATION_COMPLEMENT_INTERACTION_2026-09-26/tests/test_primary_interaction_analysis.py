#!/usr/bin/env python3

import sys
import unittest
from pathlib import Path

import numpy as np


SRC = Path(__file__).parents[1] / "src"
sys.path.insert(0, str(SRC))
import run_primary_interaction_analysis as module


class PrimaryInteractionAnalysisTests(unittest.TestCase):
    def test_four_states_close_at_aperture_level(self):
        states = module.four_states(45)
        self.assertTrue(np.allclose(states["B1+B2"], states["B1"] + states["B2"]))
        self.assertEqual(float(states["0"].max()), 0.0)

    def test_linear_interaction_is_zero(self):
        states = module.four_states(45)
        for arm in ("A_LINEAR_ISOTROPIC", "A_LINEAR_DISPERSION"):
            delta = module.interaction(module.records_for_arm(arm, states))
            self.assertLessEqual(float(np.max(np.abs(delta))), 1e-12)

    def test_coherent_interaction_matches_cross_term(self):
        states = module.four_states(45)
        records = module.records_for_arm("B_COHERENT_FOURIER", states)
        delta = module.interaction(records)
        expected = module.cross_term(states)
        self.assertTrue(np.allclose(delta, expected, rtol=1e-11, atol=1e-14))
        self.assertGreater(float(np.max(np.abs(delta))), 1e-8)


if __name__ == "__main__":
    unittest.main()

