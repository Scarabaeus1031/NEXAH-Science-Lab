#!/usr/bin/env python3
import csv, hashlib, json, math, os, platform
from collections import Counter
import numpy as np
from PIL import Image, __version__ as pillow_version

OUT=os.path.dirname(os.path.abspath(__file__))
N=1000
SEED=20260910
G=(np.indices((N,N)).sum(axis=0)%2).astype(np.uint8)
ZERO=np.zeros((N,N),dtype=np.uint8)
rng=np.random.Generator(np.random.PCG64(SEED))
RANDOM=np.concatenate((np.zeros(500000,dtype=np.uint8),np.ones(500000,dtype=np.uint8)))
RANDOM=RANDOM[rng.permutation(RANDOM.size)].reshape(N,N)

def sha(a): return hashlib.sha256(np.ascontiguousarray(a).tobytes()).hexdigest()
def entropy(a):
    c=np.unique(a,return_counts=True)[1].astype(float)
    p=c/c.sum()
    return float(-(p*np.log2(p)).sum())
def hist(a):
    u,c=np.unique(a,return_counts=True)
    return {str(int(x) if float(x).is_integer() else float(x)):int(y) for x,y in zip(u,c)}
def save_png(name,a):
    Image.fromarray(a.astype(np.uint8),"L").save(os.path.join(OUT,name),optimize=False)
def center_crop(a,h,w):
    y=(a.shape[0]-h)//2; x=(a.shape[1]-w)//2
    return a[y:y+h,x:x+w]

save_png("GRID_ORIGINAL.png",G*255)
img=Image.fromarray(G*255,"L")
exact=[
 ("identity",G,lambda a:a),
 ("transpose",G.T,lambda a:a.T),
 ("horizontal_reflection",np.fliplr(G),lambda a:np.fliplr(a)),
 ("vertical_reflection",np.flipud(G),lambda a:np.flipud(a)),
 ("rotation_90",np.rot90(G,1),lambda a:np.rot90(a,-1)),
 ("rotation_180",np.rot90(G,2),lambda a:np.rot90(a,2)),
 ("rotation_270",np.rot90(G,3),lambda a:np.rot90(a,1)),
]
trans_rows=[]
for name,a,inv in exact:
    back=inv(a)
    trans_rows.append([name,"exact_index_permutation",N,N,sha(a),int((a==0).sum()),int((a==1).sum()),int((a!=G).sum()),int((back!=G).sum()),name not in ("rotation_90","rotation_270"),entropy(a),True,2,json.dumps(hist(a),sort_keys=True),0,0.0,0.0])

rotation_records=[]
for angle in (45,33):
    for method,resample in (("nearest",Image.Resampling.NEAREST),("bilinear",Image.Resampling.BILINEAR)):
        out=img.rotate(angle,resample=resample,expand=True,fillcolor=0,center=None)
        a=np.asarray(out,dtype=np.uint8)
        inv=out.rotate(-angle,resample=resample,expand=True,fillcolor=0,center=None)
        back=center_crop(np.asarray(inv,dtype=np.uint8),N,N)
        diff=np.abs(back.astype(np.int16)-G.astype(np.int16)*255)
        name=f"GRID_{angle}_{method.upper()}.png"
        save_png(name,a)
        rec={"angle_degrees":angle,"method":method,"input_dimensions":[N,N],"output_dimensions":[a.shape[1],a.shape[0]],"expand_canvas":True,"cropped_canvas":False,"fill_value":0,"coordinate_origin":"Pillow image center; default center=None","rounding_policy":"Pillow 12.3.0 implementation","library":"Pillow","library_version":pillow_version,"unique_values":int(np.unique(a).size),"histogram_uint8":hist(a),"entropy_bits_per_uint8_sample":entropy(a),"entropy_comparison_ceiling":"bilinear entropy is for quantized uint8 samples, not binary entropy","added_canvas_pixels":int(a.size-G.size),"inverse_crop_dimensions":[N,N],"inverse_mismatch_count":int((back!=G*255).sum()),"inverse_mean_absolute_error_normalized":float(diff.mean()/255),"inverse_max_error_normalized":float(diff.max()/255),"array_sha256":sha(a)}
        rotation_records.append(rec)
        trans_rows.append([f"rotation_{angle}_{method}","raster_resampling",a.shape[1],a.shape[0],sha(a),"","","",rec["inverse_mismatch_count"],False,rec["entropy_bits_per_uint8_sample"],False,rec["unique_values"],json.dumps(rec["histogram_uint8"],sort_keys=True),rec["added_canvas_pixels"],rec["inverse_mean_absolute_error_normalized"],rec["inverse_max_error_normalized"]])
# requested inverse-difference visual uses the 45-degree bilinear pipeline
out45=img.rotate(45,resample=Image.Resampling.BILINEAR,expand=True,fillcolor=0)
back45=center_crop(np.asarray(out45.rotate(-45,resample=Image.Resampling.BILINEAR,expand=True,fillcolor=0),dtype=np.uint8),N,N)
save_png("GRID_INVERSE_DIFFERENCE.png",np.abs(back45.astype(np.int16)-G.astype(np.int16)*255))

