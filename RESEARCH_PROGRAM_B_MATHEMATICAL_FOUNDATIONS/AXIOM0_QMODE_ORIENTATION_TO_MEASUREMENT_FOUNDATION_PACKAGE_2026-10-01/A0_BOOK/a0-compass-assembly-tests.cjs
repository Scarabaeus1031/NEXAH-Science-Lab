'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const A=require('./a0-mask-assembly.js'),M=require('./a0-mask-observer.js'),C=require('./a0-compass-assembly.js'),F=require('./a0-fold-lag-lens.js'),V=require('./a0-mask-observer-view.js');
let checks=0;const check=fn=>{fn();checks++;},near=(a,b)=>Math.abs(a-b)<1e-9;
for(let tick=0;tick<=120;tick++)for(const plane of ['AM','VM','PM']){
  const s={...A.create(),tick,assembly:{...A.defaults,plane}},r=C.snapshot(s),source=A.snapshot(s).planes.find(p=>p.id===plane),fold=F.snapshot(Math.round(tick*28/120),{mode:'target',lag:3,mirror:'none'});
  check(()=>assert.deepEqual(r.tip,source.point));
  check(()=>assert.deepEqual(r.shadow,source.shadow));
  check(()=>assert.deepEqual(r.fold.facets,fold.facets));
  check(()=>assert.equal(r.fold.turn,fold.turn));
  check(()=>assert.equal(r.crosses.length,Math.min(4,Math.floor(tick/3)+1)));
  check(()=>assert.deepEqual(r.crosses[0].point,r.tip));
  check(()=>assert.equal(r.selectionRing.slice,Math.round(tick*28/120)));
  if(r.length<1e-9)check(()=>assert.equal(r.direction,null));
  else check(()=>assert.ok(near(Math.cos(r.direction),r.tip[0]/r.length)&&near(Math.sin(r.direction),r.tip[1]/r.length)));
}
const zero={...A.create(),tick:45,assembly:{...A.defaults,plane:'VM'}};
check(()=>assert.equal(C.snapshot(zero).status,'HOLD_DIRECTION_UNDEFINED_AT_CENTRE'));
check(()=>assert.ok(!C.draw(zero).includes('data-compass-role="directed-needle"')));
const end=C.snapshot({...A.create(),tick:120});
check(()=>assert.equal(end.fold.turn,7));
check(()=>assert.equal(end.fold.facets.length,4));
check(()=>assert.ok(end.boundary.includes('not an exact fold return')));
let state=A.create();state=A.apply(state,'TICK',17);state=A.apply(state,'ASSEMBLY',{plane:'PM',rotation:90});state=A.apply(state,'CAPTURE');
const captured=C.record(state);state=A.apply(state,'STEP');state=A.apply(state,'ASSEMBLY',{plane:'AM',rotation:270});state=A.apply(state,'RETURN');
check(()=>assert.deepEqual(C.record(state),captured));
check(()=>assert.equal(C.verify(captured).status,'PASS'));
check(()=>assert.equal(C.verify(A.record(A.create())).status,'PASS'));
check(()=>assert.equal(C.verify(M.record(M.create())).status,'PASS'));
for(const mutate of [r=>r.compass.direction=10,r=>r.compass.selectionRing.slice++,r=>r.compass.fold.turn++,r=>r.compass.tip[0]++,r=>r.assembly.derived.signals[0]++,r=>r.extra=true,r=>r.wholeMachineReturn=true]){
  const r=JSON.parse(JSON.stringify(captured));mutate(r);check(()=>assert.equal(C.verify(r).status,'INVALID'));
}
let trace=A.create();for(const tick of [4,17,2,15])trace=A.apply(trace,'TICK',tick);
trace=A.apply(trace,'ASSEMBLY',{plane:'VM'});
check(()=>assert.deepEqual(C.snapshot(trace).trace.map(h=>h.tick),[4,17,2,15]));
for(const h of C.snapshot(trace).trace)check(()=>assert.deepEqual(h.point,C.reading('VM',h.tick).point));
check(()=>assert.match(C.snapshot(trace).traceMeaning,/reprojected/));
const svg=C.draw(trace);
check(()=>assert.equal((svg.match(/data-compass-slice="/g)||[]).length,29));
check(()=>assert.ok(svg.includes('data-compass-role="original-5b-reference"')));
check(()=>assert.ok(svg.includes('vier unabhängige Flügel')));
check(()=>assert.ok(!svg.includes('NaN')&&!svg.includes('Infinity')));
function element(){return {value:'',checked:false,events:{},setAttribute(){},addEventListener(k,v){this.events[k]=v;},click(){this.events.click?.({target:this});}};}
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),ids=[...html.matchAll(/id="(mask[^"]*)"/g)].map(x=>x[1]),els=Object.fromEntries(ids.map(id=>[id,element()]));
let timer=null,count=0;
const win={setInterval:fn=>{timer=fn;count++;return 1;},clearInterval:()=>timer=null,setTimeout:fn=>fn(),matchMedia:()=>({matches:false}),URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob:class{},A0LayeredSceneView:{exportState:()=>({pose:{phase:0}})}};
const doc={getElementById:id=>els[id]||null,addEventListener(){},createElement:element},ui=V.mount(doc,win);
check(()=>assert.equal(count,0));
function event(slice,key){return {key,target:{closest:()=>({dataset:{compassSlice:String(slice)}})},preventDefault(){}};}
for(let z=0;z<=28;z++){
  els.maskCompassSvg.events.click(event(z));
  check(()=>assert.equal(C.snapshot(ui.state).selectionRing.slice,z));
  check(()=>assert.equal(ui.state.tick,Math.round(z*120/28)));
}
els.maskCompassSvg.events.keydown(event(7,'Enter'));check(()=>assert.equal(C.snapshot(ui.state).selectionRing.slice,7));
els.maskCompassSvg.events.keydown(event(9,' '));check(()=>assert.equal(C.snapshot(ui.state).selectionRing.slice,9));
const before=ui.state;els.maskCompassSvg.events.click(event(999));check(()=>assert.deepEqual(ui.state,before));
els.maskCapture.click();els.maskStep.click();els.maskReturn.click();check(()=>assert.deepEqual(ui.state,{...before,anchor:ui.state.anchor,assemblyAnchor:ui.state.assemblyAnchor,droppedAnchor:ui.state.droppedAnchor}));
els.maskPlay.click();check(()=>assert.equal(count,1));timer();els.maskPlay.click();check(()=>assert.equal(timer,null));
check(()=>assert.equal(C.verify(ui.record()).status,'PASS'));
els.maskExport.click();check(()=>assert.equal(C.verify(JSON.parse(els.maskRecord.textContent)).status,'PASS'));
const pkg=JSON.parse(fs.readFileSync('assets/a0-compass-assembly-v1.json')),audit=JSON.parse(fs.readFileSync('assets/a0-demonstrator-connection-audit-2026-10-19.json'));
for(const item of [...pkg.sources,...audit.sources])check(()=>assert.equal(crypto.createHash('sha256').update(fs.readFileSync(item.path)).digest('hex'),item.sha256,item.path));
check(()=>assert.equal(audit.complete_ecosystem_census,false));
check(()=>assert.equal(audit.canonical_count_effect,0));
check(()=>assert.ok(audit.rows.some(r=>r.id==='takeaway'&&r.missing.includes('hinge'))));
check(()=>assert.ok(html.includes('id="maskCompassTitle"')));
check(()=>assert.ok(html.indexOf('src="a0-fold-lag-lens.js"')<html.indexOf('src="a0-compass-assembly.js')));
(async()=>{
  const initial=JSON.stringify(ui.state),target={files:[{size:100,text:async()=>JSON.stringify(ui.record())}],value:'selected'};
  await els.maskImport.events.change({target});
  check(()=>assert.equal(JSON.stringify(ui.state),initial));
  check(()=>assert.match(els.maskStatus.textContent,/PASS/));
  const bad={files:[{size:3000000,text:async()=>{throw Error('must not read');}}],value:'selected'};
  await els.maskImport.events.change({target:bad});
  check(()=>assert.match(els.maskStatus.textContent,/INVALID/));
  check(()=>assert.equal(JSON.stringify(ui.state),initial));
  console.log(JSON.stringify({status:'PASS',checks,browserAcceptance:false,scope:'original needle readings, source 5B poses, ring selection handlers and keyboard, separate temporal/reference/retained traces, scoped saved state and read-only legacy imports'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
