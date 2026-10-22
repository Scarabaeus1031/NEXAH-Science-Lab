const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const lockPath = path.join(root, 'results', 'a0-machina-prime-return-architecture-lock-2026-10-22.json');
const benchPath = path.join(root, 'A0_ORIENTATION_CONTROLLER_BENCH.html');
const deskPath = path.join(root, 'A0_RESEARCH_DESK.html');
const findingsPath = path.join(root, '..', '32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md');
const imagePath = path.join(root, 'assets', 'images', 'the-machina-nautilus-architecture-v1.png');
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const bench = fs.readFileSync(benchPath, 'utf8');
const desk = fs.readFileSync(deskPath, 'utf8');
const findings = fs.readFileSync(findingsPath, 'utf8');

const primesUpTo = (n) => {
  const primes = [];
  for (let candidate = 2; candidate <= n; candidate += 1) {
    if (primes.every((prime) => prime * prime > candidate || candidate % prime !== 0)) primes.push(candidate);
  }
  return primes;
};
const pi = (n) => primesUpTo(n).length;
const nthPrime = (n) => {
  let candidate = 1;
  let count = 0;
  while (count < n) {
    candidate += 1;
    let prime = true;
    for (let divisor = 2; divisor * divisor <= candidate; divisor += 1) {
      if (candidate % divisor === 0) { prime = false; break; }
    }
    if (prime) count += 1;
  }
  return candidate;
};

assert.equal(57 / 3, 19);
assert.equal(2 ** 3, 8);
assert.equal(nthPrime(8), 19);
assert.deepEqual([19, pi(19), pi(pi(19)), pi(pi(pi(19))), pi(pi(pi(pi(19))))], [19, 8, 4, 2, 1]);
assert.deepEqual([2 ** 3, 2 ** 2, 2 ** 1, 2 ** 0], [8, 4, 2, 1]);
assert.equal(Number(`1${3 ** 2}`), 19);
assert.equal(Number(`1${2 ** 3}`), 18);
assert.equal(3.1 * 2 ** 2, 12.4);
assert.equal(Number(`3${1 * 2 ** 2}`), 34);
assert.equal(2 ** 2 * 3 * 7, 84);
assert.equal(22 ** 2 * 2, 968);
assert.equal(nthPrime(37), 157);
assert.equal([...String(157)].reduce((sum, digit) => sum + Number(digit), 0), 13);
assert.deepEqual(lock.exact_chain.steps, [19, 8, 4, 2, 1]);
assert.deepEqual(lock.power_staircase.orbit, [8, 4, 2, 1]);
assert.equal(lock.new_canonical_ids.length, 0);
assert.equal(lock.relation_changes.length, 0);
assert.match(lock.existing_geometry_return.circle_to_square, /distinct views/);
assert.match(lock.existing_geometry_return.triangle_square_aperture, /same declared Pascal source/);
assert.match(lock.existing_geometry_return.square_diamond_return, /exact reconstruction/);
assert.match(lock.existing_geometry_return.one_two_one, /not side lengths/);
assert.match(lock.existing_geometry_return.hinge_glyph, /no new operator admitted/);
assert.equal(Number(`2${7}`), 27);
assert.equal(3 ** 3, 27);
assert.equal(lock.plug_pink2_tessarec_loki.carrier_reuse, 'MOD:TESSAREC');
assert.equal(lock.plug_pink2_tessarec_loki.bridge_reuse, 'REL:MIWA_LOKI_TESSAREC');
assert.match(lock.plug_pink2_tessarec_loki.separator_semantics, /not division/);
assert.match(lock.plug_pink2_tessarec_loki.glyph_boundary, /not numeric transforms/);
assert.ok(fs.existsSync(imagePath));
assert.match(bench, /id="machinaPrimeReturn"/);
assert.match(bench, /π⁴\(19\)=1/);
assert.match(bench, /1\|57/);
assert.match(bench, /the-machina-nautilus-architecture-v1\.png/);
assert.match(bench, /Bestehender Geometrie-Return/);
assert.match(bench, /1:2:1<\/code> die Diagonalmultiplizitäten/);
assert.match(bench, /Plug-\/Pink-2-Lesart/);
assert.match(desk, /Plug \/ Pink 2 \/ Tessarec–LOKI/);
assert.match(desk, /id="machina-prime-return-science-desk-20261022"/);
assert.match(desk, /DOCUMENTED_FORMAL_OBSERVATION_WITH_OWNER_NOTATION_HOLD/);
assert.match(findings, /id="machina-prime-return-intake-20261022"/);
assert.match(findings, /No new formal finding or manuscript claim/);
assert.match(findings, /22\^2\*2=968/);

console.log('PASS a0-machina-prime-return-tests · 42 assertions');
