'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const bridge=require('./a0-rainbow-bridge-arc-tube-cut.js');

test('height ladder resolves seven bounded stages',()=>{
  assert.equal(bridge.stageAt(0).key,'POINT');
  assert.equal(bridge.stageAt(50).key,'ARC');
  assert.equal(bridge.stageAt(100).key,'CRYSTAL');
  assert.equal(new Set(Array.from({length:101},(_,i)=>bridge.stageAt(i).key)).size,7);
});

test('only the declared square diagonal is exact root two',()=>{
  const state=bridge.model({height:52,stretch:62,observer:38});
  assert.equal(state.diagonal,Math.SQRT2);
  assert.ok(state.section>0&&state.section<=1);
  assert.ok(state.cutPosition>=.34&&state.cutPosition<=.78);
});

test('record preserves human-view and non-identity boundaries',()=>{
  const record=bridge.buildRecord({height:100,stretch:80,observer:45});
  assert.equal(record.identity,'A0-VIEW-RAINBOW-PURPLE-RAIN');
  assert.equal(record.state.stage.key,'CRYSTAL');
  assert.equal(record.authority.newGraphIdentity,false);
  assert.equal(record.authority.physicalWormhole,false);
  assert.match(record.boundary,/sqrt\(2\)/i);
});

test('instrument returns to Science Desk, Builder Log and findings triage',()=>{
  const book=__dirname,programme=path.dirname(book);
  const rainbow=fs.readFileSync(path.join(book,'A0_RAINBOW_PURPLE_RAIN.html'),'utf8');
  const science=fs.readFileSync(path.join(book,'A0_RESEARCH_DESK.html'),'utf8');
  const builder=fs.readFileSync(path.join(book,'A0_BUILDER_LOG.html'),'utf8');
  const findings=fs.readFileSync(path.join(programme,'32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'),'utf8');
  assert.match(rainbow,/id="bridge"/);
  assert.match(science,/id="rainbow-bridge-miwa-lantern-return-20261112"/);
  assert.match(builder,/id="rainbow-bridge-miwa-lantern-builder-20261112"/);
  assert.match(findings,/id="rainbow-bridge-miwa-lantern--2026-11-12"/);
});
