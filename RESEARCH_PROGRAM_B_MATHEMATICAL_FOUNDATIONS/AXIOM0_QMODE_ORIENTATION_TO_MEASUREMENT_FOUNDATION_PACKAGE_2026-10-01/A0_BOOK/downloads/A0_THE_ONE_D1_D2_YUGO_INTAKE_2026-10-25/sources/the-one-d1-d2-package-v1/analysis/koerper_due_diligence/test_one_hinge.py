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
model=json.loads((HERE/'models.json').read_text()); ref=model['reference']; h=ref['h']
z0=.19; r=.65; half=r/math.sqrt(3)
origin=np.array([0,0,z0]); left=np.array([-half,0,z0]); right=np.array([half,0,z0]); tip=np.array([0,r,z0])
upper=np.array([left,right,tip]); lower=np.array([left,[-math.sqrt(3)*r/2,-r/2,z0],[math.sqrt(3)*r/2,-r/2,z0],right])
A=np.array(ref['A']);B=np.array(ref['B']);M=np.array(ref['M'])
def folded(alpha):
 return Rotation.from_rotvec([math.radians(alpha),0,0]).apply(upper-origin)+origin
def pointseg(p,a,b):
 d=b-a;return np.linalg.norm(p-a-np.clip((p-a)@d/(d@d),0,1)*d)
def pointtri(p,t):
 a,b,c=t;u=b-a;v=c-a;n=np.cross(u,v);q=p-n*((p-a)@n/(n@n));uv=np.linalg.solve([[u@u,u@v],[u@v,v@v]],[(q-a)@u,(q-a)@v])
 if min(uv)>=-1e-12 and sum(uv)<=1+1e-12:return abs((p-a)@n)/np.linalg.norm(n)
 return min(pointseg(p,t[i],t[(i+1)%3])for i in range(3))
def segseg(a,b,c,d):
 u=b-a;v=d-c;w=a-c;aa=u@u;bb=u@v;cc=v@v;dd=u@w;ee=v@w;det=aa*cc-bb*bb
 values=[pointseg(a,c,d),pointseg(b,c,d),pointseg(c,a,b),pointseg(d,a,b)]
 if det>1e-20:
  s=(bb*ee-cc*dd)/det;t=(aa*ee-bb*dd)/det
  if 0<=s<=1 and 0<=t<=1:values.append(np.linalg.norm(w+s*u-t*v))
 return min(values)
def segtri(a,b,t):
 n=np.cross(t[1]-t[0],t[2]-t[0]);den=(b-a)@n
 if abs(den)>1e-14:
  u=(t[0]-a)@n/den
  if 0<=u<=1 and pointtri(a+u*(b-a),t)<1e-10:return 0.
 return min(pointtri(a,t),pointtri(b,t),*(segseg(a,b,t[i],t[(i+1)%3])for i in range(3)))
def tritri(a,b):
 return min(*(segtri(a[i],a[(i+1)%3],b) for i in range(3)),*(segtri(b[i],b[(i+1)%3],a)for i in range(3)))
testtri=np.array([[0,0,0],[1,0,0],[0,1,0]],float)
assert abs(pointtri(np.array([.2,.2,1]),testtri)-1)<1e-12
assert segtri(np.array([.2,.2,-1]),np.array([.2,.2,1]),testtri)==0
assert abs(segseg(np.array([0,0,0]),np.array([1,0,0]),np.array([.5,1,0]),np.array([.5,2,0]))-1)<1e-12
bars=[]
for i in range(5):
 for name,v,w in [('A',A[i],A[(i+1)%5]),('B',B[i],B[(i+1)%5]),('M',M[i],M[(i+1)%5]),('lower',A[i],M[i]),('upper',M[i],B[i])]:bars.append((name+str(i),v,w))
