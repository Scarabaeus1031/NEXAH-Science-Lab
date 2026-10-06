#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const here = __dirname;
const load = (relativePath) => JSON.parse(
  fs.readFileSync(path.join(here, relativePath), "utf8")
);

const entitySchema = load("navigator-entity.schema.json");
const relationSchema = load("navigator-relation.schema.json");
const releaseReceiptSchema = load("navigator-release-receipt.schema.json");
const internalManifestSchema = load("navigator-internal-manifest.schema.json");
const manifestSchema = load("navigator-public-manifest.schema.json");
const internalFixture = load("fixtures/navigator-internal-manifest.valid.json");
const validFixture = load("fixtures/navigator-public-manifest.valid.json");
const invalidFixture = load("fixtures/navigator-public-manifest.invalid-local-path.json");
const buildDirectory = path.resolve(here, "../BUILD/fixture-dist");
const registryBuildDirectory = path.resolve(here, "../BUILD/registry-dist");

const ajv = new Ajv2020({ allErrors: true, strict: true, validateSchema: true });
addFormats(ajv);
ajv.addSchema(entitySchema);
ajv.addSchema(relationSchema);
ajv.addSchema(releaseReceiptSchema);
const validateInternalManifest = ajv.compile(internalManifestSchema);
const validateManifest = ajv.compile(manifestSchema);

const internalAccepted = validateInternalManifest(internalFixture);
const internalErrors = internalAccepted ? [] : validateInternalManifest.errors;
const validAccepted = validateManifest(validFixture);
const validErrors = validAccepted ? [] : validateManifest.errors;
const invalidAccepted = validateManifest(invalidFixture);
const invalidErrors = invalidAccepted ? [] : validateManifest.errors;
const builtInternalPath = path.join(buildDirectory, "navigator.internal.json");
const builtPublicPath = path.join(buildDirectory, "navigator.public.json");
const builtInternal = fs.existsSync(builtInternalPath)
  ? JSON.parse(fs.readFileSync(builtInternalPath, "utf8"))
  : null;
const builtPublic = fs.existsSync(builtPublicPath)
  ? JSON.parse(fs.readFileSync(builtPublicPath, "utf8"))
  : null;
const builtInternalAccepted = builtInternal ? validateInternalManifest(builtInternal) : null;
const builtInternalErrors = builtInternalAccepted === false ? validateInternalManifest.errors : [];
const builtPublicAccepted = builtPublic ? validateManifest(builtPublic) : null;
const builtPublicErrors = builtPublicAccepted === false ? validateManifest.errors : [];
const registryInternalPath = path.join(registryBuildDirectory, "navigator.internal.json");
const registryPublicPath = path.join(registryBuildDirectory, "navigator.public.json");
const registryInternal = fs.existsSync(registryInternalPath)
  ? JSON.parse(fs.readFileSync(registryInternalPath, "utf8"))
  : null;
const registryPublic = fs.existsSync(registryPublicPath)
  ? JSON.parse(fs.readFileSync(registryPublicPath, "utf8"))
  : null;
const registryInternalAccepted = registryInternal ? validateInternalManifest(registryInternal) : null;
const registryInternalErrors = registryInternalAccepted === false ? validateInternalManifest.errors : [];
const registryPublicAccepted = registryPublic ? validateManifest(registryPublic) : null;
const registryPublicErrors = registryPublicAccepted === false ? validateManifest.errors : [];
const requiredInvalidKeywords = ["not", "const"];
const observedInvalidKeywords = new Set(invalidErrors.map((error) => error.keyword));
const missingInvalidKeywords = requiredInvalidKeywords.filter(
  (keyword) => !observedInvalidKeywords.has(keyword)
);

const failures = [];
if (!internalAccepted) failures.push({ internal_fixture_rejected: internalErrors });
if (!validAccepted) failures.push({ valid_fixture_rejected: validErrors });
if (invalidAccepted) failures.push({ invalid_fixture_accepted: true });
if (builtInternalAccepted === false) failures.push({ built_internal_rejected: builtInternalErrors });
if (builtPublicAccepted === false) failures.push({ built_public_rejected: builtPublicErrors });
if (registryInternalAccepted === false) failures.push({ registry_internal_rejected: registryInternalErrors });
if (registryPublicAccepted === false) failures.push({ registry_public_rejected: registryPublicErrors });
if (missingInvalidKeywords.length) failures.push({ missing_invalid_keywords: missingInvalidKeywords });

const result = {
  status: failures.length === 0 ? "PASS" : "FAIL",
  dialect: manifestSchema.$schema,
  schemas_compiled: 5,
  refs_resolved: [entitySchema.$id, relationSchema.$id, releaseReceiptSchema.$id],
  formats_enabled: true,
  internal_fixture_accepted: internalAccepted,
  valid_fixture_accepted: validAccepted,
  invalid_fixture_accepted: invalidAccepted,
  built_internal_accepted: builtInternalAccepted,
  built_public_accepted: builtPublicAccepted,
  registry_internal_accepted: registryInternalAccepted,
  registry_public_accepted: registryPublicAccepted,
  invalid_error_keywords: [...observedInvalidKeywords].sort(),
  failures
};

console.log(JSON.stringify(result, null, 2));
process.exitCode = failures.length === 0 ? 0 : 1;
