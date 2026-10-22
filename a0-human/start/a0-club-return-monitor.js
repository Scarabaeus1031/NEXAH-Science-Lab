/* Read-only source receipts + explicit UI selection. No Family/Q4 mapping. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.A0ClubReturnMonitor=api.mount(document,root);
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const TYPE='a0-club-q4-v1',SOURCE='A0_WERKBANK.html';
 const GRAY=Array.from({length:16},(_,i)=>i^(i>>1));
 function receipt(s){
  if(!s||s.plate!=='tessarec'||!Number.isInteger(s.q4Address)||s.q4Address<0||s.q4Address>15||
   !(s.layer===null||Number.isInteger(s.layer)&&s.layer>=0&&s.layer<=2))return null;
  const k=GRAY.indexOf(s.q4Address),index=s.layer===null?null:s.layer*16+(s.layer===1?15-k:k);
  if(s.q4Bits!==s.q4Address.toString(2).padStart(4,'0')||s.deskIndex!==index)return null;
  return{plate:'tessarec',q4Address:s.q4Address,q4Bits:s.q4Bits,layer:s.layer,deskIndex:index};
 }
 function compare(a,b){
  a=receipt(a);b=receipt(b);
  if(!a||!b||a.layer===null||b.layer===null)return{status:'HOLD',residual:null};
  const residual=['q4Address','layer','deskIndex'].filter(k=>a[k]!==b[k]).length;
  return{status:residual?'CHANGED':'MATCH',residual};
 }
 function mount(doc,win){
  const host=doc.getElementById('clubReturnMonitor');if(!host)return null;
  const field=doc.getElementById('clubReturnField'),position=doc.getElementById('clubReturnPosition'),
   result=doc.getElementById('clubReturnResult'),family=doc.getElementById('clubReturnFamily');
  let frame=null,current=null,held=null,pending=null,serial=0,connected=false,timer=null,verification=null,running=false;
  const play=doc.getElementById('clubReturnPlay');
  const buttons=[];
  function draw(){
   position.textContent=current?'Q4 '+current.q4Bits+' · '+(current.layer===null?'Lage offen · 3 mögliche Positionen': ['−','⁰','+'][current.layer]+' · Arbeitsfläche '+current.deskIndex):'Player noch nicht verbunden';
   for(const b of buttons){const selected=!!current&&current.layer===Number(b.dataset.layer)&&current.q4Address===Number(b.dataset.address);
    const candidate=!!current&&current.layer===null&&current.q4Address===Number(b.dataset.address);
    b.dataset.candidate=String(candidate);
    b.setAttribute('aria-pressed',String(selected));b.disabled=!connected;}
   const s=win.A0FamilySpatialReader?.snapshot();
   family.textContent=s?'Club-Fokus: '+(s.family||s.elevatorFamily)+' · '+s.stop:'Family-Koordinate bleibt unabhängig';
   if(play){play.textContent=running?'Ⅱ Pause':'▶ Abspielen';play.disabled=!connected;play.setAttribute('aria-pressed',String(running));}
  }
  function status(text){result.textContent=text;}
  function send(action,payload){
   if(!frame?.contentWindow)return false;
   try{frame.contentWindow.postMessage({type:TYPE,action,...payload},'*');return true;}catch{return false;}
  }
  function check(target){
   target=receipt(target);if(!target||!connected){status('HOLD · zuerst das Plattendeck öffnen');return false;}
   held=null;const id=++serial;pending={id,target};status('Return wird geprüft …');
   win.clearTimeout(timer);timer=win.setTimeout(()=>{if(pending?.id===id){pending=null;status('HOLD · keine Return-Bestätigung');}},1800);
   if(!send('select',{id,receipt:target})){pending=null;status('HOLD · Player nicht erreichbar');return false;}
   return true;
  }
  function auditProjection(){
   const selected=buttons.filter(b=>b.getAttribute('aria-pressed')==='true');
   if(!current||current.layer===null||selected.length!==1)return{status:'HOLD',residual:null};
   const b=selected[0],address=Number(b.dataset.address),layer=Number(b.dataset.layer),k=GRAY.indexOf(address);
   return compare(current,{plate:'tessarec',q4Address:address,q4Bits:address.toString(2).padStart(4,'0'),layer,deskIndex:layer*16+(layer===1?15-k:k)});
  }
  function liveStatus(){
   if(current&&current.layer===null){
    const k=GRAY.indexOf(current.q4Address);
    status((running?'LIVE':'Adresse sichtbar')+' · 3 mögliche Orte: '+[k,31-k,32+k].join(' / ')+' · Lage im Feld anklicken');
    return;
   }
   const c=auditProjection();
   status(c.status==='MATCH'?(running?'LIVE MATCH':'MATCH')+' · Quelle ↔ Q4-Feld · Δ = 0':c.status==='HOLD'?'HOLD · Lage noch offen':'CHANGED · dargestellte Koordinate weicht ab');
  }
  function read(){
   if(!connected){status('HOLD · zuerst das Plattendeck öffnen');return;}
   const id=++serial;pending={id,kind:'read'};win.clearTimeout(timer);
   timer=win.setTimeout(()=>{if(pending?.id===id){pending=null;status('HOLD · keine Quellenbestätigung');}},1800);
   send('read',{id});
  }
  for(let layer=0;layer<3;layer++){
   const row=doc.createElement('div'),label=doc.createElement('span');label.textContent=['Q4−','Q4⁰','Q4+'][layer];row.append(label);
   const sequence=layer===1?[...GRAY].reverse():GRAY;
   for(const address of sequence){const b=doc.createElement('button');b.type='button';b.dataset.layer=String(layer);b.dataset.address=String(address);
    b.textContent=String(address);b.setAttribute('aria-label','Player wählen: Q4 '+address.toString(2).padStart(4,'0')+', Lage '+['innen −','mitte ⁰','außen +'][layer]);
    b.title='Q4 '+address.toString(2).padStart(4,'0')+' · '+['Innen','Mitte','Außen'][layer]+' · Arbeitsfläche '+(layer*16+sequence.indexOf(address));
    b.addEventListener('click',()=>{const target={plate:'tessarec',q4Address:address,q4Bits:address.toString(2).padStart(4,'0'),layer,deskIndex:layer*16+sequence.indexOf(address)};check(target);});row.append(b);buttons.push(b);}
   field.append(row);
  }
  function watchFrame(v){
   frame=v;connected=false;win.A0ClubFamilyFollow?.suspend();win.A0ClubCRTLink?.observe(null);draw();
   v.addEventListener('load',()=>{
    if(frame!==v)return;connected=false;draw();status('HOLD · warte auf Quellenbestätigung');
    win.clearTimeout(timer);timer=win.setTimeout(()=>{if(frame===v&&!connected)status('HOLD · Quelle antwortet nicht');},1800);
    send('read',{});
   });
  }
  win.addEventListener('message',event=>{
   if(!frame||event.source!==frame.contentWindow||!['null',win.location.origin].includes(event.origin))return;
   const m=event.data;if(!m||m.type!==TYPE||m.source!==SOURCE)return;
   const next=receipt(m.receipt);if(!next){connected=false;win.A0ClubFamilyFollow?.suspend();win.A0ClubCRTLink?.observe(null);draw();win.A0PlayerBenchRelay?.sourceChanged();status('HOLD · ungültiger Quellenrecord');return;}
   const wasConnected=connected;if(!wasConnected&&!pending)win.clearTimeout(timer);
   connected=true;current=next;running=m.running===true;
   win.A0PlayerBenchRelay?.sourceChanged();
   draw();
   win.A0ClubQRTDemo?.observe(next);
   win.A0ClubCRTLink?.observe(next,running);
   win.A0ClubFamilyFollow?.observe(next,running);
   if(pending?.kind==='read'&&m.id===pending.id){
    win.clearTimeout(timer);pending=null;verification=null;liveStatus();
   }else if(pending&&m.id===pending.id){
    const c=compare(pending.target,next);win.clearTimeout(timer);pending=null;
    const text=c.status==='MATCH'?'MATCH · Adresse & Lage bestätigt · Δ = 0':c.status==='HOLD'?'HOLD · Lage noch offen':'CHANGED · '+c.residual+' Koordinatenfelder abweichend';
    if(c.status==='HOLD'&&next.layer===null){verification=null;liveStatus();}
    else{verification={record:next,text};status(text);}
   }else if(!wasConnected&&held){const target=held;held=null;check(target);}
   else if(!pending){
    if(verification&&JSON.stringify(verification.record)===JSON.stringify(next))status(verification.text);
    else{verification=null;liveStatus();}
   }
   draw();
  });
  function depart(){
   // A view change never rewinds or pauses the source clock.
   draw();
  }
  function returned(){draw();if(connected)read();}
  doc.getElementById('clubReturnCheck').addEventListener('click',read);
  if(play)play.addEventListener('click',()=>{if(connected)send('play',{running:!running});});
  doc.addEventListener('a0:family-atlas-selection',()=>win.requestAnimationFrame(draw));
  // Only a bounded navigation receipt, never a clock, mixer or scientific state.
  try{const q=new URL(win.location.href).searchParams.get('clubReceipt');if(q){const s=receipt(JSON.parse(q));if(s){current=s;held=s;status('Gehaltene Player-Adresse · Bestätigung beim Öffnen des Players');}}}catch{status('HOLD · ungültiger Eintrittsrecord');}
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden){send('pause',{});win.clearTimeout(timer);if(pending){pending=null;status('HOLD · Prüfung unterbrochen');}}});
  win.addEventListener('pagehide',()=>{win.clearTimeout(timer);});
  draw();
  return{watchFrame,depart,returned,pause:v=>connected&&v===frame&&send('pause',{}),
   detached:()=>{connected=false;frame=null;pending=null;win.clearTimeout(timer);win.A0ClubFamilyFollow?.suspend();win.A0ClubCRTLink?.observe(null);status('HOLD · Quelle entladen; Adresse als Receipt gehalten');draw();win.A0PlayerBenchRelay?.sourceChanged();},
   requestReceipt:()=>send('read',{}),
   snapshot:()=>({current:current&&{...current},held:held&&{...held},connected,running,sharedClock:false,familyMapping:false}),auditProjection,
   choose(address,layer){
    if(!Number.isInteger(address)||address<0||address>15||!(layer===null||Number.isInteger(layer)&&layer>=0&&layer<3))return false;
    const k=GRAY.indexOf(address);
    return check({plate:'tessarec',q4Address:address,q4Bits:address.toString(2).padStart(4,'0'),layer,deskIndex:layer===null?null:layer*16+(layer===1?15-k:k)});
   },setPlaying(value){return connected&&typeof value==='boolean'&&send('play',{running:value});}};
 }
 return{TYPE,SOURCE,GRAY,receipt,compare,mount};
});
