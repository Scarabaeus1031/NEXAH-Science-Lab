#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "SOURCE_SNAPSHOT", "E8 DEMOS");
const REFERENCE = path.join(ROOT, "REFERENCE_BINDING", "outputs");

const expectedHashes = {
  "MIWA_PINEAP_AN_DROMEDA(1).html": "fff457df679253a07c34e44e551eb3a1841e3814a80c96eb06a8485ee0cd7888",
  "MIWA_PINEAP_AN_DROMEDA_RECORD(1).json": "b5c886f98818d118c0ecdc25ba3acb9fabd322cd4bd4b71c9e176ff083890892",
  "MIWA_PINEAP_STAR_MAP_TEMPLATE(1).csv": "71bfe9779090d67113dd5e86c7e06147b47e48834abc12e8ebffe6b7f279418f",
  "MIWA_Projection_Lab_Extension_Preview.png": "0dd7706da63a604555d3d417ce14fc71bba577b57b6e64e83a1f1bce1cbd1de1",
  "NEXAH_E8_AXIS08_Coupling.html": "dba6111d3d62c8dc2ee94f33524aa1375be80fb34be7f3b2fa987c9ec19fb512",
  "NEXAH_E8_AXIS08_Coupling.png": "6cf9c64c1e222206eae6331b89f1dbb6bd2476c84d9956878963efab9932541a"
};

