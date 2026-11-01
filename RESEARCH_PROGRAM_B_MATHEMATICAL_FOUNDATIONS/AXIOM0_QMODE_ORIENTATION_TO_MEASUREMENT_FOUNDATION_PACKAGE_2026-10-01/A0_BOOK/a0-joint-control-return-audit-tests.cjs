'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const adapter=require('./a0-three-domain-joint-adapter.js');
const cut=require('./a0-cut-q-lens-return-bench.js');
const audit=require('./a0-joint-control-return-audit.js');
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks+=1;};
const equal=(actual,expected,message)=>{assert.equal(actual,expected,message);checks+=1;};
const throws=(fn,message)=>{assert.throws(fn,undefined,message);checks+=1;};
const ledger=(c00,c01,c10,c11)=>({c00,c01,c10,c11,total:c00+c01+c10+c11});
const record=adapter.normalize({generation:7,snapshots:{
  chemistry:{generation:7,ledger:ledger(63,1,0,0),controller:{name:'chem'}},
  life:{generation:7,ledger:ledger(31,1,31,1),controller:{name:'life'}},
  physics:{generation:7,ledger:ledger(16,17,18,19),controller:{name:'physics'}}
}},{observedAt:'2026-11-01T00:00:00.000Z'});

equal(audit.IDENTITY,'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','identity reused');
equal(audit.ILAU_ID,'SG:LENS:ILAU_ORIENTATION','ILAU identity reused');
equal(audit.SCHEMA,'nexah.a0.joint-control-return-audit/1','schema fixed');

const ratio=audit.ratioLens(63,1);
equal(ratio.total,64,'63+1=64');
equal(ratio.large_share,63/64,'large share exact');
equal(ratio.small_share,1/64,'small share exact');
equal(ratio.small_to_large,1/63,'small to large explicit');
equal(ratio.read,'63:1','ratio read preserved');
throws(()=>audit.ratioLens(-1,2),'negative rejected');
throws(()=>audit.ratioLens(0,0),'zero denominator rejected');

const right=audit.controlFrame('R'),left=audit.controlFrame('L');
check(right.orthogonal,'right CTRL orthogonal');
check(left.orthogonal,'left CTRL orthogonal');
equal(right.dot,0,'right dot zero');
equal(left.dot,0,'left dot zero');
equal(right.mirror.R,'L','right mirrors left');
equal(left.mirror.L,'R','left mirrors right');
equal(right.turn,'90°|90°','turn is explicit');

const ilau=audit.ilauPartition(['a','b','u'],['b','c','u'],['u']);
equal(ilau.I.join(','),'b','intersection');
equal(ilau.L.join(','),'a','lost');
equal(ilau.A.join(','),'c','added');
equal(ilau.U.join(','),'u','unavailable');
check(ilau.disjoint,'ILAU disjoint');
check(ilau.exhaustive,'ILAU exhaustive');
equal(ilau.universe.length,4,'ILAU covers universe');

equal(audit.returnGate({touch:false,kappa:63/64,witness:true}).status,'HOLD_MISSING_TOUCH','touch fail closed');
equal(audit.returnGate({touch:true,kappa:0,witness:true}).status,'HOLD_INVALID_KAPPA','kappa fail closed');
equal(audit.returnGate({touch:true,kappa:63/64,witness:null}).status,'HOLD_MISSING_WITNESS','witness missing');
equal(audit.returnGate({touch:true,kappa:63/64,witness:false}).status,'HOLD_CONFLICTING_WITNESS','witness conflicts');
equal(audit.returnGate({touch:true,kappa:63/64,witness:true,requiredUnavailable:true}).status,'HOLD_REQUIRED_INFORMATION_UNAVAILABLE','U fails closed');
check(audit.returnGate({touch:true,kappa:63/64,witness:true}).exact,'gate passes complete witness');

equal(audit.GATE_ORDER.map(item=>item.key).join(','),'capture,touch,witness,kappa,available,cut','six gates ordered');
const matrix=audit.returnMatrix();
equal(matrix.states.length,64,'2^6 states enumerated');
equal(new Set(matrix.states.map(item=>item.binary)).size,64,'all binary states unique');
equal(matrix.summary.exact,1,'one exact state');
equal(matrix.summary.incomplete,7,'seven incomplete decidable states');
equal(matrix.summary.conflict,24,'twenty four touch witness conflicts');
equal(matrix.summary.unavailable,32,'thirty two unavailable states');
equal(audit.matrixCell(63).status,'EXACT_RETURN','111111 exact');
equal(audit.matrixCell(31).status,'HOLD_CAPTURE','capture bit maps to hold');
equal(audit.matrixCell(47).status,'HOLD_MISSING_TOUCH','touch bit maps to hold');
equal(audit.matrixCell(55).status,'HOLD_CONFLICTING_WITNESS','witness bit maps to hold');
equal(audit.matrixCell(59).status,'HOLD_INVALID_KAPPA','kappa bit maps to hold');
equal(audit.matrixCell(61).status,'HOLD_REQUIRED_INFORMATION_UNAVAILABLE','availability bit maps to hold');
equal(audit.matrixCell(62).status,'HOLD_INCOMPLETE_CUT_Q','Cut Q bit maps to hold');
throws(()=>audit.gateBits(64),'mask above range rejected');

