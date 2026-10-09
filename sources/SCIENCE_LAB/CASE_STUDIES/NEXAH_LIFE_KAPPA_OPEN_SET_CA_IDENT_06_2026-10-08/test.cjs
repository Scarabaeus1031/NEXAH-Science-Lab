"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const engine = require("./engine.js");
const saved = require("./results/CA_IDENT_06_RESULT.json");

let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
const close = (actual, expected, tolerance = 1e-12) => check(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const hash = crypto.createHash("sha256").update(fs.readFileSync("PREREGISTRATION.json")).digest("hex");

check(hash === "f98949089031183c8b035328fcd2cd56ff698b93a6ac66cfda1cec4407c9ed41", "preregistration lock changed");
check(engine.TRAIN_SEEDS.length === 125, "training seed count");
check(engine.EVAL_SEEDS.length === 100, "evaluation seed count");
check(engine.TRAIN_SEEDS.every((seed) => !engine.EVAL_SEEDS.includes(seed)), "seed overlap");
check(engine.UNKNOWN === "constant-count motion", "unknown class changed");

const result = engine.evaluate();
check(result.discovery_rows === 2500, "discovery rows");
check(result.known_training_rows === 2482, "known training rows");
check(result.excluded_registered_unknown_rows === 18, "excluded unknown rows");
check(result.evaluation_rows === 2000, "evaluation rows");
check(result.unknown_support === 0, "unexpected unknown support");
check(result.coverage_gate_pass === false, "coverage gate changed");
close(result.kappa_threshold, 0.09728865549241666);
check(result.known_abstained === 13, "known abstentions");
close(result.known_specificity, 0.9935);
close(result.known_accepted_accuracy, 0.9501761449421238);
close(result.seam_disagreement_known_rate, 0.081);
check(result.primary_gate_pass === false, "primary gate changed");
check(result.verdict === "COVERAGE_GATE_FAIL", "verdict changed");
check(saved.preregistration_sha256 === hash, "saved lock mismatch");
close(saved.known_specificity, result.known_specificity);

process.stdout.write(`${JSON.stringify({ status: "PASS", checks, lock: hash, verdict: result.verdict }, null, 2)}\n`);
