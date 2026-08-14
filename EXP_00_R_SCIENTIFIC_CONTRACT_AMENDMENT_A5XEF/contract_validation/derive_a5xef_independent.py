"""Independent A5XEF derivation; imports no reference-derived helper."""
from __future__ import annotations

from fractions import Fraction
import hashlib
import math

import numpy as np
import a5xef_schema as raw


class Rejection(Exception): pass
def check(x,m):
    if not x: raise Rejection(m)


def scan(value):
    banned={"support_pass","null_pass","bootstrap_ci","n5_pass","dominance_pass","sensitivity_pass","P1","P2","P3","P4","P5","validity","classification","p4_controls_present","mandatory_diagnostics"}
    if isinstance(value,dict):
        check(not(set(value)&banned),"summary injection")
        for x in value.values():scan(x)
    elif isinstance(value,list):
        for x in value:scan(x)


def train_model(matrix,target,spec):
    check(spec==raw.model_spec(),"model contract");x=np.asarray(matrix,float);y=np.asarray(target,float);check(len(x)==len(y) and len(set(y))==2,"fit")
    center=np.mean(x,axis=0);spread=np.std(x,axis=0);spread[spread==0]=1;design=np.column_stack((np.ones(len(x)),(x-center)/spread));beta=np.zeros(design.shape[1]);ridge=np.diag([0]+[1/spec["C"]]*(design.shape[1]-1));used=0
    for used in range(1,spec["max_iter"]+1):
        probability=1/(1+np.exp(-np.clip(design@beta,-spec["linear_predictor_clip"],spec["linear_predictor_clip"])));curvature=probability*(1-probability)
        delta=np.linalg.solve(design.T@(design*curvature[:,None])+ridge,design.T@(probability-y)+ridge@beta);beta=beta-delta
        if float(np.sqrt(delta@delta))<spec["tolerance"]:break
    return center,spread,beta,used,raw.digest(spec)


def forecast(model,matrix,spec):
    center,spread,beta,_,binding=model;check(binding==raw.digest(spec),"model binding");z=np.c_[np.ones(len(matrix)),(np.asarray(matrix)-center)/spread]
    return 1/(1+np.exp(-np.clip(z@beta,-spec["linear_predictor_clip"],spec["linear_predictor_clip"])))


def logloss(y,p,spec):
    p=np.clip(p,*spec["probability_clip"]);y=np.asarray(y);return float(np.mean(-y*np.log(p)-(1-y)*np.log(1-p)))


def expand(bundle,source=None):
    manifest=bundle["manifest"];seeds=manifest["seed_ids"];source=bundle["observed_rows"] if source is None else source
    check(len(seeds)==30 and len(set(seeds))==30 and all(raw.ID_PATTERN.fullmatch(x) for x in seeds),"seeds");actions=manifest["actions"];check(manifest["registered"] is False and manifest["splits"]==raw.SPLITS and manifest["rows_per_seed_per_split"]==50 and len(actions)==5 and actions[2]==0 and actions[0]==-actions[4] and actions[1]==-actions[3],"manifest")
    expected=[f"{split}:{seed}:{number:02d}" for split in raw.SPLITS for seed in seeds for number in range(50)];ordered=sorted(source,key=lambda x:(raw.SPLITS.index(x["split"]),seeds.index(x["seed_id"]),x["decision_index"]));check([x["row_id"] for x in ordered]==expected,"rows")
    result=[]
    for item in ordered:
        check(set(item)=={"row_id","split","seed_id","decision_index","state_id","state","state_signal","T_scores","F_scores","T_support_distance","F_support_distance","action_success"},"row schema")
        check(item["row_id"]==f'{item["split"]}:{item["seed_id"]}:{item["decision_index"]:02d}' and item["state_id"]==f'STATE:{item["split"]}:{item["seed_id"]}:{item["decision_index"]:02d}',"row identity")
        check(len(item["T_scores"])==len(item["F_scores"])==len(item["action_success"])==5,"row")
        t=raw.rank(item["T_scores"]);f=raw.rank(item["F_scores"]);result.append({**item,"T_rank":t,"F_rank":f,"coherence":(1+raw.tau(t,f))/2,"T_supported":item["T_support_distance"]<=manifest["support_thresholds"]["T"],"F_supported":item["F_support_distance"]<=manifest["support_thresholds"]["F"]})
        result[-1]["joint"]=result[-1]["T_supported"] and result[-1]["F_supported"]
    return result


