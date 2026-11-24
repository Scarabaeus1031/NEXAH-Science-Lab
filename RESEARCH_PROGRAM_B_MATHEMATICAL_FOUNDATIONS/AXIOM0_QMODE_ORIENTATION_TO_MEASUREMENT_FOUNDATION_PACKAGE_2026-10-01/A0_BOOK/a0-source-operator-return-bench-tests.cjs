#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const model = require("./a0-source-operator-return-bench.js");

let passed = 0;
function check(name, condition) {
  assert.ok(condition, name);
  passed += 1;
  console.log("PASS", name);
}

const fixtures = model.fixtureSuite();
check("23 times 31 returns 713", fixtures.product713.result === 713);
check("713 factors exactly as 23 times 31", JSON.stringify(fixtures.product713.factorization) === JSON.stringify([23, 31]));
check("713 is composite", fixtures.product713.prime_status === false);
check("41 times 20 returns 820", fixtures.product820.result === 820);
check("206 squared minus 204 squared returns 820", fixtures.squares820.result === 820);
check("820 paths share arrival but not derivation", fixtures.arrival820.same_result && !fixtures.arrival820.same_derivation && !fixtures.arrival820.same_source_address);
check("90 plus 50 and ten times seven plus seven return 140", fixtures.arrival140.same_result && fixtures.sum140.result === 140);

for (const item of fixtures.roots) {
  check(`root gap ${item.k} rationalization`, Math.abs(item.residual) < 1e-15);
}
check("root gaps decrease", fixtures.roots.every((item, index, values) => index === 0 || item.gap < values[index - 1].gap));
check("sqrt149 is metrically 12.2065", Math.abs(Math.sqrt(149) - 12.206555615733702) < 1e-14);

const squareCube = model.powerComparator(63.2, 1729);
check("square comparator exact", Math.abs(squareCube.square_over_reference - 63.2 ** 2 / 1729) < 1e-15);
check("cube comparator exact", Math.abs(squareCube.cube_over_reference - 63.2 ** 3 / 1729) < 1e-15);
check("square cube comparator has no implicit unit", squareCube.unit === "DIMENSIONLESS_UNLESS_DECLARED");

const projection3d = model.project(fixtures.product820, "3D");
const projection2d = model.project(fixtures.product820, "2D");
check("3D projection preserves full declared carrier", projection3d.projected_coordinate.length === 3 && projection3d.lost_fields.length === 0);
check("2D projection declares parameter-count loss", projection2d.projected_coordinate.length === 2 && projection2d.lost_fields.includes("parameter_count"));
check("2D and 3D return by the same record id", projection2d.record_id === projection3d.record_id && projection2d.return_verified && projection3d.return_verified);

const point = Object.freeze({ x: Math.sqrt(3), y: Math.sqrt(7) });
check("mirror is an involution", JSON.stringify(model.mirror(model.mirror(point))) === JSON.stringify(point));
check("Hz is blocked without dimensional source", model.unitGuard("Hz", null).status === "UNIT_BLOCKED_MISSING_DIMENSIONAL_SOURCE");
check("declared Hz source passes unit guard", model.unitGuard("Hz", { quantity: "frequency", unit: "Hz" }).allowed);
check("instrument reuses identities without graph mutation", fixtures.product820.identity_reuse.includes("A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1") && fixtures.product820.new_canonical_ids.length === 0 && fixtures.product820.relation_changes.length === 0);

const html = fs.readFileSync("./A0_ROOTROOM_CODON_ORIENTATION_RETURN.html", "utf8");
for (const anchor of ["source-operator-return", "sourceOperatorReturnTitle", "sorProjection", "sorReceipt"]) {
  check(`HTML anchor ${anchor}`, html.includes(`id="${anchor}"`));
}
check("bench assets are linked", html.includes("a0-source-operator-return-bench.css") && html.includes("a0-source-operator-return-bench.js") && html.includes("a0-source-operator-return-bench-ui.js"));
check("bench boundary remains explicit", html.includes("gleiche Ankunft") && html.includes("keine physikalische Rootroom- oder Resonanzbehauptung"));

const binding = JSON.parse(fs.readFileSync("./assets/a0-source-operator-return-bench-v1.json", "utf8"));
check("binding reuses existing identity", binding.identity_reuse.includes("A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1") && binding.new_canonical_ids.length === 0);
check("Codex and Core sources are both pinned", binding.sources.some((source) => source.owner_repository === "NEXAH-CODEX") && binding.sources.some((source) => source.owner_repository === "NEXAH-CORE"));
check("seven owner images are hash pinned", binding.owner_visuals.length === 7 && binding.owner_visuals.every((visual) => /^[a-f0-9]{64}$/.test(visual.sha256)));

console.log(JSON.stringify({ suite: "a0-source-operator-return-bench", passed, status: "PASS", scope: "exact arithmetic, typed derivation, root metric, projection loss and source return" }, null, 2));
