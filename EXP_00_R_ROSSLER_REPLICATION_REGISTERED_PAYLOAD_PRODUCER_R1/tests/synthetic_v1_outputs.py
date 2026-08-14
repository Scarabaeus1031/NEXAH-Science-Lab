from __future__ import annotations

import json
from pathlib import Path

import payload_producer as producer
import registered_evidence_generator as generator


WORKSPACE = Path(__file__).resolve().parents[2]


TARGET = producer.FrozenTargetOutput(
    mean=(0.0, 0.0, 0.0),
    population_sd=(2.0, 2.0, 2.0),
    center=(0.5, -0.25, 0.125),
    radius=0.25,
)


def rows() -> tuple[producer.FrozenRowOutput, ...]:
    result = []
    for split, seeds in (("TRAIN_OOF", generator.TRAIN_SEEDS), ("TEST", generator.TEST_SEEDS)):
        for ordinal, seed in enumerate(seeds):
            for decision in range(50):
                base = ordinal * 50 + decision
                result.append(producer.FrozenRowOutput(
                    split=split,
                    physical_seed_id=seed,
                    decision_index=decision,
                    state=(base / 100.0, (base % 17) / 10.0, (base % 11) / 5.0),
                    trajectory_costs=(5.0, 4.0, 3.0, 2.0, 1.0),
                    learned_field_costs=(4.0, 4.0, 3.0, 2.0, 1.0),
                    trajectory_support_distance=0.1 + (base % 10) / 100.0,
                    learned_field_path_support_distances=(0.1, 0.2 + (base % 10) / 100.0, 0.15),
                    action_delta_j=(0.02, -0.02, 0.0, -0.01, 0.03),
                ))
    return tuple(result)


def null_descriptors() -> dict[str, tuple[tuple[object, ...], ...]]:
    result = {}
    for family in generator.NULL_FAMILIES:
        namespaces = []
        for replicate in range(200):
            if family == "N1":
                namespace = (generator.CONFIG_ID, "action_label", replicate, "REP=TRAJECTORY", "SEED=5000")
            elif family == "N2":
                namespace = (generator.CONFIG_ID, "rank_within_seed", replicate, "SPLIT=TEST", "SEED=6000")
            elif family == "N3":
                namespace = (generator.CONFIG_ID, "state_mismatch", replicate, "SPLIT=TEST", "ROW=TEST.6000.0")
            else:
                carrier = "T" if family == "N4_T" else "F"
                namespace = (generator.CONFIG_ID, "support_matched", replicate, "SPLIT=TEST", f"CARRIER={carrier}", "STRATUM=Q0;M000;D0")
            namespaces.append(namespace)
        result[family] = tuple(namespaces)
    return result


def n5_tier(primary_rows: tuple[producer.FrozenRowOutput, ...]) -> producer.FrozenN5TierOutput:
    population = tuple(f"TEST:ROSSLER_PAIR_00:{index:02d}" for index in range(20))
    field_states = {}
    trajectory_witnesses = {}
    action_states = tuple((0.1 * action, 0.2, 0.3) for action in range(5))
    for query in population:
        field_states[query] = action_states
        witnesses = []
        for action in range(5):
            witnesses.append(producer.TrajectoryActionWitnessOutput(
                training_row_ids=("TRAIN_OOF:ROSSLER_PAIR_00:00", "TRAIN_OOF:ROSSLER_PAIR_00:01"),
                weights=(0.5, 0.5),
                terminal_states=((0.1 + action / 100.0, 0.2, 0.3), (0.3, 0.2, 0.1 + action / 100.0)),
            ))
        trajectory_witnesses[query] = tuple(witnesses)
    return producer.FrozenN5TierOutput(
        population_row_ids=population,
        field_terminal_states=field_states,
        trajectory_action_witnesses=trajectory_witnesses,
    )


def source() -> producer.FrozenV1Outputs:
    primary_rows = rows()
    n5 = n5_tier(primary_rows)
    sensitivities = tuple(
        producer.FrozenSensitivityOutput(
            ordinal=ordinal,
            target=TARGET,
            rows=primary_rows,
            trajectory_support_threshold=0.9,
            learned_field_support_threshold=0.9,
        )
        for ordinal in range(12)
    )
    runtime_authority = json.loads((
        WORKSPACE
        / "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1"
        / "REGISTERED_RUNTIME_AUTHORITY.json"
    ).read_text())
    return producer.FrozenV1Outputs(
        target=TARGET,
        primary_rows=primary_rows,
        null_namespace_descriptors=null_descriptors(),
        n5_synth=n5,
        n5_run=n5,
        sensitivities=sensitivities,
        primary_config={"config_id": generator.CONFIG_ID, "frozen": True},
        model_spec={"representations": ["TRAJECTORY", "LEARNED_FIELD"], "frozen": True},
        authority_binding={
            "a5xef_root_sha256": "1" * 64,
            "a5xef_review_tree_sha256": "2" * 64,
            "generator_r2_tree_sha256": "82ff760b17fa99998eedad1d5c7c471f5c7fdfded2e2cb36dace8415a7c8b5d4",
        },
        primary_support_threshold=0.9,
        runtime_authority=runtime_authority,
    )
