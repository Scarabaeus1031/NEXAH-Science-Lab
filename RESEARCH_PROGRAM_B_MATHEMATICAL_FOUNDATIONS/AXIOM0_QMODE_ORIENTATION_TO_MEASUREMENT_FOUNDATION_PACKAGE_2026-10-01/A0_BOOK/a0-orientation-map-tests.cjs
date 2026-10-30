'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),M=require('./a0-orientation-map.js');let checks=0;
const ok=(v,m)=>{checks++;assert.ok(v,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
const base=new URL('file://'+__dirname+'/').href,keys=new Set(M.nodes.map(n=>n.key));eq(keys.size,M.nodes.length);eq(M.nodes.length,26);eq(M.edges.length,30);eq(M.routes.length,10);
const htmlPageCount=fs.readdirSync(__dirname).filter(f=>f.endsWith('.html')).length;eq(M.pages.length,htmlPageCount,'complete root HTML inventory');eq(M.currentWays.length,5,'five current A0 entrances');
eq(M.currentWaysMarkup(href=>new URL(href,base).href,new URL('A0_THE_LIVING_INTERIOR.html',base).href),'','orientation map no longer renders the overview entrances');
const navigationSource=fs.readFileSync(path.join(__dirname,'a0-context-navigation.js'),'utf8');ok(navigationSource.includes('Fünf Eingänge. Ein Werk.'));for(const label of ['HUMAN','PLAY','MATHFIELD','BUILDER','SCIENCE'])ok(navigationSource.includes(label),'overview way '+label);
ok(navigationSource.includes('A0 Navigator')&&navigationSource.includes('Family Connection Map'),'shared navigation uses the agreed names');
for(const n of M.nodes){ok(fs.existsSync(path.resolve(__dirname,n.href.split('#')[0])),n.href);ok(n.families.every(f=>/^F[1-7]$/.test(f)));}
for(const e of M.edges){ok(keys.has(e.from)&&keys.has(e.to));ok(M.kinds[e.kind]);ok(fs.existsSync(path.resolve(__dirname,e.proof.split('#')[0])),e.proof);}
for(const r of M.routes){eq(r.edges.length,r.nodes.length-1);for(let i=0;i<r.edges.length;i++){const e=M.edges[r.edges[i]];eq(e.from,r.nodes[i]);eq(e.to,r.nodes[i+1]);const step=M.advance(r,i);eq(step.blocked,e.kind==='open');eq(step.step,e.kind==='open'?i:i+1);}ok(M.advance(r,r.nodes.length-1).done);}
assert.throws(()=>M.advance(M.routes[0],-1));checks++;
const quietStandalone=new Set(['A0_7_11_TYPED_CROSSWALK.html','A0_CROWN_SHADOW_CONTACT_BENCH.html','A0_CURSOR_HANDOFF_CLICKDUMMY.html','A0_IOTA_BRIDGE_DEMONSTRATOR.html','A0_LOOK_AGAIN_PLAY.html','A0_ONE_PULSE_BENCH_MONITOR.html','A0_OPIUM.html','A0_PENTAGON_BODY_RETURN_GUIDED.html','A0_TOWER_RETURN_DEMONSTRATOR.html','NEXAH_SCIENCE.html','a0-public-arkade-index.html']);
for(const file of fs.readdirSync(__dirname).filter(f=>f.endsWith('.html'))){ok(M.pages.some(p=>p.file===file),'inventory includes '+file);const h=fs.readFileSync(path.join(__dirname,file),'utf8');const quietHuman=file==='A0_NEXAH_APERTURE_JOURNEY.html'&&h.includes('a0-human-flagship-journey.js')&&h.includes('href="index.html"');ok(quietHuman||quietStandalone.has(file)||h.includes('a0-context-navigation.js')||h.includes('src="a0-orientation-map.js"'),'map loader or explicit quiet surface '+file);}
for(const n of M.nodes){eq(M.locate(new URL(n.href,base).href,base),n.key,'exact deep-link location');for(const f of ['all','F1','F2','F3','F4','F5','F6','F7']){const svg=M.drawing(n.key,n.key,f);ok(!/NaN|undefined|Infinity/.test(svg));eq((svg.match(/data-a0-node=/g)||[]).length,M.nodes.length);}}
eq(new Set(M.nodes.map(n=>n.col+':'+n.row)).size,M.nodes.length,'no overlapping node slots');
for(const key of ['joint','fold']){const route=M.routes.find(r=>r.key===key);ok(M.advance(route,0).blocked,'parked source binding stays HOLD');}
for(const key of ['janus','two-cut','phase']){const route=M.routes.find(r=>r.key===key);ok(!M.advance(route,0).blocked,'existing bounded source path retained');}
const height=Number(M.drawing('home','home').match(/width="276" height="(\d+)"/)[1]);
for(const n of M.nodes)ok(48+n.row*100+64<height,'all node rectangles inside expanded map');
eq(M.locate(new URL('A0_ORIENTATION_CONTROLLER_BENCH.html#pentagonWorkbench',base).href,base),'pascal');eq(M.locate(new URL('unknown.html',base).href,base),null);
ok(M.drawing('coupling','coupling').includes('Du bist hier'));ok(M.tubeDrawing(M.routes[1],1,true).includes('HOLD'));
eq(M.connectedKeys('bench').length,4,'selected module plus three connected modules');eq(M.connectedKeys('bench')[0],'bench');eq(new Set(M.connectedKeys('bench')).size,M.connectedKeys('bench').length);
const deckEntries=M.sourceDeckEntries('bench',href=>new URL(href,base).href);eq(deckEntries.length,4);ok(deckEntries.every(entry=>entry.href.startsWith('file:')));ok(deckEntries.slice(1).every(entry=>entry.relation!=='Ausgewähltes Modul'));
const deckMarkup=M.sourceDeckMarkup('bench',href=>new URL(href,base).href);eq((deckMarkup.match(/<iframe /g)||[]).length,4);ok(deckMarkup.includes('data-source-deck-layout="focus"'));ok(deckMarkup.includes('getrennte Laufzeiten'));assert.throws(()=>M.connectedKeys('missing'));checks++;
const readerMarkup=M.readerMarkup(new URL('A0_TOURS.html#tour-01',base).href,'Tour 01');eq((readerMarkup.match(/<iframe /g)||[]).length,1);ok(readerMarkup.includes('DIE MAP BLEIBT AN IHRER STELLE'));ok(readerMarkup.includes('Lesefaden bleibt erhalten'));
// Minimal DOM harness: executes the actual mount, events and rendered markup. No browser.
let active=null;
class El{
 constructor(tag='div',attrs={}){this.tag=tag;this.attrs=attrs;this.children=[];this.events={};this.textContent='';this.hidden=false;this.open=false;}
 set innerHTML(html){this.html=html;this.children=[];const stack=[this];for(const m of html.matchAll(/<\/?([\w-]+)([^>]*)>/g)){if(m[0][1]==='/'){for(let i=stack.length-1;i>0;i--)if(stack[i].tag===m[1]){stack.length=i;break;}continue;}const attrs={};for(const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=a[2]??'';const el=new El(m[1],attrs);stack.at(-1).children.push(el);if(!['input','link','br','meta','hr'].includes(m[1])&&!m[0].endsWith('/>'))stack.push(el);}}
 get innerHTML(){return this.html||'';}append(...els){this.children.push(...els);}getAttribute(k){return this.attrs[k]??null;}setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this.attrs[k];}
 matches(s){const m=s.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return m?Object.hasOwn(this.attrs,m[1])&&(m[2]===undefined||this.attrs[m[1]]===m[2]):s===this.tag;}
 querySelectorAll(s){return this.children.flatMap(c=>[...(c.matches(s)?[c]:[]),...c.querySelectorAll(s)]);}querySelector(s){return this.querySelectorAll(s)[0]||null;}
 addEventListener(k,f){(this.events[k]??=[]).push(f);}fire(k,extra={}){for(const f of this.events[k]||[])f({target:this,preventDefault(){},...extra});}focus(){active=this;}
}
const body=new El('body'),head=new El('head'),home=new El('section',{id:'a0-map-home'}),tube=new El('section',{id:'a0-rohrpost-routes'}),tourScope=new El('main',{'data-a0-reader-scope':''}),tourLink=new El('a',{href:'A0_THEORY_STORYBOARD.html#scene-1'});tourLink.textContent='Storyboard Tour';tourScope.append(tourLink);body.append(home,tube,tourScope);const docEvents={};
const doc={body,head,title:'Test A0',createElement:t=>new El(t),getElementById(id){return[body,...body.querySelectorAll('*')].find(e=>e.id===id||e.attrs.id===id)||find(body,id);},querySelectorAll:s=>body.querySelectorAll(s),addEventListener(k,f){(docEvents[k]??=[]).push(f);}};
function find(root,id){for(const c of root.children){if(c.id===id||c.attrs.id===id)return c;const nested=find(c,id);if(nested)return nested;}return null;}
let restoredScroll=null;const winEvents={},win={location:{href:new URL('A0_LIVING_BLUEPRINT.html#a0-map-home',base).href},scrollX:17,scrollY:231,scrollTo(place){restoredScroll=place;},addEventListener(k,f){(winEvents[k]??=[]).push(f);},postMessage(){throw Error('map must not command sources');},setInterval(){throw Error('no automatic map clock');}};win.self=win;win.top=win;
const api=M.mount(doc,win,base);ok(api);eq(api.snapshot().current,'home');ok(home.innerHTML.includes('Alle '+htmlPageCount+' A0-Seiten'));ok(!home.innerHTML.includes('Fünf Eingänge. Ein Werk.'));ok(head.children[0].href.includes('a0-orientation-map.css?v=20261023-overview-orientation-split'));eq(M.mount(doc,win,base),null,'no duplicate dock');
const dock=doc.getElementById('a0-orientation-map');api.open();ok(dock.open);dock.querySelector('[data-map-close]').fire('click');ok(!dock.open);eq(active,dock.querySelector('summary'));
ok(dock.innerHTML.includes('A0 Navigator')&&dock.innerHTML.includes('Wo finde ich was?'),'persistent shortcut is the A0 Navigator trigger');
ok(dock.innerHTML.includes('Family Connection Map'),'technical panel retains its distinct map name');
api.open();for(const f of docEvents.keydown)f({key:'Escape'});ok(!dock.open);
home.querySelector('[data-a0-node="coupling"]').fire('keydown',{key:'Enter'});
const nodeDialog=doc.getElementById('a0-node-dialog');
eq(api.snapshot().selected,'coupling');ok(api.snapshot().detailOpen);ok(nodeDialog.open);
ok(nodeDialog.querySelector('[data-node-content]').innerHTML.includes('Typed Coupling'));
eq(active,nodeDialog.querySelector('[data-node-close]'),'dialog receives focus');
nodeDialog.querySelector('[data-node-close]').fire('click');ok(!nodeDialog.open);ok(!api.snapshot().detailOpen);eq(nodeDialog.getAttribute('open'),null,'fallback dialog removes open attribute');
eq(active.getAttribute('data-a0-node'),'coupling','focus returns to selected node');
eq(restoredScroll,{left:17,top:231,behavior:'instant'},'detail window restores exact reader scroll position');
api.openSourceDeck('bench');const sourceDialog=doc.getElementById('a0-source-deck-dialog');ok(sourceDialog.open);ok(api.snapshot().sourceDeckOpen);eq(api.snapshot().sourceDeckKey,'bench');eq(sourceDialog.querySelectorAll('iframe').length,4);eq(active,sourceDialog.querySelector('[data-source-deck-close]'));
sourceDialog.querySelector('[data-source-deck-layout-choice="overview"]').fire('click');eq(api.snapshot().sourceDeckMode,'overview');eq(sourceDialog.querySelector('[data-source-deck-grid]').getAttribute('data-source-deck-layout'),'overview');
const sourceFocus=sourceDialog.querySelectorAll('[data-source-deck-focus]')[1];sourceFocus.fire('click');eq(sourceDialog.querySelectorAll('[data-source-deck-panel]').filter(panel=>panel.getAttribute('data-source-deck-active')==='true').length,1);eq(sourceFocus.getAttribute('aria-pressed'),'true');
sourceDialog.querySelector('[data-source-deck-close]').fire('click');ok(!sourceDialog.open);ok(!api.snapshot().sourceDeckOpen);eq(sourceDialog.querySelector('[data-source-deck-content]').innerHTML,'','closing unloads original frames');
tourLink.fire('click');ok(sourceDialog.open,'tour link opens in reader');eq(api.snapshot().sourceDeckKind,'reader');eq(sourceDialog.querySelectorAll('iframe').length,1);ok(sourceDialog.querySelector('[data-source-deck-title]').textContent.includes('Storyboard Tour'));sourceDialog.querySelector('[data-source-deck-maximize]').fire('click');ok(api.snapshot().sourceDeckMaximized);sourceDialog.querySelector('[data-source-deck-close]').fire('click');ok(!sourceDialog.open);eq(active,tourLink,'reader returns focus to tour link');
for(const n of M.nodes){
 home.querySelector('[data-a0-node="'+n.key+'"]').fire('click');
 ok(nodeDialog.open,'every node opens details');eq(api.snapshot().selected,n.key);
 ok(nodeDialog.querySelector('[data-node-content]').innerHTML.includes(new URL(n.href,base).href),'correct original target');
 nodeDialog.fire('cancel');ok(!nodeDialog.open);
}
const card=home.querySelectorAll('button').find(el=>el.getAttribute('data-map-card')!==null&&el.getAttribute('data-a0-node')==='pink');
card.fire('click');ok(nodeDialog.open);nodeDialog.fire('click');ok(!nodeDialog.open);
ok(active.getAttribute('data-map-card')!==null,'compact card focus restored');
api.openNode('body');ok(nodeDialog.querySelector('[data-node-content]').innerHTML.includes('#tessarec-module'));
for(const f of docEvents.keydown)f({key:'Escape',preventDefault(){}});ok(!nodeDialog.open);
let nativeOpened=0,nativeClosed=0;
nodeDialog.showModal=function(){nativeOpened++;this.open=true;};
nodeDialog.close=function(){nativeClosed++;this.open=false;this.fire('close');};
api.openNode('desk');eq(nativeOpened,1);api.closeNode();eq(nativeClosed,1);
assert.throws(()=>api.openNode('missing'));checks++;
home.querySelector('[data-map-all]').fire('click');ok(api.snapshot().fullNetwork);
home.querySelector('[data-a0-node="body"]').fire('click');ok(!api.snapshot().fullNetwork);api.closeNode();
for(const text of ['1 · Quelle','2 · Anschluss','3 · Ansicht','4 · Record / Return','Pfeilspitze','Goldener Rand und Punkt'])ok(M.readingKey().includes(text),'visual legend '+text);
ok(fs.readFileSync(path.join(__dirname,'a0-orientation-map.css'),'utf8').includes('@media(max-width:900px)'),'compact small-screen view');
home.querySelector('[data-map-family]').value='F7';home.querySelector('[data-map-family]').fire('change');eq(api.snapshot().family,'F7');
const search=home.querySelector('[data-map-search]');search.value='PINK_DIAMOND';search.fire('input');const links=home.querySelectorAll('[data-map-page]');eq(links.filter(a=>!a.hidden).length,1);ok(links.find(a=>!a.hidden).getAttribute('href').includes('PINK_DIAMOND'));
const route=tube.querySelector('[data-tube-route]');route.value='pink';route.fire('change');eq(api.snapshot().step,0);tube.querySelector('[data-tube-next]').fire('click');eq(api.snapshot().step,1);tube.querySelector('[data-tube-next]').fire('click');eq(api.snapshot().step,1);ok(api.snapshot().blocked);ok(tube.innerHTML.includes('HOLD'));tube.querySelector('[data-tube-reset]').fire('click');eq(api.snapshot().step,0);ok(!api.snapshot().blocked);
win.location.href=new URL('A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles',base).href;for(const f of winEvents.hashchange)f();eq(api.snapshot().current,'pink');ok(dock.querySelector('[data-map-location]').textContent.includes('Pink Diamond'));
const frameWin={self:{},top:{}};eq(M.mount(doc,frameWin,base),null,'embedded sources do not get a second dock');
const blueprint=fs.readFileSync(path.join(__dirname,'A0_LIVING_BLUEPRINT.html'),'utf8');ok(blueprint.includes('running=false,position=0'));ok(blueprint.includes('id="legacy-tube"'));ok(blueprint.includes('id="a0-map-home"'));
for(const file of ['A0_LIVING_BLUEPRINT.html','A0_ORIENTATION_CONTROLLER_BENCH.html'])for(const m of fs.readFileSync(path.join(__dirname,file),'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(m[1].trim()){new vm.Script(m[1]);checks++;}
const coupling=path.resolve(__dirname,'../../../SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05');for(const f of ['NEXAH_TYPED_COUPLING_WORKBENCH.html','NEXAH_WORD_ORBIT_SEQUENCER.html'])ok(fs.readFileSync(path.join(coupling,f),'utf8').includes('A0_BOOK/a0-orientation-map.js'));
const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/a0-orientation-map-v1.json'),'utf8')),crypto=require('node:crypto');if(!process.argv.includes('--interaction-only')){for(const f of receipt.implementationFiles)eq(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,f.path))).digest('hex'),f.sha256,'local implementation hash');for(const f of receipt.sources)eq(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,f.proof.split('#')[0]))).digest('hex'),f.sha256,'scoped evidence hash');}for(const v of Object.values(receipt.authority))eq(v,false);
console.log(JSON.stringify({status:'PASS',receiptPinsChecked:!process.argv.includes('--interaction-only'),checks,nodes:M.nodes.length,edges:M.edges.length,rohrpostRoutes:M.routes.length,bookPages:M.pages.length,externalPages:2,browserAcceptance:false,sourceCommands:0,newCanonicalIdentities:0}));
