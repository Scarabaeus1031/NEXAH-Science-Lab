(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0IotaTowerReturnHandoff=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const BRIDGE_SCHEMA='nexah.a0.iota-2-3-bridge-view/1';
  const TOWER_SCHEMA='nexah.a0.tower-shell-return-view/1';

  const copy=value=>value==null?null:JSON.parse(JSON.stringify(value));
  const hour12=value=>((value-1)%12+12)%12+1;

  function hourSeam(){
    return Object.freeze({
      clock24:Object.freeze([13,14]),
      clock12:Object.freeze([hour12(13),hour12(14)]),
      relation:'MODULO_12_POSITION_EQUIVALENT',
      displayNames:Object.freeze({before:'GOLDEN_HOUR_VIEW',after:'NIGHT_VIEW'}),
      scientificAstronomy:false,
      addsTick:false
    });
  }

  function createBridgeReceipt(iotaRecord){
    if(!iotaRecord||iotaRecord.schema!==BRIDGE_SCHEMA)return Object.freeze({status:'HOLD',reason:'BRIDGE_VIEW_MISSING'});
    if(iotaRecord.identity!==IDENTITY)return Object.freeze({status:'HOLD',reason:'IDENTITY_MISMATCH'});
    const view=iotaRecord.view||{},schedule=view.schedule||{};
    if(view.tick!==24)return Object.freeze({status:'HOLD',reason:'BRIDGE_NOT_AT_TICK_24',tick:Number.isInteger(view.tick)?view.tick:null});
    if(schedule.still!=='FIXED')return Object.freeze({status:'HOLD',reason:'STILL_NOT_FIXED'});
    if(schedule.am?.period!==8||schedule.pm?.period!==12)return Object.freeze({status:'HOLD',reason:'PERIOD_CONTRACT_MISMATCH'});
    if(schedule.am?.atOrigin!==true||schedule.pm?.atOrigin!==true||schedule.jointReturn!==true)return Object.freeze({status:'HOLD',reason:'JOINT_RETURN_NOT_CLOSED'});
    return Object.freeze({
      schema:'nexah.a0.iota-2-3-return-receipt/1',version:VERSION,identity:IDENTITY,status:'BRIDGE_RETURN_READY',
      tick:24,periods:Object.freeze({am:8,pm:12}),cycles:Object.freeze({am:3,pm:2}),still:'FIXED',
      seam:hourSeam(),sharedClock:false,changesTowerClock:false,
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false}),
      boundary:'A typed modular-schedule completion receipt. It neither changes the Tower D°G basis nor creates a shared clock.'
    });
  }

  function inspectTower(towerRecord){
    const compatible=Boolean(towerRecord&&towerRecord.schema===TOWER_SCHEMA&&towerRecord.identity===IDENTITY);
    const closed=Boolean(compatible&&towerRecord.receipt?.status==='CLOSED_TYPED_VIEW_RETURN'&&towerRecord.state?.closed===true);
    return Object.freeze({compatible,closed,status:!compatible?'HOLD_TOWER_VIEW':closed?'TOWER_RETURN_CLOSED':'HOLD_TOWER_RETURN'});
  }

  function combine(bridgeReceipt,towerRecord){
    const tower=inspectTower(towerRecord);
    if(!bridgeReceipt||bridgeReceipt.status!=='BRIDGE_RETURN_READY')return Object.freeze({status:'HOLD',reason:'BRIDGE_RETURN_MISSING',bridge:copy(bridgeReceipt),tower});
    if(bridgeReceipt.identity!==IDENTITY)return Object.freeze({status:'HOLD',reason:'IDENTITY_MISMATCH',bridge:copy(bridgeReceipt),tower});
    if(!tower.compatible)return Object.freeze({status:'HOLD',reason:'TOWER_VIEW_MISSING',bridge:copy(bridgeReceipt),tower});
    if(!tower.closed)return Object.freeze({status:'HOLD',reason:'TOWER_RETURN_OPEN',bridge:copy(bridgeReceipt),tower});
    return Object.freeze({
      schema:'nexah.a0.iota-tower-coupled-view-return/1',version:VERSION,identity:IDENTITY,status:'COUPLED_VIEW_RETURN',
      bridge:copy(bridgeReceipt),tower:Object.freeze({status:tower.status,address:towerRecord.receipt.address,returnSample:towerRecord.receipt.returnSample,basis:copy(towerRecord.receipt.basis)}),
      coupling:Object.freeze({type:'POST_HOC_TYPED_HANDOFF',sharedClock:false,changesDgClock:false,mapsQToN:false,triggersScientificRun:false}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false}),
      boundary:'Two independently valid engineering returns are recorded together. Neither return becomes the clock, carrier, cause or evidence of the other.'
    });
  }

  function createState(){return Object.freeze({bridge:null,coupled:null,lastAction:'READY'})}

  function svgMarkup(state=createState()){
    const bridgeReady=state.bridge?.status==='BRIDGE_RETURN_READY',towerClosed=state.coupled?.tower?.closed===true||state.coupled?.status==='COUPLED_VIEW_RETURN',coupled=state.coupled?.status==='COUPLED_VIEW_RETURN';
    const node=(x,label,value,active)=>`<g class="ith-node${active?' active':''}"><circle cx="${x}" cy="92" r="29"/><text x="${x}" y="49">${label}</text><text class="value" x="${x}" y="97">${value}</text></g>`;
    return `<path class="ith-route${bridgeReady?' active':''}" d="M115 92H245"/><path class="ith-route${coupled?' active':''}" d="M315 92H445"/>${node(80,'IOTA 24',bridgeReady?'READY':'OPEN',bridgeReady)}${node(280,'HANDOFF',coupled?'HELD':'CHECK',coupled)}${node(480,'TOWER',towerClosed?'CLOSED':'OPEN',towerClosed)}<path class="ith-seam" d="M228 174H332"/><text class="ith-seam-label" x="280" y="164" text-anchor="middle">13→14 ≡ I→II · mod 12</text><text class="ith-caption" x="280" y="214" text-anchor="middle">NO SHARED CLOCK · POST-HOC TYPED RETURN</text>`;
  }

  function buildView(state=createState()){
    return Object.freeze({schema:'nexah.a0.iota-tower-return-handoff-view/1',version:VERSION,identity:IDENTITY,classification:'BOUNDED_ENGINEERING_HANDOFF_VIEW',state:copy(state),hourSeam:hourSeam(),authority:{researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false},boundary:'This view checks two independent engineering returns. It does not insert the IOTA schedule into the Tower D°G clock.'});
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('iotaTowerHandoff');if(!host)return null;
    const svg=doc.getElementById('iotaTowerHandoffSvg'),status=doc.getElementById('iotaTowerHandoffStatus'),bridgeOut=doc.getElementById('iotaTowerBridgeOut'),towerOut=doc.getElementById('iotaTowerTowerOut'),coupledOut=doc.getElementById('iotaTowerCoupledOut'),checkButton=doc.getElementById('iotaTowerCheck'),runButton=doc.getElementById('iotaTowerRun'),resetButton=doc.getElementById('iotaTowerReset'),exportButton=doc.getElementById('iotaTowerExport');
    const required={svg,status,bridgeOut,towerOut,coupledOut,checkButton,runButton,resetButton,exportButton};const missing=Object.entries(required).filter(([,node])=>!node).map(([key])=>key);if(missing.length)throw Error(`IOTA/Tower handoff mount missing: ${missing.join(', ')}`);
    let state=createState();
    const currentIota=()=>win.A0Iota23BridgeController?.record?.()||win.A0Iota23BridgeView||null;
    const currentTower=()=>win.A0TowerShellReturnController?.record||win.A0TowerShellReturnView||null;
    function render(){const tower=inspectTower(currentTower()),view=buildView(state);host.dataset.status=state.coupled?.status==='COUPLED_VIEW_RETURN'?'coupled':state.bridge?.status==='BRIDGE_RETURN_READY'?'bridge-ready':'hold';svg.innerHTML=svgMarkup({...state,coupled:state.coupled?.status==='COUPLED_VIEW_RETURN'?state.coupled:{...state.coupled,tower}});status.textContent=state.coupled?.status==='COUPLED_VIEW_RETURN'?'COUPLED VIEW RETURN':state.bridge?.status==='BRIDGE_RETURN_READY'?'BRIDGE READY · TOWER OPEN':'HOLD · STEP IOTA TO 24';bridgeOut.textContent=state.bridge?.status||state.bridge?.reason||'OPEN';towerOut.textContent=tower.status;coupledOut.textContent=state.coupled?.status||state.coupled?.reason||'OPEN';win.A0IotaTowerHandoffView=view;return view}
    function check(){const bridge=createBridgeReceipt(currentIota()),coupled=combine(bridge,currentTower());state=Object.freeze({bridge,coupled,lastAction:'CHECK'});return render()}
    function run(){const bridge=createBridgeReceipt(currentIota());if(bridge.status!=='BRIDGE_RETURN_READY'){state=Object.freeze({bridge,coupled:combine(bridge,currentTower()),lastAction:'HOLD_BRIDGE'});return render()}win.A0TowerShellReturnController?.run?.();const coupled=combine(bridge,currentTower());state=Object.freeze({bridge,coupled,lastAction:'RUN_HANDOFF'});return render()}
    function reset(){state=createState();return render()}
    checkButton.addEventListener('click',check);runButton.addEventListener('click',run);resetButton.addEventListener('click',reset);
    exportButton.addEventListener('click',()=>{const json=JSON.stringify(buildView(state),null,2);host.dataset.lastExport=json;if(win.Blob&&win.URL&&doc.createElement){const link=doc.createElement('a');link.href=win.URL.createObjectURL(new win.Blob([json],{type:'application/json'}));link.download='a0-iota-tower-return-handoff.json';link.click();win.URL.revokeObjectURL(link.href)}});
    render();
    return Object.freeze({render,check,run,reset,get record(){return buildView(state)}});
  }

  return{VERSION,IDENTITY,BRIDGE_SCHEMA,TOWER_SCHEMA,hour12,hourSeam,createBridgeReceipt,inspectTower,combine,createState,svgMarkup,buildView,mount};
});
