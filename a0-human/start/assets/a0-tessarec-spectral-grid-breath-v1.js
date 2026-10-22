(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TessarecSpectralGridBreath = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const LANE_COUNT = 8;
  const FIELD_MIN = -3;
  const FIELD_MAX = 3;
  const FIELD_COUNT = FIELD_MAX - FIELD_MIN;

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function fieldForValue(value) {
    if (!Number.isFinite(value)) throw new TypeError("finite spectral value required");
    return clamp(Math.floor(value - FIELD_MIN), 0, FIELD_COUNT - 1);
  }

  function coordinate(value, lane) {
    if (!Number.isInteger(lane) || lane < 0 || lane >= LANE_COUNT) {
      throw new RangeError("lane must be an integer from 0 through 7");
    }
    const field = fieldForValue(value);
    return {
      lane,
      field,
      label: `L${lane + 1}·F${field + 1}`,
      interval: [
        FIELD_MIN + field,
        FIELD_MIN + field + 1
      ]
    };
  }

  function mapSpectrum(values) {
    if (!Array.isArray(values) || values.length === 0 || !values.every(Number.isFinite)) {
      throw new TypeError("finite eigenvalue array required");
    }
    return values.map((value, index) => ({
      index,
      value,
      ...coordinate(value, index % LANE_COUNT)
    }));
  }

  function phaseForState(state) {
    if (!state || !Number.isFinite(state.depth)) throw new TypeError("CON–DAO state required");
    return state.id === "STILL" ? 1 : clamp((6 - state.depth) / 6, 0, 1);
  }

  function splitGeometry(phase, splitX, laneY) {
    if (![phase, splitX, laneY].every(Number.isFinite)) throw new TypeError("finite geometry inputs required");
    const p = clamp(phase, 0, 1);
    const halfGap = 30 - 14 * p;
    return {
      phase: p,
      q7: { x: splitX - halfGap, y: laneY, side: "INSIDE" },
      split: { x: splitX, y: laneY, role: "CUT_SPLIT_MARKER" },
      p8: { x: splitX + halfGap, y: laneY, side: "OUTSIDE" },
      halfGap,
      interpretation: "q7 is the fused quotient coordinate; p8 is displayed outside as a physical-pole/residual witness"
    };
  }

  return {
    LANE_COUNT,
    FIELD_MIN,
    FIELD_MAX,
    FIELD_COUNT,
    fieldForValue,
    coordinate,
    mapSpectrum,
    phaseForState,
    splitGeometry,
    claimBoundary: "The grid assigns display coordinates to an index-packed spectrum. CON–DAO modulates the display only. The +3 marker, q7 and p8 are a declared cut/quotient lens, not an E8, spectral or physical identity."
  };
});
