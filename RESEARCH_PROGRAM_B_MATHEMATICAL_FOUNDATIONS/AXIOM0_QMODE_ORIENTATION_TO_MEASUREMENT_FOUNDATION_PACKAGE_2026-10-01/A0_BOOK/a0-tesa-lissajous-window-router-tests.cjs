'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const router=require('./a0-tesa-lissajous-window-router.js');
let checks=0;
const equal=(actual,expected,message)=>{assert.equal(actual,expected,message);checks+=1;};
const check=(value,message)=>{assert.ok(value,message);checks+=1;};
const throws=(fn,message)=>{assert.throws(fn,undefined,message);checks+=1;};

equal(router.IDENTITY,'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','bench identity reused');
equal(router.ILAU_ID,'SG:LENS:ILAU_ORIENTATION','ILAU identity reused');
equal(router.CONTRACT_VERSION,'1.0.0','capture replay contract version frozen');
equal(router.CONTRACT_STATUS,'FROZEN_V1','capture replay contract status frozen');
equal(router.WINDOWS.map(item=>`${item.address}:${item.plane}/${item.pair}`).join(','),'7:AM/XY,8:VM/YZ,9:PM/ZX','calibration windows fixed');
equal(router.RESERVED.join(','),'25,26,27,28','reserved addresses fixed');

const addresses=[];
for(const domain of router.DOMAINS)for(const channel of router.CHANNELS)for(const side of router.SIDES)addresses.push(router.routeAddress(domain,channel,side));
equal(addresses.length,24,'24 route combinations');
equal(new Set(addresses).size,24,'24 route addresses unique');
equal(Math.min(...addresses),1,'route starts at one');
equal(Math.max(...addresses),24,'route ends at twenty four');
equal(router.routeAddress('chemistry','c00','L'),1,'first route');
equal(router.routeAddress('physics','c11','R'),24,'last route');
throws(()=>router.routeAddress('unknown','c00','L'),'unknown domain rejected');
throws(()=>router.windowForAddress(25),'reserved address cannot become active window');

const descriptor=router.routeDescriptor('life','c10','R');
equal(descriptor.address,14,'route formula deterministic');
equal(descriptor.row,1,'TESA row reused');
equal(descriptor.col,6,'TESA column reused');
equal(descriptor.window.plane,'VM','modulo view selects VM');
equal(descriptor.window.pair,'YZ','modulo view selects YZ');

const base={selection:{domain:'physics',channel:'c10'},control_frame:{selected:'R'},comparison:{exact:true},gate:{touch:true,witness:true,kappa:63/64,requiredUnavailable:false},cut_q_receipt:{exact_return:true},exact:true,trace:{selection:{count:18,total:70},port:{selectedContribution:{re:0,im:-18}}}};
const exact=router.route(base);
check(exact.exact,'complete six-bit route exact');
equal(exact.status,'WINDOW_LOCATED','window located status');
equal(exact.gate.binary,'111111','six gates open');
equal(exact.route.address,22,'physics c10 right route');
equal(exact.signal.amplitude,18/70,'amplitude derived from trace');
equal(exact.signal.phase_degrees,-90,'phase derived from trace');
equal(exact.contracts.writes_source,false,'no source writes');
equal(exact.contracts.cross_window_read,false,'no cross-window reads');
equal(exact.contracts.second_clock,false,'no second clock');
equal(exact.contracts.new_ids.length,0,'no new IDs');
equal(exact.contracts.new_relations.length,0,'no new relations');

const session=router.sessionRecord(exact,{capturedAt:'2026-11-01T16:30:00.000Z'});
equal(session.scenario,'tesa-lissajous-router','ledger scenario fixed');
check(router.validateSessionRecord(session),'session receipt validates');
equal(session.payload.route.address,22,'session retains TESA address');
equal(session.payload.window.plane,'AM','session retains selected Lissajous window');
const tampered=JSON.parse(JSON.stringify(session));tampered.payload.route.address=21;
check(!router.validateSessionRecord(tampered),'tampered receipt rejected');
const missingBits=JSON.parse(JSON.stringify(session));delete missingBits.payload.gate.bits.cut;
check(!router.validateSessionRecord(missingBits),'missing gate bit rejected');
const replayCalls=[];
const replay=router.replaySessionRecord(session,{selectAddress:(address,sign)=>replayCalls.push(['address',address,sign]),focusWindow:plane=>replayCalls.push(['window',plane])});
equal(replay.status,'REPLAYED','valid record replays');
equal(JSON.stringify(replayCalls),JSON.stringify([['address',22,1],['window','AM']]),'replay restores address and window only');
equal(router.replaySessionRecord(tampered,{}).status,'HOLD_TAMPERED_RECEIPT','tampered replay fails closed');
equal(router.eventOrder({source_generation:8},9).status,'HOLD_STALE_EVENT','older generation rejected');
equal(router.eventOrder({source_generation:9},9).status,'CURRENT_EVENT','same generation remains usable');
equal(router.eventOrder({},9).status,'UNORDERED_EVENT','missing generation is explicit');
let retained=router.retainConfirmed(null,exact);
equal(retained.route.address,22,'exact route becomes confirmed state');
const heldRoute=router.route({...base,gate:{...base.gate,touch:false}});
equal(router.retainConfirmed(retained,heldRoute).route.address,22,'HOLD cannot overwrite last confirmed route');

for(const [key,mutate,status] of [
  ['capture',view=>view.comparison.exact=false,'HOLD_CAPTURE'],
  ['touch',view=>view.gate.touch=false,'HOLD_MISSING_TOUCH'],
  ['witness',view=>view.gate.witness=false,'HOLD_CONFLICTING_WITNESS'],
  ['kappa',view=>view.gate.kappa=0,'HOLD_INVALID_KAPPA'],
  ['available',view=>view.gate.requiredUnavailable=true,'HOLD_REQUIRED_INFORMATION_UNAVAILABLE'],
  ['cut',view=>view.cut_q_receipt.exact_return=false,'HOLD_INCOMPLETE_CUT_Q']
]){const view=JSON.parse(JSON.stringify(base));mutate(view);equal(router.route(view).status,status,`${key} fails closed`);}
equal(router.route(null).status,'HOLD_SOURCE','missing view fails closed');

const battery=router.exhaustiveBattery();
check(battery.pass,'exhaustive battery passes');
equal(battery.counts.cases,1536,'64 × 3 × 4 × 2 cases');
equal(battery.counts.exact,24,'24 exact routes');
equal(battery.counts.hold,1512,'1512 hold routes');
equal(battery.counts.mismatches,0,'no mismatches');
equal(battery.unique_active_routes,24,'all active addresses covered');

const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
check(html.includes('id="tesaLissajousWindowRouter"'),'router host installed');
check(html.includes('a0-tesa-lissajous-window-router.css'),'router CSS installed');
check(html.includes('a0-tesa-lissajous-window-router.js'),'router JS installed');
check(html.includes('id="tlwrGrid"'),'TESA grid installed');
check(html.includes('id="tlwrCurrent"'),'current inspector installed');
check(html.includes('id="tlwrRetained"')&&html.includes('id="tlwrReplayed"'),'retained and replayed inspectors installed');
console.log(JSON.stringify({suite:'A0_TESA_LISSAJOUS_WINDOW_ROUTER',status:'PASS',checks,battery,identity:router.IDENTITY,no_graph_mutation:true},null,2));
