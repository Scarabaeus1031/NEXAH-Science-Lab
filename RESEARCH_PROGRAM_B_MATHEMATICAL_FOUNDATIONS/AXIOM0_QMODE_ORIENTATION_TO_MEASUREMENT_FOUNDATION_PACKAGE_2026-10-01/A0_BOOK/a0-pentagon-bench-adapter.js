(function(root,factory){const P=typeof module==='object'&&module.exports?require('./a0-pentagon-contract.js'):root.A0PentagonContract;const api=factory(P);if(typeof module==='object'&&module.exports)module.exports=api;root.A0PentagonBenchAdapter=api})(typeof globalThis!=='undefined'?globalThis:this,function(P){
'use strict';
const URL_PATH='assets/a0-pentagon-runtime.html';
function create(env){
 let status='NOT_LOADED',session=null,seq=0,pending=null,last=null,anchor=null,receipt=null,follow=false,masterAnchor=null;
 const trace=[],listeners=new Set();const copy=s=>JSON.parse(JSON.stringify(s));
 const record=()=>({schema:'nexah.a0.pentagon-bench-connection/1',sourceHash:P.SOURCE_HASH,status,followMaster:follow,pending:pending?{seq:pending.seq,action:pending.action}:null,lastConfirmed:last?copy(last):null,currentWitness:status==='READY'&&!pending&&last?copy(last):null,anchor:anchor?copy(anchor):null,returnReceipt:receipt?copy(receipt):null,history:copy(trace),scope:'Six Explorer UI fields and rendered control readback only; not the full 106-node carrier, pixel rendering or PENT evidence. History/revision do not return.'});
 const notify=()=>{const r=record();env.changed?.(r);for(const listener of listeners)listener(r);};
 const pause=reason=>{follow=false;env.pauseMaster?.(reason);};
 function fail(reason){
  status='HOLD';trace.push({kind:'HOLD',reason});pause(reason);
  if(pending){const p=pending;pending=null;env.clearTimeout(p.timer);p.reject(Error(reason));}notify();
 }
 function request(action,target){
  if(pending)return Promise.reject(Error('PENT request still pending'));
  if(!session)return Promise.reject(Error('PENT not loaded'));
  if(!['HELLO','READ'].includes(action)&&!last)return Promise.reject(Error('no source witness'));
  const n=++seq;status='WAITING';
  return new Promise((resolve,reject)=>{
   pending={seq:n,action,target:target?P.state(target):null,resolve,reject,timer:env.setTimeout(()=>fail('PENT acknowledgement timeout'),4000)};
   const message={protocol:P.PROTOCOL,session,seq:n,action};
   if(target){message.state=P.state(target);message.baseRevision=last.revision;}
   notify();try{env.send(message);}catch(e){fail(e.message);}
  });
 }
 function receive(event){
  const m=event.data;if(!env.isChild(event.source)||!m||m.protocol!==P.PROTOCOL||m.session!==session)return;
  if(m.type==='INTERACTION'){pause('PENT human interaction');notify();return;}
  if(m.type==='ERROR'){
   if((pending&&m.seq===pending.seq)||m.seq===0)fail('source: '+String(m.error).slice(0,250));return;
  }
  if(!['READY','ACK','CHANGED'].includes(m.type))return;
  if(m.type!=='CHANGED'&&(!pending||m.seq!==pending.seq))return;
  try{
   const w=P.witness(m.witness);if(last&&w.revision<last.revision)throw Error('stale source revision');
   if(m.type==='CHANGED'){
    if(m.seq!==0||!last||w.revision<=last.revision)return;
    last=w;trace.push({kind:'SOURCE_CHANGE',witness:copy(w)});pause('PENT source changed');
    if(pending){fail('source changed during pending request');return;}status='READY';notify();return;
   }
   const p=pending;
   if((p.action==='HELLO')!==(m.type==='READY'))throw Error('unexpected acknowledgement type');
   if(p.target&&(!P.equal(p.target,w.state)||w.revision!==last.revision+1))throw Error('target or revision readback mismatch');
   pending=null;env.clearTimeout(p.timer);last=w;status='READY';
   if(!anchor)anchor={sourceHash:P.SOURCE_HASH,revision:w.revision,state:copy(w.state),kind:'CONNECTION_ANCHOR'};
   trace.push({kind:'ACK',seq:p.seq,action:p.action,witness:copy(w)});notify();p.resolve(copy(w));
  }catch(e){fail(e.message);}
 }
 function load(){
  if(follow)pause('PENT explicit reload');
  if(pending)fail('connection replaced by explicit reload');
  session=env.nonce();seq=0;last=null;status='LOADING';follow=false;masterAnchor=null;trace.push({kind:'LOAD',sourceHash:P.SOURCE_HASH});notify();env.load(URL_PATH);
 }
 function loaded(){if(!session)return Promise.resolve(null);return request('HELLO');}
 function connect(){
  if(status==='READY'&&!pending)return Promise.resolve(record());
  return new Promise((resolve,reject)=>{
   let timer;const done=r=>{if(r.status!=='READY'&&r.status!=='HOLD')return;listeners.delete(done);env.clearTimeout(timer);if(r.status==='HOLD')reject(Error('PENT connection HOLD'));else resolve(r);};
   listeners.add(done);timer=env.setTimeout(()=>{listeners.delete(done);fail('PENT connection timeout');reject(Error('PENT connection timeout'));},8000);
   if(status!=='LOADING'&&status!=='WAITING')load();
  });
 }
 async function capture(){const w=await request('READ');anchor={sourceHash:P.SOURCE_HASH,revision:w.revision,state:copy(w.state),kind:'EXPLICIT_UI_ANCHOR'};receipt=null;notify();return copy(anchor);}
 async function apply(action,value){if(!last||status!=='READY')throw Error('confirmed ready PENT state required');const target=P.command(last.state,action,value);if(follow){pause('PENT manual command');masterAnchor=null;}return request('SET',target);}
 async function restore(target=anchor){
  if(!target||target.sourceHash!==P.SOURCE_HASH)throw Error('matching UI anchor required');
  const before=last?copy(last):null,s=P.state(target.state),w=await request('RETURN',s);
  receipt={status:P.equal(w.state,s)&&P.equal(w.rendered,s)?'UI_STATE_RETURN_EXACT':'HOLD',scope:'six fields + rendered controls',before,anchor:copy(target),after:w,historyEqual:false,full106NodeAddressProvided:false};
  trace.push({kind:'RETURN',receipt:copy(receipt)});notify();return copy(receipt);
 }
 async function importRecord(value){
  const r=value?.records?.pentagon||value;if(!r||r.schema!=='nexah.a0.pentagon-bench-connection/1'||r.sourceHash!==P.SOURCE_HASH||r.status!=='READY'||!r.currentWitness||r.pending)throw Error('confirmed compatible PENT export required');
  const w=P.witness(r.currentWitness);return restore({sourceHash:P.SOURCE_HASH,state:w.state,revision:w.revision,kind:'IMPORTED_UI_RECORD'});
 }
 function setFollow(value){if(value&&(status!=='READY'||pending))throw Error('load and verify PENT before following Master');if(!value&&follow)pause('PENT Master follow disabled');follow=Boolean(value);if(!follow)masterAnchor=null;notify();}
 async function masterPhase(id){
  if(!follow)return null;if(status!=='READY'||pending)throw Error('PENT not ready for Master cue');
  if(!Object.hasOwn(P.MASTER_CUES,id))throw Error('unknown Master phase');
  if(!masterAnchor)masterAnchor={sourceHash:P.SOURCE_HASH,revision:last.revision,state:copy(last.state),kind:'MASTER_START_UI_ANCHOR'};
  trace.push({kind:'MASTER_CUE',phase:id,rule:P.MASTER_CUES[id]});
  if(id==='RECORD'){const r=await restore(masterAnchor);masterAnchor=null;return r;}
  return request('SET',P.master(last.state,id));
 }
 async function masterReset(){if(!follow||!masterAnchor)return null;const result=await restore(masterAnchor);masterAnchor=null;return result;}
 return{load,loaded,connect,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},receive,capture,apply,restore,importRecord,setFollow,masterPhase,masterReset,read:()=>request('READ'),exportRecord:record,isPending:()=>Boolean(pending),isFollowing:()=>follow,isReady:()=>status==='READY',fail};
}
function mount(win,doc){
 const $=id=>doc.getElementById(id),frame=$('pentagonWorkbenchFrame');if(!frame)return null;
 const output=$('pentagonWorkbenchStatus');
 const safe=fn=>{Promise.resolve().then(fn).catch(e=>{if(controller.exportRecord().status!=='HOLD')controller.fail(e.message);output.textContent='HOLD · '+e.message;});};
 const controller=create({
  nonce:()=>Array.from(win.crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join(''),
  load:url=>{frame.hidden=false;frame.src=url;},send:m=>frame.contentWindow.postMessage(m,'*'),isChild:source=>source===frame.contentWindow,
  setTimeout:win.setTimeout.bind(win),clearTimeout:win.clearTimeout.bind(win),
  pauseMaster:reason=>win.A0PentagonPauseMaster?.(reason),
  changed:r=>{
   output.textContent=r.status+' · '+(r.lastConfirmed?'rev '+r.lastConfirmed.revision+' · '+r.lastConfirmed.state.mode+' · D'+(r.lastConfirmed.state.dRegister+1)+' · '+r.lastConfirmed.state.branchWord:'noch kein Source-Witness')+(r.returnReceipt?' · letzter Return: '+r.returnReceipt.status:'');
   $('pentagonFollowMaster').checked=r.followMaster;
   for(const id of ['pentagonRead','pentagonCapture','pentagonReturn','pentagonApplyView','pentagonLeft','pentagonRight','pentagonRotate','pentagonMirror','pentagonImport'])$(id).disabled=r.status!=='READY'||Boolean(r.pending);
   $('pentagonRead').disabled=!r.lastConfirmed||Boolean(r.pending);
   $('pentagonWitness').textContent=JSON.stringify({currentWitness:r.currentWitness,returnReceipt:r.returnReceipt,scope:r.scope},null,2);
  }
 });
 $('pentagonWorkbenchLoad').addEventListener('click',()=>controller.load());
 frame.addEventListener('load',()=>{if(frame.getAttribute('src')===URL_PATH)safe(()=>controller.loaded());});
 win.addEventListener('message',event=>controller.receive(event));
 $('pentagonRead').addEventListener('click',()=>safe(()=>controller.read()));$('pentagonCapture').addEventListener('click',()=>safe(()=>controller.capture()));$('pentagonReturn').addEventListener('click',()=>safe(()=>{controller.setFollow(false);return controller.restore();}));
 $('pentagonApplyView').addEventListener('click',()=>safe(()=>controller.apply('VIEW',$('pentagonView').value)));
 for(const [id,op]of [['pentagonLeft','LEFT'],['pentagonRight','RIGHT'],['pentagonRotate','D30_ROTATE'],['pentagonMirror','D30_MIRROR']])$(id).addEventListener('click',()=>safe(()=>controller.apply(op)));
 $('pentagonFollowMaster').addEventListener('change',()=>safe(()=>controller.setFollow($('pentagonFollowMaster').checked)));
 $('pentagonExport').addEventListener('click',()=>{const blob=new win.Blob([JSON.stringify(controller.exportRecord(),null,2)],{type:'application/json'}),url=win.URL.createObjectURL(blob),a=doc.createElement('a');a.href=url;a.download='a0-pentagon-bench-record.json';a.click();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);});
 $('pentagonImport').addEventListener('change',()=>safe(async()=>{const file=$('pentagonImport').files?.[0];if(!file)return;if(file.size>2_000_000)throw Error('PENT import too large');controller.setFollow(false);await controller.importRecord(JSON.parse(await file.text()));}));
 const reveal=()=>{if(win.location.hash==='#pentagonWorkbench')$('pentagonWorkbench').open=true;};reveal();win.addEventListener('hashchange',reveal);
 return controller;
}
return{URL_PATH,create,mount};
});
