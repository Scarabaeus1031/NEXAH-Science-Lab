'use strict';
const assert=require('node:assert/strict'),S=require('./a0-seed-cross.js'),P=require('./a0-pentagon-contract.js'),fs=require('node:fs');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=v=>{assert.ok(v);checks++;};
eq(S.pairAt(0).pair,['1','1']);eq(S.pairAt(0).sum,'2');eq(S.pairAt(0).primeEleven,'11');eq(S.pairAt(1).pair,['1','2']);
for(let i=0;i<S.LIMIT;i++){const r=S.pairAt(i),n=S.pairAt(i+1);eq(n.pair,[r.pair[1],r.sum]);eq(n.minus,[n.pair[0],String(-BigInt(n.pair[1]))]);eq(r.wholeMachineReturn,false);}
for(const i of [-1,129,NaN,1.5,'0']){assert.throws(()=>S.pairAt(i));checks++;}
eq(S.pentagon(null).status,'HOLD');
const state=P.state(P.DEFAULT),w={sourceHash:P.SOURCE_HASH,revision:3,state,rendered:state,phase:P.phase(state.branchWord),resultText:'ready',svgElements:5};
const record={schema:'nexah.a0.pentagon-bench-connection/1',status:'READY',pending:null,currentWitness:w};
eq(S.pentagon(record).status,'READ_ONLY');eq(S.pentagon({...record,pending:{seq:2}}).status,'HOLD');eq(S.pentagon({...record,currentWitness:{...w,sourceHash:'wrong'}}).status,'HOLD');
class Node{constructor(){this.events={};this.attrs={};}addEventListener(k,f){this.events[k]=f;}setAttribute(k,v){this.attrs[k]=v;}click(){this.events.click();}}
const ids=['seedCrossMonitor','seedCrossPair','seedCrossReading','seedCrossVectors','seedCrossPentagon','seedCrossLedger','seedCrossStep','seedCrossBack','seedCrossPlus','seedCrossMinus','seedCrossReset','seedCrossRead'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Node()]));let callback,unsubscribed=false,source=record;const events={};
const trap=()=>{throw Error('source write or extra clock');};
const win={A0PentagonBench:{exportRecord:()=>source,subscribe:f=>{callback=f;return()=>{unsubscribed=true;};},connect:trap,read:trap,apply:trap,setFollow:trap},setInterval:trap,setTimeout:trap,addEventListener:(k,f)=>events[k]=f};
const view=S.mount({getElementById:id=>nodes[id]},win);
eq(view.snapshot().pair,['1','1']);eq(nodes.seedCrossPlus.attrs.y2,36);eq(nodes.seedCrossMinus.attrs.y2,164);
nodes.seedCrossStep.click();eq(view.snapshot().pair,['1','2']);eq(view.snapshot().tile.seedMapping,null);eq(view.snapshot().tile.status,'DOCUMENTARY_REFERENCE_NOT_LIVE_BOUND');
nodes.seedCrossBack.click();eq(view.snapshot().pair,['1','1']);
for(let i=0;i<130;i++)nodes.seedCrossStep.click();eq(view.snapshot().index,128);eq(nodes.seedCrossStep.disabled,true);
source=null;callback();eq(view.snapshot().pentagon.status,'HOLD');eq(view.snapshot().index,128);
nodes.seedCrossReset.click();eq(view.snapshot().index,0);eq(nodes.seedCrossBack.disabled,true);nodes.seedCrossBack.click();eq(view.snapshot().index,0);
source=record;nodes.seedCrossRead.click();eq(view.snapshot().pentagon.revision,3);events.pagehide();ok(unsubscribed);
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');for(const id of ids)ok(html.includes('id="'+id+'"'));ok(html.includes('A0_PINK_DIAMOND_GRID_ATLAS.html#crt16-tile'));
console.log(JSON.stringify({status:'PASS',checks,scope:'128 exact BigInt seed transitions; typed PENT witness; real view controller in DOM double; no timer or source writes; no seed-to-tile mapping; browser OPEN'}));
