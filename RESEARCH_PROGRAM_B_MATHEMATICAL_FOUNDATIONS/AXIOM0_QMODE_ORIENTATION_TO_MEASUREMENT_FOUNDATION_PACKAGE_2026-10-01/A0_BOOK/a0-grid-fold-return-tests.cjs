'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),path=require('node:path'),G=require('./a0-grid-fold-return.js');let checks=0;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++};
ok(fs.readFileSync(__dirname+'/a0-grid-atlas.js','utf8').includes('const fold = x + y'));
for(let selected=0;selected<4;selected++)for(const keepV of [false,true]){
 const r=G.snapshot({selected,keepV});eq(r.multiplicities,[1,2,1]);eq(G.verify(G.record({selected,keepV})),'PASS');
 eq(r.return,G.inverse(r.observation));eq(r.return.status,keepV||r.diagonal.u!==1?'EXACT':'HOLD');
 ok(r.return.candidates.some(p=>JSON.stringify(p)===JSON.stringify(r.source)));
 if(keepV){eq(r.return.candidates,[r.source]);eq((r.diagonal.u+r.diagonal.v)/2,r.source[0]);eq((r.diagonal.u-r.diagonal.v)/2,r.source[1]);}
 else eq(r.observation.v,null);
 ok(G.drawing({selected,keepV}).includes(r.return.status));
}
eq(G.snapshot({selected:1,keepV:false}).observation,G.snapshot({selected:2,keepV:false}).observation);
eq(G.inverse({u:1,v:null}).candidates,[[1,0],[0,1]]);
for(const bad of [null,{}, {u:1,v:0},{u:0,v:1},{u:3,v:null},{u:NaN,v:null},{u:1,v:Infinity}])eq(G.inverse(bad).status,'INVALID');
for(const bad of [{selected:-1},{selected:4},{selected:NaN},{keepV:1}]){assert.throws(()=>G.snapshot(bad));checks++;}
let maxError=0;
for(let x=-11;x<=11;x++)for(let y=-11;y<=11;y++){
 const u=x+y,v=x-y,X=u/Math.sqrt(2),Y=v/Math.sqrt(2);eq((u+v)/2,x);eq((u-v)/2,y);eq((u-v)%2===0,true);
 ok(Math.abs(X*X+Y*Y-x*x-y*y)<1e-10);const error=Math.max(Math.abs((X+Y)/Math.sqrt(2)-x),Math.abs((X-Y)/Math.sqrt(2)-y));ok(error<1e-12);maxError=Math.max(error,maxError);
}
const ids=['gridFoldReturn','gfrSelected','gfrKeepV','gfrDrawing','gfrStatus','gfrExport'];
const els=Object.fromEntries(ids.map(id=>[id,{value:'',checked:false,addEventListener(t,f){this[t]=f;}}]));let payload,clicked=false,revoked=false;
const doc={getElementById:id=>els[id],createElement:()=>({click(){clicked=true;}})},win={Blob:class{constructor(parts){payload=JSON.parse(parts[0]);}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{revoked=true;}}};
const mounted=G.mount(doc,win);eq(mounted.read().return.status,'EXACT');els.gfrKeepV.checked=false;els.gfrKeepV.change();eq(mounted.read().return.status,'HOLD');
els.gfrSelected.value='3';els.gfrSelected.change();eq(mounted.read().return.status,'EXACT');els.gfrSelected.value='2';els.gfrSelected.change();eq(mounted.read().return.status,'HOLD');
els.gfrExport.click();eq(G.verify(payload),'PASS');ok(clicked&&revoked);payload.reading.observation.v=-1;eq(G.verify(payload),'INVALID');
eq(G.mount({getElementById:()=>null},{}),null);
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');for(const id of ids)ok(html.includes('id="'+id+'"'));
const files=[...html.matchAll(/src="(assets\/numbermagick-owner-20261020\/[^"]+)"/g)].map(m=>m[1]);eq(files.length,8);
for(const f of files)ok(fs.statSync(path.join(__dirname,f)).size>0);
const f=n=>n*n+n+41;eq(f(17),347);eq(f(40),41**2);eq(31+35,66);eq((31+35)/2,33);eq(33+8,41);ok(Math.abs(41+1/12-41.0677)>.015);ok(30/78!==33);
const js=fs.readFileSync(__dirname+'/a0-grid-fold-return.js','utf8');ok(!/setTimeout|setInterval|requestAnimationFrame|fetch\(/.test(js));
const sandbox={document:doc};sandbox.globalThis=sandbox;vm.runInNewContext(js,sandbox);ok(sandbox.A0GridFoldReturn);
console.log(JSON.stringify({status:'PASS',checks,maxInverseError:maxError,sourceGridPointsChecked:529,browserAcceptance:false,scope:'declared fold/inverse candidates, missing-v HOLD, no hidden-source inversion, native Atlas rule guard, DOM handlers, image paths and arithmetic; no physical or research result'}));
