'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const replay=require('./a0-lantern-crown-replay.js');
const envelope=require('./a0-lantern-crown-envelope.js');

const root=__dirname;
const sourceDir=path.join(root,'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/five-flap-crown/analysis/koerper_due_diligence');
const modelsPath=path.join(sourceDir,'models.json');
const nativePath=path.join(sourceDir,'native_contact_results.json');
const replayReceiptPath=path.join(root,'results/a0-lantern-crown-source-replay-return-2026-10-29.json');
const models=JSON.parse(fs.readFileSync(modelsPath,'utf8'));
const native=JSON.parse(fs.readFileSync(nativePath,'utf8'));
const source=replay.sourceFromRecords(models,native);
const result=envelope.runEnvelope(source);
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

assert.deepEqual(source,replay.defaults,'browser constants remain source-bound');
assert.equal(result.pass,true,'sampled finite-thickness envelope passes');
assert.equal(result.nominalContactCollisionDetected,true,'nominal zero-thickness contact is rejected for finite thickness');
assert.ok(result.safeAngleDegrees<source.contactFoldDegrees,'finite-thickness stop precedes nominal contact');
assert.ok(result.minOperatingPairGap>=result.options.clearance-1e-10,'pair clearance contract');
assert.ok(result.minOperatingFixedGap>=result.options.clearance-1e-10,'fixed lantern clearance contract');
assert.equal(result.returnError,0,'open-safe-open return');

const receipt={
  schema:'a0.engineering-result.v1',
  id:'A0_LANTERN_CROWN_FINITE_ENVELOPE_RETURN_2026_10_29',
  date:'2026-10-29',
  status:'PASS_WITH_EARLY_STOP_AND_CONTINUOUS_HOLD',
  classification:'FINITE_THICKNESS_SAMPLED_ADAPTER_ENVELOPE',
  identity_decision:'EXTEND_NEXAH_A0_ORIENTATION_CONTROLLER_BENCH_NO_NEW_IDENTITY',
  source_replay_receipt:'results/a0-lantern-crown-source-replay-return-2026-10-29.json',
  contract:{
    thickness_mm:result.options.thickness*result.options.sourceUnitMillimetres,
    clearance_mm:result.options.clearance*result.options.sourceUnitMillimetres,
    hinge_end_relief_mm:result.options.hingeEndRelief*result.options.sourceUnitMillimetres,
    sampled_stations:result.options.stations,
    flap_count:5,
    fixed_reference:'A/M/B lantern struts + central pin + non-own crown hinges',
    own_hinge_contact:'DECLARED_ADAPTER_INTERFACE_EXCLUDED_FROM_CLEARANCE_TEST'
  },
  result:{
    deterministic_checks:result.total,
    passed:result.passed,
    nominal_zero_thickness_contact_deg:result.nominalContactDegrees,
    finite_thickness_safe_stop_deg:result.safeAngleDegrees,
    required_early_stop_deg:result.angleHoldDegrees,
    residual_aperture_diameter_mm:result.safeApertureDiameter*result.options.sourceUnitMillimetres,
    minimum_flap_pair_clearance_mm:result.minOperatingPairGap*result.options.sourceUnitMillimetres,
    minimum_fixed_reference_clearance_mm:result.minOperatingFixedGap*result.options.sourceUnitMillimetres,
    nominal_contact_pair_gap_mm:result.nominalContactPairGap*result.options.sourceUnitMillimetres,
    nominal_contact_collision_detected:result.nominalContactCollisionDetected,
    return_error_mm:result.returnError*result.options.sourceUnitMillimetres
  },
  pass:{
    finite_thickness_envelope:true,
    hinge_end_relief:true,
    sampled_pair_clearance:true,
    sampled_fixed_reference_clearance:true,
    early_stop:true,
    open_safe_open_return:true
  },
  hold:{
    continuous_collision_certificate:true,
    exact_hinge_and_bearing_detail:true,
    actuator:true,
    housing:true,
    force:true,
    material:true,
    prototype:true
  },
  sources:{
    models:'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/five-flap-crown/analysis/koerper_due_diligence/models.json',
    native_contact:'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/five-flap-crown/analysis/koerper_due_diligence/native_contact_results.json',
    replay_receipt_sha256:hash(replayReceiptPath),
    models_sha256:hash(modelsPath),
    native_contact_sha256:hash(nativePath)
  },
  authority:{new_study:false,new_f_a0_finding:false,publication:false,physical_mechanism_claim:false},
  identity_effect:{new_global_ids:[],new_relations:[],carrier_merge:false}
};

if(process.argv.includes('--write')){
  const target=path.join(root,'results/a0-lantern-crown-finite-envelope-return-2026-10-29.json');
  fs.writeFileSync(target,JSON.stringify(receipt,null,2)+'\n');
}
console.log(JSON.stringify({
  status:receipt.status,
  checks:`${result.passed}/${result.total}`,
  safeStopDegrees:result.safeAngleDegrees,
  earlyStopDegrees:result.angleHoldDegrees,
  residualApertureMillimetres:receipt.result.residual_aperture_diameter_mm,
  minimumFixedClearanceMillimetres:receipt.result.minimum_fixed_reference_clearance_mm
},null,2));
