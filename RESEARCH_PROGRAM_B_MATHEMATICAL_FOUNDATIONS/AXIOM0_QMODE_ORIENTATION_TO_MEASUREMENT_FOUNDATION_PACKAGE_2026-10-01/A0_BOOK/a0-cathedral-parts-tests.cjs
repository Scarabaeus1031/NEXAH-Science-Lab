const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const api=require('./a0-cathedral-parts.js'),w={};vm.runInNewContext(fs.readFileSync(__dirname+'/assets/a0-cathedral-rc08.packed.js','utf8'),{window:w});
const input=Buffer.from(w.A0CathedralPacked.RC08,'base64'),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),before=hash(input);let checks=0;
const ok=(v,m)=>{assert(v,m);checks++;},report=api.inspect(input);
ok(report.nodes===494&&report.attached===491&&report.unattached===2,'source hierarchy and orphan helpers');
ok(JSON.stringify(report.counts)===JSON.stringify({nave:11,scarab:34,qsr:47,sea:134,tunnel:262,portals:3}),'six disjoint presentation groups');
const original=api.parse(input),seen=new Set();
for(const [part] of api.groups){
 const result=api.derive(input,{part}),parsed=api.parse(result.bytes),d=parsed.doc,ids=d.extras.a0_view.source_nodes;
 ok(result.report.selected===report.counts[part],'part count '+part);
 ok(Buffer.from(parsed.tail).equals(Buffer.from(original.tail)),'all original binary chunks preserved '+part);
 ok(!d.animations,'derived view static '+part);
 for(const i of ids){ok(!seen.has(i),'no duplicated part membership');seen.add(i);ok(JSON.stringify(d.nodes[i])===JSON.stringify(original.doc.nodes[i]),'source node untouched '+i);}
 ok(d.nodes[0].children.every(i=>d.nodes[i].name.startsWith('ViewOnly_')),'explicit view wrappers');
}
ok(seen.size===491,'partition covers attached source nodes only');
const exploded=api.parse(api.derive(input,{explode:1}).bytes).doc;
ok(exploded.nodes.length===500,'six display-only group wrappers');
ok(exploded.nodes[494].translation.join(',')==='0,0,0','nave stationary');
ok(exploded.nodes[495].translation.join(',')==='0,0,5','scarab group offset explicit');
let previous=0;for(let height=0;height<=100;height+=5){const r=api.derive(input,{height});ok(r.report.selected>=previous,'height reveal monotone');previous=r.report.selected;}
ok(previous===491,'full reveal restores all attached source components');
for(const options of [{part:'unknown'},{height:NaN},{height:101},{explode:-1}]){assert.throws(()=>api.derive(input,options));checks++;}
ok(hash(input)===before,'source bytes immutable');
ok(before==='ddff799102ac7a40f98ee125c6d4a76f17a869786d182da0e9859023b6584443','original source hash retained');
const desk=fs.readFileSync(__dirname+'/A0_RESEARCH_DESK.html','utf8');ok(desk.includes('kein Populationswachstum'),'no simulation claim');ok(desk.indexOf('src="a0-cathedral-parts.js"')<desk.indexOf('src="a0-cathedral-glb-viewer.js"'),'module loaded before controller');
console.log(JSON.stringify({status:'PASS',checks,report,scope:'actual source GLB partition and binary-preserving derived views; not browser/WebGL acceptance'},null,2));
