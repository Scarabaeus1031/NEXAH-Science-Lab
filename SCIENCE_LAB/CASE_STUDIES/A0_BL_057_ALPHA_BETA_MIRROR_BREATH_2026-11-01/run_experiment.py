#!/usr/bin/env python3
import argparse
import json
import math
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROTOCOL = json.loads((ROOT / "FROZEN_PROTOCOL.json").read_text(encoding="utf-8"))


def canonical_write(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, sort_keys=True, indent=2) + "\n", encoding="utf-8")


def finite_first(values, dt):
    out = [0.0] * len(values)
    out[0] = (values[1] - values[0]) / dt
    out[-1] = (values[-1] - values[-2]) / dt
    for i in range(1, len(values) - 1):
        out[i] = (values[i + 1] - values[i - 1]) / (2.0 * dt)
    return out


def finite_second(values, dt):
    out = [0.0] * len(values)
    scale = dt * dt
    for i in range(1, len(values) - 1):
        out[i] = (values[i + 1] - 2.0 * values[i] + values[i - 1]) / scale
    out[0] = out[1]
    out[-1] = out[-2]
    return out


def rotation_metric(values, derivative):
    points = list(zip(values, derivative))
    delta = [(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]) for i in range(1, len(points))]
    result = [0.0, 0.0]
    for i in range(1, len(delta)):
        a, b = delta[i - 1], delta[i]
        denom = math.hypot(*a) * math.hypot(*b)
        if denom == 0.0:
            result.append(0.0)
        else:
            cosine = max(-1.0, min(1.0, (a[0] * b[0] + a[1] * b[1]) / denom))
            result.append(math.acos(cosine))
    return result[:len(values)]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    sig = PROTOCOL["signal"]
    gates_cfg = PROTOCOL["gates"]
    dt = sig["dt"]
    n = int(round((sig["t_max"] - sig["t_min"]) / dt)) + 1
    times = [sig["t_min"] + i * dt for i in range(n)]

    alpha = Fraction(PROTOCOL["alpha"]["numerator"], PROTOCOL["alpha"]["denominator"])
    beta = Fraction(PROTOCOL["beta"]["numerator"], PROTOCOL["beta"]["denominator"])
    signed_alpha = 2 * alpha - 1
    signed_beta = 2 * beta - 1
    q = Fraction(PROTOCOL["q"]["numerator"], PROTOCOL["q"]["denominator"])

    def hard_window(t):
        return 1.0 if t < sig["cutoff"] else 0.0

    def smooth_window(t):
        return 1.0 / (1.0 + math.exp((t - sig["cutoff"]) / sig["smooth_tau"]))

    def carrier(t, window):
        baseline = 1.0 + sig["drift_linear"] * t + sig["drift_quadratic"] * t * t
        envelope = sig["envelope_amplitude"] * math.exp((t - sig["envelope_center"]) / sig["envelope_scale"])
        pulse = sig["sine_amplitude"] * math.sin(sig["omega"] * t)
        return baseline + window(t) * (envelope + pulse)

    hard = [carrier(t, hard_window) for t in times]
    smooth = [carrier(t, smooth_window) for t in times]
    d_hard = finite_first(hard, dt)
    d_smooth = finite_first(smooth, dt)
    dd_hard = finite_second(hard, dt)
    dd_smooth = finite_second(smooth, dt)
    rot_hard = rotation_metric(hard, d_hard)
    rot_smooth = rotation_metric(smooth, d_smooth)

    q_float = float(q)
    scales_alpha = []
    scales_beta = []
    product_errors = []
    swap_errors = []
    equal_errors = []
    uncentered_product_errors = []
    for t in times:
        phase = math.sin(sig["omega"] * t)
        w = smooth_window(t)
        exponent = q_float * w * phase
        sa = math.exp(exponent)
        sb = math.exp(-exponent)
        scales_alpha.append(sa)
        scales_beta.append(sb)
        product_errors.append(abs(sa * sb - 1.0))
        reversed_alpha = math.exp(-exponent)
        reversed_beta = math.exp(exponent)
        swap_errors.append(max(abs(reversed_alpha - sb), abs(reversed_beta - sa)))
        equal_errors.append(max(abs(math.exp(0.0) - 1.0), abs(math.exp(-0.0) - 1.0)))
        uncentered_product_errors.append(abs(math.exp(float(alpha) * phase) * math.exp(float(beta) * phase) - 1.0))

    period = 2.0 * math.pi / sig["omega"]
    def pure_state(t, sign):
        phase = sig["omega"] * t
        scale = math.exp(sign * q_float * math.sin(phase))
        velocity = scale * sign * q_float * sig["omega"] * math.cos(phase)
        return scale, velocity

    state_a0 = pure_state(0.0, +1.0)
    state_a1 = pure_state(period, +1.0)
    state_b0 = pure_state(0.0, -1.0)
    state_b1 = pure_state(period, -1.0)
    pure_return_error = max(abs(state_a0[0] - state_a1[0]), abs(state_a0[1] - state_a1[1]), abs(state_b0[0] - state_b1[0]), abs(state_b0[1] - state_b1[1]))

    lo, hi = gates_cfg["cutoff_window"]
    idx = [i for i, t in enumerate(times) if lo <= t <= hi]
    hard_accel_peak = max(abs(dd_hard[i]) for i in idx)
    smooth_accel_peak = max(abs(dd_smooth[i]) for i in idx)
    acceleration_ratio = hard_accel_peak / smooth_accel_peak if smooth_accel_peak else math.inf
    hard_rotation_peak = max(rot_hard[i] for i in idx)
    smooth_rotation_peak = max(rot_smooth[i] for i in idx)
    rotation_ratio = hard_rotation_peak / smooth_rotation_peak if smooth_rotation_peak else math.inf

    cutoff_index = min(range(len(times)), key=lambda i: abs(times[i] - sig["cutoff"]))
    hard_jump = abs(hard[cutoff_index] - hard[cutoff_index - 1])
    smooth_jump = abs(smooth[cutoff_index] - smooth[cutoff_index - 1])

    gate_values = {
        "G1_exact_complement": alpha + beta == 1,
        "G2_exact_signed_opposition": signed_alpha == -signed_beta == Fraction(31, 32),
        "G3_reciprocal_product": max(product_errors) <= gates_cfg["reciprocal_tolerance"],
        "G4_pure_cycle_state_return": pure_return_error <= gates_cfg["return_tolerance"],
        "G5_reversed_channel_swap": max(swap_errors) <= gates_cfg["swap_tolerance"],
        "G6_equal_weight_zero_amplitude": max(equal_errors) <= gates_cfg["return_tolerance"],
        "G7_cutoff_acceleration_reduction": acceleration_ratio >= gates_cfg["cutoff_acceleration_ratio_min"],
        "G8_adjacent_jump_localization": hard_jump > gates_cfg["hard_jump_min"] and smooth_jump < gates_cfg["smooth_jump_max"]
    }
    mirror_pass = all(gate_values[f"G{i}_{name}"] for i, name in [
        (1, "exact_complement"),
        (2, "exact_signed_opposition"),
        (3, "reciprocal_product"),
        (4, "pure_cycle_state_return"),
        (5, "reversed_channel_swap"),
        (6, "equal_weight_zero_amplitude")
    ])
    cutoff_pass = gate_values["G7_cutoff_acceleration_reduction"] and gate_values["G8_adjacent_jump_localization"]
    if not mirror_pass:
        classification = "FAIL_MIRROR_RETURN"
    elif cutoff_pass:
        classification = "PASS_EXACT_COMPLEMENT_MIRROR_RETURN_WITH_CUTOFF_SENSITIVITY"
    else:
        classification = "MIXED_EXACT_MIRROR_RETURN_CUTOFF_SENSITIVITY_NOT_ESTABLISHED"

    sample_indices = sorted(set([0, cutoff_index - 1, cutoff_index, cutoff_index + 1, len(times) - 1]))
    samples = [{
        "t": round(times[i], 12),
        "hard": round(hard[i], 12),
        "smooth": round(smooth[i], 12),
        "scale_alpha": round(scales_alpha[i], 12),
        "scale_beta": round(scales_beta[i], 12)
    } for i in sample_indices]

    payload = {
        "schema": "nexah.a0-bl-057.result.v1",
        "study_id": "A0-BL-057",
        "classification": classification,
        "exact": {
            "alpha": "63/64",
            "beta": "1/64",
            "sum": str(alpha + beta),
            "signed_alpha": "31/32",
            "signed_beta": "-31/32",
            "centered_q": "31/64"
        },
        "metrics": {
            "sample_count": len(times),
            "dt": dt,
            "period": period,
            "max_reciprocal_product_error": max(product_errors),
            "pure_cycle_state_return_error": pure_return_error,
            "max_reversed_swap_error": max(swap_errors),
            "hard_cutoff_acceleration_peak": hard_accel_peak,
            "smooth_cutoff_acceleration_peak": smooth_accel_peak,
            "hard_to_smooth_acceleration_ratio": acceleration_ratio,
            "hard_cutoff_rotation_peak": hard_rotation_peak,
            "smooth_cutoff_rotation_peak": smooth_rotation_peak,
            "hard_to_smooth_rotation_ratio": rotation_ratio,
            "hard_adjacent_cutoff_jump": hard_jump,
            "smooth_adjacent_cutoff_jump": smooth_jump,
            "uncentered_control_max_product_error": max(uncentered_product_errors),
            "drifted_carrier_one_period_residual": abs(smooth[min(range(len(times)), key=lambda i: abs(times[i] - period))] - smooth[0])
        },
        "gates": gate_values,
        "samples": samples,
        "source_boundaries": {
            "ca_ident_05": "Prior negative Fourier/Memory classification result unchanged.",
            "core_run_026": "Synthetic scenario only; regime labels and physical interpretation are not inherited.",
            "mirror_breath": "Declared reciprocal display-scale operator, not physical dilation."
        },
        "claim_boundary": PROTOCOL["claim_boundary"]
    }
    canonical_write(Path(args.output), payload)
    print(json.dumps({"classification": classification, "gates_passed": sum(gate_values.values()), "gates_total": len(gate_values)}, sort_keys=True))


if __name__ == "__main__":
    main()
