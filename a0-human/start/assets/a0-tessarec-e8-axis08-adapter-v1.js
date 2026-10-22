(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TessarecE8Axis08Adapter = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA = "A0_TESSAREC_E8_AXIS08_CROSS_LENS_V1";

  function finiteVector(values, name) {
    if (!Array.isArray(values) || values.length === 0 || !values.every(Number.isFinite)) {
      throw new TypeError(`${name} must be a non-empty finite vector`);
    }
  }

  function laneMeans(eigenvalues, laneCount = 8) {
    finiteVector(eigenvalues, "eigenvalues");
    if (!Number.isInteger(laneCount) || laneCount < 1) throw new TypeError("laneCount must be a positive integer");
    const lanes = Array.from({ length: laneCount }, () => []);
    eigenvalues.forEach((value, index) => lanes[index % laneCount].push(value));
    if (lanes.some((lane) => lane.length === 0)) throw new RangeError("every lane must contain at least one eigenvalue");
    return lanes.map((lane) => lane.reduce((sum, value) => sum + value, 0) / lane.length);
  }

  function normalizeRootVector(vector) {
    finiteVector(vector, "vector");
    const norm = Math.hypot(...vector);
    if (norm === 0) throw new RangeError("zero vector cannot be normalized");
    return vector.map((value) => Math.SQRT2 * value / norm);
  }

  function rootFamily(root) {
    const integer = root.filter((value) => Math.abs(value) === 1).length === 2 && root.filter((value) => value === 0).length === 6;
    return integer ? "D8_INTEGER" : "SPINOR_HALF";
  }

  function run(eigenvalues, axisCore, options = {}) {
    if (!axisCore || typeof axisCore.constructE8Roots !== "function" || typeof axisCore.weightedAxis08 !== "function") {
      throw new TypeError("tested E8/AXIS08 core required");
    }
    const means = laneMeans(eigenvalues, 8);
    const normalized = normalizeRootVector(means);
    const roots = axisCore.constructE8Roots();
    const e8Audit = axisCore.validateE8(roots);
    const nearest = axisCore.nearestWithDeclaredTie(roots, normalized);
    const pairStart = Number.isInteger(options.pairStart) ? options.pairStart : 3;
    if (pairStart < 0 || pairStart > 6) throw new RangeError("pairStart must select one adjacent pair in eight lanes");
    const pair = [pairStart, pairStart + 1];
    const remaining = means.map((_, index) => index).filter((index) => !pair.includes(index));
    const order = remaining.concat(pair);
    const poles = order.map((index) => [means[index]]);
    const quotient = axisCore.weightedAxis08(poles, [1, 1]);
    const left = means[pair[0]], right = means[pair[1]], coupled = quotient.coupled[0], residual = (left - right) / 2;
    const reconstructed = [coupled + residual, coupled - residual];
    const reconstructionError = Math.max(Math.abs(reconstructed[0] - left), Math.abs(reconstructed[1] - right));
    const rootResidual = normalized.map((value, index) => value - nearest.point[index]);
    const rootReturnError = Math.max(...normalized.map((value, index) => Math.abs(value - (nearest.point[index] + rootResidual[index]))));
    return {
      schema: SCHEMA,
      status: "CROSS_LENS_NOT_IDENTITY",
      source: {
        vector: "eight signed means of the sorted-spectrum display lanes",
        packing: "lane = sorted eigenvalue index mod 8",
        laneMeans: means
      },
      decompositionLenses: {
        centered: "3+2+3 selects the central adjacent pair",
        block: "5+3 is a partition view only",
        cardinality: "2^3=8 is a count identity only"
      },
      axis08: {
        pair,
        pairDisplay: pair.map((index) => index + 1),
        quotientCoordinates: quotient.coordinates.map((coordinate) => coordinate[0]),
        coupled,
        residual,
        reconstructionError,
        result: reconstructionError < 1e-12 ? "EXACT_RETURN_WITH_RESIDUAL" : "FAIL"
      },
      e8: {
        referenceAudit: e8Audit,
        normalized,
        nearestRootIndex: nearest.originalIndex,
        nearestRoot: nearest.point.slice(),
        nearestRootFamily: rootFamily(nearest.point),
        distance: nearest.distance,
        tieCount: nearest.tieCount,
        residual: rootResidual,
        returnError: rootReturnError,
        result: "DESCRIPTIVE_NEAREST_ROOT_ONLY"
      },
      priorEvidence: {
        life04: "NO E8 SPECIFICITY",
        life04b: "NO E8 ANTIPODAL SPECIFICITY",
        axis08Qrr: "QUOTIENT_RESIDUAL_RECONSTRUCTION_SUPPORTED"
      },
      claimBoundary: "The adapter compares an eight-number spectral view with the established E8 root reference and applies the tested AXIS08 quotient. It does not derive the shell, its spectrum, 3+2+3, 5+3 or 2^3 from E8."
    };
  }

  return { SCHEMA, laneMeans, normalizeRootVector, rootFamily, run };
});
