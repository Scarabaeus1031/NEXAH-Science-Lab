#!/usr/bin/env python3
"""Execute the bounded PQR-01 phase representation audit."""

from __future__ import annotations

import csv
from decimal import Decimal, ROUND_DOWN, ROUND_HALF_UP
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from scipy.stats import binomtest


PACKAGE = Path(__file__).resolve().parents[1]
PROTOCOL = PACKAGE / "protocol.json"
PHX = PACKAGE.parent / "PHX_01_EXTERNAL_E2_PHASE_ANALYSIS_2026-09-20"
CYCLE_SOURCE = PHX / "03_CYCLE_PHASE_RECORDS.csv"
EMPIRICAL_SOURCE = PHX / "02_EMPIRICAL_PHASE_RESULT.json"

EXPECTED_HASHES = {
    "03_CYCLE_PHASE_RECORDS.csv": "907ec0ef4bcde56c53ab39a656a78a4c12bbc6d343dc20732115762f28aa373a",
    "02_EMPIRICAL_PHASE_RESULT.json": "2a8d00f0c873613b84ae2405d6e7fa1f4928b5e580b238e38d7b3bd00defbc82",
}

PHI = (1.0 + math.sqrt(5.0)) / 2.0
VIEWS = {
    "degrees": lambda x: x,
    "radians_pi": lambda x: x * math.pi / 180.0,
    "cycle_fraction": lambda x: x / 360.0,
    "phi_scaled_control": lambda x: x / PHI,
    "sqrt2_scaled_control": lambda x: x / math.sqrt(2.0),
}
OPERATORS = ("ROUND_HALF_UP", "TRUNCATE_TOWARD_ZERO")
PRECISIONS = (2, 3, 4, 5, 6)


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def wrap_deg(value: Any) -> Any:
    return (np.asarray(value) + 180.0) % 360.0 - 180.0


def circular_mean_deg(values: np.ndarray) -> float:
    z = np.mean(np.exp(1j * np.deg2rad(values)))
    return float(wrap_deg(np.rad2deg(np.angle(z))))


def factorization(value: int) -> str:
    if value == 0:
        return "ZERO"
    if value == 1:
        return "UNIT"
    n = value
    factors = []
    divisor = 2
    while divisor * divisor <= n:
        exponent = 0
        while n % divisor == 0:
            exponent += 1
            n //= divisor
        if exponent:
            factors.append(str(divisor) if exponent == 1 else f"{divisor}^{exponent}")
        divisor = 3 if divisor == 2 else divisor + 2
    if n > 1:
        factors.append(str(n))
    return "*".join(factors)


def is_prime(value: int) -> bool:
    if value < 2:
        return False
    if value % 2 == 0:
        return value == 2
    divisor = 3
    while divisor * divisor <= value:
        if value % divisor == 0:
            return False
        divisor += 2
    return True


def quantize(value: float, precision: int, operator: str) -> dict[str, Any]:
    source = Decimal(str(value))
    step = Decimal(1).scaleb(-precision)
    if operator == "ROUND_HALF_UP":
        quantized = source.quantize(step, rounding=ROUND_HALF_UP)
    elif operator == "TRUNCATE_TOWARD_ZERO":
        magnitude = abs(source).quantize(step, rounding=ROUND_DOWN)
        quantized = magnitude.copy_negate() if source < 0 else magnitude
    else:
        raise ValueError(operator)
    residual = source - quantized
    normalized = residual / step
    formatted = f"{abs(quantized):.{precision}f}"
    digits = formatted.split(".")[1]
    code = int(digits)
    reconstruction = quantized + residual
    return {
        "quantized": str(quantized),
        "residual": str(residual),
        "normalized_residual": str(normalized),
        "digit_string": digits,
        "integer_code": code,
        "prefix_2": digits[:2] if precision >= 2 else "",
        "prefix_3": digits[:3] if precision >= 3 else "",
        "palindrome": digits == digits[::-1],
        "prime_code": is_prime(code),
        "factorization": factorization(code),
        "mod_2": code % 2,
        "mod_3": code % 3,
        "seam_reconstruction_exact": reconstruction == source,
    }


