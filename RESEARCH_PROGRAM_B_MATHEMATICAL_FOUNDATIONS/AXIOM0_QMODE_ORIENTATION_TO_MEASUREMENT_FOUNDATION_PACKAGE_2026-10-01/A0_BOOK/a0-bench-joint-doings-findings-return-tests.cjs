'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++},eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++};
const read=relative=>fs.readFileSync(path.join(__dirname,relative),'utf8');
const desk=read('A0_RESEARCH_DESK.html'),numbermagick=read('A0_NUMBERMAGICK_GRID_RESEARCH.html'),protocol=read('../22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md'),findings=read('../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md');
const deskSection=desk.match(/<section class="spread" id="bench-joint-doings-findings-return-20261023"[\s\S]*?<\/section>/)?.[0]||'';
ok(desk.includes('href="#bench-joint-doings-findings-return-20261023">Doings / Findings</a>'),'Desk navigation exposes combined return');
ok(desk.includes('21.–23.10.2026 · 7 Einträge'),'engineering archive count includes combined return');
ok(deskSection.includes('Doings sind gebaut. Findings bleiben typisiert und begrenzt.'),'combined Desk title');
for(const marker of ['DOING 1 · Source','DOING 2 · Joint','DOING 3 · Pin','DOING 4 · Aperture','FINDING A · Return','FINDING B · Grenze','q17 ≠ OS-11/N=18','2:1 ≠ 1:2:1','D5 ≠ D6','ACCEPTED · q01 · TOWER → APERTURE → SHELL'])ok(deskSection.includes(marker),`Desk marker ${marker}`);
for(const href of ['A0_ORIENTATION_CONTROLLER_BENCH.html#tlFinalPin','A0_ORIENTATION_CONTROLLER_BENCH.html#aeDgSamplingLoop','A0_NUMBERMAGICK_GRID_RESEARCH.html#tl-final-pin-numbermagick-return-20261023','A0_BUILDER_LOG.html#tl-final-pin-dg-handoff-20261023','../22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md#bench-joint-doings-findings-return-20261023','../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md#bench-joint-findings-return-20261023','results/a0-bench-joint-doings-findings-return-2026-10-23.json'])ok(deskSection.includes(`href="${href}"`),`Desk link ${href}`);
const nmSection=numbermagick.match(/<section id="tl-final-pin-numbermagick-return-20261023"[\s\S]*?<\/section>/)?.[0]||'';
for(const marker of ['2:1 lesen, ohne 1:2:1 oder TL hineinzuerfinden.','2/3+1/3=1','8²=64','3⁴=81','q17','N=18','TL(a,b,d,q)=(a,b,d+1,q−1)','Kein neuer Numbermagick-Operator'])ok(nmSection.includes(marker),`Numbermagick marker ${marker}`);
ok(protocol.includes('<a id="bench-joint-doings-findings-return-20261023"></a>'),'research protocol return anchor');
for(const marker of ['#### Doings','#### Findings im zulässigen Engineering-Sinn','17 -> 18','NO_NEW_F_A0'])ok(protocol.includes(marker),`protocol marker ${marker}`);
ok(findings.includes('<a id="bench-joint-findings-return-20261023"></a>'),'Findings workspace anchor');
for(const marker of ['Retained implementation findings','no new `F-A0` record','Paper C','Paper E','Paper D / Numbermagick','q17 addresses are not OS-11 teeth'])ok(findings.includes(marker),`Findings marker ${marker}`);
const bench=read('A0_ORIENTATION_CONTROLLER_BENCH.html'),log=read('A0_BUILDER_LOG.html');
for(const marker of ['id="aePaperBoatReturnDut"','id="tlFinalPin"','id="aeDgSamplingLoop"'])ok(bench.includes(marker),`Bench anchor ${marker}`);
for(const marker of ['id="tl-final-pin-20261023"','id="tl-final-pin-dg-handoff-20261023"'])ok(log.includes(marker),`Builder Log anchor ${marker}`);
const receipt=JSON.parse(read('results/a0-bench-joint-doings-findings-return-2026-10-23.json'));
eq(receipt.status,'ENGINEERING_AND_DOCUMENTARY_RETURN_PASS_HUMAN_PIXEL_ACCEPTANCE_OPEN','receipt status');
eq(receipt.conversation_crosswalk.length,2,'two working-context threads recorded');
eq(receipt.identity_effect.new_global_ids,[],'no new global ids');eq(receipt.identity_effect.new_canonical_relations,[],'no canonical relations');eq(receipt.identity_effect.new_operator,false,'no new operator');eq(receipt.identity_effect.new_carrier,false,'no new carrier');eq(receipt.identity_effect.new_study,false,'no Study');eq(receipt.identity_effect.new_f_a0_finding,false,'no F-A0 finding');
eq(receipt.authority.research_run,false,'no research run');eq(receipt.authority.scientific_evidence_promotion,false,'no evidence promotion');eq(receipt.authority.paper_claim_change,false,'no paper claim change');eq(receipt.authority.publication_authorized,false,'no publication authority');
for(const source of receipt.live_anchor_sources){const text=read(source.path);for(const anchor of source.anchors)ok(text.includes(anchor),`live anchor ${source.path}: ${anchor}`)}
for(const source of receipt.files){const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,source.path))).digest('hex');eq(actual,source.sha256,`current returned source ${source.path}`)}
console.log(JSON.stringify({status:'PASS',checks,scope:'cross-thread Bench/Joint doings-and-findings return; no new scientific finding or identity'}));
