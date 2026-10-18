(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0ExternalAdapterPack=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0',SCHEMA='nexah.a0.ocb-external-adapter-pack/1';
  const copy=value=>JSON.parse(JSON.stringify(value));
  const JARP_CASES=Object.freeze([
    ['APP-01','Full CRT carrier return','PASS_EXACT_RETURN'],['APP-02','Withheld CRT coordinate','HOLD_MISSING_WITNESS'],['APP-03','QRT column collision','HOLD_MISSING_WITNESS'],['APP-04','1111 palindrome source collision','HOLD_MISSING_WITNESS'],['APP-05','1211 negative closure control','PASS_NEGATIVE_CONTROL'],['APP-06','1221 positive neighbor','HOLD_MISSING_WITNESS'],['APP-07','8888 registered source collision','HOLD_MISSING_WITNESS'],['APP-08','Tessarec same-address fiber','HOLD_MISSING_WITNESS'],['APP-09','RATH 42 namespace non-identity','REJECT_IDENTITY_COLLAPSE'],['APP-10','Totient shadow ladder','PASS_EXACT_PROFILE']
  ].map(([id,title,result])=>Object.freeze({id,title,result})));
  const AXIAL_LANES=Object.freeze([
    ['A0-AXIAL-FOUNDATION','sequence',8],['A0-AXIAL-NCS','sequence',12],['A0-AXIAL-LIFE08','time',32],['A0-AXIAL-THREE-DOMAIN','time',36],['A0-AXIAL-IEEE300','pipeline',4],['A0-AXIAL-TESSAREC','layer',3]
  ].map(([id,axisKind,count])=>Object.freeze({id,axisKind,count})));
  const AXIS08_PHASES=Object.freeze(['CARRIER','BREATH','EIGHT_POLES','SPLIT','FOLD_8_TO_7_PLUS_RESIDUAL','JANUS','THIRD_FORM','RETURN']);
  const BOUNDARY_VIEWS=Object.freeze(['area','boundary','graph','pascal']);
  const DEFINITIONS=Object.freeze({
    jarp:Object.freeze({id:'jarp',package:'A',title:'Joint Application / JARP',source:'A0_JOINT_APPLICATION_DEMONSTRATOR.html',sourceRecord:'assets/a0-joint-application-return-protocol-v1.json',sourceHash:'faa920d76df33b5e1d497f4d15ee0be3a6d2ca7cb47d183ad73f683026168640',mode:'FROZEN_PROTOCOL_READER'}),
    axial:Object.freeze({id:'axial',package:'A',title:'Axial Carrier Suite',source:'A0_AXIAL_CARRIER_ADAPTER_SUITE.html',sourceRecord:'assets/a0-axial-carrier-adapter-v1.json',sourceHash:'ea16170658da72773392b5eef614e33b14e844d4fd0bbd8942567687e94b2606',mode:'PROJECTION_ONLY_SOURCE_RECORD'}),
    axis08:Object.freeze({id:'axis08',package:'B',title:'AXIS08 Fold / Return',source:'A0_AXIS08_FOLD_RETURN_SEQUENCER.html',sourceRecord:'assets/a0-axis08-fold-return-sequencer-v1.json',sourceHash:'0bacf7464d857220897fd9fc52e4d4af4b8bc5cb901eca2fe784d6ba464c4874',mode:'EXACT_QUOTIENT_RESIDUAL_VIEW'}),
    boundary:Object.freeze({id:'boundary',package:'B',title:'Boundary Graph',source:'A0_BOUNDARY_GRAPH_DEMONSTRATOR.html',sourceRecord:'A0_BOUNDARY_GRAPH_DEMONSTRATOR.html',sourceHash:'9ef7be7e62d034966db1506708378673d705089c16b67448533610b9d9ecf883',mode:'FINITE_REPRESENTATION_READER'})
  });
  function fold(values,pairStart=3,flip=false){
    if(!Array.isArray(values)||values.length!==8||!values.every(Number.isFinite))throw Error('eight finite values required');
    if(!Number.isInteger(pairStart)||pairStart<0||pairStart>6)throw Error('pairStart must be 0..6');
    const left=values[pairStart],right=values[pairStart+1],coupled=(left+right)/2,residual=(left-right)/2*(flip?-1:1),pair=flip?[coupled-residual,coupled+residual]:[coupled+residual,coupled-residual],reconstructed=values.slice();reconstructed[pairStart]=pair[0];reconstructed[pairStart+1]=pair[1];
    return{pair:[pairStart,pairStart+1],quotient:values.filter((_,i)=>i!==pairStart&&i!==pairStart+1).concat(coupled),residual,reconstructed,error:Math.max(...values.map((value,i)=>Math.abs(value-reconstructed[i]))),flip};
  }
  function boundaryRecord(B=100,a=5,b=6,view='area',channel=true){
    if(!Number.isFinite(B)||!Number.isFinite(a)||!Number.isFinite(b))throw Error('finite boundary inputs required');
    if(!BOUNDARY_VIEWS.includes(view))throw Error('unknown boundary view');
    return{B,a,b,view,channel:Boolean(channel),fields:{f00:B*B,f01:B*b,f10:a*B,f11:a*b},total:(B+a)*(B+b),pascal:{n:a+b,mirror:[a,b]},boundary:'Area, boundary, graph and Pascal are representations of declared inputs, not identical structures.'};
  }
  function initialCurrent(id){
    if(id==='jarp')return{caseIndex:0,case:JARP_CASES[0]};
    if(id==='axial')return{laneIndex:0,lane:AXIAL_LANES[0],step:0,projectionOnly:true};
    if(id==='axis08'){const values=[.16,.29,.41,.58,.74,.67,.43,.22];return{phaseIndex:0,phase:AXIS08_PHASES[0],values,fold:fold(values,3,false)};}
    if(id==='boundary')return boundaryRecord();
    throw Error('unknown adapter');
  }
  function createAdapterState(id){const def=DEFINITIONS[id];if(!def)throw Error('unknown adapter');return{id,package:def.package,status:'DISCONNECTED',sequence:0,running:false,current:initialCurrent(id),anchor:null,receipt:null,events:[]};}
  function event(state,kind,detail){const next=copy(state);next.sequence++;next.events.push({sequence:next.sequence,kind,detail:copy(detail)});next.events=next.events.slice(-64);return next;}
  function connect(state){let next=event(state,'CONNECT',{sourceHash:DEFINITIONS[state.id].sourceHash});next.status='READY';return next;}
  function capture(state){if(state.status==='DISCONNECTED')throw Error('connect before capture');let next=event(state,'CAPTURE',state.current);next.anchor=copy(state.current);next.status='CAPTURED';next.receipt=null;return next;}
  function step(state){if(state.status==='DISCONNECTED')throw Error('connect before step');let next=copy(state);
    if(state.id==='jarp'){const caseIndex=(state.current.caseIndex+1)%JARP_CASES.length;next.current={caseIndex,case:JARP_CASES[caseIndex]};}
    if(state.id==='axial'){let laneIndex=state.current.laneIndex,step=state.current.step+1,lane=AXIAL_LANES[laneIndex];if(step>=lane.count){laneIndex=(laneIndex+1)%AXIAL_LANES.length;lane=AXIAL_LANES[laneIndex];step=0;}next.current={laneIndex,lane,step,projectionOnly:true};}
    if(state.id==='axis08'){const phaseIndex=(state.current.phaseIndex+1)%AXIS08_PHASES.length,flip=phaseIndex===5?!state.current.fold.flip:state.current.fold.flip;next.current={...state.current,phaseIndex,phase:AXIS08_PHASES[phaseIndex],fold:fold(state.current.values,3,flip)};}
    if(state.id==='boundary'){const index=(BOUNDARY_VIEWS.indexOf(state.current.view)+1)%BOUNDARY_VIEWS.length;next.current=boundaryRecord(state.current.B,state.current.a,state.current.b,BOUNDARY_VIEWS[index],state.current.channel);}
    next=event(next,'STEP',next.current);next.status='ACTIVE';return next;
  }
  function returnToAnchor(state){if(!state.anchor)throw Error('capture before return');let next=copy(state);next.current=copy(state.anchor);const exact=JSON.stringify(next.current)===JSON.stringify(state.anchor);next=event(next,'RETURN',{exact});next.receipt={status:exact?'RETURN_EXACT':'RETURN_MISMATCH',exact,sequence:next.sequence};next.status=next.receipt.status;next.running=false;return next;}
  function setRunning(state,running){const next=event(state,running?'PLAY':'PAUSE',{running:Boolean(running)});next.running=Boolean(running);next.status=running?'RUNNING':next.status==='RUNNING'?'PAUSED':next.status;return next;}
  function exportRecord(state){const def=DEFINITIONS[state.id];return{schema:SCHEMA,version:VERSION,adapterId:state.id,package:def.package,title:def.title,source:def.source,sourceRecord:def.sourceRecord,sourceHash:def.sourceHash,mode:def.mode,status:state.status,sequence:state.sequence,current:copy(state.current),anchor:copy(state.anchor),returnReceipt:copy(state.receipt),events:copy(state.events),contracts:{sharedCarrier:false,sharedClock:false,wholeMachineReturn:false,sourceOwnedIdentity:true},authority:{researchExecution:false,claimPromotion:false,publication:false},boundary:'Bounded source-record adapter. It does not attest the full source page, merge carriers or execute a Science Lab run.'};}
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('externalAdapterPack');if(!host)return null;let states=Object.fromEntries(Object.keys(DEFINITIONS).map(id=>[id,createAdapterState(id)])),timer=0;
    const card=id=>host.querySelector(`[data-external-adapter="${id}"]`),all=()=>Object.keys(DEFINITIONS);
    function display(id){const node=card(id),state=states[id];if(!node)return;node.dataset.status=state.status;node.querySelector('[data-adapter-status]').textContent=state.status;node.querySelector('[data-adapter-sequence]').textContent=String(state.sequence).padStart(2,'0');node.querySelector('[data-adapter-readout]').textContent=JSON.stringify(state.current,null,2);node.querySelector('[data-adapter-receipt]').textContent=state.receipt?.status||'NO RETURN RECEIPT';}
    function render(){all().forEach(display);const running=all().filter(id=>states[id].running).length;doc.getElementById('externalAdapterPackStatus').textContent=running?`${running}/4 ADAPTER LIVE`:`${all().filter(id=>states[id].status!=='DISCONNECTED').length}/4 CONNECTED`;}
    function ensure(id){if(states[id].status==='DISCONNECTED')states[id]=connect(states[id]);if(!states[id].anchor)states[id]=capture(states[id]);}
    function act(id,action){if(action==='connect')states[id]=connect(states[id]);if(action==='capture'){ensure(id);states[id]=capture(states[id]);}if(action==='step'){ensure(id);states[id]=step(states[id]);}if(action==='return'){states[id]=returnToAnchor(states[id]);}render();return copy(states[id]);}
    function stopTimer(){if(timer){win.clearInterval(timer);timer=0;}}
    function play(ids=all()){ids.forEach(id=>{ensure(id);states[id]=setRunning(states[id],true);});stopTimer();timer=win.setInterval(()=>{all().forEach(id=>{if(states[id].running)states[id]=step(states[id]);});render();},1100);render();}
    function pause(ids=all()){ids.forEach(id=>{if(states[id].running)states[id]=setRunning(states[id],false);});if(!all().some(id=>states[id].running))stopTimer();render();}
    function returnAll(ids=all()){pause(ids);ids.forEach(id=>{ensure(id);states[id]=returnToAnchor(states[id]);});render();return ids.map(id=>exportRecord(states[id]));}
    function exportAll(){const payload={schema:SCHEMA,version:VERSION,status:'BOUNDED_ADAPTER_SESSION',records:all().map(id=>exportRecord(states[id])),contracts:{sharedCarrier:false,sharedClock:false,wholeMachineReturn:false,typedAdapters:true},authority:{newIdentity:false,newRelation:false,researchExecution:false,claimPromotion:false,publication:false}},url=win.URL.createObjectURL(new win.Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-ocb-external-adapter-pack-session.json';a.click();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);return payload;}
    host.addEventListener('click',event=>{const button=event.target.closest('[data-adapter-action]');if(!button)return;const id=button.closest('[data-external-adapter]')?.dataset.externalAdapter,action=button.dataset.adapterAction;try{if(action==='play')states[id].running?pause([id]):play([id]);else act(id,action);}catch(error){states[id].status='HOLD';states[id].receipt={status:'HOLD',reason:error.message};render();}});
    doc.getElementById('externalAdapterPlayAll').addEventListener('click',()=>all().some(id=>states[id].running)?pause():play());doc.getElementById('externalAdapterReturnAll').addEventListener('click',()=>returnAll());doc.getElementById('externalAdapterExport').addEventListener('click',exportAll);doc.addEventListener('visibilitychange',()=>{if(doc.hidden)pause()});render();
    return Object.freeze({play,pause,returnAll,exportAll,act,get state(){return copy(states)},get records(){return all().map(id=>exportRecord(states[id]))}});
  }
  return{VERSION,SCHEMA,DEFINITIONS,JARP_CASES,AXIAL_LANES,AXIS08_PHASES,BOUNDARY_VIEWS,fold,boundaryRecord,createAdapterState,connect,capture,step,returnToAnchor,setRunning,exportRecord,mount};
});
