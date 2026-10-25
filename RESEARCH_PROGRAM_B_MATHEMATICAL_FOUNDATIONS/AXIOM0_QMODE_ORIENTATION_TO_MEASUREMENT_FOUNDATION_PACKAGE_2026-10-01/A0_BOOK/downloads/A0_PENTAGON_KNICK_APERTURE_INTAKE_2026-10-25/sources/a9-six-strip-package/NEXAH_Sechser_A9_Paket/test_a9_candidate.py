from pathlib import Path
import json,math,collections
ROOT=Path(__file__).resolve().parent
src=json.load(open(ROOT/'a9-base-source.json'));p=src['points'];order=sorted(p,key=lambda k:tuple(p[k]))
def cross(o,a,b):return(p[a][0]-p[o][0])*(p[b][1]-p[o][1])-(p[a][1]-p[o][1])*(p[b][0]-p[o][0])
def half(order):
    h=[]
    for q in order:
        while len(h)>1 and cross(h[-2],h[-1],q)<=1e-12:h.pop()
        h.append(q)
    return h
h=half(order)[:-1]+half(order[::-1])[:-1];assert len(h)==11
pin=src['pin'];vertices=[[p[k][0],p[k][1],0] for k in h]+[[*pin,.65],[*pin,-.65]]
for i in range(11):
    a,b=vertices[i],vertices[(i+1)%11]
    assert (b[0]-a[0])*(pin[1]-a[1])-(b[1]-a[1])*(pin[0]-a[0])>0
faces=[]
for i in range(11):faces.extend([[11,i,(i+1)%11],[12,(i+1)%11,i]])
edges=collections.Counter(tuple(sorted((f[i],f[(i+1)%3]))) for f in faces for i in range(3));assert len(edges)==33 and set(edges.values())=={2};assert len(vertices)-len(edges)+len(faces)==2
result={'status':'NEW_DECLARED_A9_CANDIDATE_NOT_RECOVERED_SOURCE_MESH','base':'Convex hull of the projected 15 A/B/M points; flattened as a new planar base, not original noncoplanar 3D vertices.','base_source':src,'base_point_labels':h,'apex_height':.65,'vertices':vertices,'faces':faces,'counts':{'base':{'V':11,'E':11,'F_disk':1},'pyramid':{'V':12,'E':22,'F':12},'bipyramid':{'V':13,'E':33,'F':22,'Euler':2,'eachEdgeIncidentFaces':2}},'open':'A3*3 and G6/DE7/E8/F9 have no defined operator or recovered mesh in this test.'}
(ROOT/'nexah-a9-candidate.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result['counts']))
