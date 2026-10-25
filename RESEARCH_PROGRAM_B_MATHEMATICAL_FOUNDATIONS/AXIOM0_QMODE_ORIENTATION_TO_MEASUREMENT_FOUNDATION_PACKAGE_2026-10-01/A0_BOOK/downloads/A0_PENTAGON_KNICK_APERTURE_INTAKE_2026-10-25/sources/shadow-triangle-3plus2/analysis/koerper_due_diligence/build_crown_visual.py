from pathlib import Path
import json, math, struct, zipfile
import numpy as np
from scipy.spatial.transform import Rotation
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

HERE=Path(__file__).resolve().parent
OUT=HERE.parents[1]/'deliverables'
M=json.loads((HERE/'models.json').read_text())
N=json.loads((HERE/'native_contact_results.json').read_text())
ref=M['reference']; roof=N['pentagonExtension']
f=roof['flapAltitude']; a=roof['baseApothem']; fc=math.radians(roof['contactFoldDegrees']); h=ref['h']
# Use the exact upper reference frame edges, not an independently rotated pentagon.
B=np.array(ref['B']); A=np.array(ref['A']); mid=np.array(ref['M'])
hinges=[]
for i in range(5):
 v,w=B[i],B[(i+1)%5]; center=(v+w)/2
 tangent=(w-v)/np.linalg.norm(w-v); outward=center.copy(); outward[2]=0; outward/=np.linalg.norm(outward)
 assert abs(tangent@outward)<1e-12
 hinges.append((v,w,center,tangent,outward))
def faces(F):
 return [np.array([v,w,c+f*math.cos(F)*o+np.array([0,0,f*math.sin(F)])]) for v,w,c,t,o in hinges]
closed=faces(fc)
assert max(np.linalg.norm(q[2]-np.array([0,0,h+roof['apexHeightAtContact']])) for q in closed)<1e-12
for F in np.linspace(0,fc,121):
 for q in faces(F):
  assert abs(np.linalg.norm(q[2]-q[0])-roof['leg'])<1e-12
  assert abs(np.linalg.norm(q[2]-q[1])-roof['leg'])<1e-12

# Exact geometric three-state plate, using the same faces as the GLB.
plt.rcParams.update({'font.family':'DejaVu Sans','text.color':'#132b40','axes.labelcolor':'#132b40'})
fig=plt.figure(figsize=(16,8.4),facecolor='#f4f7fa')
fig.text(.045,.94,'NEXAH  |  DIE FÜNFLASCHENKRONE',fontsize=23,weight='bold')
fig.text(.045,.895,'Fünf freie Spitzen treffen sich über demselben Pentagonrand',fontsize=15)
states=[(0,'OFFEN','0,00°'),(fc/2,'IM ÜBERGANG',f'{math.degrees(fc/2):.2f}°'.replace('.',',')),(fc,'SPITZENKONTAKT','151,83°')]
for k,(F,title,angle) in enumerate(states):
 ax=fig.add_subplot(1,3,k+1,projection='3d',facecolor='#f4f7fa')
 for group in [A,B,mid]:
  q=np.vstack([group,group[0]]); ax.plot(*q.T,color='#46a8b9' if group is not B else '#cc9d38',lw=1.8,alpha=.8)
 for i in range(5):
  q=np.array([A[i],mid[i],B[i]]); ax.plot(*q.T,color='#46a8b9',lw=1.3,alpha=.65)
 for q in faces(F):
  ax.add_collection3d(Poly3DCollection([q],facecolors='#d35a9a',edgecolors='#983363',linewidths=1,alpha=.55))
  ax.scatter(*q[2],color='#de3f90',s=19,depthshade=False)
 ax.scatter(0,0,h/2,s=24,color='#83909d',depthshade=False)
 ax.set(xlim=(-1.65,1.65),ylim=(-1.65,1.65),zlim=(-.1,2.0)); ax.set_box_aspect([3.3,3.3,2.1]); ax.view_init(23,-56); ax.set_axis_off()
 ax.set_title(title+'\nF = '+angle,fontsize=13,pad=-3,weight='bold')
fig.subplots_adjust(left=.025,right=.975,bottom=.21,top=.83,wspace=.03)
fig.text(.045,.19,'PINK  freie Laschen     GOLD  Rand und Scharniere     CYAN  feste Laternenreferenz',fontsize=12)
fig.text(.045,.14,'Kante 1 u  ·  Laschenschenkel 0,927051 u  ·  Spitzenhöhe bei Kontakt 0,368533 u über dem Rand',fontsize=12)
fig.text(.045,.095,'Räumlicher Modellkandidat: Deckel, Antrieb und reale Gelenkdicken sind noch nicht integriert.',fontsize=11,color='#586b7d')
fig.text(.045,.05,'A0 Kontaktmodell → explizite Erweiterung auf fünf Laschen  |  25.10.2026',fontsize=10,color='#586b7d')
png=OUT/'NEXAH_Fuenflaschenkrone_2026-10-25.png'
fig.savefig(png,dpi=170,facecolor=fig.get_facecolor());plt.close(fig)

