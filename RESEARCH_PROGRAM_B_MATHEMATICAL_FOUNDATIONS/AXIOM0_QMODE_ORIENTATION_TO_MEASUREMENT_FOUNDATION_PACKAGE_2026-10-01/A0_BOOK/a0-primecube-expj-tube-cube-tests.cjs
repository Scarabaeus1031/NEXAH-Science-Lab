'use strict';
const assert=require('node:assert/strict');
const lens=require('./a0-primecube-expj-tube-cube.js');
let checks=0;
const same=(a,b,m)=>{assert.deepEqual(a,b,m);checks+=1;};
const ok=(v,m)=>{assert.ok(v,m);checks+=1;};
same(lens.BINS.length,8,'eight Tube addresses');
same(lens.MODULI,[41,42,43,59,61,97],'Series XI moduli');
for(const modulus of lens.MODULI){
  const total=lens.SERIES[modulus].occupancy.reduce((a,b)=>a+b,0);
  ok(Math.abs(total-1)<1e-12,`m${modulus} occupancy normalized`);
}
same(lens.SERIES[41].peaks.length,3,'m41 triangle driver');
same(lens.SERIES[43].peaks.length,5,'m43 pentagon driver');
same(lens.motifPoints(41).length,3,'triangle projection');
same(lens.motifPoints(43).length,5,'pentagon projection');
same(lens.TRANSITIONS.length,8,'eight transition rows');
for(const row of lens.TRANSITIONS)ok(Math.abs(row.reduce((a,b)=>a+b,0)-1)<1e-12,'transition row normalized');
const a=lens.createState(41),b=lens.advance(a),c=lens.clearTrace(b);
same(a.trace,[0],'trace starts retained');
same(b.trace.length,2,'advance retains trace');
same(c.trace,[b.active],'clear is explicit and keeps active state');
same(lens.selectModulus(b,43).modulus,43,'modulus switch');
same(lens.selectModulus(b,43).trace,[0],'modulus switch resets typed trace');
same(lens.spectrum([0,1,2,3]).length,8,'eight-bin DFT view');
const battery=lens.runChecks();
same(battery.status,'PASS','check battery');
same(battery.passed,7,'seven checks pass');
same(battery.new_ids,0,'no new identity');
same(battery.new_relations,0,'no new relation');
console.log(`PASS ${checks}/${checks} — Primecube EXP-J × Tube Cube lens`);

