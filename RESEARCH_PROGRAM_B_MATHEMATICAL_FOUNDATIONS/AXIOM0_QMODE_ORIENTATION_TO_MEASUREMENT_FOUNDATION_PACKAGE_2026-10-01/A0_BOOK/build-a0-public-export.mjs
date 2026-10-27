#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const sourceRoot = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(sourceRoot, "a0-public-export-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const outputRoot = path.resolve(process.argv[2] || path.join(sourceRoot, ".a0-public-export-preview"));
const markerPath = path.join(outputRoot, ".a0-public-export.json");
const pageSet = new Set(manifest.pages);
const shellPageSet = new Set(manifest.shellPages || []);
const copied = new Set();

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
.a0-public-top{position:sticky!important;top:0!important;z-index:90!important;display:flex!important;justify-content:space-between!important;align-items:center!important;gap:20px!important;padding:12px 5vw!important;background:rgba(255,253,248,.97)!important;color:#10233d!important;border-bottom:1px solid #d2c9b9!important;backdrop-filter:blur(14px)!important}
.a0-public-top .brand{font:850 .88rem/1 ui-sans-serif,system-ui,sans-serif!important;letter-spacing:.14em!important;text-decoration:none!important}.a0-public-top .brand span{font-weight:550!important;color:#657287!important;letter-spacing:.03em!important}.a0-public-top nav{display:flex!important;gap:17px!important;flex-wrap:wrap!important}.a0-public-top nav a{font:750 .62rem/1.2 "SFMono-Regular",Consolas,monospace!important;letter-spacing:.07em!important;text-transform:uppercase!important;text-decoration:none!important;color:#10233d!important}
.a0-public-nav{display:flex;align-items:stretch;overflow-x:auto;background:#fffdf8;color:#10233d;border-bottom:1px solid #d2c9b9;scrollbar-width:thin}.a0-public-nav a{display:grid;align-content:center;min-width:max-content;padding:11px clamp(14px,2.2vw,30px);border-right:1px solid #d2c9b9;text-decoration:none;color:inherit}.a0-public-nav a:first-child{padding-left:5vw}.a0-public-nav small{color:#9a6c00;font:780 .54rem/1.15 "SFMono-Regular",Consolas,monospace;letter-spacing:.09em;text-transform:uppercase}.a0-public-nav strong{margin-top:4px;font:720 .82rem/1.15 ui-sans-serif,system-ui,sans-serif}.a0-public-nav a:hover,.a0-public-nav a:focus-visible{background:#fff5d5;color:#785407;outline:2px solid #e9b541;outline-offset:-2px}.a0-public-nav .a0-public-connect{position:sticky;right:0;z-index:2;display:grid;place-items:center;align-self:center;flex:0 0 58px;min-width:58px;height:58px;margin-left:auto;padding:0;border-left:1px solid #d2c9b9;border-right:0;background:#fffdf8;box-shadow:-12px 0 18px rgba(243,239,230,.95)}.a0-public-connect:before{content:"";width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 36% 28%,#fff 0 5%,#ff9fd2 12%,#ee6c9f 48%,#a92169 100%);border:1px solid #fff;box-shadow:0 0 0 3px rgba(238,108,159,.13),0 0 18px rgba(238,108,159,.55)}.a0-public-connect span{clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}a[aria-disabled="true"]{cursor:not-allowed!important;opacity:.58!important;text-decoration-style:dotted!important}
@media(max-width:760px){.a0-public-top nav{display:none!important}.a0-public-nav a:first-child{padding-left:18px}}
</style>`;

const publicHeader = `<header class="a0-public-top"><a class="brand" href="./">NEXAH <span>· Science</span></a><nav aria-label="NEXAH Science auf dieser Seite"><a href="A0_SCIENCE.html#status">Stand</a><a href="A0_SCIENCE.html#object">Forschungsgegenstand</a><a href="A0_SCIENCE.html#contributions">Ergebnisse</a><a href="A0_MATHEMATICAL_JOINTS.html">Mathfield</a><a href="A0_SCIENCE.html#validation-boundary">Offene Fragen</a></nav></header>`;
const publicNav = `<nav class="a0-public-nav" aria-label="NEXAH Science Bereiche"><a href="A0_SCIENCE.html"><small>00 · Start</small><strong>Überblick</strong></a><a href="A0_SCIENTIFIC_POSITION_REPORT.html"><small>01 · Position</small><strong>Forschungsstand</strong></a><a href="A0_SCIENCE.html#contributions"><small>02 · Evidence</small><strong>Ergebnisse &amp; Papers</strong></a><a href="A0_MATHEMATICAL_JOINTS.html"><small>03 · Field</small><strong>Mathfield</strong></a><a href="01_FROM_LINE_TO_READOUT.html"><small>04 · Read</small><strong>Book · Kapitel 01–08</strong></a><a href="A0_TOURS.html#explanation-path"><small>05 · Use</small><strong>Instrumente</strong></a><a class="a0-public-connect" href="NEXAH_C_CONNECT.html#scientific-review" aria-label="NEXAH Science Connect · Review oder Forschungsfrage" title="Connect · Review &amp; Frage"><span>06 · Connect</span></a></nav>`;

function applyPublicShell(html) {
  let projected = html.replace(/\s*<nav\b[^>]*class=["'][^"']*science-nav[^"']*["'][^>]*>[\s\S]*?<\/nav>/i, "");
  projected = projected.replace(/<header\b[^>]*class=["'][^"']*top[^"']*["'][^>]*>[\s\S]*?<\/header>/i, publicHeader);
  if (!projected.includes(publicHeader)) projected = projected.replace(/<body([^>]*)>/i, `<body$1>${publicHeader}`);
  projected = projected.replace(publicHeader, `${publicHeader}${publicNav}`);
  return projected.replace(/<\/head>/i, `${publicShellStyle}</head>`);
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
  entry: manifest.entry,
  generatedAt: new Date().toISOString(),
  pages: manifest.pages,
  files: [...copied].sort()
};
fs.writeFileSync(markerPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ status: "PASS", outputRoot, pages: manifest.pages.length, files: copied.size }, null, 2));
