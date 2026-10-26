'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const api=require('./a0-iota-2-3-bridge-probe.js');

let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks++};
const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++};
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');

const fixture=api.combinedIntakeFixture();
eq(fixture.status,'PASS','combined fixture passes');
eq(fixture.classification,'BOUNDED_ENGINEERING_FIXTURE','fixture remains engineering-bounded');
eq(fixture.midpoint.product,143,'midpoint product');
eq(fixture.drift.squares,[0,1,4,9,16,25],'square drift');
eq(fixture.seam.jointReturn,false,'tick 14 is not a joint return');
eq(fixture.destination.resolvedDestination,null,'destination stays unresolved');
ok(Object.values(fixture.authority).every(value=>value===false),'no authority mutation');

const receipt=JSON.parse(read('results/a0-iota-seam-square-drift-intake-return-2026-10-26.json'));
eq(receipt.status,'PASS','receipt passes');
eq(receipt.checks,124,'receipt records exact probe check count');
eq(receipt.fixtures.tick_14_seam.am_pm_gap,'pi/6','receipt records seam gap');
eq(receipt.fixtures.destination_tokens.status,'UNBOUND_OWNER_TOKEN','receipt keeps tokens unbound');
ok(Object.values(receipt.authority).every(value=>value===false),'receipt grants no authority');

const desk=read('A0_RESEARCH_DESK.html');
const backlog=read('../24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md');
const projection=read('A0_RESEARCH_BACKLOG.html');
const builder=read('A0_BUILDER_LOG.html');
for(const source of [desk,backlog,projection,builder])ok(source.includes('iota-seam-square-drift-intake-20261026'),'return anchor is present');
ok(desk.includes('I‑45H'),'Science Desk intake number');
ok(desk.includes('124/124 PASS'),'Science Desk carries test result');
ok(backlog.includes('SC` und `NTCS` bleiben'),'canonical backlog keeps destination tokens unbound');

console.log(JSON.stringify({status:'PASS',checks,scope:'IOTA seam, midpoint-prime and square-drift integration intake; no authority promotion'}));
