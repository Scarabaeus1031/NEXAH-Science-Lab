(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0PaperBoatReturnDut=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.2.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const STAGES=Object.freeze(['READY','CAPTURE_0','SELECT_PLATE','PSI_90','SAMPLE_DOUBLE_COVER','COMPARE_CHECKPOINTS','CLASSIFY_RETURN']);
  const CHECKPOINTS=Object.freeze([0,90,180,360,720]);
  const PLATES=Object.freeze(['ETHER','ZETA','BETA','EURO']);
  const BASELINE=Object.freeze({
    schema:'nexah.a0.d5-paper-boat-geometry/1',
    chordWidths:Object.freeze([1.158384,1.701302,1.28408]),
    areas:Object.freeze([0.828154,0.958367]),
    heights:Object.freeze([0.579192,0.64204]),
    angleSets:Object.freeze([Object.freeze([115.111772,115.111772,64.888228,64.888228]),Object.freeze([72,72,108,108])]),
    areaRatio:1.157233,
    pentagonCoverage:0.751384,
    sourceFingerprint:'A0-D5-PAPER-BOAT-R1'
  });
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const rounded=value=>Number(value.toFixed(6));

  function createState(input={}){
    const samplesPerTurn=clamp(Math.round(Number(input.samplesPerTurn)||18),6,48);
    return Object.freeze({
      stage:clamp(Math.round(Number(input.stage)||0),0,STAGES.length-1),
      plate:PLATES.includes(String(input.plate||'').toUpperCase())?String(input.plate).toUpperCase():'ETHER',
      samplesPerTurn,
      sampleIndex:clamp(Math.round(Number(input.sampleIndex)||0),0,2*samplesPerTurn),
      running:Boolean(input.running)
    });
  }

  function angleFor(state){
    const current=createState(state);
    if(current.stage===3)return 90;
    if(current.stage<4)return 0;
    if(current.stage>4)return 720;
    return rounded(current.sampleIndex*360/current.samplesPerTurn);
  }

  function project(angleDeg,baseline=BASELINE){
    const angle=Number(angleDeg)||0,radians=angle*Math.PI/180,signedScale=rounded(Math.cos(radians)),scale=rounded(Math.abs(signedScale));
    const turns=Math.floor((Math.max(0,angle)+1e-9)/360),sheet=turns%2?'B':'A';
    return Object.freeze({
      angleDeg:angle,
      signedScale,
      projectionScale:scale,
      projectedChordWidths:Object.freeze(baseline.chordWidths.map(value=>rounded(value*scale))),
      projectedAreas:Object.freeze(baseline.areas.map(value=>rounded(value*scale))),
      viewClass:scale<1e-6?'EDGE_ON':signedScale<0?'REVERSED':'FRONT',
      sheet,
      sameRecord:true,
      projectionRepeats:angle>0&&angle%360===0,
      exactDoubleCoverReturn:angle>0&&angle%720===0,
      invariant:Object.freeze({angleSets:baseline.angleSets,areaRatio:baseline.areaRatio,pentagonCoverage:baseline.pentagonCoverage,sourceFingerprint:baseline.sourceFingerprint})
    });
  }

  function inspect(state){
    const current=createState(state),angleDeg=angleFor(current),reading=project(angleDeg),totalSamples=2*current.samplesPerTurn;
    return Object.freeze({identity:IDENTITY,stage:STAGES[current.stage],stageIndex:current.stage,plate:current.plate,psiQuarterTurnDeg:90,samplesPerTurn:current.samplesPerTurn,totalSamples,sampleIndex:current.sampleIndex,angleDeg,reading,complete:current.stage===6});
  }

  function advance(state){
    const current=createState(state);
    if(current.stage<4)return createState({...current,stage:current.stage+1,running:false});
    if(current.stage===4&&current.sampleIndex<2*current.samplesPerTurn)return createState({...current,sampleIndex:current.sampleIndex+1});
    if(current.stage<6)return createState({...current,stage:current.stage+1,sampleIndex:2*current.samplesPerTurn,running:false});
    return current;
  }

  function selectPlate(state,plate){
    const next=String(plate||'').toUpperCase();
    if(!PLATES.includes(next))throw Error(`unknown DUT plate: ${plate}`);
    return createState({...createState(state),plate:next});
  }

  function setSamples(state,value){
    const current=createState(state),samplesPerTurn=clamp(Math.round(Number(value)||18),6,48),progress=current.sampleIndex/(2*current.samplesPerTurn);
    return createState({...current,samplesPerTurn,sampleIndex:Math.round(progress*2*samplesPerTurn)});
  }

  function classify(baseline=BASELINE){
    const rows=CHECKPOINTS.map(angle=>project(angle,baseline));
    return Object.freeze({
      geometry:Object.freeze({status:'PASS',class:'OBJECT_SPACE_INVARIANT',fields:Object.freeze(['angleSets','areaRatio','pentagonCoverage','sourceFingerprint'])}),
      projection:Object.freeze({status:'CHANGES_AS_DECLARED',class:'VIEW_DEPENDENT',fields:Object.freeze(['projectedChordWidths','projectedAreas','viewClass'])}),
      topology:Object.freeze({status:'PASS',class:'SAME_RECORD_DOUBLE_COVER',sameRecord:rows.every(row=>row.sameRecord),returnAt360:rows.find(row=>row.angleDeg===360).exactDoubleCoverReturn,returnAt720:rows.find(row=>row.angleDeg===720).exactDoubleCoverReturn}),
      rows:Object.freeze(rows)
    });
  }

  function buildReceipt(state,baseline=BASELINE,channelBinding=null){
    const current=createState(state);
    return Object.freeze({
      schema:'nexah.a0.paper-boat-return-dut-record/1',version:VERSION,identity:IDENTITY,
      classification:'SOURCE_BOUND_ENGINEERING_PLAYBACK',
      sequence:Object.freeze(['CAPTURE_D5_AT_0','SELECT_TRANSVERSAL_PLATE','COUPLE_PSI_90','SAMPLE_OS11_TWO_TURNS','COMPARE_0_90_180_360_720','CLASSIFY_GEOMETRY_PROJECTION_TOPOLOGY']),
      current:inspect(current),baseline,comparison:classify(baseline),
      channelBinding:channelBinding||Object.freeze({status:'HOLD_SOURCE',exact:false,reason:'ARCADE_RECORD_NOT_BOUND',schema:'nexah.a0.three-domain-channel-joint/1'}),
      contract:Object.freeze({object:'D5_PAPER_BOAT',sampling:'OS_11_DISPLAY_ROLE',turns:2,fullReturnDeg:720,projectionModel:'ORTHOGRAPHIC_X_SCALE_ABS_COS_THETA',recordPolicy:'ONE_SOURCE_RECORD_NO_DUPLICATE_ON_VIEW_CHANGE',channelJoint:'THREE_DISTINCT_DOMAIN_PORTS_X_FOUR_TRANSITION_CHANNELS',carrierMasks:'D5_PENTAGON_NE_D6_HEXAGON_NE_11X11_GRID_NE_7X11_ADDRESS'}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newCanonicalIdentity:false,newRelation:false,physicalValidation:false}),
      boundary:'This is a deterministic interface and projection-contract check. The 720-degree closure is a declared double-cover display rule, not an empirical proof of physical topology. The Arcade binding is read-only: Chemistry, Life and Physics remain distinct carriers; D5, D6, 11x11 and 7x11 remain non-identical. ETHER, ZETA, BETA and EURO remain Owner-candidate view labels.'
    });
  }

  function svgMarkup(state){
    const current=createState(state),reading=inspect(current),p=reading.reading,visualScale=Math.max(.035,p.projectionScale),angle=reading.angleDeg%360;
    const stageDots=STAGES.slice(1).map((label,index)=>`<g class="pbr-stage-dot ${current.stage>index?'done':''} ${current.stage===index+1?'active':''}"><circle cx="${74+index*90}" cy="32" r="12"/><text x="${74+index*90}" y="36">${index+1}</text></g>`).join('');
    return `${stageDots}<path class="pbr-pentagon-ghost" d="M300 86 432 182 382 337 218 337 168 182Z"/><g class="pbr-object" transform="translate(300 220) scale(${visualScale} 1) rotate(${angle}) translate(-300 -220)"><path class="pbr-pentagon" d="M300 86 432 182 382 337 218 337 168 182Z"/><polygon class="pbr-q1" points="233,135 367,135 407,220 193,220"/><polygon class="pbr-q2" points="193,220 407,220 383,313 217,313"/><path class="pbr-chords" d="M233 135H367M193 220H407M217 313H383"/><path class="pbr-cross" d="M300 88V335M193 220H407M367 135 217 313M233 135 383 313"/></g><path class="pbr-plate" d="M118 220H482"/><text class="pbr-plate-label" x="470" y="207" text-anchor="end">${current.plate} · ψ 90°</text><text class="pbr-angle" x="300" y="382">${reading.angleDeg.toFixed(0)}° · SHEET ${p.sheet} · ${p.viewClass}</text>`;
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('aePaperBoatReturnDut');if(!host)return null;
    const ids=['aePbrSvg','aePbrStatus','aePbrRun','aePbrNext','aePbrSample','aePbrReset','aePbrPlate','aePbrSamples','aePbrSamplesOut','aePbrStage','aePbrAngle','aePbrInvariant','aePbrProjection','aePbrTopology','aePbrTable','aePbrExport','aePbrChannelSvg','aePbrChannelStatus','aePbrChannelGeneration','aePbrChannelFingerprint','aePbrChannelReturn','aePbrChannelRefresh','aePbrChannelOpen','aePbrArcadeInline','aePbrArcadeFrame','aePbrArcadeClose'];
    const nodes=Object.fromEntries(ids.map(id=>[id,doc.getElementById(id)])),missing=ids.filter(id=>!nodes[id]);if(missing.length)throw Error(`Paper-Boat Return DUT mount missing: ${missing.join(', ')}`);
    const channelApi=win.A0ThreeDomainJointAdapter||null;
    let state=createState(),timer=null,latestChannelRecord=null,channelCapture=null,frozenChannelRecord=null,channelTransport=null;
    function channelComparison(){return channelApi?.compare?.(channelCapture,frozenChannelRecord)||Object.freeze({status:'HOLD_SOURCE',exact:false,reason:'ADAPTER_OR_SOURCE_REQUIRED'})}
    function channelReceipt(){
      const comparison=channelComparison(),record=frozenChannelRecord||latestChannelRecord;
      return Object.freeze({schema:'nexah.a0.paper-boat-three-domain-binding/1',status:comparison.status,exact:comparison.exact,generation:record?.generation??null,fingerprint:record?.fingerprint??null,comparison,coordinateMap:record?.coordinateMap??null,invariants:record?.invariants??null,policy:'CAPTURE_ON_STAGE_1_FREEZE_DURING_TWO_TURN_VIEW_NO_FEEDBACK'});
    }
    function stop(){if(timer){clearInterval(timer);timer=null}state=createState({...state,running:false})}
    function apply(next,previous){
      const zipper=win.A0AeZipperBoundaryController,loop=win.A0DgSamplingLoopController;
      if(next.stage===1&&previous.stage<1){zipper?.armPentagon?.();if(latestChannelRecord&&channelApi){channelCapture=channelApi.capture(latestChannelRecord);frozenChannelRecord=latestChannelRecord;}}
      if(next.stage===2&&previous.stage<2)zipper?.selectPlate?.(next.plate);
      if(next.stage===3&&previous.stage<3)zipper?.couple?.();
      if(next.stage===4&&previous.stage<4)loop?.setSamples?.(next.samplesPerTurn);
      if(next.stage===4&&next.sampleIndex!==previous.sampleIndex)loop?.step?.();
      if(typeof win.dispatchEvent==='function'&&typeof win.CustomEvent==='function')win.dispatchEvent(new win.CustomEvent('a0:paper-boat-return-step',{detail:inspect(next)}));
    }
    function checkpointRows(){return classify().rows.map(row=>`<tr data-return="${row.exactDoubleCoverReturn}"><th>${row.angleDeg}°</th><td>${row.projectedChordWidths.map(value=>value.toFixed(4)).join(' · ')}</td><td>${row.projectedAreas.map(value=>value.toFixed(4)).join(' · ')}</td><td>${row.sheet}</td><td>${row.angleDeg===360?'PROJECTION REPEAT · NOT RETURN':row.exactDoubleCoverReturn?'EXACT RETURN':'SAME RECORD'}</td></tr>`).join('')}
    function render(){
      const reading=inspect(state),result=classify(),p=reading.reading,channelRecord=frozenChannelRecord||latestChannelRecord,channelResult=channelComparison();host.dataset.stage=String(state.stage);host.dataset.complete=String(reading.complete);nodes.aePbrSvg.innerHTML=svgMarkup(state);nodes.aePbrStatus.textContent=`${reading.stage} · ${reading.angleDeg.toFixed(0)}° · ${state.plate} · ${reading.sampleIndex}/${reading.totalSamples}`;nodes.aePbrStage.textContent=`${state.stage}/6 · ${reading.stage}`;nodes.aePbrAngle.textContent=`${reading.angleDeg.toFixed(0)}° · SHEET ${p.sheet}`;nodes.aePbrInvariant.textContent=`${result.geometry.status} · A₂/A₁ ${BASELINE.areaRatio.toFixed(6)} · ANGLES HELD`;nodes.aePbrProjection.textContent=`${p.viewClass} · SCALE ${p.projectionScale.toFixed(4)} · SCREEN VALUES ${p.projectionScale===1?'REPEAT':'CHANGE'}`;nodes.aePbrTopology.textContent=p.exactDoubleCoverReturn?'PASS · 720° EXACT RETURN':p.angleDeg===360?'HOLD · 360° PROJECTION REPEAT / SHEET B':'SAME RECORD · RETURN OPEN';nodes.aePbrSamples.value=String(state.samplesPerTurn);nodes.aePbrSamplesOut.textContent=String(state.samplesPerTurn);nodes.aePbrPlate.value=state.plate;nodes.aePbrRun.textContent=state.running?'PAUSE 1→6':'RUN 1→6';nodes.aePbrRun.setAttribute('aria-pressed',String(state.running));nodes.aePbrTable.innerHTML=checkpointRows();nodes.aePbrChannelSvg.innerHTML=channelApi?.svgMarkup?.(channelRecord,reading.angleDeg)||'<text class="pbr-channel-wait" x="300" y="190">ADAPTER HOLD</text>';nodes.aePbrChannelStatus.textContent=!channelRecord?'HOLD · ARCADE SOURCE REQUESTED':channelCapture?`FROZEN · g${channelRecord.generation} · NO FEEDBACK`:`LIVE SOURCE READY · g${channelRecord.generation} · CAPTURE AT STEP 1`;nodes.aePbrChannelGeneration.textContent=channelRecord?`g${channelRecord.generation} · 3×4 LEDGER`:'g— · WAITING';nodes.aePbrChannelFingerprint.textContent=channelCapture?`${channelCapture.fingerprint.length} BYTE CANONICAL RECORD`:'NOT CAPTURED';nodes.aePbrChannelReturn.textContent=state.stage<6?(channelCapture?'OPEN · ROTATION ONLY':'HOLD · CAPTURE REQUIRED'):(channelResult.exact?'PASS · EXACT 3×4 RETURN':channelResult.status);win.A0PaperBoatReturnDutView=buildReceipt(state,BASELINE,channelReceipt());return reading;
    }
    function tick(){const previous=state,next=advance(state);state=createState({...next,running:state.running});apply(state,previous);render();if(state.stage===6)stop(),render()}
    function start(){stop();state=createState({...state,running:true});timer=setInterval(tick,160)}
    function setArcadeVisible(visible){
      const open=Boolean(visible);
      nodes.aePbrArcadeInline.hidden=!open;
      nodes.aePbrChannelOpen.setAttribute('aria-expanded',String(open));
      nodes.aePbrChannelOpen.textContent=open?'ARCADE AUSBLENDEN ↑':'ARCADE HIER EINBLENDEN ↓';
      if(open&&!nodes.aePbrArcadeFrame.getAttribute?.('src'))nodes.aePbrArcadeFrame.setAttribute('src',nodes.aePbrArcadeFrame.dataset.src);
      return open;
    }
    nodes.aePbrArcadeFrame.addEventListener('load',()=>{if(nodes.aePbrArcadeFrame.contentWindow)channelTransport?.attachSource?.(nodes.aePbrArcadeFrame.contentWindow);channelTransport?.request?.()});
    nodes.aePbrRun.addEventListener('click',()=>{state.running?stop():start();render()});nodes.aePbrNext.addEventListener('click',()=>{stop();tick()});nodes.aePbrSample.addEventListener('click',()=>{stop();if(state.stage<4){const previous=state;state=createState({...state,stage:4});apply(state,previous)}tick()});nodes.aePbrReset.addEventListener('click',()=>{stop();state=createState({plate:nodes.aePbrPlate.value,samplesPerTurn:nodes.aePbrSamples.value});channelCapture=null;frozenChannelRecord=null;win.A0AeZipperBoundaryController?.reset?.();channelTransport?.request?.();render()});nodes.aePbrPlate.addEventListener('change',()=>{state=selectPlate(state,nodes.aePbrPlate.value);if(state.stage>=2)win.A0AeZipperBoundaryController?.selectPlate?.(state.plate);render()});nodes.aePbrSamples.addEventListener('input',()=>{state=setSamples(state,nodes.aePbrSamples.value);win.A0DgSamplingLoopController?.setSamples?.(state.samplesPerTurn);render()});nodes.aePbrChannelRefresh.addEventListener('click',()=>channelTransport?.request?.());nodes.aePbrChannelOpen.addEventListener('click',()=>setArcadeVisible(nodes.aePbrArcadeInline.hidden));nodes.aePbrArcadeClose.addEventListener('click',()=>setArcadeVisible(false));nodes.aePbrExport.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(buildReceipt(state,BASELINE,channelReceipt()),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-paper-boat-return-dut-record.json';anchor.click();URL.revokeObjectURL(url)});
    if(channelApi?.createTransport)channelTransport=channelApi.createTransport(win,{role:'sink',onRecord(record){latestChannelRecord=record;if(state.stage===0&&!channelCapture)render();}});
    win.addEventListener?.('pagehide',()=>channelTransport?.close?.(),{once:true});
    render();return Object.freeze({render,next(){stop();tick();return inspect(state)},run(){start();return inspect(state)},reset(){stop();state=createState();channelCapture=null;frozenChannelRecord=null;return render()},selectPlate(value){state=selectPlate(state,value);return render()},setSamples(value){state=setSamples(state,value);return render()},showArcade(){return setArcadeVisible(true)},hideArcade(){return setArcadeVisible(false)},bindChannelRecord(record){latestChannelRecord=record;return render()},get state(){return state},get record(){return buildReceipt(state,BASELINE,channelReceipt())}});
  }

  return{VERSION,IDENTITY,STAGES,CHECKPOINTS,PLATES,BASELINE,createState,angleFor,project,inspect,advance,selectPlate,setSamples,classify,buildReceipt,svgMarkup,mount};
});
