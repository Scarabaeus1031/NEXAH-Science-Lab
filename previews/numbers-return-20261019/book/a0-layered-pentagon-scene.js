(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('assets/a0-blue-body-dodeca-countershot-v1.js'):root.A0BlueBodyDodecaCountershot);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0LayeredPentagonScene=api;})(typeof globalThis!=='undefined'?globalThis:this,function(H3){
'use strict';
const VERSION='1.0.0',D=H3.buildDodecahedron(),R=Math.max(...D.vertices.map(p=>Math.hypot(...p))),EPS=1e-9,rad=x=>x*Math.PI/180,norm=x=>((x%360)+360)%360,copy=x=>JSON.parse(JSON.stringify(x));
const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-a[1]*b[0];},0))/2;
function pentagon(deg){return Array.from({length:5},(_,i)=>{const a=rad(norm(deg+i*72));return[Math.cos(a),Math.sin(a)];});}
// Sutherland-Hodgman half-plane clipping, CCW regular polygons.
function clip(poly,a,b,inside=true){if(!poly.length)return[];const d=p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]),out=[],keep=v=>inside?v>=-EPS:v<=EPS;
 for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],u=d(p),v=d(q);if(keep(u))out.push(p.slice());if(keep(u)!==keep(v)){const t=u/(u-v);out.push(p.map((x,k)=>x+t*(q[k]-x)));}}
 const unique=out.filter((p,i)=>!i||Math.hypot(p[0]-out[i-1][0],p[1]-out[i-1][1])>EPS);if(unique.length>1&&Math.hypot(...unique[0].map((x,i)=>x-unique.at(-1)[i]))<EPS)unique.pop();return unique.length>=3&&area(unique)>EPS?unique:[];
}
function partition(a,b){let intersection=copy(a);const outside=[];for(let i=0;i<b.length;i++){const p=b[i],q=b[(i+1)%b.length],piece=clip(intersection,p,q,false);if(piece.length)outside.push(piece);intersection=clip(intersection,p,q,true);}return{intersection,outside};}
function project3(p,phase){const a=rad(norm(phase)),c=Math.cos(a),s=Math.sin(a),x=c*p[0]-s*p[1],y=s*p[0]+c*p[1],t=rad(24),k=.65/R;return[k*x,k*(Math.cos(t)*y-Math.sin(t)*p[2]),k*(Math.sin(t)*y+Math.cos(t)*p[2])];}
const zoomRatios={'1':1,'13/8':13/8,'21/13':21/13,'34/21':34/21};
function lensPose(phase,ratio='13/8',offset=0){
 if(!Number.isFinite(phase)||phase<0||phase>360||typeof ratio!=='string'||!Object.hasOwn(zoomRatios,ratio)||!Number.isFinite(offset)||offset<0||offset>1)throw Error('invalid nested lens settings');
 const t=rad(norm(phase+360*offset));
 return{ratio,offset,magnification:zoomRatios[ratio],focus:[.65*Math.sin(t),.35*Math.sin(2*t)],radius:.43,physicalOptics:false};
}
function snapshot(phase=0,mode='counter',view={}){
 if(!Number.isFinite(phase)||phase<0||phase>360||!['counter','together'].includes(mode))throw Error('invalid layered scene phase/mode');
 const nestedLens=lensPose(phase,view.ratio??'13/8',view.offset??0);
 const angles=mode==='counter'?[3*phase,36-2*phase,18]:[phase,36+phase,18],pentagons=angles.map((a,i)=>({id:['P-A','P-B','P-C'][i],points:pentagon(a)})),a=partition(pentagons[0].points,pentagons[1].points),b=partition(pentagons[1].points,pentagons[0].points);
 return{schema:'nexah.a0.layered-pentagon-scene/1',version:VERSION,phase,mode,nestedLens,angles,pentagons,intersection:a.intersection,regions:{red:a.outside,green:b.outside},dodeca:{geometrySource:'assets/a0-blue-body-dodeca-countershot-v1.js',vertices:D.vertices.map(p=>project3(p,phase)),shadow:D.vertices.map(p=>project3([p[0],p[1],0],phase)),faces:copy(D.faces),edges:copy(D.edges)},lensWindows:[{id:'A',center:[-.35,0],radii:[.82,.68]},{id:'B',center:[.35,0],radii:[.82,.68]}],poseReturn:phase===360,sourceReturn:false,boundary:'Constructed layered view, exact convex polygon intersections, reused H3 geometry. Negative spaces and two clipping windows are 2D, not pyramids, solid packing or optical lens simulation.'};
}
const layerDefaults={a:true,b:true,c:true,tips:true,gaps:true,edges:true,dodeca:true,lensA:true,lensB:true,loopCurve:true,rings:true,nestedLens:true};
function readLayers(doc){return Object.fromEntries(Object.keys(layerDefaults).map(k=>[k,doc.getElementById('layerScene_'+k)?.checked??true]));}
function validate(r){if(!r||r.schema!=='nexah.a0.layered-pentagon-scene/1'||!Number.isFinite(r.phase)||r.phase<0||r.phase>360||!['counter','together'].includes(r.mode)||!Array.isArray(r.pentagons)||r.pentagons.length!==3||r.pentagons.some(p=>p.points.length!==5||p.points.some(q=>q.length!==2||!q.every(Number.isFinite)))||r.dodeca?.vertices?.length!==20||JSON.stringify(r.dodeca.faces)!==JSON.stringify(D.faces)||JSON.stringify(r.dodeca.edges)!==JSON.stringify(D.edges))throw Error('invalid layered scene record');for(const list of [r.intersection,...r.regions.red,...r.regions.green,r.dodeca.vertices,r.dodeca.shadow])if(!Array.isArray(list)||!list.every(p=>p.every(Number.isFinite)))throw Error('invalid scene coordinates');if(r.lensWindows?.length!==2||r.lensWindows.some(l=>l.center?.length!==2||l.radii?.length!==2||![...l.center,...l.radii].every(Number.isFinite)||l.radii.some(x=>x<=0)))throw Error('invalid lens windows');if(r.nestedLens&&JSON.stringify(r.nestedLens)!==JSON.stringify(lensPose(r.phase,r.nestedLens.ratio,r.nestedLens.offset)))throw Error('invalid nested lens record');return true;}
function drawing(r,o={},history=[]){
 validate(r);const layers={...layerDefaults,...o.stackLayers},amount=o.amount??1,scheme=o.scheme??'redblue';if(!Number.isFinite(amount)||amount<0||amount>1||!['redblue','spectrum'].includes(scheme)||Object.values(layers).some(v=>typeof v!=='boolean'))throw Error('invalid scene display options');
 const bases=scheme==='spectrum'?['#f44336','#2196f3','#ffeb3b']:['#f34c6e','#65e7a4','#a878e6'],color=hex=>{const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),g=c.reduce((s,x)=>s+x,0)/3;return'#'+c.map(x=>Math.round(g+(x-g)*amount).toString(16).padStart(2,'0')).join('');};
 const tx=(x,y,t,c='#bcd0d9')=>'<text x="'+x+'" y="'+y+'" fill="'+c+'" font-size="12" font-family="system-ui,sans-serif">'+t+'</text>';
 function scene(cx,cy,scale,id,lens=null){
  const p=q=>[cx+scale*q[0],cy-scale*q[1]],poly=ps=>ps.map(p).map(q=>q.join(',')).join(' '),line=(a,b,c,w=1,dash='')=>{const u=p(a),v=p(b);return'<line x1="'+u[0]+'" y1="'+u[1]+'" x2="'+v[0]+'" y2="'+v[1]+'" stroke="'+c+'" stroke-width="'+w+'" stroke-dasharray="'+dash+'"/>';};
  let s='';if(lens){const q=p(lens.center);s+='<defs><clipPath id="'+id+'"><ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="'+scale*lens.radii[0]+'" ry="'+scale*lens.radii[1]+'"/></clipPath></defs><g clip-path="url(#'+id+')">';}
  if(layers.rings&&!lens)for(const radius of [1.22,1.43,1.64])s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+scale*radius+'" fill="none" stroke="#277a89" stroke-dasharray="5 5" stroke-opacity=".55"/>';
  if(!lens)s+=line([-1.64,0],[1.64,0],'#708c98',.7,'3 6')+line([0,-1.64],[0,1.64],'#708c98',.7,'3 6');
  if(o.echo!==false)for(const old of history.slice(-64))for(let i=0;i<3;i++)if(layers[['a','b','c'][i]])s+='<polygon points="'+poly(old.pentagons[i].points)+'" fill="none" stroke="'+color(bases[i])+'" stroke-opacity=".055" stroke-width="1" stroke-dasharray="2 5"/>';
  if(o.current!==false){
   if(layers.gaps){const mask=id+'-gaps';s+='<defs><mask id="'+mask+'" maskUnits="userSpaceOnUse" x="'+(cx-scale*1.12)+'" y="'+(cy-scale*1.12)+'" width="'+scale*2.24+'" height="'+scale*2.24+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+scale*1.12+'" fill="white"/>';r.pentagons.forEach((f,i)=>{if(layers[['a','b','c'][i]])s+='<polygon points="'+poly(f.points)+'" fill="black"/>';});s+='</mask></defs><circle cx="'+cx+'" cy="'+cy+'" r="'+scale*1.12+'" fill="#000" mask="url(#'+mask+')" data-stack="negative-space"/>';}
   r.pentagons.forEach((f,i)=>{if(layers[['a','b','c'][i]])s+='<polygon points="'+poly(f.points)+'" fill="'+color(bases[i])+'" fill-opacity="'+(i===2?'.12':'.28')+'" stroke="none" data-stack="'+f.id+'"/>';});
   if(o.cuts!==false&&layers.a&&layers.b&&r.intersection.length)s+='<polygon points="'+poly(r.intersection)+'" fill="'+color('#c7c3a0')+'" fill-opacity=".36" stroke="none" data-stack="intersection"/>';
   if(layers.tips)for(const [key,i]of [['red',0],['green',1]])if(layers[['a','b'][i]])for(const piece of r.regions[key])s+='<polygon points="'+poly(piece)+'" fill="'+color(bases[i])+'" fill-opacity=".56" data-stack="'+key+'-tip"/>';
   if(layers.dodeca){if(o.shadow!==false)for(const edge of r.dodeca.edges)s+=line(...edge.map(i=>r.dodeca.shadow[i]),color('#7c678f'),1,'4 4');const faces=[...r.dodeca.faces].sort((a,b)=>a.vertices.reduce((s,i)=>s+r.dodeca.vertices[i][2],0)-b.vertices.reduce((s,i)=>s+r.dodeca.vertices[i][2],0));for(const f of faces)s+='<polygon points="'+poly(f.vertices.map(i=>r.dodeca.vertices[i]))+'" fill="'+color('#54bed2')+'" fill-opacity=".045" stroke="'+color('#6ccfe1')+'" stroke-opacity=".65" stroke-width=".8" data-stack-face="'+f.id+'"/>';}
   if(layers.edges)r.pentagons.forEach((f,i)=>{if(layers[['a','b','c'][i]])s+='<polygon points="'+poly(f.points)+'" fill="none" stroke="#fff" stroke-opacity="'+(i===2?'.4':'.95')+'" stroke-width="'+(i===2?1:2)+'" data-stack="white-edge"/>';});
  }
  if(layers.loopCurve){const points=Array.from({length:121},(_,i)=>{const t=i*Math.PI/60;return[1.12*Math.sin(t),.43*Math.sin(2*t)];});s+='<polyline points="'+poly(points)+'" fill="none" stroke="'+color('#ed4ef3')+'" stroke-width="1.5"/>';const t=rad(norm(r.phase)),q=p([1.12*Math.sin(t),.43*Math.sin(2*t)]);s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="3" fill="'+color('#ed4ef3')+'"/>';}
  if(lens)s+='</g>';else if(layers.lensA||layers.lensB)r.lensWindows.forEach((l,i)=>{if(!layers[i?'lensB':'lensA'])return;const q=p(l.center);s+='<ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="'+scale*l.radii[0]+'" ry="'+scale*l.radii[1]+'" fill="none" stroke="#d5dce0" stroke-opacity=".25" stroke-dasharray="2 5"/>';});
  if(!lens)s+='<circle cx="'+cx+'" cy="'+cy+'" r="3" fill="#fff"/>';return s;
 }
 let out='<title>Drei Pentagone, Rot/Grün-Zwischenformen, H3-Dodekaeder und zwei Maskenausschnitte</title><desc>Ein gemeinsamer Phasenwert steuert alle Schichten. Keine native Blue/Pink-Flächensteuerung oder räumliche Pyramidenpackung.</desc>';
 out+=scene(250,230,120,'stack-main');
 if(layers.nestedLens){
  const l=r.nestedLens??lensPose(r.phase),[fx,fy]=l.focus,cx=250+120*fx,cy=230-120*fy,z=120*l.magnification,rr=120*l.radius;
  if(o.echo!==false&&history.length){const trail=history.slice(-64).map(old=>{const f=(old.nestedLens??lensPose(old.phase)).focus;return[250+120*f[0],230-120*f[1]].join(',');});out+='<polyline points="'+trail.join(' ')+'" fill="none" stroke="#ffd36b" stroke-opacity=".5" stroke-width="1" stroke-dasharray="2 3" data-stack="focus-trail"/>';}
  // Same source coordinates, enlarged around focus: q=f stays exactly at lens center.
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+rr+'" fill="#08121e" data-stack="nested-background"/>';
  out+=scene(cx-z*fx,cy+z*fy,z,'stack-nested',{center:l.focus,radii:[rr/z,rr/z]});
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+rr+'" fill="none" stroke="#ffd36b" stroke-width="2" data-stack="nested-lens"/>';
  out+='<path d="M '+(cx-5)+' '+cy+' h 10 M '+cx+' '+(cy-5)+' v 10" stroke="#ffd36b" stroke-width="1" data-stack="nested-focus"/>';
  out+=tx(30,45,'LINSE IN LINSE · '+l.ratio+'× · ein Zustand','#ffd36b');
 }

 if(layers.lensA)out+=scene(640,125,82,'stack-lens-a',r.lensWindows[0])+tx(540,217,'Linse A · linker Maskenausschnitt');
 if(layers.lensB)out+=scene(640,330,82,'stack-lens-b',r.lensWindows[1])+tx(540,423,'Linse B · rechter Maskenausschnitt');
 out+=tx(30,25,'DREI PENTAGONE · EIN PHASENWERT','#eef7fb')+tx(30,449,'A/B-Differenzflächen: '+r.regions.red.length+' rot / '+r.regions.green.length+' grün · Überlappung: '+r.intersection.length+' Ecken');
 return out;
}
function mount(doc,onFrame,clock=globalThis){
 const el=id=>doc.getElementById(id);if(!el('layerScenePlay'))return null;let timer=null;const api={beforePlay:null},listeners=new Set();
 const emit=()=>{for(const fn of listeners)fn({pose:read(),playing:timer!==null});};
 const update=()=>{el('layerScenePlay').textContent=timer!==null?'Pause':'▶ Schichten gemeinsam abspielen';el('layerScenePlay').setAttribute('aria-pressed',String(timer!==null));emit();};
 const read=()=>snapshot(Number(el('layerScenePhase').value),el('layerSceneMotion').value,{ratio:el('layerSceneZoom')?.value??'13/8',offset:Number(el('layerSceneFocusOffset')?.value??0)});
 const render=()=>{const r=read();el('layerSceneStatus').textContent='Phase '+r.phase+'° · A '+r.angles[0]+'° / B '+r.angles[1]+'° / C '+r.angles[2]+'° · '+r.regions.red.length+' rote / '+r.regions.green.length+' grüne Differenzflächen'+' · Detail '+r.nestedLens.ratio+'× / Fokusversatz '+r.nestedLens.offset+(r.poseReturn?' · Ansichts-Return, kein Source-Return':'');onFrame(r);emit();return r;};
 const pause=()=>{if(timer!==null){clock.clearInterval(timer);timer=null;}update();};
 el('layerScenePlay').addEventListener('click',()=>{if(timer!==null){pause();return;}if(api.beforePlay)api.beforePlay();el('projectionOverlaySource').value='stack';if(Number(el('layerScenePhase').value)===360)el('layerScenePhase').value='0';render();timer=clock.setInterval(()=>{const t=Number(el('layerScenePhase').value);el('layerScenePhase').value=String(t>=360?0:Math.min(360,t+2));render();if(Number(el('layerScenePhase').value)===360&&!el('layerSceneRepeat').checked)pause();},40);update();});
 el('layerSceneReset').addEventListener('click',()=>{pause();el('layerScenePhase').value='0';render();});
 for(const id of ['layerScenePhase','layerSceneMotion','layerSceneZoom','layerSceneFocusOffset'])el(id)?.addEventListener('input',()=>{pause();render();});
 if(doc.addEventListener)doc.addEventListener('visibilitychange',()=>{if(doc.hidden)pause();});
 function setPhase(phase){
  if(!Number.isInteger(phase)||phase<0||phase>360)throw Error('invalid phase command');
  if(api.beforePlay)api.beforePlay();pause();el('layerScenePhase').value=String(phase);return render();
 }
 function restorePose(anchor){
  if(!anchor||typeof anchor.repeat!=='boolean'||!anchor.layers||Object.keys(layerDefaults).some(k=>typeof anchor.layers[k]!=='boolean'))throw Error('invalid pose anchor');
  const p=anchor.pose;snapshot(p.phase,p.mode,{ratio:p.nestedLens.ratio,offset:p.nestedLens.offset});
  if(api.beforePlay)api.beforePlay();pause();
  el('layerScenePhase').value=String(p.phase);el('layerSceneMotion').value=p.mode;
  if(el('layerSceneZoom'))el('layerSceneZoom').value=p.nestedLens.ratio;
  if(el('layerSceneFocusOffset'))el('layerSceneFocusOffset').value=String(p.nestedLens.offset);
  el('layerSceneRepeat').checked=anchor.repeat;
  for(const k of Object.keys(layerDefaults))if(el('layerScene_'+k))el('layerScene_'+k).checked=anchor.layers[k];
  return render();
 }
 Object.assign(api,{pause,render,setPhase,restorePose,subscribe(fn){if(typeof fn!=='function')throw Error('invalid listener');listeners.add(fn);fn({pose:read(),playing:timer!==null});return()=>listeners.delete(fn);},exportState:()=>({pose:read(),playing:timer!==null,repeat:el('layerSceneRepeat').checked,layers:readLayers(doc)})});render();update();return api;
}
return{VERSION,zoomRatios,lensPose,area,pentagon,clip,partition,project3,snapshot,validate,layerDefaults,readLayers,drawing,mount};
});
