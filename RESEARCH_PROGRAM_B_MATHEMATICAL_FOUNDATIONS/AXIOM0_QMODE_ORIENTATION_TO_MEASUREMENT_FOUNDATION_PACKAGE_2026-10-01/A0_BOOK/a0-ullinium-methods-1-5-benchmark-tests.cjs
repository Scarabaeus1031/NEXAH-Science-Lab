const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const benchmark = require("./a0_ullinium_methods_1_5_benchmark.cjs");

let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks++; }

const random = benchmark.xorshift32(20261111);
for (const family of ["cycle", "tree", "grid", "fan", "general"]) {
  const source = benchmark.generateGraph(family, family === "grid" ? 10 : 9, random);
  check(source.n >= 6, `${family}: vertex count`);
  check(source.edges.length >= source.n - 1, `${family}: connected edge floor`);
  check(benchmark.paths2(source).length > 0, `${family}: length-two selector exists`);
}

const trial = benchmark.makeTrial("fan", "path2", random);
for (const method of ["PROPERTY_GRAPH", "BIPARTITE_INCIDENCE", "COSPAN_PUSHOUT", "NEXAH_RETURN_RECEIPT"]) {
  const payload = benchmark.encode(method, trial);
  check(benchmark.decode(method, payload).valid, `${method}: valid decode`);
  check(!benchmark.decode(method, benchmark.corrupt(method, payload, trial, false)).valid, `${method}: corruption fails closed`);
  check(!benchmark.decode(method, benchmark.corrupt(method, payload, trial, true)).valid, `${method}: false seam fails closed`);
}
check(!benchmark.decode("ADJACENCY_ONLY", benchmark.encode("ADJACENCY_ONLY", trial)).valid, "adjacency-only has no labelled inverse");

const frozen = JSON.parse(fs.readFileSync(path.join(__dirname, "results/a0-ullinium-methods-1-5-result-2026-11-11.json")));
const replay = benchmark.run();
check(replay.preregistration_sha256 === frozen.preregistration_sha256, "preregistration hash replay");
check(replay.valid_comparison === true, "comparison gates pass");
check(replay.conclusion === "EQUIVALENT_RECOVERY_WITH_EXPLICIT_GOVERNANCE_OVERHEAD", "bounded conclusion replay");
check(replay.methods.ADJACENCY_ONLY.exact_count === 0, "adjacency exact count");
for (const method of ["PROPERTY_GRAPH", "BIPARTITE_INCIDENCE", "COSPAN_PUSHOUT", "NEXAH_RETURN_RECEIPT"]) {
  check(replay.methods[method].exact_count === 10000, `${method}: exact 10000`);
  check(replay.methods[method].corruption_detected_count === 10000, `${method}: corruption 10000`);
  check(replay.methods[method].false_seam_detected_count === 10000, `${method}: seam 10000`);
}
check(replay.comparison.distinct_reconstruction_advantage === false, "no reconstruction advantage");
check(replay.comparison.distinct_robustness_advantage === false, "no robustness advantage");
check(replay.comparison.nexah_byte_ratio_vs_best_standard > 2, "governance payload overhead remains visible");

const fieldNotes = fs.readFileSync(path.join(__dirname, "assets/a0-field-notes/index.html"), "utf8");
const desk = fs.readFileSync(path.join(__dirname, "A0_RESEARCH_DESK.html"), "utf8");
const position = fs.readFileSync(path.join(__dirname, "A0_SCIENTIFIC_POSITION_REPORT.html"), "utf8");
check(fieldNotes.includes("METHODEN 1–5 · 7/7 GATES PASS") && fieldNotes.includes("2,04× Payload"), "Field Notes return is claim-bounded");
check(desk.includes("METHODS 1–5 EQUIVALENT RECOVERY WITH EXPLICIT GOVERNANCE OVERHEAD") && desk.includes("NEXAH METHOD ADVANTAGE NOT SHOWN"), "Science Desk preserves the negative advantage result");
check(position.includes('id="ullinium-methods-1-5-benchmark-20261111"') && position.includes("kein neuer Graphalgorithmus"), "Scientific Position reports the bounded conclusion");

console.log(`A0 Ullinium methods 1–5 benchmark: ${checks} checks PASS`);
