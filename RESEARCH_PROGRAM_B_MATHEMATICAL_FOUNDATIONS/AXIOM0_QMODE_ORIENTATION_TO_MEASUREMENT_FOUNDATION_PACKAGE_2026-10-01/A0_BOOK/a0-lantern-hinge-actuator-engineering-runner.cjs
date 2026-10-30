'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const replay=require('./a0-lantern-crown-replay.js');
const engineering=require('./a0-lantern-hinge-actuator-engineering.js');
const root=__dirname;
const result=engineering.runEngineering();
assert.equal(result.pass,true);
assert.equal(result.certificate.pass,true);
assert.ok(result.certificate.certifiedPairClearanceMillimetres>=1);
assert.ok(result.certificate.certifiedFixedClearanceMillimetres>=1);
assert.equal(result.bearings.length,5);
assert.equal(result.actuators.length,5);
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const receipt={
  schema:'a0.engineering-result.v1',
  id:'A0_LANTERN_HINGE_ACTUATOR_HOUSING_RETURN_2026_10_29',
  date:'2026-10-29',
  status:'PASS_KINEMATIC_PROTOTYPE_WITH_LOAD_HOLD',
  classification:'HINGE_BEARING_ACTUATOR_CONTINUOUS_CLEARANCE_HOUSING_MATERIAL_PROTOTYPE',
  identity_decision:'EXTEND_NEXAH_A0_ORIENTATION_CONTROLLER_BENCH_NO_NEW_IDENTITY',
  result,
  sources:{
    finite_envelope_receipt:'results/a0-lantern-crown-finite-envelope-return-2026-10-29.json',
    finite_envelope_sha256:hash('results/a0-lantern-crown-finite-envelope-return-2026-10-29.json'),
    model:'a0-lantern-hinge-actuator-engineering.js',
    model_sha256:hash('a0-lantern-hinge-actuator-engineering.js')
  },
  authority:{new_study:false,new_f_a0_finding:false,publication:false,fabrication_release:false},
  identity_effect:{new_global_ids:[],new_relations:[],carrier_merge:false}
};
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'results/a0-lantern-hinge-actuator-housing-return-2026-10-29.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({status:receipt.status,checks:`${result.passed}/${result.total}`,certificate:result.certificate,geometry:result.geometry},null,2));
