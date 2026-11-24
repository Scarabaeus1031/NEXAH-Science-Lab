(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0Mod9PascalThreadBridge=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const CYCLE=Object.freeze([1,2,4,8,7,5]);
  const DOUBLE_CYCLE=Object.freeze([...CYCLE,...CYCLE]);
  const DURER=Object.freeze([[16,3,2,13],[5,10,11,8],[9,6,7,12],[4,15,14,1]].map(Object.freeze));
  const KHAJURAHO=Object.freeze([[7,12,1,14],[2,13,8,11],[16,3,10,5],[9,6,15,4]].map(Object.freeze));
  const BAND=0.456,OFFSET=0.400,PILLAR_DISPLAY=BAND+OFFSET,PILLAR_EXACT=6/7;
  const edgeSums=cycle=>cycle.map((v,i)=>v+cycle[(i+1)%cycle.length]);
  const gcd=(a,b)=>{let x=Math.abs(Math.trunc(a)),y=Math.abs(Math.trunc(b));while(y)[x,y]=[y,x%y];return x;};
  const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
  function squareLift(side){const n=Math.trunc(Number(side));if(n<2)throw new Error('square side must be at least two');return Object.freeze({from:n-1,to:n,previous:(n-1)**2,total:n**2,added:n**2-(n-1)**2,boundaryFormula:`${n}+${n}-1=${2*n-1}`});}
  function crtState(step=0){const t=((Math.trunc(Number(step))%308)+308)%308;return Object.freeze({step:t,mod7:t%7,mod11:t%11,mod77:t%77,tesa28:t%28,crtPeriod:77,tesaPeriod:28,jointReturn:lcm(77,28)});}
  function squareAudit(square){
    const rows=square.map(row=>row.reduce((a,b)=>a+b,0));
    const columns=square[0].map((_,c)=>square.reduce((sum,row)=>sum+row[c],0));
    const diagonals=[square.reduce((s,row,i)=>s+row[i],0),square.reduce((s,row,i)=>s+row[row.length-1-i],0)];
    const values=square.flat().slice().sort((a,b)=>a-b);
    return Object.freeze({rows,columns,diagonals,normal:values.every((v,i)=>v===i+1),magic:[...rows,...columns,...diagonals].every(v=>v===34)});
  }
  function pascalBridge(){
    const left=Array.from({length:11},(_,i)=>`e${i}`),right=Array.from({length:11},(_,i)=>`~e${i}`);
    const complementPairs=left.map((source,i)=>Object.freeze({source,target:right[i],index:i}));
    return Object.freeze({left,right,orderedPairs:left.length*right.length,complementPairs,residualPairs:left.length*right.length-complementPairs.length,status:'W1_X_W10_TYPED_COMPLEMENT_BRIDGE'});
  }
  function receipt(mode='DOUBLE 6'){
    return Object.freeze({mode:String(mode).toUpperCase(),cycle:CYCLE,doubleCycle:DOUBLE_CYCLE,edgeSums:Object.freeze(edgeSums(CYCLE)),cycleSum:CYCLE.reduce((a,b)=>a+b,0),doubleSum:DOUBLE_CYCLE.reduce((a,b)=>a+b,0),pascal:pascalBridge(),plates:Object.freeze({durer:squareAudit(DURER),khajuraho:squareAudit(KHAJURAHO)}),pillar:Object.freeze({band:BAND,offset:OFFSET,display:PILLAR_DISPLAY,exact:PILLAR_EXACT,delta:PILLAR_EXACT-PILLAR_DISPLAY,status:'AFFINE_DISPLAY_COMPARATOR_NOT_SHARED_NORMALIZATION'}),squareLifts:Object.freeze([12,13,14,15].map(squareLift)),crt:Object.freeze({moduli:Object.freeze([7,11]),period:77,tesa28:4*7,jointReturn:lcm(77,28),status:'SYNCHRONIZED_FINITE_DISPLAY_CLOCKS_NOT_IDENTITY'}),typeBoundary:'MOD9_CYCLE_NOT_PASCAL_QUOTIENT_NOT_MAGIC_PLATE_NOT_TOTIENT_RATIO',graphDelta:Object.freeze({entities:0,relations:0,aliases:0})});
  }
  function verify(){
    const r=receipt(),p=r.pascal;
    const checks={cycle_exact:CYCLE.join(',')==='1,2,4,8,7,5',double_has_twelve:DOUBLE_CYCLE.length===12,double_repeats:DOUBLE_CYCLE.every((v,i)=>v===CYCLE[i%6]),edge_profile:r.edgeSums.join(',')==='3,6,12,15,12,6',cycle_sum:r.cycleSum===27,double_sum:r.doubleSum===54,w1_count:p.left.length===11,w10_count:p.right.length===11,ordered_pairs:p.orderedPairs===121,complement_pairs:p.complementPairs.length===11,residual_pairs:p.residualPairs===110,complements_indexed:p.complementPairs.every((pair,i)=>pair.index===i),durer_magic:r.plates.durer.magic&&r.plates.durer.normal,khajuraho_magic:r.plates.khajuraho.magic&&r.plates.khajuraho.normal,pillar_display:Math.abs(r.pillar.display-.856)<1e-12,pillar_exact:Math.abs(r.pillar.exact-6/7)<1e-12,pillar_delta:Math.abs(r.pillar.delta-.001142857142857112)<1e-12,square_121_to_144:squareLift(12).previous===121&&squareLift(12).total===144&&squareLift(12).added===23,square_144_to_169:squareLift(13).previous===144&&squareLift(13).total===169&&squareLift(13).added===25,square_196_to_225:squareLift(15).previous===196&&squareLift(15).total===225&&squareLift(15).added===29,crt_is_bijective:new Set(Array.from({length:77},(_,t)=>`${t%7}|${t%11}`)).size===77,tesa_is_28:4*7===28,joint_return:r.crt.jointReturn===308,graph_delta:Object.values(r.graphDelta).every(v=>v===0)};
    return Object.freeze({ok:Object.values(checks).every(Boolean),checks});
  }
  const point=(cx,cy,r,i,n)=>{const a=-Math.PI/2+2*Math.PI*i/n;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];};
  function cubeBackdrop(phase=0){
    const wobble=Math.sin(Number(phase)*Math.PI/28)*18,x=315+wobble,y=142,w=270,h=270,dx=74-wobble*.35,dy=-54;
    let grid='';for(let i=1;i<12;i++){const q=i/12;grid+=`<line x1="${x+w*q}" y1="${y}" x2="${x+w*q}" y2="${y+h}"/><line x1="${x}" y1="${y+h*q}" x2="${x+w}" y2="${y+h*q}"/>`;}
    return `<g class="tb-cube-backdrop"><rect x="${x}" y="${y}" width="${w}" height="${h}"/><rect x="${x+dx}" y="${y+dy}" width="${w}" height="${h}"/><line x1="${x}" y1="${y}" x2="${x+dx}" y2="${y+dy}"/><line x1="${x+w}" y1="${y}" x2="${x+w+dx}" y2="${y+dy}"/><line x1="${x}" y1="${y+h}" x2="${x+dx}" y2="${y+h+dy}"/><line x1="${x+w}" y1="${y+h}" x2="${x+w+dx}" y2="${y+h+dy}"/>${grid}</g>`;
  }
  function renderDouble(phase=0){
    const pts=DOUBLE_CYCLE.map((_,i)=>point(450,270,175,i,12));
    const path=pts.map(p=>p.map(v=>v.toFixed(2)).join(',')).join(' ')+' '+pts[0].map(v=>v.toFixed(2)).join(',');
    const active=Math.trunc(Number(phase))%12,nodes=pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="19" class="tb-node ${i===0||i===6?'is-seam':''} ${i===active?'is-active':''}"/><text x="${p[0]}" y="${p[1]+5}" class="tb-node-label" text-anchor="middle">${DOUBLE_CYCLE[i]}</text><text x="${p[0]}" y="${p[1]-29}" class="tb-mini" text-anchor="middle">${i}</text>`).join('');
    return `<text x="48" y="55" class="tb-kicker">MOD-9 DOUBLE COVER · 12 SLOTS</text><text x="48" y="92" class="tb-title">1→2→4→8→7→5 · ×2</text><polyline points="${path}" class="tb-cycle-path"/>${nodes}<text x="450" y="255" class="tb-big" text-anchor="middle">12</text><text x="450" y="285" class="tb-note" text-anchor="middle">two copies · no new residue cycle</text><text x="450" y="480" class="tb-warning" text-anchor="middle">edge sums: 3 · 6 · 12 · 15 · 12 · 6 · cycle Σ27 · double Σ54</text>`;
  }
  function renderPascal(phase=0){
    let arcs='',nodes='',cells='';
    const active=Math.trunc(Number(phase))%11;for(let i=0;i<11;i++){const y=115+i*31;nodes+=`<circle cx="170" cy="${y}" r="9" class="tb-left ${i===active?'is-active':''}"/><circle cx="730" cy="${y}" r="9" class="tb-right ${i===active?'is-active':''}"/><text x="145" y="${y+4}" class="tb-mini" text-anchor="end">e${i}</text><text x="755" y="${y+4}" class="tb-mini">~e${i}</text>`;arcs+=`<path d="M179 ${y} C330 ${70+i*8},570 ${70+i*8},721 ${y}" class="tb-arc ${i===active?'is-active':''}"/>`;}
    for(let r=0;r<11;r++)for(let c=0;c<11;c++)cells+=`<rect x="390" y="120" width="8" height="8" transform="translate(${c*10} ${r*10})" class="tb-pair-cell ${r===c?'is-match':''}"/>`;
    return `<text x="48" y="55" class="tb-kicker">PASCAL THREAD BRIDGE · SOURCE-BOUND BLOCK 2A</text><text x="48" y="92" class="tb-title">W1 × W10 = 121</text>${arcs}${nodes}<g>${cells}</g><text x="445" y="250" class="tb-value">11 × 11</text><text x="445" y="277" class="tb-note">11 complement pairs</text><text x="445" y="298" class="tb-note">110 residual pairs</text><text x="450" y="480" class="tb-warning" text-anchor="middle">the arcs are the canonical complement bridge · not all 121 ordered pairs</text>`;
  }
  function plate(x,y,title,square,cls){return `<text x="${x+120}" y="${y-24}" class="tb-value" text-anchor="middle">${title}</text>`+square.flatMap((row,r)=>row.map((v,c)=>`<rect x="${x+c*60}" y="${y+r*60}" width="56" height="56" rx="5" class="tb-plate-cell ${cls}"/><text x="${x+c*60+28}" y="${y+r*60+34}" class="tb-cell-label" text-anchor="middle">${v}</text>`)).join('');}
  function renderPlates(){return `<text x="48" y="55" class="tb-kicker">Q / D PLATES · EXISTING WORLD-CUBE CONTRACT</text><text x="48" y="92" class="tb-title">two 4×4 normal magic squares · Σ=34</text>${plate(120,160,'Q · DÜRER',DURER,'q')}${plate(540,160,'D · KHAJURAHO',KHAJURAHO,'d')}<text x="450" y="475" class="tb-warning" text-anchor="middle">same carrier values 1…16 and magic sum 34 · different placements · no identity merge</text>`;}
  function renderPillar(){
    const min=.40,max=.90,x=v=>100+(v-min)/(max-min)*700,marks=[['BAND_0.456',BAND,'band'],['+0.400 → 0.856',PILLAR_DISPLAY,'display'],['6/7 ≈ 0.857143',PILLAR_EXACT,'exact']];
    return `<text x="48" y="55" class="tb-kicker">PILLAR / N-BAND CONTROL · AFFINE DISPLAY COMPARATOR</text><text x="48" y="92" class="tb-title">T(x)=x+0.400</text><line x1="100" y1="290" x2="800" y2="290" class="tb-scale"/>${Array.from({length:6},(_,i)=>{const v=.4+i*.1;return `<line x1="${x(v)}" y1="278" x2="${x(v)}" y2="302" class="tb-tick"/><text x="${x(v)}" y="330" class="tb-mini" text-anchor="middle">${v.toFixed(1)}</text>`;}).join('')}${marks.map(([label,v,cls],i)=>`<circle cx="${x(v)}" cy="${220+i*55}" r="10" class="tb-pillar ${cls}"/><line x1="${x(v)}" y1="${230+i*55}" x2="${x(v)}" y2="290" class="tb-drop ${cls}"/><text x="${x(v)+(i?0:15)}" y="${195+i*55}" class="tb-value" text-anchor="${i?'middle':'start'}">${label}</text>`).join('')}<text x="450" y="415" class="tb-warning" text-anchor="middle">exact gap: 6/7 − 0.856 = ${(PILLAR_EXACT-PILLAR_DISPLAY).toFixed(9)}</text><text x="450" y="455" class="tb-note" text-anchor="middle">0.456 is a bound display node; +0.400 is not yet a shared physical normalization</text>`;
  }
  function renderSquareLift(phase=0){
    const side=11+(Math.floor(Number(phase)/10)%5),cell=18,x=315,y=145;let cells='';for(let r=0;r<side;r++)for(let c=0;c<side;c++)cells+=`<rect x="${x+c*cell}" y="${y+r*cell}" width="16" height="16" class="tb-lift-cell ${r===side-1||c===side-1?'is-shell':''}"/>`;const lift=side>11?squareLift(side):null;
    return `<text x="48" y="55" class="tb-kicker">SQUARE SHELL LIFT · ANIMATED CUBE FACE</text><text x="48" y="92" class="tb-title">${side}×${side} = ${side**2}</text>${cells}<text x="450" y="445" class="tb-warning" text-anchor="middle">${lift?`${lift.previous} + ${lift.added} = ${lift.total} · ${lift.boundaryFormula}`:'BASE 11² = 121'}</text><text x="450" y="478" class="tb-note" text-anchor="middle">new row + new column − shared corner · the 1 is counted once</text>`;
  }
  function renderCrt(phase=0){
    const s=crtState(phase),outer=Array.from({length:11},(_,i)=>point(450,275,175,i,11)),inner=Array.from({length:7},(_,i)=>point(450,275,112,i,7));
    const nodes11=outer.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="11" class="tb-crt11 ${i===s.mod11?'is-active':''}"/><text x="${p[0]}" y="${p[1]+4}" class="tb-mini" text-anchor="middle">${i}</text>`).join(''),nodes7=inner.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="12" class="tb-crt7 ${i===s.mod7?'is-active':''}"/><text x="${p[0]}" y="${p[1]+4}" class="tb-mini" text-anchor="middle">${i}</text>`).join('');
    return `<text x="48" y="55" class="tb-kicker">MOD 7 × MOD 11 · CRT ADDRESS · 4×7 SIDECAR</text><text x="48" y="92" class="tb-title">t=${s.step} · (${s.mod7}, ${s.mod11}) → ${s.mod77} mod 77</text>${nodes11}${nodes7}<line x1="450" y1="275" x2="${outer[s.mod11][0]}" y2="${outer[s.mod11][1]}" class="tb-crt-link"/><line x1="450" y1="275" x2="${inner[s.mod7][0]}" y2="${inner[s.mod7][1]}" class="tb-crt-link seven"/><text x="450" y="266" class="tb-big" text-anchor="middle">${s.mod77}</text><text x="450" y="300" class="tb-note" text-anchor="middle">TESA28 phase ${s.tesa28}</text><text x="450" y="480" class="tb-warning" text-anchor="middle">periods 77 and 28 · gcd=7 · joint return lcm=308</text>`;
  }
  function renderSvg(mode='DOUBLE 6',phase=0){const m=String(mode).toUpperCase(),body=m==='TB · W1×W10'?renderPascal(phase):m==='Q / D PLATES'?renderPlates():m==='PILLAR CONTROL'?renderPillar():m==='SQUARE LIFT'?renderSquareLift(phase):m==='MOD 7 × MOD 11'?renderCrt(phase):renderDouble(phase);return `<svg viewBox="0 0 900 520" role="img" aria-label="Mod nine double cover and Pascal thread bridge"><rect x="20" y="20" width="860" height="480" rx="22" class="tb-frame"/>${cubeBackdrop(phase)}${body}</svg>`;}
  function mount(doc){const host=doc&&doc.getElementById('mod9-pascal-thread-bridge');if(!host)return null;const svg=doc.getElementById('tbSvg'),status=doc.getElementById('tbStatus');let mode='DOUBLE 6',phase=0,timer=null;function render(){svg.innerHTML=renderSvg(mode,phase).replace(/^<svg[^>]*>|<\/svg>$/g,'');const crt=crtState(phase);status.textContent=mode==='TB · W1×W10'?`ARC ${phase%11+1}/11 · 110 RESIDUAL`:mode==='PILLAR CONTROL'?'Δ = 0.001142857':mode==='MOD 7 × MOD 11'?`CRT ${crt.mod77}/77 · TESA ${crt.tesa28}/28`:mode==='SQUARE LIFT'?`SHELL ${11+(Math.floor(phase/10)%5)}²`:`${mode} · STEP ${phase}`;doc.querySelectorAll('[data-tb-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tbMode===mode)));const play=doc.querySelector('[data-tb-action="play"]');if(play){play.textContent=timer?'HOLD':'PLAY';play.setAttribute('aria-pressed',String(Boolean(timer)));}}function stop(){if(timer){clearInterval(timer);timer=null;}}function play(){if(timer){stop();render();return;}timer=setInterval(()=>{phase=(phase+1)%308;render();},140);render();}doc.querySelectorAll('[data-tb-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.tbMode;render();}));doc.querySelectorAll('[data-tb-action]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.tbAction==='play')play();else{stop();phase=0;render();}}));render();return Object.freeze({render,stop,get state(){return Object.freeze({receipt:receipt(mode),phase,crt:crtState(phase),playing:Boolean(timer)});}});}
  return Object.freeze({CYCLE,DOUBLE_CYCLE,DURER,KHAJURAHO,BAND,OFFSET,PILLAR_DISPLAY,PILLAR_EXACT,edgeSums,gcd,lcm,squareLift,crtState,squareAudit,pascalBridge,receipt,verify,cubeBackdrop,renderSvg,mount});
});