def partition(rows,seeds,actions=raw.ACTIONS):
    groups={"RAW":rows,"TRAIN":[x for x in rows if x["split"]=="TRAIN_OOF"],"TEST":[x for x in rows if x["split"]=="TEST"]};groups["JOINT_TRAIN"]=[x for x in groups["TRAIN"] if x["joint"]];groups["JOINT_TEST"]=[x for x in groups["TEST"] if x["joint"]];groups["NONZERO_TEST"]=[x for x in groups["JOINT_TEST"] if actions[x["T_rank"].index(0)] and actions[x["F_rank"].index(0)]]
    t=1-sum(x["T_supported"] for x in groups["TEST"])/len(groups["TEST"]);f=1-sum(x["F_supported"] for x in groups["TEST"])/len(groups["TEST"]);counts={seed:sum(x["seed_id"]==seed for x in groups["NONZERO_TEST"]) for seed in seeds};valid=t<=.1 and f<=.1 and len(groups["JOINT_TEST"])/len(groups["TEST"])>=.8 and sum(v>=20 for v in counts.values())>=20
    identifiers={k:[x["row_id"] for x in v] for k,v in groups.items()};return groups,{"valid":valid,"T_oos":t,"F_oos":f,"joint_fraction":len(groups["JOINT_TEST"])/len(groups["TEST"]),"both_nonzero_by_seed":counts,"population_ids":identifiers,"population_hashes":{k:raw.digest(v) for k,v in identifiers.items()}}


def base_vector(row,ranking,mode="PRIMARY",actions=raw.ACTIONS):
    ts=sorted(row["T_scores"],reverse=True);fs=sorted(row["F_scores"],reverse=True);action=actions[ranking.index(0)];full=[row["state_signal"],ts[0],ts[0]-ts[1],fs[0],fs[0]-fs[1],abs(action),0 if action==0 else np.sign(action)]
    if mode=="T_ONLY":return [full[i] for i in [0,1,2,5,6]]
    if mode=="F_ONLY":return [full[i] for i in [0,3,4,5,6]]
    return full


def score(training,testing,carrier,spec,rtrain=None,rtest=None,mode="PRIMARY",actions=raw.ACTIONS):
    key=carrier+"_rank";rtrain=rtrain if rtrain is not None else [x[key] for x in training];rtest=rtest if rtest is not None else [x[key] for x in testing]
    a=np.asarray([x["action_success"][r.index(0)] for x,r in zip(training,rtrain)]);b=np.asarray([x["action_success"][r.index(0)] for x,r in zip(testing,rtest)]);xt=np.asarray([base_vector(x,r,mode,actions) for x,r in zip(training,rtrain)]);xe=np.asarray([base_vector(x,r,mode,actions) for x,r in zip(testing,rtest)])
    m0=train_model(xt,a,spec);m1=train_model(np.c_[xt,[x["coherence"] for x in training]],a,spec);p0=forecast(m0,xe,spec);p1=forecast(m1,np.c_[xe,[x["coherence"] for x in testing]],spec)
    return {"coefficient":float(m1[2][-1]),"gain":logloss(b,p0,spec)-logloss(b,p1,spec),"brier0":float(np.mean((b-p0)**2)),"brier1":float(np.mean((b-p1)**2)),"labels":b,"p0":p0,"p1":p1,"design_columns":raw.model_spec()["baseline_features"] if mode=="PRIMARY" else mode,"spec_sha256":raw.digest(spec)}


def concordance(t,f):
    values=np.asarray([(1+raw.tau(x,y))/2 for x,y in zip(t,f)]);return values,float(np.mean(values)),float(np.mean([x.index(0)==y.index(0) for x,y in zip(t,f)]))


def generator(family,repetition,suffix):
    token={"N1":"action_label","N2":"rank_within_seed","N3":"state_mismatch","N4_T":"support_matched","N4_F":"support_matched"}[family];number=int.from_bytes(hashlib.sha256(f"{raw.CONFIG_ID}|{token}|{repetition}{suffix}".encode()).digest()[:8],"big");return np.random.Generator(np.random.PCG64(number))


