(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0BenchMap=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const SCHEMA='nexah.a0.ocb-bench-map/1';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const EVENTS=Object.freeze({selection:'a0:bench-selection',focus:'a0:bench-focus',playback:'a0:bench-playback'});
  const BINDING_TYPES=Object.freeze({
    STATE_OWNER:Object.freeze({label:'STATE OWNER',tone:'state',description:'Bench-owned state or operator control.'}),
    LIVE_COUPLED:Object.freeze({label:'LIVE COUPLED',tone:'live',description:'Reads the current Bench record or engine tick.'}),
    TYPED_HANDOFF:Object.freeze({label:'TYPED HANDOFF',tone:'handoff',description:'Separate source-owned record with explicit acknowledgement.'}),
    VIEW_PROJECTION:Object.freeze({label:'VIEW ONLY',tone:'view',description:'Projection or synchronized display without carrier identity.'}),
    RETURN_WITNESS:Object.freeze({label:'RETURN',tone:'return',description:'Bounded return, replay or retained witness.'}),
    RESULT_LENS:Object.freeze({label:'RESULT LENS',tone:'result',description:'Read-only view over an existing result or history.'}),
    LAUNCHER:Object.freeze({label:'LAUNCHER',tone:'launcher',description:'Opens an existing source without owning its state.'}),
    OPEN_UNBOUND:Object.freeze({label:'OPEN / UNBOUND',tone:'open',description:'Visible candidate with no admitted binding.'})
  });
  const GROUPS=Object.freeze([
    Object.freeze({id:'SOURCE',index:'00',title:'Source Dock',question:'Woher kommt der Record?'}),
    Object.freeze({id:'STATE',index:'01',title:'State & Address',question:'Was ist der Zustand?'}),
    Object.freeze({id:'OPERATE',index:'02',title:'Operators',question:'Was verändert die Lesart?'}),
    Object.freeze({id:'VIEW',index:'03',title:'Views & Grid',question:'Was wird sichtbar?'}),
    Object.freeze({id:'RETURN',index:'04',title:'Return',question:'Kann es zurück?'}),
    Object.freeze({id:'VERIFY',index:'05',title:'Verify & Record',question:'Was bleibt belegt?'})
  ]);
  const rawModules=[
    ['division-return','RETURN','Teilung / Übersetzung / Return','divisionReturnBench','RETURN_WITNESS','division-return','Three independent source-bound contracts; full integer CRT return retains quotient; Chemistry 6+1 fail closed.'],
    ['lens-return','VIEW','AM / VM / PM lenses','benchLensReturn','VIEW_PROJECTION','lens-return','Existing Pentagon lens geometry and Fold Guide share one local display phase; not native-face identity.'],
    ['number-return','RETURN','978 native inverse','benchNumberReturn','RETURN_WITNESS','lens-return','Independent full-integer sequence and captured anchor; not historical E–D–C.'],
    ['prism','VIEW','Prism · three readings','prismRelationLens','VIEW_PROJECTION','lens-return','Separate existing Prism view controller, not a calibrated optical model.'],
    ['antipode','OPERATE','Antipode / Boundary Band','finite-antipode','RETURN_WITNESS','antipode','C6/C8 vertex antipode; odd HOLD; separate Möbius quotient.'],
    ['ghostgons','VIEW','Ghostgons 17 / 19 / 23','finite-ghostgons','VIEW_PROJECTION','ghostgons','Distinct finite polygon contracts, not a shared carrier.'],
    ['source-bank','SOURCE','Native Source Bank','nativeSourceBank','LAUNCHER',null,'Existing source instruments; no copied runtime.'],
    ['native-face','SOURCE','Blue / Pink / Dodeca','nativeFaceBridge','TYPED_HANDOFF','native','Native face record and renderer acknowledgement.'],
    ['pent','SOURCE','PENT source','pentagonWorkbench','TYPED_HANDOFF','bridges','Six source-owned UI fields and rendered readback.'],
    ['life03','SOURCE','LIFE03 source','life03Workbench','TYPED_HANDOFF','bridges','Declared LIFE03 source state with its own clock.'],
    ['state','STATE','Prime address / state','statePanel','STATE_OWNER',null,'Bench-owned carrier, address, position and role record.'],
    ['family-role','STATE','Family role lens','orientationRoleMap','VIEW_PROJECTION',null,'Local F1–F7 reading lens; no canonical Family edge.'],
    ['measurement','STATE','M3 measurement','apertureMeasurement','LIVE_COUPLED','measurement','Four views over one ordered 48-sample record.'],
    ['operators','OPERATE','J · Rθ · Eₛ','operatorPanel','STATE_OWNER',null,'Declared local operators over the Bench state.'],
    ['ihara','OPERATE','Ihara edge-turn','iharaCoreTitle','LIVE_COUPLED',null,'Finite non-backtracking edge transition.'],
    ['ail','OPERATE','A · i · l','ailApertureControl','TYPED_HANDOFF','native','Address, local point and declared hinge control.'],
    ['visual1','VIEW','Visual 1 · 3 + 1','pxaDemonstrator','VIEW_PROJECTION',null,'P, A and Ihara reads plus one TESA view controller.'],
    ['family-grid','VIEW','Family Grid · 3 windows','familyGridCoupler','LIVE_COUPLED',null,'Life Grid, plate and cylinder read one prime/operator record.'],
    ['aperture-stack','VIEW','Aperture Stack','apertureStackCalibration','LIVE_COUPLED','measurement','Six plates retain the shared M3 source fingerprint.'],
    ['fold-lag','VIEW','Fold / Lag / Z slice','foldLagLens','VIEW_PROJECTION',null,'Constructed moving view with explicit local controls.'],
    ['ninefold','RETURN','Four Apertures · Ninefold','fourApertureNinefold','RETURN_WITNESS','native','Four addressed faces and one central return view.'],
    ['go-return','RETURN','Triple Gate return','goReturnTitle','RETURN_WITNESS',null,'Finite C6/C7/C8 return control battery.'],
    ['root7','RETURN','Q4 / Root7','root7Coupling','LIVE_COUPLED','root','One Q4 state read through three declared views.'],
    ['economy','RETURN','Return Economy','returnEconomyDemonstrator','RESULT_LENS','economy','Closed cross-carrier result shown read-only.'],
    ['binder','VERIFY','System Binder','systemBinder','TYPED_HANDOFF','control','Session coordination over four distinct carriers.'],
    ['replay','VERIFY','Native Replay','ocbRecordReplay','RETURN_WITNESS','native','Versioned envelope, validation and exact native return.'],
    ['history','VERIFY','History','historyPanel','RESULT_LENS',null,'Retained local trace and residual reading.'],
    ['record','VERIFY','Record / Export','recordPanel','RETURN_WITNESS',null,'Current state, checks and bounded export record.']
  ];
  const MODULES=Object.freeze(rawModules.map(row=>Object.freeze({id:row[0],group:row[1],label:row[2],focusTarget:row[3],bindingType:row[4],scenario:row[5],description:row[6]})));
  const rawEdges=[
    ['source-bank','state','LAUNCHER'],['native-face','ail','TYPED_HANDOFF'],['pent','binder','TYPED_HANDOFF'],['life03','binder','TYPED_HANDOFF'],
    ['state','operators','LIVE_COUPLED'],['state','measurement','LIVE_COUPLED'],['family-role','family-grid','VIEW_PROJECTION'],
    ['operators','ihara','LIVE_COUPLED'],['ail','ninefold','TYPED_HANDOFF'],['ihara','visual1','VIEW_PROJECTION'],
    ['measurement','aperture-stack','LIVE_COUPLED'],['visual1','family-grid','VIEW_PROJECTION'],['family-grid','root7','VIEW_PROJECTION'],['fold-lag','root7','VIEW_PROJECTION'],
    ['ninefold','replay','RETURN_WITNESS'],['go-return','record','RETURN_WITNESS'],['root7','record','RETURN_WITNESS'],['economy','history','RESULT_LENS'],['binder','record','TYPED_HANDOFF']
  ];
  const EDGES=Object.freeze(rawEdges.map((row,index)=>Object.freeze({id:`edge-${String(index+1).padStart(2,'0')}`,from:row[0],to:row[1],bindingType:row[2]})));
  const copy=value=>JSON.parse(JSON.stringify(value));
  const moduleById=id=>MODULES.find(module=>module.id===id)||null;
  const moduleForTarget=target=>MODULES.find(module=>module.focusTarget===target)||null;
  function createState(overrides={}){return Object.assign({selectedId:'state',filter:'ALL',playback:{state:'IDLE',stationId:null,target:null,moduleId:null,index:-1}},copy(overrides))}
  function selectState(state,id){if(!moduleById(id))throw Error(`unknown Bench Map module: ${id}`);return Object.assign({},copy(state),{selectedId:id})}
  function filterState(state,filter){const valid=filter==='ALL'||Object.prototype.hasOwnProperty.call(BINDING_TYPES,filter);if(!valid)throw Error(`unknown Bench Map filter: ${filter}`);return Object.assign({},copy(state),{filter})}
  function playbackState(state,detail={}){const target=detail.target||detail.focusTarget||null,moduleId=detail.moduleId||moduleForTarget(target)?.id||null;return Object.assign({},copy(state),{playback:{state:String(detail.state||detail.action||'IDLE').toUpperCase(),stationId:detail.stationId||null,target,moduleId,index:Number.isInteger(detail.index)?detail.index:-1}})}
  function registry(){return copy({schema:SCHEMA,version:VERSION,identity:IDENTITY,groups:GROUPS,modules:MODULES,edges:EDGES,bindingTypes:BINDING_TYPES,events:EVENTS,boundary:'Operational projection of the existing Bench. It owns neither Bench state nor playback and creates no Family identity or relation.'})}
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('benchMap');if(!host)return null;
    const groupsNode=doc.getElementById('benchMapGroups'),edgesNode=doc.getElementById('benchMapEdges'),status=doc.getElementById('benchMapStatus'),title=doc.getElementById('benchMapSelectionTitle'),copyNode=doc.getElementById('benchMapSelectionCopy'),meta=doc.getElementById('benchMapSelectionMeta'),focusButton=doc.getElementById('benchMapFocus'),windowButton=doc.getElementById('benchMapWindow');
    if(!groupsNode||!edgesNode||!status||!title||!copyNode||!meta||!focusButton||!windowButton)throw Error('Bench Map mount incomplete');
    let state=createState(),resizeFrame=0;
    const customEvent=(name,detail)=>doc.dispatchEvent(new win.CustomEvent(name,{detail:copy(detail)}));
    function targetFor(module){return doc.getElementById(module.focusTarget)}
    function annotateTargets(){for(const module of MODULES){const target=targetFor(module);if(!target)continue;target.dataset.benchModuleId=module.id;target.dataset.benchBindingType=module.bindingType}}
    function cardMarkup(module){const binding=BINDING_TYPES[module.bindingType];return `<button class="bench-map-node" type="button" data-bench-map-module="${module.id}" data-binding="${module.bindingType}" aria-pressed="false"><small>${binding.label}</small><b>${module.label}</b><span>${module.description}</span><em>${module.id}</em></button>`}
    function build(){groupsNode.innerHTML=GROUPS.map(group=>`<section class="bench-map-group" data-bench-map-group="${group.id}"><header><small>${group.index}</small><b>${group.title}</b><span>${group.question}</span></header><div>${MODULES.filter(module=>module.group===group.id).map(cardMarkup).join('')}</div></section>`).join('');annotateTargets()}
    function selected(){return moduleById(state.selectedId)||MODULES[0]}
    function render(){
      const module=selected(),binding=BINDING_TYPES[module.bindingType];
      host.dataset.playback=state.playback.state;host.dataset.selected=module.id;
      groupsNode.querySelectorAll('[data-bench-map-module]').forEach(button=>{const item=moduleById(button.dataset.benchMapModule),active=item.id===module.id,playback=item.id===state.playback.moduleId,filtered=state.filter!=='ALL'&&item.bindingType!==state.filter;button.setAttribute('aria-pressed',String(active));button.classList.toggle('selected',active);button.classList.toggle('playback',playback);button.classList.toggle('filtered',filtered)});
      doc.querySelectorAll('[data-bench-map-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.benchMapFilter===state.filter)));
      title.textContent=module.label;copyNode.textContent=module.description;meta.innerHTML=`<span data-tone="${binding.tone}">${binding.label}</span><code>${module.id}</code><code>#${module.focusTarget}</code>`;
      focusButton.disabled=!targetFor(module);windowButton.disabled=!module.scenario;windowButton.hidden=!module.scenario;
      const playback=state.playback;status.textContent=playback.moduleId?`${playback.state} · ${playback.stationId||playback.moduleId} · ${playback.moduleId}`:`${playback.state} · MAP READY · BENCH OWNS PLAYBACK`;
      requestEdges();
    }
    function select(id,options={}){state=selectState(state,id);render();const module=selected(),detail={schema:'nexah.a0.bench-selection-event/1',source:'BENCH_MAP',moduleId:module.id,focusTarget:module.focusTarget,bindingType:module.bindingType,group:module.group,scenario:module.scenario,mutatesBenchState:false};customEvent(EVENTS.selection,detail);if(options.focus)focus(module.id);return copy(detail)}
    function revealTarget(target){for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true}
    function focus(id=state.selectedId){const module=moduleById(id);if(!module)return false;const target=targetFor(module);if(!target)return false;revealTarget(target);target.classList.add('bench-map-focus');target.scrollIntoView({behavior:win.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});win.setTimeout?.(()=>target.classList.remove('bench-map-focus'),2400);customEvent(EVENTS.focus,{schema:'nexah.a0.bench-focus-event/1',source:'BENCH_MAP',moduleId:module.id,focusTarget:module.focusTarget,bindingType:module.bindingType,mutatesBenchState:false});return true}
    function openWindow(id=state.selectedId){const module=moduleById(id);if(!module?.scenario||!win.A0CoupledWindowController?.open)return false;win.A0CoupledWindowController.open(module.scenario,{title:module.label,copy:module.description});customEvent(EVENTS.focus,{schema:'nexah.a0.bench-focus-event/1',source:'BENCH_MAP_WINDOW',moduleId:module.id,focusTarget:module.focusTarget,bindingType:module.bindingType,scenario:module.scenario,mutatesBenchState:false});return true}
    function setFilter(filter){state=filterState(state,filter);render();return state.filter}
    function acceptPlayback(detail){state=playbackState(state,detail);if(state.playback.moduleId)state=selectState(state,state.playback.moduleId);render();return copy(state.playback)}
    function edgePath(from,to){const stage=groupsNode.getBoundingClientRect(),a=from.getBoundingClientRect(),b=to.getBoundingClientRect(),x1=a.right-stage.left,y1=a.top+a.height/2-stage.top,x2=b.left-stage.left,y2=b.top+b.height/2-stage.top,span=Math.max(28,(x2-x1)*.46);return `M ${x1} ${y1} C ${x1+span} ${y1}, ${x2-span} ${y2}, ${x2} ${y2}`}
    function drawEdges(){resizeFrame=0;const box=groupsNode.getBoundingClientRect();edgesNode.setAttribute('viewBox',`0 0 ${Math.max(1,box.width)} ${Math.max(1,box.height)}`);edgesNode.innerHTML='';for(const edge of EDGES){const from=groupsNode.querySelector(`[data-bench-map-module="${edge.from}"]`),to=groupsNode.querySelector(`[data-bench-map-module="${edge.to}"]`);if(!from||!to)continue;const path=doc.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',edgePath(from,to));path.dataset.binding=edge.bindingType;path.dataset.from=edge.from;path.dataset.to=edge.to;path.classList.toggle('active',state.playback.moduleId===edge.from||state.playback.moduleId===edge.to||state.selectedId===edge.from||state.selectedId===edge.to);edgesNode.appendChild(path)}}
    function requestEdges(){if(resizeFrame)return;resizeFrame=win.requestAnimationFrame?.(drawEdges)||win.setTimeout?.(drawEdges,0)||0}
    build();groupsNode.addEventListener('click',event=>{const button=event.target.closest?.('[data-bench-map-module]');if(button)select(button.dataset.benchMapModule)});doc.querySelectorAll('[data-bench-map-filter]').forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.benchMapFilter)));focusButton.addEventListener('click',()=>focus());windowButton.addEventListener('click',()=>openWindow());doc.addEventListener(EVENTS.playback,event=>acceptPlayback(event.detail||{}));win.addEventListener?.('resize',requestEdges);if(win.ResizeObserver)new win.ResizeObserver(requestEdges).observe(groupsNode);render();
    return Object.freeze({VERSION,SCHEMA,IDENTITY,EVENTS,BINDING_TYPES,GROUPS,MODULES,EDGES,registry,select,focus,openWindow,setFilter,acceptPlayback,moduleForTarget,get state(){return copy(state)},get snapshot(){return copy({state,selected:selected(),registry:registry()})}})
  }
  return{VERSION,SCHEMA,IDENTITY,EVENTS,BINDING_TYPES,GROUPS,MODULES,EDGES,createState,selectState,filterState,playbackState,moduleById,moduleForTarget,registry,mount};
});
