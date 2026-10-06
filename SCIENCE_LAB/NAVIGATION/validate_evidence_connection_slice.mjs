import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const load = (name) => JSON.parse(readFileSync(resolve(here, name), 'utf8'));
const slice = load('POLAR_JANUS_EVIDENCE_SLICE_V1_2026-10-06.json');
const moduleRegistry = load('NEXAH_MODULE_REGISTRY_V2_2026-10-05.json');
const moduleIds = new Set(moduleRegistry.modules.map((module) => module.module_id));
const evidenceIds = new Set();
const relationIds = new Set();
const errors = [];

for (const record of slice.controlling_intakes ?? []) if (!existsSync(resolve(root, record))) errors.push(`missing controlling intake: ${record}`);

for (const node of slice.evidence_nodes ?? []) {
  if (evidenceIds.has(node.evidence_id)) errors.push(`duplicate evidence id: ${node.evidence_id}`);
  evidenceIds.add(node.evidence_id);
  if (!existsSync(resolve(root, node.record))) errors.push(`missing evidence record: ${node.record}`);
  if (!node.local_verdict || !node.current_interpretation) errors.push(`missing dual status: ${node.evidence_id}`);
  for (const moduleId of node.related_modules ?? []) if (!moduleIds.has(moduleId)) errors.push(`unknown module ${moduleId}: ${node.evidence_id}`);
}

for (const relation of slice.relations ?? []) {
  if (relationIds.has(relation.relation_id)) errors.push(`duplicate relation id: ${relation.relation_id}`);
  relationIds.add(relation.relation_id);
  if (!evidenceIds.has(relation.source)) errors.push(`unknown relation source: ${relation.relation_id}`);
  if (!evidenceIds.has(relation.target)) errors.push(`unknown relation target: ${relation.relation_id}`);
}

console.log(JSON.stringify({
  status: errors.length ? 'FAIL' : 'PASS',
  evidence_nodes: evidenceIds.size,
  relations: relationIds.size,
  errors
}, null, 2));

if (errors.length) process.exitCode = 1;
