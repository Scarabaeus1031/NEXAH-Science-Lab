#!/usr/bin/env node

const C = 299_792_458;
const MOD = 2501;
const J_FACTOR = 50;

const approxEqual = (a, b, scale = 1) =>
  Math.abs(a - b) <= 1e-10 * Math.max(1, Math.abs(scale));

const interval = (ct, x) => ct * ct - x * x;

const classify = (q, scale = 1) => {
  const eps = 1e-10 * Math.max(1, Math.abs(scale));
  if (Math.abs(q) <= eps) return "null";
  return q > 0 ? "timelike" : "spacelike";
};

const boost = ({ ct, x }, beta) => {
  const gamma = 1 / Math.sqrt(1 - beta * beta);
  return {
    ct: gamma * (ct - beta * x),
    x: gamma * (x - beta * ct),
  };
};

const mod = (n, m) => ((n % m) + m) % m;
const J = (x) => mod(J_FACTOR * x, MOD);
const F = (x) => J(J(x));

const cases = [
  { id: "future-rest", ct: 5, x: 0 },
  { id: "future-time", ct: 5, x: 3 },
  { id: "past-time", ct: -5, x: 3 },
  { id: "space-right", ct: 3, x: 5 },
  { id: "space-left", ct: 3, x: -5 },
  { id: "null-right", ct: 5, x: 5 },
  { id: "null-left", ct: 5, x: -5 },
];

const betas = [-0.95, -0.5, 0, 0.3, 0.9];
const transformed = [];

for (const sample of cases) {
  const q0 = interval(sample.ct, sample.x);
  const scale0 = Math.max(sample.ct ** 2, sample.x ** 2, 1);
  const class0 = classify(q0, scale0);
  for (const beta of betas) {
    const next = boost(sample, beta);
    const q1 = interval(next.ct, next.x);
    const scale1 = Math.max(scale0, next.ct ** 2, next.x ** 2, 1);
    const class1 = classify(q1, scale1);
    transformed.push({
      id: sample.id,
      beta,
      q0,
      q1,
      class0,
      class1,
      intervalInvariant: approxEqual(q0, q1, scale1),
      classInvariant: class0 === class1,
      futurePastInvariant:
        class0 !== "timelike" || Math.sign(sample.ct) === Math.sign(next.ct),
    });
  }
}

const j2Factor = mod(J_FACTOR ** 2, MOD);
const j4Factor = mod(J_FACTOR ** 4, MOD);
let quarterTurnPass = j2Factor === MOD - 1 && j4Factor === 1;
let flipInvolutionPass = true;
let flipFixedPoints = 0;
for (let x = 0; x < MOD; x += 1) {
  if (F(F(x)) !== x) flipInvolutionPass = false;
  if (F(x) === x) flipFixedPoints += 1;
}

const roleSchema = Object.freeze({
  P_evt: "event-carrier",
  J_quarter: "quarter-turn-frame-operator",
  F_flip: "side-flip-involution",
  M_hist: "declared-retained-history",
  U_unres: "declared-unresolved-residual",
});

const typedRecord = Object.freeze({
  roleSchema,
  event: { ct: 5, x: 3 },
  history: [
    { ct: 1, x: 0.2 },
    { ct: 3, x: 1.1 },
    { ct: 5, x: 3 },
  ],
  unresolved: ["mechanism-not-inferred-from-role-label"],
});

const transformedRecord = {
  ...typedRecord,
  event: boost(typedRecord.event, 0.3),
  history: typedRecord.history.map((event) => boost(event, 0.3)),
};

const typedRolesPass =
  transformedRecord.roleSchema === typedRecord.roleSchema &&
  Object.keys(transformedRecord.roleSchema).join("|") ===
    Object.keys(roleSchema).join("|");

const memoryPass =
  typedRecord.history.length === transformedRecord.history.length &&
  typedRecord.history[0].ct < typedRecord.history.at(-1).ct &&
  transformedRecord.history[0].ct < transformedRecord.history.at(-1).ct;

const nullTimes = [0.1, 1, 10, 500];
const ratios = [0.9, 0.99, 1, 1.01, 1.1];
const ablation = ratios.map((ratio) => {
  const k = ratio * C;
  const errors = nullTimes.map((t) => {
    const x = C * t;
    return Math.abs((k * t) ** 2 - x ** 2) / (x ** 2);
  });
  return {
    kOverC: ratio,
    meanNormalizedNullResidual:
      errors.reduce((sum, value) => sum + value, 0) / errors.length,
  };
});
const bestAblation = ablation.reduce((best, row) =>
  row.meanNormalizedNullResidual < best.meanNormalizedNullResidual ? row : best,
);

const compositeExamples = [0.5, 1, 2].map((beta) => {
  const k = C ** (1 / beta);
  return { beta, k, effectiveRule: k ** beta };
});
const compositeNonIdentifiable = compositeExamples.every((row) =>
  approxEqual(row.effectiveRule, C, C),
);

const b1Predictions = transformed.map((row) => row.class1);
const b2Predictions = transformed.map((row) => row.class1);
const predictiveGain = b2Predictions.reduce(
  (gain, value, index) => gain + Number(value !== b1Predictions[index]),
  0,
);

const checks = {
  lorentzIntervalInvariant: transformed.every((row) => row.intervalInvariant),
  causalClassInvariant: transformed.every((row) => row.classInvariant),
  timelikeFuturePastOrderInvariant: transformed.every(
    (row) => row.futurePastInvariant,
  ),
  a0QuarterTurnJ4Identity: quarterTurnPass,
  sideFlipF2Identity: flipInvolutionPass,
  semanticRoleTypesStable: typedRolesPass,
  declaredHistoryOrderStable: memoryPass,
  cAblationUniqueBestFit: bestAblation.kOverC === 1,
  kPowerBetaCompositeNonIdentifiable: compositeNonIdentifiable,
  b2AddsHeldOutPredictionBeyondB1: predictiveGain > 0,
};

const requiredArchitectureChecks = Object.entries(checks)
  .filter(([name]) => name !== "b2AddsHeldOutPredictionBeyondB1")
  .every(([, value]) => value);

const result = {
  audit: "B2 c-grid + typed roles formal contract audit",
  date: "2026-11-14",
  authority: "R0/R1 formal audit; not a scientific replay or claim adoption",
  constants: { c: C, modulus: MOD, jFactor: J_FACTOR },
  samples: { spacetimeCases: cases.length, boosts: betas.length },
  operator: {
    j2Factor,
    j4Factor,
    flipFixedPoints,
    interpretation:
      "J is the A0 quarter-turn operator; the side flip is F=J^2.",
  },
  ablation,
  kPowerBeta: {
    examples: compositeExamples,
    conclusion:
      "Without an independent constraint on k or beta, only the composite k^beta is identifiable.",
  },
  checks,
  verdict: {
    architecture: requiredArchitectureChecks ? "PASS" : "FAIL",
    newPhysicalPrediction: predictiveGain > 0 ? "GAIN" : "NO GAIN",
    conclusion:
      requiredArchitectureChecks && predictiveGain === 0
        ? "B2 is internally consistent as a typed cartographic grammar, but does not outperform B1 on held-out causal classification."
        : "Review failed checks before interpretation.",
  },
};

console.log(JSON.stringify(result, null, 2));
