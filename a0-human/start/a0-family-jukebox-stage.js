/* Decorative stage only: no mutation of graph, camera, carrier, source geometry or export. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{const stage=api.mount(document,root);if(stage)root.A0JukeboxStage=stage;}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 function poseAt(seconds){
  const t=Number.isFinite(seconds)?seconds:0;
  return{yaw:t*.12,tilt:Math.sin(t*.23)*.12,scale:1+Math.sin(t*.53)*.025};
 }
 function transform(p,pose){
  const c=Math.cos(pose.yaw),s=Math.sin(pose.yaw),ct=Math.cos(pose.tilt),st=Math.sin(pose.tilt);
  const x=p[0]*c-p[2]*s,z=p[0]*s+p[2]*c;
  return[x*pose.scale,(p[1]*ct-z*st)*pose.scale,(p[1]*st+z*ct)*pose.scale];
 }
 function mount(doc,win){
  const room=doc.getElementById('familySpatialMount'),buttons=room?.querySelector('[data-control="lights"]'),status=room?.querySelector('[data-readout="lightStatus"]');
  if(!buttons||!status)return null;
  const query=win.matchMedia?.('(prefers-reduced-motion: reduce)');
  let mode='room',seconds=0,last=null,lastDraw=0,token=0;
  function render(){
   room.setAttribute('data-light',mode);
   for(const b of buttons.children)b.setAttribute('aria-pressed',String(b.dataset.light===mode));
   status.textContent=mode==='dance'?'Bühne an · Blue Body oder Dodeca wählen: nur Licht und Körper-Landmarke bewegen sich. GLB bleibt ruhende Quellgeometrie.':mode==='room'?'Farbraum · eigene Lichtstimmung je Anordnung. Kein State-Wechsel.':'Leselicht · ruhige Konturen, unveränderte Joint-Farben.';
   win.A0FamilySpatialReader?.redraw();
   win.A0ClubUX?.refresh();
  }
  function setMode(next,notice=''){
   if(!['read','room','dance'].includes(next))return false;
   token++;last=null;lastDraw=0;
   mode=next==='dance'&&query?.matches?'room':next;
   if(mode!=='dance')seconds=0;
   render();
   if(next==='dance'&&query?.matches)status.textContent='Bewegung reduzieren aktiv · Farbraum bleibt statisch.';
   if(notice)status.textContent=notice;
   if(mode==='dance'){
    const epoch=token;
    function frame(now){
     if(epoch!==token||mode!=='dance')return;
     if(last!==null)seconds+=Math.min(.1,Math.max(0,(now-last)/1000));last=now;
     if(now-lastDraw>=33){lastDraw=now;win.A0FamilySpatialReader?.redraw();}
     win.requestAnimationFrame(frame);
    }
    win.requestAnimationFrame(frame);
   }
   return true;
  }
  for(const[id,label]of[['read','Leselicht'],['room','Farbraum'],['dance','Bühne ▶']]){
   const b=doc.createElement('button');b.type='button';b.dataset.light=id;b.textContent=label;b.onclick=()=>setMode(id);buttons.append(b);
  }
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden&&mode==='dance')setMode('room','Bühne pausiert · bei Rückkehr bewusst wieder starten.');});
  win.addEventListener('pagehide',()=>setMode('room'));
  query?.addEventListener?.('change',()=>{if(query.matches&&mode==='dance')setMode('room','Bewegung reduzieren aktiv · Bühne angehalten.');});
  render();return{setMode,pose:()=>mode==='dance'?poseAt(seconds):null,transform,snapshot:()=>({mode,decorative_seconds:seconds,source_state_transferred:false})};
 }
 return{poseAt,transform,mount};
});
