import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(here);
const lock = JSON.parse(fs.readFileSync(path.join(here, "assets/a0-euler-tessarec-residual-fold-audit-r1-result-lock.json"), "utf8"));
const resultBytes = fs.readFileSync(path.join(packageRoot, lock.result_json));
const figureBytes = fs.readFileSync(path.join(packageRoot, lock.figure_svg));
const result = JSON.parse(resultBytes);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const close = (left, right, tolerance = 1e-12) => Math.abs(left - right) <= tolerance * Math.max(1, Math.abs(left), Math.abs(right));

assert.equal(sha256(resultBytes), lock.result_json_sha256, "result JSON hash mismatch");
assert.equal(sha256(figureBytes), lock.figure_svg_sha256, "figure SVG hash mismatch");
assert.equal(result.record_id, lock.record_id, "record mismatch");
assert.equal(result.parent_disposition, lock.parent_disposition, "parent disposition mismatch");
assert.equal(result.parent_disposition_changed, false, "secondary audit may not change parent result");
assert.equal(result.localization, lock.localization, "localization mismatch");
assert.equal(result.rank_direction, "descending", "rank direction mismatch");
assert.equal(result.audit.best_c_search_performed, false, "best-c search prohibited");
assert.equal(result.audit.new_null_simulation, false, "new null simulation prohibited");
assert.equal(result.audit.new_primary_test, false, "new primary test prohibited");
assert.equal(result.successor_graph_native_test, "NOT_EXECUTED", "successor execution prohibited");

const positive = result.fold_euler_excess_sse.map((value) => Math.max(0, value));
const positiveTotal = positive.reduce((sum, value) => sum + value, 0);
const expectedShare = (positive[0] + positive[7]) / positiveTotal;
assert.ok(close(result.extreme_share, expectedShare), "extreme-share formula mismatch");
assert.equal(result.localization, expectedShare >= 0.60 ? "EXTREME_CONCENTRATED" : "DISTRIBUTED_OR_MIDDLE_CONCENTRATED", "localization rule mismatch");
assert.deepEqual(result.nontrivial_47.fold_sizes, [6, 6, 6, 6, 6, 6, 6, 5], "47-value fold plan mismatch");
assert.equal(result.nontrivial_47.role, "SECONDARY_ONLY_NO_RESCUE", "47-value track role mismatch");
assert.equal(result.multiplicity.repeated_value_count + result.multiplicity.singleton_value_count, 48, "multiplicity ledger does not close");
assert.equal(result.second_differences.values.length, 46, "second-difference count mismatch");
assert.equal(result.second_differences.largest_absolute.length, 5, "curvature diagnostic count mismatch");

console.log(`PASS ${result.record_id} · ${result.localization} · extreme share ${result.extreme_share.toFixed(6)} · parent negative unchanged`);
