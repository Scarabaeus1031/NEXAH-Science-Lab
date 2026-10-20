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
const initial=()=>({source:'010101',view:'grid',endpointOnly:false,key:'none',angle:0,mirror:false});
function mount(doc){
 const host=doc&&doc.getElementById('pascal-thread-demonstrator');if(!host||host.dataset.threadReady)return null;host.dataset.threadReady='true';
 const $=id=>doc.getElementById(id);let state=initial();
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
 $('threadLoss').addEventListener('click',()=>update({endpointOnly:true,key:'none'}));
 $('threadReturn').addEventListener('click',()=>update({endpointOnly:true,key:'correct'}));
 $('threadWrong').addEventListener('click',()=>update({endpointOnly:true,key:'wrong'}));
 $('threadReset').addEventListener('click',()=>{state=initial();render();});
 $('threadCandidates').addEventListener('click',e=>{const el=e.target.closest('[data-thread-path]');if(el)update({source:el.dataset.threadPath});});
 render();return {update,get state(){return {...state}},snapshot:()=>snapshot(state.source,state.endpointOnly,state.key)};
}
return {VIEWS,word,nodes,fiber,project,inverse,snapshot,embedding,screen,mount};
});

