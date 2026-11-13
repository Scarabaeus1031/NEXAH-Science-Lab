#!/usr/bin/env python3
import csv
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("miwa_gaia_bridge.py")
SPEC = importlib.util.spec_from_file_location("miwa_gaia_bridge", MODULE_PATH)
BRIDGE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(BRIDGE)


class MiwaGaiaBridgeTests(unittest.TestCase):
    def fixture_row(self):
        return {
            "source_id": "123",
            "ra": "101.2",
            "dec": "-16.7",
            "parallax": "20",
            "parallax_error": "0.5",
            "parallax_over_error": "40",
            "phot_g_mean_mag": "5.25",
            "bp_rp": "0.7",
            "ruwe": "1.1",
            "ref_epoch": "2016.0",
            "phot_variable_flag": "VARIABLE",
            "non_single_star": "1",
        }

    def test_inverse_parallax_and_uncertainty_are_explicit(self):
        row = BRIDGE.gaia_row_to_miwa(self.fixture_row(), "bright-nearby", "Q1")
        self.assertEqual(row["distance_pc"], "50")
        self.assertEqual(row["uncertainty"], "1.25")
        self.assertEqual(row["distance_method"], "INVERSE_PARALLAX_1000_OVER_MAS_QUALITY_CUT")
        self.assertEqual(row["epoch"], "2016")
        self.assertEqual(row["source_catalog"], "GAIA")

    def test_display_class_is_bp_rp_proxy_and_behavior_is_preserved(self):
        row = BRIDGE.gaia_row_to_miwa(self.fixture_row(), "bright-nearby", "Q1")
        self.assertEqual(row["spectral_class"], "G")
        self.assertEqual(row["variable"], "true")
        self.assertEqual(row["multiple"], "true")

    def test_presets_keep_quality_cuts_and_m31_foreground_boundary(self):
        bright = BRIDGE.make_adql("bright-nearby", 25)
        sirius = BRIDGE.make_adql("sirius-neighborhood", 25)
        m31 = BRIDGE.make_adql("andromeda-field", 25)
        self.assertIn("parallax_over_error >= 10", bright)
        self.assertIn("101.28715533", sirius)
        self.assertIn("10.6847083", m31)
        self.assertEqual(BRIDGE.PRESETS["andromeda-field"]["carrier"], "Milky Way")
        self.assertIn("foreground", BRIDGE.PRESETS["andromeda-field"]["boundary"])

    def test_reference_anchors_are_not_labeled_as_gaia_rows(self):
        sirius = BRIDGE.anchor_rows("sirius-neighborhood", "Q1")[0]
        m31 = BRIDGE.anchor_rows("andromeda-field", "Q2")[0]
        self.assertEqual(sirius["source_id"], "SIRIUS")
        self.assertNotEqual(sirius["source_catalog"], "GAIA")
        self.assertEqual(m31["carrier"], "Andromeda")
        self.assertEqual(m31["field_role"], "M31_CORE_ANCHOR_NOT_GAIA_ROW")

    def test_csv_matches_miwa_schema_and_retains_provenance(self):
        row = BRIDGE.gaia_row_to_miwa(self.fixture_row(), "bright-nearby", "Q1")
        with tempfile.TemporaryDirectory() as temp_dir:
            target = Path(temp_dir) / "fixture.csv"
            self.assertEqual(BRIDGE.write_csv(target, [row]), 1)
            with target.open(encoding="utf-8", newline="") as handle:
                loaded = list(csv.DictReader(handle))
        self.assertEqual(list(loaded[0]), BRIDGE.CSV_FIELDS)
        self.assertEqual(loaded[0]["query_id"], "Q1")
        self.assertTrue(loaded[0]["source_url"].startswith("https://"))

    def test_generated_preset_set_is_complete_and_boundary_safe(self):
        root = Path(__file__).parent
        manifest = json.loads((root / "MIWA_GAIA_PRESET_MANIFEST.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["identity_reuse"], ["MOD:OBSERVATORY_MIWA", "ART:MIWA:MAIN"])
        self.assertFalse(manifest["authority"])
        self.assertEqual(manifest["graph_delta"], 0)
        self.assertEqual(len(manifest["presets"]), 3)
        self.assertEqual(manifest["browser_bundle"], "MIWA_GAIA_PRESETS.js")
        bundle_path = root / manifest["browser_bundle"]
        self.assertTrue(bundle_path.exists())
        self.assertIn("window.MIWA_GAIA_PRESETS", bundle_path.read_text(encoding="utf-8"))
        loaded = {}
        for record in manifest["presets"]:
            with (root / record["file"]).open(encoding="utf-8", newline="") as handle:
                rows = list(csv.DictReader(handle))
            self.assertEqual(len(rows), record["row_count"])
            self.assertEqual(list(rows[0]), BRIDGE.CSV_FIELDS)
            self.assertTrue(all(row["query_id"] == record["query_id"] for row in rows))
            loaded[record["preset"]] = rows
        sirius = loaded["sirius-neighborhood"]
        self.assertEqual(sum(row["source_id"] == "SIRIUS" for row in sirius), 1)
        m31 = loaded["andromeda-field"]
        self.assertEqual(sum(row["carrier"] == "Andromeda" for row in m31), 1)
        self.assertTrue(all(row["carrier"] == "Milky Way" for row in m31 if row["source_catalog"] == "GAIA"))


if __name__ == "__main__":
    unittest.main()
