/* Human-started conductor driven by the existing signal frames, not another engine. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0EnjoyLoopModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const stages=[
    {title:'Vier Körper / Zell-Return',content:'cell',shape:'open',ratio:'3:2',cells:true,c:[-.25,.35],target:'cells'},
    {title:'60 Adressen / Zellregister',content:'cell',shape:'open',ratio:'3:2',cells:true,c:[-.25,.35],target:'cellGroups'},
    {title:'Vier Wege / gemeinsamer Pivot',content:'cell',shape:'open',ratio:'3:2',cells:true,c:[-.25,.35],target:'cellPivotWiring'},
    {title:'Atmende Fin / beweglicher Ausschnitt',content:'mandelbrot',shape:'rose',ratio:'3:2',c:[-.1087,0],target:'breathingFinControls'},
    {title:'Mandelbrot in der Zunge',content:'mandelbrot',shape:'rose',ratio:'3:2',c:[-.1087,0],target:'formation'},
    {title:'Goldene Flamme / Atem',content:'flame',shape:'rose',ratio:'3:2',c:[-.35,.12],target:'formation'},
    {title:'Critical Orbit / Gegenfenster zur Flamme',content:'mandelbrot',shape:'rose',ratio:'3:2',c:[-.4,.55],target:'orbitCanvas'},
    {title:'Root Room / AM · goldener Ring',note:'AM liest (s₁,s₂). Der Ringmarker und sein Achsenschatten teilen denselben Zeitpunkt.',rootPhase:'AM',phase:90,content:'overlay',shape:'rose',ratio:'3:2',c:[-.1087,0],target:'rootRoomLocalModes'},
    {title:'Root Room / VM · cyanfarbener Ring',note:'VM liest (s₂,s₃). Alle drei Marker laufen weiter; Cyan ist die gewählte Lesart.',rootPhase:'VM',phase:150,content:'overlay',shape:'rose',ratio:'2:3',c:[-.2,.25],target:'rootRoomLocalModes'},
    {title:'Root Room / PM · violetter Ring',note:'PM liest (s₃,s₁). Φ / π / √2 sind Ansichtsregister, keine Frequenzvorgaben.',rootPhase:'PM',phase:240,content:'overlay',shape:'rose',ratio:'5:6',c:[-.35,-.2],target:'rootRoomLocalModes'},
    ...[['cross','Weißes Kreuz'],['rotate','Raumdrehung 0° → 45°'],['overlay','Kreuz + Diagonalen / acht Strahlen'],['arc','Arc / aktuelle Punktbeziehungen'],['sector','Gelber Sektor / 6°'],['complement','Gegenbild / 354°']].map(([reading,title])=>({title,reading,content:'overlay',shape:'open',ratio:'3:2',phase:90,c:[-.1087,0],target:'shadowChamberInstrument',note:'Raumdrehung ≠ Signalphase ≠ Möbius-Verdrehung. Historische Bilder sind Inspiration, keine rekonstruierte Dynamik.'})),
    {title:'Kite / Öffnung',content:'overlay',shape:'kite',ratio:'2:3',c:[-.74,.12],target:'shadowChamberInstrument'},
    {title:'Quadrat / Shared Overlay',content:'overlay',shape:'square',ratio:'1:1',c:[.26,0],target:'shadowChamberInstrument'},
    {title:'nπ / Erklärteller',content:'pi',shape:'rose',ratio:'3:2',sequence:'linear',c:[-.1087,0],target:'shadowChamberInstrument'},
    {title:'2ⁿπ / bis 512π',content:'pi',shape:'rose',ratio:'5:6',sequence:'dyadic',c:[.2773,.4587],target:'shadowChamberInstrument'},
    ...[['tesa','still','TESA / ruhiges Referenzraster'],['tesa','drift','TESA / langsamer Drift'],['tesa','wobble','TESA / kleines Beben'],['tesa','opacity','TESA / sanfte Transparenz'],['tesa','combined','TESA / gemeinsame Überlagerungen'],['eight','combined','8 ị 8 / zwei Achterregister und Verschlusszone']].map(([registerMode,registerEffect,title])=>({title,registerMode,registerEffect,content:'overlay',shape:'open',ratio:'3:2',c:[-.1087,0],target:'registerOverlay',note:'Grau bleibt Referenz. Goldene ị-Zone = geometrische Überlagerung, keine Adressverschmelzung.'})),
    ...[['contact','Tip / CONTACT am Referenzoval'],['shells','Drei Schalen / ein Pivot'],['plates','Gegenüberliegende Teller / Sanduhr / ị'],['orbit','Critical Orbit / vorhandene Bahn in der Fin'],['mobius','Möbiusband / halbe Verdrehung und Naht'],['tesa','Quellpunkte → TESA / erklärte Adressregel']].map(([flow,title])=>({title,flow,content:flow==='orbit'?'orbit':'overlay',shape:'open',ratio:'3:2',phase:90,c:[-.1087,0],target:'oneFlow',note:'Ein Flow: Geometrie und Beispieladressierung bleiben von Quellwerten und physikalischen Aussagen getrennt.'})),
    ...[['mobius-out','Möbius-Threeshot / drei Hinweg-Lesarten'],['mobius-return','Möbius-Threeshot / drei Rückweg-Lesarten'],['mobius-paired','2×3 Möbius / drei verbundene Rollenpaare']].map(([flow,title])=>({title,flow,content:'overlay',shape:'open',ratio:'3:2',phase:90,c:[-.1087,0],target:'oneFlow',note:'Drei Hinweg- und drei Rückweg-Bandansichten; Boundary separat. Richtungswechsel ist keine Zeitumkehr.'})),
    {title:'Drei Lissajous-Ebenen / gemeinsamer Zeitpunkt',content:'overlay',shape:'open',ratio:'3:2',phase:90,c:[-.1087,0],target:'threeLissajousPlanes'},
    {title:'Schatten-Tracker / Ausschlag und Verhältnis',content:'overlay',shape:'open',ratio:'3:2',c:[-.1087,0],target:'shadowDisplacementTracker'},
    {title:'Display-Zyklus / Rückbindung und Grenzen',note:'Diese Übersicht erklärt den Display-Zyklus; sie ist kein weiterer animierter Mechanismus.',content:'cell',shape:'open',ratio:'3:2',c:[-.25,.35],target:'activationSequence'}
  ];
  const stageDuration=8,cycleDuration=stageDuration*stages.length;
  function position(elapsed){if(!Number.isFinite(elapsed)||elapsed<0)throw new RangeError('nonnegative source elapsed time');const index=Math.floor(elapsed/stageDuration)%stages.length,u=(elapsed%stageDuration)/stageDuration,stage=stages[index],next=stages[(index+1)%stages.length],blend=(1-Math.cos(Math.PI*u))/2;return{index,cycle:Math.floor(elapsed/cycleDuration),u,stage,c:stage.c.map((v,i)=>v+(next.c[i]-v)*blend),opening:.7+.5*(.5+.5*Math.sin(elapsed)),strength:.45+.4*(.5+.5*Math.sin(elapsed*.5)),iterations:60+10*Math.floor(4*u),step:Math.min(9,Math.floor(u*10)),selected:Math.min(59,Math.floor(u*64)),fill:Math.min(60,Math.floor(u*64))};}
  function delta(previous,current){if(![previous,current].every(Number.isFinite))return 0;return current>=previous?current-previous:current-previous+2*Math.PI;}
  return{stages,stageDuration,cycleDuration,position,delta};
});
(() => {
  if(typeof window==='undefined')return;
  const $=id=>document.getElementById(id),host=$('enjoyLoopControls'),view=window.A0ThreeLissajousPlanesView,body=window.A0BluePinkDodecaCellReturnView,model=window.A0EnjoyLoopModel;
  if(!host||!view||!body||!model)return;
  let running=false,elapsed=0,previous=view.snapshot.clock,lastStage=-1,lastPose=-Infinity,lastFractal=-Infinity,lastDemoCell=-1,applying=false,reason='Bereit · nur nach deinem Start',previousContent='mandelbrot';
  function set(id,value,event='change'){const el=$(id);if(!el)return;const next=String(value);if(el.type==='checkbox'){if(el.checked===Boolean(value))return;el.checked=Boolean(value);}else{if(el.value===next)return;el.value=next;}el.dispatchEvent(new Event(event,{bubbles:true}));}
  function snapshot(){return{kind:'HUMAN_STARTED_EXISTING_VIEW_CONDUCTOR',running,elapsed,position:model.position(elapsed),reason,clock:'Existing a0-lissajous-frame source clock; no independent playback timer',boundary:'Demonstration schedule changes declared view settings and c; not a physical coupling or new generation rule'};}
  function status(){const p=model.position(elapsed);$('enjoyLoopToggle').textContent=running?'Vorführung pausieren':'Genießen · Loop starten';$('enjoyLoopToggle').setAttribute('aria-pressed',String(running));$('enjoyLoopStatus').textContent=`${running?'LÄUFT':'PAUSE'} · ${p.index+1}/${model.stages.length} ${p.stage.title} · Runde ${p.cycle+1} · ${running&&p.stage.note?p.stage.note:reason}`;$('enjoyLoopFlame').checked=$('breathingFinContent')?.value==='flame';}
  function stop(why='Von dir pausiert'){if(!running)return;running=false;reason=why;view.setPlaying(false);body.pauseFill();body.setMotionPaused(true);view.refresh?.();status();}
  function apply(force=false){
    if(applying)return;applying=true;
    try{const p=model.position(elapsed),entry=force||p.index!==lastStage;
      if(entry){lastStage=p.index;view.setRatio(p.stage.ratio);set('breathingFinEnabled',true);set('breathingFinContent',p.stage.content);set('chamberShape',p.stage.shape);set('chamberSequence',p.stage.sequence??'live');
        window.A0ShadowChamber?.setReading(p.stage.reading??'off',p.stage.reading==='rotate'?Math.min(1,p.u*1.1)*45:45);
        if(p.stage.registerMode)window.A0RegisterOverlay?.configure(p.stage.registerMode,p.stage.registerEffect);
        if(p.stage.flow)window.A0OneFlow?.configure(p.stage.flow);
        window.A0RootRoomPhaseBridge?.select(p.stage.rootPhase??'AM');
        if(!p.stage.rootPhase)view.setFocus('ALL');
        if(p.stage.phase!==undefined)view.setPhase(p.stage.phase);
        if($('enjoyLoopFollow').checked&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const target=$(p.stage.target);if(target){target.style?.setProperty('scroll-margin-top',`${(host.offsetHeight||150)+16}px`);target.scrollIntoView({block:'start',behavior:'smooth'});}}
      }
      if(force||entry||elapsed-lastPose>=.12||(p.stage.cells&&lastDemoCell!==p.selected)){lastPose=elapsed;if(p.stage.cells)lastDemoCell=p.selected;set('breathingFinStrength',p.strength.toFixed(2),'input');set('chamberOpening',p.opening.toFixed(2),'input');if(p.stage.sequence)set('chamberStep',p.step,'input');
        if(p.stage.reading==='rotate')window.A0ShadowChamber?.setReading('rotate',Math.min(1,p.u*1.1)*45);
        if(p.stage.flow==='contact')window.A0OneFlow?.configure('contact',p.u<.4?1.08-p.u:p.u<.7?.68:.68-(p.u-.7)*.8);
        body.setDemoPose({yaw:.42+elapsed*.05,pitch:.34+.12*Math.sin(elapsed*.25),angle:42+10*Math.sin(elapsed*.2),breath:1,breathPhase:elapsed,...(p.stage.cells?{selected:p.selected,fill:p.fill}:{})});
      }
      if(force||elapsed-lastFractal>=.8){lastFractal=elapsed;window.A0FlameMandelbrotFormationView.setParameter(...p.c,p.iterations);}
      status();
    }finally{applying=false;}
  }
  function start(){window.A0CellReturnPerformance?.stop('Genießen übernimmt');previous=view.snapshot.clock;body.pauseFill();body.setMotionPaused(true);running=true;reason='Eingriff stoppt sofort · aktueller Stand bleibt';apply(true);view.setPlaying(true);status();}
  $('enjoyLoopToggle').addEventListener('click',()=>running?stop():start());
  $('enjoyLoopRestart').addEventListener('click',()=>{stop('Neustart');elapsed=0;lastStage=-1;lastPose=lastFractal=-Infinity;start();});
  $('enjoyLoopReturn').addEventListener('click',()=>{stop('Return gehalten');window.A0RootRoomPhaseBridge.select('RETURN');});
  $('enjoyLoopFlame').addEventListener('change',()=>{if($('enjoyLoopFlame').checked){previousContent=$('breathingFinContent').value;set('breathingFinContent','flame');set('breathingFinEnabled',true);}else set('breathingFinContent',previousContent==='flame'?'mandelbrot':previousContent);status();});
  for(const type of ['pointerdown','keydown','wheel','touchstart','input','change'])document.addEventListener(type,event=>{if(!running||applying||!event.isTrusted)return;if(event.target?.closest?.('#enjoyLoopToggle, #enjoyLoopRestart, #enjoyLoopReturn'))return;stop('Deine Interaktion · Handsteuerung übernommen');},{capture:true,passive:type==='wheel'||type==='touchstart'});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('Seite nicht sichtbar');});
  window.addEventListener('blur',()=>stop('Fenster- oder Frame-Fokus abgegeben'));
  window.addEventListener('a0-lissajous-frame',event=>{if(!running||applying)return;const current=event.detail.clock,dt=model.delta(previous,current);previous=current;elapsed+=Math.min(dt,.25);apply();});
  window.A0EnjoyLoop={start,stop,get snapshot(){return snapshot();}};status();
})();
