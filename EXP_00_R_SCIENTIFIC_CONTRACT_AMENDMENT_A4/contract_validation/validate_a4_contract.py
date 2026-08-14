#!/usr/bin/env python3
"""Standard-library-only A4 contract validator; no scientific pipeline capability."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

CANONICAL_OBJECT_SHA256 = "a3d6813bc20fd4334f652318478c569687be83681aff78c344e49932ce32e0b3"
REQUIRED_DOCS = [
    "README.md", "EXP_00_R_CONTRACT_AMENDMENT_A4.md", "A4_A3_REVIEW_DEFECT_MATRIX.md",
    "A4_RNG_AND_ORDERING_CONTRACT.md", "A4_BIN_AND_BOUNDARY_CONTRACT.md",
    "A4_N1_N4_NULL_WORLD_CONTRACT.md", "A4_N5_PRESERVATION_CONTRACT.md",
    "A4_P1_P5_CONTRACT.md", "A4_CLASSIFICATION_PRECEDENCE_CONTRACT.md",
    "A4_VALIDITY_GATE_CONTRACT.md", "A4_MACHINE_READABLE_RULES.yaml",
    "A4_PROSE_MACHINE_ISOMORPHISM_LEDGER.md", "A4_DETERMINISTIC_CONTRACT_FIXTURES.md",
    "A4_ADVERSARIAL_MUTATION_REPORT.md", "A4_TWO_IMPLEMENTER_TEST.md",
    "A4_INDEPENDENT_REVIEW_CHECKLIST.md", "A4_GO_NO_GO.md",
]


class ContractError(ValueError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ContractError(message)


def canonical_digest(data: dict) -> str:
    raw = json.dumps(data, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()


def load_contract(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def rossler_label(valid: bool, propositions: tuple[bool, bool, bool, bool, bool],
                  t_positive: bool, f_positive: bool,
                  t_resolved_negative: bool, f_resolved_negative: bool) -> str:
    if (t_positive and t_resolved_negative) or (f_positive and f_resolved_negative):
        raise ContractError("inconsistent carrier state")
    if not valid:
        return "INVALID EXPERIMENT"
    no_negative = not (t_resolved_negative or f_resolved_negative)
    if all(propositions) and t_positive and f_positive and no_negative:
        return "REPLICATED"
    if (t_positive or f_positive) and no_negative:
        return "PARTIALLY REPLICATED"
    return "NOT REPLICATED"


def cross_system_label(valid: bool, propositions: tuple[bool, bool, bool, bool, bool], rossler: str) -> str:
    if not valid:
        return "INCONCLUSIVE"
    if all(propositions[:3]) and rossler in ("REPLICATED", "PARTIALLY REPLICATED"):
        return "PARTIAL CROSS-SYSTEM REPLICATION"
    return "NON-REPLICATION"


def validate_contract(data: dict, check_digest: bool = True) -> None:
    if check_digest:
        require(canonical_digest(data) == CANONICAL_OBJECT_SHA256, "canonical A4 object digest")
    require(data["schema_version"] == "4.0", "schema")
    require(data["authority"]["scope_changes"] is False, "scope")
    require(len(data["authority"]["external_files"]) == 9, "external anchors")
    require(data["ordering"]["sensitivity_axes"] == [
        {"name":"ACTION_AMPLITUDE","values":[0.25,1.0]},
        {"name":"TRAJECTORY_NEIGHBORS","values":[15,50]},
        {"name":"LEARNED_FIELD_NEIGHBORS","values":[60,160]},
        {"name":"HORIZON","values":[0.5,1.5]},
        {"name":"TRAINING_SEED_HALF","values":[[5000,5014],[5015,5029]]},
        {"name":"SUPPORT_QUANTILE","values":[0.95,0.995]},
    ], "sensitivity registry/order")
    require("FOLD_STANDARDIZATION" in data["ordering"]["global_scope"], "global row order")

    rng = data["rng"]
    require(rng["hash"] == "SHA-256" and rng["digest_bytes"] == [0, 8], "rng hash")
    require(rng["byte_order"] == "BIG_ENDIAN" and rng["seed_width_bits"] == 64, "rng seed")
    require("PCG64" in rng["generator"] and rng["preliminary_draws"] == 0 and rng["retry"] is False, "rng generator/consumption")
    require(rng["suffix_fields"] == {"N1":["REP","SEED"],"N2":["SPLIT","SEED"],"N3":["SPLIT","ROW"],"N4":["SPLIT","CARRIER","STRATUM"]}, "rng namespace")
    require(len(rng["known_answers"]) == 4, "rng fixtures")
    for fixture in rng["known_answers"]:
        digest = hashlib.sha256(fixture["payload"].encode()).digest()
        require(digest.hex() == fixture["sha256"], "rng fixture digest")
        require(int.from_bytes(digest[:8], "big") == fixture["seed"], "rng fixture seed")

    phase, quant = data["binning"]["phase"], data["binning"]["quantiles"]
    require(phase["clockwise"] == "DECREASING_INDEX_MODULO_8", "clockwise")
    require(phase["normalize_positive_pi_to_negative_pi"] is True and phase["exact_edge"] == "HIGHER_BIN", "phase boundary")
    require(quant["assignment"] == "RIGHT_INSERTION_ALL_EQUAL_CUTPOINTS" and "EMPTY" in quant["duplicates"], "quantile boundary")
    require(data["binning"]["N4_support_source"]["value"] == "MIN_DISTANCE_TO_OTHER_TRAINING_ROW", "N4 LOO source")
    require(data["binning"]["N4_merge"]["priority"].startswith("SMALLEST_STRICTLY_HIGHER"), "N4 merge")

    require(data["shared_null"]["slots"] == 200, "null repetitions")
    require("NO_RETRY" in data["shared_null"]["invalid_slot"], "invalid null slot")
    require(data["nulls"]["N1"]["map"] == "pi(action[j])=action[p[j]]", "N1 forward map")
    require(data["nulls"]["N2"]["assignment"] == "RECIPIENT_i_GETS_DONOR_p[i]", "N2 assignment")
    require("DIFFERENT_SEED" in data["nulls"]["N3"]["donor_filter"], "N3 donor")
    require(data["nulls"]["N4"]["P3"] == {"T":"N4_T","F":"N4_F"}, "N4 carrier mapping")
    require(data["monte_carlo"]["pass_iff_k_lte"] == 4, "Monte Carlo boundary")

    n5 = data["N5"]
    require(n5["status"] == "PRESERVED_ACCEPTED_A3_CONTRACT", "N5 preservation")
    require(n5["count"] == 12 and len(n5["matrices"]) == 12, "N5 count")
    require(n5["parameters"]["support_quantile"] == 0.99, "N5 support")
    require(n5["ranking"]["aggregation"].startswith("MINIMUM"), "N5 aggregation")
    require("OUTCOMES" in n5["tiers"]["N5_RUN"]["stage_before"], "N5 ordering")

    require(data["bootstrap"]["repetitions"] == 500 and data["bootstrap"]["cluster_unit"] == "TEST_SEED", "bootstrap")
    require(set(data["P"]) == {"P1","P2","P3","P4","P5"}, "P1-P5")
    require(data["P"]["P1"]["pass"] == "k<=4", "P1")
    require(data["P"]["P2"]["clustered_ci_lower"] == ">0", "P2")
    require(data["P"]["P3"]["null_map"] == {"T":["N1","N2","N3","N4_T"],"F":["N1","N2","N3","N4_F"]}, "P3")
    require(data["P"]["P4"]["classification_critical_analyses"] == ["T_PRIMARY_CARRIER","F_PRIMARY_CARRIER"], "P4")
    require(data["P"]["P5"]["classification_critical"]["values"] == [0.25,1.0], "P5")
    require(data["P"]["P5"]["non_rescue"] is True, "sensitivity non-rescue")

    gates = data["validity"]["gates"]
    for gate in ("INFORMATION_PARITY", "REPRESENTATION_DISTINCTNESS", "NO_ANALYTIC_FIELD_LEAKAGE", "N5_RUN_PASS", "BOOTSTRAP_500_FINITE_SEED_CLUSTERED", "NO_POST_ACCESS_SCIENTIFIC_MUTATION"):
        require(gate in gates, f"validity gate {gate}")
    require(len(gates) == 26, "complete validity registry")
    require(data["classification"]["labels"] == ["INVALID EXPERIMENT","REPLICATED","PARTIALLY REPLICATED","NOT REPLICATED"], "labels")
    require(len(data["classification"]["precedence"]) == 4, "classification precedence")
    require(data["classification"]["mutually_exclusive"] and data["classification"]["exhaustive"], "classification totality")
    require(data["cross_system"]["strict_label_reachable"] is False and data["cross_system"]["ceiling"] == "PARTIAL CROSS-SYSTEM REPLICATION", "Lorenz ceiling")
    require(all(value is False for value in data["nonexecution"].values()), "nonexecution")


def validate_external_hashes(root: Path, data: dict) -> None:
    workspace = root.parent
    for item in data["authority"]["external_files"]:
        path = workspace / item["path"]
        require(path.is_file(), f"missing external authority {item['path']}")
        require(hashlib.sha256(path.read_bytes()).hexdigest() == item["sha256"], f"external hash {item['path']}")


def validate_package(root: Path) -> None:
    root = Path(root)
    for name in REQUIRED_DOCS:
        require((root / name).is_file(), f"missing artifact {name}")
    for name in ("validate_a4_contract.py", "test_a4_contract.py", "test_a4_mutations.py", "test_a4_classification_truth_table.py"):
        require((root / "contract_validation" / name).is_file(), f"missing validation file {name}")
    data = load_contract(root / "A4_MACHINE_READABLE_RULES.yaml")
    validate_contract(data)
    validate_external_hashes(root, data)


def main(argv: list[str]) -> int:
    root = Path(argv[1]) if len(argv) > 1 else Path(__file__).resolve().parents[1]
    validate_package(root)
    print("A4 STATIC CONTRACT VALIDATION: PASS")
    print("REGISTERED DATA CAPABILITY: NONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
