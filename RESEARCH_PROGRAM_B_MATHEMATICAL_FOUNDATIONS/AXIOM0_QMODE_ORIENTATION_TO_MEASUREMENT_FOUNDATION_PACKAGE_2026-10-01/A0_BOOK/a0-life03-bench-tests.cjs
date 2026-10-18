'use strict';
const fs=require('node:fs'),vm=require('node:vm'),a=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const P=require('./a0-life03-contract.js'),B=require('./a0-life03-bench-adapter.js'),build=require('./a0-life03-runtime-build.cjs').build,C=require('./a0-orientation-controller-bench.js');
let checks=0;const ok=(v,m)=>{checks++;a.ok(v,m);},eq=(x,y,m)=>{checks++;a.deepEqual(x,y,m);};
class Node{
 constructor(){this.value='';this.textContent='';this.disabled=false;this.hidden=false;this.dataset={};this.children=[];this.events={};this.attrs={};this.className='';this.active=false;this.classList={toggle:(name,value)=>{if(name==='active')this.active=Boolean(value);},add(){},remove(){}};}
 append(n){this.children.push(n);}replaceChildren(){this.children=[];}addEventListener(k,f){(this.events[k]??=[]).push(f);}getAttribute(k){return this[k]??this.attrs[k];}emit(k){for(const f of this.events[k]||[])f({target:this});}click(){this.emit('click');}
}
const runtime=fs.readFileSync(path.join(__dirname,'assets/a0-life03-runtime.html'),'utf8'),bench=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
eq(runtime,build(),'byte-reproducible source derivative');
const binding=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/a0-life03-bench-binding-v1.json'),'utf8'));
eq(binding.sourceSetHash,P.SOURCE_HASH);eq(binding.browserAcceptance,false);
for(const value of Object.values(binding.authority))eq(value,false,'no authority promotion');
for(const source of binding.implementationFiles)eq(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,source.path))).digest('hex'),source.sha256,'implementation binding '+source.path);
ok(runtime.includes("connect-src 'none'")&&runtime.includes("frame-src 'none'"),'sandbox CSP');
ok(!/<script src=|<a href=/.test(runtime),'no external script or child navigation');
ok(bench.includes('id="life03Frame" hidden sandbox="allow-scripts"'),'opaque-origin source frame');
for(const s of require('./a0-life03-runtime-build.cjs').SOURCES)eq(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,s.path))).digest('hex'),s.sha256,'source bytes unchanged');
const byId={},get=id=>byId[id]??(byId[id]=new Node()),frame=get('life03Frame'),parentEvents={},timers=new Map();let timerId=0,draws=0,childEvents,child,delivery=e=>controller.receive(e),paused=0;
const parent={postMessage:m=>delivery({source:child,data:P.copy(m)})};
function childContext(){
 childEvents={};const nodes={},node=id=>nodes[id]??(nodes[id]=new Node()),modes=node('modes');
 node('pattern').value='blinker';node('size').value='64';node('speed').value='260';node('canvas').width=1040;node('canvas').height=670;
 const ctx=new Proxy({},{get:()=>()=>{draws++;},set:()=>true});node('canvas').getContext=()=>ctx;
 const doc={getElementById:node,createElement:()=>new Node(),querySelectorAll:s=>s==='.mode'?modes.children:[],querySelector:s=>s==='.mode.active'?modes.children.find(n=>n.active):null};
 const context=vm.createContext({document:doc,parent,setTimeout(){throw Error('source-local timer prohibited');},clearTimeout(){},addEventListener:(k,f)=>{(childEvents[k]??=[]).push(f);}});
 context.window=context;child=context;frame.contentWindow=context;
 for(const m of runtime.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],context);
 return {context,nodes};
}
let view=childContext();
const sourceMessage=m=>childEvents.message.forEach(f=>f({source:parent,data:m}));
const controller=B.create({nonce:()=> 'a'.repeat(32),load(){view=childContext();},send:sourceMessage,isChild:s=>s===child,setTimeout:f=>{timers.set(++timerId,f);return timerId;},clearTimeout:id=>timers.delete(id),pauseMaster:()=>{paused++;}});
async function flush(){for(let i=0;i<8;i++)await Promise.resolve();}
async function main(){
 controller.load();await controller.loaded();ok(controller.isReady(),'actual authored app handshake');ok(draws>500,'actual canvas renderer executed, not pixel QA');
 const initial=controller.exportRecord().currentWitness;eq(initial.state.work.macro,0);eq(initial.state.work.life.history[0].live.length,3);
 for(const id of ['pattern','size','speed','tick','play','reset'])ok(view.nodes[id].disabled,'native control frozen '+id);
 await controller.manual('CAPTURE');await controller.manual('STEP');await controller.manual('STEP');
 const nonzero=P.copy(controller.exportRecord().currentWitness.state);eq(nonzero.work.macro,2,'source evolution uses Scale engine');
 await controller.manual('CAPTURE');
 for(const mode of P.MODES){
  await controller.manual('VIEW',mode);const before=P.copy(controller.exportRecord().currentWitness.state.work);
  await controller.manual('STEP');const w=controller.exportRecord().currentWitness;
  eq(w.state.mode,mode,'actual source mode');eq(w.rendered.mode,mode,'actual DOM mode');
  eq(w.state.work.life.history.slice(0,before.life.history.length),before.life.history,'history prefix retained');ok(w.state.work.e8State!==before.e8State,'native E8 mutation progressed');
 }
 await controller.manual('RETURN');eq(controller.exportRecord().currentWitness.state,nonzero,'full progressed trajectory anchor returned');eq(controller.exportRecord().returnReceipt.status,'DECLARED_SOURCE_STATE_RETURN_EXACT');
 await controller.manual('VIEW','observer');for(let i=0;i<8;i++)await controller.manual('STEP');eq(controller.exportRecord().currentWitness.state.work.macro,nonzero.work.macro+1,'eight observer microsteps advance one Life generation');await controller.manual('RETURN');
 await controller.manual('STOP');eq(controller.exportRecord().currentWitness.state,nonzero,'STOP is state preserving');
 const beforeRev=controller.exportRecord().lastConfirmed.revision;
 controller.receive({source:{},data:{protocol:P.PROTOCOL,session:'a'.repeat(32),seq:0,type:'ERROR'}});ok(controller.isReady(),'foreign window ignored');
 let q=[];delivery=e=>q.push(e);const step=controller.manual('STEP');ok(controller.isPending(),'pending state');ok(controller.exportRecord().currentWitness===null,'no current witness during wait');
 await a.rejects(controller.manual('STEP'));checks++;
 const ack=q.shift();controller.receive({source:child,data:{...ack.data,session:'b'.repeat(32)}});ok(controller.isPending(),'foreign session ignored');
 controller.receive({source:child,data:{...ack.data,seq:ack.data.seq-1}});ok(controller.isPending(),'old sequence ignored');
 delivery=e=>controller.receive(e);controller.receive(ack);await step;eq(controller.exportRecord().lastConfirmed.revision,beforeRev+1);await controller.manual('RETURN');
 q=[];delivery=e=>q.push(e);const bad=controller.manual('STEP');const changed=q.shift();changed.data.witness.rendered.generation=99;controller.receive(changed);await a.rejects(bad);checks++;
 eq(controller.exportRecord().status,'HOLD','invalid DOM readback HOLD');ok(paused>0,'HOLD pauses host');
 delivery=e=>controller.receive(e);await controller.read();ok(controller.isReady(),'explicit READ recovery only');
 for(const mutate of [w=>w.sourceHash='foreign',w=>w.revision+=5,w=>w.timerRunning=true,w=>w.state.work.life.history[0].live[0][0]+=1]){
  q=[];delivery=e=>q.push(e);const action=controller.manual('VIEW','observer'),answer=q.shift();mutate(answer.data.witness);controller.receive(answer);await a.rejects(action);checks++;eq(controller.exportRecord().status,'HOLD','bad witness / view cannot alter trajectory');delivery=e=>controller.receive(e);await controller.read();
 }
 q=[];delivery=e=>q.push(e);const lost=controller.manual('STEP');[...timers.values()][0]();await a.rejects(lost);checks++;eq(controller.exportRecord().status,'HOLD','timeout HOLD');
 controller.receive(q[0]);eq(controller.exportRecord().status,'HOLD','late ACK cannot clear HOLD');
 delivery=e=>controller.receive(e);await controller.read();
 await controller.manual('VIEW','dual');while(controller.exportRecord().currentWitness.state.work.macro<32)await controller.manual('STEP');await a.rejects(controller.manual('STEP'));checks++;eq(controller.exportRecord().status,'HOLD','source generation ceiling enforced');await controller.read();
 for(const mutate of [s=>s.work.macro=-1,s=>s.work.e8State=240,s=>s.speed=0,s=>s.work.life.history[0].live.push([999,0]),s=>s.work.records=[],s=>s.mode='fake']){
  const bad=P.copy(controller.exportRecord().currentWitness.state);mutate(bad);checks++;a.throws(()=>P.state(bad));
 }
 let tick=null;
 const win={crypto:{getRandomValues:a=>{a.fill(7);return a;}},setTimeout:f=>{timers.set(++timerId,f);return timerId;},clearTimeout:id=>timers.delete(id),addEventListener:(k,f)=>{(parentEvents[k]??=[]).push(f);},location:{hash:''}};
 const doc={getElementById:get,createElement:()=>new Node()};
 Object.defineProperty(frame,'src',{get:()=>frame.attrs.src,set:value=>{frame.attrs.src=value;view=childContext();Promise.resolve().then(()=>frame.emit('load'));}});
 frame.addEventListener('load',()=>{frame.contentWindow.postMessage=m=>sourceMessage(m);});
 const mounted=B.mount(win,doc);win.A0Life03Bench=mounted;delivery=e=>{for(const f of parentEvents.message||[])f(e);};
 const host=vm.createContext({C,window:win,document:{hidden:false,querySelector:()=>({classList:{add(){},remove(){}}})},setInterval:f=>{tick=f;return 1;},clearInterval:()=>{tick=null;},setTimeout:()=>1,clearTimeout(){},Number});
 const extract=(from,to)=>bench.slice(bench.indexOf(from),bench.indexOf(to,bench.indexOf(from)));
 const stubs=['stopRootEngine','resetPxaJourney','render','renderEdgeCore','renderPascalShadow','renderFamilyOrientation','renderExperimentCorridor','renderGoReturnLab','renderRoot838','stopPascalLensMotion','setRootEngineRunning','holdPxaJourney'];
 vm.runInContext([
 "let masterDemoTimer=null,masterAutoTimer=null,masterAutoTour=false,pascalLensTimer=null,masterDemoState=C.createMasterDemonstratorState(),initial=C.createState(),state=C.createState(),edgeState=C.createEdgeState(),rootEngineState=C.createRootSpaceEngine(),familyThetaStep=0,goReturnPathIndex=0,defgSeriesStep=0,root838Mode='q4',stateRelationMode='state',shadowSides=0,pascalLensMode='';",
 "const $=id=>({value:id==='masterDemoSpeed'?'100':id==='goReturnSheet'?'retain':'7',scrollIntoView(){}});",
 stubs.map(n=>'function '+n+'(){}').join('\n'),
 'function renderMasterDemo(scroll=false,execute=false){if(execute)executeMasterPhase(masterDemoState.currentPhase);}',
 extract('  function stopMasterDemo()','  function focusMasterPhase('),
 extract('  function scheduleMasterDemo()','  function stepMasterDemo()'),
 extract('  function interruptMasterAutoTour()','  function pauseForHumanInteraction('),
 extract('  window.A0PentagonPauseMaster=','  // Automation starts only'),
 'window.masterSnapshot=()=>masterDemoState;'
 ].join('\n'),host);
 await win.A0Life03JointDemo.start();await flush();ok(mounted.isReady(),'mounted UI connection READY');eq(win.A0Life03JointDemo.snapshot().confirmed,1,'SOURCE capture confirmed');
 for(let i=0;i<9;i++){ok(typeof tick==='function','one host clock remains');tick();await flush();}
 let run=win.A0Life03JointDemo.snapshot();eq(run.status,'COMPLETE','actual mounted UI completes host run');eq(run.confirmed,10);eq(run.acceptance.cues,Object.keys(P.CUES));eq(run.acceptance.receipt.after.state,run.acceptance.baseline.state,'full state exact on completed run');ok(tick===null,'host clock stopped');eq(mounted.exportRecord().currentWitness.state.work.macro,0,'return restores native generation');
 await mounted.manual('STEP');await mounted.manual('STEP');await win.A0Life03JointDemo.start();await flush();for(let i=0;i<9;i++){tick();await flush();}
 run=win.A0Life03JointDemo.snapshot();eq(run.status,'COMPLETE');eq(run.acceptance.baseline.state.work.macro,2,'fresh progressed anchor');eq(run.acceptance.receipt.after.state.work.macro,2);
 const exported={schema:'nexah.a0.life03-joint-run/1',run,life03:mounted.exportRecord()},verify=require('./a0-life03-browser-run-verify.cjs').verify;
 eq(verify(exported).status,'PASS','independent exported trace verifier');
 for(const mutate of [x=>x.run.status='PAUSED',x=>x.life03.pending={seq:99},x=>x.life03.sourceHash='bad',x=>x.life03.history.pop(),x=>x.life03.currentWitness.state.work.e8State=239,x=>x.life03.returnReceipt.anchor.state.mode='observer',x=>x.run.acceptance.baseline.revision=-1]){
  const bad=P.copy(exported);mutate(bad);checks++;a.throws(()=>verify(bad));
 }
 await win.A0Life03JointDemo.start();await flush();win.A0Life03JointDemo.interrupt('Pause');eq(win.A0Life03JointDemo.snapshot().status,'PAUSED');ok(tick===null);ok(!win.A0Life03JointDemo.snapshot().acceptance);
 await win.A0Life03JointDemo.start();await flush();vm.runInContext("pauseBenchAutomation('masterDemoStart')",host);ok(win.A0Life03JointDemo.isActive(),'master start capture does not detach before its pause handler');win.A0Life03JointDemo.interrupt('Master pausiert');ok(tick===null);
 await win.A0Life03JointDemo.start();await flush();vm.runInContext('pauseBenchAutomation()',host);eq(win.A0Life03JointDemo.snapshot().status,'PAUSED','actual host interaction interrupts');ok(tick===null);
 await win.A0Life03JointDemo.start();await flush();q=[];delivery=e=>q.push(e);tick();const phase=win.masterSnapshot().phaseIndex;tick();eq(win.masterSnapshot().phaseIndex,phase,'host waits for source ACK');
 win.A0Life03JointDemo.interrupt('Pause while pending');delivery=e=>{for(const f of parentEvents.message||[])f(e);};q.forEach(delivery);await flush();eq(win.A0Life03JointDemo.snapshot().status,'PAUSED','late ACK cannot certify paused run');ok(!win.A0Life03JointDemo.snapshot().acceptance);
 await win.A0Life03JointDemo.start();await flush();delivery=()=>{};tick();[...timers.values()][0]();await flush();eq(win.A0Life03JointDemo.snapshot().status,'HOLD','mounted timeout holds joint run');ok(tick===null);
 for(const id of ['life03Start','life03Pause','life03Export','life03Load','life03Step','life03Capture','life03Return','life03View','life03Witness'])ok(bench.includes('id="'+id+'"'),id);
 const section=bench.slice(bench.indexOf('  <details class="panel" id="life03Workbench"'),bench.indexOf('  <section class="panel" id="integrationCrosswalk"'));
 for(const m of section.matchAll(/href="([^"]+)"/g)){const u=new URL(m[1],'file://'+__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html'),file=decodeURIComponent(u.pathname);ok(fs.existsSync(file),'link '+m[1]);if(u.hash)ok(fs.readFileSync(file,'utf8').includes('id="'+u.hash.slice(1)+'"'),'anchor '+m[1]);}
 console.log(JSON.stringify({status:'PASS',checks,renderer:'actual LIFE03 canvas code in mock DOM; not browser pixels',host:'actual existing Master clock and phase executor',sourceTimer:false,researchRuns:0,browserAcceptance:false}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
