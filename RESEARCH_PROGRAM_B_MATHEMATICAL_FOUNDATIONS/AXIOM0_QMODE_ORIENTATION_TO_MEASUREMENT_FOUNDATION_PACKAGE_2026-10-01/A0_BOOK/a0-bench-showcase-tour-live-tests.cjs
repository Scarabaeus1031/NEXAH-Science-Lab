'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),T=require('./a0-bench-showcase-tour.js'),V=require('./a0-mask-observer-view.js'),L=require('./a0-code-calendar-lens.js'),F=require('./a0-fold-lag-lens.js');
let checks=0;const ok=(x,m)=>{checks++;assert.ok(x,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
class Node{
 constructor(id){this.id=id;this.dataset={};this.events={};this.attrs={};this.children=[];this.disabled=false;this.value='0';this.hidden=false;const classes=new Set();this.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),toggle:(x,v)=>v?classes.add(x):classes.delete(x),contains:x=>classes.has(x)};}
 addEventListener(k,fn){(this.events[k]??=[]).push(fn);}
 dispatchEvent(e){e.target??=this;return Promise.all((this.events[e.type]||[]).map(fn=>fn(e)));}
 click(){return this.dispatchEvent({type:'click'});}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k];}
 closest(selector){if(selector==='[data-tour-ui]')return this.id?.startsWith('benchTour')?this:null;return null;}
 scrollIntoView(o){this.scrolled=o;}
 appendChild(n){n.parentElement=this;return n;}
 set innerHTML(value){this.html=value;if(this.id==='benchTourProgress')this.children=Array.from({length:(value.match(/<i>/g)||[]).length},()=>new Node('dot'));}get innerHTML(){return this.html||'';}
}
function fixture(reduced=false){
 const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),nodes=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Node(m[1])])),doc=new Node('document');doc.body=new Node('body');doc.getElementById=id=>nodes.get(id)||null;doc.hidden=false;
 let serial=0;const timers=new Map(),intervals=new Map(),calls=[];
 const win={Event:class{constructor(type,o={}){this.type=type;Object.assign(this,o);}},CustomEvent:class{constructor(type,o){this.type=type;Object.assign(this,o);}},matchMedia:()=>({matches:reduced}),setTimeout(fn,ms){const id=++serial;timers.set(id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id),setInterval(fn,ms){const id=++serial;intervals.set(id,{fn,ms});return id;},clearInterval:id=>intervals.delete(id),addEventListener:(k,fn)=>{(win.events[k]??=[]).push(fn);},events:{}};
 const mock=(name,methods)=>{win[name]=Object.fromEntries(methods.map(method=>[method,(...args)=>{calls.push([name,method,...args]);}]));};
 mock('A0SystemBinderController',['play','pause']);mock('A0ExternalAdapterPackController',['play','pause']);mock('A0ReturnEconomyController',['start','pause']);mock('A0FamilyGridCouplerController',['setView','start','pause']);mock('A0FourApertureNinefoldController',['play','stop']);mock('A0ApertureMeasurementController',['setView']);mock('A0NativeFaceBenchController',['setFace']);mock('A0AILApertureControlController',['run']);mock('A0BenchBodyRouteController',['select']);mock('A0CaroBenchController',['command','play','pause']);
 win.A0CoupledWindowController={open(...args){calls.push(['window','open',...args]);nodes.get('coupledWindow').open=true;},close(){nodes.get('coupledWindow').open=false;},pause(){}};
 nodes.get('foldLagMode').value='target';nodes.get('foldLagDelay').value='3';nodes.get('foldLagMirror').value='none';nodes.get('foldLagSlice').value='0';nodes.get('rootEnginePlay').addEventListener('click',()=>nodes.get('rootEnginePlay').setAttribute('aria-pressed',nodes.get('rootEnginePlay').getAttribute('aria-pressed')==='true'?'false':'true'));
 win.A0FoldLagView=F.mount(doc,win);win.A0MaskObserverController=V.mount(doc,win);L.mount(doc);
 mock('A0BenchLensReturnController',['command']);mock('A0DivisionReturnController',['select','command']);
 let clockConnected=false;
 win.A0BenchSourceSectionsController={select(id){calls.push(['clock-source',id]);return{status:'FRAGMENT_REQUESTED'};}};
 win.A0MaskClockBench={focus(){},get connected(){return clockConnected;},disconnect(){clockConnected=false;calls.push(['clock','disconnect']);},async confirmed(action){calls.push(['clock',action]);clockConnected=true;return{source:{clock:1,playing:action==='PLAY'},maskTick:19};}};
 win.A0BenchFiniteControllers=Object.fromEntries(['antipode','ghostgons'].map(kind=>[kind,{command(action){calls.push([kind,action]);return{status:'STEP'};},play(){calls.push([kind,'play']);},pause(){}}]));
 nodes.set('cwWindowPlay',new Node('cwWindowPlay'));nodes.set('cwWindowStep',new Node('cwWindowStep'));
 const tour=T.mount(doc,win),index=id=>T.STATIONS.findIndex(s=>s.id===id);return{nodes,doc,win,tour,timers,intervals,calls,index};
}
async function main(){
 const f=fixture(),{tour,nodes,win,timers,intervals,index,doc,calls}=f;
 ok(nodes.get('benchTourDock').hidden);eq(T.CHAPTERS.length,9);
 for(let i=0;i<T.STATIONS.length;i++){
  await tour.visit(i,false);eq(tour.state.index,i);ok(!nodes.get('benchTourActionStatus').textContent.startsWith('HOLD'),'station '+T.STATIONS[i].id);eq(timers.size,0,'no pending timeouts after manual entry');
  eq(nodes.get('benchTourDock').parentElement,T.STATIONS[i].scenario?nodes.get('coupledWindow'):doc.body,'dock in active top-layer or body');
 }
 ok(calls.some(c=>c[0]==='A0BenchBodyRouteController'&&c[2]==='flow'),'One Flow actual route API');
 ok(calls.filter(c=>c[0]==='window'&&c[1]==='open').every(c=>c[3].autoAction===false),'window opens without duplicate automatic source actions');
 ok(fs.readFileSync(__dirname+'/a0-coupled-window.js','utf8').includes('if(options.autoAction!==false)runAction'),'default window action remains opt-out');
 await tour.visit(index('mask-overview'));const anchor=win.A0MaskObserverController.record();await tour.visit(index('mask-lrrl'));eq(win.A0MaskObserverController.state.config.word,'LRRL');ok(intervals.size>0,'original mask player started');await tour.visit(index('mask-rllr'));eq(win.A0MaskObserverController.state.config.word,'RLLR');await tour.visit(index('mask-return'));eq(win.A0MaskObserverController.record(),anchor,'exact source mask capture/return');
 await tour.visit(index('teller-vm'));eq(win.A0MaskObserverController.state.assembly.plane,'VM');eq(win.A0MaskObserverController.state.assembly.rotation,90);await tour.visit(index('teller-pm'));eq(win.A0MaskObserverController.state.assembly.plane,'PM');
 await tour.visit(index('fold-mirror'));eq(win.A0FoldLagView.snapshot().options.mirror,'horizontal');eq(win.A0FoldLagView.snapshot().slice,14);await tour.visit(index('fold-end'));eq(win.A0FoldLagView.snapshot().slice,28);eq(win.A0FoldLagView.snapshot().turn,7);
 await tour.visit(index('codes-a'));const codeAnchor=JSON.parse(nodes.get('codeCalendarRecord').textContent);await tour.visit(index('codes-b'));eq(JSON.parse(nodes.get('codeCalendarRecord').textContent).state.ratio,1);await tour.visit(index('codes-c'));ok(nodes.get('codeCalendarTests').textContent.includes('PASS · 93'));await tour.visit(index('codes-return'));eq(JSON.parse(nodes.get('codeCalendarRecord').textContent),codeAnchor);
 await tour.visit(0,true);eq(timers.size,1,'one tour dwell timer');eq([...timers.values()][0].ms,18000);const stale=[...timers.values()][0].fn;tour.pause();eq(timers.size,0);await stale();eq(tour.state.index,0,'stale callback cannot advance');
 await tour.start();eq(tour.state.running,true);doc.dispatchEvent({type:'pointerdown',target:nodes.get('benchTourNext')});eq(tour.state.running,true,'tour UI does not auto-pause');doc.dispatchEvent({type:'pointerdown',target:nodes.get('maskDx')});eq(tour.state.running,false,'real user interaction pauses');
 nodes.get('benchTourPace').value='0';await nodes.get('benchTourPace').dispatchEvent({type:'change'});await tour.start();eq(timers.size,0,'manual pacing has no dwell timer');tour.pause();
 nodes.get('benchTourPace').value='30000';await nodes.get('benchTourPace').dispatchEvent({type:'change'});await tour.visit(T.STATIONS.length-1,true);ok(!tour.state.completed,'last station receives full dwell');eq([...timers.values()][0].ms,30000);await [...timers.values()][0].fn();ok(tour.state.completed&&!tour.state.running,'completion after final dwell');
 await tour.visit(4,true);doc.hidden=true;await doc.dispatchEvent({type:'visibilitychange'});ok(!tour.state.running);doc.hidden=false;
 await tour.visit(0);nodes.get('coupledWindow').open=false;await nodes.get('coupledWindow').dispatchEvent({type:'close'});eq(nodes.get('benchTourDock').parentElement,doc.body,'modal close returns dock to document');
 delete win.A0BenchBodyRouteController;await tour.visit(index('body-interior'));ok(nodes.get('benchTourActionStatus').textContent.startsWith('HOLD'),'missing source is explicit HOLD');
 let release;win.A0NativeFaceBenchController.setFace=()=>new Promise(resolve=>{release=resolve;});const pending=tour.visit(index('native-face'),true);await Promise.resolve();eq([...timers.values()][0].ms,12000);doc.dispatchEvent({type:'pointerdown',target:nodes.get('maskDx')});await pending;ok(!tour.state.running,'can pause during source wait');eq(timers.size,0);release();await Promise.resolve();eq(tour.state.index,index('native-face'),'late response does not advance tour');
 const timed=tour.visit(index('native-face'),true);await Promise.resolve();await [...timers.values()][0].fn();await timed;ok(nodes.get('benchTourActionStatus').textContent.startsWith('HOLD'),'bounded unanswered request');tour.pause();release();
 const small=fixture(true);for(const id of ['mask-lrrl','fold-play','caro-open','launch','ninefold','ail','adapter-a'])await small.tour.visit(small.index(id));eq(small.intervals.size,0,'reduced motion skips autoplay');ok(!small.calls.some(c=>['play','start','run'].includes(c[1])),'no automatic motion source calls in reduced mode');
 const demo=fixture();await demo.nodes.get('benchTourClockDemo').click();
 for(let i=0;i<6;i++){eq(demo.tour.state.index,demo.index(['clock-source','clock-connect','clock-step','clock-play','clock-pause','clock-disconnect'][i]));ok(demo.tour.state.running);const dwell=[...demo.timers.values()].find(t=>t.ms===18000);ok(dwell);await dwell.fn();}
 ok(demo.tour.state.completed&&!demo.tour.state.running);eq(demo.tour.state.index,demo.index('clock-disconnect'));ok(!demo.win.A0MaskClockBench.connected);
 eq(demo.calls.filter(c=>c[0]==='clock'&&c[1]!=='disconnect').map(c=>c[1]),['CONNECT','STEP','PLAY','PAUSE']);
 const failed=fixture();failed.win.A0MaskClockBench.confirmed=()=>Promise.reject(Error('ACK fehlt'));await failed.tour.visit(failed.index('clock-connect'),true);ok(failed.nodes.get('benchTourActionStatus').textContent.startsWith('HOLD'));ok(!failed.tour.state.running);eq(failed.timers.size,0);
 await small.tour.visit(small.index('clock-play'));ok(!small.calls.some(c=>c[0]==='clock'&&c[1]==='PLAY'));ok(small.calls.some(c=>c[0]==='clock'&&c[1]==='PAUSE'));
 const cancelled=fixture();let late;cancelled.win.A0MaskClockBench.confirmed=()=>new Promise(resolve=>{late=resolve;});const wait=cancelled.tour.visit(cancelled.index('clock-connect'),true);await Promise.resolve();cancelled.tour.pause();await wait;late({source:{clock:1,playing:false},maskTick:19});await Promise.resolve();ok(!cancelled.tour.state.running);eq(cancelled.timers.size,0);
 const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');ok(html.indexOf('id="benchShowcase"')<html.indexOf('id="nsnGlbSources"'),'hero precedes source inventory');ok(html.includes('id="benchTourTop"'),'top action');ok(!/maskExport|foldLagExport|codeCalendarExport/.test(fs.readFileSync(__dirname+'/a0-bench-showcase-tour.js','utf8')),'no downloads');
 console.log(JSON.stringify({status:'PASS',checks,stations:T.STATIONS.length,realModels:['mask assembly','code calendar','5B'],browserAcceptance:false,scope:'Mounted tour handlers, actual local module handlers, modal dock ownership, async cancellation and timeout, timers and reduced motion; no browser pixels or native source acceptance'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
