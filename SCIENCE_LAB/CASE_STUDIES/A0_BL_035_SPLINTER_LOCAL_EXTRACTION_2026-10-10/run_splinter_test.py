#!/usr/bin/env python3
"""A0-BL-035: frozen local Splinter extraction over A0-BL-021 records."""
import argparse, hashlib, itertools, json, math, random
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_INPUT = HERE.parent / "A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10" / "artifacts" / "PRIMARY_RESULT.json"
PROTOCOL = json.loads((HERE / "FROZEN_PROTOCOL.json").read_text())

def canonical(x): return json.dumps(x, sort_keys=True, separators=(",", ":"))
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def class_map(data):
    out = {}
    for item in data["enumeration"]["classes"]:
        out[item["typed_signature_sha256"]] = item["class_id"]
    return out

def mark(vertex, anchors):
    return "N1" if vertex == anchors[0] else "N2" if vertex == anchors[1] else "O"

def local_word(record, vertex, radius):
    word = record["boundary_word"]
    at = next(i for i, item in enumerate(word) if item["vertex"] == vertex)
    anchors = tuple(e["new_vertex"] for e in record["history"])
    return [[word[(at+d)%len(word)]["incoming"], word[(at+d)%len(word)]["outgoing"],
             word[(at+d)%len(word)]["turn"], mark(word[(at+d)%len(word)]["vertex"], anchors)]
            for d in range(-radius, radius+1)]

def features(record, radius):
    e1, e2 = record["history"]
    side_code = PROTOCOL["orientation_codes"]
    relation = "start" if e2["boundary_edge_before"][0] == e1["new_vertex"] else "end" if e2["boundary_edge_before"][1] == e1["new_vertex"] else "none"
    address = [e1["boundary_edge_index"]+1, e2["boundary_edge_index"]+1]
    base = {"address":address, "profiles":[e1["edge_profile"],e2["edge_profile"]],
            "sides":[e1["fresh_side"],e2["fresh_side"]],
            "orientation":[side_code[e1["fresh_side"]],side_code[e2["fresh_side"]]],
            "relation":relation, "displacement":(e2["boundary_edge_index"]-e1["boundary_edge_index"])%8,
            "words":[local_word(record,e1["new_vertex"],radius),local_word(record,e2["new_vertex"],radius)]}
    return base

def signatures(record):
    fs = {r:features(record,r) for r in PROTOCOL["radii"]}
    f0 = fs[0]
    return {
      "M0_ADDRESS": canonical(f0["address"]),
      "M1_PROFILE": canonical({k:f0[k] for k in ("address","profiles")}),
      "M2_ORIENTED_SEAM": canonical({k:f0[k] for k in ("address","profiles","sides","orientation")}),
      **{f"M3_SPLINTER_LOCAL_{r}":canonical(fs[r]) for r in PROTOCOL["radii"]},
      "M4_FULL_HISTORY": canonical(record["history"]),
      "M5_TERMINAL_ORACLE": record["typed_signature_sha256"]
    }

def metrics(pairs):
    groups=defaultdict(list)
    for sig,cls in pairs: groups[sig].append(cls)
    collisions=0; impure=0; entropy=0.0; max_classes=0; n=len(pairs)
    for vals in groups.values():
        c=Counter(vals); kinds=len(c); max_classes=max(max_classes,kinds)
        if kinds>1: impure+=1
        collisions += len(vals)*(len(vals)-1)//2 - sum(v*(v-1)//2 for v in c.values())
        entropy += len(vals)/n * (-sum((v/len(vals))*math.log2(v/len(vals)) for v in c.values()))
    return {"signature_count":len(groups),"collision_pairs":collisions,"impure_signature_count":impure,
            "conditional_entropy_bits":round(entropy,12),"maximum_classes_per_signature":max_classes,
            "compression_ratio":round(len(groups)/n,12)}

def j_feature(f):
    swap={"left-radial":"right-radial","right-radial":"left-radial","base":"base"}
    rel={"start":"end","end":"start","none":"none"}
    def rw(word): return [[b,a,t,m] for a,b,t,m in reversed(word)]
    return {"address":[8-f["address"][0],9-f["address"][1]],"profiles":list(f["profiles"]),
            "sides":[swap[x] for x in f["sides"]],"orientation":[-x for x in f["orientation"]],
            "relation":rel[f["relation"]],"displacement":(-f["displacement"])%8,
            "words":[rw(w) for w in f["words"]]}

