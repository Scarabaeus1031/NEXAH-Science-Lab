const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const api=require('./a0-club-carrier-sequence.js'),model=require('./a0-game-of-numbers-model.js'),crt=require('./a0-club-crt-link.js'),adapter=require('./assets/a0-blue-body-interior-crt16-v1.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++};
const s=api.createSequence(model),tick=(q,running=true)=>s.observe({q4Address:q},running);
eq(s.snapshot().n,11537);tick(0);tick(1);eq(s.snapshot().n,11573);tick(3);eq(s.snapshot().n,11357);
for(let q=4;q<16;q++)tick(q);eq(s.snapshot().n,11357);ok(s.snapshot().ended);
s.loop(true);tick(0);eq(s.snapshot().n,11537);eq(s.snapshot().cycles,1);
s.mode('elevator');s.seed(11357);tick(1);
eq(s.snapshot().n,11377);eq(s.snapshot().coordinate.r,'17');eq(s.snapshot().coordinate.q,'568');
for(let q=2;q<=16;q++)tick(q%16);
eq(s.snapshot().index,16);eq(s.snapshot().n,11677);
s.seed(11537);eq(s.snapshot().index,16);eq(s.snapshot().n,11857);s.seed(11357);
for(const f of s.snapshot().family)eq(BigInt(f.decimal)-BigInt(f.seed),320n);
eq(crt.carrier(s.snapshot().n,adapter.MODULI).reconstructed,String(s.snapshot().n));
s.reset();s.follow(false);tick(1);eq(s.snapshot().index,0);s.step();eq(s.snapshot().index,1);ok(!s.snapshot().following);
s.follow(true);tick(2,false);eq(s.snapshot().index,1);tick(2,true);eq(s.snapshot().index,1);tick(3,true);eq(s.snapshot().index,2);
s.observe(null);tick(7);eq(s.snapshot().index,2);
s.mode('manual');s.seed(14357);tick(8);eq(s.snapshot().n,14357);eq(s.snapshot().index,0);
eq(s.mode('unbound'),false);eq(s.seed(999),false);
// Browser deployment deliberately uses only self-contained rail APIs, not LIFE/Euler/Trinity.
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/a0-game-of-numbers-model.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/a0-club-carrier-sequence.js','utf8'),ctx);
const browser=ctx.A0ClubCarrierSequence.createSequence(ctx.A0GameOfNumbers);
browser.observe({q4Address:0},true);browser.observe({q4Address:1},true);eq(browser.snapshot().n,11573);
browser.mode('elevator');browser.seed(11537);browser.observe({q4Address:3},true);eq(browser.snapshot().n,11557);
// Every native seed/lift agrees with the owning Numbers engine.
for(const seed of crt.FAMILY){
 const c=api.createSequence(model);c.mode('elevator');c.seed(seed);c.observe({q4Address:0},true);
 for(let k=0;k<=16;k++){
  if(k)c.observe({q4Address:k%16},true);
  eq(c.snapshot().n,seed+20*k);
  eq(c.snapshot().coordinate.r,String(seed%20));
  eq(crt.carrier(c.snapshot().n,adapter.MODULI).reconstructed,String(c.snapshot().n));
 }
}
// Full CRT DOM mount consumes the actual sequence controller and updates residues.
function el(){return{children:[],dataset:{},attrs:{},events:{},append(n){this.children.push(n)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.events[k]=f}}}
const nodes=Object.fromEntries(['clubCRTLink','clubCRTCarrier','clubCRTChannels','clubCRTAddress','clubCRTResult','clubCarrierRule','clubCarrierFollow','clubCarrierLoop','clubCarrierTrace','clubCarrierStep','clubCarrierReset'].map(id=>[id,el()]));
const mounted=crt.mount({getElementById:id=>nodes[id],createElement:el},{A0BlueBodyInteriorCRT16:adapter,A0GameOfNumbers:model,A0ClubCarrierSequence:api});
const src=(q,layer=1)=>({plate:'tessarec',q4Address:q,q4Bits:q.toString(2).padStart(4,'0'),layer});
mounted.observe(src(0),true);mounted.observe(src(1),true);
eq(mounted.snapshot().carrier.n,11573);eq(mounted.snapshot().carrier.reconstructed,'11573');
ok(nodes.clubCRTResult.textContent.includes('11573'));
nodes.clubCarrierRule.value='elevator';nodes.clubCarrierRule.events.change();mounted.observe(src(3),true);
eq(mounted.snapshot().carrier.n,11557);eq(mounted.snapshot().sequence.coordinate.r,'17');
nodes.clubCarrierStep.events.click();eq(mounted.snapshot().carrier.n,11577);ok(!mounted.snapshot().sequence.following);
mounted.observe(src(2),true);eq(mounted.snapshot().carrier.n,11577);
nodes.clubCarrierReset.events.click();eq(mounted.snapshot().carrier.n,11537);
console.log(JSON.stringify({status:'PASS',checks,scope:'actual Numbers carrier/elevator rails, native horizons, 9 seed lifts, CRT recalculation, pause/follow/reset/loop, no timers, browser leaf-model dependencies verified; browser pixels OPEN'}));
