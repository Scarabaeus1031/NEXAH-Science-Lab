"""Contract-bound EXP-00-R registered-evidence export generator.

This module implements the closed scientific-to-evidence mapping.  It does not
run registered seeds, grant authorization, evaluate P1-P5, or classify results.
The later production operator must supply already-computed frozen-science
values and an external authorization reference.
"""
from __future__ import annotations

import hashlib
import importlib.metadata
import itertools
import json
import math
import os
import platform
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, Mapping, Sequence

import numpy as np


class ContractViolation(ValueError):
    """Fail-closed contract violation."""


class BoundRow(dict):
    """Serialized row plus nonserialized frozen source-cost bindings."""

    def __init__(self, values: Mapping[str, Any], trajectory_costs: Sequence[Any], learned_field_costs: Sequence[Any]):
        super().__init__(values)
        self.trajectory_costs = tuple(_float_vector(trajectory_costs, 5, "trajectory source costs"))
        self.learned_field_costs = tuple(_float_vector(learned_field_costs, 5, "learned-field source costs"))


RUNTIME_ID = "CODEX_PRIMARY_PY31213_NUMPY235_MACOS2652_ARM64"
HISTORICAL_RUNTIME_ID = "ANACONDA_PY3127_NUMPY1264_OPENBLAS0321_ARM64"
PAYLOAD_SCHEMA = "EXP_00_R_REGISTERED_EVIDENCE_EXPORT_V1"
ENVELOPE_SCHEMA = "A5XEFR_GENERIC_RAW_EVIDENCE_V1"
CONFIG_ID = "EXP00R-ROSSLER-2REP-XCTRL-H1-FROZEN-20260808-v1"
TRAIN_SEEDS = tuple(range(5000, 5030))
TEST_SEEDS = tuple(range(6000, 6030))
SPLITS = ("TRAIN_OOF", "TEST")
ACTIONS = (-0.5, -0.25, 0.0, 0.25, 0.5)
NULL_FAMILIES = ("N1", "N2", "N3", "N4_T", "N4_F")
REPRESENTATIONS = ("TRAJECTORY", "LEARNED_FIELD")
PROVENANCE_SECTIONS = (
    "manifest", "seed_registry", "primary_config", "model_spec",
    "observed_rows", "null_worlds", "bootstrap", "n5", "sensitivities",
    "authority_binding",
)
SENSITIVITY_REGISTRY = (
    (0, "ACTION_AMPLITUDE_0.25", "actions.primary_amplitude", 0.25, True),
    (1, "ACTION_AMPLITUDE_1.0", "actions.primary_amplitude", 1.0, True),
    (2, "TRAJECTORY_NEIGHBORS_15", "representations.trajectory.neighbors", 15, False),
    (3, "TRAJECTORY_NEIGHBORS_50", "representations.trajectory.neighbors", 50, False),
    (4, "LEARNED_FIELD_NEIGHBORS_60", "representations.learned_field.neighbors", 60, False),
    (5, "LEARNED_FIELD_NEIGHBORS_160", "representations.learned_field.neighbors", 160, False),
    (6, "HORIZON_0.5", "plant.evaluation_horizon", 0.5, False),
    (7, "HORIZON_1.5", "plant.evaluation_horizon", 1.5, False),
    (8, "TRAINING_SEED_HALF_5000_5014", "data.train_seeds", "5000-5014", False),
    (9, "TRAINING_SEED_HALF_5015_5029", "data.train_seeds", "5015-5029", False),
    (10, "SUPPORT_QUANTILE_0.95", "support.threshold_quantile", 0.95, False),
    (11, "SUPPORT_QUANTILE_0.995", "support.threshold_quantile", 0.995, False),
)

EXPECTED_RUNTIME_AUTHORITY = {
    "schema": "EXP_00_R_REGISTERED_GENERATION_RUNTIME_AUTHORITY_V1",
    "authority_status": "OBSERVED_BINDING_OF_ALREADY_FROZEN_RUNTIME",
    "runtime_id": RUNTIME_ID,
    "python": {
        "version": "3.12.13",
        "version_full": "3.12.13 (main, Mar  3 2026, 15:35:03) [Clang 21.1.4 ]",
        "invocation_path": "/Users/tho2020/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
        "symlink_target": "python3.12",
        "resolved_executable": "/Users/tho2020/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3.12",
        "executable_bytes": 49968,
        "executable_sha256": "eb9d74b9c7cfdfb2c9b91614edb2c3607360ba46c5aa7fc4557b3a4a23e97cff",
    },
    "numpy": {
        "version": "2.3.5",
        "distribution_location": "/Users/tho2020/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/lib/python3.12/site-packages",
        "module_origin": "/Users/tho2020/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/lib/python3.12/site-packages/numpy/__init__.py",
        "module_bytes": 25919,
        "module_sha256": "93924ac4b793328947dfd9eb9355e54eccdfd26a92c8dd52188aed2e52c7eb38",
        "distribution_member_count": 1310,
        "distribution_member_tree_semantics": "SHA256_OF_SORTED_SHA256_TWO_SPACES_IMPORTLIB_METADATA_RELATIVE_PATH_LF_FOR_EXISTING_REGULAR_DISTRIBUTION_FILES",
        "distribution_member_tree_sha256": "e7b6bdc49c04f759be1bd16020b8b987d5b9f44e9f14ace04a4648287c52b084",
        "core_extension": {
            "path": "numpy/_core/_multiarray_umath.cpython-312-darwin.so",
            "bytes": 3450392,
            "sha256": "96ce8cda1e4f1a3107e5c945b68bcd970c3de09019fc19beda4cc0319609de09",
        },
        "linalg_extension": {
            "path": "numpy/linalg/_umath_linalg.cpython-312-darwin.so",
            "bytes": 154752,
            "sha256": "09cde0db10d0e4d8f25e0e207379cc449e9cd8bda44601e2ef049d5ab41400a2",
        },
    },
    "platform": {
        "platform": "macOS-26.5.2-arm64-arm-64bit",
        "machine": "arm64",
        "numeric_backend_linkage": "/System/Library/Frameworks/Accelerate.framework/Versions/A/Accelerate",
    },
    "historical_reference_runtime_id": HISTORICAL_RUNTIME_ID,
    "historical_reference_runtime_role": "REFERENCE_REPRODUCTION_ONLY_NOT_REGISTERED_GENERATION",
    "registered_seed_accessed_during_binding": False,
    "registered_evidence_accessed_during_binding": False,
}


