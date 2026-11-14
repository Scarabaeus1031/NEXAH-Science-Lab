import assert from "node:assert/strict";

function stepGeneral(state, c, betaFeedback) {
  const { zr, zi, previousR, previousI } = state;
  return {
    zr: zr * zr - zi * zi + c.r + betaFeedback * (zr - previousR),
    zi: 2 * zr * zi + c.i + betaFeedback * (zi - previousI),
    previousR: zr,
    previousI: zi,
  };
}

function stepClassical(state, c) {
  const { zr, zi } = state;
  return {
    zr: zr * zr - zi * zi + c.r,
    zi: 2 * zr * zi + c.i,
    previousR: zr,
    previousI: zi,
  };
}

function trajectory(initial, c, betaFeedback, steps = 24) {
  let state = { ...initial };
  const result = [];
  for (let index = 0; index < steps; index += 1) {
    state = stepGeneral(state, c, betaFeedback);
    result.push(state);
  }
  return result;
}

function boundedShare(betaFeedback, resolution = 38) {
  let bounded = 0;
  let meanEscape = 0;
  let escaped = 0;
  const maxIterations = 42;

  for (let y = 0; y < resolution; y += 1) {
    for (let x = 0; x < resolution; x += 1) {
      const zr0 = -1.55 + (3.1 * x) / (resolution - 1);
      const zi0 = 1.25 - (2.5 * y) / (resolution - 1);
      let state = { zr: zr0, zi: zi0, previousR: zr0, previousI: zi0 };
      let iteration = 0;
      for (; iteration < maxIterations; iteration += 1) {
        state = stepGeneral(state, { r: -0.745, i: 0.113 }, betaFeedback);
        if (state.zr * state.zr + state.zi * state.zi > 16) break;
      }
      if (iteration === maxIterations) bounded += 1;
      else {
        escaped += 1;
        meanEscape += iteration;
      }
    }
  }

  return {
    boundedShare: bounded / (resolution * resolution),
    meanEscape: escaped ? meanEscape / escaped : maxIterations,
  };
}

const samples = [
  { initial: { zr: 0, zi: 0, previousR: 0, previousI: 0 }, c: { r: -0.7, i: 0.27015 } },
  { initial: { zr: -0.2, zi: 0.4, previousR: -0.2, previousI: 0.4 }, c: { r: -0.745, i: 0.113 } },
  { initial: { zr: 0.31, zi: -0.17, previousR: 0.31, previousI: -0.17 }, c: { r: -0.4, i: 0.6 } },
];

for (const { initial, c } of samples) {
  let general = { ...initial };
  let classical = { ...initial };
  for (let index = 0; index < 20; index += 1) {
    general = stepGeneral(general, c, 0);
    classical = stepClassical(classical, c);
    assert.deepEqual(general, classical, "β_feedback = 0 must recover the classical recurrence");
  }
}

const resting = { zr: 0.2, zi: -0.1, previousR: 0.2, previousI: -0.1 };
assert.deepEqual(
  stepGeneral(resting, { r: -0.5, i: 0.2 }, 0.4),
  stepClassical(resting, { r: -0.5, i: 0.2 }),
  "the first feedback contribution must vanish when current and previous states coincide",
);

const seed = { zr: -0.12, zi: 0.31, previousR: -0.12, previousI: 0.31 };
const c = { r: -0.745, i: 0.113 };
const negative = trajectory(seed, c, -0.18, 8);
const baseline = trajectory(seed, c, 0, 8);
const positive = trajectory(seed, c, 0.18, 8);
assert.notDeepEqual(negative.slice(2), baseline.slice(2), "negative feedback must alter the later passage");
assert.notDeepEqual(positive.slice(2), baseline.slice(2), "positive feedback must alter the later passage");
assert.notDeepEqual(negative.slice(2), positive.slice(2), "feedback sign must remain observable");

const metrics = [-0.18, 0, 0.18].map((betaFeedback) => boundedShare(betaFeedback));
for (const metric of metrics) {
  assert.ok(Number.isFinite(metric.boundedShare));
  assert.ok(Number.isFinite(metric.meanEscape));
}
assert.notDeepEqual(metrics[0], metrics[2], "opposite feedback views should not collapse to one sampled result");

console.log("PASS — B2 Beta Return implementation self-check");
console.log(JSON.stringify({ beta: [-0.18, 0, 0.18], metrics }, null, 2));
