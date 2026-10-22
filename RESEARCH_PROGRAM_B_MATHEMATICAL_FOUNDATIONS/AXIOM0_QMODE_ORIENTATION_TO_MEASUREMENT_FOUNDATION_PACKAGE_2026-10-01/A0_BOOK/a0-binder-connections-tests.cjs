'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),D=require('./a0-binder-connections.js'),M=require('./a0-aperture-measurement.js'),S=require('./a0-aperture-stack-calibration.js'),L=require('./a0-player-bench-link.js'),P=require('./a0-player-pascal-bridge.js'),C=require('./a0-ihara-cubic-bench.js'),V=require('./a0-visual1-grid-generator.js'),B=require('./a0-system-binder.js'),Native=require('./a0-club-return-monitor.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++},clone=x=>JSON.parse(JSON.stringify(x));
const receipt=(a=5,l=0)=>{const k=Native.GRAY.indexOf(a);return{plate:'tessarec',q4Address:a,q4Bits:a.toString(2).padStart(4,'0'),layer:l,deskIndex:l===null?null:l*16+(l===1?15-k:k)};};
const trace=M.createTrace(),m3={trace,record:M.buildRecord(),cursor:0,running:false},stack={...S.buildRecord(),m3Link:{mode:'SHARED_SOURCE_RECORD',sourceIndex:0,visible:S.inspectPlate(trace,S.stackFixture().plates[0]).visibleIndices.includes(0)}};
const cubic=C.read(C.step(C.create(),'d')),base={journey:{phaseIndex:0},edge:{incoming:{from:0,to:1},candidate:{from:1,to:2},layer:0},aperture:42},visual1=V.derive({...base,cubic},null,'cubic');
const player={link:'CONNECTED',seq:1,current:{receipt:receipt(),running:true}},pascal={...P.transfer(receipt()),receiptSequence:1,following:true,readMode:'LIVE_RECEIPT_FOLLOW',view:'grid'};
const input={m3,stack,stackFollowing:true,stackRunning:false,player,pascal,pascalFollowing:true,cubic,visual1};
const good=D.report(input);eq(good.summary.connected,3);eq(good.wholeMachineReturn,false);eq(good.additionalClock,false);eq(good.simultaneousSnapshot,false);eq(good.links[0].m3Running,false);eq(good.links[2].clock,'MANUAL');
eq(D.report({}).summary.holds,3);
eq(D.report({...input,stack:{...stack,sourceFingerprint:'tampered'}}).links[0].status,'HOLD');
eq(D.report({...input,stack:{...stack,m3Link:{...stack.m3Link,sourceIndex:2}}}).links[0].status,'HOLD');
eq(D.report({...input,stack:{...stack,m3Link:{...stack.m3Link,visible:!stack.m3Link.visible}}}).links[0].status,'HOLD');
eq(D.report({...input,stackFollowing:false}).links[0].status,'SEPARATE');
eq(D.report({...input,pascal:{...pascal,receiptSequence:0}}).links[1].status,'HOLD');
eq(D.report({...input,player:{...player,link:'HOLD',current:null}}).links[1].status,'HOLD');
eq(D.report({...input,pascal:{...pascal,returnedBits:'1111'}}).links[1].status,'HOLD');
eq(D.report({...input,pascalFollowing:false}).links[1].status,'HELD');
const loss={...P.transfer(receipt(),{endpointOnly:true}),receiptSequence:1,following:true,readMode:'LIVE_RECEIPT_FOLLOW'};
eq(D.report({...input,pascal:loss}).links[1].status,'FOLLOWING');eq(D.report({...input,pascal:loss}).links[1].bitsVerdict,'HOLD'); // transport is not a mathematical PASS
eq(D.report({...input,visual1:V.derive(base)}).links[2].status,'SEPARATE');
eq(D.report({...input,cubic:{...cubic,revision:999}}).links[2].status,'HOLD');
eq(D.report({...input,cubic:{...cubic,directedCount:5}}).links[2].status,'HOLD');
eq(D.report({...input,cubic:{...cubic,status:'HOLD_JOURNAL_FULL'}}).links[2].status,'HOLD');
class Node{
 constructor(){this.value='';this.checked=false;this.dataset={};this.children=[];this.events={};this.classList={toggle(){},add(){},remove(){},contains(){return false;}};}
 get firstChild(){return this.children[0]||null;}
 appendChild(n){this.children.push(n);}append(n){this.children.push(n);n.parent=this;}removeChild(n){this.children.splice(this.children.indexOf(n),1);}
 replaceChildren(...children){this.children=children;}setAttribute(){}
 addEventListener(k,f){(this.events[k]??=[]).push(f);}fire(k){for(const f of this.events[k]||[])f({});}
 querySelectorAll(){return [];}
}
const ids=['apertureMeasurement','m3MeasureSvg','m3Play','m3Step','m3Reset','m3Speed','m3Cut','m3CompareA','m3CompareB','m3Metric','m3Readout','m3Ledger','m3Export','pxaAperture','m3H','m3A','m3I','m3Index','m3Status','apertureStackCalibration','apStackSvg','apStackPlay','apStackStep','apStackReset','apStackSpeed','apStackMode','apStackWindow','apStackWindowOut','apStackPlate','apStackAngle','apStackDelta','apStackVisible','apStackMetric','apStackLedger','apStackStatus','apStackExport','apStackFollowM3','apStackM3Status','oneOnePlayerMonitor','oneOnePlayerStatus','oneOnePlayerCoordinate','oneOnePlayerComparison','oneOnePlayerLedger','oneOnePlayerCapture','oneOnePlayerRead','oneOnePlayerStop','oneOnePlayerCompare','oneOnePlayerPascal','playerPascalRead','playerPascalView','playerPascalProjection','playerPascalKey','playerPascalSvg','playerPascalResult','playerPascalLedger','playerPascalFollow','cubicReadout','cubicSvg','cubicLedger','cubicReverse','cubicReset','visual1GridGenerator','pxaTesaGenerator','binderConnections','binderConnectionsStatus','binderConnectionsLedger','binderConnectionsConnect','binderConnectionsRefresh','binderConnectionsActions','binderLink_m3','binderLink_pascal','binderLink_ihara','binderLinkStatus_m3','binderLinkStatus_pascal','binderLinkStatus_ihara','binderLinkDetail_m3','binderLinkDetail_pascal','binderLinkDetail_ihara','systemBinder','systemBinderConnect','systemBinderStart','systemBinderPause','systemBinderStep','systemBinderReset','systemBinderExport','systemBinderPhase','systemBinderLedger','systemBinderStatus'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Node()]));
for(const [id,value] of Object.entries({m3Speed:'420',m3Cut:'.5',m3CompareA:'unrolled',m3CompareB:'top',pxaAperture:'42',apStackMode:'source',apStackSpeed:'700',apStackWindow:'52',playerPascalView:'grid',playerPascalProjection:'path',playerPascalKey:'none'}))nodes[id].value=value;
nodes.apStackFollowM3.checked=true;
const root=new Node(),branches=['c','d'].map(v=>{const n=new Node();n.dataset.iharaBranch=v;return n;});root.querySelectorAll=()=>branches;
const h=Object.fromEntries(['data-v1-edge-source','data-visual1-tesa-grid','data-v1-p','data-v1-a','data-v1-e','data-v1-status','data-v1-follow','data-v1-step'].map(k=>[k,new Node()]));
const mini=Object.fromEntries(['data-visual1-tesa-grid','data-v1-mini-status','data-v1-mini-follow'].map(k=>[k,new Node()]));
h['data-v1-edge-source'].value='c5';nodes.visual1GridGenerator.querySelector=q=>h[q.slice(1,-1)];nodes.pxaTesaGenerator.querySelector=q=>mini[q.slice(1,-1)];
const events={},intervals=new Map(),timeouts=new Map(),sent=[];let serial=0;
const doc={hidden:false,body:new Node(),getElementById:id=>nodes[id],querySelector:q=>q==='[data-ihara-cubic-fork]'?root:null,createElement:()=>new Node(),createElementNS:()=>new Node(),addEventListener(k,f){(events['doc:'+k]??=[]).push(f);}};
const peer={closed:false,postMessage:m=>sent.push(m)},token='ab'.repeat(16);
const win={opener:peer,location:{href:'file:///bench.html?a0PlayerToken='+token,protocol:'file:',origin:'null'},console:{error(){}},matchMedia:()=>({matches:false}),
 setInterval(f){intervals.set(++serial,f);return serial;},clearInterval(id){intervals.delete(id);},setTimeout(f,ms){timeouts.set(++serial,{f,ms});return serial;},clearTimeout(id){timeouts.delete(id);},
 addEventListener(k,f){(events[k]??=[]).push(f);},A0Visual1BenchState:()=>clone(base)};