def signed_permutation_registry() -> list[list[list[int]]]:
    matrices: list[list[list[int]]] = []
    for permutation in itertools.permutations(range(3)):
        for signs in itertools.product((-1, 1), repeat=3):
            q = np.zeros((3, 3), dtype=int)
            for row, column in enumerate(permutation):
                q[row, column] = signs[row]
            if round(float(np.linalg.det(q))) == 1:
                matrices.append(q.tolist())
    return sorted(matrices, key=lambda q: tuple(item for row in q for item in row))[:12]


def _need(condition: bool, message: str) -> None:
    if not condition:
        raise ContractViolation(message)


def _finite_float(value: Any, field: str) -> float:
    _need(type(value) in (float, int) and type(value) is not bool, f"{field}: numeric required")
    result = float(value)
    _need(math.isfinite(result), f"{field}: finite binary64 required")
    return result


def _float_vector(value: Sequence[Any], length: int, field: str) -> list[float]:
    _need(isinstance(value, (list, tuple, np.ndarray)) and len(value) == length, f"{field}: length {length}")
    return [_finite_float(item, f"{field}[{index}]") for index, item in enumerate(value)]


def canonical_json_bytes(value: Any, *, newline: bool = True) -> bytes:
    """Frozen compact UTF-8 JSON encoding; nonfinite values fail closed."""
    encoded = json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=False,
        allow_nan=False,
    ).encode("utf-8")
    return encoded + (b"\n" if newline else b"")


def canonical_digest(value: Any) -> str:
    return hashlib.sha256(canonical_json_bytes(value, newline=False)).hexdigest()


def pair_id(ordinal: int) -> str:
    _need(type(ordinal) is int and 0 <= ordinal < 30, "pair ordinal")
    return f"ROSSLER_PAIR_{ordinal:02d}"


def build_seed_registry() -> list[dict[str, Any]]:
    """Encoding metadata plus the two authoritative physical identities."""
    return [
        {
            "ordinal": i,
            "pair_id": pair_id(i),
            "train_physical_seed_id": TRAIN_SEEDS[i],
            "test_physical_seed_id": TEST_SEEDS[i],
        }
        for i in range(30)
    ]


def validate_seed_registry(registry: Sequence[Mapping[str, Any]]) -> None:
    _need(len(registry) == 30, "seed registry count")
    for i, record in enumerate(registry):
        _need(record == build_seed_registry()[i], f"seed registry ordinal {i}")
    train = [int(record["train_physical_seed_id"]) for record in registry]
    test = [int(record["test_physical_seed_id"]) for record in registry]
    _need(train == list(TRAIN_SEEDS), "train physical seed permutation/rematch")
    _need(test == list(TEST_SEEDS), "test physical seed permutation/rematch")
    _need(set(train).isdisjoint(test), "train/test seed leakage")


def rng_identity(split: str, physical_seed_id: int, *components: Any) -> tuple[Any, ...]:
    """Only physical unsigned seed IDs may enter an RNG namespace."""
    _need(split in SPLITS, "RNG split")
    expected = TRAIN_SEEDS if split == "TRAIN_OOF" else TEST_SEEDS
    _need(type(physical_seed_id) is int and physical_seed_id in expected, "RNG physical seed identity")
    for component in components:
        _need(not (isinstance(component, str) and "ROSSLER_PAIR_" in component), "pair ID in RNG namespace")
    return (split, physical_seed_id, *components)


@dataclass(frozen=True)
class TargetDefinition:
    mean: tuple[float, float, float]
    population_sd: tuple[float, float, float]
    center: tuple[float, float, float]
    radius: float

    def __post_init__(self) -> None:
        _float_vector(self.mean, 3, "target.mean")
        scale = _float_vector(self.population_sd, 3, "target.population_sd")
        _need(all(value > 0 for value in scale), "target population_sd positive")
        _float_vector(self.center, 3, "target.center")
        _need(_finite_float(self.radius, "target.radius") >= 0, "target radius nonnegative")


def state_signal(state: Sequence[Any], target: TargetDefinition) -> float:
    """REE-G4-D1: exact frozen TargetRegion.distance."""
    x = np.asarray(_float_vector(state, 3, "state"), dtype=np.float64)
    mean = np.asarray(target.mean, dtype=np.float64)
    scale = np.asarray(target.population_sd, dtype=np.float64)
    center = np.asarray(target.center, dtype=np.float64)
    return float(max(0.0, float(np.linalg.norm((x - mean) / scale - center)) - float(target.radius)))


