(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0TowerShellReturn=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.1.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const STAGES=Object.freeze(['SOURCE','PIN','EXCITATION','TRACE','WITNESS','RETURN','ROOT_GATE','RECEIPT']);
  const PATH_TOKEN=Object.freeze({glyph:'∫',role:'PATH_RECORD_TOKEN',mathematicalStatus:'NOT_AN_EVALUATED_INTEGRAL',carries:Object.freeze(['SOURCE_ADDRESS','DG_SAMPLE','DG_BASIS','WITNESS'])});
  const OPEN_CHANNELS=Object.freeze({gd:'OPEN_UNBOUND',jd:'OPEN_UNBOUND'});
  const copy=value=>value==null?null:JSON.parse(JSON.stringify(value));

  function inspect(pinRecord,dgRecord,witness=null,receipt=null){
    const pinCompatible=Boolean(pinRecord&&pinRecord.schema==='nexah.a0.tl-final-pin-view/1'&&pinRecord.identity===IDENTITY);
    const pinAccepted=Boolean(pinCompatible&&pinRecord.pin?.decision==='PINNED_2_TO_1'&&pinRecord.state?.scanner?.screenRead==='OCCUPIED');
    const dgCompatible=Boolean(dgRecord&&dgRecord.schema==='nexah.a0.dg-sampling-loop-record/1'&&dgRecord.identity===IDENTITY);
    const address=pinCompatible?String(pinRecord.pin?.address||'q—'):'q—';
    const stage=dgCompatible?String(dgRecord.current?.stage||'WAITING'):'WAITING';
    const basis=dgCompatible?Object.freeze({samples:Number(dgRecord.current?.samples),bands:Number(dgRecord.current?.bands)}):null;
    const witnessValid=Boolean(witness&&witness.address===address&&witness.basis?.samples===basis?.samples&&witness.basis?.bands===basis?.bands);
    const closed=Boolean(receipt&&receipt.status==='CLOSED_TYPED_VIEW_RETURN'&&receipt.address===address);
    const status=closed?'CLOSED':!pinAccepted?'HOLD_PIN':!dgCompatible?'HOLD_DG':!witness?'READY_FOR_WITNESS':!witnessValid?'HOLD_BASIS_CHANGED':stage==='RETURN'?'READY_FOR_ROOT_GATE':'WITNESS_HELD';
    return Object.freeze({identity:IDENTITY,status,address,stage,basis,pinCompatible,pinAccepted,dgCompatible,witnessValid,closed,changesDgClock:false,mapsQToN:false});
  }

  function captureWitness(pinRecord,dgRecord){
    const state=inspect(pinRecord,dgRecord);
    if(!state.pinAccepted||!state.dgCompatible||state.stage!=='WITNESS')return Object.freeze({status:'HOLD',reason:!state.pinAccepted?'PIN_NOT_ACCEPTED':!state.dgCompatible?'DG_RECORD_MISSING':'DG_NOT_AT_WITNESS'});
    return Object.freeze({schema:'nexah.a0.tower-shell-witness/1',identity:IDENTITY,status:'WITNESS_HELD',address:state.address,dgSample:String(dgRecord.current.sample),wheelDeg:Number(dgRecord.current.wheelDeg),basis:Object.freeze({...state.basis}),sourceStage:'WITNESS'});
  }

  function closeReturn(pinRecord,dgRecord,witness){
    const state=inspect(pinRecord,dgRecord,witness);
    if(!state.pinAccepted)return Object.freeze({status:'HOLD',reason:'PIN_NOT_ACCEPTED'});
    if(!state.dgCompatible)return Object.freeze({status:'HOLD',reason:'DG_RECORD_MISSING'});
    if(!witness||witness.status!=='WITNESS_HELD')return Object.freeze({status:'HOLD',reason:'WITNESS_MISSING'});
    if(!state.witnessValid)return Object.freeze({status:'HOLD',reason:'SOURCE_OR_BASIS_CHANGED'});
    if(state.stage!=='RETURN')return Object.freeze({status:'HOLD',reason:'DG_NOT_AT_RETURN'});
    return Object.freeze({schema:'nexah.a0.tower-shell-return-receipt/1',version:VERSION,identity:IDENTITY,status:'CLOSED_TYPED_VIEW_RETURN',address:state.address,sourceAddress:state.address,route:Object.freeze(['MOUSE_Q_ADDRESS','TL_FINAL_PIN','DG_SHARED_APERTURE','DG_WITNESS','DG_RETURN','ROOT_ROOM_RETURN','PATH_RECORD_TOKEN_INTEGRAL','RETURN_GATE','SOURCE_ADDRESS_RECEIPT']),witness:copy(witness),returnSample:String(dgRecord.current.sample),basis:Object.freeze({...state.basis}),rootRoomMode:'RETURN',returnGateMode:'CLOSED',pathToken:PATH_TOKEN,pathTokenStatus:'HELD',openChannels:OPEN_CHANNELS,towerRole:'TOWER / SHAFT VIEW',shellRole:'SHELL / UNDER-TOWER RETURN',operatorStatus:'OPEN_NOT_SOURCE_RECOVERED',authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false}),boundary:'This receipt closes one typed engineering view loop. The ∫ glyph is a held path-record token, not an evaluated mathematical integral. G°D and J°D remain OPEN_UNBOUND. The receipt preserves the Mouse q address and the D°G sampling basis but does not map q addresses to N teeth, identify the Tower with Root Room, recover a Tower operator, or create a shared clock.'});
  }

  function svgMarkup(state,witness=null,receipt=null){
    const active=state.closed?8:state.status==='READY_FOR_ROOT_GATE'?6:state.stage==='WAITING'?0:STAGES.indexOf(state.stage);
    const nodes=[['SOURCE',70,70,'MOUSE',state.address,0],['PIN',215,70,'FINAL PIN',state.pinAccepted?'ACCEPTED':'HOLD',1],['WITNESS',375,70,'D°G WITNESS',witness?.status||'OPEN',4],['RETURN',555,70,'D°G RETURN',state.stage,5],['ROOT',555,170,'RR · ROOT ROOM',state.status==='READY_FOR_ROOT_GATE'||state.closed?'RETURN':'HOLD',6],['GATE',555,285,'RG · RETURN GATE',state.closed?'CLOSED':'OPEN',7],['RECEIPT',215,285,'SOURCE RECEIPT',receipt?.status==='CLOSED_TYPED_VIEW_RETURN'?state.address:'OPEN',8]];
    const paths='<path class="tsr-route" d="M105 70H180M250 70H340M410 70H520M555 105V135M555 205V250M520 285H250"/><path class="tsr-return" d="M180 285H70V105"/>';
    const tokenState=state.closed?'HELD':'OPEN';
    return `<defs><filter id="tsrGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${paths}<path class="tsr-tower" d="M530 123H580L570 143H540Z"/><path class="tsr-shell" d="M522 306Q555 340 588 306"/><circle class="tsr-aperture" cx="555" cy="285" r="9"/>${nodes.map(([id,x,y,label,value,rank])=>`<g class="tsr-node ${rank<=active?'active':''} ${id==='RECEIPT'&&state.closed?'closed':''}"><circle cx="${x}" cy="${y}" r="28"/><text x="${x}" y="${y-42}">${label}</text><text class="value" x="${x}" y="${y+5}">${value}</text></g>`).join('')}<g class="tsr-token ${state.closed?'held':''}"><circle cx="555" cy="227" r="20"/><text x="555" y="234">∫</text><text class="token-state" x="596" y="232">PATH RECORD · ${tokenState}</text></g><g class="tsr-unbound"><rect x="627" y="126" width="124" height="48"/><text x="689" y="145">G°D · OPEN · UNBOUND</text><text x="689" y="162">J°D · OPEN · UNBOUND</text><text class="unbound-state" x="689" y="187">NO ROUTE</text></g><text class="tsr-caption" x="380" y="365">q ADDRESS HELD · D°G BASIS HELD · ∫ = PATH TOKEN, NOT EVALUATED INTEGRAL · NO q→N MAP</text>`;
  }

  function buildRecord(pinRecord,dgRecord,witness=null,receipt=null){
    return Object.freeze({schema:'nexah.a0.tower-shell-return-view/1',version:VERSION,identity:IDENTITY,classification:'SOURCE_BOUND_ENGINEERING_DEMONSTRATOR',state:inspect(pinRecord,dgRecord,witness,receipt),witness:copy(witness),receipt:copy(receipt),stages:STAGES,pathToken:PATH_TOKEN,openChannels:OPEN_CHANNELS,authority:{researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false},boundary:'Closed typed display return only. RR and RG are separated display roles. The ∫ glyph carries the held path record and is not an evaluated integral. G°D and J°D remain OPEN_UNBOUND. Root Room RETURN is invoked only when its existing live bridge is present. Tower operator recovery remains OPEN.'});
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('towerShellReturn');if(!host)return null;
    const svg=doc.getElementById('towerShellReturnSvg'),status=doc.getElementById('towerShellReturnStatus'),address=doc.getElementById('towerShellReturnAddress'),basis=doc.getElementById('towerShellReturnBasis'),witnessOut=doc.getElementById('towerShellReturnWitness'),rootOut=doc.getElementById('towerShellReturnRoot'),tokenOut=doc.getElementById('towerShellReturnToken'),channelsOut=doc.getElementById('towerShellReturnChannels'),step=doc.getElementById('towerShellReturnStep'),capture=doc.getElementById('towerShellReturnCapture'),close=doc.getElementById('towerShellReturnClose'),run=doc.getElementById('towerShellReturnRun'),reset=doc.getElementById('towerShellReturnReset'),exportButton=doc.getElementById('towerShellReturnExport');
    const required={svg,status,address,basis,witnessOut,rootOut,tokenOut,channelsOut,step,capture,close,run,reset,exportButton};const missing=Object.entries(required).filter(([,node])=>!node).map(([key])=>key);if(missing.length)throw Error(`Tower/Shell Return mount missing: ${missing.join(', ')}`);
    let pinRecord=win.A0TlFinalPinView||null,dgRecord=win.A0DgSamplingLoopView||null,witness=null,receipt=null;
    function sync(){pinRecord=win.A0TlFinalPinView||pinRecord;dgRecord=win.A0DgSamplingLoopView||dgRecord;return render()}
    function render(){const record=buildRecord(pinRecord,dgRecord,witness,receipt),state=record.state;host.dataset.status=state.status.toLowerCase();svg.innerHTML=svgMarkup(state,witness,receipt);status.textContent=`${state.status} · ${state.address} · ${state.stage}`;address.textContent=`${state.address} · ${state.pinAccepted?'PIN ACCEPTED':'PIN HOLD'}`;basis.textContent=state.basis?`N ${state.basis.samples} · ${state.basis.bands} BANDS · HELD`:'WAITING FOR D°G';witnessOut.textContent=witness?.status==='WITNESS_HELD'?`${witness.status} · ${witness.dgSample}`:`${witness?.reason||'OPEN'}`;rootOut.textContent=receipt?.status==='CLOSED_TYPED_VIEW_RETURN'?`RR RETURN · RG CLOSED · ${receipt.address}`:`RR ${state.status==='READY_FOR_ROOT_GATE'?'READY':'HOLD'} · RG OPEN · TOWER OPERATOR OPEN`;tokenOut.textContent=`∫ · PATH RECORD · ${receipt?.status==='CLOSED_TYPED_VIEW_RETURN'?'HELD':'OPEN'}`;channelsOut.textContent='G°D · OPEN · UNBOUND / J°D · OPEN · UNBOUND';capture.disabled=state.stage!=='WITNESS'||!state.pinAccepted;close.disabled=state.stage!=='RETURN'||!state.witnessValid;win.A0TowerShellReturnView=record;return record}
    function stepLoop(){win.A0DgSamplingLoopController?.step();dgRecord=win.A0DgSamplingLoopView||dgRecord;return render()}
    function captureNow(){witness=captureWitness(pinRecord,dgRecord);receipt=null;return render()}
    function closeNow(){receipt=closeReturn(pinRecord,dgRecord,witness);if(receipt.status==='CLOSED_TYPED_VIEW_RETURN')win.A0RootRoomPhaseBridge?.select?.('RETURN');return render()}
    function runClosed(){let guard=0;sync();while(inspect(pinRecord,dgRecord,witness,receipt).stage!=='WITNESS'&&guard++<64)stepLoop();captureNow();guard=0;while(inspect(pinRecord,dgRecord,witness,receipt).stage!=='RETURN'&&guard++<64)stepLoop();return closeNow()}
    function clear(){witness=null;receipt=null;return sync()}
    step.addEventListener('click',stepLoop);capture.addEventListener('click',captureNow);close.addEventListener('click',closeNow);run.addEventListener('click',runClosed);reset.addEventListener('click',clear);
    win.addEventListener?.('a0:tl-final-pin',event=>{pinRecord=event.detail;if(event.detail?.pin?.decision!=='PINNED_2_TO_1'){witness=null;receipt=null}render()});
    win.addEventListener?.('a0:dg-sampling-loop',event=>{dgRecord=event.detail;render()});
    exportButton.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(buildRecord(pinRecord,dgRecord,witness,receipt),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-tower-shell-return-record.json';anchor.click();URL.revokeObjectURL(url)});
    render();return Object.freeze({render,sync,step:stepLoop,capture:captureNow,close:closeNow,run:runClosed,reset:clear,bindPin(record){pinRecord=record;return render()},bindDg(record){dgRecord=record;return render()},get record(){return buildRecord(pinRecord,dgRecord,witness,receipt)}});
  }

  return{VERSION,IDENTITY,STAGES,PATH_TOKEN,OPEN_CHANNELS,inspect,captureWitness,closeReturn,svgMarkup,buildRecord,mount};
});
