"use strict";

const ca03 = require("../NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/engine.js");
const base = require("../NEXAH_LIFE_MULTI_VIEW_UTILITY_CA_IDENT_02_2026-10-08/engine.js");

const RULE_IDS = Object.keys(base.RULES);
const TRAIN_SEEDS = Array.from({ length: 25 }, (_, i) => `R${String(i).padStart(2, "0")}`);
const HOLDOUT_SEEDS = Array.from({ length: 100 }, (_, i) => `R${String(i + 25).padStart(2, "0")}`);
const SAMPLE_TIMES = [10, 20, 30, 40];
const LOCK = "f7520b7bcfa18792cf73af61850ed38bf9a65069c834c5ea5bdf7ea2508d1ede";
const MODELS = [
  { id: "fourier_A", a: 1, b: 0 },
  { id: "P_63_1", a: 63 / 64, b: 1 / 64 },
  { id: "P_equal", a: 1 / 2, b: 1 / 2 },
  { id: "P_1_63_reverse_control", a: 1 / 64, b: 63 / 64 }
];

function buildDataset() {
  const rows = [];
  for (const ruleId of RULE_IDS) {
    for (const [split, seeds] of [["train", TRAIN_SEEDS], ["holdout", HOLDOUT_SEEDS]]) {
      for (const seedId of seeds) {
        const frames = ca03.run(ruleId, seedId, split === "holdout");
        for (const generation of SAMPLE_TIMES) {
          const features = ca03.featureRecord(frames, generation);
          rows.push({ split, ruleId, seedId, generation, target: base.futureClass(frames, generation), features });
        }
      }
    }
  }
  return rows;
}

function fitScaler(train, family) {
  const dimensions = train[0].features[family].length;
  const means = Array(dimensions).fill(0);
  const variances = Array(dimensions).fill(0);
  for (const row of train) row.features[family].forEach((value, i) => { means[i] += value / train.length; });
  for (const row of train) row.features[family].forEach((value, i) => { variances[i] += (value - means[i]) ** 2 / train.length; });
  const scales = variances.map((value) => Math.sqrt(value) || 1);
  return (vector) => vector.map((value, i) => (value - means[i]) / scales[i]);
}

function weightedVectorFactory(train, weightA, weightB) {
  const scaleA = fitScaler(train, "fourier_radial");
  const scaleB = fitScaler(train, "shadow_memory");
  const dimA = train[0].features.fourier_radial.length;
  const dimB = train[0].features.shadow_memory.length;
  const multiplierA = Math.sqrt(weightA / dimA);
  const multiplierB = Math.sqrt(weightB / dimB);
  return (row) => scaleA(row.features.fourier_radial).map((value) => value * multiplierA)
    .concat(scaleB(row.features.shadow_memory).map((value) => value * multiplierB));
}

function squaredDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += (a[i] - b[i]) ** 2;
  return sum;
}

function predict(train, vector) {
  const nearest = train
    .map((row) => ({ label: row.target, distance: squaredDistance(row.scaled, vector) }))
    .sort((a, b) => a.distance - b.distance || a.label.localeCompare(b.label))
    .slice(0, 3);
  const votes = new Map();
  for (const item of nearest) {
    const vote = votes.get(item.label) || { count: 0, distance: 0 };
    vote.count += 1;
    vote.distance += item.distance;
    votes.set(item.label, vote);
  }
  return [...votes.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].distance - b[1].distance || a[0].localeCompare(b[0]))[0][0];
}

