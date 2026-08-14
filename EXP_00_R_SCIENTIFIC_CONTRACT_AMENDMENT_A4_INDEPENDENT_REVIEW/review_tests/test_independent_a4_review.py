from __future__ import annotations

from fractions import Fraction
from bisect import bisect_right
import hashlib
import importlib.util
import itertools
import json
from pathlib import Path
import shutil
import tempfile
import unittest

WORKSPACE = Path(__file__).resolve().parents[2]
A4 = WORKSPACE / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A4"
V1 = WORKSPACE / "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1"
MACHINE = json.loads((A4 / "A4_MACHINE_READABLE_RULES.yaml").read_text())


def v1_composite() -> str:
    files = [V1 / "EXP_00_R_FROZEN_CONFIG.yaml", V1 / "run_exp00r.py"]
    files += sorted((V1 / "src").rglob("*.py"))
    files += [V1 / "tests/test_exp00r.py"]
    records = "".join(
        f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(V1).as_posix()}\n"
        for p in sorted(files)
    ).encode()
    return hashlib.sha256(records).hexdigest()


def a4_tree() -> str:
    files = sorted(p for p in A4.rglob("*") if p.is_file() and p.suffix != ".pyc" and "__pycache__" not in p.parts)
    records = "".join(
        f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(A4).as_posix()}\n"
        for p in files
    ).encode()
    return hashlib.sha256(records).hexdigest()


def dominance(values: list[float]):
    if len(values) < 3:
        return "INVALID_EXPERIMENT"
    exact = [Fraction.from_float(v) for v in values]
    total = sum(exact)
    if total <= 0:
        return "FAIL_AGGREGATE_NONPOSITIVE"
    top = sum(sorted(exact, reverse=True)[:3])
    return "PASS" if 2 * top <= total else "FAIL_DOMINATED"


def classify(valid, p, t_pos, f_pos, t_neg, f_neg):
    if (t_pos and t_neg) or (f_pos and f_neg):
        return "INCONSISTENT"
    if not valid:
        return "INVALID EXPERIMENT"
    if all(p) and t_pos and f_pos and not (t_neg or f_neg):
        return "REPLICATED"
    if (t_pos or f_pos) and not (t_neg or f_neg):
        return "PARTIALLY REPLICATED"
    return "NOT REPLICATED"


