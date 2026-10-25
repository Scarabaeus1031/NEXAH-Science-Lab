const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./assets/a0-relational-generations.js'),sewing=require('./assets/a0-pentagon-sewing.js'),body=require('./assets/a0-tessarec-blue-body-v1.js'),spectral=require('./assets/a0-tessarec-spectral-audit-v1.js'),axisAdapter=require('./assets/a0-tessarec-e8-axis08-adapter-v1.js'),axisCore=require('../../../SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/REPAIR_R1/e8_axis08_core.js');
const seed=[.415,.238,.213,.075,-.008,-.252,-.287,-.394];
const orderSeed=axisAdapter.run(spectral.run(body.buildShell(),{controlCount:24}).spectral.eigenvalues,axisCore,{pairStart:3}).source.laneMeans;
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
const rotated=model.rotateRing90(orderSeed),rotationComparison=model.compareRotationGeneration(orderSeed,{offset:0,direction:1,exponent:2,gain:1,tolerance:1e-12});
assert.deepEqual(model.RING_COORDINATES,[[1,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,1],[0,0]]);
assert.deepEqual(rotated,[orderSeed[6],orderSeed[7],...orderSeed.slice(0,6)]);
assert.deepEqual(model.rotateRing90(orderSeed,0),orderSeed);
assert.deepEqual(model.rotateRing90(orderSeed,4),orderSeed);
assert.deepEqual(model.rotateRing90(rotated,-1),orderSeed);
assert.equal(rotationComparison.controls.identity.exact,true);
assert.equal(rotationComparison.controls.fourQuarterTurns.exact,true);
assert.equal(rotationComparison.controls.inverse.exact,true);
assert.equal(rotationComparison.comparison.exactEqual,false);
assert.equal(rotationComparison.comparison.withinTolerance,false);
assert.ok(Math.abs(rotationComparison.comparison.maxAbsDifference-.10717184459568377)<1e-15);
assert.deepEqual(rotationComparison.comparison.difference,[-.050622527423217434,.05062252742321738,0,0,0,0,.10717184459568375,-.10717184459568377]);
assert.deepEqual(rotationComparison.ownerReadings.tokens,['∫\\~','F-Lenk','Ineinanderdrehen']);
assert.match(rotationComparison.R.not,/not a 3D cube operator/);
assert.throws(()=>model.rotateRing90(orderSeed,.5),/integer quarter turns/);
assert.throws(()=>model.compareRotationGeneration(orderSeed,{tolerance:-1}),/tolerance/);
const storedOrder=JSON.parse(fs.readFileSync('./results/a0-rotation-generation-order-connector-2026-10-25.json','utf8'));
assert.deepEqual(storedOrder.sourceState.values,rotationComparison.sourceState.values);
assert.deepEqual(storedOrder.pathA.state,rotationComparison.pathA.state);
assert.deepEqual(storedOrder.pathB.state,rotationComparison.pathB.state);
assert.deepEqual(storedOrder.comparison,rotationComparison.comparison);
assert.equal(storedOrder.route.priority,'SUBORDINATE_TO_ENG-D1D2-01');
assert.equal(storedOrder.route.deployment,false);
class El{constructor(value=''){this.value=value;this.textContent='';this.children=[];this.events={};this.attrs={};}setAttribute(k,v){this.attrs[k]=v;}appendChild(el){this.children.push(el);}replaceChildren(){this.children=[];}addEventListener(name,fn){this.events[name]=fn;}fire(name){this.events[name]?.();}}
const ids=['generationLab','generationSvg','generationSelect','generationOut','generationDetail','generationStatus','generationPlay','generationHeld','generationHold','generationCount','generationOffset','generationDirection','generationOperator','generationEpsilon','generationGain','generationOrderSvg','generationOrderDetail','generationOrderStatus'],els=Object.fromEntries(ids.map(id=>[id,new El()]));
Object.entries({generationCount:'8',generationOffset:'0',generationDirection:'1',generationOperator:'1',generationEpsilon:'.000001',generationGain:'1'}).forEach(([id,v])=>els[id].value=v);
let frame;const window={A0RelationalGenerations:model,A0Axis08FoldReturnView:{source:{source:{laneMeans:seed}}}};
vm.runInNewContext(fs.readFileSync('./a0-relational-generations.js','utf8'),{window,document:{getElementById:id=>els[id],createElementNS:()=>new El()},requestAnimationFrame:fn=>{frame=fn;}});
assert.equal(window.A0RelationalGenerationsView.snapshot().result.steps.length,8);
assert.equal(window.A0RelationalGenerationsView.orderSnapshot().comparison.withinTolerance,false);
assert.match(els.generationOrderStatus.textContent,/DOES NOT COMMUTE|weder exakt gleich/);
els.generationOperator.value='2';els.generationOperator.fire('change');assert.equal(window.A0RelationalGenerationsView.snapshot().result.options.exponent,2);
els.generationPlay.fire('click');frame(0);frame(1300);assert.equal(window.A0RelationalGenerationsView.snapshot().selected,2);
els.generationHold.fire('click');const held=JSON.parse(els.generationHeld.textContent);assert.equal(held.selected,2);assert.equal(held.steps[1].main.parent,1);frame(2600);assert.equal(window.A0RelationalGenerationsView.snapshot().selected,2);
els.generationDirection.value='-1';els.generationDirection.fire('change');assert.equal(window.A0RelationalGenerationsView.snapshot().result.options.direction,-1);assert.equal(els.generationHeld.textContent,'Noch kein Generations-Return gehalten.');
els.generationGain.value='2';els.generationGain.fire('change');assert.equal(window.A0RelationalGenerationsView.snapshot().result.options.gain,2);
const html=fs.readFileSync('./A0_AXIS08_FOLD_RETURN_SEQUENCER.html','utf8');
for(const token of ['rotationGenerationOrder','generationOrderSvg','Erst drehen oder','ENG-D1D2-01','∫\\~','F-Lenk','Ineinanderdrehen'])assert.ok(html.includes(token),`missing HTML token ${token}`);
for(const [file,tokens] of [
  ['./A0_RESEARCH_DESK.html',['rotation-generation-order-connector-20261025','NONCOMMUTING_FOR_DECLARED_FIXTURE','ENG‑D1D2‑01']],
  ['./A0_BUILDER_LOG.html',['rotation-generation-order-connector-20261025','NO DEPLOYMENT','ENG-D1D2-01']],
  ['../29_A0_PASCAL_GENERATION_CORNER_CROSSWALK_2026-10-10.md',['Kleiner Reihenfolgeanschluss','0.10717184459568377','NO_DEPLOYMENT']]
]){const source=fs.readFileSync(file,'utf8');for(const token of tokens)assert.ok(source.includes(token),`missing routed token ${token} in ${file}`);}
console.log('PASS: 32 generation configurations, chaining, local inverse, rotation-generation order comparison, exact R controls, bounded numeric tolerance, 7–1–7 cycle, UI operator/direction/play/pause/held provenance');
