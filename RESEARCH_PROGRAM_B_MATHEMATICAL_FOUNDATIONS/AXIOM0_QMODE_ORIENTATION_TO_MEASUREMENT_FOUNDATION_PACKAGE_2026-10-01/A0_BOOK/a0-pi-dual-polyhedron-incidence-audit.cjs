'use strict';

const assert = require('node:assert/strict');
const pi = require('./a0-platinum-iridium-pi-lens.js');

const tolerance = 1e-12;

function canonicalEdge(a, b) {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

function adjacency(vertexCount, edges) {
  const graph = Array.from({ length: vertexCount }, () => new Set());
  for (const [a, b] of edges) {
    graph[a].add(b);
    graph[b].add(a);
  }
  return graph;
}

function triangularFaces(vertexCount, edges) {
  const graph = adjacency(vertexCount, edges);
  const faces = [];
  for (let a = 0; a < vertexCount; a += 1) {
    for (let b = a + 1; b < vertexCount; b += 1) {
      if (!graph[a].has(b)) continue;
      for (let c = b + 1; c < vertexCount; c += 1) {
        if (graph[a].has(c) && graph[b].has(c)) faces.push([a, b, c]);
      }
    }
  }
  return faces;
}

function polyhedronSummary(vertexCount, edges, faces) {
  const graph = adjacency(vertexCount, edges);
  return {
    vertices: vertexCount,
    edges: edges.length,
    faces: faces.length,
    eulerCharacteristic: vertexCount - edges.length + faces.length,
    vertexDegrees: graph.map(neighbours => neighbours.size).sort((a, b) => a - b),
    faceSizes: faces.map(face => face.length).sort((a, b) => a - b)
  };
}

function multisetEqual(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function dualCriteria(a, b) {
  const checks = {
    verticesOfAEqualFacesOfB: a.vertices === b.faces,
    facesOfAEqualVerticesOfB: a.faces === b.vertices,
    edgeCountsEqual: a.edges === b.edges,
    degreesOfAEqualFaceSizesOfB: multisetEqual(a.vertexDegrees, b.faceSizes),
    faceSizesOfAEqualDegreesOfB: multisetEqual(a.faceSizes, b.vertexDegrees)
  };
  return { checks, pass: Object.values(checks).every(Boolean) };
}

function abstractIncidenceDual(sourceVertexCount, sourceEdges, sourceFaces) {
  const dualEdges = [];
  for (let a = 0; a < sourceFaces.length; a += 1) {
    for (let b = a + 1; b < sourceFaces.length; b += 1) {
      const shared = sourceFaces[a].filter(vertex => sourceFaces[b].includes(vertex));
      if (shared.length === 2) dualEdges.push([a, b]);
    }
  }

  const dualFaces = Array.from({ length: sourceVertexCount }, (_, vertex) =>
    sourceFaces.reduce((incident, face, faceIndex) => {
      if (face.includes(vertex)) incident.push(faceIndex);
      return incident;
    }, [])
  );

  return {
    vertexCount: sourceFaces.length,
    edges: dualEdges,
    faces: dualFaces,
    sourceEdgeKeys: new Set(sourceEdges.map(([a, b]) => canonicalEdge(a, b)))
  };
}

function homothetyAudit(inner, outer, declaredScale) {
  let maxResidual = 0;
  for (let i = 0; i < inner.length; i += 1) {
    for (let axis = 0; axis < 3; axis += 1) {
      maxResidual = Math.max(maxResidual, Math.abs(outer[i][axis] - declaredScale * inner[i][axis]));
    }
  }
  return {
    declaredScale,
    identicallyIndexed: inner.length === outer.length,
    maximumCoordinateResidual: maxResidual,
    pass: inner.length === outer.length && maxResidual <= tolerance
  };
}

const inner = pi.INNER.map(point => [...point]);
const declaredScale = 1.8;
const outer = pi.scalePoints(declaredScale);
const innerEdges = pi.SHELL_EDGES.map(edge => [...edge]);
const outerEdges = pi.edgeIndex(outer).map(edge => [...edge]);
const innerFaces = triangularFaces(inner.length, innerEdges);
const outerFaces = triangularFaces(outer.length, outerEdges);

const innerSummary = polyhedronSummary(inner.length, innerEdges, innerFaces);
const outerSummary = polyhedronSummary(outer.length, outerEdges, outerFaces);
const sourcePair = dualCriteria(innerSummary, outerSummary);

const controlGeometry = abstractIncidenceDual(inner.length, innerEdges, innerFaces);
const controlSummary = polyhedronSummary(
  controlGeometry.vertexCount,
  controlGeometry.edges,
  controlGeometry.faces
);
const controlPair = dualCriteria(innerSummary, controlSummary);
const homothety = homothetyAudit(inner, outer, declaredScale);

assert.deepEqual(innerSummary, {
  vertices: 12,
  edges: 30,
  faces: 20,
  eulerCharacteristic: 2,
  vertexDegrees: Array(12).fill(5),
  faceSizes: Array(20).fill(3)
});
assert.deepEqual(outerSummary, innerSummary);
assert.equal(homothety.pass, true);
assert.equal(sourcePair.pass, false);
assert.equal(controlPair.pass, true);
assert.deepEqual(controlSummary, {
  vertices: 20,
  edges: 30,
  faces: 12,
  eulerCharacteristic: 2,
  vertexDegrees: Array(20).fill(3),
  faceSizes: Array(12).fill(5)
});

const result = {
  schema: 'a0.pi-dual-polyhedron-incidence-audit/1.0.0',
  date: '2026-11-17',
  status: 'VALIDATED_NEGATIVE_RESULT_NOT_COMBINATORIAL_DUAL',
  source: {
    html: 'A0_PLATINUM_IRIDIUM_PI_LENS.html',
    module: 'a0-platinum-iridium-pi-lens.js',
    protocol: 'A0_PI_DUAL_POLYHEDRON_INCIDENCE_PROTOCOL_2026-11-17.md'
  },
  sourcePair: {
    inner: innerSummary,
    outer: outerSummary,
    criteria: sourcePair
  },
  homothety,
  incidenceDualControl: {
    summary: controlSummary,
    criteria: controlPair,
    construction: 'one dual vertex per source triangular face; dual adjacency for shared source edges; one dual face per source vertex'
  },
  interpretation: 'The current Platinum and Iridium shells are two homothetic icosahedral graphs. They are not an icosahedron-dodecahedron dual pair.',
  labelDisposition: 'DUAL POLYHEDRON MAY REMAIN A HISTORICAL_OR_VIEW_LABEL_ONLY; NOT A VERIFIED SOURCE-MESH RELATION',
  claimBoundary: 'This result rejects only mutual combinatorial duality of the two current shell meshes. It does not reject the two-shell display, inner/outer role exchange, phase instrument, or other independently audited PI Lens components.',
  authority: {
    identityReuse: ['ART:A0:MATHEMATICAL_JOINTS', 'MOD:ORIENTATION_DEMONSTRATORS'],
    newCanonicalIds: [],
    relationChanges: [],
    sourceGeometryChanged: false,
    studyActivated: false,
    findingPromoted: false,
    publicationAuthorized: false
  }
};

console.log(JSON.stringify(result, null, 2));
