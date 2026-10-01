#!/usr/bin/env python3
"""Negative controls for the repaired POLAR-LOD-EAM parser."""

from __future__ import annotations

import importlib.util
import subprocess
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path


PACKAGE = Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location(
    "eam_vintage_qualification",
    PACKAGE / "eam_vintage_qualification.py",
)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def valid_rows() -> list[list[str]]:
    issue = date(2025, 1, 1)
    issue_mjd = MODULE.mjd_for(issue)
    start = issue_mjd - 90.0
    rows = []
    for index in range(MODULE.EXPECTED_ROWS):
        mjd = start + MODULE.GRID_STEP_DAYS * index
        state = "C" if mjd < issue_mjd else "P"
        rows.append([f"{mjd:.3f}", "1e-8", "2e-8", "3e-8", state])
    return rows


def render(rows: list[list[str]], issue: str = "2025-01-01") -> str:
    header = (
        f"Issue date : {issue}\n"
        "Number of data records : 1440\n"
        "MJD x y z state\n"
    )
    return header + "\n".join(" ".join(row) for row in rows) + "\n"


class ParserFailClosedTests(unittest.TestCase):
    def parse(self, rows: list[list[str]], issue: str = "2025-01-01") -> dict:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "vintage.asc"
            path.write_text(render(rows, issue))
            return MODULE.parse_vintage(path)

    def test_valid_fixture_passes(self) -> None:
        self.assertEqual(self.parse(valid_rows())["invalid_reason"], "")

    def test_duplicate_mjd_rejected(self) -> None:
        rows = valid_rows()
        rows[10][0] = rows[9][0]
        self.assertIn("DUPLICATE_MJD", self.parse(rows)["invalid_reason"])

    def test_nonfinite_rejected(self) -> None:
        rows = valid_rows()
        rows[10][3] = "nan"
        self.assertIn("NON_FINITE_VALUE", self.parse(rows)["invalid_reason"])

    def test_grid_gap_rejected(self) -> None:
        rows = valid_rows()
        rows[10][0] = f"{float(rows[10][0]) + 0.001:.3f}"
        self.assertIn("GRID_STEP_NOT_0_125_DAY", self.parse(rows)["invalid_reason"])

    def test_unknown_state_rejected(self) -> None:
        rows = valid_rows()
        rows[10][4] = "A"
        self.assertIn("UNKNOWN_STATE", self.parse(rows)["invalid_reason"])

    def test_second_transition_rejected(self) -> None:
        rows = valid_rows()
        rows[800][4] = "C"
        self.assertIn("NON_CONTIGUOUS_C_TO_P_TRANSITION", self.parse(rows)["invalid_reason"])

    def test_issue_boundary_conflict_rejected(self) -> None:
        rows = valid_rows()
        for row in rows:
            row[4] = "C" if float(row[0]) < MODULE.mjd_for(date(2025, 1, 2)) else "P"
        self.assertIn("ISSUE_DATE_P_BOUNDARY_CONFLICT", self.parse(rows)["invalid_reason"])

    def test_physical_limit_rejected(self) -> None:
        rows = valid_rows()
        rows[10][2] = "0.01"
        self.assertIn("EXCITATION_ABS_GT_1E_MINUS_3", self.parse(rows)["invalid_reason"])


