'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');

let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks+=1;};
const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks+=1;};
const read=name=>fs.readFileSync(path.join(__dirname,name));
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');

const prereg=read('results/A0_DIGIT_GEOMETRY_PREREGISTERED_NULL_TEST_2026-11-11.md');
const receipt=JSON.parse(read('results/a0-digit-geometry-preregistered-null-test-2026-11-11.json'));

eq(sha(prereg),'c63ec688dc21fac8cfdfdb8828d81d19f917dadc711ebae91d56bd33bda9ef63','frozen preregistration hash');
eq(receipt.preregistration.sha256,sha(prereg),'receipt binds preregistration');
eq(receipt.preregistration.frozen_before_holdout_generation,true,'freeze precedes holdout generation');
eq(receipt.implementation.base_seed_hex,'0xa0112026','fixed seed');
eq(receipt.implementation.replicates_per_population,100000,'replicate count');
eq(receipt.implementation.epsilon,1e-12,'barycentric tolerance');
for(const [name,row] of Object.entries(receipt.prefix_checks))eq(row.sha256,row.expected,name+' prefix matches frozen fixture');
for(const segment of Object.values(receipt.holdout_hashes))for(const hash of Object.values(segment))ok(/^[a-f0-9]{64}$/.test(hash),'holdout hash is bound');

eq(receipt.H1.observed_inside,5,'H1 inside count');
eq(receipt.H2.observed_inside,10,'H2 inside count');
for(const holdout of [receipt.H1,receipt.H2]){
  eq(holdout.frames,100,holdout.label+' frame count');
  for(const key of ['N1_circular','N2_permutation']){
    const row=holdout[key];
    eq(row.replicates,100000,holdout.label+' '+key+' replicate count');
    ok(row.p_two_sided>0.01,holdout.label+' '+key+' does not reject null');
    ok(Math.abs(row.z)<2.5,holdout.label+' '+key+' effect below frozen threshold');
  }
}
ok(receipt.H1.N1_circular.deviation_from_median<0,'H1 deviation is negative');
ok(receipt.H2.N1_circular.deviation_from_median>0,'H2 deviation reverses direction');
eq(receipt.offset_controls_H1.map(row=>row.frames),[99,99,99,99],'four offset controls use 99 complete frames');
eq(Object.values(receipt.gates),[false,false,false,false,false],'all five preregistered gates fail');
eq(receipt.status,'FALSIFIED_STRONGER_ALIGNMENT_FOR_DECLARED_OPERATOR_AND_HOLDOUTS','bounded negative verdict');
eq(receipt.decision.retained,false,'stronger statement not retained');
eq(receipt.graph_delta,{nodes:0,relations:0,aliases:0},'zero graph delta');
eq(receipt.authority_effect,{study_activation:false,canonical_finding:false,claim_ceiling_change:false,publication_authorized:false},'no authority promotion');

console.log(JSON.stringify({status:'PASS',checks,verdict:receipt.status,H1:receipt.H1.observed_inside,H2:receipt.H2.observed_inside}));
