'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),a=require('node:assert/strict');
const read=n=>fs.readFileSync(path.resolve(__dirname,n),'utf8'),hash=n=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,n))).digest('hex');
let checks=0;const ok=(v,m)=>{checks++;a.ok(v,m);};
const manifest=JSON.parse(read('assets/a0-orientation-role-map-v1.json')),bench=read('A0_ORIENTATION_CONTROLLER_BENCH.html');
// Stop at the next independent package; the role map itself stays documentary.
const section=bench.slice(bench.indexOf('<details class="panel" id="orientationRoleMap"'),bench.indexOf('<details class="panel" id="wiringPackage"'));
ok(section.length>5000,'real connection map present');ok(!/<script|<iframe|<button/.test(section),'map does not invent runtime controls');
ok(manifest.roles.map(r=>r.key).join(',')==='rainbow,scarabaeus,cikada,titan');
for(const r of manifest.roles){ok(section.includes('data-role-card="'+r.key+'"'));ok(!r.masterAdapter);ok(r.next.length>40);}
for(const source of manifest.sources){ok(fs.existsSync(path.resolve(__dirname,source.path)),source.path);ok(hash(source.path)===source.sha256,'source bytes '+source.path);}
for(const image of manifest.ownerVisuals){ok(hash(image.path)===image.sha256,'owner visual '+image.role);ok(image.copiedIntoRepository===false);}
for(const m of section.matchAll(/href="([^"]+)"/g)){
 const url=new URL(m[1],'file://'+__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html'),file=decodeURIComponent(url.pathname);
 ok(fs.existsSync(file),'target '+m[1]);if(url.hash)ok(fs.readFileSync(file,'utf8').includes('id="'+url.hash.slice(1)+'"'),'anchor '+m[1]);
}
for(const name of ['A0_LIVING_BLUEPRINT.html','A0_RAINBOW_PURPLE_RAIN.html','a0-context-navigation.js'])ok(read(name).includes('A0_ORIENTATION_CONTROLLER_BENCH.html#orientationRoleMap'),'discoverability '+name);
const cases='../../../SCIENCE_LAB/CASE_STUDIES/';
ok(read(cases+'CIKADA_3301_MANDELBROT_OPERATOR_RETURN_TEST/FINAL_DECISION.md').includes('PARTIAL_IDENTIFICATION_RASTER_LOSS_BOUND'));
ok(read(cases+'CIKADA_3301_CONCAVE_CROWN_CONVEX_PROJECTION_LAB/FINAL_DECISION.md').includes('C_STRUCTURED_GEOMETRY_REQUIRED'));
ok(read(cases+'CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/FINAL_INTAKE_DECISION.md').includes('HOLD_CONFLICTING_DEFINITIONS'));
ok(section.includes('NO_CANDIDATE_ADMITTED'));ok(section.includes('separatem Implementierungsgate'));ok(section.includes('keine ausgeführte Maschinenpipeline'));
for(const value of Object.values(manifest.authority))ok(value===false,'no authority promotion');
ok(!manifest.runtime.newClock&&!manifest.runtime.newController&&!manifest.runtime.newSimulation&&manifest.runtime.pentPassUnchanged);
for(const n of ['A0_ORIENTATION_CONTROLLER_BENCH.html','A0_LIVING_BLUEPRINT.html','A0_RAINBOW_PURPLE_RAIN.html']){
 const ids=[...read(n).matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);ok(ids.length===new Set(ids).size,'unique IDs '+n);
}
console.log('PASS '+checks+' role-map, source/visual hash, closed-result boundary, link and non-runtime checks. No research replay or live-browser claim.');
