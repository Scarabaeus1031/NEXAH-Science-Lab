'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('./a0-fold-lag-lens.js'),W=require('./a0-root7-wing-sequence.js');
let checks=0;const ok=(x,m)=>{checks++;assert.ok(x,m);},near=(a,b)=>ok(Math.abs(a-b)<1e-9,`${a} ≈ ${b}`),dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const binding=JSON.parse(fs.readFileSync(__dirname+'/assets/a0-fold-lag-lens-v1.json','utf8')),crypto=require('node:crypto');
for(const file of binding.implementationFiles)ok(crypto.createHash('sha256').update(fs.readFileSync(__dirname+'/'+file.path)).digest('hex')===file.sha256,'5B implementation pin '+file.path);
for(const value of Object.values(binding.authority))ok(value===false,'no authority promotion');
for(const mode of ['target','increment'])for(const mirror of ['none','horizontal','double'])for(const lag of [0,3,7])for(let slice=0;slice<29;slice++){
 const o={mode,mirror,lag},r=M.snapshot(slice,o);ok(r.facets.length===4&&r.slices===29);ok(!r.sourceMutation&&!r.physicalTimeClaim&&!r.connectedOrigamiClaim);ok(r.referenceCrossFixed);
 near(r.reflectionDeterminant,mirror==='horizontal'?-1:1);
 r.facets.forEach((f,i)=>{near(f.localSlice,i===3?Math.max(0,slice-lag):slice);for(let a=0;a<5;a++)for(let b=a+1;b<5;b++)near(dist(f.points[a],f.points[b]),dist(M.BASE[a],M.BASE[b]));ok(f.points.flat().every(Number.isFinite));});
 if(slice%7===0)near(r.turn,(mode==='target'?[0,90,45,33,7]:[0,90,135,168,175])[slice/7]);
 const replay=M.snapshot(JSON.parse(JSON.stringify(r)).slice,JSON.parse(JSON.stringify(r)).options);ok(JSON.stringify(replay)===JSON.stringify(r),'deterministic replay');
}
for(const slice of [-1,29,NaN,.5,Infinity]){assert.throws(()=>M.snapshot(slice));checks++;}
for(const o of [{mode:'bad'},{mirror:'bad'},{lag:-1},{lag:8},{lag:.1},{lag:NaN}]){assert.throws(()=>M.snapshot(0,o));checks++;}
const q=W.pose([1,0,0],0,18),p=W.pose([1,0,0],90,18);near(p[0],-q[1]);near(p[1],q[0]);
for(const mode of ['target','increment'])for(const slice of [0,7,14,21,28]){const svg=M.drawing(M.snapshot(slice,{mode}));ok(!/NaN|undefined|Infinity/.test(svg),'finite SVG');ok((svg.match(/<ellipse/g)||[]).length===29,'29 displayed sequence planes');ok(svg.includes('WEISSES KREUZ FEST'));}
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),nodes=new Map();
for(const id of ['foldLagSvg','foldLagMode','foldLagDelay','foldLagMirror','foldLagSlice','foldLagFollow','foldLagPlay','foldLagNext','foldLagReset','foldLagExport','foldLagReadout']){ok(html.includes(`id="${id}"`),'host control '+id);nodes.set(id,{value:({foldLagMode:'target',foldLagDelay:'3',foldLagMirror:'none',foldLagSlice:'7'})[id],checked:false,disabled:false,events:{},attrs:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,f){this.events[k]=f;}});}
let exported=null,revoked=false;const doc={getElementById:id=>nodes.get(id),createElement:()=>({click(){ok(this.download==='a0-5b-fold-lag.json');}})},scope=vm.createContext({document:doc,window:{},URL:{createObjectURL(blob){exported=blob.parts[0];return'blob:test';},revokeObjectURL(){revoked=true;}},Blob:class{constructor(parts){this.parts=parts;}}});
// Browser branch in a VM: actual mount and actual event handlers, including export.
const browser={A0WingSequence:W,URL:scope.URL,Blob:scope.Blob};vm.createContext(browser);vm.runInContext(fs.readFileSync(__dirname+'/a0-fold-lag-lens.js','utf8'),browser);
let tickPlayer=null,intervalMs=null,interlocks=0;
const visibility={},clock={setInterval(fn,ms){ok(tickPlayer===null,'one view timer');tickPlayer=fn;intervalMs=ms;return 1;},clearInterval(){tickPlayer=null;}};
doc.addEventListener=(event,fn)=>{visibility[event]=fn;};
const view=browser.A0FoldLagLens.mount(doc,clock);view.beforePlay=()=>{interlocks++;};ok(nodes.get('foldLagSvg').innerHTML.includes('<polygon'));
nodes.get('foldLagPlay').events.click();near(view.render().slice,0);near(intervalMs,400);ok(interlocks===1);ok(nodes.get('foldLagPlay').attrs['aria-pressed']==='true');
for(let i=0;i<4;i++)tickPlayer();near(view.render().slice,4);
nodes.get('foldLagPlay').events.click();ok(tickPlayer===null);near(view.render().slice,4);
nodes.get('foldLagPlay').events.click();near(view.render().slice,4);
for(let i=0;i<24;i++)tickPlayer();near(view.render().slice,28);ok(tickPlayer===null,'automatic stop at final slice');
nodes.get('foldLagPlay').events.click();near(view.render().slice,0);ok(tickPlayer!==null,'restart at zero');
nodes.get('foldLagSlice').value='12';nodes.get('foldLagSlice').events.input();ok(tickPlayer===null,'scrub pauses');
nodes.get('foldLagPlay').events.click();near(view.render().slice,12);
doc.hidden=true;visibility.visibilitychange();ok(tickPlayer===null,'hidden document pauses');doc.hidden=false;
nodes.get('foldLagPlay').events.click();nodes.get('foldLagFollow').checked=true;nodes.get('foldLagFollow').events.change();ok(tickPlayer===null,'Q4 follow pauses view player');
nodes.get('foldLagFollow').checked=true;nodes.get('foldLagFollow').events.change();ok(nodes.get('foldLagSlice').disabled);
for(let tick=0;tick<16;tick++){const r=view.sync(tick);near(r.slice,Math.round(tick*28/15));}
nodes.get('foldLagNext').events.click();ok(!nodes.get('foldLagFollow').checked&&!nodes.get('foldLagSlice').disabled);near(view.render().slice,28);
nodes.get('foldLagReset').events.click();near(view.render().slice,0);
nodes.get('foldLagMode').value='increment';nodes.get('foldLagSlice').value='28';nodes.get('foldLagMode').events.input();near(view.render().turn,175);
nodes.get('foldLagExport').events.click();const payload=JSON.parse(exported);ok(payload.sequence.length===29&&revoked);near(payload.clock.tick,15);near(payload.sequence[28].turn,175);
for(const item of payload.sequence)ok(JSON.stringify(M.snapshot(item.slice,item.options))===JSON.stringify(item),'exported sequence replay');
nodes.get('foldLagDelay').value='7';nodes.get('foldLagDelay').events.input();near(view.render().facets[3].localSlice,21);
nodes.get('foldLagMirror').value='horizontal';nodes.get('foldLagMirror').events.input();near(view.render().reflectionDeterminant,-1);
ok(html.includes('if(window.A0FoldLagView)window.A0FoldLagView.sync(rootEngineState.tick);'),'actual host read-only Q4 hook');
ok(!/fetch\(|postMessage/.test(fs.readFileSync(__dirname+'/a0-fold-lag-lens.js','utf8')),'no external channel');
let layerPauses=0,rootRequest=null;const interlockScope={window:{A0FoldLagView:{},A0LayeredSceneView:{pause(){layerPauses++;}}},setRootEngineRunning:running=>{rootRequest=running;}};
vm.createContext(interlockScope);vm.runInContext(html.split('\n').find(line=>line.includes('if(window.A0FoldLagView)window.A0FoldLagView.beforePlay=')),interlockScope);interlockScope.window.A0FoldLagView.beforePlay();
ok(rootRequest===false,'actual view playback hook pauses source clock');ok(layerPauses===1,'actual view playback hook pauses layered player');
ok(html.includes('if(running&&window.A0FoldLagView)window.A0FoldLagView.pause()'),'source playback pauses view clock');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);ok(ids.length===new Set(ids).size,'unique host IDs');
console.log(JSON.stringify({status:'PASS',checks,slices:29,rigidIndependentWings:4,browserAcceptance:false,scientificClaimPromotion:false}));
