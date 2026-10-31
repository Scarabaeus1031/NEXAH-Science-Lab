#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const model = require('./a0-f-a0-26-review-probe.js');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'A0_F_A0_26_REVIEW_PROBE.html'), 'utf8');
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'results/a0-octave-2plus3-cross-carrier-finding-return-2026-10-30.json'), 'utf8'));
const checks = [];
const check = (name, pass) => checks.push({name, pass:Boolean(pass)});
const r = model.review;

check('finding reused', r.finding === 'F-A0-26');
check('owner scope closed', r.ownerScope === 'CLOSED_BOUNDED_DESCRIPTIVE_FINDING');
check('independent review stays open', r.independentReview === 'OPEN');
check('partition exact', r.partition.reduce((a,b)=>a+b,0) === r.total);
check('ten labeled cuts', r.labeledCuts === 10);
check('keyboard positions', r.keyboard.positions.join(',') === '1,3,6,8,10');
check('keyboard gaps', r.keyboard.gaps.join(',') === '2,3,2,2,3');
check('five of twelve total', r.keyboard.allFiveOfTwelveSelections === 792);
check('keyboard orbit count', r.keyboard.exactSpacingOrbitCountAmongFiveOfTwelve === 12);
check('graph split', r.graph.cycleDegree + r.graph.residualDegree === r.graph.fullDegree);
check('graph cycles', r.graph.anchoredUndirectedHamiltonianCycles === 1280);
check('graph assignments', r.graph.labeledAssignments === 30720);
check('no distinguished graph cycle', r.graph.distinguishedCycle === false);
check('clamp split', r.clamp.declaredUpRoles + r.clamp.declaredDownRoles === 5);
check('mirror swaps roles', model.evaluate('observed', true).left === 3 && model.evaluate('observed', true).right === 2);
check('count specificity fails', r.verdicts.countSpecificity === 'FAIL');
check('transport held', r.verdicts.sharedTransport === 'HOLD');
check('shared mechanism rejected', r.verdicts.sharedMechanism === 'REJECT');
check('acoustic input open', r.acoustics.measuredInput === 'OPEN');
check('acoustics outside exact core', r.acoustics.includedInExactFindingCore === false);
check('octave ratio', r.acoustics.octaveRatio === 2);
check('comma nonzero', r.acoustics.pythagoreanCommaCents > 23 && r.acoustics.pythagoreanCommaCents < 24);
check('HTML binds model', html.includes('a0-f-a0-26-review-probe.js'));
check('HTML has all nulls', ['Null N1','Null N2','Null N3'].every(x=>html.includes(x)));
check('HTML preserves measured boundary', html.includes('measured_input = OPEN'));
check('receipt records null review', receipt.review_closeout && receipt.review_closeout.null_model.status === 'COMPLETE');
check('receipt owner close distinct from external review', receipt.review_closeout.owner_scope === 'CLOSED' && receipt.review_closeout.independent_review === 'OPEN');
check('receipt preserves no publication', receipt.paper_route.publication_authorized === false);

const failures = checks.filter(x=>!x.pass);
if (failures.length) {
  console.error(JSON.stringify({status:'FAIL', checks:checks.length, failures}, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({status:'PASS', checks:checks.length, finding:r.finding, disposition:'OWNER_SCOPE_CLOSED / INDEPENDENT_REVIEW_OPEN'}, null, 2));