def exported_scores(costs: Sequence[Any]) -> list[float]:
    """Accepted G2 mapping: exact unary negation, no remapping."""
    return [float(-np.float64(value)) for value in _float_vector(costs, 5, "costs")]


def validate_score_export(costs: Sequence[Any], scores: Sequence[Any]) -> None:
    _need(_float_vector(scores, 5, "scores") == exported_scores(costs), "wrong score direction/remapping")


def weak_ranks(scores: Sequence[Any]) -> list[float]:
    """Descending preference, exact binary64 ties, average one-based ranks."""
    values = _float_vector(scores, 5, "scores")
    result = [0.0] * 5
    for value in sorted(set(values), reverse=True):
        members = [i for i, item in enumerate(values) if item == value]
        better = sum(item > value for item in values)
        rank = (better + 1 + better + len(members)) / 2.0
        for index in members:
            result[index] = float(rank)
    return result


def validate_rank_encoding(scores: Sequence[Any], ranks: Sequence[Any]) -> None:
    _need(_float_vector(ranks, 5, "ranks") == weak_ranks(scores), "incorrect exact-tie weak-rank encoding")


def carrier_action(scores: Sequence[Any], actions: Sequence[Any], amplitude: float) -> float:
    values = _float_vector(scores, 5, "scores")
    action_values = _float_vector(actions, 5, "actions")
    maximum = max(values)
    tied = {action_values[i] for i, value in enumerate(values) if value == maximum}
    preference = (0.0, -amplitude / 2.0, amplitude / 2.0, -amplitude, amplitude)
    for action in preference:
        if float(action) in tied:
            return float(action)
    raise ContractViolation("carrier tie preference is not representable by action set")


def action_outcomes(delta_j: Sequence[Any]) -> tuple[list[float], list[int]]:
    deltas = _float_vector(delta_j, 5, "action_delta_j")
    _need(deltas[2] == 0.0 and math.copysign(1.0, deltas[2]) == 1.0, "zero action delta must be +0.0")
    success = [int(value <= -0.01) for value in deltas]
    _need(success[2] == 0, "zero action success")
    return deltas, success


def validate_success_export(delta_j: Sequence[Any], success: Sequence[Any]) -> None:
    _, expected = action_outcomes(delta_j)
    _need(list(success) == expected, "incorrect per-action success export")


def build_row(
    *, split: str, pair_ordinal: int, physical_seed_id: int, decision_index: int,
    state: Sequence[Any], target: TargetDefinition, trajectory_costs: Sequence[Any],
    learned_field_costs: Sequence[Any], t_support_distance: Any,
    f_support_distance: Any, delta_j: Sequence[Any], actions: Sequence[Any] = ACTIONS,
) -> dict[str, Any]:
    _need(split in SPLITS, "row split")
    expected_seed = (TRAIN_SEEDS if split == "TRAIN_OOF" else TEST_SEEDS)[pair_ordinal]
    _need(type(physical_seed_id) is int and physical_seed_id == expected_seed, "wrong physical seed identity")
    _need(type(decision_index) is int and 0 <= decision_index < 50, "decision index")
    action_values = _float_vector(actions, 5, "actions")
    pid = pair_id(pair_ordinal)
    deltas, success = action_outcomes(delta_j)
    row = {
        "row_id": f"{split}:{pid}:{decision_index:02d}",
        "split": split,
        "seed_id": pid,
        "pair_id": pid,
        "physical_seed_id": physical_seed_id,
        "decision_index": decision_index,
        "state_id": f"STATE:{split}:{pid}:{decision_index:02d}",
        "scientific_row_key": f"{split}.{physical_seed_id}.{decision_index}",
        "state": _float_vector(state, 3, "state"),
        "state_signal": state_signal(state, target),
        "T_scores": exported_scores(trajectory_costs),
        "F_scores": exported_scores(learned_field_costs),
        "T_support_distance": _finite_float(t_support_distance, "T_support_distance"),
        "F_support_distance": _finite_float(f_support_distance, "F_support_distance"),
        "action_delta_j": deltas,
        "action_success": success,
    }
    _need(action_values[2] == 0.0, "zero action position")
    return BoundRow(row, trajectory_costs, learned_field_costs)


def validate_row(row: Mapping[str, Any], target: TargetDefinition, actions: Sequence[Any] = ACTIONS) -> None:
    _need(isinstance(row, BoundRow), "row missing nonserialized frozen source-cost binding")
    split = row.get("split")
    _need(split in SPLITS, "row split")
    physical = row.get("physical_seed_id")
    _need(type(physical) is int, "row physical seed type")
    expected_seeds = TRAIN_SEEDS if split == "TRAIN_OOF" else TEST_SEEDS
    ordinal = physical - expected_seeds[0]
    _need(0 <= ordinal < 30 and expected_seeds[ordinal] == physical, "row physical seed range")
    pid = pair_id(ordinal)
    _need(row.get("pair_id") == pid and row.get("seed_id") == pid, "pair metadata mapping")
    index = row.get("decision_index")
    _need(type(index) is int and 0 <= index < 50, "row decision index")
    _need(row.get("row_id") == f"{split}:{pid}:{index:02d}", "encoded row ID")
    _need(row.get("state_id") == f"STATE:{split}:{pid}:{index:02d}", "encoded state ID")
    _need(row.get("scientific_row_key") == f"{split}.{physical}.{index}", "scientific row key")
    expected_signal = state_signal(row.get("state"), target)
    _need(_finite_float(row.get("state_signal"), "state_signal") == expected_signal, "incorrect state_signal mapping")
    for key in ("T_scores", "F_scores"):
        _float_vector(row.get(key), 5, key)
    validate_score_export(row.trajectory_costs, row.get("T_scores"))
    validate_score_export(row.learned_field_costs, row.get("F_scores"))
    _need(_finite_float(row.get("T_support_distance"), "T support") >= 0, "T support distance")
    _need(_finite_float(row.get("F_support_distance"), "F support") >= 0, "F support distance")
    deltas, success = action_outcomes(row.get("action_delta_j"))
    _need(list(row.get("action_success", [])) == success, "incorrect success export")
    _float_vector(actions, 5, "actions")


