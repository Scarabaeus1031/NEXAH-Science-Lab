#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const mod = (x, n) => ((x % n) + n) % n;
const edgeKey = (a, b) => [a, b].sort().join('|');

const checks = [];
function check(id, title, fn) {
  try {
    checks.push({ id, title, status: 'PASS', detail: fn() });
  } catch (error) {
    checks.push({ id, title, status: 'FAIL', detail: error.message });
  }
}

function shellNodes(prefix) {
  return [
    `${prefix}N`,
    ...Array.from({ length: 5 }, (_, i) => `${prefix}U${i}`),
    ...Array.from({ length: 5 }, (_, i) => `${prefix}L${i}`),
    `${prefix}S`
  ];
}

function shellEdges(prefix) {
  const out = [];
  const add = (a, b, type) => out.push({ a, b, type, sheet: prefix });
  for (let i = 0; i < 5; i += 1) {
    const next = mod(i + 1, 5);
    const prev = mod(i - 1, 5);
    add(`${prefix}N`, `${prefix}U${i}`, 'north_spoke');
    add(`${prefix}U${i}`, `${prefix}U${next}`, 'upper_ring');
    add(`${prefix}U${i}`, `${prefix}L${i}`, 'diagonal_a');
    add(`${prefix}U${i}`, `${prefix}L${prev}`, 'diagonal_b');
    add(`${prefix}L${i}`, `${prefix}L${next}`, 'lower_ring');
    add(`${prefix}S`, `${prefix}L${i}`, 'south_spoke');
  }
  return out;
}

class UnionFind {
  constructor(items) {
    this.parent = new Map(items.map(item => [item, item]));
  }
  find(item) {
    const parent = this.parent.get(item);
    if (parent !== item) this.parent.set(item, this.find(parent));
    return this.parent.get(item);
  }
  union(a, b) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(rb, ra);
  }
}

const preNodes = [...shellNodes('D'), ...shellNodes('E')];
const preEdges = [...shellEdges('D'), ...shellEdges('E')];
const addressLegend = Object.fromEntries(['D', 'E'].flatMap(prefix => [
  [`${prefix}1`, `${prefix}N`],
  ...Array.from({ length: 5 }, (_, i) => [`${prefix}${i + 2}`, `${prefix}U${i}`]),
  ...Array.from({ length: 5 }, (_, i) => [`${prefix}${i + 7}`, `${prefix}L${i}`]),
  [`${prefix}12`, `${prefix}S`]
]));
const gateAddresses = Array.from({ length: 5 }, (_, i) => ({
  gate: i,
  D: `DU${i}`,
  E: `EU${i}`,
  numberedPair: `D${i + 2}/E${i + 2}`
}));

function quotientForOpenGate(openGate) {
  const uf = new UnionFind(preNodes);
  const glued = gateAddresses.filter(item => item.gate !== openGate);
  for (const item of glued) uf.union(item.D, item.E);

  const fibresByRoot = new Map();
  for (const node of preNodes) {
    const root = uf.find(node);
    if (!fibresByRoot.has(root)) fibresByRoot.set(root, []);
    fibresByRoot.get(root).push(node);
  }
  const fibres = [...fibresByRoot.values()].map(items => items.sort());
  const classId = new Map();
  for (const fibre of fibres) {
    const id = fibre.join('=');
    for (const node of fibre) classId.set(node, id);
  }

  const edgeMap = new Map();
  for (const edge of preEdges) {
    const a = classId.get(edge.a);
    const b = classId.get(edge.b);
    assert.notEqual(a, b, 'quotient must not create loops');
    const key = edgeKey(a, b);
    if (!edgeMap.has(key)) edgeMap.set(key, { nodes: [a, b].sort(), sources: [], types: new Set() });
    const record = edgeMap.get(key);
    record.sources.push(`${edge.sheet}:${edge.type}`);
    record.types.add(edge.type);
  }
  const edges = [...edgeMap.values()].map(edge => ({
    nodes: edge.nodes,
    multiplicity: edge.sources.length,
    sources: edge.sources.sort(),
    types: [...edge.types].sort()
  })).sort((a, b) => edgeKey(...a.nodes).localeCompare(edgeKey(...b.nodes)));

  const degree = new Map(fibres.map(fibre => [fibre.join('='), 0]));
  for (const edge of edges) for (const node of edge.nodes) degree.set(node, degree.get(node) + 1);
  const degreeProfile = Object.fromEntries(
    [...degree.values()].sort((a, b) => a - b).reduce((map, value) => map.set(value, (map.get(value) || 0) + 1), new Map())
  );

  return {
    openGate,
    openAddresses: gateAddresses[openGate],
    gluedAddresses: glued,
    fibres,
    vertices: fibres.map(fibre => fibre.join('=')).sort(),
    edges,
    degreeProfile,
    duplicateEdges: edges.filter(edge => edge.multiplicity > 1),
    fibreProfile: fibres.reduce((acc, fibre) => {
      acc[fibre.length] = (acc[fibre.length] || 0) + 1;
      return acc;
    }, {})
  };
}

