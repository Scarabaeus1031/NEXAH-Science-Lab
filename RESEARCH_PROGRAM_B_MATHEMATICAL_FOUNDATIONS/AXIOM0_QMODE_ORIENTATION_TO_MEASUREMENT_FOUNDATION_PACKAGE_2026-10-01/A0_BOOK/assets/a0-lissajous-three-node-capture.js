(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0LissajousThreeNodeCapture=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='a0.lissajous-three-node-capture.v1',DEFAULT_THRESHOLD=.1,DEFAULT_SAMPLES=8192;
  function positive(value,label){if(!Number.isFinite(value)||value<=0)throw new TypeError(`${label} must be positive and finite`);return value;}
  function carrier(time,a=3,b=2,phase=Math.PI/2){if(![time,a,b,phase].every(Number.isFinite)||a<=0||b<=0)throw new TypeError('finite time, positive frequencies and finite phase required');return[Math.sin(a*time),Math.sin(b*time+phase),Math.sin(time+phase/2)];}
  function geometry(signals,threshold=DEFAULT_THRESHOLD){
    if(!Array.isArray(signals)||signals.length!==3||!signals.every(Number.isFinite))throw new TypeError('three finite signals required');positive(threshold,'threshold');
    const[s1,s2,s3]=signals,points=[[s1,s2],[s2,s3],[s3,s1]],mean=(s1+s2+s3)/3,centroid=[mean,mean],radii=points.map(point=>Math.hypot(point[0]-mean,point[1]-mean)),radius=Math.max(...radii),dispersion=(s1-s2)**2+(s2-s3)**2+(s3-s1)**2;
    return{schema:SCHEMA,signals:signals.slice(),points,centroid,radii,radius,diameter:radius*2,threshold,inside:radius<=threshold,dispersion,exactSeam:dispersion===0};
  }
  function reading(time,a=3,b=2,phase=Math.PI/2,threshold=DEFAULT_THRESHOLD){return{time,...geometry(carrier(time,a,b,phase),threshold)};}
  function scanLoop(a=3,b=2,phase=Math.PI/2,threshold=DEFAULT_THRESHOLD,samples=DEFAULT_SAMPLES){
    positive(a,'frequency a');positive(b,'frequency b');if(!Number.isFinite(phase))throw new TypeError('phase must be finite');positive(threshold,'threshold');if(!Number.isInteger(samples)||samples<256)throw new RangeError('samples must be an integer >= 256');
    const states=[],radii=[];let minimum={radius:Infinity,time:0};
    for(let index=0;index<samples;index+=1){const time=index/samples*Math.PI*2,value=reading(time,a,b,phase,threshold);states.push(value.inside);radii.push(value.radius);if(value.radius<minimum.radius)minimum={radius:value.radius,time};}
    const allInside=states.every(Boolean),entries=[];
    if(allInside)entries.push(0);else for(let index=0;index<samples;index+=1){const previous=states[(index-1+samples)%samples];if(!previous&&states[index])entries.push(index/samples*Math.PI*2);}
    return{schema:SCHEMA,parameters:{a,b,phase,threshold,samples},capturesPerLoop:entries.length,entryTimes:entries,insideFraction:states.filter(Boolean).length/samples,minimumRadius:minimum.radius,minimumTime:minimum.time,continuousCapture:allInside,method:'uniform periodic sampling of moving minimal centroid envelope; entry count uses outside-to-inside transitions'};
  }
  function createDetector(threshold=DEFAULT_THRESHOLD,hysteresis=1.15){
    positive(threshold,'threshold');if(!Number.isFinite(hysteresis)||hysteresis<1)throw new RangeError('hysteresis must be finite and >= 1');let inside=null,count=0,last=null;
    function reset(){inside=null;count=0;last=null;}
    function update(value){if(!value||!Number.isFinite(value.radius))throw new TypeError('capture reading required');if(inside===null)inside=value.radius<=threshold;else if(!inside&&value.radius<=threshold){inside=true;count+=1;}else if(inside&&value.radius>=threshold*hysteresis)inside=false;last=value;return snapshot();}
    function configure(nextThreshold){positive(nextThreshold,'threshold');threshold=nextThreshold;reset();}
    function snapshot(){return{schema:SCHEMA,threshold,hysteresis,inside:Boolean(inside),count,lastRadius:last?.radius??null,lastTime:last?.time??null,policy:'COUNT_OUTSIDE_TO_INSIDE_ONLY'};}
    return{update,reset,configure,get snapshot(){return snapshot();}};
  }
  return{SCHEMA,DEFAULT_THRESHOLD,DEFAULT_SAMPLES,carrier,geometry,reading,scanLoop,createDetector};
});
