'use strict';
const assert=require('node:assert/strict');
const fixture=require('./assets/a0-def-g-relation-view-fixture-v1.js');

const audit=fixture.runAudit();
assert.equal(fixture.VERSION,'1.0.0');
assert.equal(audit.carrier,'Q3 = {0,1}^3');
assert.equal(audit.assertions.total,108);
assert.equal(audit.assertions.failed,0);
assert.equal(audit.outcome,'PASS_RELATION_VIEW_SEPARATED');
assert.equal(audit.claimBoundary,'FINITE_ENGINEERING_FIXTURE_ONLY / SCIENTIFIC_NOT_ADMITTED');
process.stdout.write(`${JSON.stringify(audit,null,2)}\n`);
