const assert=require('node:assert/strict');
const data=require('./a0-periodic-elements-z100-pubchem.js');
const model=require('./a0-periodic-carrier-z100.js');

let checks=0;
function ok(value,message){assert.ok(value,message);checks+=1;}

const report=model.validate(data);
ok(report.ok,report.failures.join('; '));
ok(report.carrierCount===100,'Z100 contains exactly 100 official records');
ok(report.boundary.z===101&&report.boundary.symbol==='Md'&&report.boundary.name==='Mendelevium','Md Z101 remains the external official control');

const rows=model.carrierRows(data);
ok(rows[0].z===1&&rows[0].symbol==='H','carrier begins at H Z1');
ok(rows.at(-1).z===100&&rows.at(-1).symbol==='Fm','carrier ends at Fm Z100');
ok(!rows.some(row=>/ullin/i.test(`${row.symbol} ${row.name}`)),'ULLINIRIUM is absent from the chemistry register');
ok(new Set(rows.map(row=>row.z)).size===100,'atomic numbers are unique');
ok(new Set(rows.map(row=>row.symbol)).size===100,'symbols are unique');

const modern=new Set(rows.map(row=>{const p=model.periodicPosition(row.z);return `${p.row}:${p.col}`;}));
const cube=new Set(rows.map(row=>{const p=model.cubePosition(row.z);return `${p.deck}:${p.slot}`;}));
ok(modern.size===100,'modern view has 100 unique addresses');
ok(cube.size===100,'Z100 view has 100 unique addresses');

for(const row of rows){
  ok(model.periodicPosition(row.z)!==null,`modern address exists for Z${row.z}`);
  ok(model.cyclicPosition(row.z)!==null,`cycle address exists for Z${row.z}`);
  ok(model.cubePosition(row.z)!==null,`Z100 address exists for Z${row.z}`);
}

const fmCycle=model.ledger(100,'cycle');
const fmCube=model.ledger(100,'cube');
ok(fmCycle.unresolved.length===0&&fmCube.unresolved.length===0,'complete fixture produces no unresolved address');
ok(model.cycleNeighbors(100).includes(1),'declared cycle closes Z100 to Z1 as view adjacency only');
ok(!model.cubeNeighbors(100).includes(1),'Z100 carrier does not infer cyclic closure');
ok(model.modernNeighbors(100).every(z=>z>=1&&z<=100),'modern neighbours stay inside the bounded carrier');

const pa=model.pa231SevenfoldCalibration();
ok(pa.nuclear.atomicNumber+pa.nuclear.neutrons===pa.nuclear.massNumber,'Pa-231 mass partition closes exactly');
ok(pa.nuclear.quotients.join(',')==='13,20,33','Pa-231 records the three exact quotients under division by 7');
ok(pa.angular.m.join(',')==='-3,-2,-1,0,1,2,3','5f angular cut exposes exactly seven declared m_l labels');
ok(pa.ledger.retained.length===1&&pa.ledger.retained[0]==='cardinality:7','only shared cardinality 7 is retained');
ok(pa.ledger.unresolved.includes('causal coupling')&&pa.result==='CARDINALITY_ONLY_PASS','causal coupling remains unresolved after a passing calibration');
ok(/NO NEW RELATION/.test(pa.stop),'STOP prevents relation promotion');

const broSis=model.broSisRelationTest(data);
ok(broSis.result==='EXACT_ADDRESS_FIXTURE_PASS','BRO/SIS declared token fixture resolves against the bounded Z100 carrier');
ok(broSis.cuts.bro.map(row=>row.z).join(',')==='35,8','BRO resolves exactly to Br/Z35 and O/Z8');
ok(broSis.cuts.sis.map(row=>row.z).join(',')==='16,53,16','SIS resolves exactly and retains both S/Z16 positions');
ok(broSis.cuts.brother.map(row=>row.z).join(',')==='35,8,90,68','BROTHER control path resolves only as Br/O/Th/Er register tokens');
ok(broSis.frame.time==='T'&&broSis.frame.relation==='R','shared T frame and R comparison record are explicit');
ok(broSis.ledger.unresolved.includes('O↔0 glyph reading')&&broSis.ledger.unresolved.includes('Th↔θ glyph reading'),'glyph readings remain unresolved');
ok(broSis.ledger.unresolved.includes('semantic coupling')&&broSis.ledger.unresolved.includes('causal coupling'),'semantic and causal coupling remain unresolved');
ok(/NO NEW RELATION/.test(broSis.stop),'BRO/SIS STOP prevents relation promotion');

