#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { record, decimalOverlay } = require('./a0-snce-101-12928-connector.js');

const here = __dirname;
const lab = path.resolve(here, '../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_ROOT7_EULER_MIRROR_CONCORDANCE_INTAKE_2026-09-28');
const authoritative = JSON.parse(fs.readFileSync(path.join(lab, 'snce_101_parity_profile_01_results.json'), 'utf8'));
const stored = JSON.parse(fs.readFileSync(path.join(here, 'results/a0-snce-101-12928-connector-2026-10-25.json'), 'utf8'));
const view = fs.readFileSync(path.join(here, 'A0_NUMBERMAGICK_GRID_RESEARCH.html'), 'utf8');
const desk = fs.readFileSync(path.join(here, 'A0_RESEARCH_DESK.html'), 'utf8');
const log = fs.readFileSync(path.join(here, 'A0_BUILDER_LOG.html'), 'utf8');

let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
const equal = (actual, expected, message) => { assert.deepStrictEqual(actual, expected, message); checks += 1; };

equal(record.arithmetic.dyadic.map(row => row.value), [101, 202, 404, 808, 1616, 3232, 6464, 12928, 25856, 51712, 103424, 206848, 413696], 'k=0..12');
equal(record.arithmetic.additive.map(row => row.value), [101, 202, 303, 404, 505, 606, 707, 808, 909], '101n for n=1..9');
equal(record.arithmetic.shared, [101, 202, 404, 808], 'family intersection');
equal(record.arithmetic.additiveOnly, [303, 505, 606, 707, 909], 'predeclared non-hits');
check(record.arithmetic.additive.every(row => String(row.value) === row.digitForm), 'n0n digit notation');
equal(record.arithmetic.dyadic.slice(4, 7).map(row => row.value), [1616, 3232, 6464], 'two-digit repeated blocks');
equal(record.arithmetic.cut12928.segmentation, ['1', '292', '8'], '1|292|8 segmentation');
equal(record.arithmetic.cut12928.placeValue, '1*10000+292*10+8', 'place-value identity');
check(292 === 4 * 73 && record.arithmetic.cut12928.palindrome292, '292 factor and palindrome');
check(1 + 8 === 3 ** 2 && (3 ** 2) ** 2 === 3 ** 4 && 3 ** 4 === 81, 'outer digits and additional square');
check(record.arithmetic.reversal18_81.reverse18 === 81 && !record.arithmetic.reversal18_81.inDyadicK0K12, '18↔81 is only decimal reversal here');
equal(record.arithmetic.cut12928.modulo292, 80, 'substring is not equality or divisibility');
equal(record.arithmetic.firstOverlap, 7, 'first shifted-place overlap');
equal(record.arithmetic.firstCarry, 12, 'first base-10 carry in requested window');
check(decimalOverlay(128).carryPositions.length === 0 && decimalOverlay(4096).carryPositions.length > 0, 'overlap and carry are distinct');
equal(record.arithmetic.dyadic.map(row => row.value), authoritative.records.slice(0, 13).map(row => row.carrier), 'existing SNCE record match');
equal(record.arithmetic.dyadic.map(row => [row.u, row.epsilon]), authoritative.records.slice(0, 13).map(row => [row.u, row.epsilon]), 'existing SNCE codes match');
check(authoritative.checks.carrier_12928_code_and_roundtrip && authoritative.checks.substring_292_not_numeric_identity, 'authoritative controls pass');
check(record.sourceComparison.ncs292.equalsDigitSubstring === false && record.sourceComparison.ncs292.importedMechanism === false, 'NCS boundary');
check(record.sourceComparison.f50To101ToSnce.uniqueSelector === false, 'F50 selection boundary');
equal(stored.dyadic_101_times_2k_k0_12, record.arithmetic.dyadic.map(row => row.value), 'stored dyadic record exact');
equal(stored.additive_101n_n1_9, record.arithmetic.additive.map(row => row.value), 'stored additive record exact');
equal(stored.cut_12928.segmentation, record.arithmetic.cut12928.segmentation, 'stored cut exact');
equal(stored.snce['12928'], record.sourceComparison.snce12928, 'stored SNCE code exact');
for (const [text, label] of [[view, 'view'], [desk, 'desk'], [log, 'log']]) {
  check(text.includes('snce-101-12928'), `${label} route present`);
}
check(fs.existsSync(path.join(here, 'results/a0-snce-101-12928-connector-2026-10-25.svg')), 'visual present');

process.stdout.write(`PASS ${checks}/${checks} A0 SNCE 101/12928 connector checks\n`);