def randomized(rows,family,repetition,seeds):
    t=[list(x["T_rank"]) for x in rows];f=[list(x["F_rank"]) for x in rows]
    if family=="N1":
        for label,array in [("TRAJECTORY",t),("LEARNED_FIELD",f)]:
            for seed in seeds:
                p=generator(family,repetition,f"|REP={label}|SEED={seed}").permutation(5)
                for index,row in enumerate(rows):
                    if row["seed_id"]==seed:
                        replacement=[0]*5
                        for action in range(5):replacement[int(p[action])]=array[index][action]
                        array[index]=replacement
    elif family=="N2":
        original=[list(x) for x in f]
        for split in raw.SPLITS:
            for seed in seeds:
                ids=[i for i,x in enumerate(rows) if x["split"]==split and x["seed_id"]==seed];p=generator(family,repetition,f"|SPLIT={split}|SEED={seed}").permutation(len(ids))
                for place,index in enumerate(ids):f[index]=original[ids[int(p[place])]]
    elif family=="N3":
        original=[list(x) for x in f]
        for index,row in enumerate(rows):
            pool=[i for i,x in enumerate(rows) if x["split"]==row["split"] and x["decision_index"]==row["decision_index"] and x["seed_id"]!=row["seed_id"]];choice=int(generator(family,repetition,f'|SPLIT={row["split"]}|ROW={row["row_id"]}').integers(len(pool)));f[index]=original[pool[choice]]
    else:
        carrier=family[-1];original=[list(x) for x in f];groups={}
        for index,row in enumerate(rows):groups.setdefault((row["split"],abs(raw.ACTIONS[row[carrier+"_rank"].index(0)]),min(9,int(row[carrier+"_support_distance"]*10))),[]).append(index)
        for key,ids in groups.items():
            p=generator(family,repetition,f"|SPLIT={key[0]}|CARRIER={carrier}|STRATUM=M{key[1]};D{key[2]}").permutation(len(ids))
            for place,index in enumerate(ids):f[index]=original[ids[int(p[place])]]
    return t,f


def null_analysis(training,testing,seeds,spec,evidence):
    check(set(evidence)==set(raw.FAMILIES),"null families");rows=training+testing;n=len(training);ct,_,_=concordance([x["T_rank"] for x in training],[x["F_rank"] for x in training]);ce,mean,top=concordance([x["T_rank"] for x in testing],[x["F_rank"] for x in testing])
    for row,value in zip(rows,np.r_[ct,ce]):row["coherence"]=float(value)
    observed={"mean_coherence":mean,"top_action_agreement":top,"carriers":{c:score(training,testing,c,spec) for c in raw.CARRIERS}};worlds={f:[] for f in raw.FAMILIES}
    for family in raw.FAMILIES:
        check([x["replicate_id"] for x in evidence[family]]==list(range(200)),"null reps")
        for record in evidence[family]:
            check(record=={"family":family,"replicate_id":record["replicate_id"],"population_source":"DERIVED_ORIGINAL_JOINT","rng_contract":"A3_SHA256_PCG64"},"null evidence");t,f=randomized(rows,family,record["replicate_id"],seeds);a,_,_=concordance(t[:n],f[:n]);b,m,topvalue=concordance(t[n:],f[n:]);saved=[x["coherence"] for x in rows]
            for row,value in zip(rows,np.r_[a,b]):row["coherence"]=float(value)
            metrics={c:score(training,testing,c,spec,t[:n] if c=="T" else f[:n],t[n:] if c=="T" else f[n:]) for c in raw.CARRIERS}
            for row,value in zip(rows,saved):row["coherence"]=value
            worlds[family].append({"mean_coherence":m,"top_action_agreement":topvalue,"T_coefficient":metrics["T"]["coefficient"],"F_coefficient":metrics["F"]["coefficient"],"T_gain":metrics["T"]["gain"],"F_gain":metrics["F"]["gain"]})
    return observed,worlds


def resample(test,seeds,spec,evidence):
    check(evidence=={"cluster_unit":"TEST_SEED","seed":20260808,"replicate_ids":list(range(500))},"bootstrap");g=np.random.Generator(np.random.PCG64(20260808));answer={c:[] for c in raw.CARRIERS}
    for _ in evidence["replicate_ids"]:
        chosen=g.choice(np.asarray(seeds),30,replace=True).tolist();population=[row for seed in chosen for row in test if row["seed_id"]==seed]
        for c in raw.CARRIERS:answer[c].append(score(population,population,c,spec)["coefficient"])
    return answer


