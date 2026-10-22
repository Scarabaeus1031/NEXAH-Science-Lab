const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const api=require('./a0-club-qrt-demo.js');let checks=0;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++};
eq(api.INPUT,['A','B','C','D','E','F','X']);eq(api.flip(api.INPUT),['A','B','C','D','X','F','E']);
eq(api.flip(api.flip(api.INPUT)),api.INPUT);
for(let step=0;step<5;step++){
 const s=api.frame(step);eq(s.input,api.INPUT);eq(s.view,step<2?api.INPUT:api.flip(api.INPUT));
 eq(s.returned,step===2?api.flip(api.INPUT):api.INPUT);eq(s.residual,step===4?0:null);
 eq(s.view[3],'D');eq(s.returned[3],'D');
}
eq(api.frame(-1),null);eq(api.frame(5),null);eq(api.frame(1.5),null);
let draws=0;const c=api.createSequence(()=>draws++);
c.observe({q4Address:0});eq(c.snapshot().step,0);
c.observe({q4Address:0,layer:1});eq(draws,0); // A layer change is not a source address tick.
for(let i=1;i<=20;i++){c.observe({q4Address:i%16});eq(c.snapshot().step,i%5);}
eq(c.snapshot().changes,20);
c.select(2);ok(!c.snapshot().following);c.observe({q4Address:9});eq(c.snapshot().step,2);
c.follow(true);c.observe({q4Address:10});eq(c.snapshot().step,3);
c.observe({q4Address:99});eq(c.snapshot().last,10);eq(c.snapshot().q4Mapping,false);
// Actual DOM adapter retains the same 21 nodes while changing their slots.
function el(){return{dataset:{},children:[],attrs:{},events:{},style:{values:{},setProperty(k,v){this.values[k]=v}},append(x){this.children.push(x)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.events[k]=f}}}
const nodes=Object.fromEntries(['clubQRTDemo','clubQRTField','clubQRTStatus','clubQRTFollow'].map(k=>[k,el()]));
const buttons=Array.from({length:5},(_,i)=>{const b=el();b.dataset.qrtStage=String(i);return b});
const mounted=api.mount({getElementById:id=>nodes[id],createElement:el,querySelectorAll:()=>buttons});
eq(nodes.clubQRTField.children.length,3);buttons[2].events.click();
const view=nodes.clubQRTField.children[1].children[1].children;
eq(view[4].style.values['--slot'],'6');eq(view[6].style.values['--slot'],'4');eq(view[3].style.values['--slot'],'3');
buttons[4].events.click();ok(nodes.clubQRTStatus.textContent.includes('Δ = 0'));
const ret=nodes.clubQRTField.children[2].children[1].children;eq(ret[4].style.values['--slot'],'4');
nodes.clubQRTFollow.events.click();ok(mounted.snapshot().following);
const source=path.resolve(__dirname,'../../../00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_QRT_CODE_MECHANISM.html');
const bytes=fs.readFileSync(source),hash=crypto.createHash('sha256').update(bytes).digest('hex');
eq(hash,'c508d8e7b268d1c40f9095cb639e979cdff2fe702ca5a0b452d8b4afbadcb6e2');
ok(bytes.toString().includes('CUT AT D4'));ok(bytes.toString().includes('FLIP RIGHT FRAME'));
const js=fs.readFileSync(__dirname+'/a0-club-qrt-demo.js','utf8');ok(!/setInterval|setTimeout|localStorage|fetch\(/.test(js));
console.log(JSON.stringify({status:'PASS',checks,sourceHash:hash,scope:'source-pinned seven-position fixture, D4 hinge, suffix involution, exact return comparison, source-address-only demo cadence, manual/follow, persistent DOM nodes; no Q4 or Family mapping; browser pixels OPEN'}));
