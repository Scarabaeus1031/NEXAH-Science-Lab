"""Reference A5XEF contract-only derivation. Synthetic fixtures only."""
from __future__ import annotations

from fractions import Fraction
import hashlib
import math
import re

import numpy as np

import a5xef_schema as s


class EvidenceError(ValueError): pass


def require(condition, message):
    if not condition: raise EvidenceError(message)


def forbid_summaries(value):
    forbidden = {"support_pass", "null_pass", "bootstrap_ci", "n5_pass", "dominance_pass", "sensitivity_pass", "P1", "P2", "P3", "P4", "P5", "validity", "classification", "p4_controls_present", "mandatory_diagnostics"}
    if isinstance(value, dict):
        require(not (set(value) & forbidden), "producer summary")
        for child in value.values(): forbid_summaries(child)
    elif isinstance(value, list):
        for child in value: forbid_summaries(child)


def validate_model_spec(spec):
    require(spec == s.model_spec(), "model_spec")
    return spec


def fit(features, labels, spec):
    require(spec == s.model_spec(), "consumed model spec")
    x = np.asarray(features, dtype=float); y = np.asarray(labels, dtype=float)
    require(len(x) == len(y) and len(x) and len(np.unique(y)) == 2 and np.all(np.isfinite(x)), "fit population")
    mean, scale = x.mean(0), x.std(0); scale[scale == 0] = 1
    design = np.c_[np.ones(len(x)), (x - mean) / scale]; beta = np.zeros(design.shape[1])
    penalty = np.eye(len(beta)) / spec["C"]; penalty[0, 0] = 0
    iterations = 0
    for iterations in range(1, spec["max_iter"] + 1):
        p = 1 / (1 + np.exp(-np.clip(design @ beta, -spec["linear_predictor_clip"], spec["linear_predictor_clip"])))
        w = p * (1 - p); step = np.linalg.solve(design.T @ (design * w[:, None]) + penalty, design.T @ (p-y) + penalty @ beta)
        beta -= step
        if np.linalg.norm(step) < spec["tolerance"]: break
    return {"mean": mean, "scale": scale, "beta": beta, "iterations": iterations, "spec_sha256": s.digest(spec)}


def predict(model, features, spec):
    require(model["spec_sha256"] == s.digest(spec), "model provenance")
    design = np.c_[np.ones(len(features)), (np.asarray(features)-model["mean"])/model["scale"]]
    return 1/(1+np.exp(-np.clip(design @ model["beta"], -spec["linear_predictor_clip"], spec["linear_predictor_clip"])))


def loss(labels, probabilities, spec):
    lo, hi = spec["probability_clip"]; y=np.asarray(labels); p=np.clip(probabilities,lo,hi)
    return float(np.mean(-y*np.log(p)-(1-y)*np.log(1-p)))


def controls(row, carrier_rank, actions=s.ACTIONS):
    ts=sorted(row["T_scores"],reverse=True); fs=sorted(row["F_scores"],reverse=True)
    action=actions[carrier_rank.index(0)]
    return [row["state_signal"],ts[0],ts[0]-ts[1],fs[0],fs[0]-fs[1],abs(action),0 if action==0 else (1 if action>0 else -1)]


