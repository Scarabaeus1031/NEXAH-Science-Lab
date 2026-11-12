'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const D=require('./assets/a0-field-notes/digit-pentagon-ticker.js');

let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks+=1;};
const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks+=1;};
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');

const desk=read('A0_RESEARCH_DESK.html');
const blueprint=read('A0_LIVING_BLUEPRINT.html');
const fieldNotes=read('assets/a0-field-notes/index.html');
const findings=read('../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md');
const paperEDraft=read('../35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md');
const paperE=read('A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html');
const position=read('A0_SCIENTIFIC_POSITION_REPORT.html');
const receipt=JSON.parse(read('results/a0-field-notes-living-blueprint-return-2026-11-11.json'));

for(const token of [
  'id="field-notes-living-blueprint-return-20261111"',
  'href="A0_LIVING_BLUEPRINT.html#field-notes-living-return"',
  'PREREGISTERED BOUNDED NULL AUDIT',
  '100 Frames · 8-mal π strikt innen',
  'ALL 5 RETENTION GATES FAIL',
  'NEW ID 0',
  'RELATION 0'
])ok(desk.includes(token),'Science Desk binds '+token);

for(const token of [
  'id="field-notes-living-return"',
  'A0_RESEARCH_DESK.html#field-notes-living-blueprint-return-20261111',
  'assets/a0-field-notes/index.html#pi-relative-ticker',
  'assets/a0-field-notes/index.html#lanif-frequency-anchor',
  'ΔID=0 · ΔREL=0'
])ok(blueprint.includes(token),'Living Blueprint binds '+token);
for(const token of [
  'field-notes-living-blueprint-findings-return-20261111',
  'Fünf Finding Notes · kein neues F-A0',
  'Paper E §8.9 · Method Case'
])ok(blueprint.includes(token),'Living Blueprint routes '+token);

for(const token of [
  'Science Desk · Living Return',
  'A0_RESEARCH_DESK.html#field-notes-living-blueprint-return-20261111',
  'Living Blueprint · Gesamtkarte',
  'A0_LIVING_BLUEPRINT.html#field-notes-living-return'
])ok(fieldNotes.includes(token),'Field Notes exposes '+token);

for(const token of [
  'field-notes-living-blueprint-findings-return-20261111',
  'EF-FN-01',
  'EF-FN-02',
  'EF-FN-03',
  'EF-FN-04',
  'EF-FN-05',
  'All five frozen gates fail',
  'Paper A / SCC-003',
  'entropy of the loss receipt'
])ok(findings.includes(token),'Findings workspace retains '+token);

for(const token of [
  'field-notes-digit-geometry-method-case',
  '### 8.9 Field Notes: Zifferngeometrie mit vollständigem Verlustreceipt',
  '| strictly inside | `8` |',
  'T1–T8'
])ok(paperEDraft.includes(token),'Paper E draft binds '+token);
for(const token of [
  'id="field-notes-digit-geometry-method-case"',
  'Eine Ansicht darf Information verlieren — ihr Ledger nicht.',
  'Paper E §8.9',
  'kein Normalitätsbeweis',
  'id="field-notes-preregistered-null-result"',
  '0 von 5 Retentionsgates'
])ok(paperE.includes(token),'Paper E reader binds '+token);
for(const token of [
  'id="field-notes-method-return-20261111"',
  'Ein neuer Methodenfall — kein neuer Konstantensatz.',
  '8 / 100 strikt innen',
  'Paper E §8.9',
  'id="field-notes-preregistered-null-result-20261111"',
  '0 / 5 gates passed',
  'evidence status synchronized through 2026-11-11'
])ok(position.includes(token),'Scientific Position binds '+token);

eq(receipt.status,'PASS_SOURCE_BOUND_LOCAL_RETURN','receipt status');
eq(receipt.identity_reuse,['ART:A0:MATHEMATICAL_JOINTS','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1'],'existing identities reused');
eq(receipt.source_graph_effect,{new_nodes:0,new_relations:0,new_aliases:0,canonical_count_change:false,reason:'Existing A0 identity, Mathematical Joints identity and A0 Orientation Evidence Lineage lens are reused; this return adds local navigation and scientific classification only.'},'source graph remains unchanged');

const snapshots=Array.from({length:100},(_,index)=>D.relativeSnapshot(index));
const inside=snapshots.filter(frame=>frame.triangle.status==='INSIDE').map(frame=>frame.index+1);
const boundary=snapshots.filter(frame=>frame.triangle.status==='ON_BOUNDARY').length;
const degenerate=snapshots.filter(frame=>frame.triangle.status==='DEGENERATE').length;
const max=snapshots.reduce((best,frame)=>frame.triangle.area>best.triangle.area?frame:best,snapshots[0]);
const fixture=receipt.instrument_groups.find(group=>group.id==='DIGIT_PENTAGON_PI_RELATIVE_TRIANGLE').fixture;
eq(inside,fixture.strictly_inside_frames,'inside-frame receipt is reproducible');
eq([inside.length,boundary,degenerate,max.index+1],[fixture.inside_count,fixture.boundary_count,fixture.degenerate_count,fixture.max_area_frame],'finite frame totals reproduce');
ok(Math.abs(max.triangle.area-fixture.max_area)<1e-15,'maximum area reproduces');
eq(receipt.claim_boundary.normality_proof,false,'no normality proof claim');
eq(receipt.claim_boundary.constant_identity,false,'no constant identity claim');
eq(receipt.claim_boundary.physical_coupling,false,'no physical coupling claim');
eq(receipt.findings_return.canonical_finding_delta,0,'canonical finding ledger unchanged');
eq(receipt.findings_return.ledger_range_retained,'F-A0-01..F-A0-26','canonical finding range retained');
eq(receipt.findings_return.finding_notes.length,5,'five bounded finding notes retained');
eq(receipt.preregistered_null_audit.gates_passed,0,'no preregistered retention gate passed');
eq(receipt.preregistered_null_audit.gates_total,5,'all five preregistered gates recorded');
eq(receipt.preregistered_null_audit.verdict,'FALSIFIED_STRONGER_ALIGNMENT_FOR_DECLARED_OPERATOR_AND_HOLDOUTS','negative null-audit verdict returned');
eq(receipt.paper_routing.paper_e,'INCORPORATED_AS_SECTION_8_9_FINITE_METHOD_CASE','Paper E routing recorded');
eq(receipt.paper_routing.paper_a_scc_003,'UNCHANGED','SCC-003 paper remains unchanged');
eq(receipt.paper_routing.paper_f,'UNCHANGED','Paper F remains unchanged');

console.log(JSON.stringify({status:'PASS',checks,route:receipt.route,graphDelta:'0/0/0',insideFrames:inside}));