def support_flags(row: Mapping[str, Any], thresholds: Mapping[str, Any]) -> tuple[bool, bool, bool]:
    _need(set(thresholds) == {"T", "F"}, "support threshold keys")
    t_threshold = _finite_float(thresholds["T"], "T threshold")
    f_threshold = _finite_float(thresholds["F"], "F threshold")
    t = _finite_float(row["T_support_distance"], "T distance") <= t_threshold
    f = _finite_float(row["F_support_distance"], "F distance") <= f_threshold
    return t, f, t and f


def validate_support_export(
    row: Mapping[str, Any], expected_t_distance: Any, expected_f_path_distances: Sequence[Any]
) -> None:
    t = _finite_float(expected_t_distance, "expected T distance")
    path = _float_vector(expected_f_path_distances, len(expected_f_path_distances), "expected F path distances")
    _need(path, "F path distances complete")
    _need(_finite_float(row.get("T_support_distance"), "T support export") == t, "incorrect T support export")
    _need(_finite_float(row.get("F_support_distance"), "F support export") == max(path), "incorrect F support export")


def validate_canonical_bytes(value: Any, encoded: bytes) -> None:
    _need(encoded == canonical_json_bytes(value), "non-canonical serialization")


def expected_physical_row_keys() -> list[tuple[str, int, int]]:
    """Frozen canonical row population used to reconstruct N3/N4 objects."""
    return [
        (split, seed, index)
        for split, seeds in (("TRAIN_OOF", TRAIN_SEEDS), ("TEST", TEST_SEEDS))
        for seed in seeds
        for index in range(50)
    ]


def canonical_namespace_bytes(namespace: Sequence[Any]) -> bytes:
    """Encode an already-validated A3 namespace without normalization."""
    _need(isinstance(namespace, list), "RNG namespace component list")
    _need(all(type(item) in (str, int) and type(item) is not bool for item in namespace), "RNG namespace component type")
    return "|".join(str(item) for item in namespace).encode("utf-8")


def _seed_suffix(component: Any, tag: str, allowed: Sequence[int]) -> int:
    _need(isinstance(component, str), f"{tag}: canonical tagged seed")
    match = re.fullmatch(rf"{tag}=([0-9]+)", component)
    _need(match is not None, f"{tag}: canonical tagged seed")
    text = match.group(1)
    _need(text == "0" or not text.startswith("0"), f"{tag}: canonical unsigned decimal")
    seed = int(text)
    _need(seed in set(allowed), f"{tag}: physical RNG seed identity")
    return seed


def _namespace_prefix(namespace: Any, family: str, replicate: int, length: int, token: str) -> list[Any]:
    _need(isinstance(namespace, list) and len(namespace) == length, f"{family}: canonical RNG namespace length")
    _need(namespace[0] == CONFIG_ID, f"{family}: config identity")
    _need(namespace[1] == token, f"{family}: family token")
    _need(type(namespace[2]) is int and namespace[2] == replicate, f"{family}: canonical replicate identity")
    _need(not any(isinstance(item, str) and "ROSSLER_PAIR_" in item for item in namespace), f"{family}: pair RNG identity")
    return namespace


