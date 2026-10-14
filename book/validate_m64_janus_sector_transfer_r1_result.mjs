import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(here);
const read = (relativePath) => fs.readFileSync(path.join(packageRoot, relativePath));
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const lock = JSON.parse(fs.readFileSync(path.join(here, "assets/a0-m64-janus-sector-transfer-r1-result-lock.json"), "utf8"));

for (const [field, hashField] of [
  ["protocol_json", "protocol_json_sha256"],
  ["result_json", "result_json_sha256"],
  ["registry_json", "registry_json_sha256"],
  ["runner", "runner_sha256"],
  ["validator", "validator_sha256"]
]) {
  assert.equal(sha256(read(lock[field])), lock[hashField], `${field} hash mismatch`);
}

const protocol = JSON.parse(read(lock.protocol_json));
const result = JSON.parse(read(lock.result_json));
const registry = JSON.parse(read(lock.registry_json));
assert.equal(protocol.record_id, lock.record_id);
assert.equal(result.record_id, lock.record_id);

const mod = (value, modulus) => ((value % modulus) + modulus) % modulus;
const gcd = (left, right) => right === 0 ? Math.abs(left) : gcd(right, left % right);
const order = (value, modulus) => {
  assert.equal(gcd(value, modulus), 1);
  let cursor = 1;
  for (let exponent = 1; exponent <= modulus; exponent += 1) {
    cursor = mod(cursor * value, modulus);
    if (cursor === 1) return exponent;
  }
  throw new Error("order not found");
};
const equalizer = (multiplier, modulus) => Array.from(
  {length: modulus},
  (_, value) => value
).filter((value) => mod(multiplier * value, modulus) === mod(-value, modulus));

for (const {modulus, factors: [p, q]} of protocol.systems) {
  const record = result.systems[String(modulus)];
  assert.deepEqual(record.factorization, [p, q]);
  assert.deepEqual(record.multiplier_channels, [mod(64, p), mod(64, q)]);
  assert.deepEqual(record.local_orders, [order(mod(64, p), p), order(mod(64, q), q)]);

  const agreement = equalizer(64, modulus);
  assert.equal(agreement.length, gcd(65, modulus));
  assert.equal(record.mirror_equalizer.predicted_size, gcd(65, modulus));
  assert.equal(record.mirror_equalizer.enumerated_size, agreement.length);
  assert.equal(record.mirror_equalizer.generator_step, modulus / agreement.length);
  assert.deepEqual(record.mirror_equalizer.elements, agreement);

  for (const axis of record.factor_axes) {
    const elements = Array.from({length: axis.coordinate_modulus}, (_, index) => axis.embedding_step * index);
    const matches = elements.filter((value) => mod(64 * value, modulus) === mod(-value, modulus));
    assert.equal(axis.embedding_step * axis.coordinate_modulus, modulus);
    assert.equal(axis.induced_multiplier, mod(64, axis.coordinate_modulus));
    assert.equal(axis.induced_order, order(axis.induced_multiplier, axis.coordinate_modulus));
    assert.equal(axis.is_full_mirror_sector, axis.induced_multiplier === axis.coordinate_modulus - 1);
    assert.deepEqual(axis.mirror_agreement_elements, matches);
  }

  assert.equal(equalizer(modulus - 1, modulus).length, modulus);
  assert.equal(equalizer(1, modulus).length, 1);
}

assert.deepEqual(result.systems["365"].mirror_equalizer.elements, [0, 73, 146, 219, 292]);
assert.equal(result.systems["365"].factor_axes[0].is_full_mirror_sector, true);
assert.equal(result.systems["365"].factor_axes[1].is_full_mirror_sector, false);
assert.deepEqual(result.systems["2501"].mirror_equalizer.elements, [0]);
assert.equal(result.systems["2501"].factor_axes.every((axis) => !axis.is_full_mirror_sector), true);
assert.equal(result.transfer_verdict.code, "CARRIER_BOUND_JANUS_SECTOR_AT_365_NO_NONTRIVIAL_TRANSFER_TO_2501");

const registryIds = new Set(registry.instances.map((entry) => entry.instance_id));
assert.equal(registryIds.has("A0.MOD.MULTIPLY/64@365"), true);
assert.equal(registryIds.has("A0.MOD.MULTIPLY/64@2501"), true);
assert.equal(registry.governance.orion_registry_mutated, false);
assert.equal(result.governance.navigator_identity_created, false);
assert.equal(result.governance.claim_promotion_authorized, false);

console.log(`PASS ${result.record_id} · mirror equalizer exhaustive on 365/2501 · nontrivial Janus sector is carrier-bound`);

