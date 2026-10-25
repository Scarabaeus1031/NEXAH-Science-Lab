from pathlib import Path
import json,numpy as np
ROOT=Path(__file__).resolve().parent
p=ROOT/'nexah-all-tests.json';r=json.loads(p.read_text());es=set()
for v in r['graph']['paths']:
 for a,b in zip(v['path'],v['path'][1:]):es.add(tuple(sorted((a,b))))
def traces(edges):
 d=[(a,b) for e in edges for a,b in [e,e[::-1]]]
 M=np.array([[int(v==x and w!=u) for x,w in d] for u,v in d],dtype=np.int64)
 return {'directedEdges':len(d),'traces':{str(k):int(np.trace(np.linalg.matrix_power(M,k))) for k in [4,5,6]}}
r['graph']['nonbacktracking_selected']=traces(es)
r['graph']['nonbacktracking_native_induced']=traces(es|{tuple(sorted(x)) for x in r['graph']['extraNativeEdges']})
assert r['graph']['nonbacktracking_selected']['traces']['4']==0
assert r['graph']['nonbacktracking_native_induced']['traces']['4']==176
p.write_text(json.dumps(r,indent=2));print(r['graph']['nonbacktracking_selected'],r['graph']['nonbacktracking_native_induced'])
