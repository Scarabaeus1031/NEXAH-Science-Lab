#!/usr/bin/env node

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(root, "A0_BOOK_MANIFEST.json");
const coveragePath = join(
  root,
  "../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_MODULE_SURFACE_COVERAGE_V1_2026-10-14.json"
);
const outputJson = join(root, "assets/a0-asset-index-v1.json");
const outputJs = join(root, "assets/a0-asset-index-v1.js");
const generatedPaths = new Set([
  "assets/a0-asset-index-v1.json",
  "assets/a0-asset-index-v1.js"
]);
const ignoredNames = new Set([".DS_Store"]);

const decodeEntities = (value = "") => value
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">");

const cleanText = (value = "") => decodeEntities(value)
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const match = (source, expression) => cleanText(source.match(expression)?.[1] || "");

const describeHtml = (source, fallback) => {
  const title = match(source, /<title[^>]*>([\s\S]*?)<\/title>/i) || fallback;
  const headline = match(source, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || title;
  const meta = source.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)
    || source.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i);
  const paragraphs = [...source.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((entry) => cleanText(entry[1]))
    .filter((entry) => entry.length >= 48 && !/cookie|javascript|navigation/i.test(entry));
  const description = cleanText(meta?.[1] || paragraphs[0] || headline).slice(0, 260);
  return { title, headline, description };
};

const inferRole = (path) => {
  const name = path.toUpperCase();
  if (path === "A0_ASSET_INDEX.html") return "index";
  if (name.includes("PAPER") || name.includes("REPORT") || /^0[1-8]_/.test(name) || name === "INDEX.HTML") return "reader";
  if (/LAB|DEMONSTRATOR|ATLAS|MACHINE|JOINT|PLAYER|GAME/.test(name)) return "instrument";
  if (/DESK|BACKLOG|MANIFEST|PROTOCOL|FIELD_NOTES|README/.test(name)) return "record";
  if (/RESULT|RECEIPT|AUDIT/.test(name)) return "result";
  if (/\.(MJS|CJS|JS|CSS|PY)$/.test(name)) return "source";
  if (/\.(PNG|JPE?G|SVG|GLB)$/.test(name)) return "asset";
  return "record";
};

const formatLabel = (extension) => extension ? extension.slice(1).toUpperCase() : "FILE";

const familyOrder = [
  "A0 Foundation",
  "Science Control",
  "Mathfield",
  "Pascal / Pentagon",
  "LIFE",
  "Tessarec / Blue Body",
  "Papers & Review",
  "Fields & Joints",
  "Evidence & Results",
  "Runtime & Source",
  "Visual & 3D Assets",
  "Repository Records"
];

const inferFamily = (path, work, role) => {
  const name = path.toUpperCase();
  if (/TESSAREC|BLUE_BODY|FIBONACCI_RING|HEPTAGON|SPECTRAL_GRID/.test(name) || work === "Paper F") return "Tessarec / Blue Body";
  if (/GAME_4_LIFE|LIFE_PLUS/.test(name) || work === "GAME 4 LIFE +1") return "LIFE";
  if (/PASCAL|PENTAGON|GENERATION_CORNER/.test(name) || ["Pascal Joint", "Paper A"].includes(work)) return "Pascal / Pentagon";
  if (path.startsWith("assets/fields-and-joints/") || path.startsWith("assets/mathematical-joints/")) return "Fields & Joints";
  if (work === "Mathfield") return "Mathfield";
  if (work === "A0 Science Mission Control") return "Science Control";
  if (work === "A0 Book") return "A0 Foundation";
  if (work.startsWith("Paper ")) return "Papers & Review";
  if (role === "result") return "Evidence & Results";
  if (role === "source") return "Runtime & Source";
  if (role === "asset") return "Visual & 3D Assets";
  return "Repository Records";
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (ignoredNames.has(entry.name) || entry.name === ".git") continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const [manifest, coverage, discovered] = await Promise.all([
  readFile(manifestPath, "utf8").then(JSON.parse),
  readFile(coveragePath, "utf8").then(JSON.parse),
  walk(root)
]);

const registry = new Map(manifest.surface_registry.map((item) => [item.surface, item]));
const workBySurface = new Map(
  coverage.work_bindings.flatMap((binding) => binding.surfaces.map((surface) => [surface, binding.work]))
);

const files = [];
for (const fullPath of discovered) {
  const path = relative(root, fullPath).split("\\").join("/");
  if (generatedPaths.has(path)) continue;
  const info = await stat(fullPath);
  const extension = extname(path).toLowerCase();
  const registered = registry.get(path);
  const work = workBySurface.get(path) || registered?.work || (path.includes("/") ? "Embedded assets" : "A0 workspace");
  const role = inferRole(path);
  const base = {
    path,
    name: path.split("/").pop(),
    extension: extension || "none",
    format: formatLabel(extension),
    bytes: info.size,
    role,
    publication_state: "internal",
    registered_surface: Boolean(registered),
    work,
    family: inferFamily(path, work, role),
    status: registered?.status || "INTERNAL_WORKSPACE_NOT_PUBLIC",
    claim_boundary: registered?.claim_boundary || "INTERNAL_ASSET_INDEXING_ONLY_NO_AUTHORITY_OR_PUBLICATION_EFFECT"
  };
  if (extension === ".html") {
    const source = await readFile(fullPath, "utf8");
    Object.assign(base, describeHtml(source, base.name));
  }
  files.push(base);
}

files.sort((a, b) => {
  const familyDelta = familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family);
  return familyDelta || a.path.localeCompare(b.path);
});
const byExtension = Object.fromEntries(
  [...new Set(files.map((item) => item.format))]
    .sort()
    .map((format) => [format, files.filter((item) => item.format === format).length])
);
const byRole = Object.fromEntries(
  [...new Set(files.map((item) => item.role))]
    .sort()
    .map((role) => [role, files.filter((item) => item.role === role).length])
);

const payload = {
  schema: "nexah.a0-asset-index/1.0.0",
  title: "A0 ASSET INDEX",
  generated: "2026-10-14",
  status: "INTERNAL_WORKSPACE_INDEX_NOT_PUBLIC",
  identity_reuse: [
    "NEXAH:A0:FROM_DISTINCTION_TO_READOUT",
    "ART:A0:MATHEMATICAL_JOINTS",
    "NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1"
  ],
  authority_boundary: "Repository inventory and navigation only. No new research identity, relation, evidence promotion, Study activation or publication authority.",
  root: "A0_BOOK",
  counts: {
    files: files.length,
    html: files.filter((item) => item.extension === ".html").length,
    registered_surfaces: files.filter((item) => item.registered_surface).length,
    families: new Set(files.map((item) => item.family)).size,
    formats: Object.keys(byExtension).length
  },
  by_extension: byExtension,
  by_role: byRole,
  family_order: familyOrder,
  files
};

const json = `${JSON.stringify(payload, null, 2)}\n`;
await writeFile(outputJson, json, "utf8");
await writeFile(outputJs, `window.A0_ASSET_INDEX = ${JSON.stringify(payload)};\n`, "utf8");
console.log(`A0 Asset Index: ${payload.counts.files} files · ${payload.counts.html} HTML · ${payload.counts.registered_surfaces} registered surfaces`);

