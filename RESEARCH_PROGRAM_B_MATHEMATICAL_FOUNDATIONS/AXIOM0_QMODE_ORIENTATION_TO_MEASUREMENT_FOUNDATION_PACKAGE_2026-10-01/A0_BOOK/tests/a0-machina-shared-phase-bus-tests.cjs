const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const bus = require("../a0-machina-shared-phase-bus.js");

assert.equal(bus.normalizeDegrees(360), 0);
assert.equal(bus.normalizeDegrees(-1), 359);
assert.equal(bus.phaseState(0).exactReturn, true);
assert.equal(bus.phaseState(90).pinkCoarseDegrees, 42);
assert.equal(bus.phaseState(90).pinkFineDegrees, -42);
assert.equal(bus.phaseState(247).lcDegrees, bus.phaseState(247).wobbleDegrees);

const receipt = bus.createReceipt(247);
assert.equal(bus.validate(receipt), true);
assert.deepEqual(receipt.graph_delta, { ids: 0, relations: 0, aliases: 0 });
assert.equal(receipt.source_mutation, false);
assert.equal(receipt.addresses_held, true);
assert.deepEqual(receipt.targets, ["L_c", "NLK_L_SHELL_CUBE_VIEW", "COUPLED_PINK_AXIS", "RA_TH_BRIDGE_PROJECTION"]);

const html = fs.readFileSync(path.join(__dirname, "..", "A0_MACHINA_COCKPIT.html"), "utf8");
assert.match(html, /data-machina-shared-phase-bus/);
assert.match(html, /a0-machina-shared-phase-bus\.js/);
assert.match(html, /MINT COUPLING LOCK/);
console.log("PASS a0-machina-shared-phase-bus-tests");
