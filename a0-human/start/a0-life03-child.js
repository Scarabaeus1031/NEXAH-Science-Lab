/* Only installed in the source-derived sandbox, never in the original LIFE03. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Life03Child=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function install(env,api,P){
 let session=null,revision=0,lastSeq=0,anchor=null;
 const witness=()=>P.witness({sourceHash:P.SOURCE_HASH,revision,state:api.snapshot(),rendered:api.readRendered(),timerRunning:api.timerRunning()});
 const send=(type,seq,extra={})=>{if(session)env.parent.postMessage({protocol:P.PROTOCOL,session,type,seq,...extra},'*');};
 api.stop();
 env.addEventListener('message',event=>{
  const m=event.data;if(event.source!==env.parent||!m||m.protocol!==P.PROTOCOL||typeof m.session!=='string'||!/^[a-f0-9]{32}$/.test(m.session)||!Number.isSafeInteger(m.seq)||m.seq<=0)return;
  if(m.action==='HELLO'){
   if(session&&session!==m.session)return;session=m.session;if(m.seq<=lastSeq)return;lastSeq=m.seq;
   try{api.stop();send('READY',m.seq,{witness:witness()});}catch(e){send('ERROR',m.seq,{error:e.message});}return;
  }
  if(m.session!==session||m.seq<=lastSeq)return;lastSeq=m.seq;
  try{
   if(!['READ','STOP'].includes(m.action)&&m.baseRevision!==revision)throw Error('revision conflict');
   api.stop();
   if(!['READ','CAPTURE','STEP','VIEW','RETURN','STOP'].includes(m.action))throw Error('unsupported action');
   if(m.action==='CAPTURE')anchor=P.state(api.snapshot());
   if(m.action==='STEP'){if(api.snapshot().work.macro>=32)throw Error('32 generation engineering ceiling');api.step();revision++;}
   if(m.action==='VIEW'){if(!P.MODES.includes(m.mode))throw Error('invalid view');api.view(m.mode);revision++;}
   if(m.action==='RETURN'){if(!anchor||!P.equal(anchor,P.state(m.anchor)))throw Error('matching source-owned anchor required');api.restore(P.copy(anchor));revision++;}
   const w=witness();if(m.action==='RETURN'&&!P.equal(w.state,anchor))throw Error('full source return mismatch');
   send('ACK',m.seq,{operation:m.action,witness:w});
  }catch(e){api.stop();send('ERROR',m.seq,{error:e.message});}
 });
 return {witness};
}
return {install};
});
