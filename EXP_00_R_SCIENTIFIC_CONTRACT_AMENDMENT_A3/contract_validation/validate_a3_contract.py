#!/usr/bin/env python3
"""Static A3 contract validator; no scientific or registered-data capability."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys


CANONICAL_OBJECT_SHA256 = "455971416edc9257064e694513a8d35004e073e867195cbea3935ff1df210165"
CANONICAL_PROSE_COMPOSITE_SHA256 = "7d7db25ec49b65d6b2f3c0feb608640f324d5d12d283b8e8d3fcd079e2d48650"


class ContractError(ValueError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ContractError(message)


def canonical_digest(data: dict) -> str:
    payload = json.dumps(data, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def load_contract(path: Path) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def validate_contract(data: dict, prose: str) -> None:
    require(canonical_digest(data) == CANONICAL_OBJECT_SHA256, "canonical A3 machine object digest")
    require(data["schema_version"] == "3.0", "schema")
    require(data["authority"]["v1_composite_sha256"] == "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05", "V1 hash")
    require(data["authority"]["immutable_a2_machine"]["sha256"] == "e4ff751c40b1568ad4683a943e062209de13439a309f5e9e2a79fb465791cd25", "A2 hash")

    phase = data["binning"]["phase"]
    require(phase["index_geometry"] == "INCREASING_INDEX_IS_COUNTERCLOCKWISE_DECREASING_INDEX_IS_CLOCKWISE", "clockwise geometry")
    require(phase["positive_and_negative_pi"] == "BOTH_BIN_0_AFTER_NORMALIZATION", "pi boundary")
    require(phase["algorithm"] == "RIGHT_INSERTION_AMONG_SEVEN_INTERNAL_EDGES", "phase closure")
    require(len(phase["edges_hex"]) == 9, "phase edges")
    quant = data["binning"]["quantiles"]
    require(quant["assignment"] == "RIGHT_INSERTION_IN_CUTPOINT_ARRAY", "quantile closure")
    require("RIGHT_OF_ALL_EQUAL" in quant["exact_cutpoint"], "duplicate cutpoints")

    rng = data["rng"]
    require(rng["hash"] == "SHA-256", "RNG hash")
    require(rng["digest_slice"] == {"start_byte": 0, "stop_exclusive": 8}, "hash slice")
    require(rng["seed_conversion"] == "UNSIGNED_64_BIT_BIG_ENDIAN_INTEGER", "seed conversion")
    require(rng["generator"] == "numpy.random.Generator(numpy.random.PCG64(seed))", "generator")
    require(rng["generator_semantics"] == "NUMPY_2.3.5_ON_FROZEN_V1_MACOS_26.5.2_ARM64_ENVIRONMENT_OTHER_ENVIRONMENTS_FAIL_PREFLIGHT", "generator version")
    require(rng["suffix_fields"] == {"N1": ["REP", "SEED"], "N2": ["SPLIT", "SEED"], "N3": ["SPLIT", "ROW"], "N4": ["SPLIT", "CARRIER", "STRATUM"]}, "namespace order")
    require(rng["retry_or_replacement_draw"] is False and rng["preliminary_draws"] == 0, "draw consumption")

    require(data["N1"]["direction"] == "ORIGINAL_LABEL_a_TO_FORWARD_pi(a)", "N1 forward map")
    require(data["N2"]["population_order"] == "CANONICAL_ROW_KEY_ASCENDING_WITHIN_SPLIT_AND_SEED", "N2 row order")
    require(data["ordering"]["nearest_neighbor_order"].startswith("FINITE_BINARY64_DISTANCE_ASCENDING"), "neighbor tie order")
    require(data["N3"]["candidate_order"] == "CANONICAL_ROW_KEY_ASCENDING", "N3 donors")
    require(data["N3"]["clockwise_merge"]["empty_search_order"] == "FOR_D_EQUALS_1_TO_7_TEST_(BIN_MINUS_D)_MOD_8", "N3 clockwise")
    require("SMALLEST_STRICTLY_HIGHER" in data["N4"]["merge"][3], "N4 merge")
    require(data["N4"]["P3"] == "T_USES_N4_T_F_USES_N4_F", "N4 carriers")

    n5 = data["N5"]
    require(n5["selection"] == "FIRST_12_AFTER_SORT" and n5["count"] == 12 and len(n5["matrices"]) == 12, "N5 registry")
    require(n5["representation_parameters"]["support_quantile"] == 0.99, "N5 support")
    require("EVERY_TRAINING_STATE_FOR_EVERY_CANONICAL_ACTION" in n5["synthetic_fixture"]["training_paths"], "N5 paths")
    require(n5["ranking"]["aggregation"].startswith("MINIMUM_OVER_ALL_REQUIRED"), "N5 aggregation")
    require("INTERVENTION_OUTCOMES" in n5["tiers"]["N5_RUN"]["stage_before"], "N5 order")

    report = data["null_reporting"]
    require(report["descriptive_quantile"] == {"probability": 0.975, "method": "NEAREST_RANK_CEIL_P_TIMES_R", "R": 200, "one_based_rank": 195, "zero_based_index": 194}, "nearest rank")
    require(report["decision_authority"] == "MONTE_CARLO_P_ONLY", "report authority")
    require(data["preserved_contract"]["monte_carlo"]["pass_iff_k_lte"] == 4, "Monte Carlo boundary")
    require("DIAGNOSTIC_ONLY" in data["preserved_contract"]["P2"], "P2 diagnostic")
    require(data["failure_rules"]["retry"] is False, "no retry")

    anchors = [
        "decreasing bin index", "numpy.random.PCG64(seed)", "original action a -> pi(a)",
        "first 12", "minimum", "one-based rank 195", "GO FOR INDEPENDENT A3 CONTRACT REVIEW"
    ]
    for anchor in anchors:
        require(anchor.lower() in prose.lower(), f"missing prose anchor: {anchor}")


def validate_package(root: Path) -> None:
    root = Path(root)
    data = load_contract(root / "A3_MACHINE_READABLE_RULES.yaml")
    paths = sorted(root.glob("*.md"))
    prose = "\n".join(path.read_text(encoding="utf-8") for path in paths)
    records = "".join(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n" for path in paths).encode("utf-8")
    require(hashlib.sha256(records).hexdigest() == CANONICAL_PROSE_COMPOSITE_SHA256, "canonical A3 prose composite")
    validate_contract(data, prose)


def main(argv: list[str]) -> int:
    root = Path(argv[1]) if len(argv) > 1 else Path(__file__).resolve().parents[1]
    validate_package(root)
    print("A3 STATIC CONTRACT VALIDATION: PASS")
    print("REGISTERED DATA CAPABILITY: NONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
