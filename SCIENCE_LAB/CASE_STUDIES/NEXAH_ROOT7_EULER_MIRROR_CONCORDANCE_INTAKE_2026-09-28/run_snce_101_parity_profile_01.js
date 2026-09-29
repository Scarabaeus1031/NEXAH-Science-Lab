#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HERE = __dirname;
const IMAGE = '/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/1/115E15BB-B6D2-41F2-A071-4A9E4500B1C9_1_105_c.jpeg';
const PREREG = path.join(HERE, '34_SNCE_101_PARITY_PROFILE_01_PREREGISTRATION.md');
const OUT = path.join(HERE, 'snce_101_parity_profile_01_results.json');
const SOURCES = {
  composite_contract: [path.join(HERE, '17_COMPOSITE_G_CARRY_INVARIANCE_TEST_CONTRACT.md'), '703308d68b779c63d75c6d35a289c02d164d29c2becbc4ee4250bf67dbb26a8c'],
  composite_result: [path.join(HERE, 'composite_g_carry_invariance_results.json'), '8ed8457d77d062f2ea237c3df4d0ddd3e3eb8c3903e25d2fcabae04893c6df0f'],
  collision_contract: [path.join(HERE, '20_OPERATOR_COLLISION_MATRIX_TEST_CONTRACT.md'), 'dc5049dbb33508e12ee9bf4d834c74b3f6a4bfa690c79fd941aa4ceeb2005a8b'],
  collision_result: [path.join(HERE, 'operator_collision_matrix_results.json'), '0f587856b9107042f7d1245599b9e69cfc5d1e6f5d535182840a868f74385fde'],
  collision_addendum: [path.join(HERE, '21_OPERATOR_COLLISION_MATRIX_ADDENDUM.md'), '973e365b353820bb4d3d2611e2ab65f5839fe1f945337dcb0f4a2d9fcab80f51'],
  legacy_image: [IMAGE, 'a0d9396df0b5db7e25ac05cff54181f55ed5b454825d28f021aa8599d0dbf808']
};
const sha256 = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const isPowerOfTwo = n => Number.isSafeInteger(n) && n > 0 && (BigInt(n) & (BigInt(n) - 1n)) === 0n;

function start(c) {
  if (!Number.isSafeInteger(c) || c <= 0) throw new Error('START_DOMAIN');
  return Object.freeze({ carrier: c, base: 101, profile: 'SNCE_101_DYADIC_PARITY_V1' });
}
function norm(record) {
  if (record.carrier % record.base !== 0) throw new Error('NOT_DIVISIBLE_BY_101');
  return Object.freeze({ ...record, q: record.carrier / record.base });
}
function code(record) {
  if (!isPowerOfTwo(record.q)) throw new Error('QUOTIENT_NOT_POWER_OF_TWO');
  let q = record.q, k = 0;
  while (q > 1) { q /= 2; k++; }
  return Object.freeze({ ...record, k, u: Math.floor(k / 2), epsilon: k % 2, channel: k % 2 === 0 ? 'EVEN' : 'ODD' });
}
function expand(coded) {
  if (!Number.isSafeInteger(coded.u) || coded.u < 0 || ![0, 1].includes(coded.epsilon)) throw new Error('MALFORMED_CODE');
  const carrier = 101 * (4 ** coded.u) * (2 ** coded.epsilon);
  if (!Number.isSafeInteger(carrier)) throw new Error('UNSAFE_EXPANSION');
  return Object.freeze({ carrier, mirror: [-carrier, 0, carrier] });
}
function attempt(c) {
  try { const coded = code(norm(start(c))); return { input: c, accepted: true, code: { u: coded.u, epsilon: coded.epsilon }, expanded: expand(coded).carrier }; }
  catch (e) { return { input: c, accepted: false, reason: e.message }; }
}

