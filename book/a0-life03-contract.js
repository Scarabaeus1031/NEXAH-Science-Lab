(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Life03Contract=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const PROTOCOL='nexah.a0.life03-source/1',SOURCE_HASH='3faceb0876d3bb13339a146a48f4c6c9ba92a1bad457d36fd40d2d8cb8876e9f',MODES=['dual','observer','projection'];
const CUES={SOURCE:['CAPTURE'],OPERATOR:['STEP'],EDGE:['STEP'],SHADOW:['VIEW','observer'],FAMILY:['STEP'],GRID:['VIEW','projection'],RETURN:['READ'],FOLD:['VIEW','dual'],ROOT:['STEP'],RECORD:['RETURN']};
const copy=x=>JSON.parse(JSON.stringify(x)),equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
function state(value){
 if(!value||JSON.stringify(value).length>1000000)throw Error('state payload absent / too large');
 const visit=(x,d=0)=>{if(d>20)throw Error('state depth');if(typeof x==='number'&&!Number.isFinite(x))throw Error('nonfinite record');if(x&&typeof x==='object'){for(const k of Object.keys(x)){if(['__proto__','prototype','constructor'].includes(k))throw Error('unsafe record key');visit(x[k],d+1);}}};visit(value);
 const s=copy(value),w=s.work;if(!MODES.includes(s.mode)||s.speed!==260||!w||w.size!==64||w.pattern!=='blinker')throw Error('bounded source state required');
 if(!integer(w.e8State,0,239)||!integer(w.micro,0,7)||!integer(w.macro,0,32)||!Array.isArray(w.records)||w.records.length!==w.macro)throw Error('invalid E8 / projection clock');
 const life=w.life;if(!life||life.pattern!==w.pattern||life.id!=='LIFE02V2:64x64:blinker:B3S23:finite-dead:synchronous'||!Array.isArray(life.history)||life.history.length!==w.macro+1||!life.event)throw Error('invalid Life history');
 for(const frame of life.history){if(frame.width!==64||frame.height!==64||frame.boundary!=='finite-dead'||!Array.isArray(frame.live)||frame.live.length>4096)throw Error('invalid frame');const seen=new Set();for(const cell of frame.live){if(!Array.isArray(cell)||cell.length!==2||!cell.every(x=>integer(x,0,63))||seen.has(cell.join(',')))throw Error('invalid cell address');seen.add(cell.join(','));}}
 return s;
}
function witness(value){
 if(!value||value.sourceHash!==SOURCE_HASH||!integer(value.revision,0,1000000)||value.timerRunning!==false)throw Error('source/version/revision/timer witness');
 const w=copy(value);w.state=state(w.state);const r=w.rendered;
 if(!r||r.mode!==w.state.mode||r.pattern!==w.state.work.pattern||r.size!==64||r.speed!==260||r.generation!==w.state.work.macro||!r.e8Clock||!r.rootAssignment||!r.trajectory)throw Error('rendered control readback mismatch');
 return w;
}
return Object.freeze({PROTOCOL,SOURCE_HASH,MODES,CUES,copy,equal,state,witness});
});
