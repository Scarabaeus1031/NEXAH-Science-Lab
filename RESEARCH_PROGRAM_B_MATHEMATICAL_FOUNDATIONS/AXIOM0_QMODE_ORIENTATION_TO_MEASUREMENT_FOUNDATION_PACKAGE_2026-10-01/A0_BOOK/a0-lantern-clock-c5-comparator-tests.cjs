const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const api=require('./a0-lantern-clock-c5-comparator.js');

let checks=0;
const eq=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const m=api.model();

eq(api.clockDegrees(5),150,'5:00 coordinate');
eq(api.clockDegrees(10),300,'10:00 coordinate');
eq(m.clock.separationDegrees,150,'5↔10 minimal separation');
eq(m.c5.stepDegrees,72,'C5 step');
eq(m.c5.separationDegrees,144,'nearest C5 pair separation');
eq(m.residual.pairDegrees,6,'pair residual');
eq([m.c5.nearFive.residualDegrees,m.c5.nearTen.residualDegrees],[6,12],'nearest gate residuals');
eq([api.clockLabel(m.c5.nearFive.c5Clock),api.clockLabel(m.c5.nearTen.c5Clock)],['4:48','9:36'],'C5 clock labels');
eq([api.clockLabel(m.clock.bisectorClock),api.clockLabel(m.c5.bisectorClock)],['7:30','7:12'],'bisector labels');
eq(m.residual.axisDegrees,9,'axis residual');
eq(m.clock.antipodeControl.separationDegrees,180,'5↔11 antipode control');
eq([m.fold.balanced.sum,m.fold.control.sum],[11,11],'equal fold sums');
eq([m.fold.balanced.imbalance,m.fold.control.imbalance],[0,1],'fold imbalance control');
eq(api.verify().status,'PASS_WITH_LIGHT_PHYSICS_HOLD','bounded status');
eq(api.verify().checks,9,'internal checks');
eq(m.newCanonicalIds,[],'no new identities');
eq(m.relationChanges,[],'no graph changes');

const html=fs.readFileSync(path.join(__dirname,'A0_WERKBANK.html'),'utf8');
eq(html.includes('id="lanternClockC5Comparator"'),true,'Workbench mount');
eq(html.includes('a0-lantern-clock-c5-comparator.js?rev=clock-c5-r1-20261030'),true,'Workbench runtime');
eq(html.includes('A0_LANTERN_PANEL_V_CONTROL_LENS.html#bench-page-top'),true,'Panel V binding');
eq(html.includes('results/a0-lantern-clock-c5-light-shadow-comparator-return-2026-10-30.json'),true,'receipt binding');

console.log(`PASS · ${checks} Lantern Clock/C5 comparator checks · LIGHT PHYSICS HOLD`);
