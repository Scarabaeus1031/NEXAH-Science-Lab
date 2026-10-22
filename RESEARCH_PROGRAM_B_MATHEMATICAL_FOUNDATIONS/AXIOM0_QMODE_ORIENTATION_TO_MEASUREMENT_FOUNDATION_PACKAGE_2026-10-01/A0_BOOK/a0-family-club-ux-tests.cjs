const assert=require('node:assert/strict'),fs=require('node:fs');
const api=require('./a0-family-club-ux.js'),demo=require('./a0-family-navigator-demo.js');
let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
class El{
 constructor(tag='div',attrs={}){this.tagName=tag.toUpperCase();this.attrs={...attrs};this.children=[];this.parentElement=null;this.dataset={};this.events={};this.hidden=false;this.open=false;this.className=attrs.class||'';for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]??null;}
 append(...nodes){for(const n of nodes){if(n.parentElement)n.parentElement.children=n.parentElement.children.filter(x=>x!==n);n.parentElement=this;this.children.push(n)}}
 replaceChildren(...nodes){for(const n of [...this.children])n.remove();this.append(...nodes);}
 after(n){this.place(n,1)}before(n){this.place(n,0)}place(n,offset){const parent=this.parentElement;if(n.parentElement)n.parentElement.children=n.parentElement.children.filter(x=>x!==n);parent.children.splice(parent.children.indexOf(this)+offset,0,n);n.parentElement=parent;}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(n=>n!==this);this.parentElement=null;}
 addEventListener(k,f){(this.events[k]||=[]).push(f)}emit(k,event={}){for(const f of this.events[k]||[])f(event)}
 contains(n){for(;n;n=n.parentElement)if(n===this)return true;return false;}
 focus(){this.focused=true;}scrollIntoView(options){this.scrolled=options;}
 matches(s){
  if(s.startsWith('.'))return this.className.split(' ').includes(s.slice(1));
  if(s.startsWith('[')){const m=s.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return !!m&&m[1]in this.attrs&&(m[2]===undefined||this.attrs[m[1]]===m[2]);}
  const m=s.match(/^([\w-]+)(?:\.([\w-]+))?$/);return !!m&&this.tagName===m[1].toUpperCase()&&(!m[2]||this.className.split(' ').includes(m[2]));
 }
 querySelectorAll(s){if(s.startsWith(':scope > '))return this.children.filter(n=>n.matches(s.slice(9)));return this.children.flatMap(n=>[...(n.matches(s)?[n]:[]),...n.querySelectorAll(s)]);}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
}
function fixture(hash=''){
 const documentRoot=new El('main'),events={},frames=[];let resizes=0;
 const e=(tag,attrs,parent=documentRoot)=>{const n=new El(tag,attrs);parent.append(n);return n};
 const room=e('div',{id:'familySpatialMount','data-side':'a'}),nav=e('div',{class:'demo-navigation'},room);
 const tools=['room','view','light'].map(id=>{const n=e('details',{'data-club-tool':id,id:id==='light'?'clubLights':'tool-'+id},nav);e('summary',{},n);e('small',{'data-club-current':id},n);return n});
 const bench=e('button',{'data-club-bench':''},nav),body=e('div',{class:'spatial-body'},room),panel=e('aside',{id:'clubBenchPanel'},body);
 e('div',{'data-club-selection':''},panel);e('div',{'data-club-legend':''},panel);
 const workbench=e('section',{id:'jointWorkbench'}),article=e('article',{id:'jointExplanation'},workbench);
 e('dl',{id:'jointFacts'},article);e('a',{},article);e('aside',{},workbench);
 const history=e('div',{class:'spatial-return'},room),notes=e('div',{'data-club-notes':''},room),relations=e('section',{class:'spatial-relations'},room);
 e('button',{},relations);e('button',{},relations);e('p',{class:'spatial-note'},room);
 const glb=e('section',{id:'jukeboxGLB'});e('button',{id:'jukeboxGLBPlay'},glb);
 const viewer=e('model-viewer',{},glb);viewer.pause=()=>viewer.paused=true;
 const find=(id,node=documentRoot)=>(node.id||node.attrs.id)===id?node:node.children.map(n=>find(id,n)).find(Boolean);
 const doc={getElementById:find,createElement:tag=>new El(tag),addEventListener:(k,f)=>(events[k]||=[]).push(f)};
 const state={family:'F2',elevatorFamily:'F2',stop:'theta',layout:'cylinder',camera:{yaw:-.35,pitch:.38,zoom:1,target:[0,0,0]}},frozen=JSON.stringify(state);
 let selectedEdge=null;
 const win={location:{hash},A0FamilySpatialReader:{snapshot:()=>JSON.parse(JSON.stringify(state)),resize:()=>resizes++},A0FamilyAtlasBridge:{snapshot:()=>({selectedEdge})},A0JukeboxStage:{snapshot:()=>({mode:'room'})},requestAnimationFrame:f=>frames.push(f),addEventListener:(k,f)=>(events[k]||=[]).push(f)};
 ok(demo.dockJointPanel(doc,room));
 const mounted=api.mount(doc,win),flush=()=>{while(frames.length)frames.shift()()};
 return{room,tools,bench,body,panel,article,workbench,history,notes,glb,viewer,doc,win,frames,mounted,flush,state,frozen,events,setEdge:id=>selectedEdge=id,emit:k=>{for(const f of events[k]||[])f()},get resizes(){return resizes}};
}
const h=fixture();h.flush();eq(h.mounted.snapshot().benchOpen,false);ok(h.panel.hidden);eq(h.bench.attrs['aria-expanded'],'false');
eq(h.article.parentElement,h.room.querySelector('[data-club-selection]'));ok(h.panel.contains(h.workbench));eq(h.doc.getElementById('jointFacts').parentElement.tagName,'DETAILS');
eq(h.notes.querySelectorAll('.spatial-note').length,1);eq(h.history.querySelectorAll('button').length,2);
eq(h.doc.getElementById('clubGLBDrawer').open,false);eq(h.glb.parentElement.tagName,'DETAILS');
h.bench.onclick();h.flush();ok(!h.panel.hidden);eq(h.mounted.snapshot().benchOpen,true);eq(h.room.getAttribute('data-club-view'),'bench');
h.bench.onclick();h.flush();ok(h.panel.hidden);eq(JSON.stringify(h.state),h.frozen);
h.tools[0].open=true;h.tools[1].open=true;h.tools[1].emit('toggle');eq(h.tools[0].open,false);eq(h.tools[1].open,true);h.flush();
h.win.location.hash='#clubLights';h.emit('hashchange');h.flush();eq(h.tools[2].open,true);eq(h.tools[1].open,false);ok(h.tools[2].scrolled);
h.win.location.hash='#jointWorkbench';h.emit('hashchange');h.flush();ok(!h.panel.hidden);ok(h.workbench.parentElement.open);
h.win.location.hash='#jukeboxGLB';h.emit('hashchange');h.flush();ok(h.doc.getElementById('clubGLBDrawer').open);
h.doc.getElementById('clubGLBDrawer').open=false;h.doc.getElementById('clubGLBDrawer').emit('toggle');ok(h.viewer.paused);
h.mounted.setBench(false);h.setEdge('e23');h.emit('a0:family-atlas-selection');h.flush();ok(!h.panel.hidden);
h.mounted.setBench(false);h.emit('a0:family-atlas-selection');h.flush();ok(h.panel.hidden,'same existing Joint must not force reopen');
h.setEdge('e34');h.emit('a0:family-atlas-selection');h.flush();ok(!h.panel.hidden);
for(const f of h.events.keydown)f({key:'Escape',target:h.article});h.flush();ok(h.panel.hidden);ok(h.bench.focused);
h.tools[0].open=true;for(const f of h.events.keydown)f({key:'Escape',target:h.tools[0]});h.flush();ok(!h.tools[0].open);ok(h.tools[0].querySelector('summary').focused);
eq(JSON.stringify(h.state),h.frozen);ok(h.resizes>0);
const g=fixture('#jukeboxGLB');g.flush();ok(g.doc.getElementById('clubGLBDrawer').open);ok(g.glb.scrolled);
const b=fixture('#jointExplanation');b.flush();ok(!b.panel.hidden);ok(b.article.scrolled);
const source=fs.readFileSync(__dirname+'/a0-family-club-ux.js','utf8');ok(!/bridge\.apply|bridge\.selectEdge|localStorage|fetch\(|setInterval/.test(source));
// Open console preserves the original controls, callbacks, labels and deep link target.
const consoleRoom=new El(),consoleToolbar=new El('div',{class:'spatial-toolbar demo-navigation'}),consoleBody=new El('div',{class:'spatial-body'}),consolePanel=new El('aside');
consoleRoom.append(consoleToolbar,consoleBody);consoleBody.append(consolePanel);
const kept=[];let clicks=0;
for(const kind of ['room','exhibit','view','light']){
 const tool=new El('details',{'data-club-tool':kind}),summary=new El('summary'),label=new El('small',{'data-club-current':kind}),field=new El('fieldset'),button=new El('button');
 if(kind==='light')tool.id='clubLights';
 button.onclick=()=>clicks++;summary.append(label);field.append(button);tool.append(summary,field);consoleToolbar.append(tool);kept.push({label,button,field});
 if(kind==='view'){const zoom=new El('details',{class:'club-zoom'});tool.append(zoom);}
}
const consoleBench=new El('button',{'data-club-bench':''});consoleToolbar.append(consoleBench);
ok(api.arrangeConsole({createElement:tag=>new El(tag)},consoleRoom,consolePanel));
eq(consoleRoom.children.indexOf(consoleToolbar),consoleRoom.children.indexOf(consoleBody)+1);
eq(consoleToolbar.querySelectorAll('[data-club-tool]').length,0);
eq(consoleToolbar.querySelectorAll('[data-club-control]').length,4);
eq(consolePanel.querySelectorAll('.club-zoom').length,1);
eq(consoleToolbar.querySelectorAll('details').length,0);
ok(consoleToolbar.children.some(n=>n.id==='clubLights'));
for(const item of kept){ok(consoleToolbar.contains(item.label));ok(consoleToolbar.contains(item.field));item.button.onclick();}
eq(clicks,4);ok(consoleToolbar.contains(consoleBench));
// Cockpit collects the same live controls and route links below the stage, not copies.
const outer=new El();outer.append(consoleRoom);
const cockpitContext=new El('div',{class:'club-current'}),cockpitPickup=new El('section',{class:'club-pickup-console'}),cockpitHistory=new El('div',{class:'spatial-return'});
const pickupNote=new El('small');cockpitPickup.append(pickupNote);
const familyKey=new El('button');familyKey.onclick=()=>clicks++;cockpitPickup.append(familyKey);
consoleRoom.append(cockpitContext,cockpitPickup,cockpitHistory);
const topNav=new El('nav',{class:'club-guide'}),sourcesNav=new El('nav',{class:'club-guide club-connections'});
const deckLink=new El('a',{href:'#club-deck-room','data-jukebox-room':'deck'}),ldvLink=new El('a',{href:'#ldv-lookback-room','data-jukebox-room':'ldv'});
topNav.append(new El('a',{href:'#clubLights'}));sourcesNav.append(deckLink,ldvLink);outer.append(topNav,sourcesNav);
const orientation=new El('nav',{class:'jukebox-orientation'}),glbLink=new El('a',{href:'#jukeboxGLB'});orientation.append(glbLink);consoleRoom.append(orientation);
for(const item of kept)item.field.append(new El('small'));
const board=api.assembleCockpit({createElement:tag=>new El(tag),querySelector:s=>s==='.club-connections'?sourcesNav:topNav},consoleRoom,consolePanel);
ok(board);eq(board.className,'club-cockpit');eq(board.parentElement,consoleRoom);
eq(consoleRoom.children.indexOf(board),consoleRoom.children.indexOf(consoleBody)+1);
for(const node of [cockpitContext,cockpitPickup,consoleToolbar,cockpitHistory])eq(node.parentElement,board);
ok(board.contains(deckLink));ok(board.contains(ldvLink));ok(board.contains(glbLink));ok(orientation.hidden);
eq(deckLink.attrs.href,'#club-deck-room');eq(ldvLink.attrs.href,'#ldv-lookback-room');
ok(consolePanel.contains(pickupNote));eq(consolePanel.querySelectorAll('.club-cockpit-help').length,1);
for(const item of kept){ok(board.contains(item.button));eq(item.field.querySelectorAll('small').length,0);}
familyKey.onclick();eq(clicks,5);eq(outer.querySelectorAll('[data-jukebox-room="deck"]').length,1);
// Stage layout retains the original Elevator buttons and callbacks in the right controls.
const elevatorPlates=new El('div',{class:'club-pickup-plates'}),elevatorButton=new El('button');
const navigationTitle=new El('strong'),signLegend=new El('details',{'data-club-sign-legend':''}),signContent=new El('aside');
navigationTitle.textContent='● NAVIGATION · FOLGE DEM GELBEN PUNKT';cockpitPickup.append(navigationTitle);signLegend.append(signContent);consolePanel.append(signLegend);
const whereReadout=new El('output',{'data-readout':'where'}),whereKicker=new El('div',{class:'kicker'}),familyPicker=new El('details',{class:'club-family-picker'}),familySummary=new El('summary'),stopReadout=new El('div',{'data-readout':'stops'});
familyPicker.append(familySummary);consolePanel.append(whereKicker,whereReadout,familyPicker,stopReadout);
const edgeDisclosure=new El('details'),edgeSummary=new El('summary'),liveEdges=new El('div',{'data-readout':'edges',class:'spatial-edges'}),liveJoint=new El('div',{'data-readout':'joint'}),liveEdgeButton=new El('button');
let liveEdgeClicks=0;liveEdgeButton.onclick=()=>liveEdgeClicks++;liveEdges.append(liveEdgeButton);edgeDisclosure.append(edgeSummary,liveEdges);consolePanel.append(edgeDisclosure,liveJoint);
let elevatorClicks=0;elevatorButton.onclick=()=>elevatorClicks++;elevatorPlates.append(elevatorButton);cockpitPickup.append(elevatorPlates);
const jointPatch=new El('section',{class:'demo-joints club-joint-patch'}),jointPatchButton=new El('button');let jointPatchClicks=0;jointPatchButton.onclick=()=>jointPatchClicks++;jointPatch.append(jointPatchButton);outer.append(jointPatch);
const stage=api.arrangeStage({createElement:tag=>new El(tag),querySelector:s=>s==='.demo-joints'?jointPatch:null},consoleRoom,consolePanel);
eq(jointPatch.parentElement,consoleRoom);eq(consoleRoom.children.indexOf(jointPatch),consoleRoom.children.indexOf(consoleBody)+1);ok(consoleRoom.children.indexOf(jointPatch)<consoleRoom.children.indexOf(board));jointPatchButton.onclick();eq(jointPatchClicks,1);
ok(stage);eq(stage.drawer.tagName,'DETAILS');ok(stage.drawer.contains(consolePanel));
const side=consoleRoom.querySelector('.club-stage-controls'),coordinateRow=consoleRoom.querySelector('.club-coordinate-row'),top=consoleRoom.querySelector('.club-experience-bar');
eq(top.querySelector('.club-performance-heading'),null);
eq(navigationTitle.parentElement,cockpitPickup);eq(signLegend.parentElement,consoleToolbar);ok(signLegend.contains(signContent));ok(!consolePanel.contains(signLegend));eq(consoleToolbar.children.at(-1),signLegend);
ok(consolePanel.contains(whereReadout));ok(whereKicker.hidden);eq(stopReadout.parentElement,familyPicker);ok(familySummary.textContent.includes('Family Elevator'));ok(coordinateRow.hidden);
eq(side.parentElement,consoleBody);ok(side.contains(consoleToolbar));
ok(side.contains(cockpitPickup));ok(coordinateRow.contains(consoleRoom.querySelector('[data-club-control="exhibit"]')));eq(navigationTitle.textContent,'Families · F1–F7');
eq(side.querySelectorAll('[data-club-control="exhibit"]').length,0);
eq(side.querySelectorAll('[data-club-control]').length,4);ok(top.contains(cockpitContext));
const elevator=side.querySelector('[data-club-control="elevator"]');ok(elevator.contains(elevatorPlates));ok(!cockpitPickup.contains(elevatorPlates));eq(elevator.querySelector('h3').textContent,'Family Elevator');
elevatorButton.onclick();eq(elevatorClicks,1);eq(elevatorPlates.attrs['aria-label'],'Elevator · Quelle, Ansicht, Grenze');
eq(stage.drawer.parentElement,board);eq(coordinateRow.parentElement,board);eq(stage.drawer.open,false);
eq(consoleRoom.children.indexOf(top),consoleRoom.children.indexOf(consoleBody)-1);
ok(consolePanel.contains(deckLink));ok(consolePanel.contains(ldvLink));ok(!top.contains(ldvLink));ok(!top.contains(deckLink));eq(deckLink.parentElement.parentElement.parentElement.tagName,'DETAILS');familyKey.onclick();eq(clicks,6);
const liveConnections=side.querySelector('.club-live-connections');ok(liveConnections.contains(liveEdges));ok(liveConnections.contains(liveJoint));ok(!consolePanel.contains(liveEdges));liveEdgeButton.onclick();eq(liveEdgeClicks,1);ok(!consolePanel.contains(edgeDisclosure));
const markup=fs.readFileSync(__dirname+'/a0-family-navigator-demo-spatial.js','utf8');
// Patch cables are projections of existing typed records, never inferred geometric edges.
const patchPickup=new El(),patchSelections=[],patch=api.familyPatch({createElement:tag=>new El(tag)},patchPickup,id=>patchSelections.push(id));
const patchState={family:'F1',selectedEdge:'e12',edges:{e12:{a:'F1',b:'F2',label:'Record → Adresse',status:'exact'},e17:{a:'F1',b:'F7',label:'Record → Prüfung',status:'method'},e23:{a:'F2',b:'F3',label:'Adresse → Übergang',status:'empirical'}}};
patch.refresh(patchState);const patchSvg=patchPickup.children[0];eq(patchSvg.children.length,2);eq(patchSvg.children[0].attrs.stroke,'#69d39a');eq(patchSvg.children[0].attrs['aria-pressed'],'true');eq(patchSvg.children[1].attrs['stroke-dasharray'],'5 4');
patchSvg.children[0].onclick();let prevented=false;patchSvg.children[1].onkeydown({key:'Enter',preventDefault(){prevented=true;}});eq(patchSelections,['e12','e17']);ok(prevented);
patch.refresh({...patchState,family:'F3'});eq(patchSvg.children.length,1);ok(patchSvg.children[0].attrs['aria-label'].includes('F2 → F3'));eq(patchState.selectedEdge,'e12');
eq((markup.match(/data-club-tool=/g)||[]).length,3);ok(markup.includes('aria-controls="clubBenchPanel"'));
function balanced(html){
 const stack=[],voids=new Set(['input','br','hr','meta','link','img','source','wbr']);
 for(const m of html.matchAll(/<\/?([\w-]+)\b[^>]*>/g)){
  const tag=m[1].toLowerCase();if(voids.has(tag)||m[0].endsWith('/>'))continue;
  if(m[0].startsWith('</'))eq(stack.pop(),tag,'matching HTML container');else stack.push(tag);
 }
 eq(stack,[]);
}
const mountedMarkup=markup.split('\n').find(line=>line.includes('mount.innerHTML='));
balanced(mountedMarkup.slice(mountedMarkup.indexOf("='<")+2,mountedMarkup.lastIndexOf("';")));
balanced(fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8'));
console.log(JSON.stringify({status:'PASS',checks,scope:'real disclosure controller and inspector docking; primary buttons, exclusive tools, context/Bench toggle, hash/deep links, Escape/focus, GLB pause; reader/camera immutable; browser pixels OPEN'}));
