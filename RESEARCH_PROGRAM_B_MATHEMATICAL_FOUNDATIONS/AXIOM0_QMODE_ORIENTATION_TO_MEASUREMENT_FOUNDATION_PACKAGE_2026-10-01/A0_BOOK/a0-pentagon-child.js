/* Installed only in the separately generated runtime derivative, never in the frozen source. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0PentagonChild=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function install(env,api,P){
 let session=null,revision=0,lastSeq=0;
 const witness=()=>P.witness({sourceHash:P.SOURCE_HASH,revision,state:api.getState(),rendered:api.readRendered(),phase:P.phase(api.getState().branchWord),resultText:api.resultText(),svgElements:api.svgElements()});
 const send=(type,seq,extra={})=>{if(session)env.parent.postMessage({protocol:P.PROTOCOL,session,type,seq,...extra},'*');};
 env.addEventListener('message',event=>{
  const m=event.data;if(event.source!==env.parent||!m||m.protocol!==P.PROTOCOL||typeof m.session!=='string'||!/^[a-f0-9]{32}$/.test(m.session)||!Number.isSafeInteger(m.seq)||m.seq<=0)return;
  if(m.action==='HELLO'){
   if(session&&session!==m.session)return;
   session=m.session;if(m.seq<=lastSeq)return;lastSeq=m.seq;
   try{send('READY',m.seq,{witness:witness()});}catch(e){send('ERROR',m.seq,{error:e.message});}return;
  }
  if(m.session!==session||m.seq<=lastSeq)return;lastSeq=m.seq;
  try{
   if(m.action==='READ'){send('ACK',m.seq,{witness:witness()});return;}
   if(m.action!=='SET'&&m.action!=='RETURN')throw Error('unsupported action');
   if(m.baseRevision!==revision)throw Error('revision conflict');
   const next=P.state(m.state);api.setState(next);revision++;
   const w=witness();if(!P.equal(w.state,next))throw Error('target/readback mismatch');
   send('ACK',m.seq,{witness:w,operation:m.action});
  }catch(e){send('ERROR',m.seq,{error:e.message});}
 });
 // Native Explorer interactions call this through its original save() method.
 env.__pentagonNativeChange=()=>{revision++;try{send('CHANGED',0,{witness:witness()});}catch(e){send('ERROR',0,{error:e.message});}};
 for(const kind of ['pointerdown','keydown','wheel','touchmove'])env.addEventListener(kind,()=>send('INTERACTION',0),{passive:true});
 return{witness};
}
return{install};
});