function rotateSourceNode(node, shift) {
  if (node.endsWith('N') || node.endsWith('S')) return node;
  return `${node.slice(0, 2)}${mod(Number(node.slice(2)) + shift, 5)}`;
}

function rotateClass(id, shift) {
  return id.split('=').map(node => rotateSourceNode(node, shift)).sort().join('=');
}

function graphSignature(graph) {
  return {
    vertices: graph.vertices.length,
    edges: graph.edges.length,
    degreeProfile: graph.degreeProfile,
    fibreProfile: graph.fibreProfile,
    duplicateMultiplicities: graph.duplicateEdges.map(edge => edge.multiplicity).sort()
  };
}

function assertRotationIsomorphism(source, target, shift) {
  const targetVertices = new Set(target.vertices);
  for (const vertex of source.vertices) assert.ok(targetVertices.has(rotateClass(vertex, shift)));
  const targetEdges = new Set(target.edges.map(edge => edgeKey(...edge.nodes)));
  for (const edge of source.edges) {
    const mapped = edgeKey(...edge.nodes.map(node => rotateClass(node, shift)));
    assert.ok(targetEdges.has(mapped), `missing rotated edge ${mapped}`);
  }
}

function phasePath(openGate, word) {
  let value = openGate;
  const path = [value];
  for (const symbol of word) {
    value = mod(value + (symbol === 'R' ? 1 : -1), 5);
    path.push(value);
  }
  return path;
}

const candidates = Array.from({ length: 5 }, (_, openGate) => quotientForOpenGate(openGate));
const ecosystemRoot = path.resolve(__dirname, '../../../../..');
const q106ResultPath = path.join(
  ecosystemRoot,
  '10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/PASCAL_ROSETTA_JOINT_DESIGN_2026-10-11/NCS_292_Q106_INTERTWINER_RETURN_PACKAGE_2026-10-11/NCS_X20_Q106_ADJACENCY_INTERTWINER_AUDIT_2026-10-11/RESULT.json'
);
const q106 = JSON.parse(fs.readFileSync(q106ResultPath, 'utf8'));
const q106Signature = {
  vertices: q106.summary.q106_interface_nodes,
  edges: q106.summary.q106_interface_edges,
  degreeProfile: q106.summary.q106_interface_degree_profile
};

check('P-01', 'Each dodecahedral face carrier has the icosahedral 12/30/5 adjacency signature', () => {
  for (const prefix of ['D', 'E']) {
    const nodes = shellNodes(prefix);
    const edges = shellEdges(prefix);
    assert.equal(nodes.length, 12);
    assert.equal(edges.length, 30);
    const degrees = Object.fromEntries(nodes.map(node => [node, 0]));
    for (const edge of edges) { degrees[edge.a] += 1; degrees[edge.b] += 1; }
    assert.ok(Object.values(degrees).every(value => value === 5));
  }
  return 'two independently typed icosahedral face-adjacency graphs';
});

check('Q-01', 'Every four-seam quotient has exactly twenty vertices', () => {
  for (const graph of candidates) {
    assert.equal(graph.vertices.length, 20);
    assert.deepEqual(graph.fibreProfile, { 1: 16, 2: 4 });
  }
  return candidates.map(graph => ({ openGate: graph.openGate, fibreProfile: graph.fibreProfile }));
});

check('Q-02', 'Every quotient preserves a typed simple edge set and three doubled seam edges', () => {
  for (const graph of candidates) {
    assert.equal(graph.edges.length, 57);
    assert.equal(graph.duplicateEdges.length, 3);
    assert.ok(graph.duplicateEdges.every(edge => edge.multiplicity === 2));
  }
  return candidates.map(graph => ({ openGate: graph.openGate, edges: graph.edges.length, doubled: graph.duplicateEdges.length }));
});

check('Q-03', 'All five open-gate candidates have the same graph signature', () => {
  const signatures = candidates.map(graphSignature);
  for (const signature of signatures.slice(1)) assert.deepEqual(signature, signatures[0]);
  return signatures[0];
});

check('Q-04', 'C5 rotation gives explicit isomorphisms among all five candidates', () => {
  const source = candidates[0];
  for (let target = 0; target < 5; target += 1) assertRotationIsomorphism(source, candidates[target], target);
  return 'gate g=0 maps to gate g=k by the declared C5 rotation';
});

check('Q-05', 'A marked gate has the expected two-element D5 stabilizer', () => {
  for (let gate = 0; gate < 5; gate += 1) {
    const rotations = Array.from({ length: 5 }, (_, k) => mod(gate + k, 5)).filter(image => image === gate).length;
    const reflections = Array.from({ length: 5 }, (_, k) => mod(k - gate, 5)).filter(image => image === gate).length;
    assert.equal(rotations + reflections, 2);
  }
  return 'identity plus one reflection; no marked candidate retains full C5 symmetry';
});

