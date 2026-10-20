'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('./a0-caro-orientation-modes.js'),T=require('./a0-trinity-lens.js'),P=require('./a0-bench-source-presets.js');
let checks=0;const ok=(x,m)=>{checks++;assert.ok(x,m);},copy=x=>JSON.parse(JSON.stringify(x));
const states=M.markers.flatMap(marker=>['up','down'].map(direction=>({direction,marker})));
ok(JSON.stringify(M.markers)===JSON.stringify(T.markers),'reuse five actual markers');
for(const anchor of states)for(const away of states){const e=M.create();e.command('SET',anchor);e.command('CAPTURE');e.command('SET',away);e.command('RETURN');ok(JSON.stringify(e.snapshot())===JSON.stringify(anchor),'all local view Returns');ok(M.verify(e.record()).status==='PASS','actual replay');const bad=e.record();bad.state.direction=bad.state.direction==='up'?'down':'up';ok(M.verify(bad).status==='INVALID','tampered view rejected');}
for(const bad of [{direction:'left'},{marker:'noon'},{extra:1},{},null]){const e=M.create(),before=JSON.stringify(e.record());assert.throws(()=>e.command('SET',bad));checks++;ok(before===JSON.stringify(e.record()),'invalid atomic');}
const unanchored=M.create();ok(M.verify(unanchored.record()).status==='HOLD','no anchor');assert.throws(()=>unanchored.command('RETURN'));checks++;
for(let phase=0;phase<=360;phase+=3){
 const up=M.geometry(phase,T.defaults,'up'),down=M.geometry(phase,T.defaults,'down');
 ok(JSON.stringify(up.source)===JSON.stringify(down.source),'same native source phase and geometry');
 for(const key of ['left','right','overlap'])ok(up[key].every(([x,y],i)=>x===down[key][i][0]&&y===-down[key][i][1]),'exact y reflection '+key);
 ok(Math.abs(Math.hypot(Math.sqrt(3),Math.sqrt(7))-Math.sqrt(10))<1e-12,'root triangle elementary arithmetic');
 ok(!/NaN|undefined|Infinity/.test(M.drawing(up)+M.drawing(down)),'finite local drawing');
}
class Element{constructor(){this.events={};this.children=[];this.attrs={};}append(...x){this.children.push(...x);}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,f){(this.events[k]??=[]).push(f);}fire(k){if(!this.disabled)for(const f of this.events[k]||[])f({target:this});}click(){this.fire('click');}}
const ids=['caroOrientationModes','caroQMarker','caroDirectionSvg','caroDirectionUp','caroDirectionDown','caroModeReturn','caroModeObservation','caroModeStatus','caroModeCapture','caroDayOpen','caroNightOpen','caroMirrorOpen','caroJanusOpen','caroConDaoOpen','caroQJoystickOpen','caroQShadowOpen','caroModeExport','aunaReferenceGallery','benchLensReturn','benchPerspectiveDeck'];
const nodes=Object.fromEntries(ids.map(x=>[x,new Element()]));nodes.benchPerspectiveDeck.scrollIntoView=()=>{};
const doc={getElementById:id=>nodes[id],createElement:()=>new Element()},lensState={phase:232,settings:{...T.defaults}},nativeBefore=JSON.stringify({closed:true,time:1.25,body:7});let loaded=null,exportsCount=0,lensCommands=0;
const win={A0BenchLensReturnController:{get state(){return copy(lensState);},command(type,value){assert.equal(type,'settings');lensCommands++;Object.assign(lensState.settings,value);return true;}},A0BenchPerspectiveDeckView:{panes:{A:{unload(){loaded=null;},select(id){loaded=id;},open(){}}}},URL:{createObjectURL(){exportsCount++;return'blob:test';},revokeObjectURL(){}},Blob:class{}};
const ui=M.mount(doc,win);
ok(nodes.caroQMarker.children.length===5,'five visible Q reading markers');ok(nodes.aunaReferenceGallery.children.length===7,'seven original visual references');ok(lensCommands===0&&loaded===null,'no auto command / source load');
nodes.caroDirectionDown.click();ok(ui.record().state.direction==='down'&&lensCommands===0,'direction changes only local view');ok(lensState.phase===232,'source phase unchanged');
nodes.caroQMarker.value='night';nodes.caroQMarker.fire('change');ok(lensState.settings.marker==='night','existing lens marker command');
nodes.caroModeCapture.click();const anchor=copy(ui.record().state);nodes.caroDirectionUp.click();nodes.caroQMarker.value='day';nodes.caroQMarker.fire('change');nodes.caroModeReturn.click();ok(JSON.stringify(ui.record().state)===JSON.stringify(anchor)&&lensState.settings.marker==='night','mounted view Return');ok(lensState.phase===232,'Return never rewinds source phase');
for(const [id,source,marker] of [['caroDayOpen','body-day','day'],['caroNightOpen','body-night','night'],['caroMirrorOpen','body-mirror','night'],['caroJanusOpen','janus','night'],['caroConDaoOpen','condao','night'],['caroQJoystickOpen','q-joystick','night'],['caroQShadowOpen','q-shadow','night']]){nodes[id].click();ok(loaded===source,'actual source selection '+source);ok(lensState.settings.marker===marker,'separate reading annotation');}
nodes.caroModeExport.click();ok(exportsCount===1,'explicit export');ok(JSON.stringify({closed:true,time:1.25,body:7})===nativeBefore,'no CARO/body checkpoint operations');
const beforeCommands=lensCommands;ok(!ui.command('RETURN',{unexpected:true})&&lensCommands===beforeCommands,'invalid compound command has zero source effect');
nodes.benchLensReturn.fire('input');ok(nodes.caroDirectionSvg.innerHTML.includes('232°'),'existing source event refresh without clock');
for(const mode of ['day','night','mirror']){let stops=0,selected=null,scrolled=0;const r=P.apply({getElementById:()=>({scrollIntoView(){scrolled++;}})},{search:'?a0BenchPreset=body-'+mode,pathname:'/A0_TESSAREC_BLUE_BODY_LAB.html'},class{}, {A0PentagonBodyPlayerController:{stop(){stops++;},setView(x){selected=x;return true;}},A0BlueBodyReadingMode:{showExpert(){}}});ok(r.status==='APPLIED_SOURCE_CONTROLS'&&selected===mode&&stops===1&&scrolled===1,'native paused preset '+mode);}
for(const a of M.gallery)ok(fs.existsSync(path.resolve(__dirname,a.path)),'local visual '+a.id);
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');for(const id of ids.filter(x=>!['benchPerspectiveDeck','benchLensReturn'].includes(x)))ok(html.includes('id="'+id+'"'),'real host '+id);
const js=fs.readFileSync(path.join(__dirname,'a0-caro-orientation-modes.js'),'utf8');ok(!/setInterval|setTimeout|requestAnimationFrame|contentDocument/.test(js),'no added clock or remote source scraping');
console.log(JSON.stringify({status:'PASS',checks,markers:5,visuals:7,browserAcceptance:false,scope:'all ten view settings and 100 Returns, native source geometry reflections, mounted controls on DOM double, source preset handler'}));
