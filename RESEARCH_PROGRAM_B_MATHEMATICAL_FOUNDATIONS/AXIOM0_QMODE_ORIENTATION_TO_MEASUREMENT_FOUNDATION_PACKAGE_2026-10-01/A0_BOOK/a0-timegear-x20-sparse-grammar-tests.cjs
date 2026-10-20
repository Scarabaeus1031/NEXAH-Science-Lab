#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const mod = (x, n) => ((x % n) + n) % n;
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const node = (i, j) => `${mod(i, 5)}:${j}`;
const edgeKey = (a, b) => [a, b].sort().join('|');
const allNodes = Array.from({ length: 5 }, (_, i) => Array.from({ length: 4 }, (_, j) => node(i, j))).flat();

function makeGraph(id, rawEdges) {
  const edgeMap = new Map();
  for (const [a, b, type] of rawEdges) {
    assert.ok(allNodes.includes(a) && allNodes.includes(b), `${id}: unknown endpoint`);
    assert.notEqual(a, b, `${id}: loop`);
    const key = edgeKey(a, b);
    if (!edgeMap.has(key)) edgeMap.set(key, { nodes: [a, b].sort(), types: new Set() });
    edgeMap.get(key).types.add(type);
  }
  return {
    id,
    vertices: [...allNodes],
    edges: [...edgeMap.values()].map(edge => ({ nodes: edge.nodes, types: [...edge.types].sort() })).sort((a, b) => edgeKey(...a.nodes).localeCompare(edgeKey(...b.nodes)))
  };
}

function adjacency(graph) {
  const out = new Map(graph.vertices.map(v => [v, new Set()]));
  for (const edge of graph.edges) {
    const [a, b] = edge.nodes;
    out.get(a).add(b);
    out.get(b).add(a);
  }
  return out;
}

function components(graph) {
  const adj = adjacency(graph);
  const seen = new Set();
  const parts = [];
  for (const start of graph.vertices) {
    if (seen.has(start)) continue;
    const queue = [start];
    const part = [];
    seen.add(start);
    while (queue.length) {
      const v = queue.shift();
      part.push(v);
      for (const w of adj.get(v)) if (!seen.has(w)) { seen.add(w); queue.push(w); }
    }
    parts.push(part.sort());
  }
  return parts;
}

function degreeProfile(graph) {
  const counts = new Map();
  for (const neighbors of adjacency(graph).values()) counts.set(neighbors.size, (counts.get(neighbors.size) || 0) + 1);
  return Object.fromEntries([...counts].sort((a, b) => a[0] - b[0]));
}

function girth(graph) {
  const adj = adjacency(graph);
  let best = Infinity;
  for (const start of graph.vertices) {
    const distance = new Map([[start, 0]]);
    const parent = new Map([[start, null]]);
    const queue = [start];
    while (queue.length) {
      const v = queue.shift();
      for (const w of adj.get(v)) {
        if (!distance.has(w)) {
          distance.set(w, distance.get(v) + 1);
          parent.set(w, v);
          queue.push(w);
        } else if (parent.get(v) !== w) {
          best = Math.min(best, distance.get(v) + distance.get(w) + 1);
        }
      }
    }
  }
  return Number.isFinite(best) ? best : null;
}

function signature(graph) {
  const componentCount = components(graph).length;
  return {
    vertices: graph.vertices.length,
    edges: graph.edges.length,
    components: componentCount,
    degreeProfile: degreeProfile(graph),
    girth: girth(graph),
    cycleRank: graph.edges.length - graph.vertices.length + componentCount
  };
}

const c20Edges = Array.from({ length: 20 }, (_, g) => {
  const a = node(Math.floor(g / 4), g % 4);
  const h = mod(g + 1, 20);
  const b = node(Math.floor(h / 4), h % 4);
  return [a, b, 'time_step'];
});