def base_records() -> tuple[list[dict[str, Any]], dict[str, np.ndarray]]:
    if digest(CYCLE_SOURCE) != EXPECTED_HASHES[CYCLE_SOURCE.name]:
        raise RuntimeError("cycle source hash mismatch")
    if digest(EMPIRICAL_SOURCE) != EXPECTED_HASHES[EMPIRICAL_SOURCE.name]:
        raise RuntimeError("empirical source hash mismatch")
    with CYCLE_SOURCE.open(newline="", encoding="utf-8") as stream:
        cycles = list(csv.DictReader(stream))
    if len(cycles) != 72:
        raise RuntimeError(f"expected 72 cycle rows, found {len(cycles)}")

    records = []
    grouped: dict[tuple[str, str, int], list[tuple[int, float]]] = {}
    for row in cycles:
        pair, cut = row["pair"], row["cut"]
        actuator, cycle = int(row["actuator"]), int(row["cycle"])
        value = float(row["phase_deg"])
        record_id = f"cycle::{pair}::{cut}::a{actuator}::c{cycle}"
        records.append({
            "corpus": "CYCLE_72", "record_id": record_id, "value_kind": "cycle_phase",
            "pair": pair, "cut": cut, "actuator": actuator, "cycle": cycle,
            "phase_deg": value,
        })
        grouped.setdefault((pair, cut, actuator), []).append((cycle, value))
    arrays = {"::".join((pair, cut, str(actuator))): np.asarray([v for _, v in sorted(values)]) for (pair, cut, actuator), values in grouped.items()}

    empirical = json.loads(EMPIRICAL_SOURCE.read_text(encoding="utf-8"))
    summary_arrays: dict[str, np.ndarray] = {}
    for pair, pair_result in empirical["pairs"].items():
        for actuator_text, result in pair_result["actuators"].items():
            actuator = int(actuator_text)
            for cut in ("A", "B"):
                value = float(result[f"cut_{cut}"]["circular_mean_phase_deg"])
                record_id = f"summary::cut_mean::{pair}::{cut}::a{actuator}"
                records.append({
                    "corpus": "SUMMARY_12", "record_id": record_id, "value_kind": "cut_circular_mean",
                    "pair": pair, "cut": cut, "actuator": actuator, "cycle": "",
                    "phase_deg": value,
                })
                summary_arrays[record_id] = arrays[f"{pair}::{cut}::{actuator}"]
            shift_value = float(result["circular_mean_phase_shift_deg"])
            shift_id = f"summary::pair_shift::{pair}::a{actuator}"
            records.append({
                "corpus": "SUMMARY_12", "record_id": shift_id, "value_kind": "paired_circular_mean_shift",
                "pair": pair, "cut": "B_MINUS_A", "actuator": actuator, "cycle": "",
                "phase_deg": shift_value,
            })
            a = arrays[f"{pair}::A::{actuator}"]
            b = arrays[f"{pair}::B::{actuator}"]
            summary_arrays[shift_id] = wrap_deg(b - a)
    if sum(r["corpus"] == "SUMMARY_12" for r in records) != 12:
        raise RuntimeError("summary registry did not produce 12 records")
    return records, summary_arrays


def add_euler_fields(record: dict[str, Any]) -> dict[str, Any]:
    radians = math.radians(float(record["phase_deg"]))
    z = complex(math.cos(radians), math.sin(radians))
    returned = math.degrees(math.atan2(z.imag, z.real))
    return {
        **record,
        "euler_real": z.real,
        "euler_imag": z.imag,
        "euler_modulus": abs(z),
        "euler_angle_return_error_deg": abs(float(wrap_deg(returned - float(record["phase_deg"])))),
    }