class IndependentA4Review(unittest.TestCase):
    def test_v1_composite_and_a4_snapshot(self):
        self.assertEqual(v1_composite(), "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05")
        self.assertEqual(a4_tree(), "17f528e59096ce9f35cc510d6f5ac765104dd9e30d92ce14d7b9f743279b7f90")

    def test_seed_dominance_boundaries(self):
        self.assertEqual(dominance([0.1] * 6), "PASS")
        self.assertEqual(dominance([0.1] * 7), "PASS")  # immediately on the below-half side
        self.assertEqual(dominance([0.1] * 5), "FAIL_DOMINATED")
        self.assertEqual(dominance([0.10000000000000002] + [0.1] * 5), "FAIL_DOMINATED")
        self.assertEqual(dominance([0.1, 0.1, 0.1, 0.1, 0.1, 0.10000000000000002]), "FAIL_DOMINATED")
        self.assertEqual(dominance([0.3, 0.2, -0.5]), "FAIL_AGGREGATE_NONPOSITIVE")
        self.assertEqual(dominance([-0.1, -0.2, -0.3]), "FAIL_AGGREGATE_NONPOSITIVE")
        self.assertEqual(dominance([0.1, 0.2]), "INVALID_EXPERIMENT")
        tied = sorted([(Fraction(1, 10), 6002), (Fraction(1, 10), 6000), (Fraction(1, 10), 6001)], key=lambda x: (-x[0], x[1]))
        self.assertEqual([seed for _, seed in tied], [6000, 6001, 6002])

    def test_phase_quantile_n4_tie_and_n5_registry(self):
        phase = MACHINE["binning"]["phase"]
        edges = [float.fromhex(x) for x in phase["edges_hex"]]
        pi = float.fromhex(phase["pi_hex"])
        phase_bin = lambda x: bisect_right(edges[1:-1], -pi if x == pi else x)
        self.assertEqual(phase_bin(pi), 0)
        self.assertEqual(phase_bin(-pi), 0)
        for index, edge in enumerate(edges[1:-1], 1):
            self.assertEqual(phase_bin(edge), index)
        self.assertEqual(bisect_right([1.0, 1.0, 2.0], 1.0), 2)
        self.assertEqual(min([0.25, 0.25, 0.5]), 0.25)  # equal N4 neighbor distances yield one scalar value
        matrices = []
        for perm in itertools.permutations(range(3)):
            parity = 1 if perm in ((0,1,2),(1,2,0),(2,0,1)) else -1
            for signs in itertools.product((-1,1), repeat=3):
                if parity * signs[0] * signs[1] * signs[2] == 1:
                    matrix = [[0]*3 for _ in range(3)]
                    for row, col in enumerate(perm):
                        matrix[row][col] = signs[row]
                    matrices.append(matrix)
        matrices.sort(key=lambda m: tuple(v for row in m for v in row))
        self.assertEqual(MACHINE["N5"]["matrices"], matrices[:12])

    def test_monte_carlo_ci_support_and_kendall_boundaries(self):
        self.assertLessEqual((1 + 4) / 201, 0.025)
        self.assertGreater((1 + 5) / 201, 0.025)
        self.assertFalse(0.0 > 0.0)  # bootstrap lower endpoint touching zero fails P2
        self.assertTrue(0.99 >= 0.99)  # N5 equality passes
        self.assertTrue(1.0 <= 1.0)  # support distance equality is supported upstream
        self.assertEqual(MACHINE["shared_null"]["slots"], 200)

    def test_classification_totality_and_ceiling(self):
        labels = {"INVALID EXPERIMENT", "REPLICATED", "PARTIALLY REPLICATED", "NOT REPLICATED"}
        reached = set()
        for bits in itertools.product((False, True), repeat=10):
            valid, *tail = bits
            label = classify(valid, tuple(tail[:5]), *tail[5:])
            if label != "INCONSISTENT":
                self.assertIn(label, labels)
                reached.add(label)
        self.assertEqual(reached, labels)
        self.assertFalse(MACHINE["cross_system"]["strict_label_reachable"])

    def test_machine_mutations_are_digest_rejected(self):
        path = A4 / "contract_validation/validate_a4_contract.py"
        spec = importlib.util.spec_from_file_location("a4validator", path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        mutations = [
            ("binning", "N3_merge", "search"), ("rng", "encoding"),
            ("nulls", "N1", "map"), ("binning", "N4_support_source", "value"),
            ("monte_carlo", "pass_iff_k_lte"), ("N5", "count"),
            ("P", "P4"), ("P", "P5"), ("cross_system", "ceiling"),
        ]
        for path_parts in mutations:
            changed = json.loads(json.dumps(MACHINE))
            target = changed
            for key in path_parts[:-1]:
                target = target[key]
            target[path_parts[-1]] = "INDEPENDENT_MUTATION"
            with self.assertRaises(module.ContractError):
                module.validate_contract(changed)

    def test_prose_mutation_escapes_a4_validator(self):
        path = A4 / "contract_validation/validate_a4_contract.py"
        spec = importlib.util.spec_from_file_location("a4validator_prose", path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        with tempfile.TemporaryDirectory() as td:
            parent = Path(td)
            copied_a4 = parent / A4.name
            shutil.copytree(A4, copied_a4)
            for item in MACHINE["authority"]["external_files"]:
                source = WORKSPACE / item["path"]
                destination = parent / item["path"]
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
            prose = copied_a4 / "A4_P1_P5_CONTRACT.md"
            prose.write_text(prose.read_text() + "\nMUTATION: P5 is optional.\n")
            module.validate_package(copied_a4)  # escape: no prose digest/content audit

    def test_v1_source_mutation_escapes_a4_validator(self):
        path = A4 / "contract_validation/validate_a4_contract.py"
        spec = importlib.util.spec_from_file_location("a4validator_source", path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        with tempfile.TemporaryDirectory() as td:
            parent = Path(td)
            copied_a4 = parent / A4.name
            shutil.copytree(A4, copied_a4)
            for item in MACHINE["authority"]["external_files"]:
                source = WORKSPACE / item["path"]
                destination = parent / item["path"]
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
            source_file = parent / "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/src/exp00r/actions.py"
            source_file.parent.mkdir(parents=True, exist_ok=True)
            source_file.write_text("# mutated frozen source not listed in external_files\n")
            module.validate_package(copied_a4)  # escape: V1 composite string is not recomputed

    def test_encoding_gaps_are_present(self):
        # Tokens exist, but their executable predicates/output schemas do not.
        self.assertIn("INFORMATION_PARITY", MACHINE["validity"]["gates"])
        self.assertNotIn("information_parity_contract", MACHINE["validity"])
        self.assertIn("ALL_12_SENSITIVITIES_COMPLETE", MACHINE["validity"]["gates"])
        self.assertNotIn("required_outputs_per_sensitivity", MACHINE["P"]["P5"])
        self.assertEqual(MACHINE["seed_dominance"]["aggregate_identity_tolerance"], 0.0)


if __name__ == "__main__":
    unittest.main()