const layerCycles = Array.from({ length: 4 }, (_, j) => Array.from({ length: 5 }, (_, i) => [node(i, j), node(i + 1, j), 'phase_ring'])).flat();
const verticalPaths = Array.from({ length: 5 }, (_, i) => Array.from({ length: 3 }, (_, j) => [node(i, j), node(i, j + 1), 'role_step'])).flat();
const rootTail = [
  ...Array.from({ length: 5 }, (_, i) => [node(i, 0), node(i + 1, 0), 'root_ring']),
  ...verticalPaths
];
const seamStitch = Array.from({ length: 5 }, (_, i) => [
  [node(i, 1), node(i, 0), 'gate_left'],
  [node(i, 1), node(i + 1, 0), 'gate_right'],
  [node(i, 1), node(i, 2), 'inner_step'],
  [node(i, 2), node(i, 3), 'return_step']
]).flat();

const graphs = [
  makeGraph('C20_RING', c20Edges),
  makeGraph('FOUR_DISJOINT_C5', layerCycles),
  makeGraph('C5_CARTESIAN_P4', [...layerCycles, ...verticalPaths]),
  makeGraph('C5_ROOT_WITH_LENGTH3_TAIL', rootTail),
  makeGraph('C10_SEAM_STITCH_WITH_LENGTH2_TAIL', seamStitch)
];

const extractPath = path.join(__dirname, 'assets/a0-timegear-x20-owner-visual-extract-v1.json');
const extract = JSON.parse(fs.readFileSync(extractPath, 'utf8'));
const ecosystemRoot = path.resolve(__dirname, '../../../../..');
const targetPath = path.join(
  ecosystemRoot,
  '10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/PASCAL_ROSETTA_JOINT_DESIGN_2026-10-11/NCS_292_Q106_INTERTWINER_RETURN_PACKAGE_2026-10-11/NCS_X20_Q106_ADJACENCY_INTERTWINER_AUDIT_2026-10-11/RESULT.json'
);
const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
const targetEdges = new Set(target.target_interface.undirected_edges.map(edge => edgeKey(...edge)));

const explicitMap = Object.fromEntries(Array.from({ length: 5 }, (_, i) => [
  [node(i, 0), `I_${String(i).padStart(2, '0')}_02_01`],
  [node(i, 1), `S_01_0${i}`],
  [node(i, 2), `S_02_0${i}`],
  [node(i, 3), `S_03_0${i}`]
]).flat());

function mappedEdgeSet(graph, mapping) {
  return new Set(graph.edges.map(edge => edgeKey(...edge.nodes.map(v => mapping[v]))));
}

const checks = [];
function check(id, title, fn) {
  try {
    checks.push({ id, title, status: 'PASS', detail: fn() });
  } catch (error) {
    checks.push({ id, title, status: 'FAIL', detail: error.message });
  }
}

check('T-01', 'The 400/420/600 wheel arithmetic is exact', () => {
  const cycles = extract.declared_exact_inputs.cycle_lengths;
  assert.deepEqual(cycles, [400, 420, 600]);
  assert.equal(cycles.reduce(lcm), 8400);
  assert.deepEqual(cycles.map(value => 8400 / value), [21, 20, 14]);
  assert.equal(cycles.reduce(gcd), 20);
  return { gcd: 20, lcm: 8400, revolutions: [21, 20, 14] };
});

check('T-02', 'Twenty common gates have exact integer tick coordinates', () => {
  const rows = Array.from({ length: 21 }, (_, g) => ({ g, angle: 18 * g, ticks: [20 * g, 21 * g, 30 * g] }));
  assert.deepEqual(rows[0], { g: 0, angle: 0, ticks: [0, 0, 0] });
  assert.deepEqual(rows[20], { g: 20, angle: 360, ticks: [400, 420, 600] });
  for (const row of rows) assert.deepEqual([row.ticks[1] - row.ticks[0], row.ticks[2] - row.ticks[1], row.ticks[2] - row.ticks[0]], [row.g, 9 * row.g, 10 * row.g]);
  return { gateCount: 20, stepDegrees: 18, perGateTickStep: [20, 21, 30], return: rows[20] };
});

check('A-01', 'The contiguous C5 by ordered-P4 address is a bijection', () => {
  const decoded = Array.from({ length: 20 }, (_, g) => ({ g, i: Math.floor(g / 4), j: g % 4 }));
  for (const item of decoded) assert.equal(4 * item.i + item.j, item.g);
  assert.equal(new Set(decoded.map(item => `${item.i}:${item.j}`)).size, 20);
  return { formula: 'g=4i+j', addressCount: 20, origin: decoded[0], antipode: decoded[10] };
});

