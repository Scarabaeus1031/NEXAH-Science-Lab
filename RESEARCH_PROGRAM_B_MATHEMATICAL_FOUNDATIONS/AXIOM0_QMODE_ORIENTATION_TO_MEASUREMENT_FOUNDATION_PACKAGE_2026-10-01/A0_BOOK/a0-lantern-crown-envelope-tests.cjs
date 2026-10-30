'use strict';
const assert=require('node:assert/strict');
const cp=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;

const run=cp.spawnSync(process.execPath,['a0-lantern-crown-envelope-runner.cjs'],{cwd:root,encoding:'utf8'});
assert.equal(run.status,0,run.stderr||run.stdout);
const output=JSON.parse(run.stdout);
assert.equal(output.status,'PASS_WITH_EARLY_STOP_AND_CONTINUOUS_HOLD');
assert.equal(output.checks,'102751/102751');
assert.ok(output.safeStopDegrees>148&&output.safeStopDegrees<149);
assert.ok(output.earlyStopDegrees>3&&output.earlyStopDegrees<4);
assert.ok(output.residualApertureMillimetres>5&&output.residualApertureMillimetres<5.2);
assert.ok(output.minimumFixedClearanceMillimetres>3.5);

const html=fs.readFileSync(path.join(root,'A0_WERKBANK.html'),'utf8');
for(const marker of ['data-bcp-envelope-run','FINITE ENVELOPE PASS','2 mm','148,09°','a0-lantern-crown-finite-envelope-return-2026-10-29.json'])assert.ok(html.includes(marker),`Workbench marker ${marker}`);
const desk=fs.readFileSync(path.join(root,'A0_RESEARCH_DESK.html'),'utf8');
assert.ok(desk.includes('id="lantern-crown-finite-envelope-return-20261029"'));
assert.ok(desk.includes('102751/102751'));
const findings=fs.readFileSync(path.join(root,'../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'),'utf8');
assert.ok(findings.includes('<a id="lantern-crown-finite-envelope-return-20261029"></a>'));
assert.ok(findings.includes('No F-A0 finding'));
console.log(JSON.stringify({status:'PASS',checks:16,scope:'finite-thickness crown adapter envelope, early stop, Desk and Findings bindings'}));
