'use strict';
const assert=require('assert');
const fs=require('fs');
const bridge=require('./a0-pentagon-curtain-lissajous-bridge.js');
const html=fs.readFileSync('./A0_BLUE_PINK_DODECA_CELL_RETURN.html','utf8');
const scene=bridge.buildGeometry(.25,760,520),audit=bridge.auditGeometry(scene);
assert.deepStrictEqual(bridge.SOURCE_IDS,[
  'SRC:A0OE:PENTAGON_CURTAIN_LAB',
  'SRC:A0OE:PENTAGON_CURTAIN_SEAM_TEST',
  'SRC:A0OE:PENTAGON_CURTAIN_CONSTRUCTION_VISUAL'
]);
assert.deepStrictEqual(bridge.CHANNELS.map(channel=>channel.id),['AM','VM','PM']);
assert.strictEqual(audit.upperVertices,5);
assert.strictEqual(audit.lowerVertices,5);
assert.strictEqual(audit.middleHinges,5);
assert.strictEqual(audit.rods,10);
assert.strictEqual(audit.curtainSectors,5);
assert.ok(audit.maxEqualRodPairError<1e-12);
assert.ok(audit.returnError<1e-9);
assert.strictEqual(audit.seamClosureClaim,false);
assert.strictEqual(audit.signalMechanicsClaim,false);
assert.deepStrictEqual(scene.sectors.map(sector=>sector.channel.id),['AM','VM','PM','AM','VM']);
assert.ok(scene.apertureRadius>0);
assert.match(html,/id="pentagonCurtainLissajousBridge"/);
assert.match(html,/id="pentagonCurtainSvg"/);
assert.match(html,/id="pentagonCurtainFollow"/);
assert.match(html,/a0-pentagon-curtain-lissajous-bridge\.js/);
assert.match(html,/a0-pentagon-curtain-lissajous-bridge\.css/);
assert.match(html,/Signal → View/);
assert.match(html,/kein globaler Faltungslöser/i);
assert.match(html,/SRC:A0OE:PENTAGON_CURTAIN_LAB/);
console.log(JSON.stringify({status:'PASS',assertions:23,counts:{upper:5,lower:5,hinges:5,rods:10,sectors:5},returnError:audit.returnError,sourceIds:bridge.SOURCE_IDS,boundary:'SOURCE_BOUND_VIEW_NO_SHARED_MECHANICS_NO_SEAM_CLOSURE_CLAIM'},null,2));