def _validate_null_namespace(family: str, replicate: int, namespace: Any) -> None:
    if family == "N1":
        values = _namespace_prefix(namespace, family, replicate, 5, "action_label")
        _need(values[3] in ("REP=TRAJECTORY", "REP=LEARNED_FIELD"), "N1: canonical REP")
        _seed_suffix(values[4], "SEED", TRAIN_SEEDS)
        return
    if family == "N2":
        values = _namespace_prefix(namespace, family, replicate, 5, "rank_within_seed")
        _need(values[3] in ("SPLIT=TRAIN_OOF", "SPLIT=TEST"), "N2: canonical SPLIT")
        split = values[3][len("SPLIT="):]
        _seed_suffix(values[4], "SEED", TRAIN_SEEDS if split == "TRAIN_OOF" else TEST_SEEDS)
        return
    if family == "N3":
        values = _namespace_prefix(namespace, family, replicate, 5, "state_mismatch")
        _need(values[3] in ("SPLIT=TRAIN_OOF", "SPLIT=TEST"), "N3: canonical SPLIT")
        split = values[3][len("SPLIT="):]
        _need(isinstance(values[4], str), "N3: canonical ROW")
        match = re.fullmatch(r"ROW=(TRAIN_OOF|TEST)\.([0-9]+)\.([0-9]+)", values[4])
        _need(match is not None, "N3: canonical ROW")
        row_split, seed_text, index_text = match.groups()
        _need(row_split == split, "N3: ROW/SPLIT identity")
        _need((seed_text == "0" or not seed_text.startswith("0")) and (index_text == "0" or not index_text.startswith("0")), "N3: canonical ROW decimal")
        allowed = TRAIN_SEEDS if split == "TRAIN_OOF" else TEST_SEEDS
        _need(int(seed_text) in set(allowed), "N3: physical RNG seed identity")
        _need(0 <= int(index_text) < 50, "N3: canonical ROW decision index")
        return
    if family in ("N4_T", "N4_F"):
        values = _namespace_prefix(namespace, family, replicate, 6, "support_matched")
        _need(values[3] in ("SPLIT=TRAIN_OOF", "SPLIT=TEST"), f"{family}: canonical SPLIT")
        expected_carrier = "T" if family == "N4_T" else "F"
        _need(values[4] == f"CARRIER={expected_carrier}", f"{family}: canonical CARRIER")
        _need(isinstance(values[5], str), f"{family}: canonical STRATUM")
        match = re.fullmatch(r"STRATUM=Q([0-4]);M(000|025|050);D([0-9](?:,[0-9])*)", values[5])
        _need(match is not None, f"{family}: canonical STRATUM")
        deciles = [int(value) for value in match.group(3).split(",")]
        _need(deciles == sorted(set(deciles)) and all(0 <= value <= 9 for value in deciles), f"{family}: canonical STRATUM deciles")
        return
    raise ContractViolation("unknown null family")


def validate_null_worlds(
    null_worlds: Mapping[str, Any], physical_row_keys: Sequence[tuple[str, int, int]]
) -> None:
    # N4 has no SEED namespace field.  Its physical-seed authority is the
    # complete canonical row population from which stored strata are rebuilt.
    _need(list(physical_row_keys) == expected_physical_row_keys(), "null physical-seed row population")
    _need(tuple(null_worlds.keys()) == NULL_FAMILIES, "null family order/identity")
    for family in NULL_FAMILIES:
        records = null_worlds[family]
        _need(isinstance(records, list) and len(records) == 200, f"{family}: exactly 200")
        for replicate, record in enumerate(records):
            _need(record.get("family") == family and record.get("replicate_id") == replicate, f"{family}: replicate identity")
            _validate_null_namespace(family, replicate, record.get("rng_namespace"))


def validate_bootstrap(bootstrap: Mapping[str, Any]) -> None:
    _need(bootstrap.get("cluster_unit") == "PHYSICAL_TEST_SEED", "bootstrap cluster unit")
    _need(bootstrap.get("replicate_ids") == list(range(500)), "bootstrap exactly 500")
    seeds = bootstrap.get("physical_seed_ids")
    _need(seeds == list(TEST_SEEDS), "bootstrap physical TEST seed registry")


def _validate_terminal_states(value: Any, field: str) -> None:
    _need(isinstance(value, list) and len(value) == 5, f"{field}: five actions")
    for action_index, state in enumerate(value):
        _float_vector(state, 3, f"{field}[{action_index}]")


def _target_utility(state: Sequence[Any], target: TargetDefinition) -> float:
    distance = state_signal(state, target)
    return float(-(distance * distance))


def _coordinate_registered(transformed: Sequence[Any], original: Sequence[Any], q: np.ndarray) -> bool:
    return _float_vector(transformed, 3, "transformed state") == [float(value) for value in q @ np.asarray(_float_vector(original, 3, "original state"), dtype=np.float64)]


