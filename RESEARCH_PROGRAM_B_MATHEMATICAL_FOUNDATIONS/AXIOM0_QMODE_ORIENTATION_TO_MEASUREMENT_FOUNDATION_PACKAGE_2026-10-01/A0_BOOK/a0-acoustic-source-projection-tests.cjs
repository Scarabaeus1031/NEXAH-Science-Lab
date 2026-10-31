#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const api = require('./a0-acoustic-source-projection.js');

const checks = [];
const check = (name, pass) => checks.push({name, pass:Boolean(pass)});
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets/a0-acoustic-source-projection-manifest-v1.json')));
const receipt = JSON.parse(fs.readFileSync(path.join(__dirname, 'results/a0-acoustic-source-projection-return-2026-10-30.json')));
const html = fs.readFileSync(path.join(__dirname, 'A0_F_A0_26_REVIEW_PROBE.html'), 'utf8');

check('24-address rail', api.RAIL_COUNT === 24);
check('two 12-class passes', Array.from({length:12},(_,i)=>api.pitchClass(i+12)).every((v,i)=>v===i));
check('fifth orbit is a 12-class permutation', new Set(api.fifthOrbit()).size === 12);
check('fifth step is +7 mod 12', api.fifthOrbit().every((v,i,a)=>i===0 || v===api.mod(a[i-1]+7,12)));
check('tritone is +6', Array.from({length:12},(_,i)=>api.tritonePartner(i)===api.mod(i+6,12)).every(Boolean));
for (let i=0;i<24;i+=1) {
  const recovered = api.recoverFanAddress(api.fanPoint(i, .37));
  check(`fan roundtrip ${i}`, recovered.status === 'EXACT' && recovered.railIndex === i && recovered.error < 1e-9);
}
check('fan apex is explicitly ambiguous', api.recoverFanAddress({x:.5,y:0}).status === 'AMBIGUOUS_APEX');
const con = api.fanTopology(24, false);
const dao = api.fanTopology(24, true);
check('CON is open P24', con.carrier === 'P24' && con.lineStates === 24 && con.innerPassages === 23 && con.totalPassages === 23);
check('CON retains two endpoints', con.endpoints === 2 && con.degreeProfile.filter(x=>x===1).length === 2);
check('CON has no graph cycle', con.graphEuler === 1 && con.cycleRank === 0);
check('DAO is closed C24', dao.carrier === 'C24' && dao.lineStates === 24 && dao.innerPassages === 23 && dao.returnSeams === 1 && dao.totalPassages === 24);
check('DAO has no endpoints', dao.endpoints === 0 && dao.degreeProfile.every(x=>x===2));
check('DAO seam creates exactly one graph cycle', dao.graphEuler === 0 && dao.cycleRank === 1);
check('open walker has 23 inner moves and one stop', api.walkerTrace(false).filter(x=>x.status==='INNER_PASSAGE').length === 23 && api.walkerTrace(false).at(-1).status === 'OPEN_STOP');
check('closed walker has one typed seam', api.walkerTrace(true).filter(x=>x.status==='RETURN_SEAM').length === 1 && api.walkerTrace(true).at(-1).to === 0);
check('23+1 is passage count not line count', dao.innerPassages + dao.returnSeams === dao.lineStates);
check('existing 13-state CON-DAO remains non-identical', api.model.conDaoExtension.existingCarrierCrosswalk.includes('NON_IDENTITY'));
const carrier = api.phase4Carrier(17, {t:.63, frequencyHz:440, geometry:'DECLARED_TEST_FIXTURE'});
check('phase4 carrier retains address', carrier.sourceAddress === 'rail:17' && carrier.pitchClass === 5);
check('phase4 carrier retains typed future inputs', ['frequencyHz','geometry','sourcePoint','boundaryPoint','receiverPoint','materialProfile'].every(k=>Object.hasOwn(carrier,k)));
check('phase4 authority stays closed', carrier.authority.measuredAcoustics === false && carrier.authority.physicalMechanism === false);
check('four source classes', manifest.classification_ledger.length === 4);
check('receipt source count matches manifest', receipt.phase1.source_count === manifest.sources.length);
check('core sources are historical visuals', manifest.sources.filter(s=>s.classification==='FORMALIZATION_CORE').length === 4);
for (const source of manifest.sources) {
  check(`source exists ${source.id}`, fs.existsSync(source.path));
  if (fs.existsSync(source.path)) {
    const hash = crypto.createHash('sha256').update(fs.readFileSync(source.path)).digest('hex');
    check(`source hash ${source.id}`, hash === source.sha256);
  }
}
check('receipt covers phases 1-3', receipt.completed_phases.join(',') === '1_SOURCE_INVENTORY,2_FORMAL_RECONSTRUCTION,3_TONE_RAIL_LYRA_PROJECTION');
check('phase4 is handoff only', receipt.phase4_handoff.status === 'READY_NOT_RUN');
check('no graph identity change', receipt.governance.new_navigator_ids.length === 0 && receipt.governance.source_graph_relation_changes.length === 0);
check('probe mounts extension', html.includes('data-acoustic-source-projection') && html.includes('a0-acoustic-source-projection.js'));
check('probe exposes CON-DAO control', html.includes('data-projection-mode="con-dao"') && html.includes('data-topology-toggle'));

const failures = checks.filter(x=>!x.pass);
if (failures.length) {
  console.error(JSON.stringify({status:'FAIL', checks:checks.length, failures}, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({status:'PASS', checks:checks.length, scope:api.model.scope, phase4:'READY_NOT_RUN'}, null, 2));
