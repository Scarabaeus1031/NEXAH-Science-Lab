const assert = require("node:assert/strict");
const { state } = require("./assets/a0-field-notes/ullinium-closing-comparator.js");

const open = state("open");
assert.deepEqual([open.vertices, open.realEdges, open.phantomEdges, open.faces], [6, 5, 0, 0]);

const witness = state("witness");
assert.deepEqual([witness.vertices, witness.realEdges, witness.phantomEdges, witness.faces], [6, 5, 1, 0]);
assert.match(witness.returnReceipt, /remove phantom/);

const composite = state("composite");
assert.equal(composite.sourceVertices - composite.sharedVertexOccurrences, composite.vertices);
assert.equal(composite.sourceEdges - composite.sharedEdgeOccurrences, composite.realEdges);
assert.deepEqual([composite.vertices, composite.realEdges, composite.faces], [10, 11, 2]);
assert.match(composite.returnReceipt, /layer \+ seam tags/);

console.log("A0 Ullinium closing comparator: 12 invariant checks PASS");
