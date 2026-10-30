(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(
    node?require('./a0-lantern-clock-c5-comparator.js'):root.A0LanternClockC5Comparator,
    node?require('./a0-iota-2-3-bridge-probe.js'):root.A0Iota23BridgeProbe,
    node?require('./a0-tower-shell-return.js'):root.A0TowerShellReturn,
    node?require('./a0-iota-tower-return-handoff.js'):root.A0IotaTowerReturnHandoff,
    node?require('./a0-iota-tower-return-matrix.js'):root.A0IotaTowerReturnMatrix
  );
  if(node)module.exports=api;else root.A0WorkbenchSwitchboard=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(clock,iota,tower,handoff,matrix){
  'use strict';
  const VERSION='1.1.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const VIEWS=Object.freeze(['ROUTES','SIGNALS','STATUS','INTERLOCK']);
  const STAGES=Object.freeze(['LANTERN_CONTEXT','TOWER_RETURN','IOTA_RETURN','INTERLOCK','TYPED_VIEW_RETURN','SCIENCE_DESK']);
  const copy=value=>value==null?null:JSON.parse(JSON.stringify(value));

  function fixtures(){
    const pin=Object.freeze({schema:'nexah.a0.tl-final-pin-view/1',identity:IDENTITY,state:Object.freeze({scanner:Object.freeze({screenRead:'OCCUPIED'})}),pin:Object.freeze({decision:'PINNED_2_TO_1',address:'q01'})});
    const dg=Object.freeze({schema:'nexah.a0.dg-sampling-loop-record/1',identity:IDENTITY,current:Object.freeze({stage:'RETURN',sample:'15/18',wheelDeg:280,samples:18,bands:5})});
    const witness=Object.freeze({schema:'nexah.a0.tower-shell-witness/1',identity:IDENTITY,status:'WITNESS_HELD',address:'q01',dgSample:'10/18',basis:Object.freeze({samples:18,bands:5}),sourceStage:'WITNESS'});
    const towerReceipt=tower.closeReturn(pin,dg,witness);
    const closedTower=tower.buildRecord(pin,dg,witness,towerReceipt);
    const openTower=matrix.projectOpenTower(closedTower);
    const bridgeRecord=iota.viewRecord(Object.freeze({...iota.createViewState(),tick:24}));
    const bridgeReceipt=handoff.createBridgeReceipt(bridgeRecord);
    const isolation=Object.freeze({iotaResetPreservesTower:true,towerResetPreservesIota:true,towerRunPreservesIota:true,iotaReplayPreservesTower:true});
    const ledger=matrix.buildLedger({bridgeRecord,openTowerRecord:openTower,closedTowerRecord:closedTower,isolation});
    return Object.freeze({pin,dg,witness,towerReceipt,closedTower,openTower,bridgeRecord,bridgeReceipt,ledger});
  }

  function model(){
    const f=fixtures(),c=clock.model();
    return Object.freeze({
      schema:'nexah.a0.workbench-switchboard/1',version:VERSION,identity:IDENTITY,
      classification:'SOURCE_BOUND_WORKBENCH_ROUTE_LENS',
      lantern:Object.freeze({role:'VIEW_CONTEXT',channels:c.sourceBinding.channels,authority:c.sourceBinding.authority,clockPairDegrees:c.clock.separationDegrees,c5PairDegrees:c.c5.separationDegrees,residualDegrees:c.residual.pairDegrees,feedsInterlock:false}),
      tower:Object.freeze({role:'RETURN_WITNESS',address:f.towerReceipt.address,basis:copy(f.towerReceipt.basis),status:f.towerReceipt.status}),
      iota:Object.freeze({role:'TYPED_HANDOFF',tick:f.bridgeReceipt.tick,periods:copy(f.bridgeReceipt.periods),status:f.bridgeReceipt.status}),
      interlock:Object.freeze({role:'RETURN_INTERLOCK',matrix:copy(f.ledger.matrix.rows),status:f.ledger.status,isolation:copy(f.ledger.isolation),coupledStatus:f.ledger.coupled.status}),
      routes:Object.freeze([
        Object.freeze({from:'LANTERN_PANEL_V',to:'CLOCK_C5_COMPARATOR',type:'VIEW_PROJECTION',status:'BOUND',causal:false}),
        Object.freeze({from:'TOWER_RETURN',to:'RETURN_INTERLOCK',type:'RETURN_WITNESS',status:'BOUND',causal:false}),
        Object.freeze({from:'IOTA_BRIDGE',to:'RETURN_INTERLOCK',type:'TYPED_HANDOFF',status:'BOUND',causal:false}),
        Object.freeze({from:'RETURN_INTERLOCK',to:'TYPED_VIEW_RETURN',type:'POST_HOC_TYPED_HANDOFF',status:'PASS',causal:false}),
        Object.freeze({from:'TYPED_VIEW_RETURN',to:'SCIENCE_DESK',type:'RETURN_RECEIPT',status:'BOUND',causal:false})
      ]),
      readingSequence:STAGES,
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,claimPromotion:false,publication:false}),
      identityReuse:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','ART:A0:MATHEMATICAL_JOINTS','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1','A0_LANTERN_PANEL_V_CONTROL_LENS','A0_IOTA_BRIDGE_DEMONSTRATOR']),
      boundary:'The switchboard is a source-bound reading and control lens. Lantern / Panel V is context only and does not feed the IOTA/Tower interlock. Tower and IOTA keep separate clocks, carriers, provenance and reset behavior. Only matrix state 11 closes the existing post-hoc typed view return. No new canonical route or graph relation is created.'
    });
  }

  function verify(){
    const m=model();let checks=0;
    const require=(value,label)=>{if(!value)throw new Error(label);checks++};
    require(m.lantern.channels===5&&m.lantern.residualDegrees===6,'lantern context');
    require(m.lantern.feedsInterlock===false,'lantern isolation');
    require(m.tower.status==='CLOSED_TYPED_VIEW_RETURN'&&m.tower.address==='q01','tower return');
    require(m.tower.basis.samples===18&&m.tower.basis.bands===5,'tower basis');
    require(m.iota.status==='BRIDGE_RETURN_READY'&&m.iota.tick===24,'iota return');
    require(m.iota.periods.am===8&&m.iota.periods.pm===12,'iota periods');
    require(m.interlock.status==='PASS'&&m.interlock.matrix.length===4,'interlock matrix');
    require(m.interlock.matrix.map(row=>row.observed).join('|')==='HOLD|HOLD|HOLD|COUPLED_VIEW_RETURN','only 11 closes');
    require(Object.values(m.interlock.isolation).every(Boolean),'reset isolation');
    require(m.routes.every(route=>route.causal===false),'non-causal route lens');
    require(Object.values(m.authority).every(value=>value===false),'authority boundary');
    return Object.freeze({status:'PASS_SOURCE_BOUND_SWITCHBOARD',checks,routeCount:m.routes.length,newCanonicalIds:[],relationChanges:[],holds:['shared clock','Lantern-to-interlock feed','carrier identity','causal mechanism','scientific finding','publication']});
  }

  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function routeMarkup(active=-1){
    const nodes=[
      {name:'LANTERN / PANEL V',role:'VIEW CONTEXT',detail:'5 channels · Clock/C5',kind:'context',position:'context'},
      {name:'TOWER RETURN',role:'RETURN WITNESS',detail:'q01 · N18 / 5 bands',kind:'tower',position:'tower'},
      {name:'IOTA BRIDGE',role:'TYPED HANDOFF',detail:'8 / 12 → T24',kind:'iota',position:'iota'},
      {name:'2×2 INTERLOCK',role:'RETURN CONTROL',detail:'parallel inputs · no shared clock',kind:'interlock',position:'interlock'},
      {name:'TYPED VIEW RETURN',role:'RECEIPT',detail:'11 closes',kind:'return',position:'return'},
      {name:'SCIENCE DESK',role:'RETURN',detail:'boundary retained',kind:'desk',position:'desk'}
    ];
    const nodeMarkup=nodes.map((node,index)=>`<article class="wsb-patch-node wsb-patch-node--${node.kind} wsb-patch-node--${node.position} ${index<=active?'is-active':''}" data-stage="${STAGES[index]}"><i class="wsb-port wsb-port--in" aria-hidden="true"></i><small>0${index+1} · ${node.role}</small><b>${node.name}</b><span>${node.detail}</span>${index===0?'<em>CONTEXT · SEPARATE</em>':''}${index===3?'<div class="wsb-hold-ports" aria-label="Interlock ports"><span>00</span><span>10</span><span>01</span><b>11</b></div>':''}<i class="wsb-port wsb-port--out" aria-hidden="true"></i></article>`).join('');
    const activeClass=index=>active>=index?' is-active':'';
    return `<div class="wsb-patch" role="img" aria-label="Farbcodierter Cable Patch: Lantern ist eine separate Kontext-Rail. Tower und IOTA führen parallel in das 2 mal 2 Interlock. Nur Port 11 führt über den Typed View Return zum Science Desk.">
      <svg class="wsb-cables" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
        <defs><marker id="wsbArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z"/></marker></defs>
        <path class="wsb-cable wsb-cable--context${activeClass(0)}" d="M500 115V145M110 145H890"/>
        <g class="wsb-cable-label wsb-cable-label--context"><rect x="397" y="132" width="206" height="27" rx="13.5"/><text x="500" y="150">CONTEXT RAIL · NO FEED</text></g>
        <path class="wsb-cable wsb-cable--tower${activeClass(1)}" d="M285 312C285 352 405 346 468 392" marker-end="url(#wsbArrow)"/>
        <path class="wsb-cable wsb-cable--iota${activeClass(2)}" d="M715 312C715 352 595 346 532 392" marker-end="url(#wsbArrow)"/>
        <g class="wsb-cable-label wsb-cable-label--tower"><rect x="300" y="335" width="112" height="25" rx="12.5"/><text x="356" y="352">WITNESS</text></g>
        <g class="wsb-cable-label wsb-cable-label--iota"><rect x="588" y="335" width="112" height="25" rx="12.5"/><text x="644" y="352">T24 HANDOFF</text></g>
        <path class="wsb-cable wsb-cable--control${activeClass(3)}" d="M500 474V510" marker-end="url(#wsbArrow)"/>
        <g class="wsb-cable-label wsb-cable-label--control"><rect x="640" y="485" width="104" height="25" rx="12.5"/><text x="692" y="502">11 ONLY</text></g>
        <path class="wsb-cable wsb-cable--return${activeClass(4)}" d="M500 600V641" marker-end="url(#wsbArrow)"/>
        <g class="wsb-cable-label wsb-cable-label--return"><rect x="256" y="612" width="104" height="25" rx="12.5"/><text x="308" y="629">RECEIPT</text></g>
      </svg>
      ${nodeMarkup}
      <div class="wsb-patch-legend" aria-label="Farblegende"><span class="is-context">ORIENTATION</span><span class="is-tower">WITNESS</span><span class="is-iota">HANDOFF</span><span class="is-control">INTERLOCK</span><span class="is-return">VALID RETURN</span><span class="is-hold">HOLD / BOUNDARY</span></div>
    </div>`;
  }
  function signalsMarkup(){return `<div class="wsb-table"><span><b>Panel V / Lantern</b><i>VIEW_PROJECTION</i><em>5 channels · Body ≠ Shadow</em></span><span><b>Tower</b><i>RETURN_WITNESS</i><em>q01 · D°G basis · witness held</em></span><span><b>IOTA</b><i>TYPED_HANDOFF</i><em>T24 · periods 8 / 12</em></span><span><b>Interlock</b><i>POST_HOC_TYPED_HANDOFF</i><em>two valid returns · no shared clock</em></span><span><b>Desk</b><i>RETURN_RECEIPT</i><em>claim boundary preserved</em></span></div>`}
  function statusMarkup(){return `<div class="wsb-table"><span><b>BOUND</b><i>Lantern → Clock/C5 lens</i><em>context route only</em></span><span><b>BOUND</b><i>Tower → Interlock</i><em>independent return</em></span><span><b>BOUND</b><i>IOTA → Interlock</i><em>independent return</em></span><span><b>PASS</b><i>Interlock → Typed View Return</i><em>only 11 closes</em></span><span><b>HOLD</b><i>Shared clock / carrier / cause</i><em>not established</em></span></div>`}
  function interlockMarkup(){const rows=model().interlock.matrix;return `<div class="wsb-matrix">${rows.map(row=>`<article class="${row.code==='11'?'is-pass':''}"><small>${row.code}</small><b>${esc(row.observed)}</b><span>IOTA ${row.bridge} · TOWER ${row.tower}</span></article>`).join('')}</div>`}
  function viewMarkup(view,active=-1){if(view==='ROUTES')return `<div class="wsb-route">${routeMarkup(active)}</div>`;if(view==='SIGNALS')return signalsMarkup();if(view==='STATUS')return statusMarkup();return interlockMarkup()}

  function mount(scope=document,win=scope.defaultView||{}){
    const root=scope.querySelector?.('#workbenchSwitchboard');if(!root)return null;
    const stage=root.querySelector('[data-wsb-stage]'),output=root.querySelector('[data-wsb-output]'),run=root.querySelector('[data-wsb-run]'),step=root.querySelector('[data-wsb-step]'),reset=root.querySelector('[data-wsb-reset]');
    let view='ROUTES',active=-1,timer=null;
    const messages=['LANTERN · CONTEXT ONLY · 5 CHANNELS','TOWER · CLOSED TYPED VIEW RETURN · q01','IOTA · T24 · BRIDGE RETURN READY','INTERLOCK · 00/10/01 HOLD · 11 CLOSES','COUPLED VIEW RETURN · NO SHARED CLOCK','SCIENCE DESK · RECEIPT BOUND · CLAIM CEILING HELD'];
    function stop(){if(timer){win.clearInterval(timer);timer=null}run.setAttribute('aria-pressed','false');run.textContent='RUN SWITCHBOARD'}
    function paint(){stage.innerHTML=viewMarkup(view,active);output.textContent=active<0?'READY · SOURCE-BOUND ROUTES · NO SHARED CLOCK':messages[active];root.dataset.view=view.toLowerCase();root.dataset.stage=active<0?'ready':STAGES[active].toLowerCase();root.querySelectorAll('[data-wsb-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.wsbView===view)))}
    function advance(){view='ROUTES';active=Math.min(active+1,STAGES.length-1);paint();if(active===STAGES.length-1)stop();return active}
    function runAll(){if(timer){stop();return}if(active===STAGES.length-1)active=-1;advance();run.setAttribute('aria-pressed','true');run.textContent='PAUSE';if(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches){while(active<STAGES.length-1)advance();return}timer=win.setInterval(advance,520)}
    function clear(){stop();active=-1;view='ROUTES';paint()}
    root.querySelectorAll('[data-wsb-view]').forEach(button=>button.addEventListener('click',()=>{stop();view=button.dataset.wsbView;paint()}));
    run.addEventListener('click',runAll);step.addEventListener('click',()=>{stop();advance()});reset.addEventListener('click',clear);paint();
    return Object.freeze({paint,advance,run:runAll,reset:clear,verify,get record(){return model()}});
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document,window));
  return Object.freeze({VERSION,IDENTITY,VIEWS,STAGES,fixtures,model,verify,routeMarkup,signalsMarkup,statusMarkup,interlockMarkup,viewMarkup,mount});
});
