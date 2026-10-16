#!/usr/bin/env node
const assert = require("node:assert/strict");
const api = require("./assets/a0-blue-body-interior-crt16-v1.js");

let assertions = 0;
const check = (condition, message) => { assertions += 1; assert.ok(condition, message); };
const equal = (actual, expected, message) => { assertions += 1; assert.equal(actual, expected, message); };

const validation = api.validateAdapter();
equal(validation.records, 48, "adapter must expose 48 records");
equal(validation.sourceKeys, 48, "all source keys must be unique");
equal(validation.displayKeys, 48, "all display keys must be unique");
equal(validation.collisionFree, true, "16 x 3 adapter must be collision-free");
equal(validation.roundTrips, true, "all addresses must round-trip");
equal(validation.moduliAreLabelsOnly, true, "prime moduli must remain labels only");

const q4Values = new Set();
for (let channel = 0; channel < 16; channel += 1) {
  const q4 = api.ringGray(channel);
  q4Values.add(q4);
  equal(api.inverseRingGray(q4), channel, `Gray-ring inverse failed for channel ${channel}`);
}
equal(q4Values.size, 16, "Gray-ring channel map must be bijective");

for (let layer = 0; layer < 3; layer += 1) {
  for (let channel = 0; channel < 16; channel += 1) {
    const bound = api.bind(layer, channel);
    const returned = api.unbind(bound.sourceKey);
    equal(returned.sourceKey, bound.sourceKey, `source-key return failed for ${bound.sourceKey}`);
    equal(returned.channel, channel, `channel return failed for ${bound.sourceKey}`);
    equal(returned.layer, layer, `layer return failed for ${bound.sourceKey}`);
    equal(returned.modulusLabel, api.MODULI[channel], `modulus label drifted for channel ${channel}`);
  }
}

const base = api.frame(2, 7, 0, 1);
const changedView = api.frame(2, 7, 5, 0.2);
const basePoint = base.projections.front.find((entry) => entry.sourceKey === base.source.sourceKey);
const changedPoint = changedView.projections.front.find((entry) => entry.sourceKey === changedView.source.sourceKey);
check(
  base.source.sourceKey === changedView.source.sourceKey
    && (basePoint.x !== changedPoint.x || basePoint.y !== changedPoint.y),
  "phase must animate display geometry without mutating the source address"
);
for (const view of api.VIEWS) {
  equal(base.projections[view].length, 48, `${view} must project all 48 addresses`);
  equal(base.projections[view].filter((entry) => entry.selected).length, 1, `${view} must select exactly one address`);
  equal(base.projections[view].find((entry) => entry.selected).sourceKey, base.source.sourceKey, `${view} must retain source key`);
}

const pass = api.receipt({ sourceKey: base.source.sourceKey, viewKeys: api.VIEWS.map(() => base.source.sourceKey), witness: true });
equal(pass.status, "PASS_EXACT_ADDRESS_RETURN", "complete witness must pass");
equal(pass.residual, 0, "exact address return must have zero residual");
const missing = api.receipt({ sourceKey: base.source.sourceKey, viewKeys: api.VIEWS.map(() => base.source.sourceKey), witness: false });
equal(missing.status, "HOLD_MISSING_WITNESS", "withheld witness must fail closed");
const divergent = api.receipt({ sourceKey: base.source.sourceKey, viewKeys: [base.source.sourceKey, base.source.sourceKey, "P0:0000", base.source.sourceKey], witness: true });
equal(divergent.status, "HOLD_VIEW_DIVERGENCE", "view-key divergence must fail closed");
equal(api.receipt({ sourceKey: "bad", viewKeys: [], witness: true }).status, "HOLD_INVALID_ADDRESS", "invalid address must fail closed");

for (const view of api.VIEWS) {
  const p = api.project({ x: 1, y: 2, z: 0 }, view);
  check(Number.isFinite(p.x) && Number.isFinite(p.y), `${view} projection must remain finite`);
}

console.log(JSON.stringify({
  status: "PASS",
  assertions,
  adapter: "I16 x P3 -> Q4 x P3",
  addresses: validation.records,
  views: api.VIEWS,
  return: { pass: pass.status, withheld: missing.status, divergence: divergent.status },
  boundary: api.CLAIM_BOUNDARY
}, null, 2));
