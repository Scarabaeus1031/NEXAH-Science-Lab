const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const B=require('./a0-breath-grid-bench.js'),T=require('./assets/a0-tesa-grid-candidate.js');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_CON_DAO_JANUS_BREATH_SEQUENCER_2026-10-06/breath-model.js','utf8'),context);
const model=context.window.NEXAH_BREATH_MODEL;
let checks=0;const check=v=>{assert.ok(v);checks++;};
for(let tick=0;tick<140;tick++)for(const circle of [false,true])for(const grid of [false,true]){
  const r=B.reading(model,tick,{circle,grid});
  check(r.cells.length===28&&new Set(r.cells.map(p=>p.address)).size===28);
  check(r.stretch>=1&&r.stretch<=2);
  check(r.circleRadius>=13&&r.circleRadius<=26);
  check(grid||r.stretch===1);check(circle||r.circleRadius===13);
  for(const p of r.cells){
    check(T.fromView(p.x,p.y,{stretch:r.stretch})===p.address);
    check(p.y===T.view(p.address).y);
    for(const n of T.neighbors(p.address)){const q=r.cells[n-1];check(Math.abs(Math.abs((q.x-p.x)/r.stretch)+Math.abs(q.y-p.y)-1)<1e-12);}
  }
}
check(B.sourceTick(0)===0);check(B.sourceTick(2*Math.PI)===0);
check(B.sourceTick(2*Math.PI-1e-6)===13);
for(const value of [-1,NaN,Infinity]){assert.throws(()=>B.sourceTick(value));checks++;}
check(B.reading(model,6,{grid:true}).stretch===2);
check(B.reading(model,7,{grid:true}).stretch===2);
check(B.reading(model,13,{grid:true}).stretch===1);
class Element{
 constructor(){this.textContent='';this.innerHTML='';this.hidden=false;this.disabled=false;this.checked=false;this.value='';this.handlers={};}
 addEventListener(name,f){this.handlers[name]=f;}
 fire(name){this.handlers[name]({target:this});}
}
const elements={},host=new Element();host.querySelector=q=>elements[q]??=new Element();
const doc={getElementById:id=>id==='breathGridBench'?host:null};
let notification,ready=false,clockLast={source:{clock:0,ratio:'3:2',phaseDegrees:90,playing:false}};
const clock={get ready(){return ready;},get last(){return clockLast;},subscribe(f){notification=f;return()=>{notification=null;}}};
const controller=B.mount(doc,{NEXAH_BREATH_MODEL:model,A0MaskClockBench:clock});
const el=name=>host.querySelector('[data-bg-'+name+']');
check(controller.snapshot===null);check(el('drawing').innerHTML==='');
ready=true;notification();check(controller.snapshot.source==='bluepink');
clockLast.source.clock=2*Math.PI*6.25/14;notification();check(controller.snapshot.reading.phase.stateId==='STILL');
el('grid').checked=true;el('grid').fire('change');check(controller.snapshot.reading.stretch===2);
ready=false;notification();check(controller.snapshot===null&&el('drawing').innerHTML==='');
el('source').value='numbers';el('source').fire('change');check(controller.snapshot.sourceState.cursor===0);
for(let i=0;i<6;i++)el('next').fire('click');
check(controller.snapshot.sourceState.frames[6].state.a==='11657');
check(controller.snapshot.reading.stretch===2);
el('off').fire('click');check(controller.snapshot.reading.stretch===1&&controller.snapshot.reading.circleRadius===13);
el('prev').fire('click');check(controller.snapshot.sourceState.cursor===5);
el('cursor').value='2';el('cursor').fire('input');check(controller.snapshot.sourceState.cursor===2);
el('source').value='bluepink';el('source').fire('change');check(controller.snapshot===null);
el('source').value='numbers';el('source').fire('change');check(controller.snapshot.sourceState.cursor===2);
for(let i=0;i<20;i++)el('next').fire('click');
check(controller.snapshot.sourceState.cursor===16&&el('next').disabled);
controller.dispose();check(notification===null);
const source=fs.readFileSync('./a0-breath-grid-bench.js','utf8');
check(!/setInterval|requestAnimationFrame|postMessage|setTimeout/.test(source));
const bench=fs.readFileSync('./A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
check(bench.indexOf('a0-mask-clock-bench.js')<bench.indexOf('a0-breath-grid-bench.js'));
check(bench.includes('id="breathGridBench"'));
console.log(JSON.stringify({status:'PASS',checks,scope:'Model, inverse addresses, adjacency, mounted controls, source loss/HOLD, source switching, stored replay cursor and no autonomous timer. Browser visual acceptance OPEN.'},null,2));
