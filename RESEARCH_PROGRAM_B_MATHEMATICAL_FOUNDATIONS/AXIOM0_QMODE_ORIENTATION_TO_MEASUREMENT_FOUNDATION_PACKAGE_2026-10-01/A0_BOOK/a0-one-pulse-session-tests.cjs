'use strict';
const assert=require('node:assert/strict'),S=require('./a0-one-pulse-session.js'),M=require('./a0-one-pulse-model.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=v=>{assert.ok(v);checks++;};
const frame=(kind,g)=>({generation:g,running:false,reading:kind==='life'?{live:4,events:2,residual:0}:{chemistryEvents:1,chemistryResidual:0,lifeEvents:2,lifeResidual:0,physicsEvents:3,physicsResidual:0,kTellerTotal:2,jointRe:'0.2',jointIm:'-0.1',iharaState:'a→b',blueBodyPhase:g%48,atlasContract:{schema:'a0.three-domain-atlas-contracts/1',generation:g,rows:Array.from({length:9},()=>({status:'FOLLOWING'}))}}});
function fixture(){let serial=0,nonce=0;const timers=new Map(),commands=[],g={life:0,domains:0},epoch={life:'a'.repeat(32),domains:'b'.repeat(32)};let mutate=null,drop=false,cancel=false;
 const env={token:()=> (++nonce).toString(16).padStart(32,'0'),setTimeout:f=>{timers.set(++serial,f);return serial;},clearTimeout:id=>timers.delete(id),send:(kind,m)=>{commands.push({kind,...m});if(drop)return;if(m.action==='step')g[kind]++;if(m.action==='seek')g[kind]=m.value;const msg={type:S.TYPE,session:m.session,id:m.id,kind,epoch:epoch[kind],status:'ACK',frame:frame(kind,g[kind])};if(mutate)mutate(msg);api.receive(kind,msg);if(cancel){cancel=false;api.invalidate('OPERATOR_PAUSE');}}};
 const api=S.create(env);return{api,timers,commands,g,epoch,setMutate:f=>mutate=f,drop:v=>drop=v,cancel:()=>cancel=true};}
(async()=>{
 const f=fixture();await f.api.connect();eq(f.api.snapshot().status,'CONNECTED');eq(f.timers.size,0);
 for(let i=1;i<=240;i++){await f.api.step();eq(f.api.snapshot().current.generation,i);eq(f.api.snapshot().current.domains.reading.blueBodyPhase,i%48);}
 await assert.rejects(f.api.step(),/HORIZON/);checks++;await f.api.step(true);eq(f.api.snapshot().current.generation,0);
 await f.api.read();eq(f.api.snapshot().current.life.reading.residual,0);const c=f.api.snapshot();c.current.generation=999;eq(f.api.snapshot().current.generation,0);
 f.drop(true);const pending=f.api.step();await Promise.resolve();eq(f.api.snapshot().current,null);eq(f.api.snapshot().status,'WAIT');
 const last=f.commands.at(-1);eq(f.api.receive('life',{type:S.TYPE,session:'bad',id:last.id,kind:'life'}),false);for(const fn of [...f.timers.values()])fn();await assert.rejects(pending,/TIMEOUT/);checks++;eq(f.api.snapshot().status,'HOLD');eq(f.api.snapshot().current,null);
 f.drop(false);await f.api.connect();eq(f.api.snapshot().status,'CONNECTED');
 f.setMutate(m=>{m.frame.reading=null;});await assert.rejects(f.api.read(),/INVALID_ACK/);checks++;eq(f.api.snapshot().current,null);f.setMutate(null);
 await f.api.connect();f.setMutate(m=>{if(m.kind==='domains')m.epoch='c'.repeat(32);});await assert.rejects(f.api.step(),/INVALID_ACK/);checks++;f.setMutate(null);
 await f.api.connect();f.cancel();const before=f.commands.length;await assert.rejects(f.api.step(),/CANCELLED|OPERATOR_PAUSE/);checks++;eq(f.commands.slice(before).filter(x=>x.kind==='domains').length,0);
 await f.api.connect();f.setMutate(m=>{if(m.kind==='life')m.frame.generation--;});await assert.rejects(f.api.step(),/TARGET_MISMATCH/);checks++;f.setMutate(null);
 await f.api.connect();await f.api.reset();eq(f.api.snapshot().current.generation,0);eq(f.timers.size,0);
 eq(S.valid('life',frame('life',0)),true);eq(S.valid('life',{...frame('life',0),reading:{live:null,events:0,residual:0}}),false);
 const local=frame('domains',0);local.reading.atlasContract.rows[4].status='LOCAL';eq(S.valid('domains',local),false);
 const missing=M.project(17,{}, {generation:17});eq(missing.source.live,null);eq(missing.clock.synchronized,false);ok(missing.cards.every(c=>c.status==='HOLD'));
 const stale=M.project(17,frame('life',17).reading,{...frame('domains',16).reading,generation:16});eq(stale.clock.synchronized,false);ok(stale.cards.every(c=>!c.value.includes('a→b')));
 const good=M.project(17,frame('life',17).reading,{...frame('domains',17).reading,generation:17});eq(good.clock.synchronized,true);eq(good.cards[4].status,'CONFIRMED_READOUT');
 console.log(JSON.stringify({status:'PASS',checks,scope:'ACK/session state machine; full 0..240 and loop; absent/stale/null/LOCAL/epoch/target controls, timeout, cancellation before follower write, reset and HOLD projection; simulated source transport, not browser'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