# glTF 2.0 binary; source z-up becomes glTF y-up. 1 u = 0.1 m.
SCALE=.1
Q=np.array([[1,0,0],[0,0,1],[0,-1,0]])
def pos(p):return (Q@np.array(p)*SCALE).tolist()
g={'asset':{'version':'2.0','generator':'NEXAH exact crown geometry 2026-10-25'},'scene':0,'scenes':[{'name':'Five flap crown and fixed lantern reference','nodes':[]}],'nodes':[],'meshes':[],'materials':[],'accessors':[],'bufferViews':[],'buffers':[], 'extras':{'sourceUnitMetres':SCALE,'foldContactDegrees':roof['contactFoldDegrees'],'scope':'New n5 3D lift of A0 fold contact. Five open flaps. Cyan lantern fixed reference. No integrated cover, actuator, finite thickness or collision certification.','animation':'0 to contact and back in 8 seconds; no free edge gluing before contact'}}
blob=bytearray()
def acc(array,component,kind,target=None):
 arr=np.asarray(array,dtype=np.float32 if component==5126 else np.uint16)
 while len(blob)%4:blob.append(0)
 offset=len(blob);blob.extend(arr.tobytes()); bv={'buffer':0,'byteOffset':offset,'byteLength':arr.nbytes}
 if target:bv['target']=target
 bi=len(g['bufferViews']);g['bufferViews'].append(bv)
 count=len(arr);v={'bufferView':bi,'componentType':component,'count':count,'type':kind}
 if component==5126:
  z=arr.reshape(count,-1);v['min']=z.min(0).tolist();v['max']=z.max(0).tolist()
 ai=len(g['accessors']);g['accessors'].append(v);return ai
def mat(name,color,metal=.1,rough=.45):
 i=len(g['materials']);g['materials'].append({'name':name,'doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':[*color,1],'metallicFactor':metal,'roughnessFactor':rough}});return i
pink=mat('Pink free rigid flaps',[.82,.16,.43],.15,.35)
gold=mat('Gold rim hinges',[.87,.58,.14],.5,.35)
cyan=mat('Cyan fixed reference',[.12,.58,.67],.2,.45)
white=mat('White pin and contact',[.91,.94,.97],.2,.25)
def mesh(name,vertices,indices,material):
 vv=np.array(vertices,dtype=float); ii=np.array(indices).reshape(-1,3); normals=np.zeros_like(vv)
 for face in ii:
  v=vv[face]; nn=np.cross(v[1]-v[0],v[2]-v[0]); ln=np.linalg.norm(nn)
  if ln: normals[face]+=nn/ln
 norms=np.linalg.norm(normals,axis=1);normals/=np.where(norms>0,norms,1)[:,None]
 mi=len(g['meshes']);g['meshes'].append({'name':name,'primitives':[{'attributes':{'POSITION':acc(vv,5126,'VEC3',34962),'NORMAL':acc(normals,5126,'VEC3',34962)},'indices':acc(ii.flatten(),5123,'SCALAR',34963),'material':material}]});return mi
def node(name,mi,translation=None,rotation=None,scale=None,extras=None):
 nn={'name':name,'mesh':mi}
 if translation is not None:nn['translation']=translation
 if rotation is not None:nn['rotation']=rotation
 if scale is not None:nn['scale']=scale
 if extras:nn['extras']=extras
 ni=len(g['nodes']);g['nodes'].append(nn);g['scenes'][0]['nodes'].append(ni);return ni
# Shared unit cylinder with local y axis.
vs=[];ids=[]
for y in [0,1]:
 for i in range(12):vs.append([math.cos(i*math.tau/12),y,math.sin(i*math.tau/12)])
vs.extend([[0,0,0],[0,1,0]])
for i in range(12):
 j=(i+1)%12;ids.extend([[i,j,j+12],[i,j+12,i+12],[24,j,i],[25,i+12,j+12]])
cyls={m:mesh('unit beam '+str(m),vs,ids,m) for m in [gold,cyan,white]}
def beam(v,w,material,radius=.009,name='beam'):
 v=np.array(pos(v));w=np.array(pos(w));d=w-v;length=np.linalg.norm(d);unit=d/length
 rot=Rotation.align_vectors([unit],[[0,1,0]])[0].as_quat().tolist()
 return node(name,cyls[material],v.tolist(),rot,[radius*SCALE,length,radius*SCALE])
for i in range(5):
 beam(A[i],A[(i+1)%5],cyan,name=f'Lower frame A{i}')
 beam(mid[i],mid[(i+1)%5],cyan,.006,name=f'Middle reference M{i}')
 beam(A[i],mid[i],cyan,.007,name=f'Fixed lower path {i}')
 beam(mid[i],B[i],cyan,.007,name=f'Fixed upper path {i}')
 beam(B[i],B[(i+1)%5],gold,.014,name=f'Crown hinge {i}')
