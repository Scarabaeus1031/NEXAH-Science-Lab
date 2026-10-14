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
const envelope = binder.envelope_framework;
const envelopeTypeIds = unique((envelope?.subtypes || []).map((item) => item.type_id), "envelope subtype");
const comparative = binder.comparative_dynamics;
const comparativeMedia = comparative?.media || [];
const comparativeMediaIds = unique(comparativeMedia.map((item) => item.media_id), "comparative media_id");
unique((comparative?.collections || []).map((item) => item.collection_id), "comparative collection_id");

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

for (const media of comparativeMedia) {
  const filePath = path.resolve(repoRoot, media.file);
  if (!filePath.startsWith(repoRoot + path.sep)) errors.push(`comparative media escapes repository: ${media.media_id}`);
  if (!fs.existsSync(filePath)) {
    errors.push(`missing comparative media: ${media.media_id}`);
    continue;
  }
  const digest = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  if (digest !== media.sha256) errors.push(`comparative media hash mismatch: ${media.media_id}`);
}

if (binder.maturity_levels.length !== 3) errors.push("maturity ladder must have exactly three levels");
if (binder.maturity_levels[0]?.state !== "CURRENT") errors.push("Framework must be the current UTG-wide level");
if (!/NOT ESTABLISHED/.test(binder.maturity_levels[2]?.state || "")) errors.push("Validated Application must remain not established");
if (!binder.claim_boundary.includes("exploratory framework")) errors.push("claim boundary must identify UTG as exploratory framework");
if (envelope?.status !== "CONTROLLED_FRAMEWORK_VOCABULARY / TRANSVERSAL_ROLE / NO_NEW_FAMILY") errors.push("Envelope must remain a transversal role and not a new family");
if (envelopeTypeIds.size !== 9) errors.push("Envelope framework must declare nine distinct subtypes");
if (!(envelope?.family_status || "").includes("not CF:F8")) errors.push("Envelope family boundary must exclude CF:F8");
if (!(envelope?.subtypes || []).find((item) => item.type_id === "ENV-STAB")?.state.includes("FORMAL CANDIDATE")) errors.push("ENV-STAB must remain a formal candidate");
const envelopeRecord = path.resolve(repoRoot, binder.controlling_records?.envelope_archaeology_and_typing || "");
if (!envelopeRecord.startsWith(repoRoot + path.sep) || !fs.existsSync(envelopeRecord)) errors.push("missing Envelope archaeology controlling record");
if (comparative?.systems?.length !== 4) errors.push("comparative dynamics must declare four carrier records");
if (comparative?.next_test?.state !== "PLANNED / NOT PREREGISTERED / NOT EXECUTED") errors.push("UTG-FORMAL-02 must remain explicitly unexecuted");
if (!comparative?.claim_boundary?.includes("do not establish")) errors.push("comparative dynamics must carry a non-equivalence boundary");
for (const collection of comparative?.collections || []) {
  for (const mediaId of collection.media_ids || []) {
    if (!comparativeMediaIds.has(mediaId)) errors.push(`unknown media ${mediaId} in ${collection.collection_id}`);
  }
}
const primaryV69Family = comparative?.v69_classification?.family_roles?.find((item) => item.primary)?.family;
if (primaryV69Family !== "CF:F4") errors.push("V69 primary family must remain CF:F4 Phase / Drift");
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
  envelope_subtypes: envelopeTypeIds.size,
  comparative_systems: comparative?.systems?.length || 0,
  comparative_media: comparativeMedia.length,
  comparative_collections: comparative?.collections?.length || 0,
  errors
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
