from __future__ import annotations

from copy import deepcopy
import json
from pathlib import Path
import unittest

from validate_a4_contract import ContractError, validate_contract

ROOT = Path(__file__).resolve().parents[1]


def set_path(obj, path, value):
    target = obj
    for key in path[:-1]:
        target = target[key]
    target[path[-1]] = value


class MutationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.canonical = json.loads((ROOT / "A4_MACHINE_READABLE_RULES.yaml").read_text())

    def reject(self, name, path=None, value=None, callback=None):
        mutated = deepcopy(self.canonical)
        if callback:
            callback(mutated)
        else:
            set_path(mutated, path, value)
        with self.assertRaises(ContractError, msg=name):
            validate_contract(mutated)

    def test_all_required_mutations_rejected(self):
        cases = [
            ("N3 clockwise", ("binning","N3_merge","search"), "FIRST_NONEMPTY_(B+D)_MOD_8"),
            ("phase wrap", ("binning","phase","clockwise"), "NO_WRAP"),
            ("N4 merge priority", ("binning","N4_merge","priority"), "LOWER_FIRST"),
            ("N4 distance", ("binning","N4_support_source","value"), "SELF_INCLUSIVE"),
            ("RNG serialization", ("rng","suffix"), "JSON"),
            ("RNG encoding", ("rng","encoding"), "UTF-16"),
            ("RNG hash", ("rng","hash"), "SHA-512"),
            ("RNG byte order", ("rng","byte_order"), "LITTLE_ENDIAN"),
            ("RNG seed width", ("rng","seed_width_bits"), 32),
            ("RNG generator", ("rng","generator"), "MT19937"),
            ("replicate numbering", ("ordering","null_replicates","start"), 1),
            ("stream consumption", ("rng","preliminary_draws"), 1),
            ("row ordering", ("ordering","row_key"), ["SEED","ROW"]),
            ("action ordering", ("ordering","actions"), [0,-0.5,-0.25,0.25,0.5]),
            ("donor ordering", ("ordering","donors"), "FILESYSTEM"),
            ("N1 inverse", ("nulls","N1","map"), "pi_inverse(action[j])"),
            ("cutpoint equality", ("binning","quantiles","exact_cutpoint"), "LOWER_BIN"),
            ("positive pi", ("binning","phase","normalize_positive_pi_to_negative_pi"), False),
            ("repeated cutpoints", ("binning","quantiles","duplicates"), "COLLAPSE"),
            ("support population", ("shared_null","support"), "NULL_INTERSECTION"),
            ("carrier outcomes", ("nulls","N2","fixed"), []),
            ("invalid replicate", ("shared_null","invalid_slot"), "OMIT"),
            ("199 repetitions", ("shared_null","slots"), 199),
            ("201 repetitions", ("shared_null","slots"), 201),
            ("k<=5", ("monte_carlo","pass_iff_k_lte"), 5),
            ("N5 count", ("N5","count"), 11),
            ("N5 order", ("N5","matrix_order"), "REVERSED"),
            ("N5 support", ("N5","parameters","support_quantile"), .95),
            ("N5 aggregation", ("N5","ranking","aggregation"), "MEAN"),
            ("signed dominance", ("seed_dominance","signed"), False),
            ("float dominance", ("seed_dominance","sum"), "FLOAT64"),
            ("equal seed weighting", ("seed_dominance","contribution"), "EQUAL_SEED"),
            ("omitted P4", None, None),
            ("omitted P5", None, None),
            ("omitted validity gate", None, None),
            ("classification precedence", ("classification","precedence"), []),
            ("overlapping labels", ("classification","mutually_exclusive"), False),
            ("missing label", ("classification","exhaustive"), False),
            ("Lorenz ceiling", ("cross_system","strict_label_reachable"), True),
        ]
        callbacks = {
            "omitted P4": lambda d: d["P"].pop("P4"),
            "omitted P5": lambda d: d["P"].pop("P5"),
            "omitted validity gate": lambda d: d["validity"]["gates"].pop(),
        }
        for name, path, value in cases:
            with self.subTest(name=name):
                self.reject(name, path, value, callbacks.get(name))


if __name__ == "__main__":
    unittest.main()