pin=np.array([0,0,h/2]);pinrad=.04;bar_rad=.014
# The crown is held at the mid-state. It is not driven with the new hinge.
source=(HERE/'build_crown_visual.py').read_text();ns={'__file__':str(HERE/'build_crown_visual.py')}
exec(compile(source.split('# Exact geometric three-state plate')[0],str(HERE/'build_crown_visual.py'),'exec'),ns)
roof=ns['faces'](ns['fc']/2)
rows=[]
for alpha in np.linspace(0,90,181):
 t=folded(alpha);barvals=[segtri(v,w,t)-bar_rad for name,v,w in bars]
 vals={'pin':pointtri(pin,t)-pinrad,'frame':min(barvals),'fixedCrown':min(tritri(t,q)for q in roof)}
 rows.append({'angle':float(alpha),**{k:float(v)for k,v in vals.items()},'minimum':float(min(vals.values())),'nearestBar':bars[int(np.argmin(barvals))][0]})
 assert abs(np.linalg.norm(t[2]-t[0])-np.linalg.norm(upper[2]-upper[0]))<1e-12
 assert np.max(np.abs(t[:2]-upper[:2]))<1e-12
chosen=45.
sampled=min(x['minimum']for x in rows if x['angle']<=chosen)
motion=2*r*math.sin(math.radians(.125));bound=sampled-motion-1e-9
assert bound>0
assert pointtri(pin,folded(90))-pinrad<0
pin_contact=math.degrees(math.acos(pinrad/(pin[2]-z0)))
first=next((x for x in rows if x['minimum']<=0),None)
# Unmoving lower panel screened as two triangles against same obstacles.
fixedtris=[lower[[0,1,2]],lower[[0,2,3]]]
fixedclear=min(min(pointtri(pin,t)-pinrad,*(segtri(v,w,t)-bar_rad for name,v,w in bars),*(tritri(t,q)for q in roof))for t in fixedtris)
assert fixedclear>0
area=.5*np.linalg.norm(np.cross(upper[1]-upper[0],upper[2]-upper[0]))
aperture=area*(1-math.cos(math.radians(chosen)))
moment=.55*r*(math.cos(math.radians(chosen))-1)
cp=np.array([[0,.55*r*math.cos(math.radians(chosen)),.55*r*math.sin(math.radians(chosen))],[-math.sqrt(3)*r*.55/2,-r*.55/2,0],[math.sqrt(3)*r*.55/2,-r*.55/2,0],[-.16,0,0],[.16,0,0]])
forces=np.array([[0,0,1]]*3+[[0,0,-1.5]]*2)
assert np.max(abs(np.cross(cp,forces).sum(0)-[moment,0,0]))<1e-12
results={'case':'THE_ONE_D1_D2_01','newDocumentBoundary':'All preceding work treated as handed to Codex; no older decision reopened.','status':'LOCAL_HINGE_CANDIDATE_WITH_POSITIVE_BOUNDED_CLEARANCE_FOR_0_TO_45_DEGREES','sourceGeometry':'New split of the previously proposed shadow triangle, not a recovered native A0 mechanism.','hingeEndpoints':[left.tolist(),right.tolist()],'bearingLocations':[[-.16,0,z0],[.16,0,z0]],'upperTriangle':upper.tolist(),'fixedLowerTrapezoid':lower.tolist(),'hingeLength':2*half,'upperArea':area,'selectedFoldDegrees':chosen,'sampleStepDegrees':.5,'sampleMinimumClearance0to45':sampled,'betweenSampleMotionBound':motion,'continuousClearanceLowerBound0to45':bound,'boundAssumptions':'Zero thickness moving panel; sphere pin radius .04u; frame centerline capsules radius .014u; fixed crown at half its contact angle; no added supports. Floating point calculation with analytic angular movement bound.','fixedLowerMinimumClearance':fixedclear,'firstSampledContact':first,'analyticPinContactDegrees':pin_contact,'projectedOpeningAt45':aperture,'verticalInputMomentAt45':moment,'momentAssumptions':'U1 point moves with upper panel; U2 and U3 stay fixed; all upward inputs remain vertical with relative strength 1; both downward inputs are on hinge and exert no hinge moment; exclude gravity and all other loads.','allSamples':rows,'limits':['No mounting to frame designed.','No actuator or force transmission from crown.','Zero resultant force of earlier 3 plus 2 pattern does not imply zero moment after fold.','No full assembly collision or material test.','Five crown flaps held fixed in this test.']}
(OUT/'NEXAH_The_One_D1_D2_Test_01.json').write_text(json.dumps(results,indent=2))

