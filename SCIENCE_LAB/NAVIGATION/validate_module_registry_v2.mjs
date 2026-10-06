#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, '..', '..');
const registryPath = path.join(here, 'NEXAH_MODULE_REGISTRY_V2_2026-10-05.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const catalogPath = path.resolve(repositoryRoot, registry.catalog_snapshot);
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const errors = [];
const warnings = [];
const moduleIds = new Set();
const surfaceIds = new Set();
const relationIds = new Set();
const catalogEntries = new Map(catalog.entries.map((entry) => [entry.path, entry]));

function requireUnique(id, set, label) {
  if (!id) errors.push(`${label} has no id`);
  else if (set.has(id)) errors.push(`duplicate ${label} id: ${id}`);
  else set.add(id);
}

function requirePath(relativePath, label) {
  if (!relativePath) {
    errors.push(`${label} has no path`);
    return;
  }
  const absolute = path.resolve(repositoryRoot, relativePath);
  if (!absolute.startsWith(repositoryRoot + path.sep)) {
    errors.push(`${label} escapes repository root: ${relativePath}`);
  } else if (!fs.existsSync(absolute)) {
    errors.push(`${label} path missing: ${relativePath}`);
  }
}

for (const module of registry.modules) {
  requireUnique(module.module_id, moduleIds, 'module');
  if (!module.module_id?.startsWith('MOD:')) {
    errors.push(`module id is not namespaced MOD: ${module.module_id}`);
  }
  requirePath(module.owning_record, `${module.module_id} owning_record`);
  if (!module.claim_ceiling) errors.push(`${module.module_id} has no claim_ceiling`);
  for (const family of module.connection_families ?? []) {
    if (!registry.taxonomies.CF.items[family]) {
      errors.push(`${module.module_id} uses unknown connection family ${family}`);
    }
  }
  for (const shelf of module.html_shelves ?? []) {
    if (!registry.taxonomies.HL.items[shelf]) {
      errors.push(`${module.module_id} uses unknown HTML shelf ${shelf}`);
    }
  }
}

for (const surface of registry.surfaces) {
  requireUnique(surface.surface_id, surfaceIds, 'surface');
  if (!surface.surface_id?.startsWith('ART:')) {
    errors.push(`surface id is not namespaced ART: ${surface.surface_id}`);
  }
  if (!moduleIds.has(surface.module_id)) {
    errors.push(`${surface.surface_id} refers to unknown module ${surface.module_id}`);
  }
  requirePath(surface.path, surface.surface_id);
  if (surface.catalog_ref) {
    const entry = catalogEntries.get(surface.catalog_ref);
    if (!entry) errors.push(`${surface.surface_id} catalog_ref is absent from snapshot`);
    else {
      surface.catalog_sha256 = entry.sha256;
      const detected = Object.entries(entry.technology)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name.replace('_js', '-js').replace('es_module', 'es-module'))
        .sort();
      const declared = (surface.runtime ?? []).filter((name) => name !== 'html').sort();
      if (JSON.stringify(detected) !== JSON.stringify(declared)) {
        errors.push(`${surface.surface_id} runtime mismatch: declared [${declared}], detected [${detected}]`);
      }
    }
  }
}

for (const module of registry.modules) {
  if (module.current_master_surface) {
    const surface = registry.surfaces.find((item) => item.surface_id === module.current_master_surface);
    if (!surface) errors.push(`${module.module_id} current master does not exist: ${module.current_master_surface}`);
    else if (surface.module_id !== module.module_id) {
      errors.push(`${module.module_id} current master belongs to ${surface.module_id}`);
    }
  } else if (module.status.startsWith('active_')) {
    errors.push(`${module.module_id} is active but has no current master surface`);
  }
  for (const related of module.related_modules ?? []) {
    if (!moduleIds.has(related)) errors.push(`${module.module_id} refers to unknown related module ${related}`);
  }
}

for (const surface of registry.surfaces) {
  for (const field of ['predecessor', 'successor']) {
    if (surface[field] && !surfaceIds.has(surface[field])) {
      errors.push(`${surface.surface_id} has unknown ${field}: ${surface[field]}`);
    }
  }
}

for (const relation of registry.relations) {
  requireUnique(relation.relation_id, relationIds, 'relation');
  if (!relation.relation_id?.startsWith('REL:')) {
    errors.push(`relation id is not namespaced REL: ${relation.relation_id}`);
  }
  if (!moduleIds.has(relation.source)) errors.push(`${relation.relation_id} has unknown source ${relation.source}`);
  if (!moduleIds.has(relation.target)) errors.push(`${relation.relation_id} has unknown target ${relation.target}`);
  if (!['exact', 'empirical', 'method', 'open', 'non-identity'].includes(relation.type)) {
    errors.push(`${relation.relation_id} has invalid type ${relation.type}`);
  }
  requirePath(relation.evidence_record, `${relation.relation_id} evidence_record`);
  if (!relation.claim_boundary) errors.push(`${relation.relation_id} has no claim_boundary`);
}

const ringOneSurfaces = registry.surfaces.filter((surface) => surface.ring === 1);
if (ringOneSurfaces.length !== 9) {
  warnings.push(`expected 9 Ring 1 surfaces, found ${ringOneSurfaces.length}`);
}

const summary = {
  schema: registry.schema,
  modules: registry.modules.length,
  surfaces: registry.surfaces.length,
  relations: registry.relations.length,
  ring1_surfaces: ringOneSurfaces.length,
  catalog_refs_resolved: registry.surfaces.filter((surface) => surface.catalog_sha256).length,
  warnings,
  errors
};

console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exitCode = 1;
