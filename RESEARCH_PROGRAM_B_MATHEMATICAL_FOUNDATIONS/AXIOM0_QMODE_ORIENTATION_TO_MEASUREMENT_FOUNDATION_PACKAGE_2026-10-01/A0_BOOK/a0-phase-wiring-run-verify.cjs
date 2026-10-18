'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),W=require('./a0-phase-wiring.js'),L=require('./a0-layered-pentagon-scene.js');
function verify(r){
  const errors=[];let checks=0;
  function check(fn,name){checks++;try{assert.ok(fn());}catch{errors.push(name);}}
  check(()=>r.schema==='nexah.a0.phase-wiring-run/1','schema');
  check(()=>r.status==='LOCAL_PHASE_READBACK','not HOLD');
  check(()=>L.validate(r.sourceScope.pose),'valid source pose');
  check(()=>JSON.stringify(r.current)===JSON.stringify(W.frame(r.sourceScope.pose,r.viewOptions)),'current frame matches declared source and view parameters');
  check(()=>Array.isArray(r.history)&&r.history.length>0&&r.history.length<=64&&Number.isInteger(r.dropped)&&r.dropped>=0,'bounded history');
  check(()=>r.history.every(x=>{const marker=W.frame(L.snapshot(x.phase)).resonator.marker;return Array.isArray(x.marker)&&x.marker.length===2&&marker.every((v,i)=>Math.abs(v-x.marker[i])<1e-9); }),'marker history formula');
  check(()=>r.history.at(-1).phase===r.current.phase,'trail endpoint matches current phase');
  check(()=>r.anchor&&r.returnWitness?.pass===true,'captured anchor and Return witness required');
  check(()=>JSON.stringify(r.returnWitness.readback)===JSON.stringify(r.anchor),'Return readback equals captured scoped anchor');
  check(()=>JSON.stringify({source:r.sourceScope,options:r.viewOptions,history:r.history,dropped:r.dropped})===JSON.stringify(r.anchor),'export remains at returned scoped anchor');
  check(()=>r.audit.length>0&&r.audit.length<=128&&r.audit.every((x,i)=>Number.isInteger(x.seq)&&(!i||x.seq>r.audit[i-1].seq)),'ordered bounded audit');
  check(()=>r.audit.some(x=>x.action==='capture'&&x.status==='ACK')&&r.audit.some(x=>x.action==='return'&&x.status==='ACK'),'capture and return recorded');
  check(()=>['endToEndBrowserAcceptance','nativeFaceBinding','iharaCoupling','gridBooking','originalRuntimeCoupling'].every(k=>r.evidence[k]===false),'no browser/native/whole-machine promotion');
  return{status:errors.length?'FAIL':'PASS',checks,errors,scope:'Internal consistency of exported local phase/pose Return only. Not independent browser dispatch, pixels, source identity or whole-machine acceptance.'};
}
module.exports={verify};
if(require.main===module){try{const result=verify(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));process.exitCode=result.status==='PASS'?0:1;}catch(e){console.error(e.message);process.exitCode=1;}}
