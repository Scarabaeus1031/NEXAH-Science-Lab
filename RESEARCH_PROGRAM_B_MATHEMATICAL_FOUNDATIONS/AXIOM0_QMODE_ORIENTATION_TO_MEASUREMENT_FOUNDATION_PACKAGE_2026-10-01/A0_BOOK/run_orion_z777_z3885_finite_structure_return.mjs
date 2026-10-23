#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(here, "results", "a0-orion-z777-z3885-finite-structure-return-2026-10-22.json");

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

function orbitAudit(modulus, multiplier) {
  if (gcd(modulus, multiplier) !== 1) throw new Error(`T_${multiplier} is not a permutation of Z_${modulus}`);
  const seen = new Set();
  const distribution = {};
  for (let seed = 0; seed < modulus; seed += 1) {
    if (seen.has(seed)) continue;
    let cursor = seed;
    let length = 0;
    do {
      if (seen.has(cursor)) throw new Error(`Orbit collision before return for Z_${modulus}, T_${multiplier}, seed ${seed}`);
      seen.add(cursor);
      cursor = (multiplier * cursor) % modulus;
      length += 1;
    } while (cursor !== seed);
    distribution[length] = (distribution[length] || 0) + 1;
  }
  const stateCount = Object.entries(distribution).reduce((sum, [length, count]) => sum + Number(length) * count, 0);
  const orbitCount = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  return { modulus, multiplier, gcd: gcd(modulus, multiplier), distribution, orbit_count: orbitCount, state_count: stateCount };
}

const audits = [
  orbitAudit(777, 64),
  orbitAudit(777, 97),
  orbitAudit(777, 524),
  orbitAudit(3885, 1301)
];

const expected = [
  { distribution: { 1: 21, 6: 126 }, orbit_count: 147, state_count: 777 },
  { distribution: { 1: 3, 2: 9, 12: 63 }, orbit_count: 75, state_count: 777 },
  { distribution: { 1: 1, 2: 10, 4: 189 }, orbit_count: 200, state_count: 777 },
  { distribution: { 1: 5, 2: 50, 4: 945 }, orbit_count: 1000, state_count: 3885 }
];

for (const [index, audit] of audits.entries()) {
  if (JSON.stringify(audit.distribution) !== JSON.stringify(expected[index].distribution)) throw new Error(`Unexpected orbit distribution in case ${index + 1}`);
  if (audit.orbit_count !== expected[index].orbit_count || audit.state_count !== expected[index].state_count) throw new Error(`Count mismatch in case ${index + 1}`);
}

const z777t524 = audits[2];
const z3885t1301 = audits[3];
const fiveFoldLift = Object.keys(z777t524.distribution).every(
  (length) => z3885t1301.distribution[length] === 5 * z777t524.distribution[length]
);

const result = {
  schema: "nexah.a0.orion-finite-structure-return/1.0.0",
  generated: "2026-10-22",
  status: "PASS_EXACT_FINITE_RECALCULATION",
  scope: "Full deterministic orbit enumeration for four declared multiplication permutations; A0-to-ORION evidence crosswalk only.",
  identity_reuse: ["ART:A0:MATHEMATICAL_JOINTS", "NEXAH:ORION:CAPABILITY_EVIDENCE:V1"],
  new_canonical_ids: [],
  audits,
  crt_lift: {
    carrier_factorization: "3885 = 777 * 5",
    coprime_factors: gcd(777, 5) === 1,
    operator_reductions: { "1301_mod_777": 1301 % 777, "1301_mod_5": 1301 % 5 },
    typed_statement: "Under Z_3885 ~= Z_777 x Z_5, T_1301 acts as T_524 x identity.",
    five_fold_orbit_lift: fiveFoldLift,
    state_count_check: "5*1 + 50*2 + 945*4 = 3885"
  },
  negative_controls: [
    { id: "NC1", pass: audits[2].modulus !== audits[3].modulus, statement: "T_524 on Z_777 and T_1301 on Z_3885 are related by a CRT lift but are not the same carrier/operator object." },
    { id: "NC2", pass: (1301 % 5) === 1 && (1301 % 3885) !== 1, statement: "Identity on the Z_5 factor does not imply global identity on Z_3885." },
    { id: "NC3", pass: true, statement: "Color, drawing density, spherical layout and visual similarity are not used by the enumeration." }
  ],
  codex_provenance_axes: {
    registry: "SCIENCE_LAB/REVIEWS/THREE_D_MODULE_ATLAS_2026-09-29/NEXAH_CODEX_LEGACY_SOURCE_REGISTER.csv",
    axes: [
      { registry_record: "NCX-0710", label: "GURT / Möbius–spiral–frequency vocabulary", authority: "SOURCE_PRESENCE_ONLY_NOT_SCIENTIFIC_VALIDATION" },
      { registry_record: "NCX-0334", label: "THOTH / Thoth's Pen time-frequency spiral", authority: "SOURCE_PRESENCE_ONLY_NOT_SCIENTIFIC_VALIDATION" }
    ],
    relation: "CONTEXTUAL_SOURCE_LINEAGE_CANDIDATE_ONLY; no direct GURT-to-THOTH module reference or tested intertwiner was found."
  },
  claim_boundary: "The result establishes only the declared finite orbit decompositions and CRT lift. It does not validate GU-REX/GURT/THOTH, cosmology, physical resonance, a 45-step early-warning advantage, navigation/control capability, novelty or publication.",
  publication_authorized: false
};

if (!result.crt_lift.coprime_factors || !result.crt_lift.five_fold_orbit_lift || result.negative_controls.some((item) => !item.pass)) {
  throw new Error("Finite structure return failed a required bridge or negative control");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(`PASS ${result.status} · wrote ${path.relative(process.cwd(), outputPath)}`);
