const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = __dirname;
const suppliedOutput = process.argv[2];
const output = suppliedOutput
  ? path.resolve(suppliedOutput)
  : fs.mkdtempSync(path.join(os.tmpdir(), "a0-public-export-test-"));
if (!suppliedOutput) {
  fs.writeFileSync(path.join(output, ".a0-public-export.json"), "{}\n");
  execFileSync(process.execPath, [path.join(root, "build-a0-public-export.mjs"), output], { stdio: "pipe" });
}

const receipt = JSON.parse(fs.readFileSync(path.join(output, ".a0-public-export.json"), "utf8"));
const index = fs.readFileSync(path.join(output, "index.html"), "utf8");
const externalLinks = new Set();
let localReferences = 0;
let anchorReferences = 0;
assert.equal(receipt.publicHouse, "nexah.de");
assert.equal(receipt.sourceAuthority, "NEXAH Science Desk / Science Lab");
assert.match(receipt.sourceRevision, /^[0-9a-f]{40}$/);
assert.match(index, /<title>NEXAH Science · Forschungsstand<\/title>/);
assert.match(index, /NEXAH Science · aktueller Forschungsstand/);
assert.doesNotMatch(index, /a0-context-navigation\.(?:css|js)/);
assert.match(index, /class="a0-public-nav"/);
assert.doesNotMatch(index, /github\.com\/Scarabaeus1031\/NEXAH-Science-Lab/);

for (const page of receipt.pages) {
  const html = fs.readFileSync(path.join(output, page), "utf8");
  assert.doesNotMatch(html, /a0-context-navigation\.(?:css|js)/, `${page} leaks the private A0 shell`);
  assert.doesNotMatch(html, /A0_RESEARCH_DESK\.html|A0_BUILDER_DESK\.html|MISSION CONTROL/, `${page} leaks a private authority surface`);
}

const mathfield = fs.readFileSync(path.join(output, "A0_MATHEMATICAL_JOINTS.html"), "utf8");
assert.match(mathfield, /class="a0-public-top"/);
assert.match(mathfield, /class="a0-public-nav"/);
assert.doesNotMatch(mathfield, /<header\b[^>]*class="top"/);
assert.doesNotMatch(mathfield, /href="[^"]*github\.com[^"]*"/);
assert.match(mathfield, /aria-disabled="true" data-public-boundary="source-not-exported">Blue-Body-Anwendung öffnen/);
assert.match(mathfield, /aria-disabled="true" data-public-boundary="source-not-exported">Coupled Channel · Boundary Lens öffnen/);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const page of ["index.html", ...receipt.pages]) {
  const html = fs.readFileSync(path.join(output, page), "utf8");
  for (const match of html.matchAll(/\b(href|src|poster|data)\s*=\s*["']([^"']+)["']/gi)) {
    const attribute = match[1].toLowerCase();
    const raw = match[2].replace(/&amp;/g, "&");
    if (!raw || /^(?:data|mailto|tel|javascript):/i.test(raw)) continue;
    const url = new URL(raw, `https://public.invalid/${page}`);
    if (url.hostname !== "public.invalid") {
      externalLinks.add(url.href);
      continue;
    }

    let relative = decodeURIComponent(url.pathname.replace(/^\//, ""));
    if (!relative || relative.endsWith("/")) relative += "index.html";
    const target = path.resolve(output, relative);
    assert.ok(target === output || target.startsWith(`${output}${path.sep}`), `${page} escapes export root: ${raw}`);
    assert.ok(fs.existsSync(target), `${page} has missing local target: ${raw} -> ${relative}`);
    localReferences += 1;

    if (attribute === "href" && url.hash && /\.html?$/i.test(relative)) {
      const fragment = decodeURIComponent(url.hash.slice(1));
      const targetHtml = fs.readFileSync(target, "utf8");
      const fragmentPattern = new RegExp(`\\b(?:id|name)=["']${escapeRegExp(fragment)}["']`);
      assert.match(targetHtml, fragmentPattern, `${page} has missing anchor: ${raw}`);
      anchorReferences += 1;
    }
  }
}

console.log(JSON.stringify({
  status: "PASS",
  pages: receipt.pages.length,
  files: receipt.files.length,
  localReferences,
  anchorReferences,
  externalLinks: externalLinks.size
}, null, 2));
if (process.env.A0_LINK_REPORT === "1") console.log([...externalLinks].sort().join("\n"));
