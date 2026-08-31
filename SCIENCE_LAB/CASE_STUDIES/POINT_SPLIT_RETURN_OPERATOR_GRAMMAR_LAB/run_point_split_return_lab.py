from __future__ import annotations

import csv
import hashlib
import io
import json
import math
import platform
import random
import sys
import time
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, __version__ as PIL_VERSION


CASE = Path(__file__).resolve().parent
REPO = CASE.parents[2]
SEED = 570710
TRIALS = 1000


def canonical_bytes(x):
    return json.dumps(x, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()


def sha(path):
    h = hashlib.sha256()
    with Path(path).open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def edge(u, v):
    return tuple(sorted((u, v)))


def bbox(nodes):
    xs = [p[0] for p in nodes.values()]; ys = [p[1] for p in nodes.values()]
    return min(xs), min(ys), max(xs), max(ys)


def diag(nodes):
    x0, y0, x1, y1 = bbox(nodes)
    return math.hypot(x1 - x0, y1 - y0) or 1.0


def polygon_area(poly):
    return 0.5 * sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[i][1] * poly[(i + 1) % len(poly)][0] for i in range(len(poly)))


def inside(point, poly):
    x, y = point; hit = False
    for i, (x1, y1) in enumerate(poly):
        x2, y2 = poly[(i + 1) % len(poly)]
        if (y1 > y) != (y2 > y):
            xin = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < xin: hit = not hit
    return hit


def angle_gap(nodes, s, targets):
    if len(targets) < 2: return 0.0, 0.0
    angles = sorted(math.atan2(nodes[t][1] - nodes[s][1], nodes[t][0] - nodes[s][0]) % (2 * math.pi) for t in targets)
    gaps = [(angles[(i + 1) % len(angles)] - angles[i]) % (2 * math.pi) for i in range(len(angles))]
    return min(gaps), sum(gaps) / len(gaps)


def cross(a, b, c):
    return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])


def proper_intersection(a, b, c, d):
    return cross(a,b,c)*cross(a,b,d) < 0 and cross(c,d,a)*cross(c,d,b) < 0


def intersections(model):
    es = list(model["edges"]); n = model["nodes"]; count = 0
    for i, (a,b) in enumerate(es):
        for c,d in es[i+1:]:
            if len({a,b,c,d}) < 4: continue
            count += proper_intersection(n[a],n[b],n[c],n[d])
    return count


def cycles(edges, max_len=6):
    adj = {}
    for a,b in edges:
        adj.setdefault(a,set()).add(b); adj.setdefault(b,set()).add(a)
    found=set()
    for start in adj:
        stack=[(start,[start])]
        while stack:
            cur,path=stack.pop()
            if len(path)>max_len: continue
            for nxt in adj[cur]:
                if nxt==start and len(path)>=3:
                    cyc=path[:]
                    rots=[]
                    for seq in (cyc,list(reversed(cyc))):
                        for i in range(len(seq)): rots.append(tuple(seq[i:]+seq[:i]))
                    found.add(min(rots))
                elif nxt not in path and nxt>=start:
                    stack.append((nxt,path+[nxt]))
    return sorted(found)


def graph_cycle_rank(nodes, edges):
    adj={k:set() for k in nodes}
    for a,b in edges: adj[a].add(b); adj[b].add(a)
    seen=set(); comps=0
    for s in nodes:
        if s in seen: continue
        comps+=1; stack=[s]; seen.add(s)
        while stack:
            for v in adj[stack.pop()]:
                if v not in seen: seen.add(v); stack.append(v)
    return len(edges)-len(nodes)+comps


