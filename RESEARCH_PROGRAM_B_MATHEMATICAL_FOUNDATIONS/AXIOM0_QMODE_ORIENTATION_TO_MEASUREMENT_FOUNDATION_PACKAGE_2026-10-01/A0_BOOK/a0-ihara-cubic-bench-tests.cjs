'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),C=require('./a0-ihara-cubic-bench.js'),M=require('./assets/a0-ihara-hashimoto-model.js'),V=require('./a0-visual1-grid-generator.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++},throws=f=>{assert.throws(f);checks++};
const graph=M.makeGraph('dodecahedron'),ds=M.directed(graph),B=M.matrixB(graph),base={journey:{phaseIndex:0},edge:{incoming:{from:0,to:1},candidate:{from:1,to:2},layer:0},aperture:42};
eq(graph.positions.length,20);eq(graph.edges.length,30);eq(ds.length,60);
for(let i=0;i<60;i++){
 const initial=C.create(i),choices=C.choices(initial);eq(choices.incoming,ds[i]);eq(choices.allowed.length,2);ok(choices.allowed[0][1]<choices.allowed[1][1]);
 const ready=V.derive({...base,cubic:C.read(initial)},null,'cubic');
 for(const branch of ['c','d']){
  const s=C.step(initial,branch),r=C.read(s);eq(ds[s.edgeIndex],choices.allowed[branch==='c'?0:1]);eq(B[i][s.edgeIndex],1);eq(s.revision,1);eq(r.channel.verdict,'COMMITTED');eq(r.current,ds[s.edgeIndex]);
  const blocked=C.step(s,'reverse');eq(blocked.edgeIndex,s.edgeIndex);eq(blocked.lastCommitted,s.lastCommitted);eq(C.read(blocked).channel.verdict,'BLOCK');
  const projected=V.derive({...base,cubic:r},null,'cubic'),rejected=V.derive({...base,cubic:C.read(blocked)},null,'cubic');
  eq(projected.incoming.from,ds[i][0]);eq(projected.incoming.to,ds[i][1]);eq(projected.candidate.to,ds[s.edgeIndex][1]);eq(projected.edge.confirmed,true);
  eq(rejected.address,projected.address);eq(rejected.edge.verdict,'BLOCK');eq(projected.antipode,ready.antipode);eq(projected.pascal,ready.pascal);
 }
 const reverse=C.step(initial,'reverse'),reverseIndex=ds.findIndex(e=>e.join(',')===choices.blocked.join(','));
 eq(B[i][reverseIndex],0);eq(reverse.edgeIndex,i);eq(reverse.lastCommitted,null);
 eq(V.derive({...base,cubic:C.read(reverse)},null,'cubic').address,ready.address);
}
for(const value of [-1,60,1.5,null])throws(()=>C.create(value));
throws(()=>C.step(C.create(),'x'));throws(()=>V.derive(base,null,'cubic'));
throws(()=>V.derive({...base,cubic:{...C.read(C.create()),graph:'C5'}},null,'cubic'));
const falseWitness=C.read(C.create());falseWitness.channel.committed=true;throws(()=>V.derive({...base,cubic:falseWitness},null,'cubic'));
let s=C.create();for(let i=0;i<128;i++)s=C.step(s,i%2?'c':'d');
eq(s.history.length,128);const full=C.step(s,'c');eq(full.status,'HOLD_JOURNAL_FULL');eq(full.edgeIndex,s.edgeIndex);throws(()=>V.derive({...base,cubic:C.read(full)},null,'cubic'));
class Node{
 constructor(){this.events={};this.dataset={};this.children=[];this.disabled=false;this.value='';this.classList={toggle(){}};}
 addEventListener(k,f){(this.events[k]??=[]).push(f);}fire(k){for(const f of this.events[k]||[])f({});}
 appendChild(n){this.children.push(n);}replaceChildren(){this.children=[];}
}
const nodes=Object.fromEntries(['cubicReadout','cubicSvg','cubicLedger','cubicReverse','cubicReset','visual1GridGenerator','pxaTesaGenerator'].map(id=>[id,new Node()]));
const buttons=['c','d'].map(branch=>{const n=new Node();n.dataset.iharaBranch=branch;return n}),root=new Node();
root.querySelectorAll=()=>buttons;
const host=nodes.visual1GridGenerator,mini=nodes.pxaTesaGenerator;
const h=Object.fromEntries(['data-v1-edge-source','data-visual1-tesa-grid','data-v1-p','data-v1-a','data-v1-e','data-v1-status','data-v1-follow','data-v1-step'].map(k=>[k,new Node()]));
const m=Object.fromEntries(['data-visual1-tesa-grid','data-v1-mini-status','data-v1-mini-follow'].map(k=>[k,new Node()]));
h['data-v1-edge-source'].value='cubic';
host.querySelector=q=>h[q.slice(1,-1)];mini.querySelector=q=>m[q.slice(1,-1)];
const doc={getElementById:id=>nodes[id],querySelector:q=>q==='[data-ihara-cubic-fork]'?root:null,createElement:()=>new Node()};
const before=JSON.stringify(base),win={A0Visual1BenchState:()=>JSON.parse(JSON.stringify(base))};
win.A0IharaCubicController=C.mount(doc,win);win.A0Visual1GridController=V.mount(doc,win);
eq(win.A0Visual1GridController.snapshot().edge.source,'G(10,2)');eq(win.A0Visual1GridController.snapshot().edge.confirmed,false);eq(h['data-visual1-tesa-grid'].children.length,28);
buttons[1].fire('click');eq(win.A0IharaCubicController.snapshot().revision,1);eq(win.A0Visual1GridController.snapshot().edge.confirmed,true);ok(h['data-v1-e'].textContent.includes('COMMITTED'));
eq(win.A0IharaCubicController.snapshot().current,[1,11]);eq(win.A0Visual1GridController.snapshot().candidate.to,11); // never reduced modulo 5
const address=win.A0Visual1GridController.snapshot().address,index=win.A0IharaCubicController.snapshot().edgeIndex;
nodes.cubicReverse.fire('click');eq(win.A0IharaCubicController.snapshot().edgeIndex,index);eq(win.A0Visual1GridController.snapshot().address,address);ok(h['data-v1-e'].textContent.includes('BLOCK'));
h['data-v1-edge-source'].value='c5';h['data-v1-edge-source'].fire('change');eq(win.A0Visual1GridController.snapshot().edge.source,'C5');eq(win.A0Visual1GridController.snapshot().candidate.to,2);
h['data-v1-edge-source'].value='cubic';h['data-v1-edge-source'].fire('change');eq(win.A0Visual1GridController.snapshot().edge.source,'G(10,2)');
const saved=win.A0IharaCubicController;win.A0IharaCubicController=null;win.A0Visual1GridController.render();eq(win.A0Visual1GridController.snapshot(),null);eq(h['data-visual1-tesa-grid'].children.length,0);
h['data-v1-step'].fire('click');eq(win.A0Visual1GridController.snapshot(),null);ok(h['data-v1-status'].textContent.includes('no C5 fallback'));
win.A0IharaCubicController=saved;nodes.cubicReset.fire('click');eq(saved.snapshot().edgeIndex,0);eq(win.A0Visual1GridController.snapshot().edge.verdict,'READY');
eq(JSON.stringify(base),before);ok(!fs.readFileSync(__dirname+'/a0-ihara-cubic-bench.js','utf8').match(/setInterval|setTimeout|postMessage/));
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
for(const id of ['cubicReadout','cubicSvg','cubicLedger','cubicReverse','cubicReset'])ok(html.includes('id="'+id+'"'));
ok(html.indexOf('src="assets/a0-ihara-hashimoto-model.js"')<html.indexOf('src="a0-ihara-cubic-bench.js'));
console.log(JSON.stringify({status:'PASS',checks,scope:'all 60 G(10,2) directed states, 120 accepted choices checked against existing Hashimoto B, reverse controls, journal limit, real controllers in DOM doubles, typed C5/cubic switching and missing-source HOLD; no browser pixels or scientific replay'}));
