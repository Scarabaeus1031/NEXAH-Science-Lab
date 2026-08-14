from __future__ import annotations

import ast
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from exp00r.actions import CONTROL_MATRIX, action_set, assert_shared_actions, controlled_increment
from exp00r.analysis import seed_block_folds
from exp00r.coherence import kendall_tau_b, pair_coherence
from exp00r.config_loader import load_config, registered_seeds, sha256_file
from exp00r.data import assert_seed_allowed
from exp00r.execution_guard import require_authorization
from exp00r.integrator import integrate, rk4_step
from exp00r.nulls import permute_action_labels, signed_permutation_matrices
from exp00r.objective import Standardizer, TargetRegion, binary_success, build_target
from exp00r.ranking import top_action, weak_rank
from exp00r.representation_learned_field import LocalAffineField
from exp00r.representation_trajectory import TrajectoryRepresentation
from exp00r.rossler import controlled_rossler, rossler_field
from exp00r.rollout_contract import SharedRolloutTable
from exp00r.support import SupportModel, fit_support


CONFIG_PATH = ROOT / "EXP_00_R_FROZEN_CONFIG.yaml"


def synthetic_states(n=20):
    t = np.linspace(-2.0, 2.0, n)
    return np.column_stack([t, np.sin(t), 0.5 + 0.2 * np.cos(t)])


def synthetic_table(n=20):
    states = synthetic_states(n)
    actions = action_set(0.5)
    paths = np.empty((n, len(actions), 2, 3))
    paths[:, :, 0, :] = states[:, None, :]
    for j, action in enumerate(actions):
        paths[:, j, 1, :] = states + 0.1 * controlled_increment(action)
    return SharedRolloutTable(states, np.arange(100, 100 + n), actions, paths, 0.1, 0.1, "train")


