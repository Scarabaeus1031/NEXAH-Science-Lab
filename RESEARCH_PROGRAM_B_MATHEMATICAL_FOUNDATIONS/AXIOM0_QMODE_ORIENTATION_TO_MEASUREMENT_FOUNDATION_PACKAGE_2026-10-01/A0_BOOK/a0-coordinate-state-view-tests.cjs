'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),A=require('./a0-coordinate-state-view.js'),C=require('./a0-orientation-controller-bench.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++},throws=f=>{assert.throws(f);checks++};
const graph=C.hypercubeGraph(4);eq(graph.vertexCount,16);eq(graph.edgeCount,32);eq(graph.edges.filter(e=>e.axis===3).length,8);
function at(vertex){const e=A.create();for(let axis=0;axis<4;axis++)if(vertex>>axis&1)e.command('FLIP',{axis});return e;}
for(let vertex=0;vertex<16;vertex++)for(let axis=0;axis<4;axis++){
 const e=at(vertex);e.command('CELL',{x:3,y:21});e.command('VIEW',{angle:73});const before=e.read().state;
 const after=e.command('FLIP',{axis}).state;eq(after.vertex,vertex^(1<<axis));eq([after.x,after.y,after.angle],[before.x,before.y,before.angle]);
 ok(graph.edges.some(g=>g.axis===axis&&((g.from===vertex&&g.to===after.vertex)||(g.to===vertex&&g.from===after.vertex))));
 eq(e.command('FLIP',{axis}).state,before);
 for(let other=0;other<4;other++){const p=at(vertex),q=at(vertex);p.command('FLIP',{axis});p.command('FLIP',{axis:other});q.command('FLIP',{axis:other});q.command('FLIP',{axis});eq(p.read(),q.read());}
}
const addresses=new Set();
for(let x=0;x<25;x++)for(let y=0;y<25;y++){
 const e=at(9);e.command('VIEW',{angle:147});const r=e.command('CELL',{x,y});eq(r.state.vertex,9);eq(r.state.angle,147);eq(r.cell.localFlat,25*y+x);
 const [a,b,c,d]=r.cell.digitsXY;eq([5*a+b,5*c+d],[x,y]);addresses.add(r.cell.localFlat);eq(A.verify(e.record()),'PASS');
}
eq(addresses.size,625);
for(let vertex=0;vertex<16;vertex++){
 const e=at(vertex);e.command('CELL',{x:5,y:24});
 for(let angle=0;angle<=360;angle++){const r=e.command('VIEW',{angle});eq([r.state.x,r.state.y,r.state.vertex],[5,24,vertex]);eq(r.view.angle,angle);}
}
const e=at(11);e.command('CELL',{x:24,y:0});e.command('VIEW',{angle:359});e.command('CAPTURE');const anchor=e.read();
e.command('CELL',{x:0,y:24});e.command('FLIP',{axis:2});e.command('VIEW',{angle:1});eq(e.command('RETURN'),anchor);eq(A.verify(e.record()),'PASS');
const unanchored=A.create();throws(()=>unanchored.command('RETURN'));
for(const [type,payload]of [['CELL',{x:-1,y:0}],['CELL',{x:1.5,y:0}],['CELL',{x:0,y:25}],['CELL',{x:0,y:0,vertex:1}],['VIEW',{angle:361}],['VIEW',{angle:NaN}],['FLIP',{axis:4}],['FLIP',{axis:'0'}],['CAPTURE',{x:1}],['SET',{vertex:3}]]){
 const before=e.record();throws(()=>e.command(type,payload));eq(e.record(),before);
}
for(const mutation of [r=>r.reading.q4.bits='0000',r=>r.reading.state.vertex=16,r=>r.anchor.angle=-1,r=>r.reading.cell.localFlat++,r=>r.extra=true]){
 const r=e.record();mutation(r);eq(A.verify(r),'INVALID');
}
const zero=A.create();zero.command('VIEW',{angle:360});eq(zero.read().state.angle,360);ok(JSON.stringify(zero.read())!==JSON.stringify(A.create().read()));
const sample=A.drawing({x:12,y:12,vertex:5,angle:37});eq((sample.match(/data-asv-x=/g)||[]).length,625);eq((sample.match(/<line /g)||[]).length,64);eq((sample.match(/<circle /g)||[]).length,32);
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),ids=['coordinateStateView','asvX','asvY','asvAngle','asvDrawing','asvReadout','asvStatus','asvDiff','asvReturn','asvCapture','asvExport','asvFlip0','asvFlip1','asvFlip2','asvFlip3'];
function element(){return {value:'',disabled:false,textContent:'',innerHTML:'',events:{},addEventListener(k,f){this.events[k]=f;}};}
const els=Object.fromEntries(ids.map(id=>[id,element()]));for(const id of ids)ok(html.includes('id="'+id+'"'));
let payload,clicked=false,revoked=false;const doc={getElementById:id=>els[id]||null,createElement:()=>({click(){clicked=true;}})},win={Blob:class{constructor(parts){payload=JSON.parse(parts[0]);}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{revoked=true;}}};
const mounted=A.mount(doc,win);ok(els.asvReturn.disabled);els.asvCapture.events.click();
els.asvX.value='21';els.asvX.events.change();eq(mounted.read().state,{x:21,y:12,vertex:0,angle:0});
els.asvFlip2.events.click();eq(mounted.read().state,{x:21,y:12,vertex:4,angle:0});els.asvAngle.value='37';els.asvAngle.events.input();eq(mounted.read().state,{x:21,y:12,vertex:4,angle:37});
ok(els.asvDiff.textContent.includes('GEÄNDERT'));els.asvReturn.events.click();eq(mounted.read().state,{x:12,y:12,vertex:0,angle:0});
els.asvDrawing.events.click({target:{closest:()=>({getAttribute:k=>k==='data-asv-x'?'1':'23'})}});eq(mounted.read().state,{x:1,y:23,vertex:0,angle:0});
const before=mounted.record();els.asvX.value='25';els.asvX.events.change();eq(mounted.record(),before);ok(els.asvStatus.textContent.includes('INVALID'));
els.asvExport.events.click();eq(A.verify(payload),'PASS');ok(clicked&&revoked);eq(payload,mounted.record());
const js=fs.readFileSync(__dirname+'/a0-coordinate-state-view.js','utf8');ok(js.includes('C.hypercubeGraph(4)'));ok(!/setTimeout|setInterval|requestAnimationFrame|fetch\(/.test(js));
const sandbox={document:doc,A0OrientationController:C};sandbox.globalThis=sandbox;vm.runInNewContext(js,sandbox);ok(sandbox.A0CoordinateStateView);
eq(A.mount({getElementById:()=>null},{}),null);
const original=path.resolve(__dirname,'../../../SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/NEXAH_FAMILY_SYNTHESIS_DEMONSTRATOR.html');
ok(fs.readFileSync(original,'utf8').includes('model.current^=(1<<i)')); // Source guard: original bit-flip rule, not original-player state binding.
for(const href of [...html.matchAll(/href="([^"]+a0BenchPreset=synthesis-loki)"/g)].map(m=>m[1]))ok(fs.existsSync(path.resolve(__dirname,href.split('?')[0])));
console.log(JSON.stringify({status:'PASS',checks,addresses:625,q4States:16,anglesPerState:361,browserAcceptance:false,scope:'native Q4 graph, independent commands, flip involution/commutation, local snapshot Return and record tampering, mounted DOM controls and source guards; not original-player ACK or shared-clock binding'}));
