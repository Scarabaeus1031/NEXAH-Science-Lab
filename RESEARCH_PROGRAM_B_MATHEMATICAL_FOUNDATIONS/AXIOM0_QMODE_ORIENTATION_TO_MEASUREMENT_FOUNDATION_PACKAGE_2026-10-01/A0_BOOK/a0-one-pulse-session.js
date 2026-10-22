(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0OnePulseSession=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const TYPE='a0-one-pulse-source/1',copy=x=>JSON.parse(JSON.stringify(x)),count=x=>typeof x==='number'&&Number.isSafeInteger(x)&&x>=0;
 function valid(kind,f){if(!f||!Number.isInteger(f.generation)||f.generation<0||f.generation>240||typeof f.running!=='boolean'||!f.reading)return false;const r=f.reading;
  if(kind==='life')return['live','events','residual'].every(k=>count(r[k]));
  return kind==='domains'&&['chemistryEvents','chemistryResidual','lifeEvents','lifeResidual','physicsEvents','physicsResidual','kTellerTotal'].every(k=>count(r[k]))&&['jointRe','jointIm'].every(k=>typeof r[k]==='string'&&r[k].trim()!==''&&Number.isFinite(Number(r[k])))&&typeof r.iharaState==='string'&&r.iharaState.length>0&&r.iharaState.length<300&&count(r.blueBodyPhase)&&r.blueBodyPhase===f.generation%48&&r.atlasContract?.schema==='a0.three-domain-atlas-contracts/1'&&r.atlasContract.generation===f.generation&&r.atlasContract.rows?.length===9&&r.atlasContract.rows.every(x=>x.status==='FOLLOWING');
 }
 function create(env){
  let status='HOLD',reason='CONNECT_REQUIRED',current=null,sequence=0,revision=0,busy=null;const peers={},waiters={},listeners=new Set();let serial=0;
  const emit=()=>{for(const f of listeners)f(snapshot());},snapshot=()=>({schema:'a0.one-pulse-session/1',status,reason,sequence,current:current?copy(current):null,pending:Boolean(busy),wholeMachineReturn:false});
  function invalidate(why){revision++;status='HOLD';reason=why;current=null;for(const [kind,w] of Object.entries(waiters)){delete waiters[kind];env.clearTimeout(w.timer);w.reject(Error(why));}busy=null;emit();}
  function token(){return env.token();}
  function request(kind,action,value,rev){return new Promise((resolve,reject)=>{
   if(rev!==revision)return reject(Error('CANCELLED'));const p=peers[kind];if(!p||waiters[kind])return reject(Error('SOURCE_NOT_READY'));const id=++serial;
   const timer=env.setTimeout(()=>{if(waiters[kind]?.id===id)invalidate('TIMEOUT_'+kind);},3000);waiters[kind]={id,action,resolve,reject,timer};
   try{env.send(kind,{type:TYPE,session:p.session,id,action,value});}catch(_){invalidate('SEND_FAILED_'+kind);}
  });}
  function receive(kind,m){const p=peers[kind],w=waiters[kind];if(!p||!w||m?.type!==TYPE||m.session!==p.session||m.id!==w.id||m.kind!==kind)return false;
   if(typeof m.epoch!=='string'||!/^[a-f0-9]{32}$/.test(m.epoch)||w.action!=='hello'&&m.epoch!==p.epoch||m.status!=='ACK'||!valid(kind,m.frame)){invalidate('INVALID_ACK_'+kind);return false;}
   if(w.action==='hello')p.epoch=m.epoch;delete waiters[kind];env.clearTimeout(w.timer);p.frame=copy(m.frame);w.resolve(copy(m.frame));return true;
  }
  function transact(fn){if(busy)return busy;const rev=revision;status='WAIT';reason='ACK_PENDING';current=null;emit();
   const task=Promise.resolve().then(()=>{if(rev!==revision)throw Error('CANCELLED');return fn(rev);}).then(()=>{if(rev!==revision)throw Error('CANCELLED');const l=peers.life?.frame,d=peers.domains?.frame;if(!valid('life',l)||!valid('domains',d)||l.generation!==d.generation)throw Error('GENERATION_MISMATCH');
    current={generation:l.generation,life:copy(l),domains:copy(d),witnesses:{life:{session:peers.life.session,epoch:peers.life.epoch},domains:{session:peers.domains.session,epoch:peers.domains.epoch}},sequence:++sequence};status='CONNECTED';reason='SOURCE_ACKS_CONFIRMED';return copy(current);
   }).catch(e=>{if(rev===revision)invalidate(e.message);throw e;}).finally(()=>{if(busy===task)busy=null;emit();});busy=task;return task;
  }
  function connect(){invalidate('RECONNECT');for(const kind of ['life','domains'])peers[kind]={session:token(),epoch:null,frame:null};return transact(async rev=>{const l=await request('life','hello',undefined,rev);const d=await request('domains','hello',undefined,rev);if(d.generation!==l.generation)await request('domains','seek',l.generation,rev);});}
  function step(loop=false){if(status!=='CONNECTED'||!current||busy)return Promise.reject(Error('CONNECT_REQUIRED'));const before=current.generation;if(before===240&&!loop)return Promise.reject(Error('HORIZON'));const target=before===240?0:before+1;
   return transact(async rev=>{const l=await request('life',target===0?'seek':'step',target===0?0:undefined,rev);if(l.generation!==target)throw Error('LIFE_TARGET_MISMATCH');const d=await request('domains',target===0?'seek':'step',target===0?0:undefined,rev);if(d.generation!==target)throw Error('DOMAINS_TARGET_MISMATCH');});
  }
  function read(){if(busy)return busy;if(status!=='CONNECTED')return Promise.reject(Error('CONNECT_REQUIRED'));return transact(async rev=>{await request('life','read',undefined,rev);await request('domains','read',undefined,rev);});}
  function reset(){if(status!=='CONNECTED'||busy)return Promise.reject(Error('CONNECT_REQUIRED'));return transact(async rev=>{const l=await request('life','seek',0,rev),d=await request('domains','seek',0,rev);if(l.generation!==0||d.generation!==0)throw Error('RESET_TARGET_MISMATCH');});}
  return{connect,step,read,reset,receive,invalidate,snapshot,subscribe:f=>{listeners.add(f);return()=>listeners.delete(f);}};
 }
 return{TYPE,valid,create};
});
