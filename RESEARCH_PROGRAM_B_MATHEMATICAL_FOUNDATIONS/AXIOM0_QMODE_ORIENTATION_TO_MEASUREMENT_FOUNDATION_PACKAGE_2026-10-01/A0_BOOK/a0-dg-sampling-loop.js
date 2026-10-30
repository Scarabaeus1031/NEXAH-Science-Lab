(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0DgSamplingLoop=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.4.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const STAGES=Object.freeze(['EXCITATION','TRACE','WITNESS','RETURN']);
  const MAIN_PHASE_TO_STAGE=Object.freeze({BEFORE:0,STRIP:1,AFTER:2,RETURN:3});
  const ANGLE_KEY=Object.freeze([
    Object.freeze({id:'alpha',glyph:'α',label:'Alpha',deg:90}),
    Object.freeze({id:'beta',glyph:'β',label:'Beta',deg:47.5}),
    Object.freeze({id:'gamma',glyph:'γ',label:'Gamma',deg:82}),
    Object.freeze({id:'delta',glyph:'δ',label:'Delta',deg:132.5}),
    Object.freeze({id:'phi',glyph:'φ',label:'Phi',deg:137.5}),
    Object.freeze({id:'inverse-alpha',glyph:'1/α',label:'1/Alpha',deg:137.036}),
    Object.freeze({id:'theta',glyph:'θ',label:'Theta',deg:45}),
    Object.freeze({id:'iota',glyph:'ι',label:'Iota',deg:50}),
    Object.freeze({id:'phantom',glyph:'P',label:'Phantomzinke',deg:130})
  ]);
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const normalizeDeg=value=>((Number(value)%360)+360)%360;
  const vmFlipDeg=value=>Number(normalizeDeg(180-Number(value)).toFixed(3));

  function angleReading(id='gamma',flipped=false){
    const source=ANGLE_KEY.find(entry=>entry.id===id)||ANGLE_KEY[2],vmDeg=vmFlipDeg(source.deg),activeDeg=flipped?vmDeg:source.deg;
    const rad=activeDeg*Math.PI/180,sourceRad=source.deg*Math.PI/180,vmRad=vmDeg*Math.PI/180;
    const point=angle=>Object.freeze({x:Number((300+220*Math.cos(angle)).toFixed(3)),y:Number((250-220*Math.sin(angle)).toFixed(3))});
    return Object.freeze({source,flipped:Boolean(flipped),activeDeg,vmDeg,sourcePoint:point(sourceRad),vmPoint:point(vmRad),activePoint:point(rad),vmRule:'VM(theta) = (180° - theta) mod 360',fixed:source.deg===vmDeg,exactPairs:Object.freeze({betaDelta:vmFlipDeg(47.5)===132.5,iotaPhantom:vmFlipDeg(50)===130,alphaFixed:vmFlipDeg(90)===90}),numberRegister:Object.freeze({visual252:'SOURCE_LABEL_ONLY',sequence250152:'DIGIT_SEQUENCE_ONLY',mod2501:'2501 = 41 × 61',fiftyTwo:'52 = 4 × 13',reverse52:'rev10(52) = 25',identity:false})});
  }

  function angleSvgMarkup(id='gamma',flipped=false){
    const r=angleReading(id,flipped),ticks=ANGLE_KEY.map(entry=>{const a=entry.deg*Math.PI/180,x1=300+204*Math.cos(a),y1=250-204*Math.sin(a),x2=300+220*Math.cos(a),y2=250-220*Math.sin(a);return `<path class="dg-angle-tick ${entry.id===r.source.id?'selected':''}" d="M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}"/><text class="dg-angle-tick-label" x="${(300+238*Math.cos(a)).toFixed(2)}" y="${(254-238*Math.sin(a)).toFixed(2)}">${entry.glyph} ${entry.deg}°</text>`}).join('');
    const teeth=Array.from({length:13},(_,i)=>{const t=i/12,x=r.sourcePoint.x+(r.vmPoint.x-r.sourcePoint.x)*t,y=r.sourcePoint.y+(r.vmPoint.y-r.sourcePoint.y)*t;return `<circle class="dg-angle-zip-tooth ${[0,4,8,12].includes(i)?'piercing':''} ${i===6?'pin':''}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${i===6?5:3}"/>`}).join('');
    return `<path class="dg-angle-arc" d="M80 250A220 220 0 0 1 520 250"/><path class="dg-angle-axis" d="M80 250H520M300 250V30"/>${ticks}<path class="dg-angle-source" d="M300 250L${r.sourcePoint.x} ${r.sourcePoint.y}"/><path class="dg-angle-vm" d="M300 250L${r.vmPoint.x} ${r.vmPoint.y}"/><path class="dg-angle-chord" d="M${r.sourcePoint.x} ${r.sourcePoint.y}L${r.vmPoint.x} ${r.vmPoint.y}"/>${teeth}<circle class="dg-angle-active" cx="${r.activePoint.x}" cy="${r.activePoint.y}" r="8"/><text class="dg-angle-title" x="300" y="286">${r.source.glyph} ${r.source.deg}° · VM ${r.vmDeg}°${r.fixed?' · FIXED AXIS':''}</text><text class="dg-angle-caption" x="300" y="310">13 ZIPPER NODES · 4 PIERCINGS · CENTER PIN 7/13</text>`;
  }

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
    const wheelX=300+244*Math.sin(theta),wheelY=300-268*Math.cos(theta);
    const gammaCutDeg=((Math.atan2(wheelY-300,wheelX-300)*180/Math.PI)+360)%360;
    const chordLeft=120,chordRight=480,chordY=300,chordStep=(chordRight-chordLeft)/12;
    const chordNodes=Object.freeze(Array.from({length:13},(_,i)=>Object.freeze({index:i+1,x:Number((chordLeft+i*chordStep).toFixed(3)),y:chordY,piercing:[0,4,8,12].includes(i),finalPin:i===6})));
    return Object.freeze({
      identity:IDENTITY,stage:STAGES[stageIndex],stageIndex,sample:`${current.index+1}/${current.samples}`,progress,
      wheelDeg:Number((progress*360).toFixed(3)),phaseCoordinates:Object.freeze({phiPhaseDeg:Number((progress*360).toFixed(3)),gammaCutDeg:Number(gammaCutDeg.toFixed(3)),phiRole:'ORBIT_SAMPLE_PHASE',gammaRole:'CENTER_TO_YELLOW_CUT_BEARING',goldenRatio:false,eulerTotient:false,lorentzFactor:false}),tracePoint:Object.freeze({x:Number((300+92*Math.sin(2*Math.PI*progress)).toFixed(3)),y:Number((72+456*progress).toFixed(3))}),
      wheelPoint:Object.freeze({x:Number(wheelX.toFixed(3)),y:Number(wheelY.toFixed(3))}),cutProjection:Object.freeze({forward:'YELLOW_TO_GREEN_FALL',reverse:'GREEN_TO_YELLOW_LIFT',projection:'VERTICAL_REVERSIBLE_VIEW',yellow:Object.freeze({x:Number(wheelX.toFixed(3)),y:Number(wheelY.toFixed(3))}),green:Object.freeze({x:Number(wheelX.toFixed(3)),y:chordY}),causalClaim:false}),
      chord13:Object.freeze({nodes:chordNodes,piercings:Object.freeze([1,5,9,13]),finalPinNode:7,viewGridCount:52,arithmetic:'13 × 4 = 52',sourceStatus:'CHOSEN_DISPLAY_ADDRESSING'}),
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
      contract:{cycle:STAGES,axes:{carrier:'CD / N-BAND CUT',counter:'D°G / S-TRACE'},coordinates:{phi:'ORBIT_SAMPLE_PHASE',gamma:'CENTER_TO_YELLOW_CUT_BEARING'},viewAddressing:{chordNodes:13,piercings:4,count:52,sourceStatus:'CHOSEN_DISPLAY_ADDRESSING'},sampling:'OS 11 / SAMPLING SPLIT',shells:2,sharedAperture:true,mutualPair:{geometry:'SYMMETRIC_TWO_BODY_DISPLAY_AROUND_SHARED_CENTER',members:['WHITE_BODY','RING_BODY'],center:'SHARED_APERTURE',astrophysics:false}},
      finalPinHandoff:inspectFinalPin(finalPinRecord),
      sources:[
        {id:'OS-11',role:'SAMPLING_SPLIT',status:'CANONICAL_REGISTER_LABEL'},
        {id:'ROSC-E07',role:'18_SECTOR_FOLD_CLOSURE',status:'BOUNDED_POSITIVE_GEOMETRY'},
        {id:'ATRIUM-L-SHELL',role:'OWNER_VISUAL_LAYER_CUE',status:'TITLE_ONLY_ASSOCIATION'},
        {id:'blue_pearl_with_chiron_singularity_cluster.glb',role:'PLUTO_CHIRON_ARROKOTH_PATTERN_CUE',status:'EXISTING_STATIC_GLB_VISUAL_REFERENCE'}
      ],
      authority:{researchRun:false,scientificEvidence:false,newCanonicalIdentity:false,newRelation:false,physicalValidation:false},
      boundary:'D°G, the paired shells, the S trace, n-bands and the white/ring mutual pair are a coupled display grammar. Phi_phase is only the sampled orbit phase; it is neither the golden ratio nor Euler totient. Gamma_cut is only the center-to-yellow display bearing; it is not a Lorentz factor, physical field or recovered source parameter. The same vertical line has two explicit view directions: yellow-to-green fall and green-to-yellow lift. Neither direction is a force or causal action. The 13-node chord with four selected piercings is chosen display addressing: 13 × 4 = 52 is exact arithmetic but not a source identity. The Final Pin handoff can mark the shared aperture as accepted, but does not change the loop index, tooth count, sampling basis or clock. Mouse q addresses are not mapped to N teeth. The Pluto/Chiron/Arrokoth vocabulary is a visual pattern cue from an existing static GLB only, not astrophysics, orbital data or a physical model. OS 11 supplies the sampling role. The Atrium 0.429-to-Zeta-Line association remains title-only; no physical resonance or generator mechanism is asserted.'
    });
  }

  function svgMarkup(state,finalPinRecord=null){
    const current=createState(state),reading=inspect(current),pin=inspectFinalPin(finalPinRecord);
    const teeth=Array.from({length:current.samples},(_,i)=>{const a=2*Math.PI*i/current.samples,x1=300+231*Math.sin(a),y1=300-254*Math.cos(a),x2=300+246*Math.sin(a),y2=300-270*Math.cos(a);return `<path class="dg-tooth ${i===current.index?'active':''}" d="M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}"/>`}).join('');
    const bands=Array.from({length:current.bands},(_,i)=>`<ellipse class="dg-band" cx="300" cy="300" rx="${72+i*15}" ry="${8+i*6}"/>`).join('');
    const chordNodes=reading.chord13.nodes.map(node=>`<circle class="dg-chord-node ${node.piercing?'piercing':''} ${node.finalPin?'final':''}" cx="${node.x}" cy="${node.y}" r="${node.piercing?4:2.4}"/>`).join('');
    return `<defs><filter id="dgGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="dgS" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffd64f"/><stop offset=".25" stop-color="#f653ad"/><stop offset=".55" stop-color="#54dff0"/><stop offset="1" stop-color="#5de6a8"/></linearGradient></defs>
      <ellipse class="dg-wheel" cx="300" cy="300" rx="246" ry="270"/>${teeth}
      <text class="dg-wheel-label" x="300" y="24">D°G · CONTINUOUS COUNTER-AXIS</text>
      <circle class="dg-shell dg-shell-top" cx="300" cy="190" r="110"/><circle class="dg-shell dg-shell-bottom" cx="300" cy="410" r="110"/>
      <path class="dg-axis dg-axis-counter" d="M300 45V555"/><path class="dg-axis dg-axis-cut" d="M55 300H545"/><path class="dg-fall-line" d="M${reading.cutProjection.yellow.x} ${reading.cutProjection.yellow.y}V300"/>
      <text class="dg-axis-name" x="312" y="60">D°G / S TRACE</text><text class="dg-axis-name" x="448" y="289">CD / n-BAND CUT</text>
      <g class="dg-bands">${bands}</g><g class="dg-chord-13">${chordNodes}</g><text class="dg-band-label" x="300" y="344">13 CHORD NODES · 4 PIERCINGS · 52 VIEW ADDRESSES</text>
      <path class="dg-trace-shadow" d="M300 72C440 150 440 230 300 300C160 370 160 450 300 528"/><path class="dg-trace" d="M300 72C440 150 440 230 300 300C160 370 160 450 300 528"/>
      <ellipse class="dg-mutual-orbit" cx="300" cy="300" rx="34" ry="18"/><path class="dg-mutual-link" d="M${reading.mutualPair.whitePoint.x} ${reading.mutualPair.whitePoint.y}L${reading.mutualPair.ringPoint.x} ${reading.mutualPair.ringPoint.y}"/>
      <circle class="dg-final-pin ${pin.accepted?'accepted':'hold'}" cx="300" cy="300" r="17"/><path class="dg-final-pin-axis ${pin.accepted?'accepted':'hold'}" d="M300 168V432"/><circle class="dg-aperture" cx="300" cy="300" r="7"/><circle class="dg-white-body" cx="${reading.mutualPair.whitePoint.x}" cy="${reading.mutualPair.whitePoint.y}" r="9"/>
      <g class="dg-ring-body" transform="translate(${reading.mutualPair.ringPoint.x} ${reading.mutualPair.ringPoint.y}) rotate(${reading.mutualPair.ringRotationDeg})"><ellipse rx="15" ry="7"/><ellipse class="dg-ring-core" rx="5" ry="5"/></g>
      <text class="dg-pair-label" x="300" y="372">WHITE ↔ RING · SHARED CENTER · GEOMETRY ONLY</text><circle class="dg-trace-marker" cx="${reading.tracePoint.x}" cy="${reading.tracePoint.y}" r="8"/>
      <circle class="dg-wheel-marker" cx="${reading.wheelPoint.x}" cy="${reading.wheelPoint.y}" r="7"/><circle class="dg-cut-marker" cx="${reading.cutProjection.green.x}" cy="${reading.cutProjection.green.y}" r="7"/>
      <g class="dg-cycle-labels"><text x="66" y="92">1 · EXCITATION</text><text x="430" y="92">2 · TRACE</text><text x="430" y="522">3 · WITNESS</text><text x="66" y="522">4 · RETURN</text></g>
      <text class="dg-coordinate-label" x="70" y="282">φ_PHASE ${reading.phaseCoordinates.phiPhaseDeg}°</text><text class="dg-coordinate-label gamma" x="430" y="320">γ_CUT ${reading.phaseCoordinates.gammaCutDeg}°</text>
      <text class="dg-final-pin-label" x="300" y="156">TOWER / SHAFT</text><text class="dg-final-pin-label lower" x="300" y="452">SHELL / UNDER-TOWER RETURN</text><text class="dg-final-pin-state ${pin.accepted?'accepted':'hold'}" x="300" y="326">FINAL PIN · NODE 7/13 · ${pin.status} · ${pin.address}</text><text class="dg-stage" x="300" y="590">${reading.stage} · SAMPLE ${reading.sample}${current.coupled?' · COUPLED':''}</text>`;
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('aeDgSamplingLoop');if(!host)return null;
    const svg=doc.getElementById('aeDgLoopSvg'),status=doc.getElementById('aeDgLoopStatus'),sample=doc.getElementById('aeDgSample'),stage=doc.getElementById('aeDgStage'),finalPin=doc.getElementById('aeDgFinalPin'),phiOut=doc.getElementById('aeDgPhi'),gammaOut=doc.getElementById('aeDgGamma'),angleSvg=doc.getElementById('aeDgAngleSvg'),angleSelect=doc.getElementById('aeDgAngleSelect'),angleReadout=doc.getElementById('aeDgAngleReadout'),angleFlip=doc.getElementById('aeDgAngleFlip'),play=doc.getElementById('aeDgPlay'),step=doc.getElementById('aeDgStep'),reset=doc.getElementById('aeDgReset'),samples=doc.getElementById('aeDgSamples'),samplesOut=doc.getElementById('aeDgSamplesOut'),bands=doc.getElementById('aeDgBands'),bandsOut=doc.getElementById('aeDgBandsOut'),exportButton=doc.getElementById('aeDgExport');
    const required={svg,status,sample,stage,finalPin,phiOut,gammaOut,angleSvg,angleSelect,angleReadout,angleFlip,play,step,reset,samples,samplesOut,bands,bandsOut,exportButton};const missing=Object.entries(required).filter(([,node])=>!node).map(([key])=>key);if(missing.length)throw Error(`D°G loop mount missing: ${missing.join(', ')}`);
    let state=createState(),timer=null,finalPinRecord=win.A0TlFinalPinView||null,angleId='gamma',angleFlipped=false;
    function render(){const reading=inspect(state),pin=inspectFinalPin(finalPinRecord),angle=angleReading(angleId,angleFlipped);host.dataset.stage=reading.stage.toLowerCase();host.dataset.coupled=String(reading.coupled);host.dataset.finalPin=pin.status.toLowerCase();svg.innerHTML=svgMarkup(state,finalPinRecord);angleSvg.innerHTML=angleSvgMarkup(angleId,angleFlipped);status.textContent=`${reading.stage} · ${reading.sample} · ${reading.coupled?'ZIPPER COUPLED':'LOCAL VIEW'}`;sample.textContent=`${reading.sample} · ${reading.wheelDeg}°`;stage.textContent=`${reading.mainPhase} → ${reading.stage}`;finalPin.textContent=`${pin.status} · ${pin.address} · ${pin.accepted?'TOWER → APERTURE → SHELL':'NO LOOP CHANGE'}`;phiOut.textContent=`φ_PHASE ${reading.phaseCoordinates.phiPhaseDeg}° · SAMPLE ORBIT`;gammaOut.textContent=`γ_CUT ${reading.phaseCoordinates.gammaCutDeg}° · YELLOW↓GREEN / GREEN↑YELLOW`;angleReadout.textContent=`${angle.source.glyph} ${angle.source.deg}° → VM ${angle.vmDeg}°${angle.fixed?' · FIXED':''}`;angleFlip.textContent=angleFlipped?'SHOW SOURCE SIDE':'SHOW VM SIDE';angleFlip.setAttribute('aria-pressed',String(angleFlipped));samples.value=String(state.samples);samplesOut.textContent=String(state.samples);bands.value=String(state.bands);bandsOut.textContent=String(state.bands);play.textContent=state.running?'PAUSE LOOP':'PLAY LOOP';play.setAttribute('aria-pressed',String(state.running));win.A0DgSamplingLoopView=buildReceipt(state,finalPinRecord);win.A0DgAngleKeyView=angle;if(win.dispatchEvent&&win.CustomEvent)win.dispatchEvent(new win.CustomEvent('a0:dg-sampling-loop',{detail:win.A0DgSamplingLoopView}));return reading}
    function stop(){if(timer){clearInterval(timer);timer=null}state=createState({...state,running:false})}
    function start(){stop();state=createState({...state,running:true});timer=setInterval(()=>{state=advance(state);render()},180)}
    function syncFromMain(){const record=win.A0AeZipperBoundaryController?.record;if(record)state=syncMain(state,record);render()}
    play.addEventListener('click',()=>{state.running?stop():start();render()});step.addEventListener('click',()=>{stop();state=advance(state);render()});reset.addEventListener('click',()=>{stop();state=createState();angleId='gamma';angleFlipped=false;angleSelect.value=angleId;render()});samples.addEventListener('input',()=>{state=setSamples(state,samples.value);render()});bands.addEventListener('input',()=>{state=setBands(state,bands.value);render()});angleSelect.addEventListener('change',()=>{angleId=angleSelect.value;angleFlipped=false;render()});angleFlip.addEventListener('click',()=>{angleFlipped=!angleFlipped;render()});
    ['aePentagonPrecut','aeZipperStep','aeZipperRotate','aeZipperToggle','aeAddressAperture','aeZipperCouple','aeZipperReset'].forEach(id=>doc.getElementById(id)?.addEventListener('click',()=>setTimeout(syncFromMain,0)));
    win.addEventListener?.('a0:tl-final-pin',event=>{finalPinRecord=event.detail;render()});
    exportButton.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(buildReceipt(state,finalPinRecord),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-dg-sampling-loop-record.json';anchor.click();URL.revokeObjectURL(url)});
    render();return Object.freeze({render,step(){stop();state=advance(state);return render()},sync(record){stop();state=syncMain(state,record);return render()},bindFinalPin(record){finalPinRecord=record;return render()},setSamples(value){state=setSamples(state,value);return render()},setBands(value){state=setBands(state,value);return render()},get state(){return state},get record(){return buildReceipt(state,finalPinRecord)}});
  }

  return{VERSION,IDENTITY,STAGES,MAIN_PHASE_TO_STAGE,ANGLE_KEY,normalizeDeg,vmFlipDeg,angleReading,angleSvgMarkup,createState,advance,setSamples,setBands,syncMain,inspect,inspectFinalPin,buildReceipt,svgMarkup,mount};
});
