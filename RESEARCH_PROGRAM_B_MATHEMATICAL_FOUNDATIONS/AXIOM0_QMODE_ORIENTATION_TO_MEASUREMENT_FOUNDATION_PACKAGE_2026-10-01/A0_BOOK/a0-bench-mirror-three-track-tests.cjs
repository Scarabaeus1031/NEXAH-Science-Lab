'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('./a0-bench-finite-packages.js'),V=require('./a0-bench-finite-packages-view.js');
let checks=0;const ok=(x,label)=>{assert.ok(x,label);checks++},same=(a,b)=>a.every((x,i)=>Math.abs(x-b[i])<1e-12),copy=x=>JSON.parse(JSON.stringify(x));
const legacy=require('./assets/a0-finite-v1-legacy-fixture.json');
ok(M.replay(legacy).status==='PASS','captured pre-change v1 fixture replays without reinterpretation');
for(const n of [6,7,8])for(let vertex=0;vertex<n;vertex++)for(let phase=0;phase<n;phase++){
  const s={...M.initial('antipode'),n,vertex,phase,operator:'reflection'},r=M.reading(s),target=(n-vertex)%n;
  ok(r.status==='READY'&&r.trace.OPERATOR.targetVertex===target,'reflection independent of vertex antipode');
  ok(M.reading({...s,vertex:target}).trace.OPERATOR.targetVertex===vertex,'reflection is involution');
  const theta=2*Math.PI*phase/n,[x,y]=r.sourcePoint,c=Math.cos(2*theta),d=Math.sin(2*theta);
  ok(same(r.point,[c*x+d*y,d*x-c*y,0]),'phase-frame axis agrees with reflected geometry');
  ok(r.trace.OPERATOR.reflectionAxis.fixedVertices.length===(n%2?1:2),'odd/even fixed-vertex count');
  ok(r.trace.OPERATOR.changesSourceVertex===(target!==vertex),'target-change metadata');
}
for(const n of [6,7,8])for(const operator of ['antipode','reflection','counterview','rotation']){
  const engine=M.create('antipode');engine.apply('SET',{n});engine.apply('SET',{vertex:1,operator});
  if(n===7&&operator==='antipode'){ok(engine.reading().status==='HOLD','only odd antipode holds');assert.throws(()=>engine.capture());checks++;continue;}
  const anchor=engine.capture();engine.apply('STEP');engine.restore();
  ok(M.canonical(engine.snapshot())===M.canonical(anchor.state),'complete captured state Return');
  const record=engine.record();ok(record.schema==='a0.bench-finite-package/2'&&M.replay(record).status==='PASS','v2 source replay');
  const bad=copy(record);bad.reading.trace.OPERATOR.targetVertex=99;delete bad.fingerprint;bad.fingerprint=M.fingerprint(bad);
  ok(M.replay(bad).status==='REJECT','re-signed false target fails rederivation');
  const badBand=copy(record);badBand.reading.trace.BAND.seamPermutation.A='A';delete badBand.fingerprint;badBand.fingerprint=M.fingerprint(badBand);
  ok(M.replay(badBand).status==='REJECT','re-signed false seam fails rederivation');
}
const oldOdd=M.create('antipode',1);oldOdd.apply('SET',{n:7});oldOdd.apply('SET',{operator:'reflection'});
ok(oldOdd.reading().status==='HOLD'&&M.replay(oldOdd.record()).status==='HOLD','v1 retains historical C7 semantics');
const downgrade=copy(M.create('antipode').record());downgrade.schema='a0.bench-finite-package/1';delete downgrade.fingerprint;downgrade.fingerprint=M.fingerprint(downgrade);
ok(M.replay(downgrade).status==='REJECT','schema downgrade cannot reinterpret modern reading');
for(let i=0;i<100;i++){const t=i*Math.PI/50;for(const u of [-.8,0,.8]){
  ok(same(M.bandPoint(t,u),M.bandPoint(t+2*Math.PI,-u)),'seam swaps transverse coordinate');
  ok(same(M.bandPoint(t,u),M.bandPoint(t+4*Math.PI,u)),'double turn returns');
}ok(!same(M.bandPoint(t,.8),M.bandPoint(t+2*Math.PI,.8)),'outer same-parameter track not closed after single turn');
ok(same(M.bandPoint(t,0),M.bandPoint(t+2*Math.PI,0)),'centre closes after single turn');}
for(const n of [6,7,8])for(const view of ['xy','yz','zx'])for(const sheet of [-1,1]){
  const svg=V.diagrams({...M.initial('antipode'),n,view,sheet},M);
  ok((svg.match(/<svg /g)||[]).length===4,'selected / antipode / mirror / band panels');
  for(const id of ['A','M','B'])ok(svg.includes('data-track="'+id+'"'),'separate visible track '+id);
  ok(svg.includes('data-role="reflection-axis"')&&svg.includes('j → −j'),'explicit reflection axis');
  ok(svg.includes('NOT Cn CARRIER')&&svg.includes('kein historischer GIF-Generator'),'carrier and source boundaries');
  if(n===7)ok(svg.includes('HOLD')&&svg.includes('v1 → 6'),'odd antipode HOLD alongside valid mirror');
}
class E{constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.children=[];this.events={};this.attrs={};this.style={};this.value='';}append(...e){this.children.push(...e)}setAttribute(k,v){this.attrs[k]=v}addEventListener(k,f){this.events[k]=f}click(){this.events.click?.()}}
const doc={hidden:false,createElement:tag=>new E(tag,doc),addEventListener(){}},host=new E('section',doc),timers=new Map();let tid=0;
const win={A0BenchFinitePackages:M,setInterval:f=>{timers.set(++tid,f);return tid},clearInterval:id=>timers.delete(id),matchMedia:()=>({matches:false})};
const ui=V.mount(host,'antipode',win),all=e=>[e,...e.children.flatMap(all)],nodes=all(host),selects=nodes.filter(e=>e.tagName==='select');
selects[0].value='7';selects[0].events.change();ok(ui.command('CAPTURE').status==='HOLD','UI C7 antipode capture blocked');
ui.command('READ');selects[3].value='reflection';selects[3].events.change();ok(ui.snapshot().operator==='reflection','UI switches to C7 mirror');
ok(ui.command('CAPTURE').status==='CAPTURED','UI C7 mirror captures');const anchor=ui.snapshot();ui.command('STEP');
ok(ui.command('RETURN').status==='RETURN EXACT'&&M.canonical(ui.snapshot())===M.canonical(anchor),'UI C7 mirror Return exact');
ui.play();ok(timers.size===1,'UI C7 mirror plays');ui.pause();ok(timers.size===0,'UI pauses');
ok(M.replay(ui.exportRecord()).status==='PASS','UI export replays');
ok(nodes.some(e=>e.tagName==='a'&&e.href==='A0_BLUE_PINK_DODECA_CELL_RETURN.html#oneFlow'),'existing Blue/Pink Mobius return link mounted');
const native=require('./a0-one-flow.js');
ok(native.descriptors().length===6,'native source retains six AM/VM/PM outbound/return descriptors');
ok(native.triadReading(2,{ratio:'3:2',phaseDegrees:90},'mobius-paired').visibleIds.length===6&&M.reading(M.initial('antipode')).boundaryBand.tracks.length===3,'native six-band view not identified with three local tracks');
const css=fs.readFileSync(__dirname+'/a0-bench-finite-packages.css','utf8');
ok(css.includes('@media(max-width:760px)')&&css.includes('grid-template-columns:1fr'),'stacked mobile comparison');
console.log(JSON.stringify({status:'PASS',checks,scope:'mirror/C7, three-track seam, v1 compatibility, v2 replay/tamper and actual UI handlers in simulated DOM; no browser pixel acceptance'}));
