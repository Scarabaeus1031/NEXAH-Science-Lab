const assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('./a0-game-of-numbers-model.js'),S=require('./a0-layered-pentagon-scene.js'),Stack=require('./a0-aperture-stack-calibration.js'),A=require('./a0-one-one-bench.js');
let checks=0;const ok=v=>{assert.ok(v);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
let source=Stack.buildRecord({plateIndex:2});const original=JSON.stringify(source),c=A.create(M,S,()=>source);
eq(c.snapshot().phase,0);eq(c.snapshot().endpoints.upper.address,'mixer|n0');
eq(c.check().last.mixerRecord,'HOLD');eq(c.check().last.stackRecord,'HOLD');
c.connect();eq(c.check().last.mixerRecord,'MATCH');eq(c.check().last.stackRecord,'MATCH');
for(const [n,angle]of [[45,78],[90,33],[135,7],[180,0]]){
 const r=c.station(n);eq(r.phase,2*n);eq(r.fold.angle,angle);eq(r.endpoints.lower.address,'P3');eq(JSON.stringify(source),original);
}
let r=c.check();eq(r.last.geometryAtStart,true);eq(r.last.mixerRecord,'CHANGED');eq(r.last.sourceReturn,'HOLD_UNDECLARED_CROSS_STACK_OPERATOR');
r=c.returnCursor();eq(r.cursor,0);eq(r.savedFrames,181);eq(r.last.mixerRecord,'MATCH');eq(r.last.stackRecord,'MATCH');eq(r.last.method,'SAVED_CURSOR_RETURN_NOT_COMPUTED_INVERSE');eq(r.linked,false);
c.connect();source=Stack.buildRecord({plateIndex:3});r=c.returnCursor();eq(r.last.stackRecord,'CHANGED');eq(source.activePlate.plate,'P4');
source=null;c.connect();eq(c.check().last.stackRecord,'HOLD');
c.reset();eq(c.snapshot().savedFrames,1);eq(c.snapshot().last,null);
const snap=c.snapshot();snap.frame.state.a='bad';ok(c.snapshot().frame.state.a!=='bad');
assert.throws(()=>c.station(5));checks++;
eq(A.compare({a:1,b:2},{b:2,a:1}),'MATCH');eq(A.compare(null,null),'HOLD');
// Mount the real sidecar, forwarding button events and checking both source drawings.
function node(){return{listeners:{},dataset:{},addEventListener(k,f){this.listeners[k]=f},querySelectorAll(){return[]}}}
const ids=['oneOneTest','oneOneStatus','oneOneMixer','oneOneUpperAddress','oneOneStack','oneOneLowerAddress','oneOneReturn','oneOneResult','oneOneLedger','oneOneConnect','oneOneStep','oneOneCheck','oneOneReset'];
const nodes=Object.fromEntries(ids.map(id=>[id,node()])),doc={getElementById:id=>nodes[id]};
source=Stack.buildRecord({plateIndex:2});let reads=0;
const win={A0GameOfNumbers:M,A0LayeredPentagonScene:S,A0ApertureStackController:{get record(){reads++;return source}}};
const view=A.mount(doc,win);ok(view);ok(reads>0);ok(nodes.oneOneMixer.innerHTML.includes('svg'));ok(nodes.oneOneStack.innerHTML.includes('51.83'));
ok(!nodes.oneOneMixer.innerHTML.includes('id="stack-'));ok(nodes.oneOneMixer.innerHTML.includes('id="one-one-stack-'));
nodes.oneOneConnect.listeners.click();eq(nodes.oneOneTest.dataset.linked,'true');
nodes.oneOneStep.listeners.click();eq(view.snapshot().cursor,1);nodes.oneOneCheck.listeners.click();ok(nodes.oneOneResult.textContent.includes('CHANGED'));
nodes.oneOneReturn.listeners.click();ok(nodes.oneOneResult.textContent.includes('Mixer-Record: MATCH'));ok(nodes.oneOneResult.textContent.includes('Quellenverbindung: HOLD'));
const js=fs.readFileSync(__dirname+'/a0-one-one-bench.js','utf8');ok(!/setInterval|setTimeout|requestAnimationFrame|postMessage|localStorage|\.start\(\)/.test(js));
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
for(const id of ids)eq([...html.matchAll(new RegExp('id="'+id+'"','g'))].length,1);
ok(html.includes('a0-one-one-bench.js'));ok(html.includes('a0-one-one-bench.css'));
console.log(JSON.stringify({status:'PASS',checks,scope:'actual Numbers fold stations and scene; actual six-plate record; local edge/anchors; geometry return is not record return; saved cursor explicitly not inverse; missing/changed sources; history retained; DOM doubles only, browser pixels OPEN'}));
