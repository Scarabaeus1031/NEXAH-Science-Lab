'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const A=require('./a0-mask-assembly.js'),M=require('./a0-mask-observer.js'),O=require('./a0-one-flow.js');
const C=require('./a0-compass-assembly.js');
let checks=0;const check=f=>{f();checks++;},near=(a,b)=>Math.abs(a-b)<1e-8;
for(let tick=0;tick<=120;tick++){
  const s={...A.create(),tick},r=A.snapshot(s),f=M.frame(s.config,tick),t=tick/120*2*Math.PI;
  const signals=[Math.sin(3*t),Math.sin(2*t+Math.PI/2),Math.sin(t+Math.PI/4)];
  check(()=>assert.deepEqual(r.signals,signals));
  check(()=>assert.equal(r.sourceTick,tick));
  for(let i=0;i<3;i++){
    const pair=[[0,1],[1,2],[2,0]][i];
    check(()=>assert.deepEqual(r.planes[i].point,pair.map(k=>signals[k])));
    check(()=>assert.deepEqual(r.planes[i].shadow,[signals[pair[0]],0]));
    check(()=>assert.ok(near(Math.hypot(...r.planes[i].plate.slice(0,2)),Math.hypot(...r.planes[i].point)/Math.sqrt(2))));
  }
  const loop=M.loopPoint(t);
  check(()=>assert.ok(r.lens.center.every((x,k)=>near(x,loop[k]+f.pivot[k]))));
  check(()=>assert.equal(r.band.u,2*t));
  check(()=>assert.deepEqual(r.gate,f.probeProjection));
}
const start=A.snapshot(A.create()),end=A.snapshot({...A.create(),tick:120});
check(()=>assert.ok(start.band.marker.every((x,k)=>near(x,end.band.marker[k]))));
check(()=>assert.ok(start.lens.center.every((x,k)=>near(x,end.lens.center[k]))));
check(()=>assert.ok(start.signals.every((x,k)=>near(x,end.signals[k]))));
let s=A.create();s=A.apply(s,'SET',{dx:.4});s=A.apply(s,'TICK',23);
const before=A.snapshot(s);
for(const rotation of [0,90,180,270]){
  const r=A.snapshot(A.apply(s,'ASSEMBLY',{rotation}));
  check(()=>assert.deepEqual(r.signals,before.signals));
  check(()=>assert.deepEqual(r.gate,before.gate));
  check(()=>assert.deepEqual(r.lens,before.lens));
}
const rotated=A.apply(s,'ASSEMBLY',{rotation:90,palette:'bronze'});
check(()=>assert.notEqual(A.draw(s),A.draw(rotated)));
const legacy=A.snapshot(A.apply(s,'ASSEMBLY',{lens:'legacy'})),time=s.tick/120*2*Math.PI,pivot=M.frame(s.config,s.tick).pivot;
check(()=>assert.ok(near(legacy.lens.center[0],.65*Math.sin(time)+pivot[0])));
check(()=>assert.ok(near(legacy.lens.center[1],.35*Math.sin(2*time)+pivot[1])));
check(()=>assert.notDeepEqual(legacy.lens.center,before.lens.center));
s=A.apply(s,'ASSEMBLY',{rotation:90,plane:'PM',palette:'bronze'});
s=A.apply(s,'CAPTURE');const captured=JSON.parse(JSON.stringify(s));
s=A.apply(s,'ASSEMBLY',{rotation:270,plane:'AM',lens:'legacy'});s=A.apply(s,'STEP');
s=A.apply(s,'RETURN');
check(()=>assert.deepEqual(s,captured));
check(()=>assert.equal(A.verify(A.record(s)).status,'PASS'));
check(()=>assert.equal(A.verify(M.record(M.create())).status,'PASS'));
for(const mutate of [
  r=>r.derived.signals[0]++,
  r=>r.assembly.rotation=45,
  r=>r.assemblyAnchor=null,
  r=>r.dropped=-1,
  r=>r.wholeMachineReturn=true,
  r=>r.derived.lens.center[0]++,
  r=>r.mask.derived.tick++,
  r=>r.extra=true
]){
  const r=A.record(s);mutate(r);check(()=>assert.equal(A.verify(r).status,'INVALID'));
}
check(()=>assert.throws(()=>A.apply(s,'ASSEMBLY',{frequency:5})));
check(()=>assert.throws(()=>A.apply(s,'ASSEMBLY',{rotation:45})));
let bounded=A.create();for(let i=0;i<160;i++)bounded=A.apply(bounded,'TICK',i%121);
check(()=>assert.equal(bounded.history.length,128));
check(()=>assert.equal(bounded.dropped,32));
bounded=A.apply(bounded,'CAPTURE');bounded=A.apply(bounded,'STEP');bounded=A.apply(bounded,'RETURN');
check(()=>assert.equal(bounded.dropped,32));
check(()=>assert.equal(A.verify(A.record(bounded)).status,'PASS'));
const context={A0TesaGridCandidate:require('./assets/a0-tesa-grid-candidate.js'),document:{getElementById:()=>null}};
context.window=context;vm.runInNewContext(fs.readFileSync('a0-one-flow.js','utf8'),context);
check(()=>assert.equal(typeof context.A0OneFlowModel.plate,'function'));
check(()=>assert.equal(context.A0OneFlow,undefined));
const draw=A.draw(s);
check(()=>assert.ok(draw.includes('data-assembly-layer="top"')));
check(()=>assert.ok(draw.includes('13/8 · derselbe Hintergrund')));
check(()=>assert.ok(draw.includes('AM')&&draw.includes('VM')&&draw.includes('PM')));
check(()=>assert.ok(!draw.includes('NaN')&&!draw.includes('Infinity')));
function element(){return {value:'',checked:false,events:{},attrs:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,v){this.events[k]=v;},click(){this.events.click?.({target:this});}};}
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),ids=[...html.matchAll(/id="(mask[^"]*)"/g)].map(x=>x[1]),els=Object.fromEntries(ids.map(id=>[id,element()]));
let active=null,createdTimers=0;
const win={setInterval:fn=>{active=fn;createdTimers++;return 1;},clearInterval:()=>active=null,setTimeout:fn=>fn(),matchMedia:()=>({matches:false}),URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob:class{},A0LayeredSceneView:{exportState:()=>({pose:{phase:0}})}};
const doc={getElementById:id=>els[id]||null,addEventListener(){},createElement:element},ui=require('./a0-mask-observer-view.js').mount(doc,win);
check(()=>assert.equal(createdTimers,0));
els.maskPlay.click();active();active();els.maskPlay.click();
check(()=>assert.equal(createdTimers,1));
check(()=>assert.equal(ui.state.tick,2));
els.maskAssemblyRotation.value='90';els.maskAssemblyRotation.events.change();
check(()=>assert.equal(ui.state.assembly.rotation,90));
check(()=>assert.equal(ui.state.tick,2));
els.maskCapture.click();const saved=ui.state;
els.maskAssemblyPalette.value='bronze';els.maskAssemblyPalette.events.change();els.maskStep.click();els.maskReturn.click();
check(()=>assert.deepEqual(ui.state,saved));
check(()=>assert.ok(els.maskAssemblySvg.innerHTML.includes('GEMEINSAMER LOKALER TICK')));
check(()=>assert.ok(ui.record().assembly.derived.planes.length===3));
els.maskExport.click();check(()=>assert.equal(C.verify(JSON.parse(els.maskRecord.textContent)).status,'PASS'));
const pkg=JSON.parse(fs.readFileSync('assets/a0-mask-assembly-v1.json'));
for(const x of pkg.sources)check(()=>assert.equal(crypto.createHash('sha256').update(fs.readFileSync(x.path)).digest('hex'),x.sha256,x.path));
for(const file of ['assets/a0-blue-pink-dodeca-cell-return-v1.js','a0-one-flow.js','a0-mask-assembly.js'])check(()=>assert.ok(html.indexOf('src="'+file)<html.indexOf('src="a0-mask-observer-view.js')));
console.log(JSON.stringify({status:'PASS',checks,browserAcceptance:false,scope:'shared local phase, original plate/band functions, exact lens path, 90-degree view, full saved state, bounded trace, browser model guard and mounted UI doubles'}));
