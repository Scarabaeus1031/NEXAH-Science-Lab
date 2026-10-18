'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const base=__dirname,read=n=>fs.readFileSync(path.resolve(base,n),'utf8');
const sha=n=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(base,n))).digest('hex');
let checks=0;const ok=(condition,message)=>{checks++;assert.ok(condition,message);};
const manifest=JSON.parse(read('assets/a0-integration-crosswalk-v1.json'));
const bench=read('A0_ORIENTATION_CONTROLLER_BENCH.html');
const section=bench.slice(bench.indexOf('  <section class="panel" id="integrationCrosswalk"'),bench.indexOf('  <details class="panel" id="pentagonWorkbench"'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function verify(m,html){
 assert.equal(m.entries.length,26);
 assert.equal(new Set(m.entries.map(e=>e.key)).size,26);
 for(const k of ['newCanonicalIdentities','newGraphRelations','researchExecution','evidencePromotion','publication'])assert.equal(m.authority[k],false);
 assert.equal(m.nextEngineeringGate.implemented,false);assert.equal(m.nextEngineeringGate.browserAccepted,false);
 assert.ok(!/<script\b|<iframe\b|<button\b|<canvas\b/i.test(html));
 for(const e of m.entries){
   assert.ok(html.includes('data-integration-key="'+e.key+'"'));
   for(const value of [e.existing,e.boundary,e.gap])assert.ok(html.includes(escape(value)),e.key+' visible status');
   for(const field of ['primary','evidence'])assert.ok(html.includes('href="'+escape(e[field])+'"'));
   assert.ok(Array.isArray(e.a0DirectInboundBefore));
   assert.equal(e.masterConnection,e.key==='pent'?'BOUNDED_UI_BROWSER_PASS':'NO_CONFIRMED_OCB_STATE_CONTRACT');
 }
 for(const source of [...m.entries.flatMap(e=>e.sources),...m.supportingSources,...m.unchangedRuntimeGuards]){
   assert.ok(fs.existsSync(path.resolve(base,source.path)),source.path);
   assert.equal(sha(source.path),source.sha256,source.path+' unchanged');
 }
}
verify(manifest,section);ok(true,'26 rows, source hashes, unchanged runtimes and authority');
const registry=JSON.parse(read('../../../SCIENCE_LAB/NAVIGATION/HTML_ARTIFACT_REGISTRY_V1_2026-10-06.json')).artifacts;
for(const e of manifest.entries){
 ok(section.includes(escape(e.title)),e.key+' title');
 if(e.existingArtifactId)ok(registry.some(r=>r.artifact_id===e.existingArtifactId&&path.resolve(base,'../../../',r.path)===path.resolve(base,e.primary.split('#')[0])),e.key+' reused registry identity');
 for(const file of e.a0DirectInboundBefore)ok(fs.existsSync(path.resolve(base,file)),e.key+' baseline locator');
}
for(const match of section.matchAll(/href="([^"]+)"/g)){
 const u=new URL(match[1].replaceAll('&amp;','&'),'file://'+path.join(base,'A0_ORIENTATION_CONTROLLER_BENCH.html'));
 const target=decodeURIComponent(u.pathname);ok(fs.existsSync(target),'link '+match[1]);
 if(u.hash){
   const navigatorAtlas=target===path.resolve(base,'../../../SCIENCE_LAB/NAVIGATION/APP/index.html')&&u.hash==='#atlas';
   ok(navigatorAtlas?read('../../../SCIENCE_LAB/NAVIGATION/APP/app.js').includes('case "atlas": renderAtlas();'):fs.readFileSync(target,'utf8').includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),'anchor / authored route '+match[1]);
 }
}
const cases='../../../SCIENCE_LAB/CASE_STUDIES/';
const life03=read(cases+'NEXAH_LIFE_E8_DUAL_CLOCK_LIFE03_2026-10-07/life-e8-engine.js');
ok(life03.includes('require("../NEXAH_LIFE_ORBIT_SCALE_LAB_V2_2026-10-07/scale-engine.js")'),'actual engine reuse');
ok(life03.includes('const life=Life.createSession(size,pattern)'),'source creates its own session');
ok(life03.includes('function tickDual(workbench){Life.advance(workbench.life);'),'existing product clock');
ok(life03.includes('function tickObserver(workbench)'),'existing observer adapter');
ok(life03.includes('function projectionRecord(previous,current)'),'existing projection');
const suite=read('assets/a0-axial-carrier-adapter-v1.js');
ok(suite.includes('projection_only:true'),'suite explicitly exports projection-only');
ok(suite.includes('const raw=a.point(i,l)'),'suite computes declared point functions');
for(const key of ['foundation','ncs','life','domains','ieee','tessarec'])ok(suite.includes(key+':make('),'existing suite lane '+key);
ok(!/postMessage|BroadcastChannel|fetch\(/.test(suite),'no source record bus in current suite');
ok(manifest.entries.find(e=>e.key==='suite').a0DirectInboundBefore.includes('A0_RESEARCH_DESK.html'),'suite already had Desk entry');
ok(manifest.entries.find(e=>e.key==='scale').a0DirectInboundBefore.length>0,'Scale not portrayed as absent from all A0');
ok(section.includes('Null heißt nicht'),'zero direct links is not absence');
ok(section.includes('noch nicht implementiert oder browserabgenommen'),'no invented live adapter acceptance');
ok(section.includes('PRIMARY GAIN PASS / GATE SPECIFICITY FAIL / RESOLUTION AUDIT PASS'),'CA08 mixed status');
ok(section.includes('COVERAGE GATE FAIL / PRIMARY RESULT UNKNOWN'),'unknown remains unknown');
ok(section.includes('CALIBRATION_PASS_VIEW_NONINVARIANT')&&section.includes('TRANSFER_PASS_VIEW_NONINVARIANT'),'later results retained');
ok(section.includes('FAIL 0/4')&&section.includes('1/5 Gates'),'earlier negatives retained');
ok(section.includes('CROSS_VIEW_ORDER_NOT_PRESERVED')&&section.includes('R2 GRAPH GRID CONTRACT PASS'),'IEEE contracts separate');
ok(read('a0-context-navigation.js').includes('A0_ORIENTATION_CONTROLLER_BENCH.html#integrationCrosswalk'),'Science menu entry');
ok(read('A0_RESEARCH_DESK.html').includes('href="A0_ORIENTATION_CONTROLLER_BENCH.html"'),'Desk reaches existing Bench');
ok(read('A0_BUILDER_LOG.html').includes('id="integration-crosswalk"'),'handoff');
for(const name of ['A0_ORIENTATION_CONTROLLER_BENCH.html','A0_BUILDER_LOG.html']){
 const ids=[...read(name).matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);ok(ids.length===new Set(ids).size,'unique anchors '+name);
}
const mutations=[
 m=>{m.authority.evidencePromotion=true;},
 m=>{m.entries.pop();},
 m=>{m.entries[1].key=m.entries[0].key;},
 m=>{m.entries[0].sources[0].sha256='0'.repeat(64);},
 m=>{m.unchangedRuntimeGuards[0].sha256='0'.repeat(64);},
 m=>{m.entries[0].boundary='invented universal PASS';},
 m=>{m.entries[0].masterConnection='LIVE_SHARED_STATE';},
 m=>{m.nextEngineeringGate.implemented=true;},
 m=>{m.nextEngineeringGate.browserAccepted=true;}
];
for(const mutate of mutations){const bad=structuredClone(manifest);mutate(bad);checks++;assert.throws(()=>verify(bad,section));}
for(const bad of [section.replace('data-integration-key="ca08"','data-integration-key="missing"'),section+'<script>newClock()</script>']){checks++;assert.throws(()=>verify(manifest,bad));}
console.log(JSON.stringify({status:'PASS',checks,entries:manifest.entries.length,sourceBindings:manifest.entries.reduce((n,e)=>n+e.sources.length,0)+manifest.supportingSources.length,unchangedRuntimeGuards:manifest.unchangedRuntimeGuards.length,browserAcceptance:false,researchRuns:0}));