def build_representation_registry(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    output = []
    for record in records:
        for view_name, transform in VIEWS.items():
            transformed = transform(float(record["phase_deg"]))
            for operator in OPERATORS:
                for precision in PRECISIONS:
                    output.append({
                        "corpus": record["corpus"], "record_id": record["record_id"],
                        "value_kind": record["value_kind"], "source_phase_deg": record["phase_deg"],
                        "view": view_name, "view_value": transformed,
                        "operator": operator, "precision": precision,
                        **quantize(transformed, precision, operator),
                    })
    return output


def prime_null_proportions() -> dict[int, float]:
    maximum = 10 ** max(PRECISIONS)
    sieve = np.ones(maximum, dtype=bool)
    sieve[:2] = False
    for p in range(2, int(math.sqrt(maximum - 1)) + 1):
        if sieve[p]:
            sieve[p * p::p] = False
    return {precision: float(np.mean(sieve[:10 ** precision])) for precision in PRECISIONS}


def benjamini_hochberg(pvalues: list[float]) -> list[float]:
    p = np.asarray(pvalues, dtype=float)
    order = np.argsort(p)
    adjusted = np.empty_like(p)
    running = 1.0
    m = len(p)
    for rank_index in range(m - 1, -1, -1):
        original_index = order[rank_index]
        rank = rank_index + 1
        running = min(running, p[original_index] * m / rank)
        adjusted[original_index] = running
    return [float(min(1.0, x)) for x in adjusted]


def pattern_summary(registry: list[dict[str, Any]]) -> list[dict[str, Any]]:
    prime_null = prime_null_proportions()
    groups: dict[tuple[str, str, str, int], list[dict[str, Any]]] = {}
    for row in registry:
        key = (row["corpus"], row["view"], row["operator"], int(row["precision"]))
        groups.setdefault(key, []).append(row)
    results = []
    pvalues = []
    for (corpus, view, operator, precision), rows in sorted(groups.items()):
        n = len(rows)
        palindrome_count = sum(bool(r["palindrome"]) for r in rows)
        prime_count = sum(bool(r["prime_code"]) for r in rows)
        palindrome_null = 10.0 ** (-math.floor(precision / 2))
        palindrome_p = float(binomtest(palindrome_count, n, palindrome_null, alternative="greater").pvalue)
        prime_p = float(binomtest(prime_count, n, prime_null[precision], alternative="greater").pvalue)
        result = {
            "corpus": corpus, "view": view, "operator": operator, "precision": precision,
            "record_count": n,
            "palindrome_count": palindrome_count,
            "palindrome_fraction": palindrome_count / n,
            "palindrome_uniform_digit_null": palindrome_null,
            "palindrome_enrichment_p": palindrome_p,
            "prime_code_count": prime_count,
            "prime_code_fraction": prime_count / n,
            "prime_code_uniform_integer_null": prime_null[precision],
            "prime_code_enrichment_p": prime_p,
        }
        results.append(result)
        pvalues.extend((palindrome_p, prime_p))
    adjusted = benjamini_hochberg(pvalues)
    cursor = 0
    for result in results:
        result["palindrome_enrichment_fdr"] = adjusted[cursor]
        result["prime_code_enrichment_fdr"] = adjusted[cursor + 1]
        cursor += 2
    return results


def circular_block_sample(values: np.ndarray, rng: np.random.Generator, block_length: int) -> np.ndarray:
    pieces = []
    while sum(len(piece) for piece in pieces) < len(values):
        start = int(rng.integers(0, len(values)))
        pieces.append(values[(start + np.arange(block_length)) % len(values)])
    return np.concatenate(pieces)[:len(values)]


def bootstrap_stability(records: list[dict[str, Any]], arrays: dict[str, np.ndarray], protocol: dict[str, Any]) -> list[dict[str, Any]]:
    settings = protocol["bootstrap"]
    summaries = [r for r in records if r["corpus"] == "SUMMARY_12"]
    output = []
    for index, record in enumerate(summaries):
        observed = quantize(float(record["phase_deg"]), 3, "ROUND_HALF_UP")
        rng = np.random.default_rng(settings["seed"] + index)
        estimates = [
            circular_mean_deg(circular_block_sample(arrays[record["record_id"]], rng, settings["block_length_cycles"]))
            for _ in range(settings["draws"])
        ]
        projected = [quantize(value, 3, "ROUND_HALF_UP") for value in estimates]
        code = observed["integer_code"]
        output.append({
            "record_id": record["record_id"], "value_kind": record["value_kind"],
            "observed_phase_deg": record["phase_deg"], "observed_digit_string": observed["digit_string"],
            "observed_integer_code": code, "observed_palindrome": observed["palindrome"],
            "observed_factorization": observed["factorization"],
            "identical_code_bootstrap_fraction": float(np.mean([r["integer_code"] == code for r in projected])),
            "any_palindrome_bootstrap_fraction": float(np.mean([r["palindrome"] for r in projected])),
            "same_mod2_bootstrap_fraction": float(np.mean([r["mod_2"] == observed["mod_2"] for r in projected])),
            "same_mod3_bootstrap_fraction": float(np.mean([r["mod_3"] == observed["mod_3"] for r in projected])),
            "bootstrap_phase_95_interval_deg": [float(x) for x in np.quantile(estimates, [0.025, 0.975])],
        })
    return output


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    protocol = json.loads(PROTOCOL.read_text(encoding="utf-8"))
    records, arrays = base_records()
    carriers = [add_euler_fields(record) for record in records]
    registry = build_representation_registry(records)
    patterns = pattern_summary(registry)
    stability = bootstrap_stability(records, arrays, protocol)

    if not all(row["seam_reconstruction_exact"] for row in registry):
        raise RuntimeError("seam reconstruction failure")
    if max(row["euler_angle_return_error_deg"] for row in carriers) > 1e-12:
        raise RuntimeError("Euler return failure")

    primary_patterns = [
        row for row in patterns
        if row["view"] == "degrees" and row["operator"] == "ROUND_HALF_UP" and row["precision"] == 3
    ]
    marked = {row["record_id"]: row for row in stability if row["observed_digit_string"] in ("393", "696")}
    any_enrichment = any(
        row["palindrome_enrichment_fdr"] < 0.05 or row["prime_code_enrichment_fdr"] < 0.05
        for row in patterns
    )
    result = {
        "schema": "nexah-pqr01-result/0.1.0",
        "mission_id": "PQR-01",
        "status": "COMPLETE_POST_HOC_EXPLORATORY",
        "source_hashes": {CYCLE_SOURCE.name: digest(CYCLE_SOURCE), EMPIRICAL_SOURCE.name: digest(EMPIRICAL_SOURCE)},
        "cycle_record_count": sum(r["corpus"] == "CYCLE_72" for r in records),
        "summary_record_count": sum(r["corpus"] == "SUMMARY_12" for r in records),
        "representation_record_count": len(registry),
        "all_seam_reconstructions_exact": True,
        "all_euler_angle_returns_within_1e_minus_12_deg": True,
        "primary_exploratory_pattern_summary": primary_patterns,
        "marked_393_696_summary_records": marked,
        "any_palindrome_or_prime_enrichment_after_fdr": any_enrichment,
        "classification": "REPRESENTATION_PATTERNS_AUDITED_NO_PHYSICAL_OR_PRIME_CAUSATION_AUTHORIZED",
        "claims_not_authorized": [
            "digit string is the physical phase", "packet boundary is intrinsic",
            "binary and trinary views are invertibly equivalent", "palindrome is a physical invariant",
            "prime factorization causes phase behavior", "phi or sqrt2 has a privileged physical role",
            "morphogenesis demonstrated"
        ],
    }

    write_csv(PACKAGE / "01_PHASE_VALUE_CARRIERS.csv", carriers)
    write_csv(PACKAGE / "02_REPRESENTATION_REGISTRY.csv", registry)
    write_csv(PACKAGE / "03_PATTERN_SUMMARY.csv", patterns)
    write_csv(PACKAGE / "04_SUMMARY_BOOTSTRAP_STABILITY.csv", stability)
    (PACKAGE / "PQR01_RESULT.json").write_text(json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "classification": result["classification"], "representations": len(registry),
        "any_enrichment_after_fdr": any_enrichment, "marked_records": len(marked),
    }))


if __name__ == "__main__":
    main()
