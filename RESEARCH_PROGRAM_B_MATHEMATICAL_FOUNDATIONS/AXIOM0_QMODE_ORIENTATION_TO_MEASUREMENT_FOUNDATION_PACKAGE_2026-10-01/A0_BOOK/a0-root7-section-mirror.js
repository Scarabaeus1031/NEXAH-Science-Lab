(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Root7Sections=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='1.0.0',EPS=1e-9;
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
// Orthonormal basis in the actual 2×1×1 metric, normal proportional to (1/2,1,1).
const e1=[0,1/Math.sqrt(2),-1/Math.sqrt(2)],e2=[-4/(3*Math.sqrt(2)),1/(3*Math.sqrt(2)),1/(3*Math.sqrt(2))];
function cut(t){
  if(!Number.isFinite(t)||t<0||t>3)throw new RangeError('section t must be in [0,3]');
  const vertices=[];
  const add=p=>{if(!vertices.some(q=>Math.hypot(...p.map((v,i)=>v-q[i]))<EPS))vertices.push(p);};
  for(let a=0;a<8;a++)for(let axis=0;axis<3;axis++){
    const b=a^(1<<axis);if(a>b)continue;
    const p=[2*(a&1),(a>>1)&1,(a>>2)&1],q=[2*(b&1),(b>>1)&1,(b>>2)&1];
    const f=p[0]/2+p[1]+p[2],g=q[0]/2+q[1]+q[2],r=(t-f)/(g-f);
    if(r>=-EPS&&r<=1+EPS)add(p.map((v,i)=>v+Math.max(0,Math.min(1,r))*(q[i]-v)));
  }
  const center=[0,1,2].map(i=>vertices.reduce((s,p)=>s+p[i],0)/vertices.length);
  vertices.sort((p,q)=>Math.atan2(dot(p.map((v,i)=>v-center[i]),e2),dot(p.map((v,i)=>v-center[i]),e1))-Math.atan2(dot(q.map((v,i)=>v-center[i]),e2),dot(q.map((v,i)=>v-center[i]),e1)));
  const plane=vertices.map(p=>{const d=p.map((v,i)=>v-center[i]);return[dot(d,e1),dot(d,e2)];});
  const area=Math.abs(plane.reduce((s,p,i)=>{const q=plane[(i+1)%plane.length];return s+p[0]*q[1]-p[1]*q[0];},0))/2;
  return{equation:'x/2 + y + z = t; w fixed to active source layer',t,center,vertices,plane,area,vertexCount:vertices.length,kind:vertices.length===6?'HEXAGON':vertices.length===3?'TRIANGLE':'POINT',triangles:vertices.length>2?vertices.slice(1,-1).map((_,i)=>[0,i+1,i+2]):[]};
}
function mirror(p,degrees){const a=degrees*Math.PI/180;return[Math.cos(2*a)*p[0]+Math.sin(2*a)*p[1],Math.sin(2*a)*p[0]-Math.cos(2*a)*p[1]];}
function snapshot(tick,layer,options={}){
  const {mode='manual',t=1.5,angle=45,order='AB'}=options;
  if(!Number.isInteger(tick)||tick<0||tick>15||![0,1].includes(layer))throw new TypeError('valid source tick and layer required');
  if(!['manual','follow'].includes(mode)||!['AB','BA'].includes(order)||!Number.isFinite(angle)||angle<0||angle>90)throw new TypeError('invalid section/mirror options');
  const section=cut(mode==='follow'?3*tick/15:t),firstAngle=order==='AB'?0:angle,secondAngle=order==='AB'?angle:0;
  const first=section.plane.map(p=>mirror(p,firstAngle)),second=first.map(p=>mirror(p,secondAngle));
  return{schema:'nexah.a0.root7-section-mirror-view/1',version:VERSION,sourceTick:tick,layer,options:{mode,t:section.t,angle,order},section,mirrors:{axesDegrees:{A:0,B:angle},order,first,second,rotationDegrees:(order==='AB'?2:-2)*angle,determinants:[1,-1,1],isometry:true},boundary:'Actual 3D section at fixed w, not a full 4D section. Mirrors act in an orthonormal section-plane chart about its centroid, not on Q4 bits. Follow mode maps read tick to t=3*tick/15; no physical motion or extra clock. No claimed rhombus tiling.'};
}
function readOptions(doc){
  const value=(id,fallback)=>{const e=doc.getElementById(id);return e&&e.value!==undefined?e.value:fallback;};
  return{mode:value('root7CutMode','manual'),t:Number(value('root7CutPosition',1.5)),angle:Number(value('root7MirrorAngle',45)),order:value('root7MirrorOrder','AB')};
}
const points=p=>p.map(v=>v.join(',')).join(' ');
function drawing(r){
  const fmt=n=>Number(n.toFixed(3));
  const project=p=>[70+82*p[0]+39*p[1],190-39*p[1]-100*p[2]];
  const line=(p,q,color,width=1,dash='')=>'<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+q[0]+'" y2="'+q[1]+'" stroke="'+color+'" stroke-width="'+width+'" stroke-dasharray="'+dash+'"/>';
  const text=(x,y,s,c='#afc4cf')=>'<text x="'+x+'" y="'+y+'" fill="'+c+'" font-size="12" font-family="ui-monospace,monospace">'+s+'</text>';
  let svg='<title>Stretch-Quader: echter Schnitt und Doppelspiegel</title><desc>Links schräger Ebenenschnitt; rechts drei metrisch einheitliche Ansichten in einer orthonormalen Schnittebenenkarte.</desc>';
  for(let a=0;a<8;a++)for(let axis=0;axis<3;axis++){const b=a^(1<<axis);if(a<b)svg+=line(project([2*(a&1),(a>>1)&1,(a>>2)&1]),project([2*(b&1),(b>>1)&1,(b>>2)&1]),'#365565');}
  const pp=r.section.vertices.map(project);
  svg+='<polygon points="'+points(pp)+'" fill="#62dfa033" stroke="#62dfa0" stroke-width="2"/>';
  pp.forEach((p,i)=>{svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" fill="#62dfa0"/>'+text(p[0]+4,p[1]-5,String(i));});
  svg+=text(18,22,'2×1×1 · w='+r.layer,'#62dfa0')+text(18,235,'t='+fmt(r.section.t)+' · '+r.section.kind)+text(18,255,'Fläche = '+fmt(r.section.area));
  const groups=[r.section.plane,r.mirrors.first,r.mirrors.second],centers=[385,555,725];
  groups.forEach((polygon,i)=>{
    const cx=centers[i],cy=135,pr=p=>[cx+60*p[0],cy-60*p[1]];
    svg+=text(cx-64,22,['0 · ORIGINAL','1 · '+r.mirrors.order[0],'2 · '+r.mirrors.order[1]+' ∘ '+r.mirrors.order[0]][i]);
    svg+=line([cx-75,cy],[cx+75,cy],'#223e4e')+line([cx,cy-80],[cx,cy+80],'#223e4e');
    if(i>0){const deg=i===1?(r.mirrors.order[0]==='A'?0:r.options.angle):(r.mirrors.order[1]==='A'?0:r.options.angle),a=deg*Math.PI/180;svg+=line([cx-78*Math.cos(a),cy+78*Math.sin(a)],[cx+78*Math.cos(a),cy-78*Math.sin(a)],'#efbd59',1.5,'4 4');}
    svg+='<polygon points="'+points(polygon.map(pr))+'" fill="'+['#4ed8f222','#a77dff22','#efbd5922'][i]+'" stroke="'+['#4ed8f2','#a77dff','#efbd59'][i]+'" stroke-width="2"/>';
    r.section.triangles.forEach(tri=>{svg+=line(pr(polygon[tri[0]]),pr(polygon[tri[2]]),'#648598',.7);});
    polygon.forEach((p,j)=>{const q=pr(p);svg+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(j===0?4:2)+'" fill="'+(j===0?'#f1698c':'#b9cbd4')+'"/>'+text(q[0]+4,q[1]-4,String(j));});
    svg+=text(cx-64,235,'det = '+r.mirrors.determinants[i]);
  });
  return svg+text(320,275,'Gleicher Maßstab rechts · Nummern verfolgen die Ecken')+text(18,302,'Links: Projektionsbild ≠ Messraster. Rechts: gespiegelt ist der Schnitt, nicht der feste Quader.');
}
function render(doc,record){
  const svg=doc.getElementById('root7SectionSvg'),out=doc.getElementById('root7SectionLedger');if(!svg||!out)return;
  const r=record.sectionView;svg.innerHTML=drawing(r);
  out.textContent=r.section.vertexCount+' Ecken · '+r.section.triangles.length+' Dreiecke · '+r.mirrors.order.split('').join(' → ')+' = Rotation '+r.mirrors.rotationDegrees+'° · det +1 · Längen/Fläche erhalten';
  const slider=doc.getElementById('root7CutPosition');if(slider){slider.disabled=r.options.mode==='follow';if(slider.disabled)slider.value=r.section.t;}
}
return{VERSION,cut,mirror,snapshot,readOptions,drawing,render};
});
