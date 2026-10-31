#!/usr/bin/env node
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('./a0-tesseract-face-coupler.js');
const D=require('./a0-bridge-address-acoustic-dock.js');

const html=fs.readFileSync(path.join(__dirname,'A0_IOTA_BRIDGE_DEMONSTRATOR.html'),'utf8');
const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,'results/a0-tesseract-face-coupler-return-2026-10-30.json'),'utf8'));
const checks=[];
const test=(name,fn)=>{try{fn();checks.push({name,pass:true})}catch(error){checks.push({name,pass:false,error:error.message})}};

test('existing IOTA schedule remains mounted',()=>assert(html.includes('id="iota23Bridge"')&&html.includes('A0Iota23BridgeProbe.mount')));
test('Grid Bridge flagship has a dedicated anchor',()=>assert(html.includes('id="gridBridgeFlagship"')));
test('quick access routes to Grid Bridge flagship',()=>assert(html.includes('href="#gridBridgeFlagship"')));
test('flagship reuses the exact face coupler runtime',()=>assert(html.includes('a0-tesseract-face-coupler.js')&&html.includes('A0TesseractFaceCoupler.mount(document)')));
test('flagship reuses the face coupler stylesheet',()=>assert(html.includes('a0-tesseract-face-coupler.css')));
test('all five typed view ports are present',()=>assert(['data-tfc-antipode','data-tfc-cube','data-tfc-transition-tile','data-tfc-zither','data-tfc-euler'].every(token=>html.includes(token))));
test('all interactive flagship controls are present',()=>assert(['data-tfc-face','data-tfc-flip','data-tfc-step','data-tfc-play','data-tfc-rotate'].every(token=>html.includes(token))));
test('Bridge contract is declared as Bridge not Tower',()=>assert(html.includes('BRIDGE · NOT TOWER · 5 TYPED PORTS')));
test('source identity is reused rather than replaced',()=>assert(html.includes('Source-Identität bleibt <code>MOD:TESSAREC</code>')));
test('geometric A and display J are kept distinct',()=>assert(html.includes('<code>A</code> ist die geometrische Face-Antipode')&&html.includes('<code>J_view</code> kippt nur PINK/BLACK')));
test('typed views reject common-carrier identity',()=>assert(html.includes('typisierte Views, keine gemeinsamen Träger')));
test('Tower is downstream comparator only',()=>assert(html.includes('Tower darf mehrere Bridge-Receipts vergleichen')&&html.includes('steuert diese Bridge aber nicht')));
test('Source Bench handoff is linked',()=>assert(html.includes('A0_ORIENTATION_CONTROLLER_BENCH.html#tesseractFaceCoupler')));
test('exact receipt handoff is linked',()=>assert(html.includes('results/a0-tesseract-face-coupler-return-2026-10-30.json')));
test('Tower comparator handoff is linked',()=>assert(html.includes('A0_TOWER_RETURN_DEMONSTRATOR.html')));
test('both Z28 winding layouts are explicit controls',()=>assert(['data-tfc-winding-mode="ROW_MAJOR"','data-tfc-winding-mode="INTERLEAVED_4J"'].every(token=>html.includes(token))));
test('transition and prime ledgers are mounted',()=>assert(['data-tfc-transition-out','data-tfc-prime-out','data-tfc-curtain-out'].every(token=>html.includes(token))));
test('Tower intake receives five typed port receipts',()=>assert(['Q4 / 24','G8³ / 512','Tile 16+1','Z28 / 4×7','Z48 / Rank48','data-tfc-tower-out'].every(token=>html.includes(token))));
test('winding boundary distinguishes plate recurrence from residue return',()=>assert(html.includes('dieselbe Plate erscheint alle vier Residuen')&&html.includes('derselbe Residuenport erst nach 28')));
test('flagship receipt points back to its surface',()=>assert.equal(receipt.flagship_surface,'A0_BOOK/A0_IOTA_BRIDGE_DEMONSTRATOR.html#gridBridgeFlagship'));
test('receipt route declares source through flagship and address dock to return',()=>assert.equal(receipt.a0_binding.route,'SOURCE_BENCH_TO_GRID_BRIDGE_FLAGSHIP_TO_ADDRESS_ACOUSTIC_DOCK_TO_EXACT_RECEIPT'));
test('exact Q4 counts retained',()=>assert.deepEqual([C.vertices.length,C.edges.length,C.faces.length,C.receipt.counts.cubes],[16,32,24,8]));
test('declared pipeline counts retained',()=>assert.deepEqual([C.receipt.counts.cubeSamples,C.receipt.counts.zitherAddresses,C.receipt.counts.scheduleAddresses],[512,28,48]));
test('relation matrix remains fully partitioned',()=>assert.equal(Object.values(C.relationCounts).reduce((a,b)=>a+b,0),576));
test('every face keeps a 128-sample projected source set',()=>assert(C.faces.every(face=>C.projectionForFace(face).selected.length===128)));
test('rank48 remains a permutation',()=>assert.equal(new Set(Array.from({length:48},(_,k)=>C.fibonacciEulerCoupling(k).eulerAddress)).size,48));
test('all 512 samples survive the 16+1 transition adapter',()=>{const audit=C.auditTransitionTile();assert.deepEqual([audit.sampleCount,audit.addressPass,audit.residuePass,audit.pass],[512,512,512,true])});
test('transition tile reconstructs every source address exactly',()=>C.cubeSamples.forEach(sample=>assert.equal(C.reconstructTransitionTile(C.transitionTileAddress(sample)).linear,sample.linear)));
test('signed Euler schedules are conjugate return views',()=>{for(let k=0;k<48;k+=1){const f=C.fibonacciEulerCoupling(k,C.EULER_DIRECTION.FORWARD),r=C.fibonacciEulerCoupling(k,C.EULER_DIRECTION.REVERSE);assert(Math.abs(f.phaseReal-r.phaseReal)<1e-12);assert(Math.abs(f.phaseImaginary+r.phaseImaginary)<1e-12);assert.equal((f.eulerAddress+r.eulerAddress)%48,0)}});
test('handoff receipt preserves address weight residue and return',()=>{const h=C.transitionHandoff(C.cubeSamples[331],0.25,C.WINDING_MODE.INTERLEAVED_4J,31,C.EULER_DIRECTION.REVERSE),a=C.reconstructHandoff(h);assert.deepEqual([h.sourceAddress,h.weight,h.loss.length,h.gaps.length,a.sourceExact,a.domainExact,a.weightExact,a.residueExact,a.returnExact,a.pass],['G8:3,1,5|q=1111',0.25,0,0,true,true,true,true,true,true])});
test('transition handoff controls and ledgers are mounted',()=>assert(['data-tfc-euler-direction="1"','data-tfc-euler-direction="-1"','data-tfc-handoff-out','data-tfc-loss-out','data-tfc-reconstruct-out'].every(token=>html.includes(token))));
test('existing carrier identity is unchanged',()=>assert.equal(receipt.carrier,'MOD:TESSAREC'));
test('receipt records both winding layouts',()=>assert.deepEqual(receipt.winding.layouts,['ROW_MAJOR','INTERLEAVED_4J']));
test('receipt records tenth-prime residue and 4j family',()=>assert.deepEqual([receipt.winding.prime_29.ordinal,receipt.winding.prime_29.residue,receipt.winding.prime_29.plate_family],[10,1,[1,5,9,13,17,21,25]]));
test('receipt keeps Tower as non-steering comparator',()=>assert.deepEqual([receipt.tower_intake.receipts,receipt.tower_intake.common_carrier,receipt.tower_intake.steering],[5,false,false]));
test('Address and Lyra dock has a dedicated Bridge port',()=>assert(html.includes('id="bridgeAcousticDock"')&&html.includes('href="#bridgeAcousticDock"')));
test('Address and Lyra dock mounts both existing source and local adapter',()=>assert(html.includes('a0-acoustic-source-projection.js')&&html.includes('a0-bridge-address-acoustic-dock.js')&&html.includes('A0BridgeAddressAcousticDock.mount(document)')));
test('supported address bases retain exact finite words',()=>assert.deepEqual([D.baseWord(47,2),D.baseWord(47,12),D.baseWord(59,20)],['101111','3B','2J']));
test('sample 23 closes the Lyra rail and keeps its coupled pole',()=>{const s=D.state(23,12,5);assert.deepEqual([s.railIndex,s.opposite,s.phase11,s.residue,s.passage,s.passageStatus],[23,11,1,3,'23→0','RETURN_SEAM'])});
test('sample 24 starts a new source phase without changing carrier class',()=>{const s=D.state(24,12,6);assert.deepEqual([s.baseWord,s.railIndex,s.opposite,s.note,s.fifthClass,s.commonCarrier,s.measuredInput],['20',0,12,'C',7,false,false])});
test('address dock receipt preserves source-bound claim boundary',()=>assert.deepEqual([receipt.address_acoustic_dock.source,receipt.address_acoustic_dock.lyra_pole_rule,receipt.address_acoustic_dock.sp_phase_rule,receipt.address_acoustic_dock.common_carrier,receipt.address_acoustic_dock.measured_acoustic_input],['A0_ACOUSTIC_SOURCE_PROJECTION_RETURN_V1','p <-> p+12 mod 24','n mod 11',false,false]));
test('governance declares no graph mutations',()=>assert.deepEqual([receipt.governance.new_navigator_ids.length,receipt.governance.source_graph_relation_changes.length,receipt.governance.node_count_delta,receipt.governance.relation_count_delta],[0,0,0,0]));

const failures=checks.filter(check=>!check.pass);
if(failures.length){console.error(JSON.stringify({status:'FAIL',checks:checks.length,failures},null,2));process.exit(1)}
console.log(JSON.stringify({status:'PASS',checks:checks.length,surface:receipt.flagship_surface,carrier:receipt.carrier,pipeline:'Q4/24 -> G8^3/512 -> Tile 16+1 -> Zither 4x7 -> Rank48 -> BASE/MOD/SP -> Lyra24'},null,2));
