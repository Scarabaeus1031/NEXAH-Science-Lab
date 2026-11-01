const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = __dirname;
const read = (name) => fs.readFileSync(path.join(base, name), 'utf8');
const html = read('A0_WERKBANK.html');
const css = read('a0-number-tower-orientation-lens.css');
const regulator = read('a0-scarab-regulator-test.js');
const desk = read('A0_RESEARCH_DESK.html');
const log = read('A0_BUILDER_LOG.html');
const receipt = JSON.parse(read('results/a0-number-tower-scarab-regulator-return-2026-11-01.json'));
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

const isPrime = (n) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
};
const primeIndex = (target) => {
  let index = 0;
  for (let n = 2; n <= target; n += 1) if (isPrime(n)) index += 1;
  return isPrime(target) ? index : null;
};
const palindrome = (n) => String(n) === [...String(n)].reverse().join('');

check(html.includes('id="numberTowerOrientationLens"'), 'Workbench lens is mounted');
check(html.includes('a0-number-tower-orientation-lens.css'), 'Lens stylesheet is linked');
for (const status of ['EXACT', 'ADDRESS', 'BUILT', 'SOURCE-ONLY']) {
  check(html.includes(`data-status="${status}"`), `Floor ${status} is visible`);
}
check((html.match(/class="nto-floors"/g) || []).length === 1, 'Exactly one floor stack exists');
check((html.match(/<li data-status=/g) || []).length === 4, 'Exactly four floors exist');
for (const value of [1031, 1032, 1033, 1087, 3301]) check(html.includes(String(value)), `Carrier ${value} is visible`);
check(html.includes('EXACT ≠ ADDRESS ≠ BUILT VIEW ≠ SOURCE-ONLY'), 'Status boundary is explicit');
check(html.includes('204</code>, <code>204°</code> und <code>2040'), '204 carriers remain distinct');
check(html.includes('0,456</code> und <code>0,487</code> bleiben deklarierte Displaygewichte'), 'Band-weight claim ceiling is explicit');
check(html.includes('Neue ID, Relation, Study, Finding-Promotion oder Publikationsfreigabe: <code>0</code>'), 'Governance delta is visible');
check(css.includes('.nto-layout'), 'Layout styles exist');
check(css.includes('@media(max-width:900px)'), 'Responsive breakpoint exists');
check(css.includes('[data-status="SOURCE-ONLY"]'), 'Source-only floor has a distinct style');
for (const layer of ['core', 'handle', 'paxis', 'shadow', 'negative']) {
  check(html.includes(`data-nto-toggle="${layer}"`), `Interactive layer ${layer} is mounted`);
}
check(html.includes('data-nto-run'), 'Deterministic contract runner is mounted');
check(regulator.includes('["3303 is composite"') && regulator.includes('Object.entries(groups)'), 'Interactive runner preserves the grouped negative-control contract');
check(regulator.includes('window.A0ScarabRegulator'), 'Interactive verification API is exported');
check(desk.includes('id="number-tower-scarab-regulator-return-20261101"'), 'Science return is bound');
check(log.includes('id="number-tower-scarab-regulator-builder-return-20261101"'), 'Builder return is bound');
check(receipt.status === 'PASS_SOURCE_BOUND_ORIENTATION_LENS', 'Receipt status is PASS');
check(receipt.floor_contract.join('|') === 'EXACT|ADDRESS|BUILT|SOURCE-ONLY', 'Receipt preserves floor order');
check(receipt.interactive_contract.exact_test_count === 17, 'Receipt records the interactive 17-check contract');

for (const [value, index] of [[1031, 173], [1033, 174], [1087, 181], [3301, 464]]) {
  check(isPrime(value), `${value} is prime`);
  check(primeIndex(value) === index, `${value} has prime index ${index}`);
}
check(!isPrime(1032), '1032 is a non-prime connector control');
check(palindrome(181) && palindrome(464), '181 and 464 are palindromic indices');
check(7 ** 4 === 2401, '2401 = 7^4');
check(41 * 61 === 2501, '2501 = 41*61');
check(5002 - 2501 === 2501, '2501 is fixed by R(n)=5002-n');
const phi = (1 + Math.sqrt(5)) / 2;
check(Math.abs(phi ** 3 / Math.PI ** 2 - receipt.exact_records.phi3_over_pi2) < 1e-15, 'phi^3/pi^2 receipt value is exact to machine tolerance');
check(Object.values(receipt.governance_delta).every((value) => value === 0 || value === false), 'Governance delta remains zero');

console.log(`PASS · ${checks}/${checks} Number Tower / Scarab Regulator checks`);
