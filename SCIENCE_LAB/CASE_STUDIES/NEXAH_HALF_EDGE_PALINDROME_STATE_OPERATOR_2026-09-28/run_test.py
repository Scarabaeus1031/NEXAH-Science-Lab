#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from fractions import Fraction
from pathlib import Path
import sys


CASE=Path(__file__).resolve().parent


def P(a,b,z): return a*b*b+z*b+a
def R(b,z): return b-1-z
def u(b,z): return Fraction(2*z+1,2*b)


def digits3(n,b):
    return (n//(b*b),(n//b)%b,n%b)


def main():
    outdir=Path(sys.argv[1]) if len(sys.argv)>1 else CASE/"primary"
    outdir.mkdir(parents=True,exist_ok=True)
    failures=[]
    records=0
    even_summary={}
    odd_summary={}
    for b in range(2,37):
        fixed=[]
        left=sum(u(b,z)<Fraction(1,2) for z in range(b))
        right=sum(u(b,z)>Fraction(1,2) for z in range(b))
        centers=sum(u(b,z)==Fraction(1,2) for z in range(b))
        for z in range(b):
            if R(b,z)==z: fixed.append(z)
            if R(b,R(b,z))!=z: failures.append(["involution",b,z])
            if u(b,R(b,z)) != 1-u(b,z): failures.append(["normalized_reflection",b,z])
            if z<b-1 and P(1,b,z+1)-P(1,b,z)!=b: failures.append(["lift",b,z])
            for a in range(1,b):
                records+=1
                n=P(a,b,z)
                if digits3(n,b)!=(a,z,a): failures.append(["digits",a,b,z])
                if digits3(n,b)!=tuple(reversed(digits3(n,b))): failures.append(["palindrome",a,b,z])
                invariant=2*a*(b*b+1)+b*(b-1)
                if n+P(a,b,R(b,z))!=invariant: failures.append(["sum_invariant",a,b,z])
        if b%2==0:
            zl=b//2-1; zr=b//2
            mids=[]
            for a in range(1,b):
                lv=P(a,b,zl); rv=P(a,b,zr); m=Fraction(lv+rv,2)
                if m.denominator!=1: failures.append(["noninteger_midpoint",a,b])
                if any(P(a,b,z)==m for z in range(b)): failures.append(["midpoint_is_state",a,b])
                mids.append(int(m))
            if fixed or left!=b//2 or right!=b//2 or centers!=0:
                failures.append(["even_partition",b,fixed,left,right,centers])
            if any((u(b,z)<Fraction(1,2))==(u(b,R(b,z))<Fraction(1,2)) for z in range(b)):
                failures.append(["side_not_toggled",b])
            even_summary[str(b)]={"fixed_states":fixed,"left":left,"right":right,"centers":centers,"edge_states":[zl,zr],"a1_midpoint":mids[0]}
        else:
            expected=(b-1)//2
            if fixed!=[expected] or centers!=1:
                failures.append(["odd_center",b,fixed,centers])
            odd_summary[str(b)]={"fixed_states":fixed,"left":left,"right":right,"centers":centers}

    boundary=[]
    for b in range(2,37):
        for a in range(1,b):
            top=P(a,b,b-1)
            plus=top+b
            if digits3(plus,b)[0:1]==(a,) and digits3(plus,b)[2:]==(a,):
                boundary.append(["ordinary_addition_false_positive",a,b,plus,digits3(plus,b)])
            if P(a,b,0)==plus:
                boundary.append(["wrap_equals_addition",a,b])

    examples={
        "base10":{
            "232_reflect":P(2,10,R(10,3)),
            "282_reflect":P(2,10,R(10,8)),
            "292_reflect":P(2,10,R(10,9)),
            "edge":[P(2,10,4),P(2,10,5)],
            "midpoint":(P(2,10,4)+P(2,10,5))//2,
        },
        "base12_decimal_values":{
            "edge":[P(2,12,5),P(2,12,6)],
            "midpoint":(P(2,12,5)+P(2,12,6))//2,
        },
        "alphabet_ratio":"5/6",
    }
    expected={
        "base10":{"232_reflect":262,"282_reflect":212,"292_reflect":202,"edge":[242,252],"midpoint":247},
        "base12_decimal_values":{"edge":[350,362],"midpoint":356},
        "alphabet_ratio":"5/6",
    }
    examples_pass=examples==expected
    if not examples_pass: failures.append(["examples",examples,expected])

    result={
        "experiment":"NEXAH_HALF_EDGE_PALINDROME_STATE_OPERATOR_2026-09-28",
        "preregistration_sha256":hashlib.sha256((CASE/"00_PREREGISTRATION.md").read_bytes()).hexdigest(),
        "bases_tested":[2,36],
        "carrier_state_records":records,
        "T1_T2_failures":failures,
        "T3_even_bases":even_summary,
        "T4_odd_bases":odd_summary,
        "T5_boundary_failures":boundary,
        "T6_examples":examples,
        "T6_pass":examples_pass,
        "T7_external_half_labels":"STRUCTURAL_ANALOGY_ONLY_IDENTITY_NOT_TESTABLE",
        "overall_classification":"VALIDATED_EVEN_BASE_HALF_EDGE_STATE_OPERATOR" if not failures and not boundary else "INVALID",
        "scientific_boundary":"FINITE_EXACT_REPRESENTATION_GRAMMAR_ONLY",
    }
    canonical=json.dumps(result,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
    digest=hashlib.sha256(canonical).hexdigest()
    (outdir/"scientific_result.json").write_bytes(canonical+b"\n")
    (outdir/"result_hash.txt").write_text(digest+"\n",encoding="utf-8")
    print(json.dumps({"hash":digest,"classification":result["overall_classification"],"records":records,"outdir":str(outdir)}))
    return 0


if __name__=="__main__": raise SystemExit(main())
