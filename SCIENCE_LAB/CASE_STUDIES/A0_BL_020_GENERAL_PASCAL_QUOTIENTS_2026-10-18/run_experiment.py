#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def raw_nodes(m,d):
    return [(f,n,k) for f in range(m) for n in range(d+1) for k in range(n+1)]

def canon_cyclic(x,m):
    f,n,k=x
    if n==0: return ("apex",)
    if k==0: return ("seam",n,(f-1)%m)
    if k==n: return ("seam",n,f)
    return ("interior",f,n,k)

def canon_open(x,m):
    f,n,k=x
    if n==0: return ("apex",)
    if k==0: return ("side",n,f)
    if k==n: return ("side",n,f+1)
    return ("interior",f,n,k)

def raw_edges(m,d):
    for f in range(m):
        for n in range(d):
            for k in range(n+1):
                yield (f,n,k),(f,n+1,k)
                yield (f,n,k),(f,n+1,k+1)

def weight(node):
    if node==("apex",) or node[0] in {"seam","side"}: return 1
    return math.comb(node[2],node[3])

def rotate(node,t,m):
    if node==("apex",): return node
    if node[0]=="seam": return ("seam",node[1],(node[2]+t)%m)
    return ("interior",(node[1]+t)%m,node[2],node[3])

def mirror(node,m):
    if node==("apex",): return node
    if node[0]=="seam": return ("seam",node[1],(-node[2]-1)%m)
    _,f,n,k=node
    return canon_cyclic(((-f)%m,n,n-k),m)

def instance(m,d):
    raw=raw_nodes(m,d)
    cn={canon_cyclic(x,m) for x in raw}
    ce={(canon_cyclic(a,m),canon_cyclic(b,m)) for a,b in raw_edges(m,d)}
    on={canon_open(x,m) for x in raw}
    oe={(canon_open(a,m),canon_open(b,m)) for a,b in raw_edges(m,d)}
    classes={}
    for x in raw:
        classes.setdefault(canon_cyclic(x,m),set()).add(math.comb(x[1],x[2]))
    weights_ok=all(len(v)==1 for v in classes.values()) and all(weight(n)==next(iter(classes[n])) for n in cn)
    action_ok=True
    for t in range(m):
        for reflected in (False,True):
            act=lambda n: mirror(rotate(n,t,m),m) if reflected else rotate(n,t,m)
            if {act(n) for n in cn}!=cn or {(act(a),act(b)) for a,b in ce}!=ce:
                action_ok=False
    nc=1+m*d*(d+1)//2; ec=m*d*d
    return {"m":m,"d":d,"cyclic_nodes":len(cn),"cyclic_edges":len(ce),
            "open_nodes":len(on),"open_edges":len(oe),
            "predicted_cyclic_nodes":nc,"predicted_cyclic_edges":ec,
            "predicted_open_nodes":nc+d,"predicted_open_edges":ec+d,
            "weight_classes_compatible":weights_ok,"dihedral_action_preserved":action_ok}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--mode",choices=["primary","replay"],required=True)
    ap.add_argument("--output",required=True); args=ap.parse_args()
    protocol=json.loads((ROOT/"FROZEN_PROTOCOL.json").read_text())
    rows=[instance(m,d) for m in protocol["audit_m"] for d in protocol["audit_d"]]
    by={(r["m"],r["d"]):r for r in rows}
    anchor=by[(5,6)]
    gates={
      "G1_SCC003_ANCHOR": anchor["cyclic_nodes"]==106 and anchor["cyclic_edges"]==180,
      "G2_CYCLIC_NODE_FORMULA": all(r["cyclic_nodes"]==r["predicted_cyclic_nodes"] for r in rows),
      "G3_CYCLIC_EDGE_FORMULA": all(r["cyclic_edges"]==r["predicted_cyclic_edges"] for r in rows),
      "G4_OPEN_CONTROL_DISTINCT": all(r["open_nodes"]==r["predicted_open_nodes"] and r["open_edges"]==r["predicted_open_edges"] and r["open_nodes"]-r["cyclic_nodes"]==r["d"] for r in rows),
      "G5_WEIGHT_COMPATIBILITY": all(r["weight_classes_compatible"] for r in rows),
      "G6_DIHEDRAL_ACTION": all(r["dihedral_action_preserved"] for r in rows),
      "G7_PRIMARY_SEPARATION": [by[(m,6)]["cyclic_nodes"] for m in protocol["primary_m"]]==protocol["expected_primary_cyclic_nodes"] and [by[(m,6)]["open_nodes"] for m in protocol["primary_m"]]==protocol["expected_primary_open_nodes"]
    }
    decision=protocol["decision_pass"] if all(gates.values()) else "COUNTEREXAMPLE_FOUND"
    result={"study_id":protocol["study_id"],"protocol":protocol,"decision":decision,"gates":gates,
            "primary_table":[by[(m,6)] for m in protocol["primary_m"]],"audit_instances":rows,
            "boundary":protocol["boundary"],"claim_ceiling":"DECLARED_STATIC_COMBINATORIAL_CONSTRUCTION_ONLY"}
    result["registered_result_sha256"]=hashlib.sha256(json.dumps(result,sort_keys=True,separators=(",",":")).encode()).hexdigest()
    Path(args.output).write_text(json.dumps(result,indent=2,sort_keys=True)+"\n")
    print(f"{args.mode}: {decision}; gates {sum(gates.values())}/{len(gates)}")

if __name__=="__main__": raise SystemExit(main())
