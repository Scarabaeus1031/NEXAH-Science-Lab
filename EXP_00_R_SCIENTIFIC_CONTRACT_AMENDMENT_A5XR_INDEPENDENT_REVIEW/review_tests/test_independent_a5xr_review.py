from __future__ import annotations

import copy
import hashlib
import importlib.util
import json
import math
from pathlib import Path
import unittest

from independent_reference import classify, cross_system, dominance, missing_raw_derivations, monte_carlo

LAB = Path(__file__).resolve().parents[2]
A5XR = LAB / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XR"
V1 = LAB / "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"
BUNDLE = json.loads((A5XR / "fixtures/canonical_raw_artifact_bundle.json").read_text())


def load(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


DERIVE = load("a5xr_derive_review", A5XR / "contract_validation/derive.py")


def v1_composite() -> str:
    files = [V1 / "EXP_00_R_FROZEN_CONFIG.yaml", V1 / "run_exp00r.py", V1 / "tests/test_exp00r.py"]
    files += list((V1 / "src").rglob("*.py"))
    records = "".join(
        f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(V1).as_posix()}\n"
        for path in sorted(files, key=lambda p: p.relative_to(V1).as_posix())
    ).encode()
    return hashlib.sha256(records).hexdigest()


class IndependentA5XRReview(unittest.TestCase):
    def test_v1_and_a5xr_root_integrity(self):
        self.assertEqual(v1_composite(), "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05")
        root_path = A5XR / "A5XR_AUTHORITY_ROOT.json"
        self.assertEqual(hashlib.sha256(root_path.read_bytes()).hexdigest(), "2cb5c5df75639dd69534a1c084ab35cdc16f9e378d6888e0a5cb8c1b114598a8")
        root = json.loads(root_path.read_text())
        self.assertEqual(root["member_count"], 23)
        self.assertEqual(len(root["members"]), 23)

    def test_canonical_bundle_is_accepted_by_a5xr_but_not_raw_complete(self):
        result = DERIVE.end_to_end(copy.deepcopy(BUNDLE))
        self.assertEqual(result["classification"], "REPLICATED")
        missing = set(missing_raw_derivations(BUNDLE))
        self.assertTrue({
            "SUPPORT_T_F_RAW_MEMBERSHIP", "BOOTSTRAP_RAW_SEED_CLUSTER_T",
            "N1_RAW_REPLICATES", "N1_REQUIRED_STATISTICS",
            "N5_SYNTH_RAW_TRANSFORM_DERIVATION", "N5_RUN_RAW_TRANSFORM_DERIVATION",
            "P4_REPORT_ONLY_RESULTS", "P4_RAW_PER_SEED_DIRECTIONS",
            "CANONICAL_PROVENANCE_LEDGER",
        } <= missing)

    def test_null_worlds_are_summaries_not_reconstructed_worlds(self):
        for family, artifact in BUNDLE["nulls"].items():
            self.assertNotIn("replicates", artifact)
            self.assertNotIn("T_coefficient", artifact["statistics"])
            self.assertNotIn("F_coefficient", artifact["statistics"])
            for column in artifact["statistics"].values():
                self.assertEqual(column["encoding"], "constant")
                self.assertEqual(column["count"], 200)
        self.assertTrue(DERIVE.validate_nulls(copy.deepcopy(BUNDLE["nulls"])))

    def test_n5_accepts_one_supplied_comparison_per_transform(self):
        for tier in ("SYNTH", "RUN"):
            self.assertEqual([len(row["comparisons"]) for row in BUNDLE["n5"][tier]["transforms"]], [1] * 12)
        self.assertTrue(DERIVE.validate_n5(copy.deepcopy(BUNDLE["n5"])))

    def test_support_fractions_are_not_derived_from_T_F_membership(self):
        changed = copy.deepcopy(BUNDLE["support"])
        changed["fractions"]["T_oos"] = 0.0
        changed["fractions"]["F_oos"] = 0.0
        for index, block in enumerate(changed["seed_blocks"]):
            block["row_id_prefix"] = f"ARBITRARY_PREFIX_{index}"
        self.assertTrue(DERIVE.derive_support(changed))

    def test_sensitivity_support_internal_contradiction_is_accepted(self):
        support = BUNDLE["sensitivities"]["results"]["ACTION_AMPLITUDE_0.25"]["support"]
        self.assertEqual(support["contributing_seeds"], 30)
        self.assertEqual(len(support["rows_per_seed"]), 1)
        self.assertTrue(DERIVE.validate_sensitivities(copy.deepcopy(BUNDLE["sensitivities"])))

    def test_report_only_results_and_raw_seed_directions_are_absent(self):
        self.assertNotIn("mandatory_report_only_results", BUNDLE["attribution"])
        self.assertNotIn("per_seed_row_inputs", BUNDLE["attribution"])
        self.assertTrue(DERIVE.end_to_end(copy.deepcopy(BUNDLE))["P"]["P4"])

    def test_failed_dominance_is_not_a_scientific_false_result(self):
        changed = copy.deepcopy(BUNDLE)
        changed["seed_dominance"]["carriers"]["T"][0]["loss0"] = [0.10000000000000002]
        with self.assertRaisesRegex(ValueError, "dominance >50"):
            DERIVE.end_to_end(changed)
        rows = changed["seed_dominance"]["carriers"]["T"]
        independent = dominance(rows)
        self.assertTrue(independent["valid"])
        self.assertFalse(independent["pass"])

    def test_n5_failure_states_are_not_distinguished(self):
        synth = copy.deepcopy(BUNDLE["n5"])
        synth["SYNTH"]["transforms"][0]["comparisons"] = [0.98]
        run = copy.deepcopy(BUNDLE["n5"])
        run["RUN"]["transforms"][0]["comparisons"] = [0.98]
        for artifact in (synth, run):
            with self.assertRaisesRegex(ValueError, "N5 transform record"):
                DERIVE.validate_n5(artifact)

    def test_each_proposition_can_flip_from_raw_summary_fields(self):
        mutators = {
            "P1": lambda b: b["observed"]["agreement"].update(mean_coherence=0.1),
            "P2": lambda b: b["observed"]["carriers"]["T"].update(coefficient=0.0),
            "P3": lambda b: b["observed"]["carriers"]["T"].update(brier_augmented=0.3),
            "P4": lambda b: b["attribution"]["per_seed_directions"]["T"].update(value=-0.1),
            "P5": lambda b: b["sensitivities"]["results"]["ACTION_AMPLITUDE_0.25"]["carrier_results"]["T"].update(gain=-0.1),
        }
        for proposition, mutate in mutators.items():
            changed = copy.deepcopy(BUNDLE)
            mutate(changed)
            self.assertFalse(DERIVE.end_to_end(changed)["P"][proposition], proposition)

    def test_monte_carlo_boundary_and_exact_dominance(self):
        self.assertTrue(monte_carlo(1.0, [0.0] * 196 + [1.0] * 4))
        self.assertFalse(monte_carlo(1.0, [0.0] * 195 + [1.0] * 5))
        self.assertTrue(dominance([{"seed_id": str(i), "loss0": [0.1], "loss1": [0.0]} for i in range(6)])["pass"])
        self.assertFalse(dominance([{"seed_id": "0", "loss0": [math.nextafter(0.1, math.inf)], "loss1": [0.0]}] + [{"seed_id": str(i), "loss0": [0.1], "loss1": [0.0]} for i in range(1, 6)])["pass"])

    def test_independent_classifier_is_total_exclusive_and_ceiling_bound(self):
        all_true = {f"P{i}": True for i in range(1, 6)}
        labels = {
            classify(False, all_true, {"T": True, "F": True}, {"T": False, "F": False}),
            classify(True, all_true, {"T": True, "F": True}, {"T": False, "F": False}),
            classify(True, {**all_true, "P1": False}, {"T": True, "F": False}, {"T": False, "F": False}),
            classify(True, all_true, {"T": False, "F": False}, {"T": False, "F": False}),
        }
        self.assertEqual(labels, {"INVALID EXPERIMENT", "REPLICATED", "PARTIALLY REPLICATED", "NOT REPLICATED"})
        self.assertEqual(cross_system(False, all_true, "INVALID EXPERIMENT"), "INCONCLUSIVE")
        self.assertEqual(cross_system(True, all_true, "REPLICATED"), "PARTIAL CROSS-SYSTEM REPLICATION")

    def test_a5xr_raw_runner_has_no_invalid_or_implementation_failure_return(self):
        changed = copy.deepcopy(BUNDLE)
        changed["support"]["fractions"]["joint"] = 0.0
        with self.assertRaises(ValueError):
            DERIVE.end_to_end(changed)
        source = (A5XR / "contract_validation/derive.py").read_text()
        self.assertNotIn('"IMPLEMENTATION_FAILURE"', source)

    def test_upstream_authority_is_not_transitively_verified(self):
        validator = (A5XR / "contract_validation/validate_a5xr_contract.py").read_text()
        self.assertIn('sha(LAB/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5X/A5X_AUTHORITY_ROOT.json")', validator)
        self.assertNotIn("verify_authority", validator)
        root_paths = {row["path"] for row in json.loads((A5XR / "A5XR_AUTHORITY_ROOT.json").read_text())["members"]}
        self.assertFalse(any(path.startswith("../EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5X/") for path in root_paths))


if __name__ == "__main__":
    unittest.main(verbosity=2)
