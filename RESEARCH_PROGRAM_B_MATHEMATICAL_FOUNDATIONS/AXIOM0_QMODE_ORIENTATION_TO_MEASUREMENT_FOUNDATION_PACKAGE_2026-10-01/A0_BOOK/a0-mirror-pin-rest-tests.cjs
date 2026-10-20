'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),P=require('./a0-mirror-pin-rest.js');let checks=0;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=v=>{assert.ok(v);checks++};
for(let phase=0;phase<=360;phase++){
 const r=P.snapshot(phase);eq(r.anchor,[0,0]);eq(r.anchorLabel,'1');ok(Math.abs(r.tiltDegrees)<=12);
 eq(r.pinLabels,['0','0']);eq(r.primeReading.inside.map(p=>p.value),[2,3,5]);eq(r.primeReading.outside.map(p=>p.value),[7]);
 for(const n of r.primeReading.inside)ok(Math.hypot(...n.point)<r.primeReading.radius);
 for(const n of r.primeReading.outside)ok(Math.hypot(...n.point)>r.primeReading.radius);
 ok(Math.hypot(...r.upper)>r.primeReading.radius);ok(Math.hypot(...r.lower)>r.primeReading.radius);
 eq(r.primeReading.centerIsPrime,false);eq(r.primeReading.fifthPrime,11);eq(r.primeReading.sixthPrime,13);
 ok(Math.abs(Math.hypot(...r.upper)-1)<1e-12);ok(Math.abs(Math.hypot(...r.lower)-1)<1e-12);
 r.upper.forEach((x,i)=>ok(Math.abs(x+r.lower[i])<1e-12));
 eq(r.decimal.product,111*111);eq(r.decimal.middleDigit,'3');eq(r.decimal.extraCenterState,false);
 const s=r.splitRest;eq(s.N,s.divisor*s.lower+s.lowerSignedRest);eq(s.N,s.divisor*s.upper+s.upperSignedRest);
 eq(s.position,s.N/s.divisor);eq(s.upper-s.lower,s.quotientIntervalWidth);eq(s.divisor*(s.upper-s.lower),s.integerIntervalWidth);
 eq(s.position-s.lower,s.lowerDistance);eq(s.upper-s.position,s.upperDistance);eq(s.lowerDistance+s.upperDistance,1);
 eq(P.verify(P.record(phase)),'PASS');ok(P.drawing(phase).includes('Mitte bleibt'));
}
for(const phase of [-1,361,NaN,1.1,'90',null]){assert.throws(()=>P.snapshot(phase));checks++;}
for(const field of ['phase','reading']){const r=P.record(90);r[field]=field==='phase'?0:{};eq(P.verify(r),'INVALID');}
const altered=P.record(90);altered.reading.anchor=[1,0];eq(P.verify(altered),'INVALID');eq(P.verify(null),'INVALID');
const legacy=P.record(90);legacy.schema='a0.mirror-pin-checkpoint/1';eq(P.verify(legacy),'INVALID');
const changedLabel=P.record(90);changedLabel.reading.pinLabels=['111','111'];eq(P.verify(changedLabel),'INVALID');
const primes=[];for(let n=2;n<=13;n++)if(Array.from({length:n-2},(_,i)=>i+2).every(d=>n%d!==0))primes.push(n);
eq(P.snapshot().primeReading.sequence,primes);eq(primes[4],11);eq(primes[5],13);
// Same orientation does not imply the same retained phase checkpoint.
ok(Math.abs(P.snapshot(0).upper[0]-P.snapshot(180).upper[0])<1e-12);ok(JSON.stringify(P.record(0))!==JSON.stringify(P.record(180)));
const ids=['mirrorPinRest','mprPhase','mprDrawing','mprStatus','mprCapture','mprRestore','mprExport'];
const els=Object.fromEntries(ids.map(id=>[id,{value:'',disabled:false,addEventListener(k,f){this[k]=f;}}]));
let payload,click=false,revoke=false;const doc={getElementById:id=>els[id],createElement:()=>({click(){click=true;}})},win={Blob:class{constructor(parts){payload=JSON.parse(parts[0]);}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{revoke=true;}}};
const control=P.mount(doc,win);ok(els.mprRestore.disabled);els.mprPhase.value='90';els.mprPhase.input();eq(control.read().tiltDegrees,12);
els.mprCapture.click();els.mprPhase.value='270';els.mprPhase.input();eq(control.read().tiltDegrees,-12);els.mprRestore.click();eq(control.read().phase,90);
els.mprExport.click();eq(payload,control.record());ok(click&&revoke);eq(P.verify(payload),'PASS');
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');for(const id of ids)ok(html.includes('id="'+id+'"'));
const js=fs.readFileSync(__dirname+'/a0-mirror-pin-rest.js','utf8');ok(!/setTimeout|setInterval|requestAnimationFrame|fetch\(/.test(js));
const sandbox={document:doc};sandbox.globalThis=sandbox;vm.runInNewContext(js,sandbox);ok(sandbox.A0MirrorPinRest);
eq(P.mount({getElementById:()=>null},{}),null);
console.log(JSON.stringify({status:'PASS',checks,phases:361,browserAcceptance:false,scope:'declared symbolic geometry, opposite pins, fixed anchor, exact split-rest arithmetic, local checkpoint/export and DOM doubles; no physics or research execution'}));
