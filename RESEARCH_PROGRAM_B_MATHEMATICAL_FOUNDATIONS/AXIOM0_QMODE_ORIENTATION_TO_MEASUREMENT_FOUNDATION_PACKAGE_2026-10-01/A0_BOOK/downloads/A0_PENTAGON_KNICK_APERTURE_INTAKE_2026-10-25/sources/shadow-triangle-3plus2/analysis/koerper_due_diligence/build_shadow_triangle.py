from pathlib import Path
import json, math, struct, zipfile
import numpy as np
from scipy.spatial.transform import Rotation
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

HERE=Path(__file__).resolve().parent
base=(HERE/'build_crown_visual.py').read_text()
# Reuse the exact tested crown coordinates and GLB geometry builder without
# running its output writes. Both scripts are included in the source package.
exec(compile(base.split('# Exact geometric three-state plate')[0],str(HERE/'build_crown_visual.py'),'exec'))
shadow_z=.19
tri=np.array([[0,.65,shadow_z],[-math.sqrt(3)*.65/2,-.325,shadow_z],[math.sqrt(3)*.65/2,-.325,shadow_z]])
weights=np.array([[.7,.15,.15],[.15,.7,.15],[.15,.15,.7]])
points=np.vstack([weights@tri,[[-.16,0,shadow_z],[.16,0,shadow_z]]])
signs=np.array([1,1,1,-1,-1])
centroid=tri.mean(0)
def loads(down):
 forces=np.array([[0,0,1]]*3+[[0,0,-down]]*2,dtype=float)
 return forces.sum(0),np.cross(points-centroid,forces).sum(0)
equal,torque_equal=loads(1);balanced,torque_balanced=loads(1.5)
assert np.linalg.norm(equal-[0,0,1])<1e-12
assert np.linalg.norm(balanced)<1e-12
assert max(np.linalg.norm(torque_equal),np.linalg.norm(torque_balanced))<1e-12
for p in points:
 bary=np.linalg.solve(np.vstack([tri[:,:2].T,np.ones(3)]),np.r_[p[:2],1])
 assert min(bary)>0

plt.rcParams.update({'font.family':'DejaVu Sans','text.color':'#142b41'})
fig=plt.figure(figsize=(16,9),facecolor='#f4f7fa')
fig.text(.045,.94,'NEXAH  |  SHADOW TRIANGLE  3 + 2',fontsize=25,weight='bold')
fig.text(.045,.89,'Eine neue Kontaktebene unter der Fünflaschenkrone',fontsize=15)
ax=fig.add_axes([.025,.25,.52,.59],projection='3d',facecolor='#f4f7fa')
for group,color in [(A,'#47a5b8'),(B,'#c39a38'),(mid,'#47a5b8')]:
 q=np.vstack([group,group[0]]);ax.plot(*q.T,color=color,lw=1.5,alpha=.6)
for i in range(5):
 q=np.array([A[i],mid[i],B[i]]);ax.plot(*q.T,color='#47a5b8',lw=1,alpha=.5)
for q in faces(fc/2):ax.add_collection3d(Poly3DCollection([q],facecolor='#d84f97',edgecolor='#963963',alpha=.4))
ax.add_collection3d(Poly3DCollection([tri],facecolor='#28364a',edgecolor='#152638',alpha=.85))
for i,p in enumerate(points):
 color='#22a4ba' if i<3 else '#ec9336';direction=signs[i];start=p-np.array([0,0,direction*.25])
 ax.quiver(*start,0,0,direction*.25,color=color,arrow_length_ratio=.25,linewidth=2)
 ax.scatter(*p,color=color,s=25,depthshade=False)
ax.scatter(0,0,h/2,color='#8995a3',s=20)
ax.set(xlim=(-1.25,1.25),ylim=(-1.25,1.25),zlim=(-.18,1.65));ax.set_box_aspect([2.5,2.5,1.83]);ax.view_init(20,-56);ax.set_axis_off()
ax2=fig.add_axes([.59,.33,.35,.46],facecolor='#f4f7fa')
q=np.vstack([tri,tri[0]]);ax2.fill(q[:,0],q[:,1],color='#28364a',alpha=.95)
for i,p in enumerate(points):
 color='#3ac4d8' if i<3 else '#ffb354';ax2.scatter(*p[:2],s=115,color=color,zorder=3)
 dx=.025 if p[0]>=0 else -.025
 ax2.text(p[0]+dx,p[1]+.07,('U'+str(i+1)+' ↑')if i<3 else('D'+str(i-2)+' ↓'),color=color,fontsize=12,weight='bold',ha='left'if dx>0 else'right')
