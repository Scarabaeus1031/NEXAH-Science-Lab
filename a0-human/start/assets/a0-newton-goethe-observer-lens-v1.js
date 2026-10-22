(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0NewtonGoetheObserverLens=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='A0_NEWTON_GOETHE_OBSERVER_LENS_V1';
  const BANDS=[
    {name:'red',wavelength:650},{name:'orange',wavelength:600},{name:'yellow',wavelength:575},
    {name:'green',wavelength:530},{name:'cyan',wavelength:490},{name:'blue',wavelength:455},{name:'violet',wavelength:420}
  ];
  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function relation(angle=42,phase=.18){if(!Number.isFinite(angle)||!Number.isFinite(phase))throw new TypeError('finite angle and phase required');const normalized=clamp(angle,0,90)/90;return{angle:clamp(angle,0,90),phase,bandCount:BANDS.length,moireFrequency:6+normalized*10,edgeGain:.35+.65*Math.sin(normalized*Math.PI/2),observerOffset:normalized*2-1}}
  function sample(x,y,angle=42,phase=.18){const state=relation(angle,phase),a=Math.sin((x*Math.cos(phase)+y*Math.sin(phase))*state.moireFrequency),b=Math.sin((x*Math.cos(-phase)-y*Math.sin(-phase))*state.moireFrequency+phase*Math.PI*2);return{a,b,residual:Math.abs(a-b),signed:a-b}}
  return{SCHEMA,BANDS,relation,sample};
});
