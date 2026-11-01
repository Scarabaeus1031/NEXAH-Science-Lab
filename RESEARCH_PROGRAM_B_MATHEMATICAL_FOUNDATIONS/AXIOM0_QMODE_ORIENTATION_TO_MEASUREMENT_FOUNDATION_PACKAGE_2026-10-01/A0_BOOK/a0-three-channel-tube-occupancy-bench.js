(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0ThreeChannelTubeOccupancyBench=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const ILAU_ID='SG:LENS:ILAU_ORIENTATION';
  const SCHEMA='nexah.a0.three-channel-tube-occupancy-bench/1';
  const PORTS=Object.freeze([
    Object.freeze({ordinal:1,id:'chemistry',label:'CHEMISTRY',color:'#22d3ee'}),
    Object.freeze({ordinal:2,id:'life',label:'LIFE',color:'#f5bf42'}),
    Object.freeze({ordinal:3,id:'physics',label:'PHYSICS / SPIN',color:'#fb7185'})
  ]);
  const BINS=Object.freeze(['H0+','H0−','H180+','H180−','V90+','V90−','V270+','V270−']);
  const VECTORS=Object.freeze({
    'H0+':[1,0],'H0−':[-1,0],'H180+':[-1,0],'H180−':[1,0],
    'V90+':[0,1],'V90−':[0,-1],'V270+':[0,-1],'V270−':[0,1]
  });
  const copy=value=>JSON.parse(JSON.stringify(value));

  function fingerprint(value){
    const text=JSON.stringify(value);let hash=2166136261;
    for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);}
    return `fnv1a32:${(hash>>>0).toString(16).padStart(8,'0')}:${text.length}`;
  }

  function createState(overrides={}){
    const occupancy=Object.fromEntries(PORTS.map((port,index)=>[port.id,{bin:BINS[index*2],complete:true}]));
    const state={schema:SCHEMA,identity:IDENTITY,ilau_identity:ILAU_ID,occupancy,missing_port:null,tampered:false,generation:0,...copy(overrides)};
    return state;
  }

  function vectorFor(bin){
    if(!VECTORS[bin])throw new RangeError('known Tube Occupancy bin required');
    return Object.freeze({re:VECTORS[bin][0],im:VECTORS[bin][1]});
  }

  function derive(state){
    const contributions=PORTS.map(port=>state.missing_port===port.id?null:vectorFor(state.occupancy?.[port.id]?.bin));
    if(contributions.some(value=>value===null))return Object.freeze({status:'HOLD_MISSING_SOURCE',exact:false,witness:null});
    if(PORTS.some(port=>!state.occupancy?.[port.id]?.complete||!BINS.includes(state.occupancy?.[port.id]?.bin)))return Object.freeze({status:'HOLD_INCOMPLETE_OCCUPANCY',exact:false,witness:null});
    const witness={re:contributions.reduce((sum,value)=>sum+value.re,0)/3,im:contributions.reduce((sum,value)=>sum+value.im,0)/3};
    return Object.freeze({status:state.tampered?'HOLD_TAMPERED_WITNESS':'EXACT_VIEW',exact:!state.tampered,witness:Object.freeze(witness),contributions:Object.freeze(contributions),feedback:false,source_mutation:false});
  }

  function capture(state){
    const result=derive(state);
    if(!result.exact)return Object.freeze({status:result.status,captured:false});
    const core={schema:SCHEMA,identity:IDENTITY,ports:PORTS.map(port=>({ordinal:port.ordinal,id:port.id})),occupancy:copy(state.occupancy),witness:copy(result.witness),generation:state.generation};
    return Object.freeze({...core,fingerprint:fingerprint(core),captured:true,status:'CAPTURED'});
  }

  function validateCapture(record){
    if(!record||record.schema!==SCHEMA||record.identity!==IDENTITY||!Array.isArray(record.ports)||record.ports.length!==3)return 'HOLD_MISSING_SOURCE';
    if(record.ports.some((port,index)=>port.id!==PORTS[index].id||port.ordinal!==PORTS[index].ordinal))return 'HOLD_SOURCE_ADDRESS';
    if(PORTS.some(port=>!record.occupancy?.[port.id]?.complete||!BINS.includes(record.occupancy?.[port.id]?.bin)))return 'HOLD_INCOMPLETE_OCCUPANCY';
    const {fingerprint:stored,captured,status,...core}=record;
    if(stored!==fingerprint(core))return 'HOLD_TAMPERED_FINGERPRINT';
    const restored=createState({occupancy:copy(record.occupancy),generation:record.generation});
    const result=derive(restored);
    if(!result.exact||result.witness.re!==record.witness?.re||result.witness.im!==record.witness?.im)return 'HOLD_WITNESS_MISMATCH';
    return 'EXACT_RETURN';
  }

  function replay(record){
    const status=validateCapture(record);
    if(status!=='EXACT_RETURN')return Object.freeze({status,replayed:false,source_mutation:false});
    const state=createState({occupancy:copy(record.occupancy),generation:record.generation+1});
    return Object.freeze({status:'REPLAYED',replayed:true,state,witness:copy(record.witness),fingerprint:record.fingerprint,source_mutation:false,feedback:false});
  }

  function runChecks(){
    const results=[];const check=(n,id,pass)=>results.push(Object.freeze({n,id,pass:Boolean(pass)}));
    const state=createState(),record=capture(state);
    check(1,'THREE_DISTINCT_SOURCE_PORTS',PORTS.length===3&&new Set(PORTS.map(port=>port.id)).size===3);
    check(2,'COMPLETE_DIRECTED_TUBE_OCCUPANCY',BINS.length===8&&new Set(BINS).size===8&&PORTS.every(port=>state.occupancy[port.id].complete));
    const view=derive(state);
    check(3,'DERIVED_PLUS_ONE_ONLY',view.exact&&view.contributions.length===3&&Number.isFinite(view.witness.re)&&Number.isFinite(view.witness.im));
    check(4,'NO_FEEDBACK',view.feedback===false&&view.source_mutation===false);
    const missing=createState({missing_port:'life'}),tampered={...copy(record),witness:{re:9,im:9}};
    check(5,'MISSING_TAMPERED_HOLD',derive(missing).status==='HOLD_MISSING_SOURCE'&&validateCapture(tampered)==='HOLD_TAMPERED_FINGERPRINT');
    const returned=replay(record);
    check(6,'EXACT_REPLAY',returned.replayed&&returned.fingerprint===record.fingerprint&&JSON.stringify(returned.state.occupancy)===JSON.stringify(state.occupancy));
    return Object.freeze({schema:'nexah.a0.three-channel-tube-occupancy-bench-checks/1',status:results.every(item=>item.pass)?'PASS':'HOLD',checks:Object.freeze(results),passed:results.filter(item=>item.pass).length,total:results.length,new_ids:0,new_relations:0});
  }

  function mount(doc,win){
    const host=doc?.getElementById('threeChannelTubeOccupancyBench');if(!host)return null;
    const q=id=>doc.getElementById(id);let state=createState(),retained=null,lastReplay=null;
    function fmt(value){return Number(value).toFixed(3).replace('-0.000','0.000');}
    function renderLanes(){
      q('tcobLanes').innerHTML=PORTS.map(port=>`<article class="tcob-lane" style="--port:${port.color}" data-port="${port.id}"><header><span>${port.ordinal}</span><b>${port.label}</b><button type="button" data-drop="${port.id}" aria-pressed="${state.missing_port===port.id}">${state.missing_port===port.id?'RESTORE':'DROP'}</button></header><div class="tcob-bins">${BINS.map(bin=>`<button type="button" data-port="${port.id}" data-bin="${bin}" class="${state.occupancy[port.id].bin===bin?'selected':''}">${bin}</button>`).join('')}</div><output>${state.missing_port===port.id?'MISSING · HOLD':`ACTIVE · ${state.occupancy[port.id].bin}`}</output></article>`).join('');
    }
    function render(){
      renderLanes();const view=derive(state);host.dataset.status=view.status;
      q('tcobStatus').textContent=view.status.replaceAll('_',' · ');
      q('tcobWitness').textContent=view.witness?`Z̄ = ${fmt(view.witness.re)} ${view.witness.im<0?'−':'+'} ${fmt(Math.abs(view.witness.im))}i`:'Z̄ = HOLD';
      q('tcobJoint').style.setProperty('--joint-x',`${50+(view.witness?.re||0)*24}%`);q('tcobJoint').style.setProperty('--joint-y',`${50-(view.witness?.im||0)*24}%`);
      q('tcobFingerprint').textContent=retained?.fingerprint||'NOT CAPTURED';
      q('tcobReplay').disabled=!retained;q('tcobTamper').disabled=!retained;
      q('tcobReceipt').textContent=JSON.stringify({view,state,retained,lastReplay,checks:runChecks()},null,2);
      win.A0ThreeChannelTubeOccupancyBenchView=Object.freeze({view:copy(view),state:copy(state)});return view;
    }
    q('tcobLanes').addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.drop){state.missing_port=state.missing_port===button.dataset.drop?null:button.dataset.drop;}else if(button.dataset.port&&button.dataset.bin){state.occupancy[button.dataset.port].bin=button.dataset.bin;state.generation+=1;}render();});
    q('tcobCapture').addEventListener('click',()=>{const record=capture(state);if(record.captured){retained=record;lastReplay=null;}render();});
    q('tcobTamper').addEventListener('click',()=>{if(retained)retained={...copy(retained),witness:{re:9,im:9}};render();});
    q('tcobReplay').addEventListener('click',()=>{lastReplay=replay(retained);if(lastReplay.replayed)state=copy(lastReplay.state);render();});
    q('tcobReset').addEventListener('click',()=>{state=createState();retained=null;lastReplay=null;render();});
    q('tcobRun').addEventListener('click',()=>{const result=runChecks();q('tcobBattery').textContent=`${result.status} · ${result.passed}/${result.total}`;render();});
    render();return Object.freeze({render,capture:()=>capture(state),replay:()=>replay(retained),runChecks,get state(){return copy(state);}});
  }

  return Object.freeze({IDENTITY,ILAU_ID,SCHEMA,PORTS,BINS,VECTORS,fingerprint,createState,vectorFor,derive,capture,validateCapture,replay,runChecks,mount});
});
