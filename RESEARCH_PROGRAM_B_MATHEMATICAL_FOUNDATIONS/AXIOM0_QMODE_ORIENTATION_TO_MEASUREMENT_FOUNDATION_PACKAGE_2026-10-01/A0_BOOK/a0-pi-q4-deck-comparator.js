(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0PiQ4DeckComparator=api;api.mountAll();}})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SUITS=['♠','♦','♥','♣'];
  const MASK_GATES=[
    {label:'3h',x:516.321485,y:166.353501,zone:'outside'},{label:'6h',x:454.831491,y:158.638885,zone:'outside'},
    {label:'9h',x:393.294656,y:152.025117,zone:'outside'},{label:'12h',x:367.234521,y:146.960539,zone:'inside'},
    {label:'24h',x:534.537929,y:169.415140,zone:'outside'},{label:'36h',x:358.115326,y:141.666837,zone:'inside'},
    {label:'42h',x:441.182740,y:137.356506,zone:'outside'},{label:'48h',x:524.098410,y:164.107154,zone:'outside'}
  ];
  const DECK_PROFILES={
    standard54:{count:54,title:'STANDARD + 2 JOKER',note:'48 mobile Karten + 4 Asse + 2 Joker als sechs feste Zentren.',equation:'48 + 4 + 2 = 54',status:'EXAKTER AUDIT'},
    doppelkopf48:{count:48,title:'DOPPELKOPF · DISPLAYPROFILE',note:'AKQJ10 · ♥10 / Dulle ist regel- und variantenabhängig.',equation:'2 × 24 = 48',status:'REGELPROFIL'},
    skat32:{count:32,title:'SKAT · DISPLAYPROFILE',note:'Vier Farben mit je acht Karten; Spielwertungen sind zusätzliche Regeln.',equation:'4 × 8 = 32',status:'REGELPROFIL'},
    poker52:{count:52,title:'POKER · DISPLAYPROFILE',note:'Vier Farben mit je dreizehn Karten; Joker sind hier nicht im Carrier.',equation:'4 × 13 = 52',status:'REGELPROFIL'}
  };
  const q4Complement=v=>15-(Number(v)&15);
  const suitStep=(i,n=1)=>((Number(i)+Number(n))%4+4)%4;
  const bits=v=>(Number(v)&15).toString(2).padStart(4,'0');
  function maskSummary(fullTrace=true){const inside=MASK_GATES.filter(g=>g.zone==='inside').length,outside=MASK_GATES.length-inside;return fullTrace?{recoverable:inside,unknown:0,outside,label:`${inside} recoverable · ${outside} outside`}:{recoverable:0,unknown:inside,outside,label:`${inside} unknown · ${outside} outside`};}
  function deckProfile(id){return DECK_PROFILES[id]||DECK_PROFILES.standard54;}
  function angularResidual(a,b){let d=Math.abs((Number(a)-Number(b))%360);return d>180?360-d:d;}
  function polarisBearing(nullRotation=0){const residual=angularResidual(nullRotation,0);return{rotation:Number(nullRotation),residual,status:residual===0?'PASS BY CONSTRUCTION':'NULL CONTROL'};}
  function mount(el){let q=0,suit=0,trace=true;const qa=sel=>el.querySelector(sel),qaa=sel=>[...el.querySelectorAll(sel)];
    const renderQ4=()=>{qa('[data-piq-q4-state]').textContent=`${bits(q)}₂`;qa('[data-piq-q4-pair]').textContent=`${bits(q4Complement(q))}₂`;qa('[data-piq-q4-equation]').textContent=`C(${q})=${q4Complement(q)}`;qaa('[data-piq-suits] button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===suit)));};
    const suits=qa('[data-piq-suits]');SUITS.forEach((symbol,i)=>{const b=document.createElement('button');b.type='button';b.textContent=symbol;b.setAttribute('aria-label',`Farbe ${symbol}`);b.addEventListener('click',()=>{suit=i;renderQ4()});suits.appendChild(b)});
    qa('[data-piq-q4-down]').addEventListener('click',()=>{q=(q+15)%16;suit=suitStep(suit,-1);renderQ4()});qa('[data-piq-q4-up]').addEventListener('click',()=>{q=(q+1)%16;suit=suitStep(suit,1);renderQ4()});
    const field=qa('[data-piq-mask-field]'),xs=MASK_GATES.map(g=>g.x),ys=MASK_GATES.map(g=>g.y),xmin=Math.min(...xs)-15,xmax=Math.max(...xs)+15,ymin=Math.min(...ys)-8,ymax=Math.max(...ys)+8;
    MASK_GATES.forEach(g=>{const n=document.createElement('i');n.className=`piq-gate ${g.zone}`;n.dataset.zone=g.zone;n.textContent=g.label;n.style.left=`${((g.x-xmin)/(xmax-xmin))*100}%`;n.style.top=`${100-((g.y-ymin)/(ymax-ymin))*100}%`;field.appendChild(n)});
    const renderMask=()=>{const s=maskSummary(trace);qa('[data-piq-mask-summary]').textContent=s.label;qaa('.piq-gate[data-zone="inside"]').forEach(n=>n.classList.toggle('unknown',!trace));};
    qa('[data-piq-trace]').addEventListener('change',e=>{trace=e.currentTarget.checked;renderMask()});
    const renderDeck=id=>{const p=deckProfile(id);qa('[data-piq-deck-count]').textContent=p.count;qa('[data-piq-deck-title]').textContent=p.title;qa('[data-piq-deck-note]').textContent=p.note;qa('[data-piq-deck-equation]').textContent=p.equation;qa('[data-piq-deck-status]').textContent=p.status;};
    qa('[data-piq-deck-select]').addEventListener('change',e=>renderDeck(e.currentTarget.value));
    const renderBearing=rotation=>{const p=polarisBearing(rotation);qa('[data-piq-axis]').style.transform=`rotate(${p.rotation}deg)`;const rad=(p.rotation-90)*Math.PI/180;qa('[data-piq-bearing-point]').setAttribute('cx',String(180+58*Math.cos(rad)));qa('[data-piq-bearing-point]').setAttribute('cy',String(135+58*Math.sin(rad)));qa('[data-piq-residual]').textContent=`Δθ = ${p.residual}°`;qa('[data-piq-bearing-status]').textContent=p.status;};
    qa('[data-piq-null]').addEventListener('change',e=>renderBearing(e.currentTarget.checked?37:0));renderQ4();renderMask();renderDeck('standard54');renderBearing(0);
  }
  function mountAll(){document.querySelectorAll('[data-piq-comparator]').forEach(mount);}
  return{SUITS,MASK_GATES,DECK_PROFILES,q4Complement,suitStep,bits,maskSummary,deckProfile,angularResidual,polarisBearing,mount,mountAll};
});