ax2.scatter(0,0,marker='+',s=100,color='white',zorder=4)
ax2.set_aspect('equal');ax2.set_xlim(-.79,.79);ax2.set_ylim(-.5,.8);ax2.set_axis_off();ax2.set_title('DRAUFSICHT  ·  fünf innere Kontaktpunkte',fontsize=12,pad=12)
fig.text(.59,.29,'3 × aufwärts  +  2 × abwärts',fontsize=16,weight='bold')
fig.text(.045,.22,'GLEICHE STÄRKE     3 × 1 − 2 × 1 = +1',fontsize=13,weight='bold')
fig.text(.045,.175,'GEWÄHLTER AUSGLEICH     3 × 1 − 2 × 1,5 = 0',fontsize=13,weight='bold')
fig.text(.045,.12,'Beide Gruppen sind um die Mitte angeordnet: Das resultierende Moment ist im idealen Modell null.',fontsize=12)
fig.text(.045,.075,'Pfeile sind vorgeschlagene Eingänge. Das Dreieck bleibt fest; Lager, Antrieb und Stabilität sind noch offen.',fontsize=11,color='#596c7f')
fig.text(.045,.035,'2 + 3 = 5 zählt Kontakte. 1 + 2 = 3 ist eine andere Gruppierung, noch kein zusätzlicher Mechanismus.  |  25.10.2026',fontsize=10,color='#596c7f')
png=OUT/'NEXAH_Shadow_Triangle_3plus2_2026-10-25.png';fig.savefig(png,dpi=170,facecolor=fig.get_facecolor());plt.close(fig)

exec(compile('# glTF 2.0 binary'+base.split('# glTF 2.0 binary',1)[1].split("g['animations']=[animation]",1)[0],str(HERE/'build_crown_visual.py'),'exec'))
shadowmat=mat('Shadow triangle proposed interface',[.055,.075,.12],.2,.55)
upmat=mat('Three upward inputs',[.05,.7,.8],.1,.4)
downmat=mat('Two downward inputs',[1,.43,.1],.1,.4)
trianglemesh=mesh('Shadow triangle zero thickness',[pos(v) for v in tri],[[0,1,2]],shadowmat)
node('New fixed shadow triangle interface',trianglemesh,extras={'status':'PROPOSED_INTERFACE_FIXED_NOT_SOLVED_DYNAMICS','contactPlaneSourceZ':shadow_z})
# Reusable solid arrows. Length has no force calibration; signs are proposals.
def arrow_mesh(material):
 vertices=[];indices=[];n=16
 # Shaft ending under a wider conical head; local y points toward input direction.
 for y,r in [(0,.02),(.19,.02),(.19,.055)]:
  for j in range(n):vertices.append([r*math.cos(j*math.tau/n)*SCALE,y*SCALE,r*math.sin(j*math.tau/n)*SCALE])
 vertices.append([0,.25*SCALE,0]);tip=len(vertices)-1
 for j in range(n):
  k=(j+1)%n;indices.extend([[j,k,n+k],[j,n+k,n+j],[2*n+j,2*n+k,tip]])
 return mesh('Schematic pressure arrow '+str(material),vertices,indices,material)
upmesh=arrow_mesh(upmat);downmesh=arrow_mesh(downmat)
for i,p in enumerate(points):
 direction=np.array([0,0,float(signs[i])]);start=p-direction*.25
 quat=Rotation.align_vectors([Q@direction],[[0,1,0]])[0].as_quat().tolist()
 node(('U'+str(i+1))if i<3 else('D'+str(i-2)),upmesh if i<3 else downmesh,pos(start),quat,extras={'kind':'PROPOSED_INPUT_ARROW','sourcePoint':p.tolist(),'sourceDirection':direction.tolist(),'forceMagnitude':'unspecified; arrow length not calibrated'})
