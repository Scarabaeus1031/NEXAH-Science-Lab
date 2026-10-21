'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const I=require('./a0-bench-integration.js'),B=require('./assets/a0-pentagon-body-player-v1.js'),M=require('./a0-mask-observer.js'),C=require('./a0-orientation-controller-bench.js'),A=require('./audit-bench-fusion-glbs.cjs');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},copy=x=>JSON.parse(JSON.stringify(x));
for(const focus of I.FOCI)for(const n of B.buildBody().nodes)for(const tick of [0,30,60,120])for(const witness of [true,false]){
 const input={keys:[n.sourceKey],focus,mask:{...M.create(),tick},witness},before=JSON.stringify(input),r=I.snapshot(input);
 ok(I.verify(r),'recomputation');ok(JSON.stringify(input)===before,'source invariance');
 ok(r.projected.length===48&&r.bins.flatMap(b=>b.sourceKeys).length===48,'all 48 retained');
 ok(r.projected.find(p=>p.active).sourceKey===n.sourceKey,'key stable across views');
 if(witness)ok(r.returnReceipt.returnedKeys[0]===n.sourceKey,'witness exact');
 else if(r.returnReceipt.status.startsWith('PASS'))ok(r.returnReceipt.candidateCount===1,'unique bins only');
 else ok(r.returnReceipt.returnedKeys===null,'no guessed inverse');
 ok(!/NaN|Infinity/.test(I.drawing(r)),'finite drawing');
 const bad=copy(r);bad.projected[0].address=99;ok(!I.verify(bad),'tamper held');
}
for(const p of [[-1.6,1.6],[1.599,-1.599]])ok(I.cell(p)>=1&&I.cell(p)<=28,'bounded raster');
ok(I.cell([1.6,0])===null&&I.cell([0,-1.6])===null,'exclusive edges, no clamping');
assert.throws(()=>I.cell([NaN,0]));checks++;
assert.throws(()=>I.snapshot({keys:['P4:0000']}));checks++;
assert.throws(()=>I.snapshot({keys:['P0:0000','P0:0000']}));checks++;
const depth=4,points=C.trinomialLayer(depth).map(a=>({...a,x:(a.i*220+a.j*35+a.k*405)/depth,y:(a.i*28+a.j*315+a.k*315)/depth})),pascal={depth,sides:7,lens:'algo',exterior:'shadow',selected:{i:4,j:0,k:0,sigma:1},points,envelope:[[220,28],[35,315],[405,315]]};
ok(I.snapshot({keys:['P0:0000'],pascal}).pascalView.returned.status==='PASS');
ok(I.snapshot({keys:['P0:0000'],pascal,witness:false}).pascalView.returned.status==='HOLD','Pascal hidden record required');
class E{
 constructor(value=''){this.value=value;this.checked=true;this.disabled=false;this.textContent='';this.innerHTML='';this.events={};this.children=[];}
 addEventListener(t,f){this.events[t]=f;}fire(t){return this.events[t]?.();}appendChild(n){this.children.push(n);}setAttribute(k,v){this[k]=v;}remove(){this.removed=true;}pause(){this.paused=true;}play(){this.paused=false;}
}
const els={},el=k=>els[k]??=new E(),host=new E();host.querySelector=q=>el(q.match(/data-bi-(.*)\]/)[1]);
el('focus').value='AM';el('key').value='P0:0000';el('model').value='0';
let state=M.create(),callback,clockCallback,owner=null,ready=true,body=null;
const mask={get state(){return copy(state);},get clockOwner(){return owner;},subscribe(f){callback=f;return()=>callback=null;}};
const doc={getElementById:id=>id==='benchIntegration'?host:id==='bodyRouteSourceFrame'?body:null,createElement:()=>new E(),head:new E(),addEventListener(){}};
const audit=A.report(),win={A0MaskObserverController:mask,A0MaskClockBench:{get ready(){return ready;},subscribe(f){clockCallback=f;return()=>clockCallback=null;}},A0PascalSource:{read:()=>pascal},A0BenchFusionGLBAudit:audit,customElements:{get:()=>true},URL:{createObjectURL:()=> 'blob:fixture',revokeObjectURL(){}},Blob};
const mounted=I.mount(doc,win);ok(mounted.current.source.keys[0]==='P0:0000');
el('capture').fire('click');const held=JSON.stringify(mounted.held);
el('key').value='P2:1111';el('local').fire('click');ok(mounted.current.source.keys[0]==='P2:1111');
el('return').fire('click');ok(JSON.stringify(mounted.current)===held,'exact local record return');
state=M.apply(state,'STEP');callback();ok(JSON.stringify(mounted.held)===held,'held not overwritten');
el('body').fire('click');ok(!mounted.current&&el('status').textContent.startsWith('HOLD'),'missing body fails closed');
body={contentWindow:{A0PentagonBodyPlayerView:{cells:[{x:1,y:2}]}}};const original=JSON.stringify(body);
el('body').fire('click');ok(mounted.current.source.keys[0]==='P1:0001');ok(JSON.stringify(body)===original,'readback no source writes');
el('pascal').fire('click');ok(mounted.current.pascalView.returned.status==='PASS');
el('witness').checked=false;el('witness').fire('change');ok(mounted.current.pascalView.returned.status==='HOLD');
owner='source';ready=false;clockCallback();ok(!mounted.current&&el('capture').disabled,'clock loss clears display');
ready=true;clockCallback();ok(mounted.current);
const saved=JSON.parse(fs.readFileSync('results/a0-bench-fusion-glb-audit-2026-10-21.json'));
ok(JSON.stringify(saved)===JSON.stringify(audit),'actual source hashes and accessors replay');
const phi=audit.models[0].phiLayers;ok(phi.length===5);
for(const [n,r]of phi.map((n,i)=>[n,[1.2,1.95,3.15,5.1,8.25][i]])){ok(n.vertices===2353);ok(Math.abs(n.localBounds[0][1]-(r+.03))<1e-5,'actual ring mesh outer radius');}
ok(audit.models[1].animations[0].channels.every(c=>c.equivalentRotationEndpoints),'rotation degeneracy');
ok(Math.abs(audit.models[1].animations[1].channels[0].values[1][0]-1.03)<1e-6);
// Browser factory dependency order, not Node-only success.
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),ctx={console};
vm.createContext(ctx);
for(const file of ['assets/a0-tessarec-blue-body-v1.js','assets/a0-blue-body-interior-crt16-v1.js','assets/a0-blue-body-life-transfer-v1.js','assets/a0-pentagon-body-player-v1.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
ok(ctx.A0PentagonBodyPlayer.buildBody().nodes.length===48);
ok(html.indexOf('a0-orbit-grid-joints.js')<html.indexOf('a0-bench-integration.js'));
ok(html.includes('id="benchIntegration"'));
let inline=0;
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(match[1].trim()){new Function(match[1]);inline++;}}
ok(inline>20,'existing inline scripts compile');
ok(!/setInterval|setTimeout|requestAnimationFrame|postMessage/.test(fs.readFileSync('a0-bench-integration.js','utf8')),'no adapter engine or clock');
(async()=>{
 await el('load').fire('click');const viewer=el('viewer').children.at(-1);ok(viewer.src===audit.models[0].href);
 viewer.availableAnimations=['Phi_Pulse'];viewer.fire('load');el('track').value='Phi_Pulse';el('play').fire('click');ok(viewer.paused===false);
 el('camera').value='0deg 0deg auto';el('camera').fire('change');ok(viewer.cameraOrbit==='0deg 0deg auto');
 el('pause').fire('click');ok(viewer.paused);
 el('unload').fire('click');ok(viewer.removed&&el('play').disabled);
 viewer.fire('load');viewer.fire('error');ok(el('glb-status').textContent.includes('entladen'),'late events cannot revive unloaded viewer');
 mounted.dispose();ok(callback===null&&clockCallback===null);
 console.log(JSON.stringify({status:'PASS',checks,scope:'48 keys x 3 projections x 4 mask ticks; collisions, missing witness, actual mounted controls, local record return, read-only body and Pascal, GLB binary hashes/meshes/keyframes and simulated viewer controls',browserAcceptance:'OWNER_REPORTED_PREVIOUS_VIEWS; NEW_PANEL_NOT_BROWSER_ACCEPTED',scientificRun:false},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
