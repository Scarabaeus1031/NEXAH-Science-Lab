from __future__ import annotations
import copy,hashlib,json,math
from fractions import Fraction
from pathlib import Path

HERE=Path(__file__).resolve().parent;PKG=HERE.parent;LAB=PKG.parent
V1="971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05";A5X_ROOT="c5b35bbbbc7551fb5cddd8cc5468ba0aa8bcf4e895ef8bbe0b55f341821c4100"
SEEDS=[f"SYNTH_{i:02d}" for i in range(30)];CARRIERS=["T","F"];REPS=["TRAJECTORY","LEARNED_FIELD"];ACTIONS=[-.5,-.25,0,.25,.5];FAMILIES=["N1","N2","N3","N4_T","N4_F"]
def fail(m):raise ValueError(m)
def need(x,m):
 if not x:fail(m)
def finite(x):return type(x) in (int,float) and math.isfinite(x)
def canon(x):return json.dumps(x,sort_keys=True,separators=(",",":"),allow_nan=False).encode()
def digest(x):return hashlib.sha256(canon(x)).hexdigest()
def get(d,p):
 for k in p.split("."):d=d[k]
 return d
def setp(d,p,v):
 q=d
 for k in p.split(".")[:-1]:q=q[k]
 q[p.split(".")[-1]]=copy.deepcopy(v)
def delp(d,p):
 q=copy.deepcopy(d);t=q;ks=p.split(".")
 for k in ks[:-1]:t=t[k]
 del t[ks[-1]];return q
