'use strict';
const assert=require('node:assert/strict');
const fixture=require('./assets/a0-six-state-stress-residual-fixture-v1.js');
const audit=fixture.runAudit();
assert.equal(fixture.VERSION,'1.0.0');
assert.equal(fixture.STATES.length,6);
assert.equal(audit.assertions.total,56);
assert.equal(audit.assertions.failed,0);
assert.equal(audit.outcome,'PASS_SIX_STATE_RESIDUAL_SEPARATED');
for(const state of fixture.STATES){
  assert.equal(fixture.residual(state),0);
  for(const term of fixture.ROLE_ORDER)assert.notEqual(fixture.residual(fixture.perturb(state,term)),0);
}
process.stdout.write(`${JSON.stringify(audit,null,2)}\n`);
