(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0NativeFaceBench=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function mount(doc,win=doc.defaultView||{}){
    const frame=doc.getElementById('nativeFaceSourceFrame'),status=doc.getElementById('nativeFaceStatus'),readout=doc.getElementById('nativeFaceReadback');if(!frame||!status||!readout)throw Error('Native Face Bench mount missing');
    let ready=false,request=0,pending=new Map(),lastConfirmed=null,returnReceipt=null;
    function render(text){status.textContent=text;readout.textContent=JSON.stringify(lastConfirmed?.readback||lastConfirmed?.record||{status:text},null,2)}
    function command(command,payload={}){return new Promise((resolve,reject)=>{if(!frame.contentWindow)return reject(Error('source frame unavailable'));const requestId=`NFB-${++request}`;const timeout=win.setTimeout(()=>{pending.delete(requestId);reject(Error(`${command} timeout`))},4500);pending.set(requestId,{resolve,reject,timeout});frame.contentWindow.postMessage({channel:'A0_DODECA_SOURCE_COMMAND',requestId,command,payload},'*')})}
    win.addEventListener('message',event=>{if(event.source!==frame.contentWindow)return;const msg=event.data;if(msg?.channel==='A0_DODECA_SOURCE_READY'){ready=true;render('READY · native source');return}if(msg?.channel!=='A0_DODECA_SOURCE_REPLY')return;const slot=pending.get(msg.requestId);if(!slot)return;win.clearTimeout(slot.timeout);pending.delete(msg.requestId);if(msg.status==='HOLD')slot.reject(Error(msg.error||'source HOLD'));else{lastConfirmed=msg;if(msg.returnReceipt)returnReceipt=msg.returnReceipt;render(`${msg.status} · ${msg.command}`);slot.resolve(msg)}});
    async function connect(){const result=await command('HELLO');ready=true;return result}
    const capture=()=>command('CAPTURE');
    const read=()=>command('READ');
    const setFace=(face,hingeAngle=0)=>command('SET_FACE',{selected:Number(face),hingeAngle:Number(hingeAngle)});
    const restoreRecord=record=>command('RESTORE_RECORD',{record});
    const returnSource=()=>command('RETURN');
    doc.getElementById('nativeFaceConnect').addEventListener('click',()=>connect().catch(e=>render(`HOLD · ${e.message}`)));
    doc.getElementById('nativeFaceCapture').addEventListener('click',()=>capture().catch(e=>render(`HOLD · ${e.message}`)));
    doc.getElementById('nativeFaceApply').addEventListener('click',()=>setFace(doc.getElementById('nativeFaceSelect').value,doc.getElementById('nativeFaceHinge').value).catch(e=>render(`HOLD · ${e.message}`)));
    doc.getElementById('nativeFaceReturn').addEventListener('click',()=>returnSource().catch(e=>render(`HOLD · ${e.message}`)));
    doc.getElementById('nativeFaceHinge').addEventListener('input',event=>doc.getElementById('nativeFaceHingeOut').textContent=`${event.target.value}°`);
    render('WAITING · source frame');return Object.freeze({connect,capture,read,setFace,restoreRecord,returnSource,isReady:()=>ready,exportRecord:()=>lastConfirmed?.record||null,get record(){return lastConfirmed?.record||null},get returnReceipt(){return returnReceipt}});
  }
  return{mount};
});
