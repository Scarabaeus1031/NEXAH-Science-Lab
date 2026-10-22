'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),W=require('./a0-bench-workdesk.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=x=>{assert.ok(x);checks++;};
const links=[{id:'m3',status:'FOLLOWING'},{id:'pascal',status:'HOLD',detail:'Kein Quellenreceipt'},{id:'ihara',status:'CONNECTED'}];
let binder={links},player=null,pulse={status:'HOLD',reason:'CONNECT_REQUIRED',current:null},tower={status:'CONNECTED',retainedSampleCount:48};
let r=W.audit(binder,player,pulse,tower);eq(r.connected,2);eq(r.links[1].cause,'SOURCE_RECEIPT_MISSING');eq(r.pulse.status,'HOLD');eq(r.tower.anuTransport,null);eq(r.wholeMachineReturn,false);
eq(r.browserAcceptance,'OPEN');eq(r.simultaneousSnapshot,false);
player={link:'CONNECTED',current:{receipt:{}}};binder={links:links.map(x=>x.id==='pascal'?{...x,status:'FOLLOWING'}:x)};
eq(W.audit(binder,player,pulse,tower).connected,3);
for(const [id,status,cause] of [['m3','SEPARATE','FOLLOW_DISABLED'],['pascal','HELD','HELD_NOT_LIVE'],['ihara','SEPARATE','SOURCE_SELECTION'],['pascal','HOLD','SOURCE_OR_READBACK_INVALID']]){
 const b={links:links.map(x=>x.id===id?{...x,status}:x)};eq(W.audit(b,player,pulse,tower).links.find(x=>x.id===id).cause,cause);
}
eq(W.audit().connected,0);eq(W.audit().pulse.generation,null);
const nodes={};
class N{
 constructor(tag='DIV'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.events={};this.open=false;this.className='';this.classList={contains:x=>this.className.split(' ').includes(x)};}
 set id(v){this._id=v;nodes[v]=this;}get id(){return this._id;}
 append(...xs){for(const x of xs){if(x.parentElement){const p=x.parentElement;p.children=p.children.filter(c=>c!==x);}this.children.push(x);x.parentElement=this;}}
 before(n){const p=this.parentElement;if(p){const i=p.children.indexOf(this);p.children.splice(i,0,n);n.parentElement=p;}}
 replaceChildren(...xs){this.children=[];this.append(...xs);}
 addEventListener(k,f){(this.events[k]??=[]).push(f);}click(){for(const f of this.events.click||[])f();}
 scrollIntoView(){this.scrolled=true;}
 set innerHTML(s){this.html=s;for(const m of s.matchAll(/id="([^"]+)"/g)){const n=new N();n.id=m[1];this.append(n);}}
}
const body=new N(),head=new N();for(const id of ['benchMachinePicture','augustSourceTrail','integrationCrosswalk','apTowerLegend','pulseBenchConnect','pulseBenchMonitor']){const n=new N();n.id=id;body.append(n);}
const original=Object.fromEntries(['augustSourceTrail','integrationCrosswalk','apTowerLegend'].map(id=>[id,nodes[id]]));
const events={},subscribers=new Set();let commands=0,refreshes=0,reveals=0;
nodes.pulseBenchConnect.addEventListener('click',()=>commands++);
const doc={head,getElementById:id=>nodes[id]||null,createElement:tag=>new N(tag)};
const subscribe=fn=>{subscribers.add(fn);return()=>subscribers.delete(fn);};
binder={links};player=null;
const win={A0BinderConnectionsView:{snapshot:()=>binder,render:()=>refreshes++,subscribe},A0PlayerBenchMonitor:{snapshot:()=>player,subscribe},A0PulseBenchMonitor:{snapshot:()=>pulse,subscribe},A0AnuTowerController:{snapshot:()=>tower,render:()=>refreshes++},A0BenchDisclosures:{reveal:()=>reveals++},addEventListener:(k,f)=>events[k]=f};
const view=W.mount(doc,win);ok(view);eq(W.mount(doc,win),null);eq(view.drawers,3);eq(commands,0);eq(refreshes,0);eq(reveals,1);eq(view.snapshot().connected,2);
for(const [id,node] of Object.entries(original)){eq(nodes[id],node);eq(node.parentElement.tagName,'DETAILS');eq(node.parentElement.open,false);}
nodes.workdeskPulse.click();eq(commands,1);eq(nodes.pulseBenchMonitor.scrolled,true);eq(view.snapshot().pulse.status,'HOLD');
binder={links:links.map(x=>x.id==='pascal'?{...x,status:'FOLLOWING'}:x)};player={link:'CONNECTED',current:{receipt:{}}};
for(const fn of subscribers)fn();eq(view.snapshot().connected,3);
pulse={status:'CONNECTED',reason:'VERBUNDEN · Game pausiert',current:{generation:7}};for(const fn of subscribers)fn();eq(view.snapshot().pulse.generation,7);eq(view.snapshot().tower.anuTransport,null);
pulse={status:'HOLD',reason:'GETRENNT',current:null};for(const fn of subscribers)fn();eq(view.snapshot().pulse.generation,null);eq(view.snapshot().pulse.status,'HOLD');ok(nodes.workdeskPulseStatus.textContent.includes('GETRENNT'));
nodes.workdeskRefresh.click();eq(refreshes,2);eq(commands,1);
const frozen=view.snapshot();events.pagehide();eq(subscribers.size,0);binder={links:[]};view.render();eq(view.snapshot(),frozen);
const source=fs.readFileSync('a0-bench-workdesk.js','utf8');ok(!/setInterval|setTimeout|postMessage|\.start\(|\.step\(|\.reset\(/.test(source));
for(const s of ['50²+1=2501','204²=41 616','1000²=1 000 000','111²=12321','1111²=1234321','gemeinsame Regel'])ok(source.includes(s));
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');ok(html.includes('href="#benchWorkDesk"'));ok(html.includes('src="a0-bench-workdesk.js'));ok(source.includes('ANU: Eingang, Winkel und Transportregel offen'));
console.log('PASS · '+checks+' workdesk audit/DOM/reversible disclosure checks; no live-browser acceptance');
