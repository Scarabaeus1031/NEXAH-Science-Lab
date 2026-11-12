const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const benchmark = require("./a0_ullinium_closing_receipt_benchmark.cjs");

const result = benchmark.run();
const frozen = JSON.parse(fs.readFileSync(path.join(__dirname, "results/a0-ullinium-closing-receipt-result-2026-11-11.json"), "utf8"));
const preregBytes = fs.readFileSync(path.join(__dirname, "results/a0-ullinium-closing-receipt-preregistration-2026-11-11.json"));

assert.equal(result.preregistration_sha256, crypto.createHash("sha256").update(preregBytes).digest("hex"));
assert.deepEqual(result.exact_counts, frozen.exact_counts);
assert.deepEqual(result.gates, frozen.gates);
assert.equal(result.outcome, "PASS_BOUNDED_INFORMATION_RETURN");
assert.equal(result.receipt_advantage, 0.9964);
assert.deepEqual(result.identity_effect, { new_identity: 0, new_relation: 0, new_alias: 0, study: 0, finding: 0, publication: 0 });

console.log("A0 Ullinium closing receipt benchmark: 18 replay checks PASS");
