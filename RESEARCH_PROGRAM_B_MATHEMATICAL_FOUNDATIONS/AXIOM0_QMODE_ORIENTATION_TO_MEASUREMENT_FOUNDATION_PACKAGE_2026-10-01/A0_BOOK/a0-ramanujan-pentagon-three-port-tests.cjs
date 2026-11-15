const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const contractPath = path.join(
  __dirname,
  'assets',
  'ramanujan-pentagon',
  'ramanujan-pentagon-three-port-contract.json'
);
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const model = require('./assets/ramanujan-pentagon/ramanujan-pentagon.js');

const points = new Map(contract.planar_carrier.points.map(point => [point.id, point]));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const near = (actual, expected, tolerance = 1e-12) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

assert.equal(contract.status, 'SOURCE_BOUND_WORKING_FIXTURE_NOT_ACTIVE');
assert.equal(contract.reused_lineage, 'NODE:RAMANUJAN_ESCAPE');
assert.deepEqual(contract.new_navigator_ids, []);
assert.deepEqual(contract.new_graph_relations, []);
assert.equal(contract.relationship_boundary.part_of_scc003, false);
assert.equal(contract.relationship_boundary.ramanujan_theorem_claim, false);
assert.equal(contract.source_lock.generator_recovered, false);
assert.equal(contract.height_profile.status, 'RECONSTRUCTED_FROM_VISUAL');
assert.equal(contract.height_profile.verification, 'UNVERIFIED_AS_HISTORICAL_3D_SOURCE');

assert.equal(points.size, 5);
for (let index = 1; index <= 5; index += 1) {
  const current = points.get(`P${index}`);
  const next = points.get(`P${index === 5 ? 1 : index + 1}`);
  near(distance(current, next), contract.planar_carrier.side_length);
}
near(distance(points.get('P1'), points.get('P3')), contract.planar_carrier.diagonal_length);

const triangulations = contract.triangulations;
assert.equal(Object.keys(triangulations).length, 5);
for (const triangulation of Object.values(triangulations)) {
  assert.equal(triangulation.diagonals.length, 2);
  assert.equal(triangulation.faces.length, 3);
}

assert.ok(triangulations.T4.faces.includes(contract.selected_flip.common_face));
assert.ok(triangulations.T5.faces.includes(contract.selected_flip.common_face));
assert.ok(triangulations.T4.diagonals.includes(contract.selected_flip.common_diagonal));
assert.ok(triangulations.T5.diagonals.includes(contract.selected_flip.common_diagonal));
assert.ok(triangulations.T4.diagonals.includes(contract.selected_flip.state_a_diagonal));
assert.ok(triangulations.T5.diagonals.includes(contract.selected_flip.state_b_diagonal));
assert.equal(contract.selected_flip.operator, 'Phi(T4)=T5; Phi(T5)=T4; Phi^2=id');

assert.deepEqual(
  contract.projection.ports.map(port => port.type),
  ['descent_fiber', 'descent_fiber', 'planar_outlet_return']
);
assert.deepEqual(
  contract.projection.ports.map(port => port.length),
  [0.5, 2, 0]
);
assert.equal(contract.return_record_minimum.length, 5);

assert.deepEqual(model.hullFaces(), contract.closure_control.hull_faces);
assert.deepEqual(model.HULL_EDGES, contract.closure_control.hull_edges);
assert.equal(contract.closure_control.kind, 'triangular_bipyramid_convex_hull');
assert.equal(contract.closure_control.status, 'VERIFIED_FOR_DECLARED_RECONSTRUCTED_COORDINATES');
assert.equal(contract.closure_control.vertices, 5);
assert.equal(contract.closure_control.edges, 9);
assert.equal(contract.closure_control.faces, 6);
assert.equal(
  contract.closure_control.vertices - contract.closure_control.edges + contract.closure_control.faces,
  contract.closure_control.euler_characteristic
);
assert.equal(model.HULL_EDGES.includes('P2P5'), false);
assert.equal(contract.closure_control.internal_axis, 'P2P5');
assert.equal(model.axisPiercesEquator().inside, true);
near(model.axisPiercesEquator().barycentric[0], (Math.sqrt(5) - 1) / 2, 1e-9);

const expectedBoundary = ['P1P2', 'P1P5', 'P2P3', 'P3P4', 'P4P5'];
assert.deepEqual(model.curtainBoundary(triangulations.T4.faces), expectedBoundary);
assert.deepEqual(model.curtainBoundary(triangulations.T5.faces), expectedBoundary);
assert.deepEqual(model.SPLINTER_EDGES, ['P1P3', 'P1P4', 'P2P4', 'P3P5']);
assert.deepEqual(
  contract.projection.view_modes.map(view => view.id),
  ['CIKADA_CURTAIN', 'SCARAB_HULL', 'DRAGONFLY_010']
);
assert.equal(contract.projection.display_annotations.slits.includes('never counted'), true);

const html = fs.readFileSync(path.join(__dirname, 'assets', 'ramanujan-pentagon', 'index.html'), 'utf8');
for (const marker of ['CIKADA · Curtain', 'SCARAB · Hull', 'DRAGONFLY · 010', 'RETURN · Carrier']) {
  assert.ok(html.includes(marker), `missing interface marker: ${marker}`);
}

const mathfield = fs.readFileSync(path.join(__dirname, 'A0_MATHEMATICAL_JOINTS.html'), 'utf8');
for (const marker of ['data-ramanujan-pentagon', 'data-rp-stage', 'CIKADA · Curtain', 'SCARAB · Hull', 'DRAGONFLY · 010', 'RETURN · Carrier']) {
  assert.ok(mathfield.includes(marker), `missing integrated Mathfield marker: ${marker}`);
}
for (const marker of ['RECONSTRUCTED_FROM_VISUAL', 'VERIFIED_FOR_DECLARED_COORDINATES']) {
  assert.ok(mathfield.includes(marker), `missing evidence-state marker: ${marker}`);
}
assert.ok(mathfield.includes('assets/ramanujan-pentagon/ramanujan-pentagon.css'));
assert.ok(mathfield.includes('assets/ramanujan-pentagon/ramanujan-pentagon.js'));
assert.equal(mathfield.includes('src="assets/ramanujan-pentagon/index.html?embed=1"'), false);
assert.equal(mathfield.includes('Comparator groß öffnen'), false);

console.log('PASS integrated ramanujan-pentagon comparator · 5 triangulations · T4/T5 flip · V5/E9/F6 hull · 3 views · exact return');
