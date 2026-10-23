(function(root,factory){
  const handoff=typeof module==='object'&&module.exports?require('./a0-iota-tower-return-handoff.js'):root.A0IotaTowerReturnHandoff;
  const api=factory(handoff);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0IotaTowerReturnMatrix=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(handoff){
  'use strict';

  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const copy=value=>value==null?null:JSON.parse(JSON.stringify(value));
  const stable=value=>JSON.stringify(value);

  function projectOpenTower(towerRecord){
    if(!towerRecord)return null;
    const projected=copy(towerRecord);
    projected.state={...(projected.state||{}),closed:false,status:projected.state?.pinAccepted?'READY_FOR_WITNESS':'HOLD_PIN'};
    projected.witness=null;
    projected.receipt=null;
    return Object.freeze(projected);
  }

  function fingerprintBridge(record){
    return stable({schema:record?.schema||null,identity:record?.identity||null,tick:record?.view?.tick??null,layer:record?.view?.layer||null,jointReturn:record?.view?.schedule?.jointReturn===true});
  }

  function fingerprintTower(record){
    return stable({schema:record?.schema||null,identity:record?.identity||null,address:record?.state?.address||null,stage:record?.state?.stage||null,basis:record?.state?.basis||null,closed:record?.state?.closed===true,receipt:record?.receipt?.status||null,returnSample:record?.receipt?.returnSample||null});
  }

  function row(code,bridgeReceipt,towerRecord,expected){
    const result=handoff.combine(bridgeReceipt,towerRecord);
    return Object.freeze({
      code,
      bridge:bridgeReceipt?.status==='BRIDGE_RETURN_READY'?'READY':'OPEN',
      tower:handoff.inspectTower(towerRecord).closed?'CLOSED':'OPEN',
      expected,
      observed:result.status,
      reason:result.reason||null,
      pass:result.status===expected
    });
  }

  function evaluateMatrix(bridgeReceipt,openTower,closedTower){
    const absent=Object.freeze({status:'HOLD',reason:'BRIDGE_RETURN_MISSING'});
    const rows=Object.freeze([
      row('00',absent,openTower,'HOLD'),
      row('10',bridgeReceipt,openTower,'HOLD'),
      row('01',absent,closedTower,'HOLD'),
      row('11',bridgeReceipt,closedTower,'COUPLED_VIEW_RETURN')
    ]);
    return Object.freeze({rows,pass:rows.every(item=>item.pass)&&rows.filter(item=>item.observed==='COUPLED_VIEW_RETURN').length===1});
  }

  function buildLedger(input={}){
    const bridgeRecord=input.bridgeRecord||null;
    const closedTower=input.closedTowerRecord||null;
    const openTower=input.openTowerRecord||projectOpenTower(closedTower);
    const bridgeReceipt=handoff.createBridgeReceipt(bridgeRecord);
    const matrix=evaluateMatrix(bridgeReceipt,openTower,closedTower);
    const isolation=Object.freeze({
      iotaResetPreservesTower:input.isolation?.iotaResetPreservesTower===true,
      towerResetPreservesIota:input.isolation?.towerResetPreservesIota===true,
      towerRunPreservesIota:input.isolation?.towerRunPreservesIota===true,
      iotaReplayPreservesTower:input.isolation?.iotaReplayPreservesTower===true
    });
    const isolationPass=Object.values(isolation).every(Boolean);
    const coupled=handoff.combine(bridgeReceipt,closedTower);
    const pass=matrix.pass&&isolationPass&&coupled.status==='COUPLED_VIEW_RETURN';
    return Object.freeze({
      schema:'nexah.a0.iota-tower-return-matrix/1',version:VERSION,identity:IDENTITY,
      classification:'METHOD_RELEVANT_ENGINEERING_OBSERVATION',
      status:pass?'PASS':'HOLD',matrix,isolation,isolationPass,
      provenance:Object.freeze({
        bridge:Object.freeze({schema:bridgeRecord?.schema||null,identity:bridgeRecord?.identity||null,tick:bridgeRecord?.view?.tick??null,periods:copy(bridgeRecord?.view?.schedule?{am:bridgeRecord.view.schedule.am?.period,pm:bridgeRecord.view.schedule.pm?.period}:null),receipt:bridgeReceipt.status}),
        tower:Object.freeze({schema:closedTower?.schema||null,identity:closedTower?.identity||null,address:closedTower?.receipt?.address||closedTower?.state?.address||null,returnSample:closedTower?.receipt?.returnSample||null,basis:copy(closedTower?.receipt?.basis||closedTower?.state?.basis||null),receipt:closedTower?.receipt?.status||null})
      }),
      coupled:copy(coupled),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,claimPromotion:false}),
      boundary:'A four-state engineering composition audit with separate provenance. PASS records one post-hoc typed view return only; it creates no shared clock, carrier, cause, canonical relation or scientific finding.'
    });
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('iotaTowerReturnMatrix');if(!host)return null;
    const ids=['iotaTowerMatrixStatus','iotaTowerMatrixGrid','iotaTowerMatrixIsolation','iotaTowerMatrixBridge','iotaTowerMatrixTower','iotaTowerMatrixCoupled','iotaTowerMatrixAudit','iotaTowerMatrixRun','iotaTowerMatrixReset','iotaTowerMatrixExport'];
    const nodes=Object.fromEntries(ids.map(id=>[id,doc.getElementById(id)]));
    const missing=ids.filter(id=>!nodes[id]);if(missing.length)throw Error(`IOTA/Tower matrix mount missing: ${missing.join(', ')}`);
    let ledger=null;
    const bridgeController=()=>win.A0Iota23BridgeController;
    const towerController=()=>win.A0TowerShellReturnController;
    const currentBridge=()=>bridgeController()?.record?.()||win.A0Iota23BridgeView||null;
    const currentTower=()=>towerController()?.record||win.A0TowerShellReturnView||null;
    const cells=rows=>rows.map(item=>`<article data-code="${item.code}" data-pass="${item.pass}"><small>${item.code} · IOTA ${item.bridge} / TOWER ${item.tower}</small><b>${item.observed}</b><span>${item.reason||'typed return'}</span></article>`).join('');
    function render(){
      const bridgeReceipt=handoff.createBridgeReceipt(currentBridge()),tower=handoff.inspectTower(currentTower());
      host.dataset.status=(ledger?.status||'HOLD').toLowerCase();
      nodes.iotaTowerMatrixStatus.textContent=ledger?.status==='PASS'?'PASS · 4/4 · ISOLATED':'HOLD · AUDIT REQUIRED';
      nodes.iotaTowerMatrixGrid.innerHTML=ledger?cells(ledger.matrix.rows):cells(evaluateMatrix(bridgeReceipt,projectOpenTower(currentTower()),currentTower()).rows);
      nodes.iotaTowerMatrixIsolation.textContent=ledger?`${Object.values(ledger.isolation).filter(Boolean).length}/4 · ${ledger.isolationPass?'PASS':'HOLD'}`:'NOT RUN';
      nodes.iotaTowerMatrixBridge.textContent=`${bridgeReceipt.status}${bridgeReceipt.tick?` · T${bridgeReceipt.tick}`:''}`;
      nodes.iotaTowerMatrixTower.textContent=tower.status;
      nodes.iotaTowerMatrixCoupled.textContent=ledger?.coupled?.status||'OPEN';
      win.A0IotaTowerReturnMatrixView=ledger;
      return ledger;
    }
    function audit(){
      ledger=buildLedger({bridgeRecord:currentBridge(),closedTowerRecord:currentTower(),isolation:{}});
      return render();
    }
    function runFull(){
      const iota=bridgeController(),tower=towerController();
      if(!iota||!tower){ledger=null;nodes.iotaTowerMatrixStatus.textContent='HOLD · CONTROLLER MISSING';return null}
      win.A0TlFinalPinController?.setState?.({phase:'pinned'});
      win.A0DgSamplingLoopController?.bindFinalPin?.(win.A0TlFinalPinView);
      iota.reset();tower.reset();
      const openTower=currentTower(),openTowerFp=fingerprintTower(openTower);
      iota.reset();const iotaResetPreservesTower=fingerprintTower(currentTower())===openTowerFp;
      for(let i=0;i<24;i+=1)iota.step();
      const readyBridgeFp=fingerprintBridge(currentBridge());
      tower.reset();const towerResetPreservesIota=fingerprintBridge(currentBridge())===readyBridgeFp;
      tower.run();const closedTower=currentTower(),closedTowerFp=fingerprintTower(closedTower);
      const towerRunPreservesIota=fingerprintBridge(currentBridge())===readyBridgeFp;
      iota.reset();const iotaResetPreservesClosedTower=fingerprintTower(currentTower())===closedTowerFp;
      for(let i=0;i<24;i+=1)iota.step();
      const iotaReplayPreservesTower=iotaResetPreservesClosedTower&&fingerprintTower(currentTower())===closedTowerFp;
      ledger=buildLedger({bridgeRecord:currentBridge(),openTowerRecord:openTower,closedTowerRecord:closedTower,isolation:{iotaResetPreservesTower,towerResetPreservesIota,towerRunPreservesIota,iotaReplayPreservesTower}});
      win.A0IotaTowerReturnMatrixReceipt=ledger;
      return render();
    }
    function reset(){ledger=null;return render()}
    nodes.iotaTowerMatrixAudit.addEventListener('click',audit);
    nodes.iotaTowerMatrixRun.addEventListener('click',runFull);
    nodes.iotaTowerMatrixReset.addEventListener('click',reset);
    nodes.iotaTowerMatrixExport.addEventListener('click',()=>{if(!ledger)return;const json=JSON.stringify(ledger,null,2);host.dataset.lastExport=json;if(win.Blob&&win.URL&&doc.createElement){const link=doc.createElement('a');link.href=win.URL.createObjectURL(new win.Blob([json],{type:'application/json'}));link.download='a0-iota-tower-return-matrix.json';link.click();win.URL.revokeObjectURL(link.href)}});
    render();
    return Object.freeze({render,audit,run:runFull,reset,get record(){return ledger}});
  }

  return{VERSION,IDENTITY,projectOpenTower,fingerprintBridge,fingerprintTower,evaluateMatrix,buildLedger,mount};
});
