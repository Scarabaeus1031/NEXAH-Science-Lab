"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");

const SCHEMA = "nexah-hz-fz-measurement/0.1.0";
const ROLES = ["NULL", "REFERENCE_A", "REPLAY_B"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function finite(value, label) {
  assert(Number.isFinite(value), `${label} must be finite`);
  return value;
}

function nonempty(value, label) {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a nonempty string`);
}

function rms(values) {
  return Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length);
}

function fundamental(samples, key, frequencyHz) {
  let re = 0;
  let im = 0;
  for (const sample of samples) {
    const angle = 2 * Math.PI * frequencyHz * sample.t_s;
    re += sample[key] * Math.cos(angle);
    im -= sample[key] * Math.sin(angle);
  }
  const scale = 2 / samples.length;
  return { re: re * scale, im: im * scale };
}

function magnitude(value) {
  return Math.hypot(value.re, value.im);
}

function phaseDeg(value) {
  return Math.atan2(value.im, value.re) * 180 / Math.PI;
}

function wrapDeg(value) {
  return ((value + 540) % 360) - 180;
}

function circularDeltaDeg(a, b) {
  return Math.abs(wrapDeg(a - b));
}

function relativeDelta(a, b) {
  const denominator = (Math.abs(a) + Math.abs(b)) / 2;
  return denominator === 0 ? (a === b ? 0 : Infinity) : Math.abs(a - b) / denominator;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") return Object.keys(value).sort().reduce((out, key) => {
    out[key] = canonicalize(value[key]);
    return out;
  }, {});
  return value;
}

function sha256Canonical(value) {
  return crypto.createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}

function validateRun(run, index) {
  assert(run && typeof run === "object" && !Array.isArray(run), `runs[${index}] must be an object`);
  nonempty(run.run_id, `runs[${index}].run_id`);
  assert(ROLES.includes(run.role), `runs[${index}].role is invalid`);
  ["frequency_hz", "drive_amplitude_v", "drive_phase_deg", "preload_n", "sample_rate_hz"].forEach((key) => finite(run[key], `runs[${index}].${key}`));
  assert(run.frequency_hz >= 0 && run.drive_amplitude_v >= 0 && run.sample_rate_hz > 0, `runs[${index}] contains an invalid nonnegative control`);
  assert(JSON.stringify(run.units) === JSON.stringify({ time: "s", drive: "V", force: "N" }), `runs[${index}] units must be s, V and N`);
  assert(Array.isArray(run.samples) && run.samples.length >= 16, `runs[${index}] requires at least 16 samples`);
  let previous = -Infinity;
  run.samples.forEach((sample, sampleIndex) => {
    assert(sample && typeof sample === "object" && !Array.isArray(sample), `runs[${index}].samples[${sampleIndex}] must be an object`);
    ["t_s", "drive_v", "force_n"].forEach((key) => finite(sample[key], `runs[${index}].samples[${sampleIndex}].${key}`));
    assert(sample.t_s > previous, `runs[${index}] sample times must be strictly increasing`);
    previous = sample.t_s;
  });
  const duration = run.samples.at(-1).t_s - run.samples[0].t_s;
  const measuredRate = (run.samples.length - 1) / duration;
  assert(relativeDelta(measuredRate, run.sample_rate_hz) <= 0.02, `runs[${index}] timestamps disagree with sample_rate_hz by more than 2%`);
}

function analyzeDriven(run) {
  assert(run.frequency_hz > 0, `${run.role} frequency_hz must be positive`);
  assert(run.drive_amplitude_v > 0, `${run.role} drive_amplitude_v must be positive`);
  assert(run.sample_rate_hz / run.frequency_hz >= 20, `${run.role} requires at least 20 samples per period`);
  const duration = run.samples.at(-1).t_s - run.samples[0].t_s;
  assert(duration * run.frequency_hz >= 3, `${run.role} must cover at least three periods`);
  const drive = fundamental(run.samples, "drive_v", run.frequency_hz);
  const force = fundamental(run.samples, "force_n", run.frequency_hz);
  const driveMagnitude = magnitude(drive);
  assert(driveMagnitude > 0, `${run.role} measured drive fundamental is zero`);
  return {
    force_fundamental_n: magnitude(force),
    force_rms_n: rms(run.samples.map((sample) => sample.force_n)),
    gain_n_per_v: magnitude(force) / driveMagnitude,
    phase_deg: wrapDeg(phaseDeg(force) - phaseDeg(drive))
  };
}

function evaluate(document) {
  assert(document && typeof document === "object" && !Array.isArray(document), "measurement must be an object");
  assert(document.schema === SCHEMA, `schema must be ${SCHEMA}`);
  assert(document.experiment_id === "HZ_FZ_01", "experiment_id must be HZ_FZ_01");
  assert(document.status === "MEASURED", "status must be MEASURED; placeholders fail closed");
  assert(typeof document.claim_boundary === "string" && document.claim_boundary.length >= 20, "claim_boundary is required");
  const apparatus = document.apparatus;
  assert(apparatus && typeof apparatus === "object", "apparatus is required");
  ["device_id", "actuator_id", "force_sensor_id", "calibration_id", "acquisition_id", "operator_id"].forEach((key) => nonempty(apparatus[key], `apparatus.${key}`));
  finite(apparatus.calibration_uncertainty_n, "apparatus.calibration_uncertainty_n");
  assert(apparatus.calibration_uncertainty_n > 0, "calibration uncertainty must be positive");
  const criteria = document.criteria;
  assert(criteria && typeof criteria === "object", "criteria are required");
  ["max_null_force_rms_n", "min_signal_to_uncertainty_ratio", "max_gain_relative_delta", "max_phase_delta_deg", "max_force_rms_relative_delta"].forEach((key) => finite(criteria[key], `criteria.${key}`));
  assert(criteria.max_null_force_rms_n >= 0, "max_null_force_rms_n must be nonnegative");
  assert(criteria.min_signal_to_uncertainty_ratio >= 1, "min_signal_to_uncertainty_ratio must be at least 1");
  assert(criteria.max_gain_relative_delta >= 0 && criteria.max_gain_relative_delta <= 1, "max_gain_relative_delta must be within [0,1]");
  assert(criteria.max_phase_delta_deg >= 0 && criteria.max_phase_delta_deg <= 180, "max_phase_delta_deg must be within [0,180]");
  assert(criteria.max_force_rms_relative_delta >= 0 && criteria.max_force_rms_relative_delta <= 1, "max_force_rms_relative_delta must be within [0,1]");
  assert(Array.isArray(document.runs) && document.runs.length === 3, "exactly three runs are required");
  document.runs.forEach(validateRun);
  const byRole = Object.fromEntries(document.runs.map((run) => [run.role, run]));
  ROLES.forEach((role) => assert(byRole[role], `run role ${role} is required`));
  assert(new Set(document.runs.map((run) => run.role)).size === 3, "run roles must be unique");
  assert(new Set(document.runs.map((run) => run.run_id)).size === 3, "run_id values must be unique");
  assert(byRole.NULL.frequency_hz === 0 && byRole.NULL.drive_amplitude_v === 0, "NULL run must declare zero frequency and zero drive amplitude");
  const reference = byRole.REFERENCE_A;
  const replay = byRole.REPLAY_B;
  ["frequency_hz", "drive_amplitude_v", "drive_phase_deg", "preload_n", "sample_rate_hz"].forEach((key) => {
    assert(reference[key] === replay[key], `REFERENCE_A and REPLAY_B must share ${key}`);
  });
  const a = analyzeDriven(reference);
  const b = analyzeDriven(replay);
  const nullRms = rms(byRole.NULL.samples.map((sample) => sample.force_n));
  const metrics = {
    frequency_hz: reference.frequency_hz,
    null_force_rms_n: nullRms,
    reference_a: a,
    replay_b: b,
    gain_relative_delta: relativeDelta(a.gain_n_per_v, b.gain_n_per_v),
    phase_delta_deg: circularDeltaDeg(a.phase_deg, b.phase_deg),
    force_rms_relative_delta: relativeDelta(a.force_rms_n, b.force_rms_n)
  };
  const minimumSignal = apparatus.calibration_uncertainty_n * criteria.min_signal_to_uncertainty_ratio;
  const checks = {
    null_floor_pass: nullRms <= criteria.max_null_force_rms_n,
    reference_signal_pass: a.force_fundamental_n >= minimumSignal,
    replay_signal_pass: b.force_fundamental_n >= minimumSignal,
    gain_repeat_pass: metrics.gain_relative_delta <= criteria.max_gain_relative_delta,
    phase_repeat_pass: metrics.phase_delta_deg <= criteria.max_phase_delta_deg,
    force_rms_repeat_pass: metrics.force_rms_relative_delta <= criteria.max_force_rms_relative_delta
  };
  const passed = Object.values(checks).every(Boolean);
  return {
    schema: "nexah-hz-fz-admission-result/0.1.0",
    experiment_id: "HZ_FZ_01",
    measurement_sha256: sha256Canonical(document),
    classification: passed ? "ADMISSIBLE" : "REJECTED",
    checks,
    metrics,
    claim_boundary: document.claim_boundary
  };
}

function syntheticFixture() {
  const sampleRate = 2000;
  const frequency = 20;
  const count = 401;
  const makeSamples = (gain, phase, nullRun = false) => Array.from({ length: count }, (_, index) => {
    const t = index / sampleRate;
    return {
      t_s: t,
      drive_v: nullRun ? 0 : Math.sin(2 * Math.PI * frequency * t),
      force_n: nullRun ? 0.001 * Math.sin(2 * Math.PI * 7 * t) : gain * Math.sin(2 * Math.PI * frequency * t + phase * Math.PI / 180)
    };
  });
  const common = { frequency_hz: frequency, drive_amplitude_v: 1, drive_phase_deg: 0, preload_n: 5, sample_rate_hz: sampleRate, units: { time: "s", drive: "V", force: "N" } };
  return {
    schema: SCHEMA,
    experiment_id: "HZ_FZ_01",
    status: "MEASURED",
    claim_boundary: "Synthetic validator conformance fixture only; not an empirical measurement or capability claim.",
    apparatus: { device_id: "SYNTHETIC", actuator_id: "SYNTHETIC", force_sensor_id: "SYNTHETIC", calibration_id: "SYNTHETIC", calibration_uncertainty_n: 0.002, acquisition_id: "SYNTHETIC", operator_id: "SELF_TEST" },
    criteria: { max_null_force_rms_n: 0.005, min_signal_to_uncertainty_ratio: 20, max_gain_relative_delta: 0.03, max_phase_delta_deg: 3, max_force_rms_relative_delta: 0.03 },
    runs: [
      { ...common, role: "NULL", run_id: "synthetic-null", frequency_hz: 0, drive_amplitude_v: 0, samples: makeSamples(0, 0, true) },
      { ...common, role: "REFERENCE_A", run_id: "synthetic-a", samples: makeSamples(2, 20) },
      { ...common, role: "REPLAY_B", run_id: "synthetic-b", samples: makeSamples(2.02, 21) }
    ]
  };
}

function main() {
  if (process.argv.includes("--self-test")) {
    const fixture = syntheticFixture();
    const pass = evaluate(fixture);
    assert(pass.classification === "ADMISSIBLE", "positive self-test fixture must pass");
    const control = structuredClone(fixture);
    control.runs.find((run) => run.role === "REPLAY_B").frequency_hz = 21;
    let controlRejected = false;
    try { evaluate(control); } catch { controlRejected = true; }
    assert(controlRejected, "mismatched-control self-test must fail closed");
    console.log(JSON.stringify({ self_test: "PASS", positive_fixture: pass.classification, mismatched_control_rejected: true }, null, 2));
    return;
  }
  const filePath = process.argv[2];
  assert(filePath, "usage: node validate_hz_fz_01.js <measurement.json> | --self-test");
  const result = evaluate(JSON.parse(fs.readFileSync(filePath, "utf8")));
  console.log(JSON.stringify(result, null, 2));
  if (result.classification !== "ADMISSIBLE") process.exitCode = 2;
}

if (require.main === module) {
  try { main(); } catch (error) {
    console.error(JSON.stringify({ classification: "FAIL_CLOSED", error: error.message }, null, 2));
    process.exitCode = 2;
  }
}

module.exports = { evaluate, syntheticFixture };
