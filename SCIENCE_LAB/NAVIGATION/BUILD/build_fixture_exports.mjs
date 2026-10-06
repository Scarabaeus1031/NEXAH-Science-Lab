#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const contracts = resolve(here, "../CONTRACTS");
const fixtures = join(contracts, "fixtures");

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalize(value[key])])
    );
  }
  return value;
}

function canonicalJson(value) {
  return `${JSON.stringify(canonicalize(value), null, 2)}\n`;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function load(name) {
  return JSON.parse(readFileSync(join(fixtures, name), "utf8"));
}

function sourceWithoutReceipt(manifest) {
  const source = structuredClone(manifest);
  delete source.build_receipt;
  return source;
}

function payloadOf(manifest) {
  return { entities: manifest.entities, relations: manifest.relations };
}

function receiptFor(manifest, rejectedItemsReport) {
  return {
    generated_at: manifest.generated_at,
    generator_version: "navigator-fixture-exporter-0.1.0",
    payload_sha256: sha256(canonicalJson(payloadOf(manifest))),
    rejected_items_report: rejectedItemsReport,
    schema_dialect: "https://json-schema.org/draft/2020-12/schema",
    source_manifest_sha256: sha256(canonicalJson(sourceWithoutReceipt(manifest))),
    validator_status: "PASS"
  };
}

function rejectionReasons(manifest) {
  const reasons = [];
  const serialized = JSON.stringify(manifest);
  if (manifest.release_state === "released" && manifest.publication_authorized !== true) {
    reasons.push("RELEASE_NOT_AUTHORIZED");
  }
  if (manifest.entities?.some((entity) => Object.hasOwn(entity, "internal"))) {
    reasons.push("INTERNAL_BLOCK_EXPOSED");
  }
  if (/(file:\/\/|\/Users\/|[A-Za-z]:\\)/i.test(serialized)) {
    reasons.push("LOCAL_PATH_EXPOSED");
  }
  return reasons.sort();
}

export function buildFixtureExports(outputDirectory) {
  const internalManifest = load("navigator-internal-manifest.valid.json");
  const publicManifest = load("navigator-public-manifest.valid.json");
  const invalidManifest = load("navigator-public-manifest.invalid-local-path.json");
  const rejected = rejectionReasons(invalidManifest);
  if (rejected.length !== 3) {
    throw new Error(`expected 3 public rejection reasons, observed ${rejected.length}`);
  }

  const report = {
    schema: "nexah.navigator.rejected-public-items",
    version: "1.0.0",
    generated_at: publicManifest.generated_at,
    rejected: [{
      entity_ids: invalidManifest.entities.map((entity) => entity.entity_id).sort(),
      reasons: rejected,
      source_fixture: "navigator-public-manifest.invalid-local-path.json"
    }]
  };
  const reportName = "rejected-public-items.json";
  internalManifest.build_receipt = receiptFor(internalManifest, reportName);
  publicManifest.build_receipt = receiptFor(publicManifest, reportName);

  mkdirSync(outputDirectory, { recursive: true });
  const outputs = {
    "navigator.internal.json": internalManifest,
    "navigator.public.json": publicManifest,
    [reportName]: report
  };
  const hashes = {};
  for (const [name, value] of Object.entries(outputs)) {
    const serialized = canonicalJson(value);
    writeFileSync(join(outputDirectory, name), serialized, "utf8");
    hashes[name] = sha256(serialized);
  }
  return { output_directory: resolve(outputDirectory), files: hashes };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outputDirectory = resolve(process.argv[2] ?? join(here, "fixture-dist"));
  console.log(JSON.stringify({ status: "PASS", ...buildFixtureExports(outputDirectory) }, null, 2));
}