beam([0,0,h/2-.045],[0,0,h/2+.045],white,.025,'Fixed central pin')
flapmesh=mesh('Rigid isosceles flap',[[-.5*SCALE,0,0],[.5*SCALE,0,0],[0,f*SCALE,0]],[[0,1,2]],pink)
times=np.linspace(0,8,161);folds=fc*(.5-.5*np.cos(times*math.tau/8))
ti=acc(times,5126,'SCALAR');animation={'name':'Open to contact and return','samplers':[],'channels':[]}
for i,(v,w,c,t,o) in enumerate(hinges):
 basis=Q@np.column_stack([t,o,[0,0,-1]])
 assert np.linalg.det(basis)>.999999
 base=Rotation.from_matrix(basis)
 quats=(base*Rotation.from_rotvec(np.column_stack([-folds,np.zeros(len(times)),np.zeros(len(times))]))).as_quat()
 for j in range(1,len(quats)):
  if quats[j]@quats[j-1]<0:quats[j]*=-1
 ni=node(f'Pink free flap {i+1}',flapmesh,pos(c),quats[0].tolist(),extras={'hingeAxisSource':t.tolist(),'contactDegrees':roof['contactFoldDegrees']})
 qi=acc(quats,5126,'VEC4');si=len(animation['samplers']);animation['samplers'].append({'input':ti,'output':qi,'interpolation':'LINEAR'});animation['channels'].append({'sampler':si,'target':{'node':ni,'path':'rotation'}})
 # Verify animated node reconstruction independently of plotting.
 for j in [0,40,80,120,160]:
  tip=Rotation.from_quat(quats[j]).apply([0,f*SCALE,0])+np.array(pos(c))
  expected=np.array(pos(faces(folds[j])[i][2]));assert np.linalg.norm(tip-expected)<1e-12
g['animations']=[animation]
g['buffers']=[{'byteLength':len(blob)}]
j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);blob.extend(b'\0'*((-len(blob))%4))
glb=OUT/'NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb'
glb.write_bytes(struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob)
# Structural readback and accessor limits.
raw=glb.read_bytes();magic,ver,total=struct.unpack_from('<III',raw);assert magic==0x46546c67 and ver==2 and total==len(raw)
jl,jt=struct.unpack_from('<II',raw,12);gg=json.loads(raw[20:20+jl]);assert len(gg['animations'][0]['channels'])==5
for b in gg['bufferViews']:assert b.get('byteOffset',0)+b['byteLength']<=gg['buffers'][0]['byteLength']
notes='''NEXAH Fünflaschenkrone 25.10.2026
GLB 2.0, ein Modell, fünf animierte Laschen, Zyklus 8 Sekunden.
Animation gegebenenfalls im 3D Viewer starten. Pink: offene starre Laschen; Gold: Randachsen; Cyan: feste Laternenreferenz; Weiß: fester Pin.
Maßstab: 1 Quelleneinheit entspricht 0,1 m. Native Z Achse wird glTF Y Achse.
Kontakt bei F=151,830500786 Grad; Spitzenhöhe 0,368533211 u über Rand.
Der Dreier/Vierer Kontaktansatz stammt aus A0. Die räumliche Fünfererweiterung ist ein neuer Modellkandidat. Keine integrierte Mechanik, keine Kollisionsfreigabe; Deckel, Antrieb und reale Laschendicke fehlen. Das Visual ist aus denselben exakten Dreieckskoordinaten erzeugt. Die GLB Knoten bewegen sich durch starre Scharnierrotation, nicht durch gedehnte Dreiecke.
Prüfungen: Schenkellängen in 121 Stellungen; zentraler Kontakt aller fünf Spitzen; fünf GLB Quaternionpfade gegen direkte Koordinaten; GLB Header und Puffergrenzen. Kein unabhängiger glTF Validator oder visueller GLB Viewer verwendet.
Reproduktion: Python 3 mit numpy scipy matplotlib; build_crown_visual.py mit models.json und native_contact_results.json im Ordner analysis/koerper_due_diligence ausführen; deliverables als Ausgabeordner.
'''
with zipfile.ZipFile(OUT/'NEXAH_Fuenflaschenkrone_Quellen_2026-10-25.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.write(__file__,'analysis/koerper_due_diligence/build_crown_visual.py')
 for name in ['models.json','native_contact_results.json']:z.write(HERE/name,'analysis/koerper_due_diligence/'+name)
 z.writestr('README.txt',notes)
 z.writestr('deliverables/.keep','')
print(json.dumps({'png':str(png),'glb':str(glb),'glbBytes':len(raw),'nodes':len(g['nodes']),'flapChannels':5,'contactMaxError':max(np.linalg.norm(q[2]-closed[0][2]) for q in closed),'tests':'PASS'},indent=2))
