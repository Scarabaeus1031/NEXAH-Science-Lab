(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0WeightedLissajousGreenBall=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='a0.weighted-lissajous-green-ball.v1';
  const SOURCE_CARRIER='THREE_SIGNAL_CARRIER';
  const VIEW_ID='WEIGHTED_GREEN_BALL_VIEW';
  const DEFAULT_WEIGHTS=Object.freeze([1,1,1]);
  function finite(value,label){if(!Number.isFinite(value))throw new TypeError(`${label} must be finite`);return value;}
  function normalizeWeights(weights=DEFAULT_WEIGHTS){
    if(!Array.isArray(weights)||weights.length!==3)throw new TypeError('weights must contain exactly three values');
    const clean=weights.map((value,index)=>{finite(value,`weight ${index+1}`);if(value<0)throw new RangeError('weights must be non-negative');return value;});
    const sum=clean.reduce((total,value)=>total+value,0);
    if(sum<=0)throw new RangeError('at least one weight must be positive');
    return clean.map(value=>value/sum);
  }
  function signals(time,a=3,b=2,phase=Math.PI/2){
    finite(time,'time');finite(a,'frequency a');finite(b,'frequency b');finite(phase,'phase');
    return [Math.sin(a*time),Math.sin(b*time+phase),Math.sin(time+phase/2)];
  }
  function derivatives(time,a=3,b=2,phase=Math.PI/2){
    finite(time,'time');finite(a,'frequency a');finite(b,'frequency b');finite(phase,'phase');
    return [a*Math.cos(a*time),b*Math.cos(b*time+phase),Math.cos(time+phase/2)];
  }
  function sample(time,a=3,b=2,phase=Math.PI/2,weights=DEFAULT_WEIGHTS){
    const normalizedWeights=normalizeWeights(weights),rawSignals=signals(time,a,b,phase),rawDerivatives=derivatives(time,a,b,phase),axisGains=normalizedWeights.map(value=>value*3);
    const vertical=normalizedWeights.reduce((total,value,index)=>total+value*rawSignals[index],0);
    const verticalGradient=normalizedWeights.reduce((total,value,index)=>total+value*rawDerivatives[index],0);
    return {
      schema:SCHEMA,
      id:VIEW_ID,
      status:'BOUND_DISPLAY_WEIGHT_VIEW',
      sourceCarrier:SOURCE_CARRIER,
      weights:weights.slice(),
      normalizedWeights,
      axisGains,
      signals:rawSignals,
      derivatives:rawDerivatives,
      position:rawSignals.map((value,index)=>value*axisGains[index]),
      vertical,
      verticalGradient,
      direction:verticalGradient>1e-9?'UP':verticalGradient<-1e-9?'DOWN':'HOLD',
      boundary:'DISPLAY_WEIGHTS_NOT_MASS_PROBABILITY_PRESSURE_OR_BOLTZMANN_CONSTANT; GREEN_BALL_IS_NOT_CARO_GREEN_MIRROR_BALL'
    };
  }
  function project(reading,pair){
    if(!reading||!Array.isArray(reading.position)||reading.position.length!==3)throw new TypeError('reading must contain a three-axis position');
    if(!Array.isArray(pair)||pair.length!==2||pair.some(index=>!Number.isInteger(index)||index<0||index>2))throw new TypeError('pair must contain two axis indexes');
    return [reading.position[pair[0]],reading.position[pair[1]]];
  }
  return {SCHEMA,SOURCE_CARRIER,VIEW_ID,DEFAULT_WEIGHTS,normalizeWeights,signals,derivatives,sample,project};
});
