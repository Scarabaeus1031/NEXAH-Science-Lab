'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),M=require('./a0-aperture-measurement.js'),S=require('./a0-aperture-stack-calibration.js'),P=require('./a0-player-pascal-bridge.js'),Native=require('./a0-club-return-monitor.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++},throws=f=>{assert.throws(f);checks++};
function receipt(a,l){const k=Native.GRAY.indexOf(a);return{plate:'tessarec',q4Address:a,q4Bits:a.toString(2).padStart(4,'0'),layer:l,deskIndex:l===null?null:l*16+(l===1?15-k:k)};}
for(const l of [null,0,1,2])for(let a=0;a<16;a++){
 const source=receipt(a,l),full=P.transfer(source),loss=P.transfer(source,{endpointOnly:true}),correct=P.transfer(source,{endpointOnly:true,keyMode:'correct'}),wrong=P.transfer(source,{endpointOnly:true,keyMode:'wrong'});
 eq(full.returnedBits,source.q4Bits);eq(full.bitsVerdict,'EXACT');eq(correct.returnedBits,source.q4Bits);eq(full.wholePlayerReturn,false);eq(full.witness,source);
 eq(loss.bitsVerdict,a===0||a===15?'EXACT':'HOLD');eq(wrong.bitsVerdict,a===0||a===15?'EXACT':'WRONG_SOURCE');
 for(const view of ['grid','bracket']){ok(P.drawing(full,view).includes(source.q4Bits));ok(P.drawing(loss,view).includes('Adresse (4,'));}
 full.witness.layer=9;eq(source.layer,l);
}
throws(()=>P.transfer({...receipt(0,0),q4Bits:'00001'}));throws(()=>P.transfer({...receipt(1,0),deskIndex:40}));throws(()=>P.drawing(P.transfer(receipt(0,0)),'membrane'));
const t=M.createTrace(),record=M.buildRecord(),source={trace:t,record,cursor:0};
eq(S.sharedSource(source),source);throws(()=>S.sharedSource({...source,cursor:48}));throws(()=>S.sharedSource({...source,trace:t.slice(1)}));throws(()=>S.sharedSource({...source,record:{...record,sourceFingerprint:'wrong'}}));
for(const fixture of ['source','control'])for(let i=0;i<6;i++){
 const r=S.buildRecord({stackId:fixture,plateIndex:i,sourceTrace:t});
 eq(r.sourceFingerprint,record.sourceFingerprint);eq(r.return.residual,0);
 for(let cursor=0;cursor<48;cursor++)eq(S.inspectPlate(t,r.activePlate,{windowDeg:52}).display[cursor].sourceIndex,cursor);
}
class Node{
 constructor(){this.value='';this.checked=false;this.dataset={};this.children=[];this.events={};this.classList={toggle(){},add(){},remove(){}};}
 get firstChild(){return this.children[0]||null;}
 appendChild(n){this.children.push(n);}removeChild(n){this.children.splice(this.children.indexOf(n),1);}
 setAttribute(){}querySelectorAll(){return [];}
 addEventListener(k,f){(this.events[k]??=[]).push(f);}fire(k){for(const f of this.events[k]||[])f({});}
}
const ids=['apertureMeasurement','m3MeasureSvg','m3Play','m3Step','m3Reset','m3Speed','m3Cut','m3CompareA','m3CompareB','m3Metric','m3Readout','m3Ledger','m3Export','pxaAperture','m3H','m3A','m3I','m3Index','m3Status','apertureStackCalibration','apStackSvg','apStackPlay','apStackStep','apStackReset','apStackSpeed','apStackMode','apStackWindow','apStackWindowOut','apStackPlate','apStackAngle','apStackDelta','apStackVisible','apStackMetric','apStackLedger','apStackStatus','apStackExport','apStackFollowM3','apStackM3Status','oneOnePlayerPascal','playerPascalRead','playerPascalView','playerPascalProjection','playerPascalKey','playerPascalSvg','playerPascalResult','playerPascalLedger'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Node()]));
for(const [id,value] of Object.entries({m3Speed:'420',m3Cut:'.5',m3CompareA:'unrolled',m3CompareB:'top',pxaAperture:'42',apStackMode:'source',apStackSpeed:'700',apStackWindow:'52',playerPascalView:'grid',playerPascalProjection:'path',playerPascalKey:'none'}))nodes[id].value=value;
nodes.apStackFollowM3.checked=true;
const doc={hidden:false,getElementById:id=>nodes[id],createElementNS:()=>new Node(),createElement:()=>new Node(),addEventListener(){}};
let timers=new Map(),serial=0;const win={console:{error(){}},matchMedia:()=>({matches:false}),setInterval(f){timers.set(++serial,f);return serial;},clearInterval(id){timers.delete(id);},addEventListener(){}};
doc.defaultView=win;
win.A0ApertureMeasurementController=M.mount(doc,win);win.A0ApertureStackController=S.mount(doc,win);
const m=win.A0ApertureMeasurementController,s=win.A0ApertureStackController;
eq(s.record.m3Link.sourceIndex,0);eq(s.record.sourceFingerprint,m.record.sourceFingerprint);eq(timers.size,0);
m.step();eq(s.record.m3Link.sourceIndex,1);eq(s.record.activePlate.plate,'P1');eq(m.readSource().cursor,1);
const heldTrace=m.readSource().trace;ok(Object.isFrozen(heldTrace));ok(Object.isFrozen(heldTrace[0]));
s.step();eq(s.record.activePlate.plate,'P2');eq(s.record.m3Link.sourceIndex,1);eq(m.readSource().cursor,1);
eq(m.readSource().trace,heldTrace);
for(const view of M.VIEW_IDS){m.setView(view);eq(s.record.m3Link.sourceIndex,1);eq(s.record.sourceFingerprint,m.record.sourceFingerprint);}
for(let i=0;i<47;i++)m.step();eq(s.record.m3Link.sourceIndex,0);eq(s.record.activePlate.plate,'P2');
nodes.pxaAperture.value='60';nodes.pxaAperture.fire('input');eq(s.record.sourceFingerprint,m.record.sourceFingerprint);ok(s.record.sourceFingerprint!==record.sourceFingerprint);
eq(s.record.m3Link.visible,S.inspectPlate(m.readSource().trace,s.record.activePlate).visibleIndices.includes(m.readSource().cursor));
nodes.apStackFollowM3.checked=false;nodes.apStackFollowM3.fire('change');ok(!s.record.m3Link);
nodes.apStackFollowM3.checked=true;nodes.apStackFollowM3.fire('change');eq(s.record.m3Link.sourceIndex,0);
const saved=m.readSource;win.A0ApertureMeasurementController={readSource:()=>null};s.render();eq(s.record,null);ok(nodes.apStackM3Status.textContent.includes('HOLD'));
win.A0ApertureMeasurementController=m;s.render();eq(s.record.sourceFingerprint,m.record.sourceFingerprint);
nodes.pxaAperture.value='99';m.render();eq(m.readSource().trace,null);eq(s.record,null);
nodes.pxaAperture.value='60';m.render();eq(s.record.sourceFingerprint,m.record.sourceFingerprint);
m.start();s.start();eq(timers.size,2); // existing two clocks, no new adapter clock
m.stop();s.stop();eq(timers.size,0);
let monitor={link:'HOLD',current:null,seq:-1};win.A0PlayerBenchMonitor={snapshot:()=>monitor};
const bridge=P.mount(doc,win);eq(nodes.playerPascalRead.disabled,true);
monitor={link:'HOLD_OPEN_LAYER',current:{receipt:receipt(5,null)},seq:7};bridge.refreshAvailability();eq(nodes.playerPascalRead.disabled,false);nodes.playerPascalRead.fire('click');
eq(bridge.snapshot().word,'0101');eq(bridge.snapshot().returnedBits,'0101');ok(nodes.playerPascalResult.textContent.includes('GEHALTEN'));
monitor={link:'CONNECTED',current:{receipt:receipt(9,0)},seq:8};nodes.playerPascalView.value='bracket';nodes.playerPascalView.fire('change');eq(bridge.snapshot().word,'0101');
nodes.playerPascalProjection.value='endpoint';nodes.playerPascalProjection.fire('change');eq(bridge.snapshot().bitsVerdict,'HOLD');eq(bridge.snapshot().pascal.candidates.length,6);
nodes.playerPascalKey.value='correct';nodes.playerPascalKey.fire('change');eq(bridge.snapshot().returnedBits,'0101');
nodes.playerPascalKey.value='wrong';nodes.playerPascalKey.fire('change');eq(bridge.snapshot().bitsVerdict,'WRONG_SOURCE');
monitor={link:'CONNECTED',current:{receipt:receipt(0,0)},seq:9};nodes.playerPascalRead.fire('click');ok(nodes.playerPascalResult.textContent.includes('kein anderer gültiger Schlüssel'));
monitor={link:'CONNECTED',current:{receipt:receipt(5,0)},seq:10};nodes.playerPascalRead.fire('click');
monitor={link:'HOLD',current:null,seq:9};bridge.refreshAvailability();eq(nodes.playerPascalRead.disabled,true);nodes.playerPascalRead.fire('click');eq(bridge.snapshot().word,'0101');ok(nodes.playerPascalResult.textContent.includes('HOLD'));
ok(!fs.readFileSync(__dirname+'/a0-player-pascal-bridge.js','utf8').match(/postMessage|setInterval|setTimeout/));
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');for(const id of ids)ok(html.includes('id="'+id+'"'));
console.log(JSON.stringify({status:'PASS',checks,scope:'real M3/Stack controllers and subscriptions; 64 typed Player receipts incl open layer; existing Pascal model, held UI input, missing/wrong witness controls; no source writes or new clocks; browser visuals OPEN'}));
