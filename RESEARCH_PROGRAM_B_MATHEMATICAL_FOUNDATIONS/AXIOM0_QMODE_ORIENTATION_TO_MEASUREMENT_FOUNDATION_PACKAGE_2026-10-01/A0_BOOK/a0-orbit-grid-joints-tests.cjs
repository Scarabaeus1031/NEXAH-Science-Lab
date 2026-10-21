const assert=require('node:assert/strict'),fs=require('node:fs'),J=require('./a0-orbit-grid-joints.js'),M=require('./a0-mask-observer.js'),O=require('./a0-one-flow.js'),T=require('./assets/a0-tesa-grid-candidate.js');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
for(const kind of ['pentagon','square'])for(const word of ['LRRL','RLLR'])for(const preset of Object.keys(J.PRESETS))for(let tick=0;tick<=120;tick++){
 const config={...M.DEFAULT,kind,word},before=JSON.stringify(config),r=J.reading(config,tick,preset),base=J.reading(config,tick,preset,'polygon');
 ok(JSON.stringify(config)===before,'read-only configuration');
 ok(J.verify(J.record(r)),'saved comparison recomputes');
 ok(!/NaN|Infinity/.test(J.drawing(r)),'finite SVG');
 ok(base.result.status=== (base.frame.probeProjection.admitted?'ADMITTED':'BLOCKED'),'polygon control matches source');
 if(r.result.hit)ok(r.result.hit.every(Number.isFinite),'finite projection');
 else ok(preset==='escape'&&tick>30,'bounded orbit end');
}
const f=M.frame(M.DEFAULT,0);
ok(J.project([0,-3.5],f).status==='HOLD_INVALID_PROJECTION','zero denominator');
ok(J.project([0,-4],f).status==='HOLD_INVALID_PROJECTION','behind observer');
ok(J.project([0,-3],f).status==='HOLD_INVALID_PROJECTION','screen beyond source');
ok(J.project([NaN,0],f).status==='HOLD_INVALID_POINT');
ok(J.reading(M.DEFAULT,31,'escape').result.status==='HOLD_ORBIT_END');
const bad=J.record(J.reading(M.DEFAULT,2));bad.reading.c[0]=1;ok(!J.verify(bad),'tampering rejected');
let mapped=0,excluded=[];
for(let n=1;n<=28;n++)for(const sign of [-1,1]){
 const r=J.plateCell(n,sign);
 if(r.point){mapped++;ok(r.returnedAddress===n,'center address roundtrip');ok(Math.abs(r.point[2]-sign*(.18+.55*(r.point[0]**2+r.point[1]**2)))<1e-12,'native plate');const opposite=J.plateCell(n,-sign);ok(r.point[0]===opposite.point[0]&&r.point[1]===opposite.point[1]&&r.point[2]===-opposite.point[2],'z reflection');}
 else {excluded.push(n);ok(r.status==='HOLD_OUTSIDE_PLATE_DISK'&&O.address(r.xy).address===n,'no address removed');}
 for(const neighbor of T.neighbors(n))ok(T.neighbors(neighbor).includes(n),'original abstract adjacency retained');
 ok(!/NaN|Infinity/.test(J.gridDrawing(n,sign)));
}
ok(mapped===48);ok([...new Set(excluded)].join(',')==='1,7,22,28');
assert.throws(()=>J.plateCell(29));checks++;
// Mounted consumer with actual model state and event handlers, not browser pixels.
class E{constructor(value=''){this.value=value;this.textContent='';this.innerHTML='';this.disabled=false;this.events={};}addEventListener(k,f){this.events[k]=f;}fire(k){this.events[k]();}}
const nodes={},el=n=>nodes[n]??=new E(),host=new E();host.querySelector=q=>el(q.match(/data-ogj-(.*)\]/)[1]);
el('source').value='orbit';el('preset').value='upper';el('address').value='14';el('sign').value='1';
let state={config:{...M.DEFAULT},tick:0},callback,clockCallback,owner=null,ready=false;
const source={get state(){return JSON.parse(JSON.stringify(state));},get clockOwner(){return owner;},subscribe(f){callback=f;f();return()=>{callback=null;};}};
const clock={get ready(){return ready;},subscribe(f){clockCallback=f;return()=>{clockCallback=null;};}};
const mounted=J.mount({getElementById:id=>id==='orbitGridJoints'?host:null},{A0MaskObserverController:source,A0MaskClockBench:clock});
ok(mounted.snapshot.tick===0);
const original=JSON.stringify(state);el('capture').fire('click');const held=JSON.stringify(mounted.held);state.tick=20;callback();ok(mounted.snapshot.tick===20&&JSON.stringify(mounted.held)===held);
el('source').value='polygon';el('source').fire('change');ok(mounted.snapshot.source==='polygon');
owner='source-clock';clockCallback();ok(mounted.snapshot===null&&el('capture').disabled&&el('drawing').innerHTML==='');
ready=true;clockCallback();ok(mounted.snapshot.tick===20);
el('address').value='1';el('address').fire('input');ok(el('grid-status').textContent.includes('HOLD_OUTSIDE'));
el('address').value='14';el('sign').value='-1';el('sign').fire('change');ok(el('grid-status').textContent.includes('MAPPED_CELL_CENTER'));
el('address').value='29';el('address').fire('input');ok(el('grid').innerHTML==='');
state.config.dx=NaN;callback();ok(mounted.snapshot===null);
mounted.dispose();ok(callback===null&&clockCallback===null);
ok(!/setInterval|setTimeout|requestAnimationFrame|postMessage/.test(fs.readFileSync('a0-orbit-grid-joints.js','utf8')),'no second clock or source writer');
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
ok(html.includes('id="orbitGridJoints"'));ok(html.indexOf('a0-mask-observer-view.js')<html.indexOf('a0-orbit-grid-joints.js'));ok(html.indexOf('assets/a0-flame-mandelbrot-formation-v1.js')<html.indexOf('a0-orbit-grid-joints.js')&&html.indexOf('assets/a0-tesa-grid-candidate.js')<html.indexOf('a0-one-flow.js'),'original factories receive dependencies before construction');
for(const file of ['A0_MATHEMATICAL_JOINTS.html','A0_GAME_OF_WORLDS_PLAY.html'])ok(fs.readFileSync(file,'utf8').includes('A0_ORIENTATION_CONTROLLER_BENCH.html#orbitGridJoints'),'navigation return');
console.log(JSON.stringify({status:'PASS',checks,plateCellCenters:{mappedPerSide:24,outside:[1,7,22,28]},browserAcceptance:false,scope:'Finite models, source invariance, original polygon control, record recomputation, actual mounted handlers with DOM double, held record, clock-loss HOLD, links. Not browser, physical, Ihara/Riemann or human-utility validation.'},null,2));
