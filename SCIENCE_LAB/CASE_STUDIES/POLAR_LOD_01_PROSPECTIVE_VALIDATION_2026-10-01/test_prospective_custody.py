from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from unittest import mock
from datetime import date, datetime, timezone
from pathlib import Path


SCRIPT = Path(__file__).with_name("prospective_custody.py")
SPEC = importlib.util.spec_from_file_location("prospective_custody", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class CustodyTests(unittest.TestCase):
    def test_contract_verifies(self) -> None:
        contract = MODULE.load_contract()
        self.assertEqual(contract["id"], "POLAR-LOD-01-CUSTODY-CONTRACT-01")
        MODULE.verify_runtime(contract)

    def test_release_is_fail_closed(self) -> None:
        with self.assertRaisesRegex(RuntimeError, "not authorized"):
            MODULE.load_collection_release()

    def test_wrong_interpreter_is_rejected(self) -> None:
        contract = MODULE.load_contract()
        with mock.patch.object(MODULE.sys, "executable", "/usr/bin/false"):
            with self.assertRaisesRegex(RuntimeError, "interpreter SHA-256 mismatch"):
                MODULE.verify_runtime(contract)

    def test_url_allowlist(self) -> None:
        contract = json.loads(MODULE.CONTRACT_PATH.read_text())
        MODULE.validate_url(contract, "c04", contract["sources"]["c04"]["url"])
        vintage = contract["sources"]["eam_vintage"]["url_prefix"] + "ESMGFZ_EAM-90d_03h_2026_275F.asc"
        MODULE.validate_url(contract, "eam_vintage", vintage)
        with self.assertRaises(ValueError):
            MODULE.validate_url(contract, "eam_vintage", "https://example.com/file.asc")
        with self.assertRaises(ValueError):
            MODULE.validate_url(contract, "eam_vintage", contract["sources"]["eam_vintage"]["url_prefix"] + "../x")
        with self.assertRaises(ValueError):
            MODULE.validate_url(contract, "eam_vintage", vintage + "?alternate=1")
        self.assertEqual(MODULE.issue_date_from_vintage_url(contract, vintage), date(2026, 10, 2))
        invalid_day = contract["sources"]["eam_vintage"]["url_prefix"] + "ESMGFZ_EAM-90d_03h_2026_999F.asc"
        with self.assertRaises(ValueError):
            MODULE.issue_date_from_vintage_url(contract, invalid_day)

    def test_append_only_chain_and_tamper_detection(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            anchors = root / "anchors"
            first = MODULE.append_capture(
                root,
                "c04",
                "https://example.invalid/c04",
                "https://example.invalid/c04",
                datetime(2026, 10, 2, 8, 0, tzinfo=timezone.utc),
                datetime(2026, 10, 2, 8, 0, 1, tzinfo=timezone.utc),
                200,
                {"etag": "a"},
                b"opaque-one",
                "release-hash",
                anchor_export_dir=anchors,
            )
            second = MODULE.append_capture(
                root,
                "eam_vintage",
                "https://example.invalid/eam",
                "https://example.invalid/eam",
                datetime(2026, 10, 2, 9, 0, tzinfo=timezone.utc),
                datetime(2026, 10, 2, 9, 0, 1, tzinfo=timezone.utc),
                200,
                {},
                b"opaque-two",
                "release-hash",
                date(2026, 10, 2),
                anchors,
            )
            self.assertEqual(second["previous_entry_sha256"], first["entry_sha256"])
            self.assertTrue(second["eam_cutoff_provisionally_admissible"])
            self.assertEqual(MODULE.verify_custody_root(root), second["entry_sha256"])
            anchor_files = sorted(anchors.glob("*.json"))
            self.assertEqual(len(anchor_files), 2)
            latest_anchor = json.loads(anchor_files[-1].read_text())
            self.assertEqual(latest_anchor["ledger_head_sha256"], second["entry_sha256"])
            self.assertEqual(latest_anchor["ledger_entry_count"], 2)
            self.assertTrue(latest_anchor["remote_git_commit_required_for_admission"])
            raw_path = root / second["raw_relative_path"]
            raw_path.write_bytes(b"tampered")
            with self.assertRaisesRegex(RuntimeError, "Raw byte count mismatch"):
                MODULE.verify_custody_root(root)
            raw_path.write_bytes(b"opaque-two")
            ledger = root / "FIRST_SEEN_LEDGER.jsonl"
            lines = ledger.read_text().splitlines()
            altered = json.loads(lines[0])
            altered["byte_count"] += 1
            lines[0] = json.dumps(altered, sort_keys=True, separators=(",", ":"))
            ledger.write_text("\n".join(lines) + "\n")
            with self.assertRaisesRegex(RuntimeError, "hash mismatch"):
                MODULE.verify_ledger(ledger)

    def test_late_eam_capture_is_marked_inadmissible(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            entry = MODULE.append_capture(
                Path(directory),
                "eam_vintage",
                "https://example.invalid/eam",
                "https://example.invalid/eam",
                datetime(2026, 10, 3, 0, 0, tzinfo=timezone.utc),
                datetime(2026, 10, 3, 0, 0, 1, tzinfo=timezone.utc),
                200,
                {},
                b"opaque",
                "release-hash",
                date(2026, 10, 2),
                Path(directory) / "anchors",
            )
            self.assertFalse(entry["eam_cutoff_provisionally_admissible"])


if __name__ == "__main__":
    unittest.main()
