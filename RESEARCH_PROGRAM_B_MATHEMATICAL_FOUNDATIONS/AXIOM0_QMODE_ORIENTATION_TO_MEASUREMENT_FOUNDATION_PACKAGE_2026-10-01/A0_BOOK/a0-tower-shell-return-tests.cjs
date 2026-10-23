const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const M=require('./a0-tower-shell-return.js');
let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks++};
const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++};

const pin=(q=1,decision='PINNED_2_TO_1',read='OCCUPIED')=>({
  schema:'nexah.a0.tl-final-pin-view/1',identity:M.IDENTITY,
  state:{phase:decision==='PINNED_2_TO_1'?'pinned':'open',scanner:{q,screenRead:read}},
  input:{declaredParts:[2,1]},pin:{address:`q${String(q).padStart(2,'0')}`,decision}
});
const dg=(stage='EXCITATION',samples=18,bands=5,index=0)=>({
  schema:'nexah.a0.dg-sampling-loop-record/1',identity:M.IDENTITY,
  current:{stage,sample:`${index+1}/${samples}`,wheelDeg:index/samples*360,samples,bands,index},
  finalPinHandoff:{status:'ACCEPTED'}
});

eq(M.VERSION,'1.0.0');
eq(M.IDENTITY,'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH');
eq(M.STAGES,['SOURCE','PIN','EXCITATION','TRACE','WITNESS','RETURN','ROOT_GATE','RECEIPT']);
let state=M.inspect(pin(),dg());
eq(state.status,'READY_FOR_WITNESS');eq(state.address,'q01');eq(state.stage,'EXCITATION');
eq(state.basis,{samples:18,bands:5});ok(state.pinAccepted);ok(state.dgCompatible);ok(!state.closed);ok(!state.mapsQToN);ok(!state.changesDgClock);

for(const stage of ['EXCITATION','TRACE','RETURN']){
  const result=M.captureWitness(pin(),dg(stage));eq(result.status,'HOLD');eq(result.reason,'DG_NOT_AT_WITNESS');
}
eq(M.captureWitness(pin(4,'OPEN','GAP'),dg('WITNESS')).reason,'PIN_NOT_ACCEPTED');
eq(M.captureWitness(pin(),null).reason,'DG_RECORD_MISSING');
const witness=M.captureWitness(pin(),dg('WITNESS',18,5,9));
eq(witness.schema,'nexah.a0.tower-shell-witness/1');eq(witness.status,'WITNESS_HELD');eq(witness.address,'q01');eq(witness.dgSample,'10/18');eq(witness.basis,{samples:18,bands:5});eq(witness.sourceStage,'WITNESS');

eq(M.closeReturn(pin(),dg('RETURN'),null).reason,'WITNESS_MISSING');
eq(M.closeReturn(pin(),dg('TRACE'),witness).reason,'DG_NOT_AT_RETURN');
eq(M.closeReturn(pin(),dg('RETURN',12,5),witness).reason,'SOURCE_OR_BASIS_CHANGED');
eq(M.closeReturn(pin(),dg('RETURN',18,6),witness).reason,'SOURCE_OR_BASIS_CHANGED');
eq(M.closeReturn(pin(2),dg('RETURN'),witness).reason,'SOURCE_OR_BASIS_CHANGED');
eq(M.closeReturn(pin(4,'OPEN','GAP'),dg('RETURN'),witness).reason,'PIN_NOT_ACCEPTED');
eq(M.closeReturn(pin(),null,witness).reason,'DG_RECORD_MISSING');

const receipt=M.closeReturn(pin(),dg('RETURN',18,5,14),witness);
eq(receipt.schema,'nexah.a0.tower-shell-return-receipt/1');eq(receipt.status,'CLOSED_TYPED_VIEW_RETURN');eq(receipt.address,'q01');eq(receipt.sourceAddress,'q01');eq(receipt.rootRoomMode,'RETURN');eq(receipt.operatorStatus,'OPEN_NOT_SOURCE_RECOVERED');eq(receipt.basis,{samples:18,bands:5});
ok(receipt.route.includes('DG_WITNESS'));ok(receipt.route.includes('ROOT_ROOM_RETURN_GATE'));ok(receipt.route.includes('SOURCE_ADDRESS_RECEIPT'));
ok(!receipt.authority.researchRun);ok(!receipt.authority.scientificEvidence);ok(!receipt.authority.newIdentity);ok(!receipt.authority.newRelation);ok(!receipt.authority.newCarrier);ok(!receipt.authority.newOperator);assert.match(receipt.boundary,/does not map q addresses to N teeth/);checks++;

state=M.inspect(pin(),dg('RETURN'),witness,receipt);eq(state.status,'CLOSED');ok(state.closed);ok(state.witnessValid);
const record=M.buildRecord(pin(),dg('RETURN'),witness,receipt);eq(record.schema,'nexah.a0.tower-shell-return-view/1');eq(record.classification,'SOURCE_BOUND_ENGINEERING_DEMONSTRATOR');eq(record.receipt.status,'CLOSED_TYPED_VIEW_RETURN');assert.match(record.boundary,/Tower operator recovery remains OPEN/);checks++;
const svg=M.svgMarkup(state,witness,receipt);for(const token of ['MOUSE','FINAL PIN','D°G WITNESS','D°G RETURN','ROOT ROOM','SOURCE RECEIPT','q ADDRESS HELD','NO q→N MAP']){assert.match(svg,new RegExp(token.replace(/[°→]/g,'.')));checks++;}

const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
for(const token of ['id="towerShellReturn"','id="towerShellReturnSvg"','id="towerShellReturnCapture"','id="towerShellReturnClose"','id="towerShellReturnRun"','a0-tower-shell-return.css','a0-tower-shell-return.js','A0_BLUE_PINK_DODECA_CELL_RETURN.html#rootRoom']){ok(html.includes(token),token)}
ok(html.indexOf('id="tlFinalPin"')<html.indexOf('id="towerShellReturn"'),'Return demonstrator follows its Final Pin source');
const script=fs.readFileSync(path.join(__dirname,'a0-tower-shell-return.js'),'utf8');
for(const token of ["a0:tl-final-pin","a0:dg-sampling-loop","A0RootRoomPhaseBridge?.select?.('RETURN')",'SOURCE_OR_BASIS_CHANGED'])ok(script.includes(token),token);
const dgScript=fs.readFileSync(path.join(__dirname,'a0-dg-sampling-loop.js'),'utf8');ok(dgScript.includes("new win.CustomEvent('a0:dg-sampling-loop'"),'D°G emits typed view updates');
const css=fs.readFileSync(path.join(__dirname,'a0-tower-shell-return.css'),'utf8');for(const token of ['.tower-shell-return','.tsr-route','.tsr-node.closed','.tsr-boundary','@media(max-width:800px)'])ok(css.includes(token),token);

console.log(JSON.stringify({status:'PASS',checks,scope:'closed typed Mouse q → Final Pin → D°G Witness/Return → Root Room return-gate → same q receipt; no q-to-N map, shared clock or recovered Tower operator'}));
