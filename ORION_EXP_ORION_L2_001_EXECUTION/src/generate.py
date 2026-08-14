#!/usr/bin/env python3
"""L2 generator. It has no expected-class input or import."""
import argparse, csv, hashlib, json, math
from pathlib import Path


def read_json(path):
    with open(path, encoding="utf-8") as f: return json.load(f)


def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, sort_keys=True); f.write("\n")


def write_csv(path, fields, rows):
    with open(path, "w", encoding="utf-8", newline="") as f:
        w=csv.DictWriter(f, fieldnames=fields, lineterminator="\n"); w.writeheader(); w.writerows(rows)


def fn(v): return format(v, ".17g")


def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()


# Production path: Lorenz-specific componentwise RK4.
def source_step(state, h, sig, rho, beta):
    def rhs(x,y,z): return sig*(y-x), x*(rho-z)-y, x*y-beta*z
    x,y,z=state
    k1=rhs(x,y,z)
    k2=rhs(x+h*k1[0]/2,y+h*k1[1]/2,z+h*k1[2]/2)
    k3=rhs(x+h*k2[0]/2,y+h*k2[1]/2,z+h*k2[2]/2)
    k4=rhs(x+h*k3[0],y+h*k3[1],z+h*k3[2])
    return tuple(state[i]+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6 for i in range(3))


# Reference/transformed path: separately written generic-vector RK4.
def generic_step(value, h, rhs):
    add=lambda a,b,q: tuple(a[i]+q*b[i] for i in range(3))
    k1=rhs(value)
    k2=rhs(add(value,k1,h/2))
    k3=rhs(add(value,k2,h/2))
    k4=rhs(add(value,k3,h))
    return tuple(value[i]+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6 for i in range(3))


def integrate(initial, h, steps, rhs, stepper=generic_step):
    values=[tuple(initial)]
    for _ in range(steps): values.append(stepper(values[-1],h,rhs))
    return values


def coeffs(j):
    tr=j[0][0]+j[1][1]+j[2][2]
    p2=(j[0][0]*j[1][1]-j[0][1]*j[1][0])+(j[0][0]*j[2][2]-j[0][2]*j[2][0])+(j[1][1]*j[2][2]-j[1][2]*j[2][1])
    det=j[0][0]*(j[1][1]*j[2][2]-j[1][2]*j[2][1])-j[0][1]*(j[1][0]*j[2][2]-j[1][2]*j[2][0])+j[0][2]*(j[1][0]*j[2][1]-j[1][1]*j[2][0])
    return tr,p2,det


def mm(a,b): return tuple(tuple(sum(a[i][k]*b[k][j] for k in range(3)) for j in range(3)) for i in range(3))


def fixture_values(rep, point, sig, rho, beta, k):
    x,y,z=point
    j=((-sig,sig,0.0),(rho-z,-1.0,-x),(y,x,-beta))
    f=(sig*(y-x),x*(rho-z)-y,x*y-beta*z)
    if rep=="R0": mapped=point; field=f; jt=j
    elif rep=="R1":
        mapped=(y,z,x); field=(f[1],f[2],f[0]); q=((0.,1.,0.),(0.,0.,1.),(1.,0.,0.)); qi=((0.,0.,1.),(1.,0.,0.),(0.,1.,0.)); jt=mm(mm(q,j),qi)
    elif rep=="R2":
        mapped=(2*x,.5*y,1.5*z); field=(2*f[0],.5*f[1],1.5*f[2]); sm=((2.,0.,0.),(0.,.5,0.),(0.,0.,1.5)); si=((.5,0.,0.),(0.,2.,0.),(0.,0.,2/3)); jt=mm(mm(sm,j),si)
    else:
        mapped=(x,y,z+k*x*x); field=(f[0],f[1],f[2]+2*k*x*f[0])
        d=((1.,0.,0.),(0.,1.,0.),(2*k*x,0.,1.)); di=((1.,0.,0.),(0.,1.,0.),(-2*k*x,0.,1.)); jt=mm(mm(d,j),di)
    return mapped,field,jt,coeffs(jt)


