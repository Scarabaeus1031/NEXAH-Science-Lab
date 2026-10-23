'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const iota=require('./a0-iota-2-3-bridge-probe.js');
const handoff=require('./a0-iota-tower-return-handoff.js');

let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++};const ok=(v,m)=>{assert.ok(v,m);checks++};
eq(handoff.IDENTITY,'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','same Bench identity');
eq(handoff.hour12(13),1,'13 maps to I on twelve-hour view');
eq(handoff.hour12(14),2,'14 maps to II on twelve-hour view');
eq(handoff.hourSeam().clock24,[13,14],'24-hour seam');
eq(handoff.hourSeam().clock12,[1,2],'twelve-hour seam');
eq(handoff.hourSeam().addsTick,false,'seam adds no tick');
eq(handoff.hourSeam().scientificAstronomy,false,'golden/night labels are not astronomy');

const atTick=tick=>iota.viewRecord({...iota.createViewState(),tick});
eq(handoff.createBridgeReceipt(null).reason,'BRIDGE_VIEW_MISSING','missing bridge held');
eq(handoff.createBridgeReceipt(atTick(8)).reason,'BRIDGE_NOT_AT_TICK_24','tick 8 held');
eq(handoff.createBridgeReceipt(atTick(12)).reason,'BRIDGE_NOT_AT_TICK_24','tick 12 held');
const bridge=handoff.createBridgeReceipt(atTick(24));
eq(bridge.status,'BRIDGE_RETURN_READY','tick 24 accepted');
eq(bridge.periods,{am:8,pm:12},'periods retained');
eq(bridge.cycles,{am:3,pm:2},'cycle counts retained');
eq(bridge.still,'FIXED','STILL invariant retained');
eq(bridge.sharedClock,false,'no shared clock');
eq(bridge.changesTowerClock,false,'Tower clock unchanged');

const openTower={schema:handoff.TOWER_SCHEMA,identity:handoff.IDENTITY,state:{closed:false},receipt:null};
const closedTower={schema:handoff.TOWER_SCHEMA,identity:handoff.IDENTITY,state:{closed:true},receipt:{status:'CLOSED_TYPED_VIEW_RETURN',address:'q01',returnSample:'18/18',basis:{samples:18,bands:5}}};
eq(handoff.inspectTower(null).status,'HOLD_TOWER_VIEW','missing Tower held');
eq(handoff.inspectTower(openTower).status,'HOLD_TOWER_RETURN','open Tower held');
eq(handoff.inspectTower(closedTower).status,'TOWER_RETURN_CLOSED','closed Tower accepted');
eq(handoff.combine(null,closedTower).reason,'BRIDGE_RETURN_MISSING','Tower alone cannot couple');
eq(handoff.combine(bridge,openTower).reason,'TOWER_RETURN_OPEN','Bridge alone cannot couple');
const coupled=handoff.combine(bridge,closedTower);
eq(coupled.status,'COUPLED_VIEW_RETURN','two independent returns couple');
eq(coupled.coupling.type,'POST_HOC_TYPED_HANDOFF','coupling typed post hoc');
eq(coupled.coupling.sharedClock,false,'coupling creates no shared clock');
eq(coupled.coupling.changesDgClock,false,'D degree G clock unchanged');
eq(coupled.coupling.mapsQToN,false,'no q to N map');
eq(coupled.authority.newRelation,false,'no canonical relation');
eq(coupled.authority.scientificEvidence,false,'not scientific evidence');
ok(coupled.boundary.includes('independently valid'),'independence boundary explicit');

const svg=handoff.svgMarkup({bridge,coupled,lastAction:'CHECK'});
for(const token of ['IOTA 24','HANDOFF','TOWER','13→14 ≡ I→II','NO SHARED CLOCK'])ok(svg.includes(token),`svg includes ${token}`);
const view=handoff.buildView({bridge,coupled,lastAction:'CHECK'});
eq(view.schema,'nexah.a0.iota-tower-return-handoff-view/1','view schema');
eq(view.classification,'BOUNDED_ENGINEERING_HANDOFF_VIEW','view bounded');
eq(view.authority.researchRun,false,'not research run');

function node(id){return{id,dataset:{},textContent:'',innerHTML:'',listeners:{},addEventListener(type,fn){this.listeners[type]=fn},click(){this.listeners.click?.()}}}
const ids=['iotaTowerHandoff','iotaTowerHandoffSvg','iotaTowerHandoffStatus','iotaTowerBridgeOut','iotaTowerTowerOut','iotaTowerCoupledOut','iotaTowerCheck','iotaTowerRun','iotaTowerReset','iotaTowerExport'];
const nodes=Object.fromEntries(ids.map(id=>[id,node(id)]));
const fakeDoc={getElementById:id=>nodes[id]||null,createElement:()=>node('download')};
let towerRecord=openTower;
const fakeWin={A0Iota23BridgeController:{record:()=>atTick(24)},A0TowerShellReturnController:{get record(){return towerRecord},run(){towerRecord=closedTower}},A0TowerShellReturnView:openTower};
const controller=handoff.mount(fakeDoc,fakeWin);ok(controller,'controller mounts');
eq(nodes.iotaTowerHandoffStatus.textContent,'HOLD · STEP IOTA TO 24','initial status');
nodes.iotaTowerCheck.click();eq(nodes.iotaTowerBridgeOut.textContent,'BRIDGE_RETURN_READY','check captures bridge receipt');
eq(nodes.iotaTowerCoupledOut.textContent,'HOLD','check keeps open Tower held');
nodes.iotaTowerRun.click();eq(nodes.iotaTowerCoupledOut.textContent,'COUPLED_VIEW_RETURN','run closes Tower then couples');
eq(nodes.iotaTowerHandoffStatus.textContent,'COUPLED VIEW RETURN','coupled status rendered');

const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'a0-iota-tower-return-handoff.css'),'utf8');
const desk=fs.readFileSync(path.join(__dirname,'A0_RESEARCH_DESK.html'),'utf8');
for(const token of ['id="iotaTowerHandoff"','id="iotaTowerRun"','a0-iota-tower-return-handoff.css','a0-iota-tower-return-handoff.js'])ok(html.includes(token),`HTML integration ${token}`);
ok(css.includes('.ith-route.active')&&css.includes('.ith-seam'),'handoff styling present');
for(const token of ['A0_ORIENTATION_CONTROLLER_BENCH.html#iotaTowerHandoff','results/a0-iota-tower-return-handoff-2026-10-23.json','Tick 8/12 <code>HOLD</code>'])ok(desk.includes(token),`Science Desk return ${token}`);

console.log(JSON.stringify({status:'PASS',checks,scope:'post-hoc IOTA 24 to Tower-Shell typed view handoff; no shared clock or scientific relation'}));
