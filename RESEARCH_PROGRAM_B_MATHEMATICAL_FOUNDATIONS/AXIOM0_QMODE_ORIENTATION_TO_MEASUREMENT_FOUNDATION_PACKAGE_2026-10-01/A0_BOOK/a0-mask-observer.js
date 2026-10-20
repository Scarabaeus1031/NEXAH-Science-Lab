(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-layered-pentagon-scene.js'):root.A0LayeredPentagonScene,node?require('./a0-pentagon-contract.js'):root.A0PentagonContract);
  if(node)module.exports=api;else root.A0MaskObserver=api;
})(typeof globalThis==='undefined'?this:globalThis,function(S,P){
  'use strict';
  const SCHEMA='a0.mask-observer/1',EPS=1e-8,STEPS=120;
  const clone=x=>JSON.parse(JSON.stringify(x));
  const DEFAULT={kind:'pentagon',dx:0,dy:0,angle:36,amplitude:.45,word:'LRRL',phase:0,fold:true};
  const keys=(a,b)=>Object.keys(a).sort().join('|')===Object.keys(b).sort().join('|');
  function config(c){
    if(!c||!keys(c,DEFAULT)||!['pentagon','square'].includes(c.kind)||!['LRRL','RLLR'].includes(c.word)||typeof c.fold!=='boolean')throw Error('invalid mask configuration');
    for(const [k,min,max]of [['dx',-.8,.8],['dy',-.8,.8],['angle',0,360],['amplitude',0,.6],['phase',0,360]])if(!Number.isFinite(c[k])||c[k]<min||c[k]>max)throw Error('invalid '+k);
    return clone(c);
  }
  const cross=(a,b)=>a[0]*b[1]-a[1]*b[0],sub=(a,b)=>a.map((x,i)=>x-b[i]);
  const distance=(a,b)=>Math.hypot(...sub(a,b));
  function unique(points){const out=[];for(const p of points)if(!out.some(q=>distance(p,q)<EPS))out.push(p.slice());return out;}
  function intersections(a,b){
    const points=[];let coincident=false;
    a.forEach((p,i)=>b.forEach((q,j)=>{
      const u=sub(a[(i+1)%a.length],p),v=sub(b[(j+1)%b.length],q),w=sub(q,p),d=cross(u,v);
      if(Math.abs(d)<EPS){
        if(Math.abs(cross(w,u))<EPS){
          const axis=Math.abs(u[0])>Math.abs(u[1])?0:1;
          const ra=[p[axis],a[(i+1)%a.length][axis]].sort((x,y)=>x-y),rb=[q[axis],b[(j+1)%b.length][axis]].sort((x,y)=>x-y);
          if(Math.min(ra[1],rb[1])-Math.max(ra[0],rb[0])>EPS)coincident=true;
        }return;
      }
      const t=cross(w,v)/d,s=cross(w,u)/d;
      if(t>=-EPS&&t<=1+EPS&&s>=-EPS&&s<=1+EPS)points.push(p.map((x,k)=>x+t*u[k]));
    }));
    return {points:unique(points),coincident};
  }
  function excursion(word,tick){
    if(!['LRRL','RLLR'].includes(word)||!Number.isInteger(tick)||tick<0||tick>STEPS)throw Error('invalid branch tick');
    const segment=Math.min(3,Math.floor(tick/30)),fraction=tick===STEPS?1:(tick%30)/30;
    const trace=[0];for(const c of word)trace.push(trace.at(-1)+(c==='L'?-1:1));
    return {segment,fraction,trace,value:trace[segment]+fraction*(trace[segment+1]-trace[segment]),phase:P.phase(word),complete:tick===STEPS};
  }
  function loopPoint(t){return [1.12*Math.sin(t),.43*Math.sin(2*t)];}
  function section(poly,y=0){
    const xs=[];
    for(let i=0;i<poly.length;i++){
      const p=poly[i],q=poly[(i+1)%poly.length];
      if(Math.abs(p[1]-y)<EPS)xs.push(p[0]);
      if((p[1]<y&&q[1]>y)||(p[1]>y&&q[1]<y))xs.push(p[0]+(q[0]-p[0])*(y-p[1])/(q[1]-p[1]));
    }
    if(!xs.length)return null;
    const lo=Math.min(...xs),hi=Math.max(...xs);return hi-lo>EPS?[lo,hi]:null;
  }
  function frame(input,tick){
    const c=config(input),e=excursion(c.word,tick),shift=[c.dx+c.amplitude*e.value,c.dy],angle=c.angle*Math.PI/180;
    const rotate=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a)];
    let a,b;
    if(c.kind==='pentagon'){
      const source=S.snapshot(c.phase);
      a=source.pentagons[0].points;b=source.pentagons[1].points.map(p=>rotate(p,(c.angle-36)*Math.PI/180));
    }else{a=[[-.8,-.8],[.8,-.8],[.8,.8],[-.8,.8]];b=a.map(p=>rotate(p,angle));}
    b=b.map(p=>p.map((v,i)=>v+shift[i]));
    const cuts=intersections(a,b),partition=S.partition(a,b),reverse=S.partition(b,a),overlap=partition.intersection,pivot=shift.map(v=>v/2);
    const left=S.clip(overlap,[pivot[0],-5],[pivot[0],5],true),right=S.clip(overlap,[pivot[0],-5],[pivot[0],5],false);
    const observer=[0,-3.5],screenY=-2.3,screenScale=(screenY-observer[1])/(0-observer[1]);
    const windows=[left,right].map((polygon,i)=>{const interval=section(polygon);return {id:i?'R':'L',polygon,interval,screenInterval:interval?interval.map(x=>x*screenScale):null,area:S.area(polygon)};});
    const count11=unique([...cuts.points,pivot]),count12=unique([...a,...cuts.points]);
    const v=tick/STEPS*b.length,index=Math.min(b.length-1,Math.floor(v)),f=tick===STEPS?1:v-index,probe=b[index].map((x,i)=>x+(b[(index+1)%b.length][i]-x)*f);
    function project(p){
      const t=(screenY-observer[1])/(p[1]-observer[1]),hit=[observer[0]+t*(p[0]-observer[0]),screenY];
      const gate=windows.find(w=>w.screenInterval&&hit[0]>=w.screenInterval[0]-EPS&&hit[0]<=w.screenInterval[1]+EPS);
      return {source:p.slice(),hit,admitted:!!gate,window:gate?.id??null};
    }
    return {config:c,tick,excursion:e,shift,pivot,a,b,cuts,overlap,windows,differences:{a:partition.outside,b:reverse.outside},
      counts:{edgeCrossings:cuts.points.length,crossingsPlusPivot:count11.length,referenceCornersPlusCrossings:count12.length,status:cuts.coincident?'HOLD_COINCIDENT_EDGES':'DISCRETE_POINTS'},
      count11,count12,probe,observer,screenY,projection:b.map(project),probeProjection:project(probe),
      fold:{visible:c.fold,zOrder:'TOP_DISPLAY_LAYER_OWNER_PLACEMENT',points:Array.from({length:121},(_,i)=>loopPoint(i*Math.PI/60).map((x,k)=>x+pivot[k]))},
      boundary:'Declared 2D projection gate. Apertures are overlap halves; their y=0 sections and B points use the same central projection onto the screen. No optical calibration, recovered historical fold, cube solid, shared Blue/Pink clock or cross-carrier inverse.'};
  }
  function create(){return {config:clone(DEFAULT),tick:0,history:[],anchor:null};}
  const observation=f=>({hit:f.probeProjection.hit,admitted:f.probeProjection.admitted,window:f.probeProjection.window,counts:f.counts});
  function validateCore(s){
    if(!s||!keys(s,{config:0,tick:0,history:0})||!Array.isArray(s.history)||s.history.length>128)throw Error('invalid source state');
    frame(s.config,s.tick);
    for(const h of s.history){if(!h||!keys(h,{config:0,tick:0,observation:0})||JSON.stringify(h.observation)!==JSON.stringify(observation(frame(h.config,h.tick))))throw Error('invalid observer history');}
  }
  function validate(s){
    if(!s||!keys(s,{config:0,tick:0,history:0,anchor:0}))throw Error('invalid mask state');
    validateCore({config:s.config,tick:s.tick,history:s.history});if(s.anchor!==null)validateCore(s.anchor);return s;
  }
  function apply(input,action,value){
    validate(input);const s=clone(input);
    if(action==='RESET')return create();
    if(action==='CAPTURE'){s.anchor=clone({config:s.config,tick:s.tick,history:s.history});return s;}
    if(action==='RETURN'){
      if(!s.anchor)throw Error('HOLD · zuerst Capture');
      return validate({...clone(s.anchor),anchor:clone(s.anchor)});
    }
    if(action==='SET'){if(!value||!Object.keys(value).length||Object.keys(value).some(k=>!Object.hasOwn(DEFAULT,k)))throw Error('unknown setting');s.config=config({...s.config,...value});s.tick=0;}
    else if(action==='TICK')s.tick=value;
    else if(action==='STEP'){if(s.tick===STEPS)throw Error('HOLD · Wortende erreicht');s.tick++;}
    else throw Error('unknown mask command');
    const f=frame(s.config,s.tick);s.history.push({config:clone(s.config),tick:s.tick,observation:observation(f)});s.history=s.history.slice(-128);return validate(s);
  }
  function record(s){validate(s);return {schema:SCHEMA,state:clone(s),derived:frame(s.config,s.tick),wholeMachineReturn:false,returnType:'SAVED_MASK_STATE_NOT_PHYSICAL_INVERSE'};}
  function verify(r){
    try{if(!r||!keys(r,{schema:0,state:0,derived:0,wholeMachineReturn:0,returnType:0})||r.schema!==SCHEMA)throw Error('schema');
      const expected=record(r.state);if(JSON.stringify(r)!==JSON.stringify(expected))throw Error('derived/state mismatch');
      return {status:'PASS',scope:'SELF_CONSISTENT_SAVED_STATE_NOT_HISTORY_AUTHENTICATION'};
    }catch(error){return {status:'INVALID',error:String(error.message||error)};}
  }
  return {SCHEMA,STEPS,DEFAULT,config,unique,intersections,excursion,loopPoint,section,frame,create,validate,apply,record,verify};
});