g['extras'].update({'shadowTriangle':'NEW_FIXED_INTERFACE_NOT_RECOVERED_A0_GEOMETRY','inputGrouping':{'up':3,'down':2},'loadCases':{'equalUnitInputs':{'resultant':equal.tolist(),'momentAboutCentroid':torque_equal.tolist()},'balancedSelectedInputs':{'upMagnitude':1,'downMagnitude':1.5,'resultant':balanced.tolist(),'momentAboutCentroid':torque_balanced.tolist()}},'scope':'Five animated crown flaps; fixed lantern and new fixed triangular interface with 3 upward and 2 downward proposed inputs. No solved transmission between roof and inputs. No stability, force or collision certification.'})
g['animations']=[animation];g['buffers']=[{'byteLength':len(blob)}]
j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);blob.extend(b'\0'*((-len(blob))%4))
glb=OUT/'NEXAH_Shadow_Triangle_3plus2_Animiert_2026-10-25.glb'
glb.write_bytes(struct.pack('<III',0x46546c67,2,28+len(j)+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob)
raw=glb.read_bytes();magic,ver,total=struct.unpack_from('<III',raw);assert total==len(raw) and ver==2
assert len(animation['channels'])==5
for bv in g['bufferViews']:assert bv.get('byteOffset',0)+bv['byteLength']<=g['buffers'][0]['byteLength']
data={'status':'NEW_PROPOSED_GEOMETRY_NOT_NATIVE_A0_RECOVERY','triangle':tri.tolist(),'contacts':points.tolist(),'directions':[[0,0,int(s)] for s in signs],'equalCase':{'force':equal.tolist(),'moment':torque_equal.tolist()},'balancedCase':{'up':1,'down':1.5,'force':balanced.tolist(),'moment':torque_balanced.tolist()},'tests':'All points strictly inside triangle; force and moment sums checked; original crown kinematics retained; GLB buffer bounds checked.','limits':'No transmission, support, stiffness, friction or force calibration. Zero resultant does not establish stability. Triangle fixed in animation. Exact source points in u; GLB scale .1 metres per u.'}
notes='''NEXAH Shadow Triangle 3+2 · 25.10.2026
Neue geometrische Kopplungsvariante auf Wunsch des Autors; keine Wiedergewinnung einer metrisch bestimmten A0 Originalfläche.
Pink: fünf animierte Kronenlaschen. Cyan: feste Laternenreferenz und drei Aufwärtseingänge U1 bis U3. Orange: zwei Abwärtseingänge D1 und D2. Dunkel: neues festes Shadow Triangle.
Die drei Aufwärtspunkte sind symmetrisch zur Mitte. Die zwei Abwärtspunkte liegen symmetrisch auf der x Achse. Alle fünf Punkte liegen strikt im Dreieck. Damit ist das Moment beider Gruppen um den Dreiecksschwerpunkt null.
Bei gleichen Kräften 1 pro Eingang ist die Nettokraft +1 nach oben. Bei Stärke 1 der drei und 1,5 der zwei ist sie null. Kräfte sind relative Einheiten; keine Kalibrierung in Newton. Weitere Lasten und Reaktionen sind nicht berücksichtigt.
Das Dreieck bleibt bewusst fest. Keine Kraftübertragung aus der Krone behauptet. Eine künftige bewegliche Version braucht Lager, Zwangsbedingungen und einen definierten Antrieb. Gleichgewicht allein bedeutet keine Stabilität.
Animation der Krone: 8 Sekunden offen zu Spitzenkontakt und zurück, Kontaktwinkel 151,830500786 Grad. GLB Y up, 1 u entspricht .1 m. Pfeile sind geometrische Eingangssymbole und zeigen keine simulierten Materialdrücke.
Reproduktion: Python 3 mit numpy scipy matplotlib. Beide Python Skripte sowie models.json und native_contact_results.json im Ordner analysis/koerper_due_diligence belassen; build_shadow_triangle.py ausführen.
Prüfungen: Kontaktpunkte im Dreieck; Kraft und Moment; ursprüngliche starre Laschenkinematik; GLB Header und Puffergrenzen. Kein unabhängiger glTF Validator, kein visueller GLB Viewer und keine vollständige Kollisionsprüfung.
'''
with zipfile.ZipFile(OUT/'NEXAH_Shadow_Triangle_3plus2_Quellen_2026-10-25.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in ['build_shadow_triangle.py','build_crown_visual.py','models.json','native_contact_results.json']:z.write(HERE/name,'analysis/koerper_due_diligence/'+name)
 z.writestr('contact_model.json',json.dumps(data,indent=2));z.writestr('README.txt',notes);z.writestr('deliverables/.keep','')
print(json.dumps({'png':str(png),'glb':str(glb),'nodes':len(g['nodes']),'bytes':len(raw),'forceEqual':equal.tolist(),'forceBalanced':balanced.tolist(),'torques':[torque_equal.tolist(),torque_balanced.tolist()],'tests':'PASS'},indent=2))
