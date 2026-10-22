/* Declared engineering adapter: printed Q4 bits -> Pascal decision word.
   Held or source-driven read only. Never sends Player commands or writes the source. */
(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./a0-pascal-thread-views.js'):root.A0PascalThreadViews,node?require('./a0-player-bench-link.js'):root.A0PlayerBenchLink);
 if(node)module.exports=api;else{root.A0PlayerPascalBridge=api;root.A0PlayerPascalBridgeView=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(P,L){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x)),RULE='PRINTED_Q4_BITS_AS_PASCAL_DECISIONS_V1';
 function transfer(player,{endpointOnly=false,keyMode='none'}={}){
  const witness=L.receipt(player);
  if(!witness||typeof endpointOnly!=='boolean')throw Error('valid Player receipt required');
  const s=P.snapshot(witness.q4Bits,endpointOnly,keyMode);
  return{schema:'a0.player-pascal-readonly/1',rule:RULE,source:L.SOURCE,witness:clone(witness),word:witness.q4Bits,
   pascal:s,comparisonScope:'FOUR_BITS_ONLY',excludedFromPascal:['plate','layer','deskIndex'],
   returnedBits:s.returned.value,bitsVerdict:s.verdict,
   sourceWrites:false,sharedClock:false,wholePlayerReturn:false,
   boundary:'Declared UI engineering input rule, not a historical operator, Gray ordinal, physical plate mapping or inverse restoration of the Player. Correct-key demonstration derives and discloses its ordinal from the accepted source receipt.'};
 }
 function drawing(record,view){
  if(!['grid','bracket'].includes(view))throw Error('unknown Pascal view');
  const s=record.pascal,positions=new Map(),all=[];
  for(let r=0;r<=4;r++)for(let k=0;k<=r;k++){const p=P.screen(P.embedding(4,r,k,view),0,false);positions.set(r+':'+k,p);all.push(p);}
  const xs=all.map(p=>p[0]),ys=all.map(p=>p[1]),xmin=Math.min(...xs),ymin=Math.min(...ys),dx=Math.max(...xs)-xmin,dy=Math.max(...ys)-ymin;
  const scale=Math.min(550/Math.max(dx,.1),210/Math.max(dy,.1));
  const at=(r,k)=>{const [x,y]=positions.get(r+':'+k);return[310+(x-xmin-dx/2)*scale,140+(y-ymin-dy/2)*scale]};
  let svg='<svg viewBox="0 0 620 285" role="img" aria-label="Player-Bitpfad als Pascal-'+view+'"><title>Q4 '+record.word+' · '+view+' · adressierter Pascal-Pfad</title>';
  for(let r=0;r<4;r++)for(let k=0;k<=r;k++)for(const child of [k,k+1]){
   const a=at(r,k),b=at(r+1,child);svg+='<path d="M'+a.join(' ')+' L'+b.join(' ')+'" fill="none" stroke="#476774"/>';
  }
  const line=(path,color,dashed)=>'<polyline points="'+path.map(p=>at(p.r,p.k).join(',')).join(' ')+'" fill="none" stroke="'+color+'" stroke-width="3"'+(dashed?' stroke-dasharray="7 4"':'')+'/>';
  if(s.record.kind==='path')svg+=line(s.path,'#4bd4e6',false);
  if(s.returned.value)svg+=line(P.nodes(s.returned.value),s.verdict==='EXACT'?'#efc265':'#f17d92',true);
  for(let r=0;r<=4;r++)for(let k=0;k<=r;k++){const p=at(r,k),selected=s.record.kind==='path'?s.path[r].k===k:r===4&&s.k===k;svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(selected?5:3)+'" fill="'+(selected?'#4bd4e6':'#78909b')+'"><title>Adresse ('+r+','+k+')</title></circle>';}
  return svg+'</svg>';
 }
 function mount(doc,win){
  const host=doc.getElementById('oneOnePlayerPascal');if(!host)return null;
  const el=id=>doc.getElementById(id);let held=null,record=null,following=false;const subscribers=new Set();
  const notify=()=>{for(const fn of subscribers)try{fn();}catch(error){win.console?.error?.(error);}};
  function availability(){
   const s=win.A0PlayerBenchMonitor?.snapshot();
   el('playerPascalRead').disabled=!s?.current||!['CONNECTED','HOLD_OPEN_LAYER'].includes(s.link);
   if(el('playerPascalFollow'))el('playerPascalFollow').checked=following;
  }
  function snapshot(){return record?clone({...record,receiptSequence:held.seq,view:el('playerPascalView').value,following,readMode:following?'LIVE_RECEIPT_FOLLOW':'EXPLICIT_ONE_SHOT_HELD_NOT_LIVE'}):null;}
  function render(){
   availability();if(!held){notify();return;}
   try{
    record=transfer(held.receipt,{endpointOnly:el('playerPascalProjection').value==='endpoint',keyMode:el('playerPascalKey').value});
    el('playerPascalSvg').innerHTML=drawing(record,el('playerPascalView').value);
    el('playerPascalResult').textContent=(following?'LIVE FOLLOW':'GEHALTEN')+' · Q4 '+record.word+' · Receipt #'+held.seq+' · '+record.bitsVerdict+' (nur Bits) · Return '+(record.returnedBits??'offen')+' · '+record.pascal.returned.candidates+' kompatible Pfade'+(record.pascal.keyControl==='NO_ALTERNATIVE_KEY'?' · Randfall: kein anderer gültiger Schlüssel':record.pascal.supplied===null?'':' · übergebener Ordinal '+record.pascal.supplied);
    el('playerPascalLedger').textContent=JSON.stringify(snapshot(),null,2);
   }catch(e){record=null;el('playerPascalSvg').innerHTML='';el('playerPascalResult').textContent='HOLD · '+e.message;}
   notify();
  }
  function capture(manual=true){
   if(manual)following=false;
   availability();
   const s=win.A0PlayerBenchMonitor?.snapshot();
   if(!s?.current||!['CONNECTED','HOLD_OPEN_LAYER'].includes(s.link)){
    if(following){record=null;el('playerPascalSvg').innerHTML='';el('playerPascalLedger').textContent=JSON.stringify({status:'HOLD',readMode:'LIVE_RECEIPT_FOLLOW',lastHeld:held},null,2);}
    el('playerPascalResult').textContent='HOLD · zuerst aktuellen Player-Receipt verbinden';notify();return false;
   }
   held={receipt:clone(s.current.receipt),seq:s.seq};render();return true;
  }
  function refreshAvailability(){availability();if(following)capture(false);}
  function setFollow(value){if(typeof value!=='boolean')throw Error('boolean follow required');following=value;if(following)refreshAvailability();else render();}
  el('playerPascalRead').addEventListener('click',()=>capture(true));
  el('playerPascalFollow')?.addEventListener('change',()=>setFollow(el('playerPascalFollow').checked));
  for(const id of ['playerPascalView','playerPascalProjection','playerPascalKey'])el(id).addEventListener('change',()=>following?capture(false):render());
  refreshAvailability();
  return{refreshAvailability,render:()=>following?capture(false):render(),snapshot,capture,setFollow,subscribe(fn){subscribers.add(fn);return()=>subscribers.delete(fn)},get following(){return following;}};
 }
 return{RULE,transfer,drawing,mount};
});
