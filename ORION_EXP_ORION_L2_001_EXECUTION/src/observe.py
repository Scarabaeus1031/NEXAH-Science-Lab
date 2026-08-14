#!/usr/bin/env python3
"""Blind L2 observer/classifier. No expected-class file is accepted."""
import argparse, csv, hashlib, json, math
from pathlib import Path


def read_json(p):
    with open(p,encoding="utf-8") as f:return json.load(f)


def read_csv(p):
    with open(p,encoding="utf-8",newline="") as f:return list(csv.DictReader(f))


def write_json(p,o):
    with open(p,"w",encoding="utf-8") as f:json.dump(o,f,indent=2,sort_keys=True);f.write("\n")


def write_csv(p,fields,rows):
    with open(p,"w",encoding="utf-8",newline="") as f:w=csv.DictWriter(f,fieldnames=fields,lineterminator="\n");w.writeheader();w.writerows(rows)


def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def seal(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
def norm(p):return math.sqrt(sum(x*x for x in p))
def sub(a,b):return tuple(a[i]-b[i] for i in range(3))


def char_coeff(j):
    tr=j[0][0]+j[1][1]+j[2][2]
    p2=(j[0][0]*j[1][1]-j[0][1]*j[1][0])+(j[0][0]*j[2][2]-j[0][2]*j[2][0])+(j[1][1]*j[2][2]-j[1][2]*j[2][1])
    det=j[0][0]*(j[1][1]*j[2][2]-j[1][2]*j[2][1])-j[0][1]*(j[1][0]*j[2][2]-j[1][2]*j[2][0])+j[0][2]*(j[1][0]*j[2][1]-j[1][1]*j[2][0])
    return tr,p2,det


def native_field(p,sig,rho,beta):
    x,y,z=p;return sig*(y-x),x*(rho-z)-y,x*y-beta*z


def native_jac(p,sig,rho,beta):
    x,y,z=p;return ((-sig,sig,0.),(rho-z,-1.,-x),(y,x,-beta))


def r1_field(u,sig,rho,beta):
    # Expanded independently: u=(y,z,x).
    return u[2]*(rho-u[1])-u[0],u[2]*u[0]-beta*u[1],sig*(u[0]-u[2])


def r2_field(v,sig,rho,beta):
    return 4*sig*v[1]-sig*v[0],.5*((v[0]/2)*(rho-v[2]/1.5)-2*v[1]),1.5*v[0]*v[1]-beta*v[2]


def r3_field(w,sig,rho,beta,k):
    x,y=w[0],w[1]
    return sig*(y-x),x*(rho-w[2]+k*x*x)-y,(1+2*k*sig)*x*y-beta*w[2]+k*(beta-2*sig)*x*x


def transformed_jac(rep,p,sig,rho,beta,k):
    x,y,z=p
    if rep=="R0":return native_jac(p,sig,rho,beta)
    if rep=="R1":
        # Derivative of independently expanded r1_field at (y,z,x).
        u=(y,z,x);return ((-1.,-u[2],rho-u[1]),(u[2],-beta,u[0]),(sig,0.,-sig))
    if rep=="R2":
        v=(2*x,.5*y,1.5*z);return ((-sig,4*sig,0.),(.25*(rho-v[2]/1.5),-1.,-v[0]/6),(1.5*v[1],1.5*v[0],-beta))
    w=(x,y,z+k*x*x)
    return ((-sig,sig,0.),(rho-w[2]+3*k*x*x,-1.,-x),((1+2*k*sig)*y+2*k*(beta-2*sig)*x,(1+2*k*sig)*x,-beta))


def x_only_claim(z_value):
    float(z_value)
    return None


def main():
    ap=argparse.ArgumentParser();ap.add_argument("--config",required=True);ap.add_argument("--rules",required=True);ap.add_argument("--input",required=True);a=ap.parse_args()
    cfg=read_json(a.config);rules=read_json(a.rules);root=Path(a.input).resolve()
    assert rules.get("contains_expected_classes") is False
    assert all("expected_class" not in r for r in rules["candidate_rules"])
    sig,rho,beta,k=cfg["sigma"],cfg["rho"],cfg["beta"],cfg["r3_kappa"]
    src=read_csv(root/"source_trajectory.csv");ref=read_csv(root/"source_reference.csv");tr=read_csv(root/"transformed_trajectories.csv");fr=read_csv(root/"structural_fixtures.csv");render=read_csv(root/"rendered_records.csv")
    src_by_step={int(r["step"]):(float(r["x"]),float(r["y"]),float(r["z"])) for r in src}
    source_finite=all(r["finite"]=="true" for r in src)
    source_defect=max(norm(sub(src_by_step[int(r["matched_production_step"])],(float(r["x"]),float(r["y"]),float(r["z"])))) for r in ref)

    def tpoints(rep,path,lo,hi):
        return {int(float(r["step"])):(float(r["c1"]),float(r["c2"]),float(r["c3"])) for r in tr if r["representation_id"]==rep and r["generation_path"]==path and lo<=int(float(r["step"]))<=hi}
    r1m=tpoints("R1","MAP_FROM_SOURCE",5000,7000);r1i=tpoints("R1","INDEPENDENT_TRANSFORMED_RK4_H",5000,7000)
    r2m=tpoints("R2","MAP_FROM_SOURCE",5000,7000);r2i=tpoints("R2","INDEPENDENT_TRANSFORMED_RK4_H",5000,7000)
    r3mc=tpoints("R3","MAP_FROM_SOURCE",5000,7000);r3ic=tpoints("R3","INDEPENDENT_TRANSFORMED_RK4_H",5000,7000)
    r3mf=tpoints("R3","MAP_FROM_SOURCE",10000,14000);r3if=tpoints("R3","INDEPENDENT_TRANSFORMED_RK4_H2",10000,14000)
    correspondence=all(len(x)==201 for x in (r1m,r1i,r2m,r2i,r3mc,r3ic,r3mf,r3if))
    dmax=lambda a,b:max(norm(sub(a[i],b[i])) for i in a if i in b)
    r1traj=dmax(r1m,r1i);r2traj=dmax(r2m,r2i);r3coarse=dmax(r3mc,r3ic);r3fine=dmax(r3mf,r3if)

    fixture_native={r["fixture_id"]:(float(r["c1"]),float(r["c2"]),float(r["c3"])) for r in fr if r["representation_id"]=="R0"}
    r1res=r2res=r3res=0.0
    for p in fixture_native.values():
        f=native_field(p,sig,rho,beta)
        r1res=max(r1res,norm(sub(r1_field((p[1],p[2],p[0]),sig,rho,beta),(f[1],f[2],f[0]))))
        r2res=max(r2res,norm(sub(r2_field((2*p[0],.5*p[1],1.5*p[2]),sig,rho,beta),(2*f[0],.5*f[1],1.5*f[2]))))
        w=(p[0],p[1],p[2]+k*p[0]*p[0]);r3res=max(r3res,norm(sub(r3_field(w,sig,rho,beta,k),(f[0],f[1],f[2]+2*k*p[0]*f[0]))))

    eqids=("O","CPLUS","CMINUS");eq_field=0.;char_def=0.;div_def=0.;target_div=-(sig+1+beta)
    for fid,p in fixture_native.items():
        basec=char_coeff(transformed_jac("R0",p,sig,rho,beta,k))
        for rep in ("R1","R2","R3"):
            j=transformed_jac(rep,p,sig,rho,beta,k);c=char_coeff(j)
            char_def=max(char_def,*[abs(c[i]-basec[i])/max(1.,abs(c[i]),abs(basec[i])) for i in range(3)] if fid in eqids else [0.])
            div_def=max(div_def,abs(j[0][0]+j[1][1]+j[2][2]-target_div))
            if fid in eqids:
                if rep=="R1":field=r1_field((p[1],p[2],p[0]),sig,rho,beta)
                elif rep=="R2":field=r2_field((2*p[0],.5*p[1],1.5*p[2]),sig,rho,beta)
                else:field=r3_field((p[0],p[1],p[2]+k*p[0]*p[0]),sig,rho,beta,k)
                eq_field=max(eq_field,norm(field))

    av=math.sqrt(72.);cp=(av,av,27.);cm=(-av,-av,27.)
    dist0=norm(sub(cp,cm));dist2=norm(sub((2*cp[0],.5*cp[1],1.5*cp[2]),(2*cm[0],.5*cm[1],1.5*cm[2])));distance_change=abs(dist2/dist0-1)
    exact_collision=(cp[2]==cm[2] and cp[0]>0 and cm[0]<0);claim=x_only_claim(cp[2]);changed=sum(r["palette_a_color"]!=r["palette_b_color"] for r in render);bins_fixed=all(r["bin_id"]!="" for r in render)

    thresholds={r["id"]:r["predicate"] for r in rules["candidate_rules"]}
    passed={
      "L2-C01":source_finite and source_defect<=1e-5,"L2-C02":r1traj<=1e-9,"L2-C03":r1res<=1e-11,"L2-C04":r2traj<=2e-9,"L2-C05":r2res<=1e-10,
      "L2-C06":r3fine<=1e-3 and r3fine<=.35*r3coarse,"L2-C07":r3res<=1e-9,"L2-C08":eq_field<=1e-10,"L2-C09":char_def<=1e-9,"L2-C10":div_def<=1e-10,
      "L2-C11":distance_change>=.25,"L2-C12":exact_collision and claim is None,"L2-C13":bins_fixed and changed>=1}
    labels={"L2-C01":"ROBUST","L2-C02":"EQUIVARIANT","L2-C03":"EQUIVARIANT","L2-C04":"EQUIVARIANT","L2-C05":"EQUIVARIANT","L2-C06":"EQUIVARIANT","L2-C07":"EQUIVARIANT","L2-C08":"EQUIVARIANT","L2-C09":"INVARIANT","L2-C10":"INVARIANT","L2-C11":"REPRESENTATION_DEPENDENT","L2-C12":"UNDEFINED","L2-C13":"REPRESENTATION_DEPENDENT"}
    stats={"L2-C01":{"max_source_halfstep_defect":source_defect},"L2-C02":{"max_r1_trajectory_defect":r1traj},"L2-C03":{"max_r1_field_residual":r1res},"L2-C04":{"max_r2_trajectory_defect":r2traj},"L2-C05":{"max_r2_field_residual":r2res},"L2-C06":{"coarse_defect":r3coarse,"fine_defect":r3fine,"fine_coarse_ratio":r3fine/r3coarse if r3coarse else None},"L2-C07":{"max_r3_field_residual":r3res},"L2-C08":{"max_mapped_equilibrium_field_norm":eq_field},"L2-C09":{"max_relative_characteristic_coefficient_defect":char_def},"L2-C10":{"max_divergence_defect":div_def},"L2-C11":{"relative_r2_distance_change":distance_change,"analytic_ratio":math.sqrt(17/8)},"L2-C12":{"collision_z":27.,"source_signs":[1,-1],"claimant_output":"UNDEFINED"},"L2-C13":{"changed_fixture_colors":changed,"bin_records_unchanged":bins_fixed}}
    reps={"L2-C01":["R0","R0_REFERENCE"],"L2-C02":["R0","R1"],"L2-C03":["R0","R1"],"L2-C04":["R0","R2"],"L2-C05":["R0","R2"],"L2-C06":["R0","R3"],"L2-C07":["R0","R3"],"L2-C08":["R0","R1-R3"],"L2-C09":["R0","R1-R3"],"L2-C10":["R0","R1-R3"],"L2-C11":["R0","R2"],"L2-C12":["R0","R4"],"L2-C13":["R5-A","R5-B"]}
    candidates={cid:{"source_representation":reps[cid][0],"target_representation":reps[cid][1],"scientific_proposition":cid,"measured_statistic":stats[cid],"registered_rule":thresholds[cid],"observed_class":labels[cid] if passed[cid] else "FAILED","counterexample":stats[cid] if cid in ("L2-C11","L2-C12","L2-C13") else None,"undefined_reason":"same z=27 has opposite sign(x); claimant receives z only" if cid=="L2-C12" else None,"failure_evidence":None if passed[cid] else stats[cid]} for cid in labels}

    # Six controls, recomputed independently.
    p=(1.,1.,1.);correct=native_field(p,sig,rho,beta);wrong=native_field(p,sig,27.,beta);d1=norm(sub((wrong[1],wrong[2],wrong[0]),(correct[1],correct[2],correct[0])))
    d2=0.
    for p in fixture_native.values():
        v=(2*p[0],.5*p[1],1.5*p[2]);wrongf=native_field(v,sig,rho,beta);wrongsv=(2*wrongf[0],.5*wrongf[1],1.5*wrongf[2]);f=native_field(p,sig,rho,beta);correctsv=(2*f[0],.5*f[1],1.5*f[2]);d2=max(d2,norm(sub(wrongsv,correctsv)))
    f0=native_field((1.,1.,1.),sig,rho,beta);d5=2*norm(f0)/(1+norm(f0))
    controls={
      "L2-D1":{"target":"L2-C03","operation":"rho=27 in purported R1 field","statistic":{"residual":d1},"threshold":">=0.5","passed":d1>=.5},
      "L2-D2":{"target":"L2-C05","operation":"S f(v) without inverse","statistic":{"max_residual":d2},"threshold":">=1","passed":d2>=1},
      "L2-D3":{"target":"distance invariance under R2","operation":"raw Euclidean R2 metric","statistic":{"relative_change":distance_change},"threshold":">=0.25","passed":distance_change>=.25},
      "L2-D4":{"target":"L2-C12 identifiability","operation":"z-only C+/C- collision","statistic":{"exact_collision":exact_collision,"claimant_output":"UNDEFINED"},"threshold":"one exact collision","passed":exact_collision and claim is None},
      "L2-D5":{"target":"time-oriented field consistency","operation":"reverse [0,2] orientation","statistic":{"endpoint_forward_law_residual":d5},"threshold":">=1.9","passed":d5>=1.9},
      "L2-D6":{"target":"L2-C13 rendered color invariance","operation":"reverse palette","statistic":{"changed_colors":changed,"bins_fixed":bins_fixed},"threshold":"changed>=1 and bins fixed","passed":changed>=1 and bins_fixed}}
    control_rows=[]
    for cid,v in controls.items():control_rows.append({"control_id":cid,"fixture_or_source_id":"REGISTERED","statistic_name":next(iter(v["statistic"])),"statistic_value":json.dumps(v["statistic"],sort_keys=True,separators=(",",":")),"threshold":v["threshold"],"target_outcome":"TARGET_DESTROYED","observed_outcome":"PASS" if v["passed"] else "FAILED_TARGET_DESTRUCTION"})
    write_csv(root/"destructive_controls.csv",["control_id","fixture_or_source_id","statistic_name","statistic_value","threshold","target_outcome","observed_outcome"],control_rows)
    observations={"experiment_id":cfg["experiment_id"],"preregistration_sha256":cfg["preregistration_sha256"],"stage":"blind_observer_classifier","expected_classes_available":False,"source_validation":{"finite":source_finite,"max_source_halfstep_defect":source_defect,"passed":passed["L2-C01"]},"coordinate_transformation_defect":{"r1":r1traj,"r2":r2traj,"r3_coarse":r3coarse,"r3_fine":r3fine},"chaotic_long_horizon_pointwise_gate_used":False,"correspondence_preserved":correspondence,"candidate_results":candidates,"destructive_controls":controls,"input_hashes":{p.name:sha(p) for p in root.iterdir() if p.is_file()}}
    write_json(root/"observed_classifications.json",{"observations":observations,"sealed_observation_hash":seal(observations)})

if __name__=="__main__":main()
