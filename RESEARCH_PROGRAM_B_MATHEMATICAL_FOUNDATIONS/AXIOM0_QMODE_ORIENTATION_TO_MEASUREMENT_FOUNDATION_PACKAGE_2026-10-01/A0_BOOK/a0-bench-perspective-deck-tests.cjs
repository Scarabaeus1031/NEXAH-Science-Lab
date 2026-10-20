'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('./a0-bench-perspective-deck.js'),P=require('./a0-bench-source-presets.js'),F=require('./a0-fold-lag-lens.js'),C=require('./a0-fold-cycle-coupling.js');
let checks=0;const ok=(x,m)=>{checks++;assert.ok(x,m);};
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.events={};this.attrs={};this.disabled=false;}
 append(...x){this.children.push(...x);} prepend(...x){this.children.unshift(...x);} replaceChildren(...x){this.children=x;}
 setAttribute(k,v){this.attrs[k]=v;} addEventListener(k,f){(this.events[k]??=[]).push(f);}
 fire(k){if(!this.disabled)for(const f of this.events[k]||[])f({target:this});} click(){this.fire('click');}
 dispatchEvent(e){for(const f of this.events[e.type]||[])f(e);}
}
const ids=['benchPerspectiveDeck','perspectivePaneA','perspectivePaneB','perspectivePairLoki','perspectivePairFlower','perspectivePairOrbit','perspectivePairJoint','perspectiveUnloadAll','perspectiveExport','perspectiveFoldReadout','perspectiveFoldSvg','foldCycleEnabled'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Element('div')]));nodes.foldCycleEnabled.checked=true;
const doc={getElementById:id=>nodes[id]||null,createElement:tag=>new Element(tag)};
let prior=0,exportCount=0;const win={A0FoldLagView:{snapshot:()=>F.snapshot(0),onRender:()=>prior++},A0FoldLagLens:F,A0FoldCycleCoupling:C,URL:{createObjectURL(blob){exportCount++;JSON.parse(blob.parts[0]);return'blob:test';},revokeObjectURL(){}},Blob:class{constructor(parts){this.parts=parts;}}};
const deck=D.mount(doc,win);
ok(D.sources.length===30&&new Set(D.sources.map(s=>s.id)).size===30,'30 distinct source/mode entry points');
ok(nodes.perspectivePaneA.children.at(-1).children.length===0,'no iframe auto-load');
for(const source of D.sources){
 const url=new URL(source.path,'file://'+__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html'),file=decodeURIComponent(url.pathname);
 ok(fs.existsSync(file),'existing original '+source.id);
 const text=fs.readFileSync(file,'utf8');
 if(url.hash)ok(text.includes('id="'+url.hash.slice(1)+'"')||source.id==='flower'&&text.includes("location.hash==='#tessarec'"),'existing anchor or source-owned route '+source.id);
 if(url.search)ok(text.includes('a0-bench-source-presets.js'),'source-owned preset support '+source.id);
 deck.panes.A.select(source.id);ok(deck.panes.A.open().status==='REQUESTED','explicit load '+source.id);
 const slot=nodes.perspectivePaneA.children.at(-1),frame=slot.children[0];
 ok(frame.src===source.path,'native URL unchanged '+source.id);ok(deck.panes.A.open().status==='ALREADY_LOADED','no duplicate frame');
 assert.throws(()=>deck.panes.A.select('flower'));checks++;
 frame.fire('load');ok(deck.snapshot().panes.A.documentLoaded&&!deck.snapshot().panes.A.modeReadback,'load is not mode readback');
 deck.panes.A.unload();ok(frame.src==='about:blank'&&slot.children.length===0,'browsing context unloaded');
 const status=nodes.perspectivePaneA.children.at(-2),before=status.textContent;frame.fire('load');frame.fire('error');ok(status.textContent===before,'stale callbacks ignored');
}
for(const button of ['perspectivePairLoki','perspectivePairFlower','perspectivePairOrbit','perspectivePairJoint']){
 nodes[button].click();ok(!!deck.snapshot().panes.A.requested&&!!deck.snapshot().panes.B.requested,'pair loaded');
 nodes.perspectiveUnloadAll.click();ok(!deck.snapshot().panes.A.requested&&!deck.snapshot().panes.B.requested,'pair unloaded');
}
for(let z=0;z<=28;z++){
 const source=F.snapshot(z),before=JSON.stringify(source);win.A0FoldLagView.onRender(source);
 ok(JSON.stringify(source)===before,'source pose immutable');ok(deck.snapshot().fold.slice===z,'same real source Z');
 ok(nodes.perspectiveFoldSvg.innerHTML===C.presentation(C.snapshot(source,true)),'exact existing presentation');
 ok(nodes.perspectiveFoldReadout.textContent.includes('ABSCHLUSS')===(z===28),'endpoint only');
}
ok(prior===29,'existing callback preserved');nodes.foldCycleEnabled.checked=false;win.A0FoldLagView.onRender(F.snapshot(28));
ok(!nodes.perspectiveFoldReadout.textContent.includes('ABSCHLUSS'),'disabled coupling respected');nodes.perspectiveExport.click();ok(exportCount===1,'explicit parseable export');
ok(!deck.snapshot().sharedClock&&!deck.snapshot().wholeMachineReturn,'separate identities');
class Event{constructor(type){this.type=type;}}
for(const [mode,pair] of Object.entries(P.synthesis)){
 const system=new Element('select'),observer=new Element('select'),pd={getElementById:id=>id==='system'?system:observer};
 const r=P.apply(pd,{search:'?a0BenchPreset=synthesis-'+mode,pathname:'/NEXAH_FAMILY_SYNTHESIS_DEMONSTRATOR.html'},Event);
 ok(r.status==='APPLIED_SOURCE_CONTROLS','synthesis preset '+mode);ok(system.value===pair[0]&&observer.value===pair[1],'source controls '+mode);ok(!r.wordStarted,'no automatic word');
}
for(const mode of P.frames){let clicked=0;const pd={querySelector:q=>q==='[data-frame="'+mode+'"]'?{click(){clicked++;}}:null};
 ok(P.apply(pd,{search:'?a0BenchPreset=miwa-'+mode,pathname:'/MIWA_PINEAP_AN_DROMEDA.html'},Event).status==='APPLIED_SOURCE_CONTROLS'&&clicked===1,'MIWA preset '+mode);
}
ok(P.apply(null,{search:''},Event).status==='INACTIVE','standalone source unaffected');
for(const loc of [{search:'?a0BenchPreset=synthesis-bad',pathname:'/NEXAH_FAMILY_SYNTHESIS_DEMONSTRATOR.html'},{search:'?a0BenchPreset=miwa-loki',pathname:'/wrong.html'}]){
 const body=new Element('body');ok(P.apply({body,createElement:tag=>new Element(tag)},loc,Event).status==='HOLD'&&body.children.length===1,'invalid preset fails closed visibly');
}
// Exercise the actual source word scheduler, not a second implementation.
const synthesisPath=path.resolve(__dirname,D.sources[0].path.split('?')[0]),source=fs.readFileSync(synthesisPath,'utf8');
const timers=new Map();let next=0;const context={model:{current:0,trace:[]},setTimeout(fn){timers.set(++next,fn);return next;},clearTimeout(id){timers.delete(id);},parseWord:()=>[3,0,0,3],render(){},step(i){context.model.current^=1<<i;}};
vm.createContext(context);
const timerCode=source.match(/  let wordTimers=.*?\n/)[0]+source.match(/  function cancelWord\(\).*?\n/)[0]+source.match(/  function reset\(\).*?\n/)[0]+source.match(/  function play\(\).*?\n/)[0];
vm.runInContext(timerCode,context);
context.play();const stale=[...timers.values()];ok(timers.size===5,'actual scheduler pending');
context.reset();ok(timers.size===0&&context.model.current===0,'reset cancels actual source word');for(const fn of stale)fn();ok(context.model.current===0,'epoch guards stale callbacks');
context.play();for(const [id,fn] of [...timers]){timers.delete(id);fn();}ok(context.model.current===0,'actual LOKI 4114 return');
ok(source.includes("addEventListener('change',cancelWord,true)")&&source.includes("addEventListener('pagehide',cancelWord)"),'observer/unload timer safety');
for(const s of [synthesisPath,path.resolve(__dirname,D.sources.find(s=>s.id==='miwa-loki').path.split('?')[0])]){
 const text=fs.readFileSync(s,'utf8');for(const match of text.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){new Function(match[1]);checks++;}
 const src=text.match(/<script src="([^"]*a0-bench-source-presets.js)"/)[1];ok(fs.existsSync(path.resolve(path.dirname(s),src)),'preset script resolves from source');
}
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
for(const id of ids.filter(x=>x!=='foldCycleEnabled'))ok(html.includes('id="'+id+'"'),'visible mount '+id);
ok(html.includes('60/81')&&html.includes('21 grobe 8-Bin'),'negative Critical Orbit report preserved');
ok(!/setInterval|requestAnimationFrame|contentDocument|postMessage/.test(fs.readFileSync(path.join(__dirname,'a0-bench-perspective-deck.js'),'utf8')),'no added host clock, source scraping or hidden command bus');
console.log(JSON.stringify({status:'PASS',checks,sources:D.sources.length,browserAcceptance:false,scope:'real mount on DOM double, all source presets, all 29 existing 5B poses, actual source word scheduler'}));
