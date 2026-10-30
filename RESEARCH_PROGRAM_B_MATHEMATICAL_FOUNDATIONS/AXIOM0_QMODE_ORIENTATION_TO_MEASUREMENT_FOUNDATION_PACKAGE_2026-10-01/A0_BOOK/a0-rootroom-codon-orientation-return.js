(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.A0RootroomCodonReturn = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const GOLDEN_ANGLE = 137.5;
  const ROOT_RADII = Object.freeze([Math.sqrt(2), Math.sqrt(5), Math.sqrt(7)]);
  const CODONS = Object.freeze({
    F1: Object.freeze([5, 11, 17]),
    F2: Object.freeze([3, 7, 23]),
    F3: Object.freeze([13, 13, 7]),
    F4: Object.freeze([11, 11, 11])
  });

  function normalizeDegrees(value) {
    return ((Number(value) % 360) + 360) % 360;
  }

  function station(index, codonKey, mode, loops) {
    if (!Number.isInteger(index) || index < 0 || index > 4) throw new RangeError("station index must be 0..4");
    if (!CODONS[codonKey]) throw new RangeError("unknown CODON key");
    if (!["ORIENTABLE_CONTROL", "HALF_TWIST_CANDIDATE"].includes(mode)) throw new RangeError("unknown transport mode");
    if (![1, 2].includes(loops)) throw new RangeError("loops must be 1 or 2");
    const angle = normalizeDegrees(index * GOLDEN_ANGLE);
    const oneLoopSign = mode === "HALF_TWIST_CANDIDATE" ? -1 : 1;
    const sign = loops === 2 ? 1 : oneLoopSign;
    return Object.freeze({
      gate: `theta${index + 1}`,
      angle_deg: angle,
      root_anchor: "GREEN_CUBE",
      root_radius: ROOT_RADII[index % ROOT_RADII.length],
      codon_key: codonKey,
      codon_triplet: CODONS[codonKey].slice(),
      codon_sum: CODONS[codonKey].reduce((a, b) => a + b, 0),
      flap_side: index % 2 === 0 ? "OBVERSE" : "REVERSE",
      pin_axis_deg: normalizeDegrees(angle + 90),
      pocket_state: sign > 0 ? "GOLD_RETURN" : "PINK_INVERTED",
      orientation_sign: sign
    });
  }

  function run(options) {
    const opts = options || {};
    const codonKey = opts.codonKey || "F1";
    const mode = opts.mode || "ORIENTABLE_CONTROL";
    const loops = Number(opts.loops || 1);
    const stations = Array.from({ length: 5 }, (_, index) => station(index, codonKey, mode, loops));
    const expected = mode === "HALF_TWIST_CANDIDATE" && loops === 1 ? -1 : 1;
    const returned = stations.every((item) => item.orientation_sign === expected);
    return Object.freeze({
      schema: "nexah.a0.rootroom-codon-orientation-return/1.0.0",
      identity_reuse: ["ART:A0:MATHEMATICAL_JOINTS", "NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1"],
      carrier: "ROOTROOM_SOURCE_LENS",
      codon_key: codonKey,
      codon_triplet: CODONS[codonKey].slice(),
      codon_sum: CODONS[codonKey].reduce((a, b) => a + b, 0),
      gate_count: 5,
      golden_angle_deg: GOLDEN_ANGLE,
      root_radii: ROOT_RADII.slice(),
      transport_mode: mode,
      loops,
      returned,
      orientation_sign: expected,
      classification: expected === -1 ? "DECLARED_HALF_TWIST_CANDIDATE" : "ORIENTABLE_CONTROL_RETURN",
      stations,
      claim_boundary: "Source-bound view contract only: no biological CODON claim, physical membrane mechanism, torus proof, Möbius proof, new Study, relation or Finding."
    });
  }

  return Object.freeze({ GOLDEN_ANGLE, ROOT_RADII, CODONS, normalizeDegrees, station, run });
});
