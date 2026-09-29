#!/usr/bin/env python3
import argparse
import hashlib
import json
import math
import sys
from pathlib import Path


STATE_ORDER = ["11", "10", "01", "00"]
TARGET_COUNTS = {"11": 5330, "10": 19242, "01": 19194, "00": 56234}
LIMIT_K = 100000
LIMIT_VALUE = 6 * LIMIT_K + 1
LOCK_HASH = "1aabd49df777351a7e0f260e765022800dcbc4efe07cfba9c945779d4dfab4b7"


def sieve(limit):
    flags = bytearray(b"\x01") * (limit + 1)
    flags[0:2] = b"\x00\x00"
    for value in range(2, math.isqrt(limit) + 1):
        if flags[value]:
            start = value * value
            flags[start:limit + 1:value] = b"\x00" * (((limit - start) // value) + 1)
    return flags


def exact_binomial_two_sided_half(successes, trials):
    low = min(successes, trials - successes)
    coefficient = 1
    cumulative = 1
    for i in range(low):
        coefficient = coefficient * (trials - i) // (i + 1)
        cumulative += coefficient
    numerator = min(1 << trials, 2 * cumulative)
    return float(numerator / (1 << trials))


def normal_two_sided(z):
    return math.erfc(abs(z) / math.sqrt(2.0))


def contingency(binary_a, binary_b):
    table = [[0, 0], [0, 0]]
    for a, b in zip(binary_a, binary_b):
        table[int(bool(a))][int(bool(b))] += 1
    n = sum(sum(row) for row in table)
    row = [sum(table[0]), sum(table[1])]
    col = [table[0][0] + table[1][0], table[0][1] + table[1][1]]
    chi2 = 0.0
    for i in range(2):
        for j in range(2):
            expected = row[i] * col[j] / n if n else 0.0
            if expected:
                chi2 += (table[i][j] - expected) ** 2 / expected
    determinant = table[1][1] * table[0][0] - table[1][0] * table[0][1]
    sign = 0 if determinant == 0 else (1 if determinant > 0 else -1)
    phi = sign * math.sqrt(chi2 / n) if n else 0.0
    p_value = math.erfc(math.sqrt(chi2 / 2.0))
    return {"table": table, "n": n, "chi_square": chi2, "p_value": p_value, "phi": phi}


def block_associations(status, lane, blocks=10):
    n = len(status)
    out = []
    for block in range(blocks):
        start = block * n // blocks
        end = (block + 1) * n // blocks
        result = contingency(status[start:end], lane[start:end])
        out.append({"block": block + 1, "start_record": start + 1, "end_record": end, "phi": result["phi"], "p_value": result["p_value"]})
    signs = [0 if item["phi"] == 0 else (1 if item["phi"] > 0 else -1) for item in out]
    stable = len(set(signs)) == 1 and signs[0] != 0 and min(abs(item["phi"]) for item in out) >= 0.02
    return out, stable


def state(left, right):
    return ("1" if left else "0") + ("1" if right else "0")


def run():
    prime = sieve(LIMIT_VALUE)
    states = []
    left_lane = []
    right_lane = []
    windows = []
    for k in range(1, LIMIT_K + 1):
        left = 6 * k - 1
        right = 6 * k + 1
        l_prime = bool(prime[left])
        r_prime = bool(prime[right])
        label = state(l_prime, r_prime)
        states.append(label)
        left_lane.append(l_prime)
        right_lane.append(r_prime)
        if k <= 12:
            windows.append({"k": k, "left": left, "right": right, "state": label})

    counts = {label: states.count(label) for label in STATE_ORDER}
    t1_pass = counts == TARGET_COUNTS and sum(counts.values()) == LIMIT_K
    first_non_11 = next(k for k, label in enumerate(states, start=1) if label != "11")
    t2_pass = states[:4] == ["11", "11", "11", "10"] and first_non_11 == 4

    transition = {source: {target: 0 for target in STATE_ORDER} for source in STATE_ORDER}
    for source, target in zip(states[:-1], states[1:]):
        transition[source][target] += 1
    row_probabilities = {}
    for source in STATE_ORDER:
        total = sum(transition[source].values())
        row_probabilities[source] = {target: transition[source][target] / total for target in STATE_ORDER}
    transition_complete = sum(sum(row.values()) for row in transition.values()) == LIMIT_K - 1 and all(counts[s] > 0 for s in STATE_ORDER)

    singleton_total = counts["10"] + counts["01"]
    singleton_p = exact_binomial_two_sided_half(counts["10"], singleton_total)
    direction_effect = (counts["10"] - counts["01"]) / singleton_total
    direction_class = "MATERIAL_DIRECTIONAL_ASYMMETRY" if singleton_p < 0.01 and abs(direction_effect) >= 0.01 else "NO_MATERIAL_DIRECTIONAL_ASYMMETRY"

    block_size = 1000
    null_mean = 0.0
    null_variance = 0.0
    for start in range(0, LIMIT_K, block_size):
        l_count = sum(left_lane[start:start + block_size])
        r_count = sum(right_lane[start:start + block_size])
        n = block_size
        null_mean += l_count * r_count / n
        null_variance += r_count * (l_count / n) * (1 - l_count / n) * ((n - r_count) / (n - 1))
    observed_both = counts["11"]
    z_alignment = (observed_both - null_mean) / math.sqrt(null_variance)
    p_alignment = normal_two_sided(z_alignment)
    relative_alignment = (observed_both - null_mean) / null_mean
    alignment_class = "LANE_DEPENDENCE_DETECTED" if p_alignment < 0.01 and abs(relative_alignment) >= 0.01 else "NO_MATERIAL_LANE_DEPENDENCE"

    primes = [value for value in range(2, LIMIT_VALUE + 1) if prime[value]]
    records = []
    for index, value in enumerate(primes, start=1):
        if value <= 3:
            continue
        lane_plus = value % 6 == 1
        records.append({
            "index": index,
            "value": value,
            "lane_plus": lane_plus,
            "index_odd": index % 2 == 1,
            "index_prime": bool(prime[index]),
        })

    lanes = [record["lane_plus"] for record in records]
    parity = [record["index_odd"] for record in records]
    prime_index = [record["index_prime"] for record in records]
    parity_result = contingency(parity, lanes)
    prime_index_result = contingency(prime_index, lanes)
    parity_blocks, parity_stable = block_associations(parity, lanes)
    prime_index_blocks, prime_index_stable = block_associations(prime_index, lanes)
    parity_material = parity_result["p_value"] < 0.01 and abs(parity_result["phi"]) >= 0.05 and parity_stable
    prime_index_material = prime_index_result["p_value"] < 0.01 and abs(prime_index_result["phi"]) >= 0.05 and prime_index_stable

    decision = "VALIDATED_STANDARD_MOD6_OCCUPANCY_OPERATOR" if t1_pass and t2_pass and transition_complete else "FAILED"
    result = {
        "experiment": "NEXAH_MOD6_PRIME_WINDOW_STATE_OPERATOR_2026-09-28",
        "preregistration_sha256": LOCK_HASH,
        "population": {"k_min": 1, "k_max": LIMIT_K, "value_limit": LIMIT_VALUE, "prime_values_above_3": len(records)},
        "tests": {
            "T1_exact_reproduction": {"pass": t1_pass, "state_order": STATE_ORDER, "counts": counts, "target_counts": TARGET_COUNTS},
            "T2_first_asymmetry": {"pass": t2_pass, "first_non_11_k": first_non_11, "first_windows": windows},
            "T3_transition_matrix": {"complete": transition_complete, "counts": transition, "row_probabilities": row_probabilities},
            "T4_directional_singleton_asymmetry": {"singleton_total": singleton_total, "left_only": counts["10"], "right_only": counts["01"], "exact_two_sided_p": singleton_p, "effect": direction_effect, "classification": direction_class},
            "T5_lane_alignment_null": {"observed_11": observed_both, "expected_11": null_mean, "variance": null_variance, "z": z_alignment, "two_sided_p": p_alignment, "relative_difference": relative_alignment, "classification": alignment_class},
            "T6_index_parity_vs_lane": {**parity_result, "block_results": parity_blocks, "stable": parity_stable, "material_association": parity_material},
            "T7_prime_index_status_vs_lane": {**prime_index_result, "block_results": prime_index_blocks, "stable": prime_index_stable, "material_association": prime_index_material},
        },
        "decision": decision,
        "claim_ceiling": "STANDARD_FINITE_MOD6_OCCUPANCY_AND_INDEX_SEPARATION_NO_PRIME_GENERATOR_OR_PHYSICAL_CLAIM",
        "runtime": {"python": sys.version.split()[0]},
    }
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()
    output = Path(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    result = run()
    canonical = json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    digest = hashlib.sha256(canonical).hexdigest()
    (output / "scientific_result.json").write_bytes(canonical + b"\n")
    (output / "result_hash.txt").write_text(digest + "\n", encoding="utf-8")
    summary = {
        "decision": result["decision"],
        "hash": digest,
        "counts": result["tests"]["T1_exact_reproduction"]["counts"],
        "direction": result["tests"]["T4_directional_singleton_asymmetry"]["classification"],
        "alignment": result["tests"]["T5_lane_alignment_null"]["classification"],
        "index_parity_material": result["tests"]["T6_index_parity_vs_lane"]["material_association"],
        "prime_index_material": result["tests"]["T7_prime_index_status_vs_lane"]["material_association"],
    }
    print(json.dumps(summary, sort_keys=True))


if __name__ == "__main__":
    main()
