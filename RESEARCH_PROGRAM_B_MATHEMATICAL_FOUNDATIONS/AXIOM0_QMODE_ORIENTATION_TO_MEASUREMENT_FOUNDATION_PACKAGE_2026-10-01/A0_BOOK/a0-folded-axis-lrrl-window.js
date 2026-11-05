(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0FoldedAxisLrrlWindow=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const VERSION='1.2.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const MODES=Object.freeze(['FOLD','LRRL','GATES_99','PINS_97_99_101','STOP_READ','PBDQ_TQ']);
  const TOKENS=Object.freeze(['SP','UR','Ar²okoth'].map(token=>Object.freeze({token,status:'UNBOUND_OWNER_TOKEN',resolvedIdentity:null})));
  const LRRL=Object.freeze([
    Object.freeze({token:'L',role:'OUTER_CHANNEL',color:'ORANGE'}),
    Object.freeze({token:'R',role:'INNER_COUNTER_CHANNEL',color:'PURPLE_PINK'}),
    Object.freeze({token:'R',role:'INNER_COUNTER_CHANNEL',color:'PURPLE_PINK'}),
    Object.freeze({token:'L',role:'OUTER_CHANNEL',color:'ORANGE'})
  ]);
  const AUTHORITY=Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,publication:false});
  const STOP_READ=Object.freeze({sequence:Object.freeze(['S','T','O','P']),roles:Object.freeze({S:'SOURCE',T:'TRANSITION',O:'ORIGIN_PIVOT',P:'POLE_RETURN'}),pReturnRole:'R',pEqualsR:false,boundary:'DISPLAY_MNEMONIC_ONLY'});
  const PBDQ_TQ=Object.freeze({
    sequence:Object.freeze(['p','b','d','q']),
    transforms:Object.freeze({p:'IDENTITY',b:'REFLECT_HORIZONTAL',d:'ROTATE_180',q:'REFLECT_VERTICAL'}),
    group:'D2_KLEIN_FOUR_DISPLAY',
    tq:Object.freeze({T:'TRANSITION_AXIS',Q:'QUADRANT_ORBIT',directions:Object.freeze(['+','−'])}),
    svgConstructed:true,
    fontDependent:false,
    ownerMnemonic:'LGBTQ±',
    ownerMnemonicStatus:'UNBOUND_CULTURAL_WORDPLAY',
    boundary:'DISPLAY_GLYPH_ORBIT_ONLY'
  });
  const LIC=Object.freeze({lens:'PBDQ_TQ_PLUS_MINUS',identity:IDENTITY,contract:'SVG_GLYPH_ORBIT_D2_DISPLAY_ONLY',newIdentity:false,newRelation:false});

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
  function contract(){return Object.freeze({version:VERSION,identity:IDENTITY,classification:'BOUNDED_ENGINEERING_VIEW',modes:MODES,lrrl:LRRL,stopRead:STOP_READ,pbdqTq:PBDQ_TQ,lic:LIC,tokens:TOKENS,gateCount:gatePoints().length,exact:exact(),authority:AUTHORITY,boundary:'COUNT CONTROL; DISPLAY ROLES; STOP IS A LOCAL MNEMONIC; P↔R IS A RETURN-ROLE HANDOFF, NOT P=R; PBDQ/TQ± IS A FONT-INDEPENDENT SVG GLYPH ORBIT; LGBTQ± IS UNBOUND OWNER WORDPLAY, NOT A CLAIM ABOUT LGBTQ+ IDENTITIES; NO IMAGE-DERIVED COUNT; NO ARROKOTH ALIAS; NO SCIENCE CLAIM'});}
  function svgEl(doc,name,attrs,text){const el=doc.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,String(v)));if(text!==undefined)el.textContent=text;return el;}
  function add(doc,svg,name,attrs,text){const el=svgEl(doc,name,attrs,text);svg.appendChild(el);return el;}
  function drawBase(doc,svg,mode){
    add(doc,svg,'line',{x1:46,y1:270,x2:554,y2:270,class:'falw-axis'});
    add(doc,svg,'line',{x1:300,y1:32,x2:300,y2:508,class:'falw-axis falw-axis-faint'});
    add(doc,svg,'circle',{cx:300,cy:270,r:12,class:'falw-still'});
    add(doc,svg,'text',{x:300,y:274,class:'falw-still-text','text-anchor':'middle'},mode==='STOP_READ'?'O':'SP');
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
  function drawStop(doc,svg){
    const nodes=[{x:105,y:270,t:'S',role:'SOURCE'},{x:235,y:210,t:'T',role:'TRANSITION'},{x:300,y:270,t:'O',role:'ORIGIN / PIVOT'},{x:495,y:270,t:'P',role:'POLE / RETURN'}];
    add(doc,svg,'path',{d:'M105 270L235 210L300 270L495 270',class:'falw-stop-path'});
    add(doc,svg,'path',{d:'M495 292C430 430 170 430 105 292',class:'falw-stop-return'});
    add(doc,svg,'line',{x1:235,y1:78,x2:235,y2:190,class:'falw-stop-hanger'});
    nodes.forEach(node=>{add(doc,svg,'circle',{cx:node.x,cy:node.y,r:node.t==='O'?24:21,class:`falw-stop-node falw-stop-${node.t.toLowerCase()}`});add(doc,svg,'text',{x:node.x,y:node.y+8,class:'falw-stop-token','text-anchor':'middle'},node.t);add(doc,svg,'text',{x:node.x,y:node.y+48,class:'falw-stop-role','text-anchor':'middle'},node.role)});
    add(doc,svg,'text',{x:300,y:72,class:'falw-stop-title','text-anchor':'middle'},'S — T — O — P');
    add(doc,svg,'text',{x:300,y:455,class:'falw-kicker','text-anchor':'middle'},'P ↔ R · RETURN ROLE · NOT NUMERIC EQUALITY');
    add(doc,svg,'text',{x:300,y:482,class:'falw-stop-note','text-anchor':'middle'},'SOURCE → TRANSITION → ORIGIN/PIVOT → POLE/RETURN');
  }
  function drawGlyph(doc,svg,x,y,label,transform,role){
    const group=add(doc,svg,'g',{transform:`translate(${x} ${y}) ${transform}`,class:'falw-pbdq-glyph','data-glyph':label});
    group.appendChild(svgEl(doc,'line',{x1:0,y1:-24,x2:0,y2:52,class:'falw-pbdq-stem'}));
    group.appendChild(svgEl(doc,'circle',{cx:20,cy:-3,r:20,class:'falw-pbdq-bowl'}));
    add(doc,svg,'text',{x,y:y+92,class:'falw-pbdq-letter','text-anchor':'middle'},label);
    add(doc,svg,'text',{x,y:y+111,class:'falw-pbdq-role','text-anchor':'middle'},role);
  }
  function drawPbdq(doc,svg){
    add(doc,svg,'ellipse',{cx:300,cy:236,rx:244,ry:132,class:'falw-pbdq-orbit'});
    add(doc,svg,'line',{x1:300,y1:54,x2:300,y2:418,class:'falw-pbdq-t-axis'});
    add(doc,svg,'line',{x1:68,y1:236,x2:532,y2:236,class:'falw-pbdq-q-axis'});
    add(doc,svg,'text',{x:300,y:40,class:'falw-pbdq-title','text-anchor':'middle'},'PBDQ · TQ±');
    add(doc,svg,'text',{x:300,y:73,class:'falw-pbdq-subtitle','text-anchor':'middle'},'T · TRANSITION AXIS   /   Q · QUADRANT ORBIT');
    drawGlyph(doc,svg,118,186,'p','scale(1 1)','IDENTITY');
    drawGlyph(doc,svg,238,286,'b','scale(1 -1)','REFLECT H');
    drawGlyph(doc,svg,362,286,'d','scale(-1 -1)','ROTATE 180°');
    drawGlyph(doc,svg,482,186,'q','scale(-1 1)','REFLECT V');
    add(doc,svg,'path',{d:'M105 118 Q300 18 495 118',class:'falw-pbdq-direction'});
    add(doc,svg,'text',{x:89,y:119,class:'falw-pbdq-sign','text-anchor':'middle'},'−');
    add(doc,svg,'text',{x:511,y:119,class:'falw-pbdq-sign','text-anchor':'middle'},'+');
    add(doc,svg,'rect',{x:86,y:430,width:428,height:64,rx:10,class:'falw-lic-card'});
    add(doc,svg,'text',{x:106,y:454,class:'falw-lic-head'},'LIC · LENS / IDENTITY / CONTRACT');
    add(doc,svg,'text',{x:106,y:478,class:'falw-lic-copy'},'PBDQ_TQ±  ·  OCB REUSED  ·  SVG/D2 DISPLAY ONLY');
    add(doc,svg,'text',{x:300,y:520,class:'falw-pbdq-note','text-anchor':'middle'},'OWNER MNEMONIC “LGBTQ±” · CULTURAL WORDPLAY · UNBOUND');
  }
  function receipt(mode){return {schema:'NEXAH_A0_FOLDED_AXIS_LRRL_WINDOW_RECEIPT_V1',generatedAt:new Date().toISOString(),mode,contract:contract()};}
  function download(win,payload){const blob=new win.Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=win.URL.createObjectURL(blob);const a=win.document.createElement('a');a.href=url;a.download='a0-folded-axis-lrrl-window-receipt.json';a.click();win.URL.revokeObjectURL(url);}
  function mount(doc,win){
    const root=doc.getElementById('foldedAxisLrrlWindow');if(!root)return null;
    const svg=root.querySelector('[data-falw-svg]'),status=root.querySelector('[data-falw-status]');let mode='FOLD';
    function render(next){if(!MODES.includes(next))throw new Error(`Unknown mode: ${next}`);mode=next;root.dataset.mode=mode;svg.replaceChildren();if(mode!=='PBDQ_TQ')drawBase(doc,svg,mode);({FOLD:drawFold,LRRL:drawLrrl,GATES_99:drawGates,PINS_97_99_101:drawPins,STOP_READ:drawStop,PBDQ_TQ:drawPbdq}[mode])(doc,svg);root.querySelectorAll('[data-falw-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.falwMode===mode)));status.textContent=mode.replaceAll('_',' · ');return mode;}
    root.querySelectorAll('[data-falw-mode]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.falwMode)));
    const exportButton=root.querySelector('[data-falw-export]');if(exportButton)exportButton.addEventListener('click',()=>download(win,receipt(mode)));
    render(root.dataset.mode&&MODES.includes(root.dataset.mode)?root.dataset.mode:'FOLD');
    return Object.freeze({render,getMode:()=>mode,getReceipt:()=>receipt(mode),contract});
  }
  return Object.freeze({VERSION,IDENTITY,MODES,TOKENS,LRRL,STOP_READ,PBDQ_TQ,LIC,AUTHORITY,isPrime,gatePoints,exact,contract,receipt,mount});
});
