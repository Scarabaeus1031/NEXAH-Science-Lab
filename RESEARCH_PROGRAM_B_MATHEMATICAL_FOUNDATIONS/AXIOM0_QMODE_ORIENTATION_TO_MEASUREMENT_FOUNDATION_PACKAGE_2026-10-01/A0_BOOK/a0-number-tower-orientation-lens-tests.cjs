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
check(html.includes('class="nto-elevator"'), 'Prime Elevator is mounted');
check(html.includes('data-pe-filter') && html.includes('data-pe-sort'), 'Prime Elevator filter and sort controls are mounted');
check(html.includes('7801 = 29×269'), 'Composite reversal of 1087 is disclosed');
check(html.includes('99/989') && html.includes('17/99'), 'Bounded density and survivor counts are visible');
check(regulator.includes('elevatorRecords.length===99'), 'Interactive runner checks 99 palindromic indices');
check(regulator.includes('mirrorSurvivors.length===17'), 'Interactive runner checks 17 prime reversals');
check(html.includes('class="nto-hinge-press"'), '180-degree hinge and press comparator are mounted');
check((html.match(/data-hp-phase="[1-4]"/g) || []).length >= 5, 'Four phase controls and initial phase state are mounted');
check(html.includes('97 + C = 197') && html.includes('G₆H₇ → 67'), 'Blue Lens and GH address records are visible');
check(regulator.includes('179 and 181 are twin primes'), 'Interactive runner checks the twin-prime hinge');
check(regulator.includes('97 + Roman C = 197'), 'Interactive runner checks the Roman-C addition');
check(html.includes('class="nto-generation-bridge"'), 'G/Q17 Generation Bridge is mounted');
check(html.includes('G₇') && html.includes('p₇') && html.includes('Q₁₇'), 'Exact G7 to p7 to Q17 chain is visible');
check(html.includes('G₆ · Q₁₆') && html.includes('p₁₇ = 59') && html.includes('q17/r11'), 'Generation negative controls are visible');
check(html.includes('G = A∩B∩C'), 'DEFG G relation role remains visible and separate');
check((html.match(/→ p[₁₂₃₄₅₆₇₈₉]=/g) || []).length === 9, 'Nine in-alphabet prime lanes are visible');
check(html.includes('p₁₀=29') || html.includes('p10=29'), 'p10=29 alphabet exit is disclosed');
check(html.includes('TESA R1C7 SELECTOR'), 'TESA R1C7 source selector is visible');
check(html.includes('nur eine von neun regulären Prime-Brücken'), 'G/Q17 non-uniqueness verdict is explicit');
check(html.includes('class="nto-selector-matrix"'), 'Nine-lane selector matrix is mounted');
check((html.match(/data-sm-selected="(?:true|false)"/g) || []).length === 9, 'Selector matrix contains nine typed lane rows');
check((html.match(/data-sm-selected="true"/g) || []).length === 1, 'Selector matrix contains one source-selected lane');
check(html.includes('Reverse-Prime und Twin-Membership lassen sechs Lanes stehen'), 'Arithmetic non-uniqueness result is visible');
check(regulator.includes('G7 to p7=17 to Q17 holds under A1Z26'), 'Interactive runner checks the declared A1Z26 bridge');
check(regulator.includes('source image equations are rejected'), 'Interactive runner rejects the supplied false equations');
check(regulator.includes('exactly nine prime lifts remain inside A1Z26'), 'Interactive runner checks the full nine-lane set');
check(regulator.includes('six lanes survive reverse and twin intersection'), 'Interactive runner checks the six-lane arithmetic intersection');
check(regulator.includes('D/G7 is a matched arithmetic control') && regulator.includes('F/M13 is a matched arithmetic control'), 'Interactive runner checks matched D and F control lanes');
check(desk.includes('id="number-tower-scarab-regulator-return-20261101"'), 'Science return is bound');
check(log.includes('id="number-tower-scarab-regulator-builder-return-20261101"'), 'Builder return is bound');
check(receipt.status === 'PASS_SOURCE_BOUND_ORIENTATION_LENS', 'Receipt status is PASS');
check(receipt.floor_contract.join('|') === 'EXACT|ADDRESS|BUILT|SOURCE-ONLY', 'Receipt preserves floor order');
check(receipt.interactive_contract.exact_test_count === 58, 'Receipt records the interactive 58-check contract');
check(receipt.prime_elevator_contract.palindromic_index_count === 99, 'Receipt records the bounded 99-index set');
check(receipt.prime_elevator_contract.prime_reversal_survivor_count === 17, 'Receipt records the 17 reversal survivors');
check(receipt.hinge_press_contract.index_hinge.sum === 360, 'Receipt records the 179/180/181 index hinge');
check(receipt.hinge_press_contract.prime_value_projection.gap_ratio === '1:3', 'Receipt records the asymmetric prime-value projection');
check(receipt.generation_bridge_contract.exact_chain.p7 === 17, 'Receipt records p7=17');
check(receipt.generation_bridge_contract.controls.p17 === 59, 'Receipt records p17=59 negative control');
check(receipt.generation_bridge_contract.ladder.in_alphabet_count === 9, 'Receipt records all nine in-alphabet prime lanes');
check(receipt.generation_bridge_contract.selection.verdict === 'SOURCE_SELECTED_NOT_ARITHMETICALLY_UNIQUE', 'Receipt records the bounded G/Q17 selection verdict');
check(receipt.generation_bridge_contract.selector_matrix.arithmetic_intersection_count === 6, 'Receipt records the six arithmetic survivors');
check(receipt.generation_bridge_contract.selector_matrix.source_selected_count === 1, 'Receipt records one TESA-selected lane');

for (const [value, index] of [[1031, 173], [1033, 174], [1087, 181], [3301, 464]]) {
  check(isPrime(value), `${value} is prime`);
  check(primeIndex(value) === index, `${value} has prime index ${index}`);
}
check(!isPrime(1032), '1032 is a non-prime connector control');
check(palindrome(181) && palindrome(464), '181 and 464 are palindromic indices');
check(!isPrime(7801) && 7801 === 29 * 269, '1087 reversal is composite 29*269');
check(isPrime(1033) && String(3301).split('').reverse().join('') === '1033', '3301 reversal is prime 1033');
check(isPrime(179) && isPrime(181) && 179 + 181 === 360, '179 and 181 are twin primes around 180');
check(primeIndex(97) === 25 && primeIndex(197) === 45 && 97 + 100 === 197, 'Blue Lens 97+C=197 record is exact');
const phi = (1 + Math.sqrt(5)) / 2;
check('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf('G') + 1 === 7 && 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf('Q') + 1 === 17 && primeIndex(17) === 7, 'G7 to p7=17 to Q17 chain is exact under A1Z26');
check(primeIndex(59) === 17, 'p17=59 is retained as a negative control');
check(Math.abs(Math.log(phi * Math.PI) - 0.428) > 0.1 && Math.abs(Math.PI * phi - 23.14) > 1, 'Supplied source-image equations are rejected');
check(7 ** 4 === 2401, '2401 = 7^4');
check(41 * 61 === 2501, '2501 = 41*61');
check(5002 - 2501 === 2501, '2501 is fixed by R(n)=5002-n');
check(Math.abs(phi ** 3 / Math.PI ** 2 - receipt.exact_records.phi3_over_pi2) < 1e-15, 'phi^3/pi^2 receipt value is exact to machine tolerance');
check(Object.values(receipt.governance_delta).every((value) => value === 0 || value === false), 'Governance delta remains zero');

console.log(`PASS · ${checks}/${checks} Number Tower / Scarab Regulator checks`);