def n5(evidence):
    check(evidence["matrix_registry"]==raw.signed_permutations(),"matrices");result={}
    for tier in ["SYNTH","RUN"]:
        record=evidence[tier];check(record["population_sha256"]==raw.digest(record["population_row_ids"]) and len(record["population_row_ids"])>=20 and len(record["transforms"])==12,"N5 population");values=[]
        for index,item in enumerate(record["transforms"]):
            q=np.asarray(item["Q"]);check(item["transform_id"]==index and item["Q"]==evidence["matrix_registry"][index] and item["refits"]==raw.REPRESENTATIONS,"N5 identity")
            for query in item["query_inputs"]:check(np.allclose(q@query["original"],query["transformed"],atol=1e-12),"N5 transform")
            for pair in item["comparisons"]:check(np.allclose(q.T@pair["transformed_terminal"],pair["original_terminal"],atol=1e-12),"registration");values.append(raw.tau(pair["original_rank"],pair["transformed_rank"]))
        result[tier]=min(values)>=.99
    return result


def attribution(test,observed):
    result={};N=len(test)
    for c in raw.CARRIERS:
        metric=observed["carriers"][c];contrib=[];directions={}
        for seed in sorted({x["seed_id"] for x in test}):
            ids=[i for i,x in enumerate(test) if x["seed_id"]==seed];co=np.asarray([test[i]["coherence"] for i in ids]);y=metric["labels"][ids];directions[seed]=0. if np.std(co)==0 or np.std(y)==0 else float(np.corrcoef(co,y)[0,1]);amount=Fraction()
            for i in ids:
                yy=int(metric["labels"][i]);p0=float(np.clip(metric["p0"][i],1e-15,1-1e-15));p1=float(np.clip(metric["p1"][i],1e-15,1-1e-15));amount+=Fraction.from_float(-math.log(p0 if yy else 1-p0))-Fraction.from_float(-math.log(p1 if yy else 1-p1))
            contrib.append((seed,amount/N))
        result[c]={"directions":directions,"at_least_21":sum(x>=0 for x in directions.values())>=21,"dominance":dominance(contrib)}
    return result


def dominance(contributions):
    if len(contributions)<3:return {"valid":False,"pass":False,"reason":"FEWER_THAN_THREE"}
    G=sum((x[1] for x in contributions),Fraction());D=sum((x[1] for x in sorted(contributions,key=lambda x:(-x[1],x[0]))[:3]),Fraction());passed=G>0 and 2*D<=G
    return {"valid":True,"pass":passed,"G":[G.numerator,G.denominator],"D3":[D.numerator,D.denominator],"reason":"PASS" if passed else "NONPOSITIVE_G" if G<=0 else "DOMINATED"}


def reports(training,testing,spec):
    answer={}
    for c,mode in [("T","T_ONLY"),("F","F_ONLY")]:
        m=score(training,testing,c,spec,mode=mode);answer[mode]={k:m[k] for k in ["coefficient","gain","brier0","brier1","design_columns","spec_sha256"]}
    rt=[raw.rank([(a+b)/2 for a,b in zip(x["T_scores"],x["F_scores"])]) for x in training];re=[raw.rank([(a+b)/2 for a,b in zip(x["T_scores"],x["F_scores"])]) for x in testing];m=score(training,testing,"T",spec,rt,re);answer["EQUAL_SCORE_FUSION"]={k:m[k] for k in ["coefficient","gain","brier0","brier1","design_columns","spec_sha256"]};return answer


def variants(bundle,spec):
    expected={x[1]:x for x in raw.SENSITIVITY_REGISTRY};records=bundle["sensitivities"];check(len(records)==12 and {x["sensitivity_id"] for x in records}==set(expected),"sensitivities");answer={}
    for record in sorted(records,key=lambda x:x["ordinal"]):
        ordinal,sid,path,primary,value,p5=expected[record["sensitivity_id"]];check((record["ordinal"],record["changed_factor_path"],record["primary_value"],record["sensitivity_value"],record["p5"])==(ordinal,path,primary,value,p5),"sensitivity identity");configuration=raw.patch_config(bundle["primary_config"],path,value);check(record["variant_config"]==configuration and record["variant_config_sha256"]==raw.digest(configuration) and record["unchanged_config_sha256"]==raw.digest(raw.without_path(bundle["primary_config"],path)),"sensitivity configuration");check(record["required_outputs"]==["T_COEFFICIENT","T_GAIN","F_COEFFICIENT","F_GAIN","SUPPORT","PROVENANCE"],"outputs")
        manifest={**bundle["manifest"],"actions":record["variant_actions"],"support_thresholds":record["variant_support_thresholds"]};temporary={**bundle,"manifest":manifest};expanded=expand(temporary,record["variant_rows"]);groups,support=partition(expanded,bundle["manifest"]["seed_ids"],record["variant_actions"]);training=[row for row in groups["JOINT_TRAIN"] if row["seed_id"] in record["variant_train_seed_ids"]];check(support["valid"] and training and record["contributing_seed_ids"]==bundle["manifest"]["seed_ids"] and record["rows_per_seed"]=={x:50 for x in bundle["manifest"]["seed_ids"]},"sensitivity population");answer[sid]={c:{k:v for k,v in score(training,groups["JOINT_TEST"],c,spec,actions=record["variant_actions"]).items() if k in {"coefficient","gain"}} for c in raw.CARRIERS};answer[sid]["support"]=support
    return answer


