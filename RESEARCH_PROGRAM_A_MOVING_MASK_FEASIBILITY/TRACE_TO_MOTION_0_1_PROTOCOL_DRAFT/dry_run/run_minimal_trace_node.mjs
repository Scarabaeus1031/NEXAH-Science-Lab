#!/usr/bin/env node
/** Independent Node.js serializer for the frozen minimal synthetic trace.
 *
 * This implementation does not import, invoke or reuse the Python serializer.
 * Existing primary output is read only if a mismatch requires byte diagnostics.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INPUT = path.join(HERE, "minimal_trace_input.json");
const OUTPUT_ROOT = path.join(HERE, "minimal_trace_node_run");
const OUTPUT_TRACE = path.join(OUTPUT_ROOT, "trace_canonical.csv");
const OUTPUT_MANIFEST = path.join(OUTPUT_ROOT, "SHA256SUMS");
const REPORT = path.join(HERE, "NODE_INDEPENDENT_SERIALIZER_REPORT.json");
const DIAGNOSTIC_REFERENCE = path.join(
  HERE,
  "minimal_trace_run",
  "primary",
  "trace_canonical.csv",
);

const BASELINE = "b75b2b20dab29e98bafc3e3a62b3aafa6e63b0d4";
const EXPECTED_INPUT_SHA256 = "91b4f44c375d75f3473f3ac948abc905c85a06151ed1593c2788d5328c8a1205";
const EXPECTED_BYTE_COUNT = 324;
const EXPECTED_SHA256 = "8aadeeec4b4c8cd591a597aef59b8390585db7e8f6a5346e88b37bd41cbc71ce";
const HEADER = "sample_uuid,trace_index,s_norm,x_mm,y_mm,closure_status";
const TOKENS = new Set(["CLOSED", "NOT_CLOSED"]);

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function exactBinary64Decimal(value) {
  if (!Number.isFinite(value)) {
    throw new Error("NON_FINITE_NUMERIC_VALUE");
  }
  if (value === 0) {
    return "0";
  }

  const negative = value < 0;
  const magnitude = Math.abs(value);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, magnitude, false);
  const bits = view.getBigUint64(0, false);
  const exponentBits = Number((bits >> 52n) & 0x7ffn);
  const fraction = bits & ((1n << 52n) - 1n);

  let significand;
  let exponent2;
  if (exponentBits === 0) {
    significand = fraction;
    exponent2 = -1074;
  } else {
    significand = (1n << 52n) | fraction;
    exponent2 = exponentBits - 1023 - 52;
  }

  let text;
  if (exponent2 >= 0) {
    text = (significand << BigInt(exponent2)).toString(10);
  } else {
    const places = -exponent2;
    const scaled = significand * (5n ** BigInt(places));
    let digits = scaled.toString(10);
    if (digits.length <= places) {
      digits = `${"0".repeat(places + 1 - digits.length)}${digits}`;
    }
    const split = digits.length - places;
    const integerPart = digits.slice(0, split);
    let fractionalPart = digits.slice(split).replace(/0+$/, "");
    text = fractionalPart.length > 0
      ? `${integerPart}.${fractionalPart}`
      : integerPart;
  }
  return negative ? `-${text}` : text;
}

function readFrozenInput() {
  const bytes = fs.readFileSync(INPUT);
  if (sha256(bytes) !== EXPECTED_INPUT_SHA256) {
    throw new Error("FROZEN_INPUT_HASH_MISMATCH");
  }
  const data = JSON.parse(bytes.toString("utf8"));
  if (data.run_class !== "SYNTHETIC" || data.coordinate_unit !== "mm") {
    throw new Error("INPUT_CONTRACT_MISMATCH");
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(data.sample_uuid)) {
    throw new Error("UUID_NOT_CANONICAL_LOWERCASE_V4");
  }
  if (!Array.isArray(data.points) || data.points.length < 2) {
    throw new Error("INSUFFICIENT_POINTS");
  }
  const points = data.points.map((point) => {
    if (!Array.isArray(point) || point.length !== 2) {
      throw new Error("INVALID_POINT_SHAPE");
    }
    const normalized = point.map(Number);
    if (!normalized.every(Number.isFinite)) {
      throw new Error("NON_FINITE_POINT");
    }
    return normalized;
  });
  return { ...data, points };
}

function deriveOperationalTrace(data) {
  const cumulative = [0];
  for (let index = 1; index < data.points.length; index += 1) {
    const [x0, y0] = data.points[index - 1];
    const [x1, y1] = data.points[index];
    const segment = Math.hypot(x1 - x0, y1 - y0);
    if (!(segment > 0)) {
      throw new Error("NON_POSITIVE_SEGMENT");
    }
    cumulative.push(cumulative.at(-1) + segment);
  }
  const total = cumulative.at(-1);
  if (!(total > 0)) {
    throw new Error("ZERO_TOTAL_ARC_LENGTH");
  }
  return data.points.map(([x, y], traceIndex) => ({
    sample_uuid: data.sample_uuid,
    trace_index: traceIndex,
    s_norm: cumulative[traceIndex] / total,
    x_mm: x,
    y_mm: y,
  }));
}

function assessTraceConnectivity(rows) {
  const first = rows[0];
  const last = rows.at(-1);
  return first.x_mm === last.x_mm && first.y_mm === last.y_mm
    ? "CLOSED"
    : "NOT_CLOSED";
}

function assignClosureStatus(rows, token) {
  if (!TOKENS.has(token)) {
    throw new Error("UNAUTHORIZED_CLOSURE_STATUS");
  }
  return rows.map((row) => ({ ...row, closure_status: token }));
}

function serializeTrace(rows) {
  if (rows.length === 0) {
    throw new Error("EMPTY_TRACE");
  }
  if (new Set(rows.map((row) => row.closure_status)).size !== 1) {
    throw new Error("INCONSISTENT_TRACE_LEVEL_CLOSURE_STATUS");
  }
  const lines = [HEADER];
  rows.forEach((row, expectedIndex) => {
    if (row.trace_index !== expectedIndex) {
      throw new Error("TRACE_INDEX_MISMATCH");
    }
    const fields = [
      row.sample_uuid,
      String(row.trace_index),
      exactBinary64Decimal(row.s_norm),
      exactBinary64Decimal(row.x_mm),
      exactBinary64Decimal(row.y_mm),
      row.closure_status,
    ];
    if (fields.some((field) => field.length === 0 || /[,"\r\n]/.test(field))) {
      throw new Error("FIELD_REQUIRES_QUOTING_OR_IS_EMPTY");
    }
    lines.push(fields.join(","));
  });
  return Buffer.from(`${lines.join("\n")}\n`, "utf8");
}

function validateBytes(bytes, expectedRows) {
  if (bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) {
    throw new Error("UTF8_BOM_PROHIBITED");
  }
  if (bytes.includes(0x0d)) {
    throw new Error("CR_PROHIBITED");
  }
  if (bytes.at(-1) !== 0x0a || (bytes.length > 1 && bytes.at(-2) === 0x0a)) {
    throw new Error("FINAL_NEWLINE_FAILURE");
  }
  const lines = bytes.toString("utf8").slice(0, -1).split("\n");
  if (lines[0] !== HEADER || lines.length !== expectedRows + 1) {
    throw new Error("HEADER_OR_ROW_COUNT_FAILURE");
  }
  lines.slice(1).forEach((line, index) => {
    const fields = line.split(",");
    if (fields.length !== 6 || fields[1] !== String(index) || !TOKENS.has(fields[5])) {
      throw new Error("ROW_CONTRACT_FAILURE");
    }
  });
}

function firstDifference(actual, reference) {
  const common = Math.min(actual.length, reference.length);
  for (let index = 0; index < common; index += 1) {
    if (actual[index] !== reference[index]) {
      return index;
    }
  }
  return actual.length === reference.length ? null : common;
}

function classifyDifference(actual, reference, offset) {
  if (actual.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) return "encoding";
  if (actual.includes(0x0d)) return "line_ending";
  if (actual.at(-1) !== 0x0a || reference.at(-1) !== 0x0a) return "final_newline";
  const actualText = actual.toString("utf8");
  const referenceText = reference.toString("utf8");
  const actualHeader = actualText.split("\n", 1)[0];
  const referenceHeader = referenceText.split("\n", 1)[0];
  if (actualHeader !== referenceHeader) {
    return actualHeader.split(",").length !== referenceHeader.split(",").length
      ? "delimiter"
      : "column_order";
  }
  if (actual[offset] === 0x2c || reference[offset] === 0x2c) return "delimiter";

  const prefix = actual.subarray(0, offset).toString("utf8");
  const rowIndex = prefix.split("\n").length - 2;
  const columnIndex = prefix.split("\n").at(-1).split(",").length - 1;
  const actualRows = actualText.trimEnd().split("\n").slice(1);
  const referenceRows = referenceText.trimEnd().split("\n").slice(1);
  if (rowIndex >= 0 && rowIndex < actualRows.length && rowIndex < referenceRows.length) {
    const left = actualRows[rowIndex].split(",")[columnIndex];
    const right = referenceRows[rowIndex].split(",")[columnIndex];
    if ([1, 2, 3, 4].includes(columnIndex)) {
      return Number(left) === Number(right) ? "numeric_formatting" : "derivation";
    }
    if (columnIndex === 5) return "derivation";
  }
  return "encoding";
}

function diagnoseDivergence(actual) {
  if (!fs.existsSync(DIAGNOSTIC_REFERENCE)) {
    return {
      status: "DIVERGENCE_REFERENCE_UNAVAILABLE",
      earliest_byte: null,
      category: "UNKNOWN",
      reference_used_for_generation: false,
    };
  }
  const reference = fs.readFileSync(DIAGNOSTIC_REFERENCE);
  const offset = firstDifference(actual, reference);
  return {
    status: offset === null ? "NO_BYTE_DIVERGENCE" : "BYTE_DIVERGENCE",
    earliest_byte: offset,
    actual_byte: offset === null || offset >= actual.length ? null : actual[offset],
    expected_byte: offset === null || offset >= reference.length ? null : reference[offset],
    category: offset === null ? "NONE" : classifyDifference(actual, reference, offset),
    reference_used_for_generation: false,
    reference_use: "POST_GENERATION_DIAGNOSTIC_ONLY",
  };
}

function artifact(filePath) {
  const bytes = fs.readFileSync(filePath);
  return {
    path: path.relative(HERE, filePath).split(path.sep).join("/"),
    bytes: bytes.length,
    sha256: sha256(bytes),
  };
}

function run() {
  const stages = {};
  const data = readFrozenInput();
  stages.frozen_input_validation = "PASS";
  const rows = deriveOperationalTrace(data);
  stages.independent_operational_derivation = "PASS";
  const closureStatus = assessTraceConnectivity(rows);
  stages.independent_trace_connectivity_assessment = "PASS";
  const assignedRows = assignClosureStatus(rows, closureStatus);
  stages.independent_closure_status_assignment = "PASS";
  const bytes = serializeTrace(assignedRows);
  validateBytes(bytes, assignedRows.length);
  stages.independent_six_column_serialization = "PASS";

  const digest = sha256(bytes);
  stages.byte_count_comparison = bytes.length === EXPECTED_BYTE_COUNT ? "PASS" : "FAIL";
  stages.sha256_comparison = digest === EXPECTED_SHA256 ? "PASS" : "FAIL";

  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  fs.writeFileSync(OUTPUT_TRACE, bytes);
  fs.writeFileSync(OUTPUT_MANIFEST, Buffer.from(`${digest}  trace_canonical.csv\n`, "utf8"));
  if (sha256(fs.readFileSync(OUTPUT_TRACE)) !== digest) {
    stages.post_write_hash_verification = "FAIL";
  } else {
    stages.post_write_hash_verification = "PASS";
  }

  const mismatch = stages.byte_count_comparison === "FAIL" || stages.sha256_comparison === "FAIL";
  const divergence = mismatch
    ? diagnoseDivergence(bytes)
    : {
        status: "NO_DIVERGENCE",
        earliest_byte: null,
        category: "NONE",
        reference_read: false,
        reference_used_for_generation: false,
      };
  stages.earliest_divergence_reporting = mismatch && divergence.status === "DIVERGENCE_REFERENCE_UNAVAILABLE"
    ? "FAIL"
    : "PASS";

  const overall = Object.values(stages).every((status) => status === "PASS") ? "PASS" : "FAIL";
  const implementationPath = fileURLToPath(import.meta.url);
  return {
    run_id: "MINIMAL-SYNTHETIC-TRACE-NODE-INDEPENDENT-01",
    baseline_commit: BASELINE,
    implementation_class: "INDEPENDENT_NODEJS_SECOND_IMPLEMENTATION",
    independence_boundary: {
      python_module_imported: false,
      python_process_invoked: false,
      python_serialization_code_reused: false,
      primary_output_used_for_generation: false,
      diagnostic_reference_read: mismatch && fs.existsSync(DIAGNOSTIC_REFERENCE),
    },
    expected: {
      input_sha256: EXPECTED_INPUT_SHA256,
      trace_bytes: EXPECTED_BYTE_COUNT,
      trace_sha256: EXPECTED_SHA256,
    },
    actual: {
      closure_status: closureStatus,
      row_count: assignedRows.length,
      trace_bytes: bytes.length,
      trace_sha256: digest,
    },
    stages,
    divergence,
    overall,
    runtime: {
      runtime: "Node.js",
      node_version: process.version,
      platform: process.platform,
      architecture: process.arch,
      os_release: os.release(),
    },
    produced_artifacts_excluding_this_report: [
      artifact(implementationPath),
      artifact(OUTPUT_TRACE),
      artifact(OUTPUT_MANIFEST),
    ],
    frozen_input_modified: false,
    frozen_contracts_modified: false,
    primary_python_implementation_modified: false,
    human_acquisition: "PROHIBITED",
    scientific_result: "NONE",
  };
}

let report;
try {
  report = run();
} catch (error) {
  report = {
    run_id: "MINIMAL-SYNTHETIC-TRACE-NODE-INDEPENDENT-01",
    baseline_commit: BASELINE,
    overall: "FAIL",
    earliest_failure: {
      name: error.name,
      message: error.message,
    },
    human_acquisition: "PROHIBITED",
    scientific_result: "NONE",
  };
}

const reportBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`, "utf8");
fs.writeFileSync(REPORT, reportBytes);
process.stdout.write(reportBytes);
process.exitCode = report.overall === "PASS" ? 0 : 1;
