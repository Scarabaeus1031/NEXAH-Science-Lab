'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),P=require('./a0-blue-pink-mask-clock.js'),B=require('./a0-mask-clock-bench.js'),V=require('./a0-mask-observer-view.js');
let checks=0;const ok=v=>{checks++;assert.ok(v);},eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
for(let i=0;i<12000;i++)eq(P.tick(i/12000*P.TAU),Math.floor(i/100));
for(const x of [-1,NaN,Infinity,8]){checks++;assert.throws(()=>P.tick(x));}
eq(P.tick(P.TAU),0);
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),sourceHtml=fs.readFileSync(__dirname+'/A0_BLUE_PINK_DODECA_CELL_RETURN.html','utf8');
function node(){return{value:'',checked:false,attrs:{},events:{},addEventListener(k,f){(this.events[k]??=[]).push(f);},setAttribute(k,v){this.attrs[k]=v;},click(){for(const f of this.events.click??[])f({target:this});}};}
const nodes=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],node()]));
const classes=new Set(),doc={getElementById:id=>nodes[id]??null,events:{},addEventListener(k,f){this.events[k]=f;},createElement:()=>({click(){}}),documentElement:{classList:{toggle(k,on){if(on)classes.add(k);else classes.delete(k);},contains:k=>classes.has(k)}}};
const timers=new Map();let timerId=0,localInterval=null;
const queue=[],listeners={},sourceListeners={},parent={},child={};
const win={location:{hash:'#maskClockLink'},crypto:{randomUUID:()=> 'clock-test-session-0001'},setTimeout(f){const id=++timerId;timers.set(id,f);return id;},clearTimeout(id){timers.delete(id);},setInterval(f){localInterval=f;return 99;},clearInterval(){localInterval=null;},addEventListener(k,f){(listeners[k]??=[]).push(f);},matchMedia:()=>({matches:false}),URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},Blob:class{}};
nodes.nativeFaceSourceFrame.getAttribute=()=> 'A0_BLUE_PINK_DODECA_CELL_RETURN.html?bridge=1#cell-machine';nodes.nativeFaceSourceFrame.contentWindow=child;
parent.postMessage=p=>queue.push(()=>{for(const f of listeners.message??[])f({source:child,data:p});});
child.postMessage=p=>queue.push(()=>{for(const f of sourceListeners.message??[])f({source:parent,data:p});});
let clock=0,playing=true,ratio='3:2',phaseDegrees=90;
const meter=require('./assets/a0-lissajous-distance.js').createMeter(3,2,Math.PI/2);
const sandbox={setPlaying:v=>{playing=v;},distanceMeter:meter,Math,clock,draw:()=>{clock=sandbox.clock;for(const f of sourceListeners['a0-lissajous-frame']??[])f();}};
vm.createContext(sandbox);const method=sourceHtml.match(/stepPhase:(\(\)=>\{[^\n]+\}),/)[1];const nativeStep=vm.runInContext(method,sandbox);
const view={setPlaying(v){playing=v;},stepPhase:nativeStep,get state(){return{clock,playing,ratio,phaseDegrees};}};
const childWin={parent,A0ThreeLissajousPlanesView:view,addEventListener(k,f){(sourceListeners[k]??=[]).push(f);}};
const relay=P.mountSource(childWin),mask=V.mount(doc,win);win.A0MaskObserverController=mask;
const bench=B.mount(doc,win);function flush(){let limit=100;while(queue.length&&limit--)queue.shift()();ok(limit>0);}
function frame(t){clock=t;for(const f of sourceListeners['a0-lissajous-frame']??[])f();flush();}
nodes.maskPlay.click();ok(localInterval);
bench.connect();eq(localInterval,null);eq(bench.connected,true);flush();eq(playing,false);ok(nodes.maskClockStatus.textContent.startsWith('SYNC'));
eq(mask.command('RESET'),false);nodes.maskPlay.click();eq(localInterval,null);
bench.command('STEP');flush();eq(mask.state.tick,1);eq(playing,false);eq(bench.last.maskTick,1);
bench.command('PLAY');flush();eq(playing,true);
for(let i=2;i<122;i++){frame((i%120)*P.TAU/120);eq(mask.state.tick,i%120);eq(localInterval,null);}
ratio='5:6';phaseDegrees=30;frame(1.2);eq(bench.last.source.ratio,'5:6');eq(bench.last.source.phaseDegrees,30);eq(mask.state.tick,P.tick(1.2));
const before=bench.last;bench.receive({source:{},data:{channel:P.CHANNEL,type:'FRAME',session:mask.clockOwner,request:3,sequence:100000,clock:2,ratio:'5:6',playing:true,phaseDegrees:30}});eq(bench.last,before);
bench.command('PAUSE');flush();eq(playing,false);eq(timers.size,0);
bench.command('STEP');const expiry=[...timers.values()][0];queue.length=0;expiry();eq(bench.connected,false);eq(mask.clockOwner,null);ok(nodes.maskClockStatus.textContent.startsWith('HOLD'));flush();
bench.connect();flush();ok(bench.connected);nodes.nativeFaceSourceFrame.events.load[0]();ok(!bench.connected);flush();eq(localInterval,null);
bench.connect();flush();nodes.maskClockDisconnect.click();flush();eq(mask.clockOwner,null);eq(playing,false);
ok(classes.has('mask-clock-focus'));nodes.maskClockFocus.click();ok(!classes.has('mask-clock-focus'));
ok(!/setInterval|setTimeout|requestAnimationFrame/.test(fs.readFileSync(__dirname+'/a0-blue-pink-mask-clock.js','utf8')));
const localDetails=html.slice(html.indexOf('<details id="maskLocalAssemblyDetails"'),html.indexOf('</details>',html.indexOf('<details id="maskLocalAssemblyDetails"')));
ok(localDetails.includes('id="maskAssemblySvg"'));ok(!localDetails.includes('id="maskTopSvg"'));ok(html.includes('id="maskLocalCompassDetails"'));
for(const text of [html,sourceHtml])for(const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g))if(!/src=/.test(m[1])&&m[2].trim()){new Function(m[2]);checks++;}
async function confirmations(){
 const connection=bench.confirmed('CONNECT');flush();const ack=await connection;eq(ack.maskTick,mask.state.tick);eq(ack.source.playing,false);
 const step=bench.confirmed('STEP');flush();eq((await step).maskTick,mask.state.tick);
 const run=bench.confirmed('PLAY');flush();eq((await run).source.playing,true);
 const stop=bench.confirmed('PAUSE');flush();eq((await stop).source.playing,false);
 const lost=bench.confirmed('STEP');queue.length=0;[...timers.values()][0]();checks++;await assert.rejects(lost,/HOLD/);flush();
 console.log(JSON.stringify({status:'PASS',checks,browserAcceptance:false,scope:'12000 phase samples, actual source step and mask, paired relay/confirmed promises, no follower timer, sender guards, timeout/load/disconnect and focus'}));
}
confirmations().catch(error=>{console.error(error);process.exitCode=1;});
