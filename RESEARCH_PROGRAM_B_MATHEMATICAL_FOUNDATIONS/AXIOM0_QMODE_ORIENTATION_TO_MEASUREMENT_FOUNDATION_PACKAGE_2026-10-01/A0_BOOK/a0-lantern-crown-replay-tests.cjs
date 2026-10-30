'use strict';
const assert=require('node:assert/strict');
const cp=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');

const root=__dirname;
const result=cp.spawnSync(process.execPath,['a0-lantern-crown-replay-runner.cjs'],{cwd:root,encoding:'utf8'});
assert.equal(result.status,0,result.stderr||result.stdout);
const output=JSON.parse(result.stdout);
assert.equal(output.status,'PASS_WITH_MECHANISM_HOLD');
assert.equal(output.geometry,'1220/1220');
assert.equal(output.glb,'1615/1615');
assert.equal(output.total,2835);
assert.ok(output.maxAnimationPositionError<1e-6);

const html=fs.readFileSync(path.join(root,'A0_WERKBANK.html'),'utf8');
for(const marker of ['data-bcp-lantern-run','SOURCE REPLAY','121 Frames','FINITE ENVELOPE PASS','a0-lantern-crown-source-replay-return-2026-10-29.json'])assert.ok(html.includes(marker),`Workbench marker ${marker}`);
const desk=fs.readFileSync(path.join(root,'A0_RESEARCH_DESK.html'),'utf8');
assert.ok(desk.includes('id="lantern-crown-source-replay-return-20261029"'));
assert.ok(desk.includes('2835/2835'));
const findings=fs.readFileSync(path.join(root,'../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'),'utf8');
assert.ok(findings.includes('<a id="lantern-crown-source-replay-return-20261029"></a>'));
assert.ok(findings.includes('No F-A0 finding'));
console.log(JSON.stringify({status:'PASS',checks:13,scope:'Lantern crown source + GLB replay and governance bindings'}));
