import assert from 'node:assert/strict';

const MODULUS = 2501;
const ROOT = 50;
const FACTORS = [41, 61];
const mod = (value, modulus = MODULUS) => ((value % modulus) + modulus) % modulus;
const J = value => mod(ROOT * value);

assert.equal(ROOT ** 2 + 1, MODULUS, '2501 must equal 50² + 1');
assert.equal(FACTORS[0] * FACTORS[1], MODULUS, '2501 must factor as 41 × 61');
assert.equal(mod(ROOT ** 2), MODULUS - 1, '50² must be −1 modulo 2501');

for (let x = 0; x < MODULUS; x += 1) {
  assert.equal(J(J(x)), mod(-x), `J²(x) must equal −x for x=${x}`);
  assert.equal(J(J(J(J(x)))), x, `J⁴(x) must return x for x=${x}`);
}

const rootsOfMinusOne = [];
for (let x = 0; x < MODULUS; x += 1) {
  if (mod(x * x) === MODULUS - 1) rootsOfMinusOne.push(x);
}
assert.deepEqual(
  rootsOfMinusOne,
  [50, 255, 2246, 2451],
  'CRT over 41 × 61 must yield exactly four square roots of −1'
);

const orbit = [1];
for (let step = 0; step < 4; step += 1) orbit.push(J(orbit.at(-1)));
assert.deepEqual(orbit, [1, 50, 2500, 2451, 1], 'seed 1 must close after four quarter-turns');
assert.notEqual(orbit[1], orbit[0], 'J must not be the identity');
assert.notEqual(orbit[2], orbit[0], 'J² must not be the identity on seed 1');

const receipt = {
  status: 'PASS',
  scope: 'exact finite arithmetic only',
  modulus: MODULUS,
  factorization: '2501 = 41 × 61 = 50² + 1',
  operator: 'J(x) = 50x mod 2501',
  identities: ['J² = −I', 'J⁴ = I'],
  roots_of_minus_one: rootsOfMinusOne,
  seed_1_orbit: orbit,
  exhaustive_states_checked: MODULUS,
  non_claims: [
    'no physical spacetime mechanism',
    'no Lorentz-factor or gamma identity',
    'no replacement of the frozen M64 Janus result'
  ]
};

console.log(JSON.stringify(receipt, null, 2));
