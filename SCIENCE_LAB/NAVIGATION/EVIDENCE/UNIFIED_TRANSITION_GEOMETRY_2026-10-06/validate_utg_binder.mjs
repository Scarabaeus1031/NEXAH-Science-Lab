#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const binder = JSON.parse(fs.readFileSync(path.join(here, "UTG_FRAMEWORK_BINDER_V1_2026-10-06.json"), "utf8"));
const errors = [];
const unique = (items, label) => {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item)) errors.push(`duplicate ${label}: ${item}`);
    seen.add(item);
  }
  return seen;
};

const visualIds = unique(binder.visuals.map((item) => item.visual_id), "visual_id");
const maturityIds = unique(binder.maturity_levels.map((item) => item.level_id), "maturity level");
unique(binder.media_constellations.map((item) => item.constellation_id), "constellation_id");
const candidateIds = unique((binder.formal_candidates || []).map((item) => item.candidate_id), "formal candidate");

for (const visual of binder.visuals) {
  const filePath = path.resolve(repoRoot, visual.file);
  if (!filePath.startsWith(repoRoot + path.sep)) errors.push(`visual escapes repository: ${visual.visual_id}`);
  if (!fs.existsSync(filePath)) {
    errors.push(`missing visual: ${visual.visual_id}`);
    continue;
  }
  const digest = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  if (digest !== visual.sha256) errors.push(`hash mismatch: ${visual.visual_id}`);
  if (!maturityIds.has(visual.maturity)) errors.push(`unknown maturity ${visual.maturity} on ${visual.visual_id}`);
}

if (binder.maturity_levels.length !== 3) errors.push("maturity ladder must have exactly three levels");
if (binder.maturity_levels[0]?.state !== "CURRENT") errors.push("Framework must be the current UTG-wide level");
if (!/NOT ESTABLISHED/.test(binder.maturity_levels[2]?.state || "")) errors.push("Validated Application must remain not established");
if (!binder.claim_boundary.includes("exploratory framework")) errors.push("claim boundary must identify UTG as exploratory framework");
for (const candidate of binder.formal_candidates || []) {
  const recordPath = path.resolve(repoRoot, candidate.record);
  if (!recordPath.startsWith(repoRoot + path.sep) || !fs.existsSync(recordPath)) errors.push(`missing formal candidate record: ${candidate.candidate_id}`);
}

const result = {
  status: errors.length ? "FAIL" : "PASS",
  visuals: visualIds.size,
  maturity_levels: maturityIds.size,
  media_constellations: binder.media_constellations.length,
  formal_candidates: candidateIds.size,
  errors
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
