"""Independent adversarial review tests. Synthetic fixtures only; no registered data."""
from __future__ import annotations

import copy
import hashlib
import inspect
import json
import re
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

LAB = Path(__file__).resolve().parents[2]
A5XE = LAB / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XE"
CODE = A5XE / "contract_validation"
sys.path.insert(0, str(CODE))

import synthetic_raw_bundle as raw
import derive_a5xe_reference as reference
import derive_a5xe_independent as independent
import validate_a5xe_contract as validator


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def refresh(bundle, *sections):
    for section in sections:
        item = next(x for x in bundle["provenance_ledger"] if x["artifact_id"] == section.upper())
        item["sha256"] = raw.digest(bundle[section])


def counterexample():
    bundle = raw.build_bundle()
    for row in bundle["observed_rows"]:
        if row["split"] == "TEST" and row["seed_id"] in {"SYNTH_00", "SYNTH_01"}:
            row["T_supported"] = False
            row["F_supported"] = False
    population = raw.digest(bundle["observed_rows"])
    for worlds in bundle["null_worlds"].values():
        for world in worlds:
            world["population_sha256"] = population
    bundle["model_spec"] = {"family": "UNREGISTERED_MODEL", "l2_C": 999.0, "iterations": 1, "feature_order": ["WRONG"], "canonical_row_order": "WRONG"}
    bundle["attribution"].pop("score_margin_controls")
    bundle["attribution"]["mandatory_report_only"] = {key: {} for key in bundle["attribution"]["mandatory_report_only"]}
    record = bundle["sensitivities"][0]
    record.update(changed_factor_path="wrong.path", primary_value="wrong", sensitivity_value="wrong", p5=False,
                  variant_config_sha256="0" * 64, unchanged_config_sha256="1" * 64, required_outputs=[])
    refresh(bundle, "observed_rows", "null_worlds", "model_spec", "attribution", "sensitivities")
    return bundle


