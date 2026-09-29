#!/usr/bin/env python3
"""Deterministic finite validation for the 64/37 Nexus selector contract."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PREREG = ROOT / "45_64_37_NEXUS_SELECTOR_01_PREREGISTRATION.md"
LOCK = ROOT / "64_37_NEXUS_SELECTOR_01_PREREGISTRATION_LOCK.json"
CONTRACT = ROOT / "64_37_nexus_protocol.json"
OUTPUT = ROOT / "64_37_nexus_selector_01_results.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    divisor = 2
    while divisor * divisor <= n:
        if n % divisor == 0:
            return False
        divisor += 1
    return True


def primes_through(limit: int) -> list[int]:
    return [n for n in range(2, limit + 1) if is_prime(n)]


PRIMES = primes_through(1000)


def prime_index(n: int) -> int | None:
    return PRIMES.index(n) + 1 if n in PRIMES else None


def reverse_digits(n: int) -> int:
    return int(str(n)[::-1])


def next_prime(n: int) -> int:
    candidate = n + 1
    while not is_prime(candidate):
        candidate += 1
    return candidate


def test(name: str, passed: bool, **details: object) -> dict[str, object]:
    return {"name": name, "pass": bool(passed), **details}


def main() -> None:
    lock = json.loads(LOCK.read_text())
    contract = json.loads(CONTRACT.read_text())
    prereg_hash = sha256(PREREG)
    contract_hash = sha256(CONTRACT)

    if prereg_hash != lock["preregistration_sha256"]:
        raise SystemExit("preregistration hash mismatch")
    if contract_hash != lock["contract_sha256"]:
        raise SystemExit("contract hash mismatch")

    expected_indices = {37: 12, 73: 21, 101: 26, 127: 31,
                        131: 32, 137: 33, 173: 40}
    actual_indices = {n: prime_index(n) for n in expected_indices}
    t1 = test(
        "T1_BASE_AND_PRIME_ADDRESSES",
        64 == 2**6 and actual_indices == expected_indices,
        base=64,
        factorization="2^6",
        prime_indices={str(k): v for k, v in actual_indices.items()},
    )

    mirror_hits = []
    for p in PRIMES:
        if not 10 <= p <= 99:
            continue
        q = reverse_digits(p)
        if is_prime(q) and reverse_digits(prime_index(p)) == prime_index(q):
            mirror_hits.append({
                "value": p,
                "prime_index": prime_index(p),
                "mirror": q,
                "mirror_prime_index": prime_index(q),
            })
    nonpal_pairs = sorted({tuple(sorted((row["value"], row["mirror"])))
                           for row in mirror_hits if row["value"] != row["mirror"]})
    t2 = test(
        "T2_PRIOR_BINDING_R37",
        nonpal_pairs == [(37, 73)],
        all_hits=mirror_hits,
        nonpalindromic_unordered_pairs=[list(pair) for pair in nonpal_pairs],
        scope="two-digit primes",
    )

    selectors = {
        "digit_boundary": next_prime(99),
        "prime_hinge_upper": 101 if (97 + 101) // 2 == 99 else None,
        "nexus_decomposition": 64 + 37,
    }
    t3 = test(
        "T3_SELECTOR_CONVERGENCE",
        set(selectors.values()) == {101},
        selectors=selectors,
    )

    triad = [101, 127, 137]
    triad_indices = [prime_index(n) for n in triad]
    triad_equations = [64 + 37, 64 + 63, 64 + 73]
    t4 = test(
        "T4_NEXUS_TRIAD",
        all(map(is_prime, triad))
        and triad_equations == triad
        and triad_indices == [26, 31, 33]
        and triad_indices != list(range(triad_indices[0], triad_indices[0] + 3)),
        components=triad,
        prime_indices=triad_indices,
        generated_components=triad_equations,
        consecutive=False,
    )

    checksums = {
        "base_sum": 3 * 64,
        "residual_sum": 37 + 63 + 73,
        "residual_sum_prime_index": prime_index(173),
        "triad_sum": sum(triad),
        "base_plus_residual": 192 + 173,
    }
    t5 = test(
        "T5_FINITE_CHECKSUMS",
        checksums == {
            "base_sum": 192,
            "residual_sum": 173,
            "residual_sum_prime_index": 40,
            "triad_sum": 365,
            "base_plus_residual": 365,
        },
        checksums=checksums,
        calendar_role="COMMON_YEAR_CHECKSUM_MNEMONIC_ONLY",
    )

    consecutive = [127, 131, 137]
    intersection = sorted(set(triad) & set(consecutive))
    t6 = test(
        "T6_CONSECUTIVE_TRIAD_SEPARATION",
        triad != consecutive
        and [prime_index(n) for n in consecutive] == [31, 32, 33]
        and intersection == [127, 137],
        nexus_triad=triad,
        consecutive_triad=consecutive,
        consecutive_prime_indices=[prime_index(n) for n in consecutive],
        shared_members=intersection,
    )

    square_control = {
        "37_squared": 37**2,
        "64_squared": 64**2,
        "original_sum": 37**2 + 64**2,
        "73_squared": 73**2,
        "46_squared": 46**2,
        "mirrored_sum": 73**2 + 46**2,
    }
    t7 = test(
        "T7_MIRROR_SQUARE_NEGATIVE_CONTROL",
        square_control == {
            "37_squared": 1369,
            "64_squared": 4096,
            "original_sum": 5465,
            "73_squared": 5329,
            "46_squared": 2116,
            "mirrored_sum": 7445,
        } and square_control["original_sum"] != square_control["mirrored_sum"],
        values=square_control,
        quadratic_checksum_invariant=False,
    )

    prime_residuals = [r for r in range(1, 100) if is_prime(64 + r)]
    t8 = test(
        "T8_ARBITRARY_RESIDUAL_NEGATIVE_CONTROL",
        len(prime_residuals) > 1 and 37 in prime_residuals,
        candidate_count=len(prime_residuals),
        residual_candidates=prime_residuals,
        conclusion="64+r alone is underdetermined; prior binding is required",
    )

    tests = [t1, t2, t3, t4, t5, t6, t7, t8]
    passed = all(item["pass"] for item in tests)
    result = {
        "experiment": "64_37_NEXUS_SELECTOR_01",
        "decision": "PASS / MULTI_PATH_SELECTOR_CONTRACT_BOUND"
        if passed else "FAIL / SELECTOR_NOT_BOUND",
        "preregistration_sha256": prereg_hash,
        "contract_sha256": contract_hash,
        "contract_version": contract["version"],
        "tests_passed": sum(item["pass"] for item in tests),
        "tests_total": len(tests),
        "tests": tests,
        "claim_ceiling": (
            "FINITE_INTEGER_MULTI_PATH_SELECTOR / NO_PHYSICAL_"
            "INFORMATION_THEORETIC_OR_UNIVERSAL_CALENDAR_CLAIM"
        ),
        "boundary": {
            "f50_intrinsic_selector": False,
            "state_update_operator": False,
            "new_research_result_id": False,
            "capability_activation": False,
        },
    }
    OUTPUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "decision": result["decision"],
        "tests": f"{result['tests_passed']}/{result['tests_total']}",
        "output_sha256": sha256(OUTPUT),
    }, sort_keys=True))
    if not passed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
