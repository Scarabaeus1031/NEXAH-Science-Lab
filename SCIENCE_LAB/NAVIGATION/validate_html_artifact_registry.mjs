import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const load = (name) => JSON.parse(readFileSync(resolve(here, name), 'utf8'));

const catalog = load('HTML_CATALOG_SNAPSHOT_2026-10-05.json');
const modules = load('NEXAH_MODULE_REGISTRY_V2_2026-10-05.json');
const registry = load('HTML_ARTIFACT_REGISTRY_V1_2026-10-06.json');
const errors = [];
const warnings = [];

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const unique = (values) => new Set(values).size === values.length;
const artifactByPath = new Map(registry.artifacts.map((artifact) => [artifact.path, artifact]));
const catalogByPath = new Map(catalog.entries.map((entry) => [entry.path, entry]));
const moduleIds = new Set(modules.modules.map((module) => module.module_id));

if (registry.artifacts.length !== catalog.entries.length) fail(`artifact count ${registry.artifacts.length} != catalog count ${catalog.entries.length}`);
if (!unique(registry.artifacts.map((artifact) => artifact.artifact_id))) fail('artifact_id values are not unique');
if (!unique(registry.artifacts.map((artifact) => artifact.path))) fail('artifact paths are not unique');

for (const entry of catalog.entries) {
  const artifact = artifactByPath.get(entry.path);
  if (!artifact) {
    fail(`catalog path missing from registry: ${entry.path}`);
    continue;
  }
  if (artifact.sha256 !== entry.sha256) fail(`hash mismatch: ${entry.path}`);
  if (artifact.bytes !== entry.bytes) fail(`byte count mismatch: ${entry.path}`);
}

for (const artifact of registry.artifacts) {
  if (!catalogByPath.has(artifact.path)) fail(`registry path missing from catalog: ${artifact.path}`);
  if (artifact.module_id && !moduleIds.has(artifact.module_id)) fail(`unknown module ${artifact.module_id}: ${artifact.path}`);
  for (const relatedModule of artifact.relationship?.related_modules ?? []) if (!moduleIds.has(relatedModule)) fail(`unknown related module ${relatedModule}: ${artifact.path}`);
  if (!['curated', 'documented', 'provisional'].includes(artifact.assessment?.curation_state)) fail(`invalid curation state: ${artifact.path}`);
  if (!Number.isInteger(artifact.assessment?.centrality_score) || artifact.assessment.centrality_score < 0 || artifact.assessment.centrality_score > 5) fail(`invalid centrality score: ${artifact.path}`);
  if (!artifact.explanation?.trim()) fail(`missing explanation: ${artifact.path}`);
  if (!artifact.claim_ceiling?.trim()) fail(`missing claim ceiling: ${artifact.path}`);
  if (artifact.assessment_review_required !== (artifact.assessment.curation_state === 'provisional')) fail(`review flag disagrees with curation state: ${artifact.path}`);
  for (const record of [artifact.record, ...(artifact.decision_sources ?? [])].filter(Boolean)) {
    if (!existsSync(resolve(root, record))) fail(`missing decision record ${record}: ${artifact.path}`);
  }
}

for (const surface of modules.surfaces) {
  const artifact = artifactByPath.get(surface.catalog_ref);
  if (!artifact) {
    fail(`curated surface missing from artifact registry: ${surface.surface_id}`);
    continue;
  }
  if (artifact.artifact_id !== surface.surface_id) fail(`surface id mismatch for ${surface.catalog_ref}`);
  if (artifact.module_id !== surface.module_id) fail(`surface module mismatch for ${surface.catalog_ref}`);
  if (artifact.assessment.curation_state !== 'curated') fail(`surface is not marked curated: ${surface.catalog_ref}`);
}

let expectedExactCopies = 0;
for (const group of catalog.exact_duplicate_groups) {
  expectedExactCopies += group.paths.length - 1;
  group.paths.forEach((path, index) => {
    const artifact = artifactByPath.get(path);
    if (!artifact) return;
    const expectedRole = index === 0 ? 'custody_primary' : 'exact_copy';
    if (artifact.relationship.duplicate?.copy_role !== expectedRole) fail(`duplicate role mismatch (${expectedRole}): ${path}`);
    if (index > 0 && (artifact.assessment.content_role !== 'custody_copy' || artifact.assessment.representation_role !== 'exact_copy')) fail(`secondary duplicate not classified as custody copy: ${path}`);
  });
}

if (registry.summary.total_html !== registry.artifacts.length) fail('summary total_html mismatch');
if (registry.summary.exact_copy_artifacts !== expectedExactCopies) fail('summary exact_copy_artifacts mismatch');
const stateCount = (state) => registry.artifacts.filter((artifact) => artifact.assessment.curation_state === state).length;
for (const state of ['curated', 'documented', 'provisional']) if (registry.summary[state] !== stateCount(state)) fail(`summary ${state} mismatch`);
if (registry.summary.unresolved_family !== registry.artifacts.filter((artifact) => !artifact.module_id && !artifact.candidate_family).length) fail('summary unresolved_family mismatch');
if (registry.summary.provisional > 0) warn(`${registry.summary.provisional} provisional assessments remain; they are intentionally not promoted`);

const result = {
  status: errors.length ? 'FAIL' : 'PASS',
  html_artifacts: registry.artifacts.length,
  curated: stateCount('curated'),
  documented: stateCount('documented'),
  provisional: stateCount('provisional'),
  exact_secondary_copies: expectedExactCopies,
  warnings,
  errors
};

console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
