'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const L=require('./a0-layered-pentagon-scene.js'),W=require('./a0-phase-wiring.js'),O=require('./a0-projection-overlay.js');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
for(let phase=0;phase<=360;phase+=2){
  const pose=L.snapshot(phase),f=W.frame(pose);
  eq(f.phase,phase);eq(f.pentagonPose,pose);eq(f.resonator.pentagons.length,5);eq(f.euler.nodes.length,41);
  eq(f.resonator.nodes.map(x=>x.value),f.euler.nodes.map(x=>x.value));eq(f.euler.nodes.filter(n=>n.composite).map(n=>n.value),[1681]);
  ok(Math.abs(Math.hypot(...f.resonator.marker)-f.resonator.ringRadius)<1e-9);
  for(const kind of ['resonator','euler']){const svg=W.svgFrame(f,kind,[{marker:f.resonator.marker}]);ok(!/NaN|undefined|Infinity/.test(svg));ok(svg.includes('data-phase="'+phase+'"'));}
  const decoded=JSON.parse(JSON.stringify(f));eq(W.svgFrame(decoded,'euler'),W.svgFrame(f,'euler'),'JSON replay');
}
eq(W.displayColour(0,1),'#4ea8de');eq(W.displayColour(1,1),'#46dc96');
ok(/^#([0-9a-f]{2})\1\1$/.test(W.displayColour(.4,0)),'grey is arithmetic display mean');
for(const o of [{frequency:0},{frequency:11},{energy:101},{tint:-1},{colour:NaN}]){assert.throws(()=>W.options(o));checks++;}
assert.throws(()=>W.svgFrame(W.frame(L.snapshot()),'bad'));checks++;
const first=W.frame(L.snapshot()),end=W.frame(L.snapshot(360));ok(JSON.stringify(first.euler.nodes)!==JSON.stringify(end.euler.nodes),'end phase is NOT an automatic full view return');
function element(value=''){
  return{value,checked:true,disabled:false,dataset:{},attributes:{},events:{},innerHTML:'',textContent:'',setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){(this.events[k]??=[]).push(fn);},emit(k){for(const f of this.events[k]||[])f({target:this});},click(){this.emit('click');},after(){},};
}
const ids={},els={};for(const k of ['capture','step','play','pause','return','export','phase','frequency','energy','tint','colour','status','resonator','euler','pentagon','record'])els[k]=element(({phase:'0',frequency:'3',energy:'50',tint:'0',colour:'1'})[k]||'');
const host=element();host.querySelector=s=>els[s.match(/"([^"]+)"/)[1]];ids.phaseWiring=host;
for(const k of ['Play','Reset','Phase','Motion','Repeat','Status','Zoom','FocusOffset'])ids['layerScene'+k]=element(({Phase:'0',Motion:'counter',Zoom:'13/8',FocusOffset:'0'})[k]||'');
ids.layerSceneRepeat.checked=false;ids.projectionOverlaySource=element('stack');
for(const k of Object.keys(L.layerDefaults))ids['layerScene_'+k]=element();
const events={},doc={hidden:false,getElementById:id=>ids[id],createElement:()=>element(),addEventListener(k,f){(events[k]??=[]).push(f);}};
let timer=null,timerCount=0,maxTimers=0,hook=0;
const clock={setInterval(fn,ms){ok(timer===null,'only existing source timer');eq(ms,40);timer=fn;timerCount++;maxTimers=Math.max(maxTimers,timerCount);return 1;},clearInterval(){if(timer){timerCount--;timer=null;}}};
const store=O.createStore(),source=L.mount(doc,r=>store.accept('stack',r),clock);source.beforePlay=()=>hook++;
let exported=0;const win={A0LayeredSceneView:source,Blob,URL:{createObjectURL(){exported++;return'blob:test';},revokeObjectURL(){}}};
const view=W.mount(doc,win);ok(!!view);eq(W.mount(doc,win),null);eq(timer,null,'paused on load');
eq(view.snapshot().sourceScope.pose.phase,0);
view.send('capture');view.send('step');eq(source.exportState().pose.phase,2);eq(view.snapshot().current.phase,2);
eq(store.read('stack').current.scene.phase,2,'original overlay receives actual source frame');
ok(els.resonator.innerHTML.includes('data-phase="2"')&&els.euler.innerHTML.includes('data-phase="2"'));
ok(els.pentagon.innerHTML.includes('wire-stack-nested')&&!els.pentagon.innerHTML.includes('id="stack-nested"'),'clip IDs cannot collide with original overlay');
els.play.click();ok(timer!==null);for(let i=0;i<45;i++)timer();eq(view.snapshot().current.phase,92);els.pause.click();eq(timer,null);
els.return.click();ok(view.snapshot().returnWitness.pass);eq(source.exportState().pose.phase,0);eq(view.snapshot().history.length,1,'own history restored');
source.setPhase(17);eq(view.snapshot().returnWitness,null,'external source mutation invalidates Return claim');
ids.layerSceneMotion.value='together';ids.layerSceneZoom.value='21/13';ids.layerSceneFocusOffset.value='.25';ids.layerSceneRepeat.checked=true;ids.layerScene_a.checked=false;source.render();
els.energy.value='70';els.energy.emit('input');view.send('capture');
const anchor=view.snapshot().anchor;
view.send('phase',220);ids.layerSceneMotion.value='counter';ids.layerSceneZoom.value='1';ids.layerScene_a.checked=true;source.render();els.tint.value='1';els.tint.emit('input');
view.send('return');ok(view.snapshot().returnWitness.pass);eq(W.scope(source.exportState()),anchor.source);eq(view.snapshot().viewOptions.energy,70);eq(view.snapshot().viewOptions.tint,0);eq(ids.layerScene_a.checked,false);
view.send('phase',999);eq(view.snapshot().status,'HOLD');eq(timer,null);view.send('step');eq(source.exportState().pose.phase,17,'no mutation while HOLD');view.send('read');eq(view.snapshot().status,'LOCAL_PHASE_READBACK');
const setter=source.setPhase;source.setPhase=()=>{};view.send('phase',30);eq(view.snapshot().status,'HOLD','false source readback rejected');source.setPhase=setter;view.send('read');
source.setPhase(0);for(let i=0;i<80;i++)view.send('step');eq(view.snapshot().history.length,64);ok(view.snapshot().dropped>0);
view.send('play');doc.hidden=true;for(const f of events.visibilitychange)f();eq(timer,null,'hidden stops same source clock');eq(maxTimers,1);
doc.hidden=false;els.export.click();eq(exported,1);ok(view.snapshot().audit.length<=128);
const saved=view.snapshot();saved.history.length=0;ok(view.snapshot().history.length>0,'detached export');
view.send('return');
const verify=require('./a0-phase-wiring-run-verify.cjs').verify,returned=view.snapshot();
eq(verify(returned).status,'PASS','scoped exported run verifies');
for(const mutate of [r=>r.current.phase++,r=>r.history.at(-1).marker[0]++,r=>r.returnWitness.pass=false,r=>r.sourceScope.pose.phase++,r=>r.viewOptions.energy++,r=>r.evidence.nativeFaceBinding=true]){
  const altered=JSON.parse(JSON.stringify(returned));mutate(altered);eq(verify(altered).status,'FAIL','tampered or promoted export rejected');
}
for(const v of Object.values(view.snapshot().evidence))eq(v,false,'no native/science/browser promotion');
ok(hook>0,'existing beforePlay interlock reused');eq(W.mount({getElementById:()=>null},win),null);
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');ok(html.includes('id="phaseWiring"')&&html.includes('a0-phase-wiring.js'));
ok(!/setInterval|requestAnimationFrame|eval\(|new Function|fetch\(|postMessage/.test(fs.readFileSync(path.join(__dirname,'a0-phase-wiring.js'),'utf8')),'adapter creates no independent timer/network/evaluator');
const packageBlock=html.slice(html.indexOf('id="wiringPackage"'),html.indexOf('<section id="phaseWiring"'));
for(const m of packageBlock.matchAll(/(?:href|src)="([^"]+)"/g)){
  const u=new URL(m[1],'file://'+__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html'),f=decodeURIComponent(u.pathname);
  ok(fs.existsSync(f),'package target '+m[1]);
  if(u.hash)ok(fs.readFileSync(f,'utf8').includes('id="'+u.hash.slice(1)+'"'),'package anchor '+u.hash);
}
const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/a0-phase-wiring-package-v1.json'),'utf8')),crypto=require('node:crypto');
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const f of receipt.implementationFiles)eq(hash(path.resolve(__dirname,f.path)),f.sha256,'local implementation pin');
for(const f of receipt.visuals){eq(hash(path.resolve(__dirname,f.path)),f.sha256);eq(hash(f.originalPath),f.sha256,'unchanged owner image copy');}
for(const f of receipt.originalSources)eq(hash(f.path),f.sha256,'unchanged original HTML');
for(const v of Object.values(receipt.authority))eq(v,false);
ok(receipt.connections.some(x=>x.status==='HOLD_ADDRESS_MAP_UNDEFINED'),'grid gap remains explicit');
console.log(JSON.stringify({status:'PASS',checks,clock:'actual existing layered clock in simulated DOM',maxTimers,readback:true,scopedReturn:true,browserAcceptance:false}));
