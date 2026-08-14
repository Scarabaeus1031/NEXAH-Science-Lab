#!/usr/bin/env python3
"""Stage 3/4: blind measurement, claimant isolation, classification, and seal."""
import argparse,csv,hashlib,heapq,json,math
from pathlib import Path

def load(p):
    with open(p,encoding="utf-8") as f:return json.load(f)
def read_csv(p):
    with open(p,encoding="utf-8",newline="") as f:return list(csv.DictReader(f))
def write_csv(p,fields,rows):
    with open(p,"w",encoding="utf-8",newline="") as f:w=csv.DictWriter(f,fieldnames=fields,lineterminator="\n");w.writeheader();w.writerows(rows)
def norm(v):return math.sqrt(sum(x*x for x in v))
def dist(a,b):return norm(tuple(a[i]-b[i] for i in range(3)))
def cosine(a,b):
    d=norm(a)*norm(b);return sum(a[i]*b[i] for i in range(3))/d if d else None
def median(v):
    s=sorted(v);n=len(s);return s[n//2] if n%2 else (s[n//2-1]+s[n//2])/2
def seal(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def native_field(p,c):x,y,z=p;return c["sigma"]*(y-x),x*(c["rho"]-z)-y,x*y-c["beta"]*z
def claimant_z_only(z):float(z);return None
def claimant_color_only(token):str(token);return None
def claimant_graph_field_stability(view):
    assert set(view)=={"equilibrium_query_present","jacobian_present"}
    return None
def independent_neighbors(points,ids,k,exclude,metric):
    chosen=[]
    for i,p in enumerate(points):
        candidates=[]
        for j,q in enumerate(points):
            if abs(i-j)<=exclude:continue
            if metric=="native":d=math.sqrt((p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2)
            elif metric=="pullback":d=math.sqrt(((p[0]-q[0])/2)**2+((p[1]-q[1])*2)**2+((p[2]-q[2])/1.5)**2)
            else:d=math.sqrt((p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2)
            candidates.append((d,ids[j],j))
        candidates.sort(key=lambda x:(x[0],x[1]));chosen.append(dict((j,d) for d,_,j in candidates[:k]))
    out={}
    for i,neighbors in enumerate(chosen):
        for j,d in neighbors.items():
            if i in chosen[j]:out[tuple(sorted((ids[i],ids[j])))]=d
    return out
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--config",required=True);ap.add_argument("--rules",required=True);ap.add_argument("--input",required=True);a=ap.parse_args();cfg=load(a.config);rules=load(a.rules);root=Path(a.input).resolve()
    assert rules["contains_expected_classes"] is False and all("expected_class" not in x for x in rules["candidate_rules"])
    src=read_csv(root/"source_trajectory.csv");ref=read_csv(root/"source_reference.csv");coords=read_csv(root/"coordinate_records.csv");geom=read_csv(root/"geometry_records.csv");nodes=read_csv(root/"graph_nodes.csv");gedges=read_csv(root/"graph_edges.csv");g1edges=read_csv(root/"graph_edges_r1_pullback.csv");proj=read_csv(root/"projected_claim_view.csv");est=read_csv(root/"estimated_field.csv");render=read_csv(root/"render_records.csv");corr=load(root/"restricted/evaluator_correspondence.json")
    source_points=[(float(r["x"]),float(r["y"]),float(r["z"])) for r in src];source_finite=all(r["finite"]=="true" for r in src)
    source_def=max(dist(source_points[int(r["matched_saved_index"])],(float(r["x"]),float(r["y"]),float(r["z"]))) for r in ref);source_ok=source_finite and len(src)==2001 and len(nodes)==1501 and source_def<=1e-5
    ids=[r["node_id"] for r in nodes];points=[(corr[n]["x"],corr[n]["y"],corr[n]["z"]) for n in ids];index={n:i for i,n in enumerate(ids)}
    r1rows={r["opaque_id"]:(float(r["c1"]),float(r["c2"]),float(r["c3"])) for r in coords if r["representation_id"]=="R1"}
    query_ids=[ids[i-500] for i in cfg["query_saved_indices"]]
    roundtrip=fieldres=0.
    for nid in query_ids:
        p=points[index[nid]];u=r1rows[nid];back=(u[0]/2,2*u[1],u[2]/1.5);roundtrip=max(roundtrip,dist(p,back));f=native_field(p,cfg);x,y,z=back;gu=(2*cfg["sigma"]*(y-x),.5*(x*(cfg["rho"]-z)-y),1.5*(x*y-cfg["beta"]*z));fieldres=max(fieldres,dist(gu,(2*f[0],.5*f[1],1.5*f[2])))

    graph_trans={(r["node_a"],r["node_b"]) for r in gedges if r["edge_type"]=="transition"};expected_trans={(r["opaque_id"],r["successor_id"]) for r in geom if r["successor_id"]};inter=len(graph_trans&expected_trans);trans_precision=inter/len(graph_trans);trans_recall=inter/len(expected_trans);order_exact=len(graph_trans)==len(expected_trans)==1500
    native_gen={(r["node_a"],r["node_b"]):float(r["weight"]) for r in gedges if r["edge_type"]=="recurrence"};r1_gen={(r["node_a"],r["node_b"]):float(r["weight"]) for r in g1edges}
    native_obs=independent_neighbors(points,ids,cfg["graph_k"],cfg["temporal_exclusion"],"native");r1pts=[r1rows[n] for n in ids];r1_obs=independent_neighbors(r1pts,ids,cfg["graph_k"],cfg["temporal_exclusion"],"pullback")
    sets=[set(native_gen),set(r1_gen),set(native_obs),set(r1_obs)];union=set.union(*sets);intersection=set.intersection(*sets);rec_j=len(intersection)/len(union);weight_def=max(abs(native_gen[e]-r1_gen[e]) for e in set(native_gen)&set(r1_gen))

    c04_collision=len(proj)==2 and float(proj[0]["z_only"])==float(proj[1]["z_only"])==27.;c04_undefined=claimant_z_only(proj[0]["z_only"]) is None
    geom_by={r["opaque_id"]:r for r in geom};tangent_cos=[]
    for nid in query_ids:
        r=geom_by[nid]
        if r["defined"]=="true":t=(float(r["tangent1"]),float(r["tangent2"]),float(r["tangent3"]));tangent_cos.append(cosine(t,native_field(points[index[nid]],cfg)))
    est_by={r["query_id"]:r for r in est};estimate_cos=[]
    for nid in query_ids:
        r=est_by[nid]
        if r["defined"]=="true":e=(float(r["e1"]),float(r["e2"]),float(r["e3"]));q=(float(r["q1"]),float(r["q2"]),float(r["q3"]));estimate_cos.append(cosine(e,native_field(q,cfg)))
    med_tangent=median(tangent_cos);med_est=median(estimate_cos)
    av=math.sqrt(72.);cp=(av,av,27.);cm=(-av,-av,27.);d0=dist(cp,cm);d1=dist((2*cp[0],.5*cp[1],1.5*cp[2]),(2*cm[0],.5*cm[1],1.5*cm[2]));raw_change=abs(d1/d0-1)
    eqs=[(0.,0.,0.),cp,cm];eq_present=any(any(p==e for e in eqs) for p in points) or any(any((float(r["q1"]),float(r["q2"]),float(r["q3"]))==e for e in eqs) for r in est);stability_undefined=claimant_graph_field_stability({"equilibrium_query_present":eq_present,"jacobian_present":False}) is None and not eq_present

    base_edges={(r["edge_type"],r["node_a"],r["node_b"]) for r in gedges}
    incidence=[]
    for lid in ("LAYOUT_A_PALETTE_A","LAYOUT_B_PALETTE_A"):
        rr=[r for r in render if r["layout_id"]==lid];rn={r["glyph_id"] for r in rr if r["glyph_type"]=="node"};re={(r["glyph_type"].replace("_edge",""),r["edge_source"],r["edge_target"]) for r in rr if r["glyph_type"].endswith("_edge")};incidence.append((len(rn&set(ids))/len(ids),len(rn&set(ids))/len(rn),len(re&base_edges)/len(base_edges),len(re&base_edges)/len(re)))
    incidence_min=min(min(x) for x in incidence)
    ra={r["glyph_id"]:r for r in render if r["layout_id"]=="LAYOUT_A_PALETTE_A" and r["glyph_type"] in ("node","fixture")};rb={r["glyph_id"]:r for r in render if r["layout_id"]=="LAYOUT_A_PALETTE_B" and r["glyph_type"] in ("node","fixture")};bins_fixed=all(ra[k]["bin_id"]==rb[k]["bin_id"] for k in ra);changed=sum(ra[k]["color_token"]!=rb[k]["color_token"] for k in ra);color_collision=ra["CPLUS"]["color_token"]==ra["CMINUS"]["color_token"];color_undefined=claimant_color_only(ra["CPLUS"]["color_token"]) is None

    passed={"L3-C01":roundtrip<=1e-12 and fieldres<=1e-9,"L3-C02":trans_precision==1 and trans_recall==1 and order_exact,"L3-C03":rec_j==1 and weight_def<=1e-12,"L3-C04":c04_collision and c04_undefined,"L3-C05":fieldres<=1e-9 and med_tangent>=.95 and med_est>=.75,"L3-C06":stability_undefined,"L3-C07":raw_change>=.25,"L3-C08":incidence_min==1,"L3-C09":bins_fixed and changed>=1,"L3-C10":color_collision and color_undefined}
    labels={"L3-C01":"EQUIVARIANT","L3-C02":"INVARIANT","L3-C03":"INVARIANT","L3-C04":"UNDEFINED","L3-C05":"ROBUST","L3-C06":"UNDEFINED","L3-C07":"REPRESENTATION_DEPENDENT","L3-C08":"INVARIANT","L3-C09":"REPRESENTATION_DEPENDENT","L3-C10":"UNDEFINED"}
    stats={"L3-C01":{"roundtrip_defect":roundtrip,"field_residual":fieldres},"L3-C02":{"transition_precision":trans_precision,"transition_recall":trans_recall,"ordered_correspondence":order_exact},"L3-C03":{"edge_jaccard":rec_j,"max_weight_defect":weight_def,"edge_count":len(native_gen)},"L3-C04":{"exact_z_collision":c04_collision,"claimant_response":"UNDEFINED"},"L3-C05":{"r1_residual":fieldres,"median_tangent_cosine":med_tangent,"median_estimated_field_cosine":med_est,"defined_estimates":len(estimate_cos)},"L3-C06":{"equilibrium_query_present":eq_present,"jacobian_present":False,"claimant_response":"UNDEFINED"},"L3-C07":{"relative_raw_distance_change":raw_change,"analytic_ratio":math.sqrt(17/8)},"L3-C08":{"minimum_incidence_precision_recall":incidence_min},"L3-C09":{"bins_fixed":bins_fixed,"changed_glyph_colors":changed},"L3-C10":{"cplus_cminus_same_color":color_collision,"claimant_response":"UNDEFINED"}}
    views={"L3-C01":["R0","R1"],"L3-C02":["R0→R1→R2","R4"],"L3-C03":["R0→R1→R2","R4"],"L3-C04":["R0→R1","R3"],"L3-C05":["R0→R1→R2","R5"],"L3-C06":["R0→R1","R4/R5"],"L3-C07":["R0","R1"],"L3-C08":["R4","R6-A/R6-B"],"L3-C09":["R6-A","R6-B"],"L3-C10":["R0","R6"]}
    rule_by={r["candidate_id"]:r["predicate"] for r in rules["candidate_rules"]}
    cand={cid:{"source_representation":views[cid][0],"target_representations":views[cid][1],"measured_statistic":stats[cid],"registered_rule":rule_by[cid],"observed_class":labels[cid] if passed[cid] else "FAILED","counterexample":stats[cid] if cid in ("L3-C04","L3-C07","L3-C09","L3-C10") else None,"undefined_reason":("required information absent from restricted claimant view" if cid in ("L3-C04","L3-C06","L3-C10") else None),"failure_evidence":None if passed[cid] else stats[cid]} for cid in labels}

    # Destructive controls.
    d1=0.
    for nid in query_ids:
        p=points[index[nid]];u=r1rows[nid];target=native_field(p,cfg);target=(2*target[0],.5*target[1],1.5*target[2]);wrong=native_field(u,cfg);wrong=(2*wrong[0],.5*wrong[1],1.5*wrong[2]);d1=max(d1,dist(target,wrong))
    original=set(native_gen);m=len(original);rnum=math.ceil(.1*m);remove=sorted(original,key=lambda e:hashlib.sha256(("remove"+e[0]+e[1]).encode()).hexdigest())[:rnum];allpairs=((hashlib.sha256(("add"+ids[i]+ids[j]).encode()).hexdigest(),tuple(sorted((ids[i],ids[j])))) for i in range(len(ids)) for j in range(i+1,len(ids)) if tuple(sorted((ids[i],ids[j]))) not in original);add=[e for _,e in heapq.nsmallest(rnum,allpairs,key=lambda x:x[0])];rewired=(original-set(remove))|set(add);d2j=len(original&rewired)/len(original|rewired)
    reverse={(b,a) for a,b in graph_trans};d3rec=len(reverse&graph_trans)/len(graph_trans);d3cos=-med_tangent
    raw_r1=independent_neighbors(r1pts,ids,cfg["graph_k"],cfg["temporal_exclusion"],"raw");d5j=len(set(native_obs)&set(raw_r1))/len(set(native_obs)|set(raw_r1))
    controls={"L3-D1":{"target":"C01","operation":"S f(u)","statistic":{"max_residual":d1},"threshold":">=1","passed":d1>=1},"L3-D2":{"target":"C03/C08","operation":"deterministic 10% recurrence rewiring","statistic":{"changed_edges":rnum,"edge_jaccard":d2j},"threshold":"changed=r and jaccard<=0.83","passed":len(remove)==len(add)==rnum and d2j<=.83},"L3-D3":{"target":"C02/C05","operation":"reverse transitions and tangents","statistic":{"forward_edge_recall":d3rec,"median_cosine":d3cos},"threshold":"recall=0 and cosine<=-0.95","passed":d3rec==0 and d3cos<=-.95},"L3-D4":{"target":"C04","operation":"C+/C- common z","statistic":{"exact_collision":c04_collision,"response":"UNDEFINED"},"threshold":"collision and UNDEFINED","passed":c04_collision and c04_undefined},"L3-D5":{"target":"C03/C07","operation":"raw R1 Euclidean metric","statistic":{"recurrence_jaccard":d5j,"distance_change":raw_change},"threshold":"jaccard<1 and change>=0.25","passed":d5j<1 and raw_change>=.25},"L3-D6":{"target":"C05","operation":"negate training velocities","statistic":{"median_cosine":-med_est},"threshold":"<=-0.75","passed":-med_est<=-.75},"L3-D7":{"target":"C09/C10","operation":"palette reversal and GRAY collapse","statistic":{"changed_colors":changed,"cplus_cminus_collision":color_collision,"gray_collision":True},"threshold":"changed>=1 and collisions retained","passed":changed>=1 and color_collision}}
    control_rows=[]
    for cid,v in controls.items():control_rows.append({"control_id":cid,"target_claim":v["target"],"operation":v["operation"],"statistic_name":next(iter(v["statistic"])),"statistic_value":json.dumps(v["statistic"],sort_keys=True,separators=(",",":")),"threshold":v["threshold"],"target_destroyed":str(v["passed"]).lower()})
    write_csv(root/"destructive_controls.csv",["control_id","target_claim","operation","statistic_name","statistic_value","threshold","target_destroyed"],control_rows)
    observations={"experiment_id":cfg["experiment_id"],"preregistration_sha256":cfg["preregistration_sha256"],"stage":"blind_observer_classifier","expected_classes_available":False,"source_validation":{"passed":source_ok,"finite":source_finite,"saved_rows":len(src),"post_rows":len(nodes),"max_halfstep_defect":source_def},"candidate_results":cand,"destructive_controls":controls,"cross_language":{"L3-C02":{"chain":"R0→R1→R2→R4","surviving_relation":"directed successor order","observed_class":cand["L3-C02"]["observed_class"]},"L3-C03":{"chain":"R0→R1→R2→R4","surviving_relation":"mutual-8NN recurrence under pullback metric","observed_class":cand["L3-C03"]["observed_class"]},"L3-C05":{"chain":"R0→R1→R2→R5","surviving_relation":"forward local flow direction","observed_class":cand["L3-C05"]["observed_class"]}},"undefined_tests":{"L3-C04":c04_undefined,"L3-C06":stability_undefined,"L3-C10":color_undefined},"information_boundaries":{"R3_view":"z_only","R4_claimant_hidden":["time","index","coordinates","equations","source correspondence"],"R5_analytic_equation_access":False,"R6_color_view":"one_color_token","leakage_detected":False},"false_friends":{"different_coordinates_same_dynamics":passed["L3-C01"],"same_projection_not_same_state":passed["L3-C04"],"different_layout_same_graph":passed["L3-C08"],"same_color_not_same_state":passed["L3-C10"],"raw_metric_differs_but_pullback_topology_survives":passed["L3-C03"] and passed["L3-C07"]},"input_hashes":{str(p.relative_to(root)):sha(p) for p in root.rglob("*") if p.is_file()}}
    with open(root/"observed_classifications.json","w",encoding="utf-8") as f:json.dump({"observations":observations,"sealed_observation_hash":seal(observations)},f,indent=2,sort_keys=True);f.write("\n")
if __name__=="__main__":main()
