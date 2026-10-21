const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../NUMBER_OPERATOR_ARCHITECTURE_CONCORDANCE_AUDIT');
const desk=fs.readFileSync(path.join(__dirname,'A0_RESEARCH_DESK.html'),'utf8');
const nm=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
const p=JSON.parse(fs.readFileSync(path.join(root,'CATHEDRAL_FORMAT_VISUAL_PROVENANCE_2026-10-18.json'),'utf8'));
let checks=0;function ok(v,m){assert.ok(v,m);checks++;}
ok(p.received.length===25,'25 received visuals');ok(p.source_gallery.length===36,'36 source PNGs');
for(const x of [...p.received,...p.source_gallery]){ok(fs.existsSync(x.path),'source exists');ok(crypto.createHash('sha256').update(fs.readFileSync(x.path)).digest('hex')===x.sha256,'source hash');}
const section=desk.slice(desk.indexOf('<section class="spread" id="cathedral-format-source-return-20261018"'),desk.indexOf('<section class="spread" id="engineering-20261017"'));
ok(section.length>3000,'return exists before engineering');ok(nm.includes('A0_RESEARCH_DESK.html#cathedral-format-source-return-20261018'),'Numbermagick reciprocal return');
ok((section.match(/<img /g)||[]).length===0,'private source plates are not embedded in the Desk frontstage');
ok((section.match(/Lokaler Quellenmarker/g)||[]).length===3,'three neutral source markers');
for(const x of p.received)ok(!section.includes(x.path),'received source path is not exposed');
for(const id of ['cathedral-format-source-return-20261018','format-architecture-visuals'])ok(desk.split('id="'+id+'"').length===2,'unique anchor '+id);
for(const text of ['29/29','34/34','CameraProxy','7,5 s','±2 %','Noch kein Retargeting','36 PNG','25 empfangene','kein nachgewiesenes gemeinsames'])ok(section.includes(text),'boundary '+text);
for(const match of section.matchAll(/(?:href|src)="([^"]+)"/g)){
 const raw=match[1].replaceAll('&amp;','&');if(raw.startsWith('#')||/^https?:/.test(raw))continue;
 const file=decodeURIComponent(raw.split('#')[0]);const target=path.resolve(__dirname,file);
 ok(fs.existsSync(target),'local link '+file);
 const frag=raw.split('#')[1];if(frag&&target.endsWith('.html'))ok(fs.readFileSync(target,'utf8').includes('id="'+frag+'"'),'anchor '+frag);
}
const report=JSON.parse(fs.readFileSync(path.join(root,'CATHEDRAL_BREATH_SOURCE_CORRESPONDENCE_2026-10-18.json'),'utf8'));
const breath=report.tracks.find(t=>t.name==='BreathPulse_Procedural');
ok(breath.unique_target_matches===29&&breath.equivalent_subtree_positions_at_1e_6===29,'29 preserved target subtrees');
ok(report.assets.find(x=>x.id==='RC88').animations===0,'target missing animation explicit');
console.log(JSON.stringify({status:'PASS',checks,scope:'current source hashes and static Desk/Numbermagick return links; not browser visual acceptance'}));

