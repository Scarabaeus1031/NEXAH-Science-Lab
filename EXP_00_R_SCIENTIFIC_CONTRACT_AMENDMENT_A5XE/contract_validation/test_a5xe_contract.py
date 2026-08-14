import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import validate_a5xe_contract as contract


class StaticContractTests(unittest.TestCase):
    def test_machine_contract_is_semantically_valid(self):
        self.assertTrue(contract.validate_machine_object(contract.validate_machine()))

    def test_transitive_authority_is_verified_member_by_member(self):
        self.assertTrue(contract.verify_transitive_authority())

    def test_machine_hash_is_not_the_only_check(self):
        machine = copy.deepcopy(contract.validate_machine())
        machine["nulls"]["R"] = 199
        with self.assertRaises(contract.ContractError):
            contract.validate_machine_object(machine)

    def test_states_are_typed_and_classification_is_gated(self):
        states = contract.validate_machine()["states"]
        self.assertEqual(states["preauthorization_failure"], "IMPLEMENTATION_FAILURE")
        self.assertEqual(states["postauthorization_invalid"], "INVALID_EXPERIMENT")
        self.assertEqual(states["classification_only_when"], "VALID_SCIENTIFIC_RESULT")

    def test_no_registered_execution_or_authorization(self):
        self.assertEqual(contract.validate_machine()["nonexecution"], {
            "registered_data_accessed": False,
            "implementation_created": False,
            "authorization_created": False,
            "registered_experiment_executed": False,
        })

    def test_changed_upstream_and_updated_local_manifest_cannot_redefine_authority(self):
        ledger_path = contract.PKG / "A5XE_TRANSITIVE_AUTHORITY_LEDGER.json"
        ledger = json.loads(ledger_path.read_text())
        ledger["upstream"][0][1] = "0" * 64
        with tempfile.TemporaryDirectory() as directory:
            altered = Path(directory) / "altered_local_manifest.json"
            altered.write_text(json.dumps(ledger, sort_keys=True))
            with self.assertRaisesRegex(contract.ContractError, "authority ledger"):
                contract.verify_transitive_authority(ledger_path=altered)


if __name__ == "__main__":
    unittest.main()
