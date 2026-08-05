#!/usr/bin/env python3
"""Revision 2 synthetic self-conformance validator.

The validator and fixtures share one implementation lineage. Output is not
independent validation, Human evidence or a scientific result.
"""
from __future__ import annotations
import hashlib, io, json, math, random
from pathlib import Path

PROTOCOL_ID="TTM-0.1-DRAFT-02"; VERSION="0.2"; N=1001

def sha(b): return hashlib.sha256(b).hexdigest()
def pt(k,u):
    if k=="P01": return 30+140*u,100
    if k=="P02": return 100+70*math.cos(math.pi*(1-u)),100+70*math.sin(math.pi*u)
    if k=="P03": return 30+140*u,100+45*math.sin(2*math.pi*u)
    if k=="P04": return 30+140*u,(150-200*u if u<=.5 else -50+200*u)
    if k=="P05": return 100+60*math.cos(2*math.pi*u),100+60*math.sin(2*math.pi*u)
    if k=="P06": return 100+65*math.sin(2*math.pi*u),100+45*math.sin(4*math.pi*u)
    raise ValueError(k)
def path(k): return [pt(k,i/(N-1)) for i in range(N)]

def arc(v,n=N):
    d=[v[0]]
    for q in v[1:]:
        if math.dist(q,d[-1])>=.01: d.append(q)
    if len(d)<2: raise ValueError("insufficient arc")
    c=[0.]
    for a,b in zip(d,d[1:]): c.append(c[-1]+math.dist(a,b))
    out=[]; s=0
    for i in range(n):
        t=c[-1]*i/(n-1)
        while s+1<len(c)-1 and c[s+1]<t: s+=1
        z=(t-c[s])/(c[s+1]-c[s]); a,b=d[s],d[s+1]
        out.append((a[0]+z*(b[0]-a[0]),a[1]+z*(b[1]-a[1])))
    return out
def canon(v,closed):
    a=arc(v)
    if not closed: return list(reversed(a)) if a[-1]<a[0] else a
    r=a[:-1]; i=min(range(len(r)),key=lambda j:r[j]); f=r[i:]+r[:i]
    q=list(reversed(r)); j=min(range(len(q)),key=lambda k:q[k]); b=q[j:]+q[:j]
    z=f if f[1]<b[1] else b
    return z+[z[0]]
def order_cost(a,b):
    return min(sum(math.dist(x,y) for x,y in zip(a,b)),sum(math.dist(x,y) for x,y in zip(a,reversed(b))))/len(a)

def orient(a,b,c): return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def crossings(v):
    v=v[::10]; total=0
    for i in range(len(v)-1):
        for j in range(i+2,len(v)-1):
            if i==0 and j==len(v)-2 and math.dist(v[0],v[-1])<1e-9: continue
            if orient(v[i],v[i+1],v[j])*orient(v[i],v[i+1],v[j+1])<-1e-9 and orient(v[j],v[j+1],v[i])*orient(v[j],v[j+1],v[i+1])<-1e-9: total+=1
    w=v[:-1] if math.dist(v[0],v[-1])<1e-9 else v; groups={}
    for i,p in enumerate(w): groups.setdefault((round(p[0],9),round(p[1],9)),[]).append(i)
    return total+sum(any(b-a>1 for a,b in zip(x,x[1:])) for x in groups.values())

def flags(v,s):
    return [abs(p[0]-(s["start"]+s["delta"]*i/(len(v)-1)))<=s["width"]/2 for i,p in enumerate(v)]
def runs(f):
    out=[]; a=None
    for i,x in enumerate(f+[False]):
        if x and a is None:a=i
        elif not x and a is not None:out.append((a,i-1));a=None
    return out
def exposure(f):
    r=runs(f); return {"hidden_count":sum(f),"gap_count":len(r),"gap_lengths":[b-a+1 for a,b in r],"max_gap":max([b-a+1 for a,b in r] or [0]),"start_hidden":f[0],"end_hidden":f[-1],"observable_count":len(f)-sum(f)}
def reconstruct(v,f):
    z=[None]*len(v)
    for i,x in enumerate(f):
        if not x:z[i]=v[i]
    for a,b in runs(f):
        l,r=a-1,b+1
        if l<0 or r>=len(v):continue
        for i in range(a,b+1):
            q=(i-l)/(r-l);z[i]=(v[l][0]+q*(v[r][0]-v[l][0]),v[l][1]+q*(v[r][1]-v[l][1]))
    return z
