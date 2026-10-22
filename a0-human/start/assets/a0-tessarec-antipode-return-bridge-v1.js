(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TessarecAntipodeReturnBridge = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA = "A0_TESSAREC_ANTIPODE_RETURN_BRIDGE_V1";
  const EPS = 1e-12;

  const key = (vector) => vector.map((value) => Number(value === 0 ? 0 : value).toFixed(6)).join(",");
  const negate = (vector) => vector.map((value) => -value);
  const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]));

  function finiteEight(vector) {
    if (!Array.isArray(vector) || vector.length !== 8 || !vector.every(Number.isFinite)) {
      throw new TypeError("an eight-component finite vector is required");
    }
  }

  function buildAxes(roots) {
    if (!Array.isArray(roots) || roots.length !== 240) throw new RangeError("the declared 240-root E8 reference is required");
    roots.forEach(finiteEight);
    const lookup = new Map(roots.map((root, index) => [key(root), index]));
    const visited = new Set();
    const axes = [];
    roots.forEach((point, index) => {
      if (visited.has(index)) return;
      const oppositeIndex = lookup.get(key(negate(point)));
      if (oppositeIndex === undefined || oppositeIndex === index) throw new Error(`unpaired reference root at ${index}`);
      visited.add(index);
      visited.add(oppositeIndex);
      const opposite = roots[oppositeIndex];
      const representative = key(point) <= key(opposite) ? point.slice() : opposite.slice();
      const positiveIndex = key(point) === key(representative) ? index : oppositeIndex;
      axes.push(Object.freeze({
        id: axes.length,
        representative: Object.freeze(representative),
        positiveIndex,
        negativeIndex: positiveIndex === index ? oppositeIndex : index
      }));
    });
    if (axes.length !== 120 || visited.size !== 240) throw new Error("240 roots did not form 120 exact antipodal axes");
    return Object.freeze(axes);
  }

  function decompose(vector, roots) {
    finiteEight(vector);
    const axes = buildAxes(roots);
    let best = null;
    axes.forEach((axis) => {
      const projection = vector.reduce((sum, value, index) => sum + value * axis.representative[index], 0);
      const sign = projection < 0 ? -1 : 1;
      const orientedRoot = axis.representative.map((value) => sign * value);
      const residualVector = vector.map((value, index) => value - orientedRoot[index]);
      const residual = Math.hypot(...residualVector);
      if (!best || residual < best.residual - EPS || (Math.abs(residual - best.residual) <= EPS && axis.id < best.axisId)) {
        best = {
          axisId: axis.id,
          sign,
          projection,
          orientedRoot,
          residualVector,
          residual,
          rootIndex: sign > 0 ? axis.positiveIndex : axis.negativeIndex
        };
      }
    });
    const reconstruction = best.orientedRoot.map((value, index) => value + best.residualVector[index]);
    return {
      schema: SCHEMA,
      status: "EXACT_RETURN_WITH_RESIDUAL",
      sourceDimension: 8,
      rootCount: roots.length,
      axisCount: axes.length,
      ...best,
      reconstruction,
      reconstructionError: distance(vector, reconstruction),
      specificity: "NO_E8_ANTIPODAL_SPECIFICITY_RETAINED",
      claimBoundary: "Pair address, sign and residual reconstruct the supplied vector exactly; this is record-format support, not E8 specificity."
    };
  }

  function reorient(record, sign) {
    if (!record || !Array.isArray(record.reconstruction) || !Array.isArray(record.orientedRoot)) throw new TypeError("a decomposition record is required");
    if (sign !== -1 && sign !== 1) throw new RangeError("orientation sign must be -1 or +1");
    const currentSign = record.sign;
    const representative = record.orientedRoot.map((value) => value / currentSign);
    const orientedRoot = representative.map((value) => sign * value);
    const residualVector = record.reconstruction.map((value, index) => value - orientedRoot[index]);
    const reconstruction = orientedRoot.map((value, index) => value + residualVector[index]);
    return {
      ...record,
      sign,
      orientedRoot,
      residualVector,
      residual: Math.hypot(...residualVector),
      reconstruction,
      reconstructionError: distance(record.reconstruction, reconstruction),
      displayReorientation: true
    };
  }

  return Object.freeze({ SCHEMA, buildAxes, decompose, distance, reorient });
});
