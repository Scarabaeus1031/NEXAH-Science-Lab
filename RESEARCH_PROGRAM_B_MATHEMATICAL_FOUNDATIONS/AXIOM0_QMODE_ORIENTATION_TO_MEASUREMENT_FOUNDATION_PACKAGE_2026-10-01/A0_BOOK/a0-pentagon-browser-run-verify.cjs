'use strict';
// Offline integrity/contract verification of an owner-exported UI run, not browser automation.
const fs=require('node:fs'),path=require('node:path'),a=require('node:assert/strict'),P=require('./a0-pentagon-contract.js');
function verify(r){
 a.equal(r.schema,'nexah.a0.pentagon-joint-demo/1');
 a.equal(r.run.status,'COMPLETE');a.equal(r.run.confirmed,10);a.equal(r.run.phase,'RECORD');
 const v=r.run.acceptance;a.equal(v.status,'MASTER_PENT_UI_RETURN_EXACT');
 const baseline=P.witness(v.baseline),phases=Object.keys(P.MASTER_CUES);
 a.deepEqual(v.confirmedCues,phases);a.equal(r.pentagon.status,'READY');a.equal(r.pentagon.pending,null);
 const h=r.pentagon.history,start=h.map(e=>e.kind==='MASTER_CUE'&&e.phase==='SOURCE').lastIndexOf(true);a.ok(start>=0);
 const events=h.slice(start);let current=baseline,phaseIndex=0,awaiting=null,lastSeq=null,sets=0,returns=0,receipt=null;
 for(const e of events){
  if(e.kind==='MASTER_CUE'){
   a.equal(awaiting,null,'previous cue must be confirmed first');a.equal(e.phase,phases[phaseIndex++]);awaiting=e.phase;
  }else if(e.kind==='ACK'){
   a.ok(awaiting,'ACK must follow one cue');a.ok(Number.isSafeInteger(e.seq)&&e.seq>0);
   if(lastSeq!==null)a.equal(e.seq,lastSeq+1);lastSeq=e.seq;
   const w=P.witness(e.witness),action=awaiting==='RECORD'?'RETURN':'SET';a.equal(e.action,action);
   a.equal(w.revision,current.revision+1);a.deepEqual(w.state,action==='RETURN'?baseline.state:P.master(current.state,awaiting));
   if(action==='SET')sets++;else{returns++;a.deepEqual(v.receipt.before,current);}
   current=w;awaiting=null;
  }else if(e.kind==='RETURN'){
   a.equal(phaseIndex,10);a.equal(awaiting,null);a.equal(returns,1);a.equal(receipt,null);receipt=e.receipt;
  }else a.fail('Unaccepted event in successful run: '+e.kind);
 }
 a.equal(phaseIndex,10);a.equal(awaiting,null);a.equal(sets,9);a.equal(returns,1);
 a.deepEqual(receipt,v.receipt);a.deepEqual(receipt,r.pentagon.returnReceipt);a.equal(receipt.status,'UI_STATE_RETURN_EXACT');
 a.equal(receipt.anchor.kind,'MASTER_START_UI_ANCHOR');a.equal(receipt.anchor.sourceHash,P.SOURCE_HASH);a.equal(receipt.anchor.revision,baseline.revision);
 a.deepEqual(receipt.anchor.state,baseline.state);a.deepEqual(receipt.after,current);a.deepEqual(current.state,baseline.state);
 a.deepEqual(P.witness(r.pentagon.currentWitness),current);a.equal(receipt.historyEqual,false);a.equal(receipt.full106NodeAddressProvided,false);
 return{status:'PASS',scope:'MASTER_PENT_UI_RUN_ONLY',confirmedCues:phases,acknowledgements:{SET:sets,RETURN:returns},startRevision:baseline.revision,endRevision:current.revision,returnStatus:receipt.status,wholeMachineAccepted:false,scientificClaimsAccepted:false};
}
module.exports={verify};
if(require.main===module){try{const file=process.argv[2]||path.join(__dirname,'results/a0-pentagon-joint-browser-run-2026-10-17.json');console.log(JSON.stringify(verify(JSON.parse(fs.readFileSync(file,'utf8'))),null,2));}catch(e){console.error('FAIL: '+e.message);process.exitCode=1;}}
