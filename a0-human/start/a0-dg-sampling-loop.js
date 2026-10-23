(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0DgSamplingLoop=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.2.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const STAGES=Object.freeze(['EXCITATION','TRACE','WITNESS','RETURN']);
  const MAIN_PHASE_TO_STAGE=Object.freeze({BEFORE:0,STRIP:1,AFTER:2,RETURN:3});
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function createState(input={}){
    const samples=clamp(Math.round(Number(input.samples)||18),6,48);
    const bands=clamp(Math.round(Number(input.bands)||5),3,9);
    const index=((Math.round(Number(input.index)||0)%samples)+samples)%samples;
    return Object.freeze({samples,bands,index,running:Boolean(input.running),coupled:Boolean(input.coupled),mainPhase:String(input.mainPhase||'BEFORE').toUpperCase()});
  }

  function advance(state,amount=1){
    const current=createState(state);
    return createState({...current,index:current.index+Math.round(Number(amount)||1)});
  }

  function setSamples(state,samples){
    const current=createState(state),next=clamp(Math.round(Number(samples)||18),6,48);
    return createState({...current,samples:next,index:Math.round((current.index/current.samples)*next)});
  }

  function setBands(state,bands){return createState({...createState(state),bands})}

  function syncMain(state,record){
    const current=createState(state),mainPhase=String(record?.current?.phase||record?.phase||current.mainPhase).toUpperCase();
    const stageIndex=Object.hasOwn(MAIN_PHASE_TO_STAGE,mainPhase)?MAIN_PHASE_TO_STAGE[mainPhase]:0;
    return createState({...current,mainPhase,index:Math.round(stageIndex*current.samples/4),coupled:Boolean(record?.current?.coupled||record?.coupled)});
  }

  function inspect(state){
    const current=createState(state),progress=current.index/current.samples,stageIndex=Math.min(3,Math.floor(progress*4));
    const theta=2*Math.PI*progress,pairTheta=-theta,px=34*Math.cos(pairTheta),py=18*Math.sin(pairTheta);
    return Object.freeze({
      identity:IDENTITY,stage:STAGES[stageIndex],stageIndex,sample:`${current.index+1}/${current.samples}`,progress,
      wheelDeg:Number((progress*360).toFixed(3)),tracePoint:Object.freeze({x:Number((300+92*Math.sin(2*Math.PI*progress)).toFixed(3)),y:Number((72+456*progress).toFixed(3))}),
      wheelPoint:Object.freeze({x:Number((300+244*Math.sin(theta)).toFixed(3)),y:Number((300-268*Math.cos(theta)).toFixed(3))}),
      mutualPair:Object.freeze({center:Object.freeze({x:300,y:300}),whitePoint:Object.freeze({x:Number((300+px).toFixed(3)),y:Number((300+py).toFixed(3))}),ringPoint:Object.freeze({x:Number((300-px).toFixed(3)),y:Number((300-py).toFixed(3))}),ringRotationDeg:Number((-progress*360).toFixed(3)),geometry:'SYMMETRIC_TWO_BODY_DISPLAY_AROUND_SHARED_CENTER',sourceCue:'PLUTO_CHIRON_ARROKOTH_PATTERN_ONLY'}),
      samples:current.samples,bands:current.bands,coupled:current.coupled,mainPhase:current.mainPhase
    });
  }

  function inspectFinalPin(record){
    const compatible=Boolean(record&&record.schema==='nexah.a0.tl-final-pin-view/1'&&record.identity===IDENTITY&&record.input?.declaredParts?.[0]===2&&record.input?.declaredParts?.[1]===1);
    const accepted=Boolean(compatible&&record.pin?.decision==='PINNED_2_TO_1'&&record.state?.scanner?.screenRead==='OCCUPIED');
    return Object.freeze({compatible,accepted,status:accepted?'ACCEPTED':compatible?'HOLD':'WAITING',address:compatible?String(record.pin?.address||'q—'):'q—',sourcePhase:compatible?String(record.state?.phase||'open').toUpperCase():'NONE',roleMap:Object.freeze({upper:'TOWER / SHAFT VIEW',joint:'SHARED APERTURE',lower:'SHELL / UNDER-TOWER RETURN'}),changesLoopState:false,changesSamplingBasis:false});
  }

  function buildReceipt(state,finalPinRecord=null){
    return Object.freeze({
      schema:'nexah.a0.dg-sampling-loop-record/1',version:VERSION,identity:IDENTITY,
      classification:'SOURCE_BOUND_ENGINEERING_VIEW',current:inspect(state),
      contract:{cycle:STAGES,axes:{carrier:'CD / N-BAND CUT',counter:'D°G / S-TRACE'},sampling:'OS 11 / SAMPLING SPLIT',shells:2,sharedAperture:true,mutualPair:{geometry:'SYMMETRIC_TWO_BODY_DISPLAY_AROUND_SHARED_CENTER',members:['WHITE_BODY','RING_BODY'],center:'SHARED_APERTURE',astrophysics:false}},
      finalPinHandoff:inspectFinalPin(finalPinRecord),
      sources:[
        {id:'OS-11',role:'SAMPLING_SPLIT',status:'CANONICAL_REGISTER_LABEL'},
        {id:'ROSC-E07',role:'18_SECTOR_FOLD_CLOSURE',status:'BOUNDED_POSITIVE_GEOMETRY'},
        {id:'ATRIUM-L-SHELL',role:'OWNER_VISUAL_LAYER_CUE',status:'TITLE_ONLY_ASSOCIATION'},
        {id:'blue_pearl_with_chiron_singularity_cluster.glb',role:'PLUTO_CHIRON_ARROKOTH_PATTERN_CUE',status:'EXISTING_STATIC_GLB_VISUAL_REFERENCE'}
      ],
      authority:{researchRun:false,scientificEvidence:false,newCanonicalIdentity:false,newRelation:false,physicalValidation:false},
      boundary:'D°G, the paired shells, the S trace, n-bands and the white/ring mutual pair are a coupled display grammar. The Final Pin handoff can mark the shared aperture as accepted, but does not change the loop index, tooth count, sampling basis or clock. Mouse q addresses are not mapped to N teeth. The Pluto/Chiron/Arrokoth vocabulary is a visual pattern cue from an existing static GLB only, not astrophysics, orbital data or a physical model. OS 11 supplies the sampling role. The Atrium 0.429-to-Zeta-Line association remains title-only; no physical resonance or generator mechanism is asserted.'
    });
  }

  function svgMarkup(state,finalPinRecord=null){
    const current=createState(state),reading=inspect(current),pin=inspectFinalPin(finalPinRecord);
    const teeth=Array.from({length:current.samples},(_,i)=>{const a=2*Math.PI*i/current.samples,x1=300+231*Math.sin(a),y1=300-254*Math.cos(a),x2=300+246*Math.sin(a),y2=300-270*Math.cos(a);return `<path class="dg-tooth ${i===current.index?'active':''}" d="M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}"/>`}).join('');
    const bands=Array.from({length:current.bands},(_,i)=>`<ellipse class="dg-band" cx="300" cy="300" rx="${72+i*15}" ry="${8+i*6}"/>`).join('');
    return `<defs><filter id="dgGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="dgS" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffd64f"/><stop offset=".25" stop-color="#f653ad"/><stop offset=".55" stop-color="#54dff0"/><stop offset="1" stop-color="#5de6a8"/></linearGradient></defs>
      <ellipse class="dg-wheel" cx="300" cy="300" rx="246" ry="270"/>${teeth}
      <text class="dg-wheel-label" x="300" y="24">D°G · CONTINUOUS COUNTER-AXIS</text>
      <circle class="dg-shell dg-shell-top" cx="300" cy="190" r="110"/><circle class="dg-shell dg-shell-bottom" cx="300" cy="410" r="110"/>
      <path class="dg-axis dg-axis-counter" d="M300 45V555"/><path class="dg-axis dg-axis-cut" d="M55 300H545"/>
      <text class="dg-axis-name" x="312" y="60">D°G / S TRACE</text><text class="dg-axis-name" x="448" y="289">CD / n-BAND CUT</text>
      <g class="dg-bands">${bands}</g><text class="dg-band-label" x="300" y="344">n-BANDS · ${current.bands} DISPLAY LAYERS</text>
      <path class="dg-trace-shadow" d="M300 72C440 150 440 230 300 300C160 370 160 450 300 528"/><path class="dg-trace" d="M300 72C440 150 440 230 300 300C160 370 160 450 300 528"/>
      <ellipse class="dg-mutual-orbit" cx="300" cy="300" rx="34" ry="18"/><path class="dg-mutual-link" d="M${reading.mutualPair.whitePoint.x} ${reading.mutualPair.whitePoint.y}L${reading.mutualPair.ringPoint.x} ${reading.mutualPair.ringPoint.y}"/>
      <circle class="dg-final-pin ${pin.accepted?'accepted':'hold'}" cx="300" cy="300" r="17"/><path class="dg-final-pin-axis ${pin.accepted?'accepted':'hold'}" d="M300 168V432"/><circle class="dg-aperture" cx="300" cy="300" r="7"/><circle class="dg-white-body" cx="${reading.mutualPair.whitePoint.x}" cy="${reading.mutualPair.whitePoint.y}" r="9"/>
      <g class="dg-ring-body" transform="translate(${reading.mutualPair.ringPoint.x} ${reading.mutualPair.ringPoint.y}) rotate(${reading.mutualPair.ringRotationDeg})"><ellipse rx="15" ry="7"/><ellipse class="dg-ring-core" rx="5" ry="5"/></g>
      <text class="dg-pair-label" x="300" y="372">WHITE ↔ RING · SHARED CENTER · GEOMETRY ONLY</text><circle class="dg-trace-marker" cx="${reading.tracePoint.x}" cy="${reading.tracePoint.y}" r="8"/>
      <circle class="dg-wheel-marker" cx="${reading.wheelPoint.x}" cy="${reading.wheelPoint.y}" r="7"/>
      <g class="dg-cycle-labels"><text x="66" y="92">1 · EXCITATION</text><text x="430" y="92">2 · TRACE</text><text x="430" y="522">3 · WITNESS</text><text x="66" y="522">4 · RETURN</text></g>
      <text class="dg-final-pin-label" x="300" y="156">TOWER / SHAFT</text><text class="dg-final-pin-label lower" x="300" y="452">SHELL / UNDER-TOWER RETURN</text><text class="dg-final-pin-state ${pin.accepted?'accepted':'hold'}" x="300" y="326">FINAL PIN · ${pin.status} · ${pin.address}</text><text class="dg-stage" x="300" y="590">${reading.stage} · SAMPLE ${reading.sample}${current.coupled?' · COUPLED':''}</text>`;
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('aeDgSamplingLoop');if(!host)return null;
    const svg=doc.getElementById('aeDgLoopSvg'),status=doc.getElementById('aeDgLoopStatus'),sample=doc.getElementById('aeDgSample'),stage=doc.getElementById('aeDgStage'),finalPin=doc.getElementById('aeDgFinalPin'),play=doc.getElementById('aeDgPlay'),step=doc.getElementById('aeDgStep'),reset=doc.getElementById('aeDgReset'),samples=doc.getElementById('aeDgSamples'),samplesOut=doc.getElementById('aeDgSamplesOut'),bands=doc.getElementById('aeDgBands'),bandsOut=doc.getElementById('aeDgBandsOut'),exportButton=doc.getElementById('aeDgExport');
    const required={svg,status,sample,stage,finalPin,play,step,reset,samples,samplesOut,bands,bandsOut,exportButton};const missing=Object.entries(required).filter(([,node])=>!node).map(([key])=>key);if(missing.length)throw Error(`D°G loop mount missing: ${missing.join(', ')}`);
    let state=createState(),timer=null,finalPinRecord=win.A0TlFinalPinView||null;
    function render(){const reading=inspect(state),pin=inspectFinalPin(finalPinRecord);host.dataset.stage=reading.stage.toLowerCase();host.dataset.coupled=String(reading.coupled);host.dataset.finalPin=pin.status.toLowerCase();svg.innerHTML=svgMarkup(state,finalPinRecord);status.textContent=`${reading.stage} · ${reading.sample} · ${reading.coupled?'ZIPPER COUPLED':'LOCAL VIEW'}`;sample.textContent=`${reading.sample} · ${reading.wheelDeg}°`;stage.textContent=`${reading.mainPhase} → ${reading.stage}`;finalPin.textContent=`${pin.status} · ${pin.address} · ${pin.accepted?'TOWER → APERTURE → SHELL':'NO LOOP CHANGE'}`;samples.value=String(state.samples);samplesOut.textContent=String(state.samples);bands.value=String(state.bands);bandsOut.textContent=String(state.bands);play.textContent=state.running?'PAUSE LOOP':'PLAY LOOP';play.setAttribute('aria-pressed',String(state.running));win.A0DgSamplingLoopView=buildReceipt(state,finalPinRecord);if(win.dispatchEvent&&win.CustomEvent)win.dispatchEvent(new win.CustomEvent('a0:dg-sampling-loop',{detail:win.A0DgSamplingLoopView}));return reading}
    function stop(){if(timer){clearInterval(timer);timer=null}state=createState({...state,running:false})}
    function start(){stop();state=createState({...state,running:true});timer=setInterval(()=>{state=advance(state);render()},180)}
    function syncFromMain(){const record=win.A0AeZipperBoundaryController?.record;if(record)state=syncMain(state,record);render()}
    play.addEventListener('click',()=>{state.running?stop():start();render()});step.addEventListener('click',()=>{stop();state=advance(state);render()});reset.addEventListener('click',()=>{stop();state=createState();render()});samples.addEventListener('input',()=>{state=setSamples(state,samples.value);render()});bands.addEventListener('input',()=>{state=setBands(state,bands.value);render()});
    ['aePentagonPrecut','aeZipperStep','aeZipperRotate','aeZipperToggle','aeAddressAperture','aeZipperCouple','aeZipperReset'].forEach(id=>doc.getElementById(id)?.addEventListener('click',()=>setTimeout(syncFromMain,0)));
    win.addEventListener?.('a0:tl-final-pin',event=>{finalPinRecord=event.detail;render()});
    exportButton.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(buildReceipt(state,finalPinRecord),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-dg-sampling-loop-record.json';anchor.click();URL.revokeObjectURL(url)});
    render();return Object.freeze({render,step(){stop();state=advance(state);return render()},sync(record){stop();state=syncMain(state,record);return render()},bindFinalPin(record){finalPinRecord=record;return render()},setSamples(value){state=setSamples(state,value);return render()},setBands(value){state=setBands(state,value);return render()},get state(){return state},get record(){return buildReceipt(state,finalPinRecord)}});
  }

  return{VERSION,IDENTITY,STAGES,MAIN_PHASE_TO_STAGE,createState,advance,setSamples,setBands,syncMain,inspect,inspectFinalPin,buildReceipt,svgMarkup,mount};
});
