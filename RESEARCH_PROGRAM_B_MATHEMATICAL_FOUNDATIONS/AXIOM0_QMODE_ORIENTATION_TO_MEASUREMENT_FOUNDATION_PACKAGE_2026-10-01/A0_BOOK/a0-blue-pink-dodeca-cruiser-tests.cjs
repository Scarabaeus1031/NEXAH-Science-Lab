const assert = require("node:assert/strict");
const Cruiser = require("./assets/a0-blue-pink-dodeca-cruiser-v1.js");

const validation = Cruiser.validate();
assert.equal(validation.status, "PASS_EXACT_COUPLED_RETURN");
assert.equal(validation.exactHull, true);
assert.equal(validation.exactInterior, true);
assert.equal(validation.counterRotation, true);
assert.equal(validation.exactTwelveByFourBinding, true);
assert.equal(validation.returnFacePreserved, true);
assert.equal(validation.exactSevenBandSpectrum, true);
assert.equal(validation.noIdentityMerge, true);

for (let step = 0; step <= 60; step += 1) {
  const state = Cruiser.assemblyState({ progress: step / 60, aperture: 0.5 });
  assert.equal(state.hull.vertices.length, 20);
  assert.equal(state.hull.edges.length, 30);
  assert.equal(state.hull.faces.length, 12);
  assert.match(state.body.frame.source.sourceKey, /^P[0-2]:[01]{4}$/);
  assert.ok(state.returnCell.cell_id);
  assert.equal(state.returnCell.cell_id, `RETURN-00:F${String(state.hull.faceIndex + 1).padStart(2, "0")}`);
  assert.ok(state.rotations.hull >= 0);
  assert.ok(state.rotations.aperture <= 0);
}

const routeStates = [];
for (let faceIndex = 0; faceIndex < 12; faceIndex += 1) {
  for (let addressSlot = 0; addressSlot < 4; addressSlot += 1) {
    const state = Cruiser.assemblyState({ faceIndex, addressSlot, aperture: 1, thrust: 1 });
    routeStates.push(state);
    assert.equal(state.route.addressIndex, faceIndex * 4 + addressSlot);
    assert.equal(state.spectrum.bands.length, 7);
    assert.equal(state.spectrum.activeIndex, state.route.addressIndex % 7);
    assert.equal(state.spectrum.activeBand.wavelengthNm, Cruiser.SPECTRUM[state.route.addressIndex % 7].wavelengthNm);
    assert.equal(state.returnCell.cell_id, `RETURN-00:F${String(faceIndex + 1).padStart(2, "0")}`);
  }
}
assert.equal(new Set(routeStates.map((state) => state.body.frame.source.sourceKey)).size, 48);

const closed = Cruiser.assemblyReceipt({ mode: "BRIDGE", progress: 0, aperture: 0, thrust: 1 });
assert.equal(closed.status, "HOLD_APERTURE_CLOSED");
assert.equal(closed.handoff.cutOpen, false);
assert.equal(closed.handoff.spectrumTransmission, 0);

const receipt = Cruiser.assemblyReceipt({ mode: "RETURN", progress: 1, aperture: 1, thrust: 1 });
assert.equal(receipt.status, "PASS_EXACT_COUPLED_RETURN");
assert.equal(receipt.counts.hullFaces, 12);
assert.equal(receipt.counts.blueAddresses, 48);
assert.equal(receipt.counts.returnCells, 60);
assert.deepEqual(receipt.newCanonicalIds, []);
assert.deepEqual(receipt.relationChanges, []);
assert.equal(receipt.addressReturn.status, "PASS_EXACT_ADDRESS_RETURN");
assert.equal(receipt.returnCell, "RETURN-00:F12");
assert.equal(receipt.handoff.route, "DODEKA_HULL_FACE_TO_BLUE_ADDRESS_TO_PINK_APERTURE_CUT_TO_SPECTRUM_TO_RETURN_CELL");
assert.equal(receipt.handoff.cutOpen, true);
assert.equal(receipt.handoff.spectrumLens, "NEWTON");
assert.equal(receipt.handoff.spectrumBand.id, "BLUE");
assert.ok(receipt.handoff.spectrumTransmission > 0);
assert.ok(receipt.sourceIdentities.includes("A0-VIEW-NEWTON-GOETHE-OBSERVER-LENS"));
assert.ok(receipt.sourceIdentities.includes("A0-VIEW-RAINBOW-PURPLE-RAIN"));

console.log("PASS a0-blue-pink-dodeca-cruiser-tests");