def derive_rows(bundle, rows=None):
    manifest=bundle["manifest"]; seeds=manifest["seed_ids"]; rows=bundle["observed_rows"] if rows is None else rows
    require(len(seeds)==30 and len(set(seeds))==30 and all(s.ID_PATTERN.fullmatch(seed) for seed in seeds),"seed registry")
    actions=manifest["actions"]
    require(manifest["registered"] is False and manifest["splits"]==s.SPLITS and manifest["rows_per_seed_per_split"]==50 and len(actions)==5 and actions[2]==0 and actions[0]==-actions[4] and actions[1]==-actions[3],"manifest")
    expected={f"{split}:{seed}:{i:02d}" for split in s.SPLITS for seed in seeds for i in range(50)}
    require(len(rows)==3000 and {r.get("row_id") for r in rows}==expected and len({r.get("row_id") for r in rows})==3000,"row universe")
    ordered=sorted(rows,key=lambda r:(s.SPLITS.index(r["split"]),seeds.index(r["seed_id"]),r["decision_index"]))
    output=[]; thresholds=manifest["support_thresholds"]
    for raw in ordered:
        require(set(raw)=={"row_id","split","seed_id","decision_index","state_id","state","state_signal","T_scores","F_scores","T_support_distance","F_support_distance","action_success"},"row schema")
        require(raw["seed_id"] in seeds and raw["split"] in s.SPLITS and len(raw["T_scores"])==len(raw["F_scores"])==len(raw["action_success"])==5,"row shape")
        require(raw["row_id"]==f'{raw["split"]}:{raw["seed_id"]}:{raw["decision_index"]:02d}' and raw["state_id"]==f'STATE:{raw["split"]}:{raw["seed_id"]}:{raw["decision_index"]:02d}',"row relational identity")
        require(all(math.isfinite(float(v)) for key in ["T_scores","F_scores","action_success","state"] for v in raw[key]),"finite row")
        tr,fr=s.rank(raw["T_scores"]),s.rank(raw["F_scores"]); coherence=(1+s.tau(tr,fr))/2
        t_ok=raw["T_support_distance"]<=thresholds["T"]; f_ok=raw["F_support_distance"]<=thresholds["F"]
        output.append({**raw,"T_rank":tr,"F_rank":fr,"coherence":coherence,"T_supported":t_ok,"F_supported":f_ok,"joint":t_ok and f_ok})
    return output


def populations(rows, seeds, actions=s.ACTIONS):
    sets={"RAW":rows,"TRAIN":[r for r in rows if r["split"]=="TRAIN_OOF"],"TEST":[r for r in rows if r["split"]=="TEST"]}
    sets["JOINT_TRAIN"]=[r for r in sets["TRAIN"] if r["joint"]]; sets["JOINT_TEST"]=[r for r in sets["TEST"] if r["joint"]]
    sets["NONZERO_TEST"]=[r for r in sets["JOINT_TEST"] if actions[r["T_rank"].index(0)]!=0 and actions[r["F_rank"].index(0)]!=0]
    t_oos=1-len([r for r in sets["TEST"] if r["T_supported"]])/len(sets["TEST"]); f_oos=1-len([r for r in sets["TEST"] if r["F_supported"]])/len(sets["TEST"])
    counts={seed:sum(r["seed_id"]==seed for r in sets["NONZERO_TEST"]) for seed in seeds}
    valid=t_oos<=.1 and f_oos<=.1 and len(sets["JOINT_TEST"])/len(sets["TEST"])>=.8 and sum(v>=20 for v in counts.values())>=20
    ids={key:[r["row_id"] for r in value] for key,value in sets.items()}
    return sets,{"valid":valid,"T_oos":t_oos,"F_oos":f_oos,"joint_fraction":len(sets["JOINT_TEST"])/len(sets["TEST"]),"both_nonzero_by_seed":counts,"population_ids":ids,"population_hashes":{k:s.digest(v) for k,v in ids.items()}}


def evaluate(train,test,carrier,spec,train_ranks=None,test_ranks=None,feature_mode="PRIMARY",actions=s.ACTIONS):
    key=carrier+"_rank"; train_ranks=train_ranks or [r[key] for r in train]; test_ranks=test_ranks or [r[key] for r in test]
    ytr=np.asarray([r["action_success"][rank.index(0)] for r,rank in zip(train,train_ranks)]); yte=np.asarray([r["action_success"][rank.index(0)] for r,rank in zip(test,test_ranks)])
    if feature_mode=="T_ONLY": base=lambda r,rank:[r["state_signal"],*sorted(r["T_scores"],reverse=True)[:1],[0]][0]  # replaced below
    def vector(r,rank):
        full=controls(r,rank,actions)
        if feature_mode=="PRIMARY": return full
        if feature_mode=="T_ONLY": return [full[0],full[1],full[2],full[5],full[6]]
        if feature_mode=="F_ONLY": return [full[0],full[3],full[4],full[5],full[6]]
        return full
    xtr=np.asarray([vector(r,rank) for r,rank in zip(train,train_ranks)]); xte=np.asarray([vector(r,rank) for r,rank in zip(test,test_ranks)])
    base=fit(xtr,ytr,spec); augmented=fit(np.c_[xtr,[r["coherence"] for r in train]],ytr,spec)
    p0=predict(base,xte,spec); p1=predict(augmented,np.c_[xte,[r["coherence"] for r in test]],spec)
    return {"coefficient":float(augmented["beta"][-1]),"gain":loss(yte,p0,spec)-loss(yte,p1,spec),"brier0":float(np.mean((yte-p0)**2)),"brier1":float(np.mean((yte-p1)**2)),"labels":yte,"p0":p0,"p1":p1,"design_columns":s.model_spec()["baseline_features"] if feature_mode=="PRIMARY" else feature_mode,"spec_sha256":s.digest(spec)}


