#!/usr/bin/env python3
from __future__ import annotations

from collections import defaultdict
import hashlib
import json
import math
from pathlib import Path
import random
import sys


CASE = Path(__file__).resolve().parent
N = 1_000_000
BASES = (2,8,10,12)
PERMUTATIONS = 2000


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def sieve(n: int) -> bytearray:
    a = bytearray(b"\x01")*(n+1)
    a[0:2] = b"\x00\x00"
    for p in range(2,math.isqrt(n)+1):
        if a[p]:
            a[p*p:n+1:p] = b"\x00"*(((n-p*p)//p)+1)
    return a


def digit_sum(n: int, base: int) -> int:
    s=0
    while n:
        n,r=divmod(n,base); s+=r
    return s


def digit_length(n: int, base: int) -> int:
    length=1
    while n>=base:
        n//=base; length+=1
    return length


def event(a: int, b: int, prime: bytearray) -> bool:
    return b-a==2 and bool(prime[a]) and bool(prime[b])


def audit_base(pairs: list[tuple[int,int]], base: int, prime: bytearray):
    groups=defaultdict(list)
    observed=0
    for p,q in pairs:
        a,b=digit_sum(p,base),digit_sum(q,base)
        observed += int(event(a,b,prime))
        modulus=base-1
        key=(digit_length(p,base), p%modulus if modulus>1 else 0)
        groups[key].append((a,b))
    rng=random.Random(20260928+base)
    null=[]
    group_arrays=[([a for a,_ in values],[b for _,b in values]) for values in groups.values()]
    for _ in range(PERMUTATIONS):
        count=0
        for lowers, uppers0 in group_arrays:
            uppers=uppers0.copy()
            rng.shuffle(uppers)
            count += sum(event(a,b,prime) for a,b in zip(lowers,uppers))
        null.append(count)
    mean=sum(null)/len(null)
    variance=sum((x-mean)**2 for x in null)/len(null)
    exceed=sum(x>=observed for x in null)
    p_upper=(1+exceed)/(PERMUTATIONS+1)
    ratio=observed/mean if mean else ("inf" if observed else None)
    passes=p_upper<0.01 and ratio is not None and (ratio=="inf" or ratio>=1.5)
    return {
        "source_count":len(pairs), "strata":len(groups), "observed":observed,
        "null_mean":mean, "null_sd":math.sqrt(variance),
        "null_min":min(null), "null_max":max(null),
        "upper_tail_p":p_upper, "observed_over_null_mean":ratio,
        "pairing_association":passes,
    }


def main() -> int:
    outdir=Path(sys.argv[1]) if len(sys.argv)>1 else CASE/"repair_primary"
    outdir.mkdir(parents=True,exist_ok=True)
    prime=sieve(N)
    pairs=[(p,p+2) for p in range(2,N-1) if prime[p] and prime[p+2]]
    bases={str(base):audit_base(pairs,base,prime) for base in BASES}
    decimal=bases["10"]["pairing_association"]
    passed=sum(bool(bases[str(b)]["pairing_association"]) for b in BASES)
    all_nonzero=all(bases[str(b)]["observed"]>0 for b in BASES)
    cross=decimal and passed>=3 and all_nonzero
    if decimal:
        classification="FINITE_DECIMAL_PAIRING_ASSOCIATION_REPRESENTATION_BOUND"
    else:
        classification="LOCAL_FINITE_PATTERN_NO_PAIRING_ENRICHMENT"
    if cross:
        classification += "_CROSS_BASE"
    result={
        "experiment":"NEXAH_TWIN_DIGIT_SUM_OPERATOR_R1_2026-09-28",
        "r0_preregistration_sha256":sha256(CASE/"00_PREREGISTRATION.md"),
        "r1_preregistration_sha256":sha256(CASE/"01_REPAIR_PREREGISTRATION.md"),
        "r0_control_status":"INVALID_CONGRUENCE_MISMATCH",
        "permutations":PERMUTATIONS,
        "bases":bases,
        "passed_base_count":passed,
        "cross_base":cross,
        "overall_classification":classification,
        "scientific_boundary":"FINITE_REPRESENTATION_PAIRING_TEST_ONLY",
    }
    canonical=json.dumps(result,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
    digest=hashlib.sha256(canonical).hexdigest()
    (outdir/"scientific_result.json").write_bytes(canonical+b"\n")
    (outdir/"result_hash.txt").write_text(digest+"\n",encoding="utf-8")
    print(json.dumps({"hash":digest,"classification":classification,"outdir":str(outdir)}))
    return 0


if __name__=="__main__":
    raise SystemExit(main())
