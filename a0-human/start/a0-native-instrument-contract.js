(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0NativeInstrumentContract=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='nexah.a0.native-instrument/1',copy=x=>JSON.parse(JSON.stringify(x));
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function integer(value,min,max){if(!Number.isInteger(value)||value<min||value>max)throw Error('integer outside ['+min+','+max+']');return value}
  function keys(value,allowed){if(!value||typeof value!=='object'||Array.isArray(value)||!Object.keys(value).length||Object.keys(value).some(k=>!allowed.includes(k)))throw Error('unknown or empty SET fields')}
  function create(adapter){
    let seq=0,anchor=null,witness=null,hold=false,audit=[],subscribers=new Set(),busy=false;
    const snapshot=()=>copy(adapter.snapshot());
    function reply(command,ok=true,error=null){
      const state=snapshot();if(witness&&!equal(state,anchor.state))witness=null;
      return copy({schema:SCHEMA,source:adapter.source,seq,command,ok,error,hold,scope:adapter.scope,capabilities:adapter.capabilities,state,reading:adapter.read(),checkpoint:anchor?anchor.token:null,returnWitness:witness,audit});
    }
    function publish(){if(busy)return;const value=reply('NATIVE_READ');for(const fn of subscribers){try{fn(copy(value))}catch(_){/* A host observer cannot alter source execution. */}}}
    function dispatch(request){
      const command=request?.command;seq++;busy=true;let ok=true,error=null;
      try{
        if(!['READ','CAPTURE','RETURN',...adapter.capabilities].includes(command))throw Error('unsupported command');
        if(hold&&command!=='READ')throw Error('HOLD: READ required');
        adapter.pause();
        if(command==='READ')hold=false;
        else if(command==='CAPTURE'){anchor={token:adapter.source+':'+seq,state:snapshot()};witness=null;}
        else if(command==='RETURN'){
          witness=null;
          if(!anchor||request.checkpoint!==anchor.token)throw Error('missing or stale source checkpoint');
          adapter.restore(copy(anchor.state));
          const actual=snapshot();if(!equal(actual,anchor.state))throw Error('source Return readback mismatch');
          witness={checkpoint:anchor.token,seq,scope:adapter.scope,exact:true,wholeMachine:false};
        }else{witness=null;adapter.apply(command,copy(request.payload??{}));}
      }catch(e){hold=true;witness=null;ok=false;error=e.message;}
      audit.push({seq,command:typeof command==='string'?command:'INVALID',ok,error});audit=audit.slice(-96);busy=false;
      const result=reply(command,ok,error);publish();return result;
    }
    return {schema:SCHEMA,source:adapter.source,dispatch,publish,subscribe(fn){subscribers.add(fn);return()=>subscribers.delete(fn);}};
  }
  function install(win,api){
    if(!win.addEventListener||win.parent===win)return ()=>{};
    let token=null,lastId=0;
    const send=(target,id,ack)=>target.postMessage({protocol:'A0_NATIVE_INSTRUMENT_V1',token,id,source:api.source,ack},'*');
    function receive(event){
      const data=event.data;
      if(event.source!==win.parent||!data||data.protocol!=='A0_NATIVE_INSTRUMENT_V1'||typeof data.token!=='string'||!/^[a-f0-9]{32}$/.test(data.token)||!Number.isSafeInteger(data.id)||data.id<1)return;
      if(data.connect===true){if(data.request?.command!=='READ'||data.token===token&&data.id<=lastId)return;token=data.token;lastId=0;}
      if(data.token!==token||data.id<=lastId)return;lastId=data.id;
      send(event.source,data.id,api.dispatch(data.request));
    }
    win.addEventListener('message',receive);
    const stop=api.subscribe(value=>{if(token)send(win.parent,0,value)});
    return ()=>{stop();win.removeEventListener('message',receive)};
  }
  return {SCHEMA,copy,equal,integer,keys,create,install};
});
