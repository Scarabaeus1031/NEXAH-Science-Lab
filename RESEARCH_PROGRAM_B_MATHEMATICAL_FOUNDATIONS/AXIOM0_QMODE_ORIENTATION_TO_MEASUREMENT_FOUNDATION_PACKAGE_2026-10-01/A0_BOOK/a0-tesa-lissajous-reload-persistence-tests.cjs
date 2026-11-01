'use strict';
const assert=require('node:assert/strict');
const router=require('./a0-tesa-lissajous-window-router.js');
const ledger=require('./a0-bench-session-ledger.js');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks+=1;};

class Element{
  constructor(){this.textContent='';this.innerHTML='';this.disabled=false;this.dataset={};this.events={};}
  addEventListener(name,handler){this.events[name]=handler;}
  fire(name,event={target:{closest:()=>null}}){return this.events[name]?.(event);}
  click(){}
}
class Storage{
  constructor(seed={}){this.values={...seed};}
  getItem(key){return Object.hasOwn(this.values,key)?this.values[key]:null;}
  setItem(key,value){this.values[key]=String(value);}
}
const ids=['tesaLissajousWindowRouter','tlwrStatus','tlwrGrid','tlwrRoute','tlwrWindow','tlwrGate','tlwrBattery','tlwrReceipt','tlwrSync','tlwrRun','tlwrExport','tlwrCapture','tlwrReplay','tlwrLedger','tlwrCurrent','tlwrRetained','tlwrReplayed'];
const exactView=(generation,domain='physics',channel='c10',side='R')=>({source_generation:generation,selection:{domain,channel},control_frame:{selected:side},comparison:{exact:true},gate:{touch:true,witness:true,kappa:63/64,requiredUnavailable:false},cut_q_receipt:{exact_return:true},exact:true,trace:{selection:{count:18,total:70},port:{selectedContribution:{re:0,im:-18}}}});
function fixture(storage,view=null){
  const nodes=Object.fromEntries(ids.map(id=>[id,new Element()])),listeners={},addresses=[],focuses=[];
  const sourceView={setFocus(value){focuses.push(value);}};
  const frame={contentWindow:{A0ThreeLissajousPlanesView:sourceView}};
  const doc={getElementById(id){return id==='nativeFaceSourceFrame'?frame:nodes[id]||null;},createElement(){return new Element();}};
  const win={A0JointControlReturnAuditView:view,A0BenchSessionLedger:ledger,A0OrbitGridJointsController:{selectAddress(address,sign){addresses.push([address,sign]);}},A0BenchSourceSectionsController:{select(){return{status:'FOCUSED'};}},addEventListener(name,handler){listeners[name]=handler;},removeEventListener(name){delete listeners[name];},A0BenchReplayHandlers:{},Blob:class{},URL:{createObjectURL(){return'blob:test';},revokeObjectURL(){}},localStorage:storage};
  return{nodes,listeners,addresses,focuses,controller:router.mount(doc,win)};
}

const storage=new Storage();
const first=fixture(storage,exactView(7));
first.nodes.tlwrCapture.fire('click');
const captured=first.controller.state.lastCapture;
ok(router.validateSessionRecord(captured),'first page captures valid frozen-v1 session');
ok(Boolean(storage.getItem(ledger.STORAGE_KEY)),'capture persists in shared local storage');
first.controller.close();

const second=fixture(storage,null);
ok(second.controller.state.persisted.status==='PERSISTED_READY','reload hydrates persisted receipt as ready');
ok(second.addresses.length===0&&second.focuses.length===0,'hydration does not mutate Teller or window');
ok(second.nodes.tlwrReplay.disabled===false,'explicit replay becomes available after reload');
ok(second.nodes.tlwrRetained.innerHTML.includes(`TESA ${captured.payload.route.address}`),'retained inspector shows hydrated address');
second.nodes.tlwrReplay.fire('click');
ok(second.addresses.at(-1)[0]===captured.payload.route.address,'explicit replay restores exact Teller address');
ok(second.focuses.at(-1)===`${captured.payload.window.plane}_PLANE`,'explicit replay restores exact Lissajous plane');
ok(second.controller.state.lastReplayed.payload.receipt_fingerprint===captured.payload.receipt_fingerprint,'replay preserves receipt fingerprint');
ok(second.nodes.tlwrReplayed.innerHTML.includes(captured.payload.receipt_fingerprint),'replayed inspector exposes exact fingerprint');
second.controller.close();

const clean=JSON.parse(storage.getItem(ledger.STORAGE_KEY));
const tampered=JSON.parse(JSON.stringify(clean));
tampered.entries.at(-1).payload.signal.amplitude=0.999;
const tamperedStorage=new Storage({[ledger.STORAGE_KEY]:JSON.stringify(tampered)});
const tamperedHydration=router.hydrateSession(tamperedStorage,ledger);
ok(tamperedHydration.status==='HOLD_TAMPERED_RECEIPT'&&!tamperedHydration.ready,'tampered receipt fails closed on reload');
const tamperedPage=fixture(tamperedStorage,null);
ok(tamperedPage.nodes.tlwrReplay.disabled===true&&tamperedPage.addresses.length===0,'tampered reload cannot replay or mutate view');
tamperedPage.controller.close();

const missing=JSON.parse(JSON.stringify(clean)),missingRecord=missing.entries.at(-1);
missingRecord.payload.gate.bits.cut=false;
const {receipt_fingerprint,...core}=missingRecord.payload;
missingRecord.payload.receipt_fingerprint=router.fingerprint(core);
missingRecord.fingerprint=missingRecord.payload.receipt_fingerprint;
const missingHydration=router.hydrateSession(new Storage({[ledger.STORAGE_KEY]:JSON.stringify(missing)}),ledger);
ok(missingHydration.status==='HOLD_TAMPERED_RECEIPT'&&!missingHydration.ready,'missing gate bit fails closed even with recomputed fingerprint');

const stalePage=fixture(storage,exactView(20,'life','c01','L'));
const before=stalePage.controller.state.lastConfirmed.route.address;
stalePage.nodes.tlwrReplay.fire('click');
ok(stalePage.nodes.tlwrLedger.textContent==='HOLD · STALE GENERATION','older persisted generation is rejected');
ok(stalePage.controller.state.lastConfirmed.route.address===before&&stalePage.addresses.every(([address])=>address===before),'stale replay preserves current retained address');
stalePage.controller.close();

ok(router.CONTRACT_VERSION==='1.0.0'&&router.CONTRACT_STATUS==='FROZEN_V1','capture replay contract is explicitly frozen v1');
console.log(JSON.stringify({suite:'A0_TESA_LISSAJOUS_RELOAD_PERSISTENCE',status:'PASS',checks,contract:'FROZEN_V1',reload_hydration:true,explicit_replay:true,tamper_hold:true,missing_bit_hold:true,stale_generation_hold:true},null,2));
