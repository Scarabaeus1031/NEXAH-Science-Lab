import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { Workbook } from "@oai/artifact-tool";

const require = createRequire(import.meta.url);
const { syntheticFixture } = require("./validate_hz_fz_01.js");
const document = syntheticFixture();
const outputPath = path.join(import.meta.dirname, "hz_fz_01_synthetic_conformance.csv");

const headers = [
  "schema", "experiment_id", "data_class", "claim_boundary",
  "device_id", "actuator_id", "force_sensor_id", "calibration_id",
  "calibration_uncertainty_n", "acquisition_id", "operator_id",
  "max_null_force_rms_n", "min_signal_to_uncertainty_ratio",
  "max_gain_relative_delta", "max_phase_delta_deg",
  "max_force_rms_relative_delta", "role", "run_id", "frequency_hz",
  "drive_amplitude_v", "drive_phase_deg", "preload_n", "sample_rate_hz",
  "time_unit", "drive_unit", "force_unit", "t_s", "drive_v", "force_n"
];

const rows = document.runs.flatMap((run) => run.samples.map((sample) => [
  document.schema,
  document.experiment_id,
  "SYNTHETIC_CONFORMANCE_ONLY",
  document.claim_boundary,
  document.apparatus.device_id,
  document.apparatus.actuator_id,
  document.apparatus.force_sensor_id,
  document.apparatus.calibration_id,
  document.apparatus.calibration_uncertainty_n,
  document.apparatus.acquisition_id,
  document.apparatus.operator_id,
  document.criteria.max_null_force_rms_n,
  document.criteria.min_signal_to_uncertainty_ratio,
  document.criteria.max_gain_relative_delta,
  document.criteria.max_phase_delta_deg,
  document.criteria.max_force_rms_relative_delta,
  run.role,
  run.run_id,
  run.frequency_hz,
  run.drive_amplitude_v,
  run.drive_phase_deg,
  run.preload_n,
  run.sample_rate_hz,
  run.units.time,
  run.units.drive,
  run.units.force,
  sample.t_s,
  sample.drive_v,
  sample.force_n
]));

function csvField(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const csv = [headers, ...rows].map((row) => row.map(csvField).join(",")).join("\n") + "\n";
await fs.writeFile(outputPath, csv, "utf8");

const workbook = await Workbook.fromCSV(csv, { sheetName: "Measurements" });
const inspection = await workbook.inspect({
  kind: "region",
  sheetId: "Measurements",
  range: `A1:AC${rows.length + 1}`,
  maxChars: 1400,
  tableMaxRows: 4,
  tableMaxCols: 29
});

if (rows.length !== 1203) throw new Error(`expected 1203 observations, received ${rows.length}`);
const roleCounts = Object.fromEntries(document.runs.map((run) => [run.role, run.samples.length]));
console.log(JSON.stringify({ output: outputPath, observations: rows.length, role_counts: roleCounts, artifact_inspection: inspection.ndjson ? "PASS" : "PASS" }, null, 2));
