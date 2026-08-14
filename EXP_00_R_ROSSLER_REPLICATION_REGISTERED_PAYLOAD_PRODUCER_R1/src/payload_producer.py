"""Minimal frozen-V1-output to Generator-R2 payload adapter.

This module is deliberately data-in/data-out.  It does not resolve or execute
seeds, run the Rössler plant, consume authorization, write registered evidence,
evaluate P1-P5, or classify scientific results.
"""
from __future__ import annotations

import hashlib
from dataclasses import dataclass
from typing import Any, Mapping, Sequence

import numpy as np

import registered_evidence_generator as generator


class ProducerViolation(ValueError):
    """Fail-closed producer-interface violation."""


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise ProducerViolation(message)


@dataclass(frozen=True)
class FrozenTargetOutput:
    mean: tuple[float, float, float]
    population_sd: tuple[float, float, float]
    center: tuple[float, float, float]
    radius: float

    def generator_target(self) -> generator.TargetDefinition:
        return generator.TargetDefinition(
            mean=self.mean,
            population_sd=self.population_sd,
            center=self.center,
            radius=self.radius,
        )

    def record(self) -> dict[str, Any]:
        return {
            "mean": list(self.mean),
            "population_sd": list(self.population_sd),
            "center": list(self.center),
            "radius": self.radius,
        }


@dataclass(frozen=True)
class FrozenRowOutput:
    split: str
    physical_seed_id: int
    decision_index: int
    state: tuple[float, float, float]
    trajectory_costs: tuple[float, float, float, float, float]
    learned_field_costs: tuple[float, float, float, float, float]
    trajectory_support_distance: float
    learned_field_path_support_distances: tuple[float, ...]
    action_delta_j: tuple[float, float, float, float, float]


@dataclass(frozen=True)
class FrozenSensitivityOutput:
    ordinal: int
    target: FrozenTargetOutput
    rows: tuple[FrozenRowOutput, ...]
    trajectory_support_threshold: float
    learned_field_support_threshold: float


@dataclass(frozen=True)
class TrajectoryActionWitnessOutput:
    training_row_ids: tuple[str, ...]
    weights: tuple[float, ...]
    terminal_states: tuple[tuple[float, float, float], ...]


@dataclass(frozen=True)
class FrozenN5TierOutput:
    population_row_ids: tuple[str, ...]
    field_terminal_states: Mapping[str, tuple[tuple[float, float, float], ...]]
    trajectory_action_witnesses: Mapping[str, tuple[TrajectoryActionWitnessOutput, ...]]


@dataclass(frozen=True)
class FrozenV1Outputs:
    target: FrozenTargetOutput
    primary_rows: tuple[FrozenRowOutput, ...]
    null_namespace_descriptors: Mapping[str, tuple[tuple[Any, ...], ...]]
    n5_synth: FrozenN5TierOutput
    n5_run: FrozenN5TierOutput
    sensitivities: tuple[FrozenSensitivityOutput, ...]
    primary_config: Mapping[str, Any]
    model_spec: Mapping[str, Any]
    authority_binding: Mapping[str, Any]
    primary_support_threshold: float
    runtime_authority: Mapping[str, Any]


@dataclass(frozen=True)
class ProducedPayload:
    payload: Mapping[str, Any]
    canonical_bytes: bytes
    sha256: str


def _pair_ordinal(split: str, physical_seed_id: int) -> int:
    _require(split in generator.SPLITS, "row split")
    seeds = generator.TRAIN_SEEDS if split == "TRAIN_OOF" else generator.TEST_SEEDS
    _require(type(physical_seed_id) is int and physical_seed_id in seeds, "physical seed identity")
    return physical_seed_id - seeds[0]


def build_bound_rows(
    rows: Sequence[FrozenRowOutput],
    target: FrozenTargetOutput,
    actions: Sequence[float] = generator.ACTIONS,
) -> list[generator.BoundRow]:
    result: list[generator.BoundRow] = []
    generator_target = target.generator_target()
    for source in rows:
        _require(source.learned_field_path_support_distances, "learned-field support path is empty")
        row = generator.build_row(
            split=source.split,
            pair_ordinal=_pair_ordinal(source.split, source.physical_seed_id),
            physical_seed_id=source.physical_seed_id,
            decision_index=source.decision_index,
            state=source.state,
            target=generator_target,
            trajectory_costs=source.trajectory_costs,
            learned_field_costs=source.learned_field_costs,
            t_support_distance=source.trajectory_support_distance,
            f_support_distance=max(source.learned_field_path_support_distances),
            delta_j=source.action_delta_j,
            actions=actions,
        )
        generator.validate_support_export(
            row,
            source.trajectory_support_distance,
            source.learned_field_path_support_distances,
        )
        result.append(row)
    return result


