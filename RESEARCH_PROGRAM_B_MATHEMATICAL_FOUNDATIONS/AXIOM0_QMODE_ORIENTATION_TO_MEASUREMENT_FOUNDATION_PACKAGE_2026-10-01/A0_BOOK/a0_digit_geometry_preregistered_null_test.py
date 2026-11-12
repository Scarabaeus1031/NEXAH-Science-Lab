#!/usr/bin/env python3
"""Execute the frozen A0 digit-geometry null audit without third-party packages."""

from __future__ import annotations

from decimal import Decimal, localcontext
import hashlib
import json
import math
from pathlib import Path
from statistics import fmean, median, pstdev


HERE = Path(__file__).resolve().parent
PREREG = HERE / "results" / "A0_DIGIT_GEOMETRY_PREREGISTERED_NULL_TEST_2026-11-11.md"
RECEIPT = HERE / "results" / "a0-digit-geometry-preregistered-null-test-2026-11-11.json"
PREREG_SHA256 = "c63ec688dc21fac8cfdfdb8828d81d19f917dadc711ebae91d56bd33bda9ef63"
BASE_SEED = 0xA0112026
REPLICATES = 100_000
EPSILON = 1e-12
PREFIX_HASHES = {
    "pi": "8001c8d5d496f3f763d0fd3cca5af6c2992c6f4c033c333f3907e3b86301d9fd",
    "e": "1f4db92d2326b73906c56652a2a3a54426c63c6b36b7f58eac3598c2749c9e8e",
    "phi": "39a2a382410a4765e4d5ac53b56f889a537b2808fe7e43577c9aebddf758384b",
    "sqrt2": "24c27b60bbb174a65e0a836e452a24eae0e45321c86e1fefce641f8cda02e17e",
}


class XorShift32:
    def __init__(self, seed: int):
        self.state = seed & 0xFFFFFFFF

    def next(self) -> int:
        x = self.state
        x ^= (x << 13) & 0xFFFFFFFF
        x ^= x >> 17
        x ^= (x << 5) & 0xFFFFFFFF
        self.state = x & 0xFFFFFFFF
        return self.state

    def below(self, n: int) -> int:
        return self.next() % n


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def constants_digits(count: int = 1508) -> dict[str, str]:
    # Guard digits keep the extracted 1,508-digit prefixes away from rounding.
    with localcontext() as ctx:
        ctx.prec = count + 80
        one = Decimal(1)
        two = Decimal(2)
        sqrt2 = two.sqrt()
        phi = (one + Decimal(5).sqrt()) / two
        e = one.exp()

        # Gauss–Legendre doubles its correct digit count at every iteration.
        a = one
        b = one / sqrt2
        t = Decimal(1) / Decimal(4)
        p = one
        for _ in range(13):
            next_a = (a + b) / two
            b = (a * b).sqrt()
            t -= p * (a - next_a) * (a - next_a)
            a = next_a
            p *= two
        pi = (a + b) * (a + b) / (Decimal(4) * t)

        values = {"pi": pi, "e": e, "phi": phi, "sqrt2": sqrt2}
        out = {}
        for name, value in values.items():
            text = format(value, "f")
            fraction = text.split(".", 1)[1]
            if len(fraction) < count:
                raise RuntimeError(f"insufficient digits for {name}")
            out[name] = fraction[:count]
        return out


VECTORS = tuple(
    (math.cos(-math.pi / 2 + 2 * math.pi * j / 5), math.sin(-math.pi / 2 + 2 * math.pi * j / 5))
    for j in range(5)
)


def centroids(digits: str, start: int, length: int = 500) -> list[tuple[float, float]]:
    part = digits[start : start + length]
    n = len(part) // 5
    result = []
    for frame in range(n):
        block = part[frame * 5 : frame * 5 + 5]
        x = sum(int(d) * VECTORS[j][0] / 9 for j, d in enumerate(block)) / 5
        y = sum(int(d) * VECTORS[j][1] / 9 for j, d in enumerate(block)) / 5
        result.append((x, y))
    return result