def diagnostics(train,test,spec):
    answer={}
    for carrier,mode in [("T","T_ONLY"),("F","F_ONLY")]:
        metric=evaluate(train,test,carrier,spec,feature_mode=mode)
        answer[mode]={k:v for k,v in metric.items() if k in {"coefficient","gain","brier0","brier1","design_columns","spec_sha256"}}
    # Equal-score fusion action is derived rowwise, then evaluated as a carrier.
    train_rank=[s.rank([(a+b)/2 for a,b in zip(r["T_scores"],r["F_scores"])]) for r in train]
    test_rank=[s.rank([(a+b)/2 for a,b in zip(r["T_scores"],r["F_scores"])]) for r in test]
    metric=evaluate(train,test,"T",spec,train_rank,test_rank)
    answer["EQUAL_SCORE_FUSION"]={k:v for k,v in metric.items() if k in {"coefficient","gain","brier0","brier1","design_columns","spec_sha256"}}
    return answer


def rng(family,rep,suffix):
    token={"N1":"action_label","N2":"rank_within_seed","N3":"state_mismatch","N4_T":"support_matched","N4_F":"support_matched"}[family]
    payload=f"{s.CONFIG_ID}|{token}|{rep}{suffix}".encode(); seed=int.from_bytes(hashlib.sha256(payload).digest()[:8],"big")
    return np.random.Generator(np.random.PCG64(seed))


def null_ranks(rows,family,rep,seeds):
    t=[list(r["T_rank"]) for r in rows]; f=[list(r["F_rank"]) for r in rows]
    if family=="N1":
        for repname,target in [("TRAJECTORY",t),("LEARNED_FIELD",f)]:
            for seed in seeds:
                p=rng(family,rep,f"|REP={repname}|SEED={seed}").permutation(5); indices=[i for i,r in enumerate(rows) if r["seed_id"]==seed]
                for i in indices:
                    old=target[i]; new=[0]*5
                    for action in range(5): new[int(p[action])]=old[action]
                    target[i]=new
    elif family=="N2":
        for split in s.SPLITS:
            for seed in seeds:
                indices=[i for i,r in enumerate(rows) if r["split"]==split and r["seed_id"]==seed]; p=rng(family,rep,f"|SPLIT={split}|SEED={seed}").permutation(len(indices)); original=[list(f[i]) for i in indices]
                for position,i in enumerate(indices): f[i]=original[int(p[position])]
    elif family=="N3":
        original=[list(x) for x in f]
        for i,row in enumerate(rows):
            pool=[j for j,x in enumerate(rows) if x["split"]==row["split"] and x["decision_index"]==row["decision_index"] and x["seed_id"]!=row["seed_id"]]
            f[i]=original[pool[int(rng(family,rep,f'|SPLIT={row["split"]}|ROW={row["row_id"]}').integers(0,len(pool)))]]
    else:
        carrier=family[-1]; original=[list(x) for x in f]; groups={}
        for i,row in enumerate(rows):
            magnitude=abs(s.ACTIONS[row[carrier+"_rank"].index(0)]); decile=min(9,int(row[carrier+"_support_distance"]*10)); groups.setdefault((row["split"],magnitude,decile),[]).append(i)
        for key,indices in groups.items():
            p=rng(family,rep,f"|SPLIT={key[0]}|CARRIER={carrier}|STRATUM=M{key[1]};D{key[2]}").permutation(len(indices))
            for position,i in enumerate(indices): f[i]=original[indices[int(p[position])]]
    return t,f


