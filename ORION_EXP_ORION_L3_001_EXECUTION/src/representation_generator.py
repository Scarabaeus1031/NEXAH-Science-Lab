#!/usr/bin/env python3
"""Stage 2: creates R0-R6 from locked source records without expected classes."""
import argparse,csv,hashlib,json,math,struct
from pathlib import Path

def load(p):
    with open(p,encoding="utf-8") as f:return json.load(f)
def read_csv(p):
    with open(p,encoding="utf-8",newline="") as f:return list(csv.DictReader(f))
def write_csv(p,fields,rows):
    with open(p,"w",encoding="utf-8",newline="") as f:w=csv.DictWriter(f,fieldnames=fields,lineterminator="\n");w.writeheader();w.writerows(rows)
def fn(v):return format(v,".17g")
def norm(v):return math.sqrt(sum(x*x for x in v))
def dist(a,b):return norm(tuple(a[i]-b[i] for i in range(3)))
def node_id(p):return hashlib.sha256(b"R4-1.0\0"+struct.pack(">ddd",*p)).hexdigest()
def bin_id(z,edges):return sum(z>=e for e in edges)
def mutual_edges(points,ids,k,exclusion,mode):
    near=[]
    for i,p in enumerate(points):
        choices=[]
        for j,q in enumerate(points):
            if abs(i-j)<=exclusion:continue
            if mode=="native":d=dist(p,q)
            else:
                # p/q are R1 coordinates; approved pullback evaluated explicitly.
                d=math.sqrt(((p[0]-q[0])/2)**2+((p[1]-q[1])*2)**2+((p[2]-q[2])/1.5)**2)
            choices.append((d,ids[j],j))
        choices.sort();near.append({j:d for d,_,j in choices[:k]})
    edges={}
    for i,selected in enumerate(near):
        for j,d in selected.items():
            if i in near[j]:
                a,b=sorted((ids[i],ids[j]));edges[(a,b)]=d
    return edges
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--config",required=True);ap.add_argument("--input",required=True);a=ap.parse_args();cfg=load(a.config);root=Path(a.input).resolve();rows=read_csv(root/"source_trajectory.csv")
    postrows=rows[cfg["post_start_saved_index"]:cfg["post_end_saved_index"]+1];points=[(float(r["x"]),float(r["y"]),float(r["z"])) for r in postrows];ids=[node_id(p) for p in points]
    if len(set(ids))!=len(ids):raise SystemExit("R4 node hash collision")
    restricted=root/"restricted";restricted.mkdir()
    corr={ids[i]:{"saved_index":cfg["post_start_saved_index"]+i,"source_step":int(postrows[i]["step"]),"x":points[i][0],"y":points[i][1],"z":points[i][2]} for i in range(len(ids))}
    with open(restricted/"evaluator_correspondence.json","w",encoding="utf-8") as f:json.dump(corr,f,indent=2,sort_keys=True);f.write("\n")

    cr=[]
    for i,p in enumerate(points):
        seal=hashlib.sha256(("CORR|"+ids[i]+"|"+str(cfg["post_start_saved_index"]+i)).encode()).hexdigest()
        cr.append({"opaque_id":ids[i],"representation_id":"R0","c1":fn(p[0]),"c2":fn(p[1]),"c3":fn(p[2]),"source_correspondence_sealed":seal})
        cr.append({"opaque_id":ids[i],"representation_id":"R1","c1":fn(2*p[0]),"c2":fn(.5*p[1]),"c3":fn(1.5*p[2]),"source_correspondence_sealed":seal})
    write_csv(root/"coordinate_records.csv",["opaque_id","representation_id","c1","c2","c3","source_correspondence_sealed"],cr)

    gr=[];arc=0.
    for i,p in enumerate(points):
        cin="" if i==0 else dist(points[i-1],p);cout="" if i==len(points)-1 else dist(p,points[i+1])
        if i>0:arc+=float(cin)
        defined=i>0 and i<len(points)-1 and dist(points[i-1],points[i+1])>0
        if defined:
            d=tuple(points[i+1][q]-points[i-1][q] for q in range(3));dn=norm(d);t=tuple(x/dn for x in d)
        else:t=(None,None,None)
        gr.append({"opaque_id":ids[i],"predecessor_id":"" if i==0 else ids[i-1],"successor_id":"" if i==len(ids)-1 else ids[i+1],"chord_in":"" if cin=="" else fn(cin),"chord_out":"" if cout=="" else fn(cout),"arc_length":fn(arc),"tangent1":"" if t[0] is None else fn(t[0]),"tangent2":"" if t[1] is None else fn(t[1]),"tangent3":"" if t[2] is None else fn(t[2]),"defined":str(defined).lower(),"failure_reason":"endpoint" if not defined else ""})
    write_csv(root/"geometry_records.csv",["opaque_id","predecessor_id","successor_id","chord_in","chord_out","arc_length","tangent1","tangent2","tangent3","defined","failure_reason"],gr)

    write_csv(root/"graph_nodes.csv",["node_id","operator_version"],[{"node_id":x,"operator_version":"R4-1.0"} for x in ids])
    native_edges=mutual_edges(points,ids,cfg["graph_k"],cfg["temporal_exclusion"],"native")
    r1points=[(2*p[0],.5*p[1],1.5*p[2]) for p in points];r1edges=mutual_edges(r1points,ids,cfg["graph_k"],cfg["temporal_exclusion"],"pullback")
    transitions=[(ids[i],ids[i+1]) for i in range(len(ids)-1)]
    fields=["edge_type","directed","node_a","node_b","weight"]
    er=[{"edge_type":"transition","directed":"true","node_a":a,"node_b":b,"weight":fn(.01)} for a,b in transitions]+[{"edge_type":"recurrence","directed":"false","node_a":a,"node_b":b,"weight":fn(w)} for (a,b),w in sorted(native_edges.items())]
    er1=[{"edge_type":"recurrence","directed":"false","node_a":a,"node_b":b,"weight":fn(w)} for (a,b),w in sorted(r1edges.items())]
    write_csv(root/"graph_edges.csv",fields,er);write_csv(root/"graph_edges_r1_pullback.csv",fields,er1)

    # R3 is materialized as two deliberately minimal claimant views.
    write_csv(root/"projected_claim_view.csv",["claim_view_id","z_only"],[{"claim_view_id":"C04-A","z_only":fn(27.)},{"claim_view_id":"C04-B","z_only":fn(27.)}])

    # Sample-only R5: derive velocities from order, never source derivative columns/equations.
    velocities={i:tuple((points[i+1][q]-points[i-1][q])/.02 for q in range(3)) for i in range(1,len(points)-1)}
    ef=[]
    for saved in cfg["query_saved_indices"]:
        qi=saved-cfg["post_start_saved_index"];q=points[qi];choices=[]
        for j,v in velocities.items():
            if abs((cfg["post_start_saved_index"]+j)-saved)<=cfg["temporal_exclusion"]:continue
            choices.append((dist(q,points[j]),ids[j],j))
        choices.sort();chosen=choices[:cfg["field_k"]];hq=chosen[-1][0] if len(chosen)==cfg["field_k"] else 0.;defined=len(chosen)==cfg["field_k"] and hq>0
        if defined:
            weights=[math.exp(-(d/hq)**2) for d,_,_ in chosen];sw=sum(weights);e=tuple(sum(weights[n]*velocities[item[2]][qv] for n,item in enumerate(chosen))/sw for qv in range(3));defined=norm(e)>0 and all(math.isfinite(x) for x in e)
        else:e=(None,None,None)
        ef.append({"query_id":ids[qi],"q1":fn(q[0]),"q2":fn(q[1]),"q3":fn(q[2]),"e1":"" if e[0] is None else fn(e[0]),"e2":"" if e[1] is None else fn(e[1]),"e3":"" if e[2] is None else fn(e[2]),"neighbor_count":len(chosen),"bandwidth":fn(hq),"defined":str(defined).lower(),"failure_reason":"" if defined else "estimator_undefined"})
    write_csv(root/"estimated_field.csv",["query_id","q1","q2","q3","e1","e2","e3","neighbor_count","bandwidth","defined","failure_reason"],ef)

    # R6 render records: four style combinations; no pixels or similarity metric.
    sorted_a=sorted(ids);rank_a={x:i for i,x in enumerate(sorted_a)};sorted_b=sorted(ids,key=lambda x:hashlib.sha256(("layout-B"+x).encode()).hexdigest());rank_b={x:i for i,x in enumerate(sorted_b)};side=math.ceil(math.sqrt(len(ids)))
    combos=[("LAYOUT_A_PALETTE_A","A",cfg["palette_a"]),("LAYOUT_A_PALETTE_B","A",cfg["palette_b"]),("LAYOUT_B_PALETTE_A","B",cfg["palette_a"]),("LAYOUT_B_PALETTE_B","B",cfg["palette_b"])]
    renders=[]
    for lid,layout,palette in combos:
        for i,nid in enumerate(ids):
            if layout=="A":ang=2*math.pi*rank_a[nid]/len(ids);lx,ly=math.cos(ang),math.sin(ang)
            else:r=rank_b[nid];lx,ly=r%side,r//side
            b=bin_id(points[i][2],cfg["bin_edges"]);renders.append({"glyph_id":nid,"glyph_type":"node","layout_id":lid,"layout_x":fn(lx),"layout_y":fn(ly),"bin_id":b,"color_token":palette[b],"edge_source":"","edge_target":""})
        av=math.sqrt(72.);fixtures=[("O",(0.,0.,0.),(-2.,0.)),("CPLUS",(av,av,27.),(2.,1.)),("CMINUS",(-av,-av,27.),(2.,-1.))]
        for fid,p,pos in fixtures:
            b=bin_id(p[2],cfg["bin_edges"]);renders.append({"glyph_id":fid,"glyph_type":"fixture","layout_id":lid,"layout_x":fn(pos[0]),"layout_y":fn(pos[1]),"bin_id":b,"color_token":palette[b],"edge_source":"","edge_target":""})
        for e in er:renders.append({"glyph_id":"EDGE:"+e["edge_type"]+":"+e["node_a"]+":"+e["node_b"],"glyph_type":e["edge_type"]+"_edge","layout_id":lid,"layout_x":"","layout_y":"","bin_id":"","color_token":"","edge_source":e["node_a"],"edge_target":e["node_b"]})
    write_csv(root/"render_records.csv",["glyph_id","glyph_type","layout_id","layout_x","layout_y","bin_id","color_token","edge_source","edge_target"],renders)
    meta={"stage":"representation_generators","expected_classes_read":False,"representations":["R0","R1","R2","R3","R4","R5","R6"],"post_samples":len(points),"transition_edges":len(transitions),"recurrence_edges":len(native_edges),"field_queries":len(ef),"estimator_analytic_equation_access":False,"restricted_views":{"R3":"z_only","R4":"opaque graph","R5":"sample_only","R6":"render token/incidence"}}
    with open(root/"representation_generation_record.json","w",encoding="utf-8") as f:json.dump(meta,f,indent=2,sort_keys=True);f.write("\n")
if __name__=="__main__":main()
