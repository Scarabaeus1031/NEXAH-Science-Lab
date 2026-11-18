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
console.log(JSON.stringify({status:'PASS',checks:25,identity:'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',stages:model.STAGES,materials:Object.keys(model.MATERIALS)},null,2));
