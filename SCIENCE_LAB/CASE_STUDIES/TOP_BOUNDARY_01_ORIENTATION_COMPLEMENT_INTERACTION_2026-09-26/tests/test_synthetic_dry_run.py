#!/usr/bin/env python3

import importlib.util
import unittest
from pathlib import Path

import numpy as np


MODULE_PATH = Path(__file__).parents[1] / "src" / "run_synthetic_dry_run.py"
SPEC = importlib.util.spec_from_file_location("top_boundary_dry_run", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class SyntheticDryRunTests(unittest.TestCase):
    def test_binary_complements_are_exact(self):
        edge = MODULE.edge_mask(0)
        slit = MODULE.slit_mask(0)
        self.assertTrue(np.array_equal(edge + (1.0 - edge), np.ones_like(edge)))
        self.assertTrue(np.array_equal(slit + (1.0 - slit), np.ones_like(slit)))

    def test_linear_models_close_noiselessly(self):
        for operator, mask in (
            (MODULE.isotropic_record, MODULE.edge_mask(0)),
            (MODULE.dispersion_record, MODULE.edge_mask(0)),
            (MODULE.dispersion_record, MODULE.slit_mask(0)),
        ):
            one = operator(np.ones((MODULE.N, MODULE.N)))
            zero = operator(np.zeros((MODULE.N, MODULE.N)))
            epsilon = operator(mask) + operator(1.0 - mask) - one - zero
            self.assertLess(float(np.max(np.abs(epsilon))), 1e-10)

    def test_coherent_double_slit_has_interaction(self):
        q1, q2 = MODULE.slit_components(0)
        joint = np.maximum(q1, q2)
        delta = (
            MODULE.coherent_intensity(joint)
            - MODULE.coherent_intensity(q1)
            - MODULE.coherent_intensity(q2)
        )
        self.assertGreater(float(np.max(np.abs(delta))), 1e-8)

    def test_zero_angle_returns_exactly_before_noise(self):
        image = MODULE.dispersion_record(MODULE.edge_mask(0))
        returned = MODULE.rotate_back(image, 0)
        self.assertTrue(np.array_equal(image, returned))

    def test_isotropic_quarter_turn_returns_near_baseline(self):
        baseline = MODULE.isotropic_record(MODULE.edge_mask(0))
        observed = MODULE.isotropic_record(MODULE.edge_mask(90))
        returned = MODULE.rotate_back(observed, 90)
        residual = returned - baseline
        self.assertLess(
            MODULE.normalized_rmse(residual, baseline, MODULE.central_roi()),
            0.05,
        )

    def test_coherent_quarter_turn_returns_near_baseline(self):
        baseline = MODULE.coherent_intensity(MODULE.slit_mask(0))
        observed = MODULE.coherent_intensity(MODULE.slit_mask(90))
        returned = MODULE.rotate_back(observed, 90)
        residual = returned - baseline
        self.assertLess(
            MODULE.normalized_rmse(residual, baseline, MODULE.central_roi()),
            0.12,
        )


if __name__ == "__main__":
    unittest.main()