def validate_n5(n5: Mapping[str, Any], target: TargetDefinition) -> None:
    matrices = n5.get("matrix_registry")
    _need(matrices == signed_permutation_registry(), "N5 exact first-12 matrix registry")
    for matrix in matrices:
        q = np.asarray(matrix)
        _need(q.shape == (3, 3) and np.array_equal(q, q.astype(int)), "N5 signed permutation shape")
        _need(round(float(np.linalg.det(q))) == 1 and np.array_equal(q.T @ q, np.eye(3)), "N5 determinant/orthogonality")
    for tier in ("SYNTH", "RUN"):
        record = n5.get(tier)
        _need(isinstance(record, dict), f"N5 {tier}")
        population = record.get("population_row_ids")
        _need(isinstance(population, list) and len(population) >= 20 and len(population) == len(set(population)), f"N5 {tier} population")
        _need(record.get("population_sha256") == canonical_digest(population), f"N5 {tier} population digest")
        transforms = record.get("transforms")
        _need(isinstance(transforms, list) and len(transforms) == 12, f"N5 {tier} transforms")
        for transform_id, transform in enumerate(transforms):
            _need(transform.get("transform_id") == transform_id and transform.get("Q") == matrices[transform_id], f"N5 {tier} transform identity")
            q = np.asarray(transform["Q"], dtype=np.float64)
            _need(transform.get("refits") == list(REPRESENTATIONS), f"N5 {tier} refits")
            comparisons = transform.get("comparisons")
            _need(isinstance(comparisons, list) and len(comparisons) == len(population) * 2, f"N5 {tier} comparisons")
            identities = set()
            for comparison in comparisons:
                query = comparison.get("query_id")
                rep = comparison.get("representation")
                _need(query in population and rep in REPRESENTATIONS, f"N5 {tier} comparison identity")
                _need((query, rep) not in identities, f"N5 {tier} duplicate comparison")
                identities.add((query, rep))
                _float_vector(comparison.get("original_scores"), 5, "N5 original scores")
                _float_vector(comparison.get("transformed_scores"), 5, "N5 transformed scores")
                if rep == "LEARNED_FIELD":
                    original_states = comparison.get("original_terminal_states")
                    transformed_states = comparison.get("transformed_terminal_states")
                    _validate_terminal_states(original_states, "N5 field original terminals")
                    _validate_terminal_states(transformed_states, "N5 field transformed terminals")
                    _need(all(_coordinate_registered(transformed, original, q) for original, transformed in zip(original_states, transformed_states)), "N5 field Q transform/inverse registration")
                    _need(_float_vector(comparison.get("original_scores"), 5, "N5 original scores") == [_target_utility(state, target) for state in original_states], "N5 field original witness-derived scores")
                    inverse_states = [[float(value) for value in q.T @ np.asarray(state, dtype=np.float64)] for state in transformed_states]
                    _need(_float_vector(comparison.get("transformed_scores"), 5, "N5 transformed scores") == [_target_utility(state, target) for state in inverse_states], "N5 field transformed witness-derived scores")
                else:
                    original_witnesses = comparison.get("original_action_witnesses")
                    transformed_witnesses = comparison.get("transformed_action_witnesses")
                    for key, witnesses in (("original_action_witnesses", original_witnesses), ("transformed_action_witnesses", transformed_witnesses)):
                        _need(isinstance(witnesses, list) and len(witnesses) == 5, f"N5 trajectory {key}")
                        for witness in witnesses:
                            ids = witness.get("training_row_ids")
                            weights = witness.get("weights")
                            states = witness.get("terminal_states")
                            _need(isinstance(ids, list) and ids and len(ids) == len(weights) == len(states), "N5 trajectory witness lengths")
                            _need(all(isinstance(item, str) for item in ids), "N5 trajectory row IDs")
                            weights = _float_vector(weights, len(weights), "N5 trajectory weights")
                            _need(sum(weights) == 1.0, "N5 trajectory exact normalized weights")
                            for state in states:
                                _float_vector(state, 3, "N5 trajectory terminal")
                    original_scores, transformed_scores = [], []
                    for original, transformed in zip(original_witnesses, transformed_witnesses):
                        _need(transformed["training_row_ids"] == original["training_row_ids"], "N5 trajectory row identity under Q")
                        _need(transformed["weights"] == original["weights"], "N5 trajectory weights under Q")
                        _need(all(_coordinate_registered(t_state, o_state, q) for o_state, t_state in zip(original["terminal_states"], transformed["terminal_states"])), "N5 trajectory Q transform/inverse registration")
                        original_scores.append(float(sum(weight * _target_utility(state, target) for weight, state in zip(original["weights"], original["terminal_states"]))))
                        inverse_states = [[float(value) for value in q.T @ np.asarray(state, dtype=np.float64)] for state in transformed["terminal_states"]]
                        transformed_scores.append(float(sum(weight * _target_utility(state, target) for weight, state in zip(transformed["weights"], inverse_states))))
                    _need(_float_vector(comparison.get("original_scores"), 5, "N5 original scores") == original_scores, "N5 trajectory original witness-derived scores")
                    _need(_float_vector(comparison.get("transformed_scores"), 5, "N5 transformed scores") == transformed_scores, "N5 trajectory transformed witness-derived scores")


def validate_sensitivities(sensitivities: Sequence[Mapping[str, Any]]) -> None:
    _need(isinstance(sensitivities, list) and len(sensitivities) == 12, "sensitivity count")
    for expected, record in zip(SENSITIVITY_REGISTRY, sensitivities):
        ordinal, sid, path, value, p5 = expected
        _need(record.get("ordinal") == ordinal and record.get("sensitivity_id") == sid, f"sensitivity {ordinal} identity")
        _need(record.get("changed_factor_path") == path and record.get("sensitivity_value") == value, f"sensitivity {ordinal} factor")
        _need(record.get("p5") is p5, f"sensitivity {ordinal} P5 role")
        train_seeds = record.get("variant_train_seed_ids")
        expected_train = list(TRAIN_SEEDS[:15]) if ordinal == 8 else list(TRAIN_SEEDS[15:]) if ordinal == 9 else list(TRAIN_SEEDS)
        _need(train_seeds == expected_train, f"sensitivity {ordinal} training population")
        actions = _float_vector(record.get("variant_actions"), 5, f"sensitivity {ordinal} actions")
        amplitude = float(value) if ordinal in (0, 1) else 0.5
        _need(actions == [-amplitude, -amplitude / 2, 0.0, amplitude / 2, amplitude], f"sensitivity {ordinal} action set")
        thresholds = record.get("variant_support_thresholds")
        _need(isinstance(thresholds, dict) and set(thresholds) == {"T", "F"}, f"sensitivity {ordinal} support thresholds")
        _need(all(_finite_float(thresholds[key], f"sensitivity {ordinal} {key} threshold") >= 0 for key in ("T", "F")), f"sensitivity {ordinal} support thresholds finite")
        target_record = record.get("target_definition")
        _need(isinstance(target_record, dict), f"sensitivity {ordinal} target definition")
        target = TargetDefinition(
            mean=tuple(target_record.get("mean", ())),
            population_sd=tuple(target_record.get("population_sd", ())),
            center=tuple(target_record.get("center", ())),
            radius=target_record.get("radius"),
        )
        rows = record.get("variant_rows")
        _need(isinstance(rows, list) and len(rows) == 3000, f"sensitivity {ordinal} full row universe")
        expected_order = [(split, seed, index) for split, seeds in (("TRAIN_OOF", TRAIN_SEEDS), ("TEST", TEST_SEEDS)) for seed in seeds for index in range(50)]
        actual_order = [(row.get("split"), row.get("physical_seed_id"), row.get("decision_index")) for row in rows]
        _need(actual_order == expected_order, f"sensitivity {ordinal} physical-seed row ordering")
        for row in rows:
            validate_row(row, target, actions)


