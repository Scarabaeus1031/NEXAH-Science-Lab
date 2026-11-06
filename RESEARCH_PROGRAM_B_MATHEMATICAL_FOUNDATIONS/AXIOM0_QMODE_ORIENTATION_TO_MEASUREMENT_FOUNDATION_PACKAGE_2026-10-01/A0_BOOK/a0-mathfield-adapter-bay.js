(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0MathfieldAdapterBay=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const SCHEMA='nexah.a0.mathfield-adapter-receipt/1';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const COMMANDS=Object.freeze(['CONNECT','CAPTURE','STEP_VIEW','VERIFY','RETURN','RECEIPT']);
  const LANES=Object.freeze([
    Object.freeze({id:'carrier',index:1,title:'Carrier / Adresse',status:'LIVE',runtime:true,copy:'101/A0 → Q-Cut → World Cube → J → A0 Return'}),
    Object.freeze({id:'relation',index:2,title:'Relation / Grenze',status:'HOLD',runtime:false,copy:'Event contract fehlt; Grenze bleibt sichtbar und unausgeführt.'}),
    Object.freeze({id:'view',index:3,title:'View / Projektion',status:'NEXT',runtime:false,copy:'Zweite source-bound Projektion nach dem Carrier-Return.'}),
    Object.freeze({id:'analogy',index:4,title:'Analogie / Quarantäne',status:'COMPARE_ONLY',runtime:false,copy:'Nur Vergleich; keine Runtime, Identität oder Evidenzpromotion.'})
  ]);
  const ROUTE=Object.freeze([
    Object.freeze({id:'source',label:'101 / A0',kind:'SOURCE',href:'DRAFTS/A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html',detail:'Open Book / Leaf Fold source window'}),
    Object.freeze({id:'qcut',label:'Q-CUT',kind:'VIEW',href:'DRAFTS/A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html#qcut-title',detail:'declared 18° orientation cut'}),
    Object.freeze({id:'cube',label:'WORLD CUBE',kind:'CARRIER',href:'assets/game-of-worlds-play/ioi-world-cube/index.html',detail:'eight semantic corner addresses'}),
    Object.freeze({id:'j',label:'J',kind:'ADDRESS',href:'assets/a0-field-notes/index.html#vv8-j-title',detail:'shared count / angle address'}),
    Object.freeze({id:'return',label:'A0 RETURN',kind:'RETURN',href:'A0_RESEARCH_DESK.html?desk=overview&channel=machina#a0-current-state',detail:'typed local return and boundary'})
  ]);
  const clone=value=>JSON.parse(JSON.stringify(value));
  function initialState(){return{identity:IDENTITY,lane:'carrier',status:'DISCONNECTED',routeIndex:0,sequence:0,carrier:'101/A0',view:'SOURCE',operator:'NONE',startAnchor:null,address:'ALU',qcutStep:0,jPhase:0,verified:false,returnCheck:'OPEN',events:[]};}
  function append(state,command,detail){const next=clone(state);next.sequence+=1;next.events.push({sequence:next.sequence,command,detail:clone(detail||{})});next.events=next.events.slice(-32);return next;}
  function connect(state){let next=append(state,'CONNECT',{identity:IDENTITY,lane:'carrier'});next.status='READY';return next;}
  function capture(state){if(state.status==='DISCONNECTED')throw Error('CONNECT required before CAPTURE');let next=clone(state);next.startAnchor={carrier:next.carrier,address:next.address,qcutStep:next.qcutStep,jPhase:next.jPhase,routeIndex:0};next=append(next,'CAPTURE',next.startAnchor);next.status='CAPTURED';next.returnCheck='OPEN';return next;}
  function stepView(state){if(!state.startAnchor)throw Error('CAPTURE required before STEP/VIEW');let next=clone(state);next.routeIndex=Math.min(next.routeIndex+1,ROUTE.length-1);const stop=ROUTE[next.routeIndex];next.view=stop.kind;next.operator=stop.id==='qcut'?'Q18':stop.id==='cube'?'CORNER_ADDRESS':stop.id==='j'?'J_STEP':stop.id==='return'?'RETURN_GATE':'NONE';if(stop.id==='qcut')next.qcutStep=5;if(stop.id==='cube')next.address='IRU';if(stop.id==='j')next.jPhase=3;next=append(next,'STEP_VIEW',{routeIndex:next.routeIndex,stop:stop.id,address:next.address,qcutStep:next.qcutStep,jPhase:next.jPhase});next.status=stop.id==='return'?'AT_RETURN_GATE':'ACTIVE';next.verified=stop.id==='return'&&state.verified;return next;}
  function verify(state){if(!state.startAnchor)throw Error('CAPTURE required before VERIFY');const reachedJ=state.routeIndex>=3;let next=append(state,'VERIFY',{reachedJ,address:state.address,jPhase:state.jPhase,boundary:'UI_ADDRESS_ONLY'});next.verified=reachedJ;next.status=reachedJ?'VERIFIED':'HOLD_ROUTE_INCOMPLETE';return next;}
  function returnToAnchor(state){if(!state.startAnchor)throw Error('CAPTURE required before RETURN');if(!state.verified)throw Error('VERIFY required before RETURN');let next=clone(state);Object.assign(next,clone(next.startAnchor),{view:'SOURCE',operator:'NONE',verified:true});const exact=next.carrier===next.startAnchor.carrier&&next.address===next.startAnchor.address&&next.qcutStep===next.startAnchor.qcutStep&&next.jPhase===next.startAnchor.jPhase&&next.routeIndex===next.startAnchor.routeIndex;next=append(next,'RETURN',{exact,anchor:next.startAnchor});next.returnCheck=exact?'EXACT':'MISMATCH';next.status=exact?'RETURN_EXACT':'RETURN_MISMATCH';return next;}
  function receipt(state){return{schema:SCHEMA,version:VERSION,identityReuse:[IDENTITY],lane:state.lane,carrier:state.carrier,view:state.view,operator:state.operator,startAnchor:clone(state.startAnchor),commands:state.events.map(event=>event.command),invariant:['source identity','carrier label','start address','return anchor'],returnCheck:state.returnCheck,boundary:'Source-bound UI address adapter. No shared clock, carrier merge, research execution, mechanism claim or scientific promotion.',status:state.status,route:ROUTE.map(stop=>({id:stop.id,kind:stop.kind,href:stop.href})),events:clone(state.events),navigatorEffect:{newCanonicalIds:0,relationChanges:0},authority:{researchExecution:false,claimPromotion:false,publication:false}};}
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.querySelector('[data-mathfield-adapter-bay]');if(!host)return null;let state=initialState();
    const status=host.querySelector('[data-mab-status]'),readout=host.querySelector('[data-mab-readout]'),receiptNode=host.querySelector('[data-mab-receipt]'),routeNodes=[...host.querySelectorAll('[data-mab-route]')];
    function paint(){host.dataset.status=state.status;status.textContent=`${state.status} · ${state.sequence.toString().padStart(2,'0')}`;readout.textContent=`${ROUTE[state.routeIndex].label} · ${state.address} · Q${state.qcutStep} · J ${state.jPhase}/8`;receiptNode.textContent=JSON.stringify(receipt(state),null,2);routeNodes.forEach((node,index)=>{node.setAttribute('aria-current',index===state.routeIndex?'step':'false');node.dataset.passed=String(index<state.routeIndex||(state.returnCheck==='EXACT'&&index===0));});}
    function run(command){try{if(command==='connect')state=connect(state);if(command==='capture')state=capture(state);if(command==='step')state=stepView(state);if(command==='verify')state=verify(state);if(command==='return')state=returnToAnchor(state);if(command==='receipt')exportReceipt();paint();}catch(error){state.status='HOLD';status.textContent=`HOLD · ${error.message}`;}}
    function exportReceipt(){const payload=receipt(state);if(!win.Blob||!win.URL)return payload;const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-mathfield-adapter-receipt.json';a.click();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);return payload;}
    host.addEventListener('click',event=>{const button=event.target.closest('[data-mab-action]');if(button)run(button.dataset.mabAction);});paint();return Object.freeze({run,get state(){return clone(state)},get receipt(){return receipt(state)}});
  }
  return{VERSION,SCHEMA,IDENTITY,COMMANDS,LANES,ROUTE,initialState,connect,capture,stepView,verify,returnToAnchor,receipt,mount};
});
