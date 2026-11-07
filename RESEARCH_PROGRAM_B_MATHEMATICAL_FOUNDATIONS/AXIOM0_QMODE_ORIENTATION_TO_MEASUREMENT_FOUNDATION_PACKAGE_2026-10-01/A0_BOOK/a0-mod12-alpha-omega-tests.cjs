'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const M=require('./a0-mod12-alpha-omega.js');
let passed=0;
const ok=(condition,label)=>{assert.ok(condition,label);passed++;};
const eq=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);passed++;};

eq(M.MODULUS,12,'one Z12 carrier');
eq(M.PITCHES.length,12,'twelve address labels');
eq(M.mod(-1),11,'Euclidean -1 equals 11');
eq(M.gcd(7,12),1,'alpha coprime to carrier');
eq(M.gcd(11,12),1,'omega coprime to carrier');
eq(M.order(7),12,'alpha order 12');
eq(M.order(11),12,'omega order 12');
eq(M.order(6),2,'composition control order 2');
eq(M.order(4),3,'non-coprime control order 3');
eq(M.order(3),4,'non-coprime control order 4');

const alpha=M.walk(7),omega=M.walk(11);
eq(alpha.addresses,[0,7,2,9,4,11,6,1,8,3,10,5,0],'alpha route exact');
eq(omega.addresses,[0,11,10,9,8,7,6,5,4,3,2,1,0],'omega route exact');
ok(alpha.visits_all_nodes&&omega.visits_all_nodes,'both generators visit all nodes');
ok(alpha.self_inverse&&omega.self_inverse,'both generators are self-inverse as multipliers');
ok(alpha.return_exact&&omega.return_exact,'both routes return after 12 steps');
eq(new Set(alpha.addresses.slice(0,-1)).size,12,'alpha no early duplicate');
eq(new Set(omega.addresses.slice(0,-1)).size,12,'omega no early duplicate');

eq(M.stationIndex(7,7),1,'G is alpha step 1');
eq(M.stationIndex(7,4),4,'E is alpha step 4');
eq(M.stationIndex(11,7),5,'G is omega step 5');
eq(M.stationIndex(11,4),8,'E is omega step 8');
eq(M.snapshot(1,'alpha').label,'G','alpha first address is G');
eq(M.snapshot(8,'omega').label,'E','omega eighth address is E');
ok(M.snapshot(12,'omega').return_exact,'cursor 12 is exact local return');

const receipt=M.receipt();
eq(receipt.composition.step,6,'alpha plus omega composes to +6');
eq(receipt.composition.mutual_inverses,false,'alpha and omega are not mutual inverses');
eq(receipt.composition.order,2,'composition is order two');
eq(receipt.new_identity,false,'no new identity');
eq(receipt.new_relation,false,'no new relation');
eq(receipt.notation.BODIE_DOYLE,'OWNER_MNEMONIC_UNBOUND','Bodie Doyle held unbound');
ok(receipt.boundary.includes('NO ACOUSTIC MEASUREMENT'),'acoustic boundary explicit');
ok(receipt.boundary.includes('MOBIUS TOPOLOGY'),'Mobius boundary explicit');

for(let start=0;start<12;start++){
  ok(M.walk(7,start).return_exact&&M.walk(11,start).return_exact,'translated start '+start+' returns');
  eq(new Set(M.walk(7,start).addresses.slice(0,-1)).size,12,'translated alpha covers carrier '+start);
}

const base=__dirname;
const html=fs.readFileSync(path.join(base,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
ok(html.includes('id="mod12-alpha-omega-return-20261106"'),'Numbermagick page carries Z12 return anchor');
ok(html.includes('data-z12-alpha-omega'),'interactive lens host present');
ok(html.includes('Bodie / Doyle'),'owner mnemonic boundary visible');
ok(html.includes('a0-mod12-alpha-omega.js'),'runtime linked');
const stored=JSON.parse(fs.readFileSync(path.join(base,'results/a0-mod12-alpha-omega-return-2026-11-06.json'),'utf8'));
eq(stored,receipt,'stored receipt exactly matches executable return');

console.log(JSON.stringify({status:'PASS',assertions:passed,schema:receipt.schema,identity_reuse:receipt.identity_reuse,new_identity:false,new_relation:false},null,2));
