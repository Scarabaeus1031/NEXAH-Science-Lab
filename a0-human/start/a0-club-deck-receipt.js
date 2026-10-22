/* UI bridge over the existing source engine; no arithmetic or playback fork. */
(function(){
 'use strict';
 const TYPE='a0-club-q4-v1',SOURCE='A0_WERKBANK.html';
 const api=window.A0CursorHandoffClickdummy;if(!api)return;
 function emit(id){
  if(window.parent===window)return;
  const {plate,q4Address,q4Bits,layer,deskIndex}=api.snapshot();
  window.parent.postMessage({type:TYPE,source:SOURCE,id,receipt:{plate,q4Address,q4Bits,layer,deskIndex},running:document.getElementById('workspace')?.dataset.transport==='playing'},'*');
 }
 window.addEventListener('message',event=>{
  if(window.parent===window||event.source!==window.parent||!['null',location.origin].includes(event.origin))return;
  const m=event.data;if(!m||m.type!==TYPE)return;
  if(m.action==='pause'||m.action==='hold'){api.pause();emit(m.id);}
  if(m.action==='read')emit(m.id);
  if(m.action==='play'&&typeof m.running==='boolean'){
   const running=document.getElementById('workspace')?.dataset.transport==='playing';
   if(running!==m.running)document.getElementById('tempoPlay')?.click();
   emit(m.id);
  }
  if(m.action==='select'){
   const s=m.receipt;if(!s||s.plate!=='tessarec'||!Number.isInteger(s.q4Address)||s.q4Address<0||s.q4Address>15||
    !(s.layer===null||Number.isInteger(s.layer)&&s.layer>=0&&s.layer<=2))return;
   const selector=s.layer===null?'.station[data-address="'+s.q4Address+'"]':'.wheel-sector[data-address="'+s.q4Address+'"][data-layer="'+s.layer+'"]';
   const target=document.querySelector(selector);if(!target)return;
   target.dispatchEvent(new MouseEvent('click',{bubbles:true}));emit(m.id);
  }
 });
 const workspace=document.getElementById('workspace');
 if(workspace)new MutationObserver(()=>emit()).observe(workspace,{attributes:true,subtree:true,childList:true,characterData:true});
 // A standalone → Club link carries only the source coordinate, never running state.
 if(window.parent===window)for(const link of document.querySelectorAll('[data-jukebox-room="family"]')){
  link.addEventListener('click',()=>{
   api.pause();const s=api.snapshot(),url=new URL(link.href,location.href);
   const {plate,q4Address,q4Bits,layer,deskIndex}=s;
   url.searchParams.set('clubReceipt',JSON.stringify({plate,q4Address,q4Bits,layer,deskIndex}));link.href=url.href;
  });
 }
 emit();
})();
