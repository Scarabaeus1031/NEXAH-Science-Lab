'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),T=require('./a0-bench-showcase-tour.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=x=>{assert.ok(x);checks++;};
eq(T.OVERVIEW.length,8);eq(new Set(T.OVERVIEW.map(s=>s.target)).size,8);
const ids={},events={};
class N{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.events={};this.classNames=new Set();this.classList={add:(...xs)=>xs.forEach(x=>this.classNames.add(x)),remove:(...xs)=>xs.forEach(x=>this.classNames.delete(x)),contains:x=>this.classNames.has(x)};}
 set id(v){this._id=v;ids[v]=this;}get id(){return this._id;}
 append(...xs){for(const x of xs){this.children.push(x);x.parentElement=this;}}
 setAttribute(k,v){this[k]=v;}addEventListener(k,f){(this.events[k]??=[]).push(f);}click(){if(!this.disabled)for(const fn of this.events.click||[])fn();}
 scrollIntoView(){this.scrolled=true;}focus(){this.focused=true;}
 set innerHTML(s){this.html=s;for(const m of s.matchAll(/id="([^"]+)"/g)){const n=new N();n.id=m[1];this.append(n);}}
}
const body=new N('body');body.classList.add('bench-foyer-mode');
for(const id of ['benchGuideTop','benchGuideStart','benchGuideNotice',...T.OVERVIEW.map(s=>s.target)]){const n=new N();n.id=id;body.append(n);}
const drawer=new N('details');drawer.append(ids.apertureMeasurement);
const doc={body,getElementById:id=>ids[id]||null,createElement:t=>new N(t),addEventListener:(k,f)=>(events['doc:'+k]??=[]).push(f)};
const trap=()=>{throw Error('unrequested source write');};
const win={location:{hash:'#benchFoyer'},A0BenchShowcaseTourController:{state:{running:false},start:trap,pause:trap},A0SystemBinderController:{play:trap,pause:trap},A0AnuTowerController:{render:trap},A0PulseBenchMonitor:{connect:trap},addEventListener:(k,f)=>(events[k]??=[]).push(f)};
const guide=T.mountOverview(doc,win);ok(guide);eq(T.mountOverview(doc,win),null);eq(ids.benchGuideBar.hidden,true);eq(guide.state.active,false);
ids.benchGuideTop.click();eq(guide.state.active,true);eq(guide.state.index,0);eq(win.location.hash,'#bodyRouteBench');eq(body.classList.contains('bench-foyer-mode'),false);eq(ids.benchGuidePrev.disabled,true);
for(let i=0;i<8;i++){
 eq(guide.state.index,i);eq(win.location.hash,'#'+T.OVERVIEW[i].target);ok(ids[T.OVERVIEW[i].target].scrolled);ok(ids[T.OVERVIEW[i].target].classList.contains('bench-guide-focus'));
 eq(guide.state.sourceWrites,false);eq(guide.state.automaticAdvance,false);
 if(i<7)ids.benchGuideNext.click();
}
eq(drawer.open,true);ids.benchGuidePrev.click();eq(guide.state.index,6);ids.benchGuideNext.click();ids.benchGuideNext.click();eq(guide.state.active,false);eq(win.location.hash,'#benchFoyer');eq(ids.benchGuideBar.hidden,true);
guide.start();ids.benchGuideClose.click();eq(guide.state.active,false);eq(win.location.hash,'#bodyRouteBench');
guide.start();win.location.hash='#benchMap';for(const fn of events.hashchange)fn();eq(guide.state.active,false);
guide.start();for(const fn of events['doc:keydown'])fn({key:'Escape'});eq(guide.state.active,false);
win.A0BenchShowcaseTourController.state.running=true;eq(guide.start(),false);ok(ids.benchGuideNotice.textContent.includes('zuerst pausieren'));eq(guide.state.active,false);win.A0BenchShowcaseTourController.state.running=false;
guide.start();const previous=guide.state.index,node=ids.anuTowerWorkbench;delete ids.anuTowerWorkbench;eq(guide.visit(4),false);eq(guide.state.index,previous);ids.anuTowerWorkbench=node;guide.close();
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
for(const id of ['benchGuideTop','benchGuideStart','benchGuideNotice'])ok(html.includes('id="'+id+'"'));
for(const s of T.OVERVIEW)ok(html.includes('id="'+s.target+'"')||['anuTowerWorkbench','pulseBenchMonitor','carrierReturnWorkbench','benchWorkDesk'].includes(s.target));
ok(html.includes('mountOverview(document,window)'));ok(html.includes('a0-bench-entry.css'));
const source=fs.readFileSync('a0-bench-showcase-tour.js','utf8'),overview=source.slice(source.indexOf('  const OVERVIEW='),source.indexOf('  return{VERSION,STATIONS'));
ok(!/setTimeout|setInterval|postMessage|\.play\(|\.start\(|\.pause\(|\.step\(/.test(overview));
const desk=fs.readFileSync('a0-bench-workdesk.js','utf8');ok(desk.includes("doc.getElementById('systemBinder')||"));ok(desk.includes('Anschlussdiagnose · drei lokale Lesepfade'));ok(desk.includes("['benchShowcase','Erweiterte Vorführung"));
console.log('PASS · '+checks+' overview route/navigation-only/source-write-trap checks; no browser pixels');