def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--config",required=True); ap.add_argument("--out",required=True); a=ap.parse_args()
    cfg=read_json(a.config); out=Path(a.out).resolve(); out.mkdir(parents=True,exist_ok=False)
    sig,rho,beta=cfg["sigma"],cfg["rho"],cfg["beta"]; h=cfg["production_h"]; n=cfg["production_steps"]; stride=cfg["save_stride"]
    source=[tuple(cfg["initial"])]
    for _ in range(n): source.append(source_step(source[-1],h,sig,rho,beta))
    src_rows=[]
    for i in range(0,n+1,stride):
        x,y,z=source[i]; d=(sig*(y-x),x*(rho-z)-y,x*y-beta*z)
        src_rows.append({"experiment_id":cfg["experiment_id"],"source_id":"SRC-L63","step":i,"t":fn(i*h),"x":fn(x),"y":fn(y),"z":fn(z),"dx_dt":fn(d[0]),"dy_dt":fn(d[1]),"dz_dt":fn(d[2]),"finite":str(all(math.isfinite(v) for v in (x,y,z))).lower()})
    write_csv(out/"source_trajectory.csv",["experiment_id","source_id","step","t","x","y","z","dx_dt","dy_dt","dz_dt","finite"],src_rows)

    native_rhs=lambda p:(sig*(p[1]-p[0]),p[0]*(rho-p[2])-p[1],p[0]*p[1]-beta*p[2])
    ref_steps=int(cfg["source_gate_end"]/cfg["reference_h"])
    reference=integrate(cfg["initial"],cfg["reference_h"],ref_steps,native_rhs)
    ref_stride=int(0.01/cfg["reference_h"])
    ref_rows=[]
    for i in range(0,ref_steps+1,ref_stride):
        x,y,z=reference[i]; ref_rows.append({"experiment_id":cfg["experiment_id"],"source_id":"SRC-L63","reference_step":i,"t":fn(i*cfg["reference_h"]),"x":fn(x),"y":fn(y),"z":fn(z),"matched_production_step":int(i*cfg["reference_h"]/h)})
    write_csv(out/"source_reference.csv",["experiment_id","source_id","reference_step","t","x","y","z","matched_production_step"],ref_rows)

    start=int(cfg["transient_time"]/h); end=int(cfg["comparison_end"]/h); segsteps=end-start; base=source[start]
    r1_rhs=lambda u:(u[2]*(rho-u[1])-u[0],u[2]*u[0]-beta*u[1],sig*(u[0]-u[2]))
    r2_rhs=lambda v:(4*sig*v[1]-sig*v[0],.5*((v[0]/2)*(rho-v[2]/1.5)-2*v[1]),1.5*v[0]*v[1]-beta*v[2])
    k=cfg["r3_kappa"]
    def r3_rhs(w):
        x,y,z=w[0],w[1],w[2]-k*w[0]*w[0]; fx=sig*(y-x); fy=x*(rho-z)-y; fz=x*y-beta*z
        return fx,fy,fz+2*k*x*fx
    r1=integrate((base[1],base[2],base[0]),h,segsteps,r1_rhs)
    r2=integrate((2*base[0],.5*base[1],1.5*base[2]),h,segsteps,r2_rhs)
    native_h=integrate(base,h,segsteps,native_rhs)
    r3h=integrate((base[0],base[1],base[2]+k*base[0]*base[0]),h,segsteps,r3_rhs)
    h2=cfg["reference_h"]; native_h2=integrate(base,h2,segsteps*2,native_rhs); r3h2=integrate((base[0],base[1],base[2]+k*base[0]*base[0]),h2,segsteps*2,r3_rhs)

    tr=[]
    fields=["source_id","step","t","representation_id","generation_path","c1","c2","c3","dc1_dt","dc2_dt","dc3_dt","defined","failure_reason"]
    def row(step,t,rep,path,p,d=(None,None,None)):
        return {"source_id":"SRC-L63","step":step,"t":fn(t),"representation_id":rep,"generation_path":path,"c1":"" if p[0] is None else fn(p[0]),"c2":"" if p[1] is None else fn(p[1]),"c3":"" if p[2] is None else fn(p[2]),"dc1_dt":"" if d[0] is None else fn(d[0]),"dc2_dt":"" if d[1] is None else fn(d[1]),"dc3_dt":"" if d[2] is None else fn(d[2]),"defined":"true","failure_reason":""}
    for j in range(0,segsteps+1,stride):
        i=start+j; p=source[i]; x,y,z=p; f=native_rhs(p); t=i*h; p3=native_h[j]
        tr += [row(i,t,"R0","MAP_FROM_SOURCE",p,f),row(i,t,"R1","MAP_FROM_SOURCE",(y,z,x),(f[1],f[2],f[0])),row(i,t,"R1","INDEPENDENT_TRANSFORMED_RK4_H",r1[j],r1_rhs(r1[j])),row(i,t,"R2","MAP_FROM_SOURCE",(2*x,.5*y,1.5*z),(2*f[0],.5*f[1],1.5*f[2])),row(i,t,"R2","INDEPENDENT_TRANSFORMED_RK4_H",r2[j],r2_rhs(r2[j])),row(i,t,"R3","MAP_FROM_SOURCE",(p3[0],p3[1],p3[2]+k*p3[0]*p3[0])),row(i,t,"R3","INDEPENDENT_TRANSFORMED_RK4_H",r3h[j],r3_rhs(r3h[j])),row(i,t,"R4","DIRECT_OBSERVATION",(z,None,None))]
    for j in range(0,segsteps*2+1,ref_stride):
        p=native_h2[j]; w=(p[0],p[1],p[2]+k*p[0]*p[0]); t=cfg["transient_time"]+j*h2; step=int(cfg["transient_time"]/h2)+j
        tr += [row(step,t,"R3","MAP_FROM_SOURCE",w),row(step,t,"R3","INDEPENDENT_TRANSFORMED_RK4_H2",r3h2[j],r3_rhs(r3h2[j]))]
    write_csv(out/"transformed_trajectories.csv",fields,tr)

    av=math.sqrt(72.0); fixtures=[("O",(0.,0.,0.)),("CPLUS",(av,av,27.)),("CMINUS",(-av,-av,27.))]
    fixtures += [(f"CP{idx}",tuple(float(src_rows[idx][q]) for q in ("x","y","z"))) for idx in cfg["fixture_checkpoint_indices"]]
    fr=[]
    for fid,p in fixtures:
        for rep in ("R0","R1","R2","R3"):
            m,f,j,cfs=fixture_values(rep,p,sig,rho,beta,k)
            fr.append({"fixture_id":fid,"representation_id":rep,"c1":fn(m[0]),"c2":fn(m[1]),"c3":fn(m[2]),"field1":fn(f[0]),"field2":fn(f[1]),"field3":fn(f[2]),"divergence":fn(j[0][0]+j[1][1]+j[2][2]),"char_c1":fn(cfs[0]),"char_c2":fn(cfs[1]),"char_c3":fn(cfs[2])})
    write_csv(out/"structural_fixtures.csv",["fixture_id","representation_id","c1","c2","c3","field1","field2","field3","divergence","char_c1","char_c2","char_c3"],fr)

    rr=[]
    for fid,p in fixtures:
        z=p[2]; bidx=sum(z>=edge for edge in cfg["bin_edges"])
        rr.append({"fixture_or_source_id":fid,"step":"","z_value":fn(z),"bin_id":bidx,"palette_a_color":cfg["palette_a"][bidx],"palette_b_color":cfg["palette_b"][bidx],"defined":"true"})
    write_csv(out/"rendered_records.csv",["fixture_or_source_id","step","z_value","bin_id","palette_a_color","palette_b_color","defined"],rr)
    write_json(out/"generation_record.json",{"stage":"generator","expected_classes_read":False,"config_sha256":sha(a.config),"preregistration_sha256":cfg["preregistration_sha256"],"output_files":["source_trajectory.csv","source_reference.csv","transformed_trajectories.csv","structural_fixtures.csv","rendered_records.csv"]})

if __name__=="__main__": main()
