#!/usr/bin/env node
const assert = require("node:assert/strict");
const blue = require("./assets/a0-tessarec-blue-body-v1.js");

const result = blue.run({ iterations: 120000, seed: 4802168, freeSeed: 7 });
const v = result.validation;

assert.equal(v.vertices, 48);
assert.equal(v.edges, 72);
assert.equal(v.faces, 26);
assert.equal(v.euler, 2);
assert.deepEqual(v.faceCounts, { O: 2, P: 16, H: 8 });
assert.equal(v.closed, true);
assert.equal(v.cubic, true);
assert.equal(v.carrierStates, 48);
assert.equal(v.carrierEdges, 128);
assert.equal(v.bijective, true);
assert.ok(result.optimizedMetrics.wirelength <= result.baselineMetrics.wirelength);
assert.equal(result.optimizedMetrics.layerRetained, 48);
assert.ok(result.freeMetrics.layerRetained >= 0 && result.freeMetrics.layerRetained <= 48);
assert.ok(result.optimizedMetrics.maxDilation >= 1);
assert.ok(result.optimizedMetrics.maxCongestion >= 1);

console.log(JSON.stringify({
  status: "PASS",
  shell: { V: v.vertices, E: v.edges, F: v.faces, euler: v.euler, faces: v.faceCounts },
  carrier: { states: v.carrierStates, edges: v.carrierEdges },
  baseline: {
    wirelength: result.baselineMetrics.wirelength,
    mean_dilation: result.baselineMetrics.meanDilation,
    max_dilation: result.baselineMetrics.maxDilation,
    max_congestion: result.baselineMetrics.maxCongestion,
    direct_edges: result.baselineMetrics.directEdges
    ,layer_retained: result.baselineMetrics.layerRetained
  },
  candidate: {
    seed: result.optimized.seed,
    iterations: result.optimized.iterations,
    wirelength: result.optimizedMetrics.wirelength,
    mean_dilation: result.optimizedMetrics.meanDilation,
    max_dilation: result.optimizedMetrics.maxDilation,
    max_congestion: result.optimizedMetrics.maxCongestion,
    direct_edges: result.optimizedMetrics.directEdges
    ,layer_retained: result.optimizedMetrics.layerRetained
  },
  free_candidate: {
    seed: result.free.seed,
    iterations: result.free.iterations,
    wirelength: result.freeMetrics.wirelength,
    mean_dilation: result.freeMetrics.meanDilation,
    max_dilation: result.freeMetrics.maxDilation,
    max_congestion: result.freeMetrics.maxCongestion,
    direct_edges: result.freeMetrics.directEdges
    ,layer_retained: result.freeMetrics.layerRetained
  },
  boundary: "DETERMINISTIC_ENGINEERING_SEARCH_NOT_OPTIMALITY_PROOF_NOT_SCIENCE_RUN"
}, null, 2));
