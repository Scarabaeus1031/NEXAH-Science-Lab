(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./assets/a0-caro-native-source-v1.js'):root.A0CaroNativeSource);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0CaroBench=api})(typeof globalThis==='undefined'?this:globalThis,function(P){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x)),canonical=x=>x&&typeof x==='object'?Array.isArray(x)?'['+x.map(canonical).join(',')+']':'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
  function valid(s){if(!s||Object.keys(s).sort().join(',')!=='closed,theme,time'||typeof s.closed!=='boolean'||!['dark','light'].includes(s.theme)||!Number.isFinite(s.time)||s.time<0||s.time>1000000)throw Error('INVALID: CARO state');return s}
  function create(){let state={closed:false,theme:'dark',time:0},anchor=null,events=[];
    function command(type,payload={}){if(events.length>=128)throw Error('HOLD: journal full; export before reset');if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('INVALID: payload');let next=clone(state),nextAnchor=clone(anchor);
      if(type==='SET'){if(!Object.keys(payload).length||Object.keys(payload).some(k=>!['closed','theme','time'].includes(k)))throw Error('INVALID: SET fields');next=valid({...next,...payload});}
      else{if(Object.keys(payload).length)throw Error('INVALID: unexpected payload');if(type==='CAPTURE')nextAnchor=clone(state);else if(type==='RETURN'){if(!anchor)throw Error('HOLD: capture required');next=clone(anchor);}else throw Error('INVALID: command');}
      state=next;anchor=nextAnchor;events.push({type,payload:clone(payload)});return snapshot();
    }
    function snapshot(){return clone(state)}
    function record(){return{schema:'a0.caro-bench/1',source:{html:P.source_sha256,svg:P.svg_sha256,css:P.css_sha256},state:snapshot(),anchor:clone(anchor),events:clone(events),boundary:'Local saved-state restoration; no inverse law, authentication or historical chronology proof. Animation position is presentation time, not source dynamics.'}}
    return{snapshot,command,record};
  }
  function verify(r){try{if(!r||r.schema!=='a0.caro-bench/1'||!Array.isArray(r.events)||r.events.length>128)throw Error('record schema / bound');const e=create();for(const event of r.events){if(!event||Object.keys(event).sort().join(',')!=='payload,type')throw Error('event fields');e.command(event.type,event.payload);}if(canonical(e.record())!==canonical(r))throw Error('source replay differs');return{status:r.anchor?'PASS':'HOLD',state:e.snapshot()};}catch(e){return{status:'INVALID',reason:e.message}}}
  return{create,verify,canonical,valid};
});