let failed = 0;
function check(id, condition, measured) {
  const status = condition ? "PASS" : "FAIL";
  if (!condition) failed += 1;
  console.log(`${status}\t${id}\t${measured}`);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function scriptFrom(html) {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  check("ONE_INLINE_SCRIPT", scripts.length === 1, scripts.length);
  return scripts.join("\n");
}

function literalArray(source, name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\[[\\s\\S]*?\\]);`));
  if (!match) throw new Error(`Missing array ${name}`);
  return vm.runInNewContext(match[1]);
}

function csvRows(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

for (const [name, expected] of Object.entries(expectedHashes)) {
  const actual = sha256(path.join(SOURCE, name));
  check(`SOURCE_HASH_${name}`, actual === expected, actual);
}

const aHtml = fs.readFileSync(path.join(SOURCE, "NEXAH_E8_AXIS08_Coupling.html"), "utf8");
const bHtml = fs.readFileSync(path.join(SOURCE, "MIWA_PINEAP_AN_DROMEDA(1).html"), "utf8");
const aScript = scriptFrom(aHtml);
const bScript = scriptFrom(bHtml);

for (const [id, script] of [["DEMO_A_JS_SYNTAX", aScript], ["DEMO_B_JS_SYNTAX", bScript]]) {
  try {
    new vm.Script(script);
    check(id, true, "valid");
  } catch (error) {
    check(id, false, error.message);
  }
}

const externalPattern = /<(?:script|img|link)[^>]+(?:src|href)=["'](?:https?:)?\/\//i;
check("DEMO_A_NO_EXTERNAL_RUNTIME_DEPENDENCY", !externalPattern.test(aHtml), "inline runtime");
check("DEMO_B_NO_EXTERNAL_RUNTIME_DEPENDENCY", !externalPattern.test(bHtml), "inline runtime plus local CSV link");
check("DEMO_A_CANVAS", /<canvas\s+id="field"/.test(aHtml) && /getContext\('2d'\)/.test(aScript), "field/2d");
check("DEMO_B_CANVAS", /<canvas\s+id="field"/.test(bHtml) && /getContext\('2d'\)/.test(bScript), "field/2d");

const rootsA = literalArray(aScript, "ROOTS");
const rootsB = literalArray(bScript, "E8_ROOTS");
const pointKey = point => point.map(value => Number(value).toFixed(6)).join(",");
const ringCounts = roots => Array.from({ length: 8 }, (_, ring) => roots.filter(point => point[2] === ring).length);
check("DEMO_A_PROJECTED_POINT_COUNT", rootsA.length === 240, rootsA.length);
check("DEMO_A_PROJECTED_POINTS_UNIQUE", new Set(rootsA.map(pointKey)).size === 240, new Set(rootsA.map(pointKey)).size);
check("DEMO_A_EIGHT_ORBITS_OF_30", ringCounts(rootsA).every(n => n === 30), JSON.stringify(ringCounts(rootsA)));
check("DEMO_B_PROJECTED_POINT_COUNT", rootsB.length === 240, rootsB.length);
check("DEMO_ARRAYS_IDENTICAL", JSON.stringify(rootsA) === JSON.stringify(rootsB), "byte-equivalent numeric arrays");

const rootRows = csvRows(fs.readFileSync(path.join(REFERENCE, "e8_roots_8d.csv"), "utf8"));
const vectors = rootRows.map(row => Array.from({ length: 8 }, (_, i) => Number(row[`x${i + 1}`])));
const vectorKey = vector => vector.map(value => Math.round(value * 2)).join(",");
const norms = vectors.map(vector => vector.reduce((sum, value) => sum + value * value, 0));
const integerType = vectors.filter(vector => vector.filter(value => Math.abs(value) === 1).length === 2 && vector.filter(value => value === 0).length === 6).length;
const halfType = vectors.filter(vector => vector.every(value => Math.abs(value) === 0.5) && vector.filter(value => value < 0).length % 2 === 0).length;
check("REFERENCE_E8_ROOT_COUNT", vectors.length === 240, vectors.length);
check("REFERENCE_E8_UNIQUE", new Set(vectors.map(vectorKey)).size === 240, new Set(vectors.map(vectorKey)).size);
check("REFERENCE_E8_NORM_SQUARED", Math.max(...norms.map(value => Math.abs(value - 2))) < 1e-12, Math.max(...norms.map(value => Math.abs(value - 2))));
check("REFERENCE_E8_112_INTEGER_ROOTS", integerType === 112, integerType);
check("REFERENCE_E8_128_HALF_ROOTS", halfType === 128, halfType);

const projectionRows = csvRows(fs.readFileSync(path.join(REFERENCE, "coxeter_projection_2d.csv"), "utf8"));
const sourceXY = projectionRows.map(row => [Number(row.x), Number(row.y)]);
let numerator = 0;
let denominator = 0;
for (let i = 0; i < 240; i += 1) {
  numerator += sourceXY[i][0] * rootsA[i][0] + sourceXY[i][1] * rootsA[i][1];
  denominator += sourceXY[i][0] ** 2 + sourceXY[i][1] ** 2;
}
const scale = numerator / denominator;
let maxProjectionError = 0;
for (let i = 0; i < 240; i += 1) {
  maxProjectionError = Math.max(
    maxProjectionError,
    Math.abs(sourceXY[i][0] * scale - rootsA[i][0]),
    Math.abs(sourceXY[i][1] * scale - rootsA[i][1])
  );
}
check("DEMO_PROJECTION_MATCHES_BOUND_REFERENCE", maxProjectionError < 1e-6, `scale=${scale}; max_error=${maxProjectionError}`);

const templateRows = csvRows(fs.readFileSync(path.join(SOURCE, "MIWA_PINEAP_STAR_MAP_TEMPLATE(1).csv"), "utf8"));
check("MIWA_TEMPLATE_ROWS", templateRows.length === 16, templateRows.length);
check("MIWA_TEMPLATE_COORDINATES", templateRows.every(row => Number.isFinite(Number(row.ra_deg)) && Number.isFinite(Number(row.dec_deg))), "ra/dec present");

const record = JSON.parse(fs.readFileSync(path.join(SOURCE, "MIWA_PINEAP_AN_DROMEDA_RECORD(1).json"), "utf8"));
check("MIWA_RECORD_PARSE", Boolean(record.record_id && record.projection_lab), record.record_id || "missing");
check("MIWA_NINE_FRAMES", record.inside_frame_navigator?.frames?.length === 9, record.inside_frame_navigator?.frames?.length);
check("MIWA_Q4_FIXTURE_DECLARATION", record.inside_frame_navigator?.loki_fixture?.nodes === 16 && record.inside_frame_navigator?.loki_fixture?.edges === 32, JSON.stringify(record.inside_frame_navigator?.loki_fixture));

const q4Edges = new Set();
for (let dimension = 0; dimension < 4; dimension += 1) {
  for (let vertex = 0; vertex < 16; vertex += 1) {
    const neighbor = vertex ^ (1 << dimension);
    const edge = [Math.min(vertex, neighbor), Math.max(vertex, neighbor)].join("-");
    q4Edges.add(edge);
  }
}
check("Q4_16_NODES_32_EDGES", q4Edges.size === 32, q4Edges.size);

check("STATE_RECORD_IMPORT_EXPLICITLY_REJECTED", bScript.includes("Diese Datei ist ein Instrument- oder State-Record, keine Sternkarte"), "state record is not an accepted catalog");
check("STATE_EXPORT_HAS_PROJECTION_PARAMETERS", bScript.includes("coupling_log10") && bScript.includes("axis_split_epsilon") && bScript.includes("q_layer") && bScript.includes("cut_depth_rho") && bScript.includes("direction:"), "present");
check("STATE_EXPORT_REIMPORT_ROUNDTRIP", false, "no state-record importer; catalog importer rejects exported record");

const demoAFormula = aScript.includes("R*(.27+.08*t)") && aScript.includes("eps*R*.95");
const demoBFormula = bScript.includes("R*(.25+.09*t)") && bScript.includes("eps*R*.9");
check("AXIS08_IMPLEMENTATION_IDENTICAL", false, `A=${demoAFormula}; B=${demoBFormula}; parameterized drawing formulas differ`);
check("AXIS08_NUMERICAL_WEIGHTED_QUOTIENT", false, "both demos route p7/p8 to a drawn seventh point; no numerical weighted reduction is computed");

check("DEMO_A_RESPONSIVE_CSS", /@media\(max-width:780px\)/.test(aHtml), "780px breakpoint");
check("DEMO_B_RESPONSIVE_CSS", /@media\(max-width:1180px\)/.test(bHtml) && /@media\(max-width:900px\)/.test(bHtml) && /@media\(max-width:720px\)/.test(bHtml), "1180/900/720px breakpoints");

console.log(`SUMMARY\t${failed === 0 ? "PASS" : "EXPECTED_LIMITS_PRESENT"}\tfailures=${failed}`);
// Three expected FAIL rows encode declared product/model limitations rather than a corrupt source package.
process.exit(failed === 3 ? 0 : 1);
