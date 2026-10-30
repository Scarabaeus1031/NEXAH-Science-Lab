'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),a=require('node:assert/strict'),B=require('./a0-core-research-book.js');
let checks=0;const ok=(x,s)=>{checks++;a.ok(x,s);};const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const manifest=JSON.parse(read('assets/a0-core-research-book-v1.json')),html=read('A0_TOURS.html'),pascal=read('A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html'),bench=read('A0_ORIENTATION_CONTROLLER_BENCH.html');
for(const e of B.entries)for(const lens of ['human','science','builder']){const r=B.state(e.id,lens);ok(r.entry.id===e.id);ok(r.reading===e.lenses[lens]);ok(r.runtimeCoupling===false&&r.newScientificRun===false);ok(r.entry.boundary.length>20);}
for(const args of [['unknown','science'],['landscape','random']]){a.throws(()=>B.state(...args));checks++;}
for(const source of manifest.sources){const file=path.resolve(__dirname,decodeURIComponent(source.path));ok(fs.existsSync(file),source.path);ok(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===source.sha256,'exact source bytes '+source.role);}
const receipt=JSON.parse(read('assets/core-snapshots/PASCAL_PENTAGON_EXPLORER_2026-10-15.receipt.json'));
ok(receipt.snapshot_sha256===manifest.sources.find(s=>s.role==='unchanged-pascal-publication-snapshot').sha256,'original frozen snapshot unchanged');
const results=JSON.parse(fs.readFileSync(path.resolve(__dirname,decodeURIComponent(B.UTG)+'UTG_FORMAL_01_LORENZ_CROSSING_CONTROL_2026-10-06/UTG_FORMAL_01_RESULTS.json'),'utf8'));
ok(results.status==='PASS'&&results.carrier.reference_dt===0.001,'reads existing result, no run');
ok(results.sampling.length===4&&results.sampling.every(s=>s.events===50&&s.admitted_positive===25&&s.rejected_negative===25),'displayed counts match frozen record at all four resolutions');
for(const [filename,s]of [['A0_TOURS.html',html],['A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html',pascal],['A0_ORIENTATION_CONTROLLER_BENCH.html',bench]]){
 const ids=[...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);ok(ids.length===new Set(ids).size,'unique IDs '+filename);
 for(const match of s.matchAll(/<script>([\s\S]*?)<\/script>/g)){new vm.Script(match[1]);checks++;}
}
const dynamic=new Set(['A0_THEORY_STORYBOARD.html#architecture','../../../SCIENCE_LAB/NAVIGATION/APP/index.html#a0-orientation-evidence']);
for(const match of pascal.matchAll(/<a[^>]+href="([^"]+)"/g)){
 const href=match[1],url=new URL(href,'file://'+__dirname+'/A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html'),file=decodeURIComponent(url.pathname);ok(fs.existsSync(file),'Pascal target '+href);
 if(url.hash&&!dynamic.has(href))ok(fs.readFileSync(file,'utf8').includes('id="'+url.hash.slice(1)+'"'),'Pascal anchor '+href);
}
const nav=read('a0-context-navigation.js');for(const target of ['A0_TOURS.html#core-lorenz','A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html#connection-status','A0_ORIENTATION_CONTROLLER_BENCH.html#pentagonWorkbench'])ok(nav.includes(target),'shared route '+target);
ok(pascal.includes('PENT→Master→UI-Return'),'bounded runtime seam');ok(bench.includes('a0-pentagon-bench-adapter.js'),'explicit adapter');
class Node{
 constructor(){this.dataset={};this.attrs={};this.children=[];this.events={};this.textContent='';this.hidden=false;}
 setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]||null;}
 set src(v){this.attrs.src=v;}get src(){return this.attrs.src;}
 appendChild(n){this.children.push(n);return n;}replaceChildren(){this.children=[];}addEventListener(k,fn){this.events[k]=fn;}
}
const ids=new Map(),viewButtons=B.entries.map(e=>{const n=new Node();n.dataset.coreView=e.id;return n;}),lensButtons=['human','science','builder'].map(l=>{const n=new Node();n.dataset.coreLens=l;return n;});
const doc={getElementById:id=>{if(!ids.has(id))ids.set(id,new Node());return ids.get(id);},createElement:()=>new Node()};
doc.getElementById('core-lorenz').querySelectorAll=s=>s==='[data-core-view]'?viewButtons:lensButtons;
const before=JSON.stringify(B.entries),ui=B.mount(doc);ok(ui.getState().view==='landscape');ok(ids.get('coreBookMedia').children.length===2);
for(const view of viewButtons){view.events.click();for(const lens of lensButtons){lens.events.click();const r=ui.getState();ok(r.view===view.dataset.coreView);ok(r.lens===lens.dataset.coreLens);ok(ids.get('coreBookReading').textContent===r.entry.lenses[r.lens]);ok(view.attrs['aria-pressed']==='true');ok(lens.attrs['aria-pressed']==='true');ok(ids.get('coreBookMedia').children.length===(r.entry.media.length||1));}}
ok(ui.getState().view==='control');ok(ids.get('coreBookCode').hidden,'control points at frozen result, not simulation button');
ids.get('coreBookNext').events.click();ok(ui.getState().view==='control','bounded end');ids.get('coreBookPrevious').events.click();ok(ui.getState().view==='timeline');
viewButtons[0].events.click();ids.get('coreBookPrevious').events.click();ok(ui.getState().view==='landscape','bounded start');
let figure=ids.get('coreBookMedia').children[0],img=figure.children[0].children[0];img.events.error();ok(img.hidden);ok(figure.children[1].textContent.includes('Bildquelle derzeit nicht verfügbar'));ok(figure.children[0].href.startsWith(B.MEDIA));
ok(JSON.stringify(B.entries)===before,'reading does not mutate source descriptors');ok(!/setInterval|setTimeout|requestAnimationFrame|fetch\(|postMessage|localStorage/.test(read('a0-core-research-book.js')),'no own runtime/clock/host mutations');
ok(bench.includes('a0-pentagon-contract.js')&&bench.includes('sandbox="allow-scripts"'),'typed sandbox runtime; actual renderer tested separately');
ok(manifest.authority.newGraphRelation===false&&manifest.authority.researchActivation===false&&manifest.authority.sourceResultsModified===false);
console.log('PASS '+checks+' research-book, source hash, Pascal links and simulated DOM checks; no live-browser claim.');
