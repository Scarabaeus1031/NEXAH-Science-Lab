(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0WingSequence=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='1.0.0',A=1/Math.sqrt(3),rad=d=>d*Math.PI/180;
const PHASES=[
 ['Flache Ausgangslage','spine',180,'front',0],
 ['Rücken schließen','spine',90,'front',0],
 ['Deckung am Rücken','spine',0,'front',0],
 ['Gegenseite flach','spine',180,'back',0],
 ['Vom Gegenflügel wieder schließen','spine',0,'back',0],
 ['Vorderseite wieder flach','spine',180,'front',0],
 ['Gesamtdrehung +90° · CCW','spine',180,'front',90],
 ['Horizontale Mitte schließen','horizontal',90,'front',90],
 ['Horizontale Deckung','horizontal',0,'front',90],
 ['Horizontal zur Gegenseite','horizontal',180,'back',90],
 ['Horizontal wieder schließen','horizontal',0,'back',90],
 ['Horizontal wieder flach','horizontal',180,'front',90],
 ['Gesamtdrehung +180°','spine',180,'front',180],
 ['Gesamtdrehung +270°','spine',180,'front',270],
 ['Gesamtdrehung +360°','spine',180,'front',360],
 ['Ansichts-Return · Quelle läuft weiter','spine',180,'front',0]
];
const norm=d=>((d%360)+360)%360;
function resolve(tick,mode,angle,options){
 const {crease='spine',branch='front',turn=0,tilt=0,palette='source',cutAngle=0,cutOffset=0}=options;
 if(!['spine','horizontal'].includes(crease)||!['front','back'].includes(branch)||!Number.isFinite(turn)||turn<0||turn>360||!Number.isFinite(tilt)||tilt< -60||tilt>60||!['source','owner'].includes(palette))throw Error('invalid wing pose');
 if(!Number.isFinite(cutAngle)||cutAngle< -60||cutAngle>60||!Number.isFinite(cutOffset)||Math.abs(cutOffset)>1.5)throw Error('invalid observation plane');
 const p=PHASES[tick];return mode==='sequence'?{crease:p[1],angle:p[2],branch:p[3],turn:p[4],tilt,palette,cutAngle,cutOffset,phase:p[0]}:{crease,angle,branch,turn,tilt,palette,cutAngle,cutOffset,phase:mode==='follow'?'Vorhandene Q4-Öffnungsfahrt':'Hand · deklarierte Pose'};
}
// One active crease at a time. Signed opening passes continuously through closure.
function fold(u,v,side,angle,branch,crease){
 const h=rad((branch==='back'?-1:1)*angle/2);
 return crease==='spine'?[side*u*Math.sin(h),v,u*Math.cos(h)]:[side*u,v*Math.sin(h),Math.abs(v)*Math.cos(h)];
}
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// Orthographic camera, then rigid rotation about its normal: +90° is visibly CCW.
function pose(p,turn,tilt){
 const t=rad(tilt),q=[p[0],Math.cos(t)*p[1]-Math.sin(t)*p[2],Math.sin(t)*p[1]+Math.cos(t)*p[2]];
 const u=[Math.sqrt(3)/2,0,.5],v=[-.5*Math.sin(rad(18)),Math.cos(rad(18)),Math.sqrt(3)/2*Math.sin(rad(18))],n=cross(u,v);
 const x=dot(q,u),y=dot(q,v),z=dot(q,n),r=rad(norm(turn));return[Math.cos(r)*x-Math.sin(r)*y,Math.sin(r)*x+Math.cos(r)*y,z];
}
function snapshot(tick,mode,angle,options){
 if(!Number.isInteger(tick)||tick<0||tick>15||!['manual','follow','sequence'].includes(mode)||!Number.isFinite(angle)||angle<0||angle>180)throw Error('invalid wing source / opening');
 const o=resolve(tick,mode,angle,options),vertices={top:[0,1],upper:[A,1],tip:[2*A,0],lower:[A,-1],bottom:[0,-1],center:[0,0]},facets=[];
 for(const side of [-1,1])for(const half of ['upper','lower']){
  const keys=half==='upper'?['center','top','upper','tip']:['center','tip','lower','bottom'];
  const transform=p=>fold(p[0],p[1],side,o.angle,o.branch,o.crease);
  const model=keys.map(k=>transform(vertices[k])),points=model.map(p=>pose(p,o.turn,o.tilt));
  const a=points[1].map((x,i)=>x-points[0][i]),b=points[2].map((x,i)=>x-points[0][i]),normal=cross(a,b).map(x=>x*(-side));
  const front=normal[2]>=-1e-12;
  facets.push({id:(side<0?'left':'right')+'-'+half,side:side<0?'left':'right',half,keys,model,points,normal,face:front?'V':'R',depth:points.reduce((s,p)=>s+p[2],0)/points.length});
 }
 const creaseLocal=o.crease==='spine'?[[0,-1,0],[0,0,0],[0,1,0]]:[[-2*A,0,0],[0,0,0],[2*A,0,0]];
 const record={schema:'nexah.a0.dual-wing-pose/1',version:VERSION,options:o,facets,crease:creaseLocal.map(p=>pose(p,o.turn,o.tilt)),cuts:[-20,0,20].map(delta=>cut(facets,o.cutAngle+delta,o.cutOffset)),referenceCrossFixed:true,referenceFrame:'fixed screen-plane axes; not a physical cosmic axis',orientationRule:'orthographic camera followed by rigid rotation about view normal; positive angle is screen CCW',independentCreasesSimultaneouslyActive:false,sourceTick:tick,phaseIndex:mode==='sequence'?tick:null,viewReturn:mode==='sequence'&&tick===15,sourceReturnClaim:false};
 return JSON.parse(JSON.stringify(record)); // canonical JSON replay: normalize negative zero throughout the pose
}
function cut(facets,angle,offset){
 const normal=[Math.sin(rad(angle)),0,Math.cos(rad(angle))],segments=[],tangencies=[];
 for(const facet of facets){
  const ps=facet.points,dist=ps.map(p=>dot(normal,p)-offset),unique=[];
  const add=p=>{if(!unique.some(q=>Math.hypot(...p.map((x,i)=>x-q[i]))<1e-9))unique.push(p);};
  if(dist.every(d=>Math.abs(d)<1e-9)){ps.forEach((p,i)=>segments.push({facet:facet.id,points:[p,ps[(i+1)%ps.length]],coplanar:true}));continue;}
  ps.forEach((p,i)=>{const j=(i+1)%ps.length,q=ps[j],a=dist[i],b=dist[j];if(Math.abs(a)<1e-9)add(p);if(a*b<0&&Math.abs(a)>1e-9&&Math.abs(b)>1e-9){const t=a/(a-b);add(p.map((x,k)=>x+t*(q[k]-x)));}});
  if(unique.length===1)tangencies.push({facet:facet.id,point:unique[0]});
  if(unique.length>=2){let best=[unique[0],unique[1]],length=0;for(const a of unique)for(const b of unique){const d=Math.hypot(...a.map((x,i)=>x-b[i]));if(d>length){length=d;best=[a,b];}}segments.push({facet:facet.id,points:best,coplanar:false});}
 }
 return{angle,offset,normal,segments,tangencies,equation:'sin(angle)*cameraX + cos(angle)*cameraZ = offset',physicalFieldClaim:false};
}
function cutDrawing(r){
 const colors=['#55cfe6','#70df9b','#ef7c92'],p=v=>[205+90*v[0],145-90*v[1]],line=(a,b,c,w,dash='')=>'<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+c+'" stroke-width="'+w+'" stroke-dasharray="'+dash+'"/>';
 let s='<title>Drei berechnete Ebenenschnitte durch dieselbe Flügelpose</title><desc>Nur Schnittgeometrie, keine Sonnen- oder Mondbahnen. Der feste Ursprung ist der lokale Beobachtungsanker.</desc>'+line([35,145],[375,145],'#496271',1,'4 5')+line([205,20],[205,260],'#496271',1,'4 5');
 for(const f of r.facets)s+='<polygon points="'+f.points.map(p).map(v=>v.join(',')).join(' ')+'" fill="none" stroke="#416375" stroke-width="1"/>';
 r.cuts.forEach((c,i)=>{for(const segment of c.segments)s+=line(...segment.points.map(p),colors[i],3,segment.coplanar?'3 2':'');for(const t of c.tangencies){const q=p(t.point);s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="3" fill="'+colors[i]+'"/>';}s+='<text x="420" y="'+(65+i*45)+'" fill="'+colors[i]+'" font-size="13">Schnitt '+(i+1)+' · '+c.angle+'° · '+c.segments.length+' Segmente</text>';});
 return s+'<circle cx="205" cy="145" r="5" fill="#fff"/><text x="420" y="220" fill="#b5cad5" font-size="12">O bleibt Referenz · kein Ereignis-/Deckungsgate</text>';
}
function drawing(r,focus='both'){
 const o=r.options,svg=(tag,attrs,text='')=>'<'+tag+' '+Object.entries(attrs).map(([k,v])=>k+'="'+v+'"').join(' ')+'>'+text+'</'+tag+'>';
 const tx=(x,y,s,c='#b5cad5')=>svg('text',{x,y,fill:c,'font-size':11,'font-family':'ui-monospace,monospace'},s);
 const point=p=>[210+108*p[0],208-108*p[1]],points=ps=>ps.map(point).map(p=>p.join(',')).join(' ');
 let out='<title>Doppelflügel: feste Referenz, bewegte Knicklinie, Vorder- und Rückseiten</title><desc>Links aktive Pose, rechts unveränderte flache Seitenkarte. V und R markieren Vorder- und Rückseite; Schwarz allein ist kein Zustandsnachweis.</desc>';
 out+=svg('line',{x1:35,y1:208,x2:385,y2:208,stroke:'#496271','stroke-dasharray':'4 5'})+svg('line',{x1:210,y1:60,x2:210,y2:350,stroke:'#496271','stroke-dasharray':'4 5'})+tx(28,374,'Festes Referenzkreuz · Ursprung O')+tx(25,25,o.phase,'#70e0aa')+tx(25,46,(o.crease==='spine'?'RÜCKEN':'HORIZONTALE MITTE')+' · '+o.branch+' · α='+o.angle+'°');
 for(const f of [...r.facets].sort((a,b)=>a.depth-b.depth)){
  const color=o.palette==='owner'?(f.side==='left'?'#4de09b':'#ef6b7d'):(f.side==='left'?'#b387ff':'#efbd59');
  out+=svg('polygon',{points:points(f.points),fill:f.face==='V'?color+'55':'#03070a',stroke:color,'stroke-width':2,'stroke-dasharray':f.face==='R'?'5 3':'',opacity:focus==='both'||focus===f.side?1:.2,'data-wing':f.id,'data-face':f.face});
  const center=f.points.reduce((s,p)=>s.map((x,i)=>x+p[i]/f.points.length),[0,0,0]),q=point(center);
  out+=tx(q[0]-14,q[1],(f.side==='left'?'L':'R')+'·'+f.face,color);
 }
 const cp=r.crease.map(point);out+=svg('polyline',{points:cp.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#edf5fa','stroke-width':3});
 out+=svg('circle',{cx:210,cy:208,r:4,fill:'#ffffff'})+tx(218,200,'O');
 out+=tx(25,353,'Gesamtdrehung '+o.turn+'° CCW · Ansicht '+o.tilt+'°');
 // Invariant construction chart: never rotated with the live motif.
 out+=tx(450,25,'FLACHE QUELLKARTE · unverändert')+tx(450,46,'Seitenidentität ≠ Bildschirmposition');
 for(const side of [-1,1]){
  const color=side<0?'#b387ff':'#efbd59',flat=[[0,1],[A,1],[2*A,0],[A,-1],[0,-1]].map(([u,v])=>[625+105*side*u,208-105*v]);
  out+=svg('polygon',{points:flat.map(p=>p.join(',')).join(' '),fill:color+'22',stroke:color,'stroke-width':2});
  for(const [label,index]of side<0?[['6',1],['L*',2],['5',3]]:[['2',1],['R*',2],['3',3]])out+=tx(flat[index][0]+5,flat[index][1]-5,label,color);
  out+=svg('polyline',{points:[[625,208],flat[1],flat[2],flat[3],[625,208]].map(p=>p.join(',')).join(' '),fill:'none',stroke:color,'stroke-width':1});
 }
 out+=svg('line',{x1:625,y1:103,x2:625,y2:313,stroke:'#dceaf0','stroke-width':3})+tx(633,99,'1')+tx(633,201,'O')+tx(633,329,'4')+tx(450,353,'V = Vorderseite · R = Rückseite')+tx(450,374,'Ansichts-Return ≠ Q4-Quellreturn');
 return out;
}
return{VERSION,A,PHASES,resolve,fold,pose,snapshot,drawing,cut,cutDrawing};
});
