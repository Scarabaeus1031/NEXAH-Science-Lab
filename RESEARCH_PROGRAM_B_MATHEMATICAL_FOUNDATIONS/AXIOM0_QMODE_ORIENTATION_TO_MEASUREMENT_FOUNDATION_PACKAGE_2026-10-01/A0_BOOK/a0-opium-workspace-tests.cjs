'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),W=require('./a0-opium-workspace.js'),L=require('./a0-player-bench-link.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=x=>{assert.ok(x);checks++;};
class Node{constructor(){this.events={};this.children=[];this.contentWindow={closed:false,postMessage(){}};this.dataset={};}addEventListener(k,f){(this.events[k]??=[]).push(f);}click(){for(const f of this.events.click||[])f({});}setAttribute(){}replaceChildren(n){this.children=[n];}scrollIntoView(){}}
function fixture(hash=W.HASH,relay=true){const button=new Node(),host=new Node(),status=new Node(),events={},nodes={clubOpenBenchMonitor:button,clubBenchMonitorHost:host,clubBenchLinkStatus:status};let activates=0,loaded=false,frames=0;
 const trap=()=>{throw Error('unexpected play, timer, popup or simulation');};
 const doc={getElementById:id=>nodes[id]||null,createElement:tag=>{eq(tag,'iframe');frames++;return new Node();}};
 const win={location:{href:'file:///A0_BOOK/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html'+hash,hash,protocol:'file:',origin:'null'},crypto:{getRandomValues:a=>a.fill(3)},addEventListener:(k,f)=>(events[k]??=[]).push(f),removeEventListener:(k,f)=>events[k]=(events[k]||[]).filter(x=>x!==f),A0ClubDeck:{snapshot:()=>({loaded}),activate:()=>{activates++;loaded=true;}},setTimeout:trap,setInterval:trap,open:trap,A0MasterDemoBridge:{start:trap},A0ClubReturnMonitor:{snapshot:()=>({connected:false,current:null,running:false})}};
 if(relay)L.sender(doc,win,button);const api=W.mount(doc,win);return{api,win,host,status,events,counts:()=>({activates,frames})};}
const f=fixture();eq(f.counts(),{activates:1,frames:1});ok(f.host.children[0].src.includes('playerMonitorMode=embedded'));ok(f.host.children[0].src.includes('a0PlayerToken='));eq(f.api.snapshot().playRequested,false);
for(const callback of f.events.hashchange)callback();f.api.open();eq(f.counts(),{activates:1,frames:1});
const plain=fixture('#spatial-navigation');eq(plain.counts(),{activates:0,frames:0});plain.win.location.hash=W.HASH;for(const callback of plain.events.hashchange)callback();eq(plain.counts(),{activates:1,frames:1});
const failed=fixture(W.HASH,false);eq(failed.counts(),{activates:0,frames:0});ok(failed.status.textContent.startsWith('HOLD'));eq(failed.api.snapshot().requested,false);
for(const callback of f.events.pagehide)callback();eq(f.events.hashchange.length,0);
eq(W.mount({getElementById:()=>null},{}),null);
const html=fs.readFileSync(__dirname+'/A0_OPIUM.html','utf8'),club=fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8');ok(html.includes('DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html#clubBenchMonitorHost'));ok(!html.includes('<iframe'));ok(club.indexOf('a0-opium-workspace.js')>club.indexOf('a0-family-ldv-room.js'));
const src=fs.readFileSync(__dirname+'/a0-opium-workspace.js','utf8');ok(!/setInterval|setTimeout|postMessage|createElement|\.play\(|\.step\(|\.reset\(/.test(src));
console.log(JSON.stringify({status:'PASS',checks,scope:'actual existing sender + workspace route in DOM doubles; one lazy source activation and one embedded receiver, repeat-open reuse, no source play/steps/timer, missing-relay HOLD; browser OPEN'}));
