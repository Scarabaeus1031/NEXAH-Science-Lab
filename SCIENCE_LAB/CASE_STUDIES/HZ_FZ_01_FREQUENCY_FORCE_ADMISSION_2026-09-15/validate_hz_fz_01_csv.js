"use strict";

const fs = require("node:fs");
const { evaluate } = require("./validate_hz_fz_01.js");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (char !== "\r") field += char;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (quoted) throw new Error("unterminated quoted CSV field");
  return rows;
}

function number(value, label) {
  if (value.trim() === "") throw new Error(`${label} is blank`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} is not finite`);
  return parsed;
}

function convert(filePath) {
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  const headers = rows.shift();
  if (!headers || new Set(headers).size !== headers.length) throw new Error("CSV header is missing or duplicated");
  const records = rows.filter((row) => row.some((value) => value !== "")).map((row, rowIndex) => {
    if (row.length !== headers.length) throw new Error(`row ${rowIndex + 2} has ${row.length} fields; expected ${headers.length}`);
    return Object.fromEntries(headers.map((header, index) => [header, row[index]]));
  });
  if (!records.length) throw new Error("CSV contains no observations");
  const first = records[0];
  const invariantColumns = headers.slice(0, 16);
  records.forEach((record, index) => invariantColumns.forEach((column) => {
    if (record[column] !== first[column]) throw new Error(`row ${index + 2} changes invariant column ${column}`);
  }));
  const groups = new Map();
  for (const record of records) {
    if (!groups.has(record.role)) groups.set(record.role, []);
    groups.get(record.role).push(record);
  }
  const runs = [...groups.entries()].map(([role, observations]) => {
    const head = observations[0];
    const controls = ["run_id", "frequency_hz", "drive_amplitude_v", "drive_phase_deg", "preload_n", "sample_rate_hz", "time_unit", "drive_unit", "force_unit"];
    observations.forEach((record) => controls.forEach((column) => {
      if (record[column] !== head[column]) throw new Error(`${role} changes run control ${column}`);
    }));
    return {
      role,
      run_id: head.run_id,
      frequency_hz: number(head.frequency_hz, `${role}.frequency_hz`),
      drive_amplitude_v: number(head.drive_amplitude_v, `${role}.drive_amplitude_v`),
      drive_phase_deg: number(head.drive_phase_deg, `${role}.drive_phase_deg`),
      preload_n: number(head.preload_n, `${role}.preload_n`),
      sample_rate_hz: number(head.sample_rate_hz, `${role}.sample_rate_hz`),
      units: { time: head.time_unit, drive: head.drive_unit, force: head.force_unit },
      samples: observations.map((record, index) => ({
        t_s: number(record.t_s, `${role}.samples[${index}].t_s`),
        drive_v: number(record.drive_v, `${role}.samples[${index}].drive_v`),
        force_n: number(record.force_n, `${role}.samples[${index}].force_n`)
      }))
    };
  });
  return {
    schema: first.schema,
    experiment_id: first.experiment_id,
    status: "MEASURED",
    claim_boundary: first.claim_boundary,
    apparatus: {
      device_id: first.device_id,
      actuator_id: first.actuator_id,
      force_sensor_id: first.force_sensor_id,
      calibration_id: first.calibration_id,
      calibration_uncertainty_n: number(first.calibration_uncertainty_n, "calibration_uncertainty_n"),
      acquisition_id: first.acquisition_id,
      operator_id: first.operator_id
    },
    criteria: {
      max_null_force_rms_n: number(first.max_null_force_rms_n, "max_null_force_rms_n"),
      min_signal_to_uncertainty_ratio: number(first.min_signal_to_uncertainty_ratio, "min_signal_to_uncertainty_ratio"),
      max_gain_relative_delta: number(first.max_gain_relative_delta, "max_gain_relative_delta"),
      max_phase_delta_deg: number(first.max_phase_delta_deg, "max_phase_delta_deg"),
      max_force_rms_relative_delta: number(first.max_force_rms_relative_delta, "max_force_rms_relative_delta")
    },
    runs
  };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) throw new Error("usage: node validate_hz_fz_01_csv.js <measurement.csv>");
  const document = convert(filePath);
  const result = evaluate(document);
  console.log(JSON.stringify({
    ...result,
    data_class: document.apparatus.device_id === "SYNTHETIC" ? "SYNTHETIC_CONFORMANCE_ONLY" : "DECLARED_MEASUREMENT",
    observation_count: document.runs.reduce((sum, run) => sum + run.samples.length, 0)
  }, null, 2));
  if (result.classification !== "ADMISSIBLE") process.exitCode = 2;
}

try { main(); } catch (error) {
  console.error(JSON.stringify({ classification: "FAIL_CLOSED", error: error.message }, null, 2));
  process.exitCode = 2;
}

module.exports = { convert };
