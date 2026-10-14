const assert = require("node:assert/strict");
const blue = require("./assets/a0-tessarec-blue-body-v1.js");
const spectral = require("./assets/a0-tessarec-spectral-audit-v1.js");
const grid = require("./assets/a0-tessarec-spectral-grid-breath-v1.js");

const result = spectral.run(blue.buildShell(), { controlCount: 2 });
const mapped = grid.mapSpectrum(result.spectral.eigenvalues);
let assertions = 0;
function check(condition, message) {
  assertions += 1;
  assert.ok(condition, message);
}

check(mapped.length === 48, "all 48 spectral values receive a grid address");
check(new Set(mapped.map((entry) => entry.index)).size === 48, "source indices remain unique");
check(new Set(mapped.map((entry) => entry.lane)).size === 8, "all eight lanes are present");
check(mapped.every((entry) => entry.field >= 0 && entry.field < 6), "all values land in one of six fields");
check(mapped.every((entry) => entry.label === `L${entry.lane + 1}·F${entry.field + 1}`), "coordinate labels are stable");
check(grid.coordinate(-3, 0).label === "L1·F1", "left endpoint clamps to field one");
check(grid.coordinate(3, 7).label === "L8·F6", "right endpoint clamps to field six");

const open = grid.splitGeometry(0, 650, 180);
const still = grid.splitGeometry(1, 650, 180);
check(open.q7.x < open.split.x && open.p8.x > open.split.x, "q7 stays inside and p8 stays outside");
check(still.q7.x < still.split.x && still.p8.x > still.split.x, "split ordering survives STILL");
check(still.halfGap < open.halfGap, "breath converges toward the split at STILL");
check(grid.phaseForState({ id: "STILL", depth: 0 }) === 1, "STILL is the full contact phase");
check(grid.phaseForState({ id: "CON-6", depth: 6 }) === 0, "outer CON state begins at phase zero");
check(grid.phaseForState({ id: "DAO-1", depth: 1 }) === 5 / 6, "DAO depth maps deterministically");

console.log(JSON.stringify({
  status: "PASS",
  assertions,
  values: mapped.length,
  lanes: 8,
  fields: 6,
  open,
  still,
  boundary: grid.claimBoundary
}, null, 2));
