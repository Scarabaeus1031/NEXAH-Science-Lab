/* Window/token-bound read-only relay. Health requests never advance a model. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0PlayerBenchLink=api;api.mount(document,root);}})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const TYPE='a0-player-bench-readonly-v1',SOURCE='A0_WERKBANK.html',RELAY='A0_FAMILY_CONNECTION_ATLAS.html',GRAY=Array.from({length:16},(_,i)=>i^(i>>1)),clone=x=>JSON.parse(JSON.stringify(x));
 function receipt(s){
  if(!s||s.plate!=='tessarec'||!Number.isInteger(s.q4Address)||s.q4Address<0||s.q4Address>15||!(s.layer===null||Number.isInteger(s.layer)&&s.layer>=0&&s.layer<3))return null;
  const i=GRAY.indexOf(s.q4Address),d=s.layer===null?null:s.layer*16+(s.layer===1?15-i:i);
  return s.q4Bits===s.q4Address.toString(2).padStart(4,'0')&&s.deskIndex===d?{plate:s.plate,q4Address:s.q4Address,q4Bits:s.q4Bits,layer:s.layer,deskIndex:d}:null;
 }
 function compare(a,b){a=receipt(a);b=receipt(b);return!a||!b||a.layer===null||b.layer===null?'HOLD':JSON.stringify(a)===JSON.stringify(b)?'MATCH':'CHANGED';}
 function comparisonRows(s){
  const a=s.anchor,c=s.current?.receipt;
  return [['plate','Platte'],['q4Bits','Q4 · Bits'],['layer','Lage'],['deskIndex','Deskindex']].map(([key,label])=>{
   const av=a?.[key],cv=c?.[key],known=av!==null&&av!==undefined&&cv!==null&&cv!==undefined;
   return{key,label,anchor:av??'—',current:cv??'—',status:!known?'OFFEN':av===cv?'GLEICH':'GEÄNDERT'};
  });
 }
 function connectionCase(s,bench){
  const player=s.link==='CONNECTED'?receipt(s.current?.receipt):null;
  const stackReady=bench?.schema==='nexah.a0.aperture-stack-calibration/1'&&bench.source==='PXA_BLUE_IRIS_APERTURE'&&bench.sampleCount===48&&
   Number.isInteger(bench.activePlate?.index)&&bench.activePlate.index>=0&&bench.activePlate.index<6&&Number.isFinite(bench.activePlate.nominalAngleDeg)&&!!bench.sourceFingerprint;
  return{status:!player?'HOLD_PLAYER_ENDPOINT':!stackReady?'HOLD_BENCH_ENDPOINT':'HOLD_MISSING_SOURCE_CONTRACT',
   player:player?clone(player):null,bench:stackReady?{source:bench.source,fixture:bench.fixture?.id,plate:bench.activePlate.plate,index:bench.activePlate.index,angleDeg:bench.activePlate.nominalAngleDeg,sampleCount:bench.sampleCount,sourceFingerprint:clone(bench.sourceFingerprint)}:null,
   cut:null,operator:null,sourceWitness:null,expectedResult:null,counterexample:null,inverse:null,residual:null,
   simultaneousSnapshot:false,sourceWrites:false,wholeMachineReturn:false,
   boundary:'Endpoint availability only. No declared Player-to-Aperture mapping found in reviewed adapters; 48 addresses are not 48 trace samples. No comparison or numerical residual without a source-owned contract.'};
 }
 function nextStep(s){
  if(!s.current)return 'Nächster Schritt: „Aktuell lesen / neu verbinden“. Falls nötig das Deck im Club öffnen.';
  if(s.current.receipt.layer===null)return 'Empfang steht. Im Q4-Feld des Clubs eine Position in Q4−, Q4⁰ oder Q4+ wählen; Lage und Arbeitsfläche sind noch offen.';
  if(!s.anchor||s.anchor.layer===null)return 'Lage empfangen. Für einen stabilen Ausgangspunkt im Player pausieren, dann hier „Getrennte Anker erfassen“.';
  if(s.comparison.player==='CHANGED')return 'Änderung erkannt: Die Player-Koordinate weicht vom gespeicherten Anker ab. CHANGED ist hier kein Verbindungsfehler. Für einen neuen Ausgangspunkt erneut Anker erfassen.';
  return 'Player stimmt mit seinem Anker überein (MATCH). Nun im Q4-Feld des Clubs eine andere Position wählen: Erwartung CHANGED. Die Bench wird separat mit ihrem eigenen Anker verglichen.';
 }
 function createState(){
  let current=null,anchor=null,benchAnchor=null,link='HOLD',reason='Nicht verbunden',seq=-1,events=[];
  const note=s=>{events.push(s);events=events.slice(-12);};
  return{accept(m){
   if(!Number.isSafeInteger(m.seq)||m.seq<=seq)return false;seq=m.seq;
   if(m.source!==SOURCE||m.relay!==RELAY||m.connected!==true||typeof m.running!=='boolean'||!receipt(m.receipt)){current=null;link='HOLD';reason=m.connected!==true?'Player noch nicht verbunden · Deck im Club öffnen und erneut lesen':'Player antwortet · Record ungültig';note(reason);return true;}
   current={receipt:receipt(m.receipt),running:m.running};link=current.receipt.layer===null?'HOLD_OPEN_LAYER':'CONNECTED';reason=current.receipt.layer===null?'Adresse sichtbar; Lage offen':'Aktueller Quellenreceipt';return true;
  },hold(why){current=null;link='HOLD';reason=why;note(why);},
  capture(bench){anchor=current?clone(current.receipt):null;benchAnchor=bench?clone(bench):null;note('Getrennte Anker erfasst');},
  snapshot(bench){return{link,reason,seq,current:current?clone(current):null,anchor:anchor?clone(anchor):null,bench:bench?clone(bench):null,
   comparison:{player:link==='CONNECTED'?compare(anchor,current?.receipt):'HOLD',bench:!benchAnchor||!bench?'HOLD':JSON.stringify(benchAnchor)===JSON.stringify(bench)?'MATCH':'CHANGED',crossCarrier:'NOT_COMPARABLE'},
   sharedOperator:false,sharedClock:false,wholeMachineReturn:false,events:events.slice()};}};
 }
 function allowedOrigin(origin,win){return origin===win.location.origin||(win.location.protocol==='file:'&&origin==='null');}
 function sender(doc,win,button){
  let peer=null,token=null,seq=0,requestId=null,lastSignature=null,embedded=null;const status=doc.getElementById('clubBenchLinkStatus'),container=doc.getElementById('clubBenchMonitorHost');
  function emit(){if(!peer||peer.closed)return;const s=win.A0ClubReturnMonitor?.snapshot();
   const signature=JSON.stringify([s?.connected===true,s?.current||null,s?.running===true]);
   if(requestId===null&&signature===lastSignature)return;
   try{peer.postMessage({type:TYPE,token,seq:++seq,id:requestId,source:SOURCE,relay:RELAY,connected:s?.connected===true,receipt:s?.current||null,running:s?.running===true},'*');requestId=null;lastSignature=signature;}catch{if(status)status.textContent='HOLD · Bench nicht erreichbar';}}
  button.addEventListener('click',()=>{
   // Explicit monitor opening may load the one existing source, never play it.
   if(win.A0ClubDeck?.snapshot?.().loaded===false)win.A0ClubDeck.activate();
   if(peer&&!peer.closed){if(container){container.hidden=false;container.scrollIntoView?.({block:'start'});}else peer.focus?.();return;}
   const bytes=new Uint8Array(16);try{win.crypto.getRandomValues(bytes);}catch{if(status)status.textContent='HOLD · sichere Sitzungskennung nicht verfügbar';return;}token=Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');seq=0;requestId=null;lastSignature=null;
   const url=new URL('../A0_ORIENTATION_CONTROLLER_BENCH.html',win.location.href);url.searchParams.set('a0PlayerToken',token);url.hash='oneOnePlayerMonitor';
   if(container){
    url.searchParams.set('playerMonitorMode','embedded');
    embedded=doc.createElement('iframe');embedded.title='Lesender Player→Bench-Monitor · gleiche Club-Instanz';
    embedded.setAttribute('sandbox','allow-scripts allow-same-origin allow-top-navigation-by-user-activation');embedded.setAttribute('referrerpolicy','no-referrer');
    container.hidden=false;container.replaceChildren(embedded);peer=embedded.contentWindow;
    embedded.addEventListener('load',()=>{peer=embedded.contentWindow;if(status)status.textContent='Monitor im Club geladen · warte auf Leseanfrage';});
    embedded.src=url.href;container.scrollIntoView?.({block:'start'});
   }else{try{peer=win.open(url.href,'a0-player-readonly-bench-'+token);}catch{peer=null;}}
   if(status)status.textContent=peer?'Monitor geöffnet · wartet auf Leseanfrage':'HOLD · Monitor konnte nicht geöffnet werden';
  });
  win.addEventListener('message',e=>{
   if(!peer||e.source!==peer||!allowedOrigin(e.origin,win))return;
   const m=e.data;if(!m||m.type!==TYPE||m.token!==token)return;
   if(m.action==='detach'){peer=null;return;}
   if(m.action!=='read'||!Number.isSafeInteger(m.id)||m.id<1)return;
   try{peer.postMessage({type:TYPE,token,kind:'relay-ready',relay:RELAY,source:SOURCE,id:m.id},'*');}catch{return;}
   requestId=m.id;if(!win.A0ClubReturnMonitor?.requestReceipt?.())emit();
  });
  win.addEventListener('pagehide',()=>{if(peer&&!peer.closed)try{peer.postMessage({type:TYPE,token,seq:++seq,source:SOURCE,relay:RELAY,connected:false,running:false,receipt:null},'*');}catch{}peer=null;});
  const api={sourceChanged:emit};win.A0PlayerBenchRelay=api;return api;
 }
 function receiver(doc,win,host){
  const state=createState(),el=id=>doc.getElementById(id),subscribers=new Set();let token,mode;
  try{const url=new URL(win.location.href);token=url.searchParams.get('a0PlayerToken');mode=url.searchParams.get('playerMonitorMode');}catch{}
  const peer=mode==='embedded'&&win.parent!==win?win.parent:win.opener;
  if(mode==='embedded'){
   doc.body.classList.add('one-one-embedded-mode');
   // Isolate the existing receiver UI, retaining the actual Bench controllers
   // and record references; no second implementation of the stack.
   const shell=doc.createElement('main');shell.className='one-one-embedded-shell';
   doc.body.append(shell);shell.append(host);
   for(const child of [...doc.body.children])if(child!==shell)child.hidden=true;
  }
  const enabled=!!peer&&/^[a-f0-9]{32}$/.test(token||'');let serial=0,pending=null,timer=null,poll=null,stopped=false;
  let relaySeen=false;
  const bench=()=>win.A0ApertureStackController?.record||null;
  function render(){
   const s=state.snapshot(bench());host.dataset.state=s.link;el('oneOnePlayerStatus').textContent=s.link+' · '+s.reason;
   el('oneOnePlayerCoordinate').textContent=s.current?'Player · Q4 '+s.current.receipt.q4Bits+' · Lage '+(s.current.receipt.layer===null?'offen':s.current.receipt.layer)+' · Arbeitsfläche '+(s.current.receipt.deskIndex??'offen')+' · '+(s.current.running?'spielt':'pausiert'):'Kein aktueller Player-Record';
   el('oneOnePlayerComparison').textContent='Player ↔ eigener Anker: '+s.comparison.player+' · Bench ↔ eigener Anker: '+s.comparison.bench+' · Player ↔ Bench: verschiedene Träger / nicht vergleichbar';
   const fields=el('oneOnePlayerFields');
   if(fields){const rows=comparisonRows(s).map(r=>{
    const tr=doc.createElement('tr');tr.dataset.result=r.status;
    for(const [i,value] of [r.label,r.anchor,r.current,r.status].entries()){
     const cell=doc.createElement(i===0?'th':'td');if(i===0)cell.setAttribute('scope','row');cell.textContent=String(value);tr.append(cell);
    }return tr;
   });fields.replaceChildren(...rows);}
   const guide=el('oneOnePlayerNext');if(guide)guide.textContent=nextStep(s);
   const seam=el('oneOnePlayerCase');
   if(seam){const c=connectionCase(s,bench());seam.textContent=c.status+'\nPlayer: '+(c.player?'Q4 '+c.player.q4Bits+' / Lage '+c.player.layer+' / Arbeitsfläche '+c.player.deskIndex:'kein vollständiger aktueller Anschluss')+'\nBench: '+(c.bench?c.bench.fixture+' / '+c.bench.plate+' / '+c.bench.angleDeg+'° / 48 Samples':'kein lesbarer Stack-Anschluss')+'\nSchnitt / Operator / Quellenbeleg / erwartetes Ergebnis / Gegenprobe / Rückweg: offen.\nResiduum: nicht definiert (nicht 0). Keine simultane Aufnahme und keine Quellensteuerung.';}
   el('oneOnePlayerLedger').textContent=JSON.stringify({...s,connectionCase:connectionCase(s,bench()),transport:mode==='embedded'?'parent_iframe':'opener_window',relaySeen},null,2);el('oneOnePlayerCapture').disabled=!s.current;
   win.A0PlayerPascalBridgeView?.refreshAvailability();
   for(const fn of subscribers)try{fn();}catch(error){win.console?.error?.(error);}
  }
  function clear(){win.clearTimeout(timer);win.clearTimeout(poll);timer=poll=null;}
  function hold(reason){clear();pending=null;stopped=true;state.hold(reason);render();}
  function read(){
   clear();if(!enabled){hold('Im Club „Bench-Monitor öffnen“ wählen');return;}
   if(stopped||doc.hidden){hold('Monitor angehalten / Dokument verborgen');return;}
   if(peer.closed){hold('Club-Fenster geschlossen');return;}
   pending=++serial;const id=pending;
   relaySeen=false;
   timer=win.setTimeout(()=>{if(pending===id)hold(relaySeen?'Timeout · Club antwortet, Player liefert keinen frischen Receipt':'Timeout · keine Club-Verbindung; alten separaten Tab schließen und Monitor im Club neu öffnen');},3000);
   try{peer.postMessage({type:TYPE,token,action:'read',id},'*');}catch{hold('Quelle nicht erreichbar');}
  }
  win.addEventListener('message',e=>{
   if(!enabled||stopped||doc.hidden||e.source!==peer||!allowedOrigin(e.origin,win))return;
   const m=e.data;if(!m||m.type!==TYPE||m.token!==token)return;
   if(m.kind==='relay-ready'){
    if(m.relay===RELAY&&m.source===SOURCE&&m.id===pending){relaySeen=true;el('oneOnePlayerStatus').textContent='Club verbunden · warte auf frischen Player-Receipt';}
    return;
   }
   if(!state.accept(m))return;
   if(m.id===pending){win.clearTimeout(timer);pending=null;poll=win.setTimeout(read,1200);}
   if(state.snapshot(bench()).link==='HOLD'){hold(state.snapshot(bench()).reason);return;}
   render();
  });
  el('oneOnePlayerRead').addEventListener('click',()=>{stopped=false;read();});
  el('oneOnePlayerStop').addEventListener('click',()=>{stopped=true;hold('Lesender Monitor getrennt; Player unverändert');});
  el('oneOnePlayerCapture').addEventListener('click',()=>{state.capture(bench());render();});
  el('oneOnePlayerCompare').addEventListener('click',render);
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)hold('Monitor verborgen · neu lesen zum Fortsetzen');});
  win.addEventListener('pagehide',()=>{clear();stopped=true;if(enabled)try{peer.postMessage({type:TYPE,token,action:'detach'},'*');}catch{}});
  render();if(enabled)read();else hold('Im Club „Bench-Monitor öffnen“ wählen');
  const api={snapshot:()=>state.snapshot(bench()),read,render,subscribe(fn){subscribers.add(fn);return()=>subscribers.delete(fn)}};win.A0PlayerBenchMonitor=api;return api;
 }
 function mount(doc,win){const button=doc.getElementById('clubOpenBenchMonitor'),host=doc.getElementById('oneOnePlayerMonitor');return button?sender(doc,win,button):host?receiver(doc,win,host):null;}
 return{TYPE,SOURCE,RELAY,receipt,compare,comparisonRows,connectionCase,nextStep,createState,allowedOrigin,sender,receiver,mount};
});
