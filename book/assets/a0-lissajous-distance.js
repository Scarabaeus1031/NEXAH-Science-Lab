(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0LissajousDistance=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  function validate(a,b,phase){if(![a,b,phase].every(Number.isFinite)||a<=0||b<=0)throw new TypeError('Positive finite frequencies and finite phase required');}
  function speeds(t,a,b,phase){const d=[a*Math.cos(a*t),b*Math.cos(b*t+phase),Math.cos(t+phase/2)];return[Math.hypot(d[0],d[1]),Math.hypot(d[1],d[2]),Math.hypot(d[2],d[0])];}
  function integrate(a,b,phase,from,to){
    validate(a,b,phase);if(![from,to].every(Number.isFinite)||to<from)throw new RangeError('Finite ordered time interval required');
    if(to===from)return[0,0,0];
    const steps=Math.max(2,2*Math.ceil((to-from)*Math.max(1,a,b)/.004)),h=(to-from)/steps,sum=[0,0,0];
    for(let i=0;i<=steps;i++){const v=speeds(from+i*h,a,b,phase),weight=i===0||i===steps?1:i%2?4:2;for(let k=0;k<3;k++)sum[k]+=weight*v[k];}
    return sum.map(value=>value*h/3);
  }
  function createMeter(a,b,phase){
    validate(a,b,phase);let params=[a,b,phase],start=0,time=0,lengths=[0,0,0];
    function reset(at=time){if(!Number.isFinite(at))throw new TypeError('Finite starting time required');start=time=at;lengths=[0,0,0];}
    return{
      configure(nextA,nextB,nextPhase,at=time){validate(nextA,nextB,nextPhase);if(params.every((value,index)=>value===[nextA,nextB,nextPhase][index]))return false;params=[nextA,nextB,nextPhase];reset(at);return true;},
      reset,
      advance(dt){if(!Number.isFinite(dt)||dt<0)throw new RangeError('Finite nonnegative time increment required');const next=time+dt,step=integrate(...params,time,next);lengths=lengths.map((value,index)=>value+step[index]);time=next;},
      get time(){return time;},
      get snapshot(){return{AM:lengths[0],VM:lengths[1],PM:lengths[2],sum:lengths.reduce((sum,value)=>sum+value,0),elapsed:time-start,turns:(time-start)/(2*Math.PI),unit:'signal-coordinate units',method:'Composite Simpson integration of analytic projection speeds',parameters:{a:params[0],b:params[1],phaseRadians:params[2]}};}
    };
  }
  return{speeds,integrate,createMeter};
});
