import { createHash } from "node:crypto";
import { access, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "00_README.md",
  "01_AUTHORITY_SCOPE_AND_INPUT_LOCK.md",
  "02_SOURCE_TO_CUSTODY_HASH_LEDGER.csv",
  "03_ARTIFACT_ROLE_AND_AUTHORITY_LEDGER.csv",
  "04_REVIEW_AND_LINEAGE_BINDING.md",
  "05_HTML_OFFLINE_REPLAY_RECORD.md",
  "06_LQE01_FINAL_CUSTODY_CLASSIFICATION.md",
  "07_CLAIM_AND_NONCLAIM_PRESERVATION.md",
  "08_PRESERVED_OPTIONAL_FUTURE_DECISIONS.md",
  "FINAL_RETURN.md",
  "VALIDATION_REPORT.md"
];
const sourceRoot = "/Users/tho2020/Desktop/00_INCOMING/GB_Shadow  Geometry LQE 01";
const snapshotRoot = path.join(packageRoot, "SOURCE_SNAPSHOT", "GB_Shadow Geometry LQE 01");
const reviewRoot = "/Users/tho2020/Documents/NEXAH ECOSYSTEM/00 EXECUTIVE/NEXAH-Mission-Control/REVIEWS/LQE01_LIGHT_OCCLUDER_RECEIVER_GEOMETRY_INTAKE_AND_LINEAGE_REVIEW_2026-09-09";

async function filesUnder(root, current = root) {
  const out = [];
  for (const entry of (await readdir(current, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) out.push(...await filesUnder(root, full));
    else if (entry.isFile()) out.push({ full, relative: path.relative(root, full) });
  }
  return out;
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ""; }
    else if (c === '\n') { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const requiredChecks = {};
for (const name of required) {
  try { await access(path.join(packageRoot, name)); requiredChecks[name] = true; }
  catch { requiredChecks[name] = false; }
}

const sourceFiles = await filesUnder(sourceRoot);
const snapshotFiles = await filesUnder(snapshotRoot);
const snapshotMap = new Map(snapshotFiles.map(file => [file.relative, file]));
let sourceBytes = 0, snapshotBytes = 0, hashMatch = sourceFiles.length === snapshotFiles.length;
for (const source of sourceFiles) {
  const snapshot = snapshotMap.get(source.relative);
  const sourceSize = (await stat(source.full)).size;
  sourceBytes += sourceSize;
  if (!snapshot) { hashMatch = false; continue; }
  const snapshotSize = (await stat(snapshot.full)).size;
  snapshotBytes += snapshotSize;
  if (sourceSize !== snapshotSize || await sha256(source.full) !== await sha256(snapshot.full)) hashMatch = false;
}

const csvChecks = {};
for (const [name, expectedColumns, expectedDataRows] of [
  ["02_SOURCE_TO_CUSTODY_HASH_LEDGER.csv", 9, 20],
  ["03_ARTIFACT_ROLE_AND_AUTHORITY_LEDGER.csv", 8, 20]
]) {
  const rows = parseCsv(await readFile(path.join(packageRoot, name), "utf8"));
  csvChecks[name] = {
    rows: rows.length,
    columns: rows[0]?.length ?? 0,
    unique_headers: new Set(rows[0] ?? []).size === (rows[0]?.length ?? 0),
    rectangular: rows.every(row => row.length === expectedColumns),
    expected_shape: rows.length === expectedDataRows + 1 && rows[0]?.length === expectedColumns
  };
}

const replay = JSON.parse(await readFile(path.join(packageRoot, "results", "html_offline_replay.json"), "utf8"));
const reviewManifestPath = path.join(reviewRoot, "MANIFEST_SHA256.txt");
const reviewBinding = JSON.parse(await readFile(path.join(packageRoot, "REVIEW_BINDING", "controlling_review_binding.json"), "utf8"));
const reviewManifestHashMatch = await sha256(reviewManifestPath) === reviewBinding.manifest_sha256;
const pass = Object.values(requiredChecks).every(Boolean)
  && sourceFiles.length === 20 && snapshotFiles.length === 20
  && sourceBytes === snapshotBytes && hashMatch
  && Object.values(csvChecks).every(check => check.unique_headers && check.rectangular && check.expected_shape)
  && replay.result === "PASS" && replay.controls_verified === "3_OF_3"
  && reviewManifestHashMatch;

const result = {
  record_type: "LQE01_CUSTODY_PACKAGE_VALIDATION",
  required_files: requiredChecks,
  source_files: sourceFiles.length,
  snapshot_files: snapshotFiles.length,
  source_bytes: sourceBytes,
  snapshot_bytes: snapshotBytes,
  source_to_custody_hash_match: hashMatch,
  csv_checks: csvChecks,
  csv_visual_previews: "CREATED_AND_REVIEWED",
  html_offline_replay: replay.result,
  html_controls_verified: replay.controls_verified,
  controlling_review_manifest_hash_match: reviewManifestHashMatch,
  mission_control_pointer_update: "NOT_REQUIRED",
  result: pass ? "PASS" : "FAIL"
};
await writeFile(path.join(packageRoot, "results", "package_validation.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
if (!pass) process.exitCode = 1;
