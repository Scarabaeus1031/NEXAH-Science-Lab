"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
assert.match(html, /Drei Einstiege · ein A0/);
assert.match(html, /id="arkade-tool"[\s\S]*?A0_BUILDER_TOY_STORE\.html#story-bridge/);
assert.match(html, /Die NEXAH ARKADE ist ein A0-Werkzeug/);
assert.match(html, /Das Spiel illustriert die Fragen; es ersetzt weder Beleg noch Erklärung/);
assert.match(html, /\.entry-route\.play/);
console.log("PASS a0-arkade-a0-story-tests");
