#!/usr/bin/env node
const assert = require("node:assert/strict");
const blue = require("./assets/a0-blue-body-interior-crt16-v1.js");
const api = require("./assets/a0-blue-body-life-transfer-v1.js");

let assertions = 0;
const equal = (actual, expected, message) => { assertions += 1; assert.equal(actual, expected, message); };

const validation = api.validateTransfer();
equal(validation.records, 48, "transfer must cover all 48 source records");
equal(validation.cells, 48, "all pre-dynamics cells must be unique");
equal(validation.bijectiveBeforeDynamics, true, "coordinate transport must be bijective");
equal(validation.singletonPostSignatures, 1, "all singleton inputs must collapse to one post-state signature");
equal(validation.dynamicsOnlyCandidateCount, 48, "empty post-state must retain 48 candidates");

for (let layer = 0; layer < 3; layer += 1) {
  for (let channel = 0; channel < 16; channel += 1) {
    const source = blue.bind(layer, channel);
    const cell = api.sourceToCell(source.sourceKey);
    const returned = api.cellToSource(cell);
    equal(returned.sourceKey, source.sourceKey, `coordinate inverse failed for ${source.sourceKey}`);
    equal(api.lifeStep([cell]).length, 0, `singleton must die for ${source.sourceKey}`);
    equal(api.receipt({ sourceKey: source.sourceKey, stage: 0 }).status, "PASS_PRE_DYNAMICS_COORDINATE_RETURN", `g0 return failed for ${source.sourceKey}`);
    equal(api.receipt({ sourceKey: source.sourceKey, stage: 1, witness: true, returnedSourceKey: source.sourceKey }).status, "PASS_TYPED_TRANSPORT_RETURN", `typed return failed for ${source.sourceKey}`);
    const ablated = api.receipt({ sourceKey: source.sourceKey, stage: 1, witness: false });
    equal(ablated.status, "HOLD_DYNAMICS_ONLY_AMBIGUOUS", `dynamics-only branch must hold for ${source.sourceKey}`);
    equal(ablated.candidateCount, 48, `dynamics-only branch must expose all candidates for ${source.sourceKey}`);
  }
}

equal(api.receipt({ sourceKey: "bad", stage: 1 }).status, "HOLD_INVALID_SOURCE_ADDRESS", "invalid source must fail closed");
equal(api.receipt({ sourceKey: "P0:0000", stage: 1, witness: true, returnedSourceKey: "P0:0001" }).status, "HOLD_SOURCE_KEY_MISMATCH", "wrong sidecar must fail closed");

console.log(JSON.stringify({
  status: "PASS",
  assertions,
  transfer: "Q4 x P3 -> finite-dead 8x6 one-hot view",
  preDynamics: "48 unique cells",
  postDynamics: "1 empty signature / 48 candidates",
  typedReturn: "PASS_TYPED_TRANSPORT_RETURN",
  ablationReturn: "HOLD_DYNAMICS_ONLY_AMBIGUOUS",
  boundary: api.CLAIM_BOUNDARY
}, null, 2));
