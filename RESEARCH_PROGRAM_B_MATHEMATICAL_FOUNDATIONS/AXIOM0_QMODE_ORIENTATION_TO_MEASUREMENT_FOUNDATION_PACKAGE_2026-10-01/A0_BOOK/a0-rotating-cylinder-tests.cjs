'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('./a0-rotating-cylinder.js'),S=require('./a0-aperture-stack-calibration.js'),V=require('./a0-plate-mirror-view.js'),MV=require('./a0-mask-observer-view.js');
let checks=0;const ok=(v,m)=>{checks++;assert.ok(v,m);},near=(a,b)=>Math.abs(a-b)<1e-11;
const base=C.snapshot(0),fixed=JSON.stringify(base.plates),angles=S.SOURCE_ANGLES;
for(const direction of [1,-1])for(let phase=0;phase<=360;phase++){
 const r=C.snapshot(phase,{direction}),theta=direction*phase*Math.PI/180;
 ok(C.verify(r).status==='PASS','recompute snapshot');
 ok(JSON.stringify(r.plates)===fixed,'all six plates fixed during rotation');
 ok(r.plates.slice(0,3).every(p=>p.group==='UPPER_3')&&r.plates.slice(3).every(p=>p.group==='LOWER_3'),'two declared groups');
 ok(r.plates.every((p,i)=>p.nominalAngleDeg===angles[i]),'retain original source angles');
 ok(r.axialTranslation===0&&r.materialProbe[2]===.15,'no material translation');
 ok(near(r.apparentAxialShift,-direction*phase/360),'analytical apparent shift');
 for(let band=0;band<3;band++){
  const points=r.bands[band].points,original=base.bands[band].points;
  for(let i=0;i<points.length;i++){
   const [x,y,z]=points[i],[a,b,h]=original[i];
   ok(z===h,'material point preserves height');
   ok(near(x,a*Math.cos(theta)-b*Math.sin(theta))&&near(y,a*Math.sin(theta)+b*Math.cos(theta)),'rigid rotation of each material point');
  }
  for(const z of r.bands[band].frontCrossings)ok(near(Math.sin(2*Math.PI*z+r.bands[band].offset+theta),0)&&Math.cos(2*Math.PI*z+r.bands[band].offset+theta)>.999999,'front crossing solves fixed sightline');
  ok(r.bands[band].plateContacts.every((p,i)=>p[2]===r.plates[i].z),'contact lies on fixed plate');
 }
 const svg=C.drawing(r);
 ok(!/NaN|undefined|Infinity/.test(svg),'finite drawing');
 ok((svg.match(/data-fixed-plate=/g)||[]).length===6,'six visible fixed plate markers');
 const bad=JSON.parse(JSON.stringify(r));bad.materialProbe[2]+=.01;ok(C.verify(bad).status==='INVALID','reject fake axial transport');
}
for(const p of [-1,361,NaN,Infinity]){assert.throws(()=>C.snapshot(p));checks++;}
for(const opt of [{direction:0},{direction:2},{copies:'yes'}]){assert.throws(()=>C.snapshot(0,opt));checks++;}
ok(C.snapshot(30,{copies:false}).seam.copies===1&&C.snapshot(30).seam.copies===2,'seam copy toggle');
for(let i=0;i<3;i++)for(let j=0;j<121;j++)ok(C.snapshot(360).bands[i].points[j].every((v,k)=>near(v,base.bands[i].points[j][k])),'full revolution geometrically closes');
class El{
 constructor(){this.value='';this.checked=false;this.disabled=false;this.events={};this.attrs={};this.innerHTML='';}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k];}
 addEventListener(k,fn){(this.events[k]??=[]).push(fn);}fire(k){if(!this.disabled)for(const fn of this.events[k]||[])fn({target:this});}
 click(){this.fire('click');}scrollIntoView(){}
}
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8'),ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]),els=Object.fromEntries(ids.map(id=>[id,new El()]));
const doc={getElementById:id=>els[id]||null,createElement:()=>new El(),addEventListener(){}};
let timer=null,started=0,exported=null;const lens={phase:232};
const win={A0RotatingCylinder:C,A0BenchLensReturnController:{get state(){return lens;}},setInterval(fn){started++;timer=fn;return 1;},clearInterval(){timer=null;},setTimeout:fn=>fn(),matchMedia:()=>({matches:false}),URL:{createObjectURL(b){exported=JSON.parse(b.parts[0]);return'blob:test';},revokeObjectURL(){}},Blob:class{constructor(parts){this.parts=parts;}}};
win.A0MaskObserverController=MV.mount(doc,win);
els.plateMirrorSource.value='mixer';els.plateMirrorReference.checked=els.plateMirrorEnabled.checked=true;
els.plateCylinderDirection.value='forward';els.plateCylinderCopies.checked=true;
const v=V.mount(doc,win);
ok(v.cylinderRecord().phase===232&&started===0,'existing mixer feed, no clock created');
const source=JSON.stringify(win.A0MaskObserverController.state);
els.plateCylinderDirection.value='reverse';els.plateCylinderDirection.fire('change');
ok(v.cylinderRecord().direction===-1&&source===JSON.stringify(win.A0MaskObserverController.state),'direction local only');
els.plateCylinderCopies.checked=false;els.plateCylinderCopies.fire('change');ok(v.cylinderRecord().seam.copies===1,'real copy toggle');
els.plateMirrorPlay.click();ok(started===1&&timer!==null,'delegates to original mask clock');
for(let tick=1;tick<=120;tick++){timer();ok(v.cylinderRecord().phase===3*tick,'original animation feed');ok(JSON.stringify(v.cylinderRecord().plates)===fixed,'fixed plates during actual native callbacks');}
ok(timer===null,'source pauses at endpoint');
win.A0MaskObserverController.command('TICK',20);els.plateMirrorCapture.click();els.plateMirrorStep.click();ok(v.cylinderRecord().phase===63,'original step');
els.plateMirrorReturn.click();ok(v.cylinderRecord().phase===60,'source Return geometry');
els.plateCylinderExport.click();ok(C.verify(exported.geometry).status==='PASS'&&exported.phaseSource==='mask','export source-bound geometry');
els.plateMirrorPlay.click();ok(timer!==null,'restart original clock');els.plateMirrorPlay.click();ok(timer===null,'pause original clock');
const phase=v.cylinderRecord().phase;v.destroy();win.A0MaskObserverController.command('TICK',45);ok(v.cylinderRecord().phase===phase,'unsubscribes original feed');
lens.phase=undefined;els.plateMirrorSource.value='mixer';v.render();ok(v.cylinderRecord()===null&&els.plateCylinderDrawing.innerHTML==='','missing source clears stale geometry');
const beforeExport=exported;els.plateCylinderExport.click();ok(exported===beforeExport,'no stale export in HOLD');
ok(!/setInterval|setTimeout|requestAnimationFrame/.test(fs.readFileSync(path.join(__dirname,'a0-rotating-cylinder.js'),'utf8')),'no independent cylinder timer');
ok(html.indexOf('src="a0-rotating-cylinder.js')<html.indexOf('src="a0-plate-mirror-view.js'),'dependency loaded before subscriber');
console.log(JSON.stringify({status:'PASS',checks,phases:722,nativeAnimationSteps:120,browserAcceptance:false,scope:'rigid rotation, invariant material heights, six fixed plates, analytical crossings, seam copy, source clock lifecycle and exports'}));
