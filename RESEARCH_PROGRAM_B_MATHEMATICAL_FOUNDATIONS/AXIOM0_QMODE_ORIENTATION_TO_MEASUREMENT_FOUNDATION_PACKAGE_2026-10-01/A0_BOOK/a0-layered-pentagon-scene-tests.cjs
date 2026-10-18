'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),L=require('./a0-layered-pentagon-scene.js'),H=require('./assets/a0-blue-body-dodeca-countershot-v1.js'),O=require('./a0-projection-overlay.js');
let checks=0;const ok=(v,m)=>{checks++;assert.ok(v,m);},eq=(a,b)=>{checks++;assert.deepEqual(a,b);},near=(a,b)=>ok(Math.abs(a-b)<1e-8,a+' ≈ '+b),D=H.buildDodecahedron(),dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const binding=JSON.parse(fs.readFileSync(__dirname+'/assets/a0-layered-pentagon-scene-v1.json','utf8')),crypto=require('node:crypto'),path=require('node:path');
for(const f of [...binding.implementationFiles,...binding.ownerVisuals])eq(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,f.path))).digest('hex'),f.sha256);
for(const v of Object.values(binding.authority))eq(v,false);
for(const mode of ['counter','together'])for(let phase=0;phase<=360;phase+=2){
 const r=L.snapshot(phase,mode);ok(L.validate(r));eq(r.pentagons.length,3);
 for(const p of r.pentagons){near(L.area(p.points),5*Math.sin(2*Math.PI/5)/2);for(let i=0;i<5;i++)near(dist(p.points[i],p.points[(i+1)%5]),2*Math.sin(Math.PI/5));}
 near(L.area(r.pentagons[0].points),L.area(r.intersection)+r.regions.red.reduce((s,p)=>s+L.area(p),0));near(L.area(r.pentagons[1].points),L.area(r.intersection)+r.regions.green.reduce((s,p)=>s+L.area(p),0));
 eq(r.dodeca.faces,JSON.parse(JSON.stringify(D.faces)));eq(r.dodeca.edges,D.edges);eq(r.dodeca.vertices.length,20);eq(r.dodeca.edges.length,30);eq(r.dodeca.faces.length,12);
 const radius=Math.max(...D.vertices.map(p=>Math.hypot(...p)));
 for(const [a,b]of D.edges)near(dist(r.dodeca.vertices[a],r.dodeca.vertices[b]),dist(D.vertices[a],D.vertices[b])*.65/radius);
 const frame=O.frame('stack',r);eq(frame.facets.length,3);eq(frame.scene,JSON.parse(JSON.stringify(r)));eq(frame.cuts,[]);
 if(phase%18===0)for(const amount of [0,1]){const svg=L.drawing(r,{amount});ok(!/NaN|undefined|Infinity/.test(svg));eq((svg.match(/clipPath id=/g)||[]).length,3,'two comparison masks plus nested detail clipping window');ok(svg.includes('negative-space'));eq(L.drawing(JSON.parse(JSON.stringify(r)),{amount}),svg,'JSON drawing replay');}
}
const first=L.snapshot(0),last=L.snapshot(360);eq(first.pentagons,last.pentagons);eq(first.dodeca,last.dodeca);ok(last.poseReturn&&!last.sourceReturn);
eq(first.regions.red.length,5);eq(first.regions.green.length,5);eq(first.intersection.length,10);
const aligned=L.snapshot(7.2);eq(aligned.regions.red.length,0);eq(aligned.regions.green.length,0);eq(aligned.intersection.length,5,'no hardcoded tenfold shape');
for(const [p,m]of [[-1,'counter'],[361,'counter'],[NaN,'counter'],[0,'bad']]){assert.throws(()=>L.snapshot(p,m));checks++;}
for(const settings of [{amount:NaN},{scheme:'bad'},{stackLayers:{a:'yes'}}]){assert.throws(()=>L.drawing(first,settings));checks++;}
const bad=JSON.parse(JSON.stringify(first));bad.dodeca.faces[0].vertices[0]=999;assert.throws(()=>L.validate(bad));checks++;
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),els=new Map();
for(const id of ['layerScenePlay','layerSceneReset','layerScenePhase','layerSceneMotion','layerSceneRepeat','layerSceneStatus','layerSceneZoom','layerSceneFocusOffset','projectionOverlaySource',...Object.keys(L.layerDefaults).map(k=>'layerScene_'+k)]){ok(html.includes('id="'+id+'"'));els.set(id,{value:({layerScenePhase:'0',layerSceneMotion:'counter',layerSceneZoom:'13/8',layerSceneFocusOffset:'0',projectionOverlaySource:'stack'})[id],checked:id.startsWith('layerScene_'),events:{},attrs:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,f){this.events[k]=f;}});}
let interval=null,ms=0,interlock=0,lastRecord=null;const visibility={},doc={getElementById:id=>els.get(id),addEventListener(k,f){visibility[k]=f;}},store=O.createStore(),player=L.mount(doc,r=>{lastRecord=r;store.accept('stack',r);},{setInterval(fn,delay){ok(interval===null,'one scene timer');interval=fn;ms=delay;return 1;},clearInterval(){interval=null;}});
player.beforePlay=()=>{interlock++;};els.get('layerScenePlay').events.click();eq(interlock,1);eq(ms,40);
for(let i=0;i<45;i++)interval();near(lastRecord.phase,90);eq(lastRecord.angles,[270,-144,18]);
els.get('layerScenePlay').events.click();ok(interval===null);els.get('layerScenePlay').events.click();near(lastRecord.phase,90);
for(let i=0;i<135;i++)interval();near(lastRecord.phase,360);ok(interval===null,'automatic end stop');eq(store.read('stack').frames.length,64);eq(store.read('stack').dropped,117);
els.get('layerScenePlay').events.click();near(lastRecord.phase,0);els.get('layerSceneRepeat').checked=true;for(let i=0;i<181;i++)interval();near(lastRecord.phase,0);ok(interval!==null,'explicit repeat');
els.get('layerScenePhase').value='45';els.get('layerScenePhase').events.input();ok(interval===null,'manual phase pauses');near(lastRecord.phase,45);
els.get('layerScenePlay').events.click();doc.hidden=true;visibility.visibilitychange();ok(interval===null,'hidden tab pauses');
const before=JSON.stringify(lastRecord),exported=player.exportState();exported.pose.pentagons.length=0;eq(JSON.stringify(lastRecord),before,'detached player export');
els.get('layerSceneReset').events.click();near(lastRecord.phase,0);
const opts={current:true,shadow:true,echo:true,cuts:true,scheme:'redblue',amount:1,stackLayers:L.readLayers(doc)};
const state=store.read('stack');ok(O.drawing(state,opts).includes('DREI PENTAGONE'));
for(const key of Object.keys(L.layerDefaults)){const svg=L.drawing(first,{stackLayers:{[key]:false}});ok(!/NaN|undefined/.test(svg));}
eq(store.read('book').frames.length,0);eq(store.read('5b').frames.length,0,'source streams are not mixed');
const svg=L.drawing(first),ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);eq(new Set(ids).size,ids.length,'unique mask/clip IDs');
// Actual overlay DOM path for the new source, layer switch and shared export.
for(const suffix of ['Palette','Grey','Current','Shadow','Echo','Cuts','Record','Clear','Export','Svg','Status'])els.set('projectionOverlay'+suffix,{value:({Palette:'redblue',Grey:'1'})[suffix],checked:true,events:{},addEventListener(k,f){this.events[k]=f;}});
const overlayView=O.mount(doc);overlayView.accept('stack',first);ok(els.get('projectionOverlaySvg').innerHTML.includes('DREI PENTAGONE'),'stack reaches existing overlay DOM');
els.get('layerScene_c').checked=false;els.get('layerScene_c').events.input();ok(!els.get('projectionOverlaySvg').innerHTML.includes('data-stack="P-C"'),'individual layer toggle');
const exportedOverlay=overlayView.exportState();eq(exportedOverlay.source,'stack');eq(exportedOverlay.streams.stack.current.scene.phase,0);
exportedOverlay.streams.stack.frames.length=0;eq(overlayView.store.read('stack').frames.length,1,'detached overlay stack export');
const exportScope={window:{A0LayeredSceneView:player,A0OverlayView:overlayView,A0Root7Coupling:{snapshot:()=>({})},A0Root7Sections:{readOptions:()=>({})},A0Root7Book:{readOptions:()=>({})}},rootEngineState:{tick:0},root838Mode:'q4',C:{},document:doc};
vm.createContext(exportScope);const start=html.indexOf('  function captureFaceIntegrationPackage(){'),end=html.indexOf("  $('masterDemoExport').addEventListener",start);vm.runInContext(html.slice(start,end),exportScope);
const shared=exportScope.captureFaceIntegrationPackage();eq(shared.components.layeredScene.pose.phase,0);eq(shared.components.overlay.streams.stack.current.scene.phase,0);eq(shared.components.dodecaSource,null);ok(!shared.evidence.nativeFaceBinding,'shared record does not claim native control');
ok(html.includes("window.A0LayeredSceneView.beforePlay=()=>{pauseBenchAutomation();window.A0FoldLagView?.pause();}"));ok(html.includes("if(running&&window.A0LayeredSceneView)window.A0LayeredSceneView.pause()"));ok(html.includes("layeredScene:window.A0LayeredSceneView?.exportState()??null"));
// Nested lens is a coordinate transform of the SAME record, not another player.
for(const ratio of Object.keys(L.zoomRatios))for(const offset of [0,.25,.5,1])for(let phase=0;phase<=360;phase+=10){
 const r=L.snapshot(phase,'counter',{ratio,offset}),l=r.nestedLens;ok(L.validate(r));near(l.magnification,L.zoomRatios[ratio]);
 const [fx,fy]=l.focus,cx=250+120*fx,cy=230-120*fy,z=120*l.magnification;
 // q = focus maps to the center; differences to arbitrary q magnify by exactly z/120.
 near(cx-z*fx+z*fx,cx);near(cy+z*fy-z*fy,cy);
 for(const q of r.pentagons[0].points){near((cx-z*fx+z*q[0])-cx,z*(q[0]-fx));near((cy+z*fy-z*q[1])-cy,-z*(q[1]-fy));}
 ok(Math.hypot(fx,fy)+l.radius<1.64,'small lens remains inside large reference lens');
 const svg=L.drawing(r,{},[L.snapshot(Math.max(0,phase-10))]);
 ok(svg.includes('stack-nested'));ok(svg.includes('data-stack="focus-trail"'));
 eq(L.drawing(JSON.parse(JSON.stringify(r))),L.drawing(r),'nested JSON replay');
}
for(const view of [{ratio:'41/13'},{ratio:'bad'},{offset:-.1},{offset:1.01},{offset:NaN}]){assert.throws(()=>L.snapshot(0,'counter',view));checks++;}
const tampered=L.snapshot();tampered.nestedLens.focus[0]=10;assert.throws(()=>L.validate(tampered));checks++;
const without=L.drawing(first,{stackLayers:{nestedLens:false}});ok(!without.includes('stack-nested'),'nested detail switch');
els.get('layerScenePlay').events.click();ok(interval!==null);
els.get('layerSceneZoom').value='21/13';els.get('layerSceneZoom').events.input();ok(interval===null,'zoom edit pauses shared player');near(lastRecord.nestedLens.magnification,21/13);
els.get('layerSceneFocusOffset').value='.25';els.get('layerSceneFocusOffset').events.input();near(lastRecord.nestedLens.offset,.25);
const saved=player.exportState();saved.pose.nestedLens.focus[0]=999;ok(player.exportState().pose.nestedLens.focus[0]!==999,'detached nested export');
const nestedFrame=O.frame('stack',lastRecord);eq(nestedFrame.scene.nestedLens,lastRecord.nestedLens,'overlay retains exact lens settings');
ok(html.includes('41 → F → 13'));ok(html.includes('11 Winds'));ok(html.includes('29+41+13=83'));
console.log(JSON.stringify({status:'PASS',checks,sourceGeometry:'existing H3 geometry, not native 60-face runtime',browserAcceptance:false,scientificClaimPromotion:false}));
