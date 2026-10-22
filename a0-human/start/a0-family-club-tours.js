/* Finite local reading tours. No DJ clock, source-state handoff or new graph relation. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{const player=api.mount(document,root);if(player)root.A0ClubTours=player;}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const FAMILIES=['F1','F2','F3','F4','F5','F6','F7'],STOPS=['zeta','theta','beta'];
 // Presentation sequence only; no scientific equivalence between a stop and a layout/exhibit.
 function createShow(reader,stage,view,reduced=()=>false){
  let key=null,wasRunning=false,pendingView=null;
  const cues=[['read','front'],['read','front'],['room','overview'],['room','overview'],['dance','back'],['dance','back'],['room','front']];
  const exhibits=['none','bluebody','bluebody','dodeca','dodeca','bluebody','none'];
  function perspective(angle){
   if(reduced())return;
   const camera=reader.snapshot().camera,pitch=angle==='overview'?1.15:.38,yaw=angle==='back'?Math.PI-.35:-.35;
   if(!camera||Math.abs(camera.pitch-pitch)>.08||Math.abs(Math.atan2(Math.sin(camera.yaw-yaw),Math.cos(camera.yaw-yaw)))>.08)view(angle);
  }
  return{update(playback){
   if(!playback.running){const stop=wasRunning;wasRunning=false;key=null;pendingView=null;if(stop&&stage?.snapshot().mode==='dance')stage.setMode('room');return;}
   wasRunning=true;if(reader.motion?.()||reader.journey?.())return;
   const state=reader.snapshot(),next=state.family+'@'+state.stop,index=FAMILIES.indexOf(state.family);
   if(index<0)return;
   if(next===key){if(pendingView){const angle=pendingView;pendingView=null;perspective(angle);}return;}
   key=next;pendingView=null; // Set before callbacks: renderer refresh can re-enter.
   const [mode,angle]=cues[index],calm=reduced(),light=calm&&mode==='dance'?'room':mode;
   if(stage&&stage.snapshot().mode!==light)stage.setMode(light);
   if(reader.setExhibit&&(reader.snapshot().exhibit||'none')!==exhibits[index])reader.setExhibit(exhibits[index]);
   const grid=[0,1,4].includes(index);if(reader.setGuideHeld&&reader.guide?.().held!==grid)reader.setGuideHeld(grid);
   const layout=['cylinder','polar','plate'][STOPS.indexOf(state.stop)];
   if(layout&&reader.changeLayout&&reader.snapshot().layout!==layout){pendingView=angle;reader.changeLayout(layout);}
   else if(!calm)perspective(angle);
  }};
 }
 function createPlayer(reader,clock,changed=()=>{},active=()=>true,initialMode='family'){
  let mode=initialMode==='roundtrip'?'roundtrip':'family',running=false,timer=null,version=0,internal=false,expected=null,reason='Bereit',roundStart=null,roundCount=0;
  const state=()=>reader.snapshot();
  const list=()=>mode==='roundtrip'?Array.from({length:21},(_,i)=>i):mode==='family'?FAMILIES:STOPS;
  const coordinateIndex=()=>STOPS.indexOf(state().stop)*7+FAMILIES.indexOf(state().family);
  const index=()=>mode==='roundtrip'?Math.min(roundCount,20):list().indexOf(mode==='family'?state().family:state().stop);
  const busy=()=>!!reader.motion?.()||!!reader.journey?.();
  function clear(){version++;if(timer!==null)clock.clearTimeout(timer);timer=null;}
  function snapshot(){return{mode,running,index:index(),length:list().length,busy:busy(),reason,roundReturned:mode==='roundtrip'&&roundCount===21,localNavigationOnly:true};}
  function pause(message='Pause'){clear();running=false;reason=message;changed(snapshot());}
  function interrupt(message='Manuelle Auswahl · Pause'){roundStart=null;roundCount=0;expected=null;pause(message);}
  function go(i){
   if(busy()||i<0||i>=list().length)return false;
   const s=state();expected=mode==='roundtrip'?{family:FAMILIES[i%7],stop:STOPS[Math.floor(i/7)]}:{family:mode==='family'?FAMILIES[i]:s.family,stop:mode==='family'?s.stop:STOPS[i]};
   internal=true;let result;
   try{
    if(mode==='family')result=reader.selectFamily(expected.family);
    else{if(expected.family!==s.family)reader.selectFamily(expected.family);result=expected.stop===s.stop?true:reader.travel(expected.stop);}
   }finally{internal=false;}
   if(result===false){expected=null;return false;}reason='Lesestation '+(i+1)+' / '+list().length;changed(snapshot());return true;
  }
  function schedule(delay=1800){const token=version;timer=clock.setTimeout(()=>{timer=null;if(token!==version||!running)return;tick();},delay);}
  function tick(){
   if(!active()){interrupt('Raum verlassen · Pause');return;}
   if(busy()){schedule(120);return;}
   expected=null;
   if(mode==='roundtrip'){
    if(roundCount===21){pause('Roundtrip beendet · Startkoordinate erreicht');return;}
    if(!advanceRound()){pause('Auswahl nicht verfügbar');return;}schedule();return;
   }
   if(index()>=list().length-1){pause('Tour beendet');return;}
   if(!go(index()+1)){pause('Auswahl nicht verfügbar');return;}schedule();
  }
  function play(){
   if(running||!active())return false;clear();running=true;reason='Tour läuft';
   if(mode==='roundtrip'){if(roundStart===null||roundCount===21){roundStart=coordinateIndex();roundCount=0;}}
   else if(index()<0||index()===list().length-1){if(!go(0)){pause('Bewegung abwarten');return false;}}
   changed(snapshot());schedule();return true;
  }
  function advanceRound(){
   if(roundStart===null){roundStart=coordinateIndex();roundCount=0;}
   if(roundCount===21)return false;
   const next=(roundStart+roundCount+1)%21;
   if(!go(next))return false;roundCount++;reason=roundCount===21?'Rückfahrt zur Startkoordinate':'Roundtrip · Halt '+(roundCount+1)+' / 21';changed(snapshot());return true;
  }
  function step(){pause('Einzelschritt');if(!active()||busy())return false;if(mode==='roundtrip')return advanceRound();if(index()===list().length-1){reason='Tour beendet · mit Start erneut beginnen';changed(snapshot());return false;}return go(index()+1);}
  function choose(value){if(!['family','elevator','roundtrip'].includes(value))return false;pause('Abspielweg gewählt');mode=value;roundStart=null;roundCount=0;expected=null;changed(snapshot());return true;}
  function selectionChanged(){
   if(internal)return;
   const s=state();if(expected&&s.family===expected.family&&s.stop===expected.stop){expected=null;changed(snapshot());return;}
   if(running)interrupt();else{roundStart=null;roundCount=0;changed(snapshot());}
  }
  return{play,pause,interrupt,step,choose,snapshot,selectionChanged};
 }
 function mount(doc,win){
  const room=doc.getElementById('familySpatialMount'),board=room?.querySelector('.club-cockpit'),reader=win.A0FamilySpatialReader;
  if(!room||!board||!reader)return null;
  const bar=doc.createElement('section');bar.className='club-tour-player';bar.setAttribute('aria-label','Lesetour-Player');
  let player,externalRunning=false,rendering=false;
  function button(text,fn){const b=doc.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
  const transport=doc.createElement('div');transport.className='club-tour-transport';
  const play=button('▶ Club-Tour',()=>{if(win.A0ClubFamilyFollow?.snapshot().enabled){win.A0ClubFamilyFollow.transport();return;}if(player.snapshot().running)player.pause();else{bar.scrollIntoView?.({block:'start',behavior:'auto'});player.play();}});play.setAttribute('aria-pressed','false');
  play.title='Lokale Club-Demo · 21 Lesestationen mit Raum, Licht, Perspektive, Grid und Exponaten';
  transport.append(play);
  const layouts=doc.createElement('div');layouts.className='club-primary-layouts';layouts.setAttribute('aria-label','Grundform wählen');
  const formGroup=room.querySelector('[data-club-control="room"]');if(formGroup)layouts.append(formGroup);
  const exhibits=doc.createElement('div');exhibits.className='club-primary-exhibits';exhibits.setAttribute('aria-label','Exponat wählen');
  const exhibitGroup=room.querySelector('[data-club-control="exhibit"]');if(exhibitGroup)exhibits.append(exhibitGroup);
  const settings=doc.createElement('div');settings.className='club-primary-settings';settings.setAttribute('aria-label','Licht · LJ');
  const grid=room.querySelector('[data-club-grid]'),lightGroup=room.querySelector('[data-club-control="light"]');
  if(grid)exhibits.append(grid);if(lightGroup)settings.append(lightGroup);
  const perspective=room.querySelector('[data-club-control="view"]');if(perspective)settings.append(perspective);
  const status=doc.createElement('output');status.setAttribute('role','status');
  bar.append(transport,layouts,exhibits,settings,status);
  const top=room.querySelector('.club-experience-bar'),pickup=room.querySelector('.club-pickup-console');
  if(pickup)pickup.className+=' club-yellow-navigation';
  if(top)top.append(bar);else if(pickup)pickup.before(bar);else board.append(bar);
  const viewport=room.querySelector('.spatial-viewport'),hud=doc.createElement('aside');hud.className='club-now-playing';hud.setAttribute('aria-label','Jetzt aktiv');
  const hudPosition=doc.createElement('strong'),hudView=doc.createElement('span'),hudLight=doc.createElement('span');hud.append(hudPosition,hudView,hudLight);if(viewport)viewport.append(hud);
  const show=createShow(reader,win.A0JukeboxStage,angle=>{if(angle==='overview')reader.overview?.();else room.querySelector('[data-action="'+angle+'"]')?.onclick?.();},()=>!!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  function render(s){
   if(rendering)return;rendering=true;
   try{
   s={...s,running:s.running||externalRunning};
   show.update(s);
   room.setAttribute('data-tour-running',String(s.running));
   play.textContent=s.running?'Ⅱ Tour pausieren':'▶ Club-Tour';play.setAttribute('aria-pressed',String(s.running));
   const current=reader.snapshot(),label=win.A0FamilyNavigatorDemoData?.families[current.family]?.name||current.family;
   const route=reader.journey?.()?.route;
   const plate=({zeta:'ζ Quelle',theta:'θ Ansicht',beta:'β Grenze'}[current.stop]||current.stop);
   status.textContent=current.family+' · '+plate+' · Runde '+(s.index+1)+'/'+s.length+' · '+(externalRunning?'Player-Takt · ':'')+(route?'Tonarm fährt → '+({zeta:'Quelle',theta:'Ansicht',beta:'Grenze'}[route.to])+' · Ziel offen':s.reason);status.title=label;
   hudPosition.textContent='● '+current.family+' · '+plate;
   hudView.textContent=({cylinder:'Zylinder',polar:'Polar',plate:'Platte'}[current.layout]||current.layout||'')+' · '+(current.camera?.pitch>=1.03?'Gesamt':Math.cos((current.camera?.yaw||0)+.35)>=0?'A · vorne':'B · hinten');
   const light=win.A0JukeboxStage?.snapshot().mode||'room';hudLight.textContent=(s.running?'▶ Spielt':'Ⅱ Hält')+' · '+({read:'Leselicht',room:'Farbraum',dance:'Bühne'}[light]||light);
   hud.setAttribute('data-light',light);
   }finally{rendering=false;}
  }
  const active=()=>!doc.hidden&&!room.hidden;
  player=createPlayer(reader,win,render,active,'roundtrip');reader.setTriangle?.(false);render(player.snapshot());
  function manual(event){
   if(!room.contains(event.target)||bar.contains(event.target))return;
   for(let node=event.target;node&&node!==room;node=node.parentElement||node.parent){
    if(['room','view','light'].includes(node.getAttribute?.('data-club-control')))return;
   }
   win.A0ClubFamilyFollow?.manual();
   player.interrupt('Navigation von Hand · Pause');
  }
  doc.addEventListener('pointerdown',manual,true);doc.addEventListener('click',manual,true);
  doc.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','+','-'].includes(event.key))manual(event);},true);
  doc.addEventListener('a0:family-atlas-selection',()=>player.selectionChanged());
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)player.interrupt('Fenster verborgen · Pause');});
  win.addEventListener('hashchange',()=>player.interrupt('Navigation · Pause'));
  win.addEventListener('pagehide',()=>player.interrupt('Seite verlassen · Pause'));
  // Busy state settles between timer ticks without owning the renderer's animation clock.
  const refresh=()=>{if(rendering)return;render(player.snapshot());win.A0ClubFamilyFollow?.pump();};
  return{play:player.play,pause:player.pause,interrupt:player.interrupt,snapshot:player.snapshot,refresh,
   externalPlaying(value){const next=!!value;if(next===externalRunning&&!player.snapshot().running)return;externalRunning=next;
    if(player.snapshot().running)player.pause('Player übernimmt den Vorführtakt');else render(player.snapshot());},
   externalStep(){if(player.snapshot().roundReturned)player.choose('roundtrip');return player.step();}};
 }
 return{createPlayer,createShow,mount};
});