class IndependentA5XEReview(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.canonical = raw.build_bundle()
        cls.canonical_reference = reference.derive(copy.deepcopy(cls.canonical))
        cls.canonical_independent = independent.derive(copy.deepcopy(cls.canonical))
        cls.bad = counterexample()
        cls.bad_reference = reference.derive(copy.deepcopy(cls.bad))
        cls.bad_independent = independent.derive(copy.deepcopy(cls.bad))

    def test_01_v1_composite_independent(self):
        root = LAB / "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"
        files = [root / "EXP_00_R_FROZEN_CONFIG.yaml", root / "run_exp00r.py", root / "tests/test_exp00r.py", *list((root / "src").rglob("*.py"))]
        payload = "".join(f"{sha(path)}  {path.relative_to(root).as_posix()}\n" for path in sorted(files, key=lambda p: p.relative_to(root).as_posix())).encode()
        self.assertEqual((len(files), hashlib.sha256(payload).hexdigest()), (24, "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05"))

    def test_02_a5xe_root_members_independent(self):
        root_path = A5XE / "A5XE_AUTHORITY_ROOT.json"
        root = json.loads(root_path.read_text())
        self.assertEqual(sha(root_path), "fff2d0a96f8d8640afe2ef00a235c17c6c0c77ed1ec16728beea141e5cc060fc")
        self.assertEqual(root["member_count"], 26)
        for member in root["members"]:
            path = A5XE / member["path"]
            data = path.read_bytes()
            if member["mode"] == "NORMALIZED_VALIDATOR":
                data = re.sub(rb'(EXPECTED_A5XE_ROOT\s*=\s*)"[^"]+"', rb'\1"<NORMALIZED_ROOT_DIGEST>"', data, count=1)
            self.assertEqual((path.stat().st_size, hashlib.sha256(data).hexdigest()), (member["bytes"], member["sha256"]))

    def test_03_canonical_paths_equal(self):
        self.assertEqual(self.canonical_reference, self.canonical_independent)

    def test_04_summary_only_rejected_by_both(self):
        bundle = raw.summary_only_attack_bundle()
        for result in (reference.derive(copy.deepcopy(bundle)), independent.derive(copy.deepcopy(bundle))):
            self.assertNotEqual(result["execution_state"], "VALID_SCIENTIFIC_RESULT")
            self.assertIsNone(result["classification"])

    def test_05_direct_decisions_rejected_by_both(self):
        bundle = raw.build_bundle(); bundle.update(P1=True, classification="REPLICATED")
        for result in (reference.derive(copy.deepcopy(bundle)), independent.derive(copy.deepcopy(bundle))):
            self.assertNotEqual(result["execution_state"], "VALID_SCIENTIFIC_RESULT")

    def test_06_n5_typed_failures(self):
        for tier, state in (("SYNTH", "IMPLEMENTATION_FAILURE"), ("RUN", "INVALID_EXPERIMENT")):
            bundle = raw.build_bundle()
            bundle["n5"][tier]["transforms"][0]["comparisons"][0]["transformed_rank"] = [4, 3, 2, 1, 0]
            refresh(bundle, "n5")
            for derive in (reference.derive, independent.derive):
                result = derive(copy.deepcopy(bundle))
                self.assertEqual(result["execution_state"], state)
                self.assertIsNone(result["classification"])

    def test_07_exact_dominance_boundary_and_negative(self):
        exact = [{"seed_id": str(i), "loss0": [x], "loss1": [0.0]} for i, x in enumerate([1., 1., 1., .5, .5, .5, .5, .5, .5, 0.])]
        negative = [{"seed_id": str(i), "loss0": [0.0], "loss1": [1.0]} for i in range(4)]
        for rows, expected in ((exact, True), (negative, False)):
            self.assertEqual(reference.derive_dominance_rows(rows), independent.dominance_decision(rows))
            self.assertEqual(reference.derive_dominance_rows(rows)["pass"], expected)
            self.assertTrue(reference.derive_dominance_rows(rows)["valid"])

    def test_08_machine_semantic_mutations_are_undetected_blocker(self):
        machine = json.loads((A5XE / "A5XE_MACHINE_READABLE_RULES.yaml").read_text())
        attacks = [
            lambda x: x["model"].__setitem__("C", 999),
            lambda x: x["observed"].__setitem__("coherence", "PRODUCER_ASSERTION"),
            lambda x: x["validity"].__setitem__("gates", []),
            lambda x: x["nulls"].__setitem__("fixed_populations", {"fit": "ALL", "evaluate": "ALL"}),
            lambda x: x["sensitivities"].__setitem__("outputs", []),
        ]
        for attack in attacks:
            mutated = copy.deepcopy(machine); attack(mutated)
            self.assertTrue(validator.validate_machine_object(mutated))

    def test_09_counterexample_is_wrongly_accepted_by_both(self):
        self.assertEqual(self.bad_reference, self.bad_independent)
        self.assertEqual(self.bad_reference["execution_state"], "VALID_SCIENTIFIC_RESULT")
        self.assertEqual(self.bad_reference["classification"], "REPLICATED")
        self.assertTrue(all(self.bad_reference["P"].values()))
        self.assertAlmostEqual(self.bad_reference["support"]["joint_fraction"], 1400 / 1500)

    def test_10_joint_support_population_is_not_used(self):
        source = inspect.getsource(reference.observed_and_nulls)
        self.assertIn('row["split"] == "TRAIN_OOF"', source)
        self.assertNotIn("T_supported", source)
        self.assertNotIn("F_supported", source)

    def test_11_sensitivity_metadata_is_not_validated(self):
        rows = reference.validate_rows(self.bad)
        result = reference.sensitivity_metrics(self.bad, rows)
        self.assertIn("ACTION_AMPLITUDE_0.25", result)

    def test_12_a1_missing_from_transitive_ledger(self):
        ledger = json.loads((A5XE / "A5XE_TRANSITIVE_AUTHORITY_LEDGER.json").read_text())
        paths = [path for path, _ in ledger["upstream"]]
        self.assertFalse(any("AMENDMENT_A1/" in path for path in paths))

    def test_13_monte_carlo_ties_are_adverse(self):
        result = reference.monte_carlo(1.0, [1.0] * 5 + [0.0] * 195)
        self.assertEqual(result, {"k": 5, "p": 6 / 201, "pass": False})

    def test_14_bootstrap_wrong_cluster_and_count_fail(self):
        rows = reference.validate_rows(self.canonical)
        train = rows[:1500]; test = rows[1500:]
        train_c, _, _ = reference.agreement([x["T_rank"] for x in train], [x["F_rank"] for x in train])
        test_c, _, _ = reference.agreement([x["T_rank"] for x in test], [x["F_rank"] for x in test])
        for mutate in (lambda b: b["bootstrap"].update(cluster_unit="ROW"), lambda b: b["bootstrap"]["resamples"].pop()):
            bundle = copy.deepcopy(self.canonical); mutate(bundle)
            with self.assertRaises(Exception): reference.validate_bootstrap(rows, bundle["bootstrap"], train_c, test_c)

    def test_15_provenance_and_identity_mutations_fail(self):
        for mutate in (
            lambda b: b["observed_rows"].append(copy.deepcopy(b["observed_rows"][0])),
            lambda b: b["provenance_ledger"][0].update(sha256="0" * 64),
            lambda b: b["sensitivities"].pop(),
            lambda b: b["attribution"]["eligible_test_row_ids"].__setitem__(0, "FOREIGN"),
        ):
            bundle = raw.build_bundle(); mutate(bundle)
            self.assertNotEqual(reference.derive(bundle)["execution_state"], "VALID_SCIENTIFIC_RESULT")

    def test_16_null_membership_and_replicate_count_fail(self):
        rows = reference.validate_rows(self.canonical)
        for mutate in (lambda x: x.pop("N3"), lambda x: x["N1"].pop()):
            evidence = copy.deepcopy(self.canonical["null_worlds"]); mutate(evidence)
            with self.assertRaises(Exception):
                reference.observed_and_nulls(rows, evidence)

    def test_17_n5_transform_identity_and_rank_pair_fail(self):
        for mutate in (
            lambda x: x["SYNTH"]["transforms"][0].update(transform_id=99),
            lambda x: x["RUN"]["transforms"][0]["comparisons"][0].update(original_rank=None, transformed_rank=None, tau=1.0),
        ):
            evidence = copy.deepcopy(self.canonical["n5"]); mutate(evidence)
            with self.assertRaises(Exception): reference.validate_n5(evidence)

    def test_18_sensitivity_identity_and_completeness_fail(self):
        rows = reference.validate_rows(self.canonical)
        for mutate in (
            lambda x: x["sensitivities"][0].update(sensitivity_id="FOREIGN"),
            lambda x: x["sensitivities"].pop(),
        ):
            bundle = copy.deepcopy(self.canonical); mutate(bundle)
            with self.assertRaises(Exception): reference.sensitivity_metrics(bundle, rows)

    def test_19_copied_tree_upstream_mutation_is_detected(self):
        ledger = json.loads((A5XE / "A5XE_TRANSITIVE_AUTHORITY_LEDGER.json").read_text())
        package_names = {Path(path).parts[0] for path, _ in ledger["upstream"]}
        package_names.add("EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1")
        with tempfile.TemporaryDirectory() as directory:
            copied = Path(directory)
            for name in package_names:
                source = LAB / name
                if name == "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A4":
                    shutil.copytree(source, copied / name)
                else:
                    (copied / name).symlink_to(source, target_is_directory=True)
            target = copied / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A4/A4_P1_P5_CONTRACT.md"
            target.write_bytes(target.read_bytes() + b"\nMUTATION\n")
            with self.assertRaises(validator.ContractError):
                validator.verify_transitive_authority(copied)

    def test_20_validator_semantic_rule_change_breaks_root(self):
        root = json.loads((A5XE / "A5XE_AUTHORITY_ROOT.json").read_text())
        member = next(x for x in root["members"] if x["path"] == "contract_validation/validate_a5xe_contract.py")
        data = (CODE / "validate_a5xe_contract.py").read_bytes().replace(b'k<=4', b'k<=5', 1)
        data = re.sub(rb'(EXPECTED_A5XE_ROOT\s*=\s*)"[^"]+"', rb'\1"<NORMALIZED_ROOT_DIGEST>"', data, count=1)
        self.assertNotEqual(hashlib.sha256(data).hexdigest(), member["sha256"])


if __name__ == "__main__":
    unittest.main()
