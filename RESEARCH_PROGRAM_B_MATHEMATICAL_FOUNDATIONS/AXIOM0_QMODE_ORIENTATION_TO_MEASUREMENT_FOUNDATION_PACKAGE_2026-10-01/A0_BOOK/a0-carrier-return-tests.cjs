'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('./a0-carrier-return.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=x=>{assert.ok(x);checks++;},bad=f=>{assert.throws(f);checks++;};
for(let n=0;n<=31000;n++)for(const op of ['suffix2','shadow']){const k=M.apply(n,op);ok(k>=0&&k<=31000);eq(M.apply(k,op),n);}
eq(M.apply(11537,'suffix2'),11573);eq(M.apply(11573,'suffix2'),11537);
eq(M.apply(11537,'shadow'),19463);eq(M.apply(11573,'shadow'),19427);
eq(M.proof([11537,11573],'shadow').signedDeltaAfter,-36);
eq(M.inspect(11537).factors,[83,139]);eq(M.inspect(11573).factors,[71,163]);
eq([M.inspect(11537).mod125,M.inspect(11573).mod125],[37,73]);
eq([M.inspect(11537).mod1000,M.inspect(11573).mod1000],[537,573]);
eq(M.inspect(11537).crt.reconstructed,'11537');
for(const n of [-1,31001,1.5,NaN,'11537'])bad(()=>M.apply(n,'shadow'));bad(()=>M.apply(3,'unknown'));
for(const seed of [11537,11573]){
 for(const ops of [[],['suffix2'],['shadow'],['suffix2','shadow'],['shadow','suffix2'],['shadow','suffix2','shadow']]){
  const s=M.create(seed);for(const op of ops)s.step(op);
  const before=s.snapshot();eq(before.history,ops);eq(before.anuTransport,null);eq(before.liveClubCarrier,false);eq(before.wholeMachineReturn,false);
  const ret=s.returnPath();eq(ret.inversePath,[...ops].reverse());eq(ret.back,before.anchor);eq(ret.residual,[0,0]);eq(ret.exact,true);eq(s.snapshot().history,[]);
 }
}
const s=M.create();for(let i=0;i<64;i++)s.step('suffix2');bad(()=>s.step('shadow'));eq(s.returnPath().exact,true);
bad(()=>M.create(11357));const t=M.create();bad(()=>t.step('invalid'));eq(t.snapshot().history,[]);t.step('shadow');t.reset(11573);eq(t.snapshot().current.map(v=>v.n),[11573,11537]);eq(t.snapshot().lastReturn,null);
const nodes={};
class N{
 constructor(){this.children=[];this.events={};this.value='';}set id(v){nodes[v]=this;this._id=v;}get id(){return this._id;}
 append(...xs){this.children.push(...xs);}after(n){this.next=n;}replaceChildren(...xs){this.children=xs;}addEventListener(k,f){this.events[k]=f;}click(){if(!this.disabled)this.events.click?.();}
 set innerHTML(s){this.html=s;for(const m of s.matchAll(/id="([^"]+)"/g)){new N().id=m[1];}if(nodes.carrierReturnSeed)nodes.carrierReturnSeed.value='11537';}get innerHTML(){return this.html||'';}
}
new N().id='registerJanusWorkbench';const doc={getElementById:id=>nodes[id]||null,createElement:()=>new N()};
const win={},ui=M.mount(doc,win);ok(ui);eq(M.mount(doc),null);eq(nodes.carrierInverse.disabled,true);
const beforeSource=ui.snapshot();nodes.carrierOpenPink.click();ok(nodes.carrierPinkStatus.textContent.includes('HOLD'));
let requested='synthesis-loki',loaded=true,opens=0,selects=0;
win.A0BenchPerspectiveDeckView={panes:{A:{snapshot:()=>({requested,documentLoaded:loaded}),select(id){requested=id;selects++;},open(){opens++;loaded=false;}}}};
nodes.carrierOpenPink.click();eq(opens,0);eq(selects,0);eq(requested,'synthesis-loki');ok(nodes.carrierPinkStatus.textContent.includes('belegt'));
requested=null;loaded=false;nodes.carrierOpenPink.click();eq(requested,'pink');eq(opens,1);eq(selects,1);ok(nodes.carrierPinkStatus.textContent.includes('angefordert'));
nodes.carrierOpenPink.click();eq(opens,1);eq(selects,1);loaded=true;nodes.carrierOpenPink.click();ok(nodes.carrierPinkStatus.textContent.includes('geladen'));
eq(ui.snapshot(),beforeSource);
nodes.carrierSuffix.click();eq(ui.snapshot().current[0].n,11573);nodes.carrierShadow.click();eq(ui.snapshot().current[0].n,19427);
nodes.carrierInverse.click();eq(ui.snapshot().current[0].n,11537);eq(ui.snapshot().lastReturn.exact,true);ok(nodes.carrierReturnStatus.textContent.includes('PASS'));
nodes.carrierReturnSeed.value='11573';nodes.carrierReturnSeed.events.change();eq(ui.snapshot().anchor,[11573,11537]);eq(ui.snapshot().lastReturn,null);
eq(nodes.carrierReturnMissing.children.length,3);eq(nodes.carrierReturnViews.children.length,2);
nodes.carrierReturnSeed.value='0';nodes.carrierReturnSeed.events.change();ok(nodes.carrierReturnError.textContent.includes('HOLD'));eq(ui.snapshot().anchor,[11573,11537]);
// Browser exposure of existing CRT functions without a Club host: no timer or source API supplied.
const context={document:{getElementById:()=>null}};vm.runInNewContext(fs.readFileSync('a0-club-crt-link.js','utf8'),context);ok(context.A0ClubCRTModel);eq(context.A0ClubCRTLink,null);
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
ok(html.includes('href="#carrierReturnWorkbench"'));ok(html.indexOf('src="a0-carrier-return.js')>html.indexOf('src="a0-club-crt-link.js'));
console.log('PASS · '+checks+' carrier-return assertions · exact finite UI checks and DOM doubles; browser acceptance OPEN');
