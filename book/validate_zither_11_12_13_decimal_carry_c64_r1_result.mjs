import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(here);
const lock = JSON.parse(fs.readFileSync(path.join(here, "assets/a0-zither-11-12-13-decimal-carry-c64-r1-result-lock.json"), "utf8"));
const resultBytes = fs.readFileSync(path.join(packageRoot, lock.result_json));
const result = JSON.parse(resultBytes);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
assert.equal(sha256(resultBytes), lock.result_json_sha256, "result JSON hash mismatch");
assert.equal(result.record_id, lock.record_id, "record mismatch");

const isPrime = (value) => {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return false;
  return true;
};
const primes = [];
for (let candidate = 2; primes.length < 100; candidate += 1) if (isPrime(candidate)) primes.push(candidate);
assert.equal(primes[4], 11);
assert.equal(primes[5], 13);
assert.equal(12, 2 ** 2 * 3);

const Y = (n) => 21 * n + 76;
assert.deepEqual([Y(5), Y(6), Y(7)], [181, 202, 223]);
assert.equal(Y(6) - Y(5), 21);
assert.equal(Y(7) - Y(6), 21);
assert.equal(126 + 55, 181);
assert.equal(137 + 65, 202);

assert.equal(isPrime(181), true);
assert.equal(primes.indexOf(181) + 1, 42);
assert.equal(202, 2 * 101);
assert.equal(isPrime(223), true);
assert.equal(primes.indexOf(223) + 1, 48);
assert.equal(181 + 202, 383);
assert.equal(isPrime(383), true);
assert.equal(primes.indexOf(383) + 1, 76);
assert.equal(181 + 223, 404);
assert.equal(2 * 202, 404);
for (const value of [181, 202, 383, 404]) assert.equal(String(value), [...String(value)].reverse().join(""));

const modulus = 365;
const T64 = (k) => (64 * k) % modulus;
assert.equal((64 * 154) % modulus, 1);
assert.deepEqual(Array.from({ length: 6 }, (_, i) => 64 ** (i + 1) % modulus), [64, 81, 74, 356, 154, 1]);
const sector = [0, 73, 146, 219, 292];
for (const k of sector) assert.equal(T64(k), (modulus - k) % modulus);
assert.equal(404 % modulus, 39);
assert.equal((2 * Y(6)) % modulus, 39);
assert.equal(T64(Y(7)), 37);

const congruenceA = [];
const congruenceB = [];
for (let n = 0; n < modulus; n += 1) {
  if ((2 * Y(n)) % modulus === 39) congruenceA.push(n);
  if (T64(Y(n)) === 37) congruenceB.push(n);
}
assert.deepEqual(congruenceA, [6]);
assert.deepEqual(congruenceB, [7]);

const orbit = (seed) => {
  const values = [];
  let k = seed;
  do { values.push(k); k = T64(k); } while (k !== seed);
  return values;
};
assert.deepEqual(orbit(181), [181, 269, 61, 254, 196, 134]);
assert.deepEqual(orbit(202), [202, 153, 302, 348, 7, 83]);
assert.deepEqual(orbit(223), [223, 37, 178, 77, 183, 32]);
assert.deepEqual(orbit(39), [39, 306, 239, 331, 14, 166]);
const visited = new Set();
const census = new Map([[1, 0], [2, 0], [3, 0], [6, 0]]);
for (let k = 0; k < modulus; k += 1) {
  if (visited.has(k)) continue;
  const values = orbit(k);
  values.forEach((value) => visited.add(value));
  census.set(values.length, census.get(values.length) + 1);
}
assert.deepEqual(Object.fromEntries(census), { 1: 1, 2: 2, 3: 24, 6: 48 });
assert.equal(visited.size, 365);

const palindromic = [];
for (let n = 0; n <= 10_000_000; n += 1) {
  const value = Y(n);
  const text = String(value);
  if (text === [...text].reverse().join("")) palindromic.push({ n, Y: value });
}
const adjacent = palindromic.slice(1).flatMap((right, index) => right.n === palindromic[index].n + 1 ? [{ left: palindromic[index], right }] : []);
assert.equal(palindromic.length, 1469);
assert.deepEqual(adjacent, [{ left: { n: 5, Y: 181 }, right: { n: 6, Y: 202 } }]);

assert.equal(result.governance.operator_reconstructed_post_hoc, true);
assert.equal(result.governance.mobius_topology_established, false);
assert.equal(result.glyph_annotation.test_gate, false);
assert.equal(result.governance.new_navigator_identity, false);
console.log(`PASS ${result.record_id} · Y(n)=21n+76 · 181/202 carry · 404->39 · T64(223)=37 · palindrome census exploratory`);
