'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),B=require('./a0-bench-lens-return.js'),M=require('./a0-game-of-numbers-model.js'),T=require('./a0-bench-showcase-tour.js'),C=require('./a0-coupled-window.js'),P=require('./a0-bench-polish.js');let checks=0;
const ok=(x,m)=>{assert.ok(x,m);checks++},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++},clone=x=>JSON.parse(JSON.stringify(x));
let state=B.create();eq(B.verify(B.record(state)).status,'PASS');assert.throws(()=>B.apply(state,'return'),/HOLD/);checks++;
for(let anchor=0;anchor<=16;anchor++){
  let s=B.create();for(let n=0;n<anchor;n++)s=B.apply(s,'step');s=B.apply(s,'capture');
  for(let n=anchor;n<=16;n++){
    const r=B.apply(s,'return');eq(r.session.frames[r.session.cursor],s.anchor.frame,'full captured anchor');eq(r.session.frames.length,s.session.frames.length,'history retained');eq(B.verify(B.record(r)).status,'PASS','inverse witness replays');
    if(n<16)s=B.apply(s,'step');
  }
}
state=B.apply(state,'capture');state=B.apply(state,'step');state=B.apply(state,'step');const before=clone(state.session);state=B.apply(state,'settings',{palette:'cmyk',K:.35,marker:'dusk'});state=B.apply(state,'phase',90);eq(state.session,before,'view edits cannot mutate number source');eq(B.snapshot(state).fold.angle,78,'lens/fold declared shared phase');state=B.apply(state,'return');eq(state.phase,90,'numeric return does not fake whole-machine return');eq(state.settings.K,.35,'lens settings retained');
for(const mutate of [r=>r.state.phase=361,r=>r.state.anchor.cursor=-1,r=>r.state.anchor.frame.fingerprint='bad',r=>r.state.session.frames[0].state.a='979',r=>r.reading.fold.angle=77,r=>r.reading.lens.VM=!r.reading.lens.VM,r=>r.state.witness.computedState.a='9778']){const r=B.record(state);mutate(r);eq(B.verify(r).status,'INVALID','corrupt record rejected')}
for(let p=0;p<=360;p+=6){let s=B.apply(B.create(),'phase',p);for(const palette of ['roles','rgb','cmyk']){s=B.apply(s,'settings',{palette,K:.5});eq(B.verify(B.record(s)).status,'PASS','source-derived reading replays');s=B.apply(s,'settings',{left:false});eq(B.snapshot(s).lens.VM,false,'single lens has no VM');s=B.apply(s,'settings',{left:true})}}
assert.throws(()=>B.apply(B.create(),'phase',1.5));checks++;assert.throws(()=>B.apply(B.create(),'settings',{K:2}));checks++;
const original=B.create();B.apply(original,'step');eq(original,B.create(),'immutable command');
// Actual mounted controller and event handlers using bounded DOM double, not pixel QA.
const nodes=new Map(),buttons=['swap','capture','step','inverse','return','export','reset'].map(a=>({dataset:{blrAction:a},disabled:false,addEventListener(t,f){this[t]=f}}));
function node(q){if(q.startsWith('[data-blr-action='))return buttons.find(b=>q.includes('"'+b.dataset.blrAction+'"'));if(!nodes.has(q))nodes.set(q,{textContent:'',innerHTML:'',value:'',checked:false,disabled:false,addEventListener(t,f){this[t]=f}});return nodes.get(q)}
const host={innerHTML:'',querySelector:node,querySelectorAll:q=>q==='[data-blr-action]'?buttons:[]},doc={getElementById:()=>host,createElement:()=>({click(){}})},win={};const ui=B.mount(doc,win);
eq(node('[data-blr-import]').change instanceof Function,true,'read-only import bound');ok(node('[data-blr-drawing]').innerHTML.includes('VM'),'source renderer mounted');eq(buttons.find(b=>b.dataset.blrAction==='return').disabled,true,'no anchor return disabled');buttons[1].click();buttons[2].click();buttons[2].click();eq(ui.state.session.cursor,2);buttons[4].click();eq(ui.state.session.cursor,0);eq(ui.state.session.frames.length,3);ok(node('[data-blr-status]').textContent.includes('EXACT'));
node('[data-blr-left]').change({target:{checked:false}});eq(B.snapshot(ui.state).lens.VM,false);node('[data-blr-phase]').input({target:{value:'90'}});eq(ui.state.phase,90);node('[data-blr-palette]').change({target:{value:'cmyk'}});eq(node('[data-blr-k]').disabled,false);buttons[6].click();eq(ui.state,B.create(),'reset syncs model');eq(node('[data-blr-phase]').value,232,'reset syncs phase control');
const order=P.groups.flatMap(x=>x[2]);eq(order.length,Object.keys(C.SCENARIOS).length);eq(new Set(order).size,order.length);ok(order.every(id=>C.SCENARIOS[id]),'grouping retains every scenario');eq(T.STATIONS.at(-1).id,'session-ledger','receipt last');ok(T.STATIONS.findIndex(s=>s.id==='replay')>T.STATIONS.findIndex(s=>s.id==='finite-antipode'),'replay follows operators');
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');ok(html.includes('class="bench-workflow"'));ok(html.includes('a0-bench-polish.css'));ok(html.indexOf('src="a0-trinity-lens.js"')<html.indexOf('src="a0-bench-lens-return.js"'));ok(html.indexOf('src="a0-game-of-worlds-model.js"')<html.indexOf('src="a0-game-of-numbers-model.js"'));for(const scenario of Object.values(C.SCENARIOS))for(const module of scenario.modules)ok(html.includes('id="'+module.target+'"'),'source target exists '+module.target);
eq(M.inverseSevenword('977778').value,'97778');
// Browser-global entry points: sevenword does not require an implicit LIFE runtime.
const vm=require('node:vm'),sandbox={};vm.createContext(sandbox);for(const file of ['assets/a0-blue-body-dodeca-countershot-v1.js','a0-layered-pentagon-scene.js','a0-trinity-lens.js','a0-game-of-worlds-model.js','a0-game-of-numbers-model.js','a0-bench-lens-return.js'])vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});eq(sandbox.A0BenchLensReturn.verify(sandbox.A0BenchLensReturn.record(sandbox.A0BenchLensReturn.create())).status,'PASS','browser globals initialise');
// Source-deck lifetime regression: pause retains real module nodes; close restores them.
class Element{
  constructor(){this.children=[];this.dataset={};this.classList={add(){},remove(){},toggle(){}};this.textContent='';this.parentNode=null;this.style={}}
  appendChild(n){if(n.parentNode)n.parentNode.children.splice(n.parentNode.children.indexOf(n),1);this.children.push(n);n.parentNode=this;return n}
  insertBefore(n,before){if(n.parentNode)n.parentNode.children.splice(n.parentNode.children.indexOf(n),1);this.children.splice(this.children.indexOf(before),0,n);n.parentNode=this;return n}
  replaceWith(n){const p=this.parentNode;if(n.parentNode)n.parentNode.children.splice(n.parentNode.children.indexOf(n),1);p.children.splice(p.children.indexOf(this),1,n);n.parentNode=p;this.parentNode=null}
  addEventListener(){}setAttribute(){}removeAttribute(){}focus(){}querySelectorAll(q){return q==='[data-source-panel]'?this.children:[]}querySelector(){return null}
}
const ids=new Map(),get=id=>{if(!ids.has(id))ids.set(id,new Element());return ids.get(id)},home=new Element(),deck=new Element(),workspace=new Element(),stage=get('coupledWindowStage');stage.querySelector=q=>q==='.cw-source-deck'?deck:q==='.cw-source-workspace'?workspace:null;
for(const id of ['benchLensReturn','prismRelationLens'])home.appendChild(get(id));const originals=home.children.slice();
const dialog=get('coupledWindow');dialog.showModal=()=>dialog.open=true;dialog.close=()=>dialog.open=false;
const doc2={getElementById:get,createElement:()=>new Element(),createComment:()=>new Element(),querySelectorAll:()=>[],addEventListener(){},body:new Element()},win2={requestAnimationFrame:f=>f(),scrollTo(){},clearInterval(){}};
const cw=C.mount(doc2,win2);cw.open('lens-return');ok(originals.every(n=>n.parentNode!==home),'native nodes moved, not cloned');cw.pause();ok(originals.every(n=>n.parentNode!==home),'pause retains modules in deck');cw.close();eq(home.children,originals,'close restores exact original node order');
for(const script of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)])new vm.Script(script[1]);checks++;
console.log(JSON.stringify({status:'PASS',checks,scope:'model, mounted DOM-double events and navigation; browser pixels not tested'}));
