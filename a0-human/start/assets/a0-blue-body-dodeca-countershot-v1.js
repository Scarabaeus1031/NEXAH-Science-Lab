(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0BlueBodyDodecaCountershot = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PHI = (1 + Math.sqrt(5)) / 2;
  const H3_S = Math.sqrt(1 - PHI * PHI / 4);
  const H3_ROOTS = [
    [1, 0, 0],
    [-PHI / 2, H3_S, 0],
    [0, -0.5 / H3_S, Math.sqrt(1 - 0.25 / (H3_S * H3_S))]
  ];
  const dot = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0);
  const normalize = (vector) => {
    const length = Math.hypot(...vector) || 1;
    return vector.map((value) => value / length);
  };
  const reflect = (vector, root) => {
    const scale = 2 * dot(vector, root);
    return vector.map((value, index) => value - scale * root[index]);
  };
  const key3 = (vector) => vector.map((value) => Math.abs(value) < 1e-7 ? 0 : +value.toFixed(7)).join(",");

  function inverse3(matrix) {
    const [a, b, c] = matrix;
    const determinant = a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
    return [
      [(b[1] * c[2] - b[2] * c[1]) / determinant, (a[2] * c[1] - a[1] * c[2]) / determinant, (a[1] * b[2] - a[2] * b[1]) / determinant],
      [(b[2] * c[0] - b[0] * c[2]) / determinant, (a[0] * c[2] - a[2] * c[0]) / determinant, (a[2] * b[0] - a[0] * b[2]) / determinant],
      [(b[0] * c[1] - b[1] * c[0]) / determinant, (a[1] * c[0] - a[0] * c[1]) / determinant, (a[0] * b[1] - a[1] * b[0]) / determinant]
    ];
  }

  const H3_WEIGHTS = inverse3(H3_ROOTS);

  function h3Orbit(weightIndex) {
    const seed = H3_WEIGHTS.map((row) => row[weightIndex]);
    const states = [seed];
    const indexByKey = new Map([[key3(seed), 0]]);
    for (let cursor = 0; cursor < states.length; cursor += 1) {
      for (const root of H3_ROOTS) {
        const next = reflect(states[cursor], root);
        const key = key3(next);
        if (!indexByKey.has(key)) {
          indexByKey.set(key, states.length);
          states.push(next);
        }
      }
    }
    return states;
  }

  function minimumEdges(vertices) {
    let minimum = Infinity;
    for (let left = 0; left < vertices.length; left += 1) {
      for (let right = left + 1; right < vertices.length; right += 1) {
        const distance = Math.hypot(...vertices[left].map((value, index) => value - vertices[right][index]));
        if (distance > 1e-6 && distance < minimum) minimum = distance;
      }
    }
    const edges = [];
    for (let left = 0; left < vertices.length; left += 1) {
      for (let right = left + 1; right < vertices.length; right += 1) {
        const distance = Math.hypot(...vertices[left].map((value, index) => value - vertices[right][index]));
        if (Math.abs(distance - minimum) < 1e-5) edges.push([left, right]);
      }
    }
    return edges;
  }

  function buildDodecahedron() {
    const vertices = h3Orbit(0);
    const dual = h3Orbit(2);
    const edges = minimumEdges(vertices);
    const faces = dual.map((normal, faceIndex) => {
      const scores = vertices.map((vertex) => dot(vertex, normal));
      const maximum = Math.max(...scores);
      let indices = scores.map((score, index) => [score, index]).filter(([score]) => Math.abs(score - maximum) < 1e-5).map(([, index]) => index);
      if (indices.length !== 5) indices = scores.map((score, index) => [score, index]).sort((left, right) => right[0] - left[0]).slice(0, 5).map(([, index]) => index);
      const faceSet = new Set(indices);
      const adjacency = new Map(indices.map((index) => [index, []]));
      for (const [left, right] of edges) {
        if (faceSet.has(left) && faceSet.has(right)) {
          adjacency.get(left).push(right);
          adjacency.get(right).push(left);
        }
      }
      const ordered = [indices[0]];
      while (ordered.length < indices.length) {
        const current = ordered.at(-1);
        const previous = ordered.at(-2);
        const next = (adjacency.get(current) || []).find((index) => index !== previous && !ordered.includes(index));
        if (next === undefined) break;
        ordered.push(next);
      }
      return { id: `D-${String(faceIndex + 1).padStart(2, "0")}`, type: "P", normal: normalize(normal), vertices: ordered.length === 5 ? ordered : indices };
    });
    const remaining = new Set(faces.map((_, index) => index));
    const oppositePairs = [];
    while (remaining.size) {
      const left = remaining.values().next().value;
      remaining.delete(left);
      let right = -1;
      let best = Infinity;
      for (const candidate of remaining) {
        const alignment = dot(faces[left].normal, faces[candidate].normal);
        if (alignment < best) { best = alignment; right = candidate; }
      }
      if (right >= 0) {
        remaining.delete(right);
        oppositePairs.push([left, right]);
      }
    }
    return { vertices, edges, faces, oppositePairs };
  }

  function word4774() {
    return {
      tokens: [4, 7, 7, 4],
      palindrome: true,
      directedHalves: [47, 74],
      four: { exact: "2²", grid: [1, 1, 1, 1] },
      seven: { exact: "2² + 3", grid3x3: [1, 1, 1, 1, 1, 1, 1, 0, 0], residual: 2 },
      classification: "EXACT_PALINDROME_PLUS_CONSTRUCTED_ROLE_CODE",
      boundary: "The 3×3 field contains nine cells; selecting seven and retaining two residual cells is a declared display rule, not a derivation of 4774 or an operator identity."
    };
  }

  function validate() {
    const dodecahedron = buildDodecahedron();
    const word = word4774();
    return {
      vertices: dodecahedron.vertices.length,
      edges: dodecahedron.edges.length,
      faces: dodecahedron.faces.length,
      pentagonal: dodecahedron.faces.every((face) => face.vertices.length === 5),
      oppositePairs: dodecahedron.oppositePairs.length,
      euler: dodecahedron.vertices.length - dodecahedron.edges.length + dodecahedron.faces.length,
      palindrome: word.tokens.join("") === word.tokens.slice().reverse().join("")
    };
  }

  return { PHI, H3_ROOTS, buildDodecahedron, word4774, validate };
});