class Exp00RTests(unittest.TestCase):
    def test_01_rossler_equations(self):
        np.testing.assert_allclose(rossler_field(np.array([1.0, 2.0, 3.0])), [-5.0, 1.4, -13.9])

    def test_02_rk4_deterministic_and_linear_accuracy(self):
        field = lambda x: -x
        first = integrate(field, np.array([1.0]), 1.0, 0.01)
        second = integrate(field, np.array([1.0]), 1.0, 0.01)
        np.testing.assert_array_equal(first, second)
        self.assertAlmostEqual(first[0], np.exp(-1), places=8)

    def test_03_scalar_x_channel_control(self):
        state = np.array([1.0, 2.0, 3.0])
        np.testing.assert_allclose(controlled_rossler(state, 0.4) - rossler_field(state), [0.4, 0.0, 0.0])
        np.testing.assert_array_equal(CONTROL_MATRIX[:, 0], [1.0, 0.0, 0.0])

    def test_04_identical_action_set_enforced(self):
        actions = action_set(0.5)
        assert_shared_actions(actions, actions.copy())
        with self.assertRaises(ValueError):
            assert_shared_actions(actions, action_set(1.0))

    def test_05_identical_objective_and_horizon_config(self):
        config = load_config(CONFIG_PATH)
        self.assertEqual(config["plant"]["evaluation_horizon"], 1.0)
        self.assertEqual(config["representations"]["trajectory"]["family"], "finite_horizon_knn_outcome")
        self.assertIn("field", config["representations"]["learned_field"]["family"])

    def test_06_target_training_only(self):
        target = build_target(synthetic_states(), "train")
        self.assertEqual(target.source_split, "train")
        with self.assertRaises(ValueError):
            build_target(synthetic_states(), "test")

    def test_07_test_state_excluded_from_preprocessing(self):
        train = synthetic_states()
        target = build_target(train, "train")
        changed_test = np.array([[999.0, 999.0, 999.0]])
        np.testing.assert_allclose(target.standardizer.mean, train.mean(axis=0))
        self.assertFalse(np.any(np.isclose(target.standardizer.mean, changed_test[0])))

    def test_08_trajectory_ranking_correctness(self):
        table = synthetic_table()
        target = build_target(table.decision_states, "train")
        support = SupportModel(target.standardizer.transform(table.decision_states), target.standardizer, 1e9, 0.99)
        model = TrajectoryRepresentation(neighbors=1).fit(table, target, support)
        scores = model.predict_scores(table.decision_states[0])
        expected = target.score(table.paths[0, :, -1, :])
        np.testing.assert_allclose(scores, expected)
        np.testing.assert_array_equal(weak_rank(scores), weak_rank(expected))

    def test_09_learned_field_ranking_on_known_synthetic_field(self):
        states = np.column_stack([np.linspace(-0.1, 0.1, 10), np.zeros(10), np.zeros(10)])
        standardizer = Standardizer(np.zeros(3), np.ones(3))
        support = SupportModel(states.copy(), standardizer, 10.0, 0.99)
        target = TargetRegion(standardizer, np.array([1.0, 0.0, 0.0]), 0.0)
        model = LocalAffineField(5, 1e-6, dt=0.05, horizon=1.0)
        model.training_states = states; model.training_z = states.copy(); model.derivative_labels = np.zeros_like(states)
        model.actions = action_set(0.5); model.support = support; model.target = target
        scores = model.predict_scores(np.zeros(3))
        self.assertEqual(top_action(scores, model.actions, 0.5), 0.5)

    def test_10_kendall_tau_b_with_ties(self):
        self.assertAlmostEqual(kendall_tau_b([1, 1, 3], [1, 1, 3]), 1.0)
        self.assertAlmostEqual(kendall_tau_b([1, 2, 3], [3, 2, 1]), -1.0)
        self.assertAlmostEqual(pair_coherence([1, 2, 3], [3, 2, 1]), 0.0)

    def test_11_support_abstention(self):
        table = synthetic_table()
        target = build_target(table.decision_states, "train")
        support = SupportModel(target.standardizer.transform(table.decision_states), target.standardizer, 0.01, 0.99)
        model = TrajectoryRepresentation(3).fit(table, target, support)
        self.assertIsNone(model.predict_scores(np.array([100.0, 100.0, 100.0])))

    def test_12_field_path_support_abstention(self):
        standardizer = Standardizer(np.zeros(3), np.ones(3))
        training = np.zeros((10, 3)); training[:, 0] = np.linspace(-0.1, 0.1, 10)
        support = SupportModel(training, standardizer, 0.2, 0.99)
        target = TargetRegion(standardizer, np.array([1.0, 0.0, 0.0]), 0.0)
        model = LocalAffineField(5, 1e-6, 0.1, 1.0, training, training, np.zeros_like(training), action_set(0.5), support, target)
        self.assertIsNone(model.predict_scores(np.zeros(3)))

    def test_13_no_partial_ranking_after_one_path_failure(self):
        self.test_12_field_path_support_abstention()

    def test_14_carrier_tie_breaking(self):
        actions = action_set(0.5)
        self.assertEqual(top_action(np.ones(5), actions, 0.5), 0.0)
        self.assertEqual(top_action(np.array([0, 0, 1, 1, 1]), actions, 0.5), -0.25)

    def test_15_information_parity_manifest_identity(self):
        table = synthetic_table()
        target = build_target(table.decision_states, "train")
        support = SupportModel(target.standardizer.transform(table.decision_states), target.standardizer, 1e9, 0.99)
        trajectory = TrajectoryRepresentation(3).fit(table, target, support)
        field = LocalAffineField(5, 1e-6, 0.05, 0.1).fit(table, target, support)
        self.assertEqual(trajectory.raw_manifest, field.raw_manifest)
        self.assertFalse(trajectory.raw_manifest["analytic_field_exposed"])

    def test_16_seed_block_separation(self):
        seeds = np.repeat(np.arange(100, 110), 3)
        folds = seed_block_folds(seeds, 5)
        for train, test in folds:
            self.assertTrue(set(seeds[train]).isdisjoint(set(seeds[test])))

    def test_17_null_permutation_reproducibility(self):
        values = np.arange(15).reshape(3, 5)
        first = permute_action_labels(values, "fixture", 7)
        second = permute_action_labels(values, "fixture", 7)
        np.testing.assert_array_equal(first, second)

    def test_18_configuration_immutability_hash_detection(self):
        digest = sha256_file(CONFIG_PATH)
        load_config(CONFIG_PATH, digest)
        with tempfile.TemporaryDirectory() as directory:
            altered = Path(directory) / "config.yaml"
            altered.write_bytes(CONFIG_PATH.read_bytes() + b" ")
            with self.assertRaises(RuntimeError):
                load_config(altered, digest)

    def test_19_learned_representation_has_no_analytic_rossler_import(self):
        source = (ROOT / "src/exp00r/representation_learned_field.py").read_text()
        tree = ast.parse(source)
        imports = [node.module or "" for node in ast.walk(tree) if isinstance(node, ast.ImportFrom)]
        self.assertFalse(any("rossler" in module for module in imports))

    def test_20_deliberate_negative_fairness_test(self):
        table = synthetic_table()
        bad_actions = table.actions.copy(); bad_actions[-1] = 0.75
        with self.assertRaises(ValueError):
            assert_shared_actions(table.actions, bad_actions)

    def test_21_registered_seed_lock(self):
        config = load_config(CONFIG_PATH)
        sealed = registered_seeds(config)
        with self.assertRaises(PermissionError):
            assert_seed_allowed(5000, sealed, False)
        with self.assertRaises(PermissionError):
            require_authorization("registered", config, CONFIG_PATH, None)

    def test_22_zero_action_has_fixed_failure_endpoint(self):
        self.assertEqual(binary_success(0.0, -0.01), 0)

    def test_23_two_representation_coherence_is_one_pair(self):
        config = load_config(CONFIG_PATH)
        self.assertIn("one_pair_only", config["orientation"]["coherence"])
        self.assertNotIn("majority", json.dumps(config).lower())

    def test_24_coordinate_registration_matrices(self):
        matrices = signed_permutation_matrices(12)
        self.assertEqual(len(matrices), 12)
        for matrix in matrices:
            np.testing.assert_allclose(matrix.T @ matrix, np.eye(3))
            self.assertAlmostEqual(np.linalg.det(matrix), 1.0)


if __name__ == "__main__":
    unittest.main()
