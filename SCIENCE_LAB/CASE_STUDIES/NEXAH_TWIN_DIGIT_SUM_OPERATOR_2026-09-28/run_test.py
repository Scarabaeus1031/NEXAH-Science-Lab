#!/usr/bin/env python3
from __future__ import annotations

from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import sys


CASE = Path(__file__).resolve().parent
N = 1_000_000
GAPS = (2, 4, 6, 8, 10)
PRIMARY_BASES = (2, 8, 10, 12)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def sieve(n: int) -> bytearray:
    a = bytearray(b"\x01") * (n + 1)
    a[0:2] = b"\x00\x00"
    for p in range(2, math.isqrt(n) + 1):
        if a[p]:
            start = p * p
            a[start:n+1:p] = b"\x00" * (((n - start) // p) + 1)
    return a


def digit_sum(n: int, base: int) -> int:
    total = 0
    while n:
        n, r = divmod(n, base)
        total += r
    return total


def factorize(n: int) -> dict[str, int]:
    out: dict[str, int] = {}
    d = 2
    while d * d <= n:
        while n % d == 0:
            out[str(d)] = out.get(str(d), 0) + 1
            n //= d
        d += 1
    if n > 1:
        out[str(n)] = out.get(str(n), 0) + 1
    return out


def logcomb(n: int, k: int) -> float:
    if k < 0 or k > n:
        return float("-inf")
    return math.lgamma(n + 1) - math.lgamma(k + 1) - math.lgamma(n - k + 1)


def fisher_two_sided(a: int, b: int, c: int, d: int) -> float:
    row1 = a + b
    row2 = c + d
    col1 = a + c
    total = row1 + row2
    lo = max(0, row1 - (total - col1))
    hi = min(row1, col1)
    denom = logcomb(total, row1)
    obs_logp = logcomb(col1, a) + logcomb(total-col1, row1-a) - denom
    logs = []
    for x in range(lo, hi + 1):
        lp = logcomb(col1, x) + logcomb(total-col1, row1-x) - denom
        if lp <= obs_logp + 1e-12:
            logs.append(lp)
    if not logs:
        return 0.0
    m = max(logs)
    return min(1.0, math.exp(m) * sum(math.exp(x-m) for x in logs))


def odds_ratio(a: int, b: int, c: int, d: int):
    if b == 0 or c == 0:
        return "inf" if a and d else None
    return (a * d) / (b * c)


def mapped_event(p: int, q: int, base: int, prime: bytearray) -> tuple[bool, tuple[int,int]]:
    x = digit_sum(p, base)
    y = digit_sum(q, base)
    ok = y-x == 2 and x < len(prime) and y < len(prime) and bool(prime[x]) and bool(prime[y])
    return ok, (x,y)


def enumerate_gap(prime: bytearray, base: int, gap: int, limit: int=N):
    total = 0
    events = 0
    images = Counter()
    for p in range(2, limit-gap+1):
        if prime[p] and prime[p+gap]:
            total += 1
            ok, image = mapped_event(p, p+gap, base, prime)
            if ok:
                events += 1
                images[image] += 1
    return total, events, images


def comparison(base_data: dict[str, dict]):
    primary = base_data["2"]
    control_total = sum(base_data[str(g)]["source_count"] for g in (4,6,8,10))
    control_events = sum(base_data[str(g)]["mapped_twin_count"] for g in (4,6,8,10))
    a = primary["mapped_twin_count"]
    b = primary["source_count"] - a
    c = control_events
    d = control_total - c
    p = fisher_two_sided(a,b,c,d)
    odds = odds_ratio(a,b,c,d)
    passes = p < 0.01 and odds is not None and (odds == "inf" or odds >= 1.5)
    return {
        "table": [[a,b],[c,d]],
        "fisher_two_sided_p": p,
        "odds_ratio": odds,
        "passes_enrichment_rule": passes,
    }


def main() -> int:
    outdir = Path(sys.argv[1]) if len(sys.argv) > 1 else CASE / "primary"
    outdir.mkdir(parents=True, exist_ok=True)
    prime = sieve(N)

    example = {
        "s10_41": digit_sum(41,10),
        "s10_43": digit_sum(43,10),
        "mapped_twin": mapped_event(41,43,10,prime)[0],
        "factor_57": factorize(57),
        "p2_times_p8": 3*19,
        "p2_times_p10": 3*29,
    }
    t1_pass = example == {
        "s10_41": 5, "s10_43": 7, "mapped_twin": True,
        "factor_57": {"3":1,"19":1}, "p2_times_p8":57, "p2_times_p10":87,
    }

    data = {}
    comparisons = {}
    image_counts_10 = None
    for base in PRIMARY_BASES:
        bd = {}
        for gap in GAPS:
            total, events, images = enumerate_gap(prime, base, gap)
            bd[str(gap)] = {
                "source_count": total,
                "mapped_twin_count": events,
                "rate": events/total if total else 0.0,
                "unique_mapped_images": len(images),
            }
            if base == 10 and gap == 2:
                image_counts_10 = images
        data[str(base)] = bd
        comparisons[str(base)] = comparison(bd)

    thresholds = {}
    for limit in (1_000,10_000,100_000,1_000_000):
        total, events, _ = enumerate_gap(prime,10,2,limit)
        thresholds[str(limit)] = {"source_count":total,"mapped_twin_count":events,"rate":events/total if total else 0.0}
    rates = [x["rate"] for x in thresholds.values()]
    nz = [x for x in rates if x > 0]
    scale_ratio = max(nz)/min(nz) if len(nz)==len(rates) else None
    scale_stable = scale_ratio is not None and scale_ratio <= 3

    assert image_counts_10 is not None
    top = [{"image":list(k),"count":v} for k,v in sorted(image_counts_10.items(), key=lambda kv:(-kv[1],kv[0]))[:10]]
    total_events = sum(image_counts_10.values())
    concentration = top[0]["count"]/total_events if total_events else 0.0

    base_scan = {}
    for base in range(2,17):
        total, events, _ = enumerate_gap(prime,base,2)
        base_scan[str(base)] = {"source_count":total,"mapped_twin_count":events,"rate":events/total if total else 0.0}

    decimal_pass = comparisons["10"]["passes_enrichment_rule"]
    robust_count = sum(bool(comparisons[str(b)]["passes_enrichment_rule"]) for b in PRIMARY_BASES)
    all_nonzero = all(data[str(b)]["2"]["rate"] > 0 for b in PRIMARY_BASES)
    cross_base = decimal_pass and robust_count >= 3 and all_nonzero
    if not t1_pass:
        classification = "INVALID"
    elif not decimal_pass:
        classification = "LOCAL_EXAMPLE_ONLY"
    elif cross_base:
        classification = "FINITE_CROSS_BASE_ASSOCIATION"
    else:
        classification = "FINITE_DECIMAL_ASSOCIATION_REPRESENTATION_BOUND"
    if classification != "INVALID":
        classification += "_SCALE_STABLE" if scale_stable else "_SCALE_SENSITIVE"

    result = {
        "experiment":"NEXAH_TWIN_DIGIT_SUM_OPERATOR_2026-09-28",
        "preregistration_sha256":sha256(CASE/"00_PREREGISTRATION.md"),
        "T1_example":example,
        "T1_pass":t1_pass,
        "T2_enumeration":data,
        "T3_T4_comparisons":comparisons,
        "T4_cross_base_pass_count":robust_count,
        "T4_cross_base_pattern":cross_base,
        "T5_scale":{"thresholds":thresholds,"max_min_rate_ratio":scale_ratio,"scale_stable":scale_stable},
        "T6_image_concentration":{"top_images":top,"top_fraction":concentration,"total_events":total_events},
        "T7_secondary_base_scan":base_scan,
        "overall_classification":classification,
        "scientific_boundary":"FINITE_DIGIT_REPRESENTATION_ASSOCIATION_ONLY",
    }
    canonical = json.dumps(result,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
    digest = hashlib.sha256(canonical).hexdigest()
    (outdir/"scientific_result.json").write_bytes(canonical+b"\n")
    (outdir/"result_hash.txt").write_text(digest+"\n",encoding="utf-8")
    print(json.dumps({"hash":digest,"classification":classification,"outdir":str(outdir)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
