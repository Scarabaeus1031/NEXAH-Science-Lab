'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),C=require('./a0-orientation-controller-bench.js'),M=require('./a0-triplesix-return-walk.js');
let checks=0;function ok(v,m){checks++;assert.ok(v,m);}
const words=['123','132','213','231','312','321'],ops={identity:[],cycle:[[1,2,0]],reverse:[[2,1,0]],'cycle-reverse':[[1,2,0],[2,1,0]],'reverse-cycle':[[2,1,0],[1,2,0]]};
const oracle=(w,op)=>ops[op].reduce((x,indices)=>indices.map(i=>x[i]).join(''),w);
const rows=C.s3PermutationRegister().states;
for(const word of words)for(const operator of Object.keys(ops))for(const residual of ['keep','drop','wrong']){
 const cfg={word,operator,residual},before=JSON.stringify(cfg),r=M.run(cfg),record=M.record(cfg),target=oracle(word,operator);
 ok(r.transform.word===target,'independent position-array oracle');
 ok(M.transform(target,operator,true)===word,'inverse reverses actual action order');
 const observed=rows.find(s=>s.word===target),expectedSide=residual==='drop'?null:observed.side*(residual==='wrong'?-1:1);
 const candidates=words.filter(w=>{const t=rows.find(s=>s.word===oracle(w,operator));return t.axis===observed.axis&&(expectedSide===null||t.side===expectedSide);});
 assert.deepEqual(r.reconstruction.candidates,candidates.sort());checks++;
 ok(r.returns.exact.status==={keep:'PASS',drop:'HOLD',wrong:'FAIL'}[residual],'three distinct outcomes');
 ok(r.returns.carrier.status==='PASS'&&r.returns.invariant.status==='PASS','retained provenance and weak invariant do not imply exact');
 ok(r.cut.fibre.length===2&&r.residual.requiredBits===1,'actual source fibre cardinality');
 ok(JSON.stringify(cfg)===before,'configuration unchanged');
 ok(M.verify(record).status==='PASS','record recomputation');
 ok(M.verify(JSON.parse(JSON.stringify(record))).status==='PASS','JSON replay');
 assert.deepEqual(M.reconstruct(r.observation),candidates.sort());checks++;
 for(const [key,value] of [['schema','wrong'],['classification','RESEARCH_PASS']]){const changed=JSON.parse(JSON.stringify(record));changed[key]=value;ok(M.verify(changed).status==='REJECT','altered record header');}
 for(const mutate of [r=>r.reading.transform.word='999',r=>r.reading.observation.side=0,r=>r.reading.cut.fibreSize=1,r=>r.reading.returns.exact.status='OTHER',r=>r.reading.reconstruction.candidates=['999'],r=>r.reading.residual.sourceWordUsedByDecoder=true]){const changed=JSON.parse(JSON.stringify(record));mutate(changed);ok(M.verify(changed).status==='REJECT','altered derived record');}
 for(let stage=0;stage<5;stage++){const svg=M.diagram(r,stage);ok(!/NaN|undefined|Infinity/.test(svg),'finite diagram');ok(svg.includes('TRANSFORMIERT')===(stage>=1),'stage transform reveal');ok(svg.includes('REKONSTRUIERT')===(stage>=3),'stage decode reveal');}
}
for(const word of words)ok(M.transform(word,'cycle-reverse')!==M.transform(word,'reverse-cycle'),'noncommuting positional control');
ok(M.battery().status==='PASS'&&M.battery().cases===90,'on-screen bounded battery');
for(const c of [null,{}, {word:'111',operator:'cycle',residual:'keep'},{word:'123',operator:'turn',residual:'keep'},{word:'123',operator:'cycle',residual:'guess'},{word:'123',operator:'cycle',residual:'keep',extra:1}]){assert.throws(()=>M.run(c));checks++;}
for(const o of [{carrier:'S3',axis:'A',operator:'identity',side:1,sourceWord:'123'},{carrier:'OTHER',axis:'A',operator:'identity',side:1},{carrier:'S3',axis:'D',operator:'identity',side:1},{carrier:'S3',axis:'A',operator:'identity',side:0}]){assert.throws(()=>M.reconstruct(o));checks++;}
// Decoder ambiguity is a function of observation, not which source record is used as oracle.
const a=M.run({word:'123',operator:'identity',residual:'drop'}),b=M.run({word:'321',operator:'identity',residual:'drop'});
assert.deepEqual(a.observation,b.observation);checks++;assert.deepEqual(a.reconstruction,b.reconstruction);checks++;
function node(){return{value:'',attrs:{},events:{},textContent:'',innerHTML:'',setAttribute(k,v){this.attrs[k]=String(v);},addEventListener(k,f){this.events[k]=f;}};}
const ids=['tripleSixReturnWalk','s3WalkWord','s3WalkOperator','s3WalkResidual','s3WalkStage','s3WalkDiagram','s3WalkReadout','s3WalkLevels','s3WalkBack','s3WalkNext','s3WalkExport','s3WalkRecord','s3WalkAll','s3WalkReset','s3WalkTests','s3WalkImport','s3WalkStatus'],nodes=Object.fromEntries(ids.map(id=>[id,node()]));
let exported=null,downloads=0,revoked=0;const events={};
const doc={getElementById:id=>nodes[id]||null,addEventListener(k,f){events[k]=f;},createElement(){return{click(){downloads++;ok(this.download==='a0-triplesix-return-walk.json','explicit download');}};}};
const win={URL:{createObjectURL(blob){exported=blob.parts[0];return 'blob:test';},revokeObjectURL(){revoked++;}},Blob:class{constructor(parts){this.parts=parts;}}};
const ui=M.mount(doc,win);ok(ui.stage===0&&nodes.s3WalkExport.disabled,'initial no completion');ok(downloads===0,'no auto download');
nodes.s3WalkExport.events.click();ok(downloads===0,'early export refused');
for(let i=1;i<=4;i++){nodes.s3WalkNext.events.click();ok(ui.stage===i,'actual next handler');}
ok(!nodes.s3WalkLevels.hidden&&nodes.s3WalkRecord.textContent.includes('PASS'),'actual final readout');nodes.s3WalkExport.events.click();ok(M.verify(JSON.parse(exported)).status==='PASS'&&revoked===1,'actual export verified');
const sourceBefore=JSON.stringify(C.s3PermutationRegister());events.click({target:{closest:()=>({dataset:{s3Word:'312'}})}});ok(ui.stage===0&&ui.record().config.word==='312','existing register click adopted');ok(JSON.stringify(C.s3PermutationRegister())===sourceBefore,'register source unchanged');
nodes.s3WalkResidual.value='drop';nodes.s3WalkResidual.events.change();nodes.s3WalkAll.events.click();ok(ui.record().reading.returns.exact.status==='HOLD','actual no-residual control');
nodes.s3WalkResidual.value='wrong';nodes.s3WalkResidual.events.change();nodes.s3WalkAll.events.click();ok(ui.record().reading.returns.exact.status==='FAIL','actual wrong-residual control');
nodes.s3WalkBack.events.click();ok(ui.stage===3&&nodes.s3WalkExport.disabled,'back hides completion');nodes.s3WalkReset.events.click();ok(ui.stage===0&&ui.record().config.residual==='wrong','reset retains selection');nodes.s3WalkTests.events.click();ok(nodes.s3WalkStatus.textContent.includes('90'),'actual test button');
(async()=>{
 const before=JSON.stringify(ui.record()),input={files:[{size:100,text:async()=>exported}],value:'file'};await nodes.s3WalkImport.events.change({target:input});ok(nodes.s3WalkStatus.textContent.startsWith('PASS'),'read-only import verified');ok(JSON.stringify(ui.record())===before&&input.value==='','import never mutates state');
 await nodes.s3WalkImport.events.change({target:{files:[{size:2000000}],value:'file'}});ok(nodes.s3WalkStatus.textContent.startsWith('REJECT'),'oversize rejected');
 await nodes.s3WalkImport.events.change({target:{files:[{size:5,text:async()=>'junk'}],value:'file'}});ok(nodes.s3WalkStatus.textContent.startsWith('REJECT'),'bad JSON rejected');
 const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),js=fs.readFileSync('a0-triplesix-return-walk.js','utf8');
 for(const id of ids)ok(html.includes('id="'+id+'"'),'host '+id);
 ok(html.indexOf('a0-orientation-controller-bench.js')<html.indexOf('src="a0-triplesix-return-walk.js'),'existing model first');
 ok(!/setInterval|setTimeout|requestAnimationFrame|postMessage|fetch\(/.test(js),'no added clock or external channel');
 console.log(JSON.stringify({status:'PASS',checks,cases:90,browserAcceptance:false,scope:'independent finite oracle, inverse order, information-loss controls, decoder without source oracle, tamper rejection, mounted UI and read-only import; not glyph/OCR or cube-fold scientific validation'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
