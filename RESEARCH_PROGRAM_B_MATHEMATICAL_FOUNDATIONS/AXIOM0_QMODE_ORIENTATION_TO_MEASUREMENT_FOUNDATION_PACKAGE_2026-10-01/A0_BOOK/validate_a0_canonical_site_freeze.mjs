import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(root);
const manifest = JSON.parse(fs.readFileSync(path.join(root, "A0_CANONICAL_SITE_FREEZE_MANIFEST.json"), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

check(manifest.freeze_id === "A0_CANONICAL_SITE_FREEZE_2026-10-29", "unexpected freeze id");
check(manifest.canonical_entry === "A0_BOOK/index.html#top", "canonical entry changed");
check(manifest.alternate_authoritative_editions === 0, "alternate authoritative edition admitted");
check(manifest.version_policy?.maintain_in_place === true, "maintain-in-place policy missing");
check(manifest.version_policy?.parallel_a0_editions_allowed === false, "parallel A0 editions allowed");
check(manifest.version_policy?.ordinary_changes_create_new_version === false, "ordinary changes mint a new A0 version");
check(manifest.version_policy?.replacement_freeze_requires_explicit_human_owner_decision === true, "replacement freeze lacks explicit Human Owner gate");

const canonical = fs.readFileSync(path.join(root, "index.html"), "utf8");
check(canonical.includes('<link rel="canonical" href="index.html">'), "canonical link missing");
check(canonical.includes('name="nexah:a0-authority" content="CANONICAL_SOURCE"'), "canonical authority marker missing");

const alias = fs.readFileSync(path.join(packageRoot, "A0", "index.html"), "utf8");
check(alias.includes("new URL('../A0_BOOK/index.html'"), "short A0 alias no longer returns to canonical entry");
check(alias.includes("destination.hash = location.hash || '#top'"), "short A0 alias default is not #top");
check(!alias.includes("A0_BENCH_ENTDECKEN.html"), "short A0 alias still owns a competing subpage entry");
check(sha256(path.join(packageRoot, "A0", "index.html")) === manifest.short_alias_sha256, "short A0 alias hash mismatch");

const ecosystemRoot = path.resolve(root, "../../../../../");
const portalProjection = (channel) => path.join(
  ecosystemRoot,
  "00 EXECUTIVE/NEXAH-Mission-Control/OWNER_READ_PORTAL",
  channel,
  "30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/A0_BOOK/index.html"
);
check(!fs.existsSync(portalProjection("staging")), "staging projection became a competing A0 entry");
check(!fs.existsSync(portalProjection("release")), "release projection became a competing A0 entry");

for (const [relative, expected] of Object.entries(manifest.sha256)) {
  const file = path.join(root, relative);
  check(fs.existsSync(file), `frozen file missing: ${relative}`);
  if (fs.existsSync(file)) check(sha256(file) === expected, `hash mismatch: ${relative}`);
}

const result = {
  status: failures.length ? "FAIL" : "PASS",
  freeze_id: manifest.freeze_id,
  canonical_entry: manifest.canonical_entry,
  alternate_authoritative_editions: manifest.alternate_authoritative_editions,
  checks: 15 + Object.keys(manifest.sha256).length,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
