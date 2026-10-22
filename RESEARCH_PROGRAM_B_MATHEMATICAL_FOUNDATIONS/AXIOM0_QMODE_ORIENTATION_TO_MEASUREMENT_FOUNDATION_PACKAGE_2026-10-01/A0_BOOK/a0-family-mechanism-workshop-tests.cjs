const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const workshop=require('./a0-family-mechanism-workshop.js'),focus=require('./a0-atlas-source-focus.js');let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const read=file=>fs.readFileSync(path.join(__dirname,file),'utf8');
for(const [plate,room]of Object.entries(workshop.ROOMS)){
 ok(room.items.length>=2&&room.items.length<=4);
 for(const id of room.items){
  const x=workshop.ITEMS[id],url=workshop.route(id,plate);ok(url);ok(read(x.file).includes('id="'+x.panel+'"'),x.panel);ok(x.why.length>20);ok(x.boundary.length>20);
  if(!x.external){const p=focus.parse(url);eq(p.plate,plate);eq(p.panel,x.panel);ok(p.sections.includes(x.panel));ok(read(x.file).includes('a0-atlas-source-focus.js'));ok(p.back.includes('plate='+plate));}
 }
}
eq(workshop.route('evil','tessarec'),null);eq(workshop.route('fold','eclipse'),null);eq(workshop.route('fold','evil'),null);
eq(workshop.BODY_ROUTES.length,3);
const bodyMarkup=workshop.bodyRoutesMarkup(),bodyHtml=read('A0_TESSAREC_BLUE_BODY_LAB.html');
for(const r of workshop.BODY_ROUTES){ok(bodyHtml.includes('id="'+r.anchor+'"'));ok(bodyMarkup.includes('#'+r.anchor));ok(bodyMarkup.includes(r.title));}
ok(bodyMarkup.includes('weder Atlas-Cursor noch Instrumentzustand'));
ok(bodyHtml.includes('id="bodyAtlasConnections"'));ok(bodyHtml.includes('Gesamtmaschinen-Return bleibt offen'));
ok(bodyHtml.includes('a0-blue-body-route-legend.css'));ok(read('A0_FAMILY_CONNECTION_ATLAS.html').includes('a0-blue-body-route-legend.css'));
eq(focus.parse('https://x.test/evil.html?atlasPanel=sequencer'),null);
eq(focus.parse('A0_AXIS08_FOLD_RETURN_SEQUENCER.html?atlasPanel=boundary&atlasPlate=evil').panel,null);
eq(focus.parse('A0_AXIS08_FOLD_RETURN_SEQUENCER.html?atlasPanel=sewingScore').sections,['pentagonSewing','sewingScore']);
eq(focus.parse('A0_BLACK_SUN_BIG_MOON.html?atlasPlate=evil').plate,'eclipse');
function node(tag='div'){
 return{tag,children:[],dataset:{},hidden:false,disabled:false,textContent:'',attributes:{},events:{},classList:{values:[],add(x){this.values.push(x);}},append(...xs){this.children.push(...xs);xs.forEach(x=>x.parent=this);},appendChild(x){this.append(x);},insertAdjacentHTML(position,html){this.inserted={position,html};},before(x){this.previous=x;},remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);this.removed=true;},addEventListener(k,fn){this.events[k]=fn;},setAttribute(k,v){this.attributes[k]=v;}};
}
function harness(initial='tessarec'){
 const host=node(),els={},work=node('details'),frames=[],listeners={},calls=[],targets={};work.open=true;work.contains=n=>n===targets.map;
 host.querySelector=s=>els[s]||(els[s]=node());host.querySelectorAll=()=>[];
 const doc={getElementById:id=>id==='familyMechanisms'?host:id==='familyAtlasWorkbench'?work:targets[id],createElement:t=>{const n=node(t);if(t==='iframe')frames.push(n);return n;}};
 let notify;const player={subscribe(fn){notify=fn;fn({id:initial});},pause(){calls.push('pause');}};
 const win={A0FamilyRecordPlayerController:player,location:{hash:'#start',href:'file:///book/A0_FAMILY_CONNECTION_ATLAS.html'},addEventListener:(k,fn)=>listeners[k]=fn};
 const ctl=workshop.mount(doc,win);return{ctl,host,doc,win,els,work,frames,calls,targets,listeners,notify:id=>notify({id})};
}
const h=harness();eq(h.frames.length,0);ok(h.work.open);eq(h.ctl.snapshot(),{plate:'tessarec',item:'fold',loaded:false});
ok(!h.els['[data-mw-body-routes]'].hidden);
eq(h.els['[data-mw-cards]'].inserted,{position:'beforebegin',html:bodyMarkup});
ok(h.ctl.load());eq(h.frames.length,1);eq(h.calls,['pause']);ok(h.frames[0].src.includes('atlasPanel=sequencer'));eq(h.ctl.load(),false);eq(h.frames.length,1);
const old=h.frames[0];ok(h.ctl.select('score'));ok(old.removed);eq(h.ctl.snapshot().loaded,false);ok(h.ctl.load());eq(h.frames.length,2);ok(h.frames[1].src.includes('atlasPanel=sewingScore'));
const status=h.els['[data-mw-status]'].textContent;old.events.load();eq(h.els['[data-mw-status]'].textContent,status);
h.frames[1].events.load();ok(h.els['[data-mw-status]'].textContent.includes('keine Cursor-Kopplung'));
h.notify('tessarec');eq(h.ctl.snapshot().loaded,true);eq(h.frames.length,2);
h.notify('eclipse');ok(h.frames[1].removed);ok(!h.work.open);eq(h.ctl.snapshot(),{plate:'eclipse',item:'neon',loaded:false});eq(h.frames.length,2);
ok(h.els['[data-mw-body-routes]'].hidden);
ok(!h.ctl.select('fold'));eq(h.ctl.snapshot().item,'neon');ok(h.ctl.load());eq(h.frames.length,3);
h.notify('caro');ok(h.frames[2].removed);eq(h.ctl.snapshot().item,'caro');ok(!h.ctl.load());eq(h.frames.length,3);ok(h.els['[data-mw-load]'].disabled);
h.notify('tessarec');eq(h.ctl.snapshot().item,'score');ok(h.work.open);
h.targets.map=node();h.work.open=false;h.win.location.hash='#map';h.listeners.hashchange();ok(h.work.open);
h.ctl.load();h.ctl.unload();ok(h.frames.at(-1).removed);ok(h.els['[data-mw-frame]'].hidden);
eq(workshop.mount(h.doc,h.win),null);
// Source focus modifies presentation only, retaining every engine DOM node.
for(const file of Object.keys(focus.SOURCES)){
 const main=node('main'),children=[...new Set(Object.values(focus.SOURCES[file].panels).flat()),'boundary','other'].map(id=>Object.assign(node('section'),{id}));main.children=children;
 const root=node('html'),created=[],doc={documentElement:root,getElementById:()=>null,querySelector:()=>main,createElement:t=>{const n=node(t);created.push(n);return n;}};
 const panel=Object.keys(focus.SOURCES[file].panels)[0],state=focus.mount(doc,{location:{href:'file:///book/'+file+'?atlasPanel='+panel}});
 ok(state);ok(root.classList.values.includes('atlas-source-focus'));eq(main.children.length,children.length);
 for(const child of children)eq(child.classList.values.includes('atlas-source-hidden'),!state.sections.includes(child.id)&&child.id!=='boundary');
 ok(created.some(x=>x.tag==='a'&&x.href.includes('focus=mechanisms')));ok(created.some(x=>x.textContent==='Vollständige Quelle ↗'));
}
const atlas=read('A0_FAMILY_CONNECTION_ATLAS.html');ok(atlas.includes('id="familyMechanisms"'));ok(atlas.includes('<details id="familyAtlasWorkbench" open>'));ok(atlas.indexOf('familyAtlasWorkbench')<atlas.indexOf('id="map"'));ok(atlas.includes('a0-family-mechanism-workshop.js'));
const src=read('a0-family-mechanism-workshop.js');ok(!/postMessage|contentWindow|setInterval|fetch\(/.test(src));ok(!/\.click\(|postMessage|contentWindow/.test(read('a0-atlas-source-focus.js')));
console.log(JSON.stringify({status:'PASS',checks,scope:'curated original anchors, allowlists, lazy single iframe, unloading/stale events/plate memory, source focus retains DOM, return links and legacy reveal; browser pixels OPEN'}));
