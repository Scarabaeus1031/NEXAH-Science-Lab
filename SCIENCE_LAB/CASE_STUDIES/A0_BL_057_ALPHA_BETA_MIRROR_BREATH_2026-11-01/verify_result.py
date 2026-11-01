#!/usr/bin/env python3
import json
import math
import sys
from fractions import Fraction
from pathlib import Path


def require(condition, message):
    if not condition:
        raise SystemExit("FAIL: " + message)


path = Path(sys.argv[1])
data = json.loads(path.read_text(encoding="utf-8"))
require(data["schema"] == "nexah.a0-bl-057.result.v1", "schema")
require(data["study_id"] == "A0-BL-057", "study id")
require(Fraction(data["exact"]["alpha"]) + Fraction(data["exact"]["beta"]) == 1, "exact complement")
require(Fraction(data["exact"]["signed_alpha"]) == -Fraction(data["exact"]["signed_beta"]), "signed opposition")
require(data["metrics"]["sample_count"] == 5001, "sample count")
require(abs(data["metrics"]["period"] - 2.0 * math.pi / 0.8) <= 1e-15, "period")
require(data["metrics"]["max_reciprocal_product_error"] <= 1e-12, "reciprocal product")
require(data["metrics"]["pure_cycle_state_return_error"] <= 1e-12, "cycle return")
require(data["metrics"]["max_reversed_swap_error"] <= 1e-12, "reverse swap")
require(data["metrics"]["uncentered_control_max_product_error"] > 0.1, "uncentered negative control")
require(set(data["gates"]) == {
    "G1_exact_complement", "G2_exact_signed_opposition", "G3_reciprocal_product",
    "G4_pure_cycle_state_return", "G5_reversed_channel_swap",
    "G6_equal_weight_zero_amplitude", "G7_cutoff_acceleration_reduction",
    "G8_adjacent_jump_localization"
}, "gate names")
mirror = all(data["gates"][key] for key in list(data["gates"])[:6])
cutoff = data["gates"]["G7_cutoff_acceleration_reduction"] and data["gates"]["G8_adjacent_jump_localization"]
expected = "FAIL_MIRROR_RETURN" if not mirror else (
    "PASS_EXACT_COMPLEMENT_MIRROR_RETURN_WITH_CUTOFF_SENSITIVITY" if cutoff else
    "MIXED_EXACT_MIRROR_RETURN_CUTOFF_SENSITIVITY_NOT_ESTABLISHED"
)
require(data["classification"] == expected, "classification")
require("not physical dilation" in data["source_boundaries"]["mirror_breath"], "claim boundary")
print("PASS: independent structural verification")
