/* One lazy embedded instance of the existing DJ source. No Q4/Family or mixer mapping. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{const deck=api.mount(document,root);if(deck)root.A0ClubDeck=deck;}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const SOURCE='../A0_WERKBANK.html#performanceConsole';
 function mount(doc,win){
  const panel=doc.getElementById('club-deck-room'),host=doc.getElementById('clubDeckHost'),status=doc.getElementById('clubDeckStatus');
  if(!panel||!host||!status)return null;
  let frame=null,active=false,generation=0,discarded=false;
  function dispose(){
   win.A0ClubReturnMonitor?.detached();
   generation++;if(frame){frame.removeAttribute('src');frame.remove();frame=null;}
  }
  function pause(){
   if(!frame)return false;
   try{
    const api=frame.contentWindow?.A0CursorHandoffClickdummy;
    if(typeof api?.pause!=='function')return !!win.A0ClubReturnMonitor?.pause(frame);
    api.pause();return true;
   }catch{return !!win.A0ClubReturnMonitor?.pause(frame);}
  }
  function load(){
   if(frame)return;const request=++generation,v=doc.createElement('iframe'),restarted=discarded;discarded=false;frame=v;
   v.title='Vorhandenes DJ-Plattendeck · Analog / Grammophon / Digital';
   v.setAttribute('sandbox','allow-scripts allow-same-origin allow-downloads');
   v.setAttribute('referrerpolicy','no-referrer');v.setAttribute('loading','eager');
   v.addEventListener('load',()=>{
    if(request!==generation||frame!==v)return;
    status.textContent=(restarted?'Deck neu gestartet nach Entladen · ':'Quelldokument geladen · ')+'START und Mixer direkt im Deck bedienen. Eigener UI-Takt; kein Family- oder LDV-State übertragen.';
   });
   v.addEventListener('error',()=>{if(request===generation)status.textContent='HOLD · Deckfenster nicht geladen. Bitte das Original separat öffnen.';});
   win.A0ClubReturnMonitor?.watchFrame(v);
   host.append(v);v.src=SOURCE;
   status.textContent=(restarted?'Deck startet neu; früherer eingebetteter Stand wurde verworfen. ':'')+'Vorhandenes Deck wird geladen … keine zweite Implementierung.';
  }
  function activate(){
   active=true;if(!frame)load();
   else status.textContent='Gleiche Deck-Instanz · Wiedergabe bleibt beim Ansichtswechsel erhalten.';
  }
  function deactivate(){
   active=false;if(!frame)return;
   status.textContent='Player läuft, falls gestartet, im selben Fenster weiter · Monitor folgt im Club.';
  }
  doc.getElementById('clubDeckReload').onclick=()=>{discarded=!!frame||discarded;dispose();if(active)load();};
  doc.addEventListener('visibilitychange',()=>{
   if(doc.hidden&&frame){if(pause())status.textContent='Deck pausiert · nach Rückkehr START im Deck wählen.';
    else{discarded=true;dispose();status.textContent='Deck aus Sicherheitsgründen entladen · mit „Deck neu laden“ wieder öffnen.';}}
  });
  win.addEventListener('pagehide',()=>{active=false;dispose();});
  return{activate,deactivate,snapshot:()=>({active,loaded:!!frame,sourceHref:SOURCE,sourceStateTransferred:false,sharedClock:false})};
 }
 return{SOURCE,mount};
});
