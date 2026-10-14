import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(here);
const lockPath = path.join(here, "assets/a0-t64-137-to-8-ring-crosscheck-lock.json");
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
const resultBytes = fs.readFileSync(path.join(packageRoot, lock.result_json));
const result = JSON.parse(resultBytes);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

assert.equal(sha256(resultBytes), lock.result_json_sha256, "result JSON hash mismatch");
assert.equal(result.record_id, lock.record_id, "record mismatch");

const modulus = 365;
const multiplier = 64;
const mod = (value, base) => ((value % base) + base) % base;
const T64 = (value) => mod(multiplier * value, modulus);

assert.equal(mod(137, 73), 64);
assert.equal(multiplier * 137, 8768);
assert.equal(8768, 24 * modulus + 8);
assert.equal(T64(137), 8);

assert.deepEqual([mod(multiplier, 5), mod(multiplier, 73)], [4, 64]);
assert.deepEqual([mod(137, 5), mod(137, 73)], [2, 64]);
assert.deepEqual([mod(8, 5), mod(8, 73)], [3, 8]);
assert.deepEqual([
  mod(mod(multiplier, 5) * mod(137, 5), 5),
  mod(mod(multiplier, 73) * mod(137, 73), 73)
], [3, 8]);

const orbit = [];
let cursor = 137;
do {
  orbit.push(cursor);
  cursor = T64(cursor);
} while (cursor !== 137);
assert.deepEqual(orbit, [137, 8, 147, 283, 227, 293]);
assert.equal(orbit.length, 6);
assert.equal(64 ** 6 % modulus, 1);
assert.equal((64 * 154) % modulus, 1);

assert.equal(11357, 31 * modulus + 42);
assert.equal(mod(11357, modulus), 42);
assert.deepEqual([mod(11357, 5), mod(11357, 73)], [2, 42]);
assert.equal(orbit.includes(42), false);

assert.equal(result.primary_crosscheck.output, 8);
assert.deepEqual(result.primary_crosscheck.orbit, orbit);
assert.equal(result.secondary_crt_check.common_mechanism_established, false);
assert.equal(result.typed_eight.filter((entry) => entry.established_here).length, 1);
assert.equal(result.typed_eight[0].type, "Z365_RESIDUE");
assert.equal(result.governance.new_navigator_identity, false);
assert.equal(result.governance.new_navigator_relation, false);
assert.equal(result.governance.claim_promotion_authorized, false);

console.log(`PASS ${result.record_id} · 137 -> 8 under T64 mod 365 · orbit length 6 · 11357 -> 42 kept separate`);

