#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const B=require('./a0-primecube-control-plane-baseline.js');

const root=__dirname;
const html=fs.readFileSync(path.join(root,'A0_PRIMECUBE_GAP_FOLD_LAB.html'),'utf8');
const proof=B.verify();
let integrationChecks=0;
for(const section of B.SECTION_INVENTORY){
  assert.ok(html.includes(`id="${section.sectionId}"`),`missing page section ${section.sectionId}`);
  integrationChecks++;
}
for(const source of ['a0-primecube-model.js','a0-loki-tessarec-pipe.js','a0-point-line-topology-return.js','a0-ae-zipper-boundary.js']){
  assert.ok(fs.existsSync(path.join(root,source)),`missing source ${source}`);
  integrationChecks++;
}
assert.equal(proof.status,'PASS_BASELINE_WITH_EXPLICIT_HOLDS');integrationChecks++;
assert.equal(proof.checkCount,25);integrationChecks++;
assert.deepEqual(proof.newCanonicalIds,[]);integrationChecks++;
assert.deepEqual(proof.relationChanges,[]);integrationChecks++;
assert.ok(proof.holds.includes('COMBINED_840_STEP_TEST_NOT_STARTED'));integrationChecks++;
assert.equal(B.splinterQBaseline().closedUnderT20,false);integrationChecks++;
const transversal=require('./a0-primecube-model.js').transversalPlaneScienceReturnRecord();
assert.equal(transversal.controls.crossing,'TRANSVERSAL_CROSSING');integrationChecks++;
assert.equal(transversal.controls.tangent,'NONTRANSVERSAL_CONTACT');integrationChecks++;
assert.equal(transversal.controls.sameSide,'NO_CROSSING');integrationChecks++;
assert.equal(transversal.navigatorEffect.newCanonicalIds,0);integrationChecks++;

console.log(JSON.stringify({...proof,integrationChecks,totalChecks:proof.checkCount+integrationChecks},null,2));