def validate_runtime(authority: Mapping[str, Any], *, verify_distribution_tree: bool = False) -> None:
    """Verify G9-R1 before a future production operation resolves seeds."""
    _need(authority == EXPECTED_RUNTIME_AUTHORITY, "sealed registered runtime authority fields")
    _need(platform.platform() == EXPECTED_RUNTIME_AUTHORITY["platform"]["platform"], "registered platform identity")
    _need(platform.machine() == "arm64" and platform.system() == "Darwin", "registered platform")
    _need(platform.python_version() == "3.12.13", "registered Python version")
    _need(np.__version__ == "2.3.5", "registered NumPy version")
    executable = Path(sys.executable).resolve()
    expected_python = authority["python"]
    _need(executable == Path(expected_python["resolved_executable"]), "Python executable path")
    _need(hashlib.sha256(executable.read_bytes()).hexdigest() == expected_python["executable_sha256"], "Python executable hash")
    _need(executable.stat().st_size == expected_python["executable_bytes"], "Python executable bytes")
    module_path = Path(np.__file__).resolve()
    _need(str(module_path) == authority["numpy"]["module_origin"], "NumPy module origin")
    _need(module_path.stat().st_size == authority["numpy"]["module_bytes"], "NumPy module bytes")
    _need(hashlib.sha256(module_path.read_bytes()).hexdigest() == authority["numpy"]["module_sha256"], "NumPy module hash")
    distribution_root = Path(authority["numpy"]["distribution_location"])
    for key in ("core_extension", "linalg_extension"):
        record = authority["numpy"][key]
        artifact = distribution_root / record["path"]
        _need(artifact.is_file() and artifact.stat().st_size == record["bytes"], f"{key} bytes")
        _need(hashlib.sha256(artifact.read_bytes()).hexdigest() == record["sha256"], f"{key} hash")
    config = getattr(np.__config__, "CONFIG", {})
    blas_name = config.get("Build Dependencies", {}).get("blas", {}).get("name")
    lapack_name = config.get("Build Dependencies", {}).get("lapack", {}).get("name")
    _need(blas_name == "accelerate" and lapack_name == "accelerate", "Accelerate linkage")
    _need(np.dtype(np.float64).itemsize == 8 and np.finfo(np.float64).nmant == 52, "IEEE-754 binary64")
    if verify_distribution_tree:
        distribution = importlib.metadata.distribution("numpy")
        members = []
        for item in distribution.files or ():
            path = Path(distribution.locate_file(item))
            if path.is_file() and not path.is_symlink():
                members.append((item.as_posix(), hashlib.sha256(path.read_bytes()).hexdigest()))
        lines = [f"{digest}  {relative}\n" for relative, digest in sorted(members)]
        tree = hashlib.sha256("".join(lines).encode()).hexdigest()
        _need(len(members) == authority["numpy"]["distribution_member_count"], "NumPy distribution member count")
        _need(tree == authority["numpy"]["distribution_member_tree_sha256"], "NumPy distribution tree")


def validate_payload(payload: Mapping[str, Any], target: TargetDefinition) -> None:
    required = (
        "schema", "manifest", "seed_registry", "primary_config", "model_spec",
        "observed_rows", "null_worlds", "bootstrap", "n5", "sensitivities",
        "authority_binding", "provenance",
    )
    _need(tuple(payload.keys()) == required, "payload section order/identity")
    _need(payload["schema"] == PAYLOAD_SCHEMA, "payload schema")
    validate_seed_registry(payload["seed_registry"])
    manifest = payload["manifest"]
    _need(manifest.get("seed_ids") == [pair_id(i) for i in range(30)], "manifest pair metadata")
    _need(manifest.get("train_physical_seed_ids") == list(TRAIN_SEEDS), "manifest TRAIN physical seeds")
    _need(manifest.get("test_physical_seed_ids") == list(TEST_SEEDS), "manifest TEST physical seeds")
    _need(manifest.get("actions") == list(ACTIONS), "primary actions")
    _need(manifest.get("registered") is True, "registered manifest type")
    rows = payload["observed_rows"]
    _need(isinstance(rows, list) and len(rows) == 3000, "primary 3000-row universe")
    expected_order = expected_physical_row_keys()
    actual_order = [(row.get("split"), row.get("physical_seed_id"), row.get("decision_index")) for row in rows]
    _need(actual_order == expected_order, "primary physical-seed row ordering")
    for row in rows:
        validate_row(row, target)
    validate_null_worlds(payload["null_worlds"], actual_order)
    validate_bootstrap(payload["bootstrap"])
    validate_n5(payload["n5"], target)
    validate_sensitivities(payload["sensitivities"])
    provenance = payload["provenance"]
    _need(isinstance(provenance, list) and len(provenance) == len(PROVENANCE_SECTIONS), "provenance section count")
    for section, record in zip(PROVENANCE_SECTIONS, provenance):
        _need(record.get("artifact_id") == section.upper(), f"provenance {section} identity")
        _need(record.get("sha256") == canonical_digest(payload[section]), f"provenance {section} digest")


