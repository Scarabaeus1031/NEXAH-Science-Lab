/* Jukebox source-bound room routes. LDV and the embedded DJ source stay distinct from Families. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{const route=api.mount(document,root);if(route)root.A0LDVRoomRoute=route;}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const ENTRY='#ldv-lookback-room',RETURN='#spatial-navigation';
 function mount(doc,win){
  const room=doc.getElementById('ldv-lookback-room'),family=doc.getElementById('familySpatialMount'),deck=doc.getElementById('club-deck-room');
  if(!room||!family)return null;
  const doors=[...doc.querySelectorAll('[data-jukebox-room]')],context=doc.getElementById('ldvLocalContext');
  const heroTitles=[...doc.querySelectorAll('[data-club-hero-title]')];
  const control=doc.getElementById('control-room');
  const ancillary=[doc.getElementById('clubGLBDrawer'),doc.querySelector('.demo-joints')].filter(Boolean);
  let active='family',savedHidden=[];
  function show(next,scroll=true){
   if(!['family','ldv','deck','control'].includes(next)||next==='deck'&&!deck||next==='control'&&!control)return false;
   if(next!==active){
    if(active==='family'&&next!=='family'){
     win.A0ClubTours?.interrupt('Ansicht gewechselt · Pause');
     savedHidden=ancillary.map(el=>el.hidden);
     for(const el of ancillary)el.hidden=true;
     if(win.A0JukeboxStage?.snapshot().mode==='dance')win.A0JukeboxStage.setMode('room','Bühne pausiert · anderer Club-Bereich geöffnet.');
     doc.getElementById('jukeboxGLBStage')?.querySelector('model-viewer')?.pause?.();
     const play=doc.getElementById('jukeboxGLBPlay');if(play)play.textContent='Animation starten';
    }else if(next==='family')ancillary.forEach((el,i)=>el.hidden=!!savedHidden[i]);
    if(active==='deck'){win.A0ClubReturnMonitor?.depart();win.A0ClubDeck?.deactivate();}
    if(next==='deck'){win.A0ClubDeck?.activate();win.A0ClubReturnMonitor?.returned();}
   }
   active=next;room.hidden=next!=='ldv';family.hidden=next!=='family';if(deck)deck.hidden=next!=='deck';
   if(control)control.hidden=next!=='control';
   for(const title of heroTitles)title.hidden=title.dataset.clubHeroTitle!==next;
   for(const door of doors){if(door.dataset.jukeboxRoom===next)door.setAttribute('aria-current','page');else door.removeAttribute('aria-current');}
   if(next==='ldv'){
    const s=win.A0FamilySpatialReader?.snapshot();
    context.textContent=s?'Gehalten im Family-Raum: '+(s.family||s.elevatorFamily)+' · '+({zeta:'ζ Quelle',theta:'θ Ansicht',beta:'β Grenze'}[s.stop]||s.stop)+' · '+s.layout+'. Kamera, Auswahl und Lesespur bleiben dort.':'Kein Jukebox-Lesestand verfügbar. Kein Deck- oder Source-State übernommen.';
   }
   win.requestAnimationFrame(()=>{
    if(next!==active)return;
    if(next==='family')win.A0FamilySpatialReader?.resize();
    if(scroll){(next==='control'?control:(next==='family'||next==='deck')&&doc.getElementById('clubReturnMonitor')||(next==='family'?family:next==='deck'?deck:doc.getElementById('spatial-navigation')))?.scrollIntoView({block:'start',behavior:win.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});if(next!=='family')doc.getElementById(next==='control'?'controlRoomTitle':next==='ldv'?'ldvRoomTitle':'clubDeckTitle')?.focus({preventScroll:true});}
   });
   return true;
  }
  function follow(){
   let id;try{id=decodeURIComponent(win.location.hash.slice(1));}catch{return}
   const target=doc.getElementById(id);
   if(id==='ldv-lookback-room')show('ldv');
   else if(id==='control-room'||target&&control?.contains(target))show('control');
   else if(id==='club-deck-room'||target&&deck?.contains(target))show('deck');
   else if(target&&room.contains(target)){
    show('ldv',false);
    for(let n=target;n&&n!==room;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;
    win.requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
   }
   else if(id==='spatial-navigation'||target&&family.contains(target)||id==='jukeboxGLB')show('family');
  }
  win.addEventListener('hashchange',follow);show('family',false);follow();
  return{show,snapshot:()=>({activeRoom:active,entryHref:ENTRY,returnHref:RETURN,djReceiptReceived:false,sourceStateTransferred:false,sharedClock:false})};
 }
 return{ENTRY,RETURN,mount};
});
