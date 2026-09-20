"use strict";

const fs = require("node:fs");

const SCHEMA = "nexah-hz-fz-apparatus-identity/0.1.0";
const PLACEHOLDERS = new Set(["", "PENDING", "UNKNOWN", "TBD", "N/A", "SYNTHETIC"]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function record(value, label) {
  assert(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
  return value;
}

function realString(value, label) {
  assert(typeof value === "string" && !PLACEHOLDERS.has(value.trim().toUpperCase()), `${label} must identify a real documented value`);
}

function positive(value, label) {
  assert(Number.isFinite(value) && value > 0, `${label} must be a positive finite number`);
}

function isoDate(value, label) {
  realString(value, label);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(value), `${label} must use YYYY-MM-DD`);
  const time = Date.parse(`${value}T00:00:00Z`);
  assert(Number.isFinite(time), `${label} must be a valid date`);
  return time;
}

function evaluate(document) {
  assert(document && typeof document === "object" && !Array.isArray(document), "apparatus identity must be an object");
  assert(document.schema === SCHEMA, `schema must be ${SCHEMA}`);
  assert(document.experiment_id === "HZ_FZ_01", "experiment_id must be HZ_FZ_01");
  assert(document.status === "APPARATUS_IDENTITY_DOCUMENTED", "status must be APPARATUS_IDENTITY_DOCUMENTED; pending records fail closed");

  const device = record(document.device, "device");
  ["device_id", "model", "serial_or_asset_id", "fixture_ref", "z_axis_definition", "operating_limits_ref"].forEach((key) => realString(device[key], `device.${key}`));

  const actuation = record(document.actuation, "actuation");
  ["actuator_id", "actuator_model", "actuator_serial_or_asset_id", "drive_source_id", "drive_source_model", "drive_source_serial_or_asset_id", "drive_limit_ref", "drive_measurement_channel"].forEach((key) => realString(actuation[key], `actuation.${key}`));
  assert(actuation.drive_is_measured_not_setpoint === true, "drive_v must be a measured channel, not only a software setpoint");

  const force = record(document.force_channel, "force_channel");
  ["force_sensor_id", "force_sensor_model", "force_sensor_serial_or_asset_id", "calibration_id", "calibration_document_ref", "force_measurement_channel", "positive_z_sign_definition"].forEach((key) => realString(force[key], `force_channel.${key}`));
  positive(force.rated_range_n, "force_channel.rated_range_n");
  positive(force.calibration_uncertainty_n, "force_channel.calibration_uncertainty_n");
  positive(force.coverage_factor, "force_channel.coverage_factor");
  const calibrationDate = isoDate(force.calibration_date, "force_channel.calibration_date");
  const expiryDate = isoDate(force.calibration_expiry_date, "force_channel.calibration_expiry_date");
  assert(expiryDate >= calibrationDate, "calibration expiry cannot precede calibration date");

  const acquisition = record(document.acquisition, "acquisition");
  ["acquisition_id", "manufacturer_model", "serial_or_asset_id", "software_version", "drive_channel_map", "force_channel_map", "sample_clock_ref", "synchronization_method", "timestamp_source"].forEach((key) => realString(acquisition[key], `acquisition.${key}`));
  positive(acquisition.available_sample_rate_hz, "acquisition.available_sample_rate_hz");

  const frame = record(document.frame, "frame");
  ["fixture_id", "alignment_method", "preload_method", "isolation_method", "location_id", "temperature_sensor_ref"].forEach((key) => realString(frame[key], `frame.${key}`));

  const operator = record(document.operator, "operator");
  realString(operator.operator_id, "operator.operator_id");
  const plannedDate = isoDate(operator.planned_acquisition_date, "operator.planned_acquisition_date");
  assert(plannedDate <= expiryDate, "force calibration expires before the planned acquisition date");

  const safety = record(document.safety, "safety");
  ["manufacturer_limits_confirmed", "power_removal_method_identified", "fixture_and_sensor_range_confirmed", "stop_conditions_acknowledged"].forEach((key) => {
    assert(safety[key] === true, `safety.${key} must be true`);
  });

  return {
    schema: "nexah-hz-fz-apparatus-identity-result/0.1.0",
    experiment_id: "HZ_FZ_01",
    classification: "APPARATUS_IDENTITY_ADMISSIBLE",
    next_authorized_step: "NULL_RUN_PREPARATION",
    device_id: device.device_id,
    actuator_id: actuation.actuator_id,
    force_sensor_id: force.force_sensor_id,
    calibration_id: force.calibration_id,
    acquisition_id: acquisition.acquisition_id,
    operator_id: operator.operator_id
  };
}

function selfTestFixture() {
  return {
    schema: SCHEMA,
    experiment_id: "HZ_FZ_01",
    status: "APPARATUS_IDENTITY_DOCUMENTED",
    device: { device_id: "TEST-DUT-01", model: "test fixture", serial_or_asset_id: "TEST-001", fixture_ref: "test-fixture-ref", z_axis_definition: "fixture axis from base to actuator", operating_limits_ref: "test-limits-ref" },
    actuation: { actuator_id: "TEST-ACT-01", actuator_model: "test actuator", actuator_serial_or_asset_id: "TEST-A01", drive_source_id: "TEST-DRV-01", drive_source_model: "test source", drive_source_serial_or_asset_id: "TEST-D01", drive_limit_ref: "test-drive-limits", drive_measurement_channel: "DAQ/AI0", drive_is_measured_not_setpoint: true },
    force_channel: { force_sensor_id: "TEST-FORCE-01", force_sensor_model: "test load cell", force_sensor_serial_or_asset_id: "TEST-F01", rated_range_n: 10, calibration_id: "TEST-CAL-01", calibration_document_ref: "test-calibration-ref", calibration_date: "2026-01-01", calibration_expiry_date: "2027-01-01", calibration_uncertainty_n: 0.01, coverage_factor: 2, force_measurement_channel: "DAQ/AI1", positive_z_sign_definition: "compression toward actuator is positive" },
    acquisition: { acquisition_id: "TEST-DAQ-01", manufacturer_model: "test DAQ", serial_or_asset_id: "TEST-Q01", software_version: "test-1.0", drive_channel_map: "AI0: drive voltage", force_channel_map: "AI1: calibrated axial force", sample_clock_ref: "DAQ internal shared clock", synchronization_method: "simultaneous acquisition on shared clock", available_sample_rate_hz: 2000, timestamp_source: "sample index divided by shared sample rate" },
    frame: { fixture_id: "TEST-FIX-01", alignment_method: "test jig", preload_method: "test preload", isolation_method: "test isolation", location_id: "TEST-LAB", temperature_sensor_ref: "TEST-TEMP-01" },
    operator: { operator_id: "SELF_TEST", planned_acquisition_date: "2026-09-15" },
    safety: { manufacturer_limits_confirmed: true, power_removal_method_identified: true, fixture_and_sensor_range_confirmed: true, stop_conditions_acknowledged: true }
  };
}

function main() {
  if (process.argv.includes("--self-test")) {
    const positive = evaluate(selfTestFixture());
    assert(positive.classification === "APPARATUS_IDENTITY_ADMISSIBLE", "positive fixture must pass");
    const pending = JSON.parse(fs.readFileSync(new URL("apparatus.identity.pending.json", `file://${__dirname}/`), "utf8"));
    let pendingRejected = false;
    try { evaluate(pending); } catch { pendingRejected = true; }
    assert(pendingRejected, "pending identity must fail closed");
    console.log(JSON.stringify({ self_test: "PASS", positive_fixture: positive.classification, pending_identity_rejected: true }, null, 2));
    return;
  }
  const filePath = process.argv[2];
  assert(filePath, "usage: node validate_apparatus_identity.js <apparatus.identity.json> | --self-test");
  console.log(JSON.stringify(evaluate(JSON.parse(fs.readFileSync(filePath, "utf8"))), null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) {
    console.error(JSON.stringify({ classification: "FAIL_CLOSED", error: error.message }, null, 2));
    process.exitCode = 2;
  }
}

module.exports = { evaluate, selfTestFixture };

