#!/usr/bin/env python3
import csv, hashlib, json, os
import numpy as np
from PIL import Image
OUT=os.path.dirname(os.path.abspath(__file__))
def write_csv(name,head,rows):
    with open(os.path.join(OUT,name),"w",newline="") as f:
        w=csv.writer(f);w.writerow(head);w.writerows(rows)

multi=[
 ["G11","MODEL_A_CELL_COUNTS","cells_per_axis",11,121,144,11,"baseline","cell edges 0..11","BASE_COARSE_GRID"],
 ["G111","MODEL_A_CELL_COUNTS","cells_per_axis",111,12321,12544,111,111/11,"cell edges 0..111","NONINTEGER_CELL_REFINEMENT; CONTRADICTED"],
 ["G111","MODEL_B_SAMPLE_POINTS","sample_points_per_axis",111,12100,12321,110,10,"indices 0,10,...,110","EXACT_VERTEX_CELL_REFINEMENT"],
 ["G1000","DECLARED_ARRAY","sampled_cells_or_pixels_per_axis",1000,1000000,"UNDEFINED_AS_GEOMETRIC_VERTICES","UNDEFINED",1000/11,"array indices 0..999","NO_EXACT_11_CELL_NESTING_DECLARED"]
]
write_csv("11_MULTI_RESOLUTION_GRID_LEDGER.csv",["grid","model","type","axis_size","cell_count","vertex_count","interval_count_per_axis","refinement_factor","boundary_policy","nesting_status"],multi)

fine=(np.indices((110,110)).sum(0)%2).astype(np.uint8)
mean=fine.reshape(11,10,11,10).mean((1,3))
summ=fine.reshape(11,10,11,10).sum((1,3))
major=(summ>50).astype(np.uint8)
maximum=fine.reshape(11,10,11,10).max((1,3))
def rep(a):return np.repeat(np.repeat(a,10,0),10,1)
def metrics(a,b):e=np.abs(a.astype(float)-b.astype(float));return int((a!=b).sum()),float(e.mean()),float(e.max())
rows=[]
for name,a,norm in [("AGGREGATE_MEAN",mean,mean),("AGGREGATE_SUM",summ,summ/100),("AGGREGATE_MAJORITY_TIE_ZERO",major,major),("AGGREGATE_MAXIMUM",maximum,maximum)]:
    back=rep(norm);mm,ma,mx=metrics(back,fine)
    invariant="block total" if "SUM" in name else "block mean" if "MEAN" in name else "declared reducer"
    rows.append([name,"110x110 binary interval cells","11x11 scalar cells",invariant,"YES","NO",mm,ma,mx])
# sample 111x111 vertex checkerboard at exact boundaries
verts=(np.indices((111,111)).sum(0)%2).astype(np.uint8)
sample=verts[::10,::10]
back_near=np.zeros_like(verts) # every sampled boundary is zero
for name,back in [("SAMPLE_THEN_EXPAND_NEAREST",back_near),("SAMPLE_THEN_EXPAND_BILINEAR",back_near)]:
    mm,ma,mx=metrics(back,verts);rows.append([name,"111x111 vertex samples","12x12 samples then 111x111","sample values at boundaries","YES","NO",mm,ma,mx])
threshold=(mean>=0.5).astype(np.uint8);back=rep(threshold);mm,ma,mx=metrics(back,fine)
rows.append(["THRESHOLD_GE_0.5","11x11 mean cells","11x11 binary cells","declared threshold","YES","NO",mm,ma,mx])
for m in (2,3,11):
    rows.append(["RESIDUE_MOD_"+str(m),"integer labels","residue classes","congruence class","YES","NO","not reconstructable from residue alone","",""])
rows.append(["PRIME_SIEVE","integer labels 0..999999","boolean/type mask","primality","YES","NO","not invertible","",""])
write_csv("12_SENSOR_OPERATOR_RESULTS.csv",["operator","input_type","output_type","invariant","information_loss","invertible","reconstruction_mismatch","reconstruction_mae","reconstruction_max_error"],rows)

limit=1000000
sieve=np.ones(limit,dtype=bool);sieve[:2]=False
for p in range(2,int(limit**0.5)+1):
    if sieve[p]:sieve[p*p::p]=False
labels=np.arange(limit).reshape(1000,1000)
res0=(labels%11)==0
rgb=np.zeros((1000,1000,3),dtype=np.uint8)
prime_grid=sieve.reshape(1000,1000)
rgb[res0 & ~prime_grid]=[220,40,40]
rgb[prime_grid]=[0,210,255]
rgb.flat[11*3:11*3+3]=[255,215,0]
rgb.flat[0:3]=[128,128,128]
rgb.flat[3:6]=[255,255,255]
Image.fromarray(rgb,"RGB").save(os.path.join(OUT,"MOD11_PRIME_STICK_G1000.png"))
counts={"prime_total":int(sieve.sum()),"prime_11":bool(sieve[11]),"other_primes":int(sieve.sum()-1),"residue0_total":int((np.arange(limit)%11==0).sum()),"residue0_composite_positive":int(sum(1 for x in range(22,limit,11))),"zero":"neither prime nor composite","one":"unit, neither prime nor composite"}
with open(os.path.join(OUT,"13_MODULO11_COUNTS.json"),"w") as f:json.dump(counts,f,indent=2)
visuals=["EXP09_nested_grid_111x111(7).png","Harmonic_Cathedral_11x11(2).png","EXP09_nested_grid_11x11(2).png","v_grid_to_cube_transition(2).png","NEXAH ORIENTATION FRAMEWORK-ii(4).png"]
write_csv("15_ADDITIONAL_VISUAL_BINDING_LEDGER.csv",["filename","located","apparent_dimensions","cells_or_vertices","residue_or_prime_markers","source_array","generator","nesting_reproducible","projection_cube_status","classification"],[[x,False,"UNAVAILABLE","UNRESOLVED","UNAVAILABLE",False,False,False,"UNRESOLVED","UNRESOLVED_VISUAL_BINDING"] for x in visuals])
print(json.dumps(counts,indent=2))
