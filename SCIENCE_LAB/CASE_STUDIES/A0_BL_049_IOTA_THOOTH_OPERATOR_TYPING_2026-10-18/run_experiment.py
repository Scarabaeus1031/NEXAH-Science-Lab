#!/usr/bin/env python3
"""Exact finite operator-typing audit for A0-BL-049."""
from collections import Counter, defaultdict
import json
import math
import sys


def delta_first(text):
    return text[1:]


def delta_second(text):
    return text[0] + text[2:]


def swap_middle(text):
    return text[0] + text[2] + text[1] + text[3]


def main(path):
    domain = [str(value) for value in range(1000, 10000)]
    fibres_first = defaultdict(list)
    fibres_second = defaultdict(list)
    joint = {}
    residual_first_return = 0
    residual_second_return = 0
    joint_return = 0
    for source in domain:
        first = delta_first(source)
        second = delta_second(source)
        fibres_first[first].append(source)
        fibres_second[second].append(source)
        joint[(second, first)] = source
        residual_first_return += (source[0] + first == source)
        residual_second_return += (second[0] + source[1] + second[1:] == source)
        if second[1:] == first[1:]:
            joint_return += (second[0] + first[0] + second[1:] == source)

    first_hist = Counter(len(values) for values in fibres_first.values())
    second_hist = Counter(len(values) for values in fibres_second.values())
    swap_image = {swap_middle(source) for source in domain}
    witnesses = {
        "registered": {
            "source": "1737",
            "delta_first": delta_first("1737"),
            "delta_second": delta_second("1737"),
        },
        "delta_first_collision": ["1737", "2737", delta_first("1737")],
        "delta_second_collision": ["1737", "1837", delta_second("1737")],
    }
    types = {
        "IOTA_EXISTING": {
            "type": "PARAMETERIZED_DIRECTED_CLASSIFIER",
            "signature": "C_alpha: sample -> {I,O,M}",
            "not_global_types": ["INDEX", "INJECTION", "STATE", "GENERATOR", "RESIDUAL_IDENTITY"],
        },
        "THOOTH_EXISTING": {
            "type": "PROVENANCE_LABEL_AND_MANUAL_COMPARISON_CARD",
            "executable_operator": False,
            "missing": ["schema", "input_contract", "map", "scoring_rule", "result_corpus"],
        },
        "delta_first": {"type": "LOSSY_SURJECTIVE_PROJECTION", "endomorphism_D4": False},
        "delta_second": {"type": "LOSSY_SURJECTIVE_PROJECTION", "endomorphism_D4": False},
        "joint": {"type": "INJECTIVE_PAIRED_ENCODING_WITH_EXACT_RETURN"},
        "swap_middle_control": {"type": "BIJECTIVE_D4_ENDOMORPHISM"},
    }
    gates = {
        "complete_domain_9000": len(domain) == 9000 and len(set(domain)) == 9000,
        "delta_first_uniform_9": len(fibres_first) == 1000 and first_hist == Counter({9: 1000}),
        "delta_second_uniform_10": len(fibres_second) == 900 and second_hist == Counter({10: 900}),
        "registered_and_collision_witnesses": witnesses["registered"] == {"source": "1737", "delta_first": "737", "delta_second": "137"} and delta_first("2737") == "737" and delta_second("1837") == "137",
        "joint_injective_9000": len(joint) == 9000,
        "joint_exact_return_9000": joint_return == 9000,
        "single_residual_returns_9000": residual_first_return == 9000 and residual_second_return == 9000,
        "deletions_not_generators_swap_control_bijective": len(swap_image) == 9000 and all(len(delta_first(s)) == 3 and len(delta_second(s)) == 3 for s in domain),
        "source_types_separated": not types["THOOTH_EXISTING"]["executable_operator"] and types["IOTA_EXISTING"]["type"] == "PARAMETERIZED_DIRECTED_CLASSIFIER",
        "arithmetic_boundary": 1737 == 9 * 193 == 1729 + 8 and 1737 % 3 == 0,
    }
    classification = "PASS_TYPED_LOSSY_PROJECTIONS_WITH_JOINT_EXACT_RETURN" if all(gates.values()) else "FAIL_DECLARED_FIBRE_OR_RETURN_CONTRACT"
    result = {
        "schema": "nexah.a0.bl049.iota-thooth-typing-result/1.0.0",
        "study_id": "A0_BL_049_IOTA_THOOTH_OPERATOR_TYPING_2026_10_18",
        "classification": classification,
        "domain_size": len(domain),
        "maps": {
            "delta_first": {
                "image_size": len(fibres_first),
                "fibre_histogram": {str(k): v for k, v in sorted(first_hist.items())},
                "collision_count": len(domain) - len(fibres_first),
                "uniform_residual_bits": math.ceil(math.log2(max(first_hist))),
                "return_with_removed_digit": residual_first_return,
            },
            "delta_second": {
                "image_size": len(fibres_second),
                "fibre_histogram": {str(k): v for k, v in sorted(second_hist.items())},
                "collision_count": len(domain) - len(fibres_second),
                "uniform_residual_bits": math.ceil(math.log2(max(second_hist))),
                "return_with_removed_digit": residual_second_return,
            },
            "joint": {"image_size": len(joint), "return_count": joint_return, "residual_bits": 0},
            "swap_middle_control": {"image_size": len(swap_image), "bijective": len(swap_image) == len(domain)},
        },
        "witnesses": witnesses,
        "source_bound_types": types,
        "gates": gates,
        "all_gates_pass": all(gates.values()),
        "claim_boundary": "No glyph algebra, universal Iota/Thoth operator, historical decoder, physical mechanism, prediction, novelty or publication.",
    }
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(result, handle, indent=2, sort_keys=True)
        handle.write("\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: run_experiment.py OUTPUT.json")
    main(sys.argv[1])