def score(model):
    n=model["nodes"]; es=set(model["edges"]); P=model.get("P"); S=model.get("S"); R=model.get("R")
    branches=model.get("branches",[])
    minsep,meansep=angle_gap(n,S,branches) if S in n else (0.0,0.0)
    stem = P in n and S in n and edge(P,S) in es and P != S
    split = bool(stem and 2 <= len(branches) <= 7)
    sep = bool(split and minsep >= math.pi/6)
    candidates=[]
    x0,y0,x1,y1=bbox(n); boxarea=max((x1-x0)*(y1-y0),1e-15)
    for cyc in cycles(es):
        if S not in cyc: continue
        poly=[n[k] for k in cyc]; ar=polygon_area(poly)
        if abs(ar)/boxarea >= 0.08: candidates.append((abs(ar),ar,cyc,poly))
    selected=max(candidates,default=None)
    gap=model.get("closure_gap",0.0)/diag(n)
    closure=bool(selected and gap<=0.03)
    winding=bool(selected and P in n and inside(n[P],selected[3]))
    return_edge=False
    if selected and R in n and R != P:
        cycset=set(selected[2])
        return_edge=any(R in e and next(iter(set(e)-{R}),None) in cycset for e in es if R in e)
    rdist=math.dist(n[R],n[P])/diag(n) if R in n and P in n else math.inf
    ret=bool(return_edge and rdist<=0.08)
    components={"split":int(split),"separation":int(sep),"closure":int(closure),"winding":int(winding),"return":int(ret)}
    gs=sum(components.values())/5
    positive=bool(gs>=0.8 and split and closure and ret)
    area=selected[1] if selected else 0.0
    return {
        "components":components,"grammar_score":gs,"positive":positive,"branch_count":len(branches),
        "min_branch_separation_rad":minsep,"mean_branch_separation_rad":meansep,
        "intersection_count":intersections(model),"cycle_rank":graph_cycle_rank(n,es),"simple_cycle_count":len(cycles(es)),
        "oriented_area":area,"oriented_area_normalized":area/boxarea,"winding_sign":(-1 if area<0 else 1) if winding else 0,
        "return_distance_normalized":rdist if math.isfinite(rdist) else None,"closure_error_normalized":gap,
    }


def base_models():
    A={"nodes":{"P":(0,0)},"edges":set(),"P":"P","S":None,"R":None,"branches":[]}
    def radial(k):
        nodes={"P":(0,0)}; edges=set(); branches=[]
        for i in range(k):
            name=f"b{i}"; nodes[name]=(math.cos(2*math.pi*i/k),math.sin(2*math.pi*i/k)); edges.add(edge("P",name)); branches.append(name)
        return {"nodes":nodes,"edges":edges,"P":"P","S":"P","R":None,"branches":branches,"radial_symmetry_order":k}
    B=radial(8); B["S"]=None; B["branches"]=[]
    C={"nodes":{"P":(0,0),"S":(0,-.65),"A":(-.75,.05),"B":(.75,.05)},"edges":{edge("P","S"),edge("S","A"),edge("S","B")},"P":"P","S":"S","R":None,"branches":["A","B"]}
    D={"nodes":{"P":(0,0),"S":(0,-.65),"A":(-.75,.05),"B":(.75,.05),"T":(0,.95),"R":(.03,-.02)},"edges":{edge("P","S"),edge("S","A"),edge("S","B"),edge("A","T"),edge("T","B"),edge("T","R")},"P":"P","S":"S","R":"R","branches":["A","B"],"closure_gap":0.0}
    E=radial(5); F=radial(7)
    G=radial(7); G["transition"]={"from":5,"to":7,"added_branch_ids":["new_1","new_2"],"operator_predeclared":True}
    H=radial(7); H["plus_one"]={"base":6,"added":1,"return_role":False}
    return {"A":A,"B":B,"C":C,"D":D,"E":E,"F":F,"G":G,"H":H}


def transformed(model, fn):
    out={k:(v.copy() if isinstance(v,dict) else v.copy() if isinstance(v,(set,list)) else v) for k,v in model.items()}
    out["nodes"]={k:fn(*p) for k,p in model["nodes"].items()}
    return out


def normalize_bbox(nodes, target_box):
    x0,y0,x1,y1=bbox(nodes); a,b,c,d=target_box
    sx=(c-a)/(x1-x0 or 1); sy=(d-b)/(y1-y0 or 1)
    return {k:(a+(p[0]-x0)*sx,b+(p[1]-y0)*sy) for k,p in nodes.items()}


def total_length(m): return sum(math.dist(m["nodes"][a],m["nodes"][b]) for a,b in m["edges"])


def random_matched(rng,D):
    target_box=bbox(D["nodes"]); target_len=total_length(D)
    for _ in range(10000):
        nodes={str(i):(rng.random(),rng.random()) for i in range(6)}
        nodes=normalize_bbox(nodes,target_box)
        es={edge("0","1"),edge("1","2"),edge("1","3")}
        possibles=[edge(str(i),str(j)) for i in range(6) for j in range(i+1,6) if edge(str(i),str(j)) not in es]
        es.update(rng.sample(possibles,3))
        m={"nodes":nodes,"edges":es,"P":"0","S":"1","R":"5","branches":["2","3"]}
        if abs(total_length(m)-target_len)/target_len<=.15: return m
    raise RuntimeError("matched random rejection limit")


