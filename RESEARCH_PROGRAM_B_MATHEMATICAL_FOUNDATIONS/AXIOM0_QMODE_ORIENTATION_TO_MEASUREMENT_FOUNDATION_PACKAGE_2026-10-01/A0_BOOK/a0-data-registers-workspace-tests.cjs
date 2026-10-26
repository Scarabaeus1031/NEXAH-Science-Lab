const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "A0_DATA_AND_REGISTERS.html"), "utf8");

assert.match(html, /class="a0-desk-trinity local-only"/);
assert.match(html, /href="A0_DATA_AND_REGISTERS\.html" aria-current="page"/);
assert.match(html, /href="A0_RESEARCH_DESK\.html#desk-cabinet"/);
assert.match(html, /href="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/10%20NEXAH%20CORE\/NEXAH\/BUILDER\/B0_BUILDER_DECK\/index\.html"/);
assert.match(html, /href="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/00%20EXECUTIVE\/NEXAH-Mission-Control\/INTERNAL_NAVIGATOR\/index\.html"/);
assert.match(html, />Science Desk</);
assert.match(html, />Builder Desk</);
assert.match(html, />Mission Control</);

console.log("A0 data/registers workspace navigation tests passed.");
