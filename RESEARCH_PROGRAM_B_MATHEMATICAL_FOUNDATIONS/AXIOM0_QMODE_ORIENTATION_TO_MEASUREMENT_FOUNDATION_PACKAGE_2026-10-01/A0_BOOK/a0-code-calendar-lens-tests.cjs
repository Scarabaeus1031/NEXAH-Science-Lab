'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),L=require('./a0-code-calendar-lens.js'),G=require('./a0-gh-hinge.js');
let checks=0;function ok(x,m){checks++;assert.ok(x,m);}function eq(a,b,m){checks++;assert.deepEqual(a,b,m);}
const result=L.test();eq(result.status,'PASS');eq(result.checks,93);eq(result.failures,[]);
const initial=L.initial(),read=L.snapshot(initial);eq(read.dates,G.calendarWitnesses());eq(read.arithmetic.map(x=>x.value),[9,8,10]);
for(const invalid of [null,{}, {...initial,axis:3},{...initial,ratio:-1},{...initial,direction:0},{...initial,extra:true}]){checks++;assert.throws(()=>L.snapshot(invalid));}
const nodes=new Map();for(const id of ['codeCalendarLens','codeCalendarSvg','codeCalendarDates','codeCalendarReturn','codeCalendarReadout','codeCalendarRecord','codeCalendarAxis','codeCalendarRatio','codeCalendarReverse','codeCalendarCapture','codeCalendarTest','codeCalendarTests'])nodes.set(id,{value:'0',disabled:false,events:{},addEventListener(k,fn){this.events[k]=fn;}});
const doc={getElementById:id=>nodes.get(id)},controller=L.mount(doc),node=id=>nodes.get(id),click=id=>node(id).events.click();
ok(node('codeCalendarReturn').disabled);click('codeCalendarReturn');eq(controller.snapshot(),read);
for(let axis=0;axis<3;axis++)for(let ratio=0;ratio<3;ratio++){
  node('codeCalendarAxis').value=String(axis);node('codeCalendarAxis').events.change();
  node('codeCalendarRatio').value=String(ratio);node('codeCalendarRatio').events.change();
  const before=controller.snapshot();eq(before.state.axis,axis);eq(before.state.ratio,ratio);
  click('codeCalendarCapture');click('codeCalendarReverse');eq(controller.snapshot().state.direction,-before.state.direction);
  click('codeCalendarReturn');eq(controller.snapshot(),before);click('codeCalendarReverse');click('codeCalendarReverse');eq(controller.snapshot(),before);
  ok(!/NaN|undefined|Infinity/.test(node('codeCalendarSvg').innerHTML));eq(JSON.parse(node('codeCalendarRecord').textContent),before);
}
click('codeCalendarTest');ok(node('codeCalendarTests').textContent.includes('PASS · 93'));
eq(L.mount({getElementById:()=>null}),null);
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');for(const id of nodes.keys())ok(html.includes('id="'+id+'"'),'host '+id);
ok(html.indexOf('src="a0-gh-hinge.js')<html.indexOf('src="a0-code-calendar-lens.js'),'source dependency precedes lens');
const source=fs.readFileSync(__dirname+'/a0-code-calendar-lens.js','utf8');ok(!/setInterval|setTimeout|requestAnimationFrame/.test(source),'no timer');
const sandbox={document:doc,A0GHHinge:G};vm.createContext(sandbox);vm.runInContext(source,sandbox);ok(sandbox.A0CodeCalendarLens,'browser mount path');
const m=JSON.parse(fs.readFileSync(__dirname+'/assets/a0-code-calendar-lens-v1.json','utf8'));for(const p of m.sources)eq(crypto.createHash('sha256').update(fs.readFileSync(__dirname+'/'+p.path)).digest('hex'),p.sha256,'source '+p.path);
ok(m.new_global_ids.length===0&&m.canonical_count_effect===0&&!m.publication_authorized);
console.log(JSON.stringify({status:'PASS',checks,embeddedMatrix:result.checks,browserAcceptance:false,scope:'source dates, arithmetic, all independent selector combinations, actual mounted handlers and browser branch with DOM doubles; no motion-law assertion'}));
