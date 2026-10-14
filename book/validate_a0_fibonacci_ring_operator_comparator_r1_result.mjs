#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const model = require("./assets/a0-fibonacci-ring-operator-comparator-r1.js");
const lockPath = path.join(here, "assets/a0-fibonacci-ring-operator-comparator-r1-result-lock.json");
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
const resultPath = path.join(here, "results/a0-fibonacci-ring-operator-comparator-r1-result-2026-10-14.json");
const figurePath = path.join(here, "results/a0-fibonacci-ring-operator-comparator-r1-figure-2026-10-14.svg");
const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
const replay = model.evaluate();
const failures = [];
let checks = 0;
const check = (condition, message) => { checks += 1; if (!condition) failures.push(message); };
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

check(lock.status === "PASS_CONTROLS_DISTINGUISHED_FIBONACCI_NOT_PRIVILEGED", "bounded negative status");
check(hash(resultPath) === lock.result_json_sha256, "result hash");
check(hash(figurePath) === lock.figure_svg_sha256, "figure hash");
check(JSON.stringify(result) === JSON.stringify(replay), "exact deterministic replay");
check(result.operator_chain.decoded_scalar === 1.1, "decoded scalar");
check(result.operator_chain.square_envelope === 1.21, "square envelope");
check(result.operator_chain.effective_phase_span_degrees === 4.048, "effective phase span");
check(result.comparator.sample_count === 48, "matched sample count");
check(result.comparator.seed === 110121, "frozen seed");
check(result.comparator.fibonacci_privileged === false, "Fibonacci not privileged");
check(result.comparator.fibonacci_beats_seeded_random === true, "Fibonacci beats seeded random on fixture");
check(result.comparator.fibonacci_beats_uniform === false, "Fibonacci does not beat uniform");
check(result.governance.authorized_science_run === false, "not a science run");
check(result.governance.closes_g6 === false, "G6 remains open");

console.log(JSON.stringify({ status: failures.length ? "FAIL" : "PASS", checks, failures }, null, 2));
if (failures.length) process.exitCode = 1;
