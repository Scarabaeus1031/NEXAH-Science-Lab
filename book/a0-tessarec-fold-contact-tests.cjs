const assert=require('node:assert/strict');
const api=require('./assets/a0-tessarec-fold-contact-v1.js');

const regular=api.foldAudit({t:.5,extension:1,foldDeg:180});
assert.equal(regular.state,'OPEN');
assert.ok(Math.abs(regular.cutEdge-api.PHI/2)<1e-12);
assert.ok(Math.abs(regular.exactExtension-api.PHI/Math.sqrt(2))<1e-12);
assert.ok(regular.contactRatio<1);

const exact=api.foldAudit({t:.5,extension:api.PHI/Math.sqrt(2),foldDeg:180});
assert.ok(Math.abs(exact.contactRatio-1)<1e-12);
assert.equal(exact.state,'TOUCH');

const tuck=api.foldAudit({t:.5,extension:1.25,foldDeg:180});
assert.equal(tuck.state,'OVERLAP_TUCK');
assert.ok(tuck.centralGap===0);

for(const t of [.2,.5,.8])assert.ok(Math.abs(api.foldAudit({t,extension:1,foldDeg:180}).contactRatio-regular.contactRatio)<1e-12);

const expected={1111:[1000,111],3333:[2000,1333],4444:[2000,2444],7777:[6000,1777]};
for(const [n,[phi,gap]] of Object.entries(expected)){
  const p=api.numberProfile(Number(n));
  assert.equal(p.totient,phi);assert.equal(p.gap,gap);
}
assert.equal(api.numberProfile(3333).totient,api.numberProfile(4444).totient);

const guard=api.a7Root7Guard();
assert.deepEqual(guard.a7.incidentFaces,[5,5,8]);
assert.equal(guard.a7.regularFaceDefectDeg,9);
assert.equal(guard.a7.mappingInvariant,false);
assert.equal(guard.root7.normSquared,7);
assert.equal(guard.root7.axisIdentifiable,false);
assert.equal(guard.root7.epsilon7,'UNRESOLVED');
assert.equal(guard.verdict,'REJECT_IDENTITY_COLLAPSE');
assert.deepEqual(api.addressFoldAdapter('A2'),{panels:3,mode:'triangle',label:'A2 -> 3-fold',status:'HYPOTHESIS_ONLY'});
assert.deepEqual(api.addressFoldAdapter('A7'),{panels:8,mode:'octagon',label:'A7 -> 8-fold',status:'HYPOTHESIS_ONLY'});
assert.equal(api.addressFoldAdapter('D4').status,'NO_ADAPTER');
assert.equal(api.run().claimBoundary,'SCHEMATIC_KINEMATIC_CONTACT_AUDIT_NOT_PHYSICAL_REALIZATION');
console.log('A0 Tessarec fold/contact: 28 assertions passed');
