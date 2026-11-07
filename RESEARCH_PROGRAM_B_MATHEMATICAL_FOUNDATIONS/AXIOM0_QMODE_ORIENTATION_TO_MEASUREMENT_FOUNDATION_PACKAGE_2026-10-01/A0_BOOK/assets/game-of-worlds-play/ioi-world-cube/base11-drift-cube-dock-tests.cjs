const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const dock=require('./base11-drift-cube-dock.js');

const result=dock.verify();
assert.equal(result.pass,true);
assert.equal(dock.toBase(4774,11),'3650');
assert.equal(dock.fromBase('3650',11),4774);
assert.equal(dock.toBase(7447,11),'5660');
assert.equal(dock.fromBase('5660',11),7447);
assert.equal(dock.fromBase('365',11),dock.fromBase('360',11)+5);
assert.deepEqual(dock.shellAudit(),{outer:12,inner:11,offset:1,outerVolume:1728,innerVolume:1331,shellVolume:397});

const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
assert.match(html,/id="base11DriftCubeDock"/);
assert.match(html,/365 Drift Cube Dock/);
assert.match(html,/kein Stop 13|kein dreizehnter Tour-Stop/i);
assert.match(html,/11 outer · 9 inner · 2×2 zero core/);
assert.match(html,/00 \/ 12/);
assert.doesNotMatch(html,/00 \/ 13/);

const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'MANIFEST.json'),'utf8'));
assert.deepEqual(manifest.new_navigator_identities,[]);
assert.deepEqual(manifest.new_navigator_relations,[]);
assert.match(manifest.contract.base11_365_drift_cube_dock,/4774/);
console.log('base11-drift-cube-dock: 15/15 PASS');