def build_envelope(payload: Mapping[str, Any], authorization_reference: str | None) -> dict[str, Any]:
    """Wrap validated evidence; authorization remains external and explicit.

    This function cannot fabricate authorization.  A future production caller
    must pass a nonempty externally issued reference after all prior gates.
    """
    _need(isinstance(authorization_reference, str) and authorization_reference.strip(), "external generation authorization required")
    identity = {
        "evidence_mode": "REGISTERED",
        "registered": True,
        "registered_data": True,
        "fixture": False,
        "payload_kind": "REGISTERED_SCIENTIFIC_EVIDENCE",
        "payload_origin": "REGISTERED",
        "conformance_only": False,
        "scientific_result_claimed": True,
        "authority": {
            "a5xef_root_sha256": payload["authority_binding"]["a5xef_root_sha256"],
            "a5xef_review_tree_sha256": payload["authority_binding"]["a5xef_review_tree_sha256"],
        },
        "authorization": {"present": True, "reference": authorization_reference},
    }
    return {
        "schema": ENVELOPE_SCHEMA,
        "execution_identity": identity,
        "evidence": dict(payload),
        "provenance": {
            "identity_sha256": canonical_digest(identity),
            "evidence_sha256": canonical_digest(payload),
        },
    }


def atomic_write_new(path: Path, envelope: Mapping[str, Any], expected_sha256: str) -> None:
    """Canonical no-overwrite writer for a later authorized operation only."""
    path = Path(path)
    _need(path.name == "EXP_00_R_V3R3_REGISTERED_RAW_EVIDENCE.json", "frozen output filename")
    _need(not path.exists(), "registered target overwrite prohibited")
    data = canonical_json_bytes(envelope)
    _need(hashlib.sha256(data).hexdigest() == expected_sha256, "predeclared output digest mismatch")
    temporary = path.with_name(f".{path.name}.tmp.{os.getpid()}")
    _need(not temporary.exists(), "staging path exists")
    try:
        with temporary.open("xb") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        _need(hashlib.sha256(temporary.read_bytes()).hexdigest() == expected_sha256, "staged byte hash mismatch")
        os.replace(temporary, path)
    except Exception:
        if temporary.exists():
            temporary.unlink()
        raise


def fixture_payload(
    *, rows: list[dict[str, Any]], target: TargetDefinition,
    null_worlds: Mapping[str, Any], bootstrap: Mapping[str, Any],
    n5: Mapping[str, Any], sensitivities: list[dict[str, Any]],
    authority_binding: Mapping[str, Any], primary_config: Mapping[str, Any],
    model_spec: Mapping[str, Any], support_threshold: float,
) -> dict[str, Any]:
    """Assemble a production-shaped payload from supplied scientific values."""
    payload: dict[str, Any] = {
        "schema": PAYLOAD_SCHEMA,
        "manifest": {
            "experiment_id": "EXP-00-R",
            "namespace": "EXP_00_R_REGISTERED",
            "seed_ids": [pair_id(i) for i in range(30)],
            "train_physical_seed_ids": list(TRAIN_SEEDS),
            "test_physical_seed_ids": list(TEST_SEEDS),
            "splits": list(SPLITS),
            "rows_per_seed_per_split": 50,
            "actions": list(ACTIONS),
            "support_thresholds": {"T": float(support_threshold), "F": float(support_threshold)},
            "config_id": CONFIG_ID,
            "registered": True,
            "runtime_id": RUNTIME_ID,
        },
        "seed_registry": build_seed_registry(),
        "primary_config": dict(primary_config),
        "model_spec": dict(model_spec),
        "observed_rows": rows,
        "null_worlds": dict(null_worlds),
        "bootstrap": dict(bootstrap),
        "n5": dict(n5),
        "sensitivities": sensitivities,
        "authority_binding": dict(authority_binding),
        "provenance": [],
    }
    payload["provenance"] = [
        {"artifact_id": section.upper(), "sha256": canonical_digest(payload[section]), "parents": [] if section in ("manifest", "authority_binding") else ["MANIFEST", "AUTHORITY_BINDING"]}
        for section in PROVENANCE_SECTIONS
    ]
    validate_payload(payload, target)
    return payload


def generate_registered_bytes(
    *, payload: Mapping[str, Any], target: TargetDefinition,
    runtime_authority: Mapping[str, Any], authorization_reference: str,
    verify_distribution_tree: bool = True,
) -> tuple[dict[str, Any], bytes, str]:
    """Future production entry point; pure until its caller writes the bytes.

    The frozen Rössler engine supplies the fully computed raw scientific
    sections.  This bridge verifies G9, validates every export mapping and
    evidence population, wraps the A5XEFR identity, and returns canonical
    bytes.  It neither resolves seeds nor writes a file.
    """
    validate_runtime(runtime_authority, verify_distribution_tree=verify_distribution_tree)
    validate_payload(payload, target)
    envelope = build_envelope(payload, authorization_reference)
    encoded = canonical_json_bytes(envelope)
    return envelope, encoded, hashlib.sha256(encoded).hexdigest()
