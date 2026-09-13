#!/usr/bin/env python3
"""Exact, finite, dependency-free 1729/9271 partition audit."""
from __future__ import annotations
import csv, json, math
from pathlib import Path

OUT=Path(__file__).resolve().parent
CUTS=[(),(1,),(2,),(3,),(1,2),(1,3),(2,3),(1,2,3)]

def factor(n:int)->dict[int,int]:
    if n<1: return {}
    f={}; d=2; m=n
    while d*d<=m:
        while m%d==0: f[d]=f.get(d,0)+1; m//=d
        d=3 if d==2 else d+2
    if m>1: f[m]=f.get(m,0)+1
    return f

def factors_text(f:dict[int,int])->str:
    if not f:return "1"
    return " * ".join(str(p) if e==1 else f"{p}^{e}" for p,e in f.items())

def mobius(f:dict[int,int],n:int)->int:
    if n==1:return 1
    if any(e>1 for e in f.values()):return 0
    return -1 if len(f)%2 else 1

def phi(f:dict[int,int],n:int)->int:
    out=n
    for p in f:out=out//p*(p-1)
    return out

def number_info(text:str)->dict:
    n=int(text); f=factor(n)
    is_prime=n>1 and len(f)==1 and next(iter(f.values()))==1
    is_composite=n>1 and not is_prime
    coeff=math.prod(p**(e//2) for p,e in f.items())
    squarefree_part=math.prod(p for p,e in f.items() if e%2)
    rad=math.prod(f) if f else 1
    exponents=list(f.values())
    pp_exp=0 if n<=1 else math.gcd(*exponents)
    nontrivial_pp=pp_exp>1
    pp_base=math.prod(p**(e//pp_exp) for p,e in f.items()) if nontrivial_pp else ""
    classes=[]
    if n==0:classes.append("ZERO")
    elif n==1:classes.append("UNIT")
    elif is_prime:classes.append("PRIME")
    else:classes.append("COMPOSITE")
    if nontrivial_pp:classes.append("PERFECT_POWER")
    if all(e%2==0 for e in f.values()):classes.append("PERFECT_SQUARE")
    if all(e==1 for e in f.values()):classes.append("SQUAREFREE")
    if any(e>1 for e in f.values()):classes.append("HAS_SQUARED_PRIME_FACTOR")
    radical=str(coeff) if squarefree_part==1 else f"sqrt({squarefree_part})" if coeff==1 else f"{coeff}*sqrt({squarefree_part})"
    return {"segment_string":text,"integer_value":n,"digit_length":len(text),"factorization":factors_text(f),"is_prime":is_prime,"is_composite":is_composite,"mobius":mobius(f,n),"mobius_class":mobius(f,n),"euler_phi":phi(f,n),"integer_sqrt_floor":math.isqrt(n),"perfect_square":math.isqrt(n)**2==n,"squarefree":all(e==1 for e in f.values()),"rad_n_distinct_prime_product":rad,"squarefree_kernel_odd_exponent":squarefree_part,"maximal_square_factor":coeff*coeff,"radical_coefficient":coeff,"simplified_radical":radical,"nontrivial_square_extraction":coeff>1,"nontrivial_perfect_power":nontrivial_pp,"perfect_power_base":pp_base,"perfect_power_exponent":pp_exp,"trivial_unit_power":n==1,"classes":";".join(classes)}

def partition(s:str,cuts:tuple[int,...])->list[str]:
    points=(0,)+cuts+(len(s),)
    return [s[points[i]:points[i+1]] for i in range(len(points)-1)]

def alternating(values:list[str])->bool:
    return len(values)>=2 and all(v in {"PRIME","COMPOSITE"} for v in values) and all(values[i]!=values[i+1] for i in range(len(values)-1))

def mobius_alternating(values:list[int])->bool:
    return len(values)>=2 and all(v in {-1,1} for v in values) and all(values[i]==-values[i+1] for i in range(len(values)-1))

def main()->None:
    partition_rows=[]; segment_rows=[]
    for source_id,s in (("A","1729"),("B","9271")):
        for idx,cuts in enumerate(CUTS):
            segs=partition(s,cuts); infos=[number_info(x) for x in segs]
            primary=["UNIT" if i["integer_value"]==1 else "PRIME" if i["is_prime"] else "COMPOSITE" for i in infos]
            mus=[i["mobius"] for i in infos]
            vals=[i["integer_value"] for i in infos]
            props={
                "all_segments_prime":all(i["is_prime"] for i in infos),
                "exactly_one_composite_segment":sum(i["is_composite"] for i in infos)==1,
                "prime_plus_composite":len(infos)==2 and sorted(primary)==["COMPOSITE","PRIME"],
                "all_nonunit_segments_perfect_powers":any(i["integer_value"]!=1 for i in infos) and all(i["integer_value"]==1 or i["nontrivial_perfect_power"] for i in infos),
                "alternating_prime_composite":alternating(primary),
                "contains_nontrivial_radical_extraction":any(i["nontrivial_square_extraction"] for i in infos),
                "contains_exactly_one_nontrivial_square_factor":sum(i["nontrivial_square_extraction"] for i in infos)==1,
                "all_segments_squarefree":all(i["squarefree"] for i in infos),
                "segment_mobius_values_alternate_sign":mobius_alternating(mus),
                "product_segments_equals_original":math.prod(vals)==int(s),
                "sum_segments_equals_original":sum(vals)==int(s),
                "concatenation_reconstructs_original":''.join(segs)==s,
            }
            pid=f"{source_id}{idx}"
            partition_rows.append({"partition_id":pid,"source_string":s,"cuts":";".join(map(str,cuts)) or "NONE","partition":" | ".join(segs),"segment_count":len(segs),**props})
            for pos,info in enumerate(infos,1):
                segment_rows.append({"source_string":s,"partition_id":pid,"partition":" | ".join(segs),"position":pos,**info})
    assert len(partition_rows)==16 and len({(r["source_string"],r["partition"]) for r in partition_rows})==16
    expected_a=["1729","1 | 729","17 | 29","172 | 9","1 | 7 | 29","1 | 72 | 9","17 | 2 | 9","1 | 7 | 2 | 9"]
    expected_b=["9271","9 | 271","92 | 71","927 | 1","9 | 2 | 71","9 | 27 | 1","92 | 7 | 1","9 | 2 | 7 | 1"]
    assert [r["partition"] for r in partition_rows[:8]]==expected_a
    assert [r["partition"] for r in partition_rows[8:]]==expected_b
    with (OUT/"02_PARTITION_ENUMERATION.csv").open("w",encoding="utf-8",newline="") as h:
        w=csv.DictWriter(h,fieldnames=list(partition_rows[0]));w.writeheader();w.writerows(partition_rows)
    with (OUT/"03_SEGMENT_NUMBER_THEORY.csv").open("w",encoding="utf-8",newline="") as h:
        w=csv.DictWriter(h,fieldnames=list(segment_rows[0]));w.writeheader();w.writerows(segment_rows)
    properties=list(props)
    result={"partition_convention":"three independent internal base-10 cut positions; ordered cut sets NONE,1,2,3,1+2,1+3,2+3,1+2+3","prime_plus_composite_convention":"exactly two segments, one PRIME and one COMPOSITE, either order","alternation_convention":"at least two segments; ZERO and UNIT fail; adjacent PRIME/COMPOSITE or mu +/-1 must differ","all_nonunit_perfect_powers_convention":"at least one non-unit and every non-unit is a nontrivial perfect power","counts":{p:sum(bool(r[p]) for r in partition_rows) for p in properties},"matching_partitions":{p:[r["partition_id"] for r in partition_rows if r[p]] for p in properties},"named_partitions":{"A1_17_29":"A2","A2_1_72_9":"A5","B1_92_71":"B2","B2_9_27_1":"B5"}}
    (OUT/"09_PROPERTY_UNIQUENESS_COUNTS.json").write_text(json.dumps(result,indent=2,sort_keys=True)+"\n",encoding="utf-8")
    # Exhaustive positive-cube search: a<=b and a^3+b^3=n implies b<=floor(cuberoot(n)).
    cube_results={}
    for n in (1729,9271):
        bound=0
        while (bound+1)**3<=n:bound+=1
        reps=[(a,b) for a in range(1,bound+1) for b in range(a,bound+1) if a**3+b**3==n]
        cube_results[str(n)]={"search":"1 <= a <= b <= floor(cuberoot(n))","bound":bound,"representations":reps}
    (OUT/"CUBE_SUM_SEARCH.json").write_text(json.dumps(cube_results,indent=2,sort_keys=True)+"\n",encoding="utf-8")

if __name__=="__main__":main()
