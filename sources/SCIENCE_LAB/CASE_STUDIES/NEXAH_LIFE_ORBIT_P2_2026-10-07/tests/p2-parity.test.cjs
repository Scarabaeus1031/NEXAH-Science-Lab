const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const Engine = require("../life-browser.js");
const p1Root = path.resolve(__dirname, "../../NEXAH_LIFE_ORBIT_P1_2026-10-07");

function p1Run(name) {
  return JSON.parse(fs.readFileSync(path.join(p1Root, "results", `${name}.run.json`), "utf8"));
}

for (const name of ["block", "blinker", "glider"]) {
  test(`${name}: P2 browser engine matches every sealed P1 state`, () => {
    const expected = p1Run(name);
    const actual = Engine.runUntilReturn(name, expected.generation_limit);
    assert.equal(actual.history.length, expected.states.length);
    actual.history.forEach((state, generation) => {
      assert.deepEqual(state.live, expected.states[generation].live);
    });
    assert.deepEqual(actual.event, expected.return_event);
  });
}

test("causal inspector identifies each B3/S23 branch", () => {
  const blinker = Engine.makeState(Engine.FIXTURES.blinker);
  assert.equal(Engine.inspectTransition(blinker, 7, 6).branch, "BIRTH_B3");
  assert.equal(Engine.inspectTransition(blinker, 7, 7).branch, "SURVIVAL_S23");
  assert.equal(Engine.inspectTransition(blinker, 6, 7).branch, "DEATH_UNDERPOPULATION");
  assert.equal(Engine.inspectTransition(blinker, 0, 0).branch, "REMAINS_DEAD");
});

test("seed editing remains canonical and deterministic", () => {
  const initial = Engine.makeState(Engine.FIXTURES.glider);
  const added = Engine.toggleCell(initial, 0, 0);
  const restored = Engine.toggleCell(added, 0, 0);
  assert.deepEqual(restored, initial);
});