def agreement(t,f):
    c=np.asarray([(1+s.tau(a,b))/2 for a,b in zip(t,f)]); return c,float(c.mean()),float(np.mean([a.index(0)==b.index(0) for a,b in zip(t,f)]))


def observed_and_nulls(train,test,seeds,spec,evidence):
    require(set(evidence)==set(s.FAMILIES) and all([x["replicate_id"] for x in evidence[f]]==list(range(200)) for f in s.FAMILIES),"null registry")
    rows=train+test; train_n=len(train); tc,_,_=agreement([r["T_rank"] for r in train],[r["F_rank"] for r in train]); ec,mean,top=agreement([r["T_rank"] for r in test],[r["F_rank"] for r in test])
    for r,v in zip(train,tc):r["coherence"]=float(v)
    for r,v in zip(test,ec):r["coherence"]=float(v)
    observed={"mean_coherence":mean,"top_action_agreement":top,"carriers":{c:evaluate(train,test,c,spec) for c in s.CARRIERS}}
    nulls={f:[] for f in s.FAMILIES}
    for family in s.FAMILIES:
        for record in evidence[family]:
            require(record=={"family":family,"replicate_id":record["replicate_id"],"population_source":"DERIVED_ORIGINAL_JOINT","rng_contract":"A3_SHA256_PCG64"},"null evidence")
            tr,fr=null_ranks(rows,family,record["replicate_id"],seeds); ctrain,_,_=agreement(tr[:train_n],fr[:train_n]); ctest,m,t=agreement(tr[train_n:],fr[train_n:])
            old=[r["coherence"] for r in rows]
            for r,v in zip(rows,np.r_[ctrain,ctest]):r["coherence"]=float(v)
            metrics={c:evaluate(train,test,c,spec,tr[:train_n] if c=="T" else fr[:train_n],tr[train_n:] if c=="T" else fr[train_n:]) for c in s.CARRIERS}
            for r,v in zip(rows,old):r["coherence"]=v
            nulls[family].append({"mean_coherence":m,"top_action_agreement":t,"T_coefficient":metrics["T"]["coefficient"],"F_coefficient":metrics["F"]["coefficient"],"T_gain":metrics["T"]["gain"],"F_gain":metrics["F"]["gain"]})
    return observed,nulls


def bootstrap(test,seeds,spec,evidence):
    require(evidence=={"cluster_unit":"TEST_SEED","seed":20260808,"replicate_ids":list(range(500))},"bootstrap contract")
    generator=np.random.Generator(np.random.PCG64(20260808)); result={c:[] for c in s.CARRIERS}
    for _ in range(500):
        sampled=generator.choice(np.asarray(seeds),30,replace=True).tolist(); selected=[r for seed in sampled for r in test if r["seed_id"]==seed]
        for c in s.CARRIERS: result[c].append(evaluate(selected,selected,c,spec)["coefficient"])
    return result


def validate_n5(evidence):
    require(evidence["matrix_registry"]==s.signed_permutations(),"N5 matrices"); output={}
    for tier in ["SYNTH","RUN"]:
        record=evidence[tier]; require(record["population_sha256"]==s.digest(record["population_row_ids"]) and len(record["population_row_ids"])>=20,"N5 population"); values=[]
        require(len(record["transforms"])==12,"N5 count")
        for idx,item in enumerate(record["transforms"]):
            q=np.asarray(item["Q"]); require(item["transform_id"]==idx and item["Q"]==evidence["matrix_registry"][idx] and item["refits"]==s.REPRESENTATIONS,"N5 identity")
            for query in item["query_inputs"]: require(np.allclose(q@query["original"],query["transformed"],atol=1e-12),"N5 query")
            for comparison in item["comparisons"]:
                require(np.allclose(q.T@comparison["transformed_terminal"],comparison["original_terminal"],atol=1e-12),"N5 registration")
                values.append(s.tau(comparison["original_rank"],comparison["transformed_rank"]))
        output[tier]=min(values)>=.99
    return output