plt.rcParams.update({'font.family':'DejaVu Sans','text.color':'#173048'})
fig=plt.figure(figsize=(15.5,8.5),facecolor='#f4f7fa')
fig.text(.045,.94,'THE ONE  |  D1–D2 FALTVERSUCH 01',fontsize=25,weight='bold')
fig.text(.045,.885,'Eine Achse · zwei Lagerstellen · ein bewegliches Dreieck',fontsize=15)
ax=fig.add_axes([.025,.20,.55,.63],projection='3d',facecolor='#f4f7fa')
for group in [A,B,M]:
 q=np.vstack([group,group[0]]);ax.plot(*q.T,color='#54a8b7',alpha=.3,lw=1)
for i in range(5):q=np.array([A[i],M[i],B[i]]);ax.plot(*q.T,color='#54a8b7',alpha=.3,lw=1)
ax.add_collection3d(Poly3DCollection([lower],facecolor='#24384e',edgecolor='#142b43',alpha=.95))
ax.add_collection3d(Poly3DCollection([upper],facecolor='#df9b32',edgecolor='#cf8e28',alpha=.15))
ax.add_collection3d(Poly3DCollection([folded(chosen)],facecolor='#d4498c',edgecolor='#8e2b60',alpha=.8))
ax.plot(*np.array([left,right]).T,color='#dfac3e',lw=4)
for name,x in [('D1',-.16),('D2',.16)]:ax.scatter(x,0,z0,color='#f0b944',s=35);ax.text(x,0,z0+.035,name,fontsize=10,color='#d59a24',weight='bold')
ax.scatter(*pin,color='#737d8a',s=50);ax.text(*(pin+np.array([0,0,.07])),'Pin',fontsize=10)
tt=np.array([folded(k)[2] for k in np.linspace(0,chosen,40)]);ax.plot(*tt.T,'--',color='#d4498c',lw=1.5)
ax.set(xlim=(-1,1),ylim=(-1,1),zlim=(-.15,1.15));ax.set_box_aspect([2,2,1.3]);ax.view_init(24,-56);ax.set_axis_off()
ax2=fig.add_axes([.64,.36,.30,.40],facecolor='white')
ax2.plot([x['angle']for x in rows],[x['pin']for x in rows],label='Pin',color='#6b7583')
ax2.plot([x['angle']for x in rows],[x['frame']for x in rows],label='Rahmen',color='#339eb1')
ax2.axvspan(0,45,color='#83cbb5',alpha=.2);ax2.axhline(0,color='#ce548d',lw=1);ax2.axvline(pin_contact,color='#6b7583',ls='--',lw=1)
ax2.set(xlabel='Faltwinkel α in Grad',ylabel='Oberflächenabstand in u',xlim=(0,90));ax2.legend(frameon=False,fontsize=10);ax2.spines[['top','right']].set_visible(False)
fig.text(.64,.80,'LOKALER TEST  0° → 45°',fontsize=14,weight='bold')
fig.text(.64,.28,f'Abstandsuntergrenze: {bound:.6f} u'.replace('.',','),fontsize=12)
fig.text(.045,.17,'PINK  beweglich     DUNKEL  fest     GOLD  D1–D2 Achse     blasse Fläche  Ausgangslage',fontsize=12)
fig.text(.045,.115,f'Projizierte Öffnung bei 45°: {aperture:.6f} u²  |  Pinberührung rechnerisch bei {pin_contact:.2f}°'.replace('.',','),fontsize=12)
fig.text(.045,.065,'Neuer lokaler Versuch. Rahmenbefestigung, Antrieb und reale Flächendicke sind noch nicht konstruiert.',fontsize=11,color='#627487')
png=OUT/'NEXAH_The_One_D1_D2_Test_01.png';fig.savefig(png,dpi=170,facecolor=fig.get_facecolor());plt.close(fig)

