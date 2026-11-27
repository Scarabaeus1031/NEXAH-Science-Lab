const assert=require('node:assert/strict');
const fs=require('node:fs');
const model=require('./a0-breathing-crystal-aperture.js');
assert.deepEqual(model.STAGES,['SOURCE','ALIGN','PUNCH','BREATHE','FOURIER','RETURN']);
assert.deepEqual(Object.keys(model.MATERIALS),['orange-shadow','obsidian','graphite','gold']);
assert.equal(model.MATERIALS['orange-shadow'].label,'ORANGE SHADOW');
assert.equal(model.MATERIALS['orange-shadow'].bracket,'#ff4fbf');
for(const key of Object.keys(model.MATERIALS)){assert.equal(model.MATERIALS[key].faces.length,4);assert.match(model.MATERIALS[key].edge,/^#[0-9a-f]{6}$/i);}
const source=model.stageState('SOURCE',0),punch=model.stageState('PUNCH',0),breath=model.stageState('BREATHE',.25),reveal=model.stageState('FOURIER',.25),returned=model.stageState('RETURN',0);
assert.equal(source.crystalY,.72);assert.equal(punch.aperture,1);assert.equal(punch.crystalY,.05);assert.equal(breath.crystalY,0);assert.ok(breath.scale>1);assert.ok(reveal.reveal>.7);assert.equal(returned.aperture,0);assert.equal(returned.reveal,0);assert.equal(model.returnCheck(returned).pass,true);assert.equal(model.returnCheck(source).pass,true);
const html=fs.readFileSync('./A0_BREATHING_CRYSTAL_APERTURE.html','utf8');
assert.match(html,/A0_ORIENTATION_CONTROLLER_BENCH\.html#breathingCrystalBench/);
assert.match(html,/APERTURE VIEW · EXISTING BREATHING CRYSTAL IDENTITY/);
assert.match(html,/BLUE GH \/ GHOSTGRID · SEPARATE SOURCE VIEW/);
const bench = require('./a0-breathing-crystal-bench.js');
const address = bench.runtimeState();
const sample = {port: address.port, node: address.node, modelSha256: address.sha256, x: .43, y: .004};
const frames = model.BAND_ROUTE.map(stage => model.bandFrame(model.stageState(stage), sample, 'orange-shadow'));
assert.equal(frames[0].node, 'BAND_0.429');
assert.notEqual(frames[1].y, frames[0].y);
assert.deepEqual(model.checkBandReturn(frames), {pass: true, addressMatches: true, residual: 0});
assert.equal(model.checkBandReturn([frames[0], frames[3]]), null);
const returnedToOtherBand = {...frames[3], node: 'BAND_0.456'};
assert.deepEqual(model.checkBandReturn([...frames.slice(0, 3), returnedToOtherBand]), {
  pass: false, addressMatches: false, residual: 0
});
const differentProjection = {...frames[3], x: frames[3].x + .1};
assert.equal(model.checkBandReturn([...frames.slice(0, 3), differentProjection]).pass, false);
const greyShadow = {...frames[2], view: 'graphite'};
assert.equal(model.checkBandReturn([frames[0], frames[1], greyShadow, frames[3]]).pass, false);

const point = {x: .43, y: .02, z: .001};
const a = {...sample, reference: point};
const b = {...a, node: bench.step(address, 1).node};
const turn = (input, angle) => model.BAND_ROUTE.map(stage =>
  model.quarterTurnFrame(model.stageState(stage), input, 'orange-shadow', angle)
);
const aRoute = turn(a, 90);
const bRoute = turn(b, -270);
for (const [route, node, degrees] of [[aRoute, 'BAND_0.429', 90], [bRoute, 'BAND_0.456', -270]]) {
  assert.ok(route.every(frame => frame.node === node && frame.port === 'crystal.band'));
  assert.equal(route[2].angle, degrees);
  assert.equal(route[3].inverseAngle, -degrees);
  assert.equal(route[2].x, -.02);
  assert.deepEqual(model.checkBandReturn(route), {pass: true, addressMatches: true, residual: 0});
}
assert.equal(aRoute[2].y, bRoute[2].y);
assert.equal(model.checkBandReturn([...aRoute.slice(0, 3), bRoute[3]]).pass, false);
assert.equal(model.checkBandReturn(aRoute.slice(0, 3)), null);
assert.throws(() => turn(a, 180), RangeError);
console.log(JSON.stringify({status:'PASS',checks:46,identity:'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',stages:model.STAGES,materials:Object.keys(model.MATERIALS)},null,2));