doc.defaultView=win;
win.A0ApertureMeasurementController=M.mount(doc,win);win.A0ApertureStackController=S.mount(doc,win);
win.A0IharaCubicController=C.mount(doc,win);win.A0Visual1GridController=V.mount(doc,win);
L.receiver(doc,win,nodes.oneOnePlayerMonitor);win.A0PlayerPascalBridgeView=P.mount(doc,win);
win.A0SystemBinderController=B.mount(doc,win);
const commandTrap=()=>{throw Error('unrequested engine command');};win.A0MasterDemoBridge={start:commandTrap,step:commandTrap};win.A0PentagonBench={connect:commandTrap};
const beforeSent=sent.length,beforeTimers=timeouts.size;win.A0BinderConnectionsView=D.mount(doc,win);const dashboard=win.A0BinderConnectionsView;
eq(intervals.size,0);eq(timeouts.size,beforeTimers);eq(sent.length,beforeSent);eq(dashboard.snapshot().summary.connected,2);eq(dashboard.snapshot().links[1].status,'HOLD');eq(win.A0IharaCubicController.snapshot().revision,0);
eq(win.A0SystemBinderController.receipt.observedConnections.schema,'a0.binder-observed-connections/1');eq(win.A0SystemBinderController.receipt.systems.length,4);
let seq=0;
function emit(a,l=0){
 const packet={type:L.TYPE,token,source:L.SOURCE,relay:L.RELAY,seq:++seq,id:sent.at(-1).id,connected:true,running:true,receipt:receipt(a,l)};
 for(const f of events.message||[])f({source:peer,origin:'null',data:packet});
}
emit(5);eq(dashboard.snapshot().summary.connected,3);eq(win.A0PlayerPascalBridgeView.snapshot().word,'0101');ok(nodes.playerPascalResult.textContent.includes('LIVE FOLLOW'));
for(const layer of [null,0,1,2])for(let a=0;a<16;a++){emit(a,layer);eq(dashboard.snapshot().links[1].status,'FOLLOWING');eq(dashboard.snapshot().links[1].word,receipt(a,layer).q4Bits);}
nodes.playerPascalRead.fire('click');eq(win.A0PlayerPascalBridgeView.following,false);eq(dashboard.snapshot().links[1].status,'HELD');const held=win.A0PlayerPascalBridgeView.snapshot().word;
emit(0);eq(win.A0PlayerPascalBridgeView.snapshot().word,held);
nodes.playerPascalFollow.checked=true;nodes.playerPascalFollow.fire('change');eq(dashboard.snapshot().links[1].word,'0000');
nodes.playerPascalProjection.value='endpoint';nodes.playerPascalProjection.fire('change');emit(5);eq(dashboard.snapshot().links[1].bitsVerdict,'HOLD');eq(dashboard.snapshot().links[1].status,'FOLLOWING');
nodes.oneOnePlayerStop.fire('click');eq(dashboard.snapshot().links[1].status,'HOLD');eq(win.A0PlayerPascalBridgeView.snapshot(),null);
win.A0PlayerPascalBridgeView.render();eq(win.A0PlayerPascalBridgeView.snapshot(),null); // no stale live resurrection
nodes.oneOnePlayerRead.fire('click');emit(9);eq(dashboard.snapshot().links[1].word,'1001');eq(dashboard.snapshot().links[1].status,'FOLLOWING');
const m3Controller=win.A0ApertureMeasurementController,stackController=win.A0ApertureStackController;
let notifications=0;const unsubscribeAudit=dashboard.subscribe(()=>notifications++);
m3Controller.step();eq(dashboard.snapshot().links[0].sample,1);eq(dashboard.snapshot().links[0].m3Running,false);ok(notifications>0);unsubscribeAudit();const notifiedBefore=notifications;
m3Controller.start();eq(dashboard.snapshot().links[0].m3Running,true);eq(intervals.size,1);eq(notifications,notifiedBefore);
stackController.start();eq(dashboard.snapshot().links[0].stackRunning,true);eq(intervals.size,2);
m3Controller.stop();stackController.stop();eq(intervals.size,0);eq(dashboard.snapshot().links[0].stackRunning,false);
nodes.apStackFollowM3.checked=false;nodes.apStackFollowM3.fire('change');eq(dashboard.snapshot().links[0].status,'SEPARATE');
nodes.binderConnectionsConnect.fire('click');eq(dashboard.snapshot().links[0].status,'FOLLOWING');eq(intervals.size,0);
branches[1].fire('click');eq(dashboard.snapshot().links[2].current,[1,11]);eq(dashboard.snapshot().links[2].verdict,'COMMITTED');
nodes.cubicReverse.fire('click');eq(dashboard.snapshot().links[2].verdict,'BLOCK');eq(dashboard.snapshot().links[2].current,[1,11]);
h['data-v1-edge-source'].value='c5';h['data-v1-edge-source'].fire('change');eq(dashboard.snapshot().links[2].status,'SEPARATE');
dashboard.connectAvailable();eq(dashboard.snapshot().links[2].status,'CONNECTED');eq(win.A0IharaCubicController.snapshot().revision,2);
const iref=win.A0IharaCubicController;win.A0IharaCubicController=null;win.A0Visual1GridController.render();eq(dashboard.snapshot().links[2].status,'HOLD');win.A0IharaCubicController=iref;
doc.body.classList.contains=()=>true;const other=D.mount(doc,win);eq(nodes.binderConnections.parent,nodes.oneOnePlayerMonitor);ok(other.snapshot());
for(const fn of events.pagehide||[])fn();
const source=fs.readFileSync(__dirname+'/a0-binder-connections.js','utf8');ok(!/setInterval|setTimeout|postMessage|\.start\(|\.play\(|\.step\(|\.reset\(|\.connectAll\(/.test(source));
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');for(const id of ['binderConnections','binderLink_m3','binderLink_pascal','binderLink_ihara','binderConnectionsConnect','binderConnectionsLedger','playerPascalFollow'])ok(html.includes('id="'+id+'"'));
console.log(JSON.stringify({status:'PASS',checks,scope:'actual source/receiver/bridge/graph/view/binder controllers in simulated DOM; 64 live Player coordinates; held vs follow, HOLD recovery, source events, no new adapter timer or playback/source-step command; browser pixels OPEN'}));
