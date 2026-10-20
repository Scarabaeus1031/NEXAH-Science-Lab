'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('./a0-core-cycle-comparator.js');let checks=0;
function ok(v){assert.ok(v);checks++;}function eq(a,b){assert.deepEqual(a,b);checks++;}
const g=C.graph();eq(g.nodes.length,18);eq(g.edges.length,34);eq(g.cycleLengths,[5,6,6]);
eq(new Set(g.edges.map(e=>[e.a,e.b].sort().join(':'))).size,34);
for(const n of g.nodes){eq(g.edges.filter(e=>e.a===n.id||e.b===n.id).length,n.id==='center'?17:3);if(n.id!=='center')ok(Math.abs(n.x*n.x+n.y*n.y-1)<1e-12);}
for(let k=0;k<3;k++){const e=g.edges.filter(e=>e.group===k);eq(e.length,[5,6,6][k]);for(const n of new Set(e.flatMap(e=>[e.a,e.b])))eq(e.filter(e=>e.a===n||e.b===n).length,2);}
for(const focus of ['all','0','1','2'])for(const K of [.2,.5,1,2])for(const sign of ['documented','historical']){
 const d=C.draft({focus,K,sign});eq(d.results,null);eq(d.researchExecution,false);eq(d.gate.runEnabled,false);eq(d.selectedK,K);
 eq(d.KValues,[.2,.5,1,2]);ok(d.coupling.includes(sign==='documented'?'theta_j-theta_i':'theta_i-theta_j'));
 for(const key of ['theta0','omega','normalization','integrator','dt','duration'])eq(d.pairedControl[key],null);
 const svg=C.drawing({focus,K,sign});eq((svg.match(/<line /g)||[]).length,34);eq((svg.match(/<circle /g)||[]).length,18);
 if(focus!=='all')eq((svg.match(/opacity="0.12"/g)||[]).length,17-[5,6,6][Number(focus)]);
}
for(const input of [{K:3},{K:NaN},{sign:'guess'},{focus:'3'}]){assert.throws(()=>C.options(input));checks++;}
const root=path.resolve(__dirname,'../../../../..'),core=path.join(root,'10 NEXAH CORE/NEXAH');
const source=fs.readFileSync(path.join(core,'EXPERIMENTAL/BUILDER_LAB/ARCHIVE_ENGINE/archived/research/experiments/symmetry_graph_experiment/symmetry_graph_3cycle.py'),'utf8');
ok(source.includes('spokes = [f"s{i}" for i in range(17)]'));
for(const [name,start,end,size] of [['pentagon',0,5,5],['hexagon1',5,11,6],['hexagon2',11,17,6]]){
 ok(source.includes(`${name} = spokes[${start}:${end}]`));ok(source.includes(`G.add_edge(${name}[i], ${name}[(i+1) % ${size}])`));
}
const sweep=fs.readFileSync(path.join(core,'RESEARCH/FINDINGS/TRANSITION_PHASE_DYNAMICS/scripts/kuramoto_phase_sweep.py'),'utf8');
ok(sweep.includes('K_VALUES = [0.2, 0.5, 1.0, 2.0]'));ok(sweep.includes('np.sin(theta_matrix - theta)'));ok(!sweep.includes('np.random.seed'));
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
for(const match of html.matchAll(/href="([^"\n]+(?:symmetry_graph_3cycle\.py|kuramoto_phase_sweep\.py|kuramoto_phase_extension\.md|basin_transition_graph\.py))"/g))ok(fs.existsSync(path.resolve(__dirname,match[1])));
const ids=['coreCycleComparator','cccFocus','cccK','cccSign','cccDrawing','cccStatus','cccCapture','cccRestore','cccExport','cccHistorical'];
for(const id of ids)ok(html.includes(`id="${id}"`));
const els=Object.fromEntries(ids.map(id=>[id,{value:'',disabled:false,addEventListener(name,f){this[name]=f;}}]));let payload,revoked=false,clicked=false;
const doc={getElementById:id=>els[id],createElement:()=>({click(){clicked=true;}})},win={Blob:class{constructor(parts){payload=JSON.parse(parts[0]);}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{revoked=true;}}};
const mounted=C.mount(doc,win);eq(mounted.read(),{focus:'all',K:.2,sign:'documented'});ok(els.cccRestore.disabled);
els.cccFocus.value='1';els.cccK.value='2';els.cccSign.value='historical';els.cccK.change();els.cccCapture.click();
els.cccK.value='.5';els.cccK.change();els.cccRestore.click();eq(mounted.read(),{focus:'1',K:2,sign:'historical'});
els.cccExport.click();eq(payload,mounted.draft());ok(clicked&&revoked);eq(payload.results,null);
const js=fs.readFileSync(path.join(__dirname,'a0-core-cycle-comparator.js'),'utf8');ok(!/setInterval|setTimeout|requestAnimationFrame|fetch\(/.test(js));
const sandbox={document:doc};sandbox.globalThis=sandbox;vm.runInNewContext(js,sandbox);ok(sandbox.A0CoreCycleComparator);
eq(C.mount({getElementById:()=>null},{}),null);
const history=C.historicalReadout(),historyBytes=fs.readFileSync(path.resolve(__dirname,history.source)),historySource=JSON.parse(historyBytes);
eq(require('node:crypto').createHash('sha256').update(historyBytes).digest('hex'),history.sourceSha256);
eq(history.points.map(p=>p.integerPart),[23,25,27]);eq(history.points.map(p=>p.nearestInteger),[23,25,28]);
for(const p of history.points){
 eq(p.K,historySource[p.role].K);eq(p.metric,historySource[p.role][p.role==='max_events'?'rate':'drift']);
 eq(p.scaledK,10*p.K);eq(p.residual,p.scaledK-p.anchor);eq(p.exactMatch,false);ok(p.residual>0);
}
eq(history.points[1].anchor,5**2);eq(history.points[2].anchor,3**3);
history.points[0].K=0;ok(C.historicalReadout().points[0].K>2);
ok(els.cccHistorical.innerHTML.includes('5² = 25'));ok(els.cccHistorical.innerHTML.includes('3³ = 27'));
eq(mounted.draft().historicalReadout,C.historicalReadout());eq(mounted.draft().results,null);
for(const match of html.matchAll(/href="([^"\n]+(?:regime_points\.json|kuramoto_phase_boundary_v8\.py|kuramoto_master_v6\.py|K_2_545\/summary\.json))"/g))ok(fs.existsSync(path.resolve(__dirname,match[1])));
let scripts=0;for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(!/\bsrc=/.test(m[1])){new vm.Script(m[2]);scripts++;}}
console.log(JSON.stringify({status:'PASS',checks,inlineScriptsParsed:scripts,scope:'topology, source guards, draft boundaries, DOM controls; no dynamics executed'}));
