const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const feature=require('./a0-family-navigator-demo.js'),projection=require('./a0-family-navigator-demo-spatial.js'),builder=require('./build-a0-family-navigator-demo.cjs');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b)=>{assert.deepEqual(a,b);checks++;},copy=x=>JSON.parse(JSON.stringify(x));
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/a0-family-navigator-demo-data.js','utf8'),ctx);const data=ctx.window.A0FamilyNavigatorDemoData;
const atlas=fs.readFileSync(__dirname+'/A0_FAMILY_CONNECTION_ATLAS.html','utf8'),extracted=builder.extract(atlas);
eq(copy(data.families),extracted.families);eq(copy(data.edges),extracted.edges);eq(copy(data.stops),extracted.stops);eq(copy(data.routes),extracted.routes);
eq(data.meta.sha256,crypto.createHash('sha256').update(atlas).digest('hex'));eq(Object.keys(data.families).length,7);eq(Object.keys(data.edges).length,15);
for(const e of Object.values(data.edges)){ok(feature.STATUS[e.status]);ok(data.families[e.a]&&data.families[e.b]);}
for(const layout of ['plate','polar','cylinder'])for(let layer=0;layer<3;layer++)for(const[f,i]of Object.values(data.families).map((f,i)=>[f,i])){
 const p=projection.position(f,i,layer,layout);for(const yaw of [0,.3,Math.PI])ok(Object.values(projection.project(p,{yaw,pitch:.38,zoom:1},800,560)).every(Number.isFinite));
}
let messages=0;const bridge=feature.createBridge(data,()=>messages++);eq(bridge.snapshot().family,'F1');
for(const id of Object.keys(data.edges)){ok(bridge.selectEdge(id));eq(bridge.snapshot().selectedEdge,id);eq(bridge.snapshot().family,data.edges[id].a);}
const frozen=bridge.snapshot();ok(!bridge.selectEdge('invented'));bridge.apply({family:'F8',mode:'invented',stop:'invented'});eq(bridge.snapshot(),frozen);ok(!bridge.apply(null));
bridge.apply({family:'F4',stop:'theta',mode:'elevator'});eq(bridge.snapshot().selectedEdge,null);eq(bridge.snapshot().stop,'theta');eq(bridge.snapshot().family,'F4');ok(messages>0);
const foreign=bridge.snapshot();foreign.families.F1.name='changed';ok(bridge.snapshot().families.F1.name!=='changed');
// Real copied renderer and real standalone bridge, with native-like DOM/canvas doubles.
function element(){return{children:[],dataset:{},style:{setProperty(){}},attrs:{},append(...xs){this.children.push(...xs);},replaceChildren(...xs){this.children=xs;},setAttribute(k,v){this.attrs[k]=v;}};}
function harness(animated=false,withBodies=false){
 const nodes={},listeners={},frames=[],actions=['front','back','zoomOut','zoomIn','previous','next','home','focus','overview'];
 for(const id of ['where','families','stops','question','edges','trail','joint','orientation','modeHelp'])nodes['[data-readout="'+id+'"]']=element();
 for(const id of ['layout','mode'])nodes['[data-control="'+id+'"]']=element();
 nodes['[data-control="rooms"]']=element();
 nodes['[data-control="landmarks"]']=element();
 nodes['[data-club-overview]']=element();
 nodes['[data-control="layout"]'].options=['cylinder','polar','plate'].map(value=>({value,textContent:value}));
 actions.forEach(id=>{nodes['[data-action="'+id+'"]']=Object.assign(element(),{dataset:{action:id}});});
 const paint=new Proxy({},{get:()=>()=>{}});
 const canvas=nodes.canvas={...element(),getContext:()=>paint,getBoundingClientRect:()=>({width:800,height:560,left:0,top:0}),setPointerCapture(){}};
 const mount={...element(),querySelector:s=>nodes[s],querySelectorAll:()=>actions.map(x=>nodes['[data-action="'+x+'"]'])};
 const b=feature.createBridge(data,()=>listeners['a0:family-atlas-selection']?.());
 const win={document:{getElementById:()=>mount,createElement:element,addEventListener:(k,fn)=>listeners[k]=fn},A0FamilyAtlasBridge:b,A0ScienceBuilderPath:require('./a0-science-builder-path.js'),location:{hash:''},addEventListener(){},matchMedia:()=>({matches:!animated}),requestAnimationFrame:fn=>frames.push(fn)};win.window=win;
 if(withBodies)win.A0FamilySpatialBodies=require('./a0-family-spatial-bodies.js');
 vm.runInNewContext(fs.readFileSync(__dirname+'/a0-family-navigator-demo-spatial.js','utf8'),win);
 return{nodes,mount,canvas,bridge:b,reader:win.A0FamilySpatialReader,win,frames,listeners};
}
const h=harness();eq(h.nodes['[data-readout="families"]'].children.length,7);eq(h.nodes['[data-readout="stops"]'].children.length,3);
const triangleReader=harness(),triangleState=copy(triangleReader.reader.snapshot()),triangleScene=copy(triangleReader.reader.scene());
ok(triangleReader.reader.setTriangle(true));ok(triangleReader.reader.triangle());
eq(copy(triangleReader.reader.snapshot()),triangleState);eq(copy(triangleReader.reader.scene()),triangleScene);
eq(triangleReader.reader.setTriangle(false),false);eq(copy(triangleReader.reader.snapshot()),triangleState);
ok(!triangleReader.reader.selectFamily('F8'));eq(copy(triangleReader.reader.snapshot()),triangleState);
ok(triangleReader.reader.selectFamily('F3'));eq(triangleReader.reader.snapshot().family,'F3');eq(triangleReader.reader.snapshot().stop,'zeta');
// Tonarm reuses the retained-Family/elevator route; destination is committed only on arrival.
const headPositions=[[1,-1,0],[1,0,0],[1,1,0]];
eq(projection.readingHead(headPositions,0,2,0),headPositions[0]);
eq(projection.readingHead(headPositions,0,2,.5),headPositions[1]);
eq(projection.readingHead(headPositions,0,2,1),headPositions[2]);
eq(projection.readingHead(headPositions,2,0,.25),[1,.5,0]);
const pickupHarness=harness(true),pickupUI=pickupHarness.mount.children.at(-1);
eq(pickupUI.className,'club-pickup-console');
const familyKeys=pickupUI.children[1].children,plateKeys=pickupUI.children[2].children,pickupOutput=pickupUI.children[3];
eq(familyKeys.length,7);eq(plateKeys.length,3);ok(pickupOutput.textContent.includes('F1@ζ'));
const compactEdge=pickupHarness.nodes['[data-readout="edges"]'].children[0];eq(compactEdge.children.length,3);eq(compactEdge.children[0].textContent,'F1 → F2');eq(compactEdge.children[1].textContent,data.edges.e12.label);eq(compactEdge.children[2].textContent,'exact');ok(compactEdge.attrs['aria-label'].includes(data.edges.e12.label));
plateKeys[2].onclick();eq(pickupHarness.reader.snapshot().stop,'zeta');ok(pickupOutput.textContent.includes('Ziel noch nicht übernommen'));
eq(plateKeys[2].attrs['data-pickup-target'],'true');ok(plateKeys.every(b=>b.disabled));
pickupHarness.frames.shift()(0);pickupHarness.frames.shift()(400);ok(pickupHarness.reader.journey().progress>0);
eq(pickupHarness.reader.snapshot().family,'F1');eq(pickupHarness.reader.snapshot().stop,'zeta');
pickupHarness.frames.shift()(1500);eq(pickupHarness.reader.snapshot().stop,'beta');eq(pickupHarness.reader.snapshot().family,'F1');
ok(pickupOutput.textContent.includes('F1@β'));eq(plateKeys[2].attrs['aria-pressed'],'true');ok(plateKeys.every(b=>!b.disabled));
const cancelPickup=harness(true),cancelUI=cancelPickup.mount.children.at(-1);
cancelUI.children[2].children[2].onclick();cancelPickup.frames.shift()(0);
cancelUI.children[1].children[2].onclick();eq(cancelPickup.reader.journey(),null);eq(cancelPickup.reader.snapshot().family,'F3');eq(cancelPickup.reader.snapshot().stop,'zeta');
ok(cancelUI.children[3].textContent.includes('F3@ζ'));
const origin=copy(h.reader.snapshot());ok(h.reader.travel('beta'));eq(h.bridge.snapshot().stop,'beta');eq(h.bridge.snapshot().family,'F1');
h.mount.children[3].children[2].onclick();eq(copy(h.reader.snapshot()),origin);
h.nodes['[data-control="layout"]'].onchange({target:{value:'polar'}});eq(h.reader.snapshot().layout,'polar');eq(h.reader.snapshot().family,'F1');
eq(h.mount.attrs['data-room'],'polar');
const themed=harness();eq(themed.mount.attrs['data-room'],'cylinder');
eq(themed.nodes['[data-control="rooms"]'].children.length,3);
themed.nodes['[data-control="rooms"]'].children[1].onclick();eq(themed.mount.attrs['data-room'],'polar');
eq(themed.nodes['[data-control="rooms"]'].children[1].attrs['aria-pressed'],'true');
themed.nodes['[data-control="rooms"]'].children[0].onclick();
eq(themed.mount.attrs['data-side'],'a');
eq(themed.nodes['[data-action="front"]'].attrs['aria-pressed'],'true');
themed.nodes['[data-action="back"]'].onclick();
eq(themed.mount.attrs['data-side'],'b');
eq(themed.nodes['[data-action="back"]'].attrs['aria-pressed'],'true');
eq(themed.nodes['[data-action="front"]'].attrs['aria-pressed'],'false');
themed.nodes['[data-control="layout"]'].onchange({target:{value:'plate'}});
eq(themed.mount.attrs['data-room'],'plate');
themed.nodes['[data-action="previous"]'].onclick();
eq(themed.mount.attrs['data-room'],'cylinder');
h.nodes['[data-control="layout"]'].onchange({target:{value:'cylinder'}});
const e=data.edges.e23,s=h.reader.snapshot(),ids=Object.keys(data.families);
const point=id=>projection.project(projection.position(data.families[id],ids.indexOf(id),0,s.layout),s.camera,800,560);
const a=point(e.a),b=point(e.b),p={clientX:a.x*.55+b.x*.45,clientY:a.y*.55+b.y*.45,pointerId:1};
h.canvas.onpointerdown(p);h.canvas.onpointerup(p);eq(h.bridge.snapshot().selectedEdge,'e23');ok(h.nodes['[data-readout="joint"]'].textContent.includes('Adresse'));
h.nodes['[data-action="back"]'].onclick();eq(h.bridge.snapshot().selectedEdge,'e23');
h.nodes['[data-action="previous"]'].onclick();eq(h.bridge.snapshot().selectedEdge,'e23');
// Opposite F4/F5 records get separate drawn lanes, not indistinguishable overlap.
const lanes=harness();const ls=lanes.reader.snapshot(),order=Object.keys(data.families);
function clickPaired(id){const e=data.edges[id],point=id=>projection.project(projection.position(data.families[id],order.indexOf(id),0,ls.layout),ls.camera,800,560),a=point(e.a),b=point(e.b),length=Math.hypot(b.x-a.x,b.y-a.y),p={clientX:(a.x+b.x)/2-(b.y-a.y)/length*6,clientY:(a.y+b.y)/2+(b.x-a.x)/length*6,pointerId:1};lanes.canvas.onpointerdown(p);lanes.canvas.onpointerup(p);}
clickPaired('e45');eq(lanes.bridge.snapshot().selectedEdge,'e45');clickPaired('e54');eq(lanes.bridge.snapshot().selectedEdge,'e54');
const animated=harness(true);ok(animated.reader.travel('beta'));animated.frames.shift()(0);animated.frames.shift()(325);ok(animated.reader.journey().progress>0);animated.frames.shift()(1500);eq(animated.bridge.snapshot().stop,'beta');
const displayDuringTravel=harness(true);ok(displayDuringTravel.reader.travel('beta'));
displayDuringTravel.reader.changeLayout('polar');ok(displayDuringTravel.reader.journey());
displayDuringTravel.nodes['[data-action="back"]'].onclick();ok(displayDuringTravel.reader.journey());
displayDuringTravel.reader.overview();ok(displayDuringTravel.reader.journey());eq(displayDuringTravel.reader.snapshot().stop,'zeta');
displayDuringTravel.reader.cancelTravel();eq(displayDuringTravel.reader.journey(),null);
animated.reader.travel('zeta');animated.frames.shift()(0);animated.reader.cancelTravel();animated.frames.shift()(1500);eq(animated.bridge.snapshot().stop,'beta');
// Continuous navigation is a local view only. Reduced motion commits immediately.
const spatial=harness();eq(spatial.nodes['[data-control="landmarks"]'].children.length,4);
const beforeFocus=copy(spatial.reader.snapshot());spatial.nodes['[data-action="focus"]'].onclick();
eq(copy(spatial.reader.snapshot().camera.target),[0,0,0]);eq(spatial.reader.snapshot().family,'F1');ok(spatial.reader.snapshot().autoFrame);
spatial.nodes['[data-action="overview"]'].onclick();eq(copy(spatial.reader.snapshot().camera.target),[0,0,0]);ok(spatial.reader.snapshot().camera.zoom>0);ok(spatial.reader.snapshot().autoFrame);
eq(spatial.nodes['[data-club-overview]'].attrs['aria-pressed'],'true');eq(spatial.nodes['[data-action="front"]'].attrs['aria-pressed'],'false');eq(spatial.nodes['[data-action="back"]'].attrs['aria-pressed'],'false');
eq(spatial.reader.snapshot().camera.pitch,1.15);eq(spatial.reader.snapshot().camera.yaw,-.35);
const overhead=copy(spatial.reader.snapshot());spatial.reader.selectFamily('F2');eq(spatial.reader.snapshot().camera.pitch,overhead.camera.pitch);eq(spatial.reader.snapshot().stop,overhead.stop);
spatial.nodes['[data-action="front"]'].onclick();eq(spatial.reader.snapshot().camera.pitch,.38);
spatial.nodes['[data-control="mode"]'].onchange({target:{value:'joint'}});ok(spatial.nodes['[data-readout="modeHelp"]'].textContent.includes('Alle Joints'));
spatial.nodes['[data-control="mode"]'].onchange({target:{value:'elevator'}});ok(spatial.nodes['[data-readout="modeHelp"]'].textContent.includes('sieben'));
ok(!spatial.reader.changeLayout('invented'));
const scene=spatial.reader.scene();eq(scene.nodes.length,21);eq(scene.lines.length,62);eq(scene.extras.engine_state_transfer,false);
eq(new Set(scene.nodes.map(n=>n.extras.family)).size,7);
eq(scene.lines.filter(x=>x.extras.status==='negative').length,3);
const glb=require('./a0-family-jukebox-glb.js'),encoded=glb.encode(scene),inspected=glb.inspect(encoded);
// Bounds-based fit: every room, source body, A/B and oblique view, on narrow/wide frames.
const fitHarness=harness(false,true);
for(const [w,h]of [[320,420],[600,420],[800,560],[1440,560]])for(const room of ['cylinder','polar','plate'])for(const exhibit of ['none','bluebody','dodeca']){
 fitHarness.reader.changeLayout(room);fitHarness.reader.setExhibit(exhibit);
 const scene=fitHarness.reader.scene(),points=[...scene.nodes.map(n=>n.position),...scene.lines.flatMap(line=>line.points),...projection.scaffold(room).flat()];
 for(const node of scene.nodes)points.push([2.35,node.position[1]+.12,1.25],[2.02,node.position[1]+.18,node.position[2]*.45]);
 for(const yaw of [-.35,Math.PI-.35,1.2,4.3]){
  const camera=projection.fitCamera(points,{yaw,pitch:.38,zoom:1,target:[0,0,0]},w,h);
  const projected=points.map(p=>projection.project(p,camera,w,h));
  ok(projected.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=33&&p.x<=w-(w<600?65:184)&&p.y>=49&&p.y<=h-61),'all geometry and tonearm in padded '+room+' frame '+w);
 }
}
fitHarness.canvas.getBoundingClientRect=()=>({width:320,height:420,left:0,top:0});fitHarness.reader.resize();
const narrowFit=copy(fitHarness.reader.snapshot());ok(narrowFit.autoFrame);ok(narrowFit.camera.zoom>0);
fitHarness.nodes['[data-action="zoomIn"]'].onclick();ok(!fitHarness.reader.snapshot().autoFrame);
fitHarness.reader.overview();ok(fitHarness.reader.snapshot().autoFrame);eq(fitHarness.reader.snapshot().camera.pitch,1.15);eq(fitHarness.reader.snapshot().camera.yaw,-.35);
fitHarness.reader.overview();const fittedOverview=copy(fitHarness.reader.snapshot().camera);fitHarness.reader.overview();eq(copy(fitHarness.reader.snapshot().camera),fittedOverview);
ok(fitHarness.reader.resume(narrowFit));
ok(!fitHarness.reader.resume({...narrowFit,camera:{...narrowFit.camera,frameOffset:[Infinity,0]}}));
ok(!fitHarness.reader.resume({...narrowFit,camera:{...narrowFit.camera,zoom:Infinity}}));
eq(inspected.nodes,83);eq(inspected.json.extras.canonicalFamilies,7);
eq(inspected.json.nodes.filter(n=>n.extras?.family).length,35);
for(const accessor of inspected.json.accessors){ok(accessor.min.every(Number.isFinite));ok(accessor.max.every(Number.isFinite));}
const flying=harness(true);const firstYaw=flying.reader.snapshot().camera.yaw;flying.nodes['[data-action="back"]'].onclick();
ok(flying.reader.motion());eq(flying.reader.snapshot().camera.yaw,firstYaw);
flying.frames.shift()(0);flying.frames.shift()(375);ok(Math.abs(flying.reader.snapshot().camera.yaw-firstYaw)>.5);ok(flying.reader.motion().progress>0);
flying.frames.shift()(800);eq(flying.reader.motion(),null);eq(flying.mount.attrs['data-side'],'b');
flying.reader.changeLayout('polar');flying.frames.shift()(0);flying.frames.shift()(375);ok(flying.reader.motion().progress>0);
assert.throws(()=>flying.reader.scene(),/abwarten/);checks++;
flying.frames.shift()(800);eq(flying.reader.motion(),null);eq(flying.reader.scene().extras.layout,'polar');
const cameraTarget=copy(flying.reader.snapshot().camera.target);
flying.reader.changeLayout('plate');flying.frames.shift()(0);flying.win.document.hidden=true;flying.listeners.visibilitychange();eq(flying.reader.motion(),null);
ok(flying.reader.snapshot().camera.target.every(Number.isFinite));
const midway=projection.cameraBetween({yaw:0,pitch:0,zoom:1,target:[0,0,0]},{yaw:2,pitch:1,zoom:1.5,target:[2,4,6]},.5);
eq(midway,{yaw:1,pitch:.5,zoom:1.25,target:[1,2,3]});
// Decorative body motion must not change snapshots, source vertices, graph hits or GLB output.
const staged=harness(false,true),stageMath=require('./a0-family-jukebox-stage.js');let posed=0;
for(const layout of ['bluebody','dodeca']){
 ok(staged.reader.changeLayout(layout));const stateBefore=copy(staged.reader.snapshot()),exportBefore=copy(staged.reader.scene());
 staged.win.A0JukeboxStage={pose:()=>stageMath.poseAt(25),transform:(p,pose)=>{posed++;return stageMath.transform(p,pose)}};
 staged.reader.redraw();eq(copy(staged.reader.snapshot()),stateBefore);eq(copy(staged.reader.scene()),exportBefore);
 eq(exportBefore.extras.decorative_stage_animation_exported,false);
 ok(glb.inspect(glb.encode(exportBefore)).nodes>83);
}
ok(posed>0);
// Exhibit is independent of the room, graph and reading position; local trail restores it.
const exhibits=harness(false,true);
// Exhibition placement preserves shape by uniform scale; room scaffolds are view-only.
for(const room of ['cylinder','polar','plate']){
 const segments=projection.scaffold(room);ok(segments.length>10);ok(segments.flat(2).every(Number.isFinite));
 const a=[.2,.3,.4],b=[-.5,.7,-.2],placedA=projection.exhibitPoint(a,room),placedB=projection.exhibitPoint(b,room);
 const scale=room==='polar'?.36:room==='plate'?.5:.72;
 ok(Math.abs(Math.hypot(...placedA.map((x,i)=>x-placedB[i]))-scale*Math.hypot(...a.map((x,i)=>x-b[i])))<1e-10);
 eq(a,[.2,.3,.4]);
}
const guideOrigin=copy(exhibits.reader.snapshot()),guideScene=copy(exhibits.reader.scene());
eq(projection.viewForCamera({yaw:-.35,pitch:.38}),'front');eq(projection.viewForCamera({yaw:Math.PI-.35,pitch:.38}),'back');eq(projection.viewForCamera({yaw:Math.PI-.35,pitch:1.15}),'overview');
ok(exhibits.reader.setGuideHeld(true));eq(copy(exhibits.reader.snapshot()),guideOrigin);eq(copy(exhibits.reader.scene()),guideScene);
eq(exhibits.reader.guide().alpha,1);eq(exhibits.reader.setGuideHeld(false),false);
eq(exhibits.reader.guide().alpha,0);
exhibits.canvas.onpointerdown({clientX:0,clientY:0,pointerId:1});
exhibits.canvas.onpointermove({clientX:420,clientY:0});
eq(exhibits.mount.attrs['data-side'],'b');eq(exhibits.mount.attrs['data-view-arrival'],'b');eq(exhibits.mount.attrs['data-turn-direction'],'right');
eq(exhibits.nodes['[data-action="back"]'].attrs['aria-pressed'],'true');
exhibits.canvas.onpointermove({clientX:0,clientY:0});eq(exhibits.mount.attrs['data-side'],'a');eq(exhibits.mount.attrs['data-turn-direction'],'left');
exhibits.canvas.onpointercancel();
const manualView=harness();manualView.canvas.onpointerdown({clientX:0,clientY:0,pointerId:1});manualView.canvas.onpointermove({clientX:420,clientY:0});eq(manualView.nodes['[data-action="back"]'].attrs['aria-pressed'],'true');
manualView.canvas.onpointermove({clientX:420,clientY:100});eq(manualView.mount.attrs['data-perspective'],'overview');eq(manualView.nodes['[data-club-overview]'].attrs['aria-pressed'],'true');eq(manualView.nodes['[data-action="back"]'].attrs['aria-pressed'],'false');eq(manualView.mount.attrs['data-view-arrival'],'overview');
manualView.canvas.onpointermove({clientX:0,clientY:0});eq(manualView.nodes['[data-action="front"]'].attrs['aria-pressed'],'true');eq(manualView.nodes['[data-club-overview]'].attrs['aria-pressed'],'false');manualView.canvas.onpointercancel();
exhibits.nodes['[data-action="home"]'].onclick();
const exhibitOrigin=copy(exhibits.reader.snapshot()),graphBefore=copy(exhibits.bridge.snapshot());
for(const layout of ['cylinder','polar','plate']){
 exhibits.reader.changeLayout(layout);
 for(const body of ['bluebody','dodeca']){
  const before=copy(exhibits.reader.snapshot());ok(exhibits.reader.setExhibit(body));
  const after=copy(exhibits.reader.snapshot());eq(after.layout,layout);eq(after.camera,before.camera);eq(after.family,before.family);eq(after.stop,before.stop);eq(after.exhibit,body);
  eq(copy(exhibits.bridge.snapshot()),graphBefore);
  eq(exhibits.reader.scene().nodes.length,21);ok(exhibits.reader.scene().lines.some(line=>line.extras.kind==='source-body-landmark'));
 }
}
ok(exhibits.reader.setExhibit('none'));ok(!exhibits.reader.scene().lines.some(line=>line.extras.kind==='source-body-landmark'));
const unchanged=copy(exhibits.reader.snapshot());ok(!exhibits.reader.setExhibit('invented'));eq(copy(exhibits.reader.snapshot()),unchanged);
exhibits.nodes['[data-action="previous"]'].onclick();eq(exhibits.reader.snapshot().exhibit,'dodeca');
exhibits.nodes['[data-action="home"]'].onclick();eq(copy(exhibits.reader.snapshot()),exhibitOrigin);
// Inspector uses source text, status explanations and accessible directory controls.
const domNodes=Object.fromEntries(['jointTitle','jointMeaning','jointFacts','jointDirectory','statusLegend','statusMeaning','demoProvenance'].map(id=>[id,element()]));
const docListeners={},doc={getElementById:id=>domNodes[id],createElement:element,addEventListener:(k,f)=>docListeners[k]=f,dispatchEvent:e=>docListeners[e.type]?.()};
const win={A0FamilyNavigatorDemoData:data,CustomEvent:function(type){this.type=type;}};
let docked=null;const jointPanel=element(),spatialBody={after:panel=>docked=panel};
ok(feature.dockJointPanel({getElementById:()=>jointPanel},{querySelector:s=>s==='.spatial-body'?spatialBody:null}));eq(docked,jointPanel);
ok(!feature.dockJointPanel({getElementById:()=>null},{querySelector:()=>spatialBody}));
const mounted=feature.mount(doc,win);eq(domNodes.jointDirectory.children.length,15);eq(domNodes.statusLegend.children.length,5);
domNodes.jointDirectory.children.at(-1).onclick();ok(domNodes.jointTitle.textContent.includes('≠'));ok(domNodes.jointMeaning.textContent.includes('negativer'));
eq(domNodes.jointDirectory.children[0].children.length,3);eq(domNodes.jointDirectory.children[0].children[0].textContent,'F1 → F2');eq(domNodes.jointDirectory.children[0].attrs['data-related'],'false');eq(domNodes.jointDirectory.children.at(-1).attrs['data-related'],'true');
domNodes.statusLegend.children[3].onclick();ok(domNodes.statusMeaning.textContent.includes('Offener Anschluss'));
eq(mounted.bridge.snapshot().selectedEdge,'e54');
const html=fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8');ok(html.includes('Family Jukebox'));ok(html.includes('nicht ß'));ok(html.toLowerCase().includes('kein gesamtmaschinen-controller'));
ok(html.includes('id="jointWorkbench"'));
ok(html.includes('<section class="demo-joints club-joint-patch"'));ok(!html.includes('<details class="demo-joints"'));
ok(html.includes('<header class="club-entry">'));
ok(html.includes('>醉</text>'));
ok(html.includes('OPIUM'));
ok(!html.includes('RDMH'));
ok(!html.includes('meines Bruders'));
ok(html.includes('Notes · Ideen für später'));ok(html.includes('Zurückgestellt, jetzt nicht umsetzen'));ok(html.includes('auch über Quelle / Ansicht / Grenze hinweg'));
ok(html.includes('02 · DJ / PLATTENDECK'));
ok(!html.includes('Dancefloor betreten'));
const spatialMarkup=fs.readFileSync(__dirname+'/a0-family-navigator-demo-spatial.js','utf8');
for(const id of ['spatial-navigation','clubLights','jointWorkbench'])ok(html.includes('id="'+id+'"')||spatialMarkup.includes('id="'+id+'"'),'club guide target '+id);
ok(!/<iframe|a0-family-record-player|a0-family-mechanism-workshop|setInterval/.test(html));
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){const target=match[1].split(/[?#]/)[0];if(/^https:/.test(target)){eq(target,'https://www.are.na/nexah-scarabaeus1031/leonardo-translations-the-room-that-looks-back');continue;}if(target)ok(fs.existsSync(__dirname+'/DRAFTS/'+target),'existing local target '+target);}
console.log(JSON.stringify({status:'PASS',checks,scope:'exact copied graph/metadata, source hash, real bridge and copied spatial runtime, edge hit, inspector, keyboard alternatives, elevator/return/cancel; browser pixels OPEN'}));
