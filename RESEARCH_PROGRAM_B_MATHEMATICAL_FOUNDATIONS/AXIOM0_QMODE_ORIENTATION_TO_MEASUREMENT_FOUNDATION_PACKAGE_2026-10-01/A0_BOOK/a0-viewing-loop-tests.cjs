'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const C=require('./a0-orientation-controller-bench.js');
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=x=>{assert.ok(x);checks++;};
// Execute the actual inline scheduler against the real phase model; only DOM,
// timers and source-owned instrument side effects are doubled.
const scheduler=html.slice(html.indexOf('  function scheduleMasterDemo(){'),html.indexOf('  function stepMasterDemo(){'));
const interaction=html.slice(html.indexOf('  function pauseForHumanInteraction(event){'),html.indexOf("  qsa('#carrier"));
const timers=new Map(),timeouts=new Map(),renders=[],controls={masterDemoLoop:{checked:true}};
let serial=0,pending=false,resets=0,interrupts=0;
const ctx={C,console,$:id=>controls[id],window:{},setInterval:f=>{timers.set(++serial,f);return serial;},clearInterval:id=>timers.delete(id),setTimeout:f=>{timeouts.set(++serial,f);return serial;},clearTimeout:id=>timeouts.delete(id),
  masterSourcePending:()=>pending,renderMasterDemo:(scroll,execute)=>renders.push({scroll,execute}),pauseBenchAutomation:()=>interrupts++};
vm.createContext(ctx);
vm.runInContext(`let masterDemoState=C.createMasterDemonstratorState(),masterDemoTimer=null,masterAutoTimer=null,masterAutoTour=false,masterLoopCount=0;const masterLoopReturns=[];const masterLoopEnabled=()=>$('masterDemoLoop').checked;
function stopMasterDemo(){if(masterDemoTimer){clearInterval(masterDemoTimer);masterDemoTimer=null;}if(masterAutoTimer){clearTimeout(masterAutoTimer);masterAutoTimer=null;}}
function resetMasterInstruments(){stopMasterDemo();resetsHook();}
${scheduler}
${interaction}
globalThis.api={start:()=>setMasterDemoRunning(true),pause:()=>{stopMasterDemo();masterDemoState=C.createMasterDemonstratorState({...masterDemoState,running:false});},state:()=>masterDemoState,cycles:()=>masterLoopCount,history:()=>masterLoopReturns,interact:pauseForHumanInteraction};`,Object.assign(ctx,{resetsHook:()=>resets++}));
const tick=()=>{eq(timers.size,1);[...timers.values()][0]();};
eq(timers.size,0);ctx.api.start();eq(timers.size,1);
for(let cycle=0;cycle<20;cycle++){
  for(let phase=1;phase<10;phase++){tick();eq(ctx.api.state().phaseIndex,phase);eq(ctx.api.state().running,true);}
  pending=true;tick();eq(ctx.api.cycles(),cycle);eq(ctx.api.state().phaseIndex,9);pending=false;
  tick();eq(ctx.api.state().phaseIndex,0);eq(ctx.api.cycles(),cycle+1);eq(timers.size,1);
}
eq(resets,20);eq(ctx.api.history().length,16);eq(ctx.api.history()[0].cycle,5);eq(timeouts.size,0);
ctx.api.pause();eq(timers.size,0);eq(ctx.api.state().running,false);
controls.masterDemoLoop.checked=false;ctx.api.start();for(let i=0;i<9;i++)tick();eq(ctx.api.state().running,false);eq(timers.size,0);eq(ctx.api.cycles(),20);
controls.masterDemoLoop.checked=true;ctx.api.start();eq(ctx.api.state().phaseIndex,0);eq(timers.size,1);
ctx.api.interact({isTrusted:true,target:{closest:()=>null}});eq(interrupts,0);
ctx.api.interact({isTrusted:true,target:{closest:()=>({tagName:'A',getAttribute:()=>'#systemBinder'})}});eq(interrupts,0);
ctx.api.interact({isTrusted:true,target:{closest:()=>({tagName:'BUTTON',id:'applyJ'})}});eq(interrupts,1);
controls.masterDemoLoop.checked=false;ctx.api.interact({isTrusted:true,target:{closest:()=>null}});eq(interrupts,2);
ctx.api.pause();
ok(html.includes("scroll&&!masterLoopEnabled()"));
ok(html.includes("'wheel',()=>{if(!masterLoopEnabled())pauseBenchAutomation()"));
ok(html.includes("if(document.hidden)pauseBenchAutomation()"));
ok(html.includes('id="systemBinderLoop" checked'));
const B=require('./a0-system-binder.js');
class Node{constructor(){this.dataset={};this.events={};this.checked=true;}addEventListener(k,f){this.events[k]=f;}}
const ids=['systemBinder','systemBinderConnect','systemBinderStart','systemBinderPause','systemBinderStep','systemBinderReset','systemBinderExport','systemBinderPhase','systemBinderLedger','systemBinderStatus','systemBinderLoop'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Node()])),callbacks=new Map();let binderSerial=0,masterRunning=true,phaseIndex=0,stops=0,loopValue=null;
const win={A0MasterDemoBridge:{snapshot:()=>({running:masterRunning,phaseIndex}),start:()=>{masterRunning=true;},pause:()=>{masterRunning=false;},isPending:()=>false,setLoop:v=>{loopValue=v;},loopSnapshot:()=>({enabled:true,completedCycles:2})},A0ApertureMeasurementController:{record:{sourceFingerprint:'x'},start(){},stop(){stops++;}},A0ApertureStackController:{record:{sourceFingerprint:'x'},start(){},stop(){stops++;}},setInterval:f=>{callbacks.set(++binderSerial,f);return binderSerial;},clearInterval:id=>callbacks.delete(id),addEventListener(){}};
const doc={getElementById:id=>nodes[id],querySelector:()=>null,addEventListener(){}};
(async()=>{
  const binder=B.mount(doc,win);nodes.systemBinderLoop.checked=false;nodes.systemBinderLoop.events.change();eq(loopValue,false);
  await binder.play();eq(callbacks.size,1);eq(binder.receipt.viewingLoop.completedCycles,2);
  masterRunning=false;[...callbacks.values()][0]();eq(binder.state.status,'PAUSED_BY_OPERATOR');eq(callbacks.size,0);eq(stops,2);
  await binder.play();phaseIndex=9;masterRunning=false;[...callbacks.values()][0]();eq(callbacks.size,0);eq(binder.state.running,false);
  console.log(JSON.stringify({status:'PASS',checks,scope:'20 actual master-model loop cycles; pending guard; one timer; 16-cycle retention; single pass; manual intervention; actual Binder pause/finish and loop export; DOM doubles, browser OPEN'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
