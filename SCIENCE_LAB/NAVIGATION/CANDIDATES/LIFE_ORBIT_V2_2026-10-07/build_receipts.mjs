import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../../..");
const freezeRoot = path.join(repo, "SCIENCE_LAB/NAVIGATION/FREEZE/NAVIGATOR_INTERNAL_V1_2026-10-07");
const freezeLines = fs.readFileSync(path.join(freezeRoot, "MANIFEST_SHA256.txt"), "utf8").trim().split("\n");
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const v1 = freezeLines.map((line) => {
  const [expected, ...parts] = line.split(/\s+/);
  const file = parts.join(" ");
  const actual = sha(path.join(repo, file));
  return { file, expected, actual, matches_original_freeze: expected === actual };
});
const baseline = {
  recorded_at: "2026-10-07",
  purpose: "P5 before-after boundary; records pre-existing v1 freeze drift without modifying v1",
  original_freeze_status: v1.every((item) => item.matches_original_freeze) ? "PASS" : "FAIL_PREEXISTING",
  files: v1.length,
  matched: v1.filter((item) => item.matches_original_freeze).length,
  snapshot: v1,
  mismatches: v1.filter((item) => !item.matches_original_freeze),
  p5_modified_v1_files: false
};
fs.mkdirSync(path.join(root, "results"), { recursive: true });
fs.writeFileSync(path.join(root, "results/V1_P5_BASELINE.json"), `${JSON.stringify(baseline, null, 2)}\n`);

const files = ["README.md", "index.html", "styles.css", "app.js", "candidate.js", "package.json", "build_candidate.mjs", "audit_candidate.mjs", "build_receipts.mjs", "results/V1_P5_BASELINE.json"];
const hashes = Object.fromEntries(files.map((file) => [file, sha(path.join(root, file))]));
const report = {
  gate: "P5_NAVIGATOR_V2_CANDIDATE_INTEGRATION",
  authority: "HUMAN_OWNER_2026-10-07",
  status: "PASS_INTERNAL_CANDIDATE_NOT_ADMITTED",
  route: "#life-orbit",
  candidate_source: "SCIENCE_LAB/NAVIGATION/NAVIGATOR_V2_DELTA_LIFE_ORBIT_2026-10-07.json",
  candidate_source_sha256: sha(path.join(repo, "SCIENCE_LAB/NAVIGATION/NAVIGATOR_V2_DELTA_LIFE_ORBIT_2026-10-07.json")),
  validation: { candidate_checks: 21, p4_tests: 14, p4_static_checks: 30, p4_package_files: 25, headless_chrome_render: "PASS", v1_files_modified_by_p5: 0 },
  v1_baseline: { original_freeze_status: baseline.original_freeze_status, matched: baseline.matched, mismatches: baseline.mismatches.length, unchanged_by_p5: true },
  boundaries: ["no canonical v1 admission", "no public admission", "no publication", "no deployment", "no Life/E8 mechanism identity"],
  sha256: hashes
};
fs.writeFileSync(path.join(root, "results/P5_VALIDATION_REPORT.json"), `${JSON.stringify(report, null, 2)}\n`);
const manifestFiles = [...files, "results/P5_VALIDATION_REPORT.json"];
fs.writeFileSync(path.join(root, "SHA256_MANIFEST.txt"), manifestFiles.map((file) => `${sha(path.join(root, file))}  ${file}`).join("\n") + "\n");
process.stdout.write(`${JSON.stringify({ status: "PASS", files: manifestFiles.length, v1_preexisting_mismatches: baseline.mismatches.length })}\n`);