def primary_config():return json.loads((LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/EXP_00_R_FROZEN_CONFIG.yaml").read_text())
def a4():return json.loads((LAB/"EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A4/A4_MACHINE_READABLE_RULES.yaml").read_text())
def expected_provenance(kind,identity):return {"artifact_type":kind,"stage":"SYNTHETIC_CONTRACT_FIXTURE","v1_composite":V1,"a5x_authority_root":A5X_ROOT,"identity":identity,"scientific_config_sha256":hashlib.sha256((LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/EXP_00_R_FROZEN_CONFIG.yaml").read_bytes()).hexdigest()}
def check_provenance(p,kind,identity):return p==expected_provenance(kind,identity)
def expand(x):
 need(type(x) is dict and x.get("encoding")=="constant" and x.get("count")==200 and finite(x.get("value")),"compressed vector");return [x["value"]]*200
def expand_count(x,n):need(type(x) is dict and x.get("encoding")=="constant" and x.get("count")==n and finite(x.get("value")),"compressed vector count");return [x["value"]]*n
def linear_quantile(v,p):
 v=sorted(v);h=(len(v)-1)*p;i=int(h);f=h-i;return v[i] if i==len(v)-1 else v[i]*(1-f)+v[i+1]*f
def mc(obs,null):return sum(x>=obs for x in null)<=4

def derive_support(a):
 need(a.get("registry_id")=="SYNTHETIC_30_SEED_REGISTRY" and a.get("seed_ids")==SEEDS,"support registry")
 blocks=a.get("seed_blocks");need(type(blocks) is list and len(blocks)==30 and {x.get("seed_id") for x in blocks}==set(SEEDS),"support seeds")
 rows=set();qual=0;total=joint=to=fo=0
 for b in blocks:
  need(set(b)=={"seed_id","total_rows","joint_supported_rows","both_nonzero_rows","row_id_prefix"},"support block fields");need(type(b["total_rows"]) is int and type(b["joint_supported_rows"]) is int and type(b["both_nonzero_rows"]) is int and 0<=b["both_nonzero_rows"]<=b["joint_supported_rows"]<=b["total_rows"]==50,"support counts")
  ids={f'{b["row_id_prefix"]}.{i}' for i in range(b["total_rows"])};need(not rows&ids,"duplicate rows");rows|=ids;total+=b["total_rows"];joint+=b["joint_supported_rows"]
  if b["both_nonzero_rows"]>=20:qual+=1
 need(total==1500,"support total");f=a.get("fractions");need(set(f)=={"T_oos","F_oos","joint"} and all(finite(v) and 0<=v<=1 for v in f.values()),"support fractions")
 need(f["T_oos"]<=.10 and f["F_oos"]<=.10 and f["joint"]>=.80 and joint/total==f["joint"] and qual>=20,"support thresholds")
 need(check_provenance(a.get("provenance"),"SUPPORT","SYNTHETIC_30_SEED_REGISTRY"),"support provenance");return True

def derive_dominance(a):
 need(a.get("seed_registry")==SEEDS,"dominance registry");out={}
 for c in CARRIERS:
  rec=a.get("carriers",{}).get(c);need(type(rec) is list,"dominance carrier");seen=set();vals=[];N=0
  for s in rec:
   sid=s.get("seed_id");need(sid in SEEDS and sid not in seen,"dominance seed");seen.add(sid);l0=s.get("loss0");l1=s.get("loss1");need(type(l0) is list and type(l1) is list and len(l0)==len(l1),"dominance losses");N+=len(l0);vals.append((sid,l0,l1))
  need(N>0 and len(vals)>=3,"dominance eligible")
  gs=[]
  for sid,l0,l1 in vals:
   g=sum((Fraction.from_float(float(x))-Fraction.from_float(float(y)) for x,y in zip(l0,l1)),Fraction())/N;gs.append((sid,g))
  G=sum((g for _,g in gs),Fraction());need(G>0,"dominance G")
  top=sorted(gs,key=lambda z:(-z[1],z[0]))[:3];D3=sum((g for _,g in top),Fraction());out[c]={"pass":2*D3<=G,"G":G,"D3":D3,"top_seeds":[s for s,_ in top]};need(out[c]["pass"],"dominance >50")
 need(check_provenance(a.get("provenance"),"SEED_DOMINANCE","T_F"),"dominance provenance");return out

def expected_null_meta(name):
 base={"replicate_ids":{"start":0,"stop_inclusive":199,"count":200},"population":"SYNTHETIC_FIXED_JOINT_POPULATION","support":"FROZEN_NO_ROW_DROP","action_order":ACTIONS,"rng":"SHA256_FIRST8_BIG_ENDIAN_NUMPY_2.3.5_PCG64","required_statistics":["mean_coherence","top_action_agreement","T_gain","F_gain"]}
 specs={"N1":{"unit":"REPRESENTATION_X_TRAIN_SEED_X_REPLICATE","rule":"FORWARD_ACTION_LABEL_REFIT_BOTH_PHYSICAL_OUTCOME_LOOKUP"},"N2":{"unit":"WITHIN_SPLIT_AND_SEED","rule":"FIELD_WEAK_RANK_WITHOUT_REPLACEMENT_RECIPIENT_GETS_DONOR"},"N3":{"unit":"ONE_PER_RECIPIENT_WITH_REPLACEMENT","rule":"DIFFERENT_SEED_SAME_MAPPED_PHASE_TARGET_CLOCKWISE_DECREASING_RIGHT_INSERTION"},"N4_T":{"unit":"SPLIT_CARRIER_TARGET_MAGNITUDE_MERGED_DECILE","rule":"FULL_TRAINING_LOO_DISTANCE_HIGHER_FIRST_T_CARRIER"},"N4_F":{"unit":"SPLIT_CARRIER_TARGET_MAGNITUDE_MERGED_DECILE","rule":"FULL_TRAINING_LOO_DISTANCE_HIGHER_FIRST_F_CARRIER"}}
 return base|specs[name]
def validate_nulls(a):
 need(set(a)==set(FAMILIES),"null families")
 out={}
 for f in FAMILIES:
  x=a[f];need(x.get("family")==f and x.get("metadata")==expected_null_meta(f),"null metadata")
  need(check_provenance(x.get("provenance"),"NULL_FAMILY",f),"null provenance")
  stats=x.get("statistics");need(set(stats)==set(expected_null_meta(f)["required_statistics"]),"null statistics");out[f]={k:expand(v) for k,v in stats.items()}
 return out

def validate_n5(a):
 mats=a4()["N5"]["matrices"];need(set(a)=={"REGISTRY","SYNTH","RUN"} and a["REGISTRY"]==[{"transform_id":i,"matrix":m,"determinant":1} for i,m in enumerate(mats)],"N5 registry")
 for tier in ["SYNTH","RUN"]:
  x=a[tier];need(x.get("tier")==f"N5_{tier}" and x.get("stage")==({"SYNTH":"PRE_AUTH","RUN":"POST_FIT_PRE_OUTCOME"}[tier]),"N5 tier")
  need(x.get("metadata")=={"transform_order":"FIRST_12_DET_PLUS_1_SIGNED_PERMUTATIONS_LEXICOGRAPHIC","refit":["TRAJECTORY","LEARNED_FIELD"],"B_transform":"Q@B","target_transform":"Q@TARGET_NO_RESELECT","paths":"ALL_ACTION_CONDITIONED_PATH_STATES_TRANSFORMED","support":"REFIT_FROZEN_RULE","inverse_registration":"Q_TRANSPOSE_BEFORE_SCORE","population":"SYNTHETIC_FIXED_JOINT_POPULATION","statistic":"KENDALL_TAU_B","aggregation":"MINIMUM","threshold":.99},"N5 metadata")
  rec=x.get("transforms");need(type(rec) is list and len(rec)==12 and [r.get("transform_id") for r in rec]==list(range(12)),"N5 transforms")
  for i,r in enumerate(rec):need(set(r)=={"transform_id","comparisons"} and r.get("transform_id")==i and type(r.get("comparisons")) is list and r["comparisons"] and all(finite(q) and q>=.99 for q in r["comparisons"]),"N5 transform record")
  need(check_provenance(x.get("provenance"),"N5_TIER",tier),"N5 provenance")
 return True

SENS=[("ACTION_AMPLITUDE_0.25","actions.primary_amplitude",.5,.25,True),("ACTION_AMPLITUDE_1.0","actions.primary_amplitude",.5,1.0,True),("TRAJECTORY_NEIGHBORS_15","representations.trajectory.neighbors",25,15,False),("TRAJECTORY_NEIGHBORS_50","representations.trajectory.neighbors",25,50,False),("LEARNED_FIELD_NEIGHBORS_60","representations.learned_field.neighbors",100,60,False),("LEARNED_FIELD_NEIGHBORS_160","representations.learned_field.neighbors",100,160,False),("HORIZON_0.5","plant.evaluation_horizon",1.0,.5,False),("HORIZON_1.5","plant.evaluation_horizon",1.0,1.5,False),("TRAINING_SEED_HALF_5000_5014","data.train_seeds",{"start":5000,"stop_inclusive":5029,"count":30},{"start":5000,"stop_inclusive":5014,"count":15},False),("TRAINING_SEED_HALF_5015_5029","data.train_seeds",{"start":5000,"stop_inclusive":5029,"count":30},{"start":5015,"stop_inclusive":5029,"count":15},False),("SUPPORT_QUANTILE_0.95","support.threshold_quantile",.99,.95,False),("SUPPORT_QUANTILE_0.995","support.threshold_quantile",.99,.995,False)]
def validate_sensitivities(a):
 need(type(a) is dict and set(a)=={"records","results","provenance_binding"},"sensitivity bundle");records=a["records"];need(type(records) is list and len(records)==12 and len({x.get("sensitivity_id") for x in records})==12,"sensitivity cardinality");by={x["sensitivity_id"]:x for x in records};need(set(by)=={s[0] for s in SENS} and set(a["results"])==set(by),"sensitivity ids");p=primary_config();pb=a["provenance_binding"];need(pb=={"stage":"SYNTHETIC_CONTRACT_FIXTURE","v1_composite":V1,"a5x_authority_root":A5X_ROOT,"scientific_config_sha256":hashlib.sha256((LAB/"EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/EXP_00_R_FROZEN_CONFIG.yaml").read_bytes()).hexdigest()},"sensitivity provenance binding")
 for sid,path,pv,sv,p5 in SENS:
  x=by[sid];need(x.get("changed_factor_path")==path and x.get("primary_value")==pv and x.get("sensitivity_value")==sv,"sensitivity identity");need(get(p,path)==pv,"primary value");q=copy.deepcopy(p);setp(q,path,sv);need(x.get("variant_config_sha256")==digest(q) and x.get("unchanged_config_sha256")==digest(delp(p,path)),"sensitivity config")
  rr=a["results"][sid];need(set(rr)=={"carrier_results","support"},"sensitivity result record");cr=rr.get("carrier_results");need(set(cr)==set(CARRIERS) and all(set(cr[c])=={"coefficient","gain"} and all(finite(v) for v in cr[c].values()) for c in CARRIERS),"sensitivity results");sp=rr.get("support");need(set(sp)=={"T_oos","F_oos","joint","contributing_seeds","rows_per_seed"} and all(finite(sp[k]) and 0<=sp[k]<=1 for k in ["T_oos","F_oos","joint"]) and type(sp["contributing_seeds"]) is int and 0<=sp["contributing_seeds"]<=30 and set(sp["rows_per_seed"])<=set(SEEDS) and all(type(v) is int and 0<=v<=50 for v in sp["rows_per_seed"].values()),"sensitivity support")
 return True

def derive_p1_p5(b,nulls,dom):
 obs=b["observed"];need(set(obs["agreement"])=={"mean_coherence","top_action_agreement"},"agreement")
 P1=all(mc(obs["agreement"][stat],nulls[f][stat]) for stat in obs["agreement"] for f in FAMILIES)
 P2=all(finite(obs["carriers"][c]["coefficient"]) and obs["carriers"][c]["coefficient"]>0 and linear_quantile(expand_count(obs["carriers"][c]["bootstrap_coefficients"],500),.025)>0 for c in CARRIERS)
 P3=all(obs["carriers"][c]["gain"]>0 and obs["carriers"][c]["brier_augmented"]<=obs["carriers"][c]["brier_baseline"] and all(mc(obs["carriers"][c]["gain"],nulls[f][f"{c}_gain"]) for f in ["N1","N2","N3",f"N4_{c}"]) for c in CARRIERS)
 at=b["attribution"];need(set(at["mandatory_report_only"])=={"TRAJECTORY_ONLY_OUTCOME_PREDICTION","LEARNED_FIELD_ONLY_OUTCOME_PREDICTION","EQUAL_SCORE_FUSION_CARRIER"},"P4 report only");dirs={c:expand_count(at["per_seed_directions"][c],30) for c in CARRIERS};P4=all(obs["carriers"][c]["coefficient"]>0 and obs["carriers"][c]["gain"]>0 and sum(x>=0 for x in dirs[c])>=21 and dom[c]["pass"] for c in CARRIERS) and at["score_margin_controls"]==["T_SCORE","T_MARGIN","F_SCORE","F_MARGIN"]
 amp={x["sensitivity_id"]:x for x in b["sensitivities"]["records"]};results=b["sensitivities"]["results"];P5=all(results[s]["carrier_results"][c]["coefficient"]>0 and results[s]["carrier_results"][c]["gain"]>0 for s in ["ACTION_AMPLITUDE_0.25","ACTION_AMPLITUDE_1.0"] if s in amp for c in CARRIERS) and all(s in amp for s in ["ACTION_AMPLITUDE_0.25","ACTION_AMPLITUDE_1.0"])
 return {"P1":P1,"P2":P2,"P3":P3,"P4":P4,"P5":P5}
def classify(valid,P,obs):
 if not valid:return "INVALID EXPERIMENT"
 cores=[obs["carriers"][c]["coefficient"]>0 and obs["carriers"][c]["gain"]>0 for c in CARRIERS];neg=any(linear_quantile(expand_count(obs["carriers"][c]["bootstrap_coefficients"],500),.975)<0 for c in CARRIERS)
 if all(P.values()) and all(cores) and not neg:return "REPLICATED"
 if any(cores) and not neg:return "PARTIALLY REPLICATED"
 return "NOT REPLICATED"
def end_to_end(b):
 need(b.get("schema")=="A5XR_RAW_V1" and b.get("registry")=={"seeds":SEEDS,"carriers":CARRIERS,"representations":REPS,"actions":ACTIONS},"bundle registry");support=derive_support(b["support"]);nulls=validate_nulls(b["nulls"]);n5=validate_n5(b["n5"]);dom=derive_dominance(b["seed_dominance"]);sens=validate_sensitivities(b["sensitivities"]);P=derive_p1_p5(b,nulls,dom);valid=all([support,n5,sens]);label=classify(valid,P,b["observed"])
 cache=b.get("NONAUTHORITATIVE_CACHE",{});need(not cache or cache=={"P":P,"classification":label},"cache mismatch");return {"support":support,"nulls":True,"n5":n5,"dominance":{c:dom[c]["pass"] for c in CARRIERS},"sensitivities":sens,"P":P,"valid":valid,"classification":label,"cross_system":"PARTIAL CROSS-SYSTEM REPLICATION" if label in {"REPLICATED","PARTIALLY REPLICATED"} else "NON-REPLICATION"}
