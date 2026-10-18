'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),M3=require('./a0-aperture-measurement.js'),S=require('./a0-aperture-stack-calibration.js');
let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++};
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++};
eq(S.SOURCE_ANGLES,[51.63,51.73,51.83,51.93,52.03,52.13],'source angles exact');
eq(S.CONTROL_ANGLES.length,6,'six controls');
for(const id of ['source','control']){
  const fixture=S.stackFixture(id);
  eq(fixture.plates.length,6,id+' six plates');
  eq(fixture.plates.filter(p=>p.reference).length,1,id+' one reference');
  eq(fixture.plates[fixture.referenceIndex].deltaThetaDeg,0,id+' zero reference delta');
  ok(fixture.toleranceDeg===.02,id+' tolerance declared');
}
const trace=M3.createTrace({count:48,opening:.42}),fingerprint=M3.traceFingerprint(trace),source=S.stackFixture('source');
eq(source.plates.map(p=>p.deltaThetaDeg),[-.2,-.1,0,.1,.2,.3],'signed source deltas');
for(let plateIndex=0;plateIndex<6;plateIndex++){
  const comparison=S.compareToReference(trace,source,plateIndex,{windowDeg:52}),record=S.buildRecord({stackId:'source',plateIndex,opening:.42,windowDeg:52});
  ok(Number.isFinite(comparison.rmse)&&comparison.rmse>=0,'finite rmse '+plateIndex);
  ok(comparison.current.visibleIndices.length>0&&comparison.current.visibleIndices.length<48,'visibility bounded '+plateIndex);
  eq(record.sourceFingerprint,fingerprint,'source invariant '+plateIndex);
  ok(record.return.exact&&record.return.residual===0,'exact return '+plateIndex);
  eq(record.ilau.lost,[],'no record loss '+plateIndex);
  ok(record.ilau.unresolved.includes('physical calibration'),'physical boundary '+plateIndex);
}
eq(S.compareToReference(trace,source,source.referenceIndex).rmse,0,'reference rmse zero');
ok(S.buildRecord({stackId:'control'}).fixture.provenance.includes('irregular'),'control provenance');
assert.throws(()=>S.stackFixture('missing'),/unknown stack/);checks++;
assert.throws(()=>S.inspectPlate([],source.plates[0]),/trace required/);checks++;
assert.throws(()=>S.compareToReference(trace,source,9),/plate index/);checks++;
const html=fs.readFileSync('./A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
for(const id of ['apertureStackCalibration','apStackSvg','apStackPlay','apStackStep','apStackReset','apStackSpeed','apStackMode','apStackWindow','apStackMetric','apStackLedger','apStackExport','apStackStatus'])ok(new RegExp(`id=["']${id}["']`).test(html),'HTML '+id);
ok(html.includes('a0-aperture-stack-calibration.js'),'module wired');
ok(html.includes('a0-aperture-stack-calibration.css'),'styles wired');
class Node{
  constructor(id=''){this.id=id;this.value='';this.textContent='';this.innerHTML='';this.dataset={};this.children=[];this.listeners={};this.attrs={}}
  get firstChild(){return this.children[0]||null}
  setAttribute(k,v){this.attrs[k]=String(v)}
  getAttribute(k){return this.attrs[k]||null}
  addEventListener(k,fn){this.listeners[k]=fn}
  appendChild(node){this.children.push(node);return node}
  removeChild(node){this.children.splice(this.children.indexOf(node),1);return node}
  click(){this.listeners.click?.({})}
}
const ids=['apertureStackCalibration','apStackSvg','apStackPlay','apStackStep','apStackReset','apStackSpeed','apStackMode','apStackWindow','apStackWindowOut','apStackPlate','apStackAngle','apStackDelta','apStackVisible','apStackMetric','apStackLedger','apStackStatus','apStackExport','pxaAperture'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Node(id)]));
Object.assign(nodes.apStackMode,{value:'source'});Object.assign(nodes.apStackSpeed,{value:'700'});Object.assign(nodes.apStackWindow,{value:'52'});Object.assign(nodes.pxaAperture,{value:'42'});
let tick=null;
const doc={hidden:false,getElementById:id=>nodes[id],createElementNS:(_,tag)=>new Node(tag),createElement:tag=>new Node(tag),addEventListener(){}};
const win={console:{error(){}},matchMedia:()=>({matches:false}),setInterval:fn=>(tick=fn,1),clearInterval(){tick=null},addEventListener(){}};
doc.defaultView=win;
const mounted=S.mount(doc,win);
ok(!!mounted,'restricted DOM mount');
eq(nodes.apStackSvg.children.length,76,'initial SVG nodes');
ok(nodes.apStackStatus.textContent.includes('LIVE'),'visible live status');
ok(nodes.apStackLedger.innerHTML.includes('RETURN'),'ledger rendered');
mounted.start();tick();eq(mounted.record.activePlate.plate,'P2','timer advances');
for(let i=0;i<5;i++)tick();
eq(mounted.record.activePlate.plate,'P1','timer cycles');
eq(nodes.apStackSvg.children.length,76,'frame replaces nodes');
mounted.stop();
console.log(JSON.stringify({status:'PASS',checks,plates:6,samples:48,scope:'OCB-GAP-02 source-local engineering calibration; no physical calibration claim'}));
