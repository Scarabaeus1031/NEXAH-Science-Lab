#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('./a0-tesseract-face-coupler.js');
const U=require('./a0-ullinirium-q4-view-anchor.js');
const html=fs.readFileSync(path.join(__dirname,'A0_BLUE_PINK_DODECA_CELL_RETURN.html'),'utf8');
const checks=[];
const test=(name,fn)=>{try{fn();checks.push({name,pass:true})}catch(error){checks.push({name,pass:false,error:error.message})}};

test('reuses experimental UDF profile namespace',()=>assert.equal(U.SCHEMA,'nexah.udf.ullinirium-q4-view-anchor/0.1.0-experimental'));
test('Q4 exposes twelve unordered antipode pairs',()=>assert.equal(U.PAIRS.length,12));
test('all pair origins are distinct',()=>assert.equal(new Set(U.PAIRS.map(pair=>pair.origin)).size,12));
test('all pair targets are distinct',()=>assert.equal(new Set(U.PAIRS.map(pair=>pair.target)).size,12));
test('each declared target is exact Q4 antipode',()=>U.PAIRS.forEach(pair=>assert.equal(C.antipode(pair.origin).id,pair.target)));
test('slot to pair to slot is exact',()=>U.PAIRS.forEach(pair=>assert.equal(U.returnSlot(pair.origin,pair.target),pair.slot)));
test('reversed pair also returns exact slot',()=>U.PAIRS.forEach(pair=>assert.equal(U.returnSlot(pair.target,pair.origin),pair.slot)));
test('yellow route has origin hinge target',()=>U.PAIRS.forEach(pair=>assert.equal(U.createReceipt({slot:pair.slot,route:'YELLOW'}).mapping.route_path.length,3)));
test('pink route has origin hinge target',()=>U.PAIRS.forEach(pair=>assert.equal(U.createReceipt({slot:pair.slot,route:'PINK'}).mapping.route_path.length,3)));
test('yellow and pink retain same endpoints',()=>U.PAIRS.forEach(pair=>{const y=U.createReceipt({slot:pair.slot,route:'YELLOW'}).mapping.route_path,p=U.createReceipt({slot:pair.slot,route:'PINK'}).mapping.route_path;assert.equal(y[0],p[0]);assert.equal(y[2],p[2]);assert.notEqual(y[1],p[1])}));
test('ULLINIRIUM source contract is 12 plus one',()=>{const r=U.createReceipt();assert.deepEqual([r.source.ring_slots,r.source.return_pivots],[12,1])});
test('view anchor is 135 degrees',()=>assert.equal(U.createReceipt().source.view_anchor_degrees,135));
test('mapping is view index not identity',()=>{const r=U.createReceipt();assert.equal(r.mapping.identity_claim,false);assert.equal(r.mapping.geometric_equivalence_claim,false)});
test('LUX arithmetic is exact',()=>assert.deepEqual([U.LUX.L,U.LUX.unitAddress,U.LUX.doubleAddress],[50,2501,5002]));
test('LUX address is not derived from slot',()=>U.PAIRS.forEach(pair=>assert.equal(U.createReceipt({slot:pair.slot}).labels.LUX.derived_from_slot,false)));
test('nXeT remains working label',()=>assert.equal(U.createReceipt().labels.nXeT.status,'WORKING_LABEL_NOT_OPERATOR'));
test('XVA remains provenance label',()=>assert.equal(U.createReceipt().labels.XVA.status,'HISTORICAL_PROVENANCE_NOT_FORMAT_IMPLEMENTATION'));
test('return never mutates source',()=>U.PAIRS.forEach(pair=>assert.equal(U.createReceipt({slot:pair.slot}).return.source_mutation,false)));
test('no canonical identity relation or alias effect',()=>{const r=U.createReceipt();assert.deepEqual([r.new_canonical_ids,r.relation_changes,r.aliases],[[],[],[]])});
test('invalid slot fails closed',()=>assert.throws(()=>U.createReceipt({slot:12}),/ULLINIRIUM_SLOT_INVALID/));
test('invalid route fails closed',()=>assert.throws(()=>U.createReceipt({route:'X'}),/ULLINIRIUM_ROUTE_INVALID/));
test('tampered pair fails closed',()=>{const r=structuredClone(U.createReceipt());r.mapping.antipode=U.PAIRS[1].target;assert.throws(()=>U.validate(r),/ULLINIRIUM_Q4_PAIR_INVALID/)});
test('tampered address lens fails closed',()=>{const r=structuredClone(U.createReceipt());r.labels.LUX.address=5002;assert.throws(()=>U.validate(r),/ULLINIRIUM_LUX_LENS_INVALID/)});
test('HTML mounts bounded connector',()=>assert(html.includes('data-uq4-anchor')&&html.includes('a0-ullinirium-q4-view-anchor.js')));
test('HTML states non-identity boundary',()=>assert(html.includes('12↔12 View-Index-Brücke')&&html.includes('keine Geometrie-Identität')));

const failures=checks.filter(check=>!check.pass);
if(failures.length){console.error(JSON.stringify({status:'FAIL',checks:checks.length,failures},null,2));process.exit(1)}
console.log(JSON.stringify({status:'PASS',checks:checks.length,pairs:U.PAIRS.length,schema:U.SCHEMA,graph_effect:{identities:0,relations:0,aliases:0}},null,2));
