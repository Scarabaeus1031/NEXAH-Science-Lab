'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const B=require('./a0-pascal-aperture-bridge.js'),C=require('./a0-orientation-controller-bench.js'),M=require('./a0-mask-observer.js');
let checks=0;const ok=(x,msg)=>{checks++;assert.ok(x,msg);};
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
const point=html.match(/function pascalPoint\(item,n\)\{[^\n]+\}/)[0];
const segment=html.slice(html.indexOf('  function readPascalApertureSource(){'),html.indexOf('  function stopPascalLensMotion(){'));
const depth={value:'4'},context={C,pascalSelected:{i:4,j:0,k:0,sigma:1},shadowSides:7,pascalLensMode:'algo',pascalExteriorMode:'shadow',window:{A0PascalAperture:B},$:()=>depth,stopped:0,rendered:0};
context.stopPascalLensMotion=()=>context.stopped++;context.renderPascalShadow=()=>context.rendered++;
vm.createContext(context);vm.runInContext(point+'\n'+segment,context);
const src=()=>JSON.parse(JSON.stringify(context.window.A0PascalSource.read()));
let cases=0,holds=0;
for(let n=0;n<=11;n++)for(const sides of [7,8,17,19,29]){
 depth.value=String(n);context.pascalSelected={i:n,j:0,k:0,sigma:1};context.shadowSides=sides;
 const source=src(),before=JSON.stringify(source);
 for(const shape of ['triangle','square'])for(const scale of [.25,.6,1])for(const folded of [false,true]){
  const r=B.snapshot(source,{shape,scale,folded}),drop=B.snapshot(source,{shape,scale,folded,keepResidual:false});cases++;
  ok(B.verify(r).status==='PASS','record recomputes');
  ok(r.returned.status==='PASS'&&r.returned.missing===0,'retained complement reassembles both oriented macro layers');
  ok(r.ledger.sourceMacroEntries===2*C.trinomialLayer(n).length,'two source sheets');
  ok(r.ledger.visible+r.ledger.hidden===r.ledger.sourceMacroEntries,'partition no loss');
  ok(r.returned.states.every(p=>[-1,1].includes(p.sigma)),'sign retained');
  ok(r.shadow.plus.pathMass===3**n&&r.shadow.minus.pathMass===3**n,'native shadow mass per sheet');
  ok(JSON.stringify(r.shadow.plus)===JSON.stringify(C.shadowGonProjection(n,sides,1)),'full shadow not silently aperture-filtered');
  ok(JSON.stringify(source)===before,'no source mutation');
  if(r.ledger.hidden){holds++;ok(drop.returned.status==='HOLD','missing complement holds');}
  else ok(drop.returned.status==='PASS','full visible record needs no complement');
  const bad=JSON.parse(JSON.stringify(r));bad.shadow.plus.pathMass++;ok(B.verify(bad).status==='INVALID','derived tamper rejected');
  const duplicate=B.reconstruct(r.observation,[...r.residual,...r.observation.visible.slice(0,1)]);
  if(r.observation.visible.length)ok(duplicate.status==='INVALID','duplicate is not a return');
  const full=[...r.observation.visible,...r.residual];const wrong=JSON.parse(JSON.stringify(full));wrong[0].sigma=0;
  ok(B.reconstruct({...r.observation,visible:wrong},[]).status==='INVALID','unsigned record rejected');
 }
}
ok(holds>0,'negative visibility controls exercised');
depth.value='4';context.pascalSelected={i:4,j:0,k:0,sigma:1};context.shadowSides=7;
const source=src(),r=B.snapshot(source);
const nativeSquare=M.frame({...M.DEFAULT,kind:'square',dx:0,dy:0,angle:0,amplitude:0,phase:0,fold:false},0).a.map(([x,y])=>[220+185*x,175-185*y]);
ok(JSON.stringify(B.aperture(source,B.options({shape:'square',scale:1})))===JSON.stringify(nativeSquare),'reuse exact native square');
const edgeLengths=nativeSquare.map((p,i)=>Math.hypot(p[0]-nativeSquare[(i+1)%4][0],p[1]-nativeSquare[(i+1)%4][1]));
ok(Math.max(...edgeLengths)-Math.min(...edgeLengths)<1e-10,'square uses equal pixel scale on both axes');
const first=B.snapshot(source,{folded:false}),second=B.snapshot(source,{folded:true});
ok(JSON.stringify(first.returned.states)===JSON.stringify(second.returned.states),'A and inverse retain same source');
ok(!/setInterval|setTimeout|requestAnimationFrame/.test(fs.readFileSync('a0-pascal-aperture-bridge.js','utf8')),'no added clock');
class El{
 constructor(){this.value='';this.checked=false;this.disabled=false;this.events={};this.innerHTML='';}
 addEventListener(k,f){(this.events[k]??=[]).push(f);}click(){if(!this.disabled)this.fire('click');}fire(k){for(const f of this.events[k]||[])f({target:this});}
}
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]),els=Object.fromEntries(ids.map(id=>[id,new El()]));
els.pabShape.value='triangle';els.pabScale.value='60';els.pabResidual.checked=true;
let exported;
const doc={getElementById:id=>els[id]||null,createElement:()=>new El()},win={A0PascalSource:context.window.A0PascalSource,Blob:class{constructor(parts){this.parts=parts;}},URL:{createObjectURL(b){exported=JSON.parse(b.parts[0]);return'blob:test';},revokeObjectURL(){}}};
const controller=B.mount(doc,win);ok(controller.record().source.depth===4,'actual mounted source read');
els.pabCapture.click();ok(context.stopped>0&&!els.pabReturn.disabled,'capture stops original Pascal lens player');
const anchor=controller.record();els.pabFold.click();els.pabShape.value='square';els.pabShape.fire('change');els.pabScale.value='25';els.pabScale.fire('input');
depth.value='7';context.pascalSelected={i:7,j:0,k:0,sigma:1};context.shadowSides=29;controller.sourceChanged(src());
ok(controller.record().source.depth===7&&controller.record().source.sides===29,'source change propagates');
els.pabReturn.click();ok(JSON.stringify(controller.record())===JSON.stringify(anchor),'actual source adapter and local options return exactly');
ok(context.rendered===1&&src().depth===4,'real restore adapter calls existing renderer');
els.pabResidual.checked=false;els.pabResidual.fire('change');ok(controller.record().returned.status==='HOLD','real negative control');
els.pabExport.click();ok(B.verify(exported.view).status==='PASS','export verifies');ok(exported.checkpoint.source.depth===4,'checkpoint is explicit');
const beforeBadRestore=JSON.stringify(src()),badSource=src();badSource.points[0].x++;assert.throws(()=>win.A0PascalSource.restore(badSource));checks++;ok(JSON.stringify(src())===beforeBadRestore,'invalid restore cannot mutate source');
for(const bad of [{scale:0},{shape:'circle'},{folded:1},{keepResidual:'yes'}]){assert.throws(()=>B.snapshot(src(),bad));checks++;}
ok(!/NaN|undefined|Infinity/.test(B.drawing(B.snapshot(src()))),'finite drawing');
for(const shape of ['triangle','square'])ok(B.drawing(B.snapshot(src(),{shape})).includes('NATIVER C7'),'native polygon drawn for both apertures');
console.log(JSON.stringify({status:'PASS',checks,cases,missingResidualCases:holds,browserAcceptance:false,scope:'actual Pascal adapter, both oriented layers, native square and triangle coordinates, explicit complement reassembly and missing-key controls, capture/restore/export DOM doubles'}));