# GLB: reuse the frame and roof helper geometry; freeze roof, animate only new hinge.
exec(compile('# glTF 2.0 binary'+source.split('# glTF 2.0 binary',1)[1].split("g['animations']=[animation]",1)[0],str(HERE/'build_crown_visual.py'),'exec'),ns)
g=ns['g'];blob=ns['blob'];mesh=ns['mesh'];node=ns['node'];mat=ns['mat'];pos=ns['pos'];beam=ns['beam'];acc=ns['acc']
for i,hinge in enumerate(ns['hinges']):
 v,w,c,t,o=hinge;basis=ns['Q']@np.column_stack([t,o,[0,0,-1]]);q=(Rotation.from_matrix(basis)*Rotation.from_rotvec([-ns['fc']/2,0,0])).as_quat().tolist()
 for nn in g['nodes']:
  if nn['name']==f'Pink free flap {i+1}':nn['rotation']=q;nn['name']=f'Fixed crown reference {i+1}'
dark=mat('Fixed lower trapezoid',[.04,.085,.14],.2,.5)
magenta=mat('New rotating upper triangle',[.83,.12,.4],.1,.4)
node('Fixed lower shadow panel',mesh('Fixed trapezoid',[pos(v)for v in lower],[[0,1,2],[0,2,3]],dark))
moving=node('THE ONE rotating upper triangle',mesh('New upper triangle',[pos(v-origin) for v in upper],[[0,1,2]],magenta),pos(origin))
beam(left,right,ns['gold'],.012,'D1 D2 full hinge line')
for x,label in [(-.16,'D1'),(.16,'D2')]:beam([x-.025,0,z0],[x+.025,0,z0],ns['gold'],.026,'Ideal bearing '+label)
times=np.linspace(0,8,161);angles=math.radians(chosen)*(.5-.5*np.cos(times*math.tau/8));quats=Rotation.from_rotvec(np.column_stack([angles,np.zeros(len(times)),np.zeros(len(times))])).as_quat()
g['animations']=[{'name':'THE ONE local hinge 0 to 45 and return','samplers':[{'input':acc(times,5126,'SCALAR'),'output':acc(quats,5126,'VEC4'),'interpolation':'LINEAR'}],'channels':[{'sampler':0,'target':{'node':moving,'path':'rotation'}}]}]
for j in [0,40,80,120,160]:
 rotated=Rotation.from_quat(quats[j]).apply(np.array([pos(v-origin)for v in upper]))+np.array(pos(origin))
 expected=np.array([pos(v)for v in folded(math.degrees(angles[j]))]);assert np.max(abs(rotated-expected))<1e-12
g['extras']={'case':'THE_ONE_D1_D2_01','sourceUnitMetres':.1,'status':results['status'],'limits':results['limits'],'continuousClearanceLowerBoundSourceUnits':bound,'animation':'Only upper shadow triangle moves. Crown frozen at reference half contact. 8 second cycle 0 to 45 degrees and back.'}
g['buffers']=[{'byteLength':len(blob)}];jj=json.dumps(g,separators=(',',':')).encode();jj+=b' '*((-len(jj))%4);blob.extend(b'\0'*((-len(blob))%4))
glb=OUT/'NEXAH_The_One_D1_D2_Test_01.glb'
glb.write_bytes(struct.pack('<III',0x46546c67,2,28+len(jj)+len(blob))+struct.pack('<II',len(jj),0x4e4f534a)+jj+struct.pack('<II',len(blob),0x004e4942)+blob)
assert struct.unpack_from('<I',glb.read_bytes(),8)[0]==glb.stat().st_size
for v in g['bufferViews']:assert v.get('byteOffset',0)+v['byteLength']<=g['buffers'][0]['byteLength']

