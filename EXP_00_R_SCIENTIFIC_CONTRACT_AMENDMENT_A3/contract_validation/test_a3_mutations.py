from __future__ import annotations

from copy import deepcopy
from pathlib import Path
import sys
import unittest

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))

from validate_a3_contract import ContractError, load_contract, validate_contract


def change(data, path, value):
    node = data
    for key in path[:-1]:
        node = node[key]
    node[path[-1]] = value


class A3MutationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load_contract(ROOT / "A3_MACHINE_READABLE_RULES.yaml")
        cls.prose = "\n".join(p.read_text(encoding="utf-8") for p in sorted(ROOT.glob("*.md")))

    def test_canonical_contract(self):
        validate_contract(deepcopy(self.data), self.prose)

    def test_all_material_mutations_rejected(self):
        mutations = [
            ("clockwise_to_counterclockwise", ("N3","clockwise_merge","empty_search_order"), "FOR_D_EQUALS_1_TO_7_TEST_(BIN_PLUS_D)_MOD_8"),
            ("rng_tuple_order", ("rng","suffix_fields","N3"), ["ROW","SPLIT"]),
            ("rng_serialization", ("rng","suffix_format"), "JSON_ARRAY"),
            ("hash_to_seed", ("rng","seed_conversion"), "UNSIGNED_64_BIT_LITTLE_ENDIAN_INTEGER"),
            ("generator", ("rng","generator"), "MT19937"),
            ("draw_order", ("rng","preliminary_draws"), 1),
            ("bin_closure", ("binning","quantiles","assignment"), "LEFT_INSERTION_IN_CUTPOINT_ARRAY"),
            ("positive_pi", ("binning","phase","positive_and_negative_pi"), "POSITIVE_PI_BIN_7"),
            ("n1_inverse", ("N1","direction"), "ORIGINAL_LABEL_a_TO_INVERSE_pi(a)"),
            ("row_order", ("ordering","donor_candidates"), "INCIDENTAL_TABLE_ORDER"),
            ("donor_order", ("N3","candidate_order"), "UNSORTED"),
            ("neighbor_tie_order", ("ordering","nearest_neighbor_order"), "LIBRARY_PARTITION_ORDER"),
            ("n5_not_first", ("N5","selection"), "ANY_12_AFTER_SORT"),
            ("n5_support", ("N5","representation_parameters","support_quantile"), 0.95),
            ("n5_remove_paths", ("N5","synthetic_fixture","training_paths"), "ONE_ACTION_ONLY"),
            ("n5_mean", ("N5","ranking","aggregation"), "MEAN_OVER_COMPARISONS"),
            ("remove_nearest_rank", ("null_reporting","decision_authority"), "PERCENTILE_REPLACES_P_VALUE"),
            ("strict_dominance", ("preserved_contract","seed_dominance","status"), "CHANGED_TO_STRICT"),
            ("float_dominance", ("preserved_contract","seed_dominance","source"), "FLOAT_RULE"),
            ("null_support", ("preserved_contract","null_support"), "NULL_SPECIFIC"),
            ("test_population", ("preserved_contract","fixed_null_populations","test"), "NULL_TEST_ROWS"),
            ("carrier_outcome", ("N2","fixed_carrier_outcomes_support_population_and_models"), "DONOR_OUTCOME"),
            ("n1_support", ("N1","support_population_failure_and_models"), "NULL_SUPPORT"),
            ("n3_seed", ("N3","donor_filter"), "SAME_MAPPED_STRATA_ANY_SEED"),
            ("n4_direction", ("N4","merge"), ["LOWER_FIRST"]),
            ("n4_minimum", ("N4","merge"), ["MINIMUM_9"]),
            ("n4_carrier", ("N4","P3"), "T_USES_N4_F_F_USES_N4_T"),
            ("allow_retry", ("failure_rules","retry"), True),
            ("mc_k5", ("preserved_contract","monte_carlo","pass_iff_k_lte"), 5),
            ("n5_count", ("N5","count"), 11),
            ("n5_stage", ("N5","tiers","N5_RUN","stage_before"), ["CLASSIFICATION"]),
            ("p2_gate", ("preserved_contract","P2"), "NULL_P_VALUE_ADDITIONAL_GATE")
        ]
        required = set(self.data["validator"]["required_mutations"])
        self.assertEqual(len(required), 32)
        self.assertEqual(len(mutations), 32)
        for name, path, value in mutations:
            with self.subTest(name=name):
                altered = deepcopy(self.data)
                change(altered, path, value)
                with self.assertRaises(ContractError):
                    validate_contract(altered, self.prose)


if __name__ == "__main__":
    unittest.main()
