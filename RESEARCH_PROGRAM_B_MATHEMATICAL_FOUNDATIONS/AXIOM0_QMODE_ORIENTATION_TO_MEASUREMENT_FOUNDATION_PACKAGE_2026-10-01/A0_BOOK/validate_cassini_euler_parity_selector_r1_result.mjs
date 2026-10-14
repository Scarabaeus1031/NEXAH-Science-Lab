import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(here);
const lockPath = path.join(here, "assets/a0-cassini-euler-parity-selector-r1-result-lock.json");
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
const resultPath = path.join(packageRoot, lock.result_json);
const resultBytes = fs.readFileSync(resultPath);
const result = JSON.parse(resultBytes);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

assert.equal(sha256(resultBytes), lock.result_json_sha256, "result JSON hash mismatch");
assert.equal(result.record_id, lock.record_id, "record mismatch");
assert.equal(result.disposition, "EXACT_PARITY_REPARAMETERIZATION", "unexpected disposition");
assert.equal(result.domain.n_min, 1, "domain must begin at n=1");
assert.equal(result.domain.n_max, 81, "domain must end at n=81");

const fibonacci = [0n, 1n];
for (let n = 2; n <= result.domain.n_max + 1; n += 1) {
  fibonacci.push(fibonacci[n - 1] + fibonacci[n - 2]);
}

const eulerPlus = (n) => n * n + n + 41n;
const eulerMinus = (n) => n * n - n + 41n;
const isPrime = (value) => {
  if (value < 2n) return false;
  if (value % 2n === 0n) return value === 2n;
  for (let divisor = 3n; divisor * divisor <= value; divisor += 2n) {
    if (value % divisor === 0n) return false;
  }
  return true;
};

const rows = [];
for (let n = result.domain.n_min; n <= result.domain.n_max; n += 1) {
  const index = BigInt(n);
  const cassini = fibonacci[n + 1] * fibonacci[n - 1] - fibonacci[n] ** 2n;
  const parity = n % 2 === 0 ? 1n : -1n;
  const selected = index * index + cassini * index + 41n;
  const parityControl = index * index + parity * index + 41n;
  assert.equal(cassini, parity, `Cassini parity mismatch at n=${n}`);
  assert.equal(selected, parityControl, `parity-control mismatch at n=${n}`);
  assert.equal(selected, n % 2 === 0 ? eulerPlus(index) : eulerMinus(index), `branch mismatch at n=${n}`);
  assert.equal(eulerMinus(index), eulerPlus(index - 1n), `Euler shift mismatch at n=${n}`);
  rows.push({ n, selected, prime: isPrime(selected) });
}

for (let k = 1; k <= 40; k += 1) {
  const even = rows[2 * k - 1].selected;
  const odd = rows[2 * k].selected;
  const index = BigInt(2 * k);
  assert.equal(even, odd, `pair fold mismatch at k=${k}`);
  assert.equal(even, eulerPlus(index), `even Euler+ mismatch at k=${k}`);
  assert.equal(even, 4n * BigInt(k) ** 2n + 2n * BigInt(k) + 41n, `closed pair law mismatch at k=${k}`);
}

const unique = [...new Set(rows.map(({ selected }) => selected.toString()))].map(BigInt);
const firstComposite = rows.find(({ prime }) => !prime);
assert.equal(unique.length, result.exact_gates.unique_value_count, "unique count mismatch");
assert.equal(rows.filter(({ prime }) => prime).length, result.descriptive_primality.prime_rows, "prime-row count mismatch");
assert.equal(unique.filter(isPrime).length, result.descriptive_primality.prime_unique_values, "unique-prime count mismatch");
assert.equal(firstComposite.n, result.descriptive_primality.first_composite.n, "first composite index mismatch");
assert.equal(Number(firstComposite.selected), result.descriptive_primality.first_composite.value, "first composite value mismatch");
assert.equal(result.information_audit.fibonacci_magnitude_used, false, "magnitude-use claim mismatch");
assert.equal(result.governance.new_navigator_identity, false, "new identity prohibited");
assert.equal(result.governance.claim_promotion_authorized, false, "claim promotion prohibited");

console.log(`PASS ${result.record_id} · ${result.disposition} · 81 rows -> ${unique.length} unique outputs · first composite ${firstComposite.selected}`);