document=f'''THE ONE — D1–D2 Faltversuch 01
Neues Forschungsdokument · 25. Oktober 2026

SCHNITT UND STARTPUNKT
Der gesamte vorherige Faden gilt nach Angabe des Autors als an Codex übergeben. Dieses Dokument beginnt mit der zusätzlichen D1–D2 Faltung. Es ersetzt keinen vorherigen Bericht und behauptet keine erneute Prüfung des Codex Stands.

FRAGE
Kann das vorgeschlagene Shadow Triangle durch eine zusätzliche Achse eine lokale Faltöffnung erhalten?

KANDIDAT
Ein gleichseitiges Dreieck mit Umkreisradius 0,65 u liegt in z=0,19 u. Die Linie y=0 teilt es in ein oberes Dreieck und ein festes unteres Trapez. Zwei ideale Lagerstellen D1=(−0,16;0;0,19) und D2=(0,16;0;0,19) liegen auf derselben Achse. Der obere Teil wird um diese x-parallele Achse gedreht. Der Bezug zur Pascal-Joint-Idee ist eine neue Interpretation, keine Identitätsfeststellung mit einem nativen A0 Mechanismus.

GEOMETRIE
Volle Scharnierlänge: {2*half:.9f} u.
Lagerabstand D1–D2: 0,32 u.
Höhe des beweglichen Dreiecks über seiner Basis: 0,65 u.
Fläche des beweglichen Dreiecks: {area:.9f} u².
Bewegung eines Punktes (x,y,z0): (x, y cos α, z0+y sin α).
Zwei Lager auf einer Geraden realisieren hier eine Achse und einen relativen Freiheitsgrad. Die Achse wird extern festgehalten; ihre Befestigung am Laternenrahmen ist noch nicht entworfen.

ERGEBNIS DES ERSTEN TESTS
Der gewählte lokale Weg von 0 bis 45 Grad erhält alle Dreieckskanten und die Achsenpunkte. Unter den unten genannten Modellannahmen bleibt ein positiver Abstand zu Pin, Rahmen und festgehaltener Krone.
Kleinster Probenabstand für 0 bis 45 Grad: {sampled:.9f} u.
Bewegungsabschlag zwischen Proben: {motion:.9f} u.
Untere Abstandsgrenze über den ganzen Weg: {bound:.9f} u.
Fester unterer Teil, kleinster geprüfter Abstand: {fixedclear:.9f} u.
Der erste nicht positive Probenabstand im erweiterten 0 bis 90 Grad Test liegt bei {first['angle'] if first else 'keinem'} Grad. Die analytische Berührung des Kugelpins tritt bei {pin_contact:.9f} Grad auf. 90 Grad durchdringt den Pinbereich. Der 45 Grad Weg ist eine vorsichtige Wahl, kein optimierter Maximalwinkel.

WAS HIER EINE APERTUR BEDEUTET
Bei Aufsicht entlang der ursprünglichen Flächennormalen wird ein Teil der Ausgangsfläche nicht mehr vom hochgeklappten Dreieck verdeckt. Die projizierte freie Fläche ist A_oben(1−cos α), bei 45 Grad {aperture:.9f} u². Das ist keine Messung eines Durchflusses oder einer optischen Transmission für beliebige Blickrichtungen.

WICHTIGE ÄNDERUNG DER 3 PLUS 2 DRÜCKE
Wenn U1 mit dem oberen Dreieck mitwandert, U2 und U3 auf dem festen Teil bleiben und die Eingangsrichtungen weiterhin vertikal sind, bleibt bei der zuvor gewählten Skalierung 3×1−2×1,5 die resultierende Kraft null. Das Moment um die D1–D2 Achse ist nach dem Klappen jedoch nicht mehr null:
M_x = 0,3575(cos α−1) in relativen Krafteinheiten mal u.
Bei 45 Grad: {moment:.9f}.
Die beiden abwärts gerichteten Eingänge liegen auf der Achse und erzeugen dort kein Moment. Damit lässt sich die frühere Gleichgewichtsaussage nicht unverändert auf die gefaltete Stellung übertragen. Schwerkraft, Lagerreaktionen, Reibung und Antriebsmodell fehlen weiterhin.

PRÜFMETHODE UND GRENZEN
181 Proben von 0 bis 90 Grad in 0,5 Grad Schritten. Abstand von Segmenten zu Dreiecken unter Einbezug von Durchstoß und Randfällen. Pin als konservative Kugel mit Radius 0,04 u, alle 25 Rahmenstäbe als Mittellinienkapseln mit Radius 0,014 u. Die fünf Kronenlaschen werden bei halbem Kontaktwinkel festgehalten. Der untere Teil wird als zwei feste Dreiecke geprüft. Bewegungsabschlag 2×0,65×sin(0,125 Grad), zusätzlich 10⁻⁹ u numerischer Puffer. Gleitkommarechnung mit analytischer Bewegungsgrenze, keine formale Intervallzertifizierung.
Die bewegliche Fläche hat Dicke null. Neue Lager und Achsengehäuse sind nicht als Kollisionskörper in den Test aufgenommen; beabsichtigter Achsenkontakt ist ausgenommen. Keine konstruierten Halter zum Rahmen. Keine vollständige Baugruppenprüfung und kein physikalischer Prototyp. Die GLB Bewegung wurde rechnerisch mit denselben Koordinaten verglichen, jedoch nicht in einem unabhängigen Viewer abgenommen.

BEWERTUNG
Ein geometrisch bestimmter lokaler Faltkandidat mit einem begrenzten freien Bewegungsweg wurde gefunden. „The One“ bleibt ein Arbeitsname. Weder Einzigartigkeit noch wissenschaftliche Neuheit oder eine fertige Gesamtmechanik sind damit nachgewiesen.

NÄCHSTER ENTSCHEIDENDER SCHRITT
Zwei reale Halter für D1 und D2 mit dem festen Teil verbinden und die 3 plus 2 Eingänge entweder als Kraftkontakte oder als vorgegebene Hubantriebe definieren. Danach Dicken und Lagerkörper ergänzen und denselben 0 bis 45 Grad Weg erneut prüfen. Die Krone erst anschließend gekoppelt bewegen.
'''
doc=OUT/'NEXAH_The_One_D1_D2_Forschungsnotiz_01.txt';doc.write_text(document,encoding='utf-8')
with zipfile.ZipFile(OUT/'NEXAH_The_One_D1_D2_Paket_01.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in ['test_one_hinge.py','build_crown_visual.py','models.json','native_contact_results.json']:z.write(HERE/name,'analysis/koerper_due_diligence/'+name)
 for p in [doc,png,glb,OUT/'NEXAH_The_One_D1_D2_Test_01.json']:z.write(p,'deliverables/'+p.name)
 z.writestr('README.txt','Neuer Abschnitt ab D1 D2 Faltversuch. Zuerst Forschungsnotiz lesen. Python 3 mit numpy scipy matplotlib; test_one_hinge.py ausführen. Die PNG und GLB Dateien zeigen denselben lokal geprüften Kandidaten. Alle Einschränkungen in Notiz und JSON beachten.')
print(json.dumps({k:results[k]for k in ['sampleMinimumClearance0to45','continuousClearanceLowerBound0to45','fixedLowerMinimumClearance','analyticPinContactDegrees','projectedOpeningAt45','verticalInputMomentAt45']},indent=2));print('firstContact',first);print('PASS')
