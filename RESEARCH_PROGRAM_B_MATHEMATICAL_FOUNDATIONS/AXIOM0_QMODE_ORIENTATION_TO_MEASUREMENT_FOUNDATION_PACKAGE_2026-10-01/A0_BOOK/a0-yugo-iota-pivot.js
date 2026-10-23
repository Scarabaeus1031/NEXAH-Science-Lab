(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0YugoIotaPivot=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const LOCATORS=Object.freeze(['Y_FORK_TEETH','CENTER_SEAM','IOTA_PIVOT','YUGO_VECTOR']);
  const SOURCES=Object.freeze({
    iota:Object.freeze({revision:'v27',role:'EVENT_ESCAPE_STATE',file:'ieee_gate_detection_v27_iota_state_model.py'}),
    yugo:Object.freeze({revision:'v28',role:'NORMALIZED_LOCAL_FLOW_DIRECTION',file:'ieee_gate_detection_v28_yugo_flow_iota_coupling.py'}),
    warning:Object.freeze({revision:'v29',role:'PRE_IOTA_WARNING_NOT_CONTROL',file:'ieee_gate_detection_v29_yugo_iota_predictor.py'}),
    typing:Object.freeze({revision:'v30',role:'IOTA_EVENT_TYPING',file:'ieee_gate_detection_v30_iota_typing.py'}),
    overlay:Object.freeze({role:'PHASE_CONTROL_PLOT_WITH_IOTA_MARKERS',file:'run_yugo_control_overlay_local.py'}),
    zipper:Object.freeze({id:'MRB-09',role:'HISTORICAL_PRECURSOR_ONLY',identityClaim:false})
  });
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function normalizeAngle(value){
    const numeric=Number(value);
    if(!Number.isFinite(numeric))throw Error('YUGO angle must be finite');
    const wrapped=((numeric+180)%360+360)%360-180;
    if(wrapped===-180&&numeric>0)return 180;
    return Object.is(wrapped,-0)?0:wrapped;
  }

  function createState(input={}){
    const locator=LOCATORS.includes(input.locator)?input.locator:LOCATORS[0];
    return Object.freeze({
      angle:normalizeAngle(input.angle??0),
      locator,
      iota:Object.freeze({x:380,y:258,event:true,fixed:true}),
      history:Object.freeze(Array.isArray(input.history)?input.history.slice(-24):[])
    });
  }

  function rotate(state,delta){
    const current=createState(state),angle=normalizeAngle(current.angle+Number(delta||0));
    return createState({...current,angle,history:[...current.history,{action:'ROTATE_YUGO_DIRECTION',from:current.angle,to:angle,delta:Number(delta||0)}]});
  }

  function setAngle(state,angle){
    const current=createState(state),next=normalizeAngle(angle);
    return createState({...current,angle:next,history:[...current.history,{action:'SET_YUGO_DIRECTION',from:current.angle,to:next}]});
  }

  function locateNext(state){
    const current=createState(state),locator=LOCATORS[(LOCATORS.indexOf(current.locator)+1)%LOCATORS.length];
    return createState({...current,locator,history:[...current.history,{action:'LOCATE_STRUCTURE',locator}]});
  }

  function reset(){return createState()}

  function inspect(state){
    const current=createState(state),rad=current.angle*Math.PI/180;
    const vector=Object.freeze({x:Number(Math.cos(rad).toFixed(6)),y:Number(Math.sin(rad).toFixed(6))});
    return Object.freeze({
      identity:IDENTITY,
      angleDeg:current.angle,
      yugo:Object.freeze({role:SOURCES.yugo.role,vector,norm:Number(Math.hypot(vector.x,vector.y).toFixed(6)),rotatable:true}),
      iota:Object.freeze({...current.iota,role:SOURCES.iota.role,rotatable:false}),
      zipper:Object.freeze({role:'PAIRED_TOOTHED_BOUNDARY',locator:current.locator,centerSeamAloneIsZipper:false}),
      distinction:Object.freeze({iota:'EVENT_PIVOT',yugo:'LOCAL_FLOW_DIRECTION',zipper:'PAIRED_BOUNDARY',seam:'CENTER_LINE'})
    });
  }

  function buildReceipt(state){
    const current=createState(state);
    return Object.freeze({
      schema:'nexah.a0.yugo-iota-pivot-replay/1',version:VERSION,identity:IDENTITY,
      classification:'SOURCE_BOUND_ENGINEERING_REPLAY',sources:SOURCES,current:inspect(current),history:current.history,
      authority:{researchRun:false,scientificEvidence:false,newCanonicalIdentity:false,newRelation:false,hopfFiberClaim:false},
      boundary:'IOTA is held as a detected event/pivot. YUGO is replayed as a rotatable normalized local direction. The zipper is the paired toothed boundary; its center seam alone is not the zipper.'
    });
  }

  function teethMarkup(side){
    const left=side==='left',originX=left?88:672,joinX=380;
    return Array.from({length:13},(_,index)=>{
      const t=index/12,x=originX+(joinX-originX)*t,y=72+(258-72)*t,dx=left?18:-18,dy=left?-9:-9;
      return `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} l ${dx} ${dy} l ${left?-8:8} 20"/>`;
    }).join('');
  }

  function svgMarkup(state){
    const current=createState(state),reading=inspect(current),endX=current.iota.x+reading.yugo.vector.x*112,endY=current.iota.y-reading.yugo.vector.y*112;
    const selected=name=>current.locator===name?' selected':'';
    return `<defs><filter id="yiGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="yiArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#54dfef"/></marker></defs>
      <g class="yi-grid">${Array.from({length:15},(_,i)=>`<path d="M ${64+i*46} 36 V394"/>`).join('')}${Array.from({length:8},(_,i)=>`<path d="M64 ${44+i*48} H696"/>`).join('')}</g>
      <g class="yi-rail${selected('Y_FORK_TEETH')}"><path d="M88 72 Q235 122 380 258 Q525 122 672 72"/><g class="yi-teeth">${teethMarkup('left')}${teethMarkup('right')}</g></g>
      <g class="yi-seam${selected('CENTER_SEAM')}"><path d="M380 258 V386"/><path d="M362 294 H398 M362 326 H398 M362 358 H398"/></g>
      <g class="yi-pivot${selected('IOTA_PIVOT')}"><circle cx="380" cy="258" r="22"/><circle cx="380" cy="258" r="6"/><text x="380" y="296">IOTA · FIXED EVENT</text></g>
      <g class="yi-vector${selected('YUGO_VECTOR')}"><circle cx="380" cy="258" r="112"/><path d="M380 258 L${endX.toFixed(2)} ${endY.toFixed(2)}" marker-end="url(#yiArrow)"/><text x="${(endX+12).toFixed(2)}" y="${(endY-10).toFixed(2)}">YUGO ${current.angle}°</text></g>
      <text class="yi-label" x="86" y="55">PAIRED TOOTHED RAIL A</text><text class="yi-label" x="674" y="55" text-anchor="end">PAIRED TOOTHED RAIL B</text><text class="yi-label" x="392" y="382">CENTER SEAM</text>`;
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('aeYugoIotaPivotTest');if(!host)return null;
    const nodes={svg:doc.getElementById('aeYugoIotaSvg'),status:doc.getElementById('aeYugoIotaStatus'),angle:doc.getElementById('aeYugoAngle'),angleOut:doc.getElementById('aeYugoAngleOut'),back:doc.getElementById('aeYugoBack'),forward:doc.getElementById('aeYugoForward'),quarter:doc.getElementById('aeYugoQuarter'),locate:doc.getElementById('aeZipperLocate'),reset:doc.getElementById('aeYugoReset'),export:doc.getElementById('aeYugoExport'),iota:doc.getElementById('aeIotaReadout'),yugo:doc.getElementById('aeYugoReadout'),locator:doc.getElementById('aeZipperLocatorReadout')};
    const missing=Object.entries(nodes).filter(([,node])=>!node).map(([name])=>name);if(missing.length)throw Error(`YUGO/IOTA mount missing: ${missing.join(', ')}`);
    let state=createState();
    function render(){const reading=inspect(state),label=state.locator.replaceAll('_',' ');host.dataset.locator=state.locator.toLowerCase().replaceAll('_','-');nodes.svg.innerHTML=svgMarkup(state);nodes.status.textContent=`YUGO ${state.angle}° · LOCATE ${label}`;nodes.angle.value=String(state.angle);nodes.angleOut.textContent=`${state.angle}°`;nodes.iota.textContent='FIXED PIVOT · NOT ROTATED';nodes.yugo.textContent=`u=(${reading.yugo.vector.x.toFixed(3)}, ${reading.yugo.vector.y.toFixed(3)})`;nodes.locator.textContent=label;win.A0YugoIotaPivotView=buildReceipt(state);return reading}
    nodes.angle.addEventListener('input',event=>{state=setAngle(state,event&&event.target?event.target.value:nodes.angle.value);render()});
    nodes.back.addEventListener('click',()=>{state=rotate(state,-15);render()});nodes.forward.addEventListener('click',()=>{state=rotate(state,15);render()});nodes.quarter.addEventListener('click',()=>{state=rotate(state,90);render()});nodes.locate.addEventListener('click',()=>{state=locateNext(state);render()});nodes.reset.addEventListener('click',()=>{state=reset();render()});
    nodes.export.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(buildReceipt(state),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-yugo-iota-pivot-replay.json';anchor.click();URL.revokeObjectURL(url)});
    render();return Object.freeze({render,rotate(delta){state=rotate(state,delta);return render()},setAngle(angle){state=setAngle(state,angle);return render()},locateNext(){state=locateNext(state);return render()},reset(){state=reset();return render()},get state(){return state},get record(){return buildReceipt(state)}});
  }

  return{VERSION,IDENTITY,LOCATORS,SOURCES,normalizeAngle,createState,rotate,setAngle,locateNext,reset,inspect,buildReceipt,svgMarkup,mount};
});