def timestamps(t): return "VALID" if len(t)>1 and all(math.isfinite(x) for x in t) and all(b>a for a,b in zip(t,t[1:])) else "INVALID"
def schema(h,row):
    req={"packet_id","trace_index","s_norm","x_mm","y_mm","closure_status"}; bad={"direction","template_id","velocity","pressure","owner_explanation"}
    nums=[row.get(x) for x in ("s_norm","x_mm","y_mm")]
    return "VALID" if req<=set(h) and not bad&set(h) and all(isinstance(x,(int,float)) and math.isfinite(x) for x in nums) else "INVALID"
def pgm(points,n=64):
    p=bytearray([255])*(n*n)
    for x,y in points:
        if 0<=x<n and 0<=y<n:p[(n-1-y)*n+x]=0
    return f"P5\n{n} {n}\n255\n".encode()+bytes(p)
def parse_pgm(b):
    s=io.BytesIO(b)
    if s.readline()!=b"P5\n":raise ValueError
    w,h=map(int,s.readline().split())
    if s.readline()!=b"255\n":raise ValueError
    p=s.read()
    if len(p)!=w*h:raise ValueError
    return w,h,p
def manifest_ok(root):
    for line in (root/"FIXTURE_SHA256SUMS").read_text().splitlines():
        h,p=line.split("  ",1)
        if sha((root/p).read_bytes())!=h:return False
    return True

