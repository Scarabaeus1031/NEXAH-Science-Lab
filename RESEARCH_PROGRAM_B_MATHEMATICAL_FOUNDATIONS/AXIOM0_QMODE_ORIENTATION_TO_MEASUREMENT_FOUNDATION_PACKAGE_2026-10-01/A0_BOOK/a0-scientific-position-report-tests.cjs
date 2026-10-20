const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const book=__dirname,html=fs.readFileSync(path.join(book,'A0_SCIENTIFIC_POSITION_REPORT.html'),'utf8');let checks=0;
const ok=(v,label)=>{assert(v,label);checks++;};
for(const id of ['verdict','currentness-20261019','engineering-currentness','currentness','results','novelty','next','sources'])ok((html.match(new RegExp('id="'+id+'"','g'))||[]).length===1,'unique section '+id);
ok(html.indexOf('id="verdict"')<html.indexOf('id="currentness-20261019"'),'mission first');
ok(html.indexOf('id="currentness-20261019"')<html.indexOf('id="engineering-currentness"'),'new status before historical snapshot');
for(const text of ['Quelle → Transformation → Sicht → Prüfung → Return','PASS_BOUNDED','R2_LOCAL_REPLAY','135 typisierte Additionen, 140 Adressen und 210 Relationskanten','X20→Q106','Numbers→Winkel ist weiterhin nicht implementiert','Öffentliche Testversion, keine wissenschaftliche Publikation.','iPhone-Safari-Abnahme ist noch nicht dokumentiert','Historischer Currentness-Snapshot','Historischer Engineering-Snapshot','keine aktive Beauftragung','External novelty not established.'])ok(html.includes(text),text);
const labreport=fs.readFileSync(path.resolve(book,'../../../SCIENCE_LAB/LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_023_051_PASCAL_GENERATION_RETURN_001.md'),'utf8');
for(const text of ['135 typed Pascal additions','140 raw addresses','210 relation edges','R2_LOCAL_REPLAY','OWNER_ACCEPTED','open Pascal intertwiner'])ok(labreport.includes(text),'source '+text);
const receipt=JSON.parse(fs.readFileSync(path.join(book,'results/a0-return-gate-public-iphone-return-2026-10-19.json')));
ok(receipt.gate.numeric_to_angle_mapping==='OPEN_NOT_IMPLEMENTED','mapping remains open');
ok(receipt.deployment.iphone_acceptance==='NOT_PERFORMED','no fabricated device acceptance');
const bench=fs.readFileSync(path.join(book,'a0-orientation-controller-bench.js'),'utf8');
ok(bench.includes("const VERSION = '0.21.0'"),'source code version snapshot');
ok(html.includes('.field-summary,.currentness-grid{grid-template-columns:1fr}'),'responsive cards');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
for(const [,href] of html.matchAll(/\bhref="([^"]+)"/g)){
 if(/^(https?:|mailto:)/.test(href))continue;
 const [name,fragment]=href.split('#');
 if(!name){ok(ids.has(fragment),'local section '+href);continue;}
 ok(fs.existsSync(path.resolve(book,decodeURIComponent(name.split('?')[0]))),'local target '+href);
}
console.log(JSON.stringify({status:'PASS',checks,scope:'source-bound documentary report, historical boundaries and local links; no science rerun or browser/mobile acceptance'},null,2));