def build_null_worlds(
    descriptors: Mapping[str, Sequence[Sequence[Any]]],
) -> dict[str, list[dict[str, Any]]]:
    _require(tuple(descriptors.keys()) == generator.NULL_FAMILIES, "null family order/identity")
    worlds: dict[str, list[dict[str, Any]]] = {}
    for family in generator.NULL_FAMILIES:
        namespaces = descriptors[family]
        _require(len(namespaces) == 200, f"{family}: exactly 200 namespace descriptors")
        worlds[family] = [
            {
                "family": family,
                "replicate_id": replicate,
                "rng_namespace": list(namespace),
            }
            for replicate, namespace in enumerate(namespaces)
        ]
    generator.validate_null_worlds(worlds, generator.expected_physical_row_keys())
    return worlds


def build_bootstrap_registry() -> dict[str, Any]:
    bootstrap = {
        "cluster_unit": "PHYSICAL_TEST_SEED",
        "seed": 20260808,
        "replicate_ids": list(range(500)),
        "physical_seed_ids": list(generator.TEST_SEEDS),
    }
    generator.validate_bootstrap(bootstrap)
    return bootstrap


def _target_utility(state: Sequence[float], target: generator.TargetDefinition) -> float:
    distance = generator.state_signal(state, target)
    return float(-(distance * distance))


def _trajectory_witness_record(witness: TrajectoryActionWitnessOutput) -> dict[str, Any]:
    _require(len(witness.training_row_ids) == len(witness.weights) == len(witness.terminal_states) > 0, "N5 trajectory witness lengths")
    return {
        "training_row_ids": list(witness.training_row_ids),
        "weights": list(witness.weights),
        "terminal_states": [list(state) for state in witness.terminal_states],
    }


def _transform_state(state: Sequence[float], q: np.ndarray) -> list[float]:
    return [float(value) for value in q @ np.asarray(state, dtype=np.float64)]


def _build_n5_tier(
    tier_name: str,
    source: FrozenN5TierOutput,
    target: generator.TargetDefinition,
    matrices: list[list[list[int]]],
) -> dict[str, Any]:
    population = list(source.population_row_ids)
    _require(len(population) >= 20 and len(population) == len(set(population)), f"N5 {tier_name} population")
    _require(set(source.field_terminal_states) == set(population), f"N5 {tier_name} field population")
    _require(set(source.trajectory_action_witnesses) == set(population), f"N5 {tier_name} trajectory population")
    transforms = []
    for transform_id, matrix in enumerate(matrices):
        q = np.asarray(matrix, dtype=np.float64)
        comparisons = []
        for query_id in population:
            trajectory_witnesses = source.trajectory_action_witnesses[query_id]
            _require(len(trajectory_witnesses) == 5, f"N5 {tier_name} trajectory actions")
            original_witnesses = [_trajectory_witness_record(witness) for witness in trajectory_witnesses]
            transformed_witnesses = []
            original_trajectory_scores = []
            transformed_trajectory_scores = []
            for witness in original_witnesses:
                transformed_states = [_transform_state(state, q) for state in witness["terminal_states"]]
                transformed_witnesses.append({
                    "training_row_ids": list(witness["training_row_ids"]),
                    "weights": list(witness["weights"]),
                    "terminal_states": transformed_states,
                })
                original_trajectory_scores.append(float(sum(
                    weight * _target_utility(state, target)
                    for weight, state in zip(witness["weights"], witness["terminal_states"])
                )))
                inverse_states = [_transform_state(state, q.T) for state in transformed_states]
                transformed_trajectory_scores.append(float(sum(
                    weight * _target_utility(state, target)
                    for weight, state in zip(witness["weights"], inverse_states)
                )))
            comparisons.append({
                "query_id": query_id,
                "representation": "TRAJECTORY",
                "original_scores": original_trajectory_scores,
                "transformed_scores": transformed_trajectory_scores,
                "original_action_witnesses": original_witnesses,
                "transformed_action_witnesses": transformed_witnesses,
            })

            original_field_states = source.field_terminal_states[query_id]
            _require(len(original_field_states) == 5, f"N5 {tier_name} field actions")
            original_field_states_list = [list(state) for state in original_field_states]
            transformed_field_states = [_transform_state(state, q) for state in original_field_states_list]
            inverse_field_states = [_transform_state(state, q.T) for state in transformed_field_states]
            comparisons.append({
                "query_id": query_id,
                "representation": "LEARNED_FIELD",
                "original_scores": [_target_utility(state, target) for state in original_field_states_list],
                "transformed_scores": [_target_utility(state, target) for state in inverse_field_states],
                "original_terminal_states": original_field_states_list,
                "transformed_terminal_states": transformed_field_states,
            })
        transforms.append({
            "transform_id": transform_id,
            "Q": matrix,
            "refits": list(generator.REPRESENTATIONS),
            "comparisons": comparisons,
        })
    return {
        "tier": f"N5_{tier_name}",
        "population_row_ids": population,
        "population_sha256": generator.canonical_digest(population),
        "transforms": transforms,
    }


