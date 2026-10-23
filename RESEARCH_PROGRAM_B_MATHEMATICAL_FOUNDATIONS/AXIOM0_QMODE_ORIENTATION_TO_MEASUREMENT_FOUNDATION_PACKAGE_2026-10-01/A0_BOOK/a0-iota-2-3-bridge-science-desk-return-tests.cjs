'use strict';
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,file),'utf8');
const desk=read('A0_RESEARCH_DESK.html');
const bench=read('A0_ORIENTATION_CONTROLLER_BENCH.html');
const log=read('A0_BUILDER_LOG.html');
const receipt=JSON.parse(read('results/a0-iota-2-3-bridge-probe-2026-10-23.json'));
let checks=0;const ok=(value,label)=>{checks++;if(!value)throw new Error(`FAIL ${checks}: ${label}`)};
for(const [source,token] of [
  [desk,'iota-2-3-bridge-return-20261023'],[desk,'2|3 Pulse Bridge'],[desk,'16=2⁴=2^(2²)=2×8'],[desk,'kein <code>F-A0</code>-Finding'],
  [bench,'id="iota23Bridge"'],[bench,'data-i23-layer="FACTOR"'],[bench,'A0_RESEARCH_DESK.html#iota-2-3-bridge-return-20261023'],
  [log,'iota-2-3-bridge-20261023'],[log,'IMPLEMENTED_BOUNDED_ENGINEERING_VIEW'],[log,'85/85 PASS']
])ok(source.includes(token),`missing ${token}`);
ok(receipt.status==='PASS','receipt pass');ok(receipt.checks===85,'85 checks recorded');ok(receipt.identity==='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','identity reused');
ok(receipt.integration.bench_anchor==='#iota23Bridge','bench anchor');ok(receipt.integration.science_desk_anchor==='#iota-2-3-bridge-return-20261023','desk anchor');
ok(receipt.integration.orientation_binding==='READ_ONLY','orientation read only');ok(receipt.integration.new_canonical_object===false,'no new canonical object');
ok(receipt.authority.research_run===false,'no research run');ok(receipt.authority.scientific_evidence===false,'no scientific evidence');ok(receipt.authority.new_identity===false&&receipt.authority.new_relation===false,'no graph mutation');
console.log(JSON.stringify({status:'PASS',checks,scope:'2|3 IOTA Bridge Bench view and Science Desk engineering return; no finding promotion'}));