const ioi=model.ioiQ0CounterAxisTest(data);
ok(ioi.result==='EXACT_COUNTER_AXIS_FIXTURE_PASS','A0 I0I fixture resolves four bounded Z100 addresses and both 101 folds');
ok(Object.values(ioi.cells).map(row=>`${row.symbol}${row.z}`).join(',')==='Rh45,Pd46,Cs55,Ba56','Q0 window resolves exactly to Rh45 Pd46 Cs55 Ba56');
ok(ioi.diagonalSums.a===101&&ioi.diagonalSums.b===101,'both diagonal fold paths sum exactly to 101');
ok(ioi.counterAxis.left===100&&ioi.counterAxis.right===102,'left and right counter-axis sums preserve 101 plus or minus 1');
ok(ioi.offsets.left===-1&&ioi.offsets.right===1,'left and right side-bit offsets remain signed');
ok(ioi.counterAxis.top===91&&ioi.counterAxis.bottom===111,'top and bottom counter-axis sums preserve 101 plus or minus 10');
ok(ioi.offsets.top===-10&&ioi.offsets.bottom===10,'top and bottom decade offsets remain signed');
ok(ioi.carrierTotal===202&&ioi.mean===50.5,'four-cell carrier closes at 202 with mean 50.5');
ok(ioi.notation.view==='I0I'&&ioi.notation.number===101&&ioi.notation.externalElement==='Md/Z101','I0I view, number 101 and external Md Z101 remain separate records');
ok(ioi.ledger.lost.includes('path provenance when only 101 is retained'),'return ledger records provenance loss without the counter-axis');
ok(ioi.ledger.unresolved.includes('physical mechanism')&&ioi.ledger.unresolved.includes('prime or zero interpretation'),'mechanism and prime or zero readings remain unresolved');
ok(/I0I != 101 != Md\/Z101/.test(ioi.stop)&&/NO NEW RELATION/.test(ioi.stop),'A0 I0I STOP prevents identity and relation promotion');

const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'A0_PERIODIC_CARRIER_Z100_2026-11-03.html'),'utf8');
ok(/id="game-of-worlds-carrier-binding"[^>]*data-worlds-binding="source-bound"/.test(html),'Periodic Carrier exposes one source-bound Game of Worlds handoff');
ok(['modern','cycle','z100','iota'].every(role=>html.includes(`data-carrier-role="${role}"`)),'handoff keeps Modern Cycle Z100 and IOTA as four typed roles');
ok(html.includes('../A0_GAME_OF_WORLDS.html')&&html.includes('../A0_GAME_OF_WORLDS_PLAY.html?world=numbers#numbers'),'handoff points to the existing Game of Worlds map and Number Lens');
ok(html.includes('../A0_IOTA_BRIDGE_DEMONSTRATOR.html'),'handoff reuses the existing IOTA Bridge demonstrator');
ok(/Wobble[^<]*bezeichnet hier den Wechsel einer Projektion/.test(html),'wobble is bounded as projection change rather than material mechanism');
ok(html.includes('<code>T/L/L</code>')&&html.includes('und weitere Glyph-Lesarten bleiben Kandidaten'),'TLL and glyph readings remain explicit candidates');
ok(/weder eine zweite Game-of-Worlds-Identität noch einen gemeinsamen physikalischen Generator/.test(html),'boundary prevents duplicate identity and physical generator claims');

console.log(`PASS · ${checks} assertions · Z100 Periodic Carrier candidate`);
