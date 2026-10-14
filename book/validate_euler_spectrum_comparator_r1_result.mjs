import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(here);
const lock = JSON.parse(fs.readFileSync(path.join(here, "assets/a0-euler-spectrum-comparator-r1-result-lock.json"), "utf8"));
const resultPath = path.join(packageRoot, lock.result_json);
const figurePath = path.join(packageRoot, lock.figure_svg);
const resultBytes = fs.readFileSync(resultPath);
const figureBytes = fs.readFileSync(figurePath);
const result = JSON.parse(resultBytes);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const close = (left, right, tolerance = 1e-12) => Math.abs(left - right) <= tolerance * Math.max(1, Math.abs(left), Math.abs(right));

assert.equal(sha256(resultBytes), lock.result_json_sha256, "result JSON hash mismatch");
assert.equal(sha256(figureBytes), lock.figure_svg_sha256, "figure SVG hash mismatch");
assert.equal(result.record_id, lock.record_id, "record mismatch");
assert.equal(result.disposition, lock.disposition, "disposition mismatch");
assert.equal(result.rank_direction, "descending", "rank direction mismatch");
assert.equal(result.null.accepted, 10000, "accepted null count mismatch");
assert.equal(result.null.seed, 20261013, "seed mismatch");
assert.equal(result.null.attempts, result.null.accepted + Object.values(result.null.rejected).reduce((sum, value) => sum + value, 0), "generation ledger does not close");
assert.equal(result.audit.best_c_search_performed, false, "best-c search prohibited");

const errors = result.observed.cv_nrmse;
const expectedAE = (errors.M1 - errors.ME) / errors.M1;
const expectedGQ = (errors.ME - errors.M2) / errors.M2;
assert.ok(close(result.observed.A_E, expectedAE), "A_E formula mismatch");
assert.ok(close(result.observed.G_Q, expectedGQ), "G_Q formula mismatch");
assert.equal(result.decision_gates.A_E_at_least_0_05, result.observed.A_E >= 0.05, "A_E threshold gate mismatch");
assert.equal(result.decision_gates.A_E_above_null_q95, result.observed.A_E > result.null.A_E_q95, "null percentile gate mismatch");
assert.equal(result.decision_gates.G_Q_at_most_0_05, result.observed.G_Q <= 0.05, "G_Q gate mismatch");
const allPass = result.decision_gates.A_E_at_least_0_05 && result.decision_gates.A_E_above_null_q95 && result.decision_gates.G_Q_at_most_0_05;
assert.equal(result.decision_gates.all_gates_pass, allPass, "combined decision gate mismatch");
assert.equal(result.disposition, allPass ? "EULER_SHAPE_SIGNAL" : "NO_EULER_SPECIFIC_SPECTRAL_SUPPORT", "registered disposition rule mismatch");
assert.ok(close(result.null.monte_carlo_p_upper, (1 + result.null.observed_exceedances) / (1 + result.null.accepted)), "Monte Carlo p-value mismatch");
assert.equal(lock.owner_acceptance, "ACCEPTED_BOUNDED_NEGATIVE_2026-10-13", "Owner acceptance record mismatch");

console.log(`PASS ${result.record_id} · ${result.disposition} · 10000 nulls · decision ledger closes · owner accepted bounded negative`);