def dominance_and_direction(test,observed):
    answer={}; n=len(test)
    for carrier in s.CARRIERS:
        metric=observed["carriers"][carrier]; labels=metric["labels"]; contributions=[]; directions={}
        for seed in sorted({r["seed_id"] for r in test}):
            idx=[i for i,r in enumerate(test) if r["seed_id"]==seed]; c=np.asarray([test[i]["coherence"] for i in idx]); y=labels[idx]
            directions[seed]=0. if len(idx)<2 or np.std(c)==0 or np.std(y)==0 else float(np.corrcoef(c,y)[0,1])
            total=Fraction()
            for i in idx:
                p0=float(np.clip(metric["p0"][i],1e-15,1-1e-15));p1=float(np.clip(metric["p1"][i],1e-15,1-1e-15));yy=int(labels[i])
                l0=-math.log(p0 if yy else 1-p0);l1=-math.log(p1 if yy else 1-p1);total+=Fraction.from_float(l0)-Fraction.from_float(l1)
            contributions.append((seed,total/n))
        answer[carrier]={"directions":directions,"at_least_21":sum(v>=0 for v in directions.values())>=21,"dominance":dominance_from_contributions(contributions)}
    return answer


def dominance_from_contributions(contributions):
    if len(contributions)<3:return {"valid":False,"pass":False,"reason":"FEWER_THAN_THREE"}
    G=sum((v for _,v in contributions),Fraction());D3=sum((v for _,v in sorted(contributions,key=lambda x:(-x[1],x[0]))[:3]),Fraction());passes=G>0 and 2*D3<=G
    return {"valid":True,"pass":passes,"G":[G.numerator,G.denominator],"D3":[D3.numerator,D3.denominator],"reason":"PASS" if passes else "NONPOSITIVE_G" if G<=0 else "DOMINATED"}


def sensitivity_results(bundle,spec):
    expected={item[1]:item for item in s.SENSITIVITY_REGISTRY}; records=bundle["sensitivities"]
    require(len(records)==12 and {r["sensitivity_id"] for r in records}==set(expected),"sensitivity registry"); output={}
    for record in sorted(records,key=lambda r:r["ordinal"]):
        ordinal,sid,path,primary,value,p5=expected[record["sensitivity_id"]]
        require((record["ordinal"],record["changed_factor_path"],record["primary_value"],record["sensitivity_value"],record["p5"])==(ordinal,path,primary,value,p5),"sensitivity identity")
        expected_config=s.patch_config(bundle["primary_config"],path,value)
        require(record["variant_config"]==expected_config and record["variant_config_sha256"]==s.digest(expected_config) and record["unchanged_config_sha256"]==s.digest(s.without_path(bundle["primary_config"],path)),"sensitivity config")
        require(record["required_outputs"]==["T_COEFFICIENT","T_GAIN","F_COEFFICIENT","F_GAIN","SUPPORT","PROVENANCE"],"sensitivity outputs")
        variant_manifest={**bundle["manifest"],"actions":record["variant_actions"],"support_thresholds":record["variant_support_thresholds"]}
        temp={"manifest":variant_manifest,"observed_rows":record["variant_rows"]}; rows=derive_rows(temp,record["variant_rows"]); sets,support=populations(rows,bundle["manifest"]["seed_ids"],record["variant_actions"])
        fit_rows=[row for row in sets["JOINT_TRAIN"] if row["seed_id"] in record["variant_train_seed_ids"]]
        require(record["contributing_seed_ids"]==bundle["manifest"]["seed_ids"] and record["rows_per_seed"]=={seed:50 for seed in bundle["manifest"]["seed_ids"]},"sensitivity population")
        require(support["valid"] and len(fit_rows)>0,"sensitivity support"); output[sid]={c:{k:v for k,v in evaluate(fit_rows,sets["JOINT_TEST"],c,spec,actions=record["variant_actions"]).items() if k in {"coefficient","gain"}} for c in s.CARRIERS};output[sid]["support"]=support
    return output


