#!/usr/bin/env python3

import importlib.util
import sys
import unittest
from pathlib import Path

import numpy as np


SRC = Path(__file__).parents[1] / "src"
sys.path.insert(0, str(SRC))
MODULE_PATH = SRC / "run_supersampling_convergence.py"
SPEC = importlib.util.spec_from_file_location("top_boundary_convergence", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class SupersamplingConvergenceTests(unittest.TestCase):
    def test_fractional_apertures_are_bounded(self):
        for scale in MODULE.SCALES:
            aperture = MODULE.fractional_aperture("DOUBLE_SLIT", 45, scale)
            self.assertGreaterEqual(float(aperture.min()), 0.0)
            self.assertLessEqual(float(aperture.max()), 1.0)

    def test_supersampling_adds_fractional_boundary_pixels(self):
        coarse = MODULE.fractional_aperture("SINGLE_SLIT", 45, 1)
        refined = MODULE.fractional_aperture("SINGLE_SLIT", 45, 8)
        coarse_fractional = np.count_nonzero((coarse > 0.0) & (coarse < 1.0))
        refined_fractional = np.count_nonzero((refined > 0.0) & (refined < 1.0))
        self.assertEqual(coarse_fractional, 0)
        self.assertGreater(refined_fractional, 0)

    def test_cardinal_return_control(self):
        aperture_0 = MODULE.fractional_aperture("DOUBLE_SLIT", 0, 8)
        aperture_90 = MODULE.fractional_aperture("DOUBLE_SLIT", 90, 8)
        record_0 = MODULE.base.coherent_intensity(aperture_0)
        returned_90 = MODULE.base.rotate_back(MODULE.base.coherent_intensity(aperture_90), 90)
        residual = returned_90 - record_0
        value = MODULE.base.normalized_rmse(residual, record_0, MODULE.base.central_roi())
        self.assertLess(value, 1e-6)


if __name__ == "__main__":
    unittest.main()
