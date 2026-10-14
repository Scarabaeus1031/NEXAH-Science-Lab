#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../../..");
const experienceCatalogPath = path.join(ecosystemRoot, "40 EXPERIENCE PRODUCTION/NEXAH-Experience/src/data/generated/publication-catalog.json");
const entityDirectory = path.join(ecosystemRoot, "10 NEXAH CORE/NEXAH/LIBRARY/registry/entities");
const conceptDirectory = path.join(ecosystemRoot, "10 NEXAH CORE/NEXAH/LIBRARY/registry/concepts");
const binderPath = path.join(here, "ORIENTATION_CATALOG_BINDER_V1_2026-10-10.json");
const appDataPath = path.resolve(here, "../../APP/orientation-catalog.internal.js");

const sourceCatalog = JSON.parse(fs.readFileSync(experienceCatalogPath, "utf8"));
if (!Array.isArray(sourceCatalog.records) || sourceCatalog.records.length !== 61) {
  throw new Error("Expected the checked-in Experience projection with exactly 61 records.");
}

const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ecosystemPath = (file) => path.relative(ecosystemRoot, file).split(path.sep).join("/");
const scalar = (text, key) => {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^['\"]|['\"]$/g, "") : "";
};
const inlineList = (text, key) => {
  const match = text.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, "m"));
  return match ? match[1].split(",").map((item) => item.trim().replace(/^['\"]|['\"]$/g, "")).filter(Boolean) : [];
};
const compact = (value, max = 380) => {
  const text = String(value || "").replace(/\\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
};

const featuredKeys = [
  "arena:5416617",
  "arena:5415716",
  "arena:5415690",
  "arena:5309625",
  "arena:5250350",
  "arena:5442781",
  "arena:5391199",
  "arena:5442697",
  "arena:5393574",
  "arena:5217666",
  "arena:5201307",
  "arena:5426957"
];

const records = sourceCatalog.records.map((record) => ({
  catalog_key: record.catalogKey,
  registered_work_id: record.registeredEntityId || null,
  title: record.title,
  slug: record.slug,
  type: record.type,
  form: record.form,
  series: record.series || null,
  shelves: record.shelves || [],
  summary: compact(record.description),
  source_url: record.sourceUrl,
  publication_status: record.publicationStatus,
  revision_state: record.revisionState,
  content_maturity: record.contentMaturity,
  classification_state: record.classificationState,
  featured_orientation_selection: featuredKeys.includes(record.catalogKey)
}));

const registeredWorks = records.filter((record) => record.registered_work_id).map((record) => {
  const file = path.join(entityDirectory, `${record.registered_work_id}.yaml`);
  const text = fs.readFileSync(file, "utf8");
  return {
    work_id: record.registered_work_id,
    catalog_key: record.catalog_key,
    title: scalar(text, "canonical_title") || record.title,
    form: scalar(text, "form") || record.form,
    current_edition: scalar(text, "current_edition") || null,
    summary: scalar(text, "summary") || record.summary,
    concept_ids: inlineList(text, "core_operator_refs"),
    source: { ecosystem_path: ecosystemPath(file), sha256: sha256(file) }
  };
}).sort((a, b) => a.work_id.localeCompare(b.work_id));

const conceptIds = fs.readdirSync(conceptDirectory)
  .filter((name) => /^NX-OP-\d{4}\.yaml$/.test(name))
  .map((name) => name.replace(/\.yaml$/, ""))
  .sort();
const concepts = conceptIds.map((conceptId) => {
  const file = path.join(conceptDirectory, `${conceptId}.yaml`);
  const text = fs.readFileSync(file, "utf8");
  return {
    concept_id: conceptId,
    label: scalar(text, "preferred_name"),
    definition: scalar(text, "definition"),
    vocabulary_status: scalar(text, "vocabulary_status"),
    source: { ecosystem_path: ecosystemPath(file), sha256: sha256(file) }
  };
});

const navigatorPointers = [
  ["arena:5416617", "contextualizes", "#findings-frontiers", "Orientation Science is an editorial prospectus, not the Science Lab evidence synthesis."],
  ["arena:5415716", "introduces", "#atlas", "The atlas provides an editorial map; it does not create Navigator relations."],
  ["arena:5415690", "contextualizes", "#about", "Orientation Design describes practice and framing, not a scientific admission or implementation contract."],
  ["arena:5309625", "contextualizes", "#a0-orientation-evidence", "Orientation Theory is a proposed publication record and does not strengthen A0 evidence."],
  ["arena:5250350", "illustrates", "#families", "The book's architecture is not identical to the seven governed Connection Families."],
  ["arena:5442781", "contextualizes", "#lineage", "Geometria Nova supplies editorial and historical context; visual recurrence is not scientific validation."],
  ["arena:5391199", "editorial-companion-of", "#a0-orientation-evidence", "The handbook's operations are editorial vocabulary, not executable ORION operators or experiment results."],
  ["arena:5442697", "introduces", "#glossary", "The Operator Library is a reference work and does not amend controlled Navigator vocabulary."],
  ["arena:5217666", "illustrates", "#utg", "Operational geometry imagery does not establish the UTG framework or its scientific claims."],
  ["arena:5201307", "contextualizes", "#observatory", "Observer geometry is an exploratory atlas, not Observatory evidence."],
  ["arena:5426957", "editorial-companion-of", "#a0-orientation-evidence", "Operators of Orientation is a reading theme, not a one-to-one map to T1–T7 or the twelve-stage working crosswalk."]
].map(([catalog_key, relation_type, target_route, claim_boundary], index) => ({
  pointer_id: `OC:P${String(index + 1).padStart(2, "0")}`,
  catalog_key,
  relation_type,
  target_route,
  claim_boundary
}));

const binder = {
  schema: "nexah.navigator.orientation-catalog-lens/1.0.0",
  binder_id: "NEXAH:ORIENTATION_CATALOG_LENS:V1",
  date: "2026-10-10",
  status: "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS",
  route: "#orientation-catalog",
  title: "Orientation Catalog",
  summary: "A read-only Navigator lens over the existing Experience Publication Catalog, enriched only with stable NEXAH Library Work and Concept references plus bounded editorial pointers into the Science Navigator.",
  source_authority: "NEXAH Experience owns public presentation; NEXAH Core Library owns registered Work and Concept identities; source repositories retain content and evidence authority.",
  claim_ceiling: "Catalog presence, editorial selection, shared vocabulary or a Navigator pointer is not a Connection Family, scientific relation, evidence claim, executable operator, research admission or publication authorization.",
  changes_canonical_registry_counts: false,
  changes_canonical_family_count: false,
  publication_authorized: false,
  source_catalog: {
    ecosystem_path: ecosystemPath(experienceCatalogPath),
    sha256: sha256(experienceCatalogPath),
    schema_version: sourceCatalog.schemaVersion,
    projection_type: sourceCatalog.projectionType,
    record_count: sourceCatalog.records.length
  },
  source_boundaries: [
    "The Experience catalog is projected, not copied into a second authoritative database.",
    "Only records with registeredEntityId reuse an NX Work identity; arena-only records remain catalog-only.",
    "NX-OP records are NEXAH Library concepts. They are not ORION executable operators.",
    "Editorial series, shelves and doors are not Science Navigator Connection Families.",
    "Navigator pointers are curated reading routes and are not added to canonical relation counts."
  ],
  featured_keys: featuredKeys,
  records,
  registered_works: registeredWorks,
  concepts,
  navigator_pointers: navigatorPointers
};

fs.writeFileSync(binderPath, `${JSON.stringify(binder, null, 2)}\n`);
fs.writeFileSync(appDataPath, `window.NEXAH_ORIENTATION_CATALOG = ${JSON.stringify(binder)};\n`);
console.log(JSON.stringify({ status: "PASS", records: records.length, featured: featuredKeys.length, registered_works: registeredWorks.length, concepts: concepts.length, pointers: navigatorPointers.length, binder: binderPath, app_data: appDataPath }, null, 2));

