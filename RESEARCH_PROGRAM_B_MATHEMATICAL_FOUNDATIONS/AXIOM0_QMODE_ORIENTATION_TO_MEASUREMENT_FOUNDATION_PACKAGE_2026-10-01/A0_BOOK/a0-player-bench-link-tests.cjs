const assert=require('node:assert/strict'),fs=require('node:fs'),A=require('./a0-player-bench-link.js'),Native=require('./a0-club-return-monitor.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=v=>{assert.ok(v);checks++};
const coordinate=(a=0,l=0)=>{const k=Native.GRAY.indexOf(a);return{plate:'tessarec',q4Address:a,q4Bits:a.toString(2).padStart(4,'0'),layer:l,deskIndex:l===null?null:l*16+(l===1?15-k:k)};};
const packet=(seq=1,s=coordinate())=>({type:A.TYPE,source:A.SOURCE,relay:A.RELAY,seq,connected:true,running:true,receipt:s});
// Existing source-local calibration fixtures are not a Player coordinate map.
const Calibration=require('./a0-aperture-stack-calibration.js');
const endpointState={link:'CONNECTED',current:{receipt:coordinate()}},stack=Calibration.buildRecord({plateIndex:0}),seam=A.connectionCase(endpointState,stack);
eq(seam.status,'HOLD_MISSING_SOURCE_CONTRACT');eq(seam.player.deskIndex,0);eq(seam.bench.plate,'P1');eq(seam.bench.sampleCount,48);
for(const key of ['cut','operator','sourceWitness','expectedResult','counterexample','inverse','residual'])eq(seam[key],null);
eq(seam.wholeMachineReturn,false);eq(seam.sourceWrites,false);
eq(A.connectionCase({link:'HOLD',current:endpointState.current},stack).status,'HOLD_PLAYER_ENDPOINT');
eq(A.connectionCase({link:'HOLD_OPEN_LAYER',current:{receipt:coordinate(0,null)}},stack).status,'HOLD_PLAYER_ENDPOINT');
eq(A.connectionCase(endpointState,null).status,'HOLD_BENCH_ENDPOINT');
eq(A.connectionCase(endpointState,{...stack,sampleCount:47}).status,'HOLD_BENCH_ENDPOINT');
for(let l=0;l<3;l++)for(let a=0;a<16;a++)eq(A.connectionCase({link:'CONNECTED',current:{receipt:coordinate(a,l)}},stack).status,'HOLD_MISSING_SOURCE_CONTRACT');
for(let i=0;i<6;i++)eq(A.connectionCase(endpointState,Calibration.buildRecord({plateIndex:i})).operator,null);
seam.player.q4Bits='tampered';eq(endpointState.current.receipt.q4Bits,'0000');
eq(A.comparisonRows({current:null,anchor:null}).map(r=>r.status),['OFFEN','OFFEN','OFFEN','OFFEN']);
eq(A.comparisonRows({current:{receipt:coordinate()},anchor:coordinate()}).map(r=>r.status),['GLEICH','GLEICH','GLEICH','GLEICH']);
eq(A.comparisonRows({current:{receipt:coordinate(1)},anchor:coordinate()}).map(r=>r.status),['GLEICH','GEÄNDERT','GLEICH','GEÄNDERT']);
eq(A.comparisonRows({current:{receipt:coordinate(1,null)},anchor:coordinate(1,null)}).map(r=>r.status),['GLEICH','GLEICH','OFFEN','OFFEN']);
eq(A.comparisonRows({current:null,anchor:coordinate()})[1].current,'—');
ok(A.nextStep({current:null}).includes('neu verbinden'));
ok(A.nextStep({current:{receipt:coordinate(1,null)}}).includes('Lage und Desk'));
ok(A.nextStep({current:{receipt:coordinate()},anchor:null}).includes('Anker erfassen'));
ok(A.nextStep({current:{receipt:coordinate()},anchor:coordinate(),comparison:{player:'CHANGED'}}).includes('kein Verbindungsfehler'));
ok(A.nextStep({current:{receipt:coordinate()},anchor:coordinate(),comparison:{player:'MATCH'}}).includes('Erwartung CHANGED'));
for(let l=0;l<3;l++)for(let a=0;a<16;a++){eq(A.receipt(coordinate(a,l)),Native.receipt(coordinate(a,l)));eq(A.compare(coordinate(a,l),coordinate(a,l)),'MATCH');}
for(const bad of [{q4Bits:'00001'},{layer:3},{q4Address:16},{deskIndex:100},{plate:'x'}])eq(A.receipt({...coordinate(),...bad}),null);
eq(A.compare(coordinate(1,null),coordinate(1,null)),'HOLD');
const state=A.createState();state.accept(packet());state.capture({plate:'P3'});eq(state.snapshot({plate:'P3'}).comparison,{player:'MATCH',bench:'MATCH',crossCarrier:'NOT_COMPARABLE'});
state.accept(packet(2,coordinate(1)));eq(state.snapshot({plate:'P4'}).comparison.player,'CHANGED');eq(state.snapshot({plate:'P4'}).comparison.bench,'CHANGED');
eq(state.accept(packet(1)),false);state.accept(packet(3,coordinate(2,null)));eq(state.snapshot({}).link,'HOLD_OPEN_LAYER');eq(state.snapshot({}).comparison.player,'HOLD');
state.accept({...packet(4),source:'fake'});eq(state.snapshot({}).current,null);
state.accept(packet(5));const c=state.snapshot({});c.current.receipt.q4Address=99;eq(state.snapshot({}).current.receipt.q4Address,0);
function node(){return{dataset:{},events:{},addEventListener(k,f){this.events[k]=f}}}
function receiving(embedded=false){
 const ids=['oneOnePlayerMonitor','oneOnePlayerStatus','oneOnePlayerCoordinate','oneOnePlayerComparison','oneOnePlayerLedger','oneOnePlayerCapture','oneOnePlayerRead','oneOnePlayerStop','oneOnePlayerCompare'],nodes=Object.fromEntries(ids.map(id=>[id,node()])),events={},timers=new Map(),sent=[];let count=0;
 const token='ab'.repeat(16),peer={closed:false,postMessage:m=>sent.push(m)},bench={plate:'P3'};
 const body={children:[node()],classList:{add(v){this.value=v}},append(v){this.children.push(v)}};
 nodes.oneOnePlayerFields={replaceChildren(...rows){this.rows=rows}};
 const doc={hidden:false,body,createElement:()=>({...node(),cells:[],setAttribute(){},append(v){this.child=v;this.cells.push(v)}}),getElementById:id=>nodes[id],addEventListener(k,f){events['doc:'+k]=f}};
 const win={opener:peer,location:{href:'file:///bench.html?a0PlayerToken='+token,protocol:'file:',origin:'null'},A0ApertureStackController:{record:bench},addEventListener(k,f){events[k]=f},setTimeout(f,ms){timers.set(++count,{f,ms});return count},clearTimeout(id){timers.delete(id)}};
 if(embedded){win.location.href+='&playerMonitorMode=embedded';win.parent=peer;win.opener=null;}
 const api=A.receiver(doc,win,nodes.oneOnePlayerMonitor);
 const emit=(m,source=peer,origin='null')=>events.message({source,origin,data:{...m,token}});
 return{api,win,doc,nodes,events,timers,sent,peer,emit,token};
}
const r=receiving();eq(r.sent[0].action,'read');eq(r.api.snapshot().current,null);
eq(r.nodes.oneOnePlayerFields.rows.length,4);eq(r.nodes.oneOnePlayerFields.rows[0].dataset.result,'OFFEN');
r.emit(packet(),{});eq(r.api.snapshot().current,null);r.emit(packet(),r.peer,'https://evil.invalid');eq(r.api.snapshot().current,null);
r.events.message({source:r.peer,origin:'null',data:{...packet(),token:'wrong'}});eq(r.api.snapshot().current,null);
r.emit({...packet(),id:r.sent[0].id});eq(r.api.snapshot().link,'CONNECTED');eq(r.timers.size,1);eq([...r.timers.values()][0].ms,1200);
r.nodes.oneOnePlayerCapture.events.click();eq(r.api.snapshot().comparison.player,'MATCH');r.win.A0ApertureStackController.record={plate:'P4'};r.nodes.oneOnePlayerCompare.events.click();eq(r.api.snapshot().comparison.bench,'CHANGED');
eq(r.nodes.oneOnePlayerFields.rows[1].dataset.result,'GLEICH');eq(r.nodes.oneOnePlayerFields.rows[1].cells[1].textContent,'0000');
r.emit(packet(2,coordinate(1)));eq(r.api.snapshot().comparison.player,'CHANGED');
eq(r.nodes.oneOnePlayerFields.rows[1].dataset.result,'GEÄNDERT');eq(r.nodes.oneOnePlayerFields.rows[1].cells[2].textContent,'0001');
const next=[...r.timers.values()][0].f;next();eq(r.sent.at(-1).action,'read');
const timeout=[...r.timers.values()].find(t=>t.ms===3000);timeout.f();eq(r.api.snapshot().link,'HOLD');eq(r.api.snapshot().current,null);
r.emit({...packet(3),id:r.sent.at(-1).id});eq(r.api.snapshot().link,'HOLD'); // no late resurrection
r.nodes.oneOnePlayerRead.events.click();r.emit({...packet(4,coordinate(4,null)),id:r.sent.at(-1).id});eq(r.api.snapshot().link,'HOLD_OPEN_LAYER');eq(r.api.snapshot().comparison.player,'HOLD');
r.nodes.oneOnePlayerStop.events.click();eq(r.api.snapshot().current,null);ok(r.sent.every(m=>m.action==='read'));
r.nodes.oneOnePlayerRead.events.click();r.emit({...packet(5),id:r.sent.at(-1).id});r.doc.hidden=true;r.events['doc:visibilitychange']();eq(r.api.snapshot().link,'HOLD');
r.doc.hidden=false;r.nodes.oneOnePlayerRead.events.click();r.emit({...packet(6),id:r.sent.at(-1).id});r.peer.closed=true;[...r.timers.values()].find(t=>t.ms===1200).f();eq(r.api.snapshot().link,'HOLD');
r.events.pagehide();eq(r.sent.at(-1).action,'detach');
const sNodes={clubBenchLinkStatus:node()},sEvents={},out=[];let opens=0,reads=0,focus=0;
const peer={closed:false,focus(){focus++},postMessage:m=>out.push(m)},monitor={current:coordinate(),connected:true,running:true};
const sw={location:{href:'file:///A0_BOOK/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html',protocol:'file:',origin:'null'},crypto:{getRandomValues:a=>a.fill(171)},open(url){opens++;ok(url.includes('A0_ORIENTATION_CONTROLLER_BENCH.html'));return peer},addEventListener(k,f){sEvents[k]=f},A0ClubReturnMonitor:{snapshot:()=>monitor,requestReceipt(){reads++;return true}}},button=node();
const sender=A.sender({getElementById:id=>sNodes[id]},sw,button);button.events.click();button.events.click();eq(opens,1);eq(focus,1);
const send=(action,source=peer,origin='null',token='ab'.repeat(16))=>sEvents.message({source,origin,data:{type:A.TYPE,token,action,id:1}});
for(const action of ['play','pause','select','reset'])send(action);eq(reads,0);
send('read',{});send('read',peer,'https://evil.invalid');send('read',peer,'null','bad');eq(reads,0);
send('read');eq(reads,1);eq(out.length,1);eq(out[0].kind,'relay-ready');ok(!out[0].receipt);sender.sourceChanged();eq(out.length,2);eq(out[1].id,1);eq(out[1].receipt,coordinate());sender.sourceChanged();eq(out.length,2);send('read');sender.sourceChanged();eq(out.length,4);
monitor.connected=false;sender.sourceChanged();eq(out.at(-1).connected,false);sEvents.pagehide();eq(out.at(-1).connected,false);
sw.open=()=>{throw Error('popup blocked')};button.events.click();ok(sNodes.clubBenchLinkStatus.textContent.includes('HOLD'));
sw.crypto={getRandomValues(){throw Error('crypto unavailable')}};button.events.click();ok(sNodes.clubBenchLinkStatus.textContent.includes('Sitzungskennung'));
// A monitor request goes to the existing original iframe only, using 'read'.
const native=fs.readFileSync(__dirname+'/a0-club-return-monitor.js','utf8');ok(native.includes("requestReceipt:()=>send('read',{})"));ok(native.includes('A0PlayerBenchRelay?.sourceChanged()'));
const code=fs.readFileSync(__dirname+'/a0-player-bench-link.js','utf8');ok(!/setInterval|\.choose\(|\.setPlaying\(|\.pause\(|\.step\(|\.reset\(/.test(code));
// Real native-monitor + relay chain: a read waits for the original iframe,
// rather than forwarding the cached coordinate as a fresh acknowledgment.
const bus={},nativeCommands=[],forwarded=[],nativeNodes=Object.fromEntries(['clubReturnMonitor','clubReturnField','clubReturnPosition','clubReturnResult','clubReturnFamily','clubReturnCheck','clubReturnPlay','clubBenchLinkStatus'].map(id=>[id,{...node(),children:[],attrs:{},append(c){this.children.push(c)},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]}}]));
const nativeDoc={getElementById:id=>nativeNodes[id],createElement:()=>({...node(),children:[],attrs:{},append(c){this.children.push(c)},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]}}),addEventListener(){}};
const nativePeer={closed:false,postMessage:m=>forwarded.push(m)},iframeSource={postMessage:m=>nativeCommands.push(m)},nativeWin={location:{href:'file:///A0_BOOK/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html',protocol:'file:',origin:'null'},crypto:{getRandomValues:a=>a.fill(171)},open:()=>nativePeer,setTimeout:()=>1,clearTimeout(){},requestAnimationFrame:f=>f(),addEventListener(k,f){(bus[k]??=[]).push(f)}};
nativeWin.A0ClubReturnMonitor=Native.mount(nativeDoc,nativeWin);
const frame={contentWindow:iframeSource,addEventListener(k,f){this[k]=f}},nativeButton=node();nativeWin.A0ClubReturnMonitor.watchFrame(frame);frame.load();
A.sender(nativeDoc,nativeWin,nativeButton);nativeButton.events.click();
const dispatch=e=>bus.message.forEach(f=>f(e));
dispatch({source:iframeSource,origin:'null',data:{type:Native.TYPE,source:Native.SOURCE,receipt:coordinate(2),running:true}});
forwarded.length=0;
dispatch({source:nativePeer,origin:'null',data:{type:A.TYPE,token:'ab'.repeat(16),action:'read',id:7}});
eq(forwarded.length,1);eq(forwarded[0].kind,'relay-ready');ok(!forwarded[0].receipt);eq(nativeCommands.at(-1).action,'read');
dispatch({source:iframeSource,origin:'null',data:{type:Native.TYPE,source:Native.SOURCE,receipt:coordinate(3),running:true}});
eq(forwarded.at(-1).id,7);eq(forwarded.at(-1).receipt.q4Address,3);ok(nativeCommands.every(m=>m.action==='read'));
const er=receiving(true);eq(er.sent[0].action,'read');eq(er.doc.body.classList.value,'one-one-embedded-mode');eq(er.doc.body.children[0].hidden,true);eq(er.doc.body.children.at(-1).child,er.nodes.oneOnePlayerMonitor);
er.emit({type:A.TYPE,kind:'relay-ready',source:A.SOURCE,relay:A.RELAY,id:1});eq(er.api.snapshot().current,null);ok(er.nodes.oneOnePlayerStatus.textContent.includes('Club verbunden'));
[...er.timers.values()].find(t=>t.ms===3000).f();ok(er.api.snapshot().reason.includes('Player liefert keinen'));
er.nodes.oneOnePlayerRead.events.click();er.emit({...packet(),id:er.sent.at(-1).id});eq(er.api.snapshot().link,'CONNECTED');
er.emit({...packet(2),connected:false});ok(er.api.snapshot().reason.includes('Deck im Club öffnen'));
// Explicit opening loads only the existing lazy deck; subsequent opens reuse it.
let deckLoads=0,loaded=false;sw.crypto={getRandomValues:a=>a.fill(171)};sw.open=()=>peer;peer.closed=false;
sw.A0ClubDeck={snapshot:()=>({loaded}),activate(){deckLoads++;loaded=true}};
button.events.click();button.events.click();eq(deckLoads,1);
const embeddedHost={replaceChildren(v){this.frame=v},scrollIntoView(){}},embeddedFrame={...node(),contentWindow:peer,setAttribute(){}};
const embeddedButton=node();A.sender({getElementById:id=>id==='clubBenchMonitorHost'?embeddedHost:sNodes[id],createElement:()=>embeddedFrame},sw,embeddedButton);embeddedButton.events.click();
ok(embeddedFrame.src.includes('playerMonitorMode=embedded'));eq(embeddedHost.hidden,false);eq(embeddedHost.frame,embeddedFrame);
console.log(JSON.stringify({status:'PASS',checks,scope:'48 native coordinates; embedded parent, one lazy deck, UI isolation; source/origin/token/sequence boundaries, fresh read handshake, timeout and late packets, hidden/closed/detached, anchors and noncomparability, no playback commands; browser pixels OPEN'}));
