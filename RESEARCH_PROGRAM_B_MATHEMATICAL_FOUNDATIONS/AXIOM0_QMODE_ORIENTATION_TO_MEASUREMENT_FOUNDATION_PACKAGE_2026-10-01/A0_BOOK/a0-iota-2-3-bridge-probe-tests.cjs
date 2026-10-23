'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const pulse=require('./a0-pulse-grammar-clock.js');
const orientation=require('./a0-va-av-orientation-probe.js');
const api=require('./a0-iota-2-3-bridge-probe.js');

let checks=0;
const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++};
const ok=(value,message)=>{assert.ok(value,message);checks++};

eq(api.IDENTITY,'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','existing Bench identity reused');
eq(api.CLASSIFICATION,'BOUNDED_ENGINEERING_ARITHMETIC_PROBE','probe remains engineering-only');
eq(api.gcd(8,12),4,'gcd 8 and 12');
eq(api.lcm(8,12),24,'lcm 8 and 12');
eq(api.factorize(1836),[2,2,3,3,3,17],'1836 prime factorization');
eq(api.factorize(1729),[7,13,19],'1729 prime factorization');
eq(api.isPrime(17),true,'17 prime');eq(api.isPrime(19),true,'19 prime');eq(api.isPrime(18),false,'18 composite');
eq(api.arithmeticType(16).type,'PRIME_POWER','16 is prime power');eq(api.arithmeticType(16).base,2,'16 power base');eq(api.arithmeticType(16).exponent,4,'16 power exponent');
eq(api.arithmeticType(17).type,'PRIME','17 type prime');eq(api.arithmeticType(18).type,'MIXED_COMPOSITE','18 mixed composite');eq(api.arithmeticType(19).type,'PRIME','19 type prime');

const arithmetic=api.exactArithmetic();
eq(arithmetic.bridge.left.total,24,'three 8-period cycles total 24');
eq(arithmetic.bridge.right.total,24,'two 12-period cycles total 24');
eq(arithmetic.bridge.sixSectorCount,6,'24 contains six gcd-sized sectors');
eq(arithmetic.pulse24,{threeByEight:24,twoByTwelve:24,phrasePlusGate:24},'all declared 24 decompositions agree');
eq(arithmetic.localWindow.sixteen,16,'16 is two times 8');
eq(arithmetic.localWindow.sixteenPower,16,'16 is two to fourth power');
eq(arithmetic.localWindow.sixteenTower,16,'16 is explicitly parenthesized two power two squared');
eq(arithmetic.localWindow.sixteenSignature,6,'two plus four is factorization signature six');
eq(arithmetic.localWindow.eighteen,18,'18 is three times 6');
eq(arithmetic.localWindow.nineteen,19,'19 is 18 plus 1');
eq(arithmetic.localWindow.sum16And17,33,'16 plus 17 is 33');
eq(arithmetic.localWindow.threeByEleven,33,'33 is three times 11');
eq(arithmetic.largeValues.factor1836.cofactor,108,'17 is an exact factor of 1836');
eq(arithmetic.largeValues.factor1836.reconstructed,1836,'17 times 108 reconstructs 1836');
eq(arithmetic.largeValues.factor1729.cofactor,91,'19 is an exact factor of 1729');
eq(arithmetic.largeValues.factor1729.reconstructed,1729,'19 times 91 reconstructs 1729');
eq(arithmetic.largeValues.cofactor108,{sixByEighteen:108,threeByThirtySix:108,nineByTwelve:108},'108 decompositions agree');

const run=api.trace();
eq(run.length,25,'trace includes ticks 0 through 24');
eq(run.filter(item=>item.jointReturn).map(item=>item.tick),[0,24],'no premature simultaneous return');
ok(run.every(item=>item.still==='FIXED'),'STILL remains invariant');
eq(api.step(8).am.atOrigin,true,'AM returns at tick 8');
eq(api.step(8).pm.atOrigin,false,'PM has not returned at tick 8');
eq(api.step(12).am.atOrigin,false,'AM has not returned at tick 12');
eq(api.step(12).pm.atOrigin,true,'PM returns at tick 12');
eq(api.step(24).am.phase,0,'AM phase closes at tick 24');
eq(api.step(24).pm.phase,0,'PM counter-phase closes at tick 24');

const address=api.typedAddress();
eq(address.literal,'0|6|9','address retained as segmented literal');
eq(address.numericValue,null,'address is not silently parsed as 69');
eq(address.letterOIdentity,false,'zero is not letter O');
eq(address.universalLaw,false,'no universal 069 law');

const proof=api.verify();
eq(proof.status,'PASS','bounded proof passes');
ok(Object.values(proof.assertions).every(Boolean),'all proof assertions pass');

