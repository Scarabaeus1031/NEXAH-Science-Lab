(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0NewtonGoetheObserverLens=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='A0_NEWTON_GOETHE_OBSERVER_LENS_V1';
  const BANDS=[
    {name:'red',wavelength:650},{name:'orange',wavelength:600},{name:'yellow',wavelength:575},
    {name:'green',wavelength:530},{name:'cyan',wavelength:490},{name:'blue',wavelength:455},{name:'violet',wavelength:420}
  ];
  const REFERENCE_WAVELENGTH_NM=530;
  const EDGE_PRESETS=Object.freeze([5,7,14]);
  const OVERLAYS=Object.freeze({none:Object.freeze({id:'none',families:0,sectors:0,offsetDegrees:0,label:'NO OVERLAY'}),p5:Object.freeze({id:'p5',families:1,sectors:5,offsetDegrees:0,label:'P5 · 5 × 72°'}),h6x2:Object.freeze({id:'h6x2',families:2,sectors:6,offsetDegrees:30,label:'H6×2 · 2 × 6 / 30° OFFSET'})});
  const OBSERVER_FRAME=Object.freeze({id:'Q_DEGREE_4_PLUS_1',center:'Q°',peripheralPoints:4,totalPoints:5,axisStepDegrees:90,coneHalfAngleDegrees:22.5,labels:Object.freeze(['π VIEW','φ APERTURE','√2 DRIFT','√7 DRAFT']),role:'FINITE_OBSERVER_DISPLAY_FRAME'});
  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function relation(edgeAngle=7,phase=.18,observerAngle=42,overlay='none'){
    if(!Number.isFinite(edgeAngle)||!Number.isFinite(phase)||!Number.isFinite(observerAngle))throw new TypeError('finite edge angle, phase and observer angle required');
    const alpha=clamp(edgeAngle,0,90),beta=clamp(observerAngle,-90,90),edgeNormalized=alpha/90,observerNormalized=Math.abs(beta)/90,overlayRecord=OVERLAYS[overlay]||OVERLAYS.none;
    return{angle:alpha,edgeAngle:alpha,edgeAngleRadians:alpha*Math.PI/180,observerAngle:beta,observerSide:beta<0?'left':'right',phase,referenceWavelengthNm:REFERENCE_WAVELENGTH_NM,typedCoordinate:Object.freeze({wavelengthNm:REFERENCE_WAVELENGTH_NM,edgeAngleDegrees:alpha,observerAngleDegrees:beta}),bandCount:BANDS.length,moireFrequency:6+edgeNormalized*10,edgeGain:.35+.65*Math.sin(observerNormalized*Math.PI/2),observerOffset:beta/90,observerFrame:OBSERVER_FRAME,overlay:overlayRecord};
  }
  function sample(x,y,edgeAngle=7,phase=.18,observerAngle=42,overlay='none'){const state=relation(edgeAngle,phase,observerAngle,overlay),base=state.edgeAngleRadians,a=Math.sin((x*Math.cos(base+phase)+y*Math.sin(base+phase))*state.moireFrequency),b=Math.sin((x*Math.cos(base-phase)+y*Math.sin(base-phase))*state.moireFrequency+phase*Math.PI*2);return{a,b,residual:Math.abs(a-b),signed:a-b}}
  return{SCHEMA,BANDS,REFERENCE_WAVELENGTH_NM,EDGE_PRESETS,OVERLAYS,OBSERVER_FRAME,relation,sample};
});
