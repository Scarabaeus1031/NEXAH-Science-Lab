(function(root,factory){const P=typeof module==='object'&&module.exports?require('./a0-pentagon-contract.js'):root.A0PentagonContract;const api=factory(P);if(typeof module==='object'&&module.exports)module.exports=api;root.A0PentagonJointDemoUI=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P){
'use strict';
const PHASES=Object.keys(P.MASTER_CUES);
function create(env){
 let token=0,starting=false,offset=0,baseline=null;
 let run={status:'IDLE',confirmed:0,phase:null,message:'Bereit · ein Klick verbindet und startet beide Instrumente.',acceptance:null};
 const snapshot=()=>JSON.parse(JSON.stringify(run)),emit=()=>env.changed(snapshot());
 function interrupt(reason='Manuell pausiert'){
  if(!['CONNECTING','RUNNING'].includes(run.status))return;
  token++;run.status='PAUSED';run.message=reason+' · „Neu starten“ beginnt wieder bei SOURCE.';run.acceptance=null;
  env.stopMaster();env.controller.setFollow(false);emit();
 }
 function observe(r){
  if(!['CONNECTING','RUNNING'].includes(run.status))return;
  if(starting&&run.status==='CONNECTING')return;
  if(r.status==='HOLD'){token++;run.status='HOLD';run.message='Verbindung angehalten · '+(r.history.at(-1)?.reason||'Source prüfen');run.acceptance=null;env.stopMaster();emit();return;}
  if(run.status!=='RUNNING'||starting)return;
  const events=r.history.slice(offset),cues=events.filter(e=>e.kind==='MASTER_CUE').map(e=>e.phase);
  const acknowledgements=events.filter(e=>e.kind==='ACK'&&['SET','RETURN'].includes(e.action));
  run.confirmed=acknowledgements.length;run.phase=cues.at(-1)||null;
  const returned=events.findLast(e=>e.kind==='RETURN')?.receipt;
  const ordered=cues.length===10&&cues.every((id,i)=>id===PHASES[i]);
  const complete=ordered&&acknowledgements.length===10&&acknowledgements.slice(0,9).every(e=>e.action==='SET')&&acknowledgements[9].action==='RETURN'&&r.status==='READY'&&returned?.status==='UI_STATE_RETURN_EXACT'&&returned.anchor.kind==='MASTER_START_UI_ANCHOR'&&P.equal(returned.anchor.state,baseline.state)&&P.equal(returned.after.state,baseline.state)&&P.equal(r.currentWitness.state,baseline.state)&&returned.after.revision>baseline.revision&&!events.some(e=>['HOLD','SOURCE_CHANGE'].includes(e.kind));
  if(complete){run.status='COMPLETE';run.message='Gemeinsamer Lauf bestanden · 10/10 Cues bestätigt · UI_STATE_RETURN_EXACT';run.acceptance={status:'MASTER_PENT_UI_RETURN_EXACT',baseline,receipt:returned,confirmedCues:cues,scope:'Six UI fields + rendered controls; no whole-machine or scientific acceptance'};env.stopMaster();env.controller.setFollow(false);}
  else if(!r.followMaster&&!starting){interrupt('Kopplung oder manueller Eingriff pausiert');return;}
  else run.message=(run.phase||'SOURCE')+' · '+run.confirmed+'/10 bestätigt'+(r.pending?' · warte auf Source-Rückmeldung':'');
  emit();
 }
 async function start(){
  if(['CONNECTING','RUNNING'].includes(run.status))return;
  const id=++token;starting=true;run={status:'CONNECTING',confirmed:0,phase:null,message:'Verbinde und prüfe Explorer …',acceptance:null};emit();
  env.stopMaster();env.controller.setFollow(false);
  try{
   const r=await env.controller.connect();if(id!==token)return;
   baseline=r.currentWitness;offset=r.history.length;run.status='RUNNING';run.message='Gemeinsamer Start · SOURCE';emit();
   env.startMaster();starting=false;observe(env.controller.exportRecord());
  }catch(e){if(id!==token)return;run.status='HOLD';run.message='Start nicht möglich · '+e.message;run.acceptance=null;env.stopMaster();emit();}
  finally{if(id===token)starting=false;}
 }
 env.controller.subscribe(observe);
 return{start,interrupt,snapshot,isActive:()=>['CONNECTING','RUNNING'].includes(run.status)};
}
function mount(win,doc,controller){
 const $=id=>doc.getElementById(id);if(!$('pentagonJointStart'))return null;
 const demo=create({controller,startMaster:()=>win.A0PentagonMaster.start(),stopMaster:()=>win.A0PentagonMaster.pause(),changed:r=>{
  $('pentagonJointStatus').textContent=r.message;$('pentagonJointStatus').dataset.status=r.status;
  $('pentagonJointProgress').value=r.confirmed;
  $('pentagonJointStart').disabled=['CONNECTING','RUNNING'].includes(r.status);
  $('pentagonJointStart').textContent=r.status==='IDLE'?'Verbinden & gemeinsame Demo starten':'Neu starten · gemeinsame Demo';
  $('pentagonJointPause').disabled=!['CONNECTING','RUNNING'].includes(r.status);
  $('pentagonJointResult').textContent=r.status==='COMPLETE'?'✓ Gemeinsamer UI-Lauf bestätigt. Browser-Abnahme weiterer Funktionen separat.':r.status==='PAUSED'?'Ⅱ Pausiert · kein vollständiger Lauf bestätigt.':r.status==='HOLD'?'! HOLD · kein vollständiger Lauf bestätigt.':'Abfolge: SOURCE → OPERATOR → EDGE → SHADOW → FAMILY → GRID → RETURN → FOLD → ROOT → RECORD';
 }});
 $('pentagonJointStart').addEventListener('click',()=>demo.start());$('pentagonJointPause').addEventListener('click',()=>demo.interrupt('Pause gedrückt'));
 $('pentagonJointExport').addEventListener('click',()=>{
  const r={schema:'nexah.a0.pentagon-joint-demo/1',run:demo.snapshot(),pentagon:controller.exportRecord()},url=win.URL.createObjectURL(new win.Blob([JSON.stringify(r,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-pentagon-joint-demo.json';a.click();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);
 });
 return demo;
}
return{create,mount};
});
