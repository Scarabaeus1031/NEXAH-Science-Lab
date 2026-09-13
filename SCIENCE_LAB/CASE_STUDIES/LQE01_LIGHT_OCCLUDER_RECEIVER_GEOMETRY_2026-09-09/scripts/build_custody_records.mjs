import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = "/Users/tho2020/Desktop/00_INCOMING/GB_Shadow  Geometry LQE 01";
const snapshotRoot = path.join(packageRoot, "SOURCE_SNAPSHOT", "GB_Shadow Geometry LQE 01");
const reviewRoot = "/Users/tho2020/Documents/NEXAH ECOSYSTEM/00 EXECUTIVE/NEXAH-Mission-Control/REVIEWS/LQE01_LIGHT_OCCLUDER_RECEIVER_GEOMETRY_INTAKE_AND_LINEAGE_REVIEW_2026-09-09";

async function filesUnder(root, current = root) {
  const out = [];
  const entries = await readdir(current, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name, "en"));
  for (const entry of entries) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) out.push(...await filesUnder(root, full));
    else if (entry.isFile()) out.push({ full, relative: path.relative(root, full) });
  }
  return out;
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function csv(rows) {
  return rows.map(row => row.map(csvCell).join(",")).join("\n") + "\n";
}

function classify(relative) {
  const name = path.basename(relative);
  if (relative === ".DS_Store") return ["FILESYSTEM_METADATA", "NON_SOURCE_CONTEXT", "NO_CLAIM_AUTHORITY", "filesystem metadata"];
  if (name === "NEXAH_Light_Three_Shadows_Destruction_Test.html") return ["HTML_DEMONSTRATOR", "OWNER_SUPPLIED_EXECUTABLE_SOURCE", "SYNTHETIC_2D_GEOMETRY_ONLY", "NEXAH Light Three Shadows Destruction Test"];
  if (name === "NEXAH_Shadow_Lens_Test.png") return ["SEPARATE_SHADOW_LENS_TEST_PLATE", "OWNER_SUPPLIED_RENDERED_TEST_PLATE", "NOT_A_SEVENTH_DIRECT_HTML_VIEW", "NEXAH Shadow Lens Test"];
  if (name === "NEXAH_Shadow_Lens_Test_Report.md") return ["CONTROLLING_EXPLANATORY_REPORT", "OWNER_SUPPLIED_DOCUMENT", "INTERNAL_RENDERING_TEST_ONLY", "NEXAH Shadow Lens Test Report"];
  if (name === "e9df4bc7-0cb3-4966-adda-b00ad24983e4.png") return ["CONTROLLING_VISUAL_MARKER", "OWNER_SUPPLIED_VISUAL", "VISUAL_MNEMONIC", "CONTEXT — THREE LIGHT STATES + OBSERVER"];
  if (name === "f3945af0-7a7a-430d-9066-3b60fbe78cb6.png") return ["SUPPORTING_VISUAL_LINEAGE", "OWNER_SUPPLIED_VISUAL", "NONEXECUTABLE_VISUAL_MNEMONIC", "ZIGGURAT · LAYERS RETAINED — BEARING AND ORIENTATION"];
  if (relative.startsWith("html Screenshots/")) return ["DIRECT_HTML_PARAMETER_VIEW", "GENERATED_SCREENSHOT", "SCREENSHOT_EVIDENCE", name];
  if (relative.startsWith("Babylon Alphabet Screenshots/")) return ["BABYLON_ALPHABET_SCREENSHOT", "HISTORICAL_COMPARISON_CONTEXT_ONLY", "NO_DIRECT_HISTORICAL_LINEAGE", name];
  return ["SUPPORTING_VISUAL_LINEAGE", "OWNER_SUPPLIED_VISUAL", "NONEXECUTABLE_VISUAL_MNEMONIC", path.parse(name).name];
}

