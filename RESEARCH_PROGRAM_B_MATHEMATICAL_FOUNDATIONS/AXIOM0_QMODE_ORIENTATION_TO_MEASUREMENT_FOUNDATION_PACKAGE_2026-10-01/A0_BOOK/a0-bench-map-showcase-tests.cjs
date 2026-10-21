'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const mount=require('./a0-bench-map-showcase.js'),model=require('./a0-bench-map.js');
let checks=0;
function ok(value){assert(value);checks++;}
class Element{
 constructor(){this.dataset={};this.handlers={};this.parts={};this.classes=new Set();this.classList={toggle:(c,on)=>on?this.classes.add(c):this.classes.delete(c)};}
 set innerHTML(value){this.html=value;}
 querySelector(s){return this.parts[s]||(this.parts[s]=new Element());}
 addEventListener(type,fn){(this.handlers[type]||=[]).push(fn);}
 emit(type,target=this){for(const fn of this.handlers[type]||[])fn({target,preventDefault(){}});}
 setAttribute(k,v){this[k]=v;}
 prepend(frame){this.parts['.bms-thumb']=frame;}
 before(pane){this.inserted=pane;}
 closest(){return this.dataset.benchMapModule?this:null;}
}
const host=new Element(),stage=new Element(),nodes=model.MODULES.map(m=>{const n=new Element();n.dataset.benchMapModule=m.id;return n;});
host.parts['.bench-map-stage']=stage;host.querySelectorAll=()=>nodes;host.contains=n=>nodes.includes(n);
// Ensure each first read knows that no thumbnail has been mounted yet.
for(const n of nodes)n.querySelector=function(s){return this.parts[s]||null;};
const refresh=new Element(),cards={};
for(const m of model.MODULES){
 const card=new Element();card.parts['[data-btc-image]']={src:'data:image/png;base64,AA',alt:'snapshot '+m.id};
 card.parts['[data-btc-preview-label]']={textContent:'Quellansicht · Momentaufnahme'};cards[m.id]=card;
}
const doc={getElementById:id=>id==='benchMap'?host:null,createElement:()=>new Element(),
 querySelector:s=>s==='[data-btc-refresh]'?refresh:cards[s.match(/data-btc-card="([^"]+)"/)?.[1]]||null};
let opened=null,refreshed=0,load;
const win={A0BenchMap:model,A0BenchToolCatalog:{sketch:()=>'<svg/>'},
 A0BenchToolCatalogController:{open:id=>opened=id,refresh:()=>refreshed++},
 addEventListener:(name,fn)=>{ok(name==='load');load=fn;}};
const api=mount(doc,win),pane=stage.inserted;
ok(api);ok(nodes.every(n=>n.parts['.bms-thumb']));ok(host.dataset.showcase==='on');
for(const m of model.MODULES){ok(api.show(m.id));ok(api.current===m.id);ok(pane.querySelector('[data-bms-open]').href==='#'+m.focusTarget);}
ok(!api.show('not-a-tool'));
host.emit('pointerover',nodes[0]);ok(api.current===nodes[0].dataset.benchMapModule);ok(opened===null);
host.emit('focusin',nodes[1]);ok(api.current===nodes[1].dataset.benchMapModule);ok(opened===null);
host.emit('click',nodes[2]);ok(api.current===nodes[2].dataset.benchMapModule);
pane.querySelector('[data-bms-open]').emit('click');ok(opened===api.current);
pane.querySelector('[data-bms-mode]').emit('click');ok(host.dataset.showcase==='off');
pane.querySelector('[data-bms-mode]').emit('click');ok(host.dataset.showcase==='on');
pane.querySelector('[data-bms-refresh]').emit('click');ok(refreshed===1);
load();ok(api.current===nodes[2].dataset.benchMapModule);
// Missing original is honestly labelled and remains navigable.
delete cards[nodes[0].dataset.benchMapModule];api.refresh();api.show(nodes[0].dataset.benchMapModule);
ok(pane.querySelector('[data-bms-label]').textContent.includes('Orientierungsskizze'));
ok(mount({getElementById:()=>null},win)===null);
const source=fs.readFileSync(require.resolve('./a0-bench-map-showcase.js'),'utf8');
ok(!/setInterval|setTimeout|postMessage|fetch\(|createElement\(['"]iframe/.test(source));
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
ok(html.indexOf('<script src="a0-bench-map-showcase.js"')>html.indexOf('<script src="a0-bench-tool-catalog.js"'));
console.log(JSON.stringify({status:'PASS',checks,modules:nodes.length,visual_browser_acceptance:'OPEN'}));
