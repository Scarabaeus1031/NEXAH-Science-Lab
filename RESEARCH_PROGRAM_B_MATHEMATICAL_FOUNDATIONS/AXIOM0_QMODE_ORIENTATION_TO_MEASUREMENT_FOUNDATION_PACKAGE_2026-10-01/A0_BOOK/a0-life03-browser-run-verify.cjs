'use strict';
const P=require('./a0-life03-contract.js');
function verify(value){
 const fail=message=>{throw Error(message);},r=value?.life03,run=value?.run;
 if(value?.schema!=='nexah.a0.life03-joint-run/1'||!r||r.sourceHash!==P.SOURCE_HASH||r.status!=='READY'||r.pending||run?.status!=='COMPLETE')fail('completed compatible export required');
 const current=P.witness(r.currentWitness),history=r.history;
 if(!Array.isArray(history))fail('trace required');
 let start=-1;history.forEach((e,i)=>{if(e.kind==='MASTER_CUE'&&e.phase==='SOURCE')start=i;});
 if(start<0)fail('fresh SOURCE required');
 const events=history.slice(start),cues=events.filter(e=>e.kind==='MASTER_CUE'),acks=events.filter(e=>e.kind==='ACK'),phases=Object.keys(P.CUES);
 if(events.some(e=>e.kind==='HOLD')||cues.length!==10||acks.length!==10)fail('fresh ten-cue run required');
 const ordered=events.filter(e=>['MASTER_CUE','ACK'].includes(e.kind));
 if(ordered.length!==20)fail('unexpected cue trace');
 for(let i=0;i<10;i++){
  if(ordered[2*i]!==cues[i]||ordered[2*i+1]!==acks[i]||cues[i].phase!==phases[i]||cues[i].action!==P.CUES[phases[i]][0]||acks[i].action!==P.CUES[phases[i]][0])fail('cue / ACK order mismatch');
  P.witness(acks[i].witness);
  if(i&&acks[i].seq<=acks[i-1].seq)fail('sequence not increasing');
 }
 const first=acks[0].witness,last=acks[9].witness,receipt=events.findLast(e=>e.kind==='RETURN')?.receipt;
 if(!receipt||receipt.status!=='DECLARED_SOURCE_STATE_RETURN_EXACT'||receipt.anchor.kind!=='SOURCE_START_ANCHOR'||!P.equal(receipt.anchor.state,first.state)||receipt.anchor.revision!==first.revision||!P.equal(last.state,first.state)||!P.equal(current.state,first.state)||!P.equal(receipt.after,last)||last.revision<=first.revision)fail('fresh full source return mismatch');
 if(!P.equal(r.returnReceipt,receipt)||!P.equal(run.acceptance?.receipt,receipt)||!P.equal(run.acceptance?.baseline,first)||run.confirmed!==10)fail('display acceptance mismatch');
 return {status:'PASS',sourceHash:P.SOURCE_HASH,confirmedCues:10,fromRevision:first.revision,toRevision:last.revision,anchorGeneration:first.state.work.macro,scope:'full declared source snapshot and rendered controls, not pixel rendering or scientific acceptance'};
}
module.exports={verify};if(require.main===module){try{console.log(JSON.stringify(verify(JSON.parse(require('node:fs').readFileSync(process.argv[2],'utf8'))),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
