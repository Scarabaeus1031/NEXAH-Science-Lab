'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),base=require('node:assert/strict');
let checks=0;
const assert=new Proxy(base,{get:(t,k)=>typeof t[k]==='function'?(...a)=>{checks++;return t[k](...a)}:t[k]});
const C=require('./a0-orientation-controller-bench.js'),R=require('./a0-root7-q4-coupling.js');
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
for(let tick=0;tick<16;tick++){
  const state=C.createRootSpaceEngine({tick}),before=JSON.stringify(state),r=R.snapshot(state,C),a=state.frame.q4Address;
  assert.equal(r.source.address,a);assert.equal(r.source.tick,tick);
  assert.deepEqual(r.metric.point,[2*(a&1),(a>>1)&1,(a>>2)&1,(a>>3)&1]);
  assert.deepEqual(r.encoding.signs,[0,1,2,3].map(bit=>2*((a>>bit)&1)-1));
  assert.equal(r.return.decodedAddress,a);assert.equal(r.metric.normSquared,4*(a&1)+((a>>1)&1)+((a>>2)&1)+((a>>3)&1));
  assert.equal(r.metric.isReferenceEndpoint,a===15);
  assert.equal(R.snapshot(state,C,'q3').source.activeNodeVisible,a<8);
  assert.equal(JSON.stringify(state),before,'view must not mutate source');
  assert.equal((R.drawing(r).match(/<circle /g)||[]).length,16);
}
for(let a=0;a<8;a++){
  const p=R.coordinates(a),q=R.coordinates(a^8);
  assert.equal(Math.hypot(...p.map((v,i)=>v-q[i])),1,'all eight w-matching edges have declared length one');
}
for(const direction of [1]){
  let state=C.createRootSpaceEngine(),bridges=0;
  for(let step=0;step<32;step++){
    state=C.stepRootSpaceEngine(state,direction);
    const r=R.snapshot(state,C);
    assert.equal(r.transition.type,state.history.at(-1).transitionType);
    assert.equal(r.transition.metricStep,r.transition.axis===0?2:1);
    assert.equal(r.return.decodedAddress,state.frame.q4Address);
    if(r.transition.type==='BRIDGE')bridges++;
  }
  assert.equal(bridges,4,'two bridge crossings per unchanged Gray lap');
  assert.equal(state.tick,0);
}
const targetTick=Array.from({length:16},(_,i)=>i).find(t=>C.rootSpaceEngineFrame(t).q4Address===15);
// Existing source API's reverse step labels 0000→1000 as internal axis 0.
// The UI has no reverse button. Preserve source behavior and fail closed.
assert.throws(()=>R.snapshot(C.stepRootSpaceEngine(C.createRootSpaceEngine(),-1),C),/invalid source transition/);
assert.deepEqual(R.snapshot(C.createRootSpaceEngine({tick:targetTick}),C).metric.point,[2,1,1,1]);
assert.equal(R.snapshot(C.createRootSpaceEngine({tick:targetTick}),C).metric.norm,Math.sqrt(7));
assert.throws(()=>R.snapshot(null,C));
assert.throws(()=>R.snapshot(C.createRootSpaceEngine(),null));
for(const mutate of [
 s=>s.carrierId='different',s=>s.frame.bits='1111',s=>s.frame.layer=7,s=>s.tick=NaN,
 s=>s.running='yes',s=>s.speedMs=0,s=>s.history=null,s=>s.cycles=-1,
 s=>s.history=[{fromTick:0,toTick:3,axis:0,bits:s.frame.bits}]
]){
 const s=C.createRootSpaceEngine();mutate(s);assert.throws(()=>R.snapshot(s,C));
}
assert.throws(()=>R.snapshot(C.createRootSpaceEngine(),C,'unknown'));
const code=fs.readFileSync(path.join(__dirname,'a0-root7-q4-coupling.js'),'utf8');
assert.doesNotMatch(code,/setInterval|setTimeout|requestAnimationFrame|fetch\(|postMessage|localStorage/);
const record=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/a0-root7-q4-coupling-v1.json'),'utf8'));
for(const source of record.sources){
 const bytes=fs.readFileSync(path.resolve(__dirname,source.path));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),source.sha256,'source hash: '+source.role);
}
assert.equal(record.authority.newStudy,false);
assert.equal(record.authority.sourceClosedRecordsModified,false);
for(const id of ['root7Coupling','root7Source','root7Signs','root7Point','root7Length','root7Transition','root7Return','root7Visibility','root7StretchSvg']){
 assert.ok(html.includes('id="'+id+'"'),'required DOM element '+id);
}
class Node{
 constructor(tag='div'){this.tag=tag;this.attrs={};this.dataset={};this.children=[];this.textContent='';this.innerHTML='';this.events={};this.classes=new Set();this.classList={add:x=>this.classes.add(x),contains:x=>this.classes.has(x),toggle:(x,v)=>v?this.classes.add(x):this.classes.delete(x)};}
 setAttribute(k,v){this.attrs[k]=String(v);}
 appendChild(n){this.children.push(n);return n;}
 replaceChildren(){this.children=[];}
 insertBefore(n){this.children.unshift(n);}
 get firstChild(){return this.children[0];}
 addEventListener(k,fn){this.events[k]=fn;}
 querySelector(selector){const m=selector.match(/^\[([^=]+)="([^"]+)"\]$/);return m?this.children.find(n=>n.attrs[m[1]]===m[2])||null:null;}
 click(){this.clicked=true;}
}
const ids=new Map(),doc={getElementById:id=>{if(!ids.has(id))ids.set(id,new Node());return ids.get(id);},createElement:tag=>new Node(tag)};
const modeButtons=['q3','double','q4','mask'].map(mode=>{const n=new Node('button');n.dataset.rootMode=mode;return n;});
const timers=new Map();let timerId=0,blob;
const context=vm.createContext({document:doc,window:{A0Root7Coupling:R,A0Root7Sections:require('./a0-root7-section-mirror.js'),A0Root7Book:require('./a0-root7-open-book.js')},C,
 $:doc.getElementById,qsa:()=>modeButtons,
 svgNode:(tag,attrs,text)=>{const n=new Node(tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text)n.textContent=text;return n;},
 setInterval:fn=>{timers.set(++timerId,fn);return timerId;},clearInterval:id=>timers.delete(id),
 setTimeout:()=>0,Blob:class{constructor(parts){blob=parts.join('');}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}}
});
const functions=html.slice(html.indexOf('  function rootPoint('),html.indexOf('  const familyStops='));
vm.runInContext("let root838Mode='q4';let rootEngineState=C.createRootSpaceEngine();let rootEngineTimer=null;"+functions,context);
const rootHandlers=html.split('\n').filter(l=>/\$\('rootEngine(Play|Step|Reset|Speed|Export)'\)\.addEventListener/.test(l)).join('\n');
vm.runInContext(rootHandlers+';renderRoot838();',context);
const sectionHandlers=html.split('\n').filter(l=>l.includes("['root7CutMode','root7CutPosition'")||l.includes("$('root7CutCenter').addEventListener")).join('\n');
vm.runInContext(sectionHandlers,context);
const bookHandlers=html.split('\n').filter(l=>l.includes("['root7BookMode','root7BookAngle'")||l.includes("[['root7BookClosed',0]")).join('\n');
vm.runInContext(bookHandlers,context);
const snap=()=>context.window.A0Root7CoupledRecord;
assert.equal(snap().source.tick,0);assert.match(ids.get('root7Source').textContent,/PAUSED/);
ids.get('rootEngineStep').events.click();assert.equal(snap().source.tick,1);assert.equal(timers.size,0);
ids.get('rootEnginePlay').events.click();assert.equal(snap().source.running,true);assert.equal(timers.size,1);
[...timers.values()][0]();assert.equal(snap().source.tick,2);
ids.get('rootEngineSpeed').value='320';ids.get('rootEngineSpeed').events.change();
assert.equal(snap().source.speedMs,320);assert.equal(snap().source.tick,2);assert.equal(timers.size,1);
ids.get('rootEnginePlay').events.click();assert.equal(snap().source.running,false);assert.equal(timers.size,0);
ids.get('rootEngineExport').events.click();
let exported=JSON.parse(blob);
assert.equal(exported.state.frame.bits,exported.viewAdapters.root7.source.bits);
assert.equal(exported.state.tick,exported.viewAdapters.root7.source.tick);
assert.equal(exported.viewAdapters.root7.encoding.rule,snap().encoding.rule);
ids.get('rootEngineReset').events.click();assert.equal(snap().source.tick,0);assert.equal(timers.size,0);assert.equal(snap().transition,null);
ids.get('root7CutMode').value='manual';ids.get('root7CutPosition').value='0.5';ids.get('root7CutPosition').events.input();
assert.equal(snap().sectionView.section.vertexCount,3);assert.equal(snap().source.tick,0);
ids.get('root7CutCenter').events.click();assert.equal(snap().sectionView.section.vertexCount,6);assert.equal(snap().sectionView.section.triangles.length,4);
ids.get('root7MirrorAngle').value='30';ids.get('root7MirrorOrder').value='BA';ids.get('root7MirrorOrder').events.input();
assert.equal(snap().sectionView.mirrors.rotationDegrees,-60);assert.equal(timers.size,0);
ids.get('rootEngineExport').events.click();exported=JSON.parse(blob);assert.deepEqual(exported.viewAdapters.root7.sectionView,snap().sectionView);
ids.get('root7CutMode').value='follow';ids.get('root7CutMode').events.input();ids.get('rootEngineStep').events.click();
assert.equal(snap().sectionView.section.t,0.2);assert.equal(snap().sectionView.sourceTick,1);assert.equal(timers.size,0);
ids.get('rootEngineExport').events.click();exported=JSON.parse(blob);assert.deepEqual(exported.viewAdapters.root7.sectionView,snap().sectionView,'follow-mode export equals rendered view');
ids.get('rootEngineReset').events.click();assert.equal(snap().sectionView.section.t,0);
ids.get('root7BookFlat').events.click();assert.equal(snap().bookView.options.angle,180);assert.equal(snap().bookView.geometry.flatOutline,'HEXAGON_WITH_TWO_COLLINEAR_HINGE_WITNESSES');
ids.get('root7BookClosed').events.click();assert.equal(snap().bookView.options.angle,0);assert.equal(snap().source.tick,0);
ids.get('root7BookOpen').events.click();assert.equal(snap().bookView.options.angle,120);
ids.get('root7BookFocus').value='left';ids.get('root7BookFocus').events.input();assert.equal(snap().bookView.options.focus,'left');assert.equal(timers.size,0);
ids.get('root7BookMode').value='follow';ids.get('root7BookMode').events.input();ids.get('rootEngineStep').events.click();assert.equal(snap().bookView.options.angle,22.5);
ids.get('rootEngineExport').events.click();exported=JSON.parse(blob);assert.deepEqual(exported.viewAdapters.root7.bookView,snap().bookView);
ids.get('rootEnginePlay').events.click();assert.equal(timers.size,1);[...timers.values()][0]();assert.equal(snap().bookView.options.angle,45);
ids.get('rootEnginePlay').events.click();assert.equal(timers.size,0);ids.get('rootEngineReset').events.click();assert.equal(snap().bookView.options.angle,0);
assert.match(ids.get('root7Transition').textContent,/READY/);
vm.runInContext("rootEngineState=C.createRootSpaceEngine({tick:8});root838Mode='q3';renderRoot838();",context);
assert.equal(snap().source.activeNodeVisible,false);assert.match(ids.get('root7Visibility').textContent,/blendet/);
const invalid=C.createRootSpaceEngine();invalid.frame.q4Address=99;
assert.equal(R.render(doc,invalid,C,'q4'),null);assert.equal(ids.get('root7Coupling').dataset.status,'HOLD');
assert.equal(ids.get('root7StretchSvg').innerHTML,'');assert.equal(ids.get('root7Length').textContent,'—');
// Compile complete page scripts as a syntax check; the UI above runs only the actual root subsystem.
for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
assert.match(html,/rootSpace:rootEngineState,root7:window\.A0Root7Coupling\.snapshot/);
assert.match(html,/viewAdapters:\{root7:window\.A0Root7Coupling\.snapshot/);
console.log('PASS: '+checks+' Root7/Q4 model, source-hash and actual-root-controller simulated UI checks. No live-browser claim.');
