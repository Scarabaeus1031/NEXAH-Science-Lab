(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0IotaTumbleTLens=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const PERIOD=24;
  const IOTA_DEGREES=360/PERIOD;
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';

  function assertTick(tick){
    if(!Number.isInteger(tick)||tick<0||tick>PERIOD)throw new RangeError('tick must be an integer from 0 to 24');
    return tick;
  }

  function inspectTick(tick=0){
    assertTick(tick);
    const theta=tick*Math.PI*2/PERIOD;
    const radial=Object.freeze({x:Math.cos(theta),y:Math.sin(theta)});
    const tangent=Object.freeze({x:-Math.sin(theta),y:Math.cos(theta)});
    const cosine=Math.cos(theta);
    const tangentScalar=Math.abs(cosine)<1e-12?null:Math.tan(theta);
    return Object.freeze({
      tick,period:PERIOD,iotaDegrees:IOTA_DEGREES,thetaRadians:theta,
      thetaDegrees:tick*IOTA_DEGREES,radial,tangent,tangentScalar,
      tangentScalarStatus:tangentScalar===null?'UNDEFINED_AT_QUARTER_TURN':'FINITE',
      orangeTransitionEvents:tick,jointReturn:tick===PERIOD,
      sourceStatus:tick===0?'ORIGIN':tick===PERIOD?'EXACT_RETURN':'OPEN'
    });
  }

  function frameToState(frame){
    if(!frame||frame.schema!=='nexah.a0.iota-2-3-ring-frame/1')throw new TypeError('IOTA 2|3 ring frame required');
    return inspectTick(assertTick(frame.tick));
  }

  function point(cx,cy,r,angle){return{x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r}}

  function svgMarkup(state=inspectTick(0)){
    const cx=300,cy=235,r=152,angle=-Math.PI/2+state.thetaRadians;
    const tip=point(cx,cy,r,angle),tx=-Math.sin(angle),ty=Math.cos(angle),cap=48;
    const capA={x:tip.x-tx*cap,y:tip.y-ty*cap},capB={x:tip.x+tx*cap,y:tip.y+ty*cap};
    const ticks=Array.from({length:PERIOD},(_,i)=>{
      const a=-Math.PI/2+i*Math.PI*2/PERIOD,p1=point(cx,cy,r+9,a),p2=point(cx,cy,r+18,a);
      return `<path class="itt-tick${i<state.orangeTransitionEvents?' is-fired':''}" d="M${p1.x.toFixed(2)} ${p1.y.toFixed(2)}L${p2.x.toFixed(2)} ${p2.y.toFixed(2)}"/>`;
    }).join('');
    const sparks=Array.from({length:state.orangeTransitionEvents},(_,i)=>{
      const a=-Math.PI/2+i*Math.PI*2/PERIOD,p=point(cx,cy,r+28,a);
      return `<circle class="itt-spark" cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="3.4"/>`;
    }).join('');
    return `<g class="itt-wheel${state.jointReturn?' is-return':''}"><circle class="itt-ring" cx="${cx}" cy="${cy}" r="${r}"/>${ticks}${sparks}<path class="itt-axis" d="M${cx} ${cy}L${tip.x.toFixed(2)} ${tip.y.toFixed(2)}"/><path class="itt-cap" d="M${capA.x.toFixed(2)} ${capA.y.toFixed(2)}L${capB.x.toFixed(2)} ${capB.y.toFixed(2)}"/><circle class="itt-tip" cx="${tip.x.toFixed(2)}" cy="${tip.y.toFixed(2)}" r="7"/><circle class="itt-origin" cx="${cx}" cy="${cy}" r="13"/><text class="itt-glyph" x="${cx}" y="${cy+5}" text-anchor="middle">ι</text><text class="itt-label" x="${cx}" y="28" text-anchor="middle">T(θ) · RADIUS + UNIT TANGENT</text><text class="itt-angle" x="${cx}" y="455" text-anchor="middle">θ = ${state.thetaDegrees.toFixed(0)}° · ι = ${IOTA_DEGREES}° · SPARKS ${state.orangeTransitionEvents}/${PERIOD}</text></g>`;
  }

  function buildRecord(state=inspectTick(0)){
    return Object.freeze({
      schema:'nexah.a0.iota-tumble-t-lens/1',version:VERSION,identity:IDENTITY,
      classification:'BOUNDED_ENGINEERING_VIEW',status:'PASS',state,
      identityReuse:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','IOTA_2_3_BRIDGE_VIEW']),
      exact:Object.freeze({period:PERIOD,iotaDegrees:IOTA_DEGREES,model:'r(theta)=(cos theta,sin theta); t(theta)=(-sin theta,cos theta)',return:'T(2pi)=T(0)'}),
      displayRoles:Object.freeze({tumbleT:'RADIUS_PLUS_UNIT_TANGENT',orangeSpark:'COUNTED_TICK_TRANSITION',taoDao:'OWNER_MNEMONIC_ONLY'}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,physicalMechanism:false}),
      boundary:'The unit tangent and the 24-step return are exact. The scalar tan(theta) is undefined at quarter turns, while the unit tangent remains defined. Tumble, ratchet, Tao/Dao, sprout, splash and orange sparks are local display mnemonics, not a physical drive, energy claim or scientific finding.'
    });
  }

  function mount(doc,host){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    const section=doc.getElementById('iotaTumbleTLens');if(!section)return null;
    const svg=doc.getElementById('iotaTumbleTSvg'),tickOut=doc.getElementById('iotaTumbleTick'),thetaOut=doc.getElementById('iotaTumbleTheta'),tanOut=doc.getElementById('iotaTumbleTan'),sparkOut=doc.getElementById('iotaTumbleSparks'),statusOut=doc.getElementById('iotaTumbleStatus');
    let state=inspectTick(0);
    const render=()=>{if(svg)svg.innerHTML=svgMarkup(state);section.dataset.tick=String(state.tick);section.dataset.return=state.jointReturn?'true':'false';if(tickOut)tickOut.textContent=`${state.tick} / ${PERIOD}`;if(thetaOut)thetaOut.textContent=`${state.thetaDegrees.toFixed(0)}° · ι ${IOTA_DEGREES}°`;if(tanOut)tanOut.textContent=state.tangentScalar===null?'UNDEFINED · UNIT TANGENT OK':state.tangentScalar.toFixed(6);if(sparkOut)sparkOut.textContent=`${state.orangeTransitionEvents} / ${PERIOD} EVENTS`;if(statusOut)statusOut.textContent=state.sourceStatus;return state};
    const receive=event=>{try{state=frameToState(event.detail);render()}catch(error){section.dataset.error=error.message}};
    if(host&&typeof host.addEventListener==='function')host.addEventListener('a0-iota-2-3-ring-frame',receive);
    if(host&&host.A0Iota23BridgeController&&host.A0Iota23BridgeProbe){state=host.A0Iota23BridgeProbe.ringFrame(host.A0Iota23BridgeController.getState());state=frameToState(state)}
    const stepButton=doc.getElementById('iotaTumbleStep'),returnButton=doc.getElementById('iotaTumbleReturn'),exportButton=doc.getElementById('iotaTumbleExport');
    if(stepButton)stepButton.addEventListener('click',()=>host&&host.A0Iota23BridgeController&&host.A0Iota23BridgeController.step());
    if(returnButton)returnButton.addEventListener('click',()=>host&&host.A0Iota23BridgeController&&host.A0Iota23BridgeController.reset());
    if(exportButton)exportButton.addEventListener('click',()=>{const json=JSON.stringify(buildRecord(state),null,2);section.dataset.lastExport=json});
    render();return Object.freeze({getState:()=>state,receiveFrame(frame){state=frameToState(frame);return render()},record:()=>buildRecord(state)});
  }

  return{VERSION,PERIOD,IOTA_DEGREES,IDENTITY,assertTick,inspectTick,frameToState,svgMarkup,buildRecord,mount};
});
