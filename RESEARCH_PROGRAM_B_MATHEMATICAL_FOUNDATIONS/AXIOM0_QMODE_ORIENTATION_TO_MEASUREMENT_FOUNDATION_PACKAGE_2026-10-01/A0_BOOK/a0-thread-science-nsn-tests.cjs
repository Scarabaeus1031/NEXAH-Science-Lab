const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..'),nav=path.join(root,'30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/NAVIGATION');
const binder=JSON.parse(fs.readFileSync(path.join(nav,'EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json')));
const entry=binder.documentary_update_20261018.thread_science_nsn_return_20261020;
const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,'results/a0-thread-science-nsn-return-2026-10-20.json')));
let checks=0;function ok(value,label){assert.ok(value,label);checks++;}
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
ok(entry.canonical_count_effect===0&&entry.new_global_ids.length===0&&!entry.publication_authorized,'authority limits');
ok(entry.coverage.length===11,'eleven topic coverage groups');
for(const route of [...entry.routes,...entry.coverage]){const [relative,anchor]=route.href.split('#'),target=path.resolve(nav,'APP',relative);ok(fs.existsSync(target),'route target '+relative);if(anchor)ok(fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'),'route anchor '+anchor);}
for(const source of receipt.sources)ok(hash(path.join(root,source.ecosystem_path))===source.sha256,'source hash '+source.ecosystem_path);
for(const visual of receipt.owner_visuals){if(visual.status==='PRESENT_LOCAL_PROVENANCE_ONLY')ok(hash(visual.path)===visual.sha256,'owner image hash '+visual.path);else ok(visual.status==='MISSING_LOCAL_SOURCE_RETAINED_AS_UNRESOLVED','missing source explicit');}
const desk=fs.readFileSync(path.join(__dirname,'A0_RESEARCH_DESK.html'),'utf8'),app=fs.readFileSync(path.join(nav,'APP/app.js'),'utf8');
ok(desk.includes('id="numbermagick-thread-return-20261020"')&&desk.includes('NSN ist der zentrale Quellen- und Relationsgraph'),'Desk return and source authority');
ok(app.includes('const thread = documentary?.thread_science_nsn_return_20261020;')&&app.includes('${threadHtml}${documentaryHtml}')&&app.includes('thread.coverage.map'),'NSN renders source-bound coverage');
ok(receipt.full_chat_archive===false&&receipt.papers_changed===false,'no archive or paper overclaim');
console.log(JSON.stringify({status:'PASS',checks,scope:'source hashes, Desk/NSN routes and renderer wiring; no browser acceptance or scientific replay'}));