def precheck(bundle):
    check(set(bundle["null_worlds"])==set(raw.FAMILIES),"null set")
    for family in raw.FAMILIES:
        check(len(bundle["null_worlds"][family])==200,"null count")
        for rep,item in enumerate(bundle["null_worlds"][family]):check(item=={"family":family,"replicate_id":rep,"population_source":"DERIVED_ORIGINAL_JOINT","rng_contract":"A3_SHA256_PCG64"},"null record")
    check(bundle["bootstrap"]=={"cluster_unit":"TEST_SEED","seed":20260808,"replicate_ids":list(range(500))},"bootstrap registry")
    expected={x[1]:x for x in raw.SENSITIVITY_REGISTRY};records=bundle["sensitivities"];check(len(records)==12 and {x.get("sensitivity_id") for x in records}==set(expected),"sensitivity set")
    for item in records:
        ordinal,sid,path,primary,value,p5=expected[item["sensitivity_id"]];check((item.get("ordinal"),item.get("changed_factor_path"),item.get("primary_value"),item.get("sensitivity_value"),item.get("p5"))==(ordinal,path,primary,value,p5),"sensitivity metadata");config=raw.patch_config(bundle["primary_config"],path,value);check(item.get("variant_config")==config and item.get("variant_config_sha256")==raw.digest(config) and item.get("unchanged_config_sha256")==raw.digest(raw.without_path(bundle["primary_config"],path)),"sensitivity hashes");check(item.get("contributing_seed_ids")==bundle["manifest"]["seed_ids"] and item.get("rows_per_seed")=={x:50 for x in bundle["manifest"]["seed_ids"]},"sensitivity rows");expected_actions=[-float(value),-float(value)/2,0.,float(value)/2,float(value)] if path=="actions.primary_amplitude" else raw.ACTIONS;expected_support={"T":float(value),"F":float(value)} if path=="support.threshold_quantile" else {"T":.99,"F":.99};expected_train=bundle["manifest"]["seed_ids"][:15] if value=="FROZEN_TRAIN_HALF_A" else bundle["manifest"]["seed_ids"][15:] if value=="FROZEN_TRAIN_HALF_B" else bundle["manifest"]["seed_ids"];check(item.get("variant_actions")==expected_actions and item.get("variant_support_thresholds")==expected_support and item.get("variant_train_seed_ids")==expected_train,"sensitivity operative binding");check(item.get("required_outputs")==["T_COEFFICIENT","T_GAIN","F_COEFFICIENT","F_GAIN","SUPPORT","PROVENANCE"] and len(item.get("variant_rows",[]))==3000,"sensitivity outputs")
    return True


def monte(observed,values):
    k=sum(x>=observed for x in values);return k<=4


