(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0TlFinalPin=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const RATIO=Object.freeze({upper:2,lower:1,total:3,normalized:Object.freeze([2/3,1/3])});
  const PHASES=Object.freeze(['open','aligned','pinned','returned']);
  const FORMAL_TL='10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/PASCAL_ROSETTA_JOINT_DESIGN_2026-10-11/FORMAL_CONTRACT.md#TL';
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function scannerSnapshot(value){
    if(value&&Number.isFinite(Number(value.q))&&(value.screenRead==='OCCUPIED'||value.screenRead==='GAP'))return Object.freeze({q:clamp(Math.round(Number(value.q)),1,17),screenRead:value.screenRead,cutLabel:String(value.cutLabel||'0° · ALONG')});
    const source=value&&value.identity===IDENTITY?value:null;
    const q=clamp(Math.round(Number(source?.mouse?.gridAddress??1)),1,17);
    const screenRead=source?.mouse?.screenRead==='GAP'?'GAP':'OCCUPIED';
    const cutLabel=String(source?.cut?.label||'0° · ALONG');
    return Object.freeze({q,screenRead,cutLabel});
  }
  function normalizeState(input={}){
    const phase=String(input.phase||'open');
    if(!PHASES.includes(phase))throw Error(`unknown Final Pin phase: ${phase}`);
    return Object.freeze({phase,scanner:scannerSnapshot(input.scanner)});
  }
  function buildRecord(input={}){
    const state=normalizeState(input),canPin=state.scanner.screenRead==='OCCUPIED',effectivePhase=state.phase==='pinned'&&!canPin?'open':state.phase;
    const decision=state.phase==='pinned'&&!canPin?'HOLD_GAP':effectivePhase==='pinned'?'PINNED_2_TO_1':effectivePhase.toUpperCase();
    return Object.freeze({schema:'nexah.a0.tl-final-pin-view/1',version:VERSION,identity:IDENTITY,ownerLabel:'TL · FINAL PIN',state:Object.freeze({...state,phase:effectivePhase}),input:Object.freeze({roles:Object.freeze(['g₂','g₁']),declaredParts:Object.freeze([2,1]),total:RATIO.total,normalized:RATIO.normalized,kind:'DECLARED_DISPLAY_WEIGHT'}),pin:Object.freeze({kind:'FINAL_PIN_VIEW',canPin,decision,address:`q${String(state.scanner.q).padStart(2,'0')}`,cut:state.scanner.cutLabel}),displayRoles:Object.freeze({upper:'TOWER / SHAFT VIEW',seam:'SPARK / JOINT',lower:'SHELL / UNDER-TOWER RETURN'}),ownerCue:Object.freeze({spark:'G / γ / y',words:Object.freeze(['GAY','GEIL','GAIA']),lasso:'ORANGE_SCRATCHES_HOLD_VISIBLE_8',exactArithmetic:Object.freeze({'8^2':64,'3^4':81}),marker83:'OWNER_MARKER_CANDIDATE',status:'WORD_GLYPH_FORM_ASSOCIATION_ONLY',source:'owner-described YouTube visual; URL/title not recorded'}),formalNameBoundary:Object.freeze({pascalTL:FORMAL_TL,identified:false,note:'Owner label TL Final Pin is not identified with the formal Pascal TL operator.'}),authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,physicalMixingLaw:false,externalImageCopied:false}),boundary:'The upper chamber is read as Tower/Shaft and the lower chamber as Shell/Under-Tower Return; these are display roles, not new carriers. The 2:1 split is a declared display weighting: 2/3 plus 1/3. The pin may close only on an occupied Mouse/Cut sample; a gap remains HOLD. Orange lasso scratches retain a visible figure-eight as a display effect. 8^2=64 and 3^4=81 are exact; .83 remains an owner marker candidate. G / gamma / y and GAY / GEIL / GAIA are owner word-glyph associations at the Spark, not equations. This owner-named TL view is not the formal Pascal TL operator, not the separate 1:2:1 projection fibre, and not a physical mixing law.'});
  }
  function svg(input={}){
    const record=buildRecord(input),phase=record.state.phase,active=phase==='pinned',hold=record.pin.decision==='HOLD_GAP';
    return `<defs><filter id="tlGlow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="tlRay" x1="0" x2="1"><stop stop-color="#fff200"/><stop offset="1" stop-color="#ff8a24"/></linearGradient></defs>
      <g class="tl-lasso"><path class="tl-eight" d="M500 205 C390 110 390 48 500 48 C610 48 610 110 500 205 C390 300 390 362 500 362 C610 362 610 300 500 205Z"/><path class="tl-scratch a" d="M305 205 A195 195 0 0 1 695 205"/><path class="tl-scratch b" d="M337 318 A190 190 0 0 1 663 92"/><path class="tl-scratch c" d="M337 92 A190 190 0 0 1 663 318"/></g><g class="tl-drum ${active?'is-pinned':''}"><ellipse cx="500" cy="105" rx="170" ry="46"/><path d="M330 105V205M670 105V205"/><ellipse cx="500" cy="205" rx="170" ry="46"/><path d="M330 205V315M670 205V315"/><ellipse cx="500" cy="315" rx="170" ry="46"/></g>
      <path class="tl-upper-ray" d="M65 132 L500 205"/><path class="tl-lower-ray" d="M65 336 L500 205"/>
      <g class="tl-pin ${active?'is-pinned':''}" filter="${active?'url(#tlGlow)':''}"><path class="tl-pin-white" d="M500 28V89"/><path class="tl-pin-core" d="M500 70V352"/><path class="tl-pin-dash" d="M500 118V294"/><ellipse cx="500" cy="105" rx="15" ry="7"/><ellipse cx="500" cy="205" rx="18" ry="9"/><ellipse cx="500" cy="315" rx="15" ry="7"/><circle cx="500" cy="205" r="7"/></g><g class="tl-spark ${active?'is-pinned':''}" transform="translate(500 205)"><path d="M0-20 5-6 20-10 9 1 21 10 6 7 0 23-5 7-21 11-9 1-20-9-5-6Z"/></g>
      <text class="tl-ratio upper" x="70" y="110">g₂ · 2 PARTS</text><text class="tl-ratio lower" x="70" y="370">g₁ · 1 PART</text><text class="tl-role tower" x="688" y="105" text-anchor="end">TOWER / SHAFT</text><text class="tl-role shell" x="688" y="310" text-anchor="end">SHELL / UNDER-TOWER RETURN</text>
      <text class="tl-title" x="500" y="388" text-anchor="middle">2 : 1 → FINAL PIN · ⅔ + ⅓ · SPARK G / γ / y</text>
      <text class="tl-state" x="720" y="42" text-anchor="end">${record.pin.address} · ${hold?'HOLD · GAP':phase.toUpperCase()}</text><text class="tl-powers" x="78" y="42">8²=64 · 3⁴=81 · .83 HOLD</text>`;
  }
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('tlFinalPin');if(!host)return null;
    const ids=['tlFinalPinSvg','tlFinalPinStatus','tlFinalPinInput','tlFinalPinShare','tlFinalPinSource','tlFinalPinAlign','tlFinalPinSet','tlFinalPinReturn','tlFinalPinExport'],nodes=Object.fromEntries(ids.map(id=>[id,doc.getElementById(id)])),missing=ids.filter(id=>!nodes[id]);
    if(missing.length)throw Error(`TL Final Pin mount incomplete: ${missing.join(', ')}`);
    let state=normalizeState({scanner:win.A0MouseCutScannerView}),record=buildRecord(state);
    function render(){record=buildRecord(state);state=record.state;host.dataset.phase=state.phase;host.dataset.read=state.scanner.screenRead.toLowerCase();nodes.tlFinalPinSvg.innerHTML=svg(state);nodes.tlFinalPinStatus.textContent=`${record.pin.address} · ${record.pin.decision.replaceAll('_',' ')}`;nodes.tlFinalPinInput.textContent=`g₂:g₁ = 2:1 · ${state.scanner.screenRead}`;nodes.tlFinalPinShare.textContent='⅔ + ⅓ = 1';nodes.tlFinalPinSource.textContent=`${state.scanner.cutLabel} · ${record.pin.address}`;nodes.tlFinalPinSet.disabled=!record.pin.canPin;win.A0TlFinalPinView=record;if(win.dispatchEvent&&win.CustomEvent)win.dispatchEvent(new win.CustomEvent('a0:tl-final-pin',{detail:record}));return record}
    function setState(next){state=normalizeState({...state,...next});return render()}
    nodes.tlFinalPinAlign.addEventListener('click',()=>setState({phase:'aligned'}));nodes.tlFinalPinSet.addEventListener('click',()=>setState({phase:'pinned'}));nodes.tlFinalPinReturn.addEventListener('click',()=>setState({phase:'returned'}));nodes.tlFinalPinExport.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-tl-final-pin-view.json';anchor.click();URL.revokeObjectURL(url)});
    if(win.addEventListener)win.addEventListener('a0:mouse-cut-scanner',event=>setState({phase:'open',scanner:event.detail}));
    render();return Object.freeze({render,setState,get state(){return state},get record(){return record}})
  }
  return{VERSION,IDENTITY,RATIO,PHASES,FORMAL_TL,scannerSnapshot,normalizeState,buildRecord,svg,mount};
});
