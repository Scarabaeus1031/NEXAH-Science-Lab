'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),F=require('./a0-fold-lag-lens.js'),M=require('./a0-fold-cycle-coupling.js');
let checks=0;function ok(value,message){checks++;assert.ok(value,message);}
for(const mode of ['target','increment'])for(const mirror of ['none','horizontal','double'])for(const lag of [0,3,7])for(let z=0;z<=28;z++){
 const source=F.snapshot(z,{mode,mirror,lag}),before=JSON.stringify(source),r=M.snapshot(source);
 ok(r.pose===z+1&&r.completedGroups===Math.floor(z/7),'pose and groups');
 ok(r.red===(Math.min(3,Math.floor(z/7))%2?-1:1),'right-continuous red');
 ok(r.flip===(z===28)&&r.closureMarker===(z===28?0:null),'only terminal flip and zero');
 ok(r.displayDeterminant===(z===28?-1:1),'reflection orientation');
 ok(!r.calendarMapping&&!r.statefulAcrossRuns&&!r.wholeMachineReturn,'scope');
 const svg=M.presentation(r);ok(!/NaN|undefined|Infinity/.test(svg),'finite drawing');
 const diagram=M.diagram(r);ok(diagram.includes('0 / FLIP')===(z===28),'zero marker drawing');
 const off=M.snapshot(source,false);ok(!off.flip&&off.closureMarker===null,'toggle original');
 ok(M.presentation(off).startsWith(F.drawing(source)),'disabled exact source drawing');
 ok(JSON.stringify(source)===before,'source not mutated');
 ok(JSON.stringify(M.snapshot(JSON.parse(before)))===JSON.stringify(r),'deterministic replay');
 if(z>0&&z<28&&z%7!==0)ok(Math.sign(Math.sin(2*r.phase))===r.red,'quadrant identity away from boundaries');
}
for(const s of [-1,29,.2,NaN]){assert.throws(()=>M.snapshot({...F.snapshot(0),slice:s}));checks++;}
const nodes=new Map();function node(id){const n={id,checked:true,attrs:{},events:{},setAttribute(k,v){this.attrs[k]=String(v);if(k==='id')nodes.set(v,this);},getAttribute(k){return this.attrs[k]??null;},addEventListener(k,f){this.events[k]=f;}};nodes.set(id,n);return n;}
for(const id of ['foldCycleEnabled','foldCycleReadout','foldCycleDiagram','foldCycleExport','foldLagSvg'])node(id);
const prism=node('prism');prism.attrs.d='original';prism.parentNode={appendChild(){}};
const doc={getElementById:id=>nodes.get(id),querySelector:()=>prism,createElementNS:()=>node('newCursor'),createElement:()=>({click(){ok(this.download==='a0-fold-cycle-coupling.json','explicit export');}})};
let z=7,previousCalls=0,paused=0,markup='',exported,revoked=false;
const oldURL=global.URL,oldBlob=global.Blob;global.URL={createObjectURL(blob){exported=blob.parts[0];return 'blob:test';},revokeObjectURL(){revoked=true;}};global.Blob=class{constructor(parts){this.parts=parts;}};
const view={onRender(){previousCalls++;},snapshot:()=>F.snapshot(z),pause(){paused++;},render(){const s=this.snapshot();this.onRender(s);markup=nodes.get('foldLagSvg').innerHTML;return s;}};
const ui=M.mount(doc,view);ok(previousCalls===1,'existing observer retained');
z=28;view.render();ok(ui.snapshot().flip&&markup.includes('ANSICHTSFLIP'),'terminal actual handler');ok(nodes.get('foldCyclePrismCursor').attrs.cy==='62','prism terminal zero');
const expected=JSON.parse(JSON.stringify(F.snapshot(28)));for(const f of expected.facets)for(const key of ['points','shadow'])f[key]=f[key].map(([x,y,z])=>[x,-y,z]);ok(markup.startsWith(F.drawing(expected)),'actual mirrored points and shadows');
view.render();ok(ui.snapshot().flip,'repaint does not flip back');
nodes.get('foldCycleExport').events.click();ok(JSON.parse(exported).flip&&revoked,'export derived record');
nodes.get('foldCycleEnabled').checked=false;nodes.get('foldCycleEnabled').events.change();ok(paused===1&&!ui.snapshot().flip,'toggle pauses');ok(prism.attrs.d==='original','original prism restored');ok(markup===F.drawing(F.snapshot(28)),'original 5B restored');
nodes.get('foldCycleEnabled').checked=true;z=0;view.render();ok(!ui.snapshot().flip&&ui.snapshot().closureMarker===null,'restart resets derived endpoint');
global.URL=oldURL;global.Blob=oldBlob;
// Actual existing 5B player and its timer/handlers, not a replacement player.
for(const id of ['foldLagMode','foldLagDelay','foldLagMirror','foldLagSlice','foldLagFollow','foldLagPlay','foldLagNext','foldLagReset','foldLagExport','foldLagReadout'])node(id);
nodes.get('foldLagMode').value='target';nodes.get('foldLagDelay').value='3';nodes.get('foldLagMirror').value='none';nodes.get('foldLagSlice').value='7';nodes.get('foldLagFollow').checked=false;
let timer=null,interval;const clock={setInterval(fn,ms){ok(timer===null,'single existing timer');timer=fn;interval=ms;return 1;},clearInterval(){timer=null;}};
const actual=F.mount(doc,clock);let actualObserverCalls=0;actual.onRender=()=>actualObserverCalls++;
const actualUI=M.mount(doc,actual);nodes.get('foldLagPlay').events.click();ok(actualUI.snapshot().z===0&&interval===400,'real play starts Z0 at original pace');
for(let step=1;step<=28;step++){timer();ok(actualUI.snapshot().flip===(step===28),'real timer terminal event');}
ok(timer===null&&actualObserverCalls===30,'real player stop and original observer');
ok(nodes.get('foldLagSvg').innerHTML.includes('ANSICHTSFLIP'),'real player renders flip');
ok(JSON.stringify(actual.snapshot())===JSON.stringify(F.snapshot(28)),'raw 5B export state remains original');
nodes.get('foldLagPlay').events.click();ok(!actualUI.snapshot().flip&&actualUI.snapshot().z===0,'real restart clears endpoint');actual.pause();
const js=fs.readFileSync(__dirname+'/a0-fold-cycle-coupling.js','utf8');ok(!/setInterval|setTimeout|requestAnimationFrame|postMessage|fetch\(/.test(js),'no extra clock or external channel');
console.log(JSON.stringify({status:'PASS',checks,poses:29,groups:4,browserAcceptance:false,scope:'model, geometry, existing-render hook, observer preservation, cursor, toggle, explicit export; not browser pixels or calendar law'}));
