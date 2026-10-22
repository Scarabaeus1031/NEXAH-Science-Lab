/* Event-driven overview of existing typed links. No playback or source-step commands. */
(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./a0-aperture-stack-calibration.js'):root.A0ApertureStackCalibration,node?require('./a0-player-bench-link.js'):root.A0PlayerBenchLink,node?require('./a0-pascal-thread-views.js'):root.A0PascalThreadViews);
 if(node)module.exports=api;else{root.A0BinderConnections=api;root.A0BinderConnectionsView=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(S,L,P){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x)),flag=x=>typeof x==='boolean'?x:null;
 function report(input={}){
  const m={id:'m3',status:'HOLD',detail:'M3-/Stack-Quelle fehlt',m3Running:flag(input.m3?.running),stackRunning:flag(input.stackRunning)};
  if(input.stackFollowing===false){m.status='SEPARATE';m.detail='M3-Follow ausgeschaltet · Plattenuhr separat';}
  else try{
   const source=S.sharedSource(input.m3),stack=input.stack;
   if(input.stackFollowing!==true||stack?.schema!=='nexah.a0.aperture-stack-calibration/1'||stack.sampleCount!==48||stack.sourceFingerprint!==source.record.sourceFingerprint||stack.m3Link?.mode!=='SHARED_SOURCE_RECORD'||stack.m3Link.sourceIndex!==source.cursor)throw Error('Quellenrecord / Lesepunkt nicht bestätigt');
   const visible=S.inspectPlate(source.trace,stack.activePlate,{windowDeg:stack.windowDeg}).visibleIndices.includes(source.cursor);
   if(visible!==stack.m3Link.visible)throw Error('Sichtbarkeitsreadback weicht ab');
   Object.assign(m,{status:'FOLLOWING',detail:'Gemeinsamer Trace und Lesepunkt bestätigt',sample:source.cursor,plate:stack.activePlate.plate,visible,sameSourceFingerprint:true});
  }catch(e){m.detail='HOLD · '+e.message;}
  const p={id:'pascal',status:'HOLD',detail:'Kein übernommener Player-Receipt',playerRunning:flag(input.player?.current?.running)};
  try{
   const record=input.pascal,witness=L.receipt(record?.witness);
   if(!record||record.schema!=='a0.player-pascal-readonly/1'||record.rule!=='PRINTED_Q4_BITS_AS_PASCAL_DECISIONS_V1'||!witness||record.word!==witness.q4Bits)throw Error('Pascal-Quellenrecord fehlt / ungültig');
   const expected=P.snapshot(record.word,record.pascal.record.kind==='endpoint',record.pascal.keyMode);
   if(expected.verdict!==record.bitsVerdict||expected.returned.value!==record.returnedBits)throw Error('Pascal-Returnreadback weicht ab');
   Object.assign(p,{word:record.word,layer:witness.layer,receiptSequence:record.receiptSequence,view:record.view,bitsVerdict:record.bitsVerdict,returnedBits:record.returnedBits});
   if(input.pascalFollowing===true){
    const current=['CONNECTED','HOLD_OPEN_LAYER'].includes(input.player?.link)?L.receipt(input.player.current?.receipt):null;
    if(!current||record.following!==true||record.readMode!=='LIVE_RECEIPT_FOLLOW'||record.receiptSequence!==input.player.seq||JSON.stringify(current)!==JSON.stringify(witness))throw Error('Kein frischer passender Player-Receipt');
    p.status='FOLLOWING';p.detail='Folgt gültigen Player-Receipts · Return nur der vier Bits';
   }else{p.status='HELD';p.detail='Einzelaufnahme gehalten · nicht live';}
  }catch(e){p.status='HOLD';p.detail='HOLD · '+e.message;}
  const g={id:'ihara',status:'HOLD',detail:'G(10,2)-/Visual-1-Quelle fehlt',clock:'MANUAL'};
  const c=input.cubic,v=input.visual1;
  if(v?.edge?.source==='C5'){g.status='SEPARATE';g.detail='Visual 1 liest C5 · kubischer Graph bleibt separat';}
  else if(c?.schema==='a0.ihara-cubic-bench/1'&&c.graph==='G(10,2)'&&c.directedCount===60&&c.degree===3&&Array.isArray(c.current)&&c.current.length===2&&c.current.every(x=>Number.isInteger(x)&&x>=0&&x<20)&&Number.isInteger(c.edgeIndex)&&c.edgeIndex>=0&&c.edgeIndex<60&&Number.isSafeInteger(c.revision)&&c.revision>=0&&!c.status?.startsWith('HOLD')&&v?.edge?.source==='G(10,2)'&&v.cubicWitness?.edgeIndex===c.edgeIndex&&v.cubicWitness?.revision===c.revision&&JSON.stringify(v.cubicWitness?.channel)===JSON.stringify(c.channel)&&v.edge.verdict===c.channel.verdict&&v.edge.confirmed===c.channel.committed&&JSON.stringify(v.incoming)===JSON.stringify(c.channel.incoming)&&JSON.stringify(v.candidate)===JSON.stringify(c.channel.candidate)){
   Object.assign(g,{status:'CONNECTED',detail:'Bestätigter Graph-Read · manuelle C/D-Schritte',edgeIndex:c.edgeIndex,current:c.current,revision:c.revision,verdict:c.channel.verdict,tesa:v.address,gridFollow:v.follow});
  }
  const links=[m,p,g];
  return{schema:'a0.binder-observed-connections/1',status:'READ_ONLY_OVERVIEW',links,
   summary:{connected:links.filter(x=>['FOLLOWING','CONNECTED'].includes(x.status)).length,held:links.filter(x=>x.status==='HELD').length,separate:links.filter(x=>x.status==='SEPARATE').length,holds:links.filter(x=>x.status==='HOLD').length},
   simultaneousSnapshot:false,additionalClock:false,playbackControl:false,wholeMachineReturn:false,primeBodyGraphIdentity:false};
 }
 function mount(doc,win){
  const host=doc.getElementById('binderConnections');if(!host)return null;
  if(doc.body?.classList?.contains('one-one-embedded-mode'))doc.getElementById('oneOnePlayerMonitor')?.append(host);
  const el=id=>doc.getElementById(id),subscriptions=new Map(),listeners=new Set();let current=null,disposed=false;
  const safe=fn=>{try{return fn();}catch{return null;}};
  function inputs(){return{
   m3:safe(()=>win.A0ApertureMeasurementController?.readSource()),
   stack:safe(()=>win.A0ApertureStackController?.record),
   stackFollowing:safe(()=>win.A0ApertureStackController?.following),stackRunning:safe(()=>win.A0ApertureStackController?.running),
   player:safe(()=>win.A0PlayerBenchMonitor?.snapshot()),pascal:safe(()=>win.A0PlayerPascalBridgeView?.snapshot()),pascalFollowing:safe(()=>win.A0PlayerPascalBridgeView?.following),
   cubic:safe(()=>win.A0IharaCubicController?.snapshot()),visual1:safe(()=>win.A0Visual1GridController?.snapshot())
  };}
  function bind(){
   for(const key of ['A0ApertureMeasurementController','A0ApertureStackController','A0PlayerBenchMonitor','A0PlayerPascalBridgeView','A0IharaCubicController','A0Visual1GridController']){
    const controller=win[key],prior=subscriptions.get(key);if(prior?.controller===controller)continue;
    prior?.off?.();subscriptions.delete(key);
    if(controller?.subscribe)subscriptions.set(key,{controller,off:controller.subscribe(render)});
   }
  }
  const labels={FOLLOWING:'FOLGT',CONNECTED:'VERBUNDEN',HELD:'GEHALTEN',SEPARATE:'GETRENNT',HOLD:'HOLD'};
  const clock=v=>v===null?'unbekannt':v?'spielt':'pausiert';
  function render(){
   if(disposed)return null;bind();current=report(inputs());
   for(const link of current.links){
    const card=el('binderLink_'+link.id);card.dataset.state=link.status;
    el('binderLinkStatus_'+link.id).textContent=labels[link.status];
    let detail=link.detail;
    if(link.id==='m3')detail+='\nM3 '+clock(link.m3Running)+' · Plattenuhr '+clock(link.stackRunning)+(link.sample===undefined?'':'\nSample '+(link.sample+1)+'/48 · '+link.plate+' · '+(link.visible?'sichtbar':'verdeckt'));
    if(link.id==='pascal')detail+='\nPlayer '+clock(link.playerRunning)+(link.word?'\nQ4 '+link.word+' · '+(link.view||'Grid')+' · Bits-Return '+link.bitsVerdict+' · Receipt #'+link.receiptSequence+'\nLage '+(link.layer===null?'offen · nur Bits gekoppelt':link.layer):'');
    if(link.id==='ihara'&&link.current)detail+='\nKante '+link.current.join('→')+' · Adresse '+link.edgeIndex+' · '+link.verdict+'\nTESA '+link.tesa+' · '+(link.gridFollow?'Follow':'manuelle Ansicht');
    el('binderLinkDetail_'+link.id).textContent=detail;
   }
   const s=current.summary,text=s.connected+'/3 verbunden · '+s.held+' gehalten · '+s.separate+' getrennt · '+s.holds+' HOLD · kein Gesamt-PASS';
   if(el('binderConnectionsStatus').textContent!==text)el('binderConnectionsStatus').textContent=text;
   el('binderConnectionsLedger').textContent=JSON.stringify(current,null,2);for(const fn of listeners)try{fn();}catch{}return clone(current);
  }
  function connectAvailable(){
   const errors=[];
   for(const [name,fn] of [
    ['M3 → Stack',()=>{if(!win.A0ApertureStackController?.setSharedFollow)throw Error('Adapter fehlt');win.A0ApertureStackController.setSharedFollow(true);}],
    ['Player → Pascal',()=>{if(!win.A0PlayerPascalBridgeView?.setFollow)throw Error('Adapter fehlt');win.A0PlayerPascalBridgeView.setFollow(true);}],
    ['Ihara → Visual 1',()=>{if(!win.A0Visual1GridController?.setEdgeSource)throw Error('Adapter fehlt');win.A0Visual1GridController.setEdgeSource('cubic');win.A0Visual1GridController.follow();}]
   ])try{fn();}catch(e){errors.push(name+': '+e.message);}
   el('binderConnectionsActions').textContent=errors.length?errors.join(' · '):'Vorhandene Follow-Verträge aktiviert · keine Quelle gestartet. Fehlende Receipts bleiben HOLD.';
   return render();
  }
  el('binderConnectionsConnect').addEventListener('click',connectAvailable);el('binderConnectionsRefresh').addEventListener('click',render);
  win.addEventListener?.('pagehide',()=>{disposed=true;for(const sub of subscriptions.values())sub.off?.();subscriptions.clear();});
  bind();connectAvailable();
  return{render,connectAvailable,snapshot:()=>report(inputs()),subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}};
 }
 return{report,mount};
});
