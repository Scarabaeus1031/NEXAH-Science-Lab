(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.NexahE8Axis08 = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA = "NEXAH_E8_AXIS08_STATE_R1";
  const EPSILON = 1e-12;

  function constructE8Roots() {
    const roots = [];
    for (let i = 0; i < 8; i += 1) {
      for (let j = i + 1; j < 8; j += 1) {
        for (const si of [-1, 1]) {
          for (const sj of [-1, 1]) {
            const v = Array(8).fill(0);
            v[i] = si;
            v[j] = sj;
            roots.push(v);
          }
        }
      }
    }
    for (let mask = 0; mask < 256; mask += 1) {
      let negatives = 0;
      const v = [];
      for (let i = 0; i < 8; i += 1) {
        const negative = Boolean(mask & (1 << i));
        if (negative) negatives += 1;
        v.push(negative ? -0.5 : 0.5);
      }
      if (negatives % 2 === 0) roots.push(v);
    }
    return roots;
  }

  function squaredNorm(vector) {
    return vector.reduce((sum, value) => sum + value * value, 0);
  }

  function validateE8(roots) {
    const key = vector => vector.map(value => Math.round(value * 2)).join(",");
    const integerRoots = roots.filter(vector =>
      vector.filter(value => Math.abs(value) === 1).length === 2 &&
      vector.filter(value => value === 0).length === 6
    ).length;
    const halfRoots = roots.filter(vector =>
      vector.every(value => Math.abs(value) === 0.5) &&
      vector.filter(value => value < 0).length % 2 === 0
    ).length;
    const normError = Math.max(...roots.map(vector => Math.abs(squaredNorm(vector) - 2)));
    return {
      count: roots.length,
      unique: new Set(roots.map(key)).size,
      integerRoots,
      halfRoots,
      maxNormSquaredError: normError,
      pass: roots.length === 240 && new Set(roots.map(key)).size === 240 &&
        integerRoots === 112 && halfRoots === 128 && normError < EPSILON
    };
  }

  function assertFiniteVector(vector, name) {
    if (!Array.isArray(vector) || vector.length === 0 || !vector.every(Number.isFinite)) {
      throw new TypeError(`${name} must be a non-empty finite numeric vector`);
    }
  }

  function weightedAxis08(poles, weights = [1, 1]) {
    if (!Array.isArray(poles) || poles.length !== 8) throw new TypeError("AXIS08 requires exactly eight poles");
    poles.forEach((pole, index) => assertFiniteVector(pole, `p${index + 1}`));
    const dimension = poles[0].length;
    if (!poles.every(pole => pole.length === dimension)) throw new TypeError("all poles must share one dimension");
    if (!Array.isArray(weights) || weights.length !== 2 || !weights.every(Number.isFinite)) {
      throw new TypeError("weights must be [w7,w8]");
    }
    const denominator = weights[0] + weights[1];
    if (Math.abs(denominator) < EPSILON) throw new RangeError("w7 + w8 must be non-zero");
    const coupled = poles[6].map((value, axis) =>
      (weights[0] * value + weights[1] * poles[7][axis]) / denominator
    );
    const separation = Math.sqrt(poles[6].reduce((sum, value, axis) =>
      sum + (value - poles[7][axis]) ** 2, 0
    ));
    return {
      coordinates: poles.slice(0, 6).map(pole => pole.slice()).concat([coupled]),
      coupled,
      weights: weights.slice(),
      denominator,
      separation,
      invariantPoleCount: 8,
      outputCoordinateCount: 7,
      operator: "weighted affine quotient of p7 and p8"
    };
  }

  function canonicalPointKey(point) {
    const values = Array.isArray(point) ? point : [point.x, point.y, point.ring ?? 0];
    return values.map(value => Number(value).toPrecision(17)).join("|");
  }

  function nearestWithDeclaredTie(points, target, tolerance = EPSILON) {
    if (!Array.isArray(points) || points.length === 0) return null;
    assertFiniteVector(target, "target");
    let minimum = Infinity;
    let tied = [];
    points.forEach((point, index) => {
      const vector = Array.isArray(point) ? point.slice(0, target.length) : [point.x, point.y];
      assertFiniteVector(vector, `point ${index}`);
      const distanceSquared = target.reduce((sum, value, axis) => sum + (value - vector[axis]) ** 2, 0);
      const entry = { point, originalIndex: index, distanceSquared };
      if (distanceSquared < minimum - tolerance) {
        minimum = distanceSquared;
        tied = [entry];
      } else if (Math.abs(distanceSquared - minimum) <= tolerance) {
        tied.push(entry);
      }
    });
    tied.sort((a, b) => canonicalPointKey(a.point).localeCompare(canonicalPointKey(b.point)));
    return {
      point: tied[0].point,
      originalIndex: tied[0].originalIndex,
      distance: Math.sqrt(minimum),
      tieCount: tied.length,
      tieRule: "lexicographically smallest canonical numeric point key"
    };
  }

  function finite(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeState(input = {}) {
    const poles = Array.isArray(input.poles) && input.poles.length === 8
      ? input.poles.map((pole, index) => {
          assertFiniteVector(pole, `state.p${index + 1}`);
          return pole.map(Number);
        })
      : Array.from({ length: 8 }, (_, index) => {
          const angle = -Math.PI / 2 + index * Math.PI / 4;
          return [Math.cos(angle), Math.sin(angle)];
        });
    const state = {
      schema: SCHEMA,
      couplingLog10: Math.max(0, Math.min(4, finite(input.couplingLog10, 2))),
      splitEpsilon: Math.max(-1, Math.min(1, finite(input.splitEpsilon, 0))),
      weights: Array.isArray(input.weights) ? [finite(input.weights[0], 1), finite(input.weights[1], 1)] : [1, 1],
      poles,
      projection: input.projection === "reference-coxeter-2d" ? input.projection : "declared-cartesian-2d",
      physicalIdentityClaimed: false
    };
    if (Math.abs(state.weights[0] + state.weights[1]) < EPSILON) throw new RangeError("state weights have zero sum");
    return state;
  }

  function exportState(state) {
    return JSON.stringify(normalizeState(state), null, 2);
  }

  function importState(text) {
    const parsed = typeof text === "string" ? JSON.parse(text) : text;
    if (!parsed || parsed.schema !== SCHEMA) throw new TypeError(`expected schema ${SCHEMA}`);
    return normalizeState(parsed);
  }

  function stableState(state) {
    return JSON.stringify(normalizeState(state));
  }

  return {
    SCHEMA,
    EPSILON,
    constructE8Roots,
    squaredNorm,
    validateE8,
    weightedAxis08,
    nearestWithDeclaredTie,
    normalizeState,
    exportState,
    importState,
    stableState
  };
});
