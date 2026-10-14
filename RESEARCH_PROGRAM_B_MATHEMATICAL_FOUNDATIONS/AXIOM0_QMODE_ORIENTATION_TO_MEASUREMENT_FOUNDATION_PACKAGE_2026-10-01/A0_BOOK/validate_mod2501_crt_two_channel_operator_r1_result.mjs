import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(here);
const lock = JSON.parse(fs.readFileSync(path.join(here, "assets/a0-mod2501-crt-two-channel-operator-r1-result-lock.json"), "utf8"));
const resultBytes = fs.readFileSync(path.join(packageRoot, lock.result_json));
const registryBytes = fs.readFileSync(path.join(packageRoot, lock.registry_json));
const result = JSON.parse(resultBytes);
const registry = JSON.parse(registryBytes);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

assert.equal(sha256(resultBytes), lock.result_json_sha256, "result JSON hash mismatch");
assert.equal(sha256(registryBytes), lock.registry_json_sha256, "registry JSON hash mismatch");
assert.equal(result.record_id, lock.record_id, "record mismatch");

const mod = (value, modulus) => ((value % modulus) + modulus) % modulus;
const gcd = (left, right) => right === 0 ? Math.abs(left) : gcd(right, left % right);
const egcd = (left, right) => {
  if (right === 0) return [Math.abs(left), left < 0 ? -1 : 1, 0];
  const [g, x1, y1] = egcd(right, left % right);
  return [g, y1, x1 - Math.trunc(left / right) * y1];
};
const inverse = (value, modulus) => {
  const [g, x] = egcd(mod(value, modulus), modulus);
  return g === 1 ? mod(x, modulus) : null;
};
const order = (value, modulus) => {
  assert.equal(gcd(value, modulus), 1, "order requires a unit");
  let cursor = 1;
  for (let exponent = 1; exponent <= modulus; exponent += 1) {
    cursor = mod(cursor * value, modulus);
    if (cursor === 1) return exponent;
  }
  throw new Error("order not found");
};
const split = (value, p, q) => [mod(value, p), mod(value, q)];
const bind = (rp, rq, p, q) => {
  if (gcd(p, q) !== 1) throw new Error("CRT channels must be coprime");
  const M = p * q;
  return mod(rp * q * inverse(q, p) + rq * p * inverse(p, q), M);
};
const cycleCensus = (fn, modulus) => {
  const visited = new Set();
  const census = {};
  for (let seed = 0; seed < modulus; seed += 1) {
    if (visited.has(seed)) continue;
    const orbit = [];
    let cursor = seed;
    do {
      assert.equal(visited.has(cursor), false, "map is not a permutation");
      visited.add(cursor);
      orbit.push(cursor);
      cursor = fn(cursor);
    } while (cursor !== seed);
    census[orbit.length] = (census[orbit.length] ?? 0) + 1;
  }
  return census;
};

const systems = [
  { modulus: 365, p: 5, q: 73, expectedOutput: 8 },
  { modulus: 2501, p: 41, q: 61, expectedOutput: 1265 }
];
for (const system of systems) {
  assert.equal(system.p * system.q, system.modulus);
  for (let value = 0; value < system.modulus; value += 1) {
    const channels = split(value, system.p, system.q);
    assert.equal(bind(...channels, system.p, system.q), value);
    const direct = mod(64 * value, system.modulus);
    const channelOutput = [mod(64 * channels[0], system.p), mod(64 * channels[1], system.q)];
    assert.deepEqual(split(direct, system.p, system.q), channelOutput);
    assert.equal(bind(...channelOutput, system.p, system.q), direct);
  }
  assert.equal(mod(64 * 137, system.modulus), system.expectedOutput);
}

assert.equal(inverse(64, 365), 154);
assert.equal(order(64, 365), 6);
assert.deepEqual(cycleCensus((value) => mod(64 * value, 365), 365), {1: 1, 2: 2, 3: 24, 6: 48});

assert.equal(inverse(64, 2501), 1993);
assert.equal(order(64, 2501), 10);
assert.deepEqual(split(64, 41, 61), [23, 3]);
assert.deepEqual(split(137, 41, 61), [14, 15]);
assert.deepEqual(split(1265, 41, 61), [35, 45]);
assert.deepEqual(cycleCensus((value) => mod(64 * value, 2501), 2501), {1: 1, 10: 250});

for (const [multiplier, expectedKernel, expectedImage, expectedAt137] of [[41, 41, 61, 615], [61, 61, 41, 854]]) {
  const outputs = Array.from({length: 2501}, (_, value) => mod(multiplier * value, 2501));
  assert.equal(outputs.filter((value) => value === 0).length, expectedKernel);
  assert.equal(new Set(outputs).size, expectedImage);
  assert.equal(outputs[137], expectedAt137);
}

assert.deepEqual(cycleCensus((value) => mod(-value, 2501), 2501), {1: 1, 2: 1250});
assert.deepEqual(cycleCensus((value) => mod(value + 100, 2501), 2501), {2501: 1});

assert.deepEqual(split(13183, 131, 83), [83, 69]);
assert.equal(bind(83, 69, 131, 83), 2310);
assert.equal((13183 - 2310) / 10873, 1);
assert.equal(13183, 10873 + 2310);
assert.throws(() => bind(1, 2, 5, 15), /coprime/);

const classIds = registry.classes.map((entry) => entry.class_id);
const instanceIds = registry.instances.map((entry) => entry.instance_id);
assert.equal(new Set(classIds).size, classIds.length);
assert.equal(new Set(instanceIds).size, instanceIds.length);
assert.deepEqual(registry.reused_source_types, ["OP_MODULO", "OP_CONGRUENCE"]);
for (const instance of registry.instances) {
  for (const classId of instance.class_ids) assert.equal(classIds.includes(classId), true, `unknown class ${classId}`);
}
assert.equal(registry.governance.orion_registry_mutated, false);
assert.equal(registry.governance.navigator_identity_created, false);
assert.equal(result.governance.physical_coupling_established, false);
assert.equal(result.governance.privileged_modulus_established, false);

console.log(`PASS ${result.record_id} · exhaustive CRT commuting squares · M64 carrier specificity · local registry ${registry.classes.length} classes/${registry.instances.length} instances`);

