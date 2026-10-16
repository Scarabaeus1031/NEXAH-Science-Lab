#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const bookDir = dirname(fileURLToPath(import.meta.url));
const manifestPath = resolve(bookDir, "A0_BOOK_MANIFEST.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const htmlSurfaces = readdirSync(bookDir).filter((name) => extname(name) === ".html").sort();
const registry = manifest.surface_registry ?? [];
const required = manifest.surface_audit_contract?.required_fields ?? ["work", "source", "status", "claim_boundary"];
const registered = registry.map((row) => row.surface).sort();
const missing = htmlSurfaces.filter((name) => !registered.includes(name));
const stale = registered.filter((name) => !htmlSurfaces.includes(name));
const incomplete = registry.filter((row) => required.some((key) => typeof row[key] !== "string" || !row[key].trim()));
const missingSources = registry.filter((row) => !existsSync(resolve(bookDir, row.source))).map((row) => ({ surface: row.surface, source: row.source }));

const ignored = /^(?:https?:|mailto:|tel:|data:|javascript:|blob:|#)/i;
const deadLinks = [];
for (const surface of htmlSurfaces) {
  const html = readFileSync(resolve(bookDir, surface), "utf8");
  const references = [...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((reference) => !reference.includes('${'));
  for (const reference of references) {
    if (!reference || ignored.test(reference)) continue;
    let local = reference.split("#")[0].split("?")[0];
    if (!local) continue;
    try { local = decodeURIComponent(local); } catch { /* preserve literal path */ }
    const target = resolve(bookDir, local);
    if (!existsSync(target)) deadLinks.push({ surface, reference });
  }
}

const expected = manifest.surface_audit_contract?.expected_html_surfaces;
const countPass = htmlSurfaces.length === expected && registry.length === expected;
const pass = countPass && missing.length === 0 && stale.length === 0 && incomplete.length === 0 && missingSources.length === 0 && deadLinks.length === 0;
const report = {
  check: 58,
  pass,
  coverage: `${registry.length}/${htmlSurfaces.length}`,
  expected,
  missing,
  stale,
  incomplete: incomplete.map((row) => row.surface),
  missing_sources: missingSources,
  dead_local_links: deadLinks
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = pass ? 0 : 1;
