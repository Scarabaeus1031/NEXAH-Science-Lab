"use strict";

const assert = require("node:assert/strict");
const model = require("./assets/a0-tessarec-big-blue-envelope-comparator-r1.js");

const result = model.evaluate();
assert.equal(result.status, "PASS_BOUNDED_INTEGRATION_DEMONSTRATOR");
assert.equal(result.fixture.state_index, 3);
assert.equal(result.gates.I2_PARAMETER_TYPING.phase_to_reference_degrees, 5);
assert.equal(result.gates.I3_APERTURE_LEDGER.per_side_degrees, 3);
assert.equal(result.gates.I3_APERTURE_LEDGER.bilateral_degrees, 6);
assert.equal(result.gates.I3_APERTURE_LEDGER.separation_at_42, 84);
assert.equal(result.gates.I3_APERTURE_LEDGER.separation_at_45, 90);
assert.equal(result.gates.I4_INTRINSIC_INVARIANCE.observer_delta, 0);
assert.notDeepEqual(result.gates.I5_OBSERVED_RESPONSE.at_42, result.gates.I5_OBSERVED_RESPONSE.at_45);
assert.deepEqual(result.gates.I5_OBSERVED_RESPONSE.mirror_pair, [-42, 42]);
assert.equal(result.objects.host.vertices, 48);
assert.equal(result.objects.host.faces, 26);
assert.equal(result.objects.host.pentagons, 16);
assert.equal(result.objects.seam.heptagons, 12);
assert.equal(result.gates.I6_NAMESPACE_GUARD.registered_pentagon_16_17_connector, false);
assert.equal(result.adapters.length, 3);
assert.equal(new Set(Object.values(result.objects).map((item) => item.id)).size, 6);
assert.equal(result.governance.authorized_science_run, false);
assert.equal(result.governance.new_navigator_identity, false);
assert.equal(result.governance.new_navigator_relation, false);

console.log("PASS A0 Tessarec Big Blue Envelope Comparator · 20 assertions · bounded engineering demonstrator");
