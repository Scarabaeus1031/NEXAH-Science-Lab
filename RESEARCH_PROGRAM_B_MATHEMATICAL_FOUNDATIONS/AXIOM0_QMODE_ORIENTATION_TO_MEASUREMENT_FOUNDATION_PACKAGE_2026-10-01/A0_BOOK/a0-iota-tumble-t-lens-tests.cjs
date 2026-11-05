const assert=require('node:assert/strict');
const api=require('./a0-iota-tumble-t-lens.js');

assert.equal(api.PERIOD,24);
assert.equal(api.IOTA_DEGREES,15);
assert.equal(api.inspectTick(0).sourceStatus,'ORIGIN');
assert.equal(api.inspectTick(24).sourceStatus,'EXACT_RETURN');
assert.equal(api.inspectTick(24).thetaDegrees,360);
assert.equal(api.inspectTick(24).orangeTransitionEvents,24);
assert.equal(api.inspectTick(6).tangentScalar,null);
assert.equal(api.inspectTick(6).tangentScalarStatus,'UNDEFINED_AT_QUARTER_TURN');
assert.ok(Math.abs(api.inspectTick(6).tangent.x+1)<1e-12);
assert.ok(Math.abs(api.inspectTick(0).radial.x-1)<1e-12);
assert.ok(api.svgMarkup(api.inspectTick(12)).includes('SPARKS 12/24'));
assert.equal(api.buildRecord().authority.physicalMechanism,false);
assert.throws(()=>api.inspectTick(25),/0 to 24/);
console.log('PASS a0-iota-tumble-t-lens · 24-state tangent frame · exact return · counted events');
