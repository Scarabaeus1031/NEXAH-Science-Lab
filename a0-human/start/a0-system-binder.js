(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0SystemBinder=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.3.0';
  const SCHEMA='nexah.a0.ocb-system-binder/1';
  const PHASES=Object.freeze(['SOURCE','OPERATOR','EDGE','SHADOW','FAMILY','GRID','RETURN','FOLD','ROOT','RECORD']);
  const SYSTEMS=Object.freeze([
    Object.freeze({id:'orientation',label:'SYSTEM A · ORIENTATION',carrier:'P×A / M3 / APERTURE_STACK',returnScope:'source fingerprint + ordered 48-sample engineering record'}),
    Object.freeze({id:'pentagon',label:'SYSTEM B · PENT',carrier:'PENTAGON_UI_STATE',returnScope:'six source-owned UI fields + rendered readback'}),
    Object.freeze({id:'life03',label:'SYSTEM C · LIFE03',carrier:'LIFE03_64×64_BLINKER',returnScope:'declared Life/E8 source state; revision and audit history excluded'}),
    Object.freeze({id:'dodeca',label:'SYSTEM D · NATIVE DODECA',carrier:'BLUE_PINK_DODECA_60_CELL_SOURCE',returnScope:'A·i·l control, four addressed source faces, replay receipt and exact native source return'})
  ]);
  const copy=value=>JSON.parse(JSON.stringify(value));
  function systemState(id,status='DISCONNECTED',detail='not connected'){if(!SYSTEMS.some(x=>x.id===id))throw Error('unknown binder system');return{id,status,detail,updates:0,lastRecord:null}}
  function createState(overrides={}){
    const systems=Object.fromEntries(SYSTEMS.map(item=>[item.id,systemState(item.id)]));
    return Object.assign({schema:SCHEMA,version:VERSION,status:'IDLE',phaseIndex:0,phase:PHASES[0],running:false,sequence:0,startedAt:null,finishedAt:null,events:[],systems,manualInterruption:false},copy(overrides));
  }
  function updateSystem(state,id,status,detail,record=null){
    if(!state.systems[id])throw Error('unknown binder system');
    const next=copy(state),prior=next.systems[id];next.sequence++;
    next.systems[id]={id,status,detail:String(detail||''),updates:prior.updates+1,lastRecord:record?copy(record):prior.lastRecord};
    next.events.push({seq:next.sequence,kind:'SYSTEM_STATUS',system:id,status,detail:String(detail||'')});next.events=next.events.slice(-128);return next;
  }
  function setPhase(state,index){
    if(!Number.isInteger(index)||index<0||index>=PHASES.length)throw Error('phase index outside binder program');
    if(state.phaseIndex===index)return copy(state);
    const next=copy(state);next.phaseIndex=index;next.phase=PHASES[index];next.sequence++;next.events.push({seq:next.sequence,kind:'PHASE',phase:next.phase});next.events=next.events.slice(-128);return next;
  }
  function start(state,now='LOCAL_SESSION_TIME'){const next=copy(state);next.status='RUNNING';next.running=true;next.startedAt=next.startedAt||now;next.finishedAt=null;next.manualInterruption=false;return next}
  function pause(state,manual=false){const next=copy(state);next.status=manual?'PAUSED_BY_OPERATOR':'PAUSED';next.running=false;next.manualInterruption=Boolean(manual);return next}
  function finish(state,now='LOCAL_SESSION_TIME'){
    const next=copy(state),values=Object.values(next.systems),holds=values.filter(x=>x.status==='HOLD'||x.status==='ERROR'||x.status==='DISCONNECTED');
    next.running=false;next.finishedAt=now;next.status=holds.length?'COMPLETE_WITH_HOLD':'COMPLETE';return next;
  }
  function orientationRecord(win){
    const m3=win.A0ApertureMeasurementController?.record||null,stack=win.A0ApertureStackController?.record||null;
    if(!m3||!stack)return{status:'HOLD',reason:'M3 or Aperture Stack controller unavailable'};
    const same=typeof m3.sourceFingerprint==='string'&&m3.sourceFingerprint===stack.sourceFingerprint;
    return{status:same?'RETURN_EXACT':'HOLD',carrier:'P×A',m3:copy(m3),stack:copy(stack),sameSourceFingerprint:Boolean(same),wholeMachineReturn:false};
  }
  function externalStatus(record){
    if(!record)return{status:'HOLD',detail:'no source record'};
    if(record.status==='HOLD')return{status:'HOLD',detail:record.history?.at?.(-1)?.reason||'source adapter HOLD'};
    if(record.pending)return{status:'WAITING',detail:'source acknowledgement pending'};
    if(record.returnReceipt)return{status:'RETURNED',detail:record.returnReceipt.status||'source return present'};
    if(record.sourceId&&record.fingerprint)return{status:'READY',detail:'confirmed native source record'};
    if(record.currentWitness||record.lastConfirmed)return{status:'READY',detail:'confirmed source witness'};
    return{status:record.status||'DISCONNECTED',detail:'no confirmed source witness'};
  }
  function buildReceipt(state,records={}){
    const systems=SYSTEMS.map(def=>({id:def.id,carrier:def.carrier,returnScope:def.returnScope,status:state.systems[def.id].status,detail:state.systems[def.id].detail,record:records[def.id]??state.systems[def.id].lastRecord??null}));
    const returned=systems.filter(x=>['RETURNED','RETURN_EXACT','READY'].includes(x.status)).length,holds=systems.filter(x=>['HOLD','ERROR','DISCONNECTED'].includes(x.status)).length;
    return{schema:SCHEMA,version:VERSION,status:holds?'BOUNDED_SESSION_WITH_HOLD':'BOUNDED_SESSION_RETURN',phase:state.phase,phaseIndex:state.phaseIndex,sequence:state.sequence,startedAt:state.startedAt,finishedAt:state.finishedAt,systems,summary:{systems:systems.length,returned,holds},contracts:{sharedCarrier:false,sharedClock:false,simultaneousSnapshot:false,typedHandoffs:true,wholeMachineReturn:false},authority:{newCanonicalIdentity:false,newCanonicalRelation:false,researchExecution:false,claimPromotion:false,publication:false},boundary:'Four distinct carriers are coordinated through typed source-owned adapters. The binder preserves records and handoffs; it does not merge carriers, clocks, mechanisms or scientific identity.'};
  }
  function buildSummary(state){return{schema:SCHEMA,version:VERSION,status:state.status,phase:state.phase,phaseIndex:state.phaseIndex,sequence:state.sequence,systems:SYSTEMS.map(def=>({id:def.id,carrier:def.carrier,status:state.systems[def.id].status,detail:state.systems[def.id].detail})),contracts:{sharedCarrier:false,sharedClock:false,simultaneousSnapshot:false,typedHandoffs:true,wholeMachineReturn:false}}}
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('systemBinder');if(!host)return null;
    const byId=id=>doc.getElementById(id),required=['systemBinderConnect','systemBinderStart','systemBinderPause','systemBinderStep','systemBinderReset','systemBinderExport','systemBinderPhase','systemBinderLedger'];
    const missing=required.filter(id=>!byId(id));if(missing.length)throw Error('System Binder mount missing: '+missing.join(', '));
    let state=createState(),timer=null,connecting=false;
    const now=()=>new Date().toISOString(),recordFor=id=>id==='orientation'?orientationRecord(win):id==='pentagon'?win.A0PentagonBench?.exportRecord?.()||null:id==='life03'?win.A0Life03Bench?.exportRecord?.()||null:win.A0NativeFaceBenchController?.exportRecord?.()||null;
    function render(){
      byId('systemBinder').dataset.status=state.status;byId('systemBinderPhase').textContent=`${String(state.phaseIndex).padStart(2,'0')} · ${state.phase}`;
      byId('systemBinderStatus').textContent=state.status+(state.manualInterruption?' · MANUAL INTERVENTION':'');
      for(const def of SYSTEMS){const item=state.systems[def.id],node=doc.querySelector(`[data-binder-system="${def.id}"]`);if(node){node.dataset.status=item.status;node.querySelector('[data-binder-state]').textContent=item.status;node.querySelector('[data-binder-detail]').textContent=item.detail;}}
      byId('systemBinderLedger').textContent=JSON.stringify(buildSummary(state),null,2);
      byId('systemBinderStart').disabled=connecting||state.running;byId('systemBinderPause').disabled=!state.running;byId('systemBinderStep').disabled=connecting||state.running;
    }
    function refreshSystems(force=false){
      const orientation=orientationRecord(win),orientationDetail=orientation.status==='RETURN_EXACT'?'M3 + stack share ordered source fingerprint':'local orientation controllers unavailable',orientationPrior=state.systems.orientation;if(force||orientationPrior.status!==orientation.status||orientationPrior.detail!==orientationDetail)state=updateSystem(state,'orientation',orientation.status,orientationDetail,orientation);
      for(const id of ['pentagon','life03','dodeca']){const record=recordFor(id),s=externalStatus(record),prior=state.systems[id];if(force||prior.status!==s.status||prior.detail!==s.detail)state=updateSystem(state,id,s.status,s.detail,record);}
    }
    async function connectAll(){
      if(connecting)return;connecting=true;state.status='CONNECTING';render();
      refreshSystems();
      for(const [id,controller] of [['pentagon',win.A0PentagonBench],['life03',win.A0Life03Bench]]){
        try{if(!controller?.connect)throw Error('adapter unavailable');await controller.connect();controller.setFollow(true);const record=controller.exportRecord();state=updateSystem(state,id,'READY','confirmed source witness · Master follow armed',record);}
        catch(error){state=updateSystem(state,id,'HOLD',error.message,controller?.exportRecord?.()||null);}
      }
      try{const controller=win.A0NativeFaceBenchController;if(!controller?.connect)throw Error('native face adapter unavailable');await controller.connect();await controller.capture();state=updateSystem(state,'dodeca','READY','native renderer confirmed · source anchor captured',controller.exportRecord());}catch(error){state=updateSystem(state,'dodeca','HOLD',error.message,recordFor('dodeca'));}
      connecting=false;state.status='READY';render();return copy(state);
    }
    function stopTimer(){if(timer){win.clearInterval(timer);timer=null}}
    function sync(){
      const source=win.A0MasterDemoBridge?.snapshot?.();if(state.running&&source&&!source.running&&source.phaseIndex!==PHASES.length-1&&!win.A0MasterDemoBridge?.isPending?.()){pauseAll(true);return;}
      const master=win.A0MasterDemoBridge?.snapshot?.();if(master){state=setPhase(state,master.phaseIndex);if(state.running&&!master.running&&master.phaseIndex===PHASES.length-1&&!win.A0MasterDemoBridge?.isPending?.()){refreshSystems();state=finish(state,now());win.A0ApertureMeasurementController?.stop?.();win.A0ApertureStackController?.stop?.();stopTimer();}}
      refreshSystems();render();
    }
    async function play(){
      if(connecting)return;if(state.status==='IDLE'||state.status==='CONNECTING'||Object.values(state.systems).every(x=>x.status==='DISCONNECTED'))await connectAll();
      for(const id of ['pentagon','life03']){try{const c=id==='pentagon'?win.A0PentagonBench:win.A0Life03Bench;if(c?.isReady?.())c.setFollow(true)}catch(error){state=updateSystem(state,id,'HOLD',error.message,recordFor(id));}}
      state=start(state,now());win.A0ApertureMeasurementController?.start?.();win.A0ApertureStackController?.start?.();win.A0MasterDemoBridge?.start?.();try{await win.A0AILApertureControlController?.run?.()}catch(error){state=updateSystem(state,'dodeca','HOLD',error.message,recordFor('dodeca'))}win.A0FourApertureNinefoldController?.play?.();stopTimer();timer=win.setInterval(sync,300);sync();
    }
    function pauseAll(manual=false){stopTimer();win.A0MasterDemoBridge?.pause?.();win.A0ApertureMeasurementController?.stop?.();win.A0ApertureStackController?.stop?.();win.A0FourApertureNinefoldController?.stop?.();state=pause(state,manual);refreshSystems();render()}
    async function stepAll(){if(state.status==='IDLE')await connectAll();win.A0ApertureMeasurementController?.step?.();win.A0ApertureStackController?.step?.();win.A0MasterDemoBridge?.step?.();sync()}
    function resetAll(){stopTimer();win.A0MasterDemoBridge?.reset?.();win.A0ApertureMeasurementController?.stop?.();win.A0ApertureStackController?.reset?.();win.A0FourApertureNinefoldController?.reset?.();for(const c of [win.A0PentagonBench,win.A0Life03Bench]){try{c?.setFollow?.(false)}catch(_){}}state=createState();refreshSystems(true);render()}
    function sessionReceipt(){return{...buildReceipt(state,Object.fromEntries(SYSTEMS.map(x=>[x.id,recordFor(x.id)]))),viewingLoop:win.A0MasterDemoBridge?.loopSnapshot?.()||null,observedConnections:win.A0BinderConnectionsView?.snapshot()||null};}
    function exportReceipt(){const payload=sessionReceipt(),url=win.URL.createObjectURL(new win.Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-ocb-system-binder-session.json';a.click();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);return payload}
    byId('systemBinderConnect').addEventListener('click',connectAll);byId('systemBinderStart').addEventListener('click',play);byId('systemBinderPause').addEventListener('click',()=>pauseAll(false));byId('systemBinderStep').addEventListener('click',stepAll);byId('systemBinderReset').addEventListener('click',resetAll);byId('systemBinderExport').addEventListener('click',exportReceipt);
    byId('systemBinderLoop')?.addEventListener('change',()=>win.A0MasterDemoBridge?.setLoop?.(byId('systemBinderLoop').checked));
    doc.addEventListener('visibilitychange',()=>{if(doc.hidden&&state.running)pauseAll(true)});win.addEventListener?.('pagehide',()=>pauseAll(true));
    refreshSystems();render();return Object.freeze({connectAll,play,pause:pauseAll,step:stepAll,reset:resetAll,exportReceipt,get state(){return copy(state)},get receipt(){return sessionReceipt();}});
  }
  return{VERSION,SCHEMA,PHASES,SYSTEMS,createState,updateSystem,setPhase,start,pause,finish,orientationRecord,externalStatus,buildReceipt,buildSummary,mount};
});
