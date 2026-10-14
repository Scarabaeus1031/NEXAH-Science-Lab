(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TessarecHeptagonBridge = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const TARGET_DEGREES = [
    ...Array(32).fill(5),
    ...Array(2).fill(6),
    ...Array(12).fill(7),
    ...Array(4).fill(8)
  ];

  const edgeKey = (a, b) => a < b ? `${a}|${b}` : `${b}|${a}`;
  const seededRandom = (seed) => {
    let value = seed >>> 0;
    return function random() {
      value = (value + 0x6D2B79F5) >>> 0;
      let mixed = value;
      mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  };

  function exactLedger() {
    const single = { vertices: 48, edges: 72, faces: 26, faceVector: { octagons: 2, pentagons: 16, hexagons: 8 }, wirelength: 280 };
    const disjoint = { vertices: 96, edges: 144, faces: 52, euler: 4, faceVector: { octagons: 4, pentagons: 32, hexagons: 16, heptagons: 0 }, wirelength: 560 };
    const connected = { vertices: 96, edges: 144, faces: 50, euler: 2, faceVector: { octagons: 4, pentagons: 32, hexagons: 2, heptagons: 12 } };
    return {
      single,
      disjoint,
      connected,
      seam: { removedHexagons: 14, removedSides: 84, insertedHeptagons: 12, insertedSides: 84 },
      curvature: {
        disconnectedCharge: 2 * (single.faceVector.pentagons - 2 * single.faceVector.octagons),
        connectedCharge: connected.faceVector.pentagons - connected.faceVector.heptagons - 2 * connected.faceVector.octagons
      },
      carrierOptions: {
        disjoint: { states: 96, edges: 256, wirelength: 560 },
        path6: { states: 96, edges: 272 },
        cycle6: { states: 96, edges: 288 }
      }
    };
  }

  function gcd(a, b) {
    let x = Math.abs(a), y = Math.abs(b);
    while (y) [x, y] = [y, x % y];
    return x;
  }

  function additiveOrder(step, modulus) {
    if (!Number.isInteger(step) || !Number.isInteger(modulus) || modulus <= 0) return null;
    return modulus / gcd(step, modulus);
  }

  function seamWordComparator() {
    const word = [4, 7, 7, 4];
    const sigma34 = { modulus: 34, divisor: 2, step: 17 };
    const sigma40 = { modulus: 40, divisor: 3, quotient: 40 / 3 };
    const root40 = { coordinates: [2, 2, 4, 4], squares: [4, 4, 16, 16] };
    root40.normSquared = root40.squares.reduce((sum, value) => sum + value, 0);
    root40.imaginarySquares = root40.squares.slice(1);
    root40.imaginaryTotal = root40.imaginarySquares.reduce((sum, value) => sum + value, 0);
    root40.imaginaryMean = root40.imaginaryTotal / 3;
    root40.imaginaryEqual = root40.imaginarySquares.every((value) => value === root40.imaginarySquares[0]);
    return {
      typedWord: {
        tokens: word,
        label: word.join("|"),
        decimalConcatenation: Number(word.join("")),
        palindrome: word.join("") === word.slice().reverse().join(""),
        digitSum: word.reduce((sum, value) => sum + value, 0),
        factorization: [2, 7, 11, 31],
        interpretation: "TOKEN_WORD_NOT_PRODUCT"
      },
      primeAddress: { four: "2^2", seven: "p4", seventeen: "p7", thirtyFour: "p1*p7" },
      sigma34: {
        ...sigma34,
        quotientIsInteger: Number.isInteger(sigma34.step),
        additiveOrder: additiveOrder(sigma34.step, sigma34.modulus),
        plusEqualsMinus: (sigma34.step + sigma34.step) % sigma34.modulus === 0,
        verdict: "PASS_EXACT_HALF_TURN"
      },
      sigma40: {
        ...sigma40,
        quotientIsInteger: Number.isInteger(sigma40.quotient),
        gcdDivisorModulus: gcd(sigma40.divisor, sigma40.modulus),
        nonzeroOrderThreeExists: sigma40.modulus % 3 === 0,
        verdict: "HOLD_SCALAR_ONLY_NOT_DISCRETE_THIRDS"
      },
      root40,
      claimBoundary: "4|7|7|4 is a typed palindrome. 34/2 closes as an order-2 translation in Z34. 40/3 is a scalar quotient, not an equal discrete three-cycle in Z40."
    };
  }

  function m7GridSwitch() {
    return {
      order: ["duerer34", "seam4774", "ratio432", "return440"],
      views: {
        duerer34: {
          id: "duerer34",
          label: "Dürer Σ34",
          status: "EXACT_GRID",
          values: [16, 2, 3, 13, 5, 11, 10, 8, 9, 7, 6, 12, 4, 14, 15, 1],
          readout: "1..16 · every row, column and main diagonal sums to 34"
        },
        seam4774: {
          id: "seam4774",
          label: "Seam 4|7|7|4",
          status: "TYPED_VIEW",
          values: [4, 7, 7, 4, 7, 4, 4, 7, 7, 4, 4, 7, 4, 7, 7, 4],
          readout: "mirrored typed seam word · not a magic-square claim"
        },
        ratio432: {
          id: "ratio432",
          label: "Ratio 4:3:2",
          status: "SCHEMATIC_VIEW",
          values: [4, 3, 2, 4, 3, 2, 4, 3, 2, 4, 3, 2, 4, 3, 2, 4],
          readout: "counter-rotation cadence view · no dynamics law"
        },
        return440: {
          id: "return440",
          label: "Return 4:4:0",
          status: "SCHEMATIC_VIEW",
          values: [4, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 4, 0, 4, 4, 0],
          readout: "return / hold routing mask · no conservation claim"
        }
      },
      claimBoundary: "M7 names this interface operator only. M7 is not H7: H7 remains the exact count of twelve heptagon seam faces. Only the Dürer Σ34 view is an exact magic-square grid; the other views are typed or schematic."
    };
  }

  function buildBipyramid(ringSize = 48) {
    const top = ringSize;
    const bottom = ringSize + 1;
    const faces = [];
    for (let i = 0; i < ringSize; i += 1) {
      const next = (i + 1) % ringSize;
      faces.push([top, i, next], [bottom, next, i]);
    }
    return { vertexCount: ringSize + 2, faces };
  }

  function topology(state) {
    const edgeFaces = new Map();
    const degrees = Array(state.vertexCount).fill(0);
    for (let faceIndex = 0; faceIndex < state.faces.length; faceIndex += 1) {
      const face = state.faces[faceIndex];
      for (let i = 0; i < 3; i += 1) {
        const a = face[i], b = face[(i + 1) % 3], key = edgeKey(a, b);
        if (!edgeFaces.has(key)) edgeFaces.set(key, []);
        edgeFaces.get(key).push(faceIndex);
      }
    }
    for (const key of edgeFaces.keys()) {
      const [a, b] = key.split("|").map(Number);
      degrees[a] += 1;
      degrees[b] += 1;
    }
    return { edgeFaces, degrees };
  }

  function scoreDegrees(degrees) {
    const sorted = degrees.slice().sort((a, b) => a - b);
    return sorted.reduce((sum, degree, index) => sum + (degree - TARGET_DEGREES[index]) ** 2, 0);
  }

  function degreeHistogram(degrees) {
    return degrees.reduce((histogram, degree) => {
      histogram[degree] = (histogram[degree] || 0) + 1;
      return histogram;
    }, {});
  }

  function tryFlip(state, topo, key) {
    const owners = topo.edgeFaces.get(key);
    if (!owners || owners.length !== 2) return null;
    const [u, v] = key.split("|").map(Number);
    const first = state.faces[owners[0]], second = state.faces[owners[1]];
    const a = first.find((vertex) => vertex !== u && vertex !== v);
    const b = second.find((vertex) => vertex !== u && vertex !== v);
    if (a === undefined || b === undefined || a === b || topo.edgeFaces.has(edgeKey(a, b))) return null;
    if (topo.degrees[u] <= 3 || topo.degrees[v] <= 3) return null;
    const nextFaces = state.faces.slice();
    nextFaces[owners[0]] = [a, b, u];
    nextFaces[owners[1]] = [b, a, v];
    return { vertexCount: state.vertexCount, faces: nextFaces };
  }

  function validateTriangulation(state) {
    const topo = topology(state);
    const distinctFaces = new Set(state.faces.map((face) => face.slice().sort((a, b) => a - b).join("|"))).size === state.faces.length;
    const manifold = [...topo.edgeFaces.values()].every((owners) => owners.length === 2);
    const edges = topo.edgeFaces.size;
    const euler = state.vertexCount - edges + state.faces.length;
    return {
      vertices: state.vertexCount,
      edges,
      faces: state.faces.length,
      euler,
      manifold,
      distinctFaces,
      minDegree: Math.min(...topo.degrees),
      maxDegree: Math.max(...topo.degrees),
      degreeHistogram: degreeHistogram(topo.degrees),
      targetMatch: scoreDegrees(topo.degrees) === 0
    };
  }

  function search(options = {}) {
    const seed = options.seed === undefined ? 7080 : options.seed;
    const iterations = options.iterations || 400000;
    const random = seededRandom(seed);
    let state = buildBipyramid(48);
    let topo = topology(state);
    let currentScore = scoreDegrees(topo.degrees);
    let best = state;
    let bestScore = currentScore;
    let accepted = 0;
    for (let step = 0; step < iterations && bestScore > 0; step += 1) {
      const keys = [...topo.edgeFaces.keys()];
      const candidate = tryFlip(state, topo, keys[Math.floor(random() * keys.length)]);
      if (!candidate) continue;
      const candidateTopo = topology(candidate);
      const candidateScore = scoreDegrees(candidateTopo.degrees);
      const progress = step / iterations;
      const temperature = Math.max(0.035, 7.5 * (1 - progress) ** 2);
      if (candidateScore <= currentScore || random() < Math.exp((currentScore - candidateScore) / temperature)) {
        state = candidate;
        topo = candidateTopo;
        currentScore = candidateScore;
        accepted += 1;
        if (candidateScore < bestScore) {
          best = candidate;
          bestScore = candidateScore;
        }
      }
    }
    const validation = validateTriangulation(best);
    return { seed, iterations, accepted, score: bestScore, found: bestScore === 0 && validation.targetMatch, state: best, validation };
  }

  return { TARGET_DEGREES, exactLedger, seamWordComparator, m7GridSwitch, buildBipyramid, topology, scoreDegrees, degreeHistogram, tryFlip, validateTriangulation, search };
});