with open(os.path.join(OUT,"06_TRANSFORMATION_RECONSTRUCTION_RESULTS.csv"),"w",newline="") as f:
    w=csv.writer(f);w.writerow(["transform","class","width","height","array_sha256","zero_count","one_count","mismatch_vs_original","inverse_mismatch","involutive","empirical_entropy_bits","entropy_preserved","unique_values","histogram","cropped_or_added_pixels","inverse_mae_normalized","inverse_max_error_normalized"]);w.writerows(trans_rows)

scale_rows=[]
for scale in (2.0,1.0,0.5,0.25):
    if scale>=1:
        a=np.asarray(img.resize((round(N*scale),round(N*scale)),Image.Resampling.NEAREST),dtype=np.uint8)//255
        back=np.asarray(Image.fromarray(a*255).resize((N,N),Image.Resampling.NEAREST),dtype=np.uint8)//255
        scale_rows.append([scale,"scale_factor","nearest",a.shape[1],a.shape[0],json.dumps(hist(a)),entropy(a),int((back!=G).sum()),float(np.abs(back.astype(float)-G).mean()),int(np.abs(back.astype(int)-G).max()),bool(np.array_equal(back,G)),"upsampling" if scale>1 else "identity"])
    else:
        block=round(1/scale); h=N//block
        near=np.asarray(img.resize((h,h),Image.Resampling.NEAREST),dtype=np.uint8)//255
        majority=(G.reshape(h,block,h,block).sum((1,3))>(block*block/2)).astype(np.uint8)
        average=G.reshape(h,block,h,block).mean((1,3))
        for method,a in (("nearest",near),("block_majority_tie_to_zero",majority),("block_average",average)):
            back=np.repeat(np.repeat(a,block,0),block,1)
            err=np.abs(back.astype(float)-G)
            scale_rows.append([scale,"scale_factor",method,a.shape[1],a.shape[0],json.dumps(hist(a)),entropy(a),int((back!=G).sum()),float(err.mean()),float(err.max()),bool(np.array_equal(back,G)),"downsampling"])
with open(os.path.join(OUT,"07_SCALING_AND_SAMPLING_RESULTS.csv"),"w",newline="") as f:
    w=csv.writer(f);w.writerow(["scale","interpretation","method","width","height","histogram","empirical_entropy_bits","reconstruction_mismatch","reconstruction_mae","reconstruction_max_error","exact_reconstruction","operation"]);w.writerows(scale_rows)

with open(os.path.join(OUT,"01_ALPHABET_REGISTER_LEDGER.csv"),"w",newline="") as f:
    w=csv.writer(f);w.writerow(["case","representation","value_or_result","classification","note"])
    rows=[
     ("I,J,S,T","A1Z26","9,10,19,20","EXACT_ARITHMETIC","J-I=1; T-S=1; S-I=10; T-J=10"),
     ("IJ to ST","ordered coordinates","tau_10 on both coordinates","TRANSLATION_SQUARE_CONFIRMED","(9,10)+(10,10)=(19,20)"),
     ("horizontal then vertical","translations +1,+10","same as vertical then horizontal","COMMUTING_TRANSLATIONS_CONFIRMED","integer addition commutes"),
     ("B on T","unspecified","operation not selected","OPERATION_NOT_DEFINED","tuple (2,20), sum22, difference18, product40, concat220 are distinct"),
     ("B+T","sum","22=2*11","A1Z26_ENCODING_DEPENDENT","selected addition"),
     ("SC","tuple/sum/difference/product/concats","(19,3);22;16;57;193;319","A1Z26_ENCODING_DEPENDENT","encodings distinct"),
     ("B+T versus S+C","sum","22=22","SELECTED_ENCODING_ONLY","coincides only under selected A1Z26 addition")
    ];w.writerows(rows)

