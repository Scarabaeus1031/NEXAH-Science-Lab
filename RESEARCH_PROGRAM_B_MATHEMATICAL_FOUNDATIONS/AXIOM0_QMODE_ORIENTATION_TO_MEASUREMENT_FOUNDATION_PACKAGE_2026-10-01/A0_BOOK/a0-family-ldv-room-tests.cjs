const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const api=require('./a0-family-ldv-room.js');
let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
const lab=path.resolve(__dirname,'../../..'),nav=path.join(lab,'SCIENCE_LAB/NAVIGATION');
function find(obj,key,value){if(!obj||typeof obj!=='object')return null;if(obj[key]===value)return obj;for(const x of Object.values(obj)){const hit=find(x,key,value);if(hit)return hit}return null;}
const catalog=JSON.parse(fs.readFileSync(path.join(nav,'EVIDENCE/ORIENTATION_CATALOG_2026-10-10/ORIENTATION_CATALOG_BINDER_V1_2026-10-10.json'),'utf8'));
const work=find(catalog,'catalog_key','arena:5246418');ok(work);eq(work.registered_work_id,null);eq(work.publication_status,'published');eq(work.revision_state,'review');eq(work.content_maturity,'developing');eq(work.classification_state,'proposed');
const lineage=JSON.parse(fs.readFileSync(path.join(nav,'EVIDENCE/PRIME_BRIDGE_LINEAGE_2026-10-06/PRIME_BRIDGE_LINEAGE_BINDER_V1_2026-10-06.json'),'utf8')),visual=find(lineage,'visual_id','VIS:UNIVERSAL_OPERATOR_MAP');ok(visual);
const image=path.join(lab,visual.file),hash=crypto.createHash('sha256').update(fs.readFileSync(image)).digest('hex');
eq(hash,'b47abdafcb51989b3b3c7f66d3383948ec3d57152b68d823f04ae2312bba04ce');eq(hash,visual.sha256);
const html=fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8');
ok(html.includes('href="'+api.ENTRY+'"'));ok(html.includes('id="ldv-lookback-room"'));ok(html.includes('data-catalog-key="'+work.catalog_key+'"'));ok(html.includes('data-visual-id="'+visual.visual_id+'"'));
ok(html.includes(work.source_url));ok(html.includes(hash));ok(html.includes('registered_work_id: null'));
for(const phrase of ['ROOM / LOOKBACK / OBSERVER / RETURN','N·AM + L·VM + G·PM','Kein DJ-Receipt empfangen','kein vierter Mixerkanal','keine zusätzliche Farblinse','keine neue Family','keine neue physikalische Behauptung','keine Gleichsetzung mit F1–F7'])ok(html.toLowerCase().includes(phrase.toLowerCase()),phrase);
const local='../A0_BLUE_PINK_DODECA_CELL_RETURN.html#lookbackBreathingView';ok(html.includes('href="'+local+'"'));ok(fs.readFileSync(__dirname+'/A0_BLUE_PINK_DODECA_CELL_RETURN.html','utf8').includes('id="lookbackBreathingView"'));
ok(fs.readFileSync(path.resolve(__dirname,'../15_BOUNDARY_ESCAPE_RELATION_SYNTHESIS_2026-10-03.md'),'utf8').includes('## The room looks back'));
ok(fs.readFileSync(path.resolve(__dirname,'../../11_MATHEMATICAL_FOUNDATIONS_GLOSSARY.md'),'utf8').includes('The Room Looks Back'));
for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(/^https:|^#/.test(match[1]))continue;ok(fs.existsSync(path.resolve(__dirname,'DRAFTS',match[1].split(/[?#]/)[0])),'existing target '+match[1]);}
function fixture(hash='',withDeck=false,reduced=false){
 const nodes={},frames=[],events={};let resized=0,paused=0,stageMode='dance',deckActivations=0,deckPauses=0;
 function element(id,parent=null){const el={id,parentElement:parent,hidden:false,attrs:{},dataset:{},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},contains(x){for(;x;x=x.parentElement)if(x===this)return true;return false},scrollIntoView(options){this.scrolled=true;this.scrollOptions=options;},focus(){this.focused=true},querySelector(){return null}};nodes[id]=el;return el;}
 const family=element('familySpatialMount'),room=element('ldv-lookback-room'),title=element('ldvRoomTitle',room),context=element('ldvLocalContext',room),spatial=element('spatial-navigation'),legend=element('ldvSources',room),child=element('ldvChild',legend);legend.tagName='DETAILS';legend.open=false;
 const light=element('clubLights',family),drawer=element('clubGLBDrawer'),joints=element('joints'),viewer={pause(){paused++}},stage=element('jukeboxGLBStage');stage.querySelector=()=>viewer;
 if(withDeck){const deck=element('club-deck-room');element('clubDeckTitle',deck);const control=element('control-room');element('controlRoomTitle',control);}
 const doors=[element('door-family'),element('door-ldv')];doors.forEach((e,i)=>e.dataset.jukeboxRoom=i?'ldv':'family');
 if(withDeck){const door=element('header-deck');door.dataset.jukeboxRoom='deck';doors.push(door);}
 const state={family:'F4',elevatorFamily:'F4',stop:'theta',mode:'joint',selectedEdge:'e45',layout:'polar',camera:{yaw:1,pitch:.4,zoom:1.3,target:[1,0,1]}},before=JSON.stringify(state);
 const heroTitles=['family','deck','ldv','control'].map(kind=>{const title=element('hero-'+kind);title.dataset.clubHeroTitle=kind;return title;});
 const doc={getElementById:id=>nodes[id],querySelector:s=>s==='.demo-joints'?joints:null,querySelectorAll:s=>s==='[data-club-hero-title]'?heroTitles:doors};
 const win={location:{hash},matchMedia:()=>({matches:reduced}),requestAnimationFrame:f=>frames.push(f),addEventListener:(k,f)=>events[k]=f,A0FamilySpatialReader:{snapshot:()=>JSON.parse(JSON.stringify(state)),resize(){resized++}},A0JukeboxStage:{snapshot:()=>({mode:stageMode}),setMode(mode){stageMode=mode}}};
 if(withDeck)win.A0ClubDeck={activate(){deckActivations++},deactivate(){deckPauses++}};
 const route=api.mount(doc,win);const flush=()=>{while(frames.length)frames.shift()()};
 return{route,nodes,frames,events,win,flush,state,before,doors,get resized(){return resized},get paused(){return paused},get stageMode(){return stageMode},get deckActivations(){return deckActivations},get deckPauses(){return deckPauses}};
}
const h=fixture();h.flush();eq(h.route.snapshot().activeRoom,'family');ok(h.nodes['ldv-lookback-room'].hidden);ok(!h.nodes.familySpatialMount.hidden);
h.win.location.hash=api.ENTRY;h.events.hashchange();h.flush();eq(h.route.snapshot().activeRoom,'ldv');ok(h.nodes.familySpatialMount.hidden);ok(!h.nodes['ldv-lookback-room'].hidden);ok(h.nodes.clubGLBDrawer.hidden);ok(h.nodes.joints.hidden);
eq(h.doors[1].attrs['aria-current'],'page');ok(h.nodes.ldvRoomTitle.focused);eq(h.stageMode,'room');eq(h.paused,1);ok(h.nodes.ldvLocalContext.textContent.includes('F4'));ok(h.nodes.ldvLocalContext.textContent.includes('θ'));
eq(JSON.stringify(h.state),h.before);eq(h.route.snapshot().djReceiptReceived,false);eq(h.route.snapshot().sourceStateTransferred,false);eq(h.route.snapshot().sharedClock,false);
h.win.location.hash=api.RETURN;h.events.hashchange();h.flush();ok(!h.nodes.familySpatialMount.hidden);ok(!h.nodes.clubGLBDrawer.hidden);ok(!h.nodes.joints.hidden);ok(h.resized>0);eq(JSON.stringify(h.state),h.before);
ok(!h.route.show('fourth-lens'));
h.win.location.hash='#ldvChild';h.events.hashchange();h.flush();eq(h.route.snapshot().activeRoom,'ldv');ok(h.nodes.ldvSources.open);ok(h.nodes.ldvChild.scrolled);
h.win.location.hash='#clubLights';h.events.hashchange();h.flush();eq(h.route.snapshot().activeRoom,'family');
const deep=fixture(api.ENTRY);deep.flush();eq(deep.route.snapshot().activeRoom,'ldv');eq(JSON.stringify(deep.state),deep.before);
const dj=fixture('#club-deck-room',true);dj.flush();eq(dj.route.snapshot().activeRoom,'deck');eq(dj.deckActivations,1);ok(dj.nodes.familySpatialMount.hidden);ok(!dj.nodes['club-deck-room'].hidden);
ok(dj.nodes['hero-family'].hidden);ok(!dj.nodes['hero-deck'].hidden);ok(dj.nodes['hero-ldv'].hidden);
dj.win.location.hash=api.ENTRY;dj.events.hashchange();dj.flush();eq(dj.route.snapshot().activeRoom,'ldv');eq(dj.deckPauses,1);ok(dj.nodes.clubGLBDrawer.hidden);
dj.win.location.hash=api.RETURN;dj.events.hashchange();dj.flush();eq(dj.route.snapshot().activeRoom,'family');ok(!dj.nodes.clubGLBDrawer.hidden);eq(JSON.stringify(dj.state),dj.before);
ok(!dj.nodes['hero-family'].hidden);ok(dj.nodes['hero-deck'].hidden);
ok(html.includes('class="club-view-switch"'));ok(html.includes('>The Club Machine</a>'));
const switching=fixture('',true);switching.flush();let tourPauses=0;switching.win.A0ClubTours={interrupt(){tourPauses++;}};
switching.route.show('deck');switching.flush();eq(tourPauses,1);eq(switching.nodes['header-deck'].attrs['aria-current'],'page');eq(switching.nodes['club-deck-room'].scrollOptions.behavior,'smooth');
switching.route.show('family');switching.flush();eq(switching.deckPauses,1);eq(switching.doors[0].attrs['aria-current'],'page');ok(!switching.nodes['header-deck'].attrs['aria-current']);eq(JSON.stringify(switching.state),switching.before);
ok(switching.nodes.familySpatialMount.scrolled);const still=fixture('',true,true);still.route.show('deck');still.flush();eq(still.nodes['club-deck-room'].scrollOptions.behavior,'auto');
const source=fs.readFileSync(__dirname+'/a0-family-ldv-room.js','utf8');
const control=fixture('#control-room',true);control.flush();
eq(control.route.snapshot().activeRoom,'control');ok(!control.nodes['control-room'].hidden);ok(control.nodes.familySpatialMount.hidden);ok(control.nodes['club-deck-room'].hidden);ok(control.nodes.controlRoomTitle.focused);ok(!control.nodes['hero-control'].hidden);eq(control.deckActivations,0);
const held=JSON.stringify(control.state);control.route.show('deck');control.flush();eq(control.deckActivations,1);ok(control.nodes['control-room'].hidden);
control.route.show('control');control.flush();eq(control.deckPauses,1);eq(JSON.stringify(control.state),held);ok(!control.nodes['control-room'].hidden);
control.route.show('family');control.flush();ok(control.nodes['control-room'].hidden);ok(!control.nodes.clubGLBDrawer.hidden);
ok(!/fetch\(|setInterval|localStorage|postMessage|A0CursorHandoff|\.apply\(|selectEdge\(|\.play\(/.test(source));
console.log(JSON.stringify({status:'PASS',checks,scope:'existing catalog/null Work ID, exact visual hash, local source targets, semantic boundary, LDV entry/return/deep links, held reader/camera, no DJ receipt/state/clock; browser pixels OPEN'}));
