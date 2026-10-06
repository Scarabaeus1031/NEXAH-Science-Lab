#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function load(relativePath) {
  return JSON.parse(readFileSync(join(here, relativePath), "utf8"));
}

function publicManifestErrors(manifest) {
  const errors = [];
  const entities = Array.isArray(manifest.entities) ? manifest.entities : [];
  const relations = Array.isArray(manifest.relations) ? manifest.relations : [];
  const entityIds = new Set();
  const relationIds = new Set();
  const localPathPattern = /(file:\/\/|\/Users\/|[A-Za-z]:\\)/i;

  for (const entity of entities) {
    if (entityIds.has(entity.entity_id)) errors.push(`duplicate entity_id: ${entity.entity_id}`);
    entityIds.add(entity.entity_id);
    if (entity.visibility !== "public") errors.push(`non-public entity: ${entity.entity_id}`);
    if (Object.hasOwn(entity, "internal")) errors.push(`internal block exposed: ${entity.entity_id}`);
    if (!entity.public) errors.push(`missing public block: ${entity.entity_id}`);
    if (localPathPattern.test(JSON.stringify(entity))) errors.push(`local path exposed: ${entity.entity_id}`);
    if (!["record", "release"].includes(entity.entity_type) && !(entity.controlling_record_ids?.length > 0)) {
      errors.push(`missing controlling record: ${entity.entity_id}`);
    }
  }

  for (const relation of relations) {
    if (relationIds.has(relation.relation_id)) errors.push(`duplicate relation_id: ${relation.relation_id}`);
    relationIds.add(relation.relation_id);
    if (relation.visibility !== "public") errors.push(`non-public relation: ${relation.relation_id}`);
    if (!entityIds.has(relation.source_id)) errors.push(`missing source endpoint: ${relation.relation_id}`);
    if (!entityIds.has(relation.target_id)) errors.push(`missing target endpoint: ${relation.relation_id}`);
    if (!(relation.preserves?.length > 0)) errors.push(`missing preserves: ${relation.relation_id}`);
    if (!(relation.does_not_imply?.length > 0)) errors.push(`missing does_not_imply: ${relation.relation_id}`);
    for (const evidenceId of relation.evidence_record_ids ?? []) {
      if (!entityIds.has(evidenceId)) errors.push(`missing evidence record: ${relation.relation_id} -> ${evidenceId}`);
    }
  }

  if (manifest.release_state === "released" && manifest.publication_authorized !== true) {
    errors.push("released manifest lacks publication authorization");
  }
  return errors;
}

const schemas = [
  load("navigator-entity.schema.json"),
  load("navigator-relation.schema.json"),
  load("navigator-release-receipt.schema.json"),
  load("navigator-internal-manifest.schema.json"),
  load("navigator-public-manifest.schema.json")
];
const validFixture = load("fixtures/navigator-public-manifest.valid.json");
const invalidFixture = load("fixtures/navigator-public-manifest.invalid-local-path.json");

const schemaErrors = schemas.flatMap((schema) => {
  const errors = [];
  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    errors.push(`${schema.$id ?? "unknown schema"}: unexpected JSON Schema draft`);
  }
  if (!schema.$id) errors.push("schema without $id");
  return errors;
});
const validErrors = publicManifestErrors(validFixture);
const invalidErrors = publicManifestErrors(invalidFixture);
const expectedInvalidSignals = [
  "internal block exposed",
  "local path exposed",
  "released manifest lacks publication authorization"
];
const missingInvalidSignals = expectedInvalidSignals.filter(
  (signal) => !invalidErrors.some((error) => error.includes(signal))
);
const failures = [
  ...schemaErrors,
  ...validErrors.map((error) => `valid fixture: ${error}`),
  ...missingInvalidSignals.map((signal) => `invalid fixture did not trigger: ${signal}`)
];

console.log(JSON.stringify({
  status: failures.length === 0 ? "PASS" : "FAIL",
  schemas_checked: schemas.length,
  valid_fixture_entities: validFixture.entities.length,
  valid_fixture_relations: validFixture.relations.length,
  invalid_fixture_errors_observed: invalidErrors.length,
  failures
}, null, 2));
process.exitCode = failures.length === 0 ? 0 : 1;
