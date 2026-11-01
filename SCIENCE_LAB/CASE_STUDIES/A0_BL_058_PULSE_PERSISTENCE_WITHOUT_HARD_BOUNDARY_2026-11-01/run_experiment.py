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


def grid(dt):
    signal = PROTOCOL["signal"]
    count = int(round((signal["t_max"] - signal["t_min"]) / dt)) + 1
    return [signal["t_min"] + i * dt for i in range(count)]


def logistic(t, center, width):
    return 1.0 / (1.0 + math.exp((t - center) / width))


def carrier(t, center, width, include_exponential=True, include_sine=True, include_quadratic=True):
    signal = PROTOCOL["signal"]
    baseline = 1.0 + signal["drift_linear"] * t
    if include_quadratic:
        baseline += signal["drift_quadratic"] * t * t
    exponential = signal["envelope_amplitude"] * math.exp((t - signal["envelope_center"]) / signal["envelope_scale"]) if include_exponential else 0.0
    sine = signal["sine_amplitude"] * math.sin(signal["omega"] * t) if include_sine else 0.0
    return baseline + logistic(t, center, width) * (exponential + sine)


def derivatives(values, dt):
    first = [0.0] * len(values)
    second = [0.0] * len(values)
    for i in range(1, len(values) - 1):
        first[i] = (values[i + 1] - values[i - 1]) / (2.0 * dt)
        second[i] = (values[i + 1] - 2.0 * values[i] + values[i - 1]) / (dt * dt)
    first[0] = (values[1] - values[0]) / dt
    first[-1] = (values[-1] - values[-2]) / dt
    second[0] = second[1]
    second[-1] = second[-2]
    return first, second


def event_metrics(times, values, dt):
    first, second = derivatives(values, dt)
    lo, hi = PROTOCOL["event_window"]
    indices = [i for i, t in enumerate(times) if lo <= t <= hi]
    curvature = [abs(second[i]) / ((1.0 + first[i] * first[i]) ** 1.5) for i in indices]
    peak = max(curvature)
    local = curvature.index(peak)
    index = indices[local]
    return {"t_star": times[index], "curvature_peak": peak, "value_at_event": values[index]}


def regression_slope(xs, ys):
    mx = sum(xs) / len(xs)
    my = sum(ys) / len(ys)
    denominator = sum((x - mx) ** 2 for x in xs)
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / denominator


def window_weights(kind, count):
    if kind == "hann":
        return [0.5 - 0.5 * math.cos(2.0 * math.pi * i / (count - 1)) for i in range(count)]
    if kind == "tukey_0_5":
        alpha = 0.5
        result = []
        for i in range(count):
            x = i / (count - 1)
            if x < alpha / 2.0:
                result.append(0.5 * (1.0 + math.cos(math.pi * (2.0 * x / alpha - 1.0))))
            elif x <= 1.0 - alpha / 2.0:
                result.append(1.0)
            else:
                result.append(0.5 * (1.0 + math.cos(math.pi * (2.0 * x / alpha - 2.0 / alpha + 1.0))))
        return result
    raise ValueError(kind)


def fourier_coefficients(values, max_order):
    # The final endpoint duplicates the periodic phase and is excluded from the sum.
    n = len(values) - 1
    samples = values[:-1]
    a0 = 2.0 * sum(samples) / n
    coefficients = []
    for k in range(1, max_order + 1):
        a = 0.0
        b = 0.0
        for j, value in enumerate(samples):
            angle = 2.0 * math.pi * k * j / n
            a += value * math.cos(angle)
            b += value * math.sin(angle)
        coefficients.append((2.0 * a / n, 2.0 * b / n))
    return a0, coefficients


