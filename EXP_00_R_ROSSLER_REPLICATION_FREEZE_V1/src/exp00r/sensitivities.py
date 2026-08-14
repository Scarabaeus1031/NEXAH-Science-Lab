"""The closed, one-factor-at-a-time sensitivity registry."""
from __future__ import annotations

from copy import deepcopy


def registered_variants(config: dict) -> list[tuple[str, dict]]:
    variants = []
    for amplitude in config["actions"]["sensitivity_amplitudes"]:
        item = deepcopy(config); item["actions"]["primary_amplitude"] = amplitude
        variants.append((f"action_amplitude_{amplitude}", item))
    for value in config["sensitivities"]["trajectory_neighbors"]:
        item = deepcopy(config); item["representations"]["trajectory"]["neighbors"] = value
        variants.append((f"trajectory_neighbors_{value}", item))
    for value in config["sensitivities"]["learned_field_neighbors"]:
        item = deepcopy(config); item["representations"]["learned_field"]["neighbors"] = value
        variants.append((f"field_neighbors_{value}", item))
    for value in config["sensitivities"]["horizons"]:
        item = deepcopy(config); item["plant"]["evaluation_horizon"] = value
        variants.append((f"horizon_{value}", item))
    for value in config["sensitivities"]["support_quantiles"]:
        item = deepcopy(config); item["support"]["threshold_quantile"] = value
        variants.append((f"support_quantile_{value}", item))
    for start, stop in config["sensitivities"]["training_seed_halves"]:
        item = deepcopy(config); item["analysis"]["active_training_seed_sensitivity"] = [start, stop]
        variants.append((f"training_seeds_{start}_{stop}", item))
    return variants


def assert_one_factor_changed(base: dict, variant: dict) -> None:
    def leaves(value, prefix=()):
        if isinstance(value, dict):
            for key, child in value.items():
                yield from leaves(child, prefix + (key,))
        else:
            yield prefix, value
    base_map, variant_map = dict(leaves(base)), dict(leaves(variant))
    changes = [key for key in set(base_map) | set(variant_map) if base_map.get(key) != variant_map.get(key)]
    if len(changes) != 1:
        raise ValueError(f"sensitivity must change exactly one factor, changed={changes}")
