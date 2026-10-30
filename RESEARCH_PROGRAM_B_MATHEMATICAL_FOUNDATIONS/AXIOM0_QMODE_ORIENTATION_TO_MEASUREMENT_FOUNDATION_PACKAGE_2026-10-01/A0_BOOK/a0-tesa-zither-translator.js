(function(root,factory){
  const spin=typeof module==='object'&&module.exports?require('./a0-spin-to-bloom-measurement.js'):root?.A0SpinToBloomMeasurement;
  const api=factory(root?.A0TesaGridCandidate,spin);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0TesaZitherTranslator=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Tesa,Spin){
  'use strict';
  const TAU=2*Math.PI;
  const LETTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const PRIME_POSITIONS=new Set([2,3,5,7,11,13,17,19,23]);
  const GLYPH_ROLES=Object.freeze({
    G:'G7 · PRIME-POSITION',
    I:'F-IJ-01 · I-AXIS',
    J:'F-IJ-01 · J-AXIS',
    K:'K11 · PRIME-POSITION',
    U:'U21 · ILAU / BUDU ROLE FORK',
    X:'X24 · CROSSING_2D',
    D:'D4 · D1–D2 ENGINEERING COMPARATOR',
    M:'M13 · REGISTER FOLD',
    V:'V22 · FOLDED ADDRESS'
  });
  const SOURCE_COMPARATORS=Object.freeze({
    frames:Object.freeze({label:'FRAME STRINGS',values:'1031 · 1033 · 1035',boundary:'Quellmarker; keine Frequenz- oder Prime-Identität.'}),
    zither:Object.freeze({label:'ZITHER',values:'137 ↔ 163',boundary:'Owner-Comparator; kein akustisch kalibrierter Naturwert.'}),
    audio:Object.freeze({label:'AUDIO GATES',values:'424 · 432 · 440 Hz',boundary:'Referenzfrequenzen; nicht aus dem TESA-Record abgeleitet.'}),
    rosetta:Object.freeze({label:'ROSETTA',values:'97 ↔ 83 · 756',boundary:'Quellbeschriftung; kein gemeinsamer Generator behauptet.'}),
    lissajous:Object.freeze({label:'LISSAJOUS',values:'5:6 · 11 tips',boundary:'Bestehender synthetischer Return-Comparator.'})
  });
  const SOLFEGE=Object.freeze(['DO','RE','MI','FA','SOL','LA','SI']);
  const SIGNED_LANES=Object.freeze([1,-1,2,-2]);
  const DIATONIC_FIFTH_WALK=Object.freeze([0,4,1,5,2,6,3,0]);
  const MAJOR_SEMITONES=Object.freeze([0,2,4,5,7,9,11,12]);
  function isPrime(n){if(!Number.isInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;}
  function nthPrime(index){if(!Number.isInteger(index)||index<1)throw new RangeError('positive prime index required');let n=1,count=0;while(count<index){n++;if(isPrime(n))count++;}return n;}
  function glyphIndex(glyph){const value=LETTERS.indexOf(String(glyph).toUpperCase())+1;if(value<1)throw new RangeError('A..Z glyph required');return value;}
  function tesaCell(address){
    if(Tesa?.cell)return Tesa.cell(address);
    if(!Number.isInteger(address)||address<1||address>28)throw new RangeError('TESA address 1..28 required');
    return{address,row:Math.floor((address-1)/7),col:(address-1)%7};
  }
  function record(options={}){
    const glyph=String(options.glyph||'G').toUpperCase(),index=glyphIndex(glyph),lane=[1,-1,2,-2].includes(+options.lane)?+options.lane:1;
    const cell=tesaCell(index),ratio=Array.isArray(options.ratio)?options.ratio.map(Number):[5,6];
    if(ratio.length!==2||ratio.some(n=>!Number.isInteger(n)||n<1))throw new RangeError('positive integer ratio required');
    return Object.freeze({
      schema:'nexah.a0.tesa-glyph-zither-record/1',carrier:'TESA_DOCUMENTARY_GRID',address:index,row:cell.row+1,col:cell.col+1,
      glyph,a1z26:index,primePosition:PRIME_POSITIONS.has(index),primeLift:nthPrime(index),role:GLYPH_ROLES[glyph]||`${glyph}${index} · A1Z26`,
      lane,ratio:Object.freeze(ratio),mirror:Boolean(options.mirror),split:Boolean(options.split),mode:options.mode==='stax'?'STAX':'STIX',
      axis:glyph==='I'?'I':glyph==='J'?'J':glyph==='X'?'X_2D':'ADDRESS',
      boundary:'Glyph address, prime-position flag, prime-index lift, signed display lane and geometry role are separate typed fields.'
    });
  }
  function lissajousPoints(rec,samples=240){
    const [a,b]=rec.ratio,sign=Math.sign(rec.lane),harmonic=Math.abs(rec.lane),phase=sign*Math.PI/2;
    return Array.from({length:samples+1},(_,i)=>{const t=TAU*i/samples,x=Math.sin(a*t),base=Math.sin(b*t*harmonic+phase),y=(rec.mirror?-1:1)*base;return{x,y,t};});
  }
  function closureError(rec){const p=lissajousPoints(rec,720),a=p[0],b=p[p.length-1];return Math.hypot(a.x-b.x,a.y-b.y);}
  function acousticBridge(){
    if(!Spin?.stopinderDeflectionBridge||!Spin?.octaveSuccessorFifthsBridge)throw new Error('source-bound acoustic bridges required');
    const stopinder=Spin.stopinderDeflectionBridge(),octave=Spin.octaveSuccessorFifthsBridge(),base=stopinder.notes[0].frequency;
    const grid=SIGNED_LANES.flatMap((lane,row)=>SOLFEGE.map((note,col)=>{const source=stopinder.notes[col],step=stopinder.steps[col];return Object.freeze({address:row*7+col+1,row:row+1,col:col+1,lane,note,frequency:source.frequency,absoluteRatio:source.absoluteRatio,linearBandAngleDegrees:source.linearBandAngleDegrees,stopinderAfter:step?.stopinder??null,ratioAfter:step?.ratio??null});}));
    const octaveReturns=SIGNED_LANES.map((lane,row)=>Object.freeze({lane,fromAddress:row*7+7,toAddress:((row+1)%4)*7+1,wrapsGrid:row===3,from:'SI',to:'DO′',stopinder:stopinder.steps.at(-1).stopinder,ratio:stopinder.steps.at(-1).ratio}));
    const twelveTet=stopinder.notes.map((note,index)=>{const comparator=base*(2**(MAJOR_SEMITONES[index]/12)),cents=1200*Math.log2(note.frequency/comparator);return Object.freeze({note:note.note,sourceFrequency:note.frequency,comparatorFrequency:comparator,centsFromComparator:cents});});
    const repeatedRatioGaps=stopinder.steps.filter(step=>step.ratio==='16/15').map(step=>Object.freeze({from:step.from,to:step.to,stopinder:step.stopinder,ratio:step.ratio}));
    return Object.freeze({
      schema:'nexah.a0.tesa-acoustic-overlay/1',carrier:'TESA_DOCUMENTARY_GRID',sourceSchemas:Object.freeze([stopinder.schema,octave.schema]),grid:Object.freeze(grid),octaveReturns:Object.freeze(octaveReturns),diatonicFifths:Object.freeze({operator:'+4 mod 7 address walk',indices:DIATONIC_FIFTH_WALK,names:Object.freeze(DIATONIC_FIFTH_WALK.map(index=>SOLFEGE[index])),fullTwelveStepResidual:octave.fifthsWheel.returnResidual}),
      frequencyRail:Object.freeze(stopinder.notes.map(note=>note.frequency)),stopinders:Object.freeze(stopinder.steps.map(step=>step.stopinder)),ratioFamilies:stopinder.ratioFamilies,repeatedRatioGaps:Object.freeze(repeatedRatioGaps),twelveTet:Object.freeze(twelveTet),measuredInput:Object.freeze({available:false,status:'OPEN_MEASURED_INPUT'}),
      exact:Object.freeze({frequencySpan:stopinder.exactChecks.frequencySpan,stopinderSum:stopinder.exactChecks.stopinderSum,ratioProduct:stopinder.exactChecks.ratioProduct,octaveRatio:stopinder.exactChecks.octaveRatio}),
      identityReuse:Object.freeze(['NEXAH_AX0_QMODE_FOUNDATION_PACKAGE / A0_WERKBANK','ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC']),newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      boundary:'The 4×7 surface is an address overlay. Its four rows remain signed display lanes, not asserted physical octaves. The +4 mod 7 route is a diatonic address walk, not the full twelve-tone fifths circle. The integer frequency model is compared with 12-TET; no measured dataset is present.'
    });
  }
  function verifyAcoustic(){
    const a=acousticBridge();let checks=0;
    a.grid.forEach((cell,index)=>{if(cell.address!==index+1||cell.row!==Math.floor(index/7)+1||cell.col!==index%7+1)throw new Error('acoustic grid mapping');checks++;});
    a.octaveReturns.forEach((edge,index)=>{if(edge.fromAddress!==index*7+7||edge.toAddress!==((index+1)%4)*7+1||edge.ratio!=='16/15')throw new Error('octave fold');checks++;});
    if(a.frequencyRail.join(',')!=='24,27,30,32,36,40,45,48')throw new Error('frequency rail');checks++;
    if(a.stopinders.join(',')!=='3,3,2,4,4,5,3'||a.exact.stopinderSum!==24)throw new Error('stopinder closure');checks++;
    if(Math.abs(a.exact.ratioProduct-2)>1e-12||a.exact.octaveRatio!==2)throw new Error('ratio closure');checks++;
    if(a.repeatedRatioGaps.length!==2||a.repeatedRatioGaps[0].stopinder===a.repeatedRatioGaps[1].stopinder)throw new Error('typed gap match');checks++;
    if(new Set(a.diatonicFifths.indices.slice(0,-1)).size!==7||a.diatonicFifths.indices.at(-1)!==0)throw new Error('fifths address walk');checks++;
    if(a.diatonicFifths.fullTwelveStepResidual.exactReturn!==false||a.diatonicFifths.fullTwelveStepResidual.cents<23)throw new Error('fifths residual');checks++;
    if(a.measuredInput.available!==false||a.newCanonicalIds.length||a.relationChanges.length)throw new Error('authority boundary');checks++;
    return{status:'PASS',checks,boundary:a.boundary};
  }
  function verify(){
    const glyphs=['G','I','J','K','U','X','D','M','V'];let checks=0;
    for(const glyph of glyphs)for(const lane of [1,-1,2,-2])for(const mirror of [false,true]){
      const r=record({glyph,lane,mirror,split:true});
      if(r.address!==r.a1z26||r.row<1||r.row>4||r.col<1||r.col>7)throw new Error('address mapping');
      if(closureError(r)>1e-12)throw new Error('lissajous closure');checks++;
    }
    const i=record({glyph:'I'}),j=record({glyph:'J'}),x=record({glyph:'X'}),u=record({glyph:'U'});
    if(i.address!==9||j.address!==10||x.address!==24||u.address!==21)throw new Error('anchor address');
    if(record({glyph:'G'}).primeLift!==17||record({glyph:'K'}).primeLift!==31)throw new Error('prime lift');
    return{status:'PASS',checks:checks+6,boundary:'Deterministic address, prime-lift and display-closure checks only; no acoustic, physical or historical-generator claim.'};
  }
  const svg=(tag,attrs={})=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))node.setAttribute(k,String(v));return node;};
  function pathData(points,box){return points.map((p,i)=>`${i?'L':'M'}${(box.x+box.w*(p.x+1)/2).toFixed(2)},${(box.y+box.h*(1-(p.y+1)/2)).toFixed(2)}`).join('');}
  function renderTesa(stage,rec){
    stage.replaceChildren();
    for(let n=1;n<=28;n++){const c=tesaCell(n),g=svg('g',{transform:`translate(${18+c.col*42} ${18+c.row*42})`}),rect=svg('rect',{width:34,height:34,rx:5,class:n===rec.address?'active':''}),text=svg('text',{x:17,y:21,'text-anchor':'middle'});text.textContent=n;g.append(rect,text);stage.append(g);}
  }
  function renderStrings(stage,rec,phase=0){
    stage.replaceChildren();const lanes=[1,-1,2,-2],W=520,H=244;
    lanes.forEach((lane,row)=>{const y0=38+row*54,pts=[];for(let i=0;i<=160;i++){const x=20+i*(W-40)/160,y=y0+15*Math.sin(i/160*TAU*rec.ratio[0]+lane*phase);pts.push(`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`);}stage.append(svg('line',{x1:20,y1:y0,x2:W-20,y2:y0,class:'rail'}),svg('path',{d:pts.join(''),class:lane===rec.lane?'string active':'string'}));const label=svg('text',{x:24,y:y0-18});label.textContent=lane>0?`+${lane}`:`${lane}`;stage.append(label);});
  }
  function renderLissajous(stage,rec){const d=pathData(lissajousPoints(rec),{x:18,y:18,w:284,h:244});stage.querySelector('[data-lissajous-path]')?.setAttribute('d',d);stage.dataset.split=String(rec.split);stage.dataset.mirror=String(rec.mirror);}
  function renderAcoustic(stage,bridge,view){
    stage.replaceChildren();const cellW=116,cellH=52,x0=72,y0=46;
    for(const cell of bridge.grid){const x=x0+(cell.col-1)*cellW,y=y0+(cell.row-1)*cellH,g=svg('g',{class:`ac-cell ${view==='COMPARE'?'compare':''}`,transform:`translate(${x} ${y})`}),rect=svg('rect',{width:104,height:42,rx:5}),label=svg('text',{x:8,y:16,class:'note'}),detail=svg('text',{x:8,y:32,class:'detail'});label.textContent=`${cell.note} · ${cell.lane>0?'+':''}${cell.lane}`;const cmp=bridge.twelveTet[cell.col-1];detail.textContent=view==='COMPARE'?`${cmp.centsFromComparator>=0?'+':''}${cmp.centsFromComparator.toFixed(2)} ct`:view==='FIFTHS'?`C${cell.col} · ${cell.frequency}`:`${cell.frequency} · Δ${cell.stopinderAfter??'↺'} · ${cell.ratioAfter??'2'}`;g.append(rect,label,detail);stage.append(g);}
    if(view==='OCTAVE')for(const edge of bridge.octaveReturns){const row=SIGNED_LANES.indexOf(edge.lane),y=y0+row*cellH+21,nextY=y0+((row+1)%4)*cellH+21,d=edge.wrapsGrid?`M${x0+6*cellW+104} ${y} Q${x0+7*cellW+58} ${y+38} ${x0+52} ${nextY}`:`M${x0+6*cellW+104} ${y} Q${x0+7*cellW+44} ${y+28} ${x0+52} ${nextY}`;stage.append(svg('path',{d,class:'ac-route octave'}));}
    if(view==='FIFTHS'){const points=bridge.diatonicFifths.indices.map((col,index)=>({x:x0+col*cellW+52,y:y0+20+(index%2?11:-11)}));stage.append(svg('path',{d:points.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(''),class:'ac-route fifths'}));points.forEach((p,index)=>{const dot=svg('circle',{cx:p.x,cy:p.y,r:5,class:'ac-dot'}),n=svg('text',{x:p.x+7,y:p.y-7,class:'step'});n.textContent=index;stage.append(dot,n);});}
    const title=svg('text',{x:16,y:24,class:'view-title'});title.textContent=view==='OCTAVE'?'OCTAVE RAIL · SI→DO′ FOLDS TO NEXT DISPLAY LANE':view==='FIFTHS'?'+4 MOD 7 ADDRESS WALK · FULL 12-FIFTH RETURN REMAINS RESIDUAL':'INTEGER SOURCE MODEL ↔ 12-TET COMPARATOR · MEASURED INPUT OPEN';stage.append(title);
  }
  function mount(scope=document){
    const root=scope.getElementById?.('tesaZitherTranslator')||scope.querySelector?.('#tesaZitherTranslator');if(!root)return null;
    const glyph=root.querySelector('[data-tz-glyph]'),ratio=root.querySelector('[data-tz-ratio]'),mirror=root.querySelector('[data-tz-mirror]'),split=root.querySelector('[data-tz-split]'),out=root.querySelector('[data-tz-output]'),receipt=root.querySelector('[data-tz-receipt]'),tesa=root.querySelector('[data-tz-tesa]'),strings=root.querySelector('[data-tz-strings]'),liss=root.querySelector('[data-tz-lissajous]'),acousticStage=root.querySelector('[data-tz-acoustic]'),acousticOut=root.querySelector('[data-tz-acoustic-output]'),acoustic=acousticBridge();
    let lane=1,mode='stix',phase=0,timer=null,tour=0,acousticView='OCTAVE';
    const snapshot=()=>record({glyph:glyph.value,lane,mirror:mirror.checked,split:split.checked,mode,ratio:ratio.value.split(':').map(Number)});
    const paintAcoustic=()=>{renderAcoustic(acousticStage,acoustic,acousticView);root.querySelectorAll('[data-tz-acoustic-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tzAcousticView===acousticView)));acousticOut.textContent=acousticView==='OCTAVE'?`PASS · 24→48 · Δ 3·3·2·4·4·5·3 = ${acoustic.exact.stopinderSum} · ratios × ${acoustic.exact.ratioProduct}`:acousticView==='FIFTHS'?`PASS ADDRESS WALK · ${acoustic.diatonicFifths.names.join('→')} · full circle residual +${acoustic.diatonicFifths.fullTwelveStepResidual.cents.toFixed(2)} cent`:`PASS COMPARATOR · 16/15 occurs at MI→FA (Δ2) and SI→DO′ (Δ3) · same ratio class, unequal absolute gap · MEASURED INPUT OPEN`;};
    const paint=()=>{const r=snapshot();renderTesa(tesa,r);renderStrings(strings,r,phase);renderLissajous(liss,r);paintAcoustic();root.dataset.mode=mode;root.querySelectorAll('[data-tz-lane]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.tzLane===lane)));root.querySelectorAll('[data-tz-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tzMode===mode)));out.textContent=`${r.glyph}${r.a1z26} · TESA R${r.row}C${r.col} · ${r.primePosition?'PRIME POSITION':'COMPOSITE/UNIT POSITION'} · p${r.a1z26}=${r.primeLift} · ${r.role} · ${r.lane>0?'+':''}${r.lane} · ${r.ratio.join(':')} · closure ${closureError(r).toExponential(2)}`;return r;};
    const stop=()=>{if(timer!==null){cancelAnimationFrame(timer);timer=null;}root.querySelector('[data-tz-play]').textContent='ALLES STARTEN';};
    const tick=()=>{phase=(phase+.025)%TAU;renderStrings(strings,snapshot(),phase);timer=requestAnimationFrame(tick);};
    root.querySelectorAll('[data-tz-lane]').forEach(b=>b.addEventListener('click',()=>{lane=+b.dataset.tzLane;paint();}));
    root.querySelectorAll('[data-tz-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.tzMode;paint();}));
    [glyph,ratio,mirror,split].forEach(el=>el.addEventListener('change',paint));
    root.querySelector('[data-tz-play]').addEventListener('click',e=>{if(timer!==null){stop();return;}e.currentTarget.textContent='PAUSE';tick();});
    root.querySelector('[data-tz-step]').addEventListener('click',()=>{stop();phase=(phase+Math.PI/6)%TAU;paint();});
    root.querySelector('[data-tz-reset]').addEventListener('click',()=>{stop();phase=0;lane=1;mode='stix';glyph.value='G';ratio.value='5:6';mirror.checked=false;split.checked=false;paint();});
    root.querySelector('[data-tz-tour]').addEventListener('click',()=>{const steps=[['G',1,'stax'],['I',1,'stix'],['J',-1,'stix'],['U',2,'stax'],['X',-2,'stix']],[g,l,m]=steps[tour++%steps.length];glyph.value=g;lane=l;mode=m;split.checked=tour>2;paint();});
    root.querySelectorAll('[data-tz-source]').forEach(b=>b.addEventListener('click',()=>{const s=SOURCE_COMPARATORS[b.dataset.tzSource];receipt.textContent=`${s.label} · ${s.values} · ${s.boundary}`;}));
    root.querySelectorAll('[data-tz-acoustic-view]').forEach(b=>b.addEventListener('click',()=>{acousticView=b.dataset.tzAcousticView;paintAcoustic();}));
    root.querySelector('[data-tz-export]').addEventListener('click',()=>{const payload={...paint(),sourceComparators:SOURCE_COMPARATORS,acousticOverlay:acoustic,verification:verify(),acousticVerification:verifyAcoustic(),generatedAt:new Date().toISOString(),claimCeiling:'BOUNDED_DISPLAY_TRANSLATOR'};receipt.textContent=JSON.stringify(payload,null,2);});
    paint();return{snapshot,paint,stop};
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document));
  return Object.freeze({TAU,LETTERS,PRIME_POSITIONS,GLYPH_ROLES,SOURCE_COMPARATORS,SOLFEGE,SIGNED_LANES,DIATONIC_FIFTH_WALK,MAJOR_SEMITONES,isPrime,nthPrime,glyphIndex,tesaCell,record,lissajousPoints,closureError,acousticBridge,verifyAcoustic,verify,mount});
});
