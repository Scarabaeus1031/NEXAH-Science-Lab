#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const sourceRoot = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(sourceRoot, "a0-public-export-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const outputRoot = path.resolve(process.argv[2] || path.join(sourceRoot, ".a0-public-export-preview"));
const markerPath = path.join(outputRoot, ".a0-public-export.json");
const pageSet = new Set(manifest.pages);
const shellPageSet = new Set(manifest.shellPages || []);
const copied = new Set();
const sourceRevision = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: sourceRoot,
  encoding: "utf8"
}).trim();

function localTarget(raw, fromFile) {
  if (!raw || raw.startsWith("#") || raw.startsWith("data:") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) return null;
  if (/^[a-z]+:/i.test(raw) || raw.startsWith("//")) return null;
  const clean = decodeURIComponent(raw.split(/[?#]/, 1)[0]);
  if (!clean || clean === "." || clean === "./" || clean.endsWith("/")) return null;
  const resolved = path.normalize(path.join(path.dirname(fromFile), clean));
  if (resolved.startsWith("..") || path.isAbsolute(resolved)) throw new Error(`Reference escapes A0_BOOK: ${fromFile} -> ${raw}`);
  return resolved;
}

function assertSourceFile(relative) {
  const absolute = path.join(sourceRoot, relative);
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) throw new Error(`Missing source dependency: ${relative}`);
  return absolute;
}

function stripPrivateShell(html) {
  return html
    .replace(/\s*<link\b[^>]*href=["'][^"']*a0-context-navigation\.css[^"']*["'][^>]*>/gi, "")
    .replace(/\s*<script\b[^>]*src=["'][^"']*a0-context-navigation\.js[^"']*["'][^>]*><\/script>/gi, "");
}

function rebaseSourceLinks(html, fromFile) {
  return html.replace(/href\s*=\s*(["'])([^"']+)\1/gi, (whole, quote, raw) => {
    if (!raw.startsWith("../")) return whole;
    return 'aria-disabled="true" data-public-boundary="source-not-exported"';
  });
}

function projectHtmlLinks(html, fromFile) {
  return html.replace(/href\s*=\s*(["'])([^"']+)\1/gi, (whole, quote, raw) => {
    const target = localTarget(raw, fromFile);
    if (!target || target === "index.html" || !/\.html?$/i.test(target) || pageSet.has(target)) return whole;
    if (manifest.excludedAuthoritySurfaces.some((name) => target.includes(name))) {
      return 'aria-disabled="true" data-public-boundary="not-exported"';
    }
    return 'aria-disabled="true" data-public-boundary="source-not-exported"';
  });
}

function normalizeKnownPublicRoutes(html) {
  return html
    .replace(/(assets\/game-of-worlds-play\/three-domain-transition-test\/index\.html)#atlas\b/g, "$1#atlasContracts")
    .replace(/(assets\/game-of-worlds-play\/three-domain-transition-test\/index\.html)#blue-body\b/g, "$1#blueBodyMotor")
    .replace(/index\.html#research-now\b/g, "A0_SCIENCE.html#status")
    .replace(/index\.html#wegweiser\b/g, "A0_SCIENCE.html#understand")
    .replace(/https:\/\/github\.com\/Scarabaeus1031\/NEXAH-Science-Lab\/tree\/main\/SCIENCE_LAB\/NAVIGATION\b/g, "https://github.com/Scarabaeus1031/NEXAH-Science-Lab")
    .replace(/https:\/\/www\.researchobject\.org\/ro-crate\/specification\//g, "https://www.researchobject.org/ro-crate/specification.html");
}

const publicShellStyle = `<style id="a0-public-shell-style">
.a0-public-skip{position:fixed;top:12px;left:12px;z-index:110;padding:11px 16px;border-radius:7px;background:#071923;color:#fff!important;font:750 .72rem/1.2 ui-sans-serif,system-ui,sans-serif;text-decoration:none;transform:translateY(-220%)}.a0-public-skip:focus{transform:translateY(0)}.a0-public-top a:focus-visible,.a0-public-directory summary:focus-visible{outline:3px solid #e9b541!important;outline-offset:3px!important}
.a0-public-top{position:sticky!important;top:0!important;z-index:90!important;display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;align-items:center!important;gap:clamp(16px,2.3vw,38px)!important;padding:11px 5vw!important;background:rgba(255,253,248,.97)!important;color:#10233d!important;border-bottom:1px solid #d2c9b9!important;backdrop-filter:blur(14px)!important}.a0-public-top .brand{font:850 .88rem/1 ui-sans-serif,system-ui,sans-serif!important;letter-spacing:.14em!important;text-decoration:none!important;white-space:nowrap}.a0-public-top .brand span{font-weight:550!important;color:#657287!important;letter-spacing:.03em!important}.a0-public-primary{display:flex!important;justify-content:flex-end!important;gap:clamp(10px,1.15vw,18px)!important;min-width:0!important}.a0-public-primary a,.a0-public-directory summary{font:750 .58rem/1.2 "SFMono-Regular",Consolas,monospace!important;letter-spacing:.065em!important;text-transform:uppercase!important;text-decoration:none!important;color:#10233d!important}
.a0-public-directory{position:static!important}.a0-public-directory summary{display:flex!important;align-items:center!important;gap:7px!important;padding:9px 11px!important;border:1px solid #c9bdab!important;border-radius:7px!important;cursor:pointer!important;list-style:none!important;white-space:nowrap!important}.a0-public-directory summary::-webkit-details-marker{display:none}.a0-public-directory summary span{color:#9a6c00;font-size:.9rem;transition:transform .16s ease}.a0-public-directory[open] summary{border-color:#d7a52d!important;background:#fff6dd!important;color:#785407!important}.a0-public-directory[open] summary span{transform:rotate(45deg)}.a0-public-directory-panel{position:absolute;top:100%;right:4vw;left:4vw;z-index:95;max-height:min(44rem,calc(100vh - 7rem));overflow:auto;padding:clamp(20px,2.5vw,40px);border:1px solid #d2c9b9;border-top:3px solid #e9b541;border-radius:0 0 18px 18px;background:#fffdf8;box-shadow:0 24px 64px rgba(7,25,35,.25)}.a0-public-directory-panel>header{display:grid;grid-template-columns:minmax(0,1fr) minmax(18rem,.7fr);gap:6px 48px;margin-bottom:24px}.a0-public-directory-panel>header p{grid-column:1/-1;margin:0;color:#9a6c00;font:800 .58rem/1.3 "SFMono-Regular",Consolas,monospace;letter-spacing:.12em;text-transform:uppercase}.a0-public-directory-panel>header h2{margin:0;color:#10233d;font:650 clamp(1.7rem,3vw,2.7rem)/1.05 Georgia,serif}.a0-public-directory-panel>header>span{align-self:end;color:#657287;font:500 .86rem/1.5 ui-sans-serif,system-ui,sans-serif}.a0-public-directory-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid #d8cfc1}.a0-public-directory-grid>section{min-width:0;padding:20px;border-right:1px solid #d8cfc1}.a0-public-directory-grid>section:last-child{border-right:0}.a0-public-directory-grid small{color:#9a6c00;font:800 .58rem/1 monospace;letter-spacing:.1em}.a0-public-directory-grid h3{margin:9px 0 8px;color:#10233d;font:750 1rem/1.2 ui-sans-serif,system-ui,sans-serif}.a0-public-directory-grid p{min-height:4.3em;margin:0 0 16px;color:#657287;font:500 .78rem/1.45 ui-sans-serif,system-ui,sans-serif}.a0-public-directory-grid nav{display:grid}.a0-public-directory-grid nav a{display:flex;justify-content:space-between;gap:16px;padding:9px 0;border-top:1px solid #e5ded3;color:#10233d;font:750 .56rem/1.25 "SFMono-Regular",Consolas,monospace;letter-spacing:.05em;text-decoration:none;text-transform:uppercase}.a0-public-directory-grid nav a span{color:#9a6c00}
a[aria-disabled="true"]{cursor:not-allowed!important;opacity:.58!important;text-decoration-style:dotted!important}
@media(max-width:1080px){.a0-public-top{grid-template-columns:auto auto!important}.a0-public-primary{grid-column:1/-1;grid-row:2;justify-content:flex-start!important;overflow-x:auto;padding:4px 0}.a0-public-directory{grid-column:2;grid-row:1;justify-self:end}.a0-public-directory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.a0-public-directory-grid>section{border-bottom:1px solid #d8cfc1}.a0-public-directory-grid>section:nth-child(2){border-right:0}.a0-public-directory-grid>section:nth-child(n+3){border-bottom:0}}
@media(max-width:680px){html,body{max-width:100%!important;overflow-x:clip!important}.a0-public-top{padding-inline:18px!important}.a0-public-primary{display:none!important}.a0-public-directory-panel{right:12px;left:12px;max-height:calc(100vh - 88px)}.a0-public-directory-panel>header{grid-template-columns:1fr}.a0-public-directory-grid{grid-template-columns:1fr}.a0-public-directory-grid>section{border-right:0;border-bottom:1px solid #d8cfc1!important}.a0-public-directory-grid>section:last-child{border-bottom:0!important}table{display:block!important;max-width:100%!important;overflow-x:auto!important}}
</style>`;

const publicHeader = `<a class="a0-public-skip" href="#a0-public-content">Zum Inhalt</a><header class="a0-public-top"><a class="brand" href="/">NEXAH <span>· Orientation</span></a><nav class="a0-public-primary" aria-label="NEXAH Hauptnavigation"><a href="https://nexahedron.com" target="_blank" rel="noopener noreferrer">Human ↗</a><a href="/forschen/">Science</a><a href="https://www.scarabaeus1033.net" target="_blank" rel="noopener noreferrer">Builder ↗</a><a href="/about/">About</a><a href="/A0_TOURS.html#explanation-path">Tour</a></nav><details class="a0-public-directory"><summary>Navigation <span aria-hidden="true">+</span></summary><div class="a0-public-directory-panel"><header><p>NEXAH · öffentliche Übersicht</p><h2>Wohin möchten Sie gehen?</h2><span>Ein Werk, vier klare Zugänge. Interne A0-, Desk- und Mission-Control-Bereiche bleiben getrennt.</span></header><div class="a0-public-directory-grid"><section><small>01</small><h3>Orientieren</h3><p>Verstehen, was NEXAH ist und wie die Bereiche zusammenhängen.</p><nav aria-label="Orientieren"><a href="/">Startseite <span>→</span></a><a href="/about/">About NEXAH <span>→</span></a><a href="/how-nexah-works/">How NEXAH Works <span>→</span></a></nav></section><section><small>02</small><h3>Forschen</h3><p>Stand, Resultate, Belege und offene Grenzen prüfen.</p><nav aria-label="Forschen"><a href="/forschen/">Forschen · Überblick <span>→</span></a><a href="/A0_SCIENTIFIC_POSITION_REPORT.html">Forschungsstand <span>→</span></a><a href="/forschen/#contributions">Ergebnisse &amp; Papers <span>→</span></a><a href="/A0_MATHEMATICAL_JOINTS.html">Mathfield <span>→</span></a><a href="/forschen/#validation-boundary">Offene Fragen &amp; Review <span>→</span></a></nav></section><section><small>03</small><h3>Lesen &amp; erkunden</h3><p>Bücher, Publikationen und Karten als eigene Räume öffnen.</p><nav aria-label="Lesen und erkunden"><a href="/library/">Library <span>→</span></a><a href="/01_FROM_LINE_TO_READOUT.html">Book · Kapitel 01–08 <span>→</span></a><a href="/atlas-of-atlases/">Atlas of Atlases <span>→</span></a></nav></section><section><small>04</small><h3>Anwenden &amp; erleben</h3><p>Touren, Instrumente und die verbundenen öffentlichen Häuser öffnen.</p><nav aria-label="Anwenden und erleben"><a href="/A0_TOURS.html#explanation-path">Geführte Tour <span>→</span></a><a href="/laboratory/">Laboratory <span>→</span></a><a href="https://nexahedron.com">NEXAHEDRON · Human <span>↗</span></a><a href="https://www.scarabaeus1033.net">Scarabæus · Builder <span>↗</span></a><a href="/NEXAH_C_CONNECT.html#scientific-review">Review &amp; Forschungsfrage <span>→</span></a></nav></section></div></div></details></header><span id="a0-public-content" tabindex="-1"></span>`;

const publicMenuScript = `<script id="a0-public-shell-script">document.addEventListener("keydown",function(event){if(event.key==="Escape")document.querySelectorAll(".a0-public-directory[open]").forEach(function(menu){menu.open=false;});});</script>`;

function applyPublicContentBoundary(html, relative) {
  let projected = html
    .replace(/\s*<div class="stat"><small>Operating state<\/small><strong>Structure Freeze · 0 active<\/strong><span>Keine Study aktiviert und keine Publikation autorisiert\.<\/span><\/div>/i, "")
    .replace(/Keine Ausführung, Simulation oder Evidenzproduktion während Structure Freeze\./g, "Keine Ausführung, Simulation oder Evidenzproduktion ohne separate Study-Aktivierung.")
    .replace(/Structure Freeze/g, "interne Forschungssteuerung");
  if (relative === "A0_SCIENCE.html") {
    projected = projected.replace(/\.status-grid\{display:grid;grid-template-columns:repeat\(4,1fr\)\}/, ".status-grid{display:grid;grid-template-columns:repeat(3,1fr)}");
  }
  if (relative === "A0_SCIENTIFIC_POSITION_REPORT.html") {
    projected = projected
      .replace(/\s*<nav\b[^>]*class=["'][^"']*a0-explanation-path[^"']*["'][^>]*>[\s\S]*?<\/nav>/i, "")
      .replace(/\s*<section\b[^>]*class=["'][^"']*a0-explanation-next[^"']*["'][^>]*>[\s\S]*?<\/section>/i, "")
      .replace(/R2–R3 · Graph 286\/32 PASS/g, "R2–R3 · Source Graph currentness check open");
  }
  return projected;
}

function applyPublicShell(html) {
  let projected = html.replace(/\s*<nav\b[^>]*class=["'][^"']*science-nav[^"']*["'][^>]*>[\s\S]*?<\/nav>/i, "");
  projected = projected.replace(/<header\b[^>]*class=["'][^"']*top[^"']*["'][^>]*>[\s\S]*?<\/header>/i, publicHeader);
  if (!projected.includes(publicHeader)) projected = projected.replace(/<body([^>]*)>/i, `<body$1>${publicHeader}`);
  return projected
    .replace(/<\/head>/i, `${publicShellStyle}</head>`)
    .replace(/<\/body>/i, `${publicMenuScript}</body>`);
}

function collectReferences(text, relative, kind) {
  const refs = new Set();
  const htmlPatterns = [/(?:href|src|poster|data)\s*=\s*["']([^"']+)["']/gi, /url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi];
  const cssPatterns = [/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi, /@import\s+["']([^"']+)["']/gi];
  for (const pattern of kind === "html" ? htmlPatterns : cssPatterns) {
    for (const match of text.matchAll(pattern)) {
      const target = localTarget(match[1], relative);
      if (target) refs.add(target);
    }
  }
  return refs;
}

function writeFile(relative, content) {
  const destination = path.join(outputRoot, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content);
  copied.add(relative);
}

function copyAsset(relative) {
  if (copied.has(relative)) return;
  const source = assertSourceFile(relative);
  const extension = path.extname(relative).toLowerCase();
  const content = fs.readFileSync(source);
  writeFile(relative, content);
  if (extension === ".css") {
    for (const ref of collectReferences(content.toString("utf8"), relative, "css")) copyAsset(ref);
  }
}

function buildPage(relative) {
  const source = assertSourceFile(relative);
  let html = normalizeKnownPublicRoutes(projectHtmlLinks(rebaseSourceLinks(stripPrivateShell(fs.readFileSync(source, "utf8")), relative), relative));
  html = applyPublicContentBoundary(html, relative);
  if (shellPageSet.has(relative)) html = applyPublicShell(html);
  for (const ref of collectReferences(html, relative, "html")) {
    if (/\.html?$/i.test(ref)) {
      if (ref !== "index.html" && !pageSet.has(ref)) throw new Error(`Public page links to non-allowlisted HTML: ${relative} -> ${ref}`);
    } else {
      copyAsset(ref);
    }
  }
  writeFile(relative, html);
  return html;
}

if (fs.existsSync(outputRoot)) {
  if (!fs.existsSync(markerPath)) throw new Error(`Refusing to replace unmarked directory: ${outputRoot}`);
  fs.rmSync(outputRoot, { recursive: true });
}
fs.mkdirSync(outputRoot, { recursive: true });

for (const asset of manifest.publicAssets || []) copyAsset(asset);

let entryHtml = "";
for (const page of manifest.pages) {
  const html = buildPage(page);
  if (page === manifest.entry) entryHtml = html;
}
writeFile("index.html", entryHtml.replace(/href=["']index\.html["']/g, 'href="./"'));

const receipt = {
  schema: manifest.schema,
  publicHouse: manifest.publicHouse,
  sourceAuthority: manifest.sourceAuthority,
  releaseAuthority: manifest.releaseAuthority,
  hostRoutes: manifest.hostRoutes || [],
  sourceRevision,
  entry: manifest.entry,
  generatedAt: new Date().toISOString(),
  pages: manifest.pages,
  files: [...copied].sort()
};
fs.writeFileSync(markerPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ status: "PASS", outputRoot, pages: manifest.pages.length, files: copied.size }, null, 2));
