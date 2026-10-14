import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(here);
const lock = JSON.parse(fs.readFileSync(path.join(here, "assets/a0-cassini-41-prime-triple-decoder-r1-result-lock.json"), "utf8"));
const resultBytes = fs.readFileSync(path.join(packageRoot, lock.result_json));
const result = JSON.parse(resultBytes);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
assert.equal(sha256(resultBytes), lock.result_json_sha256, "result JSON hash mismatch");
assert.equal(result.record_id, lock.record_id, "record mismatch");

const fibonacci = [0n, 1n];
for (let n = 2; n <= 82; n += 1) fibonacci.push(fibonacci[n - 1] + fibonacci[n - 2]);
const counts = new Map([[39, 0], [42, 0]]);
for (let n = 1; n <= 81; n += 1) {
  const epsilon = fibonacci[n + 1] * fibonacci[n - 1] - fibonacci[n] ** 2n;
  assert.equal(epsilon, n % 2 === 0 ? 1n : -1n, `Cassini mismatch at n=${n}`);
  const numerator = 3n * epsilon - 1n;
  assert.equal(numerator % 2n, 0n, `nonintegral decoder at n=${n}`);
  const output = Number(41n + numerator / 2n);
  assert.equal(output, n % 2 === 0 ? 42 : 39, `channel mismatch at n=${n}`);
  counts.set(output, counts.get(output) + 1);
}
assert.equal(counts.get(39), 41);
assert.equal(counts.get(42), 40);

const primes = [];
const isPrime = (value) => {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return false;
  return true;
};
for (let candidate = 2; primes.length < 100; candidate += 1) if (isPrime(candidate)) primes.push(candidate);
assert.deepEqual(primes.slice(0, 6), [2, 3, 5, 7, 11, 13]);
assert.equal(primes[0] * primes[1] * primes[3], 42);
assert.equal(primes[1] * (primes[0] * primes[1] + primes[3]), 39);
assert.equal(42 - 1, 41);
assert.equal(39 + 2, 41);

const solutions = [];
for (let i = 0; i < primes.length; i += 1) {
  for (let j = i + 1; j < primes.length; j += 1) {
    for (let k = j + 1; k < primes.length; k += 1) {
      const [a, b, c] = [primes[i], primes[j], primes[k]];
      if (a * b * c - 1 === b * (a * b + c) + a) solutions.push({ indices: [i + 1, j + 1, k + 1], primes: [a, b, c] });
    }
  }
}
assert.deepEqual(solutions, [{ indices: [1, 2, 4], primes: [2, 3, 7] }]);
assert.equal(result.double_path.unique_over_all_strictly_increasing_prime_triples, true);
assert.equal(result.decoder.specificity, "SATURATED_TWO_POINT_AFFINE_DECODER");
assert.equal(result.governance.formula_class_post_hoc, true);
assert.equal(result.governance.new_navigator_identity, false);
console.log(`PASS ${result.record_id} · unique prime triple (P1,P2,P4) · channels 39/42 · saturated decoder retained`);
