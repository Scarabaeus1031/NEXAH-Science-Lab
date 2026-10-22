(function(root,factory){const P=typeof module==='object'&&module.exports?require('./a0-life03-contract.js'):root.A0Life03Contract;const api=factory(P);if(typeof module==='object'&&module.exports)module.exports=api;root.A0Life03BenchAdapter=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P){
'use strict';
const URL_PATH='assets/a0-life03-runtime.html';
function create(env){
 let status='NOT_LOADED',session=null,seq=0,pending=null,last=null,anchor=null,receipt=null,follow=false;
 const trace=[],listeners=new Set(),copy=P.copy;
 const record=()=>({schema:'nexah.a0.life03-bench/1',sourceHash:P.SOURCE_HASH,status,followMaster:follow,pending:pending?{seq:pending.seq,action:pending.action}:null,lastConfirmed:last?copy(last):null,currentWitness:status==='READY'&&!pending&&last?copy(last):null,anchor:anchor?copy(anchor):null,returnReceipt:receipt?copy(receipt):null,history:copy(trace),scope:'Bounded Blinker 64×64; full declared Life history, E8 state, projection records, mode and speed. Audit history and revision continue; no general machine or scientific acceptance.'});
 const notify=()=>{const r=record();env.changed?.(r);for(const fn of listeners)fn(r);};
 function pause(reason){follow=false;env.pauseMaster?.(reason);}
 function fail(reason){status='HOLD';trace.push({kind:'HOLD',reason});pause(reason);if(pending){const p=pending;pending=null;env.clearTimeout(p.timer);p.reject(Error(reason));}notify();}
 function request(action,value){
  if(pending)return Promise.reject(Error('LIFE03 request pending'));
  if(!session)return Promise.reject(Error('LIFE03 not loaded'));
  if(action!=='HELLO'&&!last)return Promise.reject(Error('source witness required'));
  const n=++seq,previous=last?copy(last):null;status='WAITING';
  return new Promise((resolve,reject)=>{
   pending={seq:n,action,value,previous,resolve,reject,timer:env.setTimeout(()=>fail('LIFE03 acknowledgement timeout'),4000)};
   const message={protocol:P.PROTOCOL,session,seq:n,action,baseRevision:last?.revision??0};
   if(action==='VIEW')message.mode=value;
   if(action==='RETURN')message.anchor=P.state(anchor.state);
   notify();try{env.send(message);}catch(e){fail(e.message);}
  });
 }
 function receive(event){
  const m=event.data;if(!env.isChild(event.source)||!m||m.protocol!==P.PROTOCOL||m.session!==session)return;
  if(!pending||m.seq!==pending.seq)return;
  if(m.type==='ERROR'){fail('source: '+String(m.error).slice(0,200));return;}
  if(!['READY','ACK'].includes(m.type))return;
  try{
   const p=pending,w=P.witness(m.witness),prior=p.previous;
   if((p.action==='HELLO')!==(m.type==='READY'))throw Error('unexpected acknowledgement');
   if(m.type==='ACK'&&m.operation!==p.action)throw Error('operation readback mismatch');
   if(prior&&w.revision<prior.revision)throw Error('stale source revision');
   if(['STEP','VIEW','RETURN'].includes(p.action)&&w.revision!==prior.revision+1)throw Error('revision increment mismatch');
   if(['CAPTURE','STOP'].includes(p.action)&&(!P.equal(w.state,prior.state)||w.revision!==prior.revision))throw Error('unexpected read-only state change');
   if(p.action==='VIEW'){const expected=copy(prior.state);expected.mode=p.value;if(!P.equal(w.state,expected))throw Error('view changed source state');}
   if(p.action==='STEP'){
    const a=prior.state,b=w.state,advance=a.mode!=='observer'||a.work.micro===7;
    if(b.mode!==a.mode||b.work.macro!==a.work.macro+(advance?1:0)||b.work.micro!==(a.mode==='observer'?(a.work.micro+1)%8:0))throw Error('step clock mismatch');
    if(!P.equal(b.work.life.history.slice(0,a.work.life.history.length),a.work.life.history)||!P.equal(b.work.records.slice(0,a.work.records.length),a.work.records))throw Error('trajectory prefix lost');
   }
   if(p.action==='RETURN'&&(!anchor||!P.equal(w.state,anchor.state)))throw Error('full source return mismatch');
   pending=null;env.clearTimeout(p.timer);last=w;status='READY';
   if(p.action==='CAPTURE'){anchor={kind:'SOURCE_START_ANCHOR',sourceHash:P.SOURCE_HASH,state:copy(w.state),revision:w.revision};receipt=null;}
   if(p.action==='RETURN'){receipt={status:'DECLARED_SOURCE_STATE_RETURN_EXACT',anchor:copy(anchor),after:copy(w),revisionReturns:false,auditHistoryReturns:false};trace.push({kind:'RETURN',receipt:copy(receipt)});}
   trace.push({kind:'ACK',action:p.action,seq:p.seq,witness:copy(w)});notify();p.resolve(copy(w));
  }catch(e){fail(e.message);}
 }
 function load(){if(pending)fail('source connection replaced');pause('LIFE03 reload');session=env.nonce();seq=0;last=null;anchor=null;receipt=null;status='LOADING';trace.push({kind:'LOAD',sourceHash:P.SOURCE_HASH});notify();env.load(URL_PATH);}
 function loaded(){return request('HELLO');}
 function connect(){
  if(status==='READY'&&!pending)return Promise.resolve(record());
  return new Promise((resolve,reject)=>{
   let timer;const done=r=>{if(!['READY','HOLD'].includes(r.status))return;listeners.delete(done);env.clearTimeout(timer);r.status==='READY'?resolve(r):reject(Error('LIFE03 connection HOLD'));};
   listeners.add(done);timer=env.setTimeout(()=>{listeners.delete(done);fail('LIFE03 connection timeout');reject(Error('LIFE03 connection timeout'));},8000);
   if(!['LOADING','WAITING'].includes(status))load();
  });
 }
 function setFollow(value){if(value&&(status!=='READY'||pending))throw Error('confirmed LIFE03 source required');follow=Boolean(value);notify();}
 function manual(action,value){if(status!=='READY'||pending)return Promise.reject(Error('ready LIFE03 required'));pause('LIFE03 manual command');if(action==='RETURN'&&!anchor)return Promise.reject(Error('capture source anchor first'));return request(action,value);}
 async function masterPhase(phase){
  if(!follow)return null;if(status!=='READY'||pending)throw Error('LIFE03 not ready for Master cue');
  const cue=P.CUES[phase];if(!cue)throw Error('unknown LIFE03 Master cue');
  if(phase!=='SOURCE'&&!anchor)throw Error('start at SOURCE to capture full source anchor');
  trace.push({kind:'MASTER_CUE',phase,action:cue[0]});return request(cue[0],cue[1]);
 }
 return {load,loaded,connect,receive,fail,setFollow,masterPhase,manual,read:()=>request('READ'),refresh:notify,exportRecord:record,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},isPending:()=>Boolean(pending),isFollowing:()=>follow,isReady:()=>status==='READY'};
}
function mount(win,doc){
 const $=id=>doc.getElementById(id),frame=$('life03Frame');if(!frame)return null;
 let demo=null,token=0,offset=0,starting=false;
 const emitRun=()=>{$('life03RunStatus').textContent=demo.message;$('life03RunStatus').dataset.status=demo.status;$('life03Progress').value=demo.confirmed;$('life03Start').disabled=['CONNECTING','RUNNING'].includes(demo.status);$('life03Pause').disabled=!['CONNECTING','RUNNING'].includes(demo.status);};
 demo={status:'IDLE',confirmed:0,message:'Bereit · noch kein Browser-PASS.',acceptance:null};
 const controller=create({
  nonce:()=>Array.from(win.crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join(''),
  load:url=>{frame.hidden=false;frame.src=url;},send:m=>frame.contentWindow.postMessage(m,'*'),isChild:s=>s===frame.contentWindow,
  setTimeout:win.setTimeout.bind(win),clearTimeout:win.clearTimeout.bind(win),pauseMaster:reason=>{win.A0Life03Master?.pause();if(!starting&&controller.exportRecord().status!=='HOLD')interrupt(reason);},
  changed:r=>{
   $('life03SourceStatus').textContent=r.status+(r.currentWitness?' · rev '+r.currentWitness.revision+' · Generation '+r.currentWitness.state.work.macro+' · '+r.currentWitness.state.mode:' · kein aktueller bestätigter Witness');
   if(r.currentWitness)$('life03View').value=r.currentWitness.state.mode;
   $('life03Witness').textContent=JSON.stringify({sourceHash:r.sourceHash,status:r.status,pending:r.pending,revision:r.lastConfirmed?.revision,generation:r.lastConfirmed?.state.work.macro,mode:r.lastConfirmed?.state.mode,returnReceipt:r.returnReceipt?{status:r.returnReceipt.status,anchorRevision:r.returnReceipt.anchor.revision,afterRevision:r.returnReceipt.after.revision}:null,scope:r.scope},null,2);
   for(const id of ['life03Step','life03View','life03Capture','life03Return'])$(id).disabled=r.status!=='READY'||Boolean(r.pending)||r.followMaster;
   $('life03Return').disabled=$('life03Return').disabled||!r.anchor;
   if(starting||!['CONNECTING','RUNNING'].includes(demo.status))return;
   if(r.status==='HOLD'){token++;demo.status='HOLD';demo.message='HOLD · '+r.history.at(-1)?.reason;demo.acceptance=null;win.A0Life03Master?.pause();emitRun();return;}
   if(demo.status!=='RUNNING')return;
   const events=r.history.slice(offset),cues=events.filter(e=>e.kind==='MASTER_CUE').map(e=>e.phase),acks=events.filter(e=>e.kind==='ACK');
   demo.confirmed=acks.length;
   const order=Object.keys(P.CUES),fresh=events.find(e=>e.kind==='ACK'&&e.action==='CAPTURE'),returned=r.returnReceipt;
   if(cues.length===10&&cues.every((x,i)=>x===order[i])&&acks.length===10&&acks.every((x,i)=>x.action===P.CUES[order[i]][0])&&fresh&&returned&&P.equal(returned.anchor.state,fresh.witness.state)&&P.equal(r.currentWitness?.state,fresh.witness.state)&&returned.after.revision>fresh.witness.revision&&!events.some(e=>e.kind==='HOLD')&&r.status==='READY'&&!r.pending){
    demo.status='COMPLETE';demo.message='10/10 bestätigt · DECLARED_SOURCE_STATE_RETURN_EXACT · Engineering-Lauf, Browser-Abnahme separat';demo.acceptance={status:'MASTER_LIFE03_DECLARED_SOURCE_RETURN_EXACT',baseline:fresh.witness,receipt:returned,cues};win.A0Life03Master?.pause();controller.setFollow(false);
   }else{demo.message=(cues.at(-1)||'SOURCE')+' · '+demo.confirmed+'/10 bestätigt'+(r.pending?' · warte auf Quelle':'');}
   emitRun();
  }
 });
 function interrupt(reason='Pause gedrückt'){
  if(!['CONNECTING','RUNNING'].includes(demo.status))return;token++;demo.status='PAUSED';demo.message=reason+' · kein vollständiger Lauf bestätigt';demo.acceptance=null;controller.setFollow(false);win.A0Life03Master?.pause();emitRun();
 }
 async function start(){
  if(['CONNECTING','RUNNING'].includes(demo.status))return;const id=++token;starting=true;demo={status:'CONNECTING',confirmed:0,message:'Verbinde LIFE03 und prüfe gesperrte Quelluhr …',acceptance:null};emitRun();
  win.A0Life03Master?.pause();controller.setFollow(false);
  try{
   const r=await controller.connect();if(id!==token)return;offset=r.history.length;demo.status='RUNNING';demo.message='SOURCE · frischer vollständiger Startanker';emitRun();
   win.A0Life03Master.start();starting=false; // synchronous mock messages are revisited once start finishes
   controller.refresh();
  }catch(e){if(id!==token)return;demo.status='HOLD';demo.message='HOLD · '+e.message;demo.acceptance=null;win.A0Life03Master?.pause();emitRun();}
  finally{if(id===token)starting=false;}
 }
 const safe=fn=>Promise.resolve().then(fn).catch(e=>controller.fail(e.message));
 frame.addEventListener('load',()=>{if(frame.getAttribute('src')===URL_PATH)safe(()=>controller.loaded());});
 win.addEventListener('message',event=>controller.receive(event));
 $('life03Load').addEventListener('click',()=>{interrupt('Neu verbinden');controller.load();});
 $('life03Start').addEventListener('click',start);$('life03Pause').addEventListener('click',()=>interrupt());
 for(const [id,action]of [['life03Step','STEP'],['life03Capture','CAPTURE'],['life03Return','RETURN']])$(id).addEventListener('click',()=>safe(()=>controller.manual(action)));
 $('life03View').addEventListener('change',()=>safe(()=>controller.manual('VIEW',$('life03View').value)));
 $('life03Export').addEventListener('click',()=>{
  const out={schema:'nexah.a0.life03-joint-run/1',run:P.copy(demo),life03:controller.exportRecord()},url=win.URL.createObjectURL(new win.Blob([JSON.stringify(out,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-life03-joint-run.json';a.click();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);
 });
 const reveal=()=>{if(win.location.hash==='#life03Workbench')$('life03Workbench').open=true;};reveal();win.addEventListener('hashchange',reveal);
 win.A0Life03JointDemo={start,interrupt,isActive:()=>['CONNECTING','RUNNING'].includes(demo.status),snapshot:()=>P.copy(demo)};
 emitRun();return controller;
}
return {create,mount,URL_PATH};
});