class SealedTrustRootTests(unittest.TestCase):
    def test_custom_trust_root_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            alternative = Path(directory) / "SEALED_REPLAY_TRUST_ROOT.json"
            alternative.write_text("{}\n")
            with self.assertRaisesRegex(RuntimeError, "Custom trust-root paths"):
                MODULE.verify_canonical_trust_root(alternative)

    def test_legacy_custom_lock_flags_are_not_accepted(self) -> None:
        result = subprocess.run(
            [
                sys.executable,
                str(PACKAGE / "eam_vintage_qualification.py"),
                "--cache-dir",
                "/private/tmp/not-used",
                "--execution-lock",
                "/private/tmp/alternative.json",
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn("unrecognized arguments", result.stderr)


def synthetic_operational_case(m2_error: float, b3_error: float, n: int = 200):
    observed = {}
    rows = []
    m2 = {}
    expected = {}
    for horizon in MODULE.HORIZONS:
        m2[horizon] = {}
        expected[horizon] = set()
        for index in range(n):
            mjd = float(70000 + horizon * 1000 + index)
            observed[mjd] = 0.0
            m2[horizon][mjd] = m2_error
            expected[horizon].add(mjd)
            rows.append(
                {
                    "horizon_days": horizon,
                    "target_mjd": mjd,
                    "predicted_lod_seconds": b3_error,
                }
            )
    return rows, m2, observed, expected


class OperationalRelevanceTests(unittest.TestCase):
    def test_direct_horizon_lags_never_cross_forecast_origin(self) -> None:
        for horizon in MODULE.HORIZONS:
            self.assertEqual(MODULE.direct_lag_offset(horizon, 1), horizon)
            self.assertGreaterEqual(MODULE.direct_lag_offset(horizon, 17), horizon)

    def test_supported_fixture(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0)
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=200
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_SUPPORTED")
        self.assertTrue(all(item["holm_rejects_null"] for item in result["horizons"].values()))

    def test_valid_nonpass_fixture(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(1.0, 0.5)
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=200
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_SUPPORTED")

    def test_below_five_percent_rmse_gate_is_not_supported(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.951, 1.0)
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=200
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_SUPPORTED")

    def test_mae_gate_cannot_be_rescued_by_rmse(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(1.5, 0.0)
        for horizon in MODULE.HORIZONS:
            horizon_rows = [row for row in rows if row["horizon_days"] == horizon]
            for index, row in enumerate(horizon_rows):
                row["predicted_lod_seconds"] = 10.0 if index < 10 else 0.0
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=200
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_SUPPORTED")
        self.assertGreater(
            result["horizons"]["1"]["m2"]["mae_seconds"],
            result["horizons"]["1"]["b3"]["mae_seconds"],
        )

    def test_missing_custody_is_not_assessable(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0)
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=False, replicates=50
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE")

    def test_partial_horizon_is_not_assessable(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0, n=200)
        rows = [row for row in rows if row["horizon_days"] != 30 or row["target_mjd"] % 1000 < 100]
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=50
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE")
        self.assertEqual(result["horizons"]["30"]["paired_n"], 100)

    def test_common_model_outage_is_visible_and_not_assessable(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0, n=250)
        removed = {horizon: min(expected[horizon]) for horizon in MODULE.HORIZONS}
        rows = [row for row in rows if row["target_mjd"] != removed[row["horizon_days"]]]
        for horizon, target in removed.items():
            del m2[horizon][target]
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=50
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE")
        for horizon, target in removed.items():
            diagnostic = result["horizons"][str(horizon)]
            self.assertEqual(diagnostic["paired_n"], 249)
            self.assertEqual(
                diagnostic["missing_before_scoring"]["expected_without_b3"]["target_mjds"],
                [target],
            )
            self.assertEqual(
                diagnostic["missing_before_scoring"]["expected_without_m2"]["target_mjds"],
                [target],
            )

    def test_joint_observation_and_model_outage_is_not_assessable(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0, n=250)
        removed = min(expected[1])
        rows = [row for row in rows if row["target_mjd"] != removed]
        del m2[1][removed]
        del observed[removed]
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=50
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE")
        missing = result["horizons"]["1"]["missing_before_scoring"]
        self.assertEqual(missing["expected_without_b3"]["target_mjds"], [removed])
        self.assertEqual(missing["expected_without_m2"]["target_mjds"], [removed])
        self.assertEqual(missing["expected_without_observed"]["target_mjds"], [removed])

    def test_unexpected_b3_target_is_not_assessable(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0)
        rows.append({"horizon_days": 1, "target_mjd": 999999.0, "predicted_lod_seconds": 1.0})
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=50
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE")

    def test_unexpected_m2_target_is_not_assessable(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0)
        m2[1][999999.0] = 0.0
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=50
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE")

    def test_unexpected_b3_and_m2_targets_are_not_assessable(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0)
        rows.append({"horizon_days": 1, "target_mjd": 999999.0, "predicted_lod_seconds": 1.0})
        m2[1][999998.0] = 0.0
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=50
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE")
        missing = result["horizons"]["1"]["missing_before_scoring"]
        self.assertEqual(
            missing["unexpected_b3_outside_frozen_population"]["target_mjds"],
            [999999.0],
        )
        self.assertEqual(
            missing["unexpected_m2_outside_frozen_population"]["target_mjds"],
            [999998.0],
        )

    def test_undeclared_horizon_and_duplicate_are_not_assessable(self) -> None:
        rows, m2, observed, expected = synthetic_operational_case(0.0, 1.0)
        rows.append(dict(rows[0]))
        rows.append({"horizon_days": 2, "target_mjd": 999998.0, "predicted_lod_seconds": 1.0})
        result = MODULE.evaluate_operational_relevance(
            rows, m2, observed, expected, custody_available=True, replicates=50
        )
        self.assertEqual(result["annotation"], "OPERATIONAL_RELEVANCE_NOT_ASSESSABLE")
        reasons = {item["reason"] for item in result["input_domain_violations"]}
        self.assertIn("DUPLICATE_B3_HORIZON_TARGET", reasons)
        self.assertIn("UNDECLARED_B3_HORIZON", reasons)

    def test_holm_stops_after_first_failed_ordered_hypothesis(self) -> None:
        rejected = MODULE.holm_rejections({1: 0.01, 3: 0.02, 7: 0.03, 30: 0.04})
        self.assertEqual(rejected, {1: True, 3: False, 7: False, 30: False})


if __name__ == "__main__":
    unittest.main()
