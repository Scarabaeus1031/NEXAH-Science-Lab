"""Review-owned reconstruction of decision rules; no EXP-00-R science imports."""
from __future__ import annotations

from fractions import Fraction
import math

CARRIERS = ("T", "F")
FAMILIES = ("N1", "N2", "N3", "N4_T", "N4_F")


def monte_carlo(observed: float, values: list[float]) -> bool:
    if len(values) != 200 or not all(math.isfinite(x) for x in values):
        raise ValueError("invalid null distribution")
    return sum(x >= observed for x in values) <= 4


def dominance(carrier_rows: list[dict]) -> dict:
    """Accepted A2/A5 exact row-loss decomposition."""
    if len({row["seed_id"] for row in carrier_rows}) < 3:
        return {"valid": False, "pass": False, "reason": "FEWER_THAN_THREE_SEEDS"}
    if not carrier_rows:
        return {"valid": False, "pass": False, "reason": "NO_ROWS"}
    total_rows = sum(len(row["loss0"]) for row in carrier_rows)
    if total_rows == 0:
        return {"valid": False, "pass": False, "reason": "NO_ROWS"}
    contributions = []
    for row in carrier_rows:
        if len(row["loss0"]) != len(row["loss1"]):
            return {"valid": False, "pass": False, "reason": "LOSS_LENGTH"}
        gain = sum(
            (Fraction.from_float(float(a)) - Fraction.from_float(float(b))
             for a, b in zip(row["loss0"], row["loss1"])),
            Fraction(),
        ) / total_rows
        contributions.append((row["seed_id"], gain))
    aggregate = sum((gain for _, gain in contributions), Fraction())
    if aggregate <= 0:
        return {"valid": True, "pass": False, "reason": "NONPOSITIVE_G"}
    top = sorted(contributions, key=lambda item: (-item[1], item[0]))[:3]
    d3 = sum((gain for _, gain in top), Fraction())
    return {
        "valid": True,
        "pass": 2 * d3 <= aggregate,
        "reason": "PASS" if 2 * d3 <= aggregate else "DOMINATED",
        "G": aggregate,
        "D3": d3,
    }


def classify(valid: bool, propositions: dict, cores: dict, resolved_negative: dict) -> str:
    if any(cores[c] and resolved_negative[c] for c in CARRIERS):
        valid = False
    if not valid:
        return "INVALID EXPERIMENT"
    if all(propositions[f"P{i}"] for i in range(1, 6)) and all(cores.values()) and not any(resolved_negative.values()):
        return "REPLICATED"
    if any(cores.values()) and not any(resolved_negative.values()):
        return "PARTIALLY REPLICATED"
    return "NOT REPLICATED"


def cross_system(valid: bool, p: dict, rossler: str) -> str:
    if not valid or rossler == "INVALID EXPERIMENT":
        return "INCONCLUSIVE"
    if all(p[f"P{i}"] for i in (1, 2, 3)) and rossler in {"REPLICATED", "PARTIALLY REPLICATED"}:
        return "PARTIAL CROSS-SYSTEM REPLICATION"
    return "NON-REPLICATION"


def missing_raw_derivations(bundle: dict) -> list[str]:
    """Requirements from accepted A2–A5 that the A5XR fixture must expose."""
    missing = []
    support = bundle.get("support", {})
    blocks = support.get("seed_blocks", [])
    if not blocks or any(not {"T_supported_rows", "F_supported_rows", "canonical_row_ids"} <= set(block) for block in blocks):
        missing.append("SUPPORT_T_F_RAW_MEMBERSHIP")
    observed = bundle.get("observed", {}).get("carriers", {})
    for carrier in CARRIERS:
        bootstrap = observed.get(carrier, {}).get("bootstrap_coefficients")
        if not isinstance(bootstrap, list) or len(bootstrap) != 500 or any(
            not {"replicate_id", "drawn_seed_ids", "coefficient"} <= set(row) for row in bootstrap
        ):
            missing.append(f"BOOTSTRAP_RAW_SEED_CLUSTER_{carrier}")
    for family in FAMILIES:
        artifact = bundle.get("nulls", {}).get(family, {})
        reps = artifact.get("replicates")
        if not isinstance(reps, list) or len(reps) != 200:
            missing.append(f"{family}_RAW_REPLICATES")
        required = {"mean_coherence", "top_action_agreement", "T_coefficient", "F_coefficient", "T_gain", "F_gain"}
        if set(artifact.get("statistics", {})) != required:
            missing.append(f"{family}_REQUIRED_STATISTICS")
    for tier in ("SYNTH", "RUN"):
        transforms = bundle.get("n5", {}).get(tier, {}).get("transforms", [])
        if any(not {"matrix", "original_ranks", "transformed_ranks", "query_ids", "representation_ids"} <= set(row) for row in transforms):
            missing.append(f"N5_{tier}_RAW_TRANSFORM_DERIVATION")
    attribution = bundle.get("attribution", {})
    if "mandatory_report_only_results" not in attribution:
        missing.append("P4_REPORT_ONLY_RESULTS")
    if "per_seed_row_inputs" not in attribution:
        missing.append("P4_RAW_PER_SEED_DIRECTIONS")
    if "artifact_ledger" not in bundle:
        missing.append("CANONICAL_PROVENANCE_LEDGER")
    return missing