def reconstruct(a0, coefficients, count, order, phase_rotate=False):
    n = count - 1
    result = []
    for j in range(count):
        value = a0 / 2.0
        for k, (a, b) in enumerate(coefficients[:order], start=1):
            if phase_rotate:
                amplitude = math.hypot(a, b)
                phase = math.atan2(-b, a)
                delta = 2.0 * math.pi * ((17 * k) % 29) / 29.0
                a = amplitude * math.cos(phase + delta)
                b = -amplitude * math.sin(phase + delta)
            angle = 2.0 * math.pi * k * j / n
            value += a * math.cos(angle) + b * math.sin(angle)
        result.append(value)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    reference_dt = PROTOCOL["signal"]["reference_dt"]
    times = grid(reference_dt)
    boundary_results = []
    for width in PROTOCOL["boundary"]["widths"]:
        for center in PROTOCOL["boundary"]["centers"]:
            values = [carrier(t, center, width) for t in times]
            metrics = event_metrics(times, values, reference_dt)
            boundary_results.append({"center": center, "width": width, **metrics})

    slopes = []
    for width in PROTOCOL["boundary"]["widths"]:
        rows = [row for row in boundary_results if row["width"] == width]
        slopes.append({"width": width, "slope": regression_slope([row["center"] for row in rows], [row["t_star"] for row in rows])})
    sorted_slopes = sorted(row["slope"] for row in slopes)
    median_slope = (sorted_slopes[1] + sorted_slopes[2]) / 2.0
    all_t_stars = [row["t_star"] for row in boundary_results]
    boundary_t_span = max(all_t_stars) - min(all_t_stars)

    sampling_results = []
    for dt in PROTOCOL["sampling_dts"]:
        sample_times = grid(dt)
        values = [carrier(t, 25.0, 2.0) for t in sample_times]
        sampling_results.append({"dt": dt, **event_metrics(sample_times, values, dt)})
    sampling_t_span = max(row["t_star"] for row in sampling_results) - min(row["t_star"] for row in sampling_results)

    reference_values = [carrier(t, 25.0, 2.0) for t in times]
    start_value, end_value = reference_values[0], reference_values[-1]
    chord = [start_value + (end_value - start_value) * i / (len(times) - 1) for i in range(len(times))]
    residual = [value - trend for value, trend in zip(reference_values, chord)]
    fourier_results = []
    phase_result = None
    max_order = max(PROTOCOL["fourier"]["orders"])
    for kind in PROTOCOL["fourier"]["windows"]:
        weights = window_weights(kind, len(times))
        target = [trend + weight * value for trend, weight, value in zip(chord, weights, residual)]
        target_metrics = event_metrics(times, target, reference_dt)
        transformed = [weight * value for weight, value in zip(weights, residual)]
        a0, coefficients = fourier_coefficients(transformed, max_order)
        for order in PROTOCOL["fourier"]["orders"]:
            reconstructed_residual = reconstruct(a0, coefficients, len(times), order)
            reconstructed = [trend + value for trend, value in zip(chord, reconstructed_residual)]
            metrics = event_metrics(times, reconstructed, reference_dt)
            fourier_results.append({
                "window": kind,
                "order": order,
                "target_t_star": target_metrics["t_star"],
                "reconstructed_t_star": metrics["t_star"],
                "t_error": abs(metrics["t_star"] - target_metrics["t_star"]),
                "target_curvature_peak": target_metrics["curvature_peak"],
                "reconstructed_curvature_peak": metrics["curvature_peak"]
            })
        if kind == "hann":
            phase_residual = reconstruct(a0, coefficients, len(times), PROTOCOL["fourier"]["phase_control_order"], phase_rotate=True)
            phase_values = [trend + value for trend, value in zip(chord, phase_residual)]
            phase_metrics = event_metrics(times, phase_values, reference_dt)
            phase_result = {
                "reference_t_star": target_metrics["t_star"],
                "phase_rotated_t_star": phase_metrics["t_star"],
                "t_change": abs(phase_metrics["t_star"] - target_metrics["t_star"]),
                "reference_curvature_peak": target_metrics["curvature_peak"],
                "phase_rotated_curvature_peak": phase_metrics["curvature_peak"],
                "amplitude_relative_change": abs(phase_metrics["curvature_peak"] - target_metrics["curvature_peak"]) / target_metrics["curvature_peak"]
            }

    ablations = {}
    for label, flags in {
        "no_exponential": (False, True, True),
        "no_sine": (True, False, True),
        "no_quadratic_drift": (True, True, False)
    }.items():
        values = [carrier(t, 25.0, 2.0, *flags) for t in times]
        ablations[label] = event_metrics(times, values, reference_dt)

    q = Fraction(*PROTOCOL["alpha_beta"]["centered_q"])
    reciprocal_errors = []
    for t in times:
        exponent = float(q) * logistic(t, 25.0, 2.0) * math.sin(PROTOCOL["signal"]["omega"] * t)
        reciprocal_errors.append(abs(math.exp(exponent) * math.exp(-exponent) - 1.0))
    reciprocal_error = max(reciprocal_errors)

    threshold = PROTOCOL["thresholds"]
    high_order = [row for row in fourier_results if row["order"] >= 64]
    gates = {
        "G1_smooth_only_contract": PROTOCOL["boundary"]["kind"] == "logistic_only",
        "G2_boundary_tracking": median_slope >= threshold["boundary_tracking_slope_min"],
        "G3_carrier_persistence": boundary_t_span <= threshold["carrier_persistence_t_span_max"],
        "G4_sampling_stability": sampling_t_span <= threshold["sampling_t_span_max"],
        "G5_fourier_stability": all(row["t_error"] <= threshold["fourier_t_error_max"] for row in high_order),
        "G6_phase_control": phase_result["t_change"] > threshold["phase_t_change_min"] or phase_result["amplitude_relative_change"] > threshold["phase_amplitude_relative_change_min"],
        "G7_alpha_beta_reciprocal_readout": reciprocal_error <= threshold["reciprocal_tolerance"]
    }

    if gates["G2_boundary_tracking"] and not gates["G3_carrier_persistence"]:
        classification = "BOUNDARY_LOCKED_SMOOTH_EVENT"
    elif gates["G3_carrier_persistence"] and not gates["G2_boundary_tracking"]:
        classification = "CARRIER_PERSISTENT_EVENT"
    elif gates["G2_boundary_tracking"] and gates["G3_carrier_persistence"]:
        classification = "MIXED_BOUNDARY_AND_CARRIER_PERSISTENCE"
    elif not gates["G4_sampling_stability"] or not gates["G5_fourier_stability"]:
        classification = "REPRESENTATION_SENSITIVE_EVENT"
    else:
        classification = "INDETERMINATE_EVENT_ORIGIN"
    qualifiers = ["PHASE_COHERENT_ONLY"] if gates["G6_phase_control"] else []

    payload = {
        "schema": "nexah.a0-bl-058.result.v1",
        "study_id": "A0-BL-058",
        "classification": classification,
        "qualifiers": qualifiers,
        "metrics": {
            "boundary_median_tracking_slope": median_slope,
            "boundary_t_star_span": boundary_t_span,
            "sampling_t_star_span": sampling_t_span,
            "max_high_order_fourier_t_error": max(row["t_error"] for row in high_order),
            "max_alpha_beta_reciprocal_error": reciprocal_error
        },
        "boundary_variants": boundary_results,
        "boundary_slopes": slopes,
        "sampling_controls": sampling_results,
        "fourier_controls": fourier_results,
        "phase_control": phase_result,
        "ablations": ablations,
        "gates": gates,
        "source_boundaries": {
            "a0_bl_057": "Accepted bounded predecessor; hard-cutoff sensitivity remains fixed.",
            "geometria_nova_p12": "Source-bound Fourier visualization only; no mechanism inherited.",
            "alpha_beta": "Exact reciprocal display readout only; not pulse-origin evidence."
        },
        "claim_boundary": PROTOCOL["claim_boundary"]
    }
    canonical_write(Path(args.output), payload)
    print(json.dumps({"classification": classification, "qualifiers": qualifiers, "gates": gates}, sort_keys=True))


if __name__ == "__main__":
    main()
