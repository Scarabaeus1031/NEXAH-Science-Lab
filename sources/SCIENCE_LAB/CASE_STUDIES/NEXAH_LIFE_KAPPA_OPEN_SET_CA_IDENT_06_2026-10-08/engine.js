"use strict";

const ca03 = require("../NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/engine.js");
const base = require("../NEXAH_LIFE_MULTI_VIEW_UTILITY_CA_IDENT_02_2026-10-08/engine.js");

const RULE_IDS = Object.keys(base.RULES);
const TRAIN_SEEDS = Array.from({ length: 125 }, (_, i) => `R${String(i).padStart(2, "0")}`);
const EVAL_SEEDS = Array.from({ length: 100 }, (_, i) => `R${String(i + 125).padStart(2, "0")}`);
const SAMPLE_TIMES = [10, 20, 30, 40];
const UNKNOWN = "constant-count motion";
const LOCK = "f98949089031183c8b035328fcd2cd56ff698b93a6ac66cfda1cec4407c9ed41";

function buildDataset() {
  const rows = [];
  for (const ruleId of RULE_IDS) {
    for (const [split, seeds] of [["train", TRAIN_SEEDS], ["evaluation", EVAL_SEEDS]]) {
      for (const seedId of seeds) {
        const frames = ca03.run(ruleId, seedId, split === "evaluation");
        for (const generation of SAMPLE_TIMES) {
          rows.push({
            split,
            ruleId,
            seedId,
            generation,
            target: base.futureClass(frames, generation),
            features: ca03.featureRecord(frames, generation)
          });
        }
      }
    }
  }
  return rows;
}

function fitScaler(rows, family) {
  const dimensions = rows[0].features[family].length;
  const means = Array(dimensions).fill(0);
  const variances = Array(dimensions).fill(0);
  for (const row of rows) row.features[family].forEach((value, i) => { means[i] += value / rows.length; });
  for (const row of rows) row.features[family].forEach((value, i) => { variances[i] += (value - means[i]) ** 2 / rows.length; });
  const scales = variances.map((value) => Math.sqrt(value) || 1);
  return (vector) => vector.map((value, i) => (value - means[i]) / scales[i]);
}

function vectorFactories(knownTrain) {
  const scaleFourier = fitScaler(knownTrain, "fourier_radial");
  const scaleMemory = fitScaler(knownTrain, "shadow_memory");
  const dimFourier = knownTrain[0].features.fourier_radial.length;
  const dimMemory = knownTrain[0].features.shadow_memory.length;
  const fourier = (row) => scaleFourier(row.features.fourier_radial).map((value) => value / Math.sqrt(dimFourier));
  const memory = (row) => scaleMemory(row.features.shadow_memory).map((value) => value / Math.sqrt(dimMemory));
  const combined = (row) => fourier(row).map((value) => value * Math.sqrt(1 / 64))
    .concat(memory(row).map((value) => value * Math.sqrt(63 / 64)));
  return { fourier, memory, combined };
}

function squaredDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += (a[i] - b[i]) ** 2;
  return sum;
}

function nearestRank(values, probability) {
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(probability * sorted.length) - 1)];
}

function calibrateKappa(rows) {
  const distances = rows.map((row, i) => {
    let nearest = Infinity;
    for (let j = 0; j < rows.length; j += 1) {
      if (i === j || row.seedId === rows[j].seedId) continue;
      const distance = squaredDistance(row.combined, rows[j].combined);
      if (distance < nearest) nearest = distance;
    }
    return nearest;
  });
  return { threshold: nearestRank(distances, 0.99), distances };
}

function vote(nearest) {
  const votes = new Map();
  for (const item of nearest) {
    const value = votes.get(item.label) || { count: 0, distance: 0 };
    value.count += 1;
    value.distance += item.distance;
    votes.set(item.label, value);
  }
  return [...votes.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].distance - b[1].distance || a[0].localeCompare(b[0]))[0][0];
}

function predictFrom(train, vector, field) {
  const nearest = train
    .map((row) => ({ label: row.target, distance: squaredDistance(vector, row[field]) }))
    .sort((a, b) => a.distance - b.distance || a.label.localeCompare(b.label))
    .slice(0, 3);
  return vote(nearest);
}

