#!/usr/bin/env python3
"""Static A2 contract validator. No experiment or registered-data capability."""
from __future__ import annotations

import json
from pathlib import Path
import sys


class ContractError(ValueError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ContractError(message)


def load_contract(path: Path) -> dict:
    # A2 YAML is deliberately JSON-compatible YAML, so stdlib JSON is sufficient.
    return json.loads(Path(path).read_text(encoding="utf-8"))


def validate_contract(data: dict, prose: str) -> None:
    require(data["schema_version"] == "2.0", "schema version")
    require(data["authoritative_v1"]["composite_sha256"] == "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05", "V1 hash")

    refs = data["immutable_v1_refs"]
    require(refs["trajectory_neighbors"]["value"] == 25, "N5 trajectory neighbors")
    require(refs["field_neighbors"]["value"] == 100, "N5 field neighbors")
    require(refs["field_ridge_alpha"]["value"] == 1e-6, "N5 field ridge")
    require(refs["support_quantile"]["value"] == 0.99, "N5 support quantile")

    n5 = data["N5"]
    require(set(n5["tiers"]) == {"N5_SYNTH", "N5_RUN"}, "N5 tiers")
    require(n5["transforms"]["count"] == 12, "N5 transform count")
    require(n5["transforms"]["determinant"] == 1, "N5 determinant")
    require(n5["transforms"]["executions_per_transform_per_tier"] == 1, "N5 execution count")
    require(n5["ranking_comparison"]["minimum"] == 0.99, "N5 Kendall threshold")
    require(n5["representation_parameters"]["support_quantile_ref"] == "immutable_v1_refs.support_quantile", "N5 support reference")
    require(n5["synthetic_fixture"]["minimum_comparison_rows"] == 20, "N5 synthetic population")
    require(len(n5["synthetic_fixture"]["training_axes"]["x"]) == 5, "N5 synthetic training grid")

    seed = data["seed_dominance"]
    require(seed["input_numeric"] == "FINITE_IEEE754_BINARY64_PER_ROW_LOG_LOSS", "dominance numeric input")
    require(seed["exact_summation"] == "ARBITRARY_PRECISION_RATIONAL", "dominance summation")
    require(seed["decision"]["exact_comparison"] == "WHEN_G_POSITIVE_PASS_IFF_2_TIMES_D3_LESS_THAN_OR_EQUAL_TO_G", "dominance comparison")
    require(seed["decision"]["epsilon_or_tolerance"] is False, "dominance tolerance")
    require(seed["decision"]["equality_at_half"] == "PASS", "dominance equality")
    require(seed["decision"]["fewer_than_three_eligible_seeds"] == "INVALID_EXPERIMENT", "dominance seed count")

    shared = data["shared_null_contract"]
    require(shared["repetition_ids"]["count"] == 200, "null repetition count")
    require(shared["train_population"] == "ORIGINAL_JOINTLY_SUPPORTED_OOF_VALIDATION_ROW_IDS_INCLUDING_ZERO_CARRIER_ACTIONS", "null train population")
    require(shared["test_population"] == "ORIGINAL_JOINTLY_SUPPORTED_EXTERNAL_TEST_ROW_IDS_INCLUDING_ZERO_CARRIER_ACTIONS", "null test population")
    require(shared["support_membership"] == "FROZEN_ORIGINAL_NO_NULL_INTERSECTION_NO_NULL_ROW_DELETION", "null support")
    require(shared["new_physical_simulation"] is False, "null simulation boundary")

    worlds = data["null_worlds"]
    require(set(worlds) == {"N1", "N2", "N3", "N4"}, "null family registry")
    for name in ("N1", "N2", "N3", "N4"):
        item = worlds[name]
        require(bool(item["randomization_unit"]), f"{name} randomization")
        require(bool(item["support_rule"]), f"{name} support")
        require(bool(item["carrier_action"]), f"{name} carrier action")
        require(bool(item["outcome_rule"]), f"{name} outcome")
        require(item["populations_ref"] == "shared_null_contract.train_population+test_population", f"{name} population")
    require(worlds["N1"]["outcome_simulation"] is False, "N1 outcome simulation")
    require("NULL_BASELINE_MODEL_AND_PREDICTIONS" in worlds["N1"]["recomputed_objects"], "N1 baseline refit")
    require(worlds["N2"]["outcome_rule"] == "FROZEN_OBSERVED_CARRIER_OUTCOME_ROWS_EVEN_IF_DONOR_TOP_ACTION_DIFFERS", "N2 outcome")
    require(worlds["N4"]["subworlds"] == ["N4_T", "N4_F"], "N4 subworlds")

    mc = data["monte_carlo"]
    require(mc["formula"] == "p=(1+count(T_null>=T_observed))/201", "Monte Carlo formula")
    require(mc["maximum_k_for_pass"] == 4 and mc["alpha"] == 0.025, "Monte Carlo boundary")

    for name, anchor in data["prose_anchors"].items():
        require(anchor in prose, f"missing/mismatched prose anchor: {name}")
    require("support quantile 0.99" in prose, "prose N5 support quantile")
    require("exact `2*D3 <= G`" in prose, "prose dominance comparison")
    require("exactly 200" in prose, "prose null repetition count")


def validate_package(root: Path) -> None:
    root = Path(root)
    data = load_contract(root / "A2_MACHINE_READABLE_RULES.yaml")
    prose = "\n".join(path.read_text(encoding="utf-8") for path in sorted(root.glob("*.md")))
    validate_contract(data, prose)


def main(argv: list[str]) -> int:
    root = Path(argv[1]) if len(argv) > 1 else Path(__file__).resolve().parents[1]
    validate_package(root)
    print("A2 STATIC CONTRACT VALIDATION: PASS")
    print("REGISTERED DATA CAPABILITY: NONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
