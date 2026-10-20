'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++},base=__dirname,html=fs.readFileSync(path.join(base,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8'),receipt=require('./assets/a0-august-source-trail-v1.json');
const manifest=JSON.parse(fs.readFileSync(path.resolve(base,receipt.source_manifest),'utf8')),originals=[];
function scan(o){if(!o||typeof o!=='object')return;if(o.path&&o.sha256&&String(o.path).endsWith('.html'))originals.push(o);for(const v of Object.values(o))scan(v)}scan(manifest);
ok(html.includes('<h1>NEXAH · A I|0</h1>'),'owner display title');
ok(html.includes('A0 Orientation Controller Bench')&&html.includes('id="orientationBench"'),'technical identity and route retained');
ok(receipt.sources.length===8&&new Set(receipt.sources.map(s=>s.file)).size===8,'eight distinct original HTMLs');
const section=html.match(/<section id="augustSourceTrail"[\s\S]*?<\/section>/)?.[0];
ok(section&&section.includes('<details>')&&!section.includes('<details open'),'collapsed source trail');
ok(!/<iframe|<script|<img|<canvas/i.test(section),'no automatically running source embed or rewritten screenshot');
ok(html.includes('href="#augustSourceTrail"'),'navigation route');
for(const s of receipt.sources){const file=path.resolve(base,s.href),bytes=fs.readFileSync(file),hash=crypto.createHash('sha256').update(bytes).digest('hex');
  ok(bytes.length===s.bytes&&hash===s.sha256,'source receipt '+s.file);
  ok(originals.some(o=>o.path.endsWith(s.file)&&o.sha256===hash),'unchanged historical primary '+s.file);
  ok(section.includes('href="'+s.href+'" target="_blank" rel="noopener noreferrer"'),'safe original link '+s.file);
  ok(bytes.toString().includes('<title>'),'source HTML has title '+s.file);
}
for(const marker of ['Sechs sekundäre Screenshots','historischer Originalzustand ist nicht wiederhergestellt','nichtnormative historische Orientierung','Buchstabe O','kein Cn-Antipode','Plug/Cut-Grammatik'])ok(section.includes(marker),'boundary '+marker);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);ok(ids.length===new Set(ids).size,'unique HTML IDs');
for(const href of [...section.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){const [file,anchor]=href.split('#');const target=file?path.resolve(base,file):path.join(base,'A0_ORIENTATION_CONTROLLER_BENCH.html');ok(fs.existsSync(target),'local route '+href);if(anchor)ok(fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'),'target anchor '+anchor);}
class El{constructor(){this.dataset={};this.attrs={};this.events={};this.classes=new Set();this.classList={contains:n=>this.classes.has(n),toggle:(n,on)=>on?this.classes.add(n):this.classes.delete(n)};}addEventListener(n,f){this.events[n]=f}setAttribute(k,v){this.attrs[k]=v}}
function sourceHarness(file,rootId,buttons){const source=fs.readFileSync(path.resolve(base,receipt.sources.find(s=>s.file===file).href),'utf8'),nodes=Object.fromEntries([rootId,...buttons].map(id=>[id,new El()])),root=nodes[rootId];let pauses=0,resumes=0;const svg={pauseAnimations(){pauses++},unpauseAnimations(){resumes++}};root.querySelector=s=>s==='svg'?svg:{};const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]),code=scripts.find(s=>s.includes('getElementById("'+rootId+'")'));ok(!!code,'original controller found '+file);vm.runInNewContext(code,{document:{getElementById:id=>nodes[id]},window:{}});return{nodes,root,counts:()=>({pauses,resumes}),click:id=>nodes[id].events.click()};}
const caro=sourceHarness('nexah-caro-green-mirror-download.html','nexah-caro-green-mirror',['ncgm-close','ncgm-pause','ncgm-status']);caro.root.dataset.state='open';
for(let i=0;i<6;i++){caro.click('ncgm-close');ok(caro.root.dataset.state==='closed'&&caro.nodes['ncgm-status'].textContent==='CLOSED · BLACK MIRROR · LOTUS','original CARO close');caro.click('ncgm-close');ok(caro.root.dataset.state==='open'&&caro.nodes['ncgm-status'].textContent==='OPEN · GREEN MIRROR','original CARO reopen');}
caro.click('ncgm-pause');caro.click('ncgm-pause');ok(caro.counts().pauses===1&&caro.counts().resumes===1,'original CARO pause/resume');
const game=sourceHarness('nexah-game-over-cross-download.html','nexah-game-over-cross',['ngx-fold','ngx-wild','ngx-pause']);game.root.dataset.fold='open';game.root.dataset.wild='off';
game.click('ngx-fold');ok(game.root.dataset.fold==='folded','original fold');game.click('ngx-fold');ok(game.root.dataset.fold==='open','original unfold');game.click('ngx-wild');ok(game.root.dataset.wild==='on','original wild on');game.click('ngx-wild');ok(game.root.dataset.wild==='off','original wild off');game.click('ngx-pause');game.click('ngx-pause');ok(game.counts().pauses===1&&game.counts().resumes===1,'original game pause/resume');
const css=fs.readFileSync(path.join(base,'a0-bench-source-trail.css'),'utf8');ok(css.includes('max-width:700px')&&css.includes('grid-template-columns:1fr')&&css.includes(':focus-visible'),'responsive and keyboard styles');
console.log(JSON.stringify({status:'PASS',checks,scope:'eight unchanged primary hashes, local routes, title, original CARO/Game controller handlers in simulated DOM; not browser pixels or scientific validation'}));
