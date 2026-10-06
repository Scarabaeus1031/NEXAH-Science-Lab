import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const output = join(here, 'HTML_CATALOG_SNAPSHOT_2026-10-05.json');
const files = execFileSync('rg', ['--files', '-g', '*.html'], {
  cwd: repo,
  encoding: 'utf8'
}).trim().split('\n').filter(Boolean).sort();

const classify = path => {
  if (path.startsWith('00_INCOMING/')) return 'incoming_unadopted';
  if (/SOURCE_SNAPSHOT|SOURCE_CORPUS|SOURCE_ASSETS/.test(path)) return 'preserved_source';
  if (/CUSTODY|REVIEWER_PACKET|FROZEN_CHAIN/.test(path)) return 'custody_or_frozen';
  if (path.startsWith('SCIENCE_LAB/EXPORTS/')) return 'current_export_candidate';
  if (path.startsWith('SCIENCE_LAB/RESEARCH_AREAS/')) return 'research_area_surface';
  if (path.startsWith('SCIENCE_LAB/CASE_STUDIES/')) return 'case_study_surface';
  if (path.startsWith('SCIENCE_LAB/')) return 'science_lab_root';
  return 'repository_supporting_surface';
};

const conceptRules = [
  ['tessarec', /tessarec|tesseract/i],
  ['loki', /loki/i],
  ['miwa_milky_way', /miwa|milky\s*way|pineal|andromeda/i],
  ['three_d', /\b3d\b|three(?:\.min)?\.js|THREE\.|webgl|gltf|\.glb/i],
  ['e8_coxeter', /\be8\b|coxeter/i],
  ['rosetta', /rosetta|\bqrt\b|\btqr\b/i],
  ['orientation', /orientation|objectivity|two[ -]cuts|binder/i],
  ['operator_runtime', /operator|runtime|receipt|engage|release/i],
  ['phase_time', /phase|clockwork|periodic|five.?h/i],
  ['geodesic_geo', /geodesic|weather|map|landscape|roedelheim/i]
];

const rows = files.map(path => {
  const source = readFileSync(join(repo, path), 'utf8');
  const title = (source.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '(no title)')
    .replace(/\s+/g, ' ').trim();
  const combined = `${path}\n${title}\n${source}`;
  return {
    path,
    title,
    bytes: Buffer.byteLength(source),
    sha256: createHash('sha256').update(source).digest('hex'),
    preliminary_class: classify(path),
    ring1_module: source.match(/NEXAH_NAVIGATION_RING1\.js[^>]*data-module="([^"]+)"/)?.[1] || null,
    technology: {
      canvas: /<canvas/i.test(source),
      svg: /<svg/i.test(source),
      iframe: /<iframe/i.test(source),
      webgl: /webgl|getContext\s*\(\s*['"]webgl/i.test(source),
      three_js: /three(?:\.min)?\.js|THREE\./i.test(source),
      es_module: /<script[^>]+type=['"]module/i.test(source)
    },
    concepts: conceptRules.filter(([, pattern]) => pattern.test(combined)).map(([name]) => name),
    local_href_count: [...source.matchAll(/href="(?![a-z]+:|#)([^"]+)"/gi)].length,
    script_src_count: [...source.matchAll(/<script[^>]+src="([^"]+)"/gi)].length
  };
});

const hashGroups = new Map();
for (const row of rows) {
  if (!hashGroups.has(row.sha256)) hashGroups.set(row.sha256, []);
  hashGroups.get(row.sha256).push(row.path);
}
const exactDuplicateGroups = [...hashGroups.entries()]
  .filter(([, paths]) => paths.length > 1)
  .map(([sha256, paths]) => ({ sha256, paths }));

const countBy = key => rows.reduce((acc, row) => {
  const value = row[key];
  acc[value] = (acc[value] || 0) + 1;
  return acc;
}, {});

const payload = {
  schema: 'nexah-html-catalog-snapshot/1.0.0',
  generated_at: '2026-10-05',
  scope: 'Git-tracked and untracked HTML visible in the current NEXAH-Science-Lab working tree',
  status: 'AUTOMATED_PRELIMINARY_INVENTORY / NOT_MASTER_SELECTION / NO_CLAIM_PROMOTION',
  summary: {
    total_html: rows.length,
    science_lab_html: rows.filter(row => row.path.startsWith('SCIENCE_LAB/')).length,
    ring1_html: rows.filter(row => row.ring1_module).length,
    by_preliminary_class: countBy('preliminary_class'),
    technology_counts: Object.fromEntries(Object.keys(rows[0]?.technology || {}).map(key => [key, rows.filter(row => row.technology[key]).length])),
    exact_duplicate_groups: exactDuplicateGroups.length,
    files_in_exact_duplicate_groups: exactDuplicateGroups.reduce((sum, group) => sum + group.paths.length, 0)
  },
  exact_duplicate_groups: exactDuplicateGroups,
  entries: rows
};

writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`);
console.log(relative(repo, output));
console.log(JSON.stringify(payload.summary, null, 2));
