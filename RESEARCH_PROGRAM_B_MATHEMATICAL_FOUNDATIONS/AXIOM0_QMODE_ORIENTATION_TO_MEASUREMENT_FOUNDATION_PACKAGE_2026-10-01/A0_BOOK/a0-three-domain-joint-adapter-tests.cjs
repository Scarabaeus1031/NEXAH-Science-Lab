'use strict';
const assert=require('node:assert/strict'),A=require('./a0-three-domain-joint-adapter.js');
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++},ok=(v,m)=>{assert.ok(v,m);checks++};
const ledger=(c00,c01,c10,c11)=>({c00,c01,c10,c11,total:c00+c01+c10+c11,previous:{zero:c00+c01,one:c10+c11},current:{zero:c00+c10,one:c01+c11}});
const detail={generation:7,snapshots:{chemistry:{generation:7,ledger:ledger(40,10,20,30),controller:{model:'chemistry'}},life:{generation:7,ledger:ledger(25,25,25,25),controller:{model:'life'}},physics:{generation:7,ledger:ledger(10,20,30,40),controller:{model:'physics'}}}};
eq(A.VERSION,'1.0.0','version');eq(A.DOMAINS,['chemistry','life','physics'],'three outer ports');eq(A.CHANNELS.map(c=>c.key),['c00','c01','c10','c11'],'four inner channels');eq(A.CHANNELS[0].color,'#647786','C00 is grey');
const record=A.normalize(detail,{observedAt:'2026-10-23T00:00:00.000Z'});eq(record.status,'SOURCE_BOUND','source bound');eq(record.domains.length,3,'three normalized ledgers');eq(record.domains[0].normalized.c00,.4,'weights normalized by N');eq(record.domains[0].ledger.previous,{zero:50,one:50},'source marginal held');eq(record.domains[0].ledger.current,{zero:60,one:40},'target marginal held');eq(record.joint,{re:0.066666667,im:-0.066666667,magnitude:0.094280905},'existing phasor centroid reused');eq(record.coordinateMap.feedback,false,'no feedback');
eq(A.MASK_CONTRACT,{outer:'D5_PENTAGON',inner:'D6_HEXAGON',crossDeg:45,shellCount:11,gridView:'11x11',addressReference:'7x11',identityRule:'D5 ≠ D6 ≠ 11x11 ≠ 7x11'},'carrier masks stay typed and distinct');
const captured=A.capture(record);eq(A.compare(captured,record).status,'EXACT_RETURN','same ledger returns exactly');const changed=A.normalize({...detail,generation:8,snapshots:Object.fromEntries(Object.entries(detail.snapshots).map(([k,v])=>[k,{...v,generation:8}]))});eq(A.compare(captured,changed).status,'REJECT_CHANGED_SOURCE','changed generation rejected');eq(A.compare(null,record).status,'HOLD_SOURCE','missing capture held');
ok(A.svgMarkup(record,90).includes('3 PORTS × 4 CHANNELS'),'diagram declares 3x4');ok(A.svgMarkup(record).includes('D5 GREEN ≠ D6 RED'),'pentagon and hexagon remain distinct');ok(A.svgMarkup(record).includes('cross45'),'white 45 degree X included');ok(A.svgMarkup(record).includes('wing violet'),'violet-gold butterfly joint included');for(const key of ['c00','c01','c10','c11'])ok(A.svgMarkup(record).includes(`data-channel="${key}"`),`diagram includes ${key}`);ok(A.svgMarkup(null).includes('WAITING FOR ARCADE'),'empty diagram fails visibly');
assert.throws(()=>A.validateLedger({c00:1,c01:1,c10:1,c11:1,total:5}),/partition mismatch/);checks++;
class MockWindow{
  constructor(){this.listeners={};this.closed=false;this.opener=null;this.CustomEvent=class{constructor(type,init){this.type=type;this.detail=init.detail}}}
  addEventListener(type,fn){(this.listeners[type]||(this.listeners[type]=[])).push(fn)}
  removeEventListener(type,fn){this.listeners[type]=(this.listeners[type]||[]).filter(item=>item!==fn)}
  dispatchEvent(event){for(const fn of this.listeners[event.type]||[])fn(event)}
  postMessage(data){for(const fn of this.listeners.message||[])fn({data})}
}
const sinkWindow=new MockWindow(),sourceWindow=new MockWindow();sourceWindow.opener=sinkWindow;let transported=null;
const sourceTransport=A.createTransport(sourceWindow,{role:'source'}),sinkTransport=A.createTransport(sinkWindow,{role:'sink',onRecord:value=>{transported=value}});
sinkTransport.attachSource(sourceWindow);sourceTransport.publish(detail);eq(transported.fingerprint,record.fingerprint,'companion-window transport returns the exact normalized record');
transported=null;sinkTransport.request();eq(transported.fingerprint,record.fingerprint,'sink request replays the retained source record');
sourceTransport.close();sinkTransport.close();eq((sinkWindow.listeners.message||[]).length,0,'sink message listener removed on close');eq((sourceWindow.listeners.message||[]).length,0,'source message listener removed on close');
console.log(JSON.stringify({status:'PASS',checks,scope:'source-bound Three-Domain 3x4 channel adapter; no model feedback'}));
