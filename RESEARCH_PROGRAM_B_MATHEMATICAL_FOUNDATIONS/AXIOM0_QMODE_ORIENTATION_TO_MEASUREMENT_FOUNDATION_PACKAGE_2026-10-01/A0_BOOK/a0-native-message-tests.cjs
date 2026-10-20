'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),C=require('./a0-native-instrument-contract.js'),B=require('./a0-native-source-bank.js'),fixture=require('./a0-native-instrument-tests.cjs');
let checks=0;const ok=(v,msg)=>{assert.ok(v,msg);checks++};
function surface(){
  const listeners=new Set(),timers=new Map();let n=0;
  return {crypto:{getRandomValues:a=>crypto.randomFillSync(a)},listeners,timers,
    addEventListener(k,fn){if(k==='message')listeners.add(fn)},
    removeEventListener(k,fn){listeners.delete(fn)},
    setTimeout(fn){timers.set(++n,fn);return n},clearTimeout(id){timers.delete(id)},
    deliver(event){for(const fn of [...listeners])fn(event)}};
}
class Element extends fixture.Element{constructor(tag){super(tag);this.disabled=false}fire(k){if(!this.disabled)for(const fn of this.events[k]||[])fn({target:this})}}
(async()=>{
  const win=surface(),child=surface(),native=fixture.source(fixture.janusFile);
  const parentProxy={postMessage:data=>queueMicrotask(()=>win.deliver({source:childProxy,data}))};
  const childProxy={postMessage:data=>queueMicrotask(()=>child.deliver({source:parentProxy,data}))};
  Object.defineProperty(childProxy,'A0NativeInstrument',{get(){throw Error('opaque origin')}});
  child.parent=parentProxy;const stop=C.install(child,native.api);
  const host=new Element('section'),doc={getElementById:id=>id==='nativeSourceBank'?host:null,createElement:tag=>new Element(tag)},bank=B.mount(doc,win);
  function all(){const result=[];const walk=e=>{result.push(e);for(const c of e.children||[])walk(c)};walk(host);return result}
  const named=t=>all().find(e=>e.textContent===t),choice=all().find(e=>e.id==='nativeBankChoice');
  choice.value='janus';choice.fire('change');named('Quell-HTML hier laden').fire('click');
  const slot=all().find(e=>e.className==='native-bank-slot'),frame=slot.children[0];frame.contentWindow=childProxy;frame.fire('load');
  ok((await bank.send('READ')).ok,'opaque-origin READ uses source message contract');
  const capture=await bank.send('CAPTURE');ok(capture.ok,'remote capture');
  const changed=await bank.send('STEP');ok(changed.state.k===1,'remote source STEP changes native model');
  const returned=await bank.send('RETURN');ok(returned.returnWitness.exact&&returned.state.k===capture.state.k,'remote source + host Return verification');
  ok(win.timers.size===0,'ack timeouts cleared');
  const snapshot=bank.snapshot().hostSeq;
  native.api.dispatch({command:'STEP'});await new Promise(resolve=>setImmediate(resolve));
  ok(bank.snapshot().hostSeq>snapshot,'native pushes reach host over messages');
  named('Quelle entladen · Sitzung verwerfen').fire('click');ok(win.listeners.size===0,'unload removes host transport listener');
  stop();ok(child.listeners.size===0,'source transport cleanup');
  const timeoutWin=surface(),fakeFrame={contentWindow:{postMessage(){}}},remote=B.remote(timeoutWin,fakeFrame,'expected.html');
  const pending=remote.dispatch({command:'READ'}).then(()=>false,()=>true);
  timeoutWin.deliver({source:{},data:{protocol:'A0_NATIVE_INSTRUMENT_V1',id:1,ack:{ok:true}}});
  for(const timer of [...timeoutWin.timers.values()])timer();
  ok(await pending,'foreign source / unconfirmed ACK never succeeds');
  remote.disconnect();ok(timeoutWin.listeners.size===0,'timeout cleanup');
  console.log(JSON.stringify({status:'PASS',checks,transport:'simulated opaque-origin postMessage using actual native source API',browserAcceptance:false}));
})().catch(error=>{console.error(error);process.exitCode=1});