function metrics(truth, predictions) {
  const labels = [...new Set(truth.concat(predictions))].sort();
  const perClass = {};
  let macroF1 = 0;
  for (const label of labels) {
    let tp = 0, fp = 0, fn = 0;
    truth.forEach((actual, i) => {
      const predicted = predictions[i];
      if (actual === label && predicted === label) tp += 1;
      else if (actual !== label && predicted === label) fp += 1;
      else if (actual === label && predicted !== label) fn += 1;
    });
    const precision = tp + fp ? tp / (tp + fp) : 0;
    const recall = tp + fn ? tp / (tp + fn) : 0;
    const f1 = precision + recall ? 2 * precision * recall / (precision + recall) : 0;
    macroF1 += f1 / labels.length;
    perClass[label] = { support: tp + fn, predicted: tp + fp, tp, precision, recall, f1 };
  }
  const correct = truth.filter((value, i) => value === predictions[i]).length;
  return { correct, total: truth.length, accuracy: correct / truth.length, macro_f1: macroF1, classes: labels.length, per_class: perClass };
}

function distribution(rows) {
  const counts = {};
  for (const row of rows) counts[row.target] = (counts[row.target] || 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function evaluateModel(train, test, model) {
  const makeVector = weightedVectorFactory(train, model.a, model.b);
  const scaledTrain = train.map((row) => ({ target: row.target, scaled: makeVector(row) }));
  const predictions = test.map((row) => predict(scaledTrain, makeVector(row)));
  return { family: model.id, weights: { A_fourier: model.a, B_memory: model.b }, ...metrics(test.map((row) => row.target), predictions) };
}

function evaluate() {
  const rows = buildDataset();
  const train = rows.filter((row) => row.split === "train");
  const test = rows.filter((row) => row.split === "holdout");
  const trainDistribution = distribution(train);
  const holdoutDistribution = distribution(test);
  const coverageClasses = Object.keys(trainDistribution);
  const coveragePass = coverageClasses.every((label) => (holdoutDistribution[label] || 0) >= 10);
  const results = MODELS.map((model) => evaluateModel(train, test, model));
  const byId = new Map(results.map((result) => [result.family, result]));
  const fourier = byId.get("fourier_A");
  const p631 = byId.get("P_63_1");
  const equal = byId.get("P_equal");
  const reverse = byId.get("P_1_63_reverse_control");
  const protectedClasses = Object.keys(holdoutDistribution).filter((label) => holdoutDistribution[label] >= 10);
  const recallNonInferior = protectedClasses.every((label) => p631.per_class[label].recall >= fourier.per_class[label].recall);
  const primaryGate = coveragePass && p631.macro_f1 >= fourier.macro_f1 + 0.01 && recallNonInferior;
  const specificityGate = coveragePass && p631.macro_f1 > equal.macro_f1 && p631.macro_f1 > reverse.macro_f1;
  const verdict = !coveragePass ? "COVERAGE_GATE_FAIL" : primaryGate && specificityGate ? "ALPHA_BETA_GAIN" : primaryGate ? "PRIMARY_GAIN_SPECIFICITY_FAIL" : "ALPHA_BETA_NO_GAIN";
  return {
    experiment: "CA-IDENT-05",
    date: "2026-10-08",
    status: "EXECUTED_AGAINST_LOCK",
    preregistration_sha256: LOCK,
    train_rows: train.length,
    holdout_rows: test.length,
    train_distribution: trainDistribution,
    holdout_distribution: holdoutDistribution,
    coverage_minimum: 10,
    coverage_gate_pass: coveragePass,
    protected_classes: protectedClasses,
    results,
    p_63_1_delta_vs_fourier: p631.macro_f1 - fourier.macro_f1,
    p_63_1_recall_noninferior: recallNonInferior,
    primary_gate_pass: primaryGate,
    specificity_gate_pass: specificityGate,
    verdict,
    interpretation: "63/64 and 1/64 are tested only as declared Fourier/Memory metric weights.",
    claim_ceiling: "Internal deterministic fixture. No physical resonance, radiance, biological mechanism, Life/E8 identity, quantum link, universal ratio law or external utility is established."
  };
}

if (require.main === module) process.stdout.write(`${JSON.stringify(evaluate(), null, 2)}\n`);

module.exports = { TRAIN_SEEDS, HOLDOUT_SEEDS, MODELS, buildDataset, weightedVectorFactory, evaluate };
