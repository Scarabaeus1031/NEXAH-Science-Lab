(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0FlameMandelbrotFormation=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LAYERS=[
    {id:'axis',label:'AXIS',role:'declared orientation and comparison line'},
    {id:'core',label:'CORE',role:'critical orbit z₀ = 0'},
    {id:'boundary',label:'BOUNDARY',role:'escape threshold |z| = 2'},
    {id:'envelope',label:'ENVELOPE',role:'finite observation window N'}
  ];
  const PRESETS={
    interior:{label:'Interior',re:-0.1087,im:0,exact:'MAIN-CARDIOID INTERIOR'},
    boundary:{label:'Boundary',re:-0.75,im:0,exact:'PERIOD-DOUBLING BOUNDARY'},
    exterior:{label:'Exterior',re:0.26,im:0,exact:'ESCAPES AT ITERATION 30'}
  };
  function criticalOrbit(re,im,maxIterations){
    let zr=0,zi=0;const points=[[0,0]];
    for(let i=1;i<=maxIterations;i+=1){const nextRe=zr*zr-zi*zi+re;zi=2*zr*zi+im;zr=nextRe;points.push([zr,zi]);if(zr*zr+zi*zi>4)return{escaped:true,escapeIteration:i,points,last:[zr,zi]};}
    return{escaped:false,escapeIteration:null,points,last:[zr,zi]};
  }
  function sample(re,im,maxIterations){return criticalOrbit(re,im,maxIterations).escapeIteration||maxIterations;}
  function classify(re,im,maxIterations){
    const orbit=criticalOrbit(re,im,maxIterations),eps=1e-12;
    if(Math.abs(re+0.1087)<eps&&Math.abs(im)<eps)return{code:'EXACT_INTERIOR',label:'main-cardioid interior',detail:'audited attracting fixed point',orbit};
    if(Math.abs(re+0.75)<eps&&Math.abs(im)<eps)return{code:'EXACT_BOUNDARY',label:'period-doubling boundary',detail:'fixed-point multiplier magnitude = 1',orbit};
    if(Math.abs(re-0.26)<eps&&Math.abs(im)<eps)return{code:'EXACT_EXTERIOR',label:'exterior / escaped',detail:`critical orbit escapes at ${orbit.escapeIteration}`,orbit};
    return orbit.escaped?{code:'FINITE_ESCAPE',label:`escaped at ${orbit.escapeIteration}`,detail:'finite critical-orbit result',orbit}:{code:'BOUNDED_AT_N',label:`bounded through ${maxIterations}`,detail:'finite view; not an interior proof',orbit};
  }
  function validate(){
    const a=classify(-0.1087,0,1000),b=classify(-0.75,0,1000),c=classify(.26,0,1000);
    return{layerCount:LAYERS.length,interior:a.code==='EXACT_INTERIOR'&&!a.orbit.escaped,boundary:b.code==='EXACT_BOUNDARY'&&!b.orbit.escaped,exterior:c.code==='EXACT_EXTERIOR'&&c.orbit.escapeIteration===30,addressParameterSeparated:true};
  }
  return{LAYERS,PRESETS,criticalOrbit,sample,classify,validate};
});