function run() {
  const hashChecks = Object.fromEntries(Object.entries(SOURCES).map(([key, [p, expected]]) => {
    const actual = sha256(p); return [key, { expected, actual, pass: expected === actual }];
  }));
  const records = Array.from({ length: 21 }, (_, k) => {
    const carrier = 101 * (2 ** k), coded = code(norm(start(carrier))), expanded = expand(coded);
    return { k, carrier, q: coded.q, u: coded.u, epsilon: coded.epsilon, channel: coded.channel, expanded: expanded.carrier, mirror: expanded.mirror, roundtrip: expanded.carrier === carrier };
  });
  const even = records.filter(r => r.epsilon === 0), odd = records.filter(r => r.epsilon === 1);
  const rejectedInputs = [1212, 303, 292, 12929, 0, -101, 110, 220, 550, ...Array.from({ length: 8 }, (_, k) => 97 * (2 ** k))];
  const rejectionRecords = rejectedInputs.map(attempt);
  const malformed = [{ u: -1, epsilon: 0 }, { u: .5, epsilon: 0 }, { u: 1, epsilon: -1 }, { u: 1, epsilon: 2 }].map(c => {
    try { expand(c); return { code: c, rejected: false }; } catch (e) { return { code: c, rejected: true, reason: e.message }; }
  });
  const r404 = records.find(r => r.carrier === 404), r12928 = records.find(r => r.carrier === 12928);
  const checks = {
    frozen_hashes_match: Object.values(hashChecks).every(x => x.pass),
    roundtrip_21_of_21: records.length === 21 && records.every(r => r.roundtrip),
    codes_unique: new Set(records.map(r => `${r.u}:${r.epsilon}`)).size === records.length,
    parity_partition_complete_exclusive: even.length + odd.length === records.length && records.every(r => (r.epsilon === 0) !== (r.epsilon === 1)),
    same_channel_factor_four: [even, odd].every(ch => ch.slice(1).every((r, i) => r.carrier === 4 * ch[i].carrier)),
    interleaved_factor_two: records.slice(1).every((r, i) => r.carrier === 2 * records[i].carrier),
    mirror_centered: records.every(r => r.mirror[0] === -r.carrier && r.mirror[1] === 0 && r.mirror[2] === r.carrier && r.mirror[0] + r.mirror[2] === 0),
    carrier_404_typed_without_gate_semantics: r404.u === 1 && r404.epsilon === 0,
    rejection_controls_pass: rejectionRecords.every(r => !r.accepted),
    malformed_codes_rejected: malformed.every(r => r.rejected),
    carrier_12928_code_and_roundtrip: r12928.k === 7 && r12928.u === 3 && r12928.epsilon === 1 && r12928.expanded === 12928,
    substring_292_not_numeric_identity: String(12928).includes('292') && 12928 !== 292 && 12928 % 292 === 80,
    midpoint_1212_outside_profile: !attempt(1212).accepted && 1212 === 3 * 404 && 1212 === (808 + 1616) / 2,
    legacy_444_trace_unevaluated: true
  };
  const classification = Object.values(checks).every(Boolean) ? 'PASS_SNCE_101_PARITY_PROFILE__LOSSLESS_REPARAMETERIZATION_ONLY' : 'FAIL_SNCE_101_PARITY_PROFILE';
  const result = {
    classification,
    preregistration_sha256: sha256(PREREG), frozen_source_hashes: hashChecks,
    profile: { id: 'SNCE_101_DYADIC_PARITY_V1', start: 'positive safe integer c', norm: 'q=c/101', code: 'q=2^k; k=2u+epsilon', expand: '101*4^u*2^epsilon', mirror: '(-c,0,+c)' },
    checks, checks_passed: Object.values(checks).filter(Boolean).length, checks_total: Object.keys(checks).length,
    records, channels: { even: even.map(r => r.carrier), odd: odd.map(r => r.carrier) },
    rejection_controls: rejectionRecords, malformed_code_controls: malformed,
    typed_boundaries: {
      carrier_404: { value: 404, code: { u: r404.u, epsilon: r404.epsilon }, gate_semantics: 'NOT_IMPORTED; G404(a,b) remains a separate regulator predicate' },
      midpoint_1212: 'ADDITIVE_MIDPOINT_OUTSIDE_PROFILE',
      substring_292: { source: '12928', segmentation: ['1', '292', '8'], arithmetic_mod_292: 80, status: 'DIGIT_SUBSTRING_ONLY' },
      legacy_444: { observed_labels: [444, 4.44, 74, 4774], status: 'UNMODELED_LEGACY_TRACE', reason: 'image supplies no typed transition functions; no rule fitted in this test' }
    },
    claim_boundary: 'Lossless encoding of 101*2^k only; no prediction, physical resonance, SCN/NCS switch, 404 gate bridge, digit law or recovered 444 mechanism.'
  };
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ classification, checks: `${result.checks_passed}/${result.checks_total}`, even: even.length, odd: odd.length, rejected: rejectionRecords.length, output: OUT }, null, 2) + '\n');
}
run();
