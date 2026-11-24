#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const EPS = 1e-12;
const clean = value => Number(value.toFixed(12));
const close = (a, b) => Math.abs(a - b) < EPS;
const gamma = beta => 1 / Math.sqrt(1 - beta ** 2);

function gammaCoefficient(k) {
  let value = 1;
  for (let index = 0; index < k; index += 1) {
    value *= (2 * index + 1) / (2 * index + 2);
  }
  return value;
}

function buildReceipt() {
  const cube = 2 ** 3;
  const cubeRoot = Math.cbrt(cube);
  const root8 = Math.sqrt(cube);
  const betaSquared = 1 - 1 / root8 ** 2;
  const beta = Math.sqrt(betaSquared);
  const gammaBeta = root8 * beta;
  const rapidity = Math.acosh(root8);
  const samples = [0.5, 0.9, 0.99, 0.9999, 0.999999]
    .map(value => ({beta: value, gamma: clean(gamma(value))}));
  const coefficients = Array.from({length: 6}, (_, k) => ({k, value: clean(gammaCoefficient(k))}));

  const checks = [
    ['R8-01', cube === 8 && close(cubeRoot, 2), '2^3=8 and cbrt(8)=2'],
    ['R8-02', close(root8, 2 * Math.sqrt(2)), 'sqrt(8)=2*sqrt(2)'],
    ['R8-03', close(betaSquared, 7 / 8), 'gamma=sqrt(8) implies beta^2=7/8'],
    ['R8-04', close(beta, Math.sqrt(7 / 8)), 'gamma=sqrt(8) implies beta=sqrt(7/8)'],
    ['R8-05', close(gammaBeta, Math.sqrt(7)), 'gamma*beta=sqrt(7)'],
    ['R8-06', close(root8 ** 2 - gammaBeta ** 2, 1), 'gamma^2-(gamma*beta)^2=1'],
    ['R8-07', Number.isFinite(root8), 'sqrt(8) is finite and is not gamma infinity'],
    ['R8-08', samples.every((sample, index, list) => index === 0 || sample.gamma > list[index - 1].gamma), 'gamma grows monotonically in the sampled approach to beta=1'],
    ['R8-09', !Number.isFinite(gamma(1)), 'gamma diverges only at the beta=1 denominator boundary'],
    ['CK-01', close(coefficients[0].value, 1) && close(coefficients[1].value, 1 / 2), 'conditional c_k series begins 1, 1/2'],
    ['CK-02', close(coefficients[2].value, 3 / 8) && close(coefficients[3].value, 5 / 16), 'conditional c_k series continues 3/8, 5/16'],
    ['CK-03', close(coefficients[4].value, 35 / 128) && close(coefficients[5].value, 63 / 256), 'conditional c_k series continues 35/128, 63/256'],
    ['BND-01', !close(cubeRoot, root8), 'cube root and square root remain different operations'],
    ['BND-02', !close(beta, Math.sqrt(7)), 'root7 is gamma*beta, not beta'],
    ['BND-03', rapidity > 0 && Number.isFinite(rapidity), 'finite rapidity accompanies gamma=sqrt(8)']
  ].map(([id, pass, statement]) => ({id, pass, statement}));

  assert.equal(checks.every(check => check.pass), true, 'Root8 audit contains a failed assertion');

  return {
    schema: 'a0.bounded-mathematical-audit.return.v1',
    auditId: 'A0-MATH-ROOT8-GAMMA-ROOT7-01',
    date: '2026-11-19',
    authority: 'HUMAN_OWNER_AUTHORIZED_BOUNDED_ENGINEERING_VERIFICATION',
    classification: 'DETERMINISTIC_DIMENSIONLESS_MATH_AUDIT / NOT_A_LAB_RUN / NOT_ADMITTED',
    identityDisposition: 'REUSES_EXISTING_A0_ORIENTATION_EVIDENCE_LINEAGE_AND_ROOT7_LOOK',
    claimCeiling: 'STANDARD_SPECIAL_RELATIVITY_ALGEBRA / A0_TYPED_COMPARATOR / NO_NEW_PHYSICS',
    exactCore: {
      cube: {'2^3': cube, 'cbrt(8)': clean(cubeRoot), 'sqrt(8)': clean(root8), '2*sqrt(2)': clean(2 * Math.sqrt(2))},
      lorentz: {
        definition: 'gamma=1/sqrt(1-beta^2), beta=v/c',
        assignedGamma: 'sqrt(8)',
        betaSquared: '7/8',
        beta: 'sqrt(7/8)',
        betaDecimal: clean(beta),
        gammaBeta: 'sqrt(7)',
        gammaBetaDecimal: clean(gammaBeta),
        invariant: 'gamma^2-(gamma*beta)^2=1',
        rapidityDefinition: 'gamma=cosh(eta), gamma*beta=sinh(eta)',
        rapidity: clean(rapidity)
      },
      lightLimitSamples: samples
    },
    conditionalCkReading: {
      status: 'CONDITIONAL_ON_CK_DENOTING_THE_BINOMIAL_GAMMA_SERIES',
      series: '(1-beta^2)^(-1/2)=sum_{k>=0} c_k beta^(2k)',
      coefficient: 'c_k=binomial(2k,k)/4^k',
      recurrence: 'c_(k+1)=c_k*(2k+1)/(2k+2)',
      coefficients,
      note: 'The odd values 1,3,5,7,... occur in recurrence numerators; this alone does not bind the existing A0 CK glyph or a 5-3-7 mechanism.'
    },
    typedBoundary: {
      ghostGrid: 'EXISTING_COMMON_ADDRESS_AND_COMPARISON_FIELD_NOT_PHYSICAL_SPACE / NOT_DERIVED_FROM_LORENTZ_FACTOR',
      rootRoom: 'SOURCE_BOUND_SYMBOLIC_GEOMETRY / MAY_HOST_THE_COMPARATOR / NOT_A_RELATIVISTIC_REGION',
      underworld: 'NARRATIVE_VIEW_LABEL_ONLY',
      gammaLight: 'PROPOSED_DISPLAY_LABEL_ONLY / REQUIRES_DECLARED_BETA_AND_UNITS_FOR_PHYSICS',
      vonNeumann: 'KEEP_3X3_NEIGHBORHOOD_AND_PAULI_GHZ_FIXTURE_DISTINCT / NEITHER_IS_DERIVED_HERE',
      ulam: 'UNBOUND_IN_THIS_AUDIT',
      root7: 'EXACTLY_GAMMA_BETA_ONLY_UNDER_THE_DECLARED_ASSIGNMENT_GAMMA_EQUALS_SQRT8'
    },
    checks,
    summary: {
      outcome: 'PASS_EXACT_ALGEBRA_WITH_SEMANTIC_HOLDS',
      checksPassed: checks.length,
      checksTotal: checks.length,
      graphDelta: {identities: 0, relations: 0, aliases: 0, studies: 0, findings: 0, promotions: 0}
    },
    stop: 'No identification of Root Room, Ghost Grid, Ulam/von Neumann systems, CK glyphs, light, spacetime, matter or a physical mechanism follows from the exact Root8/Root7 algebra.'
  };
}

function verifyReceipt() {
  const receiptPath = path.join(__dirname, 'results', 'a0-root8-gamma-root7-audit-2026-11-19.json');
  const recorded = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  assert.deepEqual(recorded, buildReceipt());
  return receiptPath;
}

if (require.main === module) {
  if (process.argv.includes('--verify-receipt')) {
    const receiptPath = verifyReceipt();
    console.log(`PASS A0-MATH-ROOT8-GAMMA-ROOT7-01 · 15/15 · ${receiptPath}`);
  } else {
    console.log(JSON.stringify(buildReceipt(), null, 2));
  }
}

module.exports = {buildReceipt, verifyReceipt, gammaCoefficient};