def preflight_registries(bundle):
    require(set(bundle["null_worlds"])==set(s.FAMILIES),"null registry")
    for family in s.FAMILIES:
        require(len(bundle["null_worlds"][family])==200,"null count")
        for rep,record in enumerate(bundle["null_worlds"][family]):
            require(record=={"family":family,"replicate_id":rep,"population_source":"DERIVED_ORIGINAL_JOINT","rng_contract":"A3_SHA256_PCG64"},"null preflight")
    require(bundle["bootstrap"]=={"cluster_unit":"TEST_SEED","seed":20260808,"replicate_ids":list(range(500))},"bootstrap preflight")
    expected={item[1]:item for item in s.SENSITIVITY_REGISTRY};records=bundle["sensitivities"]
    require(len(records)==12 and {r.get("sensitivity_id") for r in records}==set(expected),"sensitivity preflight set")
    for record in records:
        ordinal,sid,path,primary,value,p5=expected[record["sensitivity_id"]]
        require((record.get("ordinal"),record.get("changed_factor_path"),record.get("primary_value"),record.get("sensitivity_value"),record.get("p5"))==(ordinal,path,primary,value,p5),"sensitivity preflight identity")
        config=s.patch_config(bundle["primary_config"],path,value)
        require(record.get("variant_config")==config and record.get("variant_config_sha256")==s.digest(config) and record.get("unchanged_config_sha256")==s.digest(s.without_path(bundle["primary_config"],path)),"sensitivity preflight config")
        require(record.get("contributing_seed_ids")==bundle["manifest"]["seed_ids"] and record.get("rows_per_seed")=={seed:50 for seed in bundle["manifest"]["seed_ids"]},"sensitivity preflight population")
        expected_actions=[-float(value),-float(value)/2,0.,float(value)/2,float(value)] if path=="actions.primary_amplitude" else s.ACTIONS
        expected_support={"T":float(value),"F":float(value)} if path=="support.threshold_quantile" else {"T":.99,"F":.99}
        expected_train=bundle["manifest"]["seed_ids"][:15] if value=="FROZEN_TRAIN_HALF_A" else bundle["manifest"]["seed_ids"][15:] if value=="FROZEN_TRAIN_HALF_B" else bundle["manifest"]["seed_ids"]
        require(record.get("variant_actions")==expected_actions and record.get("variant_support_thresholds")==expected_support and record.get("variant_train_seed_ids")==expected_train,"sensitivity operative binding")
        require(record.get("required_outputs")==["T_COEFFICIENT","T_GAIN","F_COEFFICIENT","F_GAIN","SUPPORT","PROVENANCE"] and len(record.get("variant_rows",[]))==3000,"sensitivity preflight outputs")
    return True


def mc(observed,values):
    k=sum(value>=observed for value in values);return {"k":k,"p":(1+k)/201,"pass":k<=4}


