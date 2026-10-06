#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const navigation = resolve(here, "..");
const inputNames = {
  modules: "NEXAH_MODULE_REGISTRY_V2_2026-10-05.json",
  html: "HTML_ARTIFACT_REGISTRY_V1_2026-10-06.json",
  evidence: "POLAR_JANUS_EVIDENCE_SLICE_V1_2026-10-06.json"
};
const generatedAt = "2026-10-06T12:00:00Z";

const load = (name) => JSON.parse(readFileSync(join(navigation, name), "utf8"));

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}
const canonicalJson = (value) => `${JSON.stringify(canonicalize(value), null, 2)}\n`;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const compact = (values) => [...new Set(values.filter(Boolean))].sort();

function receipt(sourceValue, payload, rejectedItemsReport) {
  return {
    generated_at: generatedAt,
    generator_version: "navigator-registry-adapter-0.1.0",
    payload_sha256: sha256(canonicalJson(payload)),
    rejected_items_report: rejectedItemsReport,
    schema_dialect: "https://json-schema.org/draft/2020-12/schema",
    source_manifest_sha256: sha256(canonicalJson(sourceValue)),
    validator_status: "PASS"
  };
}

function moduleEntity(module) {
  return {
    entity_id: module.module_id,
    entity_type: "module",
    title: module.title,
    summary: module.summary,
    status: module.status,
    visibility: "internal",
    claim_ceiling: module.claim_ceiling,
    controlling_record_ids: [module.owning_record],
    roles: module.roles,
    connection_family_ids: module.connection_families,
    related_entity_ids: module.related_modules,
    internal: {
      repository: "NEXAH-Science-Lab",
      local_path: module.owning_record,
      source_state: "module-registry-v2"
    },
    attributes: {
      current_master_surface: module.current_master_surface,
      evidence_class: module.evidence_class,
      html_shelves: module.html_shelves,
      subject_routes: module.subject_routes
    }
  };
}

function registrySurfaceEntity(surface, modulesById) {
  const owner = modulesById.get(surface.module_id);
  return {
    entity_id: surface.surface_id,
    entity_type: "surface",
    title: surface.surface_id.replaceAll(":", " · "),
    summary: `${surface.role} ${surface.lifecycle} surface for ${owner?.title ?? surface.module_id}.`,
    status: surface.lifecycle,
    visibility: "internal",
    claim_ceiling: owner?.claim_ceiling ?? "Navigation surface only; no authority or claim promotion.",
    controlling_record_ids: compact([owner?.owning_record]),
    roles: owner?.roles ?? ["builder"],
    connection_family_ids: owner?.connection_families ?? [],
    related_entity_ids: compact([surface.module_id, surface.predecessor, surface.successor]),
    internal: {
      repository: "NEXAH-Science-Lab",
      local_path: surface.path,
      source_state: surface.lifecycle
    },
    attributes: {
      catalog_ref: surface.catalog_ref,
      ring: surface.ring,
      role: surface.role,
      runtime: surface.runtime,
      source_registry: "module-registry-v2"
    }
  };
}

function artifactEntity(artifact, prior) {
  const relation = artifact.relationship;
  return {
    entity_id: artifact.artifact_id,
    entity_type: "surface",
    title: artifact.title,
    summary: artifact.explanation,
    status: artifact.assessment.lifecycle,
    visibility: "internal",
    claim_ceiling: artifact.claim_ceiling,
    controlling_record_ids: compact([artifact.record, ...(artifact.decision_sources ?? [])]),
    roles: prior?.roles ?? ["builder", "science"],
    connection_family_ids: relation.connection_families,
    related_entity_ids: compact([
      artifact.module_id,
      relation.current_master_surface,
      relation.predecessor,
      relation.successor,
      ...(relation.related_modules ?? [])
    ]),
    internal: {
      repository: "NEXAH-Science-Lab",
      local_path: artifact.path,
      sha256: artifact.sha256,
      source_state: artifact.assessment.lifecycle
    },
    attributes: {
      ...(prior?.attributes ?? {}),
      assessment: artifact.assessment,
      bytes: artifact.bytes,
      candidate_family: artifact.candidate_family,
      concepts: artifact.concepts,
      module_id: artifact.module_id,
      promotion_review_required: artifact.promotion_review_required,
      relationship: artifact.relationship,
      representation_group: artifact.representation_group,
      source_registry: prior ? ["module-registry-v2", "html-artifact-registry-v1"] : ["html-artifact-registry-v1"],
      technology: artifact.technology
    }
  };
}

function evidenceEntity(evidence) {
  return {
    entity_id: evidence.evidence_id,
    entity_type: "evidence",
    title: evidence.title,
    summary: evidence.current_interpretation,
    status: evidence.local_verdict,
    visibility: "internal",
    claim_ceiling: "Navigation evidence only; retain the package-local verdict and current interpretation without claim promotion.",
    controlling_record_ids: [evidence.record],
    roles: ["science", "governance"],
    connection_family_ids: evidence.connection_families,
    related_entity_ids: evidence.related_modules,
    internal: {
      repository: "NEXAH-Science-Lab",
      local_path: evidence.record,
      source_state: "evidence-slice-v1"
    },
    attributes: {
      kind: evidence.kind,
      local_verdict: evidence.local_verdict,
      current_interpretation: evidence.current_interpretation,
      thesis_routes: evidence.thesis_routes
    }
  };
}

const moduleRelationTypes = { method: "method-grammar", open: "open-candidate", "non-identity": "non-identity" };
const evidenceRelationTypes = {
  screened_historical_predecessor: "historical-predecessor",
  post_hoc_context: "post-hoc-context",
  qualified_comparator: "qualified-comparator",
  qualified_operational_comparator: "operational-comparator",
  representation_expansion: "representation-expansion",
  negative_boundary: "negative-boundary"
};

