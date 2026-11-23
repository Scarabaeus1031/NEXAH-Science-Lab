(function(root,factory){
  const core=typeof module==='object'&&module.exports?require('./a0-pascal-cylinder-return.js'):root.A0PascalCylinderReturn;
  const api=factory(core);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.A0PointLineTopologyReturn=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(core){
  'use strict';
  if(!core)throw Error('A0PascalCylinderReturn is required');
  const IDENTITY='ART:A0:MATHEMATICAL_JOINTS';
  const STAGES=Object.freeze([
    Object.freeze({id:'DOT',glyph:'.',label:'SOURCE POINT'}),
    Object.freeze({id:'COLON',glyph:':',label:'OPEN JOINT'}),
    Object.freeze({id:'LINE',glyph:'—',label:'INTERVAL / BOUNDARY'}),
    Object.freeze({id:'SURFACE',glyph:'▱',label:'STRIP / CHART'}),
    Object.freeze({id:'GLUE',glyph:'≋',label:'EXPLICIT PAIRING'}),
    Object.freeze({id:'TOPOLOGY',glyph:'◎',label:'GLOBAL SURFACE / QUOTIENT'}),
    Object.freeze({id:'RETURN',glyph:'↩',label:'LOCAL EUCLID RETURN'})
  ]);
  const PAIRINGS=Object.freeze({
    OPEN:Object.freeze(['NO PAIRING','∂=1']),
    TORUS:Object.freeze(['(0,t)~(1,t)','(s,0)~(s,1)']),
    MOBIUS:Object.freeze(['(0,t)~(1,1−t)','TOP/BOTTOM REMAIN ONE BOUNDARY']),
    KLEIN:Object.freeze(['(0,t)~(1,1−t)','(s,0)~(s,1)'])
  });
  const OPEN_STRIP=Object.freeze({id:'OPEN',label:'UNPAIRED STRIP',boundaryCount:1,orientable:true,gluing:'NONE',construction:'[0,1] × [0,1] WITH NO EDGE IDENTIFICATION'});
  const SOURCE_BINDING=Object.freeze({carrier:'PC1111',n:661,cubeAddress:Object.freeze([0,5,5]),returnId:'PC1111:N0661',pointRole:'SOURCE_POINT'});
  const B_STATIONS=Object.freeze([
    Object.freeze({id:'B1',label:'TORUS',kind:'GLOBAL_SURFACE',surface:'TORUS',boundaryCount:0,orientable:true}),
    Object.freeze({id:'B2',label:'MÖBIUS',kind:'GLOBAL_SURFACE',surface:'MOBIUS',boundaryCount:1,orientable:false}),
    Object.freeze({id:'B3',label:'SEAM',kind:'CUT_GLUE_INTERFACE',surface:null,boundaryCount:null,orientable:null}),
    Object.freeze({id:'B4',label:'KLEIN',kind:'GLOBAL_SURFACE',surface:'KLEIN',boundaryCount:0,orientable:false,construction:'TWO MOBIUS BANDS GLUED ALONG THEIR BOUNDARY CIRCLES'}),
    Object.freeze({id:'B5',label:'ROOT SPACE',kind:'DISCRETE_GRAPH_WITNESS',carrier:'ART:TESSAREC:ROOT_SPACE_8_16',q3Vertices:8,q3Edges:12,q4Vertices:16,q4Edges:32,notRootMetric:true}),
    Object.freeze({id:'B6',label:'LOCAL RETURN',kind:'CHART_RETURN',interiorChart:'φ: U⊂S → V⊂ℝ²',boundaryChart:'φ: U⊂S → V⊂ℍ²',globalWitnessRetained:true})
  ]);
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function inspect(stageIndex=0,topologyMode='OPEN'){
    const index=clamp(Number.isFinite(Number(stageIndex))?Math.trunc(Number(stageIndex)):0,0,STAGES.length-1);
    const mode=String(topologyMode).toUpperCase();
    const topology=mode==='OPEN'?OPEN_STRIP:core.topologyState(mode);
    return Object.freeze({identity:IDENTITY,index,stage:STAGES[index],topology,pairings:PAIRINGS[topology.id],sourceBinding:SOURCE_BINDING,sourceRole:'SOURCE_POINT',colonRole:'OPEN_TYPED_JOINT / NO GLUING SELECTED',localChart:'φ: U⊂S → V⊂ℝ² / ℍ² at boundary',globalRetained:true,boundary:'The dot is an addressed source point, not a decimal or product operator. The colon is an open delimiter, not division, ratio, equality or a topology. A quotient topology appears only after an explicit pairing. Local return does not flatten or erase the global surface.'});
  }
  function inspectBridge(station='B1'){
    const id=typeof station==='number'?`B${clamp(Math.trunc(station),1,6)}`:String(station).toUpperCase();
    const record=B_STATIONS.find(item=>item.id===id)||B_STATIONS[0];
    return Object.freeze({identity:IDENTITY,sourceBinding:SOURCE_BINDING,station:record,routeType:'TYPED_COMPARISON_AND_RETURN_LEDGER_NOT_TRANSFORMATION_CHAIN',rootMetricImported:false,newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([])});
  }
  function verify(){
    const checks=[];const check=(value,message)=>{if(!value)throw Error(message);checks.push(message)};
    check(STAGES.length===7,'seven typed generation stages');
    check(inspect(1).colonRole.includes('NO GLUING'),'colon remains open before pairing');
    check(inspect(5,'OPEN').topology.boundaryCount===1&&inspect(5,'OPEN').topology.construction.includes('NO EDGE'),'unpaired strip has one connected boundary and is not the open cylinder');
    check(inspect(5,'TORUS').topology.boundaryCount===0&&inspect(5,'TORUS').topology.orientable,'torus is closed and orientable');
    check(inspect(5,'MOBIUS').topology.boundaryCount===1&&!inspect(5,'MOBIUS').topology.orientable,'Mobius strip has one boundary and is non-orientable');
    check(inspect(5,'KLEIN').topology.boundaryCount===0&&!inspect(5,'KLEIN').topology.orientable,'Klein bottle is closed and non-orientable');
    check(inspect(6,'KLEIN').globalRetained&&inspect(6,'KLEIN').localChart.includes('ℍ²'),'local return retains the global topology witness and boundary-chart type');
    check(B_STATIONS.length===6,'B1-B6 companion ledger has six typed stations');
    check(inspectBridge('B1').station.surface==='TORUS'&&inspectBridge('B2').station.surface==='MOBIUS'&&inspectBridge('B4').station.surface==='KLEIN','B1 B2 and B4 remain distinct global surfaces');
    check(inspectBridge('B3').station.kind==='CUT_GLUE_INTERFACE'&&inspectBridge('B3').station.surface===null,'B3 seam is an interface and not a surface identity');
    check(inspectBridge('B5').station.q3Vertices===8&&inspectBridge('B5').station.q4Vertices===16&&inspectBridge('B5').station.q4Edges===32,'B5 preserves the exact Q3 to Q4 graph witness');
    check(inspectBridge('B5').station.notRootMetric&&inspectBridge('B5').rootMetricImported===false,'B5 Root Space does not import Root Shrinking');
    check(inspectBridge('B6').station.boundaryChart.includes('ℍ²')&&inspectBridge('B6').station.globalWitnessRetained,'B6 preserves global provenance and the boundary half-plane chart');
    check(SOURCE_BINDING.n===661&&SOURCE_BINDING.cubeAddress.join(',')==='0,5,5'&&SOURCE_BINDING.returnId==='PC1111:N0661','Primecube address point returns to the retained source record');
    return Object.freeze({status:'PASS_TYPED_POINT_LINE_GLUE_TOPOLOGY_RETURN',checkCount:checks.length,checks:Object.freeze(checks),newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([])});
  }
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function svgMarkup(reading){
    const {index,topology}=reading;
    const rail=STAGES.map((stage,i)=>`<g class="pltr-node ${i===index?'is-current':''}"><circle cx="${78+i*124}" cy="70" r="24"/><text x="${78+i*124}" y="77">${esc(stage.glyph)}</text><text class="sub" x="${78+i*124}" y="111">${esc(stage.id)}</text></g>${i<6?`<path class="pltr-rail" d="M102 ${70} H${178+i*124}"/>`:''}`).join('');
    let body='';
    if(index===0)body='<circle class="pltr-source" cx="450" cy="265" r="13"/><text class="caption" x="450" y="315">.  SOURCE_POINT</text>';
    if(index===1)body='<circle class="pltr-source" cx="345" cy="265" r="11"/><circle class="pltr-source" cx="555" cy="265" r="11"/><circle class="pltr-colon" cx="450" cy="248" r="7"/><circle class="pltr-colon" cx="450" cy="282" r="7"/><text class="caption" x="450" y="330">:  OPEN_TYPED_JOINT · NO GLUE</text>';
    if(index===2)body='<path class="pltr-line" d="M300 265 H600"/><circle class="pltr-source" cx="300" cy="265" r="11"/><circle class="pltr-source" cx="600" cy="265" r="11"/><text class="caption" x="450" y="330">I=[0,1] · TWO ENDPOINTS</text>';
    if(index===3)body='<rect class="pltr-strip" x="285" y="188" width="330" height="154"/><path class="pltr-chart" d="M330 304 C390 206 510 325 570 224"/><text class="caption" x="450" y="382">STRIP / LOCAL CHART · BOUNDARY HELD</text>';
    if(index===4)body=`<rect class="pltr-strip" x="285" y="188" width="330" height="154"/><path class="pltr-pair" d="M270 210 V320"/><path class="pltr-pair ${topology.orientable?'':'is-reversed'}" d="M630 210 V320"/><text class="caption" x="450" y="382">${esc(reading.pairings.join(' · '))}</text>`;
    if(index===5){
      const shape=topology.id==='TORUS'?'<ellipse class="pltr-shape" cx="450" cy="265" rx="145" ry="92"/><ellipse class="pltr-hole" cx="450" cy="265" rx="58" ry="32"/>':topology.id==='MOBIUS'?'<path class="pltr-shape" d="M290 282 C340 146 510 365 610 234 C560 375 386 146 290 282 Z"/>':topology.id==='KLEIN'?'<path class="pltr-shape" d="M410 340 C328 300 344 198 424 202 C474 204 485 163 451 148 C533 151 548 213 500 252 C462 285 510 351 590 316 C531 388 453 381 410 340 Z"/>':'<rect class="pltr-shape" x="300" y="195" width="300" height="140"/>';
      body=`${shape}<text class="caption" x="450" y="405">${esc(topology.id)} · ∂=${topology.boundaryCount} · ${topology.orientable?'ORIENTABLE':'NON-ORIENTABLE'}</text>`;
    }
    if(index===6)body=`<path class="pltr-global" d="M245 330 C285 170 465 170 505 330"/><path class="pltr-return" d="M510 265 H650"/><rect class="pltr-chart-box" x="650" y="205" width="150" height="120"/><path class="pltr-line" d="M675 265 H775"/><text class="caption" x="520" y="385">GLOBAL ${esc(topology.id)} RETAINED · ℝ² INTERIOR / ℍ² BOUNDARY</text>`;
    return `<defs><marker id="pltrArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker></defs>${rail}<g class="pltr-body">${body}</g>`;
  }
  function mount(doc=document){
    const host=doc.getElementById('point-line-glue-topology-return'),svg=doc.getElementById('pltrSvg');if(!host||!svg)return null;
    const proof=verify();let stageIndex=0,topologyMode='OPEN';
    const draw=()=>{const reading=inspect(stageIndex,topologyMode);svg.innerHTML=svgMarkup(reading);doc.getElementById('pltrStatus').textContent=`${reading.stage.id} · ${reading.topology.id}`;doc.getElementById('pltrColon').textContent=reading.colonRole;doc.getElementById('pltrPairing').textContent=reading.pairings.join(' · ');doc.getElementById('pltrSurface').textContent=`${reading.topology.id} · ∂=${reading.topology.boundaryCount} · ${reading.topology.orientable?'ORIENTABLE':'NON-ORIENTABLE'}`;host.querySelectorAll('[data-pltr-stage]').forEach(button=>button.setAttribute('aria-current',String(Number(button.dataset.pltrStage)===stageIndex)));host.querySelectorAll('[data-pltr-topology]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pltrTopology===topologyMode)));host.dataset.stage=reading.stage.id;host.dataset.topology=topologyMode;host.dataset.proof=proof.status;return reading};
    host.addEventListener('click',event=>{const stage=event.target.closest('[data-pltr-stage]')?.dataset.pltrStage,topology=event.target.closest('[data-pltr-topology]')?.dataset.pltrTopology;if(stage!==undefined)stageIndex=Number(stage);if(topology){topologyMode=topology;if(stageIndex<4)stageIndex=4}draw()});
    draw();return Object.freeze({draw,verify,get state(){return inspect(stageIndex,topologyMode)}});
  }
  return Object.freeze({IDENTITY,STAGES,PAIRINGS,SOURCE_BINDING,B_STATIONS,inspect,inspectBridge,verify,svgMarkup,mount});
});
