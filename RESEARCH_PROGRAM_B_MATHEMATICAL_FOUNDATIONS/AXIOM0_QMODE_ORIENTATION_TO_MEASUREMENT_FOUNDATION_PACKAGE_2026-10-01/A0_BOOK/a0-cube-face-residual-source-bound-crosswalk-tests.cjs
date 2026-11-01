const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const receipt = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'a0-cube-face-residual-source-bound-crosswalk-2026-11-01.json'), 'utf8'));
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

check(receipt.status === 'SOURCE_BOUND_MAPPING_ONLY_NO_RUNTIME_DELTA', 'documentary-only status');
check(Object.values(receipt.frozen_contract).every(value => value === 'UNTOUCHED'), 'frozen runtimes untouched');
check(receipt.cube_faces.face_count === 6, 'six faces');
check(receipt.cube_faces.opposite_pair_count === 3, 'three opposite pairs');
const pairs = receipt.cube_faces.opposite_pairs;
const faces = pairs.flatMap(pair => pair.faces);
check(new Set(faces).size === 6, 'opposite pairs contain six unique faces');
check(pairs.every(pair => pair.faces.length === 2), 'each opposite pair is binary');
check(receipt.typed_mapping.trap_door.type === 'CUT', 'TrapDoor is Cut');
const openBook = receipt.typed_mapping.open_book.faces;
check(openBook.length === 2 && openBook[0] !== openBook[1], 'Open Book has two distinct faces');
check(!pairs.some(pair => pair.faces.every(face => openBook.includes(face))), 'Open Book faces are adjacent, not opposite');
check(receipt.typed_mapping.pascal_joint.type === 'TYPED_SEAM', 'Pascal Joint is a typed seam');
check(receipt.typed_mapping.pascal_joint.reuses.includes('A0OE:PASCAL_PENTAGON_D5_TEST'), 'Pascal identity reused');
check(receipt.typed_mapping.binder.type === 'RETENTION_ACROSS_VIEWS', 'Binder is retention across views');
check(receipt.typed_mapping.clamps.type === 'LOCAL_HOLD', 'Clamps are local hold');
check(receipt.typed_mapping.arcs.type === 'MOTION_PATH', 'Arcs are motion path only');
check(receipt.residual_grammar.display === 'SOURCE → VIEW → LOST INFORMATION → RESIDUAL / SECOND VIEW → RETURN', 'residual grammar exact');
const phantom = receipt.residual_grammar.phantom_tine_match;
check(phantom.type === 'RESIDUAL_OR_SECOND_VIEW_WITNESS', 'phantom tine matches residual/second view');
check(phantom.existing_record === 'A0_PHANTOM_TINE_YUGO_SOURCE_TRIAGE_2026_10_27', 'existing triage reused');
check(phantom.face_count === 0, 'phantom tine adds zero faces');
check(!phantom.creates_identity && !phantom.creates_relation && !phantom.equals_yugo, 'phantom creates no identity/relation and is not YUGO');
check(Object.values(receipt.governance).every(value => value === 0), 'governance delta is zero');

console.log(`PASS ${checks}/${checks} cube-face residual source-bound crosswalk checks`);
