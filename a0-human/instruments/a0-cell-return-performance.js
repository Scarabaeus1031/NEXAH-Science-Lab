/* Source-frame partitur: ordinal co-reading, never a 60=48=1000000 identity. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./assets/a0-blue-body-interior-crt16-v1.js'):root.A0BlueBodyInteriorCRT16);if(typeof module==='object'&&module.exports)module.exports=api;root.A0CellReturnPerformanceModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(crt){
  const scenes=[['shells','AM','Drei Schalen / Day-Lesart'],['plates','AM','Gegenüberliegende Teller'],['mobius-out','VM','Drei Hinwege / Übergang'],['mobius-return','VM','Drei Rückwege / Übergang'],['mobius-paired','PM','2×3 Rollenpaare / Night-Lesart'],['tesa','PM','Return / Grid und TESA']];
  function pose(elapsed,beat=1,offset=0){if(!Number.isFinite(elapsed)||elapsed<0||!Number.isFinite(beat)||beat<.25||beat>3||!Number.isInteger(offset)||offset<0||offset>11)throw new RangeError('partitur parameters');const complete=elapsed>=60*beat,step=Math.min(59,Math.floor(elapsed/beat)),ordinal=Math.min(47,step),source=crt.bind(Math.floor(ordinal/16),ordinal%16),phase=(step+offset)%12,scene=Math.floor(step/10);return{step,fill:step+1,complete,scene,flow:scenes[scene][0],role:scenes[scene][1],title:scenes[scene][2],source,phase,returnOnly:step>=48,rule:'Declared ordinal co-reading: body steps 0..47 pair with CRT ordinals 0..47. Steps 48..59 retain CRT ordinal 47 while traversing twelve Return slots. No inverse geometry/address map. AM/PM Day/Night are reading labels, not a canonical view operator.'};}
  function delta(a,b){return b>=a?b-a:b-a+2*Math.PI;}
  return{pose,delta,scenes};
});
(()=>{
  if(typeof window==='undefined')return;
  const $=id=>document.getElementById(id),host=$('cellReturnPerformance'),model=window.A0CellReturnPerformanceModel,view=window.A0ThreeLissajousPlanesView,body=window.A0BluePinkDodecaCellReturnView;
  if(!host||!model||!view||!body||!window.A0BlueBodyInteriorCRT16)return;
  // Compact UI mounts the original source-owned renderer, not an iframe or copied algorithm.
  $('performanceInterior').innerHTML=`<div class="interior-toolbar"><label>CRT16 <output id="interiorChannelValue"></output><input id="interiorChannel" type="range" min="0" max="15" step="1" value="0"></label><label>Layer <output id="interiorLayerValue"></output><input id="interiorLayer" type="range" min="0" max="2" step="1" value="0"></label><label>Knoten-Dimmung <output id="interiorApertureValue"></output><input id="interiorAperture" type="range" min="0" max="1" step="0.05" value="0.25"></label><label>Schlieren <output id="interiorFieldValue"></output><input id="interiorFieldStrength" type="range" min="0" max="1" step="0.05" value="0.65"></label></div><nav><button id="interiorPhaseBack" type="button">−1/12</button><button id="interiorPhaseForward" type="button">+1/12</button><output id="interiorPhase"></output><button id="interiorPlay" type="button" hidden>Lokaler 48er-Lauf</button><label><input id="interiorWitness" type="checkbox" checked> Return witness</label><label><input id="interiorFieldLabels" type="checkbox"> Alle Nummern</label></nav><div class="interior-views">${['front','top','side','isometric'].map(v=>`<article><h4>${v.toUpperCase()}</h4><svg data-interior-view="${v}" viewBox="0 0 320 220" role="img" aria-label="CRT16 ${v} · dieselbe Quelladresse"></svg></article>`).join('')}</div><div id="interiorReadout"></div><div id="interiorReceipt"></div>`;
  const interior=window.A0BlueBodyInteriorCRT16.mount($('performanceInterior'));
  let running=false,elapsed=0,previous=view.snapshot.clock,lastStep=-1,offset=0,reason='Bereit · Start nur auf Klick',applying=false;
  const beat=()=>Number($('performanceBeat').value);
  const position=()=>model.pose(elapsed,beat(),offset);
  function snapshot(){return{kind:'CELL_RETURN_ORDINAL_PARTITUR',running,elapsed,beat:beat(),phaseOffset:offset,position:position(),body:JSON.parse(JSON.stringify(body.state??null)),interior:interior.snapshot,h7o8:window.A0H7O8Lens?.snapshot??null,reason,clock:'Existing a0-lissajous-frame only; no added interval',boundary:'Position describes scheduled co-reading; body/interior retain actual manually changed states when paused. H7/O8 ledger slots, 60 face slots, 48 CRT states, 28 TESA addresses and 1000x1000 grid remain distinct. Same-document instance only; no control of another tab. Body Player Day/Night/View-Mirror remains a separate instrument.'};}
  function status(){const p=position();$('performanceToggle').textContent=running?'Gemeinsam pausieren':'Play cell Return · gemeinsam';$('performanceToggle').setAttribute('aria-pressed',String(running));$('playFill').textContent=running?'Pause return · verschaltet':'Play cell return';$('performanceStatus').textContent=`${running?'LÄUFT':'PAUSE'} · ${p.step+1}/60 · ${p.title} · CRT ${p.source.sourceKey} · Phase ${p.phase}/12${p.returnOnly?' · Innenadresse gehalten, Return-Slot bewegt':''} · ${reason}`;}
  function stop(why='Von dir pausiert'){if(!running)return;running=false;reason=why;interior.stop();view.setPlaying(false);body.setMotionPaused(true);status();}
  function set(id,value,event='change'){const el=$(id);if(!el||el.value===String(value))return;el.value=String(value);el.dispatchEvent(new Event(event,{bubbles:true}));}
  function apply(){const p=position();if(p.step===lastStep)return;applying=true;try{
    const sceneChanged=lastStep<0||Math.floor(lastStep/10)!==p.scene;lastStep=p.step;
    window.A0H7O8Lens?.followStep(p.step);
    interior.configure({layer:p.source.layer,channel:p.source.channel,phase:p.phase});
    if(sceneChanged){window.A0OneFlow?.configure(p.flow);window.A0RootRoomPhaseBridge?.select(p.role);set('flowGridFollow',p.role);set('flowGridSource','live');set('chamberSequence','live');if($('performanceFollow')?.checked&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)$(p.scene===0?'cellReturnPerformance':p.scene===5?(window.A0H7O8Lens?.snapshot.following?'h7o8Lens':'flowGrid'):'oneFlow')?.scrollIntoView?.({block:'start',behavior:'smooth'});}
    if(p.step===48&&window.A0H7O8Lens?.snapshot.following&&$('performanceFollow')?.checked&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)$('h7o8Lens')?.scrollIntoView?.({block:'start',behavior:'smooth'});
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
    body.setDemoPose({selected:p.step,fill:p.fill,...(reduced?{}:{yaw:.42+elapsed*.018,pitch:.34+.1*Math.sin(elapsed*.13),breath:1,breathPhase:elapsed})});status();
  }finally{applying=false;}}
  function start(){if(running)return;window.A0EnjoyLoop?.stop('Cell-Return übernimmt');body.pauseFill();interior.stop();body.setMotionPaused(true);if(position().complete)elapsed=0;offset=(interior.snapshot.frame.phase-Math.floor(elapsed/beat())%12+12)%12;previous=view.snapshot.clock;lastStep=-1;running=true;reason='Gemeinsame Signalzeit · manuelle Eingriffe pausieren';apply();view.setPlaying(true);status();}
  function hold(){stop('Gemeinsamer Return gehalten');view.setPlaying(false);body.pauseFill();window.A0RootRoomPhaseBridge?.select('RETURN');}
  $('performanceToggle').addEventListener('click',()=>running?stop():start());
  $('performanceRestart').addEventListener('click',()=>{stop('Von vorn');elapsed=0;offset=0;interior.configure({layer:0,channel:0,phase:0});start();});
  $('performanceHold').addEventListener('click',hold);
  $('performanceBeat').addEventListener('change',()=>{stop('Tempo geändert · nächster Start beginnt vorne');elapsed=0;lastStep=-1;status();});
  $('performanceEnabled').addEventListener('change',()=>{if(!$('performanceEnabled').checked)stop('Einzelspieler gewählt');});
  $('playFill').addEventListener('click',event=>{if(!$('performanceEnabled').checked)return;event.stopImmediatePropagation();running?stop():start();},true);
  const transportSelector='#playFill,#performanceToggle,#performanceRestart,#performanceHold,#lissajousPlay';
  document.addEventListener('pointerdown',event=>{if(running&&!applying&&event.isTrusted&&!event.target?.closest?.(transportSelector))stop('Handsteuerung übernimmt');},{capture:true});
  for(const type of ['keydown','input','change','wheel','touchstart'])document.addEventListener(type,event=>{if(running&&!applying&&event.isTrusted&&!event.target?.closest?.(transportSelector))stop('Handsteuerung übernimmt');},{capture:true,passive:type==='wheel'||type==='touchstart'});
  $('lissajousPlay')?.addEventListener('click',()=>{if(running&&!view.state.playing)stop('Quelluhr pausiert');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('Seite verborgen');});window.addEventListener('blur',()=>stop('Fensterfokus abgegeben'));
  window.addEventListener('a0-lissajous-frame',event=>{if(!running||applying)return;if(!view.state.playing){stop('Quelluhr pausiert');return;}const t=event.detail.clock,dt=model.delta(previous,t);previous=t;if(dt>1){stop('Unterbrochener Zeitlauf · kein Nachholen');return;}elapsed+=dt;apply();if(position().complete){stop('60 Schritte abgeschlossen');hold();}});
  window.A0CellReturnPerformance={start,stop,hold,get snapshot(){return JSON.parse(JSON.stringify(snapshot()));}};status();
})();
