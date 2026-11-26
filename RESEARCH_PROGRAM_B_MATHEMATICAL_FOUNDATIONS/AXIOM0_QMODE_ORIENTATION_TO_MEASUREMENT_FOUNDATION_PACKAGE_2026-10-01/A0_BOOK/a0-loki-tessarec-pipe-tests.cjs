'use strict';
const assert=require('node:assert/strict');
const pipe=require('./a0-loki-tessarec-pipe.js');
assert.equal(pipe.RETURN,56);
assert.equal(pipe.orbit().length,56);
assert.equal(new Set(pipe.orbit().map(s=>`${s.station}:${s.orientation}`)).size,56);
assert.deepEqual([pipe.state(56).station,pipe.state(56).orientation],[0,0]);
for (const [number, station, orientation, rest57, rest19] of [
  [56, 0, 0, 56, 18], [57, 1, 1, 0, 0], [3656, 2, 0, 8, 8], [3565, 2, 5, 31, 12]
]) {
  const address = pipe.clockAddress(number);
  assert.deepEqual([address.active.station, address.active.orientation, address.rest57, address.rest19],
    [station, orientation, rest57, rest19]);
}
assert.equal(pipe.orbit(false).length,7);
const beforePhase = pipe.sourceFourierPhase(56).bins;
const afterPhase = pipe.sourceFourierPhase(57).bins;
assert.equal(beforePhase.length, 49);
assert.deepEqual(beforePhase.map(({kx, ky}) => [kx, ky]), afterPhase.map(({kx, ky}) => [kx, ky]));
const differenceBins = pipe.sourceFourierPhaseDifference(beforePhase, afterPhase);
assert.equal(differenceBins.length, 49);
differenceBins.forEach(({kx, phase}) => assert.ok(Math.abs(phase + 2 * Math.PI * kx / 7) < 1e-12));
beforePhase.forEach(({kx, phase, magnitude}, index) => {
  const after = afterPhase[index];
  const phaseError = after.phase - phase + 2 * Math.PI * kx / 7;
  assert.ok(Math.abs(Math.atan2(Math.sin(phaseError), Math.cos(phaseError))) < 1e-12);
  assert.ok(Math.abs(magnitude - 1) < 1e-12 && Math.abs(after.magnitude - 1) < 1e-12);
});
assert.equal(pipe.band28().length,28);
assert.equal(pipe.lift56().length,56);
assert.deepEqual(pipe.verify().newCanonicalIds,[]);
assert.deepEqual(pipe.verify().relationChanges,[]);
assert.deepEqual(pipe.m37Probe().rungs.map(r=>r.scaled),[111,185,259]);
assert.equal(pipe.m37Probe().midpoint,185);
assert.equal(pipe.nthPrime(12),37);
assert.equal(pipe.verifyM37().status,'PASS');
assert.equal(pipe.nthPrime(5),11);
assert.equal(pipe.romanDecode('V'),5);
assert.equal(pipe.romanDecode('XI'),11);
assert.equal(pipe.romanDecode('L'),50);
assert.equal(pipe.romanDecode('XC'),90);
assert.equal(pipe.romanDecode('D'),500);
assert.equal(pipe.romanDecode('M'),1000);
assert.equal(pipe.m11PrimeFoldProbe().topology.moebiusResult,'OPEN');
assert.equal(pipe.verifyM11PrimeFold().status,'PASS_WITH_TOPOLOGY_HOLD');
console.log(JSON.stringify({pipe:pipe.verify(),m37:pipe.verifyM37(),m11:pipe.verifyM11PrimeFold()},null,2));
