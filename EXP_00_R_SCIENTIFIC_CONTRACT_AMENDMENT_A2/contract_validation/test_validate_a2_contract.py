from __future__ import annotations

from copy import deepcopy
import json
from pathlib import Path
import sys
import unittest

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))

from validate_a2_contract import ContractError, load_contract, validate_contract


class ContractMutationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load_contract(ROOT / "A2_MACHINE_READABLE_RULES.yaml")
        cls.prose = "\n".join(path.read_text(encoding="utf-8") for path in sorted(ROOT.glob("*.md")))

    def test_canonical_contract_passes(self):
        validate_contract(deepcopy(self.data), self.prose)

    def test_missing_n1_population_rejected(self):
        changed = deepcopy(self.data)
        del changed["null_worlds"]["N1"]["populations_ref"]
        with self.assertRaises((ContractError, KeyError)):
            validate_contract(changed, self.prose)

    def test_missing_n5_support_quantile_rejected(self):
        changed = deepcopy(self.data)
        del changed["immutable_v1_refs"]["support_quantile"]
        with self.assertRaises((ContractError, KeyError)):
            validate_contract(changed, self.prose)

    def test_changed_null_repetition_count_rejected(self):
        changed = deepcopy(self.data)
        changed["shared_null_contract"]["repetition_ids"]["count"] = 199
        with self.assertRaises(ContractError):
            validate_contract(changed, self.prose)

    def test_missing_dominance_boundary_rejected(self):
        changed = deepcopy(self.data)
        del changed["seed_dominance"]["decision"]["exact_comparison"]
        with self.assertRaises((ContractError, KeyError)):
            validate_contract(changed, self.prose)

    def test_prose_yaml_enum_disagreement_rejected(self):
        changed_prose = self.prose.replace("N4 — support-matched rank permutation", "N4 — altered enum")
        with self.assertRaises(ContractError):
            validate_contract(deepcopy(self.data), changed_prose)


if __name__ == "__main__":
    unittest.main()