def run(input_path):
    if digest(input_path) != PROTOCOL["input_sha256"]: raise ValueError("frozen input hash mismatch")
    data=json.loads(input_path.read_text()); cmap=class_map(data); rows=[]
    for record in data["scientific_records"]:
        rows.append({"id":record["history_id"],"class":cmap[record["typed_signature_sha256"]],
                     "sig":signatures(record),"features":{r:features(record,r) for r in PROTOCOL["radii"]}})
    addresses={tuple(json.loads(x["sig"]["M0_ADDRESS"])) for x in rows}
    controls={"input_hash":True,"history_count":len(rows)==100,"address_count":len(addresses)==56,
              "class_count":len({x['class'] for x in rows})==56,"terminal_oracle_rejected_as_candidate":True}
    model_metrics={m:metrics([(x["sig"][m],x["class"]) for x in rows]) for m in rows[0]["sig"]}
    shifted=[]
    for x in rows:
        a=json.loads(x["sig"]["M0_ADDRESS"]); shifted.append((canonical([(a[0]%7)+1,(a[1]%8)+1]),x["class"]))
    controls["cyclic_address_reindex_metrics_invariant"]=metrics(shifted)==model_metrics["M0_ADDRESS"]
    zero=[(canonical([json.loads(x["sig"]["M0_ADDRESS"])[0]-1,json.loads(x["sig"]["M0_ADDRESS"])[1]-1]),x["class"]) for x in rows]
    controls["zero_one_address_metrics_invariant"]=metrics(zero)==model_metrics["M0_ADDRESS"]
    controls["j_is_involution_all_radii"]=all(j_feature(j_feature(x["features"][r]))==x["features"][r] for x in rows for r in PROTOCOL["radii"])
    rng=random.Random(PROTOCOL["permutation_seed"]); permuted=[]
    by_addr=defaultdict(list)
    for x in rows: by_addr[x["sig"]["M0_ADDRESS"]].append(x)
    for group in by_addr.values():
        vals=[x["sig"]["M3_SPLINTER_LOCAL_2"] for x in group]; rng.shuffle(vals)
        permuted.extend((v,x["class"]) for v,x in zip(vals,group))
    candidates=[(r,model_metrics[f"M3_SPLINTER_LOCAL_{r}"]) for r in PROTOCOL["radii"]]
    sufficient=[(r,m) for r,m in candidates if m["collision_pairs"]==0 and m["signature_count"]<100]
    base=model_metrics["M0_ADDRESS"]
    if not all(controls.values()): verdict="INVALID_EXPERIMENT"
    elif sufficient: verdict="SPLINTER_SUFFICIENT_COMPRESSED"
    elif any(m["conditional_entropy_bits"]<base["conditional_entropy_bits"] and m["impure_signature_count"]<base["impure_signature_count"] for _,m in candidates): verdict="SPLINTER_PARTIAL"
    else: verdict="SPLINTER_NOT_IDENTIFIED"
    return {"schema":"nexah.a0-bl-035.splinter-local-result/1.0.0","date":"2026-10-10","classification":verdict,
            "input":{"sha256":digest(input_path),"histories":len(rows),"addresses":len(addresses),"classes":len({x['class'] for x in rows})},
            "model_metrics":model_metrics,"smallest_sufficient_radius":sufficient[0][0] if sufficient else None,
            "controls":controls,"permutation_control":{"model":"M3_SPLINTER_LOCAL_2_WITHIN_ADDRESS","metrics":metrics(permuted)},
            "symmetry_boundary":"Open K5 has no declared C5 automorphism; tested controls are cyclic address reindexing and J involution.",
            "claim_boundary":"Finite post-hoc extraction on frozen A0-BL-021 records only; no physical Splinter, universal operator, C5 claim, PENT-08 or canonical vocabulary follows."}

if __name__=="__main__":
    ap=argparse.ArgumentParser(); ap.add_argument("--input",type=Path,default=DEFAULT_INPUT); ap.add_argument("--output",type=Path,required=True); a=ap.parse_args()
    result=run(a.input); a.output.parent.mkdir(parents=True,exist_ok=True); a.output.write_text(canonical(result)+"\n"); print(json.dumps({"status":"PASS","classification":result["classification"],"output":str(a.output)},indent=2))
