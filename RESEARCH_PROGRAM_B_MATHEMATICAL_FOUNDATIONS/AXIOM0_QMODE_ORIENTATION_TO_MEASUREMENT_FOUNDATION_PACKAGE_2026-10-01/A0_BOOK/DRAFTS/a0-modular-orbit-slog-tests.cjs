"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const orbit = require("./a0-modular-orbit-slog-v0-1.cjs");

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, "a0-modular-orbit-7-fixture-v0-1.json"), "utf8"));

function execute(entry) {
  return orbit.runOrbit({ seed: entry.seed, multiplier: entry.multiplier, increment: entry.increment, modulus: entry.modulus });
}

const forward = execute(fixture.primary);
const backward = execute(fixture.return);

assert.deepEqual(forward.states, fixture.primary.states);
assert.deepEqual(backward.states, fixture.return.states);
assert.equal(forward.repeat.period, 6);
assert.equal(forward.inverse_multiplier, 5);
assert.equal(backward.inverse_multiplier, 3);
assert.equal(orbit.verifyReturn(forward, backward), true);
assert.deepEqual(forward.records.map(({ quotient }) => quotient), [0, 1, 0, 2, 1, 2]);
assert.deepEqual(forward.records.map(({ remainder }) => remainder), [3, 2, 6, 4, 5, 1]);

for (const control of fixture.controls) {
  const receipt = execute(control);
  assert.deepEqual(receipt.states, control.states, control.id);
  assert.equal(receipt.repeat.period, control.period, `${control.id} period`);
}

const noninvertible = execute(fixture.controls.find(({ id }) => id === "NONINVERTIBLE_COLLAPSE_A2_M8"));
assert.equal(noninvertible.inverse_multiplier, null);
assert.equal(noninvertible.gcd, 2);

const affine = execute(fixture.controls.find(({ id }) => id === "AFFINE_C1_SEPARATION_CONTROL"));
assert.equal(affine.config.increment, 1);
assert.equal(affine.inverse_multiplier, null);
assert.equal(orbit.verifyReturn(affine, backward), false);

assert.throws(() => orbit.runOrbit({ seed: 1, multiplier: 3, modulus: 1 }), /modulus/);
assert.throws(() => orbit.step(1, { multiplier: Number.MAX_SAFE_INTEGER, increment: 1, modulus: 7 }), /safe integer range/);

console.log("PASS · MODULAR_ORBIT_7 SLOG fixture, inverse return and negative controls are deterministic.");
