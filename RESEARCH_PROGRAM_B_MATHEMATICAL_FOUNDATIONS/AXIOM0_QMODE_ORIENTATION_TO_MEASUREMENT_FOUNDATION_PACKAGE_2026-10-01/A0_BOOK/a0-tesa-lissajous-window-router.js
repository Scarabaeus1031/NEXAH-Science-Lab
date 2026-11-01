(function(root,factory){
  const joint=typeof module==='object'&&module.exports?require('./a0-joint-control-return-audit.js'):root.A0JointControlReturnAudit;
  const tesa=typeof module==='object'&&module.exports?require('./assets/a0-tesa-grid-candidate.js'):root.A0TesaGridCandidate;
  const cut=typeof module==='object'&&module.exports?require('./a0-cut-q-lens-return-bench.js'):root.A0CutQLensReturnBench;
  const api=factory(joint,tesa,cut);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0TesaLissajousWindowRouter=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(joint,tesa,cut){
  'use strict';

  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const ILAU_ID='SG:LENS:ILAU_ORIENTATION';
  const SCHEMA='nexah.a0.tesa-lissajous-window-router/1';
  const DOMAINS=Object.freeze(['chemistry','life','physics']);
  const CHANNELS=Object.freeze(['c00','c01','c10','c11']);
  const SIDES=Object.freeze(['L','R']);
  const WINDOWS=Object.freeze((cut&&cut.LISSAJOUS_WINDOWS?cut.LISSAJOUS_WINDOWS:[
    {address:7,plane:'AM',pair:'XY'},{address:8,plane:'VM',pair:'YZ'},{address:9,plane:'PM',pair:'ZX'}
  ]).map(item=>Object.freeze({...item,role:'CALIBRATION_WINDOW'})));
  const RESERVED=Object.freeze([25,26,27,28]);
  const copy=value=>JSON.parse(JSON.stringify(value));
  const SESSION_SCHEMA='nexah.a0.tesa-lissajous-session/1';
  const SESSION_SCENARIO='tesa-lissajous-router';
  const CONTRACT_VERSION='1.0.0';
  const CONTRACT_STATUS='FROZEN_V1';

  function fingerprint(value){
    const text=JSON.stringify(value);let hash=2166136261;
    for(let index=0;index<text.length;index++){hash^=text.charCodeAt(index);hash=Math.imul(hash,16777619);}
    return `fnv1a32:${(hash>>>0).toString(16).padStart(8,'0')}:${text.length}`;
  }

  function routeAddress(domain,channel,side){
    const p=DOMAINS.indexOf(domain),c=CHANNELS.indexOf(channel),s=SIDES.indexOf(side);
    if(p<0||c<0||s<0)throw new RangeError('known domain, channel and side required');
    return p*8+c*2+s+1;
  }

  function windowForAddress(address){
    if(!Number.isInteger(address)||address<1||address>24)throw new RangeError('active route address 1..24 required');
    const index=(address-1)%WINDOWS.length;
    return Object.freeze({...WINDOWS[index],route_address:address,selection_rule:'(route_address−1) mod 3; declared view only'});
  }

  function routeDescriptor(domain,channel,side){
    const address=routeAddress(domain,channel,side),cell=tesa.cell(address),window=windowForAddress(address);
    return Object.freeze({domain,port_ordinal:DOMAINS.indexOf(domain)+1,channel,channel_index:CHANNELS.indexOf(channel),side,address,row:cell.row,col:cell.col,window});
  }

  function gateFromView(view){
    if(!view)return Object.freeze({mask:0,binary:'000000',exact:false,status:'HOLD_SOURCE',bits:joint.gateBits(0)});
    const capture=Boolean(view.comparison&&view.comparison.exact);
    const touch=Boolean(view.gate&&view.gate.touch);
    const witness=Boolean(view.gate&&view.gate.witness===true);
    const kappa=Boolean(view.gate&&Number.isFinite(view.gate.kappa)&&view.gate.kappa>0&&view.gate.kappa<=1);
    const available=Boolean(view.gate&&!view.gate.requiredUnavailable);
    const cutHeld=Boolean(view.cut_q_receipt&&view.cut_q_receipt.exact_return);
    const ordered=[capture,touch,witness,kappa,available,cutHeld];
    const mask=ordered.reduce((sum,bit,index)=>sum+(bit?(1<<(5-index)):0),0);
    const cell=joint.matrixCell(mask);
    return Object.freeze({...cell});
  }

  function route(view,override={}){
    const gate=gateFromView(view);
    const domain=override.domain||view?.selection?.domain||'chemistry';
    const channel=override.channel||view?.selection?.channel||'c00';
    const side=override.side||view?.control_frame?.selected||'R';
    const descriptor=routeDescriptor(domain,channel,side);
    const trace=view?.trace;
    const amplitude=trace&&trace.selection?trace.selection.count/trace.selection.total:null;
    const contribution=trace?.port?.selectedContribution;
    const phase=contribution?Math.atan2(contribution.im,contribution.re):null;
    const exact=gate.exact&&Boolean(view&&view.exact);
    return Object.freeze({
      schema:SCHEMA,identity:IDENTITY,ilau_identity:ILAU_ID,
      status:exact?'WINDOW_LOCATED':gate.status,exact,gate,route:descriptor,
      signal:Object.freeze({amplitude,phase_radians:phase,phase_degrees:phase==null?null:phase*180/Math.PI,source:'existing joint trace; no second clock'}),
      calibrations:WINDOWS,reserved_addresses:RESERVED,
      contracts:Object.freeze({feedback:false,writes_source:false,cross_window_read:false,second_clock:false,active_route_addresses:'1..24',calibration_addresses:'7|8|9',new_ids:Object.freeze([]),new_aliases:Object.freeze([]),new_relations:Object.freeze([]),claim:'deterministic view router; no scientific finding'})
    });
  }

  function sessionRecord(result,options={}){
    if(!result||result.schema!==SCHEMA||!result.exact)throw new TypeError('exact router result required');
    const core={
      schema:SESSION_SCHEMA,identity:IDENTITY,ilau_identity:ILAU_ID,
      route:copy(result.route),window:copy(result.route.window),gate:copy(result.gate),signal:copy(result.signal),
      source_generation:Number.isFinite(options.sourceGeneration)?options.sourceGeneration:null,
      contracts:{feedback:false,writes_source:false,changes_clock:false,changes_carrier:false}
    };
    const receiptFingerprint=fingerprint(core),payload=Object.freeze({...core,receipt_fingerprint:receiptFingerprint});
    return Object.freeze({scenario:SESSION_SCENARIO,title:`TESA ${payload.route.address} → ${payload.window.plane}/${payload.window.pair}`,capturedAt:options.capturedAt||new Date().toISOString(),sourceId:IDENTITY,payload,fingerprint:receiptFingerprint});
  }

  function validateSessionRecord(record){
    const payload=record&&record.payload,bits=payload&&payload.gate&&payload.gate.bits;
    if(!record||record.scenario!==SESSION_SCENARIO||!payload||payload.schema!==SESSION_SCHEMA||record.sourceId!==IDENTITY)return false;
    if(!bits||!['capture','touch','witness','kappa','available','cut'].every(key=>bits[key]===true))return false;
    if(!payload.gate.exact||payload.gate.binary!=='111111'||!Number.isInteger(payload.route?.address)||payload.route.address<1||payload.route.address>24)return false;
    if(!WINDOWS.some(item=>item.plane===payload.window?.plane&&item.pair===payload.window?.pair))return false;
    const {receipt_fingerprint,...core}=payload,expected=fingerprint(core);
    return receipt_fingerprint===expected&&(!record.fingerprint||record.fingerprint===expected);
  }

  function replaySessionRecord(record,adapters={}){
    if(!validateSessionRecord(record))return Object.freeze({status:'HOLD_TAMPERED_RECEIPT',replayed:false});
    const address=record.payload.route.address,plane=record.payload.window.plane;
    adapters.selectAddress?.(address,1);adapters.focusWindow?.(plane);
    return Object.freeze({status:'REPLAYED',replayed:true,address,plane,pair:record.payload.window.pair,source_mutation:false,clock_mutation:false,carrier_mutation:false});
  }

  function latestSessionRecord(storage,ledgerApi){
    const ledger=ledgerApi?.load?.(storage),entries=ledger?.entries;
    if(!Array.isArray(entries))return null;
    return [...entries].reverse().find(entry=>entry?.scenario===SESSION_SCENARIO)||null;
  }

  function hydrateSession(storage,ledgerApi){
    const record=latestSessionRecord(storage,ledgerApi);
    if(!record)return Object.freeze({status:'HOLD_NO_PERSISTED_SESSION',ready:false,record:null});
    if(!validateSessionRecord(record))return Object.freeze({status:'HOLD_TAMPERED_RECEIPT',ready:false,record:copy(record)});
    return Object.freeze({status:'PERSISTED_READY',ready:true,record:copy(record),address:record.payload.route.address,plane:record.payload.window.plane,pair:record.payload.window.pair,fingerprint:record.payload.receipt_fingerprint});
  }

  function resultFromSessionRecord(record){
    if(!validateSessionRecord(record))return null;
    const payload=record.payload;
    return Object.freeze({schema:SCHEMA,identity:IDENTITY,ilau_identity:ILAU_ID,status:'WINDOW_LOCATED',exact:true,gate:copy(payload.gate),route:copy(payload.route),signal:copy(payload.signal),calibrations:WINDOWS,reserved_addresses:RESERVED,contracts:Object.freeze({feedback:false,writes_source:false,cross_window_read:false,second_clock:false,replayed:true,contract_version:CONTRACT_VERSION,contract_status:CONTRACT_STATUS})});
  }

  function retainConfirmed(previous,result){return result&&result.exact?copy(result):previous?copy(previous):null;}
  function eventOrder(view,lastGeneration){
    const generation=Number(view&&view.source_generation);
    if(!Number.isFinite(generation))return Object.freeze({status:'UNORDERED_EVENT',accept:true,generation:null});
    if(Number.isFinite(lastGeneration)&&generation<lastGeneration)return Object.freeze({status:'HOLD_STALE_EVENT',accept:false,generation});
    return Object.freeze({status:'CURRENT_EVENT',accept:true,generation});
  }

  function exhaustiveBattery(){
    const seen=new Set(),counts={cases:0,exact:0,hold:0,mismatches:0};
    const samples=[];
    for(let mask=0;mask<64;mask++)for(const domain of DOMAINS)for(const channel of CHANNELS)for(const side of SIDES){
      const cell=joint.matrixCell(mask),descriptor=routeDescriptor(domain,channel,side),expected=mask===63;
      counts.cases+=1;counts[expected?'exact':'hold']+=1;
      if(mask===63)seen.add(descriptor.address);
      if(cell.exact!==expected){counts.mismatches+=1;if(samples.length<8)samples.push({mask,domain,channel,side});}
    }
    return Object.freeze({schema:'nexah.a0.tesa-lissajous-window-router-battery/1',dimensions:Object.freeze({states:64,ports:3,channels:4,sides:2}),counts:Object.freeze(counts),unique_active_routes:seen.size,reserved_addresses:RESERVED,calibrations:WINDOWS,pass:counts.cases===1536&&counts.exact===24&&counts.hold===1512&&counts.mismatches===0&&seen.size===24,mismatch_samples:Object.freeze(samples)});
  }

  function mount(doc,win){
    const host=doc&&doc.getElementById('tesaLissajousWindowRouter');
    if(!host)return null;
    const q=id=>doc.getElementById(id),ledgerApi=win.A0BenchSessionLedger||null,persisted=hydrateSession(win.localStorage,ledgerApi),initialView=win.A0JointControlReturnAuditView||null,initialGeneration=Number(initialView?.source_generation),state={view:initialView,calibration:8,battery:null,lastConfirmed:null,lastGeneration:Number.isFinite(initialGeneration)?initialGeneration:null,lastCapture:persisted.ready?persisted.record:null,lastCaptureOrigin:persisted.ready?'PERSISTED_CAPTURE':'NONE',lastReplayed:null,persisted};
    function viewAdapters(){
      return{
        selectAddress(address,sign){return win.A0OrbitGridJointsController?.selectAddress?.(address,sign)||null;},
        focusWindow(plane){
          let navigation=null;try{navigation=win.A0BenchSourceSectionsController?.select?.('lissajous')||null;}catch(_){navigation=null;}
          const frame=doc.getElementById('nativeFaceSourceFrame');let focused=false;
          try{const view=frame?.contentWindow?.A0ThreeLissajousPlanesView;if(view?.setFocus){view.setFocus(`${plane}_PLANE`);focused=true;}}catch(_){focused=false;}
          return{navigation,focused};
        }
      };
    }
    function applyConfirmed(result,focus=false){
      if(!result?.exact)return{status:'HOLD'};
      const adapters=viewAdapters();adapters.selectAddress(result.route.address,1);if(focus)adapters.focusWindow(result.route.window.plane);
      return{status:'APPLIED',address:result.route.address,plane:result.route.window.plane};
    }
    function capture(){
      const result=render();if(!result.exact)return Object.freeze({status:'HOLD_EXACT_ROUTE_REQUIRED'});
      const record=sessionRecord(result,{sourceGeneration:state.view?.source_generation});state.lastCapture=record;state.lastCaptureOrigin='LOCAL_CAPTURE';
      if(win.A0BenchSessionLedgerController?.capture)win.A0BenchSessionLedgerController.capture(record);
      else win.A0BenchSessionLedger?.captureStored?.(win.localStorage,record);
      state.persisted=Object.freeze({status:'PERSISTED_READY',ready:true,record:copy(record),address:record.payload.route.address,plane:record.payload.window.plane,pair:record.payload.window.pair,fingerprint:record.payload.receipt_fingerprint});
      q('tlwrReplay').disabled=false;q('tlwrLedger').textContent=`CAPTURED · TESA ${record.payload.route.address} · ${record.payload.window.plane}/${record.payload.window.pair}`;renderInspector(result);
      return record;
    }
    function replay(record=state.lastCapture){
      if(!record)record=latestSessionRecord(win.localStorage,ledgerApi);
      const sourceGeneration=Number(record?.payload?.source_generation);
      if(state.lastCaptureOrigin==='PERSISTED_CAPTURE'&&Number.isFinite(sourceGeneration)&&Number.isFinite(state.lastGeneration)&&sourceGeneration<state.lastGeneration){const held=Object.freeze({status:'HOLD_STALE_GENERATION',replayed:false});q('tlwrLedger').textContent='HOLD · STALE GENERATION';renderInspector(route(state.view||null));return held;}
      const result=replaySessionRecord(record,viewAdapters());
      if(result.replayed){state.lastCapture=copy(record);state.lastReplayed=copy(record);state.calibration=WINDOWS.some(item=>item.address===record.payload.route.address)?record.payload.route.address:state.calibration;}
      q('tlwrLedger').textContent=result.replayed?`REPLAYED · TESA ${result.address} · ${result.plane}/${result.pair}`:result.status.replaceAll('_',' · ');
      renderInspector(route(state.view||null));
      return result;
    }
    function formatSnapshot(label,value,empty){
      if(!value)return `<small>${label}</small><b>${empty}</b><span>—</span>`;
      const payload=value.payload||value,routeValue=payload.route||{},windowValue=payload.window||routeValue.window||{};
      const receipt=payload.receipt_fingerprint||value.fingerprint||'LIVE';
      return `<small>${label}</small><b>TESA ${routeValue.address??'—'} · ${windowValue.plane||'—'}/${windowValue.pair||'—'}</b><span>${receipt}</span>`;
    }
    function renderInspector(current){
      const currentNode=q('tlwrCurrent'),retainedNode=q('tlwrRetained'),replayedNode=q('tlwrReplayed');
      if(currentNode)currentNode.innerHTML=formatSnapshot('CURRENT',current?.exact?current:null,current?.status||'HOLD');
      if(retainedNode)retainedNode.innerHTML=formatSnapshot('RETAINED',state.lastConfirmed||state.persisted?.record,state.persisted?.ready?'PERSISTED READY':'NONE');
      if(replayedNode)replayedNode.innerHTML=formatSnapshot('REPLAYED',state.lastReplayed,'NOT REPLAYED');
    }
    function render(){
      const result=route(state.view||null),selected=result.exact?result.route.address:state.calibration;
      state.lastConfirmed=retainConfirmed(state.lastConfirmed,result);const visible=result.exact?result:state.lastConfirmed;
      host.dataset.status=result.status;
      q('tlwrStatus').textContent=result.status.replaceAll('_',' · ');
      q('tlwrGrid').innerHTML=Array.from({length:28},(_,index)=>{const address=index+1,cal=WINDOWS.find(item=>item.address===address),reserved=RESERVED.includes(address),retained=!result.exact&&visible?.route?.address===address;return `<button type="button" data-address="${address}" class="${address===selected?'selected ':''}${retained?'retained ':''}${cal?'calibration ':''}${reserved?'reserved':''}" aria-label="TESA address ${address}${cal?`, calibration ${cal.plane}`:''}${reserved?', reserved':''}"><b>${address}</b><small>${cal?cal.plane:reserved?'R':retained?'LAST':'·'}</small></button>`;}).join('');
      q('tlwrRoute').textContent=result.exact?`PORT ${result.route.port_ordinal} · ${result.route.channel.toUpperCase()} · ${result.route.side} → TESA ${result.route.address}`:'HOLD · SYNCHRONOUS JOINT RETURN REQUIRED';
      q('tlwrWindow').textContent=result.exact?`${result.route.window.plane}/${result.route.window.pair} · A ${result.signal.amplitude==null?'—':result.signal.amplitude.toFixed(6)} · φ ${result.signal.phase_degrees==null?'—':result.signal.phase_degrees.toFixed(2)}°`:`CALIBRATION TESA ${state.calibration} → ${WINDOWS.find(item=>item.address===state.calibration).plane}/${WINDOWS.find(item=>item.address===state.calibration).pair}`;
      q('tlwrGate').textContent=`${result.gate.binary} · ${result.gate.status}`;
      q('tlwrBattery').textContent=state.battery?`${state.battery.pass?'PASS':'HOLD'} · ${state.battery.counts.cases} CASES · ${state.battery.unique_active_routes} ROUTES`:'READY · 64 × 3 × 4 × 2';
      q('tlwrReceipt').textContent=JSON.stringify({...result,battery:state.battery},null,2);
      q('tlwrReplay').disabled=!state.lastCapture;
      renderInspector(result);
      win.A0TesaLissajousWindowRouterView=result;
      if(result.exact)applyConfirmed(result,false);
      return result;
    }
    q('tlwrSync').addEventListener('click',()=>{state.view=win.A0JointControlReturnAuditView||null;const result=render();applyConfirmed(result,true);});
    q('tlwrRun').addEventListener('click',()=>{state.battery=exhaustiveBattery();render();});
    q('tlwrGrid').addEventListener('click',event=>{const button=event.target.closest('[data-address]');if(!button)return;const address=Number(button.dataset.address);if(WINDOWS.some(item=>item.address===address)){state.calibration=address;render();}});
    q('tlwrExport').addEventListener('click',()=>{const result=render(),blob=new win.Blob([JSON.stringify(result,null,2)],{type:'application/json'}),url=win.URL.createObjectURL(blob),link=doc.createElement('a');link.href=url;link.download='a0-tesa-lissajous-window-router.json';link.click();win.URL.revokeObjectURL(url);});
    q('tlwrCapture').addEventListener('click',capture);q('tlwrReplay').addEventListener('click',()=>replay());
    const onJoint=event=>{const order=eventOrder(event.detail,state.lastGeneration);if(!order.accept){q('tlwrLedger').textContent='HOLD · STALE JOINT EVENT';return;}state.view=event.detail;if(order.generation!=null)state.lastGeneration=order.generation;render();};
    win.addEventListener('a0-joint-control-return',onJoint);
    win.A0BenchReplayHandlers=win.A0BenchReplayHandlers||{};win.A0BenchReplayHandlers[SESSION_SCENARIO]=replay;
    render();
    q('tlwrLedger').textContent=state.persisted.ready?`PERSISTED READY · TESA ${state.persisted.address} · ${state.persisted.plane}/${state.persisted.pair}`:state.persisted.status.replaceAll('_',' · ');
    return Object.freeze({render,route,battery:exhaustiveBattery,capture,replay,get state(){return copy(state);},close(){win.removeEventListener('a0-joint-control-return',onJoint);if(win.A0BenchReplayHandlers?.[SESSION_SCENARIO]===replay)delete win.A0BenchReplayHandlers[SESSION_SCENARIO];}});
  }

  return Object.freeze({IDENTITY,ILAU_ID,SCHEMA,SESSION_SCHEMA,SESSION_SCENARIO,CONTRACT_VERSION,CONTRACT_STATUS,DOMAINS,CHANNELS,SIDES,WINDOWS,RESERVED,fingerprint,routeAddress,windowForAddress,routeDescriptor,gateFromView,route,sessionRecord,validateSessionRecord,replaySessionRecord,latestSessionRecord,hydrateSession,resultFromSessionRecord,retainConfirmed,eventOrder,exhaustiveBattery,mount});
});
