const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..'),base=path.dirname(__dirname),lab=path.resolve(base,'../..'),nav=path.join(lab,'SCIENCE_LAB/NAVIGATION'),mc=path.join(root,'00 EXECUTIVE/NEXAH-Mission-Control');
const receiptFile=path.join(__dirname,'results/a0-documentation-closeout-2026-10-20.json'),r=JSON.parse(fs.readFileSync(receiptFile)),hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
let checks=0;function ok(v,label){assert.ok(v,label);checks++;}
for(const s of r.sources)ok(hash(path.join(root,s.ecosystem_path))===s.sha256,'current source pin '+s.ecosystem_path);
const backlog=fs.readFileSync(path.join(base,'24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md'),'utf8');
for(const task of r.todos){ok(backlog.includes(task[0])&&backlog.includes(task[2])&&task[4].length>20,'typed followup '+task[0]);}
ok(r.todos.length===12&&r.new_global_ids.length===0&&!r.publication_authorized,'no new global identity or release');
ok(r.baseline.mission_control.status==='INVALID'&&r.baseline.source_graph.status==='PASS'&&r.baseline.binder.status==='PASS','explicit starting status');
for(const s of r.documents){const file=path.join(root,s.ecosystem_path),text=fs.readFileSync(file,'utf8');ok(text.includes(s.marker),'document section '+s.marker);
 const region=s.region==='all'?text:text.slice(Math.max(0,text.indexOf(s.marker)-180),text.indexOf(s.marker)+14000);
 const expressions=file.endsWith('.html')?[...region.matchAll(/href="([^"]+)"/g)].map(x=>x[1]):[...region.matchAll(/\]\(([^)]+)\)/g)].map(x=>x[1]);
 for(const raw of expressions){if(/^(https?:|mailto:|data:)/.test(raw))continue;const [relative,anchor]=decodeURIComponent(raw).split('#'),target=relative?path.resolve(path.dirname(file),relative):file;ok(fs.existsSync(target),'link target '+raw);
 if(anchor&&target.endsWith('.html')&&!target.includes('/NAVIGATION/APP/'))ok(fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'),'HTML anchor '+anchor);}
}
const b=JSON.parse(fs.readFileSync(path.join(nav,'EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json'))),entry=b.documentary_update_20261018.documentation_closeout_20261020;
ok(entry.receipt.sha256===hash(receiptFile),'new closeout receipt bound');
ok(b.documentary_update_20261018.thread_science_nsn_return_20261020.routes.some(x=>x.label==='Dokumentations-Closeout / Backlog'),'visible NSN closeout route');
ok(fs.readFileSync(path.join(mc,'CURRENT/PATTERN_TOOLBOX_V0_1.md'),'utf8').includes('FROZEN_DOCUMENTARY_V0_1'),'frozen toolbox unchanged in scope');
ok(r.papers_changed===false&&r.runtime_changed===false&&r.browser_acceptance===false,'scope limits');
console.log(JSON.stringify({status:'PASS',checks,sourcePins:r.sources.length,todos:r.todos.length,scope:'documentation pins, typed followups, reciprocal routes and unchanged authority; not browser acceptance'}));
