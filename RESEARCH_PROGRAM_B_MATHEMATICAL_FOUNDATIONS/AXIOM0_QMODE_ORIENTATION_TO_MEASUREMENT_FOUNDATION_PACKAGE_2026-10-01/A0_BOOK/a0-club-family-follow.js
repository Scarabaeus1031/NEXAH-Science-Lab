/* Presentation clock only: existing 21-stop tour, not a Q4→Family identity. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.A0ClubFamilyFollow=api.mount(document,root);
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 function createFollower(port){
  let enabled=true,running=false,last=null,queued=false,applying=false,steps=0;
  function pump(){
   if(applying||!enabled||!running||!queued||!port.active()||port.busy())return false;
   applying=true;queued=false;
   try{if(port.step()!==false){steps++;return true;}queued=true;return false;}
   finally{applying=false;port.changed?.();}
  }
  function observe(s,playing){
   if(!s||!Number.isInteger(s.q4Address)||s.q4Address<0||s.q4Address>15)return;
   const changed=last!==null&&last!==s.q4Address;last=s.q4Address;running=playing===true;
   if(!running)queued=false;else if(enabled&&changed)queued=true;
   port.playing(enabled&&running);pump();port.changed?.();
  }
  function follow(value){enabled=!!value;queued=false;port.playing(enabled&&running);port.changed?.();}
  function suspend(){running=false;last=null;queued=false;port.playing(false);port.changed?.();}
  return{observe,pump,follow,suspend,snapshot:()=>({enabled,running,queued,steps,last,q4FamilyMapping:false})};
 }
 function mount(doc,win){
  const button=doc.getElementById('clubFamilyFollow'),status=doc.getElementById('clubFamilyFollowStatus'),
   reader=win.A0FamilySpatialReader,tour=win.A0ClubTours,room=doc.getElementById('familySpatialMount');
  if(!button||!status||!reader||!tour||!room)return null;
  let control;
  function changed(){
   if(!control)return;
   const s=control.snapshot(),r=reader.snapshot(),name=win.A0FamilyNavigatorDemoData?.families[r.family]?.name||'';
   room.setAttribute?.('data-player-follow',String(s.enabled));
   button.setAttribute('aria-pressed',String(s.enabled));button.textContent=s.enabled?'● Club folgt Player':'○ Club manuell';
   status.textContent=(s.enabled?(s.running?'Player-geführte Lesetour':'Club folgt · Player pausiert'):'Manueller Club-Fokus')+' · '+r.family+' · '+name+(s.queued?' · nächster Halt wartet auf Ankunft':'');
  }
  control=createFollower({active:()=>!doc.hidden&&!room.hidden,busy:()=>!!reader.motion?.()||!!reader.journey?.(),
   step:()=>tour.externalStep(),playing:value=>tour.externalPlaying(value),changed});
  button.addEventListener('click',()=>control.follow(!control.snapshot().enabled));
  doc.addEventListener('a0:family-atlas-selection',()=>win.requestAnimationFrame(changed));
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)control.suspend();});
  changed();
  return{observe:control.observe,pump:control.pump,snapshot:control.snapshot,suspend:control.suspend,
   manual:()=>control.follow(false),transport(){if(!win.A0ClubReturnMonitor?.setPlaying(!control.snapshot().running))win.A0LDVRoomRoute?.show('deck');}};
 }
 return{createFollower,mount};
});
