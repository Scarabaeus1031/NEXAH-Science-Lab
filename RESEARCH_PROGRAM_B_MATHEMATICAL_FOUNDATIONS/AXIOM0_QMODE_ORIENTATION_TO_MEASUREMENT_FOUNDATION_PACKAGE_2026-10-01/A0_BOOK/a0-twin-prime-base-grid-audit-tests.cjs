#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const Audit=require('./a0-twin-prime-base-grid-audit.js');

const receipt=Audit.buildReceipt();
assert.equal(Audit.PAIRS.length,40);
assert.deepEqual(Audit.PAIRS[29],{ordinal:30,values:[659,661],positions:[120,121]});
assert.deepEqual(Audit.PAIRS.at(-1),{ordinal:40,values:[1091,1093],positions:[182,183]});
assert.equal(receipt.distinct_prime_endpoints,79);
assert.deepEqual(receipt.count_base_crosswalk,{3:'1111',7:'55',11:'37',37:'13'});
assert.deepEqual(receipt.limit_base_crosswalk,{3:'1112011',7:'3145',11:'920',37:'U1'});
assert.deepEqual(receipt.largest_gap,{after_pair:30,left_pair:[659,661],right_pair:[809,811],integers_strictly_between:147,prime_positions:[122,139]});
assert.deepEqual(receipt.seam11.positions_base11,['AA','100']);
assert.equal(receipt.seam11.square,121);
assert.equal(receipt.seam11.center_mod11,0);
assert.equal(receipt.mirror_control.twin_images,0);
assert.equal(Audit.inspect(30).mirror.divisible_by_3_witness,615);
assert.deepEqual(Audit.inspect(30).value_addresses,[{mod7:1,mod11:10},{mod7:3,mod11:1}]);
assert.deepEqual(Audit.inspect(30).index_addresses,[{mod7:1,mod11:10},{mod7:2,mod11:0}]);
assert.deepEqual(Audit.inspect(30).index_factors,[[2,2,2,3,5],[11,11]]);
assert.deepEqual(Audit.inspect(30).bases[11],{values:['54A','551'],positions:['AA','100']});
assert.equal(Audit.inspect(30).next_gap.integers_strictly_between,147);
assert.deepEqual(Audit.inspect(30).packet.source,[
  {role:'L',value:659,residue:30,address:30},
  {role:'C',value:660,residue:31,address:68},
  {role:'R',value:661,residue:32,address:106}
]);
assert.deepEqual(Audit.inspect(30).packet.mirror,[
  {role:'L',value:613,residue:21,address:21},
  {role:'C',value:614,residue:22,address:59},
  {role:'R',value:615,residue:23,address:97}
]);
assert.deepEqual(Audit.inspect(30).packet.matrix,[
  {source_role:'L',source_address:30,mirror_role:'R',mirror_address:97},
  {source_role:'C',source_address:68,mirror_role:'C',mirror_address:59},
  {source_role:'R',source_address:106,mirror_role:'L',mirror_address:21}
]);
assert.equal(Audit.inspect(30).packet.full,true);
assert.deepEqual(Audit.layerRecords(32).filter(row=>row.value===661||row.value===809),[
  {pair:30,role:'R',value:661,residue:32},
  {pair:31,role:'L',value:809,residue:32}
]);
assert.equal(receipt.grid.total_nodes,2849);
assert.deepEqual(receipt.packet_register,{roles:['L','C','R'],states:111,address_rule:'role_index*37 + residue'});
assert.deepEqual(receipt.matrix111,{width:111,height:111,cells:12321,role:'SOURCE_PACKET_TO_R637_MIRROR_PACKET'});
assert.equal(Audit.inspect(40).next_gap,null);
assert.equal(Audit.baseString(40,3),'1111');
assert.equal(Audit.baseString(1111,37),'U1');
assert.throws(()=>Audit.inspect(0),/TWIN_PAIR_ORDINAL_INVALID/);
assert.throws(()=>Audit.baseString(1,38),/TWIN_BASE_RADIX_INVALID/);
assert.deepEqual([receipt.authority.new_canonical_ids,receipt.authority.relation_changes,receipt.authority.aliases],[[],[],[]]);

const bad=structuredClone(receipt);
bad.mirror_control.twin_images=1;
assert.throws(()=>Audit.validate(bad),/TWIN_AUDIT_MIRROR_INVALID/);

console.log(JSON.stringify({status:'PASS',schema:receipt.schema,checks:32,pairs:receipt.pair_count,largest_gap:receipt.largest_gap,mirror_twin_images:0,grid:'Z7 × Z11 × Z37',packet_register:111,matrix_cells:12321,graph_effect:{identities:0,relations:0,aliases:0,studies:0}},null,2));
