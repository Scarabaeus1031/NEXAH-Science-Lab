(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0MirrorPinRest=api;api.mount(root.document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 function snapshot(phase=0){
  if(!Number.isInteger(phase)||phase<0||phase>360)throw Error('Invalid local display phase');
  const tilt=12*Math.sin(phase*Math.PI/180),a=tilt*Math.PI/180,upper=[Math.sin(a),Math.cos(a)],lower=upper.map(x=>-x);
  return {schema:'a0.mirror-pin-rest/2',phase,anchor:[0,0],anchorLabel:'1',tiltDegrees:tilt,upper,lower,
   orientationRule:'declared display tilt = 12 degrees * sin(local phase); lower = -upper',
   pinLabels:['0','0'],labelStatus:'two distinct boundary markers sharing label0, not extra independent states',
   primeReading:{status:'DECLARED_OWNER_PLACEMENT_NOT_PRIME_LAW',radius:.7,inside:[{value:2,point:[-.35,.25]},{value:3,point:[.35,.25]},{value:5,point:[.35,-.35]}],outside:[{value:7,point:[1.1,0]}],sequence:[2,3,5,7,11,13],fifthPrime:11,sixthPrime:13,centerIsPrime:false},
   decimal:{left:111,right:111,product:12321,middleDigit:'3',extraCenterState:false},
   splitRest:{N:8451,divisor:4,position:2112.75,lower:2112,upper:2113,lowerSignedRest:3,upperSignedRest:-1,lowerDistance:.75,upperDistance:.25,quotientIntervalWidth:1,integerIntervalWidth:4},
   boundary:'Constructed symbolic orientation view. Fixed anchor, moving orientation; no physical precession, gravity, Kuramoto, 11^3 or whole-machine identity. Local phase retained for checkpoint; not recovered from pixels.'};
 }
 function record(phase){return {schema:'a0.mirror-pin-checkpoint/2',phase,reading:snapshot(phase)};}
 function verify(r){try{return r?.schema==='a0.mirror-pin-checkpoint/2'&&JSON.stringify(r)===JSON.stringify(record(r.phase))?'PASS':'INVALID';}catch{return 'INVALID';}}
 function drawing(phase){
  const r=snapshot(phase),p=([x,y])=>[240+140*x,220-140*y],u=p(r.upper),l=p(r.lower);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 450" role="img" aria-label="Zero one zero: fixed central1, two outer zero markers, primes2 3 5 inside and7 outside a declared circle">'+
   '<rect width="480" height="450" rx="12" fill="#071b26"/><line x1="240" y1="55" x2="240" y2="385" stroke="#547482" stroke-dasharray="4 6"/>'+
   '<circle cx="240" cy="220" r="'+140*r.primeReading.radius+'" fill="none" stroke="#456877" stroke-width="2"/>'+
   '<line x1="'+u[0]+'" y1="'+u[1]+'" x2="'+l[0]+'" y2="'+l[1]+'" stroke="#b68af4" stroke-width="3"/>'+
   [[u,'#ffd36a','0 · oben'],[l,'#55d7ec','0 · gespiegelt']].map(([v,c,label])=>'<circle cx="'+v[0]+'" cy="'+v[1]+'" r="7" fill="'+c+'"/><text x="'+(v[0]+16)+'" y="'+v[1]+'" fill="'+c+'" font-size="14">'+label+'</text>').join('')+
   [...r.primeReading.inside,...r.primeReading.outside].map(n=>{const v=p(n.point);return '<text x="'+v[0]+'" y="'+v[1]+'" text-anchor="middle" fill="'+(n.value===7?'#b68af4':'#ffd36a')+'" font-size="20">'+n.value+'</text>';}).join('')+
   '<circle cx="240" cy="220" r="14" fill="#071b26" stroke="#ffffff" stroke-width="2"/><text x="240" y="225" text-anchor="middle" fill="#ffffff" font-size="15">1</text>'+
   '<text x="240" y="410" text-anchor="middle" fill="#d9edf4" font-size="14">Ein Bezugspunkt · zwei gegenüberliegende Pins</text>'+
   '<text x="240" y="434" text-anchor="middle" fill="#9bb7c5" font-size="12">Orientierung bewegt sich — die Mitte bleibt</text></svg>';
 }
 function mount(doc,win){
  if(!doc||!doc.getElementById('mirrorPinRest'))return null;
  const el=id=>doc.getElementById(id);let phase=0,checkpoint=null;
  function render(){
   const r=snapshot(phase);el('mprPhase').value=String(phase);el('mprDrawing').innerHTML=drawing(phase);
   el('mprStatus').textContent='Lokale Phase '+phase+'° · deklarierte Neigung '+r.tiltDegrees.toFixed(3)+'° · Mitte (0,0) bleibt fest';
   el('mprRestore').disabled=checkpoint===null;
  }
  el('mprPhase').addEventListener('input',()=>{phase=snapshot(Number(el('mprPhase').value)).phase;render();});
  el('mprCapture').addEventListener('click',()=>{checkpoint=record(phase);render();});
  el('mprRestore').addEventListener('click',()=>{if(checkpoint&&verify(checkpoint)==='PASS'){phase=checkpoint.phase;render();}});
  el('mprExport').addEventListener('click',()=>{
   const a=doc.createElement('a'),url=win.URL.createObjectURL(new win.Blob([JSON.stringify(record(phase),null,2)],{type:'application/json'}));
   a.href=url;a.download='a0-mirror-pin-local-checkpoint.json';a.click();win.URL.revokeObjectURL(url);
  });
  render();return {read:()=>clone(snapshot(phase)),record:()=>record(phase)};
 }
 return {snapshot,record,verify,drawing,mount};
});
