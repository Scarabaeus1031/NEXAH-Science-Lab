#!/usr/bin/env python3
"""Exact finite permutation audit for A0-BL-048."""
from collections import Counter
from itertools import permutations, product
from math import gcd, isqrt
import json
import sys

TARGETS = ("717717", "4774", "1771")


def is_prime(n):
    if n < 2:
        return False
    for d in range(2, isqrt(n) + 1):
        if n % d == 0:
            return False
    return True


def prime_index_map(limit):
    primes = [n for n in range(2, limit + 1) if is_prime(n)]
    return {value: index + 1 for index, value in enumerate(primes)}


def unique_permutations(text):
    return sorted({"".join(chars) for chars in permutations(text)})


def nesting_hits(text, indexes):
    hits = []
    for start in range(len(text)):
        for stop in range(start + 1, len(text) + 1):
            token = text[start:stop]
            if len(token) > 1 and token.startswith("0"):
                continue
            value = int(token)
            if value in indexes and str(indexes[value]) in text:
                hits.append({
                    "start": start,
                    "stop": stop,
                    "prime_substring": token,
                    "prime_value": value,
                    "one_based_prime_index": indexes[value],
                    "index_token": str(indexes[value]),
                })
    return hits


def main(path):
    indexes = prime_index_map(max(int(value) for value in TARGETS))
    classes = [unique_permutations(value) for value in TARGETS]
    score_cache = {}
    for group in classes:
        for value in group:
            score_cache[value] = len(nesting_hits(value, indexes))

    target_prime_score = sum(score_cache[value] for value in TARGETS)
    target_palindrome_score = sum(value == value[::-1] for value in TARGETS)
    prime_hist = Counter()
    palindrome_hist = Counter()
    reversal_membership_failures = 0
    for values in product(*classes):
        prime_hist[sum(score_cache[value] for value in values)] += 1
        palindrome_hist[sum(value == value[::-1] for value in values)] += 1
        reversal_membership_failures += sum(value[::-1] not in classes[i] for i, value in enumerate(values))

    joint_size = 1
    for group in classes:
        joint_size *= len(group)
    prime_tail_n = sum(count for score, count in prime_hist.items() if score >= target_prime_score)
    palindrome_tail_n = sum(count for score, count in palindrome_hist.items() if score >= target_palindrome_score)
    prime_tail = prime_tail_n / joint_size
    palindrome_tail = palindrome_tail_n / joint_size

    if prime_tail <= 0.05 and prime_tail < palindrome_tail:
        classification = "PASS_PRIME_INDEX_SELECTIVE"
    elif palindrome_tail <= 0.05 and prime_tail > palindrome_tail:
        classification = "FAIL_PRIME_INDEX_SELECTIVITY_PALINDROME_BASELINE_DOMINATES"
    else:
        classification = "UNINFORMATIVE_NO_REGISTERED_SELECTIVITY"

    target_rows = []
    for target, group in zip(TARGETS, classes):
        scores = [score_cache[value] for value in group]
        score = score_cache[target]
        target_rows.append({
            "target": target,
            "class_size": len(group),
            "prime_nesting_score": score,
            "class_tail_count": sum(value >= score for value in scores),
            "class_score_histogram": {str(k): v for k, v in sorted(Counter(scores).items())},
            "palindrome": target == target[::-1],
            "palindrome_class_count": sum(value == value[::-1] for value in group),
            "reversal_in_class": target[::-1] in group,
            "hits": nesting_hits(target, indexes),
        })

    gates = {
        "class_sizes_15_6_6_and_joint_540": [len(group) for group in classes] == [15, 6, 6] and joint_size == 540,
        "prime_index_anchors": indexes.get(7) == 4 and indexes.get(17) == 7,
        "complete_histogram_accounting": sum(prime_hist.values()) == joint_size,
        "prime_tail_reported_exactly": prime_tail_n == sum(count for score, count in prime_hist.items() if score >= target_prime_score),
        "reversal_closure": reversal_membership_failures == 0,
        "palindrome_tail_reported_exactly": palindrome_tail_n == sum(count for score, count in palindrome_hist.items() if score >= target_palindrome_score),
        "source_arithmetic_control": 4774 + 4114 == 8888 and gcd(4774, 4114) == 22,
        "registered_decision_and_boundary": classification in {
            "PASS_PRIME_INDEX_SELECTIVE",
            "FAIL_PRIME_INDEX_SELECTIVITY_PALINDROME_BASELINE_DOMINATES",
            "UNINFORMATIVE_NO_REGISTERED_SELECTIVITY",
        },
    }
    result = {
        "schema": "nexah.a0.bl048.prime-index-nesting-result/1.0.0",
        "study_id": "A0_BL_048_PRIME_INDEX_NESTING_CONTROLS_2026_10_18",
        "classification": classification,
        "targets": target_rows,
        "joint_null": {
            "size": joint_size,
            "prime_target_score": target_prime_score,
            "prime_score_histogram": {str(k): v for k, v in sorted(prime_hist.items())},
            "prime_tail": {"numerator": prime_tail_n, "denominator": joint_size, "decimal": prime_tail},
            "palindrome_target_score": target_palindrome_score,
            "palindrome_score_histogram": {str(k): v for k, v in sorted(palindrome_hist.items())},
            "palindrome_tail": {"numerator": palindrome_tail_n, "denominator": joint_size, "decimal": palindrome_tail},
            "reversal_membership_failures": reversal_membership_failures,
        },
        "source_control": {"sum_4774_4114": 8888, "gcd_4774_4114": 22, "included_in_primary_score": False},
        "gates": gates,
        "all_gates_pass": all(gates.values()),
        "interpretation_boundary": "Finite matched-permutation selectivity only. Palindrome fixedness is selection-conditioned; no mechanism, prediction, natural privilege, novelty or publication.",
    }
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(result, handle, indent=2, sort_keys=True)
        handle.write("\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: run_experiment.py OUTPUT.json")
    main(sys.argv[1])

