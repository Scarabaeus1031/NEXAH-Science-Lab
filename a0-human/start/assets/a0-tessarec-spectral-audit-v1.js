(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TessarecSpectralAudit = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const A7_ENSEMBLE_120K = [
    { seed: 0, wirelength: 288, middle: "E2", fiber: ["D1", "E2", "D3"] },
    { seed: 1, wirelength: 285, middle: "F7", fiber: ["D5", "F7", "D1"] },
    { seed: 2, wirelength: 287, middle: "B0", fiber: ["E1", "B0", "B7"] },
    { seed: 3, wirelength: 281, middle: "A2", fiber: ["B3", "A2", "A0"] },
    { seed: 4, wirelength: 289, middle: "F2", fiber: ["D2", "F2", "F7"] },
    { seed: 5, wirelength: 296, middle: "A7", fiber: ["A2", "A7", "F6"] },
    { seed: 6, wirelength: 283, middle: "E5", fiber: ["E6", "E5", "E4"] },
    { seed: 7, wirelength: 280, middle: "A7", fiber: ["A0", "A7", "A5"] },
    { seed: 8, wirelength: 290, middle: "B5", fiber: ["A6", "B5", "C4"] },
    { seed: 9, wirelength: 284, middle: "B7", fiber: ["B6", "B7", "B0"] },
    { seed: 10, wirelength: 297, middle: "C5", fiber: ["C4", "C5", "B7"] },
    { seed: 11, wirelength: 280, middle: "D4", fiber: ["D6", "D4", "D3"] },
    { seed: 12, wirelength: 288, middle: "B0", fiber: ["B7", "B0", "B1"] },
    { seed: 13, wirelength: 286, middle: "B3", fiber: ["C2", "B3", "A4"] },
    { seed: 14, wirelength: 287, middle: "E4", fiber: ["D3", "E4", "D5"] },
    { seed: 15, wirelength: 292, middle: "F5", fiber: ["F4", "F5", "C6"] }
  ];

  function adjacencyMatrix(shell) {
    const index = new Map(shell.vertices.map((vertex, i) => [vertex, i]));
    const matrix = Array.from({ length: shell.vertices.length }, () => Array(shell.vertices.length).fill(0));
    for (const [vertex, neighbors] of shell.adjacency) {
      for (const neighbor of neighbors) matrix[index.get(vertex)][index.get(neighbor)] = 1;
    }
    return matrix;
  }

  function jacobiEigenvalues(input, tolerance = 1e-13, maxRotations) {
    const n = input.length;
    const matrix = input.map((row) => row.slice());
    const limit = maxRotations || 120 * n * n;
    let rotations = 0;
    let maxOffDiagonal = Infinity;
    while (rotations < limit) {
      let p = 0, q = 1;
      maxOffDiagonal = 0;
      for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
          const value = Math.abs(matrix[i][j]);
          if (value > maxOffDiagonal) { maxOffDiagonal = value; p = i; q = j; }
        }
      }
      if (maxOffDiagonal < tolerance) break;
      const app = matrix[p][p], aqq = matrix[q][q], apq = matrix[p][q];
      const angle = 0.5 * Math.atan2(2 * apq, aqq - app);
      const c = Math.cos(angle), s = Math.sin(angle);
      for (let k = 0; k < n; k += 1) {
        if (k === p || k === q) continue;
        const mkp = matrix[k][p], mkq = matrix[k][q];
        matrix[k][p] = matrix[p][k] = c * mkp - s * mkq;
        matrix[k][q] = matrix[q][k] = s * mkp + c * mkq;
      }
      matrix[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
      matrix[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
      matrix[p][q] = matrix[q][p] = 0;
      rotations += 1;
    }
    return {
      values: matrix.map((row, i) => row[i]).sort((a, b) => b - a),
      rotations,
      maxOffDiagonal,
      converged: maxOffDiagonal < tolerance
    };
  }

  function connected(shell) {
    const seen = new Set([shell.vertices[0]]), queue = [shell.vertices[0]];
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      for (const next of shell.adjacency.get(queue[cursor])) {
        if (!seen.has(next)) { seen.add(next); queue.push(next); }
      }
    }
    return seen.size === shell.vertices.length;
  }

  function spectralAudit(shell, tolerance = 1e-9) {
    const degree = shell.adjacency.get(shell.vertices[0]).size;
    const regular = [...shell.adjacency.values()].every((neighbors) => neighbors.size === degree);
    const eigen = jacobiEigenvalues(adjacencyMatrix(shell));
    const values = eigen.values;
    const bound = 2 * Math.sqrt(degree - 1);
    const bipartite = Math.abs(values[values.length - 1] + degree) <= tolerance;
    const nontrivial = values.filter((value, i) => i !== 0 && !(bipartite && i === values.length - 1));
    const maxNontrivial = Math.max(...nontrivial.map(Math.abs));
    const edges = [...shell.adjacency.values()].reduce((sum, neighbors) => sum + neighbors.size, 0) / 2;
    return {
      vertices: shell.vertices.length,
      edges,
      degree,
      regular,
      connected: connected(shell),
      bipartite,
      eigenvalues: values,
      maxNontrivial,
      ramanujanBound: bound,
      margin: bound - maxNontrivial,
      ramanujanNumericalPass: regular && maxNontrivial <= bound + tolerance,
      trace: values.reduce((sum, value) => sum + value, 0),
      sumSquares: values.reduce((sum, value) => sum + value * value, 0),
      expectedSumSquares: 2 * edges,
      solver: eigen
    };
  }

  function spectralDisplaySlices(values, laneCount = 8) {
    if (!Array.isArray(values) || !values.length) throw new Error("Eigenvalue array required");
    if (!Number.isInteger(laneCount) || laneCount < 1) throw new Error("Positive integer lane count required");
    const lanes = Array.from({ length: laneCount }, (_, lane) => ({ lane, members: [] }));
    values.forEach((value, index) => lanes[index % laneCount].members.push({
      index,
      value,
      trivial: index === 0
    }));
    return {
      mode: "INDEX_PACKING_NOT_SPECTRAL_COORDINATE",
      formula: `lane = sorted eigenvalue index mod ${laneCount}`,
      laneCount,
      valueCount: values.length,
      lanes
    };
  }

  function faceCurvature(shell) {
    const perFace = shell.faces.map((face) => ({ id: face.id, sides: face.vertices.length, charge: 6 - face.vertices.length }));
    const incidence = new Map(shell.vertices.map((vertex) => [vertex, []]));
    for (const face of shell.faces) for (const vertex of face.vertices) incidence.get(vertex).push(face.vertices.length);
    const perVertex = [...incidence].map(([vertex, sizes]) => {
      const angleSum = sizes.reduce((sum, sides) => sum + Math.PI * (1 - 2 / sides), 0);
      return { vertex, sizes, defect: 2 * Math.PI - angleSum };
    });
    const chargeTotal = perFace.reduce((sum, face) => sum + face.charge, 0);
    const defectTotal = perVertex.reduce((sum, vertex) => sum + vertex.defect, 0);
    const grouped = perFace.reduce((result, face) => {
      const key = String(face.sides);
      if (!result[key]) result[key] = { sides: face.sides, count: 0, unitCharge: face.charge, totalCharge: 0 };
      result[key].count += 1;
      result[key].totalCharge += face.charge;
      return result;
    }, {});
    return { perFace, perVertex, grouped, chargeTotal, defectTotal, gaussBonnetTarget: 4 * Math.PI };
  }

  function complexRoots(lambda, degree) {
    const discriminant = lambda * lambda - 4 * (degree - 1);
    if (discriminant >= 0) {
      const root = Math.sqrt(discriminant);
      return [{ re: (lambda + root) / 2, im: 0 }, { re: (lambda - root) / 2, im: 0 }];
    }
    const imaginary = Math.sqrt(-discriminant) / 2;
    return [{ re: lambda / 2, im: imaginary }, { re: lambda / 2, im: -imaginary }];
  }

  function iharaAudit(spectral, tolerance = 1e-9) {
    const d = spectral.degree;
    const values = spectral.eigenvalues.slice(1, spectral.bipartite ? -1 : undefined);
    const poles = [];
    for (const lambda of values) {
      for (const root of complexRoots(lambda, d)) {
        const normSquared = root.re * root.re + root.im * root.im;
        poles.push({ lambda, re: root.re / normSquared, im: -root.im / normSquared, modulus: 1 / Math.sqrt(normSquared) });
      }
    }
    const targetRadius = 1 / Math.sqrt(d - 1);
    const maxRadiusError = Math.max(...poles.map((pole) => Math.abs(pole.modulus - targetRadius)));
    return {
      formula: "Z_G(u)^-1=(1-u^2)^(E-V) det(I-uA+(d-1)u^2 I)",
      targetRadius,
      nontrivialPoleCount: poles.length,
      poles,
      maxRadiusError,
      circleNumericalPass: maxRadiusError <= tolerance
    };
  }

  function a7Robustness(records = A7_ENSEMBLE_120K) {
    const counts = {};
    for (const record of records) counts[record.middle] = (counts[record.middle] || 0) + 1;
    const bestWirelength = Math.min(...records.map((record) => record.wirelength));
    const best = records.filter((record) => record.wirelength === bestWirelength);
    const a7 = records.filter((record) => record.middle === "A7");
    return {
      runs: records.length,
      iterationsPerRun: 120000,
      counts,
      a7Count: a7.length,
      a7Rate: a7.length / records.length,
      bestWirelength,
      bestSeeds: best.map((record) => record.seed),
      bestMiddleHosts: best.map((record) => record.middle),
      invariant: new Set(records.map((record) => record.middle)).size === 1,
      conclusion: "A7 is a mapping witness, not an invariant carrier address."
    };
  }

  function replayA7Ensemble(blueBodyApi, options = {}) {
    if (!blueBodyApi || typeof blueBodyApi.optimizeMapping !== "function") throw new Error("Blue Body API required");
    const shell = blueBodyApi.buildShell();
    const carrier = blueBodyApi.buildCarrier();
    const shortest = blueBodyApi.allPairsShortestPaths(shell);
    const seeds = options.seeds || Array.from({ length: 16 }, (_, seed) => seed);
    const iterations = options.iterations || 120000;
    return seeds.map((seed) => {
      const result = blueBodyApi.optimizeMapping({ shell, carrier, shortest, preserveLayers: false, iterations, seed });
      return {
        seed,
        wirelength: result.score,
        middle: result.mapping[blueBodyApi.stateId(1, 15)],
        fiber: [0, 1, 2].map((layer) => result.mapping[blueBodyApi.stateId(layer, 15)])
      };
    });
  }

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function random() {
      value = (value + 0x6D2B79F5) >>> 0;
      let mixed = value;
      mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shellFromEdges(vertices, edges) {
    const adjacency = new Map(vertices.map((vertex) => [vertex, new Set()]));
    for (const [left, right] of edges) { adjacency.get(left).add(right); adjacency.get(right).add(left); }
    return { vertices: vertices.slice(), adjacency, faces: [] };
  }

  function randomizedControl(shell, seed, acceptedSwaps = 720) {
    const random = seededRandom(seed);
    const vertices = shell.vertices.slice();
    const key = (a, b) => a < b ? `${a}|${b}` : `${b}|${a}`;
    const edgeSet = new Set();
    for (const [left, neighbors] of shell.adjacency) for (const right of neighbors) if (left < right) edgeSet.add(key(left, right));
    let accepted = 0, attempts = 0;
    while (accepted < acceptedSwaps && attempts < acceptedSwaps * 80) {
      attempts += 1;
      const edges = [...edgeSet];
      const first = edges[Math.floor(random() * edges.length)].split("|");
      const second = edges[Math.floor(random() * edges.length)].split("|");
      const [a, b] = first, [c, d] = second;
      if (new Set([a, b, c, d]).size < 4) continue;
      const alternate = random() < 0.5;
      const replacements = alternate ? [[a, c], [b, d]] : [[a, d], [b, c]];
      if (replacements.some(([x, y]) => x === y || edgeSet.has(key(x, y)))) continue;
      edgeSet.delete(key(a, b)); edgeSet.delete(key(c, d));
      replacements.forEach(([x, y]) => edgeSet.add(key(x, y)));
      const candidate = shellFromEdges(vertices, [...edgeSet].map((value) => value.split("|")));
      if (!connected(candidate)) {
        replacements.forEach(([x, y]) => edgeSet.delete(key(x, y)));
        edgeSet.add(key(a, b)); edgeSet.add(key(c, d));
        continue;
      }
      accepted += 1;
    }
    return { ...shellFromEdges(vertices, [...edgeSet].map((value) => value.split("|"))), seed, accepted, attempts };
  }

  function controlEnsemble(shell, count = 24) {
    const records = [];
    for (let seed = 0; seed < count; seed += 1) {
      const control = randomizedControl(shell, 62000 + seed);
      const audit = spectralAudit(control);
      records.push({ seed, maxNontrivial: audit.maxNontrivial, pass: audit.ramanujanNumericalPass });
    }
    const ordered = records.map((record) => record.maxNontrivial).sort((a, b) => a - b);
    return {
      count,
      records,
      passCount: records.filter((record) => record.pass).length,
      min: ordered[0],
      median: ordered[Math.floor(ordered.length / 2)],
      max: ordered[ordered.length - 1]
    };
  }

  function run(shell, options = {}) {
    const spectral = spectralAudit(shell);
    return {
      identity: "MOD:TESSAREC",
      status: "ENGINEERING_AUDIT_NOT_SCIENCE_RUN",
      a7: a7Robustness(),
      curvature: faceCurvature(shell),
      spectral,
      ihara: iharaAudit(spectral),
      controls: options.controls === false ? null : controlEnsemble(shell, options.controlCount || 24)
    };
  }

  return { A7_ENSEMBLE_120K, adjacencyMatrix, jacobiEigenvalues, spectralAudit, spectralDisplaySlices, faceCurvature, iharaAudit, a7Robustness, replayA7Ensemble, randomizedControl, controlEnsemble, run };
});
