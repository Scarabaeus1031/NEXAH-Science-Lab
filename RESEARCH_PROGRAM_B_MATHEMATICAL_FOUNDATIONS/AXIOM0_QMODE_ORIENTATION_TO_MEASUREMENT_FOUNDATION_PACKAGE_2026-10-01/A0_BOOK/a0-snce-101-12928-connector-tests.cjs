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
const keystone = JSON.parse(fs.readFileSync(path.join(here, 'results/a0-ioi-keystone-2501-view-return-2026-11-04.json'), 'utf8'));
const keystonePulse = JSON.parse(fs.readFileSync(path.join(here, 'results/a0-ioi-keystone-9-white-alu-pulse-return-2026-11-05.json'), 'utf8'));

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
check(view.includes('id="ioi-keystone-2501-101-bridge-20261104"'), '101 view contains the bounded IOI Keystone bridge');
check(view.includes('101·512=51712') && view.includes('24×24=576=9·64') && view.includes('8·64=512'), '101 editorial bridge records exact carrier and tile counts');
check(view.includes('25=2501') && view.includes('101=2501') && view.includes('keine GLB-Geometrieänderung'), '101 editorial bridge records non-identity and geometry boundaries');
equal(keystone.carrier_101, { k: 9, u: 4, epsilon: 1, power_of_two: 512, carrier: 51712 }, 'stored 101/512 carrier bridge exact');
check(keystone.tile_count.outer_packages === 8 && keystone.tile_count.outer_tiles === 512 && keystone.tile_count.total_tiles === 576, 'stored 8+1 package count exact');
check(view.includes('KEYSTONE_9_WHITE_ALU_PULSE') && view.includes('RETURN_WHITE → A → L → U → B/ALU'), '101 editorial bridge records the anchored White-ALU-yellow pulse');
equal(keystonePulse.count_lens.equations, ['8*64=512', '9*64=576', '512+64=576'], 'Keystone 9 pulse stores the exact 8+1 count equations');
check(keystonePulse.animation.track_path === 'scale' && keystonePulse.animation.translation_tracks === 0, 'Keystone 9 pulse is scale-only');
check(keystonePulse.boundaries.yellow_package_9_is_not_a_new_number_identity && keystonePulse.boundaries.opium_club_status === 'OPEN_OWNER_MNEMONIC_UNBOUND', 'Keystone 9 and open mnemonic boundaries remain explicit');
check(view.includes('Keystone-Adresskarte') && view.includes('11×11=121') && view.includes('2,3,5') && view.includes('0 / Red Balloon'), '101 editorial bridge records the bounded Keystone address map');
equal(keystonePulse.address_map.first_prime_markers, [2, 3, 5], 'Keystone address map stores the first three exact prime markers');
check(keystonePulse.address_map.black_slots === 'INTER_TILE_VISIBILITY_GAPS_NOT_STATES' && keystonePulse.boundaries.red_balloon_zero_is_not_a_new_identity, 'slot and Red Balloon zero boundaries remain explicit');
check(view.includes('Eckkoordinaten und Navigation') && view.includes('C=(IA,LR,OU)') && view.includes('J(v)=−v'), '101 editorial bridge records navigation order and the semantic/geometric coordinate split');
check(view.includes('Quer-Navigation und Red-Balloon-Linse') && view.includes('BODY/45°') && view.includes('bleibt eine unzugeordnete View-Linse'), '101 editorial bridge records the horizontal rail and Red Balloon non-assignment');
check(view.includes('Beschriftete Demo-Tour und breiter Record') && view.includes('BODY → MAP → AM → VM → PM → RED BALLOON → CORNERS → KEYSTONE RETURN'), '101 editorial bridge records the labelled tour and wide reading deck');
check(view.includes('Start-Überleitung im Player') && view.includes('BESCHRIFTETE TOUR STARTEN') && view.includes('101 / A0'), '101 editorial bridge records the explanatory intro and primary tour entry');
equal(keystonePulse.corner_coordinates.addresses.ALU, [-1, -1, -1], 'ALU semantic corner coordinate exact');
equal(keystonePulse.corner_coordinates.addresses.IRO, [1, 1, 1], 'IRO semantic corner coordinate exact');
check(keystonePulse.corner_coordinates.b_alu_witness.status === 'DISPLAY_ADDRESS_ADAPTER_ONLY' && keystonePulse.boundaries.janus_inversion_is_a_view_adapter_not_an_identity, 'Janus corner inversion remains a display adapter');
check(keystonePulse.side_navigation_rail.red_balloon_lens.status === 'VIEW_LAYER_ONLY' && keystonePulse.boundaries.red_shadow_is_not_a_new_glb_node_or_physical_shadow_claim, 'Red Balloon shadow stays a bounded display layer');
check(keystonePulse.guided_demo_tour.status === 'VIEW_ONLY_LABELLED_READER_ROUTE' && keystonePulse.guided_demo_tour.steps.length === 8, 'guided tour remains a bounded eight-step reader route');

process.stdout.write(`PASS ${checks}/${checks} A0 SNCE 101/12928 connector checks\n`);
