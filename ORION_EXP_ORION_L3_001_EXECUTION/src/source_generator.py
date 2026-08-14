#!/usr/bin/env python3
"""Stage 1: locked Lorenz source only; no representation or expected classes."""
import argparse,csv,hashlib,json,math
from pathlib import Path

def load(p):
    with open(p,encoding="utf-8") as f:return json.load(f)
def fn(v):return format(v,".17g")
def write_csv(p,fields,rows):
    with open(p,"w",encoding="utf-8",newline="") as f:w=csv.DictWriter(f,fieldnames=fields,lineterminator="\n");w.writeheader();w.writerows(rows)
def source_step(s,h,sig,rho,beta):
    def f(p):x,y,z=p;return sig*(y-x),x*(rho-z)-y,x*y-beta*z
    def add(a,b,q):return tuple(a[i]+q*b[i] for i in range(3))
    k1=f(s);k2=f(add(s,k1,h/2));k3=f(add(s,k2,h/2));k4=f(add(s,k3,h))
    return tuple(s[i]+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6 for i in range(3))
def generic_reference(initial,h,steps,sig,rho,beta):
    def rhs(v):return (sig*(v[1]-v[0]),v[0]*(rho-v[2])-v[1],v[0]*v[1]-beta*v[2])
    vals=[tuple(initial)]
    for _ in range(steps):
        v=vals[-1];k1=rhs(v);q2=tuple(v[i]+h*k1[i]/2 for i in range(3));k2=rhs(q2);q3=tuple(v[i]+h*k2[i]/2 for i in range(3));k3=rhs(q3);q4=tuple(v[i]+h*k3[i] for i in range(3));k4=rhs(q4);vals.append(tuple(v[i]+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6 for i in range(3)))
    return vals
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--config",required=True);ap.add_argument("--out",required=True);a=ap.parse_args();cfg=load(a.config);out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=False)
    sig,rho,beta=cfg["sigma"],cfg["rho"],cfg["beta"];h=cfg["h"]
    vals=[tuple(cfg["initial"])]
    for _ in range(cfg["steps"]):vals.append(source_step(vals[-1],h,sig,rho,beta))
    rows=[]
    for i in range(0,cfg["steps"]+1,cfg["save_stride"]):
        x,y,z=vals[i];d=(sig*(y-x),x*(rho-z)-y,x*y-beta*z);rows.append({"source_id":"L63-SRC-001","step":i,"t":fn(i*h),"x":fn(x),"y":fn(y),"z":fn(z),"dx_dt":fn(d[0]),"dy_dt":fn(d[1]),"dz_dt":fn(d[2]),"finite":str(all(math.isfinite(q) for q in (x,y,z))).lower()})
    write_csv(out/"source_trajectory.csv",["source_id","step","t","x","y","z","dx_dt","dy_dt","dz_dt","finite"],rows)
    ref=generic_reference(cfg["initial"],cfg["reference_h"],int(2/cfg["reference_h"]),sig,rho,beta);stride=int(.01/cfg["reference_h"]);rr=[]
    for i in range(0,len(ref),stride):
        x,y,z=ref[i];rr.append({"source_id":"L63-SRC-001","reference_step":i,"t":fn(i*cfg["reference_h"]),"x":fn(x),"y":fn(y),"z":fn(z),"matched_saved_index":i//stride})
    write_csv(out/"source_reference.csv",["source_id","reference_step","t","x","y","z","matched_saved_index"],rr)
    record={"stage":"source_generator","expected_classes_read":False,"config_sha256":hashlib.sha256(Path(a.config).read_bytes()).hexdigest(),"internal_states":len(vals),"saved_states":len(rows),"reference_checkpoints":len(rr)}
    with open(out/"source_generation_record.json","w",encoding="utf-8") as f:json.dump(record,f,indent=2,sort_keys=True);f.write("\n")
if __name__=="__main__":main()
