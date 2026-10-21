const assert=require('node:assert/strict'),fs=require('node:fs'),R=require('./a0-lens-region-reader.js'),S=require('./a0-layered-pentagon-scene.js'),B=require('./a0-bench-lens-return.js');
let checks=0;const check=v=>{assert.ok(v);checks++;};
for(let phase=0;phase<=360;phase+=5)for(const left of [false,true])for(const right of [false,true]){
 const baseline=R.reading(phase,{left,right},'partition');
 for(const mode of R.MODES){
  const r=R.reading(phase,{left,right},mode);
  check(JSON.stringify(r.regions)===JSON.stringify(baseline.regions));
  check(r.residual<1e-8);
  check(Math.abs(r.areas.A+r.areas.B-r.areas.leftOnly-r.areas.rightOnly-2*r.areas.intersection)<1e-8);
  check(left||r.areas.A===0);check(right||r.areas.B===0);
  check(left&&right||r.areas.intersection===0);
  check(R.verify(R.record(r)));
 }
}
const a=[[0,0],[1,0],[1,1],[0,1]];
check(R.split(a,[]).outside.length===1);check(R.split([],a).outside.length===0);
check(Math.abs(S.area(R.split(a,a).intersection)-1)<1e-9);
check(R.split(a,a).outside.length===0);
const bad=R.record(R.reading(232,{}));bad.reading.areas.A++;check(!R.verify(bad));
assert.throws(()=>R.reading(232,{},'unknown'));checks++;
for(const mode of R.MODES){const r=R.reading(232,{},mode),svg=R.drawing(r);check(svg.includes('<title>'));check(!svg.includes('NaN'));check(mode!=='differences'||!svg.includes('data-region="A-intersection-B"'));check(mode!=='intersection'||!svg.includes('data-region="A-minus-B"'));}
class E{constructor(){this.handlers={};this.value='';this.disabled=false;this.innerHTML='';this.textContent='';}addEventListener(k,f){this.handlers[k]=f;}fire(k){this.handlers[k]({target:this});}click(){this.clicked=true;}}
const elements={},panel=new E();panel.querySelector=q=>elements[q]??=new E();
const sourceDrawing=new E();let inserted;
sourceDrawing.after=n=>{inserted=n;};
const parent={querySelector:()=>sourceDrawing},doc={getElementById:id=>id==='benchLensReturn'?parent:null,createElement:tag=>tag==='section'?panel:new E()};
let state=B.create(),callback;const source={get state(){return JSON.parse(JSON.stringify(state));},subscribeReading(f){callback=f;return()=>{callback=null;}}};
const controller=R.mount(doc,{A0BenchLensReturnController:source}),el=n=>panel.querySelector('[data-lrr-'+n+']');
check(inserted.id==='lensRegionReader');check(controller.snapshot.phase===232);
const sourceBefore=JSON.stringify(state);
el('mode').value='differences';el('mode').fire('change');check(controller.snapshot.mode==='differences');check(JSON.stringify(state)===sourceBefore);
el('capture').fire('click');const held=JSON.stringify(controller.held);check(!el('export').disabled);
state=B.apply(state,'phase',90);callback();check(controller.snapshot.phase===90);check(JSON.stringify(controller.held)===held);
state=B.apply(state,'settings',{left:false});callback();check(controller.snapshot.areas.A===0&&controller.snapshot.areas.intersection===0);
check(B.verify(B.record(state)).status==='PASS');check(state.session.cursor===0);
Object.defineProperty(source,'state',{get(){return{phase:NaN,settings:{}};}});callback();check(controller.snapshot===null&&el('drawing').innerHTML==='');
controller.dispose();check(callback===null);
check(!/setInterval|setTimeout|requestAnimationFrame|postMessage/.test(fs.readFileSync('a0-lens-region-reader.js','utf8')));
console.log(JSON.stringify({status:'PASS',checks,scope:'Partition area accounting, toggles, empty/equal inputs, recomputation, mounted phase subscription, held-record independence and source error HOLD. Browser visual acceptance OPEN.'},null,2));
