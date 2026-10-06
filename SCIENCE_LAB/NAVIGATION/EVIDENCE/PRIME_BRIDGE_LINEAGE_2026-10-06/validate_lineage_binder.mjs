#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const binderPath = path.join(here, "PRIME_BRIDGE_LINEAGE_BINDER_V1_2026-10-06.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
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
const assetIds = unique(binder.glb_assets.map((item) => item.asset_id), "asset_id");
const nodeIds = unique(binder.lineage_nodes.map((item) => item.node_id), "node_id");
const collectionIds = unique(binder.collections.map((item) => item.collection_id), "collection_id");

for (const visual of binder.visuals) {
  const filePath = path.resolve(repoRoot, visual.file);
  if (!filePath.startsWith(repoRoot + path.sep)) errors.push(`visual escapes repository: ${visual.visual_id}`);
  if (!fs.existsSync(filePath)) {
    errors.push(`missing visual: ${visual.visual_id}`);
    continue;
  }
  const digest = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  if (digest !== visual.sha256) errors.push(`hash mismatch: ${visual.visual_id}`);
  for (const collection of visual.collections) {
    if (!collectionIds.has(collection)) errors.push(`unknown collection ${collection} on ${visual.visual_id}`);
  }
}

for (const asset of binder.glb_assets) {
  if (asset.availability === "CURRENT_EXTERNAL_REPOSITORY") {
    if (!fs.existsSync(asset.absolute_path)) {
      errors.push(`missing current GLB: ${asset.asset_id}`);
      continue;
    }
    const digest = crypto.createHash("sha256").update(fs.readFileSync(asset.absolute_path)).digest("hex");
    if (digest !== asset.sha256) errors.push(`GLB hash mismatch: ${asset.asset_id}`);
  }
  if (asset.availability === "CENSUS_ONLY_CURRENT_PATH_MISSING" && fs.existsSync(asset.census_path)) {
    errors.push(`census-only GLB is now present and needs promotion review: ${asset.asset_id}`);
  }
}

for (const relation of binder.relations) {
  if (!nodeIds.has(relation.source)) errors.push(`unknown relation source: ${relation.source}`);
  if (!nodeIds.has(relation.target)) errors.push(`unknown relation target: ${relation.target}`);
}

const isPrime = (n) => {
  if (n < 2) return false;
  for (let divisor = 2; divisor * divisor <= n; divisor += 1) {
    if (n % divisor === 0) return false;
  }
  return true;
};
if (!isPrime(3187)) errors.push("3187 primality check failed");

const result = {
  status: errors.length ? "FAIL" : "PASS",
  visuals: visualIds.size,
  glb_assets: assetIds.size,
  lineage_nodes: nodeIds.size,
  relations: binder.relations.length,
  current_glbs_verified: binder.glb_assets.filter((item) => item.availability === "CURRENT_EXTERNAL_REPOSITORY").length,
  census_only_glbs: binder.glb_assets.filter((item) => item.availability === "CENSUS_ONLY_CURRENT_PATH_MISSING").length,
  crosspoint_3187_prime: isPrime(3187),
  errors
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