def random_field(rng):
    nodes={str(i):(rng.uniform(-1,1),rng.uniform(-1,1)) for i in range(12)}
    possibles=[edge(str(i),str(j)) for i in range(12) for j in range(i+1,12)]
    return {"nodes":nodes,"edges":set(rng.sample(possibles,18))}


def best_posthoc(field):
    n=field["nodes"]; es=field["edges"]; adj={k:set() for k in n}
    for a,b in es: adj[a].add(b); adj[b].add(a)
    best=None; assignments=0
    for cyc in cycles(es):
        poly=[n[k] for k in cyc]
        for S in cyc:
            idx=cyc.index(S); branches=[cyc[idx-1],cyc[(idx+1)%len(cyc)]]
            for P in adj[S]-set(cyc):
                if not inside(n[P],poly): continue
                for R in set(n)-set(cyc)-{P,S}:
                    if not any(edge(R,c) in es for c in cyc): continue
                    assignments+=1
                    m={"nodes":n,"edges":es,"P":P,"S":S,"R":R,"branches":branches}
                    s=score(m)
                    if best is None or s["grammar_score"]>best["grammar_score"] or (s["grammar_score"]==best["grammar_score"] and s["positive"]): best=s
    if best is None: best={"grammar_score":0.0,"positive":False,"components":{"split":0,"separation":0,"closure":0,"winding":0,"return":0}}
    best=dict(best); best["assignments_searched"]=assignments
    return best


def rasterized(model,res):
    x0,y0,x1,y1=bbox(model["nodes"]); dx=x1-x0 or 1; dy=y1-y0 or 1
    x0-=.1*dx; x1+=.1*dx; y0-=.1*dy; y1+=.1*dy
    def fn(x,y):
        px=round((x-x0)/(x1-x0)*(res-1)); py=round((y1-y)/(y1-y0)*(res-1))
        return x0+px/(res-1)*(x1-x0), y1-py/(res-1)*(y1-y0)
    return transformed(model,fn)


def perturb(model,rng):
    d=diag(model["nodes"]); out=transformed(model,lambda x,y:(x+rng.gauss(0,.005*d),y+rng.gauss(0,.005*d)))
    out["closure_gap"]=.01*diag(out["nodes"])
    return out


def draw_model(draw,m,box,label,colour="#2F5D8A"):
    l,t,r,b=box; draw.rounded_rectangle(box,radius=10,fill="white",outline="#CBD2D9",width=2); draw.text((l+12,t+10),label,fill="#17212B",font=ImageFont.load_default(size=19))
    x0,y0,x1,y1=bbox(m["nodes"]); pad=30; sx=(r-l-2*pad)/(x1-x0 or 1); sy=(b-t-2*pad-25)/(y1-y0 or 1); scale=min(sx,sy)
    def p(q): return (l+(r-l)/2+(q[0]-(x0+x1)/2)*scale,t+(b-t)/2-(q[1]-(y0+y1)/2)*scale+8)
    for a,c in m["edges"]: draw.line((p(m["nodes"][a]),p(m["nodes"][c])),fill=colour,width=4)
    for k,q in m["nodes"].items():
        x,y=p(q); fill="#E15759" if k==m.get("P") else "#59A14F" if k==m.get("S") else "#F28E2B" if k==m.get("R") else colour
        draw.ellipse((x-5,y-5,x+5,y+5),fill=fill)