const trace=adapter.trace(record,'physics','c10');
equal(trace.selection.count,18,'physics c10 count');
equal(trace.selection.total,70,'physics total');
equal(trace.normalization.basis.im,-1,'c10 is negative imaginary basis');
equal(trace.joint.feedback,false,'trace has no feedback');

const captured=adapter.capture(record);
const result=audit.audit({jointRecord:record,capture:captured,currentRecord:record,domain:'physics',channel:'c10',large:63,small:1,touch:true,witness:true,side:'R'});
equal(result.status,'EXACT_RETURN','full audit exact');
check(result.exact,'full audit exact boolean');
equal(result.port.ordinal,3,'physics is port ordinal three');
equal(result.port.ordinal_is_address,false,'ordinal is not address');
equal(result.port.address_series.join(','),'1031,1032,1033','address family remains separate');
equal(result.trace.selection.channel,'c10','selected channel retained');
equal(result.ratio.normalized,'63/64 | 1/64','normalization declared');
equal(result.cut_q_receipt.tesa_lissajous_window.selected.address,8,'TESA midpoint selects 8');
equal(result.cut_q_receipt.tesa_lissajous_window.selected.plane,'VM','TESA selects VM');
equal(result.cut_q_receipt.tesa_lissajous_window.selected.pair,'YZ','TESA selects YZ');
equal(result.contracts.feedback,false,'no feedback');
equal(result.contracts.writes_source,false,'no source writes');
equal(result.contracts.new_ids.length,0,'no new ids');
equal(result.contracts.new_aliases.length,0,'no new aliases');
equal(result.contracts.new_relations.length,0,'no new relations');
equal(result.contracts.identity_reuse.length,2,'two identities reused');

const changed=adapter.normalize({generation:8,snapshots:{
  chemistry:{generation:8,ledger:ledger(62,2,0,0)},life:{generation:8,ledger:ledger(31,1,31,1)},physics:{generation:8,ledger:ledger(16,17,18,19)}
}},{observedAt:'2026-11-01T00:00:01.000Z'});
const rejected=audit.audit({jointRecord:record,capture:captured,currentRecord:changed,touch:true,witness:true});
equal(rejected.status,'REJECT_CHANGED_SOURCE','changed source rejected');
check(!rejected.exact,'changed source not exact');
const unavailable=audit.audit({jointRecord:record,capture:captured,currentRecord:record,channel:'c10',unavailableKeys:['c10'],requireSelected:true,touch:true,witness:true});
equal(unavailable.status,'HOLD_REQUIRED_INFORMATION_UNAVAILABLE','selected U blocks return');
const conflict=audit.audit({jointRecord:record,capture:captured,currentRecord:record,touch:true,witness:false});
equal(conflict.status,'HOLD_CONFLICTING_WITNESS','conflicting witness blocks audit');
const incompleteCut=audit.audit({jointRecord:record,capture:captured,currentRecord:record,touch:true,witness:true,tamper:true});
equal(incompleteCut.status,'HOLD_INCOMPLETE_CUT_Q','incomplete Cut Q has explicit hold status');
check(!incompleteCut.exact,'incomplete Cut Q is not exact');
equal(cut.evaluate({touched:['C1','C2','C3'],witness:true}).status,'INVARIANT_CANDIDATE','existing Cut/Q contract still passes');

const battery=audit.exhaustiveBattery(record);
check(battery.pass,'exhaustive battery passes');
equal(battery.counts.cases,1536,'64 by 3 by 4 by 2 cases');
equal(battery.counts.exact,24,'one exact state per route');
equal(battery.counts.hold,1512,'remaining cases hold');
equal(battery.counts.mismatches,0,'matrix and audit agree');
equal(battery.counts.ports.chemistry,512,'chemistry route count');
equal(battery.counts.ports.life,512,'life route count');
equal(battery.counts.ports.physics,512,'physics route count');
equal(battery.counts.channels.c00,384,'channel route count');
equal(battery.counts.sides.L,768,'left side route count');
equal(battery.counts.sides.R,768,'right side route count');

const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
check(html.includes('id="jointControlReturnAudit"'),'bench host installed');
check(html.includes('a0-joint-control-return-audit.css'),'bench CSS linked');
check(html.includes('a0-joint-control-return-audit.js'),'bench JS linked');
check(html.includes('id="jcraReturnMatrix"'),'64-state matrix installed');
check(html.includes('id="jcraBatteryRun"'),'1536-case battery control installed');
const desk=fs.readFileSync(path.join(__dirname,'A0_RESEARCH_DESK.html'),'utf8');
check(desk.includes('joint-control-return-audit-20261101'),'science return installed');
const builder=fs.readFileSync(path.join(__dirname,'A0_BUILDER_LOG.html'),'utf8');
check(builder.includes('joint-control-return-audit-20261101'),'builder return installed');

console.log(JSON.stringify({suite:'A0_JOINT_CONTROL_RETURN_AUDIT',status:'PASS',checks,identity:audit.IDENTITY,ilau_identity:audit.ILAU_ID,no_graph_mutation:true},null,2));
