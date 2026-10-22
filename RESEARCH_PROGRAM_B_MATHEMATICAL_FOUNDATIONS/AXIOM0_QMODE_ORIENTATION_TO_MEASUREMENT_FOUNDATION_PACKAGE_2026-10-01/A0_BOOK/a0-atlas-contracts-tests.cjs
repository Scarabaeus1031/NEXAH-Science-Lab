'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const dir=path.join(__dirname,'assets/game-of-worlds-play/three-domain-transition-test'),A=require(path.join(dir,'atlas-contracts.js'));
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=v=>{assert.ok(v);checks++;},clone=x=>JSON.parse(JSON.stringify(x));
const names=['chemistry','life','physics'];
const input=g=>({generation:g,snapshots:Object.fromEntries(names.map(model=>[model,{generation:g,n:2,ledger:{c00:1,c01:1,c10:1,c11:1,total:4},controller:{model,generation:g}}]))});
const reads=g=>Object.fromEntries(A.DEFINITIONS.slice(3).map(([id])=>[id,{generation:g,follow:true,phase:id==='euler'?g%8:id==='fibonacci'?g%31:id==='blue-body'?g%48:g}]));
for(let g=0;g<=240;g++){const r=A.report(input(g),reads(g));eq(r.following,9);eq(r.clock.monitorAddsClock,false);eq(r.wholeMachineReturn,false);}
eq(A.report(null).status,'HOLD_SOURCE');eq(A.report(input(241)).status,'HOLD_SOURCE');eq(A.report(input(0),reads(0),true).following,0);
const bad=input(3);bad.snapshots.life.ledger.c00++;eq(A.report(bad,reads(3)).following,0);
const r=reads(8);r.fibonacci.follow=false;r.fibonacci.phase=3;eq(A.report(input(8),r).rows[5].status,'LOCAL');
r.fibonacci.follow=true;eq(A.report(input(8),r).rows[5].status,'HOLD_PHASE');r.fibonacci.phase=8;r.ihara.generation=7;eq(A.report(input(8),r).rows[6].status,'HOLD_STALE_VIEW');
delete r.euler;eq(A.report(input(8),r).rows[4].status,'HOLD_MISSING_VIEW');r.euler={generation:8,phase:0,follow:null};eq(A.report(input(8),r).rows[4].status,'HOLD_MISSING_VIEW');
const exported=A.report(input(0),reads(0));exported.openContracts[0].status='FORGED';eq(A.report(input(0)).openContracts[0].status,'OPEN');
class Node{
 constructor(){this.events={};this.dataset={};this.children=[];this.style={};this.checked=true;this.textContent='';this.value='';this.width=520;this.height=690;}
 addEventListener(k,f){(this.events[k]??=[]).push(f);}removeEventListener(k,f){this.events[k]=(this.events[k]||[]).filter(x=>x!==f);}fire(k){this['on'+k]?.();for(const f of this.events[k]||[])f({});}
 append(n){this.children.push(n);}replaceChildren(){this.children=[];}getContext(){return new Proxy({},{get:()=>()=>{}});}click(){this.fire('click');}
}
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8'),nodes=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Node()]));
let downloaded=null;const events={},doc=new Node();doc.hidden=false;doc.getElementById=id=>nodes[id]||null;doc.createElement=()=>new Node();doc.querySelector=()=>null;
const trap=()=>{throw Error('unrequested clock/control/transport');};
const win={addEventListener:(k,f)=>(events[k]??=[]).push(f),removeEventListener:(k,f)=>events[k]=(events[k]||[]).filter(x=>x!==f),setInterval:trap,setTimeout:trap,postMessage:trap,URL:{createObjectURL:b=>{downloaded=JSON.parse(b.parts[0]);return'blob:test';},revokeObjectURL(){}},Blob:class{constructor(parts){this.parts=parts;}}};
const monitor=A.mount(doc,win);eq(monitor.snapshot().status,'HOLD_SOURCE');
function paint(g){for(const [id,t] of Object.entries({eulerGeneration:'g'+g,eulerN:'n'+g%8,fibonacciGeneration:'g'+g,fibonacciN:'n'+g%31,iharaGeneration:'g'+g,kTellerGeneration:'t'+g,blueBodyGeneration:'g'+g,blueBodyStepValue:String(g%48)}))nodes[id].textContent=t;}
paint(6);for(const f of events['threedomain:render'])f({detail:input(6)});eq(monitor.snapshot().following,9);eq(nodes.atlasContractsRows.children.length,9);
nodes.fibonacciFollow.checked=false;nodes.fibonacciN.textContent='n2';doc.fire('change');eq(monitor.snapshot().rows[5].status,'LOCAL');
nodes.fibonacciFollow.checked=true;doc.fire('change');eq(monitor.snapshot().rows[5].status,'HOLD_PHASE');
nodes.atlasContractsExport.click();eq(downloaded.rows[5].status,'HOLD_PHASE');eq(downloaded.openContracts.length,5);
doc.hidden=true;doc.fire('visibilitychange');eq(monitor.snapshot().status,'HOLD_HIDDEN');doc.hidden=false;
// Execute the original source controller and a real source step in DOM doubles.
// Native view rendering is not repeated here: stale display is intentionally detected.
nodes.boundary.value='open';nodes.threshold.value='.22';nodes.speed.value='360';
const context={window:win,document:doc,CustomEvent:function(type,options){this.type=type;this.detail=options?.detail;},setInterval:trap,clearInterval(){},console};
win.ThreeDomainEngine=require(path.join(dir,'domain-engine.js'));win.dispatchEvent=e=>{for(const f of events[e.type]||[])f(e);};
vm.runInNewContext(fs.readFileSync(path.join(dir,'app.js'),'utf8'),context);
eq(monitor.snapshot().generation,0);eq(monitor.snapshot().rows[0].reading.ledger.total,1296);eq(monitor.snapshot().rows[4].status,'HOLD_STALE_VIEW');
nodes.step.click();eq(monitor.snapshot().generation,1);eq(monitor.snapshot().rows[0].sourceGeneration,1);eq(monitor.snapshot().rows[4].status,'HOLD_STALE_VIEW');
const snap=monitor.snapshot();snap.rows[0].reading.ledger.total=-1;eq(monitor.snapshot().rows[0].reading.ledger.total,1296);
for(const f of events.pagehide)f();eq(monitor.snapshot().status,'HOLD_SOURCE');eq(events['threedomain:render'].length,0);
const source=fs.readFileSync(path.join(dir,'atlas-contracts.js'),'utf8');ok(!/setInterval|setTimeout|postMessage|\.step\(|\.start\(|\.reset\(/.test(source));
const contract=JSON.parse(fs.readFileSync(path.join(dir,'atlas-contract-v1.json'),'utf8'));eq(contract.contracts.map(x=>x.id),A.DEFINITIONS.map(x=>x[0]));eq(contract.clock.timers_added,0);
ok(html.indexOf('atlas-contracts.js')<html.indexOf('src="app.js"'));ok(html.indexOf('atlas-contracts.js')>html.indexOf('src="blue-body-view.js"'));
console.log(JSON.stringify({status:'PASS',checks,scope:'241 tick contracts; real source controller and one native step in DOM doubles; local/stale/hidden/missing controls, export, detach; no monitor clock/commands; browser OPEN'}));
