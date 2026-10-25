'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),J=require('./a0-register-janus.js');
let count=0;const eq=(a,b)=>{assert.deepEqual(a,b);count++;},ok=v=>{assert.ok(v);count++;},bad=f=>{assert.throws(f);count++;};
for(const m of ['1','9']){
 const r=J.model(m);eq(r.value,BigInt(m)*10n**12n+'');eq(r.registerReturn,true);
 for(const [i,s] of [3,3,4].entries())eq(J.parseGroup(r.registers[i].digits,s).toString(),r.value);
 eq(r.anuAssignment,null);eq(r.marillionValue,null);eq(r.sourceTransport,false);eq(r.field.physicalA0Mapping,null);
}
for(let a=2;a<=10;a++)for(let b=1;b<=6;b++)for(let c=1;c<=3;c++){
 const r=J.model('1',String(a),String(b),String(c));
 eq(r.power.left,String(BigInt(a)**BigInt(b*c)));
 eq(r.power.right,String(BigInt(a)**BigInt(b**c)));
 eq(r.power.difference,String(BigInt(r.power.right)-BigInt(r.power.left)));
}
for(let n=1;n<=512;n++)eq(J.model('1','2','3','2',String(n)).field.places,String(n*n));
eq(J.model().power.ratio,'8:1');eq(J.model().field.places,'41616');
eq(J.model().imageCheck.first,'1000000000000');eq(J.model().imageCheck.second,'100000000');
for(const value of ['1000000000000','1000000000001']){const record=J.integerRecord(value);eq(record.value,value);eq(record.views.groups3,value==='1000000000000'?'1│000│000│000│000':'1│000│000│000│001');eq(record.views.groups4,value==='1000000000000'?'1│0000│0000│0000':'1│0000│0000│0001');eq(record.returnChecks,{groups3:true,groups4:true});eq(record.languageNames,null);eq(record.channelMapping,null);}
eq(J.integerRecord('0').views,{decimal:'0',groups3:'0',groups4:'0'});eq(J.parseGroup('0',3),0n);eq(J.parseGroup('0',4),0n);
bad(()=>J.integerRecord(null));bad(()=>J.integerRecord(''));bad(()=>J.integerRecord(Number.MAX_SAFE_INTEGER+1));bad(()=>J.group('1',2));
for(const ch of J.checks())ok(ch.pass);
for(const args of [['2'],['0'],['1','1'],['1','11'],['1','2','7'],['1','2','3','4'],['1','2','3','2','513'],['1','2','3','2','0'],['1','2.5'],['1','2',''],['1','2','3','2','Infinity']])bad(()=>J.model(...args));
for(const [s,k] of [['1│0000',3],['1│000',4],['01│0000',4],['<img>',4],['1│',4]])bad(()=>J.parseGroup(s,k));
// Mount real UI logic in a DOM double; this is not browser/pixel acceptance.
const nodes={};
class Node{
 constructor(){this.children=[];this.events={};this.value='';this.textContent='';}
 set id(v){this._id=v;nodes[v]=this;}get id(){return this._id;}
 append(...v){this.children.push(...v);}after(n){this.next=n;}replaceChildren(...v){this.children=v;}
 addEventListener(t,f){this.events[t]=f;}click(){this.events.click?.();}input(v){this.value=v;this.events.input?.();}
 set innerHTML(s){this.html=s;for(const m of s.matchAll(/id="([^"]+)"[^>]*(?:value="([^"]*)")?/g)){
  const n=new Node();n.id=m[1];
 }const defaults={janusValue:'1',janusBase:'2',janusInner:'3',janusOuter:'2',janusSide:'204'};for(const [id,v] of Object.entries(defaults))if(nodes[id])nodes[id].value=v;}
 get innerHTML(){return this.html||'';}
}
const host=new Node();host.id='anuTowerWorkbench';
const doc={head:new Node(),getElementById:id=>nodes[id]||null,createElement:()=>new Node()};
const controller=J.mount(doc);ok(controller);eq(controller.snapshot().power.right,'512');
eq(nodes.janusRegisters.children.length,3);eq(nodes.janusChecks.children.length,7);eq(J.mount(doc),null);
nodes.janusValue.input('9');eq(controller.snapshot().value,'9000000000000');eq(controller.snapshot().registers[2].name,'九万亿');
nodes.janusSide.input('512');eq(controller.snapshot().field.places,'262144');ok(nodes.janusField.innerHTML.includes('512 mal 512'));
nodes.janusBase.input('3');eq(controller.snapshot().power.right,'19683');eq(controller.snapshot().power.left,'729');
nodes.janusSide.input('');eq(controller.snapshot(),null);eq(nodes.janusRegisters.children.length,0);eq(nodes.janusRecord.textContent,'null');eq(nodes.janusField.innerHTML,'');ok(nodes.janusReturn.textContent.includes('HOLD'));
nodes.janusSide.input('204');eq(controller.snapshot().field.places,'41616');
const copy=controller.snapshot();copy.anuAssignment='fake';eq(controller.snapshot().anuAssignment,null);
nodes.janusTest.click();eq(nodes.janusChecks.children.length,7);
// Browser entry uses only document; deliberately supply no timers or source engines.
const browserNodes={},browserDoc={head:new Node(),getElementById:()=>null,createElement:()=>new Node()};
const context={window:{document:browserDoc},console};vm.runInNewContext(fs.readFileSync(require.resolve('./a0-register-janus.js'),'utf8'),context);
eq(context.window.A0RegisterJanusController,null);ok(context.window.A0RegisterJanus);
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
ok(html.includes('href="#registerJanusWorkbench"'));ok(html.indexOf('src="a0-register-janus.js')>html.indexOf('src="a0-anu-tower.js'));
console.log('PASS · '+count+' Register-Janus assertions · DOM doubles; no live-browser acceptance');