def strictly_inside(pi, e, phi, sqrt2) -> bool:
    points = ((e[0] - pi[0], e[1] - pi[1]), (phi[0] - pi[0], phi[1] - pi[1]), (sqrt2[0] - pi[0], sqrt2[1] - pi[1]))
    a, b, c = points
    area2 = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if abs(area2) <= EPSILON:
        return False
    w0 = (b[0] * c[1] - b[1] * c[0]) / area2
    w1 = (a[1] * c[0] - a[0] * c[1]) / area2
    w2 = 1.0 - w0 - w1
    return all(EPSILON < w < 1.0 - EPSILON for w in (w0, w1, w2))


def observed_count(series: dict[str, list[tuple[float, float]]]) -> int:
    return sum(strictly_inside(series["pi"][i], series["e"][i], series["phi"][i], series["sqrt2"][i]) for i in range(len(series["pi"])))


def circular_null(series, rng: XorShift32) -> list[int]:
    n = len(series["pi"])
    out = []
    pi, e, phi, sqrt2 = series["pi"], series["e"], series["phi"], series["sqrt2"]
    for _ in range(REPLICATES):
        se, sf, ss = rng.below(n), rng.below(n), rng.below(n)
        count = 0
        for i in range(n):
            count += strictly_inside(pi[i], e[(i + se) % n], phi[(i + sf) % n], sqrt2[(i + ss) % n])
        out.append(count)
    return out


def fisher_yates(values: list[int], rng: XorShift32) -> None:
    for i in range(len(values) - 1, 0, -1):
        j = rng.below(i + 1)
        values[i], values[j] = values[j], values[i]


def permutation_null(series, rng: XorShift32) -> list[int]:
    n = len(series["pi"])
    out = []
    pi, e, phi, sqrt2 = series["pi"], series["e"], series["phi"], series["sqrt2"]
    for _ in range(REPLICATES):
        ie, ip, isq = list(range(n)), list(range(n)), list(range(n))
        fisher_yates(ie, rng)
        fisher_yates(ip, rng)
        fisher_yates(isq, rng)
        count = 0
        for i in range(n):
            count += strictly_inside(pi[i], e[ie[i]], phi[ip[i]], sqrt2[isq[i]])
        out.append(count)
    return out


def quantile(sorted_values: list[int], probability: float) -> float:
    position = probability * (len(sorted_values) - 1)
    lo, hi = math.floor(position), math.ceil(position)
    if lo == hi:
        return float(sorted_values[lo])
    weight = position - lo
    return sorted_values[lo] * (1 - weight) + sorted_values[hi] * weight


def summarize(values: list[int], observed: int) -> dict:
    ordered = sorted(values)
    mean = fmean(values)
    sd = pstdev(values)
    low = (sum(value <= observed for value in values) + 1) / (len(values) + 1)
    high = (sum(value >= observed for value in values) + 1) / (len(values) + 1)
    med = median(values)
    return {
        "replicates": len(values),
        "mean": mean,
        "median": med,
        "sd": sd,
        "quantiles": {key: quantile(ordered, p) for key, p in (("q005", 0.005), ("q01", 0.01), ("q99", 0.99), ("q995", 0.995))},
        "p_low_plus_one": low,
        "p_high_plus_one": high,
        "p_two_sided": min(1.0, 2 * min(low, high)),
        "z": (observed - mean) / sd if sd else None,
        "deviation_from_median": observed - med,
    }


def make_series(digits: dict[str, str], start: int, length: int = 500) -> dict[str, list[tuple[float, float]]]:
    return {name: centroids(value, start, length) for name, value in digits.items()}


def evaluate_holdout(label: str, series, rng: XorShift32) -> dict:
    observed = observed_count(series)
    n1 = summarize(circular_null(series, rng), observed)
    n2 = summarize(permutation_null(series, rng), observed)
    return {"label": label, "frames": len(series["pi"]), "observed_inside": observed, "N1_circular": n1, "N2_permutation": n2}


