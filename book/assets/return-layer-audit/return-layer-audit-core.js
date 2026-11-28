(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.A0ReturnLayerAudit = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const TAU = 2 * Math.PI;

  function sample(t) {
    const carrier = Math.sin(t);
    const witness = Math.exp(t);
    const residual = carrier - witness;
    const nextCarrier = Math.sin(t + TAU);
    const nextWitness = Math.exp(t + TAU);
    const nextResidual = nextCarrier - nextWitness;
    return {
      t,
      tau: TAU,
      carrier,
      witness,
      residual,
      nextCarrier,
      nextWitness,
      nextResidual,
      carrierDefect: nextCarrier - carrier,
      witnessDefect: nextWitness - witness,
      residualDefect: nextResidual - residual,
      exactWitnessDefect: witness * (Math.exp(TAU) - 1),
      exactResidualDefect: -witness * (Math.exp(TAU) - 1)
    };
  }

  function antipode(value) {
    return -value;
  }

  return Object.freeze({ TAU, sample, antipode });
});
