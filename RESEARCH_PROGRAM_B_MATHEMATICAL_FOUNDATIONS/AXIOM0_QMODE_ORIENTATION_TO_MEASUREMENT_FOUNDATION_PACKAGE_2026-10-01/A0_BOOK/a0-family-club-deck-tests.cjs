const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),api=require('./a0-family-club-deck.js');
let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
function fixture(access=true){
 const nodes={},events={};let pauses=0;
 const sourceState={address:12,layer:1,profile:'gramophone',lens:'goethe',mixture:[10,20,70],running:true};
 function el(tag){return{tag,attrs:{},children:[],events:{},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k];if(k==='src')delete this.src},append(x){this.children.push(x);x.parent=this},remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)},addEventListener(k,f){this.events[k]=f}}}
 for(const id of ['club-deck-room','clubDeckHost','clubDeckStatus','clubDeckReload'])nodes[id]=el(id);
 const doc={getElementById:id=>nodes[id],createElement:tag=>{
  const n=el(tag);
  if(access)n.contentWindow={A0CursorHandoffClickdummy:{pause(){pauses++;sourceState.running=false}}};
  else Object.defineProperty(n,'contentWindow',{get(){throw Error('cross-origin file window')}});
  return n;
 },addEventListener:(k,f)=>events[k]=f};
 const win={addEventListener:(k,f)=>events[k]=f};
 return{nodes,events,doc,state:sourceState,deck:api.mount(doc,win),get pauses(){return pauses}};
}
const sourceFile=path.resolve(__dirname,'DRAFTS',api.SOURCE.split('#')[0]);ok(fs.existsSync(sourceFile));
const original=fs.readFileSync(sourceFile,'utf8');ok(original.includes('id="performanceConsole"'));ok(original.includes('pause:()=>setRunning(false)'));
const originalHash=crypto.createHash('sha256').update(original).digest('hex');
const h=fixture();eq(h.nodes.clubDeckHost.children.length,0);eq(h.deck.snapshot().loaded,false);
h.deck.activate();eq(h.nodes.clubDeckHost.children.length,1);eq(h.deck.snapshot().active,true);eq(h.pauses,0);
const frame=h.nodes.clubDeckHost.children[0];eq(frame.src,api.SOURCE);ok(frame.attrs.sandbox.includes('allow-scripts'));ok(frame.attrs.sandbox.includes('allow-same-origin'));ok(!frame.attrs.sandbox.includes('allow-top-navigation'));
frame.events.load();ok(h.nodes.clubDeckStatus.textContent.includes('Quelldokument geladen'));
h.deck.activate();eq(h.nodes.clubDeckHost.children.length,1);
const held={...h.state};h.deck.deactivate();eq(h.pauses,0);eq(h.state,held);eq(h.deck.snapshot().loaded,true);eq(h.deck.snapshot().active,false);
h.deck.activate();eq(h.nodes.clubDeckHost.children[0],frame);ok(h.nodes.clubDeckStatus.textContent.includes('erhalten'));eq(h.state.running,true);
h.doc.hidden=true;h.events.visibilitychange();eq(h.pauses,1);eq(h.state.running,false);
h.nodes.clubDeckReload.onclick();eq(h.nodes.clubDeckHost.children.length,1);ok(h.nodes.clubDeckHost.children[0]!==frame);
const latest=h.nodes.clubDeckHost.children[0];frame.events.load();ok(h.nodes.clubDeckStatus.textContent.includes('wird geladen'));
latest.events.load();ok(h.nodes.clubDeckStatus.textContent.includes('neu gestartet'));
h.events.pagehide();eq(h.nodes.clubDeckHost.children.length,0);eq(h.deck.snapshot().loaded,false);
const blocked=fixture(false);blocked.deck.activate();eq(blocked.nodes.clubDeckHost.children.length,1);
const bframe=blocked.nodes.clubDeckHost.children[0];blocked.deck.deactivate();eq(blocked.nodes.clubDeckHost.children.length,1);eq(blocked.deck.snapshot().loaded,true);ok(blocked.nodes.clubDeckStatus.textContent.includes('weiter'));
blocked.deck.activate();eq(blocked.nodes.clubDeckHost.children[0],bframe);bframe.events.load();ok(blocked.nodes.clubDeckStatus.textContent.includes('geladen'));
blocked.doc.hidden=true;blocked.events.visibilitychange();eq(blocked.nodes.clubDeckHost.children.length,0);ok(blocked.nodes.clubDeckStatus.textContent.includes('Deck neu laden'));
eq(blocked.deck.snapshot().sourceStateTransferred,false);eq(blocked.deck.snapshot().sharedClock,false);
const html=fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8');
ok(html.includes('href="#club-deck-room"'));ok(html.includes('data-jukebox-room="deck"'));ok(!html.includes('club-coming'));ok(!html.includes('Dancefloor betreten'));ok(!html.includes('<details class="club-wayfinding"'));ok(!html.includes('<iframe'));
for(const id of ['club-deck-room','clubDeckHost','clubDeckStatus','clubDeckReload'])ok(html.includes('id="'+id+'"'));
const js=fs.readFileSync(__dirname+'/a0-family-club-deck.js','utf8');
ok(!/\.snapshot\(\)|\.apply\(|postMessage|localStorage|setInterval|lens_mix|q4Address|deskIndex|fetch\(/.test(js));
eq(crypto.createHash('sha256').update(fs.readFileSync(sourceFile)).digest('hex'),originalHash);
console.log(JSON.stringify({status:'PASS',checks,sourceHash:originalHash,scope:'original source reused unchanged; lazy single iframe, uninterrupted view switching, hidden/pagehide safety stop, blocked-file hidden fallback, reload/stale events; bridge tested separately; browser pixels OPEN'}));
