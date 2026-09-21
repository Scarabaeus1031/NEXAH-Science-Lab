#!/usr/bin/env node
"use strict";

const assert = require("assert");
const core = require("./e8_axis08_core.js");

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS\t${name}`);
}

const roots = core.constructE8Roots();
const audit = core.validateE8(roots);
test("E8_8D_CONSTRUCTION", () => assert.deepStrictEqual(audit, {
  count: 240,
  unique: 240,
  integerRoots: 112,
  halfRoots: 128,
  maxNormSquaredError: 0,
  pass: true
}));

const poles = Array.from({ length: 8 }, (_, i) => [i + 1, -(i + 1)]);
test("AXIS08_8_TO_7", () => {
  const result = core.weightedAxis08(poles, [3, 1]);
  assert.strictEqual(result.coordinates.length, 7);
  assert.deepStrictEqual(result.coupled, [7.25, -7.25]);
});

test("AXIS08_SWAP_WITH_WEIGHTS", () => {
  const a = core.weightedAxis08(poles, [3, 1]).coupled;
  const swapped = poles.slice();
  [swapped[6], swapped[7]] = [swapped[7], swapped[6]];
  const b = core.weightedAxis08(swapped, [1, 3]).coupled;
  assert.deepStrictEqual(a, b);
});

test("AXIS08_IDENTICAL_POLES", () => {
  const identical = poles.map(pole => pole.slice());
  identical[7] = identical[6].slice();
  assert.deepStrictEqual(core.weightedAxis08(identical, [2, 5]).coupled, identical[6]);
});

test("AXIS08_OPPOSITE_POLES", () => {
  const opposite = poles.map(pole => pole.slice());
  opposite[7] = opposite[6].map(value => -value);
  assert.deepStrictEqual(core.weightedAxis08(opposite, [1, 1]).coupled, [0, 0]);
});

test("AXIS08_ZERO_WEIGHT_SUM_FAILS_CLOSED", () => {
  assert.throws(() => core.weightedAxis08(poles, [1, -1]), /non-zero/);
});

test("NEAREST_TIE_ORDER_INDEPENDENT", () => {
  const points = [[1, 0, 7], [-1, 0, 2]];
  const a = core.nearestWithDeclaredTie(points, [0, 0]);
  const b = core.nearestWithDeclaredTie(points.slice().reverse(), [0, 0]);
  assert.strictEqual(a.tieCount, 2);
  assert.deepStrictEqual(a.point, b.point);
});

test("EMPTY_NEAREST_FAILS_CLOSED", () => assert.strictEqual(core.nearestWithDeclaredTie([], [0, 0]), null));

test("STATE_ROUNDTRIP", () => {
  const state = core.normalizeState({ couplingLog10: 4, splitEpsilon: -0.25, weights: [3, 2], poles });
  const restored = core.importState(core.exportState(state));
  assert.strictEqual(core.stableState(restored), core.stableState(state));
});

test("STATE_SCHEMA_REJECTS_FOREIGN_RECORD", () => {
  assert.throws(() => core.importState('{"schema":"OTHER"}'), /expected schema/);
});

test("DETERMINISTIC_REPEAT", () => {
  const a = core.stableState(core.normalizeState());
  const b = core.stableState(core.normalizeState());
  assert.strictEqual(a, b);
});

const start = process.hrtime.bigint();
for (let repeat = 0; repeat < 100; repeat += 1) {
  for (let i = 0; i < 48; i += 1) core.nearestWithDeclaredTie(roots, roots[(i + repeat) % roots.length]);
}
const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
test("STATIC_NEAREST_WORKLOAD_BENCHMARK", () => assert.ok(elapsedMs < 3000));
console.log(`SUMMARY\tPASS\ttests=${passed}\t48x240x100_ms=${elapsedMs.toFixed(2)}`);
