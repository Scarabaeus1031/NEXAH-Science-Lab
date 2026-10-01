#!/usr/bin/env python3
"""Negative controls for the repaired POLAR-LOD-EAM parser."""

from __future__ import annotations

import importlib.util
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


if __name__ == "__main__":
    unittest.main()
