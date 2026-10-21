'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const A=require('./a0-bench-machine-picture.js'),M=require('./a0-bench-map.js'),S=require('./a0-bench-visual-shelves.js');
let checks=0;const ok=v=>{assert(v);checks++;};
const nodes=A.layout();ok(nodes.length===39);ok(new Set(nodes.map(n=>n.id)).size===39);
ok(require('./a0-bench-foyer.js').isFoyer('#benchMachinePicture'));
for(const n of nodes){ok(M.moduleById(n.id).focusTarget===n.focusTarget);ok(n.x>=0&&n.x+101<1260&&n.y>=0&&n.y+43<1090);}
for(const m of M.MODULES){
 const svg=A.drawing(m.id);ok((svg.match(/data-machine-select=/g)||[]).length===39);ok((svg.match(/data-machine-edge=/g)||[]).length===M.EDGES.length);ok(!/NaN|Infinity|undefined/.test(svg));ok(svg.includes('aria-current="true"'));
}
for(const edge of M.EDGES)ok(A.drawing().includes('data-machine-edge="'+edge.id+'"'));
for(const e of S.entries()){
 const demo=S.demonstrator(e);if(!demo)continue;
 ok(fs.existsSync(path.resolve(__dirname,demo.split(/[?#]/)[0])));
 const html=fs.readFileSync(path.resolve(__dirname,demo.split(/[?#]/)[0]),'utf8');
 if(demo.includes('?world=domains')){const router=fs.readFileSync(__dirname+'/a0-game-of-worlds-play.js','utf8');ok(html.includes('id="domainLenses"')&&router.includes("domains:")&&router.includes('world'));}
 else ok(html.includes('id="'+demo.split('#')[1]+'"'));
 ok(S.card(e,null,null).includes('Demonstrator erleben'));
}
class E{
 constructor(){this.parts={};this.events={};this.dataset={};}
 querySelector(s){return this.parts[s]||(this.parts[s]=new E());}
 addEventListener(k,f){this.events[k]=f;}focus(){this.focused=true;}
 setAttribute(k,v){this[k]=v;}
}
const host=new E(),events={},opened=[];let refresh=0;
const doc={getElementById:id=>id==='benchMachinePicture'?host:null,querySelector:()=>null};
const win={A0BenchVisualShelves:S,A0BenchVisualShelvesController:{open:id=>{opened.push(id);return true;}},A0BenchToolCatalogController:{refresh:()=>refresh++},addEventListener:(k,f)=>events[k]=f};
const ctl=A.mount(doc,win),el=n=>host.querySelector('[data-bmp-'+n+']');
ok(ctl.selected==='body-route');ok(el('demo').href.includes('pentagon-body-player'));ok(!el('demo').hidden);
ok(el('links').textContent.includes('Kein Kantenrecord'));
let prevented=false;
host.events.click({target:{closest:()=>({dataset:{machineSelect:'state'}})},preventDefault:()=>prevented=true});
ok(prevented);ok(ctl.selected==='state');ok(el('links').textContent.includes('LIVE COUPLED'));ok(el('demo').hidden);
el('open').events.click({preventDefault(){}});ok(opened[0]==='state');
el('module').value='mask-observer';el('module').events.change();ok(ctl.selected==='mask-observer');
el('module').value='not-a-module';el('module').events.change();ok(ctl.selected==='mask-observer');
el('refresh').events.click();ok(refresh===1);events.load();ok(ctl.selected==='mask-observer');
el('size').events.click();ok(host.dataset.expanded==='true');el('size').events.click();ok(host.dataset.expanded==='false');
el('mode').events.click();ok(el('mode').textContent==='Zur Gesamtkomposition');el('mode').events.click();ok(el('mode').textContent==='Zum Lageplan');
ok(A.mount({getElementById:()=>null},win)===null);
const source=fs.readFileSync(__dirname+'/a0-bench-machine-picture.js','utf8');ok(!/setInterval|requestAnimationFrame|postMessage|fetch\(|\.play\(|createElement\(['"]iframe/.test(source));
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');ok(html.indexOf('id="benchMachinePicture"')<html.indexOf('id="foyerDoors"'));ok(html.indexOf('src="a0-bench-machine-picture.js"')>html.indexOf('src="a0-bench-visual-shelves.js"'));
console.log(JSON.stringify({status:'PASS',checks,modules:39,existingEdges:19,scope:'exact graph reuse, finite architecture placement, selection, missing edges, demonstrator targets, source-open delegation and no source clocks; browser pixels OPEN'}));
