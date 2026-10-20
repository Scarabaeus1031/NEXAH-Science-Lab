'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),C=require('./a0-coupled-window.js'),A=require('./a0-bench-atlas-window.js'),G=require('./a0-bench-fold-guide.js'),B=require('./a0-bench-lens-return.js'),M=require('./a0-game-of-numbers-model.js');
let checks=0;function ok(v,m){checks++;assert.ok(v,m);}
function node(){return {attrs:{},events:{},dataset:{},textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this.attrs[k]=String(v);},removeAttribute(k){delete this.attrs[k];},addEventListener(k,f){this.events[k]=f;},focus(){this.focused=true;}};}
for(let phase=0;phase<=360;phase++){
 const f=M.mixerFold(phase),svg=G.drawing(phase);ok(!/NaN|undefined|Infinity/.test(svg),'finite guide');ok((svg.match(/data-crown=/g)||[]).length===20,'twenty crown marks');ok(svg.includes('CROWN '+String(f.crownTick).padStart(2,'0')+'/19'),'same source crown');ok(svg.includes('AXIS '+f.axis+' · '+f.angle+'°'),'same source angle');ok(svg.includes('VIEW CLOSED')===f.foldReturn,'only source endpoint view return');
}
for(const bad of [NaN,-1,361,Infinity]){assert.throws(()=>G.drawing(bad));checks++;}
assert.deepEqual(M.MIXER_FOLD_STOPS.map(x=>x.angle),[0,78,33,7,0]);checks++;
// Real existing modal shell, invoked by the real Atlas launcher.
const ids=['coupledWindow','coupledWindowTitle','coupledWindowEyebrow','coupledWindowCopy','coupledWindowStage','coupledWindowClose','coupledWindowReturn','coupledWindowSize','coupledWindowStatus','atlasTessarecOpen','atlasTessarecStatus'];
const nodes=Object.fromEntries(ids.map(id=>[id,node()])),dialog=nodes.coupledWindow;dialog.showModal=()=>{dialog.open=true;};dialog.close=()=>{dialog.open=false;};
const doc={getElementById:id=>nodes[id]||null,baseURI:'file:///bench/A0_ORIENTATION_CONTROLLER_BENCH.html',activeElement:nodes.atlasTessarecOpen,body:node(),querySelectorAll:()=>[],addEventListener(){}};
const win={scrollX:0,scrollY:42,scrollTo(){},requestAnimationFrame:fn=>fn(),clearInterval(){},matchMedia:()=>({matches:false})};
win.A0CoupledWindowController=C.mount(doc,win);const launch=A.mount(doc,win);ok(!dialog.open&&!nodes.coupledWindowStage.innerHTML,'no auto-loaded frame');
nodes.atlasTessarecOpen.events.click();ok(dialog.open&&win.A0CoupledWindowController.maximized,'Atlas opens maximized');ok(nodes.coupledWindowStage.innerHTML.includes(A.SOURCE),'exact Atlas fragment');ok((nodes.coupledWindowStage.innerHTML.match(/<iframe/g)||[]).length===1,'one original source frame');ok(nodes.coupledWindowCopy.textContent.includes('eigene')||nodes.coupledWindowCopy.textContent.includes('Eigene'),'clock boundary');
nodes.coupledWindowClose.events.click();ok(!dialog.open&&nodes.coupledWindowStage.innerHTML==='','closing unloads source iframe');ok(nodes.atlasTessarecOpen.focused,'focus returned');
launch.open();nodes.coupledWindowReturn.events.click();ok(nodes.coupledWindowStage.innerHTML==='','return unloads source');
launch.open();dialog.events.cancel({preventDefault(){}});ok(nodes.coupledWindowStage.innerHTML==='','escape unloads source');
launch.open();win.A0CoupledWindowController.openDocument('other.html');ok(!nodes.coupledWindowStage.innerHTML.includes(A.SOURCE),'replace removes old source');win.A0CoupledWindowController.close();ok(nodes.coupledWindowStage.innerHTML.includes('other.html'),'legacy reader close behavior unchanged');
const hold=A.mount(doc,{});ok(hold.open().status==='HOLD','missing API fails closed');
// Actual lens-return mount, same-phase controls and independent integer state.
const controls=new Map(),get=q=>{if(!controls.has(q))controls.set(q,node());return controls.get(q);};
const stops=M.MIXER_FOLD_STOPS.map(s=>Object.assign(node(),{dataset:{blrStop:String(s.phase)}}));
const actions=['swap','capture','step','inverse','return','export','reset'].map(a=>Object.assign(get('[data-blr-action="'+a+'"]'),{dataset:{blrAction:a}}));
const host={innerHTML:'',querySelector:get,querySelectorAll:q=>q==='[data-blr-stop]'?stops:q==='[data-blr-action]'?actions:[]};
const lensDoc={getElementById:()=>host},lensWin={A0BenchFoldGuide:G};const lens=B.mount(lensDoc,lensWin),initial=JSON.stringify(lens.state.session);
for(const stop of stops){stop.events.click();const phase=Number(stop.dataset.blrStop),r=lens.record();ok(lens.state.phase===phase&&r.reading.lens.phase===phase,'real preset updates lens phase');ok(get('[data-blr-guide]').innerHTML===G.drawing(phase),'real preset updates guide');ok(r.reading.fold.angle===M.mixerFold(phase).angle,'record exact source fold');ok(JSON.stringify(lens.state.session)===initial,'phase never advances integer channel');ok(B.verify(r).status==='PASS','native record unchanged');ok(stop.attrs['aria-pressed']==='true','preset selection');}
get('[data-blr-phase]').events.input({target:{value:'232'}});ok(lens.state.phase===232,'existing slider drives both');
ok(get('[data-blr-guide]').innerHTML===G.drawing(232),'slider guide drawing');
lens.command('capture');lens.command('step');lens.command('return');ok(lens.state.session.cursor===0&&lens.state.phase===232,'integer return leaves display phase independent');
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),atlas=fs.readFileSync('A0_FAMILY_CONNECTION_ATLAS.html','utf8');
ok(html.includes('id="atlasTessarecBench"'),'visible top-level entry');ok(html.indexOf('id="atlasTessarecBench"')<html.indexOf('id="benchShowcase"'),'entry before tour');ok(html.indexOf('src="a0-bench-fold-guide.js"')<html.indexOf('src="a0-bench-lens-return.js"'),'guide dependency before mount');
for(const token of ['twPhase','twView','twFormat','twValidationStart','bbcRun','q4p3','location.hash===\'#tessarec\''])ok(atlas.includes(token),'native Atlas controls retained '+token);
ok(Object.keys(C.SCENARIOS).length===14,'no new scenario identity');
ok(!/setInterval|requestAnimationFrame|postMessage|fetch\(/.test(fs.readFileSync('a0-bench-atlas-window.js','utf8')),'launcher adds no clock or bridge');
console.log(JSON.stringify({status:'PASS',checks,browserAcceptance:false,scope:'source law, all 361 phases, actual reader/launcher lifecycle, actual lens controls and record boundaries; no browser pixels or native Atlas UI acceptance'}));
