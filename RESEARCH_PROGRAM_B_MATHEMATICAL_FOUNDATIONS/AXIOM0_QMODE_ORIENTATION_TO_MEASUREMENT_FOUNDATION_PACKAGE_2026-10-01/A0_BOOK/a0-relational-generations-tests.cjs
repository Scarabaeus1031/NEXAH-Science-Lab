const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./assets/a0-relational-generations.js'),sewing=require('./assets/a0-pentagon-sewing.js');
const seed=[.415,.238,.213,.075,-.008,-.252,-.287,-.394];
for(const direction of [1,-1])for(const exponent of [1,2])for(let offset=0;offset<8;offset++){
  const r=model.run(seed,{direction,exponent,offset,count:16});assert.ok(r.steps.length>0);
  r.steps.forEach(({main,comparison},i)=>{assert.equal(main.parent,i);assert.equal(main.generation,i+1);assert.equal(main.quotient.length,5);assert.equal(main.residuals.length,3);assert.ok(main.returnError<1e-10);if(i)assert.deepEqual(main.input,r.steps[i-1].main.output);assert.equal(main.offset,((offset+direction*i)%8+8)%8);assert.ok(comparison.output.every(Number.isFinite));});
}
const same=model.run(seed,{epsilon:0,exponent:2});assert.ok(same.comparisons.every(p=>p.difference===0));
const direct=model.run(seed,{exponent:1});direct.steps.forEach(s=>assert.ok(s.main.input.every((v,i)=>Math.abs(v-s.main.output[i])<1e-15)));
const stopped=model.run([2000,-2000,0,0,0,0,0,0],{exponent:2});assert.equal(stopped.stop.generation,1);assert.equal(stopped.steps.length,0);
assert.throws(()=>model.run(seed,{count:25}),/invalid/);assert.throws(()=>model.run(seed,{direction:0}),/invalid/);
const doubled=model.run(Array(8).fill(5.25),{gain:2,count:3,epsilon:0});assert.deepEqual(doubled.steps.map(s=>s.main.output[0]),[10.5,21,42]);doubled.steps.forEach(s=>assert.deepEqual(model.returnInput(s.main),s.main.input));
for(const direction of [1,-1])for(const exponent of [1,2]){const run=model.run(seed,{gain:2,direction,exponent,count:4});run.steps.forEach(({main})=>{assert.equal(main.gain,2);assert.ok(main.returnError<1e-10);});}
assert.throws(()=>model.run(seed,{gain:3}),/invalid/);
assert.deepEqual(Array.from({length:13},(_,i)=>sewing.levelAt(i*2)),[7,6,5,4,3,2,1,2,3,4,5,6,7]);
class El{constructor(value=''){this.value=value;this.textContent='';this.children=[];this.events={};this.attrs={};}setAttribute(k,v){this.attrs[k]=v;}appendChild(el){this.children.push(el);}replaceChildren(){this.children=[];}addEventListener(name,fn){this.events[name]=fn;}fire(name){this.events[name]?.();}}
const ids=['generationLab','generationSvg','generationSelect','generationOut','generationDetail','generationStatus','generationPlay','generationHeld','generationHold','generationCount','generationOffset','generationDirection','generationOperator','generationEpsilon','generationGain'],els=Object.fromEntries(ids.map(id=>[id,new El()]));
Object.entries({generationCount:'8',generationOffset:'0',generationDirection:'1',generationOperator:'1',generationEpsilon:'.000001',generationGain:'1'}).forEach(([id,v])=>els[id].value=v);
let frame;const window={A0RelationalGenerations:model,A0Axis08FoldReturnView:{source:{source:{laneMeans:seed}}}};
vm.runInNewContext(fs.readFileSync('./a0-relational-generations.js','utf8'),{window,document:{getElementById:id=>els[id],createElementNS:()=>new El()},requestAnimationFrame:fn=>{frame=fn;}});
assert.equal(window.A0RelationalGenerationsView.snapshot().result.steps.length,8);
els.generationOperator.value='2';els.generationOperator.fire('change');assert.equal(window.A0RelationalGenerationsView.snapshot().result.options.exponent,2);
els.generationPlay.fire('click');frame(0);frame(1300);assert.equal(window.A0RelationalGenerationsView.snapshot().selected,2);
els.generationHold.fire('click');const held=JSON.parse(els.generationHeld.textContent);assert.equal(held.selected,2);assert.equal(held.steps[1].main.parent,1);frame(2600);assert.equal(window.A0RelationalGenerationsView.snapshot().selected,2);
els.generationDirection.value='-1';els.generationDirection.fire('change');assert.equal(window.A0RelationalGenerationsView.snapshot().result.options.direction,-1);assert.equal(els.generationHeld.textContent,'Noch kein Generations-Return gehalten.');
els.generationGain.value='2';els.generationGain.fire('change');assert.equal(window.A0RelationalGenerationsView.snapshot().result.options.gain,2);
console.log('PASS: 32 generation configurations, chaining, local inverse, zero perturbation, magnitude STOP, 7–1–7 cycle, UI operator/direction/play/pause/held provenance');
