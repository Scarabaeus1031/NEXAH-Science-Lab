"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const engine = require("./engine.js");
const saved = require("./results/CA_IDENT_05_RESULT.json");

let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
const close = (actual, expected, tolerance = 1e-12) => check(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

const hash = crypto.createHash("sha256").update(fs.readFileSync("PREREGISTRATION.json")).digest("hex");
check(hash === "f7520b7bcfa18792cf73af61850ed38bf9a65069c834c5ea5bdf7ea2508d1ede", "preregistration lock changed");
check(engine.TRAIN_SEEDS.length === 25, "training seed count");
check(engine.HOLDOUT_SEEDS.length === 100, "holdout seed count");
check(engine.TRAIN_SEEDS.every((seed) => !engine.HOLDOUT_SEEDS.includes(seed)), "seed overlap");
check(engine.MODELS[1].a === 63 / 64 && engine.MODELS[1].b === 1 / 64, "63/64 weights changed");

const result = engine.evaluate();
check(result.train_rows === 500, "training rows");
check(result.holdout_rows === 2000, "holdout rows");
check(result.coverage_gate_pass === true, "coverage gate");
check(result.holdout_distribution.transient === 49, "transient support");
check(result.holdout_distribution["constant-count motion"] === 19, "novel-class support");
check(!Object.hasOwn(result.train_distribution, "constant-count motion"), "novel class entered training");

const byId = new Map(result.results.map((row) => [row.family, row]));
close(byId.get("fourier_A").macro_f1, 0.530735840871442);
close(byId.get("P_63_1").macro_f1, 0.5276849760265598);
close(byId.get("P_equal").macro_f1, 0.5853203162272669);
close(byId.get("P_1_63_reverse_control").macro_f1, 0.6083678283665357);
check(byId.get("P_1_63_reverse_control").macro_f1 > byId.get("P_63_1").macro_f1, "reverse control no longer strongest");
check(result.primary_gate_pass === false, "primary gate changed");
check(result.specificity_gate_pass === false, "specificity gate changed");
check(result.verdict === "ALPHA_BETA_NO_GAIN", "verdict changed");
check(saved.preregistration_sha256 === hash, "saved lock mismatch");
close(saved.p_63_1_delta_vs_fourier, result.p_63_1_delta_vs_fourier);

process.stdout.write(`${JSON.stringify({ status: "PASS", checks, lock: hash, verdict: result.verdict }, null, 2)}\n`);
