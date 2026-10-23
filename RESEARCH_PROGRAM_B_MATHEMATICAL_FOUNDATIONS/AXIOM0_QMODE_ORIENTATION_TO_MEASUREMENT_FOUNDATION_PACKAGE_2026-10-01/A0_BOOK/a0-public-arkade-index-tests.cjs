"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "a0-public-arkade-index.html"), "utf8");

assert.match(html, /id="arkade"/);
assert.doesNotMatch(html, /id="human"/);
assert.match(html, /class="arkade-close" data-a0-return href="A0_NEXAH_APERTURE_JOURNEY\.html#human-route"/);
assert.match(html, /A0<\/a><i>\/<\/i><a href="A0_NEXAH_APERTURE_JOURNEY\.html#human-route">HUMAN VIEW<\/a><i>\/<\/i><strong>ARKADE/);
assert.match(html, /new URL\(document\.referrer\)\.origin===location\.origin/);
assert.match(html, /history\.back\(\)/);
assert.match(html, /BUILDER TOOL · ARKADE · 3 WORLDS \+ 1 PULSE/);
assert.match(html, /A0_NEXAH_APERTURE_JOURNEY\.html#human-route">Human View/);
assert.match(html, /class="arkade-headliner" data-world="pulse"[\s\S]*?world=pulse#pulse/);
assert.match(html, /3 worlds · 1 pulse/);
for (const world of ["life", "domains", "numbers"]) {
  assert.match(html, new RegExp(`data-world="${world}"[\\s\\S]*?world=${world}`));
}

assert.doesNotMatch(html, /data-world="mobile"|OPEN SLOT|Coming after playtest/, 'no reserved mobile-game placeholder');
assert.equal((html.match(/class="arkade-cabinet" data-world=/g)||[]).length,3,'three playable cabinets only');
console.log("PASS a0-public-arkade-index-tests");
