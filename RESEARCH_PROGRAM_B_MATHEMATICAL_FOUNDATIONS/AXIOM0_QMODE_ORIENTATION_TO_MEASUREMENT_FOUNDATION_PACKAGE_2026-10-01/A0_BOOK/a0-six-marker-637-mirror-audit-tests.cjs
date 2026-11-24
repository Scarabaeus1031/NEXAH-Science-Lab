#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const Audit=require('./a0-six-marker-637-mirror-audit.js');

const receipt=Audit.buildReceipt();
assert.equal(receipt.status,'PASS_BOUNDED_OPERATOR_COMPARISON');
assert.deepEqual(Audit.MARKERS,[237,337,537,637,737,937]);
assert.deepEqual(receipt.rows.map(row=>row.slot.marker),[237,937,737,637,537,337]);
assert.deepEqual(receipt.rows.map(row=>row.numeric.output),[1037,937,737,637,537,337]);
assert.deepEqual(receipt.rows.map(row=>row.residue.input),[15,4,19,8,34,12]);
assert.deepEqual(receipt.rows.map(row=>row.residue.output),[22,33,18,29,3,25]);
assert.equal(Audit.slotMirrorMarker(Audit.slotMirrorMarker(337)),337);
assert.equal(Audit.numericMirror(Audit.numericMirror(237)),237);
assert.equal(Audit.residueNegation(Audit.residueNegation(19)),19);
assert.equal(Audit.numericMirror(637),637);
assert.equal(Audit.residueNegation(0),0);
assert.deepEqual(receipt.exact_overlap.slot_numeric_markers,[337,537,637,737,937]);
assert.deepEqual(receipt.exact_overlap.all_three_fixed_markers,[]);
assert.deepEqual(receipt.exact_overlap.mod37_pair_18_19,{witness_marker:537,residue:19,image:18});
assert.equal(Audit.inspect(537).coincidences.slot_and_numeric,true);
assert.equal(Audit.inspect(237).coincidences.slot_and_numeric,false);
assert.equal(Audit.inspect(637).numeric.fixed,true);
assert.equal(Audit.inspect(637).slot.fixed,true);
assert.equal(Audit.inspect(637).residue.fixed,false);
assert.throws(()=>Audit.inspect(999),/MIRROR_AUDIT_MARKER_UNKNOWN/);
assert.equal(receipt.boundary.ij_half_seam_identity,false);
assert.equal(receipt.boundary.score_mirror_identity,false);
assert.deepEqual(receipt.authority.identity_reuse,['MOD:NUMBER_VIEW_SUITE','NN:CRT_QRT_37_CARRIER_LADDER']);
assert.deepEqual([receipt.authority.new_canonical_ids,receipt.authority.relation_changes,receipt.authority.aliases],[[],[],[]]);

const bad=structuredClone(receipt);
bad.operators.residue.namespace='IJ_HALF_SEAM';
assert.throws(()=>Audit.validate(bad),/MIRROR_AUDIT_RESIDUE_NAMESPACE_INVALID/);

console.log(JSON.stringify({
  status:'PASS',schema:receipt.schema,checks:24,
  operators:['J6','R637','N37'],
  overlap:receipt.exact_overlap,
  boundaries:{ij_half_seam_identity:false,score_mirror_identity:false},
  graph_effect:{identities:0,relations:0,aliases:0,studies:0}
},null,2));
