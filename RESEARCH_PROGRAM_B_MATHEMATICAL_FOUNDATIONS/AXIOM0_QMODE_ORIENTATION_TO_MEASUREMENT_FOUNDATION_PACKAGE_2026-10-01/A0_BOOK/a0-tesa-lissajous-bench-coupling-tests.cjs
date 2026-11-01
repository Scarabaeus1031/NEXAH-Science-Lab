'use strict';
const assert=require('node:assert/strict');
const router=require('./a0-tesa-lissajous-window-router.js');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks+=1;};
class Element{
  constructor(){this.textContent='';this.innerHTML='';this.disabled=false;this.dataset={};this.events={};}
  addEventListener(name,handler){this.events[name]=handler;}
  fire(name,event={target:{closest:()=>null}}){return this.events[name]?.(event);}
}
const ids=['tesaLissajousWindowRouter','tlwrStatus','tlwrGrid','tlwrRoute','tlwrWindow','tlwrGate','tlwrBattery','tlwrReceipt','tlwrSync','tlwrRun','tlwrExport','tlwrCapture','tlwrReplay','tlwrLedger','tlwrCurrent','tlwrRetained','tlwrReplayed'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Element()]));
const sourceView={focused:null,setFocus(value){this.focused=value;}};
const frame={contentWindow:{A0ThreeLissajousPlanesView:sourceView}};
const doc={getElementById(id){return id==='nativeFaceSourceFrame'?frame:nodes[id]||null;},createElement(){return new Element();}};
const listeners={},captures=[],addresses=[],sections=[];
const exactView=(generation,domain='physics',channel='c10',side='R')=>({source_generation:generation,selection:{domain,channel},control_frame:{selected:side},comparison:{exact:true},gate:{touch:true,witness:true,kappa:63/64,requiredUnavailable:false},cut_q_receipt:{exact_return:true},exact:true,trace:{selection:{count:18,total:70},port:{selectedContribution:{re:0,im:-18}}}});
const win={
  A0JointControlReturnAuditView:exactView(7),
  A0OrbitGridJointsController:{selectAddress(address,sign){addresses.push([address,sign]);}},
  A0BenchSourceSectionsController:{select(id){sections.push(id);return{status:'FOCUSED'};}},
  A0BenchSessionLedgerController:{capture(record){captures.push(record);return record;}},
  addEventListener(name,handler){listeners[name]=handler;},removeEventListener(name){delete listeners[name];},
  CustomEvent:class{},dispatchEvent(){},A0BenchReplayHandlers:{},
  Blob:class{},URL:{createObjectURL(){return'blob:test';},revokeObjectURL(){}},localStorage:{}
};
const controller=router.mount(doc,win);
ok(controller.state.lastConfirmed.route.address===22,'initial exact route retained');
nodes.tlwrCapture.fire('click');
ok(captures.length===1&&router.validateSessionRecord(captures[0]),'exact route captured into existing ledger');
ok(nodes.tlwrRetained.innerHTML.includes('TESA 22'),'inspector exposes retained route');
const first=captures[0];
listeners['a0-joint-control-return']({detail:exactView(8,'life','c01','L')});
ok(controller.state.lastConfirmed.route.address===11,'newer joint changes active address');
nodes.tlwrReplay.fire('click');
ok(addresses.at(-1)[0]===first.payload.route.address,'replay restores captured Teller address');
ok(sourceView.focused===`${first.payload.window.plane}_PLANE`,'replay restores captured Lissajous focus');
ok(nodes.tlwrReplayed.innerHTML.includes(`TESA ${first.payload.route.address}`),'inspector exposes replayed route');
ok(sections.at(-1)==='lissajous','replay uses existing source section');
listeners['a0-joint-control-return']({detail:exactView(6,'chemistry','c00','L')});
ok(controller.state.lastConfirmed.route.address===11,'stale generation rejected');
const held=exactView(9,'chemistry','c00','L');held.gate.touch=false;
listeners['a0-joint-control-return']({detail:held});
ok(controller.state.lastConfirmed.route.address===11,'HOLD does not overwrite confirmed address');
ok(nodes.tlwrGrid.innerHTML.includes('retained'),'HOLD keeps confirmed address visibly retained');
controller.close();ok(!listeners['a0-joint-control-return'],'event listener removed');
console.log(JSON.stringify({suite:'A0_TESA_LISSAJOUS_BENCH_COUPLING',status:'PASS',checks,capture_replay:true,stale_event_hold:true,source_clock_mutation:false},null,2));