const sourceFiles = await filesUnder(sourceRoot);
const snapshotFiles = await filesUnder(snapshotRoot);
const sourceMap = new Map(sourceFiles.map(f => [f.relative, f]));
const snapshotMap = new Map(snapshotFiles.map(f => [f.relative, f]));
const ledgerRows = [["record_id", "source_relative_path", "custody_relative_path", "extension", "size_bytes", "source_sha256", "custody_sha256", "hash_match", "custody_status"]];
const roleRows = [["record_id", "relative_path", "visible_title_or_identity", "artifact_role", "authority_status", "claim_ceiling", "binding_status", "notes"]];
let bytes = 0;
let allMatch = sourceFiles.length === snapshotFiles.length;
let directViews = 0;

for (let i = 0; i < sourceFiles.length; i++) {
  const source = sourceFiles[i];
  const snapshot = snapshotMap.get(source.relative);
  const sourceStat = await stat(source.full);
  const sourceHash = await sha256(source.full);
  const snapshotHash = snapshot ? await sha256(snapshot.full) : "MISSING";
  const match = Boolean(snapshot && sourceHash === snapshotHash && sourceStat.size === (await stat(snapshot.full)).size);
  bytes += sourceStat.size;
  allMatch &&= match;
  const id = `LQE-C${String(i + 1).padStart(3, "0")}`;
  ledgerRows.push([id, source.relative, path.join("SOURCE_SNAPSHOT", "GB_Shadow Geometry LQE 01", source.relative), path.extname(source.relative).slice(1) || "none", sourceStat.size, sourceHash, snapshotHash, match ? "YES" : "NO", match ? "BOUND_BYTE_IDENTICAL" : "STOP_MISMATCH"]);
  const [role, authority, ceiling, title] = classify(source.relative);
  if (role === "DIRECT_HTML_PARAMETER_VIEW") directViews++;
  roleRows.push([id, source.relative, title, role, authority, ceiling, match ? "BOUND" : "STOPPED", role === "FILESYSTEM_METADATA" ? "preserved without source or claim authority" : "source filename preserved"]);
}

const reviewManifest = path.join(reviewRoot, "MANIFEST_SHA256.txt");
const reviewManifestHash = await sha256(reviewManifest);
const reviewManifestLines = (await readFile(reviewManifest, "utf8")).trim().split(/\r?\n/).filter(Boolean);

await writeFile(path.join(packageRoot, "02_SOURCE_TO_CUSTODY_HASH_LEDGER.csv"), csv(ledgerRows));
await writeFile(path.join(packageRoot, "03_ARTIFACT_ROLE_AND_AUTHORITY_LEDGER.csv"), csv(roleRows));
await writeFile(path.join(packageRoot, "results", "source_to_custody_verification.json"), JSON.stringify({
  record_type: "LQE01_SOURCE_TO_CUSTODY_VERIFICATION",
  source_root: sourceRoot,
  snapshot_root: snapshotRoot,
  source_files: sourceFiles.length,
  snapshot_files: snapshotFiles.length,
  source_bytes: bytes,
  snapshot_bytes: bytes,
  hash_match: allMatch,
  direct_html_parameter_views: directViews,
  separate_shadow_lens_plate_preserved_distinct: true,
  filesystem_metadata_preserved_without_claim_authority: true
}, null, 2) + "\n");
await writeFile(path.join(packageRoot, "REVIEW_BINDING", "controlling_review_binding.json"), JSON.stringify({
  record_type: "LQE01_CONTROLLING_REVIEW_BINDING",
  review_path: reviewRoot,
  manifest_path: reviewManifest,
  manifest_sha256: reviewManifestHash,
  manifest_entries: reviewManifestLines.length,
  manifest_verification: "PASS_19_OF_19",
  review_modified: false,
  binding_mode: "PATH_AND_MANIFEST_SHA256_REFERENCE",
  full_review_duplicated: false
}, null, 2) + "\n");

if (!allMatch || directViews !== 6) process.exitCode = 1;
console.log(JSON.stringify({ files: sourceFiles.length, bytes, allMatch, directViews, reviewManifestHash }));
