const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const api = require("./a0-splinter-orbit-return.js");
const crosswalk = require("./a0-1729-root5-crosswalk.js");

let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks += 1; };
const near = (actual, expected, tolerance, message) => { check(Math.abs(actual - expected) <= tolerance, message); };

const delta = api.deltaRecord();
near(delta.exact, 1 - Math.sqrt(0.96), 1e-15, "delta exact form");
near(delta.exact, delta.radical, 1e-15, "delta radical form");
equal(delta.terms.map((v) => Number(v.toPrecision(8))), [0.02, 0.0002, 0.000004, 1e-7, 2.8e-9], "declared expansion terms");
equal(delta.digitBlock, "0.0202041028", "visible digit block");
check(delta.tail > 0 && delta.tail < 9e-11, "series tail bounded");
equal(delta.implies204Degrees, false, "delta does not imply 204 degrees");
check(Math.abs(delta.exact - 204 / 360) > 0.5, "delta distinct from 204 degree turn fraction");
check(Math.abs(delta.exact - 0.204) > 0.18, "delta distinct from decimal 0.204");

const residual = api.residual204Record();
equal(residual.residuals, [204, 210, 216], "historical residual triple");
equal(residual.first, 204, "first residual");
equal(residual.factorization[0] * residual.factorization[1], 204, "204 factorization");
equal(residual.angleClaim, false, "historical residual is not an angle claim");

const horizon = api.auditHorizonRecord();
equal(horizon.value, 2048, "successor audit horizon retained");
equal(2 ** horizon.exactPower.exponent, 2048, "2048 exact power control");
equal(horizon.successorHits, 311, "successor hit count retained");
equal(horizon.digitCut.role, "DISPLAY_ONLY", "204|8 cut remains a view");
equal(horizon.derivedFrom204, false, "2048 is not derived from residual 204");
equal(horizon.derivedFromDelta, false, "2048 is not derived from delta");

for (const harmonic of [5, 7]) {
  const audit = api.closureAudit(harmonic);
  check(audit.closed, `${harmonic}-fold carrier closes`);
  check(audit.closureError < 1e-12, `${harmonic}-fold closure error bounded`);
  equal(audit.peaks, harmonic, `${harmonic}-fold peak count`);
  near(audit.winding, 1, 1e-15, `${harmonic}-fold winding`);
}

const point = api.polarLift(0.713, { harmonic: 5 });
const mirrored = api.mirror(point);
const returned = api.mirror(mirrored);
near(mirrored.x, point.x, 1e-15, "mirror preserves x projection");
near(mirrored.y, point.y, 1e-15, "mirror preserves y projection");
near(mirrored.z, -point.z, 1e-15, "mirror reverses lift");
near(api.distance(returned, point), 0, 1e-15, "mirror is involutive");

const negatives = api.negativeControls();
equal(negatives.shortCycleRejected, true, "short cycle rejected");
equal(negatives.perturbedEndpointRejected, true, "perturbed endpoint rejected");
check(negatives.short.closureError > 0.1, "short-cycle error visible");
near(negatives.perturbed.closureError, 0.025, 1e-12, "endpoint perturbation measured");

const receipt = api.buildReceipt();
equal(receipt.status, "PASS_DECLARED_RETURN", "receipt passes");
equal(receipt.verificationClass, "BOUNDED_ENGINEERING_VERIFICATION", "verification class bounded");
equal(receipt.views, ["SHADOW", "FIELD", "RETURN"], "three views retained");
equal(receipt.belts, 12, "twelve belts declared");
equal(receipt.authority.researchRun, false, "not a research run");
equal(receipt.authority.scientificEvidence, false, "not scientific evidence");
equal(receipt.authority.newIdentity, false, "no new identity");
equal(receipt.authority.newRelation, false, "no new relation");
equal(receipt.authority.newOperator, false, "no new operator");
equal(receipt.authority.sourceGraphEffect, "NO_SOURCE_GRAPH_EFFECT", "zero graph effect");
check(receipt.doesNotProve.includes("a Ramanujan theorem"), "Ramanujan boundary explicit");
check(receipt.doesNotProve.includes("legacy ODE or IEEE power-grid behavior"), "IEEE boundary explicit");

const crosswalkRecord = crosswalk.buildReceipt();
const mask = crosswalkRecord.layers.geometricMask.closureMask;
equal(mask.pentagonalHarmonic, 5, "existing pentagonal mask reused");
equal(mask.heptagonalFrame, 7, "existing heptagonal frame reused");
equal(mask.radialBelts, 12, "existing radial belts reused");
equal(mask.identityClaim, false, "existing identity boundary retained");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "A0_MATHEMATICAL_JOINTS.html"), "utf8");
const science = fs.readFileSync(path.join(root, "A0_RESEARCH_DESK.html"), "utf8");
const builder = fs.readFileSync(path.join(root, "A0_BUILDER_LOG.html"), "utf8");
const staticReceipt = JSON.parse(fs.readFileSync(path.join(root, "results/a0-splinter-orbit-return-2026-11-15.json"), "utf8"));
const successorReceipt = JSON.parse(fs.readFileSync(path.join(root, "results/a0-prime-successor-dual-address-audit-2026-10-30.json"), "utf8"));
check(html.includes('id="splinter-orbit-return-connector-20261115"'), "Mathfield section integrated");
check(html.includes("a0-splinter-orbit-return.js?rev=20261115-r1"), "Mathfield script bound");
check(html.includes("Schattenfläche → Splinter-Lift → Orbit → geprüfter Return"), "joint statement visible");
check(science.includes('id="splinter-orbit-return-science-return-20261115"'), "Science Desk return integrated");
check(builder.includes('id="splinter-orbit-return-builder-return-20261115"'), "Builder Desk return integrated");
equal(staticReceipt.status, receipt.status, "static receipt status matches executable audit");
equal(staticReceipt.declaredCarrier.harmonics, [5, 7], "static receipt harmonics match");
equal(staticReceipt.authority.sourceGraphEffect, "NO_SOURCE_GRAPH_EFFECT", "static receipt graph disposition matches");
equal(successorReceipt.range.oneBasedPrimeIndices[1], horizon.value, "connector matches existing audit limit");
equal(successorReceipt.range.successorHits, horizon.successorHits, "connector matches existing successor count");
check(html.includes("2048-port"), "Mathfield 2048 port visible");
check(science.includes("204 / 204° / 2048"), "Science Desk type separation visible");

const svg = api.svgMarkup();
check(svg.includes("SHADOW · 5-fold projection"), "shadow view rendered");
check(svg.includes("FIELD · 5 / 7 / 12"), "field view rendered");
check(svg.includes("RETURN · full-cycle audit"), "return view rendered");

console.log(`PASS ${checks}/${checks} · A0 Splinter Orbit Return`);