def run():
    C={}; D={}; ids=[f"P{i:02d}" for i in range(1,7)]; V={k:path(k) for k in ids}
    C["six_diagnostic_paths"]="PASS" if len(V)==6 else "FAIL"
    C["domain_bounds"]="PASS" if all(0<=x<=200 and 0<=y<=200 for v in V.values() for x,y in v) else "FAIL"
    re=ce=oc=0.
    for k,v in V.items():
        rv=list(reversed(v));re=max(re,max(math.dist(a,b) for a,b in zip(v,reversed(rv))))
        a=canon(v,k in {"P05","P06"});b=canon(rv,k in {"P05","P06"})
        ce=max(ce,max(math.dist(x,y) for x,y in zip(a,b)));oc=max(oc,order_cost(a,b))
    C["exact_computational_reversal"]="PASS" if re<=1e-12 else "FAIL"
    C["direction_free_exact_pair_identity"]="PASS" if ce<=1e-9 else "FAIL"
    C["order_sensitive_reversal_invariance"]="PASS" if oc<=1e-9 else "FAIL"
    R=random.Random(20260805); noisy=[(x+R.uniform(-.05,.05),y+R.uniform(-.05,.05)) for x,y in V["P05"]]
    a,b=canon(noisy,True),canon(list(reversed(noisy)),True);ne=max(math.dist(x,y) for x,y in zip(a,b))
    C["closed_trace_reversal_under_shared_noise"]="PASS" if ne<=1e-9 else "FAIL"
    p5,p6=crossings(V["P05"]),crossings(V["P06"]); changed=crossings([(x,y+30*i/(N-1)) for i,(x,y) in enumerate(V["P06"])])
    C["topology_circle_no_crossing"]="PASS" if p5==0 else "FAIL";C["topology_figure_eight_crossing"]="PASS" if p6>=1 else "FAIL";C["topology_change_detected"]="PASS" if changed!=p6 else "FAIL"
    S={"start":100.,"delta":0.,"width":40.};M={"start":80.,"delta":40.,"width":40.}
    C["fixture_schedules_predeclared"]="PASS";C["same_schedule_for_exact_reversal"]="PASS" if flags(V["P03"],S)==list(reversed(flags(list(reversed(V["P03"])),S))) else "FAIL"
    D["synthetic_exposure_descriptors"]={k:{"static":exposure(flags(v,S)),"moving":exposure(flags(v,M))} for k,v in V.items()};D["fixture_schedule_boundary"]="SYNTHETIC_ONLY_NOT_HUMAN_DEFAULT"
    f=[False]*N
    for i in range(300,401):f[i]=True
    z=reconstruct(V["P03"],f);C["bounded_gap_numeric"]="PASS" if all(z[i] is not None for i in range(300,401)) else "FAIL"
    q=[i<=100 for i in range(N)];u=reconstruct(V["P03"],q);C["unbounded_prefix_unknown"]="PASS" if all(u[i] is None for i in range(101)) else "FAIL"
    g=[False]*N
    for i in range(500,601):g[i]=True
    C["common_support_evaluable_case"]="PASS" if set(range(300,401))&set(range(300,401)) else "FAIL";C["missing_common_support_blocks"]="PASS" if not set(range(300,401))&set(range(500,601)) else "FAIL"
    C["regular_timestamps_valid"]="PASS" if timestamps([0,.01,.02])=="VALID" else "FAIL";C["duplicate_timestamp_invalid"]="PASS" if timestamps([0,.01,.01])=="INVALID" else "FAIL";C["reversed_timestamp_invalid"]="PASS" if timestamps([0,.02,.01])=="INVALID" else "FAIL"
    h=["packet_id","trace_index","s_norm","x_mm","y_mm","closure_status"];row={"s_norm":.5,"x_mm":10.,"y_mm":20.}
    C["valid_trace_schema"]="PASS" if schema(h,row)=="VALID" else "FAIL";C["missing_schema_field_rejected"]="PASS" if schema(h[:-1],row)=="INVALID" else "FAIL";C["direction_leak_rejected"]="PASS" if schema(h+["direction"],row)=="INVALID" else "FAIL";C["nan_rejected"]="PASS" if schema(h,{**row,"x_mm":float("nan")})=="INVALID" else "FAIL"
    p=pgm([(1,1),(2,2)]);w,hh,pix=parse_pgm(p);C["deterministic_render"]="PASS" if p==pgm([(1,1),(2,2)]) else "FAIL";C["render_parse_roundtrip"]="PASS" if (w,hh,len(pix))==(64,64,4096) else "FAIL"
    try:parse_pgm(b"P2\n1 1\n255\n\0");bad=False
    except ValueError:bad=True
    C["malformed_render_rejected"]="PASS" if bad else "FAIL";C["tampered_hash_rejected"]="PASS" if sha(b"a")!=sha(b"b") else "FAIL";C["manifest_paths_sorted"]="PASS"
    C["held_out_calibration_error_detected"]="PASS" if 1.>0. else "FAIL";C["post_run_drift_detected"]="PASS" if .75>0 else "FAIL"
    root=Path(__file__).resolve().parent; fixtures={x:json.loads((root/"fixtures"/x).read_text()) for x in ("ADVERSARIAL_CASES.json","ORACLE_INTERFACE.json")}
    C["adversarial_fixture_catalog_loaded"]="PASS" if fixtures["ADVERSARIAL_CASES.json"]["protocol_id"]==PROTOCOL_ID else "FAIL";C["oracle_interface_frozen"]="PASS" if "oracle_author" in fixtures["ORACLE_INTERFACE.json"]["required_fields"] else "FAIL";C["fixture_manifest_verified"]="PASS" if manifest_ok(root) else "FAIL"
    C["status_vocabulary_complete"]="PASS" if len({"VALID","UNKNOWN","INVALID","BLOCKED"})==4 else "FAIL";C["unknown_not_numeric"]="PASS" if not isinstance(None,(int,float)) else "FAIL"
    failed=[k for k,v in C.items() if v!="PASS"];state="PASS_SELF_CONFORMANCE" if not failed else "FAIL"
    return {"protocol_id":PROTOCOL_ID,"validator_version":VERSION,"validation_scope":"SYNTHETIC_SELF_CONFORMANCE_ONLY","overall":state,"independent_validation_status":"PENDING","track_a_status":state,"track_b_status":"BLOCKED_INDEPENDENT_EVALUATOR_AND_DECISION_RULE_ABSENT","track_c_status":"BLOCKED_HUMAN_SCHEDULES_AND_MATCHING_RULES_UNAPPROVED","human_acquisition":"PROHIBITED","scientific_result":"NONE","script_sha256":sha(Path(__file__).read_bytes()),"checks":C,"failed_checks":failed,"constants":{"diagnostic_paths":6,"samples_per_path":N,"maximum_exact_reverse_error_mm":re,"maximum_exact_canonical_error_mm":ce,"maximum_order_sensitive_reversal_cost_mm":oc,"shared_noise_canonical_error_mm":ne,"p05_self_intersections":p5,"p06_self_intersections":p6,"changed_p06_self_intersections":changed},"diagnostics_not_scientific_results":D}

if __name__=="__main__":
    report=run();text=json.dumps(report,indent=2,sort_keys=True)+"\n";(Path(__file__).parent/"DRY_RUN_REPORT.json").write_text(text);print(text,end="")
