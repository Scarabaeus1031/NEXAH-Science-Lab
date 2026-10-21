const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const api=require('./a0-family-spatial-navigation.js');
let checks=0;function ok(value,message){assert.ok(value,message);checks++}
const html=fs.readFileSync(__dirname+'/A0_FAMILY_CONNECTION_ATLAS.html','utf8');
function declaration(name){const match=html.match(new RegExp('const '+name+'=([\\s\\S]*?);\\n'));assert.ok(match,name);return vm.runInNewContext('('+match[1]+')')}
const families=declaration('families'),edges=declaration('edges'),stops=declaration('elevatorStops');
ok(Object.keys(families).length===7,'use all seven existing identities');
ok(Object.keys(stops).join(',')==='zeta,theta,beta','exactly the existing three reading positions');
for(const layout of ['plate','polar','cylinder','bluebody','dodeca'])for(let layer=0;layer<3;layer++){
  const points=Object.values(families).map((f,i)=>api.position(f,i,layer,layout));
  ok(new Set(points.map(p=>JSON.stringify(p))).size===7,'distinct families '+layout+layer);
  for(const p of points)for(const yaw of [0,.4,Math.PI,15]){
    const q=api.project(p,{yaw,pitch:.38,zoom:1},800,530);
    ok(Object.values(q).every(Number.isFinite),'finite projection');
  }
}
const p=[1,.5,-.4],camera={yaw:.3,pitch:.4,zoom:1};
const cycleA=api.project(p,camera,800,530),cycleB=api.project(p,{...camera,yaw:camera.yaw+2*Math.PI},800,530);
ok(Object.keys(cycleA).every(key=>Math.abs(cycleA[key]-cycleB[key])<1e-10),'full camera turn returns within floating-point tolerance');
const trail=api.createTrail({family:'F1'});trail.push({family:'F2'});trail.push({family:'F3'});
ok(trail.move(-1).family==='F2','previous snapshot');ok(trail.move(1).family==='F3','forward snapshot');
trail.home();trail.push({family:'F4'});ok(trail.length===2,'new branch replaces forward branch');
const detached=trail.current;detached.family='bad';ok(trail.current.family==='F4','snapshot isolation');
// Run actual Atlas bridge, with UI handlers replaced by state-preserving spies.
const bridgeText=html.slice(html.indexOf('window.A0FamilyAtlasBridge='),html.indexOf("document.addEventListener('click',event=>{if(event.target.closest?."));
const bridgeContext={window:{},families,edges,elevatorStops:stops,routes:{all:{label:'all',nodes:Object.keys(families),edges:Object.keys(edges)}},selectedFamily:null,selectedRoute:'all',selectedStage:null,overviewMode:'sync',elevatorFamily:'F1',elevatorStop:'zeta',stages:[],notifySpatial(){},renderElevator(){}};
bridgeContext.selectFamily=id=>{bridgeContext.selectedFamily=id;bridgeContext.selectedStage=null;bridgeContext.overviewMode='family'};
bridgeContext.setOverviewMode=mode=>bridgeContext.overviewMode=mode;
bridgeContext.renderRoute=id=>{bridgeContext.selectedRoute=id;bridgeContext.selectedFamily=null};
bridgeContext.selectEdge=()=>{};vm.createContext(bridgeContext);vm.runInContext(bridgeText,bridgeContext);
const bridge=bridgeContext.window.A0FamilyAtlasBridge;bridge.apply({family:'F5',mode:'elevator',stop:'beta'});
ok(bridge.snapshot().family==='F5'&&bridge.snapshot().stop==='beta','actual bridge accepts existing selection');
bridge.apply({family:'INVALID',mode:'INVALID',stop:'INVALID'});
ok(bridge.snapshot().family==='F5'&&bridge.snapshot().mode==='elevator','invalid values do not enter registry');
bridge.apply({route:'all',mode:'sync',stop:'zeta',elevatorFamily:'F1'});
// Small DOM/canvas harness executes the production spatial controller.
function element(){return{children:[],style:{},dataset:{},attrs:{},append(...children){this.children.push(...children)},replaceChildren(...children){this.children=children},setAttribute(k,v){this.attrs[k]=v}}}
const nodes={},actions=['front','back','zoomOut','zoomIn','previous','next','home'];
for(const id of ['where','families','stops','question','edges','trail'])nodes['[data-readout="'+id+'"]']=element();
for(const id of ['layout','mode'])nodes['[data-control="'+id+'"]']=element();
for(const id of actions){nodes['[data-action="'+id+'"]']=element();nodes['[data-action="'+id+'"]'].dataset.action=id}
const context=new Proxy({},{get:()=>()=>{}});
const canvas=nodes.canvas={...element(),getContext:()=>context,getBoundingClientRect:()=>({width:800,height:530,left:0,top:0}),setPointerCapture(){}};
const mount={...element(),querySelector:s=>nodes[s],querySelectorAll:()=>actions.map(a=>nodes['[data-action="'+a+'"]'])};
const listeners={};const sandbox={A0ScienceBuilderPath:require('./a0-science-builder-path.js'),A0FamilyAtlasBridge:bridge,A0FamilySpatialBodies:require('./a0-family-spatial-bodies.js'),document:{getElementById:()=>mount,createElement:element,addEventListener:(type,fn)=>listeners[type]=fn},location:{hash:''},addEventListener(){},devicePixelRatio:1};
sandbox.window=sandbox;vm.runInNewContext(fs.readFileSync(__dirname+'/a0-family-spatial-navigation.js','utf8'),sandbox);
ok(mount.children.length===4,'local role guide, body readout, Return and relation panel');
ok(nodes['[data-readout="families"]'].children.length===7,'seven keyboard-accessible Family controls');
nodes['[data-readout="families"]'].children[1].onclick();
ok(bridge.snapshot().family==='F2','spatial to existing Atlas selection');
bridge.apply({family:'F6',mode:'family',stop:'theta'});listeners['a0:family-atlas-selection']();
ok(sandbox.A0FamilySpatialReader.snapshot().family==='F6','Atlas to spatial selection');
nodes['[data-action="previous"]'].onclick();
ok(bridge.snapshot().family==='F2','return restores actual Atlas selection');
nodes['[data-action="next"]'].onclick();
ok(bridge.snapshot().family==='F6','forward restores actual Atlas selection');
nodes['[data-action="back"]'].onclick();
ok(sandbox.A0FamilySpatialReader.snapshot().camera.yaw>2,'backside changes camera');
ok(bridge.snapshot().family==='F6','backside preserves Family');
const before=sandbox.A0FamilySpatialReader.snapshot().camera.yaw;
canvas.onkeydown({key:'ArrowRight',preventDefault(){}});
ok(sandbox.A0FamilySpatialReader.snapshot().camera.yaw>before,'keyboard orbit');
nodes['[data-control="layout"]'].onchange({target:{value:'polar'}});
ok(sandbox.A0FamilySpatialReader.snapshot().layout==='polar','layout change');
ok(bridge.snapshot().family==='F6','layout preserves selection');
nodes['[data-action="home"]'].onclick();
ok(bridge.snapshot().family===null&&bridge.snapshot().elevatorFamily==='F1','home restores original selection and elevator cursor');
ok(mount.children[2].textContent.includes('RETURN PASS'),'F7 checks exact reader Return');
const bodyApi=require('./a0-family-spatial-bodies.js');
for(const [kind,counts] of [['bluebody',[48,72,26]],['dodeca',[20,30,12]]]){
  const body=bodyApi.build(kind);
  ok(JSON.stringify([body.vertices.length,body.edges.length,body.faces.length])===JSON.stringify(counts),'source body counts '+kind);
  ok(Math.abs(Math.max(...body.vertices.map(p=>Math.hypot(...p)))-1.25)<1e-12,'uniform display normalization '+kind);
  ok(body.faces.every(f=>f.color&&f.vertices.every(i=>body.vertices[i])),'source faces and palette '+kind);
  nodes['[data-readout="families"]'].children[3].onclick();
  const beforeBody=sandbox.A0FamilySpatialReader.snapshot();
  nodes['[data-control="layout"]'].onchange({target:{value:kind}});
  const afterBody=sandbox.A0FamilySpatialReader.snapshot();
  ok(afterBody.family===beforeBody.family&&afterBody.stop===beforeBody.stop&&afterBody.mode===beforeBody.mode,'body switch preserves address '+kind);
  nodes['[data-action="previous"]'].onclick();
  ok(sandbox.A0FamilySpatialReader.snapshot().layout===beforeBody.layout,'body layout Return '+kind);
}
const dodeca=bodyApi.build('dodeca'),native=require('./assets/a0-blue-body-dodeca-countershot-v1.js').buildDodecahedron();
for(const [a,b] of native.oppositePairs)ok(dodeca.faces[a].color!==dodeca.faces[b].color,'opposite faces keep red/green distinction');
for(const id of Object.keys(families))for(const from of Object.keys(stops))for(const to of Object.keys(stops)){
  const route=api.readingJourney(id,from,to);
  if(from===to){ok(route===null,'no self journey');continue}
  ok(route.family===id&&route.from===from&&route.to===to,'journey preserves identity');
  ok(route.canonicalRelation===false&&route.kind==='READING_POSITION_TRANSITION','view relation is not canonical Family edge');
  ok(route.path[0]===from&&route.path.at(-1)===to,'ordered journey endpoints');
  ok(route.path.length===Math.abs(Object.keys(stops).indexOf(from)-Object.keys(stops).indexOf(to))+1,'visits adjacent stops');
}
ok(api.readingJourney('F8','zeta','beta')===null,'unknown Family rejected');
ok(api.readingJourney('F4','unknown','beta')===null,'unknown reading position rejected');
ok(api.segmentDistance(3,4,{x:0,y:0},{x:10,y:0})===4,'shaft hit distance');
ok(api.segmentDistance(12,0,{x:0,y:0},{x:10,y:0})===2,'shaft hit clamped to endpoints');
nodes['[data-readout="families"]'].children[3].onclick();
const origin=JSON.stringify(sandbox.A0FamilySpatialReader.snapshot());
const target=bridge.snapshot().stop==='beta'?'zeta':'beta';
ok(sandbox.A0FamilySpatialReader.travel(target),'valid journey accepted');
ok(bridge.snapshot().family==='F4'&&bridge.snapshot().stop===target,'reduced-motion arrival commits same Family');
const relationPanel=mount.children[3];
ok(relationPanel.children[1].textContent.includes('ANGEKOMMEN'),'arrival receipt');
relationPanel.children[2].onclick();
ok(JSON.stringify(sandbox.A0FamilySpatialReader.snapshot())===origin,'journey Return restores full source reader state');
ok(relationPanel.children[1].textContent.includes('RETURN PASS'),'journey Return receipt');
ok(!sandbox.A0FamilySpatialReader.travel('invalid'),'invalid journey cannot mutate state');
// Animation path with deterministic frame times, cancellation and external selection.
for(const node of Object.values(nodes))node.children=[];mount.children=[];
const frames=[],animated={...sandbox,matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>frames.push(fn)};animated.window=animated;
vm.runInNewContext(fs.readFileSync(__dirname+'/a0-family-spatial-navigation.js','utf8'),animated);
const rider=animated.A0FamilySpatialReader,animatedOrigin=bridge.snapshot(),destination=animatedOrigin.stop==='beta'?'zeta':'beta';
ok(rider.travel(destination),'animated journey begins');
ok(bridge.snapshot().stop===animatedOrigin.stop,'destination is not committed before arrival');
frames.shift()(0);frames.shift()(325);
ok(rider.journey().progress>0&&rider.journey().progress<1,'cabin traverses intermediate position');
listeners['a0:family-atlas-selection']();
ok(rider.journey()!==null,'unchanged queued Atlas notification does not cancel travel');
frames.shift()(1500);
ok(rider.journey()===null&&bridge.snapshot().stop===destination,'animation arrival commits destination');
ok(bridge.snapshot().family===animatedOrigin.family,'animated journey preserves Family');
const cancellationOrigin=bridge.snapshot().stop;
rider.travel(cancellationOrigin==='beta'?'zeta':'beta');frames.shift()(0);mount.children[3].children[3].onclick();
frames.shift()(1500);
ok(bridge.snapshot().stop===cancellationOrigin&&rider.journey()===null,'explicit cancellation never commits destination');
rider.travel(cancellationOrigin==='beta'?'zeta':'beta');frames.shift()(0);
bridge.apply({family:'F6',mode:'family',stop:'theta'});listeners['a0:family-atlas-selection']();frames.shift()(1500);
ok(bridge.snapshot().family==='F6'&&bridge.snapshot().stop==='theta'&&rider.journey()===null,'external selection cancels pending travel');
rider.travel('beta');frames.shift()(0);animated.document.hidden=true;listeners.visibilitychange();frames.shift()(1500);
ok(bridge.snapshot().stop==='theta'&&rider.journey()===null,'hidden document cancels rather than moving unattended');
animated.document.hidden=false;nodes['[data-readout="families"]'].children[3].onclick();
const clickState=rider.snapshot(),a=api.project(api.position(families.F4,3,0,clickState.layout),clickState.camera,800,530),b=api.project(api.position(families.F4,3,1,clickState.layout),clickState.camera,800,530);
const pointer={clientX:(a.x+b.x)/2,clientY:(a.y+b.y)/2,pointerId:1};
canvas.onpointerdown(pointer);canvas.onpointerup(pointer);
ok(rider.journey()?.route.family==='F4'&&rider.journey()?.route.to==='zeta','clicking the visible white connector chooses a reading transition');
rider.cancelTravel();
for(const file of ['A0_SCIENCE.html','A0_RESEARCH_DESK.html'])ok(fs.readFileSync(__dirname+'/'+file,'utf8').includes('A0_FAMILY_CONNECTION_ATLAS.html#spatial-navigation'),'Science entry link '+file);
const resumeOrigin=sandbox.A0FamilySpatialReader.snapshot();
ok(sandbox.A0FamilySpatialReader.resume(resumeOrigin),'explicit resume accepts existing source selection');
ok(JSON.stringify(sandbox.A0FamilySpatialReader.snapshot())===JSON.stringify(resumeOrigin),'resume retains whole reader position');
for(const patch of [{family:'F8'},{route:'not-an-existing-route'},{camera:{...resumeOrigin.camera,zoom:Infinity}}])ok(!sandbox.A0FamilySpatialReader.resume({...resumeOrigin,...patch}),'invalid resume rejected');
const savedPosition={...resumeOrigin,family:'F2',elevatorFamily:'F2',mode:'family',layout:'plate',camera:{yaw:.65,pitch:.2,zoom:1.2}};
ok(sandbox.A0FamilySpatialReader.resume(savedPosition),'nondefault source position accepted');
sandbox.A0FamilySpatialReader.resume({...savedPosition,family:'F3',layout:'polar'});
ok(sandbox.A0FamilySpatialReader.resume(savedPosition)&&JSON.stringify(sandbox.A0FamilySpatialReader.snapshot())===JSON.stringify(savedPosition),'reader excursion restores Family, layout and camera exactly');
console.log(JSON.stringify({status:'PASS',checks,scope:'projection, snapshots, actual bridge and controller in simulated DOM; no browser pixel or Human utility QA'},null,2));
