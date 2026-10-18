'use strict';
const fs=require('node:fs'),vm=require('node:vm'),a=require('node:assert/strict'),P=require('./a0-pentagon-contract.js'),B=require('./a0-pentagon-bench-adapter.js'),build=require('./a0-pentagon-runtime-build.cjs').build;
let checks=0;const ok=(v,m)=>{checks++;a.ok(v,m);};
class Node{
 constructor(){this.attrs={};this.dataset={};this.children=[];this.events={};this.value='';this.classList={toggle(){}};}
 setAttribute(k,v){this.attrs[k]=String(v);}append(...n){this.children.push(...n);}prepend(...n){this.children.unshift(...n);}replaceChildren(){this.children=[];}
 addEventListener(k,f){this.events[k]=f;}querySelectorAll(s){if(s==='*')return this.children.flatMap(n=>[n,...n.querySelectorAll('*')]);return [];}
}
async function main(){
 const runtime=fs.readFileSync(__dirname+'/assets/a0-pentagon-runtime.html','utf8');ok(runtime===build(),'reproducible derivative');
 const groups={mode:P.MODES,op:['0','1','2','3','4','m'],step:['1','2','3','4','5','closed'],couplingView:['cycles','triangles','handle7','octagon'],d30Action:['apply','left','right','rotate','reflect']};
 const nodes={},root=new Node();for(const [key,values]of Object.entries(groups))groups[key]=values.map(value=>{const n=new Node();n.dataset[key]=value;return n;});
 const camel=s=>s.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
 root.querySelectorAll=s=>groups[camel(s.slice(6,-1))]||[];
 root.querySelector=s=>{const m=s.match(/^\[data-([^\]]+)\]\[(aria-[^=]+)="true"\]$/);if(m)return groups[camel(m[1])].find(n=>n.attrs[m[2]]==='true');return nodes[s]||(nodes[s]=new Node());};
 let childHandler,parentHandler,hostPause=null,paused=0,timerId=0;const timers=new Map(),parent={},child={};
 const env={parent,addEventListener:(k,f)=>{if(k==='message')childHandler=f;else env[k]=f;}};env.window=env;env.globalThis=env;
 const controller=B.create({nonce:()=> 'a'.repeat(32),load(){},send:m=>childHandler({source:parent,data:m}),isChild:s=>s===child,setTimeout:f=>{timers.set(++timerId,f);return timerId;},clearTimeout:id=>timers.delete(id),pauseMaster:()=>{paused++;hostPause?.();}});
 parentHandler=e=>controller.receive(e);parent.postMessage=m=>parentHandler({source:child,data:m});
 const context=vm.createContext({...env,window:env,document:{getElementById:()=>root,createElementNS:()=>new Node()}});context.globalThis=context;
 // Execute every actual inline script, including the original authored SVG renderer.
 for(const m of runtime.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],context);
 controller.load();await controller.loaded();ok(controller.isReady(),'actual renderer handshake');
 const initial=controller.exportRecord().currentWitness;ok(initial.svgElements>0&&initial.resultText.length>0);
 for(const mode of P.MODES){await controller.apply('VIEW',mode);const w=controller.exportRecord().currentWitness;ok(w.state.mode===mode&&w.rendered.mode===mode&&w.svgElements>0,mode);}
 for(const [action,values]of [['STRUCTURE_OP',['0','1','2','3','4','m']],['GROWTH',['1','2','3','4','5','closed']],['COUPLING',['cycles','triangles','handle7','octagon']]])for(const value of values){await controller.apply(action,value);ok(controller.isReady(),action+value);}
 for(let n=0;n<7;n++)for(let bits=0;bits<2**n;bits++){const word=Array.from({length:n},(_,i)=>bits&(1<<i)?'R':'L').join('');for(let r=0;r<5;r++){await controller.apply('REGISTER',r);await controller.apply('WORD',word);const w=controller.exportRecord().currentWitness;ok(w.state.branchWord===word&&w.phase===P.phase(word)&&w.rendered.dRegister===r);}}
 await controller.apply('WORD','LRRL');const anchor=await controller.capture();controller.setFollow(true);
 for(const id of Object.keys(P.MASTER_CUES))await controller.masterPhase(id);
 let record=controller.exportRecord();ok(record.returnReceipt.status==='UI_STATE_RETURN_EXACT');ok(P.equal(record.currentWitness.state,anchor.state));ok(!record.returnReceipt.full106NodeAddressProvided);
 await controller.apply('VIEW','lift');await controller.importRecord(record);ok(P.equal(controller.exportRecord().currentWitness.state,record.currentWitness.state),'import exact');
 controller.setFollow(true);env.pointerdown();ok(!controller.isFollowing()&&paused>0,'human pauses Master');
 groups.mode.find(n=>n.dataset.mode==='roots').events.click();ok(controller.exportRecord().currentWitness.state.mode==='roots','native state readback');
 const before=controller.exportRecord().lastConfirmed.revision;
 controller.receive({source:{},data:{protocol:P.PROTOCOL,session:'a'.repeat(32),type:'ERROR',seq:0,error:'spoof'}});ok(controller.isReady(),'foreign sender ignored');
 controller.receive({source:child,data:{protocol:P.PROTOCOL,session:'b'.repeat(32),type:'ERROR',seq:0,error:'spoof'}});ok(controller.isReady(),'wrong nonce ignored');
 parent.postMessage({protocol:P.PROTOCOL,session:'a'.repeat(32),type:'CHANGED',seq:0,witness:{...controller.exportRecord().currentWitness,revision:before-1}});ok(controller.exportRecord().status==='HOLD','stale witness holds');
 await controller.read();ok(controller.isReady(),'explicit read recovery');
 const saved=parentHandler;parentHandler=()=>{};const wait=controller.read();ok(controller.isPending()&&!controller.exportRecord().currentWitness,'pending is not confirmed');await a.rejects(controller.apply('VIEW','lift'));checks++;
 [...timers.values()][0]();await a.rejects(wait,/timeout/);checks++;ok(controller.exportRecord().status==='HOLD');parentHandler=saved;
 await controller.read();await a.rejects(controller.importRecord({...record,status:'HOLD'}));checks++;
 for(const bad of [{...P.DEFAULT,extra:1},{...P.DEFAULT,branchWord:'LRX'},{...P.DEFAULT,dRegister:5},{...P.DEFAULT,branchWord:'LLLLLLL'}]){a.throws(()=>P.state(bad));checks++;}
 const bench=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');ok(bench.includes('sandbox="allow-scripts"'));ok(bench.includes('pentagon:window.A0PentagonBench'));ok(runtime.includes("connect-src 'none'"));
 const uiNodes=new Map(),uiDoc={getElementById:id=>{if(!uiNodes.has(id))uiNodes.set(id,new Node());return uiNodes.get(id);}};
 const uiWin={crypto:{getRandomValues:a=>a.fill(1)},location:{hash:'#pentagonWorkbench'},addEventListener(){},setTimeout,clearTimeout};
 const mounted=B.mount(uiWin,uiDoc),frame=uiNodes.get('pentagonWorkbenchFrame');ok(!frame.src,'mount does not auto-load');ok(uiNodes.get('pentagonWorkbench').open,'deep link opens disclosure');uiNodes.get('pentagonWorkbenchLoad').events.click();ok(frame.src===B.URL_PATH&&!frame.hidden,'explicit runtime load');ok(mounted.exportRecord().status==='LOADING');
 // Use the actual host clock, phase executor, reset and start functions with the actual
 // child renderer above. Non-PENT drawings are stubbed; this is not a browser.
 const J=require('./a0-pentagon-joint-demo.js'),C=require('./a0-orientation-controller-bench.js');
 const extract=(from,to)=>bench.slice(bench.indexOf(from),bench.indexOf(to,bench.indexOf(from)));
 let tick=null;const hostWindow={A0PentagonBench:controller},hostDoc={hidden:false,querySelector:()=>({classList:{add(){},remove(){}}})};
 const host=vm.createContext({C,window:hostWindow,document:hostDoc,setInterval:f=>{tick=f;return 1;},clearInterval:()=>{tick=null;},setTimeout:()=>1,clearTimeout(){},Number});
 const stubNames=['stopRootEngine','resetPxaJourney','render','renderEdgeCore','renderPascalShadow','renderFamilyOrientation','renderExperimentCorridor','renderGoReturnLab','renderRoot838','stopPascalLensMotion','setRootEngineRunning','holdPxaJourney'];
 vm.runInContext(`let masterDemoTimer=null,masterAutoTimer=null,masterAutoTour=false,pascalLensTimer=null,masterDemoState=C.createMasterDemonstratorState(),initial=C.createState(),state=C.createState(),edgeState=C.createEdgeState(),rootEngineState=C.createRootSpaceEngine(),familyThetaStep=0,goReturnPathIndex=0,defgSeriesStep=0,root838Mode='q4',stateRelationMode='state',shadowSides=0,pascalLensMode='';
 const $=id=>({value:id==='masterDemoSpeed'?'100':id==='goReturnSheet'?'retain':'7',scrollIntoView(){}});
 ${stubNames.map(n=>'function '+n+'(){}').join('\n')}
 function renderMasterDemo(scroll=false,execute=false){if(execute)executeMasterPhase(masterDemoState.currentPhase);}
 ${extract('  function stopMasterDemo()','  function focusMasterPhase(')}
 ${extract('  function scheduleMasterDemo()','  function stepMasterDemo()')}
 ${extract('  function interruptMasterAutoTour()','  function pauseForHumanInteraction(')}
 ${extract('  window.A0PentagonPauseMaster=','  // Automation starts only')}
 window.masterSnapshot=()=>masterDemoState;`,host);
 hostPause=()=>hostWindow.A0PentagonMaster.pause();
 const joint=J.create({controller,startMaster:()=>hostWindow.A0PentagonMaster.start(),stopMaster:()=>hostWindow.A0PentagonMaster.pause(),changed(){}});hostWindow.A0PentagonJointDemo=joint;
 await joint.start();ok(joint.snapshot().status==='RUNNING'&&joint.snapshot().confirmed===1,'one click starts at SOURCE');
 for(let i=0;i<9;i++){ok(typeof tick==='function','Master clock present');tick();await Promise.resolve();}
 let jr=joint.snapshot();ok(jr.status==='COMPLETE'&&jr.confirmed===10,'actual host clock completes ten confirmed cues');ok(jr.acceptance.status==='MASTER_PENT_UI_RETURN_EXACT');ok(P.equal(jr.acceptance.baseline.state,jr.acceptance.receipt.after.state));ok(tick===null,'completed clock stopped');
 // An old successful receipt must never accept a new or interrupted run.
 await joint.start();ok(joint.snapshot().status==='RUNNING'&&!joint.snapshot().acceptance,'fresh run clears old acceptance');
 tick();await Promise.resolve();joint.interrupt('Pause test');ok(joint.snapshot().status==='PAUSED'&&!joint.snapshot().acceptance&&tick===null,'pause stops clock and acceptance');
 await joint.start();env.pointerdown();ok(joint.snapshot().status==='PAUSED'&&tick===null,'native Explorer input pauses joint run');
 await joint.start();env.wheel();ok(joint.snapshot().status==='PAUSED'&&tick===null,'scroll inside Explorer pauses joint run');
 await joint.start();vm.runInContext('pauseBenchAutomation()',host);ok(joint.snapshot().status==='PAUSED'&&tick===null,'actual parent human-interaction handler pauses joint run');
 await joint.start();const queued=[];parentHandler=e=>queued.push(e);tick();const phaseBefore=hostWindow.masterSnapshot().phaseIndex;tick();ok(hostWindow.masterSnapshot().phaseIndex===phaseBefore,'Master waits for async acknowledgement');joint.interrupt('Pause while waiting');parentHandler=saved;queued.forEach(saved);await Promise.resolve();ok(joint.snapshot().status==='PAUSED'&&!joint.snapshot().acceptance,'late ACK cannot complete paused run');
 await joint.start();parentHandler=()=>{};tick();[...timers.values()][0]();await Promise.resolve();ok(joint.snapshot().status==='HOLD'&&tick===null&&!joint.snapshot().acceptance,'lost acknowledgement holds joint run');parentHandler=saved;await controller.read();
 let ready,follow=false,stops=0;const fake={subscribe(){},setFollow:v=>{follow=v;},connect:()=>new Promise(resolve=>ready=resolve),exportRecord:()=>controller.exportRecord()};
 const cancelled=J.create({controller:fake,startMaster:()=>{throw Error('must not start after cancel');},stopMaster:()=>stops++,changed(){}});
 const connecting=cancelled.start();cancelled.interrupt('Cancel connect');ready(controller.exportRecord());await connecting;ok(cancelled.snapshot().status==='PAUSED'&&!follow&&stops>0,'cancel during connect prevents delayed start');
 // Fresh one-click connection: real parent readiness subscription, no polling.
 let fresh,connectTimer=null;fresh=B.create({nonce:()=> 'c'.repeat(32),load:()=>{fresh.loaded().catch(()=>{});},send:m=>fresh.receive({source:child,data:{protocol:P.PROTOCOL,session:m.session,type:'READY',seq:m.seq,witness:initial}}),isChild:s=>s===child,setTimeout:f=>{connectTimer=f;return f;},clearTimeout(){}});
 await fresh.connect();ok(fresh.isReady(),'fresh connect waits for actual READY protocol');
 let blockedTimer;const blocked=B.create({nonce:()=> 'd'.repeat(32),load(){},send(){},isChild:()=>true,setTimeout:f=>{blockedTimer=f;return 1;},clearTimeout(){}});
 const noFrame=blocked.connect();blockedTimer();await a.rejects(noFrame,/connection timeout/);checks++;ok(blocked.exportRecord().status==='HOLD','missing frame bounded by connection timeout');
 const failController={subscribe:fn=>{failController.observe=fn;},setFollow:()=>failController.observe({status:'HOLD'}),connect:async()=>controller.exportRecord(),exportRecord:()=>controller.exportRecord()};
 let recoveryStarted=false;const recover=J.create({controller:failController,startMaster:()=>{recoveryStarted=true;},stopMaster(){},changed(){}});
 await recover.start();ok(recoveryStarted,'explicit restart can recover from pre-existing HOLD');
 const uiDemo=J.mount({...uiWin,A0PentagonMaster:{start(){fresh.setFollow(true);},pause(){}}},uiDoc,fresh);
 uiNodes.get('pentagonJointStart').events.click();await Promise.resolve();await Promise.resolve();ok(uiNodes.get('pentagonJointStart').disabled,'one-click UI disables duplicate start');uiNodes.get('pentagonJointPause').events.click();ok(uiDemo.snapshot().status==='PAUSED'&&!uiNodes.get('pentagonJointStart').disabled,'visible pause allows fresh start');
 console.log('PASS '+checks+' PENT engineering checks: actual authored renderer + actual host clock/executor in mock DOM, one-click joint run, exact UI Return, fresh acceptance, pause, async wait and HOLD. No browser/pixel or research-run claim.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