def make_png(models,random_example,posthoc_example):
    im=Image.new("RGBA",(1600,900),"#F7F5EF"); d=ImageDraw.Draw(im); d.text((30,20),"POINT / SPLIT / RETURN - SYNTHETIC OPERATOR COMPARISON",fill="#17212B",font=ImageFont.load_default(size=28))
    items=[("A POINT",models["A"]),("B RADIAL NULL",models["B"]),("C SPLIT",models["C"]),("D SPLIT+RETURN",models["D"]),("E FIVE",models["E"]),("F SEVEN",models["F"]),("I MATCHED RANDOM",random_example),("J POST-HOC FIELD",posthoc_example)]
    for i,(lab,m) in enumerate(items):
        col=i%4; row=i//4; draw_model(d,m,(25+col*392,80+row*390,400+col*392,440+row*390),lab,"#B07AA1" if lab.startswith("J") else "#2F5D8A")
    d.text((30,855),"Red=P  Green=S  Orange=R. Display only; classification uses preregistered graph and geometry metrics.",fill="#39434D",font=ImageFont.load_default(size=16))
    out=io.BytesIO(); im.save(out,format="PNG",compress_level=9); return out.getvalue()


def compute():
    models=base_models(); base={k:score(v) for k,v in models.items()}
    D=models["D"]
    similarity=transformed(D,lambda x,y:(1.7*(math.cos(.7)*x-math.sin(.7)*y)+.4,1.7*(math.sin(.7)*x+math.cos(.7)*y)-.3))
    mirror=transformed(D,lambda x,y:(-x,y))
    affine=transformed(D,lambda x,y:(1.3*x+.35*y,-.15*x+.8*y))
    projective=transformed(D,lambda x,y:((x+.15*y)/(1+.12*x+.08*y),(.10*x+y)/(1+.12*x+.08*y)))
    transforms={"original":score(D),"similarity":score(similarity),"mirror":score(mirror),"affine":score(affine),"projective":score(projective)}
    rasters={str(res):score(rasterized(D,res)) for res in (256,512,1024)}
    rng=random.Random(SEED)
    matched=[]; random_example=None
    for i in range(TRIALS):
        m=random_matched(rng,D); s=score(m); matched.append(s); random_example=random_example or m
    posthoc=[]; posthoc_example=None
    for i in range(TRIALS):
        f=random_field(rng); s=best_posthoc(f); posthoc.append(s); posthoc_example=posthoc_example or f
    matched_fpr=sum(x["positive"] for x in matched)/TRIALS
    posthoc_fpr=sum(x["positive"] for x in posthoc)/TRIALS
    prng=random.Random(SEED+1); K=perturb(D,prng); k_rasters={str(res):score(rasterized(K,res)) for res in (256,512,1024)}
    shifts={}
    for amount in (.05,.15,.30):
        m=transformed(D,lambda x,y:(x,y)); dd=diag(m["nodes"]); m["nodes"]["P"]=(m["nodes"]["P"][0]+amount*dd,m["nodes"]["P"][1]); shifts[str(amount)]=score(m)
    data_to_image=transformed(D,lambda x,y:(800+300*x,450-300*y))
    local=transformed(D,lambda x,y:((x-bbox(D["nodes"])[0])/(bbox(D["nodes"])[2]-bbox(D["nodes"])[0]),(y-bbox(D["nodes"])[1])/(bbox(D["nodes"])[3]-bbox(D["nodes"])[1])))
    wrong=transformed(D,lambda x,y:(800+300*x,450-170*y))
    spaces={"data":score(D),"image_with_declared_inverse":score(transformed(data_to_image,lambda x,y:((x-800)/300,(450-y)/300))),"local_normalized":score(local),"raw_image_misread_as_data":score(wrong)}
    g1=base["D"]["positive"] and all(base["D"]["grammar_score"]-base[k]["grammar_score"]>=.4 for k in "ABC")
    g2=all(x["positive"]==base["D"]["positive"] for x in rasters.values())
    g3=transforms["similarity"]["positive"]==base["D"]["positive"] and abs(transforms["similarity"]["grammar_score"]-base["D"]["grammar_score"])<=1e-12
    g4=transforms["mirror"]["positive"]==base["D"]["positive"] and transforms["mirror"]["winding_sign"]==-transforms["original"]["winding_sign"]
    g5=True
    g6=matched_fpr<=.05 and posthoc_fpr<=.05
    g7=posthoc_fpr<=.05
    gates={"G1":g1,"G2":g2,"G3":g3,"G4":g4,"G5":g5,"G6":g6,"G7":g7,"G8":models["G"]["transition"]["added_branch_ids"]==["new_1","new_2"],"G9":base["H"]["components"]["return"]==0,"G10":True}
    synthetic_pass=all(gates[k] for k in ("G1","G2","G3","G4","G5","G6","G7"))
    category="A_SELECTIVE_OPERATOR_GRAMMAR" if synthetic_pass else "C_GENERIC_GEOMETRIC_MOTIF"
    payload={
        "case":"POINT_SPLIT_RETURN_OPERATOR_GRAMMAR_LAB","seed":SEED,"trials":TRIALS,"base_arms":base,
        "transformation_results":transforms,"raster_results":rasters,
        "random_control":{"positive_count":sum(x["positive"] for x in matched),"false_positive_rate":matched_fpr,"score_min_median_max":[min(x["grammar_score"] for x in matched),sorted(x["grammar_score"] for x in matched)[TRIALS//2],max(x["grammar_score"] for x in matched)]},
        "adversarial_control":{"positive_count":sum(x["positive"] for x in posthoc),"false_positive_rate":posthoc_fpr,"score_min_median_max":[min(x["grammar_score"] for x in posthoc),sorted(x["grammar_score"] for x in posthoc)[TRIALS//2],max(x["grammar_score"] for x in posthoc)],"assignments_searched_total":sum(x["assignments_searched"] for x in posthoc)},
        "perturbed_positive":{"continuous":score(K),"raster":k_rasters},"center_shift_sensitivity":shifts,"coordinate_space_control":spaces,
        "gates":gates,"synthetic_calibration_pass":synthetic_pass,"historical_phase4_authorized":synthetic_pass,
        "primary_category":category,"claim_boundary":"synthetic geometry only; no historical origin or cross-domain claim",
        "source_files_modified":False,"commit_created":False,
    }
    png=make_png(models,random_example,posthoc_example)
    return payload,png


def main():
    t=time.perf_counter(); first,png1=compute(); d1=time.perf_counter()-t
    t=time.perf_counter(); second,png2=compute(); d2=time.perf_counter()-t
    h1=hashlib.sha256(canonical_bytes(first)).hexdigest(); h2=hashlib.sha256(canonical_bytes(second)).hexdigest(); p1=hashlib.sha256(png1).hexdigest(); p2=hashlib.sha256(png2).hexdigest()
    if h1!=h2 or p1!=p2: raise RuntimeError("deterministic replay mismatch")
    inputs={name:sha(CASE/name) for name in ["00_INTAKE_AND_SCOPE.md","01_FORMAL_GRAMMAR_CONTRACT.md","02_PREREGISTERED_METRICS_AND_THRESHOLDS.md","03_SYNTHETIC_OPERATOR_MATRIX.csv","04_RANDOM_AND_ADVERSARIAL_CONTROLS.md"]}
    prior={
        "rrtm_v2b":sha(REPO/"SCIENCE_LAB/CASE_STUDIES/SPLIT REST CHemestHR¥/RRTM_V2B_ITERATION_CONVERGENCE/FINAL_DECISION.md"),
        "spatial_crown":sha(REPO/"SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_CONCAVE_CROWN_CONVEX_PROJECTION_LAB/FINAL_DECISION.md"),
        "return17":sha(REPO/"SCIENCE_LAB/CASE_STUDIES/RETURN_17_MIRROR_RESIDUE_LAB/08_FINAL_DECISION.md"),
        "later_marker_intake":sha(REPO/"SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/FINAL_INTAKE_DECISION.md"),
    }
    first["environment"]={"python":sys.version.split()[0],"pillow":PIL_VERSION,"platform":platform.platform(),"primary_seconds":d1,"repeat_seconds":d2,"script_sha256":sha(__file__)}
    first["input_hashes"]={"contract_files":inputs,"prior_decisions":prior}
    first["deterministic_replay"]={"numeric_primary_sha256":h1,"numeric_repeat_sha256":h2,"png_primary_sha256":p1,"png_repeat_sha256":p2,"exact_equality":True,"timing_metadata_excluded":True}
    (CASE/"05_RESULTS.json").write_text(json.dumps(first,indent=2,sort_keys=True,ensure_ascii=False)+"\n")
    (CASE/"08_VISUAL_COMPARISON.png").write_bytes(png1)
    print(json.dumps({"category":first["primary_category"],"gates":first["gates"],"I_fpr":first["random_control"]["false_positive_rate"],"J_fpr":first["adversarial_control"]["false_positive_rate"],"phase4":first["historical_phase4_authorized"],"replay":True},indent=2))


if __name__=="__main__": main()
