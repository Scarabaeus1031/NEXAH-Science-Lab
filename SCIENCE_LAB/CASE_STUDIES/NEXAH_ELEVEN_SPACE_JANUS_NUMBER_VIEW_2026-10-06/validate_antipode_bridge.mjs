#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../../..');
const read = path => readFileSync(join(repo, path), 'utf8');
const elevenPath = 'SCIENCE_LAB/CASE_STUDIES/NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/NEXAH_ELEVEN_SPACE_FOUR_VIEWS.html';
const janusPath = 'SCIENCE_LAB/CASE_STUDIES/NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/NEXAH_JANUS_ARITHMETIC_LADDER.html';
const antipodePath = 'SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/NEXAH_EULER_ANTIPODE_TWO_CUT_INSTRUMENT.html';
const registryPath = 'SCIENCE_LAB/NAVIGATION/NEXAH_MODULE_REGISTRY_V2_2026-10-05.json';
const eleven = read(elevenPath);
const janus = read(janusPath);
const antipode = read(antipodePath);
const registry = JSON.parse(read(registryPath));

const residues = new Map([[11357,5],[11537,9],[11735,9],[11573,1],[1729,2],[1836,10],[3565,1]]);
for (const [n, expected] of residues) assert.equal(n % 11, expected, `${n} mod 11`);
assert.equal(11735 - 11537, 18 * 11);
assert.equal(1836 + 1729, 3565);
assert.equal((1836 % 11 + 1729 % 11) % 11, 3565 % 11);

const reflect = (center, x) => 2 * center - x;
for (const [center, a, b] of [[11947,11357,12537],[12555,11357,13753],[12555,12537,12573],[12555,12543,12567],[12555,12549,12561]]) {
  assert.equal(reflect(center, a), b);
  assert.equal(reflect(center, b), a);
  assert.equal(reflect(center, reflect(center, a)), a);
}

const curtainCompare = (x, center, drift) => {
  const routeA = reflect(center, x + drift);
  const routeB = reflect(center, x) + drift;
  return {
    routeA,
    routeB,
    residual: routeA - routeB,
    returnA: reflect(center, routeA),
    returnB: reflect(center, routeB)
  };
};
for (const drift of [-40, -7, -1, 0, 1, 7, 40]) {
  const result = curtainCompare(11357, 11947, drift);
  assert.equal(result.residual, drift === 0 ? 0 : -2 * drift, `Curtain residual ${drift}`);
  assert.equal(result.returnA - 11357, drift, `Curtain route A return ${drift}`);
  assert.equal(result.returnB - 11357, drift === 0 ? 0 : -drift, `Curtain route B return ${drift}`);
}

assert.match(eleven, /NEXAH_JANUS_ARITHMETIC_LADDER\.html/);
assert.match(janus, /NEXAH_ELEVEN_SPACE_FOUR_VIEWS\.html/);
assert.match(eleven, /NEXAH_EULER_ANTIPODE_TWO_CUT_INSTRUMENT\.html/);
assert.match(janus, /NEXAH_EULER_ANTIPODE_TWO_CUT_INSTRUMENT\.html/);
assert.match(antipode, /NEXAH_ELEVEN_SPACE_FOUR_VIEWS\.html/);
assert.match(antipode, /NEXAH_JANUS_ARITHMETIC_LADDER\.html/);
assert.match(janus, /data-view="curtain"/);
assert.match(janus, /AM → VM → PM → Referenz-Return/);
assert.match(janus, /Pink Diamond Grid · Vergleichsansicht/);
assert.match(janus, /routeA-routeB/);
assert.match(janus, /pinkDiamondRole:'VIEW_ONLY'/);

const bridge = registry.relations.find(({ relation_id }) => relation_id === 'REL:TWO_CUT_NUMBER_ANTIPODE');
assert.ok(bridge, 'typed Antipode relation is registered');
assert.equal(bridge.source, 'MOD:TRANSVERSUM_TWO_CUT');
assert.equal(bridge.target, 'MOD:NUMBER_VIEW_SUITE');
assert.equal(bridge.type, 'method');

console.log(JSON.stringify({
  status: 'PASS',
  arithmetic_checks: residues.size + 3,
  involution_pairs: 5,
  reciprocal_html_links: 6,
  curtain_residual_controls: 7,
  curtain_dom_contracts: 5,
  registry_relation: bridge.relation_id,
  boundary: 'nine shells remain distinct from eleven residue states'
}, null, 2));