function distribution(rows) {
  const counts = {};
  for (const row of rows) counts[row.target] = (counts[row.target] || 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function evaluate() {
  const rows = buildDataset();
  const discovery = rows.filter((row) => row.split === "train");
  const evaluation = rows.filter((row) => row.split === "evaluation");
  const knownTrain = discovery.filter((row) => row.target !== UNKNOWN);
  const factories = vectorFactories(knownTrain);
  const vectorizedTrain = knownTrain.map((row) => ({
    ...row,
    fourier: factories.fourier(row),
    memory: factories.memory(row),
    combined: factories.combined(row)
  }));
  const calibration = calibrateKappa(vectorizedTrain);

  let unknownSupport = 0, unknownAbstained = 0, knownSupport = 0, knownAbstained = 0;
  let knownCorrect = 0, knownAccepted = 0, unknownDisagreement = 0, knownDisagreement = 0;
  const kappaUnknown = [], kappaKnown = [];
  for (const row of evaluation) {
    const fourier = factories.fourier(row);
    const memory = factories.memory(row);
    const combined = factories.combined(row);
    let kappa = Infinity;
    const nearest = [];
    for (const trainRow of vectorizedTrain) {
      const distance = squaredDistance(combined, trainRow.combined);
      if (distance < kappa) kappa = distance;
      nearest.push({ label: trainRow.target, distance });
    }
    nearest.sort((a, b) => a.distance - b.distance || a.label.localeCompare(b.label));
    const predicted = vote(nearest.slice(0, 3));
    const abstain = kappa > calibration.threshold;
    const seamDisagreement = predictFrom(vectorizedTrain, fourier, "fourier") !== predictFrom(vectorizedTrain, memory, "memory");
    if (row.target === UNKNOWN) {
      unknownSupport += 1;
      if (abstain) unknownAbstained += 1;
      if (seamDisagreement) unknownDisagreement += 1;
      kappaUnknown.push(kappa);
    } else {
      knownSupport += 1;
      if (abstain) knownAbstained += 1;
      else {
        knownAccepted += 1;
        if (predicted === row.target) knownCorrect += 1;
      }
      if (seamDisagreement) knownDisagreement += 1;
      kappaKnown.push(kappa);
    }
  }

  const discoveryDistribution = distribution(discovery);
  const evaluationDistribution = distribution(evaluation);
  const knownLabels = Object.keys(distribution(knownTrain));
  const coveragePass = unknownSupport >= 10 && knownLabels.every((label) => (evaluationDistribution[label] || 0) >= 10);
  const unknownRecall = unknownSupport ? unknownAbstained / unknownSupport : 0;
  const knownSpecificity = knownSupport ? 1 - knownAbstained / knownSupport : 0;
  const abstainPrecision = unknownAbstained + knownAbstained ? unknownAbstained / (unknownAbstained + knownAbstained) : 0;
  const primaryGate = coveragePass && unknownRecall >= 0.5 && knownSpecificity >= 0.95;

  return {
    experiment: "CA-IDENT-06",
    date: "2026-10-08",
    status: "EXECUTED_AGAINST_LOCK",
    preregistration_sha256: LOCK,
    discovery_rows: discovery.length,
    known_training_rows: knownTrain.length,
    excluded_registered_unknown_rows: discovery.length - knownTrain.length,
    evaluation_rows: evaluation.length,
    discovery_distribution: discoveryDistribution,
    evaluation_distribution: evaluationDistribution,
    coverage_gate_pass: coveragePass,
    kappa_threshold_percentile: 0.99,
    kappa_threshold: calibration.threshold,
    unknown_class: UNKNOWN,
    unknown_support: unknownSupport,
    unknown_abstained: unknownAbstained,
    unknown_recall: unknownRecall,
    known_support: knownSupport,
    known_abstained: knownAbstained,
    known_specificity: knownSpecificity,
    abstain_precision: abstainPrecision,
    known_accepted_accuracy: knownAccepted ? knownCorrect / knownAccepted : 0,
    median_kappa_unknown: nearestRank(kappaUnknown, 0.5),
    median_kappa_known: nearestRank(kappaKnown, 0.5),
    seam_disagreement_unknown_rate: unknownSupport ? unknownDisagreement / unknownSupport : 0,
    seam_disagreement_known_rate: knownSupport ? knownDisagreement / knownSupport : 0,
    primary_gate_pass: primaryGate,
    verdict: !coveragePass ? "COVERAGE_GATE_FAIL" : primaryGate ? "KAPPA_OPEN_SET_PASS" : "KAPPA_OPEN_SET_FAIL",
    interpretation: "Kappa is a frozen support-distance abstention channel, not a class identity or physical field.",
    claim_ceiling: "No physical Kappa field, resonance, biological mechanism, Life/E8 identity, quantum link or external utility is established."
  };
}

if (require.main === module) process.stdout.write(`${JSON.stringify(evaluate(), null, 2)}\n`);

module.exports = { TRAIN_SEEDS, EVAL_SEEDS, UNKNOWN, buildDataset, vectorFactories, calibrateKappa, evaluate };