integer={"111_times_111":12321,"factor_12321":{"3":2,"37":2},"factor_32642":{"2":1,"19":1,"859":1},"1031_prime":True,"32642_minus_1031":31611,"factor_31611":{"3":1,"41":1,"257":1},"factor_19_to_S":"exact arithmetic after selected A1Z26 encoding; SELECTED_ENCODING_ONLY","27_equals_3_cubed":True,"2_plus_7_equals_9_equals_3_squared":True,"P27":"UNDEFINED_NOTATION","p1":"UNDEFINED_NOTATION","p3":"UNDEFINED_NOTATION"}
W=lambda n,x:open(os.path.join(OUT,n),"w").write(x)
W("02_INTEGER_CONTROL_RESULTS.json",json.dumps(integer,indent=2)+"\n")
ent={"shape":[N,N],"cell_count":int(G.size),"checkerboard":{"zero":int((G==0).sum()),"one":int((G==1).sum()),"symbol_entropy_bits_per_cell":entropy(G),"symbol_entropy_nats_per_cell":math.log(2),"configuration":"DETERMINISTIC_CONFIGURATION","joint_uncertainty_statement":"Known deterministic array has zero uncertainty under a point-mass model; histogram entropy alone is not joint configuration entropy"},"all_zero":{"symbol_entropy_bits_per_cell":entropy(ZERO)},"seeded_balanced_random":{"seed":SEED,"generator":"NumPy Generator(PCG64) "+np.__version__,"zero":int((RANDOM==0).sum()),"one":int((RANDOM==1).sum()),"symbol_entropy_bits_per_cell":entropy(RANDOM)},"iid_balanced_model":{"explicit_assumption":"independent Bernoulli(0.5) cells","bits":1000000,"nats":1000000*math.log(2),"bytes":125000,"decimal_MB":0.125,"MiB":125000/(1024**2)},"file_size_warning":"PNG/compressed sizes are encoding results, not Shannon entropy","png_sizes_bytes":{},"rotations":rotation_records}
for n in ["GRID_ORIGINAL.png","GRID_45_NEAREST.png","GRID_45_BILINEAR.png","GRID_33_NEAREST.png","GRID_33_BILINEAR.png","GRID_INVERSE_DIFFERENCE.png"]:ent["png_sizes_bytes"][n]=os.path.getsize(os.path.join(OUT,n))
W("04_GRID_ENTROPY_RESULTS.json",json.dumps(ent,indent=2,sort_keys=True)+"\n")
with open(os.path.join(OUT,"05_BINARY_TRINARY_REGISTER_COUNTS.csv"),"w",newline="") as f:
    w=csv.writer(f);w.writerow(["grid","definition","residue","count","classification"]);w.writerows([["binary","n mod 2",0,500000,"INDEPENDENT_MODULAR_PROJECTIONS"],["binary","n mod 2",1,500000,"INDEPENDENT_MODULAR_PROJECTIONS"],["trinary","n mod 3",0,333334,"INDEPENDENT_MODULAR_PROJECTIONS"],["trinary","n mod 3",1,333333,"INDEPENDENT_MODULAR_PROJECTIONS"],["trinary","n mod 3",2,333333,"INDEPENDENT_MODULAR_PROJECTIONS"]])
visuals=["VM_Binary_Trinary_Grids(1).png","45° Rotated Grid Overlay.png","Ghost Memory Checkerboard Grid (1000 x 1000)(3).png","CathedralFloor(3).png","Ghost Grid Overlay.png","Leonardo Zopf Mobius Braid & Q-Needle Path in the Ghostgrid(1).png"]
with open(os.path.join(OUT,"08_VISUAL_BINDING_LEDGER.csv"),"w",newline="") as f:
    w=csv.writer(f);w.writerow(["filename","located","pixel_dimensions","sha256","visible_labels","source_array_exists","generator_exists","transformation_reproducible","raster_boundary_explanation","classification"])
    for n in visuals:w.writerow([n,False,"","","UNAVAILABLE",False,False,False,"UNRESOLVED","UNRESOLVED_VISUAL_MAPPING"])
with open(os.path.join(OUT,"09_CLAIM_AND_NONCLAIM_LEDGER.csv"),"w",newline="") as f:
    w=csv.writer(f);w.writerow(["claim","result","classification"]);w.writerows([
     ["A1Z26 square","+1 and +10 commute","TRANSLATION_SQUARE_CONFIRMED; COMMUTING_TRANSLATIONS_CONFIRMED"],
     ["B+T and S+C","both sums 22","SELECTED_ENCODING_ONLY"],
     ["factor 19 in 32642","matches S under A1Z26","SELECTED_ENCODING_ONLY"],
     ["checkerboard size/counts","1000000; balanced","GRID_SIZE_CONFIRMED; EXACT_ARITHMETIC"],
     ["balanced histogram","1 bit per sampled symbol","EMPIRICAL_SYMBOL_ENTROPY"],
     ["one million uncertain bits","only IID Bernoulli model","IID_MODEL_DEPENDENT; BYTE_COUNT_CONFIRMED"],
     ["known checkerboard","not one million uncertain bits","DETERMINISTIC_CONFIGURATION"],
     ["PNG size","not entropy","FILE_SIZE_NOT_ENTROPY"],
     ["transforms 1-7","coordinate permutations","EXACT_GRID_AUTOMORPHISM; LOSSLESS_RECONSTRUCTION"],
     ["33/45 rotations","interpolation losses","RASTERIZATION_DEPENDENT"],
     ["binary/trinary","not invertibly equivalent","INDEPENDENT_MODULAR_PROJECTIONS"],
     ["animal perception","not tested","BIOLOGICAL_PERCEPTION_NOT_TESTED"],
     ["decorative geometry","not checkerboard theorem","UNRESOLVED_VISUAL_MAPPING"]])
print(json.dumps({"python":platform.python_version(),"numpy":np.__version__,"pillow":pillow_version,"output":OUT},indent=2))
