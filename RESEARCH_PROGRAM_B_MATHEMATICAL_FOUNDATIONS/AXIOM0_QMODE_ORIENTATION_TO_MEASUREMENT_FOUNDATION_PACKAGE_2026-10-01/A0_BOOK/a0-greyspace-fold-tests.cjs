'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const fixture=require('./assets/a0-greyspace-fold-fixture-v1.js');

const audit=fixture.runAudit();
assert.equal(fixture.VERSION,'1.0.0');
assert.deepEqual(fixture.GATES.map(item=>item.id),['blue','white','red']);
assert.equal(fixture.gate('missing').id,'white');
assert.equal(fixture.pose(-1),fixture.POSES[4]);
assert.equal(audit.assertions.total,29);
assert.equal(audit.assertions.failed,0);
assert.equal(audit.outcome,'PASS_VISUAL_STATE_LOCK');
assert.equal(audit.claimBoundary,'VISUAL_ORIENTATION_ONLY / NO_PHYSICAL_CLAIM');
const html=fs.readFileSync(path.join(__dirname,'assets/a0-def-g-relation-view-lab/index.html'),'utf8');
['id="greyspace-fold"','id="greyspaceStage"','id="positionOne"','data-grey-gate="blue"','data-grey-gate="white"','data-grey-gate="red"','a0-greyspace-fold-fixture-v1.js','prefers-reduced-motion:reduce','Visual boundary:'].forEach(marker=>assert.ok(html.includes(marker),`missing HTML marker: ${marker}`));
process.stdout.write(`${JSON.stringify(audit,null,2)}\n`);