def derive(bundle):
    try:
        scan(bundle);check(bundle.get("schema")=="A5XEF_GENERIC_RAW_EVIDENCE_V1" and bundle.get("authority_binding")=={"v1_composite":raw.V1,"registered_data":False,"fixture":True},"identity");parts=["manifest","primary_config","model_spec","observed_rows","null_worlds","bootstrap","n5","sensitivities","authority_binding"];ledger=bundle["provenance"];check(len(ledger)==len(parts) and {x["artifact_id"] for x in ledger}=={x.upper() for x in parts},"ledger")
        for part in parts:
            item=next(x for x in ledger if x["artifact_id"]==part.upper());check(item["sha256"]==raw.digest(bundle[part]) and item["parents"]==([] if part in {"manifest","authority_binding"} else ["MANIFEST","AUTHORITY_BINDING"]),"provenance")
        spec=bundle["model_spec"];check(spec==raw.model_spec(),"model spec");precheck(bundle);rows=expand(bundle);groups,support=partition(rows,bundle["manifest"]["seed_ids"]);check(support["valid"],"support");n=n5(bundle["n5"])
        if not n["SYNTH"]:return {"execution_state":"IMPLEMENTATION_FAILURE","classification":None,"release_permitted":False,"reason":"N5_SYNTH"}
        if not n["RUN"]:return {"execution_state":"INVALID_EXPERIMENT","classification":None,"release_permitted":False,"reason":"N5_RUN"}
        observed,nulls=null_analysis(groups["JOINT_TRAIN"],groups["JOINT_TEST"],bundle["manifest"]["seed_ids"],spec,bundle["null_worlds"]);boot=resample(groups["JOINT_TEST"],bundle["manifest"]["seed_ids"],spec,bundle["bootstrap"]);attr=attribution(groups["JOINT_TEST"],observed);diagnostics=reports(groups["JOINT_TRAIN"],groups["JOINT_TEST"],spec);sens=variants(bundle,spec)
        p1=all(monte(observed[x],[z[x] for z in nulls[f]]) for x in ["mean_coherence","top_action_agreement"] for f in raw.FAMILIES);p2=all(observed["carriers"][c]["coefficient"]>0 and np.quantile(boot[c],.025,method="linear")>0 for c in raw.CARRIERS);p3=all(observed["carriers"][c]["gain"]>0 and observed["carriers"][c]["brier1"]<=observed["carriers"][c]["brier0"] and all(monte(observed["carriers"][c]["gain"],[z[c+"_gain"] for z in nulls[f]]) for f in ["N1","N2","N3","N4_"+c]) for c in raw.CARRIERS);p4=all(observed["carriers"][c]["coefficient"]>0 and observed["carriers"][c]["gain"]>0 and observed["carriers"][c]["design_columns"]==raw.model_spec()["baseline_features"] and attr[c]["at_least_21"] and attr[c]["dominance"]["pass"] for c in raw.CARRIERS) and set(diagnostics)=={"T_ONLY","F_ONLY","EQUAL_SCORE_FUSION"};p5=all(sens[x][c]["coefficient"]>0 and sens[x][c]["gain"]>0 for x in ["ACTION_AMPLITUDE_0.25","ACTION_AMPLITUDE_1.0"] for c in raw.CARRIERS);P={"P1":p1,"P2":p2,"P3":p3,"P4":p4,"P5":p5};cores={c:observed["carriers"][c]["coefficient"]>0 and observed["carriers"][c]["gain"]>0 for c in raw.CARRIERS};negative={c:np.quantile(boot[c],.975,method="linear")<0 for c in raw.CARRIERS};check(not any(cores[c] and negative[c] for c in raw.CARRIERS),"bootstrap contradiction");label="REPLICATED" if all(P.values()) and all(cores.values()) else "PARTIALLY REPLICATED" if any(cores.values()) and not any(negative.values()) else "NOT REPLICATED";clean={"mean_coherence":observed["mean_coherence"],"top_action_agreement":observed["top_action_agreement"],"carriers":{c:{k:observed["carriers"][c][k] for k in ["coefficient","gain","brier0","brier1","design_columns","spec_sha256"]} for c in raw.CARRIERS}}
        return {"execution_state":"VALID_SCIENTIFIC_RESULT","classification":label,"release_permitted":False,"support":support,"n5":n,"observed":clean,"nulls_sha256":raw.digest(nulls),"bootstrap_ci":{c:[float(np.quantile(boot[c],.025,method="linear")),float(np.quantile(boot[c],.975,method="linear"))] for c in raw.CARRIERS},"diagnostics":diagnostics,"attribution":attr,"sensitivities":{x:{c:sens[x][c] for c in raw.CARRIERS} for x in sens},"P":P,"cross_system":"PARTIAL CROSS-SYSTEM REPLICATION" if p1 and p2 and p3 and label in {"REPLICATED","PARTIALLY REPLICATED"} else "NON-REPLICATION","population_hashes":support["population_hashes"],"model_spec_sha256":raw.digest(spec)}
    except (Rejection,KeyError,TypeError,ValueError,np.linalg.LinAlgError) as error:return {"execution_state":"INVALID_EXPERIMENT","classification":None,"release_permitted":False,"reason":str(error)}
