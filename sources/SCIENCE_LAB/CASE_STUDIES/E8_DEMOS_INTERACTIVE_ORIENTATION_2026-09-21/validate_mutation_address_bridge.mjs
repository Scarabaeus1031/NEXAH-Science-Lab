import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('./NEXAH_E8_MUTATION_FAMILY_GRAPH.html',import.meta.url),'utf8');
for(const token of [
  'mutation_address_code.js',
  'id="edgeCode"',
  'id="tritCode"',
  'id="codeAddress"',
  'id="codeAntipode"',
  'id="codeSix"',
  'id="carrier42"',
  'id="carrier1032"',
  'id="handleCarry"',
  'id="handleReversal"',
  'id="handlePage"',
  'id="handleAnchor"',
  "TRIANGLE_HANDLE:{labels:['2','3','5','7'],edges:[[0,1],[1,2],[2,0],[2,3]]",
  'Primegrid Block 3',
  'Pascal Antipode 2B'
])assert.ok(html.includes(token),`missing ${token}`);

const inline=[...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(match=>match[1]);
assert.ok(inline.length>0);
for(const source of inline)new Function(source);

const block3=readFileSync(new URL('../NEXAH_PRIMEGRID_BLOCK03_PRIME_ADDRESS_CONTROL_2026-10-07/NEXAH_PRIMEGRID_BLOCK03_PRIME_ADDRESS_CONTROL_LAB.html',import.meta.url),'utf8');
assert.ok(block3.includes('Mutation + Antipode Code'));
console.log('mutation address bridge HTML: all checks PASS');
