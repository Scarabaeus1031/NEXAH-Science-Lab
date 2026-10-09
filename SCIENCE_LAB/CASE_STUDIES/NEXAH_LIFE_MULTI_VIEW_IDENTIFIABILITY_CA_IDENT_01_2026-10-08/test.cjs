const assert = require("node:assert/strict");
const engine = require("./engine.js");

const block = engine.run("block", 4);
assert.equal(engine.countLive(block[0]), 4);
assert.equal(engine.hashGrid(block[0]), engine.hashGrid(block[4]));
assert.equal(engine.futureClass(block, 0, 4), "fixed");

const blinker = engine.run("blinker", 6);
assert.equal(engine.hashGrid(blinker[0]), engine.hashGrid(blinker[2]));
assert.equal(engine.futureClass(blinker, 0, 6), "period-2");

const gon17 = engine.shadowGonVector(blinker[0], 17);
const gon19 = engine.shadowGonVector(blinker[0], 19);
const gon29 = engine.shadowGonVector(blinker[0], 29);
assert.equal(gon17.length, 34);
assert.equal(gon19.length, 38);
assert.equal(gon29.length, 58);

const points = engine.poincarePoints(blinker[0]);
assert.equal(points.length, 3);
assert(points.every((point) => Math.hypot(...point.disk) < 1));

const report = engine.evaluate();
assert.equal(report.status, "EXECUTED_INTERNAL_FIXTURE");
assert.equal(report.train_rows, 42);
assert.equal(report.holdout_rows, 84);
assert.equal(report.verdict, "LIMITED_VIEW_SIGNAL");
assert.equal(report.best_view, "fourier");
assert.equal(report.results.find((item) => item.family === "polygons").correct, 83);
assert.equal(report.results.find((item) => item.family === "e8_adapter").correct, 36);
assert.equal(report.results.find((item) => item.family === "combined").correct, 82);

console.log(JSON.stringify({ status: "PASS", checks: 16, experiment: report.experiment, verdict: report.verdict }, null, 2));
