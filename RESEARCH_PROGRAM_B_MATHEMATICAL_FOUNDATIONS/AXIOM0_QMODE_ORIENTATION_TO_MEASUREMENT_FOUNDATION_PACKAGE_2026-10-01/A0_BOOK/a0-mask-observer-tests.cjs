'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const M=require('./a0-mask-observer.js'),S=require('./a0-layered-pentagon-scene.js'),V=require('./a0-mask-observer-view.js'),A=require('./a0-mask-assembly.js'),C=require('./a0-compass-assembly.js');
let checks=0;const check=f=>{f();checks++;},near=(a,b)=>Math.abs(a-b)<1e-7;
const pent=M.frame(M.DEFAULT,0),square=M.frame({...M.DEFAULT,kind:'square',angle:45},0);
check(()=>assert.equal(pent.counts.edgeCrossings,10));
check(()=>assert.equal(pent.counts.crossingsPlusPivot,11));
check(()=>assert.equal(square.counts.edgeCrossings,8));
check(()=>assert.equal(square.counts.referenceCornersPlusCrossings,12));
check(()=>assert.equal(square.counts.crossingsPlusPivot,9));
check(()=>assert.equal(M.frame({...M.DEFAULT,kind:'square',angle:0},0).counts.status,'HOLD_COINCIDENT_EDGES'));
check(()=>assert.equal(M.frame({...M.DEFAULT,phase:0,angle:0},0).counts.status,'HOLD_COINCIDENT_EDGES'));
for(const word of ['LRRL','RLLR']){
  check(()=>assert.equal(M.excursion(word,120).value,0));
  check(()=>assert.equal(M.excursion(word,120).phase,0));
  check(()=>assert.equal(M.excursion(word,30).value,word==='LRRL'?-1:1));
}
for(const kind of ['pentagon','square'])for(const dx of [-.8,-.31,0,.43,.8])for(const dy of [-.8,0,.8])for(const angle of [0,36,45,89,180]){
  const c={...M.DEFAULT,kind,dx,dy,angle},f=M.frame(c,39);
  check(()=>assert.ok(near(S.area(f.overlap),f.windows.reduce((n,w)=>n+w.area,0))));
  check(()=>assert.ok(near(S.area(f.a),S.area(f.overlap)+f.differences.a.reduce((n,p)=>n+S.area(p),0))));
  check(()=>assert.ok(near(S.area(f.b),S.area(f.overlap)+f.differences.b.reduce((n,p)=>n+S.area(p),0))));
  for(const row of [...f.projection,f.probeProjection]){
    const a=[row.source[0]-f.observer[0],row.source[1]-f.observer[1]],b=[row.hit[0]-f.observer[0],row.hit[1]-f.observer[1]];
    check(()=>assert.ok(near(a[0]*b[1]-a[1]*b[0],0)));
    check(()=>assert.equal(row.hit[1],f.screenY));
    check(()=>assert.equal(row.admitted,f.windows.some(w=>w.screenInterval&&row.hit[0]>=w.screenInterval[0]-1e-8&&row.hit[0]<=w.screenInterval[1]+1e-8)));
  }
  check(()=>assert.equal(M.unique(f.cuts.points).length,f.cuts.points.length));
}
for(let i=0;i<=120;i++){
  const f=M.frame(M.DEFAULT,i),reverse=M.frame({...M.DEFAULT,word:'RLLR'},i);
  check(()=>assert.ok(near(f.excursion.value,-reverse.excursion.value)));
  check(()=>assert.deepEqual(f.fold.points[0],f.fold.points[0].map((v,k)=>M.loopPoint(0)[k]+f.pivot[k])));
}
check(()=>assert.ok(Array.from({length:121},(_,i)=>M.frame(M.DEFAULT,i)).some(f=>!f.probeProjection.admitted)));
check(()=>assert.ok(Array.from({length:121},(_,i)=>M.frame(M.DEFAULT,i)).some(f=>f.probeProjection.admitted)));
const moved=M.frame({...M.DEFAULT,dx:.65},0);
check(()=>assert.notDeepEqual(moved.windows,pent.windows));
check(()=>assert.notDeepEqual(moved.probeProjection,pent.probeProjection));
check(()=>assert.deepEqual(M.frame({...M.DEFAULT,fold:false},0).projection,pent.projection));
let state=M.create();
check(()=>assert.throws(()=>M.apply(state,'RETURN')));
state=M.apply(state,'STEP');state=M.apply(state,'CAPTURE');const anchor=JSON.parse(JSON.stringify(state.anchor));
state=M.apply(state,'SET',{dx:.5,kind:'square',angle:45});state=M.apply(state,'STEP');state=M.apply(state,'RETURN');
check(()=>assert.deepEqual({config:state.config,tick:state.tick,history:state.history},anchor));
check(()=>assert.deepEqual(state.anchor,anchor));
const record=M.record(state);check(()=>assert.equal(M.verify(record).status,'PASS'));
for(const mutate of [
  r=>{r.derived.probeProjection.admitted=!r.derived.probeProjection.admitted;},
  r=>{r.state.config.dx=5;},r=>{r.state.tick=121;},
  r=>{r.state.history[0].observation.admitted=!r.state.history[0].observation.admitted;},
  r=>{r.state.anchor.tick=-1;},r=>{r.wholeMachineReturn=true;},
  r=>{r.schema='other';},r=>{r.extra=true;}
]){
  const r=JSON.parse(JSON.stringify(record));mutate(r);check(()=>assert.equal(M.verify(r).status,'INVALID'));
}
check(()=>assert.throws(()=>M.apply(state,'SET',{unknown:1})));
check(()=>assert.throws(()=>M.apply(state,'SET',{word:'LLLL'})));
check(()=>assert.throws(()=>M.apply(state,'TICK',NaN)));
for(let i=0;i<135;i++)state=M.apply(state,'TICK',i%121);
check(()=>assert.equal(state.history.length,128));
const final=M.apply(state,'TICK',120);check(()=>assert.throws(()=>M.apply(final,'STEP')));
check(()=>assert.equal(M.create().tick,0));
function el(){return {value:'',checked:false,disabled:false,textContent:'',innerHTML:'',events:{},attrs:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,v){this.events[k]=v;},click(){this.events.click?.({target:this});}};}
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
const ids=[...html.matchAll(/id="(mask[^"]*)"/g)].map(x=>x[1]),elements=Object.fromEntries(ids.map(x=>[x,el()]));
const doc={hidden:false,events:{},getElementById:id=>elements[id]||null,addEventListener(k,v){this.events[k]=v;},createElement:()=>el()};
let interval=null,reduced=false;const win={setInterval:fn=>{interval=fn;return 1;},clearInterval:()=>{interval=null;},setTimeout:fn=>fn(),matchMedia:()=>({matches:reduced}),URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob:class{},A0LayeredSceneView:{exportState:()=>({pose:{phase:72}})}};
const ui=V.mount(doc,win);
check(()=>assert.equal(interval,null));
check(()=>assert.ok(elements.maskTopSvg.innerHTML.includes('data-mask-fold-layer="top"')));
elements.maskSquare.click();check(()=>assert.equal(ui.state.config.kind,'square'));
check(()=>assert.equal(M.frame(ui.state.config,0).counts.referenceCornersPlusCrossings,12));
elements.maskCapture.click();elements.maskStep.click();elements.maskReturn.click();
check(()=>assert.equal(ui.state.tick,0));
elements.maskPlay.click();check(()=>assert.ok(interval));
interval();check(()=>assert.equal(ui.state.tick,1));elements.maskPlay.click();check(()=>assert.equal(interval,null));
elements.maskDx.value='.4';elements.maskDx.events.input();check(()=>assert.equal(ui.state.config.dx,.4));
elements.maskTakePhase.click();check(()=>assert.equal(ui.state.config.phase,72));
check(()=>assert.equal(ui.state.config.kind,'pentagon'));
elements.maskFold.checked=false;elements.maskFold.events.change();check(()=>assert.ok(!elements.maskTopSvg.innerHTML.includes('data-mask-fold-layer="top"')));
elements.maskPlay.click();doc.hidden=true;doc.events.visibilitychange();check(()=>assert.equal(interval,null));
reduced=true;elements.maskPlay.click();check(()=>assert.equal(interval,null));check(()=>assert.match(elements.maskStatus.textContent,/Reduzierte/));
elements.maskExport.click();check(()=>assert.equal(C.verify(JSON.parse(elements.maskRecord.textContent)).status,'PASS'));
check(()=>assert.equal(V.mount({getElementById:()=>null}),null));
const drawing=V.draw(pent,[]);
check(()=>assert.ok(drawing.top.lastIndexOf('data-mask-fold-layer')>drawing.top.lastIndexOf('AUFSICHT')));
const pkg=JSON.parse(fs.readFileSync('assets/a0-mask-observer-v1.json'));
for(const p of pkg.sources)check(()=>assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p.path)).digest('hex'),p.sha256,p.path));
for(const id of ids)check(()=>assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1));
check(()=>assert.ok(html.includes('a0-mask-observer-view.js?rev=20261020-clock-r1')));
console.log(JSON.stringify({status:'PASS',checks,browserAcceptance:false,scope:'model, computed masks/projection, saved-state checks and mounted handler doubles; no browser pixels, optics or recovered 3D fold'}));
