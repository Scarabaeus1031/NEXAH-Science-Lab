/* A declared coordinate aperture over existing AM/VM/PM signals; no new clock. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0ShadowChamberModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function settings(options={}){const shape=options.shape??'rose',opening=options.opening??1;if(!['open','kite','square','rose'].includes(shape)||!Number.isFinite(opening)||opening<.4||opening>1.4)throw new RangeError('aperture shape or opening invalid');return{shape,opening};}
  function contains(point,options){const {shape,opening}=settings(options);if(!Array.isArray(point)||point.length!==2||!point.every(Number.isFinite))throw new TypeError('two finite coordinates');const[x,y]=point,epsilon=1e-12;
    if(shape==='open')return true;
    if(shape==='kite')return Math.abs(x)+Math.abs(y)<=opening+epsilon;
    if(shape==='square')return Math.max(Math.abs(x),Math.abs(y))<=.65*opening+epsilon;
    return Math.hypot(x,y)<=opening*(.72+.28*Math.cos(5*Math.atan2(x,-y)))+epsilon;
  }
  function boundary(options){const {shape,opening}=settings(options);if(shape==='open')return[];
    if(shape==='square')return[[-1,-1],[1,-1],[1,1],[-1,1]].map(p=>p.map(v=>v*.65*opening));
    if(shape==='kite')return[[0,-opening],[opening,0],[0,opening],[-opening,0]];
    return Array.from({length:241},(_,i)=>{const angle=i/240*2*Math.PI,r=opening*(.72+.28*Math.cos(5*angle));return[r*Math.sin(angle),-r*Math.cos(angle)];});
  }
  function observe(snapshot,options){const aperture=settings(options),signals=snapshot.signals;if(!Number.isFinite(snapshot.clock)||!Array.isArray(signals)||signals.length!==3||!signals.every(Number.isFinite))throw new TypeError('finite source time and three signals required');
    return{time:snapshot.clock,aperture,signals:signals.slice(),views:[[0,1],[1,2],[2,0]].map((pair,i)=>{const sourcePoint=pair.map(k=>signals[k]),platePoint=sourcePoint.map(v=>v/Math.sqrt(2));return{plane:['AM','VM','PM'][i],sourcePoint,platePoint,admitted:contains(platePoint,aperture)};}),rules:{normalization:'(x,y)/sqrt(2)',kite:'abs(x)+abs(y)<=opening',square:'max(abs(x),abs(y))<=0.65*opening',rose:'rho<=opening*(0.72+0.28*cos(5*theta)); theta=atan2(x,-y)',plate:'shared normalized coordinates, vertically compressed for display; overlay is not signal addition'},boundary:'Five-lobed rose is a declared example mask, not a recovered historical generator or optical simulation'};
  }
  function sequence(state,family='linear'){
    if(!['linear','dyadic'].includes(family))throw new RangeError('sequence linear or dyadic');
    const[a,b]=String(state.ratio).split(':').map(Number),delta=Number(state.phaseDegrees)*Math.PI/180;
    if(![a,b,delta].every(Number.isFinite)||a<=0||b<=0)throw new TypeError('finite source ratio and phase');
    const steps=Array.from({length:10},(_,index)=>{const n=family==='linear'?index+1:index,factor=family==='linear'?n:2**n,time=factor*Math.PI;
      return{index,n,factor,time,label:family==='linear'?`${n}π`:`2^${n}π = ${factor}π`,signals:[Math.sin(a*time),Math.sin(b*time+delta),Math.sin(time+delta/2)]};});
    steps.forEach((step,index)=>{step.sameSignalAs=steps.slice(0,index).filter(other=>other.signals.every((v,i)=>Math.abs(v-step.signals[i])<=1e-10)).map(other=>other.index);});
    return{family,parameters:{a,b,phaseDegrees:Number(state.phaseDegrees)},steps,rule:'Evaluate the existing three analytic signals at t_n=factor*pi; source-time units, not seconds. Steps are reference samples, not recursive generations.',tolerance:1e-10};
  }
  function rotate(point,degrees){const a=degrees*Math.PI/180;return[point[0]*Math.cos(a)-point[1]*Math.sin(a),point[0]*Math.sin(a)+point[1]*Math.cos(a)];}
  function reading(mode='off',degrees=45){
    if(!['off','cross','rotate','overlay','arc','sector','complement'].includes(mode)||!Number.isFinite(degrees)||degrees<0||degrees>45)throw new RangeError('reading mode or rotation');
    const angle=mode==='rotate'?degrees:0,eight=mode==='overlay'||mode==='arc',rays=mode==='off'?[]:Array.from({length:eight?8:4},(_,i)=>rotate([1.4,0],i*(eight?45:90)));
    const sector=mode==='sector'||mode==='complement'?[[0,0],...Array.from({length:mode==='sector'?7:355},(_,i)=>rotate([1.4,0],mode==='sector'?i:i+6)),[0,0]]:[];
    return{mode,angleDegrees:angle,rays,sector,sectorWidthDegrees:6,rule:'Display rotation before plate compression; source signals, phase and aperture admission unchanged. Sector/complement: declared 6-degree illustration, not a historical generator or Mobius identification.'};
  }
  return{settings,contains,boundary,observe,sequence,rotate,reading};
});
(() => {
  if(typeof window==='undefined')return;
  const $=id=>document.getElementById(id),host=$('shadowChamberInstrument'),model=window.A0ShadowChamberModel,view=window.A0ThreeLissajousPlanesView;
  if(!host||!model||!view)return;
  const svg=$('shadowChamberSvg'),ns='http://www.w3.org/2000/svg',colors=['#e5b340','#29c7ef','#ee6ca5'];let history=[],lastTime=-Infinity,lastDraw=-Infinity,key='',readingAngle=45;
  const reading=()=>model.reading($('chamberReading')?.value||'off',readingAngle);
  const options=()=>({shape:$('chamberShape').value,opening:Number($('chamberOpening').value)});
  const explanation=()=>{const mode=$('chamberSequence')?.value||'live';if(mode==='live')return null;const seq=model.sequence(view.state,mode),index=Math.max(0,Math.min(9,Number($('chamberStep').value)));return{...seq,index,selected:seq.steps[index]};};
  const add=(tag,attrs,text)=>{const el=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;svg.appendChild(el);return el;};
  const pos=(p,plate=false)=>{const q=model.rotate(p,$('chamberReading')?.value==='rotate'?readingAngle:0);return[(plate?650:210)+q[0]*95,170+q[1]*(plate?48:95)];};
  const path=(points,plate=false)=>points.map((p,i)=>`${i?'L':'M'}${pos(p,plate).join(',')}`).join(' ');
  function linkedReading(){const seq=explanation();return{current:model.observe(view.snapshot,options()),reading:reading(),reference:seq?{label:seq.selected.label,observation:model.observe({clock:seq.selected.time,signals:seq.selected.signals},options())}:null};}
  function snapshot(){const source=view.snapshot,seq=explanation();return{kind:'SHADOW_CHAMBER_COORDINATE_APERTURE',reading:reading(),sourceState:JSON.parse(JSON.stringify(view.state)),current:model.observe(source,options()),explanation:seq?{...seq,displayed:model.observe({clock:seq.selected.time,signals:seq.selected.signals},options())}:null,history:history.map(s=>({time:s.clock,signals:s.signals.slice(),views:model.observe(s,options()).views})),historyScope:'Last 2pi source-time units, at most 600 samples; masks re-evaluate retained raw source samples; reference sequence is separate from live history'};}
  function draw(source){const seq=explanation(),shown=seq?{clock:seq.selected.time,signals:seq.selected.signals}:source,current=model.observe(shown,options()),outline=model.boundary(current.aperture);svg.replaceChildren();
    for(const[plate,title]of [[false,seq?'REFERENZPUNKTE → APERTUR':'QUELLE → APERTUR'],[true,seq?'ERKLÄRTELLER · SHARED OVERLAY':'BEOBACHTUNGSTELLER · SHADOW CHAMBER']]){
      const center=pos([0,0],plate);add('text',{x:center[0],y:30,fill:'#dff2f7','text-anchor':'middle','font-size':13},title);
      add('ellipse',{cx:center[0],cy:center[1],rx:145,ry:plate?72:145,fill:'#03111b',stroke:'#315364'});
      const frame=reading();
      if(frame.mode==='off'){add('line',{x1:center[0]-145,y1:center[1],x2:center[0]+145,y2:center[1],stroke:'#294b5b'});add('line',{x1:center[0],y1:center[1]-(plate?72:145),x2:center[0],y2:center[1]+(plate?72:145),stroke:'#294b5b'});}
      if(frame.sector.length)add('path',{d:path(frame.sector,plate)+' Z',fill:'#ffda21',opacity:.55,'data-role':'reading-sector'});
      frame.rays.forEach((ray,i)=>{const end=pos(ray,plate);add('line',{x1:center[0],y1:center[1],x2:end[0],y2:end[1],stroke:'#ffffff',opacity:frame.rays.length===8&&i%2?.45:.85,'stroke-width':1.2,'data-role':'reading-ray'});});
      if(outline.length)add('path',{d:path(outline,plate)+' Z',fill:'none',stroke:'#bca7dd','stroke-width':2,'data-role':plate?'plate-aperture':'source-aperture'});
    }
    add('text',{x:430,y:172,fill:'#e5b340','text-anchor':'middle','font-size':24},'→');
    const selected=window.A0FlowGrid?.selection;
    if(selected)for(const plate of [false,true]){add('path',{d:path(selected.corners,plate)+' Z',fill:'none',stroke:'#fff','stroke-width':2,'stroke-dasharray':'2 2','data-role':'shared-grid-selection'});const p=pos(selected.center,plate);add('circle',{cx:p[0],cy:p[1],r:9,fill:'none',stroke:'#fff','stroke-width':1,'stroke-dasharray':'2 3','data-role':'shared-grid-locator'});add('text',{x:plate?495:55,y:310,fill:'#fff','font-size':10},`Grid ${selected.np};${selected.rr} · ${selected.sourceMode==='live'?'Live':'Ref'} t=${selected.time.toFixed(3)} · Auswahl`);}
    const samples=(seq?seq.steps.slice(0,seq.index+1).map(s=>({clock:s.time,signals:s.signals})):history).map(s=>model.observe(s,current.aperture));
    current.views.forEach((point,i)=>{
      if(samples.length>1){add('path',{d:path(samples.map(s=>s.views[i].platePoint)),fill:'none',stroke:colors[i],opacity:.22,'stroke-width':1,'stroke-dasharray':seq?'3 4':''});let d='',continuing=false;for(const s of samples){const p=s.views[i];if(p.admitted){d+=`${continuing?'L':'M'}${pos(p.platePoint,true).join(',')} `;continuing=true;}else continuing=false;}if(d)add('path',{d,fill:'none',stroke:colors[i],opacity:.8,'stroke-width':1.7,'stroke-dasharray':seq?'3 4':'','data-role':'admitted-trace'});}
      if(seq)samples.forEach((s,index)=>{const p=s.views[i];for(const plate of [false,true]){if(plate&&!p.admitted)continue;const at=pos(p.platePoint,plate);add('circle',{cx:at[0],cy:at[1],r:2.5,fill:colors[i],opacity:.3+index/20,'data-role':'sequence-reference'});}});
      const p=pos(point.platePoint);add('circle',{cx:p[0],cy:p[1],r:6,fill:point.admitted?colors[i]:'none',stroke:colors[i],'stroke-width':2,'data-role':point.admitted?'passed-source':'blocked-source'});
      if(point.admitted){const out=pos(point.platePoint,true);add('circle',{cx:out[0],cy:out[1],r:6,fill:colors[i],'data-role':'admitted-point'});}
    });
    for(let i=0;i<3;i++){const next=(i+1)%3;for(const plate of [false,true]){if(plate&&(!current.views[i].admitted||!current.views[next].admitted))continue;const a=pos(current.views[i].platePoint,plate),b=pos(current.views[next].platePoint,plate);add('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'#dff2f7','stroke-width':1,opacity:.5,'stroke-dasharray':'3 4','data-role':'shared-relation'});}}
    add('text',{x:450,y:330,fill:'#9dbac7','text-anchor':'middle','font-size':12},seq?`${seq.selected.label} · Schritt ${seq.index+1}/10 · gestrichelt: Lesepunkt-Verbindungen, keine Zwischenbahn`:'Gold AM · Cyan VM · Pink PM | links volle Quellspur, rechts nur durchgelassene Abschnitte');
    $('chamberOpeningOut').textContent=current.aperture.opening.toFixed(2)+'×';
    $('chamberStatus').textContent=`${seq?`Erklärteller ${seq.selected.label} · Referenz-t=${shown.clock.toFixed(3)} · Live-t=${source.clock.toFixed(3)} bleibt separat`: `Live-t=${source.clock.toFixed(3)}`} · ${current.views.map(p=>`${p.plane}: ${p.admitted?'durchgelassen':'verdeckt'}`).join(' · ')} · ${history.length} Live-Quellsamples. Überlagerung ≠ Addition. Rose = Beispielmaske; keine eigene Dreh-Uhr.`;
    if($('chamberSequenceReadout'))$('chamberSequenceReadout').textContent=seq?`${seq.rule} ${seq.selected.sameSignalAs.length?`Gleiche drei Signale wie in Schritten ${seq.selected.sameSignalAs.map(i=>i+1).join(', ')} (Toleranz 10⁻¹⁰).`:'Kein früherer identischer Signalstand in dieser Folge.'} Für ganzzahlige Frequenzen fallen viele π-Lesepunkte zusammen; das wird nicht künstlich auseinandergezogen.`:'Live-Verlauf: bisherige begrenzte Zeitspur. Für nπ oder 2ⁿπ eine Referenzfolge wählen; die Auswahl verändert weder Quelle noch Live-Uhr.';
    if($('chamberStepOut'))$('chamberStepOut').textContent=seq?`${seq.index+1}/10 · ${seq.selected.label}`:'Live';
    if($('chamberStep'))$('chamberStep').disabled=!seq;
    if($('chamberPrevious'))$('chamberPrevious').disabled=!seq||seq.index===0;
    if($('chamberNext'))$('chamberNext').disabled=!seq||seq.index===9;
    $('chamberPlay').textContent=view.state.playing?'Gemeinsamen Zeitlauf pausieren':'Gemeinsamen Zeitlauf starten';
    window.A0OneFlow?.refreshProjection?.();
    window.A0FlowGrid?.refresh?.();
    if($('chamberReadingStatus')){const frame=reading();$('chamberReadingStatus').textContent=`Leselage: ${frame.mode} · Raumdrehung ${frame.angleDegrees.toFixed(1)}° · Signalphase δ=${view.state.phaseDegrees}° bleibt unabhängig. ${frame.sector.length?'Gelb: Sektor 6° bzw. Gegenbild 354°; reine Illustration, kein zusätzlicher Aperturfilter. ':''}${frame.mode==='arc'?'Gestrichelte Punktverbindungen sind Geraden zwischen aktuellen AM/VM/PM-Punkten, kein rekonstruierter historischer Arc. ':''}Kein Möbiusband: eine 45°-Drehung erzeugt keine Bandverdrehung.`;}
  }
  function update(source,force=false){
    const nextKey=view.state.ratio+':'+view.state.phaseDegrees;if(key!==nextKey||source.clock<lastTime){history=[];lastTime=-Infinity;lastDraw=-Infinity;key=nextKey;}
    if(source.clock-lastTime>=.025){history.push({clock:source.clock,signals:source.signals.slice()});history=history.filter(s=>source.clock-s.clock<=2*Math.PI).slice(-600);lastTime=source.clock;}
    if(force||source.clock-lastDraw>=.05||(!view.state.playing&&source.clock!==lastDraw)){draw(source);lastDraw=source.clock;}
  }
  $('chamberShape').addEventListener('change',()=>draw(view.snapshot));$('chamberOpening').addEventListener('input',()=>draw(view.snapshot));
  $('chamberPlay').addEventListener('click',()=>{view.setPlaying(!view.state.playing);draw(view.snapshot);});
  $('chamberClear').addEventListener('click',()=>{history=[];lastTime=view.snapshot.clock;draw(view.snapshot);});
  $('chamberReturn').addEventListener('click',()=>window.A0RootRoomPhaseBridge.select('RETURN'));
  $('chamberSequence')?.addEventListener('change',()=>{$('chamberStep').value='0';draw(view.snapshot);});
  $('chamberStep')?.addEventListener('input',()=>draw(view.snapshot));
  $('chamberReading')?.addEventListener('change',()=>{readingAngle=45;draw(view.snapshot);});
  for(const[id,delta]of [['chamberPrevious',-1],['chamberNext',1]])$(id)?.addEventListener('click',()=>{$('chamberStep').value=String(Math.max(0,Math.min(9,Number($('chamberStep').value)+delta)));draw(view.snapshot);});
  window.addEventListener('a0-lissajous-frame',event=>update(event.detail));
  window.A0ShadowChamber={refresh:()=>draw(view.snapshot),setReading(mode,degrees=45){model.reading(mode,degrees);if($('chamberReading'))$('chamberReading').value=mode;readingAngle=degrees;draw(view.snapshot);},get reading(){return linkedReading();},get snapshot(){return snapshot();},get explanation(){const seq=explanation();return seq?JSON.parse(JSON.stringify(seq)):null;}};update(view.snapshot,true);
})();
