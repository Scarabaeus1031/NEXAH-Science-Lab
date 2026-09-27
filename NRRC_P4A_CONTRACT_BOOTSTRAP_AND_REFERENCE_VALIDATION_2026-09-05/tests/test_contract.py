from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "validator"))
sys.path.insert(0, str(ROOT / "tests"))

from nrrc_validate import TYPE_NAMES, load_json_strict, validate_record, validate_schema  # noqa: E402
from generate_fixtures import build  # noqa: E402


class ContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.schema_path = ROOT / "schemas" / "nexah.relation-record-0.1-candidate.schema.json"
        cls.positive_path = ROOT / "fixtures" / "positive" / "complete_trace_audit_residual_return.json"

    def test_schema_parses_and_is_valid_candidate_shape(self):
        schema = load_json_strict(self.schema_path)
        self.assertEqual([], validate_schema(schema))

    def test_every_required_type_is_reachable(self):
        schema = load_json_strict(self.schema_path)
        self.assertEqual(TYPE_NAMES, set(schema["$defs"]))
        self.assertEqual(14, len(schema["$defs"]))

    def test_positive_fixture_validates(self):
        self.assertEqual([], validate_record(load_json_strict(self.positive_path)))

    def test_trace_has_exact_five_and_side_is_separate(self):
        record = load_json_strict(self.positive_path)
        self.assertEqual({"P", "D", "C", "Phi", "S"}, set(record["trace_record"]["local_descriptor"]))
        self.assertIn("side_status", record["trace_record"])
        self.assertNotIn("side_status", record["trace_record"]["local_descriptor"])

    def test_ilau_has_exact_four_buckets(self):
        record = load_json_strict(self.positive_path)["ilau_audit_record"]
        self.assertEqual({"I", "L", "A", "U"}, {k for k in record if k in {"I", "L", "A", "U", "M", "REST"}})

    def test_all_negative_fixtures_reject(self):
        paths = sorted((ROOT / "fixtures" / "negative").glob("*.json"))
        self.assertGreaterEqual(len(paths), 15)
        for path in paths:
            with self.subTest(path=path.name):
                try:
                    errors = validate_record(load_json_strict(path))
                except ValueError:
                    errors = ["parse.reject"]
                self.assertTrue(errors, path.name)

    def test_required_negative_outcomes(self):
        cases = {
            "01_missing_return_test.json": "required.missing:$.return_test_record",
            "02_extra_undeclared_field.json": "field.undeclared:$.ontology",
            "03_broken_reference.json": "reference.trace_frame_id",
            "04_duplicate_identifier.json": "identifier.duplicate",
            "05_invalid_side_enum.json": "side_status.invalid",
            "07_inconsistent_return_decision.json": "return.decision_inconsistent",
            "08_incomplete_provenance.json": "provenance.order",
            "09_raised_claim_ceiling.json": "claim_ceiling.raised",
            "10_altered_content_hash.json": "content_hash.mismatch",
            "11_missing_trace_component.json": "required.missing:$.trace_record.local_descriptor.Phi",
            "12_ilau_extra_bucket.json": "field.undeclared:$.ilau_audit_record.M",
            "13_side_embedded_in_descriptor.json": "field.undeclared:$.trace_record.local_descriptor.side",
            "14_machine_claim_authority.json": "human_authority.flag:machine_claim_authority",
            "15_unregistered_extension.json": "extension.unregistered",
        }
        for name, expected in cases.items():
            with self.subTest(name=name):
                errors = validate_record(load_json_strict(ROOT / "fixtures" / "negative" / name))
                self.assertIn(expected, errors)
        with self.assertRaises(ValueError):
            load_json_strict(ROOT / "fixtures" / "negative" / "06_nonfinite_tolerance.json")

    def test_two_clean_fixture_runs_are_deterministic(self):
        with tempfile.TemporaryDirectory() as a, tempfile.TemporaryDirectory() as b:
            self.assertEqual(build(Path(a)), build(Path(b)))

    def test_cli_output_is_deterministic(self):
        cmd = [sys.executable, str(ROOT / "validator" / "nrrc_validate.py"), str(self.positive_path), "--schema", str(self.schema_path)]
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
        first = subprocess.run(cmd, check=False, capture_output=True, env=env)
        second = subprocess.run(cmd, check=False, capture_output=True, env=env)
        self.assertEqual(0, first.returncode)
        self.assertEqual(first.stdout, second.stdout)
        self.assertEqual(first.stderr, second.stderr)

    def test_package_manifest_verifies(self):
        manifest = ROOT / "MANIFEST_SHA256.txt"
        self.assertTrue(manifest.is_file())
        for line in manifest.read_text(encoding="utf-8").splitlines():
            digest, name = line.split("  ", 1)
            self.assertEqual(digest, hashlib.sha256((ROOT / name).read_bytes()).hexdigest(), name)


if __name__ == "__main__":
    unittest.main()