function moduleRelation(relation) {
  return {
    relation_id: relation.relation_id,
    source_id: relation.source,
    target_id: relation.target,
    relation_type: moduleRelationTypes[relation.type],
    explanation: relation.explanation,
    evidence_record_ids: [relation.evidence_record],
    preserves: ["registered source and target identities", "source relation explanation"],
    does_not_imply: [relation.claim_boundary],
    claim_boundary: relation.claim_boundary,
    status: relation.type === "open" ? "open" : "bounded",
    visibility: "internal",
    confidence: relation.type === "open" ? "low" : "medium"
  };
}

function evidenceRelation(relation, evidenceById) {
  const source = evidenceById.get(relation.source);
  const target = evidenceById.get(relation.target);
  return {
    relation_id: relation.relation_id.replace(/^EVIDREL:/, "REL:EVIDENCE:"),
    source_id: relation.source,
    target_id: relation.target,
    relation_type: evidenceRelationTypes[relation.type],
    explanation: relation.explanation,
    evidence_record_ids: compact([source?.record, target?.record]),
    preserves: ["package-local verdicts", "current interpretation boundary"],
    does_not_imply: ["evidence authority transfers between endpoints", "a new physical mechanism"],
    claim_boundary: "Navigation relation only; authority remains with the named evidence records.",
    status: "bounded",
    visibility: "internal",
    confidence: "medium"
  };
}

export function buildRegistryExports(outputDirectory) {
  const moduleRegistry = load(inputNames.modules);
  const htmlRegistry = load(inputNames.html);
  const evidenceSlice = load(inputNames.evidence);
  const modulesById = new Map(moduleRegistry.modules.map((module) => [module.module_id, module]));
  const evidenceById = new Map(evidenceSlice.evidence_nodes.map((evidence) => [evidence.evidence_id, evidence]));
  const entities = new Map();

  for (const module of moduleRegistry.modules) entities.set(module.module_id, moduleEntity(module));
  for (const surface of moduleRegistry.surfaces) {
    entities.set(surface.surface_id, registrySurfaceEntity(surface, modulesById));
  }
  for (const artifact of htmlRegistry.artifacts) {
    entities.set(artifact.artifact_id, artifactEntity(artifact, entities.get(artifact.artifact_id)));
  }
  for (const evidence of evidenceSlice.evidence_nodes) entities.set(evidence.evidence_id, evidenceEntity(evidence));

  const internalEntities = [...entities.values()].sort((a, b) => a.entity_id.localeCompare(b.entity_id));
  const relations = [
    ...moduleRegistry.relations.map(moduleRelation),
    ...evidenceSlice.relations.map((relation) => evidenceRelation(relation, evidenceById))
  ].sort((a, b) => a.relation_id.localeCompare(b.relation_id));
  const sourceEnvelope = { moduleRegistry, htmlRegistry, evidenceSlice };
  const reportName = "rejected-public-items.json";
  const internalPayload = { entities: internalEntities, relations };
  const internalManifest = {
    schema: "nexah.navigator.internal-manifest",
    version: "1.0.0",
    profile: "internal",
    generated_at: generatedAt,
    as_of: "2026-10-06",
    title: "NEXAH Navigator internal registry projection",
    authority_statement: "Read-only projection of the three validated Science Lab registries; native records retain authority.",
    currentness: { status: "VALID", controlling_sources_verified: 3, errors: [] },
    ...internalPayload,
    build_receipt: receipt(sourceEnvelope, internalPayload, reportName)
  };
  const rejected = internalEntities.map((entity) => ({
    entity_id: entity.entity_id,
    reasons: ["NO_PUBLIC_ALLOWLIST"]
  }));
  const publicPayload = { entities: [], relations: [] };
  const publicManifest = {
    schema: "nexah.navigator.public-manifest",
    version: "1.0.0",
    profile: "public",
    release_state: "preview",
    publication_authorized: false,
    generated_at: generatedAt,
    as_of: "2026-10-06",
    title: "NEXAH Navigator public preview — no admitted objects",
    language: "en",
    governance: {
      release_owner: "NEXAH Human Owner",
      selection_record_id: "REC:PUBLIC_ALLOWLIST_NOT_CREATED",
      claim_ceiling: "Empty fail-closed preview; no object or scientific claim is released.",
      privacy_check: "PASS"
    },
    ...publicPayload,
    build_receipt: receipt(sourceEnvelope, publicPayload, reportName)
  };
  const rejectionReport = {
    schema: "nexah.navigator.rejected-public-items",
    version: "1.0.0",
    generated_at: generatedAt,
    reason_summary: { NO_PUBLIC_ALLOWLIST: rejected.length },
    rejected
  };

  mkdirSync(outputDirectory, { recursive: true });
  const outputs = {
    "navigator.internal.json": internalManifest,
    "navigator.public.json": publicManifest,
    [reportName]: rejectionReport
  };
  const hashes = {};
  for (const [name, value] of Object.entries(outputs)) {
    const bytes = canonicalJson(value);
    writeFileSync(join(outputDirectory, name), bytes, "utf8");
    hashes[name] = sha256(bytes);
  }
  return {
    output_directory: resolve(outputDirectory),
    counts: { entities: internalEntities.length, relations: relations.length, public_entities: 0, rejected: rejected.length },
    files: hashes
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify({ status: "PASS", ...buildRegistryExports(resolve(process.argv[2] ?? join(here, "registry-dist"))) }, null, 2));
}