def main() -> None:
    prereg_hash = sha256_bytes(PREREG.read_bytes())
    if prereg_hash != PREREG_SHA256:
        raise RuntimeError(f"preregistration hash mismatch: {prereg_hash}")

    digits = constants_digits()
    prefix_checks = {
        name: {"sha256": sha256_bytes(value[:500].encode()), "expected": PREFIX_HASHES[name]}
        for name, value in digits.items()
    }
    if not all(row["sha256"] == row["expected"] for row in prefix_checks.values()):
        raise RuntimeError("generated constants do not match frozen 500-digit fixture")

    rng = XorShift32(BASE_SEED)
    h1_series = make_series(digits, 500)
    h2_series = make_series(digits, 1000)
    h1 = evaluate_holdout("H1_DIGITS_501_1000", h1_series, rng)
    h2 = evaluate_holdout("H2_DIGITS_1001_1500", h2_series, rng)

    offsets = []
    for offset in range(1, 5):
        series = make_series(digits, 500 + offset, 500 - offset)
        observed = observed_count(series)
        offsets.append({
            "offset": offset,
            "frames": len(series["pi"]),
            "observed_inside": observed,
            "N1_circular": summarize(circular_null(series, rng), observed),
        })

    def passes_null(row: dict, key: str) -> bool:
        null = row[key]
        return null["p_two_sided"] <= 0.01 and abs(null["z"]) >= 2.5

    sign_h1 = math.copysign(1, h1["N1_circular"]["deviation_from_median"]) if h1["N1_circular"]["deviation_from_median"] else 0
    sign_h2 = math.copysign(1, h2["N1_circular"]["deviation_from_median"]) if h2["N1_circular"]["deviation_from_median"] else 0
    same_offset_signs = sum(
        (math.copysign(1, row["N1_circular"]["deviation_from_median"]) if row["N1_circular"]["deviation_from_median"] else 0) == sign_h1
        for row in offsets
    )
    opposite_significant = any(
        row["N1_circular"]["p_two_sided"] <= 0.01
        and (math.copysign(1, row["N1_circular"]["deviation_from_median"]) if row["N1_circular"]["deviation_from_median"] else 0) == -sign_h1
        for row in offsets
    )
    gates = {
        "G1_H1_BOTH_NULLS": passes_null(h1, "N1_circular") and passes_null(h1, "N2_permutation"),
        "G2_H2_BOTH_NULLS": passes_null(h2, "N1_circular") and passes_null(h2, "N2_permutation"),
        "G3_SAME_DIRECTION": sign_h1 != 0 and sign_h1 == sign_h2,
        "G4_ABS_Z_AT_LEAST_2_5": all(passes_null(row, key) for row in (h1, h2) for key in ("N1_circular", "N2_permutation")),
        "G5_OFFSET_ROBUSTNESS": same_offset_signs >= 3 and not opposite_significant,
    }
    retained = all(gates.values())
    receipt = {
        "schema": "nexah.a0.digit-geometry-preregistered-null-audit/1",
        "status": "PASS_STRONGER_ALIGNMENT_RETAINED" if retained else "FALSIFIED_STRONGER_ALIGNMENT_FOR_DECLARED_OPERATOR_AND_HOLDOUTS",
        "preregistration": {"path": str(PREREG.relative_to(HERE)), "sha256": prereg_hash, "frozen_before_holdout_generation": True},
        "implementation": {"runner": Path(__file__).name, "decimal_engine": "python Decimal; Gauss-Legendre pi; Decimal exp/sqrt", "base_seed_hex": hex(BASE_SEED), "rng": "xorshift32", "replicates_per_population": REPLICATES, "epsilon": EPSILON},
        "prefix_checks": prefix_checks,
        "holdout_hashes": {label: {name: sha256_bytes(value[start : start + 500].encode()) for name, value in digits.items()} for label, start in (("H1_DIGITS_501_1000", 500), ("H2_DIGITS_1001_1500", 1000))},
        "H1": h1,
        "H2": h2,
        "offset_controls_H1": offsets,
        "gates": gates,
        "decision": {
            "stronger_statement": "SYNCHRONOUS_ALIGNMENT_EXCEEDS_NULL",
            "retained": retained,
            "interpretation": "The stronger synchronous-alignment statement survives all preregistered null and replication gates." if retained else "At least one preregistered gate failed; the stronger synchronous-alignment statement is falsified for this operator and these holdouts.",
        },
        "claim_boundary": "FINITE_PREREGISTERED_NULL_AUDIT_NOT_CONSTANT_IDENTITY_NORMALITY_RANDOMNESS_PHYSICS_OR_UNIVERSAL_LAW",
        "graph_delta": {"nodes": 0, "relations": 0, "aliases": 0},
        "authority_effect": {"study_activation": False, "canonical_finding": False, "claim_ceiling_change": False, "publication_authorized": False},
    }
    RECEIPT.write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(receipt, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