check('A-02', 'The CRT C5 by C4 address is a distinct bijection', () => {
  const decoded = Array.from({ length: 20 }, (_, g) => ({ g, i: g % 5, j: g % 4 }));
  assert.equal(new Set(decoded.map(item => `${item.i}:${item.j}`)).size, 20);
  assert.notDeepEqual(decoded.map(item => [item.i, item.j]), Array.from({ length: 20 }, (_, g) => [Math.floor(g / 4), g % 4]));
  return { formula: '(i,j)=(g mod 5,g mod 4)', boundary: 'C4 cyclicity is additional structure; P4 remains only ordered in the primary contract' };
});

check('A-03', 'The marked zero gate selects one origin but not a historical D1/p0 identity', () => {
  assert.equal(extract.declared_exact_inputs.marked_origin_gate, 0);
  assert.equal(extract.declared_exact_inputs.marked_antipode_gate, 10);
  return { selectedOrigin: 'g=0 -> (i,j)=(0,0)', antipode: 'g=10 -> (i,j)=(2,2)', D1_p0_map: null };
});

check('G-01', 'All five predeclared graph grammars are finite and typed', () => {
  assert.deepEqual(graphs.map(graph => graph.id), extract.predeclared_graph_grammars);
  assert.ok(graphs.every(graph => graph.vertices.length === 20));
  return Object.fromEntries(graphs.map(graph => [graph.id, signature(graph)]));
});

check('G-02', 'Degree profile alone does not select the Q106-compatible grammar', () => {
  const targetProfile = target.summary.q106_interface_degree_profile;
  const matching = graphs.filter(graph => JSON.stringify(degreeProfile(graph)) === JSON.stringify(targetProfile)).map(graph => graph.id);
  assert.deepEqual(matching, ['C5_ROOT_WITH_LENGTH3_TAIL', 'C10_SEAM_STITCH_WITH_LENGTH2_TAIL']);
  return { targetProfile, matching, discriminator: 'girth: 5 versus 10' };
});

check('G-03', 'Only the seam-stitch grammar has the complete target invariant signature', () => {
  const targetSignature = {
    vertices: 20,
    edges: 20,
    components: 1,
    degreeProfile: target.summary.q106_interface_degree_profile,
    girth: 10,
    cycleRank: 1
  };
  const matching = graphs.filter(graph => JSON.stringify(signature(graph)) === JSON.stringify(targetSignature)).map(graph => graph.id);
  assert.deepEqual(matching, ['C10_SEAM_STITCH_WITH_LENGTH2_TAIL']);
  return { targetSignature, matching };
});

check('G-04', 'The declared seam-stitch map is an exact graph isomorphism to the Q106 interface', () => {
  const graph = graphs.find(item => item.id === 'C10_SEAM_STITCH_WITH_LENGTH2_TAIL');
  assert.equal(new Set(Object.values(explicitMap)).size, 20);
  assert.ok(Object.values(explicitMap).every(value => target.target_interface.node_ids.includes(value)));
  const mapped = mappedEdgeSet(graph, explicitMap);
  assert.equal(mapped.size, targetEdges.size);
  for (const edge of mapped) assert.ok(targetEdges.has(edge), `target missing ${edge}`);
  for (const edge of targetEdges) assert.ok(mapped.has(edge), `candidate missing ${edge}`);
  return { candidate: graph.id, mappedNodes: 20, mappedEdges: 20, result: 'EXACT_UNDIRECTED_GRAPH_ISOMORPHISM' };
});

check('G-05', 'The four controls are rejected by graph invariants', () => {
  const controls = graphs.filter(graph => graph.id !== 'C10_SEAM_STITCH_WITH_LENGTH2_TAIL');
  const targetSignature = signature(graphs.at(-1));
  for (const graph of controls) assert.notDeepEqual(signature(graph), targetSignature);
  return Object.fromEntries(controls.map(graph => [graph.id, signature(graph)]));
});

