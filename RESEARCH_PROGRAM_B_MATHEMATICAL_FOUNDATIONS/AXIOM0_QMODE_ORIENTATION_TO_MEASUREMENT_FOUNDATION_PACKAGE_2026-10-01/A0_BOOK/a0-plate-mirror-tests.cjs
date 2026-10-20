'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R=require('./a0-plate-mirror-reference.js'),V=require('./a0-plate-mirror-view.js'),O=require('./a0-one-flow.js'),M=require('./a0-game-of-numbers-model.js'),G=require('./a0-bench-fold-guide.js'),MaskView=require('./a0-mask-observer-view.js');
let checks=0;const ok=(v,m)=>{checks++;assert.ok(v,m);},near=(a,b)=>Math.abs(a-b)<1e-12;
const stopContract=JSON.stringify(M.MIXER_FOLD_STOPS),curves=JSON.stringify(O.curves('plates')),initialNodes=JSON.stringify(R.planar(0).nodes);
for(let phase=0;phase<=360;phase++){
 const r=R.snapshot(phase),p=r.point,q=r.mirror,[n1,n2]=r.nodes;
 ok(JSON.stringify(r.nodes)===initialNodes,'fixed reference nodes');
 ok(near(n1[0]*n2[0]+n1[1]*n2[1],0),'orthogonal reference rays');
 ok(near(Math.hypot(...n1),1)&&near(Math.hypot(...n2),1),'unit-circle nodes');
 ok(p[0]===q[0]&&p[1]===-q[1],'horizontal planar reflection');
 ok(JSON.stringify(r.plates.curves)===curves,'reuse native plate surface');
 const [upper,lower]=r.plates.nodes;
 ok(upper[0]===lower[0]&&upper[1]===lower[1]&&upper[2]===-lower[2],'native z reflection differs from planar y reflection');
 ok(JSON.stringify(upper)===JSON.stringify(O.plate(1,1,phase*Math.PI/180)),'actual native plate probe');
 const record=V.record(phase,'mixer');ok(V.verify(record).status==='PASS','recomputed source geometry record');
 const bad=JSON.parse(JSON.stringify(record));bad.geometry.nodes[0][0]+=.01;ok(V.verify(bad).status==='INVALID','node tamper rejected');
 const svg=R.referenceDrawing(r),guide=G.drawing(phase);
 ok((svg.match(/data-ref-node=/g)||[]).length===2,'two auxiliary reference nodes');
 ok(guide.includes('45° · REFERENZ')&&(guide.match(/data-crown=/g)||[]).length===20,'guide gains reference without new crown');
 ok(!/NaN|undefined|Infinity/.test(svg+R.plateDrawing(r)),'finite SVG');
}
ok(JSON.stringify(M.MIXER_FOLD_STOPS)===stopContract,'fold law byte-equivalent data');
for(const bad of [-1,361,NaN,Infinity]){assert.throws(()=>R.planar(bad));checks++;}
ok(!R.referenceDrawing(R.planar(),{reference:false}).includes('data-ref-node='),'reference off');
ok((R.referenceDrawing(R.planar(),{mirror:false}).match(/data-ref-node=/g)||[]).length===1,'mirror off removes mirrored node');
class El{
 constructor(){this.value='';this.checked=false;this.disabled=false;this.events={};this.attrs={};this.innerHTML='';this.children=[];}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k];}addEventListener(k,fn){(this.events[k]??=[]).push(fn);}
 fire(k,event={target:this}){if(!this.disabled)for(const fn of this.events[k]||[])fn(event);}click(){this.fire('click');}scrollIntoView(){}
}
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8'),ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]),els=Object.fromEntries(ids.map(id=>[id,new El()]));
const docEvents={},doc={getElementById:id=>els[id]||null,createElement:()=>new El(),addEventListener:(id,fn)=>docEvents[id]=fn};
let timer=null,timersStarted=0,exported=null;const lens={phase:232};
const win={setInterval(fn){timersStarted++;timer=fn;return 1;},clearInterval(){timer=null;},setTimeout:fn=>fn(),matchMedia:()=>({matches:false}),URL:{createObjectURL(blob){exported=JSON.parse(blob.parts[0]);return'blob:test';},revokeObjectURL(){}},Blob:class{constructor(parts){this.parts=parts;}},A0BenchLensReturnController:{get state(){return lens;}}};
const native=MaskView.mount(doc,win);win.A0MaskObserverController=native;
els.plateMirrorSource.value='mixer';els.plateMirrorReference.checked=els.plateMirrorEnabled.checked=true;
const view=V.mount(doc,win);ok(timer===null&&timersStarted===0,'no automatic clock');ok(view.record().sourcePhase===232,'mixer source phase');
const before=JSON.stringify(native.state);els.plateMirrorEnabled.checked=false;els.plateMirrorEnabled.fire('change');ok(before===JSON.stringify(native.state),'view toggle never writes source');els.plateMirrorEnabled.checked=true;
els.plateMirrorSource.value='mask';els.plateMirrorSource.fire('change');ok(view.record().sourcePhase===0,'explicit source change');
let notifications=0;const unsubscribe=native.subscribe(state=>{notifications++;state.tick=999;});ok(native.state.tick===0,'observer receives isolated copy');
els.plateMirrorPlay.click();ok(timersStarted===1&&timer!==null,'actual native mask clock used');
for(let tick=1;tick<=120;tick++){timer();ok(native.state.tick===tick&&view.record().sourcePhase===tick*3,'real native animation frame');ok(JSON.stringify(view.record().geometry.nodes)===initialNodes,'fixed refs during animation');}
ok(timer===null&&notifications>=121,'native endpoint pauses; all source frames observed');
els.plateMirrorStep.click();ok(native.state.tick===120,'disabled native endpoint step is no-op');
native.command('TICK',30);els.plateMirrorCapture.click();const saved=native.state;els.plateMirrorStep.click();ok(native.state.tick===31,'actual native Step');els.plateMirrorReturn.click();ok(native.state.tick===30&&view.record().sourcePhase===90,'actual native Return reflected in view');
ok(native.state.config.kind===saved.config.kind,'no reference changes to source mask kind');
els.plateMirrorExport.click();ok(V.verify(exported).status==='PASS','actual exported record verifies');
const phase=view.record().sourcePhase;view.destroy();native.command('TICK',42);ok(view.record().sourcePhase===phase,'unsubscribe stops observation');unsubscribe();
const sourceState=native.state;assert.throws(()=>native.subscribe(state=>{state.tick=7;throw Error('bad observer');}));checks++;ok(JSON.stringify(native.state)===JSON.stringify(sourceState),'bad observer leaves source intact');
const beforeTimers=timersStarted;assert.throws(()=>native.subscribe(null));checks++;ok(timersStarted===beforeTimers,'observer API adds no timers');
for(const f of ['a0-plate-mirror-reference.js','a0-plate-mirror-view.js'])ok(!/setInterval|setTimeout|requestAnimationFrame/.test(fs.readFileSync(path.join(__dirname,f),'utf8')),'no extra clock '+f);
ok(html.indexOf('src="a0-plate-mirror-reference.js')<html.indexOf('src="a0-bench-fold-guide.js'),'reference dependency before guide');
ok(html.indexOf('src="a0-mask-observer-view.js')<html.indexOf('src="a0-plate-mirror-view.js'),'native player before subscriber');
console.log(JSON.stringify({status:'PASS',checks,phases:361,native_animation_steps:120,browserAcceptance:false,scope:'native plate curves, exact planar mirrors, existing fold law, actual native mask timer and observer lifecycle on DOM doubles'}));
