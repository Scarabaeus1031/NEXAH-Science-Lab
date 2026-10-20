'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
let checks=0;const ok=(v,m)=>{checks++;assert.ok(v,m);},eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
const manifest=JSON.parse(fs.readFileSync(__dirname+'/assets/a0-face-integration-package-v1.json','utf8')),html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
eq(manifest.executionOrder,[1,2,3,4,5]);eq(manifest.tasks.map(t=>t.point),[1,2,3,4,5]);
eq(manifest.milestones.map(m=>m.status),['ENGINEERING_PASS','ENGINEERING_PASS','ENGINEERING_PASS_VERSIONED_REPLAY']);
ok(manifest.tasks.find(t=>t.point===4).status.includes('REPLAY'),'point 4 includes versioned replay');
for(const f of ['a0-native-face-bridge.js','a0-dodeca-source-runtime.js','a0-ocb-record-replay.js','a0-ocb-record-replay-ui.js'])ok(fs.existsSync(path.resolve(__dirname,f)),'native/replay implementation '+f);
for(const t of manifest.tasks){ok(t.acceptance.length>=3,'explicit acceptance');ok(!/COMPLETE|ACCEPTED/.test(t.status),'no false completion');for(const p of t.dependsOn)ok(p<t.point,'acyclic implementation order');}
for(const f of ['bench','nativeSource','geometry','ledger'])ok(fs.existsSync(path.resolve(__dirname,manifest.existing[f])),'reused source '+f);
for(const value of Object.values(manifest.authority))eq(value,false);
const ledger=require('./assets/a0-blue-pink-dodeca-cell-return-v1.js');eq(ledger.buildLedger().counts.total_cells,60);
eq(new Set(Array.from({length:60},(_,i)=>ledger.cellAt(i).cell_id)).size,60);
let click=null,out=null;const rootState={tick:3,history:[{toTick:3}]},fold={slice:7,facets:[]},overlay={source:'book',streams:{book:{frames:[{step:3}]},'5b':{frames:[{step:7}]}}};
const scope={document:{},window:{A0Root7Coupling:{snapshot:()=>({sourceTick:rootState.tick,source:'existing'})},A0Root7Sections:{readOptions:()=>({})},A0Root7Book:{readOptions:()=>({})},A0FoldLagView:{snapshot:()=>fold,render:()=>{throw Error('export must not render');}},A0OverlayView:{exportState:()=>overlay,accept:()=>{throw Error('export must not record');}}},C:{VERSION:'test',MASTER_DEMO_PHASES:[],stateCore:s=>s},rootEngineState:rootState,root838Mode:'q4',masterDemoState:{},state:{},edgeState:{},$:()=>({addEventListener(event,fn){click=fn;}}),downloadJson:(name,payload)=>{out={name,payload};}};
vm.createContext(scope);const from=html.indexOf('  function captureFaceIntegrationPackage(){'),to=html.indexOf("  $('masterDemoExport').addEventListener",from);
ok(from>=0&&to>from);vm.runInContext(html.slice(from,to),scope);
const record=scope.captureFaceIntegrationPackage();eq(record.schema,'nexah.a0.integration-package-snapshot/1');eq(record.components.dodecaSource,null);eq(record.status,'LOCAL_COMPONENT_SNAPSHOT_NOT_END_TO_END_RUN');
for(const value of Object.values(record.evidence))eq(value,false);
eq(JSON.parse(JSON.stringify(record.components.foldLag)),fold);eq(JSON.parse(JSON.stringify(record.components.overlay)),overlay);
record.components.rootSpace.history.length=0;eq(rootState.history.length,1);
record.components.overlay.streams.book.frames.length=0;eq(overlay.streams.book.frames.length,1,'detached composite snapshot');
const handler=html.split('\n').find(l=>l.includes("$('masterDemoExport').addEventListener"));vm.runInContext(handler,scope);click();ok(out.payload.integrationPackage);eq(out.name,'a0-orientation-cockpit-run.json');eq(out.payload.integrationPackage.components.foldLag.slice,7);
// Pure read accessors of actual views must exist without triggering a new render.
ok(fs.readFileSync(__dirname+'/a0-fold-lag-lens.js','utf8').includes('snapshot:()=>snapshot(Number'));
ok(fs.readFileSync(__dirname+'/a0-projection-overlay.js','utf8').includes('exportState:()=>'));
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim()){new vm.Script(m[1]);checks++;}
console.log(JSON.stringify({status:'PASS',checks,scope:'Package 1–5 with native source and versioned replay; legacy composite snapshot remains read-only',nativeFaceBinding:true,recordReplay:true,endToEndBrowserAcceptance:false}));
