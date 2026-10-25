/* Finite engineering demonstrator. Source grammar: MRB-10 / PRIMEGRID Block02A.
   Embeddings are NEW display rules; no recovered Core membrane generator. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else{root.A0PascalThreadViews=factory();root.A0PascalThreadViews.mount(root.document);}})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VIEWS=['grid','bracket','spiral','membrane'];
function word(value){if(typeof value!=='string'||!/^[01]{2,8}$/.test(value))throw Error('Bitte 2 bis 8 Binärstellen eingeben.');return value;}
function nodes(value){value=word(value);let k=0;return [{r:0,k:0},...Array.from(value,(bit,i)=>({r:i+1,k:k+=Number(bit)}))];}
function fiber(n,k){if(!Number.isInteger(n)||n<2||n>8||!Number.isInteger(k)||k<0||k>n)throw Error('Invalid endpoint');return Array.from({length:2**n},(_,i)=>i.toString(2).padStart(n,'0')).filter(s=>Array.from(s).reduce((a,b)=>a+Number(b),0)===k);}
function project(value,endpointOnly){const path=nodes(value),n=value.length;return endpointOnly?{kind:'endpoint',n,k:path[n].k}:{kind:'path',n,ks:path.map(p=>p.k)};}
function inverse(record,ordinal){
 if(record.kind==='endpoint'){
  const candidates=fiber(record.n,record.k);
  if(ordinal===undefined||ordinal===null)return candidates.length===1?{status:'RETURN',value:candidates[0],candidates:candidates.length}:{status:'HOLD',value:null,candidates:candidates.length};
  if(!Number.isInteger(ordinal)||ordinal<0||ordinal>=candidates.length)return {status:'INVALID_KEY',value:null,candidates:candidates.length};
  return {status:'RETURN',value:candidates[ordinal],candidates:candidates.length};
 }
 if(record.kind!=='path'||!Number.isInteger(record.n)||record.n<2||record.n>8||!Array.isArray(record.ks)||record.ks.length!==record.n+1||record.ks[0]!==0)throw Error('Invalid path record');
 const bits=record.ks.slice(1).map((k,i)=>k-record.ks[i]);
 if(bits.some(b=>b!==0&&b!==1))throw Error('Invalid path step');
 return {status:'RETURN',value:bits.join(''),candidates:1};
}
function snapshot(value,endpointOnly,keyMode){
 value=word(value);if(!['none','correct','wrong'].includes(keyMode))throw Error('Invalid key mode');
 const path=nodes(value),n=value.length,k=path[n].k,candidates=fiber(n,k),rank=candidates.indexOf(value);
 const supplied=!endpointOnly||keyMode==='none'?null:keyMode==='correct'?rank:(rank+1)%candidates.length;
 const record=project(value,endpointOnly),returned=inverse(record,supplied);
 return {source:value,path,n,k,rank,candidates,record,keyMode,supplied,returned,
 verdict:returned.status==='HOLD'?'HOLD':returned.value===value?'EXACT':'WRONG_SOURCE',
 keyControl:!endpointOnly?'NOT_NEEDED_FULL_PATH':keyMode==='wrong'&&candidates.length===1?'NO_ALTERNATIVE_KEY':keyMode,
 bits:{raw:n,endpoint:Math.ceil(Math.log2(n+1)),residual:Math.ceil(Math.log2(candidates.length))}};
}
function embedding(n,r,k,view){
 if(!Number.isInteger(n)||n<2||n>8||!Number.isInteger(r)||r<0||r>n||!Number.isInteger(k)||k<0||k>r||!VIEWS.includes(view))throw Error('Invalid display coordinate');
 const x=(2*k-r)/n,y=r/n;
 if(view==='grid')return [x,y,0];
 if(view==='bracket'){const t=-Math.PI/2+Math.PI*r/n,R=1+.06*(2*k-r);return [R*Math.cos(t),R*Math.sin(t),0];}
 if(view==='spiral'){const t=2*Math.PI*r/n,R=1+.18*r+.04*k;return [R*Math.cos(t),R*Math.sin(t),0];}
 return [x,y,.45*(x*x-y*y)];
}
function screen(point,angle,mirror){const a=angle*Math.PI/180,[x,y,z]=point,X=x*Math.cos(a)+z*Math.sin(a),Z=-x*Math.sin(a)+z*Math.cos(a);return [(mirror?-1:1)*(X+.25*y),-y+.35*Z];}
function rotateAroundXAxis(point,connector,angleDeg){
 if(!Array.isArray(point)||point.length!==3||!Array.isArray(connector)||connector.length!==3||![...point,...connector,angleDeg].every(Number.isFinite))throw Error('Invalid tilt geometry');
 const a=angleDeg*Math.PI/180,[x,y,z]=point,[cx,cy,cz]=connector,dy=y-cy,dz=z-cz,c=Math.cos(a),s=Math.sin(a);
 return [x,cy+dy*c-dz*s,cz+dy*s+dz*c];
}
function orthographicXY(point){if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))throw Error('Invalid projection point');return [point[0],point[1]];}
function tiltProjection(value,angleDeg=0){
 value=word(value);if(!Number.isFinite(angleDeg)||angleDeg<-90||angleDeg>90)throw Error('Tilt must be within -90..90 degrees');
 const path=nodes(value),n=value.length,connector=embedding(n,0,0,'bracket');
 const addressed=[];
 for(let r=0;r<=n;r++)for(let k=0;k<=r;k++){
  const body=embedding(n,r,k,'bracket'),world=rotateAroundXAxis(body,connector,angleDeg);
  addressed.push({address:[r,k],body,world,projection:orthographicXY(world)});
 }
 const byAddress=new Map(addressed.map(p=>[p.address.join(':'),p]));
 const contour=path.map(p=>byAddress.get(p.r+':'+p.k));
 const witness=contour[contour.length-1];
 return {source:value,angleDeg,connector:{address:[0,0],point:connector,fixed:true},axis:{direction:[1,0,0],line:{point:connector,direction:[1,0,0]}},
  frame:{status:'FIXED_WORLD_FRAME'},body:{status:'RIGID_BODY_MOVES',coordinates:'declared bracket display-map coordinates'},
  camera:{status:'FIXED',positionDirection:[0,0,1],projection:'ORTHOGRAPHIC_XY',plane:'z=0'},
  addressed,contour,witness:{address:witness.address,world:witness.world,projection:witness.projection}};
}
function tiltAmbiguity(value,angleDeg=60,tolerance=1e-12){
 if(!Number.isFinite(tolerance)||tolerance<0)throw Error('Invalid tolerance');
 const magnitude=Math.abs(angleDeg),plus=tiltProjection(value,magnitude),minus=tiltProjection(value,-magnitude);
 let maxProjectionDifference=0,maxWorldDifference=0;
 for(let i=0;i<plus.addressed.length;i++){
  for(let j=0;j<2;j++)maxProjectionDifference=Math.max(maxProjectionDifference,Math.abs(plus.addressed[i].projection[j]-minus.addressed[i].projection[j]));
  for(let j=0;j<3;j++)maxWorldDifference=Math.max(maxWorldDifference,Math.abs(plus.addressed[i].world[j]-minus.addressed[i].world[j]));
 }
 return {plus,minus,tolerance,maxProjectionDifference,maxWorldDifference,sameImage:maxProjectionDifference<=tolerance,sameSpatialPose:maxWorldDifference<=tolerance,
  lostInformation:['signed depth z','sign of tilt about the declared axis'],
  sufficientReturnData:['source/address record','signed tilt angle or signed depth witness','connector and axis','fixed frame and projection definition','provenance']};
}
const initial=()=>({source:'010101',view:'grid',endpointOnly:false,key:'none',angle:0,mirror:false});
function mount(doc){
 const host=doc&&doc.getElementById('pascal-thread-demonstrator');if(!host||host.dataset.threadReady)return null;host.dataset.threadReady='true';
 const $=id=>doc.getElementById(id);let state=initial();
 function tiltCanvas(svgId,angle,compact=false){
  const svg=$(svgId);if(!svg)return;
  const q=tiltProjection(state.source,angle),q0=tiltProjection(state.source,0),scale=compact?72:130,cx=compact?100:360,cy=compact?74:170;
  const at=p=>[cx+p[0]*scale,cy-p[1]*scale],point=p=>at(p).map(v=>v.toFixed(2)).join(','),lookup=new Map(q.addressed.map(p=>[p.address.join(':'),p]));
  let out='<title>Bügelkörper bei '+angle+' Grad im festen Koordinatenrahmen</title><desc>Orthographische Projektion auf z gleich null. Der Connector am Pascal-Ursprung bleibt im Raum fest.</desc>';
  if(!compact){
   out+='<line x1="40" y1="'+at(q.connector.point)[1]+'" x2="680" y2="'+at(q.connector.point)[1]+'" stroke="#987024" stroke-dasharray="5 5"/><text x="48" y="'+(at(q.connector.point)[1]-8)+'" fill="#70551d" font-size="12">Drehachse +x</text>';
   out+='<polyline points="'+q0.contour.map(p=>point(p.projection)).join(' ')+'" fill="none" stroke="#778b94" stroke-width="2" stroke-dasharray="5 5"/>';
   const trace=[];for(let a=-90;a<=90;a+=5)trace.push(tiltProjection(state.source,a).witness.projection);
   out+='<polyline points="'+trace.map(point).join(' ')+'" fill="none" stroke="#bd327d" stroke-width="3" stroke-opacity=".65"/>';
  }
  for(let r=0;r<q.source.length;r++)for(let k=0;k<=r;k++)for(const child of [k,k+1]){
   const a=lookup.get(r+':'+k),b=lookup.get((r+1)+':'+child);out+='<line x1="'+at(a.projection)[0]+'" y1="'+at(a.projection)[1]+'" x2="'+at(b.projection)[0]+'" y2="'+at(b.projection)[1]+'" stroke="#a4b2b7" stroke-opacity=".45"/>';
  }
  out+='<polyline points="'+q.contour.map(p=>point(p.projection)).join(' ')+'" fill="none" stroke="#007e9b" stroke-width="'+(compact?3:5)+'"/>';
  const c=at(q.connector.point),w=at(q.witness.projection);out+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+(compact?5:8)+'" fill="#d09a19"><title>Connector (0,0) · räumlich fest</title></circle><circle cx="'+w[0]+'" cy="'+w[1]+'" r="'+(compact?4:7)+'" fill="#bd327d"><title>Punktspur-Witness</title></circle>';
  if(compact)out+='<text x="8" y="16" fill="#15313f" font-size="12" font-weight="700">'+angle+'°</text>';
  svg.innerHTML=out;
 }
 function renderTilt(){
  if(!$('threadTiltSvg'))return;
  const angle=Number($('threadTiltAngle').value),q=tiltProjection(state.source,angle),amb=tiltAmbiguity(state.source,60);
  $('threadTiltAngleValue').textContent=angle+'°';tiltCanvas('threadTiltSvg',angle);tiltCanvas('threadTiltMinus',-60,true);tiltCanvas('threadTiltZero',0,true);tiltCanvas('threadTiltPlus',60,true);
  $('threadTiltConnector').textContent='Connector (0,0) = ['+q.connector.point.map(v=>v.toFixed(6)).join(', ')+'] · unverändert im Weltkoordinatenrahmen';
  $('threadTiltWitness').textContent='Witness ('+q.witness.address.join(',')+') · Welt ['+q.witness.world.map(v=>v.toFixed(6)).join(', ')+'] · Projektion ['+q.witness.projection.map(v=>v.toFixed(6)).join(', ')+']';
  $('threadTiltAmbiguity').textContent='−60° und +60°: max. Bilddifferenz '+amb.maxProjectionDifference+' · max. 3D-Pose-Differenz '+amb.maxWorldDifference.toFixed(12)+' · gleiches Bild: '+(amb.sameImage?'JA':'NEIN')+' · gleiche Pose: '+(amb.sameSpatialPose?'JA':'NEIN');
 }
 function render(){
  const s=snapshot(state.source,state.endpointOnly,state.key),positions=new Map(),pts=[];
  for(let r=0;r<=s.n;r++)for(let k=0;k<=r;k++){const p=screen(embedding(s.n,r,k,state.view),state.angle,state.mirror);positions.set(r+':'+k,p);pts.push(p);}
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const scale=Math.min(610/Math.max(maxX-minX,.1),290/Math.max(maxY-minY,.1));
  const at=(r,k)=>{const p=positions.get(r+':'+k);return [360+(p[0]-(minX+maxX)/2)*scale,180+(p[1]-(minY+maxY)/2)*scale];};
  const point=(r,k)=>at(r,k).map(v=>v.toFixed(2)).join(',');
  let svg='<title>Ein Pascal-Pfad in '+state.view+'-Ansicht</title><desc>Die Geometrie ist eine deklarierte Darstellung. Der Return verwendet den sichtbaren Record und gegebenenfalls den Faserordinal, nicht Pixelkoordinaten.</desc>';
  if(state.view==='membrane')for(let r=0;r<s.n;r++)for(let k=0;k<=r;k++)svg+='<polygon points="'+point(r,k)+' '+point(r+1,k)+' '+point(r+1,k+1)+'" fill="#3985a1" fill-opacity=".14"/>';
  for(let r=0;r<s.n;r++)for(let k=0;k<=r;k++)for(const q of [k,k+1])svg+='<line x1="'+at(r,k)[0]+'" y1="'+at(r,k)[1]+'" x2="'+at(r+1,q)[0]+'" y2="'+at(r+1,q)[1]+'" stroke="#9caeb5" stroke-opacity=".6"/>';
  const poly=(path,color,dashed)=>'<polyline points="'+path.map(p=>point(p.r,p.k)).join(' ')+'" fill="none" stroke="'+color+'" stroke-width="4" '+(dashed?'stroke-dasharray="7 5"':'')+'/>';
  if(!state.endpointOnly)svg+=poly(s.path,'#007e9b',false);
  if(s.returned.value)svg+=poly(nodes(s.returned.value),s.verdict==='EXACT'?'#9a6700':'#b32c38',true);
  for(let r=0;r<=s.n;r++)for(let k=0;k<=r;k++){const selected=state.endpointOnly?r===s.n&&k===s.k:s.path[r].k===k;svg+='<circle cx="'+at(r,k)[0]+'" cy="'+at(r,k)[1]+'" r="'+(selected?5:2.5)+'" fill="'+(selected?'#007e9b':'#78909b')+'"><title>Adresse ('+r+','+k+')</title></circle>';}
  const endpoint=at(s.n,s.k);svg+='<circle cx="'+endpoint[0]+'" cy="'+endpoint[1]+'" r="10" fill="none" stroke="#bd327d" stroke-width="2"/>';
  $('threadSvg').innerHTML=svg;
  $('threadWord').value=state.source;$('threadDepth').value=String(s.n);$('threadDepthValue').textContent=String(s.n);
  $('threadView').value=state.view;$('threadEndpointOnly').checked=state.endpointOnly;$('threadMirror').checked=state.mirror;$('threadAngle').value=String(state.angle);$('threadAngleValue').textContent=state.angle+'°';
  $('threadKey').value=state.key;$('threadKey').disabled=!state.endpointOnly;
  $('threadSource').textContent=state.source+' · '+s.n+' Entscheidungen';
  $('threadRecord').textContent=JSON.stringify(s.record);
  $('threadFiber').textContent=state.endpointOnly?s.candidates.length+' kompatible Pfade · C('+s.n+','+s.k+')':'Vollständige adressierte Knotenfolge · eindeutiger Pfad';
  $('threadWitness').textContent=!state.endpointOnly?'Nicht nötig: Knotenfolge enthält die Baugeschichte.':s.supplied===null?'Kein Faserordinal übergeben.':'Pinker Schlüssel: Ordinal '+s.supplied+' von 0…'+(s.candidates.length-1);
  $('threadReturned').textContent=s.returned.value||'HOLD · kein eindeutiger Return';
  $('threadVerdict').textContent=s.verdict==='EXACT'?'EXAKTER RETURN':s.verdict==='HOLD'?'MEHRDEUTIG · SCHLÜSSEL FEHLT':'FALSCHE QUELLE · Schlüssel vertauscht';
  $('threadVerdict').dataset.verdict=s.verdict;
  $('threadCost').textContent=state.endpointOnly?'Deklarierter Fixed-Width-Record: Endpunkt '+s.bits.endpoint+' + Residuum '+s.bits.residual+' = '+(s.bits.endpoint+s.bits.residual)+' Bit; Rohwort '+s.bits.raw+' Bit. Kein allgemeiner Economy-Claim.':'Der volle Pfad enthält die Entscheidungen. Keine Bit-Ersparnis aus einer anderen Form abgeleitet.';
  $('threadControl').textContent=s.keyControl==='NO_ALTERNATIVE_KEY'?'Randfall: Diese Faser enthält nur einen Pfad; es gibt keinen anderen gültigen Schlüssel.':'Spiegelung und Blickwinkel ändern nur die Anzeige, nicht das Binärwort. Gold gestrichelt = Return; Rot gestrichelt = falscher Return.';
  $('threadCandidates').innerHTML=(state.endpointOnly?s.candidates:[state.source]).map(w=>'<button type="button" data-thread-path="'+w+'" aria-pressed="'+(w===state.source)+'">'+w+'</button>').join(' ');
  $('threadError').textContent='';
  renderTilt();
 }
 function update(patch){state={...state,...patch};render();}
 function submit(){try{update({source:word($('threadWord').value.trim())});}catch(e){$('threadError').textContent=e.message;}}
 $('threadApply').addEventListener('click',submit);
 $('threadWord').addEventListener('keydown',e=>{if(e.key==='Enter')submit();});
 $('threadDepth').addEventListener('input',()=>{const n=Number($('threadDepth').value);update({source:state.source.slice(0,n).padEnd(n,'0')});});
 $('threadView').addEventListener('change',()=>update({view:$('threadView').value}));
 $('threadEndpointOnly').addEventListener('change',()=>update({endpointOnly:$('threadEndpointOnly').checked}));
 $('threadKey').addEventListener('change',()=>update({key:$('threadKey').value}));
 $('threadMirror').addEventListener('change',()=>update({mirror:$('threadMirror').checked}));
 $('threadAngle').addEventListener('input',()=>update({angle:Number($('threadAngle').value)}));
 if($('threadTiltAngle')){
  $('threadTiltAngle').addEventListener('input',renderTilt);
  for(const [id,angle] of [['threadTiltStart',0],['threadTiltMid',60],['threadTiltReturn',0]])$(''+id).addEventListener('click',()=>{$('threadTiltAngle').value=String(angle);renderTilt();});
 }
 $('threadLoss').addEventListener('click',()=>update({endpointOnly:true,key:'none'}));
 $('threadReturn').addEventListener('click',()=>update({endpointOnly:true,key:'correct'}));
 $('threadWrong').addEventListener('click',()=>update({endpointOnly:true,key:'wrong'}));
 $('threadReset').addEventListener('click',()=>{state=initial();render();});
 $('threadCandidates').addEventListener('click',e=>{const el=e.target.closest('[data-thread-path]');if(el)update({source:el.dataset.threadPath});});
 render();return {update,get state(){return {...state}},snapshot:()=>snapshot(state.source,state.endpointOnly,state.key),tiltSnapshot:()=>tiltProjection(state.source,Number($('threadTiltAngle')?.value||0))};
}
return {VIEWS,word,nodes,fiber,project,inverse,snapshot,embedding,screen,rotateAroundXAxis,orthographicXY,tiltProjection,tiltAmbiguity,mount};
});