def derive(bundle):
    try:
        forbid_summaries(bundle); require(bundle.get("schema")=="A5XEF_GENERIC_RAW_EVIDENCE_V1","schema"); require(bundle.get("authority_binding")=={"v1_composite":s.V1,"registered_data":False,"fixture":True},"authority")
        sections=["manifest","primary_config","model_spec","observed_rows","null_worlds","bootstrap","n5","sensitivities","authority_binding"]
        ledger=bundle.get("provenance");require(len(ledger)==len(sections) and {x["artifact_id"] for x in ledger}=={x.upper() for x in sections},"provenance set")
        for section in sections:
            item=next(x for x in ledger if x["artifact_id"]==section.upper());require(item["sha256"]==s.digest(bundle[section]) and item["parents"]==([] if section in {"manifest","authority_binding"} else ["MANIFEST","AUTHORITY_BINDING"]),"provenance")
        spec=validate_model_spec(bundle["model_spec"]);preflight_registries(bundle);rows=derive_rows(bundle);sets,support=populations(rows,bundle["manifest"]["seed_ids"]);require(support["valid"],"support")
        n5=validate_n5(bundle["n5"])
        if not n5["SYNTH"]:return {"execution_state":"IMPLEMENTATION_FAILURE","classification":None,"release_permitted":False,"reason":"N5_SYNTH"}
        if not n5["RUN"]:return {"execution_state":"INVALID_EXPERIMENT","classification":None,"release_permitted":False,"reason":"N5_RUN"}
        observed,nulls=observed_and_nulls(sets["JOINT_TRAIN"],sets["JOINT_TEST"],bundle["manifest"]["seed_ids"],spec,bundle["null_worlds"])
        boot=bootstrap(sets["JOINT_TEST"],bundle["manifest"]["seed_ids"],spec,bundle["bootstrap"]);attr=dominance_and_direction(sets["JOINT_TEST"],observed);diags=diagnostics(sets["JOINT_TRAIN"],sets["JOINT_TEST"],spec);sens=sensitivity_results(bundle,spec)
        P1=all(mc(observed[stat],[x[stat] for x in nulls[f]])["pass"] for stat in ["mean_coherence","top_action_agreement"] for f in s.FAMILIES)
        P2=all(observed["carriers"][c]["coefficient"]>0 and np.quantile(boot[c],.025,method="linear")>0 for c in s.CARRIERS)
        P3=all(observed["carriers"][c]["gain"]>0 and observed["carriers"][c]["brier1"]<=observed["carriers"][c]["brier0"] and all(mc(observed["carriers"][c]["gain"],[x[c+"_gain"] for x in nulls[f]])["pass"] for f in ["N1","N2","N3","N4_"+c]) for c in s.CARRIERS)
        P4=all(observed["carriers"][c]["coefficient"]>0 and observed["carriers"][c]["gain"]>0 and observed["carriers"][c]["design_columns"]==s.model_spec()["baseline_features"] and attr[c]["at_least_21"] and attr[c]["dominance"]["pass"] for c in s.CARRIERS) and set(diags)=={"T_ONLY","F_ONLY","EQUAL_SCORE_FUSION"}
        P5=all(sens[sid][c]["coefficient"]>0 and sens[sid][c]["gain"]>0 for sid in ["ACTION_AMPLITUDE_0.25","ACTION_AMPLITUDE_1.0"] for c in s.CARRIERS)
        propositions={"P1":P1,"P2":P2,"P3":P3,"P4":P4,"P5":P5};cores={c:observed["carriers"][c]["coefficient"]>0 and observed["carriers"][c]["gain"]>0 for c in s.CARRIERS};negative={c:np.quantile(boot[c],.975,method="linear")<0 for c in s.CARRIERS}
        if any(cores[c] and negative[c] for c in s.CARRIERS):raise EvidenceError("contradictory bootstrap")
        label="REPLICATED" if all(propositions.values()) and all(cores.values()) else "PARTIALLY REPLICATED" if any(cores.values()) and not any(negative.values()) else "NOT REPLICATED"
        clean_observed={"mean_coherence":observed["mean_coherence"],"top_action_agreement":observed["top_action_agreement"],"carriers":{c:{k:observed["carriers"][c][k] for k in ["coefficient","gain","brier0","brier1","design_columns","spec_sha256"]} for c in s.CARRIERS}}
        return {"execution_state":"VALID_SCIENTIFIC_RESULT","classification":label,"release_permitted":False,"support":support,"n5":n5,"observed":clean_observed,"nulls_sha256":s.digest(nulls),"bootstrap_ci":{c:[float(np.quantile(boot[c],.025,method="linear")),float(np.quantile(boot[c],.975,method="linear"))] for c in s.CARRIERS},"diagnostics":diags,"attribution":attr,"sensitivities":{sid:{c:sens[sid][c] for c in s.CARRIERS} for sid in sens},"P":propositions,"cross_system":"PARTIAL CROSS-SYSTEM REPLICATION" if P1 and P2 and P3 and label in {"REPLICATED","PARTIALLY REPLICATED"} else "NON-REPLICATION","population_hashes":support["population_hashes"],"model_spec_sha256":s.digest(spec)}
    except (EvidenceError,KeyError,TypeError,ValueError,np.linalg.LinAlgError) as error:
        return {"execution_state":"INVALID_EXPERIMENT","classification":None,"release_permitted":False,"reason":str(error)}