def build_n5(
    synth: FrozenN5TierOutput,
    run: FrozenN5TierOutput,
    target: FrozenTargetOutput,
) -> dict[str, Any]:
    matrices = generator.signed_permutation_registry()
    generator_target = target.generator_target()
    result = {
        "matrix_registry": matrices,
        "SYNTH": _build_n5_tier("SYNTH", synth, generator_target, matrices),
        "RUN": _build_n5_tier("RUN", run, generator_target, matrices),
    }
    generator.validate_n5(result, generator_target)
    return result


def build_sensitivities(sources: Sequence[FrozenSensitivityOutput]) -> list[dict[str, Any]]:
    _require(len(sources) == len(generator.SENSITIVITY_REGISTRY), "sensitivity source count")
    records = []
    for expected, source in zip(generator.SENSITIVITY_REGISTRY, sources):
        ordinal, sensitivity_id, changed_path, value, p5 = expected
        _require(source.ordinal == ordinal, f"sensitivity {ordinal} source order")
        amplitude = float(value) if ordinal in (0, 1) else 0.5
        actions = (-amplitude, -amplitude / 2.0, 0.0, amplitude / 2.0, amplitude)
        train_seeds = list(generator.TRAIN_SEEDS[:15]) if ordinal == 8 else list(generator.TRAIN_SEEDS[15:]) if ordinal == 9 else list(generator.TRAIN_SEEDS)
        records.append({
            "ordinal": ordinal,
            "sensitivity_id": sensitivity_id,
            "changed_factor_path": changed_path,
            "sensitivity_value": value,
            "p5": p5,
            "variant_train_seed_ids": train_seeds,
            "variant_actions": list(actions),
            "variant_support_thresholds": {
                "T": source.trajectory_support_threshold,
                "F": source.learned_field_support_threshold,
            },
            "target_definition": source.target.record(),
            "variant_rows": build_bound_rows(source.rows, source.target, actions),
        })
    generator.validate_sensitivities(records)
    return records


def produce_payload(
    source: FrozenV1Outputs,
    *,
    verify_distribution_tree: bool = True,
) -> ProducedPayload:
    """Build and validate a complete payload, then return canonical bytes.

    This function does not create the registered evidence envelope because
    doing so requires a separately issued generation authorization.
    """
    generator.validate_runtime(source.runtime_authority, verify_distribution_tree=verify_distribution_tree)
    target = source.target.generator_target()
    rows = build_bound_rows(source.primary_rows, source.target)
    null_worlds = build_null_worlds(source.null_namespace_descriptors)
    bootstrap = build_bootstrap_registry()
    n5 = build_n5(source.n5_synth, source.n5_run, source.target)
    sensitivities = build_sensitivities(source.sensitivities)
    payload = generator.fixture_payload(
        rows=rows,
        target=target,
        null_worlds=null_worlds,
        bootstrap=bootstrap,
        n5=n5,
        sensitivities=sensitivities,
        authority_binding=source.authority_binding,
        primary_config=source.primary_config,
        model_spec=source.model_spec,
        support_threshold=source.primary_support_threshold,
    )
    generator.validate_payload(payload, target)
    encoded = generator.canonical_json_bytes(payload)
    generator.validate_canonical_bytes(payload, encoded)
    return ProducedPayload(
        payload=payload,
        canonical_bytes=encoded,
        sha256=hashlib.sha256(encoded).hexdigest(),
    )
