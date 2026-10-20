"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "a0-public-arkade-index.html"), "utf8");

assert.match(html, /id="arkade"/);
assert.doesNotMatch(html, /id="human"/);
assert.match(html, /NEXAH-Science-Lab\/book\/index\.html#arkade-tool">NEXAH · A0/);
assert.match(html, /BUILDER TOOL · ARKADE · 3 ONLINE/);
assert.match(html, /Zurück zur A0-Geschichte/);
for (const world of ["life", "domains", "numbers"]) {
  assert.match(html, new RegExp(`data-world="${world}"[\\s\\S]*?world=${world}`));
}

assert.doesNotMatch(html, /data-world="mobile"|OPEN SLOT|Coming after playtest/, 'no reserved mobile-game placeholder');
assert.equal((html.match(/class="arkade-cabinet" data-world=/g)||[]).length,3,'three playable cabinets only');
console.log("PASS a0-public-arkade-index-tests");
