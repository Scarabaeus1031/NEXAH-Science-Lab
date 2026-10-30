const assert=require('node:assert/strict');
const model=require('./a0-breathing-crystal-aperture.js');
assert.deepEqual(model.STAGES,['SOURCE','ALIGN','PUNCH','BREATHE','FOURIER','RETURN']);
assert.deepEqual(Object.keys(model.MATERIALS),['bronze','obsidian','graphite','gold']);
for(const key of Object.keys(model.MATERIALS)){assert.equal(model.MATERIALS[key].faces.length,4);assert.match(model.MATERIALS[key].edge,/^#[0-9a-f]{6}$/i);}
const source=model.stageState('SOURCE',0),punch=model.stageState('PUNCH',0),breath=model.stageState('BREATHE',.25),reveal=model.stageState('FOURIER',.25),returned=model.stageState('RETURN',0);
assert.equal(source.crystalY,.72);assert.equal(punch.aperture,1);assert.equal(punch.crystalY,.05);assert.equal(breath.crystalY,0);assert.ok(breath.scale>1);assert.ok(reveal.reveal>.7);assert.equal(returned.aperture,0);assert.equal(returned.reveal,0);assert.equal(model.returnCheck(returned).pass,true);assert.equal(model.returnCheck(source).pass,true);
console.log(JSON.stringify({status:'PASS',checks:20,identity:'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',stages:model.STAGES,materials:Object.keys(model.MATERIALS)},null,2));
