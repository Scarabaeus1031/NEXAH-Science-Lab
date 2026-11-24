'use strict';

const assert = require('node:assert/strict');
const model = require('./a0-tessarec-root-space-matrix.js');
const record = model.record();
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks += 1; };

equal(record.identity.module, 'MOD:TESSAREC', 'existing module reused');
equal(record.identity.artifact, 'ART:TESSAREC:ROOT_SPACE_8_16', 'existing artifact reused');
equal(record.carrier.roots, [2, 3, 5, 7], 'declared root axes');
equal(record.carrier.vertexCount, 16, 'Q4 has 16 vertices');
equal(record.carrier.edgeCount, 32, 'Q4 has 32 edges');
equal(record.carrier.degree, 4, 'Q4 is 4-regular');
equal(record.carrier.gramMatrix, [[2,0,0,0],[0,3,0,0],[0,0,5,0],[0,0,0,7]], 'exact Gram matrix');
equal(record.vertices[15].bits, [1, 1, 1, 1], 'terminal address bits');
equal(record.vertices[15].normSquared, 17, 'root diagonal squared length');
equal(model.squaredDistance(0, 15), 17, 'opposite-corner distance');
equal(record.algebraicCrosscheck.degree, 16, 'multiquadratic field degree');
equal(record.algebraicCrosscheck.basis.length, 16, 'field basis count');
equal(new Set(record.algebraicCrosscheck.basis.map(item => item.radicand)).size, 16, 'field basis radicands unique');
equal(record.matrices.adjacency.length, 16, 'adjacency row count');
equal(record.matrices.distanceSquared.length, 16, 'distance row count');

for (let row = 0; row < 16; row += 1) {
  equal(record.matrices.adjacency[row].reduce((sum, value) => sum + value, 0), 4, `degree at vertex ${row}`);
  equal(record.matrices.adjacency[row][row], 0, `no adjacency loop at ${row}`);
  equal(record.matrices.distanceSquared[row][row], 0, `zero self-distance at ${row}`);
  for (let column = 0; column < 16; column += 1) {
    equal(record.matrices.adjacency[row][column], record.matrices.adjacency[column][row], `adjacency symmetry ${row},${column}`);
    equal(record.matrices.distanceSquared[row][column], record.matrices.distanceSquared[column][row], `distance symmetry ${row},${column}`);
  }
}

for (const edge of record.edges) {
  equal(model.hamming(edge.from, edge.to), 1, `edge ${edge.from}-${edge.to} changes one bit`);
  equal(edge.lengthSquared, model.ROOTS[edge.axis], `edge ${edge.from}-${edge.to} retains root metric`);
}

check(record.carrier.rawGeometry !== record.carrier.normalizedGeometry, 'root orthotope and normalized tesseract remain distinct');
check(record.inBetween.interpretation.includes('not a new number type'), 'in-between boundary visible');
check(record.visualSourceBoundary.includes('not imported as a matrix law'), 'visual source boundary visible');
check(record.claimBoundary.includes('No preferred natural geometry'), 'claim ceiling visible');

console.log(`A0 Tessarec Root Space complete matrix: ${checks} assertions passed`);