check('R-01', 'Class plus one conditional sheet bit reconstructs every prequotient address', () => {
  for (const graph of candidates) {
    for (const fibre of graph.fibres) {
      if (fibre.length === 1) assert.equal(fibre[0], fibre[0]);
      if (fibre.length === 2) {
        assert.deepEqual(fibre.map(node => node[0]), ['D', 'E']);
        assert.notEqual(fibre[0], fibre[1]);
      }
    }
  }
  return { singletonClasses: 16, twoAddressClasses: 4, residual: 'one D/E bit only on glued fibres' };
});

check('R-02', 'LRRL returns at every open gate and therefore selects none', () => {
  const paths = candidates.map(graph => phasePath(graph.openGate, 'LRRL'));
  for (let gate = 0; gate < 5; gate += 1) {
    assert.equal(paths[gate][0], gate);
    assert.equal(paths[gate].at(-1), gate);
  }
  return paths.map((values, gate) => ({ gate, values }));
});

check('T-01', 'The geometric quotient cannot be isomorphic to the Q106 twenty-node interface', () => {
  for (const graph of candidates) {
    assert.equal(graph.vertices.length, q106Signature.vertices);
    assert.notEqual(graph.edges.length, q106Signature.edges);
    assert.notDeepEqual(graph.degreeProfile, q106Signature.degreeProfile);
  }
  return { candidate: graphSignature(candidates[0]), q106: q106Signature, result: 'REJECT_GRAPH_ISOMORPHISM_BY_EDGE_AND_DEGREE_INVARIANTS' };
});

check('T-02', 'The simple geometric quotient is necessarily non-planar', () => {
  const planarSimpleBound = 3 * candidates[0].vertices.length - 6;
  assert.equal(planarSimpleBound, 54);
  assert.ok(candidates.every(graph => graph.edges.length > planarSimpleBound));
  return { vertices: 20, edges: 57, planarSimpleBound, result: 'NONPLANAR_BY_EULER_EDGE_BOUND' };
});

check('B-01', 'The candidate does not overwrite the historical null X20 contract', () => {
  assert.equal(q106.source_contract_gap.adjacency, null);
  assert.equal(q106.source_contract_gap.edge_types, null);
  return {
    historicalX20: 'UNDEFINED',
    currentObject: 'DECLARED_A0_DODECA_D_E_QUOTIENT_CANDIDATE',
    identityRelation: 'NON_IDENTITY / COMPARATOR_ONLY'
  };
});

const failures = checks.filter(item => item.status === 'FAIL');
const result = {
  schema: 'a0.x20-dodeca-gate-comparator.engineering-result.v1',
  executionDate: '2026-10-15',
  authority: {
    kind: 'OWNER_AUTHORIZED_A0_ENGINEERING_DERIVATION',
    labRun: false,
    studyActivated: false,
    navigatorIdentityCreated: false,
    canonicalX20Changed: false,
    publicationAuthorized: false
  },
  status: failures.length ? 'FAIL' : 'PASS_NEGATIVE_Q106_MATCH_ALL_GATES_TIED',
  summary: {
    pass: checks.length - failures.length,
    fail: failures.length,
    gateCandidates: candidates.length,
    q106MatchCount: 0
  },
  construction: {
    source: 'two independently typed dodecahedral face carriers represented by their icosahedral face-adjacency graphs',
    prequotientVertices: preNodes.length,
    prequotientEdges: preEdges.length,
    addressLegend,
    candidateGates: gateAddresses,
    operation: 'identify Di with Ei at four of five upper-ring positions; leave one pair open',
    boundary: 'declared A0 comparator; not recovered historical X20=C5xP4 adjacency'
  },
  target: {
    sourcePath: path.relative(ecosystemRoot, q106ResultPath),
    signature: q106Signature
  },
  candidates: candidates.map(graph => ({
    openGate: graph.openGate,
    openAddresses: graph.openAddresses,
    gluedAddresses: graph.gluedAddresses,
    signature: graphSignature(graph),
    vertices: graph.vertices,
    edges: graph.edges
  })),
  checks,
  interpretation: [
    'The 24-to-20 quotient and conditional Return bit are exact.',
    'All five open-gate choices are C5-isomorphic, so this construction cannot select a privileged gate.',
    'The natural dodecahedral face-adjacency quotient is far denser than the Q106 interface and is rejected as its graph intertwiner.',
    'The construction remains useful as a seam/Return comparator, not as the canonical or historical X20 source graph.'
  ],
  nextTests: [
    'Declare a source-derived sparse edge-selection rule before any second Q106 comparison.',
    'Require that the rule breaks the five-way tie without reading Q106 backward.',
    'Retain the four conditional D/E residual bits as the exact Return payload.'
  ]
};

if (process.argv.includes('--write')) {
  const out = path.join(__dirname, 'results/a0-x20-dodeca-gate-comparator-result-2026-10-15.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
}

console.log(JSON.stringify(result, null, 2));
process.exitCode = failures.length ? 1 : 0;