check('R-01', 'The optional D/E display lift has forty states and one-bit fibres', () => {
  const lifted = allNodes.flatMap(v => [`D:${v}`, `E:${v}`]);
  const fibres = Object.fromEntries(allNodes.map(v => [v, lifted.filter(item => item.endsWith(`:${v}`))]));
  assert.equal(lifted.length, 40);
  assert.ok(Object.values(fibres).every(fibre => fibre.length === 2));
  return { liftedStates: 40, quotientStates: 20, fibreSize: 2, boundary: 'display lift only; not the dodeca D/E quotient and not a selected orientation law' };
});

check('B-01', 'Drift, gamma and point-83 remain outside the exact contract', () => {
  assert.equal(extract.open_hypotheses.euler_mascheroni_link, null);
  assert.equal(extract.open_hypotheses.point_83_stability_band, null);
  assert.equal(extract.open_hypotheses.historical_x20_adjacency_recovered, false);
  return { iotaDriftDegrees: extract.open_hypotheses.iota_drift_degrees, derivedFromWheelArithmetic: false, gammaMap: null, point83Criterion: null };
});

const failures = checks.filter(item => item.status === 'FAIL');
const graphRecords = Object.fromEntries(graphs.map(graph => [graph.id, { signature: signature(graph), edges: graph.edges }]));
const result = {
  schema: 'a0.timegear-x20-sparse-grammar.engineering-result.v1',
  executionDate: '2026-10-15',
  authority: {
    kind: 'OWNER_AUTHORIZED_A0_ENGINEERING_DERIVATION',
    labRun: false,
    studyActivated: false,
    navigatorIdentityCreated: false,
    canonicalX20Changed: false,
    publicationAuthorized: false
  },
  status: failures.length ? 'FAIL' : 'PASS_EXACT_SOURCE_INSPIRED_GRAPH_MATCH_WITH_PROVENANCE_CAVEAT',
  summary: {
    pass: checks.length - failures.length,
    fail: failures.length,
    graphGrammars: graphs.length,
    invariantMatches: 1,
    exactGraphIsomorphisms: 1,
    promotedIntertwiners: 0,
    openHypotheses: 3
  },
  sourceExtract: path.relative(path.dirname(__dirname), extractPath),
  target: {
    path: path.relative(ecosystemRoot, targetPath),
    identity: 'existing frozen Q106 twenty-node interface'
  },
  coordinates: {
    carrier: 'C20 with marked g=0 and antipode g=10',
    primary: 'g=4i+j with i in C5 and j in ordered P4',
    secondaryControl: '(i,j)=(g mod 5,g mod 4) with explicit C4 cyclicity',
    wheelReadout: '(20g mod 400,21g mod 420,30g mod 600)'
  },
  graphRecords,
  explicitCandidateMap: explicitMap,
  checks,
  openGates: [
    {
      id: 'P-01',
      status: 'HOLD',
      question: 'Is the seam-stitch grammar independently intended by the owner visual rather than selected with knowledge of Q106?',
      requiredInput: 'Independent source statement or preregistered use task predating target comparison.'
    },
    {
      id: 'P-02',
      status: 'HOLD',
      question: 'Does g=0 identify D1/p0?',
      requiredInput: 'Typed D/E-to-Timegear address map.'
    },
    {
      id: 'P-03',
      status: 'HOLD',
      question: 'What defines the 0.464 degree drift, gamma relation and .83 band?',
      requiredInput: 'Equations, units, data and falsifiable thresholds.'
    }
  ],
  interpretation: [
    'The Timegear supplies an exact C20 phase/address carrier and marked origin.',
    'The owner-inspired seam-stitch grammar is exactly isomorphic to the frozen Q106 interface as an undirected graph.',
    'The match is an engineering bridge candidate, not independent evidence, because Q106 was already known during formalization.',
    'No historical X20 adjacency, directed operator intertwiner, D/E phase law, physical mechanism, drift law or novelty claim is established.'
  ]
};

if (process.argv.includes('--write')) {
  const out = path.join(__dirname, 'results/a0-timegear-x20-sparse-grammar-result-2026-10-15.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
}

console.log(JSON.stringify(result, null, 2));
process.exitCode = failures.length ? 1 : 0;