eq(pulse.IDENTITY,api.IDENTITY,'Pulse Clock reuses same host identity');
eq(pulse.OUTER.length,11,'Pulse Clock exposes 11 phrase slots');
eq(orientation.IDENTITY,api.IDENTITY,'orientation probe reuses same host identity');
eq(orientation.prefixedAxis().suffixAxis,'6|9','orientation ownership remains in separate probe');
eq(orientation.prefixedAxis().operation,'DIGIT_CONCATENATION_NOT_ADDITION','16 and 19 are not reinterpreted as sums');

const record=api.buildRecord();
eq(record.schema,'nexah.a0.iota-2-3-bridge-probe/1','record schema');
eq(record.status,'PASS','record passes');
eq(record.authority.researchRun,false,'not a research run');
eq(record.authority.scientificEvidence,false,'not scientific evidence');
eq(record.authority.newIdentity,false,'no new identity');
eq(record.authority.newOperator,false,'no new operator');
ok(record.boundary.includes('not a physical spin law'),'physical-law boundary explicit');

let view=api.createViewState();eq(view,{tick:0,layer:'BRIDGE',playing:false},'view starts at origin bridge layer');
view=api.advance(view);eq(view.tick,1,'view advances one tick');
view=api.advance(view,23);eq(view.tick,24,'view reaches joint return');
eq(api.inspectView(view).returnStatus,'JOINT RETURN','tick 24 joint return readout');
eq(api.inspectView(view).factorRail.map(item=>item.type),['PRIME_POWER','PRIME','MIXED_COMPOSITE','PRIME'],'factor rail types');
view=api.setLayer(view,'factor');eq(view.layer,'FACTOR','factor layer selected');
ok(api.svgMarkup(view).includes('2|3 IOTA BRIDGE')&&api.svgMarkup(view).includes('PRIME POWER'),'SVG includes bridge and typed rail');
eq(api.viewRecord(view).classification,'BOUNDED_ENGINEERING_VIEW','view record bounded');
assert.throws(()=>api.setLayer(view,'physics'),RangeError);checks++;

function node(id){return{id,dataset:{},textContent:'',innerHTML:'',attrs:{},listeners:{},addEventListener(type,fn){this.listeners[type]=fn},setAttribute(name,value){this.attrs[name]=value},click(){if(this.listeners.click)this.listeners.click()}}}
const ids=['iota23Bridge','iota23BridgeSvg','iota23Status','iota23Am','iota23Pm','iota23Return','iota23Layer','iota23Step','iota23Play','iota23Reset','iota23Export'];
const nodes=Object.fromEntries(ids.map(id=>[id,node(id)]));
const layers=['BRIDGE','FACTOR','PULSE'].map(layer=>{const n=node(layer);n.dataset.i23Layer=layer;return n});
nodes.iota23Bridge.querySelectorAll=()=>layers;
const fakeDoc={getElementById:id=>nodes[id]||null,createElement:()=>node('download')};
const controller=api.mount(fakeDoc,{});ok(controller,'view mounts on DOM double');
eq(nodes.iota23Status.textContent,'T00 · ORIGIN · BRIDGE','initial DOM status');
nodes.iota23Step.click();eq(nodes.iota23Status.textContent,'T01 · OPEN · BRIDGE','step updates DOM status');
layers[1].click();eq(nodes.iota23Layer.textContent,'FACTOR','layer button updates readout');
controller.reset();for(let i=0;i<24;i++)controller.step();eq(nodes.iota23Return.textContent,'JOINT RETURN','DOM reaches first joint return at 24');

const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'a0-iota-2-3-bridge-probe.css'),'utf8');
for(const token of ['id="iota23Bridge"','a0-iota-2-3-bridge-probe.css','a0-iota-2-3-bridge-probe.js','data-i23-layer="FACTOR"','16=2⁴=2^(2²)=2×8','iota-2-3-bridge-return-20261023'])ok(html.includes(token),`HTML integration ${token}`);
ok(css.includes('.i23-number.prime-power')&&css.includes('.i23-still.return'),'prime-power and joint return styled');

assert.throws(()=>api.gcd(0,12),TypeError);checks++;
assert.throws(()=>api.lcm(8,1.5),TypeError);checks++;
assert.throws(()=>api.factorize(-1836),TypeError);checks++;
assert.throws(()=>api.step(-1),TypeError);checks++;
assert.throws(()=>api.trace(2.5),TypeError);checks++;

console.log(JSON.stringify({status:'PASS',checks,scope:'2|3 IOTA bridge arithmetic, modular scheduling and bounded Bench view; no scientific run or claim promotion'}));
