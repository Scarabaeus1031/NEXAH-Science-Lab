(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0FoldedAxisLrrlWindow=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const MODES=Object.freeze(['FOLD','LRRL','GATES_99','PINS_97_99_101']);
  const TOKENS=Object.freeze(['SP','UR','Ar²okoth'].map(token=>Object.freeze({token,status:'UNBOUND_OWNER_TOKEN',resolvedIdentity:null})));
  const LRRL=Object.freeze([
    Object.freeze({token:'L',role:'OUTER_CHANNEL',color:'ORANGE'}),
    Object.freeze({token:'R',role:'INNER_COUNTER_CHANNEL',color:'PURPLE_PINK'}),
    Object.freeze({token:'R',role:'INNER_COUNTER_CHANNEL',color:'PURPLE_PINK'}),
    Object.freeze({token:'L',role:'OUTER_CHANNEL',color:'ORANGE'})
  ]);
  const AUTHORITY=Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,publication:false});

  function isPrime(n){if(n<2)return false;for(let d=2;d*d<=n;d+=1)if(n%d===0)return false;return true;}
  function gatePoints(){
    const points=[];
    for(let row=0;row<9;row+=1)for(let col=0;col<11;col+=1){
      const theta=(-0.78+(col/10)*1.56)+(row-4)*0.017;
      const radius=52+row*15;
      points.push(Object.freeze({index:row*11+col+1,row,col,x:300+Math.sin(theta)*radius,y:270-Math.cos(theta)*radius}));
    }
    return Object.freeze(points);
  }
  function exact(){return Object.freeze({pinLeft:97,midpoint:99,pinRight:101,sum:198,doubleMidpoint:198,product:9797,squareMinusFour:9797,factor99:Object.freeze([9,11]),pinsPrime:isPrime(97)&&isPrime(101)});}
  function contract(){return Object.freeze({version:VERSION,identity:IDENTITY,classification:'BOUNDED_ENGINEERING_VIEW',modes:MODES,lrrl:LRRL,tokens:TOKENS,gateCount:gatePoints().length,exact:exact(),authority:AUTHORITY,boundary:'COUNT CONTROL; DISPLAY ROLES; NO IMAGE-DERIVED COUNT; NO ARROKOTH ALIAS; NO SCIENCE CLAIM'});}
  function svgEl(doc,name,attrs,text){const el=doc.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,String(v)));if(text!==undefined)el.textContent=text;return el;}
  function add(doc,svg,name,attrs,text){const el=svgEl(doc,name,attrs,text);svg.appendChild(el);return el;}
  function drawBase(doc,svg){
    add(doc,svg,'line',{x1:46,y1:270,x2:554,y2:270,class:'falw-axis'});
    add(doc,svg,'line',{x1:300,y1:32,x2:300,y2:508,class:'falw-axis falw-axis-faint'});
    add(doc,svg,'circle',{cx:300,cy:270,r:12,class:'falw-still'});
    add(doc,svg,'text',{x:300,y:274,class:'falw-still-text','text-anchor':'middle'},'SP');
  }
  function drawFold(doc,svg){
    const paths=['M300 62 C220 75 168 143 176 224 C181 252 218 266 286 270','M300 478 C220 465 168 397 176 316 C181 288 218 274 286 270'];
    paths.forEach(d=>add(doc,svg,'path',{d,class:'falw-fold-loop'}));
    [[300,78],[300,462],[300,176],[300,364]].forEach(([cx,cy],i)=>add(doc,svg,'circle',{cx,cy,r:i<2?18:13,class:i<2?'falw-pin':'falw-aperture'}));
    add(doc,svg,'text',{x:326,y:84,class:'falw-label'},'paired pole');
    add(doc,svg,'text',{x:326,y:468,class:'falw-label'},'coupled pole');
    add(doc,svg,'text',{x:64,y:256,class:'falw-kicker'},'WHITE FOLD AXIS');
  }
  function drawLrrl(doc,svg){
    const xs=[112,238,362,488];
    LRRL.forEach((item,i)=>{
      add(doc,svg,'path',{d:`M${xs[i]} 105 Q${xs[i]+(i<2?34:-34)} 270 ${xs[i]} 435`,class:item.color==='ORANGE'?'falw-lrrl falw-orange':'falw-lrrl falw-purple'});
      add(doc,svg,'text',{x:xs[i],y:82,class:item.color==='ORANGE'?'falw-token falw-orange-text':'falw-token falw-purple-text','text-anchor':'middle'},item.token);
    });
    add(doc,svg,'text',{x:300,y:485,class:'falw-kicker','text-anchor':'middle'},'ORANGE OUTER · PURPLE/PINK INNER · ROLE VIEW');
  }
  function drawGates(doc,svg){
    gatePoints().forEach(p=>add(doc,svg,'circle',{cx:p.x.toFixed(2),cy:p.y.toFixed(2),r:3.2,class:'falw-gate','data-gate':p.index}));
    add(doc,svg,'path',{d:'M300 270 C390 238 440 170 514 112',class:'falw-target-path'});
    add(doc,svg,'circle',{cx:514,cy:112,r:10,class:'falw-target'});
    add(doc,svg,'text',{x:300,y:492,class:'falw-kicker','text-anchor':'middle'},'99 GENERATED GATES · 9 × 11 COUNT CONTROL');
  }
  function drawPins(doc,svg){
    const pins=[{x:158,n:97,c:'falw-white-pin'},{x:300,n:99,c:'falw-red-pin'},{x:442,n:101,c:'falw-white-pin'}];
    add(doc,svg,'path',{d:'M158 270 Q300 118 442 270',class:'falw-pin-arc'});
    pins.forEach(p=>{add(doc,svg,'circle',{cx:p.x,cy:270,r:p.n===99?31:24,class:p.c});add(doc,svg,'text',{x:p.x,y:278,class:'falw-pin-number','text-anchor':'middle'},p.n);});
    add(doc,svg,'text',{x:300,y:372,class:'falw-equation','text-anchor':'middle'},'97 + 101 = 198 = 2 × 99');
    add(doc,svg,'text',{x:300,y:408,class:'falw-equation','text-anchor':'middle'},'97 × 101 = 9797 = 99² − 4');
    add(doc,svg,'text',{x:300,y:444,class:'falw-equation','text-anchor':'middle'},'99 = 9 × 11');
  }
  function receipt(mode){return {schema:'NEXAH_A0_FOLDED_AXIS_LRRL_WINDOW_RECEIPT_V1',generatedAt:new Date().toISOString(),mode,contract:contract()};}
  function download(win,payload){const blob=new win.Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=win.URL.createObjectURL(blob);const a=win.document.createElement('a');a.href=url;a.download='a0-folded-axis-lrrl-window-receipt.json';a.click();win.URL.revokeObjectURL(url);}
  function mount(doc,win){
    const root=doc.getElementById('foldedAxisLrrlWindow');if(!root)return null;
    const svg=root.querySelector('[data-falw-svg]'),status=root.querySelector('[data-falw-status]');let mode='FOLD';
    function render(next){if(!MODES.includes(next))throw new Error(`Unknown mode: ${next}`);mode=next;root.dataset.mode=mode;svg.replaceChildren();drawBase(doc,svg);({FOLD:drawFold,LRRL:drawLrrl,GATES_99:drawGates,PINS_97_99_101:drawPins}[mode])(doc,svg);root.querySelectorAll('[data-falw-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.falwMode===mode)));status.textContent=mode.replaceAll('_',' · ');return mode;}
    root.querySelectorAll('[data-falw-mode]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.falwMode)));
    const exportButton=root.querySelector('[data-falw-export]');if(exportButton)exportButton.addEventListener('click',()=>download(win,receipt(mode)));
    render(root.dataset.mode&&MODES.includes(root.dataset.mode)?root.dataset.mode:'FOLD');
    return Object.freeze({render,getMode:()=>mode,getReceipt:()=>receipt(mode),contract});
  }
  return Object.freeze({VERSION,IDENTITY,MODES,TOKENS,LRRL,AUTHORITY,isPrime,gatePoints,exact,contract,receipt,mount});
});
